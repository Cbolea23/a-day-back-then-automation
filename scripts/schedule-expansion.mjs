#!/usr/bin/env node
/**
 * Master Expansion Cross-Platform Scheduler
 * 
 * Schedules the 92 Expansion Shorts across Facebook Reels and YouTube Shorts
 * spaced out 3 per day at peak hours:
 *   - Slot 1: 11:00 AM UTC+8 (03:00 UTC)
 *   - Slot 2: 05:00 PM UTC+8 (09:00 UTC)
 *   - Slot 3: 09:00 PM UTC+8 (13:00 UTC)
 * Starting October 24, 2026 onwards through late November 2026
 * (right after the foundational batch completes on Oct 23).
 * 
 * Usage:
 *   node scripts/schedule-expansion.mjs [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ALL_EXPANSION_SLUGS } from "./render-all-expansion.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isDryRun = process.argv.includes("--dry-run");

// Slots in UTC+8 (Local time):
// Slot 1: 11:00 AM UTC+8 -> 03:00 UTC
// Slot 2: 05:00 PM UTC+8 -> 09:00 UTC
// Slot 3: 09:00 PM UTC+8 -> 13:00 UTC
const SLOTS_UTC_HOURS = [3, 9, 13];

// Start scheduling on October 24, 2026 (right after foundational batch completes on Oct 23)
const startDate = new Date(Date.UTC(2026, 9, 24, 0, 0, 0)); // month 9 = October: right after the foundational batch completes on Oct 23

// Guard: videos that finish rendering after their slot passed must never be
// scheduled in the past — publish them ASAP instead, spread ~1h apart.
let asapOffsetMs = 10 * 60 * 1000;
function resolveTargetDate(planned) {
  if (planned.getTime() > Date.now() - 60000) return planned;
  const target = new Date(Date.now() + asapOffsetMs);
  asapOffsetMs += 65 * 60 * 1000;
  return target;
}

const schedulePlan = [];
let dayOffset = 0;
let slotIndex = 0;

for (const slug of ALL_EXPANSION_SLUGS) {
  const planned = new Date(Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate() + dayOffset,
    SLOTS_UTC_HOURS[slotIndex],
    0,
    0
  ));
  const targetDate = resolveTargetDate(planned);

  schedulePlan.push({
    slug,
    isoString: targetDate.toISOString(),
    displayLocal: `${targetDate.getUTCFullYear()}-${String(targetDate.getUTCMonth() + 1).padStart(2, "0")}-${String(targetDate.getUTCDate()).padStart(2, "0")} Slot ${slotIndex + 1}`
  });

  slotIndex++;
  if (slotIndex >= SLOTS_UTC_HOURS.length) {
    slotIndex = 0;
    dayOffset++;
  }
}

console.log("\n========================================================");
console.log(`   Expansion Scheduled Release Plan (${schedulePlan.length} Videos)`);
console.log("========================================================");
console.log(`Start Date: ${schedulePlan[0].isoString} (${schedulePlan[0].displayLocal})`);
console.log(`End Date:   ${schedulePlan[schedulePlan.length - 1].isoString} (${schedulePlan[schedulePlan.length - 1].displayLocal})`);
console.log("========================================================\n");

if (isDryRun) {
  for (const p of schedulePlan) {
    console.log(`• ${p.slug.padEnd(35)} -> ${p.isoString} (${p.displayLocal})`);
  }
  console.log("\nDry run complete. Exiting.");
  process.exit(0);
}

// Load existing published logs to avoid duplicate uploads
const fbPublishedFile = path.join(root, "published-urls-facebook.json");
const ytPublishedFile = path.join(root, "published-urls.json");

const fbPublished = fs.existsSync(fbPublishedFile) ? JSON.parse(fs.readFileSync(fbPublishedFile, "utf8")) : {};
const ytPublished = fs.existsSync(ytPublishedFile) ? JSON.parse(fs.readFileSync(ytPublishedFile, "utf8")) : {};

// Filter to videos that have been rendered and exist in vault or published
function getVideoFile(slug) {
  const cands = [
    path.join(root, "out", "2 - Unpublished Vault", `${slug}.mp4`),
    path.join(root, "out", "1 - Published", `${slug}.mp4`),
    path.join(root, "out", `${slug}.mp4`)
  ];
  return cands.find(f => fs.existsSync(f) && fs.statSync(f).size > 500000);
}

// 1. Facebook Reels
console.log("1. Scheduling to Facebook Page Reels...");
let fbScheduledCount = 0;
for (let i = 0; i < schedulePlan.length; i++) {
  const p = schedulePlan[i];
  if (fbPublished[p.slug]) {
    continue;
  }
  const videoFile = getVideoFile(p.slug);
  if (!videoFile) {
    // Video hasn't been rendered yet, skip for now
    continue;
  }

  console.log(`\n[${i + 1}/${schedulePlan.length}] Uploading to Facebook: ${p.slug} (${p.displayLocal})...`);
  const fbRes = spawnSync(
    process.execPath,
    [path.join("scripts", "upload-facebook.mjs"), p.slug, "--schedule", p.isoString],
    { cwd: root, stdio: "inherit" }
  );
  if (fbRes.status === 0) {
    fbScheduledCount++;
  } else {
    console.warn(`⚠️ Facebook schedule failed for ${p.slug}`);
  }
}
console.log(`\nFacebook Scheduling Progress: ${fbScheduledCount} new videos scheduled.`);

// 2. YouTube Shorts
console.log("\n2. Scheduling to YouTube Shorts...");
let ytScheduledCount = 0;
let ytQuotaHit = false;
for (let i = 0; i < schedulePlan.length; i++) {
  if (ytQuotaHit) break;
  const p = schedulePlan[i];
  if (ytPublished[p.slug]) {
    continue;
  }
  const videoFile = getVideoFile(p.slug);
  if (!videoFile) {
    continue;
  }

  console.log(`\n[${i + 1}/${schedulePlan.length}] Uploading to YouTube: ${p.slug} (${p.displayLocal})...`);
  const ytRes = spawnSync(
    process.execPath,
    [path.join("scripts", "upload-youtube.mjs"), p.slug, "--schedule", p.isoString],
    { cwd: root, stdio: "inherit" }
  );
  if (ytRes.status === 0) {
    ytScheduledCount++;
  } else {
    console.warn(`⚠️ YouTube API quota reached or failed on ${p.slug}. Skipping remaining YouTube uploads.`);
    ytQuotaHit = true;
  }
}
console.log(`\nYouTube Scheduling Progress: ${ytScheduledCount} new videos scheduled.`);

console.log("\n========================================================");
console.log("   Expansion Batch Scheduling Run Complete! 🎉");
console.log("========================================================");

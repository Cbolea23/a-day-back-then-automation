#!/usr/bin/env node
/**
 * Master Cross-Platform Scheduler
 * 
 * Schedules Shorts across Facebook Reels and YouTube Shorts
 * spaced out 2-3 per day at peak hours (11:00 AM, 5:00 PM, 9:00 PM UTC+8),
 * starting October 12, 2026 through October 23, 2026 (expansion batch takes
 * over on October 24).
 * 
 * Usage:
 *   node scripts/schedule-all.mjs [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultDir = path.join(root, "out", "2 - Unpublished Vault");
const isDryRun = process.argv.includes("--dry-run");

const BATCH_SLUGS = [
  "aztec-market-day",
  "barber-surgeon-job",
  "byzantine-chariot-fan",
  "castle-toilets",
  "chinampa-farmer-day",
  "dark-ages-myths",
  "edo-merchant-vs-samurai",
  "gold-rush-miner-day",
  "han-china-farmer-day",
  "inca-runner-job",
  "maya-scribe-job",
  "medieval-bath-myths",
  "medieval-fast-days",
  "medieval-miller-job",
  "medieval-village-vs-city",
  "medieval-wages-and-prices",
  "mesopotamia-scribe-school",
  "mongol-steppe-day",
  "ninja-myths",
  "ottoman-coffeehouse",
  "pirate-myths",
  "pirate-ship-day",
  "plague-quarantine-city",
  "renaissance-apprentice-day",
  "roman-morning",
  "samurai-day",
  "silk-road-merchant",
  "tudor-kitchen-boy",
  "victorian-chimney-sweep-job",
  "victorian-factory-day",
  "viking-farmer-day",
  "viking-food-and-drink",
  "viking-myths",
  "viking-ocean-voyage",
  "wwii-ration-day"
];

console.log(`Scheduling ${BATCH_SLUGS.length} Shorts for cross-platform release.`);

// Slots in UTC+8 (Local time):
// Slot 1: 11:00 AM UTC+8 -> 03:00 UTC
// Slot 2: 05:00 PM UTC+8 -> 09:00 UTC
// Slot 3: 09:00 PM UTC+8 -> 13:00 UTC
const SLOTS_UTC_HOURS = [3, 9, 13];

// Start scheduling starting Oct 12, 2026 (today) so the page posts daily
// with no gap before the expansion batch takes over on Oct 24.
const startDate = new Date(Date.UTC(2026, 9, 12, 0, 0, 0)); // month 9 = October: start today so the page posts daily with no gap before the expansion batch

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

for (const slug of BATCH_SLUGS) {
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
    displayLocal: `${targetDate.getUTCFullYear()}-${String(targetDate.getUTCMonth() + 1).padStart(2, "0")}-${String(targetDate.getUTCDate()).padStart(2, "0")} slot ${slotIndex + 1}`
  });

  slotIndex++;
  if (slotIndex >= SLOTS_UTC_HOURS.length) {
    slotIndex = 0;
    dayOffset++;
  }
}

console.log("\n========================================================");
console.log(`   Cross-Platform Scheduled Release Plan (${schedulePlan.length} Videos)`);
console.log("========================================================");
for (const p of schedulePlan) {
  console.log(`• ${p.slug.padEnd(28)} -> ${p.isoString}`);
}
console.log("========================================================\n");

if (isDryRun) {
  console.log("Dry run complete. Exiting.");
  process.exit(0);
}

// Load existing published logs to avoid duplicate uploads
const fbPublishedFile = path.join(root, "published-urls-facebook.json");
const ytPublishedFile = path.join(root, "published-urls.json");

const fbPublished = fs.existsSync(fbPublishedFile) ? JSON.parse(fs.readFileSync(fbPublishedFile, "utf8")) : {};
const ytPublished = fs.existsSync(ytPublishedFile) ? JSON.parse(fs.readFileSync(ytPublishedFile, "utf8")) : {};

// Execute scheduling for Facebook first (guaranteed cloud schedule)
console.log("1. Scheduling to Facebook Page Reels...");
for (let i = 0; i < schedulePlan.length; i++) {
  const p = schedulePlan[i];
  if (fbPublished[p.slug]) {
    console.log(`[${i + 1}/${schedulePlan.length}] ⏭️  Skipping Facebook for ${p.slug} (already scheduled/published: ${fbPublished[p.slug].videoId || fbPublished[p.slug].url})`);
    continue;
  }
  console.log(`\n[${i + 1}/${schedulePlan.length}] Uploading to Facebook: ${p.slug}...`);
  const fbRes = spawnSync(
    process.execPath,
    [path.join("scripts", "upload-facebook.mjs"), p.slug, "--schedule", p.isoString],
    {cwd: root, stdio: "inherit"}
  );
  if (fbRes.status !== 0) {
    console.warn(`⚠️ Facebook schedule failed for ${p.slug}`);
  }
}

console.log("\n2. Scheduling to YouTube Shorts...");
let ytQuotaHit = false;
for (let i = 0; i < schedulePlan.length; i++) {
  if (ytQuotaHit) break;
  const p = schedulePlan[i];
  if (ytPublished[p.slug]) {
    console.log(`[${i + 1}/${schedulePlan.length}] ⏭️  Skipping YouTube for ${p.slug} (already scheduled/published: ${ytPublished[p.slug].videoId || ytPublished[p.slug].url})`);
    continue;
  }
  console.log(`\n[${i + 1}/${schedulePlan.length}] Uploading to YouTube: ${p.slug}...`);
  const ytRes = spawnSync(
    process.execPath,
    [path.join("scripts", "upload-youtube.mjs"), p.slug, "--schedule", p.isoString],
    {cwd: root, stdio: "inherit"}
  );
  if (ytRes.status !== 0) {
    console.warn(`⚠️ YouTube API quota reached or failed on ${p.slug}.`);
    ytQuotaHit = true;
  }
}

console.log("\n========================================================");
console.log("   Batch Scheduling Run Complete! 🎉");
console.log("========================================================");

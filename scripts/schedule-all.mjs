#!/usr/bin/env node
/**
 * Master Cross-Platform Scheduler
 * 
 * Schedules Shorts across Facebook Reels and YouTube Shorts
 * spaced out 2-3 per day at peak hours (11:00 AM, 5:00 PM, 9:00 PM UTC+8).
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

if (!fs.existsSync(vaultDir)) {
  console.log("No Unpublished Vault directory found.");
  process.exit(0);
}

const files = fs.readdirSync(vaultDir).filter((f) => f.endsWith(".mp4") && !f.startsWith("long-"));

if (files.length === 0) {
  console.log("No unpublished Shorts found in out/2 - Unpublished Vault.");
  process.exit(0);
}

console.log(`Found ${files.length} unpublished Shorts in vault.`);

// Slots in UTC+8 (Local time):
// Slot 1: 11:00 AM UTC+8 -> 03:00 UTC
// Slot 2: 05:00 PM UTC+8 -> 09:00 UTC
// Slot 3: 09:00 PM UTC+8 -> 13:00 UTC
const SLOTS_UTC_HOURS = [3, 9, 13];

// Start scheduling starting tomorrow (Oct 10, 2026)
const startDate = new Date();
startDate.setDate(startDate.getDate() + 1);

const schedulePlan = [];
let dayOffset = 0;
let slotIndex = 0;

for (const file of files) {
  const slug = file.replace(/\.mp4$/, "");
  const targetDate = new Date(Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate() + dayOffset,
    SLOTS_UTC_HOURS[slotIndex],
    0,
    0
  ));

  schedulePlan.push({
    slug,
    file,
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
console.log("   Cross-Platform Scheduled Release Plan (15 Videos)");
console.log("========================================================");
for (const p of schedulePlan) {
  console.log(`• ${p.slug.padEnd(28)} -> ${p.isoString}`);
}
console.log("========================================================\n");

if (isDryRun) {
  console.log("Dry run complete. Exiting.");
  process.exit(0);
}

// Execute scheduling for Facebook first (guaranteed cloud schedule)
console.log("1. Scheduling to Facebook Page Reels...");
for (let i = 0; i < schedulePlan.length; i++) {
  const p = schedulePlan[i];
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

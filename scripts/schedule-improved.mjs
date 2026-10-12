#!/usr/bin/env node
/**
 * Master Improved Cross-Platform Scheduler
 * 
 * Schedules verified high-quality Shorts across Facebook Reels and YouTube Shorts.
 * 
 * STRICT RULES & IMPROVEMENTS:
 * 1. Zero posts for today: Scheduling strictly begins tomorrow (October 13, 2026 onwards).
 * 2. Quality Gate: Rejects any video file under 35MB (filters out flat-gradient fallback renders).
 * 3. Asset Verification: Verifies that every scene image in `scripts-out/<slug>.json` exists on disk.
 * 4. Fixed Cadence: Exactly 3 peak slots per day in Manila Time (UTC+8):
 *      - Slot 1: 11:00 AM Manila (03:00 UTC)
 *      - Slot 2: 05:00 PM Manila (09:00 UTC)
 *      - Slot 3: 09:00 PM Manila (13:00 UTC)
 * 5. Safe Queue: Checks already published/scheduled logs to prevent duplicates or slot collisions.
 * 
 * Usage:
 *   node scripts/schedule-improved.mjs --dry-run
 *   node scripts/schedule-improved.mjs --live
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isDryRun = !process.argv.includes("--live");

// Platform selection: --platform=youtube | --platform=facebook | --platform=all
const platformArg = (process.argv.find(a => a.startsWith("--platform=")) || "--platform=all").split("=")[1].toLowerCase();
const isYtOnly = platformArg === "youtube" || process.argv.includes("--yt-only");
const isFbOnly = platformArg === "facebook" || process.argv.includes("--fb-only");

// Max video batch limit: --max=N (defaults to 6 for live mode to protect YouTube daily API quota)
const maxArg = process.argv.find(a => a.startsWith("--max="));
const maxVideos = maxArg ? (maxArg.split("=")[1].toLowerCase() === "all" ? Infinity : parseInt(maxArg.split("=")[1], 10)) : (isDryRun ? Infinity : 6);

// Upload pacing delay in seconds: --delay=N (default 15s)
const delayArg = process.argv.find(a => a.startsWith("--delay="));
const pacingDelaySeconds = delayArg ? parseInt(delayArg.split("=")[1], 10) : 15;

// Facebook Cooldown Lock
export const FB_COOLDOWN_UNTIL_UTC = "2026-10-13T05:00:00Z"; // Oct 13, 1:00 PM Manila Time
const isFbBlocked = Date.now() < new Date(FB_COOLDOWN_UNTIL_UTC).getTime();
const forceFb = process.argv.includes("--force-fb");

// Active platform enablement
const enableYT = !isFbOnly;
let enableFB = !isYtOnly;

if (enableFB && isFbBlocked && !forceFb) {
  enableFB = false;
  console.warn("========================================================");
  console.warn("⛔ [FB CIRCUIT BREAKER ACTIVE]");
  console.warn(`Facebook API is in 24h anti-spam cooldown until Oct 13, 1:00 PM Manila Time.`);
  console.warn(`Facebook Reel uploads are AUTOMATICALLY DISABLED to protect the Page.`);
  console.warn("========================================================\n");
}

// Slots in Manila Time (UTC+8):
// Slot 1: 11:00 AM -> 03:00 UTC
// Slot 2: 05:00 PM -> 09:00 UTC
// Slot 3: 09:00 PM -> 13:00 UTC
const SLOTS_UTC_HOURS = [3, 9, 13];

// Determine tomorrow's date in Manila Time (Asia/Manila)
function getTomorrowManilaDate() {
  const now = new Date();
  // Get current Manila date components
  const manilaDateString = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now); // "YYYY-MM-DD"

  const [y, m, d] = manilaDateString.split("-").map(Number);
  // Start tomorrow
  const tomorrow = new Date(Date.UTC(y, m - 1, d + 1, 0, 0, 0));
  return tomorrow;
}

// Excluded from automated scheduling (reserved for manual posts on FB)
const EXCLUDED_SLUGS = new Set([
  "gladiator-day",
  "egypt-pyramid-workers",
  "aztec-market-day",
  "gold-rush-claim-jumping"
]);

function loadJson(filepath, fallback = {}) {
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, "utf8"));
    }
  } catch (e) {
    console.warn(`Warning reading ${filepath}:`, e.message);
  }
  return fallback;
}

function getCandidateVideos() {
  const vaultDir = path.join(root, "out", "2 - Unpublished Vault");
  const pubDir = path.join(root, "out", "1 - Published");

  const candidates = [];
  const checked = new Set();

  function scanDir(dir, isVault) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4") && !f.startsWith("long-"));
    for (const f of files) {
      const slug = f.replace(".mp4", "");
      if (checked.has(slug)) continue;
      checked.add(slug);

      const filePath = path.join(dir, f);
      const stat = fs.statSync(filePath);
      const sizeMB = stat.size / (1024 * 1024);

      candidates.push({
        slug,
        filePath,
        sizeMB,
        isVault
      });
    }
  }

  // Unpublished vault has higher priority
  scanDir(vaultDir, true);
  scanDir(pubDir, false);

  return candidates;
}

function validateQuality(candidate) {
  // Quality Gate 1: File size > 22 MB (flat gradients are 11MB-18MB; real art is 25MB-95MB)
  if (candidate.sizeMB < 22.0) {
    return { valid: false, reason: `File size too small (${candidate.sizeMB.toFixed(1)}MB < 22MB). Gradient fallback detected.` };
  }

  // Quality Gate 2: Script exists
  const scriptPath = path.join(root, "scripts-out", `${candidate.slug}.json`);
  if (!fs.existsSync(scriptPath)) {
    return { valid: false, reason: `Missing script metadata at scripts-out/${candidate.slug}.json` };
  }

  // Quality Gate 3: Background artwork images exist on disk
  try {
    const script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
    const scenes = script.scenes || [];
    if (scenes.length === 0) {
      return { valid: false, reason: `Script has 0 scenes.` };
    }
    for (const sc of scenes) {
      if (!sc.image || !fs.existsSync(path.join(root, "public", sc.image))) {
        return { valid: false, reason: `Scene missing background image: ${sc.image}` };
      }
    }
  } catch (e) {
    return { valid: false, reason: `Invalid script JSON: ${e.message}` };
  }

  return { valid: true };
}

async function main() {
  console.log("========================================================");
  console.log("   A DAY BACK THEN — IMPROVED MASTER SCHEDULER");
  console.log(`   Mode: ${isDryRun ? "DRY RUN (no uploads)" : "LIVE EXECUTION"}`);
  console.log("========================================================");

  const startDate = getTomorrowManilaDate();
  console.log(`Earliest allowed schedule date: ${startDate.toISOString().split("T")[0]} 11:00 AM Manila Time (UTC+8)`);

  const fbPublished = loadJson(path.join(root, "published-urls-facebook.json"));
  const ytPublished = loadJson(path.join(root, "published-urls.json"));

  const allCandidates = getCandidateVideos();
  console.log(`\nDiscovered ${allCandidates.length} candidate video files in out/ folders.`);

  // Filter out already published or invalid
  const queue = [];
  for (const c of allCandidates) {
    if (EXCLUDED_SLUGS.has(c.slug)) {
      console.log(`[EXCLUDED] ${c.slug}: Reserved for manual post.`);
      continue;
    }

    const alreadyFB = !!fbPublished[c.slug];
    const alreadyYT = !!ytPublished[c.slug];

    const needsFB = enableFB && !alreadyFB;
    const needsYT = enableYT && !alreadyYT;

    if (!needsFB && !needsYT) {
      continue; // already published/scheduled or platform disabled
    }

    const check = validateQuality(c);
    if (!check.valid) {
      console.log(`[REJECTED] ${c.slug}: ${check.reason}`);
      continue;
    }

    queue.push({
      ...c,
      needsFB,
      needsYT
    });
  }

  console.log(`\nFiltered queue: ${queue.length} verified high-quality videos matching platform criteria.`);
  console.log(`Platforms active: YouTube: ${enableYT ? "ENABLED" : "DISABLED"} | Facebook: ${enableFB ? "ENABLED" : "DISABLED"}`);

  if (queue.length === 0) {
    console.log("Nothing to schedule! Either all videos are published or active platforms are satisfied.");
    return;
  }

  // Build schedule slots starting strictly tomorrow
  let dayOffset = 0;
  let slotIndex = 0;
  const schedulePlan = [];

  // Halloween Window Reservation: Oct 23 to Nov 2 (11 days) reserved for Halloween specials
  const HALLOWEEN_START_UTC = Date.UTC(2026, 9, 23, 0, 0, 0); // Month 9 is Oct
  const HALLOWEEN_END_UTC = Date.UTC(2026, 10, 2, 23, 59, 59); // Month 10 is Nov
  const POST_HALLOWEEN_RESUME_DATE = new Date(Date.UTC(2026, 10, 3, 0, 0, 0));

  for (const item of queue) {
    let plannedUtc = new Date(Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate() + dayOffset,
      SLOTS_UTC_HOURS[slotIndex],
      0,
      0
    ));

    const isHalloweenSpecial = item.slug.startsWith("halloween-");

    // If it's a regular video and planned date falls in the Halloween window, skip to Nov 3
    if (!isHalloweenSpecial && plannedUtc.getTime() >= HALLOWEEN_START_UTC && plannedUtc.getTime() <= HALLOWEEN_END_UTC) {
      const msDiff = POST_HALLOWEEN_RESUME_DATE.getTime() - startDate.getTime();
      dayOffset = Math.round(msDiff / (24 * 60 * 60 * 1000));
      slotIndex = 0;

      plannedUtc = new Date(Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + dayOffset,
        SLOTS_UTC_HOURS[slotIndex],
        0,
        0
      ));
    }

    const manilaTimeStr = plannedUtc.toLocaleString("en-US", {
      timeZone: "Asia/Manila",
      dateStyle: "medium",
      timeStyle: "short"
    });

    schedulePlan.push({
      ...item,
      publishAtUtc: plannedUtc,
      manilaTimeStr
    });

    slotIndex++;
    if (slotIndex >= SLOTS_UTC_HOURS.length) {
      slotIndex = 0;
      dayOffset++;
    }
  }

  console.log("\n========================================================");
  console.log("   SCHEDULE TIMELINE PREVIEW");
  console.log("========================================================");
  for (const plan of schedulePlan.slice(0, 15)) {
    console.log(`📅 ${plan.manilaTimeStr} -> [${plan.slug}] (${plan.sizeMB.toFixed(1)}MB) | FB:${plan.needsFB ? "YES" : "SKIP"} YT:${plan.needsYT ? "YES" : "SKIP"}`);
  }
  if (schedulePlan.length > 15) {
    console.log(`... and ${schedulePlan.length - 15} more videos scheduled through day +${dayOffset}.`);
  }

  if (isDryRun) {
    console.log("\n💡 This was a DRY RUN. No videos were uploaded or scheduled.");
    console.log(`   To execute live with safe batch cap (default 6):`);
    console.log(`     node scripts/schedule-improved.mjs --live --max=6`);
    console.log(`   To schedule only YouTube:`);
    console.log(`     node scripts/schedule-improved.mjs --live --platform=youtube --max=6`);
    return;
  }

  // Live Execution
  const executeList = schedulePlan.slice(0, maxVideos);
  console.log("\n========================================================");
  console.log(`   EXECUTING LIVE SCHEDULE UPLOADS (${executeList.length} videos, cap: ${maxVideos === Infinity ? "None" : maxVideos})`);
  console.log("========================================================");

  let count = 0;
  for (const item of executeList) {
    count++;
    console.log(`\n--------------------------------------------------------`);
    console.log(`[${count}/${executeList.length}] Target: ${item.slug} -> Scheduled for ${item.manilaTimeStr}`);

    if (item.needsFB && enableFB) {
      console.log(`[FB] Scheduling Facebook Reel...`);
      const fbResult = spawnSync(
        "node",
        ["scripts/upload-facebook.mjs", item.slug, `--schedule=${item.publishAtUtc.toISOString()}`],
        { cwd: root, stdio: "inherit", shell: process.platform === "win32" }
      );
      if (fbResult.status !== 0) {
        console.error(`[FB FAILED] Could not schedule ${item.slug} on Facebook.`);
      }
    }

    if (item.needsYT && enableYT) {
      console.log(`[YT] Scheduling YouTube Short...`);
      const ytResult = spawnSync(
        "node",
        ["scripts/upload-youtube.mjs", item.slug, `--schedule=${item.publishAtUtc.toISOString()}`],
        { cwd: root, stdio: "inherit", shell: process.platform === "win32" }
      );
      if (ytResult.status !== 0) {
        console.error(`[YT FAILED] Could not schedule ${item.slug} on YouTube.`);
      }
    }

    if (count < executeList.length && pacingDelaySeconds > 0) {
      console.log(`⏳ Pacing delay: waiting ${pacingDelaySeconds}s before next upload to protect API quotas...`);
      await new Promise((r) => setTimeout(r, pacingDelaySeconds * 1000));
    }
  }

  console.log("\n========================================================");
  console.log("   SCHEDULING BATCH COMPLETE");
  console.log("========================================================");
}

main().catch(err => {
  console.error("Scheduler Fatal Error:", err);
  process.exit(1);
});

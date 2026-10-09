#!/usr/bin/env node
/**
 * Automated TikTok 2-Per-Day Scheduler & Safe Runner
 *
 * Enforces strict 2-videos-per-day posting limit to prevent
 * algorithmic spam flagging and 0-view locks.
 *
 * Rules:
 *   - Maximum 2 uploads per calendar day.
 *   - Minimum 6 hours gap between uploads.
 *   - Tracks history in published-urls-tiktok.json.
 *
 * Usage:
 *   node scripts/upload-tiktok-queue.mjs          # Checks today's quota and uploads next eligible video
 *   node scripts/upload-tiktok-queue.mjs --force  # Bypasses daily limit if explicitly requested
 *   node scripts/upload-tiktok-queue.mjs --status # Shows today's upload count and last upload time
 */

import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {uploadVideo} from "./upload-tiktok.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const historyFile = path.join(root, "published-urls-tiktok.json");
const vaultDir = path.join(root, "out", "1 - Published"); // Available published vault videos to pick from
const maxPerDay = 2;
const minHoursGap = 6;

function getHistory() {
  if (!fs.existsSync(historyFile)) {
    return [];
  }
  try {
    const raw = JSON.parse(fs.readFileSync(historyFile, "utf8"));
    return Array.isArray(raw) ? raw : Object.values(raw);
  } catch {
    return [];
  }
}

function recordHistory(slug) {
  const history = getHistory();
  history.push({
    slug,
    uploadedAt: new Date().toISOString(),
  });
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

function getTodayUploads() {
  const history = getHistory();
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  return history.filter((item) => new Date(item.uploadedAt).getTime() >= startOfDay);
}

function getLastUploadTime() {
  const history = getHistory();
  if (history.length === 0) return null;
  return new Date(history[history.length - 1].uploadedAt);
}

async function runSafeQueue() {
  const isForce = process.argv.includes("--force");
  const isStatus = process.argv.includes("--status");

  const todayUploads = getTodayUploads();
  const lastUpload = getLastUploadTime();

  console.log("========================================================");
  console.log("   TikTok Safe Automation (2 Videos Per Day)");
  console.log("========================================================");
  console.log(`Uploaded today: ${todayUploads.length} / ${maxPerDay} allowed`);
  if (lastUpload) {
    const hoursSince = ((Date.now() - lastUpload.getTime()) / (1000 * 60 * 60)).toFixed(1);
    console.log(`Last upload:    ${lastUpload.toLocaleString()} (${hoursSince}h ago)`);
  } else {
    console.log(`Last upload:    None recorded`);
  }
  console.log("--------------------------------------------------------");

  if (isStatus) {
    return;
  }

  // Check 1: Daily limit
  if (todayUploads.length >= maxPerDay && !isForce) {
    console.log(`🛑 Daily limit reached (${todayUploads.length}/${maxPerDay}).`);
    console.log("   To protect the account from spam throttling, skipping upload until tomorrow.");
    console.log("   (Run with --force if you want to override).");
    return;
  }

  // Check 2: Minimum hours gap
  if (lastUpload && !isForce) {
    const hoursSince = (Date.now() - lastUpload.getTime()) / (1000 * 60 * 60);
    if (hoursSince < minHoursGap) {
      const waitHours = (minHoursGap - hoursSince).toFixed(1);
      console.log(`⏳ Cooldown active: Last video was posted ${hoursSince.toFixed(1)}h ago.`);
      console.log(`   Please wait ${waitHours} more hours before posting video #${todayUploads.length + 1}.`);
      return;
    }
  }

  // Find next video from out/ that hasn't been uploaded to TikTok yet
  const history = getHistory();
  const uploadedSlugs = new Set(history.map((h) => h.slug));

  const candidateDirs = [
    path.join(root, "out", "1 - Published"),
    path.join(root, "out", "2 - Unpublished Vault"),
    path.join(root, "out"),
  ];

  let nextSlug = null;
  for (const dir of candidateDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mp4") && !f.startsWith("long-"));
    for (const f of files) {
      const slug = f.replace(/\.mp4$/, "");
      if (!uploadedSlugs.has(slug)) {
        nextSlug = slug;
        break;
      }
    }
    if (nextSlug) break;
  }

  if (!nextSlug) {
    console.log("✓ All available Shorts have already been uploaded to TikTok!");
    return;
  }

  console.log(`\n🚀 Safe slot approved! Uploading [${todayUploads.length + 1}/${maxPerDay}]: "${nextSlug}"`);
  console.log("--------------------------------------------------------");

  try {
    await uploadVideo(nextSlug);
    recordHistory(nextSlug);
    console.log(`✓ Successfully recorded "${nextSlug}" in TikTok upload history.`);
  } catch (err) {
    console.error(`❌ Upload error on "${nextSlug}":`, err.message);
  }
}

runSafeQueue().catch((err) => {
  console.error("TikTok queue runner error:", err);
  process.exit(1);
});

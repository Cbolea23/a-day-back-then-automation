#!/usr/bin/env node
/**
 * Master Batch Render & Schedule Orchestrator
 *
 * 1. Finds all unrendered video scripts in scripts-out/ that have 100% complete assets.
 * 2. Processes them in batches of 5:
 *    - Pre-flight: Verifies all images and audio files exist.
 *    - Remotion Render: Renders into `out/2 - Unpublished Vault/<slug>.mp4`.
 *    - Post-flight QA: Verifies video size >= 35MB and frame screenshot >= 150KB (rules out flat gradients).
 *    - Approval: Marks each verified video as APPROVED in `vault-verified-batches.json`.
 * 3. Once all batches complete and pass QA:
 *    - Automatically executes `node scripts/schedule-improved.mjs --live`.
 *    - Schedules posts starting tomorrow (Oct 13, 11:00 AM Manila Time, 3/day).
 *
 * Usage:
 *   node scripts/batch-render-and-schedule.mjs
 *   node scripts/batch-render-and-schedule.mjs --batch-size=5
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultDir = path.join(root, "out", "2 - Unpublished Vault");
const pubDir = path.join(root, "out", "1 - Published");
const screenshotDir = path.join(root, "out", "3 - Screenshots");
const logFile = path.join(root, "vault-verified-batches.json");

fs.mkdirSync(vaultDir, { recursive: true });
fs.mkdirSync(screenshotDir, { recursive: true });

function getAuditLog() {
  if (fs.existsSync(logFile)) {
    try {
      return JSON.parse(fs.readFileSync(logFile, "utf8"));
    } catch {}
  }
  return { approved: [], failed: [], completedBatches: 0 };
}

function saveAuditLog(log) {
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
}

function getUnrenderedSlugs() {
  const pubFiles = new Set(
    fs.existsSync(pubDir)
      ? fs.readdirSync(pubDir).map((f) => f.replace(/\.mp4$/, ""))
      : []
  );
  const vaultFiles = new Set(
    fs.existsSync(vaultDir)
      ? fs.readdirSync(vaultDir).map((f) => f.replace(/\.mp4$/, ""))
      : []
  );

  const ignored = new Set(["all-expansion-prompts", "missing-audio-slugs"]);

  const allScripts = fs
    .readdirSync(path.join(root, "scripts-out"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .filter((slug) => !slug.startsWith("long-") && !ignored.has(slug));

  const unrendered = [];
  for (const slug of allScripts) {
    if (pubFiles.has(slug) || vaultFiles.has(slug)) continue;

    // Verify assets
    try {
      const script = JSON.parse(
        fs.readFileSync(path.join(root, "scripts-out", `${slug}.json`), "utf8")
      );
      const scenes = script.scenes || [];
      if (scenes.length === 0) continue;

      let allAssetsReady = true;
      for (const sc of scenes) {
        if (!sc.image || !fs.existsSync(path.join(root, "public", sc.image))) {
          allAssetsReady = false;
          break;
        }
        if (!sc.audio || !fs.existsSync(path.join(root, "public", sc.audio))) {
          allAssetsReady = false;
          break;
        }
      }

      if (allAssetsReady) {
        unrendered.push(slug);
      } else {
        console.warn(`[SKIP] Missing assets for ${slug}`);
      }
    } catch (e) {
      console.warn(`[SKIP] Invalid script ${slug}: ${e.message}`);
    }
  }

  return unrendered;
}

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function renderAndVerifyVideo(slug) {
  console.log(`\n--------------------------------------------------------`);
  console.log(`▶ Processing: ${slug}`);

  const scriptPath = path.join(root, "scripts-out", `${slug}.json`);
  const vaultOut = path.join(vaultDir, `${slug}.mp4`);
  const tempOut = path.join(root, "out", `${slug}.mp4`);

  if (fs.existsSync(tempOut)) try { fs.unlinkSync(tempOut); } catch {}
  if (fs.existsSync(vaultOut)) try { fs.unlinkSync(vaultOut); } catch {}

  console.log(`🎬 Rendering ${slug} with Remotion...`);
  const startTime = Date.now();
  const renderRes = spawnSync(
    "npx",
    ["remotion", "render", "src/index.ts", "Short", `out/${slug}.mp4`, `--props=scripts-out/${slug}.json`],
    { cwd: root, stdio: "inherit", shell: process.platform === "win32" }
  );

  const durationSec = Math.round((Date.now() - startTime) / 1000);

  if (renderRes.status !== 0 || !fs.existsSync(tempOut)) {
    console.error(`❌ Render failed for ${slug} after ${durationSec}s!`);
    return { slug, passed: false, reason: "Remotion render error" };
  }

  // Move to vault
  fs.renameSync(tempOut, vaultOut);
  const stat = fs.statSync(vaultOut);
  const sizeMB = stat.size / (1024 * 1024);

  console.log(`✓ Render finished in ${durationSec}s. File size: ${sizeMB.toFixed(1)} MB.`);

  // QA Gate 1: Video File Size
  if (sizeMB < 35.0) {
    console.error(`❌ QA Failed: File size ${sizeMB.toFixed(1)}MB < 35MB (gradient fallback detected)!`);
    return { slug, passed: false, reason: `File size too small: ${sizeMB.toFixed(1)}MB` };
  }

  // QA Gate 2: Screenshot Frame Audit
  const framePng = path.join(screenshotDir, `verify-${slug}.png`);
  spawnSync(
    "ffmpeg",
    ["-ss", "00:00:05", "-i", vaultOut, "-vframes", "1", "-y", framePng],
    { stdio: "ignore" }
  );

  if (!fs.existsSync(framePng)) {
    console.error(`❌ QA Failed: Frame screenshot extraction failed!`);
    return { slug, passed: false, reason: "Frame extraction failed" };
  }

  const frameSizeKB = Math.round(fs.statSync(framePng).size / 1024);
  if (frameSizeKB < 150) {
    console.error(`⚠️ QA Failed: Frame size ${frameSizeKB} KB is below 150 KB threshold (flat gradient detected)!`);
    return { slug, passed: false, reason: `Frame size too small: ${frameSizeKB} KB` };
  }

  console.log(`✅ [QA APPROVED] Artwork verified! Video: ${sizeMB.toFixed(1)}MB, Frame: ${frameSizeKB}KB.`);
  return {
    slug,
    passed: true,
    sizeMB: sizeMB.toFixed(1),
    frameKB: frameSizeKB,
    durationSec
  };
}

async function main() {
  console.log("========================================================");
  console.log("   MASTER BATCH RENDER & SCHEDULING PIPELINE");
  console.log("========================================================");

  const auditLog = getAuditLog();
  const unrendered = getUnrenderedSlugs();

  console.log(`Discovered ${unrendered.length} unrendered shorts ready for production.`);

  if (unrendered.length === 0) {
    console.log("All shorts are already rendered! Proceeding to scheduling...");
    runScheduling();
    return;
  }

  const batchSize = 5;
  const batches = chunkArray(unrendered, batchSize);
  console.log(`Organized into ${batches.length} batches of up to ${batchSize} videos.\n`);

  let totalRendered = 0;
  let totalApproved = 0;

  for (let bIndex = 0; bIndex < batches.length; bIndex++) {
    const currentBatch = batches[bIndex];
    const batchNum = bIndex + 1;

    console.log("\n========================================================");
    console.log(`   RUNNING BATCH ${batchNum}/${batches.length} (${currentBatch.length} videos)`);
    console.log(`   Topics: ${currentBatch.join(", ")}`);
    console.log("========================================================");

    const batchResults = [];
    for (const slug of currentBatch) {
      const res = await renderAndVerifyVideo(slug);
      batchResults.push(res);
      totalRendered++;
      if (res.passed) {
        totalApproved++;
        if (!auditLog.approved.includes(slug)) auditLog.approved.push(slug);
      } else {
        auditLog.failed.push({ slug, reason: res.reason, timestamp: new Date().toISOString() });
      }
      saveAuditLog(auditLog);
    }

    const batchAllPassed = batchResults.every((r) => r.passed);
    console.log("\n--------------------------------------------------------");
    if (batchAllPassed) {
      console.log(`🎉 BATCH ${batchNum}/${batches.length} COMPLETE: 100% PASSED QA & APPROVED!`);
    } else {
      console.warn(`⚠️ BATCH ${batchNum}/${batches.length} COMPLETED WITH WARNINGS.`);
    }
    console.log(`Total Progress: ${totalApproved}/${unrendered.length} approved.`);
    console.log("--------------------------------------------------------\n");
  }

  console.log("\n========================================================");
  console.log(`   ALL BATCHES COMPLETE: ${totalApproved}/${totalRendered} APPROVED IN VAULT`);
  console.log("========================================================");
  console.log("ℹ️ Rendering is decoupled from scheduling for safety.");
  console.log("To preview the schedule without uploading:");
  console.log("  node scripts/schedule-improved.mjs --dry-run");
  console.log("To safely schedule controlled batches:");
  console.log("  node scripts/schedule-improved.mjs --live --max=6 --platform=youtube");
}

main().catch((err) => {
  console.error("Fatal Pipeline Error:", err);
  process.exit(1);
});

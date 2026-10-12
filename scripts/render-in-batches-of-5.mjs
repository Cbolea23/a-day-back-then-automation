#!/usr/bin/env node
/**
 * 5-by-5 Quality Assurance Render & Verification Pipeline
 *
 * Rules:
 *   1. Processes topics strictly in batches of 5.
 *   2. Pre-flight check: Verifies all image assets exist on disk AND are linked in scripts-out.
 *   3. Renders video with Remotion.
 *   4. Post-flight QA audit: Extracts a frame at 5 seconds and checks for verified artwork (not gradient fallback).
 *   5. Only marks batch as APPROVED and ready to schedule if 5/5 pass the asset audit.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultDir = path.join(root, "out", "2 - Unpublished Vault");
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
  return { approved: [], failed: [], lastBatchIndex: 0 };
}

function saveAuditLog(log) {
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
}

export async function processBatch(slugs, batchNumber) {
  console.log("\n========================================================");
  console.log(`   RUNNING 5-VIDEO QA BATCH #${batchNumber}`);
  console.log(`   Topics: ${slugs.join(", ")}`);
  console.log("========================================================\n");

  const auditLog = getAuditLog();
  const batchResults = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    console.log(`\n--- [${i + 1}/5] Pre-flight Check: ${slug} ---`);

    // 1. Check disk images in public/images/<slug>
    const imgDir = path.join(root, "public", "images", slug);
    const diskImages = fs.existsSync(imgDir)
      ? fs.readdirSync(imgDir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
      : [];

    if (diskImages.length === 0) {
      console.error(`❌ [FAIL] Missing image assets on disk for ${slug}!`);
      batchResults.push({ slug, passed: false, reason: "No disk images in public/images" });
      continue;
    }
    console.log(`✓ Found ${diskImages.length} artwork files on disk.`);

    // 2. Ensure scripts-out JSON has image properties linked
    const scriptPath = path.join(root, "scripts-out", `${slug}.json`);
    if (!fs.existsSync(scriptPath)) {
      console.error(`❌ [FAIL] Missing script JSON for ${slug}!`);
      batchResults.push({ slug, passed: false, reason: "Missing script JSON" });
      continue;
    }

    const script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
    let missingLinks = 0;
    script.scenes.forEach((s, idx) => {
      const candidate = `images/${slug}/${idx + 1}.png`;
      if (!s.image || !fs.existsSync(path.join(root, "public", s.image))) {
        if (fs.existsSync(path.join(root, "public", candidate))) {
          s.image = candidate;
        } else {
          missingLinks++;
        }
      }
    });
    fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2));

    if (missingLinks > 0) {
      console.error(`❌ [FAIL] ${missingLinks} scenes in ${slug} are missing image files!`);
      batchResults.push({ slug, passed: false, reason: `${missingLinks} scenes missing images` });
      continue;
    }
    console.log(`✓ All ${script.scenes.length} scenes linked to verified artwork.`);

    // 3. Render video with --force
    console.log(`🎬 Rendering ${slug} with Remotion...`);
    const tempOut = path.join(root, "out", `${slug}.mp4`);
    const vaultOut = path.join(vaultDir, `${slug}.mp4`);

    if (fs.existsSync(tempOut)) try { fs.unlinkSync(tempOut); } catch {}
    if (fs.existsSync(vaultOut)) try { fs.unlinkSync(vaultOut); } catch {}

    const res = spawnSync(
      "npx",
      ["remotion", "render", "src/index.ts", "Short", `out/${slug}.mp4`, `--props=scripts-out/${slug}.json`],
      { cwd: root, stdio: "inherit", shell: process.platform === "win32" }
    );

    if (res.status !== 0 || !fs.existsSync(tempOut)) {
      console.error(`❌ [FAIL] Remotion render failed for ${slug}!`);
      batchResults.push({ slug, passed: false, reason: "Render process error" });
      continue;
    }

    // Move to vault
    fs.renameSync(tempOut, vaultOut);
    const videoSizeMB = (fs.statSync(vaultOut).size / 1024 / 1024).toFixed(1);
    console.log(`✓ Render completed: ${videoSizeMB} MB in vault.`);

    // 4. Post-render Frame Audit
    const framePng = path.join(screenshotDir, `verify-batch${batchNumber}-${slug}.png`);
    spawnSync("ffmpeg", ["-ss", "00:00:05", "-i", vaultOut, "-vframes", "1", "-y", framePng], { stdio: "ignore" });

    if (!fs.existsSync(framePng)) {
      console.error(`❌ [FAIL] Frame extraction failed for ${slug}!`);
      batchResults.push({ slug, passed: false, reason: "Frame extraction failed" });
      continue;
    }

    const frameSizeKB = Math.round(fs.statSync(framePng).size / 1024);
    // Real illustrated artwork frames with detailed linework & textures are > 180 KB.
    // Plain flat gradient frames with stickmen are typically < 80-120 KB.
    if (frameSizeKB < 150) {
      console.error(`⚠️ [SUSPECT] Frame size is only ${frameSizeKB} KB (possible gradient fallback!). Flagging.`);
      batchResults.push({ slug, passed: false, reason: `Suspicious frame size: ${frameSizeKB} KB` });
      continue;
    }

    console.log(`✅ [AUDIT PASSED] Artwork confirmed in frame: ${frameSizeKB} KB at 5.0s.`);
    batchResults.push({ slug, passed: true, sizeMB: videoSizeMB, frameKB: frameSizeKB, framePath: framePng });
  }

  // Final batch gate
  const allPassed = batchResults.length === 5 && batchResults.every((r) => r.passed);
  console.log("\n========================================================");
  if (allPassed) {
    console.log(`🎉 BATCH #${batchNumber} 100% APPROVED! (5/5 verified with artwork)`);
    console.log("   Ready to schedule!");
    slugs.forEach((s) => {
      if (!auditLog.approved.includes(s)) auditLog.approved.push(s);
    });
    auditLog.lastBatchIndex = batchNumber;
    saveAuditLog(auditLog);
  } else {
    console.error(`❌ BATCH #${batchNumber} FAILED QA! Check failed items above.`);
    batchResults.filter((r) => !r.passed).forEach((r) => auditLog.failed.push(r));
    saveAuditLog(auditLog);
  }
  console.log("========================================================\n");

  return { batchNumber, allPassed, results: batchResults };
}

// CLI test
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const slugs = args.length ? args : [
    "pirate-punishments-code",
    "pirate-diet-and-scurvy",
    "pirate-blackbeard-fuse-beard",
    "pirate-democracy-articles",
    "pirate-women-anne-bonny"
  ];
  processBatch(slugs, 1).catch(console.error);
}

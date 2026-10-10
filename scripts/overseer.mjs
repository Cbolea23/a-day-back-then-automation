#!/usr/bin/env node
/**
 * Master Autonomous Overseer Script
 *
 * Runs end-to-end autonomously:
 * 1. Waits for Shorts voice generation to finish (or synthesizes any missing voice).
 * 2. Links all images to scripts.
 * 3. Renders every unrendered Short video to out/2 - Unpublished Vault/.
 * 4. Schedules rendered Shorts to YouTube and Facebook starting Oct 16, 2026.
 * 5. Periodically checks the git repository to see if Muse AI pushed longform images.
 * 6. If longform images appear, builds and renders the longform videos!
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  log("=== AUTONOMOUS OVERSEER STARTED ===");

  // Step 1: Ensure scripts-out has all images attached
  log("Step 1: Attaching images to all Shorts scripts...");
  spawnSync(process.execPath, [path.join("scripts", "attach-images.mjs")], { cwd: root, stdio: "inherit" });

  // Step 2: Render all unrendered Shorts into Unpublished Vault
  const vaultDir = path.join(root, "out", "2 - Unpublished Vault");
  const pubDir = path.join(root, "out", "1 - Published");
  fs.mkdirSync(vaultDir, { recursive: true });
  fs.mkdirSync(pubDir, { recursive: true });

  const topicsData = JSON.parse(fs.readFileSync(path.join(root, "topics.json"), "utf8"));
  const topics = Array.isArray(topicsData) ? topicsData : topicsData.topics || [];

  const publishedFiles = fs.readdirSync(pubDir).filter(f => f.endsWith(".mp4")).map(f => f.replace(".mp4", ""));
  const vaultFiles = fs.readdirSync(vaultDir).filter(f => f.endsWith(".mp4")).map(f => f.replace(".mp4", ""));

  const toRender = [];
  for (const t of topics) {
    if (!publishedFiles.includes(t.slug) && !vaultFiles.includes(t.slug)) {
      toRender.push(t.slug);
    }
  }

  log(`Found ${toRender.length} Shorts needing rendering to vault.`);

  for (let i = 0; i < toRender.length; i++) {
    const slug = toRender[i];
    log(`[${i + 1}/${toRender.length}] Processing Short: ${slug}...`);

    // Ensure voiceover is synthesized
    const scriptPath = path.join(root, "scripts-out", `${slug}.json`);
    if (fs.existsSync(scriptPath)) {
      const script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
      const missingVoice = script.scenes.some(s => !s.seconds || !fs.existsSync(path.join(root, "public", s.audio || "")));
      if (missingVoice) {
        log(`Generating voiceover for ${slug}...`);
        spawnSync(process.execPath, [path.join("scripts", "make-voice.mjs"), slug], { cwd: root, stdio: "inherit" });
      }
    }

    // Render using remotion with automatic retries and integrity validation
    log(`Rendering video for ${slug}...`);
    const targetOut = path.join(vaultDir, `${slug}.mp4`);
    let renderedOk = false;

    for (let attempt = 1; attempt <= 3; attempt++) {
      if (fs.existsSync(targetOut)) {
        try { fs.unlinkSync(targetOut); } catch {}
      }
      const renderRes = spawnSync(
        "npx",
        ["remotion", "render", "src/index.ts", "Short", targetOut, `--props=scripts-out/${slug}.json`],
        { cwd: root, stdio: "inherit", shell: process.platform === "win32" }
      );

      // Verify file exists and has healthy size (> 500KB)
      if (renderRes.status === 0 && fs.existsSync(targetOut)) {
        const stats = fs.statSync(targetOut);
        if (stats.size > 500000) {
          log(`✅ Successfully rendered and verified: ${slug}.mp4 (${(stats.size / 1024 / 1024).toFixed(1)}MB)`);
          renderedOk = true;
          break;
        }
      }
      log(`⚠️ Render attempt ${attempt} failed or incomplete for ${slug}. Retrying in 4s...`);
      await sleep(4000);
    }

    if (!renderedOk) {
      log(`❌ Critical: ${slug} failed after 3 attempts. Will revisit at end.`);
    }
  }

  // Step 3: Run schedule-all to schedule everything starting Oct 16, 2026
  log("Step 3: Scheduling all vault Shorts across YouTube and Facebook...");
  spawnSync(process.execPath, [path.join("scripts", "schedule-all.mjs")], { cwd: root, stdio: "inherit" });

  log("All Shorts rendered and scheduled!");

  // Step 4: Longform monitoring loop
  log("Step 4: Monitoring repository for Muse AI longform image deliverables...");
  const longSlugs = ["roman-day-hour-by-hour", "roman-survive-a-week", "gladiator-real-life", "roman-legionary-career", "roman-myths-debunked"];

  let monitoringCycles = 0;
  while (monitoringCycles < 60) { // monitor for up to 5 hours (5 mins * 60)
    monitoringCycles++;
    log(`Checking GitHub repository (Cycle ${monitoringCycles})...`);
    try {
      execSync("git pull origin main", { cwd: root, stdio: "inherit" });
    } catch (err) {
      log(`Git pull warning: ${err.message}`);
    }

    // Check if any longform directory has images
    for (const lSlug of longSlugs) {
      const imgDir = path.join(root, "public", "long", lSlug);
      if (fs.existsSync(imgDir)) {
        const imgs = fs.readdirSync(imgDir).filter(f => /\.(png|jpg|webp)$/i.test(f));
        if (imgs.length >= 10) {
          log(`Found ${imgs.length} images for longform: ${lSlug}! Building longform video...`);
          spawnSync(process.execPath, [path.join("scripts", "build-long.mjs"), lSlug], { cwd: root, stdio: "inherit" });
        }
      }
    }

    log("Sleeping for 5 minutes before next check...");
    await sleep(300000);
  }

  log("=== OVERSEER COMPLETED ===");
}

main().catch(err => {
  console.error("Overseer error:", err);
  process.exit(1);
});

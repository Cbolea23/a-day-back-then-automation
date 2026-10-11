#!/usr/bin/env node
/**
 * Post-Muse AI Processor:
 * 1. Attaches all generated images from public/images/<slug>/ to scripts-out/<slug>.json
 * 2. Re-renders completed videos with full background art into out/1 - Published/
 * 
 * Usage:
 *   node scripts/process-images-and-render.mjs [slug ...]
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");

console.log("========================================================");
console.log("   STEP 1: Linking Generated Images to Scripts");
console.log("========================================================");

spawnSync("node", ["scripts/attach-images.mjs"], { cwd: root, stdio: "inherit" });

console.log("\n========================================================");
console.log("   STEP 2: Detecting Topics Ready for Re-Render");
console.log("========================================================");

const targets = process.argv.slice(2);
const allScripts = targets.length
  ? targets.map(t => `${t}.json`)
  : fs.readdirSync(outDir).filter(f => f.endsWith(".json") && !f.includes("missing") && !f.includes("all-"));

const readyToRender = [];

for (const f of allScripts) {
  const slug = f.replace(/\.json$/, "");
  const scriptPath = path.join(outDir, f);
  if (!fs.existsSync(scriptPath)) continue;

  const data = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
  if (!data.scenes || !Array.isArray(data.scenes)) continue;

  const allHaveImages = data.scenes.every(s => s.image && fs.existsSync(path.join(root, "public", s.image)));
  if (allHaveImages) {
    readyToRender.push(slug);
  }
}

console.log(`Found ${readyToRender.length} topics with 100% complete background images ready.`);

if (readyToRender.length === 0) {
  console.log("No new topics have complete images yet. Check public/images/<slug>/.");
  process.exit(0);
}

console.log("\n========================================================");
console.log(`   STEP 3: Re-Rendering ${readyToRender.length} Shorts with Full Art`);
console.log("========================================================");

const res = spawnSync(
  "node",
  ["scripts/render-vault.mjs", ...readyToRender],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, FORCE_RENDER: "1" },
    shell: process.platform === "win32"
  }
);

console.log("\n🎉 Process complete!");

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultDir = path.join(root, "out", "2 - Unpublished Vault");
fs.mkdirSync(vaultDir, { recursive: true });

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "wwii-ration-day",
      "victorian-chimney-sweep-job",
      "victorian-factory-day",
      "gold-rush-miner-day",
      "pirate-ship-day",
      "pirate-myths",
      "ottoman-coffeehouse",
      "aztec-market-day",
      "chinampa-farmer-day",
      "maya-scribe-job",
      "inca-runner-job",
      "ninja-myths",
      "han-china-farmer-day",
      "samurai-day",
      "edo-merchant-vs-samurai",
      "mongol-steppe-day",
      "tudor-kitchen-boy"
    ];

console.log(`Starting render of ${targets.length} Shorts with accurate theming...`);

for (let i = 0; i < targets.length; i++) {
  const slug = targets[i];
  const finalDest = path.join(vaultDir, `${slug}.mp4`);
  const tempOut = path.join(root, "out", `${slug}.mp4`);
  const propsPath = path.join("scripts-out", `${slug}.json`);

  const pubDest = path.join(root, "out", "1 - Published", `${slug}.mp4`);
  const isAlreadyDone = (fs.existsSync(finalDest) && fs.statSync(finalDest).size > 500000) ||
                        (fs.existsSync(pubDest) && fs.statSync(pubDest).size > 500000);
  if (isAlreadyDone && !process.env.FORCE_RENDER) {
    console.log(`\n[${i + 1}/${targets.length}] [SKIP] Already rendered: ${slug}.mp4`);
    continue;
  }

  console.log(`\n======================================================`);
  console.log(`[${i + 1}/${targets.length}] Rendering: ${slug}`);
  console.log(`======================================================`);

  if (fs.existsSync(tempOut)) {
    try { fs.unlinkSync(tempOut); } catch {}
  }
  if (fs.existsSync(finalDest)) {
    try { fs.unlinkSync(finalDest); } catch {}
  }

  const res = spawnSync(
    "npx",
    ["remotion", "render", "src/index.ts", "Short", `out/${slug}.mp4`, `--props=${propsPath}`],
    { cwd: root, stdio: "inherit", shell: process.platform === "win32" }
  );

  if (res.status === 0 && fs.existsSync(tempOut)) {
    const stats = fs.statSync(tempOut);
    if (stats.size > 500000) {
      fs.renameSync(tempOut, finalDest);
      console.log(`✅ [SUCCESS] Moved to vault: ${slug}.mp4 (${(stats.size / 1024 / 1024).toFixed(1)} MB)`);
    } else {
      console.error(`❌ [FAILED] File too small: ${tempOut} (${stats.size} bytes)`);
    }
  } else {
    console.error(`❌ [FAILED] Render failed for ${slug} (exit code ${res.status})`);
  }
}

console.log(`\n🎉 All targeted Shorts rendering completed!`);

#!/usr/bin/env node
/**
 * Renders one or more scripts to out/<slug>.mp4 (1080x1920).
 * Usage: node scripts/render.mjs [slug ...]   (no args = every script in scripts-out/)
 */
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(path.join(root, "out"), {recursive: true});

const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs
      .readdirSync(outDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));

const force = process.argv.includes("--force");
const filteredSlugs = slugs.filter((s) => !s.startsWith("--"));
const vaultDir = path.join(root, "out", "2 - Unpublished Vault");
fs.mkdirSync(vaultDir, {recursive: true});

let failed = 0;
for (const slug of filteredSlugs) {
  const props = path.join("scripts-out", `${slug}.json`);
  if (!fs.existsSync(path.join(root, props))) {
    console.warn(`No script for ${slug}`);
    continue;
  }

  const pubPath = path.join(root, "out", "1 - Published", `${slug}.mp4`);
  const vaultPath = path.join(vaultDir, `${slug}.mp4`);
  if (!force && (fs.existsSync(pubPath) || fs.existsSync(vaultPath))) {
    console.log(`[SKIP] Already rendered: ${slug}`);
    continue;
  }

  console.log(`Rendering ${slug} ...`);
  const tempOut = path.join(root, "out", `${slug}.mp4`);
  const result = spawnSync(
    "npx",
    ["remotion", "render", "src/index.ts", "Short", `out/${slug}.mp4`, `--props=${props}`],
    {cwd: root, stdio: "inherit", shell: process.platform === "win32"},
  );
  if (result.status === 0 && fs.existsSync(tempOut)) {
    fs.renameSync(tempOut, vaultPath);
    console.log(`✓ Moved to vault: out/2 - Unpublished Vault/${slug}.mp4`);
  } else {
    failed++;
    console.error(`Render failed for ${slug}`);
  }
}
process.exit(failed ? 1 : 0);

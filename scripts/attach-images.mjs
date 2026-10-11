#!/usr/bin/env node
/**
 * Links generated images to scenes.
 * Put images at public/images/<slug>/1.png, 2.png, ... (png, jpg, jpeg or webp),
 * numbered in the same order as scripts-out/<slug>.prompts.txt.
 *
 * Usage: node scripts/attach-images.mjs [slug ...]
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
const EXTS = ["png", "jpg", "jpeg", "webp"];

const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs
      .readdirSync(outDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));

for (const slug of slugs) {
  const file = path.join(outDir, `${slug}.json`);
  if (!fs.existsSync(file)) {
    console.warn(`No script for ${slug}`);
    continue;
  }
  const script = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!script || !Array.isArray(script.scenes)) {
    continue;
  }
  let attached = 0;
  script.scenes.forEach((scene, i) => {
    let found = false;
    for (const ext of EXTS) {
      const rel = `images/${slug}/${i + 1}.${ext}`;
      if (fs.existsSync(path.join(root, "public", rel))) {
        scene.image = rel;
        attached++;
        found = true;
        break;
      }
    }
    if (!found) {
      delete scene.image;
    }
  });
  fs.writeFileSync(file, JSON.stringify(script, null, 2));
  console.log(`${slug}: ${attached}/${script.scenes.length} scenes have images`);
}

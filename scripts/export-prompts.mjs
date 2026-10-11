#!/usr/bin/env node
/**
 * Exports scene image prompts from scripts-out/*.json to scripts-out/*.prompts.txt
 * formatted specifically for Muse AI image generation.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");

const files = fs.readdirSync(outDir).filter((f) => f.endsWith(".json") && !f.includes("missing"));

let exportedCount = 0;

for (const file of files) {
  const slug = file.replace(/\.json$/, "");
  const jsonPath = path.join(outDir, file);
  const promptPath = path.join(outDir, `${slug}.prompts.txt`);

  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    if (!data.scenes || !Array.isArray(data.scenes)) continue;

    const lines = data.scenes.map((scene, i) => {
      const p = scene.imagePrompt || scene.text;
      return `${i + 1}. ${p}`;
    });

    fs.writeFileSync(promptPath, lines.join("\n") + "\n", "utf8");
    exportedCount++;
  } catch (err) {
    console.error(`Error processing ${slug}:`, err.message);
  }
}

console.log(`\nSuccessfully exported ${exportedCount} .prompts.txt files in scripts-out/ for Muse AI!`);

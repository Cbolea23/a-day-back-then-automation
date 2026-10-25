#!/usr/bin/env node
/**
 * Generates one background image per scene using the Zero-Cost Multi-Provider Image Engine
 * (Gemini Image -> HuggingFace Flux -> Pollinations Flux 1080x1920), saves it to
 * public/images/<slug>/<n>.jpg and links it into scripts-out/<slug>.json.
 *
 * Usage:
 *   node scripts/make-images.mjs [slug ...] [--force] [--scene <1-based-index>] [--style <artStyleId>]
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {generateSceneImage} from "./lib/free-llm-router.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");

const args = process.argv.slice(2);
const force = args.includes("--force");
const getArg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};
const onlyScene = getArg("scene") ? Number(getArg("scene")) : null;
const styleOverride = getArg("style");

const flagIndices = new Set();
args.forEach((a, i) => {
  if (a.startsWith("--")) {
    flagIndices.add(i);
    if (["--scene", "--style"].includes(a)) flagIndices.add(i + 1);
  }
});
const slugArgs = args.filter((_, i) => !flagIndices.has(i));

const EXTS = ["png", "jpg", "jpeg", "webp"];

const slugs = slugArgs.length
  ? slugArgs
  : fs
      .readdirSync(outDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));

let made = 0;
let skipped = 0;
let failed = 0;

for (const slug of slugs) {
  const file = path.join(outDir, `${slug}.json`);
  if (!fs.existsSync(file)) {
    console.warn(`No script for ${slug}`);
    continue;
  }
  const script = JSON.parse(fs.readFileSync(file, "utf8"));
  if (styleOverride) script.artStyle = styleOverride;
  const artStyle = script.artStyle || "classic-cartoon";
  const imgDir = path.join(root, "public", "images", slug);
  fs.mkdirSync(imgDir, {recursive: true});

  for (let i = 0; i < script.scenes.length; i++) {
    if (onlyScene !== null && i + 1 !== onlyScene) continue;

    const scene = script.scenes[i];
    const existing = EXTS.map((e) => `images/${slug}/${i + 1}.${e}`).find((rel) =>
      fs.existsSync(path.join(root, "public", rel)),
    );
    if (existing && !force && onlyScene === null) {
      scene.image = existing;
      skipped++;
      continue;
    }
    if (!scene.imagePrompt) {
      console.warn(`  ${slug} scene ${i + 1}: no imagePrompt, keeping gradient`);
      continue;
    }

    console.log(`  ${slug} scene ${i + 1}/${script.scenes.length} (style: ${artStyle}) ...`);
    try {
      const {buffer, provider} = await generateSceneImage({
        prompt: scene.imagePrompt,
        artStyle,
        aspectRatio: "9:16",
        seed: Math.floor(Math.random() * 1000000) + i * 101,
        allowWait: true,
      });
      const rel = `images/${slug}/${i + 1}.jpg`;
      fs.writeFileSync(path.join(root, "public", rel), buffer);
      scene.image = rel;
      made++;
      console.log(`    ✓ Saved ${rel} via ${provider}`);
      fs.writeFileSync(file, JSON.stringify(script, null, 2));
    } catch (err) {
      failed++;
      console.warn(`    ! Scene ${i + 1} image failed (${err.message}). Keeping fallback.`);
    }
  }

  fs.writeFileSync(file, JSON.stringify(script, null, 2));
  console.log(`${slug}: done`);
}
console.log(`Images made: ${made}, skipped: ${skipped}, failed: ${failed}.`);

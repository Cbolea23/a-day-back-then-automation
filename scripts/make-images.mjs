#!/usr/bin/env node
/**
 * Generates one background image per scene with Gemini image generation, saves it to
 * public/images/<slug>/<n>.jpg and links it into scripts-out/<slug>.json.
 *
 * Usage:
 *   node scripts/make-images.mjs [slug ...] [--force]
 *   (no slug = every script in scripts-out/; existing images are skipped unless --force)
 *
 * Env:
 *   GEMINI_API_KEY  required
 *   IMAGE_MODEL     default "gemini-3.1-flash-lite-image" (fastest/cheapest 1K model)
 *   IMAGE_SIZE      default "1K"  (use "2K" only with models that support it)
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");

const args = process.argv.slice(2);
const force = args.includes("--force");
const slugArgs = args.filter((a) => !a.startsWith("--"));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Set GEMINI_API_KEY first.");
  process.exit(1);
}
const model = process.env.IMAGE_MODEL || "gemini-3.1-flash-lite-image";
const imageSize = process.env.IMAGE_SIZE || "1K";
const EXTS = ["png", "jpg", "jpeg", "webp"];

async function generate(prompt) {
  const body = {
    model,
    input: [{type: "text", text: prompt}],
    response_format: {
      type: "image",
      mime_type: "image/jpeg",
      aspect_ratio: "9:16",
      image_size: imageSize,
    },
  };

  let lastError = "";
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {"Content-Type": "application/json", "x-goog-api-key": apiKey},
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const json = await res.json();
      const images = (json.steps || [])
        .filter((s) => s.type === "model_output")
        .flatMap((s) => s.content || [])
        .filter((c) => c.type === "image" && c.data);
      const last = images[images.length - 1];
      if (!last) {
        return null; // blocked or empty: caller keeps the gradient fallback
      }
      return Buffer.from(last.data, "base64");
    }

    lastError = `HTTP ${res.status} ${await res.text()}`;
    if ([400, 401, 403, 404].includes(res.status)) {
      throw new Error(
        `Image request rejected (${lastError.slice(0, 500)}). Check GEMINI_API_KEY, IMAGE_MODEL ` +
          "(and IMAGE_SIZE), and whether your plan allows image generation (it may need paid billing).",
      );
    }
    await new Promise((r) => setTimeout(r, 3000 * attempt));
  }
  throw new Error("Image generation failed after retries: " + lastError.slice(0, 500));
}

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
  const imgDir = path.join(root, "public", "images", slug);
  fs.mkdirSync(imgDir, {recursive: true});

  for (let i = 0; i < script.scenes.length; i++) {
    const scene = script.scenes[i];
    const existing = EXTS.map((e) => `images/${slug}/${i + 1}.${e}`).find((rel) =>
      fs.existsSync(path.join(root, "public", rel)),
    );
    if (existing && !force) {
      scene.image = existing;
      skipped++;
      continue;
    }
    if (!scene.imagePrompt) {
      console.warn(`  ${slug} scene ${i + 1}: no imagePrompt, keeping gradient`);
      continue;
    }

    console.log(`  ${slug} scene ${i + 1}/${script.scenes.length} ...`);
    const bytes = await generate(scene.imagePrompt);
    if (!bytes) {
      failed++;
      console.warn(`    ! no image returned (maybe blocked). Keeping gradient; try --force later.`);
      continue;
    }
    const rel = `images/${slug}/${i + 1}.jpg`;
    fs.writeFileSync(path.join(root, "public", rel), bytes);
    scene.image = rel;
    made++;
    // Save progress after every image so a crash never loses finished work.
    fs.writeFileSync(file, JSON.stringify(script, null, 2));
  }

  fs.writeFileSync(file, JSON.stringify(script, null, 2));
  console.log(`${slug}: done`);
}
console.log(`Images made: ${made}, skipped (already existed): ${skipped}, failed: ${failed}.`);

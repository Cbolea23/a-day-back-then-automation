#!/usr/bin/env node
/**
 * One command that finishes a video once its images are in place:
 *   1) checks every scene has an image in public/images/<slug>/
 *   2) links the images into the script
 *   3) makes the voiceover (Gemini TTS)
 *   4) renders out/<slug>.mp4
 *
 * Usage: node scripts/build-video.mjs <slug> [--allow-gradient] [--no-voice]
 *   --allow-gradient  render even if some scenes have no image (they get a gradient)
 *   --no-voice        skip the voiceover step (keeps existing audio, or none)
 */
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const allowGradient = args.includes("--allow-gradient");
const noVoice = args.includes("--no-voice");
const noUpload = args.includes("--no-upload");
const uploadArgs = args.filter((a) => ["--now", "--public", "--privacy", "--schedule"].some((flag) => a === flag || a.startsWith(`${flag}=`)));

if (!slug) {
  console.error("Usage: npm run build-video -- <slug>   (e.g. npm run build-video -- roman-toilets)");
  process.exit(1);
}

const scriptFile = path.join(root, "scripts-out", `${slug}.json`);
if (!fs.existsSync(scriptFile)) {
  console.error(`No script found at scripts-out/${slug}.json. Run "npm run script" first.`);
  process.exit(1);
}
const script = JSON.parse(fs.readFileSync(scriptFile, "utf8"));

const EXTS = ["png", "jpg", "jpeg", "webp"];
const missing = [];
script.scenes.forEach((_, i) => {
  const found = EXTS.some((e) => fs.existsSync(path.join(root, "public", "images", slug, `${i + 1}.${e}`)));
  if (!found) {
    missing.push(i + 1);
  }
});

if (missing.length && !allowGradient) {
  console.error(
    `Missing images for scene(s) ${missing.join(", ")} of ${script.scenes.length}.\n` +
      `Save them as public/images/${slug}/<number>.png (prompts: scripts-out/${slug}.prompts.txt),\n` +
      `or add --allow-gradient to render with plain backgrounds.`,
  );
  process.exit(1);
}

function run(label, scriptName, extraArgs = []) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(process.execPath, [path.join("scripts", scriptName), slug, ...extraArgs], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.error(`\nStopped: "${label}" failed.`);
    process.exit(result.status || 1);
  }
}

function runSafe(label, scriptName, extraArgs = []) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(process.execPath, [path.join("scripts", scriptName), slug, ...extraArgs], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.warn(`\nNotice: "${label}" did not complete (code ${result.status}). Continuing remaining steps...`);
  }
}

run("Linking images", "attach-images.mjs");
if (noVoice) {
  console.log("\n(Skipping voiceover.)");
} else {
  run("Voiceover", "make-voice.mjs");
}
run("Rendering", "render.mjs");

if (noUpload) {
  console.log("\n(Skipping uploads: --no-upload specified.)");
  const destDir = path.join(root, "out", "2 - Unpublished Vault");
  fs.mkdirSync(destDir, {recursive: true});
  const src = path.join(root, "out", `${slug}.mp4`);
  if (fs.existsSync(src)) {
    fs.renameSync(src, path.join(destDir, `${slug}.mp4`));
    console.log(`Video saved to offline vault: out/2 - Unpublished Vault/${slug}.mp4`);
  }
} else {
  runSafe("Uploading & Scheduling to YouTube", "upload-youtube.mjs", uploadArgs);
  if (fs.existsSync(path.join(root, "facebook-tokens.json"))) {
    runSafe("Uploading to Facebook Reels", "upload-facebook.mjs", uploadArgs);
  }
  if (fs.existsSync(path.join(root, ".tiktok-session"))) {
    runSafe("Uploading to TikTok", "upload-tiktok.mjs", uploadArgs);
  }
  const destDir = path.join(root, "out", "1 - Published");
  fs.mkdirSync(destDir, {recursive: true});
  const src = path.join(root, "out", `${slug}.mp4`);
  if (fs.existsSync(src)) {
    fs.renameSync(src, path.join(destDir, `${slug}.mp4`));
    console.log(`Video organized to: out/1 - Published/${slug}.mp4`);
  }
}

console.log(`\nAll done! Video built and processed.`);

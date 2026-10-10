#!/usr/bin/env node
/**
 * Generates a voiceover file per scene and sets each scene's real duration.
 *
 * Provider is chosen in scripts/tts.mjs:
 *   - Gemini TTS (natural, default when GEMINI_API_KEY is set)
 *   - edge-tts fallback (free, more robotic): VOICE_PROVIDER=edge
 * Needs ffprobe (comes with ffmpeg) to measure clip length.
 *
 * Usage: node scripts/make-voice.mjs [slug ...] [--dir scripts-out|long-out] [--force]
 *   --dir    which folder holds the scripts (default scripts-out = Shorts; long-out = long-form)
 *   --force  regenerate every scene (otherwise scenes whose text did not change are kept,
 *            so a failed run can simply be started again to resume)
 * Env:   VOICE, VOICE_STYLE, TTS_MODEL, VOICE_PROVIDER (see scripts/tts.mjs)
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {EXTENSION, PROVIDER, durationSeconds, synth} from "./tts.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAD_SECONDS = 0.35;

const argv = process.argv.slice(2);
let dirName = "scripts-out";
let force = false;
const slugArgs = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--dir") {
    dirName = argv[++i];
  } else if (argv[i] === "--force") {
    force = true;
  } else {
    slugArgs.push(argv[i]);
  }
}
const outDir = path.join(root, dirName);
// scripts-out -> audio/<slug>/N ; long-out -> audio/long/<slug>/N
const audioPrefix = dirName === "scripts-out" ? "" : dirName.replace(/-out$/, "") + "/";

console.log(`Voice provider: ${PROVIDER}`);

const slugs = slugArgs.length
  ? slugArgs
  : fs
      .readdirSync(outDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));

for (const slug of slugs) {
  const file = path.join(outDir, `${slug}.json`);
  if (!fs.existsSync(file)) {
    console.warn(`No script for ${slug} in ${dirName}/`);
    continue;
  }
  const script = JSON.parse(fs.readFileSync(file, "utf8"));
  fs.mkdirSync(path.join(root, "public", "audio", audioPrefix, slug), {recursive: true});

  let made = 0;
  let kept = 0;
  for (let i = 0; i < script.scenes.length; i++) {
    const scene = script.scenes[i];
    const rel = `audio/${audioPrefix}${slug}/${i + 1}.${EXTENSION}`;
    const abs = path.join(root, "public", rel);

    const reusable =
      !force &&
      scene.audio === rel &&
      scene.voicedText === scene.text &&
      scene.seconds &&
      fs.existsSync(abs);
    if (reusable) {
      kept++;
      continue;
    }

    await synth(scene.text, abs);
    const seconds = durationSeconds(abs);
    scene.audio = rel;
    scene.voicedText = scene.text;
    scene.seconds = Math.round((seconds + PAD_SECONDS) * 10) / 10;
    made++;
    console.log(`  ${slug} scene ${i + 1}/${script.scenes.length}: ${seconds.toFixed(1)}s`);
    // Save after every scene so a crash never loses finished work.
    fs.writeFileSync(file, JSON.stringify(script, null, 2));

    // When using Gemini on free tier, add a gentle delay to stay safely under 15 RPM
    if (PROVIDER === "gemini") {
      await new Promise((r) => setTimeout(r, 4200));
    }
  }

  fs.writeFileSync(file, JSON.stringify(script, null, 2));
  const total = script.scenes.reduce((n, s) => n + (s.seconds || 0), 0).toFixed(1);
  console.log(`${slug}: voiceover ready (${made} new, ${kept} kept), total ${total}s`);
}

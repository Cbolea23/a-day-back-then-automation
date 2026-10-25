#!/usr/bin/env node
/**
 * Generates a voiceover file per scene and sets each scene's real duration.
 *
 * Honors script.voice, script.language, and per-scene overrides.
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
let cliVoice = "";
const slugArgs = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--dir") {
    dirName = argv[++i];
  } else if (argv[i] === "--force") {
    force = true;
  } else if (argv[i] === "--voice") {
    cliVoice = argv[++i];
  } else {
    slugArgs.push(argv[i]);
  }
}
const outDir = path.join(root, dirName);
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
  if (cliVoice) script.voice = cliVoice;
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

    const isLastScene = i === script.scenes.length - 1;
    const activeVoice = scene.voice || cliVoice || script.voice || undefined;
    const overrides = scene.speaker === "npc"
      ? {
          voice: scene.voice || "Puck",
          language: script.language || "en",
          mood: scene.mood || "dark",
          emotionPreset: script.emotionPreset || script.tone || "spooky-suspense",
          isLastScene,
          style:
            scene.voiceStyle ||
            "Exasperated, expressive villager reacting in surprise.",
        }
      : {
          ...(activeVoice ? {voice: activeVoice} : {}),
          ...(script.language ? {language: script.language} : {}),
          ...(scene.voiceStyle ? {style: scene.voiceStyle} : {}),
          mood: scene.mood || "dark",
          emotionPreset: script.emotionPreset || script.tone || "spooky-suspense",
          isLastScene,
        };

    await synth(scene.text, abs, overrides);
    const seconds = durationSeconds(abs);
    scene.audio = rel;
    scene.voicedText = scene.text;
    scene.seconds = Math.round((seconds + PAD_SECONDS) * 10) / 10;
    made++;
    console.log(`  ${slug} scene ${i + 1}/${script.scenes.length}: ${seconds.toFixed(1)}s`);
    fs.writeFileSync(file, JSON.stringify(script, null, 2));

    if (PROVIDER === "gemini") {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log(`${slug}: ${made} new, ${kept} kept (audio in public/audio/${audioPrefix}${slug}/)`);
}

#!/usr/bin/env node
/**
 * Makes one short test clip per voice so you can pick the one you like.
 * Usage: node scripts/voice-test.mjs Charon Sadaltager Achird Puck
 *        (default list used if none given). Output: out/voice-test/<voice>.wav
 * Gemini voices only (VOICE_PROVIDER must be gemini).
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {PROVIDER, synth} from "./tts.mjs";

if (PROVIDER !== "gemini") {
  console.error("Set GEMINI_API_KEY (and not VOICE_PROVIDER=edge) to test Gemini voices.");
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "out", "voice-test");
fs.mkdirSync(dir, {recursive: true});

const voices = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["Charon", "Sadaltager", "Achird", "Puck", "Fenrir", "Gacrux"];

const line =
  "It's still dark. You wake on a straw mattress in a tiny room, high up in a crowded apartment block. " +
  "There's no kitchen, and fire is a real danger here. So you skip cooking.";

for (const voice of voices) {
  const out = path.join(dir, `${voice}.wav`);
  console.log(`Generating ${voice} ...`);
  await synth(line, out, {voice});
}
console.log(`Done. Listen to the files in ${dir}, then set $env:VOICE="<name>".`);

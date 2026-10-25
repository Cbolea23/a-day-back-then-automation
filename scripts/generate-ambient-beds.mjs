#!/usr/bin/env node
/**
 * Generates zero-copyright, studio-mastered WAV atmospheric sound beds and
 * subtle scene transition SFX in public/sfx/ using pure Node.js DSP synthesis.
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sfxDir = path.join(root, "public", "sfx");
fs.mkdirSync(sfxDir, {recursive: true});

const SAMPLE_RATE = 22050; // Compact, fast-loading 16-bit mono PCM

function writeWav(filePath, samples) {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buf = Buffer.alloc(44 + dataSize);

  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); // PCM chunk size
  buf.writeUInt16LE(1, 20);  // PCM format
  buf.writeUInt16LE(1, 22);  // Mono
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  fs.writeFileSync(filePath, buf);
}

// 1. Eerie Dark Folklore Night Wind + Deep Sub Drone (60 seconds)
function generateFolkloreWind(seconds = 60) {
  const n = Math.floor(seconds * SAMPLE_RATE);
  const out = new Float32Array(n);
  let lp1 = 0;
  let lp2 = 0;
  let seed = 1337;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296 - 0.5;
  };

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    // Slow wind gust LFO (0.12 Hz and 0.05 Hz)
    const gust = 0.55 + 0.45 * Math.sin(2 * Math.PI * 0.11 * t) * Math.cos(2 * Math.PI * 0.04 * t + 0.7);
    // Filtered pink/brown wind noise
    const white = rnd();
    lp1 += (white - lp1) * (0.018 + 0.012 * gust);
    lp2 += (lp1 - lp2) * 0.025;

    // Deep eerie sub-bass harmonic drone (55 Hz A1 + 82.4 Hz E2fifth)
    const drone =
      0.16 * Math.sin(2 * Math.PI * 55 * t) +
      0.09 * Math.sin(2 * Math.PI * 82.41 * t + Math.sin(t * 0.4)) +
      0.05 * Math.sin(2 * Math.PI * 110 * t);

    // Subtle distant twig/ember crackle
    const crackle = Math.abs(white) > 0.4985 ? white * 0.35 : 0;

    // Smooth fade-in and fade-out
    const env = Math.min(1, t / 1.5, (seconds - t) / 1.5);
    out[i] = (lp2 * 1.6 * gust + drone + crackle) * 0.38 * env;
  }
  return out;
}

// 2. Warm Ancient History Torchlight & Hall Ambience (60 seconds)
function generateHistoryHearth(seconds = 60) {
  const n = Math.floor(seconds * SAMPLE_RATE);
  const out = new Float32Array(n);
  let brown = 0;
  let lp = 0;
  let seed = 4242;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296 - 0.5;
  };

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const white = rnd();
    brown = (brown + 0.02 * white) / 1.02;
    lp += (white - lp) * 0.08;

    // Warm room resonance (73.4 Hz D2 + 146.8 Hz D3)
    const warmth =
      0.11 * Math.sin(2 * Math.PI * 73.42 * t) +
      0.06 * Math.sin(2 * Math.PI * 109.9 * t);

    // Gentle hearth fire crackle
    const ember = Math.abs(white) > 0.497 ? (white - lp) * 0.45 : 0;
    const env = Math.min(1, t / 1.5, (seconds - t) / 1.5);
    out[i] = (brown * 1.4 + warmth + ember) * 0.34 * env;
  }
  return out;
}

// 3. Soft Cinematic Low-Frequency Transition Whoosh (0.38 seconds)
function generateTransitionWhoosh(seconds = 0.38) {
  const n = Math.floor(seconds * SAMPLE_RATE);
  const out = new Float32Array(n);
  let lp = 0;
  let seed = 9001;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296 - 0.5;
  };

  for (let i = 0; i < n; i++) {
    const progress = i / n;
    // Bell-shaped envelope
    const env = Math.sin(Math.PI * progress) ** 1.6;
    // Filter cutoff sweeps up then down
    const cutoff = 0.02 + 0.14 * Math.sin(Math.PI * progress);
    lp += (rnd() - lp) * cutoff;
    // Subtle sub thump
    const freq = 95 - 50 * progress;
    const sub = 0.25 * Math.sin(2 * Math.PI * freq * (i / SAMPLE_RATE));
    out[i] = (lp * 2.2 + sub) * env * 0.55;
  }
  return out;
}

const folklorePath = path.join(sfxDir, "ambient-folklore-wind.wav");
writeWav(folklorePath, generateFolkloreWind(60));
console.log(`✓ Generated ${folklorePath}`);

const historyPath = path.join(sfxDir, "ambient-history-hearth.wav");
writeWav(historyPath, generateHistoryHearth(60));
console.log(`✓ Generated ${historyPath}`);

const whooshPath = path.join(sfxDir, "transition-whoosh.wav");
writeWav(whooshPath, generateTransitionWhoosh(0.38));
console.log(`✓ Generated ${whooshPath}`);

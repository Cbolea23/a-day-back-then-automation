#!/usr/bin/env node
/**
 * Zero-Cost Edge TTS Synthesizer with Emotional Prosody & Pure-Node Audio Parser
 * Usage:
 *   node scripts/prosody-tts.mjs "Your dramatic scene text..." out.mp3 --emotion spooky-suspense --voice en-US-GuyNeural
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const text = args[0] || 'In an empty forest at twilight... you are not alone.';
const outFile = args[1] || 'audio.mp3';

const getArg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};

const emotion = getArg('emotion') || 'spooky-suspense';
const voice = getArg('voice') || 'en-US-GuyNeural';

// Acoustic parameters per emotion
const ACOUSTIC_MAP = {
  'spooky-suspense': { pitch: '-4Hz', rate: '-5%' },
  'intense-drama': { pitch: '-2Hz', rate: '-2%' },
  'documentary-calm': { pitch: '-1Hz', rate: '-1%' },
  'viral-energetic': { pitch: '+1Hz', rate: '+4%' },
};

const acoustic = ACOUSTIC_MAP[emotion] || ACOUSTIC_MAP['spooky-suspense'];

// Synthesize via edge-tts CLI
console.log(`Synthesizing (${voice}, pitch: ${acoustic.pitch}, rate: ${acoustic.rate})...`);
execFileSync('edge-tts', [
  '--voice', voice,
  '--pitch', acoustic.pitch,
  '--rate', acoustic.rate,
  '--text', text,
  '--write-media', outFile,
]);

// Pure Node.js MP3 Frame Duration Parser
function getMp3Duration(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 0;
  if (buf.length > 10 && buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) {
    const tagSize = ((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f);
    offset = 10 + tagSize;
  }
  const bitrates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
  const sampleRates = [44100, 48000, 32000];
  let totalSamples = 0, sampleRate = 0;

  while (offset < buf.length - 4) {
    if (buf[offset] === 0xff && (buf[offset + 1] & 0xe0) === 0xe0) {
      const bitRateIdx = (buf[offset + 2] >> 4) & 0x0f;
      const sampleRateIdx = (buf[offset + 2] >> 2) & 0x03;
      const padding = (buf[offset + 2] >> 1) & 0x01;
      if (bitRateIdx > 0 && bitRateIdx < 15 && sampleRateIdx < 3) {
        sampleRate = sampleRates[sampleRateIdx];
        const br = bitrates[bitRateIdx] * 1000;
        const frameLength = Math.floor(((1152 / 8) * br) / sampleRate) + padding;
        if (frameLength > 0) {
          totalSamples += 1152;
          offset += frameLength;
          continue;
        }
      }
    }
    offset++;
  }
  return sampleRate > 0 ? Math.round((totalSamples / sampleRate) * 100) / 100 : null;
}

const duration = getMp3Duration(outFile);
console.log(`Done! Created ${outFile} (duration: ${duration}s)`);

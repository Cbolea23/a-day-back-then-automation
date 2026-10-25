/**
 * Text-to-speech helpers used by make-voice.mjs, voice-test.mjs, and Dashboard Studio.
 *
 * Multi-tier $0.00 Voice Synthesis Engine:
 *   1. Gemini TTS (when VOICE_PROVIDER="gemini" and GEMINI_API_KEY is available)
 *   2. Microsoft Edge Neural TTS (`python -m edge_tts` or `python3 -m edge_tts`)
 *   3. Pure Node.js Zero-Key HTTP TTS Stream (`translate.google.com/translate_tts` + ffmpeg concat)
 *      -> Works on Windows, Linux, Vercel, and GitHub Actions with ZERO API keys or Python packages!
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {execFileSync} from "node:child_process";
import {loadAllKeys} from "./lib/free-llm-router.mjs";
import {formatEmotionalProsody, getAcousticParameters} from "./lib/prosody-engine.mjs";

const loadedKeys = loadAllKeys();

export const PROVIDER = (
  process.env.VOICE_PROVIDER ||
  loadedKeys.VOICE_PROVIDER ||
  (process.env.GEMINI_API_KEY || loadedKeys.GEMINI_API_KEY ? "gemini" : "edge")
).toLowerCase();

export const EXTENSION = PROVIDER === "gemini" ? "wav" : "mp3";

export const VOICE_CATALOG = [
  // 🇵🇭 Filipino / Tagalog & Taglish
  {
    id: "fil-PH-AngeloNeural",
    category: "filipino",
    geminiVoice: "Fenrir",
    name: "Angelo (Filipino Storyteller)",
    badge: "Best for PH Lore & Taglish",
    accent: "Filipino Male",
    lang: "tl",
    emotionPreset: "spooky-suspense",
    defaultRate: "-4%",
    defaultPitch: "-3Hz",
    description: "Authentic Filipino accent with suspenseful campfire cadence. Ideal for Kapre, Aswang, and Taglish lore.",
  },
  {
    id: "fil-PH-BlessicaNeural",
    category: "filipino",
    geminiVoice: "Aoede",
    name: "Blessica (Expressive Filipina)",
    badge: "Expressive Filipina",
    accent: "Filipino Female",
    lang: "tl",
    emotionPreset: "spooky-suspense",
    defaultRate: "-4%",
    defaultPitch: "-3Hz",
    description: "Expressive, evocative Filipina narrator with dramatic breath pauses for mythology and folklore.",
  },

  // 🕯️ Dark Folklore & Horror
  {
    id: "en-US-ChristopherNeural",
    category: "folklore",
    geminiVoice: "Charon",
    name: "Christopher / Charon",
    badge: "Deep Baritone Dread",
    accent: "US Deep Male",
    lang: "en",
    emotionPreset: "dread",
    defaultRate: "-4%",
    defaultPitch: "-4Hz",
    description: "Deep, mysterious baritone narrator with chilling Netflix-style dark documentary authority.",
  },
  {
    id: "en-US-GuyNeural",
    category: "folklore",
    geminiVoice: "Puck",
    name: "Guy (Midnight Suspense)",
    badge: "Urgent Suspense",
    accent: "US Male",
    lang: "en",
    emotionPreset: "intense-survival",
    defaultRate: "-2%",
    defaultPitch: "-2Hz",
    description: "Passionate, urgent storytelling voice for high-stakes survival and terrifying encounters.",
  },
  {
    id: "en-US-EricNeural",
    category: "folklore",
    geminiVoice: "Charon",
    name: "Eric (Grim Chronicler)",
    badge: "Grim Reality",
    accent: "US Serious Male",
    lang: "en",
    emotionPreset: "documentary-reverent",
    defaultRate: "-5%",
    defaultPitch: "-4Hz",
    description: "Heavy, sober, deadpan authority for dark plagues, disasters, and grim historical events.",
  },

  // 🏛️ History & Documentary
  {
    id: "en-GB-RyanNeural",
    category: "history",
    geminiVoice: "Orus",
    name: "Ryan (British Historian)",
    badge: "BBC Documentary Style",
    accent: "British Male",
    lang: "en-gb",
    emotionPreset: "documentary-reverent",
    defaultRate: "-2%",
    defaultPitch: "-2Hz",
    description: "Classic crisp British museum-documentary narration with dignified cadence and dry wit.",
  },
  {
    id: "en-US-RogerNeural",
    category: "history",
    geminiVoice: "Charon",
    name: "Roger (Grand Antiquity)",
    badge: "Epic Empires",
    accent: "US Resonant Male",
    lang: "en",
    emotionPreset: "documentary-reverent",
    defaultRate: "-1%",
    defaultPitch: "-2Hz",
    description: "Commanding, resonant voice tailored for Roman legions, ancient battles, and empires.",
  },

  // ⚡ Viral & Curious Host
  {
    id: "en-US-AndrewMultilingualNeural",
    category: "viral",
    geminiVoice: "Puck",
    name: "Andrew / Puck",
    badge: "Warm Curious Host",
    accent: "US Warm Male",
    lang: "en",
    emotionPreset: "curious-viral",
    defaultRate: "+2%",
    defaultPitch: "+0Hz",
    description: "Warm, engaging conversational host with natural pacing and high retention hold rate.",
  },
  {
    id: "en-US-AvaMultilingualNeural",
    category: "viral",
    geminiVoice: "Kore",
    name: "Ava (Expressive Host)",
    badge: "Dynamic Storyteller",
    accent: "US Female",
    lang: "en",
    emotionPreset: "curious-viral",
    defaultRate: "+2%",
    defaultPitch: "+1Hz",
    description: "Empathetic, dynamic female host with vivid inflections for viral curiosity and strange history.",
  },
  {
    id: "en-US-AriaNeural",
    category: "viral",
    geminiVoice: "Kore",
    name: "Aria / Kore",
    badge: "Fast Viral Trivia",
    accent: "US Female",
    lang: "en",
    emotionPreset: "curious-viral",
    defaultRate: "+4%",
    defaultPitch: "+1Hz",
    description: "Crisp, energetic female voice perfect for rapid-fire historical facts and short-form loops.",
  },
];

const DEFAULT_STYLE =
  "A warm, curious storyteller speaking to one listener. Conversational, natural pacing, " +
  "light humor, slight emphasis on surprising facts. Not announcer-like, not robotic.";

function wrapPcmAsWav(pcm, sampleRate = 24000, channels = 1, bits = 16) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE((sampleRate * channels * bits) / 8, 28);
  header.writeUInt16LE((channels * bits) / 8, 32);
  header.writeUInt16LE(bits, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function geminiSynth(text, outPath, overrides = {}) {
  const apiKey = process.env.GEMINI_API_KEY || loadAllKeys().GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Set GEMINI_API_KEY (or use VOICE_PROVIDER=edge).");
  }
  const model = process.env.TTS_MODEL || "gemini-3.8-flash-tts";
  let voice = overrides.voice || process.env.VOICE || "Charon";
  // Map Edge neural voice IDs to Gemini voice names if needed
  const matched = VOICE_CATALOG.find((v) => v.id === voice);
  if (matched) voice = matched.geminiVoice;

  const style = overrides.style || process.env.VOICE_STYLE || DEFAULT_STYLE;

  const body = {
    model,
    input: [
      {
        type: "user_input",
        content: [
          {
            type: "text",
            text,
            annotations: [{type: "speech_metadata", style}],
          },
        ],
      },
    ],
    response_format: {type: "audio"},
    generation_config: {speech_config: [{voice}]},
  };

  let lastError = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {"Content-Type": "application/json", "x-goog-api-key": apiKey},
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const json = await res.json();
      const audioBlocks = (json.steps || [])
        .filter((s) => s.type === "model_output")
        .flatMap((s) => s.content || [])
        .filter((c) => c.type === "audio" && c.data);
      const last = audioBlocks[audioBlocks.length - 1];
      if (!last) {
        throw new Error("Gemini TTS response had no audio data");
      }
      let bytes = Buffer.from(last.data, "base64");
      if (bytes.subarray(0, 4).toString("ascii") !== "RIFF") {
        bytes = wrapPcmAsWav(bytes);
      }
      fs.writeFileSync(outPath, bytes);
      return;
    }

    lastError = `HTTP ${res.status} ${await res.text()}`;
    if ([400, 401, 403, 404, 429].includes(res.status)) {
      throw new Error(`Gemini TTS error (${res.status}): ${lastError.slice(0, 250)}`);
    }
    await new Promise((r) => setTimeout(r, 2000 * attempt));
  }
  throw new Error("Gemini TTS failed after retries: " + lastError.slice(0, 300));
}

/**
 * Pure Node.js Zero-Key HTTP TTS fallback (splits sentences <180 chars and merges via buffers/ffmpeg).
 */
async function pureNodeHttpSynth(text, outPath, overrides = {}) {
  const voiceId = overrides.voice || process.env.VOICE || "en-US-ChristopherNeural";
  const matched = VOICE_CATALOG.find((v) => v.id === voiceId);
  const tl =
    overrides.language === "tl" ||
    voiceId.includes("-PH-") ||
    voiceId.startsWith("fil-")
      ? "tl"
      : voiceId.includes("-GB-")
      ? "en-GB"
      : "en";

  // Split text into chunks <= 180 chars at sentence/clause boundaries
  const words = String(text || "").trim().split(/\s+/);
  const chunks = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > 175) {
      if (current) chunks.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  }
  if (current) chunks.push(current.trim());

  const buffers = [];
  for (const chunk of chunks) {
    const u =
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(tl)}` +
      `&q=${encodeURIComponent(chunk)}`;
    const res = await fetch(u, {
      headers: {"User-Agent": "Mozilla/5.0"},
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      throw new Error(`HTTP TTS fallback status ${res.status}`);
    }
    const ab = await res.arrayBuffer();
    buffers.push(Buffer.from(ab));
  }

  const combined = Buffer.concat(buffers);
  if (outPath.endsWith(".wav")) {
    const tmpMp3 = path.join(os.tmpdir(), `tts-${Date.now()}-${Math.random().toString(36).slice(2)}.mp3`);
    fs.writeFileSync(tmpMp3, combined);
    try {
      execFileSync("ffmpeg", ["-y", "-i", tmpMp3, "-acodec", "pcm_s16le", "-ar", "24000", outPath], {
        stdio: "pipe",
      });
    } finally {
      try {
        fs.unlinkSync(tmpMp3);
      } catch {}
    }
  } else {
    fs.writeFileSync(outPath, combined);
  }
}

const EDGE_VOICE_MAP = {
  "en-PH-AngeloNeural": "fil-PH-AngeloNeural",
  "en-PH-BlessicaNeural": "fil-PH-BlessicaNeural",
  "fil-PH-AngeloNeural": "fil-PH-AngeloNeural",
  "fil-PH-BlessicaNeural": "fil-PH-BlessicaNeural",
  "en-US-AndrewMultilingualNeural": "en-US-AndrewMultilingualNeural",
  "en-US-ChristopherNeural": "en-US-ChristopherNeural",
  "en-US-GuyNeural": "en-US-GuyNeural",
  "en-US-EricNeural": "en-US-EricNeural",
  "en-GB-RyanNeural": "en-GB-RyanNeural",
  "en-US-RogerNeural": "en-US-RogerNeural",
  "en-US-AvaMultilingualNeural": "en-US-AvaMultilingualNeural",
  "en-US-AriaNeural": "en-US-AriaNeural",
};

export function normalizeEdgeVoice(voice) {
  if (!voice) return "en-US-ChristopherNeural";
  if (EDGE_VOICE_MAP[voice]) return EDGE_VOICE_MAP[voice];
  if (voice.includes("-PH-")) {
    return voice.replace("en-PH-", "fil-PH-");
  }
  return voice;
}

async function edgeSynth(text, outPath, overrides = {}) {
  const rawVoice = overrides.voice || process.env.VOICE || "en-US-AndrewMultilingualNeural";
  const primaryVoice = normalizeEdgeVoice(rawVoice);
  const fallbackVoices = [
    primaryVoice,
    primaryVoice.startsWith("fil-") ? "fil-PH-AngeloNeural" : "en-US-ChristopherNeural",
    "en-US-AndrewMultilingualNeural",
    "en-US-ChristopherNeural",
  ];
  // Deduplicate fallback list
  const uniqueVoices = [...new Set(fallbackVoices)];

  // 1. Dynamic acoustic calculation (pitch & rate) based on persona & mood
  const acoustic = getAcousticParameters(primaryVoice, overrides);
  const rate = overrides.rate || process.env.RATE || acoustic.rate;
  const pitch = overrides.pitch || process.env.PITCH || acoustic.pitch;

  // 2. Emotional Prosody Text Formatting (breath pauses, ellipses, emphasis)
  const emotionalText = overrides.rawText === true
    ? text
    : formatEmotionalProsody(text, overrides);

  const pyBins = process.platform === "win32" ? ["python", "python3"] : ["python3", "python"];

  for (const py of pyBins) {
    for (const voice of uniqueVoices) {
      try {
        execFileSync(
          py,
          [
            "-m",
            "edge_tts",
            "--voice",
            voice,
            `--rate=${rate}`,
            `--pitch=${pitch}`,
            "--text",
            emotionalText,
            "--write-media",
            outPath,
          ],
          {stdio: "pipe"},
        );
        if (fs.existsSync(outPath) && fs.statSync(outPath).size > 500) {
          return;
        }
      } catch (err) {
        // Continue to next fallback voice
        continue;
      }
    }
  }

  // Seamless pure-Node fallback only when edge_tts Python module is unavailable
  console.warn(`[TTS] Edge TTS unavailable for "${text.slice(0, 30)}...". Falling back to HTTP TTS.`);
  await pureNodeHttpSynth(emotionalText, outPath, overrides);
}

let geminiQuotaExhausted = false;

/** Writes speech for `text` to outPath. */
export async function synth(text, outPath, overrides = {}) {
  const wantGemini =
    overrides.provider === "gemini" ||
    (PROVIDER === "gemini" && overrides.provider !== "edge");

  if (wantGemini && !geminiQuotaExhausted) {
    try {
      await geminiSynth(text, outPath, overrides);
      return;
    } catch (err) {
      geminiQuotaExhausted = true;
      console.warn(`\n[Notice] Gemini TTS unavailable (${err.message.slice(0, 120)}). Using free TTS engine...\n`);
    }
  }
  await edgeSynth(text, outPath, overrides);
}

/**
 * Pure JavaScript MPEG Layer-3 & RIFF WAV frame duration parser.
 * Reads microsecond-accurate audio durations directly from buffer bytes with zero external binaries!
 */
export function parseAudioDuration(buf) {
  if (!buf || buf.length < 32) return null;

  // 1. Check RIFF WAV
  if (buf.length >= 44 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WAVE") {
    let offset = 12;
    let byteRate = 0;
    let dataSize = 0;
    while (offset < buf.length - 8) {
      const chunkId = buf.toString("ascii", offset, offset + 4);
      const chunkSize = buf.readUInt32LE(offset + 4);
      if (chunkId === "fmt " && chunkSize >= 16) {
        byteRate = buf.readUInt32LE(offset + 16);
      } else if (chunkId === "data") {
        dataSize = chunkSize;
        break;
      }
      offset += 8 + chunkSize;
    }
    if (byteRate > 0 && dataSize > 0) {
      return dataSize / byteRate;
    }
  }

  // 2. Check MP3 (MPEG Layer 3)
  let offset = 0;
  // Skip ID3v2 tag
  if (buf.length > 10 && buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) {
    const tagSize =
      ((buf[6] & 0x7f) << 21) |
      ((buf[7] & 0x7f) << 14) |
      ((buf[8] & 0x7f) << 7) |
      (buf[9] & 0x7f);
    offset = 10 + tagSize;
  }

  const bitrates = {
    1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0],
    2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
  };
  const sampleRates = {
    1: [44100, 48000, 32000],
    2: [22050, 24000, 16000],
    2.5: [11025, 12000, 8000],
  };

  let totalSamples = 0;
  let sampleRate = 0;

  while (offset < buf.length - 4) {
    if (buf[offset] === 0xff && (buf[offset + 1] & 0xe0) === 0xe0) {
      const verBits = (buf[offset + 1] >> 3) & 0x03;
      const layerBits = (buf[offset + 1] >> 1) & 0x03;
      const bitRateIdx = (buf[offset + 2] >> 4) & 0x0f;
      const sampleRateIdx = (buf[offset + 2] >> 2) & 0x03;
      const padding = (buf[offset + 2] >> 1) & 0x01;

      const ver = verBits === 3 ? 1 : verBits === 2 ? 2 : verBits === 0 ? 2.5 : null;
      const layer = layerBits === 1 ? 3 : layerBits === 2 ? 2 : layerBits === 3 ? 1 : null;

      if (ver && layer === 3 && bitRateIdx > 0 && bitRateIdx < 15 && sampleRateIdx < 3) {
        const sr = sampleRates[ver][sampleRateIdx];
        const br = (ver === 1 ? bitrates[1][bitRateIdx] : bitrates[2][bitRateIdx]) * 1000;
        sampleRate = sr;
        const samplesPerFrame = ver === 1 ? 1152 : 576;
        const frameLength = Math.floor(((samplesPerFrame / 8) * br) / sr) + padding;

        if (frameLength > 0) {
          totalSamples += samplesPerFrame;
          offset += frameLength;
          continue;
        }
      }
    }
    offset++;
  }

  if (sampleRate > 0 && totalSamples > 0) {
    return totalSamples / sampleRate;
  }
  return null;
}

export function durationSeconds(mediaPath) {
  // Primary: Pure Node.js frame parser (works anywhere with zero external tools)
  try {
    if (fs.existsSync(mediaPath)) {
      const buf = fs.readFileSync(mediaPath);
      const parsed = parseAudioDuration(buf);
      if (parsed && parsed > 0.1) {
        return Math.round(parsed * 100) / 100;
      }
    }
  } catch {}

  // Fallback: ffprobe CLI if available in PATH
  try {
    const out = execFileSync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mediaPath],
      {encoding: "utf8"},
    );
    const val = parseFloat(out.trim());
    if (!Number.isNaN(val) && val > 0) return Math.round(val * 100) / 100;
  } catch {}

  // Fallback: Byte size estimation (~8KB/sec for 64kbps MP3)
  try {
    if (fs.existsSync(mediaPath)) {
      const size = fs.statSync(mediaPath).size;
      if (size > 1000) {
        return Math.round((size / 8000) * 10) / 10;
      }
    }
  } catch {}

  return 4.5;
}

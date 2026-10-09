/**
 * Text-to-speech helpers used by make-voice.mjs and voice-test.mjs.
 *
 * Providers (env VOICE_PROVIDER = "gemini" | "edge"):
 *   gemini (default when GEMINI_API_KEY is set): Gemini TTS, much more natural, supports a
 *          "style" instruction. Env: TTS_MODEL (default gemini-3.8-flash-tts),
 *          VOICE (default Charon), VOICE_STYLE.
 *   edge   : free edge-tts fallback (pip install edge-tts). Env: VOICE
 *          (default en-US-AndrewMultilingualNeural), RATE (default +5%).
 */
import fs from "node:fs";
import {execFileSync} from "node:child_process";

export const PROVIDER = (
  process.env.VOICE_PROVIDER || (process.env.GEMINI_API_KEY ? "gemini" : "edge")
).toLowerCase();

export const EXTENSION = PROVIDER === "gemini" ? "wav" : "mp3";

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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Set GEMINI_API_KEY (or use VOICE_PROVIDER=edge).");
  }
  const model = process.env.TTS_MODEL || "gemini-3.8-flash-tts";
  const voice = overrides.voice || process.env.VOICE || "Charon";
  const style = process.env.VOICE_STYLE || DEFAULT_STYLE;

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
  for (let attempt = 1; attempt <= 4; attempt++) {
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
        throw new Error("Gemini TTS response had no audio data: " + JSON.stringify(json).slice(0, 400));
      }
      let bytes = Buffer.from(last.data, "base64");
      // Unary responses are WAV with a RIFF header; if we ever get raw PCM, wrap it.
      if (bytes.subarray(0, 4).toString("ascii") !== "RIFF") {
        bytes = wrapPcmAsWav(bytes);
      }
      fs.writeFileSync(outPath, bytes);
      return;
    }

    lastError = `HTTP ${res.status} ${await res.text()}`;
    if ([400, 401, 403, 404].includes(res.status)) {
      throw new Error(
        `Gemini TTS rejected the request (${lastError.slice(0, 500)}). ` +
          "Check GEMINI_API_KEY, TTS_MODEL and whether your plan allows TTS. " +
          "To use the free fallback: set VOICE_PROVIDER=edge.",
      );
    }
    await new Promise((r) => setTimeout(r, 2500 * attempt));
  }
  throw new Error("Gemini TTS failed after retries: " + lastError.slice(0, 500));
}

function edgeSynth(text, outPath, overrides = {}) {
  const voice = overrides.voice || process.env.VOICE || "en-US-AndrewMultilingualNeural";
  const rate = process.env.RATE || "+5%";
  let lastErr = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      execFileSync(
        "python",
        ["-m", "edge_tts", "--voice", voice, `--rate=${rate}`, "--text", text, "--write-media", outPath],
        {stdio: "pipe"},
      );
      return;
    } catch (err) {
      lastErr = err;
      if (attempt < 3) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000 * attempt);
      }
    }
  }
  throw lastErr || new Error("edge-tts failed after retries");
}
let geminiQuotaExhausted = false;

/** Writes speech for `text` to outPath. Gemini is async, edge is sync; always await this. */
export async function synth(text, outPath, overrides = {}) {
  if (PROVIDER === "gemini" && !geminiQuotaExhausted) {
    try {
      await geminiSynth(text, outPath, overrides);
    } catch (err) {
      if (
        err.message.includes("429") ||
        err.message.includes("Rate limit") ||
        err.message.includes("too_many_requests")
      ) {
        geminiQuotaExhausted = true;
        console.warn("\n[Notice] Gemini TTS daily limit reached. Seamlessly using edge-tts voiceover...\n");
        edgeSynth(text, outPath, overrides);
      } else {
        throw err;
      }
    }
  } else {
    edgeSynth(text, outPath, overrides);
  }
}

export function durationSeconds(mediaPath) {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mediaPath],
    {encoding: "utf8"},
  );
  return parseFloat(out.trim());
}

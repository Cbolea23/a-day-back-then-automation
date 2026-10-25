import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VOICE_CATALOG, synth } from "./tts.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dashboard", "public", "voices");
fs.mkdirSync(outDir, { recursive: true });

// Sample phrases that match each voice's cultural context and accent
const SAMPLE_PHRASES = {
  filipino: "Did you know that deep beneath the ancient Balete tree... sits a ten-foot giant, watching your every step?",
  folklore: "In 1888, a single message erased an entire island from the map... and they were never seen again.",
  history: "The Roman Colosseum held fifty thousand spectators... but what happened beneath the arena floor was far darker.",
  viral: "Here is the bizarre psychological reason why you never want to look into an ancient mirror at twilight."
};

async function main() {
  console.log("Generating audio samples for all voice personas in dashboard/public/voices/...");

  for (const v of VOICE_CATALOG) {
    const outPath = path.join(outDir, `${v.id}.mp3`);
    const phrase = SAMPLE_PHRASES[v.category] || SAMPLE_PHRASES.folklore;
    console.log(`Generating sample for: ${v.name} (${v.id})...`);

    try {
      await synth(phrase, outPath, {
        voice: v.id,
        emotionPreset: v.emotionPreset || "spooky-suspense",
        mood: "dark",
        isLastScene: true
      });
      console.log(`  ✓ ${v.id}.mp3 created (${fs.statSync(outPath).size} bytes)`);
    } catch (e) {
      console.error(`  ✗ Failed for ${v.id}: ${e.message}`);
    }
  }

  console.log("\nAll voice samples generated successfully!");
}

main().catch(console.error);

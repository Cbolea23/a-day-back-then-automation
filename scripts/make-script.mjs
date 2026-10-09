#!/usr/bin/env node
/**
 * Generates Short scripts (JSON) from topics.json with ONE Gemini call per batch
 * of topics, so the style rules are only sent once per batch (saves tokens).
 *
 * Usage:
 *   GEMINI_API_KEY=xxx node scripts/make-script.mjs
 *   node scripts/make-script.mjs --only roman-toilets,gladiator-day
 *   node scripts/make-script.mjs --batch 5 --force
 *
 * Env:
 *   GEMINI_API_KEY   required
 *   GEMINI_MODEL     optional, default "gemini-2.5-flash" (use any current cheap/fast model)
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const force = args.includes("--force");
const batchSize = Number(getArg("batch", "5"));
const only = getArg("only", "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Set GEMINI_API_KEY first (https://aistudio.google.com/apikey).");
  process.exit(1);
}
const CANDIDATE_MODELS = process.env.GEMINI_MODEL
  ? [process.env.GEMINI_MODEL]
  : ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-3-flash-preview", "gemini-3.7-flash"];

const config = JSON.parse(fs.readFileSync(path.join(root, "topics.json"), "utf8"));
const channelName = config.channelName || "A Day Back Then";

// Same art style on every prompt keeps the look consistent. No characters in the
// image: the narrator is layered on top by Remotion so he never drifts off-model.
const IMAGE_STYLE =
  "2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, " +
  "vertical 9:16, no people in the foreground, no text, no logos";

const STYLE_RULES = `
You write scripts for 40-50 second vertical history Shorts.
Rules:
- Second person, present tense ("You wake up...").
- 100-125 words total, split into 6-8 scenes. One idea or one fact per scene.
- Scene 1 is the hook: a vivid or surprising situation in under 16 words. No greetings, no channel intro.
- Plain, spoken, curious tone with light humor. Short sentences.
- Only claim things historians or archaeologists broadly support. Hedge uncertain things ("many Romans", "probably").
- Never invent quotes, exact statistics or names. No graphic gore.
- Last scene: a payoff or a cliffhanger that invites a follow-up Short.
- "hook" is 3-8 words, big on-screen text, a question or a surprising statement.
- "mood" is one of: day, night, warm, dark, cool.
- "imagePrompt" describes only the setting/background for the scene (no characters).
- "claimsToVerify" lists every factual claim a human should double-check before posting.
Return ONLY valid JSON: an array with one object per requested topic:
[{"slug": "...", "hook": "...", "scenes": [{"text": "...", "mood": "...", "imagePrompt": "..."}], "claimsToVerify": ["..."]}]
`.trim();

async function callGemini(prompt) {
  for (const m of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;
      const res = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json", "x-goog-api-key": apiKey},
        body: JSON.stringify({
          contents: [{role: "user", parts: [{text: prompt}]}],
          generationConfig: {responseMimeType: "application/json", temperature: 0.9},
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
        try {
          return JSON.parse(text);
        } catch {
          console.warn(`[${m}] Attempt ${attempt}: response was not valid JSON, retrying...`);
        }
      } else {
        console.warn(`[${m}] Attempt ${attempt}: HTTP ${res.status}`);
        if (res.status === 429) {
          // Quota exceeded for this model, move to next
          break;
        }
        if (res.status === 400 || res.status === 403 || res.status === 404) {
          break;
        }
      }
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  throw new Error("Gemini did not return usable JSON from candidate models.");
}

const wordCount = (scenes) =>
  scenes.reduce((n, s) => n + s.text.trim().split(/\s+/).filter(Boolean).length, 0);

const topics = config.topics.filter(
  (t) =>
    (only.length === 0 || only.includes(t.slug)) &&
    (force || !fs.existsSync(path.join(outDir, `${t.slug}.json`))),
);

if (topics.length === 0) {
  console.log("Nothing to do (all scripts exist). Use --force to regenerate.");
  process.exit(0);
}

for (let i = 0; i < topics.length; i += batchSize) {
  const batch = topics.slice(i, i + batchSize);
  const list = batch
    .map((t, n) => `${n + 1}. slug="${t.slug}" | title="${t.title}" | format=${t.format} | angle: ${t.angle}`)
    .join("\n");
  const prompt = `${STYLE_RULES}\n\nTopics:\n${list}`;

  console.log(`Generating ${batch.map((t) => t.slug).join(", ")} ...`);
  const result = await callGemini(prompt);
  const items = Array.isArray(result) ? result : [result];

  for (const topic of batch) {
    const item = items.find((x) => x.slug === topic.slug);
    if (!item || !Array.isArray(item.scenes) || item.scenes.length < 4) {
      console.warn(`  ! ${topic.slug}: missing or too short, skipped (re-run with --only ${topic.slug})`);
      continue;
    }
    const words = wordCount(item.scenes);
    if (words < 80 || words > 150) {
      console.warn(`  ! ${topic.slug}: ${words} words (target 100-125). Check it.`);
    }
    const script = {
      slug: topic.slug,
      title: topic.title,
      hook: item.hook,
      channelName,
      scenes: item.scenes.map((s) => ({
        text: s.text,
        mood: s.mood || "warm",
        imagePrompt: `${s.imagePrompt}. ${IMAGE_STYLE}`,
      })),
      claimsToVerify: item.claimsToVerify || [],
    };
    fs.writeFileSync(path.join(outDir, `${topic.slug}.json`), JSON.stringify(script, null, 2));

    const promptsTxt = script.scenes.map((s, n) => `${n + 1}. ${s.imagePrompt}`).join("\n");
    fs.writeFileSync(path.join(outDir, `${topic.slug}.prompts.txt`), promptsTxt + "\n");
    console.log(`  ✓ ${topic.slug} (${words} words, ${script.scenes.length} scenes)`);
  }
}
console.log("Done. Review each script and its claimsToVerify list before rendering.");

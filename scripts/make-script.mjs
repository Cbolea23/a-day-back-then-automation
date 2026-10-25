#!/usr/bin/env node
/**
 * Generates Short scripts (JSON) from topics.json OR custom topics using the
 * FreeLLMAPI + Multi-Provider Pool (FreeLLMAPI -> Cerebras -> Groq -> Gemini -> OpenRouter -> Pollinations).
 *
 * Usage:
 *   node scripts/make-script.mjs
 *   node scripts/make-script.mjs --only roman-toilets,gladiator-day
 *   node scripts/make-script.mjs --topic "mangkukulam" --style dark-folklore --theme albularyo
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {callSmartLLM, generateStoryScript} from "./lib/free-llm-router.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const args = process.argv.slice(2);
const getArg = (name, fallback = "") => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1] || fallback;
};
const force = args.includes("--force");
const batchSize = Number(getArg("batch", "3"));
const customTopic = getArg("topic", "");
const only = getArg("only", "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (customTopic) {
  console.log(`Generating custom story for topic: "${customTopic}" ...`);
  const script = await generateStoryScript({
    topic: customTopic,
    slug: getArg("slug", ""),
    artStyle: getArg("style", "classic-cartoon"),
    narratorTheme: getArg("theme", "auto"),
    narratorTunic: getArg("tunic", ""),
    narratorAccent: getArg("accent", ""),
    voice: getArg("voice", "en-US-ChristopherNeural"),
    language: getArg("lang", "en"),
  });
  console.log(`✓ Saved custom story to scripts-out/${script.slug}.json (${script.scenes.length} scenes via ${script.generatedBy})`);
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(path.join(root, "topics.json"), "utf8"));
const channelName = config.channelName || "A Day Back Then";

const IMAGE_STYLE =
  "2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, " +
  "vertical 9:16, no people in the foreground, no text, no logos";

const STYLE_RULES = `
You write scripts for 40-50 second vertical history and folklore Shorts.
Rules:
- Second person, present tense ("You wake up...").
- 100-125 words total, split into 6-8 scenes. One idea or one fact per scene.
- Scene 1 is the hook: a vivid or surprising situation in under 16 words. No greetings, no channel intro.
- Plain, spoken, curious tone with light humor. Short sentences.
- Only claim things historians, folklorists or archaeologists broadly support.
- Last scene: a payoff or a cliffhanger that invites a follow-up Short.
- "hook" is 3-8 words, big on-screen text, a question or a surprising statement.
- "mood" is one of: day, night, warm, dark, cool.
- "imagePrompt" describes only the setting/background for the scene (no characters).
- "claimsToVerify" lists every factual claim a human should double-check before posting.
Return ONLY valid JSON: an array with one object per requested topic:
[{"slug": "...", "hook": "...", "scenes": [{"text": "...", "mood": "...", "imagePrompt": "..."}], "claimsToVerify": ["..."]}]
`.trim();

const wordCount = (scenes) =>
  scenes.reduce((n, s) => n + s.text.trim().split(/\s+/).filter(Boolean).length, 0);

let topics = config.topics.filter(
  (t) =>
    (only.length === 0 || only.includes(t.slug)) &&
    (force || !fs.existsSync(path.join(outDir, `${t.slug}.json`))),
);

// If --only was passed for a slug that isn't in topics.json, generate it via generateStoryScript!
if (topics.length === 0 && only.length > 0) {
  for (const s of only) {
    if (!force && fs.existsSync(path.join(outDir, `${s}.json`))) continue;
    console.log(`Generating custom topic slug "${s}" via Smart AI Router...`);
    const script = await generateStoryScript({
      topic: s.replace(/-/g, " "),
      slug: s,
    });
    console.log(`  ✓ ${script.slug} (${script.scenes.length} scenes via ${script.generatedBy})`);
  }
  process.exit(0);
}

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
  const {data: result, provider, model} = await callSmartLLM({
    prompt,
    systemPrompt: "Return ONLY a valid JSON array of script objects.",
    json: true,
  });
  const items = Array.isArray(result) ? result : result?.topics || result?.scripts || [result];

  for (const topic of batch) {
    const item = items.find((x) => x?.slug === topic.slug) || (batch.length === 1 ? items[0] : null);
    if (!item || !Array.isArray(item.scenes) || item.scenes.length < 4) {
      console.warn(`  ! ${topic.slug}: missing or too short, falling back to single-story generator...`);
      const single = await generateStoryScript({topic: `${topic.title} - ${topic.angle}`, slug: topic.slug});
      console.log(`  ✓ ${single.slug} (${single.scenes.length} scenes via ${single.generatedBy})`);
      continue;
    }
    const words = wordCount(item.scenes);
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
      generatedBy: `${provider} (${model})`,
    };
    fs.writeFileSync(path.join(outDir, `${topic.slug}.json`), JSON.stringify(script, null, 2));

    const promptsTxt = script.scenes.map((s, n) => `${n + 1}. ${s.imagePrompt}`).join("\n");
    fs.writeFileSync(path.join(outDir, `${topic.slug}.prompts.txt`), promptsTxt + "\n");
    console.log(`  ✓ ${topic.slug} (${words} words, ${script.scenes.length} scenes via ${provider})`);
  }
}
console.log("Done. Review each script and its claimsToVerify list before rendering.");

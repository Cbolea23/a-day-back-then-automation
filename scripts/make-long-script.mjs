#!/usr/bin/env node
/**
 * Generates LONG-FORM (8-12 min, 16:9) video scripts from topics-long.json.
 *
 * To keep quality high and tokens low it works in small steps, and caches every step
 * so a failure or re-run never repeats finished work:
 *   1 call  -> outline (title options, cold open, chapters, closing)
 *   N calls -> one per chapter (only that chapter's facts + the previous last line)
 *
 * Output: long-out/<slug>.json (the script) and long-out/<slug>.prompts.txt (image prompts).
 *
 * Usage:
 *   GEMINI_API_KEY=xxx node scripts/make-long-script.mjs
 *   node scripts/make-long-script.mjs --only roman-day-hour-by-hour
 *   node scripts/make-long-script.mjs --force      (ignore cache, regenerate)
 *
 * Env: GEMINI_API_KEY (required), GEMINI_MODEL (default gemini-3.8-flash)
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "long-out");
const cacheRoot = path.join(outDir, ".cache");
fs.mkdirSync(cacheRoot, {recursive: true});

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const force = args.includes("--force");
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
  : ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-3-flash-preview"];
const apiBase = process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com";

const config = JSON.parse(fs.readFileSync(path.join(root, "topics-long.json"), "utf8"));
const channelName = config.channelName || "A Day Back Then";

const IMAGE_STYLE =
  "2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, " +
  "horizontal 16:9 landscape, no people in the foreground, no text, no logos";

const STYLE_RULES = `
You write scripts for narrated, illustrated history videos (8-12 minutes) for curious general viewers.
- Second person and present tense where it fits ("You wake up..."), warm, curious, light humor, short spoken sentences. It must sound like a person talking, not an encyclopedia.
- Accuracy first: only state things historians or archaeologists broadly support. Hedge uncertain things ("many", "probably", "sources suggest"). Say so plainly when evidence is thin or disputed. Never invent quotes, statistics, names or exact dates.
- No graphic gore. No modern slang that breaks the setting.
- "imagePrompt" describes ONLY the setting or background of the scene (no people in the foreground, no text, no logos).
- "mood" is one of: day, night, warm, dark, cool.
`.trim();

const wc = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callJson(prompt) {
  let lastError = "";
  for (const m of CANDIDATE_MODELS) {
    const url = `${apiBase}/v1beta/models/${m}:generateContent`;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
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
          let text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
          text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
          try {
            return JSON.parse(text);
          } catch {
            lastError = `[${m}] response was not valid JSON`;
            console.warn(`  ${lastError}, retrying...`);
          }
        } else {
          lastError = `[${m}] HTTP ${res.status}`;
          if (res.status === 429 || res.status === 503) {
            console.warn(`  ${m} busy (${res.status}), trying next model...`);
            break;
          }
        }
      } catch (err) {
        lastError = `[${m}] fetch error: ${err.message}`;
      }
      await sleep(1500 * attempt);
    }
  }
  throw new Error("Gemini did not return usable JSON after trying models: " + lastError);
}

async function cached(file, producer) {
  if (!force && fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  }
  const value = await producer();
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
  await sleep(800);
  return value;
}

const topics = config.topics.filter(
  (t) =>
    (only.length === 0 || only.includes(t.slug)) &&
    (force || only.length > 0 || !fs.existsSync(path.join(outDir, `${t.slug}.json`))),
);

if (topics.length === 0) {
  console.log("Nothing to do (all long scripts exist). Use --only <slug> or --force.");
  process.exit(0);
}

for (const topic of topics) {
  const minutes = topic.targetMinutes || 10;
  const totalWords = minutes * 150;
  const chapterCount = Math.min(9, Math.max(5, Math.round(minutes * 0.7)));
  const chapterWords = Math.round((totalWords - 100) / chapterCount);
  const cacheDir = path.join(cacheRoot, topic.slug);
  fs.mkdirSync(cacheDir, {recursive: true});
  console.log(`\n${topic.slug}: ~${minutes} min, ${chapterCount} chapters`);

  // ---- 1) Outline -------------------------------------------------------
  const outline = await cached(path.join(cacheDir, "outline.json"), async () => {
    console.log("  outline ...");
    return callJson(`${STYLE_RULES}

TASK: OUTLINE
Topic: "${topic.title}"  |  format: ${topic.format}
Angle: ${topic.angle}
Plan a ${minutes}-minute video with exactly ${chapterCount} chapters.
Return ONLY JSON:
{
 "titleOptions": ["3 YouTube titles, curiosity-driven, under 70 characters, no false promises"],
 "thumbnailIdea": "one sentence",
 "coldOpen": "35-50 words. A vivid situation that makes the viewer want to stay. No greeting, no channel intro.",
 "coldOpenMood": "mood",
 "coldOpenImagePrompt": "setting only",
 "chapters": [{"title": "short chapter title", "summary": "1-2 sentences", "keyFacts": ["3-5 specific, well-supported facts to cover"]}],
 "closing": "35-50 words. A satisfying wrap-up, then one natural line inviting the viewer to subscribe and a tease of a related video.",
 "closingMood": "mood",
 "closingImagePrompt": "setting only"
}`);
  });

  if (!Array.isArray(outline.chapters) || outline.chapters.length < 3) {
    console.warn(`  ! ${topic.slug}: outline had too few chapters, skipping (re-run with --force).`);
    continue;
  }

  // ---- 2) Chapters ------------------------------------------------------
  const outlineTitles = outline.chapters.map((c, i) => `${i + 1}. ${c.title}`).join("\n");
  const chapters = [];
  let previousLast = outline.coldOpen;
  for (let i = 0; i < outline.chapters.length; i++) {
    const ch = outline.chapters[i];
    const result = await cached(path.join(cacheDir, `chapter-${i + 1}.json`), async () => {
      console.log(`  chapter ${i + 1}/${outline.chapters.length}: ${ch.title}`);
      return callJson(`${STYLE_RULES}

TASK: CHAPTER
Video: "${topic.title}"
All chapters:
${outlineTitles}

Write chapter ${i + 1}: "${ch.title}"
Summary: ${ch.summary}
Facts to cover (use only these plus common knowledge you are sure of): ${(ch.keyFacts || []).join(" | ")}
The previous part ended with: "${previousLast}"

Rules:
- ${Math.round(chapterWords * 0.9)}-${Math.round(chapterWords * 1.1)} words in total, split into 5-7 scenes of 28-45 words each.
- Continue naturally from the previous part. No greeting. Do not summarize at the end. Do not name the next chapter.
- The FIRST scene must have an "imagePrompt". Add one more "imagePrompt" only on a scene where the setting really changes (maximum 2 per chapter). Other scenes have none.
- Every scene has a "mood".
Return ONLY JSON:
{"scenes": [{"text": "...", "mood": "...", "imagePrompt": "(only when required)"}], "claimsToVerify": ["each factual claim a human should double-check"]}`);
    });
    if (!Array.isArray(result.scenes) || result.scenes.length === 0) {
      throw new Error(`Chapter ${i + 1} came back empty. Re-run with --force.`);
    }
    chapters.push({meta: ch, ...result});
    previousLast = result.scenes[result.scenes.length - 1].text;
  }

  // ---- 3) Assemble ------------------------------------------------------
  const scenes = [];
  scenes.push({
    text: outline.coldOpen,
    mood: outline.coldOpenMood || "night",
    imagePrompt: outline.coldOpenImagePrompt || `Setting for: ${topic.title}`,
    chapterTitle: "Intro",
    chapterNumber: 0,
  });
  chapters.forEach((c, i) => {
    c.scenes.forEach((s, j) => {
      const scene = {text: s.text, mood: s.mood || "warm"};
      if (s.imagePrompt) {
        scene.imagePrompt = s.imagePrompt;
      }
      if (j === 0) {
        scene.chapterTitle = c.meta.title;
        scene.chapterNumber = i + 1;
        if (!scene.imagePrompt) {
          scene.imagePrompt = `Setting for: ${c.meta.title}, ${topic.title}`;
        }
      }
      scenes.push(scene);
    });
  });
  scenes.push({
    text: outline.closing,
    mood: outline.closingMood || "night",
    imagePrompt: outline.closingImagePrompt || `Setting at dusk for: ${topic.title}`,
    chapterTitle: "Wrap-up",
    chapterNumber: 0,
  });

  const words = scenes.reduce((n, s) => n + wc(s.text), 0);
  const estMinutes = words / 150;
  if (estMinutes < minutes * 0.75 || estMinutes > minutes * 1.3) {
    console.warn(`  ! ${words} words (~${estMinutes.toFixed(1)} min) vs target ${minutes} min. Check it.`);
  }

  const script = {
    slug: topic.slug,
    title: (outline.titleOptions && outline.titleOptions[0]) || topic.title,
    titleOptions: outline.titleOptions || [topic.title],
    thumbnailIdea: outline.thumbnailIdea || "",
    hook: topic.title,
    channelName,
    format: "long",
    targetMinutes: minutes,
    scenes,
    claimsToVerify: chapters.flatMap((c) =>
      (c.claimsToVerify || []).map((x) => `[${c.meta.title}] ${x}`),
    ),
  };
  fs.writeFileSync(path.join(outDir, `${topic.slug}.json`), JSON.stringify(script, null, 2));

  const slots = scenes.filter((s) => s.imagePrompt);
  const promptsTxt = slots
    .map((s, n) => `${n + 1}. [${s.chapterTitle || "continued"}] ${s.imagePrompt}. ${IMAGE_STYLE}`)
    .join("\n");
  fs.writeFileSync(path.join(outDir, `${topic.slug}.prompts.txt`), promptsTxt + "\n");

  console.log(`  ✓ ${topic.slug}: ${scenes.length} scenes, ${words} words (~${estMinutes.toFixed(1)} min), ${slots.length} images to make`);
}

console.log("\nDone. Read each script and check its claimsToVerify list before building.");

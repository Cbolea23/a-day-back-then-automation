#!/usr/bin/env node
/**
 * Finishes a LONG-FORM video once its images are saved:
 *   1) checks every image slot has a file in public/images/long/<slug>/<n>.(png|jpg|jpeg|webp)
 *   2) links images into the script (a scene without its own image reuses the previous one)
 *   3) makes the voiceover (skips scenes already voiced, so you can resume)
 *   4) writes out/long-<slug>.description.txt (title options, chapter timestamps, reminders)
 *   5) renders out/long-<slug>.mp4 (1920x1080)
 *
 * Usage: node scripts/build-long.mjs <slug> [flags]
 *   --allow-gradient  render even if some image slots are missing
 *   --no-voice        skip voiceover
 *   --force-voice     regenerate all voiceover
 *   --no-render       prepare everything but don't render
 *   --draft           half-size render for a quick check (much faster)
 */
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const flag = (n) => args.includes(`--${n}`);

if (!slug) {
  console.error("Usage: npm run build-long -- <slug>");
  process.exit(1);
}

const scriptFile = path.join(root, "long-out", `${slug}.json`);
if (!fs.existsSync(scriptFile)) {
  console.error(`No script at long-out/${slug}.json. Run "npm run script:long" first.`);
  process.exit(1);
}
const readScript = () => JSON.parse(fs.readFileSync(scriptFile, "utf8"));
let script = readScript();

// ---- 1+2) image slots -----------------------------------------------------
const EXTS = ["png", "jpg", "jpeg", "webp"];
const findImage = (k) => {
  for (const e of EXTS) {
    const p1 = `long/${slug}/${k}.${e}`;
    if (fs.existsSync(path.join(root, "public", p1))) return p1;
    const p2 = `images/long/${slug}/${k}.${e}`;
    if (fs.existsSync(path.join(root, "public", p2))) return p2;
  }
  return undefined;
};

let slot = 0;
const missing = [];
let lastImage;
for (const scene of script.scenes) {
  if (scene.imagePrompt) {
    slot++;
    const rel = findImage(slot);
    if (rel) {
      scene.image = rel;
      lastImage = rel;
    } else {
      missing.push(slot);
      delete scene.image;
      lastImage = undefined;
    }
  } else if (lastImage) {
    scene.image = lastImage;
  } else {
    delete scene.image;
  }
}

if (missing.length && !flag("allow-gradient")) {
  console.error(
    `Missing image(s) number ${missing.join(", ")} of ${slot}.\n` +
      `Save them as public/long/${slug}/<number>.png (or public/images/long/${slug}/<number>.png) (prompts: long-out/${slug}.prompts.txt),\n` +
      `or add --allow-gradient to render with plain backgrounds.`,
  );
  process.exit(1);
}
fs.writeFileSync(scriptFile, JSON.stringify(script, null, 2));
console.log(`Images linked: ${slot - missing.length}/${slot} slots.`);

// ---- 3) voiceover ---------------------------------------------------------
if (flag("no-voice")) {
  console.log("(Skipping voiceover.)");
} else {
  console.log("\n=== Voiceover ===");
  const voiceArgs = [path.join("scripts", "make-voice.mjs"), slug, "--dir", "long-out"];
  if (flag("force-voice")) {
    voiceArgs.push("--force");
  }
  const v = spawnSync(process.execPath, voiceArgs, {cwd: root, stdio: "inherit"});
  if (v.status !== 0) {
    console.error('\nStopped: voiceover failed. Run the same command again to resume where it stopped.');
    process.exit(v.status || 1);
  }
  script = readScript();
}

// ---- 4) description / timestamps ------------------------------------------
const secondsOf = (s) => {
  if (s.seconds && s.seconds > 0) {
    return s.seconds;
  }
  const words = s.text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round((words / 2.6) * 10) / 10);
};
const fmt = (t) => {
  const total = Math.round(t);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = String(total % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};

let t = 0;
const stamps = [];
for (const s of script.scenes) {
  if (s.chapterTitle) {
    stamps.push(`${fmt(t)} ${s.chapterTitle}`);
  }
  t += Math.round(secondsOf(s) * 30) / 30;
}

let related = [];
try {
  const topics = JSON.parse(fs.readFileSync(path.join(root, "topics-long.json"), "utf8"));
  related = topics.topics.find((x) => x.slug === slug)?.relatedShorts || [];
} catch {
  // topics file is optional here
}

// Load published short URLs if available
let publishedUrls = {};
try {
  const pPath = path.join(root, "published-urls.json");
  if (fs.existsSync(pPath)) {
    publishedUrls = JSON.parse(fs.readFileSync(pPath, "utf8"));
  }
} catch {}

const cleanSlug = slug.replace(/^long-/, "");
const eraTag = cleanSlug.startsWith("roman") || cleanSlug.startsWith("gladiator")
  ? "#AncientRome"
  : cleanSlug.startsWith("egypt")
  ? "#AncientEgypt"
  : cleanSlug.startsWith("greek") || cleanSlug.startsWith("athens") || cleanSlug.startsWith("spartan")
  ? "#AncientGreece"
  : cleanSlug.startsWith("medieval") || cleanSlug.startsWith("knight")
  ? "#MedievalHistory"
  : "#AncientHistory";

const relatedSection = [];
if (related.length) {
  relatedSection.push("🏛️ RELATED SHORTS:");
  for (const r of related) {
    const known = publishedUrls[r];
    const link = known?.url || "https://youtube.com/@adaybackthenofficial/shorts";
    const title =
      known?.title?.replace(/#shorts/gi, "")?.trim() ||
      r.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    relatedSection.push(`• ${title}: ${link}`);
  }
  relatedSection.push("");
}

const introHook = script.hook || script.title;

const vaultDir = path.join(root, "out", "Longform", "2 - Unpublished Vault");
fs.mkdirSync(vaultDir, {recursive: true});
const descFile = path.join(vaultDir, `long-${slug}.description.txt`);
fs.writeFileSync(
  descFile,
  [
    `${introHook}. Long before modern technology and far from royal palaces, everyday people had to navigate survival, daily work, strange customs, and raw reality.`,
    "",
    "Step back in time to experience what life was really like in this complete, hour-by-hour historical reconstruction.",
    "",
    "⏱️ CHAPTERS:",
    ...stamps,
    "",
    "💬 QUESTION OF THE DAY:",
    "Which part of ancient daily life surprised you the most—or would you rather never experience? Drop your thoughts in the comments below!",
    "",
    ...relatedSection,
    "🔔 Subscribe to @adaybackthenofficial for daily deep-dives into ancient history!",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `${eraTag} #HistoryDocumentary #DailyLifeInHistory #History #ADayBackThen #AncientHistory`,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Note: Educational history storytelling featuring custom 2D illustration animation and narrated historical reconstruction.",
    "",
    "========================================================",
    "TITLE OPTIONS (pick one for your video title):",
    ...(script.titleOptions || [script.title]).map((x) => `- ${x}`),
    "",
    `THUMBNAIL IDEA: ${script.thumbnailIdea || "(none)"}`,
    `Total Runtime: ${fmt(t)}`,
  ].join("\n") + "\n",
);
console.log(`Wrote ${path.relative(root, descFile)} (total ${fmt(t)}).`);

// Facebook-tailored description (optimized for FB Watch / Page feed, no clunky timestamps)
const fbDescFile = path.join(vaultDir, `long-${slug}.facebook.txt`);
fs.writeFileSync(
  fbDescFile,
  [
    `${introHook}.`,
    "",
    "Long before modern technology and far from royal palaces, everyday people had to navigate survival, brutal rules, strange customs, and raw reality.",
    "",
    "Step back in time to experience what life was really like in this complete historical deep-dive.",
    "",
    "💬 QUESTION OF THE DAY:",
    "Which part of this story surprised you the most—or would you rather never experience? Drop your thoughts in the comments below!",
    "",
    "🔔 Follow A Day Back Then for daily deep-dives into ancient history!",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `${eraTag} #History #HistoryDocumentary #DailyLifeInHistory #ADayBackThen #AncientHistory`,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "📌 SUGGESTED PINNED FIRST COMMENT (links perform best in comments on Facebook):",
    "Enjoying our historical deep-dives? Subscribe on YouTube for full-length documentary episodes & shorts: https://youtube.com/@adaybackthenofficial",
  ].join("\n") + "\n",
);
console.log(`Wrote ${path.relative(root, fbDescFile)} (Facebook tailored).`);

// ---- 5) render ------------------------------------------------------------
if (flag("no-render")) {
  console.log("(Skipping render.)");
  process.exit(0);
}
console.log("\n=== Rendering (long videos take a while; --draft is much faster) ===");
const outMp4 = path.join("out", "Longform", "2 - Unpublished Vault", `long-${slug}.mp4`);
const renderArgs = [
  "remotion",
  "render",
  "src/index.ts",
  "Long",
  process.platform === "win32" ? `"${outMp4}"` : outMp4,
  `--props=long-out/${slug}.json`,
];
if (flag("draft")) {
  renderArgs.push("--scale=0.5");
}
const r = spawnSync("npx", renderArgs, {cwd: root, stdio: "inherit", shell: process.platform === "win32"});
if (r.status !== 0) {
  console.error("Render failed.");
  process.exit(r.status || 1);
}
console.log(`\nDone: out/long-${slug}.mp4`);

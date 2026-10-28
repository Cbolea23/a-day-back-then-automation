#!/usr/bin/env node
/**
 * Automated Instagram Reels Uploader & Scheduler
 * Uses the Meta Graph API via the linked Facebook Business Page.
 *
 * Requirements:
 *   1. An Instagram Business or Creator account connected to your Facebook Page:
 *      (Facebook Page -> Settings -> Linked Accounts -> Instagram -> Connect)
 *   2. facebook-tokens.json in the project root (already configured).
 *
 * Usage:
 *   # Upload & publish immediately:
 *   node scripts/upload-instagram.mjs roman-toilets
 *
 *   # Schedule for a future date (UTC ISO-8601 string):
 *   node scripts/upload-instagram.mjs roman-toilets --schedule "2026-10-10T14:00:00Z"
 */

import fs from "node:fs";
import path from "node:path";
import {spawnSync, execSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {validateContentGovernance} from "./lib/language-governance.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenPath = path.join(root, "facebook-tokens.json");

export const FB_COOLDOWN_UNTIL_UTC = "2026-10-13T05:00:00Z"; // Oct 13, 1:00 PM Manila Time

export function checkMetaCooldown() {
  const cooldownUntil = new Date(FB_COOLDOWN_UNTIL_UTC).getTime();
  if (Date.now() < cooldownUntil && !process.argv.includes("--ignore-cooldown")) {
    const remainingHours = ((cooldownUntil - Date.now()) / (1000 * 60 * 60)).toFixed(1);
    console.warn(`\n⛔ [META / INSTAGRAM CIRCUIT BREAKER ACTIVE]`);
    console.warn(`Meta Graph API is in 24-hour anti-spam cooldown until Oct 13, 2026, 1:00 PM Manila Time (${remainingHours}h remaining).`);
    console.warn(`Because Instagram uses the linked Facebook Page token, Instagram uploads are locked to prevent account penalties.`);
    console.warn(`To override (NOT RECOMMENDED), pass --ignore-cooldown.\n`);
    return false;
  }
  return true;
}

function getCredentials() {
  if (!fs.existsSync(tokenPath)) {
    console.error("Missing facebook-tokens.json in project root.");
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
  if (!config.pageId || !config.pageAccessToken) {
    console.error("facebook-tokens.json must contain 'pageId' and 'pageAccessToken'.");
    process.exit(1);
  }
  return config;
}

const IG_QUESTIONS = [
  "Would you have survived this? Tell us why in the comments.",
  "Which fact shocked you the most? Tell us below.",
  "Could you live like this for one day? Be honest.",
  "What era should we time-travel to next?",
  "Did you know this before watching?",
  "True or false: you could handle this life.",
];

const IG_CTAS = [
  "Follow @adaybackthenofficial for daily history deep-dives!",
  "Follow @adaybackthenofficial for a new time trip every day!",
  "Follow @adaybackthenofficial for your daily trip back in time!",
];

function pickBySlug(arr, slug) {
  let h = 0;
  for (const ch of String(slug)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return arr[h % arr.length];
}

export function buildInstagramCaption(script, slug) {
  // Extract hook and first dialogue lines
  const rawHook = script.hook || script.title || "";
  const firstLines = script.scenes && script.scenes.length
    ? script.scenes.slice(0, 2).map((s) => s.text).join(" ")
    : "";

  // Human-crafted curiosity hooks without AI clichés ("Did you know?", "Have you ever wondered?")
  let cleanHook = rawHook
    .replace(/^did you know\??\s*/i, "")
    .replace(/^have you ever wondered\??\s*/i, "")
    .replace(/^in this video,?\s*/i, "")
    .trim();

  // Natural commentary body
  const body = script.description || firstLines;

  // Era-specific authentic hashtags
  const tags = ["#ADayBackThen", "#history", "#ancienthistory", "#reels"];
  if (slug.includes("roman") || slug.includes("garum")) tags.push("#AncientRome", "#Pompeii", "#RomanEmpire");
  if (slug.includes("gladiator")) tags.push("#Colosseum", "#Gladiator", "#AncientRome");
  if (slug.includes("spartan") || slug.includes("greek") || slug.includes("athens")) tags.push("#AncientGreece", "#Sparta");
  if (slug.includes("egypt")) tags.push("#AncientEgypt", "#Pharaoh", "#Pyramids");
  if (slug.includes("medieval") || slug.includes("monk") || slug.includes("blacksmith")) tags.push("#MiddleAges", "#MedievalHistory");
  if (slug.includes("viking")) tags.push("#Vikings", "#NorseHistory");
  if (slug.includes("pirate")) tags.push("#PirateHistory", "#AgeOfSail");
  if (slug.includes("samurai") || slug.includes("edo") || slug.includes("ninja")) tags.push("#FeudalJapan", "#Samurai");
  if (slug.includes("victorian")) tags.push("#VictorianEra", "#LondonHistory");
  if (slug.includes("wwii")) tags.push("#WW2History", "#HistoryTok");

  const question = pickBySlug(IG_QUESTIONS, slug);
  const cta = pickBySlug(IG_CTAS, slug);

  return [
    cleanHook,
    "",
    body,
    "",
    question,
    "",
    cta,
    "",
    Array.from(new Set(tags)).join(" ")
  ].filter(Boolean).join("\n");
}

/**
 * Retrieves the linked Instagram Business/Creator Account ID
 */
export async function getInstagramAccountId() {
  const {pageId, pageAccessToken} = getCredentials();
  const url = `https://graph.facebook.com/v20.0/${pageId}?fields=instagram_business_account,page_backed_instagram_accounts&access_token=${pageAccessToken}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    throw new Error(`Meta API error: ${data.error.message}`);
  }

  if (data.instagram_business_account && data.instagram_business_account.id) {
    return data.instagram_business_account.id;
  }

  if (data.page_backed_instagram_accounts && data.page_backed_instagram_accounts.data && data.page_backed_instagram_accounts.data.length > 0) {
    return data.page_backed_instagram_accounts.data[0].id;
  }

  return null;
}

/**
 * Uploads and publishes or schedules an Instagram Reel via Meta Graph API
 */
export async function uploadInstagramReel(slug, options = {}) {
  if (!checkMetaCooldown()) {
    process.exitCode = 0;
    return { skipped: true, reason: "Meta cooldown active" };
  }

  const {pageAccessToken} = getCredentials();

  // 1. Check for linked Instagram Account
  const igUserId = await getInstagramAccountId();
  if (!igUserId) {
    console.error("\n========================================================");
    console.error("❌ Instagram Account Not Linked Yet!");
    console.error("========================================================");
    console.error("To link your Instagram account to your Facebook Page:");
    console.error("1. Open Facebook -> Your Page 'A Day Back Then'");
    console.error("2. Go to: Settings -> Linked Accounts -> Instagram");
    console.error("3. Click 'Connect Account' and log in to @adaybackthenofficial");
    console.error("4. Ensure your Instagram is set to a free Creator or Business account.");
    console.error("========================================================\n");
    process.exit(1);
  }

  // 2. Locate video file
  const candidatePaths = [
    path.join(root, "out", `${slug}.mp4`),
    path.join(root, "out", "1 - Published", `${slug}.mp4`),
    path.join(root, "out", "2 - Unpublished Vault", `${slug}.mp4`),
  ];
  const videoPath = candidatePaths.find((p) => fs.existsSync(p));

  if (!videoPath) {
    throw new Error(`Video file for ${slug} not found in out/ folders.`);
  }

  // Pre-process stream for Instagram Reels ingest standards (faststart + yuv420p Rec.709)
  let activeVideoPath = videoPath;
  const initialStats = fs.statSync(videoPath);
  if (initialStats.size > 35 * 1024 * 1024) {
    const optDir = path.join(root, "out", ".ig-optimized");
    fs.mkdirSync(optDir, {recursive: true});
    const optPath = path.join(optDir, `${slug}.mp4`);
    if (!fs.existsSync(optPath)) {
      console.log(`Optimizing ${slug} for Instagram ingest (faststart + standard yuv420p)...`);
      spawnSync("ffmpeg", [
        "-i", videoPath,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-colorspace", "bt709",
        "-color_primaries", "bt709",
        "-color_trc", "bt709",
        "-movflags", "+faststart",
        "-c:a", "aac",
        "-b:a", "192k",
        optPath,
        "-y"
      ], { stdio: "ignore" });
    }
    if (fs.existsSync(optPath)) {
      activeVideoPath = optPath;
    }
  }

  // 3. Load metadata and build caption
  let script = {title: slug};
  const scriptPath = path.join(root, "scripts-out", `${slug}.json`);
  if (fs.existsSync(scriptPath)) {
    script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
  }
  const caption = options.caption || buildInstagramCaption(script, slug);
  validateContentGovernance(options.channel || "adaybackthen", caption, "Instagram Reel caption");

  console.log("\n========================================================");
  console.log(`   Uploading to Instagram Reels: ${slug}`);
  console.log("========================================================");
  console.log(`IG Account:  ${igUserId}`);
  console.log(`Video File:  ${activeVideoPath}`);
  console.log(`Caption:\n${caption}`);
  console.log("--------------------------------------------------------");

  // Step 1: Create an IG Media Container using resumable video upload
  console.log("1. Initializing Instagram Media Container...");
  const stats = fs.statSync(activeVideoPath);
  const fileSize = stats.size;

  const initUrl = `https://graph.facebook.com/v20.0/${igUserId}/media`;
  const initPayload = {
    media_type: "REELS",
    upload_type: "resumable",
    caption,
    share_to_feed: true,
    access_token: pageAccessToken,
  };

  const initRes = await fetch(initUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(initPayload),
  });

  const initData = await initRes.json();
  if (!initRes.ok || !initData.id || !initData.uri) {
    throw new Error(`Failed to initialize Instagram upload container: ${JSON.stringify(initData)}`);
  }

  const creationId = initData.id;
  const uploadUri = initData.uri;
  console.log(`✓ Media container created (ID: ${creationId})`);

  // Step 2: Upload video binary to uploadUri via curl.exe (Meta rupload standard)
  console.log(`2. Uploading ${fileSize} bytes to Instagram servers...`);
  try {
      const curlCmd = process.platform === "win32" ? "curl.exe" : "curl";
    const curlOut = execSync(`"${curlCmd}" -s -X POST "${uploadUri}" -H "Authorization: OAuth ${pageAccessToken}" -H "offset: 0" -H "file_size: ${fileSize}" -H "Content-Type: application/octet-stream" --data-binary "@${activeVideoPath}"`,
      { encoding: "utf8" }
    );
    console.log("✓ Video stream transfer submitted to Meta.");
  } catch (err) {
    throw new Error(`Instagram binary upload via curl failed: ${err.message}`);
  }

  // Step 3: Wait for Meta to finish processing video
  console.log("3. Waiting for Instagram processing...");
  let ready = false;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 4000));
    const statusRes = await fetch(`https://graph.facebook.com/v20.0/${creationId}?fields=status_code&access_token=${pageAccessToken}`);
    const statusData = await statusRes.json();

    if (statusData.status_code === "FINISHED") {
      ready = true;
      console.log("✓ Processing complete.");
      break;
    }
    if (statusData.status_code === "ERROR") {
      throw new Error(`Instagram container processing failed: ${JSON.stringify(statusData)}`);
    }
    process.stdout.write(".");
  }

  if (!ready) {
    throw new Error("Timeout waiting for Instagram media container to finish processing.");
  }

  // Step 4: Publish Reel
  console.log("4. Publishing Reel to Instagram...");
  const publishUrl = `https://graph.facebook.com/v20.0/${igUserId}/media_publish`;
  const publishRes = await fetch(publishUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      creation_id: creationId,
      access_token: pageAccessToken,
    }),
  });

  const publishData = await publishRes.json();
  if (!publishRes.ok || !publishData.id) {
    throw new Error(`Failed to publish to Instagram: ${JSON.stringify(publishData)}`);
  }

  const mediaId = publishData.id;
  console.log("\n========================================================");
  console.log("   Instagram Reel Published! 🎉");
  console.log("========================================================");
  console.log(`Media ID:    ${mediaId}`);
  console.log("========================================================\n");

  recordPublished(slug, {
    mediaId,
    type: "instagram_reel",
    publishedAt: new Date().toISOString(),
  });

  return {mediaId};
}

function recordPublished(slug, info) {
  const file = path.join(root, "published-urls-instagram.json");
  let data = {};
  if (fs.existsSync(file)) {
    try {
      data = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {}
  }
  data[slug] = info;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// CLI Execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith("--")) || "sample-roman-morning";

  let schedule = null;
  const schedIdx = args.indexOf("--schedule");
  if (schedIdx !== -1 && args[schedIdx + 1]) {
    schedule = args[schedIdx + 1];
  }

  uploadInstagramReel(slug, {schedule}).catch((err) => {
    console.error("\n❌ Instagram upload failed:", err.message);
    process.exit(1);
  });
}

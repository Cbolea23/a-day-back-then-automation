#!/usr/bin/env node
/**
 * Facebook Video Uploader (Shorts / Reels & Long-Form Page Videos)
 *
 * Usage:
 *   # Short-form Reel (9:16 vertical):
 *   node scripts/upload-facebook.mjs roman-toilets
 *   node scripts/upload-facebook.mjs gladiator-day --schedule "2026-10-10T17:00:00Z"
 *
 *   # Long-form Page Video (16:9 widescreen, 8-12+ min):
 *   node scripts/upload-facebook.mjs gladiator-real-life --long
 *   node scripts/upload-facebook.mjs roman-day-hour-by-hour --long
 *   node scripts/upload-facebook.mjs roman-survive-a-week --long --draft
 */

import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {isThrottleError, THROTTLE_EXIT_CODE} from "./fb-throttle.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenPath = path.join(root, "facebook-tokens.json");
const CHUNK_SIZE = 25 * 1024 * 1024; // 25 MB chunk for resumable upload

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

// -----------------------------------------------------------------------------
// SHORT-FORM REELS
// -----------------------------------------------------------------------------
export function buildReelCaption(script, slug) {
  const hook = script.hook || script.title || "Did you know?";
  const hashtags = ["#history", "#ancienthistory", "#historyfacts", "#reels", "#ADayBackThen"];

  if (slug.includes("roman")) hashtags.push("#ancientrome");
  if (slug.includes("gladiator")) hashtags.push("#colosseum");
  if (slug.includes("medieval") || slug.includes("peasant") || slug.includes("castle")) hashtags.push("#middleages");
  if (slug.includes("viking")) hashtags.push("#vikings");
  if (slug.includes("egypt")) hashtags.push("#ancientegypt");
  if (slug.includes("greek") || slug.includes("athens") || slug.includes("sparta")) hashtags.push("#ancientgreece");
  if (slug.includes("samurai") || slug.includes("edo") || slug.includes("ninja")) hashtags.push("#japanhistory");
  if (slug.includes("pirate")) hashtags.push("#pirates");
  if (slug.includes("wwii")) hashtags.push("#ww2");
  if (slug.includes("victorian")) hashtags.push("#victorian");
  if (slug.includes("ottoman")) hashtags.push("#ottoman");

  const tagString = Array.from(new Set(hashtags)).slice(0, 6).join(" ");
  const cta = pickBySlug(CTAS_FB, slug);
  const question = pickBySlug(QUESTIONS, slug);

  let body = "";
  const firstScene = script.scenes && script.scenes[0] ? script.scenes[0].text : "";
  if (firstScene && (hook.length + firstScene.length) <= 220) {
    body = `\n\n${firstScene}`;
  }

  let full = `${hook}${body}\n\n💬 ${question}\n\n${cta}\n\n${tagString}`;

  // Ensure strict compliance with Facebook's 10-400 character requirement
  if (full.length > 390) {
    full = full.slice(0, 385) + "...";
  }
  return full;
}

// Rotating engagement questions and CTAs so 90+ scheduled posts don't read
// identically. Deterministic per slug so a caption never changes between runs.
const QUESTIONS = [
  "Would you have survived this? Tell us why 👇",
  "Which fact shocked you the most? 👇",
  "Could you live like this for one day? Be honest 👇",
  "What era should we time-travel to next? 👇",
  "Did you know this before watching? 👇",
  "True or false: you could handle this life 👇",
];

const CTAS_FB = [
  "👉 Follow A Day Back Then for daily history!",
  "🔔 Follow A Day Back Then — a new time trip every day!",
  "👉 Follow for your daily trip back in time!",
];

export function pickBySlug(arr, slug) {
  let h = 0;
  for (const ch of String(slug)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return arr[h % arr.length];
}

export async function uploadReel(slug, options = {}) {
  const {pageId, pageAccessToken, pageName} = getCredentials();
  const cleanSlug = slug.replace(/^long-/, "");
  const candidatePaths = [
    path.join(root, "out", `${cleanSlug}.mp4`),
    path.join(root, "out", "1 - Published", `${cleanSlug}.mp4`),
    path.join(root, "out", "2 - Unpublished Vault", `${cleanSlug}.mp4`),
    path.join(root, "out", "Published", `${cleanSlug}.mp4`),
    path.join(root, "out", "Unpublished Vault", `${cleanSlug}.mp4`),
  ];
  const videoPath = candidatePaths.find((p) => fs.existsSync(p));

  if (!videoPath) {
    throw new Error(`Reel video for ${cleanSlug} not found in out/ or subfolders. Render it first.`);
  }

  let script = {title: cleanSlug};
  const scriptPath = path.join(root, "scripts-out", `${cleanSlug}.json`);
  if (fs.existsSync(scriptPath)) {
    script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
  }

  const caption = buildReelCaption(script, cleanSlug);
  const stats = fs.statSync(videoPath);
  const fileSize = stats.size;

  console.log("\n========================================================");
  console.log(`   Uploading to Facebook Reels: ${cleanSlug}`);
  console.log("========================================================");
  console.log(`Page:        ${pageName || pageId} (${pageId})`);
  console.log(`File:        ${videoPath} (${(fileSize / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`Caption:     ${caption.split("\n")[0]}`);
  console.log("--------------------------------------------------------");

  console.log("1. Initializing Reel upload session...");
  const initRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/video_reels`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      upload_phase: "start",
      access_token: pageAccessToken,
    }),
  });

  const initData = await initRes.json();
  if (!initRes.ok || !initData.video_id || !initData.upload_url) {
    throw new Error(`Failed to initialize upload: ${JSON.stringify(initData)}`);
  }

  const videoId = initData.video_id;
  const uploadUrl = initData.upload_url;
  console.log(`✓ Session initialized (Video ID: ${videoId})`);

  console.log("2. Uploading video stream to Meta servers...");
  const videoBuffer = fs.readFileSync(videoPath);
  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${pageAccessToken}`,
      offset: "0",
      file_size: String(fileSize),
      "Content-Type": "application/octet-stream",
    },
    body: videoBuffer,
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok || uploadData.success === false) {
    throw new Error(`Binary upload failed: ${JSON.stringify(uploadData)}`);
  }
  console.log("✓ Video stream uploaded successfully.");

  console.log("3. Publishing Reel to Facebook Page...");
  const publishPayload = {
    upload_phase: "finish",
    access_token: pageAccessToken,
    video_id: videoId,
    description: caption,
  };

  if (options.schedule) {
    const unixTimestamp = Math.floor(new Date(options.schedule).getTime() / 1000);
    publishPayload.video_state = "SCHEDULED";
    publishPayload.scheduled_publish_time = unixTimestamp;
    console.log(`   Scheduling for: ${new Date(options.schedule).toISOString()}`);
  } else {
    publishPayload.video_state = "PUBLISHED";
  }

  const finishRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/video_reels`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(publishPayload),
  });

  const finishData = await finishRes.json();
  if (!finishRes.ok || finishData.success === false) {
    throw new Error(`Failed to publish Reel: ${JSON.stringify(finishData)}`);
  }

  console.log("\n========================================================");
  console.log("   Facebook Reel Upload Complete! 🎉");
  console.log("========================================================");
  console.log(`Video ID:    ${videoId}`);
  console.log(`Watch URL:   https://www.facebook.com/watch/?v=${videoId}`);
  console.log(`Page URL:    https://www.facebook.com/${pageId}`);
  console.log(`Status:      ${publishPayload.video_state}`);
  console.log("========================================================\n");

  recordPublished(cleanSlug, {
    videoId,
    url: `https://www.facebook.com/watch/?v=${videoId}`,
    title: script.title || cleanSlug,
    type: "reel",
  });

  return {videoId, pageId, status: publishPayload.video_state};
}

// -----------------------------------------------------------------------------
// LONG-FORM PAGE VIDEOS (16:9 Widescreen, Resumable Chunked Upload)
// -----------------------------------------------------------------------------
export async function uploadLongformVideo(slug, options = {}) {
  const {pageId, pageAccessToken, pageName} = getCredentials();
  const cleanSlug = slug.replace(/^long-/, "");

  // Candidate video paths
  const candidateVideoPaths = [
    path.join(root, "out", "Longform", "2 - Unpublished Vault", `long-${cleanSlug}.mp4`),
    path.join(root, "out", "Longform", "1 - Published", `long-${cleanSlug}.mp4`),
    path.join(root, "out", "Longform", "2 - Unpublished Vault", `${cleanSlug}.mp4`),
    path.join(root, "out", "Longform", "1 - Published", `${cleanSlug}.mp4`),
  ];
  const videoPath = candidateVideoPaths.find((p) => fs.existsSync(p));

  if (!videoPath) {
    throw new Error(`Long-form video for ${cleanSlug} not found in out/Longform/. Render it first.`);
  }

  // Candidate thumbnail paths
  const candidateThumbPaths = [
    path.join(root, "out", "Longform", "2 - Unpublished Vault", `long-${cleanSlug}-thumbnail.jpg`),
    path.join(root, "out", "Longform", "1 - Published", `long-${cleanSlug}-thumbnail.jpg`),
    path.join(root, "public", "long", cleanSlug, "thumbnail.jpg"),
  ];
  const thumbPath = candidateThumbPaths.find((p) => fs.existsSync(p));

  // Script metadata & Facebook description
  let script = {title: cleanSlug};
  const scriptPath = path.join(root, "long-out", `${cleanSlug}.json`);
  if (fs.existsSync(scriptPath)) {
    script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
  }

  let description = "";
  const fbDescPath = path.join(root, "out", "Longform", "2 - Unpublished Vault", `long-${cleanSlug}.facebook.txt`);
  if (fs.existsSync(fbDescPath)) {
    const raw = fs.readFileSync(fbDescPath, "utf8");
    // Strip internal helper notes meant for humans (e.g. SUGGESTED PINNED FIRST COMMENT)
    description = raw.split(/📌\s*SUGGESTED PINNED/i)[0].trim();
  } else {
    // Generate fallback description
    const hook = script.hook || script.title || "The Untold Story of History";
    description = [
      `${hook}.`,
      "",
      "Long before modern technology and far from royal palaces, everyday people had to navigate survival, brutal rules, strange customs, and raw reality.",
      "",
      "Step back in time to experience what life was really like in this complete historical deep-dive.",
      "",
      "💬 Would you have survived back then? Tell us in the comments below!",
      "",
      "🔔 Follow A Day Back Then for daily deep-dives into ancient history!",
      "",
      "#History #HistoryDocumentary #AncientHistory #DailyLifeInHistory #ADayBackThen",
    ].join("\n");
  }

  const title = (script.titleOptions && script.titleOptions[0]) || script.title || cleanSlug;
  const stats = fs.statSync(videoPath);
  const fileSize = stats.size;

  console.log("\n========================================================");
  console.log(`   Uploading Long-Form Video to Facebook Page`);
  console.log("========================================================");
  console.log(`Slug:        ${cleanSlug}`);
  console.log(`Title:       ${title}`);
  console.log(`Page:        ${pageName || pageId} (${pageId})`);
  console.log(`Video File:  ${videoPath}`);
  console.log(`File Size:   ${(fileSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Thumbnail:   ${thumbPath ? path.basename(thumbPath) : "(none)"}`);
  console.log("--------------------------------------------------------");

  // Step 1: Start Resumable Upload Session
  console.log("1. Starting Resumable Upload session on Meta servers...");
  const startRes = await fetch(`https://graph-video.facebook.com/v20.0/${pageId}/videos`, {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: new URLSearchParams({
      upload_phase: "start",
      access_token: pageAccessToken,
      file_size: String(fileSize),
    }),
  });

  const startData = await startRes.json();
  if (!startRes.ok || !startData.upload_session_id) {
    throw new Error(`Failed to start upload session: ${JSON.stringify(startData)}`);
  }

  const uploadSessionId = startData.upload_session_id;
  const videoId = startData.video_id;
  console.log(`✓ Session initialized (ID: ${uploadSessionId}, Video ID: ${videoId})`);

  // Step 2: Transfer Video in Chunks
  console.log(`2. Streaming video in ${(CHUNK_SIZE / 1024 / 1024).toFixed(0)}MB chunks...`);
  let startOffset = Number(startData.start_offset || 0);
  const fd = fs.openSync(videoPath, "r");

  try {
    while (startOffset < fileSize) {
      const endOffset = Math.min(startOffset + CHUNK_SIZE, fileSize);
      const chunkSize = endOffset - startOffset;
      const chunkBuffer = Buffer.alloc(chunkSize);
      fs.readSync(fd, chunkBuffer, 0, chunkSize, startOffset);

      const pct = ((startOffset / fileSize) * 100).toFixed(1);
      process.stdout.write(`   [Uploading] ${pct}% (${(startOffset / 1024 / 1024).toFixed(1)} / ${(fileSize / 1024 / 1024).toFixed(1)} MB)\r`);

      const form = new FormData();
      form.append("upload_phase", "transfer");
      form.append("access_token", pageAccessToken);
      form.append("upload_session_id", uploadSessionId);
      form.append("start_offset", String(startOffset));
      form.append("video_file_chunk", new Blob([chunkBuffer]), "chunk.mp4");

      const chunkRes = await fetch(`https://graph-video.facebook.com/v20.0/${pageId}/videos`, {
        method: "POST",
        body: form,
      });

      const chunkData = await chunkRes.json();
      if (!chunkRes.ok || chunkData.error) {
        throw new Error(`Chunk transfer failed: ${JSON.stringify(chunkData)}`);
      }

      startOffset = Number(chunkData.start_offset);
    }
  } finally {
    fs.closeSync(fd);
  }
  console.log(`\n✓ 100% of ${(fileSize / 1024 / 1024).toFixed(1)} MB transferred successfully.`);

  // Step 3: Finish and Publish
  console.log("3. Finalizing metadata, thumbnail, and publishing...");
  const finishForm = new FormData();
  finishForm.append("upload_phase", "finish");
  finishForm.append("access_token", pageAccessToken);
  finishForm.append("upload_session_id", uploadSessionId);
  finishForm.append("title", title);
  finishForm.append("description", description);

  if (thumbPath && fs.existsSync(thumbPath)) {
    const thumbBuf = fs.readFileSync(thumbPath);
    finishForm.append("thumb", new Blob([thumbBuf]), "thumb.jpg");
  }

  let finalState = "PUBLISHED";
  if (options.schedule) {
    const ts = Math.floor(new Date(options.schedule).getTime() / 1000);
    finishForm.append("published", "false");
    finishForm.append("scheduled_publish_time", String(ts));
    finalState = `SCHEDULED (${new Date(options.schedule).toISOString()})`;
  } else if (options.draft) {
    finishForm.append("published", "false");
    finalState = "DRAFT";
  } else {
    finishForm.append("published", "true");
  }

  const finishRes = await fetch(`https://graph-video.facebook.com/v20.0/${pageId}/videos`, {
    method: "POST",
    body: finishForm,
  });

  const finishData = await finishRes.json();
  if (!finishRes.ok || finishData.error) {
    throw new Error(`Failed to finalize video: ${JSON.stringify(finishData)}`);
  }

  console.log("\n========================================================");
  console.log("   Facebook Long-Form Video Published! 🎉");
  console.log("========================================================");
  console.log(`Video ID:    ${videoId}`);
  console.log(`Watch URL:   https://www.facebook.com/watch/?v=${videoId}`);
  console.log(`Title:       ${title}`);
  console.log(`Status:      ${finalState}`);
  console.log("========================================================\n");

  recordPublished(cleanSlug, {
    videoId,
    url: `https://www.facebook.com/watch/?v=${videoId}`,
    title,
    type: "longform",
  });

  // If fully published and video was in Unpublished Vault, move to Published vault
  if (!options.draft && videoPath.includes("2 - Unpublished Vault")) {
    const pubDir = path.join(root, "out", "Longform", "1 - Published");
    fs.mkdirSync(pubDir, {recursive: true});
    const targetVideo = path.join(pubDir, path.basename(videoPath));
    try {
      fs.renameSync(videoPath, targetVideo);
      console.log(`📁 Moved video to: ${path.relative(root, targetVideo)}`);
      if (thumbPath && thumbPath.includes("2 - Unpublished Vault")) {
        const targetThumb = path.join(pubDir, path.basename(thumbPath));
        fs.renameSync(thumbPath, targetThumb);
        console.log(`📁 Moved thumbnail to: ${path.relative(root, targetThumb)}`);
      }
    } catch (e) {
      console.warn("Could not move video file:", e.message);
    }
  }

  return {videoId, pageId, status: finalState};
}

function recordPublished(slug, info) {
  const file = path.join(root, "published-urls-facebook.json");
  let data = {};
  if (fs.existsSync(file)) {
    try {
      data = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {}
  }
  data[slug] = {
    ...info,
    publishedAt: new Date().toISOString(),
  };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`Saved publication record to published-urls-facebook.json`);
}

// -----------------------------------------------------------------------------
// CLI EXECUTION
// -----------------------------------------------------------------------------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const isLong = args.includes("--long");
  const isDraft = args.includes("--draft");
  const slug = args.find((a) => !a.startsWith("--")) || "sample-roman-morning";

  let schedule = null;
  const schedIdx = args.indexOf("--schedule");
  if (schedIdx !== -1 && args[schedIdx + 1]) {
    schedule = args[schedIdx + 1];
  }

  if (isLong || slug.startsWith("long-")) {
    uploadLongformVideo(slug, {schedule, draft: isDraft}).catch((err) => {
      console.error("\n❌ Long-form upload failed:", err.message);
      process.exit(isThrottleError(err) ? THROTTLE_EXIT_CODE : 1);
    });
  } else {
    uploadReel(slug, {schedule}).catch((err) => {
      console.error("\n❌ Reel upload failed:", err.message);
      process.exit(isThrottleError(err) ? THROTTLE_EXIT_CODE : 1);
    });
  }
}

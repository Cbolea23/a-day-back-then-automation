#!/usr/bin/env node
/**
 * Automated Scheduler for Facebook Page Reels & Meta Planner (Oct 12-15 Batch)
 * Spaced with deliberate pauses to ensure clean Meta Graph API processing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenFile = path.join(root, "facebook-tokens.json");
const pubFile = path.join(root, "published-urls-facebook.json");

const fb = JSON.parse(fs.readFileSync(tokenFile, "utf8"));
const pub = fs.existsSync(pubFile) ? JSON.parse(fs.readFileSync(pubFile, "utf8")) : {};

export const SCHEDULE_PLAN = [
  // Day 1: October 12, 2026
  { slug: "roman-garum", iso: "2026-10-12T03:00:00Z", display: "Oct 12, 11:00 AM UTC+8" },
  { slug: "spartan-training-day", iso: "2026-10-12T09:00:00Z", display: "Oct 12, 05:00 PM UTC+8" },
  { slug: "sparta-myths", iso: "2026-10-12T13:00:00Z", display: "Oct 12, 09:00 PM UTC+8" },

  // Day 2: October 13, 2026
  { slug: "roman-patrician-vs-plebeian", iso: "2026-10-13T03:00:00Z", display: "Oct 13, 11:00 AM UTC+8" },
  { slug: "roman-myths", iso: "2026-10-13T09:00:00Z", display: "Oct 13, 05:00 PM UTC+8" },
  { slug: "roman-legionary-march", iso: "2026-10-13T13:00:00Z", display: "Oct 13, 09:00 PM UTC+8" },

  // Day 3: October 14, 2026
  { slug: "greek-symposium", iso: "2026-10-14T03:00:00Z", display: "Oct 14, 11:00 AM UTC+8" },
  { slug: "egypt-pyramid-workers", iso: "2026-10-14T09:00:00Z", display: "Oct 14, 05:00 PM UTC+8" },
  { slug: "egypt-pharaoh-day", iso: "2026-10-14T13:00:00Z", display: "Oct 14, 09:00 PM UTC+8" },

  // Day 4: October 15, 2026
  { slug: "egypt-myths", iso: "2026-10-15T01:00:00Z", display: "Oct 15, 09:00 AM UTC+8" },
  { slug: "roman-money", iso: "2026-10-15T05:00:00Z", display: "Oct 15, 01:00 PM UTC+8" },
  { slug: "medieval-blacksmith-job", iso: "2026-10-15T09:00:00Z", display: "Oct 15, 05:00 PM UTC+8" },
  { slug: "medieval-monk-day", iso: "2026-10-15T13:00:00Z", display: "Oct 15, 09:00 PM UTC+8" },
];

function getCandidateVideo(slug) {
  const p1 = path.join(root, "out", "1 - Published", `${slug}.mp4`);
  const p2 = path.join(root, "out", "2 - Unpublished Vault", `${slug}.mp4`);
  const p0 = path.join(root, "out", `${slug}.mp4`);
  if (fs.existsSync(p1)) return p1;
  if (fs.existsSync(p2)) return p2;
  if (fs.existsSync(p0)) return p0;
  return null;
}

function getCaption(slug) {
  const scriptPath = path.join(root, "scripts-out", `${slug}.json`);
  if (!fs.existsSync(scriptPath)) return slug.replace(/-/g, " ");
  const s = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
  let caption = (s.hook || s.title || "").trim();
  if (s.scenes && s.scenes.length > 0) {
    const textBody = s.scenes.slice(0, 2).map(sc => sc.text).join(" ");
    caption += "\n\n" + textBody;
  }
  caption += "\n\n#history #ancienthistory #historyfacts #reels #ADayBackThen";
  return caption;
}

async function uploadAndScheduleReel(item) {
  const videoPath = getCandidateVideo(item.slug);
  if (!videoPath) {
    throw new Error(`Video file not found for ${item.slug}`);
  }
  const fileSize = fs.statSync(videoPath).size;
  const caption = getCaption(item.slug);
  const schedTs = Math.floor(new Date(item.iso).getTime() / 1000);

  console.log(`\n======================================================`);
  console.log(`🎬 Scheduling: ${item.slug} -> ${item.display}`);
  console.log(`File: ${(fileSize / 1024 / 1024).toFixed(1)} MB (${videoPath})`);
  console.log(`------------------------------------------------------`);

  // Step 1: Start
  console.log("1. Initializing Reel container...");
  const initRes = await fetch(`https://graph.facebook.com/v20.0/${fb.pageId}/video_reels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      upload_phase: "start",
      access_token: fb.pageAccessToken,
    }),
  });
  const initData = await initRes.json();
  if (!initRes.ok || !initData.video_id || !initData.upload_url) {
    throw new Error(`Failed to initialize: ${JSON.stringify(initData)}`);
  }
  const videoId = initData.video_id;
  const uploadUrl = initData.upload_url;
  console.log(`✓ Session initialized: Video ID ${videoId}`);

  // Step 2: Binary transfer
  console.log(`2. Uploading binary (${(fileSize / 1024 / 1024).toFixed(1)} MB)...`);
  const buf = fs.readFileSync(videoPath);
  const upRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${fb.pageAccessToken}`,
      offset: "0",
      file_size: String(fileSize),
      "Content-Type": "application/octet-stream",
    },
    body: buf,
  });
  const upData = await upRes.json();
  if (!upRes.ok || upData.success === false) {
    throw new Error(`Binary upload failed: ${JSON.stringify(upData)}`);
  }
  console.log(`✓ Upload stream accepted by Meta.`);

  // Step 3: Finish & Schedule
  console.log(`3. Finalizing Reel with scheduled time (${item.iso})...`);
  const finRes = await fetch(`https://graph.facebook.com/v20.0/${fb.pageId}/video_reels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      upload_phase: "finish",
      video_id: videoId,
      video_state: "SCHEDULED",
      scheduled_publish_time: schedTs,
      description: caption,
      access_token: fb.pageAccessToken,
    }),
  });
  const finData = await finRes.json();
  if (!finRes.ok || finData.success === false) {
    throw new Error(`Finalize failed: ${JSON.stringify(finData)}`);
  }

  console.log(`✅ SCHEDULED SUCCESSFULLY!`);
  console.log(`   Video ID: ${videoId}`);
  console.log(`   Post ID:  ${finData.post_id || "N/A"}`);
  console.log(`   Link:     https://www.facebook.com/reel/${videoId}/`);

  pub[item.slug] = {
    videoId,
    url: `https://www.facebook.com/reel/${videoId}/`,
    postId: finData.post_id,
    type: "reel",
    scheduledFor: item.iso,
    scheduledAt: new Date().toISOString(),
  };
  fs.writeFileSync(pubFile, JSON.stringify(pub, null, 2));
  return { videoId, postId: finData.post_id };
}

async function main() {
  console.log("==========================================================");
  console.log("   SCHEDULE OCT 12-15 REMASTERED REELS ON FACEBOOK/META");
  console.log("==========================================================");

  let successCount = 0;
  for (let i = 0; i < SCHEDULE_PLAN.length; i++) {
    const item = SCHEDULE_PLAN[i];
    if (pub[item.slug] && pub[item.slug].videoId) {
      console.log(`[${i + 1}/${SCHEDULE_PLAN.length}] ⏭️ Already scheduled: ${item.slug} (${pub[item.slug].url})`);
      successCount++;
      continue;
    }

    try {
      console.log(`\n[${i + 1}/${SCHEDULE_PLAN.length}] Processing: ${item.slug}...`);
      await uploadAndScheduleReel(item);
      successCount++;
      console.log("⏳ Pausing 4 seconds before next item to respect Meta API rate limits...");
      await new Promise(r => setTimeout(r, 4000));
    } catch (err) {
      console.error(`❌ Failed to schedule ${item.slug}:`, err.message);
      console.log("Pausing 10 seconds before next item...");
      await new Promise(r => setTimeout(r, 10000));
    }
  }

  console.log("\n==========================================================");
  console.log(`🎉 FACEBOOK BATCH SCHEDULE RUN FINISHED: ${successCount}/${SCHEDULE_PLAN.length} READY!`);
  console.log("==========================================================");
}

main().catch(console.error);

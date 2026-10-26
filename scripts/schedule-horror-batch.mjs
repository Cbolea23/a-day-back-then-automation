#!/usr/bin/env node
/**
 * Automated Scheduler for Horror / Halloween Reels to Facebook Meta Planner
 * Schedules horror topics leading up to Halloween.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenFile = path.join(root, "facebook-tokens.json");
const pubFile = path.join(root, "published-urls-facebook.json");

if (!fs.existsSync(tokenFile)) {
  console.error("Missing facebook-tokens.json in root.");
  process.exit(1);
}

const fb = JSON.parse(fs.readFileSync(tokenFile, "utf8"));
const pub = fs.existsSync(pubFile) ? JSON.parse(fs.readFileSync(pubFile, "utf8")) : {};

export const HORROR_SCHEDULE_PLAN = [
  {
    slug: "kapre-the-giant-cigar-smoking-tree-dweller-watch",
    title: "Kapre: The Giant Cigar-Smoking Tree Dweller",
    iso: "2026-10-26T10:00:00Z",
    display: "Oct 26, 06:00 PM UTC+8 (Tonight)",
  },
  {
    slug: "vlad-impaler",
    title: "Vlad the Impaler: The Real Dracula",
    iso: "2026-10-26T13:00:00Z",
    display: "Oct 26, 09:00 PM UTC+8 (Tonight)",
  },
  {
    slug: "witch-finder",
    title: "The Witch Finder General",
    iso: "2026-10-27T10:00:00Z",
    display: "Oct 27, 06:00 PM UTC+8 (Tomorrow)",
  },
  {
    slug: "tower-ghosts",
    title: "The Ghosts of the Tower of London",
    iso: "2026-10-27T13:00:00Z",
    display: "Oct 27, 09:00 PM UTC+8 (Tomorrow)",
  },
  {
    slug: "plague-doctor-short",
    title: "The Truth About Plague Doctors",
    iso: "2026-10-28T10:00:00Z",
    display: "Oct 28, 06:00 PM UTC+8",
  },
  {
    slug: "dancing-plague",
    title: "The Dancing Plague of 1518",
    iso: "2026-10-28T13:00:00Z",
    display: "Oct 28, 09:00 PM UTC+8",
  },
  {
    slug: "body-snatchers",
    title: "The Body Snatchers",
    iso: "2026-10-29T10:00:00Z",
    display: "Oct 29, 06:00 PM UTC+8",
  },
];

function getCandidateVideo(slug) {
  const candidates = [
    path.join(root, "out", `${slug}.mp4`),
    path.join(root, "out", "2 - Unpublished Vault", `${slug}.mp4`),
    path.join(root, "out", "1 - Published", `${slug}.mp4`),
  ];
  return candidates.find((p) => fs.existsSync(p)) || null;
}

function buildCaption(slug) {
  const scriptPath = path.join(root, "scripts-out", `${slug}.json`);
  let script = { title: slug };
  if (fs.existsSync(scriptPath)) {
    try {
      script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
    } catch {}
  }

  const hook = (script.hook || script.title || slug.replace(/-/g, " ")).trim();
  let body = "";
  if (script.scenes && script.scenes.length > 0) {
    const firstTwo = script.scenes.slice(0, 2).map((s) => s.text).join(" ");
    if ((hook.length + firstTwo.length) <= 220) {
      body = `\n\n${firstTwo}`;
    }
  }

  const hashtags = ["#ADayBackThen", "#history", "#spookyhistory", "#halloween", "#horror", "#reels"];
  if (slug.includes("kapre")) hashtags.push("#philippinefolklore", "#kapre");
  if (slug.includes("vlad")) hashtags.push("#dracula", "#vladtheimpaler");
  if (slug.includes("witch")) hashtags.push("#witchtrials", "#witchesofinstagram");
  if (slug.includes("tower")) hashtags.push("#toweroflondon", "#ghosts");
  if (slug.includes("plague")) hashtags.push("#plaguedoctor", "#blackdeath");
  if (slug.includes("body")) hashtags.push("#bodysnatchers", "#victorianhorror");

  const tagString = Array.from(new Set(hashtags)).slice(0, 6).join(" ");
  const cta = "👉 Follow A Day Back Then for daily spooky history!";
  const question = "Would you have survived this? Tell us in the comments 👇";

  let full = `${hook}${body}\n\n💬 ${question}\n\n${cta}\n\n${tagString}`;
  if (full.length > 390) {
    full = full.slice(0, 385) + "...";
  }
  return full;
}

async function scheduleReel(item) {
  const videoPath = getCandidateVideo(item.slug);
  if (!videoPath) {
    throw new Error(`Video file not found for ${item.slug}`);
  }

  const fileSize = fs.statSync(videoPath).size;
  const caption = buildCaption(item.slug);
  const schedTs = Math.floor(new Date(item.iso).getTime() / 1000);

  console.log(`\n======================================================`);
  console.log(`🎬 Scheduling: ${item.title}`);
  console.log(`Slug:        ${item.slug}`);
  console.log(`Target Time: ${item.display} (${item.iso})`);
  console.log(`File:        ${(fileSize / 1024 / 1024).toFixed(1)} MB (${videoPath})`);
  console.log(`Caption:     ${caption.split("\n")[0]}`);
  console.log(`------------------------------------------------------`);

  // Step 1: Initialize Reel container
  console.log("1. Initializing Reel upload session...");
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
    throw new Error(`Failed to initialize session: ${JSON.stringify(initData)}`);
  }

  const videoId = initData.video_id;
  const uploadUrl = initData.upload_url;
  console.log(`✓ Session initialized: Video ID ${videoId}`);

  // Step 2: Stream video binary
  console.log(`2. Uploading video stream to Meta servers (${(fileSize / 1024 / 1024).toFixed(1)} MB)...`);
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
    throw new Error(`Binary stream upload failed: ${JSON.stringify(upData)}`);
  }
  console.log(`✓ Video stream transfer accepted.`);

  // Step 3: Finish Reel with SCHEDULED state
  console.log(`3. Submitting to Meta Planner as SCHEDULED for ${item.iso}...`);
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

  console.log(`✅ REEL SCHEDULED IN META PLANNER!`);
  console.log(`   Video ID: ${videoId}`);
  console.log(`   Link:     https://www.facebook.com/watch/?v=${videoId}`);

  pub[item.slug] = {
    videoId,
    url: `https://www.facebook.com/watch/?v=${videoId}`,
    title: item.title,
    type: "reel",
    status: "SCHEDULED",
    scheduledFor: item.iso,
    scheduledDisplay: item.display,
    scheduledAt: new Date().toISOString(),
  };

  fs.writeFileSync(pubFile, JSON.stringify(pub, null, 2));
  return { videoId };
}

async function main() {
  console.log("==========================================================");
  console.log("   SCHEDULE HORROR / HALLOWEEN REELS TO FACEBOOK PLANNER");
  console.log("==========================================================");

  let successCount = 0;
  for (let i = 0; i < HORROR_SCHEDULE_PLAN.length; i++) {
    const item = HORROR_SCHEDULE_PLAN[i];

    if (pub[item.slug] && (pub[item.slug].status === "SCHEDULED" || pub[item.slug].status === "PUBLISHED" || pub[item.slug].videoId)) {
      console.log(`\n[${i + 1}/${HORROR_SCHEDULE_PLAN.length}] ⏭️ Already scheduled/published: ${item.slug} (${pub[item.slug].url})`);
      successCount++;
      continue;
    }

    try {
      console.log(`\n[${i + 1}/${HORROR_SCHEDULE_PLAN.length}] Processing: ${item.slug}...`);
      await scheduleReel(item);
      successCount++;
      console.log("⏳ Pausing 5 seconds to respect Meta API velocity limits...");
      await new Promise((r) => setTimeout(r, 5000));
    } catch (err) {
      console.error(`❌ Failed to schedule ${item.slug}:`, err.message);
      console.log("Pausing 10 seconds before next item...");
      await new Promise((r) => setTimeout(r, 10000));
    }
  }

  console.log("\n==========================================================");
  console.log(`🎉 HORROR SCHEDULE COMPLETED: ${successCount}/${HORROR_SCHEDULE_PLAN.length} REELS IN CALENDAR!`);
  console.log("==========================================================");
}

main().catch(console.error);

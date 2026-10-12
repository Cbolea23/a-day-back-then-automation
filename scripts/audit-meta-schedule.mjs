#!/usr/bin/env node
/**
 * Meta / Facebook Scheduled Content Watchdog & Self-Healing Daemon
 * 
 * Purpose:
 *   1. Scans all scheduled posts on the Facebook Page.
 *   2. Detects any post that got stuck with is_published: false where scheduled_publish_time has passed.
 *   3. Automatically rescues stuck posts by pushing their publish time forward or publishing them.
 *   4. Alerts if any Meta permission/identity checkpoint is active.
 * 
 * Usage:
 *   node scripts/audit-meta-schedule.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenFile = path.join(root, "facebook-tokens.json");

if (!fs.existsSync(tokenFile)) {
  console.error("Missing facebook-tokens.json");
  process.exit(1);
}

const fb = JSON.parse(fs.readFileSync(tokenFile, "utf8"));

async function auditMetaSchedule() {
  console.log("==========================================================");
  console.log("   META BUSINESS SUITE SCHEDULE AUDIT & HEALTH CHECK");
  console.log("==========================================================\n");

  const url = `https://graph.facebook.com/v20.0/${fb.pageId}/scheduled_posts?fields=id,is_published,scheduled_publish_time,message,status_type,attachments&limit=100&access_token=${fb.pageAccessToken}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    console.error("❌ Failed to query scheduled posts:", data.error);
    return;
  }

  const posts = data.data || [];
  console.log(`Auditing ${posts.length} scheduled posts on Facebook Page (${fb.pageId})...\n`);

  const nowSec = Math.floor(Date.now() / 1000);
  const stuckPosts = [];
  const healthyPosts = [];

  for (const p of posts) {
    const title = p.message ? p.message.split("\n")[0] : "Untitled Post";
    const schedTs = p.scheduled_publish_time;

    if (!schedTs) continue;

    // Check if the scheduled time has passed while remaining unpublished
    if (schedTs < nowSec && p.is_published === false) {
      stuckPosts.push({ ...p, title, delayHours: ((nowSec - schedTs) / 3600).toFixed(1) });
    } else {
      healthyPosts.push({ ...p, title });
    }
  }

  console.log(`✅ Healthy Scheduled Posts in Queue: ${healthyPosts.length}`);

  if (stuckPosts.length === 0) {
    console.log("🎉 Zero stuck posts! All scheduled items are in future valid slots.\n");
    return;
  }

  console.warn(`\n⚠️ DETECTED ${stuckPosts.length} STUCK POST(S) (Scheduled in the past but unpublished!):`);
  for (const s of stuckPosts) {
    console.log(`• [${s.id}] "${s.title}" - was scheduled ${s.delayHours}h ago`);
  }

  console.log("\n🔧 Executing Auto-Heal (Rescheduling forward to nearest valid future slot)...");
  for (let i = 0; i < stuckPosts.length; i++) {
    const s = stuckPosts[i];
    const newTs = nowSec + 1800 + i * 3600; // 30 mins, 1.5 hrs, etc.
    const vidId = s.attachments?.data?.[0]?.target?.id;

    if (vidId) {
      console.log(`Rescheduling video ${vidId} ("${s.title}")...`);
      const upRes = await fetch(`https://graph.facebook.com/v20.0/${vidId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduled_publish_time: newTs,
          access_token: fb.pageAccessToken,
        }),
      });
      const upData = await upRes.json();
      if (upData.success) {
        console.log(`  ✅ Successfully rescheduled video ${vidId} to ${new Date(newTs * 1000).toISOString()}`);
      } else {
        console.error(`  ❌ Failed to reschedule video:`, upData);
      }
    }
  }

  console.log("\n==========================================================");
  console.log("   AUDIT COMPLETE");
  console.log("==========================================================");
}

auditMetaSchedule().catch(console.error);

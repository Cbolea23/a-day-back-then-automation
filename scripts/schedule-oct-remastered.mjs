import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const SCHEDULE_PLAN = [
  // Day 1: October 12, 2026
  { slug: "roman-garum", iso: "2026-10-12T03:00:00Z", display: "Oct 12, 11:00 AM" },
  { slug: "spartan-training-day", iso: "2026-10-12T09:00:00Z", display: "Oct 12, 05:00 PM" },
  { slug: "sparta-myths", iso: "2026-10-12T13:00:00Z", display: "Oct 12, 09:00 PM" },

  // Day 2: October 13, 2026
  { slug: "roman-patrician-vs-plebeian", iso: "2026-10-13T03:00:00Z", display: "Oct 13, 11:00 AM" },
  { slug: "roman-myths", iso: "2026-10-13T09:00:00Z", display: "Oct 13, 05:00 PM" },
  { slug: "roman-legionary-march", iso: "2026-10-13T13:00:00Z", display: "Oct 13, 09:00 PM" },

  // Day 3: October 14, 2026
  { slug: "greek-symposium", iso: "2026-10-14T03:00:00Z", display: "Oct 14, 11:00 AM" },
  { slug: "egypt-pyramid-workers", iso: "2026-10-14T09:00:00Z", display: "Oct 14, 05:00 PM" },
  { slug: "egypt-pharaoh-day", iso: "2026-10-14T13:00:00Z", display: "Oct 14, 09:00 PM" },

  // Day 4: October 15, 2026
  { slug: "egypt-myths", iso: "2026-10-15T01:00:00Z", display: "Oct 15, 09:00 AM" },
  { slug: "roman-money", iso: "2026-10-15T05:00:00Z", display: "Oct 15, 01:00 PM" },
  { slug: "medieval-blacksmith-job", iso: "2026-10-15T09:00:00Z", display: "Oct 15, 05:00 PM" },
  { slug: "medieval-monk-day", iso: "2026-10-15T13:00:00Z", display: "Oct 15, 09:00 PM" },
];

async function main() {
  console.log("==========================================================");
  console.log("   CROSS-PLATFORM SCHEDULING: 13 REMASTERED SHORTS");
  console.log("   Target Dates: October 12 – 15, 2026");
  console.log("==========================================================\n");

  for (const item of SCHEDULE_PLAN) {
    console.log(`• ${item.slug.padEnd(30)} -> ${item.display} (${item.iso})`);
  }
  console.log("\n----------------------------------------------------------\n");

  const fbPubFile = path.join(root, "published-urls-facebook.json");
  const ytPubFile = path.join(root, "published-urls.json");

  const fbPublished = fs.existsSync(fbPubFile) ? JSON.parse(fs.readFileSync(fbPubFile, "utf8")) : {};
  const ytPublished = fs.existsSync(ytPubFile) ? JSON.parse(fs.readFileSync(ytPubFile, "utf8")) : {};

  // 1. Schedule on Facebook Page Reels
  console.log("\n🔵 STEP 1: SCHEDULING ON FACEBOOK REELS...");
  let fbRateLimited = false;
  for (let i = 0; i < SCHEDULE_PLAN.length; i++) {
    if (fbRateLimited) break;
    const item = SCHEDULE_PLAN[i];
    if (fbPublished[item.slug]) {
      console.log(`[${i + 1}/${SCHEDULE_PLAN.length}] ⏭️  Already on Facebook: ${item.slug}`);
      continue;
    }
    console.log(`\n[${i + 1}/${SCHEDULE_PLAN.length}] 📤 Scheduling on Facebook: ${item.slug} for ${item.display}...`);
    const fbRes = spawnSync(
      process.execPath,
      [path.join("scripts", "upload-facebook.mjs"), item.slug, "--schedule", item.iso],
      { cwd: root, stdio: "inherit" }
    );
    if (fbRes.status !== 0) {
      console.warn(`⚠️ Facebook scheduling failed or returned status ${fbRes.status} for ${item.slug}. Pausing Facebook batch.`);
      fbRateLimited = true;
    }
  }

  // 2. Schedule on YouTube Shorts
  console.log("\n🔴 STEP 2: SCHEDULING ON YOUTUBE SHORTS...");
  let ytQuotaExceeded = false;
  for (let i = 0; i < SCHEDULE_PLAN.length; i++) {
    if (ytQuotaExceeded) break;
    const item = SCHEDULE_PLAN[i];
    if (ytPublished[item.slug]) {
      console.log(`[${i + 1}/${SCHEDULE_PLAN.length}] ⏭️  Already on YouTube: ${item.slug}`);
      continue;
    }
    console.log(`\n[${i + 1}/${SCHEDULE_PLAN.length}] 📤 Scheduling on YouTube: ${item.slug} for ${item.display}...`);
    const ytRes = spawnSync(
      process.execPath,
      [path.join("scripts", "upload-youtube.mjs"), item.slug, "--schedule", item.iso],
      { cwd: root, stdio: "inherit" }
    );
    if (ytRes.status !== 0) {
      console.warn(`⚠️ YouTube upload failed or quota reached for ${item.slug}.`);
      ytQuotaExceeded = true;
    }
  }

  console.log("\n==========================================================");
  console.log("🎉 SCHEDULING RUN COMPLETED!");
  console.log("==========================================================");
}

main();

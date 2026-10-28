import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { uploadVideo } from "./upload-youtube.mjs";

const week1Slots = [
  {
    date: "2026-11-01",
    timeStr: "12:00",
    isoUtc: "2026-11-01T04:00:00.000Z",
    slug: "victorian-arsenic-green-wallpaper",
    driveFileId: "1lp6st-E81ttfLuyRh4NyhXLGT65f4UJe",
    title: "The Deadly Green Wallpaper of Victorian Homes #shorts"
  },
  {
    date: "2026-11-01",
    timeStr: "18:30",
    isoUtc: "2026-11-01T10:30:00.000Z",
    slug: "victorian-body-snatchers",
    driveFileId: "1B6EZWlDsqElt-CbhXhqpWAnKvjaZ0QwH",
    title: "Digging Up Fresh Graves for Doctors #shorts"
  },
  {
    date: "2026-11-01",
    timeStr: "21:00",
    isoUtc: "2026-11-01T13:00:00.000Z",
    slug: "victorian-corset-fainting",
    driveFileId: "1ued4MNnnNkZv38A2Nz7xWi7kPpmPHEfK",
    title: "The Real Story Behind Victorian Corsets #shorts"
  },
  {
    date: "2026-11-02",
    timeStr: "12:00",
    isoUtc: "2026-11-02T04:00:00.000Z",
    slug: "victorian-mudlark-job",
    driveFileId: "1MJEp00OeE6q91UFTFjEgL1IZJwHnamLv",
    title: "Scavenging for Coins in River Sewage #shorts"
  },
  {
    date: "2026-11-02",
    timeStr: "18:30",
    isoUtc: "2026-11-02T10:30:00.000Z",
    slug: "victorian-pea-souper-smog",
    driveFileId: "1GHTZXEnWI1-yRUg_Jf54NOXIYDs2vwtX",
    title: "London's Killer Pea-Souper Fog #shorts"
  },
  {
    date: "2026-11-02",
    timeStr: "21:00",
    isoUtc: "2026-11-02T13:00:00.000Z",
    slug: "victorian-penny-blood",
    driveFileId: "1sApwSnfTnTjHjiQ-cJ38-2wX0Iz-ckgu",
    title: "Penny Dreadfuls: 1800s Trash Horror Comics #shorts"
  }
];

const logFile = "data/week1-scheduled-youtube.json";
let log = {};
if (fs.existsSync(logFile)) {
  try { log = JSON.parse(fs.readFileSync(logFile, "utf8")); } catch {}
}

// Mark slot 1 if already uploaded
log["victorian-arsenic-green-wallpaper"] = {
  videoId: "8wjaePWJqgQ",
  url: "https://youtube.com/shorts/8wjaePWJqgQ",
  publishAt: "2026-11-01T04:00:00.000Z",
  title: "The Deadly Green Wallpaper of Victorian Homes #shorts",
  status: "SCHEDULED"
};
fs.writeFileSync(logFile, JSON.stringify(log, null, 2), "utf8");

async function run() {
  console.log("=== Scheduling Week 1 Shorts to YouTube (A Day Back Then) ===");

  for (let i = 0; i < week1Slots.length; i++) {
    const item = week1Slots[i];
    if (log[item.slug]?.status === "SCHEDULED" && log[item.slug]?.videoId) {
      console.log(`[Slot ${i + 1}] ${item.slug} already scheduled on YouTube (ID: ${log[item.slug].videoId}). Skipping.`);
      continue;
    }

    const localVideo = path.join("out", `${item.slug}.mp4`);
    if (!fs.existsSync(localVideo)) {
      console.log(`[Slot ${i + 1}] Downloading ${item.slug} from Drive...`);
      execSync(`gdrive readonly download ${item.driveFileId} -o ${localVideo}`, { stdio: "inherit" });
    }

    console.log(`[Slot ${i + 1}] Uploading to YouTube scheduled for ${item.isoUtc}...`);
    try {
      const res = await uploadVideo(item.slug, {
        channel: "adaybackthen",
        schedule: item.isoUtc,
        title: item.title
      });

      if (res && res.videoId) {
        log[item.slug] = {
          videoId: res.videoId,
          url: res.url,
          publishAt: item.isoUtc,
          title: item.title,
          status: "SCHEDULED",
          scheduledAt: new Date().toISOString()
        };
        fs.writeFileSync(logFile, JSON.stringify(log, null, 2), "utf8");
        console.log(`✓ YouTube Short scheduled: ${res.url}`);
      }
    } catch (err) {
      console.error(`⚠️ Failed to upload ${item.slug} to YouTube:`, err.message);
      if (err.message.includes("quota") || err.message.includes("quotaExceeded")) {
        console.warn("Daily YouTube API quota reached. Halting batch safely.");
        break;
      }
    }

    // Clean up local file
    if (fs.existsSync(localVideo)) {
      fs.unlinkSync(localVideo);
    }

    // Pacing delay between uploads
    await new Promise((r) => setTimeout(r, 10000));
  }

  console.log("\nYouTube scheduling run finished. Status logged to data/week1-scheduled-youtube.json");
}

run().catch(console.error);

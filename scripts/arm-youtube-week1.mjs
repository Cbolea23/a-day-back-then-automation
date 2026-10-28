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
  },
  {
    date: "2026-11-03",
    timeStr: "12:00",
    isoUtc: "2026-11-03T04:00:00.000Z",
    slug: "victorian-phossy-jaw-matchgirls",
    driveFileId: "1EakAeGFC-ilk1TZYibefQiAFiLDhke8d",
    title: "The Match Factory Girls of London #shorts"
  },
  {
    date: "2026-11-03",
    timeStr: "18:30",
    isoUtc: "2026-11-03T10:30:00.000Z",
    slug: "victorian-post-mortem-photos",
    driveFileId: "1mupEZ0SmBG6YFjP-ep5hm4TVncStjiNC",
    title: "Why Victorians Posed with the Dead #shorts"
  },
  {
    date: "2026-11-03",
    timeStr: "21:00",
    isoUtc: "2026-11-03T13:00:00.000Z",
    slug: "victorian-sewer-hunters-toshers",
    driveFileId: "1pfoAUbGwkoY1RMPzFJnD2yNkEA6HQGfk",
    title: "Hunting Gold in London's Underground Sewers #shorts"
  },
  {
    date: "2026-11-04",
    timeStr: "12:00",
    isoUtc: "2026-11-04T04:00:00.000Z",
    slug: "victorian-chimney-sweep-job",
    driveFileId: "1GlFLw0h4v5nMfYqc0LWIdhwZ0t4w8tt0",
    title: "The Victorian Chimney Sweep #shorts"
  },
  {
    date: "2026-11-04",
    timeStr: "18:30",
    isoUtc: "2026-11-04T10:30:00.000Z",
    slug: "victorian-factory-day",
    driveFileId: "1tMYOvRsPMhx3XyIPgOvM1qc8yWB2ijX0",
    title: "A Day in a Victorian Factory #shorts"
  },
  {
    date: "2026-11-04",
    timeStr: "21:00",
    isoUtc: "2026-11-04T13:00:00.000Z",
    slug: "victorian-penny-sit-up-coffin-beds",
    driveFileId: "1U_dbE7Zgc0MC0v3xxpeYNAmX6Mkx7ND5",
    title: "Two-Penny Hangover and Coffin Beds #shorts"
  },
  {
    date: "2026-11-05",
    timeStr: "12:00",
    isoUtc: "2026-11-05T04:00:00.000Z",
    slug: "wwii-ration-day",
    driveFileId: "1ZdxbziNEn9QGlSWmWkaxjvP4YB0oZucX",
    title: "Wartime Rationing Day #shorts"
  },
  {
    date: "2026-11-05",
    timeStr: "18:30",
    isoUtc: "2026-11-05T10:30:00.000Z",
    slug: "wwii-anderson-shelter-backyard",
    driveFileId: "1X5hu5uigteff2xxVDyRTauq81HdVM6wW",
    title: "Sleeping in an Anderson Garden Shelter #shorts"
  },
  {
    date: "2026-11-05",
    timeStr: "21:00",
    isoUtc: "2026-11-05T13:00:00.000Z",
    slug: "wwii-blackout-night",
    driveFileId: "11X2XoNgnf1Ue4SuOwEUlls-q00polQO3",
    title: "Surviving the London Blitz Blackout #shorts"
  },
  {
    date: "2026-11-06",
    timeStr: "12:00",
    isoUtc: "2026-11-06T04:00:00.000Z",
    slug: "wwii-deception-ghost-army",
    driveFileId: "1sbITlJjVnToIA3c3jlQNVs7vkgKFr-ks",
    title: "The 23rd Ghost Army Deception #shorts"
  },
  {
    date: "2026-11-06",
    timeStr: "18:30",
    isoUtc: "2026-11-06T10:30:00.000Z",
    slug: "wwii-night-fighter-carrots-myth",
    driveFileId: "10m_gc1Xm3N3TRjrM2d9ehbQRMR7iP3cr",
    title: "The Carrot Night Vision Propaganda Lie #shorts"
  },
  {
    date: "2026-11-06",
    timeStr: "21:00",
    isoUtc: "2026-11-06T13:00:00.000Z",
    slug: "ottoman-hamam-bathhouse",
    driveFileId: "1BtmwC2v1JLK_lCHQr0MdHgI3OGl09Eah",
    title: "Gossip and Steam in the Turkish Hamam #shorts"
  },
  {
    date: "2026-11-07",
    timeStr: "12:00",
    isoUtc: "2026-11-07T04:00:00.000Z",
    slug: "ottoman-imperial-hareem-politics",
    driveFileId: "1HkDtB0504xcYdQe8S_hVBh1tqZuhHEvl",
    title: "The Powerful Women Who Ruled the Empire #shorts"
  },
  {
    date: "2026-11-07",
    timeStr: "18:30",
    isoUtc: "2026-11-07T10:30:00.000Z",
    slug: "ottoman-janissary-life",
    driveFileId: "1eA1FRaNu96yzLtgm2uQmATon15a8eTJ4",
    title: "The Sultan's Elite Janissary Soldiers #shorts"
  },
  {
    date: "2026-11-07",
    timeStr: "21:00",
    isoUtc: "2026-11-07T13:00:00.000Z",
    slug: "ottoman-siege-cannon-dardanelles",
    driveFileId: "1mpRvKQgMngU3K3JKY9jqEpjmVeGzumPR",
    title: "The 18-Ton Super-Cannons of 1453 #shorts"
  }
];

const root = process.cwd();
const logFile = path.join(root, "data", "week1-scheduled-youtube.json");
let log = {};
if (fs.existsSync(logFile)) {
  try { log = JSON.parse(fs.readFileSync(logFile, "utf8")); } catch {}
}

async function run() {
  console.log("=== Autonomous Cloud YouTube Pacer ===");

  let uploadsDoneInThisRun = 0;
  const MAX_PER_RUN = 6; // strictly stay within 10k daily quota

  for (let i = 0; i < week1Slots.length; i++) {
    if (uploadsDoneInThisRun >= MAX_PER_RUN) {
      console.log(`Reached run cap of ${MAX_PER_RUN} videos. Halting run to protect quota.`);
      break;
    }

    const item = week1Slots[i];
    if (log[item.slug]?.status === "SCHEDULED" && log[item.slug]?.videoId) {
      continue;
    }

    const localVideo = path.join(root, "out", `${item.slug}.mp4`);
    if (!fs.existsSync(localVideo)) {
      console.log(`[Slot ${i + 1}/${week1Slots.length}] Downloading ${item.slug} via direct Drive URL...`);
      fs.mkdirSync(path.join(root, "out"), { recursive: true });
      execSync(`curl -s -L "https://drive.google.com/uc?export=download&id=${item.driveFileId}" -o "${localVideo}"`, { stdio: "inherit" });
    }

    console.log(`[Slot ${i + 1}/${week1Slots.length}] Uploading to YouTube scheduled for ${item.isoUtc}...`);
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
        uploadsDoneInThisRun++;
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

    // Pacing delay
    await new Promise((r) => setTimeout(r, 10000));
  }

  console.log(`\nRun completed. Uploaded ${uploadsDoneInThisRun} videos in this run.`);
}

run().catch(console.error);

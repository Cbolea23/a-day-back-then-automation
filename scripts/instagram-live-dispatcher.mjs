import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { uploadInstagramReel } from "./upload-instagram.mjs";

const root = process.cwd();
const queueFile = path.join(root, "data", "week1-scheduled-reels.json");

export async function dispatchEligibleInstagramPosts() {
  if (!fs.existsSync(queueFile)) {
    console.log("No schedule queue found at data/week1-scheduled-reels.json");
    return;
  }

  const queue = JSON.parse(fs.readFileSync(queueFile, "utf8"));
  const now = new Date();

  console.log(`[IG Cloud Dispatcher] Checking queue at ${now.toISOString()}...`);

  for (const [slug, item] of Object.entries(queue)) {
    if (item.instagramStatus === "PUBLISHED") {
      continue;
    }

    const targetTime = new Date(item.isoUtc);
    if (now >= targetTime) {
      console.log(`\n🚀 [IG Cloud Dispatcher] Triggering live Instagram Reel for: ${slug} (Target was ${item.isoUtc})`);

      const outDir = path.join(root, "out");
      fs.mkdirSync(outDir, { recursive: true });
      const localVideo = path.join(outDir, `${slug}.mp4`);

      if (!fs.existsSync(localVideo)) {
        console.log(`   Downloading ${slug} from Google Drive (ID: ${item.driveFileId})...`);
        const curlCmd = process.platform === "win32" ? "curl.exe" : "curl";
        try {
          execSync(`${curlCmd} -s -L "https://drive.google.com/uc?export=download&id=${item.driveFileId}" -o "${localVideo}"`, { stdio: "inherit" });
        } catch (e) {
          console.error(`   ❌ Failed to download ${slug}:`, e.message);
          continue;
        }
      }

      try {
        const res = await uploadInstagramReel(slug, {
          channel: "adaybackthen",
          caption: item.caption
        });

        if (res && res.mediaId) {
          item.instagramStatus = "PUBLISHED";
          item.instagramMediaId = res.mediaId;
          item.instagramPermalink = `https://www.instagram.com/reel/${res.mediaId}/`;
          item.instagramPublishedAt = new Date().toISOString();
          fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2), "utf8");
          console.log(`   ✅ Successfully published to Instagram! Media ID: ${res.mediaId}`);
        }
      } catch (err) {
        console.error(`   ❌ Instagram publish error on ${slug}:`, err.message);
      }

      // Cleanup local temp video
      if (fs.existsSync(localVideo)) {
        fs.unlinkSync(localVideo);
      }
    }
  }
}

if (process.argv.includes("--daemon")) {
  console.log("Starting Instagram Live Dispatcher Daemon (polling every 60s)...");
  async function loop() {
    while (true) {
      try {
        await dispatchEligibleInstagramPosts();
      } catch (err) {
        console.error("Dispatcher loop error:", err.message);
      }
      await new Promise(r => setTimeout(r, 60000));
    }
  }
  loop().catch(console.error);
} else {
  dispatchEligibleInstagramPosts().catch(console.error);
}

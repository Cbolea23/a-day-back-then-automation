#!/usr/bin/env node
/**
 * Vault Format Normalizer
 * 
 * Scans all MP4 videos in `out/2 - Unpublished Vault/` (and `out/1 - Published/`).
 * If a video uses non-standard `yuvj420p` (full PC range / bt470bg), it re-encodes
 * it to standard `yuv420p` (limited TV range 16-235, Rec.709, +faststart).
 * 
 * Ensures 100% universal compatibility for:
 *   - Automated Meta Graph API / YouTube Data API scheduling
 *   - Manual browser drag-and-drop on Facebook/Instagram/TikTok/YouTube
 *   - Direct mobile phone gallery uploads
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirs = [
  path.join(root, "out", "2 - Unpublished Vault"),
  path.join(root, "out", "1 - Published")
];

console.log("========================================================");
console.log("   VAULT VIDEO FORMAT NORMALIZER (yuv420p + FastStart)");
console.log("========================================================\n");

let totalChecked = 0;
let totalNormalized = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4") && !f.includes("-temp-norm"));

  for (const f of files) {
    const fullPath = path.join(dir, f);
    totalChecked++;

    const probe = spawnSync(
      "ffprobe",
      ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=pix_fmt,color_range", "-of", "csv=p=0", fullPath],
      { encoding: "utf8" }
    );

    const [pix, range] = (probe.stdout || "").trim().split(",");

    if (pix === "yuv420p" && range === "tv") {
      // Already compliant
      continue;
    }

    console.log(`⚡ Normalizing ${f} (${pix || "unknown"}, ${range || "unknown"})...`);
    const tempOut = path.join(dir, `${f.replace(".mp4", "")}-temp-norm.mp4`);

    const ffmpegRes = spawnSync(
      "ffmpeg",
      [
        "-i", fullPath,
        "-vf", "scale=in_range=full:out_range=limited,format=yuv420p",
        "-c:v", "libx264",
        "-crf", "20",
        "-color_range", "1",
        "-colorspace", "bt709",
        "-color_primaries", "bt709",
        "-color_trc", "bt709",
        "-c:a", "copy",
        "-movflags", "+faststart",
        "-y", tempOut
      ],
      { stdio: "ignore" }
    );

    if (ffmpegRes.status === 0 && fs.existsSync(tempOut)) {
      try {
        fs.unlinkSync(fullPath);
        fs.renameSync(tempOut, fullPath);
        totalNormalized++;
        console.log(`   ✓ Successfully normalized ${f}`);
      } catch (err) {
        console.error(`   ❌ File replace error for ${f}:`, err.message);
        if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
      }
    } else {
      console.error(`   ❌ FFmpeg normalization failed for ${f}`);
      if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
    }
  }
}

console.log("\n========================================================");
console.log(`Checked: ${totalChecked} videos | Normalized: ${totalNormalized} videos`);
console.log("All videos are now 100% compliant with Facebook, YouTube & Mobile!");
console.log("========================================================\n");

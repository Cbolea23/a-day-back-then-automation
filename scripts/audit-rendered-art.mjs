import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const dirs = [
  { name: "Unpublished Vault", dir: "out/2 - Unpublished Vault" },
  { name: "Published", dir: "out/1 - Published" }
];

fs.mkdirSync("out/audit-frames", { recursive: true });

for (const { name, dir } of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4"));
  console.log(`\n=== Scanning ${name} (${files.length} videos) ===`);

  for (const f of files) {
    const slug = f.replace(/\.mp4$/, "");
    const mp4Path = path.join(dir, f);
    const pngPath = path.join("out/audit-frames", `${slug}.png`);
    const mp4SizeMB = (fs.statSync(mp4Path).size / 1024 / 1024).toFixed(1);

    try {
      execSync(`ffmpeg -y -ss 00:00:03 -i "${mp4Path}" -frames:v 1 "${pngPath}"`, { stdio: "ignore" });
      const pngSize = fs.statSync(pngPath).size;
      // Plain gradient frames compress to ~200-450 KB in PNG.
      // Rich 2D illustration frames compress to ~1.2 MB - 2.5 MB in PNG.
      const hasArt = pngSize > 600000;
      console.log(`${slug.padEnd(36)} | MP4: ${mp4SizeMB.padStart(4)}MB | PNG: ${(pngSize / 1024).toFixed(0).padStart(4)}KB | ${hasArt ? "✅ FULL ART" : "❌ GRADIENT ONLY"}`);
    } catch (e) {
      console.error(`Error on ${slug}:`, e.message);
    }
  }
}

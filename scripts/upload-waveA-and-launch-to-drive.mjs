import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const HANDOVER_ROOT_ID = "1C5LqFAgZJ5QAaLOpNDZVileEYUfNtRxi";

const items = [
  // Launch trio
  { slug: "manila-film-center", mp4: "out/kwentong-pinoy/manila-film-center.mp4", img: "public/images/manila-film-center/1.jpg" },
  { slug: "diplomat-hotel", mp4: "out/kwentong-pinoy/diplomat-hotel.mp4", img: "public/images/diplomat-hotel/1.jpg" },
  { slug: "balete-drive-white-lady", mp4: "out/kwentong-pinoy/balete-drive-white-lady.mp4", img: "public/images/balete-drive-white-lady/1.jpg" },

  // Wave A (9 Shorts)
  { slug: "berbalang", mp4: "out/kwentong-pinoy/berbalang.mp4", img: "public/images/berbalang/1.jpg" },
  { slug: "magindara", mp4: "out/kwentong-pinoy/magindara.mp4", img: "public/images/magindara/1.jpg" },
  { slug: "corregidor", mp4: "out/kwentong-pinoy/corregidor.mp4", img: "public/images/corregidor/1.jpg" },
  { slug: "teniente-gimo", mp4: "out/kwentong-pinoy/teniente-gimo.mp4", img: "public/images/teniente-gimo/1.jpg" },
  { slug: "siquijor", mp4: "out/kwentong-pinoy/siquijor.mp4", img: "public/images/siquijor/1.jpg" },
  { slug: "maria-labo", mp4: "out/kwentong-pinoy/maria-labo.mp4", img: "public/images/maria-labo/1.jpg" },
  { slug: "fort-santiago", mp4: "out/kwentong-pinoy/fort-santiago.mp4", img: "public/images/fort-santiago/1.jpg" },
  { slug: "cia-aswang", mp4: "out/kwentong-pinoy/cia-aswang.mp4", img: "public/images/cia-aswang/1.jpg" },
  { slug: "laguna-copperplate", mp4: "out/kwentong-pinoy/laguna-copperplate.mp4", img: "public/images/laguna-copperplate/1.jpg" }
];

console.log("=== Querying existing files on Google Drive Handover Root ===");
const existingRaw = execSync(`gdrive readonly ls ${HANDOVER_ROOT_ID} --max 150`, { encoding: "utf8" });
const existingLines = existingRaw.split("\n");

function isAlreadyUploaded(filename) {
  return existingLines.some(line => line.includes(filename));
}

// Ensure staging directory for clean naming
const stageDir = path.resolve("out/drive-stage");
if (!fs.existsSync(stageDir)) {
  fs.mkdirSync(stageDir, { recursive: true });
}

console.log(`\n=== Processing ${items.length} items (3 launch trio + 9 Wave A) ===\n`);

for (const item of items) {
  const mp4Name = `${item.slug}.mp4`;
  const jpgName = `${item.slug}.jpg`;

  console.log(`--------------------------------------------------------`);
  console.log(`Processing: ${item.slug}`);

  // 1. Prepare JPG cover
  const stageJpg = path.join(stageDir, jpgName);
  if (fs.existsSync(item.img)) {
    fs.copyFileSync(item.img, stageJpg);
  } else {
    console.warn(`[WARN] Missing source cover image: ${item.img}`);
  }

  // 2. Upload JPG
  if (isAlreadyUploaded(jpgName)) {
    console.log(`   ⏭ Cover JPG already exists on Drive: ${jpgName}`);
  } else if (fs.existsSync(stageJpg)) {
    console.log(`   ⬆ Uploading cover JPG: ${jpgName}...`);
    try {
      const out = execSync(`gdrive mutate upload "${stageJpg}" --parent ${HANDOVER_ROOT_ID}`, { encoding: "utf8" });
      console.log(`   ✓ Uploaded ${jpgName}: ${out.trim()}`);
    } catch (e) {
      console.error(`   ✗ Failed to upload ${jpgName}:`, e.message);
    }
  }

  // 3. Upload MP4
  if (isAlreadyUploaded(mp4Name)) {
    console.log(`   ⏭ Video MP4 already exists on Drive: ${mp4Name}`);
  } else if (fs.existsSync(item.mp4)) {
    const sizeMB = (fs.statSync(item.mp4).size / (1024 * 1024)).toFixed(1);
    console.log(`   ⬆ Uploading video MP4 (${sizeMB} MB): ${mp4Name}...`);
    try {
      const out = execSync(`gdrive mutate upload "${item.mp4}" --parent ${HANDOVER_ROOT_ID}`, { encoding: "utf8" });
      console.log(`   ✓ Uploaded ${mp4Name}: ${out.trim()}`);
    } catch (e) {
      console.error(`   ✗ Failed to upload ${mp4Name}:`, e.message);
    }
  } else {
    console.error(`   ✗ Missing MP4 file: ${item.mp4}`);
  }
}

console.log("\n========================================================");
console.log("🎉 All items processed for Google Drive Handover!");
console.log("========================================================\n");

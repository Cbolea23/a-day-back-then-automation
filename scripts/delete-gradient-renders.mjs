import fs from "node:fs";
import path from "node:path";

const dirs = [
  "out/2 - Unpublished Vault",
  "out/1 - Published"
];

let totalDeleted = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".mp4"));
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const sizeMB = fs.statSync(fullPath).size / (1024 * 1024);
    // Gradient-only videos compress to 11MB - 19MB because of flat solid colors.
    // Full artwork videos are 50MB - 140MB.
    if (sizeMB < 25.0) {
      console.log(`🗑️ Deleting gradient-only render: ${fullPath} (${sizeMB.toFixed(1)}MB)`);
      fs.unlinkSync(fullPath);
      totalDeleted++;
    }
  }
}

console.log(`\n✅ Deleted ${totalDeleted} gradient-only rendered videos!`);

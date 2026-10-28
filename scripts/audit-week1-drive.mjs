import { execSync } from "node:child_process";

const week1Slugs = [
  "victorian-arsenic-green-wallpaper",
  "victorian-body-snatchers",
  "victorian-corset-fainting",
  "victorian-mudlark-job",
  "victorian-pea-souper-smog",
  "victorian-penny-blood",
  "victorian-phossy-jaw-matchgirls",
  "victorian-post-mortem-photos",
  "victorian-sewer-hunters-toshers",
  "victorian-chimney-sweep-job",
  "victorian-factory-day",
  "victorian-penny-sit-up-coffin-beds",
  "wwii-ration-day",
  "wwii-anderson-shelter-backyard",
  "wwii-blackout-night",
  "wwii-deception-ghost-army",
  "wwii-night-fighter-carrots-myth",
  "ottoman-hamam-bathhouse",
  "ottoman-imperial-hareem-politics",
  "ottoman-janissary-life",
  "ottoman-siege-cannon-dardanelles"
];

console.log("=== Auditing Week 1 Drive Assets ===");
let foundCount = 0;
for (const slug of week1Slugs) {
  try {
    const raw = execSync(`gdrive readonly search --name-contains "${slug}"`, { encoding: "utf8" });
    const lines = raw.split("\n").filter(l => l.includes(".mp4"));
    if (lines.length > 0) {
      const parts = lines[0].trim().split(/\s{2,}/);
      console.log(`[OK] ${slug} -> File ID: ${parts[0]} (${parts[1]})`);
      foundCount++;
    } else {
      console.log(`[MISSING MP4] ${slug}`);
    }
  } catch (err) {
    console.error(`[ERROR] ${slug}:`, err.message);
  }
}
console.log(`\nAudit result: ${foundCount} / ${week1Slugs.length} Week 1 MP4s located on Google Drive.`);

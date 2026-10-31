import { execSync } from "node:child_process";

const slugs = [
  "berbalang",
  "magindara",
  "corregidor",
  "teniente-gimo",
  "siquijor",
  "maria-labo",
  "fort-santiago",
  "cia-aswang",
  "laguna-copperplate"
];

console.log("=== Auditing Wave A Pinoy Assets on Google Drive ===");

for (const slug of slugs) {
  try {
    const raw = execSync(`gdrive readonly search --name-contains "${slug}"`, { encoding: "utf8" });
    const lines = raw.split("\n").filter(l => l.includes(slug));
    console.log(`\n[SLUG] ${slug}: found ${lines.length} items`);
    for (const line of lines) {
      console.log("   " + line.trim());
    }
  } catch (err) {
    console.error(`Error searching ${slug}:`, err.message);
  }
}

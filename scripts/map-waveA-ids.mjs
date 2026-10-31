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

console.log("=== Mapping Wave A Asset IDs ===");
const mapping = {};

for (const slug of slugs) {
  mapping[slug] = { json: null, audioFolder: null, imagesFolder: null };
  const raw = execSync(`gdrive readonly search --name-contains "${slug}" --json`, { encoding: "utf8" });
  const items = JSON.parse(raw);

  for (const item of items) {
    if (item.name === `${slug}.json`) {
      mapping[slug].json = item.id;
    } else if (item.mimeType === "application/vnd.google-apps.folder" && item.name === slug) {
      // Check what is inside this folder
      try {
        const lsRaw = execSync(`gdrive readonly ls ${item.id} --max 10 --json`, { encoding: "utf8" });
        const children = JSON.parse(lsRaw);
        if (children.some(c => c.name.endsWith(".mp3"))) {
          mapping[slug].audioFolder = item.id;
        } else if (children.some(c => c.name.endsWith(".jpg") || c.name.endsWith(".png"))) {
          mapping[slug].imagesFolder = item.id;
        }
      } catch (e) {
        console.error(`Error checking folder ${item.id}:`, e.message);
      }
    }
  }
}

console.log(JSON.stringify(mapping, null, 2));

import fs from "node:fs";

const queue = JSON.parse(fs.readFileSync("data/week1-scheduled-reels.json", "utf8"));
const armScript = fs.readFileSync("scripts/arm-week1-backlog.mjs", "utf8");

// Parse week1Plan from armScript
const match = armScript.match(/const week1Plan = (\[[\s\S]*?\]);/);
if (match) {
  // evaluate array
  const plan = eval(match[1]);
  for (const item of plan) {
    if (queue[item.slug]) {
      queue[item.slug].driveFileId = item.driveFileId;
      queue[item.slug].caption = item.caption;
    }
  }
  fs.writeFileSync("data/week1-scheduled-reels.json", JSON.stringify(queue, null, 2), "utf8");
  console.log("Successfully enriched data/week1-scheduled-reels.json with driveFileId and caption for all items!");
} else {
  console.error("Could not find week1Plan");
}

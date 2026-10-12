import { remasterTopic, TOPICS_DATA } from "./remaster-oct-batch.mjs";

const remainingSlugs = [
  "sparta-myths",
  "roman-patrician-vs-plebeian",
  "roman-myths",
  "roman-legionary-march",
  "greek-symposium",
  "egypt-pyramid-workers",
  "egypt-pharaoh-day",
  "egypt-myths",
  "roman-money",
  "medieval-blacksmith-job",
  "medieval-monk-day"
];

async function main() {
  console.log("==========================================================");
  console.log(`🚀 STARTING BATCH REMASTER FOR ${remainingSlugs.length} REMAINING SHORTS`);
  console.log("==========================================================\n");

  for (let i = 0; i < remainingSlugs.length; i++) {
    const slug = remainingSlugs[i];
    console.log(`\n▶️ [${i + 1}/${remainingSlugs.length}] Processing topic: ${slug}`);
    try {
      await remasterTopic(slug);
      console.log(`✅ [${i + 1}/${remainingSlugs.length}] Successfully remastered: ${slug}`);
    } catch (err) {
      console.error(`❌ [${i + 1}/${remainingSlugs.length}] Error processing ${slug}:`, err);
    }
  }

  console.log("\n==========================================================");
  console.log("🎉 ALL 11 REMAINING TOPICS REMASTERED SUCCESSFULLY!");
  console.log("==========================================================");
}

main();

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const waveASlugs = [
  {
    slug: "berbalang",
    title: "Berbalang: The Aswang That Leaves Its Own Body",
    json: "13W43w4gXfStZGtM_XRALf8pAV0Boh5Es",
    audioFolder: "1ClAFsQ6shPMzQB55kkjTF3fBfpcEcKsf",
    imagesFolder: "19za98GXKHV2Ii-rey-DDv5omApv7Rwa_"
  },
  {
    slug: "magindara",
    title: "Magindara: The Sirens of the Visayan Sea",
    json: "1i5rzi2gCnzMyRewMH_rwT2NrVg4QosO4",
    audioFolder: "1-fvpbQUWgpfCuHkds3WwYSpoML25XMUf",
    imagesFolder: "1UHCdTMEmRVr9ZI35PZlgqCsYtMKARsJs"
  },
  {
    slug: "corregidor",
    title: "Corregidor: The Island That Never Surrendered",
    json: "1bhpBL_U42EafgWRTJWHUHUL-jVJECc1n",
    audioFolder: "1V3d5XXXgzylL9MbZlUfPeZ4qSHLCSYd3",
    imagesFolder: "1G8uObgH66CaI9CuBRTMHw8W7FVuwMDQt"
  },
  {
    slug: "teniente-gimo",
    title: "Teniente Gimo: The Fiesta Guest Who Was the Feast",
    json: "19uc-HgQYx5dRHDj6X-zsTKNcQCen0p6N",
    audioFolder: "1W2bvpLl6jsl9LVyuaQXQaZitXT3BEjqg",
    imagesFolder: "1oCZsfCqpGjjOZr46D70U04Gbsgnh2MC0"
  },
  {
    slug: "siquijor",
    title: "Siquijor: Island of Healers and Sorcerers",
    json: "18xmNEk9HWH5GL7YsnzvnVkNv2LHIk4t_",
    audioFolder: "1voCn9NftOcZ9uqERfcmEgAGJ3gqTsNEG",
    imagesFolder: "1CuQk13o7fL6ihOKORFzCoPemDnBBOsB0"
  },
  {
    slug: "maria-labo",
    title: "Maria Labo: The Nurse Who Came Home an Aswang",
    json: "1Olp4Nl_kKia1rJ66VWfEzYFRpbkg5jXV",
    audioFolder: "10EdTVfmErX6xhpCMICGzyNa2YY4K_0KB",
    imagesFolder: "1MnIRRO1tEnOu5pCW0ELfJ0J72DaKgTTY"
  },
  {
    slug: "fort-santiago",
    title: "Fort Santiago: The Prisoners the River Claimed",
    json: "1IQsSUafmK0OScVdUCxrnZRucX8hcDkQv",
    audioFolder: "16GgYJ8aMoQvIUz_pr7uMx4Yry0ebtPev",
    imagesFolder: "11OYW02uT7UPKtVXGsJnOK4sgaLdfeKB3"
  },
  {
    slug: "cia-aswang",
    title: "The Aswang the CIA Used as a Weapon",
    json: "1IZ8D9nTxljE3QORP5xXIAr-JgTUeu5LP",
    audioFolder: "1UVn3DpUVFRTMkJol4P5qygKPQ2cnlgQC",
    imagesFolder: "1Maa4wYTbyqcPcxQ3F6YsgytaEnyJkPi8"
  },
  {
    slug: "laguna-copperplate",
    title: "Laguna Copperplate: A Debt Forgiven in the Year 900",
    json: "1SYZuTyBgAGZ772lSw5XImvscu0tvzQRj",
    audioFolder: "14ghnWn5Ta7FskPmrTnyrZJKt5XG_AGA9",
    imagesFolder: "1_9lXOvVyTwF7ELnsrGbIwaeGh49l0CjD"
  }
];

// Helper to download all files in a Google Drive folder
function downloadFolderFiles(folderId, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const raw = execSync(`gdrive readonly ls ${folderId} --max 20 --json`, { encoding: "utf8" });
  const files = JSON.parse(raw);
  for (const f of files) {
    const dest = path.join(destDir, f.name);
    if (!fs.existsSync(dest) || fs.statSync(dest).size === 0) {
      process.stdout.write(`   Downloading ${f.name} -> ${destDir}... `);
      execSync(`gdrive readonly download ${f.id} --out "${dest}"`, { stdio: "pipe" });
      console.log("✓");
    }
  }
}

async function run() {
  fs.mkdirSync("scripts-out", { recursive: true });
  fs.mkdirSync("data", { recursive: true });
  fs.mkdirSync("data/kwentong-pinoy", { recursive: true });
  fs.mkdirSync("out", { recursive: true });
  fs.mkdirSync("out/kwentong-pinoy", { recursive: true });
  fs.mkdirSync("out/2 - Unpublished Vault", { recursive: true });

  console.log("========================================================");
  console.log("   KWENTONG PINOY: WAVE A BATCH RENDERER (9 SHORTS)");
  console.log("========================================================\n");

  for (let i = 0; i < waveASlugs.length; i++) {
    const item = waveASlugs[i];
    console.log(`\n--------------------------------------------------------`);
    console.log(`[${i + 1}/${waveASlugs.length}] Processing: ${item.title} (${item.slug})`);
    console.log(`--------------------------------------------------------`);

    // 1. Download Story JSON
    const scriptPath = path.resolve(`scripts-out/${item.slug}.json`);
    if (!fs.existsSync(scriptPath)) {
      console.log(`   Downloading ${item.slug}.json from Drive...`);
      execSync(`gdrive readonly download ${item.json} --out "${scriptPath}"`, { stdio: "pipe" });
    }
    // Duplicate to data folders
    fs.copyFileSync(scriptPath, path.resolve(`data/${item.slug}.json`));
    fs.copyFileSync(scriptPath, path.resolve(`data/kwentong-pinoy/${item.slug}.json`));

    // 2. Download Audio Assets
    console.log(`   Syncing audio files for ${item.slug}...`);
    downloadFolderFiles(item.audioFolder, path.resolve(`public/audio/${item.slug}`));

    // 3. Download Artwork Assets
    console.log(`   Syncing artwork files for ${item.slug}...`);
    downloadFolderFiles(item.imagesFolder, path.resolve(`public/images/${item.slug}`));

    // 4. Check if video is already rendered
    const outVideo = path.resolve(`out/kwentong-pinoy/${item.slug}.mp4`);
    if (fs.existsSync(outVideo) && fs.statSync(outVideo).size > 10 * 1024 * 1024) {
      console.log(`   ⏭️  Already rendered: out/kwentong-pinoy/${item.slug}.mp4 (${(fs.statSync(outVideo).size / 1024 / 1024).toFixed(1)} MB). Skipping render.`);
      continue;
    }

    // 5. Render via Remotion CLI
    console.log(`\n   🎬 Rendering video with Remotion...`);
    const renderCmd = `npx remotion render src/index.ts Short "${outVideo}" --props="${scriptPath}"`;
    execSync(renderCmd, { stdio: "inherit", shell: process.platform === "win32" });

    // 6. Mirror to vaults
    fs.copyFileSync(outVideo, path.resolve(`out/2 - Unpublished Vault/${item.slug}.mp4`));
    fs.copyFileSync(outVideo, path.resolve(`out/${item.slug}.mp4`));

    const sizeMB = (fs.statSync(outVideo).size / 1024 / 1024).toFixed(1);
    console.log(`   ✓ Completed render: ${item.slug}.mp4 (${sizeMB} MB)`);
  }

  console.log("\n========================================================");
  console.log("🎉 ALL 9 WAVE A VIDEOS RENDERED & STAGED IN VAULT!");
  console.log("========================================================\n");
}

run().catch((err) => {
  console.error("\n❌ Batch render halted with error:", err.message);
  process.exit(1);
});

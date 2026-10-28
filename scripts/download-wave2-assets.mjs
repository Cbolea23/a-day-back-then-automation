import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('========================================================');
console.log('   Downloading Wave 2 Assets for Kwentong Pinoy');
console.log('========================================================\n');

const episodes = [
  {
    slug: 'balete-drive-white-lady',
    jsonId: '18MGd2rzEOpTXOEHWhM8JYncpBEkJkIMa',
    audioFolderId: '1_L6B7Qu0Nkh-8JU0L5k1DQscsJnVlAZu',
    artFolderId: '1V8vDfyuyOnp86yNDNO_Ku6NlXscr28-1'
  },
  {
    slug: 'diplomat-hotel',
    jsonId: '1-nHZIK24ivccV8NPvzvq0IPzEntz7e4x',
    audioFolderId: '1QOICrt5TOqltn2vfPaglABhiewyC_lCG',
    artFolderId: '1qx3YnnffkniKQ90u9joFG9H9WM1JZUl5'
  },
  {
    slug: 'manila-film-center',
    jsonId: '1EYRfgjmODFBAW7R4IBlUdDk1tPC7V2BQ',
    audioFolderId: '1O3effUhPRUAiszJFxrmGIFJ3feleUcmL',
    artFolderId: '1OOmMGbV1s7O3H0QnjP4RU6Pfilkw9-sq'
  }
];

function downloadFolder(folderId, targetDirs) {
  for (const d of targetDirs) {
    fs.mkdirSync(d, { recursive: true });
  }

  const raw = execSync(`gdrive readonly ls ${folderId} --max 30 --json`, { encoding: 'utf8' });
  const files = JSON.parse(raw);

  for (const file of files) {
    const primary = path.join(targetDirs[0], file.name);
    process.stdout.write(`   Downloading ${file.name}... `);
    execSync(`gdrive readonly download ${file.id} --out "${primary}"`, { stdio: 'pipe' });
    
    // Mirror to other target directories
    for (let i = 1; i < targetDirs.length; i++) {
      fs.copyFileSync(primary, path.join(targetDirs[i], file.name));
    }
    console.log('✓');
  }
}

for (const ep of episodes) {
  console.log(`\n▶ Processing [${ep.slug}]...`);

  // 1. Download JSON
  const jsonPrimary = path.join('data', 'kwentong-pinoy', `${ep.slug}.json`);
  fs.mkdirSync(path.dirname(jsonPrimary), { recursive: true });
  process.stdout.write(`   Downloading JSON script... `);
  execSync(`gdrive readonly download ${ep.jsonId} --out "${jsonPrimary}"`, { stdio: 'pipe' });
  
  // Mirror JSON to data/ and scripts-out/
  fs.mkdirSync('data', { recursive: true });
  fs.mkdirSync('scripts-out', { recursive: true });
  fs.copyFileSync(jsonPrimary, path.join('data', `${ep.slug}.json`));
  fs.copyFileSync(jsonPrimary, path.join('scripts-out', `${ep.slug}.json`));
  console.log('✓');

  // 2. Download Audio
  console.log('   Fetching voice audio files (Shortwave MAI_01)...');
  downloadFolder(ep.audioFolderId, [
    path.join('public', 'audio', 'kwentong-pinoy', ep.slug),
    path.join('public', 'audio', ep.slug)
  ]);

  // 3. Download Artwork
  console.log('   Fetching 1080x1920 scene artwork...');
  downloadFolder(ep.artFolderId, [
    path.join('public', 'images', 'kwentong-pinoy', ep.slug),
    path.join('public', 'images', ep.slug)
  ]);
}

console.log('\n========================================================');
console.log('✓ All Wave 2 assets downloaded and mirrored successfully!');
console.log('========================================================\n');

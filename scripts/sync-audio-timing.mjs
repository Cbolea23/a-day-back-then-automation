import fs from 'fs';
import path from 'path';
import { durationSeconds } from './tts.mjs';

export function syncJsonToRealAudio(slug) {
  const jsonPath = path.resolve(`scripts-out/${slug}.json`);
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`File not found: ${jsonPath}`);
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let oldTotal = 0;
  let newTotal = 0;

  data.scenes.forEach((scene, i) => {
    oldTotal += scene.seconds || 0;
    const mp3Path = path.resolve(`public/${scene.audio}`);
    if (fs.existsSync(mp3Path)) {
      const realSec = durationSeconds(mp3Path);
      // Tight pad of 0.3s so the last word is readable without lingering
      scene.seconds = Math.round((realSec + 0.3) * 10) / 10;
      newTotal += scene.seconds;
      console.log(`Scene ${i + 1}: ${realSec.toFixed(2)}s audio -> scene duration set to ${scene.seconds}s (was ${scene.seconds})`);
    } else {
      console.warn(`Audio file not found: ${mp3Path}`);
      newTotal += scene.seconds || 0;
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  // Also sync to data/
  const dataPath = path.resolve(`data/${slug}.json`);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

  console.log(`\n${slug}: Old Runtime = ${oldTotal.toFixed(1)}s -> New Tight Runtime = ${newTotal.toFixed(1)}s (Saved ${(oldTotal - newTotal).toFixed(1)}s of lag/dead air)`);
  return { oldTotal, newTotal };
}

// CLI
if (process.argv[2]) {
  syncJsonToRealAudio(process.argv[2]);
}

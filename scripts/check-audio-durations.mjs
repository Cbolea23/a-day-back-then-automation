import { execSync } from 'child_process';
import fs from 'fs';

for (let i = 1; i <= 5; i++) {
  const file = `public/audio/amalanhig/${i}.mp3`;
  try {
    const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${file}"`, { encoding: 'utf8' });
    console.log(`Scene ${i} ACTUAL MP3 duration: ${parseFloat(out.trim()).toFixed(2)} seconds`);
  } catch (e) {
    console.log(`Scene ${i} error: ${e.message}`);
  }
}

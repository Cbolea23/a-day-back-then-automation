import { durationSeconds } from './tts.mjs';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts-out/amalanhig.json', 'utf8'));

console.log('Comparing MP3 real duration vs JSON scene seconds:');
let totalReal = 0;
let totalJson = 0;

data.scenes.forEach((s, i) => {
  const mp3Path = 'public/' + s.audio;
  const realSec = durationSeconds(mp3Path);
  totalReal += realSec;
  totalJson += s.seconds;
  console.log(`Scene ${i+1}: Real Audio = ${realSec.toFixed(2)}s | JSON seconds = ${s.seconds}s | Extra pad = ${(s.seconds - realSec).toFixed(2)}s`);
});

console.log(`\nTOTALS: Real Audio = ${totalReal.toFixed(2)}s | JSON Video Runtime = ${totalJson.toFixed(2)}s | Difference = ${(totalJson - totalReal).toFixed(2)}s`);

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Destination directories
fs.mkdirSync('scripts-out', { recursive: true });
fs.mkdirSync('data', { recursive: true });
fs.mkdirSync('public/images/amalanhig', { recursive: true });
fs.mkdirSync('public/audio/amalanhig', { recursive: true });

const downloads = [
  // JSON
  { id: '1dubM-LkWssOYfrUuMS9nn04dRMyKWEvx', dest: 'scripts-out/amalanhig.json' },
  // Images
  { id: '1YMtO5xnCXhq4y_08ff9LKsVSAJn0du5R', dest: 'public/images/amalanhig/1.jpg' },
  { id: '171sCKi8YgPnKecpcwm7_Ap2gi6CPhozS', dest: 'public/images/amalanhig/2.jpg' },
  { id: '1sRklbX-cRB8I8l_1cCYUqsaUixxyPywJ', dest: 'public/images/amalanhig/3.jpg' },
  { id: '1Wut1U76ykuJLa2M1Gg69bSHqcbir5tjF', dest: 'public/images/amalanhig/4.jpg' },
  { id: '12xeWDKTsHqlOQ8s7Z_48qBe4K1LUNs9G', dest: 'public/images/amalanhig/5.jpg' },
  // Audio
  { id: '1g5a-YYqG3KZLUcVFHFw5mLJUEOvkerv9', dest: 'public/audio/amalanhig/1.mp3' },
  { id: '1TSlYmDaWk18ciUYcO3DvEUoY8zFeliE-', dest: 'public/audio/amalanhig/2.mp3' },
  { id: '1HJjvdZh7JCxKJhTOXWF3my1mUPMYUXFF', dest: 'public/audio/amalanhig/3.mp3' },
  { id: '1JDDZWMbtd42Rc0xN9CUFfPuyCgplwDPx', dest: 'public/audio/amalanhig/4.mp3' },
  { id: '1aDEBOx73afk_v9fchW0LdxL87_QRSrdx', dest: 'public/audio/amalanhig/5.mp3' }
];

console.log(`Starting download of ${downloads.length} amalanhig assets from Drive...`);
for (const item of downloads) {
  process.stdout.write(`Downloading ${item.dest}... `);
  try {
    execSync(`gdrive readonly download ${item.id} --out "${item.dest}"`, { stdio: 'pipe' });
    console.log('✓');
  } catch (err) {
    console.error(`FAILED: ${err.message}`);
  }
}

// Copy json to data/
if (fs.existsSync('scripts-out/amalanhig.json')) {
  fs.copyFileSync('scripts-out/amalanhig.json', 'data/amalanhig.json');
}

console.log('All downloads completed!');

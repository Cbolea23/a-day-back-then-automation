import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const episodes = [
  { slug: 'balete-drive-white-lady', title: 'Balete Drive: The White Lady of New Manila' },
  { slug: 'diplomat-hotel', title: 'Diplomat Hotel: The Haunting of Baguio City' },
  { slug: 'manila-film-center', title: 'Manila Film Center: The Concrete Tomb' }
];

fs.mkdirSync('out/kwentong-pinoy', { recursive: true });
fs.mkdirSync('out/2 - Unpublished Vault', { recursive: true });
fs.mkdirSync('out', { recursive: true });

console.log('========================================================');
console.log('   Starting Remotion Video Render: Kwentong Pinoy Wave 2');
console.log('========================================================\n');

for (let i = 0; i < episodes.length; i++) {
  const ep = episodes[i];
  console.log(`\n--------------------------------------------------------`);
  console.log(`[${i + 1}/${episodes.length}] RENDERING: ${ep.title} (${ep.slug})`);
  console.log(`--------------------------------------------------------`);

  const primaryOut = path.resolve(`out/kwentong-pinoy/${ep.slug}.mp4`);
  const propsPath = path.resolve(`data/${ep.slug}.json`);

  const cmd = `npx remotion render src/index.ts Short "${primaryOut}" --props="${propsPath}"`;
  console.log(`Executing: ${cmd}\n`);
  
  execSync(cmd, { stdio: 'inherit' });

  // Mirror to unpublished vault and out/
  fs.copyFileSync(primaryOut, path.resolve(`out/2 - Unpublished Vault/${ep.slug}.mp4`));
  fs.copyFileSync(primaryOut, path.resolve(`out/${ep.slug}.mp4`));

  console.log(`✓ Completed render for ${ep.slug}.mp4`);
}

console.log('\n========================================================');
console.log('🎉 ALL 3 WAVE 2 VIDEOS RENDERED & STAGED SUCCESSFULLY!');
console.log('========================================================\n');

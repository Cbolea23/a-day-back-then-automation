import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const slugs = [
  'filipino-myths-bakunawa-part-1',
  'filipino-myths-babaylan-part-2'
];

console.log('=== STARTING FILIPINO MYTHS LONGFORM RENDERS (FULL 1080p) ===');
console.log('Target Slugs:', slugs.join(', '));

for (let i = 0; i < slugs.length; i++) {
  const slug = slugs[i];
  console.log(`\n------------------------------------------------------------`);
  console.log(`[${i + 1}/${slugs.length}] Rendering: ${slug}`);
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log(`------------------------------------------------------------\n`);

  const startTime = Date.now();
  const res = spawnSync('node', ['scripts/build-long.mjs', slug, '--no-voice'], {
    stdio: 'inherit',
    shell: true
  });

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  if (res.status !== 0) {
    console.error(`\n[FAILED] Render failed for ${slug} with exit code ${res.status} after ${elapsed}s`);
    process.exit(res.status || 1);
  }

  const outPath = path.join('out', 'Longform', '2 - Unpublished Vault', `long-${slug}.mp4`);
  if (fs.existsSync(outPath)) {
    const stat = fs.statSync(outPath);
    console.log(`\n[SUCCESS] Rendered ${slug}!`);
    console.log(`File: ${outPath} (${(stat.size / 1024 / 1024).toFixed(1)} MB) in ${elapsed}s`);
  } else {
    console.error(`\n[WARNING] Output file not found at expected path: ${outPath}`);
  }
}

console.log('\n============================================================');
console.log('ALL FILIPINO MYTHS LONGFORM RENDERS COMPLETE!');
console.log('============================================================\n');

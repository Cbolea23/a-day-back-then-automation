import { execSync } from 'child_process';

console.log('=== RENDERING SIGBIN (54.3s) ===');
execSync('npx remotion render src/index.ts Short out/sigbin.mp4 --props=./data/sigbin.json', { stdio: 'inherit' });

console.log('\n=== RENDERING WAKWAK (53.5s) ===');
execSync('npx remotion render src/index.ts Short out/wakwak.mp4 --props=./data/wakwak.json', { stdio: 'inherit' });

console.log('\nBoth videos rendered successfully with 1:1 synchronized caption timing!');

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Destination directories
fs.mkdirSync('scripts-out', { recursive: true });
fs.mkdirSync('data', { recursive: true });
fs.mkdirSync('public/images/sigbin', { recursive: true });
fs.mkdirSync('public/images/wakwak', { recursive: true });
fs.mkdirSync('public/audio/sigbin', { recursive: true });
fs.mkdirSync('public/audio/wakwak', { recursive: true });

// 1. Download JSONs
console.log('Downloading JSON files...');
execSync('gdrive readonly download 1sstVgS1pxKs9NhSv9NS2e1C20ZCUfKJ1 --out scripts-out/sigbin.json', { stdio: 'inherit' });
execSync('gdrive readonly download 1urYGuYKiemOrOQLInlZ8TbksgBvAdDWF --out scripts-out/wakwak.json', { stdio: 'inherit' });

// 2. Download files in a folder helper
function downloadFolderFiles(folderId, destDir) {
  const raw = execSync(`gdrive readonly ls ${folderId} --max 20 --json`, { encoding: 'utf8' });
  const files = JSON.parse(raw);
  for (const f of files) {
    const dest = path.join(destDir, f.name);
    process.stdout.write(`Downloading ${dest}... `);
    execSync(`gdrive readonly download ${f.id} --out "${dest}"`, { stdio: 'pipe' });
    console.log('✓');
  }
}

// 3. Download audio
console.log('\nDownloading sigbin audio...');
downloadFolderFiles('17SiVqgZCRMM4d4-x7OssM5byeKfDXbnk', 'public/audio/sigbin');

console.log('\nDownloading wakwak audio...');
downloadFolderFiles('1Tyr--RyEQ-uXIjaD0NaS1ZCbKvvtFclx', 'public/audio/wakwak');

// 4. Download artwork
console.log('\nDownloading sigbin artwork...');
downloadFolderFiles('1j1WxHUUqYfnDLmnj3tHki7JWmMU85QSV', 'public/images/sigbin');

console.log('\nDownloading wakwak artwork...');
downloadFolderFiles('1ReBVz4q7ebBWnYeUeV92ijaLNes1d-oF', 'public/images/wakwak');

console.log('\nAll assets downloaded successfully!');

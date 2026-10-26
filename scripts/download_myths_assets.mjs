import { execSync, exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const jobs = [
  {
    folderId: '1Nt-16c9TYWANNAw7th9Sjz440-eS_yrN',
    destDir: 'public/long/filipino-myths-bakunawa-part-1',
    label: 'Part 1 Artwork (39 PNGs)'
  },
  {
    folderId: '1f-D54jnDqvIZ98TWHCgwC4W3bool0AyJ',
    destDir: 'public/long/filipino-myths-babaylan-part-2',
    label: 'Part 2 Artwork (38 PNGs)'
  },
  {
    folderId: '17ngfQMoLKBLY14iHZle9N3OtQ8GF3zSB',
    destDir: 'public/audio/long/filipino-myths-bakunawa-part-1',
    label: 'Part 1 Audio (39 MP3s)'
  },
  {
    folderId: '1jlFdZkIwLjHTmE6g1QO6QhtVC7ML6kmu',
    destDir: 'public/audio/long/filipino-myths-babaylan-part-2',
    label: 'Part 2 Audio (38 MP3s)'
  }
];

async function runQueue(tasks, limit = 5) {
  let index = 0;
  let active = 0;
  let done = 0;

  return new Promise((resolve, reject) => {
    function next() {
      if (done === tasks.length) return resolve();
      while (active < limit && index < tasks.length) {
        const item = tasks[index++];
        active++;
        exec(`gdrive readonly download ${item.id} --out "${item.dest}"`, (err, stdout, stderr) => {
          active--;
          done++;
          if (err) {
            console.error(`[ERROR] ${item.dest}:`, err.message);
          } else {
            process.stdout.write(`\rProgress: ${done}/${tasks.length} files downloaded`);
          }
          next();
        });
      }
    }
    next();
  });
}

async function main() {
  const allTasks = [];

  for (const job of jobs) {
    console.log(`\nFetching file list for ${job.label}...`);
    fs.mkdirSync(job.destDir, { recursive: true });

    const raw = execSync(`gdrive readonly ls ${job.folderId} --max 100 --json`, { encoding: 'utf8' });
    const files = JSON.parse(raw);
    console.log(`Found ${files.length} files in Drive folder.`);

    for (const f of files) {
      const dest = path.join(job.destDir, f.name);
      if (!fs.existsSync(dest) || fs.statSync(dest).size === 0) {
        allTasks.push({ id: f.id, name: f.name, dest });
      } else {
        // already downloaded
      }
    }
  }

  console.log(`\nTotal files to download: ${allTasks.length}`);
  if (allTasks.length > 0) {
    await runQueue(allTasks, 6);
    console.log('\nAll downloads complete!');
  } else {
    console.log('All files already downloaded and up to date.');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

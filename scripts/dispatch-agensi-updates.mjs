import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { callAgensiTool } from './call-agensi-tool.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEMO_URL = 'https://youtube.com/shorts/kR_vDip2Shc';

async function updateHookRetention() {
  console.log('--- Updating hook-retention-engineer (v1.1, $9) ---');
  const baseDir = path.join(root, 'exports', '1 - Viral Shorts Hook & Retention Architect');

  const files = [
    {
      path: 'SKILL.md',
      content: fs.readFileSync(path.join(baseDir, 'SKILL.md'), 'utf8')
    },
    {
      path: 'README.md',
      content: fs.readFileSync(path.join(baseDir, 'README.md'), 'utf8')
    }
  ];

  const res = await callAgensiTool('update_skill', {
    skill_slug: 'hook-retention-engineer',
    version: '1.1',
    price: 9,
    demo_video_url: DEMO_URL,
    changelog: 'v1.1: Added 100-Point Viral Retention Audit Rubric, First-3-Second Acoustic Hook Coupling, and Cultural/Taglish Sensory Anchors. Lowered price to $9.',
    files
  });

  console.log('Hook Retention update response:', JSON.stringify(res, null, 2));
}

async function updateRemotion() {
  console.log('--- Updating remotion-video-engine (v1.2, $15) ---');
  const baseDir = path.join(root, 'exports', '2 - Remotion Video Engine Blueprint');

  const files = [
    {
      path: 'SKILL.md',
      content: fs.readFileSync(path.join(baseDir, 'SKILL.md'), 'utf8')
    },
    {
      path: 'README.md',
      content: fs.readFileSync(path.join(baseDir, 'README.md'), 'utf8')
    },
    {
      path: 'templates/ShortVideo.tsx',
      content: fs.readFileSync(path.join(baseDir, 'templates', 'ShortVideo.tsx'), 'utf8')
    },
    {
      path: 'templates/sample-short.json',
      content: fs.readFileSync(path.join(baseDir, 'templates', 'sample-short.json'), 'utf8')
    },
    {
      path: 'scripts/prosody-tts.js',
      content: fs.readFileSync(path.join(baseDir, 'scripts', 'prosody-tts.js'), 'utf8')
    }
  ];

  const res = await callAgensiTool('update_skill', {
    skill_slug: 'remotion-video-engine',
    version: '1.2',
    price: 15,
    demo_video_url: DEMO_URL,
    changelog: 'v1.2: Added turnkey code templates (ShortVideo.tsx, sample-short.json, standalone prosody-tts.js) and live production demo video. Lowered price to $15.',
    files
  });

  console.log('Remotion update response:', JSON.stringify(res, null, 2));
}

async function updateSuite() {
  console.log('--- Updating complete-ai-shorts-reels-tiktok-automation-suite (v1.2, $24) ---');
  const baseDir = path.join(root, 'exports', '3 - Complete AI Shorts Automation Suite');

  const files = [
    {
      path: 'SKILL.md',
      content: fs.readFileSync(path.join(baseDir, 'SKILL.md'), 'utf8')
    },
    {
      path: 'README.md',
      content: fs.readFileSync(path.join(baseDir, 'README.md'), 'utf8')
    },
    {
      path: 'skills/hook-retention-engineer.md',
      content: fs.readFileSync(path.join(baseDir, 'skills', 'hook-retention-engineer.md'), 'utf8')
    },
    {
      path: 'skills/kinetic-caption-processor.md',
      content: fs.readFileSync(path.join(baseDir, 'skills', 'kinetic-caption-processor.md'), 'utf8')
    },
    {
      path: 'skills/remotion-video-engine.md',
      content: fs.readFileSync(path.join(baseDir, 'skills', 'remotion-video-engine.md'), 'utf8')
    },
    {
      path: 'skills/video-scriptwriting-ideation.md',
      content: fs.readFileSync(path.join(baseDir, 'skills', 'video-scriptwriting-ideation.md'), 'utf8')
    },
    {
      path: 'templates/ShortVideo.tsx',
      content: fs.readFileSync(path.join(baseDir, 'templates', 'ShortVideo.tsx'), 'utf8')
    },
    {
      path: 'templates/sample-short.json',
      content: fs.readFileSync(path.join(baseDir, 'templates', 'sample-short.json'), 'utf8')
    },
    {
      path: 'scripts/prosody-tts.js',
      content: fs.readFileSync(path.join(baseDir, 'scripts', 'prosody-tts.js'), 'utf8')
    }
  ];

  const res = await callAgensiTool('update_skill', {
    skill_slug: 'complete-ai-shorts-reels-tiktok-automation-suite',
    version: '1.2',
    price: 24,
    demo_video_url: DEMO_URL,
    changelog: 'v1.2: Added turnkey starter kit with ShortVideo.tsx, sample-short.json, and standalone prosody-tts.js. Synchronized all 4 sub-skill modules, added live demo video. Lowered price to $24.',
    files
  });

  console.log('Suite update response:', JSON.stringify(res, null, 2));
}

async function updateStarter() {
  console.log('--- Updating ai-shorts-reels-starter-engine-free (v1.1, Free) ---');
  const baseDir = path.join(root, 'exports', '4 - AI Shorts & Reels Starter Engine (Free)');

  const files = [
    {
      path: 'SKILL.md',
      content: fs.readFileSync(path.join(baseDir, 'SKILL.md'), 'utf8')
    },
    {
      path: 'README.md',
      content: fs.readFileSync(path.join(baseDir, 'README.md'), 'utf8')
    }
  ];

  const res = await callAgensiTool('update_skill', {
    skill_slug: 'ai-shorts-reels-starter-engine-free',
    version: '1.1',
    demo_video_url: DEMO_URL,
    changelog: 'v1.1: Added live production demo video (Samhain Celtic Night Reel) and updated Pro Suite pricing to $24.',
    files
  });

  console.log('Starter update response:', JSON.stringify(res, null, 2));
}

async function main() {
  await updateHookRetention();
  await updateRemotion();
  await updateSuite();
  await updateStarter();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

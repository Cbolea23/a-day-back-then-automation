import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { callAgensiTool } from './call-agensi-tool.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function updateSuite() {
  console.log('--- Updating complete-ai-shorts-reels-tiktok-automation-suite (v1.1) ---');
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
    }
  ];

  const res = await callAgensiTool('update_skill', {
    skill_slug: 'complete-ai-shorts-reels-tiktok-automation-suite',
    version: '1.1',
    changelog: 'v1.1: Added Module 5 (Accent-Complimenting Voice & Emotional Prosody Engine). Features automatic Cultural Accent-Topic Synergy (e.g. Philippine folklore paired with authentic Filipino storyteller cadence), dynamic acoustic profiling (-4Hz pitch / -5% speed for dread vs +1Hz / +4% for viral trivia), and dramatic breath pauses.',
    files
  });

  console.log('Suite update response:', JSON.stringify(res, null, 2));
}

async function updateStarter() {
  console.log('--- Updating ai-shorts-reels-starter-engine-free (v1.1) ---');
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
    changelog: 'v1.1: Added Section 3.1: Emotional Prosody & Cultural Accent Synergy. Includes breath pause formatting for dramatic tension and acoustic calibration guidelines.',
    files
  });

  console.log('Starter update response:', JSON.stringify(res, null, 2));
}

async function main() {
  await updateSuite();
  await updateStarter();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

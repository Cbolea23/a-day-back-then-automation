import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('exports/6 - Dual-Agent Production System');

const textFilePaths = [
  'SKILL.md',
  'README.md',
  'webhook-config.template.json',
  'templates/context-brief-template.md',
  'templates/handover-checklist-template.md',
  'scripts/discord-bridge.js',
  'scripts/discord-listener-daemon.js'
];

const files = textFilePaths.map(relPath => {
  const fullPath = path.join(baseDir, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  return {
    path: relPath.replace(/\\/g, '/'),
    content
  };
});

console.log(`Prepared ${files.length} files:`);
files.forEach(f => console.log(` - ${f.path} (${f.content.length} chars)`));

fs.writeFileSync('scripts/v1-1-payload.json', JSON.stringify({
  skill_slug: 'dual-agent-production-system',
  version: '1.1',
  changelog: 'v1.1: Added Section 7 (The Live Discord Operations Bridge) and bundled executable Node.js scripts (discord-bridge.js, discord-listener-daemon.js, and webhook-config.template.json) for real-time machine-to-machine coordination and human owner Discord command center.',
  files
}, null, 2), 'utf8');

console.log('Saved payload to scripts/v1-1-payload.json');

import fs from 'fs';
import { callAgensiTool } from './call-agensi-tool.mjs';

async function main() {
  const payload = JSON.parse(fs.readFileSync('scripts/v1-1-payload.json', 'utf8'));
  console.log(`Updating skill ${payload.skill_slug} to v${payload.version}...`);
  const result = await callAgensiTool('update_skill', payload);
  console.log('Result:', JSON.stringify(result, null, 2));
}

main().catch(err => {
  console.error('Update failed:', err);
  process.exit(1);
});

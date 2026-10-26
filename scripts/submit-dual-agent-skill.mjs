import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { callAgensiTool } from './call-agensi-tool.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseDir = path.join(root, 'exports', '6 - Dual-Agent Production System');

async function submitSkill() {
  console.log('--- Step 1: Generating draft for Dual-Agent Production System ---');

  const logoBase64 = 'data:image/png;base64,' + fs.readFileSync(path.join(baseDir, 'dual-agent-logo.png')).toString('base64');
  const screenshotBase64 = 'data:image/png;base64,' + fs.readFileSync(path.join(baseDir, 'dual-agent-screenshot.png')).toString('base64');

  const files = [
    { path: 'SKILL.md', content: fs.readFileSync(path.join(baseDir, 'SKILL.md'), 'utf8') },
    { path: 'README.md', content: fs.readFileSync(path.join(baseDir, 'README.md'), 'utf8') },
    { path: 'templates/context-brief-template.md', content: fs.readFileSync(path.join(baseDir, 'templates', 'context-brief-template.md'), 'utf8') },
    { path: 'templates/handover-checklist-template.md', content: fs.readFileSync(path.join(baseDir, 'templates', 'handover-checklist-template.md'), 'utf8') }
  ];

  const payload = {
    name: 'Dual-Agent Production System',
    version: '1.0',
    pricing_type: 'paid',
    price: 24,
    summary: 'Run two AI agents as one production team — role split, handover contracts, and review gates that stop collisions, duplicate work, and unapproved publishing.',
    description: `### Two AI agents are twice the output — and twice the chaos, unless they run under a contract.

If you work with more than one AI agent, you have hit the failure modes: both agents edit the same file, one works from last week's rules, an asset gets "delivered" that the other agent cannot find, or something gets posted that you never approved.

The **Dual-Agent Production System** gives your agents the complete operating contract of a live production team: a remote "Factory" agent that generates and renders in bulk, a local "Builder" agent that works inside your apps and holds your platform tokens, and one human owner who approves anything public.

---

### ⚡ What Your Team Gains:

- 🪑 **The Three Seats + Role-Assignment Rule:** Work is assigned by where accounts, tokens, files, and apps physically live — never by whoever volunteers.
- 🚚 **The Two-Channel Law:** Code travels through git; media travels through a shared drive folder. Includes the measured cost of getting it wrong (one real repo hit 7.7 GB of artwork before this law).
- ✅ **One Checklist Is the Truth:** A single handover file records every asset's state, killing duplicate production and "done" that isn't.
- 📋 **Briefs, Not Memory:** A complete context-brief template that turns any fresh agent instance into a teammate in one read — plus the same-day maintenance rule that keeps briefs from going stale.
- 🚧 **Standing-Permission Fences:** Scoped grants so agents move fast inside their fence and always ask outside it.
- 🔒 **Review Gates:** Finished work arrives file + copy together; nothing publishes without the owner's explicit, per-item go-ahead.
- ⚠️ **Failure-Mode Table:** Six real collisions (stale rules, duplicate production, silent scope creep, lost assets...) and the countermeasure for each.

---

### 📦 What's Inside:
1. \`SKILL.md\` (The complete dual-agent operating system)
2. \`README.md\` (Overview & who it's for)
3. \`templates/context-brief-template.md\` (Fill-in brief for onboarding any agent)
4. \`templates/handover-checklist-template.md\` (The shared source-of-truth format)`,
    tags: ['productivity', 'automation', 'prompt-skill-engineering', 'business-operations'],
    keywords: ['multi-agent', 'two agents', 'ai-agents', 'handover', 'coordination', 'content-operations', 'workflow', 'agent-team'],
    requirements: ['Two AI agent environments with access to a shared git repo', 'A shared cloud drive folder'],
    support_method: 'https://github.com/Cbolea23/a-day-back-then-automation/issues',
    compatibility_note: 'Vendor-neutral: works with any two agents that can read files (Claude Code, Cursor, Antigravity, Codex, and more). Built on git, a shared drive folder, and written briefs.',
    known_limitations: 'Coordination layer only — no creative or production skills included (hooks, voice, rendering are separate skills). Full value requires two agent environments; single-agent users still benefit from the brief and checklist discipline across sessions.',
    sample_input: 'Set up a two-agent workflow for my channel: one agent renders videos remotely, the other schedules them from my PC. Write the briefs and the handover system.',
    sample_output: 'A complete coordination setup: role table for your operation, a filled context brief for each agent, the handover checklist file, the drive folder structure with its README, and your standing-permission fences in writing.',
    logo: logoBase64,
    screenshots: [screenshotBase64],
    faq: [
      {
        question: 'Does this require specific agent products?',
        answer: 'No. The system is vendor-neutral — it is built on git, a shared drive folder, and written briefs, so it works with any two agents that can read files.'
      },
      {
        question: 'I only have one agent. Is this useful?',
        answer: 'The brief and checklist discipline still pays off across sessions (your agent\'s future instances are effectively new teammates), but the full value shows with two agents.'
      },
      {
        question: 'Can the agents publish on their own under this system?',
        answer: 'Only if you write that into your fences. The default gates require your explicit per-item approval for anything public.'
      }
    ],
    files
  };

  // Step 1: Create draft
  const draftRes = await callAgensiTool('submit_skill', payload);
  console.log('Draft response:', JSON.stringify(draftRes, null, 2));

  let draftId = null;
  try {
    const parsedText = JSON.parse(draftRes.result.content[0].text);
    draftId = parsedText.draft_id;
  } catch (e) {
    console.error('Failed to parse draft_id from draft response');
    return;
  }

  if (!draftId) {
    console.error('No draft_id returned');
    return;
  }

  console.log(`--- Step 2: Confirming submission for draft_id: ${draftId} ---`);
  const confirmRes = await callAgensiTool('submit_skill', {
    draft_id: draftId,
    confirm: true
  });

  console.log('Final confirmation response:', JSON.stringify(confirmRes, null, 2));
}

submitSkill().catch(err => {
  console.error('Fatal error during submission:', err);
  process.exit(1);
});

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { callAgensiTool } from './call-agensi-tool.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseDir = path.join(root, 'exports', '5 - Emotional AI Voiceover & Prosody Director');

async function submitSkill() {
  console.log('--- Step 1: Generating draft for Emotional AI Voiceover & Prosody Director ---');

  const logoBase64 = 'data:image/png;base64,' + fs.readFileSync(path.join(baseDir, 'prosody-director-logo.png')).toString('base64');
  const screenshotBase64 = 'data:image/png;base64,' + fs.readFileSync(path.join(baseDir, 'prosody-director-screenshot.png')).toString('base64');

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
      path: 'scripts/prosody-tts.js',
      content: fs.readFileSync(path.join(baseDir, 'scripts', 'prosody-tts.js'), 'utf8')
    }
  ];

  const payload = {
    name: 'Emotional AI Voiceover & Prosody Director',
    version: '1.0',
    pricing_type: 'paid',
    price: 9,
    summary: 'Eliminate flat, robotic AI voiceovers with calibrated acoustic prosody, breath pauses, and cultural accent synergy.',
    description: `### Stop letting flat, monotone AI voices ruin your audience retention.

Viewers drop off within seconds when an AI narrator sounds like a robotic textbook reader reciting words without human feeling.

The **Emotional AI Voiceover & Prosody Director** gives your AI coding assistant (Claude Code, Cursor, Copilot, Antigravity, and 20+ agents) the complete rulebook and executable tools to direct neural TTS voices with expressive human rhythm, suspenseful breath pauses, and cultural authenticity.

---

### ⚡ What Your Agent Gains:

- 🎭 **The Acoustic Calibration Matrix:** Automatically configures neural pitch and rate parameters across 4 emotion profiles:
  - \`spooky-suspense\` (Pitch: -4Hz to -6Hz, Rate: -5%) for eerie folklore dread and cryptid mysteries.
  - \`intense-drama\` (Pitch: -2Hz, Rate: -2%) for historical battles and urgent cataclysms.
  - \`documentary-calm\` (Pitch: -1Hz, Rate: -1%) for deep-dive history and architecture.
  - \`viral-energetic\` (Pitch: +1Hz, Rate: +4%) for rapid trivia, surprising paradoxes, and viral hooks.
- 🫁 **Dramatic Breath Pause Injection:** Inserts natural inhalation pauses (\`...\`) and cadence pivots (\`—\`) that cause neural TTS engines to drop vocal pitch by 2–4 semitones before reveals.
- 🌏 **Cultural Accent-Topic Synergy:** Matches story lore to authentic accents (e.g. Philippine folklore with native Filipino campfire cadence, British history with BBC documentary style).
- 🔁 **Seamless Loop Deceleration:** Decelerates the final sentence by -2% to -4% to guarantee infinite video watch-time loops without audio clipping.
- ⏱️ **Pure Node.js MP3 Frame Parser:** Computes millisecond-accurate audio durations directly in Node.js from MPEG sync headers—zero external dependencies or \`ffprobe\` required.

---

### 📦 What's Inside:
1. \`SKILL.md\` (Acoustic matrix & emotional prosody rulebook)
2. \`README.md\` (Setup & quickstart instructions)
3. \`scripts/prosody-tts.js\` (Turnkey zero-cost Edge TTS CLI synthesizer)`,
    tags: ['writing-content', 'image-video', 'social-media', 'prompt-skill-engineering'],
    keywords: ['voiceover', 'tts', 'edge-tts', 'audio', 'prosody', 'ai-voice', 'retention', 'video-automation'],
    requirements: ['Node.js', 'Python 3 (for edge-tts)'],
    support_method: 'https://github.com/Cbolea23/a-day-back-then-automation/issues',
    compatibility_note: 'Universal support for Claude Code, Cursor, Codex, Antigravity, and any agent supporting SKILL.md.',
    known_limitations: 'Synthesizes spoken narration audio and acoustic profiles. Does not generate visual video frames (see Remotion Video Engine or Complete Suite for video composition).',
    sample_input: 'Synthesize an eerie folklore voiceover for a Philippine cryptid legend with dramatic breath pauses.',
    sample_output: 'Audio MP3 synthesized with fil-PH-AngeloNeural, -4Hz pitch, -5% speed, 350ms inhalation pause, and parsed duration of 5.42 seconds.',
    logo: logoBase64,
    screenshots: [screenshotBase64],
    faq: [
      {
        question: 'What TTS engines are supported?',
        answer: 'The skill is optimized for Microsoft Edge TTS (included out-of-the-box for zero cost), but the textual prosody formatting and acoustic rules apply universally to ElevenLabs, OpenAI TTS, and Gemini Voice.'
      },
      {
        question: 'Do I need paid API keys for audio synthesis?',
        answer: 'No! The bundled scripts/prosody-tts.js script uses Microsoft Edge neural TTS, which requires zero paid API keys, zero subscriptions, and zero tokens.'
      },
      {
        question: 'How does it compute exact audio duration without ffprobe?',
        answer: 'The bundled script contains a pure Node.js binary parser that reads MPEG Layer 3 sync frames and sample rates directly from buffer, making it 100% portable across headless servers and CI/CD.'
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

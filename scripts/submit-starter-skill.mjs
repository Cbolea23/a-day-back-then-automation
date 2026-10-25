import { callAgensiMcp } from './call-agensi-tool.mjs';

const draftId = '0d4eb695-f796-47ad-b9f0-571dabb874ea';

async function confirmSubmission() {
  console.log('Submitting finalized skill with draft_id:', draftId);

  const payload = {
    draft_id: draftId,
    confirm: true,
    summary: 'Zero-cost quickstart engine for creating viral vertical AI Shorts and Reels in minutes.',
    compatibility_note: 'Universal support for Claude Code, Cursor, Codex, Antigravity, and any agent supporting SKILL.md.',
    known_limitations: 'Single-narrator vertical video only. Does not include automated social publishing APIs or dual-character banter (available in Pro Suite).',
    sample_input: 'Create a 30-second viral Short about the library of Alexandria.',
    sample_output: '30s high-retention script with 3s pattern interrupt, Edge TTS audio generation, and Remotion video render commands.',
    faq: [
      {
        question: 'Is this skill really 100% free?',
        answer: 'Yes, absolutely. It uses zero-cost Microsoft Edge TTS neural voices and open Remotion video primitives.'
      },
      {
        question: 'What video platforms are supported?',
        answer: 'Output is a 1080x1920 MP4 vertical video format, fully optimized for YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels.'
      },
      {
        question: 'How does this compare to the Complete AI Shorts Suite ($45)?',
        answer: 'This free starter skill handles single-narrator scriptwriting and local Remotion rendering. The $45 Complete Suite adds autonomous multi-platform social publishing APIs (YouTube & Instagram), dual-character staging, automated safe-zone QA, and calendar vault scheduling.'
      }
    ]
  };

  const res = await callAgensiMcp('tools/call', {
    name: 'submit_skill',
    arguments: payload
  });

  console.log('Confirmation Response:', JSON.stringify(res, null, 2));
}

confirmSubmission().catch(console.error);

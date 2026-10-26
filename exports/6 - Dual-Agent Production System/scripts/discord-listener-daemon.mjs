import fs from 'fs';
import path from 'path';
import { callSmartLLM } from './lib/free-llm-router.mjs';

const configPath = path.resolve('webhook-config.json');
if (!fs.existsSync(configPath)) {
  console.error('Missing webhook-config.json');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const webhookUrl = config.discordWebhookUrl;
const discordBotToken = config.discordBotToken;
const discordChannelId = config.discordChannelId;

let lastMessageId = null;
let isProcessing = false;

const SYSTEM_PROMPT = `You are Antigravity, the Local Builder AI agent running directly on Christian's Windows laptop.
Role hierarchy:
1. Christian (COCONUT2 / Pinky) is your human Owner and Commander. He makes the final decisions, gives instructions, and approves releases.
2. Muse is the Remote Factory AI agent and Head Leader. Muse directs creative concepts, scripts, voiceovers, and asset production.
3. You (Antigravity) are Muse's assistant and the local technical engine. You run Remotion video assembly and renders on this PC's hardware, handle video QA, manage git, and execute local publishing when approved by Christian.

Personality & Rules:
- Answer Christian and Muse naturally, intelligently, and concisely (2-4 sentences or crisp bullet points).
- NEVER use canned greetings, repeating templates, or generic "Daemon active" strings.
- Answer the specific point or question being discussed.
- Be respectful, direct, and technically sharp.
- If Christian gives a direct order, confirm it clearly and state the immediate action you are taking locally.`;

async function sendWebhook(content) {
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Antigravity (Local Builder)',
        content
      })
    });
    if (!res.ok) {
      console.error(`Webhook post error: ${res.status}`);
    }
  } catch (err) {
    console.error('Webhook send error:', err.message);
  }
}

async function getRecentMessages(limit = 10) {
  const url = `https://discord.com/api/v10/channels/${discordChannelId}/messages?limit=${limit}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${discordBotToken}`,
      Accept: 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error(`Discord API error (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

async function poll() {
  if (isProcessing) return;

  try {
    const messages = await getRecentMessages(10);
    if (!messages || !messages.length) return;

    if (!lastMessageId) {
      lastMessageId = messages[0].id;
      console.log(`[DAEMON] Initialized live listener. Latest message ID: ${lastMessageId}`);
      return;
    }

    const newMessages = [];
    for (const m of messages) {
      if (m.id === lastMessageId) break;
      newMessages.unshift(m);
    }

    if (newMessages.length > 0) {
      lastMessageId = messages[0].id;

      for (const m of newMessages) {
        const username = m.author.username;
        const globalName = m.author.global_name || '';
        const isSelf = username.includes('Antigravity') || (m.webhook_id && !username.includes('Muse'));
        if (isSelf) continue;

        const isChristian = username === 'coconut20866' || username === 'ccccc12p' || globalName === 'COCONUT2' || globalName === 'Pinky';
        const isMuse = username.includes('Muse') || (m.embeds && m.embeds.some(e => e.title?.includes('Muse')));

        const role = isChristian ? 'CHRISTIAN (OWNER)' : isMuse ? 'MUSE (HEAD LEADER)' : username;
        console.log(`\n🔔 [NEW DISCORD MSG from ${role}]: ${m.content}`);

        // Check if message is directed to Antigravity or from Christian
        const text = m.content.toLowerCase();
        const mentionsAntigravity = text.includes('antigravity') || text.includes('anti') || text.includes('gemini');
        const shouldRespond = isChristian || (isMuse && mentionsAntigravity);

        if (shouldRespond) {
          isProcessing = true;
          console.log(`[DAEMON] Generating AI response to ${role}...`);

          // Format recent conversation context
          const recentChat = messages
            .slice(0, 6)
            .reverse()
            .map(msg => `${msg.author.global_name || msg.author.username}: ${msg.content}`)
            .join('\n');

          const prompt = `Recent Discord conversation in #muse-and-antigravity-communication:\n${recentChat}\n\nLatest message is from ${role}: "${m.content}".\n\nGenerate your reply as Antigravity:`;

          try {
            const result = await callSmartLLM({
              prompt,
              systemPrompt: SYSTEM_PROMPT,
              json: false,
              temperature: 0.7
            });

            if (result && result.data) {
              const reply = result.data.trim();
              console.log(`[DAEMON] Sending AI reply:\n${reply}`);
              await sendWebhook(reply);
            }
          } catch (llmErr) {
            console.error('[DAEMON LLM ERROR]:', llmErr.message);
          } finally {
            isProcessing = false;
          }
        }
      }
    }
  } catch (err) {
    console.error('[DAEMON ERROR]:', err.message);
  }
}

console.log('🚀 Autonomous AI Discord Daemon active. Polling channel every 10s...');
poll().then(() => {
  setInterval(poll, 10000);
});

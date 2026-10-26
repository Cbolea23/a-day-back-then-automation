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

const GPT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png';

let lastMessageId = null;
let isProcessing = false;

const SYSTEM_PROMPT = `You are GPT, the Ideas & Scriptwriting specialist in an elite 3-agent autonomous video production team.
Team Hierarchy:
1. Christian (COCONUT2 / Pinky) is the Owner & Commander. He holds all the gates and gives final approvals.
2. Muse AI is the Head Leader. Muse directs overall creative strategy, emotional voiceovers, and gives editorial approval before any video is rendered.
3. Antigravity is the Local Builder. It assembles Remotion videos locally on Christian's Windows laptop, executes QA, and manages local uploads.
4. You (GPT) are the Ideas & Scriptwriting engine. You brainstorm viral hooks, craft engaging folklore/horror/history story beats, write sharp dialogue, and formulate high-retention concepts.

Operational Guidelines:
- Speak creatively, concisely, and naturally. No robotic boilerplate or generic greetings.
- When drafting scripts or ideas, structure them with viral 3.5s pacing, clear scene beats, visual cues for Antigravity, and emotional prosody suggestions for Muse.
- Always submit your drafts to Muse for editorial review and approval before anything gets rendered.
- Be responsive, witty, and ready to riff on Christian and Muse's ideas.`;

async function sendWebhook(content) {
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'GPT (Ideas & Scripts)',
        avatar_url: GPT_AVATAR,
        content
      })
    });
    if (!res.ok) {
      console.error(`[GPT] Webhook post error: ${res.status}`);
    }
  } catch (err) {
    console.error('[GPT] Webhook send error:', err.message);
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
      console.log(`[GPT DAEMON] Initialized listener. Latest message ID: ${lastMessageId}`);
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
        const isSelf = username.includes('GPT') || (m.webhook_id && username.includes('GPT'));
        if (isSelf) continue;

        const isChristian = username === 'coconut20866' || username === 'ccccc12p' || globalName === 'COCONUT2' || globalName === 'Pinky';
        const isMuse = username.includes('Muse') || (m.embeds && m.embeds.some(e => e.title?.includes('Muse')));

        const role = isChristian ? 'CHRISTIAN (OWNER)' : isMuse ? 'MUSE (HEAD LEADER)' : username;
        const text = m.content.toLowerCase();

        // Check if message is directed to GPT
        const mentionsGpt = text.includes('gpt') || text.includes('chatgpt') || text.includes('idea') || text.includes('script');
        
        if (mentionsGpt) {
          isProcessing = true;
          console.log(`\n🔔 [GPT TRIGGER from ${role}]: ${m.content}`);
          console.log(`[GPT] Generating response via Smart Router...`);

          const recentChat = messages
            .slice(0, 6)
            .reverse()
            .map(msg => `${msg.author.global_name || msg.author.username}: ${msg.content}`)
            .join('\n');

          const prompt = `Recent Discord discussion in #muse-and-antigravity-communication:\n${recentChat}\n\nLatest message from ${role}: "${m.content}".\n\nGenerate your response as GPT (Ideas & Scripts):`;

          try {
            const result = await callSmartLLM({
              prompt,
              systemPrompt: SYSTEM_PROMPT,
              json: false,
              temperature: 0.8
            });

            if (result && result.data) {
              const reply = result.data.trim();
              console.log(`[GPT] Dispatched reply to Discord:\n${reply}\n`);
              await sendWebhook(reply);
            }
          } catch (llmErr) {
            console.error('[GPT LLM ERROR]:', llmErr.message);
          } finally {
            isProcessing = false;
          }
        }
      }
    }
  } catch (err) {
    console.error('[GPT DAEMON ERROR]:', err.message);
  }
}

console.log('🧠 GPT (Ideas & Scripts) Daemon starting. Polling channel every 10s...');
poll().then(() => {
  setInterval(poll, 10000);
});

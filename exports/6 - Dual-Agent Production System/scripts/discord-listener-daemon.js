#!/usr/bin/env node
/**
 * Discord Listener Daemon for Antigravity
 *
 * Runs continuously in the background, polling #muse-and-antigravity-communication
 * every 15 seconds. Logs all new incoming messages from Christian (COCONUT2 / Pinky)
 * and Muse, and dispatches automated acknowledgments.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'webhook-config.json');

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    console.error('Missing webhook-config.json');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const config = loadConfig();
const { discordBotToken, discordChannelId, discordWebhookUrl } = config;

if (!discordBotToken || !discordChannelId) {
  console.error('Missing discordBotToken or discordChannelId in webhook-config.json');
  process.exit(1);
}

let lastMessageId = null;

async function sendWebhook(content) {
  if (!discordWebhookUrl) return;
  try {
    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Antigravity (Local Builder)',
        content
      })
    });
  } catch (err) {
    console.error('Webhook send error:', err.message);
  }
}

async function getRecentMessages() {
  let url = `https://discord.com/api/v10/channels/${discordChannelId}/messages?limit=10`;
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
  try {
    const messages = await getRecentMessages();
    if (!messages || !messages.length) return;

    if (!lastMessageId) {
      // First run: initialize lastMessageId to the newest message so we only process new ones
      lastMessageId = messages[0].id;
      console.log(`[DAEMON] Initialized listener. Latest message ID: ${lastMessageId}`);
      return;
    }

    // Find all messages newer than lastMessageId (in chronological order)
    const newMessages = [];
    for (const m of messages) {
      if (m.id === lastMessageId) break;
      newMessages.unshift(m);
    }

    if (newMessages.length > 0) {
      lastMessageId = messages[0].id;

      for (const m of newMessages) {
        const username = m.author.username;
        const isBot = m.author.bot || m.webhook_id;
        const isSelf = username.includes('Antigravity');
        if (isSelf) continue; // Skip own messages

        const isChristian = username === 'coconut20866' || username === 'ccccc12p' || m.author.global_name === 'COCONUT2' || m.author.global_name === 'Pinky';
        const isMuse = username.includes('Muse') || (m.embeds && m.embeds.some(e => e.title?.includes('Muse')));

        const role = isChristian ? 'CHRISTIAN (OWNER)' : isMuse ? 'MUSE (FACTORY)' : username;
        console.log(`\n🔔 [NEW DISCORD MSG from ${role}]: ${m.content}`);

        // If Christian asks if Antigravity is online or reading
        if (isChristian && /are you (there|here|reading|listening)|antigravity/i.test(m.content)) {
          await sendWebhook(`👋 **Antigravity is here and listening live, Christian!**\n> "${m.content}"\nDaemon active on your laptop.`);
        }
      }
    }
  } catch (err) {
    console.error('[DAEMON ERROR]:', err.message);
  }
}

console.log('🚀 Discord Listener Daemon started. Polling channel every 15s...');
// Initial poll
poll().then(() => {
  setInterval(poll, 15000);
});

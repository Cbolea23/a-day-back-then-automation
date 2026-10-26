#!/usr/bin/env node
/**
 * Discord Agent Bridge for Antigravity & Muse AI
 *
 * Provides bidirectional communication between Antigravity (Local Builder)
 * and Muse (Remote Factory) through a dedicated Discord operations channel.
 *
 * Usage:
 *   node scripts/discord-bridge.mjs --send "Hello from Antigravity"
 *   node scripts/discord-bridge.mjs --event ASSET_SYNC_COMPLETE --slug filipino-myths-bakunawa-part-1
 *   node scripts/discord-bridge.mjs --poll
 *   node scripts/discord-bridge.mjs --test
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'webhook-config.json');

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    return {
      discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
      discordBotToken: process.env.DISCORD_BOT_TOKEN || '',
      discordChannelId: process.env.DISCORD_CHANNEL_ID || '',
      agentId: 'antigravity'
    };
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    console.error('Error parsing webhook-config.json:', e.message);
    return {};
  }
}

/**
 * Send a message or structured payload to Discord via Incoming Webhook
 */
export async function sendToDiscord({ content, embeds, username = 'Antigravity (Local Builder)', avatar_url }) {
  const config = loadConfig();
  const webhookUrl = config.discordWebhookUrl;

  if (!webhookUrl) {
    throw new Error('Missing discordWebhookUrl in webhook-config.json or DISCORD_WEBHOOK_URL env');
  }

  const payload = {
    username,
    avatar_url: avatar_url || 'https://raw.githubusercontent.com/google-deepmind/antigravity/main/assets/avatar.png',
    content: content || '',
    embeds: embeds || []
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Discord webhook failed (${res.status}): ${errText}`);
  }

  return { success: true, status: res.status };
}

/**
 * Send a structured machine-to-machine event to Discord
 */
export async function dispatchEvent(eventType, data = {}) {
  const colorMap = {
    RENDER_REQUEST: 0x3b82f6,      // Blue
    RENDER_COMPLETE: 0x10b981,     // Green
    ASSET_SYNC_COMPLETE: 0x8b5cf6, // Purple
    REVIEW_READY: 0xf59e0b,        // Amber
    PUBLISHED: 0x06b6d4,           // Cyan
    ERROR: 0xef4444,               // Red
    STATUS_QUERY: 0x64748b         // Slate
  };

  const embed = {
    title: `📡 [EVENT: ${eventType}]`,
    color: colorMap[eventType] || 0x64748b,
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Antigravity ↔ Muse Agent Bridge'
    },
    fields: [
      { name: 'Sender', value: '`Antigravity (Local Builder)`', inline: true },
      { name: 'Recipient', value: '`Muse (Remote Factory)`', inline: true },
      { name: 'Event Type', value: `\`${eventType}\``, inline: true }
    ]
  };

  if (data.slug) {
    embed.fields.push({ name: 'Slug', value: `\`${data.slug}\``, inline: true });
  }
  if (data.status) {
    embed.fields.push({ name: 'Status', value: `**${data.status}**`, inline: true });
  }
  if (data.details) {
    embed.fields.push({ name: 'Details', value: String(data.details).slice(0, 1024), inline: false });
  }

  // Embed structured raw JSON payload in a code block for Muse's parser
  const rawPayload = JSON.stringify({ event: eventType, sender: 'antigravity', recipient: 'muse', timestamp: new Date().toISOString(), ...data }, null, 2);
  const content = `\`\`\`json\n${rawPayload}\n\`\`\``;

  return sendToDiscord({
    content: `**[M2M Dispatched]** \`${eventType}\` for \`${data.slug || 'global'}\``,
    embeds: [embed]
  });
}

/**
 * Read recent messages from Discord channel via Bot Token
 */
export async function fetchMessages(limit = 10, afterId = null) {
  const config = loadConfig();
  const token = config.discordBotToken;
  const channelId = config.discordChannelId;

  if (!token || !channelId) {
    return {
      success: false,
      error: 'Reading messages requires discordBotToken and discordChannelId in webhook-config.json'
    };
  }

  let url = `https://discord.com/api/v10/channels/${channelId}/messages?limit=${limit}`;
  if (afterId) url += `&after=${afterId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${token}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch Discord messages (${res.status}): ${errText}`);
  }

  const messages = await res.json();
  return { success: true, messages };
}

// CLI handler
const args = process.argv.slice(2);
const isTest = args.includes('--test');
const isSend = args.includes('--send');
const isEvent = args.includes('--event');
const isPoll = args.includes('--poll');

if (isTest) {
  console.log('Sending test message to Discord...');
  sendToDiscord({
    content: '🚀 **Antigravity ↔ Muse Agent Bridge Online**\nConnected from local workspace. Listening for Muse events.'
  })
    .then(() => console.log('✓ Test message delivered successfully!'))
    .catch((err) => console.error('Test failed:', err.message));
} else if (isSend) {
  const msgIdx = args.indexOf('--send');
  const msg = args[msgIdx + 1] || 'Ping from Antigravity';
  sendToDiscord({ content: msg })
    .then(() => console.log('✓ Message sent!'))
    .catch((err) => console.error('Failed to send:', err.message));
} else if (isEvent) {
  const eventIdx = args.indexOf('--event');
  const eventType = args[eventIdx + 1] || 'STATUS_QUERY';
  const slugIdx = args.indexOf('--slug');
  const slug = slugIdx !== -1 ? args[slugIdx + 1] : undefined;
  dispatchEvent(eventType, { slug })
    .then(() => console.log(`✓ Event ${eventType} dispatched!`))
    .catch((err) => console.error('Failed to dispatch event:', err.message));
} else if (isPoll) {
  console.log('Polling recent Discord messages...');
  fetchMessages(5)
    .then((res) => {
      if (!res.success) {
        console.warn(res.error);
      } else {
        console.log(`Retrieved ${res.messages.length} messages.`);
        for (const m of res.messages) {
          console.log(`[${m.author.username}]: ${m.content.slice(0, 100)}`);
        }
      }
    })
    .catch((err) => console.error('Poll error:', err.message));
}

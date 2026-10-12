#!/usr/bin/env node
/**
 * Cross-Platform Phone Notification Dispatcher
 * 
 * Supports:
 *   1. Discord Webhooks (Rich embeds with title, description, timestamp)
 *   2. ntfy.sh (Free push notifications directly to phone lockscreen, zero signup)
 *   3. Telegram Bot API (Direct messages to Telegram)
 * 
 * Usage:
 *   node scripts/send-phone-alert.mjs "Message title" "Message body text"
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configFile = path.join(root, "webhook-config.json");

export function getWebhookConfig() {
  if (fs.existsSync(configFile)) {
    try {
      return JSON.parse(fs.readFileSync(configFile, "utf8"));
    } catch {}
  }
  return {};
}

export async function sendPhoneAlert(title, message, options = {}) {
  const config = getWebhookConfig();
  let sentAny = false;

  // 1. Discord Webhook
  if (config.discordWebhookUrl) {
    try {
      const res = await fetch(config.discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "A Day Back Then Bot",
          avatar_url: "https://i.imgur.com/4M34hi2.png",
          embeds: [
            {
              title: `📢 ${title}`,
              description: message,
              color: options.color || 0xffa500, // Orange
              timestamp: new Date().toISOString(),
              footer: { text: "A Day Back Then Automation" }
            }
          ]
        })
      });
      if (res.ok) {
        console.log("✓ Discord notification sent successfully!");
        sentAny = true;
      } else {
        console.warn("Discord webhook returned status:", res.status);
      }
    } catch (err) {
      console.error("Discord webhook error:", err.message);
    }
  }

  // 2. ntfy.sh (Instant phone push notification)
  if (config.ntfyTopic) {
    try {
      const topicUrl = `https://ntfy.sh/${config.ntfyTopic}`;
      const res = await fetch(topicUrl, {
        method: "POST",
        headers: {
          Title: title,
          Priority: options.priority || "high",
          Tags: options.tags || "calendar,bell"
        },
        body: message
      });
      if (res.ok) {
        console.log(`✓ ntfy.sh push notification sent to [${config.ntfyTopic}]!`);
        sentAny = true;
      }
    } catch (err) {
      console.error("ntfy.sh error:", err.message);
    }
  }

  // 3. Telegram Bot API
  if (config.telegramBotToken && config.telegramChatId) {
    try {
      const url = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: config.telegramChatId,
          text: `*${title}*\n\n${message}`,
          parse_mode: "Markdown"
        })
      });
      if (res.ok) {
        console.log("✓ Telegram message sent successfully!");
        sentAny = true;
      }
    } catch (err) {
      console.error("Telegram error:", err.message);
    }
  }

  if (!sentAny) {
    console.warn("⚠️ No active webhook configured in webhook-config.json. Alert was not sent.");
    return false;
  }
  return true;
}

// CLI usage
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const title = process.argv[2] || "Test Notification";
  const body = process.argv[3] || "This is a test notification from A Day Back Then!";
  sendPhoneAlert(title, body).catch(console.error);
}

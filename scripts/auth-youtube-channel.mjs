#!/usr/bin/env node
/**
 * Multi-Channel YouTube OAuth Authenticator
 *
 * Usage:
 *   node scripts/auth-youtube-channel.mjs <channel-slug>
 *
 * Examples:
 *   node scripts/auth-youtube-channel.mjs kwentong-pinoy
 *   node scripts/auth-youtube-channel.mjs bible-chronicles
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clientSecretPath = path.join(root, 'client_secret.json');
const tokensDir = path.join(root, 'tokens');
const channelsPath = path.join(root, 'scripts', 'config', 'channels.json');

const targetSlug = process.argv[2];

if (!targetSlug) {
  console.log(`
Usage:
  node scripts/auth-youtube-channel.mjs <channel-slug>

Available channels:
  kwentong-pinoy     (Kwentong Pinoy: Lore & History)
  bible-chronicles   (Genesis to Glory / Bible Chronicles)
  adaybackthen       (A Day Back Then - Main)
`);
  process.exit(1);
}

fs.mkdirSync(tokensDir, { recursive: true });

function getClientCredentials() {
  if (fs.existsSync(clientSecretPath)) {
    const raw = JSON.parse(fs.readFileSync(clientSecretPath, 'utf8'));
    const creds = raw.installed || raw.web;
    if (creds?.client_id && creds?.client_secret) {
      return { clientId: creds.client_id, clientSecret: creds.client_secret };
    }
  }

  const legacyPath = path.join(root, 'youtube-tokens.json');
  if (fs.existsSync(legacyPath)) {
    const raw = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
    if (raw?.client_id && raw?.client_secret) {
      return { clientId: raw.client_id, clientSecret: raw.client_secret };
    }
  }

  console.error('Error: Could not find client_id and client_secret in client_secret.json or youtube-tokens.json');
  process.exit(1);
}

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
  'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
];
const PORT = 8085;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

async function main() {
  const { clientId, clientSecret } = getClientCredentials();

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent',
    }).toString();

  console.log('\n========================================================');
  console.log(`   Authorizing YouTube Channel: ${targetSlug}`);
  console.log('========================================================\n');
  console.log('Opening your browser to authorize with Google...\n');
  console.log('If your browser does not open automatically, click this link:\n');
  console.log(authUrl + '\n');

  try {
    if (process.platform === 'win32') {
      execSync(`start "" "${authUrl}"`);
    } else if (process.platform === 'darwin') {
      execSync(`open "${authUrl}"`);
    } else {
      execSync(`xdg-open "${authUrl}"`);
    }
  } catch {}

  const server = http.createServer(async (req, res) => {
    try {
      const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
      if (reqUrl.pathname !== '/oauth2callback') {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }

      const code = reqUrl.searchParams.get('code');
      const error = reqUrl.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h2>Authorization Error:</h2><p>${error}</p>`);
        server.close();
        process.exit(1);
      }

      if (!code) {
        res.writeHead(400);
        res.end('Missing code');
        return;
      }

      console.log('Exchanging authorization code for tokens...');
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h2>Token exchange failed</h2><pre>${errText}</pre>`);
        server.close();
        console.error('Token exchange error:', errText);
        process.exit(1);
      }

      const tokens = await tokenRes.json();

      // Query YouTube API to verify which channel was chosen
      console.log('Verifying connected channel identity...');
      const ytRes = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const ytData = await ytRes.json();
      const channelItem = ytData.items?.[0];

      const channelTitle = channelItem?.snippet?.title || 'Unknown Channel';
      const channelId = channelItem?.id || 'Unknown ID';
      const customUrl = channelItem?.snippet?.customUrl || '';

      console.log(`\n🎉 CONNECTED: ${channelTitle} (${channelId}) ${customUrl}`);

      const targetTokenFile = path.join(tokensDir, `youtube-${targetSlug}.json`);
      const stored = {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token,
        expiry_date: Date.now() + (tokens.expires_in || 3600) * 1000,
        channelId,
        channelTitle,
        customUrl,
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(targetTokenFile, JSON.stringify(stored, null, 2), 'utf8');
      console.log(`✓ Saved channel tokens to: ${targetTokenFile}`);

      // Update channels.json
      if (fs.existsSync(channelsPath)) {
        try {
          const ch = JSON.parse(fs.readFileSync(channelsPath, 'utf8'));
          let key = targetSlug;
          if (ch[key]) {
            ch[key].ytChannelId = channelId;
            ch[key].ytTitle = channelTitle;
            ch[key].ytHandle = customUrl;
            ch[key].ytTokenFile = `tokens/youtube-${targetSlug}.json`;
            fs.writeFileSync(channelsPath, JSON.stringify(ch, null, 2), 'utf8');
            console.log(`✓ Updated channels.json for ${key}`);
          }
        } catch (e) {
          console.warn('Could not update channels.json:', e.message);
        }
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family:system-ui,sans-serif; text-align:center; padding-top:60px; max-width:600px; margin:0 auto;">
          <h1 style="color:#10b981; font-size:32px;">✓ Connected to YouTube!</h1>
          <p style="font-size:20px; color:#1e293b; margin:15px 0;"><strong>${channelTitle}</strong></p>
          <p style="color:#64748b; font-size:16px;">Channel ID: <code>${channelId}</code></p>
          <div style="margin-top:30px; padding:15px; background:#f1f5f9; border-radius:8px; color:#475569;">
            You can close this tab and return to the terminal.
          </div>
        </div>
      `);

      server.close();
      console.log('\n========================================================');
      console.log('   Authorization Complete!');
      console.log('========================================================\n');
      process.exit(0);
    } catch (err) {
      server.close();
      console.error('Fatal error in callback:', err.message);
      process.exit(1);
    }
  });

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}...`);
  });
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});

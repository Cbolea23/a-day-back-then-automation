#!/usr/bin/env node
/**
 * Lists all Facebook Pages and linked Instagram accounts accessible by a User Token,
 * exchanges tokens for permanent page access tokens, and updates scripts/config/channels.json.
 *
 * Usage:
 *   node scripts/list-all-pages.mjs "<USER_ACCESS_TOKEN>"
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokenPath = path.join(root, 'facebook-tokens.json');
const channelsPath = path.join(root, 'scripts', 'config', 'channels.json');

const userToken = process.argv[2];

if (!userToken) {
  console.log(`
Usage:
  node scripts/list-all-pages.mjs "<USER_ACCESS_TOKEN_FROM_GRAPH_EXPLORER>"
`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
const { appId, appSecret } = config;

async function main() {
  console.log('1. Fetching long-lived user token...');
  const exchangeUrl = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${userToken}`;
  const exchangeRes = await fetch(exchangeUrl);
  const exchangeData = await exchangeRes.json();

  if (exchangeData.error) {
    console.error('Error exchanging token:', exchangeData.error.message);
    process.exit(1);
  }

  const longLivedUserToken = exchangeData.access_token;
  console.log('✓ Long-lived user token acquired.');

  console.log('\n2. Querying all managed pages (/me/accounts)...');
  const accountsUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,category,access_token,instagram_business_account{id,username}&access_token=${longLivedUserToken}`;
  const accountsRes = await fetch(accountsUrl);
  const accountsData = await accountsRes.json();

  if (accountsData.error) {
    console.error('Error fetching accounts:', accountsData.error.message);
    process.exit(1);
  }

  const pages = accountsData.data || [];
  console.log(`✓ Found ${pages.length} Facebook Page(s):\n`);

  fs.mkdirSync(path.dirname(channelsPath), { recursive: true });
  let channels = {};
  if (fs.existsSync(channelsPath)) {
    try {
      channels = JSON.parse(fs.readFileSync(channelsPath, 'utf8'));
    } catch {}
  }

  for (const page of pages) {
    const ig = page.instagram_business_account;
    console.log(`========================================`);
    console.log(`Page Name: ${page.name}`);
    console.log(`Page ID:   ${page.id}`);
    console.log(`Category:  ${page.category}`);
    if (ig) {
      console.log(`Linked IG: @${ig.username} (ID: ${ig.id})`);
    } else {
      console.log(`Linked IG: [None connected yet]`);
    }

    // Determine slug
    let slug = 'adaybackthen';
    const nameLower = page.name.toLowerCase();
    if (nameLower.includes('kuwento') || nameLower.includes('dati') || nameLower.includes('misteryo') || nameLower.includes('filipino') || nameLower.includes('sinauna')) {
      slug = 'philippine-lore';
    } else if (nameLower.includes('bible') || nameLower.includes('scripture') || nameLower.includes('eden') || nameLower.includes('canon')) {
      slug = 'bible-chronicles';
    } else if (page.id !== '1322330324303425') {
      slug = nameLower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    channels[slug] = {
      name: page.name,
      pageId: page.id,
      pageAccessToken: page.access_token,
      instagramBusinessAccountId: ig?.id || null,
      instagramUsername: ig?.username || null,
      updatedAt: new Date().toISOString()
    };
  }

  fs.writeFileSync(channelsPath, JSON.stringify(channels, null, 2), 'utf8');
  console.log(`\n========================================`);
  console.log(`✓ channels.json updated at ${channelsPath}`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});

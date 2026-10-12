#!/usr/bin/env node
/**
 * Exchanges a short-lived User Access Token from Meta Graph Explorer
 * into a permanent Long-Lived Page Access Token with Instagram permissions.
 *
 * Usage:
 *   node scripts/exchange-meta-token.mjs "<SHORT_LIVED_TOKEN>"
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenPath = path.join(root, "facebook-tokens.json");

const shortLivedToken = process.argv[2];

if (!shortLivedToken) {
  console.log(`
Usage:
  node scripts/exchange-meta-token.mjs "<USER_TOKEN_FROM_GRAPH_EXPLORER>"

Steps:
1. Open https://developers.facebook.com/tools/explorer/
2. Select App: "Shorts Factory Automation"
3. Add permissions:
   - instagram_basic
   - instagram_content_publish
   - pages_show_list
   - pages_read_engagement
   - pages_manage_posts
4. Click "Generate Access Token" and approve Page + Instagram.
5. Run: node scripts/exchange-meta-token.mjs "<PASTE_TOKEN_HERE>"
`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
const { appId, appSecret, pageId } = config;

async function run() {
  console.log("1. Exchanging short-lived token for long-lived user token...");
  const exchangeUrl = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;
  const exRes = await fetch(exchangeUrl);
  const exData = await exRes.json();

  if (exData.error) {
    console.error("Exchange error:", exData.error.message);
    process.exit(1);
  }

  const longLivedUserToken = exData.access_token;
  console.log("✓ Long-lived user token acquired.");

  console.log(`2. Fetching permanent Page Access Token for Page ID: ${pageId}...`);
  const accountsUrl = `https://graph.facebook.com/v20.0/me/accounts?access_token=${longLivedUserToken}`;
  const accRes = await fetch(accountsUrl);
  const accData = await accRes.json();

  if (accData.error) {
    console.error("Accounts error:", accData.error.message);
    process.exit(1);
  }

  const targetPage = accData.data?.find((p) => p.id === pageId);
  if (!targetPage) {
    console.error(`Page ${pageId} not found in user accounts list.`);
    console.log("Available pages:", accData.data?.map((p) => `${p.name} (${p.id})`));
    process.exit(1);
  }

  const newPageAccessToken = targetPage.access_token;
  console.log(`✓ Permanent Page Access Token obtained for "${targetPage.name}".`);

  // Verify Instagram account
  console.log("3. Verifying linked Instagram account...");
  const igUrl = `https://graph.facebook.com/v20.0/${pageId}?fields=instagram_business_account,page_backed_instagram_accounts&access_token=${newPageAccessToken}`;
  const igRes = await fetch(igUrl);
  const igData = await igRes.json();

  const igId = igData.instagram_business_account?.id || igData.page_backed_instagram_accounts?.data?.[0]?.id;
  console.log("Detected Instagram ID:", igId || "None found");

  // Save config
  config.pageAccessToken = newPageAccessToken;
  config.updatedAt = new Date().toISOString();
  if (igId) config.instagramAccountId = igId;

  fs.writeFileSync(tokenPath, JSON.stringify(config, null, 2));
  console.log("\n========================================================");
  console.log("🎉 SUCCESS: facebook-tokens.json has been updated!");
  console.log("You can now upload to Instagram Reels directly via:");
  console.log("  npm run upload:ig -- <slug>");
  console.log("========================================================\n");
}

run().catch((err) => {
  console.error("Unexpected error:", err.message);
  process.exit(1);
});

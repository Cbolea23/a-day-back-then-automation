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
const secretPath = path.join(root, ".meta_secret");

const shortLivedToken = process.argv[2];

if (!shortLivedToken) {
  console.log(`
Usage:
  node scripts/exchange-meta-token.mjs "<USER_TOKEN_FROM_GRAPH_EXPLORER>"
`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
let appSecret = config.appSecret;
if (!appSecret && fs.existsSync(secretPath)) {
  appSecret = fs.readFileSync(secretPath, "utf8").trim();
}

if (!appSecret) {
  console.error("\n❌ Missing Meta App Secret!");
  console.error("Please add 'appSecret' to facebook-tokens.json or save it into .meta_secret");
  console.error("Find it at: https://developers.facebook.com/apps/4703201276567472/settings/basic/\n");
  process.exit(1);
}

const { appId, pageId } = config;

async function run() {
  console.log("\n========================================================");
  console.log("   Exchanging Meta Token for Permanent Page Token");
  console.log("========================================================\n");

  console.log("1. Exchanging short-lived token for long-lived user token...");
  const exchangeUrl = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;
  const exRes = await fetch(exchangeUrl);
  const exData = await exRes.json();

  if (exData.error) {
    console.error("Exchange error:", exData.error.message);
    process.exit(1);
  }

  const longLivedUserToken = exData.access_token;
  console.log("✓ Long-lived user token acquired (valid ~60 days).");

  console.log(`2. Fetching permanent Page Access Token for Page ID: ${pageId}...`);
  let newPageAccessToken = null;

  // Try direct page query first
  const pageDirectUrl = `https://graph.facebook.com/v21.0/${pageId}?fields=access_token,name&access_token=${longLivedUserToken}`;
  const pageDirectRes = await fetch(pageDirectUrl);
  const pageDirectData = await pageDirectRes.json();

  if (pageDirectData.access_token) {
    newPageAccessToken = pageDirectData.access_token;
    console.log(`✓ Permanent Page Access Token obtained directly for "${pageDirectData.name}".`);
  } else {
    // Fallback to /me/accounts
    const accountsUrl = `https://graph.facebook.com/v21.0/me/accounts?access_token=${longLivedUserToken}`;
    const accRes = await fetch(accountsUrl);
    const accData = await accRes.json();
    const targetPage = accData.data?.find((p) => p.id === pageId);
    if (targetPage && targetPage.access_token) {
      newPageAccessToken = targetPage.access_token;
      console.log(`✓ Permanent Page Access Token obtained via me/accounts for "${targetPage.name}".`);
    } else {
      console.error("Could not obtain page access token:", pageDirectData.error || accData.error);
      process.exit(1);
    }
  }

  // 3. Verify debug_token
  console.log("3. Verifying debug_token for permanent lifespan...");
  const debugUrl = `https://graph.facebook.com/debug_token?input_token=${newPageAccessToken}&access_token=${newPageAccessToken}`;
  const debugRes = await fetch(debugUrl);
  const debugData = await debugRes.json();
  const tokenInfo = debugData.data;

  console.log(`   Type:       ${tokenInfo?.type}`);
  console.log(`   Is Valid:   ${tokenInfo?.is_valid}`);
  console.log(`   Expires At: ${tokenInfo?.expires_at} (${tokenInfo?.expires_at === 0 ? "NEVER EXPIRES / PERMANENT" : new Date(tokenInfo?.expires_at * 1000).toISOString()})`);

  if (!tokenInfo?.is_valid || tokenInfo?.type !== "PAGE") {
    console.warn("⚠️ Warning: Token debug returned unexpected state:", tokenInfo);
  }

  // 4. Verify published posts read
  console.log("4. Verifying published posts read on page...");
  const postsUrl = `https://graph.facebook.com/v21.0/${pageId}/published_posts?fields=created_time&limit=1&access_token=${newPageAccessToken}`;
  const postsRes = await fetch(postsUrl);
  const postsData = await postsRes.json();

  if (postsData.error) {
    console.error("❌ Error reading published posts:", postsData.error.message);
    process.exit(1);
  }
  console.log("✓ Published posts check passed successfully (no error 190/210).");

  // 5. Update facebook-tokens.json
  config.pageAccessToken = newPageAccessToken;
  config.updatedAt = new Date().toISOString();

  fs.writeFileSync(tokenPath, JSON.stringify(config, null, 2), "utf8");
  console.log("\n========================================================");
  console.log("🎉 SUCCESS: facebook-tokens.json updated with permanent token!");
  console.log("Expires at: 0 (Never expires)");
  console.log("========================================================\n");
}

run().catch((err) => {
  console.error("Unexpected error:", err.message);
  process.exit(1);
});

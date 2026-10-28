import fs from "node:fs";
import { execSync } from "node:child_process";
import sodium from "tweetsodium";

const root = process.cwd();

// 1. Get GitHub token from Git credential helper
const out = execSync("git credential fill", {
  input: "protocol=https\nhost=github.com\n\n",
  encoding: "utf8"
});
const passLine = out.split("\n").find(l => l.startsWith("password="));
const ghToken = passLine.replace("password=", "").trim();

const repo = "Cbolea23/content-automation-engine";

// 2. Fetch repo public key
async function getPublicKey() {
  const res = await fetch(`https://api.github.com/repos/${repo}/actions/secrets/public-key`, {
    headers: {
      Authorization: `Bearer ${ghToken}`,
      "User-Agent": "Antigravity-Sync"
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch public key: ${res.statusText}`);
  }
  return await res.json();
}

// 3. Encrypt secret
function encryptSecret(secretValue, keyBase64) {
  const messageBytes = Buffer.from(secretValue);
  const keyBytes = Buffer.from(keyBase64, "base64");
  const encryptedBytes = sodium.seal(messageBytes, keyBytes);
  return Buffer.from(encryptedBytes).toString("base64");
}

// 4. Set secret
async function setSecret(secretName, secretValue, keyData) {
  const encrypted = encryptSecret(secretValue, keyData.key);
  const res = await fetch(`https://api.github.com/repos/${repo}/actions/secrets/${secretName}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${ghToken}`,
      "Content-Type": "application/json",
      "User-Agent": "Antigravity-Sync"
    },
    body: JSON.stringify({
      encrypted_value: encrypted,
      key_id: keyData.key_id
    })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to set secret ${secretName}: ${res.status} ${text}`);
  }
  console.log(`✓ Secret '${secretName}' uploaded successfully.`);
}

async function run() {
  console.log("=== Syncing Secrets to GitHub Cloud Runner ===");
  const keyData = await getPublicKey();
  console.log(`Retrieved repo public key (Key ID: ${keyData.key_id})`);

  // Load local credentials
  const fbConfig = JSON.parse(fs.readFileSync("facebook-tokens.json", "utf8"));
  const ytTokens = fs.readFileSync("tokens/youtube-adaybackthen.json", "utf8");
  const ytClientSecret = fs.readFileSync("client_secret.json", "utf8");

  await setSecret("FB_PAGE_ACCESS_TOKEN", fbConfig.pageAccessToken, keyData);
  await setSecret("FB_PAGE_ID", fbConfig.pageId, keyData);
  await setSecret("IG_USER_ID", fbConfig.instagramBusinessAccountId || "17841424372744648", keyData);
  await setSecret("YOUTUBE_TOKENS_JSON", ytTokens, keyData);
  await setSecret("YOUTUBE_CLIENT_SECRET_JSON", ytClientSecret, keyData);

  console.log("\nAll secrets securely uploaded to GitHub Actions repository secrets!");
}

run().catch(console.error);

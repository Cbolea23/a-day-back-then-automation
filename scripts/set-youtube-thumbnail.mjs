import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenPath = path.join(root, "youtube-tokens.json");

async function getAccessToken() {
  const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
  if (!tokens.access_token || Date.now() >= (tokens.expiry_date || 0) - 120000) {
    const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: tokens.client_id,
        client_secret: tokens.client_secret,
        refresh_token: tokens.refresh_token,
        grant_type: "refresh_token",
      }),
    });
    const refreshed = await refreshRes.json();
    tokens.access_token = refreshed.access_token;
    tokens.expiry_date = Date.now() + (refreshed.expires_in || 3600) * 1000;
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
  }
  return tokens.access_token;
}

export async function setThumbnail(videoId, imagePath) {
  const token = await getAccessToken();
  const buffer = fs.readFileSync(imagePath);

  const res = await fetch(
    `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}&uploadType=media`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/jpeg",
      },
      body: buffer,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update thumbnail (${res.status}): ${err}`);
  }

  const data = await res.json();
  console.log("✓ Thumbnail updated on YouTube successfully for video:", videoId);
  return data;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const videoId = process.argv[2] || "HMSIFhgvDko";
  const imagePath = process.argv[3] || path.join(root, "out", "thumbnails", "gladiator-they-were-fat.jpg");
  setThumbnail(videoId, imagePath).catch(console.error);
}

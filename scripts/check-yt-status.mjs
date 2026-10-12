import fs from "node:fs";

async function check() {
  const tokenFile = "youtube-tokens.json";
  const tokens = JSON.parse(fs.readFileSync(tokenFile, "utf8"));
  let accessToken = tokens.access_token;

  if (!accessToken || Date.now() >= (tokens.expiry_date || 0) - 60000) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: tokens.client_id,
        client_secret: tokens.client_secret,
        refresh_token: tokens.refresh_token,
        grant_type: "refresh_token",
      })
    });
    const d = await res.json();
    accessToken = d.access_token;
  }

  const chRes = await fetch("https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true", {
    headers: { Authorization: "Bearer " + accessToken }
  });
  const chData = await chRes.json();
  const uploadsListId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  console.log("Uploads playlist:", uploadsListId);

  if (!uploadsListId) return;

  const plRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${uploadsListId}`, {
    headers: { Authorization: "Bearer " + accessToken }
  });
  const plData = await plRes.json();
  const videoIds = (plData.items || []).map(i => i.contentDetails.videoId);
  console.log("Found recent video IDs:", videoIds.length);

  const vRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=status,snippet&id=${videoIds.join(",")}`, {
    headers: { Authorization: "Bearer " + accessToken }
  });
  const vData = await vRes.json();
  let scheduledCount = 0;
  for (const v of vData.items || []) {
    if (v.status.publishAt || v.status.privacyStatus === "private") {
      scheduledCount++;
      console.log("SCHEDULED/PRIVATE:", v.id, "publishAt:", v.status.publishAt, "status:", v.status.privacyStatus, "title:", v.snippet.title);
    }
  }
  console.log(`Summary: ${scheduledCount} scheduled/private videos found out of ${videoIds.length} recent.`);
}
check().catch(console.error);

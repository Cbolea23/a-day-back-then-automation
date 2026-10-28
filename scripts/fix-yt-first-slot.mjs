import fs from "node:fs";

async function updateVideoSchedule() {
  const tokenFile = "tokens/youtube-adaybackthen.json";
  const tokens = JSON.parse(fs.readFileSync(tokenFile, "utf8"));
  
  // Refresh token if needed
  const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: tokens.client_id,
      client_secret: tokens.client_secret,
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token"
    })
  });
  const refreshed = await refreshRes.json();
  const accessToken = refreshed.access_token;

  // Get video snippet
  const getRes = await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id=8wjaePWJqgQ", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await getRes.json();
  const video = data.items[0];

  video.snippet.title = "The Deadly Green Wallpaper of Victorian Homes #shorts";
  video.status.privacyStatus = "private";
  video.status.publishAt = "2026-11-01T04:00:00.000Z";

  const updateRes = await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet,status", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(video)
  });
  const resData = await updateRes.json();
  console.log("Updated video 8wjaePWJqgQ:");
  console.log("Title:", resData.snippet?.title);
  console.log("Status:", resData.status?.privacyStatus);
  console.log("PublishAt:", resData.status?.publishAt);
}

updateVideoSchedule().catch(console.error);

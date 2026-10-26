import fs from "node:fs";

async function main() {
  const tokenPath = "youtube-tokens.json";
  const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf8"));

  let accessToken = tokens.access_token;
  if (!tokens.access_token || Date.now() >= (tokens.expiry_date || 0) - 120000) {
    console.log("Refreshing YouTube access token...");
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
    if (!refreshRes.ok) {
      console.error("Refresh failed:", refreshed);
      return;
    }
    accessToken = refreshed.access_token;
    tokens.access_token = refreshed.access_token;
    tokens.expiry_date = Date.now() + (refreshed.expires_in || 3600) * 1000;
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
    console.log("Token refreshed.");
  }

  const videoIds = [
    "kgf3QLAAOq4", // halloween-history-short
    "kR_vDip2Shc", // samhain-night
    "2_uxvNGpG4o", // banshee
    "_ZIM_rZ2c-4", // vlad-impaler
    "o1Akf1Jj9AQ", // witch-finder
    "GlSpAyF1XG0", // tower-ghosts
    "l9gu3ptn7Xs", // plague-doctor-short
    "Ggq9ZZYNprY", // dancing-plague
  ];

  const res = await fetch(
    "https://www.googleapis.com/youtube/v3/videos?part=snippet,status,contentDetails,statistics&id=" +
      videoIds.join(",") +
      "&access_token=" +
      accessToken
  );
  const data = await res.json();
  if (data.items) {
    for (const item of data.items) {
      console.log("Title:       ", item.snippet.title);
      console.log("ID:          ", item.id);
      console.log("PublishedAt: ", item.snippet.publishedAt);
      console.log("Privacy:     ", item.status.privacyStatus);
      console.log("Duration:    ", item.contentDetails.duration);
      console.log("Views:       ", item.statistics.viewCount);
      console.log("Likes:       ", item.statistics.likeCount || 0);
      console.log("Comments:    ", item.statistics.commentCount || 0);
      console.log("-----------------------------------------");
    }
  } else {
    console.log("Error querying:", data);
  }
}

main().catch(console.error);

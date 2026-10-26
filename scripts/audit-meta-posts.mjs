import fs from "node:fs";

const config = JSON.parse(fs.readFileSync("facebook-tokens.json", "utf8"));

async function check() {
  console.log("Checking Facebook Page:", config.pageId);
  const fbRes = await fetch(`https://graph.facebook.com/v20.0/${config.pageId}/video_reels?fields=id,video_id,description,creation_time&limit=50&access_token=${config.pageAccessToken}`);
  const fbData = await fbRes.json();
  console.log("Facebook video_reels count:", fbData.data ? fbData.data.length : 0);
  if (fbData.data) {
    for (const v of fbData.data) {
      console.log(`FB Reel: id=${v.id} video_id=${v.video_id} time=${v.creation_time} desc=${(v.description || "").replace(/\n/g, " ").slice(0, 60)}`);
    }
  } else {
    console.log("FB error or empty:", JSON.stringify(fbData));
  }

  console.log("\nChecking Facebook Scheduled Posts / Videos:");
  const schedRes = await fetch(`https://graph.facebook.com/v20.0/${config.pageId}/scheduled_posts?fields=id,message,created_time,scheduled_publish_time&limit=50&access_token=${config.pageAccessToken}`);
  const schedData = await schedRes.json();
  console.log("Scheduled posts count:", schedData.data ? schedData.data.length : 0);
  if (schedData.data) {
    for (const p of schedData.data) {
      const dt = p.scheduled_publish_time ? new Date(p.scheduled_publish_time * 1000).toISOString() : "no-time";
      console.log(`Scheduled post: id=${p.id} time=${dt} msg=${(p.message || "").replace(/\n/g, " ").slice(0, 60)}`);
    }
  }

  console.log("\nChecking Instagram Media:", config.instagramBusinessAccountId);
  const igRes = await fetch(`https://graph.facebook.com/v20.0/${config.instagramBusinessAccountId}/media?fields=id,caption,media_type,timestamp,permalink&limit=50&access_token=${config.pageAccessToken}`);
  const igData = await igRes.json();
  console.log("Instagram media count:", igData.data ? igData.data.length : 0);
  if (igData.data) {
    for (const m of igData.data) {
      console.log(`IG Media: id=${m.id} type=${m.media_type} time=${m.timestamp} caption=${(m.caption || "").replace(/\n/g, " ").slice(0, 60)} permalink=${m.permalink}`);
    }
  } else {
    console.log("IG error or empty:", JSON.stringify(igData));
  }
}

check().catch(console.error);

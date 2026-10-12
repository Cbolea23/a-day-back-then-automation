import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenFile = path.join(root, "facebook-tokens.json");
const pubFile = path.join(root, "published-urls-facebook.json");

if (!fs.existsSync(tokenFile)) {
  console.error("facebook-tokens.json not found!");
  process.exit(1);
}

const fb = JSON.parse(fs.readFileSync(tokenFile, "utf8"));
const pub = fs.existsSync(pubFile) ? JSON.parse(fs.readFileSync(pubFile, "utf8")) : {};

async function clearAllScheduledFacebook() {
  console.log("========================================================");
  console.log("   CLEARING ALL SCHEDULED POSTS FROM FACEBOOK PAGE");
  console.log("========================================================\n");

  let totalDeleted = 0;

  while (true) {
    const url = `https://graph.facebook.com/v21.0/${fb.pageId}/scheduled_posts?access_token=${fb.pageAccessToken}&limit=100`;
    const res = await fetch(url);
    const d = await res.json();

    if (!res.ok || d.error) {
      console.error("Error fetching scheduled posts:", d.error);
      break;
    }

    const posts = d.data || [];
    if (posts.length === 0) {
      console.log("Zero scheduled posts remaining on Facebook!");
      break;
    }

    console.log(`Fetched batch of ${posts.length} scheduled posts to delete...`);

    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      const hook = (p.message || "").split("\n")[0] || "No message";
      const schedTime = p.scheduled_publish_time ? new Date(p.scheduled_publish_time * 1000).toISOString() : (p.created_time || "unknown");

      const delRes = await fetch(`https://graph.facebook.com/v21.0/${p.id}?access_token=${fb.pageAccessToken}`, {
        method: "DELETE",
      });
      const delData = await delRes.json();

      if (delData.success) {
        totalDeleted++;
        console.log(`[${totalDeleted}] Deleted: ${p.id} (${schedTime}) - "${hook.slice(0, 45)}"`);
        
        // Remove from published-urls-facebook.json
        for (const [slug, item] of Object.entries(pub)) {
          if (item.postId === p.id || (item.videoId && p.id.includes(item.videoId))) {
            delete pub[slug];
          }
        }
      } else {
        console.warn(`Failed to delete ${p.id}:`, delData);
      }
    }

    // Save updated published-urls-facebook.json after each batch
    fs.writeFileSync(pubFile, JSON.stringify(pub, null, 2) + "\n");
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("\n========================================================");
  console.log(`CLEARED TOTAL: ${totalDeleted} scheduled posts from Facebook!`);
  console.log("Updated published-urls-facebook.json successfully.");
  console.log("========================================================");
}

clearAllScheduledFacebook().catch(console.error);

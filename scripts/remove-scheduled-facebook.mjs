import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenFile = path.join(root, "facebook-tokens.json");
const pubFile = path.join(root, "published-urls-facebook.json");

if (!fs.existsSync(tokenFile)) {
  console.error("facebook-tokens.json not found!");
  process.exit(1);
}

const fb = JSON.parse(fs.readFileSync(tokenFile, "utf8"));
const pub = fs.existsSync(pubFile) ? JSON.parse(fs.readFileSync(pubFile, "utf8")) : {};

async function removeScheduledFacebook() {
  console.log("========================================================");
  console.log("   REMOVING SCHEDULED FACEBOOK POSTS (OCT 28 ONWARDS)");
  console.log("========================================================\n");

  let url = `https://graph.facebook.com/v21.0/${fb.pageId}/scheduled_posts?access_token=${fb.pageAccessToken}&limit=100`;
  let all = [];

  while (url) {
    const res = await fetch(url);
    const d = await res.json();
    if (!d.data || d.data.length === 0) break;
    all.push(...d.data);
    url = d.paging?.next || null;
  }

  console.log(`Found ${all.length} total scheduled posts on Facebook Page.`);

  // Filter for posts scheduled on Oct 28 and later
  const cutoff = new Date("2026-10-28T00:00:00Z");
  const toDelete = all.filter((p) => new Date(p.created_time) >= cutoff);
  const toKeep = all.filter((p) => new Date(p.created_time) < cutoff);

  console.log(`Posts to KEEP (Oct 11 - Oct 27 with full background art): ${toKeep.length}`);
  console.log(`Posts to DELETE (Oct 28+ without background art):          ${toDelete.length}\n`);

  let deletedCount = 0;
  for (let i = 0; i < toDelete.length; i++) {
    const post = toDelete[i];
    const hook = post.message ? post.message.split("\n")[0] : "No title";
    console.log(`[${i + 1}/${toDelete.length}] Deleting ${post.id} (${post.created_time}) - "${hook}"...`);

    const delRes = await fetch(`https://graph.facebook.com/v21.0/${post.id}?access_token=${fb.pageAccessToken}`, {
      method: "DELETE",
    });
    const delData = await delRes.json();

    if (delData.success) {
      deletedCount++;
      // Remove from published-urls-facebook.json if present
      for (const [slug, item] of Object.entries(pub)) {
        if (item.postId === post.id || item.videoId === post.id.split("_")[1]) {
          delete pub[slug];
        }
      }
    } else {
      console.warn(`  Failed to delete ${post.id}:`, delData);
    }
  }

  fs.writeFileSync(pubFile, JSON.stringify(pub, null, 2) + "\n");

  console.log("\n========================================================");
  console.log(`Successfully deleted ${deletedCount} scheduled posts from Facebook.`);
  console.log(`Kept ${toKeep.length} scheduled posts (through Oct 27) intact.`);
  console.log("Updated published-urls-facebook.json.");
  console.log("========================================================");
}

removeScheduledFacebook().catch(console.error);

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenFile = path.join(root, "facebook-tokens.json");
const pubFile = path.join(root, "published-urls-facebook.json");

const fb = JSON.parse(fs.readFileSync(tokenFile, "utf8"));
const pub = fs.existsSync(pubFile) ? JSON.parse(fs.readFileSync(pubFile, "utf8")) : {};

const targetSlugs = [
  "spartan-training-day",
  "sparta-myths",
  "roman-patrician-vs-plebeian",
  "roman-myths",
  "roman-legionary-march",
  "roman-garum",
  "greek-symposium",
  "egypt-pyramid-workers",
  "egypt-pharaoh-day",
  "egypt-myths",
  "roman-money",
  "medieval-blacksmith-job",
  "medieval-monk-day"
];

async function removeScheduledPosts() {
  console.log("========================================================");
  console.log("   REMOVING SCHEDULED FACEBOOK POSTS (OCT 12-15 BATCH)");
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

  console.log(`Total scheduled posts currently on Facebook: ${all.length}`);

  const toDelete = [];

  for (const slug of targetSlugs) {
    const scriptPath = path.join(root, "scripts-out", `${slug}.json`);
    let hook = "";
    if (fs.existsSync(scriptPath)) {
      hook = JSON.parse(fs.readFileSync(scriptPath, "utf8")).hook || "";
    }

    const matches = all.filter((p) => {
      const msg = p.message || "";
      if (hook && msg.includes(hook)) return true;
      const slugWords = slug.replace(/-/g, " ");
      return msg.toLowerCase().includes(slugWords);
    });

    for (const m of matches) {
      toDelete.push({ slug, post: m });
    }
  }

  console.log(`\nFound ${toDelete.length} scheduled posts on Facebook to delete.\n`);

  let deletedCount = 0;
  for (let i = 0; i < toDelete.length; i++) {
    const item = toDelete[i];
    const hook = item.post.message ? item.post.message.split("\n")[0] : "No title";
    console.log(`[${i + 1}/${toDelete.length}] Deleting ${item.post.id} (${item.post.created_time}) - "${hook}" [${item.slug}]...`);

    const delRes = await fetch(
      `https://graph.facebook.com/v21.0/${item.post.id}?access_token=${fb.pageAccessToken}`,
      { method: "DELETE" }
    );
    const delData = await delRes.json();

    if (delData.success) {
      deletedCount++;
      console.log(`    ✅ Successfully unscheduled from Facebook.`);
    } else {
      console.error(`    ❌ Failed to delete:`, delData);
    }
  }

  // Also remove these target slugs from published-urls-facebook.json so they can be re-scheduled once remastered
  for (const slug of targetSlugs) {
    if (pub[slug]) {
      delete pub[slug];
      console.log(`Untracked ${slug} from published-urls-facebook.json`);
    }
  }

  fs.writeFileSync(pubFile, JSON.stringify(pub, null, 2));

  console.log(`\n🎉 Completed! Deleted ${deletedCount}/${toDelete.length} scheduled posts from Facebook.`);
}

removeScheduledPosts();

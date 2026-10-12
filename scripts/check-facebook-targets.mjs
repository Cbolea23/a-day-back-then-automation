import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenFile = path.join(root, "facebook-tokens.json");
const fb = JSON.parse(fs.readFileSync(tokenFile, "utf8"));

const targetSlugs = [
  "roman-money",
  "medieval-blacksmith-job",
  "medieval-monk-day",
  "spartan-training-day",
  "sparta-myths",
  "roman-patrician-vs-plebeian",
  "roman-myths",
  "roman-legionary-march",
  "roman-garum",
  "greek-symposium",
  "egypt-pyramid-workers",
  "egypt-pharaoh-day",
  "egypt-myths"
];

async function check() {
  let url = `https://graph.facebook.com/v21.0/${fb.pageId}/scheduled_posts?access_token=${fb.pageAccessToken}&limit=100`;
  let all = [];
  while (url) {
    const res = await fetch(url);
    const d = await res.json();
    if (!d.data || d.data.length === 0) break;
    all.push(...d.data);
    url = d.paging?.next || null;
  }

  console.log(`Total scheduled posts on Facebook: ${all.length}`);

  const matched = [];

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

    console.log(`[${slug}] (Hook: "${hook}") -> Matched ${matches.length} posts`);
    for (const m of matches) {
      console.log(`    Post ID: ${m.id} | Scheduled: ${m.created_time}`);
      matched.push({ slug, post: m });
    }
  }

  console.log(`\nTotal matched posts to remove from Facebook: ${matched.length}`);
}

check();

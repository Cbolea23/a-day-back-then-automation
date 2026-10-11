import fs from "node:fs";

const content = fs.readFileSync("src/Narrator.tsx", "utf8");
const match = content.match(/export function getThemeFromSlug\([\s\S]*?\n\}/);
if (!match) throw new Error("Could not find getThemeFromSlug");

const fnCode = match[0]
  .replace(/:\s*CharacterTheme/, "")
  .replace(/slug:\s*string\s*=\s*""/, 'slug = ""')
  .replace("export function getThemeFromSlug", "function getThemeFromSlug")
  + "; return getThemeFromSlug;";

const getTheme = new Function(fnCode)();
const topicsData = JSON.parse(fs.readFileSync("topics.json", "utf8"));
const topics = Array.isArray(topicsData) ? topicsData : topicsData.topics || [];

const themeCounts = {};
topics.forEach(t => {
  const theme = getTheme(t.slug);
  themeCounts[theme] = (themeCounts[theme] || 0) + 1;
});

console.log("Total topics evaluated:", topics.length);
console.log("\nBreakdown by Era/Theme:");
console.log(JSON.stringify(themeCounts, null, 2));

console.log("\nAudit of every single topic:");
topics.forEach((t, i) => {
  console.log(`${i + 1}. ${t.slug} -> [${getTheme(t.slug)}]`);
});

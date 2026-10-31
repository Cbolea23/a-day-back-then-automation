import fs from "node:fs";

const schedule = [
  { date: "2026-11-01", time: "12:00", slug: "victorian-arsenic-green-wallpaper" },
  { date: "2026-11-01", time: "18:30", slug: "victorian-body-snatchers" },
  { date: "2026-11-01", time: "21:00", slug: "victorian-corset-fainting" },
  { date: "2026-11-02", time: "12:00", slug: "victorian-mudlark-job" },
  { date: "2026-11-02", time: "18:30", slug: "victorian-pea-souper-smog" },
  { date: "2026-11-02", time: "21:00", slug: "victorian-penny-blood" },
  { date: "2026-11-03", time: "12:00", slug: "victorian-phossy-jaw-matchgirls" },
  { date: "2026-11-03", time: "18:30", slug: "victorian-post-mortem-photos" },
  { date: "2026-11-03", time: "21:00", slug: "victorian-sewer-hunters-toshers" },
  { date: "2026-11-04", time: "12:00", slug: "victorian-chimney-sweep-job" },
  { date: "2026-11-04", time: "18:30", slug: "victorian-factory-day" },
  { date: "2026-11-04", time: "21:00", slug: "victorian-penny-sit-up-coffin-beds" },
  { date: "2026-11-05", time: "12:00", slug: "wwii-ration-day" },
  { date: "2026-11-05", time: "18:30", slug: "wwii-anderson-shelter-backyard" },
  { date: "2026-11-05", time: "21:00", slug: "wwii-blackout-night" },
  { date: "2026-11-06", time: "12:00", slug: "wwii-deception-ghost-army" },
  { date: "2026-11-06", time: "18:30", slug: "wwii-night-fighter-carrots-myth" },
  { date: "2026-11-06", time: "21:00", slug: "ottoman-hamam-bathhouse" },
  { date: "2026-11-07", time: "12:00", slug: "ottoman-imperial-hareem-politics" },
  { date: "2026-11-07", time: "18:30", slug: "ottoman-janissary-life" },
  { date: "2026-11-07", time: "21:00", slug: "ottoman-siege-cannon-dardanelles" }
];

const copyData = [];

for (const item of schedule) {
  const scriptPath = `scripts-out/${item.slug}.json`;
  let script = null;
  if (fs.existsSync(scriptPath)) {
    script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
  }

  copyData.push({
    ...item,
    script
  });
}

console.log(`Loaded script data for ${copyData.length} items.`);

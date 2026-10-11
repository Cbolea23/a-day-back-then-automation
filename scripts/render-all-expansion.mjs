#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultDir = path.join(root, "out", "2 - Unpublished Vault");
fs.mkdirSync(vaultDir, { recursive: true });

export const ALL_EXPANSION_SLUGS = [
  // 1. WWII & 20th Century (13)
  "wwii-blackout-night",
  "wwii-spitfire-pilot-day",
  "wwii-victory-garden",
  "wwii-gas-mask-box-kids",
  "wwii-anderson-shelter-backyard",
  "wwii-unexploded-bomb-defusers",
  "wwii-deception-ghost-army",
  "wwii-pigeon-spies-dickin-medal",
  "wwii-women-land-army",
  "wwii-fake-coffee-and-mock-banana",
  "wwii-morse-code-bletchley-park",
  "wwii-night-fighter-carrots-myth",
  "wwii-underground-tube-sleepers",

  // 2. Age of Sail & Pirates (12)
  "pirate-punishments-code",
  "pirate-diet-and-scurvy",
  "pirate-blackbeard-fuse-beard",
  "pirate-democracy-articles",
  "pirate-women-anne-bonny",
  "pirate-grog-and-rum",
  "pirate-jolly-roger-flags",
  "pirate-ship-surgeon-saw",
  "pirate-eyepatch-night-vision",
  "pirate-hidden-treasure-myth",
  "pirate-port-royal-sunk",
  "pirate-cannon-battle-smoke",

  // 3. Victorian & 19th Century (11)
  "victorian-mudlark-job",
  "victorian-arsenic-green-wallpaper",
  "victorian-phossy-jaw-matchgirls",
  "victorian-body-snatchers",
  "victorian-post-mortem-photos",
  "victorian-penny-sit-up-coffin-beds",
  "victorian-sewer-hunters-toshers",
  "victorian-corset-fainting",
  "victorian-pea-souper-smog",
  "gold-rush-claim-jumping",
  "victorian-penny-blood",

  // 4. Ottoman Empire (13)
  "ottoman-janissary-life",
  "ottoman-grand-bazaar-trade",
  "ottoman-coffeehouse-bans",
  "ottoman-hamam-bathhouse",
  "ottoman-topkapi-palace-kitchen",
  "ottoman-silent-language-court",
  "ottoman-tulip-mania-istanbul",
  "ottoman-spahi-cavalry",
  "ottoman-siege-cannon-dardanelles",
  "ottoman-mehter-military-band",
  "ottoman-imperial-hareem-politics",
  "ottoman-sherbet-snow-drinks",
  "ottoman-archery-world-record",

  // 5. Mesoamerica (10)
  "aztec-chocolate-currency",
  "aztec-macuahuitl-sword",
  "maya-astronomy-calendar",
  "inca-quipu-knot-language",
  "maya-rubber-ball-game",
  "aztec-cleanliness-vs-europe",
  "inca-rope-bridges-chasm",
  "aztec-eagle-and-jaguar-knights",
  "maya-blue-miracle-pigment",
  "inca-freeze-dried-potatoes",

  // 6. Feudal East Asia & Shinobi (8)
  "samurai-bushido-dark-truth",
  "ninja-poison-and-disguises",
  "mongol-bow-deadly-range",
  "han-dynasty-crossbow-trigger",
  "edo-firefighter-heroes",
  "mongol-yam-postal-system",
  "samurai-armor-lacquer-secret",
  "ninja-night-signals",

  // 7. Vikings & Norse (9)
  "viking-berserker-rage",
  "viking-hygiene-secrets",
  "viking-sunstone-navigation",
  "viking-longhouse-winter-smoke",
  "viking-blood-eagle-myth",
  "viking-shieldmaidens-real",
  "viking-valhalla-diet",
  "viking-funeral-ship",
  "viking-runestones-graffiti",

  // 8. Ancient Rome (2)
  "gladiator-diet-barley-men",
  "roman-firefighters-vigiles",

  // 9. Ancient Egypt & Mesopotamia (6)
  "egyptian-tomb-robber-trial",
  "egyptian-crocodile-god-sobek",
  "mesopotamia-beer-currency",
  "egyptian-cat-worship-laws",
  "egyptian-magic-and-scorpions",
  "pharaoh-cleopatra-daily-routine",

  // 10. Ancient Greece & Sparta (8)
  "spartan-black-broth",
  "greek-ostracism-voting",
  "greek-philosopher-insults",
  "spartan-women-freedom",
  "greek-trireme-rowers",
  "ancient-oracle-of-delphi",
  "spartan-stealing-trial",
  "greek-theatre-heckling"
];

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  console.log(`Starting Master Render pipeline for all ${ALL_EXPANSION_SLUGS.length} Expansion Shorts...`);
  const res = spawnSync(
    "node",
    ["scripts/render-vault.mjs", ...ALL_EXPANSION_SLUGS],
    { cwd: root, stdio: "inherit", shell: process.platform === "win32" }
  );
  process.exit(res.status || 0);
}

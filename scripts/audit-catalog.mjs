import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CIVS = {
  "Ancient Rome": [
    "gladiator-day", "roman-baths-day", "roman-doctor-job", "roman-garum",
    "roman-legionary-march", "roman-money", "roman-morning", "roman-myths",
    "roman-patrician-vs-plebeian", "roman-school-day", "roman-street-food",
    "roman-toilets", "gladiator-diet-barley-men", "roman-firefighters-vigiles"
  ],
  "Ancient Egypt & Mesopotamia": [
    "egypt-bread-and-beer", "egypt-embalmer-job", "egypt-eye-makeup", "egypt-myths",
    "egypt-pharaoh-day", "egypt-pyramid-workers", "egypt-scribe-vs-farmer",
    "mesopotamia-scribe-school", "egyptian-tomb-robber-trial", "egyptian-crocodile-god-sobek",
    "mesopotamia-beer-currency", "egyptian-cat-worship-laws", "egyptian-magic-and-scorpions",
    "pharaoh-cleopatra-daily-routine"
  ],
  "Ancient Greece & Sparta": [
    "ancient-olympics-athlete", "athens-citizen-day", "greek-symposium", "sparta-myths",
    "spartan-training-day", "greek-trireme-rowers", "spartan-black-broth",
    "greek-ostracism-voting", "greek-philosopher-insults", "spartan-women-freedom",
    "ancient-oracle-of-delphi", "spartan-stealing-trial", "greek-theatre-heckling", "byzantine-chariot-fan"
  ],
  "Vikings & Norse": [
    "viking-farmer-day", "viking-food-and-drink", "viking-myths", "viking-ocean-voyage",
    "viking-winter", "viking-berserker-rage", "viking-hygiene-secrets", "viking-sunstone-navigation",
    "viking-longhouse-winter-smoke", "viking-blood-eagle-myth", "viking-shieldmaidens-real",
    "viking-valhalla-diet", "viking-funeral-ship", "viking-runestones-graffiti"
  ],
  "Feudal East Asia & Shinobi": [
    "edo-merchant-vs-samurai", "han-china-farmer-day", "mongol-steppe-day", "ninja-myths",
    "samurai-day", "silk-road-merchant", "samurai-bushido-dark-truth", "ninja-poison-and-disguises",
    "mongol-bow-deadly-range", "han-dynasty-crossbow-trigger", "edo-firefighter-heroes",
    "mongol-yam-postal-system", "samurai-armor-lacquer-secret", "ninja-night-signals"
  ],
  "Mesoamerica": [
    "aztec-market-day", "chinampa-farmer-day", "inca-runner-job", "maya-scribe-job",
    "aztec-chocolate-currency", "aztec-macuahuitl-sword", "maya-astronomy-calendar",
    "inca-quipu-knot-language", "maya-rubber-ball-game", "aztec-cleanliness-vs-europe",
    "inca-rope-bridges-chasm", "aztec-eagle-and-jaguar-knights", "maya-blue-miracle-pigment",
    "inca-freeze-dried-potatoes"
  ],
  "Age of Sail & Pirates": [
    "pirate-myths", "pirate-ship-day", "pirate-punishments-code", "pirate-diet-and-scurvy",
    "pirate-blackbeard-fuse-beard", "pirate-democracy-articles", "pirate-women-anne-bonny",
    "pirate-grog-and-rum", "pirate-jolly-roger-flags", "pirate-ship-surgeon-saw",
    "pirate-eyepatch-night-vision", "pirate-hidden-treasure-myth", "pirate-port-royal-sunk",
    "pirate-cannon-battle-smoke"
  ],
  "Victorian & 19th Century": [
    "gold-rush-miner-day", "victorian-chimney-sweep-job", "victorian-factory-day",
    "victorian-mudlark-job", "victorian-arsenic-green-wallpaper", "victorian-phossy-jaw-matchgirls",
    "victorian-body-snatchers", "victorian-post-mortem-photos", "victorian-penny-sit-up-coffin-beds",
    "victorian-sewer-hunters-toshers", "victorian-corset-fainting", "victorian-pea-souper-smog",
    "gold-rush-claim-jumping", "victorian-penny-blood"
  ],
  "Ottoman Empire": [
    "ottoman-coffeehouse", "ottoman-janissary-life", "ottoman-grand-bazaar-trade",
    "ottoman-coffeehouse-bans", "ottoman-hamam-bathhouse", "ottoman-topkapi-palace-kitchen",
    "ottoman-silent-language-court", "ottoman-tulip-mania-istanbul", "ottoman-spahi-cavalry",
    "ottoman-siege-cannon-dardanelles", "ottoman-mehter-military-band",
    "ottoman-imperial-hareem-politics", "ottoman-sherbet-snow-drinks", "ottoman-archery-world-record"
  ],
  "WWII & 20th Century": [
    "wwii-ration-day", "wwii-blackout-night", "wwii-spitfire-pilot-day", "wwii-victory-garden",
    "wwii-gas-mask-box-kids", "wwii-anderson-shelter-backyard", "wwii-unexploded-bomb-defusers",
    "wwii-deception-ghost-army", "wwii-pigeon-spies-dickin-medal", "wwii-women-land-army",
    "wwii-fake-coffee-and-mock-banana", "wwii-morse-code-bletchley-park",
    "wwii-night-fighter-carrots-myth", "wwii-underground-tube-sleepers"
  ]
};

const yt = JSON.parse(fs.readFileSync(path.join(root, "published-urls.json"), "utf8"));
const fb = JSON.parse(fs.readFileSync(path.join(root, "published-urls-facebook.json"), "utf8"));
const pubDir = path.join(root, "out", "1 - Published");
const vaultDir = path.join(root, "out", "2 - Unpublished Vault");

console.log("\n================================================================================");
console.log("               CIVILIZATION CATALOG COMPLETE AUDIT REPORT");
console.log("================================================================================\n");

let totalRendered = 0;
let totalYT = 0;
let totalFB = 0;

for (const [civ, slugs] of Object.entries(CIVS)) {
  let renderedCount = 0;
  let ytCount = 0;
  let fbCount = 0;
  for (const s of slugs) {
    const isRendered = (fs.existsSync(path.join(pubDir, `${s}.mp4`)) && fs.statSync(path.join(pubDir, `${s}.mp4`)).size > 500000) ||
                       (fs.existsSync(path.join(vaultDir, `${s}.mp4`)) && fs.statSync(path.join(vaultDir, `${s}.mp4`)).size > 500000);
    if (isRendered) renderedCount++;
    if (yt[s]) ytCount++;
    if (fb[s]) fbCount++;
  }
  totalRendered += renderedCount;
  totalYT += ytCount;
  totalFB += fbCount;
  console.log(`${civ.padEnd(28)}: ${String(renderedCount).padStart(2)}/14 Rendered | ${String(ytCount).padStart(2)}/14 YouTube | ${String(fbCount).padStart(2)}/14 Facebook`);
}

console.log("\n--------------------------------------------------------------------------------");
console.log(`TOTAL CATALOG (10 Civilizations): ${String(totalRendered).padStart(3)}/140 Rendered | ${String(totalYT).padStart(3)}/140 YouTube | ${String(totalFB).padStart(3)}/140 Facebook`);
console.log("================================================================================\n");

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SLUGS = [
  // Mesoamerica (10)
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

  // Feudal East Asia & Shinobi (8)
  "samurai-bushido-dark-truth",
  "ninja-poison-and-disguises",
  "mongol-bow-deadly-range",
  "han-dynasty-crossbow-trigger",
  "edo-firefighter-heroes",
  "mongol-yam-postal-system",
  "samurai-armor-lacquer-secret",
  "ninja-night-signals",

  // Vikings & Norse (9)
  "viking-berserker-rage",
  "viking-hygiene-secrets",
  "viking-sunstone-navigation",
  "viking-longhouse-winter-smoke",
  "viking-blood-eagle-myth",
  "viking-shieldmaidens-real",
  "viking-valhalla-diet",
  "viking-funeral-ship",
  "viking-runestones-graffiti",

  // Ancient Rome (2)
  "gladiator-diet-barley-men",
  "roman-firefighters-vigiles",

  // Ancient Egypt & Mesopotamia (6)
  "egyptian-tomb-robber-trial",
  "egyptian-crocodile-god-sobek",
  "mesopotamia-beer-currency",
  "egyptian-cat-worship-laws",
  "egyptian-magic-and-scorpions",
  "pharaoh-cleopatra-daily-routine",

  // Ancient Greece & Sparta (8)
  "spartan-black-broth",
  "greek-ostracism-voting",
  "greek-philosopher-insults",
  "spartan-women-freedom",
  "greek-trireme-rowers",
  "ancient-oracle-of-delphi",
  "spartan-stealing-trial",
  "greek-theatre-heckling"
];

console.log(`Starting voice synthesis for remaining ${SLUGS.length} expansion topics...`);

const res = spawnSync(
  "node",
  ["scripts/make-voice.mjs", ...SLUGS],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, VOICE_PROVIDER: "edge" }
  }
);

if (res.status === 0) {
  console.log("\nSuccessfully generated all voiceovers for Batch 2!");
} else {
  console.error("\nVoiceover batch exited with code:", res.status);
  process.exit(res.status || 1);
}

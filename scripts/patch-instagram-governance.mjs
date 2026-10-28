import fs from "node:fs";

let s = fs.readFileSync("scripts/upload-instagram.mjs", "utf8");

// Add import if missing
if (!s.includes("validateContentGovernance")) {
  s = s.replace(
    'import {fileURLToPath} from "node:url";',
    'import {fileURLToPath} from "node:url";\r\nimport {validateContentGovernance} from "./lib/language-governance.mjs";'
  );
}

// Strip emojis from IG_QUESTIONS
s = s.replace(/Would you have survived this\? Tell us why 👇/g, "Would you have survived this? Tell us why in the comments.");
s = s.replace(/Which fact shocked you the most\? 👇/g, "Which fact shocked you the most? Tell us below.");
s = s.replace(/Could you live like this for one day\? Be honest 👇/g, "Could you live like this for one day? Be honest.");
s = s.replace(/What era should we time-travel to next\? 👇/g, "What era should we time-travel to next?");
s = s.replace(/Did you know this before watching\? 👇/g, "Did you know this before watching?");
s = s.replace(/True or false: you could handle this life 👇/g, "True or false: you could handle this life.");

// Strip emojis from IG_CTAS
s = s.replace(/🔔 Follow @adaybackthenofficial — a new time trip every day!/g, "Follow @adaybackthenofficial for a new time trip every day!");
s = s.replace(/👉 Follow @adaybackthenofficial for your daily trip back in time!/g, "Follow @adaybackthenofficial for your daily trip back in time!");

// Strip 💬
s = s.replace(/`💬 \${question}`/g, "question");

// Add validation call
const target = "const caption = buildInstagramCaption(script, slug);";
const repl = "const caption = options.caption || buildInstagramCaption(script, slug);\r\n  validateContentGovernance(options.channel || \"adaybackthen\", caption, \"Instagram Reel caption\");";
if (!s.includes("validateContentGovernance(options.channel")) {
  s = s.replace(target, repl);
}

fs.writeFileSync("scripts/upload-instagram.mjs", s, "utf8");
console.log("Successfully patched scripts/upload-instagram.mjs with zero-emoji and language governance!");

import fs from "node:fs";

let s = fs.readFileSync("scripts/upload-facebook.mjs", "utf8");

if (!s.includes("validateContentGovernance")) {
  s = s.replace(
    'import {fileURLToPath} from "node:url";',
    'import {fileURLToPath} from "node:url";\r\nimport {validateContentGovernance} from "./lib/language-governance.mjs";'
  );

  const target = "const caption = options.caption || buildReelCaption(script, cleanSlug);";
  const repl = "const caption = options.caption || buildReelCaption(script, cleanSlug);\r\n  validateContentGovernance(options.channel || \"adaybackthen\", caption, \"Facebook Reel caption\");";
  s = s.replace(target, repl);

  fs.writeFileSync("scripts/upload-facebook.mjs", s, "utf8");
  console.log("Successfully patched upload-facebook.mjs with language governance!");
} else {
  console.log("Already patched.");
}

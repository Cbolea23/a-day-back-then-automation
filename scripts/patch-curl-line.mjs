import fs from "node:fs";

const content = fs.readFileSync("scripts/upload-instagram.mjs", "utf8");
const lines = content.split(/\r?\n/);

const idx = lines.findIndex(l => l.includes("const curlOut = execSync("));
if (idx !== -1) {
  lines.splice(idx, 1); // remove line 261
  fs.writeFileSync("scripts/upload-instagram.mjs", lines.join("\r\n"), "utf8");
  console.log(`Removed duplicate execSync at line ${idx}`);
} else {
  console.log("Line not found");
}

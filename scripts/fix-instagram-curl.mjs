import fs from "node:fs";

let s = fs.readFileSync("scripts/upload-instagram.mjs", "utf8");

s = s.replace(
  '`curl.exe -s -X POST "${uploadUri}"',
  'const curlCmd = process.platform === "win32" ? "curl.exe" : "curl";\r\n    const curlOut = execSync(`"${curlCmd}" -s -X POST "${uploadUri}"'
);

// In case the above replacement was too specific:
if (s.includes("curl.exe -s -X POST")) {
  s = s.replace('`curl.exe -s -X POST', 'const curlCmd = process.platform === "win32" ? "curl.exe" : "curl";\r\n    const curlOut = execSync(`${curlCmd} -s -X POST');
}

fs.writeFileSync("scripts/upload-instagram.mjs", s, "utf8");
console.log("Successfully made upload-instagram.mjs cross-platform (Windows & Linux compatible)!");

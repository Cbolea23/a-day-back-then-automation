import fs from "node:fs";

let s = fs.readFileSync("scripts/upload-instagram.mjs", "utf8");

const badBlock = `  try {
    const curlOut = execSync(
      const curlCmd = process.platform === "win32" ? "curl.exe" : "curl";
    const curlOut = execSync(\`"\${curlCmd}" -s -X POST "\${uploadUri}" -H "Authorization: OAuth \${pageAccessToken}" -H "offset: 0" -H "file_size: \${fileSize}" -H "Content-Type: application/octet-stream" --data-binary "@\${activeVideoPath}"\`,
      { encoding: "utf8" }
    );`;

const goodBlock = `  try {
    const curlCmd = process.platform === "win32" ? "curl.exe" : "curl";
    const curlOut = execSync(\`\${curlCmd} -s -X POST "\${uploadUri}" -H "Authorization: OAuth \${pageAccessToken}" -H "offset: 0" -H "file_size: \${fileSize}" -H "Content-Type: application/octet-stream" --data-binary "@\${activeVideoPath}"\`,
      { encoding: "utf8" }
    );`;

s = s.replace(badBlock, goodBlock);

fs.writeFileSync("scripts/upload-instagram.mjs", s, "utf8");
console.log("Fixed curlOut syntax block!");

import {chromium} from "playwright";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sessionDir = path.join(root, ".tiktok-session");

console.log("Launching interactive browser for TikTok authentication...");
console.log("Session will be saved to:", sessionDir);

const context = await chromium.launchPersistentContext(sessionDir, {
  headless: false,
  viewport: {width: 1280, height: 900},
  args: ["--disable-blink-features=AutomationControlled"]
});

const page = context.pages()[0] || (await context.newPage());
await page.goto("https://www.tiktok.com/login");

console.log("\n========================================================");
console.log("   TikTok Login Window Opened");
console.log("========================================================");
console.log("1. Please log in using the opened browser window.");
console.log("2. After you log in and see your account / feed,");
console.log("   close the browser window to finish setup.");
console.log("========================================================\n");

// Keep script running until user closes the browser window
await new Promise((resolve) => {
  context.on("close", resolve);
});

console.log("\n✓ Authentication complete! .tiktok-session has been saved.\n");

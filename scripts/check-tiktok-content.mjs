import { chromium } from "playwright";

async function main() {
  const context = await chromium.launchPersistentContext(".tiktok-session", { headless: true, viewport: { width: 1280, height: 900 } });
  const page = context.pages()[0] || (await context.newPage());
  await page.goto("https://www.tiktok.com/tiktokstudio/content", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: "out/tiktok-content-list.png" });
  console.log("Screenshot saved of TikTok content manager.");
  await context.close();
}

main().catch(console.error);

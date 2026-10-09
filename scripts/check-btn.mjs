import { chromium } from "playwright";
import path from "node:path";

async function main() {
  const context = await chromium.launchPersistentContext(".tiktok-session", { headless: true, viewport: { width: 1280, height: 1200 } });
  const page = context.pages()[0] || (await context.newPage());
  await page.goto("https://www.tiktok.com/tiktokstudio/upload?from=upload", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  
  const videoPath = path.resolve("out/sample-roman-morning.mp4");
  await page.locator('input[type="file"][accept*="video"]').setInputFiles(videoPath);
  console.log("File sent. Waiting 20s...");
  await page.waitForTimeout(20000);

  // Check the button element
  const btn = await page.$('button[data-e2e="post_video_button"]');
  if (btn) {
    const isEnabled = await btn.isEnabled();
    const isVisible = await btn.isVisible();
    const html = await btn.evaluate(el => el.outerHTML);
    console.log(`Post button isEnabled: ${isEnabled}, isVisible: ${isVisible}`);
    console.log(`HTML: ${html}`);
  } else {
    console.log("Button not found");
  }

  await page.screenshot({ path: "out/tiktok-check-btn.png" });
  await context.close();
}

main().catch(console.error);

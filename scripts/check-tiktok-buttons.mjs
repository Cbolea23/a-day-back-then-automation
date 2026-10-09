import { chromium } from "playwright";
import path from "node:path";

async function main() {
  const context = await chromium.launchPersistentContext(".tiktok-session", { headless: true, viewport: { width: 1280, height: 1200 } });
  const page = context.pages()[0] || (await context.newPage());
  await page.goto("https://www.tiktok.com/tiktokstudio/upload?from=upload", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);
  
  const videoPath = path.resolve("out/sample-roman-morning.mp4");
  await page.locator('input[type="file"][accept*="video"]').setInputFiles(videoPath);
  console.log("File uploaded, waiting 15s for editor to load...");
  await page.waitForTimeout(15000);

  // Dismiss modals
  for (const text of ["Turn on", "Got it", "Cancel", "Not now", "Close"]) {
    try {
      const btn = await page.$(`button:has-text("${text}")`);
      if (btn && (await btn.isVisible())) {
        await btn.click();
        console.log(`Dismissed modal with "${text}"`);
        await page.waitForTimeout(1000);
      }
    } catch (_) {}
  }

  const buttons = await page.$$("button");
  console.log("\nButtons in editor mode:", buttons.length);
  for (const b of buttons) {
    const text = (await b.innerText()).trim();
    if (text) {
      const dataE2E = await b.getAttribute("data-e2e");
      const cls = await b.getAttribute("class");
      console.log(`- Text: "${text}" | data-e2e: "${dataE2E}" | class: "${cls}"`);
    }
  }

  await page.screenshot({ path: "out/tiktok-editor-buttons.png" });
  console.log("Screenshot saved to out/tiktok-editor-buttons.png");
  await context.close();
}

main().catch(console.error);

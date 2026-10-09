import { chromium } from "playwright";

async function main() {
  const context = await chromium.launchPersistentContext(".tiktok-session", { headless: true });
  const page = context.pages()[0] || (await context.newPage());
  console.log("Navigating...");
  await page.goto("https://www.tiktok.com/creator-center/upload?from=upload", { waitUntil: "domcontentloaded", timeout: 30000 });
  console.log("DOM loaded. Current URL:", page.url());
  await page.waitForTimeout(6000);
  console.log("After 6s wait, URL:", page.url());
  const frames = page.frames();
  console.log("Frames count:", frames.length);
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    console.log(`Frame ${i} URL: ${f.url()}`);
    const inputs = await f.$$("input");
    console.log(`  inputs count: ${inputs.length}`);
    for (const inp of inputs) {
      const type = await inp.getAttribute("type");
      const accept = await inp.getAttribute("accept");
      console.log(`    input type=${type} accept=${accept}`);
    }
  }
  await page.screenshot({ path: "out/tiktok-debug.png" });
  console.log("Screenshot saved.");
  await context.close();
}

main().catch(console.error);

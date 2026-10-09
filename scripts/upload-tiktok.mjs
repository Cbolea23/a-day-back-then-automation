#!/usr/bin/env node
/**
 * Automated TikTok Uploader using Playwright & Saved Session
 *
 * Usage:
 *   node scripts/upload-tiktok.mjs roman-toilets
 *   node scripts/upload-tiktok.mjs sample-roman-morning
 */

import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {chromium} from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sessionDir = path.join(root, ".tiktok-session");

export function buildTikTokCaption(script, slug) {
  const hook = script.hook || script.title || "Did you know?";
  const tags = ["#history", "#historytok", "#ancienthistory", "#learnontiktok", "#ADayBackThen"];

  if (slug.includes("roman")) tags.push("#ancientrome", "#rome");
  if (slug.includes("gladiator")) tags.push("#gladiator", "#colosseum");
  if (slug.includes("peasant") || slug.includes("medieval")) tags.push("#medieval", "#middleages");
  if (slug.includes("viking")) tags.push("#vikings");

  const shortHook = hook.length > 70 ? `${hook.slice(0, 67)}...` : hook;
  return `${shortHook} ${Array.from(new Set(tags)).join(" ")}`;
}

export async function uploadVideo(slug) {
  const candidatePaths = [
    path.join(root, "out", `${slug}.mp4`),
    path.join(root, "out", "1 - Published", `${slug}.mp4`),
    path.join(root, "out", "2 - Unpublished Vault", `${slug}.mp4`),
    path.join(root, "out", "Published", `${slug}.mp4`),
    path.join(root, "out", "Unpublished Vault", `${slug}.mp4`),
  ];
  const videoPath = candidatePaths.find((p) => fs.existsSync(p));
  if (!videoPath) {
    throw new Error(`Video file for ${slug} not found in out/ or subfolders. Please render it first.`);
  }

  if (!fs.existsSync(sessionDir)) {
    throw new Error("Missing .tiktok-session. Please run 'npm run upload:tiktok -- --auth' first.");
  }

  let script = {title: slug};
  const scriptPath = path.join(root, "scripts-out", `${slug}.json`);
  if (fs.existsSync(scriptPath)) {
    script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
  }

  const caption = buildTikTokCaption(script, slug);

  console.log("\n========================================================");
  console.log(`   Uploading to TikTok: ${slug}`);
  console.log("========================================================");
  console.log(`File:        ${videoPath}`);
  console.log(`Caption:     ${caption}`);
  console.log("--------------------------------------------------------");

  console.log("1. Launching browser with saved session...");
  const context = await chromium.launchPersistentContext(sessionDir, {
    headless: true,
    viewport: {width: 1280, height: 900},
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = context.pages()[0] || (await context.newPage());

  try {
    console.log("2. Navigating to TikTok Studio...");
    await page.goto("https://www.tiktok.com/tiktokstudio/upload?from=upload", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait for the file input
    console.log("3. Uploading video file...");
    await page.locator('input[type="file"][accept*="video"]').setInputFiles(videoPath);
    console.log("✓ File submitted. Waiting for TikTok to process video...");

    // Helper to dismiss only overlay popups (NOT main page buttons!)
    async function dismissModals() {
      // If "Sure you want to cancel your upload?" appears, always click "No"
      try {
        const noBtn = await page.$('button:has-text("No")');
        if (noBtn && (await noBtn.isVisible())) {
          await noBtn.click();
          await page.waitForTimeout(500);
        }
      } catch (_) {}

      const candidates = ["Got it", "Not now", "Close"];
      for (const text of candidates) {
        try {
          const btn = await page.$(`div[role="dialog"] button:has-text("${text}")`);
          if (btn && (await btn.isVisible())) {
            await btn.click({ timeout: 1500 });
            await page.waitForTimeout(500);
          }
        } catch (_) {}
      }
    }

    await page.waitForTimeout(4000);
    await dismissModals();

    // 4. Wait for upload progress to reach 100%
    console.log("Waiting for video bytes to finish uploading (100%)...");
    for (let i = 0; i < 90; i++) {
      await page.waitForTimeout(2000);
      await dismissModals();

      const isReady = await page.evaluate(() => {
        const btn = document.querySelector('button[data-e2e="post_video_button"]');
        if (!btn) return false;
        const disabled = btn.disabled || btn.getAttribute("aria-disabled") === "true" || btn.classList.contains("disabled");
        // Also check if percentage bar is still running (e.g. "99%")
        const textContent = document.body.innerText || "";
        const stillUploading = /\b(uploading|\d+%)\b/i.test(textContent) && !textContent.includes("100%");
        return !disabled && !stillUploading;
      });

      const uploadedBadge = await page.$('text="Uploaded"');
      if (isReady || uploadedBadge) {
        console.log("✓ Video successfully uploaded to TikTok servers!");
        break;
      }
    }

    // 5. Set caption & hashtags after upload settles
    console.log("4. Setting caption & hashtags...");
    const editor = await page.waitForSelector(
      'div[contenteditable="true"], .public-DraftEditor-content, div[data-placeholder*="caption"], div[class*="editor"]',
      {timeout: 30000}
    );

    if (editor) {
      await dismissModals();
      await editor.click({ force: true });
      await page.waitForTimeout(500);
      await page.keyboard.press("Control+A");
      await page.keyboard.press("Backspace");
      await page.waitForTimeout(300);
      await page.keyboard.type(caption, {delay: 15});
      console.log("✓ Caption set.");
    }

    await dismissModals();
    await page.waitForTimeout(2000);

    // 6. Disclose AI-generated content (per official TikTok guidelines to prevent throttling)
    try {
      console.log("Checking AI-generated content disclosure setting...");
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
        const container = document.querySelector('div[class*="content"], div[class*="form"], main');
        if (container) container.scrollTop = container.scrollHeight;
      });
      await page.waitForTimeout(1000);

      const disclosureBtn = await page.$(
        'text="Content disclosure", text="Disclose video content", text="Disclose content", div:has-text("Content disclosure") [role="switch"]'
      );
      if (disclosureBtn) {
        await disclosureBtn.scrollIntoViewIfNeeded().catch(() => {});
        await disclosureBtn.click().catch(() => {});
        await page.waitForTimeout(800);
      }

      const seeMore = await page.$('text="See more", button:has-text("See more"), span:has-text("See more")');
      if (seeMore && (await seeMore.isVisible())) {
        await seeMore.click();
        await page.waitForTimeout(1000);
      }

      const aiSwitch = await page.$(
        'div:has-text("AI-generated content") [role="switch"], div:has-text("AI-generated content") input[type="checkbox"], label:has-text("AI-generated content")'
      );
      if (aiSwitch) {
        await aiSwitch.scrollIntoViewIfNeeded().catch(() => {});
        const isChecked = await aiSwitch.getAttribute("aria-checked").catch(() => null);
        if (isChecked !== "true") {
          await aiSwitch.click();
          await page.waitForTimeout(1000);
          const confirmBtn = await page.$(
            'div[role="dialog"] button:has-text("Turn on"), div[role="dialog"] button:has-text("Confirm"), button:has-text("Turn on"), button:has-text("Understood")'
          );
          if (confirmBtn && (await confirmBtn.isVisible())) {
            await confirmBtn.click();
            await page.waitForTimeout(800);
          }
          console.log("✓ Creator AI-generated content disclosure enabled.");
        }
      }
    } catch (_) {}

    await dismissModals();
    await page.waitForTimeout(2000);

    // 7. Click Post button
    console.log("5. Submitting post to TikTok...");
    await dismissModals();

    const clicked = await page.evaluate(() => {
      const btn = document.querySelector('button[data-e2e="post_video_button"]');
      if (btn && !btn.disabled) {
        btn.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log("✓ Clicked Post button. Checking for confirmation dialog...");
      await page.waitForTimeout(2500);

      // Handle "Post now" popup if video check is still processing
      try {
        const postNowBtn = await page.$('button:has-text("Post now")');
        if (postNowBtn && (await postNowBtn.isVisible())) {
          console.log("✓ Clicking 'Post now' on confirmation dialog...");
          await postNowBtn.click();
        }
      } catch (_) {}

      console.log("Waiting for publication confirmation...");
      try {
        await page.waitForSelector(
          'text="Manage your posts", text="Upload another video", text="Your video has been published", a:has-text("Manage your posts")',
          {timeout: 45000}
        );
        console.log("✓ Publication confirmed by TikTok Studio!");
      } catch (_) {
        await page.waitForTimeout(10000);
      }
    } else {
      console.warn("⚠️ Post button not clickable or still disabled.");
    }

    try {
      const shotDir = path.join(root, "out", "3 - Screenshots");
      fs.mkdirSync(shotDir, {recursive: true});
      await page.screenshot({path: path.join(shotDir, `tiktok-result-${slug}.png`)});
    } catch (_) {}

    console.log("\n========================================================");
    console.log(`   TikTok Upload Completed for ${slug}! 🎉`);
    console.log("========================================================\n");
  } catch (err) {
    console.error("TikTok upload notice:", err.message);
  } finally {
    await page.waitForTimeout(3000);
    await context.close();
  }
}

// CLI Execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const slug = args[0] || "sample-roman-morning";
  uploadVideo(slug).catch((err) => {
    console.error("\n❌ Upload failed:", err.message);
    process.exit(1);
  });
}

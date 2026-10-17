import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });

  const bgPath = "C:/Users/Christian/.gemini/antigravity/brain/3a239396-a788-487e-be6a-6c499b8a06c4/precolonial_philippines_village_1791954358332.jpg";
  const bgBase64 = fs.readFileSync(bgPath).toString("base64");

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: 1080px;
        height: 1920px;
        position: relative;
        overflow: hidden;
        background-color: #0c0a09;
        font-family: 'Montserrat', Impact, sans-serif;
      }
      .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(0.92) contrast(1.1) saturate(1.1);
      }
      .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 50% 40%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.85) 100%);
      }
      .top-box {
        position: absolute;
        top: 140px;
        left: 50%;
        transform: translateX(-50%);
        width: 960px;
        background: rgba(12, 10, 9, 0.88);
        border: 6px solid #fbbf24;
        border-radius: 28px;
        padding: 32px 36px;
        text-align: center;
        box-shadow: 0 20px 45px rgba(0,0,0,0.85);
      }
      .top-title {
        color: #ffffff;
        font-size: 52px;
        font-weight: 900;
        line-height: 1.25;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .highlight {
        color: #ffde00;
      }

      .char-svg {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 120px;
        width: 720px;
        height: 1100px;
        filter: drop-shadow(0 25px 45px rgba(0,0,0,0.95));
      }

      .bottom-badge {
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: #1c1917;
        border: 4px solid #facc15;
        border-radius: 14px;
        padding: 12px 38px;
        color: #f8fafc;
        font-size: 26px;
        font-weight: 800;
        letter-spacing: 4px;
        text-transform: uppercase;
        box-shadow: 0 10px 25px rgba(0,0,0,0.85);
      }
    </style>
  </head>
  <body>
    <img class="bg" src="data:image/jpeg;base64,${bgBase64}" />
    <div class="vignette"></div>

    <!-- Question Hook Top Banner -->
    <div class="top-box">
      <div class="top-title">
        DO YOU GUYS WANT <br/>
        <span class="highlight">ANCIENT FILIPINO</span> THEME CONTENT?
      </div>
    </div>

    <!-- Character in Pre-Colonial Filipino / Maharlika / Pintados Attire -->
    <svg class="char-svg" viewBox="0 0 300 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- LEGS -->
      <line x1="125" y1="400" x2="125" y2="475" stroke="#111" stroke-width="13" stroke-linecap="round" />
      <line x1="175" y1="400" x2="175" y2="475" stroke="#111" stroke-width="13" stroke-linecap="round" />
      <!-- Bare feet with traditional ankle gold cord -->
      <circle cx="125" cy="460" r="7" fill="none" stroke="#f59e0b" stroke-width="4" />
      <circle cx="175" cy="460" r="7" fill="none" stroke="#f59e0b" stroke-width="4" />
      <ellipse cx="120" cy="478" rx="16" ry="7" fill="#dfaa6b" stroke="#111" stroke-width="3" />
      <ellipse cx="180" cy="478" rx="16" ry="7" fill="#dfaa6b" stroke="#111" stroke-width="3" />

      <!-- Filipino Red Bahag / Wrap Skirt with Gold Patterned Border -->
      <path d="M86 215 Q150 195 214 215 L228 410 Q150 430 72 410 Z" fill="#b91c1c" stroke="#111" stroke-width="7" stroke-linejoin="round" />
      <path d="M72 400 Q150 422 228 400" stroke="#f59e0b" stroke-width="10" fill="none" />
      
      <!-- Pre-colonial Pintados Geometric Tattoos on Tunic/Skin -->
      <path d="M110 240 L130 260 L110 280 L90 260 Z" fill="none" stroke="#7f1d1d" stroke-width="3.5" />
      <path d="M190 240 L210 260 L190 280 L170 260 Z" fill="none" stroke="#7f1d1d" stroke-width="3.5" />
      <path d="M150 250 L165 270 L150 290 L135 270 Z" fill="none" stroke="#f59e0b" stroke-width="3" />

      <!-- Pre-Colonial Gold Chest Medallion & Choker (Kamagi) -->
      <path d="M115 178 Q150 220 185 178" stroke="#f59e0b" stroke-width="7" fill="none" />
      <circle cx="150" cy="205" r="9" fill="#facc15" stroke="#111" stroke-width="2.5" />
      <circle cx="150" cy="205" r="4.5" fill="#dc2626" />

      <!-- Traditional Kalasag / Kris / Arms -->
      <!-- Left Arm (Waving to audience) -->
      <path d="M96 185 L55 130 L45 80" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <circle cx="45" cy="80" r="12" fill="#dfaa6b" stroke="#111" stroke-width="4" />
      <!-- Gold bracelet on wrist -->
      <circle cx="49" cy="98" r="8" fill="none" stroke="#f59e0b" stroke-width="4" />

      <!-- Right Arm (Resting on hip, pointing) -->
      <path d="M204 185 L245 250 L235 295" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <circle cx="235" cy="295" r="12" fill="#dfaa6b" stroke="#111" stroke-width="4" />
      <circle cx="238" cy="280" r="8" fill="none" stroke="#f59e0b" stroke-width="4" />

      <!-- HEAD (Golden Tan Skin) -->
      <g>
        <circle cx="150" cy="92" r="64" fill="#dfaa6b" stroke="#111" stroke-width="6" />

        <!-- Traditional Filipino Red & Gold Putong (Headcloth) -->
        <path d="M84 76 Q150 38 216 76 L220 54 Q150 18 80 54 Z" fill="#b91c1c" stroke="#111" stroke-width="5" />
        <line x1="84" y1="65" x2="216" y2="65" stroke="#f59e0b" stroke-width="5" />
        <!-- Top knot cloth crest of the Putong -->
        <path d="M136 40 Q150 -5 164 40 Z" fill="#b91c1c" stroke="#111" stroke-width="4" />
        <path d="M142 32 Q150 8 158 32 Z" fill="#f59e0b" stroke="#111" stroke-width="2" />
        <!-- Gold center forehead ornament -->
        <circle cx="150" cy="52" r="8" fill="#facc15" stroke="#111" stroke-width="2.5" />

        <!-- Gold D-shaped earrings (Panika) in ears -->
        <ellipse cx="82" cy="102" rx="7" ry="10" fill="#facc15" stroke="#111" stroke-width="2.5" />
        <ellipse cx="218" cy="102" rx="7" ry="10" fill="#facc15" stroke="#111" stroke-width="2.5" />

        <!-- Friendly, smiling, curious face expression -->
        <!-- Eyebrows raised with excitement -->
        <path d="M116 66 Q128 58 138 64" stroke="#111" stroke-width="5.5" stroke-linecap="round" fill="none" />
        <path d="M184 66 Q172 58 162 64" stroke="#111" stroke-width="5.5" stroke-linecap="round" fill="none" />

        <!-- Big round curious eyes -->
        <ellipse cx="128" cy="90" rx="10" ry="12" fill="#ffffff" stroke="#111" stroke-width="3" />
        <circle cx="128" cy="90" r="4.5" fill="#111" />
        <ellipse cx="172" cy="90" rx="10" ry="12" fill="#ffffff" stroke="#111" stroke-width="3" />
        <circle cx="172" cy="90" r="4.5" fill="#111" />

        <!-- Big happy smile -->
        <path d="M132 118 Q150 142 168 118" stroke="#111" stroke-width="6" stroke-linecap="round" fill="#b91c1c" />
      </g>
    </svg>

    <div class="bottom-badge">A DAY BACK THEN</div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle" });
  const outPath = path.resolve("out/philippines-community-poll.jpg");
  await page.screenshot({ path: outPath, quality: 96 });
  console.log("✓ Rendered community poll image to:", outPath);
  await browser.close();
}

main().catch(console.error);

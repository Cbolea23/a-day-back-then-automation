import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  // Use background scene 12 (Roman shields along stone wall)
  const bgPath = path.resolve("long_backup/roman-legionary-career/12.png");
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
        width: 1920px;
        height: 1080px;
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
        filter: brightness(0.85) contrast(1.15) saturate(1.1);
      }
      .vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 75% 50%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.9) 100%);
      }
      .char-svg {
        position: absolute;
        left: 100px;
        bottom: 20px;
        width: 580px;
        height: 980px;
        filter: drop-shadow(0 25px 45px rgba(0,0,0,0.95));
      }
      .text-box {
        position: absolute;
        right: 90px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        text-align: right;
        gap: 0px;
      }
      .headline {
        font-family: 'Montserrat', Impact, sans-serif;
        font-weight: 900;
        font-size: 165px;
        line-height: 0.95;
        text-transform: uppercase;
        color: #ffde00;
        -webkit-text-stroke: 28px #1c1917;
        paint-order: stroke fill;
        letter-spacing: -2px;
        filter: drop-shadow(14px 18px 0px #000000);
      }
      .subline {
        font-family: 'Montserrat', Impact, sans-serif;
        font-weight: 900;
        font-size: 165px;
        line-height: 0.95;
        text-transform: uppercase;
        color: #ffde00;
        -webkit-text-stroke: 28px #1c1917;
        paint-order: stroke fill;
        letter-spacing: -2px;
        filter: drop-shadow(14px 18px 0px #000000);
      }
      .badge {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: #1c1917;
        border: 4px solid #facc15;
        border-radius: 12px;
        padding: 10px 32px;
        color: #f8fafc;
        font-size: 26px;
        font-weight: 800;
        letter-spacing: 4px;
        text-transform: uppercase;
        box-shadow: 0 10px 25px rgba(0,0,0,0.8);
      }
    </style>
  </head>
  <body>
    <img class="bg" src="data:image/png;base64,${bgBase64}" />
    <div class="vignette"></div>

    <!-- Official Narrator in Roman Legionary / Centurion armor holding heavy pilum -->
    <svg class="char-svg" viewBox="0 0 300 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- LEGS -->
      <line x1="125" y1="400" x2="125" y2="475" stroke="#111" stroke-width="12" stroke-linecap="round" />
      <line x1="175" y1="400" x2="175" y2="475" stroke="#111" stroke-width="12" stroke-linecap="round" />
      <!-- Roman Caligae Sandals -->
      <rect x="105" y="470" width="36" height="14" rx="3" fill="#6e3d1b" stroke="#111" stroke-width="3" />
      <rect x="159" y="470" width="36" height="14" rx="3" fill="#6e3d1b" stroke="#111" stroke-width="3" />

      <!-- Red Legionary Under-Tunic -->
      <path d="M84 175 Q150 155 216 175 L232 410 Q150 430 68 410 Z" fill="#991b1b" stroke="#111" stroke-width="6" stroke-linejoin="round" />
      
      <!-- Lorica Segmentata (Iron Bands) -->
      <path d="M90 178 Q150 160 210 178 L218 335 Q150 345 82 335 Z" fill="#94a3b8" stroke="#111" stroke-width="6" stroke-linejoin="round" />
      <path d="M86 215 Q150 225 214 215" stroke="#111" stroke-width="5" fill="none" />
      <path d="M84 250 Q150 260 216 250" stroke="#111" stroke-width="5" fill="none" />
      <path d="M83 285 Q150 295 217 285" stroke="#111" stroke-width="5" fill="none" />
      <path d="M82 318 Q150 328 218 318" stroke="#111" stroke-width="5" fill="none" />

      <!-- Leather Belt (Balteus) with Brass Studs -->
      <rect x="80" y="332" width="140" height="20" rx="4" fill="#6e3d1b" stroke="#111" stroke-width="4" />
      <circle cx="100" cy="342" r="4.5" fill="#d4af37" stroke="#111" stroke-width="2" />
      <circle cx="125" cy="342" r="4.5" fill="#d4af37" stroke="#111" stroke-width="2" />
      <circle cx="150" cy="342" r="4.5" fill="#d4af37" stroke="#111" stroke-width="2" />
      <circle cx="175" cy="342" r="4.5" fill="#d4af37" stroke="#111" stroke-width="2" />
      <circle cx="200" cy="342" r="4.5" fill="#d4af37" stroke="#111" stroke-width="2" />
      <!-- Pteruges (Hanging leather apron straps) -->
      <rect x="110" y="352" width="12" height="38" fill="#78350f" stroke="#111" stroke-width="3" />
      <rect x="130" y="352" width="12" height="42" fill="#78350f" stroke="#111" stroke-width="3" />
      <rect x="150" y="352" width="12" height="42" fill="#78350f" stroke="#111" stroke-width="3" />
      <rect x="170" y="352" width="12" height="38" fill="#78350f" stroke="#111" stroke-width="3" />

      <!-- Heavy Pilum Spear in hand -->
      <line x1="248" y1="10" x2="242" y2="480" stroke="#78350f" stroke-width="9" stroke-linecap="round" />
      <path d="M248 10 L250 -25 L252 10 Z" fill="#94a3b8" stroke="#111" stroke-width="3.5" />
      <rect x="244" y="10" width="8" height="35" fill="#475569" stroke="#111" stroke-width="2.5" />

      <!-- Arms & Hands -->
      <!-- Left arm (exhausted resting on hip) -->
      <path d="M102 195 L65 260 L80 320" stroke="#111" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <circle cx="80" cy="320" r="11" fill="#f2dcb0" stroke="#111" stroke-width="4" />
      <!-- Right arm holding Pilum -->
      <path d="M198 195 L230 260 L245 285" stroke="#111" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <circle cx="245" cy="285" r="11" fill="#f2dcb0" stroke="#111" stroke-width="4" />

      <!-- HEAD (Clean round circle from Narrator.tsx, r=64) -->
      <g transform="translate(0, 0)">
        <circle cx="150" cy="92" r="64" fill="#f2dcb0" stroke="#111" stroke-width="6" />

        <!-- Galea Legionary Helmet -->
        <!-- Crimson Horsehair Crest -->
        <path d="M142 20 Q124 -42 150 -58 Q176 -42 158 20 Z" fill="#dc2626" stroke="#111" stroke-width="4" />
        <path d="M142 24 L142 -2 L158 -2 L158 24 Z" fill="#a8741c" stroke="#111" stroke-width="3" />
        <!-- Bronze Dome -->
        <path d="M84 86 Q80 18 150 18 Q220 18 216 86 Q150 66 84 86 Z" fill="#d97706" stroke="#111" stroke-width="5" />
        <!-- Cheek Guards -->
        <path d="M85 82 L88 132 L102 122 L98 84 Z" fill="#b45309" stroke="#111" stroke-width="3" />
        <path d="M215 82 L212 132 L198 122 L202 84 Z" fill="#b45309" stroke="#111" stroke-width="3" />
        <!-- Brow Rim -->
        <ellipse cx="150" cy="72" rx="70" ry="12" fill="#d97706" stroke="#111" stroke-width="4" />
        <circle cx="112" cy="72" r="3.5" fill="#78350f" />
        <circle cx="150" cy="69" r="5" fill="#dc2626" stroke="#111" stroke-width="2" />
        <circle cx="188" cy="72" r="3.5" fill="#78350f" />

        <!-- FACE: Pure Misery / Exhaustion (matches the classic style) -->
        <!-- Brows angled down in misery -->
        <path d="M116 75 Q128 82 138 78" stroke="#111" stroke-width="6" stroke-linecap="round" fill="none" />
        <path d="M184 75 Q172 82 162 78" stroke="#111" stroke-width="6" stroke-linecap="round" fill="none" />

        <!-- Big round white eyes with pupils looking forward -->
        <ellipse cx="128" cy="94" rx="10" ry="12" fill="#ffffff" stroke="#111" stroke-width="3" />
        <circle cx="128" cy="94" r="4.5" fill="#111" />
        <ellipse cx="172" cy="94" rx="10" ry="12" fill="#ffffff" stroke="#111" stroke-width="3" />
        <circle cx="172" cy="94" r="4.5" fill="#111" />

        <!-- Dark Tired Eye Bags underneath -->
        <path d="M118 108 Q128 116 138 108" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <path d="M162 108 Q172 116 182 108" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />

        <!-- Frowning / Exhausted Mouth -->
        <path d="M136 130 Q150 120 164 130" stroke="#111" stroke-width="5" stroke-linecap="round" fill="none" />
      </g>
    </svg>

    <!-- Punchy High-CTR Headline -->
    <div class="text-box">
      <div class="headline">25 YEARS</div>
      <div class="subline">OF HELL</div>
    </div>

    <!-- Official Brand Pill -->
    <div class="badge">A DAY BACK THEN</div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle" });
  const outPath = path.resolve("out/thumbnails/roman-legionary-25-years-of-hell.jpg");
  await page.screenshot({ path: outPath, quality: 96 });
  console.log("✓ Rendered high CTR thumbnail to:", outPath);
  await browser.close();
}

main().catch(console.error);

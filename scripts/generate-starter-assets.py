from PIL import Image, ImageDraw, ImageFont
import os
import math

# Target directory
export_dir = "exports/4 - AI Shorts & Reels Starter Engine (Free)"
os.makedirs(export_dir, exist_ok=True)

# -------------------------------------------------------------
# 1. GENERATE 512x512 LOGO
# -------------------------------------------------------------
logo_size = (512, 512)
logo = Image.new("RGBA", logo_size, (10, 15, 26, 255))
draw = ImageDraw.Draw(logo)

# Radial ambient emerald/cyan glow
for r in range(256, 0, -2):
    alpha = int(55 * (1 - r / 256.0))
    draw.ellipse([256 - r, 256 - r, 256 + r, 256 + r], fill=(16, 185, 129, alpha))

# Inner rounded box
box = [70, 70, 442, 442]
draw.rounded_rectangle(box, radius=56, fill=(17, 24, 39, 255), outline=(16, 185, 129, 255), width=4)

# Video Play Triangle & Lightning Bolt Emblem
# Play triangle
tri_points = [(190, 160), (370, 256), (190, 352)]
draw.polygon(tri_points, fill=(6, 78, 59, 200))
draw.line(tri_points + [tri_points[0]], fill=(16, 185, 129, 255), width=5)

# Fast-forward spark inside
bolt = [(240, 180), (280, 240), (250, 245), (285, 330), (230, 265), (255, 260)]
draw.polygon(bolt, fill=(52, 211, 153, 255))

# FREE Pill Badge at top
badge_box = [186, 45, 326, 95]
draw.rounded_rectangle(badge_box, radius=20, fill=(16, 185, 129, 255))
# Try to draw text or pill
draw.text((220, 58), "FREE", fill=(255, 255, 255, 255))

# Bottom tag
draw.text((170, 395), "QUICKSTART", fill=(110, 231, 183, 255))

logo_path = os.path.join(export_dir, "ai-shorts-starter-logo.png")
logo.save(logo_path)
print(f"Logo generated: {logo_path}")

# Also save copy to exports root
logo.save("exports/ai-shorts-starter-logo.png")

# -------------------------------------------------------------
# 2. GENERATE 1280x720 SHOWCASE SCREENSHOT
# -------------------------------------------------------------
screen_size = (1280, 720)
screen = Image.new("RGBA", screen_size, (10, 15, 26, 255))
sdraw = ImageDraw.Draw(screen)

# Subtle background grid & glowing accents
for x in range(0, 1280, 64):
    sdraw.line([(x, 0), (x, 720)], fill=(25, 35, 55, 100), width=1)
for y in range(0, 720, 64):
    sdraw.line([(0, y), (1280, y)], fill=(25, 35, 55, 100), width=1)

# Header Title Card
sdraw.rounded_rectangle([60, 50, 1220, 670], radius=32, fill=(17, 24, 39, 240), outline=(52, 211, 153, 180), width=3)

# Header Badges
sdraw.rounded_rectangle([90, 80, 280, 125], radius=16, fill=(16, 185, 129, 255))
sdraw.text((115, 92), "100% FREE STARTER", fill=(255, 255, 255, 255))

sdraw.rounded_rectangle([300, 80, 530, 125], radius=16, fill=(31, 41, 55, 255), outline=(16, 185, 129, 200), width=2)
sdraw.text((320, 92), "TRIAL EDITION FOR AGENTS", fill=(52, 211, 153, 255))

# Main Title
sdraw.text((90, 150), "AI Shorts & Reels Starter Engine", fill=(255, 255, 255, 255))
sdraw.text((90, 190), "Generate, voice, and render 1080x1920 viral shorts in under 2 minutes with ZERO API costs.", fill=(156, 163, 175, 255))

# Left Box: What is included
sdraw.rounded_rectangle([90, 240, 620, 620], radius=24, fill=(15, 23, 42, 255), outline=(52, 211, 153, 150), width=2)
sdraw.text((120, 270), "INCLUDED IN FREE TRIAL", fill=(52, 211, 153, 255))

features = [
    "[+] 3-Second Hook Retention Architecture (7 Archetypes)",
    "[+] Zero-Cost Broadcast Neural Audio (Edge TTS)",
    "[+] Remotion 1080x1920 30FPS Code-Based Engine",
    "[+] Dynamic Ken Burns Zoom & High-Contrast Typography",
    "[+] Single-Narrator Rapid Video Synthesis",
    "[+] Multi-Platform: YouTube Shorts, TikTok, Reels"
]
for i, feat in enumerate(features):
    sdraw.text((120, 320 + i * 45), feat, fill=(243, 244, 246, 255))

# Right Box: Pro Suite Upgrade Preview
sdraw.rounded_rectangle([660, 240, 1190, 620], radius=24, fill=(24, 24, 27, 255), outline=(245, 158, 11, 180), width=2)
sdraw.text((690, 270), "UNLOCK WITH PRO SUITE ($45)", fill=(245, 158, 11, 255))

pro_features = [
    "[PRO] Autonomous Social Publishing (YouTube & IG API)",
    "[PRO] Dual-Character Acting & Cameo NPC Staging",
    "[PRO] Syllable-Level Kinetic Typography & Viseme Glow",
    "[PRO] Automated Mobile UI Safe-Zone Collision QA",
    "[PRO] Database Vault Storage & Automated Release Drops",
    "[PRO] High-CTR Video Thumbnail Extraction Engine"
]
for i, pfeat in enumerate(pro_features):
    sdraw.text((690, 320 + i * 45), pfeat, fill=(229, 231, 235, 255))

screen_path = os.path.join(export_dir, "ai-shorts-starter-screenshot.png")
screen.save(screen_path)
print(f"Screenshot generated: {screen_path}")

# Also save copy to exports root
screen.save("exports/ai-shorts-starter-screenshot.png")

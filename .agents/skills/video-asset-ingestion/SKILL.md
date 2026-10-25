---
name: video-asset-ingestion
description: >-
  Ingest, link, and validate media assets for the video pipeline, including 1080x1920
  background artwork across 6 visual art styles, multi-provider zero-cost image generation,
  sound beds, and character sprite sheets.
---

# Video Asset Ingestion

This skill handles asset generation, image linking, style consistency, and asset coverage verification across the video pipeline.

---

## 1. Directory Structure

- `public/images/<slug>/<n>.jpg`: 9:16 vertical (1080x1920) background artwork for Shorts.
- `public/long/<slug>/<n>.png`: 16:9 widescreen (1920x1080) background artwork for longform episodes.
- `public/audio/<slug>/<n>.mp3`: Scene-by-scene voiceover files.
- `public/audio/ambient/<sound>.wav`: Continuous atmospheric background audio.
- `public/narrator/`: Modular narrator bodies, emotions, outfits (`casual`, `toga`, `scholar`, `adventurer`, `shadow`).
- `public/cameo/`: Modular NPC archetype assets (Citizen, Guard, Merchant, Worker, Doctor).

---

## 2. Multi-Provider Zero-Cost Image Pipeline

Image generation runs through `scripts/make-images.mjs` with multi-tier fallback:
1. **Gemini 3.1 Flash Image** (If API key provided)
2. **HuggingFace Inference Flux.1-Schnell** (Fast high-detail rendering)
3. **Pollinations Flux (1080x1920)** (Zero-key, 100% reliable fallback)

### The 6 Visual Art Styles:
- `classic-cartoon`: 1990s retro animation with bold ink lines and saturated primary hues.
- `dark-folklore`: Moody chiaroscuro, heavy fog, eerie torchlight, and grim atmosphere.
- `vintage-woodcut`: Medieval woodblock engraving with textured hatch lines and parchment tones.
- `cinematic-realism`: High-dynamic-range cinematic lighting with shallow depth of field.
- `anime-cinematic`: Modern anime production aesthetic with volumetric lighting and vibrant palettes.
- `comic-pulp`: Golden-age comic book halftone dots with bold speech-friendly layouts.

### CLI Image Commands:
```bash
# Generate images for all scenes with style override
node scripts/make-images.mjs <slug> --style dark-folklore

# Regenerate a single specific scene
node scripts/make-images.mjs <slug> --scene 3 --force

# Extract visual prompt queue
cat scripts-out/<slug>.prompts.txt
```

---

## 3. Pre-Flight Asset Verification

Never launch a final video render with missing assets. Always run preflight validation:
```bash
node -e "
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('scripts-out/<slug>.json'));
const missingImg = d.scenes.filter(s => !fs.existsSync('public/' + s.image));
const missingAudio = d.scenes.filter(s => !fs.existsSync('public/' + s.audio));
console.log('Scenes:', d.scenes.length);
console.log('Missing images:', missingImg.length, 'Missing audio:', missingAudio.length);
if (missingImg.length > 0 || missingAudio.length > 0) process.exit(1);
"
```

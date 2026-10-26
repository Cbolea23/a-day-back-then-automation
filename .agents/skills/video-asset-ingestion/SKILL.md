---
name: video-asset-ingestion
description: >-
  Ingest, link, and validate media assets for the video pipeline, including 1080x1920
  background artwork across 6 visual art styles, multi-provider zero-cost image generation,
  sound beds, and character sprite sheets.
---

# Video Asset Ingestion

This skill handles asset generation, image linking, style consistency, asset coverage verification, and sync rules between the code repository and Google Drive media vault.

---

## 0. The Asset Law (Effective Oct 26, 2026)

- **The GitHub repository is strictly CODE ONLY.** Scripts, script JSONs, prompts, Luau backend modules, documentation, and configuration files live in Git.
- **NEVER `git add` artwork, 3D models, textures, audio, or video files.**
- **All media lives in the Google Drive handover folder** (`Muse and atigravity handover`):
  - `public/images/<slug>/` $\leftrightarrow$ Drive: `Artwork - Shorts (public-images)/<slug>/`
  - `public/long/<slug>/` $\leftrightarrow$ Drive: `Artwork - Longform (public-long)/<slug>/`
  - `game/models/<line>/`, `game/textures/<line>/` $\leftrightarrow$ Drive: `Game Assets/<line>/models|textures/`
  - Finished video renders + thumbnails $\leftrightarrow$ Drive root (follow `DONE - ` prefix protocol)
- **Before PC-side renders:** Download required artwork from Google Drive into the matching local directory (`public/images/<slug>/` or `public/long/<slug>/`). Render scripts read local paths unchanged.
- **Game assets:** 3D FBX models and textures come from Drive `Game Assets/`. Blender scripts remain in `game/blender/`, and `game/HANDOVER.md` acts as the cross-pipeline checklist.
- **Migration transition:** Muse is currently migrating existing art to Drive. Do NOT delete local/repo media until Muse explicitly confirms completion.

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

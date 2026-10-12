---
name: video-asset-ingestion
description: >-
  Ingest, link, and validate media assets for the video pipeline, including 4K
  background artwork, era-specific color palettes, sound beds, custom typography,
  and character sprite sheets. Use when preparing video assets, validating image coverage,
  or linking assets into scripts.
---

# Video Asset Ingestion

This skill handles asset management, prompt generation, linking, and coverage verification for video production.

## Asset Directory Structure

- `public/long/<slug>/<n>.png`: 16:9 4K background artwork for long-form episodes.
- `public/audio/long/<slug>/<n>.wav`: High-fidelity voiceover files.
- `public/audio/ambient/<sound>.wav`: Continuous atmospheric background audio (e.g. `gladiator-barracks.wav`, `roman-market.wav`).
- `public/narrator/`: Modular narrator body parts, facial visemes, clothing, and hats.
- `public/cameo/`: Modular NPC archetype assets (Citizen, Guard, Merchant, Worker, Doctor).

## Workflow Commands

### 1. Linking Images into Scripts
Automatically maps images in `public/long/<slug>/` into the scene definitions in `long-out/<slug>.json`:
```bash
node scripts/build-long.mjs <slug> --no-render
```
Rule: If a scene does not have its own image prompt, it automatically reuses the previous scene's image to ensure uninterrupted visual continuity.

### 2. Generating Prompts for Missing Slots
When creating a new topic, extract all visual prompts into a prompt queue:
```bash
node scripts/make-images.mjs --slug <slug>
```
Prompts are saved to `long-out/<slug>.prompts.txt` with artistic styles tailored to the historical era.

### 3. Pre-flight Asset Verification
Before launching a long render, verify that 100% of required audio files and background slots exist:
```bash
node -e "
const d = JSON.parse(fs.readFileSync('long-out/<slug>.json'));
console.log('Scenes:', d.scenes.length);
const missingImg = d.scenes.filter(s => !fs.existsSync('public/' + s.image));
const missingAudio = d.scenes.filter(s => !fs.existsSync('public/' + s.audio));
console.log('Missing images:', missingImg.length, 'Missing audio:', missingAudio.length);
"
```
Never render a production video with missing assets unless explicitly instructed with `--allow-gradient`.

---
name: thumbnail-generator
description: >-
  Create high-CTR YouTube thumbnail concepts, composition layouts, and high-resolution
  still renders from Remotion video timelines. Use when generating thumbnail concepts,
  extracting promotional frames, or designing cover cards.
---

# Thumbnail Generator

This skill produces thumbnail concepts and extracts high-resolution still frames directly from Remotion compositions.

## Principles of High-CTR Thumbnails

1. **Rule of Thirds & Foreground Contrast:** Strong character expression on one side (e.g. Roman helmet close-up, dramatic gladiator expression) and contextual environment on the opposite side.
2. **Simplified Visual Hierarchy:** Maximum of 1 primary subject and 3 words of bold text (e.g. "THE REAL TRUTH", "WORSE THAN DEATH").
3. **Warm/Cold Color Split:** High contrast between warm torchlight/sand and cool shadows or armor metal.

## Commands

### 1. Extracting Composition Stills
Capture a 1920x1080 frame directly from a rendered or scripted Remotion timeline:
```bash
npx remotion still src/index.ts Long "out/thumbnails/thumb-<slug>.png" --props=long-out/<slug>.json --frame=<frame_number>
```

### 2. Inspecting Thumbnail Ideas from Scripts
Each generated longform script provides curated thumbnail suggestions:
```bash
node -e "
const d = JSON.parse(fs.readFileSync('long-out/<slug>.json'));
console.log('Thumbnail Idea:', d.thumbnailIdea);
console.log('Title Options:', d.titleOptions);
"
```

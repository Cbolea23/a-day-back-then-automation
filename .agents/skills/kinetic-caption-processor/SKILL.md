---
name: kinetic-caption-processor
description: >-
  Format, align, and render kinetic word-by-word typography and subtitle animations
  for vertical Shorts and horizontal Longform videos. Calculates syllable timing windows,
  viseme mouth positions, active color highlights, and scale pops. Use when adjusting
  caption styles, subtitle timing, or speech synchronization.
---

# Kinetic Caption Processor

This skill manages animated captions, active word highlights, and mouth synchronization for video productions.

## Architecture & Logic

- **Component:** `src/Captions.tsx`
- **Speech Math:** `src/speech.ts` (`planSpeech()`, `estimateWordTimings()`)

### Timing & Viseme Math
1. `estimateWordTimings(text, durationInFrames)` splits the scene text into words and allocates frame durations based on character length and punctuation pauses (commas add +4 frames, periods add +8 frames).
2. The current active word receives:
   - High-contrast highlight color (`#ffd93b` yellow for Narrator, `#38bdf8` cyan for NPC).
   - Scale pop animation (`transform: scale(1.08)` to `scale(1.18)`).
   - Text drop shadow for high readability over bright background scenes (`drop-shadow(0 4px 14px rgba(0,0,0,0.9))`).

### Chunk Pacing
- **Vertical Shorts (`Short.tsx`)**:
  - `chunkSize = 3` words at a time.
  - Large bold font (`fontSize = 82px`), centered vertically in lower third to prevent platform UI clipping.
- **Horizontal Longform (`LongVideo.tsx`)**:
  - `chunkSize = 6` words at a time.
  - Widescreen cinema font (`fontSize = 64px`), positioned above progress bar, with dedicated speaker badges (`NARRATOR` or character names).

## Customization Guidelines
- When adding speaker badges, ensure badges animate in with a slight spring and color-match the speaker's accent palette.
- Do not hardcode fixed word durations; always normalize across `scene.seconds * 30` to guarantee exact voiceover synchronization.

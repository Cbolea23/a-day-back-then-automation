---
name: remotion-video-engine
description: >-
  Render and animate code-based videos using Remotion for Shorts (1080x1920) and
  Longform (1920x1080). Handles multi-character mouth synchronization, NPC cameo
  corner positioning, comic speech bubbles, camera pan/zoom interpolation, and
  layered sound beds. Use when asked to render videos, test scenes, or animate characters.
---

# Remotion Video Engine

This skill governs programmatic video rendering and dynamic character animations using React and Remotion.

## Compositions Overview

All compositions are defined in `src/Root.tsx`:
- `Short` (1080x1920, 30fps): Vertical TikTok/Reels/Shorts format.
- `Long` (1920x1080, 30fps): Horizontal YouTube documentary format.
- `SampleScene` (1920x1080, 30fps): Quick dialogue interaction test between Narrator and NPC.
- `Lineup` / `NPCLineup`: Static review showcases for character archetypes.

## Core Commands

### 1. Rendering Longform Videos
To render a full long-form episode with concurrency:
```bash
npx remotion render src/index.ts Long "out/Longform/2 - Unpublished Vault/long-<slug>.mp4" --props=long-out/<slug>.json --concurrency=6
```

For a fast draft check (half-size scale, 4x faster):
```bash
npx remotion render src/index.ts Long "out/draft-long-<slug>.mp4" --props=long-out/<slug>.json --scale=0.5
```

### 2. Rendering Shorts
To render a vertical Short:
```bash
npx remotion render src/index.ts Short "out/<slug>.mp4" --props=data/<slug>.json
```

### 3. Rendering a Still Frame / Snapshot
To capture a visual snapshot of a specific frame for quick review:
```bash
npx remotion still src/index.ts Long "out/preview-<slug>.png" --props=long-out/<slug>.json --frame=<frame_number>
```

## Character & Animation Architecture

### Dual-Character Dynamics
- **Narrator (`src/Narrator.tsx`)**:
  - Located in foreground bottom-right (`anchorX={0.88}`).
  - Lipsync mouth shapes derived from `planSpeech()` phoneme windows or explicit audio amplitude.
  - When listening to an NPC, narrator pose is locked (`talking={false}`, `gesture="think"`, `reaction="recoil"`).
- **Cameo NPC (`src/NPC.tsx`)**:
  - Positioned in corner (`left-corner` or `right-corner`) or split screen.
  - Supports 5 distinct archetypes: Citizen, Guard, Merchant, Worker, Doctor.
  - Displays comic speech bubbles and handles independent mouth sync when speaking.

### Camera Pan & Zoom
- Background images alternate between slow zoom-in (`scale(1.04 -> 1.16)`) and zoom-out (`scale(1.16 -> 1.04)`) across scene cuts to maintain motion without jarring cuts.

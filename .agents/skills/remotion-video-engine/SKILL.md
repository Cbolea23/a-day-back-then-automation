---
name: remotion-video-engine
description: >-
  Render and animate code-based videos using Remotion for Shorts (1080x1920) and
  Longform (1920x1080). Handles multi-character mouth synchronization, dynamic camera
  pan/zoom interpolation, kinetic typography, and headless CLI rendering.
---

# Remotion Video Engine

This skill governs programmatic video rendering, camera motion formulas, and timeline synchronization using React and Remotion.

---

## 1. Compositions Overview (`src/Root.tsx`)

- `Short` (1080x1920, 30fps): Vertical TikTok / Instagram Reels / YouTube Shorts composition.
- `Long` (1920x1080, 30fps): Widescreen horizontal documentary composition.
- `SampleScene` (1920x1080, 30fps): Quick dialogue interaction test between Narrator and NPC.
- `Lineup` / `NPCLineup`: Showcase compositions for character archetypes.

---

## 2. Production CLI Commands

### Rendering Vertical Shorts
```bash
# Production render to Unpublished Vault
npx remotion render src/index.ts Short "out/2 - Unpublished Vault/<slug>.mp4" --props=scripts-out/<slug>.json

# Fast draft preview (50% scale, 4x faster)
npx remotion render src/index.ts Short "out/draft-<slug>.mp4" --props=scripts-out/<slug>.json --scale=0.5
```

### Rendering Widescreen Longform
```bash
# Render full longform episode with concurrency
npx remotion render src/index.ts Long "out/Longform/2 - Unpublished Vault/long-<slug>.mp4" --props=long-out/<slug>.json --concurrency=6
```

### Snapshot / Still Frame Capture
```bash
# Capture high-resolution thumbnail still
npx remotion still src/index.ts Short "out/thumb-<slug>.png" --props=scripts-out/<slug>.json --frame=90
```

---

## 3. Dynamic Camera Pan & Zoom Interpolation

Static images look cheap and disengage viewers. Use Remotion's `interpolate()` to apply continuous, subtle focal drifts across scene cuts:

```tsx
import {interpolate, useCurrentFrame} from "remotion";

export const DriftingBackground = ({src, direction = "push-in", durationInFrames}) => {
  const frame = useCurrentFrame();

  // Subtle 1.04 -> 1.16 scale prevents visual jarring while keeping viewer eyes engaged
  const scale = direction === "push-in"
    ? interpolate(frame, [0, durationInFrames], [1.04, 1.16], {extrapolateRight: "clamp"})
    : interpolate(frame, [0, durationInFrames], [1.16, 1.04], {extrapolateRight: "clamp"});

  return (
    <div style={{width: "100%", height: "100%", overflow: "hidden"}}>
      <img src={src} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`}} />
    </div>
  );
};
```

---

## 4. Mobile UI Safe Zone Compliance (1080x1920)

- **Right Edge Margin (120px):** Must remain clear of critical text or faces to avoid overlap with TikTok/Shorts action buttons (Like, Comment, Share).
- **Bottom Margin (240px):** Must remain clear of subtitles to prevent YouTube Shorts title/channel banner occlusion.
- **Top Margin (160px):** Must remain clear of text to prevent platform status bar and back button clipping.

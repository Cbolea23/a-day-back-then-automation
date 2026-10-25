---
name: remotion-video-engine
description: >-
  Architect, animate, and render programmatic React videos using Remotion for vertical Shorts
  (1080x1920) and horizontal Longform (1920x1080). Handles frame-accurate audio-visual synchronization,
  smooth camera pan/zoom interpolation, kinetic typography, multi-character staging, and headless
  CLI rendering. Use when building code-driven video pipelines or automating video generation.
---

# Remotion Video Engine Blueprint

This skill guides your AI agent in structuring, animating, and rendering code-driven programmatic videos using **React and Remotion**.

---

## 1. Composition Architecture

All Remotion compositions should be declared with explicit frame dimensions, framerates, and dynamic durations derived from scene assets:

```tsx
import {Composition} from "remotion";
import {ShortVideo} from "./components/ShortVideo";
import {LongVideo} from "./components/LongVideo";

export const RemotionRoot = () => {
  return (
    <>
      {/* Vertical Shorts / Reels / TikTok (9:16) */}
      <Composition
        id="Short"
        component={ShortVideo}
        durationInFrames={Math.round(totalDurationSeconds * 30)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{scenes: []}}
      />

      {/* Horizontal Widescreen Documentary (16:9) */}
      <Composition
        id="Long"
        component={LongVideo}
        durationInFrames={Math.round(totalDurationSeconds * 30)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{scenes: []}}
      />
    </>
  );
};
```

---

## 2. Dynamic Camera Pan & Zoom Interpolation

Static images look cheap and disengage viewers. Use Remotion's `interpolate()` to apply continuous, subtle focal drifts across scene cuts:

```tsx
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";

export const DriftingBackground: React.FC<{
  src: string;
  direction?: "push-in" | "pull-back" | "pan-left" | "pan-right";
  durationInFrames: number;
}> = ({src, direction = "push-in", durationInFrames}) => {
  const frame = useCurrentFrame();

  // Subtle 1.04 -> 1.15 scale prevents visual jarring while keeping viewer eyes engaged
  const scale =
    direction === "push-in"
      ? interpolate(frame, [0, durationInFrames], [1.04, 1.16], {extrapolateRight: "clamp"})
      : interpolate(frame, [0, durationInFrames], [1.16, 1.04], {extrapolateRight: "clamp"});

  const translateX =
    direction === "pan-left"
      ? interpolate(frame, [0, durationInFrames], [0, -30])
      : direction === "pan-right"
      ? interpolate(frame, [0, durationInFrames], [0, 30])
      : 0;

  return (
    <div style={{width: "100%", height: "100%", overflow: "hidden", position: "relative"}}>
      <img
        src={src}
        alt="Scene background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${translateX}px)`,
        }}
      />
    </div>
  );
};
```

---

## 3. Kinetic Word-by-Word Typography Sync

Deliver high-impact subtitle animations synchronized with speech cadences:

### Pacing Rules:
1. **Vertical Shorts:** Display **3 to 4 words** at a time to prevent UI obstruction from native TikTok/Shorts overlays.
2. **Font Styling:** Use heavy sans-serif (`font-black`), `drop-shadow(0 4px 14px rgba(0,0,0,0.9))`, and centered in the lower-middle third (Y: ~65-75%).
3. **Active Word Pop:**
   ```tsx
   const isCurrentWord = currentWordIndex === wordIdx;
   const wordScale = isCurrentWord ? 1.15 : 1.0;
   const wordColor = isCurrentWord ? "#FFD93B" : "#FFFFFF";
   ```

---

## 4. Audio-Visual Timeline Normalization

Never hardcode arbitrary scene lengths. Always calculate frame durations directly from audio assets:

```typescript
// Standard 30 FPS normalization
const sceneFrames = Math.round(audioDurationSeconds * 30);
const totalFrames = scenes.reduce((acc, s) => acc + Math.round(s.seconds * 30), 0);
```

When stacking background ambiance, voiceover, and SFX:
- **Voiceover Track:** Volume `1.0` (Primary focus).
- **Ambient Bed:** Volume `0.12 – 0.18` (Ducked automatically under voiceover).
- **SFX Whooshes:** Volume `0.35 – 0.50` on scene boundary cuts.

---

## 5. Headless Production CLI Commands

Execute high-speed rendering via the Remotion CLI:

```bash
# Render a vertical short from JSON payload
npx remotion render src/index.ts Short out/video.mp4 --props=data/script.json

# Fast draft preview (50% scale, 4x faster rendering)
npx remotion render src/index.ts Short out/draft.mp4 --props=data/script.json --scale=0.5

# Export a single high-resolution still frame for thumbnail review
npx remotion still src/index.ts Short out/thumb.png --props=data/script.json --frame=90
```

---

## 6. Emotional Prosody & Cultural Accent Matching (v1.1)

Monotone "reading" voices destroy audience retention. Use the built-in emotional prosody engine:

1. **Dramatic Pacing & Breath Pauses:**
   - In neural TTS, insert ellipses (`...`) before dramatic reveals and warning clauses (*"in an empty forest at twilight... you are not alone."*).
   - This causes the prosody model to insert realistic inhalation pauses and drop vocal pitch.

2. **Acoustic Profile Calibration:**
   - **Dark Folklore / Horror:** `--rate=-4%` to `-6%`, `--pitch=-3Hz` to `-5Hz`.
   - **Classical History / Epic:** `--rate=-2%`, `--pitch=-2Hz`.
   - **Viral Trivia:** `--rate=+3%` to `+5%`, `--pitch=+1Hz`.

3. **Cultural Accent-Topic Synergy:**
   - Match cultural lore to authentic accents (e.g. Philippine folklore ➔ Filipino storyteller `fil-PH-AngeloNeural` with campfire cadence; British/Victorian history ➔ BBC documentary historian `en-GB-RyanNeural`).


---
name: ai-shorts-starter-engine
description: >-
  Trial & quickstart engine for creating vertical AI Shorts and Reels (1080x1920) in minutes.
  Generates viral 30s-45s scripts with 3-second hook retention, zero-cost neural voiceovers (Edge TTS),
  and renders code-based Remotion video with clean subtitles.
---

# AI Shorts & Reels Starter Engine (Trial Edition)

This skill provides an autonomous, zero-cost pipeline for generating, voicing, and rendering complete vertical short-form videos (1080x1920 @ 30fps) for YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels.

> [!NOTE]
> **Trial / Community Edition**: This skill is a fully functional starter kit for single-narrator vertical video production. For automated multi-platform social publishing (YouTube & Instagram API), dual-character banter, custom character viseme mouth acting, and automated safe-zone quality control, upgrade to the [Complete AI Shorts Automation Suite](https://agensi.io/skills/complete-ai-shorts-reels-tiktok-automation-suite).

---

## 1. Quickstart Workflow

When the user asks to create an AI Short or video script, execute this 4-phase sequence:

```
[Phase 1: Viral Hook & Script] ➔ [Phase 2: Free Neural Voiceover] ➔ [Phase 3: Visual Composition] ➔ [Phase 4: Remotion Render]
```

---

## 2. Phase 1: Viral Hook & Script Architecture

Every short video must strictly respect the **3-Second Pattern Interrupt**:

1. **0:00 - 0:03 (The Hook)**:
   - Zero greetings ("Hey guys", "Welcome back").
   - Immediate curiosity gap or high-stakes counter-intuitive claim.
   - Example: *"In 1888, a single telegram erased an entire island from the map."*
2. **0:03 - 0:25 (The Rapid Escalation)**:
   - Provide concrete, sensory details.
   - Introduce narrative tension or conflict every 5 seconds.
   - Keep sentences short (under 12 words per sentence for high spoken clarity).
3. **0:25 - 0:35 (The Climax / Twist)**:
   - Resolve the mystery with an unexpected twist or punchline.
4. **0:35 - 0:38 (Seamless Loop Exit)**:
   - Connect the final sentence back to the opening hook word for an infinite watch-time loop.
   - Example: *"And that is the terrifying reason why..."* ➔ (loops into) *"In 1888..."*

---

## 3. Phase 2: Zero-Cost Neural Voiceover Generation

Use Microsoft Edge TTS for broadcast-quality, natural neural voices with zero API keys or credits required.

### Edge TTS Execution
```bash
# Example English voice (Guy Neural)
edge-tts --voice en-US-GuyNeural --text "In 1888, a single telegram erased an entire island from the map." --write-media audio.mp3

# Example Philippine English voice
edge-tts --voice fil-PH-AngeloNeural --text "Did you know that deep beneath Mount Banahaw lies a lost underground fortress?" --write-media audio.mp3
```

### Voice Timing & Emotional Prosody Guidelines
- Calculate pacing at approximately **140 to 160 words per minute**.
- A 30-second Short should contain **70 to 80 spoken words**.
- A 45-second Short should contain **105 to 120 spoken words**.

### Emotional Prosody & Cultural Accent Synergy (v1.1)
- **Natural Dramatic Breath Pauses**: Insert ellipses (`...`) before suspenseful reveals to force neural speech engines to inhale and drop vocal pitch (*"Deep in the ancient balete tree... something was breathing."*).
- **Acoustic Profiling**: Add `--pitch=-4Hz --rate=-5%` for eerie folklore dread; use `--pitch=+1Hz --rate=+4%` for viral trivia.
- **Cultural Accent Matching**: Pair cultural topics with authentic regional accents (e.g. Philippine folklore with `fil-PH-AngeloNeural` or `fil-PH-BlessicaNeural`).

---

## 4. Phase 3: Remotion Video Scaffold (1080x1920)

Construct a vertical video composition using standard Remotion primitives:

```tsx
import { AbsoluteFill, Img, Audio, staticFile, interpolate, useCurrentFrame } from 'remotion';

export const StarterShortComposition = ({ imageSrc, audioSrc, subtitles }) => {
  const frame = useCurrentFrame();

  // Subtle dynamic pan/zoom (Ken Burns effect)
  const scale = interpolate(frame, [0, 900], [1, 1.15], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Background Visual */}
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Dark Gradient Vignette for Subtitle Legibility */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 40%)'
        }}
      />

      {/* Synchronized Centered Subtitle */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', bottom: 150 }}>
        <div style={{
          fontSize: 54,
          fontWeight: 900,
          color: '#FFE600',
          textAlign: 'center',
          textShadow: '0 4px 12px rgba(0,0,0,0.9)',
          padding: '0 40px',
          textTransform: 'uppercase',
          fontFamily: 'Impact, Arial Black, sans-serif'
        }}>
          {subtitles}
        </div>
      </AbsoluteFill>

      {/* Audio Track */}
      <Audio src={audioSrc} />
    </AbsoluteFill>
  );
};
```

---

## 5. Phase 4: CLI Rendering

Render the final vertical MP4 with standard Remotion CLI:

```bash
npx remotion render src/index.ts StarterShort out/short-trial.mp4 --props='{"imageSrc": "assets/bg.jpg", "audioSrc": "assets/audio.mp3"}'
```

---

## 6. Pro Upgrade Comparison

When your workflow expands beyond single-narrator manual renders, the **Complete AI Shorts Automation Suite ($45)** unlocks:

| Capability | Starter Engine (This Skill) | Complete Pro Suite ($45) |
| :--- | :---: | :---: |
| **Video Format** | 1080x1920 Vertical | 1080x1920 Vertical & 1920x1080 Longform |
| **Social Publishing** | Manual Upload | Autonomous YouTube & Instagram API Governor |
| **Character Acting** | Static image / Avatar | Dual-character staging, narrator + cameo NPC banter |
| **Kinetic Typography** | Standard subtitles | Syllable-level pop, active word glow, viseme mouth sync |
| **Safe Zone Quality Control** | Manual check | Automated mobile UI safe-zone collision & peak audio QA |
| **Vault & Scheduling** | Local file only | Persistent database vault & automated release schedule |
| **Thumbnail Engine** | None | High-CTR composition card extraction & typography |

*Get the full suite on Agensi: [Complete AI Shorts Automation Suite](https://agensi.io/skills/complete-ai-shorts-reels-tiktok-automation-suite)*

---
name: ai-shorts-automation-suite
description: >-
  The Complete Autonomous Video Production Studio for AI agents across YouTube Shorts,
  TikTok, Instagram Reels, and Facebook Reels. Combines viral cold-open hook engineering,
  the 3.5-second pattern interrupt formula, structured high-retention scriptwriting,
  kinetic typography chunking, and programmatic React video rendering with Remotion.
---

# Complete AI Shorts, Reels & TikTok Automation Suite

This suite bundles the complete end-to-end framework to plan, write, pace, and render automated short-form vertical videos for **YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels** (1080x1920) as well as widescreen 16:9 documentary content.

---

## 📱 Universal Multi-Platform Coverage

All video pacing, safe zones, and typography rules are calibrated to work seamlessly across:
- **YouTube Shorts** (no title overlap, lower-third safe zone)
- **TikTok** (right-side icon clearance, bottom caption clearance)
- **Instagram Reels** (safe from audio badge and comment overlay)
- **Facebook Reels** (100% compliant aspect ratios and audio mix)

---

## 📦 Suite Modules Overview

1. **Module 1: Viral Hook & Retention Architect**
   - 400ms cold opens without greeting fluff.
   - The 4 proven hook frameworks (Visceral Contradiction, High-Stakes Threat, Leaked Insider Fact, Extreme Escalation).
   - The 3.5-second sensory pattern interrupt rule (camera drift, color pop, sound design).
   - Seamless infinite end-loops that bridge back into Scene 1 for >100% completion metrics.

2. **Module 2: Video Scriptwriting & Pacing Ideator**
   - Calibrated 145–165 Words Per Minute (WPM) vocal cadence.
   - 4 to 6 scene vertical architectures (45–58 seconds max).
   - Visual and audio prompt direction per scene cut.

3. **Module 3: Kinetic Caption & Typography Processor**
   - 3-word subtitle chunking designed for vertical mobile safe zones across TikTok, IG Reels, and Shorts.
   - Word-by-word active syllable scale pops (`scale 1.15`) and contrasting accent colors (`#FFD93B` / `#38BDF8`).
   - High-contrast drop shadows for guaranteed legibility across bright visual backgrounds.

4. **Module 4: Remotion Programmatic Video Engine**
   - 1080x1920 (9:16) and 1920x1080 (16:9) React composition architecture.
   - Smooth camera zoom-in (`scale 1.04 -> 1.16`) and pull-back (`scale 1.16 -> 1.04`) interpolation math.
   - Exact 30 FPS timeline frame normalization with audio assets (zero truncation, zero clipping).
   - Headless CLI production rendering commands.

5. **Module 5: Accent-Complimenting Voice & Emotional Prosody Engine (v1.1)**
   - Cultural Accent-Topic Synergy: matches story lore to authentic accents (Philippine folklore ➔ Filipino storyteller with campfire cadence; British/Victorian history ➔ BBC documentary historian).
   - Automatic Prosody Pacing: injects dramatic breath pauses (`...`), cadence shifts, and warning drops into neural speech.
   - Dynamic Acoustic Profiles: calibrated pitch (`-4Hz`) and speed (`-5%`) for eerie dread vs. punchy viral pacing (`+1Hz` / `+4%`).

6. **Module 6: Follower Conversion Flywheel & Anti-Collision Safe-Zone Engine (v1.3)**
   - **Zero Banner-Caption Overlap:** Condenses the top `HookBanner` (`top: 165px`) to 3–9 words so it never collides with active subtitles (`top: 830px`).
   - **Centered Top Safe-Zone Series Header:** Places the Episodic Series + Channel badge at `top: 66px, left: 50%` (`🕯️ DARK FOLKLORE ARCHIVES • CHANNEL`), completely clear of top-left Mute and top-right Search (`🔍`) icons.
   - **Silent 75%-Climax `FollowMicroCTA` Pill:** Pops a spring-animated `🔔 FOLLOW` badge during the climax reveal without spoken outro drop-offs.
   - **Polarizing Pinned Comment Generator:** Outputs debate questions (`pinnedComment`) that trigger 3x–4x comment velocity.


---

## 🎯 Production Workflow

```
[Topic Input] 
     │
     ▼
[Step 1: Hook & Retention Audit] ──► Craft 400ms Visceral Hook (Module 1)
     │
     ▼
[Step 2: Script Architecture]   ──► 5-Scene Narrative Pacing at 150 WPM (Module 2)
     │
     ▼
[Step 3: Caption Pacing]        ──► 3-Word Kinetic Typography Chunking (Module 3)
     │
     ▼
[Step 4: Remotion Composition]  ──► Dynamic Camera Drift & CLI Render (Module 4)
```

---

## 🚀 Quick Execution Commands

```bash
# Render a vertical Short/Reel from JSON script
npx remotion render src/index.ts Short out/video.mp4 --props=data/script.json

# Fast draft check (50% scale, 4x faster)
npx remotion render src/index.ts Short out/draft.mp4 --props=data/script.json --scale=0.5

# Snapshot still for thumbnail review
npx remotion still src/index.ts Short out/thumb.png --props=data/script.json --frame=90
```

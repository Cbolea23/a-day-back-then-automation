# Complete AI Shorts, Reels & TikTok Automation Suite (v1.2)

> **Compatibility:** Claude Code, Cursor, GitHub Copilot, Codex, Windsurf, Gemini Antigravity, and all agents supporting the `SKILL.md` standard.

---

## ⚡ What This Suite Delivers

This master suite turns your AI coding assistant into a full **Autonomous Short-Form Video Production Studio**.

### 📺 Live Production Demo
Watch a real vertical video generated end-to-end with this suite:
- **YouTube Shorts:** [The Night the Dead Came Back (YouTube Shorts)](https://youtube.com/shorts/kR_vDip2Shc)
- **Facebook Reels:** [The Night the Dead Came Back (Facebook Reel)](https://www.facebook.com/reel/1667506658422446)

It bundles 5 specialized production disciplines and turnkey code templates into one unified agent skill:
1. **Viral Hook & Retention Architect:** Cold opens, 3.5s pattern interrupts, seamless loops, and 100-Point Retention Audit.
2. **Video Scriptwriting Ideator:** 145–165 WPM pacing, structured scene beats, curiosity gaps, and Taglish/multilingual support.
3. **Kinetic Caption Processor:** Mobile-safe 3-word subtitle chunks with active syllable pops and safe zone clearance.
4. **Remotion Video Engine:** React composition architecture, dynamic camera drift math, and headless rendering.
5. **Accent-Complimenting Voice & Emotional Prosody Engine:** Automatic breath pauses, pitch/rate calibration, and cultural accent pairing.

---

## 📦 What's Inside the Package

```
├── SKILL.md                  # Comprehensive AI Agent Rulebook & Architecture
├── README.md                 # Setup & Usage Guide
├── skills/
│   ├── hook-retention-engineer.md
│   ├── kinetic-caption-processor.md
│   ├── remotion-video-engine.md
│   └── video-scriptwriting-ideation.md
├── templates/
│   ├── ShortVideo.tsx        # Drop-in 1080x1920 React/Remotion Component
│   └── sample-short.json     # Ready-to-render 5-scene JSON payload
└── scripts/
    └── prosody-tts.mjs       # Zero-cost Edge TTS + Emotional Prosody CLI
```

---

## 🚀 Instant Quickstart

1. **Install Remotion Dependencies:**
```bash
npm install remotion @remotion/cli react react-dom
```

2. **Render the Bundled Sample Short (1080x1920):**
```bash
npx remotion render templates/ShortVideo.tsx ShortVideo out/test.mp4 --props=templates/sample-short.json
```

3. **Synthesize Zero-Cost Voiceover with Emotional Prosody:**
```bash
node scripts/prosody-tts.mjs "In an empty forest at twilight... you are not alone." scene1.mp3 --emotion spooky-suspense
```

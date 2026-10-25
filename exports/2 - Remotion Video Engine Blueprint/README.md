# Remotion Video Engine Blueprint (v1.2)

> **Compatibility:** Claude Code, Cursor, GitHub Copilot, Codex, Windsurf, Gemini Antigravity, and all agents supporting the `SKILL.md` standard.

---

## ⚡ What This Blueprint Delivers

This skill gives your AI coding assistant the complete architectural knowledge and **turnkey code templates** to build, animate, and render programmatic React videos using Remotion:

- 🎥 **Dynamic Ken Burns Drift (`templates/ShortVideo.tsx`):** Ready-to-use alternating push-in and pull-back camera zoom components.
- 🗣️ **Emotional Prosody Synthesizer (`scripts/prosody-tts.mjs`):** Standalone zero-cost Edge TTS script with emotional pitch/rate tuning and pure-Node duration calculation.
- 🔤 **Mobile-Safe Kinetic Typography:** 3-word chunked subtitle animations with active syllable pops and safe zone clearance.
- 📄 **Production Sample Payload (`templates/sample-short.json`):** A tested 5-scene script payload ready for instant rendering.
- ⚙️ **Optimized CLI Commands:** High-performance headless Remotion render instructions.

---

## 📦 What's Inside the Package

```
├── SKILL.md                  # Comprehensive AI Agent Rulebook & Architecture
├── README.md                 # Setup & Usage Guide
├── templates/
│   ├── ShortVideo.tsx        # Drop-in 1080x1920 React/Remotion Component
│   └── sample-short.json     # Ready-to-render 5-scene JSON payload
└── scripts/
    └── prosody-tts.mjs       # Zero-cost Edge TTS + Emotional Prosody CLI
```

---

## 🚀 Instant Quickstart

1. **Install Remotion:**
```bash
npm install remotion @remotion/cli react react-dom
```

2. **Render the Bundled Sample Short:**
```bash
npx remotion render templates/ShortVideo.tsx ShortVideo out/test.mp4 --props=templates/sample-short.json
```

3. **Synthesize Zero-Cost Voiceover with Prosody:**
```bash
node scripts/prosody-tts.mjs "In an empty forest... you are not alone." scene1.mp3 --emotion spooky-suspense
```

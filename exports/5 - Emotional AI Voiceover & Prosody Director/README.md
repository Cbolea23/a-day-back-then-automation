# Emotional AI Voiceover & Prosody Director (v1.0)

> **Compatibility:** Claude Code, Cursor, GitHub Copilot, Codex, Windsurf, Gemini Antigravity, and all agents supporting the `SKILL.md` standard.

---

## ⚡ What This Skill Does

This skill eliminates robotic "reading" monotone from AI voiceovers and turns your AI agent into an **expert acoustic voice director**.

Whenever you prompt your agent to generate voiceovers, narration, or video scripts, it automatically:
- 🎭 **Applies the Acoustic Calibration Matrix:** Shifts neural TTS pitch (`--pitch=-4Hz` for dread, `+1Hz` for viral energy) and speech speed (`--rate=-5%` to `+4%`).
- 🫁 **Injects Dramatic Breath Pauses:** Formats text with natural inhalations (`...`) and mid-sentence pivots (`—`) that drop vocal pitch by 2–4 semitones.
- 🌏 **Matches Cultural Accent Synergy:** Pairs Philippine lore with authentic Filipino storytellers, Victorian history with British accents, and viral trivia with high-energy hosts.
- 🔁 **Engineers Seamless Loop Slowdowns:** Decelerates final scene cadences by -2% to -4% to guarantee infinite video watch-time loops without audio clipping.
- ⏱️ **Includes Pure Node.js MP3 Duration Parser:** Computes exact audio length down to the millisecond without `ffprobe` or external dependencies.

---

## 📦 What's Included

```
├── SKILL.md                  # Comprehensive AI Agent Rulebook & Acoustic Matrix
├── README.md                 # Setup & Usage Instructions
├── listing-copy.md           # Marketplace details
└── scripts/
    └── prosody-tts.js        # Standalone Edge TTS + Emotional Prosody CLI
```

---

## 🚀 Instant Quickstart

1. **Install Free Edge TTS:**
```bash
pip install edge-tts
```

2. **Generate Eerie Dread Voiceover:**
```bash
node scripts/prosody-tts.js "In an empty balete forest at twilight... you are not alone." scene1.mp3 --emotion spooky-suspense
```

3. **Generate Fast Viral Trivia Voiceover:**
```bash
node scripts/prosody-tts.js "Commercial airline pilots are strictly forbidden from eating this one food." hook.mp3 --emotion viral-energetic
```

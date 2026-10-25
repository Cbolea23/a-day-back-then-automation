---
name: video-scriptwriting-ideation
description: >-
  Generate, polish, and structure high-retention video scripts with viral hooks,
  multi-lingual Tagalog/Taglish support, 3.5s pacing shifts, and emotional prosody.
  Governs script generation via the Multi-Provider Free LLM Router and voice synthesis
  with the Accent-Synergy Prosody Engine.
---

# Video Scriptwriting & Ideation

This skill guides script creation, humanized dialogue generation, retention pacing, multilingual adaptation (English & Tagalog/Taglish), and voiceover emotional prosody.

---

## 1. Script Architecture

### Vertical Shorts Architecture (45–58 Seconds)
- **Target:** 4–6 punchy scenes (~8–11 seconds per scene).
- **Format:** 1080x1920 (9:16).
- **Structure:**
  - **Scene 1 (The Hook):** 400ms cold open with bold sensory contradiction or high-stakes dilemma. Zero greetings.
  - **Scenes 2–4 (Rapid Escalation):** Sensory details, concrete numbers, escalation, and 3.5-second pattern interrupts.
  - **Scene 5 (Climax / Twist):** Revelation or comedic/eerie NPC reaction.
  - **Scene 6 / Last Beat (Infinite Loop Bridge):** Trailing sentence ending that syntactically bridges into Scene 1's opening hook.

### Longform Documentary Architecture (8–12 Minutes)
- **Target:** 30–40 structured scenes (~12–16 seconds per scene).
- **Format:** 1920x1080 (16:9).
- **Structure:** Cold hook -> 6-7 thematic chapters -> NPC interventions -> closing thought and interactive comment prompt.

---

## 2. Multi-Provider Zero-Cost LLM Router

Scripts are generated via `scripts/lib/free-llm-router.mjs` with automatic waterfall failover:
1. **Google Gemini Flash** (Fastest, rich historical knowledge).
2. **Groq LLaMA 3.3 70B** (Instant speed fallback).
3. **OpenRouter Free Tier** (DeepSeek / Mistral).
4. **Pollinations AI** (Zero-key emergency safety net).

### Generation Commands
```bash
# Vertical Short with topic preset
node scripts/make-script.mjs <slug>

# Short with Tagalog / Taglish mode
node scripts/make-script.mjs <slug> --lang taglish

# Short with Dark Folklore styling
node scripts/make-script.mjs <slug> --style dark-folklore

# Longform Documentary Script
node scripts/make-long-script.mjs <slug>
```

---

## 3. Emotional Prosody & Accent-Topic Synergy

Flat "reading" voices destroy audience retention. All scripts and voiceovers must pass through the **Emotional Prosody Engine** (`scripts/lib/prosody-engine.mjs`).

### Pacing & Punctuation Rules:
1. **Dramatic Breath Pauses:** Insert ellipses (`...`) before suspenseful reveals, warnings, and unexpected twists (*"in the middle of the night... the balete roots started moving"*). Neural TTS engines convert this into natural inhalations and vocal register drops.
2. **Em-Dashes (`—`):** Use for rapid conversational pivots and mid-sentence realizations.
3. **Tagalog Cadence:** In Filipino lore, insert short cultural markers (*"pero mag-ingat ka...", "ayon sa matatanda..."*) to give authentic campfire storytelling flavor.

### 4 Emotion Presets:
- `spooky-suspense`: For dark folklore, cryptids, and eerie history (`--pitch=-4Hz --rate=-5%`).
- `intense-drama`: For gladiatorial combat, wars, and disasters (`--pitch=-2Hz --rate=-2%`).
- `documentary-calm`: For architectural marvels and ancient civilization studies (`--pitch=default --rate=-1%`).
- `viral-energetic`: For rapid trivia, bizarre laws, and unexpected facts (`--pitch=+1Hz --rate=+4%`).

### Voice Synthesis Command:
```bash
# Synthesize with emotion and accent synergy
node scripts/make-voice.mjs <slug> --emotion spooky-suspense --voice fil-PH-AngeloNeural
```

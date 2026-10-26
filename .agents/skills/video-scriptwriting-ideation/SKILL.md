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

### Vertical Shorts Architecture (30–42 Seconds Max)
- **Target:** 3–4 punchy scenes (~8–10 seconds per scene). Hard cap: Under 45 seconds total runtime.
- **Why (The 80%+ APV Rule):** YouTube Shorts and Instagram Reels algorithmically suppress videos $\ge 60$ seconds because viewer swipe-aways drop Average Percentage Viewed (APV) below 40%. A concise 35-second Short maintains a 75%–85%+ APV, which triggers viral distribution into cold feeds.
- **Format:** 1080x1920 (9:16).
- **Structure:**
  - **Scene 1 (The Hook):** 400ms cold open with bold sensory contradiction or high-stakes dilemma. Zero greetings.
  - **Scene 2 (Escalation / Evidence):** Sensory details, concrete historical facts, and 3.5-second pattern interrupt.
  - **Scene 3 (Climax / Twist):** The shocking revelation or comedic/eerie NPC reaction.
  - **Scene 4 / Last Beat (Infinite Loop Bridge):** Trailing sentence ending that syntactically bridges into Scene 1's opening hook.

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

### 4 Emotion Presets (0Hz Formant Rule):
- **CRITICAL 0Hz Formant Rule:** Never pass negative pitch shifts (like `-4Hz` or `-7Hz`) to neural voices. Negative pitch shifts garble digital signal formants, producing an artificial, muffled robotic drone. Keep `pitch: 0Hz` to ensure crisp, clean human timbre.
- `spooky-suspense`: For dark folklore, cryptids, and eerie history (`pitch: 0Hz`, `rate: 0%` or `-2%`).
- `intense-drama`: For gladiatorial combat, wars, and disasters (`pitch: 0Hz`, `rate: +3%`).
- `documentary-calm`: For architectural marvels and ancient civilization studies (`pitch: 0Hz`, `rate: +1%`).
- `viral-energetic`: For rapid trivia, bizarre laws, and unexpected facts (`pitch: 0Hz`, `rate: +5%`).

---

## 4. Philippine Lore Strategy & Voice-Avatar Synchronization

### Voice & Avatar Gender Synchronization (Strict Production Rule)
When generating scripts, the narrator avatar MUST match the selected voice actor:
- **Female Voice (`fil-PH-BlessicaNeural`):** Set `"narratorTheme": "babaylan"` (renders traditional Filipina priestess with cascading dark hair, eyelashes, sampaguita blossom, and Baro't Saya bodice).
- **Male Voice (`fil-PH-AngeloNeural`):** Set `"narratorTheme": "albularyo"` (renders Filipino folk healer with putong headband, inabel sash, and anting-anting).
- *Disqualified Voices:* Never use robotic models like `en-PH-JamesNeural`. Keep Angelo and Blessica as the gold standard.

### Taglish vs. Pure Tagalog Content Strategy
1. **Modern Urban Legends & Cryptids (Taglish):** Use for Biringan City, Balete Drive, Baguio Diplomat Hotel, and modern hauntings. Mixes English elements (*GPS coordinates, delivery trucks, satellite scans*) with Tagalog suspense for viral TikTok & Reels engagement.
2. **Ancient Pre-Colonial Mythology (Pure Tagalog):** Use for Bakunawa, Bathala, Aswang Origins, Kapre, and Diwata. Produces chilling *Gabi ng Lagim* campfire atmosphere.

### Cultural Phonetic Alignment (`applyCulturalPhonetics`)
In scripts with local entities, words are displayed with proper written spelling in subtitles (`scene.text`), but passed to the voice model with phonetic syllables (`ba-LEH-te`, `Bee-ring-gahn`, `Sah-mar`, `ahs-wahng`) so the neural voice pronounces them like a native Filipino.

### Voice Synthesis Command:
```bash
# Synthesize with Blessica (Female Filipina Babaylan)
node scripts/make-voice.mjs <slug> --voice fil-PH-BlessicaNeural
```

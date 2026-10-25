---
name: emotional-voiceover-prosody-director
description: >-
  Eliminate flat, monotone, robotic AI voiceovers. Directs neural TTS engines (Edge TTS,
  ElevenLabs, OpenAI, Gemini) with calibrated acoustic prosody, dramatic breath pauses,
  cultural accent-topic synergy, and seamless audio loop bridges.
---

# Emotional AI Voiceover & Prosody Director

This skill turns your AI agent into an expert voice director and acoustic engineer. It solves the #1 issue in AI video automation: **flat, robotic narrators that sound like they are reciting a textbook without emotion.**

---

## 1. The Core Psychology of Voiceover Prosody

Viewers do not drop off because an AI voice is "synthetic"—they drop off because the voice lacks **rhythm, breath, and vocal micro-inflections**.

When text is fed raw into neural TTS, the model predicts an average, flat pitch contour. To force expressive emotion, you must shape both **textual prosody markers** and **acoustic engine parameters**.

---

## 2. Textual Prosody Formatting Rules

Before synthesizing any scene, transform the script using these 4 prosody rules:

### A. The Dramatic Breath Pause (`...`)
In modern neural TTS (Edge TTS, ElevenLabs, OpenAI), ellipses (`...`) force the acoustic model to insert a realistic **250ms–400ms inhalation pause** and drop the trailing pitch by 2–4 semitones.
- 🚫 *Flat:* "Deep in the dark forest something was watching him."
- ✅ *Expressive:* "Deep in the dark forest... something was watching him."

### B. The Conversational Pivot (`—`)
Use em-dashes to create sudden cadence shifts and mid-sentence urgency:
- 🚫 *Flat:* "He thought it was just smoke but it was an ancient giant."
- ✅ *Expressive:* "He thought it was just smoke—until two glowing eyes opened in the canopy."

### C. The Climactic Word Emphasis
In neural engines, placing key stakes in capitalized quotes or exclamation marks elevates formant frequencies and syllable stress:
- ✅ *Example:* "And whatever you do... DO NOT look up."

### D. The Seamless Loop Slowdown (Last Scene)
The final scene must decelerate speech speed by **-2% to -4%** and trail off gently so the video loops smoothly into Scene 1 without sudden, jarring audio cuts.

---

## 3. The Acoustic Calibration Matrix

Pass explicit acoustic parameters (`--pitch` and `--rate`) tailored to the emotional beat of each scene:

| Emotion Preset | Pitch Offset | Speech Rate | Acoustic Impact | Best For |
| :--- | :---: | :---: | :--- | :--- |
| **`spooky-suspense`** | `-4Hz` to `-6Hz` | `-5%` to `-6%` | Deep chest resonance, eerie dread, deliberate campfire pacing | Cryptids, folklore, true crime, supernatural mysteries |
| **`intense-drama`** | `-2Hz` to `-3Hz` | `-2%` to `-4%` | Gravitas, impending doom, urgent historical consequence | Battles, collapses, catastrophes, high-stakes dilemmas |
| **`documentary-calm`** | `-1Hz` | `-1%` to `0%` | Authoritative, measured, crystal-clear documentary narration | Ancient empires, architecture, archaeology, deep dives |
| **`viral-energetic`** | `+1Hz` to `+2Hz` | `+3%` to `+5%` | Punchy vocal fry, high momentum, curiosity triggers | Quirky trivia, mind-bending paradoxes, absurd historical laws |

---

## 4. Cultural Accent-Topic Synergy

A voice must authentically match the cultural subtext of the narrative:

| Cultural Story Lore | Vocal Persona / Accent | Language Mode | Voice ID Example |
| :--- | :--- | :--- | :--- |
| **Philippine Folklore / Cryptids** | Filipino English Storyteller | Taglish / English | `fil-PH-AngeloNeural` / `fil-PH-BlessicaNeural` |
| **British / Victorian / Medieval** | BBC Documentary Historian | English (UK) | `en-GB-RyanNeural` |
| **Antiquity / Roman / Greek** | Classic Epic Narrator | English (US) | `en-US-ChristopherNeural` |
| **Bizarre Viral Trivia** | Casual Enthusiastic Host | English (US) | `en-US-GuyNeural` / `en-US-AriaNeural` |

---

## 5. Pure Node.js MP3/WAV Duration Parsing

Never depend on external system binaries (`ffprobe`) that fail in containerized or headless environments.

The bundled `scripts/prosody-tts.js` tool reads raw MPEG-1 Audio Layer 3 headers directly from buffer:
1. Skips ID3v2 metadata frames (`0x49 0x44 0x33`).
2. Scans for MP3 frame sync bytes (`0xFF 0xE0`).
3. Extracts bitrate index, sample rate index, and padding bits.
4. Calculates frame length: $\text{frameLength} = \lfloor \frac{144 \times \text{bitrate}}{\text{sampleRate}} \rfloor + \text{padding}$.
5. Accumulates sample frames ($1152\text{ samples/frame}$) to return the exact duration in milliseconds:
   $$\text{durationSeconds} = \frac{\text{totalSamples}}{\text{sampleRate}}$$

---

## 6. Execution Commands

```bash
# Synthesize eerie folklore audio with automatic prosody
node scripts/prosody-tts.js "If you smell sweet tobacco in an empty forest... do not look up." audio.mp3 --emotion spooky-suspense --voice fil-PH-AngeloNeural

# Synthesize punchy viral hook
node scripts/prosody-tts.js "Every single airplane pilot is forbidden from eating this one food—and the reason is terrifying." hook.mp3 --emotion viral-energetic --voice en-US-GuyNeural
```

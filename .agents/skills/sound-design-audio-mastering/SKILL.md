---
name: sound-design-audio-mastering
description: >-
  Direct and balance multi-track audio production for video automation.
  Handles voiceover normalization (-14 LUFS), acoustic prosody calibration,
  ambient bed dynamic ducking, whoosh transitions, and pure-Node duration calculation.
---

# Sound Design & Audio Mastering

This skill enforces broadcast-standard audio mixing, voice clarity, acoustic prosody calibration, and atmospheric sound immersion.

---

## 1. Loudness & Volume Standards

| Audio Channel | Target Level | Remotion Volume Parameter | Purpose |
|---|---|---|---|
| **Voiceover (Narrator / NPC)** | -14 LUFS / -1 dB True Peak | `volume={1.0}` | Punchy, crisp speech that cuts through on mobile speakers. |
| **Ambient Sound Bed** | -24 LUFS | `volume={0.16 - 0.22}` | Provides spatial depth without muddying voiceover clarity. |
| **Punctuation SFX (Whoosh/Gavel)** | -18 LUFS | `volume={0.40 - 0.50}` | Accents chapter transitions or sudden character entries. |
| **Speech Bubble Pop** | -20 LUFS | `volume={0.30 - 0.35}` | Comic feedback when an NPC speech bubble appears on screen. |

---

## 2. Dynamic Acoustic Matrix (Prosody Tuning)

Voiceover audio is dynamically shaped per scene mood using acoustic parameters (`--pitch` and `--rate`):

| Emotion Preset | Pitch Adjustment | Rate / Speed | Use Case |
|---|---|---|---|
| `spooky-suspense` | `-4Hz` to `-6Hz` | `-5%` to `-6%` | Dark folklore, Kapre, Aswang, horror mysteries |
| `intense-drama` | `-2Hz` to `-3Hz` | `-2%` to `-4%` | Cataclysms, battles, severe warnings |
| `documentary-calm` | `-1Hz` | `-1%` to `0%` | History, engineering, artifacts |
| `viral-energetic` | `+1Hz` to `+2Hz` | `+3%` to `+5%` | Quirky trivia, viral hooks, absurd facts |

### Final Scene Loop Slowdown:
The final scene of a Short applies an additional **-2% speed drop** and lingering trailing cadence to allow the audio to bridge cleanly into the first scene loop without sudden truncation.

---

## 3. Pure Node.js Audio Duration Calculation

Never rely solely on external binary utilities (`ffprobe`). The pipeline uses `parseAudioDuration()` in `scripts/tts.mjs`:
- Inspects MPEG Layer 3 sync frames (`0xFFE0`) and sample rates (44.1kHz, 48kHz).
- Skips ID3v2 metadata tags automatically.
- Computes exact duration in milliseconds:
  $$\text{duration} = \frac{\text{totalSamples}}{\text{sampleRate}}$$
- Falls back to `ffprobe` or byte-rate estimation ($8\text{ KB/sec}$) only if binary headers are corrupted.

---

## 4. Atmospheric Sound Bed Library

- `public/audio/ambient/gladiator-barracks.wav`: Low stone reverberation, iron chains, sparring thuds.
- `public/audio/ambient/roman-forum.wav`: Distant crowd chatter, stone footsteps, market vendors.
- `public/audio/ambient/medieval-monastery.wav`: Gregorian undertones, echoing vaulted ceilings, feather quill scratch.
- `public/audio/ambient/egyptian-nile.wav`: Desert breeze, water lap, wooden mallet striking sandstone.

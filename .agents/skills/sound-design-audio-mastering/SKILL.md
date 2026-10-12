---
name: sound-design-audio-mastering
description: >-
  Direct and balance multi-track audio production for video automation.
  Handles voiceover normalization (-14 LUFS), ambient bed ducking,
  whoosh transitions, comic speech bubble pops, and historical atmosphere layers.
  Use when adjusting volume levels, adding sound effects, or mixing background audio.
---

# Sound Design & Audio Mastering

This skill enforces broadcast-standard audio mixing, voice clarity, and atmospheric sound immersion.

## Loudness & Volume Standards

| Audio Channel | Target Level | Remotion Volume Parameter | Purpose |
|---|---|---|---|
| **Voiceover (Narrator / NPC)** | -14 LUFS / -1 dB True Peak | `volume={1.0}` | Punchy, crisp speech that cuts through on mobile speakers. |
| **Ambient Sound Bed** | -24 LUFS | `volume={0.20 - 0.25}` | Provides spatial depth (e.g. barracks murmurs, market bustle) without muddying voiceover. |
| **Punctuation SFX (Whoosh/Gavel)** | -18 LUFS | `volume={0.45 - 0.55}` | Accents chapter transitions or sudden character entries. |
| **Speech Bubble Pop** | -20 LUFS | `volume={0.35 - 0.40}` | Comic feedback when an NPC speech bubble appears on screen. |

## Dynamic Ducking Principle
- When a character is actively speaking, ambient audio beds must automatically duck to 18–22% volume.
- During narrative scene pauses (>0.8 seconds between dialogue lines), the ambient layer can rise to 32% to let the environment breathe.

## Sound Asset Reference Library
- `public/audio/ambient/gladiator-barracks.wav`: Low stone reverberation, iron chains, sparring thuds.
- `public/audio/ambient/roman-forum.wav`: Distant crowd chatter, stone footsteps, market vendors.
- `public/audio/ambient/medieval-monastery.wav`: Gregorian undertones, echoing vaulted ceilings, feather quill scratch.
- `public/audio/ambient/egyptian-nile.wav`: Desert breeze, water lap, wooden mallet striking sandstone.

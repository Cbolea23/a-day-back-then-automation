---
name: video-scriptwriting-ideation
description: >-
  Generate, polish, and structure video scripts with viral retention hooks,
  natural dialogue banter, 3-second pacing shifts, chapter timestamps, and
  voiceover files. Use when brainstorming topics, writing video scripts,
  or generating voiceover audio with Gemini/TTS.
---

# Video Scriptwriting & Ideation

This skill guides script creation, human-style dialogue generation, retention pacing, and voiceover synthesis.

## Script Architecture

### 1. Longform Architecture (8–12 Minutes)
- **Target:** 30–40 structured scenes (~12–16 seconds per scene).
- **Structure:**
  - Scene 1: Cold visual hook that immediately establishes personal stakes ("The crowd roars, but you don't feel like a hero...").
  - Chapters 1–7: Chronological or hour-by-hour deep dive into daily realities, strange rules, hygiene, diet, and combat.
  - Multi-character cameos: Periodic secondary character interventions (e.g. Grumpy Tenant, Drillmaster, Tavern Keeper, Doctor).
  - Wrap-up: Thought-provoking reflection and a comment question of the day.

### 2. Vertical Shorts Architecture (45–58 Seconds)
- **Target:** 4–6 punchy scenes (~8–12 seconds each).
- **Structure:**
  - Scene 1: Instant visual/audio contradiction or bold historical question.
  - Scene 2–4: Rapid escalation with specific prices, numbers, or absurd facts.
  - Scene 5: NPC cameo comedic or skeptical reaction.
  - Scene 6: Seamless loop back to the opening hook.

## CLI Commands

### Generate Script
```bash
# Longform script generation
node scripts/make-long-script.mjs <slug>

# Short script generation
node scripts/make-script.mjs <slug>
```

### Synthesize Voiceovers
```bash
node scripts/make-voice.mjs <slug> --dir long-out
```
*Note: Voiceover generator automatically uses Gemini TTS with era-appropriate emotional tone, natural conversational cadences, and skips already-voiced scenes for fast incremental updates.*

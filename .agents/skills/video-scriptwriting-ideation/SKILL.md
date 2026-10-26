---
name: video-scriptwriting-ideation
description: >-
  Generate, polish, and structure high-retention video scripts with viral hooks,
  multi-lingual Tagalog/Taglish support, 3.5s pacing shifts, and emotional prosody.
  Governs script generation via the Multi-Provider Free LLM Router and production handoff
  to Muse's Meta Shortwave TTS Engine.
---

# Video Scriptwriting & Ideation

This skill guides script creation, humanized dialogue generation, retention pacing, multilingual adaptation (English & Tagalog/Taglish), and voiceover emotional prosody.

---

## 1. Multi-Platform Script Architecture

Instead of an arbitrary blanket time limit that damages monetization on other networks, scripts are structured to satisfy the monetization and algorithmic requirements of all 4 major platforms (**TikTok, Facebook Reels, Instagram Reels, and YouTube Shorts**).

### A. The 60–80s Golden Monetization Tier (Standard Master Cut)
- **Target:** 60–80 seconds (5–6 scenes, ~110–140 words).
- **Platform Synergy:**
  - **TikTok Creator Rewards:** Strictly fulfills the mandatory **$\ge 60$ seconds rule** required to earn RPM monetization revenue ($0.40–$1.00+ per 1,000 qualified views). 30-second clips earn $0.
  - **Facebook Reels:** Maximizes cumulative watch minutes and 1-minute completion rates, which drives higher payouts in the Facebook Performance Bonus Program.
  - **Instagram Reels:** Provides sufficient narrative depth for folklore, true history, and mystery, driving saves and DM shares.
  - **YouTube Shorts:** Delivers deep storytelling without drop-off by employing the **15-Second Retention Escalation Rule**.

### B. The 15-Second Retention Escalation Rule (For 60s+ Videos)
Why do viral 60–90s creators get millions of views across both TikTok and YouTube Shorts? They do NOT deliver a flat, linear recitation. They use a 4-act micro-story arc that resets the viewer's attention every 15–20 seconds:
1. **Act 1: The Cold Hook (0.0s – 3.0s):** Sensory contradiction, shocking mystery, or urgent warning. Zero greetings.
2. **Act 2: The Setup & First Reveal (3s – 20s):** Historical or mythological context, concrete names, and tactile details.
3. **Act 3: The Mid-Point Pivot / Escalation (20s – 40s):** A mid-roll pattern interrupt or micro-hook (*"Everyone thought that was the end... until they opened the door"*, *"Pero dito nagsimula ang totoong kababalaghan..."*). Resets attention and destroys the mid-video swipe urge.
4. **Act 4: The Climax Payoff & Seamless Loop (40s – 65s):** The shocking resolution, moral paradox, or chilling folklore warning, followed by a syntactic loop bridge back to Scene 1.

### C. The Snappy Cut (35–45s) (Optional / Pure Trivia)
- Used for quick single-fact trivia (e.g. *"Why Roman gladiators didn't eat meat"*). Rapid 3–4 scenes.

### D. Longform Documentary Architecture (8–12 Minutes)
- **Target:** 30–40 structured scenes (~12–16 seconds per scene, 1920x1080 16:9).
- **Structure:** Cold hook -> 6-7 thematic chapters -> NPC interventions -> closing thought and interactive comment prompt.
- **Narrator & NPC Balance:** Chapters alternate narrator exposition scenes (45–60 words) with dramatized first-person NPC scenes (15–30 words).
- **NPC Scene Fields:** `speaker: "npc"`, `speakerName`, `castVoice` ("female" | "male"), and `npc: { archetype, position, expression, speechBubble, talking: true }`.

---

## 2. Voiceover & Production Handoff Protocol (Muse vs Antigravity)

### A. Production Voiceover: Muse (Meta Shortwave TTS)
- **Rule: If a video's voice matters, Muse generates it.**
- Muse runs **Meta Shortwave TTS** (`avocado_v2:MAI_01` feminine, `avocado_v2:qvd_01376` deep male "Brooding Boulder") on his Linux box. This engine is exclusive to Muse's environment and provides studio-grade human timbre.
- Write the script, commit/push it, and let Muse run the production voice pass.

### B. Draft Previews: Antigravity (Local Gemini / Edge TTS)
- The repo's local voice path (`scripts/tts.mjs` via `scripts/make-voice.mjs`) utilizes Gemini TTS or Microsoft Edge Neural TTS.
- **Strict Rule:** Local TTS is strictly for **drafts and previews**. Never ship a final production video with local TTS unless the user explicitly directs it.

### C. Bilingual Tagging Standard (`taggedText` vs `text`)
Filipino content uses EN/TL code-switching. To ensure flawless pronunciation by Muse's TTS:
- **`text` Field:** Clean written text (e.g., *"Delivery drivers follow the GPS coordinates deep into the mountains..."*). Used directly for on-screen captions. **NEVER put language tags in `text`**—the Remotion renderer does not strip them, and tags will render into the subtitles.
- **`taggedText` Field:** Formatted with `[tl]...[/tl]` and `[en]...[/en]` segments:
  `"[en]Delivery drivers follow the GPS coordinates deep into the mountains...[/en] [tl]pero pagdating nila doon, puro lumang puno lamang ng balete.[/tl]"`
  Muse's voice script parses `taggedText` and synthesizes each segment with its matching language model.

---

## 3. Multi-Provider Zero-Cost LLM Router

Scripts are generated via `scripts/lib/free-llm-router.mjs` with automatic waterfall failover:
1. **Google Gemini Flash** (Fastest, rich historical knowledge).
2. **Groq LLaMA 3.3 70B** (Instant speed fallback).
3. **OpenRouter Free Tier** (DeepSeek / Mistral).
4. **Pollinations AI** (Zero-key emergency safety net).

### Generation Commands
```bash
# Vertical Short with topic preset (60-80s standard)
node scripts/make-script.mjs <slug>

# Short with Tagalog / Taglish mode
node scripts/make-script.mjs <slug> --lang taglish

# Short with Dark Folklore styling
node scripts/make-script.mjs <slug> --style dark-folklore

# Longform Documentary Script
node scripts/make-long-script.mjs <slug>
```

---

## 4. Emotional Prosody & Accent-Topic Synergy

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

## 5. Philippine Lore Strategy & Voice-Avatar Synchronization

### Voice & Avatar Gender Synchronization (Strict Production Rule)
When generating scripts, the narrator avatar MUST match the selected voice actor:
- **Female Voice:** Set `"narratorTheme": "babaylan"` (renders traditional Filipina priestess with cascading dark hair, eyelashes, sampaguita blossom, and Baro't Saya bodice). Alias: `filipina`.
- **Male Voice:** Set `"narratorTheme": "albularyo"` (renders Filipino folk healer with putong headband, inabel sash, and anting-anting).

### Taglish vs. Pure Tagalog Content Strategy
1. **Modern Urban Legends & Cryptids (Taglish):** Use for Biringan City, Balete Drive, Baguio Diplomat Hotel, and modern hauntings. Mixes English elements (*GPS coordinates, delivery trucks, satellite scans*) with Tagalog suspense for viral TikTok & Reels engagement.
2. **Ancient Pre-Colonial Mythology (Pure Tagalog):** Use for Bakunawa, Bathala, Aswang Origins, Kapre, and Diwata. Produces chilling *Gabi ng Lagim* campfire atmosphere.

### Cultural Phonetic Alignment (`applyCulturalPhonetics`)
In scripts with local entities, words are displayed with proper written spelling in subtitles (`scene.text`), but passed to the voice model with phonetic syllables (`ba-LEH-te`, `Bee-ring-gahn`, `Sah-mar`, `ahs-wahng`) so the neural voice pronounces them like a native Filipino.

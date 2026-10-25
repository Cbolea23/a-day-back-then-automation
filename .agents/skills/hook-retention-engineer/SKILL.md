---
name: hook-retention-engineer
description: >-
  Architect and optimize viral YouTube Shorts, Reels, and Longform audience retention
  and follower-conversion curves. Enforces the 3.5-second pattern interrupt rule,
  the 6-word visual HookBanner rule, episodic series anchoring, silent 75%-climax
  Follow Micro-CTAs, and polarizing pinned comment triggers.
---

# Hook, Retention & Follower Conversion Engineer

This skill governs audience watch-time optimization, swipe-away prevention, and algorithmic follower conversion for vertical Shorts/Reels and widescreen documentaries.

---

## 1. The Zero-Fluff Cold Open & 6-Word Banner Rule

- **Spoken Hook (0.0s – 2.7s):** Never say "Welcome back", "In today's video", or "Hey guys". Start immediately with a sensory contradiction or urgent warning.
- **Visual HookBanner Rule (3–6 Words Max):**
  - The top on-screen `HookBanner` (`top: 165px`) MUST be condensed to **3–6 punchy words** (max 2 lines, `64px` font) via `formatCompactHook()`.
  - **Why:** If the full 16-word spoken sentence is placed inside the banner, the box expands downward to 7 lines and collides with the active `Captions` at `top: 830px`. Keeping the visual banner to 3–6 words guarantees **350+ pixels of clean visual breathing room** above the subtitles.

---

## 2. The 3.5-Second Pattern Interrupt Rule

The human brain drops attention after ~3.5 seconds of static stimuli. Every scene must trigger at least one sensory shift every 3–4 seconds:
1. Camera motion inversion (`push-in` switches to `pull-back` or `pan-left`).
2. Character reaction or gesture shift (`calm` ➔ `recoil` / `point`).
3. Subtle low-frequency scene transition whoosh (`public/sfx/transition-whoosh.wav` at `volume: 0.18`) layered over a continuous `-24 LUFS` ambient bed (`ambient-folklore-wind.wav` or `ambient-history-hearth.wav`).

---

## 3. The Follower Conversion Flywheel ("Easy to Get Followers")

Great views mean nothing if viewers scroll away without following. Use these 3 zero-friction follower triggers on every Short:

### A. Episodic Series Header (`seriesTag`)
Viewers rarely follow for a random isolated fact, but they instinctively follow a **named series** so they don't miss the next episode:
- Display a centered top safe-zone badge (`top: 66px, left: 50%`) combining the Series Tag and Channel Name:
  - `🇵🇭 PHILIPPINE DARK LORE • A DAY BACK THEN`
  - `🕯️ DARK FOLKLORE ARCHIVES • A DAY BACK THEN`
  - `🏛️ UNTOLD HISTORY ARCHIVES • A DAY BACK THEN`
- **Safe-Zone Rule:** Centering at `top: 66px` keeps the badge 100% clear of the top-left Mute icon and top-right Search (`🔍`) icon on Facebook Reels, Instagram Reels, and YouTube Shorts.

### B. Silent Animated "Follow" Micro-CTA at the 75% Climax Mark
- **Never speak "Like and subscribe"**—spoken outros trigger an instant 65% swipe-away drop.
- Instead, at **74%–80% of the total video timeline** (while the narrator is actively delivering the climax reveal), pop in a silent, 2.8-second spring-animated pill (`FollowMicroCTA`) at `top: 155px`:
  - Swinging notification bell `🔔` + **`FOLLOW A DAY BACK THEN — Don't miss tonight's next story`**.
  - Viewers tap Follow while still listening to the climax twist, preserving >100% loop retention.

### C. Polarizing "Debate" Pinned Comment (`pinnedComment`)
- Every generated script outputs a `pinnedComment` question designed to spark personal stories or friendly debate in the comments:
  - *Example (Folklore):* `"Naniniwala ka ba sa kwento ng Kapre? Anong gagawin mo kung makaamoy ka ng tabako sa dilim? 👇"`
  - *Example (History):* `"Be honest: how many hours would you survive working this job in Ancient Rome? 👇"`
- Pinning this comment immediately upon upload drives 3x–4x comment velocity, signaling the algorithm to push the Reel/Short to broader cold audiences.

---

## 4. The Seamless Loop Bridge
- The final scene applies a `-2%` to `-4%` prosody slowdown and syntactically flows back into Scene 1's opening hook without a silent gap or outro screen.

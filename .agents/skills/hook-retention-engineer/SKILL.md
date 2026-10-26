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

### B. Silent Animated "Follow" Micro-CTA (Dual-Window System)
- **Never speak "Like and subscribe"**—spoken outros trigger an instant 65% swipe-away drop.
- Instead, use the **Dual-Window System** via `FollowMicroCTA` at `top: 155px`:
  1. **Climax Window (~70% timeline, 5.0 seconds):** While the narrator delivers the climax twist, pop in the animated pill (`🔔 FOLLOW A DAY BACK THEN — Don't miss tonight's next story`). Viewers tap follow while engaged in the climax.
  2. **Outro Loop Window (Final 3.5 seconds until video end):** Reappears prominently with an active swinging 🔔 animation as the video approaches the final frame. Viewers watching the ending see the follow prompt right before deciding whether to loop or swipe away.

### C. Polarizing "Debate" Pinned Comment (`pinnedComment`)
- Every generated script outputs a `pinnedComment` question designed to spark personal stories or friendly debate in the comments:
  - *Example (Folklore):* `"Naniniwala ka ba sa kwento ng Kapre? Anong gagawin mo kung makaamoy ka ng tabako sa dilim? 👇"`
  - *Example (History):* `"Be honest: how many hours would you survive working this job in Ancient Rome? 👇"`
- Pinning this comment immediately upon upload drives 3x–4x comment velocity, signaling the algorithm to push the Reel/Short to broader cold audiences.

---

## 4. The Seamless Loop Bridge
- The final scene applies a `-2%` to `-4%` prosody slowdown and syntactically flows back into Scene 1's opening hook without a silent gap or outro screen.

---

## 5. High-CTR Curiosity-Gap Titles (Anti-Boring Title Standard)

- **BANNED (Encyclopedia Titles):**
  - ❌ *"The Truth About Plague Doctors #shorts"*
  - ❌ *"The Witch Finder General #shorts"*
  - ❌ *"Vlad the Impaler: The Real Dracula #shorts"*
- **MANDATORY (Curiosity-Gap Titles):**
  - Use high-stakes contradiction, visual intrigue, or urgent disbelief:
  - ✅ *"Why plague doctors packed their bird beaks with dried flowers #shorts"*
  - ✅ *"The brutal test that proved you were a witch in 1645 #shorts"*
  - ✅ *"Why an Ottoman Sultan threw up when he saw 20,000 stakes #shorts"*
  - ✅ *"Why ancient Celts dressed as demons on Oct 31 (Not for candy) #shorts"*
- Titles must open an irresistible loop that can only be answered by watching the video.

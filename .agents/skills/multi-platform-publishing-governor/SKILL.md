---
name: multi-platform-publishing-governor
description: >-
  Strict execution governor for social publishing, API rate limits, error diagnosis,
  and quota validation. Enforces zero-assumption verification, bans speculative recovery
  estimates, isolates blocked platforms, and governs supported publishing platforms (YouTube, Facebook Reels, and Instagram Reels).
---

# Multi-Platform Publishing Governor & Reliability Protocol

This skill enforces strict, unbending rules on all social media upload, scheduling, error reporting, and platform communication across YouTube, TikTok, Facebook Reels, and Instagram Reels.

---

## 1. Supported Platform Scope & Monetization Matrix

Each platform has completely different algorithmic physics and monetization thresholds. Never force one platform's constraints onto another:

| Platform | Optimal Duration | Monetization Threshold | Posting Cadence | Primary Algorithmic Metric | Optimal Release Window |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TikTok** | **60–80s** | **Strictly $\ge 60$s** (Creator Rewards) | 1–2 per day | Hook (0–2s) & 100% Completion | 12:00 PM & 7:00 PM Local / US |
| **Facebook Reels** | **60–90s** | Maximize 1-min+ watch time | **Strictly 3 per day** | Cumulative Watch Minutes & Shares | **12:00, 18:30, 21:00 PHT** |
| **Instagram Reels** | **50–75s** | High shares / saves | 1 per day | Saves, Sends (DMs), Comments | 6:00 PM – 9:00 PM PHT |
| **YouTube Shorts** | **60–75s (3-Act) or 35–45s** | Shorts Ad Pool (any length) | **Strictly 1 per 24h** | Average Percentage Viewed (APV) | **23:00 UTC (7:00 PM EST)** |

- **ACTIVE & APPROVED PLATFORMS (PC-SIDE PUBLISHING):**
  - **YouTube:** Primary focus for Shorts (vertical 1080x1920) and Longform (1920x1080).
  - **Instagram:** Active focus for Reels (`@adaybackthenofficial`).
  - **Facebook:** Active focus for Page Reels (`A Day Back Then`).
  - *Publishing Authority:* All platform tokens (`client_secret.json`, `youtube-tokens.json`, `facebook-tokens.json`) exist solely on the PC. Antigravity executes all scheduling and publishing. Muse delivers finished renders + copy to the user; Muse never uploads or schedules from his box.
- **PROHIBITED PLATFORMS (FOR API):**
  - **TikTok:** Developer API is unapproved. Direct desktop API uploads are prohibited; manual uploads or approved desktop clients must be used for TikTok.

### 1.1 Platform Split & Distribution Rules (Consolidated Oct 26, 2026)

- **YouTube:** Everything goes here. **Full longforms are YouTube-exclusive** — never post a full longform to Facebook or Instagram.
- **Facebook:** Short-form only (Reels + longform cut-downs), packaged for the Filipino audience (see Section 3.D).
- **Instagram:** Unchanged — mirrors YouTube shorts as before.
- **Pipeline Artifacts:** The `.facebook.txt` files generated alongside longform renders by `build-long.mjs` are pipeline artifacts. Ignore them; they are not posting instructions.
- **Thumbnails & Copy:** Thumbnails and copy arrive with the videos in the Google Drive handover package from Muse. Antigravity schedules what is in the package; do not generate or replace thumbnails locally.
- **Review Gate:** Nothing gets scheduled on any platform without Christian's review and go-ahead first. Finished videos come to him through the Drive handover folder; schedule only what he approves.

---

## 2. Zero-Speculation & Fact-Checking Standard

When diagnosing failures, errors, or delays, the agent must adhere to these absolute rules:

### A. Never Invent or Promise Recovery Dates
- **RULE:** Never state "the restriction will lift tomorrow", "it will clear on Friday", or "it is a 24-hour block" unless an official API response or dashboard explicitly returns an exact timestamp (e.g. `restriction_expires_at: 1792...`).
- **WHY:** Automated anti-spam algorithms (such as Meta's Sentry System) use variable, opaque velocity scoring. Speculating on timers leads to user frustration, wasted ad money, and repeated failed attempts that reset penalties.

### B. Every Claim Must Have Direct Evidence
- Before claiming a post was uploaded or scheduled, verify its `status_code === "FINISHED"` and retrieve its permanent live URL or media ID.
- Before reporting an API status, inspect the exact JSON response and error subcode.
- If a server response is `IN_PROGRESS` or pending, report it as **PENDING**, never as "succeeded".

### C. Prohibition on Hallucinated Autonomous Execution (Discord & Daemons)
- **ZERO HALLUCINATED ACTIONS:** Background listener daemons and AI bots must NEVER tell the owner or teammates that an action was executed (e.g. "Scheduled", "Rendered", "Grid running as planned", "Shutting down laptop") unless the underlying script or system command actually ran, finished with exit code 0, and produced verifiable links/IDs.
- If an instruction is received via Discord or chat that requires terminal execution, the agent or daemon must state **"Directive logged — queuing execution"** and only report completion after the real process finishes with verified proof.

### D. Distinguish UI Checkpoints from API Sentry Blocks
- **Web UI Checkpoint:** Resolved via browser login or mobile authorization.
- **API Sentry Feature Ban:** A developer-level velocity block on specific endpoints (like `/video_reels`). Passing a web checkpoint DOES NOT mean the developer API is unblocked. Do not conflate the two.

---

## 3. Platform-Specific Rate Limit & Scheduling Protocol

### A. The "Do Not Poke" Mandate
- When any platform returns a spam/velocity limit (e.g. Meta Code 368, Subcode 1390008, or YouTube `uploadLimitExceeded`):
  1. Immediately log the exact error payload.
  2. Stop all automated retry loops immediately.
  3. **DO NOT run test scripts against the failing endpoint.** Every failed request registers as suspicious traffic and resets the cooldown counter.
  4. Pivot execution 100% to clean, working platforms.

### B. YouTube Quota, Cadence & Anti-Cannibalization Protocol
- **Strict Cadence (1 Short Per 24 Hours Max):**
  - **NEVER** schedule or publish multiple Shorts in the same 24-hour cycle on a growing channel.
  - YouTube's recommendation engine requires 18–36 hours to test a Short's retention curve with seed audiences. Stacking multiple Shorts cannibalizes impression quotas, resetting the algorithm's testing phase and stalling views across all videos.
  - Minimum spacing between consecutive YouTube Shorts: **strictly 24 hours**.
- **Optimal Release Time Mandate:**
  - Standard release window: **23:00 UTC (7:00 AM Manila Time / 7:00 PM US Eastern)**.
  - Never drop Shorts at off-peak hours (e.g. 05:00 UTC / 1:00 AM US) where the primary English-speaking audience is asleep.
- **Anti-Duplication Metadata Gate & Clean Copy Rule:**
  - Never use repetitive boilerplate descriptions across consecutive uploads. Every description must contain unique narrative context.
  - **STRICT RULE: NO EMOJIS IN DESCRIPTIONS.** Descriptions must be clean, professional narrative text.
- **YouTube API Quota:**
  - YouTube Data API operates on a daily quota of 10,000 units (~1,600 units per video upload). Daily quota resets strictly at midnight Pacific Time (15:00 Manila Time / UTC+8).

### C. Instagram Upload Protocol
- Always pre-process vertical video with `ffmpeg` using `-movflags +faststart`, standard `yuv420p`, and max 1080x1920 to prevent Meta container processing timeouts.
- Follow the two-phase handshake:
  1. Create container (`POST /me/media`).
  2. Resumable upload bytes.
  3. Poll container until `status_code === "FINISHED"`.
  4. Call `POST /me/media_publish`.
  - If container remains `IN_PROGRESS` after 240 seconds, abort cleanly and alert without spamming new containers.
- **Clean Copy Rule: NO EMOJIS IN DESCRIPTIONS.**

### D. Facebook Reels Protocol & Pinoy Audience Packaging (Consolidated Oct 26, 2026)
- **Target Audience:** The Facebook Page audience is predominantly Filipino. Tagalog packaging massively outperforms English (e.g. 952 views + follow vs 70 views). All Facebook publishing is strictly optimized for this audience.
- **Philippine Prime Windows (Asia/Manila - 3 per day):**
  - **12:00 PHT:** Lunch-break scroll.
  - **18:30 PHT:** Commute / dinner scroll.
  - **21:00 PHT:** Prime time & Horror Slot (reserve the creepiest, highest-retention piece of the day for this slot).
  - *Cadence:* Strictly 3 per day anchored to these fixed windows daily.
- **Packaging Standard (Tagalog First, Philippines-Focused):**
  - **Title and first caption line in Tagalog**, always — including global topics (Vlad, Plague Doctors, European horror). The audience is Pinoy even when the story isn't.
  - **CTA line in Tagalog too** ("Ikwento mo sa comments", "Makakauwi ka pa kaya?"). Never switch to English mid-caption.
  - **Hashtags: Philippines-focused only.** The generic set (`#history #ancienthistory #historyfacts #reels`) is strictly RETIRED on Facebook. Build 5–8 tags per post:
    - 1 topic tag — the creature/place/story (`#Biringan`, `#Bakunawa`, `#Manananggal`, `#Aswang`)
    - 2–3 Pinoy identity tags — `#KwentongPinoy #PinoyHorror #PhilippineMythology` (rotate `#Alamat #KwentongBayan #PinoyFolklore`)
    - 1 place tag when the story has one (`#Samar`, `#Cebu`, `#Bicol`)
    - `#ADayBackThen` strictly last
  - *Example Format (Clean Copy, Zero Emojis):*
    > HUWAG KANG SASAKAY PAPUNTANG BIRINGAN CITY
    >
    > Taon-taon sa kabundukan ng Samar... may mga multi-million-peso orders for luxury cars and heavy machinery na dumarating sa isang lugar called Biringan City.
    >
    > Makakauwi ka pa kaya kung ikaw ang makarating doon? Ikwento mo sa comments.
    > Follow A Day Back Then para sa araw-araw na kwentong kasaysayan.
    >
    > #Biringan #KwentongPinoy #PinoyHorror #PhilippineMythology #Alamat #Samar #ADayBackThen
  - **STRICT RULE: ZERO EMOJIS IN DESCRIPTIONS.**
- **Queue Priority:**
  1. **Filipino topics go first:** Philippine Dark Lore, myths, Pinoy horror/history take priority in the queue, especially the 21:00 prime slot.
  2. **Global horror/history fills remaining slots** with Tagalog packaging per above.
  3. **Longform cut-downs:** 60–90s clips delivered by Muse from YouTube longforms are scheduled into the 21:00 slot a few days after the YouTube premiere, with Tagalog copy pointing to the full YouTube video.
- **API Safety:**
  - Maintain at least a 5–10 second delay between API calls during batch runs to prevent Meta Sentry velocity flags.

---

## 4. Outcome Verification Checklist

Before reporting completion to the user:
- [ ] Has the video file been verified for correct dimensions (1080x1920 vertical for Shorts/Reels, 1920x1080 for Longform)?
- [ ] For TikTok & Facebook, does the master video reach the $\ge 60$s threshold for monetization eligibility?
- [ ] For YouTube, is the Short either paced with the 15-second retention escalation rule OR under 45s?
- [ ] For Facebook Reels, is the release anchored to one of the 3 Philippine Prime Windows (12:00, 18:30, 21:00 PHT)?
- [ ] For Facebook Reels, is the title, first caption line, and CTA in Tagalog with zero emojis?
- [ ] For Facebook Reels, are the hashtags Philippines-focused (5–8 tags ending with `#ADayBackThen`, generic tags retired)?
- [ ] Has the file size passed quality gates (minimum $\ge 22$ MB for full visual gradients, under 100 MB for fast ingestion)?
- [ ] Has the 24-hour cadence gap been respected for YouTube to prevent algorithmic cannibalization?
- [ ] Has the clean copy rule been enforced (**zero emojis in descriptions** across all platforms)?
- [ ] Is the live watch URL confirmed via API?
- [ ] Has local tracking (`published-urls.json`, `published-urls-facebook.json`, and `cross-platform-schedule-queue.json`) been updated?
- [ ] If an error occurred, is the exact error code, subcode, and raw message displayed without sugarcoating?

---

## 5. The Gate (Mandatory Approval Before Scheduling)

Nothing gets scheduled on ANY platform without Christian's explicit review and go-ahead first. Finished videos come to him through the Drive handover folder; schedule only what he explicitly approves.

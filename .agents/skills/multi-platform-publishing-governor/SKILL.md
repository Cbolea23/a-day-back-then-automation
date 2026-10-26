---
name: multi-platform-publishing-governor
description: >-
  Strict execution governor for social publishing, API rate limits, error diagnosis,
  and quota validation. Enforces zero-assumption verification, bans speculative recovery
  estimates, isolates blocked platforms, and strictly enforces supported platforms (YouTube & Instagram only).
---

# Multi-Platform Publishing Governor & Reliability Protocol

This skill enforces strict, unbending rules on all social media upload, scheduling, error reporting, and platform communication across YouTube, TikTok, Facebook Reels, and Instagram Reels.

---

## 1. Supported Platform Scope & Monetization Matrix

Each platform has completely different algorithmic physics and monetization thresholds. Never force one platform's constraints onto another:

| Platform | Optimal Duration | Monetization Threshold | Posting Cadence | Primary Algorithmic Metric | Optimal Release Window |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TikTok** | **60–80s** | **Strictly $\ge 60$s** (Creator Rewards) | 1–2 per day | Hook (0–2s) & 100% Completion | 12:00 PM & 7:00 PM Local / US |
| **Facebook Reels** | **60–90s** | Maximize 1-min+ watch time | 1–3 per day | Cumulative Watch Minutes & Shares | 11:00 AM & 6:00 PM PHT |
| **Instagram Reels** | **50–75s** | High shares / saves | 1 per day | Saves, Sends (DMs), Comments | 6:00 PM – 9:00 PM PHT |
| **YouTube Shorts** | **60–75s (3-Act) or 35–45s** | Shorts Ad Pool (any length) | **Strictly 1 per 24h** | Average Percentage Viewed (APV) | **23:00 UTC (7:00 PM EST)** |

- **ACTIVE & APPROVED PLATFORMS:**
  - **YouTube:** Primary focus for Shorts (vertical 1080x1920) and Longform (1920x1080).
  - **Instagram:** Active focus for Reels (`@adaybackthenofficial`).
  - **Facebook:** Active focus for Page Reels (`A Day Back Then`).
- **PROHIBITED PLATFORMS (FOR API):**
  - **TikTok:** Developer API is unapproved. Direct desktop API uploads are prohibited; manual uploads or approved desktop clients must be used for TikTok.

---

## 2. Zero-Speculation & Fact-Checking Standard

When diagnosing failures, errors, or delays, the agent must adhere to these absolute rules:

### A. Never Invent or Promise Recovery Dates
- **RULE:** Never state "the restriction will lift tomorrow", "it will clear on Friday", or "it is a 24-hour block" unless an official API response or dashboard explicitly returns an exact timestamp (e.g. `restriction_expires_at: 1792...`).
- **WHY:** Automated anti-spam algorithms (such as Meta's Sentry System) use variable, opaque velocity scoring. Speculating on timers leads to user frustration, wasted ad money, and repeated failed attempts that reset penalties.

### B. Every Claim Must Have Direct Evidence
- Before claiming a post was uploaded, verify its `status_code === "FINISHED"` and retrieve its permanent live URL or media ID.
- Before reporting an API status, inspect the exact JSON response and error subcode.
- If a server response is `IN_PROGRESS` or pending, report it as **PENDING**, never as "succeeded".

### C. Distinguish UI Checkpoints from API Sentry Blocks
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
- **Anti-Duplication Metadata Gate:**
  - Never use repetitive boilerplate descriptions across consecutive uploads (e.g., identical "Would you have survived... Subscribe for daily history" strings). YouTube filters flag identical descriptions as repetitive/auto-generated spam. Every description must contain unique historical narrative context.
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

### D. Facebook Reels Protocol
- Facebook Reels allows up to 90 seconds. 60–80s videos maximize watch minutes for the Performance Bonus Program.
- Stagger scheduled posts across distinct dayparts (e.g. 11:00 AM & 6:00 PM PHT) with minimum 6–8 hours of separation.

---

## 4. Outcome Verification Checklist

Before reporting completion to the user:
- [ ] Has the video file been verified for correct dimensions (1080x1920 vertical for Shorts/Reels)?
- [ ] For TikTok & Facebook, does the master video reach the $\ge 60$s threshold for monetization eligibility?
- [ ] For YouTube, is the Short either paced with the 15-second retention escalation rule OR under 45s?
- [ ] Has the file size passed quality gates (minimum $\ge 22$ MB for full visual gradients, under 100 MB for fast ingestion)?
- [ ] Has the 24-hour cadence gap been respected for YouTube to prevent algorithmic cannibalization?
- [ ] Is the live watch URL confirmed via API?
- [ ] Has local tracking (`published-urls.json`, `published-urls-facebook.json`, and `cross-platform-schedule-queue.json`) been updated?
- [ ] If an error occurred, is the exact error code, subcode, and raw message displayed without sugarcoating?

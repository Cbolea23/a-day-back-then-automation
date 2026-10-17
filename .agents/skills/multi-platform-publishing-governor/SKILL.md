---
name: multi-platform-publishing-governor
description: >-
  Strict execution governor for social publishing, API rate limits, error diagnosis,
  and quota validation. Enforces zero-assumption verification, bans speculative recovery
  estimates, isolates blocked platforms, and strictly enforces supported platforms (YouTube & Instagram only).
---

# Multi-Platform Publishing Governor & Reliability Protocol

This skill enforces strict, unbending rules on all social media upload, scheduling, error reporting, and platform communication. It exists to prevent misleading advice, ensure financial and channel safety, and protect operational momentum.

---

## 1. Supported Platform Scope (STRICT RULE)

- **ACTIVE & APPROVED PLATFORMS:**
  - **YouTube:** Primary focus for Shorts (vertical 1080x1920) and Longform (1920x1080).
  - **Instagram:** Active focus for Reels (`@adaybackthenofficial`).
- **FORBIDDEN / SUSPENDED PLATFORMS:**
  - **Facebook:** **HARD FREEZE.** Do NOT initiate API requests, do NOT attempt script uploads, do NOT test endpoints, and do NOT advise the user to perform manual upload tests unless explicitly requested.
  - **TikTok:** **PROHIBITED.** Developer API is unapproved. Never attempt uploads or claim TikTok automation is ready.

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

## 3. Rate Limit & Cooldown Execution Rules

### A. The "Do Not Poke" Mandate
- When any platform returns a spam/velocity limit (e.g. Meta Code 368, Subcode 1390008, or YouTube `uploadLimitExceeded`):
  1. Immediately log the exact error payload.
  2. Stop all automated retry loops immediately.
  3. **DO NOT run test scripts against the failing endpoint.** Every failed request registers as suspicious traffic and resets the cooldown counter.
  4. Pivot execution 100% to clean, working platforms (YouTube / Instagram).

### B. YouTube Quota Management
- YouTube Data API operates on a daily quota of 10,000 units (~1,600 units per video upload).
- Max safe uploads per 24 hours: 6 videos.
- Never upload more than 6 videos in a single calendar day unless a quota extension has been verified.
- YouTube daily quota resets strictly at midnight Pacific Time (15:00 Manila Time / UTC+8).

### C. Instagram Upload Protocol
- Always pre-process vertical video with `ffmpeg` using `-movflags +faststart`, standard `yuv420p`, and max 1080x1920 to prevent Meta container processing timeouts.
- Follow the two-phase handshake:
  1. Create container (`POST /me/media`).
  2. Resumable upload bytes.
  3. Poll container until `status_code === "FINISHED"`.
  4. Call `POST /me/media_publish`.
- If container remains `IN_PROGRESS` after 240 seconds, abort cleanly and alert without spamming new containers.

---

## 4. Outcome Verification Checklist

Before reporting completion to the user:
- [ ] Has the video file been verified for correct dimensions (1080x1920 vertical for Shorts/Reels)?
- [ ] Has the file size passed quality gates (minimum $\ge 22$ MB for full visual gradients, under 100 MB for fast ingestion)?
- [ ] Is the live watch URL confirmed via API?
- [ ] Has local tracking (`published-urls.json` and `cross-platform-schedule-queue.json`) been updated?
- [ ] If an error occurred, is the exact error code, subcode, and raw message displayed without sugarcoating?

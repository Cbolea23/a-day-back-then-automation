---
name: video-pipeline-database
description: >-
  Manage video vault storage, scheduling calendars, cross-platform metadata,
  and social publishing queues across YouTube, Facebook Reels, and Instagram Reels.
  Handles quota throttling, scheduled release slots, and database tracking.
  Full longforms are YouTube-exclusive; TikTok is prohibited for desktop API.
---

# Video Pipeline Database

This skill manages publishing calendars, video vault directories, and automated social uploading across platforms.

---

## 1. Directory & State Layout

- `out/2 - Unpublished Vault/`: Production-ready vertical Shorts/Reels (1080x1920) awaiting scheduled publication.
- `out/1 - Published/`: Archive of fully uploaded and published vertical Shorts/Reels.
- `out/Longform/2 - Unpublished Vault/`: Production-ready longform videos (1920x1080) with YouTube descriptions and chapter timestamps.
- `out/Longform/1 - Published/`: Archive of fully uploaded longform episodes.
- `published-urls.json`: Database mapping topic slugs to live YouTube and Instagram URLs for auto-backlinking.
- `published-urls-facebook.json`: Database mapping topic slugs to live Facebook Reel URLs.
- `cross-platform-schedule-queue.json`: Central calendar tracking scheduled releases across all active platforms.

---

## 2. Platform Scope & Rules (Consolidated Oct 26, 2026)

- **YouTube:**
  - Shorts: 1 per 24 hours max (23:00 UTC / 7:00 AM PHT).
  - Longform: Full episodes (1920x1080) are **YouTube-exclusive** (never post to Facebook or Instagram).
  - Quota: Daily limit ~10,000 units (~1,600 units per video upload), resets at midnight Pacific Time (15:00 PHT).
  - Zero emojis in descriptions.

- **Facebook Reels:**
  - Short-form only (vertical Reels + 60–90s longform cut-downs produced by Muse).
  - Anchored to 3 Philippine prime windows daily: **12:00, 18:30, and 21:00 PHT**.
  - Tagalog first packaging (title, first caption line, and CTA in Tagalog; 5–8 Philippines-focused hashtags; generic hashtags retired).
  - Pipeline `.facebook.txt` artifacts from `build-long.mjs` are ignored.
  - Zero emojis in descriptions.

- **Instagram Reels:**
  - Vertical Reels mirroring YouTube shorts (`@adaybackthenofficial`).
  - Upload via 2-phase container handshake (`POST /me/media` -> poll `status_code === "FINISHED"` -> `POST /me/media_publish`).
  - Pre-process vertical video with `-movflags +faststart` and `yuv420p`.
  - Zero emojis in descriptions.

- **The Gate:**
  - Nothing gets scheduled or published on any platform without Christian's prior review and approval.
  - Thumbnails and copy arrive in the Drive handover package from Muse.

- **Prohibited Platforms:**
  - TikTok: Developer API is unapproved; direct desktop API uploads are prohibited.

---

## 3. Vault & Inventory Audit

To check local vault inventory against published records:
```bash
node -e "
const fs = require('fs');
const published = JSON.parse(fs.readFileSync('published-urls.json', 'utf8'));
const vaultFiles = fs.existsSync('out/2 - Unpublished Vault') 
  ? fs.readdirSync('out/2 - Unpublished Vault').filter(f => f.endsWith('.mp4'))
  : [];
console.log('Published count:', Object.keys(published).length);
console.log('Unpublished vault queue:', vaultFiles.length);
"
```

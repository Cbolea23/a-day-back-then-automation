---
name: video-pipeline-database
description: >-
  Manage video vault storage, scheduling calendars, cross-platform metadata,
  and social publishing queues across YouTube and Instagram ONLY.
  Handles quota throttling, scheduled release slots, and database tracking.
  Facebook and TikTok are explicitly excluded.
---

# Video Pipeline Database

This skill manages publishing calendars, video vault directories, and automated social uploading across platforms.

---

## 1. Directory & State Layout

- `out/2 - Unpublished Vault/`: Production-ready vertical Shorts (1080x1920) awaiting scheduled publication.
- `out/1 - Published/`: Archive of fully uploaded and published vertical Shorts.
- `out/Longform/2 - Unpublished Vault/`: Production-ready longform videos (1920x1080) with YouTube descriptions and chapter timestamps.
- `out/Longform/1 - Published/`: Archive of fully uploaded longform episodes.
- `published-urls.json`: Database mapping topic slugs to live YouTube and Instagram URLs for auto-backlinking.

---

## 2. Platform Rules (YouTube & Instagram ONLY)

- **YouTube Data API:**
  - Daily quota (~10,000 units, ~1,600 units per video upload).
  - Maximum safe uploads: 6 videos per calendar day.
  - Quota resets at midnight Pacific Time (15:00 UTC+8).
- **Instagram Graph API:**
  - Upload via 2-phase container handshake (`POST /me/media` -> poll `status_code === "FINISHED"` -> `POST /me/media_publish`).
  - Pre-process vertical video with `-movflags +faststart` and `yuv420p`.
- **Excluded Platforms:**
  - Facebook: Hard freeze.
  - TikTok: Prohibited.

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

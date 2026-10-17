---
name: video-pipeline-database
description: >-
  Manage video vault storage, scheduling calendars, cross-platform metadata,
  and social publishing queues across YouTube and Instagram ONLY.
  Handles quota throttling, scheduled release slots, and database tracking.
  Facebook and TikTok are explicitly excluded.
  Use when scheduling videos, checking publishing status, or auditing the vault.
---

# Video Pipeline Database

This skill manages publishing calendars, video vault directories, and automated social uploading across platforms.

## Directory & State Layout

- `out/Longform/1 - Published/`: Archive of fully uploaded and published longform videos.
- `out/Longform/2 - Unpublished Vault/`: Production-ready longform videos, YouTube descriptions with chapter timestamps, and Facebook-tailored posts.
- `out/*.mp4`: Standalone vertical Shorts rendered and ready for distribution.
- `published-urls.json`: Database mapping topic slugs to live YouTube/Facebook URLs for auto-backlinking.
- `scripts/schedule-oct-remastered.mjs`: Dedicated batch scheduler with retry logic for quota limits.

## Scheduling Operations

### 1. Batch Scheduling
To trigger scheduled publishing across open slots:
```bash
node scripts/schedule-all.mjs
```
Or for specific batches (e.g. remastered dates):
```bash
node scripts/schedule-oct-remastered.mjs
```

### 2. Quota & Rate Limit Rules
- **YouTube Data API:** Daily upload quota (~6-10 videos/day on default quota). Returns `400 uploadLimitExceeded` when full; resets at midnight Pacific (15:00 UTC+8).
- **Facebook Graph API:** Enforces velocity spam cooldowns (Error `code 368`). Stagger requests with minimum 5-second delays between schedule API calls.
- **Safety Precaution:** Never delete scheduled posts in bulk without backing up post IDs.

### 3. Publishing Audit
To check local vault status against published inventory:
```bash
node -e "
const fs = require('fs');
const published = JSON.parse(fs.readFileSync('published-urls.json', 'utf8'));
const outFiles = fs.readdirSync('out').filter(f => f.endsWith('.mp4'));
console.log('Published count:', Object.keys(published).length);
console.log('Out queue count:', outFiles.length);
"
```

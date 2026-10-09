# A Day Back Then — Dashboard App (Future Plan)

> **Status:** 📋 Planning Only — Not yet implemented  
> **Created:** October 9, 2026

---

## Overview

Turn the existing CLI-based content automation pipeline into a visual web dashboard for managing the entire "A Day Back Then" content operation across YouTube, Facebook, TikTok, and Instagram.

---

## Current Architecture (CLI)

```
topics.json / topics-long.json
        ↓
scripts/make-script.mjs → scripts-out/<slug>.json
        ↓
scripts/make-voice.mjs  → public/audio/<slug>/
        ↓
scripts/build-video.mjs → out/2 - Unpublished Vault/<slug>.mp4
        ↓
scripts/upload-youtube.mjs   → YouTube
scripts/upload-facebook.mjs  → Facebook (Reels + Long-form)
scripts/upload-tiktok-queue.mjs → TikTok (Playwright)
scripts/upload-instagram.mjs → Instagram (Meta API)
```

All scripts are **ES module exports** with named functions — they can be wrapped in API routes directly.

---

## Proposed Dashboard Panels

| Panel | Description | Existing Script |
|---|---|---|
| 📅 Content Calendar | Visual grid of scheduled/published content across all platforms | `schedule-all.mjs` |
| 📦 Vault Manager | Browse unpublished vault, click-to-upload or schedule | Reads `out/2 - Unpublished Vault/` |
| 🎬 Script Generator | Form: pick topic → generate script + voiceover | `make-script.mjs`, `make-voice.mjs` |
| 🎥 Render Queue | Trigger Remotion renders, show progress | `build-video.mjs`, `build-long.mjs` |
| 🚀 Publisher | One-click publish to any platform with live status | All upload scripts |
| 📊 Analytics | Pull view counts from YouTube/Facebook APIs, show trends | New — YouTube Data API + Meta API |
| ⚙️ Settings | API tokens, daily limits, scheduling windows | Reads `*-tokens.json` files |

---

## Tech Stack Options

### Option A — Local Desktop App (Electron + React)
- **Pros:** Offline, direct filesystem access, native OS integration
- **Cons:** Heavier bundle, more setup
- **Best for:** Staying fully local, Windows-native experience

### Option B — Local Web App (Next.js) ⭐ Recommended
- **Pros:** Easiest to build, React (already used in Remotion), runs at `localhost:3000`
- **Cons:** Must be running to access
- **Best for:** Quick MVP, reuse existing React knowledge
- **Stack:** Next.js 14+ App Router, Tailwind CSS, shadcn/ui

### Option C — Hosted Web App (Vercel + Railway)
- **Pros:** Accessible from anywhere including phone
- **Cons:** Needs cloud storage (R2/S3), more complex deployment, costs
- **Best for:** Future scaling, team access

---

## Recommended MVP Stack (Option B)

```
Framework:    Next.js 14 (App Router)
UI:           Tailwind CSS + shadcn/ui
State:        JSON files (already in use) → SQLite later
Render Queue: BullMQ or simple file-based queue
Auth:         None (local only) or simple PIN
API Layer:    Next.js API Routes wrapping existing scripts
```

---

## MVP Feature Roadmap

### Phase 1 — Dashboard Shell
- [ ] Next.js project setup with Tailwind + shadcn/ui
- [ ] Vault Manager panel (list videos, show metadata)
- [ ] Published history panel (read from `published-urls-*.json`)

### Phase 2 — Publishing
- [ ] One-click upload to YouTube / Facebook / TikTok / Instagram
- [ ] Schedule picker with platform-specific time slots
- [ ] Upload progress indicator

### Phase 3 — Content Generation
- [ ] Topic browser (read from `topics.json` / `topics-long.json`)
- [ ] Script generator form (calls `make-script.mjs`)
- [ ] Voiceover generator (calls `make-voice.mjs`)
- [ ] Render trigger (calls `build-video.mjs`)

### Phase 4 — Analytics & Calendar
- [ ] YouTube Analytics API integration
- [ ] Facebook Insights API integration
- [ ] Content calendar with drag-and-drop scheduling
- [ ] Performance dashboard with charts

### Phase 5 — Polish
- [ ] Dark mode
- [ ] Mobile responsive layout
- [ ] Notification system (render complete, upload success/fail)
- [ ] SQLite migration for better querying

---

## Key API Routes Needed

```
POST /api/upload/youtube      → wraps upload-youtube.mjs
POST /api/upload/facebook     → wraps upload-facebook.mjs (Reels + Long)
POST /api/upload/tiktok       → wraps upload-tiktok-queue.mjs
POST /api/upload/instagram    → wraps upload-instagram.mjs
GET  /api/vault               → lists unpublished vault files
GET  /api/published           → reads published-urls-*.json
POST /api/generate/script     → wraps make-script.mjs
POST /api/generate/voice      → wraps make-voice.mjs
POST /api/render/short        → wraps build-video.mjs
POST /api/render/long         → wraps build-long.mjs
GET  /api/analytics/youtube   → YouTube Data API
GET  /api/analytics/facebook  → Meta Graph API insights
```

---

## Notes

- TikTok uses Playwright browser automation (no official API) — this means the dashboard server must run on the same machine with the `.tiktok-session/` directory
- Instagram requires the account to be linked to the Facebook Page (currently in 24h cooldown)
- Remotion renders are CPU-intensive — queue system prevents overlapping renders
- All tokens are stored locally in `*-tokens.json` files — no cloud secrets needed for local deployment

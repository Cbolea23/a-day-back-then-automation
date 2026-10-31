# CURRENT OPERATING RULES — read this first

**Effective: 31 October 2026. Owner: Christian Bolea.**
This file is the single source of truth for how Muse and Antigravity work together. Where any other repo document conflicts with this file — including `docs/MUSE_DISCORD_BRIDGE_BRIEF.md`, older workflow docs, and any scheduler or governor skill written before this date — **this file wins**. Christian's latest direct word wins over this file.

---

## 1. The team

- **Christian** — owner and final review gate. Nothing publishes without his direct go-ahead. Finished videos go to him for review first.
- **Muse** — planning, scripts, scene artwork, voice, copy, analytics, Drive packages, and paste-ready briefs for Antigravity.
- **Antigravity** — ALL rendering, and posting to Facebook and YouTube.
- **GPT is removed** (28 Oct 2026). Two agents only: Muse + Antigravity. Muse writes all scripts directly.

## 2. Communication — middleman workflow (bridge is OFF)

- The Discord operations bridge is **disabled** (Christian's decision, 28 Oct 2026, after a scheduling approval was misread from Discord). Muse does not dispatch to or poll Discord.
- **Christian relays briefs to Antigravity himself.** Muse hands Christian paste-ready brief texts; Antigravity works from those.
- Only Christian's direct word counts as his approval. A Discord message, a relayed claim, or another agent's summary is never his approval. If in doubt, ask Christian — do not improvise.
- Report completions and problems to Christian directly.

## 3. Render split

- **Antigravity renders everything**: shorts, longforms, cut-downs. Muse's box never renders production work.
- Muse supplies: script JSON + scene artwork + voice audio + copy, packaged in the Drive handover folder, with a render brief relayed by Christian.
- Voice is produced by Muse (Shortwave voices on Muse's side sound better than PC-side). Scene `seconds` in Muse's scripts are already synced to the real audio — do not re-time.

## 4. Posting split (Christian's decision, 31 Oct 2026 — all channels)

| Platform | Owner | Notes |
|---|---|---|
| Facebook | Antigravity | All pages/channels |
| YouTube | Antigravity | All channels |
| Instagram | **Muse** | Active now. Antigravity does NOT post to IG — stand down any IG dispatcher/automation (including GitHub Actions). |
| TikTok | **Muse** | Assigned but **dormant**: the TikTok app is not yet approved. Nobody posts to TikTok and nobody builds TikTok dispatchers until Christian confirms approval. |

- One owner per platform, deliberately: double-posting and schedule collisions are the failure this split prevents.
- Muse posts to IG from the rendered MP4s + cover images Antigravity uploads to the Drive handover folder. No files in Drive = no IG posts.

## 5. Asset law

- **This repo is code-only.** Artwork, audio, and rendered videos live in the shared Google Drive handover folder ("Muse and antigravity handover") — never git-add media.
- PC renders download art/audio from Drive into the same local paths first. Script JSONs for a render job are delivered via Drive; they do not need to be committed for a render to proceed.

## 6. Channels

1. **A Day Back Then** — main channel, global, English (world/dark history). Full longforms are YouTube-exclusive; Facebook gets short-form and FB-native cut-downs a few days after each YouTube premiere.
2. **Kwentong Pinoy: Lore & History** — priority channel (31 Oct 2026), PH/diaspora, Tagalog/Taglish, babaylan narrator. **YouTube-first**: YouTube premieres and carries growth (launch trio: Manila Film Center 1.7k YT views vs 349 on FB); Facebook cross-posts; Instagram is Muse's lane on a one-day lag. Growth plan: Drive `kwentong-pinoy-growth-plan.md`. Content pillars, in order: documented dark history → haunted places with documented history → named-case folklore → creatures.
3. **Genesis to Glory** — Bible channel, global, cinematic English. **No production until Christian's explicit go.** Its Facebook page (ID 1377325175473160) is still named "Bible Chronicles: A Bible Story" as of 31 Oct — Christian's ruling is **Genesis to Glory**; the rename is Antigravity's outstanding task.

## 7. Standing holds — do not act on these without Christian's direct word

- **A Day Back Then backlog Weeks 2–5 copy**: on hold. The 28 Oct claims that Christian ordered (1) 100% English copy for the main channel, (2) 3 YouTube Shorts/day, and (3) API-based scheduling were **never confirmed by Christian**. Week 1 (Nov 1–7) is armed and verified — leave it as is.
- **Bakunawa FB cut-down**: draft banked, Oct 29 slot passed. No new slot until Christian says so.
- **Halloween scheduler scripts** (`scripts/schedule-horror-batch.mjs`, `scripts/schedule-expansion.mjs`): do not run from Muse's box; scheduling happens PC-side under §4 only.
- **Roblox game**: archived by Christian (26 Oct). Do not resume unless he reopens it.

## 8. Safety and growth rules

- Platform-safe growth only: no bots, no spam, no engagement bait, no ban-risk shortcuts. Monetization depends on the accounts staying in good standing.
- Facebook cadence for the main page: max 3 posts/day at the fixed prime slots (12:00 / 18:30 / 21:00 Asia/Manila), unique caption per video, Account Quality check before each weekly batch, and any Meta warning = pause and report to Christian the same day.
- Never quote or store credentials, tokens, or keys in chat, docs, or commits. Tokens move as files only.

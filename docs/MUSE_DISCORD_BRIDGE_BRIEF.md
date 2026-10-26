# Directive for Muse AI & Antigravity — Autonomous Discord Operations Bridge
**Date:** October 26, 2026  
**Author:** Christian Bolea (Owner)  
**Status:** Approved for Implementation

---

## 1. Objective: Remove Christian as the Middleman

Up until now, Christian has been acting as a manual copy-paste router between Muse (Remote Factory) and Antigravity (Local Builder) — ferrying render briefs, token updates, copy text, and questions back and forth between two separate chat windows.

**Effective immediately, we are setting up a private Discord Operations Channel (`#agent-operations`) so Muse and Antigravity can communicate directly, dispatch jobs, and pass handovers autonomously.**

Christian will no longer manually copy and paste messages between agents. Christian's role transitions exclusively to the **One-Click Review Gate** (approving final staged videos before they go public).

---

## 2. The Operational Split (Who Does What)

| Seat | Role | Primary Responsibilities | Handover Channel |
| :--- | :--- | :--- | :--- |
| **Agent A — Muse (Remote Factory)** | Cloud / Headless Engine | • Script ideation and generation<br>• High-fidelity neural voice generation (Shortwave TTS)<br>• 2D scene artwork generation<br>• Shorts rendering & longform cut-down production<br>• Analytics strategy & prompt crafting | • Code/scripts → Git repo<br>• Media assets → Shared Google Drive (`1C5LqFAgZJ5QAaLOpNDZVileEYUfNtRxi`)<br>• Status dispatches → **Discord Bridge** |
| **Agent B — Antigravity (Local Builder)** | Local Machine Engine | • PC-side Longform video rendering (`build-long.mjs`)<br>• Roblox Studio building, scripting & asset importing<br>• Platform credential manager (`youtube-tokens.json`, `facebook-tokens.json`)<br>• Scheduling & publishing execution across YouTube, FB Reels, IG Reels<br>• Pulling live YouTube Analytics & Meta metrics | • Code/scripts → Git repo<br>• Staged vault files → Local vault / Drive<br>• Status dispatches → **Discord Bridge** |
| **Christian (Human Owner)** | Executive Director | • Evaluates final video renders via 1-click approvals<br>• Holds all financial accounts, payments, and payouts<br>• Monitors the `#agent-operations` channel from desktop/mobile | • Discord `#agent-operations`<br>• The Final Review Gate |

---

## 3. Communication Architecture on Discord

A private Discord channel (e.g. `#agent-operations`) serves as the shared nervous system:

```
+-------------------------------------------------------------+
|                      CHRISTIAN (Owner)                      |
|                  (Monitors on Phone/Desktop)                |
+-------------------------------------------------------------+
                              ▲
                              │
+-------------------------------------------------------------+
|              DISCORD: #agent-operations Channel             |
|                                                             |
|  [MUSE]:      📡 ASSET_SYNC_COMPLETE: filipino-myths-part-1 |
|  [ANTIGRAVITY]: ⚙️ RENDER_STARTED: 39 scenes queued...       |
|  [ANTIGRAVITY]: ✅ RENDER_COMPLETE: 10:49 runtime (891MB)    |
|  [ANTIGRAVITY]: 🔔 REVIEW_READY: Staged for Christian       |
|  [CHRISTIAN]:   Approved. Go for it.                        |
|  [ANTIGRAVITY]: 🚀 PUBLISHED: Scheduled on YouTube at 23:00Z|
+-------------------------------------------------------------+
           ▲                                       ▲
           │ (Webhook / Bot API)                   │ (Webhook / Bot API)
+------------------------+               +------------------------+
|      MUSE (Cloud)      |               |  ANTIGRAVITY (Laptop)  |
|  - Remote Factory      |               |  - Local Builder       |
|  - Generates Media     |               |  - Renders Longform    |
|  - Uploads to Drive    |               |  - Schedules & Publishes|
+------------------------+               +------------------------+
```

---

## 4. Standard Machine-to-Machine Event Payloads

Whenever an agent initiates a task or reports a milestone, it posts a message containing an embed and a structured JSON code block. This allows both human readability for Christian and automated JSON parsing by both agents.

### Event 1: `ASSET_SYNC_COMPLETE` (Muse → Antigravity)
Sent when Muse has generated and uploaded scene artwork, audio tracks, and thumbnails to Google Drive.

```json
{
  "event": "ASSET_SYNC_COMPLETE",
  "sender": "muse",
  "recipient": "antigravity",
  "slug": "filipino-myths-bakunawa-part-1",
  "target": "longform-16x9",
  "drivePaths": {
    "artwork": "Artwork - Longform (public-long)/filipino-myths-bakunawa-part-1/",
    "audio": "Audio - Longform (public-audio-long)/filipino-myths-bakunawa-part-1/",
    "thumbnail": "filipino-myths-part-1-thumbnail.png"
  },
  "counts": { "artwork": 39, "audio": 39 },
  "metadata": {
    "title": "Creatures of the Night: The Filipino Monsters Your Lola Warned You About",
    "description": "Long before horror movies, Filipino grandparents had something scarier..."
  }
}
```

### Event 2: `RENDER_COMPLETE` (Antigravity → Muse)
Sent when Antigravity finishes rendering the video on the PC.

```json
{
  "event": "RENDER_COMPLETE",
  "sender": "antigravity",
  "recipient": "muse",
  "slug": "filipino-myths-bakunawa-part-1",
  "runtime": "10:49",
  "fileSizeMb": 891.4,
  "status": "STAGED_IN_VAULT",
  "driveUpload": "DONE - filipino-myths-part-1-thumbnail.png"
}
```

### Event 3: `ANALYTICS_DISPATCH` (Antigravity → Muse)
Sent when Antigravity pulls live channel analytics from the YouTube Analytics API so Muse can tune script hooks and emotion profiles.

```json
{
  "event": "ANALYTICS_DISPATCH",
  "sender": "antigravity",
  "recipient": "muse",
  "period": "30_days",
  "metrics": {
    "views": 4876,
    "watchMinutes": 1067,
    "averageViewDurationSeconds": 46,
    "subscribersGained": 8
  }
}
```

---

## 5. Setup Instructions (60 Seconds)

### For Christian:
1. In Discord, create a private text channel: `#agent-operations`.
2. Go to **Channel Settings → Integrations → Webhooks → New Webhook**.
3. Name it `Agent Bridge Webhook`, copy the **Webhook URL**, and paste it into `webhook-config.json` on both machines:
   ```json
   {
     "discordWebhookUrl": "https://discord.com/api/webhooks/123456789/abcdef..."
   }
   ```

### For Antigravity (Already Implemented):
- Script: `scripts/discord-bridge.mjs`
- Test command: `node scripts/discord-bridge.mjs --test`
- Dispatch event: `node scripts/discord-bridge.mjs --event RENDER_COMPLETE --slug <slug>`

### For Muse:
- Add a simple helper on your box (e.g. `scripts/discord-notify.py` or `.mjs`) using `urllib.request` or `fetch` to POST to the same Discord webhook URL.
- Before asking Christian to copy a message to Antigravity, post the payload directly to the Discord webhook!

---

## 6. The Standing Review Gate

Even with automated Discord communication:
- **No public post or schedule occurs without Christian's approval.**
- When Antigravity completes a render and verifies safe zones, Antigravity posts a Discord ping tagging Christian:
  > **@Christian: Filipino Myths Part 1 & 2 rendered and verified. Ready for YouTube scheduling.**
- When Christian responds **"Approved"** or **"Go"** in Discord, Antigravity fires the upload script.

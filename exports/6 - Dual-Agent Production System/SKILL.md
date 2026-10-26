---
name: dual-agent-production-system
description: >-
  Run two AI agents as one production team under a single human owner. Assigns roles by
  where accounts, tokens, and apps physically live; coordinates work through a code repo,
  a shared media drive, and a live Discord operations bridge with background listener daemons;
  onboards fresh agent instances with context briefs; and enforces handover checklists,
  standing-permission fences, and owner review gates so agents never duplicate or publish unapproved work.
---

# Dual-Agent Production System

This skill turns two general-purpose AI agents into a coordinated production team with one human owner. It was distilled from a live operation running a multi-platform content channel, a game project, and a digital-products store with two agents and zero collisions.

---

## 1. The Core Idea

Two agents fail as a team for predictable reasons: both edit the same file, both assume the other did a step, one works from stale context, or one publishes something the owner never approved. The fix is not better prompting. The fix is an **operating contract**:

1. **Roles follow physics.** Each agent owns the work that must happen where it lives.
2. **Two channels, no exceptions.** Code travels through the git repo. Media travels through a shared drive folder.
3. **Live Discord nervous system.** Agents communicate directly via Discord webhooks and background daemons — eliminating the human copy-paste bottleneck.
4. **One checklist is the truth.** A single handover file in the repo records every asset's state. Chat is not state.
5. **Briefs, not memory.** Any agent instance starts cold. A written context brief is how it becomes a teammate in one read.
6. **The owner approves outward actions.** Nothing publishes, posts, or sells without the owner's explicit word.

---

## 2. The Three Seats

### The Owner (human)
Directs both agents, owns all accounts and payouts, approves anything public. Works in short instructions and expects them followed exactly. Can monitor and command both agents from phone or desktop in Discord.

### Agent A — The Factory (remote / headless environment)
Owns bulk generation and anything its unique tools do best:
- Asset generation in batches (images, models, audio, voice)
- Rendering and long-running jobs
- Dashboards, automation, monitoring
- Preparing copy and deliverables

The Factory never holds platform tokens and never publishes. It delivers files plus copy, together, for review.

### Agent B — The Builder (local, on the owner's machine)
Owns work inside the owner's apps and accounts:
- Building inside local applications (IDEs, game engines, design tools) via their local integrations
- Scheduling and publishing to platforms, using the tokens that live on that machine
- Anything requiring the owner's logged-in sessions

The Builder never re-generates what the Factory already made. If an input is missing, it reports the exact missing file instead of improvising a replacement.

---

## 3. Role Assignment Rule

Assign every task by asking: **where do the required accounts, tokens, files, and apps physically exist?**

| Task type | Owner | Why |
|---|---|---|
| Batch generation (art, voice, models) | Factory | Generation tools and compute live there |
| Long renders, scheduled jobs | Factory | Runs unattended, survives the owner's machine sleeping |
| In-app building (engine, editor, IDE) | Builder | The app is installed and logged in locally |
| Publishing / scheduling | Builder | Platform tokens exist only on the owner's machine |
| Accounts, payments, payouts | Owner only | Never delegated |
| Copy, docs, briefs | Either | Travels through the repo |

If a task spans both (a video that needs rendering, then scheduling), it is two tasks with a handover between them — never one task two agents "share".

---

## 4. The Two Channels

### Channel 1 — The repo (code only)
- Code, scripts, configuration, documents, prompt files, and checklists.
- Both agents pull before working and push finished work with clear commit messages.
- **Media never enters git.** No images, models, audio, or video — a repo carrying media grows by gigabytes and every pull becomes a punishment. (Measured in production: one content repo reached 7.7 GB / 2,700 media files before this law was enforced.)

### Channel 2 — The shared drive folder (all media)
- One shared folder both agents can reach. Finished outputs, artwork, models, textures, thumbnails.
- Mirror the repo's folder layout inside it so paths make sense on both sides (`Artwork - Shorts/<slug>/`, `Game Assets/<line>/`, finished videos at the root).
- A README inside the folder states the flow and the naming rules. Processed files get a `DONE - ` prefix so state is visible without asking anyone.
- Local working layouts stay identical on both machines (`assets/<slug>/...`) — only the sync channel changed, never the paths the tools read.

---

## 5. The Handover Checklist

One file in the repo (e.g. `HANDOVER.md`) is the shared source of truth for every deliverable:

```
Status key: TODO → IN PRODUCTION → READY (Factory) → IMPORTED / SCHEDULED (Builder)

| Asset | Status |
|---|---|
| Creature line: Bakunawa (3 stages, 12 animations) | READY — Drive: Game Assets/Bakunawa/ |
| Episode 12 render | READY — Drive: episode-12.mp4 + copy.txt |
| Episode 13 script | IN PRODUCTION |
```

Rules:
- Only the agent who performed the step updates the status.
- An asset is not "done" when it exists — it is done when the checklist says READY and the receiving agent can find the file at the recorded location.
- Announced counts must match delivered files exactly, everywhere (chat, checklist, drive). A mismatch is treated as a bug, not a rounding error.

---

## 6. Context Briefs (How a Cold Agent Becomes a Teammate)

Agent instances lose context. Never rely on an agent "remembering" the operation — write it down. Onboard any fresh instance with a brief containing exactly:

1. **The project** — what is being produced, for whom, where it publishes.
2. **The seats** — who does what, including the third parties and tools each side uses.
3. **The channels** — where code lives, where media lives, what never goes where.
4. **Hard rules** — the non-negotiables (approvals, freezes, naming/content rules), each stated as an instruction, not background.
5. **Specs** — formats, dimensions, naming conventions, templates the work must follow.
6. **Current state** — what is in production right now, what is blocked, what is parked. Dated. A brief without a current-state section is stale on arrival.
7. **Known hazards** — the specific scripts, files, or workflows that must not be run or touched, and why.

Maintenance rule: when the owner changes a standing decision (a freeze lifted, a role reassigned, a channel changed), the brief is updated the same day and re-issued. A brief that contradicts the owner's latest decision is worse than no brief — the agent will follow it confidently.

---

## 7. The Live Discord Operations Bridge (Executable Nervous System)

Instead of forcing the human owner to manually copy and paste instructions between agents, both agents plug directly into a private Discord channel (e.g. `#agent-operations`).

### The Architecture:
- **Discord Incoming Webhook:** Both agents use the webhook to post rich embedded status cards and machine-to-machine event blocks.
- **Discord Listener Daemon:** Agents run a 15-second polling loop (`scripts/discord-listener-daemon.js`) to read channel history via Bot Token and process inbound events without user relay.
- **Dual-Identity Human Owner:** The bridge recognizes the owner across multiple Discord accounts (e.g. laptop desktop user and mobile phone user) as the supreme authorizing authority.

### Bundled Executable Tools:
1. `scripts/discord-bridge.js`:
   - Send messages: `node scripts/discord-bridge.js --send "Status update"`
   - Dispatch M2M events: `node scripts/discord-bridge.js --event RENDER_COMPLETE --slug <slug>`
   - Poll history: `node scripts/discord-bridge.js --poll`
2. `scripts/discord-listener-daemon.js`:
   - Runs in background: continuously reads incoming dispatches and alerts the agent.
3. `webhook-config.template.json`:
   - Standardized config file storing `discordWebhookUrl`, `discordBotToken`, and `discordChannelId`.

### Standard Machine-to-Machine Events:
- `ASSET_SYNC_COMPLETE`: Factory informs Builder that scene art, voice tracks, and thumbnails are uploaded to Cloud Drive.
- `RENDER_REQUEST`: Factory triggers local Builder to assemble longform videos.
- `RENDER_COMPLETE`: Builder confirms render runtime, size, and staging in the vault.
- `REVIEW_READY`: Builder notifies the human owner that a video is ready for 1-click review.
- `PUBLISHED`: Builder confirms live release URLs and timestamps.
- `ANALYTICS_DISPATCH`: Builder reads live YouTube Analytics / Meta metrics and shares watch time curves with the Factory.

---

## 8. Standing-Permission Fences

Agents should not ask permission for every file — and must never exceed their fence. Define standing permissions as **scoped grants**:

- "You may commit and push inside `game/` without asking. Everywhere else, ask first."
- "Generate asset batches without confirmation. Publishing always requires my word."
- "Read anything. Writes outside your project folder are owner-approved only."

Every grant names a **scope** (folder, action type, platform) and everything outside the scope defaults to ask-first. When the owner grants the same exception twice, promote it into the fence and update the brief.

---

## 9. Review Gates and Delivery (The 1-Click Gate)

- Finished work is delivered to the owner **file plus copy together** — never copy alone while the file sits somewhere else.
- Delivery happens in Discord or chat. The owner reviews what was delivered, not what was promised.
- **Publishing, scheduling, and purchases happen ONLY on the owner's explicit go-ahead for that item** — a general "keep going" is not a publishing approval.
- When an asset is ready, the Builder pings the owner with a 1-click review prompt:
  > **@Owner:** Video rendered (10:49 runtime, 891MB). Verified safe zones and audio. Ready for YouTube scheduling.
- The owner simply types **"Approved"** or **"Go"**, and the Builder executes.

---

## 10. Collision and Failure Modes (and the Countermeasures)

| Failure | Cause | Countermeasure |
|---|---|---|
| Two versions of the same file | Both agents write the same path | One writer per path, declared in the brief; metadata lives in differently-named files |
| Agent works from stale rules | Brief not updated after an owner decision | Same-day brief updates; brief carries its date and current-state section |
| Duplicate production | Both agents start the same asset | The checklist is checked before starting; status IN PRODUCTION is a lock |
| "Done" that isn't | Agent reports from memory after an interruption | Verify from files/processes, never from memory; re-check after any restart |
| Silent scope creep | Agent "helpfully" starts next batch unasked | Fences: production momentum inside assigned scope is welcome; inventing new scope is not |
| Human copy-paste fatigue | Owner acts as manual relay between agents | Discord Operations Bridge (Section 7); agents post and read M2M events directly |
| Lost assets | Media committed to git, then history cleaned | Media law (Section 4) plus Drive mirror; repo is strictly code-only |

---

## 11. Daily Operating Rhythm

1. Owner issues short directives in Discord or chat; each agent confirms its queue against the checklist.
2. Factory runs batches unattended, deposits media in Drive, and fires `ASSET_SYNC_COMPLETE` into Discord.
3. Builder's daemon catches the event, imports/renders the asset, and marks the checklist.
4. Builder posts `REVIEW_READY` in Discord.
5. Owner reviews on phone or desktop with a 1-click "Approved".
6. Builder publishes, logs the live URL, and dispatches analytics back to the Factory.

---

## 12. Setting It Up (Checklist)

- [ ] Name the two agents' seats and write the role table for your operation
- [ ] Create the repo for code + the handover checklist file (`HANDOVER.md`)
- [ ] Create the shared drive folder for media; put the flow README inside it
- [ ] Create the private Discord channel (`#agent-operations`) and create a Webhook
- [ ] (Optional) Add a Bot Token for automated channel reading
- [ ] Fill out `webhook-config.json` on both machines using `webhook-config.template.json`
- [ ] Write the context brief from `templates/context-brief-template.md`
- [ ] Set the standing-permission fences in writing, inside the brief
- [ ] Launch `scripts/discord-listener-daemon.js` on the Builder machine
- [ ] Run one full cycle (produce → Discord dispatch → build/schedule → 1-click review)

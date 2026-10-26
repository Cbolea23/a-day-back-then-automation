---
name: dual-agent-production-system
description: >-
  Run two AI agents as one production team under a single human owner. Assigns roles by
  where accounts, tokens, and apps physically live; coordinates work through a code repo
  plus a shared media drive; onboards fresh agent instances with context briefs; and
  enforces handover checklists, standing-permission fences, and owner review gates so
  the agents never duplicate, overwrite, or publish without approval.
---

# Dual-Agent Production System

This skill turns two general-purpose AI agents into a coordinated production team with one human owner. It was distilled from a live operation running a multi-platform content channel, a game project, and a digital-products store with two agents and zero collisions.

---

## 1. The Core Idea

Two agents fail as a team for predictable reasons: both edit the same file, both assume the other did a step, one works from stale context, or one publishes something the owner never approved. The fix is not better prompting. The fix is an **operating contract**:

1. **Roles follow physics.** Each agent owns the work that must happen where it lives.
2. **Two channels, no exceptions.** Code travels through the git repo. Media travels through a shared drive folder.
3. **One checklist is the truth.** A single handover file in the repo records every asset's state. Chat is not state.
4. **Briefs, not memory.** Any agent instance starts cold. A written context brief is how it becomes a teammate in one read.
5. **The owner approves outward actions.** Nothing publishes, posts, or sells without the owner's explicit word.

## 2. The Three Seats

### The Owner (human)
Directs both agents, owns all accounts and payouts, approves anything public. Works in short instructions and expects them followed exactly.

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

Short, situation-specific instructions from the owner ride on top of the brief ("read the brief, and today specifically: ..."). The brief is the constitution; the owner's messages are the daily orders.

## 7. Standing-Permission Fences

Agents should not ask permission for every file — and must never exceed their fence. Define standing permissions as **scoped grants**:

- "You may commit and push inside `game/` without asking. Everywhere else, ask first."
- "Generate asset batches without confirmation. Publishing always requires my word."
- "Read anything. Writes outside your project folder are owner-approved only."

Every grant names a **scope** (folder, action type, platform) and everything outside the scope defaults to ask-first. When the owner grants the same exception twice, promote it into the fence and update the brief.

## 8. Review Gates and Delivery

- Finished work is delivered to the owner **file plus copy together** — never copy alone while the file sits somewhere else.
- Delivery happens in the conversation, even when the file also lands in the drive. The owner reviews what was delivered, not what was promised.
- Publishing, scheduling, and purchases happen only on the owner's explicit go-ahead for that item — a general "keep going" is not a publishing approval.
- Purchases of third-party tools or skills always require the owner's yes for that specific purchase, with the price stated first.

## 9. Collision and Failure Modes (and the Countermeasures)

| Failure | Cause | Countermeasure |
|---|---|---|
| Two versions of the same file | Both agents write the same path (e.g. metadata stubs overwriting production scripts) | One writer per path, declared in the brief; metadata lives in differently-named files |
| Agent works from stale rules | Brief not updated after an owner decision | Same-day brief updates; brief carries its date and the current-state section |
| Duplicate production | Both agents start the same asset | The checklist is checked before starting; status IN PRODUCTION is a lock |
| "Done" that isn't | Agent reports from memory after an interruption | Verify from files/processes, never from memory; re-check after any restart before reporting status |
| Silent scope creep | Agent "helpfully" starts the next batch unasked | Fences: production momentum inside the assigned scope is welcome; inventing new scope is not |
| Lost assets | Media committed to git, then history cleaned; or files only on one machine | Media law (Section 4) plus the drive mirror; the repo is never the only copy of media |

## 10. Daily Operating Rhythm

1. Owner issues short directives; each agent confirms its queue against the checklist.
2. Factory runs batches unattended and delivers file + copy for review.
3. Builder imports/schedules only READY items and marks the checklist as it goes.
4. Owner reviews in one pass; approvals are per-item and explicit.
5. Any standing decision that changes gets written into the brief and the checklist the same day.

## 11. Setting It Up (Checklist)

- [ ] Name the two agents' seats and write the role table for your operation
- [ ] Create the repo (or repo folder) for code + the handover checklist file
- [ ] Create the shared drive folder; put the flow README inside it
- [ ] Write the context brief from `templates/context-brief-template.md`
- [ ] Set the standing-permission fences in writing, inside the brief
- [ ] Issue the brief to both agents; have each confirm its queue against the checklist
- [ ] Run one full cycle (produce → handover → build/schedule → review) on a single small item before scaling

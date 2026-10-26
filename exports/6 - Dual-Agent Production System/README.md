# Dual-Agent Production System (v1.1)

**Run two AI agents as one production team — without collisions, duplicate work, or anything publishing behind your back.**

If you work with more than one AI agent (for example, one agent in the cloud and one inside the apps on your own machine), you have already hit the failure modes: both agents edit the same file, one works from last week's rules, an asset gets "delivered" that the other agent can't find, or something gets posted that you never approved.

This skill is the operating contract that fixes it, distilled from a live production operation (a multi-platform content channel, a game build, and a digital-products store, run daily by two agents under one owner):

- **Roles follow physics** — work is assigned by where accounts, tokens, files, and apps actually live: the remote agent is the Factory (batch generation, renders, automation), the local agent is the Builder (in-app work, scheduling, publishing), the human owns accounts, money, and approvals.
- **Two channels, no exceptions** — code travels through a git repo; media travels through a shared drive folder. Includes the media law that keeps a repo from ballooning to gigabytes of artwork.
- **Live Discord Operations Bridge** — zero-latency coordination hub where agents post machine events (`STATUS_SYNC`, `ASSET_SYNC_COMPLETE`, `BUILD_FINISHED`) via webhooks, run background polling daemons, and ping the human owner for 1-click approvals right on their phone.
- **One checklist is the truth** — a single handover file records every asset's state, killing duplicate production and "done" that isn't.
- **Briefs, not memory** — a complete context-brief template that turns any fresh agent instance into a teammate in one read, plus the maintenance rule that keeps briefs from going stale.
- **Standing-permission fences** — scoped grants so agents move fast inside their fence and always ask outside it.
- **Review gates** — finished work arrives file + copy together; nothing publishes without the owner's explicit, per-item go-ahead.

## What's included

- `SKILL.md` — the full system: seats, role-assignment rule, channels, Discord Operations Bridge, checklist discipline, briefs, fences, gates, failure-mode table, setup checklist
- `templates/context-brief-template.md` — fill-in brief for onboarding any new agent instance
- `templates/handover-checklist-template.md` — the shared source-of-truth file format
- `webhook-config.template.json` — credentials template for Discord Webhooks and Bot Read Tokens
- `scripts/discord-bridge.js` — zero-dependency Node.js CLI tool for sending M2M event dispatches and polling channel history
- `scripts/discord-listener-daemon.js` — background autonomous listener daemon that polls Discord and reacts to machine events in real time

## Who it's for

Solo creators and small teams running (or planning) two AI agents across a cloud environment and a local machine — content channels, indie game projects, small product studios, agency pods. If you have ever typed "no, the OTHER agent was supposed to do that," this is your fix.

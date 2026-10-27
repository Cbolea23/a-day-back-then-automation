# Web Deployment — Content Operations Dashboard

How to run this dashboard on the web (Cloudflare) at
**dashboard.bolealabs.site**, behind Cloudflare Access — without breaking the
local pipeline deployment.

## The one rule: DEPLOY_MODE

| | `DEPLOY_MODE=local` (default) | `DEPLOY_MODE=web` |
|---|---|---|
| Where it runs | The pipeline machine (this repo, port 3100) | Cloudflare Pages/Workers |
| API routes execute pipeline scripts? | Yes — exactly as before | **Never** |
| Local pipeline files read/written? | Yes | **Never** |
| Execution requests become | Real jobs (renders, uploads, voice…) | **Intents** (HTTP 202) |
| Analytics | Real API data (env tokens) | Real API data (env tokens) |
| Status | Local probes + heartbeat feed | Heartbeat feed only |

Local mode is byte-for-byte the old behavior. Every change for web mode is
additive and gated behind `DEPLOY_MODE=web` (see `lib/mode.ts`). If the env
var is absent or anything else, the dashboard behaves as it always has.

## What web mode disables, and why

On Cloudflare there is no pipeline: no `scripts/`, no media vault, no
ffprobe, no tokens on disk. Routes that would execute a local script or touch
local pipeline files refuse execution and instead record an **intent** and
answer `HTTP 202`:

```json
{
  "status": "queued",
  "mode": "web",
  "intent": {
    "id": "intent-…",
    "type": "render.start",
    "payload": {"slug": "sigbin", "kind": "short"},
    "queued_via": "bridge",
    "createdAt": "2026-10-27T…Z"
  }
}
```

Guarded routes (intent type in parentheses):

- `POST /api/render` (`render.start`), `POST /api/publish` (`publish.start`)
- `POST /api/voice` (`voice.generate`), `POST /api/script` (`script.generate`)
- `GET|POST /api/images` (`images.list` / `images.process`)
- `GET|POST /api/npc` (`npc.info` / `npc.render`)
- `GET|POST /api/studio` (`studio.list` / `studio.<action>`)
- `GET|POST /api/topics` (`topics.list` / `topics.add`)
- `GET /api/vault` (`vault.probe`), `GET /api/asset` (`asset.read`)
- `GET /api/video/[slug]` (`video.stream`)
- `GET|POST /api/remote` (`remote.status` / `remote.tunnel`)
- `POST|DELETE /api/settings/keys` (`settings.update` / `settings.delete`) —
  the intent records **which keys** were submitted, never their values.
  `GET /api/settings/keys` in web mode returns env-configuration booleans
  only (no secrets, no local file checks).

Web-native routes (work fully in web mode):

- `GET /api/analytics` — real YouTube Analytics/Data + Meta Graph numbers.
- `GET /api/intents` — read-only list of the intents outbox.
- `GET /api/status` — the heartbeat feed (below).

## The intents contract

- An intent is `{id, type, payload, queued_via: "bridge", createdAt}`.
- Storage (`lib/intents.ts`): appended to `<DASH_DATA_DIR|./data>/intents.jsonl`
  when the filesystem is writable, mirrored in memory otherwise (Workers
  isolates are ephemeral — intents survive for the life of the isolate and
  the outbox file wherever one exists).
- The machine side (Muse's box / Antigravity's PC, via the Discord bridge)
  polls `GET /api/intents` and executes queued work with the real pipeline,
  under the existing review gate. **The web dashboard never executes,
  schedules, or publishes anything itself.**
- Payloads never contain secret values.

## Required environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DEPLOY_MODE` | yes, set to `web` | Turns on every guardrail above |
| `YT_TOKENS_JSON` | for YouTube analytics | OAuth token JSON as a single string: `{"client_id":…,"client_secret":…,"refresh_token":…,"access_token":…,"expiry_date":…}` (same shape as the pipeline's `youtube-tokens.json`). Access tokens refresh in memory; the value is never written anywhere |
| `META_PAGE_TOKEN` | for Meta analytics | Facebook Page access token (permanent page token) |
| `META_PAGE_ID` | optional | Page ID; if omitted, the token's own page (`/me`) is used |
| `META_IG_USER_ID` | optional | Instagram user ID; if omitted, discovered via the page's linked IG account |
| `META_GRAPH_VERSION` | optional | Default `v21.0` |
| `HEARTBEAT_URL` | optional | Default `https://bolealabs.site/status.json` |
| `DASH_DATA_DIR` | optional | Where `intents.jsonl` is appended when a writable FS exists |

See `.env.example` for a fill-in template. **Never commit real values.**

## Status / heartbeat

The Analytics tab and `GET /api/status` consume the heartbeat feed published
by the pipeline machine every 5 minutes:

```
https://bolealabs.site/status.json
{"dashboard": "up", "stream": "live", "updated_at": "2026-10-27T17:48:38+08:00"}
```

The feed is fetched server-side with a 5s timeout and a 60s cache; if it is
unreachable the UI shows "Heartbeat feed unavailable" and everything else
keeps working. In local mode `/api/status` keeps its original local probes
and additionally includes the heartbeat.

## Analytics data layer

`GET /api/analytics` (`lib/analytics.ts`), cached in memory for 10 minutes
(`?refresh=1` bypasses):

- **YouTube** (Analytics + Data APIs): channel title, subscribers, total
  views, video count; last-28-days views, watch hours, average view
  duration, subscribers gained/lost/delta, likes, comments, shares; top 10
  videos by watch time with titles.
- **Meta** (Graph API): page name + Facebook followers, Instagram username +
  followers.
- Nothing configured → `{"configured": {"youtube": false, "meta": false}}`
  with the tab showing a clean "not configured" state. A failing source
  lands in `errors[]` — the route never throws and never leaks stack traces.

## Cloudflare wiring (for Antigravity)

1. **Zone**: `bolealabs.site` must be on Cloudflare DNS (it is the same zone
   that hosts the GitHub Pages site — Pages keeps working; DNS records for
   `@`/`www` stay as they are).
2. **Deploy the dashboard** from the `web-dashboard` branch, `dashboard/`
   directory, as a Next.js app on Cloudflare Pages (via
   `@cloudflare/next-on-pages`) or a Workers deploy. Build command
   `npm run build`, output per the adapter. Set the env vars above as
   **secrets** in the Pages/Workers project (Production + Preview).
   `DEPLOY_MODE=web` is mandatory — without it the deployment would try to
   execute local scripts that do not exist there.
3. **Custom domain**: attach `dashboard.bolealabs.site` to the project and
   create the matching DNS record (CNAME to the Pages/Workers target,
   proxied/orange-cloud).
4. **Cloudflare Access** (Zero Trust → Access → Applications): create a
   self-hosted application for `dashboard.bolealabs.site`, policy = allow
   only Christian's email (one-time PIN or Google IdP). The app-level
   `/api/auth` users/sessions in this codebase are a **second** layer only;
   Access is the gate. Note the built-in auth stores users/sessions in the
   data dir, which is ephemeral on Workers — treat it as optional, not as
   the security boundary.
5. **Verify**: open `https://dashboard.bolealabs.site` → Access login →
   dashboard loads → Analytics tab shows real numbers (or the clean
   not-configured state) → trigger a render from the UI → the response is
   `202` and the intent appears under **Analytics → Queued intents** and via
   `GET /api/intents`.

## What did NOT change

- Local deployment (`DEPLOY_MODE` unset/`local`) runs identically to before:
  same routes, same jobs, same files, same port.
- No pipeline code outside `dashboard/` was touched.
- The 24/7 stream, the bridge, and all scheduler scripts are untouched.

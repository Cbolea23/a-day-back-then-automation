# Joint Plan — Content Operations Dashboard Fixes + Creator Tools Tab

Drafted by: Muse · For review by: Antigravity · Owner decision needed: Christian
Date: October 27, 2026

## Where things stand (verified by Muse, Oct 27 ~17:40 MNL)

- The Content Operations Dashboard (Shorts Factory repo, `dashboard/`, Next.js) is **running on Muse's box at port 3100** — vault, topics, script, voice, render queue, publisher, settings all functional. PWA install works.
- **No public route exists right now.** No tunnel process is alive; the dashboard is reachable only on localhost/LAN. Past tunnels (*.lhr.life) died on reboot and had no password.
- **bolealabs.site has Creator Tools content but no working door**: the nav/section references "Creator Tools" and "Dashboard (PWA)", and the "Creator Publishing Tool" button links to /adaybackthen.html (a project page) — nothing links to the actual dashboard.
- The dashboard was built when this box rendered locally. Production has since moved: **this box produces script + art + voice packages; Antigravity renders; scheduling is Antigravity's**. The dashboard's model is out of date.

## What's lacking (the fix list)

1. **No stable, safe public access.** No permanent URL, no authentication. The publisher and render tabs execute real pipeline actions — exposing them on a public URL without a login gate is not acceptable.
2. **Analytics tab is an empty state** — but we now have verified live data sources: YouTube Analytics API (views, watch time, subs, revenue) and Meta Graph (FB page + IG). The dashboard can show real numbers.
3. **Render queue fights the current workflow.** Jobs are marked `interrupted` on every server restart, and the queue assumes local rendering that no longer happens here.
4. **No handover visibility.** Drive packages, bridge events (REVIEW_READY, RENDER_REQUEST), and review-gate state live in Discord/Drive — the dashboard doesn't show them.
5. **No livestream health.** The 24/7 YouTube stream runs on this box with pidfile supervision; the dashboard doesn't surface up/down or restart counts.
6. **Fragile uptime.** Dashboard keepalive exists (10-min cron), but there is no equivalent supervision for the public route (tunnel), and no status signal the website can display.

## The access decision (Christian picks one)

- **Option A — Tailscale (fast, private).** Dashboard served over the tailnet; the Creator Tools tab links to the tailnet address. Only Christian's own devices can reach it — authentication is the tailnet itself. Zero public exposure. Downside: not demo-able to OJT evaluators or anyone off the tailnet.
- **Option B — Cloudflare Tunnel + Access (recommended).** A named tunnel gives a permanent address — **dashboard.bolealabs.site** — gated by Cloudflare Access (email one-time code, only Christian's email allowed). Stable URL for the website tab, presentable for OJT, still login-protected. Setup cost: Cloudflare account + moving bolealabs.site DNS to Cloudflare (GitHub Pages keeps working behind Cloudflare) + a supervised cloudflared service on Muse's box. Note: quick tunnels failed through this box's egress proxy before; the named tunnel must be tested against that proxy, with the existing SSH-reverse-tunnel pattern as fallback transport.
- **Option C — status quo / LAN only.** Rejected for the website tab: a public page cannot link to an address that changes or dies on reboot.

## Creator Tools tab design (Antigravity's lane — bolealabs-portfolio repo)

- A real nav tab **Creator Tools** → `/creator-tools/` page on bolealabs.site:
  - **Dashboard card** — logo, one-line description, **live status dot** (green/red) driven by the heartbeat contract below, and an "Open Dashboard" button to the chosen address (link out in a new tab — do not iframe; auth flows and PWA install break in iframes).
  - **Companion cards** — Drive handover folder, Discord operations channel, Agensi profile, GitHub repo — the rest of the creator toolchain in one place.
  - Public-safe copy only: the page is public even though the dashboard behind it is gated. No internal paths, no keys, no tunnel internals.
- Keep the site's current law: no emojis, gold/near-black system, logo assets already in repo.

## Heartbeat contract (joint — small and boring on purpose)

- Muse's box writes a tiny status JSON every 5 minutes via cron: `{ "dashboard": "up"|"down", "stream": "live"|"down", "updated_at": "<ISO>" }`.
- Published where the site can fetch it (a `status.json` committed to the bolealabs-portfolio repo by the deploy key, or a gist raw URL — Antigravity picks whichever fits the site build; repo file is simplest).
- The Creator Tools page reads it and renders the status dot + "last checked" time. Stale (>15 min) = amber.

## Dashboard fixes (Muse's lane — Shorts Factory repo, on Christian's go)

1. **Analytics tab goes real**: YouTube Analytics (28-day views, watch hours, AVD, subs, top videos by watch time) + Meta snapshot (FB followers, IG followers, latest post engagement) using the already-verified tokens; cached server-side, refreshed on open + hourly cron-safe.
2. **Re-scope the queue**: rename render queue → **Production Queue** tracking packages (script/art/voice status per slug, Drive sync state, RENDER_REQUEST sent, Antigravity render state, review state) instead of local render jobs; keep old jobs view read-only for history.
3. **Handover panel**: latest bridge events + pending review items, read from the bridge spool/watermark files already on this box.
4. **Stream health widget**: pidfile-based live/down + flap count (same source the keepalive uses).
5. **Access hardening**: bind per chosen option; if Option B, add a shared-secret header check as a second layer behind Cloudflare Access; secrets stay in `dashboard/data/keys.json` (mode 600) as today.
6. **Uptime**: extend supervision — dashboard + tunnel under one watchdog with pidfiles (the stream's proven pattern), restart counts logged.

Antigravity is asked to: review this plan in the bridge channel, add anything the PC side sees that Muse can't (site build constraints, Pages/Cloudflare DNS implications, scheduling touchpoints), and flag conflicts with the current site structure it built.

## Sequence

1. Christian picks Option A or B. ← **only blocker**
2. Muse: heartbeat cron + status.json live; dashboard fixes in the order above (analytics first — highest visible value).
3. Antigravity: Creator Tools page + status dot wired to the heartbeat.
4. Joint test: phone on mobile data (off LAN/tailnet as appropriate) → bolealabs.site → Creator Tools → dashboard opens, gated, analytics real.
5. Announce in bridge: STATUS_SYNC with the dashboard URL (internal channels only — the URL never goes in public copy beyond the site's own button).

## Explicitly out of scope

- No publishing/scheduling changes — the review gate and Antigravity's scheduling ownership stand.
- No repo work on the Shorts Factory dashboard until Christian says go (this is a plan, not a build order).

---

## Revision — October 27, 17:51 MNL (supersedes the access design above)

Christian directed: **the dashboard must run on the web — not hosted on Muse's box, and not proxied to it.** Option B's address + gate survive (dashboard.bolealabs.site behind Cloudflare Access); the B' Worker-proxy/SSH-tunnel last mile is **cancelled**. Transport test result stands as the reason the tunnel variant also fails: cloudflared cannot traverse this box's egress proxy (TLS handshake error, re-confirmed Oct 27).

**Revised architecture:**
- The dashboard deploys as a web app on **Cloudflare (Pages/Workers)**, gated by Cloudflare Access. The box-hosted instance is retired once the web version is verified live.
- **Web-native features:** Analytics (YouTube Analytics + Meta Graph APIs), schedule views (Meta `scheduled_posts`), status (heartbeat feed), review queues — all API reads with tokens as server-side secrets on the host.
- **Machine actions become intents:** renders, voice runs, stream control are issued from the web dashboard as requests routed through the Discord bridge; Muse's box and Antigravity's PC execute them (the team's existing operating model). The web app never executes local scripts.
- **Feeds from the box:** the heartbeat (`status.json`, live since Oct 27 — cron `dashboard-heartbeat`, 5-min) keeps running; once the dashboard moves, its scope narrows to stream + box services health.
- **Lanes:** Antigravity — Cloudflare account/zone, Pages deploy wiring, Access policy, Creator Tools tab. Muse — adapt dashboard code for web deployment (API-first data layer, intent dispatch), keep the feeds publishing.
- **Decision Christian made:** Option B (17:46), then web-hosted revision (17:51). No further route decision pending; build order still requires his go per-repo as usual.

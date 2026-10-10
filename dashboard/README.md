# A Day Back Then — Content Operations Dashboard

A real full-stack control panel for the Shorts Factory pipeline. The UI talks
to Next.js API routes that execute the actual pipeline scripts on this machine —
nothing is simulated.

## Run it

```bash
cd dashboard
npm install
# optional, enables the "Generate Script" tab:
GEMINI_API_KEY=your_key npm run dev
```

Open http://localhost:3100.

By default the dashboard controls the pipeline in the repo root (`..`).
Override with `PIPELINE_ROOT=/path/to/repo`.

## Mobile app (PWA)

The dashboard is installable as a mobile app:

1. Start the server so your phone can reach it. On the same Wi-Fi, bind to
   the network: `npm run dev -- -H 0.0.0.0` (port 3100), then open
   `http://<your-computer-lan-ip>:3100` in your phone's browser.
   (From outside your network, use a tunnel such as Cloudflare Tunnel or
   Tailscale — the phone just needs HTTP access to the server.)
2. **iPhone:** Share → Add to Home Screen.
   **Android:** menu → Add to Home screen (or Install app).
3. It launches fullscreen with its own icon — no browser chrome.

The phone is a remote control: the server still does all the rendering,
voiceover synthesis and uploads. The UI is responsive (bottom… top tab bar
on small screens, stacked cards, swipeable tables).

## API keys

Settings → API Keys has a key input box. The key is sent to the server and
stored in `dashboard/data/keys.json` (file mode 600, gitignored, never
committed, never sent back to the browser). `GEMINI_API_KEY` in the server
environment takes precedence if both are set. Clearing the box's saved key
is done with the Clear button; OAuth tokens and Playwright sessions remain
file-based on the server and can't be pasted into the app.

## What each tab does (for real)

| Tab | API | Real behavior |
|---|---|---|
| Overview | `GET /api/status`, `GET /api/vault`, `GET /api/render` | Live pipeline health, vault count, active jobs |
| Vault Manager | `GET /api/vault`, `GET /api/video/[slug]` | Lists real `out/*.mp4` (ffprobe duration/size); previews stream the actual file |
| Script & Voice | `GET/POST /api/topics`, `POST /api/script`, `POST /api/voice` | Topics from `newtopics.json`; runs `make-script.mjs --only <slug>` (needs `GEMINI_API_KEY`); runs `make-voice.mjs <slug>` |
| Remotion Queue | `POST /api/render`, `GET /api/render/[id]` | Spawns `node scripts/render.mjs <slug>`; progress parsed live from remotion's `Rendered x/y` stdout; job survives server restarts via `data/jobs.json` |
| Multi-Publisher | `POST /api/publish`, `GET /api/publish?id=` | Spawns `upload-youtube/facebook/tiktok/instagram.mjs <slug>`; needs each platform's auth on this machine |
| Content Calendar | — | Client-side planner; publishing goes through the publisher tab |
| Analytics | — | Empty state until YouTube Data API is wired (uses the same OAuth tokens as the publisher) |
| Settings | `GET /api/status` | Live checks: node, ffmpeg, remotion, `GEMINI_API_KEY`, `youtube-tokens.json`, `facebook-tokens.json`, `.tiktok-session/` |

## Notes

- Secrets: the Gemini key can be entered in Settings → API Keys (stored
  server-side in `data/keys.json`, mode 600, gitignored) or via the
  `GEMINI_API_KEY` env var (takes precedence). OAuth tokens stay file-based.
- The dashboard is a local operations tool: run it on the machine that has the
  pipeline (your computer or a server). It is not deployable to GitHub Pages
  (static hosting can't run the backend).
- Job history persists in `dashboard/data/jobs.json` (gitignored). Jobs that
  were running when the server stopped are marked `interrupted`.

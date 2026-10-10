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

- Secrets (Gemini key, OAuth tokens) live in the server environment and token
  files — the browser never sees them.
- The dashboard is a local operations tool: run it on the machine that has the
  pipeline (your computer or a server). It is not deployable to GitHub Pages
  (static hosting can't run the backend).
- Job history persists in `dashboard/data/jobs.json` (gitignored). Jobs that
  were running when the server stopped are marked `interrupted`.

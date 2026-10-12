# Halloween Specials — Production Playbook

36 shorts, 3/day Oct 23 – Nov 3. Slate: `halloween-specials/slate.json` (slugs, days, titles).
Scripts: `scripts-out/<slug>.json` — ALL 36 ALREADY WRITTEN (9 scenes each, hook-first). Do NOT regenerate scripts.
User posts everything themselves. NEVER upload, NEVER schedule, NEVER publish.

## Per short, in slate order (earliest posting day first)

### 1. Images — 9 per short, vertical 9:16
- Prompts: `scripts-out/<slug>.prompts.txt` (9 numbered). Append nothing; style is baked in.
- Generate with `media.generate_image`, one call per image (max 4 calls per response — use subagents, 3 images each).
- `output_dir="workspace/a-day-back-then-automation/public/images/<slug>/"`, `output_format="png"`. Omit `name` (flaky).
- Verify PORTRAIT (height > width, ~9:16) via exec; regenerate failures with stronger "tall vertical 9:16 portrait" wording.
- Rename to `1.png` … `9.png` in prompt order. Delete `*.json` receipts.
- Keep lower-center of frame relatively clear (narrator character stands there).

### 2. Voiceover
- Run: `python3 scripts/voice-batch.py <slug>` (bundled tts CLI, Brooding Boulder voice — do NOT use edge-tts, it is broken behind this proxy).
- Writes `public/audio/<slug>/<n>.mp3` and updates the JSON (resumable).

### 3. Render
- `cd ~/workspace/a-day-back-then-automation && TMPDIR=~/workspace/tmp npm run build-video -- <slug> --no-voice --no-upload`
  (TMPDIR is mandatory — /tmp is a 512MB tmpfs and the render dies without it.)
- Output lands in `out/2 - Unpublished Vault/<slug>.mp4`.

### 4. Verify each short
- `ffprobe`: 1080x1920, h264 + aac, duration 45–75s.
- Grab 1 frame mid-video, confirm: background image visible, narrator present, captions rendering, no text baked into art.

## Batching
Work in waves of ~3 shorts at a time (images → voice → render per short). Spawn image subagents 3-at-a-time per short (3 images each). Report progress per short: DONE or FAILED with reason. If a step fails twice, move on and log it — do not stall the batch.

## Done criteria
All 35 remaining shorts rendered + verified in `out/2 - Unpublished Vault/`. Final report: list every mp4 with duration.

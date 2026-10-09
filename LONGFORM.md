# Long-form videos (8-12 min, 1920x1080)

Separate from the Shorts pipeline. Nothing here touches `topics.json` or `scripts-out/`.

| | Shorts | Long-form |
|---|---|---|
| Topics | `topics.json` | `topics-long.json` |
| Script command | `npm run script` | `npm run script:long` |
| Scripts live in | `scripts-out/` | `long-out/` |
| Images | `public/images/<slug>/` | `public/images/long/<slug>/` |
| Build command | `npm run build-video -- <slug>` | `npm run build-long -- <slug>` |
| Output | `out/<slug>.mp4` (1080x1920) | `out/long-<slug>.mp4` (1920x1080) + `out/long-<slug>.description.txt` |

## How a long video is built
1. `npm run script:long -- --only <slug>` makes 1 outline call + 1 call per chapter (about 8 small calls for a 10-minute video). Every step is cached in `long-out/.cache/`, so a failed run resumes instead of starting over. `--force` regenerates.
2. Output is `long-out/<slug>.json` (about 30-40 scenes of 28-45 words each, grouped into 6-8 chapters) and `long-out/<slug>.prompts.txt`.
3. **Images: about 10-14 per video, not one per scene.** Each chapter gets 1-2 backgrounds, and scenes without their own image reuse the previous one with a different slow pan/zoom. Generate them as **horizontal 16:9** in the Gemini app and save as `public/images/long/<slug>/1.png`, `2.png`, ... in the order of the prompts file.
4. `npm run build-long -- <slug>` checks images, makes the voiceover (Charon by default; resumes if interrupted), writes the description file with chapter timestamps, then renders.

## Flags for build-long
- `--draft` half-size render, much faster, for checking
- `--no-render` prepare everything, don't render
- `--no-voice` / `--force-voice` skip or redo the voiceover
- `--allow-gradient` render even if some images are missing

## Vault Organization & Automated Uploads

All renders, descriptions, and thumbnails land in:
`out/Longform/2 - Unpublished Vault/`

Once published, files are automatically moved to:
`out/Longform/1 - Published/`

### Upload Commands
- **YouTube Long-Form**:
  `npm run upload:long -- <slug>`
  (Uploads 1080p video, attaches custom thumbnail, sets title, timestamps & related Shorts links, adds to era playlist).
- **Facebook Page Video (16:9 Widescreen)**:
  `npm run upload:fb:long -- <slug>`
  (Uploads via Meta Graph API resumable chunked protocol, attaches custom thumbnail, applies Facebook-tailored description, logs to `published-urls-facebook.json`).
  Options:
  - `--draft` saves as draft on Facebook Page
  - `--schedule "YYYY-MM-DDTHH:MM:SSZ"` schedules publication

### Facebook Best Practices
- Facebook videos do NOT need chapter timestamps in the description. Our pipeline automatically generates `long-<slug>.facebook.txt` with hook-focused, mobile-friendly copy.
- Never put external YouTube links in the Facebook post description itself (Facebook algorithm suppresses outbound links). Add YouTube links to the **pinned first comment** instead!


## Prompts for Antigravity

**Add more long-form topics**
```
Open topics-long.json and add 10 new topics about <ERA/THEME>. Keep the same JSON structure
(slug, title, format, targetMinutes 9-11, angle, relatedShorts). relatedShorts must only contain
slugs that already exist in topics.json. Use unique kebab-case slugs. Formats allowed:
day-in-the-life, year-in-the-life, survival-guide, myth-buster, ranked-list, comparison, explainer.
Each "angle" is 1-2 sentences and only includes things historians broadly agree on; say where
evidence is thin. Don't run any scripts.
```

**Something broke**
```
Run `npm run typecheck`, then `npm run build-long -- <slug> --draft`. Fix errors with the smallest
possible change, don't redesign anything, never print my GEMINI_API_KEY, and tell me what you changed.
```

**Tweak the long-form look**
```
In src/LongVideo.tsx change <WHAT: caption size / chapter card style / narrator position>.
Change nothing else. Then run `npm run typecheck` and `npm run build-long -- sample-long-roman-day --draft --no-voice --allow-gradient`.
```

# Shorts Factory

Turns a topic into a 1080x1920 history Short: a fixed cartoon narrator over illustrated backgrounds, word-by-word captions, a hook banner in the first 3 seconds, and optional voiceover.

> Status: written and syntax-checked, but **not yet installed or rendered** (the build sandbox could not reach the npm registry). Step 1 below is where you find out if anything needs a tweak.

## 1. Install and preview (5 minutes, no API keys)

Requirements: Node 18+ (22 recommended), and Google Chrome is downloaded automatically by Remotion on first render.

```bash
npm install
npm run typecheck        # should print nothing
npm run studio           # opens Remotion Studio with the sample Short
npm run render:sample    # writes out/sample.mp4
```

The sample uses gradient backgrounds and no voiceover, so it renders with no keys or assets. If it looks right, the template works.

## 2. Make scripts (one Gemini call per 5 topics)

```bash
export GEMINI_API_KEY=your_key          # PowerShell: $env:GEMINI_API_KEY="your_key"
npm run script                          # all topics in topics.json that have no script yet
npm run script -- --only roman-toilets  # just one
```

Optional: `GEMINI_MODEL=<model name>` (default `gemini-2.5-flash`; use whichever fast, cheap model is current for you).

Each script lands in `scripts-out/<slug>.json` with a `claimsToVerify` list and `scripts-out/<slug>.prompts.txt` with one image prompt per scene.
**Read each script and check the claims list before posting.** The model can be confidently wrong about history, and original, accurate scripts are also what keeps the channel monetizable.

## 3. Images

Generate one image per prompt (any generator you like), save as `public/images/<slug>/1.png`, `2.png`, ... in the same order as the prompts file, then:

```bash
npm run images
```

Scenes without an image fall back to a gradient. Reusing a few backgrounds across videos (street, kitchen, market) saves a lot of cost.

## 4. Voiceover (optional)

```bash
pip install edge-tts      # also needs ffprobe (installed with ffmpeg)
npm run voice
```

This writes `public/audio/<slug>/N.mp3` and sets each scene's real length. `edge-tts` is an unofficial client for a Microsoft service: fine to test with, but use an official TTS API for a real channel (replace `synth()` in `scripts/make-voice.mjs`).

## 5. Render

```bash
npm run render                  # every script in scripts-out/
npm run render -- roman-morning # one
```

Output goes to `out/<slug>.mp4`.

## Daily workflow

1. `npm run script` (batch of topics)
2. Review scripts and verify claims
3. Generate images, `npm run images`
4. `npm run voice`
5. `npm run render`
6. Upload to YouTube Shorts (turn on the AI-content disclosure for realistic synthetic visuals or voice), then cross-post to Facebook Reels and TikTok.

## Customizing

- Channel name, topics, formats: `topics.json`
- Look of the narrator: `src/Narrator.tsx` (plain SVG, replace with your own design)
- Caption style and position: `src/Captions.tsx`, `src/Short.tsx`
- Hook banner length: `HOOK_FRAMES` in `src/Short.tsx`
- Image style suffix: `IMAGE_STYLE` in `scripts/make-script.mjs`

## Keeping it monetizable

YouTube demonetizes templated, interchangeable uploads. Vary the formats (day-in-the-life, myth-buster, comparison, jobs), write real scripts with a point of view, and don't ramp up volume until a few videos have proven to hold viewers.

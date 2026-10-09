# Daily workflow (manual images)

## One-time setup
1. Create a NEW Gemini API key in AI Studio (delete any key that was ever pasted in chat).
2. Save it so every terminal has it (PowerShell, then open a new terminal):
   `setx GEMINI_API_KEY "your_key_here"`
3. Voice: `Charon` is the default. To change: `setx VOICE "Sadaltager"`.
4. Make sure ffmpeg/ffprobe works: `ffprobe -version`.

## Make a batch of videos
1. **Topics**: edit `topics.json` (or ask Antigravity, see prompt A below).
2. **Scripts**: `npm run script`
   - Creates `scripts-out/<slug>.json` and `scripts-out/<slug>.prompts.txt` for each new topic.
3. **Fact-check**: read each script and its `claimsToVerify` list. Fix anything doubtful in the JSON.
4. **Images** (manual, free with your Gemini plan):
   - Open ONE Gemini chat per video so the art style stays consistent.
   - Paste the prompts from `<slug>.prompts.txt` one by one, vertical 9:16.
   - Save as `public/images/<slug>/1.png`, `2.png`, ... in order.
5. **Build & Auto-Publish**: `npm run build-video -- <slug>`
   - Automatically:
     1) Checks & links all images in `public/images/<slug>/`
     2) Synthesizes Gemini TTS voiceover
     3) Renders the 1080x1920 video
     4) Automatically uploads to YouTube Shorts with optimized title & tags, and schedules it to go **Public** at the next prime US peak viewing window!
   - Flags:
     - `--now` or `--public` : Publish immediately as Public (no schedule wait)
     - `--schedule "YYYY-MM-DDTHH:mm:ssZ"` : Custom release schedule
     - `--no-upload` : Render MP4 only without uploading
6. **Review** on YouTube Studio, then cross-post to Facebook Reels and TikTok.

## Antigravity prompt templates

**A. Add topics**
```
Open topics.json and add 10 new topics about <ERA/THEME>. Keep the same JSON structure.
Use unique kebab-case slugs. Mix these formats: day-in-the-life, gross-facts, myth-buster,
jobs-nobody-wants, comparison, money-and-class, survival. Each "angle" should be one sentence
and only include things historians broadly agree on. Don't run any scripts.
```

**B. Something broke**
```
Run `npm run typecheck` and `npm run render -- <slug>`. Fix any errors with the smallest change
possible, don't redesign anything, never print my GEMINI_API_KEY, and tell me what you changed.
```

**C. Tweak the look**
```
In src/Short.tsx and src/Captions.tsx, change <WHAT, e.g. caption size / colour / position>.
Don't change anything else. Then run `npm run typecheck`.
```

## Quality rules (keeps the channel monetizable)
- Don't post two videos with the same structure back to back. Rotate formats.
- Every script gets a human read and a fact-check before posting.
- Start at 1 video a day. Look at retention after 10 videos and keep what works.
- Turn on the AI-content label at upload.

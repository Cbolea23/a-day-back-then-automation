# Narrator — agent context

The on-screen host of every video. A flat-cartoon SVG character (thick dark
outlines, warm muted palette) that **performs the narration** instead of
idling: speech-driven gestures, facial expressions, head-nods, and a mouth
that forms the words being spoken.

Read this before touching `src/Narrator.tsx` or `src/speech.ts`.

## Architecture

```
src/speech.ts      — word timing + gesture director (pure logic, unit-testable)
src/Narrator.tsx   — the SVG rig: poses, expressions, lipsync (rendering)
src/Short.tsx      — builds a speech plan per scene, passes plan + audio to Narrator
src/LongVideo.tsx  — same, for the long-form composition
src/Captions.tsx   — word-by-word captions; shares timing with the narrator
```

### The one rule

**Captions, gestures, and the mouth share one timing source**: `wordStartFrames()`
in `speech.ts` spreads words across the scene proportional to word length
(matching the voiceover pacing). Never compute word timing anywhere else —
if they drift apart, the acting falls apart.

### Gesture director (`planSpeech`)

`planSpeech(text, durationInFrames, {isFirstScene})` returns:

- `words`, `starts` — word list + start frame per word
- `cues` — ordered, non-overlapping `{fromFrame, toFrame, gesture, expression}`;
  gaps between cues = the narrator settles to idle
- `beats` — frames where the head (and fists) nod on emphasis words

Each sentence gets one gesture, picked by cue words in priority order:

| Priority | Cue words | Gesture | Expression |
|---|---|---|---|
| 1 | `?` | question (head tilt, hand up) | question |
| 2 | incredible/unbelievable/… or `!` | surprise (hands up) | surprise |
| 3 | died/death/killed/plague/war/… | solemn (bowed head, clasped hands) | sad |
| 4 | one/two/first/reasons/steps/… | count (raised fingers) | neutral |
| 5 | look/see/here/this/that/… | point (extended index finger) | neutral |
| 6 | imagine/wonder/think/maybe/… | think (hand to chin) | thoughtful |
| 7 | versus/while/compared/… | compare (weighing hands) | neutral |
| 8 | but/however/although/yet/… | shrug | neutral |
| 9 | huge/massive/giant/… | big (arms wide) | emphasis |
| 10 | tiny/small/little/… | small (pinched hands) | neutral |
| 11 | very/never/always/must/… | emphasis (fists, lean in) | emphasis |
| 12 | (default) | explain (open hands) | neutral |

Plus: a greeting (`welcome/hello/hey`) in the first scene's first sentence
gets a short `wave` before the sentence's normal gesture.

To change the acting, edit the cue word lists / priority in
`classifySentence()` — that's the whole directing language.

### The rig (`Narrator.tsx`)

- **Poses**: `POSES` maps each `GestureKind` to a full-body pose
  (elbows, hands, head tilt/bow, body lean, x-shift) in the `300×600` viewBox.
  `poseAtFrame()` eases between poses with a slight overshoot (`easeOutBack`)
  on gesture entrances; between cues it settles back to `IDLE_POSE`.
- **Per-gesture motion** only plays while its gesture is active (explain hands
  pulse, compare hands weigh, wave oscillates, point taps). Idle is a slow
  weight shift + subtle breathing — never random fidgeting.
- **Face**: expressive eyebrows per expression, white eyes with pupils that
  look toward the gesture's focus (at the point target, up when thinking,
  down when solemn), natural blink cycle.
- **Mouth**: visemes picked from the spoken word's vowel — round `o` for
  o/u, wide `e` with teeth for e/i, open `a` for a — plus tongue and teeth.
  Openness comes from the **real voiceover volume** (`useAudioData` +
  `visualizeAudio` from `@remotion/media-utils`) when `audioSrc` is set,
  falling back to word-rhythm timing. Surprise gets a big "o".
- **Draw order** (matters!): legs → torso/outfit → arms+hands → head.
  Arms and hands must stay **in front of** the torso or crossed gestures get
  swallowed. (Past bug, fixed twice — don't regress it.)
- **Themes** (8): roman, egypt, viking, medieval, knight, plague-doctor,
  greek, gladiator — picked by `getThemeFromSlug()`. Sleeves were tried and
  **removed by user request** — keep the arms as clean sticks; don't re-add
  sleeves without asking. Gladiator keeps a pose-following bronze manica on
  the right forearm; egypt keeps gold wrist cuffs.

### Props

```tsx
<Narrator
  height={700}
  theme={theme}          // CharacterTheme
  plan={plan}            // from planSpeech(); without it, falls back to gentle idle
  audioSrc={scene.audio} // "audio/<slug>/1.mp3" — enables true lipsync
  anchorX={0.5}          // narrator's horizontal anchor, fraction of frame width
  focus={{x: 0.6, y: 0.3}} // scene focus point (frame-normalized); pupils,
                           // head tilt and pointing arm aim at it during
                           // "point"/"explain" gestures
/>
```

Legacy props (`talking`, `gesture`, `tunic`) still work but the plan wins.

### Scene direction (`Scene["direction"]`, optional — `src/types.ts`)

Per-scene stage direction lives on the scene object in
`scripts-out/<slug>.json`. Everything is optional; missing fields fall back
to centered narrator / push-in drift / no focus aiming.

```json
"direction": {
  "focus": [0.55, 0.28],   // normalized x/y of the interesting thing in the
                           // background image — gaze + pointing arm aim here
  "narratorX": 0.5,        // horizontal anchor, fraction of frame width
  "narratorScale": 0.85,   // shrink to keep busy artwork visible
  "drift": "push-in"       // "push-in" | "pull-back" | "pan-left" |
                           // "pan-right" | "still" — camera move, eased
                           // toward the focus point
}
```

`Short.tsx` reads it: `Background` drifts the camera toward the focus,
`SceneView` plants the narrator at `narratorX` (with a contact shadow), and
`Narrator` aims pupils/head/pointing arm at `focus`. When the focus is left
of the narrator the point pose is mirrored so they point with the left arm.
No direction → old behavior exactly.

## Test / render

```bash
npm install
npm run typecheck                          # tsc --noEmit, must pass
npm run render:sample                      # out/sample.mp4 — full Short with real script text
npx remotion still src/index.ts Short /tmp/f.png --props=./data/sample.json --frame=1370
```

Use `remotion still` on single frames to check poses cheaply (frame 1370 =
the "Want to see that part?" question pose; frame 40 = small/pinch pose).
`src/speech.ts` is pure — unit-test `planSpeech`/`poseAtFrame` in node via
esbuild with remotion/react stubbed if you want fast iteration.

## History (local commits, Oct 10 2026)

- `ffd5e68` — gesture director, pose system, audio lipsync; killed random
  gesture cycling / wandering / bouncing
- `4f18a2d` — fingered hands, look-at pupils, overshoot entrances, beat pumps
- `aae3ebf` — arms in front of torso; viseme mouth (O / wide-E / open-A)
- `d483f00` — sleeve cuffs tucked under tunic (superseded)
- `8f29ee8` — proper short sleeves (superseded — user disliked them)
- `daf280c` — sleeves removed entirely per user request

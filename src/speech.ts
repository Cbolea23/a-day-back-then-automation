/**
 * speech.ts — single source of truth for "what is being said, and when".
 *
 * Captions.tsx and Narrator.tsx both derive their timing from here so the
 * highlighted word, the mouth, and the gesture always agree with each other.
 *
 * The gesture director (planSpeech) reads the narration text and assigns each
 * sentence a purposeful gesture + facial expression, so the narrator's body
 * language follows the story instead of cycling on a random timer.
 */

export function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Start frame of every word. Words are spread across the scene in proportion
 * to their length (same pacing the voiceover uses), so captions, mouth and
 * gestures stay in sync.
 */
export function wordStartFrames(
  words: string[],
  durationInFrames: number,
): number[] {
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const usable = durationInFrames * 0.96;
  let acc = 0;
  return weights.map((w) => {
    const s = (acc / total) * usable;
    acc += w;
    return s;
  });
}

/** Index of the word being "spoken" on a given frame. */
export function activeWordIndex(starts: number[], frame: number): number {
  let active = 0;
  for (let i = 0; i < starts.length; i++) {
    if (frame >= starts[i]) {
      active = i;
    }
  }
  return active;
}

// ---------------------------------------------------------------------------
// Gesture director
// ---------------------------------------------------------------------------

export type GestureKind =
  | "idle"
  | "explain"
  | "point"
  | "count"
  | "question"
  | "emphasis"
  | "think"
  | "shrug"
  | "solemn"
  | "surprise"
  | "compare"
  | "wave"
  | "big"
  | "small";

export type Expression =
  | "neutral"
  | "happy"
  | "question"
  | "emphasis"
  | "sad"
  | "surprise"
  | "thoughtful";

export type GestureCue = {
  fromFrame: number;
  toFrame: number;
  gesture: GestureKind;
  expression: Expression;
};

export type SpeechPlan = {
  words: string[];
  starts: number[];
  /** Gesture timeline, ordered, non-overlapping. Gaps = idle. */
  cues: GestureCue[];
  /** Frames where the head nods (emphasis beats). */
  beats: number[];
};

const clean = (w: string): string => w.toLowerCase().replace(/[^a-z0-9?!\s]/g, "");

const hasAny = (words: string[], list: string[]): boolean =>
  words.some((w) => list.includes(clean(w)));

const GREETINGS = ["welcome", "hello", "hey", "hi", "greetings"];
const NUMBER_WORDS = [
  "one", "two", "three", "four", "five",
  "first", "second", "third", "fourth", "fifth",
  "1", "2", "3", "4", "5",
  "once", "twice", "single", "double", "triple",
  "reason", "reasons", "step", "steps", "rule", "rules", "ways", "things",
];
const POINT_WORDS = [
  "look", "see", "watch", "here", "this", "that", "there", "those", "these",
  "notice", "spot", "behold",
];
const THINK_WORDS = [
  "imagine", "picture", "wonder", "wondered", "think", "maybe", "perhaps",
  "mystery", "curious", "secret", "guess",
];
const COMPARE_WORDS = [
  "versus", "vs", "compared", "while", "whereas", "meanwhile", "instead",
];
const SHRUG_WORDS = [
  "but", "however", "although", "though", "yet", "despite",
  "unknown", "unclear", "nobody", "mystery",
];
const BIG_WORDS = [
  "huge", "massive", "giant", "enormous", "colossal", "vast", "towering",
  "immense", "gigantic",
];
const SMALL_WORDS = ["tiny", "small", "little", "miniature", "minuscule"];
const SOLEMN_WORDS = [
  "died", "death", "dead", "killed", "murder", "murdered", "plague",
  "war", "battle", "executed", "suffered", "tragedy", "horrible", "terrible",
  "starved", "disease",
];
const SURPRISE_WORDS = [
  "incredible", "unbelievable", "shocking", "amazing", "insane",
  "mind-blowing", "astonishing", "wild",
];
const EMPHASIS_WORDS = [
  "very", "extremely", "never", "always", "must", "really", "just", "even",
  "only",
];
const BEAT_WORDS = [
  "very", "never", "always", "every", "all", "must", "really", "not", "no",
  "so", "just",
];

function classifySentence(words: string[]): {
  gesture: GestureKind;
  expression: Expression;
} {
  const joined = words.map(clean).join(" ");
  if (/\?/.test(joined)) return {gesture: "question", expression: "question"};
  if (
    hasAny(words, SURPRISE_WORDS) ||
    /!$/.test(words[words.length - 1] ?? "")
  )
    return {gesture: "surprise", expression: "surprise"};
  if (hasAny(words, SOLEMN_WORDS)) return {gesture: "solemn", expression: "sad"};
  if (hasAny(words, NUMBER_WORDS)) return {gesture: "count", expression: "neutral"};
  if (hasAny(words, POINT_WORDS)) return {gesture: "point", expression: "neutral"};
  if (hasAny(words, THINK_WORDS)) return {gesture: "think", expression: "thoughtful"};
  if (hasAny(words, COMPARE_WORDS)) return {gesture: "compare", expression: "neutral"};
  if (hasAny(words, SHRUG_WORDS)) return {gesture: "shrug", expression: "neutral"};
  if (hasAny(words, BIG_WORDS)) return {gesture: "big", expression: "emphasis"};
  if (hasAny(words, SMALL_WORDS)) return {gesture: "small", expression: "neutral"};
  if (hasAny(words, EMPHASIS_WORDS)) return {gesture: "emphasis", expression: "emphasis"};
  return {gesture: "explain", expression: "neutral"};
}

/**
 * Build the full speech plan for one scene: word timing, a gesture cue per
 * sentence (or sub-range), and head-nod beats on emphasis words.
 */
export function planSpeech(
  text: string,
  durationInFrames: number,
  opts?: {isFirstScene?: boolean},
): SpeechPlan {
  const words = splitWords(text);
  const starts = wordStartFrames(words, durationInFrames);
  const endOf = (i: number): number =>
    i + 1 < words.length ? starts[i + 1] : durationInFrames * 0.96;

  // Split into sentences on . ! ?
  const sentences: Array<[number, number]> = [];
  let s = 0;
  words.forEach((w, i) => {
    if (/[.!?]$/.test(w) || i === words.length - 1) {
      sentences.push([s, i]);
      s = i + 1;
    }
  });

  const cues: GestureCue[] = [];
  sentences.forEach(([from, to], si) => {
    // Opening greeting gets a short wave, then the sentence continues normally.
    if (
      opts?.isFirstScene &&
      si === 0 &&
      GREETINGS.includes(clean(words[from])) &&
      to - from >= 1
    ) {
      const waveEnd = Math.min(from + 1, to);
      cues.push({
        fromFrame: starts[from],
        toFrame: endOf(waveEnd),
        gesture: "wave",
        expression: "happy",
      });
      if (waveEnd + 1 <= to) {
        const c = classifySentence(words.slice(waveEnd + 1, to + 1));
        cues.push({
          fromFrame: starts[waveEnd + 1],
          toFrame: endOf(to),
          gesture: c.gesture,
          expression: c.expression,
        });
      }
      return;
    }
    const c = classifySentence(words.slice(from, to + 1));
    cues.push({
      fromFrame: starts[from],
      toFrame: endOf(to),
      gesture: c.gesture,
      expression: c.expression,
    });
  });

  const beats: number[] = [];
  words.forEach((w, i) => {
    const c = clean(w);
    if (BEAT_WORDS.includes(c) || /!$/.test(w)) {
      beats.push(starts[i]);
    }
  });

  return {words, starts, cues, beats};
}

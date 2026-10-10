export const FPS = 30;

export type Mood = "day" | "night" | "warm" | "dark" | "cool";

export type Scene = {
  /** Narration text. Also used for the captions. */
  text: string;
  /** Optional manual duration. If missing, it is estimated from the word count. */
  seconds?: number;
  /** Path inside /public, e.g. "images/rome-morning/1.png". If missing, a gradient is used. */
  image?: string;
  /** Path inside /public, e.g. "audio/rome-morning/1.mp3". Optional voiceover. */
  audio?: string;
  /** Used for the fallback gradient when there is no image. */
  mood?: Mood;
  /** Prompt for your image generator (not used by the renderer). */
  imagePrompt?: string;
  /** Long-form only: title of the chapter this scene starts (set on the first scene of a chapter). */
  chapterTitle?: string;
  /** Long-form only: 1, 2, 3... for real chapters; 0 or missing for intro/wrap-up (no title card shown). */
  chapterNumber?: number;
  /** Set by the voice script so edited text gets re-voiced. */
  voicedText?: string;
  /**
   * Real word timings measured from the voiceover audio (forced alignment),
   * in seconds. When present and matching the word count, planSpeech uses
   * these instead of the heuristic spread so captions, mouth and gestures
   * line up with the actual spoken words.
   */
  wordTimings?: Array<{start: number; end: number}>;
};

export type ScriptProps = {
  slug: string;
  title: string;
  /** Big on-screen text shown during the first ~3 seconds (Shorts). */
  hook: string;
  channelName: string;
  scenes: Scene[];
  /** Facts for a human to double-check before posting (not rendered). */
  claimsToVerify?: string[];
};

const WORDS_PER_SECOND = 2.6;

export const sceneSeconds = (scene: Scene): number => {
  if (scene.seconds && scene.seconds > 0) {
    return scene.seconds;
  }
  const words = scene.text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round((words / WORDS_PER_SECOND) * 10) / 10);
};

export const sceneFrames = (scene: Scene): number =>
  Math.round(sceneSeconds(scene) * FPS);

export const totalFrames = (scenes: Scene[]): number =>
  Math.max(
    FPS,
    scenes.reduce((sum, scene) => sum + sceneFrames(scene), 0),
  );

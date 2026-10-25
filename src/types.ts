export const FPS = 30;

export type Mood = "day" | "night" | "warm" | "dark" | "cool";

export type DriftKind = "push-in" | "pull-back" | "pan-left" | "pan-right" | "still";

/** How the narrator's body reacts to the scene (on top of gestures). */
export type ReactionKind = "look-up" | "lean-in" | "recoil" | "none";

/** Ambient life over the background image. */
export type AtmosphereKind = "dust" | "ember" | "none";

/**
 * Per-scene stage direction: how the narrator shares the frame with the
 * background image. All fields are optional — anything missing falls back
 * to the defaults (centered narrator, push-in drift, no focus aiming).
 */
export type SceneDirection = {
  /**
   * Focus point in the background image, normalized 0..1 (x → right,
   * y → down). During "point" and "explain" gestures the narrator's pupils,
   * head tilt and pointing arm aim at this spot, and the camera drifts
   * toward it.
   */
  focus?: [number, number];
  /** Horizontal anchor of the narrator, as a fraction of frame width. Default 0.5. */
  narratorX?: number;
  /** Narrator scale multiplier. Default 1. Use < 1 to keep busy artwork visible. */
  narratorScale?: number;
  /** Camera drift style for the background. Default "push-in". */
  drift?: DriftKind;
  /**
   * Body reaction to the scene, layered over gestures. Default: "look-up"
   * when the focus point is high in the frame (focus.y < 0.3), else "none".
   */
  reaction?: ReactionKind;
  /** Ambient particles over the background. Default "dust". */
  atmosphere?: AtmosphereKind;
  /** Warm candle/fire light pulse over the scene. Default false. */
  warmFlicker?: boolean;
};

export type NPCPosition = "left-corner" | "left-bench" | "left" | "center" | "right";

export type NPCArchetype =
  | "citizen"
  | "doctor"
  | "worker"
  | "guard"
  | "merchant";

export type NPCConfig = {
  archetype?: NPCArchetype;
  theme?: string;
  tunic?: string;
  position?: NPCPosition;
  facing?: "left" | "right";
  height?: number;
  x?: number;
  y?: number;
  gesture?: "explain" | "point" | "shrug" | "think" | "wave" | "idle";
  reaction?: ReactionKind;
  expression?: "idle" | "nervous" | "grumpy" | "surprise" | "happy" | "sad";
  speechBubble?: string;
  audio?: string;
  talking?: boolean;
};

export type Scene = {
  /** Narration text. Also used for the captions. */
  text: string;
  /** Active speaker: narrator (default) or npc. */
  speaker?: "narrator" | "npc";
  /** Speaker label displayed in subtitles if desired (e.g. "VOLUNTEER"). */
  speakerName?: string;
  /** Optional manual duration. If missing, it is estimated from the word count. */
  seconds?: number;
  /** Path inside /public, e.g. "images/rome-morning/1.png". If missing, a gradient is used. */
  image?: string;
  /** Path inside /public, e.g. "audio/rome-morning/1.mp3". Optional voiceover. */
  audio?: string;
  /** Optional ambient soundscape audio track for the scene or chapter. */
  ambientAudio?: string;
  /** Secondary interactive character (NPC) in the scene. */
  npc?: NPCConfig;
  /** Used for the fallback gradient when there is no image. */
  mood?: Mood;
  /** Prompt for your image generator (not used by the renderer). */
  imagePrompt?: string;
  /** Long-form only: title of the chapter this scene starts (set on the first scene of a chapter). */
  chapterTitle?: string;
  /** Long-form only: 1, 2, 3... for real chapters; 0 or missing for intro/wrap-up (no title card shown). */
  chapterNumber?: number;
  /** Stage direction for the narrator/scene interaction (optional, defaults apply). */
  direction?: SceneDirection;
  /** Ink Explainer layout modes: corner (default), center-stage, split-screen, or walking */
  layout?: LongformLayout;
  /** Configuration for split-screen comparison mode */
  splitScreen?: SplitScreenConfig;
  /** Optional sound effect audio track (e.g. whoosh, pop, ding) */
  sfx?: string;
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

export type LongformLayout = "corner" | "center-stage" | "split-screen" | "walking";

export type SplitScreenConfig = {
  leftTitle: string;
  leftSubtitle?: string;
  leftImage?: string;
  leftBadge?: string;
  rightTitle: string;
  rightSubtitle?: string;
  rightImage?: string;
  rightBadge?: string;
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
  /** Explicit narrator costume / dress theme override. */
  narratorTheme?: string;
  /** Custom primary dress/tunic color hex override (e.g. "#7c2d12"). */
  narratorTunic?: string;
  /** Custom secondary accent/trim color hex override (e.g. "#d4af37"). */
  narratorAccent?: string;
  /** Selected visual art style preset id. */
  artStyle?: string;
  /** Selected voice id used for synthesis. */
  voice?: string;
  /** Language code ("en" | "taglish" | "tl"). */
  language?: string;
  /** Episodic series badge shown in the top safe-zone header (e.g. "🇵🇭 Philippine Dark Lore"). */
  seriesTag?: string;
  /** Polarizing debate question to pin in comments for 3x-4x algorithmic reach. */
  pinnedComment?: string;
  /** Owner user ID when created in multi-user studio. */
  authorId?: string;
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

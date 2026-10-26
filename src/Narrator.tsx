import React, {useMemo} from "react";
import {
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {getWaveformPortion, useAudioData} from "@remotion/media-utils";
import {
  Expression,
  GestureKind,
  SpeechPlan,
  activeWordIndex,
} from "./speech";
import {NPCArchetype, ReactionKind} from "./types";
import {
  ArchetypeFaceDetails,
  ArchetypeHeadwear,
  ArchetypeOutfit,
} from "./NPCArchetypes";

export type CharacterTheme =
  | "roman"
  | "egypt"
  | "viking"
  | "medieval"
  | "knight"
  | "plague-doctor"
  | "greek"
  | "gladiator"
  | "ninja"
  | "asian"
  | "mesoamerica"
  | "pirate"
  | "victorian"
  | "wwii"
  | "ottoman"
  | "witch"
  | "vampire"
  | "werewolf"
  | "ghost"
  | "krampus"
  | "executioner"
  | "druid"
  | "mummy"
  | "gravedigger"
  | "nun"
  | "demon"
  | "albularyo"
  | "barong"
  | "katipunero"
  | "babaylan"
  | "filipina"
  | "modern";

export function getThemeFromSlug(slug: string = ""): CharacterTheme {
  const s = slug.toLowerCase();
  if (
    s.includes("wwii") ||
    s.includes("ration") ||
    (s.includes("war") && s.includes("britain"))
  ) {
    return "wwii";
  }
  if (
    s.includes("victorian") ||
    s.includes("chimney") ||
    s.includes("factory") ||
    s.includes("gold-rush")
  ) {
    return "victorian";
  }
  if (s.includes("pirate")) {
    return "pirate";
  }
  if (s.includes("ottoman") || s.includes("coffeehouse")) {
    return "ottoman";
  }
  if (
    s.includes("aztec") ||
    s.includes("maya") ||
    s.includes("inca") ||
    s.includes("chinampa") ||
    s.includes("mesoamerica")
  ) {
    return "mesoamerica";
  }
  if (s.includes("gladiator")) {
    return "gladiator";
  }
  if (
    s.includes("egypt") ||
    s.includes("pharaoh") ||
    s.includes("pyramid") ||
    s.includes("mummy") ||
    s.includes("embalmer") ||
    s.includes("mesopotamia") ||
    s.includes("scribe")
  ) {
    return "egypt";
  }
  if (
    s.includes("greek") ||
    s.includes("athens") ||
    s.includes("sparta") ||
    s.includes("olympic") ||
    s.includes("symposium") ||
    s.includes("byzantine") ||
    s.includes("delphi") ||
    s.includes("oracle")
  ) {
    return "greek";
  }
  if (s.includes("viking") || s.includes("norse")) {
    return "viking";
  }
  if (s.includes("ninja") || s.includes("shinobi")) {
    return "ninja";
  }
  if (
    s.includes("china") ||
    s.includes("han-") ||
    s.includes("silk-road") ||
    s.includes("tang") ||
    s.includes("song") ||
    s.includes("ming") ||
    s.includes("samurai") ||
    s.includes("edo") ||
    s.includes("mongol")
  ) {
    return "asian";
  }
  if (s.includes("knight")) {
    return "knight";
  }
  if (s.includes("plague")) {
    return "plague-doctor";
  }
  // ---- Halloween Specials 2026: the narrator dresses for the topic ----
  const HWEEN: Record<string, CharacterTheme> = {
    "halloween-history-short": "plague-doctor",
    "samhain-night": "druid",
    "banshee": "ghost",
    "vlad-impaler": "vampire",
    "witch-finder": "witch",
    "tower-ghosts": "ghost",
    "plague-doctor-short": "plague-doctor",
    "dancing-plague": "plague-doctor",
    "body-snatchers": "gravedigger",
    "taphophobia": "victorian",
    "catacombs-paris": "gravedigger",
    "bathory": "vampire",
    "beast-gevaudan": "werewolf",
    "werewolf-trials": "werewolf",
    "krampus": "krampus",
    "headless-horseman": "ghost",
    "bell-witch": "witch",
    "flying-dutchman": "pirate",
    "spring-heeled-jack": "demon",
    "jack-ripper-short": "victorian",
    "green-children": "medieval",
    "tollund-man": "druid",
    "sin-eaters": "medieval",
    "corpse-roads": "gravedigger",
    "vampire-panics": "vampire",
    "salem-witches": "witch",
    "black-death-night": "plague-doctor",
    "mirror-veil": "victorian",
    "mummy-parties": "mummy",
    "london-fire": "victorian",
    "pompeii-short": "roman",
    "llorona": "ghost",
    "loudun": "nun",
    "goldi": "witch",
    "edinburgh-vaults": "victorian",
    "executioner": "executioner",
  };
  if (HWEEN[s]) {
    return HWEEN[s];
  }
  if (s.includes("witch")) {
    return "witch";
  }
  if (s.includes("vampire")) {
    return "vampire";
  }
  if (s.includes("werewolf")) {
    return "werewolf";
  }
  if (s.includes("ghost")) {
    return "ghost";
  }
  if (s.includes("halloween") || s.includes("haunt")) {
    return "plague-doctor";
  }
  if (
    s.includes("medieval") ||
    s.includes("castle") ||
    s.includes("peasant") ||
    s.includes("blacksmith") ||
    s.includes("monk") ||
    s.includes("miller") ||
    s.includes("barber") ||
    s.includes("dark-ages") ||
    s.includes("tudor") ||
    s.includes("renaissance") ||
    s.includes("wages") ||
    s.includes("fast-days")
  ) {
    return "medieval";
  }
  if (
    s.includes("mangkukulam") ||
    s.includes("manananggal") ||
    s.includes("aswang") ||
    s.includes("tikbalang") ||
    s.includes("kapre") ||
    s.includes("bakunawa") ||
    s.includes("tiyanak") ||
    s.includes("duwende") ||
    s.includes("biringan") ||
    s.includes("kulam") ||
    s.includes("barang") ||
    s.includes("anting") ||
    s.includes("albularyo") ||
    s.includes("babaylan")
  ) {
    return "albularyo";
  }
  if (s.includes("katipunan") || s.includes("katipunero") || s.includes("rizal") || s.includes("bonifacio")) {
    return "katipunero";
  }
  if (s.includes("barong") || s.includes("filipino") || s.includes("philippine") || s.includes("manila")) {
    return "barong";
  }
  if (s.includes("modern") || s.includes("urban")) {
    return "modern";
  }
  return "roman";
}

/** Legacy gesture names still accepted as an explicit override. */
export type Gesture =
  | "explain"
  | "point"
  | "shrug"
  | "think"
  | "wave"
  | "idle";

type Props = {
  theme?: CharacterTheme;
  archetype?: NPCArchetype;
  talking?: boolean;
  height?: number;
  tunic?: string;
  accentColor?: string;
  /** Explicit gesture override (legacy). When `plan` is given, the plan wins. */
  gesture?: Gesture;
  /** Speech plan from planSpeech(): gestures follow the narration. */
  plan?: SpeechPlan;
  /** Path inside /public, e.g. "audio/rome-morning/1.mp3". Enables true lipsync. */
  audioSrc?: string;
  /** Frame offset inside the scene (0 when the narrator owns the sequence). */
  frameOffset?: number;
  /**
   * Scene focus point in frame-normalized coords (0..1, x → right, y → down).
   * During "point"/"explain" gestures the pupils, head tilt and pointing arm
   * aim at it, so the narrator interacts with the background image.
   */
  focus?: {x: number; y: number};
  /** Narrator's horizontal anchor as a fraction of frame width. Default 0.5. */
  anchorX?: number;
  /**
   * Body reaction to the scene ("look-up" | "lean-in" | "recoil" | "none"),
   * layered over the gesture poses. When omitted and the focus point sits
   * high in the frame, the narrator looks up at it automatically.
   */
  reaction?: ReactionKind;
};

// ---------------------------------------------------------------------------
// Pose system — every gesture is a full-body pose; the narrator eases between
// poses instead of snapping, and only moves when the story calls for it.
// ---------------------------------------------------------------------------

type Vec = [number, number];

type Pose = {
  lElbow: Vec;
  lHand: Vec;
  rElbow: Vec;
  rHand: Vec;
  headTilt: number; // degrees, + = tilt to narrator's right
  headDy: number; // px, + = bow down
  lean: number; // body lean, degrees
  shiftX: number; // body shift, px
};

const IDLE_POSE: Pose = {
  lElbow: [80, 262],
  lHand: [68, 336],
  rElbow: [220, 262],
  rHand: [232, 336],
  headTilt: 0,
  headDy: 0,
  lean: 0,
  shiftX: 0,
};

const POSES: Record<GestureKind, Pose> = {
  idle: IDLE_POSE,
  explain: {
    lElbow: [58, 246],
    lHand: [38, 262],
    rElbow: [242, 246],
    rHand: [262, 262],
    headTilt: 0,
    headDy: 0,
    lean: 0,
    shiftX: 0,
  },
  point: {
    lElbow: [82, 265],
    lHand: [70, 325],
    rElbow: [232, 218],
    rHand: [272, 168],
    headTilt: 5,
    headDy: 0,
    lean: 4,
    shiftX: 10,
  },
  count: {
    lElbow: [70, 240],
    lHand: [56, 178],
    rElbow: [220, 262],
    rHand: [232, 336],
    headTilt: -3,
    headDy: 0,
    lean: -2,
    shiftX: -6,
  },
  question: {
    lElbow: [60, 250],
    lHand: [44, 218],
    rElbow: [220, 262],
    rHand: [232, 336],
    headTilt: 9,
    headDy: 2,
    lean: -2,
    shiftX: -6,
  },
  emphasis: {
    lElbow: [70, 250],
    lHand: [60, 302],
    rElbow: [230, 250],
    rHand: [240, 302],
    headTilt: 0,
    headDy: 4,
    lean: 6,
    shiftX: 0,
  },
  think: {
    lElbow: [85, 255],
    lHand: [135, 285],
    rElbow: [225, 245],
    rHand: [182, 162],
    headTilt: -6,
    headDy: 3,
    lean: -2,
    shiftX: 0,
  },
  shrug: {
    lElbow: [55, 235],
    lHand: [35, 218],
    rElbow: [245, 235],
    rHand: [265, 218],
    headTilt: 4,
    headDy: 0,
    lean: 0,
    shiftX: 0,
  },
  solemn: {
    lElbow: [90, 260],
    lHand: [132, 318],
    rElbow: [210, 260],
    rHand: [168, 318],
    headTilt: 0,
    headDy: 13,
    lean: 3,
    shiftX: 0,
  },
  surprise: {
    lElbow: [52, 230],
    lHand: [30, 168],
    rElbow: [248, 230],
    rHand: [270, 168],
    headTilt: 0,
    headDy: -5,
    lean: -3,
    shiftX: 0,
  },
  compare: {
    lElbow: [58, 246],
    lHand: [40, 264],
    rElbow: [242, 246],
    rHand: [260, 264],
    headTilt: 0,
    headDy: 0,
    lean: 0,
    shiftX: 0,
  },
  wave: {
    lElbow: [78, 260],
    lHand: [68, 330],
    rElbow: [242, 208],
    rHand: [268, 138],
    headTilt: -3,
    headDy: 0,
    lean: 0,
    shiftX: 0,
  },
  big: {
    lElbow: [50, 240],
    lHand: [24, 198],
    rElbow: [250, 240],
    rHand: [276, 198],
    headTilt: 0,
    headDy: -2,
    lean: -2,
    shiftX: 0,
  },
  small: {
    lElbow: [95, 255],
    lHand: [128, 282],
    rElbow: [205, 255],
    rHand: [172, 282],
    headTilt: 3,
    headDy: 2,
    lean: 2,
    shiftX: 0,
  },
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const lerpVec = (a: Vec, b: Vec, t: number): Vec => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
  lElbow: lerpVec(a.lElbow, b.lElbow, t),
  lHand: lerpVec(a.lHand, b.lHand, t),
  rElbow: lerpVec(a.rElbow, b.rElbow, t),
  rHand: lerpVec(a.rHand, b.rHand, t),
  headTilt: lerp(a.headTilt, b.headTilt, t),
  headDy: lerp(a.headDy, b.headDy, t),
  lean: lerp(a.lean, b.lean, t),
  shiftX: lerp(a.shiftX, b.shiftX, t),
});

const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/** Mirror a pose horizontally (viewBox is 300 wide) so the narrator can
    point with the left arm when the scene focus is to their left. */
const mirrorPose = (p: Pose): Pose => {
  const mx = (v: Vec): Vec => [300 - v[0], v[1]];
  return {
    lElbow: mx(p.rElbow),
    lHand: mx(p.rHand),
    rElbow: mx(p.lElbow),
    rHand: mx(p.lHand),
    headTilt: -p.headTilt,
    headDy: p.headDy,
    lean: -p.lean,
    shiftX: -p.shiftX,
  };
};

/** Slight overshoot so gestures land with energy instead of gliding in. */
const easeOutBack = (t: number): number => {
  const c = 1.3;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

const BLEND_FRAMES = 10;

/** Exported for unit testing the gesture director. */
export {POSES, IDLE_POSE, BLEND_FRAMES};

/**
 * Resolve the eased pose + expression for a frame from the speech plan.
 * Between cues the narrator settles back to idle — no random motion.
 * Exported for unit testing.
 */
export function poseAtFrame(
  plan: SpeechPlan,
  frame: number,
): {pose: Pose; expression: Expression; gesture: GestureKind} {
  const {cues} = plan;
  const active = cues.find((c) => frame >= c.fromFrame && frame <= c.toFrame);
  if (active) {
    const prevIdx = cues.indexOf(active) - 1;
    const prevPose = prevIdx >= 0 ? POSES[cues[prevIdx].gesture] : IDLE_POSE;
    const t = easeOutBack(
      Math.min(1, Math.max(0, (frame - active.fromFrame) / BLEND_FRAMES)),
    );
    return {
      pose: lerpPose(prevPose, POSES[active.gesture], t),
      expression: active.expression,
      gesture: active.gesture,
    };
  }
  const last = [...cues].reverse().find((c) => frame > c.toFrame);
  if (last) {
    const t =
      1 -
      easeInOut(
        Math.min(1, Math.max(0, (frame - last.toFrame) / BLEND_FRAMES)),
      );
    return {
      pose: lerpPose(IDLE_POSE, POSES[last.gesture], t),
      expression: t > 0.5 ? last.expression : "neutral",
      gesture: "idle",
    };
  }
  return {pose: IDLE_POSE, expression: "neutral", gesture: "idle"};
}

// ---------------------------------------------------------------------------
// Mouth
// ---------------------------------------------------------------------------

/** Mouth openness 0..1 driven by the real voiceover volume. */
const AudioMouth: React.FC<{
  audioSrc: string;
  frame: number;
  fps: number;
  children: (mouthOpen: number | null) => React.ReactNode;
}> = ({audioSrc, frame, fps, children}) => {
  const audioData = useAudioData(staticFile(audioSrc));
  const mouthOpen = useMemo(() => {
    if (!audioData) {
      return null; // not loaded yet -> caller falls back to word timing
    }
    // Time-domain amplitude for this frame: the true speech envelope.
    // (visualizeAudio returns FFT frequency bins — averaging those gives
    // near-zero for speech and can never drive a mouth.)
    const portion = getWaveformPortion({
      audioData,
      startTimeInSeconds: Math.max(0, (frame - 1) / fps),
      durationInSeconds: 3 / fps,
      numberOfSamples: 24,
      outputRange: "zero-to-one",
      normalize: false,
    });
    const vol =
      portion.reduce((a, b) => a + b.amplitude, 0) / portion.length;
    const open = Math.min(1, Math.max(0, (vol - 0.02) / 0.18));
    // Gentle curve so it reads as speech, not a meter. The flutter is kept
    // tiny on purpose: the open/close rhythm must come from the audio alone,
    // otherwise the mouth visibly drifts out of sync with the voice.
    return Math.pow(open, 0.7) * (0.97 + 0.03 * Math.sin(frame * 1.35));
  }, [audioData, frame, fps]);
  return <>{children(mouthOpen)}</>;
};

/** Fallback mouth: opens and closes in rhythm with the captioned words. */
function wordTimingMouth(
  plan: SpeechPlan | undefined,
  frame: number,
  talking: boolean,
): number {
  if (!talking) return 0;
  if (!plan) {
    const c = Math.floor(frame / 4) % 4;
    return c === 0 ? 0 : c === 1 ? 0.55 : 0.9;
  }
  const i = activeWordIndex(plan.starts, frame);
  const start = plan.starts[i] ?? 0;
  const end = i + 1 < plan.starts.length ? plan.starts[i + 1] : start + 12;
  if (frame < start || frame > end + 4) return 0;
  const t = Math.min(1, Math.max(0, (frame - start) / Math.max(1, end - start)));
  return Math.sin(Math.PI * t) * (0.75 + 0.25 * Math.sin(frame * 2.1));
}

// ---------------------------------------------------------------------------
// Face helpers
// ---------------------------------------------------------------------------

const SKIN = "#f2dcb0";
const SKIN_EGYPT = "#e5b780";
const SKIN_MESOAMERICA = "#c68d58";
const INK = "#111";

/** Eyebrows for every expression. Plague doctor has no visible face. */
const Brows: React.FC<{expression: Expression}> = ({expression}) => {
  // Each brow: [x1, y1, cx, cy, x2, y2] quadratic curve
  const left: Record<Expression, [number, number, number, number, number, number]> = {
    neutral: [117, 70, 128, 66, 139, 70],
    happy: [117, 68, 128, 64, 139, 68],
    question: [117, 62, 128, 58, 139, 62],
    emphasis: [117, 73, 128, 68, 139, 66],
    sad: [117, 66, 128, 70, 139, 68],
    surprise: [115, 60, 128, 56, 141, 60],
    thoughtful: [117, 70, 128, 66, 139, 70],
    spooked: [117, 66, 128, 60, 139, 53],
  };
  const right: Record<Expression, [number, number, number, number, number, number]> = {
    neutral: [161, 70, 172, 66, 183, 70],
    happy: [161, 68, 172, 64, 183, 68],
    question: [161, 60, 172, 55, 183, 60],
    emphasis: [161, 66, 172, 68, 183, 73],
    sad: [161, 68, 172, 70, 183, 66],
    surprise: [159, 60, 172, 56, 185, 60],
    thoughtful: [161, 62, 172, 58, 183, 62],
    spooked: [161, 53, 172, 60, 183, 66],
  };
  const L = left[expression];
  const R = right[expression];
  const w = expression === "emphasis" ? 6 : 5;
  return (
    <g stroke={INK} strokeWidth={w} strokeLinecap="round" fill="none">
      <path d={`M ${L[0]} ${L[1]} Q ${L[2]} ${L[3]} ${L[4]} ${L[5]}`} />
      <path d={`M ${R[0]} ${R[1]} Q ${R[2]} ${R[3]} ${R[4]} ${R[5]}`} />
    </g>
  );
};

const Hand: React.FC<{
  x: number;
  y: number;
  /** Elbow position, so fingers aim away from the arm. */
  fromX: number;
  fromY: number;
  side: "left" | "right";
  variant?: "open" | "fist" | "point" | "count";
  skin?: string;
}> = ({x, y, fromX, fromY, side, variant = "open", skin = SKIN}) => {
  const ang = Math.atan2(y - fromY, x - fromX);
  const fingerLine = (a: number, len: number, w = 3.5) => {
    const bx = x + Math.cos(a) * 6;
    const by = y + Math.sin(a) * 6;
    return (
      <line
        x1={bx}
        y1={by}
        x2={bx + Math.cos(a) * len}
        y2={by + Math.sin(a) * len}
        stroke={INK}
        strokeWidth={w}
        strokeLinecap="round"
      />
    );
  };
  return (
    <g>
      {variant === "point" ? (
        // Extended index finger along the pointing direction
        fingerLine(ang, 15, 4)
      ) : variant === "open" || variant === "count" ? (
        <g>
          {fingerLine(ang - 0.38, variant === "count" ? 12 : 8)}
          {fingerLine(ang, variant === "count" ? 14 : 9)}
          {fingerLine(ang + 0.38, variant === "count" ? 12 : 8)}
        </g>
      ) : null}
      <circle
        cx={x}
        cy={y}
        r={variant === "fist" ? 9 : 8}
        fill={skin}
        stroke={INK}
        strokeWidth={3.5}
      />
      {/* thumb */}
      <circle
        cx={x + (side === "left" ? -7 : 7)}
        cy={y - 1}
        r={3.6}
        fill={skin}
        stroke={INK}
        strokeWidth={2.5}
      />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Narrator
// ---------------------------------------------------------------------------

type BodyProps = Props & {
  mouthOpen: number;
  frame: number;
};

const NarratorBody: React.FC<BodyProps> = ({
  theme = "roman",
  archetype,
  height = 760,
  tunic,
  accentColor,
  gesture,
  plan,
  frame,
  mouthOpen,
  focus,
  anchorX = 0.5,
  reaction,
}) => {
  // Resolve pose + expression: speech plan wins, explicit gesture next, idle last.
  const {pose, expression, gesture: activeGesture} = useMemo(() => {
    if (plan) return poseAtFrame(plan, frame);
    if (gesture && gesture !== "idle") {
      const g = gesture as GestureKind;
      return {pose: POSES[g] ?? IDLE_POSE, expression: "neutral" as Expression, gesture: g};
    }
    return {pose: IDLE_POSE, expression: "neutral" as Expression, gesture: "idle" as GestureKind};
  }, [plan, frame, gesture]);

  // Scene interaction: normalized direction from the narrator's head to the
  // scene focus point (frame coords, 1080x1920). The SVG viewBox is 300x600
  // and the wrapper plants the feet at bottom:40.
  const aim = useMemo(() => {
    if (!focus) return null;
    const s = height / 600;
    const headX = anchorX * 1080;
    const headY = 1920 - 40 - height + 100 * s;
    const dx = focus.x * 1080 - headX;
    const dy = focus.y * 1920 - headY;
    const len = Math.hypot(dx, dy) || 1;
    return {nx: dx / len, ny: dy / len};
  }, [focus, anchorX, height]);

  const aimActive = !!aim && (activeGesture === "point" || activeGesture === "explain");
  // Point with the left arm when the focus is clearly to the narrator's left.
  const pointLeft = activeGesture === "point" && !!aim && aim.nx < -0.15;
  const resolvedPose = useMemo(
    () => (pointLeft ? mirrorPose(pose) : pose),
    [pointLeft, pose],
  );

  // Head-nod beats on emphasis words.
  const nod = useMemo(() => {
    if (!plan) return 0;
    let total = 0;
    for (const bf of plan.beats) {
      const d = (frame - bf) / 3.5;
      if (Math.abs(d) < 3) total += Math.exp(-d * d);
    }
    return Math.min(1.2, total) * 7;
  }, [plan, frame]);

  // Hand shape follows the gesture: fists for emphasis, index finger for
  // pointing, raised fingers for counting, open hands otherwise.
  const handVariant = (side: "left" | "right"): "open" | "fist" | "point" | "count" => {
    if (activeGesture === "emphasis") return "fist";
    if (activeGesture === "point") return side === (pointLeft ? "left" : "right") ? "point" : "open";
    if (activeGesture === "count" && side === "left") return "count";
    return "open";
  };

  // Eyes face the viewer / audience directly so the host engages with the user.
  // Subtle natural eye saccade/breathing keeps them feeling alive, not frozen.
  const lookX = activeGesture === "idle" ? Math.sin(frame / 60) * 0.8 : 0;
  const lookY = 0;

  // Life, not randomness: breathing is always on but subtle; gesture-specific
  // motion only plays while its gesture is active.
  const breath = Math.sin(frame / 26) * 2.5;
  // Horror-story shiver: a fast, subtle tremble while spooked.
  const shiverX = expression === "spooked" ? Math.sin(frame / 2.1) * 2.4 : 0;
  const p = {...resolvedPose};
  if (activeGesture === "explain") {
    const m = Math.sin(frame / 9) * 7;
    p.lHand = [p.lHand[0], p.lHand[1] + m];
    p.rHand = [p.rHand[0], p.rHand[1] - m];
  } else if (activeGesture === "compare") {
    const m = Math.sin(frame / 10) * 10;
    p.lHand = [p.lHand[0], p.lHand[1] + m];
    p.rHand = [p.rHand[0], p.rHand[1] - m];
  } else if (activeGesture === "wave") {
    p.rHand = [p.rHand[0] + Math.sin(frame / 5) * 16, p.rHand[1]];
  } else if (activeGesture === "shrug") {
    const m = Math.sin(frame / 12) * 5;
    p.lHand = [p.lHand[0], p.lHand[1] + m];
    p.rHand = [p.rHand[0], p.rHand[1] + m];
  } else if (activeGesture === "point") {
    const wobbleHand = (pointLeft ? "lHand" : "rHand") as "lHand" | "rHand";
    p[wobbleHand] = [p[wobbleHand][0], p[wobbleHand][1] + Math.sin(frame / 14) * 4];
    // Aim the pointing arm at the scene focus point.
    if (aim) {
      const hx = (pointLeft ? "lHand" : "rHand") as "lHand" | "rHand";
      const ex = (pointLeft ? "lElbow" : "rElbow") as "lElbow" | "rElbow";
      p[hx] = [p[hx][0] + aim.nx * 30, p[hx][1] + aim.ny * 30];
      p[ex] = [p[ex][0] + aim.nx * 12, p[ex][1] + aim.ny * 12];
    }
  }
  // Head turns toward the scene focus while presenting it.
  if (aimActive && aim) {
    p.headTilt += Math.max(-8, Math.min(8, aim.nx * 10));
  }
  // Body reaction to the scene, layered over whatever the gesture is doing.
  // Defaults to looking up when the focus sits high in the frame.
  const effectiveReaction: ReactionKind =
    reaction ?? (focus && focus.y < 0.3 ? "look-up" : "none");
  if (effectiveReaction === "look-up") {
    p.headDy -= 7;
    p.lean -= 3;
  } else if (effectiveReaction === "lean-in") {
    p.headDy += 5;
    p.shiftX += (aim ? Math.sign(aim.nx) : 0) * 10;
  } else if (effectiveReaction === "recoil") {
    p.lean -= 4;
    p.headDy -= 4;
    p.shiftX -= 8;
  }
  // Emphasis beats pump the fists as well as the head.
  if (activeGesture === "emphasis" && nod > 0.5) {
    const pump = nod * 0.9;
    p.lHand = [p.lHand[0], p.lHand[1] + pump];
    p.rHand = [p.rHand[0], p.rHand[1] + pump];
  }
  // Idle isn't frozen: a slow, calm weight shift (one sway every ~5s).
  if (activeGesture === "idle") {
    p.shiftX += Math.sin(frame / 160) * 5;
  }

  // Eye blink on a natural-ish cycle; surprise widens the eyes.
  const blinkT = frame % 107;
  const eyeScaleY =
    interpolate(blinkT, [0, 4, 8], [1, 0.1, 1], {
      extrapolateRight: "clamp",
    }) * (expression === "surprise" ? 1.2 : expression === "spooked" ? 1.35 : 1);

  const skin =
    theme === "egypt"
      ? SKIN_EGYPT
      : theme === "mesoamerica"
      ? SKIN_MESOAMERICA
      : theme === "ghost"
      ? "#eef1f7"
      : theme === "vampire"
      ? "#f2e7de"
      : SKIN;
  const talking = mouthOpen > 0.06;

  // Viseme: the mouth shape follows the vowel of the word being spoken,
  // so it forms words instead of just opening and closing.
  const activeWord = plan
    ? (plan.words[activeWordIndex(plan.starts, frame)] ?? "")
    : "";
  const viseme: "open" | "o" | "wide" = (() => {
    const w = activeWord.toLowerCase();
    if (/[ou]/.test(w)) return "o";
    if (/a/.test(w)) return "open";
    if (/[ei]/.test(w)) return "wide";
    return "open";
  })();
  const visemeSize = {
    open: {rx: 13, ry: 4 + 10 * mouthOpen},
    o: {rx: 7 + 4 * mouthOpen, ry: 5 + 8 * mouthOpen},
    wide: {rx: 12 + 5 * mouthOpen, ry: 3 + 5 * mouthOpen},
  }[viseme];

  return (
    <svg
      viewBox="0 0 300 600"
      height={height}
      style={{
        overflow: "visible",
        transform: `translateX(${p.shiftX + shiverX}px) translateY(${breath}px) rotate(${p.lean}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      {/* ================= LEGS ================= */}
      {theme === "egypt" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <rect x="110" y="555" width="20" height="8" rx="2" fill="#e5b32f" stroke={INK} strokeWidth="3" />
          <rect x="170" y="555" width="20" height="8" rx="2" fill="#e5b32f" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "mesoamerica" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          {/* Bare feet on leather soles */}
          <line x1="120" y1="572" x2="98" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          {/* Leather cactli heel guards and ankle wraps */}
          <rect x="114" y="550" width="12" height="22" rx="3" fill="#7a421d" stroke={INK} strokeWidth="3" />
          <rect x="174" y="550" width="12" height="22" rx="3" fill="#7a421d" stroke={INK} strokeWidth="3" />
          <line x1="112" y1="500" x2="126" y2="512" stroke="#7a421d" strokeWidth="4" />
          <line x1="126" y1="520" x2="114" y2="532" stroke="#7a421d" strokeWidth="4" />
          <line x1="172" y1="500" x2="186" y2="512" stroke="#7a421d" strokeWidth="4" />
          <line x1="186" y1="520" x2="174" y2="532" stroke="#7a421d" strokeWidth="4" />
        </>
      ) : theme === "ninja" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          {/* Leg wrappings (kyahan) */}
          <line x1="114" y1="500" x2="126" y2="500" stroke="#33333d" strokeWidth="4" />
          <line x1="114" y1="520" x2="126" y2="520" stroke="#33333d" strokeWidth="4" />
          <line x1="174" y1="500" x2="186" y2="500" stroke="#33333d" strokeWidth="4" />
          <line x1="174" y1="520" x2="186" y2="520" stroke="#33333d" strokeWidth="4" />
          {/* Ninja Tabi boots */}
          <path d="M100 560 L128 560 L126 580 L94 580 Z" fill="#18181f" stroke={INK} strokeWidth="4" />
          <path d="M172 560 L200 560 L206 580 L174 580 Z" fill="#18181f" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "asian" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <path d="M100 558 L128 558 L126 580 L94 580 Z" fill="#2b2d38" stroke={INK} strokeWidth="4" />
          <path d="M172 558 L200 558 L206 580 L174 580 Z" fill="#2b2d38" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "viking" || theme === "knight" || theme === "medieval" || theme === "druid" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <path d="M102 555 L130 555 L128 580 L92 580 Z" fill="#4a2e18" stroke={INK} strokeWidth="4" />
          <path d="M170 555 L198 555 L208 580 L172 580 Z" fill="#4a2e18" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "greek" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="112" y1="510" x2="128" y2="520" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="128" y1="525" x2="114" y2="538" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="114" y1="545" x2="126" y2="555" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="172" y1="510" x2="188" y2="520" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="188" y1="525" x2="174" y2="538" stroke="#7a4e2a" strokeWidth="4" />
          <line x1="174" y1="545" x2="186" y2="555" stroke="#7a4e2a" strokeWidth="4" />
        </>
      ) : theme === "gladiator" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <path d="M168 470 L190 470 L188 555 L168 555 Z" fill="#d49b33" stroke={INK} strokeWidth="4" />
          <line x1="168" y1="495" x2="190" y2="495" stroke="#946513" strokeWidth="3" />
          <line x1="168" y1="525" x2="189" y2="525" stroke="#946513" strokeWidth="3" />
          <line x1="112" y1="490" x2="128" y2="500" stroke="#633e1f" strokeWidth="5" />
          <line x1="128" y1="515" x2="114" y2="525" stroke="#633e1f" strokeWidth="5" />
          <line x1="114" y1="542" x2="126" y2="552" stroke="#633e1f" strokeWidth="5" />
        </>
      ) : theme === "wwii" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          {/* 1940s Oxford shoes */}
          <path d="M100 558 L128 558 L126 580 L94 580 Z" fill="#1c1a17" stroke={INK} strokeWidth="4" />
          <path d="M172 558 L200 558 L206 580 L174 580 Z" fill="#1c1a17" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "victorian" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          {/* Victorian work boots */}
          <path d="M98 554 L130 554 L128 580 L92 580 Z" fill="#211e1b" stroke={INK} strokeWidth="4" />
          <path d="M170 554 L202 554 L208 580 L172 580 Z" fill="#211e1b" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "pirate" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          {/* Folded pirate boot cuffs */}
          <path d="M108 520 L136 520 L134 545 L106 545 Z" fill="#3b2012" stroke={INK} strokeWidth="3" />
          <path d="M164 520 L192 520 L194 545 L166 545 Z" fill="#3b2012" stroke={INK} strokeWidth="3" />
          {/* Boots */}
          <path d="M100 556 L130 556 L128 580 L92 580 Z" fill="#23130a" stroke={INK} strokeWidth="4" />
          <path d="M170 556 L200 556 L208 580 L172 580 Z" fill="#23130a" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "ottoman" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          {/* Pointed Turkish shoes */}
          <path d="M96 558 L128 558 L124 580 L86 578 Q90 568 96 558 Z" fill="#4a2916" stroke={INK} strokeWidth="4" />
          <path d="M172 558 L204 558 Q210 568 214 578 L176 580 L172 558 Z" fill="#4a2916" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "witch" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="560" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="560" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          {/* Striped witch stockings */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <line x1="117" y1={430 + i * 32} x2="127" y2={430 + i * 32} stroke="#7a3fa0" strokeWidth="13" />
              <line x1="173" y1={430 + i * 32} x2="183" y2={430 + i * 32} stroke="#7a3fa0" strokeWidth="13" />
            </g>
          ))}
          {/* Pointy witch boots */}
          <path d="M98 548 L132 548 L130 580 L86 580 Q92 562 98 548 Z" fill="#141114" stroke={INK} strokeWidth="4" />
          <path d="M168 548 L202 548 Q208 562 214 580 L170 580 L168 548 Z" fill="#141114" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "vampire" || theme === "executioner" || theme === "demon" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="11" strokeLinecap="round" />
          {/* Black formal trousers + boots */}
          <path d="M100 556 L130 556 L128 580 L92 580 Z" fill="#161316" stroke={INK} strokeWidth="4" />
          <path d="M170 556 L200 556 L208 580 L172 580 Z" fill="#161316" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "werewolf" ? (
        <>
          {/* Shaggy fur legs */}
          <path d="M118 400 Q112 480 116 565 L142 565 Q146 480 140 400 Z" fill="#5a3d22" stroke={INK} strokeWidth="5" />
          <path d="M160 400 Q154 480 158 565 L184 565 Q188 480 182 400 Z" fill="#5a3d22" stroke={INK} strokeWidth="5" />
          <path d="M122 440 L136 448 M160 440 L174 448 M122 500 L136 508 M160 500 L174 508" stroke="#3d2a16" strokeWidth="3" />
          {/* Clawed wolf feet */}
          <path d="M96 556 L140 556 L138 580 L90 580 Z" fill="#3d2a16" stroke={INK} strokeWidth="4" />
          <path d="M160 556 L204 556 L210 580 L162 580 Z" fill="#3d2a16" stroke={INK} strokeWidth="4" />
          <path d="M100 580 L94 590 M118 580 L116 591 M182 580 L184 591 M200 580 L206 590" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </>
      ) : theme === "krampus" ? (
        <>
          {/* Bent goat legs */}
          <path d="M125 400 Q100 470 118 520 Q130 545 122 565" fill="none" stroke="#2b1c12" strokeWidth="14" strokeLinecap="round" />
          <path d="M175 400 Q200 470 182 520 Q170 545 178 565" fill="none" stroke="#2b1c12" strokeWidth="14" strokeLinecap="round" />
          <path d="M112 430 L128 436 M188 430 L172 436 M116 470 L130 476 M184 470 L170 476" stroke="#17100a" strokeWidth="3" />
          {/* Cloven hooves */}
          <path d="M104 556 L140 556 L138 580 L100 580 Z" fill="#0f0b08" stroke={INK} strokeWidth="4" />
          <path d="M160 556 L196 556 L200 580 L162 580 Z" fill="#0f0b08" stroke={INK} strokeWidth="4" />
          <line x1="120" y1="558" x2="120" y2="580" stroke={INK} strokeWidth="3" />
          <line x1="180" y1="558" x2="180" y2="580" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "mummy" ? (
        <>
          {/* Bandage-wrapped legs */}
          <line x1="125" y1="400" x2="120" y2="565" stroke="#d9cfbe" strokeWidth="16" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="565" stroke="#d9cfbe" strokeWidth="16" strokeLinecap="round" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <line x1="112" y1={430 + i * 36} x2="132" y2={442 + i * 36} stroke="#b8ab93" strokeWidth="3" />
              <line x1="188" y1={430 + i * 36} x2="168" y2={442 + i * 36} stroke="#b8ab93" strokeWidth="3" />
            </g>
          ))}
          {/* Wrapped feet */}
          <path d="M100 556 L130 556 L128 580 L94 580 Z" fill="#cfc3ad" stroke={INK} strokeWidth="4" />
          <path d="M170 556 L200 556 L206 580 L172 580 Z" fill="#cfc3ad" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "ghost" || theme === "nun" ? (
        <>{/* Robe/sheet covers the legs entirely */}</>
      ) : theme === "babaylan" || theme === "filipina" ? (
        <>
          {/* Long flowing Filipina Saya skirt */}
          <path d="M72 400 L62 568 Q150 582 238 568 L228 400 Z" fill="#4a044e" stroke={INK} strokeWidth="5" />
          <path d="M90 568 L210 568 L206 580 L94 580 Z" fill="#facc15" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "gravedigger" ? (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="10" strokeLinecap="round" />
          {/* Undertaker boots */}
          <path d="M98 554 L130 554 L128 580 L92 580 Z" fill="#1d1a1a" stroke={INK} strokeWidth="4" />
          <path d="M170 554 L202 554 L208 580 L172 580 Z" fill="#1d1a1a" stroke={INK} strokeWidth="4" />
        </>
      ) : (
        <>
          <line x1="125" y1="400" x2="120" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="175" y1="400" x2="180" y2="570" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="572" x2="98" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="180" y1="572" x2="202" y2="578" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <line x1="114" y1="540" x2="126" y2="540" stroke="#7a4e2a" strokeWidth="5" />
          <line x1="114" y1="552" x2="126" y2="552" stroke="#7a4e2a" strokeWidth="5" />
          <line x1="174" y1="540" x2="186" y2="540" stroke="#7a4e2a" strokeWidth="5" />
          <line x1="174" y1="552" x2="186" y2="552" stroke="#7a4e2a" strokeWidth="5" />
        </>
      )}


      {/* ================= BODY / OUTFIT ================= */}
      {archetype ? (
        <ArchetypeOutfit archetype={archetype} tunic={tunic} />
      ) : theme === "egypt" ? (
        <>
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill="#f7f2e7" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M125 280 L115 410" stroke="#d5c8ad" strokeWidth="3" />
          <path d="M175 280 L185 410" stroke="#d5c8ad" strokeWidth="3" />
          <rect x="80" y="270" width="140" height="20" rx="4" fill="#e5b32f" stroke={INK} strokeWidth="4" />
          <path d="M130 290 L170 290 L160 375 L140 375 Z" fill="#e5b32f" stroke={INK} strokeWidth="4" />
          <circle cx="150" cy="280" r="6" fill="#1b828f" />
          <circle cx="150" cy="330" r="5" fill="#a82323" />
          <path d="M88 165 Q150 240 212 165 Q150 145 88 165 Z" fill="#e5b32f" stroke={INK} strokeWidth="5" />
          <path d="M96 175 Q150 230 204 175" stroke="#187a82" strokeWidth="6" fill="none" />
          <path d="M106 185 Q150 220 194 185" stroke="#9e1e1e" strokeWidth="5" fill="none" />
        </>
      ) : theme === "mesoamerica" ? (
        <>
          {/* Mesoamerican cotton tunic (xicolli) */}
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill="#f2ebdc" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Stepped fret / geometric border at hem */}
          <rect x="76" y="380" width="148" height="26" fill="#b83323" stroke={INK} strokeWidth="3" />
          <line x1="76" y1="388" x2="224" y2="388" stroke="#1a8c79" strokeWidth="4" />
          <line x1="76" y1="398" x2="224" y2="398" stroke="#dfa837" strokeWidth="3" />
          {/* Tilmatli cloak shoulder wrap */}
          <path d="M96 168 Q135 220 185 275 L155 275 Q115 220 90 174 Z" fill="#b83323" stroke={INK} strokeWidth="3.5" />
          {/* Patterned sash waistband */}
          <rect x="76" y="278" width="148" height="22" rx="3" fill="#b83323" stroke={INK} strokeWidth="4" />
          <line x1="76" y1="289" x2="224" y2="289" stroke="#dfa837" strokeWidth="3" />
          {/* Hanging sash front apron with fringe */}
          <path d="M136 300 L164 300 L168 375 L132 375 Z" fill="#b83323" stroke={INK} strokeWidth="3.5" />
          <line x1="134" y1="365" x2="166" y2="365" stroke="#1a8c79" strokeWidth="4" />
          {/* Jade & gold collar pectoral necklace */}
          <path d="M102 168 Q150 215 198 168" stroke="#1a8c79" strokeWidth="6" fill="none" />
          <circle cx="120" cy="184" r="5" fill="#1a8c79" stroke={INK} strokeWidth="2" />
          <circle cx="135" cy="193" r="5.5" fill="#dfa837" stroke={INK} strokeWidth="2" />
          <circle cx="150" cy="196" r="7" fill="#1a8c79" stroke={INK} strokeWidth="2.5" />
          <circle cx="165" cy="193" r="5.5" fill="#dfa837" stroke={INK} strokeWidth="2" />
          <circle cx="180" cy="184" r="5" fill="#1a8c79" stroke={INK} strokeWidth="2" />
        </>
      ) : theme === "viking" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill="#3d5639" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M80 160 Q150 135 220 160 Q235 210 215 235 Q150 205 85 235 Q65 210 80 160 Z" fill="#7d5d3b" stroke={INK} strokeWidth="5" />
          <path d="M110 180 L120 195" stroke="#52391e" strokeWidth="3" />
          <path d="M150 170 L150 190" stroke="#52391e" strokeWidth="3" />
          <path d="M185 180 L175 195" stroke="#52391e" strokeWidth="3" />
          <rect x="76" y="285" width="148" height="22" rx="4" fill="#301f13" stroke={INK} strokeWidth="4" />
          <circle cx="150" cy="296" r="10" fill="#9e9e9e" stroke={INK} strokeWidth="3" />
          <rect x="180" y="295" width="28" height="32" rx="6" fill="#4d301b" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "asian" ? (
        <>
          {/* Chinese Hanfu / Tang robe (deep indigo/teal silk) */}
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill="#2d4f6c" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Diagonal collar fold */}
          <path d="M100 170 L170 280" stroke="#d4af37" strokeWidth="6" />
          <path d="M196 172 L140 280" stroke="#d4af37" strokeWidth="6" />
          {/* Golden silk waist sash */}
          <rect x="76" y="275" width="148" height="24" rx="3" fill="#d4af37" stroke={INK} strokeWidth="4" />
          {/* Jade pendant ornament (yupei) */}
          <circle cx="150" cy="287" r="8" fill="#3ba868" stroke={INK} strokeWidth="3" />
          <path d="M148 295 L148 340" stroke="#c42b2b" strokeWidth="4" />
        </>
      ) : theme === "ninja" ? (
        <>
          {/* Ninja Shozoku (dark charcoal stealth robe) */}
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill="#1b1b22" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Cross-over kimono fold (right over left) */}
          <path d="M104 175 L168 285" stroke="#333340" strokeWidth="5" />
          <path d="M196 175 L132 285" stroke="#333340" strokeWidth="5" />
          {/* Red/crimson shinobi sash (obi) */}
          <rect x="76" y="275" width="148" height="24" rx="3" fill="#8a1818" stroke={INK} strokeWidth="4" />
          {/* Hanging sash tie */}
          <path d="M165 299 L175 365 L160 365 L152 299 Z" fill="#8a1818" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "knight" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 415 Q150 430 72 415 Z" fill="#b82d23" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M150 158 Q177 163 204 168 L228 415 Q189 423 150 420 Z" fill="#dfac26" stroke={INK} strokeWidth="4" />
          <rect x="144" y="200" width="12" height="70" fill="#ffffff" stroke={INK} strokeWidth="3" />
          <rect x="115" y="220" width="70" height="12" fill="#ffffff" stroke={INK} strokeWidth="3" />
          <rect x="76" y="290" width="148" height="20" rx="3" fill="#2b1a0e" stroke={INK} strokeWidth="4" />
          <rect x="140" y="286" width="20" height="28" rx="2" fill="#c0c0c0" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "medieval" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z" fill="#8a532d" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M90 160 Q150 145 210 160 Q215 220 150 225 Q85 220 90 160 Z" fill="#5c381e" stroke={INK} strokeWidth="5" />
          <line x1="80" y1="295" x2="220" y2="295" stroke="#d5be8a" strokeWidth="8" strokeLinecap="round" />
          <circle cx="120" cy="325" r="14" fill="#5c381e" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "plague-doctor" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L236 430 Q150 445 64 430 Z" fill="#1e1e24" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M80 160 Q150 140 220 160 Q235 225 150 235 Q65 225 80 160 Z" fill="#141418" stroke={INK} strokeWidth="5" />
          <path d="M120 190 Q150 240 180 190" stroke="#9e9e9e" strokeWidth="4" fill="none" />
          <rect x="143" y="235" width="14" height="24" rx="4" fill="#2d7f8d" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "greek" ? (
        <>
          <path d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z" fill="#fcfaf4" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M92 168 Q125 210 160 290 L135 290 Q105 220 92 168 Z" fill="#234b7a" stroke={INK} strokeWidth="4" />
          <circle cx="94" cy="172" r="6" fill="#dfb332" stroke={INK} strokeWidth="3" />
          <line x1="84" y1="392" x2="216" y2="392" stroke="#234b7a" strokeWidth="5" />
          <line x1="84" y1="399" x2="216" y2="399" stroke="#dfb332" strokeWidth="3" />
          <line x1="82" y1="288" x2="218" y2="288" stroke="#dfb332" strokeWidth="6" strokeLinecap="round" />
        </>
      ) : theme === "gladiator" ? (
        <>
          {/* Main torso (chest / muscular cuirass) */}
          <path d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z" fill="#b87843" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Gladiator subligaculum (loincloth/skirt) */}
          <path d="M96 270 Q150 258 204 270 L226 412 Q150 430 74 412 Z" fill="#8e2222" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M120 310 L115 410" stroke="#5a1515" strokeWidth="3" />
          <path d="M180 310 L185 410" stroke="#5a1515" strokeWidth="3" />
          <rect x="76" y="272" width="148" height="28" rx="4" fill="#3d2212" stroke={INK} strokeWidth="4" />
          <rect x="138" y="268" width="24" height="36" rx="3" fill="#d49b33" stroke={INK} strokeWidth="3" />
          <circle cx="100" cy="286" r="5" fill="#d49b33" />
          <circle cx="120" cy="286" r="5" fill="#d49b33" />
          <circle cx="180" cy="286" r="5" fill="#d49b33" />
          <circle cx="200" cy="286" r="5" fill="#d49b33" />
          <line x1="96" y1="180" x2="194" y2="274" stroke="#3d2212" strokeWidth="10" strokeLinecap="round" />
          <line x1="204" y1="180" x2="106" y2="274" stroke="#3d2212" strokeWidth="10" strokeLinecap="round" />
          <line x1="96" y1="180" x2="194" y2="274" stroke="#1f1008" strokeWidth="3" />
          <line x1="204" y1="180" x2="106" y2="274" stroke="#1f1008" strokeWidth="3" />
          <circle cx="150" cy="227" r="14" fill="#d49b33" stroke={INK} strokeWidth="3.5" />
          <circle cx="150" cy="227" r="6" fill="#8e2222" />
          <path d="M188 165 Q232 150 228 208 Q196 215 188 165 Z" fill="#d49b33" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <circle cx="210" cy="180" r="4" fill="#3d2212" />
        </>
      ) : theme === "wwii" ? (
        <>
          {/* 1940s British wool vest & shirt */}
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill="#4a473e" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Cream shirt chest opening */}
          <path d="M130 162 L150 235 L170 162 Z" fill="#e8e2d3" stroke={INK} strokeWidth="3" />
          {/* 1940s necktie */}
          <path d="M146 195 L154 195 L157 265 L150 275 L143 265 Z" fill="#782424" stroke={INK} strokeWidth="2.5" />
          {/* Gas mask box canvas strap across shoulder */}
          <line x1="104" y1="175" x2="198" y2="340" stroke="#7a6344" strokeWidth="8" strokeLinecap="round" />
          <line x1="104" y1="175" x2="198" y2="340" stroke="#52402a" strokeWidth="2" strokeLinecap="round" />
          {/* Vest buttons */}
          <circle cx="150" cy="295" r="3" fill="#2b2923" />
          <circle cx="150" cy="325" r="3" fill="#2b2923" />
          <circle cx="150" cy="355" r="3" fill="#2b2923" />
        </>
      ) : theme === "victorian" ? (
        <>
          {/* Victorian worker waistcoat over shirt */}
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill="#36312a" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Shirt v-neck collar */}
          <path d="M130 162 L150 225 L170 162 Z" fill="#dfd8cb" stroke={INK} strokeWidth="3" />
          {/* Red neckerchief scarf */}
          <path d="M138 178 Q150 205 162 178 Q150 170 138 178 Z" fill="#962424" stroke={INK} strokeWidth="3" />
          <path d="M147 195 L143 235 L152 230 L157 235 L153 195 Z" fill="#962424" stroke={INK} strokeWidth="2" />
          {/* Suspenders */}
          <line x1="118" y1="172" x2="114" y2="400" stroke="#221e1a" strokeWidth="6" />
          <line x1="182" y1="172" x2="186" y2="400" stroke="#221e1a" strokeWidth="6" />
          {/* Watch chain */}
          <path d="M136 315 Q150 330 162 315" stroke="#c79f38" strokeWidth="3" fill="none" />
        </>
      ) : theme === "pirate" ? (
        <>
          {/* Pirate captain/deck coat */}
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill="#1b263b" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* White open ruffled chest */}
          <path d="M130 162 L150 250 L170 162 Z" fill="#f4ede1" stroke={INK} strokeWidth="3" />
          <path d="M142 185 Q150 205 158 185" stroke="#8a8377" strokeWidth="2.5" fill="none" />
          <path d="M140 210 Q150 230 160 210" stroke="#8a8377" strokeWidth="2.5" fill="none" />
          {/* Wide crimson sash */}
          <rect x="76" y="275" width="148" height="28" rx="3" fill="#8f1d1d" stroke={INK} strokeWidth="4" />
          <path d="M162 303 L172 380 L156 380 L148 303 Z" fill="#8f1d1d" stroke={INK} strokeWidth="3" />
          {/* Gold belt buckle */}
          <rect x="136" y="271" width="28" height="36" rx="4" fill="#d4af37" stroke={INK} strokeWidth="3.5" />
          <rect x="143" y="278" width="14" height="22" rx="2" fill="#8f1d1d" stroke={INK} strokeWidth="2.5" />
        </>
      ) : theme === "ottoman" ? (
        <>
          {/* Ottoman embroidered vest */}
          <path d="M96 168 Q150 150 204 168 L228 410 Q150 425 72 410 Z" fill="#184363" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Cream inner tunic */}
          <path d="M132 162 L150 240 L168 162 Z" fill="#f5ede0" stroke={INK} strokeWidth="3" />
          {/* Gold braid embroidery (kaytan) */}
          <path d="M102 172 Q130 220 148 245" stroke="#d4af37" strokeWidth="5" fill="none" />
          <path d="M198 172 Q170 220 152 245" stroke="#d4af37" strokeWidth="5" fill="none" />
          {/* Wide silk kusak sash */}
          <rect x="76" y="270" width="148" height="30" rx="3" fill="#9e1e1e" stroke={INK} strokeWidth="4" />
          <line x1="76" y1="280" x2="224" y2="280" stroke="#d4af37" strokeWidth="3" />
          <line x1="76" y1="290" x2="224" y2="290" stroke="#d4af37" strokeWidth="3" />
        </>
      ) : theme === "witch" ? (
        <>
          {/* Tattered cape behind */}
          <path d="M70 180 Q40 300 55 430 L90 400 Q80 300 92 200 Z" fill="#2a1430" stroke={INK} strokeWidth="4" />
          <path d="M230 180 Q260 300 245 430 L210 400 Q220 300 208 200 Z" fill="#2a1430" stroke={INK} strokeWidth="4" />
          {/* Black witch dress with jagged hem */}
          <path d="M96 168 Q150 152 204 168 L222 380 L205 395 L190 378 L172 396 L155 380 L138 396 L120 380 L105 394 L88 378 L72 392 Z" fill="#1b141f" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Purple corset with laces */}
          <path d="M118 200 L182 200 L176 320 L124 320 Z" fill="#5b2d86" stroke={INK} strokeWidth="4" />
          <path d="M138 210 L138 310 M150 210 L150 310 M162 210 L162 310" stroke="#3a1c58" strokeWidth="3" />
          <path d="M138 230 L162 240 M162 255 L138 265 M138 280 L162 290" stroke="#d9b8f0" strokeWidth="2.5" />
          {/* Moon brooch */}
          <path d="M150 340 A14 14 0 1 0 150 368 A11 11 0 1 1 150 340" fill="#e8d44d" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "vampire" ? (
        <>
          {/* Bat-wing high collar behind the head */}
          <path d="M96 175 Q60 120 45 60 Q90 90 110 160 Z" fill="#141114" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M204 175 Q240 120 255 60 Q210 90 190 160 Z" fill="#141114" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M96 175 Q60 120 45 60 Q75 95 100 165 Z" fill="#7a1010" />
          <path d="M204 175 Q240 120 255 60 Q225 95 200 165 Z" fill="#7a1010" />
          {/* Black tailcoat torso */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill="#181419" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Satin lapels */}
          <path d="M150 175 L120 175 L142 300 L150 320 L158 300 L180 175 L150 175 Z" fill="#0c0a0d" stroke={INK} strokeWidth="3" />
          {/* Red shirt front + cravat */}
          <path d="M138 175 L162 175 L158 320 L150 340 L142 320 Z" fill="#8f1212" stroke={INK} strokeWidth="3" />
          <ellipse cx="150" cy="200" rx="14" ry="18" fill="#5c0c0c" stroke={INK} strokeWidth="3" />
          {/* Medallion */}
          <circle cx="150" cy="330" r="10" fill="#c9a227" stroke={INK} strokeWidth="3" />
          <circle cx="150" cy="330" r="4" fill="#7a1010" />
        </>
      ) : theme === "werewolf" ? (
        <>
          {/* Torn dark shirt */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill="#4d4438" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Torn slashes revealing fur */}
          <path d="M120 220 L170 250 L125 275 Z" fill="#5a3d22" stroke={INK} strokeWidth="3" />
          <path d="M180 300 L135 330 L175 355 Z" fill="#5a3d22" stroke={INK} strokeWidth="3" />
          <path d="M115 350 L150 365 L120 390 Z" fill="#5a3d22" stroke={INK} strokeWidth="3" />
          {/* Shaggy fur ruff at neck */}
          <path d="M100 175 L115 150 L128 172 L142 148 L155 172 L170 148 L182 172 L196 152 L200 178 Q150 195 100 178 Z" fill="#5a3d22" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        </>
      ) : theme === "ghost" ? (
        <>
          {/* Flowing sheet from shoulders to the ground */}
          <path d="M80 175 Q150 145 220 175 Q238 350 232 555 Q210 572 190 556 Q172 572 150 558 Q128 572 108 557 Q88 572 68 556 Q62 350 80 175 Z" fill="#f2f4fa" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Sheet folds */}
          <path d="M120 220 Q112 350 118 520" stroke="#c9d2e4" strokeWidth="4" fill="none" />
          <path d="M180 220 Q188 350 182 520" stroke="#c9d2e4" strokeWidth="4" fill="none" />
          <path d="M150 250 Q148 380 150 540" stroke="#c9d2e4" strokeWidth="3" fill="none" />
          {/* Faint blue shroud glow patches */}
          <ellipse cx="105" cy="420" rx="18" ry="40" fill="#dfe7f5" opacity="0.7" />
          <ellipse cx="195" cy="430" rx="16" ry="36" fill="#dfe7f5" opacity="0.7" />
        </>
      ) : theme === "krampus" ? (
        <>
          {/* Dark fur torso */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill="#2b1c12" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M110 200 L125 230 M190 200 L175 230 M110 300 L130 320 M190 300 L170 320 M130 360 L145 380 M170 360 L155 380" stroke="#17100a" strokeWidth="3" />
          {/* Iron chain belt */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ellipse key={i} cx={95 + i * 22} cy={285 + (i % 2) * 6} rx="11" ry="8" fill="none" stroke="#6e6e78" strokeWidth="5" />
          ))}
          {/* Belt bell */}
          <circle cx="150" cy="310" r="12" fill="#c9a227" stroke={INK} strokeWidth="4" />
          <line x1="150" y1="318" x2="150" y2="326" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "executioner" ? (
        <>
          {/* Black tunic */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill="#1e1b20" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Leather baldric strap */}
          <path d="M108 168 L196 330 L182 342 L94 180 Z" fill="#5c3a1e" stroke={INK} strokeWidth="4" />
          {/* Wide belt */}
          <rect x="80" y="290" width="140" height="20" rx="4" fill="#3a2a18" stroke={INK} strokeWidth="4" />
          <rect x="140" y="286" width="20" height="28" rx="3" fill="#8a8f96" stroke={INK} strokeWidth="3" />
          {/* Hood drape over shoulders */}
          <path d="M92 175 Q70 220 78 280 Q95 250 100 200 Z" fill="#141216" stroke={INK} strokeWidth="4" />
          <path d="M208 175 Q230 220 222 280 Q205 250 200 200 Z" fill="#141216" stroke={INK} strokeWidth="4" />
        </>
      ) : theme === "druid" ? (
        <>
          {/* Earthy hooded robe */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill="#4a5a3a" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Rope belt */}
          <path d="M84 290 Q150 305 216 290" stroke="#a6813b" strokeWidth="8" fill="none" />
          <path d="M140 296 L138 330 M160 296 L162 330" stroke="#a6813b" strokeWidth="5" />
          {/* Oak leaf sprigs */}
          <ellipse cx="115" cy="220" rx="10" ry="5" fill="#6e8c3f" stroke={INK} strokeWidth="2" transform="rotate(-30 115 220)" />
          <ellipse cx="130" cy="235" rx="10" ry="5" fill="#7fa04c" stroke={INK} strokeWidth="2" transform="rotate(20 130 235)" />
          <ellipse cx="185" cy="220" rx="10" ry="5" fill="#6e8c3f" stroke={INK} strokeWidth="2" transform="rotate(30 185 220)" />
          {/* Autumn berries */}
          <circle cx="150" cy="260" r="5" fill="#a83232" stroke={INK} strokeWidth="2" />
          <circle cx="162" cy="266" r="5" fill="#a83232" stroke={INK} strokeWidth="2" />
          <circle cx="138" cy="266" r="5" fill="#a83232" stroke={INK} strokeWidth="2" />
        </>
      ) : theme === "mummy" ? (
        <>
          {/* Bandage-wrapped torso */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill="#d9cfbe" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Wrap lines */}
          <path d="M92 210 L208 230 M88 260 L212 245 M90 310 L210 330 M95 360 L205 350" stroke="#b8ab93" strokeWidth="4" fill="none" />
          <path d="M120 180 L100 400 M180 180 L200 400" stroke="#b8ab93" strokeWidth="3" fill="none" />
          {/* Loose hanging strip */}
          <path d="M190 340 Q200 380 192 420 L178 418 Q186 380 178 342 Z" fill="#cfc3ad" stroke={INK} strokeWidth="3" />
          {/* Exposed dark gap at chest */}
          <path d="M135 240 L165 245 L160 290 L140 288 Z" fill="#3a332a" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "gravedigger" ? (
        <>
          {/* Long black undertaker coat */}
          <path d="M96 168 Q150 152 204 168 L232 415 Q150 435 68 415 Z" fill="#191619" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* White shirt front */}
          <path d="M132 175 L168 175 L162 340 L150 360 L138 340 Z" fill="#e8e4da" stroke={INK} strokeWidth="3" />
          {/* Dark cravat */}
          <path d="M142 180 L158 180 L154 230 L150 245 L146 230 Z" fill="#2c2626" stroke={INK} strokeWidth="3" />
          {/* Coat buttons */}
          <circle cx="112" cy="260" r="4" fill="#8a8f96" />
          <circle cx="112" cy="300" r="4" fill="#8a8f96" />
          <circle cx="188" cy="260" r="4" fill="#8a8f96" />
          <circle cx="188" cy="300" r="4" fill="#8a8f96" />
          {/* Mourning armband */}
          <rect x="196" y="230" width="26" height="14" rx="3" fill="#0c0a0c" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "nun" ? (
        <>
          {/* Black habit to the ground */}
          <path d="M88 170 Q150 148 212 170 Q226 360 220 572 L80 572 Q74 360 88 170 Z" fill="#1c1a1e" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* White coif collar */}
          <path d="M118 170 Q150 195 182 170 L176 200 Q150 218 124 200 Z" fill="#ece7db" stroke={INK} strokeWidth="4" />
          {/* Wooden rosary cross */}
          <line x1="150" y1="280" x2="150" y2="330" stroke="#6e4a26" strokeWidth="8" strokeLinecap="round" />
          <line x1="132" y1="300" x2="168" y2="300" stroke="#6e4a26" strokeWidth="8" strokeLinecap="round" />
          {/* Rosary beads */}
          <path d="M120 240 Q150 260 180 240" stroke="#2c2626" strokeWidth="3" fill="none" />
          <circle cx="130" cy="248" r="4" fill="#3a332a" stroke={INK} strokeWidth="2" />
          <circle cx="150" cy="253" r="4" fill="#3a332a" stroke={INK} strokeWidth="2" />
          <circle cx="170" cy="248" r="4" fill="#3a332a" stroke={INK} strokeWidth="2" />
        </>
      ) : theme === "demon" ? (
        <>
          {/* Dark crimson robes */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={tunic || "#3d0f0f"} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Ember cracks */}
          <path d="M120 200 L135 260 L122 300 L140 360" stroke={accentColor || "#e8641f"} strokeWidth="4" fill="none" />
          <path d="M180 210 L168 270 L182 310 L170 370" stroke={accentColor || "#e8641f"} strokeWidth="4" fill="none" />
          <circle cx="135" cy="262" r="3.5" fill="#ffb13d" />
          <circle cx="168" cy="272" r="3.5" fill="#ffb13d" />
          {/* Jagged collar */}
          <path d="M100 172 L115 150 L130 170 L145 148 L160 170 L175 148 L190 170 L200 175 Q150 195 100 175 Z" fill="#200808" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        </>
      ) : theme === "babaylan" || theme === "filipina" ? (
        <>
          {/* Traditional Filipina Babaylan Bodice */}
          <path d="M96 168 Q150 152 204 168 L226 410 Q150 432 74 410 Z" fill={tunic || "#701a75"} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Alampay shoulder wrap */}
          <path d="M88 165 Q150 220 212 165 L204 220 Q150 250 96 220 Z" fill={accentColor || "#be185d"} stroke={INK} strokeWidth="4" />
          <line x1="94" y1="210" x2="206" y2="210" stroke="#facc15" strokeWidth="3" strokeDasharray="6 4" />
          <circle cx="150" cy="235" r="8" fill="#facc15" stroke={INK} strokeWidth="3" />
          <circle cx="150" cy="235" r="4" fill="#dc2626" />
          {/* Woven belt */}
          <rect x="76" y="278" width="148" height="18" rx="4" fill="#3b0764" stroke={INK} strokeWidth="3.5" />
          <circle cx="150" cy="287" r="6" fill="#facc15" stroke={INK} strokeWidth="2" />
        </>
      ) : theme === "albularyo" ? (
        <>
          {/* Traditional Filipino Folk Healer / Babaylan / Albularyo woven tunic */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={tunic || "#5c3d28"} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Woven indigenous geometric shoulder wrap (hablon / inabel motif) */}
          <path d="M92 168 L130 168 L145 410 L108 410 Z" fill={accentColor || "#9e2424"} stroke={INK} strokeWidth="3.5" />
          <line x1="110" y1="170" x2="126" y2="408" stroke="#e5b32f" strokeWidth="3" strokeDasharray="8 6" />
          {/* Abaca rope & herbal pouch belt */}
          <rect x="76" y="282" width="148" height="22" rx="4" fill="#3a2414" stroke={INK} strokeWidth="4" />
          <ellipse cx="182" cy="312" rx="18" ry="22" fill="#4e6b36" stroke={INK} strokeWidth="3.5" />
          <circle cx="182" cy="296" r="5" fill="#c9a227" stroke={INK} strokeWidth="2" />
          {/* Sacred Anting-Anting (triangular brass Eye of Providence talisman on cord) */}
          <path d="M118 168 Q150 235 182 168" stroke="#1f1610" strokeWidth="4" fill="none" />
          <polygon points="150,208 130,244 170,244" fill="#e5b32f" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx="150" cy="232" r="5" fill="#9e2424" stroke={INK} strokeWidth="2" />
        </>
      ) : theme === "barong" ? (
        <>
          {/* Formal Cream Piña Barong Tagalog */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={tunic || "#f7f1e1"} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Intricate U-shaped pechera (chest embroidery panel) */}
          <rect x="116" y="170" width="68" height="175" rx="6" fill={accentColor || "#ebe0c5"} stroke="#c2b28f" strokeWidth="3" />
          <line x1="150" y1="170" x2="150" y2="345" stroke={INK} strokeWidth="3" />
          {/* Embroidery scrollwork lines */}
          <path d="M126 190 Q138 205 126 220 Q138 235 126 250 Q138 265 126 280 Q138 295 126 310" stroke="#b59d6b" strokeWidth="2.5" fill="none" />
          <path d="M174 190 Q162 205 174 220 Q162 235 174 250 Q162 265 174 280 Q162 295 174 310" stroke="#b59d6b" strokeWidth="2.5" fill="none" />
          {/* Collar & buttons */}
          <path d="M126 164 L150 184 L174 164" stroke={INK} strokeWidth="4" fill="none" />
          <circle cx="150" cy="200" r="3.5" fill={INK} />
          <circle cx="150" cy="230" r="3.5" fill={INK} />
          <circle cx="150" cy="260" r="3.5" fill={INK} />
        </>
      ) : theme === "katipunero" ? (
        <>
          {/* 1890s Camisa de Chino / Rayadillo revolutionary tunic */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={tunic || "#ece5d5"} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Iconic Crimson Red Katipunan neckerchief (Alampay) */}
          <path d="M104 165 Q150 220 196 165 Q182 205 150 228 Q118 205 104 165 Z" fill={accentColor || "#b81d1d"} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M142 212 L132 275 L150 265 L168 275 L158 212 Z" fill={accentColor || "#b81d1d"} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          {/* Leather belt & brass buckle */}
          <rect x="76" y="286" width="148" height="22" rx="4" fill="#3b2313" stroke={INK} strokeWidth="4" />
          <rect x="138" y="282" width="24" height="30" rx="3" fill="#d4af37" stroke={INK} strokeWidth="3" />
        </>
      ) : theme === "modern" ? (
        <>
          {/* Stylish Modern Streetwear Hoodie & Jacket */}
          <path d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z" fill={tunic || "#1e293b"} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* Center hoodie pocket & jacket lapels */}
          <path d="M126 168 L120 408 M174 168 L180 408" stroke={accentColor || "#38bdf8"} strokeWidth="5" />
          <path d="M105 168 Q150 202 195 168" fill="none" stroke={INK} strokeWidth="5" />
          {/* Hoodie drawstrings */}
          <line x1="138" y1="185" x2="136" y2="245" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
          <line x1="162" y1="185" x2="164" y2="245" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
          <rect x="102" y="310" width="96" height="55" rx="12" fill={accentColor || "#334155"} stroke={INK} strokeWidth="3.5" />
        </>
      ) : (
        <>
          <path d="M96 168 Q150 150 204 168 L228 405 Q150 425 72 405 Z" fill={tunic || "#e8cf9a"} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M125 168 L120 405" stroke="#942626" strokeWidth="8" />
          <path d="M175 168 L180 405" stroke="#942626" strokeWidth="8" />
          <rect x="80" y="290" width="140" height="18" rx="4" fill="#6e3d1b" stroke={INK} strokeWidth="4" />
          <rect x="140" y="286" width="20" height="26" rx="3" fill="#d4af37" stroke={INK} strokeWidth="3" />
          <rect x="115" y="291" width="10" height="16" fill="#d4af37" />
          <rect x="175" y="291" width="10" height="16" fill="#d4af37" />
        </>
      )}

      {/* Optional user-selected custom dress color tint for any preset costume */}
      {tunic && !["roman", "demon", "albularyo", "barong", "katipunero", "modern"].includes(theme) && (
        <path
          d="M96 168 Q150 152 204 168 L228 410 Q150 430 72 410 Z"
          fill={tunic}
          opacity={0.55}
          stroke="none"
          style={{mixBlendMode: "multiply"}}
        />
      )}
      {accentColor && !["demon", "albularyo", "barong", "katipunero", "modern"].includes(theme) && (
        <rect x="76" y="280" width="148" height="22" rx="4" fill={accentColor} stroke={INK} strokeWidth="3.5" />
      )}

      {/* ================= ARMS & HANDS (pose-driven) ================= */}
      <line x1="102" y1="190" x2={p.lElbow[0]} y2={p.lElbow[1]} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1={p.lElbow[0]} y1={p.lElbow[1]} x2={p.lHand[0]} y2={p.lHand[1]} stroke={INK} strokeWidth="8" strokeLinecap="round" />

      <line x1="198" y1="190" x2={p.rElbow[0]} y2={p.rElbow[1]} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1={p.rElbow[0]} y1={p.rElbow[1]} x2={p.rHand[0]} y2={p.rHand[1]} stroke={INK} strokeWidth="8" strokeLinecap="round" />


      {theme === "gladiator" && (
        <g>
          {[0.3, 0.55, 0.8].map((t, i) => {
            const bx = lerp(p.rElbow[0], p.rHand[0], t);
            const by = lerp(p.rElbow[1], p.rHand[1], t);
            const ang =
              (Math.atan2(p.rHand[1] - p.rElbow[1], p.rHand[0] - p.rElbow[0]) * 180) / Math.PI;
            return (
              <rect
                key={i}
                x={bx - 13}
                y={by - 8}
                width={26}
                height={16}
                rx={4}
                fill="#d49b33"
                stroke={INK}
                strokeWidth={3}
                transform={`rotate(${ang} ${bx} ${by})`}
              />
            );
          })}
        </g>
      )}

      <Hand
        x={p.lHand[0]}
        y={p.lHand[1]}
        fromX={p.lElbow[0]}
        fromY={p.lElbow[1]}
        side="left"
        variant={handVariant("left")}
        skin={skin}
      />
      <Hand
        x={p.rHand[0]}
        y={p.rHand[1]}
        fromX={p.rElbow[0]}
        fromY={p.rElbow[1]}
        side="right"
        variant={handVariant("right")}
        skin={skin}
      />

      {(theme === "egypt" || theme === "mesoamerica") && (
        <>
          <circle
            cx={p.lHand[0]}
            cy={p.lHand[1]}
            r="10"
            fill="none"
            stroke={theme === "mesoamerica" ? "#1a8c79" : "#e5b32f"}
            strokeWidth="4"
          />
          <circle
            cx={p.rHand[0]}
            cy={p.rHand[1]}
            r="10"
            fill="none"
            stroke={theme === "mesoamerica" ? "#1a8c79" : "#e5b32f"}
            strokeWidth="4"
          />
        </>
      )}

      {/* ================= HEAD (tilts / bows / nods with the story) ================= */}
      <g
        style={{
          transform: `translateY(${p.headDy + nod}px) rotate(${p.headTilt}deg)`,
          transformOrigin: "150px 92px",
          transformBox: "view-box",
        }}
      >
        <circle cx="150" cy="92" r="64" fill={skin} stroke={INK} strokeWidth="6" />

        {archetype ? (
          <ArchetypeHeadwear archetype={archetype} />
        ) : theme === "egypt" ? (
          <>
            <path d="M86 90 Q80 20 150 20 Q220 20 214 90 Q215 50 150 40 Q85 50 86 90 Z" fill="#1d4370" stroke={INK} strokeWidth="5" />
            <path d="M120 25 Q135 40 135 50" stroke="#e5b32f" strokeWidth="6" fill="none" />
            <path d="M150 20 L150 45" stroke="#e5b32f" strokeWidth="6" fill="none" />
            <path d="M180 25 Q165 40 165 50" stroke="#e5b32f" strokeWidth="6" fill="none" />
            <path d="M86 85 Q75 130 70 185 Q85 185 92 145 Q98 115 95 85 Z" fill="#1d4370" stroke={INK} strokeWidth="5" />
            <path d="M214 85 Q225 130 230 185 Q215 185 208 145 Q202 115 205 85 Z" fill="#1d4370" stroke={INK} strokeWidth="5" />
            <line x1="78" y1="115" x2="94" y2="115" stroke="#e5b32f" strokeWidth="5" />
            <line x1="74" y1="145" x2="89" y2="145" stroke="#e5b32f" strokeWidth="5" />
            <line x1="71" y1="170" x2="85" y2="170" stroke="#e5b32f" strokeWidth="5" />
            <line x1="206" y1="115" x2="222" y2="115" stroke="#e5b32f" strokeWidth="5" />
            <line x1="211" y1="145" x2="226" y2="145" stroke="#e5b32f" strokeWidth="5" />
            <line x1="215" y1="170" x2="229" y2="170" stroke="#e5b32f" strokeWidth="5" />
            <circle cx="150" cy="35" r="7" fill="#e5b32f" stroke={INK} strokeWidth="3" />
          </>
        ) : theme === "mesoamerica" ? (
          <>
            {/* Elegant arching Quetzal feather plumes */}
            <path d="M136 35 Q120 -30 96 -60 Q122 -30 140 35 Z" fill="#147348" stroke={INK} strokeWidth="3" />
            <path d="M144 30 Q136 -45 120 -78 Q140 -40 148 30 Z" fill="#1ba165" stroke={INK} strokeWidth="3" />
            <path d="M150 28 Q150 -55 150 -90 Q152 -55 154 28 Z" fill="#25bf78" stroke={INK} strokeWidth="3.5" />
            <path d="M156 30 Q164 -45 180 -78 Q160 -40 152 30 Z" fill="#1ba165" stroke={INK} strokeWidth="3" />
            <path d="M164 35 Q180 -30 204 -60 Q178 -30 160 35 Z" fill="#147348" stroke={INK} strokeWidth="3" />
            {/* Red & gold embroidered headband */}
            <path d="M84 75 Q150 40 216 75 L214 53 Q150 18 86 53 Z" fill="#b83323" stroke={INK} strokeWidth="4" />
            <line x1="86" y1="64" x2="214" y2="64" stroke="#dfa837" strokeWidth="4" />
            {/* Center sun medallion */}
            <circle cx="150" cy="50" r="10" fill="#dfa837" stroke={INK} strokeWidth="3" />
            <circle cx="150" cy="50" r="5" fill="#1a8c79" />
            {/* Jade circular ear flares */}
            <circle cx="82" cy="100" r="9" fill="#1a8c79" stroke={INK} strokeWidth="3" />
            <circle cx="82" cy="100" r="4" fill="#dfa837" />
            <circle cx="218" cy="100" r="9" fill="#1a8c79" stroke={INK} strokeWidth="3" />
            <circle cx="218" cy="100" r="4" fill="#dfa837" />
          </>
        ) : theme === "viking" ? (
          <>
            <path d="M88 75 Q85 25 150 25 Q215 25 212 75 Z" fill="#694b2f" stroke={INK} strokeWidth="5" />
            <ellipse cx="150" cy="72" rx="66" ry="14" fill="#91704d" stroke={INK} strokeWidth="4" />
          </>
        ) : theme === "asian" ? (
          <>
            {/* Traditional Asian conical straw hat (douli) */}
            <path d="M60 70 L150 0 L240 70 Z" fill="#d9b677" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <line x1="75" y1="58" x2="225" y2="58" stroke="#a6813b" strokeWidth="3" />
            <line x1="95" y1="42" x2="205" y2="42" stroke="#a6813b" strokeWidth="3" />
            <line x1="120" y1="24" x2="180" y2="24" stroke="#a6813b" strokeWidth="3" />
            <line x1="150" y1="0" x2="150" y2="70" stroke="#a6813b" strokeWidth="3" />
            {/* Chin tie cord */}
            <path d="M105 68 Q150 145 195 68" stroke="#a82323" strokeWidth="3.5" fill="none" />
          </>
        ) : theme === "ninja" ? (
          <>
            {/* Ninja shinobi hood covering top and sides */}
            <path d="M86 90 Q80 20 150 20 Q220 20 214 90 Q225 155 150 162 Q75 155 86 90 Z" fill="#1b1b22" stroke={INK} strokeWidth="5" />
            {/* Eye slit opening revealing eyes */}
            <ellipse cx="150" cy="88" rx="46" ry="16" fill={skin} stroke={INK} strokeWidth="4" />
            {/* Headband cloth tie */}
            <line x1="84" y1="68" x2="216" y2="68" stroke="#8a1818" strokeWidth="6" />
          </>
        ) : theme === "knight" ? (
          <>
            <path d="M86 92 Q80 20 150 20 Q220 20 214 92 Q225 160 150 170 Q75 160 86 92 Z" fill="#858a91" stroke={INK} strokeWidth="5" />
            <ellipse cx="150" cy="100" rx="46" ry="48" fill={skin} stroke={INK} strokeWidth="5" />
            <circle cx="105" cy="50" r="3" fill="#52565c" />
            <circle cx="120" cy="40" r="3" fill="#52565c" />
            <circle cx="150" cy="35" r="3" fill="#52565c" />
            <circle cx="180" cy="40" r="3" fill="#52565c" />
            <circle cx="195" cy="50" r="3" fill="#52565c" />
          </>
        ) : theme === "medieval" ? (
          <>
            <path d="M86 90 Q82 20 150 20 Q218 20 214 90 Q215 145 150 155 Q85 145 86 90 Z" fill="#5c381e" stroke={INK} strokeWidth="5" />
            <ellipse cx="150" cy="96" rx="48" ry="50" fill={skin} stroke={INK} strokeWidth="5" />
          </>
        ) : theme === "plague-doctor" ? (
          <>
            <ellipse cx="150" cy="45" rx="95" ry="18" fill="#141418" stroke={INK} strokeWidth="5" />
            <path d="M100 45 L115 0 L185 0 L200 45 Z" fill="#1c1c21" stroke={INK} strokeWidth="5" />
            <circle cx="126" cy="88" r="16" fill="#111113" stroke="#876527" strokeWidth="5" />
            <circle cx="174" cy="88" r="16" fill="#111113" stroke="#876527" strokeWidth="5" />
            <circle cx="123" cy="84" r="4" fill="#ffffff" />
            <circle cx="171" cy="84" r="4" fill="#ffffff" />
            <path d="M136 98 Q150 96 164 98 L160 160 Q150 185 142 185 L140 160 Z" fill="#d9cfbe" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <circle cx="148" cy="165" r="2.5" fill={INK} />
          </>
        ) : theme === "greek" ? (
          <>
            <path d="M90 76 Q150 36 210 76" stroke="#2d5a27" strokeWidth="4" fill="none" />
            <ellipse cx="104" cy="65" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(-35 104 65)" />
            <ellipse cx="120" cy="54" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(-20 120 54)" />
            <ellipse cx="140" cy="48" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(-5 140 48)" />
            <ellipse cx="160" cy="48" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(5 160 48)" />
            <ellipse cx="180" cy="54" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(20 180 54)" />
            <ellipse cx="196" cy="65" rx="9" ry="4" fill="#3e7a35" stroke={INK} strokeWidth="2" transform="rotate(35 196 65)" />
            <circle cx="112" cy="60" r="3.5" fill="#dfb332" />
            <circle cx="150" cy="46" r="3.5" fill="#dfb332" />
            <circle cx="188" cy="60" r="3.5" fill="#dfb332" />
          </>
        ) : theme === "gladiator" ? (
          <>
            <path d="M142 20 Q124 -42 150 -58 Q176 -42 158 20 Z" fill="#b82222" stroke={INK} strokeWidth="4" />
            <path d="M145 -38 Q150 -48 155 -38" stroke="#7a1414" strokeWidth="3" fill="none" />
            <path d="M144 -18 Q150 -28 156 -18" stroke="#7a1414" strokeWidth="3" fill="none" />
            <path d="M146 2 Q150 -8 154 2" stroke="#7a1414" strokeWidth="3" fill="none" />
            <path d="M142 24 L142 -2 L158 -2 L158 24 Z" fill="#a8741c" stroke={INK} strokeWidth="3" />
            <path d="M84 86 Q80 18 150 18 Q220 18 216 86 Q150 66 84 86 Z" fill="#d49b33" stroke={INK} strokeWidth="5" />
            <path d="M85 82 L88 132 L102 122 L98 84 Z" fill="#b58022" stroke={INK} strokeWidth="3" />
            <path d="M215 82 L212 132 L198 122 L202 84 Z" fill="#b58022" stroke={INK} strokeWidth="3" />
            <ellipse cx="150" cy="72" rx="70" ry="12" fill="#e5b32f" stroke={INK} strokeWidth="4" />
            <circle cx="112" cy="72" r="3.5" fill="#3d2212" />
            <circle cx="150" cy="69" r="5" fill="#b82222" stroke={INK} strokeWidth="2" />
            <circle cx="188" cy="72" r="3.5" fill="#3d2212" />
          </>
        ) : theme === "wwii" ? (
          <>
            {/* 1940s Tweed Flat Cap */}
            <path d="M82 72 Q85 18 150 16 Q215 18 218 72 Q150 52 82 72 Z" fill="#4a473e" stroke={INK} strokeWidth="5" />
            <path d="M90 68 Q150 48 210 68 L218 74 Q150 56 82 74 Z" fill="#36332a" stroke={INK} strokeWidth="3" />
            {/* Small peak brim */}
            <path d="M102 70 Q150 60 198 70 Q150 78 102 70 Z" fill="#36332a" stroke={INK} strokeWidth="3" />
            <circle cx="150" cy="20" r="3.5" fill="#2b2923" />
          </>
        ) : theme === "victorian" ? (
          <>
            {/* Victorian scally/newsboy cap */}
            <path d="M84 72 Q86 16 150 14 Q214 16 216 72 Q150 50 84 72 Z" fill="#332f2a" stroke={INK} strokeWidth="5" />
            {/* Brim overhang */}
            <path d="M98 70 Q150 58 202 70 Q150 78 98 70 Z" fill="#24211d" stroke={INK} strokeWidth="3.5" />
            <circle cx="150" cy="18" r="3.5" fill="#1c1916" />
          </>
        ) : theme === "pirate" ? (
          <>
            {/* Pirate Tricorn Hat */}
            <path d="M60 62 Q150 0 240 62 Q210 32 150 38 Q90 32 60 62 Z" fill="#1c1917" stroke={INK} strokeWidth="5" />
            <path d="M60 62 Q100 82 150 82 Q200 82 240 62" stroke="#d4af37" strokeWidth="4" fill="none" />
            <circle cx="150" cy="50" r="6" fill="#8f1d1d" stroke={INK} strokeWidth="2" />
            <circle cx="150" cy="50" r="2.5" fill="#d4af37" />
            {/* Pirate gold hoop earring in left ear */}
            <circle cx="82" cy="100" r="7" fill="none" stroke="#d4af37" strokeWidth="3.5" />
          </>
        ) : theme === "ottoman" ? (
          <>
            {/* Ottoman Crimson Fez */}
            <path d="M110 58 L122 0 L178 0 L190 58 Z" fill="#9e1a1a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <ellipse cx="150" cy="56" rx="40" ry="8" fill="#801414" stroke={INK} strokeWidth="4" />
            {/* Center top knot & hanging black tassel */}
            <circle cx="150" cy="2" r="3.5" fill="#141414" />
            <path d="M150 2 Q182 15 186 50" stroke="#141414" strokeWidth="3.5" fill="none" />
            <ellipse cx="186" cy="52" rx="4" ry="7" fill="#141414" />
          </>
        ) : theme === "witch" ? (
          <>
            {/* Tall bent witch hat */}
            <ellipse cx="150" cy="60" rx="96" ry="16" fill="#1b141f" stroke={INK} strokeWidth="5" />
            <path d="M104 56 Q120 -20 165 -55 Q150 -15 178 52 Q140 40 104 56 Z" fill="#241a2b" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M112 30 Q150 44 188 30 L186 52 Q150 64 114 52 Z" fill="#5b2d86" stroke={INK} strokeWidth="3" />
            <circle cx="150" cy="47" r="7" fill="#e8d44d" stroke={INK} strokeWidth="3" />
            {/* Messy black hair */}
            <path d="M92 70 Q80 110 88 150 Q96 120 98 90 Z" fill="#141114" stroke={INK} strokeWidth="3" />
            <path d="M208 70 Q220 110 212 150 Q204 120 202 90 Z" fill="#141114" stroke={INK} strokeWidth="3" />
          </>
        ) : theme === "vampire" ? (
          <>
            {/* Slick black widow's-peak hair */}
            <path d="M86 92 Q82 28 150 26 Q218 28 214 92 Q200 60 186 52 Q172 44 160 58 Q150 70 140 58 Q128 44 114 52 Q100 60 86 92 Z" fill="#100d12" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M120 40 Q150 30 180 40" stroke="#3a3340" strokeWidth="3" fill="none" />
            {/* Sharp sideburns */}
            <path d="M90 85 L98 125 L88 120 Z" fill="#100d12" stroke={INK} strokeWidth="3" />
            <path d="M210 85 L202 125 L212 120 Z" fill="#100d12" stroke={INK} strokeWidth="3" />
          </>
        ) : theme === "werewolf" ? (
          <>
            {/* Wolf ears */}
            <path d="M96 40 L78 -8 L128 18 Z" fill="#5a3d22" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M204 40 L222 -8 L172 18 Z" fill="#5a3d22" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M100 28 L92 2 L114 20 Z" fill="#8a6a42" />
            <path d="M200 28 L208 2 L186 20 Z" fill="#8a6a42" />
            {/* Shaggy fur framing the face */}
            <path d="M88 80 L70 100 L84 112 L68 128 L86 138 L92 120 Z" fill="#5a3d22" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d="M212 80 L230 100 L216 112 L232 128 L214 138 L208 120 Z" fill="#5a3d22" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d="M100 45 Q150 20 200 45 Q150 35 100 45 Z" fill="#6e4e2c" stroke={INK} strokeWidth="3" />
          </>
        ) : theme === "ghost" ? (
          <>
            {/* Sheet hood around the face */}
            <circle cx="150" cy="92" r="80" fill="#f2f4fa" stroke={INK} strokeWidth="5" />
            <circle cx="150" cy="92" r="62" fill={skin} stroke={INK} strokeWidth="5" />
            {/* Wavy sheet edge under the chin */}
            <path d="M90 130 Q110 165 130 140 Q150 170 170 140 Q190 165 210 130 L210 155 Q190 185 170 158 Q150 190 130 158 Q110 185 90 155 Z" fill="#f2f4fa" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          </>
        ) : theme === "krampus" ? (
          <>
            {/* Curved goat horns */}
            <path d="M108 40 Q70 -20 55 -55 Q95 -30 118 25 Z" fill="#cfc3ad" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M192 40 Q230 -20 245 -55 Q205 -30 182 25 Z" fill="#cfc3ad" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M95 -10 Q85 -25 80 -38 M205 -10 Q215 -25 220 -38" stroke="#a89a80" strokeWidth="3" />
            {/* Dark fur cap */}
            <path d="M88 80 Q90 25 150 24 Q210 25 212 80 Q180 55 150 58 Q120 55 88 80 Z" fill="#2b1c12" stroke={INK} strokeWidth="5" />
          </>
        ) : theme === "executioner" ? (
          <>
            {/* Black executioner's hood */}
            <circle cx="150" cy="92" r="68" fill="#141216" stroke={INK} strokeWidth="6" />
            {/* Hood drape over shoulders */}
            <path d="M88 110 Q70 160 78 210 Q95 180 100 130 Z" fill="#141216" stroke={INK} strokeWidth="4" />
            <path d="M212 110 Q230 160 222 210 Q205 180 200 130 Z" fill="#141216" stroke={INK} strokeWidth="4" />
            {/* Stitched seams */}
            <path d="M150 24 L150 44 M110 34 Q120 40 132 42 M190 34 Q180 40 168 42" stroke="#3a3640" strokeWidth="3" />
          </>
        ) : theme === "druid" ? (
          <>
            {/* Brown hood around the face */}
            <circle cx="150" cy="92" r="78" fill="#5c4526" stroke={INK} strokeWidth="5" />
            <circle cx="150" cy="92" r="62" fill={skin} stroke={INK} strokeWidth="5" />
            {/* Oak leaves on the hood */}
            <ellipse cx="100" cy="40" rx="12" ry="6" fill="#6e8c3f" stroke={INK} strokeWidth="2.5" transform="rotate(-30 100 40)" />
            <ellipse cx="200" cy="40" rx="12" ry="6" fill="#7fa04c" stroke={INK} strokeWidth="2.5" transform="rotate(30 200 40)" />
            <ellipse cx="150" cy="18" rx="12" ry="6" fill="#6e8c3f" stroke={INK} strokeWidth="2.5" />
            {/* Hood drape */}
            <path d="M84 120 Q66 170 74 220 Q92 190 96 140 Z" fill="#4a3820" stroke={INK} strokeWidth="4" />
            <path d="M216 120 Q234 170 226 220 Q208 190 204 140 Z" fill="#4a3820" stroke={INK} strokeWidth="4" />
          </>
        ) : theme === "mummy" ? (
          <>
            {/* Bandage wraps (face left clear for lipsync) */}
            <path d="M92 30 L208 30 L206 58 L94 58 Z" fill="#d9cfbe" stroke={INK} strokeWidth="4" transform="rotate(-4 150 44)" />
            <path d="M86 105 L116 100 L112 140 L84 145 Z" fill="#cfc3ad" stroke={INK} strokeWidth="3" />
            <path d="M214 105 L184 100 L188 140 L216 145 Z" fill="#cfc3ad" stroke={INK} strokeWidth="3" />
            <path d="M120 148 L180 148 L178 162 L122 162 Z" fill="#d9cfbe" stroke={INK} strokeWidth="3" />
            {/* Loose strip fluttering */}
            <path d="M205 45 Q230 60 235 90 L222 92 Q216 68 196 58 Z" fill="#cfc3ad" stroke={INK} strokeWidth="3" />
          </>
        ) : theme === "gravedigger" ? (
          <>
            {/* Black top hat */}
            <ellipse cx="150" cy="58" rx="82" ry="14" fill="#141114" stroke={INK} strokeWidth="5" />
            <path d="M112 56 L114 -6 Q150 -14 186 -6 L188 56 Q150 44 112 56 Z" fill="#1d1a1c" stroke={INK} strokeWidth="5" />
            <path d="M112 40 Q150 52 188 40 L188 56 Q150 68 112 56 Z" fill="#0c0a0c" stroke={INK} strokeWidth="3" />
            {/* Mourning band */}
            <rect x="112" y="30" width="76" height="10" fill="#3a3640" />
          </>
        ) : theme === "nun" ? (
          <>
            {/* Black veil + white coif */}
            <circle cx="150" cy="92" r="78" fill="#1c1a1e" stroke={INK} strokeWidth="5" />
            <circle cx="150" cy="92" r="68" fill="#ece7db" stroke={INK} strokeWidth="4" />
            <circle cx="150" cy="92" r="60" fill={skin} stroke={INK} strokeWidth="5" />
            {/* Veil drape */}
            <path d="M82 115 Q64 165 72 215 Q90 185 94 135 Z" fill="#1c1a1e" stroke={INK} strokeWidth="4" />
            <path d="M218 115 Q236 165 228 215 Q210 185 206 135 Z" fill="#1c1a1e" stroke={INK} strokeWidth="4" />
          </>
        ) : theme === "demon" ? (
          <>
            {/* Small curved demon horns */}
            <path d="M112 38 Q92 10 96 -18 Q116 2 126 30 Z" fill="#7a1a1a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M188 38 Q208 10 204 -18 Q184 2 174 30 Z" fill="#7a1a1a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            {/* Dark red hair */}
            <path d="M88 85 Q90 25 150 24 Q210 25 212 85 Q185 58 150 60 Q115 58 88 85 Z" fill="#3d0f0f" stroke={INK} strokeWidth="5" />
            <path d="M150 24 Q155 40 150 55" stroke="#e8641f" strokeWidth="3" />
          </>
        ) : theme === "babaylan" || theme === "filipina" ? (
          <>
            {/* Long dark hair past shoulders */}
            <path d="M84 75 Q62 135 68 210 Q80 205 84 150 Z" fill="#181512" stroke={INK} strokeWidth="4.5" />
            <path d="M216 75 Q238 135 232 210 Q220 205 216 150 Z" fill="#181512" stroke={INK} strokeWidth="4.5" />
            {/* Curved female bangs */}
            <path d="M82 82 Q84 20 150 18 Q216 20 218 82 Q188 50 150 52 Q112 50 82 82 Z" fill="#181512" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M112 36 Q150 24 188 38" stroke="#383028" strokeWidth="3" fill="none" />
            {/* Golden Sampaguita blossom */}
            <circle cx="212" cy="62" r="8" fill="#fbbf24" stroke={INK} strokeWidth="3" />
            <circle cx="212" cy="62" r="3.5" fill="#ffffff" />
          </>
        ) : theme === "albularyo" ? (
          <>
            {/* Dark wavy hair + woven crimson Putong / Purong mystic headband */}
            <path d="M86 82 Q88 22 150 20 Q212 22 214 82 Q185 52 150 54 Q115 52 86 82 Z" fill="#1c1613" stroke={INK} strokeWidth="5" />
            <path d="M84 68 Q150 48 216 68 L214 50 Q150 30 86 50 Z" fill={accentColor || "#9e2424"} stroke={INK} strokeWidth="4" />
            <line x1="86" y1="59" x2="214" y2="59" stroke="#e5b32f" strokeWidth="3" strokeDasharray="6 5" />
            {/* Side knot tie */}
            <path d="M212 58 L236 72 L228 84 L208 66 Z" fill={accentColor || "#9e2424"} stroke={INK} strokeWidth="3.5" />
          </>
        ) : theme === "katipunero" ? (
          <>
            {/* Woven Buri / Salakot Dome Hat */}
            <path d="M58 68 Q150 -8 242 68 Z" fill="#c9a565" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M85 48 Q150 20 215 48" stroke="#96743b" strokeWidth="3" fill="none" />
            <circle cx="150" cy="14" r="7" fill="#d4af37" stroke={INK} strokeWidth="3" />
          </>
        ) : theme === "barong" || theme === "modern" ? (
          <>
            {/* Clean styled Filipino / Modern Haircut */}
            <path d="M86 80 Q85 18 150 16 Q215 18 214 80 Q192 46 155 48 Q112 46 86 80 Z" fill="#181512" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
            <path d="M115 32 Q150 22 185 34" stroke="#36302a" strokeWidth="3" fill="none" />
          </>
        ) : (
          <>
            <path d="M92 78 Q150 40 208 78" stroke="#386b2d" strokeWidth="4" fill="none" />
            <ellipse cx="106" cy="68" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(-30 106 68)" />
            <ellipse cx="122" cy="58" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(-15 122 58)" />
            <ellipse cx="140" cy="52" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(-5 140 52)" />
            <ellipse cx="160" cy="52" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(5 160 52)" />
            <ellipse cx="178" cy="58" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(15 178 58)" />
            <ellipse cx="194" cy="68" rx="8" ry="4" fill="#4d8c3e" stroke={INK} strokeWidth="2" transform="rotate(30 194 68)" />
          </>
        )}

        {/* ================= FACE ================= */}
        {theme !== "plague-doctor" && (
          <>
            {archetype && <ArchetypeFaceDetails archetype={archetype} />}
            {theme === "egypt" && (
              <>
                <path d="M120 86 L112 83 L110 88" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M180 86 L188 83 L190 88" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
            <Brows expression={expression} />
            {(theme === "babaylan" || theme === "filipina") && (
              <>
                <path d="M120 79 Q128 72 136 79 L140 74" stroke={INK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <path d="M164 79 Q172 72 180 79 L184 74" stroke={INK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
              </>
            )}
            {/* Eyes with pupils that look toward the gesture's focus */}
            {[128, 172].map((cx) => (
              <g key={cx}>
                <ellipse
                  cx={cx}
                  cy={88}
                  rx={8.5}
                  ry={Math.max(1.2, 9.5 * eyeScaleY)}
                  fill={theme === "demon" ? "#ff4030" : "#ffffff"}
                  stroke={INK}
                  strokeWidth={2.5}
                />
                <circle
                  cx={cx + lookX * eyeScaleY}
                  cy={88 + lookY * eyeScaleY}
                  r={Math.max(0.8, 3.8 * eyeScaleY)}
                  fill={INK}
                />
              </g>
            ))}

            {!talking ? (
              expression === "surprise" ? (
                <path d="M136 122 Q150 114 164 122" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
              ) : expression === "spooked" ? (
                <path d="M134 122 q4 -5 8 0 t8 0 t8 0 t8 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
              ) : expression === "sad" ? (
                <path d="M134 126 Q150 116 166 126" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
              ) : expression === "happy" ? (
                <path d="M132 116 Q150 132 168 116" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M134 118 Q150 128 166 118" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
              )
            ) : expression === "surprise" ? (
              <ellipse cx="150" cy="122" rx="10" ry="13" fill="#5a1d1d" stroke={INK} strokeWidth="3" />
            ) : (
              <g>
                <ellipse
                  cx="150"
                  cy="120"
                  rx={visemeSize.rx}
                  ry={visemeSize.ry}
                  fill="#5a1d1d"
                  stroke={INK}
                  strokeWidth={3}
                />
                {/* teeth on wide (E) sounds */}
                {viseme === "wide" && mouthOpen > 0.25 && (
                  <ellipse
                    cx="150"
                    cy={120 - visemeSize.ry * 0.55}
                    rx={visemeSize.rx * 0.68}
                    ry={visemeSize.ry * 0.38}
                    fill="#ffffff"
                  />
                )}
                {/* tongue when the mouth opens up */}
                {mouthOpen > 0.35 && (
                  <ellipse
                    cx="150"
                    cy={120 + visemeSize.ry * 0.45}
                    rx={visemeSize.rx * 0.5}
                    ry={visemeSize.ry * 0.4}
                    fill="#c96a6a"
                  />
                )}
              </g>
            )}
            {/* Vampire fangs over the mouth */}
            {theme === "vampire" && (
              <>
                <path d="M137 110 L148 110 L142.5 126 Z" fill="#ffffff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
                <path d="M152 110 L163 110 L157.5 126 Z" fill="#ffffff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
              </>
            )}
          </>
        )}
      </g>
    </svg>
  );
};

/**
 * Narrator — the on-screen host. Give it a `plan` (from planSpeech) and it
 * performs the narration: gestures per sentence, expressions per mood,
 * head-nods on emphasis, and a mouth driven by the real voiceover audio.
 */
export const Narrator: React.FC<Props> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - (props.frameOffset ?? 0);
  const isTalking = props.talking ?? true;

  if (!isTalking) {
    return (
      <NarratorBody
        {...props}
        talking={false}
        frame={localFrame}
        mouthOpen={0}
      />
    );
  }

  if (props.audioSrc) {
    const {audioSrc, ...rest} = props;
    return (
      <AudioMouth audioSrc={audioSrc} frame={localFrame} fps={fps}>
        {(audioMouth) => (
          <NarratorBody
            {...rest}
            frame={localFrame}
            mouthOpen={
              audioMouth ?? wordTimingMouth(props.plan, localFrame, true)
            }
          />
        )}
      </AudioMouth>
    );
  }

  return (
    <NarratorBody
      {...props}
      frame={localFrame}
      mouthOpen={wordTimingMouth(props.plan, localFrame, true)}
    />
  );
};

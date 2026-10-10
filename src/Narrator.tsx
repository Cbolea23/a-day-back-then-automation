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
import {ReactionKind} from "./types";

export type CharacterTheme =
  | "roman"
  | "egypt"
  | "viking"
  | "medieval"
  | "knight"
  | "plague-doctor"
  | "greek"
  | "gladiator";

export function getThemeFromSlug(slug: string = ""): CharacterTheme {
  const s = slug.toLowerCase();
  if (s.includes("gladiator")) {
    return "gladiator";
  }
  if (
    s.includes("egypt") ||
    s.includes("pharaoh") ||
    s.includes("pyramid") ||
    s.includes("mummy") ||
    s.includes("embalmer") ||
    s.includes("scribe")
  ) {
    return "egypt";
  }
  if (
    s.includes("greek") ||
    s.includes("athens") ||
    s.includes("sparta") ||
    s.includes("olympic") ||
    s.includes("symposium")
  ) {
    return "greek";
  }
  if (s.includes("viking") || s.includes("norse")) {
    return "viking";
  }
  if (s.includes("knight")) {
    return "knight";
  }
  if (s.includes("plague")) {
    return "plague-doctor";
  }
  if (s.includes("medieval") || s.includes("castle") || s.includes("peasant")) {
    return "medieval";
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
  talking?: boolean;
  height?: number;
  tunic?: string;
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
  if (!plan) {
    // Legacy fallback: gentle talking flutter.
    if (!talking) return 0;
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
  };
  const right: Record<Expression, [number, number, number, number, number, number]> = {
    neutral: [161, 70, 172, 66, 183, 70],
    happy: [161, 68, 172, 64, 183, 68],
    question: [161, 60, 172, 55, 183, 60],
    emphasis: [161, 66, 172, 68, 183, 73],
    sad: [161, 68, 172, 70, 183, 66],
    surprise: [159, 60, 172, 56, 185, 60],
    thoughtful: [161, 62, 172, 58, 183, 62],
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
  height = 760,
  tunic,
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
    }) * (expression === "surprise" ? 1.2 : 1);

  const skin = theme === "egypt" ? SKIN_EGYPT : SKIN;
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
        transform: `translateX(${p.shiftX}px) translateY(${breath}px) rotate(${p.lean}deg)`,
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
      ) : theme === "viking" || theme === "knight" || theme === "medieval" ? (
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
      {theme === "egypt" ? (
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

      {theme === "egypt" && (
        <>
          <circle cx={p.lHand[0]} cy={p.lHand[1]} r="10" fill="none" stroke="#e5b32f" strokeWidth="4" />
          <circle cx={p.rHand[0]} cy={p.rHand[1]} r="10" fill="none" stroke="#e5b32f" strokeWidth="4" />
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

        {theme === "egypt" ? (
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
        ) : theme === "viking" ? (
          <>
            <path d="M88 75 Q85 25 150 25 Q215 25 212 75 Z" fill="#694b2f" stroke={INK} strokeWidth="5" />
            <ellipse cx="150" cy="72" rx="66" ry="14" fill="#91704d" stroke={INK} strokeWidth="4" />
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
            {theme === "egypt" && (
              <>
                <path d="M120 86 L112 83 L110 88" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M180 86 L188 83 L190 88" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
            <Brows expression={expression} />
            {/* Eyes with pupils that look toward the gesture's focus */}
            {[128, 172].map((cx) => (
              <g key={cx}>
                <ellipse
                  cx={cx}
                  cy={88}
                  rx={8.5}
                  ry={Math.max(1.2, 9.5 * eyeScaleY)}
                  fill="#ffffff"
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

            {expression === "surprise" ? (
              <ellipse cx="150" cy="122" rx="10" ry="13" fill="#5a1d1d" stroke={INK} strokeWidth="3" />
            ) : talking ? (
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
            ) : expression === "sad" ? (
              <path d="M134 126 Q150 116 166 126" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
            ) : expression === "happy" ? (
              <path d="M132 116 Q150 132 168 116" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M134 118 Q150 128 166 118" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
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

  if (props.audioSrc) {
    const {audioSrc, ...rest} = props;
    return (
      <AudioMouth audioSrc={audioSrc} frame={localFrame} fps={fps}>
        {(audioMouth) => (
          <NarratorBody
            {...rest}
            frame={localFrame}
            mouthOpen={
              audioMouth ?? wordTimingMouth(props.plan, localFrame, props.talking ?? true)
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
      mouthOpen={wordTimingMouth(props.plan, localFrame, props.talking ?? true)}
    />
  );
};

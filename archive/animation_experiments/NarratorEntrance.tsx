import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {CharacterTheme, Expression, Gesture, Pose} from "./Narrator";
import {
  Vec,
  bezier2D,
  bezierQuad2D,
  clamp01,
  computeSkeletonAnchors,
  easeInOutCubic,
  easeInOutQuad,
  easeInQuad,
  easeOutBack,
  easeOutCubic,
  easeOutQuad,
  lerp,
  lerpVec,
  smootherstep,
  smoothstep,
  solveTwoBoneIK,
  LEG_THIGH_LEN,
  LEG_SHIN_LEN,
  ARM_UPPER_LEN,
  ARM_FORE_LEN,
} from "./kinematics";

export type EntranceKind =
  | "sky-fall"
  | "door-burst"
  | "wake-up"
  | "peek-crawl"
  | "skid-in";

export const ENTRANCE_DURATION_FRAMES = 48; // ~1.6s at 30fps

// ---------------------------------------------------------------------------
// Cartoon Dust Puff Component (Reusable Impact & Friction Particles)
// ---------------------------------------------------------------------------
const DustPuff: React.FC<{
  progress: number;
  x: number;
  y: number;
  side?: "left" | "right" | "both";
}> = ({progress, x, y, side = "both"}) => {
  if (progress <= 0 || progress >= 1) return null;

  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.9, 0.6, 0]);
  const spread = progress * 52;
  const radius = (1 - progress * 0.4) * 18;

  return (
    <g opacity={opacity}>
      {(side === "left" || side === "both") && (
        <>
          <circle cx={x - spread * 1.3} cy={y - progress * 16} r={radius * 0.95} fill="#e5dec9" stroke="#333" strokeWidth="2.5" />
          <circle cx={x - spread * 1.9} cy={y - progress * 9} r={radius * 0.7} fill="#f4efe2" stroke="#333" strokeWidth="2" />
          <circle cx={x - spread * 0.7} cy={y - progress * 20} r={radius * 0.55} fill="#d8cfb7" />
        </>
      )}
      {(side === "right" || side === "both") && (
        <>
          <circle cx={x + spread * 1.3} cy={y - progress * 16} r={radius * 0.95} fill="#e5dec9" stroke="#333" strokeWidth="2.5" />
          <circle cx={x + spread * 1.9} cy={y - progress * 9} r={radius * 0.7} fill="#f4efe2" stroke="#333" strokeWidth="2" />
          <circle cx={x + spread * 0.7} cy={y - progress * 20} r={radius * 0.55} fill="#d8cfb7" />
        </>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Animated Sleeping "Zzz" Floaties
// ---------------------------------------------------------------------------
const SleepingZzz: React.FC<{frame: number}> = ({frame}) => {
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const offset = i * 6;
        const localT = (frame + offset) % 24;
        const p = localT / 24;
        const y = 380 - p * 50;
        const x = 70 + p * 20 + Math.sin(p * Math.PI * 2) * 8;
        const op = interpolate(p, [0, 0.2, 0.7, 1], [0, 0.95, 0.7, 0]);
        const size = 14 + i * 5;
        return (
          <text
            key={i}
            x={x}
            y={y}
            fill="#7dd3fc"
            stroke="#0284c7"
            strokeWidth="1.5"
            fontSize={size}
            fontWeight="bold"
            fontFamily="Impact, Arial, sans-serif"
            opacity={op}
          >
            Z
          </text>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Realistic Era Bed Prop (for Wake-Up Entrance)
// ---------------------------------------------------------------------------
const EraBedProp: React.FC<{
  wakeProgress: number; // 0 = sleeping, 1 = stood up
  opacity?: number;
}> = ({wakeProgress, opacity = 1}) => {
  // As character wakes and stands up, blanket folds down, bed slides gently away
  const blanketFold = interpolate(wakeProgress, [0, 0.4, 1], [0, 45, 90], {
    extrapolateRight: "clamp",
  });
  const bedSlideX = interpolate(wakeProgress, [0.6, 1], [0, -180], {
    extrapolateRight: "clamp",
  });
  const bedOpacity = interpolate(wakeProgress, [0.7, 1], [1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        width: 380,
        height: 260,
        transform: `translateX(calc(-50% + ${bedSlideX}px))`,
        opacity: opacity * bedOpacity,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <svg viewBox="0 0 380 260" width="100%" height="100%" style={{overflow: "visible"}}>
        {/* Shadow under the bed */}
        <ellipse cx="190" cy="245" rx="160" ry="18" fill="rgba(0,0,0,0.55)" />

        {/* Wooden Headboard (Left) */}
        <rect x="25" y="80" width="22" height="155" rx="5" fill="#4a2e1b" stroke="#1c1109" strokeWidth="4" />
        <circle cx="36" cy="74" r="10" fill="#6d4427" stroke="#1c1109" strokeWidth="3" />

        {/* Wooden Footboard (Right) */}
        <rect x="335" y="115" width="20" height="120" rx="5" fill="#4a2e1b" stroke="#1c1109" strokeWidth="4" />
        <circle cx="345" cy="110" r="8" fill="#6d4427" stroke="#1c1109" strokeWidth="3" />

        {/* Mattress Base / Wooden Side Rails */}
        <rect x="35" y="180" width="310" height="42" rx="6" fill="#5c3821" stroke="#1c1109" strokeWidth="4" />
        <rect x="42" y="160" width="298" height="28" rx="8" fill="#e8dfcb" stroke="#26211a" strokeWidth="3" />

        {/* Fluffy Pillow */}
        <ellipse cx="90" cy="162" rx="36" ry="16" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
        <path d="M70 162 Q90 170 110 162" stroke="#94a3b8" strokeWidth="2" fill="none" />

        {/* Warm Cozy Quilt / Blanket (covers lower bed, folds back on wake) */}
        <path
          d={`M130 ${162 + blanketFold * 0.4} Q230 ${155 + blanketFold * 0.3} 338 165 L338 215 Q230 220 130 215 Z`}
          fill="#991b1b"
          stroke="#450a0a"
          strokeWidth="4"
        />
        {/* Blanket Folded Lip (Cream lining) */}
        <path
          d={`M128 ${162 + blanketFold * 0.4} Q230 ${154 + blanketFold * 0.3} 338 165 L338 ${172 + blanketFold * 0.4} Q230 ${164 + blanketFold * 0.3} 128 ${172 + blanketFold * 0.4} Z`}
          fill="#fef08a"
          stroke="#450a0a"
          strokeWidth="3"
        />
        {/* Bed Legs */}
        <rect x="38" y="215" width="14" height="32" rx="3" fill="#382213" stroke="#1c1109" strokeWidth="3" />
        <rect x="330" y="215" width="14" height="32" rx="3" fill="#382213" stroke="#1c1109" strokeWidth="3" />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 3D Wooden Door Component for Door-Burst Entrance
// ---------------------------------------------------------------------------
const BurstDoor: React.FC<{openProgress: number}> = ({openProgress}) => {
  const angle = interpolate(openProgress, [0, 0.4, 1], [0, -88, -105], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(openProgress, [0, 0.75, 1], [1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        width: 320,
        height: 580,
        transform: "translateX(-50%)",
        perspective: 900,
        pointerEvents: "none",
        opacity,
        zIndex: 5,
      }}
    >
      {/* Outer Door Frame Arch */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "12px solid #3d2b1f",
          borderBottom: "none",
          borderRadius: "140px 140px 0 0",
          backgroundColor: "rgba(12, 10, 8, 0.88)",
          boxShadow: "0 0 45px rgba(0,0,0,0.85)",
        }}
      />
      {/* Left Door Leaf (Swings out) */}
      <div
        style={{
          position: "absolute",
          top: 12,
          bottom: 0,
          left: 12,
          width: 148,
          backgroundColor: "#634735",
          border: "4px solid #1a120c",
          borderRadius: "120px 0 0 0",
          transformOrigin: "left center",
          transform: `rotateY(${angle}deg)`,
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          padding: "16px",
        }}
      >
        <div style={{width: 12, height: 12, borderRadius: 6, backgroundColor: "#1c1917"}} />
        <div style={{width: 12, height: 12, borderRadius: 6, backgroundColor: "#1c1917"}} />
        <div style={{width: 12, height: 12, borderRadius: 6, backgroundColor: "#1c1917"}} />
      </div>
      {/* Right Door Leaf */}
      <div
        style={{
          position: "absolute",
          top: 12,
          bottom: 0,
          right: 12,
          width: 148,
          backgroundColor: "#563c2b",
          border: "4px solid #1a120c",
          borderRadius: "0 120px 0 0",
          transformOrigin: "right center",
          transform: `rotateY(${-angle}deg)`,
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "flex-end",
          padding: "16px",
        }}
      >
        <div style={{width: 12, height: 12, borderRadius: 6, backgroundColor: "#1c1917"}} />
        <div style={{width: 12, height: 12, borderRadius: 6, backgroundColor: "#1c1917"}} />
        <div style={{width: 12, height: 12, borderRadius: 6, backgroundColor: "#1c1917"}} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Camera Lens Tap Wave Effect for Peek-Crawl
// ---------------------------------------------------------------------------
const LensTapRipple: React.FC<{progress: number}> = ({progress}) => {
  if (progress <= 0 || progress >= 1) return null;
  const radius = progress * 170;
  const opacity = interpolate(progress, [0, 0.2, 1], [0, 0.75, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: "42%",
        left: "50%",
        width: radius * 2,
        height: radius * 2,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        border: "4px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 0 30px rgba(56, 189, 248, 0.7)",
        opacity,
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Physical Entrance State Structure
// ---------------------------------------------------------------------------
export interface EntranceFrameState {
  transform: {
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    rotateDeg: number;
    overrideExpression?: Expression;
    overrideGesture?: Gesture;
    isTalkingAllowed: boolean;
  };
  poseOverride?: Partial<Pose>;
  dustProgress: number;
  dustSide: "left" | "right" | "both";
  extraOverlay?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// ===========================================================================
// ENTRANCE 1: SKY-FALL (Stratospheric Plunge to Deep Superhero Squat Landing)
// ===========================================================================
function computeSkyFall(frame: number, fps: number): EntranceFrameState {
  const impactFrame = 15;

  if (frame < impactFrame) {
    // Phase 1: Parabolic Freefall with Air Drag (Frames 0-15)
    const t = frame / impactFrame;
    const fallT = Math.pow(t, 2.2); // parabolic gravitational acceleration
    const translateY = lerp(-920, 0, fallT);

    // Wind drag pulls limbs up/back
    const windFlutter = Math.sin(frame * 0.8) * 4;

    return {
      transform: {
        translateY,
        translateX: 0,
        scaleX: 1,
        scaleY: 1,
        rotateDeg: Math.sin(frame * 0.35) * 2.5,
        overrideExpression: "surprise",
        isTalkingAllowed: false,
      },
      poseOverride: {
        torsoPitch: 4,
        hipDrop: 0,
        headDy: -6,
        lFoot: [116, 576],
        rFoot: [184, 576],
        lHand: [72, 105 + windFlutter],
        lElbow: [82, 160],
        rHand: [228, 105 - windFlutter],
        rElbow: [218, 160],
      },
      dustProgress: 0,
      dustSide: "both",
    };
  }

  // Phase 2: Contact & Deep Superhero Parkour Impact Squat (Frames 15-20)
  // Phase 3: Elastic Uncoil & Stand (Frames 20-30)
  // Phase 4: Settle & Greeting (Frames 30-60)
  let hipDrop = 0;
  let torsoPitch = 0;
  let lFoot: Vec = [120, 570];
  let rFoot: Vec = [180, 570];
  let lHand: Vec = [72, 318];
  let lElbow: Vec = [76, 255];
  let rHand: Vec = [228, 318];
  let rElbow: Vec = [224, 255];
  let expression: Expression = "emphasis";
  let gesture: Gesture | undefined = undefined;

  const dustProgress = interpolate(frame - impactFrame, [0, 14], [0.05, 1], {
    extrapolateRight: "clamp",
  });

  if (frame < 20) {
    // Impact Squash: Downward momentum carries into deep crouch
    const t = (frame - impactFrame) / 5;
    const squash = easeOutQuad(t);

    hipDrop = lerp(0, 70, squash);
    torsoPitch = lerp(0, 24, squash); // Torso pitches forward 24 deg over knees
    expression = "emphasis";

    // Feet planted wide
    lFoot = lerpVec([116, 570], [96, 570], squash);
    rFoot = lerpVec([184, 570], [204, 570], squash);

    // Left hand braces firmly on left knee/thigh (superhero parkour 3-point pose)
    lHand = lerpVec([72, 318], [88, 315], squash);
    lElbow = lerpVec([76, 255], [64, 255], squash);

    // Right arm balances out back
    rHand = lerpVec([228, 318], [245, 275], squash);
    rElbow = lerpVec([224, 255], [230, 215], squash);
  } else if (frame < 30) {
    // Uncoiling from the squat with smooth S-curve easing
    const t = (frame - 20) / 10;
    const uncoil = easeInOutCubic(t);

    hipDrop = lerp(70, 0, uncoil);
    torsoPitch = lerp(24, -2, uncoil); // slight overshoot backward
    expression = uncoil > 0.6 ? "happy" : "emphasis";

    lFoot = lerpVec([96, 570], [120, 570], uncoil);
    rFoot = lerpVec([204, 570], [180, 570], uncoil);

    // Left hand lifts smoothly off knee in a curved arc
    lHand = bezier2D([88, 315], [82, 316], [76, 318], [72, 318], uncoil);
    lElbow = lerpVec([64, 255], [76, 255], uncoil);

    rHand = bezier2D([245, 275], [240, 290], [232, 310], [228, 318], uncoil);
    rElbow = lerpVec([230, 215], [224, 255], uncoil);
  } else {
    // Spring Settle & Friendly Greeting
    const springT = spring({
      frame: frame - 30,
      fps,
      config: {damping: 14, stiffness: 120},
    });

    hipDrop = lerp(-2, 0, springT);
    torsoPitch = lerp(-2, 0, springT);
    expression = "happy";
    gesture = "wave";

    // Right hand waves smoothly
    const waveT = (frame - 30) * 0.45;
    rHand = [228 + Math.sin(waveT) * 16, 140];
    rElbow = [232, 205];
  }

  return {
    transform: {
      translateY: 0,
      translateX: 0,
      scaleX: 1,
      scaleY: 1,
      rotateDeg: 0,
      overrideExpression: expression,
      overrideGesture: gesture,
      isTalkingAllowed: frame >= 28,
    },
    poseOverride: {
      hipDrop,
      torsoPitch,
      lFoot,
      rFoot,
      lHand,
      lElbow,
      rHand,
      rElbow,
    },
    dustProgress: dustProgress < 1 ? dustProgress : 0,
    dustSide: "both",
  };
}

// ===========================================================================
// ENTRANCE 2: DOOR-BURST (Richard Williams 4-Key Walk Cycle & Stride)
// ===========================================================================
function computeDoorBurst(frame: number, fps: number): EntranceFrameState {
  // Door swings open with cubic ease-out
  const doorOpenProgress = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Camera forward walk progression
  const walkProgress = interpolate(frame, [8, 34], [-24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => easeInOutQuad(t),
  });

  let lFoot: Vec = [120, 570];
  let rFoot: Vec = [180, 570];
  let lHand: Vec = [72, 318];
  let lElbow: Vec = [76, 255];
  let rHand: Vec = [228, 318];
  let rElbow: Vec = [224, 255];
  let torsoPitch = 0;
  let hipDrop = 0;
  let expression: Expression = "neutral";
  let gesture: Gesture | undefined = undefined;

  if (frame < 8) {
    // Waiting behind door, anticipation
    torsoPitch = 5;
    lFoot = [120, 570];
    rFoot = [180, 570];
  } else if (frame < 32) {
    // Two Complete Richard Williams Walk Cycles (12 frames per step)
    // Step 1: frames 8-20 (Left leg swing)
    // Step 2: frames 20-32 (Right leg swing)
    const cycleFrame = frame - 8;
    const isStep1 = cycleFrame < 12;
    const stepProgress = (cycleFrame % 12) / 12;

    // Pelvis has TWO dips (down pose) and TWO peaks (passing/up pose)
    // Sinusoidal wave across the 12-frame step:
    const verticalBob = Math.sin(stepProgress * Math.PI * 2) * 6;
    hipDrop = -verticalBob;

    torsoPitch = 7 + Math.cos(stepProgress * Math.PI * 2) * 2;

    if (isStep1) {
      // LEFT LEG SWINGS FORWARD (Passing -> Up -> Contact)
      const swingArcY = 570 - Math.sin(stepProgress * Math.PI) * 44;
      const swingX = lerp(145, 90, easeInOutQuad(stepProgress));
      lFoot = [swingX, swingArcY];

      // RIGHT LEG IS ON GROUND (Stance push-off)
      const stanceX = lerp(180, 215, stepProgress);
      rFoot = [stanceX, 570];

      // ARMS COUNTER-SWING NATURALLY
      const armSwing = Math.sin(stepProgress * Math.PI);
      rHand = [228 + armSwing * 18, 318 - armSwing * 45]; // Right arm swings forward
      rElbow = [224 + armSwing * 10, 255 - armSwing * 22];
      lHand = [72 - armSwing * 14, 318 + armSwing * 15];  // Left arm back
      lElbow = [76 - armSwing * 8, 255 + armSwing * 10];
    } else {
      // RIGHT LEG SWINGS FORWARD
      const swingArcY = 570 - Math.sin(stepProgress * Math.PI) * 44;
      const swingX = lerp(215, 160, easeInOutQuad(stepProgress));
      rFoot = [swingX, swingArcY];

      // LEFT LEG IS ON GROUND
      const stanceX = lerp(90, 120, stepProgress);
      lFoot = [stanceX, 570];

      // ARMS COUNTER-SWING NATURALLY
      const armSwing = Math.sin(stepProgress * Math.PI);
      lHand = [72 - armSwing * 18, 318 - armSwing * 45]; // Left arm swings forward
      lElbow = [76 - armSwing * 10, 255 - armSwing * 22];
      rHand = [228 + armSwing * 14, 318 + armSwing * 15]; // Right arm back
      rElbow = [224 + armSwing * 8, 255 + armSwing * 10];
    }
  } else if (frame < 40) {
    // Deceleration to standing stop
    const t = (frame - 32) / 8;
    const e = easeOutCubic(t);

    torsoPitch = lerp(7, 0, e);
    hipDrop = lerp(-2, 0, e);
    lFoot = lerpVec([120, 570], [120, 570], e);
    rFoot = lerpVec([160, 570], [180, 570], e);
    lHand = lerpVec([72, 318], [72, 318], e);
    rHand = lerpVec([228, 318], [228, 318], e);
    expression = "proud";
  } else {
    // Snappy Gladiator/Officer Salute
    const t = Math.min(1, (frame - 40) / 8);
    const saluteT = easeOutBack(t, 1.6);

    torsoPitch = 0;
    hipDrop = 0;
    expression = "proud";

    // Right hand snaps up to forehead in an arc
    rHand = bezier2D([228, 318], [240, 220], [215, 140], [185, 105], saluteT);
    rElbow = lerpVec([224, 255], [236, 150], saluteT);
  }

  return {
    transform: {
      translateY: 0,
      translateX: walkProgress,
      scaleX: 1,
      scaleY: 1,
      rotateDeg: 0,
      overrideExpression: expression,
      overrideGesture: frame >= 46 ? "wave" : gesture,
      isTalkingAllowed: frame >= 38,
    },
    poseOverride: {
      torsoPitch,
      hipDrop,
      lFoot,
      rFoot,
      lHand,
      lElbow,
      rHand,
      rElbow,
    },
    dustProgress: 0,
    dustSide: "both",
    extraOverlay: <BurstDoor openProgress={doorOpenProgress} />,
  };
}

// ===========================================================================
// ENTRANCE 3: WAKE-UP (Properly Waking Up from an Era Bed!)
// ===========================================================================
// ===========================================================================
// ENTRANCE 3: WAKE-UP (Heavy Sleep, Core Sit-Up, Eye Rub, Rail Swing, Push-Up)
// ===========================================================================
function computeWakeUp(frame: number, fps: number): EntranceFrameState {
  const alarmFrame = 12;

  // Wake progress 0..1 for props
  const wakeProgress = interpolate(frame, [alarmFrame, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => easeInOutCubic(t),
  });

  let torsoPitch = -78;
  let hipDrop = 38;
  let translateY = 45;
  let headDy = 18;
  let headTilt = 3;
  let lFoot: Vec = [120, 570];
  let rFoot: Vec = [180, 570];
  let lHand: Vec = [120, 275];
  let lElbow: Vec = [95, 235];
  let rHand: Vec = [165, 275];
  let rElbow: Vec = [185, 235];
  let expression: Expression = "neutral";
  let gesture: Gesture | undefined = undefined;

  if (frame < alarmFrame) {
    // Phase 1: Deep Sleep on Bed (Breathing rhythm)
    const breath = Math.sin(frame * 0.4) * 1.5;
    torsoPitch = -78 + breath;
    translateY = 45;
    expression = "neutral";
  } else if (frame < 16) {
    // Phase 2: Alarm Startle (Head and eyes snap open first!)
    const joltT = (frame - alarmFrame) / 4;
    headDy = lerp(18, -12, easeOutBack(joltT, 2));
    expression = "surprise";
    torsoPitch = -76;
    translateY = 45;
  } else if (frame < 28) {
    // Phase 3: Heavy Core Sit-Up with Ease-In-Out
    const t = (frame - 16) / 12;
    const sitT = easeInOutCubic(t);

    torsoPitch = lerp(-76, -10, sitT);
    translateY = lerp(45, 30, sitT);
    hipDrop = lerp(38, 42, sitT);
    headDy = lerp(-12, 0, sitT);
    expression = "thoughtful";

    // Right arm braces down on mattress for leverage
    rHand = bezier2D([165, 275], [175, 310], [178, 318], [175, 318], sitT);
    rElbow = lerpVec([185, 235], [200, 260], sitT);

    // Left arm sluggishly rises
    lHand = bezier2D([120, 275], [115, 260], [110, 230], [120, 200], sitT);
    lElbow = lerpVec([95, 235], [90, 200], sitT);
  } else if (frame < 38) {
    // Phase 4: Asymmetrical Eye Rubbing (Circular arc at eye)
    const t = (frame - 28) / 10;
    const rubProgress = easeInOutQuad(t);

    torsoPitch = -8;
    translateY = 30;
    hipDrop = 42;
    expression = "thoughtful";

    // Left hand travels up to eye and rubs gently
    const circularRub = Math.sin(frame * 1.2) * 3;
    lHand = [
      lerp(120, 136, rubProgress) + circularRub,
      lerp(200, 110, rubProgress) + Math.cos(frame * 1.2) * 2,
    ];
    lElbow = lerpVec([90, 200], [80, 150], rubProgress);

    // Right hand still bracing mattress
    rHand = [175, 318];
    rElbow = [200, 260];
  } else if (frame < 46) {
    // Phase 5: Swinging Legs Over Bed Rail
    const t = (frame - 38) / 8;
    const swingT = easeInOutQuad(t);

    torsoPitch = lerp(-8, 8, swingT); // beginning to lean forward
    translateY = lerp(30, 18, swingT);
    hipDrop = 40;
    expression = "neutral";

    // Left leg swings over rail
    lFoot = bezier2D([120, 520], [115, 545], [112, 565], [115, 570], swingT);
    // Right leg follows with subtle lag
    rFoot = bezier2D([180, 520], [175, 545], [172, 565], [175, 570], Math.max(0, swingT - 0.15) / 0.85);

    // Hands move from mattress toward knees
    lHand = bezier2D([136, 110], [120, 190], [100, 260], [92, 315], swingT);
    lElbow = lerpVec([80, 150], [78, 255], swingT);
    rHand = lerpVec([175, 318], [170, 318], swingT);
  } else if (frame < 54) {
    // Phase 6: Forward Torso Lean Over Knees & Standing Push-Off
    // CRITICAL: Character leans forward 22 deg to transfer center of gravity over feet!
    const t = (frame - 46) / 8;
    const standT = easeInOutCubic(t);

    torsoPitch = lerp(22, 0, standT);
    hipDrop = lerp(40, 0, standT);
    translateY = lerp(18, 0, standT);
    expression = "happy";

    lFoot = [120, 570];
    rFoot = [180, 570];

    // Arms push off and lower to natural sides
    lHand = lerpVec([92, 315], [72, 318], standT);
    lElbow = lerpVec([78, 255], [76, 255], standT);
    rHand = lerpVec([170, 318], [228, 318], standT);
    rElbow = lerpVec([200, 260], [224, 255], standT);
  } else {
    // Phase 7: Morning Stretch & Friendly Wave
    const t = Math.min(1, (frame - 54) / 6);
    const stretchT = easeOutBack(t, 1.4);

    torsoPitch = lerp(0, -4, stretchT); // expanded chest
    hipDrop = 0;
    translateY = 0;
    expression = "happy";
    gesture = "wave";

    // Right hand stretches then waves
    rHand = bezier2D([228, 318], [240, 210], [245, 120], [228, 140], stretchT);
    rElbow = lerpVec([224, 255], [232, 205], stretchT);
  }

  return {
    transform: {
      translateY,
      translateX: 0,
      scaleX: 1,
      scaleY: 1,
      rotateDeg: 0,
      overrideExpression: expression,
      overrideGesture: gesture,
      isTalkingAllowed: frame >= 48,
    },
    poseOverride: {
      torsoPitch,
      hipDrop,
      headDy,
      headTilt,
      lFoot,
      rFoot,
      lHand,
      lElbow,
      rHand,
      rElbow,
    },
    dustProgress: 0,
    dustSide: "both",
    extraOverlay: (
      <>
        <EraBedProp wakeProgress={wakeProgress} />
        {frame < alarmFrame && <SleepingZzz frame={frame} />}
      </>
    ),
  };
}

// ===========================================================================
// ENTRANCE 4: PEEK-CRAWL (Hands Grip Ledge, Pull Up, Step onto Stage & Tap Glass)
// ===========================================================================
function computePeekCrawl(frame: number, fps: number): EntranceFrameState {
  let lHand: Vec = [72, 318];
  let lElbow: Vec = [76, 255];
  let rHand: Vec = [228, 318];
  let rElbow: Vec = [224, 255];
  let lFoot: Vec = [120, 570];
  let rFoot: Vec = [180, 570];
  let hipDrop = 0;
  let torsoPitch = 0;
  let translateY = 220;
  let expression: Expression = "thoughtful";
  let gesture: Gesture | undefined = undefined;

  if (frame < 12) {
    // Phase 1: Hands Grip Bezel Rim & Eye Peek
    const t = frame / 12;
    translateY = lerp(220, 160, easeOutQuad(t));
    torsoPitch = 10;
    lHand = [82, 285];
    lElbow = [65, 235];
    rHand = [218, 285];
    rElbow = [235, 235];
    expression = "thoughtful";
  } else if (frame < 22) {
    // Phase 2: Bicep Pull-Up & Shoulder Elevation
    const t = (frame - 12) / 10;
    const pullT = easeInOutCubic(t);
    translateY = lerp(160, 45, pullT);
    torsoPitch = lerp(10, 14, pullT);

    lHand = lerpVec([82, 285], [74, 315], pullT);
    lElbow = lerpVec([65, 235], [76, 255], pullT);
    rHand = lerpVec([218, 285], [226, 315], pullT);
    rElbow = lerpVec([235, 235], [224, 255], pullT);
    expression = "emphasis";
  } else if (frame < 32) {
    // Phase 3: Leg Hook & Mantle Onto Stage Floor
    const t = (frame - 22) / 10;
    const mantleT = easeInOutQuad(t);
    translateY = lerp(45, 0, mantleT);
    torsoPitch = lerp(14, 6, mantleT);

    // Left knee hooks over ledge onto stage floor
    lFoot = bezier2D([120, 600], [110, 540], [105, 560], [115, 570], mantleT);
    rFoot = bezier2D([180, 600], [175, 560], [170, 565], [175, 570], mantleT);

    lHand = lerpVec([74, 315], [72, 318], mantleT);
    lElbow = [76, 255];
    rHand = lerpVec([226, 315], [228, 318], mantleT);
    rElbow = [224, 255];
    expression = "neutral";
  } else if (frame < 42) {
    // Phase 4: Stand & Lens Inspection Forward Lean
    const t = (frame - 32) / 10;
    const reachT = easeInOutQuad(t);
    translateY = 0;
    torsoPitch = lerp(6, 9, reachT); // Leaning forward toward camera glass
    expression = "thoughtful";

    // Right arm extends forward in a smooth arc toward camera lens
    rHand = bezier2D([228, 318], [220, 240], [195, 170], [175, 140], reachT);
    rElbow = lerpVec([224, 255], [215, 195], reachT);
  } else if (frame < 48) {
    // Phase 5: Tap Screen Glass (Frame 42) & Elastic Recoil
    const t = (frame - 42) / 6;
    const recoilT = easeOutBack(t, 2);
    translateY = 0;
    torsoPitch = lerp(9, 2, recoilT);
    expression = "happy";

    rHand = bezier2D([175, 140], [180, 150], [195, 180], [220, 180], recoilT);
    rElbow = lerpVec([215, 195], [225, 215], recoilT);
  } else {
    // Phase 6: Stage Presentation Wave
    const t = Math.min(1, (frame - 48) / 8);
    const waveT = easeOutCubic(t);
    translateY = 0;
    torsoPitch = 0;
    expression = "happy";
    gesture = "wave";

    rHand = bezier2D([220, 180], [228, 160], [232, 145], [228, 140], waveT);
    rElbow = [232, 205];
  }

  // Optical shockwave ripple expanding on frame 42
  const rippleProgress = interpolate(frame - 42, [0, 14], [0.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    transform: {
      translateY,
      translateX: 0,
      scaleX: 1,
      scaleY: 1,
      rotateDeg: 0,
      overrideExpression: expression,
      overrideGesture: gesture,
      isTalkingAllowed: frame >= 44,
    },
    poseOverride: {
      torsoPitch,
      hipDrop,
      lFoot,
      rFoot,
      lHand,
      lElbow,
      rHand,
      rElbow,
    },
    dustProgress: 0,
    dustSide: "both",
    extraOverlay: frame >= 42 ? <LensTapRipple progress={rippleProgress} /> : null,
  };
}

// ===========================================================================
// ENTRANCE 5: SKID-IN (Articulated Sprint, Heel Brake & Drift)
// ===========================================================================
function computeSkidIn(frame: number, fps: number): EntranceFrameState {
  const skidStart = 12;

  let lFoot: Vec = [120, 570];
  let rFoot: Vec = [180, 570];
  let lHand: Vec = [72, 318];
  let lElbow: Vec = [76, 255];
  let rHand: Vec = [228, 318];
  let rElbow: Vec = [224, 255];
  let torsoPitch = 0;
  let hipDrop = 0;
  let translateX = 0;
  let rotateDeg = 0;
  let expression: Expression = "emphasis";
  let gesture: Gesture | undefined = undefined;

  if (frame < skidStart) {
    // Phase 1: High-Speed Sprint (Frames 0-12)
    const t = frame / skidStart;
    translateX = lerp(-680, -110, t);
    rotateDeg = 6;
    torsoPitch = 14; // Athletic forward lean
    expression = "emphasis";

    // High alternating sprint knee cycle (8-frame periodicity)
    const runPhase = (frame / 8) * Math.PI * 2;
    const lLift = Math.sin(runPhase);
    const rLift = Math.sin(runPhase + Math.PI);

    lFoot = [
      120 - Math.cos(runPhase) * 22,
      570 - Math.max(0, lLift) * 65,
    ];
    rFoot = [
      180 - Math.cos(runPhase + Math.PI) * 22,
      570 - Math.max(0, rLift) * 65,
    ];

    // Pumping arms in counter-phase naturally
    lHand = [72, 290 - lLift * 35];
    rHand = [228, 290 - rLift * 35];
  } else if (frame < 26) {
    // Phase 2: Friction Brake Heel Slide (Frames 12-26)
    const t = (frame - skidStart) / 14;
    const brakeDecel = easeOutCubic(t);
    translateX = lerp(-110, 0, brakeDecel);

    const frictionPower = 1 - brakeDecel;

    // Deep -24 deg backward friction lean into the slide
    torsoPitch = -24 * frictionPower;
    rotateDeg = -7 * frictionPower;
    hipDrop = 28 * frictionPower;
    expression = "emphasis";

    // Front left leg locks forward with heel dug in:
    lFoot = lerpVec([120, 570], [155, 570], frictionPower);
    // Rear right leg crouches deeply in low-center-of-gravity trail:
    rFoot = lerpVec([180, 570], [55, 565], frictionPower);

    // Arms spread wide for dynamic balance
    lHand = lerpVec([72, 318], [45, 275], frictionPower);
    lElbow = lerpVec([76, 255], [60, 240], frictionPower);
    rHand = lerpVec([228, 318], [255, 275], frictionPower);
    rElbow = lerpVec([224, 255], [240, 240], frictionPower);
  } else if (frame < 36) {
    // Phase 3: Momentum Transfer & Damped Spring Rebound
    const t = (frame - 26) / 10;
    const rebound = easeOutBack(t, 1.8);

    torsoPitch = lerp(-4, 0, rebound);
    rotateDeg = lerp(-1, 0, rebound);
    hipDrop = lerp(4, 0, rebound);
    translateX = 0;
    expression = "smug";

    lFoot = [120, 570];
    rFoot = [180, 570];
    lHand = [72, 318];
    lElbow = [76, 255];
    rHand = [228, 318];
    rElbow = [224, 255];
  } else {
    // Phase 4: Cocky Wink & Stage Wave
    torsoPitch = 0;
    rotateDeg = 0;
    hipDrop = 0;
    translateX = 0;
    expression = "smug";
    gesture = "wave";

    const waveT = (frame - 36) * 0.45;
    rHand = [228 + Math.sin(waveT) * 16, 140];
    rElbow = [232, 205];
  }

  const dustProgress = interpolate(frame - skidStart, [0, 14], [0.05, 1], {
    extrapolateRight: "clamp",
  });

  return {
    transform: {
      translateY: 0,
      translateX,
      scaleX: 1,
      scaleY: 1,
      rotateDeg,
      overrideExpression: expression,
      overrideGesture: gesture,
      isTalkingAllowed: frame >= 26,
    },
    poseOverride: {
      torsoPitch,
      hipDrop,
      lFoot,
      rFoot,
      lHand,
      lElbow,
      rHand,
      rElbow,
    },
    dustProgress: dustProgress < 1 ? dustProgress : 0,
    dustSide: "left",
  };
}

// ---------------------------------------------------------------------------
// Main Dispatcher
// ---------------------------------------------------------------------------
export function getEntrancePhysics(
  kind: EntranceKind,
  frame: number,
  fps = 30,
): EntranceFrameState {
  switch (kind) {
    case "sky-fall":
      return computeSkyFall(frame, fps);
    case "door-burst":
      return computeDoorBurst(frame, fps);
    case "wake-up":
      return computeWakeUp(frame, fps);
    case "peek-crawl":
      return computePeekCrawl(frame, fps);
    case "skid-in":
      return computeSkidIn(frame, fps);
    default:
      return {
        transform: {
          translateX: 0,
          translateY: 0,
          scaleX: 1,
          scaleY: 1,
          rotateDeg: 0,
          isTalkingAllowed: true,
        },
        dustProgress: 0,
        dustSide: "both",
      };
  }
}

// ---------------------------------------------------------------------------
// Narrator Entrance Wrapper Component
// ---------------------------------------------------------------------------
export const NarratorEntranceWrapper: React.FC<{
  kind: EntranceKind;
  frame: number;
  fps?: number;
  theme?: CharacterTheme;
  children: (props: {
    overrideExpression?: Expression;
    overrideGesture?: Gesture;
    isTalking: boolean;
    poseOverride?: Partial<Pose>;
  }) => React.ReactNode;
}> = ({kind, frame, fps = 30, children}) => {
  const {transform, poseOverride, dustProgress, dustSide, extraOverlay} =
    getEntrancePhysics(kind, frame, fps);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        transformOrigin: "50% 100%",
        transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scaleX}, ${transform.scaleY}) rotate(${transform.rotateDeg}deg)`,
      }}
    >
      {/* Background Entrance Props (e.g. Bed, Doors) */}
      {extraOverlay}

      {/* Ground Dust Particles */}
      {dustProgress > 0 && (
        <svg
          style={{
            position: "absolute",
            bottom: -15,
            left: "50%",
            transform: "translateX(-50%)",
            width: 380,
            height: 90,
            overflow: "visible",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <DustPuff progress={dustProgress} x={190} y={65} side={dustSide} />
        </svg>
      )}

      {/* Render Narrator with Dynamic Joint & Expression Overrides */}
      {children({
        overrideExpression: transform.overrideExpression,
        overrideGesture: transform.overrideGesture,
        isTalking: transform.isTalkingAllowed,
        poseOverride,
      })}
    </div>
  );
};

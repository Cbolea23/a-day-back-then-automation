/**
 * kinematics.ts - Character Kinematics & Animation Engine
 * 
 * Based on classic master character animation principles (Richard Williams, "The Animator's Survival Kit"):
 * 1. 2-Bone Inverse Kinematics (IK) for anatomical limb stability (no bone stretching/shrinking).
 * 2. Contact, Down, Passing, Up walk cycle mechanics.
 * 3. 2D Bezier Motion Arcs (natural organic movement curves, never rigid straight lines).
 * 4. Anticipation, Impact Absorption (Squash & Stretch), and Secondary Follow-Through / Overlap.
 * 5. Anatomically anchored pelvis and shoulder pivot transforms.
 */

export type Vec = [number, number];

// ---------------------------------------------------------------------------
// 1. EASING & INTERPOLATION FUNCTIONS (C1 / C2 continuous curves)
// ---------------------------------------------------------------------------

export const clamp01 = (t: number): number => Math.max(0, Math.min(1, t));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const lerpVec = (a: Vec, b: Vec, t: number): Vec => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
];

/** Smoothstep: zero velocity at both endpoints (3t^2 - 2t^3) */
export const smoothstep = (t: number): number => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

/** Smootherstep: zero velocity and zero acceleration at endpoints (Ken Perlin) */
export const smootherstep = (t: number): number => {
  const c = clamp01(t);
  return c * c * c * (c * (c * 6 - 15) + 10);
};

export const easeInQuad = (t: number): number => {
  const c = clamp01(t);
  return c * c;
};

export const easeOutQuad = (t: number): number => {
  const c = clamp01(t);
  return c * (2 - c);
};

export const easeInOutQuad = (t: number): number => {
  const c = clamp01(t);
  return c < 0.5 ? 2 * c * c : -1 + (4 - 2 * c) * c;
};

export const easeInCubic = (t: number): number => {
  const c = clamp01(t);
  return c * c * c;
};

export const easeOutCubic = (t: number): number => {
  const c = clamp01(t);
  return 1 - Math.pow(1 - c, 3);
};

export const easeInOutCubic = (t: number): number => {
  const c = clamp01(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

/** Anticipation / Wind-up: slight backward dip before forward motion */
export const easeInBack = (t: number, s: number = 1.70158): number => {
  const c = clamp01(t);
  return c * c * ((s + 1) * c - s);
};

/** Overshoot / Settle: slight forward bounce past target before settling */
export const easeOutBack = (t: number, s: number = 1.70158): number => {
  const c = clamp01(t);
  const p = c - 1;
  return p * p * ((s + 1) * p + s) + 1;
};

/** Damped spring oscillation settle */
export const easeOutElastic = (t: number): number => {
  const c = clamp01(t);
  if (c === 0 || c === 1) return c;
  const p = 0.3;
  return Math.pow(2, -10 * c) * Math.sin(((c - p / 4) * (2 * Math.PI)) / p) + 1;
};

/** 2D Cubic Bezier for natural motion arcs */
export function bezier2D(p0: Vec, p1: Vec, p2: Vec, p3: Vec, t: number): Vec {
  const c = clamp01(t);
  const u = 1 - c;
  const tt = c * c;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * c;

  const x = uuu * p0[0] + 3 * uu * c * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0];
  const y = uuu * p0[1] + 3 * uu * c * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1];
  return [x, y];
}

/** Quadratic Bezier */
export function bezierQuad2D(p0: Vec, p1: Vec, p2: Vec, t: number): Vec {
  const c = clamp01(t);
  const u = 1 - c;
  const x = u * u * p0[0] + 2 * u * c * p1[0] + c * c * p2[0];
  const y = u * u * p0[1] + 2 * u * c * p1[1] + c * c * p2[1];
  return [x, y];
}

// ---------------------------------------------------------------------------
// 2. INVERSE KINEMATICS (2-BONE ANALYTICAL IK SOLVER)
// ---------------------------------------------------------------------------

export interface IKSolution {
  joint: Vec; // solved knee or elbow coordinate
  tip: Vec;   // clamped foot or hand coordinate
  bone1Length: number;
  bone2Length: number;
}

/**
 * Analytical 2-bone Inverse Kinematics solver using the Law of Cosines.
 * Guarantees bone lengths remain constant across every single frame.
 * 
 * @param root Root joint (hip or shoulder)
 * @param target Desired tip position (foot or hand)
 * @param l1 Upper bone length (thigh or upper arm)
 * @param l2 Lower bone length (shin or forearm)
 * @param bendPositive If true, joint bends clockwise/outward; if false, counterclockwise/inward
 */
export function solveTwoBoneIK(
  root: Vec,
  target: Vec,
  l1: number,
  l2: number,
  bendPositive: boolean = true,
): IKSolution {
  const dx = target[0] - root[0];
  const dy = target[1] - root[1];
  const dist = Math.hypot(dx, dy);

  // Anatomical reachable limits
  const maxReach = l1 + l2 - 0.2;
  const minReach = Math.max(6, Math.abs(l1 - l2) + 0.2);
  const clampedDist = Math.max(minReach, Math.min(maxReach, dist));

  const baseAngle = Math.atan2(dy, dx);

  // Law of Cosines for the angle at root joint
  const cosAlpha = (l1 * l1 + clampedDist * clampedDist - l2 * l2) / (2 * l1 * clampedDist);
  const clampedCosAlpha = Math.max(-1, Math.min(1, cosAlpha));
  const alpha = Math.acos(clampedCosAlpha);

  const jointAngle = baseAngle + (bendPositive ? alpha : -alpha);

  const jx = root[0] + l1 * Math.cos(jointAngle);
  const jy = root[1] + l1 * Math.sin(jointAngle);

  // If target was farther than max reachable length, clamp tip along reach line
  const tipX = dist > maxReach ? root[0] + (dx / (dist || 1)) * maxReach : target[0];
  const tipY = dist > maxReach ? root[1] + (dy / (dist || 1)) * maxReach : target[1];

  return {
    joint: [jx, jy],
    tip: [tipX, tipY],
    bone1Length: l1,
    bone2Length: l2,
  };
}

// ---------------------------------------------------------------------------
// 3. SKELETON ANCHOR SYSTEM (Rotated Pelvis & Shoulders)
// ---------------------------------------------------------------------------

export interface SkeletonAnchors {
  pelvis: Vec;
  leftHip: Vec;
  rightHip: Vec;
  leftShoulder: Vec;
  rightShoulder: Vec;
  head: Vec;
}

/**
 * Calculates true world coordinates for hips, shoulders, and head
 * given vertical hipDrop and torsoPitch rotation around pelvis.
 */
export function computeSkeletonAnchors(
  hipDrop: number = 0,
  torsoPitch: number = 0,
): SkeletonAnchors {
  const pivotX = 150;
  const pivotY = 400 + hipDrop;
  const rad = (torsoPitch * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const rotateAroundPivot = (dx: number, dy: number): Vec => [
    pivotX + (dx * cos - dy * sin),
    pivotY + (dx * sin + dy * cos),
  ];

  return {
    pelvis: [pivotX, pivotY],
    leftHip: rotateAroundPivot(-28, 0),
    rightHip: rotateAroundPivot(28, 0),
    leftShoulder: rotateAroundPivot(-48, -210),
    rightShoulder: rotateAroundPivot(48, -210),
    head: rotateAroundPivot(0, -250),
  };
}

// Standard human proportions for the Remotion 300x600 viewBox
// Thigh and Shin at 88px allow full 176px reach, keeping stance feet solidly planted at y=570 without clipping
export const LEG_THIGH_LEN = 88;
export const LEG_SHIN_LEN = 88;
export const ARM_UPPER_LEN = 68;
export const ARM_FORE_LEN = 68;

// ---------------------------------------------------------------------------
// 4. RICHARD WILLIAMS WALK CYCLE ENGINE (Zero-Slip Ground Contact)
// ---------------------------------------------------------------------------

export interface WalkCycleOptions {
  /** Frames per full 2-step stride cycle. Default 24 frames (12 frames per step at 30fps). */
  cadence?: number;
  /** Horizontal half-stride amplitude in viewBox px. Default 26px. */
  stride?: number;
  /** Vertical foot clearance lift during passing phase in px. Default 28px. */
  stepHeight?: number;
  /** Facing direction / travel vector. Default "right". */
  facing?: "right" | "left" | "forward";
  /** Pelvis dip amplitude on Down pose (cushion) in px. Default 5px. */
  hipDropAmplitude?: number;
  /** Forward arm counter-swing amplitude in px. Default 22px. */
  armSwingAmplitude?: number;
}

export interface WalkPose {
  lFoot: Vec;
  rFoot: Vec;
  lFootAngle: number;
  rFootAngle: number;
  hipDrop: number;
  torsoPitch: number;
  shiftX: number;
  lHand: Vec;
  rHand: Vec;
  lElbow: Vec;
  rElbow: Vec;
  lKneeBend: boolean;
  rKneeBend: boolean;
}

/**
 * Computes the Richard Williams 4-Phase Walk Cycle:
 * 1. Contact (heel strike, trailing toe push-off)
 * 2. Down (weight cushion, knee flex, hip drop)
 * 3. Passing (stance foot flat under hip, swing foot clears ground in Bezier arc)
 * 4. Up (push-off onto toe, hip rise)
 * 
 * Stance foot speed is strictly linear and constant relative to the pelvis:
 * When the scene translates at matching speed (v = (2 * stride * scale) / stepFrames),
 * the stance foot world coordinate is mathematically stationary (0px slippage).
 */
export function computeWalkPose(
  frame: number,
  options?: WalkCycleOptions,
): WalkPose {
  const cadence = options?.cadence ?? 24;
  const stride = options?.stride ?? 20;
  const stepHeight = options?.stepHeight ?? 22;
  const facing = options?.facing ?? "right";
  const hipDropAmp = options?.hipDropAmplitude ?? 4;
  const armAmp = options?.armSwingAmplitude ?? 18;

  // Normalized progress through the 2-step cycle [0..1)
  const cycle = (((frame % cadence) + cadence) % cadence) / cadence;
  const isStep0 = cycle < 0.5; // step 0: Left swings forward, Right in stance
  const t = isStep0 ? cycle / 0.5 : (cycle - 0.5) / 0.5; // progress through current step [0..1)

  // 1. Pelvis Vertical Bob:
  // Dips +hipDropAmp on Down (t=0.25), rises -hipDropAmp on Up (t=0.75)
  const hipDrop = hipDropAmp * Math.sin(t * Math.PI * 2);

  // 2. Torso Pitch: natural 4 deg forward lean + subtle weight shift oscillation
  const dirMultiplier = facing === "left" ? -1 : 1;
  const torsoPitch = (4 + 1.5 * Math.cos(t * Math.PI * 2)) * (facing === "forward" ? 0.4 : 1);

  // 3. Pelvis Lateral Sway (weight shifts slightly over the stance leg)
  const shiftX = (isStep0 ? 2.5 : -2.5) * Math.sin(t * Math.PI) * (facing === "forward" ? 1.4 : 0.8);

  // Stance Foot: firmly planted at y=570, linear constant-velocity sweep backward
  const stanceFoot = (defX: number, isLeft: boolean) => {
    const sweep = dirMultiplier * ((stride) - (2 * stride) * t);
    const x = defX + sweep;
    const y = 570;

    let angle = 0;
    if (t < 0.2) {
      // Heel strike to flat foot roll
      angle = -14 * (1 - t / 0.2) * dirMultiplier;
    } else if (t > 0.7) {
      // Heel lifts up pushing off toe
      angle = 22 * ((t - 0.7) / 0.3) * dirMultiplier;
    }
    return {pos: [x, y] as Vec, angle};
  };

  // Swing Foot: parabolic clearance arc with knee lift
  const swingFoot = (defX: number, isLeft: boolean) => {
    const sweep = dirMultiplier * ((-stride) + (2 * stride) * (0.5 - 0.5 * Math.cos(t * Math.PI)));
    const x = defX + sweep;
    const arc = Math.sin(t * Math.PI);
    const y = 570 - stepHeight * arc;

    let angle = 0;
    if (t < 0.3) {
      // Toe points down as it leaves floor
      angle = (22 * (1 - t / 0.3) + 5 * (t / 0.3)) * dirMultiplier;
    } else if (t < 0.7) {
      // Foot levels out during passing
      const p = (t - 0.3) / 0.4;
      angle = (5 * (1 - p) - 5 * p) * dirMultiplier;
    } else {
      // Ankle flexes up so heel touches down first
      const p = (t - 0.7) / 0.3;
      angle = (-5 * (1 - p) - 14 * p) * dirMultiplier;
    }
    return {pos: [x, y] as Vec, angle};
  };

  const lData = isStep0 ? swingFoot(120, true) : stanceFoot(120, true);
  const rData = isStep0 ? stanceFoot(180, false) : swingFoot(180, false);

  // In front/3/4 puppet projection, knees bend forward/outward toward the viewer
  // Left knee flexes outward (true), Right knee flexes outward (false), maintaining anatomical leg separation
  const lKneeBend = true;
  const rKneeBend = false;

  // 4. Arms Counter-Swing:
  // Opposition: Left leg forward -> Right arm forward; Right leg forward -> Left arm forward
  const armPhase = Math.sin(cycle * Math.PI * 2) * dirMultiplier;
  const rHand: Vec = [228 + armPhase * armAmp, 318 - armPhase * 20];
  const lHand: Vec = [72 - armPhase * armAmp, 318 + armPhase * 20];
  const rElbow: Vec = [224 + armPhase * (armAmp * 0.45), 255 - armPhase * 10];
  const lElbow: Vec = [76 - armPhase * (armAmp * 0.45), 255 + armPhase * 10];

  return {
    lFoot: lData.pos,
    rFoot: rData.pos,
    lFootAngle: lData.angle,
    rFootAngle: rData.angle,
    hipDrop,
    torsoPitch,
    shiftX,
    lHand,
    rHand,
    lElbow,
    rElbow,
    lKneeBend,
    rKneeBend,
  };
}

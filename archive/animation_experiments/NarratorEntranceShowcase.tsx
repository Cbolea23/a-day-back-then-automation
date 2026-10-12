import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {CharacterTheme, Narrator} from "./Narrator";
import {EntranceKind, NarratorEntranceWrapper} from "./NarratorEntrance";

interface EntranceMeta {
  kind: EntranceKind;
  title: string;
  theme: CharacterTheme;
  badge: string;
  description: string;
  physicsNotes: string[];
  bgGradient: string;
  whooshFrame: number;
  impactFrame: number;
}

const ENTRANCES: EntranceMeta[] = [
  {
    kind: "sky-fall",
    title: "Sky-Fall Impact",
    theme: "roman",
    badge: "SKELETAL JOINTS: PARKOUR SQUAT",
    description: "Narrator plunges from the sky into a deep superhero impact squat (bent knees, hip drop, floor hand plant) before uncoiling.",
    physicsNotes: [
      "-950px Sky Plunge with Trailing Knees",
      "Impact Squat: Hip Drop +72px, Torso Pitch 20°",
      "Wide Flared Knees (75px/225px) & Planted Feet",
      "Left Hand Floor Contact & Ground Dust Explosion",
      "Fluid Uncoil into Confident Upright Stand",
    ],
    bgGradient: "radial-gradient(ellipse at 50% 30%, #312e81 0%, #0f172a 100%)",
    whooshFrame: 0,
    impactFrame: 15,
  },
  {
    kind: "door-burst",
    title: "Door-Burst Threshold",
    theme: "knight",
    badge: "SKELETAL JOINTS: ARTICULATED WALK",
    description: "Narrator kicks through medieval double doors and walks through the threshold with a full multi-joint leg stride cycle.",
    physicsNotes: [
      "3D Wooden Arch Doors Swing Open (-85°)",
      "4-Phase Leg Walk Cycle (Knee Lift & Foot Extension)",
      "Torso Bob & Counter-Arm Swing Coordination",
      "Deceleration from Stride into Snappy Salute",
    ],
    bgGradient: "radial-gradient(ellipse at 50% 30%, #78350f 0%, #1c1917 100%)",
    whooshFrame: 2,
    impactFrame: 18,
  },
  {
    kind: "wake-up",
    title: "Wake-Up From Bed",
    theme: "victorian",
    badge: "SKELETAL JOINTS: BED SIT-UP & EXIT",
    description: "Narrator lies sleeping in an era bed under a quilt, sits up at the hips, rubs their eyes, swings legs out, and stands up.",
    physicsNotes: [
      "Era Wooden Bed, Pillow & Animated Folding Quilt",
      "Supine Sleep Pose (Floating Zzz Particles)",
      "Torso Core Sit-Up at Hips (torsoPitch -45° to 0°)",
      "Sleepy Eye-Rubbing Gesture & Leg Swing over Bed Rail",
      "Standing Push-Up to Full Morning Stretch",
    ],
    bgGradient: "radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, #09090b 100%)",
    whooshFrame: 10,
    impactFrame: 12,
  },
  {
    kind: "peek-crawl",
    title: "Peek & Screen Tap",
    theme: "asian",
    badge: "SKELETAL JOINTS: BEZEL CLIMB",
    description: "Narrator grips the bottom bezel of the phone screen, pulls their body up with articulated knees, and taps the lens.",
    physicsNotes: [
      "Bottom Bezel Grip with Dual Hand Anchors",
      "Hip Lift & High Knee Climb Onto Stage",
      "Curious Forward Head Lean & Camera Inspection",
      "Finger Tap with Expanding Lens Shockwave",
      "Smooth Rise to Full Presentation Stance",
    ],
    bgGradient: "radial-gradient(ellipse at 50% 30%, #064e3b 0%, #022c22 100%)",
    whooshFrame: 0,
    impactFrame: 42,
  },
  {
    kind: "skid-in",
    title: "High-Speed Skid-In",
    theme: "wwii",
    badge: "SKELETAL JOINTS: SPRINT & HEEL BRAKE",
    description: "Narrator charges in with a high-knee sprint cycle, digs heels in with a -26° friction brake lean, and pops up grinning.",
    physicsNotes: [
      "Articulated High-Knee Sprint Cycle",
      "Friction Brake: Torso Pitch -26°, Extended Shin",
      "Planted Heel Slide with Expanding Smoke Clouds",
      "Ground Friction Deceleration to Center",
      "Snappy Rebound to Confident Greeting Wave",
    ],
    bgGradient: "radial-gradient(ellipse at 50% 30%, #3b0764 0%, #09090b 100%)",
    whooshFrame: 0,
    impactFrame: 12,
  },
];

const ENTRANCE_CLIP_FRAMES = 60; // 2.0s per entrance

// ---------------------------------------------------------------------------
// Single Vertical Entrance Stage (1080x1920)
// ---------------------------------------------------------------------------
const SingleEntranceStage: React.FC<{
  meta: EntranceMeta;
  frameInClip: number;
  clipIndex: number;
}> = ({meta, frameInClip, clipIndex}) => {
  const {fps} = useVideoConfig();

  // Header card fade and slide
  const headerSlide = interpolate(frameInClip, [0, 10], [-40, 0], {
    extrapolateRight: "clamp",
  });
  const headerOpacity = interpolate(frameInClip, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: meta.bgGradient,
        overflow: "hidden",
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* SFX Triggers */}
      {frameInClip === meta.whooshFrame && (
        <Audio src={staticFile("audio/sfx/whoosh.wav")} volume={0.65} />
      )}
      {frameInClip === meta.impactFrame && (
        <Audio src={staticFile("audio/sfx/pop.wav")} volume={0.8} />
      )}

      {/* Background Ambience Lines */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.12,
        }}
      >
        <pattern id={`grid-${meta.kind}`} width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#grid-${meta.kind})`} />
      </svg>

      {/* TOP HUD: Title & Specs */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 45,
          right: 45,
          transform: `translateY(${headerSlide}px)`,
          opacity: headerOpacity,
          zIndex: 50,
        }}
      >
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div
            style={{
              padding: "6px 18px",
              borderRadius: 20,
              backgroundColor: "rgba(255, 217, 59, 0.95)",
              color: "#111",
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            {clipIndex + 1} / {ENTRANCES.length} • {meta.badge}
          </div>
          <div
            style={{
              padding: "6px 18px",
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            THEME: {meta.theme.toUpperCase()}
          </div>
        </div>

        <h1
          style={{
            margin: "18px 0 6px",
            color: "#ffffff",
            fontSize: 58,
            fontWeight: 900,
            letterSpacing: "-1px",
            lineHeight: 1.1,
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          {meta.title}
        </h1>
        <p
          style={{
            margin: 0,
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: 26,
            fontWeight: 500,
            lineHeight: 1.3,
            maxWidth: 900,
          }}
        >
          {meta.description}
        </p>

        {/* Feature Pill Tags */}
        <div
          style={{
            marginTop: 22,
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {meta.physicsNotes.map((note, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: 14,
                color: "#fef08a",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              ✓ {note}
            </div>
          ))}
        </div>
      </div>

      {/* STAGE FLOOR CONTACT */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* CHARACTER STAGE WITH ENTRANCE PHYSICS */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: "50%",
          transform: "translateX(-50%)",
          filter: "drop-shadow(0 20px 35px rgba(0,0,0,0.75))",
          zIndex: 20,
        }}
      >
        {/* Contact floor shadow */}
        <div
          style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 360,
            height: 52,
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        <NarratorEntranceWrapper
          kind={meta.kind}
          frame={frameInClip}
          fps={fps}
          theme={meta.theme}
        >
          {({overrideExpression, overrideGesture, isTalking, poseOverride}) => (
            <Narrator
              height={780}
              theme={meta.theme}
              gesture={overrideGesture ?? (frameInClip > 36 ? "wave" : "idle")}
              expression={overrideExpression ?? (frameInClip > 36 ? "happy" : "neutral")}
              talking={isTalking && frameInClip > 28}
              mouthOpen={isTalking && frameInClip > 28 ? 0.6 + 0.3 * Math.sin(frameInClip * 0.8) : 0}
              vowel={frameInClip % 6 < 3 ? "A" : "O"}
              poseOverride={poseOverride}
            />
          )}
        </NarratorEntranceWrapper>
      </div>

      {/* BOTTOM TIMELINE INDICATOR */}
      <div
        style={{
          position: "absolute",
          bottom: 45,
          left: 50,
          right: 50,
          display: "flex",
          alignItems: "center",
          gap: 16,
          zIndex: 50,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 10,
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(frameInClip / ENTRANCE_CLIP_FRAMES) * 100}%`,
              backgroundColor: "#ffd93b",
            }}
          />
        </div>
        <div
          style={{
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 22,
            minWidth: 70,
            textAlign: "right",
          }}
        >
          {Math.floor(frameInClip / 30)}s / 2s
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Sequential Vertical Video (1080x1920, 300 Frames = 10s)
// ---------------------------------------------------------------------------
export const NarratorEntranceShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      {ENTRANCES.map((meta, index) => {
        return (
          <Sequence
            key={meta.kind}
            from={index * ENTRANCE_CLIP_FRAMES}
            durationInFrames={ENTRANCE_CLIP_FRAMES}
          >
            <StageClip meta={meta} clipIndex={index} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const StageClip: React.FC<{meta: EntranceMeta; clipIndex: number}> = ({
  meta,
  clipIndex,
}) => {
  const frame = useCurrentFrame();
  return (
    <SingleEntranceStage
      meta={meta}
      frameInClip={frame}
      clipIndex={clipIndex}
    />
  );
};

// ---------------------------------------------------------------------------
// 5-Column Side-By-Side Grid Video (1920x1080, 120 Frames)
// ---------------------------------------------------------------------------
export const NarratorEntranceGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Looping 60 frames per cycle
  const loopFrame = frame % 60;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#09090b",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "24px 30px",
      }}
    >
      {/* Title Header */}
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16}}>
        <div>
          <h1 style={{margin: 0, fontSize: 32, fontWeight: 900, letterSpacing: "-0.5px", color: "#fef08a"}}>
            NARRATOR ENTRANCE SUITE — 5 DYNAMIC CINEMATIC OPENERS
          </h1>
          <p style={{margin: "4px 0 0", fontSize: 16, color: "rgba(255,255,255,0.7)"}}>
            Physics-driven squash/stretch, secondary motion, ground dust particles, and living props for Scene 0
          </p>
        </div>
        <div
          style={{
            padding: "8px 20px",
            borderRadius: 20,
            backgroundColor: "#2563eb",
            color: "#fff",
            fontWeight: 800,
            fontSize: 18,
          }}
        >
          FRAME {loopFrame} / 60 (LOOPING)
        </div>
      </div>

      {/* 5 Side-By-Side Columns */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 14,
        }}
      >
        {ENTRANCES.map((meta) => {
          return (
            <div
              key={meta.kind}
              style={{
                position: "relative",
                borderRadius: 16,
                background: meta.bgGradient,
                border: "2px solid rgba(255,255,255,0.15)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  padding: "12px 14px 8px",
                  background: "rgba(0,0,0,0.45)",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  zIndex: 30,
                }}
              >
                <div style={{fontSize: 12, fontWeight: 800, color: "#ffd93b", textTransform: "uppercase"}}>
                  {meta.badge}
                </div>
                <div style={{fontSize: 18, fontWeight: 800, color: "#ffffff", marginTop: 2}}>
                  {meta.title}
                </div>
              </div>

              {/* Character Stage */}
              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: "50%",
                  transform: "translateX(-50%)",
                  filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.65))",
                  zIndex: 20,
                }}
              >
                {/* Contact shadow */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 190,
                    height: 28,
                    background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)",
                  }}
                />

                <NarratorEntranceWrapper
                  kind={meta.kind}
                  frame={loopFrame}
                  fps={fps}
                  theme={meta.theme}
                >
                  {({overrideExpression, overrideGesture, isTalking, poseOverride}) => (
                    <Narrator
                      height={430}
                      theme={meta.theme}
                      gesture={overrideGesture ?? (loopFrame > 36 ? "wave" : "idle")}
                      expression={overrideExpression ?? (loopFrame > 36 ? "happy" : "neutral")}
                      talking={isTalking && loopFrame > 28}
                      mouthOpen={isTalking && loopFrame > 28 ? 0.6 + 0.3 * Math.sin(loopFrame * 0.8) : 0}
                      vowel={loopFrame % 6 < 3 ? "A" : "O"}
                      poseOverride={poseOverride}
                    />
                  )}
                </NarratorEntranceWrapper>
              </div>

              {/* Bottom Footer Note */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "8px 10px",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  fontSize: 11,
                  color: "#cbd5e1",
                  textAlign: "center",
                  zIndex: 30,
                }}
              >
                {meta.physicsNotes[0]}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

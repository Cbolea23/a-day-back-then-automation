import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Narrator, CharacterTheme} from "./Narrator";

export const NarratorWalkDemo: React.FC<{
  theme?: CharacterTheme;
  showFloorGrid?: boolean;
}> = ({theme = "wwii", showFloorGrid = true}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // 1. Walk Cycle Kinematics Constants:
  const stride = 22; // viewBox half-stride
  const cadence = 24; // frames per 2-step cycle
  const narratorHeight = 650;
  const scale = narratorHeight / 600; // 1.0833
  // Stance foot speed relative to body is (2 * stride * scale) / (cadence / 2)
  const pxPerFrame = (stride * 2 * scale) / (cadence / 2); // 3.972 px/frame

  // Horizontal motion: narrator walks across screen from left to right
  const startX = 200;
  const currentX = startX + (frame % 240) * pxPerFrame;

  // Floor baseline
  const floorHeight = 160;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #f8fafc 0%, #edf2f7 55%, #e2e8f0 100%)",
        overflow: "hidden",
        fontFamily: "Inter, Arial, -apple-system, sans-serif",
      }}
    >
      {/* Title & Stats HUD (Clean, high-contrast studio presentation) */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 10,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 16,
              padding: "5px 16px",
              borderRadius: 6,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 10,
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
            }}
          >
            PROFILE ZERO-SLIP WALK CYCLE
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: -0.5,
            }}
          >
            Articulated Sideview Narrator Gait
          </div>
          <div style={{fontSize: 18, color: "#475569", marginTop: 4, fontWeight: 500}}>
            Profile Anatomy • 2-Bone Analytical IK • Ground Velocity: {pxPerFrame.toFixed(2)}px/f (0px Foot Drift)
          </div>
        </div>

        {/* Phase Indicator Box */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #cbd5e1",
            padding: "16px 24px",
            borderRadius: 12,
            textAlign: "right",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div style={{fontSize: 13, color: "#64748b", fontWeight: 800, letterSpacing: 1}}>CYCLE FRAME</div>
          <div style={{fontSize: 34, fontWeight: 900, color: "#2563eb", lineHeight: 1.1}}>
            {frame % cadence} <span style={{fontSize: 18, color: "#94a3b8"}}>/ {cadence}</span>
          </div>
          <div style={{fontSize: 14, color: "#0f172a", marginTop: 4, fontWeight: 700}}>
            {(() => {
              const f = frame % 12;
              if (f < 2) return "1. CONTACT (Heel Strike)";
              if (f < 5) return "2. DOWN (Weight Cushion)";
              if (f < 8) return "3. PASSING (Knee Lift Arc)";
              if (f < 11) return "4. UP (Toe Push-Off)";
              return "1. CONTACT (Next Step)";
            })()}
          </div>
        </div>
      </div>

      {/* Subtle Studio Backdrop Grid Accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: floorHeight,
          backgroundImage:
            "linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Ground Floor Plane & High-Contrast Ruler Grid */}
      {showFloorGrid && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: floorHeight,
            background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            borderTop: "4px solid #2563eb",
            boxShadow: "0 -4px 20px rgba(15, 23, 42, 0.15)",
          }}
        >
          {/* Ground ruler tick marks every 50px */}
          {Array.from({length: 44}).map((_, i) => {
            const x = i * 50;
            const isMajor = i % 2 === 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: 0,
                  width: 2,
                  height: isMajor ? 22 : 12,
                  background: isMajor ? "#ffffff" : "#64748b",
                }}
              >
                {isMajor && (
                  <span
                    style={{
                      position: "absolute",
                      top: 26,
                      left: -14,
                      fontSize: 12,
                      color: "#94a3b8",
                      fontFamily: "monospace",
                      fontWeight: 600,
                    }}
                  >
                    {x}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Walking Narrator Container with Synchronized Zero-Slip Velocity */}
      <div
        style={{
          position: "absolute",
          left: currentX,
          bottom: floorHeight, // Grounded exactly on the blue floor line
          transform: "translateX(-50%)",
          filter: "drop-shadow(0 16px 24px rgba(15, 23, 42, 0.22))",
          zIndex: 5,
        }}
      >
        {/* Dynamic Contact Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 260,
            height: 32,
            background: "radial-gradient(ellipse at center, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0) 70%)",
          }}
        />

        <Narrator
          height={narratorHeight}
          theme={theme}
          walking={true}
          walkOptions={{
            stride,
            cadence,
            facing: "right",
            stepHeight: 22,
            hipDropAmplitude: 5,
          }}
          talking={true}
        />
      </div>
    </AbsoluteFill>
  );
};

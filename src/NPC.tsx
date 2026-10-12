import React from "react";
import {Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {Narrator, CharacterTheme} from "./Narrator";
import {SpeechPlan} from "./speech";
import {NPCConfig} from "./types";

const POSITION_PRESETS = {
  "left-corner": {left: 460, bottom: 255, height: 410, facing: "right" as const},
  "left-bench": {left: 220, bottom: 110, height: 500, facing: "right" as const},
  left: {left: 120, bottom: 24, height: 580, facing: "right" as const},
  center: {left: 920, bottom: 120, height: 480, facing: "left" as const},
  right: {left: 1400, bottom: 24, height: 580, facing: "left" as const},
};

export const NPC: React.FC<{
  npc: NPCConfig;
  durationInFrames: number;
  plan?: SpeechPlan;
}> = ({
  npc,
  durationInFrames,
  plan,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const preset = npc.position ? POSITION_PRESETS[npc.position] : POSITION_PRESETS["left-corner"];
  const left = npc.x ?? preset.left;
  const bottom = npc.y ?? preset.bottom;
  const height = npc.height ?? preset.height;
  const facing = npc.facing ?? preset.facing;

  // Animated sweat drop for nervous expression
  const sweatY = Math.sin(frame * 0.2) * 4;

  // Subtle breathing idle movement
  const breathe = Math.sin(frame * 0.08) * 3;

  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom: bottom + breathe,
        zIndex: 10,
        filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.6))",
      }}
    >
      {/* Speech bubble if NPC talks or reacts */}
      {npc.speechBubble && (
        <div
          style={{
            position: "absolute",
            top: -45,
            left: "50%",
            transform: `translateX(-50%) translateY(${Math.sin(frame * 0.1) * 2}px)`,
            background: "#ffffff",
            border: "4px solid #1c1917",
            borderRadius: 16,
            padding: "8px 18px",
            fontSize: 22,
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
            color: "#1c1917",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
            zIndex: 20,
          }}
        >
          {npc.speechBubble}
          {/* Comic speech bubble tail */}
          <div
            style={{
              position: "absolute",
              bottom: -10,
              left: facing === "right" ? "30%" : "70%",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "10px solid #1c1917",
            }}
          />
        </div>
      )}

      {/* Nervous sweat drop comic detail */}
      {npc.expression === "nervous" && (
        <div
          style={{
            position: "absolute",
            top: 25,
            left: facing === "right" ? 50 : 220,
            opacity: 1,
            transform: `translateY(${sweatY}px)`,
            fontSize: 32,
            zIndex: 15,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        >
          💧
        </div>
      )}

      {/* The Character Body (flipped horizontally if facing right) */}
      <div
        style={{
          transform: facing === "right" ? "scaleX(-1)" : "none",
          transformOrigin: "center center",
        }}
      >
        <Narrator
          archetype={npc.archetype}
          theme={(npc.theme as CharacterTheme) ?? "roman"}
          height={height}
          tunic={npc.tunic ?? "#e0ceaa"}
          gesture={npc.gesture ?? (npc.talking || npc.audio ? "explain" : "think")}
          reaction={npc.reaction ?? "look-up"}
          talking={npc.talking ?? !!npc.audio}
          audioSrc={npc.audio}
          plan={plan}
        />
      </div>

      {npc.audio ? <Audio src={staticFile(npc.audio)} /> : null}
    </div>
  );
};

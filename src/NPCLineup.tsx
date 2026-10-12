import React from "react";
import {AbsoluteFill} from "remotion";
import {Narrator} from "./Narrator";
import {NPCArchetype} from "./types";

const ARCHETYPES: Array<{
  id: NPCArchetype;
  name: string;
  role: string;
  description: string;
  tagColor: string;
}> = [
  {
    id: "citizen",
    name: "The Grumpy Citizen",
    role: "Roommate / Neighbor / Peasant",
    description: "Messy receding hair, 5 o'clock shadow, tired eye bags, patched rough tunic.",
    tagColor: "#f59e0b",
  },
  {
    id: "doctor",
    name: "The Eccentric Doctor",
    role: "Barber-Surgeon / Scholar / Embalmer",
    description: "Wire-rim round glasses, wild gray hair, pointed goatee, apothecary vials belt.",
    tagColor: "#10b981",
  },
  {
    id: "worker",
    name: "The Laborer Apprentice",
    role: "Stonemason / Blacksmith / Farmer",
    description: "Red tied headband wrap, soot cheek smudges, heavy blacksmith apron.",
    tagColor: "#ef4444",
  },
  {
    id: "guard",
    name: "The Stern Veteran",
    role: "Centurion / Spartan Drill Sergeant",
    description: "Bronze crested helmet, cheek guards, battle scar, muscle cuirass & cape.",
    tagColor: "#dc2626",
  },
  {
    id: "merchant",
    name: "The Sly Merchant",
    role: "Forum Peddler / Wine Vendor / Barkeep",
    description: "Curled handlebar mustache, jeweled turban, embroidered vest, gold coin purse.",
    tagColor: "#0284c7",
  },
];

export const NPCLineup: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f172a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 50px",
      }}
    >
      <h1
        style={{
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          fontSize: "44px",
          fontWeight: 900,
          letterSpacing: "3px",
          textTransform: "uppercase",
          marginBottom: "10px",
          textShadow: "0 6px 18px rgba(0,0,0,0.7)",
        }}
      >
        5 Unique Cameo NPC Archetypes
      </h1>
      <p
        style={{
          color: "#94a3b8",
          fontFamily: "Arial, sans-serif",
          fontSize: "22px",
          marginBottom: "40px",
          letterSpacing: "1px",
        }}
      >
        Distinct personalities, facial features, hair, and outfits for non-repetitive Shortform cameos
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "24px",
          width: "100%",
          maxWidth: "1820px",
        }}
      >
        {ARCHETYPES.map((arch) => (
          <div
            key={arch.id}
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.75)",
              border: `3px solid ${arch.tagColor}55`,
              borderRadius: "24px",
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 12px 28px rgba(0,0,0,0.5)",
              position: "relative",
            }}
          >
            {/* Tag Badge */}
            <div
              style={{
                backgroundColor: arch.tagColor,
                color: "#ffffff",
                padding: "6px 16px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 900,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              {arch.name}
            </div>

            {/* Character Render */}
            <div
              style={{
                height: "440px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Narrator
                archetype={arch.id}
                theme="roman"
                height={460}
                gesture="explain"
                talking={false}
              />
            </div>

            {/* Role & Description */}
            <div
              style={{
                textAlign: "center",
                marginTop: "16px",
                width: "100%",
              }}
            >
              <div
                style={{
                  color: "#e2e8f0",
                  fontSize: "18px",
                  fontWeight: 800,
                  marginBottom: "6px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {arch.role}
              </div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  lineHeight: 1.4,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {arch.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

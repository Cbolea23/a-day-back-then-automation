import React from "react";
import {AbsoluteFill} from "remotion";
import {Narrator, CharacterTheme} from "./Narrator";

export const HISTORICAL_THEMES: CharacterTheme[] = [
  "roman",
  "gladiator",
  "egypt",
  "greek",
  "viking",
  "medieval",
  "knight",
  "plague-doctor",
  "ninja",
  "asian",
  "mesoamerica",
  "pirate",
  "victorian",
  "wwii",
  "ottoman",
];

export const HALLOWEEN_THEMES: CharacterTheme[] = [
  "witch",
  "vampire",
  "werewolf",
  "ghost",
  "krampus",
  "executioner",
  "druid",
  "mummy",
  "gravedigger",
  "nun",
  "demon",
];

export const ALL_THEMES: CharacterTheme[] = [
  ...HISTORICAL_THEMES,
  ...HALLOWEEN_THEMES,
];

/** Dev preview: every narrator costume side by side (historical + Halloween). */
export const NarratorLineup: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#11141d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 30px",
        overflow: "hidden",
      }}
    >
      <div style={{textAlign: "center", marginBottom: "16px"}}>
        <h1
          style={{
            color: "#fff",
            fontFamily: "Arial, sans-serif",
            fontSize: "32px",
            fontWeight: 800,
            letterSpacing: "2px",
            textTransform: "uppercase",
            margin: 0,
            textShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          A Day Back Then — Complete Cast Lineup (26 Character Costumes)
        </h1>
        <p style={{color: "#ff8c00", fontSize: "16px", margin: "6px 0 0", fontFamily: "Arial, sans-serif", fontWeight: 600}}>
          15 Historical Eras + 11 New Halloween Specials by Muse AI
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 1fr)",
          gap: "10px",
          width: "100%",
          maxWidth: "1860px",
          flex: 1,
        }}
      >
        {ALL_THEMES.map((theme) => {
          const isHalloween = HALLOWEEN_THEMES.includes(theme);
          return (
            <div
              key={theme}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: isHalloween ? "rgba(255, 115, 0, 0.08)" : "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                padding: "8px 6px 6px",
                border: isHalloween ? "1px solid rgba(255, 115, 0, 0.35)" : "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{height: "190px", display: "flex", alignItems: "flex-end"}}>
                <Narrator
                  height={180}
                  theme={theme}
                  gesture={isHalloween ? "think" : "explain"}
                  talking={false}
                />
              </div>
              <div
                style={{
                  marginTop: "8px",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  backgroundColor: isHalloween ? "rgba(255, 115, 0, 0.25)" : "rgba(229, 179, 47, 0.2)",
                  border: isHalloween ? "1px solid #ff7300" : "1px solid #e5b32f",
                  color: isHalloween ? "#ffaa55" : "#e5b32f",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {theme}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

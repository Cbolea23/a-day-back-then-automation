import React from "react";
import {AbsoluteFill} from "remotion";
import {Narrator, CharacterTheme} from "./Narrator";

const THEMES: CharacterTheme[] = [
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

export const NarratorLineup: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#161922",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 40px",
      }}
    >
      <h1
        style={{
          color: "#fff",
          fontFamily: "Arial, sans-serif",
          fontSize: "38px",
          fontWeight: 800,
          letterSpacing: "3px",
          textTransform: "uppercase",
          marginBottom: "24px",
          textShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        A Day Back Then — Complete Narrator Cast Lineup (15 Eras)
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "12px 18px",
          width: "100%",
          maxWidth: "1800px",
        }}
      >
        {THEMES.map((theme) => (
          <div
            key={theme}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "14px",
              padding: "10px 8px 8px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{height: "235px", display: "flex", alignItems: "flex-end"}}>
              <Narrator height={220} theme={theme} />
            </div>
            <div
              style={{
                marginTop: "10px",
                padding: "4px 14px",
                borderRadius: "16px",
                backgroundColor: "rgba(229, 179, 47, 0.2)",
                border: "1px solid #e5b32f",
                color: "#e5b32f",
                fontFamily: "Arial, sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {theme}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

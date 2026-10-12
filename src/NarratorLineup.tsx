import React from "react";
import {AbsoluteFill} from "remotion";
import {Narrator, CharacterTheme} from "./Narrator";

const THEMES: CharacterTheme[] = [
  "roman",
  "egypt",
  "viking",
  "medieval",
  "knight",
  "plague-doctor",
  "greek",
  "gladiator",
  "ninja",
  "asian",
  "mesoamerica",
  "pirate",
  "victorian",
  "wwii",
  "ottoman",
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

/** Dev preview: every narrator costume side by side. */
export const NarratorLineup: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#1a1a2e"}}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          height: "100%",
          padding: 40,
          gap: 20,
        }}
      >
        {THEMES.map((theme) => (
          <div key={theme} style={{textAlign: "center"}}>
            <div style={{height: 780}}>
              <Narrator theme={theme} gesture="wave" talking={false} height={780} />
            </div>
            <div style={{color: "#fff", fontSize: 36, fontFamily: "sans-serif"}}>
              {theme}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

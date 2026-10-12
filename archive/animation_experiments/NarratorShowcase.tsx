import React from "react";
import {AbsoluteFill} from "remotion";
import {Narrator} from "./Narrator";
import {Expression, VisemeVowel} from "./speech";

const ALL_EXPRESSIONS: Array<{
  expression: Expression;
  label: string;
  detail: string;
  gesture?: "explain" | "point" | "think" | "shrug" | "wave" | "idle";
}> = [
  {expression: "neutral", label: "Neutral", detail: "Calm host baseline", gesture: "idle"},
  {expression: "happy", label: "Happy", detail: "Warm welcoming smile", gesture: "wave"},
  {expression: "question", label: "Question", detail: "Inquiring raised brow", gesture: "explain"},
  {expression: "emphasis", label: "Emphasis", detail: "Conviction & fist pump", gesture: "explain"},
  {expression: "thoughtful", label: "Thoughtful", detail: "Hand on chin pondering", gesture: "think"},
  {expression: "surprise", label: "Surprise", detail: "Gasp & wide eye aperture", gesture: "shrug"},
  {expression: "sad", label: "Solemn", detail: "Melancholy tragedy drop", gesture: "idle"},
  {expression: "spooked", label: "Spooked", detail: "Asymmetric eerie dread", gesture: "think"},
  {expression: "smug", label: "Smug", detail: "Cocky tilt & dimpled smirk", gesture: "explain"},
  {expression: "disgusted", label: "Disgusted", detail: "Recoil & nose wrinkle", gesture: "shrug"},
  {expression: "furious", label: "Furious", detail: "Forward thrust & clenched teeth", gesture: "explain"},
  {expression: "scared", label: "Scared", detail: "Terror jitter & darting eyes", gesture: "point"},
  {expression: "proud", label: "Proud", detail: "Noble high chin & broad grin", gesture: "explain"},
  {expression: "conspiratorial", label: "Secretive", detail: "Whisper lean & side glance", gesture: "think"},
];

const VOWEL_LAB: Array<{
  vowel: VisemeVowel;
  phoneme: string;
  example: string;
  description: string;
}> = [
  {vowel: "A", phoneme: "/ɑː/ Ah", example: "Gladiator, Cat, Far", description: "Drop jaw, top teeth & tongue bed"},
  {vowel: "E", phoneme: "/eɪ/ Eh", example: "Egypt, Day, Great", description: "Wide stretch, dual teeth rows"},
  {vowel: "I", phoneme: "/iː/ Ee", example: "Siege, Shield, Keen", description: "Slender smile, prominent incisors"},
  {vowel: "O", phoneme: "/oʊ/ Oh", example: "Rome, Gold, Cold", description: "Friendly round oval & tongue arc"},
  {vowel: "U", phoneme: "/uː/ Oo", example: "Ruler, Moon, True", description: "Cute compact pill pucker & lip line"},
  {vowel: "closed", phoneme: "/m,b,p/", example: "Battle, March, Peace", description: "Closed consonant lip seal"},
];

export const NarratorShowcase: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1017",
        display: "flex",
        flexDirection: "column",
        padding: "20px 30px",
        fontFamily: "Arial, sans-serif",
        color: "#fff",
      }}
    >
      {/* HEADER */}
      <div style={{textAlign: "center", marginBottom: "14px"}}>
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#ffffff",
          }}
        >
          Narrator Acting Engine — Expression & Viseme Showcase
        </h1>
        <p style={{margin: "4px 0 0", color: "#e5b32f", fontSize: "14px", fontWeight: 600}}>
          14 Dynamic Emotional States + Smart AEIOU Syllable Lip-Sync System
        </p>
      </div>

      {/* SECTION 1: 14 EXPRESSIONS */}
      <div style={{marginBottom: "16px"}}>
        <div style={{display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px"}}>
          <div style={{width: "4px", height: "16px", backgroundColor: "#ff8c00", borderRadius: "2px"}} />
          <h2 style={{margin: 0, fontSize: "15px", textTransform: "uppercase", letterSpacing: "1px", color: "#ffaa55"}}>
            Full Emotional Repertoire & Body Postures (14 States)
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px",
          }}
        >
          {ALL_EXPRESSIONS.map((item) => (
            <div
              key={item.expression}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "8px 6px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  height: "140px",
                  width: "120px",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: "8px",
                  backgroundColor: "rgba(0,0,0,0.25)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-15px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <Narrator
                    height={380}
                    theme="roman"
                    gesture={item.gesture}
                    expression={item.expression}
                    talking={false}
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#ffd56b",
                  letterSpacing: "0.5px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "9.5px",
                  color: "#94a3b8",
                  textAlign: "center",
                  marginTop: "2px",
                  lineHeight: 1.2,
                }}
              >
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: AEIOU VOWEL LAB */}
      <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
        <div style={{display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px"}}>
          <div style={{width: "4px", height: "16px", backgroundColor: "#38bdf8", borderRadius: "2px"}} />
          <h2 style={{margin: 0, fontSize: "15px", textTransform: "uppercase", letterSpacing: "1px", color: "#38bdf8"}}>
            AEIOU Phoneme & Viseme Mouth Lab (Precision Lip Sync)
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "10px",
            flex: 1,
          }}
        >
          {VOWEL_LAB.map((item) => (
            <div
              key={item.vowel}
              style={{
                backgroundColor: "rgba(56, 189, 248, 0.06)",
                borderRadius: "10px",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                padding: "10px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#38bdf8",
                    color: "#0f172a",
                    fontWeight: 900,
                    fontSize: "13px",
                    borderRadius: "4px",
                    padding: "2px 6px",
                  }}
                >
                  {item.vowel}
                </span>
                <span style={{fontSize: "12px", fontWeight: 700, color: "#e2e8f0"}}>
                  {item.phoneme}
                </span>
              </div>

              {/* Close-up face view to highlight mouth viseme shape */}
              <div
                style={{
                  width: "190px",
                  height: "175px",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: "10px",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  margin: "6px 0",
                  border: "1px solid rgba(56, 189, 248, 0.35)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <Narrator
                    height={590}
                    theme="roman"
                    gesture="idle"
                    expression="neutral"
                    vowel={item.vowel}
                    mouthOpen={item.vowel === "closed" ? 0 : 0.9}
                    talking={item.vowel !== "closed"}
                  />
                </div>
              </div>

              <div style={{textAlign: "center", width: "100%"}}>
                <div style={{fontSize: "11px", color: "#38bdf8", fontWeight: 700, marginBottom: "2px"}}>
                  Ex: {item.example}
                </div>
                <div style={{fontSize: "9.5px", color: "#cbd5e1", lineHeight: 1.2}}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

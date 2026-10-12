import React, {useMemo} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {activeWordIndex, splitWords, wordStartFrames} from "./speech";

type Props = {
  text: string;
  durationInFrames: number;
  /** Words shown on screen at once. */
  chunkSize?: number;
  /** Font size in px (Shorts default 92; long-form uses ~64). */
  fontSize?: number;
  /** Uppercase text (default true). */
  uppercase?: boolean;
  /** Horizontal padding of the caption block in px. */
  paddingX?: number;
  /** Active word highlight color (default #ffd93b). */
  highlightColor?: string;
  /** Optional active speaker label (e.g. "VOLUNTEER" or "CITIZEN"). */
  speakerName?: string;
  /** Active speaker type */
  speaker?: "narrator" | "npc";
};

// Emotional keyword palettes for human-edited creator typography
const RED_WORDS = new Set([
  "blood", "bloody", "bleed", "kill", "killed", "killing", "murder", "murdered",
  "poison", "poisoned", "death", "dead", "die", "died", "corpse", "corpses",
  "rancid", "guts", "sawed", "saw", "behead", "beheaded", "cut", "slice",
  "illegal", "banned", "crime", "criminal", "stole", "stealing", "executed",
  "execution", "agony", "pain", "brutal", "danger", "deadly", "disaster", "hell",
  "terrible", "horrible", "torture", "punish", "punishment", "drown", "drowned"
]);

const GOLD_WORDS = new Set([
  "gold", "golden", "emperor", "king", "queen", "pharaoh", "royalty", "royal",
  "rich", "wealth", "wealthy", "palace", "treasure", "expensive", "coin", "coins",
  "denarius", "silver", "cash", "million", "god", "gods", "luxury", "crown"
]);

const GREEN_WORDS = new Set([
  "smell", "smells", "smelly", "stench", "stink", "stinks", "slime", "slimy",
  "ferment", "ferments", "fermenting", "rot", "rotten", "rotting", "beer",
  "cacao", "chocolate", "swamp", "mold", "mould", "fungus", "germs"
]);

const CYAN_WORDS = new Set([
  "freeze", "freezing", "frozen", "ice", "icy", "cold", "winter", "ocean", "sea",
  "water", "river", "night", "blackout", "dark", "pitchblack", "shadow", "ghost",
  "stone", "pyramid", "pyramids"
]);

const AMBER_WORDS = new Set([
  "never", "always", "wrong", "myth", "myths", "truth", "lie", "lies", "secret",
  "secrets", "insane", "crazy", "shocking", "impossible", "actually", "first",
  "rule", "rules", "law", "laws"
]);

function getWordStyle(rawWord: string, defaultColor: string) {
  const clean = rawWord.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (RED_WORDS.has(clean)) {
    return {color: "#ff3b30", tilt: -2.5, isPunch: true};
  }
  if (GOLD_WORDS.has(clean)) {
    return {color: "#ffd700", tilt: 2.0, isPunch: true};
  }
  if (GREEN_WORDS.has(clean)) {
    return {color: "#30d158", tilt: -1.8, isPunch: true};
  }
  if (CYAN_WORDS.has(clean)) {
    return {color: "#00f0ff", tilt: 1.5, isPunch: true};
  }
  if (AMBER_WORDS.has(clean)) {
    return {color: "#ff9500", tilt: -2.0, isPunch: true};
  }

  return {color: defaultColor, tilt: 0, isPunch: false};
}

/**
 * High-energy, human-edited creator captions:
 * - Dynamic spring pop on active words
 * - Emotional context keyword color accents (Red for danger/guts, Gold for emperors/coins, etc.)
 * - Subtle organic angle tilts on punch words
 * - Multi-layer stroke & shadow for crystal-clear readability
 * - Speaker badge when NPCs speak
 */
export const Captions: React.FC<Props> = ({
  text,
  durationInFrames,
  chunkSize = 4,
  fontSize = 92,
  uppercase = true,
  paddingX = 60,
  highlightColor = "#ffe600",
  speakerName,
  speaker = "narrator",
}) => {
  const frame = useCurrentFrame();
  const words = useMemo(() => splitWords(text), [text]);

  const {starts, chunks} = useMemo(() => {
    const startFrames = wordStartFrames(words, durationInFrames);

    // Break chunks at sentence ends or every `chunkSize` words.
    const result: number[][] = [];
    let current: number[] = [];
    words.forEach((word, i) => {
      current.push(i);
      const endsSentence = /[.!?]$/.test(word);
      if (current.length >= chunkSize || endsSentence) {
        result.push(current);
        current = [];
      }
    });
    if (current.length) {
      result.push(current);
    }
    return {starts: startFrames, chunks: result};
  }, [words, durationInFrames, chunkSize]);

  const activeWord = activeWordIndex(starts, frame);
  const chunk = chunks.find((c) => c.includes(activeWord)) ?? chunks[0] ?? [];
  const chunkStart = starts[chunk[0]] ?? 0;

  // Snappy chunk enter transition
  const chunkEnter = interpolate(frame - chunkStart, [0, 4], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stroke = Math.max(4, Math.round(fontSize * 0.11));

  const isNpc = speaker === "npc";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${paddingX}px`,
        transform: `scale(${chunkEnter})`,
        textAlign: "center",
      }}
    >
      {/* Speaker badge for NPC cameos */}
      {speakerName ? (
        <div
          style={{
            display: "inline-block",
            marginBottom: 12,
            padding: "6px 22px",
            borderRadius: 999,
            background: isNpc ? "rgba(0, 220, 255, 0.22)" : "rgba(255, 215, 0, 0.22)",
            border: `3px solid ${isNpc ? "#00f0ff" : "#ffd700"}`,
            color: "#ffffff",
            fontFamily: "Arial, sans-serif",
            fontSize: Math.round(fontSize * 0.38),
            fontWeight: 900,
            letterSpacing: 2,
            textTransform: "uppercase",
            boxShadow: "0 6px 16px rgba(0,0,0,0.6)",
          }}
        >
          {isNpc ? "💬 " : "🎙️ "}
          {speakerName}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: `6px ${Math.round(fontSize * 0.22)}px`,
          fontFamily: "Impact, 'Arial Black', Arial, sans-serif",
          fontSize,
          lineHeight: 1.1,
          textTransform: uppercase ? "uppercase" : "none",
        }}
      >
        {chunk.map((i) => {
          const isActive = i === activeWord;
          const wordStyle = getWordStyle(words[i], highlightColor);

          // Word-by-word spring scale pop
          const framesSinceSpoken = Math.max(0, frame - (starts[i] ?? 0));
          const wordPop = isActive
            ? interpolate(framesSinceSpoken, [0, 2, 5], [1.0, 1.2, 1.06], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1.0;

          const tilt = isActive ? wordStyle.tilt : 0;

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: isActive ? wordStyle.color : "#ffffff",
                transform: `scale(${wordPop}) rotate(${tilt}deg)`,
                transformOrigin: "center center",
                WebkitTextStroke: `${stroke}px #000`,
                paintOrder: "stroke fill",
                textShadow: isActive
                  ? `0 6px 14px rgba(0,0,0,0.8), 0 0 18px ${wordStyle.color}66`
                  : "0 6px 0 rgba(0,0,0,0.65)",
                transition: "transform 0.05s ease-out",
              }}
            >
              {words[i]}
            </span>
          );
        })}
      </div>
    </div>
  );
};

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
};

/**
 * Word-by-word captions. Timing is spread over the scene in proportion to word
 * length, which is close enough when the voiceover is also paced by the scene.
 * If you later get real word timestamps, replace `starts` with them.
 */
export const Captions: React.FC<Props> = ({
  text,
  durationInFrames,
  chunkSize = 4,
  fontSize = 92,
  uppercase = true,
  paddingX = 60,
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
  const pop = interpolate(frame - chunkStart, [0, 5], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stroke = Math.max(4, Math.round(fontSize * 0.11));

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: `6px ${Math.round(fontSize * 0.24)}px`,
        padding: `0 ${paddingX}px`,
        transform: `scale(${pop})`,
        fontFamily: "Impact, 'Arial Black', Arial, sans-serif",
        fontSize,
        lineHeight: 1.1,
        textTransform: uppercase ? "uppercase" : "none",
        textAlign: "center",
      }}
    >
      {chunk.map((i) => (
        <span
          key={i}
          style={{
            color: i === activeWord ? "#ffd93b" : "#ffffff",
            WebkitTextStroke: `${stroke}px #000`,
            paintOrder: "stroke fill",
            textShadow: "0 6px 0 rgba(0,0,0,0.55)",
          }}
        >
          {words[i]}
        </span>
      ))}
    </div>
  );
};

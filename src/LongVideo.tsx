import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Captions} from "./Captions";
import {Narrator, getThemeFromSlug, CharacterTheme} from "./Narrator";
import {Mood, Scene, ScriptProps, sceneFrames, totalFrames} from "./types";

const MOOD_GRADIENTS: Record<Mood, string> = {
  day: "linear-gradient(180deg, #f6d28b 0%, #e59a5b 55%, #8a4b2a 100%)",
  warm: "linear-gradient(180deg, #f3b46b 0%, #c8693a 55%, #5b2b1c 100%)",
  night: "linear-gradient(180deg, #1c2540 0%, #2e3a5c 50%, #6b4a3a 100%)",
  dark: "linear-gradient(180deg, #0f0f14 0%, #2a2330 55%, #4a2f2f 100%)",
  cool: "linear-gradient(180deg, #9fc3d6 0%, #6a93a8 55%, #2f4a5a 100%)",
};

const ORIGINS = ["50% 50%", "30% 60%", "70% 40%"];
const CHAPTER_CARD_FRAMES = 90;

/**
 * Slow pan/zoom. The direction alternates per scene so that reusing one image
 * across several scenes still feels like movement. No fade when the image is the
 * same as the previous scene's, so it never blinks.
 */
const Background: React.FC<{
  scene: Scene;
  index: number;
  durationInFrames: number;
  sameAsPrev: boolean;
}> = ({scene, index, durationInFrames, sameAsPrev}) => {
  const frame = useCurrentFrame();
  const zoomIn = index % 2 === 0;
  const zoom = interpolate(
    frame,
    [0, durationInFrames],
    zoomIn ? [1.04, 1.16] : [1.16, 1.04],
    {extrapolateRight: "clamp"},
  );
  const fade = sameAsPrev
    ? 1
    : interpolate(frame, [0, 8], [0, 1], {extrapolateRight: "clamp"});
  const transformOrigin = ORIGINS[index % ORIGINS.length];

  return (
    <AbsoluteFill style={{opacity: fade, overflow: "hidden"}}>
      {scene.image ? (
        <Img
          src={staticFile(scene.image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
            transformOrigin,
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            background: MOOD_GRADIENTS[scene.mood ?? "warm"],
            transform: `scale(${zoom})`,
            transformOrigin,
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      {/* Darker band at the bottom so captions stay readable on any image */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const ChapterCard: React.FC<{number: number; title: string}> = ({
  number,
  title,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14}});
  const exit = interpolate(
    frame,
    [CHAPTER_CARD_FRAMES - 12, CHAPTER_CARD_FRAMES],
    [1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  if (frame >= CHAPTER_CARD_FRAMES) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 70,
        opacity: exit,
        transform: `translateX(${(1 - enter) * -80}px)`,
        background: "rgba(0,0,0,0.72)",
        borderLeft: "10px solid #ffd93b",
        borderRadius: 12,
        padding: "20px 34px",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        maxWidth: 1100,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 4,
          color: "#ffd93b",
          textTransform: "uppercase",
        }}
      >
        Chapter {number}
      </div>
      <div style={{fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginTop: 6}}>
        {title}
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{total: number}> = ({total}) => {
  const frame = useCurrentFrame();
  const pct = Math.min(100, (frame / Math.max(1, total)) * 100);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 8,
        width: "100%",
        background: "rgba(255,255,255,0.15)",
      }}
    >
      <div style={{height: "100%", width: `${pct}%`, background: "#ffd93b"}} />
    </div>
  );
};

const LongScene: React.FC<{
  scene: Scene;
  index: number;
  durationInFrames: number;
  sameAsPrev: boolean;
  theme?: CharacterTheme;
}> = ({scene, index, durationInFrames, sameAsPrev, theme}) => {
  const showCard = !!scene.chapterTitle && (scene.chapterNumber ?? 0) > 0;
  return (
    <AbsoluteFill>
      <Background
        scene={scene}
        index={index}
        durationInFrames={durationInFrames}
        sameAsPrev={sameAsPrev}
      />
      {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}

      {/* Narrator stands bottom-right, captions sit to his left */}
      <div style={{position: "absolute", right: 90, bottom: 24}}>
        <Narrator height={600} theme={theme} tunic={index % 2 === 0 ? "#e8cf9a" : "#d9bd86"} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 60,
          right: 520,
          bottom: 90,
        }}
      >
        <Captions
          text={scene.text}
          durationInFrames={durationInFrames}
          chunkSize={6}
          fontSize={64}
          uppercase={false}
          paddingX={20}
        />
      </div>

      {showCard ? (
        <ChapterCard
          number={scene.chapterNumber ?? 1}
          title={scene.chapterTitle ?? ""}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const Long: React.FC<ScriptProps> = ({scenes, slug}) => {
  const theme = getThemeFromSlug(slug);
  const total = totalFrames(scenes);
  let cursor = 0;
  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      {scenes.map((scene, i) => {
        const frames = sceneFrames(scene);
        const from = cursor;
        cursor += frames;
        const prev = i > 0 ? scenes[i - 1] : undefined;
        const sameAsPrev = !!scene.image && prev?.image === scene.image;
        return (
          <Sequence key={i} from={from} durationInFrames={frames}>
            <LongScene
              scene={scene}
              index={i}
              durationInFrames={frames}
              sameAsPrev={sameAsPrev}
              theme={theme}
            />
          </Sequence>
        );
      })}
      <ProgressBar total={total} />
    </AbsoluteFill>
  );
};

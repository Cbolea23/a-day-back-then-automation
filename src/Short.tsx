import React, {useMemo} from "react";
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
import {Narrator, getThemeFromSlug} from "./Narrator";
import {planSpeech} from "./speech";
import {FPS, Mood, Scene, ScriptProps, sceneFrames} from "./types";

const MOOD_GRADIENTS: Record<Mood, string> = {
  day: "linear-gradient(180deg, #f6d28b 0%, #e59a5b 55%, #8a4b2a 100%)",
  warm: "linear-gradient(180deg, #f3b46b 0%, #c8693a 55%, #5b2b1c 100%)",
  night: "linear-gradient(180deg, #1c2540 0%, #2e3a5c 50%, #6b4a3a 100%)",
  dark: "linear-gradient(180deg, #0f0f14 0%, #2a2330 55%, #4a2f2f 100%)",
  cool: "linear-gradient(180deg, #9fc3d6 0%, #6a93a8 55%, #2f4a5a 100%)",
};

const HOOK_FRAMES = 3 * FPS;

const Background: React.FC<{scene: Scene; durationInFrames: number}> = ({
  scene,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const dir = scene.direction ?? {};
  const drift = dir.drift ?? "push-in";
  const focus = dir.focus ?? [0.5, 0.4];
  // Focus-aware drift: the camera eases toward the scene's focus point so the
  // narrator and the background feel like they share one space.
  const fx = 0.5 - focus[0];
  const fy = 0.42 - focus[1];
  let zoomFrom = 1.02;
  let zoomTo = 1.14;
  let txFrom = 0;
  let txTo = fx * 9;
  let tyFrom = 0;
  let tyTo = fy * 9;
  switch (drift) {
    case "pull-back":
      zoomFrom = 1.16;
      zoomTo = 1.03;
      txFrom = fx * 9;
      txTo = 0;
      tyFrom = fy * 9;
      tyTo = 0;
      break;
    case "pan-left":
      zoomFrom = 1.18;
      zoomTo = 1.18;
      txFrom = 4;
      txTo = -4;
      tyTo = 0;
      break;
    case "pan-right":
      zoomFrom = 1.18;
      zoomTo = 1.18;
      txFrom = -4;
      txTo = 4;
      tyTo = 0;
      break;
    case "still":
      zoomFrom = 1.04;
      zoomTo = 1.04;
      txTo = 0;
      tyTo = 0;
      break;
    case "push-in":
    default:
      break;
  }
  const zoom = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
    extrapolateRight: "clamp",
  });
  const tx = interpolate(frame, [0, durationInFrames], [txFrom, txTo], {
    extrapolateRight: "clamp",
  });
  const ty = interpolate(frame, [0, durationInFrames], [tyFrom, tyTo], {
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{opacity: fadeIn, overflow: "hidden"}}>
      {scene.image ? (
        <Img
          src={staticFile(scene.image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom}) translate(${tx}%, ${ty}%)`,
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            background: MOOD_GRADIENTS[scene.mood ?? "warm"],
            transform: `scale(${zoom}) translate(${tx}%, ${ty}%)`,
          }}
        />
      )}
      {/* Vignette so captions and narrator stay readable */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const HookBanner: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 12}});
  const exit = interpolate(frame, [HOOK_FRAMES - 8, HOOK_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame >= HOOK_FRAMES) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        left: 50,
        right: 50,
        opacity: exit,
        transform: `scale(${0.8 + 0.2 * enter})`,
        background: "rgba(0,0,0,0.72)",
        border: "6px solid #ffd93b",
        borderRadius: 28,
        padding: "34px 40px",
        color: "#fff",
        fontFamily: "Impact, 'Arial Black', Arial, sans-serif",
        fontSize: 88,
        lineHeight: 1.1,
        textAlign: "center",
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

const ChannelBadge: React.FC<{name: string}> = ({name}) => (
  <div
    style={{
      position: "absolute",
      top: 60,
      right: 50,
      padding: "10px 26px",
      borderRadius: 999,
      background: "rgba(0,0,0,0.6)",
      border: "3px solid rgba(255,255,255,0.8)",
      color: "#fff",
      fontFamily: "Arial, sans-serif",
      fontWeight: 800,
      fontSize: 34,
      letterSpacing: 2,
      textTransform: "uppercase",
    }}
  >
    {name}
  </div>
);

const SceneView: React.FC<{
  scene: Scene;
  index: number;
  hook: string;
  durationInFrames: number;
  slug: string;
}> = ({scene, index, hook, durationInFrames, slug}) => {
  const theme = getThemeFromSlug(slug);
  const {fps} = useVideoConfig();
  // One speech plan per scene: gestures, expressions and nods all follow
  // the narration text, in sync with the captions. When the script carries
  // measured word timings (scene.wordTimings), the plan is anchored to the
  // real voiceover instead of the heuristic spread.
  const plan = useMemo(
    () =>
      planSpeech(scene.text, durationInFrames, {
        isFirstScene: index === 0,
        fps,
        timings: scene.wordTimings,
      }),
    [scene.text, scene.wordTimings, durationInFrames, index, fps],
  );
  return (
    <AbsoluteFill>
      <Background scene={scene} durationInFrames={durationInFrames} />
      {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}

      {/* Narrator performs the narration: entrance, then purposeful gestures.
          Stage direction places them in the frame so they never cover the
          scene's focus point, and they aim their gaze/pointing arm at it. */}
      {(() => {
        // Subtle entrance slide-up on each scene switch
        const slideUp = interpolate(useCurrentFrame(), [0, 10], [28, 0], {
          extrapolateRight: "clamp",
        });
        const dir = scene.direction ?? {};
        const narratorX = dir.narratorX ?? 0.5;
        const narratorScale = dir.narratorScale ?? 1;
        const nHeight = 700 * narratorScale;

        return (
          <div
            style={{
              position: "absolute",
              bottom: 40 - slideUp,
              left: `${narratorX * 100}%`,
              transform: "translateX(-50%)",
              filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.65))",
            }}
          >
            {/* Contact shadow grounds the narrator in the scene */}
            <div
              style={{
                position: "absolute",
                bottom: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 320 * narratorScale,
                height: 46 * narratorScale,
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 70%)",
              }}
            />
            <Narrator
              height={nHeight}
              theme={theme}
              plan={plan}
              audioSrc={scene.audio}
              anchorX={narratorX}
              focus={dir.focus ? {x: dir.focus[0], y: dir.focus[1]} : undefined}
            />
          </div>
        );
      })()}

      {/* Captions sit above the narrator, clear of the Shorts UI at the bottom */}
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 0,
          right: 0,
        }}
      >
        <Captions text={scene.text} durationInFrames={durationInFrames} />
      </div>

      {index === 0 ? <HookBanner text={hook} /> : null}
    </AbsoluteFill>
  );
};

export const Short: React.FC<ScriptProps> = ({scenes, hook, channelName, slug}) => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      {scenes.map((scene, i) => {
        const frames = sceneFrames(scene);
        const from = cursor;
        cursor += frames;
        return (
          <Sequence key={i} from={from} durationInFrames={frames}>
            <SceneView
              scene={scene}
              index={i}
              hook={hook}
              durationInFrames={frames}
              slug={slug}
            />
          </Sequence>
        );
      })}
      <ChannelBadge name={channelName} />
    </AbsoluteFill>
  );
};

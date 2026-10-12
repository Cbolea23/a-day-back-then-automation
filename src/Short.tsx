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
import {NPC} from "./NPC";
import {planSpeech} from "./speech";
import {FPS, Mood, Scene, ScriptProps, AtmosphereKind, sceneFrames} from "./types";

const MOOD_GRADIENTS: Record<Mood, string> = {
  day: "linear-gradient(180deg, #f6d28b 0%, #e59a5b 55%, #8a4b2a 100%)",
  warm: "linear-gradient(180deg, #f3b46b 0%, #c8693a 55%, #5b2b1c 100%)",
  night: "linear-gradient(180deg, #1c2540 0%, #2e3a5c 50%, #6b4a3a 100%)",
  dark: "linear-gradient(180deg, #0f0f14 0%, #2a2330 55%, #4a2f2f 100%)",
  cool: "linear-gradient(180deg, #9fc3d6 0%, #6a93a8 55%, #2f4a5a 100%)",
};

/** Deterministic PRNG so particles are stable across renders. */
const mulberry = (seed: number) => {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Living background: drifting dust motes, or rising embers for fire scenes.
 * Positions are pure functions of the frame, so renders are deterministic.
 */
const Atmosphere: React.FC<{kind: AtmosphereKind; seed: number}> = ({
  kind,
  seed,
}) => {
  const frame = useCurrentFrame();
  const parts = useMemo(() => {
    const rnd = mulberry(seed * 1013 + 77);
    const n = kind === "ember" ? 14 : 22;
    return Array.from({length: n}, () => ({
      x: kind === "ember" ? 0.3 + rnd() * 0.4 : rnd(),
      y: kind === "ember" ? 0.7 + rnd() * 0.3 : rnd(),
      s: 2 + rnd() * (kind === "ember" ? 5 : 4),
      speed: 0.0006 + rnd() * 0.0012,
      phase: rnd() * Math.PI * 2,
    }));
  }, [kind, seed]);
  if (kind === "none") return null;
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      {parts.map((pt, i) => {
        const y = ((((pt.y - frame * pt.speed) % 1) + 1) % 1) * 100;
        const x = ((((pt.x + Math.sin(frame / 40 + pt.phase) * 0.02) % 1) + 1) % 1) * 100;
        const tw = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(frame / 18 + pt.phase));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: pt.s,
              height: pt.s,
              borderRadius: 999,
              background: kind === "ember" ? "#ffb35c" : "#ffe9c4",
              opacity: (kind === "ember" ? 0.55 : 0.3) * tw,
              filter: kind === "ember" ? "blur(1px)" : "blur(0.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Warm candle/fire light breathing over the scene. */
const WarmFlicker: React.FC = () => {
  const frame = useCurrentFrame();
  const glow =
    0.05 + 0.04 * (0.5 + 0.5 * Math.sin(frame / 7) * Math.sin(frame / 13 + 1.7));
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 62%, rgba(255,150,50,0.6) 0%, rgba(255,150,50,0) 70%)",
        opacity: glow,
      }}
    />
  );
};

const HOOK_FRAMES = 3 * FPS;

const Background: React.FC<{
  scene: Scene;
  durationInFrames: number;
  seed: number;
}> = ({scene, durationInFrames, seed}) => {
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
      {/* Living background: particles + warm light, under the narrator */}
      <Atmosphere kind={dir.atmosphere ?? "dust"} seed={seed} />
      {dir.warmFlicker ? <WarmFlicker /> : null}
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

  const isNpcSpeaking = scene.speaker === "npc";
  let npcConfig = scene.npc;
  if (npcConfig && isNpcSpeaking) {
    npcConfig = {
      ...npcConfig,
      talking: true,
      audio: scene.audio,
      gesture: npcConfig.gesture ?? "explain",
    };
  }

  // One speech plan per scene: gestures, expressions and nods all follow
  // the narration text, in sync with the captions.
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
      <Background scene={scene} durationInFrames={durationInFrames} seed={index} />
      {scene.ambientAudio ? (
        <Audio src={staticFile(scene.ambientAudio)} volume={0.25} />
      ) : null}
      {/* Audio playback: NPC manages its own audio if speaking; otherwise played for narrator */}
      {!isNpcSpeaking && scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}

      {/* Interactive Secondary Character (NPC Cameo) if present */}
      {npcConfig ? (
        <NPC
          npc={npcConfig}
          durationInFrames={durationInFrames}
          plan={isNpcSpeaking ? plan : undefined}
        />
      ) : null}

      {/* Narrator performs: smooth grounded entrance on scene 0, seamless afterwards */}
      {(() => {
        // Only scene 0 slides in gently; subsequent scenes remain grounded
        const slideUp =
          index === 0
            ? interpolate(useCurrentFrame(), [0, 8], [30, 0], {
                extrapolateRight: "clamp",
              })
            : 0;

        const dir = scene.direction ?? {};
        // If NPC is present, shift narrator to the right so they don't overlap
        const defaultX = npcConfig ? (isNpcSpeaking ? 0.74 : 0.68) : 0.5;
        const narratorX = dir.narratorX ?? defaultX;
        const narratorScale = dir.narratorScale ?? (npcConfig ? 0.92 : 1);
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
              plan={isNpcSpeaking ? undefined : plan}
              gesture={isNpcSpeaking ? "think" : undefined}
              talking={!isNpcSpeaking}
              audioSrc={!isNpcSpeaking ? scene.audio : undefined}
              anchorX={narratorX}
              focus={
                npcConfig
                  ? {x: 0.28, y: 0.55}
                  : dir.focus
                    ? {x: dir.focus[0], y: dir.focus[1]}
                    : undefined
              }
              reaction={isNpcSpeaking ? "recoil" : dir.reaction}
            />
          </div>
        );
      })()}

      {/* Captions sit above the characters with expressive human-edited typography */}
      <div
        style={{
          position: "absolute",
          top: 800,
          left: 0,
          right: 0,
        }}
      >
        <Captions
          text={scene.text}
          durationInFrames={durationInFrames}
          speakerName={scene.speakerName}
          speaker={scene.speaker}
        />
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

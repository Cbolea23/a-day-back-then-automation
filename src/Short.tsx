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
import {FPS, Mood, Scene, ScriptProps, AtmosphereKind, sceneFrames, totalFrames} from "./types";

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

const HOOK_FRAMES = Math.round(2.7 * FPS);

/**
 * Guarantees the top HookBanner is always a punchy 3-7 word headline (max 2 lines)
 * so it NEVER overflows downward into the active captions at y=830px.
 */
function formatCompactHook(hook: string, title?: string): string {
  const cleanTitle = (title || "").replace(/#shorts/gi, "").trim();
  const raw = (hook || cleanTitle || "").trim();
  const words = raw.split(/\s+/).filter(Boolean);
  if (words.length <= 9) {
    return raw;
  }
  // If title is concise (2-9 words), prefer title as the visual headline banner
  const titleWords = cleanTitle.split(/\s+/).filter(Boolean);
  if (titleWords.length >= 2 && titleWords.length <= 9) {
    return cleanTitle;
  }
  // Otherwise, split on first sentence/dash/colon if it yields 3-9 words
  const clause = raw.split(/[—–:;!?.\n]/)[0].trim();
  const clauseWords = clause.split(/\s+/).filter(Boolean);
  if (clauseWords.length >= 3 && clauseWords.length <= 9) {
    return clause;
  }
  const sliced = words.slice(0, 7);
  while (
    sliced.length > 3 &&
    /^(the|a|an|into|of|in|on|at|to|for|with|and|or|by|from)$/i.test(sliced[sliced.length - 1])
  ) {
    sliced.pop();
  }
  return sliced.join(" ") + "...";
}

/**
 * Automatically infers an episodic series badge from slug/language/style
 * so viewers feel anchored to a bingeable series (driving 3x follower conversion).
 */
function inferSeriesTag(slug: string, language?: string, explicitTag?: string): string {
  if (explicitTag) return explicitTag.replace(/🇵🇭/g, "🕯️").toUpperCase();
  const s = (slug || "").toLowerCase();
  if (
    language === "tl" ||
    language === "taglish" ||
    /kapre|aswang|manananggal|mangkukulam|tikbalang|tiyanak|bakunawa|biringan|diwata|multo|balete|albularyo|duwende|sigbin|santelmo/.test(s)
  ) {
    return "🕯️ PHILIPPINE DARK LORE";
  }
  if (/samhain|halloween|banshee|vlad|dracula|witch|plague|ghost|vampire|wendigo|krampus|demon|cursed|nightmare|folklore/.test(s)) {
    return "🕯️ DARK FOLKLORE ARCHIVES";
  }
  return "🏛️ UNTOLD HISTORY ARCHIVES";
}

const Background: React.FC<{
  scene: Scene;
  durationInFrames: number;
  seed: number;
}> = ({scene, durationInFrames, seed}) => {
  const frame = useCurrentFrame();
  const dir = scene.direction ?? {};
  const drift = dir.drift ?? "push-in";
  const focus = dir.focus ?? [0.5, 0.4];
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
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.58) 100%)",
        }}
      />
      <Atmosphere kind={dir.atmosphere ?? "dust"} seed={seed} />
      {dir.warmFlicker ? <WarmFlicker /> : null}
    </AbsoluteFill>
  );
};

const HookBanner: React.FC<{text: string; title?: string}> = ({text, title}) => {
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
  const compactText = formatCompactHook(text, title);
  return (
    <div
      style={{
        position: "absolute",
        top: 165,
        left: 64,
        right: 64,
        opacity: exit,
        transform: `scale(${0.86 + 0.14 * enter})`,
        background: "linear-gradient(180deg, rgba(12,12,18,0.88) 0%, rgba(5,5,10,0.92) 100%)",
        border: "4px solid #ffd93b",
        boxShadow: "0 16px 40px rgba(0,0,0,0.75), 0 0 24px rgba(255,217,59,0.22)",
        borderRadius: 24,
        padding: "22px 32px",
        color: "#fff",
        fontFamily: "Impact, 'Arial Black', Arial, sans-serif",
        fontSize: 64,
        lineHeight: 1.08,
        letterSpacing: 1,
        textAlign: "center",
        textTransform: "uppercase",
      }}
    >
      {compactText}
    </div>
  );
};

/**
 * Centered top safe-zone badge + Episodic Series Header.
 * Placed at top: 68, centered horizontally so it NEVER collides with the
 * top-left Mute icon or top-right Search (🔍) icon on Reels/Shorts/TikTok.
 */
const ChannelBadge: React.FC<{name: string; seriesTag: string}> = ({name, seriesTag}) => (
  <div
    style={{
      position: "absolute",
      top: 66,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "10px 26px",
      borderRadius: 999,
      background: "rgba(10,10,16,0.76)",
      border: "2px solid rgba(255,217,59,0.65)",
      boxShadow: "0 6px 20px rgba(0,0,0,0.55)",
      whiteSpace: "nowrap",
      pointerEvents: "none",
    }}
  >
    <span
      style={{
        color: "#ffd93b",
        fontFamily: "Arial, sans-serif",
        fontWeight: 900,
        fontSize: 24,
        letterSpacing: 1.8,
        textTransform: "uppercase",
      }}
    >
      {seriesTag}
    </span>
    <span style={{color: "rgba(255,255,255,0.4)", fontSize: 22}}>•</span>
    <span
      style={{
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        fontWeight: 800,
        fontSize: 24,
        letterSpacing: 1.8,
        textTransform: "uppercase",
      }}
    >
      {name}
    </span>
  </div>
);

/**
 * Animated "Follow" Micro-CTA Pill.
 * Pops in at ~70% during the climax (~5s) AND during the final outro loop (~3.5s)
 * ensuring viewers see the follow trigger before scrolling or looping.
 */
const FollowMicroCTA: React.FC<{totalDurationFrames: number; channelName: string}> = ({
  totalDurationFrames,
  channelName,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Window 1: Climax twist (~70% timeline, lasts ~5 seconds = 150 frames)
  const climaxStart = Math.max(HOOK_FRAMES + 30, Math.round(totalDurationFrames * 0.70));
  const climaxDuration = 150;
  const climaxEnd = climaxStart + climaxDuration;

  // Window 2: Outro loop (final 100 frames = ~3.3 seconds until end of video)
  const outroDuration = 100;
  const outroStart = Math.max(climaxEnd + 30, totalDurationFrames - outroDuration);
  const outroEnd = totalDurationFrames;

  let localFrame = -1;
  let activeDuration = 100;

  if (frame >= climaxStart && frame < climaxEnd) {
    localFrame = frame - climaxStart;
    activeDuration = climaxDuration;
  } else if (frame >= outroStart && frame < outroEnd) {
    localFrame = frame - outroStart;
    activeDuration = outroDuration;
  } else {
    return null;
  }

  const popIn = spring({frame: localFrame, fps, config: {damping: 11, mass: 0.8}});
  const fadeOut = interpolate(localFrame, [activeDuration - 15, activeDuration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bellSwing = Math.sin(localFrame / 2.5) * 16 * Math.max(0, 1 - (localFrame % 45) / 35);

  return (
    <div
      style={{
        position: "absolute",
        top: 155,
        left: "50%",
        transform: `translateX(-50%) scale(${0.82 + 0.18 * popIn})`,
        opacity: fadeOut,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 32px",
        borderRadius: 999,
        background: "linear-gradient(90deg, rgba(15,15,24,0.94) 0%, rgba(28,22,42,0.94) 100%)",
        border: "3px solid #ffd93b",
        boxShadow: "0 12px 32px rgba(0,0,0,0.75), 0 0 20px rgba(255,217,59,0.3)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontSize: 34,
          display: "inline-block",
          transform: `rotate(${bellSwing}deg)`,
        }}
      >
        🔔
      </span>
      <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
        <span
          style={{
            color: "#ffd93b",
            fontFamily: "Impact, 'Arial Black', sans-serif",
            fontSize: 30,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            lineHeight: 1.05,
          }}
        >
          FOLLOW {channelName}
        </span>
        <span
          style={{
            color: "#e2e8f0",
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            fontSize: 21,
            letterSpacing: 0.8,
          }}
        >
          Don&apos;t miss tonight&apos;s next story
        </span>
      </div>
    </div>
  );
};

const SceneView: React.FC<{
  scene: Scene;
  index: number;
  hook: string;
  title?: string;
  durationInFrames: number;
  slug: string;
  narratorTheme?: string;
  narratorTunic?: string;
  narratorAccent?: string;
}> = ({scene, index, hook, title, durationInFrames, slug, narratorTheme, narratorTunic, narratorAccent}) => {
  const theme = (narratorTheme as any) || getThemeFromSlug(slug);
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
        <Audio src={staticFile(scene.ambientAudio)} volume={0.22} />
      ) : null}
      {/* Subtle scene-cut whoosh on scene transitions */}
      {index > 0 ? (
        <Audio src={staticFile("sfx/transition-whoosh.wav")} volume={0.18} />
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
        const slideUp =
          index === 0
            ? interpolate(useCurrentFrame(), [0, 8], [30, 0], {
                extrapolateRight: "clamp",
              })
            : 0;

        const dir = scene.direction ?? {};
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
              tunic={narratorTunic}
              accentColor={narratorAccent}
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

      {/* Captions positioned cleanly at top: 830px so they NEVER collide with HookBanner */}
      <div
        style={{
          position: "absolute",
          top: 830,
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

      {index === 0 ? <HookBanner text={hook} title={title} /> : null}
    </AbsoluteFill>
  );
};

export const Short: React.FC<ScriptProps> = ({
  scenes,
  hook,
  title,
  channelName,
  slug,
  narratorTheme,
  narratorTunic,
  narratorAccent,
  language,
  seriesTag,
  artStyle,
}) => {
  let cursor = 0;
  const totalDurationFrames = totalFrames(scenes);
  const resolvedSeriesTag = inferSeriesTag(slug, language, seriesTag);
  const hasCustomAmbient = scenes.some((s) => Boolean(s.ambientAudio));
  const isDarkLore =
    artStyle === "dark-folklore" ||
    resolvedSeriesTag.includes("FOLKLORE") ||
    resolvedSeriesTag.includes("LORE") ||
    scenes[0]?.mood === "dark" ||
    scenes[0]?.mood === "night";
  const defaultAmbientFile = isDarkLore
    ? "sfx/ambient-folklore-wind.wav"
    : "sfx/ambient-history-hearth.wav";

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      {/* Mastered continuous studio ambient soundscape (-24 LUFS / 0.14 volume) */}
      {!hasCustomAmbient ? (
        <Audio src={staticFile(defaultAmbientFile)} volume={0.14} loop />
      ) : null}

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
              title={title}
              durationInFrames={frames}
              slug={slug}
              narratorTheme={narratorTheme}
              narratorTunic={narratorTunic}
              narratorAccent={narratorAccent}
            />
          </Sequence>
        );
      })}
      <ChannelBadge name={channelName} seriesTag={resolvedSeriesTag} />
      <FollowMicroCTA totalDurationFrames={totalDurationFrames} channelName={channelName} />
    </AbsoluteFill>
  );
};

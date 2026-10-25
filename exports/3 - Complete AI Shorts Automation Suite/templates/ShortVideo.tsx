import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface Scene {
  text: string;
  image: string;
  audio: string;
  seconds: number;
}

export interface ShortProps {
  title?: string;
  hook?: string;
  channelName?: string;
  seriesTag?: string;
  ambientAudio?: string;
  scenes: Scene[];
}

/**
 * Guarantees the top HookBanner is always a punchy 3-7 word headline (max 2 lines)
 * so it NEVER overflows downward into the active captions at y=830px.
 */
function formatCompactHook(hook?: string, title?: string): string {
  const cleanTitle = (title || '').replace(/#shorts/gi, '').trim();
  const raw = (hook || cleanTitle || '').trim();
  const words = raw.split(/\s+/).filter(Boolean);
  if (words.length <= 9) return raw;
  const titleWords = cleanTitle.split(/\s+/).filter(Boolean);
  if (titleWords.length >= 2 && titleWords.length <= 9) return cleanTitle;
  const sliced = words.slice(0, 7);
  while (
    sliced.length > 3 &&
    /^(the|a|an|into|of|in|on|at|to|for|with|and|or|by|from)$/i.test(
      sliced[sliced.length - 1]
    )
  ) {
    sliced.pop();
  }
  return sliced.join(' ') + '...';
}

// Centered top safe-zone Series + Channel badge (clears top-left Mute and top-right Search 🔍)
const ChannelSeriesBadge: React.FC<{ name: string; seriesTag: string }> = ({
  name,
  seriesTag,
}) => (
  <div
    style={{
      position: 'absolute',
      top: 66,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 26px',
      borderRadius: 999,
      background: 'rgba(10,10,16,0.78)',
      border: '2px solid rgba(255,217,59,0.65)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.55)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
    }}
  >
    <span
      style={{
        color: '#FFD93B',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 900,
        fontSize: 24,
        letterSpacing: 1.6,
        textTransform: 'uppercase',
      }}
    >
      {seriesTag}
    </span>
    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }}>•</span>
    <span
      style={{
        color: '#FFFFFF',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: 800,
        fontSize: 24,
        letterSpacing: 1.6,
        textTransform: 'uppercase',
      }}
    >
      {name}
    </span>
  </div>
);

// Compact 3-6 word Hook Banner (shown for first 2.7s in upper safe zone)
const CompactHookBanner: React.FC<{ hook?: string; title?: string }> = ({
  hook,
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hookFrames = Math.round(2.7 * fps);
  if (frame >= hookFrames) return null;

  const compact = formatCompactHook(hook, title);
  if (!compact) return null;

  const enter = spring({ frame, fps, config: { damping: 12 } });
  const exit = interpolate(frame, [hookFrames - 8, hookFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 165,
        left: 64,
        right: 64,
        opacity: exit,
        transform: `scale(${0.86 + 0.14 * enter})`,
        background: 'rgba(10,10,16,0.9)',
        border: '4px solid #FFD93B',
        borderRadius: 24,
        padding: '22px 32px',
        color: '#FFFFFF',
        fontFamily: 'Impact, "Arial Black", sans-serif',
        fontSize: 64,
        lineHeight: 1.08,
        textAlign: 'center',
        textTransform: 'uppercase',
        boxShadow: '0 16px 40px rgba(0,0,0,0.75)',
      }}
    >
      {compact}
    </div>
  );
};

// Silent 75%-Climax Animated "Follow" Micro-CTA Pill (converts viewers without outro drop-off)
const FollowMicroCTA: React.FC<{
  totalDurationFrames: number;
  channelName: string;
}> = ({ totalDurationFrames, channelName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = Math.max(95, Math.round(totalDurationFrames * 0.74));
  const ctaDuration = 85;
  if (frame < startFrame || frame >= startFrame + ctaDuration) return null;

  const localFrame = frame - startFrame;
  const popIn = spring({ frame: localFrame, fps, config: { damping: 11 } });
  const fadeOut = interpolate(
    localFrame,
    [ctaDuration - 12, ctaDuration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 155,
        left: '50%',
        transform: `translateX(-50%) scale(${0.82 + 0.18 * popIn})`,
        opacity: fadeOut,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 32px',
        borderRadius: 999,
        background: 'rgba(15,15,24,0.94)',
        border: '3px solid #FFD93B',
        boxShadow: '0 12px 32px rgba(0,0,0,0.75)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}
    >
      <span style={{ fontSize: 34 }}>🔔</span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            color: '#FFD93B',
            fontFamily: 'Impact, "Arial Black", sans-serif',
            fontSize: 30,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
          }}
        >
          FOLLOW {channelName}
        </span>
        <span
          style={{
            color: '#E2E8F0',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 21,
          }}
        >
          Don&apos;t miss tonight&apos;s next story
        </span>
      </div>
    </div>
  );
};

// 3-word kinetic caption chunking component (placed cleanly below HookBanner zone)
const KineticCaption: React.FC<{
  text: string;
  durationInFrames: number;
}> = ({ text, durationInFrames }) => {
  const frame = useCurrentFrame();
  const words = text.split(/\s+/).filter(Boolean);
  const chunkSize = 3;
  const chunks: string[][] = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize));
  }

  const framesPerChunk = Math.max(
    1,
    Math.floor(durationInFrames / Math.max(1, chunks.length))
  );
  const currentChunkIndex = Math.min(
    chunks.length - 1,
    Math.floor(frame / framesPerChunk)
  );
  const activeChunk = chunks[currentChunkIndex] || [];

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 280, // Safe zone: clears Shorts channel titles and action buttons
        paddingLeft: 60,
        paddingRight: 120, // Safe zone: clears right-side Like/Comment/Share buttons
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {activeChunk.map((word, wIdx) => {
          const isHighlight = wIdx === activeChunk.length - 1;
          return (
            <span
              key={wIdx}
              style={{
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: 68,
                fontWeight: 900,
                textTransform: 'uppercase',
                color: isHighlight ? '#FFD93B' : '#FFFFFF',
                textShadow:
                  '0 4px 16px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.8)',
                letterSpacing: '-1px',
                transform: isHighlight ? 'scale(1.08)' : 'scale(1.0)',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Ken Burns dynamic camera drift component
const DriftingBackground: React.FC<{
  src: string;
  direction?: 'push-in' | 'pull-back';
  durationInFrames: number;
}> = ({ src, direction = 'push-in', durationInFrames }) => {
  const frame = useCurrentFrame();

  const scale =
    direction === 'push-in'
      ? interpolate(frame, [0, durationInFrames], [1.04, 1.16], {
          extrapolateRight: 'clamp',
        })
      : interpolate(frame, [0, durationInFrames], [1.16, 1.04], {
          extrapolateRight: 'clamp',
        });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

// Main Short Video Remotion Composition (1080x1920)
export const ShortVideo: React.FC<ShortProps> = ({
  title = 'Untold Folklore',
  hook,
  channelName = 'A Day Back Then',
  seriesTag = '🕯️ DARK FOLKLORE ARCHIVES',
  ambientAudio,
  scenes = [],
}) => {
  const { fps } = useVideoConfig();
  let currentStartFrame = 0;
  const totalDurationFrames = Math.max(
    fps,
    scenes.reduce((sum, s) => sum + Math.max(1, Math.round(s.seconds * fps)), 0)
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {ambientAudio && <Audio src={ambientAudio} volume={0.14} loop />}
      {scenes.map((scene, idx) => {
        const durationFrames = Math.max(1, Math.round(scene.seconds * fps));
        const startFrame = currentStartFrame;
        currentStartFrame += durationFrames;
        const driftDirection = idx % 2 === 0 ? 'push-in' : 'pull-back';

        return (
          <Sequence
            key={idx}
            from={startFrame}
            durationInFrames={durationFrames}
          >
            <DriftingBackground
              src={scene.image}
              direction={driftDirection}
              durationInFrames={durationFrames}
            />
            {scene.audio && <Audio src={scene.audio} volume={1.0} />}
            <KineticCaption
              text={scene.text}
              durationInFrames={durationFrames}
            />
            {idx === 0 && <CompactHookBanner hook={hook} title={title} />}
          </Sequence>
        );
      })}
      <ChannelSeriesBadge name={channelName} seriesTag={seriesTag} />
      <FollowMicroCTA
        totalDurationFrames={totalDurationFrames}
        channelName={channelName}
      />
    </AbsoluteFill>
  );
};

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
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
  scenes: Scene[];
}

// 3-word kinetic caption chunking component
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

  const framesPerChunk = Math.max(1, Math.floor(durationInFrames / chunks.length));
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
        paddingRight: 60,
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
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: 68,
                fontWeight: 900,
                textTransform: 'uppercase',
                color: isHighlight ? '#FFD93B' : '#FFFFFF',
                textShadow: '0 4px 16px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.8)',
                letterSpacing: '-1px',
                transform: isHighlight ? 'scale(1.08)' : 'scale(1.0)',
                transition: 'transform 0.1s ease',
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
      {/* Subtle vignette gradient to guarantee subtitle legibility */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

// Main Short Video Remotion Composition (1080x1920)
export const ShortVideo: React.FC<ShortProps> = ({ scenes = [] }) => {
  const { fps } = useVideoConfig();
  let currentStartFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
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
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

import React from "react";
import {Composition} from "remotion";
import {Short} from "./Short";
import {Long} from "./LongVideo";
import {NarratorLineup} from "./NarratorLineup";
import {FPS, ScriptProps, totalFrames} from "./types";
import sampleData from "../data/sample.json";
import sampleLongData from "../data/sample-long.json";

const sample = sampleData as unknown as ScriptProps;
const sampleLong = sampleLongData as unknown as ScriptProps;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Short"
        component={Short}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={totalFrames(sample.scenes)}
        defaultProps={sample}
        calculateMetadata={({props}) => ({
          durationInFrames: totalFrames(props.scenes),
        })}
      />
      <Composition
        id="Long"
        component={Long}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={totalFrames(sampleLong.scenes)}
        defaultProps={sampleLong}
        calculateMetadata={({props}) => ({
          durationInFrames: totalFrames(props.scenes),
        })}
      />
      <Composition
        id="Lineup"
        component={NarratorLineup}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={30}
      />
    </>
  );
};

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
      <Composition
        id="SampleScene"
        component={Long}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={Math.round((2.2 + 6.5 + 9.3) * FPS)}
        defaultProps={{
          slug: "gladiator-real-life",
          title: "Who Ended Up in the Sand?",
          hook: "Gladiator Reality",
          channelName: "A Day Back Then",
          scenes: [
            {
              speaker: "narrator",
              speakerName: "NARRATOR",
              text: "Look at that guy over in the corner.",
              mood: "cool",
              image: "long/gladiator-real-life/2.png",
              audio: "audio/dialogue-test/1_narrator.mp3",
              ambientAudio: "audio/ambient/gladiator-barracks.wav",
              npc: {
                theme: "roman",
                tunic: "#e2d2b4",
                position: "left-corner",
                facing: "right",
                height: 410,
                gesture: "think",
                expression: "nervous",
              },
              seconds: 2.2,
            },
            {
              speaker: "npc",
              speakerName: "VOLUNTEER",
              text: "Look, I owe four hundred denarii to a baker. One lion cannot be worse than my landlord!",
              mood: "cool",
              image: "long/gladiator-real-life/2.png",
              audio: "audio/dialogue-test/2_npc.mp3",
              ambientAudio: "audio/ambient/gladiator-barracks.wav",
              npc: {
                theme: "roman",
                tunic: "#e2d2b4",
                position: "left-corner",
                facing: "right",
                height: 410,
                gesture: "explain",
                expression: "nervous",
                speechBubble: "One lion can't be worse than my landlord!",
                talking: true,
                audio: "audio/dialogue-test/2_npc.mp3",
              },
              seconds: 6.5,
            },
            {
              speaker: "narrator",
              speakerName: "NARRATOR",
              text: "Believe it or not, he's a free citizen. Some Romans actually volunteered for this, signing away their freedom just to escape crushing debt.",
              mood: "cool",
              image: "long/gladiator-real-life/2.png",
              audio: "audio/dialogue-test/3_narrator.mp3",
              ambientAudio: "audio/ambient/gladiator-barracks.wav",
              npc: {
                theme: "roman",
                tunic: "#e2d2b4",
                position: "left-corner",
                facing: "right",
                height: 410,
                gesture: "think",
                expression: "nervous",
              },
              seconds: 9.3,
            },
          ],
        }}
      />
    </>
  );
};

import React from "react";
import {Composition} from "remotion";
import {Short} from "./Short";
import {Long} from "./LongVideo";
import {NarratorLineup} from "./NarratorLineup";
import {NPCLineup} from "./NPCLineup";
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
        id="NPCLineup"
        component={NPCLineup}
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
        durationInFrames={Math.round((8.72 + 8.8 + 6.75 + 6.5) * FPS)}
        calculateMetadata={({props}) => ({
          durationInFrames: totalFrames(props.scenes),
        })}
        defaultProps={{
          slug: "gladiator-real-life",
          title: "Gladiator Reality: What Was It Actually Like?",
          hook: "Gladiator Reality",
          channelName: "A Day Back Then",
          scenes: [
            {
              speaker: "narrator",
              speakerName: "NARRATOR",
              text: "Think your morning alarm is torture? Ancient Romans did not have 9-to-5s, but waking up back then was a whole different beast.",
              mood: "dark",
              image: "long/gladiator-real-life/1.png",
              audio: "audio/dialogue-test/ink_scene1.wav",
              ambientAudio: "audio/ambient/gladiator-barracks.wav",
              sfx: "audio/sfx/whoosh.wav",
              layout: "split-screen",
              splitScreen: {
                leftBadge: "TODAY",
                leftTitle: "9-TO-5 GRIND",
                leftSubtitle: "Alarm at 6 AM • Rush Hour • Emails",
                rightBadge: "ANCIENT ROME",
                rightTitle: "SUNRISE SURVIVAL",
                rightSubtitle: "Dawn Roll Call • Debt • Sand Arena",
                leftImage: "long/gladiator-real-life/1.png",
                rightImage: "long/gladiator-real-life/2.png",
              },
              seconds: 8.72,
            },
            {
              speaker: "narrator",
              speakerName: "NARRATOR",
              text: "In the arena, you were not an action movie superstar. You were property, living on barley porridge and constant fear.",
              mood: "warm",
              image: "long/gladiator-real-life/1.png",
              audio: "audio/dialogue-test/ink_scene2.wav",
              ambientAudio: "audio/ambient/gladiator-barracks.wav",
              sfx: "audio/sfx/pop.wav",
              layout: "center-stage",
              seconds: 8.8,
            },
            {
              speaker: "narrator",
              speakerName: "NARRATOR",
              text: "Every single morning, gladiators marched into the training courtyard under the watchful eyes of their doctors and guards.",
              mood: "cool",
              image: "long/gladiator-real-life/2.png",
              audio: "audio/dialogue-test/ink_scene3.wav",
              ambientAudio: "audio/ambient/gladiator-barracks.wav",
              layout: "walking",
              seconds: 6.75,
            },
            {
              speaker: "npc",
              speakerName: "VOLUNTEER",
              text: "Look, I owe four hundred denarii to a baker. One lion cannot be worse than my landlord!",
              mood: "cool",
              image: "long/gladiator-real-life/2.png",
              audio: "audio/dialogue-test/2_npc.mp3",
              ambientAudio: "audio/ambient/gladiator-barracks.wav",
              sfx: "audio/sfx/pop.wav",
              layout: "corner",
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
          ],
        }}
      />
    </>
  );
};

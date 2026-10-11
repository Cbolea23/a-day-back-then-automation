#!/usr/bin/env node
/**
 * Generates Batch 1 Expansion Scripts:
 * - 13 World War II & 20th Century scripts
 * - 12 Age of Sail & Pirates scripts
 * 
 * Each script has 6 scenes adhering strictly to the historical storytelling style:
 * - 100-125 words total
 * - Vivid hooks, spoken second-person curious tone
 * - Background-only image prompts in matching art style
 */

import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const BATCH_1_SCRIPTS = [
  // ==========================================
  // WORLD WAR II & 20TH CENTURY (13 EPISODES)
  // ==========================================
  {
    slug: "wwii-blackout-night",
    title: "Surviving the London Blitz Blackout",
    hook: "Lighting a cigarette outside could get you arrested.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "During the London Blitz, every single city street was plunged into pitch-black darkness by order of the government.",
        mood: "dark",
        imagePrompt: "1940s London high street under total midnight blackout with dark silhouette of Big Ben and searchlight beams crisscrossing the cloudy sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-blackout-night/1.png",
        audio: "audio/wwii-blackout-night/1.wav",
        voicedText: "During the London Blitz, every single city street was plunged into pitch-black darkness by order of the government.",
        seconds: 6.5
      },
      {
        text: "Wardens patrolled neighborhoods shouting 'Put that light out!' if even a crack of candlelight escaped heavy blackout curtains.",
        mood: "cool",
        imagePrompt: "Row of Victorian brick terraced houses at night with thick black cloth drawn tight across glowing window frames. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-blackout-night/2.png",
        audio: "audio/wwii-blackout-night/2.wav",
        voicedText: "Wardens patrolled neighborhoods shouting 'Put that light out!' if even a crack of candlelight escaped heavy blackout curtains.",
        seconds: 6.8
      },
      {
        text: "Streetlights were turned off, and cars drove with metal slotted hoods over their headlamps that emitted only faint downwards glows.",
        mood: "dark",
        imagePrompt: "1940s vintage black automobile parked by a cobblestone curb with hooded slotted headlights casting dim beams onto wet asphalt. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-blackout-night/3.png",
        audio: "audio/wwii-blackout-night/3.wav",
        voicedText: "Streetlights were turned off, and cars drove with metal slotted hoods over their headlamps that emitted only faint downwards glows.",
        seconds: 7.2
      },
      {
        text: "Walking home was treacherous: thousands tripped into bomb craters, bumped into lampposts, or accidentally fell into the Thames river.",
        mood: "cool",
        imagePrompt: "Misty Thames riverbank with cast-iron railings and white stripes painted on tree trunks to guide night walkers. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-blackout-night/4.png",
        audio: "audio/wwii-blackout-night/4.wav",
        voicedText: "Walking home was treacherous: thousands tripped into bomb craters, bumped into lampposts, or accidentally fell into the Thames river.",
        seconds: 7.1
      },
      {
        text: "To avoid nighttime car crashes, city councils painted curbs, lamp posts, and even cow tails with reflective white stripes.",
        mood: "warm",
        imagePrompt: "English country roadside hedge with painted white stripes on stone markers and wooden fences under pale moonlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-blackout-night/5.png",
        audio: "audio/wwii-blackout-night/5.wav",
        voicedText: "To avoid nighttime car crashes, city councils painted curbs, lamp posts, and even cow tails with reflective white stripes.",
        seconds: 6.9
      },
      {
        text: "Could you have navigated an entire city in absolute pitch darkness? Drop a comment below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Morning sunrise over London rooftops with smoke clearing over chimney pots and St Pauls dome in the distance. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-blackout-night/6.png",
        audio: "audio/wwii-blackout-night/6.wav",
        voicedText: "Could you have navigated an entire city in absolute pitch darkness? Drop a comment below and follow for daily history stories!",
        seconds: 6.8
      }
    ]
  },
  {
    slug: "wwii-spitfire-pilot-day",
    title: "Battle of Britain Fighter Pilot Scramble",
    hook: "Fighter pilots waited in deckchairs on airfield grass.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the summer of 1940, young Spitfire pilots spent tense summer afternoons resting in wicker deckchairs beside airfield grass.",
        mood: "day",
        imagePrompt: "Grassy English airfield with green canvas dispersal tent, empty wooden deckchairs, and a polished Supermarine Spitfire with elliptical wings parked behind. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-spitfire-pilot-day/1.png",
        audio: "audio/wwii-spitfire-pilot-day/1.wav",
        voicedText: "In the summer of 1940, young Spitfire pilots spent tense summer afternoons resting in wicker deckchairs beside airfield grass.",
        seconds: 6.8
      },
      {
        text: "When the klaxon horn sounded a scramble call, pilots had under four minutes to sprint to their cockpits and fire up Merlin engines.",
        mood: "cool",
        imagePrompt: "Wooden operations room wall with brass air-raid bell, red telephone, and chalk pilot duty roster board. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-spitfire-pilot-day/2.png",
        audio: "audio/wwii-spitfire-pilot-day/2.wav",
        voicedText: "When the klaxon horn sounded a scramble call, pilots had under four minutes to sprint to their cockpits and fire up Merlin engines.",
        seconds: 7.2
      },
      {
        text: "At 20,000 feet over the English Channel, cockpit temperatures dropped below zero while pilots checked mirrors for diving German fighters.",
        mood: "cool",
        imagePrompt: "View through an aircraft reflector gunsight towards blue sky dotted with puffy white clouds and distant contrails. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-spitfire-pilot-day/3.png",
        audio: "audio/wwii-spitfire-pilot-day/3.wav",
        voicedText: "At 20,000 feet over the English Channel, cockpit temperatures dropped below zero while pilots checked mirrors for diving German fighters.",
        seconds: 7.5
      },
      {
        text: "A dogfight lasted barely ten minutes: eight Browning machine guns had only enough ammunition for fifteen seconds of continuous firing.",
        mood: "dramatic",
        imagePrompt: "Aerial sky vista with swirling white vapor trails and smoke plumes curling through sunny clouds. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-spitfire-pilot-day/4.png",
        audio: "audio/wwii-spitfire-pilot-day/4.wav",
        voicedText: "A dogfight lasted barely ten minutes: eight Browning machine guns had only enough ammunition for fifteen seconds of continuous firing.",
        seconds: 7.4
      },
      {
        text: "Landing on grass with empty fuel tanks, ground mechanics swarmed the aircraft to patch bullet holes and reload brass cartridges.",
        mood: "warm",
        imagePrompt: "Airfield hangar apron with wooden ammo crates, brass bullet belts, and canvas oil-stained mechanic toolkits. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-spitfire-pilot-day/5.png",
        audio: "audio/wwii-spitfire-pilot-day/5.wav",
        voicedText: "Landing on grass with empty fuel tanks, ground mechanics swarmed the aircraft to patch bullet holes and reload brass cartridges.",
        seconds: 7.0
      },
      {
        text: "Pilots flew up to four combat sorties a day. Would you have strapped into a Spitfire cockpit? Tell us below!",
        mood: "day",
        imagePrompt: "Golden sunset over calm Kent wheat fields with wooden windsock fluttering beside the runway. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-spitfire-pilot-day/6.png",
        audio: "audio/wwii-spitfire-pilot-day/6.wav",
        voicedText: "Pilots flew up to four combat sorties a day. Would you have strapped into a Spitfire cockpit? Tell us below!",
        seconds: 6.9
      }
    ]
  },
  {
    slug: "wwii-victory-garden",
    title: "Digging for Victory: Potatoes Over Lawns",
    hook: "London dug up the Tower moat to plant cabbages.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "To avoid mass starvation when U-boats blockaded merchant shipping, Britain launched the famous Dig for Victory campaign.",
        mood: "day",
        imagePrompt: "1940s vintage public park garden transformed into neat rows of vegetable allotments with wooden signs. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-victory-garden/1.png",
        audio: "audio/wwii-victory-garden/1.wav",
        voicedText: "To avoid mass starvation when U-boats blockaded merchant shipping, Britain launched the famous Dig for Victory campaign.",
        seconds: 6.8
      },
      {
        text: "Ornamental flowerbeds, golf courses, cricket pitches, and even the dry medieval moat of the Tower of London were plowed for potatoes.",
        mood: "warm",
        imagePrompt: "Historic stone castle moat converted into lush green rows of potato plants under afternoon light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-victory-garden/2.png",
        audio: "audio/wwii-victory-garden/2.wav",
        voicedText: "Ornamental flowerbeds, golf courses, cricket pitches, and even the dry medieval moat of the Tower of London were plowed for potatoes.",
        seconds: 7.4
      },
      {
        text: "Every suburban backyard had a compost heap and homemade chicken coops built from scrap timber and bomb shelter metal.",
        mood: "day",
        imagePrompt: "Suburban brick cottage garden with a wooden chicken coop, wire fencing, and neat rows of ripening carrots. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-victory-garden/3.png",
        audio: "audio/wwii-victory-garden/3.wav",
        voicedText: "Every suburban backyard had a compost heap and homemade chicken coops built from scrap timber and bomb shelter metal.",
        seconds: 6.9
      },
      {
        text: "Families formed 'Pig Clubs', feeding neighborhood kitchen scraps to community pigs kept in shared pens.",
        mood: "warm",
        imagePrompt: "Rustic wooden farm pen with hay bales, wooden feed trough, and a stone barn in the English countryside. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-victory-garden/4.png",
        audio: "audio/wwii-victory-garden/4.wav",
        voicedText: "Families formed 'Pig Clubs', feeding neighborhood kitchen scraps to community pigs kept in shared pens.",
        seconds: 6.5
      },
      {
        text: "By 1943, over one million tons of vegetables were produced in personal gardens, keeping millions from malnutrition.",
        mood: "day",
        imagePrompt: "Bountiful wooden bushel baskets overflowing with freshly harvested cabbages, leeks, and earthy potatoes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-victory-garden/5.png",
        audio: "audio/wwii-victory-garden/5.wav",
        voicedText: "By 1943, over one million tons of vegetables were produced in personal gardens, keeping millions from malnutrition.",
        seconds: 6.9
      },
      {
        text: "Could you have lived entirely on vegetables you grew in your backyard? Let us know below and subscribe for more history!",
        mood: "warm",
        imagePrompt: "Peaceful English cottage allotment bathed in golden sunset with wooden garden spade resting against a picket fence. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-victory-garden/6.png",
        audio: "audio/wwii-victory-garden/6.wav",
        voicedText: "Could you have lived entirely on vegetables you grew in your backyard? Let us know below and subscribe for more history!",
        seconds: 7.1
      }
    ]
  },
  {
    slug: "wwii-gas-mask-box-kids",
    title: "Why Every Child Carried a Gas Mask Box",
    hook: "You couldn't board a school bus without your cardboard box.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "At the outbreak of World War II, the British government issued thirty-eight million gas masks to every man, woman, and baby.",
        mood: "cool",
        imagePrompt: "1940s schoolroom wooden cloakroom with rows of cardboard gas mask boxes hanging from brass coat pegs. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-gas-mask-box-kids/1.png",
        audio: "audio/wwii-gas-mask-box-kids/1.wav",
        voicedText: "At the outbreak of World War II, the British government issued thirty-eight million gas masks to every man, woman, and baby.",
        seconds: 7.1
      },
      {
        text: "Every child was required by law to carry their square cardboard box on a canvas string everywhere: to school, parks, and cinemas.",
        mood: "day",
        imagePrompt: "Vintage wooden school desk with open notebook, dip inkwell pen, and square brown cardboard box resting on the corner. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-gas-mask-box-kids/2.png",
        audio: "audio/wwii-gas-mask-box-kids/2.wav",
        voicedText: "Every child was required by law to carry their square cardboard box on a canvas string everywhere: to school, parks, and cinemas.",
        seconds: 7.3
      },
      {
        text: "Bus conductors refused boarding to anyone who forgot their box, and headmasters conducted surprise gas drills during arithmetic class.",
        mood: "cool",
        imagePrompt: "Interior of a 1940s red London double-decker bus with wooden floorboards and leather seats by the window. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-gas-mask-box-kids/3.png",
        audio: "audio/wwii-gas-mask-box-kids/3.wav",
        voicedText: "Bus conductors refused boarding to anyone who forgot their box, and headmasters conducted surprise gas drills during arithmetic class.",
        seconds: 7.4
      },
      {
        text: "For toddlers, masks were terrifying rubber contraptions. To comfort them, the government produced red and blue 'Mickey Mouse' respirators.",
        mood: "warm",
        imagePrompt: "Nursery wooden shelf with a vintage rubber child's respirator featuring bright red rubber fittings and eye glass lenses. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-gas-mask-box-kids/4.png",
        audio: "audio/wwii-gas-mask-box-kids/4.wav",
        voicedText: "For toddlers, masks were terrifying rubber contraptions. To comfort them, the government produced red and blue 'Mickey Mouse' respirators.",
        seconds: 7.5
      },
      {
        text: "Babies were placed into sealed airtight steel pods with manual hand bellows that mothers had to pump continuously.",
        mood: "cool",
        imagePrompt: "Vintage metal baby carrier apparatus with clear glass observation window and rubber accordion hand pump. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-gas-mask-box-kids/5.png",
        audio: "audio/wwii-gas-mask-box-kids/5.wav",
        voicedText: "Babies were placed into sealed airtight steel pods with manual hand bellows that mothers had to pump continuously.",
        seconds: 7.0
      },
      {
        text: "Fortunately, poison gas was never used on British cities. Would you have remembered your gas mask box every single morning?",
        mood: "day",
        imagePrompt: "Sunny brick school playground in Britain with wrought-iron gate and autumn leaves blowing across cobblestones. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-gas-mask-box-kids/6.png",
        audio: "audio/wwii-gas-mask-box-kids/6.wav",
        voicedText: "Fortunately, poison gas was never used on British cities. Would you have remembered your gas mask box every single morning?",
        seconds: 7.0
      }
    ]
  },
  {
    slug: "wwii-anderson-shelter-backyard",
    title: "Sleeping in an Anderson Garden Shelter",
    hook: "Millions slept underground in cold, muddy garden bunkers.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "During the Blitz, over two million British families assembled an Anderson shelter in their backyard garden.",
        mood: "cool",
        imagePrompt: "English backyard garden with an arch-roofed corrugated steel shelter dug into the turf and covered with mounded earth. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-anderson-shelter-backyard/1.png",
        audio: "audio/wwii-anderson-shelter-backyard/1.wav",
        voicedText: "During the Blitz, over two million British families assembled an Anderson shelter in their backyard garden.",
        seconds: 6.8
      },
      {
        text: "Made from six curved corrugated steel sheets bolted together, it was buried three feet deep into the soil and covered with dirt.",
        mood: "dark",
        imagePrompt: "Cross-section of an earth-covered corrugated steel shelter with heavy wooden blast door and sandbags piled outside. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-anderson-shelter-backyard/2.png",
        audio: "audio/wwii-anderson-shelter-backyard/2.wav",
        voicedText: "Made from six curved corrugated steel sheets bolted together, it was buried three feet deep into the soil and covered with dirt.",
        seconds: 7.3
      },
      {
        text: "Inside, it was cramped, damp, and freezing cold. Mud floors often flooded with rainwater after autumn downpours.",
        mood: "dark",
        imagePrompt: "Interior of dim underground shelter with wooden plank duckboards over shallow puddle, twin wire bunk beds, and a wool blanket. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-anderson-shelter-backyard/3.png",
        audio: "audio/wwii-anderson-shelter-backyard/3.wav",
        voicedText: "Inside, it was cramped, damp, and freezing cold. Mud floors often flooded with rainwater after autumn downpours.",
        seconds: 7.1
      },
      {
        text: "Families huddled under wool blankets by the light of a single kerosene hurricane lantern while bomb concussions rattled the walls.",
        mood: "warm",
        imagePrompt: "Glowing glass paraffin hurricane lamp resting on a small wooden crate beside a thermos flask and a paperback book. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-anderson-shelter-backyard/4.png",
        audio: "audio/wwii-anderson-shelter-backyard/4.wav",
        voicedText: "Families huddled under wool blankets by the light of a single kerosene hurricane lantern while bomb concussions rattled the walls.",
        seconds: 7.5
      },
      {
        text: "Despite the damp discomfort, Anderson shelters saved countless lives by deflecting deadly flying shrapnel and falling building masonry.",
        mood: "cool",
        imagePrompt: "Morning light peeking through the open wooden hatch of a steel bunker revealing quiet garden soil. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-anderson-shelter-backyard/5.png",
        audio: "audio/wwii-anderson-shelter-backyard/5.wav",
        voicedText: "Despite the damp discomfort, Anderson shelters saved countless lives by deflecting deadly flying shrapnel and falling building masonry.",
        seconds: 7.3
      },
      {
        text: "Could you spend ninety consecutive nights sleeping in a cold, muddy garden trench? Tell us your thoughts below!",
        mood: "day",
        imagePrompt: "Backyard rose bushes flowering on top of an earth-covered garden bunker under calm morning blue skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-anderson-shelter-backyard/6.png",
        audio: "audio/wwii-anderson-shelter-backyard/6.wav",
        voicedText: "Could you spend ninety consecutive nights sleeping in a cold, muddy garden trench? Tell us your thoughts below!",
        seconds: 6.9
      }
    ]
  }
];

console.log(`Writing ${BATCH_1_SCRIPTS.length} Batch 1 scripts to scripts-out/...`);
for (const s of BATCH_1_SCRIPTS) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Created scripts-out/${s.slug}.json`);
}

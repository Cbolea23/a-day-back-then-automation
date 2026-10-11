import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const EAST_ASIA_SCRIPTS = [
  // 1. Samurai Bushido Dark Truth
  {
    slug: "samurai-bushido-dark-truth",
    title: "The Dark Truth of Samurai Honor",
    hook: "Testing a new katana sword on random commoners was legal.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Modern pop culture portrays samurai as chivalrous, poetic warriors guided by a strict pacifist moral code.",
        mood: "warm",
        imagePrompt: "Peaceful Japanese Zen rock garden with raked white gravel and mossy stones under cherry blossom petals. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-bushido-dark-truth/1.png",
        audio: "audio/samurai-bushido-dark-truth/1.wav",
        voicedText: "Modern pop culture portrays samurai as chivalrous, poetic warriors guided by a strict pacifist moral code.",
        seconds: 7.2
      },
      {
        text: "In reality, during the Sengoku Civil War era, samurai were pragmatic, ruthless warlords whose loyalty was bought with land and gold.",
        mood: "dark",
        imagePrompt: "Stone courtyard of a Sengoku period Japanese fortress castle with wooden watchtowers and battle banners in twilight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-bushido-dark-truth/2.png",
        audio: "audio/samurai-bushido-dark-truth/2.wav",
        voicedText: "In reality, during the Sengoku Civil War era, samurai were pragmatic, ruthless warlords whose loyalty was bought with land and gold.",
        seconds: 7.6
      },
      {
        text: "They practiced 'tsujigiri' or 'crossroads cutting': testing the sharpness of a newly forged katana on unsuspecting travelers at dark crossroads.",
        mood: "dark",
        imagePrompt: "Dark misty dirt crossroads outside a Japanese village at night with a stone roadside Jizo statue in moonlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-bushido-dark-truth/3.png",
        audio: "audio/samurai-bushido-dark-truth/3.wav",
        voicedText: "They practiced 'tsujigiri' or 'crossroads cutting': testing the sharpness of a newly forged katana on unsuspecting travelers at dark crossroads.",
        seconds: 7.7
      },
      {
        text: "Furthermore, under the 'kiri-sute gomen' law, a samurai had the legal right to execute any peasant on the spot for perceived disrespect.",
        mood: "cool",
        imagePrompt: "Traditional Japanese village street with thatched roofs, wooden irrigation channels, and sliding rice-paper shoji doors. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-bushido-dark-truth/4.png",
        audio: "audio/samurai-bushido-dark-truth/4.wav",
        voicedText: "Furthermore, under the 'kiri-sute gomen' law, a samurai had the legal right to execute any peasant on the spot for perceived disrespect.",
        seconds: 7.5
      },
      {
        text: "The romantic 'Bushido' honor code was actually codified centuries later during peacetime Edo, long after large-scale sword battles had ceased.",
        mood: "warm",
        imagePrompt: "Lacquered wooden sword stand holding a katana and wakizashi beside an open calligraphy scroll and inkstone in a tatami room. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-bushido-dark-truth/5.png",
        audio: "audio/samurai-bushido-dark-truth/5.wav",
        voicedText: "The romantic 'Bushido' honor code was actually codified centuries later during peacetime Edo, long after large-scale sword battles had ceased.",
        seconds: 7.8
      },
      {
        text: "Did you believe samurai were always honorable protectors? Tell us below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Sunlight shining on a peaceful Japanese garden pond filled with swimming orange koi fish under weeping willow branches. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-bushido-dark-truth/6.png",
        audio: "audio/samurai-bushido-dark-truth/6.wav",
        voicedText: "Did you believe samurai were always honorable protectors? Tell us below and follow for daily history stories!",
        seconds: 7.0
      }
    ]
  },
  // 2. Ninja Poison and Disguises
  {
    slug: "ninja-poison-and-disguises",
    title: "Shinobi Masters of Disguise",
    hook: "Real ninjas rarely wore black pajamas—they dressed as monks and tea vendors.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In cinema, ninjas leap across rooftops wearing pitch-black hoods and masks, but in feudal Japan, that outfit would get you executed immediately.",
        mood: "cool",
        imagePrompt: "Rooftop of a Japanese feudal castle with curved grey clay tiles and a gargoyle shachihoko fish statue under twilight skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-poison-and-disguises/1.png",
        audio: "audio/ninja-poison-and-disguises/1.wav",
        voicedText: "In cinema, ninjas leap across rooftops wearing pitch-black hoods and masks, but in feudal Japan, that outfit would get you executed immediately.",
        seconds: 7.7
      },
      {
        text: "Historical shinobi relied on the 'Shichi-hō-de'—the Seven Disguises: wandering Buddhist priests, acrobats, farmers, and traveling merchants.",
        mood: "warm",
        imagePrompt: "Japanese traveling monk's woven wicker basket hat, wooden walking staff, and prayer beads resting on a tatami mat. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-poison-and-disguises/2.png",
        audio: "audio/ninja-poison-and-disguises/2.wav",
        voicedText: "Historical shinobi relied on the 'Shichi-hō-de'—the Seven Disguises: wandering Buddhist priests, acrobats, farmers, and traveling merchants.",
        seconds: 7.6
      },
      {
        text: "Dressed as street performers, they slipped freely past castle checkpoints, observing palace floorplans and counting guard rotations.",
        mood: "warm",
        imagePrompt: "Bustling Edo period castle town marketplace with wooden tea stalls, paper lanterns, and stone castle walls in the background. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-poison-and-disguises/3.png",
        audio: "audio/ninja-poison-and-disguises/3.wav",
        voicedText: "Dressed as street performers, they slipped freely past castle checkpoints, observing palace floorplans and counting guard rotations.",
        seconds: 7.4
      },
      {
        text: "Their weapons were ordinary farming tools: 'kunai' trowels for digging masonry, and iron sickles converted into concealed climbing claws.",
        mood: "dark",
        imagePrompt: "Iron garden trowel kunai blade, climbing claw spikes, and coiled hemp rope laid on rough wooden floorboards. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-poison-and-disguises/4.png",
        audio: "audio/ninja-poison-and-disguises/4.wav",
        voicedText: "Their weapons were ordinary farming tools: 'kunai' trowels for digging masonry, and iron sickles converted into concealed climbing claws.",
        seconds: 7.5
      },
      {
        text: "For silent assassinations, they poisoned water wells or coated needles in aconite wolfsbane toxin that induced heart attacks without leaving wounds.",
        mood: "dark",
        imagePrompt: "Small earthenware poison vial with bamboo dropper and dried purple monkshood flowers on an apothecary wooden workbench. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-poison-and-disguises/5.png",
        audio: "audio/ninja-poison-and-disguises/5.wav",
        voicedText: "For silent assassinations, they poisoned water wells or coated needles in aconite wolfsbane toxin that induced heart attacks without leaving wounds.",
        seconds: 7.8
      },
      {
        text: "Real ninjas were masters of social engineering and psychology! Would you have spotted a disguised shinobi?",
        mood: "day",
        imagePrompt: "Serene bamboo forest path in Kyoto with sunlight filtering through tall green stalks in a gentle breeze. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-poison-and-disguises/6.png",
        audio: "audio/ninja-poison-and-disguises/6.wav",
        voicedText: "Real ninjas were masters of social engineering and psychology! Would you have spotted a disguised shinobi?",
        seconds: 6.9
      }
    ]
  },
  // 3. Mongol Bow Deadly Range
  {
    slug: "mongol-bow-deadly-range",
    title: "The Deadliest Weapon of the Steppe",
    hook: "A Mongol composite bow pierced armor from 300 yards at full gallop.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "The engine that propelled the Mongol Empire from Beijing to the gates of Vienna was the revolutionary Mongol composite recurve bow.",
        mood: "warm",
        imagePrompt: "Endless windswept grassy Mongolian steppe under a vast turquoise sky with distant rolling hills and wild herds. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-bow-deadly-range/1.png",
        audio: "audio/mongol-bow-deadly-range/1.wav",
        voicedText: "The engine that propelled the Mongol Empire from Beijing to the gates of Vienna was the revolutionary Mongol composite recurve bow.",
        seconds: 7.5
      },
      {
        text: "Constructed over two years, its wooden core was layered with water buffalo horn on the belly and animal tendon sinew on the back.",
        mood: "warm",
        imagePrompt: "Steppe craftsman workshop with curved buffalo horns, bundles of dried sinew, fish glue pots, and wooden bow presses. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-bow-deadly-range/2.png",
        audio: "audio/mongol-bow-deadly-range/2.wav",
        voicedText: "Constructed over two years, its wooden core was layered with water buffalo horn on the belly and animal tendon sinew on the back.",
        seconds: 7.4
      },
      {
        text: "With a massive draw weight of up to 160 pounds, it hurled armor-piercing bodkin arrows over three hundred yards with devastating kinetic energy.",
        mood: "cool",
        imagePrompt: "Heavy iron-tipped armor-piercing bodkin arrows resting in an embroidered leather birchbark quiver on grass. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-bow-deadly-range/3.png",
        audio: "audio/mongol-bow-deadly-range/3.wav",
        voicedText: "With a massive draw weight of up to 160 pounds, it hurled armor-piercing bodkin arrows over three hundred yards with devastating kinetic energy.",
        seconds: 7.6
      },
      {
        text: "Mongol horse archers loosed arrows at the exact instant all four hooves of their horse left the ground during a full gallop for maximum accuracy.",
        mood: "dramatic",
        imagePrompt: "Leather Mongol horse saddle with high wooden pommel and birchbark stirrups resting on an open grassy meadow. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-bow-deadly-range/4.png",
        audio: "audio/mongol-bow-deadly-range/4.wav",
        voicedText: "Mongol horse archers loosed arrows at the exact instant all four hooves of their horse left the ground during a full gallop for maximum accuracy.",
        seconds: 7.8
      },
      {
        text: "They carried sixty arrows in specialized quivers, along with whistling signal arrows used by commanders to direct battlefield maneuvers.",
        mood: "warm",
        imagePrompt: "Bone-headed whistling signal arrow with hollow air whistle holes resting beside an archer's jade thumb ring on felt. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-bow-deadly-range/5.png",
        audio: "audio/mongol-bow-deadly-range/5.wav",
        voicedText: "They carried sixty arrows in specialized quivers, along with whistling signal arrows used by commanders to direct battlefield maneuvers.",
        seconds: 7.5
      },
      {
        text: "Could you draw a 160-pound bow while riding a galloping horse? Tell us below and subscribe for daily history stories!",
        mood: "day",
        imagePrompt: "Majestic circular felt yurt ger tent pitched under the vast azure sky of the Mongolian wilderness in morning sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-bow-deadly-range/6.png",
        audio: "audio/mongol-bow-deadly-range/6.wav",
        voicedText: "Could you draw a 160-pound bow while riding a galloping horse? Tell us below and subscribe for daily history stories!",
        seconds: 7.1
      }
    ]
  },
  // 4. Han Dynasty Crossbow Trigger
  {
    slug: "han-dynasty-crossbow-trigger",
    title: "China's Mass-Produced Bronze Crossbows",
    hook: "2,000 years ago, Han Dynasty armories mass-produced precision bronze triggers.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Two thousand years before the Industrial Revolution, the Han Dynasty of China pioneered precision mass-produced weapon components.",
        mood: "warm",
        imagePrompt: "Ancient Han Dynasty stone imperial armory courtyard with stacked timber weapon crates and military banners under sunny skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/han-dynasty-crossbow-trigger/1.png",
        audio: "audio/han-dynasty-crossbow-trigger/1.wav",
        voicedText: "Two thousand years before the Industrial Revolution, the Han Dynasty of China pioneered precision mass-produced weapon components.",
        seconds: 7.4
      },
      {
        text: "Their core infantry weapon was the repeating and heavy crossbow, powered by a three-piece cast bronze trigger mechanism.",
        mood: "cool",
        imagePrompt: "Intricately cast ancient bronze crossbow trigger lock mechanism showing sear lever, tumbler, and trigger hook on a workbench. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/han-dynasty-crossbow-trigger/2.png",
        audio: "audio/han-dynasty-crossbow-trigger/2.wav",
        voicedText: "Their core infantry weapon was the repeating and heavy crossbow, powered by a three-piece cast bronze trigger mechanism.",
        seconds: 7.4
      },
      {
        text: "Crafted in state foundries using standardized ceramic molds, the parts were completely interchangeable between hundreds of thousands of weapons.",
        mood: "warm",
        imagePrompt: "Foundry bronze casting table with clay mold halves, bronze filing tools, and finished trigger locks awaiting inspection. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/han-dynasty-crossbow-trigger/3.png",
        audio: "audio/han-dynasty-crossbow-trigger/3.wav",
        voicedText: "Crafted in state foundries using standardized ceramic molds, the parts were completely interchangeable between hundreds of thousands of weapons.",
        seconds: 7.7
      },
      {
        text: "If a soldier's trigger broke on the northern frontier, an armorer replaced the sear pin in seconds without custom metal filing.",
        mood: "cool",
        imagePrompt: "Fortress watchtower on the Han Great Wall of China overlooking misty northern frontier mountains under morning light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/han-dynasty-crossbow-trigger/4.png",
        audio: "audio/han-dynasty-crossbow-trigger/4.wav",
        voicedText: "If a soldier's trigger broke on the northern frontier, an armorer replaced the sear pin in seconds without custom metal filing.",
        seconds: 7.3
      },
      {
        text: "The trigger was so smooth that peasant conscripts required only three weeks of drill to pierce heavy nomad cavalry armor at two hundred paces.",
        mood: "dramatic",
        imagePrompt: "Wooden target dummy with iron lamellar armor pierced through by heavy bronze crossbow bolts on an army training field. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/han-dynasty-crossbow-trigger/5.png",
        audio: "audio/han-dynasty-crossbow-trigger/5.wav",
        voicedText: "The trigger was so smooth that peasant conscripts required only three weeks of drill to pierce heavy nomad cavalry armor at two hundred paces.",
        seconds: 7.7
      },
      {
        text: "China invented standardized interchangeable parts two millennia before Eli Whitney! Did you know about ancient Han technology?",
        mood: "day",
        imagePrompt: "Terracotta roof tile pavilion in Chang'an with blooming plum trees and stone lanterns glowing in serene morning sunshine. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/han-dynasty-crossbow-trigger/6.png",
        audio: "audio/han-dynasty-crossbow-trigger/6.wav",
        voicedText: "China invented standardized interchangeable parts two millennia before Eli Whitney! Did you know about ancient Han technology?",
        seconds: 7.1
      }
    ]
  }
];

console.log(`Writing initial 4 East Asia scripts...`);
for (const s of EAST_ASIA_SCRIPTS) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

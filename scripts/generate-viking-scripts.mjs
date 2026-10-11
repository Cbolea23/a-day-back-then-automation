import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const VIKING_SCRIPTS = [
  // 1. Viking Berserker Rage
  {
    slug: "viking-berserker-rage",
    title: "The Terrifying Norse Berserkers",
    hook: "Norse champions howled like wolves and bit their iron shield rims.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the Norse sagas, the most feared warriors on the battlefield were the 'Berserkers'—warriors consecrated to the god Odin.",
        mood: "dark",
        imagePrompt: "Moody misty Scandinavian fjord shore with wooden longships beached on grey pebble sands under dark stormy skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-berserker-rage/1.png",
        audio: "audio/viking-berserker-rage/1.wav",
        voicedText: "In the Norse sagas, the most feared warriors on the battlefield were the 'Berserkers'—warriors consecrated to the god Odin.",
        seconds: 7.4
      },
      {
        text: "Before battle commenced, berserkers whipped themselves into a state of frenzy called 'berserksgangr': foaming at the mouth and howling like wild wolves.",
        mood: "dramatic",
        imagePrompt: "Carved wooden dragon prow of a Norse longship looming through swirling sea mist and cold rain spray. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-berserker-rage/2.png",
        audio: "audio/viking-berserker-rage/2.wav",
        voicedText: "Before battle commenced, berserkers whipped themselves into a state of frenzy called 'berserksgangr': foaming at the mouth and howling like wild wolves.",
        seconds: 7.8
      },
      {
        text: "To channel animal spirits, they bit hard into the iron rims of their painted lime-wood round shields until their teeth cracked.",
        mood: "cool",
        imagePrompt: "Round wooden Viking battle shield painted red and black with iron boss and dented iron rim showing teeth scrape marks. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-berserker-rage/3.png",
        audio: "audio/viking-berserker-rage/3.wav",
        voicedText: "To channel animal spirits, they bit hard into the iron rims of their painted lime-wood round shields until their teeth cracked.",
        seconds: 7.5
      },
      {
        text: "They fought bare-chested or clad in wolf and bear pelts without chainmail armor, seemingly immune to cold and insensible to pain.",
        mood: "dark",
        imagePrompt: "Heavy grey wolf pelt cloak draped over an iron Viking broadaxe and bearded axe head resting on a wooden bench. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-berserker-rage/4.png",
        audio: "audio/viking-berserker-rage/4.wav",
        voicedText: "They fought bare-chested or clad in wolf and bear pelts without chainmail armor, seemingly immune to cold and insensible to pain.",
        seconds: 7.5
      },
      {
        text: "Historians theorize their trance came from adrenaline hysteria, ergot grain alkaloids, or hallucinogenic henbane seeds found in warrior graves.",
        mood: "warm",
        imagePrompt: "Small clay pouch of dried henbane seeds and dried medicinal roots resting beside an amber Odin amulet on fur. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-berserker-rage/5.png",
        audio: "audio/viking-berserker-rage/5.wav",
        voicedText: "Historians theorize their trance came from adrenaline hysteria, ergot grain alkaloids, or hallucinogenic henbane seeds found in warrior graves.",
        seconds: 7.8
      },
      {
        text: "Would you have stood in a shield wall facing a howling berserker? Tell us your thoughts below and subscribe!",
        mood: "day",
        imagePrompt: "Sunlight breaking through storm clouds over dramatic Norwegian mountain fjords with evergreen pine forests. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-berserker-rage/6.png",
        audio: "audio/viking-berserker-rage/6.wav",
        voicedText: "Would you have stood in a shield wall facing a howling berserker? Tell us your thoughts below and subscribe!",
        seconds: 7.0
      }
    ]
  },
  // 2. Viking Hygiene Secrets
  {
    slug: "viking-hygiene-secrets",
    title: "Vikings Were Cleaner Than the English",
    hook: "English monks complained that Norse raiders bathed every Saturday.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Movies portray Vikings as filthy savages covered in mud and grime, but historical records prove the exact opposite was true.",
        mood: "warm",
        imagePrompt: "Cozy wooden Norse longhouse interior with glowing hearth fire, woven textiles, and clean timber beams in soft light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/1.png",
        audio: "audio/viking-hygiene-secrets/1.wav",
        voicedText: "Movies portray Vikings as filthy savages covered in mud and grime, but historical records prove the exact opposite was true.",
        seconds: 7.3
      },
      {
        text: "Archaeologists dig up personal grooming kits in almost every Viking grave: carved bone hair combs, tweezers, ear spoons, and toothpicks.",
        mood: "warm",
        imagePrompt: "Set of polished carved bone grooming tools: double-sided lice comb, bronze tweezers, and miniature ear spoon in a leather pouch. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/2.png",
        audio: "audio/viking-hygiene-secrets/2.wav",
        voicedText: "Archaeologists dig up personal grooming kits in almost every Viking grave: carved bone hair combs, tweezers, ear spoons, and toothpicks.",
        seconds: 7.6
      },
      {
        text: "While Anglo-Saxon peasants rarely washed, Vikings had a mandatory weekly bath day every Saturday called 'Laugardagur'—literally 'Washing Day'.",
        mood: "cool",
        imagePrompt: "Natural outdoor Scandinavian geothermal hot spring steaming peacefully amidst snow-dusted volcanic rocks in early morning. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/3.png",
        audio: "audio/viking-hygiene-secrets/3.wav",
        voicedText: "While Anglo-Saxon peasants rarely washed, Vikings had a mandatory weekly bath day every Saturday called 'Laugardagur'—literally 'Washing Day'.",
        seconds: 7.7
      },
      {
        text: "Norse men washed their faces every morning, changed into fresh linen undergarments regularly, and combed their beards after every meal.",
        mood: "cool",
        imagePrompt: "Wooden wash bucket with clean well water, carved horn comb, and a cake of lye soap resting on a timber bench. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/4.png",
        audio: "audio/viking-hygiene-secrets/4.wav",
        voicedText: "Norse men washed their faces every morning, changed into fresh linen undergarments regularly, and combed their beards after every meal.",
        seconds: 7.5
      },
      {
        text: "An English chronicler lamented that Viking men were so clean and sweet-smelling that local English women found them irresistibly attractive.",
        mood: "warm",
        imagePrompt: "Village garden path in Anglo-Saxon England with stone well, flowering clover, and wooden fences under warm afternoon sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/5.png",
        audio: "audio/viking-hygiene-secrets/5.wav",
        voicedText: "An English chronicler lamented that Viking men were so clean and sweet-smelling that local English women found them irresistibly attractive.",
        seconds: 7.6
      },
      {
        text: "Vikings were the most hygienic culture in medieval northern Europe! Did you think they were dirty raiders?",
        mood: "day",
        imagePrompt: "Clear sunny blue sky over a Scandinavian shoreline with wildflowers blooming beside calm blue fjord waters. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/6.png",
        audio: "audio/viking-hygiene-secrets/6.wav",
        voicedText: "Vikings were the most hygienic culture in medieval northern Europe! Did you think they were dirty raiders?",
        seconds: 6.9
      }
    ]
  },
  // 3. Viking Sunstone Navigation
  {
    slug: "viking-sunstone-navigation",
    title: "Navigating Oceans with Magic Sunstones",
    hook: "Vikings crossed the foggy Atlantic using calcite crystals.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Centuries before magnetic compasses reached Europe, Norse explorers navigated thousands of open ocean miles to Iceland, Greenland, and Canada.",
        mood: "cool",
        imagePrompt: "Open North Atlantic ocean with rolling grey waves and thick sea fog obscuring the horizon under gloomy skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/1.png",
        audio: "audio/viking-sunstone-navigation/1.wav",
        voicedText: "Centuries before magnetic compasses reached Europe, Norse explorers navigated thousands of open ocean miles to Iceland, Greenland, and Canada.",
        seconds: 7.6
      },
      {
        text: "In the Arctic, perpetual cloud cover, dense summer fogs, and midnight sun made navigating by stars or sun shadows impossible.",
        mood: "cool",
        imagePrompt: "Dense coastal fog hanging over jagged Arctic sea cliffs with sea spray mist blowing across the bow of a wooden ship. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/2.png",
        audio: "audio/viking-sunstone-navigation/2.wav",
        voicedText: "In the Arctic, perpetual cloud cover, dense summer fogs, and midnight sun made navigating by stars or sun shadows impossible.",
        seconds: 7.4
      },
      {
        text: "Norse sagas describe navigators holding a 'sólarsteinn'—a magical sunstone—up to grey overcast skies to locate the hidden sun.",
        mood: "cool",
        imagePrompt: "Close-up of a rhomboid Iceland spar calcite crystal glowing with refracted polarized light on a ship's gunwale timber. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/3.png",
        audio: "audio/viking-sunstone-navigation/3.wav",
        voicedText: "Norse sagas describe navigators holding a 'sólarsteinn'—a magical sunstone—up to grey overcast skies to locate the hidden sun.",
        seconds: 7.5
      },
      {
        text: "Scientists discovered the sunstone was Iceland spar: a transparent optical calcite crystal that polarizes natural sunlight.",
        mood: "warm",
        imagePrompt: "Sunlight splitting into two distinct refractive beams through a polished transparent calcite optical prism on a chart table. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/4.png",
        audio: "audio/viking-sunstone-navigation/4.wav",
        voicedText: "Scientists discovered the sunstone was Iceland spar: a transparent optical calcite crystal that polarizes natural sunlight.",
        seconds: 7.3
      },
      {
        text: "By rotating the crystal until double-refracted light beams match in brightness, navigators pinpointed the sun's exact position behind thick storm clouds.",
        mood: "cool",
        imagePrompt: "Wooden sundial compass disc carved with directional notches resting on an animal pelt on a longship bench. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/5.png",
        audio: "audio/viking-sunstone-navigation/5.wav",
        voicedText: "By rotating the crystal until double-refracted light beams match in brightness, navigators pinpointed the sun's exact position behind thick storm clouds.",
        seconds: 7.8
      },
      {
        text: "This crystal optical trick allowed Vikings to discover America 500 years before Columbus! Could you navigate with a crystal?",
        mood: "day",
        imagePrompt: "Sunlight breaking through grey Atlantic clouds illuminating the green coastline of Newfoundland in the distance. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/6.png",
        audio: "audio/viking-sunstone-navigation/6.wav",
        voicedText: "This crystal optical trick allowed Vikings to discover America 500 years before Columbus! Could you navigate with a crystal?",
        seconds: 7.1
      }
    ]
  }
];

console.log(`Writing initial 3 Viking scripts...`);
for (const s of VIKING_SCRIPTS) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

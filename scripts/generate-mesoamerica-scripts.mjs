import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const MESOAMERICA_SCRIPTS = [
  // 1. Aztec Chocolate Currency
  {
    slug: "aztec-chocolate-currency",
    title: "When Money Grew on Trees in Tenochtitlan",
    hook: "In the Aztec empire, cacao beans were official legal tender.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the bustling capital of Tenochtitlan, people didn't trade using coins of silver or gold—they paid in chocolate.",
        mood: "warm",
        imagePrompt: "Vibrant bustling Aztec market stall in Tenochtitlan under woven awnings with woven baskets overflowing with dried brown cacao beans. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-chocolate-currency/1.png",
        audio: "audio/aztec-chocolate-currency/1.wav",
        voicedText: "In the bustling capital of Tenochtitlan, people didn't trade using coins of silver or gold—they paid in chocolate.",
        seconds: 7.2
      },
      {
        text: "Dried cacao beans were official legal currency: one bean bought a fresh ripe avocado, three bought a tamale, and one hundred bought a fine mantle.",
        mood: "warm",
        imagePrompt: "Close-up of dried cacao beans resting in an engraved ceramic clay bowl beside fresh green avocados and ears of golden maize. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-chocolate-currency/2.png",
        audio: "audio/aztec-chocolate-currency/2.wav",
        voicedText: "Dried cacao beans were official legal currency: one bean bought a fresh ripe avocado, three bought a tamale, and one hundred bought a fine mantle.",
        seconds: 7.7
      },
      {
        text: "Because money literally grew on trees, counterfeiters emerged: scoundrels emptied real cacao shells, filled them with dirt, and glued them shut.",
        mood: "dark",
        imagePrompt: "Dimly lit stone workshop table with cracked cacao pods, fine brown river clay, and obsidian blades used for crafting fake beans. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-chocolate-currency/3.png",
        audio: "audio/aztec-chocolate-currency/3.wav",
        voicedText: "Because money literally grew on trees, counterfeiters emerged: scoundrels emptied real cacao shells, filled them with dirt, and glued them shut.",
        seconds: 7.6
      },
      {
        text: "Market judges tested suspicious beans by squeezing them between their fingers to check for hollow crunching sounds.",
        mood: "warm",
        imagePrompt: "Open sunlit market pavilion in Tlatelolco with wooden inspection scales and clay counting tokens on a woven reed mat. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-chocolate-currency/4.png",
        audio: "audio/aztec-chocolate-currency/4.wav",
        voicedText: "Market judges tested suspicious beans by squeezing them between their fingers to check for hollow crunching sounds.",
        seconds: 7.2
      },
      {
        text: "Nobles enjoyed drinking their wealth: frothed spicy chocolate whipped with chili peppers, vanilla orchids, and wild bees honey.",
        mood: "warm",
        imagePrompt: "Carved polychrome Aztec ceramic drinking vessel filled with rich frothy dark chocolate foam garnished with red chili powder. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-chocolate-currency/5.png",
        audio: "audio/aztec-chocolate-currency/5.wav",
        voicedText: "Nobles enjoyed drinking their wealth: frothed spicy chocolate whipped with chili peppers, vanilla orchids, and wild bees honey.",
        seconds: 7.5
      },
      {
        text: "Would you spend your chocolate beans on dinner, or drink your bank account? Tell us below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Panoramic view of Tenochtitlan pyramid temples and Lake Texcoco shining under golden late afternoon sunshine. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-chocolate-currency/6.png",
        audio: "audio/aztec-chocolate-currency/6.wav",
        voicedText: "Would you spend your chocolate beans on dinner, or drink your bank account? Tell us below and follow for daily history stories!",
        seconds: 7.1
      }
    ]
  },
  // 2. Aztec Macuahuitl Sword
  {
    slug: "aztec-macuahuitl-sword",
    title: "The Obsidian Razor Sword",
    hook: "An oak club lined with volcanic glass so sharp it beheaded a horse.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "The primary close-quarters weapon of elite Aztec warriors was the 'macuahuitl': a flat hardwood club edged with volcanic glass.",
        mood: "warm",
        imagePrompt: "Aztec warrior armory room with heavy oak macuahuitl swords resting against stone temple walls beside feather shields. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-macuahuitl-sword/1.png",
        audio: "audio/aztec-macuahuitl-sword/1.wav",
        voicedText: "The primary close-quarters weapon of elite Aztec warriors was the 'macuahuitl': a flat hardwood club edged with volcanic glass.",
        seconds: 7.4
      },
      {
        text: "Crafted from dense mountain oak, grooves along both sides held rows of razor-sharp prismatic blades flaked from black volcanic obsidian.",
        mood: "dark",
        imagePrompt: "Close-up of pitch-black volcanic obsidian razor blades fitted into carved grooves of a polished dark oak war club. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-macuahuitl-sword/2.png",
        audio: "audio/aztec-macuahuitl-sword/2.wav",
        voicedText: "Crafted from dense mountain oak, grooves along both sides held rows of razor-sharp prismatic blades flaked from black volcanic obsidian.",
        seconds: 7.6
      },
      {
        text: "Obsidian fractures down to a single molecule thick—hundreds of times sharper than the finest European steel surgical scalpels.",
        mood: "cool",
        imagePrompt: "Stonemason's workbench with raw black obsidian volcanic nodules, deer antler pressure flakers, and tree resin glue pots. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-macuahuitl-sword/3.png",
        audio: "audio/aztec-macuahuitl-sword/3.wav",
        voicedText: "Obsidian fractures down to a single molecule thick—hundreds of times sharper than the finest European steel surgical scalpels.",
        seconds: 7.3
      },
      {
        text: "Spanish conquistadors recorded with terror that a single full-force blow from a macuahuitl could sever a Spanish warhorse's neck clean off.",
        mood: "dramatic",
        imagePrompt: "Battlefield causeway stone paving slabs littered with spent copper arrowheads, shattered shields, and dust swirling in sunset light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-macuahuitl-sword/4.png",
        audio: "audio/aztec-macuahuitl-sword/4.wav",
        voicedText: "Spanish conquistadors recorded with terror that a single full-force blow from a macuahuitl could sever a Spanish warhorse's neck clean off.",
        seconds: 7.6
      },
      {
        text: "However, obsidian was brittle: striking steel armor shattered the glass edges, while European rapier swords could parry without breaking.",
        mood: "cool",
        imagePrompt: "Broken obsidian glass shards glistening on a weathered stone plaza floor beside a dented steel Spanish morion helmet. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-macuahuitl-sword/5.png",
        audio: "audio/aztec-macuahuitl-sword/5.wav",
        voicedText: "However, obsidian was brittle: striking steel armor shattered the glass edges, while European rapier swords could parry without breaking.",
        seconds: 7.5
      },
      {
        text: "Would you rather wield an obsidian macuahuitl or a steel broadsword in battle? Tell us your choice below!",
        mood: "day",
        imagePrompt: "Sunlit stone platform atop a Mesoamerican pyramid temple with ceremonial brazier smoke curling into a pure turquoise sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-macuahuitl-sword/6.png",
        audio: "audio/aztec-macuahuitl-sword/6.wav",
        voicedText: "Would you rather wield an obsidian macuahuitl or a steel broadsword in battle? Tell us your choice below!",
        seconds: 7.0
      }
    ]
  },
  // 3. Maya Astronomy Calendar
  {
    slug: "maya-astronomy-calendar",
    title: "How the Maya Tracked Venus Without Telescopes",
    hook: "Maya astronomers calculated Venus orbits to within two hours of modern NASA clocks.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Deep in the Mesoamerican rainforest, ancient Maya priest-astronomers turned temple towers into precision celestial observatories.",
        mood: "cool",
        imagePrompt: "Carved stone Maya observatory temple tower rising above dense jungle canopy with viewing slits oriented toward the night sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-astronomy-calendar/1.png",
        audio: "audio/maya-astronomy-calendar/1.wav",
        voicedText: "Deep in the Mesoamerican rainforest, ancient Maya priest-astronomers turned temple towers into precision celestial observatories.",
        seconds: 7.4
      },
      {
        text: "Without optical glass lenses or metal instruments, they tracked celestial bodies using simple crossed wooden sighting sticks.",
        mood: "night",
        imagePrompt: "Crossed wooden sighting sticks aligned through a stone masonry window aperture targeting a brilliant glowing morning star. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-astronomy-calendar/2.png",
        audio: "audio/maya-astronomy-calendar/2.wav",
        voicedText: "Without optical glass lenses or metal instruments, they tracked celestial bodies using simple crossed wooden sighting sticks.",
        seconds: 7.2
      },
      {
        text: "Their primary obsession was Venus: calculated as having a synodic cycle of 583.92 days—matching modern atomic clock measurements within hours.",
        mood: "night",
        imagePrompt: "Deep blue night sky with millions of stars and the radiant morning star Venus glowing intensely over Maya pyramid silhouettes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-astronomy-calendar/3.png",
        audio: "audio/maya-astronomy-calendar/3.wav",
        voicedText: "Their primary obsession was Venus: calculated as having a synodic cycle of 583.92 days—matching modern atomic clock measurements within hours.",
        seconds: 7.7
      },
      {
        text: "Venus was viewed as the fierce herald of war; kings scheduled military invasions and coronation rites around its morning rise.",
        mood: "warm",
        imagePrompt: "Bark-paper accordion folding Maya codex manuscript open on a cedar table displaying red and black hieroglyphic astronomical tables. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-astronomy-calendar/4.png",
        audio: "audio/maya-astronomy-calendar/4.wav",
        voicedText: "Venus was viewed as the fierce herald of war; kings scheduled military invasions and coronation rites around its morning rise.",
        seconds: 7.4
      },
      {
        text: "Their calendar interlocked the 260-day sacred count with the 365-day solar year, creating a 52-year cycle where time itself seemed to loop.",
        mood: "warm",
        imagePrompt: "Monumental circular carved stone calendar wheel covered in intricate Maya hieroglyphic date cartouches in golden light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-astronomy-calendar/5.png",
        audio: "audio/maya-astronomy-calendar/5.wav",
        voicedText: "Their calendar interlocked the 260-day sacred count with the 365-day solar year, creating a 52-year cycle where time itself seemed to loop.",
        seconds: 7.7
      },
      {
        text: "Could you calculate planetary orbits using only stone viewing slits? Let us know below and subscribe!",
        mood: "day",
        imagePrompt: "Morning tropical mist clearing over the limestone temples of Tikal surrounded by towering emerald rainforest trees. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-astronomy-calendar/6.png",
        audio: "audio/maya-astronomy-calendar/6.wav",
        voicedText: "Could you calculate planetary orbits using only stone viewing slits? Let us know below and subscribe!",
        seconds: 6.9
      }
    ]
  }
];

console.log(`Writing initial 3 Mesoamerica scripts...`);
for (const s of MESOAMERICA_SCRIPTS) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

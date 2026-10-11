import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const VICTORIAN_SCRIPTS = [
  // 1. Victorian Mudlark Job
  {
    slug: "victorian-mudlark-job",
    title: "Scavenging for Coins in River Sewage",
    hook: "Poor Victorian kids waded through raw river sewage for pennies.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In Victorian London, impoverished children called 'mudlarks' survived by scavenging the muddy banks of the River Thames at low tide.",
        mood: "cool",
        imagePrompt: "Muddy, misty banks of the River Thames in Victorian London with low tide revealing wooden dock pilings and river sludge. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-mudlark-job/1.png",
        audio: "audio/victorian-mudlark-job/1.wav",
        voicedText: "In Victorian London, impoverished children called 'mudlarks' survived by scavenging the muddy banks of the River Thames at low tide.",
        seconds: 7.4
      },
      {
        text: "Barefoot and dressed in ragged burlap, they waded knee-deep through freezing black mud filled with raw sewage and industrial runoff.",
        mood: "cool",
        imagePrompt: "Wet cobblestone river stairs covered in green slime leading into murky brown river water beside stone bridges. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-mudlark-job/2.png",
        audio: "audio/victorian-mudlark-job/2.wav",
        voicedText: "Barefoot and dressed in ragged burlap, they waded knee-deep through freezing black mud filled with raw sewage and industrial runoff.",
        seconds: 7.6
      },
      {
        text: "They hunted for anything saleable: dropped copper pennies, pieces of coal, rusted iron nails, old bones, and rope fibers.",
        mood: "warm",
        imagePrompt: "Crude tin collecting can resting in mud containing a few verdigris-covered copper pennies, an iron nail, and beef bones. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-mudlark-job/3.png",
        audio: "audio/victorian-mudlark-job/3.wav",
        voicedText: "They hunted for anything saleable: dropped copper pennies, pieces of coal, rusted iron nails, old bones, and rope fibers.",
        seconds: 7.5
      },
      {
        text: "Hidden danger lurked everywhere: jagged broken glass, drowned carcasses, and sudden incoming tides that trapped children against river walls.",
        mood: "dark",
        imagePrompt: "High granite embankment wall of the Thames river with rising dark water swirling around iron mooring rings. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-mudlark-job/4.png",
        audio: "audio/victorian-mudlark-job/4.wav",
        voicedText: "Hidden danger lurked everywhere: jagged broken glass, drowned carcasses, and sudden incoming tides that trapped children against river walls.",
        seconds: 7.7
      },
      {
        text: "A lucky mudlark made barely three pennies a day—just enough to buy a crust of stale bread and a night in a lodging house.",
        mood: "warm",
        imagePrompt: "Dark London rag-and-bone shop counter with brass balance scales, empty bottles, and heaps of discarded scrap iron. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-mudlark-job/5.png",
        audio: "audio/victorian-mudlark-job/5.wav",
        voicedText: "A lucky mudlark made barely three pennies a day—just enough to buy a crust of stale bread and a night in a lodging house.",
        seconds: 7.4
      },
      {
        text: "Could you have scavenged bare-handed in Victorian sewage for three pence? Let us know below and subscribe!",
        mood: "day",
        imagePrompt: "Misty Victorian London skyline with steam tugboats on the Thames and St Paul's Cathedral dome rising in the morning sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-mudlark-job/6.png",
        audio: "audio/victorian-mudlark-job/6.wav",
        voicedText: "Could you have scavenged bare-handed in Victorian sewage for three pence? Let us know below and subscribe!",
        seconds: 6.9
      }
    ]
  },
  // 2. Victorian Arsenic Green Wallpaper
  {
    slug: "victorian-arsenic-green-wallpaper",
    title: "The Deadly Green Wallpaper of Victorian Homes",
    hook: "Vibrant emerald green wallpaper poisoned families in their sleep.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the 1850s, Victorian homeowners obsessed over a dazzling, vivid shade of emerald called 'Scheele's Green'.",
        mood: "warm",
        imagePrompt: "Opulent Victorian drawing room with walls covered in ornate emerald-green floral pattern wallpaper and dark mahogany furniture. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-arsenic-green-wallpaper/1.png",
        audio: "audio/victorian-arsenic-green-wallpaper/1.wav",
        voicedText: "In the 1850s, Victorian homeowners obsessed over a dazzling, vivid shade of emerald called 'Scheele's Green'.",
        seconds: 7.2
      },
      {
        text: "It decorated fashionable parlor wallpapers, evening ball gowns, children's toys, and even dyed sugar cake confections.",
        mood: "warm",
        imagePrompt: "Victorian lady's dressing table with a brilliant green dyed silk ribbon, glass perfume atomizers, and silver hand mirror. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-arsenic-green-wallpaper/2.png",
        audio: "audio/victorian-arsenic-green-wallpaper/2.wav",
        voicedText: "It decorated fashionable parlor wallpapers, evening ball gowns, children's toys, and even dyed sugar cake confections.",
        seconds: 7.4
      },
      {
        text: "Unbeknownst to buyers, the secret ingredient producing that brilliant color was copper arsenite: pure, lethal arsenic.",
        mood: "dark",
        imagePrompt: "Victorian chemist's mortar and pestle grinding bright green pigment powder beside an amber bottle marked with a poison skull. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-arsenic-green-wallpaper/3.png",
        audio: "audio/victorian-arsenic-green-wallpaper/3.wav",
        voicedText: "Unbeknownst to buyers, the secret ingredient producing that brilliant color was copper arsenite: pure, lethal arsenic.",
        seconds: 7.4
      },
      {
        text: "In damp London rooms, common household fungus reacted with the wallpaper paste, releasing odorless toxic arsine gas into bedrooms.",
        mood: "dark",
        imagePrompt: "Shadowy Victorian four-poster bed draped in velvet curtains against green damask wallpaper in a dimly candle-lit chamber. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-arsenic-green-wallpaper/4.png",
        audio: "audio/victorian-arsenic-green-wallpaper/4.wav",
        voicedText: "In damp London rooms, common household fungus reacted with the wallpaper paste, releasing odorless toxic arsine gas into bedrooms.",
        seconds: 7.7
      },
      {
        text: "Entire families mysteriously wasted away with vomiting, agonizing stomach cramps, and organ failure while sleeping in their luxurious rooms.",
        mood: "cool",
        imagePrompt: "Doctor's black leather medical bag open on an oval bedside table with glass vials and tincture of opium bottles. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-arsenic-green-wallpaper/5.png",
        audio: "audio/victorian-arsenic-green-wallpaper/5.wav",
        voicedText: "Entire families mysteriously wasted away with vomiting, agonizing stomach cramps, and organ failure while sleeping in their luxurious rooms.",
        seconds: 7.6
      },
      {
        text: "It took decades before governments banned the deadly pigment. Would you have fallen for the emerald green trend?",
        mood: "day",
        imagePrompt: "Sunlit bay window in a Victorian parlor overlooking a tidy London garden square with cast-iron railings. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-arsenic-green-wallpaper/6.png",
        audio: "audio/victorian-arsenic-green-wallpaper/6.wav",
        voicedText: "It took decades before governments banned the deadly pigment. Would you have fallen for the emerald green trend?",
        seconds: 6.8
      }
    ]
  },
  // 3. Victorian Phossy Jaw Matchgirls
  {
    slug: "victorian-phossy-jaw-matchgirls",
    title: "The Match Factory Girls of London",
    hook: "Teenage factory girls breathed fumes until their jawbones glowed.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In 1888, the Bryant & May match factory in East London employed thousands of poor young girls working fourteen-hour days.",
        mood: "cool",
        imagePrompt: "Industrial brick factory interior in Victorian London with massive rows of workbenches and dusty gas lamps overhead. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-phossy-jaw-matchgirls/1.png",
        audio: "audio/victorian-phossy-jaw-matchgirls/1.wav",
        voicedText: "In 1888, the Bryant & May match factory in East London employed thousands of poor young girls working fourteen-hour days.",
        seconds: 7.3
      },
      {
        text: "They dipped thousands of wooden match splints into steaming vats of hot white phosphorus paste without masks or ventilation.",
        mood: "warm",
        imagePrompt: "Steaming iron vat filled with bubbling yellow phosphorus chemical paste beside stacks of wooden matchstick splints. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-phossy-jaw-matchgirls/2.png",
        audio: "audio/victorian-phossy-jaw-matchgirls/2.wav",
        voicedText: "They dipped thousands of wooden match splints into steaming vats of hot white phosphorus paste without masks or ventilation.",
        seconds: 7.5
      },
      {
        text: "Constant exposure caused a horrifying occupational disease called 'phossy jaw': toxic fumes seeped into teeth, rotting the lower jawbone.",
        mood: "dark",
        imagePrompt: "Medical laboratory table with anatomical jaw diagrams, antique dental forceps, and an amber glass medicine jar. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-phossy-jaw-matchgirls/3.png",
        audio: "audio/victorian-phossy-jaw-matchgirls/3.wav",
        voicedText: "Constant exposure caused a horrifying occupational disease called 'phossy jaw': toxic fumes seeped into teeth, rotting the lower jawbone.",
        seconds: 7.7
      },
      {
        text: "In dark bedrooms, the rotting infected jawbone literally glowed with greenish-white bioluminescent light.",
        mood: "dark",
        imagePrompt: "Dimly lit garret bedroom corner with faint greenish phosphorescent glow reflecting softly on bare floorboards in moonlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-phossy-jaw-matchgirls/4.png",
        audio: "audio/victorian-phossy-jaw-matchgirls/4.wav",
        voicedText: "In dark bedrooms, the rotting infected jawbone literally glowed with greenish-white bioluminescent light.",
        seconds: 7.2
      },
      {
        text: "In 1888, 1,400 brave matchgirls walked out on strike, winning safe working conditions and igniting the British labor union movement.",
        mood: "warm",
        imagePrompt: "Cobblestone street outside factory gates with printed strike placards leaning against brick walls in morning light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-phossy-jaw-matchgirls/5.png",
        audio: "audio/victorian-phossy-jaw-matchgirls/5.wav",
        voicedText: "In 1888, 1,400 brave matchgirls walked out on strike, winning safe working conditions and igniting the British labor union movement.",
        seconds: 7.6
      },
      {
        text: "Their historic victory banned white phosphorus matches forever. Did you know about the matchgirl heroes of London?",
        mood: "day",
        imagePrompt: "Clean wooden writing desk with a modern box of red-tipped safety matches sitting peacefully in afternoon sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-phossy-jaw-matchgirls/6.png",
        audio: "audio/victorian-phossy-jaw-matchgirls/6.wav",
        voicedText: "Their historic victory banned white phosphorus matches forever. Did you know about the matchgirl heroes of London?",
        seconds: 6.9
      }
    ]
  }
];

console.log(`Writing initial Victorian scripts...`);
for (const s of VICTORIAN_SCRIPTS) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

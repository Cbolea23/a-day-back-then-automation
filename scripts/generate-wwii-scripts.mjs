import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const BATCH_1_REMAINING = [
  // 9. WWII Women's Land Army
  {
    slug: "wwii-women-land-army",
    title: "Women's Land Army: Feeding a Nation",
    hook: "City girls took over heavy farm plows to save Britain.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "With hundreds of thousands of male farm workers drafted into the military, British agriculture faced total collapse.",
        mood: "cool",
        imagePrompt: "Rolling green English agricultural countryside with stone dry-stack walls under cloudy skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-women-land-army/1.png",
        audio: "audio/wwii-women-land-army/1.wav",
        voicedText: "With hundreds of thousands of male farm workers drafted into the military, British agriculture faced total collapse.",
        seconds: 7.2
      },
      {
        text: "Eighty thousand women volunteered for the Women's Land Army, swapping office desks and shop counters for heavy rubber gumboots.",
        mood: "warm",
        imagePrompt: "Muddy stone farmyard with a wooden hay rake, iron milk churns, and a pair of tall Wellington boots by a rustic barn door. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-women-land-army/2.png",
        audio: "audio/wwii-women-land-army/2.wav",
        voicedText: "Eighty thousand women volunteered for the Women's Land Army, swapping office desks and shop counters for heavy rubber gumboots.",
        seconds: 7.5
      },
      {
        text: "They worked fifty-hour weeks milking stubborn cows before dawn, catching destructive rats, and digging drainage ditches in freezing rain.",
        mood: "cool",
        imagePrompt: "Interior of an old timber cow barn with wooden stalls, clean golden straw, and tin lanterns hanging from rafters. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-women-land-army/3.png",
        audio: "audio/wwii-women-land-army/3.wav",
        voicedText: "They worked fifty-hour weeks milking stubborn cows before dawn, catching destructive rats, and digging drainage ditches in freezing rain.",
        seconds: 7.4
      },
      {
        text: "City women who had never touched machinery learned to steer heavy iron Fordson tractors across rocky hillsides.",
        mood: "day",
        imagePrompt: "Vintage 1940s Fordson iron tractor with spoked wheels parked in a freshly tilled brown earth field. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-women-land-army/4.png",
        audio: "audio/wwii-women-land-army/4.wav",
        voicedText: "City women who had never touched machinery learned to steer heavy iron Fordson tractors across rocky hillsides.",
        seconds: 6.9
      },
      {
        text: "Thanks to the 'Land Girls', Britain doubled its domestic food output, ensuring the country never starved during blockade years.",
        mood: "warm",
        imagePrompt: "Golden wheat field in full harvest under warm sunshine with stooks of grain tied with twine. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-women-land-army/5.png",
        audio: "audio/wwii-women-land-army/5.wav",
        voicedText: "Thanks to the 'Land Girls', Britain doubled its domestic food output, ensuring the country never starved during blockade years.",
        seconds: 7.1
      },
      {
        text: "Could you trade city life for 5 AM winter mornings in a muddy barn? Let us know below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Charming English countryside lane with stone cottage and blooming elderflower bushes under morning sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-women-land-army/6.png",
        audio: "audio/wwii-women-land-army/6.wav",
        voicedText: "Could you trade city life for 5 AM winter mornings in a muddy barn? Let us know below and follow for daily history stories!",
        seconds: 7.0
      }
    ]
  },
  // 10. WWII Fake Coffee and Mock Banana
  {
    slug: "wwii-fake-coffee-and-mock-banana",
    title: "Mock Bananas and Acorn Coffee",
    hook: "Boiled parsnips with banana essence fooled British kids.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "During wartime rationing, exotic imported fruits completely vanished from British grocery store shelves for over five years.",
        mood: "cool",
        imagePrompt: "1940s traditional wooden grocery storefront with empty wicker fruit crates in the window under soft morning light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-fake-coffee-and-mock-banana/1.png",
        audio: "audio/wwii-fake-coffee-and-mock-banana/1.wav",
        voicedText: "During wartime rationing, exotic imported fruits completely vanished from British grocery store shelves for over five years.",
        seconds: 7.3
      },
      {
        text: "Most children born during the war had never seen a real yellow banana, only hearing rumors of the mythical fruit from their parents.",
        mood: "warm",
        imagePrompt: "Rustic wooden kitchen counter with a ceramic mixing bowl, wooden spoon, and a recipe booklet from the Ministry of Food. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-fake-coffee-and-mock-banana/2.png",
        audio: "audio/wwii-fake-coffee-and-mock-banana/2.wav",
        voicedText: "Most children born during the war had never seen a real yellow banana, only hearing rumors of the mythical fruit from their parents.",
        seconds: 7.2
      },
      {
        text: "Clever mothers invented 'Mock Banana': boiling root parsnips until soft, mashing them with sugar and drops of artificial banana essence.",
        mood: "warm",
        imagePrompt: "Enameled vintage saucepan with yellow parsnip mash beside a tiny amber bottle of baker's essence on a checked tablecloth. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-fake-coffee-and-mock-banana/3.png",
        audio: "audio/wwii-fake-coffee-and-mock-banana/3.wav",
        voicedText: "Clever mothers invented 'Mock Banana': boiling root parsnips until soft, mashing them with sugar and drops of artificial banana essence.",
        seconds: 7.6
      },
      {
        text: "Coffee lovers drank roasted chicory root or toasted roasted acorns ground into bitter brown powder.",
        mood: "dark",
        imagePrompt: "Cast-iron vintage hand coffee grinder with roasted brown chicory roots and acorns on a wooden kitchen workbench. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-fake-coffee-and-mock-banana/4.png",
        audio: "audio/wwii-fake-coffee-and-mock-banana/4.wav",
        voicedText: "Coffee lovers drank roasted chicory root or toasted roasted acorns ground into bitter brown powder.",
        seconds: 6.9
      },
      {
        text: "Meanwhile, 'National Wheatmeal Bread' was heavy, grey, and legally banned from being sold until a day old to curb binge eating.",
        mood: "cool",
        imagePrompt: "Dense loaf of greyish wartime wheat bread sliced on a wooden board beside a bread knife on an enamel kitchen tabletop. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-fake-coffee-and-mock-banana/5.png",
        audio: "audio/wwii-fake-coffee-and-mock-banana/5.wav",
        voicedText: "Meanwhile, 'National Wheatmeal Bread' was heavy, grey, and legally banned from being sold until a day old to curb binge eating.",
        seconds: 7.4
      },
      {
        text: "Would you have been fooled by a parsnip banana? Let us know below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Sunlit British cottage kitchen window with lace curtains looking out onto an herb garden. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-fake-coffee-and-mock-banana/6.png",
        audio: "audio/wwii-fake-coffee-and-mock-banana/6.wav",
        voicedText: "Would you have been fooled by a parsnip banana? Let us know below and follow for daily history stories!",
        seconds: 6.7
      }
    ]
  },
  // 11. WWII Morse Code Bletchley Park
  {
    slug: "wwii-morse-code-bletchley-park",
    title: "Cracking Enigma at Bletchley Park",
    hook: "Crossword champions broke Hitler's secret codes.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Deep in the Buckinghamshire countryside, an eccentric Victorian mansion called Bletchley Park housed Britain's greatest codebreaking minds.",
        mood: "cool",
        imagePrompt: "Red brick Victorian manor house at Bletchley Park surrounded by green lawns and wooden military huts under overcast skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-morse-code-bletchley-park/1.png",
        audio: "audio/wwii-morse-code-bletchley-park/1.wav",
        voicedText: "Deep in the Buckinghamshire countryside, an eccentric Victorian mansion called Bletchley Park housed Britain's greatest codebreaking minds.",
        seconds: 7.3
      },
      {
        text: "Recruits weren't just mathematicians—they included chess masters, linguists, and crossword champions scouted through national newspapers.",
        mood: "warm",
        imagePrompt: "Wooden desk inside a dimly lit codebreaker hut with paper crossword puzzles, pencils, and teacups beside Morse code telegraph keys. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-morse-code-bletchley-park/2.png",
        audio: "audio/wwii-morse-code-bletchley-park/2.wav",
        voicedText: "Recruits weren't just mathematicians—they included chess masters, linguists, and crossword champions scouted through national newspapers.",
        seconds: 7.4
      },
      {
        text: "Every day, German military units scrambled their secret orders using Enigma machines with 150 million million possible rotor settings.",
        mood: "dark",
        imagePrompt: "Close-up of a three-rotor German Enigma cipher machine in an oak case showing brass alphabet keyboard and plugboard wires. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-morse-code-bletchley-park/3.png",
        audio: "audio/wwii-morse-code-bletchley-park/3.wav",
        voicedText: "Every day, German military units scrambled their secret orders using Enigma machines with 150 million million possible rotor settings.",
        seconds: 7.5
      },
      {
        text: "To break the cipher before midnight, Alan Turing designed the 'Bombe': an electromechanical machine of spinning red and black drums.",
        mood: "dark",
        imagePrompt: "Massive electromechanical Turing Bombe machine with dozens of rotating colored drums and bundles of copper wire inside a timber hut. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-morse-code-bletchley-park/4.png",
        audio: "audio/wwii-morse-code-bletchley-park/4.wav",
        voicedText: "To break the cipher before midnight, Alan Turing designed the 'Bombe': an electromechanical machine of spinning red and black drums.",
        seconds: 7.3
      },
      {
        text: "Operating in freezing wooden huts called Hut 6 and Hut 8, ten thousand staff deciphered intercepted signals that shortened the war by two years.",
        mood: "cool",
        imagePrompt: "Interior of Hut 8 with long wooden trestle tables stacked with teleprinter paper tapes, cubbyholes, and filing cabinets. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-morse-code-bletchley-park/5.png",
        audio: "audio/wwii-morse-code-bletchley-park/5.wav",
        voicedText: "Operating in freezing wooden huts called Hut 6 and Hut 8, ten thousand staff deciphered intercepted signals that shortened the war by two years.",
        seconds: 7.6
      },
      {
        text: "Staff swore absolute secrecy and told no one—not even their spouses—for thirty years. Could you keep that secret?",
        mood: "day",
        imagePrompt: "Peaceful Bletchley Park grounds with leafy willow trees weeping over a quiet reflecting lake in morning light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-morse-code-bletchley-park/6.png",
        audio: "audio/wwii-morse-code-bletchley-park/6.wav",
        voicedText: "Staff swore absolute secrecy and told no one—not even their spouses—for thirty years. Could you keep that secret?",
        seconds: 6.9
      }
    ]
  },
  // 12. WWII Night Fighter Carrots Myth
  {
    slug: "wwii-night-fighter-carrots-myth",
    title: "The Carrot Night Vision Propaganda Lie",
    hook: "Britain told the world carrots gave pilots night vision.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In 1940, British night fighter pilots suddenly began shooting down German bombers in total pitch-black darkness with uncanny precision.",
        mood: "dark",
        imagePrompt: "Dark night sky over the English coast with searchlight beams slicing through black clouds and distant anti-aircraft flashes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-night-fighter-carrots-myth/1.png",
        audio: "audio/wwii-night-fighter-carrots-myth/1.wav",
        voicedText: "In 1940, British night fighter pilots suddenly began shooting down German bombers in total pitch-black darkness with uncanny precision.",
        seconds: 7.4
      },
      {
        text: "In reality, the RAF had secretly installed top-secret Airborne Interception radar units into twin-engine Bristol Beaufighter cockpits.",
        mood: "cool",
        imagePrompt: "Vintage twin-engine British Beaufighter fighter aircraft parked inside an airfield hangar with radar antenna arrays visible on the nose. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-night-fighter-carrots-myth/2.png",
        audio: "audio/wwii-night-fighter-carrots-myth/2.wav",
        voicedText: "In reality, the RAF had secretly installed top-secret Airborne Interception radar units into twin-engine Bristol Beaufighter cockpits.",
        seconds: 7.5
      },
      {
        text: "To hide the radar breakthrough from German intelligence, the British Air Ministry launched a brilliant propaganda cover story.",
        mood: "warm",
        imagePrompt: "1940s newspaper clipping and Ministry of Information posters displayed on a wooden billboard under streetlamp glow. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-night-fighter-carrots-myth/3.png",
        audio: "audio/wwii-night-fighter-carrots-myth/3.wav",
        voicedText: "To hide the radar breakthrough from German intelligence, the British Air Ministry launched a brilliant propaganda cover story.",
        seconds: 7.0
      },
      {
        text: "They claimed fighter ace John 'Cat's Eyes' Cunningham possessed superhuman night vision because he ate bowls of raw carrots every day.",
        mood: "day",
        imagePrompt: "Wooden kitchen table with a ceramic bowl piled high with fresh, unpeeled orange carrots with leafy green tops. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-night-fighter-carrots-myth/4.png",
        audio: "audio/wwii-night-fighter-carrots-myth/4.wav",
        voicedText: "They claimed fighter ace John 'Cat's Eyes' Cunningham possessed superhuman night vision because he ate bowls of raw carrots every day.",
        seconds: 7.6
      },
      {
        text: "The public eagerly believed it: families ate millions of carrots to see better in blackout streets, and even German commanders took notes.",
        mood: "warm",
        imagePrompt: "Vintage kitchen pantry with jars of pickled carrots, carrot marmalade pots, and recipe cards from wartime magazines. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-night-fighter-carrots-myth/5.png",
        audio: "audio/wwii-night-fighter-carrots-myth/5.wav",
        voicedText: "The public eagerly believed it: families ate millions of carrots to see better in blackout streets, and even German commanders took notes.",
        seconds: 7.5
      },
      {
        text: "Did your parents tell you carrots help you see in the dark? It all started with this WWII radar deception!",
        mood: "day",
        imagePrompt: "Sunny vegetable garden allotment with neat rows of vibrant green carrot tops swaying in a gentle breeze. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-night-fighter-carrots-myth/6.png",
        audio: "audio/wwii-night-fighter-carrots-myth/6.wav",
        voicedText: "Did your parents tell you carrots help you see in the dark? It all started with this WWII radar deception!",
        seconds: 6.8
      }
    ]
  },
  // 13. WWII Underground Tube Sleepers
  {
    slug: "wwii-underground-tube-sleepers",
    title: "Sleeping on London Tube Platform Tracks",
    hook: "150,000 Londoners slept shoulder-to-shoulder on subway tracks.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "When nightly Blitz bombing raids devastated London, 150,000 civilians took shelter seventy feet underground in the Tube network.",
        mood: "cool",
        imagePrompt: "1940s London Underground curved tunnel station with white subway tiles and a wooden platform edge over steel train tracks. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-underground-tube-sleepers/1.png",
        audio: "audio/wwii-underground-tube-sleepers/1.wav",
        voicedText: "When nightly Blitz bombing raids devastated London, 150,000 civilians took shelter seventy feet underground in the Tube network.",
        seconds: 7.3
      },
      {
        text: "At first, the government tried locking subway station gates, but desperate crowds bought penny tickets and simply refused to leave.",
        mood: "dark",
        imagePrompt: "Cast-iron folding subway turnstile gate with vintage enamel London transport signs and cobblestones above ground. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-underground-tube-sleepers/2.png",
        audio: "audio/wwii-underground-tube-sleepers/2.wav",
        voicedText: "At first, the government tried locking subway station gates, but desperate crowds bought penny tickets and simply refused to leave.",
        seconds: 7.4
      },
      {
        text: "Families claimed their small patches of platform concrete each evening with blankets, tea thermoses, and cardboard suitcases.",
        mood: "warm",
        imagePrompt: "Subway platform wall with round London Underground roundel sign, stacked wool blankets, and a vintage tartan picnic thermos. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-underground-tube-sleepers/3.png",
        audio: "audio/wwii-underground-tube-sleepers/3.wav",
        voicedText: "Families claimed their small patches of platform concrete each evening with blankets, tea thermoses, and cardboard suitcases.",
        seconds: 7.1
      },
      {
        text: "Deep underground, entire communities formed: mobile tea trollies rolled down tracks, musical concerts played, and libraries lent books.",
        mood: "warm",
        imagePrompt: "Steel mobile canteen tea cart with metal tea urn, white ceramic mugs, and buns parked beside tiled subway columns. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-underground-tube-sleepers/4.png",
        audio: "audio/wwii-underground-tube-sleepers/4.wav",
        voicedText: "Deep underground, entire communities formed: mobile tea trollies rolled down tracks, musical concerts played, and libraries lent books.",
        seconds: 7.5
      },
      {
        text: "Conditions were stifling: the air was thick with disinfectant, and seven thousand trains rattled by on daytime schedules before night shutdowns.",
        mood: "cool",
        imagePrompt: "Dimly lit arched railway tunnel extending into dark perspective with twin rails reflecting overhead incandescent bulbs. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-underground-tube-sleepers/5.png",
        audio: "audio/wwii-underground-tube-sleepers/5.wav",
        voicedText: "Conditions were stifling: the air was thick with disinfectant, and seven thousand trains rattled by on daytime schedules before night shutdowns.",
        seconds: 7.7
      },
      {
        text: "Could you have slept through the night on a subway platform? Let us know below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Morning light pouring down stone subway entrance stairs leading up to a calm London street with red telephone boxes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-underground-tube-sleepers/6.png",
        audio: "audio/wwii-underground-tube-sleepers/6.wav",
        voicedText: "Could you have slept through the night on a subway platform? Let us know below and follow for daily history stories!",
        seconds: 7.0
      }
    ]
  }
];

console.log(`Writing remaining WWII scripts...`);
for (const s of BATCH_1_REMAINING) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

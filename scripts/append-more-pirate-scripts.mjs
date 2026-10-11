import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const PIRATE_SCRIPTS_REMAINING = [
  // 4. Pirate Democracy Articles
  {
    slug: "pirate-democracy-articles",
    title: "Pirate Ships Were Pure Democracies",
    hook: "Pirate crews elected their captains and voted on destinations.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "While European monarchs ruled with iron fists, 18th-century pirate ships practiced radical pure democracy.",
        mood: "warm",
        imagePrompt: "Sunlit quarterdeck of a wooden pirate galleon with ship's wheel, compass binnacle, and voting ballot box on a barrel. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-democracy-articles/1.png",
        audio: "audio/pirate-democracy-articles/1.wav",
        voicedText: "While European monarchs ruled with iron fists, 18th-century pirate ships practiced radical pure democracy.",
        seconds: 7.2
      },
      {
        text: "Every crewman had an equal vote when electing their captain, choosing which merchant trade routes to raid, and deciding when to retreat.",
        mood: "day",
        imagePrompt: "Nautical navigation chart laid across a wooden capstan with brass dividers, calipers, and a horn rum cup. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-democracy-articles/2.png",
        audio: "audio/pirate-democracy-articles/2.wav",
        voicedText: "Every crewman had an equal vote when electing their captain, choosing which merchant trade routes to raid, and deciding when to retreat.",
        seconds: 7.6
      },
      {
        text: "If a captain proved cowardly, greedy, or abusive, the crew held a vote and instantly demoted him back to regular deckhand.",
        mood: "cool",
        imagePrompt: "Stern captain's quarters with leaded glass windows overlooking ocean wake and an empty high-backed oak chair. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-democracy-articles/3.png",
        audio: "audio/pirate-democracy-articles/3.wav",
        voicedText: "If a captain proved cowardly, greedy, or abusive, the crew held a vote and instantly demoted him back to regular deckhand.",
        seconds: 7.4
      },
      {
        text: "Poot loot was divided with strict equality: captains received only two shares, while standard crew members received one full share.",
        mood: "warm",
        imagePrompt: "Open iron-banded treasure chest overflowing with Spanish silver pieces of eight and gold doubloons on deck planks. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-democracy-articles/4.png",
        audio: "audio/pirate-democracy-articles/4.wav",
        voicedText: "Poot loot was divided with strict equality: captains received only two shares, while standard crew members received one full share.",
        seconds: 7.5
      },
      {
        text: "They even had the world's first worker disability insurance: losing an eye paid one hundred pieces of eight, and losing a leg paid six hundred.",
        mood: "warm",
        imagePrompt: "Carved wooden peg leg and leather eye patch resting beside stacks of silver coins on a ship ledger book. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-democracy-articles/5.png",
        audio: "audio/pirate-democracy-articles/5.wav",
        voicedText: "They even had the world's first worker disability insurance: losing an eye paid one hundred pieces of eight, and losing a leg paid six hundred.",
        seconds: 7.7
      },
      {
        text: "Were pirate ships fairer places to live than European royal navies? Tell us below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Peaceful Caribbean sea with gentle blue waves under a sky of fluffy white clouds and seagulls gliding above. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-democracy-articles/6.png",
        audio: "audio/pirate-democracy-articles/6.wav",
        voicedText: "Were pirate ships fairer places to live than European royal navies? Tell us below and follow for daily history stories!",
        seconds: 6.9
      }
    ]
  },
  // 5. Pirate Women Anne Bonny
  {
    slug: "pirate-women-anne-bonny",
    title: "The Deadliest Female Pirates",
    hook: "Anne Bonny fought with dual pistols on the open quarterdeck.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In 1720, maritime authorities across the Caribbean were terrified by two ruthless buccaneers: Anne Bonny and Mary Read.",
        mood: "cool",
        imagePrompt: "Foggy Caribbean mangrove inlet with a sleek pirate sloop concealed behind hanging moss and tropical vines. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-women-anne-bonny/1.png",
        audio: "audio/pirate-women-anne-bonny/1.wav",
        voicedText: "In 1720, maritime authorities across the Caribbean were terrified by two ruthless buccaneers: Anne Bonny and Mary Read.",
        seconds: 7.2
      },
      {
        text: "Both women disguised themselves in men's loose sailor trousers and wool jackets, swearing oaths and fighting alongside the male crew.",
        mood: "warm",
        imagePrompt: "Deck locker with rolled canvas trousers, red wool sash, iron cutlass, and leather powder horn. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-women-anne-bonny/2.png",
        audio: "audio/pirate-women-anne-bonny/2.wav",
        voicedText: "Both women disguised themselves in men's loose sailor trousers and wool jackets, swearing oaths and fighting alongside the male crew.",
        seconds: 7.4
      },
      {
        text: "During sea battles, victims testified that Bonny and Read fought with unmatched ferocity, wielding curved cutlasses and dual flintlock pistols.",
        mood: "dramatic",
        imagePrompt: "Pair of brass-fitted flintlock pistols and a curved steel boarding cutlass crossed over a ship gunnel rail. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-women-anne-bonny/3.png",
        audio: "audio/pirate-women-anne-bonny/3.wav",
        voicedText: "During sea battles, victims testified that Bonny and Read fought with unmatched ferocity, wielding curved cutlasses and dual flintlock pistols.",
        seconds: 7.6
      },
      {
        text: "When a royal navy pirate hunter ship ambushed them off Jamaica, the drunken male crew hid below deck in the cargo hold.",
        mood: "dark",
        imagePrompt: "Dark cargo hold of a wooden ship packed with rum casks, hanging hammocks, and dim lantern shadows. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-women-anne-bonny/4.png",
        audio: "audio/pirate-women-anne-bonny/4.wav",
        voicedText: "When a royal navy pirate hunter ship ambushed them off Jamaica, the drunken male crew hid below deck in the cargo hold.",
        seconds: 7.3
      },
      {
        text: "Anne and Mary stood their ground alone on the open quarterdeck, holding off armed British boarding parties until finally overpowered.",
        mood: "cool",
        imagePrompt: "Splintered wooden ship quarterdeck with spent bullet shells and tangled rigging ropes after a boarding action. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-women-anne-bonny/5.png",
        audio: "audio/pirate-women-anne-bonny/5.wav",
        voicedText: "Anne and Mary stood their ground alone on the open quarterdeck, holding off armed British boarding parties until finally overpowered.",
        seconds: 7.5
      },
      {
        text: "Both escaped the gallows because they were pregnant. Did you know the fiercest pirates were two armed women?",
        mood: "day",
        imagePrompt: "Peaceful tropical sunset over Port Royal harbor with stone fort walls looking out towards calm blue water. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-women-anne-bonny/6.png",
        audio: "audio/pirate-women-anne-bonny/6.wav",
        voicedText: "Both escaped the gallows because they were pregnant. Did you know the fiercest pirates were two armed women?",
        seconds: 6.9
      }
    ]
  },
  // 6. Pirate Grog and Rum
  {
    slug: "pirate-grog-and-rum",
    title: "Why Bilge Water Forced Sailors to Drink Rum",
    hook: "Fresh water turned into green slime within two weeks at sea.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "On long sea voyages, fresh drinking water was stored in large wooden oak casks deep in the dark, warm ship hold.",
        mood: "dark",
        imagePrompt: "Deep cargo hold of a wooden sailing ship stacked high with massive iron-hooped wooden oak water casks. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-grog-and-rum/1.png",
        audio: "audio/pirate-grog-and-rum/1.wav",
        voicedText: "On long sea voyages, fresh drinking water was stored in large wooden oak casks deep in the dark, warm ship hold.",
        seconds: 7.1
      },
      {
        text: "Within two weeks in tropical Caribbean heat, the water turned foul, growing thick green algae and crawling with mosquito larvae.",
        mood: "cool",
        imagePrompt: "Murky green liquid inside a wooden bucket with slimy algae edges under dim candlelight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-grog-and-rum/2.png",
        audio: "audio/pirate-grog-and-rum/2.wav",
        voicedText: "Within two weeks in tropical Caribbean heat, the water turned foul, growing thick green algae and crawling with mosquito larvae.",
        seconds: 7.3
      },
      {
        text: "To make putrid water drinkable and kill deadly bacteria, sailors mixed it with potent high-proof Caribbean sugar cane rum.",
        mood: "warm",
        imagePrompt: "Wooden ship table with brown glass rum bottle, copper measuring funnel, and sliced sour limes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-grog-and-rum/3.png",
        audio: "audio/pirate-grog-and-rum/3.wav",
        voicedText: "To make putrid water drinkable and kill deadly bacteria, sailors mixed it with potent high-proof Caribbean sugar cane rum.",
        seconds: 7.4
      },
      {
        text: "In 1740, British Admiral Edward Vernon ordered the mixture diluted with water and lime juice, creating the legendary cocktail called 'Grog'.",
        mood: "warm",
        imagePrompt: "Heavy wooden grog tub embossed with brass lettering 'The King God Bless Him' and copper serving dippers on deck. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-grog-and-rum/4.png",
        audio: "audio/pirate-grog-and-rum/4.wav",
        voicedText: "In 1740, British Admiral Edward Vernon ordered the mixture diluted with water and lime juice, creating the legendary cocktail called 'Grog'.",
        seconds: 7.7
      },
      {
        text: "The added lime juice accidentally cured scurvy, while the alcohol kept crews hydrated without dying of cholera or dysentery.",
        mood: "day",
        imagePrompt: "Burlap sack of fresh green limes resting beside a pewter drinking tankard on sunlit ship teak deck. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-grog-and-rum/5.png",
        audio: "audio/pirate-grog-and-rum/5.wav",
        voicedText: "The added lime juice accidentally cured scurvy, while the alcohol kept crews hydrated without dying of cholera or dysentery.",
        seconds: 7.2
      },
      {
        text: "Pirates weren't just drunkards—rum was literally their medicine! Would you drink 18th-century grog? Tell us below!",
        mood: "day",
        imagePrompt: "Golden afternoon sunshine reflecting off the ocean horizon viewed through ship rigging ropes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-grog-and-rum/6.png",
        audio: "audio/pirate-grog-and-rum/6.wav",
        voicedText: "Pirates weren't just drunkards—rum was literally their medicine! Would you drink 18th-century grog? Tell us below!",
        seconds: 6.8
      }
    ]
  },
  // 7. Pirate Jolly Roger Flags
  {
    slug: "pirate-jolly-roger-flags",
    title: "The Terrifying Secret of Pirate Flags",
    hook: "Black flag meant surrender; red flag meant everyone dies.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Hollywood movies show pirate ships sailing 24/7 with a flapping Jolly Roger skull flag, but real pirates rarely did.",
        mood: "cool",
        imagePrompt: "Tall wooden ship mast with furled sails against an overcast grey Atlantic sky with gentle ocean swells. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-jolly-roger-flags/1.png",
        audio: "audio/pirate-jolly-roger-flags/1.wav",
        voicedText: "Hollywood movies show pirate ships sailing 24/7 with a flapping Jolly Roger skull flag, but real pirates rarely did.",
        seconds: 7.1
      },
      {
        text: "To sneak close to prey, pirate ships flew 'false colors': raising friendly Spanish, French, or British royal naval flags.",
        mood: "day",
        imagePrompt: "Signal halyard ropes raising a vibrant red-and-white British naval ensign on the stern flagpole. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-jolly-roger-flags/2.png",
        audio: "audio/pirate-jolly-roger-flags/2.wav",
        voicedText: "To sneak close to prey, pirate ships flew 'false colors': raising friendly Spanish, French, or British royal naval flags.",
        seconds: 7.2
      },
      {
        text: "Once within cannon range, they lowered the royal flag and hoisted the black Jolly Roger: the universal symbol for 'surrender and live'.",
        mood: "dark",
        imagePrompt: "Classic black Jolly Roger flag with white grinning skull and crossed bones fluttering menacingly against sea spray. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-jolly-roger-flags/3.png",
        audio: "audio/pirate-jolly-roger-flags/3.wav",
        voicedText: "Once within cannon range, they lowered the royal flag and hoisted the black Jolly Roger: the universal symbol for 'surrender and live'.",
        seconds: 7.5
      },
      {
        text: "Each captain had custom symbols: Bartholomew Roberts showed himself standing on skulls, while Edward Low used a blood-red skeleton.",
        mood: "dark",
        imagePrompt: "Embroidered black silk pirate banner with a red hourglass and pierced heart motif on a wooden cabin table. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-jolly-roger-flags/4.png",
        audio: "audio/pirate-jolly-roger-flags/4.wav",
        voicedText: "Each captain had custom symbols: Bartholomew Roberts showed himself standing on skulls, while Edward Low used a blood-red skeleton.",
        seconds: 7.6
      },
      {
        text: "If a merchant ship dared to fight back, pirates hoisted the dreaded solid crimson red flag: the 'Jolie Rouge', meaning 'No Quarter'—zero survivors.",
        mood: "dramatic",
        imagePrompt: "Vivid blood-red crimson flag flying from the mainmast tip against stormy bruised ocean battle clouds. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-jolly-roger-flags/5.png",
        audio: "audio/pirate-jolly-roger-flags/5.wav",
        voicedText: "If a merchant ship dared to fight back, pirates hoisted the dreaded solid crimson red flag: the 'Jolie Rouge', meaning 'No Quarter'—zero survivors.",
        seconds: 7.8
      },
      {
        text: "Seeing that red flag struck sheer panic into every sailor's heart. Would you have surrendered to the black flag immediately?",
        mood: "day",
        imagePrompt: "Calm tropical blue ocean waters gently lapping against coral reef sands under midday sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-jolly-roger-flags/6.png",
        audio: "audio/pirate-jolly-roger-flags/6.wav",
        voicedText: "Seeing that red flag struck sheer panic into every sailor's heart. Would you have surrendered to the black flag immediately?",
        seconds: 7.0
      }
    ]
  },
  // 8. Pirate Ship Surgeon Saw
  {
    slug: "pirate-ship-surgeon-saw",
    title: "High Seas Surgery Without Anesthesia",
    hook: "The carpenter sawed off your shattered leg in 90 seconds.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In 18th-century sea battles, cannonballs rarely killed men directly—flying jagged oak splinters did.",
        mood: "cool",
        imagePrompt: "Splintered oak timber bulkheads inside an 18th-century gun deck with wood fragments scattered across deck planks. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-ship-surgeon-saw/1.png",
        audio: "audio/pirate-ship-surgeon-saw/1.wav",
        voicedText: "In 18th-century sea battles, cannonballs rarely killed men directly—flying jagged oak splinters did.",
        seconds: 6.9
      },
      {
        text: "When an oak splinter shattered a sailor's arm or leg, the wounded man was rushed below to the 'cockpit' near the ship's keel.",
        mood: "dark",
        imagePrompt: "Cramped wooden surgery table in the dark orlop deck illuminated by swinging tallow oil lanterns. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-ship-surgeon-saw/2.png",
        audio: "audio/pirate-ship-surgeon-saw/2.wav",
        voicedText: "When an oak splinter shattered a sailor's arm or leg, the wounded man was rushed below to the 'cockpit' near the ship's keel.",
        seconds: 7.3
      },
      {
        text: "Because real doctors were rare on pirate ships, the ship's carpenter—trained only in sawing wood planks—performed amputations.",
        mood: "dark",
        imagePrompt: "Iron bone saw with sharp serrated teeth, leather tourniquet, and brass probes laid on a stained wooden surgery board. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-ship-surgeon-saw/3.png",
        audio: "audio/pirate-ship-surgeon-saw/3.wav",
        voicedText: "Because real doctors were rare on pirate ships, the ship's carpenter—trained only in sawing wood planks—performed amputations.",
        seconds: 7.5
      },
      {
        text: "With zero anesthesia, the patient was given a leather belt to bite and a cup of pure rum while strong crewmen pinned his shoulders.",
        mood: "warm",
        imagePrompt: "Heavy leather sailor's belt with teeth bite impressions resting beside a pewter flask of rum on a rough crate. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-ship-surgeon-saw/4.png",
        audio: "audio/pirate-ship-surgeon-saw/4.wav",
        voicedText: "With zero anesthesia, the patient was given a leather belt to bite and a cup of pure rum while strong crewmen pinned his shoulders.",
        seconds: 7.5
      },
      {
        text: "Speed was the only mercy: a skilled carpenter tightened a tourniquet, sliced the flesh, and sawed the bone in under ninety seconds.",
        mood: "cool",
        imagePrompt: "Tub of steaming hot pitch tar with iron ladle used for cauterizing wounds beside clean linen bandages. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-ship-surgeon-saw/5.png",
        audio: "audio/pirate-ship-surgeon-saw/5.wav",
        voicedText: "Speed was the only mercy: a skilled carpenter tightened a tourniquet, sliced the flesh, and sawed the bone in under ninety seconds.",
        seconds: 7.6
      },
      {
        text: "Surviving meant earning six hundred silver pieces from the ship's fund. Would you have survived 18th-century surgery? Tell us below!",
        mood: "day",
        imagePrompt: "Sunlit deck looking out through an open gunport toward calm blue ocean horizon with billowing clouds. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-ship-surgeon-saw/6.png",
        audio: "audio/pirate-ship-surgeon-saw/6.wav",
        voicedText: "Surviving meant earning six hundred silver pieces from the ship's fund. Would you have survived 18th-century surgery? Tell us below!",
        seconds: 7.1
      }
    ]
  },
  // 9. Pirate Eyepatch Night Vision
  {
    slug: "pirate-eyepatch-night-vision",
    title: "The Real Reason Pirates Wore Eye Patches",
    hook: "Eye patches kept one eye adjusted to pitch-black cargo holds.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Every classic pirate illustration shows a menacing buccaneer sporting a black leather eye patch over one eye.",
        mood: "warm",
        imagePrompt: "Weathered pirate captain's hat and round leather eye patch resting on a wooden table beside brass navigation charts. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-eyepatch-night-vision/1.png",
        audio: "audio/pirate-eyepatch-night-vision/1.wav",
        voicedText: "Every classic pirate illustration shows a menacing buccaneer sporting a black leather eye patch over one eye.",
        seconds: 7.0
      },
      {
        text: "While some sailors lost eyes to flying wood splinters or sparking gunpowder burns, many wore patches with two perfectly good eyes.",
        mood: "cool",
        imagePrompt: "Sunlit wooden upper quarterdeck with brilliant glare bouncing off white canvas sails and bright ocean waves. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-eyepatch-night-vision/2.png",
        audio: "audio/pirate-eyepatch-night-vision/2.wav",
        voicedText: "While some sailors lost eyes to flying wood splinters or sparking gunpowder burns, many wore patches with two perfectly good eyes.",
        seconds: 7.3
      },
      {
        text: "The human eye takes up to twenty minutes to adapt from bright tropical sunlight into pitch-black indoor darkness.",
        mood: "dark",
        imagePrompt: "Steep wooden ladder hatchway leading down from sunny upper deck into the deep pitch-black shadows of a ship hold. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-eyepatch-night-vision/3.png",
        audio: "audio/pirate-eyepatch-night-vision/3.wav",
        voicedText: "The human eye takes up to twenty minutes to adapt from bright tropical sunlight into pitch-black indoor darkness.",
        seconds: 7.1
      },
      {
        text: "During chaotic boarding raids, fighting often moved in seconds from the blinding sun on deck down into dark cargo holds.",
        mood: "dark",
        imagePrompt: "Dim lower gun deck with low oak beams, powder kegs, and shadows illuminated only by swinging horn lanterns. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-eyepatch-night-vision/4.png",
        audio: "audio/pirate-eyepatch-night-vision/4.wav",
        voicedText: "During chaotic boarding raids, fighting often moved in seconds from the blinding sun on deck down into dark cargo holds.",
        seconds: 7.2
      },
      {
        text: "By flipping the patch over their other eye, a pirate instantly had full night vision, giving them a deadly advantage in the dark.",
        mood: "cool",
        imagePrompt: "Close-up of a stitched leather eye patch with adjustable cord resting on polished brass spyglass. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-eyepatch-night-vision/5.png",
        audio: "audio/pirate-eyepatch-night-vision/5.wav",
        voicedText: "By flipping the patch over their other eye, a pirate instantly had full night vision, giving them a deadly advantage in the dark.",
        seconds: 7.3
      },
      {
        text: "Military pilots still use this exact dark-adaptation trick today! Did you think eye patches were only for lost eyes?",
        mood: "day",
        imagePrompt: "Sunny Caribbean coastline with white sand beaches, coconut palms, and distant sailing ship silhouettes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-eyepatch-night-vision/6.png",
        audio: "audio/pirate-eyepatch-night-vision/6.wav",
        voicedText: "Military pilots still use this exact dark-adaptation trick today! Did you think eye patches were only for lost eyes?",
        seconds: 6.8
      }
    ]
  },
  // 10. Pirate Hidden Treasure Myth
  {
    slug: "pirate-hidden-treasure-myth",
    title: "Did Pirates Actually Bury Treasure?",
    hook: "Almost no pirate ever buried chests of Spanish gold.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Treasure Island and pirate legends convinced the world that buccaneers constantly buried iron chests on remote tropical islands.",
        mood: "warm",
        imagePrompt: "Weathered antique treasure map with burned edges, red 'X' mark, and sea monster illustrations on parchment. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-hidden-treasure-myth/1.png",
        audio: "audio/pirate-hidden-treasure-myth/1.wav",
        voicedText: "Treasure Island and pirate legends convinced the world that buccaneers constantly buried iron chests on remote tropical islands.",
        seconds: 7.2
      },
      {
        text: "In reality, in the entire Golden Age of Piracy, only one famous pirate ever confirmed burying loot: Captain William Kidd.",
        mood: "cool",
        imagePrompt: "Gloomy sandy shoreline on Gardiners Island, New York, with dunes and autumn coastal grasses under stormy skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-hidden-treasure-myth/2.png",
        audio: "audio/pirate-hidden-treasure-myth/2.wav",
        voicedText: "In reality, in the entire Golden Age of Piracy, only one famous pirate ever confirmed burying loot: Captain William Kidd.",
        seconds: 7.4
      },
      {
        text: "Kidd buried his gold near New York purely as a desperate bargaining chip to avoid being hanged by British authorities.",
        mood: "dark",
        imagePrompt: "Shallow pit in sandy earth revealing the iron handle and brass corner fittings of a buried wooden chest. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-hidden-treasure-myth/3.png",
        audio: "audio/pirate-hidden-treasure-myth/3.wav",
        voicedText: "Kidd buried his gold near New York purely as a desperate bargaining chip to avoid being hanged by British authorities.",
        seconds: 7.1
      },
      {
        text: "Real pirate plunder wasn't just gold: it was silk bolts, barrels of flour, tobacco bales, nails, and precious gunpowder.",
        mood: "warm",
        imagePrompt: "Pirate ship warehouse deck packed with stacked barrels of rum, bales of raw cotton, and iron cannonball pyramids. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-hidden-treasure-myth/4.png",
        audio: "audio/pirate-hidden-treasure-myth/4.wav",
        voicedText: "Real pirate plunder wasn't just gold: it was silk bolts, barrels of flour, tobacco bales, nails, and precious gunpowder.",
        seconds: 7.3
      },
      {
        text: "Pirates had notoriously short life expectancies and divided their silver immediately to spend every penny in taverns in Port Royal and Nassau.",
        mood: "warm",
        imagePrompt: "Bustling Caribbean port tavern counter with clay beer jugs, wooden tankards, scattered gold coins, and pipe smoke. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-hidden-treasure-myth/5.png",
        audio: "audio/pirate-hidden-treasure-myth/5.wav",
        voicedText: "Pirates had notoriously short life expectancies and divided their silver immediately to spend every penny in taverns in Port Royal and Nassau.",
        seconds: 7.6
      },
      {
        text: "Burying loot would have made a crew mutiny on the spot! Would you spend your pirate plunder immediately or save it?",
        mood: "day",
        imagePrompt: "Tropical turquoise lagoon with gentle waves washing ashore beside palm trees swaying under bright blue skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-hidden-treasure-myth/6.png",
        audio: "audio/pirate-hidden-treasure-myth/6.wav",
        voicedText: "Burying loot would have made a crew mutiny on the spot! Would you spend your pirate plunder immediately or save it?",
        seconds: 6.9
      }
    ]
  },
  // 11. Pirate Port Royal Sunk
  {
    slug: "pirate-port-royal-sunk",
    title: "The Wickedest City Swallowed by the Sea",
    hook: "An earthquake sank two-thirds of Port Royal into the ocean.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the late 1600s, Port Royal, Jamaica was nicknamed 'the wickedest city on earth'—the lawless pirate capital of the Caribbean.",
        mood: "warm",
        imagePrompt: "Bustling colonial harbor town of Port Royal with brick merchant houses, waterfront taverns, and galleons anchored in harbor. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-port-royal-sunk/1.png",
        audio: "audio/pirate-port-royal-sunk/1.wav",
        voicedText: "In the late 1600s, Port Royal, Jamaica was nicknamed 'the wickedest city on earth'—the lawless pirate capital of the Caribbean.",
        seconds: 7.3
      },
      {
        text: "One in every four buildings was a tavern or brothel, and pirates like Henry Morgan drank rum from gold bowls in the streets.",
        mood: "warm",
        imagePrompt: "Cobblestone street corner in Port Royal with wooden tavern swinging sign, wine barrels, and gold chalice on a table. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-port-royal-sunk/2.png",
        audio: "audio/pirate-port-royal-sunk/2.wav",
        voicedText: "One in every four buildings was a tavern or brothel, and pirates like Henry Morgan drank rum from gold bowls in the streets.",
        seconds: 7.2
      },
      {
        text: "Then on June 7, 1692, at 11:43 in the morning, a massive magnitude 7.5 earthquake violently struck the sandy spit.",
        mood: "cool",
        imagePrompt: "Brick clock tower in Port Royal with stopped hands at 11:43 cracking dramatically against a stormy, dust-filled sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-port-royal-sunk/3.png",
        audio: "audio/pirate-port-royal-sunk/3.wav",
        voicedText: "Then on June 7, 1692, at 11:43 in the morning, a massive magnitude 7.5 earthquake violently struck the sandy spit.",
        seconds: 7.2
      },
      {
        text: "Because the city was built on loose sand, soil liquefaction turned the ground into quicksand, swallowing entire brick mansions whole.",
        mood: "dark",
        imagePrompt: "Cracked cobblestone waterfront road sinking into churning seawater with shattered brick walls slipping into the tide. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-port-royal-sunk/4.png",
        audio: "audio/pirate-port-royal-sunk/4.wav",
        voicedText: "Because the city was built on loose sand, soil liquefaction turned the ground into quicksand, swallowing entire brick mansions whole.",
        seconds: 7.4
      },
      {
        text: "Moments later, a giant tsunami wave crashed over the remains, plunging two-thirds of the wicked city thirty feet beneath the sea.",
        mood: "cool",
        imagePrompt: "Submerged ruins of colonial brick buildings visible beneath clear turquoise Caribbean water with coral and swimming fish. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-port-royal-sunk/5.png",
        audio: "audio/pirate-port-royal-sunk/5.wav",
        voicedText: "Moments later, a giant tsunami wave crashed over the remains, plunging two-thirds of the wicked city thirty feet beneath the sea.",
        seconds: 7.5
      },
      {
        text: "Today, marine archaeologists dive through intact 17th-century pirate taverns preserved underwater. Would you dive the sunken city?",
        mood: "day",
        imagePrompt: "Sunlight dancing across the calm surface of modern Kingston harbor with distant blue Jamaican mountains in the background. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-port-royal-sunk/6.png",
        audio: "audio/pirate-port-royal-sunk/6.wav",
        voicedText: "Today, marine archaeologists dive through intact 17th-century pirate taverns preserved underwater. Would you dive the sunken city?",
        seconds: 7.1
      }
    ]
  },
  // 12. Pirate Cannon Battle Smoke
  {
    slug: "pirate-cannon-battle-smoke",
    title: "Inside a Raging Sea Cannon Battle",
    hook: "Flying wooden splinters killed far more men than cannonballs.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "A broadside artillery battle between wooden sailing warships was one of the loudest, most suffocating experiences in military history.",
        mood: "dark",
        imagePrompt: "Lower gun deck of an 18th-century galleon with heavy iron 24-pounder cannons secured with thick hemp breeching ropes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-cannon-battle-smoke/1.png",
        audio: "audio/pirate-cannon-battle-smoke/1.wav",
        voicedText: "A broadside artillery battle between wooden sailing warships was one of the loudest, most suffocating experiences in military history.",
        seconds: 7.4
      },
      {
        text: "In the cramped lower gun deck, gun crews of six men hauled 3,000-pound iron cannons back on ropes after each massive recoil.",
        mood: "warm",
        imagePrompt: "Heavy iron cannon pulled back inside a gunport with wooden rammers, sponges, and copper gunpowder powder horns on the deck. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-cannon-battle-smoke/2.png",
        audio: "audio/pirate-cannon-battle-smoke/2.wav",
        voicedText: "In the cramped lower gun deck, gun crews of six men hauled 3,000-pound iron cannons back on ropes after each massive recoil.",
        seconds: 7.3
      },
      {
        text: "Within three discharges, acrid black gunpowder smoke became so dense that gunners could not see their own hands or open gunports.",
        mood: "dark",
        imagePrompt: "Dense swirling grey gunsmoke obscuring wooden deck beams with faint orange muzzle flash glows illuminating the gloom. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-cannon-battle-smoke/3.png",
        audio: "audio/pirate-cannon-battle-smoke/3.wav",
        voicedText: "Within three discharges, acrid black gunpowder smoke became so dense that gunners could not see their own hands or open gunports.",
        seconds: 7.5
      },
      {
        text: "The deafening sonic roar ruptured eardrums permanently; sailors stuffed beeswax into their ears and fought with open mouths to equalize ear pressure.",
        mood: "cool",
        imagePrompt: "Pyramid of iron cannonballs in a wooden deck rack beside buckets of sea water and wet wool swabs. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-cannon-battle-smoke/4.png",
        audio: "audio/pirate-cannon-battle-smoke/4.wav",
        voicedText: "The deafening sonic roar ruptured eardrums permanently; sailors stuffed beeswax into their ears and fought with open mouths to equalize ear pressure.",
        seconds: 7.8
      },
      {
        text: "When enemy solid shot smashed into two-foot-thick oak hull walls, thousands of sharp wood splinters acted like explosive shrapnel.",
        mood: "dramatic",
        imagePrompt: "Shattered wooden hull wall showing jagged jagged wood splinters and sunlight piercing through broken planks into the hold. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-cannon-battle-smoke/5.png",
        audio: "audio/pirate-cannon-battle-smoke/5.wav",
        voicedText: "When enemy solid shot smashed into two-foot-thick oak hull walls, thousands of sharp wood splinters acted like explosive shrapnel.",
        seconds: 7.4
      },
      {
        text: "Could you have loaded a three-ton cannon in choking smoke while wood splinters flew? Tell us below and subscribe!",
        mood: "day",
        imagePrompt: "Afternoon sea breeze clearing cannon smoke from the upper deck of a majestic sailing vessel on the open Atlantic. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-cannon-battle-smoke/6.png",
        audio: "audio/pirate-cannon-battle-smoke/6.wav",
        voicedText: "Could you have loaded a three-ton cannon in choking smoke while wood splinters flew? Tell us below and subscribe!",
        seconds: 7.0
      }
    ]
  }
];

console.log(`Writing remaining 9 Pirate scripts...`);
for (const s of PIRATE_SCRIPTS_REMAINING) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

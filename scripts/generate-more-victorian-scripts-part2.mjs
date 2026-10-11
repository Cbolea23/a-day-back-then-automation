import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const VICTORIAN_PART2 = [
  // 7. Victorian Sewer Hunters Toshers
  {
    slug: "victorian-sewer-hunters-toshers",
    title: "Hunting Gold in London's Underground Sewers",
    hook: "Toshers waded into miles of underground brick tunnels for dropped jewelry.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Beneath the streets of Victorian London lay a pitch-black labyrinth of hundreds of miles of brick sewer tunnels.",
        mood: "dark",
        imagePrompt: "Arched Victorian brick sewer tunnel with murky water flowing along the stone floor and pipes dripping from overhead vaults. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-sewer-hunters-toshers/1.png",
        audio: "audio/victorian-sewer-hunters-toshers/1.wav",
        voicedText: "Beneath the streets of Victorian London lay a pitch-black labyrinth of hundreds of miles of brick sewer tunnels.",
        seconds: 7.3
      },
      {
        text: "Daring scavengers known as 'toshers' slipped through street iron grates armed with canvas bags, lanterns, and iron hoe scrapers.",
        mood: "dark",
        imagePrompt: "Vintage iron hoe scraper tool and glowing tin bullseye lantern resting on wet granite bricks inside a tunnel alcove. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-sewer-hunters-toshers/2.png",
        audio: "audio/victorian-sewer-hunters-toshers/2.wav",
        voicedText: "Daring scavengers known as 'toshers' slipped through street iron grates armed with canvas bags, lanterns, and iron hoe scrapers.",
        seconds: 7.5
      },
      {
        text: "They waded through waist-deep sludge, sifting muck between bricks to find dropped gold rings, silver coins, silver spoons, and jewelry.",
        mood: "warm",
        imagePrompt: "Tarnished silver spoon, broken gold pocket watch chain, and a few Victorian sixpences glistening in wet silt on a shovel. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-sewer-hunters-toshers/3.png",
        audio: "audio/victorian-sewer-hunters-toshers/3.wav",
        voicedText: "They waded through waist-deep sludge, sifting muck between bricks to find dropped gold rings, silver coins, silver spoons, and jewelry.",
        seconds: 7.6
      },
      {
        text: "Toshers faced lethal perils: pockets of suffocating methane gas, aggressive hordes of brown sewer rats, and sudden walls of storm water.",
        mood: "dark",
        imagePrompt: "Swirling brown floodwater rushing down an arched subterranean brick drainage junction beneath an iron ceiling grate. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-sewer-hunters-toshers/4.png",
        audio: "audio/victorian-sewer-hunters-toshers/4.wav",
        voicedText: "Toshers faced lethal perils: pockets of suffocating methane gas, aggressive hordes of brown sewer rats, and sudden walls of storm water.",
        seconds: 7.5
      },
      {
        text: "Despite the filth, an experienced tosher could make a sovereign in an afternoon, making them an elite aristocracy among London's street scavengers.",
        mood: "warm",
        imagePrompt: "Pile of shining gold Victorian sovereigns and half-sovereigns on a rough tavern wooden table beside a clay ale jug. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-sewer-hunters-toshers/5.png",
        audio: "audio/victorian-sewer-hunters-toshers/5.wav",
        voicedText: "Despite the filth, an experienced tosher could make a sovereign in an afternoon, making them an elite aristocracy among London's street scavengers.",
        seconds: 7.6
      },
      {
        text: "Would you have braved miles of Victorian sewers in the dark for gold coins? Tell us below and subscribe!",
        mood: "day",
        imagePrompt: "Sunlit Victorian London street with ornate cast-iron sewer vent pipe rising gracefully against a blue sky beside brick townhouses. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-sewer-hunters-toshers/6.png",
        audio: "audio/victorian-sewer-hunters-toshers/6.wav",
        voicedText: "Would you have braved miles of Victorian sewers in the dark for gold coins? Tell us below and subscribe!",
        seconds: 6.9
      }
    ]
  },
  // 8. Victorian Corset Fainting
  {
    slug: "victorian-corset-fainting",
    title: "The Real Story Behind Victorian Corsets",
    hook: "Tight-lacing deformed ribcages and squished internal organs.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the 1870s, high Victorian fashion demanded aristocratic women possess an impossibly tiny eighteen-inch 'wasp waist'.",
        mood: "warm",
        imagePrompt: "Victorian lady's dressing room with a silk-embroidered corset laced tightly on a dressmaker's wooden mannequin in soft window light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-corset-fainting/1.png",
        audio: "audio/victorian-corset-fainting/1.wav",
        voicedText: "In the 1870s, high Victorian fashion demanded aristocratic women possess an impossibly tiny eighteen-inch 'wasp waist'.",
        seconds: 7.2
      },
      {
        text: "Corsets were reinforced with rigid steel busks and curved whalebone stays, tightened with back cords pulled with all a maid's strength.",
        mood: "cool",
        imagePrompt: "Close-up of polished whalebone stays and heavy braided silk lacing cords looped through brass eyelets. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-corset-fainting/2.png",
        audio: "audio/victorian-corset-fainting/2.wav",
        voicedText: "Corsets were reinforced with rigid steel busks and curved whalebone stays, tightened with back cords pulled with all a maid's strength.",
        seconds: 7.5
      },
      {
        text: "Extreme 'tight-lacing' physically compressed the floating ribs inwards, shifting the stomach and liver downwards into unnatural positions.",
        mood: "dark",
        imagePrompt: "Victorian medical anatomical book open on a mahogany desk comparing normal ribcage geometry to a deformed corset-cinched skeleton. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-corset-fainting/3.png",
        audio: "audio/victorian-corset-fainting/3.wav",
        voicedText: "Extreme 'tight-lacing' physically compressed the floating ribs inwards, shifting the stomach and liver downwards into unnatural positions.",
        seconds: 7.6
      },
      {
        text: "With lung capacity reduced by thirty percent, women could only take shallow breaths, leading to frequent bouts of dizziness.",
        mood: "cool",
        imagePrompt: "Plush velvet fainting couch with carved mahogany scrollwork beside a small tea table with smelling salts bottle. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-corset-fainting/4.png",
        audio: "audio/victorian-corset-fainting/4.wav",
        voicedText: "With lung capacity reduced by thirty percent, women could only take shallow breaths, leading to frequent bouts of dizziness.",
        seconds: 7.3
      },
      {
        text: "Victorian parlors specifically installed 'fainting couches' and every lady carried glass vinaigrette bottles of pungent ammonia smelling salts.",
        mood: "warm",
        imagePrompt: "Cut-crystal smelling salts vial with sterling silver filigree cap open beside an embroidered silk lace handkerchief. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-corset-fainting/5.png",
        audio: "audio/victorian-corset-fainting/5.wav",
        voicedText: "Victorian parlors specifically installed 'fainting couches' and every lady carried glass vinaigrette bottles of pungent ammonia smelling salts.",
        seconds: 7.6
      },
      {
        text: "Would you have endured organ-crushing steel stays for high society fashion? Tell us your thoughts below!",
        mood: "day",
        imagePrompt: "Sunlit Victorian drawing room with velvet drapes tied back to reveal a lush conservatory greenhouse full of blooming ferns. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-corset-fainting/6.png",
        audio: "audio/victorian-corset-fainting/6.wav",
        voicedText: "Would you have endured organ-crushing steel stays for high society fashion? Tell us your thoughts below!",
        seconds: 6.9
      }
    ]
  },
  // 9. Victorian Pea-Souper Smog
  {
    slug: "victorian-pea-souper-smog",
    title: "London's Killer Pea-Souper Fog",
    hook: "Burning coal created yellow toxic fog so thick people walked into rivers.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "During the 19th century, millions of domestic fireplaces and industrial factories burned heavy, sulfurous bituminous coal across London.",
        mood: "dark",
        imagePrompt: "Victorian London cityscape of crowded factory brick smokestacks and rooftop chimneys pumping black smoke into a gloomy sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-pea-souper-smog/1.png",
        audio: "audio/victorian-pea-souper-smog/1.wav",
        voicedText: "During the 19th century, millions of domestic fireplaces and industrial factories burned heavy, sulfurous bituminous coal across London.",
        seconds: 7.4
      },
      {
        text: "When weather inversions trapped the soot over the Thames valley, it mixed with river damp to create the notorious 'pea-souper' fog.",
        mood: "cool",
        imagePrompt: "Dense, yellowish-green sulfurous smog shrouding gas streetlamps and horse carriage silhouettes on a wet cobblestone bridge. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-pea-souper-smog/2.png",
        audio: "audio/victorian-pea-souper-smog/2.wav",
        voicedText: "When weather inversions trapped the soot over the Thames valley, it mixed with river damp to create the notorious 'pea-souper' fog.",
        seconds: 7.5
      },
      {
        text: "The smog was a pungent, yellowish-green blanket of sulfuric acid so thick that pedestrians could not see their own feet or hands.",
        mood: "cool",
        imagePrompt: "Victorian lamppost casting only a dim, blurry yellow halo of light in choking murky yellow fog on a deserted street corner. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-pea-souper-smog/3.png",
        audio: "audio/victorian-pea-souper-smog/3.wav",
        voicedText: "The smog was a pungent, yellowish-green blanket of sulfuric acid so thick that pedestrians could not see their own feet or hands.",
        seconds: 7.5
      },
      {
        text: "Street traffic ground to a halt: omnibus drivers had to lead horses on foot holding burning torches, while disoriented walkers fell into canals.",
        mood: "dark",
        imagePrompt: "Cast-iron canal bridge railing with swirling smog clouds illuminated by the faint red glow of a handheld kerosene torch. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-pea-souper-smog/4.png",
        audio: "audio/victorian-pea-souper-smog/4.wav",
        voicedText: "Street traffic ground to a halt: omnibus drivers had to lead horses on foot holding burning torches, while disoriented walkers fell into canals.",
        seconds: 7.7
      },
      {
        text: "The toxic air choked thousands to death from bronchitis, while soot accumulated so heavily that people blew black soot from their noses for days.",
        mood: "dark",
        imagePrompt: "Vintage apothecary window showing rows of cough syrup bottles, horehound candy jars, and carbolic inhalers in the gloomy smog. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-pea-souper-smog/5.png",
        audio: "audio/victorian-pea-souper-smog/5.wav",
        voicedText: "The toxic air choked thousands to death from bronchitis, while soot accumulated so heavily that people blew black soot from their noses for days.",
        seconds: 7.8
      },
      {
        text: "Clean air laws finally banned coal fires in the 1950s. Could you have walked through London's deadly yellow fog? Tell us below!",
        mood: "day",
        imagePrompt: "Crisp clear morning sunlight illuminating modern clean London embankment with Big Ben tower rising sharply against blue sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-pea-souper-smog/6.png",
        audio: "audio/victorian-pea-souper-smog/6.wav",
        voicedText: "Clean air laws finally banned coal fires in the 1950s. Could you have walked through London's deadly yellow fog? Tell us below!",
        seconds: 7.0
      }
    ]
  },
  // 10. Gold Rush Claim Jumping
  {
    slug: "gold-rush-claim-jumping",
    title: "Boomtown Justice in the California Gold Rush",
    hook: "In 1849 San Francisco, miners paid $10 for a single egg.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In 1849, the discovery of gold at Sutter's Mill triggered the fastest, wildest mass migration in American history.",
        mood: "warm",
        imagePrompt: "Wild California river gorge with pine forests, gravel riverbeds, and simple canvas prospector tents pitched on the bank. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gold-rush-claim-jumping/1.png",
        audio: "audio/gold-rush-claim-jumping/1.wav",
        voicedText: "In 1849, the discovery of gold at Sutter's Mill triggered the fastest, wildest mass migration in American history.",
        seconds: 7.2
      },
      {
        text: "Over three hundred thousand 'Forty-Niners' rushed to San Francisco, turning a sleepy village of two hundred into a sprawling city of mud tents.",
        mood: "warm",
        imagePrompt: "Muddy boomtown main street lined with rough unpainted wooden storefronts, canvas tents, and horse hitching posts under midday sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gold-rush-claim-jumping/2.png",
        audio: "audio/gold-rush-claim-jumping/2.wav",
        voicedText: "Over three hundred thousand 'Forty-Niners' rushed to San Francisco, turning a sleepy village of two hundred into a sprawling city of mud tents.",
        seconds: 7.6
      },
      {
        text: "Inflation was insane: with gold dust everywhere, a single egg cost ten dollars—equivalent to three hundred dollars today—and a loaf of bread cost five.",
        mood: "warm",
        imagePrompt: "General store wooden counter with brass balance scales weighing gold dust beside expensive tin cans of peaches and fresh eggs in straw. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gold-rush-claim-jumping/3.png",
        audio: "audio/gold-rush-claim-jumping/3.wav",
        voicedText: "Inflation was insane: with gold dust everywhere, a single egg cost ten dollars—equivalent to three hundred dollars today—and a loaf of bread cost five.",
        seconds: 7.7
      },
      {
        text: "Because formal law enforcement was non-existent, mining camps created informal 'miners' codes' to define who owned each river gravel claim.",
        mood: "cool",
        imagePrompt: "Wooden claim stake with carved initials driven into rocky river gravel beside a wooden sluice box and iron gold pan. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gold-rush-claim-jumping/4.png",
        audio: "audio/gold-rush-claim-jumping/4.wav",
        voicedText: "Because formal law enforcement was non-existent, mining camps created informal 'miners' codes' to define who owned each river gravel claim.",
        seconds: 7.4
      },
      {
        text: "Stealing another prospector's staked claim—called 'claim jumping'—was settled instantly by ad-hoc miner juries, often with immediate hanging.",
        mood: "dark",
        imagePrompt: "Gnarled California live oak tree on a dry grassy hillside with a coiled hemp rope hanging from a sturdy branch in sunset light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gold-rush-claim-jumping/5.png",
        audio: "audio/gold-rush-claim-jumping/5.wav",
        voicedText: "Stealing another prospector's staked claim—called 'claim jumping'—was settled instantly by ad-hoc miner juries, often with immediate hanging.",
        seconds: 7.5
      },
      {
        text: "The real fortunes weren't made by gold panners, but by merchants selling shovels and blue jeans! Would you have headed west in 1849?",
        mood: "day",
        imagePrompt: "Glistening mountain stream in the Sierra Nevada mountains with pure water rippling over colorful pebbles in bright morning sunshine. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gold-rush-claim-jumping/6.png",
        audio: "audio/gold-rush-claim-jumping/6.wav",
        voicedText: "The real fortunes weren't made by gold panners, but by merchants selling shovels and blue jeans! Would you have headed west in 1849?",
        seconds: 7.0
      }
    ]
  },
  // 11. Victorian Penny Blood
  {
    slug: "victorian-penny-blood",
    title: "Penny Dreadfuls: 1800s Trash Horror Comics",
    hook: "Aristocrats panicked over cheap 1-penny serial horror stories.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the 1830s, cheap steam-powered printing presses revolutionized literature, creating the world's first mass-market teenage fiction.",
        mood: "warm",
        imagePrompt: "19th-century cast-iron cylinder steam printing press in a London printshop with reams of inked paper hanging from rafters. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-blood/1.png",
        audio: "audio/victorian-penny-blood/1.wav",
        voicedText: "In the 1830s, cheap steam-powered printing presses revolutionized literature, creating the world's first mass-market teenage fiction.",
        seconds: 7.3
      },
      {
        text: "Called 'Penny Bloods' or 'Penny Dreadfuls', they were weekly eight-page serials sold for just one single copper penny to working-class boys.",
        mood: "warm",
        imagePrompt: "Victorian newsagent stall counter with stacks of woodcut-illustrated pamphlets, open newspapers, and glass jars of lemon drops. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-blood/2.png",
        audio: "audio/victorian-penny-blood/2.wav",
        voicedText: "Called 'Penny Bloods' or 'Penny Dreadfuls', they were weekly eight-page serials sold for just one single copper penny to working-class boys.",
        seconds: 7.5
      },
      {
        text: "They featured sensational, gory tales of razor-wielding fiends like Sweeney Todd: The Demon Barber of Fleet Street, and Varney the Vampire.",
        mood: "dark",
        imagePrompt: "Woodcut illustration page showing dramatic Gothic villain silhouette, full moon, and razor blade details on aged sepia newsprint. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-blood/3.png",
        audio: "audio/victorian-penny-blood/3.wav",
        voicedText: "They featured sensational, gory tales of razor-wielding fiends like Sweeney Todd: The Demon Barber of Fleet Street, and Varney the Vampire.",
        seconds: 7.7
      },
      {
        text: "Upper-class Victorian critics panicked, claiming these trashy thrillers were corrupting youth and turning factory boys into ruthless street criminals.",
        mood: "cool",
        imagePrompt: "Stately Victorian library with leather-bound encyclopedias, oak study desk, and open editorial newspaper letter on a blotter. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-blood/4.png",
        audio: "audio/victorian-penny-blood/4.wav",
        voicedText: "Upper-class Victorian critics panicked, claiming these trashy thrillers were corrupting youth and turning factory boys into ruthless street criminals.",
        seconds: 7.6
      },
      {
        text: "Despite moral outrage, millions were sold, establishing the origins of modern comic books, superhero serials, and detective mysteries.",
        mood: "warm",
        imagePrompt: "Young apprentice workbench under a gas lamp with a worn penny booklet tucked secretly beneath leather cobbler tools. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-blood/5.png",
        audio: "audio/victorian-penny-blood/5.wav",
        voicedText: "Despite moral outrage, millions were sold, establishing the origins of modern comic books, superhero serials, and detective mysteries.",
        seconds: 7.6
      },
      {
        text: "Penny Dreadfuls were the 19th-century equivalent of pulp comic books! Would you have bought one for a penny? Tell us below!",
        mood: "day",
        imagePrompt: "Charming Victorian London street corner with brass letterbox and morning sun shining down on bookshop window displays. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-blood/6.png",
        audio: "audio/victorian-penny-blood/6.wav",
        voicedText: "Penny Dreadfuls were the 19th-century equivalent of pulp comic books! Would you have bought one for a penny? Tell us below!",
        seconds: 7.1
      }
    ]
  }
];

console.log(`Writing remaining 5 Victorian scripts...`);
for (const s of VICTORIAN_PART2) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

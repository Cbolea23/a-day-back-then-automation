import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const PIRATE_SCRIPTS = [
  // 1. Pirate Punishments Code
  {
    slug: "pirate-punishments-code",
    title: "Marooning vs Keelhauling",
    hook: "Stealing from your crew got you marooned on a sandbar.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Golden Age pirates lived under strict written rules called the Ship's Articles, sworn on a Bible or an iron hatchet.",
        mood: "dark",
        imagePrompt: "Capstan table in a dimly lit pirate ship cabin with parchment Ship's Articles, black iron flintlock pistol, and dripping beeswax candle. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-punishments-code/1.png",
        audio: "audio/pirate-punishments-code/1.wav",
        voicedText: "Golden Age pirates lived under strict written rules called the Ship's Articles, sworn on a Bible or an iron hatchet.",
        seconds: 7.2
      },
      {
        text: "If a pirate stole from his fellow crewmates or cheated in dice, the punishment wasn't prison—it was marooning.",
        mood: "cool",
        imagePrompt: "Desolate coral sandbar surrounded by vast turquoise ocean under blistering Caribbean sun with a single stunted palm tree. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-punishments-code/2.png",
        audio: "audio/pirate-punishments-code/2.wav",
        voicedText: "If a pirate stole from his fellow crewmates or cheated in dice, the punishment wasn't prison—it was marooning.",
        seconds: 6.9
      },
      {
        text: "The guilty sailor was rowed to an uninhabited desert island and left with one pistol, one lead ball, a flask of water, and a pouch of gunpowder.",
        mood: "warm",
        imagePrompt: "Single wooden gunpowder flask and iron pistol resting half-buried in pristine white beach sand near gentle breaking waves. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-punishments-code/3.png",
        audio: "audio/pirate-punishments-code/3.wav",
        voicedText: "The guilty sailor was rowed to an uninhabited desert island and left with one pistol, one lead ball, a flask of water, and a pouch of gunpowder.",
        seconds: 7.6
      },
      {
        text: "Even worse was royal navy punishment: 'keelhauling' meant tying a sailor to a rope and dragging him under the barnacle-crusted ship hull.",
        mood: "dark",
        imagePrompt: "Underneath a wooden ship hull encrusted with sharp barnacles and seaweed underwater with shafts of sunlight filtering down. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-punishments-code/4.png",
        audio: "audio/pirate-punishments-code/4.wav",
        voicedText: "Even worse was royal navy punishment: 'keelhauling' meant tying a sailor to a rope and dragging him under the barnacle-crusted ship hull.",
        seconds: 7.8
      },
      {
        text: "Razor-sharp barnacles tore flesh to ribbons, and many drowned before being hauled up onto the opposite deck.",
        mood: "cool",
        imagePrompt: "Weathered wooden quarterdeck planks with wet coiled hemp ropes, iron cleats, and brass ship bells under grey overcast ocean skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-punishments-code/5.png",
        audio: "audio/pirate-punishments-code/5.wav",
        voicedText: "Razor-sharp barnacles tore flesh to ribbons, and many drowned before being hauled up onto the opposite deck.",
        seconds: 6.9
      },
      {
        text: "Which terrifying fate would you fear more: marooning or keelhauling? Drop a comment below and subscribe!",
        mood: "day",
        imagePrompt: "Silhouette of an 18th-century three-masted pirate galleon sailing into a fiery orange tropical sunset horizon. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-punishments-code/6.png",
        audio: "audio/pirate-punishments-code/6.wav",
        voicedText: "Which terrifying fate would you fear more: marooning or keelhauling? Drop a comment below and subscribe!",
        seconds: 6.8
      }
    ]
  },
  // 2. Pirate Diet and Scurvy
  {
    slug: "pirate-diet-and-scurvy",
    title: "Hardtack, Maggots, and Grog",
    hook: "Sailors tapped their rock-hard ship biscuits in the dark.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "After three months on the open Atlantic, fresh vegetables and meat were distant memories for pirate crews.",
        mood: "cool",
        imagePrompt: "Dimly lit wooden galley pantry on an 18th-century ship with empty salt barrels and hanging empty iron meat hooks. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-diet-and-scurvy/1.png",
        audio: "audio/pirate-diet-and-scurvy/1.wav",
        voicedText: "After three months on the open Atlantic, fresh vegetables and meat were distant memories for pirate crews.",
        seconds: 7.0
      },
      {
        text: "Daily rations revolved around 'hardtack': baked flour biscuits so rock-hard that sailors had to soak them in beer or broth to bite them.",
        mood: "warm",
        imagePrompt: "Wooden mess table with rock-hard square ship biscuits, a chipped ceramic bowl of grey pease porridge, and an iron spoon. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-diet-and-scurvy/2.png",
        audio: "audio/pirate-diet-and-scurvy/2.wav",
        voicedText: "Daily rations revolved around 'hardtack': baked flour biscuits so rock-hard that sailors had to soak them in beer or broth to bite them.",
        seconds: 7.5
      },
      {
        text: "Biscuits quickly infested with weevils and white maggots. Sailors ate their dinner in pitch darkness so they wouldn't see the bugs squirming.",
        mood: "dark",
        imagePrompt: "Close-up of a broken flour biscuit showing tiny holes and fine flour dust resting on rough burlap sacking in candle glow. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-diet-and-scurvy/3.png",
        audio: "audio/pirate-diet-and-scurvy/3.wav",
        voicedText: "Biscuits quickly infested with weevils and white maggots. Sailors ate their dinner in pitch darkness so they wouldn't see the bugs squirming.",
        seconds: 7.6
      },
      {
        text: "Without vitamin C, deadly scurvy struck: gums turned black and bled, teeth fell out, and old healed bone fractures mysteriously reopened.",
        mood: "cool",
        imagePrompt: "Ship's apothecary wooden chest with small glass tonic bottles, dried roots, and measuring scales in a cramped wooden cabin. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-diet-and-scurvy/4.png",
        audio: "audio/pirate-diet-and-scurvy/4.wav",
        voicedText: "Without vitamin C, deadly scurvy struck: gums turned black and bled, teeth fell out, and old healed bone fractures mysteriously reopened.",
        seconds: 7.4
      },
      {
        text: "Salted beef stored in brine barrels turned green and leathery. Sailors often carved tobacco pipes and belt buckles out of hard beef gristle.",
        mood: "warm",
        imagePrompt: "Open wooden brine cask showing pale salted meat slabs resting beside a carved bone pipe and sailor's clasp knife. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-diet-and-scurvy/5.png",
        audio: "audio/pirate-diet-and-scurvy/5.wav",
        voicedText: "Salted beef stored in brine barrels turned green and leathery. Sailors often carved tobacco pipes and belt buckles out of hard beef gristle.",
        seconds: 7.3
      },
      {
        text: "Could your stomach survive six months on maggot-filled hardtack? Let us know below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Sunny ship deck looking out toward calm azure tropical waters and lush green Caribbean islands on the horizon. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-diet-and-scurvy/6.png",
        audio: "audio/pirate-diet-and-scurvy/6.wav",
        voicedText: "Could your stomach survive six months on maggot-filled hardtack? Let us know below and follow for daily history stories!",
        seconds: 6.9
      }
    ]
  },
  // 3. Pirate Blackbeard Fuse Beard
  {
    slug: "pirate-blackbeard-fuse-beard",
    title: "Why Blackbeard Set His Hair on Fire",
    hook: "Edward Teach braided lit cannon fuses into his beard.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Edward Teach, known as Blackbeard, understood that psychological terror was far more effective than firing cannon broadsides.",
        mood: "dark",
        imagePrompt: "Dark quarterdeck of the Queen Anne's Revenge with black flags fluttering, heavy bronze cannons, and swirling ocean mist. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-blackbeard-fuse-beard/1.png",
        audio: "audio/pirate-blackbeard-fuse-beard/1.wav",
        voicedText: "Edward Teach, known as Blackbeard, understood that psychological terror was far more effective than firing cannon broadsides.",
        seconds: 7.2
      },
      {
        text: "Before boarding an enemy merchant ship, he tucked slow-burning hemp cannon fuses under his tricorn hat and into his thick braided beard.",
        mood: "warm",
        imagePrompt: "Close-up of coiled saltpeter hemp match cords smoking with glowing red embers on a wooden gun carriage. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-blackbeard-fuse-beard/2.png",
        audio: "audio/pirate-blackbeard-fuse-beard/2.wav",
        voicedText: "Before boarding an enemy merchant ship, he tucked slow-burning hemp cannon fuses under his tricorn hat and into his thick braided beard.",
        seconds: 7.4
      },
      {
        text: "The lit fuses sputtered sparking red embers, wreathing his face in thick grey sulfur smoke like a demon rising from hell.",
        mood: "dark",
        imagePrompt: "Billowing grey gunsmoke and sparks drifting across an ornate 18th-century pirate ship captain's stern gallery. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-blackbeard-fuse-beard/3.png",
        audio: "audio/pirate-blackbeard-fuse-beard/3.wav",
        voicedText: "The lit fuses sputtered sparking red embers, wreathing his face in thick grey sulfur smoke like a demon rising from hell.",
        seconds: 7.1
      },
      {
        text: "He wore a shoulder bandolier holding six primed flintlock pistols, ready to draw and fire each one without reloading.",
        mood: "cool",
        imagePrompt: "Leather chest harness holding six brass-mounted flintlock pistols with carved wooden grips arranged across a pirate sea chest. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-blackbeard-fuse-beard/4.png",
        audio: "audio/pirate-blackbeard-fuse-beard/4.wav",
        voicedText: "He wore a shoulder bandolier holding six primed flintlock pistols, ready to draw and fire each one without reloading.",
        seconds: 7.3
      },
      {
        text: "Merchant captains were so paralyzed by his demonic appearance that most surrendered their ships and gold without firing a single shot.",
        mood: "warm",
        imagePrompt: "Piles of Spanish silver eight-real coins, gold doubloons, and rum casks stacked on a sunlit ship deck. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-blackbeard-fuse-beard/5.png",
        audio: "audio/pirate-blackbeard-fuse-beard/5.wav",
        voicedText: "Merchant captains were so paralyzed by his demonic appearance that most surrendered their ships and gold without firing a single shot.",
        seconds: 7.2
      },
      {
        text: "Would you have surrendered immediately if Blackbeard boarded your vessel? Drop a comment below and subscribe!",
        mood: "day",
        imagePrompt: "Calm tropical Caribbean harbor with palm trees on sandy shores and pirate ship anchored in crystal clear water. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pirate-blackbeard-fuse-beard/6.png",
        audio: "audio/pirate-blackbeard-fuse-beard/6.wav",
        voicedText: "Would you have surrendered immediately if Blackbeard boarded your vessel? Drop a comment below and subscribe!",
        seconds: 6.8
      }
    ]
  }
];

console.log(`Writing initial 3 Pirate scripts...`);
for (const s of PIRATE_SCRIPTS) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

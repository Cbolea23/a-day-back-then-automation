import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const MORE_SCRIPTS = [
  // 6. WWII Unexploded Bomb Defusers
  {
    slug: "wwii-unexploded-bomb-defusers",
    title: "Defusing 500-Pound Bombs with a Wrench",
    hook: "One ticking clockwork fuse, zero second chances.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "During the London Blitz, one in ten German aerial bombs failed to explode on impact, burrowing twenty feet into city streets.",
        mood: "cool",
        imagePrompt: "Deep bomb crater in a cracked cobblestone London street with warning ropes and wooden red unexploded bomb signs. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-unexploded-bomb-defusers/1.png",
        audio: "audio/wwii-unexploded-bomb-defusers/1.wav",
        voicedText: "During the London Blitz, one in ten German aerial bombs failed to explode on impact, burrowing twenty feet into city streets.",
        seconds: 7.2
      },
      {
        text: "Royal Engineer bomb disposal officers climbed down dark, muddy timber shafts to disarm 500-pound iron monsters by hand.",
        mood: "dark",
        imagePrompt: "Timber-shored underground trench pit with wooden ladder, water seepage, and the tail fin of an iron aerial bomb half-buried in clay. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-unexploded-bomb-defusers/2.png",
        audio: "audio/wwii-unexploded-bomb-defusers/2.wav",
        voicedText: "Royal Engineer bomb disposal officers climbed down dark, muddy timber shafts to disarm 500-pound iron monsters by hand.",
        seconds: 7.0
      },
      {
        text: "Many bombs were fitted with treacherous clockwork delay fuses or anti-handling booby traps designed to detonate if touched.",
        mood: "dark",
        imagePrompt: "Close-up of a rusted brass bomb detonator ring with precision clockwork gears resting on canvas sandbags under flashlight beam. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-unexploded-bomb-defusers/3.png",
        audio: "audio/wwii-unexploded-bomb-defusers/3.wav",
        voicedText: "Many bombs were fitted with treacherous clockwork delay fuses or anti-handling booby traps designed to detonate if touched.",
        seconds: 7.3
      },
      {
        text: "Officers used copper wrenches and liquid nitrogen to freeze ticking clockwork timers before unscrewing the explosive gaine.",
        mood: "cool",
        imagePrompt: "Brass spanners, insulation gloves, and a copper flask resting beside an open wooden ordnance toolkit. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-unexploded-bomb-defusers/4.png",
        audio: "audio/wwii-unexploded-bomb-defusers/4.wav",
        voicedText: "Officers used copper wrenches and liquid nitrogen to freeze ticking clockwork timers before unscrewing the explosive gaine.",
        seconds: 7.1
      },
      {
        text: "Once disarmed, the hollow bomb casing was paraded through neighborhoods to cheers, while its explosive was safely burned.",
        mood: "warm",
        imagePrompt: "Disarmed iron bomb casing painted with white chalk tallies resting harmlessly on the back of a green army flatbed truck. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-unexploded-bomb-defusers/5.png",
        audio: "audio/wwii-unexploded-bomb-defusers/5.wav",
        voicedText: "Once disarmed, the hollow bomb casing was paraded through neighborhoods to cheers, while its explosive was safely burned.",
        seconds: 6.9
      },
      {
        text: "Could you have held a wrench steady listening to a ticking fuse? Tell us below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Quiet London street bathed in morning sun with sandbags stacked neatly outside a restored brick bakery. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-unexploded-bomb-defusers/6.png",
        audio: "audio/wwii-unexploded-bomb-defusers/6.wav",
        voicedText: "Could you have held a wrench steady listening to a ticking fuse? Tell us below and follow for daily history stories!",
        seconds: 6.8
      }
    ]
  },
  // 7. WWII Deception Ghost Army
  {
    slug: "wwii-deception-ghost-army",
    title: "The 23rd Ghost Army Deception",
    hook: "Artists fooled the German high command with rubber tanks.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In 1944, the US Army created the 23rd Headquarters Special Troops: a top-secret unit made of artists, designers, and sound engineers.",
        mood: "day",
        imagePrompt: "Military camouflage field tent in a French hedgerow with architectural drawing tables, painted canvas rolls, and sound equipment. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-deception-ghost-army/1.png",
        audio: "audio/wwii-deception-ghost-army/1.wav",
        voicedText: "In 1944, the US Army created the 23rd Headquarters Special Troops: a top-secret unit made of artists, designers, and sound engineers.",
        seconds: 7.4
      },
      {
        text: "Their mission wasn't to fight, but to simulate entire thirty-thousand-man armored divisions where no real troops existed.",
        mood: "warm",
        imagePrompt: "Open grassy pasture in Normandy with inflatable rubber Sherman tanks parked under camouflage netting. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-deception-ghost-army/2.png",
        audio: "audio/wwii-deception-ghost-army/2.wav",
        voicedText: "Their mission wasn't to fight, but to simulate entire thirty-thousand-man armored divisions where no real troops existed.",
        seconds: 7.0
      },
      {
        text: "They inflated life-size rubber Sherman tanks and artillery guns with air compressors in under thirty minutes.",
        mood: "day",
        imagePrompt: "Close-up of a rubber inflatable tank showing realistic painted mud splatters and canvas tread markings. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-deception-ghost-army/3.png",
        audio: "audio/wwii-deception-ghost-army/3.wav",
        voicedText: "They inflated life-size rubber Sherman tanks and artillery guns with air compressors in under thirty minutes.",
        seconds: 6.7
      },
      {
        text: "Giant sound trucks blasted pre-recorded audio of clanking tank tracks, coughing engines, and bridge-building audible fifteen miles away.",
        mood: "cool",
        imagePrompt: "Army truck equipped with massive directional loudspeaker horns mounted on the roof facing a misty French forest. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-deception-ghost-army/4.png",
        audio: "audio/wwii-deception-ghost-army/4.wav",
        voicedText: "Giant sound trucks blasted pre-recorded audio of clanking tank tracks, coughing engines, and bridge-building audible fifteen miles away.",
        seconds: 7.3
      },
      {
        text: "To fool aerial reconnaissance, soldiers used real tractors to carve fake tank tread ruts into the mud, complete with phony oil leaks.",
        mood: "cool",
        imagePrompt: "Muddy country lane with deep parallel vehicle tread tracks leading towards empty woods under overcast skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-deception-ghost-army/5.png",
        audio: "audio/wwii-deception-ghost-army/5.wav",
        voicedText: "To fool aerial reconnaissance, soldiers used real tractors to carve fake tank tread ruts into the mud, complete with phony oil leaks.",
        seconds: 7.2
      },
      {
        text: "Their illusions diverted thousands of enemy troops away from real battlefields. Did you know about this secret ghost army?",
        mood: "warm",
        imagePrompt: "Peaceful French meadow bathed in warm sunset with deflated canvas gear packed into wooden army crates. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-deception-ghost-army/6.png",
        audio: "audio/wwii-deception-ghost-army/6.wav",
        voicedText: "Their illusions diverted thousands of enemy troops away from real battlefields. Did you know about this secret ghost army?",
        seconds: 6.8
      }
    ]
  },
  // 8. WWII Pigeon Spies Dickin Medal
  {
    slug: "wwii-pigeon-spies-dickin-medal",
    title: "The Hero War Pigeons of World War II",
    hook: "Flown across enemy flak to deliver secret microfilm.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "During World War II, when radio silence was vital to avoid detection, the British military deployed over 250,000 homing pigeons.",
        mood: "day",
        imagePrompt: "Military mobile pigeon loft truck parked behind sandbagged hedgerow in countryside with open wicker release baskets. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-pigeon-spies-dickin-medal/1.png",
        audio: "audio/wwii-pigeon-spies-dickin-medal/1.wav",
        voicedText: "During World War II, when radio silence was vital to avoid detection, the British military deployed over 250,000 homing pigeons.",
        seconds: 7.2
      },
      {
        text: "RAF bomber crews carried pigeons in sealed floating watertight canisters in case their aircraft was shot down into the freezing sea.",
        mood: "cool",
        imagePrompt: "Wicker aircraft basket lined with straw and blue canvas straps beside an aircraft instrument panel. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-pigeon-spies-dickin-medal/2.png",
        audio: "audio/wwii-pigeon-spies-dickin-medal/2.wav",
        voicedText: "RAF bomber crews carried pigeons in sealed floating watertight canisters in case their aircraft was shot down into the freezing sea.",
        seconds: 7.0
      },
      {
        text: "Downed airmen scribbled their ocean coordinates onto thin tissue paper, rolled it into an aluminum leg capsule, and released the bird.",
        mood: "cool",
        imagePrompt: "Close-up of a tiny silver aluminum message tube with screw cap resting on damp flight chart paper. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-pigeon-spies-dickin-medal/3.png",
        audio: "audio/wwii-pigeon-spies-dickin-medal/3.wav",
        voicedText: "Downed airmen scribbled their ocean coordinates onto thin tissue paper, rolled it into an aluminum leg capsule, and released the bird.",
        seconds: 7.3
      },
      {
        text: "Birds like 'Winkie' flew over one hundred miles across stormy seas through gunfire and hawk attacks to alert rescue sea launches.",
        mood: "cool",
        imagePrompt: "Grey stormy North Sea waves crashing beneath dramatic rolling rain clouds with distant lighthouse beacon. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-pigeon-spies-dickin-medal/4.png",
        audio: "audio/wwii-pigeon-spies-dickin-medal/4.wav",
        voicedText: "Birds like 'Winkie' flew over one hundred miles across stormy seas through gunfire and hawk attacks to alert rescue sea launches.",
        seconds: 7.1
      },
      {
        text: "Thirty-two pigeons were awarded the Dickin Medal—the animal equivalent of the Victoria Cross—for gallantry under enemy fire.",
        mood: "warm",
        imagePrompt: "Bronze military Dickin medal with green, dark brown, and pale blue ribbon resting on velvet cushion in a museum case. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-pigeon-spies-dickin-medal/5.png",
        audio: "audio/wwii-pigeon-spies-dickin-medal/5.wav",
        voicedText: "Thirty-two pigeons were awarded the Dickin Medal—the animal equivalent of the Victoria Cross—for gallantry under enemy fire.",
        seconds: 7.0
      },
      {
        text: "Could you imagine your life depending on a pigeon's sense of direction? Let us know below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Sunlight shining on a peaceful English village church steeple with gentle birds resting on ancient stone parapets. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/wwii-pigeon-spies-dickin-medal/6.png",
        audio: "audio/wwii-pigeon-spies-dickin-medal/6.wav",
        voicedText: "Could you imagine your life depending on a pigeon's sense of direction? Let us know below and follow for daily history stories!",
        seconds: 7.0
      }
    ]
  }
];

for (const s of MORE_SCRIPTS) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

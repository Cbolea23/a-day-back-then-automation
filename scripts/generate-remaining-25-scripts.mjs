import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, { recursive: true });

const SCRIPTS = [
  // ==========================================
  // VIKINGS & NORSE (9 scripts)
  // ==========================================
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
        text: "Before battle commenced, berserkers whipped themselves into a frenzy called 'berserksgangr': foaming at the mouth and howling like wild wolves.",
        mood: "dramatic",
        imagePrompt: "Carved wooden dragon prow of a Norse longship looming through swirling sea mist and cold rain spray. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-berserker-rage/2.png",
        audio: "audio/viking-berserker-rage/2.wav",
        voicedText: "Before battle commenced, berserkers whipped themselves into a frenzy called 'berserksgangr': foaming at the mouth and howling like wild wolves.",
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
  {
    slug: "viking-hygiene-secrets",
    title: "Vikings Were Cleaner Than the English",
    hook: "English monks complained that Norse raiders bathed every Saturday.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Pop culture portrays Vikings as filthy savages covered in mud and grime, but historical records prove the exact opposite.",
        mood: "warm",
        imagePrompt: "Cozy wooden Norse longhouse interior with glowing hearth fire, woven textiles, and clean timber beams in soft light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/1.png",
        audio: "audio/viking-hygiene-secrets/1.wav",
        voicedText: "Pop culture portrays Vikings as filthy savages covered in mud and grime, but historical records prove the exact opposite.",
        seconds: 7.3
      },
      {
        text: "Archaeologists discover personal grooming kits in almost every Viking grave: carved bone hair combs, bronze tweezers, and ear spoons.",
        mood: "warm",
        imagePrompt: "Set of polished carved bone grooming tools: double-sided lice comb, bronze tweezers, and miniature ear spoon in a leather pouch. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/2.png",
        audio: "audio/viking-hygiene-secrets/2.wav",
        voicedText: "Archaeologists discover personal grooming kits in almost every Viking grave: carved bone hair combs, bronze tweezers, and ear spoons.",
        seconds: 7.6
      },
      {
        text: "While Anglo-Saxon peasants rarely washed, Vikings had a mandatory weekly bath day every Saturday called 'Laugardagur'—literally 'Washing Day'.",
        mood: "cool",
        imagePrompt: "Steaming wooden cedar tub filled with hot water and pine branch whisks inside a wooden bathhouse building. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/3.png",
        audio: "audio/viking-hygiene-secrets/3.wav",
        voicedText: "While Anglo-Saxon peasants rarely washed, Vikings had a mandatory weekly bath day every Saturday called 'Laugardagur'—literally 'Washing Day'.",
        seconds: 7.8
      },
      {
        text: "Norse men even bleached their hair and beards golden-blonde using strong lye soap, which also repelled lice and fleas.",
        mood: "warm",
        imagePrompt: "Block of handmade pale lye soap resting beside a wooden bowl of water and folded linen towels on a pine table. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/4.png",
        audio: "audio/viking-hygiene-secrets/4.wav",
        voicedText: "Norse men even bleached their hair and beards golden-blonde using strong lye soap, which also repelled lice and fleas.",
        seconds: 7.4
      },
      {
        text: "English chronicler John of Wallingford bitterly noted that Viking raiders were so clean and well-groomed that English noblewomen fell in love with them.",
        mood: "day",
        imagePrompt: "Finely woven linen tunic with embroidered geometric borders folded neatly next to a silver Thor hammer pendant. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/5.png",
        audio: "audio/viking-hygiene-secrets/5.wav",
        voicedText: "English chronicler John of Wallingford bitterly noted that Viking raiders were so clean and well-groomed that English noblewomen fell in love with them.",
        seconds: 8.2
      },
      {
        text: "Did you know Saturday is still named 'washing day' across Scandinavia today? Share your thoughts and subscribe for more history!",
        mood: "day",
        imagePrompt: "Peaceful Scandinavian fjord landscape with green hillsides and wildflowers beside clear blue waters under morning sunlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-hygiene-secrets/6.png",
        audio: "audio/viking-hygiene-secrets/6.wav",
        voicedText: "Did you know Saturday is still named 'washing day' across Scandinavia today? Share your thoughts and subscribe for more history!",
        seconds: 7.2
      }
    ]
  },
  {
    slug: "viking-sunstone-navigation",
    title: "Navigating Oceans with Magic Sunstones",
    hook: "Vikings sailed open oceans without compasses using glowing calcite crystals.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Centuries before magnetic compasses reached Europe, Viking longships crossed the freezing, fog-shrouded North Atlantic all the way to America.",
        mood: "cool",
        imagePrompt: "Vast cold North Atlantic ocean expanse under heavy grey rolling fog banks and distant jagged ocean swells. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/1.png",
        audio: "audio/viking-sunstone-navigation/1.wav",
        voicedText: "Centuries before magnetic compasses reached Europe, Viking longships crossed the freezing, fog-shrouded North Atlantic all the way to America.",
        seconds: 7.9
      },
      {
        text: "How did Norse captains steer accurately when thick polar mist and snowstorms completely hid the sun and stars for days on end?",
        mood: "dark",
        imagePrompt: "Wooden ship deck of a Viking knarr cargo vessel with coiled hemp ropes and wooden barrels shrouded in thick white fog. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/2.png",
        audio: "audio/viking-sunstone-navigation/2.wav",
        voicedText: "How did Norse captains steer accurately when thick polar mist and snowstorms completely hid the sun and stars for days on end?",
        seconds: 7.5
      },
      {
        text: "Medieval sagas speak of the legendary 'Sólarsteinn'—the mythical Sunstone said to reveal the hidden sun behind overcast skies.",
        mood: "warm",
        imagePrompt: "A transparent rhomboid Iceland spar calcite crystal resting on a weathered wooden chart table catching a glint of light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/3.png",
        audio: "audio/viking-sunstone-navigation/3.wav",
        voicedText: "Medieval sagas speak of the legendary 'Sólarsteinn'—the mythical Sunstone said to reveal the hidden sun behind overcast skies.",
        seconds: 7.7
      },
      {
        text: "Modern scientists discovered this stone was Iceland spar: a birefringent calcite crystal that polarizes ultraviolet light.",
        mood: "cool",
        imagePrompt: "Scientific demonstration showing light splitting into two polarized beams through a clear crystal onto parchment paper. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/4.png",
        audio: "audio/viking-sunstone-navigation/4.wav",
        voicedText: "Modern scientists discovered this stone was Iceland spar: a birefringent calcite crystal that polarizes ultraviolet light.",
        seconds: 7.5
      },
      {
        text: "By rotating the crystal until both split light beams matched in brightness, navigators pinpointed the sun's exact heading within one degree.",
        mood: "warm",
        imagePrompt: "Carved wooden sun compass dial disc with notched hour marks and central gnomon peg resting beside an Iceland spar crystal. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/5.png",
        audio: "audio/viking-sunstone-navigation/5.wav",
        voicedText: "By rotating the crystal until both split light beams matched in brightness, navigators pinpointed the sun's exact heading within one degree.",
        seconds: 8.2
      },
      {
        text: "Ancient magic turned out to be pure optical science! What ancient invention fascinates you most? Subscribe for more history secrets!",
        mood: "day",
        imagePrompt: "Golden sun setting over the open ocean horizon casting warm amber light across gentle rolling waves. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-sunstone-navigation/6.png",
        audio: "audio/viking-sunstone-navigation/6.wav",
        voicedText: "Ancient magic turned out to be pure optical science! What ancient invention fascinates you most? Subscribe for more history secrets!",
        seconds: 7.3
      }
    ]
  },
  {
    slug: "viking-longhouse-winter-smoke",
    title: "Living with 30 People in a Smoky Longhouse",
    hook: "In the dead of winter, an entire Norse clan slept around a trench fire with no chimney.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "When sub-zero blizzards hit Scandinavia, survival meant crowding an entire extended family into a single turf-insulated longhouse.",
        mood: "cool",
        imagePrompt: "Snow-covered Norse turf longhouse with grass roof nestled against dark winter pine woods under starry northern lights. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-longhouse-winter-smoke/1.png",
        audio: "audio/viking-longhouse-winter-smoke/1.wav",
        voicedText: "When sub-zero blizzards hit Scandinavia, survival meant crowding an entire extended family into a single turf-insulated longhouse.",
        seconds: 7.8
      },
      {
        text: "Down the center ran a long open hearth trench burning peat, birch logs, and seal blubber. But there was no chimney.",
        mood: "warm",
        imagePrompt: "Long stone-lined open hearth pit burning glowing peat and logs in the center of an earthen longhouse floor. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-longhouse-winter-smoke/2.png",
        audio: "audio/viking-longhouse-winter-smoke/2.wav",
        voicedText: "Down the center ran a long open hearth trench burning peat, birch logs, and seal blubber. But there was no chimney.",
        seconds: 7.5
      },
      {
        text: "Smoke escaped only through small ceiling slits, leaving a thick haze hanging over everyone's heads and blackening the rafters with soot.",
        mood: "dark",
        imagePrompt: "Soot-blackened timber rafters under a steep thatched roof with drifting grey smoke catching light from a ceiling vent. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-longhouse-winter-smoke/3.png",
        audio: "audio/viking-longhouse-winter-smoke/3.wav",
        voicedText: "Smoke escaped only through small ceiling slits, leaving a thick haze hanging over everyone's heads and blackening the rafters with soot.",
        seconds: 7.7
      },
      {
        text: "To preserve body heat, livestock including dairy cows, sheep, and pigs were housed at the far end of the same building behind wattle hurdles.",
        mood: "warm",
        imagePrompt: "Woven wooden wattle barn partition in a longhouse with fresh straw bedding, wooden pitchforks, and copper milk pails. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-longhouse-winter-smoke/4.png",
        audio: "audio/viking-longhouse-winter-smoke/4.wav",
        voicedText: "To preserve body heat, livestock including dairy cows, sheep, and pigs were housed at the far end of the same building behind wattle hurdles.",
        seconds: 8.0
      },
      {
        text: "Up to thirty people slept on raised wooden benches lined with heather and sheepskins, listening to skaldic poets recite epic sagas in the gloom.",
        mood: "warm",
        imagePrompt: "Wooden bench lined with thick wool blankets, sheepskins, and a carved horn cup resting near the glowing hearth embers. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-longhouse-winter-smoke/5.png",
        audio: "audio/viking-longhouse-winter-smoke/5.wav",
        voicedText: "Up to thirty people slept on raised wooden benches lined with heather and sheepskins, listening to skaldic poets recite epic sagas in the gloom.",
        seconds: 8.2
      },
      {
        text: "Could you have endured months trapped in a dark, smoky longhouse? Tell us your reaction and subscribe for daily history shorts!",
        mood: "day",
        imagePrompt: "Morning light breaking over a quiet Norse village as smoke gently curls from longhouse roofs into the crisp winter air. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-longhouse-winter-smoke/6.png",
        audio: "audio/viking-longhouse-winter-smoke/6.wav",
        voicedText: "Could you have endured months trapped in a dark, smoky longhouse? Tell us your reaction and subscribe for daily history shorts!",
        seconds: 7.2
      }
    ]
  },
  {
    slug: "viking-blood-eagle-myth",
    title: "The Gruesome Blood Eagle: Fact or Fiction?",
    hook: "Did Vikings really carve enemy ribs into eagle wings, or was it a literary myth?",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In Norse sagas, the most terrifying punishment mentioned is the 'Blood Eagle'—an agonizing execution allegedly inflicted on bitter enemies.",
        mood: "dark",
        imagePrompt: "Dark misty Norse ritual stone grove with mossy standing rune stones under ominous grey storm clouds. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-blood-eagle-myth/1.png",
        audio: "audio/viking-blood-eagle-myth/1.wav",
        voicedText: "In Norse sagas, the most terrifying punishment mentioned is the 'Blood Eagle'—an agonizing execution allegedly inflicted on bitter enemies.",
        seconds: 7.8
      },
      {
        text: "According to late Icelandic poems, the victim's spine was split open, ribs pried outward like wings, and lungs pulled out into salt.",
        mood: "dark",
        imagePrompt: "Ancient iron sacrificial knife with carved antler handle resting upon a weathered stone altar slab. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-blood-eagle-myth/2.png",
        audio: "audio/viking-blood-eagle-myth/2.wav",
        voicedText: "According to late Icelandic poems, the victim's spine was split open, ribs pried outward like wings, and lungs pulled out into salt.",
        seconds: 7.9
      },
      {
        text: "Victims supposedly included King Aella of Northumbria and Halfdan Long-Leg, sacrificed directly to Odin as vengeance.",
        mood: "dramatic",
        imagePrompt: "Carved wooden raven banner hanging limp from a wooden post against a bleak Northumberland moorland horizon. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-blood-eagle-myth/3.png",
        audio: "audio/viking-blood-eagle-myth/3.wav",
        voicedText: "Victims supposedly included King Aella of Northumbria and Halfdan Long-Leg, sacrificed directly to Odin as vengeance.",
        seconds: 7.6
      },
      {
        text: "However, medical historians note the victim would have suffocated within seconds of the rib cage opening, making an elaborate ritual physically impossible.",
        mood: "cool",
        imagePrompt: "Ancient manuscript page in a monastery scriptorium with faded ink text describing northern pagan battles. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-blood-eagle-myth/4.png",
        audio: "audio/viking-blood-eagle-myth/4.wav",
        voicedText: "However, medical historians note the victim would have suffocated within seconds of the rib cage opening, making an elaborate ritual physically impossible.",
        seconds: 8.2
      },
      {
        text: "Many scholars believe Christian scribes mistranslated kennings—poetic metaphors describing carrion eagles feeding on slain soldiers' backs.",
        mood: "warm",
        imagePrompt: "Two black ravens perched high upon a bare winter oak tree overlooking a peaceful Scandinavian valley. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-blood-eagle-myth/5.png",
        audio: "audio/viking-blood-eagle-myth/5.wav",
        voicedText: "Many scholars believe Christian scribes mistranslated kennings—poetic metaphors describing carrion eagles feeding on slain soldiers' backs.",
        seconds: 8.0
      },
      {
        text: "Was it a real pagan horror or medieval sensationalism? Share your take in the comments and subscribe for more mythbusters!",
        mood: "day",
        imagePrompt: "Viking memorial runestone illuminated by bright afternoon sun standing proud among green grassy hills. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-blood-eagle-myth/6.png",
        audio: "audio/viking-blood-eagle-myth/6.wav",
        voicedText: "Was it a real pagan horror or medieval sensationalism? Share your take in the comments and subscribe for more mythbusters!",
        seconds: 7.2
      }
    ]
  },
  {
    slug: "viking-shieldmaidens-real",
    title: "Real Female Viking Warriors",
    hook: "DNA tests on a 10th-century warrior grave proved the high-ranking chief was a woman.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "For over a century, historians claimed Viking 'shieldmaidens' like Lagertha were merely mythical figures created for epic poetry.",
        mood: "cool",
        imagePrompt: "Vast ancient Swedish burial mound covered in wild meadow grass under a soft dramatic overcast sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-shieldmaidens-real/1.png",
        audio: "audio/viking-shieldmaidens-real/1.wav",
        voicedText: "For over a century, historians claimed Viking 'shieldmaidens' like Lagertha were merely mythical figures created for epic poetry.",
        seconds: 7.5
      },
      {
        text: "In 1878, archaeologists in Birka, Sweden uncovered grave Bj 581: the ultimate archetype of a high-status Viking military officer.",
        mood: "warm",
        imagePrompt: "Excavated stone-lined chamber grave showing arrangement of ancient iron weapons and grave goods on earth. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-shieldmaidens-real/2.png",
        audio: "audio/viking-shieldmaidens-real/2.wav",
        voicedText: "In 1878, archaeologists in Birka, Sweden uncovered grave Bj 581: the ultimate archetype of a high-status Viking military officer.",
        seconds: 7.8
      },
      {
        text: "The chamber contained a deadly steel sword, battle axe, fighting knife, two spears, twenty-five armor-piercing arrows, and two sacrificed warhorses.",
        mood: "dark",
        imagePrompt: "Pattern-welded iron Viking sword with silver-inlaid hilt and an iron battle axe resting upon a leather saddle. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-shieldmaidens-real/3.png",
        audio: "audio/viking-shieldmaidens-real/3.wav",
        voicedText: "The chamber contained a deadly steel sword, battle axe, fighting knife, two spears, twenty-five armor-piercing arrows, and two sacrificed warhorses.",
        seconds: 8.0
      },
      {
        text: "Crucially, it held a complete set of gaming pieces and a hnefatafl board—indicating the deceased was a strategic battle commander.",
        mood: "warm",
        imagePrompt: "Carved bone and walrus ivory hnefatafl Viking board game pieces arranged on a wooden board table. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-shieldmaidens-real/4.png",
        audio: "audio/viking-shieldmaidens-real/4.wav",
        voicedText: "Crucially, it held a complete set of gaming pieces and a hnefatafl board—indicating the deceased was a strategic battle commander.",
        seconds: 7.6
      },
      {
        text: "In 2017, genomic DNA analysis shocked the archaeological world by proving conclusively that the warrior had two X chromosomes: she was biologically female.",
        mood: "cool",
        imagePrompt: "Intricately woven silver wire posament headband and silver brooches resting on fine dark woolen fabric. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-shieldmaidens-real/5.png",
        audio: "audio/viking-shieldmaidens-real/5.wav",
        voicedText: "In 2017, genomic DNA analysis shocked the archaeological world by proving conclusively that the warrior had two X chromosomes: she was biologically female.",
        seconds: 8.5
      },
      {
        text: "Norse women commanded respect on and off the battlefield. What do you think of the Birka warrior? Subscribe for more untold history!",
        mood: "day",
        imagePrompt: "Viking dragon-headed warship sailing proudly across calm Scandinavian coastal waters in bright sunlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-shieldmaidens-real/6.png",
        audio: "audio/viking-shieldmaidens-real/6.wav",
        voicedText: "Norse women commanded respect on and off the battlefield. What do you think of the Birka warrior? Subscribe for more untold history!",
        seconds: 7.4
      }
    ]
  },
  {
    slug: "viking-valhalla-diet",
    title: "What Vikings Thought Heaven Was Like",
    hook: "In Valhalla, warriors hacked each other to pieces by morning and feasted on a magic boar by night.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "For a Norse warrior, falling in glorious combat didn't mean floating among quiet clouds—it meant entering Odin's majestic hall of Valhalla.",
        mood: "dramatic",
        imagePrompt: "Colossal wooden grand hall with towering carved timber pillars and a roof thatched with gleaming golden shields. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-valhalla-diet/1.png",
        audio: "audio/viking-valhalla-diet/1.wav",
        voicedText: "For a Norse warrior, falling in glorious combat didn't mean floating among quiet clouds—it meant entering Odin's majestic hall of Valhalla.",
        seconds: 7.8
      },
      {
        text: "Valhalla featured 540 enormous gates, each wide enough for eight hundred warriors to march through shoulder to shoulder.",
        mood: "warm",
        imagePrompt: "Massive carved wooden oak gates reinforced with heavy iron bands and Viking knotwork carvings swinging open. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-valhalla-diet/2.png",
        audio: "audio/viking-valhalla-diet/2.wav",
        voicedText: "Valhalla featured 540 enormous gates, each wide enough for eight hundred warriors to march through shoulder to shoulder.",
        seconds: 7.5
      },
      {
        text: "Every morning, the einherjar warriors marched onto the plains of Idavoll to hack each other to pieces in brutal combat practice.",
        mood: "dark",
        imagePrompt: "Misty grassy battlefield meadow scattered with split round wooden shields and dropped iron swords. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-valhalla-diet/3.png",
        audio: "audio/viking-valhalla-diet/3.wav",
        voicedText: "Every morning, the einherjar warriors marched onto the plains of Idavoll to hack each other to pieces in brutal combat practice.",
        seconds: 7.6
      },
      {
        text: "By dusk, all wounds magically regenerated, and the warriors returned to the hall to banquet for eternity.",
        mood: "warm",
        imagePrompt: "Immense wooden banquet table laden with wooden trenchers, steaming roasted meats, and carved drinking horns. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-valhalla-diet/4.png",
        audio: "audio/viking-valhalla-diet/4.wav",
        voicedText: "By dusk, all wounds magically regenerated, and the warriors returned to the hall to banquet for eternity.",
        seconds: 7.4
      },
      {
        text: "They feasted on Saehrimnir—a cosmic wild boar boiled in the cauldron Eldhrimnir that miraculously came back to life whole every single night.",
        mood: "warm",
        imagePrompt: "Enormous black iron cauldron bubbling over roaring hearth flames in a great medieval hall. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-valhalla-diet/5.png",
        audio: "audio/viking-valhalla-diet/5.wav",
        voicedText: "They feasted on Saehrimnir—a cosmic wild boar boiled in the cauldron Eldhrimnir that miraculously came back to life whole every single night.",
        seconds: 8.2
      },
      {
        text: "Endless mead and regenerating bacon: the ultimate Viking warrior paradise. Would you want to go there? Subscribe for more Norse lore!",
        mood: "day",
        imagePrompt: "Polished bull horn drinking vessel tipped in silver resting beside a bowl of golden honeycomb under sunlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-valhalla-diet/6.png",
        audio: "audio/viking-valhalla-diet/6.wav",
        voicedText: "Endless mead and regenerating bacon: the ultimate Viking warrior paradise. Would you want to go there? Subscribe for more Norse lore!",
        seconds: 7.4
      }
    ]
  },
  {
    slug: "viking-funeral-ship",
    title: "Burning Ships and Viking Burials",
    hook: "Did chieftains really burn on open seas, or were they buried deep underground?",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Hollywood movies almost always show a dead Viking king set adrift on a longship, with flaming arrows launched to set it ablaze.",
        mood: "dark",
        imagePrompt: "Viking wooden longship silhouetted against a dark sea with burning torches flaming along the shoreline at dusk. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-funeral-ship/1.png",
        audio: "audio/viking-funeral-ship/1.wav",
        voicedText: "Hollywood movies almost always show a dead Viking king set adrift on a longship, with flaming arrows launched to set it ablaze.",
        seconds: 7.8
      },
      {
        text: "While floating pyres occasionally happened, most wealthy chieftains were buried in full-sized ships dragged inland into deep earth mounds.",
        mood: "warm",
        imagePrompt: "Massive seventy-foot oak Viking ship resting inside a deep earthen burial trench before being covered in clay and turf. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-funeral-ship/2.png",
        audio: "audio/viking-funeral-ship/2.wav",
        voicedText: "While floating pyres occasionally happened, most wealthy chieftains were buried in full-sized ships dragged inland into deep earth mounds.",
        seconds: 7.9
      },
      {
        text: "The famous Oseberg ship in Norway was buried under airtight blue clay, perfectly preserving intricate dragon woodcarvings and textiles for 1,200 years.",
        mood: "cool",
        imagePrompt: "Intricately carved spiral animal woodcarvings on the prow of the historic Oseberg longship. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-funeral-ship/3.png",
        audio: "audio/viking-funeral-ship/3.wav",
        voicedText: "The famous Oseberg ship in Norway was buried under airtight blue clay, perfectly preserving intricate dragon woodcarvings and textiles for 1,200 years.",
        seconds: 8.2
      },
      {
        text: "Burial ships carried an entire afterlife voyage: tapestries, iron sleighs, horses, hunting dogs, and barrels of apples and grain.",
        mood: "warm",
        imagePrompt: "Carved wooden ceremonial Viking sleigh with ornate animal carvings and woven wool tapestries inside a burial chamber. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-funeral-ship/4.png",
        audio: "audio/viking-funeral-ship/4.wav",
        voicedText: "Burial ships carried an entire afterlife voyage: tapestries, iron sleighs, horses, hunting dogs, and barrels of apples and grain.",
        seconds: 7.6
      },
      {
        text: "The ship was believed to carry the deceased across the mystical sea to the realm of the ancestors or the halls of Hel.",
        mood: "dark",
        imagePrompt: "Moonlit mist rising over a tranquil Norwegian fjord between towering sheer granite cliff faces. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-funeral-ship/5.png",
        audio: "audio/viking-funeral-ship/5.wav",
        voicedText: "The ship was believed to carry the deceased across the mystical sea to the realm of the ancestors or the halls of Hel.",
        seconds: 7.5
      },
      {
        text: "A grand burial for the ultimate seafaring people. How would you want to be remembered? Tell us and subscribe for more history!",
        mood: "day",
        imagePrompt: "Green rolling coastal burial mound dotted with wild flowers overlooking calm blue fjord waters in the morning sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-funeral-ship/6.png",
        audio: "audio/viking-funeral-ship/6.wav",
        voicedText: "A grand burial for the ultimate seafaring people. How would you want to be remembered? Tell us and subscribe for more history!",
        seconds: 7.3
      }
    ]
  },
  {
    slug: "viking-runestones-graffiti",
    title: "Viking Graffiti in Constantinople",
    hook: "Inside the Hagia Sophia cathedral, you can still read runes saying: 'Halfdan was here.'",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the 9th and 10th centuries, Norse warriors sailed down Russian riverways to reach Constantinople—which they called 'Miklagard', the Great City.",
        mood: "warm",
        imagePrompt: "Magnificent view of medieval Constantinople with golden domes, marble columns, and towering harbor walls beside the blue Bosphorus. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-runestones-graffiti/1.png",
        audio: "audio/viking-runestones-graffiti/1.wav",
        voicedText: "In the 9th and 10th centuries, Norse warriors sailed down Russian riverways to reach Constantinople—which they called 'Miklagard', the Great City.",
        seconds: 8.0
      },
      {
        text: "The Byzantine Emperor was so impressed by their towering height and fierce loyalty that he hired them as his personal elite bodyguard: the Varangian Guard.",
        mood: "cool",
        imagePrompt: "Two-handed Danish battleaxe resting against a gilded Byzantine marble wall with purple imperial drapery. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-runestones-graffiti/2.png",
        audio: "audio/viking-runestones-graffiti/2.wav",
        voicedText: "The Byzantine Emperor was so impressed by their towering height and fierce loyalty that he hired them as his personal elite bodyguard: the Varangian Guard.",
        seconds: 8.2
      },
      {
        text: "While standing guard through endless, boring church services in the Hagia Sophia cathedral, one bored Norseman took out his iron knife.",
        mood: "warm",
        imagePrompt: "Sunlight streaming through towering arched clerestory windows onto shimmering golden mosaics in an ancient cathedral balcony. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-runestones-graffiti/3.png",
        audio: "audio/viking-runestones-graffiti/3.wav",
        voicedText: "While standing guard through endless, boring church services in the Hagia Sophia cathedral, one bored Norseman took out his iron knife.",
        seconds: 7.7
      },
      {
        text: "High on the southern gallery's marble balustrade, he etched authentic Futhark runes that remain visible to visitors today.",
        mood: "cool",
        imagePrompt: "Close-up of ancient Norse runes carved into smooth white marble stone balustrade in soft gallery lighting. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-runestones-graffiti/4.png",
        audio: "audio/viking-runestones-graffiti/4.wav",
        voicedText: "High on the southern gallery's marble balustrade, he etched authentic Futhark runes that remain visible to visitors today.",
        seconds: 7.5
      },
      {
        text: "Runologists translated the 1,100-year-old inscription: 'Halfdan carved these runes'—the medieval equivalent of 'Halfdan was here'.",
        mood: "warm",
        imagePrompt: "Detailed view of the weathered runic letters 'Halvdan' etched into ancient classical stone. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-runestones-graffiti/5.png",
        audio: "audio/viking-runestones-graffiti/5.wav",
        voicedText: "Runologists translated the 1,100-year-old inscription: 'Halfdan carved these runes'—the medieval equivalent of 'Halfdan was here'.",
        seconds: 7.8
      },
      {
        text: "Human nature never changes across a thousand years! Have you ever seen this graffiti in person? Subscribe for more history gems!",
        mood: "day",
        imagePrompt: "Panoramic view of Istanbul's historic skyline with golden dome reflections on the Bosphorus strait at sunrise. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/viking-runestones-graffiti/6.png",
        audio: "audio/viking-runestones-graffiti/6.wav",
        voicedText: "Human nature never changes across a thousand years! Have you ever seen this graffiti in person? Subscribe for more history gems!",
        seconds: 7.3
      }
    ]
  },

  // ==========================================
  // ANCIENT ROME & COLOSSEUM (2 scripts)
  // ==========================================
  {
    slug: "gladiator-diet-barley-men",
    title: "Why Gladiators Were Fat Vegetarians",
    hook: "Gladiators weren't shredded bodybuilders—they were stuffed with barley and bean porridge.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Hollywood films always depict Roman gladiators with chiseled abs and low body fat. But forensic archaeology proves that's completely false.",
        mood: "cool",
        imagePrompt: "Dramatic sandy arena floor of the Colosseum with towering empty stone arches under a hot Mediterranean sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gladiator-diet-barley-men/1.png",
        audio: "audio/gladiator-diet-barley-men/1.wav",
        voicedText: "Hollywood films always depict Roman gladiators with chiseled abs and low body fat. But forensic archaeology proves that's completely false.",
        seconds: 7.9
      },
      {
        text: "Chemical analysis of bones from a gladiator cemetery in Ephesus revealed they ate an almost entirely vegetarian diet based on barley and legumes.",
        mood: "warm",
        imagePrompt: "Terracotta bowls filled with hulled barley grain, dried fava beans, and coarse wheat flour on a rustic wooden table. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gladiator-diet-barley-men/2.png",
        audio: "audio/gladiator-diet-barley-men/2.wav",
        voicedText: "Chemical analysis of bones from a gladiator cemetery in Ephesus revealed they ate an almost entirely vegetarian diet based on barley and legumes.",
        seconds: 8.0
      },
      {
        text: "Romans called them 'hordearii'—literally 'barley-men'. Their trainers deliberately fattened them up with thick carbohydrate porridge.",
        mood: "warm",
        imagePrompt: "Iron pot of steaming thick barley porridge simmering over an outdoor hearth with a wooden ladle. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gladiator-diet-barley-men/3.png",
        audio: "audio/gladiator-diet-barley-men/3.wav",
        voicedText: "Romans called them 'hordearii'—literally 'barley-men'. Their trainers deliberately fattened them up with thick carbohydrate porridge.",
        seconds: 7.7
      },
      {
        text: "A thick layer of subcutaneous fat was vital armor: it absorbed flesh cuts without exposing nerves, major blood vessels, or vital organs.",
        mood: "dark",
        imagePrompt: "Heavy bronze gladiator helmet with grilled face visor and dented rectangular curved scutum shield resting on stone. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gladiator-diet-barley-men/4.png",
        audio: "audio/gladiator-diet-barley-men/4.wav",
        voicedText: "A thick layer of subcutaneous fat was vital armor: it absorbed flesh cuts without exposing nerves, major blood vessels, or vital organs.",
        seconds: 8.1
      },
      {
        text: "Bloody surface cuts looked dramatic to cheering crowds while keeping the valuable trained fighters alive to compete another day.",
        mood: "dramatic",
        imagePrompt: "Sunlight shining down onto the red sand of an ancient amphitheater floor with abandoned wooden practice swords. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gladiator-diet-barley-men/5.png",
        audio: "audio/gladiator-diet-barley-men/5.wav",
        voicedText: "Bloody surface cuts looked dramatic to cheering crowds while keeping the valuable trained fighters alive to compete another day.",
        seconds: 7.6
      },
      {
        text: "They even drank a tonic of plant ash to fortify bone density. Did this gladiator fact surprise you? Subscribe for more Roman secrets!",
        mood: "day",
        imagePrompt: "Bronze roman oil lamp and small glass flask beside a gladius short sword on a Roman villa terrace. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/gladiator-diet-barley-men/6.png",
        audio: "audio/gladiator-diet-barley-men/6.wav",
        voicedText: "They even drank a tonic of plant ash to fortify bone density. Did this gladiator fact surprise you? Subscribe for more Roman secrets!",
        seconds: 7.4
      }
    ]
  },
  {
    slug: "roman-firefighters-vigiles",
    title: "Rome's Corrupt Fire Brigade",
    hook: "Marcus Crassus made billions by negotiating real estate while the house burned down.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In ancient Rome, cramped wooden apartment blocks called insulae caught fire constantly from charcoal braziers and oil lamps.",
        mood: "dark",
        imagePrompt: "Dense narrow ancient Roman cobblestone street with multi-story timber-frame apartment buildings under a twilight sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/roman-firefighters-vigiles/1.png",
        audio: "audio/roman-firefighters-vigiles/1.wav",
        voicedText: "In ancient Rome, cramped wooden apartment blocks called insulae caught fire constantly from charcoal braziers and oil lamps.",
        seconds: 7.8
      },
      {
        text: "Rome's richest oligarch, Marcus Licinius Crassus, saw disaster as the greatest real estate racket in history.",
        mood: "warm",
        imagePrompt: "Ornate Roman writing desk with bronze coin scales, stacks of silver denarii coins, and wax tally tablets. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/roman-firefighters-vigiles/2.png",
        audio: "audio/roman-firefighters-vigiles/2.wav",
        voicedText: "Rome's richest oligarch, Marcus Licinius Crassus, saw disaster as the greatest real estate racket in history.",
        seconds: 7.3
      },
      {
        text: "Crassus bought over 500 enslaved architects and builders to form his private, profit-driven firefighting brigade.",
        mood: "cool",
        imagePrompt: "Row of leather water buckets, iron axes, and demolition hooks arranged neatly outside a Roman stone depot. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/roman-firefighters-vigiles/3.png",
        audio: "audio/roman-firefighters-vigiles/3.wav",
        voicedText: "Crassus bought over 500 enslaved architects and builders to form his private, profit-driven firefighting brigade.",
        seconds: 7.4
      },
      {
        text: "When an insula caught fire, his crew rushed to the scene but refused to lift a finger while Crassus offered to buy the property for pennies.",
        mood: "dramatic",
        imagePrompt: "Distant glow of flickering orange flames and grey smoke rising into the night sky above Roman clay tile rooftops. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/roman-firefighters-vigiles/4.png",
        audio: "audio/roman-firefighters-vigiles/4.wav",
        voicedText: "When an insula caught fire, his crew rushed to the scene but refused to lift a finger while Crassus offered to buy the property for pennies.",
        seconds: 8.2
      },
      {
        text: "If the panicked homeowner agreed to sell at a ruined discount, the men put out the flames. If not, they stood by and watched it burn to ash.",
        mood: "dark",
        imagePrompt: "Charred wooden beams and broken terracotta tiles smoldering among smoking ash on an ancient street corner. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/roman-firefighters-vigiles/5.png",
        audio: "audio/roman-firefighters-vigiles/5.wav",
        voicedText: "If the panicked homeowner agreed to sell at a ruined discount, the men put out the flames. If not, they stood by and watched it burn to ash.",
        seconds: 8.0
      },
      {
        text: "Eventually Augustus created the public 'Vigiles' brigade to stop the extortion. What do you think of Crassus? Subscribe for more crazy history!",
        mood: "day",
        imagePrompt: "Sunlit panoramic view of ancient Rome's Forum with marble basilicas and triumphal arches under clear blue skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/roman-firefighters-vigiles/6.png",
        audio: "audio/roman-firefighters-vigiles/6.wav",
        voicedText: "Eventually Augustus created the public 'Vigiles' brigade to stop the extortion. What do you think of Crassus? Subscribe for more crazy history!",
        seconds: 7.6
      }
    ]
  },

  // ==========================================
  // ANCIENT EGYPT & MESOPOTAMIA (6 scripts)
  // ==========================================
  {
    slug: "egyptian-tomb-robber-trial",
    title: "How Egyptians Caught Tomb Raiders",
    hook: "Breaking into a Pharaoh's tomb carried the gruesome death penalty of impalement on a wooden stake.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "The Valley of the Kings held incalculable wealth in solid gold, lapis lazuli, and fine linen—making it the prime target for daring thieves.",
        mood: "warm",
        imagePrompt: "Dramatic rugged desert limestone valley with sun-scorched cliffs and hidden tomb entrances under a blazing Egyptian sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-tomb-robber-trial/1.png",
        audio: "audio/egyptian-tomb-robber-trial/1.wav",
        voicedText: "The Valley of the Kings held incalculable wealth in solid gold, lapis lazuli, and fine linen—making it the prime target for daring thieves.",
        seconds: 8.0
      },
      {
        text: "During the 20th Dynasty, high inflation caused rampant tomb looting, leading to famous court trials recorded on the Mayer Papyrus.",
        mood: "warm",
        imagePrompt: "Ancient Egyptian papyrus scroll unfurled showing black and red hieratic script beside a reed pen and bronze inkwell. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-tomb-robber-trial/2.png",
        audio: "audio/egyptian-tomb-robber-trial/2.wav",
        voicedText: "During the 20th Dynasty, high inflation caused rampant tomb looting, leading to famous court trials recorded on the Mayer Papyrus.",
        seconds: 7.8
      },
      {
        text: "Grave robbers tunneled through solid rock by fire-setting, burning the wooden coffins inside to quickly melt and peel off pure gold leaf.",
        mood: "dark",
        imagePrompt: "Flickering torchlight illuminating a narrow rock-hewn tunnel with broken plaster seals and gold flakes on the limestone dust. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-tomb-robber-trial/3.png",
        audio: "audio/egyptian-tomb-robber-trial/3.wav",
        voicedText: "Grave robbers tunneled through solid rock by fire-setting, burning the wooden coffins inside to quickly melt and peel off pure gold leaf.",
        seconds: 8.0
      },
      {
        text: "To extract confessions, royal judges used 'bastinado': beating suspects on the soles of their feet and twisting their hands with wooden batons.",
        mood: "cool",
        imagePrompt: "Egyptian court chamber in Thebes with carved stone lotus pillars and ceremonial wooden judgment chairs. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-tomb-robber-trial/4.png",
        audio: "audio/egyptian-tomb-robber-trial/4.wav",
        voicedText: "To extract confessions, royal judges used 'bastinado': beating suspects on the soles of their feet and twisting their hands with wooden batons.",
        seconds: 8.1
      },
      {
        text: "Once convicted of desecrating the divine dead, robbers were sentenced to public impalement on sharpened stakes outside the city gates.",
        mood: "dark",
        imagePrompt: "Silhouetted wooden stakes standing on a windswept sand dune ridge outside the stone city walls at sunset. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-tomb-robber-trial/5.png",
        audio: "audio/egyptian-tomb-robber-trial/5.wav",
        voicedText: "Once convicted of desecrating the divine dead, robbers were sentenced to public impalement on sharpened stakes outside the city gates.",
        seconds: 7.8
      },
      {
        text: "Even ancient curses couldn't stop desperate thieves. Would you risk a Pharaoh's tomb? Share your thoughts and subscribe for more!",
        mood: "day",
        imagePrompt: "Golden Egyptian pectoral necklace with turquoise scarab inlay catching the morning sunlight over sand dunes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-tomb-robber-trial/6.png",
        audio: "audio/egyptian-tomb-robber-trial/6.wav",
        voicedText: "Even ancient curses couldn't stop desperate thieves. Would you risk a Pharaoh's tomb? Share your thoughts and subscribe for more!",
        seconds: 7.3
      }
    ]
  },
  {
    slug: "egyptian-crocodile-god-sobek",
    title: "Worshipping 12-Foot Sacred Crocodiles",
    hook: "In ancient Fayum, priests kept a live Nile crocodile draped in gold earrings and crystal bracelets.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "To the ancient Egyptians, the Nile crocodile wasn't just a deadly river predator—it was the living embodiment of Sobek, god of fertility and power.",
        mood: "warm",
        imagePrompt: "Lush green papyrus reeds swaying gently along the banks of the blue Nile river under a bright Egyptian morning sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-crocodile-god-sobek/1.png",
        audio: "audio/egyptian-crocodile-god-sobek/1.wav",
        voicedText: "To the ancient Egyptians, the Nile crocodile wasn't just a deadly river predator—it was the living embodiment of Sobek, god of fertility and power.",
        seconds: 8.0
      },
      {
        text: "In the city of Crocodilopolis, priests handpicked one sacred crocodile called Petsuchos to live in a luxurious temple lake.",
        mood: "cool",
        imagePrompt: "Tranquil rectangular temple stone pool surrounded by carved sandstone columns and flowering blue lotus waterlilies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-crocodile-god-sobek/2.png",
        audio: "audio/egyptian-crocodile-god-sobek/2.wav",
        voicedText: "In the city of Crocodilopolis, priests handpicked one sacred crocodile called Petsuchos to live in a luxurious temple lake.",
        seconds: 7.5
      },
      {
        text: "Priests pierced its ears with gold and turquoise earrings, and fitted its forelegs with sparkling crystal and electrum bracelets.",
        mood: "warm",
        imagePrompt: "Polished gold hoop earrings and beaded turquoise bracelets resting on a royal linen cushion beside temple incense burners. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-crocodile-god-sobek/3.png",
        audio: "audio/egyptian-crocodile-god-sobek/3.wav",
        voicedText: "Priests pierced its ears with gold and turquoise earrings, and fitted its forelegs with sparkling crystal and electrum bracelets.",
        seconds: 7.8
      },
      {
        text: "Visiting Greek tourists like Strabo watched in awe as priests pried open the giant reptile's jaws to feed it cakes, roasted meat, and honey wine.",
        mood: "warm",
        imagePrompt: "Golden platters of honey pastries, roasted fowl, and an ornate terracotta flagon of sweetened wine by the poolside. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-crocodile-god-sobek/4.png",
        audio: "audio/egyptian-crocodile-god-sobek/4.wav",
        voicedText: "Visiting Greek tourists like Strabo watched in awe as priests pried open the giant reptile's jaws to feed it cakes, roasted meat, and honey wine.",
        seconds: 8.2
      },
      {
        text: "When Petsuchos died of old age, priests embalmed the massive creature with sacred resins and entombed it in an underground catacomb.",
        mood: "dark",
        imagePrompt: "Underground stone catacomb lined with linen-wrapped animal mummies decorated with painted gesso masks. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-crocodile-god-sobek/5.png",
        audio: "audio/egyptian-crocodile-god-sobek/5.wav",
        voicedText: "When Petsuchos died of old age, priests embalmed the massive creature with sacred resins and entombed it in an underground catacomb.",
        seconds: 8.0
      },
      {
        text: "Would you have dared to feed a 12-foot sacred crocodile honey cake? Tell us below and subscribe for more amazing history!",
        mood: "day",
        imagePrompt: "Carved sandstone relief of Sobek with crocodile head holding an ankh key of life bathed in warm desert sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-crocodile-god-sobek/6.png",
        audio: "audio/egyptian-crocodile-god-sobek/6.wav",
        voicedText: "Would you have dared to feed a 12-foot sacred crocodile honey cake? Tell us below and subscribe for more amazing history!",
        seconds: 7.2
      }
    ]
  },
  {
    slug: "mesopotamia-beer-currency",
    title: "When Workers Were Paid in Beer",
    hook: "5,000 years ago in Sumeria, money didn't exist—laborers were paid in gallons of fermenting beer.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Long before coins or banknotes were invented, the ancient Sumerian city-states built the world's first civilization powered entirely by beer.",
        mood: "warm",
        imagePrompt: "Towering mudbrick ziggurat temple rising above the fertile green river plain of Mesopotamia at dawn. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mesopotamia-beer-currency/1.png",
        audio: "audio/mesopotamia-beer-currency/1.wav",
        voicedText: "Long before coins or banknotes were invented, the ancient Sumerian city-states built the world's first civilization powered entirely by beer.",
        seconds: 7.9
      },
      {
        text: "Mesopotamian beer wasn't like modern lager: it was a thick, sour, nutrient-dense porridge brewed from twice-baked barley bread called 'bappir'.",
        mood: "warm",
        imagePrompt: "Earthenware brewing vats with malted barley grain, dried loaves of bappir bread, and ceramic measuring bowls. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mesopotamia-beer-currency/2.png",
        audio: "audio/mesopotamia-beer-currency/2.wav",
        voicedText: "Mesopotamian beer wasn't like modern lager: it was a thick, sour, nutrient-dense porridge brewed from twice-baked barley bread called 'bappir'.",
        seconds: 8.2
      },
      {
        text: "Because river water was full of dangerous parasites, boiling the mash made beer the safest hydrating drink available.",
        mood: "cool",
        imagePrompt: "Clay jug of frothy golden beer with long hollow reed drinking straws resting on an adobe table. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mesopotamia-beer-currency/3.png",
        audio: "audio/mesopotamia-beer-currency/3.wav",
        voicedText: "Because river water was full of dangerous parasites, boiling the mash made beer the safest hydrating drink available.",
        seconds: 7.5
      },
      {
        text: "Temple records on clay tablets reveal standard wages: laborers received two liters a day, while senior officials received five liters daily.",
        mood: "warm",
        imagePrompt: "Cuneiform clay tablet inscribed with reed stylus tally marks showing the beer jar pictograph symbol. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mesopotamia-beer-currency/4.png",
        audio: "audio/mesopotamia-beer-currency/4.wav",
        voicedText: "Temple records on clay tablets reveal standard wages: laborers received two liters a day, while senior officials received five liters daily.",
        seconds: 8.1
      },
      {
        text: "Because chaff floated on top, drinkers used long bent bronze and reed straws to sip clean brew from the bottom of communal jars.",
        mood: "warm",
        imagePrompt: "Large communal ceramic amphora sealed with bitumen pitch and fitted with reed straws under palm frond shade. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mesopotamia-beer-currency/5.png",
        audio: "audio/mesopotamia-beer-currency/5.wav",
        voicedText: "Because chaff floated on top, drinkers used long bent bronze and reed straws to sip clean brew from the bottom of communal jars.",
        seconds: 7.7
      },
      {
        text: "Would you accept a paycheck paid entirely in beer? Let us know in the comments and subscribe for more ancient daily life!",
        mood: "day",
        imagePrompt: "Ancient Sumerian mudbrick market street with pottery stalls and date palm trees in the golden evening light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mesopotamia-beer-currency/6.png",
        audio: "audio/mesopotamia-beer-currency/6.wav",
        voicedText: "Would you accept a paycheck paid entirely in beer? Let us know in the comments and subscribe for more ancient daily life!",
        seconds: 7.3
      }
    ]
  },
  {
    slug: "egyptian-cat-worship-laws",
    title: "Killing a Cat Was a Capital Crime",
    hook: "In ancient Egypt, if your house caught fire, saving the family cat came before saving your own furniture.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Ancient Egyptians revered cats not merely as beloved household pets, but as sacred earthly protectors linked to the goddess Bastet.",
        mood: "warm",
        imagePrompt: "Warm sunlit stone courtyard of an Egyptian villa with flowering date palms and carved stone lotus fountains. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-cat-worship-laws/1.png",
        audio: "audio/egyptian-cat-worship-laws/1.wav",
        voicedText: "Ancient Egyptians revered cats not merely as beloved household pets, but as sacred earthly protectors linked to the goddess Bastet.",
        seconds: 7.8
      },
      {
        text: "Cats guarded granaries against mice and killed venomous horned vipers, safeguarding the entire family's survival and food supply.",
        mood: "warm",
        imagePrompt: "Woven reed grain baskets filled with golden emmer wheat and barley inside a mudbrick storehouse. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-cat-worship-laws/2.png",
        audio: "audio/egyptian-cat-worship-laws/2.wav",
        voicedText: "Cats guarded granaries against mice and killed venomous horned vipers, safeguarding the entire family's survival and food supply.",
        seconds: 7.7
      },
      {
        text: "Egyptian law was merciless: killing a cat, even completely by accident, carried an automatic mandatory death sentence by mob stoning.",
        mood: "dark",
        imagePrompt: "Carved bronze cat statuette with golden nose ring and beaded collar resting upon an altar of green malachite. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-cat-worship-laws/3.png",
        audio: "audio/egyptian-cat-worship-laws/3.wav",
        voicedText: "Egyptian law was merciless: killing a cat, even completely by accident, carried an automatic mandatory death sentence by mob stoning.",
        seconds: 8.0
      },
      {
        text: "Historian Herodotus wrote that during a house fire, Egyptians formed human cordons to save cats before extinguishing the flames.",
        mood: "dramatic",
        imagePrompt: "Flames illuminating the clay brick roof of a building at night as smoke rises into the starry sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-cat-worship-laws/4.png",
        audio: "audio/egyptian-cat-worship-laws/4.wav",
        voicedText: "Historian Herodotus wrote that during a house fire, Egyptians formed human cordons to save cats before extinguishing the flames.",
        seconds: 7.8
      },
      {
        text: "When a pet cat died naturally, the entire grieving household shaved their own eyebrows as a public sign of deep mourning.",
        mood: "cool",
        imagePrompt: "Small linen mummy bundle adorned with a painted feline face mask resting beside miniature milk bowls. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-cat-worship-laws/5.png",
        audio: "audio/egyptian-cat-worship-laws/5.wav",
        voicedText: "When a pet cat died naturally, the entire grieving household shaved their own eyebrows as a public sign of deep mourning.",
        seconds: 7.9
      },
      {
        text: "The cat was then lovingly mummified and entombed in the holy cemetery of Bubastis. Subscribe for more incredible ancient history!",
        mood: "day",
        imagePrompt: "Golden morning rays falling across the sandstone pylon gate of the temple of Bastet in lower Egypt. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-cat-worship-laws/6.png",
        audio: "audio/egyptian-cat-worship-laws/6.wav",
        voicedText: "The cat was then lovingly mummified and entombed in the holy cemetery of Bubastis. Subscribe for more incredible ancient history!",
        seconds: 7.4
      }
    ]
  },
  {
    slug: "egyptian-magic-and-scorpions",
    title: "Egyptian Spells for Scorpion Stings",
    hook: "Ancient Egyptians didn't just carry medicine—they carried ivory wands to banish venomous snakes.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In ancient Egypt, medicine and magic were indistinguishable: doctors were simultaneously trained physicians and ordained priests of Sekhmet.",
        mood: "warm",
        imagePrompt: "Ancient Egyptian physician's medical workroom with ceramic salve jars, bronze lancets, and linen bandage rolls on a table. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-magic-and-scorpions/1.png",
        audio: "audio/egyptian-magic-and-scorpions/1.wav",
        voicedText: "In ancient Egypt, medicine and magic were indistinguishable: doctors were simultaneously trained physicians and ordained priests of Sekhmet.",
        seconds: 8.0
      },
      {
        text: "The harsh desert sand crawled with deadly yellow deathstalker scorpions and horned asps whose venom killed within hours.",
        mood: "dark",
        imagePrompt: "Dramatic close-up view of wind-blown desert sand dunes with animal tracks under an intense midday sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-magic-and-scorpions/2.png",
        audio: "audio/egyptian-magic-and-scorpions/2.wav",
        voicedText: "The harsh desert sand crawled with deadly yellow deathstalker scorpions and horned asps whose venom killed within hours.",
        seconds: 7.6
      },
      {
        text: "To treat stings, the Ebers Papyrus prescribed poultices of crushed garlic, beer dregs, and natron salts to draw out venom.",
        mood: "warm",
        imagePrompt: "Mortar and pestle grinding garlic cloves and dried desert herbs beside a small bowl of white natron mineral salt. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-magic-and-scorpions/3.png",
        audio: "audio/egyptian-magic-and-scorpions/3.wav",
        voicedText: "To treat stings, the Ebers Papyrus prescribed poultices of crushed garlic, beer dregs, and natron salts to draw out venom.",
        seconds: 7.8
      },
      {
        text: "At the same time, the doctor drew a protective circle on the floor using a curved ivory magic wand carved from hippopotamus tusk.",
        mood: "cool",
        imagePrompt: "Curved white ivory wand carved with protective deities including Bes and Taweret resting on woven reed matting. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-magic-and-scorpions/4.png",
        audio: "audio/egyptian-magic-and-scorpions/4.wav",
        voicedText: "At the same time, the doctor drew a protective circle on the floor using a curved ivory magic wand carved from hippopotamus tusk.",
        seconds: 8.1
      },
      {
        text: "Patients drank water poured directly over magic healing cippus statues, believing the dissolved sacred spell inscriptions neutralized poison.",
        mood: "cool",
        imagePrompt: "Stele cippus of Horus standing on crocodiles with water flowing over carved hieroglyphic spell inscriptions into a basin. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-magic-and-scorpions/5.png",
        audio: "audio/egyptian-magic-and-scorpions/5.wav",
        voicedText: "Patients drank water poured directly over magic healing cippus statues, believing the dissolved sacred spell inscriptions neutralized poison.",
        seconds: 8.2
      },
      {
        text: "A fascinating blend of herbal pharmacology and spiritual psychology! Subscribe for more untold secrets from ancient times!",
        mood: "day",
        imagePrompt: "View of the Great Pyramids of Giza rising majestically against a bright clear blue desert morning sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/egyptian-magic-and-scorpions/6.png",
        audio: "audio/egyptian-magic-and-scorpions/6.wav",
        voicedText: "A fascinating blend of herbal pharmacology and spiritual psychology! Subscribe for more untold secrets from ancient times!",
        seconds: 7.2
      }
    ]
  },
  {
    slug: "pharaoh-cleopatra-daily-routine",
    title: "The Real Routine of Cleopatra",
    hook: "Cleopatra spoke nine languages and ran the Mediterranean's richest economy, yet myths reduce her to donkey milk baths.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Popular culture remembers Cleopatra as a glamorous seductress, but historical accounts by Plutarch describe a brilliant intellectual and statesman.",
        mood: "warm",
        imagePrompt: "Palace terrace of ancient Alexandria overlooking the Mediterranean harbor with classical colonnades and palm trees. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pharaoh-cleopatra-daily-routine/1.png",
        audio: "audio/pharaoh-cleopatra-daily-routine/1.wav",
        voicedText: "Popular culture remembers Cleopatra as a glamorous seductress, but historical accounts by Plutarch describe a brilliant intellectual and statesman.",
        seconds: 8.2
      },
      {
        text: "She was the first Ptolemaic monarch in three hundred years to bother learning the native Egyptian language, along with eight others.",
        mood: "cool",
        imagePrompt: "Scrolls in Greek, Latin, Demotic Egyptian, and Aramaic neatly stacked on a cedarwood study table with a bronze stylus. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pharaoh-cleopatra-daily-routine/2.png",
        audio: "audio/pharaoh-cleopatra-daily-routine/2.wav",
        voicedText: "She was the first Ptolemaic monarch in three hundred years to bother learning the native Egyptian language, along with eight others.",
        seconds: 8.0
      },
      {
        text: "Her day began at dawn inspecting the royal treasury books and regulating the vast Nile grain trade that fed millions across the Mediterranean.",
        mood: "warm",
        imagePrompt: "Heavy gold octodrachm coins stamped with royal emblems in a carved wooden chest next to fiscal accounting papyri. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pharaoh-cleopatra-daily-routine/3.png",
        audio: "audio/pharaoh-cleopatra-daily-routine/3.wav",
        voicedText: "Her day began at dawn inspecting the royal treasury books and regulating the vast Nile grain trade that fed millions across the Mediterranean.",
        seconds: 8.3
      },
      {
        text: "She held audiences with ambassadors without needing interpreters, outwitting Roman diplomats with razor-sharp legal and political arguments.",
        mood: "warm",
        imagePrompt: "Gilded throne room in Alexandria with porphyry marble floors and gold-leaf royal emblems between towering pillars. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pharaoh-cleopatra-daily-routine/4.png",
        audio: "audio/pharaoh-cleopatra-daily-routine/4.wav",
        voicedText: "She held audiences with ambassadors without needing interpreters, outwitting Roman diplomats with razor-sharp legal and political arguments.",
        seconds: 7.9
      },
      {
        text: "In her private laboratory, she studied alchemy, toxicology, and cosmetics—even authoring medical treatises preserved by Galen.",
        mood: "cool",
        imagePrompt: "Glass flasks, alabaster perfume jars, dried aromatic botanical bundles, and bronze scales in a royal library. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pharaoh-cleopatra-daily-routine/5.png",
        audio: "audio/pharaoh-cleopatra-daily-routine/5.wav",
        voicedText: "In her private laboratory, she studied alchemy, toxicology, and cosmetics—even authoring medical treatises preserved by Galen.",
        seconds: 8.1
      },
      {
        text: "A true ruler of intellect and power. What surprised you most about Cleopatra? Share below and subscribe for more history truth!",
        mood: "day",
        imagePrompt: "The great Pharos lighthouse of Alexandria standing tall at sunset with golden light reflecting across harbor waters. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/pharaoh-cleopatra-daily-routine/6.png",
        audio: "audio/pharaoh-cleopatra-daily-routine/6.wav",
        voicedText: "A true ruler of intellect and power. What surprised you most about Cleopatra? Share below and subscribe for more history truth!",
        seconds: 7.3
      }
    ]
  },

  // ==========================================
  // ANCIENT GREECE & SPARTA (8 scripts)
  // ==========================================
  {
    slug: "spartan-black-broth",
    title: "Sparta's Disgusting Black Broth",
    hook: "Spartan warriors ate a soup of boiled pig blood and vinegar that terrified neighboring city-states.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In ancient Sparta, luxurious food was strictly outlawed to keep citizen soldiers hardened, lean, and indifferent to comfort.",
        mood: "cool",
        imagePrompt: "Rugged rocky hillsides of the Eurotas river valley in Laconia under an overcast grey Greek sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-black-broth/1.png",
        audio: "audio/spartan-black-broth/1.wav",
        voicedText: "In ancient Sparta, luxurious food was strictly outlawed to keep citizen soldiers hardened, lean, and indifferent to comfort.",
        seconds: 7.7
      },
      {
        text: "Every Spartan male ate his daily meals in a communal mess hall called a syssitia, where the staple dish was 'melas zomos'—Black Broth.",
        mood: "warm",
        imagePrompt: "Austere stone communal mess hall with plain wooden trestle tables, benches, and bronze drinking cups. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-black-broth/2.png",
        audio: "audio/spartan-black-broth/2.wav",
        voicedText: "Every Spartan male ate his daily meals in a communal mess hall called a syssitia, where the staple dish was 'melas zomos'—Black Broth.",
        seconds: 8.0
      },
      {
        text: "The recipe was notorious: boiled pork legs, pig blood, salt, and vinegar—the acid preventing the congealed blood from clotting completely.",
        mood: "dark",
        imagePrompt: "Heavy black iron cauldron bubbling over hearth coals with a thick dark soup simmering inside. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-black-broth/3.png",
        audio: "audio/spartan-black-broth/3.wav",
        voicedText: "The recipe was notorious: boiled pork legs, pig blood, salt, and vinegar—the acid preventing the congealed blood from clotting completely.",
        seconds: 8.2
      },
      {
        text: "A visiting traveler from the wealthy city of Sybaris once tasted the broth and famously joked: 'Now I understand why Spartans are so eager to die in battle!'",
        mood: "cool",
        imagePrompt: "Coarse wooden trencher holding a dark clay bowl of black stew alongside a crust of hard barley bread. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-black-broth/4.png",
        audio: "audio/spartan-black-broth/4.wav",
        voicedText: "A visiting traveler from the wealthy city of Sybaris once tasted the broth and famously joked: 'Now I understand why Spartans are so eager to die in battle!'",
        seconds: 8.5
      },
      {
        text: "Spartan elders believed rich delicacies made warriors soft, while black broth supplied maximum iron and calories for campaign endurance.",
        mood: "warm",
        imagePrompt: "Bronze Spartan hoplite helmet with transverse horsehair crest resting beside a crimson cloak and bronze shield. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-black-broth/5.png",
        audio: "audio/spartan-black-broth/5.wav",
        voicedText: "Spartan elders believed rich delicacies made warriors soft, while black broth supplied maximum iron and calories for campaign endurance.",
        seconds: 8.0
      },
      {
        text: "Could you have survived on a diet of boiled blood soup? Let us know in the comments and subscribe for more Spartan history!",
        mood: "day",
        imagePrompt: "Sun shining brightly over the snowy peaks of Mount Taygetos overlooking the fertile plains of ancient Sparta. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-black-broth/6.png",
        audio: "audio/spartan-black-broth/6.wav",
        voicedText: "Could you have survived on a diet of boiled blood soup? Let us know in the comments and subscribe for more Spartan history!",
        seconds: 7.3
      }
    ]
  },
  {
    slug: "greek-ostracism-voting",
    title: "Voting to Banish Your Most Annoying Neighbor",
    hook: "Every year, Athenians gathered in the agora to exile one powerful politician for ten whole years.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In classical Athens, democracy had a ruthless safeguard against tyranny: an annual election called 'ostracism'.",
        mood: "warm",
        imagePrompt: "The sprawling sunlit Agora marketplace of ancient Athens surrounded by marble porticoes and olive trees. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-ostracism-voting/1.png",
        audio: "audio/greek-ostracism-voting/1.wav",
        voicedText: "In classical Athens, democracy had a ruthless safeguard against tyranny: an annual election called 'ostracism'.",
        seconds: 7.6
      },
      {
        text: "Citizens gathered in the central marketplace and scratched the name of the politician they found most dangerous onto a broken pottery shard called an 'ostrakon'.",
        mood: "warm",
        imagePrompt: "Broken terracotta pottery shards with scratched ancient Greek lettering and an iron stylus resting on marble steps. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-ostracism-voting/2.png",
        audio: "audio/greek-ostracism-voting/2.wav",
        voicedText: "Citizens gathered in the central marketplace and scratched the name of the politician they found most dangerous onto a broken pottery shard called an 'ostrakon'.",
        seconds: 8.5
      },
      {
        text: "If at least six thousand votes were cast, the individual with the highest tally was banished from Athens for ten full years.",
        mood: "cool",
        imagePrompt: "Bronze ballot urns and wicker tally baskets placed on a stone voting platform under a striped awning. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-ostracism-voting/3.png",
        audio: "audio/greek-ostracism-voting/3.wav",
        voicedText: "If at least six thousand votes were cast, the individual with the highest tally was banished from Athens for ten full years.",
        seconds: 7.9
      },
      {
        text: "They weren't accused of any crime, and their property wasn't confiscated—they were simply exiled because people were tired of their ambition.",
        mood: "cool",
        imagePrompt: "Dusty coastal road leading away from Athens toward the distant Aegean sea at sunset. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-ostracism-voting/4.png",
        audio: "audio/greek-ostracism-voting/4.wav",
        voicedText: "They weren't accused of any crime, and their property wasn't confiscated—they were simply exiled because people were tired of their ambition.",
        seconds: 8.1
      },
      {
        text: "Aristides 'The Just' was once asked by an illiterate voter to write Aristides' own name on a shard. When asked why, the voter replied: 'I'm sick of hearing everyone call him Just!'",
        mood: "warm",
        imagePrompt: "Single curved pottery shard inscribed with the Greek name 'ARISTIDES' illuminated by afternoon sunlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-ostracism-voting/5.png",
        audio: "audio/greek-ostracism-voting/5.wav",
        voicedText: "Aristides 'The Just' was once asked by an illiterate voter to write Aristides' own name on a shard. When asked why, the voter replied: 'I'm sick of hearing everyone call him Just!'",
        seconds: 9.0
      },
      {
        text: "Imagine if we could vote to exile politicians for ten years today! Who would you banish? Tell us and subscribe!",
        mood: "day",
        imagePrompt: "The magnificent Parthenon on the Acropolis of Athens glowing under a radiant blue Mediterranean sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-ostracism-voting/6.png",
        audio: "audio/greek-ostracism-voting/6.wav",
        voicedText: "Imagine if we could vote to exile politicians for ten years today! Who would you banish? Tell us and subscribe!",
        seconds: 7.4
      }
    ]
  },
  {
    slug: "greek-philosopher-insults",
    title: "Diogenes: History's Wildest Philosopher",
    hook: "Diogenes lived inside a ceramic wine jar and told Alexander the Great to get out of his sunlight.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "While Plato and Aristotle taught wealthy aristocrats in private academies, Diogenes of Sinope took philosophy straight into the gutter.",
        mood: "cool",
        imagePrompt: "Sunlit olive grove in ancient Athens with classical marble statues and open discussion terraces. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-philosopher-insults/1.png",
        audio: "audio/greek-philosopher-insults/1.wav",
        voicedText: "While Plato and Aristotle taught wealthy aristocrats in private academies, Diogenes of Sinope took philosophy straight into the gutter.",
        seconds: 7.8
      },
      {
        text: "He rejected all material possessions, living in a massive ceramic storage jar called a pithos in the Athenian marketplace.",
        mood: "warm",
        imagePrompt: "Enormous weathered terracotta storage pithos jar resting on its side against an ancient stone wall in the marketplace. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-philosopher-insults/2.png",
        audio: "audio/greek-philosopher-insults/2.wav",
        voicedText: "He rejected all material possessions, living in a massive ceramic storage jar called a pithos in the Athenian marketplace.",
        seconds: 7.6
      },
      {
        text: "Diogenes famously walked through Athens in broad daylight carrying a lit oil lamp, telling confused citizens he was 'looking for an honest man'.",
        mood: "warm",
        imagePrompt: "Ancient bronze oil lamp with glowing orange flame resting on a cobblestone pavement in midday sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-philosopher-insults/3.png",
        audio: "audio/greek-philosopher-insults/3.wav",
        voicedText: "Diogenes famously walked through Athens in broad daylight carrying a lit oil lamp, telling confused citizens he was 'looking for an honest man'.",
        seconds: 8.0
      },
      {
        text: "When Plato defined man as a 'featherless biped', Diogenes plucked a live chicken, brought it into Plato's lecture hall, and shouted: 'Behold! Plato's man!'",
        mood: "cool",
        imagePrompt: "Parchment scroll and lecture podium in a Greek philosophical academy with a stray white feather on the marble floor. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-philosopher-insults/4.png",
        audio: "audio/greek-philosopher-insults/4.wav",
        voicedText: "When Plato defined man as a 'featherless biped', Diogenes plucked a live chicken, brought it into Plato's lecture hall, and shouted: 'Behold! Plato's man!'",
        seconds: 8.8
      },
      {
        text: "When Alexander the Great visited and offered to grant any wish, Diogenes casually squinted and replied: 'Yes, stand out of my sunlight.'",
        mood: "warm",
        imagePrompt: "Gleaming golden Macedonian spear and crested helmet casting a sharp shadow across dusty sunlit stone steps. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-philosopher-insults/5.png",
        audio: "audio/greek-philosopher-insults/5.wav",
        voicedText: "When Alexander the Great visited and offered to grant any wish, Diogenes casually squinted and replied: 'Yes, stand out of my sunlight.'",
        seconds: 8.2
      },
      {
        text: "Alexander remarked: 'If I were not Alexander, I would want to be Diogenes.' What's your favorite Diogenes moment? Subscribe for more history!",
        mood: "day",
        imagePrompt: "Warm sunlight illuminating ancient Corinth with classical Greek temple columns against a bright blue sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-philosopher-insults/6.png",
        audio: "audio/greek-philosopher-insults/6.wav",
        voicedText: "Alexander remarked: 'If I were not Alexander, I would want to be Diogenes.' What's your favorite Diogenes moment? Subscribe for more history!",
        seconds: 7.7
      }
    ]
  },
  {
    slug: "spartan-women-freedom",
    title: "Why Spartan Women Were Feared",
    hook: "While Athenian women were locked indoors, Spartan women owned 40% of the land and wrestled in public.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In classical Athens, women had zero legal rights, could not own property, and spent their entire lives secluded in the women's quarters.",
        mood: "cool",
        imagePrompt: "Quiet shaded interior courtyard of a classical Greek home with loom weavings and terracotta pottery. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-women-freedom/1.png",
        audio: "audio/spartan-women-freedom/1.wav",
        voicedText: "In classical Athens, women had zero legal rights, could not own property, and spent their entire lives secluded in the women's quarters.",
        seconds: 7.9
      },
      {
        text: "Just one hundred miles away in Sparta, women lived an entirely different existence that shocked and horrified the rest of Greece.",
        mood: "warm",
        imagePrompt: "Dramatic rugged mountain view of the Peloponnese peninsula with cypress trees against an amber sunrise. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-women-freedom/2.png",
        audio: "audio/spartan-women-freedom/2.wav",
        voicedText: "Just one hundred miles away in Sparta, women lived an entirely different existence that shocked and horrified the rest of Greece.",
        seconds: 7.8
      },
      {
        text: "Spartan girls received formal athletic training: running, javelin throwing, and wrestling alongside boys so they would bear strong children.",
        mood: "warm",
        imagePrompt: "Ancient bronze athletic javelin and leather running sandals resting on sun-baked gymnasium dust. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-women-freedom/3.png",
        audio: "audio/spartan-women-freedom/3.wav",
        voicedText: "Spartan girls received formal athletic training: running, javelin throwing, and wrestling alongside boys so they would bear strong children.",
        seconds: 8.0
      },
      {
        text: "Because Spartan men spent their lives in barracks or at war, women managed all estates, finances, and agricultural production.",
        mood: "warm",
        imagePrompt: "Rich fertile Spartan estate with rolling olive groves, stone storehouses, and clay amphorae of olive oil. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-women-freedom/4.png",
        audio: "audio/spartan-women-freedom/4.wav",
        voicedText: "Because Spartan men spent their lives in barracks or at war, women managed all estates, finances, and agricultural production.",
        seconds: 7.7
      },
      {
        text: "By the Hellenistic era, Spartan women owned over forty percent of all land and wealth in the city-state through inheritance.",
        mood: "cool",
        imagePrompt: "Bronze Spartan key and iron deed rings resting on a polished wooden estate desk with estate scrolls. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-women-freedom/5.png",
        audio: "audio/spartan-women-freedom/5.wav",
        voicedText: "By the Hellenistic era, Spartan women owned over forty percent of all land and wealth in the city-state through inheritance.",
        seconds: 7.8
      },
      {
        text: "When an Athenian queen asked why only Spartan women ruled men, Queen Gorgo replied: 'Because only we give birth to men.' Subscribe for more!",
        mood: "day",
        imagePrompt: "Classic bronze Spartan shield painted with the Greek letter Lambda standing tall in golden sunlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-women-freedom/6.png",
        audio: "audio/spartan-women-freedom/6.wav",
        voicedText: "When an Athenian queen asked why only Spartan women ruled men, Queen Gorgo replied: 'Because only we give birth to men.' Subscribe for more!",
        seconds: 7.6
      }
    ]
  },
  {
    slug: "greek-trireme-rowers",
    title: "Rowing a Greek Warship in Battle",
    hook: "Sitting shoulder-to-shoulder with 170 sweaty men in 100-degree heat, blind to incoming enemy rams.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "The Athenian trireme was the deadliest warship of the ancient Mediterranean: a swift wooden missile propelled by one hundred seventy oarsmen.",
        mood: "cool",
        imagePrompt: "Sleek ancient Greek wooden trireme warship with bronze battering ram gliding across deep blue Aegean waters. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-trireme-rowers/1.png",
        audio: "audio/greek-trireme-rowers/1.wav",
        voicedText: "The Athenian trireme was the deadliest warship of the ancient Mediterranean: a swift wooden missile propelled by one hundred seventy oarsmen.",
        seconds: 8.2
      },
      {
        text: "Contrary to movie myths, Greek rowers were not enslaved convicts in chains—they were free Athenian citizens paid a full daily wage.",
        mood: "warm",
        imagePrompt: "Leather rowing cushion, wooden oarsman bench, and a small pouch of silver drachma coins on pine deck timbers. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-trireme-rowers/2.png",
        audio: "audio/greek-trireme-rowers/2.wav",
        voicedText: "Contrary to movie myths, Greek rowers were not enslaved convicts in chains—they were free Athenian citizens paid a full daily wage.",
        seconds: 7.8
      },
      {
        text: "Inside the narrow wooden hull, rowers were stacked on three tiered benches, packed so closely their noses touched the back of the man ahead.",
        mood: "dark",
        imagePrompt: "Cramped timber interior of an ancient ship hull showing three stepped tiers of wooden rowing benches and long pine oars. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-trireme-rowers/3.png",
        audio: "audio/greek-trireme-rowers/3.wav",
        voicedText: "Inside the narrow wooden hull, rowers were stacked on three tiered benches, packed so closely their noses touched the back of the man ahead.",
        seconds: 8.1
      },
      {
        text: "Heat reached over one hundred degrees, smelling of sweat and bilge water, while rowers rowed blind to flute rhythms, unable to see enemy ships.",
        mood: "dark",
        imagePrompt: "Double-reed Greek aulos flute resting on a wooden captain's crate next to an hourglass and coiled hemp ropes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-trireme-rowers/4.png",
        audio: "audio/greek-trireme-rowers/4.wav",
        voicedText: "Heat reached over one hundred degrees, smelling of sweat and bilge water, while rowers rowed blind to flute rhythms, unable to see enemy ships.",
        seconds: 8.2
      },
      {
        text: "If an enemy ram smashed into the hull at ten knots, rowers in the bottom tier were instantly trapped and crushed in the splintering timber.",
        mood: "dramatic",
        imagePrompt: "Massive bronze boar-head battering ram on the bow of a warship cutting through frothing white sea foam spray. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-trireme-rowers/5.png",
        audio: "audio/greek-trireme-rowers/5.wav",
        voicedText: "If an enemy ram smashed into the hull at ten knots, rowers in the bottom tier were instantly trapped and crushed in the splintering timber.",
        seconds: 8.0
      },
      {
        text: "Their discipline turned Athens into a maritime superpower. Would you have rowed on a trireme? Tell us and subscribe!",
        mood: "day",
        imagePrompt: "Fleet of ancient Greek warships anchored in a peaceful golden coastal cove at sunset. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-trireme-rowers/6.png",
        audio: "audio/greek-trireme-rowers/6.wav",
        voicedText: "Their discipline turned Athens into a maritime superpower. Would you have rowed on a trireme? Tell us and subscribe!",
        seconds: 7.3
      }
    ]
  },
  {
    slug: "ancient-oracle-of-delphi",
    title: "The Drug-Fueled Oracle of Delphi",
    hook: "Kings marched across mountains to ask the Pythia for military advice while she inhaled intoxicating gas from rock fissures.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Perched high on the mist-covered cliffs of Mount Parnassus stood the Sanctuary of Delphi—the sacred spiritual center of the Greek world.",
        mood: "cool",
        imagePrompt: "Stunning classical stone temple ruins of Delphi perched on steep rocky mountain cliffs overlooking deep olive valleys. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ancient-oracle-of-delphi/1.png",
        audio: "audio/ancient-oracle-of-delphi/1.wav",
        voicedText: "Perched high on the mist-covered cliffs of Mount Parnassus stood the Sanctuary of Delphi—the sacred spiritual center of the Greek world.",
        seconds: 8.0
      },
      {
        text: "Before launching wars or planting colonies, Greek kings and generals waited months to consult the high priestess: the Pythia.",
        mood: "warm",
        imagePrompt: "Grand marble temple stairway leading up to the inner sanctuary of Apollo flanked by bronze victory tripods. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ancient-oracle-of-delphi/2.png",
        audio: "audio/ancient-oracle-of-delphi/2.wav",
        voicedText: "Before launching wars or planting colonies, Greek kings and generals waited months to consult the high priestess: the Pythia.",
        seconds: 7.7
      },
      {
        text: "The Pythia sat upon a tall bronze tripod suspended directly over a deep chasm in the temple floor called the adyton.",
        mood: "dark",
        imagePrompt: "Tall three-legged bronze tripod stand positioned over an open stone fissure in a shadowy subterranean stone chamber. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ancient-oracle-of-delphi/3.png",
        audio: "audio/ancient-oracle-of-delphi/3.wav",
        voicedText: "The Pythia sat upon a tall bronze tripod suspended directly over a deep chasm in the temple floor called the adyton.",
        seconds: 7.6
      },
      {
        text: "Modern geologists discovered two active tectonic faults intersect right under the temple, venting hydrocarbon gases including sweet-smelling ethylene.",
        mood: "cool",
        imagePrompt: "Faint sweet vapor rising from a rocky crevice in the floor catching the soft glow of an oil lamp. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ancient-oracle-of-delphi/4.png",
        audio: "audio/ancient-oracle-of-delphi/4.wav",
        voicedText: "Modern geologists discovered two active tectonic faults intersect right under the temple, venting hydrocarbon gases including sweet-smelling ethylene.",
        seconds: 8.3
      },
      {
        text: "Inhaling the gas induced a trance state where she uttered cryptic riddles, which cunning priests translated into ambiguous hexameter verse.",
        mood: "warm",
        imagePrompt: "Laurel branch sprigs, a bowl of holy spring water from the Castalian spring, and inscribed lead tablets on an altar. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ancient-oracle-of-delphi/5.png",
        audio: "audio/ancient-oracle-of-delphi/5.wav",
        voicedText: "Inhaling the gas induced a trance state where she uttered cryptic riddles, which cunning priests translated into ambiguous hexameter verse.",
        seconds: 8.2
      },
      {
        text: "Her prophecies changed the fate of empires for a thousand years. Would you have trusted her predictions? Subscribe for more ancient mysteries!",
        mood: "day",
        imagePrompt: "Golden morning sun illuminating the towering stone pillars of the Tholos of Delphi against dramatic Greek mountains. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ancient-oracle-of-delphi/6.png",
        audio: "audio/ancient-oracle-of-delphi/6.wav",
        voicedText: "Her prophecies changed the fate of empires for a thousand years. Would you have trusted her predictions? Subscribe for more ancient mysteries!",
        seconds: 7.5
      }
    ]
  },
  {
    slug: "spartan-stealing-trial",
    title: "Spartan Boys Were Taught to Steal",
    hook: "In Sparta's brutal agoge academy, boys were starved and ordered to steal—punished only if they got caught.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "At age seven, Spartan boys were removed from their mothers and enrolled in the state military academy known as the agoge.",
        mood: "cool",
        imagePrompt: "Harsh stone courtyard of an ancient Spartan barracks with sparse wooden benches and dirt training grounds under a cool dawn sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-stealing-trial/1.png",
        audio: "audio/spartan-stealing-trial/1.wav",
        voicedText: "At age seven, Spartan boys were removed from their mothers and enrolled in the state military academy known as the agoge.",
        seconds: 7.8
      },
      {
        text: "They were given only one coarse woolen cloak per year, slept on sharp river reeds they had to snap with bare hands, and went barefoot year-round.",
        mood: "cool",
        imagePrompt: "Bundle of coarse cut river reeds and a frayed red woolen cloak lying on a cold stone floor. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-stealing-trial/2.png",
        audio: "audio/spartan-stealing-trial/2.wav",
        voicedText: "They were given only one coarse woolen cloak per year, slept on sharp river reeds they had to snap with bare hands, and went barefoot year-round.",
        seconds: 8.2
      },
      {
        text: "Instructors deliberately gave them starvation food rations to force them to steal food from farms and mess halls.",
        mood: "dark",
        imagePrompt: "Ceramic food bowl with only a few dry olives and a tiny crust of barley bread on a rough wooden bench. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-stealing-trial/3.png",
        audio: "audio/spartan-stealing-trial/3.wav",
        voicedText: "Instructors deliberately gave them starvation food rations to force them to steal food from farms and mess halls.",
        seconds: 7.5
      },
      {
        text: "Stealing wasn't considered a crime: it was tactical training in stealth, deception, and night foraging for future campaigns.",
        mood: "dark",
        imagePrompt: "Shadowy stone doorway of an ancient storeroom with hanging strings of garlic and clay olive oil jars in the moonlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-stealing-trial/4.png",
        audio: "audio/spartan-stealing-trial/4.wav",
        voicedText: "Stealing wasn't considered a crime: it was tactical training in stealth, deception, and night foraging for future campaigns.",
        seconds: 7.8
      },
      {
        text: "If a boy was caught, he was brutally whipped with leather thongs—not for the theft, but for the unforgivable clumsiness of getting detected.",
        mood: "cool",
        imagePrompt: "Heavy braided leather whip and bronze training rods resting on a stone whipping post inside a training courtyard. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-stealing-trial/5.png",
        audio: "audio/spartan-stealing-trial/5.wav",
        voicedText: "If a boy was caught, he was brutally whipped with leather thongs—not for the theft, but for the unforgivable clumsiness of getting detected.",
        seconds: 8.3
      },
      {
        text: "One famous boy let a stolen fox chew his stomach rather than cry out and reveal his theft. Subscribe for more intense Spartan history!",
        mood: "day",
        imagePrompt: "Sun rising over the olive groves and rugged mountains of ancient Laconia in brilliant golden light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/spartan-stealing-trial/6.png",
        audio: "audio/spartan-stealing-trial/6.wav",
        voicedText: "One famous boy let a stolen fox chew his stomach rather than cry out and reveal his theft. Subscribe for more intense Spartan history!",
        seconds: 7.6
      }
    ]
  },
  {
    slug: "greek-theatre-heckling",
    title: "Rowdy Hecklers in Greek Theatres",
    hook: "If an actor fumbled a single line in Athens, 14,000 spectators threw rotten figs, olives, and stones.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Attending the Theatre of Dionysus in Athens wasn't a quiet cultural night out—it was an all-day, wine-soaked civic spectacle with 14,000 rowdy spectators.",
        mood: "warm",
        imagePrompt: "Vast stone amphitheater of Dionysus carved into the southern cliffside of the Acropolis under a bright Aegean sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-theatre-heckling/1.png",
        audio: "audio/greek-theatre-heckling/1.wav",
        voicedText: "Attending the Theatre of Dionysus in Athens wasn't a quiet cultural night out—it was an all-day, wine-soaked civic spectacle with 14,000 rowdy spectators.",
        seconds: 8.3
      },
      {
        text: "Performances of tragedies and comedies were high-stakes competitions where playwrights like Sophocles and Aristophanes competed for the golden ivy wreath.",
        mood: "warm",
        imagePrompt: "Golden carved ivy wreath resting on a velvet-draped marble pedestal next to an ornate terracotta prize vase. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-theatre-heckling/2.png",
        audio: "audio/greek-theatre-heckling/2.wav",
        voicedText: "Performances of tragedies and comedies were high-stakes competitions where playwrights like Sophocles and Aristophanes competed for the golden ivy wreath.",
        seconds: 8.2
      },
      {
        text: "Audiences brought baskets stuffed with snacks: garlic, barley cakes, dried figs, and heavy terracotta flagons of unmixed wine.",
        mood: "warm",
        imagePrompt: "Wicker basket brimming with purple dried figs, green olives, garlic cloves, and wine jars on stone theatre steps. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-theatre-heckling/3.png",
        audio: "audio/greek-theatre-heckling/3.wav",
        voicedText: "Audiences brought baskets stuffed with snacks: garlic, barley cakes, dried figs, and heavy terracotta flagons of unmixed wine.",
        seconds: 7.8
      },
      {
        text: "If an actor mispronounced a syllable or delivered a flat punchline, thousands of spectators drummed their heels against stone benches, hissing and booing.",
        mood: "cool",
        imagePrompt: "Empty tiered semi-circular stone benches of an ancient theatre catching bright midday Mediterranean light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-theatre-heckling/4.png",
        audio: "audio/greek-theatre-heckling/4.wav",
        voicedText: "If an actor mispronounced a syllable or delivered a flat punchline, thousands of spectators drummed their heels against stone benches, hissing and booing.",
        seconds: 8.3
      },
      {
        text: "They hurled rotten fruit, olive pits, and even cobblestones onto the stage, forcing terrified actors to flee mid-monologue.",
        mood: "dark",
        imagePrompt: "Carved comic theatre mask made of painted linen and clay lying abandoned on the orchestra stage stones. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-theatre-heckling/5.png",
        audio: "audio/greek-theatre-heckling/5.wav",
        voicedText: "They hurled rotten fruit, olive pits, and even cobblestones onto the stage, forcing terrified actors to flee mid-monologue.",
        seconds: 7.7
      },
      {
        text: "The theatre was so volatile that special rod-bearers called 'rhabdouchoi' were hired to beat unruly hecklers. Subscribe for more ancient theater lore!",
        mood: "day",
        imagePrompt: "Dramatic view looking out from the ancient theatre orchestra toward the Aegean horizon at sunset. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/greek-theatre-heckling/6.png",
        audio: "audio/greek-theatre-heckling/6.wav",
        voicedText: "The theatre was so volatile that special rod-bearers called 'rhabdouchoi' were hired to beat unruly hecklers. Subscribe for more ancient theater lore!",
        seconds: 7.8
      }
    ]
  }
];

let generated = 0;
for (const script of SCRIPTS) {
  const filePath = path.join(outDir, `${script.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(script, null, 2), "utf8");
  console.log(`Generated: ${script.slug}.json (${script.scenes.length} scenes)`);
  generated++;
}
console.log(`\nSuccessfully created all ${generated} remaining expansion scripts!`);

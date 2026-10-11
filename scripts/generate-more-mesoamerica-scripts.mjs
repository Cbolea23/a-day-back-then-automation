import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const MESOAMERICA_MORE = [
  // 4. Inca Quipu Knot Language
  {
    slug: "inca-quipu-knot-language",
    title: "The Empire That Wrote in Knots",
    hook: "The Incas ruled 10 million people without writing a single sentence on paper.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "The Inca Empire stretched two thousand five hundred miles across the Andes mountains, governing ten million subjects.",
        mood: "warm",
        imagePrompt: "Monumental Inca stone fortress terrace at Sacsayhuaman with massive fitted polygonal megalithic stones under blue Andean skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-quipu-knot-language/1.png",
        audio: "audio/inca-quipu-knot-language/1.wav",
        voicedText: "The Inca Empire stretched two thousand five hundred miles across the Andes mountains, governing ten million subjects.",
        seconds: 7.3
      },
      {
        text: "Yet remarkably, they never developed a written alphabet on paper or parchment—instead, their entire bureaucracy ran on 'quipus'.",
        mood: "warm",
        imagePrompt: "Close-up of an ancient Inca quipu: a thick primary wool cord with dozens of colored cotton string pendants hanging down. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-quipu-knot-language/2.png",
        audio: "audio/inca-quipu-knot-language/2.wav",
        voicedText: "Yet remarkably, they never developed a written alphabet on paper or parchment—instead, their entire bureaucracy ran on 'quipus'.",
        seconds: 7.5
      },
      {
        text: "A quipu consisted of a main cord with hundreds of dangling colored llama-wool strings tied with intricate clusters of knots.",
        mood: "warm",
        imagePrompt: "Detailed view of various knot types: figure-eight knots, long spiral knots, and simple knots tied in dyed alpaca wool strings. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-quipu-knot-language/3.png",
        audio: "audio/inca-quipu-knot-language/3.wav",
        voicedText: "A quipu consisted of a main cord with hundreds of dangling colored llama-wool strings tied with intricate clusters of knots.",
        seconds: 7.4
      },
      {
        text: "Using a decimal base-10 system, string color, spin direction, and knot spacing recorded army troop counts, gold taxes, and granary stores.",
        mood: "cool",
        imagePrompt: "Stone administrative storehouse in Cuzco with organized rows of rolled quipu string archives resting in carved wall niches. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-quipu-knot-language/4.png",
        audio: "audio/inca-quipu-knot-language/4.wav",
        voicedText: "Using a decimal base-10 system, string color, spin direction, and knot spacing recorded army troop counts, gold taxes, and granary stores.",
        seconds: 7.7
      },
      {
        text: "Official masters called 'quipucamayocs' could read complex histories, tax debts, and royal decrees simply by sliding fingers across the cords.",
        mood: "warm",
        imagePrompt: "Pair of hands holding a multicolored quipu cord in golden light with fingers carefully tracing knots on a woven textile mat. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-quipu-knot-language/5.png",
        audio: "audio/inca-quipu-knot-language/5.wav",
        voicedText: "Official masters called 'quipucamayocs' could read complex histories, tax debts, and royal decrees simply by sliding fingers across the cords.",
        seconds: 7.6
      },
      {
        text: "Could you run an entire empire using strings of knots? Let us know below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Breathtaking vista of Machu Picchu stone terraces bathed in morning sunlight with mountain peaks rising into clouds. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-quipu-knot-language/6.png",
        audio: "audio/inca-quipu-knot-language/6.wav",
        voicedText: "Could you run an entire empire using strings of knots? Let us know below and follow for daily history stories!",
        seconds: 7.1
      }
    ]
  },
  // 5. Maya Rubber Ball Game
  {
    slug: "maya-rubber-ball-game",
    title: "The Lethal Maya Ballgame",
    hook: "Athletes bounced a 9-pound solid rubber ball with hips and knees.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Long before European sports existed, ancient Mesoamericans played 'pok-a-tok': a high-stakes, spiritual ballgame.",
        mood: "warm",
        imagePrompt: "Massive stone ballcourt at Chichen Itza with sloping stone aprons, temple platforms, and high parallel limestone walls. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-rubber-ball-game/1.png",
        audio: "audio/maya-rubber-ball-game/1.wav",
        voicedText: "Long before European sports existed, ancient Mesoamericans played 'pok-a-tok': a high-stakes, spiritual ballgame.",
        seconds: 7.3
      },
      {
        text: "The ball was solid tree latex rubber weighing up to nine pounds—so dense and heavy that hitting it wrong shattered ribs and fractured skulls.",
        mood: "cool",
        imagePrompt: "Heavy solid black rubber game ball resting on carved limestone court paving beside a leather protective waist yoke. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-rubber-ball-game/2.png",
        audio: "audio/maya-rubber-ball-game/2.wav",
        voicedText: "The ball was solid tree latex rubber weighing up to nine pounds—so dense and heavy that hitting it wrong shattered ribs and fractured skulls.",
        seconds: 7.6
      },
      {
        text: "Players were strictly forbidden from using hands or feet; they could only strike the heavy rubber with padded hips, elbows, and knees.",
        mood: "warm",
        imagePrompt: "Carved wooden and leather hip yoke armor adorned with jade stone ornaments resting on a stone bench in sunlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-rubber-ball-game/3.png",
        audio: "audio/maya-rubber-ball-game/3.wav",
        voicedText: "Players were strictly forbidden from using hands or feet; they could only strike the heavy rubber with padded hips, elbows, and knees.",
        seconds: 7.5
      },
      {
        text: "To win, players had to propel the bouncing ball through vertical stone scoring hoops mounted twenty-five feet high on court walls.",
        mood: "warm",
        imagePrompt: "Elaborately carved stone ring hoop mounted high on a vertical temple wall showing feathered serpent reliefs in bright sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-rubber-ball-game/4.png",
        audio: "audio/maya-rubber-ball-game/4.wav",
        voicedText: "To win, players had to propel the bouncing ball through vertical stone scoring hoops mounted twenty-five feet high on court walls.",
        seconds: 7.4
      },
      {
        text: "Matches simulated cosmic battles between the sun and underworld gods; on sacred occasions, the losing team captain was sacrificed.",
        mood: "dark",
        imagePrompt: "Carved stone relief panel on court wall depicting mythological underworld deities, feather serpents, and offering bowls. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-rubber-ball-game/5.png",
        audio: "audio/maya-rubber-ball-game/5.wav",
        voicedText: "Matches simulated cosmic battles between the sun and underworld gods; on sacred occasions, the losing team captain was sacrificed.",
        seconds: 7.6
      },
      {
        text: "Could you play soccer with a nine-pound solid rubber ball using only your hips? Tell us below and subscribe!",
        mood: "day",
        imagePrompt: "Sunny Yucatan jungle sky framing the majestic pyramid of El Castillo rising gracefully over the ballcourt lawns. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-rubber-ball-game/6.png",
        audio: "audio/maya-rubber-ball-game/6.wav",
        voicedText: "Could you play soccer with a nine-pound solid rubber ball using only your hips? Tell us below and subscribe!",
        seconds: 7.1
      }
    ]
  },
  // 6. Aztec Cleanliness vs Europe
  {
    slug: "aztec-cleanliness-vs-europe",
    title: "Tenochtitlan Was Cleaner Than London",
    hook: "Tenochtitlan had 1,000 public street cleaners and dual fresh aqueducts.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "When Spanish conquistadors first entered Tenochtitlan in 1519, they were stunned by a city far cleaner than Paris, London, or Madrid.",
        mood: "warm",
        imagePrompt: "Immaculate paved stone causeway leading across turquoise Lake Texcoco into the gleaming white pyramids of Tenochtitlan. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-cleanliness-vs-europe/1.png",
        audio: "audio/aztec-cleanliness-vs-europe/1.wav",
        voicedText: "When Spanish conquistadors first entered Tenochtitlan in 1519, they were stunned by a city far cleaner than Paris, London, or Madrid.",
        seconds: 7.4
      },
      {
        text: "While European cities threw raw chamber pots directly into dirt streets, Tenochtitlan employed one thousand dedicated municipal street sweepers.",
        mood: "day",
        imagePrompt: "Spotless stone marketplace plaza swept clean with reed brooms under clear blue skies beside whitewashed adobe walls. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-cleanliness-vs-europe/2.png",
        audio: "audio/aztec-cleanliness-vs-europe/2.wav",
        voicedText: "While European cities threw raw chamber pots directly into dirt streets, Tenochtitlan employed one thousand dedicated municipal street sweepers.",
        seconds: 7.6
      },
      {
        text: "Fresh mountain spring water flowed into city centers through the Chapultepec aqueduct: twin pipes engineered so one could be cleaned while water flowed.",
        mood: "cool",
        imagePrompt: "Double stone aqueduct bridge crossing turquoise lake waters with clean mountain water flowing through smooth mortar channels. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-cleanliness-vs-europe/3.png",
        audio: "audio/aztec-cleanliness-vs-europe/3.wav",
        voicedText: "Fresh mountain spring water flowed into city centers through the Chapultepec aqueduct: twin pipes engineered so one could be cleaned while water flowed.",
        seconds: 7.7
      },
      {
        text: "Aztecs bathed twice daily in freshwater canals or private dome steam baths called 'temazcals', using saponin-rich soaproot plants.",
        mood: "warm",
        imagePrompt: "Dome-shaped stone temazcal steam lodge beside volcanic river rocks, steaming herbal water buckets, and dried soaproot roots. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-cleanliness-vs-europe/4.png",
        audio: "audio/aztec-cleanliness-vs-europe/4.wav",
        voicedText: "Aztecs bathed twice daily in freshwater canals or private dome steam baths called 'temazcals', using saponin-rich soaproot plants.",
        seconds: 7.5
      },
      {
        text: "They brushed their teeth with charred charcoal and wild pepper bark, and chewed aromatic 'chicle' tree sap to sweeten their breath.",
        mood: "warm",
        imagePrompt: "Carved clay vanity tray holding chunks of natural chicle gum, aromatic herb leaves, and powdered tooth-cleaning bark. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-cleanliness-vs-europe/5.png",
        audio: "audio/aztec-cleanliness-vs-europe/5.wav",
        voicedText: "They brushed their teeth with charred charcoal and wild pepper bark, and chewed aromatic 'chicle' tree sap to sweeten their breath.",
        seconds: 7.5
      },
      {
        text: "Aztecs found Spanish soldiers' body odor completely repulsive! Did you know the Aztecs invented natural chewing gum?",
        mood: "day",
        imagePrompt: "Sunlight dancing across lush floating chinampa garden islands with willow trees and purple flowering water hyacinths. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-cleanliness-vs-europe/6.png",
        audio: "audio/aztec-cleanliness-vs-europe/6.wav",
        voicedText: "Aztecs found Spanish soldiers' body odor completely repulsive! Did you know the Aztecs invented natural chewing gum?",
        seconds: 7.1
      }
    ]
  },
  // 7. Inca Rope Bridges Chasm
  {
    slug: "inca-rope-bridges-chasm",
    title: "Inca Grass Bridges Over 200-Foot Canyons",
    hook: "Inca engineers wove bridges across raging rivers out of wild grass fibers.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Across the Andes mountain range, deep roaring river canyons presented seemingly impassable barriers to Inca army expansion.",
        mood: "cool",
        imagePrompt: "Deep Andean river gorge with vertical granite cliff walls and a raging whitewater river churning hundreds of feet below. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-rope-bridges-chasm/1.png",
        audio: "audio/inca-rope-bridges-chasm/1.wav",
        voicedText: "Across the Andes mountain range, deep roaring river canyons presented seemingly impassable barriers to Inca army expansion.",
        seconds: 7.3
      },
      {
        text: "Without iron cables or wheeled construction vehicles, Inca master engineers constructed suspension bridges made entirely of wild mountain grass.",
        mood: "warm",
        imagePrompt: "Bales of harvested coarse Andean 'q'oya' bunchgrass bundled with leather ties on an open rocky terrace in mountain sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-rope-bridges-chasm/2.png",
        audio: "audio/inca-rope-bridges-chasm/2.wav",
        voicedText: "Without iron cables or wheeled construction vehicles, Inca master engineers constructed suspension bridges made entirely of wild mountain grass.",
        seconds: 7.5
      },
      {
        text: "Communities gathered annually to twist wild 'q'oya' grass into small cords, which were braided into six main cables as thick as a human torso.",
        mood: "warm",
        imagePrompt: "Close-up of massive braided grass bridge cables anchored with heavy knots over massive carved stone masonry abutments. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-rope-bridges-chasm/3.png",
        audio: "audio/inca-rope-bridges-chasm/3.wav",
        voicedText: "Communities gathered annually to twist wild 'q'oya' grass into small cords, which were braided into six main cables as thick as a human torso.",
        seconds: 7.6
      },
      {
        text: "Spanning up to two hundred feet across dizzying chasms, the cables were anchored to massive megalithic stone abutments on cliff edges.",
        mood: "cool",
        imagePrompt: "Graceful swinging grass rope suspension bridge spanning across a deep canyon gorge between twin stone pillars in clouds. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-rope-bridges-chasm/4.png",
        audio: "audio/inca-rope-bridges-chasm/4.wav",
        voicedText: "Spanning up to two hundred feet across dizzying chasms, the cables were anchored to massive megalithic stone abutments on cliff edges.",
        seconds: 7.4
      },
      {
        text: "Woven wooden slat footpaths and braided handrails swayed gently in canyon winds, strong enough to support marching armies and llama trains.",
        mood: "warm",
        imagePrompt: "Footpath view looking across a woven rope bridge with wooden cross slats and thick braided handrails swaying over misty air. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-rope-bridges-chasm/5.png",
        audio: "audio/inca-rope-bridges-chasm/5.wav",
        voicedText: "Woven wooden slat footpaths and braided handrails swayed gently in canyon winds, strong enough to support marching armies and llama trains.",
        seconds: 7.6
      },
      {
        text: "The Q'eswachaka bridge is still rebuilt by hand every single June! Would you walk across a bridge made of grass?",
        mood: "day",
        imagePrompt: "Breathtaking sunny Andean mountain vista with green terraced slopes and the blue Apurimac river glistening below. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-rope-bridges-chasm/6.png",
        audio: "audio/inca-rope-bridges-chasm/6.wav",
        voicedText: "The Q'eswachaka bridge is still rebuilt by hand every single June! Would you walk across a bridge made of grass?",
        seconds: 7.1
      }
    ]
  },
  // 8. Aztec Eagle and Jaguar Knights
  {
    slug: "aztec-eagle-and-jaguar-knights",
    title: "Aztec Eagle and Jaguar Warriors",
    hook: "To join elite orders, warriors had to capture four enemy soldiers alive.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the Aztec army, hereditary birth did not guarantee military status: true honor had to be earned on the field of combat.",
        mood: "warm",
        imagePrompt: "Stone ceremonial courtyard of the Aztec temple of the Eagle and Jaguar warriors in Malinalco with carved rock portals. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-eagle-and-jaguar-knights/1.png",
        audio: "audio/aztec-eagle-and-jaguar-knights/1.wav",
        voicedText: "In the Aztec army, hereditary birth did not guarantee military status: true honor had to be earned on the field of combat.",
        seconds: 7.3
      },
      {
        text: "To join the elite warrior fraternities—the Eagle and Jaguar societies—a soldier had to capture four enemy champions alive in single combat.",
        mood: "warm",
        imagePrompt: "Quilted cotton ichcahuipilli armor suit soaked in brine for toughness displayed on a wooden armor stand in temple light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-eagle-and-jaguar-knights/2.png",
        audio: "audio/aztec-eagle-and-jaguar-knights/2.wav",
        voicedText: "To join the elite warrior fraternities—the Eagle and Jaguar societies—a soldier had to capture four enemy champions alive in single combat.",
        seconds: 7.7
      },
      {
        text: "Jaguar warriors wore full-body battle suits tailored from real spotted jaguar pelts, with their faces peering out from the snarling open jaw.",
        mood: "dark",
        imagePrompt: "Snarling jaguar head helmet headdress with jade stone teeth and real spotted ocelot fur draped over an altar. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-eagle-and-jaguar-knights/3.png",
        audio: "audio/aztec-eagle-and-jaguar-knights/3.wav",
        voicedText: "Jaguar warriors wore full-body battle suits tailored from real spotted jaguar pelts, with their faces peering out from the snarling open jaw.",
        seconds: 7.5
      },
      {
        text: "Eagle warriors wore helmets shaped like curved raptor beaks, adorned with thousands of iridescent green quetzal and eagle feathers.",
        mood: "warm",
        imagePrompt: "Majestic eagle warrior carved wooden helmet with an open curved beak crest adorned with green emerald quetzal plumes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-eagle-and-jaguar-knights/4.png",
        audio: "audio/aztec-eagle-and-jaguar-knights/4.wav",
        voicedText: "Eagle warriors wore helmets shaped like curved raptor beaks, adorned with thousands of iridescent green quetzal and eagle feathers.",
        seconds: 7.5
      },
      {
        text: "They were rewarded with private estates, fine woven cotton robes, and the exclusive right to drink chocolate and wear gold jewelry.",
        mood: "warm",
        imagePrompt: "Gold Aztec pectoral necklace with filigree sun discs and turquoise ear spools resting on a red feather blanket. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-eagle-and-jaguar-knights/5.png",
        audio: "audio/aztec-eagle-and-jaguar-knights/5.wav",
        voicedText: "They were rewarded with private estates, fine woven cotton robes, and the exclusive right to drink chocolate and wear gold jewelry.",
        seconds: 7.5
      },
      {
        text: "Which elite order would you have joined: the Eagle of the sun, or the Jaguar of the night? Tell us below!",
        mood: "day",
        imagePrompt: "Dramatic golden sunrise breaking over the twin volcanic peaks of Popocatepetl and Iztaccihuatl behind Tenochtitlan. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/aztec-eagle-and-jaguar-knights/6.png",
        audio: "audio/aztec-eagle-and-jaguar-knights/6.wav",
        voicedText: "Which elite order would you have joined: the Eagle of the sun, or the Jaguar of the night? Tell us below!",
        seconds: 7.0
      }
    ]
  },
  // 9. Maya Blue Miracle Pigment
  {
    slug: "maya-blue-miracle-pigment",
    title: "The Secret Formula of Maya Blue",
    hook: "Maya blue pigment resisted acid and rot for 1,000 years in the jungle.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Across the ancient ruins of Palenque and Bonampak, thousand-year-old temple murals still glow with an astonishingly vibrant sky-blue hue.",
        mood: "cool",
        imagePrompt: "Ancient Maya temple stone wall mural with vivid turquoise-blue painted backgrounds showing hieroglyphs and royal figures in jungle light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-blue-miracle-pigment/1.png",
        audio: "audio/maya-blue-miracle-pigment/1.wav",
        voicedText: "Across the ancient ruins of Palenque and Bonampak, thousand-year-old temple murals still glow with an astonishingly vibrant sky-blue hue.",
        seconds: 7.5
      },
      {
        text: "While European oil paintings faded or darkened within decades, 'Maya Blue' resisted chemical acids, blistering heat, and tropical mold.",
        mood: "cool",
        imagePrompt: "Laboratory glass beaker with foaming acid bubbling harmlessly against a stone slab painted with radiant Maya Blue pigment. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-blue-miracle-pigment/2.png",
        audio: "audio/maya-blue-miracle-pigment/2.wav",
        voicedText: "While European oil paintings faded or darkened within decades, 'Maya Blue' resisted chemical acids, blistering heat, and tropical mold.",
        seconds: 7.5
      },
      {
        text: "For centuries, modern chemists could not crack the secret recipe of this indestructible miracle pigment.",
        mood: "warm",
        imagePrompt: "Alchemist's wooden worktable with natural raw clay powder, dried indigo leaves, ceramic mixing bowls, and pestle. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-blue-miracle-pigment/3.png",
        audio: "audio/maya-blue-miracle-pigment/3.wav",
        voicedText: "For centuries, modern chemists could not crack the secret recipe of this indestructible miracle pigment.",
        seconds: 7.1
      },
      {
        text: "The secret was nano-chemistry: Maya priests heated organic indigo dye together with palygorskite clay crystals over burning copal incense fires.",
        mood: "warm",
        imagePrompt: "Clay ceremonial incense burner with smoking fragrant copal resin embers heating ceramic pigment bowls in a temple sanctum. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-blue-miracle-pigment/4.png",
        audio: "audio/maya-blue-miracle-pigment/4.wav",
        voicedText: "The secret was nano-chemistry: Maya priests heated organic indigo dye together with palygorskite clay crystals over burning copal incense fires.",
        seconds: 7.7
      },
      {
        text: "The heat permanently locked indigo molecules inside microscopic silicate clay channels, shielding the color from sun and rot forever.",
        mood: "cool",
        imagePrompt: "Close-up of vibrant turquoise blue ceramic glaze on a ceremonial Maya pottery tripod vessel glowing in daylight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-blue-miracle-pigment/5.png",
        audio: "audio/maya-blue-miracle-pigment/5.wav",
        voicedText: "The heat permanently locked indigo molecules inside microscopic silicate clay channels, shielding the color from sun and rot forever.",
        seconds: 7.6
      },
      {
        text: "Ancient Maya priests invented nanotechnology a thousand years before modern science! Did you know about Maya Blue?",
        mood: "day",
        imagePrompt: "Majestic Maya pyramid of Palenque rising out of emerald jungle canopy surrounded by swirling morning mist. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/maya-blue-miracle-pigment/6.png",
        audio: "audio/maya-blue-miracle-pigment/6.wav",
        voicedText: "Ancient Maya priests invented nanotechnology a thousand years before modern science! Did you know about Maya Blue?",
        seconds: 7.1
      }
    ]
  },
  // 10. Inca Freeze Dried Potatoes
  {
    slug: "inca-freeze-dried-potatoes",
    title: "Incas Invented Freeze-Dried Food",
    hook: "500 years before NASA, Inca mountain farmers created freeze-dried chuño.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "High on the Andean plateau thirteen thousand feet above sea level, intense frosts made growing standard crops nearly impossible.",
        mood: "cool",
        imagePrompt: "High-altitude windswept Andean plateau with frost-covered bunchgrass and dramatic snowy volcanic peaks on the horizon. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-freeze-dried-potatoes/1.png",
        audio: "audio/inca-freeze-dried-potatoes/1.wav",
        voicedText: "High on the Andean plateau thirteen thousand feet above sea level, intense frosts made growing standard crops nearly impossible.",
        seconds: 7.4
      },
      {
        text: "To guarantee food security against drought and famine, Inca farmers invented 'chuño': the world's first freeze-dried potatoes.",
        mood: "warm",
        imagePrompt: "Woven reed baskets filled with colorful native Andean purple, red, and golden potatoes arranged on stone drying terraces. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-freeze-dried-potatoes/2.png",
        audio: "audio/inca-freeze-dried-potatoes/2.wav",
        voicedText: "To guarantee food security against drought and famine, Inca farmers invented 'chuño': the world's first freeze-dried potatoes.",
        seconds: 7.5
      },
      {
        text: "At harvest, farmers spread thousands of small native potatoes across open straw mats during sub-zero freezing Andean nights.",
        mood: "night",
        imagePrompt: "Starlit Andean night with frost forming crystals across potatoes spread out on golden straw mats under a full moon. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-freeze-dried-potatoes/3.png",
        audio: "audio/inca-freeze-dried-potatoes/3.wav",
        voicedText: "At harvest, farmers spread thousands of small native potatoes across open straw mats during sub-zero freezing Andean nights.",
        seconds: 7.3
      },
      {
        text: "At sunrise, families stomped the thawed potatoes with bare feet to squeeze out moisture, letting the blistering dry mountain sun evaporate the rest.",
        mood: "warm",
        imagePrompt: "Sunlit stone terrace showing trampled dark dried potato nuggets drying in high-altitude mountain sunshine. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-freeze-dried-potatoes/4.png",
        audio: "audio/inca-freeze-dried-potatoes/4.wav",
        voicedText: "At sunrise, families stomped the thawed potatoes with bare feet to squeeze out moisture, letting the blistering dry mountain sun evaporate the rest.",
        seconds: 7.7
      },
      {
        text: "Repeated for five days, the result was a rock-hard, lightweight black nugget that could be stored in royal granaries for over ten years without rotting.",
        mood: "warm",
        imagePrompt: "Clay storage pots filled with dark dried chuño nuggets stored inside a cool Inca stone colca granary on a mountain ridge. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-freeze-dried-potatoes/5.png",
        audio: "audio/inca-freeze-dried-potatoes/5.wav",
        voicedText: "Repeated for five days, the result was a rock-hard, lightweight black nugget that could be stored in royal granaries for over ten years without rotting.",
        seconds: 7.8
      },
      {
        text: "Soaked in water, chuño reconstituted into hearty soups that fed armies. Would you try a 500-year-old freeze-dried potato? Tell us below!",
        mood: "day",
        imagePrompt: "Clay cooking pot simmering with steaming potato and herb soup on a stone hearth with panoramic mountain views. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/inca-freeze-dried-potatoes/6.png",
        audio: "audio/inca-freeze-dried-potatoes/6.wav",
        voicedText: "Soaked in water, chuño reconstituted into hearty soups that fed armies. Would you try a 500-year-old freeze-dried potato? Tell us below!",
        seconds: 7.2
      }
    ]
  }
];

console.log(`Writing remaining 7 Mesoamerica scripts...`);
for (const s of MESOAMERICA_MORE) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

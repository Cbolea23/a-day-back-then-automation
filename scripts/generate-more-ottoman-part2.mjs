import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const OTTOMAN_PART2 = [
  // 7. Ottoman Tulip Mania Istanbul
  {
    slug: "ottoman-tulip-mania-istanbul",
    title: "When Tulips Bankrupted Ottoman Nobles",
    hook: "During the 1720s, rare tulip bulbs cost more than palace mansions.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the 1720s, during the reign of Sultan Ahmed III, Istanbul succumbed to an extravagant obsession known as the 'Tulip Era'.",
        mood: "warm",
        imagePrompt: "Terraced imperial palace garden in Istanbul overlooking the Bosphorus filled with beds of exotic colorful tulips. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-tulip-mania-istanbul/1.png",
        audio: "audio/ottoman-tulip-mania-istanbul/1.wav",
        voicedText: "In the 1720s, during the reign of Sultan Ahmed III, Istanbul succumbed to an extravagant obsession known as the 'Tulip Era'.",
        seconds: 7.3
      },
      {
        text: "The prized flower was the slender Ottoman tulip, bred for razor-sharp dagger petals and intricate variegated color flame patterns.",
        mood: "warm",
        imagePrompt: "Close-up of a delicate porcelain Iznik vase displaying a single elongated crimson tulip with pointed dagger petals. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-tulip-mania-istanbul/2.png",
        audio: "audio/ottoman-tulip-mania-istanbul/2.wav",
        voicedText: "The prized flower was the slender Ottoman tulip, bred for razor-sharp dagger petals and intricate variegated color flame patterns.",
        seconds: 7.4
      },
      {
        text: "Prices exploded: a single rare bulb called 'Light of the Mind' sold for over one thousand gold coins, bankrupting aristocratic viziers.",
        mood: "warm",
        imagePrompt: "Antique velvet-lined wooden jewel casket containing rare dried tulip bulbs resting on a carpet beside stacks of gold ducats. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-tulip-mania-istanbul/3.png",
        audio: "audio/ottoman-tulip-mania-istanbul/3.wav",
        voicedText: "Prices exploded: a single rare bulb called 'Light of the Mind' sold for over one thousand gold coins, bankrupting aristocratic viziers.",
        seconds: 7.6
      },
      {
        text: "At lavish nocturnal palace garden festivals, live tortoises with small candles strapped to their shells wandered among flowerbeds.",
        mood: "dark",
        imagePrompt: "Nocturnal garden path illuminated by tiny glowing candle flames wandering between dark tulip beds under crescent moonlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-tulip-mania-istanbul/4.png",
        audio: "audio/ottoman-tulip-mania-istanbul/4.wav",
        voicedText: "At lavish nocturnal palace garden festivals, live tortoises with small candles strapped to their shells wandered among flowerbeds.",
        seconds: 7.5
      },
      {
        text: "While nobles squandered fortunes on floral parties, the common people faced starvation, sparking a violent rebellion that dethroned the Sultan.",
        mood: "dark",
        imagePrompt: "Smoldering palace garden gate with broken wooden flower trellises and overturned marble planters in the aftermath of revolt. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-tulip-mania-istanbul/5.png",
        audio: "audio/ottoman-tulip-mania-istanbul/5.wav",
        voicedText: "While nobles squandered fortunes on floral parties, the common people faced starvation, sparking a violent rebellion that dethroned the Sultan.",
        seconds: 7.8
      },
      {
        text: "Would you have spent a fortune on a single rare flower bulb? Drop a comment below and subscribe!",
        mood: "day",
        imagePrompt: "Peaceful morning sunshine over the gardens of Istanbul with ancient cypress trees standing tall against a bright sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-tulip-mania-istanbul/6.png",
        audio: "audio/ottoman-tulip-mania-istanbul/6.wav",
        voicedText: "Would you have spent a fortune on a single rare flower bulb? Drop a comment below and subscribe!",
        seconds: 7.0
      }
    ]
  },
  // 8. Ottoman Spahi Cavalry
  {
    slug: "ottoman-spahi-cavalry",
    title: "The Heavily Armored Sipahi Horsemen",
    hook: "Sipahi cavalry were feudal landlords who rode Arabian warhorses into battle.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "While Janissaries fought on foot, the heavy striking fist of the Ottoman military was the elite mounted 'Sipahi' cavalry.",
        mood: "warm",
        imagePrompt: "Sunlit cavalry stables with leather saddles, brass stirrups, and iron horse armor resting against stable stall doors. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-spahi-cavalry/1.png",
        audio: "audio/ottoman-spahi-cavalry/1.wav",
        voicedText: "While Janissaries fought on foot, the heavy striking fist of the Ottoman military was the elite mounted 'Sipahi' cavalry.",
        seconds: 7.3
      },
      {
        text: "Sipahis were aristocratic landed lords who collected village taxes in exchange for providing fully armed cavalrymen for imperial campaigns.",
        mood: "warm",
        imagePrompt: "Rolling Anatolian countryside with stone estate manor and green wheat fields under expansive sunny skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-spahi-cavalry/2.png",
        audio: "audio/ottoman-spahi-cavalry/2.wav",
        voicedText: "Sipahis were aristocratic landed lords who collected village taxes in exchange for providing fully armed cavalrymen for imperial campaigns.",
        seconds: 7.5
      },
      {
        text: "They wore intricate 'krug' armor: interlocking steel rings riveted with heavy steel circular breastplates for maximum mobility.",
        mood: "cool",
        imagePrompt: "Ornate Ottoman chainmail and plate cuirass displayed on a wooden stand with gold koftgari calligraphic inlay. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-spahi-cavalry/3.png",
        audio: "audio/ottoman-spahi-cavalry/3.wav",
        voicedText: "They wore intricate 'krug' armor: interlocking steel rings riveted with heavy steel circular breastplates for maximum mobility.",
        seconds: 7.6
      },
      {
        text: "In battle, Sipahis wheeled across wings wielding nine-foot wooden lances, jeweled steel maces, and curved horn composite bows.",
        mood: "dramatic",
        imagePrompt: "Heavy steel-flanged war mace with gilded grip and small round buckler shield resting on military leather saddlebags. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-spahi-cavalry/4.png",
        audio: "audio/ottoman-spahi-cavalry/4.wav",
        voicedText: "In battle, Sipahis wheeled across wings wielding nine-foot wooden lances, jeweled steel maces, and curved horn composite bows.",
        seconds: 7.5
      },
      {
        text: "Their lightning flank charges routed European knight armies at Varna and Mohács, expanding the empire across three continents.",
        mood: "warm",
        imagePrompt: "Expansive battle plain with distant dust clouds rising against a dramatic mountain ridge under late afternoon light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-spahi-cavalry/5.png",
        audio: "audio/ottoman-spahi-cavalry/5.wav",
        voicedText: "Their lightning flank charges routed European knight armies at Varna and Mohács, expanding the empire across three continents.",
        seconds: 7.4
      },
      {
        text: "Could you have held off an armored Sipahi charge on horseback? Let us know below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Ancient stone fortress ruins overlooking a calm Anatolian valley with wildflowers blooming in gentle morning light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-spahi-cavalry/6.png",
        audio: "audio/ottoman-spahi-cavalry/6.wav",
        voicedText: "Could you have held off an armored Sipahi charge on horseback? Let us know below and follow for daily history stories!",
        seconds: 7.0
      }
    ]
  },
  // 9. Ottoman Siege Cannon Dardanelles
  {
    slug: "ottoman-siege-cannon-dardanelles",
    title: "The 18-Ton Super-Cannons of 1453",
    hook: "Urban's bronze cannons required 60 oxen and 200 men to move.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "For a thousand years, the triple Theodosian walls of Constantinople stood impregnable against every invading army in history.",
        mood: "cool",
        imagePrompt: "Colossal historic limestone and brick Theodosian walls of Constantinople with towering defensive battlements under dramatic skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-siege-cannon-dardanelles/1.png",
        audio: "audio/ottoman-siege-cannon-dardanelles/1.wav",
        voicedText: "For a thousand years, the triple Theodosian walls of Constantinople stood impregnable against every invading army in history.",
        seconds: 7.4
      },
      {
        text: "In 1453, twenty-one-year-old Sultan Mehmed hired a Hungarian master foundry engineer named Urban to cast the unthinkable.",
        mood: "warm",
        imagePrompt: "Foundry furnace glowing with molten bronze with iron tongs, clay casting molds, and wooden bellows in a stone workshop. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-siege-cannon-dardanelles/2.png",
        audio: "audio/ottoman-siege-cannon-dardanelles/2.wav",
        voicedText: "In 1453, twenty-one-year-old Sultan Mehmed hired a Hungarian master foundry engineer named Urban to cast the unthinkable.",
        seconds: 7.5
      },
      {
        text: "They cast the 'Basilica': a bronze super-bombard twenty-seven feet long, weighing eighteen tons, capable of firing 1,200-pound granite boulders.",
        mood: "cool",
        imagePrompt: "Massive dark bronze siege cannon barrel resting on heavy oak timber carriages with iron reinforcement bands. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-siege-cannon-dardanelles/3.png",
        audio: "audio/ottoman-siege-cannon-dardanelles/3.wav",
        voicedText: "They cast the 'Basilica': a bronze super-bombard twenty-seven feet long, weighing eighteen tons, capable of firing 1,200-pound granite boulders.",
        seconds: 7.6
      },
      {
        text: "Moving the colossus took sixty massive oxen and two hundred laborers two full months to drag over reinforced wooden bridges.",
        mood: "warm",
        imagePrompt: "Muddy medieval siege road with heavy oak log corduroy pathways cut through forest hillsides under cloudy skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-siege-cannon-dardanelles/4.png",
        audio: "audio/ottoman-siege-cannon-dardanelles/4.wav",
        voicedText: "Moving the colossus took sixty massive oxen and two hundred laborers two full months to drag over reinforced wooden bridges.",
        seconds: 7.4
      },
      {
        text: "It fired only seven times a day because the bronze barrel overheated so violently that crews had to bathe it in warm olive oil.",
        mood: "dark",
        imagePrompt: "Earthen siege earthworks with barrels of olive oil and spherical carved granite cannonballs stacked beside smoking bronze cannon. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-siege-cannon-dardanelles/5.png",
        audio: "audio/ottoman-siege-cannon-dardanelles/5.wav",
        voicedText: "It fired only seven times a day because the bronze barrel overheated so violently that crews had to bathe it in warm olive oil.",
        seconds: 7.7
      },
      {
        text: "The thunderous stone impacts shattered the ancient walls, ending the Byzantine Empire forever. Did you know cannons ended the Middle Ages?",
        mood: "day",
        imagePrompt: "Modern preserved Dardanelles bronze cannon on a stone fortress platform overlooking the deep blue waters of the strait. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-siege-cannon-dardanelles/6.png",
        audio: "audio/ottoman-siege-cannon-dardanelles/6.wav",
        voicedText: "The thunderous stone impacts shattered the ancient walls, ending the Byzantine Empire forever. Did you know cannons ended the Middle Ages?",
        seconds: 7.3
      }
    ]
  },
  // 10. Ottoman Mehter Military Band
  {
    slug: "ottoman-mehter-military-band",
    title: "The World's Loudest Military Marching Band",
    hook: "The Mehter band marched into battle with giant kettledrums on camels.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Long before European armies marched to drums, the Ottoman Empire pioneered the world's first dedicated military marching orchestra: the Mehter.",
        mood: "warm",
        imagePrompt: "Sunlit military encampment with red silk pavilions and rows of polished brass trumpets and percussion instruments. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-mehter-military-band/1.png",
        audio: "audio/ottoman-mehter-military-band/1.wav",
        voicedText: "Long before European armies marched to drums, the Ottoman Empire pioneered the world's first dedicated military marching orchestra: the Mehter.",
        seconds: 7.5
      },
      {
        text: "They marched right behind charging infantry battalions, producing a deafening wall of sound designed for psychological warfare.",
        mood: "dramatic",
        imagePrompt: "Ornate brass military horn with swirling calligraphic engravings and silk tassels hanging against a military tent wall. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-mehter-military-band/2.png",
        audio: "audio/ottoman-mehter-military-band/2.wav",
        voicedText: "They marched right behind charging infantry battalions, producing a deafening wall of sound designed for psychological warfare.",
        seconds: 7.4
      },
      {
        text: "Giant copper kettledrums called 'kös'—measuring five feet across—were mounted in pairs on the backs of marching war camels.",
        mood: "warm",
        imagePrompt: "Pair of massive hammered copper kettledrums with thick rawhide drum skins mounted on a leather pack saddle. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-mehter-military-band/3.png",
        audio: "audio/ottoman-mehter-military-band/3.wav",
        voicedText: "Giant copper kettledrums called 'kös'—measuring five feet across—were mounted in pairs on the backs of marching war camels.",
        seconds: 7.3
      },
      {
        text: "Clashing heavy cast-bronze cymbals, piercing zurna shawms, and roaring bass drums created a sonic wave audible three miles away.",
        mood: "dramatic",
        imagePrompt: "Pair of heavy chased bronze hand cymbals resting beside a carved wooden double-reed zurna horn on crimson carpet. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-mehter-military-band/4.png",
        audio: "audio/ottoman-mehter-military-band/4.wav",
        voicedText: "Clashing heavy cast-bronze cymbals, piercing zurna shawms, and roaring bass drums created a sonic wave audible three miles away.",
        seconds: 7.6
      },
      {
        text: "They marched in a slow, hypnotic three-step cadence, chanting praises of bravery that paralyzed enemy defenders with dread.",
        mood: "warm",
        imagePrompt: "High-flying Ottoman crescent horsehair tugh banner waving in the wind against a golden sunset sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-mehter-military-band/5.png",
        audio: "audio/ottoman-mehter-military-band/5.wav",
        voicedText: "They marched in a slow, hypnotic three-step cadence, chanting praises of bravery that paralyzed enemy defenders with dread.",
        seconds: 7.4
      },
      {
        text: "European composers like Mozart and Beethoven fell in love with Mehter cymbals, creating 'Turkish' classical music. Did you know this?",
        mood: "day",
        imagePrompt: "Grand historic gate of Istanbul Military Museum with brass ceremonial cannons standing guard under blue skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-mehter-military-band/6.png",
        audio: "audio/ottoman-mehter-military-band/6.wav",
        voicedText: "European composers like Mozart and Beethoven fell in love with Mehter cymbals, creating 'Turkish' classical music. Did you know this?",
        seconds: 7.2
      }
    ]
  },
  // 11. Ottoman Imperial Harem Politics
  {
    slug: "ottoman-imperial-hareem-politics",
    title: "The Powerful Women Who Ruled the Empire",
    hook: "During the 'Sultanate of Women', imperial mothers ruled from palace walls.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Western orientalist paintings depicted the Ottoman imperial harem as a sensual palace prison, but the reality was a political nerve center.",
        mood: "warm",
        imagePrompt: "Lavish tiled courtyard of the Topkapi Palace imperial harem with mother-of-pearl shutters, stained glass windows, and marble fountains. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-imperial-hareem-politics/1.png",
        audio: "audio/ottoman-imperial-hareem-politics/1.wav",
        voicedText: "Western orientalist paintings depicted the Ottoman imperial harem as a sensual palace prison, but the reality was a political nerve center.",
        seconds: 7.5
      },
      {
        text: "The harem was an elite academy where hundreds of women received years of education in law, diplomacy, Islamic theology, and calligraphy.",
        mood: "warm",
        imagePrompt: "Intricately carved wooden writing desk in the harem schoolroom with reed pens, ink bottles, and illuminated manuscripts. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-imperial-hareem-politics/2.png",
        audio: "audio/ottoman-imperial-hareem-politics/2.wav",
        voicedText: "The harem was an elite academy where hundreds of women received years of education in law, diplomacy, Islamic theology, and calligraphy.",
        seconds: 7.6
      },
      {
        text: "The supreme ruler was the 'Valide Sultan'—the Sultan's mother—who outranked grand viziers and managed astronomical wealth.",
        mood: "warm",
        imagePrompt: "Imperial chambers of the Valide Sultan with gilded domed ceilings, Iznik floral tiles, and an elaborate gold-trimmed canopied throne. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-imperial-hareem-politics/3.png",
        audio: "audio/ottoman-imperial-hareem-politics/3.wav",
        voicedText: "The supreme ruler was the 'Valide Sultan'—the Sultan's mother—who outranked grand viziers and managed astronomical wealth.",
        seconds: 7.4
      },
      {
        text: "During the 16th and 17th centuries, known as the 'Sultanate of Women', matriarchs like Hürrem and Kösem Sultan effectively ran the entire empire.",
        mood: "cool",
        imagePrompt: "Gilded lattice screen window overlooking the imperial divan council hall where women secretly observed political debates. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-imperial-hareem-politics/4.png",
        audio: "audio/ottoman-imperial-hareem-politics/4.wav",
        voicedText: "During the 16th and 17th centuries, known as the 'Sultanate of Women', matriarchs like Hürrem and Kösem Sultan effectively ran the entire empire.",
        seconds: 7.7
      },
      {
        text: "They corresponded with European monarchs, financed great architectural mosques, and negotiated international peace treaties.",
        mood: "warm",
        imagePrompt: "Royal diplomatic letter with gold illumination and wax seal addressed to European queens resting on a velvet desk runner. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-imperial-hareem-politics/5.png",
        audio: "audio/ottoman-imperial-hareem-politics/5.wav",
        voicedText: "They corresponded with European monarchs, financed great architectural mosques, and negotiated international peace treaties.",
        seconds: 7.3
      },
      {
        text: "These brilliant women wielded unprecedented global power from within palace walls. Did you know the empire was ruled by women?",
        mood: "day",
        imagePrompt: "Soaring domes and minarets of the Sultanahmet district in Istanbul shining in warm afternoon sunlight over the Marmara sea. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-imperial-hareem-politics/6.png",
        audio: "audio/ottoman-imperial-hareem-politics/6.wav",
        voicedText: "These brilliant women wielded unprecedented global power from within palace walls. Did you know the empire was ruled by women?",
        seconds: 7.2
      }
    ]
  },
  // 12. Ottoman Sherbet Snow Drinks
  {
    slug: "ottoman-sherbet-snow-drinks",
    title: "Mountain Snow Sherbets in the Summer Heat",
    hook: "Couriers rushed packed mountain snow from Mount Olympus on swift mules.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "During sweltering humid summer months in 16th-century Istanbul, royal palaces enjoyed ice-cold fruity drinks without electric freezers.",
        mood: "warm",
        imagePrompt: "Sun-drenched marble terrace in Istanbul overlooking the shimmering waters of the Bosphorus with sailing caïques. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-sherbet-snow-drinks/1.png",
        audio: "audio/ottoman-sherbet-snow-drinks/1.wav",
        voicedText: "During sweltering humid summer months in 16th-century Istanbul, royal palaces enjoyed ice-cold fruity drinks without electric freezers.",
        seconds: 7.4
      },
      {
        text: "The secret was an imperial relay system of swift mule couriers who rode high into the snow-capped peaks of Mount Uludağ.",
        mood: "cool",
        imagePrompt: "Dramatic rocky alpine mountain ridges of Mount Uludağ covered in glistening snow under crisp blue skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-sherbet-snow-drinks/2.png",
        audio: "audio/ottoman-sherbet-snow-drinks/2.wav",
        voicedText: "The secret was an imperial relay system of swift mule couriers who rode high into the snow-capped peaks of Mount Uludağ.",
        seconds: 7.3
      },
      {
        text: "Workers carved blocks of packed glacier snow, wrapped them in thick wool felt blankets, and stored them in deep mountain caves lined with straw.",
        mood: "cool",
        imagePrompt: "Underground stone icehouse cellar with stacked rectangular ice blocks insulated with golden straw and thick woven wool mats. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-sherbet-snow-drinks/3.png",
        audio: "audio/ottoman-sherbet-snow-drinks/3.wav",
        voicedText: "Workers carved blocks of packed glacier snow, wrapped them in thick wool felt blankets, and stored them in deep mountain caves lined with straw.",
        seconds: 7.6
      },
      {
        text: "At midnight, express couriers rushed the frozen cargo down to waiting boats, sailing across the Marmara sea into palace kitchens before dawn.",
        mood: "dark",
        imagePrompt: "Fast Ottoman rowed caïque boat slicing through midnight waters under glowing stars with covered burlap cargo in the bow. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-sherbet-snow-drinks/4.png",
        audio: "audio/ottoman-sherbet-snow-drinks/4.wav",
        voicedText: "At midnight, express couriers rushed the frozen cargo down to waiting boats, sailing across the Marmara sea into palace kitchens before dawn.",
        seconds: 7.6
      },
      {
        text: "Confectioners crushed the mountain snow into refreshing 'sherbet': flavored with ruby pomegranate juice, rosewater, tamarind, and fragrant mint.",
        mood: "warm",
        imagePrompt: "Crystal glass goblet filled with crushed shaved ice and ruby-red pomegranate sherbet garnished with fresh mint leaves and silver spoon. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-sherbet-snow-drinks/5.png",
        audio: "audio/ottoman-sherbet-snow-drinks/5.wav",
        voicedText: "Confectioners crushed the mountain snow into refreshing 'sherbet': flavored with ruby pomegranate juice, rosewater, tamarind, and fragrant mint.",
        seconds: 7.7
      },
      {
        text: "This ancient delicacy was the direct ancestor of modern sorbet and ice cream! What flavor of Ottoman sherbet would you try?",
        mood: "day",
        imagePrompt: "Shaded Ottoman garden pavilion with flowering jasmine vines climbing stone pillars beside a cool bubbling fountain. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-sherbet-snow-drinks/6.png",
        audio: "audio/ottoman-sherbet-snow-drinks/6.wav",
        voicedText: "This ancient delicacy was the direct ancestor of modern sorbet and ice cream! What flavor of Ottoman sherbet would you try?",
        seconds: 7.1
      }
    ]
  },
  // 13. Ottoman Archery World Record
  {
    slug: "ottoman-archery-world-record",
    title: "Ottoman Bows Broke World Flight Records",
    hook: "Sultan Selim III shot an arrow 972 yards across an archery field.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "To the Ottomans, archery was not merely a weapon of war—it was a sacred imperial art form practiced by Sultans and commoners alike.",
        mood: "warm",
        imagePrompt: "Expansive green archery field of Okmeydani in Istanbul with distant marble target columns standing under clear morning skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-archery-world-record/1.png",
        audio: "audio/ottoman-archery-world-record/1.wav",
        voicedText: "To the Ottomans, archery was not merely a weapon of war—it was a sacred imperial art form practiced by Sultans and commoners alike.",
        seconds: 7.5
      },
      {
        text: "Master artisans spent over a year crafting a single composite flight bow from maple wood, water buffalo horn, and animal tendon sinew.",
        mood: "warm",
        imagePrompt: "Craftsman workbench with curved horn limbs, fish glue pots, sinew bundles, and exquisite painted lacquer flight bows. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-archery-world-record/2.png",
        audio: "audio/ottoman-archery-world-record/2.wav",
        voicedText: "Master artisans spent over a year crafting a single composite flight bow from maple wood, water buffalo horn, and animal tendon sinew.",
        seconds: 7.6
      },
      {
        text: "Archers drew the bowstring with a carved jade or bone thumb ring called a 'zihgir', using the thumb to release arrows with zero finger drag.",
        mood: "cool",
        imagePrompt: "Close-up of a carved green jade archer's thumb ring resting on polished velvet beside feathered reed arrows. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-archery-world-record/3.png",
        audio: "audio/ottoman-archery-world-record/3.wav",
        voicedText: "Archers drew the bowstring with a carved jade or bone thumb ring called a 'zihgir', using the thumb to release arrows with zero finger drag.",
        seconds: 7.4
      },
      {
        text: "In 1798, Sultan Selim III stood on the hills of Okmeydanı and loosed a flight arrow that soared an astounding 972 yards.",
        mood: "dramatic",
        imagePrompt: "Soaring flight arrow cutting through the upper atmosphere against bright clouds overlooking the Istanbul city skyline. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-archery-world-record/4.png",
        audio: "audio/ottoman-archery-world-record/4.wav",
        voicedText: "In 1798, Sultan Selim III stood on the hills of Okmeydanı and loosed a flight arrow that soared an astounding 972 yards.",
        seconds: 7.4
      },
      {
        text: "That is over half a mile—more than eight football fields long—a world distance flight record that stood unbroken for nearly two centuries.",
        mood: "warm",
        imagePrompt: "Carved marble target monument column erected on a hillside with Ottoman calligraphy commemorating an imperial record shot. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-archery-world-record/5.png",
        audio: "audio/ottoman-archery-world-record/5.wav",
        voicedText: "That is over half a mile—more than eight football fields long—a world distance flight record that stood unbroken for nearly two centuries.",
        seconds: 7.8
      },
      {
        text: "Could you have drawn a hundred-pound composite bow with your bare thumb? Drop a comment below and subscribe!",
        mood: "day",
        imagePrompt: "Peaceful grassy hilltop overlooking the Golden Horn in Istanbul with ancient stone minarets glowing in midday sunshine. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-archery-world-record/6.png",
        audio: "audio/ottoman-archery-world-record/6.wav",
        voicedText: "Could you have drawn a hundred-pound composite bow with your bare thumb? Drop a comment below and subscribe!",
        seconds: 7.1
      }
    ]
  }
];

console.log(`Writing remaining 7 Ottoman scripts...`);
for (const s of OTTOMAN_PART2) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

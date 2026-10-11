import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const OTTOMAN_SCRIPTS = [
  // 1. Ottoman Janissary Life
  {
    slug: "ottoman-janissary-life",
    title: "The Sultan's Elite Janissary Soldiers",
    hook: "Janissaries used giant copper soup cauldrons as sacred military flags.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the 14th century, the Ottoman Sultan created the Janissaries: history's first professional standing infantry in Europe.",
        mood: "warm",
        imagePrompt: "Grand courtyard of the Janissary barracks in Istanbul with stone arches, cypress trees, and weapon racks under morning sunlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-janissary-life/1.png",
        audio: "audio/ottoman-janissary-life/1.wav",
        voicedText: "In the 14th century, the Ottoman Sultan created the Janissaries: history's first professional standing infantry in Europe.",
        seconds: 7.2
      },
      {
        text: "Recruited as boys through the Devshirme system, they converted to Islam and underwent brutal discipline, archery, and musket training.",
        mood: "cool",
        imagePrompt: "Armory workshop with matchlock muskets, curved yatagan daggers, and composite bows displayed on whitewashed stone walls. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-janissary-life/2.png",
        audio: "audio/ottoman-janissary-life/2.wav",
        voicedText: "Recruited as boys through the Devshirme system, they converted to Islam and underwent brutal discipline, archery, and musket training.",
        seconds: 7.5
      },
      {
        text: "Curiously, their military ranks revolved entirely around the kitchen: colonels were called 'Soup Makers', and captains were 'Head Cooks'.",
        mood: "warm",
        imagePrompt: "Giant hammered copper soup cauldron resting on an outdoor hearth with long brass ladles and wooden bread bowls. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-janissary-life/3.png",
        audio: "audio/ottoman-janissary-life/3.wav",
        voicedText: "Curiously, their military ranks revolved entirely around the kitchen: colonels were called 'Soup Makers', and captains were 'Head Cooks'.",
        seconds: 7.6
      },
      {
        text: "Their sacred regimental standard wasn't a silk banner, but a massive copper soup cauldron carried at the head of every charging column.",
        mood: "warm",
        imagePrompt: "Heavy copper cauldron carried on iron poles adorned with horsehair plumes and crescent brass emblems in sunlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-janissary-life/4.png",
        audio: "audio/ottoman-janissary-life/4.wav",
        voicedText: "Their sacred regimental standard wasn't a silk banner, but a massive copper soup cauldron carried at the head of every charging column.",
        seconds: 7.5
      },
      {
        text: "If Janissaries overturned their soup cauldrons in the public square, it struck terror into the Sultan: it signaled armed military rebellion.",
        mood: "dark",
        imagePrompt: "Atmospheric Istanbul public square with overturned copper cauldrons and torches burning in the evening dusk outside palace gates. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-janissary-life/5.png",
        audio: "audio/ottoman-janissary-life/5.wav",
        voicedText: "If Janissaries overturned their soup cauldrons in the public square, it struck terror into the Sultan: it signaled armed military rebellion.",
        seconds: 7.7
      },
      {
        text: "Janissaries held veto power over Sultans for centuries. Did you know a chef's cauldron was the most feared flag in Europe?",
        mood: "day",
        imagePrompt: "Magnificent view of the Bosphorus strait in Istanbul with minarets of the Blue Mosque glowing against clear blue skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-janissary-life/6.png",
        audio: "audio/ottoman-janissary-life/6.wav",
        voicedText: "Janissaries held veto power over Sultans for centuries. Did you know a chef's cauldron was the most feared flag in Europe?",
        seconds: 7.1
      }
    ]
  },
  // 2. Ottoman Grand Bazaar Trade
  {
    slug: "ottoman-grand-bazaar-trade",
    title: "A Day in the 1461 Grand Bazaar",
    hook: "With 4,000 shops under covered vaulted ceilings, Istanbul ruled world trade.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Commissioned by Sultan Mehmed II in 1461, Istanbul's Grand Bazaar became the largest covered shopping market on planet Earth.",
        mood: "warm",
        imagePrompt: "Grand vaulted stone archway entrance to Istanbul's covered Grand Bazaar adorned with calligraphic gold inscriptions and tilework. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-grand-bazaar-trade/1.png",
        audio: "audio/ottoman-grand-bazaar-trade/1.wav",
        voicedText: "Commissioned by Sultan Mehmed II in 1461, Istanbul's Grand Bazaar became the largest covered shopping market on planet Earth.",
        seconds: 7.3
      },
      {
        text: "Over four thousand shops lined sixty-four covered streets, where shafts of sunlight poured through high domed ceiling oculi.",
        mood: "warm",
        imagePrompt: "Interior avenue of the Grand Bazaar with arched frescoed ceilings, hanging brass lamps, and shafts of golden sunlight beaming down. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-grand-bazaar-trade/2.png",
        audio: "audio/ottoman-grand-bazaar-trade/2.wav",
        voicedText: "Over four thousand shops lined sixty-four covered streets, where shafts of sunlight poured through high domed ceiling oculi.",
        seconds: 7.4
      },
      {
        text: "Every street was segregated by guild: one alley sold only hammered copper pots, another pure Damascus silk, and another gold jewelry.",
        mood: "warm",
        imagePrompt: "Bazaar merchant shopfront displaying stacks of woven Persian kilim carpets, brass samovars, and silk scarves. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-grand-bazaar-trade/3.png",
        audio: "audio/ottoman-grand-bazaar-trade/3.wav",
        voicedText: "Every street was segregated by guild: one alley sold only hammered copper pots, another pure Damascus silk, and another gold jewelry.",
        seconds: 7.5
      },
      {
        text: "Trade was impossible without ceremony: merchants invited prospective buyers onto wool divans to sip cardamom coffee and negotiate for hours.",
        mood: "warm",
        imagePrompt: "Small brass tray with miniature porcelain cups of Turkish coffee, glass water tumblers, and cubes of rosewater Turkish delight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-grand-bazaar-trade/4.png",
        audio: "audio/ottoman-grand-bazaar-trade/4.wav",
        voicedText: "Trade was impossible without ceremony: merchants invited prospective buyers onto wool divans to sip cardamom coffee and negotiate for hours.",
        seconds: 7.7
      },
      {
        text: "Guild masters maintained rigorous quality inspections: if a merchant overcharged or sold inferior cloth, his shop was padlocked shut.",
        mood: "cool",
        imagePrompt: "Heavy iron padlock secured over carved wooden cedar shop shutters with brass official guild seal wax on the frame. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-grand-bazaar-trade/5.png",
        audio: "audio/ottoman-grand-bazaar-trade/5.wav",
        voicedText: "Guild masters maintained rigorous quality inspections: if a merchant overcharged or sold inferior cloth, his shop was padlocked shut.",
        seconds: 7.4
      },
      {
        text: "The Grand Bazaar is still bustling today with over 250,000 visitors daily! What would you buy in the Grand Bazaar? Tell us below!",
        mood: "day",
        imagePrompt: "Glowing courtyard of an ancient caravanserai within the bazaar with stone fountain basins and green pomegranate trees. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-grand-bazaar-trade/6.png",
        audio: "audio/ottoman-grand-bazaar-trade/6.wav",
        voicedText: "The Grand Bazaar is still bustling today with over 250,000 visitors daily! What would you buy in the Grand Bazaar? Tell us below!",
        seconds: 7.2
      }
    ]
  },
  // 3. Ottoman Coffeehouse Bans
  {
    slug: "ottoman-coffeehouse-bans",
    title: "When Drinking Coffee Was Punishable by Death",
    hook: "Sultan Murad IV banned coffee and executed anyone caught sipping it.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the 16th century, coffee arrived in Istanbul from Yemen, igniting a craze for public 'kahvehane' coffeehouses.",
        mood: "warm",
        imagePrompt: "Traditional Ottoman coffeehouse interior with low wooden benches, Persian rugs, hanging brass lanterns, and nargile water pipes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-coffeehouse-bans/1.png",
        audio: "audio/ottoman-coffeehouse-bans/1.wav",
        voicedText: "In the 16th century, coffee arrived in Istanbul from Yemen, igniting a craze for public 'kahvehane' coffeehouses.",
        seconds: 7.2
      },
      {
        text: "Unlike quiet mosques, coffeehouses buzzed with poets, chess players, political gossip, and fierce debates about government policy.",
        mood: "warm",
        imagePrompt: "Intricately inlaid mother-of-pearl wooden chess set sitting on an octagonal table beside an open manuscript book. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-coffeehouse-bans/2.png",
        audio: "audio/ottoman-coffeehouse-bans/2.wav",
        voicedText: "Unlike quiet mosques, coffeehouses buzzed with poets, chess players, political gossip, and fierce debates about government policy.",
        seconds: 7.5
      },
      {
        text: "Sultans viewed these caffeine-fueled debates as dangerous breeding grounds for treason, revolution, and military coups.",
        mood: "dark",
        imagePrompt: "Dark Ottoman palace corridor with arched marble colonnades and heavy velvet draperies illuminated by flickering torchlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-coffeehouse-bans/3.png",
        audio: "audio/ottoman-coffeehouse-bans/3.wav",
        voicedText: "Sultans viewed these caffeine-fueled debates as dangerous breeding grounds for treason, revolution, and military coups.",
        seconds: 7.4
      },
      {
        text: "In 1633, Sultan Murad IV strictly banned coffee and tobacco across the entire empire under penalty of immediate public execution.",
        mood: "cool",
        imagePrompt: "Imperial Ottoman decree parchment with red and gold royal tughra seal nailed onto a wooden public notice board. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-coffeehouse-bans/4.png",
        audio: "audio/ottoman-coffeehouse-bans/4.wav",
        voicedText: "In 1633, Sultan Murad IV strictly banned coffee and tobacco across the entire empire under penalty of immediate public execution.",
        seconds: 7.6
      },
      {
        text: "Murad disguised himself as a common beggar and stalked Istanbul taverns at night, beheading illicit coffee drinkers on the spot.",
        mood: "dark",
        imagePrompt: "Curved Ottoman steel kilij scimitar resting across a stone balustrade overlooking dark Istanbul minarets at midnight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-coffeehouse-bans/5.png",
        audio: "audio/ottoman-coffeehouse-bans/5.wav",
        voicedText: "Murad disguised himself as a common beggar and stalked Istanbul taverns at night, beheading illicit coffee drinkers on the spot.",
        seconds: 7.6
      },
      {
        text: "Despite the brutal ban, the love for coffee was unstoppable, and later Sultans taxed coffee instead. Could you give up coffee on pain of death?",
        mood: "day",
        imagePrompt: "Steaming brass cezve coffee pot with frothy black coffee pouring into a delicate painted ceramic cup in morning sunshine. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-coffeehouse-bans/6.png",
        audio: "audio/ottoman-coffeehouse-bans/6.wav",
        voicedText: "Despite the brutal ban, the love for coffee was unstoppable, and later Sultans taxed coffee instead. Could you give up coffee on pain of death?",
        seconds: 7.2
      }
    ]
  }
];

console.log(`Writing initial Ottoman scripts...`);
for (const s of OTTOMAN_SCRIPTS) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

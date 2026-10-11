import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const OTTOMAN_MORE = [
  // 4. Ottoman Hamam Bathhouse
  {
    slug: "ottoman-hamam-bathhouse",
    title: "Gossip and Steam in the Turkish Hamam",
    hook: "Mothers used the bathhouse to inspect prospective brides for their sons.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In Ottoman cities, public life centered around the hamam: magnificent domed marble bathhouses heated by subterranean hypocaust furnaces.",
        mood: "warm",
        imagePrompt: "Monumental marble interior of an Ottoman hamam with central raised octagonal marble platform under a soaring starry dome. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-hamam-bathhouse/1.png",
        audio: "audio/ottoman-hamam-bathhouse/1.wav",
        voicedText: "In Ottoman cities, public life centered around the hamam: magnificent domed marble bathhouses heated by subterranean hypocaust furnaces.",
        seconds: 7.4
      },
      {
        text: "Men and women visited on strictly separated days or hours, wrapping themselves in checkered red-and-blue cotton 'peştemal' towels.",
        mood: "warm",
        imagePrompt: "Stacks of fringed checkered cotton bath towels and carved wooden bath clogs inlaid with mother-of-pearl resting on marble. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-hamam-bathhouse/2.png",
        audio: "audio/ottoman-hamam-bathhouse/2.wav",
        voicedText: "Men and women visited on strictly separated days or hours, wrapping themselves in checkered red-and-blue cotton 'peştemal' towels.",
        seconds: 7.3
      },
      {
        text: "Bathers lay on the hot central marble slab called the 'göbektaşı' to sweat out toxins while expert attendants gave deep muscle massages.",
        mood: "warm",
        imagePrompt: "Carved marble wash basin with running hot water, chased brass water bowls, and cakes of olive oil laurel soap. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-hamam-bathhouse/3.png",
        audio: "audio/ottoman-hamam-bathhouse/3.wav",
        voicedText: "Bathers lay on the hot central marble slab called the 'göbektaşı' to sweat out toxins while expert attendants gave deep muscle massages.",
        seconds: 7.6
      },
      {
        text: "Attendants used rough woven goat-hair 'kese' mitts and billows of olive-oil soap bubbles to scrub away layers of dead skin.",
        mood: "warm",
        imagePrompt: "Traditional woven goat-hair exfoliating mitt resting on a smooth marble ledge beside mounds of airy white olive oil soap foam. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-hamam-bathhouse/4.png",
        audio: "audio/ottoman-hamam-bathhouse/4.wav",
        voicedText: "Attendants used rough woven goat-hair 'kese' mitts and billows of olive-oil soap bubbles to scrub away layers of dead skin.",
        seconds: 7.3
      },
      {
        text: "For women, it was the social event of the week: mothers inspected potential brides, families shared picnic pastries, and musicians played lutes.",
        mood: "warm",
        imagePrompt: "Cooling relaxation courtyard with cushioned divans, brass tea trays with dried figs, and a bubbling central marble fountain. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-hamam-bathhouse/5.png",
        audio: "audio/ottoman-hamam-bathhouse/5.wav",
        voicedText: "For women, it was the social event of the week: mothers inspected potential brides, families shared picnic pastries, and musicians played lutes.",
        seconds: 7.7
      },
      {
        text: "Could you spend an entire six-hour afternoon lounging in a marble steam room? Let us know below and follow for daily history stories!",
        mood: "day",
        imagePrompt: "Exterior of historic Ottoman bathhouse with multiple leaded domes pierced by glass star oculi against a brilliant blue sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-hamam-bathhouse/6.png",
        audio: "audio/ottoman-hamam-bathhouse/6.wav",
        voicedText: "Could you spend an entire six-hour afternoon lounging in a marble steam room? Let us know below and follow for daily history stories!",
        seconds: 7.2
      }
    ]
  },
  // 5. Ottoman Topkapi Palace Kitchen
  {
    slug: "ottoman-topkapi-palace-kitchen",
    title: "Feeding 4,000 People in Topkapi Palace",
    hook: "The palace employed 1,000 cooks organized by dessert specialties.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Inside Istanbul's Topkapi Palace, the imperial kitchens formed an enormous complex of ten soaring domed culinary factories.",
        mood: "warm",
        imagePrompt: "Row of ten historic brick conical chimneys and domes of the Topkapi Palace kitchens overlooking the Sea of Marmara. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-topkapi-palace-kitchen/1.png",
        audio: "audio/ottoman-topkapi-palace-kitchen/1.wav",
        voicedText: "Inside Istanbul's Topkapi Palace, the imperial kitchens formed an enormous complex of ten soaring domed culinary factories.",
        seconds: 7.3
      },
      {
        text: "A workforce of over one thousand chefs and kitchen apprentices worked daily to feed four thousand imperial residents every single day.",
        mood: "warm",
        imagePrompt: "Vast kitchen hall with whitewashed brick walls, massive wood-burning stone hearths, and rows of heavy butcher prep tables. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-topkapi-palace-kitchen/2.png",
        audio: "audio/ottoman-topkapi-palace-kitchen/2.wav",
        voicedText: "A workforce of over one thousand chefs and kitchen apprentices worked daily to feed four thousand imperial residents every single day.",
        seconds: 7.4
      },
      {
        text: "Kitchens were strictly divided by guild: one building made only baklava, another prepared spit-roasted lamb, and another specialized in fruit sherbets.",
        mood: "warm",
        imagePrompt: "Large round copper pastry trays piled with golden flaky baklava layers soaked in honey syrup and ground green pistachios. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-topkapi-palace-kitchen/3.png",
        audio: "audio/ottoman-topkapi-palace-kitchen/3.wav",
        voicedText: "Kitchens were strictly divided by guild: one building made only baklava, another prepared spit-roasted lamb, and another specialized in fruit sherbets.",
        seconds: 7.6
      },
      {
        text: "The Sultan's private food was prepared under extreme security: official food tasters sampled every dish to test for assassination poisons.",
        mood: "cool",
        imagePrompt: "Imperial dining table with fine Chinese celadon green porcelain bowls, gold covered dishes, and jeweled serving spoons. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-topkapi-palace-kitchen/4.png",
        audio: "audio/ottoman-topkapi-palace-kitchen/4.wav",
        voicedText: "The Sultan's private food was prepared under extreme security: official food tasters sampled every dish to test for assassination poisons.",
        seconds: 7.5
      },
      {
        text: "They believed celadon porcelain bowls possessed magical properties that changed color or shattered if touched by lethal poisons.",
        mood: "cool",
        imagePrompt: "Close-up of a jade-green celadon porcelain imperial bowl with carved floral motifs resting on a gold brocade runner. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-topkapi-palace-kitchen/5.png",
        audio: "audio/ottoman-topkapi-palace-kitchen/5.wav",
        voicedText: "They believed celadon porcelain bowls possessed magical properties that changed color or shattered if touched by lethal poisons.",
        seconds: 7.2
      },
      {
        text: "Would you have trusted an imperial food taster with your life? Let us know below and subscribe for more stories!",
        mood: "day",
        imagePrompt: "Sunlight illuminating the lush Third Courtyard of Topkapi Palace with cypress trees and marble porticos under clear skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-topkapi-palace-kitchen/6.png",
        audio: "audio/ottoman-topkapi-palace-kitchen/6.wav",
        voicedText: "Would you have trusted an imperial food taster with your life? Let us know below and subscribe for more stories!",
        seconds: 6.8
      }
    ]
  },
  // 6. Ottoman Silent Language Court
  {
    slug: "ottoman-silent-language-court",
    title: "The Mute Guards and Silent Court",
    hook: "Inside the Sultan's private courtyard, speaking aloud was banned.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Inside the innermost Third Courtyard of Topkapi Palace, absolute silence was strictly enforced by imperial decree.",
        mood: "cool",
        imagePrompt: "Third Courtyard of Topkapi Palace with manicured gardens, serene marble colonnades, and bronze fountains under midday light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-silent-language-court/1.png",
        audio: "audio/ottoman-silent-language-court/1.wav",
        voicedText: "Inside the innermost Third Courtyard of Topkapi Palace, absolute silence was strictly enforced by imperial decree.",
        seconds: 7.2
      },
      {
        text: "Speaking above a whisper was considered grave disrespect to the Sultan, and footsteps were muffled by thick wool carpets.",
        mood: "warm",
        imagePrompt: "Grand imperial corridor paved with exquisite Iznik blue ceramic tiles and carpeted with long crimson silk runners. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-silent-language-court/2.png",
        audio: "audio/ottoman-silent-language-court/2.wav",
        voicedText: "Speaking above a whisper was considered grave disrespect to the Sultan, and footsteps were muffled by thick wool carpets.",
        seconds: 7.3
      },
      {
        text: "To protect state secrets, the Sultan's personal bodyguards and attendants were deaf and mute men known as 'dilsizler'.",
        mood: "dark",
        imagePrompt: "Ornate carved wooden palace doorway with mother-of-pearl inlay and heavy brass hanging knocker in quiet shadow. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-silent-language-court/3.png",
        audio: "audio/ottoman-silent-language-court/3.wav",
        voicedText: "To protect state secrets, the Sultan's personal bodyguards and attendants were deaf and mute men known as 'dilsizler'.",
        seconds: 7.4
      },
      {
        text: "Because they could neither overhear sensitive war discussions nor reveal secrets under torture, they were trusted completely.",
        mood: "cool",
        imagePrompt: "Imperial council chamber table with scroll maps, wax seals, and jeweled inkpots beneath gilded ceiling domes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-silent-language-court/4.png",
        audio: "audio/ottoman-silent-language-court/4.wav",
        voicedText: "Because they could neither overhear sensitive war discussions nor reveal secrets under torture, they were trusted completely.",
        seconds: 7.3
      },
      {
        text: "The court developed a sophisticated sign language called 'Iksarat', allowing ministers to debate military treaties entirely without voice.",
        mood: "warm",
        imagePrompt: "Pair of hands wearing gold imperial signet rings resting on an open velvet-bound ledger book in soft candlelight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-silent-language-court/5.png",
        audio: "audio/ottoman-silent-language-court/5.wav",
        voicedText: "The court developed a sophisticated sign language called 'Iksarat', allowing ministers to debate military treaties entirely without voice.",
        seconds: 7.6
      },
      {
        text: "Could you have spent your working life communicating entirely in absolute silence? Tell us below and subscribe!",
        mood: "day",
        imagePrompt: "Peaceful palace marble terrace overlooking the sparkling blue waters of the Golden Horn and distant minarets. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ottoman-silent-language-court/6.png",
        audio: "audio/ottoman-silent-language-court/6.wav",
        voicedText: "Could you have spent your working life communicating entirely in absolute silence? Tell us below and subscribe!",
        seconds: 7.0
      }
    ]
  }
];

console.log(`Writing additional Ottoman scripts...`);
for (const s of OTTOMAN_MORE) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

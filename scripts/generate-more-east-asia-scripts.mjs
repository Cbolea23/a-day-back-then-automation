import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const EAST_ASIA_MORE = [
  // 5. Edo Firefighter Heroes
  {
    slug: "edo-firefighter-heroes",
    title: "Edo Japan's Daredevil Firefighters",
    hook: "Firefighter brigades competed to climb burning roofs waving giant paper standards.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Because the metropolis of Edo was built almost entirely of cedar timber and paper screens, fires spread like wildfire.",
        mood: "warm",
        imagePrompt: "Tightly packed Edo period city street with wooden two-story merchant houses and tiled watchtowers under dramatic sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/edo-firefighter-heroes/1.png",
        audio: "audio/edo-firefighter-heroes/1.wav",
        voicedText: "Because the metropolis of Edo was built almost entirely of cedar timber and paper screens, fires spread like wildfire.",
        seconds: 7.3
      },
      {
        text: "Conflagrations were nicknamed 'the flowers of Edo', striking so often that the Shogun established forty-eight neighborhood firefighter brigades.",
        mood: "warm",
        imagePrompt: "Tall wooden fire watchtower in Edo with brass alarm bell and hemp pull-rope overlooking sprawling tile rooftops. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/edo-firefighter-heroes/2.png",
        audio: "audio/edo-firefighter-heroes/2.wav",
        voicedText: "Conflagrations were nicknamed 'the flowers of Edo', striking so often that the Shogun established forty-eight neighborhood firefighter brigades.",
        seconds: 7.5
      },
      {
        text: "Firefighters were working-class heroes called 'hikeshi', famous for their full-body dragon tattoos and heavy quilted indigo coats soaked in water.",
        mood: "cool",
        imagePrompt: "Heavy indigo-dyed cotton firefighter coat sashiko-stitched with geometric patterns and water crest symbols on a wooden hanger. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/edo-firefighter-heroes/3.png",
        audio: "audio/edo-firefighter-heroes/3.wav",
        voicedText: "Firefighters were working-class heroes called 'hikeshi', famous for their full-body dragon tattoos and heavy quilted indigo coats soaked in water.",
        seconds: 7.7
      },
      {
        text: "Their job wasn't putting out flames with water, but tearing down neighboring houses with long iron-hooked poles called 'tobiguchi' to create firebreaks.",
        mood: "dark",
        imagePrompt: "Iron-hooked wooden firefighter pry poles, timber saws, and wooden water buckets resting beside charred building beams. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/edo-firefighter-heroes/4.png",
        audio: "audio/edo-firefighter-heroes/4.wav",
        voicedText: "Their job wasn't putting out flames with water, but tearing down neighboring houses with long iron-hooked poles called 'tobiguchi' to create firebreaks.",
        seconds: 7.8
      },
      {
        text: "Daredevils scaled collapsing burning roofs to plant their brigade's 'matoi' standard—a heavy paper and wood banner—claiming honor for their squad.",
        mood: "dramatic",
        imagePrompt: "Traditional Japanese matoi firefighter standard with lacquered geometric wooden emblems and white paper streamers standing tall on a roof. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/edo-firefighter-heroes/5.png",
        audio: "audio/edo-firefighter-heroes/5.wav",
        voicedText: "Daredevils scaled collapsing burning roofs to plant their brigade's 'matoi' standard—a heavy paper and wood banner—claiming honor for their squad.",
        seconds: 7.9
      },
      {
        text: "Could you have balanced on a burning roof waving a thirty-pound wooden banner? Tell us below and subscribe!",
        mood: "day",
        imagePrompt: "Quiet morning after rain in traditional Edo with wet slate roof tiles glistening in peaceful early morning sun. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/edo-firefighter-heroes/6.png",
        audio: "audio/edo-firefighter-heroes/6.wav",
        voicedText: "Could you have balanced on a burning roof waving a thirty-pound wooden banner? Tell us below and subscribe!",
        seconds: 7.1
      }
    ]
  },
  // 6. Mongol Yam Postal System
  {
    slug: "mongol-yam-postal-system",
    title: "Genghis Khan's 5,000-Mile Pony Express",
    hook: "Riders carrying golden passports traveled 200 miles a day switching fresh horses.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "To govern an empire that spanned from the Pacific Ocean to Eastern Europe, Genghis Khan created the 'Örtöö' or 'Yam' postal messenger network.",
        mood: "warm",
        imagePrompt: "Expansive Mongolian steppe horizon with a solitary wooden relay outpost station beside horse corrals under dramatic skies. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-yam-postal-system/1.png",
        audio: "audio/mongol-yam-postal-system/1.wav",
        voicedText: "To govern an empire that spanned from the Pacific Ocean to Eastern Europe, Genghis Khan created the 'Örtöö' or 'Yam' postal messenger network.",
        seconds: 7.6
      },
      {
        text: "Stations were positioned every twenty-five miles along empire highways, stocked with fresh steppe horses, food rations, and armed guards.",
        mood: "warm",
        imagePrompt: "Wooden horse stables on the open steppe with tethered sturdy Mongol ponies feeding on golden hay in mountain sunshine. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-yam-postal-system/2.png",
        audio: "audio/mongol-yam-postal-system/2.wav",
        voicedText: "Stations were positioned every twenty-five miles along empire highways, stocked with fresh steppe horses, food rations, and armed guards.",
        seconds: 7.4
      },
      {
        text: "Messengers wore bells on their saddles so station staff heard them approaching from miles away and readied a fresh galloping horse.",
        mood: "cool",
        imagePrompt: "Close-up of brass saddle bells attached to carved leather harness straps resting on a wooden railing. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-yam-postal-system/3.png",
        audio: "audio/mongol-yam-postal-system/3.wav",
        voicedText: "Messengers wore bells on their saddles so station staff heard them approaching from miles away and readied a fresh galloping horse.",
        seconds: 7.4
      },
      {
        text: "They wore tight leather bindings around their torsos and heads to withstand the physical trauma of riding two hundred miles in a single day.",
        mood: "cool",
        imagePrompt: "Leather messenger satchel, felt riding boots, and water skin flask resting on a wooden chest inside a yurt. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-yam-postal-system/4.png",
        audio: "audio/mongol-yam-postal-system/4.wav",
        voicedText: "They wore tight leather bindings around their torsos and heads to withstand the physical trauma of riding two hundred miles in a single day.",
        seconds: 7.6
      },
      {
        text: "Riders wore a golden 'paiza' tablet inscribed with the Khan's royal seal, granting them authority to commandeer fresh horses from anyone on penalty of death.",
        mood: "warm",
        imagePrompt: "Gilded bronze Mongol paiza passport tablet engraved with Mongolian script and falcon crest hanging from a silk cord. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-yam-postal-system/5.png",
        audio: "audio/mongol-yam-postal-system/5.wav",
        voicedText: "Riders wore a golden 'paiza' tablet inscribed with the Khan's royal seal, granting them authority to commandeer fresh horses from anyone on penalty of death.",
        seconds: 7.8
      },
      {
        text: "A message traveled across five thousand miles in under two weeks! Could you ride two hundred miles on horseback in a single day?",
        mood: "day",
        imagePrompt: "Stunning sunset casting golden amber rays across the vast grasslands of Central Asia under a tranquil sky. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/mongol-yam-postal-system/6.png",
        audio: "audio/mongol-yam-postal-system/6.wav",
        voicedText: "A message traveled across five thousand miles in under two weeks! Could you ride two hundred miles on horseback in a single day?",
        seconds: 7.2
      }
    ]
  },
  // 7. Samurai Armor Lacquer Secret
  {
    slug: "samurai-armor-lacquer-secret",
    title: "Why Samurai Armor Was Made of Silk and Lacquer",
    hook: "Thousands of tiny iron plates laced together with water-resistant silk cords.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Unlike the solid, rigid steel plate armor worn by European knights, traditional Japanese samurai armor was completely flexible.",
        mood: "warm",
        imagePrompt: "Complete antique suit of Japanese samurai o-yoroi armor displayed on an ebony wood stand in a private castle alcove. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-armor-lacquer-secret/1.png",
        audio: "audio/samurai-armor-lacquer-secret/1.wav",
        voicedText: "Unlike the solid, rigid steel plate armor worn by European knights, traditional Japanese samurai armor was completely flexible.",
        seconds: 7.5
      },
      {
        text: "Called 'kozane', the armor was composed of thousands of tiny individual scales made of hardened iron and boiled rawhide leather.",
        mood: "cool",
        imagePrompt: "Close-up of small individual iron armor scales with punched lacing holes arranged on a craftsman's wooden workbench. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-armor-lacquer-secret/2.png",
        audio: "audio/samurai-armor-lacquer-secret/2.wav",
        voicedText: "Called 'kozane', the armor was composed of thousands of tiny individual scales made of hardened iron and boiled rawhide leather.",
        seconds: 7.4
      },
      {
        text: "Because Japan's humid climate caused rapid rust, every single iron scale was coated in dozens of layers of natural tree urushi lacquer.",
        mood: "warm",
        imagePrompt: "Traditional ceramic pottery jar of dark black urushi tree sap lacquer with wooden applicator sticks and fine horsehair brushes. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-armor-lacquer-secret/3.png",
        audio: "audio/samurai-armor-lacquer-secret/3.wav",
        voicedText: "Because Japan's humid climate caused rapid rust, every single iron scale was coated in dozens of layers of natural tree urushi lacquer.",
        seconds: 7.6
      },
      {
        text: "Once cured, urushi lacquer was impervious to rainwater, ocean saltwater, and biological rot, creating a glossy, armor-shielding glaze.",
        mood: "cool",
        imagePrompt: "Gleaming glossy black and crimson lacquered armor shoulder guard plate with gold clan mon family crest medallion. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-armor-lacquer-secret/4.png",
        audio: "audio/samurai-armor-lacquer-secret/4.wav",
        voicedText: "Once cured, urushi lacquer was impervious to rainwater, ocean saltwater, and biological rot, creating a glossy, armor-shielding glaze.",
        seconds: 7.6
      },
      {
        text: "The plates were stitched together with vibrant silk cords called 'odoshi', engineered to absorb sword impacts while allowing full sword swings.",
        mood: "warm",
        imagePrompt: "Intricate dyed silk braided lacing in patterns of orange, white, and navy binding overlapping lacquered armor scales. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-armor-lacquer-secret/5.png",
        audio: "audio/samurai-armor-lacquer-secret/5.wav",
        voicedText: "The plates were stitched together with vibrant silk cords called 'odoshi', engineered to absorb sword impacts while allowing full sword swings.",
        seconds: 7.7
      },
      {
        text: "It was wearable fine art that could stop a razor-sharp katana blade! Would you choose flexible samurai armor or steel knight plate?",
        mood: "day",
        imagePrompt: "Sunlight illuminating a classic Japanese castle courtyard with blossoming maple trees and peaceful stone masonry. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/samurai-armor-lacquer-secret/6.png",
        audio: "audio/samurai-armor-lacquer-secret/6.wav",
        voicedText: "It was wearable fine art that could stop a razor-sharp katana blade! Would you choose flexible samurai armor or steel knight plate?",
        seconds: 7.2
      }
    ]
  },
  // 8. Ninja Night Signals
  {
    slug: "ninja-night-signals",
    title: "Secret Shinobi Signals and Smoke",
    hook: "Shinobi communicated across miles using wolf dung smoke and secret codes.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "Behind enemy lines during midnight infiltration operations, shinobi agents needed communication methods that made zero sound.",
        mood: "dark",
        imagePrompt: "Misty mountain ridge in Iga province at twilight with silhouette of pine trees overlooking a shadowy valley below. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-night-signals/1.png",
        audio: "audio/ninja-night-signals/1.wav",
        voicedText: "Behind enemy lines during midnight infiltration operations, shinobi agents needed communication methods that made zero sound.",
        seconds: 7.5
      },
      {
        text: "For daytime long-range signaling, they burned dried wolf dung: known as 'rōen', its unique smoke rose completely vertical without dispersing in wind.",
        mood: "cool",
        imagePrompt: "Single straight, dense plume of dark smoke rising vertically into a calm morning sky from an iron brazier on a mountain peak. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-night-signals/2.png",
        audio: "audio/ninja-night-signals/2.wav",
        voicedText: "For daytime long-range signaling, they burned dried wolf dung: known as 'rōen', its unique smoke rose completely vertical without dispersing in wind.",
        seconds: 7.6
      },
      {
        text: "At night, they sent messages with 'goshiki-mai'—five-colored dyed rice: scattering grains along forest trails to leave encoded rendezvous instructions.",
        mood: "dark",
        imagePrompt: "Close-up of mossy stone forest trail with scattered grains of rice dyed in red, yellow, blue, black, and purple. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-night-signals/3.png",
        audio: "audio/ninja-night-signals/3.wav",
        voicedText: "At night, they sent messages with 'goshiki-mai'—five-colored dyed rice: scattering grains along forest trails to leave encoded rendezvous instructions.",
        seconds: 7.7
      },
      {
        text: "Because birds and animals ignored dyed rice, enemy castle patrols walked right past the secret codes without noticing a thing.",
        mood: "cool",
        imagePrompt: "Ancient mossy stone lantern along a forest path leading to an old wooden Shinto shrine gate under pale moonlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-night-signals/4.png",
        audio: "audio/ninja-night-signals/4.wav",
        voicedText: "Because birds and animals ignored dyed rice, enemy castle patrols walked right past the secret codes without noticing a thing.",
        seconds: 7.3
      },
      {
        text: "They carried handheld directional fire lanterns called 'gandō', using internal gimbals to shine beams forward without casting light onto the bearer.",
        mood: "dark",
        imagePrompt: "Antique Japanese copper gando bullseye lantern with internal gimbal rings and candle holder on a tatami floor. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-night-signals/5.png",
        audio: "audio/ninja-night-signals/5.wav",
        voicedText: "They carried handheld directional fire lanterns called 'gandō', using internal gimbals to shine beams forward without casting light onto the bearer.",
        seconds: 7.8
      },
      {
        text: "Shinobi spycraft was centuries ahead of its time! Would you have cracked their secret colored rice code?",
        mood: "day",
        imagePrompt: "Serene mountain temple overlook in Japan with ancient stone steps surrounded by lush cedar and pine trees in morning light. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/ninja-night-signals/6.png",
        audio: "audio/ninja-night-signals/6.wav",
        voicedText: "Shinobi spycraft was centuries ahead of its time! Would you have cracked their secret colored rice code?",
        seconds: 7.0
      }
    ]
  }
];

console.log(`Writing remaining 4 East Asia scripts...`);
for (const s of EAST_ASIA_MORE) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

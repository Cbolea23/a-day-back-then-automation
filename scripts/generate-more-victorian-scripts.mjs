import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "scripts-out");
fs.mkdirSync(outDir, {recursive: true});

const MORE_VICTORIAN = [
  // 4. Victorian Body Snatchers
  {
    slug: "victorian-body-snatchers",
    title: "Digging Up Fresh Graves for Doctors",
    hook: "Medical students paid grave robbers top dollar for fresh corpses.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In early 19th-century London, medical anatomy schools faced a severe crisis: by law, only executed murderers could be dissected.",
        mood: "cool",
        imagePrompt: "Victorian medical amphitheater lecture hall with tiered wooden seating looking down on an empty marble dissection table. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-body-snatchers/1.png",
        audio: "audio/victorian-body-snatchers/1.wav",
        voicedText: "In early 19th-century London, medical anatomy schools faced a severe crisis: by law, only executed murderers could be dissected.",
        seconds: 7.3
      },
      {
        text: "With only dozens of executions a year and hundreds of eager surgery students, doctors paid fortunes to shadowy 'resurrection men'.",
        mood: "dark",
        imagePrompt: "Dimly lit cobblestone alleyway in Whitechapel with rain-slicked stones, gas streetlamp glow, and shadowy brick archways. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-body-snatchers/2.png",
        audio: "audio/victorian-body-snatchers/2.wav",
        voicedText: "With only dozens of executions a year and hundreds of eager surgery students, doctors paid fortunes to shadowy 'resurrection men'.",
        seconds: 7.5
      },
      {
        text: "Armed with wooden spades to avoid noisy clinking on stones, grave robbers slipped into churchyards hours after a fresh burial.",
        mood: "dark",
        imagePrompt: "Gothic churchyard graveyard at midnight with crooked stone headstones, weeping willows, and freshly mounded damp earth. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-body-snatchers/3.png",
        audio: "audio/victorian-body-snatchers/3.wav",
        voicedText: "Armed with wooden spades to avoid noisy clinking on stones, grave robbers slipped into churchyards hours after a fresh burial.",
        seconds: 7.4
      },
      {
        text: "They dug a narrow hole down to the coffin head, snapped the lid with an iron crowbar, and hauled the body up with a rope loop in fifteen minutes.",
        mood: "dark",
        imagePrompt: "Iron crowbar, hemp rope coil, and lantern resting beside open freshly dug churchyard soil under moonlight. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-body-snatchers/4.png",
        audio: "audio/victorian-body-snatchers/4.wav",
        voicedText: "They dug a narrow hole down to the coffin head, snapped the lid with an iron crowbar, and hauled the body up with a rope loop in fifteen minutes.",
        seconds: 7.7
      },
      {
        text: "Terrified families installed heavy cast-iron 'mortsafes'—massive iron cages bolted over graves—and built stone watchtowers.",
        mood: "cool",
        imagePrompt: "Historic churchyard cemetery featuring heavy decorative cast-iron mortsafe cages locked over stone tomb slabs. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-body-snatchers/5.png",
        audio: "audio/victorian-body-snatchers/5.wav",
        voicedText: "Terrified families installed heavy cast-iron 'mortsafes'—massive iron cages bolted over graves—and built stone watchtowers.",
        seconds: 7.4
      },
      {
        text: "The grim trade only ended when the Anatomy Act of 1832 legalized unclaimed hospital body donations. Did you know about mortsafes?",
        mood: "day",
        imagePrompt: "Sunlit Victorian London street with stately brick townhouses, iron railings, and horse carriages in the morning mist. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-body-snatchers/6.png",
        audio: "audio/victorian-body-snatchers/6.wav",
        voicedText: "The grim trade only ended when the Anatomy Act of 1832 legalized unclaimed hospital body donations. Did you know about mortsafes?",
        seconds: 7.0
      }
    ]
  },
  // 5. Victorian Post-Mortem Photos
  {
    slug: "victorian-post-mortem-photos",
    title: "Why Victorians Posed with the Dead",
    hook: "The only photo a family could afford was taken after death.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In the 1850s, early daguerreotype photography was a miraculous new invention, but it was extraordinarily expensive for everyday citizens.",
        mood: "warm",
        imagePrompt: "Victorian photography studio with an ornate mahogany folding bellows camera on a brass tripod beside velvet backdrops. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-post-mortem-photos/1.png",
        audio: "audio/victorian-post-mortem-photos/1.wav",
        voicedText: "In the 1850s, early daguerreotype photography was a miraculous new invention, but it was extraordinarily expensive for everyday citizens.",
        seconds: 7.3
      },
      {
        text: "With child mortality high, many families could never afford a portrait while their infants or grandparents were alive.",
        mood: "cool",
        imagePrompt: "Cozy Victorian parlor with horsehair armchair, lace doilies, and empty ornate oval brass picture frames on the mantelpiece. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-post-mortem-photos/2.png",
        audio: "audio/victorian-post-mortem-photos/2.wav",
        voicedText: "With child mortality high, many families could never afford a portrait while their infants or grandparents were alive.",
        seconds: 7.2
      },
      {
        text: "When tragedy struck, grieving parents paid photographers for 'post-mortem photography': a final permanent remembrance keepsake.",
        mood: "warm",
        imagePrompt: "Antique velvet-lined leather daguerreotype case resting open on a mahogany desk displaying a polished silver plate portrait. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-post-mortem-photos/3.png",
        audio: "audio/victorian-post-mortem-photos/3.wav",
        voicedText: "When tragedy struck, grieving parents paid photographers for 'post-mortem photography': a final permanent remembrance keepsake.",
        seconds: 7.5
      },
      {
        text: "The deceased were lovingly washed, dressed in their finest Sunday clothes, and posed as if peacefully asleep in a plush armchair.",
        mood: "warm",
        imagePrompt: "Softly lit Victorian parlor alcove with blooming white lilies in porcelain vases beside an empty velvet settee. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-post-mortem-photos/4.png",
        audio: "audio/victorian-post-mortem-photos/4.wav",
        voicedText: "The deceased were lovingly washed, dressed in their finest Sunday clothes, and posed as if peacefully asleep in a plush armchair.",
        seconds: 7.4
      },
      {
        text: "Special metal cast stands supported sitting postures, and artists hand-painted pink watercolor tint onto pale cheeks on the developed glass plates.",
        mood: "warm",
        imagePrompt: "Artist's palette with fine squirrel-hair brushes, watercolor pigment dishes, and glass ambrotype plates on a worktable. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-post-mortem-photos/5.png",
        audio: "audio/victorian-post-mortem-photos/5.wav",
        voicedText: "Special metal cast stands supported sitting postures, and artists hand-painted pink watercolor tint onto pale cheeks on the developed glass plates.",
        seconds: 7.7
      },
      {
        text: "Though eerie to modern eyes, it was an act of profound love. Would you have kept a memento mori photograph?",
        mood: "day",
        imagePrompt: "Sunlit parlor window with velvet curtains open to a bright morning sky with flowering potted violets on the sill. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-post-mortem-photos/6.png",
        audio: "audio/victorian-post-mortem-photos/6.wav",
        voicedText: "Though eerie to modern eyes, it was an act of profound love. Would you have kept a memento mori photograph?",
        seconds: 6.9
      }
    ]
  },
  // 6. Victorian Penny Sit Up Coffin Beds
  {
    slug: "victorian-penny-sit-up-coffin-beds",
    title: "Two-Penny Hangover and Coffin Beds",
    hook: "Homeless Londoners paid two pennies to sleep leaning against a rope.",
    channelName: "A Day Back Then",
    scenes: [
      {
        text: "In Victorian London's East End, thousands of destitute laborers could never afford a sixpence bed in a boarding house.",
        mood: "cool",
        imagePrompt: "Grim foggy brick alleyway in Victorian London with smoking brick chimneys and gas streetlights casting long shadows. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-sit-up-coffin-beds/1.png",
        audio: "audio/victorian-penny-sit-up-coffin-beds/1.wav",
        voicedText: "In Victorian London's East End, thousands of destitute laborers could never afford a sixpence bed in a boarding house.",
        seconds: 7.2
      },
      {
        text: "Instead, commercial doss houses offered brutal tiered sleeping options starting at just one single copper penny.",
        mood: "dark",
        imagePrompt: "Grubby wooden ticket booth in a dimly lit Victorian lodging cellar with chalk prices on a slate board. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-sit-up-coffin-beds/2.png",
        audio: "audio/victorian-penny-sit-up-coffin-beds/2.wav",
        voicedText: "Instead, commercial doss houses offered brutal tiered sleeping options starting at just one single copper penny.",
        seconds: 7.1
      },
      {
        text: "For one penny, you got the 'Penny Sit Up': permission to sit on a bare wooden bench inside out of the rain, but you were beaten if you fell asleep.",
        mood: "dark",
        imagePrompt: "Long bare wooden bench against damp peeling brick cellar wall with dim gas jet lamp hissing overhead. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-sit-up-coffin-beds/3.png",
        audio: "audio/victorian-penny-sit-up-coffin-beds/3.wav",
        voicedText: "For one penny, you got the 'Penny Sit Up': permission to sit on a bare wooden bench inside out of the rain, but you were beaten if you fell asleep.",
        seconds: 7.6
      },
      {
        text: "For two pennies, you got the 'Two-Penny Hangover': sitting on a bench with a thick clothesline rope tied taut across your chest to lean on.",
        mood: "cool",
        imagePrompt: "Heavy hemp clothesline rope strung taut across rows of wooden benches in a crowded boarding shed. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-sit-up-coffin-beds/4.png",
        audio: "audio/victorian-penny-sit-up-coffin-beds/4.wav",
        voicedText: "For two pennies, you got the 'Two-Penny Hangover': sitting on a bench with a thick clothesline rope tied taut across your chest to lean on.",
        seconds: 7.5
      },
      {
        text: "At 6 AM sharp, the landlord cut or untied the rope with a knife, abruptly dropping dozens of exhausted sleepers straight to the floor.",
        mood: "cool",
        imagePrompt: "Coiled rope end on bare timber floorboards with morning light filtering through high grimy cellar grates. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-sit-up-coffin-beds/5.png",
        audio: "audio/victorian-penny-sit-up-coffin-beds/5.wav",
        voicedText: "At 6 AM sharp, the landlord cut or untied the rope with a knife, abruptly dropping dozens of exhausted sleepers straight to the floor.",
        seconds: 7.4
      },
      {
        text: "For four pence, Salvation Army shelters offered 'coffin beds': wooden boxes with tarpaulin covers. Could you have survived a night there?",
        mood: "day",
        imagePrompt: "Morning sun shining over London brick rooftops and factory chimneys with clean blue sky breaking through. 2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos",
        image: "images/victorian-penny-sit-up-coffin-beds/6.png",
        audio: "audio/victorian-penny-sit-up-coffin-beds/6.wav",
        voicedText: "For four pence, Salvation Army shelters offered 'coffin beds': wooden boxes with tarpaulin covers. Could you have survived a night there?",
        seconds: 7.2
      }
    ]
  }
];

console.log(`Writing additional Victorian scripts...`);
for (const s of MORE_VICTORIAN) {
  const filePath = path.join(outDir, `${s.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(s, null, 2));
  console.log(`✓ Added scripts-out/${s.slug}.json`);
}

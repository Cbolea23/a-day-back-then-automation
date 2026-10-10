# Muse AI — Image Asset Generation Guide

Welcome, Muse AI! This repository contains the automated pipeline for the **"A Day Back Then"** history YouTube Shorts / Reels channel.

Your primary mission is to **generate the background illustrations** for our pending episodes and save them in their respective topic folders.

---

## 🎨 Art Style Requirements

Every illustration must follow our channel's signature aesthetic:

> **Style Prompt:**  
> `2D flat cartoon illustration, thick dark outlines, warm muted palette, hand-painted textures, vertical 9:16, no people in the foreground, no text, no logos`

### Key Constraints:
- **Aspect Ratio:** Vertical `9:16` (1080×1920 recommended).
- **No Foreground Characters:** The animated stick-figure narrator is layered on top by our Remotion rendering engine. **Never include people or characters in the center foreground**, or they will collide with our host!
- **No Text or Watermarks:** Captions and channel titles are dynamically rendered by code.

---

## 📁 Where to Find Prompts & Where to Save Output

For every topic slug `<slug>`:

1. **Read Prompts**:  
   Look at `scripts-out/<slug>.prompts.txt`  
   Each line corresponds to one scene, numbered:
   ```
   1. [Prompt for scene 1] 2D flat cartoon illustration, thick dark outlines...
   2. [Prompt for scene 2] 2D flat cartoon illustration, thick dark outlines...
   ...
   ```

2. **Save Images**:  
   Save each generated image inside the pre-created directory:
   ```
   public/images/<slug>/1.png (or .jpg)
   public/images/<slug>/2.png (or .jpg)
   public/images/<slug>/3.png (or .jpg)
   ...
   ```

---

## 📋 Full List of 35 Pending Topics

The following topic directories and prompt files are ready for you right now:

### Medieval & Ancient Europe
1. `castle-toilets`
2. `medieval-bath-myths`
3. `medieval-village-vs-city`
4. `roman-morning`
5. `barber-surgeon-job`
6. `medieval-fast-days`
7. `medieval-wages-and-prices`
8. `medieval-miller-job`
9. `dark-ages-myths`

### Viking Age
10. `viking-farmer-day`
11. `viking-ocean-voyage`
12. `viking-myths`
13. `viking-food-and-drink`

### Feudal Japan & Imperial Asia
14. `samurai-day`
15. `edo-merchant-vs-samurai`
16. `ninja-myths`
17. `han-china-farmer-day`
18. `silk-road-merchant`
19. `mongol-steppe-day`

### Mesoamerican & Andean Civilizations
20. `aztec-market-day`
21. `maya-scribe-job`
22. `inca-runner-job`
23. `chinampa-farmer-day`

### Tudor, Age of Sail & Piracy
24. `tudor-kitchen-boy`
25. `pirate-ship-day`
26. `pirate-myths`

### Victorian & Industrial Era
27. `victorian-chimney-sweep-job`
28. `victorian-factory-day`

### Renaissance, Ottoman & World History
29. `renaissance-apprentice-day`
30. `ottoman-coffeehouse`
31. `gold-rush-miner-day`
32. `wwii-ration-day`
33. `mesopotamia-scribe-school`
34. `byzantine-chariot-fan`
35. `plague-quarantine-city`

---

## 🚀 Workflow Summary
1. Pick one or more slugs from the list above.
2. Read the prompt lines in `scripts-out/<slug>.prompts.txt`.
3. Generate the 9:16 images and save them as `public/images/<slug>/1.png`, `2.png`, etc.
4. Commit and push your changes to GitHub.
5. Antigravity will pull the images, synthesize matching voiceover, and compile the final videos!

---

## 🎬 Longform Episode Asset Guide (16:9 Landscape)

We are now expanding into **Full-Length Longform Episodes (8–12 minutes)**!

### 🎨 Longform Requirements:
- **Aspect Ratio:** Horizontal **`16:9`** (`1920×1080` or `2048×1152`).
- **Style:** Consistent with the channel's 2D flat cartoon illustration, thick dark outlines, warm earthy textures.
- **Narrator Placement:** In longform, the narrator is placed on the side (left/right bottom third). Keep central scenes open and avoid people in the lower thirds.
- **No Text / No Watermarks.**

### 📁 Where to Find Longform Prompts & Save Images:
1. **Prompts:** Located in `long-out/<slug>.prompts.txt`
2. **Save Images:** Save into `public/long/<slug>/1.png`, `2.png`, `3.png`, ...

### 📋 Active Longform Topics Ready for Generation:
1. `roman-day-hour-by-hour` (42 scenes) — *A Day in Ancient Rome, Hour by Hour*
2. `roman-survive-a-week` (37 scenes) — *Would You Survive a Week in Ancient Rome?*
3. `gladiator-real-life` (37 scenes) — *The Real Life of a Gladiator*
4. `roman-legionary-career` (37 scenes) — *A Career in the Roman Army*
5. `roman-myths-debunked` (32 scenes) — *Roman Myths, Debunked*


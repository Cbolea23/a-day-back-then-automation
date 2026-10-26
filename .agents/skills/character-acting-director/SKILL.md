---
name: character-acting-director
description: >-
  Direct character emotional states, gestural timing, 5 outfit themes, and dual-character
  staging in Remotion scenes. Coordinates Narrator and Cameo NPC body language to match
  script subtext, folklore horror beats, and comedic timing.
---

# Character Acting Director

This skill coordinates character visual acting, emotional expressions, outfit styling, and spatial blocking in Remotion compositions.

---

## 1. Narrator Outfit Themes & Gender Synchronization

### Voice-Gender Synchronization (Mandatory Rule)
- When a **female voiceover** (e.g., `fil-PH-BlessicaNeural`) is selected, the on-screen Narrator **MUST be female** (`babaylan`, `filipina`, `nun`, or `witch`). Never pair a female voice with a male/unisex avatar.
- When a **male voiceover** (e.g., `fil-PH-AngeloNeural`, `en-US-ChristopherNeural`) is selected, use masculine themes (`albularyo`, `katipunero`, `barong`, `adventurer`, `scholar`, `toga`).

### Core Outfit Themes
- `babaylan`: Traditional Filipina priestess/storyteller. Long cascading dark hair past the shoulders, delicate curved eyelashes, golden sampaguita hair blossom, and vibrant Baro't Saya / Katutubo bodice with alampay shoulder wrap. Ideal for Philippine dark folklore and legends.
- `albularyo`: Traditional Filipino mystic healer. Crimson putong headband, woven inabel shoulder sash, and triangular anting-anting talisman.
- `katipunero`: Woven buri salakot dome hat with golden sun crest, revolutionary attire.
- `barong`: Formal embroidered barong tagalog with clean styled haircut.
- `casual`: Modern signature jacket and jeans (default).
- `toga`: Roman patrician draped garment with gold laurel for classical antiquity.
- `scholar`: Renaissance velvet doublet, ruffled collar, and reading spectacles.
- `adventurer`: Weathered explorer trenchcoat, brass compass, and utility boots.
- `shadow`: Hooded dark folklore cloak with obsidian mantle for myth, eerie legends, and horror.

---

## 2. Staging & Spatial Geometry

### Vertical Shorts (1080x1920)
- **Solo Mode:** Narrator centered in lower third (`bottom: -40px`, `scale: 1.15`).
- **Cameo / Two-Character Mode:**
  - Narrator shifts right (`transform: translateX(120px)`, `scale: 0.95`).
  - Cameo NPC pops in from bottom-left corner with comic speech bubble.

### Horizontal Longform (1920x1080)
- **Narrator Blocking:** Lower right quadrant (`anchorX: 0.88`, `height: 600px`).
- **Cameo NPC Blocking:** Opposite corner (`position: 'left-corner'`, `height: 410px`).
- **Gaze Tracking:** When an NPC speaks, the Narrator turns gaze towards NPC (`focus={{x: 0.25, y: 0.55}}`).

---

## 3. Emotional States & Gestural Vocabulary

| Narrative Moment | Narrator Emotion | Narrator Gesture | Narrator Outfit | Cameo NPC Reaction |
|---|---|---|---|---|
| **Eerie Folklore / Cryptid** | `nervous` / `shock` | `point` (at darkness) | `shadow` | `terrified` |
| **Absurd Historical Rule** | `smug` | `shrug` / `explain` | `toga` / `scholar` | `furious` with sweat drop |
| **Brutal Combat / Threat** | `serious` | `point` (direct at viewer)| `adventurer` | `crying` / `terrified` |
| **Bizarre Discovery / Myth** | `calm` -> `shock` | `think` -> `point` | `scholar` | `shock` ("Wait, what?!") |

---

## 4. Lip Sync & Mouth Locking Rule
- **CRITICAL:** A character who is listening must NEVER display open mouth shapes, even during expressive head nods. The lipsync phoneme plan is passed exclusively to the active speaker (`plan={isNpcSpeaking ? plan : undefined}`).

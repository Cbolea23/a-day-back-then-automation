---
name: character-acting-director
description: >-
  Direct character emotional states, gestural timing, gaze focal tracking,
  and dual-character staging in Remotion scenes. Coordinates Narrator and
  Cameo NPC body language to match script subtext and comedic beats.
  Use when configuring character poses, facial expressions, or dialogue choreography.
---

# Character Acting Director

This skill coordinates the visual acting, emotional expressions, and spatial blocking of characters.

## Staging & Spatial Geometry

### Horizontal Longform (1920x1080)
- **Narrator Blocking:** Lower right quadrant (`anchorX: 0.88`, `height: 600px`).
- **Cameo NPC Blocking:** Opposite corner or middle ground (`position: 'left-corner'`, `height: 410px`).
- **Gaze Coordination:** When the NPC speaks, the Narrator's `focus` must look directly towards the NPC's coordinates (`focus={{x: 0.25, y: 0.55}}`) with listening body language (`reaction: "recoil"`, `gesture: "think"`).

### Vertical Shorts (1080x1920)
- **Solo Mode:** Narrator centered in lower third (`bottom: -40px`, `scale: 1.15`).
- **Split / Cameo Mode:**
  - Narrator steps to one side (`scale: 0.95`, `transform: translateX(120px)`).
  - NPC emerges from the opposite margin or corner pop-in.

## Emotional States & Gestural Vocabulary

| Narrative Moment | Narrator Emotion | Narrator Gesture | Cameo NPC Reaction |
|---|---|---|---|
| **Absurd historical rule** | `smug` / `shock` | `explain` (hand out) | `disgusted` / `furious` with sweat drop |
| **Philosophical dilemma** | `calm` | `think` (hand on chin) | `nervous` with trembling bubble |
| **Gory/Brutal combat reality** | `serious` | `point` (direct at viewer) | `crying` / `terrified` |
| **Conspiracy / Myth-busting** | `smug` | `shrug` | `shock` ("Wait, what?!") |

## Lip Sync & Mouth Locking Rule
- **CRITICAL:** A character who is listening must NEVER display open mouth shapes, even during expressive emotions or head nods. The lipsync plan must be passed exclusively to the active speaker (`plan={isNpcSpeaking ? plan : undefined}`).

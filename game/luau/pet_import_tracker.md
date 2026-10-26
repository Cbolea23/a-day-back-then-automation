# Pet Import Tracker — 15 pets × 4 animations

## Before you start
1. **Delete the broken import** from your workspace (the one with crazy dimensions).
2. **In Blender:** open `pet_pack.py`, set `AUTO_EXPORT = True` (line 51), run the script again.
   60 FBX files land in a `pet_exports` folder next to your `.blend`, named like `Cinderpup_Idle.fbx`.
3. **In Studio — models:** import only the **_Idle** FBX for each of the 15 pets (the mesh + rig
   are identical in all 4 files). Each import should show sane ~1-stud dimensions, no warnings.
4. **In Studio — animations:** select a pet's rig → Animation Editor → ••• → **Import from FBX**
   → pick the matching FBX → publish as an Animation asset → paste the asset ID below.
   Name each export `PetName_AnimName` (e.g. `Cinderpup_Idle`) so matching IDs to slots is easy.
5. ⚠️ **Ownership matters:** publish the 60 animations from the same account (or group) that owns
   your game. Roblox only plays animation assets uploaded by the experience's owner — animations
   published under a different account will silently fail in-game. If your game is under a group,
   switch the creator to that group in the export/publish dialog.
6. When all IDs are filled in, paste them into the `PetAnimations.luau` registry slots.

## Fire line — Cinderpup → EmberFox → Infernox
| Pet | Animation | Model ☐ | Published ☐ | Asset ID |
|---|---|---|---|---|
| Cinderpup | Idle | ☐ | ☐ |  |
| Cinderpup | Walk | ☐ | ☐ |  |
| Cinderpup | AttackMelee | ☐ | ☐ |  |
| Cinderpup | AttackRanged | ☐ | ☐ |  |
| EmberFox | Idle | ☐ | ☐ |  |
| EmberFox | Walk | ☐ | ☐ |  |
| EmberFox | AttackMelee | ☐ | ☐ |  |
| EmberFox | AttackRanged | ☐ | ☐ |  |
| Infernox | Idle | ☐ | ☐ |  |
| Infernox | Walk | ☐ | ☐ |  |
| Infernox | AttackMelee | ☐ | ☐ |  |
| Infernox | AttackRanged | ☐ | ☐ |  |

## Water line — Bublet → AquaTurtle → Tidalord
| Pet | Animation | Model ☐ | Published ☐ | Asset ID |
|---|---|---|---|---|
| Bublet | Idle | ☐ | ☐ |  |
| Bublet | Walk | ☐ | ☐ |  |
| Bublet | AttackMelee | ☐ | ☐ |  |
| Bublet | AttackRanged | ☐ | ☐ |  |
| AquaTurtle | Idle | ☐ | ☐ |  |
| AquaTurtle | Walk | ☐ | ☐ |  |
| AquaTurtle | AttackMelee | ☐ | ☐ |  |
| AquaTurtle | AttackRanged | ☐ | ☐ |  |
| Tidalord | Idle | ☐ | ☐ |  |
| Tidalord | Walk | ☐ | ☐ |  |
| Tidalord | AttackMelee | ☐ | ☐ |  |
| Tidalord | AttackRanged | ☐ | ☐ |  |

## Earth line — Pebblit → SproutGolem → Terratitan
| Pet | Animation | Model ☐ | Published ☐ | Asset ID |
|---|---|---|---|---|
| Pebblit | Idle | ☐ | ☐ |  |
| Pebblit | Walk | ☐ | ☐ |  |
| Pebblit | AttackMelee | ☐ | ☐ |  |
| Pebblit | AttackRanged | ☐ | ☐ |  |
| SproutGolem | Idle | ☐ | ☐ |  |
| SproutGolem | Walk | ☐ | ☐ |  |
| SproutGolem | AttackMelee | ☐ | ☐ |  |
| SproutGolem | AttackRanged | ☐ | ☐ |  |
| Terratitan | Idle | ☐ | ☐ |  |
| Terratitan | Walk | ☐ | ☐ |  |
| Terratitan | AttackMelee | ☐ | ☐ |  |
| Terratitan | AttackRanged | ☐ | ☐ |  |

## Electric line — Voltkit → VoltBunny → Stormhare
| Pet | Animation | Model ☐ | Published ☐ | Asset ID |
|---|---|---|---|---|
| Voltkit | Idle | ☐ | ☐ |  |
| Voltkit | Walk | ☐ | ☐ |  |
| Voltkit | AttackMelee | ☐ | ☐ |  |
| Voltkit | AttackRanged | ☐ | ☐ |  |
| VoltBunny | Idle | ☐ | ☐ |  |
| VoltBunny | Walk | ☐ | ☐ |  |
| VoltBunny | AttackMelee | ☐ | ☐ |  |
| VoltBunny | AttackRanged | ☐ | ☐ |  |
| Stormhare | Idle | ☐ | ☐ |  |
| Stormhare | Walk | ☐ | ☐ |  |
| Stormhare | AttackMelee | ☐ | ☐ |  |
| Stormhare | AttackRanged | ☐ | ☐ |  |

## Shadow line — Duskflit → ShadowBat → Nightwing
| Pet | Animation | Model ☐ | Published ☐ | Asset ID |
|---|---|---|---|---|
| Duskflit | Idle | ☐ | ☐ |  |
| Duskflit | Walk | ☐ | ☐ |  |
| Duskflit | AttackMelee | ☐ | ☐ |  |
| Duskflit | AttackRanged | ☐ | ☐ |  |
| ShadowBat | Idle | ☐ | ☐ |  |
| ShadowBat | Walk | ☐ | ☐ |  |
| ShadowBat | AttackMelee | ☐ | ☐ |  |
| ShadowBat | AttackRanged | ☐ | ☐ |  |
| Nightwing | Idle | ☐ | ☐ |  |
| Nightwing | Walk | ☐ | ☐ |  |
| Nightwing | AttackMelee | ☐ | ☐ |  |
| Nightwing | AttackRanged | ☐ | ☐ |  |

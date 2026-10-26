# Plan: Filipino Myths Roblox Game — a third earnings stream for 'A Day Back Then'

Draft for Christian's review — nothing here is started yet. Prepared Oct 26, 2026.

## The idea in one line

Turn the Filipino Myths content into a **Roblox creature-collector / pet battler**: players hatch, collect, evolve, and battle the creatures from the videos — Bakunawa, Manananggal, Aswang, Tikbalang, Kapre, Dwende, Tiyanak. The videos market the game, the game gives the audience somewhere to go between videos, and both feed the Agensi skills store.

## Why this fits what already exists

- **The roster is already written.** Part 1 of the myths series is literally a creature catalog with art, personalities, and stories. Each creature launch can pair with a video.
- **The pet-game backend is already built.** From the earlier Roblox work (Oct 6–8): `PetStats.luau` (types, stats, XP curve, evolution at levels 16 and 32), `PetDataStore.luau` (server-side save/load, roster), `PetBattle.luau` (combat), `PetAnimAudit.luau`, and the animation registry generator. That is the hardest server code a pet game needs — done.
- **The asset pipeline exists.** Low-poly Blender scripts already produced a 15-pet pack (five 3-stage evolution lines, each with Idle/Walk/AttackMelee/AttackRanged animations), a store pack, and a pendant pack with rarity tiers (common → legendary). Same pipeline makes the myth creatures.
- **The audience matches.** The channel's viewers are mostly Filipino and mobile-first. Roblox is enormous in the Philippines and free to publish on. The audience the videos are already gathering is the exact audience this game is for.
- **The brand loop closes.** Videos → game → in-game events named after new videos → more videos. Plus a future Agensi listing ("Roblox Pet Game Engine" skill) once the game system is proven, same playbook as the Shorts skills.

## The game (MVP scope)

**Working title:** *A Day Back Then: Mythic Pets* (rename freely).

**Core loop (keep it simple — this is what Roblox players already understand):**
1. Hatch eggs to collect myth-creature pets (rarity tiers: Common, Uncommon, Rare, Epic, Legendary — the tiers already designed).
2. Pets follow the player, earn XP, evolve at 16 and 32 (Bakunawa line as the flagship 3-stage evolution).
3. Battle wild creatures in a small arena zone to earn coins; PvE boss every X minutes (e.g., a giant Bakunawa during an "eclipse event").
4. Trade pets with other players (this is what makes pet games sticky and shareable).

**MVP map:** one island plaza (reuse the blocky store pack as the shop), one forest zone (kapre/dwende), one night zone (aswang/manananggal). Three zones, not ten.

**MVP roster:** the 7 Part 1 creatures, each a 3-stage evolution line = 21 models. The Blender pipeline generates them in batches like the earlier pet pack.

**Explicitly out of MVP:** PvP, guilds, story quests, voice acting. Add only if the game earns.

## How it earns (Roblox)

- **Game passes** (one-time Robux): extra pet equip slots, 2x XP, VIP area, exclusive egg.
- **Developer products** (repeatable): coins packs, luck boosts for hatching, instant-evolve.
- **Premium payouts:** Roblox pays creators monthly based on Premium subscribers' play time — rewards retention, which the content loop supplies.
- **Cash-out reality (DevEx):** Robux convert to USD via DevEx at roughly $0.0038/Robux, minimum 30,000 earned Robux to cash out, requires a Roblox Premium account, age/ID verification, and the account in good standing. Treat the first months as Robux accumulation, not salary.
- **Cross-earnings:** every game event is a video topic; every video description carries the game link; Agensi gets a new skill listing once the engine is packaged.

## Production plan

**Phase 0 — Decisions (Christian, one sitting)**
- Confirm the concept and title direction; create (or reuse) the Roblox account/group that will own the game — games should live under a **Group** so ownership and revenue are clean.
- Confirm scope: MVP as above, nothing bigger.

**Phase 1 — Creature factory (Muse, ~1 week of batch runs)**
- Blender scripts for the 7 creature lines (21 models), low-poly in channel-adjacent style, 4 animations each (Idle, Walk, AttackMelee, AttackRanged) using the existing pet-pack pattern.
- Rarity/stat table in `PetStats.luau` format for the new roster.

**Phase 2 — Game assembly (Muse, ~1–2 weeks)**
- Reuse the delivered backend modules (registry, stats, datastore, battle) — wire the new roster in.
- Build the MVP place: plaza + shop (existing store pack), 2 zones, egg-hatching stand, battle arena, eclipse boss event timer.
- Playtest in Roblox Studio; fix; private release first.

**Phase 3 — Launch loop (with the channel)**
- Launch video on 'A Day Back Then' (the myths audience is the seed traffic), game link in description + pinned comment; FB/IG posts via Antigravity's scheduling.
- Weekly rhythm: one creature spotlight Short per week tied to an in-game event (double-drop weekend, new evolution reveal).

**Phase 4 — Live-ops and packaging (only if it earns)**
- Part 2 creatures (Sarimanok, Bernardo Carpio, Maria Makiling lines) as the first content update — the Part 2 video is already made.
- Package the system as an Agensi skill listing ("Roblox Mythic Pet Engine") — a fourth earnings surface from the same work.

## Roles

- **Muse:** creature models and animations (Blender batches), Luau wiring, place assembly, data tables, launch copy.
- **Antigravity:** nothing by default — only if Christian assigns it (e.g., extra scripting on the PC side). Scheduling for launch posts is already its job.
- **Christian:** owns the Roblox account/group, does all Roblox Studio publishing clicks and DevEx setup (accounts and payouts must be his), approves scope at each phase gate.

## Risks and honest limits

- **Discovery is the hard part, not building.** Roblox has millions of games; the channel audience is the unfair advantage, but the game must still be fun in the first 60 seconds. MVP stays small so a weak launch is cheap to learn from.
- **Moderation:** creature designs must stay cartoon, no gore — same silhouette-friendly approach the videos already use. Chat and trading follow Roblox rules; trading needs care (scams are the top complaint in pet games).
- **Time:** this runs alongside the channel, not instead of it. The render/content pipeline keeps priority; game work fills batch slots.
- **DevEx thresholds** mean real cash is a medium-term outcome. Robux balances and Premium payouts still show progress early.

## First decision needed

Approve the concept and Phase 0, or redirect (different genre, different platform). On approval, Phase 1's first creature batch (Bakunawa line, 3 stages) can start as a proof of pipeline before committing to all 21 models.

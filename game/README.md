# Filipino Myths Roblox Game — shared build folder

This folder is the handover point between Muse (asset factory) and Antigravity (Roblox Studio builder, via Studio MCP on Christian's PC) for the 'A Day Back Then' Filipino Myths pet battler.

- `docs/` — the game plan and design notes. Start with `docs/game-plan.md`.
- `models/` — rigged pet models and animation FBX files from Claude's Blender pipeline.
- `textures/` — baked diffuse + emissive PNGs (Roblox ignores FBX material colors; textures carry the color).
- `luau/` — the server-authoritative backend modules (PetStats, PetDataStore, PetBattle, PetAnimations registry, bootstrap, audit) and the registry generator. Do not rewrite these; wire them in.
- `HANDOVER.md` — the live checklist. Muse marks assets READY, Antigravity marks them IMPORTED.

Rules: never publish the game or change its visibility without Christian's explicit word. Finished video renders do NOT live here — they travel through the shared Google Drive folder ("Muse and atigravity handover").

-- PetDataStore.luau
-- Save/load layer for the pet battler: owned pets, levels, XP, and wins,
-- keyed per player in a DataStore. Companion to PetBattle.luau (spawning /
-- combat) and PetStats.luau (stats, XP, evolutions). DataStores only run on
-- the SERVER — require this from a Script in ServerScriptService, not from
-- the client.
--
-- WIRING (numbered):
-- 1. Drop PetDataStore in ServerScriptService. Make sure PetStats is also
--    visible from the server (ReplicatedStorage is fine).
-- 2. In a server Script, wire load -> spawn -> save:
--
--      local PetDataStore = require(game.ServerScriptService.PetDataStore)
--      local PetBattle    = require(game.ReplicatedStorage.PetBattle)
--      local PetStats     = require(game.ReplicatedStorage.PetStats)
--
--      local saveData = {} -- [Player] = data table
--
--      game.Players.PlayerAdded:Connect(function(player)
--          local data, err = PetDataStore.Load(player)
--          if not data then
--              warn("[PetData] load failed, starting fresh: " .. tostring(err))
--              data = PetDataStore.NewData()
--          end
--          saveData[player] = data
--          local active = data.ActivePet
--          local pet = PetBattle.Spawn(active.Species,
--              game.ServerStorage.PetModels[active.Species], spawnCFrame, {
--                  MaxHP = PetStats.MaxHPAt(active.Species, active.Level),
--              })
--          pet.Stats = PetStats.AtLevel(active.Species, active.Level)
--          pet.Stats.XP = active.XP -- carry over saved XP, not just level floor
--          player:SetAttribute("PetSpawned", true)
--          PetDataStore.StartAutosave(player, saveData, function()
--              return PetDataStore.SnapshotFrom(pet) -- capture live state
--          end)
--      end)
--
--      game.Players.PlayerRemoving:Connect(function(player)
--          PetDataStore.StopAutosave(player)
--          PetDataStore.Save(player, saveData[player])
--          saveData[player] = nil
--      end)
--
--      -- After a battle (see PetStats wiring), update the live record:
--      local data = saveData[player]
--      PetDataStore.RecordPet(data, pet.Stats.Name, pet.Stats.Level, pet.Stats.XP)
--      PetDataStore.SetActive(data, pet.Stats.Name) -- after an evolution
--
-- 3. In Studio, turn on "Enable Studio Access to API Services" (Game
--    Settings -> Security) if you want Play Solo sessions to actually save.
-- 4. This is deliberately simple: one active pet + a roster of unlocked pets
--    with their own level/XP, last-writer-wins on conflict. If your game
--    ever needs two devices writing at once, replace Save's UpdateAsync
--    transform with per-pet merge logic instead of the current overwrite.
--
-- NOTES:
-- - DataStore calls can fail (throttle, outage); Load/Save return ok + err
--   so the game keeps running on a fresh record instead of erroring.
-- - Bound DataStore requests: GetAsync/SetAsync are budgeted per minute.
--   Autosave defaults to 5 minutes and one player rarely comes close to
--   the limit. Don't save every frame.
-- - Scoped User IDs: see UserKeyFor below.

local DataStoreService = game:GetService("DataStoreService")

local PetDataStore = {}

local SAVE_VERSION = 1
local AUTOSAVE_MINUTES = 5

local PetStats
do
	-- Soft dependency: if PetStats is sitting in ReplicatedStorage, use it
	-- to validate pet names and the level cap; otherwise run unvalidated.
	local found = game:GetService("ReplicatedStorage"):FindFirstChild("PetStats")
	if found then
		local ok, mod = pcall(require, found)
		if ok and type(mod) == "table" then
			PetStats = mod
		end
	end
end

local autosaves = {} -- [Player] = connection

-- Lazy-load the store so unpublished local Studio sessions do not fail on require
local Store
local function getStore()
	if Store then return Store end
	local ok, res = pcall(function()
		return DataStoreService:GetDataStore("PetBattlerSaves")
	end)
	if ok then
		Store = res
		return Store
	else
		return nil
	end
end

--- The identifier this player's save is keyed by. Single-experience saves
--- key off player.UserId, deliberately and only:
---  - UserId is stable within this experience, and this DataStore only
---    exists inside this experience, so the key can never track a player
---    across other games.
---  - Under the October 2026 scoped-ID rollout, new players get a
---    per-experience UserId automatically; returning players keep their
---    global one. Either way the key is stable here.
--- Deliberately NOT branching on Player.User's scoped Id: keys built from
--- UserId and from User.Id form two disjoint populations with no migration
--- path between them, so one scheme for every player keeps every save
--- reachable. (Player.User — the User datatype with Id, DomainType,
--- DomainId — is for engine APIs that need the scoped identity object
--- itself, not for save keys.)
function PetDataStore.UserKeyFor(player)
	return "PetSave_" .. tostring(player.UserId)
end

--- A fresh save record. ActivePet is the pet the player spawns with;
--- Roster keeps every unlocked pet's own progress, so a collection or
--- "switch pet" screen can read it later.
function PetDataStore.NewData()
	return {
		Version = SAVE_VERSION,
		ActivePet = { Species = "BakunawaHatchling", Level = 1, XP = 0 },
		Roster = { BakunawaHatchling = { Species = "BakunawaHatchling", Level = 1, XP = 0 } },
		Wins = 0,
		SavedAt = 0,
	}
end

local function sanitizePetRecord(rec)
	if type(rec) ~= "table" then return nil end
	local species = rec.Species
	if type(species) ~= "string" then return nil end
	if PetStats and PetStats.Base and not PetStats.Base[species] then
		return nil -- unknown pet name; drop it rather than spawning garbage
	end
	local level = math.clamp(math.floor(tonumber(rec.Level) or 1), 1,
		PetStats and PetStats.MaxLevel or 100)
	return { Species = species, Level = level, XP = math.max(0, tonumber(rec.XP) or 0) }
end

--- Loads a player's save. Returns (data) or (nil, err). A missing record
--- returns a fresh NewData() — first play, not an error. Corrupt or
--- incompatible records also fall back to NewData() instead of crashing.
function PetDataStore.Load(player)
	local key = PetDataStore.UserKeyFor(player)
	local ok, result = pcall(function()
		local store = getStore()
	if not store then return nil, "DataStore unavailable in offline/unpublished Studio" end
	return store:GetAsync(key)
	end)
	if not ok then
		return nil, result -- DataStore error; caller decides (see wiring)
	end
	if type(result) ~= "table" or result.Version ~= SAVE_VERSION then
		return PetDataStore.NewData() -- first play, or a record from an old version
	end
	local data = PetDataStore.NewData()
	local active = sanitizePetRecord(result.ActivePet)
	if active then
		data.ActivePet = active
	end
	data.Wins = math.max(0, math.floor(tonumber(result.Wins) or 0))
	data.Roster = {}
	if type(result.Roster) == "table" then
		for name, rec in pairs(result.Roster) do
			local clean = sanitizePetRecord(rec)
			if clean then
				data.Roster[name] = clean
			end
		end
	end
	-- Make sure the active pet is always in the roster too.
	data.Roster[data.ActivePet.Species] = data.Roster[data.ActivePet.Species]
		or { Species = data.ActivePet.Species, Level = data.ActivePet.Level, XP = data.ActivePet.XP }
	return data
end

--- Writes a player's save. Returns (true) or (false, err). Uses UpdateAsync
--- so a stale read can't silently clobber a newer write from another
--- server; on conflict the newer record (by SavedAt) wins.
function PetDataStore.Save(player, data)
	if not data then
		return false, "no data to save"
	end
	-- Wall clock, not os.clock(): the conflict check below compares this
	-- timestamp across different server processes, where os.clock() (CPU
	-- time since that process started) is meaningless — a server up for an
	-- hour would always "win" over a fresh one regardless of recency.
	data.SavedAt = os.time()
	local key = PetDataStore.UserKeyFor(player)
	local ok, err = pcall(function()
		local store = getStore()
	if not store then return true end
	store:UpdateAsync(key, function(old)
			if type(old) == "table" and (old.SavedAt or 0) > data.SavedAt then
				return old -- another server saved something newer; keep it
			end
			return data
		end)
	end)
	return ok, err
end

--- Captures a PetBattle pet's live state into a record the datastore can
--- hold: { Species, Level, XP }. Assumes pet.Stats was set per the
--- PetStats wiring (pet.Stats = PetStats.AtLevel(...), with XP carried).
function PetDataStore.SnapshotFrom(pet)
	assert(pet and pet.Stats, "[PetDataStore] pet.Stats is missing")
	return {
		Species = pet.Stats.Name,
		Level = pet.Stats.Level,
		XP = pet.Stats.XP or 0,
	}
end

--- Records one pet's progress in the roster (add or update).
function PetDataStore.RecordPet(data, species, level, xp)
	assert(data, "[PetDataStore] data is missing")
	data.Roster[species] = {
		Species = species,
		Level = math.clamp(math.floor(tonumber(level) or 1), 1,
			PetStats and PetStats.MaxLevel or 100),
		XP = math.max(0, tonumber(xp) or 0),
	}
end

--- Sets the pet the player spawns with. Errors on unknown species so a
--- typo can't wipe the active slot.
function PetDataStore.SetActive(data, species)
	assert(data, "[PetDataStore] data is missing")
	if PetStats and PetStats.Base and not PetStats.Base[species] then
		error("[PetDataStore] unknown pet: " .. tostring(species))
	end
	data.ActivePet.Species = species
	local roster = data.Roster[species]
	if roster then
		data.ActivePet.Level = roster.Level
		data.ActivePet.XP = roster.XP
	end
end

--- Increments the win counter (used for quests, badges, whatever).
function PetDataStore.RecordWin(data)
	assert(data, "[PetDataStore] data is missing")
	data.Wins = data.Wins + 1
end

--- Starts a periodic autosave. saveData is your [Player] -> data table and
--- capture is a function returning the live pet snapshot (see wiring).
--- Safe to call once per player; does nothing if already running.
function PetDataStore.StartAutosave(player, saveData, capture)
	if autosaves[player] then return end
	autosaves[player] = task.spawn(function()
		while true do
			task.wait(AUTOSAVE_MINUTES * 60)
			local data = saveData[player]
			if not data then break end
			if capture then
				local ok, snap = pcall(capture)
				if ok and snap then
					PetDataStore.RecordPet(data, snap.Species, snap.Level, snap.XP)
				end
			end
			local saved, err = PetDataStore.Save(player, data)
			if not saved then
				warn("[PetDataStore] autosave failed for " .. player.Name .. ": " .. tostring(err))
			end
		end
	end)
end

--- Stops the autosave loop (call on PlayerRemoving, before the final Save).
function PetDataStore.StopAutosave(player)
	local handle = autosaves[player]
	if handle then
		task.cancel(handle)
		autosaves[player] = nil
	end
end

return PetDataStore

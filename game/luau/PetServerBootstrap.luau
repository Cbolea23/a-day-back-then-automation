-- PetServerBootstrap.luau
-- Server-side glue that wires PetBattle + PetStats + PetDataStore together.
-- This is a MODULESCRIPT: put it in ServerStorage, then create a plain
-- Script in ServerScriptService containing exactly one line:
--
--     require(game.ServerStorage.PetServerBootstrap).Init()
--
-- (The requires below assume PetBattle, PetStats, and PetDataStore are
-- ModuleScripts in ReplicatedStorage.)
--
-- SETUP (numbered):
-- 1. Finish the import pipeline first: the 60 animation asset IDs must be
--    filled into PetAnimations.luau (use fill_registry.py + the tracker).
-- 2. Put your 15 imported pet MODELS in a Folder named "PetModels" in
--    ServerStorage. Rename each model to its pet name, e.g. "Infernox".
--    (Only the _Idle import is needed per pet — same mesh + rig.)
-- 3. Put PetBattle, PetStats, PetDataStore, and PetAnimations ModuleScripts
--    in ReplicatedStorage.
-- 4. Put THIS ModuleScript in ServerStorage, and the one-line Script from
--    above in ServerScriptService. That's the whole install.
--
-- WHAT IT DOES:
-- - PlayerAdded: loads their save (with retries), spawns their active pet
--   at the saved level with level-scaled HP, and starts autosave.
-- - Combat: call PetServer.HandleAttack(player, "AttackMelee", targetPet)
--   from your own combat RemoteEvent / hitbox code. Damage is computed
--   from PetStats (type chart + STAB + variance), XP is awarded to the
--   winner on kill, and evolution thresholds (16 / 32) are checked.
-- - PlayerRemoving / game close: final save of the live pet state.
--
-- DESIGN NOTE: HandleAttack plays the animation through PetBattle and
-- applies damage via PetStats.CalcDamage + TakeDamage on the PET (not the
-- Humanoid), so the pet's stat-scaled HP is the real health bar. The
-- animation-only call also keeps the cooldown logic server-side, where
-- exploiters can't spoof it.

local Players = game:GetService("Players")
local ServerStorage = game:GetService("ServerStorage")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local PetBattle = require(ReplicatedStorage.PetBattle)
local PetStats = require(ReplicatedStorage.PetStats)
local PetDataStore = require(ReplicatedStorage.PetDataStore)

local PetModels = ServerStorage:WaitForChild("PetModels")

local PetServer = {}

-- Live state, indexed by player.
local playerPets = {}  -- [Player] -> PetBattle pet object
local saveData = {}    -- [Player] -> PetDataStore data record
local followWired = {} -- [Player] -> true once CharacterAdded is hooked

--- Spawns one player's active pet from their save record, with
--- level-scaled HP and the stat block PetBattle/PetDataStore expect.
local function spawnForPlayer(player, data)
	local active = data.ActivePet
	local template = PetModels:FindFirstChild(active.Species)
	assert(template, "[PetServer] no model in ServerStorage.PetModels for "
		.. tostring(active.Species))

	-- Spawn near the player's character (or at the world origin fallback).
	local spawnCFrame = CFrame.new(0, 5, 0)
	local char = player.Character
	if char and char:FindFirstChild("HumanoidRootPart") then
		spawnCFrame = char.HumanoidRootPart.CFrame * CFrame.new(4, 0, 0)
	end

	local pet = PetBattle.Spawn(active.Species, template, spawnCFrame, {
		MaxHP = PetStats.MaxHPAt(active.Species, active.Level),
	})
	pet.Stats = PetStats.AtLevel(active.Species, active.Level)
	pet.Stats.XP = active.XP -- keep saved progress, not the curve's floor
	pet.HP = pet.Opts.MaxHP
	playerPets[player] = pet

	-- Follow the character once it exists; re-attach on respawn.
	local function attachFollow(c)
		local root = c:WaitForChild("HumanoidRootPart")
		if playerPets[player] then
			playerPets[player].FollowTarget = root
		end
	end
	if char then
		task.spawn(attachFollow, char)
	end
	-- Hooked once per player (Respawn reuses it; re-attaching is harmless
	-- but this avoids stacking connections).
	if not followWired[player] then
		followWired[player] = true
		player.CharacterAdded:Connect(attachFollow)
	end

	return pet
end

--- Awards XP to the winner's pet after a kill, then checks the level-up
--- and evolution thresholds. Returns the (possibly replaced) winner pet.
local function awardWin(player, winner, loserLevel)
	local data = saveData[player]
	local gain = PetStats.XPGain(winner.Stats.Level, loserLevel)
	local totalXP = (winner.Stats.XP or 0) + gain
	local newLevel = PetStats.LevelForXP(totalXP)

	winner.Stats = PetStats.AtLevel(winner.Name, newLevel)
	winner.Stats.XP = totalXP -- keep overflow progress toward next level

	-- Evolve at 16 / 32. Evolve() multiplies MaxHP by 1.5x, so re-derive it
	-- from the new species' stat line to stay consistent with PetStats.
	local evo = PetStats.NextEvolution(winner.Name)
	if evo and newLevel >= evo.Level then
		local template = PetModels:FindFirstChild(evo.Name)
		assert(template, "[PetServer] no model in ServerStorage.PetModels for "
			.. tostring(evo.Name))
		local hpRatio = winner.HP / winner.Opts.MaxHP
		local evolved = winner:Evolve(evo.Name, template)
		evolved.Opts.MaxHP = PetStats.MaxHPAt(evo.Name, newLevel)
		evolved.HP = math.min(evolved.Opts.MaxHP,
			math.floor(evolved.Opts.MaxHP * hpRatio))
		evolved.Stats = PetStats.AtLevel(evo.Name, newLevel)
		evolved.Stats.XP = totalXP
		winner = evolved
		playerPets[player] = evolved
	else
		-- Level-up heals to the new MaxHP (classic RPG feel). Comment out
		-- if you want HP to stay where it was.
		winner.Opts.MaxHP = PetStats.MaxHPAt(winner.Name, newLevel)
		winner.HP = winner.Opts.MaxHP
	end

	-- Keep the save record in sync so a crash still keeps this progress.
	-- ActivePet must follow the (possibly evolved) species, or the player
	-- would respawn as the baby after evolving.
	if data then
		local snap = PetDataStore.SnapshotFrom(winner)
		PetDataStore.RecordPet(data, snap.Species, snap.Level, snap.XP)
		data.ActivePet.Species = snap.Species
		data.ActivePet.Level = snap.Level
		data.ActivePet.XP = snap.XP
		PetDataStore.RecordWin(data)
	end

	return winner
end

--- The one combat entry point: call this when a pet attacks. animName is
--- "AttackMelee" or "AttackRanged"; targetPet is the enemy's pet object.
--- Plays the animation (server-side cooldowns), deals stat-based damage,
--- and handles XP/evolution when the target dies.
function PetServer.HandleAttack(player, animName, targetPet)
	local attacker = playerPets[player]
	if not attacker or attacker._alive ~= true then return end
	if not targetPet or targetPet._alive ~= true then return end
	if targetPet == attacker then return end

	-- Animation-only: damage is computed here so it can't be spoofed.
	local swung = attacker:Attack(animName)
	if not swung then return end -- still on cooldown
	local dmg = PetStats.CalcDamage(attacker.Stats, targetPet.Stats, animName)
	local died = targetPet:TakeDamage(dmg)
	if died then
		awardWin(player, attacker, targetPet.Stats.Level)
		-- The loser's fate is your game's call: find its owner by scanning
		-- playerPets and call PetServer.Respawn(owner) after a delay, or
		-- treat it as a wild pet and leave it destroyed.
	end
end

--- Respawns a player's pet after it died (used by their own code when a
--- pet faints — e.g. in a HandleAttack death branch or wild battles).
function PetServer.Respawn(player)
	local pet = playerPets[player]
	local data = saveData[player]
	if pet and pet._alive then
		pet:Destroy()
	end
	if data then
		-- Re-read the save so a mid-fight level-up is reflected.
		local active = data.ActivePet
		local rostered = data.Roster[active.Species]
		if rostered then
			active.Level = rostered.Level
			active.XP = rostered.XP
		end
		playerPets[player] = spawnForPlayer(player, data)
	end
end

local function cleanup(player)
	local data = saveData[player]
	local pet = playerPets[player]
	if data and pet and pet._alive then
		local snap = PetDataStore.SnapshotFrom(pet)
		PetDataStore.RecordPet(data, snap.Species, snap.Level, snap.XP)
	end
	PetDataStore.StopAutosave(player)
	if data then
		local saved, err = PetDataStore.Save(player, data)
		if not saved then
			warn("[PetServer] final save failed for " .. player.Name .. ": "
				.. tostring(err))
		end
	end
	if pet then
		pet:Destroy()
	end
	playerPets[player] = nil
	saveData[player] = nil
	followWired[player] = nil
end

-- Lifecycle ---------------------------------------------------------------
-- Connects everything. Call ONCE from a plain Script in ServerScriptService:
--     require(game.ServerStorage.PetServerBootstrap).Init()
function PetServer.Init()
	Players.PlayerAdded:Connect(function(player)
		-- Load with retries: playing on a blank record and then SAVING would
		-- clobber the player's real save, so failing to load kicks instead.
		local data, err
		for attempt = 1, 3 do
			data, err = PetDataStore.Load(player)
			if data then break end
			task.wait(2 * attempt)
		end
		if not data then
			player:Kick("Your pet data failed to load (" .. tostring(err)
				.. "). Please rejoin — your pets are safe.")
			return
		end

		saveData[player] = data
		local ok, spawnErr = pcall(spawnForPlayer, player, data)
		if not ok then
			warn("[PetServer] failed to spawn pet for " .. player.Name .. ": "
				.. tostring(spawnErr))
			return
		end
		PetDataStore.StartAutosave(player, saveData, function()
			local pet = playerPets[player]
			if pet and pet._alive then
				return PetDataStore.SnapshotFrom(pet)
			end
			return nil
		end)
	end)

	Players.PlayerRemoving:Connect(cleanup)

	-- Studio stop button doesn't always fire PlayerRemoving; BindToClose
	-- covers the real-game shutdown case too.
	game:BindToClose(function()
		for _, player in ipairs(Players:GetPlayers()) do
			cleanup(player)
		end
	end)
end

return PetServer

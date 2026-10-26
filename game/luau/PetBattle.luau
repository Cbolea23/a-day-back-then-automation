-- PetBattle.luau
-- Starter pet combat module that plugs into PetAnimations.luau.
-- Drop it in ReplicatedStorage next to PetAnimations.
--
-- SETUP (numbered):
-- 1. Finish the import pipeline first: the 60 animation asset IDs must be
--    filled into PetAnimations.luau (use fill_registry.py + the tracker).
-- 2. Put your 15 imported pet MODELS in a Folder named "PetModels" in
--    ServerStorage. Rename each model to its pet name, e.g. "Infernox".
--    (Only the _Idle import is needed per pet — same mesh + rig.)
-- 3. On the server, require this module and spawn a pet:
--
--      local PetBattle = require(game.ReplicatedStorage.PetBattle)
--      local pet = PetBattle.Spawn("Infernox",
--          game.ServerStorage.PetModels.Infernox, spawnCFrame)
--      pet:Attack("AttackMelee", enemyHumanoid, 25)
--      pet = pet:Evolve("Infernox", game.ServerStorage.PetModels.Infernox)
--      pet:Destroy()
--
-- NOTES:
-- - Movement is deliberately simple: each pet auto-follows an optional
--   target part at a fixed speed, switching Idle <-> Walk loops on its own.
--   Swap out the follow logic for your own pathfinding when ready.
-- - Damage is applied on the server via a Humanoid reference, so exploiters
--   can't fake attack damage through this module.

local RunService = game:GetService("RunService")
local PetAnims = require(script.Parent.PetAnimations)

local PetBattle = {}

local DEFAULTS = {
	MaxHP = 100,
	FollowSpeed = 12,   -- studs/second
	FollowRange = 24,    -- start following when farther than this
	StopRange = 3,       -- stop when closer than this
	Cooldowns = {       -- seconds, per attack animation
		AttackMelee = 1.5,
		AttackRanged = 3.0,
	},
}

local function findAnimator(model)
	local hum = model:FindFirstChildOfClass("Humanoid")
	if hum and hum:FindFirstChildOfClass("Animator") then
		return hum:FindFirstChildOfClass("Animator")
	end
	return model:FindFirstChild("Animator", true)
end

local function findRoot(model)
	local hum = model:FindFirstChildOfClass("Humanoid")
	if hum and hum.RootPart then
		return hum.RootPart
	end
	return model:FindFirstChild("HumanoidRootPart") or model.PrimaryPart
end

--- Spawns one battle pet. Returns a pet object, or errors if the template
--- or registry slots are missing.
-- @param petName string, e.g. "Infernox" (must match PetAnimations.Pets key)
-- @param template Model, the imported pet model (will be cloned)
-- @param spawnCFrame CFrame, where to place the pet
-- @param config table (optional), overrides of DEFAULTS fields
function PetBattle.Spawn(petName, template, spawnCFrame, config)
	assert(template, "[PetBattle] template model is missing for " .. tostring(petName))
	config = config or {}
	local opts = {
		MaxHP = config.MaxHP or DEFAULTS.MaxHP,
		FollowSpeed = config.FollowSpeed or DEFAULTS.FollowSpeed,
		FollowRange = config.FollowRange or DEFAULTS.FollowRange,
		StopRange = config.StopRange or DEFAULTS.StopRange,
		Cooldowns = {},
	}
	for k, v in pairs(DEFAULTS.Cooldowns) do
		opts.Cooldowns[k] = (config.Cooldowns and config.Cooldowns[k]) or v
	end

	local model = template:Clone()
	model.Name = petName .. "_Pet"
	local root = findRoot(model)
	assert(root, "[PetBattle] no root part found in " .. template.Name)
	model:PivotTo(spawnCFrame)
	model.Parent = workspace

	local animator = findAnimator(model)
	assert(animator, "[PetBattle] no Animator found in " .. template.Name)

	-- Load all 4 animation tracks up front so attacks are instant.
	local tracks = {}
	for _, animName in ipairs(PetAnims.Anims) do
		tracks[animName] = PetAnims.LoadTrack(animator, petName, animName)
	end

	local pet = {
		Name = petName,
		Model = model,
		Animator = animator,
		Tracks = tracks,
		Opts = opts,
		HP = opts.MaxHP,
		FollowTarget = nil, -- set to a BasePart/Model for the pet to trail
		_nextAttackAt = { AttackMelee = 0, AttackRanged = 0 },
		_alive = true,
	}

	-- Idle <-> Walk loop switcher, driven by actual movement speed.
	tracks.Idle.Looped = true
	tracks.Walk.Looped = true
	tracks.Idle:Play(0.2)
	local lastPos = root.Position
	local movingAnim = false
	local following = false
	pet._heartbeat = RunService.Heartbeat:Connect(function(dt)
		if not pet._alive then return end
		-- follow (optional, cheap): trails FollowTarget until close
		local target = pet.FollowTarget
		if target then
			local goal = (target:IsA("Model") and target:GetPivot().Position) or target.Position
			local toGoal = Vector3.new(goal.X - root.Position.X, 0, goal.Z - root.Position.Z)
			local dist = toGoal.Magnitude
			if dist > opts.FollowRange then
				following = true
			elseif dist < opts.StopRange then
				following = false
			end
			if following and dist > 0.01 then
				local step = toGoal.Unit * math.min(opts.FollowSpeed * dt, dist)
				local newPos = root.Position + step
				model:PivotTo(CFrame.lookAt(newPos, newPos + toGoal))
			end
		end
		-- loop switching
		local moved = (root.Position - lastPos).Magnitude / math.max(dt, 0.001)
		lastPos = root.Position
		local moving = moved > 2
		if moving ~= movingAnim then
			movingAnim = moving
			if moving then
				tracks.Idle:Stop(0.2)
				tracks.Walk:Play(0.2)
			else
				tracks.Walk:Stop(0.2)
				tracks.Idle:Play(0.2)
			end
		end
	end)

	-- attach methods so the pet works with colon calls: pet:Attack(...)
	for _, m in ipairs({ "Attack", "TakeDamage", "Heal", "Evolve", "Destroy" }) do
		pet[m] = PetBattle[m]
	end

	return pet
end

--- Plays an attack animation (one-shot) and optionally damages a target.
-- @param animName "AttackMelee" or "AttackRanged"
-- @param targetHumanoid Humanoid (optional) to damage on the server
-- @param damage number (optional), default 10
function PetBattle.Attack(pet, animName, targetHumanoid, damage)
	assert(pet._alive, "[PetBattle] pet is destroyed")
	assert(pet.Tracks[animName] and pet.Opts.Cooldowns[animName],
		"[PetBattle] unknown attack: " .. tostring(animName) .. ' (use "AttackMelee" or "AttackRanged")')
	local now = os.clock()
	if now < pet._nextAttackAt[animName] then
		return false -- still on cooldown
	end
	pet._nextAttackAt[animName] = now + pet.Opts.Cooldowns[animName]
	local track = pet.Tracks[animName]
	track:Play(0.1)
	damage = damage or 10
	if targetHumanoid and targetHumanoid.Health > 0 then
		-- apply damage at the hit moment (mid-swing) rather than instantly
		task.delay(track.Length * 0.4, function()
			if pet._alive and targetHumanoid.Health > 0 then
				targetHumanoid:TakeDamage(damage)
			end
		end)
	end
	return true
end

--- Damages the pet. Returns true if the pet died.
function PetBattle.TakeDamage(pet, amount)
	if not pet._alive then return true end
	pet.HP = math.max(0, pet.HP - amount)
	if pet.HP <= 0 then
		pet:Destroy()
		return true
	end
	return false
end

function PetBattle.Heal(pet, amount)
	if not pet._alive then return end
	pet.HP = math.min(pet.Opts.MaxHP, pet.HP + amount)
end

--- Swaps the pet to its next evolution, keeping HP ratio and follow target.
-- @param newPetName string, e.g. "EmberFox"
-- @param newTemplate Model, the imported model for the new evolution
function PetBattle.Evolve(pet, newPetName, newTemplate)
	assert(pet._alive, "[PetBattle] pet is destroyed")
	local hpRatio = pet.HP / pet.Opts.MaxHP
	local oldCFrame = pet.Model:GetPivot()
	local followTarget = pet.FollowTarget
	local pos = oldCFrame.Position
	pet:Destroy()
	local evolved = PetBattle.Spawn(newPetName, newTemplate,
		CFrame.new(pos), { MaxHP = math.floor(pet.Opts.MaxHP * 1.5) })
	evolved.HP = math.floor(evolved.Opts.MaxHP * hpRatio)
	evolved.FollowTarget = followTarget
	return evolved
end

--- Cleans up: stops tracks, disconnects the loop, removes the model.
function PetBattle.Destroy(pet)
	if not pet._alive then return end
	pet._alive = false
	if pet._heartbeat then pet._heartbeat:Disconnect() end
	for _, track in pairs(pet.Tracks) do
		track:Stop()
	end
	if pet.Model then pet.Model:Destroy() end
end

return PetBattle

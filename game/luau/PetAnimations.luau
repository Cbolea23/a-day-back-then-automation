-- PetAnimations.luau
-- Animation asset ID registry for the 15 evolution pets (60 animations) + Bakunawa.
--
-- HOW TO USE:
-- 1. In Blender, set AUTO_EXPORT = True in pet_pack.py and run it.
--    60 FBX files land in the "pet_exports" folder next to your .blend,
--    named like "Cinderpup_Idle.fbx".
-- 2. In Roblox Studio, bulk-import the FBX files through the Asset Manager / 3D Importer
--    (one per pet body + its 4 animations).
-- 3. For each animation FBX, export/publish as an Animation asset, or let the
--    smart fallback resolve local KeyframeSequences from ServerStorage.RBX_ANIMSAVES.
-- 4. Paste each published asset ID into the matching slot below (replace the 0).

local PetAnimations = {}

local function A(id)
	return id > 0 and ("rbxassetid://" .. id) or nil
end

PetAnimations.Pets = {
	-- Fire line
	Cinderpup  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	EmberFox   = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	Infernox   = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	-- Water line
	Bublet     = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	AquaTurtle = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	Tidalord   = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	-- Earth line
	Pebblit    = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	SproutGolem= { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	Terratitan = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	-- Electric line
	Voltkit    = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	VoltBunny  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	Stormhare  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	-- Dark line
	Duskflit   = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	ShadowBat  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	Nightwing  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	-- Bakunawa line (Filipino Mythic Moon Serpent)
	BakunawaHatchling = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	BakunawaSerpent   = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	BakunawaEclipse   = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
}

PetAnimations.Anims = { "Idle", "Walk", "AttackMelee", "AttackRanged" }

local registeredCache = {}

--- Returns the rbxassetid string for a pet + animation. Checks published IDs
--- first, then falls back to local KeyframeSequences in ServerStorage.RBX_ANIMSAVES.
function PetAnimations.Get(petName, animName)
	local pet = PetAnimations.Pets[petName]
	assert(pet, "[PetAnimations] unknown pet: " .. tostring(petName))
	local id = pet[animName]
	if id then return id end

	-- Check cache or fallback to local ServerStorage.RBX_ANIMSAVES KeyframeSequence
	local key = petName .. "_" .. animName
	if registeredCache[key] then return registeredCache[key] end

	local ksp = game:GetService("KeyframeSequenceProvider")
	local ss = game:GetService("ServerStorage")
	local saves = ss:FindFirstChild("RBX_ANIMSAVES")
	if saves then
		local folder = saves:FindFirstChild(key) or saves:FindFirstChild(petName)
		if folder then
			local kfs = folder:FindFirstChildOfClass("KeyframeSequence")
			if kfs then
				local ok, localId = pcall(function()
					return ksp:RegisterKeyframeSequence(kfs)
				end)
				if ok and localId then
					registeredCache[key] = localId
					return localId
				end
			end
		end
	end

	error(("[PetAnimations] no asset ID set for %s_%s and no KeyframeSequence found in RBX_ANIMSAVES"):format(petName, animName))
end

--- Builds and loads an AnimationTrack on the given Animator.
function PetAnimations.LoadTrack(animator, petName, animName)
	local anim = Instance.new("Animation")
	anim.AnimationId = PetAnimations.Get(petName, animName)
	return animator:LoadAnimation(anim)
end

return PetAnimations

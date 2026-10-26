-- PetAnimations.luau
-- Animation asset ID registry for the 15 evolution pets (60 animations).
--
-- HOW TO USE:
-- 1. In Blender, set AUTO_EXPORT = True in pet_pack.py and run it.
--    60 FBX files land in the "pet_exports" folder next to your .blend,
--    named like "Cinderpup_Idle.fbx".
-- 2. In Roblox Studio, bulk-import the FBX files through the Asset Manager
--    (one per pet body + its 4 animations).
-- 3. For each animation FBX, open it in the Animation Editor
--    (Plugins -> Animation Editor -> import the FBX), then Publish to Roblox
--    as an Animation asset. Copy the asset ID.
-- 4. Paste each ID into the matching slot below (replace the 0).
-- 5. Put this ModuleScript in ReplicatedStorage and require it from your
--    pet / battle scripts:
--
--      local PetAnims = require(game.ReplicatedStorage.PetAnimations)
--      local idleId = PetAnims.Get("Infernox", "Idle")  --> "rbxassetid://123..."
--      local track = PetAnims.LoadTrack(animator, "Infernox", "AttackMelee")

local PetAnimations = {}

local function A(id)
	return id > 0 and ("rbxassetid://" .. id) or nil
end

PetAnimations.Pets = {
	-- Fire line
	Cinderpup  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- baby
	EmberFox  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- mid
	Infernox  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- final
	-- Water line
	Bublet     = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- baby
	AquaTurtle = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- mid
	Tidalord   = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- final
	-- Earth line
	Pebblit    = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- baby
	SproutGolem= { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- mid
	Terratitan = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- final
	-- Electric line
	Voltkit    = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- baby
	VoltBunny  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- mid
	Stormhare  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- final
	-- Dark line
	Duskflit   = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- baby
	ShadowBat  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- mid
	Nightwing  = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) }, -- final
	-- Bakunawa line (Filipino Mythic Moon Serpent)
	BakunawaHatchling = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	BakunawaSerpent   = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
	BakunawaEclipse   = { Idle = A(0), Walk = A(0), AttackMelee = A(0), AttackRanged = A(0) },
}

-- Animation names, in FBX order. FBX file for each slot: <PetName>_<Anim>.fbx
PetAnimations.Anims = { "Idle", "Walk", "AttackMelee", "AttackRanged" }

--- Returns the rbxassetid string for a pet + animation. Errors if the ID
--- slot is still empty (0) or the name is misspelled.
function PetAnimations.Get(petName, animName)
	local pet = PetAnimations.Pets[petName]
	assert(pet, "[PetAnimations] unknown pet: " .. tostring(petName))
	local id = pet[animName]
	assert(id, ("[PetAnimations] no asset ID set for %s_%s"):format(petName, animName))
	return id
end

--- Builds and loads an AnimationTrack on the given Animator. Example:
---   local track = PetAnims.LoadTrack(humanoid.Animator, "Tidalord", "AttackRanged")
---   track:Play()
function PetAnimations.LoadTrack(animator, petName, animName)
	local anim = Instance.new("Animation")
	anim.AnimationId = PetAnimations.Get(petName, animName)
	return animator:LoadAnimation(anim)
end

return PetAnimations

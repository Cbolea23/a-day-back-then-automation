-- PetStats.luau
-- Data layer for the 15 evolution pets: elemental types, base stats,
-- XP curve, evolution thresholds, type chart, and a damage formula.
-- Companion to PetAnimations.luau (60 animation IDs) and PetBattle.luau
-- (spawning, attacks, evolve). Drop it in ReplicatedStorage next to them.
--
-- WIRING (numbered):
-- 1. Give each pet stats at spawn:
--      local PetStats  = require(game.ReplicatedStorage.PetStats)
--      local PetBattle = require(game.ReplicatedStorage.PetBattle)
--      local level = 1
--      local pet = PetBattle.Spawn("Cinderpup", template, spawnCFrame, {
--          MaxHP = PetStats.MaxHPAt("Cinderpup", level),
--      })
--      pet.Stats = PetStats.AtLevel("Cinderpup", level)
-- 2. Deal stat-based, type-effective damage instead of a flat number:
--      local dmg = PetStats.CalcDamage(attacker.Stats, defender.Stats, "AttackMelee")
--      defender:TakeDamage(dmg)
-- 3. Level up after a win, then evolve when the threshold is hit:
--      local totalXP = pet.Stats.XP + PetStats.XPGain(winnerLevel, loserLevel)
--      local newLevel = PetStats.LevelForXP(totalXP)
--      pet.Stats = PetStats.AtLevel(pet.Name, newLevel)
--      pet.Stats.XP = totalXP -- keep overflow progress toward the next level
--      local evo = PetStats.NextEvolution(pet.Name)
--      if evo and newLevel >= evo.Level then
--          pet = pet:Evolve(evo.Name, game.ServerStorage.PetModels[evo.Name])
--          pet.Stats = PetStats.AtLevel(evo.Name, newLevel)
--      end
--
-- TUNING: every number below is a starting point for a casual battler.
-- Babies sit around 200 total stats, finals around 450. Raise or lower
-- the per-level growth in StatAt, or the thresholds in Evolutions, to
-- taste — the formulas keep everything consistent automatically.

local PetStats = {}

-- Elemental types, in chart order.
PetStats.Types = { "Fire", "Water", "Earth", "Electric", "Dark" }

-- Type effectiveness: Chart[attackerType][defenderType] = multiplier.
PetStats.Chart = {
	Fire     = { Fire = 0.5, Water = 0.5, Earth = 2,   Electric = 1, Dark = 1   },
	Water    = { Fire = 2,   Water = 0.5, Earth = 2,   Electric = 0.5, Dark = 1 },
	Earth    = { Fire = 2,   Water = 0.5, Earth = 0.5, Electric = 2, Dark = 1   },
	Electric = { Fire = 1,   Water = 2,   Earth = 0.5, Electric = 0.5, Dark = 1 },
	Dark     = { Fire = 1,   Water = 1,   Earth = 1,   Electric = 2, Dark = 0.5 },
}

-- Base stats at level 1. Names must match PetAnimations.Pets exactly.
-- Format: { Type, HP, Attack, Defense, Speed }
PetStats.Base = {
	-- Fire line
	Cinderpup   = { Type = "Fire", HP = 45,  Attack = 55,  Defense = 35,  Speed = 60  }, -- baby
	EmberFox    = { Type = "Fire", HP = 65,  Attack = 80,  Defense = 50,  Speed = 90  }, -- mid
	Infernox    = { Type = "Fire", HP = 90,  Attack = 120, Defense = 75,  Speed = 130 }, -- final
	-- Water line
	Bublet      = { Type = "Water", HP = 60, Attack = 45,  Defense = 50,  Speed = 40  }, -- baby
	AquaTurtle  = { Type = "Water", HP = 85, Attack = 60,  Defense = 95,  Speed = 55  }, -- mid
	Tidalord    = { Type = "Water", HP = 110, Attack = 85, Defense = 130, Speed = 80  }, -- final
	-- Earth line
	Pebblit     = { Type = "Earth", HP = 65,  Attack = 50,  Defense = 70,  Speed = 30  }, -- baby
	SproutGolem = { Type = "Earth", HP = 95,  Attack = 70,  Defense = 100, Speed = 45  }, -- mid
	Terratitan  = { Type = "Earth", HP = 120, Attack = 95,  Defense = 140, Speed = 60  }, -- final
	-- Electric line
	Voltkit     = { Type = "Electric", HP = 40, Attack = 55,  Defense = 30, Speed = 85  }, -- baby
	VoltBunny   = { Type = "Electric", HP = 60, Attack = 80,  Defense = 45, Speed = 120 }, -- mid
	Stormhare   = { Type = "Electric", HP = 85, Attack = 110, Defense = 60, Speed = 160 }, -- final
	-- Dark line
	Duskflit    = { Type = "Dark", HP = 50,  Attack = 60,  Defense = 40,  Speed = 70  }, -- baby
	ShadowBat   = { Type = "Dark", HP = 75,  Attack = 90,  Defense = 60,  Speed = 100 }, -- mid
	Nightwing   = { Type = "Dark", HP = 100, Attack = 125, Defense = 85,  Speed = 135 }, -- final
}

-- Evolution lines, baby -> mid -> final (handy for UI / dex screens).
PetStats.EvolLines = {
	Fire     = { "Cinderpup", "EmberFox", "Infernox" },
	Water    = { "Bublet", "AquaTurtle", "Tidalord" },
	Earth    = { "Pebblit", "SproutGolem", "Terratitan" },
	Electric = { "Voltkit", "VoltBunny", "Stormhare" },
	Dark     = { "Duskflit", "ShadowBat", "Nightwing" },
}

-- Evolution thresholds. Finals have no entry (NextEvolution returns nil).
-- Format: [currentName] = { Name = nextName, Level = minLevel }
PetStats.Evolutions = {
	Cinderpup = { Name = "EmberFox",   Level = 16 },
	EmberFox  = { Name = "Infernox",   Level = 32 },
	Bublet    = { Name = "AquaTurtle", Level = 16 },
	AquaTurtle= { Name = "Tidalord",   Level = 32 },
	Pebblit   = { Name = "SproutGolem",Level = 16 },
	SproutGolem={ Name = "Terratitan",  Level = 32 },
	Voltkit   = { Name = "VoltBunny",  Level = 16 },
	VoltBunny = { Name = "Stormhare",  Level = 32 },
	Duskflit  = { Name = "ShadowBat",  Level = 16 },
	ShadowBat = { Name = "Nightwing",  Level = 32 },
}

PetStats.MaxLevel = 100

local function baseOf(petName)
	local base = PetStats.Base[petName]
	assert(base, "[PetStats] unknown pet: " .. tostring(petName))
	return base
end

--- Cumulative XP needed to REACH a level. Level 1 costs 0.
function PetStats.XPForLevel(level)
	level = math.clamp(math.floor(level or 1), 1, PetStats.MaxLevel)
	return math.floor(20 * (level - 1) * (level - 1))
end

--- Level for a cumulative XP total.
function PetStats.LevelForXP(xp)
	xp = math.max(0, xp or 0)
	local level = math.floor(math.sqrt(xp / 20)) + 1
	return math.clamp(level, 1, PetStats.MaxLevel)
end

--- XP awarded to the winner: scales with the loser's level, with a small
--- bonus for beating something stronger than you.
function PetStats.XPGain(winnerLevel, loserLevel)
	winnerLevel = math.max(1, winnerLevel or 1)
	loserLevel = math.max(1, loserLevel or 1)
	local underdog = math.max(0, loserLevel - winnerLevel)
	return math.floor(60 * loserLevel * (1 + underdog * 0.05) + 40)
end

--- One stat scaled by level: +2% of base per level above 1.
local function statAt(base, level)
	return math.floor(base * (1 + 0.02 * (level - 1)))
end

--- Max HP for a pet at a level. Pass this as config.MaxHP to PetBattle.Spawn.
function PetStats.MaxHPAt(petName, level)
	level = math.clamp(math.floor(level or 1), 1, PetStats.MaxLevel)
	return statAt(baseOf(petName).HP, level)
end

--- Full stat block for a pet at a level. Store it on the pet object
--- (pet.Stats) alongside PetBattle's HP tracking.
function PetStats.AtLevel(petName, level)
	local base = baseOf(petName)
	level = math.clamp(math.floor(level or 1), 1, PetStats.MaxLevel)
	return {
		Name = petName,
		Type = base.Type,
		Level = level,
		XP = PetStats.XPForLevel(level),
		HP = statAt(base.HP, level),
		Attack = statAt(base.Attack, level),
		Defense = statAt(base.Defense, level),
		Speed = statAt(base.Speed, level),
	}
end

--- Next evolution for a pet: { Name, Level } or nil for final forms.
function PetStats.NextEvolution(petName)
	baseOf(petName) -- validates the name even for finals
	return PetStats.Evolutions[petName]
end

--- Damage for one attack. Uses the attacker's Attack vs the defender's
--- Defense, same-type attack bonus (1.5x), the type chart, and a small
--- random variance (0.85x-1.15x). Minimum 1.
-- @param atkStats table from AtLevel (attacker)
-- @param defStats table from AtLevel (defender)
-- @param animName "AttackMelee" (power 40) or "AttackRanged" (power 55)
function PetStats.CalcDamage(atkStats, defStats, animName)
	assert(atkStats and atkStats.Attack, "[PetStats] attacker stats missing")
	assert(defStats and defStats.Defense, "[PetStats] defender stats missing")
	local power = (animName == "AttackRanged") and 55 or 40
	local stab = 1.5 -- pets always attack with their own element
	local eff = PetStats.Chart[atkStats.Type][defStats.Type] or 1
	local variance = 0.85 + math.random() * 0.30
	local raw = power * (atkStats.Attack / math.max(1, defStats.Defense))
		* stab * eff * variance
	return math.max(1, math.floor(raw))
end

return PetStats

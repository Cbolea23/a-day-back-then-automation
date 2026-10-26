-- PetAnimAudit.luau
-- One-command audit for the 60 pet animation asset IDs in PetAnimations.luau.
-- Run it in Studio AFTER the 60 IDs are pasted in. It catches the mistakes
-- that hurt most after 60 publishes:
--   1. empty slots (ID still 0 / never pasted)
--   2. duplicated IDs (same asset pasted into two slots by accident)
--   3. IDs that point to a real asset that ISN'T an Animation
--   4. animations published by the WRONG creator (account/group) — these load
--      fine in Studio play-tests but silently fail in the live game, because
--      Roblox only plays animations uploaded by the experience's owner.
--
-- HOW TO USE (in Roblox Studio, command bar):
--   1. Put this ModuleScript in ReplicatedStorage next to PetAnimations.
--   2. Open the actual game place (not an empty baseplate — the ownership
--      check compares against THIS place's owner).
--   3. In the command bar, run:
--        local Audit = require(game.ReplicatedStorage.PetAnimAudit)
--        Audit.Run()
--   4. Read the printed report. Fix anything flagged, then re-run.
--
-- It needs internet from Studio (it has it whenever publishing works).
-- ~60 lookups take about half a minute; it pauses briefly every 10 calls
-- to stay polite to the API.

local MarketplaceService = game:GetService("MarketplaceService")
local PetAnims = require(script.Parent.PetAnimations)

local PetAnimAudit = {}

-- Canonical value from the enum, not a magic number: stays correct even if
-- Roblox renumbers asset types.
local ANIM_ASSET_TYPE_ID = Enum.AssetType.Animation.Value

local function toIdNumber(slotValue)
	local n = slotValue and tostring(slotValue):match("(%d+)")
	return n and tonumber(n) or nil
end

function PetAnimAudit.Run()
	local wantType = game.CreatorType.Name -- "User" or "Group"
	local ownerId = game.CreatorId
	local skipOwnership = (ownerId == 0)

	local results = { ok = true, problems = {} }
	local seen = {} -- idNumber -> "Pet_Anim" first seen in

	local function problem(msg)
		results.ok = false
		table.insert(results.problems, msg)
	end

	print("=== PetAnimAudit: checking 60 animation slots ===")
	if skipOwnership then
		print("NOTE: this place isn't saved to Roblox yet (CreatorId 0), so the")
		print("ownership check is skipped. Run this from your real game place.")
	end

	local checked, lookups = 0, 0
	for petName, slots in pairs(PetAnims.Pets) do
		for _, animName in ipairs(PetAnims.Anims) do
			local slot = ("%s_%s"):format(petName, animName)
			checked += 1
			local idNum = toIdNumber(slots[animName])

			if not idNum then
				problem(("EMPTY SLOT: %s has no asset ID pasted yet"):format(slot))
			else
				if seen[idNum] then
					problem(("DUPLICATE ID: %s and %s share ID %d (paste slip?)"):format(seen[idNum], slot, idNum))
				else
					seen[idNum] = slot
				end

				local okInfo, info = pcall(MarketplaceService.GetProductInfo, MarketplaceService, idNum, Enum.InfoType.Asset)
				lookups += 1
				if lookups % 10 == 0 then task.wait(1) end

				if not okInfo or not info then
					problem(("BAD ID: %s -> %d doesn't resolve to a Roblox asset"):format(slot, idNum))
				else
					if info.AssetTypeId ~= ANIM_ASSET_TYPE_ID then
						problem(("WRONG TYPE: %s -> %d is asset type %s, not an Animation"):format(slot, idNum, tostring(info.AssetTypeId)))
					end
					if not skipOwnership then
						local c = info.Creator or {}
						local cType = c.CreatorType
						if typeof(cType) == "EnumItem" then cType = cType.Name end
						if cType ~= wantType or c.CreatorTargetId ~= ownerId then
							problem(("OWNER MISMATCH: %s -> %d was published by %s %s, but this game is owned by %s %d. It will silently fail in the live game — re-publish it under the game's owner."):format(
								slot, idNum, tostring(c.CreatorType), tostring(c.CreatorTargetId), wantType, ownerId))
						end
					end
				end
			end
		end
	end

	print(("--- %d slots checked ---"):format(checked))
	if results.ok then
		print("ALL CLEAR — 60/60 IDs filled, unique, real Animations, and published by this game's owner.")
	else
		print(("%d problem(s) found:"):format(#results.problems))
		for _, msg in ipairs(results.problems) do
			print("  x " .. msg)
		end
		print("Fix the flagged slots and re-run Audit.Run().")
	end
	return results
end

return PetAnimAudit

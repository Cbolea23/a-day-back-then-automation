#!/usr/bin/env python3
"""fill_registry.py — turn the filled pet_import_tracker.md into the
PetAnimations.luau Pets table, so 60 asset IDs don't need hand-pasting.

USAGE:
    python3 fill_registry.py pet_import_tracker.md > pets_table.txt

Then replace the `PetAnimations.Pets = { ... }` block in PetAnimations.luau
with the emitted block (the header, group comments and alignment are
preserved), or copy/paste individual lines.

ID cells may contain bare numbers (123456) or full URLs
(rbxassetid://123456). Unknown pet/animation names and duplicate entries
are reported as warnings; missing IDs keep A(0).
"""

import re
import sys

# Canonical pet order + evolution stage, matching PetAnimations.luau
PETS = [
    ("Cinderpup", "baby", "Fire"), ("EmberFox", "mid", "Fire"), ("Infernox", "final", "Fire"),
    ("Bublet", "baby", "Water"), ("AquaTurtle", "mid", "Water"), ("Tidalord", "final", "Water"),
    ("Pebblit", "baby", "Earth"), ("SproutGolem", "mid", "Earth"), ("Terratitan", "final", "Earth"),
    ("Voltkit", "baby", "Electric"), ("VoltBunny", "mid", "Electric"), ("Stormhare", "final", "Electric"),
    ("Duskflit", "baby", "Dark"), ("ShadowBat", "mid", "Dark"), ("Nightwing", "final", "Dark"),
]
ANIMS = ["Idle", "Walk", "AttackMelee", "AttackRanged"]
CANON = {(p, a) for p, _, _ in PETS for a in ANIMS}
GROUPS = [
    ("Fire", "Fire line"),
    ("Water", "Water line"),
    ("Earth", "Earth line"),
    ("Electric", "Electric line"),
    ("Dark", "Shadow line"),
]


def parse_tracker(text):
    ids, warnings, seen = {}, [], set()
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("|") or line.count("|") < 6:
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        pet, anim, asset = cells[0], cells[1], cells[-1]
        if set(cells[0]) <= set("-:") or pet == "Pet":  # separator / header row
            continue
        if (pet, anim) not in CANON:
            warnings.append(f"unknown row ignored: {pet} / {anim}")
            continue
        if (pet, anim) in seen:
            warnings.append(f"duplicate row ignored: {pet}_{anim}")
            continue
        seen.add((pet, anim))
        m = re.search(r"\d+", asset)
        if m:
            ids[(pet, anim)] = m.group(0)
    return ids, warnings


def main():
    src = open(sys.argv[1], encoding="utf-8").read() if len(sys.argv) > 1 \
        else sys.stdin.read()
    ids, warnings = parse_tracker(src)

    out = ["PetAnimations.Pets = {"]
    for group, label in GROUPS:
        out.append(f"\t-- {label}")
        for pet, stage, g in PETS:
            if g != group:
                continue
            slots = ", ".join(f"{a} = A({ids.get((pet, a), 0)})" for a in ANIMS)
            out.append(f"\t{pet:<11}= {{ {slots} }}, -- {stage}")
    out.append("}")

    filled = len(ids)
    sys.stdout.write("\n".join(out) + "\n")
    sys.stderr.write(f"\nfilled {filled}/60 asset IDs\n")
    if warnings:
        sys.stderr.write("warnings:\n" + "\n".join("  - " + w for w in warnings) + "\n")
    missing = [(p, a) for p, _, _ in PETS for a in ANIMS if (p, a) not in ids]
    if missing:
        sys.stderr.write("missing: " + ", ".join(f"{p}_{a}" for p, a in missing) + "\n")


if __name__ == "__main__":
    main()

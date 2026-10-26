"""
BAKUNAWA LINE - 3 RIGGED low-poly PETS for Roblox (Filipino-myth moon serpent)
================================================================================
Built on the exact framework of pet_pack.py (same Pet builder class, armature
layout, action helpers, FBX-per-animation export and texture baking), with one
new evolution line added:

  BakunawaHatchling (Baby)  - small cute coiled serpent, big eyes, tiny horns,
                              moon-white belly, deep blue-purple scales.
  BakunawaSerpent   (Mid)   - longer serpent, crescent horns, fins, glowing
                              moon markings.
  BakunawaEclipse   (Final) - large majestic dragon-serpent, big crescent-moon
                              horns, dorsal fins, a glowing moon orb hovering
                              between its horns.

Each pet is ONE mesh bound to an armature and comes with 4 keyframed actions:
  <Name>_Idle / <Name>_Walk / <Name>_AttackMelee / <Name>_AttackRanged

  AttackMelee  = lunge + bite (same as the other pet lines).
  AttackRanged = rear up and fire a moon orb / lunar blast from the
                 "Projectile" bone (hidden, scale 0, in every other action).
  Walk         = a serpent slither (body/head/tail counter-sway), since this
                 line has no legs.

Bone/action conventions match pet_pack.py exactly, so the existing
PetAnimations registry pattern applies unchanged.

Scale:  1 Blender unit = 1 Roblox stud. Finals are bigger than the ~2-stud
mid forms; BakunawaEclipse is deliberately grand (~2.8 studs to the horn tips).

Colors in Roblox: Roblox ignores Blender material colors on FBX import, so
BAKE_TEXTURES bakes diffuse+emissive PNGs per pet; set them as the MeshPart's
TextureID (and the emissive PNG in a SurfaceAppearance EmissiveMap slot for
the glowing moon parts).

AUTO_EXPORT and BAKE_TEXTURES are ON: running this script headless writes
12 FBX files + 6 texture PNGs into EXPORT_DIR.
"""

import bpy
import math
import os

CLEAR_SCENE = False
ROOT_NAME = "Bakunawa_Line"
AUTO_EXPORT = True    # write 12 FBX files (3 pets x 4 anims)
BAKE_TEXTURES = True  # bake diffuse+emissive PNG textures per pet
TEX_SIZE = 512        # texture resolution for the bakes
FACING = 1            # pets face +Y; set -1 if you prefer -Y
EXPORT_DIR = "/home/hatch/workspace/goals/low-poly-roblox-game-assets/files/mythic-pets/bakunawa-line"


# ---------------------------------------------------------------- palette
# (base colour, emission colour or None, emission strength)
PAL = {
    "fox":       ((0.91, 0.51, 0.23), None, 0),
    "fox_dark":  ((0.48, 0.29, 0.13), None, 0),
    "cream":     ((0.96, 0.90, 0.78), None, 0),
    "fire":      ((0.95, 0.35, 0.10), (1.0, 0.35, 0.05), 3.0),
    "turtle":    ((0.31, 0.64, 0.64), None, 0),
    "shell":     ((0.24, 0.48, 0.31), None, 0),
    "water":     ((0.30, 0.60, 1.00), (0.30, 0.60, 1.00), 2.5),
    "rock":      ((0.54, 0.50, 0.45), None, 0),
    "rock_dark": ((0.36, 0.33, 0.29), None, 0),
    "moss":      ((0.37, 0.66, 0.31), None, 0),
    "leaf":      ((0.30, 0.70, 0.30), (0.30, 0.80, 0.30), 1.2),
    "bunny":     ((0.96, 0.84, 0.34), None, 0),
    "pink":      ((0.96, 0.66, 0.72), None, 0),
    "spark":     ((1.00, 0.91, 0.30), (1.00, 0.90, 0.25), 3.5),
    "bat":       ((0.42, 0.31, 0.62), None, 0),
    "bat_dark":  ((0.31, 0.21, 0.45), None, 0),
    "eyered":    ((0.70, 0.10, 0.10), (1.00, 0.15, 0.10), 2.5),
    "shadow":    ((0.45, 0.25, 0.80), (0.55, 0.30, 1.00), 3.0),
    "dark":      ((0.12, 0.12, 0.14), None, 0),
    # --- Bakunawa line (deep blue-purple scales, moon-white belly, lunar glow)
    "moonshade":      ((0.23, 0.20, 0.45), None, 0),
    "moonshade_dark": ((0.14, 0.12, 0.31), None, 0),
    "moonbelly":      ((0.92, 0.93, 0.98), None, 0),
    "horn":           ((0.90, 0.88, 0.80), None, 0),
    "moon":           ((0.95, 0.97, 1.00), (0.85, 0.90, 1.00), 3.0),
    "mooney":         ((0.70, 0.82, 1.00), (0.70, 0.85, 1.00), 2.5),
    "fin":            ((0.55, 0.75, 0.95), (0.40, 0.60, 0.90), 1.2),
}

_MATS = {}


def mat(name):
    if name in _MATS:
        return _MATS[name]
    if name in bpy.data.materials:
        _MATS[name] = bpy.data.materials[name]
        return _MATS[name]
    base, emission, strength = PAL[name]
    m = bpy.data.materials.new(name=name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*base, 1.0)
        try:
            bsdf.inputs["Roughness"].default_value = 0.9
        except KeyError:
            pass
        if emission is not None:
            try:
                bsdf.inputs["Emission Color"].default_value = (*emission, 1.0)
                bsdf.inputs["Emission Strength"].default_value = strength
            except KeyError:
                pass
    _MATS[name] = m
    return m


# ---------------------------------------------------------------- small helpers
def _world(loc, origin):
    return (origin[0] + loc[0] * 1, origin[1] + loc[1] * FACING, origin[2] + loc[2])


def shade_flat(obj):
    for p in obj.data.polygons:
        p.use_smooth = False


def make_empty(name, loc, coll):
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=loc)
    e = bpy.context.active_object
    e.name = name
    for c in list(e.users_collection):
        c.objects.unlink(e)
    coll.objects.link(e)
    bpy.context.view_layer.update()
    bpy.ops.object.select_all(action="DESELECT")
    return e


# ---------------------------------------------------------------- armature
def build_armature(name, origin, coll, spec, s=1.0):
    """spec: dict with 'legs' [(bone, hip, foot)], 'ears' bool, 'wings' bool.
    s: overall scale (used for baby/final evolution sizes)."""
    bpy.ops.object.armature_add(enter_editmode=True, location=origin)
    arm = bpy.context.active_object
    arm.name = name
    adata = arm.data
    adata.name = name + "_Data"
    for eb in adata.edit_bones:
        adata.edit_bones.remove(eb)

    def bone(bname, head, tail, parent=None):
        eb = adata.edit_bones.new(bname)
        eb.head = (head[0] * s, head[1] * FACING * s, head[2] * s)
        eb.tail = (tail[0] * s, tail[1] * FACING * s, tail[2] * s)
        if parent:
            eb.parent = adata.edit_bones[parent]
        return eb

    # Note: Root points forward (+Y) so that animating its *location* uses
    # intuitive axes: loc.x = sideways, loc.y = forward/back, loc.z = up/down.
    # (Pose-bone location is in the bone's local space.)
    bone("Root", (0, -0.10, 0.60), (0, 0.10, 0.60))
    bone("Body", (0, -0.30, 0.74), (0, 0.30, 0.80), "Root")
    bone("Head", (0, 0.30, 0.80), (0, 0.52, 1.04), "Body")
    bone("Jaw", (0, 0.42, 0.92), (0, 0.62, 0.86), "Head")
    bone("Tail", (0, -0.30, 0.80), (0, -0.62, 0.96), "Body")
    if spec.get("ears"):
        bone("EarL", (0.12, 0.42, 1.12), (0.16, 0.44, 1.40), "Head")
        bone("EarR", (-0.12, 0.42, 1.12), (-0.16, 0.44, 1.40), "Head")
    for bname, hip, foot in spec["legs"]:
        bone(bname, hip, foot, "Root")
    if spec.get("wings"):
        bone("WingL", (0.22, 0.05, 0.82), (0.72, -0.05, 0.88), "Body")
        bone("WingR", (-0.22, 0.05, 0.82), (-0.72, -0.05, 0.88), "Body")
    # Projectile bone points forward (+Y) for the same reason: its location
    # keys fly it forward (loc.y) and up (loc.z) in intuitive axes.
    bone("Projectile", (0, 0.58, 1.00), (0, 0.78, 1.00), "Head")

    bpy.ops.object.mode_set(mode="OBJECT")
    # Pose bones default to quaternion rotation, but every animation in this
    # script keys rotation_euler. Leave them on quaternion and the rotation
    # keys are silently ignored (only location/scale would animate).
    for pb in arm.pose.bones:
        pb.rotation_mode = "XYZ"
    for c in list(arm.users_collection):
        c.objects.unlink(arm)
    coll.objects.link(arm)
    bpy.context.view_layer.update()
    bpy.ops.object.select_all(action="DESELECT")
    # hide the projectile by default
    arm.pose.bones["Projectile"].scale = (0, 0, 0)
    bpy.context.view_layer.update()
    return arm


# ---------------------------------------------------------------- mesh parts (rigid skinning)
class PartBuilder:
    def __init__(self, coll, origin, s=1.0):
        self.coll = coll
        self.origin = origin
        self.s = s
        self.parts = []

    def _p(self, loc):
        """Scale a pet-local position by the evolution scale factor."""
        return (loc[0] * self.s, loc[1] * self.s, loc[2] * self.s)

    def _finish(self, obj, name, bone):
        obj.name = name
        for c in list(obj.users_collection):
            c.objects.unlink(obj)
        self.coll.objects.link(obj)
        vg = obj.vertex_groups.new(name=bone)
        vg.add([v.index for v in obj.data.vertices], 1.0, "REPLACE")
        if obj.type == "MESH":
            shade_flat(obj)
        bpy.ops.object.select_all(action="DESELECT")
        self.parts.append(obj)
        return obj

    def box(self, name, loc, dims, material, bone, rotation=None):
        bpy.ops.mesh.primitive_cube_add(size=1, location=_world(self._p(loc), self.origin))
        obj = bpy.context.active_object
        obj.dimensions = (dims[0] * self.s, dims[1] * self.s, dims[2] * self.s)
        if rotation:
            obj.rotation_euler = rotation
        obj.data.materials.append(mat(material))
        return self._finish(obj, name, bone)

    def sphere(self, name, loc, radius, material, bone, scale=(1, 1, 1)):
        r = radius * self.s
        bpy.ops.mesh.primitive_uv_sphere_add(segments=10, ring_count=8, radius=r,
                                             location=_world(self._p(loc), self.origin))
        obj = bpy.context.active_object
        obj.dimensions = (r * 2 * scale[0], r * 2 * scale[1], r * 2 * scale[2])
        obj.data.materials.append(mat(material))
        return self._finish(obj, name, bone)

    def ico(self, name, loc, radius, material, bone, scale=(1, 1, 1)):
        r = radius * self.s
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r,
                                              location=_world(self._p(loc), self.origin))
        obj = bpy.context.active_object
        obj.dimensions = (r * 2 * scale[0], r * 2 * scale[1], r * 2 * scale[2])
        obj.data.materials.append(mat(material))
        return self._finish(obj, name, bone)

    def cone(self, name, loc, radius, depth, verts, material, bone, rotation=None):
        bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=radius * self.s,
                                        depth=depth * self.s,
                                        location=_world(self._p(loc), self.origin))
        obj = bpy.context.active_object
        if rotation:
            obj.rotation_euler = rotation
        obj.data.materials.append(mat(material))
        return self._finish(obj, name, bone)

    def cyl(self, name, loc, radius, depth, verts, material, bone, rotation=None):
        bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius * self.s,
                                            depth=depth * self.s,
                                            location=_world(self._p(loc), self.origin))
        obj = bpy.context.active_object
        if rotation:
            obj.rotation_euler = rotation
        obj.data.materials.append(mat(material))
        return self._finish(obj, name, bone)

    def finalize(self, arm, mesh_name):
        bpy.ops.object.select_all(action="DESELECT")
        for o in self.parts:
            o.select_set(True)
        bpy.context.view_layer.objects.active = self.parts[0]
        bpy.ops.object.join()
        mesh = bpy.context.active_object
        mesh.name = mesh_name
        mod = mesh.modifiers.new("Armature", "ARMATURE")
        mod.object = arm
        bpy.ops.object.select_all(action="DESELECT")
        return mesh


QUAD_LEGS = [
    ("LegFL", (0.20, 0.28, 0.55), (0.20, 0.28, 0.06)),
    ("LegFR", (-0.20, 0.28, 0.55), (-0.20, 0.28, 0.06)),
    ("LegBL", (0.20, -0.28, 0.55), (0.20, -0.28, 0.06)),
    ("LegBR", (-0.20, -0.28, 0.55), (-0.20, -0.28, 0.06)),
]
BAT_LEGS = [
    ("LegBL", (0.15, -0.25, 0.48), (0.15, -0.25, 0.06)),
    ("LegBR", (-0.15, -0.25, 0.48), (-0.15, -0.25, 0.06)),
]


# ---------------------------------------------------------------- pet builder
def pet_bakunawa(coll, origin, stage, tag):
    """Moon serpent line. No legs: the body is a ground coil (Root), a rising
    neck (Body), the head (Head/Jaw), and a tail that curls up behind the coil
    (Tail). The hatchling's tiny horns ride the Ear bones so the idle ear
    twitch animates them; later stages bind their crescent horns to Head."""
    S = BSTAGE_SCALE[stage]
    baby, mid, final = stage == 0, stage == 1, stage == 2
    eye_mul = 1.55 if baby else 1.0      # big cute baby eyes
    proj_r = (0.12, 0.16, 0.22)[stage]   # moon-orb projectile grows per stage
    arm = build_armature(f"{tag}_Rig", origin, coll,
                         {"legs": [], "ears": baby}, S)
    P = PartBuilder(coll, origin, S)

    if baby:
        # ---- BakunawaHatchling: small cute coiled serpent
        P.sphere("coil", (0, -0.02, 0.24), 0.44, "moonshade", "Root",
                 scale=(1, 1, 0.5))
        P.sphere("coil_top", (0, -0.02, 0.38), 0.34, "moonshade_dark", "Root",
                 scale=(1, 1, 0.5))
        P.sphere("belly", (0, 0.22, 0.28), 0.30, "moonbelly", "Root",
                 scale=(0.8, 0.6, 0.55))
        P.sphere("neck", (0, 0.10, 0.62), 0.26, "moonshade", "Body",
                 scale=(1, 1, 1.25))
        P.sphere("head", (0, 0.34, 1.00), 0.30, "moonshade", "Head")
        P.sphere("snout", (0, 0.55, 0.94), 0.16, "moonbelly", "Head",
                 scale=(1, 0.8, 0.8))
        P.box("jaw", (0, 0.50, 0.82), (0.26, 0.24, 0.10), "moonshade_dark", "Jaw")
        for s in (1, -1):
            P.sphere(f"eye_{s}", (s * 0.15, 0.52, 1.06), 0.075 * eye_mul,
                     "dark", "Head")
            P.sphere(f"glint_{s}", (s * 0.17, 0.56, 1.12), 0.035, "moon", "Head")
            # tiny horns on the Ear bones (idle twitch animates them)
            P.cone(f"horn_{s}", (s * 0.15, 0.30, 1.32), 0.06, 0.16, 5, "horn",
                   f"Ear{'L' if s > 0 else 'R'}", rotation=(0.3, 0, s * -0.25))
            P.ico(f"mark_{s}", (s * 0.40, 0.05, 0.28), 0.05, "moon", "Root")
        P.sphere("tailtip", (0, -0.50, 0.45), 0.12, "moonshade", "Tail")
        P.sphere("tailglow", (0, -0.56, 0.58), 0.07, "moon", "Tail")

    elif mid:
        # ---- BakunawaSerpent: longer body, crescent horns, fins, moon marks
        P.sphere("coil", (0, -0.02, 0.24), 0.50, "moonshade", "Root",
                 scale=(1.05, 1, 0.5))
        P.sphere("coil2", (0.02, -0.04, 0.42), 0.38, "moonshade_dark", "Root",
                 scale=(1, 1, 0.5))
        P.sphere("belly", (0, 0.26, 0.30), 0.34, "moonbelly", "Root",
                 scale=(0.85, 0.6, 0.6))
        P.sphere("neck1", (0, 0.08, 0.66), 0.30, "moonshade", "Body",
                 scale=(1, 1, 1.3))
        P.sphere("neck2", (0, 0.16, 0.92), 0.26, "moonshade", "Body",
                 scale=(1, 1, 1.2))
        P.sphere("head", (0, 0.36, 1.14), 0.27, "moonshade", "Head",
                 scale=(1, 1.1, 0.95))
        P.sphere("snout", (0, 0.58, 1.08), 0.14, "moonbelly", "Head",
                 scale=(1, 0.85, 0.8))
        P.box("jaw", (0, 0.52, 0.96), (0.24, 0.24, 0.10), "moonshade_dark", "Jaw")
        for s in (1, -1):
            P.sphere(f"eye_{s}", (s * 0.14, 0.52, 1.20), 0.07, "mooney", "Head")
            # crescent horns: two cone segments arcing back and out
            P.cone(f"horn1_{s}", (s * 0.17, 0.28, 1.38), 0.09, 0.34, 5, "horn",
                   "Head", rotation=(0.5, 0, s * -0.5))
            P.cone(f"horn2_{s}", (s * 0.26, 0.22, 1.52), 0.06, 0.26, 5, "horn",
                   "Head", rotation=(1.1, 0, s * -0.9))
            P.box(f"sidefin_{s}", (s * 0.28, 0.10, 0.80), (0.30, 0.06, 0.20),
                  "fin", "Body")
            P.ico(f"markcoil_{s}", (s * 0.46, 0.08, 0.30), 0.05, "moon", "Root")
            P.ico(f"markneck_{s}", (s * 0.19, 0.31, 0.75), 0.05, "moon", "Body")
        # dorsal fins down the neck
        P.box("dorsal1", (0, -0.05, 1.00), (0.05, 0.30, 0.34), "fin", "Body",
              rotation=(0.3, 0, 0))
        P.box("dorsal2", (0, -0.10, 0.72), (0.05, 0.26, 0.28), "fin", "Body",
              rotation=(0.3, 0, 0))
        # tail curling up behind the coil, with a fin and a glowing tip
        P.sphere("tail", (0, -0.52, 0.55), 0.16, "moonshade", "Tail",
                 scale=(0.8, 1.3, 0.8))
        P.box("tailfin", (0, -0.72, 0.66), (0.05, 0.30, 0.30), "fin", "Tail")
        P.ico("tailtip", (0, -0.78, 0.72), 0.06, "moon", "Tail")

    else:
        # ---- BakunawaEclipse: big majestic dragon-serpent with a moon orb
        P.sphere("coil", (0, -0.02, 0.27), 0.56, "moonshade", "Root",
                 scale=(1.1, 1, 0.5))
        P.sphere("coil2", (0, -0.03, 0.48), 0.44, "moonshade_dark", "Root",
                 scale=(1, 1, 0.5))
        P.sphere("coil3", (0, 0.0, 0.64), 0.32, "moonshade", "Root",
                 scale=(1, 1, 0.55))
        P.sphere("belly", (0, 0.30, 0.34), 0.38, "moonbelly", "Root",
                 scale=(0.85, 0.6, 0.6))
        P.sphere("neck1", (0, 0.08, 0.80), 0.32, "moonshade", "Body",
                 scale=(1, 1, 1.35))
        P.sphere("neck2", (0, 0.18, 1.06), 0.28, "moonshade", "Body",
                 scale=(1, 1, 1.2))
        P.sphere("head", (0, 0.38, 1.26), 0.29, "moonshade", "Head",
                 scale=(1, 1.1, 0.95))
        P.box("brow", (0, 0.52, 1.36), (0.44, 0.12, 0.12), "moonshade_dark", "Head")
        P.sphere("snout", (0, 0.62, 1.20), 0.15, "moonbelly", "Head",
                 scale=(1, 0.85, 0.8))
        P.box("jaw", (0, 0.56, 1.08), (0.26, 0.26, 0.11), "moonshade_dark", "Jaw")
        # glowing crescent-moon marking on the forehead
        P.ico("forehead", (0, 0.60, 1.38), 0.07, "moon", "Head", scale=(1, 0.4, 1))
        # the glowing moon orb, hovering between the horns
        P.sphere("orb", (0, 0.30, 1.62), 0.13, "moon", "Head")
        for s in (1, -1):
            P.sphere(f"eye_{s}", (s * 0.15, 0.56, 1.32), 0.075, "mooney", "Head")
            # small kid-friendly fangs pointing down from the upper jaw
            P.cone(f"fang_{s}", (s * 0.08, 0.64, 1.06), 0.035, 0.10, 4, "horn",
                   "Head", rotation=(math.pi, 0, 0))
            # big crescent horns: three cone segments sweeping back
            P.cone(f"horn1_{s}", (s * 0.19, 0.30, 1.52), 0.11, 0.42, 5, "horn",
                   "Head", rotation=(0.5, 0, s * -0.5))
            P.cone(f"horn2_{s}", (s * 0.30, 0.24, 1.68), 0.085, 0.36, 5, "horn",
                   "Head", rotation=(1.0, 0, s * -0.85))
            P.cone(f"horn3_{s}", (s * 0.42, 0.16, 1.78), 0.055, 0.30, 5, "horn",
                   "Head", rotation=(1.5, 0, s * -1.15))
            P.box(f"sidefin_{s}", (s * 0.34, 0.12, 0.95), (0.42, 0.06, 0.26),
                  "fin", "Body")
            P.ico(f"markcoil_{s}", (s * 0.52, 0.10, 0.34), 0.055, "moon", "Root")
            P.ico(f"markneck_{s}", (s * 0.22, 0.33, 0.90), 0.055, "moon", "Body")
        # dorsal fin crest down the neck
        for i, (y, z, d) in enumerate(((-0.06, 1.14, 0.42), (-0.10, 0.86, 0.36),
                                       (-0.08, 0.60, 0.30))):
            P.box(f"dorsal_{i}", (0, y, z), (0.05, 0.32, d), "fin", "Body",
                  rotation=(0.3, 0, 0))
        # tail rising behind the coil, finned, with a glowing moon tip
        P.sphere("tail", (0, -0.55, 0.60), 0.18, "moonshade", "Tail",
                 scale=(0.8, 1.35, 0.8))
        P.box("tailfin", (0, -0.78, 0.74), (0.06, 0.36, 0.36), "fin", "Tail")
        P.sphere("tailtip", (0, -0.86, 0.82), 0.09, "moon", "Tail")

    P.ico("proj", (0, 0.58, 1.00), proj_r, "moon", "Projectile")
    mesh = P.finalize(arm, tag)
    return arm, mesh


# ---------------------------------------------------------------- evolutions
# Stage scale: hatchling small, serpent classic size, eclipse deliberately
# grander than the pet_pack.py final multiplier (1.32) at 1.55.
BSTAGE_SCALE = (0.70, 1.05, 1.55)

EVOLUTIONS = [
    # (species, (baby name, mid name, final name), builder, flyer)
    ("Bakunawa", ("BakunawaHatchling", "BakunawaSerpent", "BakunawaEclipse"),
     pet_bakunawa, False),
]


# ---------------------------------------------------------------- animation
def make_action(arm, name):
    act = bpy.data.actions.new(name=name)
    if not arm.animation_data:
        arm.animation_data_create()
    arm.animation_data.action = act
    return act


def K(arm, bone, frame, rot=None, loc=None, scl=None):
    if bone not in arm.pose.bones:
        return
    pb = arm.pose.bones[bone]
    if rot is not None:
        pb.rotation_euler = rot
        pb.keyframe_insert("rotation_euler", frame=frame)
    if loc is not None:
        pb.location = loc
        pb.keyframe_insert("location", frame=frame)
    if scl is not None:
        pb.scale = scl
        pb.keyframe_insert("scale", frame=frame)


def reset_pose(arm):
    for pb in arm.pose.bones:
        pb.rotation_euler = (0, 0, 0)
        pb.location = (0, 0, 0)
        pb.scale = (1, 1, 1)
    arm.pose.bones["Projectile"].scale = (0, 0, 0)


def _iter_action_fcurves(act):
    """Yield every fcurve in an action, on Blender 4.x and 5.x.

    Blender 5.0 replaced the flat Action.fcurves collection with layered
    actions, where fcurves live inside each keyframe strip's channelbags.
    """
    legacy = getattr(act, "fcurves", None)
    if legacy is not None:
        yield from legacy
        return
    for layer in act.layers:
        for strip in layer.strips:
            for cb in strip.channelbags:
                yield from cb.fcurves


def set_linear(act):
    for fc in _iter_action_fcurves(act):
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"


def anim_idle(arm, tag, flyer):
    act = make_action(arm, f"{tag}_Idle")
    reset_pose(arm)
    for f, z in ((1, 0), (15, 0.05), (30, 0), (45, 0.05), (60, 0)):
        K(arm, "Body", f, loc=(0, 0, z))
    for f, rz in ((1, 0), (20, 0.10), (40, -0.10), (60, 0)):
        K(arm, "Head", f, rot=(0, 0, rz))
    K(arm, "Head", 30, rot=(-0.06, 0, 0))
    for f, ry in ((1, 0), (15, 0.35), (45, -0.35), (60, 0)):
        K(arm, "Tail", f, rot=(0, ry, 0))
    for e in ("EarL", "EarR"):
        K(arm, e, 28, rot=(0, 0, 0)); K(arm, e, 32, rot=(-0.25, 0, 0)); K(arm, e, 38, rot=(0, 0, 0))
    if flyer:
        for f, a in ((1, 0), (30, 0.35), (60, 0)):
            K(arm, "WingL", f, rot=(a, 0, 0)); K(arm, "WingR", f, rot=(a, 0, 0))
    K(arm, "Projectile", 1, scl=(0, 0, 0))
    K(arm, "Projectile", 60, scl=(0, 0, 0))
    return act, 60


def anim_walk_serpent(arm, tag, flyer):
    """Slither: body sways side to side, head counter-sways, tail sweeps
    opposite - the whole line reads as an undulating serpent glide."""
    act = make_action(arm, f"{tag}_Walk")
    reset_pose(arm)
    for f, rz in ((1, 0.16), (9, -0.16), (17, 0.16), (25, -0.16), (33, 0.16)):
        K(arm, "Body", f, rot=(0, 0, rz))
    for f, rz in ((1, -0.12), (9, 0.12), (17, -0.12), (25, 0.12), (33, -0.12)):
        K(arm, "Head", f, rot=(0, 0, rz))
    for f, ry in ((1, -0.30), (9, 0.30), (17, -0.30), (25, 0.30), (33, -0.30)):
        K(arm, "Tail", f, rot=(0, ry, 0))
    for f, z in ((1, 0.03), (9, -0.02), (17, 0.03), (25, -0.02), (33, 0.03)):
        K(arm, "Body", f, loc=(0, 0, z))
    K(arm, "Projectile", 1, scl=(0, 0, 0))
    K(arm, "Projectile", 33, scl=(0, 0, 0))
    set_linear(act)
    return act, 32


def anim_walk(arm, tag, flyer):
    # This line has no legs, so its Walk is the serpent slither above.
    return anim_walk_serpent(arm, tag, flyer)


def anim_melee(arm, tag, flyer):
    act = make_action(arm, f"{tag}_AttackMelee")
    reset_pose(arm)
    # anticipation 1-6
    K(arm, "Root", 1, loc=(0, 0, 0)); K(arm, "Root", 6, loc=(0, -0.15, -0.08))
    K(arm, "Body", 1, rot=(0, 0, 0)); K(arm, "Body", 6, rot=(0.18, 0, 0))
    K(arm, "Head", 1, rot=(0, 0, 0)); K(arm, "Head", 6, rot=(0.30, 0, 0))
    K(arm, "Jaw", 1, rot=(0, 0, 0))
    # strike 7-12 : lunge + snap down + bite
    K(arm, "Root", 10, loc=(0, 0.55, 0))
    K(arm, "Body", 10, rot=(-0.35, 0, 0))
    K(arm, "Head", 10, rot=(-0.55, 0, 0))
    K(arm, "Jaw", 8, rot=(-0.65, 0, 0))
    K(arm, "Jaw", 12, rot=(0.05, 0, 0))
    if flyer:
        K(arm, "WingL", 6, rot=(0.5, 0, 0)); K(arm, "WingR", 6, rot=(0.5, 0, 0))
        K(arm, "WingL", 10, rot=(-0.6, 0, 0)); K(arm, "WingR", 10, rot=(-0.6, 0, 0))
    # recover 13-30
    for b, v in (("Root", (0, 0, 0)), ("Body", (0, 0, 0)), ("Head", (0, 0, 0)),
                 ("Jaw", (0, 0, 0))):
        K(arm, b, 30, rot=v if b != "Root" else None, loc=v if b == "Root" else None)
    if flyer:
        K(arm, "WingL", 30, rot=(0, 0, 0)); K(arm, "WingR", 30, rot=(0, 0, 0))
    K(arm, "Projectile", 1, scl=(0, 0, 0))
    K(arm, "Projectile", 30, scl=(0, 0, 0))
    set_linear(act)
    return act, 30


def anim_ranged(arm, tag, flyer):
    act = make_action(arm, f"{tag}_AttackRanged")
    reset_pose(arm)
    # windup 1-10 : rear up, moon orb charges at the mouth
    K(arm, "Root", 1, loc=(0, 0, 0)); K(arm, "Root", 10, loc=(0, -0.10, -0.12))
    K(arm, "Body", 1, rot=(0, 0, 0)); K(arm, "Body", 10, rot=(0.32, 0, 0))
    K(arm, "Head", 1, rot=(0, 0, 0)); K(arm, "Head", 10, rot=(0.38, 0, 0))
    K(arm, "Projectile", 1, scl=(0, 0, 0))
    K(arm, "Projectile", 10, scl=(0.9, 0.9, 0.9))
    if flyer:
        K(arm, "WingL", 10, rot=(0.9, 0, 0)); K(arm, "WingR", 10, rot=(0.9, 0, 0))
    # fire 11-16 : thrust forward, moon orb launches
    K(arm, "Head", 14, rot=(-0.45, 0, 0))
    K(arm, "Body", 14, rot=(-0.15, 0, 0))
    K(arm, "Root", 14, loc=(0, 0.25, 0))
    K(arm, "Projectile", 14, loc=(0, 0, 0), scl=(1, 1, 1))
    K(arm, "Projectile", 20, loc=(0, 3.0, 0.4), scl=(1, 1, 1))
    # dissipate 21-26
    K(arm, "Projectile", 26, loc=(0, 5.0, 0.6), scl=(0.01, 0.01, 0.01))
    if flyer:
        K(arm, "WingL", 14, rot=(-0.7, 0, 0)); K(arm, "WingR", 14, rot=(-0.7, 0, 0))
    # recover 27-44
    K(arm, "Root", 44, loc=(0, 0, 0))
    K(arm, "Body", 44, rot=(0, 0, 0))
    K(arm, "Head", 44, rot=(0, 0, 0))
    K(arm, "Projectile", 44, loc=(0, 0, 0), scl=(0, 0, 0))
    if flyer:
        K(arm, "WingL", 44, rot=(0, 0, 0)); K(arm, "WingR", 44, rot=(0, 0, 0))
    set_linear(act)
    return act, 44


# ---------------------------------------------------------------- export
def export_all(pets):
    base = EXPORT_DIR
    os.makedirs(base, exist_ok=True)
    sc = bpy.context.scene
    bpy.ops.object.mode_set(mode="OBJECT")
    for pet in pets:
        for anim_name, act, frames in pet["anims"]:
            sc.frame_start, sc.frame_end = 1, frames
            pet["arm"].animation_data.action = act
            bpy.ops.object.select_all(action="DESELECT")
            pet["arm"].select_set(True)
            pet["mesh"].select_set(True)
            sc.view_layers[0].objects.active = pet["arm"]
            path = os.path.join(base, f"{pet['name']}_{anim_name}.fbx")
            bpy.ops.export_scene.fbx(
                filepath=path, use_selection=True,
                bake_anim=True, bake_anim_use_all_actions=False,
                bake_anim_use_nla_strips=False, bake_anim_step=1.0,
                bake_anim_simplify_factor=1.0, add_leaf_bones=False)
            print(f"[Pets] exported {path}")
    print(f"[Pets] all FBX files written to {base}")


def _bake_img_for_materials(mesh, img):
    """Point every material on the mesh at img so the baker writes into it."""
    for mslot in mesh.data.materials:
        m = mslot
        if not m or not m.use_nodes:
            continue
        nodes = m.node_tree.nodes
        tex = None
        for n in nodes:
            if n.type == "TEX_IMAGE" and n.image == img:
                tex = n
                break
        if tex is None:
            tex = nodes.new("ShaderNodeTexImage")
            tex.image = img
            tex.location = (-600, 300)
        for n in nodes:
            n.select = (n == tex)
        nodes.active = tex


def bake_pet_textures(mesh, tag, base, size=512):
    """Bake diffuse + emissive textures for one pet mesh.

    Roblox ignores Blender material colors on FBX import (everything comes
    in gray), so these textures carry the colors instead.
    """
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="DESELECT")
    mesh.select_set(True)
    sc.view_layers[0].objects.active = mesh

    # UV unwrap
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=1.15, island_margin=0.03)
    bpy.ops.object.mode_set(mode="OBJECT")

    for kind, btype, filt in (("diffuse", "DIFFUSE", {"COLOR"}),
                              ("emissive", "EMIT", set())):
        img = bpy.data.images.new(f"{tag}_{kind}", size, size, alpha=False)
        _bake_img_for_materials(mesh, img)
        bpy.ops.object.bake(type=btype, pass_filter=filt, use_clear=True,
                            margin=8)
        img.filepath_raw = os.path.join(base, f"{tag}_{kind}.png")
        img.file_format = "PNG"
        img.save()
        print(f"[Pets] baked {img.filepath_raw}")
    bpy.ops.object.select_all(action="DESELECT")


def bake_all(pets):
    base = EXPORT_DIR
    os.makedirs(base, exist_ok=True)
    sc = bpy.context.scene
    sc.frame_set(1)  # bake at the rest pose
    for pet in pets:
        bake_pet_textures(pet["mesh"], pet["name"], base, TEX_SIZE)
    print(f"[Pets] all textures baked to {base}")


# ---------------------------------------------------------------- build everything
def build_all():
    if CLEAR_SCENE:
        bpy.ops.object.select_all(action="SELECT")
        bpy.ops.object.delete(use_global=False)
    if ROOT_NAME in bpy.data.collections:
        root = bpy.data.collections[ROOT_NAME]
        for o in list(root.all_objects):
            bpy.data.objects.remove(o, do_unlink=True)
        bpy.data.collections.remove(root)
    root = bpy.data.collections.new(ROOT_NAME)
    bpy.context.scene.collection.children.link(root)

    pets = []
    for i, (species, evo_names, builder, flyer) in enumerate(EVOLUTIONS):
        coll = bpy.data.collections.new(f"PT_{species}")
        root.children.link(coll)
        for stage, evo_name in enumerate(evo_names):
            # columns = evolution stage (baby | mid | final), rows = species
            origin = (stage * 4.5, -i * 5.5, 0)
            empty = make_empty(f"{evo_name}_Root", origin, coll)
            arm, mesh = builder(coll, origin, stage, evo_name)
            arm.parent = empty
            arm.matrix_parent_inverse = empty.matrix_world.inverted()
            mesh.parent = empty
            mesh.matrix_parent_inverse = empty.matrix_world.inverted()

            anims = []
            for anim_fn, aname in ((anim_idle, "Idle"), (anim_walk, "Walk"),
                                   (anim_melee, "AttackMelee"),
                                   (anim_ranged, "AttackRanged")):
                act, frames = anim_fn(arm, evo_name, flyer)
                anims.append((aname, act, frames))
            # leave the pet in a neutral idle pose
            arm.animation_data.action = anims[0][1]
            bpy.context.scene.frame_set(1)
            pets.append({"name": evo_name, "arm": arm, "mesh": mesh,
                         "anims": anims})
            print(f"[Pets] {evo_name} ({stage} of {species}): rigged "
                  f"({len(arm.pose.bones)} bones), {len(anims)} animations")

    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.update()
    tris = sum(len(m.data.polygons) for p in pets for m in [p["mesh"]])
    print(f"[Pets] done - {len(pets)} pets under the '{ROOT_NAME}' collection "
          f"(~{sum(sum(len(p.vertices) - 2 for p in m.data.polygons) for p in pets for m in [p['mesh']])} triangles)")
    if AUTO_EXPORT:
        export_all(pets)
    else:
        print("[Pets] set AUTO_EXPORT = True and re-run to write FBX files")
    if BAKE_TEXTURES:
        bake_all(pets)
    else:
        print("[Pets] set BAKE_TEXTURES = True and re-run to bake PNG textures "
              "(needed for colors in Roblox)")


build_all()

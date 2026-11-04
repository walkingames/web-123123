"""Connected hard-surface robot busts for offline website portrait rendering.

Blender --background --factory-startup --python team-robots-v2.py -- --person all
Use --draft for a faster geometry/composition review. No live scene is modified.
"""
from __future__ import annotations

import argparse
import math
from pathlib import Path
import sys

import bpy
import bmesh
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
ART = ROOT / "scratch" / "team-robots-v2"
OUT = ROOT / "public" / "images" / "team"
ART.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)


def active(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def surface(name, color, metallic=.65, roughness=.34, emission=0):
    material = bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    shader = nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    if emission:
        shader.inputs["Emission Color"].default_value = (*color, 1)
        shader.inputs["Emission Strength"].default_value = emission
    else:
        # Subtle machining variation, not conspicuous procedural dirt.
        noise = nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 170
        noise.inputs["Detail"].default_value = 2
        remap = nodes.new("ShaderNodeMapRange")
        remap.inputs["To Min"].default_value = roughness - .035
        remap.inputs["To Max"].default_value = roughness + .035
        links.new(noise.outputs["Fac"], remap.inputs["Value"])
        links.new(remap.outputs["Result"], shader.inputs["Roughness"])
    return material


def mesh_object(name, vertices, faces, material):
    mesh = bpy.data.meshes.new(name + " mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    # All panel outlines are authored in local X/Z space. Recalculate normals
    # instead of relying on the winding of mirrored outlines.
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    if material:
        obj.data.materials.append(material)
    return obj


def finish_edges(obj, width=.025, segments=3):
    bevel = obj.modifiers.new("Machined continuous edge radii", "BEVEL")
    bevel.width = width
    bevel.segments = segments
    bevel.limit_method = "ANGLE"
    bevel.harden_normals = True
    weighted = obj.modifiers.new("Area weighted hard-surface normals", "WEIGHTED_NORMAL")
    weighted.keep_sharp = True
    return obj


def panel(name, outline, front_y, depth, material, bevel=.02):
    count = len(outline)
    vertices = [(x, front_y, z) for x, z in outline]
    vertices += [(x, front_y + depth, z) for x, z in outline]
    faces = [tuple(range(count)), tuple(reversed(range(count, count * 2)))]
    faces += [(i, (i + 1) % count, (i + 1) % count + count, i + count) for i in range(count)]
    obj = mesh_object(name, vertices, faces, material)
    return finish_edges(obj, bevel) if bevel else obj


def mirrored(points, side):
    return [(x * side, z) for x, z in points]


def loft(name, rings, material, bevel=.025):
    vertices = []
    for z, width, depth in rings:
        vertices += [(x, y, z) for x, y in [
            (-width * .67, -depth), (width * .67, -depth),
            (width, -depth * .60), (width, depth * .60),
            (width * .67, depth), (-width * .67, depth),
            (-width, depth * .60), (-width, -depth * .60),
        ]]
    faces = [tuple(reversed(range(8)))]
    for row in range(len(rings) - 1):
        faces += [(row * 8 + i, row * 8 + (i + 1) % 8,
                   (row + 1) * 8 + (i + 1) % 8, (row + 1) * 8 + i) for i in range(8)]
    faces.append(tuple(range((len(rings) - 1) * 8, len(rings) * 8)))
    obj = mesh_object(name, vertices, faces, material)
    return finish_edges(obj, bevel) if bevel else obj


def cylinder(name, center, radius, depth, material, axis=(0, 0, 1), vertices=48, bevel=.012):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector(axis).to_track_quat("Z", "Y")
    obj.data.materials.append(material)
    for face in obj.data.polygons:
        if len(face.vertices) == 4:
            face.use_smooth = True
    return finish_edges(obj, bevel, 3) if bevel else obj


def rod(name, a, b, radius, material):
    a, b = Vector(a), Vector(b)
    return cylinder(name, (a + b) / 2, radius, (b - a).length, material, b - a)


def box(name, center, dimensions, material, bevel=.02):
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    return finish_edges(obj, bevel)


def carve(targets, cutter):
    for target in targets:
        active(target)
        boolean = target.modifiers.new("Recessed machined opening", "BOOLEAN")
        boolean.operation = "DIFFERENCE"
        boolean.solver = "EXACT"
        boolean.object = cutter
        bpy.ops.object.modifier_apply(modifier=boolean.name)
    bpy.data.objects.remove(cutter, do_unlink=True)


def socket_screw(name, x, y, z, metal, dark, radius=.025):
    # The screw shank overlaps its support; no floating decorative bolt heads.
    cylinder(name, (x, y + .008, z), radius, .048, metal, (0, 1, 0), 24, .004)
    cylinder(name + " hex socket", (x, y - .017, z), radius * .43, .003, dark, (0, 1, 0), 6, .001)


def scaled_outline(points, x_factor=.92, z_factor=.85):
    cx = sum(x for x, _ in points) / len(points)
    cz = sum(z for _, z in points) / len(points)
    return [(cx + (x - cx) * x_factor, cz + (z - cz) * z_factor) for x, z in points]


def palette(person):
    is_yusuf = person == "yusuf"
    return {
        "frame": surface("Graphite structural frame", (.038, .048, .060), .82, .36),
        "rubber": surface("Recesses and flexible seals", (.010, .014, .019), .10, .57),
        "steel": surface("Machined titanium edges", (.30, .34, .38), .88, .29),
        "paint": surface("Oxide orange armor" if is_yusuf else "Cobalt blue armor",
                         (.42, .070, .017) if is_yusuf else (.021, .095, .31), .55, .34),
        "secondary": surface("Dark ceramic armor", (.075, .090, .11), .55, .38),
        "optic": surface("Amber recessed optic" if is_yusuf else "Ice cyan recessed optic",
                         (.86, .045, .006) if is_yusuf else (.025, .56, 1.0), .15, .25, 2.0),
        "warning": surface("Small painted identification marks", (.75, .59, .25) if is_yusuf else (.47, .64, .79), .25, .43),
    }


def make_body(m, person):
    loft("One-piece load bearing torso", [
        (.12, .65, .40), (.55, .87, .51), (1.15, 1.00, .56),
        (1.62, .86, .46), (1.84, .56, .35),
    ], m["frame"], .055)
    # Broad chest plates overlap the continuous chassis instead of orbiting it.
    chest = [(.09, 1.67), (.59, 1.70), (.98, 1.40), (.85, .97), (.28, .85), (.09, 1.04)]
    shoulder = [(1.00, 1.89), (1.31, 2.02), (1.70, 1.72), (1.66, 1.20), (1.16, 1.18), (.98, 1.47)]
    for side in (-1, 1):
        panel("Pectoral armor", mirrored(chest, side), -.64, .22, m["paint"], .035)
        inset = [(.22, 1.51), (.56, 1.54), (.76, 1.39), (.70, 1.30), (.31, 1.28)]
        panel("Pectoral inset support", mirrored(inset, side), -.667, .045, m["rubber"], .012)
        for index in range(4):
            x = side * (.32 + index * .082)
            panel("Inset chest cooling fin", [(x - .018, 1.32), (x + .018, 1.32),
                                               (x + .018, 1.49), (x - .018, 1.49)],
                  -.682, .033, m["steel"], .006)
        for x, z in ((.77, 1.30), (.31, 1.60), (.40, 1.00)):
            socket_screw("Captive chest screw", side * x, -.663, z, m["steel"], m["rubber"])
        # Hinge axle passes from the torso side into the shoulder shell.
        cylinder("Shoulder torque axle", (side * 1.06, 0, 1.49), .29, .64,
                 m["steel"], (1, 0, 0))
        cylinder("Shoulder bearing seal", (side * 1.16, 0, 1.49), .33, .25,
                 m["rubber"], (1, 0, 0))
        pauldron_mat = m["paint"] if side == 1 or person == "emrehan" else m["secondary"]
        panel("Structural shoulder pauldron", mirrored(shoulder, side), -.43, .83,
              m["frame"], .055)
        shoulder_face = [(1.08, 1.85), (1.30, 1.93), (1.60, 1.69), (1.55, 1.32), (1.20, 1.29), (1.08, 1.48)]
        shoulder_skin = panel("Attached shoulder armor skin", mirrored(shoulder_face, side),
                              -.49, .12, pauldron_mat, 0)
        for z in (1.50, 1.57, 1.64):
            slot = mirrored([(1.19, z), (1.45, z + .015), (1.45, z - .015), (1.19, z - .03)], side)
            carve([shoulder_skin], panel("Shoulder cooling recess cutter", slot, -.62, .18, None, 0))
        finish_edges(shoulder_skin, .025)
        for x, z in ((1.27, 1.79), (1.46, 1.43)):
            socket_screw("Shoulder plate fastener", side * x, -.51, z, m["steel"], m["rubber"], .030)
        # Nested upper arm sleeve is captured by the same axle, not a separate ball.
        cylinder("Upper arm structural sleeve", (side * 1.36, 0, .99), .24, .75, m["frame"])
        arm = [(1.15, 1.28), (1.56, 1.24), (1.59, .63), (1.30, .52), (1.13, .70)]
        arm_plate = panel("Upper arm armor", mirrored(arm, side), -.30, .18, m["secondary"], 0)
        for i in range(3):
            z = .77 + i * .105
            channel = mirrored([(1.26, z - .018), (1.48, z - .018),
                                (1.48, z + .018), (1.26, z + .018)], side)
            carve([arm_plate], panel("Arm cooling recess cutter", channel, -.40, .14, None, 0))
        finish_edges(arm_plate, .025)
        # Load-bearing piston terminates inside chassis and arm sockets.
        a, b = (side * .81, -.16, 1.00), (side * 1.23, -.14, .72)
        rod("Shoulder stabilizer piston", a, b, .060, m["steel"])
        cylinder("Torso piston clevis", a, .10, .15, m["frame"], (0, 1, 0))
        cylinder("Arm piston clevis", b, .10, .15, m["frame"], (0, 1, 0))
    panel("Raised sternum spine", [(-.115, 1.72), (.115, 1.72), (.16, 1.10),
                                    (.07, .80), (-.07, .80), (-.16, 1.10)], -.74, .13, m["steel"], .02)
    for z, width in ((.74, .64), (.56, .57), (.39, .48)):
        outline = [(-width, z + .10), (-.13, z + .12), (0, z + .04),
                   (.13, z + .12), (width, z + .10), (width * .85, z - .04),
                   (0, z - .10), (-width * .85, z - .04)]
        panel("Overlapping abdominal lamella", outline, -.56, .17, m["secondary"], .025)
    # Collar has a continuous structural contact with torso and head base.
    cylinder("Collar mounting flange", (0, 0, 1.84), .49, .22, m["secondary"])
    cylinder("Neck load bearing shaft", (0, 0, 2.07), .24, .53, m["steel"])
    for z in (1.96, 2.09, 2.22):
        cylinder("Captured cervical ring", (0, 0, z), .29, .075, m["frame"])
    for side in (-1, 1):
        rod("Neck hydraulic support", (side * .30, .13, 1.87), (side * .27, .10, 2.29), .055, m["steel"])
    # Small, physically printed service markings, not floating luminous cubes.
    for x in (-.045, .045):
        box("Printed sternum identification", (x, -.742, 1.44), (.025, .006, .12), m["warning"], .001)


def make_head(m, person):
    before = set(bpy.context.scene.objects)
    core = loft("Continuous helmet shell", [
        (2.24, .42, .32), (2.52, .59, .43), (3.23, .69, .49),
        (3.65, .64, .45), (3.94, .34, .29),
    ], m["frame"], 0)
    mask = panel("Recessed full face substrate", [(-.51, 2.48), (.51, 2.48),
                 (.63, 3.25), (.46, 3.59), (-.46, 3.59), (-.63, 3.25)], -.57, .18, m["rubber"], 0)
    # Both characters are predatory: narrow, inward-descending orbital apertures.
    eye = [(.12, 3.17), (.54, 3.31), (.50, 3.16), (.12, 3.055)]
    for side in (-1, 1):
        outline = mirrored(eye, side)
        cutter = panel("Optical cavity cutting tool", outline, -.80, .53, None, 0)
        carve([mask, core], cutter)
        panel("Captured optical electronics housing", scaled_outline(outline, .97, .94),
              -.585, .335, m["steel"], .012)
        panel("Recessed luminous optical slit", scaled_outline(outline, .84, .72),
              -.612, .035, m["optic"], .008)
        brow = [(.065, 3.31), (.55, 3.53), (.67, 3.40), (.60, 3.28), (.105, 3.12)]
        panel("Forged orbital brow armor", mirrored([(x, z + .045) for x, z in brow], side),
              -.64, .23, m["paint"], .028)
        cheek = [(.65, 3.26), (.47, 3.10), (.28, 2.59), (.47, 2.38), (.68, 2.68)]
        cheek_obj = panel("Integrated cheek armor", mirrored(cheek, side), -.57, .23, m["paint"], 0)
        for z in (2.77, 2.88, 2.99):
            vent = mirrored([(.46, z), (.59, z + .045), (.59, z + .010), (.46, z - .035)], side)
            carve([cheek_obj], panel("Cheek vent cutting tool", vent, -.69, .20, None, 0))
        finish_edges(cheek_obj, .022)
        for x, z in ((.57, 3.35), (.48, 2.57)):
            socket_screw("Recessed facial fastener", side * x, -.66 if z > 3 else -.59,
                         z, m["steel"], m["rubber"], .021)
        # The side bearing overlaps the shell; its bolts lie on that bearing face.
        cylinder("Helmet side bearing", (side * .65, .065, 2.98), .20, .19, m["steel"], (1, 0, 0))
        cylinder("Side bearing inset cap", (side * .755, .065, 2.98), .135, .045, m["secondary"], (1, 0, 0))
        for i in range(6):
            angle = math.tau * i / 6
            cylinder("Side bearing captive screw", (side * .774, .065 + .16 * math.sin(angle),
                     2.98 + .16 * math.cos(angle)), .016, .025, m["frame"], (1, 0, 0), 12, .003)
    for side in (-1, 1):
        for z in (3.37, 3.47, 3.57):
            bpy.ops.mesh.primitive_cube_add(size=1, location=(side * .66, .12, z))
            cutter = bpy.context.object
            cutter.name = "Machined temple cooling slot cutter"
            cutter.dimensions = (.25, .36, .035)
            bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            carve([core], cutter)
    finish_edges(core, .025)
    finish_edges(mask, .012)
    panel("Armored nasal keel", [(-.10, 3.21), (.10, 3.21), (.22, 2.88),
                                 (.14, 2.76), (-.14, 2.76), (-.22, 2.88)], -.665, .24, m["steel"], .022)
    jaw_shape = [(-.46, 2.74), (-.20, 2.61), (.20, 2.61), (.46, 2.74),
                 (.43, 2.32), (.21, 2.19), (-.21, 2.19), (-.43, 2.32)]
    jaw = panel("Continuous armored jaw bridge", jaw_shape, -.54, .23, m["secondary"], 0)
    mouth = [(-.32, 2.55), (.32, 2.55), (.28, 2.37), (-.28, 2.37)]
    carve([jaw], panel("Recessed mouth intake cutter", mouth, -.72, .34, None, 0))
    finish_edges(jaw, .027)
    # Grille ribs terminate against the intake back wall and side rails.
    for x in (-.235, -.155, -.075, .005, .085, .165, .245):
        panel("Captured mouth intake rib", [(x - .018, 2.38), (x + .018, 2.38),
               (x + .018, 2.54), (x - .018, 2.54)], -.52, .17, m["steel"], .006)
    panel("Jaw lower edge guard", [(-.34, 2.34), (0, 2.23), (.34, 2.34),
                                   (.25, 2.18), (0, 2.10), (-.25, 2.18)], -.56, .22, m["paint"], .025)
    panel("Forehead keystone", [(-.14, 3.83), (.14, 3.83), (.17, 3.46),
                               (0, 3.28), (-.17, 3.46)], -.49, .24, m["steel"], .025)
    for side in (-1, 1):
        crown = [(.18, 3.85), (.39, 3.79), (.59, 3.58), (.53, 3.46), (.19, 3.62)]
        panel("Crown armor cheek", mirrored(crown, side), -.44, .24, m["paint"], .025)
    # Rotate/scale the complete head assembly, preserving component contacts.
    objects = set(bpy.context.scene.objects) - before
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    assembly = bpy.context.object
    assembly.name = "Complete connected helmet assembly"
    for obj in objects:
        obj.parent = assembly
    assembly.rotation_euler[2] = math.radians(-6 if person == "yusuf" else 5)
    assembly.scale.x = .98 if person == "yusuf" else 1.075


def lighting_and_camera(person, draft):
    target = Vector((0, 0, 2.07))
    bpy.ops.object.camera_add(location=(3.5 if person == "yusuf" else -3.1, -10.5, 4.5))
    camera = bpy.context.object
    camera.name = "Three-quarter portrait camera"
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 4.95
    bpy.context.scene.camera = camera
    for name, loc, power, size, color in [
        ("Large neutral studio key", (-4, -6, 8), 1250, 5, (1, .91, .79)),
        ("Front soft fill", (4, -5, 4), 850, 4, (.79, .87, 1)),
        ("Rear edge strip", (1, 3.5, 6), 1450, 3, (.60, .77, 1)),
    ]:
        bpy.ops.object.light_add(type="AREA", location=loc)
        light = bpy.context.object
        light.name = name
        light.data.energy = power
        light.data.shape = "DISK"
        light.data.size = size
        light.data.color = color
        light.rotation_euler = (target - light.location).to_track_quat("-Z", "Y").to_euler()
    world = bpy.data.worlds.new("Neutral reflection environment")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (.24, .27, .32, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = .35
    scene = bpy.context.scene
    scene.world = world
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 32 if draft else 80
    scene.cycles.use_denoising = True
    scene.render.threads_mode = "FIXED"
    scene.render.threads = 8
    scene.render.resolution_x = scene.render.resolution_y = 768 if draft else 1024
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.compression = 80
    scene.render.film_transparent = True
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.exposure = .20


def build(person, draft=False):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    materials = palette(person)
    make_body(materials, person)
    make_head(materials, person)
    lighting_and_camera(person, draft)
    suffix = "draft" if draft else "v2"
    scene = bpy.context.scene
    scene.render.filepath = str((ART if draft else OUT) / f"robot-{person}-{suffix}.png")
    bpy.ops.wm.save_as_mainfile(filepath=str(ART / f"robot-{person}-{suffix}.blend"))
    bpy.ops.render.render(write_still=True)
    print("ROBOT_RENDER_COMPLETE", person, scene.render.filepath, flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--person", choices=("yusuf", "emrehan", "all"), default="all")
    parser.add_argument("--draft", action="store_true")
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
    print("BLENDER_RUNTIME", bpy.app.version_string, flush=True)
    for person in (("yusuf", "emrehan") if args.person == "all" else (args.person,)):
        build(person, args.draft)


if __name__ == "__main__":
    main()

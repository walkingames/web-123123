"""Reference-inspired bone portraits. Run with Blender --background --python this_file.

Only offline PNGs are shipped to the website. The editable scenes remain in scratch.
All geometry is authored here; sockets are actual boolean cavities, not eye decals.
"""
import bpy
import math
import os
import sys
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'public', 'images', 'team')
SOURCE = os.path.join(ROOT, 'scratch', 'team-avatar-v2')
os.makedirs(OUT, exist_ok=True)
os.makedirs(SOURCE, exist_ok=True)

def material(name, color, roughness=.4):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    node = mat.node_tree.nodes.get('Principled BSDF')
    node.inputs['Base Color'].default_value = (*color, 1)
    node.inputs['Roughness'].default_value = roughness
    node.inputs['Subsurface Weight'].default_value = .035
    return mat

def active(obj):
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

def smooth(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj

def sphere(name, position, scale, mat, segments=48, rings=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=position)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if mat:
        obj.data.materials.append(mat)
    return smooth(obj)

def tube(name, points, radius, mat, radii=None):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.resolution_u = 16
    curve.bevel_depth = radius
    curve.bevel_resolution = 5
    curve.use_fill_caps = True
    spline = curve.splines.new('BEZIER')
    spline.bezier_points.add(len(points)-1)
    for i, (point, co) in enumerate(zip(spline.bezier_points, points)):
        point.co = co
        point.handle_left_type = 'AUTO'
        point.handle_right_type = 'AUTO'
        if radii:
            point.radius = radii[i]
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj

def bone_segment(name, a, b, radius, mat):
    a, b = Vector(a), Vector(b)
    direction = b-a
    obj = sphere(name, (a+b)/2, (radius, radius, direction.length/2), mat, 32, 20)
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = direction.to_track_quat('Z', 'Y')
    for end in (a, b):
        sphere(name+' rounded joint', end, (radius*1.2, radius*1.13, radius*1.15), mat, 24, 16)
    return obj

def rounded_tooth(name, loc, scale, rotation, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel = obj.modifiers.new('Soft enamel edges', 'BEVEL')
    bevel.width = .025
    bevel.segments = 4
    obj.modifiers.new('Weighted enamel normals', 'WEIGHTED_NORMAL')
    obj.rotation_euler[2] = rotation
    obj.data.materials.append(mat)
    return obj

def subtract(skull, cutter):
    active(skull)
    # Boolean cut faces use the cutter's material slot: warm recessed bone,
    # while the outer sculpt and orbital lip retain ivory.
    cutter.data.materials.clear()
    for mat in skull.data.materials:
        cutter.data.materials.append(mat)
    for face in cutter.data.polygons:
        face.material_index = 1
    mod = skull.modifiers.new('Carved '+cutter.name, 'BOOLEAN')
    mod.operation = 'DIFFERENCE'
    mod.solver = 'EXACT'
    mod.object = cutter
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cutter, do_unlink=True)

def make_skull(bone, cavity, enamel, wide=False):
    # Merge the rounded cranial vault, cheek arches and upper jaw into a sculpt.
    width = 1.045 if wide else .97
    parts = [
        sphere('Cranial vault', (0,.02,3.73), (.81*width,.62,.77 if wide else .81), bone),
        sphere('Face plane', (0,-.22,3.53), (.66*width,.48,.57), bone),
        sphere('Maxilla', (0,-.26,3.14), (.46*width,.36,.24), bone),
    ]
    for side in (-1, 1):
        parts.append(sphere('Zygomatic arch', (side*.56*width,-.23,3.36), (.24,.36,.24), bone))
    bpy.ops.object.select_all(action='DESELECT')
    for part in parts:
        part.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    skull = bpy.context.object
    skull.name = 'Sculpted ivory skull with recessed sockets'
    remesh = skull.modifiers.new('Continuous bone surface', 'REMESH')
    remesh.mode = 'VOXEL'
    remesh.voxel_size = .026
    bpy.ops.object.modifier_apply(modifier=remesh.name)
    relax = skull.modifiers.new('Soften sculpt transitions', 'SMOOTH')
    relax.factor = .8
    relax.iterations = 5
    bpy.ops.object.modifier_apply(modifier=relax.name)
    sub = skull.modifiers.new('Cranium surface polish', 'SUBSURF')
    sub.levels = 1
    bpy.ops.object.modifier_apply(modifier=sub.name)
    skull.data.materials.clear()
    skull.data.materials.append(bone)
    skull.data.materials.append(cavity)
    for face in skull.data.polygons:
        face.material_index = 0
    # Carve real depth and use a warmer inner-bone material for readable sockets.
    for side in (-1, 1):
        eye = sphere('Deep orbital socket', (side*.345*width,-.66,3.69),
                     (.285 if wide else .26,.42,.285 if wide else .32), bone)
        eye.rotation_euler[1] = side*math.radians(7)
        subtract(skull, eye)
    # Paired pear-shaped nasal apertures leave a thin bone septum.
    for side in (-1, 1):
        nose = sphere('Nasal aperture', (side*.055,-.617,3.33), (.047,.28,.115), bone, 32, 24)
        nose.rotation_euler[1] = side*math.radians(-12)
        subtract(skull, nose)
    bevel = skull.modifiers.new('Soft orbital rims', 'BEVEL')
    bevel.width = .024
    bevel.segments = 3
    bevel.limit_method = 'ANGLE'
    smooth(skull)
    # U-shaped mandible, not a solid oval mouth plug.
    jaw_points = []
    for i in range(13):
        t = -math.pi*.68 + math.pi*1.36*i/12
        jaw_points.append((.51*width*math.sin(t), -.04-.43*math.cos(t), 2.69+.10*(abs(t)/(math.pi*.68))**2))
    tube('Rounded horseshoe mandible', jaw_points, .105, bone)
    sphere('Chin', (0,-.37,2.66), (.37*width,.15,.10), bone)
    for side in (-1, 1):
        bone_segment('Mandible ramus', (side*.49*width,.13,2.75), (side*.57*width,.13,3.23), .095, bone)
    # Actual individual teeth, two curved rows, with a small expressive opening.
    for row, z in [('upper',3.015),('lower',2.87 if wide else 2.845)]:
        for i in range(10):
            t = -.99 + i*(1.98/9)
            x = .49*width*math.sin(t)
            y = -.13-.40*math.cos(t)
            rounded_tooth(row+' tooth %02d'%i, (x,y,z), (.099,.12,.16 if row=='upper' else .12), -t, enamel)
    return skull

def build(person):
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    wide = person == 'emrehan'
    bone = material('Warm porcelain ivory', (.79,.74,.59), .39)
    enamel = material('Soft ivory enamel', (.88,.83,.69), .32)
    cavity = material('Warm recessed inner bone', (.38,.23,.12), .65)
    # Body: curved, spatial ribs with a visible spine, no solid shoulder pedestal.
    for i in range(13):
        z = .55+i*.146
        sphere('Vertebra %02d'%i, (0,.15,z), (.145 if i<9 else .12,.145,.078), bone, 32, 16)
        if i<9:
            bone_segment('Vertebral process', (-.18,.18,z),(.18,.18,z),.035,bone)
    for i, z in enumerate((2.44,2.57,2.70)):
        sphere('Cervical vertebra %02d'%i, (0,.12,z), (.12,.13,.065), bone, 32, 16)
    for side in (-1,1):
        tube('Collarbone',[(side*.04,-.13,2.42),(side*.32,-.19,2.46),(side*.61,-.10,2.40),(side*.78,.02,2.34)], .065,bone)
        sphere('Shoulder joint', (side*.79,.03,2.31), (.13,.15,.14), bone)
        sphere('Scapula', (side*.48,.27,2.20), (.24,.10,.28), bone)
    for index,(z, width) in enumerate([(2.28,.48),(2.09,.59),(1.90,.64),(1.71,.64),(1.52,.59),(1.33,.52),(1.14,.43)]):
        for side in (-1,1):
            # From spine around the side to the anterior sternum.
            pts=[(side*.09,.16,z+.08),(side*width,.13,z+.04),
                 (side*(width+.045),-.10,z-.04),(side*width*.70,-.31,z-.13),
                 (side*.08,-.36,z-.10)]
            tube('Curved rib %02d %d'%(index,side),pts,.051 if index<5 else .047,bone,[.8,1,1.15,1.1,.75])
    tube('Sternum',[(0,-.37,2.38),(0,-.385,2.08),(0,-.38,1.70),(0,-.36,1.24)],.072,bone,[1.1,1,.8,.45])
    # Two intentionally different upper-body gestures and shoulder lines.
    for side in (-1,1):
        shoulder=(side*.79,.03,2.29)
        elbow=(side*(.98 if wide else 1.0),-.02,1.24)
        wrist=(side*.78,-.20,.60)
        if (wide and side==-1) or (not wide and side==1):
            elbow=(side*1.06,-.04,1.25)
            wrist=(side*.54,-.40,.78)
        bone_segment('Humerus',shoulder,elbow,.073,bone)
        for offset in (-.037,.037):
            a=Vector(elbow)+Vector((offset,0,-.05))
            b=Vector(wrist)+Vector((offset,0,0))
            bone_segment('Forearm radius ulna',a,b,.033,bone)
    before=set(bpy.context.scene.objects)
    make_skull(bone,cavity,enamel,wide)
    head_objects=set(bpy.context.scene.objects)-before
    bpy.ops.object.empty_add(type='PLAIN_AXES',location=(0,0,2.64))
    head_root=bpy.context.object
    head_root.name='Expressive skull pose'
    for obj in head_objects:
        matrix=obj.matrix_world.copy()
        obj.parent=head_root
        obj.matrix_world=matrix
    head_root.rotation_euler[1]=math.radians(-5 if wide else 4)
    head_root.rotation_euler[2]=math.radians(12 if wide else -8)
    # Portrait is upper-torso; rounded CSS frame crops only the lower forearms.
    target=Vector((0,0,2.60))
    bpy.ops.object.camera_add(location=((-3.0 if wide else 3.0),-10.8,4.0))
    camera=bpy.context.object
    camera.name='Founder portrait camera'
    camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.type='ORTHO'
    camera.data.ortho_scale=5.15
    bpy.context.scene.camera=camera
    def area(name,loc,power,size,color):
        bpy.ops.object.light_add(type='AREA',location=loc)
        light=bpy.context.object
        light.name=name
        light.data.energy=power
        light.data.shape='DISK'
        light.data.size=size
        light.data.color=color
        light.rotation_euler=(Vector((0,0,2.8))-light.location).to_track_quat('-Z','Y').to_euler()
    area('Large warm studio key',(-3.5,-4.5,7),650,4.0,(1,.92,.76))
    area('Soft neutral fill',(4,-3,4),250,3.0,(.83,.90,1))
    area('Ivory rim separation',(1,3,6),700,3.0,(1,.97,.82))
    sc=bpy.context.scene
    sc.render.engine='CYCLES'
    sc.cycles.samples=48
    sc.cycles.use_denoising=True
    sc.render.threads_mode='FIXED'
    sc.render.threads=8
    sc.render.resolution_x=1024
    sc.render.resolution_y=1024
    sc.render.resolution_percentage=100
    sc.render.image_settings.file_format='PNG'
    sc.render.image_settings.color_mode='RGBA'
    sc.render.image_settings.compression=80
    sc.render.film_transparent=True
    sc.world.color=(.13,.13,.13)
    sc.view_settings.view_transform='AgX'
    sc.render.filepath=os.path.join(OUT,('emrehan-dalaman' if wide else 'yusuf-okuducu')+'-v2.png')
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(SOURCE,person+'.blend'))
    bpy.ops.render.render(write_still=True)
    print('PORTRAIT_RENDERED',person,sc.render.filepath,flush=True)

people=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else ['yusuf','emrehan']
for person in people:
    build(person)

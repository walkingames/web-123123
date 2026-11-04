import bpy, math, os, sys
from mathutils import Vector
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
OUT=ROOT+'/public/images/team'; ART=ROOT+'/scratch/team-robots'
os.makedirs(OUT,exist_ok=True); os.makedirs(ART,exist_ok=True)

def mat(name,color,metal=0,rough=.35,emission=None):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True; p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1); p.inputs['Metallic'].default_value=metal; p.inputs['Roughness'].default_value=rough
 if emission: p.inputs['Emission Color'].default_value=(*color,1); p.inputs['Emission Strength'].default_value=emission
 return m
def uv(name,loc,scale,ma,seg=32,rings=20):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=rings, location=loc); o=bpy.context.object;o.name=name;o.scale=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(ma)
 for polygon in o.data.polygons: polygon.use_smooth=True
 return o
def cube(name,loc,scale,ma,bev=.08,rot=None):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if rot:o.rotation_euler=rot
 o.data.materials.append(ma); b=o.modifiers.new('Machined edge radii','BEVEL');b.width=bev;b.segments=3;o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL');return o
def cyl(name,loc,r,depth,ma,rot=(math.pi/2,0,0)):
 bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=r, depth=depth, location=loc, rotation=rot);o=bpy.context.object;o.name=name;o.data.materials.append(ma);b=o.modifiers.new('Rim bevel','BEVEL');b.width=.035;b.segments=3;o.modifiers.new('Normals','WEIGHTED_NORMAL');return o
def rod(name,a,b,r,ma):
 d=Vector(b)-Vector(a);mid=(Vector(a)+Vector(b))/2;bpy.ops.mesh.primitive_cylinder_add(vertices=16,radius=r,depth=d.length,location=mid);o=bpy.context.object;o.name=name;o.rotation_mode='QUATERNION';o.rotation_quaternion=d.to_track_quat('Z','Y');o.data.materials.append(ma)
def angular_helmet(ma):
 # Chamfered ring hull: actual planar armor, not a re-colored rounded helmet.
 rings=[(-.43,.46,.35),(-.12,.64,.46),(.55,.70,.50),(.94,.45,.36)]
 vertices=[]
 for z,w,d in rings:
  vertices.extend([(x,y-.02,z) for x,y in [(-w*.66,-d),(w*.66,-d),(w,-d*.6),(w,d*.6),(w*.66,d),(-w*.66,d),(-w,d*.6),(-w,-d*.6)]])
 faces=[tuple(reversed(range(8)))]
 for row in range(len(rings)-1):
  for i in range(8): faces.append((row*8+i,row*8+(i+1)%8,(row+1)*8+(i+1)%8,(row+1)*8+i))
 faces.append(tuple(range((len(rings)-1)*8,len(rings)*8)))
 mesh=bpy.data.meshes.new('Forged angular helmet mesh');mesh.from_pydata(vertices,[],faces);mesh.update()
 obj=bpy.data.objects.new('Angular predator helmet',mesh);bpy.context.collection.objects.link(obj);obj.data.materials.append(ma)
 edge=obj.modifiers.new('Armor edge machining','BEVEL');edge.width=.055;edge.segments=3
 obj.modifiers.new('Weighted armor normals','WEIGHTED_NORMAL')
 return obj
def hose(name,points,radius,ma):
 curve=bpy.data.curves.new(name,'CURVE');curve.dimensions='3D';curve.bevel_depth=radius;curve.bevel_resolution=4
 spline=curve.splines.new('BEZIER');spline.bezier_points.add(len(points)-1)
 for point,co in zip(spline.bezier_points,points):point.co=co;point.handle_left_type='AUTO';point.handle_right_type='AUTO'
 obj=bpy.data.objects.new(name,curve);bpy.context.collection.objects.link(obj);obj.data.materials.append(ma)
def build(kind):
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 y=kind=='yusuf'
 shell=mat('Titanium | graphite' if y else 'Ceramic | warm ivory',(.105,.13,.16) if y else (.78,.82,.79),.78 if y else .35,.27)
 armor=mat('Forged armor' if y else 'Glacier blue enamel',(.23,.27,.29) if y else (.23,.36,.43),.72 if y else .48,.25)
 dark=mat('Recess shadow',(.018,.026,.033),.35,.32); metal=mat('Exposed alloy',(.46,.52,.53),.85,.22)
 accent=mat('Optics | red amber' if y else 'Optics | cyan',(.85,.025,.006) if y else (.025,.75,.95),.2,.18,2.0)
 lime=mat('Signal lime',(.55,.92,.08),.25,.2,1.2)
 # shoulders and torso
 uv('Torso core',(0,0,-1.35),(.88,.48,.63),shell)
 for x in [-.77,.77]:
  if y:
   uv('Shoulder joint',(x,0,-.92),(.35,.38,.35),dark)
   cube('Angular shoulder pauldron',(x*1.15,-.02,-.79),(.76,.68,.37),armor,.055,(0,x*.30,0))
   cube('Layered shoulder lip',(x*1.15,-.35,-.88),(.68,.10,.20),shell,.035,(0,x*.30,0))
  else:
   cyl('Expedition shoulder pivot',(x,0,-.92),.28,.45,dark,(0,math.pi/2,0));cube('Expedition shoulder pod',(x*1.12,-.02,-.84),(.62,.55,.32),armor,.18,(0,0,x*.16))
  for z in [-.72,-.95]: cyl('Shoulder fastener',(x*1.18,-.43,z),.055,.07,metal)
 cube('Chest plate',(0,-.45,-1.32),(1.18,.22,.52),armor,.14)
 for i in range(5): cube('Chest vent',( -.38+i*.19,-.575,-1.33),(.085,.025,.24),dark,.025)
 uv('Neck actuator',(0,0,-.56),(.37,.35,.42),metal)
 # helmet silhouette
 if y:
  angular_helmet(shell)
  cube('Crown armor',(0,-.02,.91),(.82,.68,.15),armor,.045)
  for x in [-.17,.17]:cube('Crown ridge',(x,-.05,1.015),(.10,.55,.09),metal,.025)
 else:
  uv('Helmet shell',(0,-.02,.27),(.78,.57,.91),shell,48,32)
  uv('Crown armor',(0,-.12,.85),(.64,.48,.33),armor)
 # brow and face plate; paired recessed optical sockets with glowing lenses
 if not y:cube('Brow ridge',(0,-.53,.55),(1.17,.18,.18),armor,.06)
 for x in [-.3,.3]:
  if y:
   angle=-math.copysign(.20,x)
   cube('Scowling armored brow',(x,-.59,.46),(.58,.18,.16),armor,.035,(0,angle,0))
   cube('Recessed narrow optic housing',(x,-.575,.30),(.48,.12,.18),dark,.035,(0,angle,0))
   cube('Predator slit optic',(x,-.65,.30),(.33,.035,.055),accent,.014,(0,angle,0))
   for dx in [-.20,.20]:cyl('Brow fastener',(x+dx,-.69,.46-dx*math.sin(angle)),.024,.025,metal)
  else:
   cyl('Optic socket',(x,-.575,.25),.22,.13,dark);cyl('Optic bezel',(x,-.66,.25),.15,.07,metal);uv('Luminous optic',(x,-.715,.25),(.105,.035,.105),accent)
 # cheek plating; asymmetric detail for Yusuf
 for x in [-1,1]:
  cube('Cheek guard',(x*.52,-.43,-.1),(.28,.22,.54),armor,.07, (0,0,x*.13))
  for j in range(3): cube('Cheek gill',(x*.54,-.56,-.12+j*.12),(.14,.035,.035),dark,.01)
 # Deliberately different mouth language: Yusuf has a tooth-like service jaw;
 # Emrehan uses a smooth expedition respirator and beacon rather than teeth.
 uv('Jaw hinge',(0,-.22,-.4),(.55,.4,.28),shell)
 cube('Jaw guard',(0,-.51,-.45),(.78,.19,.22),armor,.09)
 if y:
  for x in [-.3,-.15,0,.15,.3]: cube('Mechanical tooth',(x,-.63,-.40),(.075,.07,.13),metal,.025)
  for x in [-.34,.34]:
   bpy.ops.mesh.primitive_cone_add(vertices=4,radius1=.065,radius2=.012,depth=.23,location=(x,-.66,-.34));bpy.context.object.name='Fanged jaw tooth';bpy.context.object.data.materials.append(metal)
 else:
  cube('Expedition respirator',(0,-.63,-.40),(.47,.09,.12),dark,.045)
  for x in [-.18,0,.18]: cyl('Respirator port',(x,-.69,-.40),.045,.045,accent)
  cube('Navigation beacon',(0,-.42,.72),(.16,.10,.18),accent,.04)
 # visible side ear disks, cable bundles and fasteners
 for x in [-1,1]:
  cyl('Ear bearing',(x*.73,0,.15),.23,.19,metal,(0,math.pi/2,0));cyl('Bearing inset',(x*.84,0,.15),.14,.04,dark,(0,math.pi/2,0))
  for z in [-.75,-.93]: uv('Torso bolt',(x*.42,-.59,z),(.035,.025,.035),lime if (y and z==-.75) else metal,16,8)
 # forehead crest distinct shapes
 if y:
  cube('Forehead center plate',(0,-.49,.67),(.20,.15,.30),armor,.025)
  for j in range(3):cube('Forehead vent',(0,-.58,.62+j*.06),(.10,.025,.018),dark,.006)
  for side in [-1,1]:
   rod('External hydraulic',(side*.67,-.1,.14),(side*.86,-.19,-.48),.055,metal)
   for z in [-.22,-.4]: uv('Hydraulic coupling',(side*.77,-.15,z),(.09,.09,.09),lime,16,8)
   hose('Armored service cable',[(side*.68,.02,-.12),(side*.92,.05,-.39),(side*1.0,-.02,-.64)],.040,dark)
  # Deliberate left/right asymmetry, with short mechanical armor studs.
  for x in [.80,1.00,1.17]:
   bpy.ops.mesh.primitive_cone_add(vertices=6,radius1=.075,radius2=.008,depth=.23,location=(x,-.04,-.48));bpy.context.object.name='Pauldron armor stud';bpy.context.object.data.materials.append(metal)
  for z in [-.10,.02,.14]:cube('Asymmetric cheek vent',(-.56,-.58,z),(.16,.045,.035),dark,.008,(0,-.2,0))
  for x in [-.45,.45]:
   for z in [-1.12,-1.54]:cyl('Chest armor screw',(x,-.59,z),.025,.03,metal)
  for x in [-.1,0,.1]:cube('Chest warning stripe',(x,-.58,-1.03),(.035,.02,.10),lime,.008,(0,-.45,0))
 else:
  uv('Expedition sensor dome',(0,-.28,.98),(.22,.16,.15),armor)
  cube('Forehead status bar',(0,-.56,.68),(.42,.055,.065),accent,.025)
  for side in [-1,1]:
   rod('Shoulder cable',(side*.45,-.18,-.71),(side*.7,-.18,-.52),.035,metal)
 # camera: slight three-quarter from robot's right
 bpy.ops.object.camera_add(location=(3.05,-8.7,1.05));cam=bpy.context.object;target=Vector((0,-.05,-.25));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=3.65;bpy.context.scene.camera=cam
 for loc,power,size,color in [((-4,-5,5),900,4,(.72,.84,1)),((4,-3,2),700,3,(1,.42,.2) if y else (.2,.65,1)),((1,3,4),1000,3,(.6,.85,1))]:
  bpy.ops.object.light_add(type='AREA',location=loc);l=bpy.context.object;l.data.energy=power;l.data.shape='DISK';l.data.size=size;l.data.color=color;l.rotation_euler=(Vector((0,0,0))-l.location).to_track_quat('-Z','Y').to_euler()
 scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True;scene.render.threads_mode='FIXED';scene.render.threads=8
 scene.render.resolution_x=1024;scene.render.resolution_y=1024;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.film_transparent=True
 scene.view_settings.view_transform='AgX';scene.render.filepath=OUT+'/robot-'+kind+'-v1.png';scene.world.color=(.025,.025,.025)
 bpy.ops.wm.save_as_mainfile(filepath=ART+'/robot-'+kind+'-v1.blend');bpy.ops.render.render(write_still=True)
people=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else ['yusuf','emrehan']
for k in people:build(k)
# Render an actual contact-sheet preview in Blender (two image-textured planes).
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def contact_plane(name, image_path, x):
 bpy.ops.mesh.primitive_plane_add(size=1, location=(x,0,0)); o=bpy.context.object; o.name=name; o.scale=(1,1,1)
 m=bpy.data.materials.new(name+' material');m.use_nodes=True;n=m.node_tree.nodes;n.clear();out=n.new('ShaderNodeOutputMaterial');em=n.new('ShaderNodeEmission');tex=n.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(image_path,check_existing=False);m.node_tree.links.new(tex.outputs['Color'],em.inputs['Color']);m.node_tree.links.new(tex.outputs['Alpha'],em.inputs['Strength']);m.node_tree.links.new(em.outputs[0],out.inputs[0]);o.data.materials.append(m)
contact_plane('Yusuf contact',OUT+'/robot-yusuf-v1.png',-.5);contact_plane('Emrehan contact',OUT+'/robot-emrehan-v1.png',.5)
bpy.ops.object.camera_add(location=(0,0,2));cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=2;cam.rotation_euler=(0,0,0);bpy.context.scene.camera=cam
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=2048;scene.render.resolution_y=1024;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.film_transparent=False;scene.world.color=(.008,.01,.014);scene.render.filepath=ART+'/contact-sheet.png';bpy.ops.render.render(write_still=True)

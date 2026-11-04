import bpy, math, os
from mathutils import Vector
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'public', 'images', 'team')
BLEND = os.path.join(ROOT, 'scratch', 'team-avatar', 'team-avatars.blend')
os.makedirs(OUT, exist_ok=True); os.makedirs(os.path.dirname(BLEND), exist_ok=True)

def mat(name, color, rough=0.72, metallic=0):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True; p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1); p.inputs['Roughness'].default_value=rough; p.inputs['Metallic'].default_value=metallic; return m
ivory=mat('Warm ivory ceramic bone',(0.88,.79,.61)); dark=mat('Deep charcoal sockets',(.025,.034,.04)); teeth=mat('Pale bone teeth',(.96,.89,.73)); lime=mat('Electric lime',(.72,1,.005),.42); purple=mat('Dusty violet knit',(.36,.28,.51)); graphite=mat('Headphone graphite',(.09,.12,.14),.38,.15)
def ico(name, loc, scale, material, sub=2):
 bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=1, location=loc); o=bpy.context.object; o.name=name; o.scale=scale; o.data.materials.append(material); return o
def uv(name,loc,scale,material):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=1, location=loc); o=bpy.context.object; o.name=name; o.scale=scale; o.data.materials.append(material); return o
def rod(name,a,b,r,material,verts=8):
 d=Vector(b)-Vector(a); mid=(Vector(a)+Vector(b))/2; bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=d.length, location=mid); o=bpy.context.object; o.name=name; o.rotation_mode='QUATERNION'; o.rotation_quaternion=d.to_track_quat('Z','Y'); o.data.materials.append(material); return o
def clear(): bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def build(person):
 clear(); yusuf=person=='yusuf'; accent=lime if yusuf else purple
 # bust/shoulders and short neck
 ico('Shoulder mantle', (0,0,0.55),(1.06,.42,.42),ivory,2)
 ico('Neck', (0,-.01,.93),(.34,.32,.48),ivory,2)
 # skull and jaw create distinctive cranium + tapered jaw
 ico('Oversized faceted cranium',(0,0,2.05),(.79,.63,.86),ivory,2)
 ico('Jaw',(0,-.055,1.53),(.59,.53,.46),ivory,1)
 # cheek accents
 for s in [-1,1]:
  ico('Cheekbone',(s*.43,-.43,1.68),(.25,.15,.19),ivory,1)
  uv('Eye socket',(s*.285,-.565,2.08),(.23,.12,.30),dark)
 # nose cavity triangle-ish plus friendly curved smile teeth
 ico('Nasal cavity',(0,-.57,1.80),(.105,.07,.15),dark,1)
 # smile: dark shallow mouth and individual small teeth
 uv('Friendly smile',(0,-.548,1.48),(.29,.055,.105),dark)
 for i,x in enumerate([-.19,-.095,0,.095,.19]):
  uv('Tooth %d'%i,(x,-.603,1.49),(.043,.026,.052),teeth)
 # brow ridge
 for s in [-1,1]: rod('Brow ridge',(s*.08,-.58,2.40),(s*.48,-.47,2.38),.065,ivory)
 # ribs over chest, six paired ribs
 for z,w in [(1.12,.42),(.98,.48),(.84,.43),(.70,.34)]:
  for s in [-1,1]: rod('Rib',(s*.04,-.37,z),(s*w,-.37,z-.06),.045,ivory)
 rod('Sternum',(0,-.40,.72),(0,-.40,1.12),.055,ivory)
 # distinct accessories
 if yusuf:
  # headphone band across skull, ear cups either side
  for s in [-1,1]:
   uv('Headphone ear cup',(s*.77,-.03,2.04),(.17,.22,.27),graphite)
   uv('Lime earcup badge',(s*.82,-.22,2.04),(.07,.035,.09),lime)
  # arch band polyline segments
  pts=[(-.70,2.22),(-.58,2.61),(-.30,2.83),(0,2.90),(.30,2.83),(.58,2.61),(.70,2.22)]
  for a,b in zip(pts,pts[1:]): rod('Headphone headband',(a[0],-.015,a[1]),(b[0],-.015,b[1]),.065,graphite)
  # lime shoulder pin
  ico('Lime shoulder pin',(.72,-.39,.66),(.13,.05,.13),lime,1)
 else:
  # jaunty beanie with cuff and crown
  ico('Beanie crown',(0,.025,2.76),(.72,.59,.36),accent,2)
  rod('Beanie cuff',(-.65,-.03,2.52),(.65,-.03,2.52),.11,accent)
  ico('Beanie pom',(0,.02,3.10),(.13,.13,.13),accent,1)
  ico('Beanie badge',(.36,-.50,2.69),(.12,.045,.10),lime,1)
 # camera / transparent world
 bpy.ops.object.camera_add(location=(3.35,-8.8,3.25)); cam=bpy.context.object; cam.name='Portrait Camera'; target=Vector((0,0,1.67)); cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler(); cam.data.type='ORTHO'; cam.data.ortho_scale=4.05; bpy.context.scene.camera=cam
 def area(name,loc,power,size,color,target):
  bpy.ops.object.light_add(type='AREA', location=loc); o=bpy.context.object; o.name=name; o.data.energy=power; o.data.shape='DISK'; o.data.size=size; o.data.color=color; o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
 area('Large soft key',(-4,-5,6),470,4.5,(1,.82,.61),(0,0,1.7)); area('Cool fill',(4,-4,3),300,3.5,(.62,.78,1),(0,0,1.7)); area('Rim',(0,3,5),520,3,(.72,1,.14 if yusuf else .42),(0,0,1.9))
 sc=bpy.context.scene; sc.render.engine='CYCLES'; sc.cycles.samples=24; sc.render.resolution_x=768; sc.render.resolution_y=768; sc.render.resolution_percentage=100; sc.render.image_settings.file_format='PNG'; sc.render.image_settings.color_mode='RGBA'; sc.render.film_transparent=True; sc.world.color=(.015,.015,.015)
 sc.view_settings.view_transform='AgX'; sc.render.filepath=os.path.join(OUT,('yusuf-okuducu' if yusuf else 'emrehan-dalaman')+'.png')
 bpy.ops.wm.save_as_mainfile(filepath=BLEND if yusuf else BLEND.replace('.blend','-emrehan.blend'))
 bpy.ops.render.render(write_still=True)
for p in ['yusuf','emrehan']: build(p)
# leave shared editable scene with Emrehan, plus per-person scene saves above

"""Run with Blender in background; render textured 3D foil geometry."""
import bpy,sys,math,json
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[1];args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
kind=args[0] if args else 'desktop';directory=ROOT/'release/balloon-film'/kind
meta=json.loads((directory/'meta.json').read_text());W,H=meta['width'],meta['height']
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE_NEXT';scene.eevee.taa_render_samples=8;scene.cycles.samples=20
scene.cycles.use_denoising=True;scene.cycles.use_adaptive_sampling=True;scene.cycles.adaptive_threshold=.08
scene.render.resolution_x=1920 if kind=='desktop' else 900;scene.render.resolution_y=1200 if kind=='desktop' else 1600;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=True
scene.world.color=(.7,.7,.7);scene.view_settings.view_transform='Standard';scene.view_settings.look='None'
world=scene.world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.7,.72,.76,1);world.node_tree.nodes['Background'].inputs[1].default_value=.6
# Studio reflection cards in an equirectangular environment, independent of resolution.
y,x=np.mgrid[0:256,0:512].astype(float);u=x/512;v=y/256
env=np.zeros((256,512,4),dtype='float32');env[:,:,:3]=(.035,.042,.048);env[:,:,3]=1
for ux,vy,sx,sy,color in [(.18,.42,.045,.28,(3.5,3.7,4.0)),(.68,.48,.028,.34,(2.8,3.4,2.1)),(.42,.20,.15,.035,(2.4,2.3,2.4))]:
    g=np.exp(-((u-ux)/sx)**8-((v-vy)/sy)**8)
    env[:,:,:3]+=g[:,:,None]*np.array(color)
im=bpy.data.images.new('Studio reflection cards',512,256,float_buffer=True);im.pixels.foreach_set(env.ravel());im.update()
wtex=world.node_tree.nodes.new('ShaderNodeTexEnvironment');wtex.image=im;world.node_tree.links.new(wtex.outputs['Color'],world.node_tree.nodes['Background'].inputs[0])
bpy.ops.object.camera_add(location=(0,0,12));camera=bpy.context.object;camera.rotation_euler=(0,0,0);camera.data.type='ORTHO';camera.data.ortho_scale=W;camera.data.sensor_fit='HORIZONTAL';scene.camera=camera
def area(name,loc,power,color,size,sizex=None):
    bpy.ops.object.light_add(type='AREA',location=loc);obj=bpy.context.object;obj.name=name;obj.data.energy=power;obj.data.color=color;obj.data.shape='RECTANGLE';obj.data.size=size;obj.data.size_y=sizex or size
    from mathutils import Vector
    obj.rotation_euler=(Vector((0,0,0))-obj.location).to_track_quat('-Z','Y').to_euler()
area('Large softbox',(-4,3,7),300,(.95,.98,1),5,3)
area('Long reflection strip',(4,1,4),250,(.93,1,.85),1.5,7)
area('Low white bounce',(-1,-5,4),220,(1,.95,.98),4,1)
area('Fine highlight',(0,4,5),200,(1,1,1),.6,4)
mat=bpy.data.materials.new('Woven metallic foil');mat.use_nodes=True
n=mat.node_tree.nodes;l=mat.node_tree.links;bs=n.get('Principled BSDF');bs.inputs['Base Color'].default_value=(.58,.63,.58,1);bs.inputs['Metallic'].default_value=.84;bs.inputs['Roughness'].default_value=.25;bs.inputs['Coat Weight'].default_value=.24;bs.inputs['Coat Roughness'].default_value=.15
tex=n.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=230;tex.inputs['Detail'].default_value=2;tex.inputs['Roughness'].default_value=.65
bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.12;bump.inputs['Distance'].default_value=.006;l.new(tex.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs['Normal'],bs.inputs['Normal'])
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-1.6));floor=bpy.context.object
white=bpy.data.materials.new('White cyclorama');white.diffuse_color=(1,1,1,1);white.use_nodes=True;white.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(1,1,1,1);white.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.8;floor.data.materials.append(white);floor.hide_render=True
scene.use_nodes=True;tree=scene.node_tree;tree.nodes.clear();layers=tree.nodes.new('CompositorNodeRLayers');over=tree.nodes.new('CompositorNodeAlphaOver');over.inputs[1].default_value=(1,1,1,1);tree.links.new(layers.outputs['Image'],over.inputs[2]);out=tree.nodes.new('CompositorNodeComposite');tree.links.new(over.outputs[0],out.inputs[0])
obj=bpy.data.objects.new('Soft inflated m0n0',bpy.data.meshes.new('Balloon surface'));bpy.context.collection.objects.link(obj)
modifier=obj.modifiers.new('Relaxed foil skin','SMOOTH');modifier.factor=.65;modifier.iterations=4

output=directory/'frames';output.mkdir(exist_ok=True)
frames=[int(x) for x in args[1:]] if len(args)>1 else range(0,meta['frames'],2)
for frame in frames:
    data=np.load(directory/f'{frame:04d}.npz');old=obj.data;mesh=bpy.data.meshes.new('Pressure surface');mesh.from_pydata(data['vertices'].tolist(),[],data['faces'].tolist());mesh.materials.append(mat)
    for p in mesh.polygons:p.use_smooth=True
    obj.data=mesh;bpy.data.meshes.remove(old)
    scene.render.filepath=str(output/f'{frame:04d}.png');bpy.ops.render.render(write_still=True)
    print('FILM_FRAME',kind,frame,flush=True)

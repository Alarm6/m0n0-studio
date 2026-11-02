"""Four distinct animated actions, composited from generated artwork layers."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageChops
import numpy as np
import math,json,sys

ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'dist/assets/motion'
W,H,N=384,256,96
TAU=math.pi*2
RES=Image.Resampling.LANCZOS
Y,X=np.mgrid[0:H,0:W].astype(float)

def smooth(t):
    t=max(0,min(1,t));return t*t*(3-2*t)

def load(folder,name):
    im=Image.open(ROOT/'artwork'/folder/(name+'.png')).convert('RGBA')
    box=im.getchannel('A').point(lambda a:255 if a>20 else 0).getbbox()
    return im.crop(box),box

def fit(im,w,h):
    scale=min(w/im.width,h/im.height)
    return im.resize((round(im.width*scale),round(im.height*scale)),RES),scale

def backdrop(a,b):
    top=np.array(a);bottom=np.array(b);v=(Y/H)[...,None]
    data=np.broadcast_to(top*(1-v)+bottom*v,(H,W,3)).astype('uint8')
    return Image.fromarray(data).convert('RGBA')

def place(canvas,im,cx,cy):canvas.alpha_composite(im,(round(cx-im.width/2),round(cy-im.height/2)))

def glow(canvas,x,y,r,color,alpha):
    layer=Image.new('RGBA',(W,H));d=ImageDraw.Draw(layer)
    d.ellipse((x-r,y-r,x+r,y+r),fill=(*color,round(alpha)))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(r*.6)))

avatar,avatarbox=load('generated','chrome-avatar');head,hs=fit(avatar,W*.82,H*.87)
gum,_=load('actions','gum-bubble')
monster,monsterbox=load('generated','vinyl-creature-open');dragon,ds=fit(monster,W*.68,H*.86)
fire,_=load('actions','dragon-flame')

# Eight generated walking poses, on a common baseline and at identical scale.
sheet=Image.open(ROOT/'artwork/actions/cat-walk-sheet.png').convert('RGBA')
catposes=[]
for row in range(2):
    for col in range(4):
        tile=sheet.crop((round(col*sheet.width/4),round(row*sheet.height/2),round((col+1)*sheet.width/4),round((row+1)*sheet.height/2)))
        bbox=tile.getchannel('A').point(lambda a:255 if a>25 else 0).getbbox()
        body=tile.crop(bbox);scale=124/(sheet.width/4)
        body=body.resize((round(body.width*scale),round(body.height*scale)),RES)
        pose=Image.new('RGBA',(140,112));pose.alpha_composite(body,((140-body.width)//2,108-body.height));catposes.append(pose)

car,carbox=load('generated','silver-coupe');coupe,cs=fit(car,W*.93,H*.61)
plate=Image.open(ROOT/'artwork/actions/forest-road.png').convert('RGB')
plate=plate.resize((round(plate.width*H/plate.height),H),RES)
roadtile=np.concatenate([np.asarray(plate),np.asarray(ImageOps.mirror(plate))],axis=1)
# Long-exposure tracking shot: blend horizontally, preserving green light bands.
roadtile=sum(np.roll(roadtile.astype(float),shift,axis=1) for shift in range(-60,61,3))/41
roadtile=np.asarray(Image.fromarray(roadtile.astype('uint8')).filter(ImageFilter.GaussianBlur(1.2)))
roadwidth=roadtile.shape[1]

def roadframe(u):
    # Integer pan periods make all three depth layers exactly cyclic.
    far=np.roll(roadtile,-round(u*roadwidth),axis=1)[:,:W]
    near=np.roll(roadtile,-round(u*roadwidth*2),axis=1)[:,:W]
    foreground=np.roll(roadtile,-round(u*roadwidth*3),axis=1)[:,:W]
    out=far.astype(float)
    roadmask=np.clip((Y/H-.65)/.04,0,1)[...,None]
    out=out*(1-roadmask)+near*roadmask
    grassmask=np.clip((Y/H-.85)/.04,0,1)[...,None]
    out=out*(1-grassmask)+foreground*grassmask
    return Image.fromarray(out.astype('uint8')).convert('RGBA')

def avatar_frame(u):
    scene=backdrop((253,251,253),(237,241,249))
    cy=H*.49+1.5*math.sin(TAU*u);place(scene,head,W/2,cy)
    mouthx=W/2-head.width/2+(600-avatarbox[0])*hs
    mouthy=cy-head.height/2+(1000-avatarbox[1])*hs
    start,pop=.10,.73
    if start<=u<pop:
        size=5+91*smooth((u-start)/.48)
        # Elastic pulsation while the fully inflated bubble is held.
        if u>.58:size+=1.3*math.sin((u-.58)*TAU*6)
        bubble=gum.resize((round(size),round(size*.96)),RES)
        place(scene,bubble,mouthx,mouthy+3)
    elif pop<=u<.88:
        t=(u-pop)/.15;diam=96+18*t
        bubble=gum.resize((round(diam),round(diam)),RES)
        mask=Image.new('L',bubble.size,255);d=ImageDraw.Draw(mask);r=diam*.70*smooth(t)
        d.ellipse((diam/2-r,diam/2-r,diam/2+r,diam/2+r),fill=0)
        alpha=ImageChops.multiply(bubble.getchannel('A'),mask).point(lambda a:round(a*(1-t)))
        bubble.putalpha(alpha);place(scene,bubble,mouthx,mouthy+3)
        bits=Image.new('RGBA',(W,H));d=ImageDraw.Draw(bits)
        for i in range(7):
            a=TAU*i/7;radius=46+20*t;x=mouthx+math.cos(a)*radius;y=mouthy+3+math.sin(a)*radius
            rr=2.5*(1-t);d.ellipse((x-rr,y-rr,x+rr,y+rr),fill=(255,155,193,round(170*(1-t))))
        scene.alpha_composite(bits)
    return scene.convert('RGB')

def dragon_frame(u):
    scene=backdrop((255,60,30),(236,39,17))
    env=math.sin(math.pi*(u-.15)/.65)**.8 if .15<u<.80 else 0
    recoil=3*env
    cx=W*.56+recoil;cy=H*.49
    place(scene,dragon,cx,cy)
    mx=cx-dragon.width/2+(470/1280*1254-monsterbox[0])*ds
    my=cy-dragon.height/2+(325/1280*1254-monsterbox[1])*ds
    if env>.02:
        flicker=1+.08*math.sin(TAU*u*13)+.04*math.sin(TAU*u*23)
        fw=max(3,round(145*env*flicker));fh=max(3,round(61*math.sqrt(env)*(1+.12*math.sin(TAU*u*11))))
        plume=fire.resize((fw,fh),RES)
        plume=plume.rotate(3*math.sin(TAU*u*8),resample=Image.Resampling.BICUBIC,center=(fw-1,fh/2),expand=False)
        glow(scene,mx-22,my,29,(255,198,47),55*env)
        # Generated asset's narrow right-hand tip is anchored to the mouth.
        scene.alpha_composite(plume,(round(mx-fw+3),round(my-fh*.78)))
        sparks=Image.new('RGBA',(W,H));d=ImageDraw.Draw(sparks)
        for i in range(6):
            life=(u*4+i/6)%1;x=mx-life*140*env;y=my-18*math.sin(math.pi*life)+(i-3)*2
            rr=(1-life)*1.6;d.ellipse((x-rr,y-rr,x+rr,y+rr),fill=(255,221,88,round(190*env*(1-life))))
        scene.alpha_composite(sparks)
    return scene.convert('RGB')

def cats_frame(u):
    scene=backdrop((107,145,153),(69,111,121))
    states=[]
    for i in range(3):
        a=TAU*(u+i/3);depth=math.sin(a);cx=W/2+86*math.cos(a);cy=H*.48+42*depth
        states.append((cy,i,a,depth,cx,cy))
    for _,i,a,depth,cx,cy in sorted(states):
        step=(u*6+i*.29)%1;pose=catposes[int(step*8)%8]
        if -math.sin(a)<0:pose=ImageOps.mirror(pose)
        scale=.94+.15*depth
        # Turn edge-on at the two ends of the oval, without a sudden flip.
        turn=.75+.25*abs(math.sin(a))
        pw=max(12,round(pose.width*scale*turn));ph=round(pose.height*scale)
        art=pose.resize((pw,ph),RES).rotate(5*math.cos(a),resample=Image.Resampling.BICUBIC,expand=True)
        cy+=1.1*math.sin(step*TAU*2)
        glow(scene,cx,cy+ph*.36,18*scale,(36,78,84),90)
        place(scene,art,cx,cy)
    return scene.convert('RGB')

def coupe_frame(u):
    scene=roadframe(u);bob=.65*math.sin(TAU*u*4)
    carframe=coupe.copy()
    # Rotate just the alloy hubs, leaving the body, tyres and fenders intact.
    for ox,oy in [(435,791),(1071,790)]:
        cx=(ox-carbox[0])*cs;cy=(oy-carbox[1])*cs;r=76*cs
        box=(round(cx-r),round(cy-r),round(cx+r),round(cy+r))
        hub=carframe.crop(box)
        samples=[np.asarray(hub.rotate(-u*360*12-angle,resample=Image.Resampling.BICUBIC)).astype(float) for angle in range(0,360,15)]
        wheel=Image.fromarray(np.mean(samples,axis=0).astype('uint8')).filter(ImageFilter.GaussianBlur(.35))
        mask=Image.new('L',wheel.size);ImageDraw.Draw(mask).ellipse((1,1,wheel.width-2,wheel.height-2),fill=255)
        wheel.putalpha(ImageChops.multiply(wheel.getchannel('A'),mask));carframe.alpha_composite(wheel,(box[0],box[1]))
    shadow=Image.new('RGBA',(W,H));ImageDraw.Draw(shadow).ellipse((30,H*.81,W-25,H*.87),fill=(0,0,0,80));scene.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(4)))
    place(scene,carframe,W/2,H*.84-carframe.height/2+bob)
    return scene.convert('RGB')

functions={'chrome-avatar':avatar_frame,'vinyl-creature':dragon_frame,'orange-cats':cats_frame,'silver-coupe':coupe_frame}
manifest=[];preview=Image.new('RGB',(W*4,H*4+100),'#eee');draw=ImageDraw.Draw(preview)
for row,(name,render) in enumerate(functions.items()):
    if '--dragon-only' in sys.argv and name!='vinyl-creature':continue
    frames=[render(i/N) for i in range(N)]
    filename=name+('-v2' if name=='chrome-avatar' else '-v4' if name=='vinyl-creature' else '-v3')
    frames[round(N*.5)].save(OUT/f'{filename}-poster.webp',quality=88)
    frames[0].save(OUT/f'{filename}.webp',save_all=True,append_images=frames[1:],duration=42,loop=0,quality=75,method=4,minimize_size=True)
    small=[im.resize((256,171),RES) for im in frames]
    atlas=Image.new('RGB',(64*12,43*8))
    for i,im in enumerate(small):atlas.paste(im.resize((64,43)),((i%12)*64,(i//12)*43))
    palette=atlas.quantize(colors=128,method=Image.Quantize.MEDIANCUT)
    indexed=[im.quantize(palette=palette,dither=Image.Dither.FLOYDSTEINBERG) for im in small]
    indexed[0].save(OUT/f'{filename}.gif',save_all=True,append_images=indexed[1:],duration=40,loop=0,disposal=2,optimize=True)
    gif=Image.open(OUT/f'{filename}.gif');webp=Image.open(OUT/f'{filename}.webp')
    assert gif.n_frames>1 and webp.n_frames>1 and gif.info.get('loop')==0 and webp.info.get('loop')==0
    for col,n in enumerate([0,24,48,72]):preview.paste(frames[n],(col*W,row*(H+25)))
    draw.text((8,row*(H+25)+H+5),filename,fill='black')
    entry={'name':name,'file':filename,'webp':f'assets/motion/{filename}.webp','gif':f'assets/motion/{filename}.gif','poster':f'assets/motion/{filename}-poster.webp','frames':N,'duration_ms':4032,'webp_bytes':(OUT/f'{filename}.webp').stat().st_size,'gif_bytes':(OUT/f'{filename}.gif').stat().st_size}
    manifest.append(entry);print(filename,entry['webp_bytes'],'WebP bytes;',entry['gif_bytes'],'GIF bytes',flush=True)
preview.save(ROOT/('artwork/dragon-loop-preview.jpg' if '--dragon-only' in sys.argv else 'artwork/action-loops-preview.jpg'),quality=92)
(OUT/('dragon-v4.json' if '--dragon-only' in sys.argv else 'actions-v2.json')).write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Verified four new infinite action loops',flush=True)

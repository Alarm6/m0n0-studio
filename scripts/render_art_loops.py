"""Render seamless animated artwork from the seven generated RGBA cutouts.

This is animation/compositing for the requested GIF deliverables, not a substitute
for image generation. Original art is preserved in artwork/generated/.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import numpy as np
import math, json

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'dist/assets/motion';OUT.mkdir(parents=True,exist_ok=True)
W,H,N=384,256,48
NAMES=['rope-bag','chrome-avatar','gamepad','orange-cats','jade-figure','vinyl-creature','silver-coupe']
DESCRIPTIONS=['Оливковая сумка с плетёной ручкой','Хромированный fashion-аватар','Серебристый игровой контроллер','Три светящихся оранжевых кота','Фигурка из зелёного мраморного материала','Изумрудный виниловый монстр','Серебристое спортивное купе']
Y,X=np.mgrid[0:H,0:W].astype(float)
rng=np.random.default_rng(170)
grain=rng.normal(0,.6,(H,W,1))

def gradient(top,bottom,phase=0,kind=0):
    a=np.array(top);b=np.array(bottom)
    k=(Y/H)[...,None]
    base=np.broadcast_to(a*(1-k)+b*k,(H,W,3)).copy()
    if kind==2:
        glow=np.exp(-(((X-W*.35)/W*.9)**2+((Y-H*.2)/H)**2)*4)[...,None]
        base+=glow*np.array([12,19,25])*(.9+.1*math.sin(phase))
    if kind==3:
        base+=np.exp(-(((X-W*.5)/W)**2+((Y-H*.5)/H)**2)*5)[...,None]*np.array([8,7,2])
    return Image.fromarray(np.clip(base+grain,0,255).astype('uint8'),'RGB').convert('RGBA')

# Periodic forest texture, scrolling exactly one period per loop.
FW=W*3
fy,fx=np.mgrid[0:H,0:FW].astype(float)
field=np.zeros((H,FW))
for k in [1,2,3,5,8,13,21,34]:
    row=rng.uniform(0,2*math.pi,(H,1));amp=1/math.sqrt(k)
    # Smooth vertical structure gives the pan recognizable forest streaks.
    rowim=Image.fromarray(np.uint8(row/(2*math.pi)*255)).resize((1,H)).filter(ImageFilter.GaussianBlur(13))
    smoothrow=np.array(rowim).astype(float)/255*2*math.pi
    field+=amp*np.sin(2*math.pi*k*fx/FW+smoothrow)
field=(field-field.min())/(field.max()-field.min())
forest=np.zeros((H,FW,3))
for ch,(a,b) in enumerate([(10,114),(35,155),(26,73)]):forest[:,:,ch]=a+field*(b-a)
forest*=np.clip(.65+fy/H*.55,.6,1.2)[...,None]
road=(fy>H*.77)&(fy<H*.85)
forest[road]=forest[road]*.25+np.array([91,102,89])*.75
forest=np.clip(forest,0,255).astype('uint8')

def background(index,phase):
    if index==0:return gradient((253,253,250),(229,232,220))
    if index==1:return gradient((253,251,253),(237,241,249))
    if index==2:return gradient((38,66,90),(13,27,45),phase,2)
    if index==3:return gradient((107,145,153),(69,111,121),phase,3)
    if index==4:return gradient((4,7,3),(11,17,6))
    if index==5:return gradient((255,60,30),(236,39,17))
    offset=round(phase/(2*math.pi)*FW)%FW
    return Image.fromarray(np.roll(forest,-offset,axis=1)[:,:W],'RGB').convert('RGBA')

def make_shadow(canvas,cx,cy,width,opacity=30):
    layer=Image.new('RGBA',(W,H));d=ImageDraw.Draw(layer)
    d.ellipse((cx-width/2,cy-6,cx+width/2,cy+6),fill=(0,0,0,opacity))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(8)))

manifest=[]
for index,name in enumerate(NAMES):
    source=Image.open(ROOT/'artwork/generated'/f'{name}.png').convert('RGBA')
    bounds=source.getchannel('A').point(lambda a:255 if a>20 else 0).getbbox()
    source=source.crop(bounds)
    maxw,maxh=(W*.88,H*.86) if index<6 else (W*.93,H*.61)
    ratio=min(maxw/source.width,maxh/source.height)
    base=source.resize((round(source.width*ratio),round(source.height*ratio)),Image.Resampling.LANCZOS)
    frames=[]
    for n in range(N):
        phase=2*math.pi*n/N
        canvas=background(index,phase)
        s=1.;angle=0.;dx=0.;dy=0.
        if index==0:angle=1.5*math.sin(phase);dy=3*math.sin(phase);s=1+.012*math.cos(phase)
        elif index==1:angle=1.6*math.sin(phase);dx=2*math.sin(phase);dy=3*math.cos(phase);s=1+.01*math.sin(phase)
        elif index==2:angle=3.5*math.sin(phase);dy=6*math.sin(phase);s=1+.025*math.cos(phase)
        elif index==3:angle=3*math.sin(phase);dy=3*math.cos(phase);s=1+.025*math.sin(phase)
        elif index==4:angle=2.8*math.sin(phase);dy=1.5*math.cos(phase);s=1+.015*math.sin(phase)
        elif index==5:angle=2*math.sin(phase);dy=1.5*math.cos(phase);s=1+.018*math.sin(phase)
        else:angle=.28*math.sin(phase*2);dy=.9*math.sin(phase*4)
        art=base.resize((round(base.width*s),round(base.height*s)),Image.Resampling.LANCZOS)
        art=art.rotate(angle,resample=Image.Resampling.BICUBIC,expand=True)
        cx=W/2+dx;cy=H*.49+dy if index<6 else H*.84-art.height/2+dy
        if index not in (1,2,3):make_shadow(canvas,cx,H*.935 if index<6 else H*.845,base.width*.7,20 if index!=4 else 85)
        if index==3:
            halo=Image.new('RGBA',(W,H));halo.alpha_composite(art,(round(cx-art.width/2),round(cy-art.height/2)))
            alpha=halo.getchannel('A').filter(ImageFilter.GaussianBlur(7))
            alpha=alpha.point(lambda a:round(a*(.32+.14*math.sin(phase))))
            light=Image.new('RGBA',(W,H),(255,81,9,0));light.putalpha(alpha);canvas.alpha_composite(light)
        canvas.alpha_composite(art,(round(cx-art.width/2),round(cy-art.height/2)))
        frames.append(canvas.convert('RGB'))
    duration=63
    frames[0].save(OUT/f'{name}-poster.webp',quality=88,method=5)
    frames[0].save(OUT/f'{name}.webp',save_all=True,append_images=frames[1:],duration=duration,loop=0,quality=73,method=4,minimize_size=True)
    small=[f.resize((256,171),Image.Resampling.LANCZOS) for f in frames]
    atlas=Image.new('RGB',(64*8,43*6))
    for i,im in enumerate(small):atlas.paste(im.resize((64,43)),((i%8)*64,(i//8)*43))
    palette=atlas.quantize(colors=128,method=Image.Quantize.MEDIANCUT)
    indexed=[im.quantize(palette=palette,dither=Image.Dither.FLOYDSTEINBERG) for im in small]
    indexed[0].save(OUT/f'{name}.gif',save_all=True,append_images=indexed[1:],duration=60,loop=0,optimize=True,disposal=2)
    gif=Image.open(OUT/f'{name}.gif');webp=Image.open(OUT/f'{name}.webp')
    assert gif.n_frames==N and gif.info.get('loop')==0
    # The WebP encoder may merge adjacent visually identical frames.
    assert webp.n_frames>1 and webp.info.get('loop')==0
    record={'id':index+1,'name':name,'alt':DESCRIPTIONS[index],'webp':f'assets/motion/{name}.webp','gif':f'assets/motion/{name}.gif','poster':f'assets/motion/{name}-poster.webp','frames':N,'duration_ms':N*duration,'webp_bytes':(OUT/f'{name}.webp').stat().st_size,'gif_bytes':(OUT/f'{name}.gif').stat().st_size}
    manifest.append(record);print(name,record['webp_bytes'],'WebP bytes;',record['gif_bytes'],'GIF bytes',flush=True)
Path(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
sheet=Image.new('RGB',(W*3,H*3+80),'#eeeeee');d=ImageDraw.Draw(sheet)
for i,item in enumerate(manifest):
    im=Image.open(OUT/f"{item['name']}-poster.webp").convert('RGB');x=(i%3)*W;y=(i//3)*(H+25);sheet.paste(im,(x,y));d.text((x+10,y+H+5),item['name'],fill='black')
sheet.save(ROOT/'artwork/loops-preview.jpg',quality=92)
print('Verified seven infinite GIF and animated WebP loops',flush=True)

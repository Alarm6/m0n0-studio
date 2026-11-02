"""Offline soft-volume geometry for the two responsive balloon films."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from scipy.ndimage import distance_transform_edt,map_coordinates
from skimage.measure import marching_cubes
import numpy as np,json,math,sys
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'release/balloon-film';OUT.mkdir(parents=True,exist_ok=True)
N=144;FPS=24
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',300)
sdfs=[]
for glyph in 'm0n0':
    im=Image.new('L',(1024,1024));d=ImageDraw.Draw(im);box=d.textbbox((0,0),glyph,font=font)
    h=box[3]-box[1];w=box[2]-box[0]
    d.text((512-w/2-box[0],512-h/2-box[1]),glyph,font=font,fill=255)
    mask=np.array(im)>127
    sdfs.append(((distance_transform_edt(~mask)-distance_transform_edt(mask))/h).astype('float32'))

def smooth(t):t=max(0,min(1,t));return t*t*(3-2*t)
def smax(a,b,k):h=np.maximum(k-np.abs(a-b),0)/k;return np.maximum(a,b)+h*h*k*.25

for kind,W,H in [('desktop',9.6,6),('mobile',5.4,9.6)]:
    directory=OUT/kind;directory.mkdir(exist_ok=True)
    nx=184 if kind=='desktop' else 112;ny=116 if kind=='desktop' else 194;nz=40
    xs=np.linspace(-W/2-.1,W/2+.1,nx);ys=np.linspace(-H/2-.1,H/2+.1,ny);zs=np.linspace(-1.55,1.55,nz)
    X,Y=np.meshgrid(xs,ys,indexing='ij');Z=zs[None,None,:]
    home=[(2.5,-.55),(3.15,.3),(3.65,-.9),(4.2,-.05)] if kind=='desktop' else [(.7,-2.1),(1.4,-1.35),(1.25,-3.0),(2.0,-2.35)]
    final=[(-W/4,H/4),(W/4,H/4),(-W/4,-H/4),(W/4,-H/4)]
    for frame in range(N):
        t=frame/FPS;blend=smooth((t-1.5)/3.5)
        vertices=[];faces=[];offset=0
        for i,source in enumerate(sdfs):
            grow=smooth((t-1.5-i*.12)/3.2)
            cx=home[i][0]*(1-blend)+final[i][0]*blend;cy=home[i][1]*(1-blend)+final[i][1]*blend
            drift=(math.sin(t*2*math.pi/1.5+i*1.8)*.065)*(1-blend)
            cy+=drift;cx+=math.sin(t*2*math.pi/1.5+i*.9)*.025*(1-blend)
            angle=[-.13,.1,-.14,.12][i]*(1-blend)
            gx=(X-cx)*math.cos(angle)+(Y-cy)*math.sin(angle);gy=-(X-cx)*math.sin(angle)+(Y-cy)*math.cos(angle)
            base=.82 if kind=='desktop' else .84;size=base+(3.05-base)*grow if kind=='desktop' else base+(4.0-base)*grow
            stretch=(1+[.12,.50,.85,.50][i]*grow) if kind=='desktop' else (1+[-.45,-.33,-.18,-.33][i]*grow)
            # Actual surface growth fills counters rather than scaling a picture.
            thickness=.075+(.85 if kind=='desktop' else .80)*grow
            bbox=font.getbbox('m0n0'[i]);glyphh=bbox[3]-bbox[1]
            extentx=size*stretch*(bbox[2]-bbox[0])/glyphh*.62+thickness+.16
            extenty=size*.62+thickness+.16
            xs=np.linspace(max(-W/2-.1,cx-extentx),min(W/2+.1,cx+extentx),nx)
            ys=np.linspace(max(-H/2-.1,cy-extenty),min(H/2+.1,cy+extenty),ny)
            X,Y=np.meshgrid(xs,ys,indexing='ij')
            gx=(X-cx)*math.cos(angle)+(Y-cy)*math.sin(angle);gy=-(X-cx)*math.sin(angle)+(Y-cy)*math.cos(angle)
            samplex=512+gx/size/stretch*glyphh;sampley=512-gy/size*glyphh
            dist=map_coordinates(source,[sampley,samplex],order=1,mode='nearest')*size-thickness
            # Growing neighbours and frame walls compress each volume into its cell.
            pressure=smooth((blend-.38)/.48)
            if pressure>0:
                sx=-1 if i%2==0 else 1;sy=1 if i<2 else -1
                constraints=[.012-sx*(X-.20*np.sin(Y*.8)-.06*np.sin(Y*2)),.012-sy*(Y-.16*np.sin(X*.9)-.05*np.sin(X*2)),np.abs(X)-(W/2-.02),np.abs(Y)-(H/2-.02)]
                for plane in constraints:dist=smax(dist,plane-(1-pressure)*8,.13)
            depth=.27+.48*grow
            field=dist[:,:,None]+(Z/depth)**2*.48
            # Small local folds gather at seams; these are geometry, not a blur.
            edge=np.exp(-np.abs(dist)/.10)[:,:,None]
            wave=np.sin(gx[:,:,None]*32+gy[:,:,None]*11+Z*12)*np.sin(gy[:,:,None]*19-gx[:,:,None]*7)
            field+=edge*wave*(.006+.013*grow)
            try:v,f,_,_=marching_cubes(field,0,spacing=(xs[1]-xs[0],ys[1]-ys[0],zs[1]-zs[0]))
            except ValueError:continue
            v+=np.array([xs[0],ys[0],zs[0]])
            vertices.append(v.astype('float32'));faces.append(f.astype('int32')+offset);offset+=len(v)
        np.savez(directory/f'{frame:04d}.npz',vertices=np.concatenate(vertices),faces=np.concatenate(faces))
        if frame%24==0:print(kind,frame,'/',N,flush=True)
    (directory/'meta.json').write_text(json.dumps({'width':W,'height':H,'frames':N,'fps':FPS}),encoding='utf-8')
print('Two geometry sequences ready',flush=True)

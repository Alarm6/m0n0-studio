"""Encode actual browser captures into compact seamless portfolio previews."""
from pathlib import Path
from PIL import Image
import subprocess,json,sys
ROOT=Path(__file__).resolve().parents[1];RAW=ROOT/'release/portfolio-capture';OUT=ROOT/'dist/assets/projects';OUT.mkdir(parents=True,exist_ok=True)
projects=[('plusproduct',9.0,80),('yaki-supreme',7.5,28),('emk',9.0,65),('horyy',8.0,60),('character',9.0,65)]
updating='--updated' in sys.argv
manifest=json.loads((OUT/'manifest.json').read_text()) if updating else []
for name,duration,poster in projects:
    if updating and name not in ['yaki-supreme','emk','character']:continue
    folder=RAW/(name+'-v2' if updating else name);files=sorted(folder.glob('[0-9][0-9][0-9][0-9].png'));times=json.loads((folder/'timing.json').read_text());assert len(times)==len(files)
    intervals=[max(.01,(b-a)/1000) for a,b in zip(times,times[1:])];intervals.append(intervals[-1]);scale=(duration-.5)/sum(intervals)
    entries=['ffconcat version 1.0']
    for path,delta in zip(files,intervals):entries.extend(["file '"+path.resolve().as_posix()+"'",f'duration {delta*scale:.6f}'])
    # Cross-fade only the seam, retaining the recorded interaction throughout.
    for i in range(12):
        a=Image.open(files[-12+i]).convert('RGB');b=Image.open(files[i]).convert('RGB');blend=Image.blend(a,b,(i+1)/12);path=folder/f'seam-{i:02d}.png';blend.save(path,format='JPEG',quality=97)
        entries.extend(["file '"+path.resolve().as_posix()+"'",'duration 0.0416667'])
    entries.append("file '"+path.resolve().as_posix()+"'");listing=folder/'loop.ffconcat';listing.write_text('\n'.join(entries),encoding='utf-8')
    output=OUT/f'{name}-v{2 if updating else 1}.mp4'
    filters='crop=trunc((iw-16)/2)*2:trunc(ih/2)*2:0:0,scale=1280:720:flags=lanczos,format=yuv420p,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1'
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','warning','-y','-safe','0','-i',str(listing),'-vf',filters,'-c:v','libx264','-preset','medium','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(output)],check=True)
    image=Image.open(folder/f'{poster:04d}.png').convert('RGB');image=image.crop((0,0,(image.width-16)//2*2,image.height//2*2)).resize((1280,720),Image.Resampling.LANCZOS);image.save(OUT/f'{name}-v2-poster.webp' if updating else OUT/f'{name}-poster.webp',quality=88)
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,width,height,nb_frames','-of','json',str(output)]))
    record={'id':name,'file':output.name,'bytes':output.stat().st_size,'duration':float(probe['format']['duration']),'stream':probe['streams'][0],'captured_frames':len(files),'captured_ms':times[-1]};manifest=[r for r in manifest if r['id']!=name];manifest.append(record);print(record,flush=True)
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')

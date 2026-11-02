"""Encode the offline renders as compact, progressively playable H.264 films."""
from pathlib import Path
from PIL import Image
import subprocess,json,shutil,sys
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'dist/assets/balloon-film';OUT.mkdir(parents=True,exist_ok=True)
manifest=json.loads((OUT/'manifest.json').read_text()) if (OUT/'manifest.json').exists() else []
for kind in (sys.argv[1:] or ['desktop','mobile']):
    manifest=[entry for entry in manifest if entry['variant']!=kind]
    folder=ROOT/'release/balloon-film'/kind/'frames';sequence=folder.parent/'sequence';sequence.mkdir(exist_ok=True)
    for i,frame in enumerate(range(0,144,2)):
        source=folder/f'{frame:04d}.png'
        if not source.exists():raise FileNotFoundError(source)
        shutil.copyfile(source,sequence/f'{i:04d}.png')
    filename=OUT/f'{kind}-v1.mp4'
    # Motion-compensated intermediate frames keep pressure expansion smooth.
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','warning','-y','-framerate','12','-i',str(sequence/'%04d.png'),'-vf','minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1','-c:v','libx264','-preset','slow','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(filename)],check=True)
    first=Image.open(folder/'0000.png').convert('RGB');last=Image.open(folder/'0142.png').convert('RGB')
    first.save(OUT/f'{kind}-v1-poster.webp',quality=88);last.save(OUT/f'{kind}-v1-final.webp',quality=90)
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=width,height,codec_name,pix_fmt','-of','json',str(filename)]))
    entry={'variant':kind,'file':filename.name,'bytes':filename.stat().st_size,'duration':float(probe['format']['duration']),'stream':probe['streams'][0]};manifest.append(entry);print(entry,flush=True)
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')

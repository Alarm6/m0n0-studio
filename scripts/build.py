from pathlib import Path
from html.parser import HTMLParser
import subprocess, zipfile, hashlib, re
ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
files=sorted(p for p in DIST.rglob('*') if p.is_file())
allowed={'.html','.css','.js','.svg','.png','.jpg','.webp','.ico','.woff','.woff2','.mp4','.gif','.json','.jpeg'}
assert all(p.suffix in allowed and not any(s.startswith('.') for s in p.relative_to(DIST).parts) for p in files), 'Unexpected public file'
class Check(HTMLParser):
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k not in ('src','href','poster','data-src') or not v or v.startswith(('#','https:','mailto:','data:')): continue
   assert not v.startswith(('/','http:')), f'Non-portable resource: {v}'
   assert (DIST/v.split('?')[0].split('#')[0]).is_file(), f'Missing resource: {v}'
Check().feed((DIST/'index.html').read_text(encoding='utf-8-sig'))
for p in files:
 if p.suffix=='.js': subprocess.run(['node','--check',str(p)],check=True,capture_output=True)
 if p.suffix in {'.html','.css','.js'}:
  assert not re.search(r'-----BEGIN .*PRIVATE KEY|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}',p.read_text(encoding='utf-8-sig')), f'Suspected credential: {p.name}'
out=ROOT/'release'; out.mkdir(exist_ok=True)
digest=hashlib.sha256(b''.join(p.relative_to(DIST).as_posix().encode()+p.read_bytes() for p in files)).hexdigest()[:12]
archive=out/f'm0n0-{digest}.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in files: z.write(p,p.relative_to(DIST).as_posix())
print(f'OK: {len(files)} files, {sum(p.stat().st_size for p in files)} bytes; {archive}')

"""Run only after approval and confirmation that the hosting supports explicit FTPS."""
import ftplib
import os
import ssl
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
if os.environ.get('DEPLOY_APPROVED') != 'yes':
    sys.exit('Deployment disabled. Set DEPLOY_APPROVED=yes only after publication approval.')
subprocess.run([sys.executable, str(root/'scripts/build.py')], check=True)
target = os.environ['FTPS_DIRECTORY']
if not target.startswith('/') or target == '/' or '..' in target.split('/'):
    sys.exit('Set FTPS_DIRECTORY to the confirmed absolute site document root, not /.')
with ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=60) as ftp:
    ftp.connect(os.environ['FTPS_HOST'], int(os.environ.get('FTPS_PORT', '21')))
    ftp.login(os.environ['FTPS_USER'], os.environ['FTPS_PASSWORD'])
    ftp.prot_p()
    ftp.cwd(target)
    # Current project is flat. Stop rather than silently omit future subdirectories.
    assert not any(p.is_dir() for p in (root/'dist').iterdir()), 'Nested assets need explicit upload support'
    files = sorted((root/'dist').iterdir(), key=lambda p: (p.name == 'index.html', p.name))
    for p in files:
        with p.open('rb') as stream:
            ftp.storbinary('STOR '+p.name, stream)
print('Uploaded public assets; no remote files deleted. Verify HTTPS and interactions.')

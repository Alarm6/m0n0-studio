from pathlib import Path
p=Path('studio/public')
(p/'webview-compat.js').write_text('''/* Shared WebKit / Android WebView safeguards; no app SDK required. */
(() => {
  const embedded = /Instagram|FBAN|FBAV|VK(App|Client)|VKontakte|Telegram|; wv\\)/i.test(navigator.userAgent);
  if (embedded) document.documentElement.classList.add('embedded-browser');
  const style = document.createElement('style');
  style.textContent = `html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
  @media(max-width:700px){input,textarea,select{font-size:16px!important}dialog{max-width:calc(100vw - 24px);max-height:calc(var(--visual-height,100svh) - 24px)}}
  .embedded-browser video{ -webkit-transform:translateZ(0) }
  @media(max-width:700px){.embedded-browser header button{ -webkit-backdrop-filter:none;backdrop-filter:none }}
  `;
  document.head.append(style);
  const prepare = video => {
    video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
    if (video.hasAttribute('muted')) {video.muted=true;video.defaultMuted=true;}
  };
  const videos = [...document.querySelectorAll('video')];videos.forEach(prepare);
  // Retry blocked muted loops only on a real gesture or returning to the app.
  const resume = () => {
    if(document.hidden)return;
    videos.forEach(video => {
      const r=video.getBoundingClientRect();
      if(video.muted && (video.loop || video.autoplay) && r.bottom>0 && r.top<innerHeight && r.right>0 && r.left<innerWidth && video.getAttribute('src')) {
        const attempt=video.play();if(attempt)attempt.catch(()=>{});
      }
    });
  };
  document.addEventListener('pointerup',resume,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>{if(v.muted && (v.loop||v.autoplay))v.pause()});else resume()});
  window.addEventListener('pageshow',resume);
})();
''',encoding='utf-8')
# Viewport geometry follows keyboard, without resizing the visual scenes.
(p/'responsive.js').write_text('''(() => {
 const viewport=window.visualViewport;
 let frame=0;
 const update=()=>{frame=0;document.documentElement.style.setProperty('--visual-height',`${viewport?.height||innerHeight}px`);};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
 viewport?.addEventListener('resize',schedule);window.addEventListener('pageshow',schedule);update();
})();
''',encoding='utf-8')
f=p/'projects.js';s=f.read_text(encoding='utf-8');s=s.replace("video.preload='metadata';", "video.preload='none';")
s=s.replace("if(video.paused)video.play().catch(()=>{});", "if(video.paused&&!video.dataset.playPending&&Date.now()>Number(video.dataset.retryAfter||0)){video.dataset.playPending='1';video.play().catch(()=>{video.dataset.retryAfter=String(Date.now()+5000)}).finally(()=>{delete video.dataset.playPending});}")
s=s.replace("new IntersectionObserver(([entry])", "document.addEventListener('pointerup',()=>{previews.forEach(c=>{const v=c.querySelector('video');if(v)delete v.dataset.retryAfter});sync()},{passive:true});\n  window.addEventListener('pageshow',sync);\n  new IntersectionObserver(([entry])")
# Same-tab navigation inside apps avoids popup-blocked portfolio links.
s=s.replace("window.open(href,'_blank','noopener,noreferrer')", "(/Instagram|FBAN|FBAV|VK(App|Client)|VKontakte|Telegram|; wv\\)/i.test(navigator.userAgent)?location.assign(href):window.open(href,'_blank','noopener,noreferrer'))")
f.write_text(s,encoding='utf-8')
# AbortSignal.timeout is missing in older Android/iOS embedded engines.
f=p/'app.js';s=f.read_text(encoding='utf-8');s=s.replace("try{const response=await fetch(endpoint", "const controller=new AbortController(),requestTimer=setTimeout(()=>controller.abort(),20000);\n try{const response=await fetch(endpoint");s=s.replace('signal:AbortSignal.timeout(20000)','signal:controller.signal');s=s.replace('finally{sending=false;', 'finally{clearTimeout(requestTimer);sending=false;');f.write_text(s,encoding='utf-8')
# Package only reviewed public files, preserving Beget's PHP endpoint.
import zipfile,urllib.request,re
release=Path('studio/release')
roots={'product':Path('../AppleProduct/plusproduct-site/dist'),'yaki':Path('../Сайт суши/yatori/dist'),'emk':Path('../Сайт продажи металоконструкций/opora/dist'),'horyy':Path('../Сайт сывороток для лца,/horyy/dist'),'character':Path('../Сайт для портфолио/sdvig/dist')}
with zipfile.ZipFile(release/'portfolio-icons-mobile.zip') as z: payload={n:z.read(n) for n in z.namelist()}
for host,root in roots.items():
 (root/'webview-compat.js').write_bytes((p/'webview-compat.js').read_bytes())
 payload[f'{host}.m0n0.site/public_html/webview-compat.js']=(p/'webview-compat.js').read_bytes()
 for rel in ['index.html']+(['plusproduct-intro.html'] if host=='product' else ['yaki-supreme/index.html'] if host=='yaki' else []):
  f=root/rel;s=f.read_text(encoding='utf-8-sig')
  s=s.replace('</body>','<script defer src="/webview-compat.js?v=3010"></script></body>') if 'webview-compat.js' not in s else s
  f.write_text(s,encoding='utf-8');payload[f'{host}.m0n0.site/public_html/{rel}']=s.encode()
s=(p/'index.html').read_text(encoding='utf-8-sig').replace('gallery-flow-final-20261028','webview-20261030')
s=s.replace('</body>','<script src="webview-compat.js?v=3010"></script></body>')
(p/'index.html').write_text(s,encoding='utf-8')
# Beget routes the form through PHP, unlike the Sites preview.
s=s.replace('data-endpoint="/api/brief"','data-endpoint="/api/brief.php"')
payload['m0n0.site/public_html/index.html']=s.encode()
for name in ['webview-compat.js','responsive.js','projects.js','app.js']:
 payload['m0n0.site/public_html/'+name]=(p/name).read_bytes()
with zipfile.ZipFile(release/'webview-3010.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name,data in payload.items():z.writestr(name,data)
print('Packaged',len(payload),'public files')

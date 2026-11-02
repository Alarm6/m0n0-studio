window.M0N0_PROJECT_URLS=Object.freeze({
  '+product':'https://product.m0n0.site/',
  'Яки Суприм':'https://yaki.m0n0.site/',
  'ЕМК':'https://emk.m0n0.site/',
  'horyy':'https://horyy.m0n0.site/',
  'ЖК Характер':'https://character.m0n0.site/'
});
(() => {
  const gallery=document.querySelector('#gallery'),work=document.querySelector('#work');
  let start,visible=false,timer=0;
  const previews=[...gallery.querySelectorAll('.project')];
  previews.forEach(card=>{
    const video=card.querySelector('video');if(!video)return;
    // An independent image survives Safari video compositing and autoplay failure.
    const poster=document.createElement('img');poster.className='portfolio-poster';poster.src=video.poster;poster.alt=card.dataset.name;poster.decoding='async';poster.loading='lazy';card.prepend(poster);
    video.preload='none';video.setAttribute('webkit-playsinline','');video.defaultMuted=true;
    video.addEventListener('error',()=>{delete card.dataset.previewReady});
    video.addEventListener('pause',()=>{if(video.readyState<2)delete card.dataset.previewReady});
  });
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  function sync(){
    previews.forEach(card=>{
      const video=card.querySelector('video');if(!video)return;
      const show=visible&&!document.hidden&&!reduced.matches&&!card.hidden&&card.style.visibility!=='hidden'&&Number(card.style.opacity||1)>.05;
      if(show){if(!video.getAttribute('src')){video.src=video.dataset.src;video.muted=true;video.load();}if(video.paused&&!video.dataset.playPending&&Date.now()>Number(video.dataset.retryAfter||0)){video.dataset.playPending='1';video.play().catch(()=>{video.dataset.retryAfter=String(Date.now()+5000)}).finally(()=>{delete video.dataset.playPending});}}
      else if(!video.paused)video.pause();
    });
  }
  document.addEventListener('pointerup',()=>{previews.forEach(c=>{const v=c.querySelector('video');if(v)delete v.dataset.retryAfter});sync()},{passive:true});
  window.addEventListener('pageshow',sync);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;clearInterval(timer);timer=0;if(visible){sync();timer=setInterval(sync,250)}else sync()},{rootMargin:'180px'}).observe(work);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  previews.forEach(card=>{
    const video=card.querySelector('video');video?.addEventListener('playing',()=>card.dataset.previewReady='true');
    if(card.classList.contains('orbit-copy'))return;
    card.tabIndex=0;card.setAttribute('role','link');card.setAttribute('aria-label',`Открыть сайт ${card.dataset.name}`);
    card.addEventListener('keydown',e=>{if(e.key==='Enter'){const href=window.M0N0_PROJECT_URLS[card.dataset.name];if(href)(/Instagram|FBAN|FBAV|VK(App|Client)|VKontakte|Telegram|; wv\)/i.test(navigator.userAgent)?location.assign(href):window.open(href,'_blank','noopener,noreferrer'))}});
  });
  gallery.addEventListener('pointerdown',e=>{start={x:e.clientX,y:e.clientY}});
  gallery.addEventListener('pointercancel',()=>start=null);
  gallery.addEventListener('pointerup',e=>{
    if(!start||Math.hypot(e.clientX-start.x,e.clientY-start.y)>8){start=null;return}start=null;
    const card=document.elementFromPoint(e.clientX,e.clientY)?.closest('.project');const href=card&&window.M0N0_PROJECT_URLS[card.dataset.name];
    if(href)(/Instagram|FBAN|FBAV|VK(App|Client)|VKontakte|Telegram|; wv\)/i.test(navigator.userAgent)?location.assign(href):window.open(href,'_blank','noopener,noreferrer'));
  });
})();

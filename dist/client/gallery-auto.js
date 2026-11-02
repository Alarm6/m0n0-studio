(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible=false,holding=false,resumeAt=0,elapsed=0,last=0,frame=0;
  const pointer={x:innerWidth/2,y:innerHeight/2,tx:innerWidth/2,ty:innerHeight/2};
  window.m0n0Face=(cx,cy)=>({yaw:Math.max(-23,Math.min(23,(pointer.x-cx)/innerWidth*48)),pitch:Math.max(-16,Math.min(16,-(pointer.y-cy)/innerHeight*34))});
  const view=document.querySelector('#allWorks');view.className='work-view-switch';view.textContent='Посмотреть все';document.querySelector('#workTitle').after(view);
  function start(){if(!frame&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick)}}
  function tick(now){frame=0;const dt=Math.min(now-last,50);last=now;
    pointer.x+=(pointer.tx-pointer.x)*.85;pointer.y+=(pointer.ty-pointer.y)*.85;
    if(!window.m0n0GalleryTransition&&!holding&&now>resumeAt&&!reduced){if(ring){rotation+=dt*.009;elapsed=0}else{elapsed+=dt;if(elapsed>10500){go(1,true);elapsed=0}}}
    if(!window.m0n0GalleryTransition&&!dragging)layout();
    if(visible&&!document.hidden)frame=requestAnimationFrame(tick);
  }
  window.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){pointer.tx=e.clientX;pointer.ty=e.clientY}},{passive:true});
  gallery.addEventListener('pointerdown',()=>{holding=true;resumeAt=performance.now()+2500;elapsed=0});
  window.addEventListener('pointerup',()=>{if(holding){holding=false;resumeAt=performance.now()+2500}});
  window.addEventListener('pointercancel',()=>{holding=false;resumeAt=performance.now()+2500});
  document.querySelectorAll('#prev,#next,#allWorks').forEach(button=>button.addEventListener('click',()=>{elapsed=0;resumeAt=performance.now()+3500;view.textContent=ring?'К ленте':'Посмотреть все'}));
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;}},{threshold:.05}).observe(gallery);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else start()});
  layout();
})();


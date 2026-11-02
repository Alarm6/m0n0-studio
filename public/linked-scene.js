(() => {
  const about = document.querySelector('#about');
  about.querySelector(':scope > h2').remove();
  about.querySelector('.playground').remove();
  const scene = document.createElement('div');
  scene.className = 'linked-scene';
  scene.innerHTML = `<div class="linked-space"><svg class="linked-threads" aria-hidden="true"><path/><path/><path/><path/><path/></svg><h2 class="linked-title"><span class="linked-line">У каждого <button class="linked-handle" aria-label="Потяните слово действия, чтобы раскрыть композицию">действия<span class="handle-mark"></span></button></span><span class="linked-line linked-second">есть продолжение</span></h2><div class="linked-fragment fragment-one" aria-hidden="true"><div class="fragment-top">m0n0 <span>01 / IDEA</span></div><div class="fragment-word">start<br>something</div><div class="fragment-rule"></div><small>A DIFFERENT POINT OF VIEW </small></div><div class="linked-fragment fragment-two" aria-hidden="true"><div class="fragment-top">FORM / FUNCTION</div><div class="wire-shape"><i></i><i></i><i></i></div><small>CONNECTED BY DESIGN</small></div><div class="linked-fragment fragment-three" aria-hidden="true"><div class="fragment-top">● ● ● <span>02 / EXPERIENCE</span></div><div class="fragment-word">move<br>with it</div><small>YOUR ACTION MATTERS </small></div><span class="linked-node" aria-hidden="true"></span></div><div class="linked-bottom"><span class="linked-cue">Потяните за «действия» <br><small>Одно движение меняет всё</small></span><button class="linked-reset">Вернуть на место ↺</button></div><p class="linked-caption">Мы создаём сайты, которые вовлекают в исследование,<br>раскрывают характер бренда и остаются в памяти</p>`;
  about.querySelector('.approach').before(scene);
  const space = scene.querySelector('.linked-space');
  const handle = scene.querySelector('.linked-handle');
  const title = scene.querySelector('.linked-title');
  const second = scene.querySelector('.linked-second');
  const fragments = [...scene.querySelectorAll('.linked-fragment')];
  const node = scene.querySelector('.linked-node');
  const svg = scene.querySelector('svg');
  const paths = [...svg.querySelectorAll('path')];
  const cue = scene.querySelector('.linked-cue');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let down=false,startX=0,startY=0,targetX=0,targetY=0,x=0,y=0,vx=0,vy=0,frame=0,last=0;
  const springs = Array.from({length:4},()=>({x:0,y:0,vx:0,vy:0}));
  function start(){if(!frame){last=performance.now();frame=requestAnimationFrame(tick)}}
  function tick(now){
    const dt=Math.min((now-last)/16.67,2);last=now;
    vx=(vx+(targetX-x)*.075*dt)*Math.pow(.78,dt);vy=(vy+(targetY-y)*.075*dt)*Math.pow(.78,dt);x+=vx*dt;y+=vy*dt;
    let source={x,y};
    springs.forEach((s,i)=>{s.vx=(s.vx+(source.x-s.x)*.065*dt)*Math.pow(.8,dt);s.vy=(s.vy+(source.y-s.y)*.065*dt)*Math.pow(.8,dt);s.x+=s.vx*dt;s.y+=s.vy*dt;source=s});
    const spread=Math.min(Math.hypot(x,y)/200,1);
    handle.style.transform=`translate(${x}px,${y}px) rotate(${x*.035}deg)`;
    title.style.transform=`rotateY(${reduced?0:x*.025}deg) rotateX(${reduced?0:-y*.025}deg)`;
    const s=springs[0];second.style.transform=`translate(${s.x*.35}px,${s.y*.4}px) rotate(${s.x*.018}deg)`;
    fragments.forEach((f,i)=>{const s=springs[i+1];const sign=i%2?-1:1;f.style.transform=`translate(${s.x*(.3+i*.12)+sign*spread*35}px,${s.y*.5-spread*(30+i*20)}px) rotate(${sign*(8+i*3)+s.x*.035}deg) rotateY(${reduced?0:sign*(28-spread*30)}deg)`;f.style.opacity=String(.24+spread*.76)});
    node.style.transform=`translate(${springs[3].x*.9}px,${springs[3].y*.8}px)`;
    const box=space.getBoundingClientRect(),anchor=handle.getBoundingClientRect();
    const ax=anchor.left+anchor.width*.5-box.left,ay=anchor.bottom-box.top;
    const endpoints=[second,...fragments,node];
    svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
    endpoints.forEach((el,i)=>{const r=el.getBoundingClientRect(),bx=r.left+r.width/2-box.left,by=r.top+r.height/2-box.top;const sag=18+(1-spread)*65;paths[i].setAttribute('d',`M ${ax} ${ay} Q ${(ax+bx)/2} ${(ay+by)/2+sag} ${bx} ${by}`)});
    scene.style.setProperty('--thread-opacity',String(.1+spread*.35));
    const energy=Math.abs(vx)+Math.abs(vy)+Math.abs(targetX-x)+Math.abs(targetY-y)+springs.reduce((a,s)=>a+Math.abs(s.vx)+Math.abs(s.vy)+Math.abs(s.x-source.x)*.01,0);
    if(down||energy>.05)frame=requestAnimationFrame(tick);else frame=0;
  }
  handle.addEventListener('pointerdown',e=>{down=true;startX=e.clientX;startY=e.clientY;handle.setPointerCapture(e.pointerId);scene.classList.add('is-pulling');cue.innerHTML='Видите, всё связано<br><small>Отпустите — движение продолжится</small>';start()});
  handle.addEventListener('pointermove',e=>{if(!down)return;const limit=innerWidth<700?110:250;targetX=Math.max(-limit,Math.min(limit,e.clientX-startX));targetY=Math.max(-150,Math.min(150,e.clientY-startY));start()});
  function release(){down=false;targetX=0;targetY=0;scene.classList.remove('is-pulling');start()}
  handle.addEventListener('pointerup',release);handle.addEventListener('pointercancel',release);
  handle.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key)){e.preventDefault();targetX=e.key==='ArrowLeft'?-160:160;targetY=e.key==='ArrowUp'?-100:e.key==='ArrowDown'?100:35;start();clearTimeout(handle.releaseTimer);handle.releaseTimer=setTimeout(release,700)}});
  scene.querySelector('.linked-reset').onclick=release;
  window.addEventListener('resize',start);
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){targetX=30;targetY=-8;start();setTimeout(release,550);observer.disconnect()}},{threshold:.35});observer.observe(scene);
  start();
})();

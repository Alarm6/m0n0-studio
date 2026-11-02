(() => {
  const about=document.querySelector('#about');
  about.querySelector(':scope > h2')?.remove();about.querySelector('.playground')?.remove();
  const section=document.createElement('div');section.className='physics-section';
  section.innerHTML=`<div class="physics-stage"><h2 class="linked-title physics-title"><span>Красота привлекает</span><span>Взаимодействие захватывает</span></h2><div class="physics-floor" aria-hidden="true"></div><div class="physics-cards"></div></div></div>`;
  about.querySelector('.approach').before(section);
  const stage=section.querySelector('.physics-stage'),tray=section.querySelector('.physics-cards'),title=section.querySelector('.physics-title');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const originals=[...document.querySelectorAll('.scroll-burst .burst-card')].slice(0,7);
  const bodies=originals.map((source,i)=>{
    const el=source.cloneNode(true);el.className=source.className+' falling-card';el.removeAttribute('style');el.removeAttribute('aria-hidden');el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',`Переместить карточку ${i+1}`);tray.append(el);
    return {el,x:0,y:-1000,vx:0,vy:0,a:0,w:0,h:0,spin:0,held:false,rest:0,sleeping:false,supported:false,hitRows:new Set(),index:i};
  });
  let width=0,height=0,mode='waiting',visible=false,frame=0,last=0,titleOffset=0,titleVelocity=0,sleep=0,dropGate=false,dropTime=0,gateY=0,savedOverflow=null,armedFromAbove=true;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function measure(){width=stage.clientWidth;height=stage.clientHeight;for(const b of bodies){b.w=b.el.offsetWidth;b.h=b.el.offsetHeight;b.x=clamp(b.x,b.w/2,width-b.w/2)}}
  function paint(){section.dataset.mode=mode;bodies.forEach(b=>{b.el.style.transform=`translate(${b.x-b.w/2}px,${b.y-b.h/2}px) rotate(${b.a}rad)`;b.el.style.visibility=mode==='waiting'?'hidden':'visible';b.el.style.pointerEvents=mode==='live'?'auto':'none'});title.style.transform=`translateY(${titleOffset}px) rotate(${titleOffset*.025}deg) scaleY(${1-Math.min(Math.abs(titleOffset)*.0018,.045)})`;}
  function seed(){measure();const spots=[.10,.31,.53,.75,.91,.22,.66];bodies.forEach((b,i)=>{b.x=clamp(width*spots[i],b.w/2+8,width-b.w/2-8);b.y=-b.h-80-i*100;b.vx=(i%2?1:-1)*(35+i*6);b.vy=20;b.a=(i%2?1:-1)*.1;b.spin=(i%2?1:-1)*.35;b.held=false;b.rest=0;b.sleeping=false;b.hitRows.clear();b.el.classList.remove('is-grabbed');});}
  function launch(){armedFromAbove=false;mode='live';sleep=0;dropTime=0;dropGate=!reduced;gateY=scrollY+section.getBoundingClientRect().top;if(dropGate){if(savedOverflow===null)savedOverflow=document.documentElement.style.overflow;window.scrollTo({top:gateY,behavior:'instant'});document.documentElement.style.overflow='hidden';}seed();bodies.forEach(b=>b.landed=false);if(reduced)bodies.forEach((b,i)=>{b.y=height-b.h/2-15-(i>4?b.h*.85:0);b.vx=b.vy=b.spin=0});paint();wake()}
  function wake(){if(!frame&&visible&&mode==='live'){last=performance.now();frame=requestAnimationFrame(tick)}}
  function box(b){const c=Math.cos(b.a),s=Math.sin(b.a);return {b,cx:b.x,cy:b.y,hw:b.w/2,hh:b.h/2,u:[c,s],v:[-s,c]}}
  function contact(a,b){let depth=Infinity,nx=0,ny=0;const dx=b.cx-a.cx,dy=b.cy-a.cy;
    for(const [ux,uy] of [a.u,a.v,b.u,b.v]){const ra=a.hw*Math.abs(a.u[0]*ux+a.u[1]*uy)+a.hh*Math.abs(a.v[0]*ux+a.v[1]*uy),rb=b.hw*Math.abs(b.u[0]*ux+b.u[1]*uy)+b.hh*Math.abs(b.v[0]*ux+b.v[1]*uy),d=dx*ux+dy*uy,o=ra+rb-Math.abs(d);if(o<=0)return null;if(o<depth){depth=o;nx=ux*(d<0?-1:1);ny=uy*(d<0?-1:1)}}return {depth,nx,ny};}
  function step(dt,obstacles){
    const floor=height-15;
    for(const b of bodies){b.supported=b.sleeping;if(b.held||b.sleeping)continue;
      b.vy+=1000*dt;b.vx*=Math.exp(-.35*dt);b.spin*=Math.exp(-1.1*dt);
      b.x+=b.vx*dt;b.y+=b.vy*dt;b.a+=b.spin*dt;
      const halfX=Math.abs(Math.cos(b.a))*b.w/2+Math.abs(Math.sin(b.a))*b.h/2,halfY=Math.abs(Math.sin(b.a))*b.w/2+Math.abs(Math.cos(b.a))*b.h/2;
      if(b.y+halfY>floor){b.landed=true;b.supported=true;b.y=floor-halfY;const impact=b.vy;b.vy=impact>65?-impact*.28:0;b.vx*=.83;b.spin*=.68;if(Math.abs(b.vx)<3)b.vx=0;if(Math.abs(b.spin)<.04)b.spin=0;}
      if(b.x-halfX<8){b.x=halfX+8;b.vx=Math.abs(b.vx)*.48;if(Math.abs(b.vx)>30)b.spin+=.1;}if(b.x+halfX>width-8){b.x=width-halfX-8;b.vx=-Math.abs(b.vx)*.48;if(Math.abs(b.vx)>30)b.spin-=.1;}
      obstacles.forEach((r,i)=>{if(b.hitRows.has(i)||b.y+halfY<r.top||b.y-halfY>r.bottom||b.x+halfX<r.left||b.x-halfX>r.right)return;if(b.vy>35){b.hitRows.add(i);titleVelocity+=clamp(b.vy*.13,12,60);b.vy=-b.vy*.18;b.vx+=(b.x<width/2?-1:1)*110;b.spin+=(b.x<width/2?-1:1)*.7;}});
    }
    if(mode!=='live')return;
    for(let pass=0;pass<4;pass++)for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
      const a=bodies[i],b=bodies[j],hit=contact(box(a),box(b));if(!hit)continue;
      if(a.y<b.y&&hit.ny>.3)a.supported=true;if(b.y<a.y&&hit.ny<-.3)b.supported=true;
      const impact=Math.abs((b.vx-a.vx)*hit.nx+(b.vy-a.vy)*hit.ny);
      if(impact>65||a.held||b.held){if(a.sleeping){a.sleeping=false;a.rest=0}if(b.sleeping){b.sleeping=false;b.rest=0}}
if(a.landed&&b.y<a.y)b.landed=true;if(b.landed&&a.y<b.y)a.landed=true;const am=a.held||a.sleeping?0:1,bm=b.held||b.sleeping?0:1,sum=am+bm;if(!sum)continue;
      const correction=Math.max(hit.depth-.35,0)*.72/sum;a.x-=hit.nx*correction*am;a.y-=hit.ny*correction*am;b.x+=hit.nx*correction*bm;b.y+=hit.ny*correction*bm;
      const speed=(b.vx-a.vx)*hit.nx+(b.vy-a.vy)*hit.ny;if(speed<0){const impulse=-speed*1.26/sum;a.vx-=hit.nx*impulse*am;a.vy-=hit.ny*impulse*am;b.vx+=hit.nx*impulse*bm;b.vy+=hit.ny*impulse*bm;const torque=clamp(((b.x-a.x)*hit.ny-(b.y-a.y)*hit.nx)*impulse*.00007,-1.5,1.5);if(speed < -40){a.spin-=torque*am;b.spin+=torque*bm;}}
    }
    bodies.forEach(b=>{
      if(b.held||b.sleeping)return;
      if(b.supported){b.vx*=Math.exp(-4*dt);b.spin*=Math.exp(-8*dt);}
      b.rest=b.supported&&Math.abs(b.vx)<35&&Math.abs(b.vy)<45&&Math.abs(b.spin)<.28?b.rest+dt:0;
      if(b.rest>.45){b.sleeping=true;b.vx=b.vy=b.spin=0;}
    });
  }
  function tick(now){frame=0;const dt=clamp((now-last)/1000,.001,.034);last=now;const origin=stage.getBoundingClientRect();const obstacles=[...title.children].map(line=>{const r=line.getBoundingClientRect();return {left:r.left-origin.left,right:r.right-origin.left,top:r.top-origin.top,bottom:r.bottom-origin.top}});
    const slices=Math.ceil(dt/(1/120));for(let i=0;i<slices;i++)step(dt/slices,obstacles);
    titleVelocity+=(-titleOffset*110-titleVelocity*14)*dt;titleOffset+=titleVelocity*dt;
    if(dropGate){dropTime+=dt;if(Math.abs(scrollY-gateY)>.5)window.scrollTo({top:gateY,behavior:'instant'});if((dropTime>.6&&bodies.every(b=>b.landed))||dropTime>6){dropGate=false;document.documentElement.style.overflow=savedOverflow??'';savedOverflow=null;}}
    section.dataset.falling=String(dropGate);paint();
    const energy=bodies.reduce((a,b)=>a+Math.abs(b.vx)+Math.abs(b.vy)+Math.abs(b.spin)*10,0);sleep=energy<25&&!bodies.some(b=>b.held)?sleep+dt:0;
    if(visible&&mode!=='waiting'&&(sleep<2||dropGate))frame=requestAnimationFrame(tick);
  }
  bodies.forEach(b=>{let gx=0,gy=0,px=0,py=0,time=0;
    b.el.addEventListener('pointerdown',e=>{if(mode!=='live'||e.button!==0)return;e.preventDefault();b.held=true;b.rest=0;b.sleeping=false;b.landed=false;b.vx=b.vy=b.spin=0;b.hitRows.clear();b.el.classList.add('is-grabbed');b.el.style.zIndex='20';const r=stage.getBoundingClientRect();gx=e.clientX-r.left-b.x;gy=e.clientY-r.top-b.y;px=e.clientX;py=e.clientY;time=performance.now();b.el.setPointerCapture(e.pointerId);sleep=0;wake()});
    b.el.addEventListener('pointermove',e=>{if(!b.held)return;const r=stage.getBoundingClientRect(),now=performance.now(),dt=Math.max((now-time)/1000,.008);b.vx=clamp(b.vx*.3+(e.clientX-px)/dt*.7,-1600,1600);b.vy=clamp(b.vy*.3+(e.clientY-py)/dt*.7,-1600,1600);b.x=clamp(e.clientX-r.left-gx,b.w/3,width-b.w/3);b.y=e.clientY-r.top-gy;px=e.clientX;py=e.clientY;time=now;paint();sleep=0;wake()});
    function release(){if(!b.held)return;b.held=false;b.el.classList.remove('is-grabbed');if(performance.now()-time>100)b.vx=b.vy=0;b.spin=clamp(b.vx*.002,-3,3);sleep=0;wake()}
    b.el.addEventListener('pointerup',release);b.el.addEventListener('pointercancel',release);b.el.addEventListener('lostpointercapture',release);
    b.el.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();b.rest=0;b.sleeping=false;b.landed=false;b.vx=e.key==='ArrowLeft'?-350:e.key==='ArrowRight'?350:0;b.vy=e.key==='ArrowDown'?200:-480;b.hitRows.clear();sleep=0;wake()}});
  });
  function clearForReturn(){
    dropGate=false;document.documentElement.style.overflow=savedOverflow??'';savedOverflow=null;
    cancelAnimationFrame(frame);frame=0;mode='waiting';armedFromAbove=true;titleOffset=titleVelocity=0;
    bodies.forEach(b=>{b.held=false;b.sleeping=false;b.rest=0;b.vx=b.vy=b.spin=0;b.el.classList.remove('is-grabbed')});
    section.dataset.falling='false';paint();
  }
  window.addEventListener('m0n0:scene-return',clearForReturn);
  function restOnFloor(){
    armedFromAbove=false;mode='live';seed();
    for(let i=0;i<720;i++)step(1/120,[]);
    bodies.forEach(b=>{b.vx=b.vy=b.spin=0;b.landed=true});
    titleOffset=titleVelocity=0;sleep=2;paint();
  }
  function onScroll(){const r=section.getBoundingClientRect();
    // Rearm only after leaving the whole stage above, never on return from below.
    if(r.top>=stage.clientHeight&&!dropGate)armedFromAbove=true;
    if(r.top<=4&&r.bottom>0){
      if(mode==='waiting'&&r.top < -innerHeight*.5)restOnFloor();
      else if(armedFromAbove)launch();
    }
    if(dropGate&&Math.abs(scrollY-gateY)>.5)window.scrollTo({top:gateY,behavior:'instant'});
  }
  const blockScroll=e=>{if(dropGate)e.preventDefault()};
  window.addEventListener('wheel',blockScroll,{passive:false});
  window.addEventListener('touchmove',blockScroll,{passive:false});
  window.addEventListener('keydown',e=>{if(dropGate&&['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)&&!e.target.closest('button,input,textarea,select'))e.preventDefault()});
  window.addEventListener('pagehide',()=>{if(dropGate){dropGate=false;document.documentElement.style.overflow=savedOverflow??'';savedOverflow=null;}});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){onScroll();wake()}else{cancelAnimationFrame(frame);frame=0;if(dropGate){dropGate=false;document.documentElement.style.overflow=savedOverflow??'';savedOverflow=null;}paint()}},{threshold:0}).observe(stage);
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',()=>{const oldW=width,oldH=height;measure();if(mode==='live'){bodies.forEach(b=>{b.x=clamp(b.x/Math.max(oldW,1)*width,b.w/2,width-b.w/2);b.y=height-(oldH-b.y)});paint();sleep=0;wake()}});measure();paint();
})();

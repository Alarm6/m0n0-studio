(() => {
  const cards=[...document.querySelectorAll('.burst-card')].slice(0,7);
  if(!cards.length)return;
  const stage=cards[0].closest('.scroll-stage');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bodies=cards.map(el=>({el,x:0,y:0,vx:0,vy:0,angle:0,spin:0,held:false}));
  let frame=0,last=0,active=false,gathering=false;
  const reset=document.createElement('button');reset.className='burst-reset';reset.textContent='Собрать ↺';reset.hidden=true;stage.append(reset);
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function paint(b){b.el.style.translate=`${b.x}px ${b.y}px`;b.el.style.rotate=`${b.angle}deg`;}
  function wake(){if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}}
  function geometry(b){
    const r=b.el.getBoundingClientRect();
    const scale=Number(b.el.style.transform.match(/scale\(([^)]+)\)/)?.[1]||1);
    const base=Number(b.el.style.transform.match(/rotate\(([^d]+)deg\)/)?.[1]||0);
    const a=(base+b.angle)*Math.PI/180;
    return {b,cx:r.left+r.width/2,cy:r.top+r.height/2,hw:b.el.offsetWidth*scale/2,hh:b.el.offsetHeight*scale/2,u:[Math.cos(a),Math.sin(a)],v:[-Math.sin(a),Math.cos(a)]};
  }
  function contact(a,b){
    const dx=b.cx-a.cx,dy=b.cy-a.cy;let depth=Infinity,nx=0,ny=0;
    for(const [ux,uy] of [a.u,a.v,b.u,b.v]){
      const ra=a.hw*Math.abs(a.u[0]*ux+a.u[1]*uy)+a.hh*Math.abs(a.v[0]*ux+a.v[1]*uy);
      const rb=b.hw*Math.abs(b.u[0]*ux+b.u[1]*uy)+b.hh*Math.abs(b.v[0]*ux+b.v[1]*uy);
      const d=dx*ux+dy*uy,overlap=ra+rb-Math.abs(d);
      if(overlap<=0)return null;
      if(overlap<depth){depth=overlap;const sign=d<0?-1:1;nx=ux*sign;ny=uy*sign;}
    }
    return {depth,nx,ny};
  }
  function tick(now){
    frame=0;const dt=clamp((now-last)/16.667,.25,2);last=now;
    for(const b of bodies){
      if(!b.held){
        if(gathering){b.vx+=(-b.x*.035-b.vx*.16)*dt;b.vy+=(-b.y*.035-b.vy*.16)*dt;b.spin+=(-b.angle*.035-b.spin*.16)*dt;}
        b.x+=b.vx*dt;b.y+=b.vy*dt;b.angle+=b.spin*dt;
        b.vx*=Math.pow(.965,dt);b.vy*=Math.pow(.965,dt);b.spin*=Math.pow(.94,dt);
      }
      paint(b);
    }
    if(!gathering){
      const boxes=bodies.map(geometry);
      for(let pass=0;pass<3;pass++)for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
        const a=boxes[i],b=boxes[j],hit=contact(a,b);if(!hit)continue;
        const am=a.b.held?0:1,bm=b.b.held?0:1,sum=am+bm;if(!sum)continue;
        const correction=Math.max(hit.depth-.5,0)*.72/sum;
        const ax=-hit.nx*correction*am,ay=-hit.ny*correction*am,bx=hit.nx*correction*bm,by=hit.ny*correction*bm;
        a.b.x+=ax;a.b.y+=ay;b.b.x+=bx;b.b.y+=by;a.cx+=ax;a.cy+=ay;b.cx+=bx;b.cy+=by;
        const speed=(b.b.vx-a.b.vx)*hit.nx+(b.b.vy-a.b.vy)*hit.ny;
        if(speed<0){const impulse=-(1+.56)*speed/sum;
          a.b.vx-=hit.nx*impulse*am;a.b.vy-=hit.ny*impulse*am;b.b.vx+=hit.nx*impulse*bm;b.b.vy+=hit.ny*impulse*bm;
          const tangent=(b.cx-a.cx)*hit.ny-(b.cy-a.cy)*hit.nx;
          const torque=clamp(tangent*impulse*.0015,-3,3);
          a.b.spin-=torque*am;b.b.spin+=torque*bm;
        }
      }
      const bounds=stage.getBoundingClientRect();
      for(const b of bodies){if(b.held)continue;paint(b);const r=b.el.getBoundingClientRect();
        if(r.right<bounds.left+50){b.x+=bounds.left+50-r.right;b.vx=Math.abs(b.vx)*.45;}
        if(r.left>bounds.right-50){b.x-=r.left-bounds.right+50;b.vx=-Math.abs(b.vx)*.45;}
        if(r.bottom<bounds.top+50){b.y+=bounds.top+50-r.bottom;b.vy=Math.abs(b.vy)*.45;}
        if(r.top>bounds.bottom-50){b.y-=r.top-bounds.bottom+50;b.vy=-Math.abs(b.vy)*.45;}
      }
    }
    bodies.forEach(paint);
    const moving=bodies.some(b=>b.held||Math.hypot(b.vx,b.vy)+Math.abs(b.spin)>.04||(gathering&&Math.hypot(b.x,b.y)+Math.abs(b.angle)>.2));
    if(gathering&&!moving){bodies.forEach(b=>{b.x=b.y=b.vx=b.vy=b.angle=b.spin=0;paint(b);delete b.el.dataset.dragged;b.el.style.zIndex='';});gathering=false;active=false;reset.hidden=true;}
    if(moving)frame=requestAnimationFrame(tick);
  }
  bodies.forEach(b=>{
    let gx=0,gy=0,px=0,py=0,time=0;
    b.el.addEventListener('pointerdown',e=>{
      if(e.button!==0)return;e.preventDefault();e.stopPropagation();active=true;gathering=false;reset.hidden=false;
      b.held=true;b.vx=b.vy=b.spin=0;b.el.dataset.dragged='true';b.el.classList.add('is-grabbed');b.el.style.zIndex='20';
      gx=e.clientX-b.x;gy=e.clientY-b.y;px=e.clientX;py=e.clientY;time=performance.now();b.el.setPointerCapture(e.pointerId);wake();
    });
    b.el.addEventListener('pointermove',e=>{if(!b.held)return;e.stopPropagation();const now=performance.now(),dt=Math.max(now-time,8);
      b.vx=clamp(b.vx*.35+(e.clientX-px)/dt*16*.65,-38,38);b.vy=clamp(b.vy*.35+(e.clientY-py)/dt*16*.65,-38,38);
      b.x=e.clientX-gx;b.y=e.clientY-gy;px=e.clientX;py=e.clientY;time=now;paint(b);wake();
    });
    function release(){if(!b.held)return;b.held=false;b.el.classList.remove('is-grabbed');if(performance.now()-time>100||reduced)b.vx=b.vy=0;wake();}
    b.el.addEventListener('pointerup',release);b.el.addEventListener('pointercancel',release);b.el.addEventListener('lostpointercapture',release);
  });
  reset.onclick=()=>{bodies.forEach(b=>{b.held=false;b.el.classList.remove('is-grabbed')});gathering=true;wake()};
  window.addEventListener('scroll',()=>{
    const rect=stage.parentElement.getBoundingClientRect();
    reset.style.display=rect.top<innerHeight&&rect.bottom>0?'':'none';
    if(rect.top>0&&active){cancelAnimationFrame(frame);frame=0;active=false;gathering=false;reset.hidden=true;bodies.forEach(b=>{b.held=false;b.x=b.y=b.vx=b.vy=b.angle=b.spin=0;delete b.el.dataset.dragged;b.el.classList.remove('is-grabbed');b.el.style.zIndex='';paint(b)});}
  },{passive:true});
})();


(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy=false,last=-1;
  document.querySelectorAll('header a.logo').forEach(logo=>{
    logo.setAttribute('role','button');
    logo.setAttribute('aria-label','m0n0 — оживить логотип');
    logo.innerHTML=[...'m0n0'].map(c=>`<span class="logo-letter" aria-hidden="true">${c}</span>`).join('');
    logo.addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();logo.click()}});
    logo.addEventListener('click',async e=>{
      e.preventDefault();if(busy)return;busy=true;
      let choice=Math.floor(Math.random()*4);if(choice>=last)choice++;if(last<0)choice=Math.floor(Math.random()*5);last=choice;
      const letters=[...logo.children],style=getComputedStyle(logo);
      const layer=document.createElement('div');layer.className='logo-play-layer';layer.setAttribute('aria-hidden','true');document.body.append(layer);
      const rects=letters.map(l=>l.getBoundingClientRect());
      const actors=letters.map((l,i)=>{const actor=document.createElement('span');actor.textContent=l.textContent;actor.style.cssText=`position:fixed;left:${rects[i].left}px;top:${rects[i].top}px;width:${rects[i].width}px;height:${rects[i].height}px;font-family:${style.fontFamily};font-size:${style.fontSize};font-weight:400;line-height:${style.lineHeight};color:${style.color};transform-origin:50% 60%;`;layer.append(actor);return actor});
      letters.forEach(l=>l.style.visibility='hidden');logo.setAttribute('aria-busy','true');
      const animations=[];
      const animate=(i,frames,duration=1900,delay=0)=>{const a=actors[i].animate(frames,{duration,delay,fill:'both',easing:'cubic-bezier(.25,.6,.3,1)'});animations.push(a);};
      try{
        if(window.m0n0LogoMotion){const motion=window.m0n0LogoMotion(choice,rects,reduced);actors.forEach((actor,i)=>animations.push(actor.animate(motion.frames[i],{duration:motion.duration,fill:'both',easing:'linear'})));}
        else if(reduced){actors.forEach((_,i)=>animate(i,[{opacity:1},{opacity:.35},{opacity:1}],350,i*35));}
        else if(choice===0){
          actors.forEach((_,i)=>{const drop=innerHeight-rects[i].top+100;animate(i,[{transform:'translateY(0) rotate(0deg)',offset:0},{transform:'translateY(-12px) rotate(-6deg)',offset:.12},{transform:`translateY(${drop}px) rotate(${i%2?120:-160}deg)`,opacity:1,offset:.42},{transform:`translateY(${drop}px)`,opacity:0,offset:.43},{transform:`translateY(${-rects[i].top-100}px) rotate(-15deg)`,opacity:0,offset:.52},{transform:`translateY(${-rects[i].top-100}px) rotate(-15deg)`,opacity:1,offset:.53},{transform:'translateY(9px) rotate(3deg)',offset:.82},{transform:'translateY(-5px)',offset:.91},{transform:'none',opacity:1,offset:1}],1700,i*100)});
        }else if(choice===1){
          const dx=rects[1].left-rects[2].left;
          animate(2,[{transform:'none',opacity:1,offset:0},{transform:'translateX(5px) rotate(8deg)',opacity:1,offset:.12},{transform:`translateX(${dx}px) scale(.05) rotate(-55deg)`,opacity:0,offset:.33},{transform:`translateX(${dx}px) scale(.05)`,opacity:0,offset:.58},{transform:'translateX(15px) scale(1.12) rotate(12deg)',opacity:1,offset:.77},{transform:'translateX(-4px) rotate(-5deg)',opacity:1,offset:.9},{transform:'none',opacity:1,offset:1}],2100);
          animate(1,[{transform:'none',offset:0},{transform:'scale(1.4,.8) rotate(-12deg)',offset:.22},{transform:'scale(1.25,1.1) rotate(10deg)',offset:.4},{transform:'scale(.85,1.2) rotate(-8deg)',offset:.53},{transform:'scale(1.5,.7) rotate(12deg)',offset:.64},{transform:'scale(.9,1.1)',offset:.8},{transform:'none',offset:1}],2100);
          [0,3].forEach(i=>animate(i,[{transform:'none'},{transform:`translateX(${i===0?-7:8}px) rotate(${i===0?-7:7}deg)`},{transform:'none'}],2100));
        }else if(choice===2){
          actors.forEach((_,i)=>animate(i,[{transform:'none',offset:0},{transform:`translateX(${-i*6}px) scale(.75,1.2)`,offset:.2},{transform:`translateX(${(i-1.5)*24}px) scale(1.3,.8) rotate(${(i-1.5)*9}deg)`,offset:.46},{transform:'translateX(-3px) scale(.95,1.05)',offset:.72},{transform:'none',offset:1}],1500,i*55));
        }else if(choice===3){
          const vectors=[[-38,-65],[-12,55],[28,-55],[65,30]];
          actors.forEach((_,i)=>{const [x,y]=vectors[i];animate(i,[{transform:'none',offset:0},{transform:`translate(${x}px,${y}px) rotate(${(i-1.5)*65}deg) scale(.9)`,offset:.36},{transform:`translate(${x*.8}px,${y*.8}px) rotate(${(i-1.5)*95}deg) scale(.9)`,offset:.6},{transform:'translate(0,-4px) rotate(0deg) scale(1.05)',offset:.87},{transform:'none',offset:1}],1800,i*45)});
        }else{
          actors.forEach((_,i)=>animate(i,[{transform:'perspective(300px) rotateX(0deg) translateY(0)',offset:0},{transform:'perspective(300px) rotateX(180deg) translateY(-15px)',offset:.45},{transform:'perspective(300px) rotateX(360deg) translateY(5px)',offset:.82},{transform:'perspective(300px) rotateX(360deg) translateY(0)',offset:1}],1450,i*140));
        }
        await Promise.allSettled(animations.map(a=>a.finished));
      }finally{animations.forEach(a=>a.cancel());layer.remove();letters.forEach(l=>l.style.visibility='');logo.removeAttribute('aria-busy');busy=false;}
    });
  });
})();


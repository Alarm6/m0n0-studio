(() => {
  const title=document.querySelector('#workTitle'),toggle=document.querySelector('#allWorks'),hint=document.querySelector('.ring-hint');
  const stage=document.createElement('div');stage.className='portfolio-stage';
  title.before(stage);stage.append(title,toggle,gallery,document.querySelector('.gallery-controls'),hint);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const feedLayout=layout;
  let busy=false,centerY=0,headerTop=0;
  function dimensions(){
    const mobile=innerWidth<701;
    stage.style.setProperty('--feed-y',mobile?'120px':'140px');
    if(!ring){stage.style.setProperty('--title-y','0px');stage.style.setProperty('--button-y',mobile?'54px':'68px');}
    else{
      centerY=Number.isFinite(centerY)?centerY:stage.clientHeight/2;
      headerTop=centerY-title.offsetHeight/2;
      stage.style.setProperty('--title-y',headerTop+'px');stage.style.setProperty('--button-y',(centerY+title.offsetHeight/2+18)+'px');
    }
  }
  function orbit(){
    const mobile=innerWidth<701,all=mobile?cards:[...cards,...orbitCopies];
    orbitCopies.forEach(card=>card.hidden=mobile);
    const size=mobile?.72:.65,cardWidth=mobile?130:320;
    const rx=mobile?stage.clientWidth*.32:Math.min(stage.clientWidth*.39,520);
    const ry=Math.min(mobile?190:265,innerHeight*.3);
    const bounds=stage.getBoundingClientRect();
    all.forEach((card,i)=>{
      card.hidden=false;card.style.visibility='visible';card.style.width=cardWidth+'px';card.style.opacity='1';card.style.zIndex='2';
      const angle=(i*360/all.length+(mobile?rotation:0))*Math.PI/180,x=Math.cos(angle)*rx,y=centerY+Math.sin(angle)*ry-card.offsetHeight/2;
      const face=window.m0n0Face?window.m0n0Face(bounds.left+stage.clientWidth/2+x,bounds.top+y+card.offsetHeight/2):{yaw:0,pitch:0};
      card.style.transform=`translateX(-50%) translate(${x}px,${y}px) rotateX(${face.pitch}deg) rotateY(${face.yaw+Math.sin(rotation*Math.PI/180+i*.6)*5}deg) rotateZ(-6deg) scale(${size})`;
    });
  }
  layout=function(drag=0){if(busy)return;if(ring)orbit();else feedLayout(drag)};
  async function fade(el,from,to,ms){
    const anim=el.animate([{opacity:from},{opacity:to}],{duration:reduced.matches?0:ms,easing:'ease',fill:'forwards'});
    await anim.finished;el.style.opacity=String(to);anim.cancel();
  }
  toggle.onclick=null;
  toggle.addEventListener('click',async event=>{
    event.preventDefault();event.stopImmediatePropagation();if(busy)return;
    busy=true;window.m0n0GalleryTransition=true;stage.dataset.transitioning='true';toggle.disabled=true;stage.setAttribute('aria-busy','true');
    const next=!ring,from=title.offsetTop;
    // Keep the stage height and document scroll unchanged throughout both directions.
    try{
      await fade(toggle,1,0,160);
      await fade(gallery,1,0,220);
      ring=next;work.classList.toggle('ring',ring);
      if(ring){const rect=stage.getBoundingClientRect();centerY=innerHeight/2-rect.top;}
      dimensions();
      const to=ring?headerTop:0;
      const move=title.animate([{top:from+'px'},{top:to+'px'}],{duration:reduced.matches?0:540,easing:'cubic-bezier(.22,.7,.25,1)',fill:'forwards'});
      if(ring)orbit();else feedLayout();
      toggle.textContent=ring?'К ленте':'Посмотреть все';
      await move.finished;move.cancel();
      await fade(gallery,0,1,320);
      await fade(toggle,0,1,180);
    }finally{
      busy=false;window.m0n0GalleryTransition=false;delete stage.dataset.transitioning;toggle.disabled=false;stage.removeAttribute('aria-busy');layout();
    }
  },{capture:true});
  gallery.addEventListener('pointerdown',e=>{if(busy){e.preventDefault();e.stopImmediatePropagation()}},{capture:true});
  window.addEventListener('resize',()=>{if(!busy){dimensions();layout()}});
  dimensions();layout();
})();

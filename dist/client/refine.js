// One rigid orbit: equal angular intervals, fixed size, no individual avoidance.
const orbitCopies=cards.map(card=>{const copy=card.cloneNode(true);copy.classList.add('orbit-copy');copy.hidden=true;copy.setAttribute('aria-hidden','true');gallery.append(copy);return copy});
const originalLayout=layout;
layout=function(drag=0){
  if(!ring){document.querySelector('#workTitle').style.transform='';document.querySelector('#allWorks').style.transform='';orbitCopies.forEach(c=>c.hidden=true);originalLayout(drag);return;}
  const mobile=innerWidth<701;
  const heading=document.querySelector('#workTitle'),toggle=document.querySelector('#allWorks');
  if(mobile){
    heading.style.transform=`translateY(${gallery.offsetTop+gallery.clientHeight/2-heading.offsetTop-heading.offsetHeight/2-20}px)`;
    toggle.style.transform=`translateY(${gallery.offsetTop+gallery.clientHeight/2-toggle.offsetTop+15}px)`;
  }else{heading.style.transform='';toggle.style.transform=''}
  const all=mobile?cards:[...cards,...orbitCopies];
  orbitCopies.forEach(c=>c.hidden=mobile);
  const label=document.createRange();label.selectNodeContents(document.querySelector('#workTitle'));
  const bounds=label.getBoundingClientRect(),g=gallery.getBoundingClientRect();
  const size=mobile?.72:.65;
  const halfW=(mobile?170:320)*size*.56,halfH=(mobile?135:220)*size*.62;
  const radiusX=mobile?innerWidth*.32:Math.max(465,(bounds.width/2+halfW+25)*Math.SQRT2);
  const radiusY=mobile?200:Math.max(265,(bounds.height/2+halfH+30)*Math.SQRT2);
  all.forEach((card,i)=>{
    card.hidden=false;card.style.visibility='visible';card.style.width=mobile?'130px':'';
    const angle=(i*360/all.length+(mobile?rotation:0))*Math.PI/180;
    const centerY=mobile?gallery.clientHeight/2-card.offsetTop-card.offsetHeight/2:bounds.top+bounds.height/2-g.top-card.offsetTop-card.offsetHeight/2;
    const x=Math.cos(angle)*radiusX,y=Math.sin(angle)*radiusY+centerY;
    const face=window.m0n0Face?window.m0n0Face(g.left+g.width/2+x,g.top+card.offsetTop+card.offsetHeight/2+y):{yaw:0,pitch:0};
    card.style.transform=`translateX(-50%) translate(${x}px,${y}px) rotateX(${face.pitch}deg) rotateY(${face.yaw+Math.sin(rotation*Math.PI/180+i*.6)*5}deg) rotateZ(-6deg) scale(${size})`;
    card.style.opacity='1';card.style.zIndex='20';
  });
};



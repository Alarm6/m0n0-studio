// Sampled motion uses ballistic flight and damped springs rather than uniform tweens.
window.m0n0LogoMotion = function(choice, rects, reduced) {
  const duration=reduced?500:choice===0?3400:choice===1?3100:2700;
  const unit=rects[0].height/39;
  const decay=(t,f=3.5,d=7)=>t<0?0:Math.exp(-d*t)*Math.sin(f*Math.PI*2*t);
  const clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
  const frames=rects.map(()=>[]);
  for(let k=0;k<=240;k++){
    const t=k/240*duration/1000;
    rects.forEach((rect,i)=>{
      let x=0,y=0,r=0,sx=1,sy=1,opacity=1,rx=0;
      const local=Math.max(0,t-i*.085);
      if(reduced){sx=1+.12*Math.sin(Math.PI*clamp(t/.5));}
      else if(choice===0){
        const floor=innerHeight-rect.bottom-10;
        const launch=.20+i*.055;
        if(t<launch){r=-9*smooth(t/launch);y=-5*unit*Math.sin(t/launch*Math.PI);}
        else if(t<1.65+i*.055){
          const q=t-launch;
          const impact=Math.sqrt(Math.max(0,2*floor/2400));
          if(q<impact){y=1200*q*q;r=-9+(i%2?1:-1)*q*95;sy=1+Math.min(.18,q*.2);sx=1/sy;}
          else {const b=q-impact;const v=-(110+20*i);y=floor+v*b+1200*b*b;const collision=Math.exp(-b*22);sx=1+.5*collision;sy=1-.35*collision;r=(i%2?1:-1)*(35+b*70);if(y>floor+90)opacity=0;}
        }else{
          const q=t-(1.65+i*.055),distance=rect.top+rect.height+35;
          const hit=Math.sqrt(2*distance/2400);
          if(q<hit){y=-distance+1200*q*q;r=-12*(1-q/hit);sy=1.15;sx=.9;}
          else{const b=q-hit;y=-75*unit*Math.exp(-b*8)*Math.abs(Math.sin(b*18));sx=1+.42*Math.exp(-b*13)*Math.cos(b*22);sy=1/sx;r=8*decay(b,4,10);}
        }
      }else if(choice===1){
        const pull=smooth((t-.28)/.32),spit=smooth((t-1.6)/.17);
        if(i===2){
          const dx=rects[1].left+rects[1].width*.5-(rect.left+rect.width*.5);
          if(t<1.6){x=dx*pull;y=-5*unit*Math.sin(pull*Math.PI);sx=1-.97*pull;sy=1-.9*pull;r=-75*pull;opacity=1-smooth((pull-.7)/.3);}
          else if(t<1.78){x=dx*(1-spit)+20*unit*spit;y=-22*unit*Math.sin(spit*Math.PI);sx=.03+1.18*spit;sy=.1+.85*spit;r=-75*(1-spit)+22*spit;opacity=spit;}
          else{const q=t-1.78;x=20*unit*Math.exp(-q*6)*Math.cos(q*19);y=-12*unit*decay(q,3.3,7);r=22*Math.exp(-q*7)*Math.cos(q*18);sx=1+.16*decay(q,4,8);sy=1/sx;}
        }else if(i===1){
          const mouth=smooth((t-.15)/.22)*(1-smooth((t-.62)/.18));
          const chewing=smooth((t-.65)/.12)*(1-smooth((t-1.45)/.15));
          const recoil=decay(t-1.62,3,7);
          sx=1+mouth*.5+chewing*.18*Math.sin(t*33)-recoil*.55;
          sy=1-mouth*.25-chewing*.13*Math.sin(t*33)+recoil*.45;
          r=-mouth*14+chewing*7*Math.sin(t*22)-recoil*16;x=-recoil*8*unit;
        }else{const recoil=decay(t-.55-(i===0?0:.08),2.8,5)+decay(t-1.7,3.5,8);x=(i===0?-1:1)*9*unit*recoil;r=(i===0?-1:1)*10*recoil;}
      }else if(choice===2){
        // A travelling compression wave with delayed recoil in every glyph.
        const q=t-i*.105;
        const compress=smooth(q/.18)*(1-smooth((q-.22)/.1));
        const release=decay(q-.3,3.2,3.4);
        x=unit*(-i*5*compress+(i===0?-13:19)*release);
        y=-unit*16*Math.abs(release);r=(i-1.5)*12*release;
        sx=1-.25*compress+.35*release;sy=1/sx;
      }else if(choice===3){
        const q=t-.2;
        const out=smooth(q/.38);
        const pullback=q<.5?1:Math.exp(-(q-.5)*4)*Math.cos((q-.5)*10);
        const extent=out*pullback;
        const angle=[-2.3,1.8,-.9,.45][i];
        x=Math.cos(angle)*(55+i*8)*unit*extent;y=Math.sin(angle)*(55+i*8)*unit*extent;
        r=(i%2?1:-1)*120*extent;
        sx=1+.15*decay(q-.52,3.2,5);sy=1/sx;
      }else{
        // Hinged dominoes: anticipation, contact, then a spring-driven recovery.
        const q=t-i*.13;
        if(q<.2){r=-12*smooth(q/.2);}
        else if(q<.52){const a=(q-.2)/.32;r=-12+83*a*a;y=2*unit*a;}
        else{const b=q-.52;r=71*Math.exp(-b*4.7)*Math.cos(b*14);y=-10*unit*Math.abs(decay(b,3,6));}
        sx=1+.13*decay(q-.52,4,7);sy=1/sx;
      }
      // Subtle exact settling avoids a visible final snap, even after a large fall.
      const settle=smooth((t-duration/1000+.35)/.35);
      x*=1-settle;y*=1-settle;r*=1-settle;sx=1+(sx-1)*(1-settle);sy=1+(sy-1)*(1-settle);opacity+= (1-opacity)*settle;
      frames[i].push({offset:k/240,transform:`translate3d(${x}px,${y}px,0) rotate(${r}deg) rotateX(${rx}deg) scale(${sx},${sy})`,opacity});
    });
  }
  return {frames,duration};
};

(() => {
  const svg=document.querySelector('.zoom-type');if(!svg)return;
  const paths=[...svg.querySelectorAll('path')];
  const originals=paths.map(p=>p.getAttribute('transform'));
  const boxes=paths.map((p,i)=>{
    const b=p.getBBox(),m=p.transform.baseVal.consolidate().matrix;
    const a=new DOMPoint(b.x,b.y).matrixTransform(m),z=new DOMPoint(b.x+b.width,b.y+b.height).matrixTransform(m);
    return {left:Math.min(a.x,z.x),right:Math.max(a.x,z.x),top:Math.min(a.y,z.y),bottom:Math.max(a.y,z.y),width:b.width*Math.abs(m.a),row:i<9?0:1};
  });
  const gains=paths.map(()=>0);let target=-1,frame=0;
  function render(){
    frame=0;let moving=false;const zooming=svg.viewBox.baseVal.width<1390;let shift=0;
    paths.forEach((p,i)=>{
      if(i===9)shift=0;
      const desired=!zooming&&target>=0&&boxes[target].row===boxes[i].row?Math.exp(-Math.pow((i-target)/1.05,2))*.75:0;
      gains[i]+=(desired-gains[i])*.16;
      if(Math.abs(desired-gains[i])>.001)moving=true;else gains[i]=desired;
      p.setAttribute('transform',`translate(${shift} 0) ${originals[i]} scale(${1+gains[i]} 1)`);
      shift+=boxes[i].width*gains[i];
    });
    if(moving)frame=requestAnimationFrame(render);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(render)}
  svg.addEventListener('pointermove',e=>{
    if(svg.viewBox.baseVal.width<1390){target=-1;schedule();return;}
    const matrix=svg.getScreenCTM();if(!matrix)return;
    const point=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());
    target=boxes.findIndex(b=>point.x>=b.left-2&&point.x<=b.right+2&&point.y>=b.top-10&&point.y<=b.bottom+10);
    schedule();
  });
  function leave(){target=-1;schedule()}
  svg.addEventListener('pointerleave',leave);
  svg.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')leave()});
  new MutationObserver(()=>{if(svg.viewBox.baseVal.width<1390){target=-1;cancelAnimationFrame(frame);frame=0;gains.fill(0);paths.forEach((p,i)=>p.setAttribute('transform',originals[i]));}}).observe(svg,{attributes:true,attributeFilter:['viewBox']});
})();


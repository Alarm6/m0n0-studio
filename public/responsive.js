(() => {
 const viewport=window.visualViewport;
 let frame=0;
 const update=()=>{frame=0;document.documentElement.style.setProperty('--visual-height',`${viewport?.height||innerHeight}px`);};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
 viewport?.addEventListener('resize',schedule);window.addEventListener('pageshow',schedule);update();
})();

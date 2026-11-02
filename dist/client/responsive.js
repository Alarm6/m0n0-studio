(() => {
 const viewport=window.visualViewport;
 const update=()=>document.documentElement.style.setProperty('--visual-height',`${viewport?.height||innerHeight}px`);
 viewport?.addEventListener('resize',update);update();
})();

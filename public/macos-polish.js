(() => {
  const menu=document.querySelector('#menu');let last=-1;
  const button=document.querySelector('#menuBtn');
  button.addEventListener('click',()=>{
    if(menu.hidden)return;
    const choices=[0,1,2].filter(x=>x!==last);last=choices[Math.floor(Math.random()*choices.length)];
    menu.dataset.wallpaper=String(last);
  });
  document.querySelectorAll('.project').forEach(card=>{const chrome=document.createElement('div');chrome.className='project-macbar';chrome.setAttribute('aria-hidden','true');chrome.innerHTML='<span class="mac-controls"><i></i><i></i><i></i></span><span class="mac-window-name">'+(card.dataset.name||'m0n0')+'</span><span class="mac-toolbar-icon">▤</span>';card.prepend(chrome);});
  document.querySelectorAll('.burst-bar').forEach((bar,i)=>{
    const label=bar.querySelector('span')?.textContent||`m0n0 — ${i+1}`;
    bar.classList.add('mac-titlebar');
    bar.innerHTML=`<span class="mac-controls" aria-hidden="true"><i></i><i></i><i></i></span><span class="mac-window-name">${label}</span><span class="mac-toolbar-icon" aria-hidden="true">▤</span>`;
  });
})();

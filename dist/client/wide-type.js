(() => {
  // Hidden dialogs use natural text layout, never glyph widths measured at zero.
  document.querySelectorAll('main h2:not(.linked-title):not(.scroll-stage h2):not(#workTitle), main h3').forEach(heading => {
    const lines=heading.innerHTML.split(/<br\s*\/?\s*>/i).map(html=>{const temp=document.createElement('span');temp.innerHTML=html;return temp.textContent});
    heading.setAttribute('aria-label',lines.join(' '));heading.classList.add('wide-heading');heading.replaceChildren();
    const letters=[];
    lines.forEach(text=>{
      const line=document.createElement('span');line.className='wide-line';line.setAttribute('aria-hidden','true');
      text.split(/(\s+)/).filter(Boolean).forEach(word=>{
        if(/^\s+$/.test(word)){line.append(document.createTextNode(' '));return}
        const group=document.createElement('span');group.className='wide-word';
        Array.from(word).forEach(char=>{const letter=document.createElement('span'),ink=document.createElement('span');letter.className='wide-letter';ink.textContent=char;letter.append(ink);group.append(letter);letters.push(letter)});line.append(group);
      });heading.append(line);
    });
    let hovered=-1;
    const reset=()=>{hovered=-1;letters.forEach(letter=>{letter.style.paddingRight='';letter.firstChild.style.transform=''})};
    heading.addEventListener('pointermove',e=>{
      if(e.pointerType!=='mouse')return;
      const target=e.target.closest('.wide-letter'),index=letters.indexOf(target);
      if(index<0){reset();return}
      if(index===hovered)return;reset();hovered=index;
      const row=target.closest('.wide-line'),top=target.getBoundingClientRect().top;
      const ends=[...row.querySelectorAll('.wide-word')].map(w=>w.getBoundingClientRect()).filter(r=>Math.abs(r.top-top)<10);
      const space=Math.max(0,row.getBoundingClientRect().right-Math.max(...ends.map(r=>r.right)));
      const budget=Math.min(12,space/3);
      letters.forEach((letter,i)=>{const gain=Math.exp(-Math.pow((i-index)/1.05,2))*.65;const width=letter.firstChild.getBoundingClientRect().width;letter.style.paddingRight=Math.min(width*gain,budget)+'px';letter.firstChild.style.transform=`scaleX(${1+Math.min(gain,budget/Math.max(width,1))})`});
    });
    heading.addEventListener('pointerleave',reset);heading.addEventListener('pointercancel',reset);window.addEventListener('resize',reset);
  });
})();

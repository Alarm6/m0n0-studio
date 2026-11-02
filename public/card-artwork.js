(() => {
  const visuals=[
    ['rope-bag','Оливковая сумка с плетёной ручкой'],
    ['chrome-avatar','Хромированный fashion-аватар'],
    ['gamepad','Серебристый игровой контроллер'],
    ['orange-cats','Три светящихся оранжевых кота'],
    ['jade-figure','Фигурка из зелёного мраморного материала'],
    ['vinyl-creature','Изумрудный виниловый монстр'],
    ['silver-coupe','Серебристое спортивное купе']
  ];
  // Deliberately scoped away from #gallery: portfolio remains real-site space.
  const groups=[
    [...document.querySelectorAll('.scroll-burst > .burst-card')].slice(0,7),
    [...document.querySelectorAll('.physics-cards > .falling-card')].slice(0,7)
  ];
  groups.forEach(group=>group.forEach((card,i)=>{
    const [name,description]=visuals[i];
    const file=name==='vinyl-creature'?`${name}-v4`:name==='chrome-avatar'?`${name}-v2`:['orange-cats','vinyl-creature','silver-coupe'].includes(name)?`${name}-v3`:name;
    const chrome=card.querySelector('.mac-titlebar');
    if(chrome){const label=chrome.querySelector('.mac-window-name');if(label)label.textContent='';}
    const picture=document.createElement('picture');picture.className='motion-visual';
    const still=document.createElement('source');still.media='(prefers-reduced-motion: reduce)';still.srcset=`assets/motion/${file}-poster.webp`;
    const animated=document.createElement('source');animated.type='image/webp';animated.srcset=`assets/motion/${file}.webp`;
    const image=document.createElement('img');image.src=`assets/motion/${file}.gif`;image.alt=description;image.width=384;image.height=256;image.decoding='async';image.loading='lazy';image.draggable=false;
    picture.append(still,animated,image);
    card.replaceChildren(...(chrome?[chrome]:[]),picture);card.classList.add('motion-card');card.dataset.motion=name;
    if(card.classList.contains('falling-card'))card.setAttribute('aria-label',`Переместить: ${description}`);
  }));
})();

(() => {
  const closing=document.querySelector('.closing');if(!closing)return;
  const gradients=[0,1,2].map(i=>`var(--studio-gradient-${i})`);
  closing.querySelector('.start').style.setProperty('--start-gradient',gradients[Math.floor(Math.random()*gradients.length)]);
})();

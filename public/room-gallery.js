(() => {
  const overviewLayout = layout;
  let position = active, target = active, animation = 0, speed = .085;
  function room(drag = 0) {
    document.querySelector('#workTitle').style.transform='';document.querySelector('#allWorks').style.transform='';
    orbitCopies.forEach(c => c.hidden = true);
    const width = Math.min(innerWidth * (innerWidth < 701 ? .88 : .64), 1100);
    const radius = width / (2 * Math.tan(32.5 * Math.PI / 180));
    const current = position - drag / width;
    cards.forEach((card, i) => {
      let offset = ((i-current+cards.length/2)%cards.length+cards.length)%cards.length-cards.length/2;
      const angle = offset * 65 * Math.PI / 180;
      card.style.width = width + 'px';
      card.style.opacity = Math.abs(offset) > 1.6 ? '0' : '1';
      card.style.visibility = Math.abs(offset) > 1.6 ? 'hidden' : 'visible';
      card.style.zIndex = String(20 - Math.round(Math.abs(offset) * 5));
      const bounds=gallery.getBoundingClientRect();
      const face={yaw:0,pitch:0};
      card.style.transform = `translateX(-50%) translate3d(${radius * Math.sin(angle)}px,0,${radius * (Math.cos(angle)-1)}px) rotateY(${-offset * 65+face.yaw*.5}deg) rotateX(${face.pitch*.5}deg)`;
    });
    work.dataset.activeWork=cards[((Math.round(target)%cards.length)+cards.length)%cards.length].dataset.name;
    $('#counter').textContent = `0${((Math.round(target)%cards.length)+cards.length)%cards.length+1} / 0${cards.length}`;
  }
  function animate() {
    position += (target - position) * speed;
    if (Math.abs(target-position) < .0005) position=target;
    if (!ring) room();
    if(position!==target) animation=requestAnimationFrame(animate); else animation=0;
  }
  layout = function(drag=0) {
    if(ring) {
      cards.forEach(c=>{c.style.width='';c.style.visibility='visible'});
      overviewLayout(drag);
    } else room(drag);
  };
  go = function(n, automatic=false) {
    if(ring){rotation+=n*45;layout();return;}
    speed=automatic?.022:.085;
    target+=n;active=((Math.round(target)%cards.length)+cards.length)%cards.length;
    if(!animation) animation=requestAnimationFrame(animate);
  };
  layout();
})();


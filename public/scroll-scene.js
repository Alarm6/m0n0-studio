(() => {
  const section = document.querySelector('#play');
  const stage = document.createElement('div');
  stage.className = 'scroll-stage';
  while (section.firstChild) stage.append(section.firstChild);
  section.append(stage);
  section.classList.add('scroll-scene');
  const title = stage.querySelector('h2');
  title.setAttribute('aria-label','Этого уже недостаточно');
  title.innerHTML = '<svg class="zoom-type" viewBox="0 0 1400 420" role="img" aria-label="Этого уже недостаточно"><g fill="white"><path d="M615.0 843.0V670.0H1160.0Q1149.0 423.0 1023.0 280.5Q897.0 138.0 700.0 138.0Q350.0 138.0 261.0 510.0L74.0 461.0Q201.0 -25.0 686.0 -25.0Q1033.0 -25.0 1202.5 198.5Q1372.0 422.0 1361.0 749.0Q1361.0 949.0 1285.5 1114.0Q1210.0 1279.0 1054.0 1385.0Q898.0 1491.0 682.0 1491.0Q454.0 1491.0 300.5 1378.0Q147.0 1265.0 93.0 1064.0L283.0 1014.0Q366.0 1321.0 683.0 1321.0Q897.0 1321.0 1018.5 1192.0Q1140.0 1063.0 1152.0 843.0Z" transform="translate(40.0000 150) scale(0.07812500 -0.07812500)"/><path d="M38 1062H901V913H559V0H380V913H38Z" transform="translate(147.0000 150) scale(0.07812500 -0.07812500)"/><path d="M68 531Q68 826 232 968Q369 1086 566 1086Q785 1086 924.0 942.5Q1063 799 1063 546Q1063 341 1001.5 223.5Q940 106 822.5 41.0Q705 -24 566 -24Q343 -24 205.5 119.0Q68 262 68 531ZM253 531Q253 327 342.0 225.5Q431 124 566 124Q700 124 789.0 226.0Q878 328 878 537Q878 734 788.5 835.5Q699 937 566 937Q431 937 342.0 836.0Q253 735 253 531Z" transform="translate(212.2812 150) scale(0.07812500 -0.07812500)"/><path d="M136 1062H747V913H316V0H136Z" transform="translate(293.2656 150) scale(0.07812500 -0.07812500)"/><path d="M68 531Q68 826 232 968Q369 1086 566 1086Q785 1086 924.0 942.5Q1063 799 1063 546Q1063 341 1001.5 223.5Q940 106 822.5 41.0Q705 -24 566 -24Q343 -24 205.5 119.0Q68 262 68 531ZM253 531Q253 327 342.0 225.5Q431 124 566 124Q700 124 789.0 226.0Q878 328 878 537Q878 734 788.5 835.5Q699 937 566 937Q431 937 342.0 836.0Q253 735 253 531Z" transform="translate(343.6250 150) scale(0.07812500 -0.07812500)"/><path d="" transform="translate(424.6094 150) scale(0.07812500 -0.07812500)"/><path d="M127 -409 107 -240Q166 -256 210 -256Q270 -256 306.0 -236.0Q342 -216 365 -180Q382 -153 420 -46Q425 -31 436 -2L33 1062H227L448 447Q491 330 525 201Q556 325 599 443L826 1062H1006L602 -18Q537 -193 501 -259Q453 -348 391.0 -389.5Q329 -431 243 -431Q191 -431 127 -409Z" transform="translate(461.0625 150) scale(0.07812500 -0.07812500)"/><path d="M777 1062V603Q863 603 898.0 636.0Q933 669 1000 828Q1063 979 1113 1021Q1162 1062 1269 1062H1335V913L1286 914Q1214 914 1194 893Q1173 871 1130 762Q1090 658 1056.0 618.0Q1022 578 950 545Q1067 514 1178 329L1376 0H1178L985 329Q926 429 882.0 460.0Q838 491 777 491V0H593V491Q533 491 489.0 460.5Q445 430 386 329L193 0H-5L192 329Q304 514 421 545Q341 582 309.0 625.5Q277 669 213 833Q191 888 166 901Q140 914 89 914Q76 914 36 913V1062H61Q165 1062 207.5 1049.5Q250 1037 283.5 996.5Q317 956 371 828Q437 671 471.5 637.0Q506 603 593 603V1062Z" transform="translate(533.0625 150) scale(0.07812500 -0.07812500)"/><path d="M862 342 1048 319Q1004 156 885.0 66.0Q766 -24 581 -24Q348 -24 211.5 119.5Q75 263 75 522Q75 790 213.0 938.0Q351 1086 571 1086Q784 1086 919.0 941.0Q1054 796 1054 533Q1054 517 1053 485H261Q271 310 360.0 217.0Q449 124 582 124Q681 124 751.0 176.0Q821 228 862 342ZM271 633H864Q852 767 796 834Q710 938 573 938Q449 938 364.5 855.0Q280 772 271 633Z" transform="translate(632.0938 150) scale(0.07812500 -0.07812500)"/><path d="M136 1062H316V620H815V1062H995V0H815V471H316V0H136Z" transform="translate(40.0000 310) scale(0.07812500 -0.07812500)"/><path d="M862 342 1048 319Q1004 156 885.0 66.0Q766 -24 581 -24Q348 -24 211.5 119.5Q75 263 75 522Q75 790 213.0 938.0Q351 1086 571 1086Q784 1086 919.0 941.0Q1054 796 1054 533Q1054 517 1053 485H261Q271 310 360.0 217.0Q449 124 582 124Q681 124 751.0 176.0Q821 228 862 342ZM271 633H864Q852 767 796 834Q710 938 573 938Q449 938 364.5 855.0Q280 772 271 633Z" transform="translate(120.3594 310) scale(0.07812500 -0.07812500)"/><path d="M277 1062H1017V148H1132V-301H984V0H148V-301H0V148H95Q285 406 277 1062ZM427 913Q407 396 267 148H838V913Z" transform="translate(201.3438 310) scale(0.07812500 -0.07812500)"/><path d="M68 531Q68 826 232 968Q369 1086 566 1086Q785 1086 924.0 942.5Q1063 799 1063 546Q1063 341 1001.5 223.5Q940 106 822.5 41.0Q705 -24 566 -24Q343 -24 205.5 119.0Q68 262 68 531ZM253 531Q253 327 342.0 225.5Q431 124 566 124Q700 124 789.0 226.0Q878 328 878 537Q878 734 788.5 835.5Q699 937 566 937Q431 937 342.0 836.0Q253 735 253 531Z" transform="translate(286.7031 310) scale(0.07812500 -0.07812500)"/><path d="M828 389 1005 366Q976 183 856.5 79.5Q737 -24 563 -24Q345 -24 212.5 118.5Q80 261 80 527Q80 699 137.0 828.0Q194 957 310.5 1021.5Q427 1086 564 1086Q737 1086 847.0 998.5Q957 911 988 750L813 723Q788 830 724.5 884.0Q661 938 571 938Q435 938 350.0 840.5Q265 743 265 532Q265 318 347.0 221.0Q429 124 561 124Q667 124 738.0 189.0Q809 254 828 389Z" transform="translate(367.6875 310) scale(0.07812500 -0.07812500)"/><path d="M38 1062H901V913H559V0H380V913H38Z" transform="translate(439.6875 310) scale(0.07812500 -0.07812500)"/><path d="M828 131Q728 46 635.5 11.0Q543 -24 437 -24Q262 -24 168.0 61.5Q74 147 74 280Q74 358 109.5 422.5Q145 487 202.5 526.0Q260 565 332 585Q385 599 492 612Q710 638 813 674Q814 711 814 721Q814 831 763 876Q694 937 558 937Q431 937 370.5 892.5Q310 848 281 735L105 759Q129 872 184.0 941.5Q239 1011 343.0 1048.5Q447 1086 584 1086Q720 1086 805.0 1054.0Q890 1022 930.0 973.5Q970 925 986 851Q995 805 995 685V445Q995 194 1006.5 127.5Q1018 61 1052 0H864Q836 56 828 131ZM813 533Q715 493 519 465Q408 449 362.0 429.0Q316 409 291.0 370.5Q266 332 266 285Q266 213 320.5 165.0Q375 117 480 117Q584 117 665.0 162.5Q746 208 784 287Q813 348 813 467Z" transform="translate(504.9688 310) scale(0.07812500 -0.07812500)"/><path d="M38 1062H901V913H559V0H380V913H38Z" transform="translate(585.9531 310) scale(0.07812500 -0.07812500)"/><path d="M68 531Q68 826 232 968Q369 1086 566 1086Q785 1086 924.0 942.5Q1063 799 1063 546Q1063 341 1001.5 223.5Q940 106 822.5 41.0Q705 -24 566 -24Q343 -24 205.5 119.0Q68 262 68 531ZM253 531Q253 327 342.0 225.5Q431 124 566 124Q700 124 789.0 226.0Q878 328 878 537Q878 734 788.5 835.5Q699 937 566 937Q431 937 342.0 836.0Q253 735 253 531Z" transform="translate(651.2344 310) scale(0.07812500 -0.07812500)"/><path d="M69 1062H249V861Q249 731 264.5 672.5Q280 614 339.0 570.5Q398 527 487 527Q589 527 751 581V1062H931V0H751V428Q585 376 441 376Q320 376 227.5 437.5Q135 499 102.0 588.0Q69 677 69 784Z" transform="translate(732.2188 310) scale(0.07812500 -0.07812500)"/><path d="M136 1062H316V620H815V1062H995V0H815V471H316V0H136Z" transform="translate(807.5781 310) scale(0.07812500 -0.07812500)"/><path d="M68 531Q68 826 232 968Q369 1086 566 1086Q785 1086 924.0 942.5Q1063 799 1063 546Q1063 341 1001.5 223.5Q940 106 822.5 41.0Q705 -24 566 -24Q343 -24 205.5 119.0Q68 262 68 531ZM253 531Q253 327 342.0 225.5Q431 124 566 124Q700 124 789.0 226.0Q878 328 878 537Q878 734 788.5 835.5Q699 937 566 937Q431 937 342.0 836.0Q253 735 253 531Z" transform="translate(887.9375 310) scale(0.07812500 -0.07812500)"/></g></svg>';
  const vector = title.querySelector('svg');
  const burst = document.createElement('div');
  burst.className = 'scroll-burst';
  burst.setAttribute('aria-hidden', 'true');
  const designs = [
    ['forma', 'OBJECTS / NEW PERSPECTIVES', 'peach'],
    ['make<br>some move.', 'DESIGN IN MOTION', 'blue'],
    ['OFF<br>SCRIPT', 'CULTURE WITHOUT RULES', 'acid'],
    ['other<br>side.', 'BEYOND THE ORDINARY', 'silver'],
    ['Aa', 'TYPE IS ALIVE', 'paper'],
    ['still.', 'LESS NOISE. MORE SPACE.', 'blue'],
    ['m0n0', 'YOU ARE PART OF IT', 'paper'],
    ['NOT<br>STATIC', 'A DIFFERENT EXPERIENCE', 'acid']
  ];
  designs.forEach(([word, caption, color], i) => {
    const card = document.createElement('div');
    card.className = 'burst-card ' + color;
    card.innerHTML = `<div class="burst-bar">● ● ● <span>EXPERIMENT ${String(i + 1).padStart(2, '0')}</span></div><b>${word}</b><small>${caption}</small><i></i>`;
    burst.append(card);
  });
  const aperture = document.createElement('div');
  aperture.className = 'letter-destination';
  const message = document.createElement('div');
  message.className = 'scroll-message';
  message.innerHTML = '<span class="message-one">Мы предлагаем<br>взаимодействовать</span><span class="message-two">Мы предлагаем<br>взаимодействовать</span>';
  stage.append(aperture, burst, message);
  const cue = stage.querySelector('#pullHint');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let progress = 0, pointerX = 0, pointerY = 0, framePending = false;
  let previousBottom=null,returnStarted=0,returning=false;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const positions = [[-.36,-.29],[-.12,-.37],[.28,-.3],[.42,.02],[.3,.35],[-.08,.30],[-.4,.2],[.06,-.05]];
  function draw() {
    framePending = false;
    const rect = section.getBoundingClientRect();
    const now=performance.now();
    if(previousBottom!==null&&previousBottom<=0&&rect.bottom>0){returning=true;returnStarted=now;window.dispatchEvent(new Event('m0n0:scene-return'));}
    previousBottom=rect.bottom;
    if(rect.bottom<=0||rect.top>=stage.clientHeight){returning=false;}
    progress = clamp(-rect.top / Math.max(1, section.offsetHeight - stage.clientHeight));
    const tension = smooth((progress - .05) / .3);
    const reverse=returning&&progress>.6;
    const returnPhase=reduced?1:clamp((now-returnStarted)/1050);
    const opening = reverse?1:smooth((progress - .51) / .07);
    const arrival = smooth((progress - .43) / .29);
    const last = smooth((progress - .79) / .13);
    stage.style.setProperty('--opening', opening);
    stage.style.setProperty('--tension', tension);
    stage.style.setProperty('--scene-ink', opening > .6 ? '#111' : '#fff');
    aperture.style.opacity = String(opening);
    const approach = clamp((progress - .12) / .46);
    const zoom = Math.exp(Math.pow(approach, 1.6) * Math.log(150));
    title.style.color = '#fff';
    title.style.opacity = reverse?'0':String(1 - smooth((progress - .56) / .045));
    title.style.transform = 'none';
    const magnify = reduced ? 1 : zoom;
    const width = 1400 / magnify, height = 420 / magnify;
    vector.setAttribute('viewBox', `${49 * (1 - 1/magnify)} ${270 * (1 - 1/magnify) + tension * 35 / magnify} ${width} ${height}`);
    message.style.opacity = String(reverse?smooth(returnPhase/.65):smooth((progress - .67) / .1));
    message.querySelector('.message-one').style.opacity = '1';
    message.querySelector('.message-two').style.opacity = '0';
    [...burst.children].forEach((card, i) => {
      const [x,y] = positions[i];
      const flight = reverse?smooth((returnPhase-i*.035)/.75):smooth((progress - .59 - i * .006) / .2);
      const w = stage.clientWidth, h = stage.clientHeight;
      const mobile=w<701;
      const centers=mobile?[[.24,.23],[.76,.23],[.20,.37],[.80,.37],[.22,.64],[.78,.64],[.50,.79]]:null;
      const destination=mobile&&i<7?[(centers[i][0]-.5)*w,(centers[i][1]-.5)*h]:[x*w,y*h];
      if(mobile&&i<7){
        const label=message.querySelector('.message-one').getBoundingClientRect(),origin=stage.getBoundingClientRect();
        const angle=(7+i*2)*Math.PI/180;
        const half=(Math.abs(Math.sin(angle))*card.offsetWidth+Math.abs(Math.cos(angle))*card.offsetHeight)/2;
        destination[1]=i<4?Math.min(destination[1],label.top-origin.top-h/2-half-18):Math.max(destination[1],label.bottom-origin.top-h/2+half+18);
      }
      const travel=1+(1-flight)*1.7;
      const px=destination[0]*travel+(mobile?0:pointerX*(12+i*2)*arrival);
      const py=destination[1]*travel+(mobile?0:pointerY*(10+i)*arrival);
      card.style.opacity = String(flight * (i === 7 ? 0 : 1));
      card.style.pointerEvents = 'none';
      card.style.transform = `translate(-50%,-50%) translate(${px}px,${py}px) rotate(${(i % 2 ? 1 : -1) * (7 + i * 2) * flight}deg) rotateY(${(1-flight)*65}deg) scale(${.08 + flight * .92})`;
    });
    cue.innerHTML = progress < .3 ? 'Продолжайте скроллить ↓<br><small>Вы уже меняете происходящее</small>' : progress < .65 ? 'Это ваше движение<br><small>Прокрутите обратно — и всё вернётся</small>' : '<small>Продолжай исследовать</small>';
    if(reverse&&returnPhase<1&&rect.bottom>0)schedule();
  }
  function schedule() { if (!framePending) { framePending = true; requestAnimationFrame(draw); } }
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    pointerX = (e.clientX / r.width - .5) * 2;
    pointerY = ((e.clientY-r.top) / r.height - .5) * 2;
    schedule();
  });
  stage.addEventListener('pointerleave', () => { pointerX=0;pointerY=0;schedule(); });
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  draw();
})();



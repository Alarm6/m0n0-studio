const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
for(const ua of ['Mozilla/5.0 Instagram 360','Mozilla/5.0 VKClient','Mozilla/5.0 Telegram','Mozilla/5.0 Chrome/130; wv)','Mozilla/5.0 Safari']){
 const listeners={},windowListeners={},classes=[];let plays=0,pauses=0;
 const attrs=new Set(['muted','src']);const video={muted:false,loop:true,autoplay:false,setAttribute:k=>attrs.add(k),hasAttribute:k=>attrs.has(k),getAttribute:k=>attrs.has(k)?'test.mp4':null,getBoundingClientRect:()=>({top:10,bottom:200,left:0,right:200}),play:()=>{plays++;return Promise.reject(new Error('NotAllowedError'))},pause:()=>pauses++};
 const document={hidden:false,documentElement:{classList:{add:x=>classes.push(x)}},head:{append(){}},createElement:()=>({}),querySelectorAll:()=>[video],addEventListener:(name,fn)=>listeners[name]=fn};
 vm.runInNewContext(fs.readFileSync('studio/public/webview-compat.js','utf8'),{navigator:{userAgent:ua},document,window:{addEventListener:(n,f)=>windowListeners[n]=f},innerHeight:700,innerWidth:390});
 assert(attrs.has('playsinline'));assert(video.muted);listeners.pointerup();assert.equal(plays,1);document.hidden=true;listeners.visibilitychange();assert.equal(pauses,1);document.hidden=false;windowListeners.pageshow();assert.equal(plays,2);assert.equal(classes.length,ua.includes('Safari')?0:1);
}
console.log('PASS: 5 UA profiles; inline muted playback, blocked-autoplay promise, gesture retry, background pause and return');

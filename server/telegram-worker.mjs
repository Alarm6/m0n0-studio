// Deploy separately as a Cloudflare Worker; secrets stay in runtime environment.
const attempts=new Map();
const labels={company:'Компания',business:'О компании',website:'Сайт / соцсети',task:'Задача',deadline:'Срок',name:'Имя',contact:'Контакт'};
export default {async fetch(request,env){
 const origin=request.headers.get('Origin');const allowed=(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);
 const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin'};
 const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers});
 if(!origin||!allowed.includes(origin))return reply(403,{ok:false});
 headers['Access-Control-Allow-Origin']=origin;
 if(request.method==='OPTIONS'){headers['Access-Control-Allow-Methods']='POST, OPTIONS';headers['Access-Control-Allow-Headers']='Content-Type';return new Response(null,{status:204,headers})}
 if(request.method!=='POST')return reply(405,{ok:false});
 const ip=request.headers.get('CF-Connecting-IP')||'local';const now=Date.now();for(const [key,state] of attempts){if(now-state.start>60000)attempts.delete(key)}
 const state=attempts.get(ip)||{start:now,count:0};if(state.count>=5)return reply(429,{ok:false});state.count++;attempts.set(ip,state);if(attempts.size>10000)attempts.delete(attempts.keys().next().value);
 if(!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_CHAT_ID)return reply(503,{ok:false});
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply(415,{ok:false});
 const raw=await request.text();if(raw.length>12000)return reply(413,{ok:false});
 let data;try{data=JSON.parse(raw)}catch{return reply(400,{ok:false})}
 if(!data||typeof data!=='object'||Array.isArray(data)||data.fax)return reply(400,{ok:false});
 const clean={};for(const key of Object.keys(labels)){if(data[key]!=null&&typeof data[key]!=='string')return reply(400,{ok:false});clean[key]=(data[key]||'').trim();if(clean[key].length>1000)return reply(400,{ok:false})}
 if(!clean.task||!clean.contact)return reply(400,{ok:false});
 try{
  if(env.BRIEF_RATE_LIMITER){const result=await env.BRIEF_RATE_LIMITER.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'});if(!result.success)return reply(429,{ok:false})}
  const text='Новая заявка m0n0\n\n'+Object.entries(labels).map(([key,label])=>label+': '+(clean[key]||'—')).join('\n\n');
  if(text.length>4000)return reply(400,{ok:false});
  const response=await fetch('https://api.telegram.org/bot'+env.TELEGRAM_BOT_TOKEN+'/sendMessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text,link_preview_options:{is_disabled:true}}),signal:AbortSignal.timeout(12000)});
  const result=await response.json();if(!response.ok||!result.ok)return reply(502,{ok:false});return reply(200,{ok:true});
 }catch{return reply(502,{ok:false})}
}};

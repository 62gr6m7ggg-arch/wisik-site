// Server-only gate. There is deliberately no public/static copy of the test app.
export const BASE='/apps/ruimteklaar/test/';
const COOKIE='__Secure-rk-review',TTL=4*60*60,encoder=new TextEncoder();
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hex=buffer=>Array.from(new Uint8Array(buffer),x=>x.toString(16).padStart(2,'0')).join('');
const digest=async text=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(text)));
const encode=text=>btoa(text).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const decode=text=>atob(text.replace(/-/g,'+').replace(/_/g,'/'));
const cookie=value=>`${COOKIE}=${value}; Path=${BASE}; Max-Age=${value?TTL:0}; HttpOnly; Secure; SameSite=Strict`;
const common={'Cache-Control':'private, no-store, max-age=0','Pragma':'no-cache','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'same-origin','X-Robots-Tag':'noindex, nofollow, noarchive','Vary':'Cookie'};
function response(body,status=200,type='text/html; charset=utf-8',headers={}){return new Response(body,{status,headers:{...common,'Content-Type':type,...headers}})}
function config(env){
 const password=env.RUIMTEKLAAR_TEST_PASSWORD,secret=env.RUIMTEKLAAR_TEST_SESSION_SECRET,site=env.RUIMTEKLAAR_TEST_TURNSTILE_SITE_KEY,turnstile=env.RUIMTEKLAAR_TEST_TURNSTILE_SECRET_KEY;
 // No default or preview bypass: incomplete configuration means CLOSED.
 if(typeof password!=='string'||Array.from(password).length<16||password.length>256||password.trim()!==password||typeof secret!=='string'||secret.length<43||secret===password||typeof site!=='string'||!/^[a-zA-Z0-9_-]{20,100}$/.test(site)||typeof turnstile!=='string'||turnstile.length<30||/^[123]x0{8}/.test(site)||/^[123]x0{8}/.test(turnstile))return null;
 return {password,secret,site,turnstile};
}
async function key(secret){return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])}
async function sign(payload,secret){const content=encode(JSON.stringify(payload)),sig=await crypto.subtle.sign('HMAC',await key(secret),encoder.encode(content));return content+'.'+encode(String.fromCharCode(...new Uint8Array(sig)))}
async function session(request,c,now){
 try{
  const cookies=(request.headers.get('Cookie')||'').split(';').map(s=>s.trim()).filter(s=>s.startsWith(COOKIE+'='));if(cookies.length!==1)return null;
  const token=cookies[0].slice(COOKIE.length+1);if(token.length>1500)return null;
  const parts=token.split('.');if(parts.length!==2||parts.some(p=>!/^[A-Za-z0-9_-]+$/.test(p)))return null;
  const valid=await crypto.subtle.verify('HMAC',await key(c.secret+'\0'+c.password),Uint8Array.from(decode(parts[1]),s=>s.charCodeAt(0)),encoder.encode(parts[0]));if(!valid)return null;
  const p=JSON.parse(decode(parts[0]));if(p.v!==1||p.scope!==BASE||p.origin!==new URL(request.url).origin||!Number.isSafeInteger(p.exp)||!Number.isSafeInteger(p.iat)||p.exp<=now||p.iat>now+60||p.exp-p.iat!==TTL)return null;
  return p;
 }catch{return null}
}
const loginCss=`:root{color-scheme:dark}body{font:17px/1.5 system-ui,sans-serif;background:#101d28;color:#e8f0f6;margin:0;padding:24px}main{max-width:480px;margin:8vh auto;padding:26px;border:1px solid #52616e;border-radius:14px}h1{line-height:1.2}label{display:block;margin-top:20px}input{box-sizing:border-box;width:100%;min-height:48px;font:inherit;margin:8px 0 16px;padding:10px;background:#172936;color:inherit;border:1px solid #8496a4;border-radius:6px}button{min-height:48px;padding:10px 20px;font:inherit;background:#ffa35e;color:#17212a;border:0;border-radius:6px;cursor:pointer}a{color:#78e4db}small{display:block;margin:18px 0}.error{color:#ffd2b1}.cf-turnstile{min-height:65px}`;
function page(c,error='',status=200){
 const nonce=crypto.randomUUID().replaceAll('-','');
 const body=`<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Spacetent · Vragen testen</title><style nonce="${nonce}">${loginCss}</style>${c?'<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>':''}</head><body><main><p>Wisik · Spacetent</p><h1>Vragen testen</h1>${c?`<p>Alle opgaven vrij onderzoeken, los van de leerroute. Alleen toegankelijk met het testwachtwoord.</p>${error?`<p role="alert" class="error">${escape(error)}</p>`:''}<form method="post" action="${BASE}login"><label for="password">Wachtwoord</label><input id="password" name="password" type="password" required maxlength="256" autocomplete="current-password"><div class="cf-turnstile" data-size="compact" data-sitekey="${escape(c.site)}" data-action="ruimteklaar_test_login"></div><button type="submit">Open testmodus</button></form><small>De beveiligingscontrole loopt via Cloudflare Turnstile. Testantwoorden blijven alleen in het geheugen van dit tabblad; ze veranderen je gewone voortgang niet.</small>`:'<p>De testmodus is nog niet geactiveerd. Het wachtwoord en de beveiligingsinstellingen worden later ingesteld.</p><p>Tot dat moment blijft de toegang gesloten.</p>'}<p><a href="/apps/ruimteklaar/">Terug naar de gewone leerroute</a></p></main></body></html>`;
 return response(body,status,undefined,{'Content-Security-Policy':`default-src 'none'; script-src https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src https://challenges.cloudflare.com; style-src 'nonce-${nonce}'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`});
}
async function formBody(request){
 if(!(request.headers.get('Content-Type')||'').startsWith('application/x-www-form-urlencoded'))throw new Error('type');
 const reader=request.body?.getReader();if(!reader)throw new Error('body');let bytes=0;const chunks=[];
 for(;;){const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>8192){await reader.cancel();throw new Error('size')}chunks.push(value)}
 const buffer=new Uint8Array(bytes);let at=0;for(const chunk of chunks){buffer.set(chunk,at);at+=chunk.length}return new URLSearchParams(new TextDecoder().decode(buffer));
}
async function samePassword(a,b){const x=await digest(a),y=await digest(b);let d=0;for(let i=0;i<x.length;i++)d|=x.charCodeAt(i)^y.charCodeAt(i);return d===0}
/** options are dependency injection for automated tests, not an HTTP/config bypass. */
export async function handleTestRequest(request,env,assets,{now=()=>Math.floor(Date.now()/1000),fetcher=fetch}={}){
 const url=new URL(request.url),path=url.pathname;
 if(url.protocol!=='https:')return response('Gebruik HTTPS.',400,'text/plain; charset=utf-8');
 if(path!==BASE.slice(0,-1)&&!path.startsWith(BASE))return response('Niet gevonden.',404,'text/plain; charset=utf-8');
 if(!['GET','HEAD','POST'].includes(request.method))return response('Niet toegestaan.',405,'text/plain; charset=utf-8',{'Allow':'GET, HEAD, POST'});
 if(request.method==='POST'&&(request.headers.get('Origin')!==url.origin||request.headers.get('Sec-Fetch-Site')==='cross-site'))return response('Ongeldige herkomst.',403,'text/plain; charset=utf-8');
 if(path===BASE+'logout'&&request.method==='POST')return response(null,303,undefined,{'Location':BASE,'Set-Cookie':cookie('')});
 const c=config(env);if(!c)return page(null,'',503);
 if(path===BASE+'login'&&request.method==='POST'){
  let fields;try{fields=await formBody(request)}catch{return page(c,'De aanmelding kon niet worden verwerkt.',400)}
  const passwords=fields.getAll('password'),tokens=fields.getAll('cf-turnstile-response');if(passwords.length!==1||tokens.length!==1||passwords[0].length>256||tokens[0].length>2048||!tokens[0])return page(c,'Controleer je wachtwoord en de beveiligingscontrole.',401);
  let verified=false;
  try{const r=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({secret:c.turnstile,response:tokens[0]}).toString(),signal:AbortSignal.timeout(8000)});const d=await r.json();verified=r.ok&&d.success===true&&d.hostname===url.hostname&&d.action==='ruimteklaar_test_login'}catch{return page(c,'De beveiligingscontrole is tijdelijk niet beschikbaar. Probeer opnieuw.',503)}
  if(!verified||!await samePassword(passwords[0],c.password))return page(c,'Controleer je wachtwoord en de beveiligingscontrole.',401);
  const issued=now(),token=await sign({v:1,scope:BASE,origin:url.origin,iat:issued,exp:issued+TTL,nonce:crypto.randomUUID()},c.secret+'\0'+c.password);
  return response(null,303,undefined,{'Location':BASE,'Set-Cookie':cookie(token)});
 }
 if(request.method==='POST')return response('Niet gevonden.',404,'text/plain; charset=utf-8');
 const s=await session(request,c,now());
 if(!s){if(path===BASE||path===BASE.slice(0,-1)||path===BASE+'index.html')return page(c);return response('Aanmelden vereist.',401,'text/plain; charset=utf-8')}
 if(path===BASE+'session')return response(request.method==='HEAD'?null:JSON.stringify({authenticated:true,expiresAt:s.exp*1000}),200,'application/json');
 if(path===BASE.slice(0,-1))return response(null,302,undefined,{'Location':BASE});
 const name=path===BASE||path===BASE+'index.html'?'index.html':path.slice(BASE.length);
 if(!Object.hasOwn(assets,name))return response('Niet gevonden.',404,'text/plain; charset=utf-8');
 const asset=assets[name];return response(request.method==='HEAD'?null:asset.body,200,asset.type,{'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"});
}

/** Password-gated review delivery. No secrets or private assets are stored in public/.
 * A missing/weak configuration always fails closed. No API writes learner progress.
 * The attempt limiter is per Worker isolate, not a global distributed WAF replacement.
 */
export const REVIEW_ROOT='/apps/ruimteklaar/test/';
const COOKIE='__Host-wisik-ruimteklaar-test',TTL=3600,BODY_LIMIT=2048;
const enc=new TextEncoder(),attempts=new Map();
const CSS='body{margin:0;background:#081827;color:#eef4fa;font:17px/1.6 system-ui,sans-serif}main{max-width:560px;margin:8vh auto;padding:24px}h1{line-height:1.2}label{display:block}input,button{box-sizing:border-box;display:block;font:inherit;min-height:48px;border-radius:8px;margin:12px 0;padding:10px 14px;width:100%}input{background:#152d41;color:white;border:1px solid #7792a6}button{border:0;background:#ffc08d;color:#142333;font-weight:650}a{color:#8cddd5}.notice{padding:14px;border:1px solid #ddac85;border-radius:8px}small{display:block}.tag{color:#ffc08d;letter-spacing:.12em}';
function baseHeaders(type='text/html; charset=utf-8'){
 return new Headers({'Content-Type':type,'Cache-Control':'private, no-store, max-age=0','CDN-Cache-Control':'no-store','Cloudflare-CDN-Cache-Control':'no-store','Pragma':'no-cache','Vary':'Cookie','X-Robots-Tag':'noindex, nofollow, noarchive','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; connect-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'; object-src 'none'"});
}
function reply(body,status=200,type){return new Response(body,{status,headers:baseHeaders(type)})}
function json(body,status=200){return reply(JSON.stringify(body),status,'application/json; charset=utf-8')}
function page(configured,message=''){
 return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Ruimteklaar · toegang tot testmodus</title><link rel="stylesheet" href="${REVIEW_ROOT}login.css"></head><body><main><p class="tag">WISIK · TESTBALIE</p><h1>Ruimteklaar testen</h1>${message?'<p class="notice" role="alert">'+message+'</p>':''}${configured?`<p>Alle vragen en constructies vrij doorlopen, los van de leerroute. Toegang is alleen voor testers met het wachtwoord.</p><form method="post" action="${REVIEW_ROOT}login"><label for="password">Wachtwoord</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="512"><button type="submit">Open de testmodus</button></form><small>Deze toegang verloopt na één uur. Testantwoorden worden niet op de server of in je leerlingvoortgang bewaard.</small>`:'<p>De testmodus is voorbereid, maar nog niet geactiveerd. Het wachtwoord wordt later ingesteld. Er is geen tijdelijk of standaardwachtwoord.</p>'}<p><a href="/apps/ruimteklaar/">Naar de gewone leerroute</a></p></main></body></html>`;
}
function configured(env){return typeof env.RUIMTEKLAAR_TEST_PASSWORD==='string'&&env.RUIMTEKLAAR_TEST_PASSWORD.trim().length>=20&&env.RUIMTEKLAAR_TEST_PASSWORD.length<=512&&typeof env.RUIMTEKLAAR_TEST_SESSION_SECRET==='string'&&env.RUIMTEKLAAR_TEST_SESSION_SECRET.trim().length>=32}
const b64=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
function unb64(s){if(!/^[A-Za-z0-9_-]+$/.test(s))throw new Error('encoding');return Uint8Array.from(atob(s.replaceAll('-','+').replaceAll('_','/')+'='.repeat((4-s.length%4)%4)),c=>c.charCodeAt(0));}
async function key(env){return crypto.subtle.importKey('raw',enc.encode(JSON.stringify([env.RUIMTEKLAAR_TEST_SESSION_SECRET,env.RUIMTEKLAAR_TEST_PASSWORD])),{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])}
async function sign(k,text){return new Uint8Array(await crypto.subtle.sign('HMAC',k,enc.encode(text)))}
function cookie(value,maxAge=TTL){return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`}
function redirect(location,session){const h=baseHeaders();h.set('Location',location);if(session!==undefined)h.set('Set-Cookie',cookie(session,session?TTL:0));return new Response(null,{status:303,headers:h})}
async function validSession(request,k,now){
 const values=(request.headers.get('Cookie')||'').split(';').map(s=>s.trim()).filter(s=>s.startsWith(COOKIE+'='));
 if(values.length!==1)return null;
 const token=values[0].slice(COOKIE.length+1);if(token.length>1024)return null;
 try{const [payload,signature,...extra]=token.split('.');if(extra.length||!payload||!signature)return null;const bytes=unb64(signature);if(bytes.length!==32||!await crypto.subtle.verify('HMAC',k,bytes,enc.encode(payload)))return null;
  const data=JSON.parse(new TextDecoder().decode(unb64(payload)));if(data.v!==1||data.aud!==new URL(request.url).origin||!Number.isSafeInteger(data.iat)||!Number.isSafeInteger(data.exp)||data.iat>now+5||data.exp<=now||data.exp-data.iat!==TTL||typeof data.nonce!=='string')return null;return data;
 }catch{return null}
}
async function limitedBody(request){
 const length=request.headers.get('Content-Length');if(length&&(!/^\d+$/.test(length)||Number(length)>BODY_LIMIT))return null;
 if(!request.body)return '';const reader=request.body.getReader();let size=0;const chunks=[];
 try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>BODY_LIMIT){await reader.cancel();return null}chunks.push(value)}const all=new Uint8Array(size);let offset=0;for(const c of chunks){all.set(c,offset);offset+=c.length}return new TextDecoder('utf-8',{fatal:true}).decode(all)}catch{return null}finally{reader.releaseLock()}
}
async function throttle(request,k,now){
 for(const [id,row] of attempts)if(row.until<=now)attempts.delete(id);
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';const id=b64(await sign(k,'attempt:'+ip));let row=attempts.get(id);
 if(!row){if(attempts.size>=2048)return {ok:false,retry:900};row={count:0,until:now+900};attempts.set(id,row)}
 row.count++;return {ok:row.count<=5,retry:Math.max(1,row.until-now),id};
}
export async function handleReview(request,env,assets,clock=()=>Date.now()){
 const url=new URL(request.url),now=Math.floor(clock()/1000),path=url.pathname,root=REVIEW_ROOT.slice(0,-1);
 if(path!==root&&!path.startsWith(REVIEW_ROOT))return reply('Niet gevonden.',404,'text/plain; charset=utf-8');
 if(url.protocol!=='https:')return reply('Gebruik HTTPS voor de testmodus.',400,'text/plain; charset=utf-8');
 const rel=path===root?'':path.slice(REVIEW_ROOT.length),method=request.method;
 if(rel==='login.css'&&(method==='GET'||method==='HEAD'))return reply(method==='HEAD'?null:CSS,200,'text/css; charset=utf-8');
 if(!configured(env))return rel===''||rel==='index.html'?reply(method==='HEAD'?null:page(false),503):json({error:'Testmodus niet geactiveerd.'},503);
 if(!['GET','HEAD','POST'].includes(method))return reply('Methode niet toegestaan.',405,'text/plain; charset=utf-8');
 // SameSite cookies and a strict Origin check guard login, logout and any future POST.
 if(method==='POST'&&request.headers.get('Origin')!==url.origin)return json({error:'Ongeldige herkomst.'},403);
 const k=await key(env);
 if(rel==='login'&&method==='POST'){
  if(!(request.headers.get('Content-Type')||'').toLowerCase().startsWith('application/x-www-form-urlencoded'))return json({error:'Ongeldig formulier.'},415);
  const body=await limitedBody(request);if(body===null)return json({error:'Formulier te groot of ongeldig.'},413);
  const form=new URLSearchParams(body),passwords=form.getAll('password');if(passwords.length!==1||passwords[0].length>512)return reply(page(true,'Wachtwoord niet herkend.'),401);
  const limit=await throttle(request,k,now);if(!limit.ok){const r=reply(page(true,'Te veel pogingen. Probeer het later opnieuw.'),429);r.headers.set('Retry-After',String(limit.retry));return r}
  const expected=await sign(k,'password:'+env.RUIMTEKLAAR_TEST_PASSWORD);
  if(!await crypto.subtle.verify('HMAC',k,expected,enc.encode('password:'+passwords[0])))return reply(page(true,'Wachtwoord niet herkend.'),401);
  attempts.delete(limit.id);
  const payload=b64(enc.encode(JSON.stringify({v:1,aud:url.origin,iat:now,exp:now+TTL,nonce:crypto.randomUUID()}))),signature=b64(await sign(k,payload));
  return redirect(REVIEW_ROOT,payload+'.'+signature);
 }
 if(rel==='logout'&&method==='POST')return redirect(REVIEW_ROOT,'');
 if(method==='POST')return json({error:'Niet gevonden.'},404);
 const session=await validSession(request,k,now);
 if(!session)return rel===''||rel==='index.html'?reply(method==='HEAD'?null:page(true),200):json({error:'Wachtwoord vereist.'},401);
 if(rel==='session')return json({authenticated:true,expiresAt:session.exp*1000});
 if(rel===''){
  if(path===root)return redirect(REVIEW_ROOT);
  const asset=assets['index.html'];return asset?reply(method==='HEAD'?null:asset.body,200,asset.type):reply('Testmodus tijdelijk niet beschikbaar.',503,'text/plain; charset=utf-8');
 }
 // Exact allowlist: no filenames from user input are resolved on a filesystem.
 const asset=Object.hasOwn(assets,rel)?assets[rel]:null;
 if(!asset)return reply('Niet gevonden.',404,'text/plain; charset=utf-8');
 return reply(method==='HEAD'?null:asset.body,200,asset.type);
}

import assert from 'node:assert/strict';
import {handleReview,REVIEW_ROOT as R} from '../server/ruimteklaar-test-auth.mjs';
const env={RUIMTEKLAAR_TEST_PASSWORD:'test-only-long-passphrase-not-a-production-secret',RUIMTEKLAAR_TEST_SESSION_SECRET:'test-only-session-key-012345678901234567890123456789'};
const assets={'index.html':{type:'text/html',body:'PRIVATE_REVIEW_HTML'},'assets/test.js':{type:'text/javascript',body:'PRIVATE_REVIEW_JS'}};
let now=1800000000000,count=0;const origin='https://wisik.nl';
function req(rel='',options={}){return new Request(origin+R+rel,{...options,headers:{'CF-Connecting-IP':'192.0.2.10',...options.headers}})}
function run(request,e=env){count++;return handleReview(request,e,assets,()=>now)}
const post=(password,extra={})=>req('login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/x-www-form-urlencoded',...extra},body:new URLSearchParams({password})});
for(const e of [{},{RUIMTEKLAAR_TEST_PASSWORD:env.RUIMTEKLAAR_TEST_PASSWORD},{...env,RUIMTEKLAAR_TEST_PASSWORD:'short'},{...env,RUIMTEKLAAR_TEST_SESSION_SECRET:'short'}]){
 for(const path of ['','index.html','assets/test.js','session','?test=1','../test/assets/test.js']){const r=await run(req(path),e);assert.equal(r.status,503);assert.doesNotMatch(await r.text(),/PRIVATE_REVIEW/)}
}
for(const path of ['assets/test.js','session','assets/test.js?password='+env.RUIMTEKLAAR_TEST_PASSWORD,'assets/test.js?token=anything']){const r=await run(req(path));assert.equal(r.status,401);assert.doesNotMatch(await r.text(),/PRIVATE_REVIEW/)}
const login=await run(req());assert.equal(login.status,200);assert.match(await login.text(),/name="password"/);assert.equal(login.headers.get('Cache-Control'),'private, no-store, max-age=0');
assert.equal((await run(new Request('http://wisik.nl'+R))).status,400);
assert.equal((await run(post(env.RUIMTEKLAAR_TEST_PASSWORD,{Origin:'https://evil.example'}))).status,403);
assert.equal((await run(req('login',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'password=x'}))).status,403);
assert.equal((await run(req('login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'}))).status,415);
assert.equal((await run(post('x'.repeat(2500)))).status,413);
for(let i=0;i<5;i++){const r=await run(post('wrong'));assert.equal(r.status,401);assert.equal(r.headers.get('Set-Cookie'),null);assert.doesNotMatch(await r.text(),/wrong|test-only-long/)}
assert.equal((await run(post(env.RUIMTEKLAAR_TEST_PASSWORD))).status,429);
now+=901000;
const auth=await run(post(env.RUIMTEKLAAR_TEST_PASSWORD));assert.equal(auth.status,303);assert.equal(auth.headers.get('Location'),R);
const raw=auth.headers.get('Set-Cookie');assert.match(raw,/^__Host-/);for(const flag of ['Secure','HttpOnly','SameSite=Strict','Path=/','Max-Age=3600'])assert.ok(raw.includes(flag));
const cookie=raw.split(';')[0],authed=(path='',extra={})=>req(path,{headers:{Cookie:cookie,...extra}});
assert.equal(await (await run(authed())).text(),'PRIVATE_REVIEW_HTML');
assert.equal(await (await run(authed('assets/test.js'))).text(),'PRIVATE_REVIEW_JS');
assert.equal((await run(authed('session'))).status,200);
assert.equal((await run(authed('constructor'))).status,404);
assert.equal((await run(authed('assets/test.js.map'))).status,404);
assert.equal((await run(req('assets/test.js',{headers:{Cookie:cookie+'; '+cookie}}))).status,401);
assert.equal((await run(req('assets/test.js',{headers:{Cookie:cookie.slice(0,-6)+'AAAAAA'}}))).status,401);
assert.equal((await run(req('assets/test.js',{headers:{Cookie:'__Host-wisik-ruimteklaar-test=forged'}}))).status,401);
assert.equal((await run(new Request('https://preview.pages.dev'+R+'assets/test.js',{headers:{Cookie:cookie}}))).status,401);
assert.equal((await run(authed('assets/test.js'),{...env,RUIMTEKLAAR_TEST_PASSWORD:env.RUIMTEKLAAR_TEST_PASSWORD+'changed'})).status,401);
assert.equal((await run(authed('assets/test.js'),{...env,RUIMTEKLAAR_TEST_SESSION_SECRET:env.RUIMTEKLAAR_TEST_SESSION_SECRET+'changed'})).status,401);
const head=await run(req('assets/test.js',{method:'HEAD',headers:{Cookie:cookie}}));assert.equal(head.status,200);assert.equal(await head.text(),'');
assert.equal((await run(req('logout',{method:'POST',headers:{Cookie:cookie,Origin:'https://evil.example'}}))).status,403);
const logout=await run(req('logout',{method:'POST',headers:{Cookie:cookie,Origin:origin}}));assert.equal(logout.status,303);assert.match(logout.headers.get('Set-Cookie'),/Max-Age=0/);
now+=3601000;assert.equal((await run(authed('session'))).status,401);assert.equal((await run(authed('assets/test.js'))).status,401);
for(const path of ['assets/test.js','../','../../','%2e%2e/secret','/assets/test.js']){const r=await run(req(path));assert.ok([401,404].includes(r.status));assert.doesNotMatch(await r.text(),/PRIVATE_REVIEW/)}
console.log(JSON.stringify({status:'passed',requests:count,checks:'closed before configuration; POST/Origin/body guards; HMAC session; expiry; tampering; duplicate cookies; host binding; secret rotation; attempt throttle; logout; private assets and no-store; path boundaries'},null,2));

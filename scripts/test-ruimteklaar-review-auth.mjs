import assert from 'node:assert/strict';
import {factorCode, isPrime64, MAX_FACTOR_INTEGER} from '../server/ruimteklaar-factor-code.mjs';
import {handleReview, REVIEW_ROOT as R} from '../server/ruimteklaar-test-auth.mjs';
let mathematicalChecks = 0;
const valid = [
  ['12 2 2 3','12 2^2 3'],['12 3 2^2','12 2^2 3'],['12 2² 3','12 2^2 3'],
  ['360 2^3 3² 5','360 2^3 3^2 5'],['  72   3²  2³  ','72 2^3 3^2'],
  ['72\t2³\n3^2','72 2^3 3^2'],['72\u00a02³\u00a03²','72 2^3 3^2'],
  ['16 2² 2^2','16 2^4'],['12 2^1 3 2','12 2^2 3'],['00012 0002² 003','12 2^2 3'],
  ['1024 2^10','1024 2^10'],['1024 2¹⁰','1024 2^10'],['2 2','2 2'],['13 13','13 13'],
  ['9223372036854775808 2^63','9223372036854775808 2^63'],
  ['9223372036854775808 '+Array(63).fill('2').join(' '),'9223372036854775808 2^63'],
  ['18446744073709551557 18446744073709551557','18446744073709551557 18446744073709551557'],
  ['18446744073709551615 3 5 17 257 641 65537 6700417','18446744073709551615 3 5 17 257 641 65537 6700417']
];
for (const [input, canonical] of valid) { assert.equal(factorCode(input), canonical, input); mathematicalChecks++; }
const invalid = [
  '', '12', '12 4 3', '36 6²', '12 2 3', '12 2² 5', '12 12', '1', '1 1', '0 2', '0 0',
  '-12 -1 2² 3', '-12 2² 3', '12 -2 -2 3', '12 1 2² 3', '12 2² 3 1',
  '12 0 2² 3', '8 2^0 2^3', '8 2⁰ 2³', '8 2^-3', '8 2⁻³', '8 2^1.5', '8 2^',
  '8 ^3', '8 2^^3', '8 2^3^1', '8 2³1', '8 2^³', '8 2³^1', '12 2*2*3', '12 2×2×3',
  '12 = 2² 3', '12 2²×3', '12 2.0 2 3', '12,0 2² 3', '1e2 2² 5²', '100 2² 5²x',
  '0xC 2² 3','12 0x2 2 3','12 ２² 3','12 2² 3\0','12 2² 3\u200b', '8 2^999999999',
  '12 2^01 2^0 3', '12 __proto__', '12 constructor', '<script>alert(1)</script>', '12 2² 3;alert(1)',
  '8 '.repeat(300), '18446744073709551616 2^64', '18446744073709551615 18446744073709551615',
  '341550071728321 341550071728321', '3825123056546413051 3825123056546413051',
  null, {}, 12, true, ['12','2²','3']
];
for (const input of invalid) { assert.equal(factorCode(input), null, String(input)); mathematicalChecks++; }
// Independent sieve and trial division oracle, not the tested primality algorithm.
const sieve = new Uint8Array(10001); sieve.fill(1, 2);
for (let p = 2; p * p <= 10000; p++) if (sieve[p]) for (let n = p * p; n <= 10000; n += p) sieve[n] = 0;
for (let n = 0; n <= 10000; n++) { assert.equal(isPrime64(BigInt(n)), !!sieve[n], 'prime ' + n); mathematicalChecks++; }
for (let n = 2; n <= 2000; n++) {
  let rest = n; const parts = [];
  for (let p = 2; p * p <= rest; p++) { let e = 0; while (rest % p === 0) { rest /= p; e++; } if (e) parts.push(p + (e > 1 ? '^' + e : '')); }
  if (rest > 1) parts.push(String(rest));
  const input = n + ' ' + parts.join(' ');
  assert.equal(factorCode(input), input);
  assert.equal(factorCode(n + ' ' + parts.slice().reverse().join(' ')), input);
  assert.equal(factorCode((n + 1) + ' ' + parts.join(' ')), null);
  mathematicalChecks += 3;
}
for (const n of [2047n,1373653n,25326001n,3215031751n,2152302898747n,3474749660383n,341550071728321n,3825123056546413051n,MAX_FACTOR_INTEGER]) { assert.equal(isPrime64(n), false, String(n)); mathematicalChecks++; }
for (const n of [2147483647n,2305843009213693951n,18446744073709551557n]) { assert.equal(isPrime64(n), true); mathematicalChecks++; }
let now = 1800000000000, count = 0;
const origin = 'https://wisik.nl', env = {}, name = '__Host-wisik-ruimteklaar-test';
const assets = {'index.html':{type:'text/html',body:'PRIVATE_REVIEW_HTML'},'assets/test.js':{type:'text/javascript',body:'PRIVATE_REVIEW_JS'}};
function req(rel = '', options = {}) { return new Request(origin + R + rel, {...options, headers:{'CF-Connecting-IP':'192.0.2.10',...options.headers}}); }
function run(request, e = env) { count++; return handleReview(request, e, assets, () => now); }
const post = (password, extra = {}) => req('login', {method:'POST',headers:{Origin:origin,'Content-Type':'application/x-www-form-urlencoded',...extra},body:new URLSearchParams({password})});
const noHints = html => { assert.doesNotMatch(html, /priem|factor|ontbind|exponent|rekensom|voorbeeld|360|2\^3|2³/i); assert.equal((html.match(/<input\b/g)||[]).length,1); assert.doesNotMatch(html, /<button\b|placeholder=|pattern=|<h1|<p[ >]|<a[ >]/); };
for (const path of ['assets/test.js','session','assets/test.js?password=12%202%C2%B2%203','assets/test.js?test=true']) {
  const r = await run(req(path)); assert.equal(r.status,401); assert.doesNotMatch(await r.text(),/PRIVATE_REVIEW/);
}
const login = await run(req()); assert.equal(login.status,200); noHints(await login.text());
assert.equal(login.headers.get('Cache-Control'),'private, no-store, max-age=0');
assert.equal((await run(new Request('http://wisik.nl'+R))).status,400);
assert.equal((await run(post('12 2² 3',{Origin:'https://evil.example'}))).status,403);
assert.equal((await run(req('login',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'password=x'}))).status,403);
assert.equal((await run(req('login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'}))).status,415);
assert.equal((await run(post('x'.repeat(5000)))).status,413);
assert.equal((await run(req('login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/x-www-form-urlencoded'},body:'password=12+2%C2%B2+3&password=wrong'}))).status,401);
now += 901000;
for (let i = 0; i < 5; i++) { const r = await run(post('12 4 3')); assert.equal(r.status,401); assert.equal(r.headers.get('Set-Cookie'),null); const text=await r.text(); noHints(text); assert.doesNotMatch(text,/12 4 3/); }
const throttled = await run(post('12 2² 3')); assert.equal(throttled.status,429); noHints(await throttled.text()); assert.ok(Number(throttled.headers.get('Retry-After')) > 0);
now += 901000;
for (const [code] of valid) { const r = await run(post(code)); assert.equal(r.status,303,code); }
const auth = await run(post('360 2^3 3² 5')); assert.equal(auth.status,303); assert.equal(auth.headers.get('Location'),R);
const raw = auth.headers.get('Set-Cookie');
for (const flag of ['__Host-','Secure','HttpOnly','SameSite=Strict','Path=/','Max-Age=3600']) assert.ok(raw.includes(flag));
const cookie = raw.split(';')[0], authed = (path = '', extra = {}) => req(path,{headers:{Cookie:cookie,...extra}});
assert.equal(await (await run(authed())).text(),'PRIVATE_REVIEW_HTML');
assert.equal(await (await run(authed('assets/test.js'))).text(),'PRIVATE_REVIEW_JS');
assert.equal((await run(authed('session'))).status,200);
assert.equal((await run(authed('constructor'))).status,404);
assert.equal((await run(authed('__proto__'))).status,404);
assert.equal((await run(authed('assets/test.js.map'))).status,404);
assert.equal((await run(req('assets/test.js',{headers:{Cookie:cookie+'; '+cookie}}))).status,401);
assert.equal((await run(req('assets/test.js',{headers:{Cookie:name+'=forged'}}))).status,401);
assert.equal((await run(new Request('https://preview.pages.dev'+R+'assets/test.js',{headers:{Cookie:cookie}}))).status,401);
const decoded = JSON.parse(Buffer.from(cookie.slice(cookie.indexOf('=')+1),'base64url').toString());
const encoded = data => name+'='+Buffer.from(JSON.stringify(data)).toString('base64url');
for (const patch of [{proof:'12 4 3'},{proof:'360 2³ 3² 5'},{proof:'360 2^3 3^2'},{proof:null},{proof:true},{proof:'x'.repeat(5000)},{v:1},{aud:'https://other.example'},{exp:decoded.iat+1},{iat:decoded.iat+100,exp:decoded.exp+100}]) {
  const r = await run(req('assets/test.js',{headers:{Cookie:encoded({...decoded,...patch})}})); assert.equal(r.status,401,JSON.stringify(patch)); assert.doesNotMatch(await r.text(),/PRIVATE_REVIEW/);
}
// A newly supplied valid mathematical credential is authorized by the user's rule.
// No claim that the envelope is signed, that the timestamp cannot be changed,
// or that knowing the rule proves a particular user's identity.
assert.equal((await run(req('assets/test.js',{headers:{Cookie:encoded({...decoded,proof:'12 2^2 3'})}}))).status,200);
// Old password settings no longer authorize an arbitrary string, nor disable valid mathematics.
assert.equal((await run(post('old-secret'),{RUIMTEKLAAR_TEST_PASSWORD:'old-secret'})).status,401);
assert.equal((await run(post('12 2² 3'),{RUIMTEKLAAR_TEST_PASSWORD:'old-secret'})).status,303);
const head = await run(req('assets/test.js',{method:'HEAD',headers:{Cookie:cookie}})); assert.equal(head.status,200); assert.equal(await head.text(),'');
assert.equal((await run(req('',{method:'DELETE'}))).status,405);
assert.equal((await run(req('logout',{method:'POST',headers:{Cookie:cookie,Origin:'https://evil.example'}}))).status,403);
const logout = await run(req('logout',{method:'POST',headers:{Cookie:cookie,Origin:origin}})); assert.equal(logout.status,303); assert.match(logout.headers.get('Set-Cookie'),/Max-Age=0/);
assert.equal((await run(req('assets/test.js'))).status,401);
now += 3601000; assert.equal((await run(authed('session'))).status,401); assert.equal((await run(authed('assets/test.js'))).status,401);
for (const path of ['../','../../','%2e%2e/secret','/assets/test.js']) { const r = await run(req(path)); assert.ok([401,404].includes(r.status)); assert.doesNotMatch(await r.text(),/PRIVATE_REVIEW/); }
console.log(JSON.stringify({status:'passed',requests:count,mathematicalChecks,checks:'exact BigInt factorisations; repeated primes, caret and superscripts; independent small-number oracle; 64-bit pseudoprimes and limits; server-side credential revalidation; one input without hints; native form; HTTPS/Origin/body checks; no credential flag bypass; protected assets; duplicate/invalid cookies; host/timeout checks; throttle and logout; no learner writes',limitation:'Mathematical puzzle gate, not identity authentication. Credential envelope unsigned; timeout renewable by anyone with a valid factorisation.'},null,2));

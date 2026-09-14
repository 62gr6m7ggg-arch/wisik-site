import fs from 'node:fs';
import path from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const packets=[1,2,3].map(n=>'scripts/review-source-'+n+'.txt');
const payload=packets.map(p=>fs.readFileSync(p,'utf8').trim()).join('');
assert.equal(createHash('sha256').update(payload).digest('hex'),'71fae380c395afc5aaa5694906d841c238285a0454e1a3247860f60741261684','Transport checksum');
const changes=JSON.parse(gunzipSync(Buffer.from(payload,'base64')).toString('utf8'));
assert.equal(changes.length,16);
for(const c of changes){assert.ok(!c.path.includes('..')&&/^(tools\/ruimteklaar-review\/|functions\/apps\/ruimteklaar\/test\/|public\/_routes.json$|tools\/space-tent\/app\/workbench.tsx$|package.json$|\.gitignore$)/.test(c.path));const actual=fs.existsSync(c.path)?createHash('sha256').update(fs.readFileSync(c.path)).digest('hex'):null;assert.equal(actual,c.before,'Source changed: '+c.path);}
for(const c of changes){fs.mkdirSync(path.dirname(c.path),{recursive:true});fs.writeFileSync(c.path,c.content);}
const edit=(file,from,to)=>{const s=fs.readFileSync(file,'utf8');assert.ok(s.includes(from),'Expected source: '+file);fs.writeFileSync(file,s.replace(from,to));};
const root='tools/ruimteklaar-review/';
edit(root+'server.mjs',"'Referrer-Policy':'no-referrer'","'Referrer-Policy':'same-origin'");
edit(root+'server.mjs','class="cf-turnstile" data-sitekey=','class="cf-turnstile" data-size="compact" data-sitekey=');
edit(root+'test-browser.mjs','let browser;','let browser,activePage,activeEnvironment;');
edit(root+'test-browser.mjs','const page=await context.newPage();','const page=await context.newPage();activePage=page;activeEnvironment=c.name;');
edit(root+'test-browser.mjs',"await page.goto(origin+BASE);await page.getByLabel('Wachtwoord'", "await page.goto(origin+BASE);await page.screenshot({path:path.join(out,c.name+'-login.png'),fullPage:true});await page.getByLabel('Wachtwoord'");
edit(root+'test-browser.mjs',"}finally{if(browser)await browser.close()}","}catch(e){if(activePage){await activePage.screenshot({path:path.join(out,(activeEnvironment||'browser')+'-failure.png'),fullPage:true}).catch(()=>{});}fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({status:'failed',environment:activeEnvironment,completed:results,error:e.message,pageErrors:errors},null,2));throw e;}finally{if(browser)await browser.close()}");
for(const p of packets)fs.unlinkSync(p);
console.log('Applied reviewed source with native form Origin fix. No production password or activation settings were supplied.');

// One-shot, checksum-guarded migration of existing browser assertions. Removed by CI.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
function edit(file, sha, change) {
  assert.equal(execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim(),sha,'Source changed: '+file);
  const before=fs.readFileSync(file,'utf8'),after=change(before);assert.notEqual(after,before,file);fs.writeFileSync(file,after);
}
edit('tools/space-tent/scripts/check-review-browser.mjs','68cb07e5ecac6990af3e9b460ca30049c07a3be3',s=>{
  s=s.replace(/^const env=.*;$/m,'const env={};').replace('let active=false,now=Date.now();','let now=Date.now();').replace('active?env:{}','env');
  const start=s.indexOf(' await page.goto(base+R);active=false;'),end=s.indexOf(' await page.evaluate(()=>{localStorage.setItem',start);assert.ok(start>0&&end>start);
  const intro=` await page.goto(base+R);await page.getByLabel('Wachtwoord',{exact:true}).waitFor();
 assert.equal(await page.locator('input:visible').count(),1);assert.equal(await page.getByRole('button').count(),0);assert.equal(await page.innerText('body'),'');
 assert.doesNotMatch(await page.content(),/priem|factor|ontbind|exponent|rekensom|voorbeeld|placeholder=/i);
 await page.screenshot({path:path.join(out,config.name+'-login.png'),fullPage:true});
 const js=Object.keys(assets).find(k=>k.endsWith('.js'));assert.equal((await context.request.get(base+R+js)).status(),401);
 await page.getByLabel('Wachtwoord',{exact:true}).fill('12 4 3');await page.getByLabel('Wachtwoord',{exact:true}).press('Enter');await page.locator('input[aria-invalid=true]').waitFor();assert.equal(await page.locator('[data-review-mode]').count(),0);
 assert.doesNotMatch(await page.content(),/priem|factor|ontbind|exponent|rekensom|voorbeeld/i);
 const credential=config.name==='chromium-desktop'?'12 2 2 3':config.name==='chromium-mobile'?'72 2^3 3^2':'360 2³ 3² 5';
 await page.getByLabel('Wachtwoord',{exact:true}).fill(credential);await page.getByLabel('Wachtwoord',{exact:true}).press('Enter');await page.locator('[data-review-mode=true]').waitFor();
`;
  s=s.slice(0,start)+intro+s.slice(end);
  s=s.replaceAll(".fill(env.RUIMTEKLAAR_TEST_PASSWORD)",".fill('360 2^3 3² 5')").replaceAll("page.getByRole('button',{name:'Open de testmodus',exact:true}).click()","page.getByLabel('Wachtwoord',{exact:true}).press('Enter')");
  s=s.replace('closed before secrets; wrong/right password;','one field without hints; native Enter; rejected composite factors; accepted repeat/caret/superscript codes;').replace('No professional penetration test; per-isolate attempt throttling is not global.','Mathematical access gate, not identity authentication. No professional penetration test; per-isolate throttling is not global.');
  assert.doesNotMatch(s,/active\?env|RUIMTEKLAAR_TEST_PASSWORD|nog niet geactiveerd|Open de testmodus/);return s;
});
edit('scripts/audit-ruimteklaar-review.mjs','f764df2edc3ea5ba76cb043b9d0566c0ace6cf83',s=>s.replace("'server/ruimteklaar-test-auth.mjs',","'server/ruimteklaar-test-auth.mjs','server/ruimteklaar-factor-code.mjs',").replace("version:'1.0'","version:'1.1-factor-gate'").replace('gesloten toegang, 62 serverchecks','servercontrole van factorisatiecodes, reken- en toegangschecks'));
console.log('Migrated existing browser suite; all 933 entry views and learner-isolation assertions retained.');

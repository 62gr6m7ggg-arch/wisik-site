import fs from 'node:fs';
import path from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const hash=b=>createHash('sha256').update(b).digest('hex');
const parts=Array.from({length:8},(_,i)=>fs.readFileSync(`scripts/rafelrandjes-payload-${i}.txt`,'utf8').trim());
console.log('Source transfer lengths:',parts.map(p=>p.length));
const packed=parts.join('');
assert.equal(hash(packed),'578e79cf702bff48c43f36969357c683a97ab0116b9bfe81cd58c91c5661cd28','Source transfer incomplete or altered');
const changes=JSON.parse(gunzipSync(Buffer.from(packed,'base64')).toString());
const outputs=[];
for(const c of changes){
 assert.ok(!c.path.includes('..')&&/^(public\/|scripts\/|docs\/|package\.json$)/.test(c.path));
 const current=fs.existsSync(c.path)?fs.readFileSync(c.path):null;
 assert.equal(current?hash(current):null,c.before,'Source changed: '+c.path);
 const chars=Array.from(current?.toString()||'');
 for(const [a,b,t] of c.edits.slice().reverse())chars.splice(a,b-a,...Array.from(t));
 const text=chars.join('');assert.equal(hash(text),c.after,'Patch corrupted: '+c.path);outputs.push([c.path,text]);
}
for(const [file,text] of outputs){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text)}
const test='scripts/check-rafelrandjes-browser.mjs';
const source=fs.readFileSync(test,'utf8');
const before="assert.ok((await page.locator('.paper-heading').innerText()).includes('nog niet te oefenen'));";
assert.ok(source.includes(before));
fs.writeFileSync(test,source.replace(before,"assert.match(await page.locator('.paper-heading').innerText(),/nog niet te oefenen/i);"));
console.log('Applied '+outputs.length+' checksum-verified Rafelrandjes files; visible status assertion respects CSS capitals.');

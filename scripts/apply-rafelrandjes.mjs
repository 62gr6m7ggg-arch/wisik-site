import fs from 'node:fs';
import path from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const changes=JSON.parse(gunzipSync(Buffer.from(fs.readFileSync('scripts/rafelrandjes-payload.txt','utf8').trim(),'base64')).toString());
const hash=b=>createHash('sha256').update(b).digest('hex');
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
console.log('Applied '+outputs.length+' checksum-verified Rafelrandjes files.');

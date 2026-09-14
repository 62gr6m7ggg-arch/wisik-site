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
for(const p of packets)fs.unlinkSync(p);
console.log('Applied 16 reviewed files. No production password or activation settings were supplied.');

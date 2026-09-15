import fs from 'node:fs';
import path from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const packed='H4sIAAAAAAAC/9V965LcRpbeq2CKoanqIaoa90s1m2NdOCPuSKJC1FBhq+lRAkh0g40CagFUN5sUI/zLT+AIh/0GG34A/999k30Sf+ckgALq0mxqx96wFMwuJPJy8uS5Zp5M/Px+shbN1WQ5Scq4Pq1EKvNKFMkbWc8tw/KM0HQXq2SiTyKZlpWcLItNnusTkTayQq3QiNPEjOzEcl1LBqln+m7qu6Yb22ESiShMXc+0HEumRhy5fhraduTFgRTCir3YNNCwTLKmnix//tnQDX3ySPthAIP2r//lv2l11sg5lcqkZizMhRVcFBfFo0fa8yKReVZcXhRfSe3rL17Mb2V1vc6FaGptlmSXWSNyqb3crFay0r4sN1UttS/Kze31BhVPv8xuMon3P8r4qsjk9YmW1ZqUhRaXRSzXzUVRrrVEjuBZaOjpRtSN1LLiqtxQ/2+u6eFSFJfUwC9bHJ4+uorKAUy/LBjQEp1Xt9mbuio3aOeXU5Q6/UWL0FLaaJGsGyEKDXA0ZVk02pVstEtZriWqaS/XIpbzq7JMk3WZZJsVmnyGooB/c4um101WFjSoXxLRiPlKNJsqa+5+madZjglD62uA02giz2mkaDGSTSXTlFu/FqJqAEbdnF3Qc1yu1rkEjJxHII1hV43WaINRgdflNbUJ+C/lNcpml9wKo1MWgPVrUSHVkZb2o1xJ6ab4DohfZnuZVggGKTsShJwQkZ4Ue2jF40mLN1RXIBdAMpXGjPQGXFkmiFu6EWkft9lRW19nJBvYJC/gzS1og9kbvOGCPEFxdFXNaYioyGpjUgx5QQ+EpW0BrUAcsdACCrDNN5KW9KmetavcaE1lcyU7jH7BUg4yK7pCzMEeOYq5IIXGfgMIBXl8UlTzjmjuYtIipRo5SMx3pzCRpsCwuIMKJPQIGhfwFEFjQ0mjiWORACsipIkzBKirIh3bi8KObaVdOs6+Xp6ZpwUBPhXxJnF/mpNmNgSeTkHQ6VgusI6XuST29AYCfDlvK76moTLaALTmVxSgR/fcoYnr+cQ5J9JeeE4NO/gOWjHPJ/hnEIkUBxyMtuYtAgT3I7S8CBGj9E4ibJSkbDWzWmFINiOcGEQtPZQZjxTzIGOl77kYUpgQ7kFiDei+KXBnnzoRmzWL2pfyEl1FQlybtmLGt0KLfiTOMIT';
// Payload is supplied separately to avoid changing source until every checksum passes.
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

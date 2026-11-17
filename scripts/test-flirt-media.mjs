import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {readMisconceptions} from './lib/pabo-source.mjs';
import {auditFlirtContent,verifyFlirtContentReview} from './lib/flirt-content-audit.mjs';
const catalog=JSON.parse(fs.readFileSync('public/assets/data/grabbelton-videos.json','utf8'));
const misconceptions=readMisconceptions(process.cwd());
const codes=process.env.WISIK_FLIRT_CODES?.split(',').filter(Boolean)||null;
const context={URL};vm.runInNewContext(fs.readFileSync('public/assets/js/grabbelton-core.js','utf8'),context);
assert.deepEqual(Array.from(context.WisikGrabbeltonCore.validateCatalog(catalog,{knownToolIds:['pabo-rekenklaar'],knownMisconceptionCodes:Object.keys(misconceptions),expectedCanonicalToolId:'pabo-rekenklaar',requireKnownTargets:true})),[]);
const audit=auditFlirtContent(process.cwd(),catalog,misconceptions,codes);
assert.ok(audit.passed,audit.failures.join('\n'));
for(const part of ['misconception','catalogItem','video','poster','captions','transcript']) {
  const changed=structuredClone(audit.snapshot);changed[0].fingerprints[part]='0'.repeat(64);
  assert.equal(verifyFlirtContentReview(audit.review,changed,codes||Object.keys(misconceptions)).passed,false,`Verouderde ${part} moet worden ontdekt`);
}
console.log(`Mediapakket en bestaande inhoudsgoedkeuring: ${audit.snapshot.map(v=>v.code).join(', ')}; nul rekenopgaven uitgevoerd.`);

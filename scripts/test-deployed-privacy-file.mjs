import assert from 'node:assert/strict';
import fs from 'node:fs';
import {verifyDeployedPrivacyFile as verify} from './verify-deployed-privacy-file.mjs';
const source=fs.readFileSync(new URL('../public/backstage/index.html',import.meta.url));
const text=source.toString('utf8');
const email='kladblok@wisik.nl';
const anchor=`<a href="mailto:${email}">${email}</a>`;
const script='<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>';
const encode=(s,key)=>Buffer.from([key,...Buffer.from(s).map(b=>b^key)]).toString('hex');
const fixture=(a,b)=>text.replace(anchor,`<a href="/cdn-cgi/l/email-protection#${encode(email,a)}"><span class="__cf_email__" data-cfemail="${encode(email,b)}">[email&#160;protected]</span></a>`).replace('</body>',script+'</body>');
assert.equal(verify(source,source,'/backstage/').mode,'byte-exact');
for(const [a,b] of [[79,236],[0,255],[7,7]]){
  const p=verify(source,Buffer.from(fixture(a,b)),'/backstage/');
  assert.equal(p.mode,'cloudflare-email-only');assert.equal(p.normalizedSha256,p.expectedSha256);
}
const actual=fixture(79,236);
const mutations=[
  actual.replace('3 maanden','30 maanden'),
  actual.replace('Privacy op het hele Wisik-terrein','Andere privacy'),
  actual.replace('</body>','<script src="https://example.org/extra.js"></script></body>'),
  actual.replace(script,''),
  actual.replace(script,script+script),
  actual.replace('data-cfasync="false"','data-cfasync="true"'),
  actual.replace('/cdn-cgi/scripts/5c5dd728/','https://example.org/'),
  actual.replace(encode(email,79),encode('other@example.org',79)),
  actual.replace(encode(email,236),encode('other@example.org',236)),
  actual.replace(encode(email,79),encode(email,79)+'0'),
  actual.replace('id="privacy"','id="privacy-weg"'),
  actual.replace('</body>',anchor+'</body>')
];
for(const mutated of mutations){assert.notEqual(mutated,actual);assert.throws(()=>verify(source,Buffer.from(mutated),'/backstage/'));}
assert.throws(()=>verify(source,Buffer.from(actual),'/kladblok/'));
console.log(JSON.stringify({strictDeploymentComparison:true,positiveCases:4,rejectedMutations:mutations.length+1}));

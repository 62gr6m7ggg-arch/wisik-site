import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {verifyDeployedPrivacyFile} from '../verify-deployed-privacy-file.mjs';
// Reuse the exact previously captured hosting addition. Never strip arbitrary
// scripts or markup: genuine application differences must still fail delivery.
export const hostingAddition = fs.readFileSync(new URL('../../tests/gonio_integrity.py',import.meta.url),'utf8').match(/HOSTING_ADDITION = b'''([\s\S]*?)'''/)[1];
const hash=b=>createHash('sha256').update(b).digest('hex');
export function deliveredSource(expected, actual, filename) {
 if(hash(expected)===hash(actual))return {verified:true,rawEqual:true};
 if(!filename.endsWith('.html'))return {verified:false,rawEqual:false};
 const candidates=[{bytes:actual,addition:null}];
 const text=actual.toString('utf8');
 if(text.split(hostingAddition).length===2)candidates.push({bytes:Buffer.from(text.replace(hostingAddition,'')),addition:'Previously captured Cloudflare beacon'});
 for(const candidate of candidates) {
  if(hash(candidate.bytes)===hash(expected))return {verified:true,rawEqual:false,hostingAddition:candidate.addition};
  if(filename==='public/backstage/index.html') {
   try {
    // Existing strict verifier: exactly one contact address, same decoded target
    // and label, exactly the known decoder. Any other byte change is rejected.
    const proof=verifyDeployedPrivacyFile(expected,candidate.bytes,'/backstage/');
    return {verified:true,rawEqual:false,hostingAddition:candidate.addition,emailProtection:proof.mode};
   } catch { /* This candidate did not match the exact hosting contract. */ }
  }
 }
 return {verified:false,rawEqual:false};
}

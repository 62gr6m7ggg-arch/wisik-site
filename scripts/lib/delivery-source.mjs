import fs from 'node:fs';
import {createHash} from 'node:crypto';
// Reuse the exact previously captured hosting addition. Never strip arbitrary
// scripts or markup: genuine application differences must still fail delivery.
export const hostingAddition = fs.readFileSync(new URL('../../tests/gonio_integrity.py',import.meta.url),'utf8').match(/HOSTING_ADDITION = b'''([\s\S]*?)'''/)[1];
const hash=b=>createHash('sha256').update(b).digest('hex');
export function deliveredSource(expected, actual, filename) {
 if(hash(expected)===hash(actual))return {verified:true,rawEqual:true};
 if(filename.endsWith('.html')) {
  const text=actual.toString('utf8');
  if(text.split(hostingAddition).length===2 && hash(Buffer.from(text.replace(hostingAddition,'')))===hash(expected))return {verified:true,rawEqual:false,hostingAddition:'Previously captured Cloudflare beacon'};
 }
 return {verified:false,rawEqual:false};
}

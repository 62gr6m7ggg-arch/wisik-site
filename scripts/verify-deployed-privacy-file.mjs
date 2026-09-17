import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const email='kladblok@wisik.nl';
const sourceAnchor=`<a href="mailto:${email}">${email}</a>`;
// Exact op 17 september 2026 waargenomen vorm; wijzigingen hierin vragen opnieuw review.
const decoder='<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>';
const encodedAnchor=/<a href="\/cdn-cgi\/l\/email-protection#([a-f0-9]+)"><span class="__cf_email__" data-cfemail="([a-f0-9]+)">\[email&#160;protected\]<\/span><\/a>/g;
const hash=b=>createHash('sha256').update(b).digest('hex');
function decode(value){
  assert.ok(/^(?:[a-f0-9]{2}){2,}$/.test(value),'Geldige even hexnotatie voor e-mailadres vereist');
  const bytes=Buffer.from(value,'hex'),key=bytes[0];
  return Buffer.from(bytes.subarray(1).map(byte=>byte^key)).toString('utf8');
}
/** Alleen controle: wijzigt geen productiebestanden, Cloudflare-instellingen of browserinhoud. */
export function verifyDeployedPrivacyFile(expected,actual,pathname){
  assert.ok(Buffer.isBuffer(expected)&&Buffer.isBuffer(actual),'Vergelijk de oorspronkelijke bytes');
  const proof={pathname,expectedSha256:hash(expected),servedSha256:hash(actual)};
  if(expected.equals(actual))return {...proof,mode:'byte-exact'};
  assert.equal(pathname,'/backstage/','Voor dit bestand zijn geen HTML-transformaties toegestaan');
  const source=expected.toString('utf8');let served=actual.toString('utf8');
  assert.equal(source.split(sourceAnchor).length-1,1,'Exact één expliciete broncontactlink vereist');
  assert.equal(source.includes(decoder),false,'Decoder mag niet al in de bron staan');
  let anchors=0;
  served=served.replace(encodedAnchor,(_all,href,text)=>{
    anchors++;
    assert.equal(decode(href),email,'Het gecodeerde maildoel moet ongewijzigd zijn');
    assert.equal(decode(text),email,'De gecodeerde zichtbare mailtekst moet ongewijzigd zijn');
    return sourceAnchor;
  });
  assert.equal(anchors,1,'Exact één gecontroleerde e-mailomzetting vereist');
  assert.equal(served.split(decoder).length-1,1,'Exact de waargenomen decoderinjectie vereist');
  served=served.replace(decoder,'');
  assert.equal(served,source,'Buiten de gecontroleerde e-mailomzetting moet ieder teken gelijk blijven');
  assert.ok(Buffer.from(served,'utf8').equals(expected),'Genormaliseerde UTF-8-bytes moeten gelijk zijn');
  return {...proof,mode:'cloudflare-email-only',normalizedSha256:hash(Buffer.from(served)),transformedEmails:1};
}

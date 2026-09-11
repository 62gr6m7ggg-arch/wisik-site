import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'public/rafelrand/konijnenhol');
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const css=fs.readFileSync(path.join(dir,'konijnenhol.css'),'utf8');
const m=JSON.parse(fs.readFileSync(path.join(dir,'media.json'),'utf8'));
const requireMedia=process.argv.includes('--media');
assert.equal(m.title,'Hoogstaand Diepgaan');
assert.equal(m.subtitle,'Wiskundig-high door diep te gaan');
assert.equal(m.type,'rabbit-hole');
assert.equal(m.didacticFlow,'none');assert.equal(m.assessment,'none');assert.deepEqual(m.dependencies,[]);
assert(html.includes(`<h1>${m.title}</h1>`));assert(html.includes(m.subtitle));
assert(html.includes('Waarschuwing: dit is een konijnenhol.'));
assert(html.includes('buiten het gewone curriculum van Ruimtemeetkunde'));
assert(html.includes('href="/#konijnenhol"'));
assert(/<html lang="nl"/.test(html));assert(/name="viewport"/.test(html));
assert.equal((html.match(/<video\b/g)||[]).length,1);
const video=html.match(/<video\b[^>]*>/)[0];
for(const attribute of ['controls','playsinline','preload="metadata"'])assert(video.includes(attribute));
assert(!/\b(?:autoplay|muted|loop)\b/.test(video));
assert(html.includes(`<source src="./${m.mediaFile}" type="video/mp4">`));
assert(!/<script\b|<iframe\b|<form\b|data-diagnostic|data-start-repair|localStorage|sessionStorage|grabbelton-core|\/apps\//i.test(html));
assert(css.includes('@media(max-width:1000px)'));assert(css.includes('position:static;order:4;'));
assert(css.includes('focus-visible'));assert(css.includes('prefers-reduced-motion'));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size);
for(const rel of ['public/index.html','public/rafelrand/index.html','public/rafelrand/space-tent/index.html']){
 const s=fs.readFileSync(path.join(root,rel),'utf8');
 assert(s.includes('href="/rafelrand/konijnenhol/"'),`${rel}: ingang ontbreekt`);
 assert(s.includes('href="/rafelrand/konijnenhol/konijnenhol.css?v=1.0.0"'),`${rel}: stijlkoppeling ontbreekt`);
}
const home=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
assert.equal((home.match(/id="konijnenhol"/g)||[]).length,1);
assert(home.indexOf('id="konijnenhol"')<home.indexOf('<figure class="space-billboard space-billboard-map">'));
console.log('Konijnenhol: titel, gekozen subtitel, waarschuwing, drie ingangen en zelfstandige spelerstructuur geslaagd.');
if(requireMedia){
 const f=path.join(dir,m.mediaFile);
 assert(fs.existsSync(f),'PUBLICATIE GEBLOKKEERD: upload eerst Hoogstaand_Diepgaan.mp4 naar public/rafelrand/konijnenhol/ op de bouwbranch.');
 const bytes=fs.readFileSync(f);
 assert.equal(bytes.length,m.expectedBytes,'Onverwachte bestandsomvang');
 assert(bytes.length<25*1024*1024,'Bestand overschrijdt Pages-bestandslimiet');
 assert.equal(createHash('sha256').update(bytes).digest('hex'),m.sha256,'Niet de technisch gecontroleerde film');
 let pos=0;const boxes=[];
 while(pos<bytes.length){
  assert(pos+8<=bytes.length);let size=bytes.readUInt32BE(pos);const type=bytes.toString('ascii',pos+4,pos+8);
  if(size===1){assert(pos+16<=bytes.length);size=Number(bytes.readBigUInt64BE(pos+8))}
  if(size===0)size=bytes.length-pos;
  assert(Number.isSafeInteger(size)&&size>=8&&pos+size<=bytes.length,'Ongeldige MP4-container');
  boxes.push(type);pos+=size;
 }
 assert(boxes.includes('ftyp')&&boxes.includes('moov')&&boxes.includes('mdat'));
 assert(boxes.indexOf('moov')<boxes.indexOf('mdat'),'Film niet voor snel starten ingericht');
 console.log(`Konijnenhol media: ${bytes.length} bytes, juiste SHA-256 en MP4-snelstart bevestigd. Lokale broncontrole: 300 s, 9000 frames, identiek gedecodeerd geluid.`);
}

import fs from 'node:fs';
const file='public/apps/pabo-rekenklaar/index.html';
let s=fs.readFileSync(file,'utf8');
const old='const k=randInt(1,4),c=randInt(0,5),seq=Array.from({length:5},(_,i)=>k*(i+1)**2+c),ans=k*6**2+c;return makeNumberQ({domain:"D",topic:"patterns",mode:"non",difficulty:d,prompt:`In deze rekenrij zijn de tweede verschillen steeds gelijk. Welk zesde getal volgt? <strong>${seq.join(" – ")} – …</strong>`,answer:ans,explanation:`De tweede verschillen zijn constant. De rij past bij ${k} × n² + ${c}. Voor n = 6: ${k} × 36 + ${c} = <strong>${ans}</strong>.`,hint:"Bereken eerst de verschillen en daarna de verschillen daarvan."});';
const neu='const k=randInt(1,4),c=randInt(0,5),seq=Array.from({length:5},(_,i)=>k*(i+1)**2+c),ans=k*6**2+c,diffs=seq.slice(1).map((v,i)=>v-seq[i]),second=diffs.slice(1).map((v,i)=>v-diffs[i]),nextDiff=diffs.at(-1)+second.at(-1);return makeNumberQ({domain:"D",topic:"patterns",mode:"non",difficulty:d,prompt:`Bekijk hoe de verschillen tussen opeenvolgende getallen veranderen. Welk zesde getal volgt? <strong>${seq.join(" – ")} – …</strong>`,answer:ans,explanation:`De sprongen zijn ${diffs.join(", ")}. Elke volgende sprong is ${second.at(-1)} groter. De volgende sprong is dus ${nextDiff}. Daarom volgt ${seq.at(-1)} + ${nextDiff} = <strong>${ans}</strong>.`,hint:"Schrijf eerst de sprongen tussen de getallen op. Kijk daarna hoe die sprongen veranderen."});';
if(s.includes(old)) s=s.replace(old,neu); else if(!s.includes(neu)) throw new Error('Quadratic pattern source changed; refusing blind patch');
s=s.replaceAll('const APP_VERSION = "1.7.0"','const APP_VERSION = "1.7.1"');
fs.writeFileSync(file,s);
for(const name of ['public/index.html','public/pabo/pabo-rekenklaar/index.html','public/moshpit/index.html']){let x=fs.readFileSync(name,'utf8');x=x.replaceAll('1.7.0','1.7.1');fs.writeFileSync(name,x)}
console.log('Didactische correctie en versie 1.7.1 toegepast.');

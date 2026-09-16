import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'public/apps/pabo-rekenklaar/index.html');
let html=fs.readFileSync(file,'utf8');
function once(before,after){const count=html.split(before).length-1;if(count!==1)throw new Error(`Expected one patch anchor, found ${count}: ${before.slice(0,100)}`);html=html.replace(before,after)}
const read=name=>fs.readFileSync(path.join(root,'src/pabo',name),'utf8').trimEnd();
const rubricBlock=`/* BEGIN PABO VARIATION RUBRICS */\n${read('variation-rubrics.js')}\n/* END PABO VARIATION RUBRICS */`;
const codeBlock=`/* BEGIN PABO VARIATION MODULE */\n${read('variation-generators.js')}\n\n${read('variation-selection.js')}\n/* END PABO VARIATION MODULE */`;
if(!html.includes('/* BEGIN PABO VARIATION MODULE */')){
  once('const RUBRIC_VARIANTS = Object.freeze({','const RUBRIC_VARIANTS = Object.freeze({\n'+rubricBlock);
  once('function almostEqual(a,b,tolerance=1e-9)',codeBlock+'\n\nfunction almostEqual(a,b,tolerance=1e-9)');
  once('completedLessons:[],badges:[],history:[],mistakes:[],diagnostics:', 'completedLessons:[],badges:[],history:[],mistakes:[],variation:{schemaVersion:1,recent:[]},diagnostics:');
  once('merged.diagnostics=normalizeDiagnosticsState(parsed.diagnostics);','merged.diagnostics=normalizeDiagnosticsState(parsed.diagnostics);\n    merged.variation=normalizeVariationHistory(parsed.variation);');
  once('issues.push(...validateQualityRule(q));','issues.push(...validateQualityRule(q));\n  issues.push(...validateVariationQuestion(q));');
  once('return [...shuffle(part1),...shuffle(part2)];','return distributeExamTopics([...shuffle(part1),...shuffle(part2)]);');
  once('return [...part1,...part2];','return distributeExamTopics([...part1,...part2]);');
  once(':generateQuestion(domain,mode,activeSession.ability,topic,{avoidFamilies:activeSession.recentFamilies||[]});',':sessionQuestionOrStop(activeSession,domain,mode,activeSession.ability,topic);');
  once('  activeSession.current=q;activeSession.recentFamilies=', '  if(!q)return;\n  if(activeSession.kind!=="sprint")rememberVariationQuestion(activeSession,q);\n  activeSession.current=q;activeSession.recentFamilies=');
  once('if(!entry.question)entry.question=generateQuestion(entry.domain,entry.mode,s.ability,null,{avoidFamilies:s.recentFamilies||[]});const q=entry.question;', 'if(!entry.question){entry.question=sessionQuestionOrStop(s,entry.domain,entry.mode,s.ability,entry.topic);if(!entry.question)return;rememberVariationQuestion(s,entry.question)}const q=entry.question;');
  once('window.PaboRekenklaarQA=Object.freeze({version:APP_VERSION,','window.PaboRekenklaarQA=Object.freeze({version:APP_VERSION,VARIATION_CONTRACT,VARIATION_GENERATORS,variationIdentity,variationFingerprint,normalizeVariationHistory,generateSessionQuestion,rememberVariationQuestion,distributeExamTopics,validateVariationQuestion,');
  once('const APP_VERSION = "1.6.3";','const APP_VERSION = "1.7.0";');
  once('<title>Pabo Rekenklaar 1.6.3','<title>Pabo Rekenklaar 1.7.0');
  once('<span id="homeVersion">1.6.3</span>','<span id="homeVersion">1.7.0</span>');
  once('const RELEASE_NOTES = [','const RELEASE_NOTES = [\n  {version:"1.7.0",date:"16 september 2026",title:"Meer variatie en inhoudelijke toetsdekking",items:[\n    "Volledige en korte toetsen spreiden de opgaven vooraf over de deelonderwerpen, met behoud van de domeinverdeling en rekenmachinebeperkingen.",\n    "Binnen een toets geen identieke opgaven; een vraagfamilie verschijnt maximaal drie keer over beide delen samen.",\n    "Zestien aanvullende generatoren vragen om andere denkhandelingen. Kleine vaste lijstjes bij gevorderde opgaven zijn vervangen door gecontroleerde getallenvariatie.",\n    "De vraagzwaarte blijft een eerlijke expertinschatting: bij inhoudelijke spreiding wordt een eenvoudiger vraag niet kunstmatig als moeilijk gelabeld.",\n    "Een begrensde lijst vraagvingerafdrukken blijft lokaal om herhaling tussen sessies te beperken. De bestaande voortgang, diagnostiek en rekenflirts blijven behouden.",\n    "Een aparte regressiecontrole doorloopt volledige adaptieve sessies en rapporteert spreiding, herhaling en voorraadtekorten. Dit is geen empirische toetsvalidatie."\n  ]},');
  once('blijven lokaal in deze browser.<br><small>','blijven lokaal in deze browser. Voor variatie onthoudt de browser ook maximaal 480 vraagvingerafdrukken, zonder extra letterlijke antwoorden. Binnen een toets krijgt iedere vraagfamilie maximaal drie plaatsen; tussen sessies krijgt nieuw materiaal voorrang waar de voorraad dat toelaat.<br><small>');
  // Broaden the formerly tiny fixed high-level pools; keep their validated rules.
  once('const n=pick([1998,2998,3998,4998]),factor=25,answer=n*factor,round=n+2;', 'const factor=pick([5,25,50,125]),offset=pick([1,2,4]),round=randInt(4,60)*100,n=round-offset,answer=n*factor;');
  once('const correct=`(${fmt(round)} − 2) × ${factor} = ${fmt(round*factor)} − ${2*factor} = ${fmt(answer)}`;', 'const correct=`(${fmt(round)} − ${offset}) × ${factor} = ${fmt(round*factor)} − ${offset*factor} = ${fmt(answer)}`;');
  once('`${fmt(round)} × ${factor} − 2 = ${fmt(round*factor-2)}`','`${fmt(round)} × ${factor} − ${offset} = ${fmt(round*factor-offset)}`');
  once('`${fmt(n)} × 100 : ${factor} = ${fmt(n*4)}`','`${fmt(n)} × 100 : ${factor} = ${fmt(n*100/factor,4)}`');
  once('`${fmt(n-2)} × ${factor} + 2 = ${fmt((n-2)*factor+2)}`','`${fmt(n-offset)} × ${factor} + ${offset} = ${fmt((n-offset)*factor+offset)}`');
  once('Vervang ${fmt(n)} door ${fmt(round)} − 2 en corrigeer het volledige verschil van 2 × ${factor}.','Vervang ${fmt(n)} door ${fmt(round)} − ${offset} en corrigeer het volledige verschil van ${offset} × ${factor}.');
  once(`const scenarios=[
      {price:240,aPct:25,bFlat:30,bPct:10},
      {price:320,aPct:20,bFlat:40,bPct:8},
      {price:180,aPct:30,bFlat:36,bPct:10}
    ],s=pick(scenarios),priceA=`, `const price=randInt(12,65)*10,aPct=pick([10,15,20,25,30]),bPct=pick([5,8,10,15,20]);let bFlat=randInt(1,10)*5;
    if(almostEqual(price*(1-aPct/100),(price-bFlat)*(1-bPct/100)))bFlat+=5;
    const s={price,aPct,bFlat,bPct},priceA=`);
  once('const scenarios=[{base:200,p1:20,p2:-25},{base:160,p1:-25,p2:20},{base:120,p1:25,p2:-20},{base:240,p1:-20,p2:25}],s=pick(scenarios),answer=', 'const s={base:randInt(6,80)*20,p1:pick([-30,-25,-20,-10,10,20,25,50]),p2:pick([-30,-25,-20,-10,10,20,25,50])},answer=');
  once('const cases=[{l:2,w:3,h:.5,answer:3},{l:3,w:.5,h:2,answer:3},{l:1.5,w:2,h:2,answer:6}],s=pick(cases),correct=', 'const l=pick([1.5,2,3,4]),w=pick([.5,1.5,2,3]),h=pick([.5,1.5,2]),s={l,w,h,answer:l*w*h},correct=');
  once('s={l,w,h,answer:l*w*h},correct=`${s.answer} keer`;','s={l,w,h,answer:l*w*h},correct=`${fmt(s.answer,3)} keer`;');
  once('= <strong>${fmt(s.answer,2)} keer</strong>.','= <strong>${fmt(s.answer,3)} keer</strong>.');
  once('distractors:[`${fmt(s.l+s.w+s.h,2)} keer`,`${fmt(s.l*s.w,2)} keer`,`${fmt((s.l*s.w*s.h)**2,2)} keer`]','distractors:[...new Set([s.l+s.w+s.h,s.l*s.w,s.answer**2,s.answer*2,s.answer/2].filter(v=>!almostEqual(v,s.answer)))].slice(0,3).map(v=>`${fmt(v,3)} keer`)');
  once(`const cases=[
      {roomL:4.8,roomW:3.6,tileCm:30,reserve:10,box:12},
      {roomL:5.4,roomW:4,tileCm:30,reserve:8,box:10},
      {roomL:6,roomW:3.75,tileCm:25,reserve:5,box:14}
    ],s=pick(cases),roomArea=`, 'const s={roomL:randInt(28,80)/10,roomW:randInt(24,65)/10,tileCm:pick([20,25,30,40,50]),reserve:pick([5,8,10,12]),box:pick([8,10,12,14,16])},roomArea=');
  once('Reken met <strong>${s.reserve}% snijverlies</strong>.','Bereken op basis van de oppervlakten en tel <strong>${s.reserve}% extra tegels als reserve voor snijverlies</strong> erbij.');
  once('const cases=[{drawL:3,drawW:2,scale:200},{drawL:4.5,drawW:2.5,scale:200},{drawL:2.4,drawW:1.8,scale:500}],s=pick(cases),realL=', 'const s={drawL:randInt(12,60)/10,drawW:randInt(10,45)/10,scale:pick([50,100,200,250,500])},realL=');
  once('const cases=[{a0:4,ar:2.5,b0:10,br:1.5},{a0:3,ar:3,b0:15,br:1},{a0:6,ar:2,b0:18,br:1}],s=pick(cases),cross=', 'const a0=randInt(2,15),br=pick([1,1.5,2,2.5]),ar=br+pick([.5,1,1.5,2]),crossing=randInt(3,18),s={a0,ar,b0:a0+(ar-br)*crossing,br},cross=');
  once('const cases=[{a0:80,a1:100,b0:200,b1:230},{a0:120,a1:138,b0:50,b1:60},{a0:40,a1:52,b0:150,b1:180}],s=pick(cases),aPct=', 'const a0=randInt(4,40)*10,b0=randInt(4,40)*10,pa=pick([5,10,15,20,25,30,40,50]),pb=pick([5,10,15,20,25,30,40,50].filter(p=>p!==pa)),s={a0,a1:roundTo(a0*(1+pa/100),2),b0,b1:roundTo(b0*(1+pb/100),2)},aPct=');
}else{
  html=html.replace(/\/\* BEGIN PABO VARIATION RUBRICS \*\/[\s\S]*?\/\* END PABO VARIATION RUBRICS \*\//,rubricBlock);
  html=html.replace(/\/\* BEGIN PABO VARIATION MODULE \*\/[\s\S]*?\/\* END PABO VARIATION MODULE \*\//,codeBlock);
}
fs.writeFileSync(file,html);
for(const relative of ['public/assets/js/site-data.js','scripts/check-pabo-nav-browser.mjs']){
  const file=path.join(root,relative);fs.writeFileSync(file,fs.readFileSync(file,'utf8').replaceAll('1.6.3','1.7.0'));
}
console.log('Pabo 1.7.0 variation source embedded; existing state key, diagnostics and media unchanged.');

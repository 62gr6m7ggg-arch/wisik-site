import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createVariationContext,runVariationExpression} from './lib/pabo-variation-context.mjs';
const html=fs.readFileSync('public/apps/pabo-rekenklaar/index.html','utf8');
const c=createVariationContext(html);
const report=runVariationExpression(c,`(()=>{
 Math.random=seededRandom(20102026);const errors=[],topics=[],examples=[];let checked=0,mutations=0;
 const ensure=(ok,msg)=>{if(!ok)throw new Error(msg)};
 for(const [lesson,[domain,topic]] of Object.entries(RICH_TOPICS)){
  const specs=RICH_FAMILIES.filter(s=>s.lesson===lesson);ensure(specs.length===10,'Missing designs '+lesson);
  const families=new Set(),legacy=new Set(),allKeys=new Set();
  for(const g of QUESTION_BANK[domain].filter(g=>g.topic===topic))for(const mode of g.modes)for(const level of g.levels)for(let sample=0;sample<35;sample++){
   const q=finalizeGeneratedQuestion(g.fn(level,mode),{domain,mode,requestedLevel:level,effectiveLevel:level,generator:g});
   families.add(q.family);allKeys.add(q.difficultyProfile.key);if(!g.design?.startsWith('rich.'))legacy.add(q.family);
  }
  topics.push({lesson,domain,topic,existingFamilies:legacy.size,totalFamilies:families.size,additionalFamilies:families.size-legacy.size,addedDesigns:specs.length,target:81,shortfall:Math.max(0,81-families.size),contexts:new Set(specs.map(s=>s.context)).size,representations:[...new Set(specs.map(s=>s.representation))]});
  for(const spec of specs){const g=REASONING_GENERATORS.find(g=>g.design===spec.id),level=g.levels[0];
   for(const mode of g.modes)for(let i=0;i<100;i++){
    const q=finalizeGeneratedQuestion(g.fn(level,mode),{domain,mode,requestedLevel:level,effectiveLevel:level,generator:g}),issues=validateGeneratedQuestion(q);
    ensure(!issues.length,spec.id+': '+issues.join('; '));ensure((q.diagnosticModels||[]).length===0,spec.id+' accidental diagnosis');
    // Textually different formulas must also be mathematically different.
    if(spec.id==='rich.D3.formula-match'){
     const pairs=q.options.map(option=>{const [a,b]=option.match(/[0-9]+/g).map(Number);return option.includes('(')?[0,a+b]:option.includes('× aantal kratten +')?[b,a]:option.includes('×')?[a,b]:[a+b,1]});
     ensure(new Set(pairs.map(p=>p.join(','))).size===4,spec.id+' equivalent distractor');
     ensure(pairs[q.answer][0]===q.reasoningData.values.base&&pairs[q.answer][1]===q.reasoningData.values.rate,spec.id+' wrong coefficients');
    }
    if(spec.id==='rich.D3.fixed-term')ensure(q.reasoningData.values.base!==q.reasoningData.values.rate,spec.id+' ambiguous repeated coefficient');
    ensure(checkResponse(q,q.type==='mc'?q.answer:q.allowFraction?q.answerDisplay:q.answer),spec.id+' answer rejected');checked++;
    const bad={...q,answer:q.type==='mc'?(q.answer+1)%4:q.answer+7};ensure(validateReasoningQuestion(bad).length>0,spec.id+' wrong answer accepted');mutations++;
    ensure(validateReasoningQuestion({...q,reasoningData:{...q.reasoningData,values:null}}).length>0||typeof spec.verify(null)==='string',spec.id+' invalid data accepted');
    if(spec.equivalentTo){const canonical=spec.equivalentTo,definition=RUBRIC_VARIANTS[canonical];ensure(definition,spec.id+' unknown family link');ensure(q.family===definition.family||canonical.startsWith('reasoning.rich.'),spec.id+' cosmetic family counted independently');}
    if(i===0&&mode===g.modes[0])examples.push({id:spec.id,lesson,title:spec.title,level,context:spec.context,representation:spec.representation,equivalentTo:spec.equivalentTo,family:q.family,prompt:q.prompt,visual:q.visual,answer:q.answerDisplay,explanation:q.explanation,data:q.reasoningData});
   }
  }
 }
 // Focused sessions on every subject, repeated in the same browser across reloads.
 const sessions=[];
 for(const [lesson,[domain,topic]] of Object.entries(RICH_TOPICS)){
  state=deepClone(DEFAULT_STATE);state.xp=1777;state.completedLessons=['A1','B2'];const seen=new Set();let repeatedNeighbours=0,last=null;
  const used=new Set(),contexts=new Set(),representations=new Set();
  for(let round=0;round<3;round++){
   const session={kind:'practice',total:12};
   for(let i=0;i<12;i++){
    const q=generateSessionQuestion(session,domain,'non',3,topic),record=reasoningExposureRecord(q),identity=variationIdentity(q);
    ensure(!seen.has(identity),lesson+' exact repeat across sessions');seen.add(identity);
    if(last===record.signature)repeatedNeighbours++;
    used.add(q.family);contexts.add(q.pedagogy.context);representations.add(q.pedagogy.representation);
    rememberVariationQuestion(session,q);last=record.signature;
   }
   const saved=JSON.stringify(state.reasoningExposure);saveState();state=loadState();ensure(state.xp===1777&&state.completedLessons.length===2,lesson+' progress migration');ensure(saved===JSON.stringify(state.reasoningExposure),lesson+' history lost');
  }
  ensure(repeatedNeighbours===0,lesson+' consecutive same approach');ensure(used.size>=6,lesson+' too few families in actual sessions');
  sessions.push({lesson,questions:36,families:used.size,contexts:contexts.size,representations:representations.size,consecutiveRepeats:repeatedNeighbours});
 }
 return {version:APP_VERSION,checked,mutations,topics,sessions,examples,targetReached:topics.every(t=>t.shortfall===0)};
})()`,480000);
fs.mkdirSync('/tmp/pabo-rich-evidence',{recursive:true});
fs.writeFileSync('/tmp/pabo-rich-evidence/report.json',JSON.stringify(report,null,2)+'\n');
const catalog={schemaVersion:1,version:report.version,scope:'Conservatieve telling per deelonderwerp. Getal- en contextvarianten tellen niet apart; families in verschillende deelonderwerpen zijn niet optelbaar als wereldwijd unieke rekenstructuren.',targetPerTopic:81,targetReached:report.targetReached,topics:report.topics,designs:report.examples.map(({visual,prompt,explanation,answer,data,...metadata})=>metadata)};
if(process.argv.includes('--write'))fs.writeFileSync('public/assets/data/pabo-variation-catalog.json',JSON.stringify(catalog,null,2)+'\n');
else assert.deepEqual(JSON.parse(fs.readFileSync('public/assets/data/pabo-variation-catalog.json','utf8')),catalog,'Catalogus komt niet overeen met de bron; voer de bewuste schrijfcontrole uit.');
console.log(JSON.stringify({version:report.version,checked:report.checked,mutations:report.mutations,topics:report.topics,sessions:report.sessions,targetReached:report.targetReached},null,2));

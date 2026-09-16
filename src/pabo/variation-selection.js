/* Variatiecontract: inhoudelijke spreiding vóór lokale vraagzwaarte; nooit een
   duplicaat als stille terugval. Alleen begrensde vingerafdrukken blijven lokaal. */
const VARIATION_CONTRACT=Object.freeze({schemaVersion:1,historyLimit:480,examFamilyLimit:3,candidateSamples:8});
const VARIATION_GENERATORS={
  A:[
    {topic:"operations",modes:["non"],levels:[5],fn:genAVariationPacking},
    {topic:"negative-divisibility",modes:["head","non"],levels:[4],fn:genAVariationRemainders},
    {topic:"place-value",modes:["head","non"],levels:[3],fn:genAVariationRounding}
  ],
  B:[
    {topic:"fraction-operations",modes:["head","non"],levels:[2,3,4],fn:genBVariationRemaining},
    {topic:"fraction-concept",modes:["head","non"],levels:[3],fn:genBVariationWholes},
    {topic:"ratio-scale-probability",modes:["head","non"],levels:[4],fn:genBVariationMixture},
    {topic:"percent",modes:["head","non"],levels:[4],fn:genBVariationReverseChain}
  ],
  C:[
    {topic:"area-perimeter",modes:["non"],levels:[4],fn:genCVariationFence},
    {topic:"volume-surface",modes:["non"],levels:[4],fn:genCVariationTank},
    {topic:"speed-time",modes:["non"],levels:[4],fn:genCVariationJourney},
    {topic:"geometry-scale",modes:["non"],levels:[5],fn:genCVariationScaleFence},
    {topic:"units",modes:["head","non"],levels:[3],fn:genCVariationFlowUnits}
  ],
  D:[
    {topic:"statistics",modes:["non"],levels:[4],fn:genDVariationWeighted},
    {topic:"charts",modes:["non"],levels:[4],fn:genDVariationGraphRate},
    {topic:"patterns",modes:["non"],levels:[3],fn:genDVariationPatternInverse},
    {topic:"formulas",modes:["non"],levels:[4],fn:genDVariationFormulaBudget}
  ]
};
for(const [domain,generators] of Object.entries(VARIATION_GENERATORS))QUESTION_BANK[domain].push(...generators);

function normalizeVariationHistory(value){
  // This function is also called while loading state, before the const above exists.
  const list=value?.schemaVersion===1&&Array.isArray(value.recent)?value.recent:[];
  return {schemaVersion:1,recent:[...new Set(list.filter(s=>typeof s==="string"&&/^[0-9a-f]{16}$/.test(s)))].slice(-480)};
}
function variationText(value){
  return String(value??"").replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/\s+/g," ").trim();
}
function variationIdentity(q){
  // Ignore question ids and option order. Include the actual data, not SVG ids.
  const visual=q.visualMeta?{kind:q.visualMeta.kind,labels:q.visualMeta.labels,values:q.visualMeta.values,yMin:q.visualMeta.yMin,yMax:q.visualMeta.yMax}:String(q.visual||" ").replace(/\bid=(?:"[^"]*"|'[^']*')/g,"").replace(/\s+/g," ").trim();
  const items=q.type==="order"?[...(q.items||[])].map(variationText).sort():null;
  return JSON.stringify([variationText(q.prompt),visual,items,variationText(q.unit)]);
}
function variationFingerprint(identity){
  let h1=2166136261,h2=2246822507;
  for(let i=0;i<identity.length;i++){const c=identity.charCodeAt(i);h1=Math.imul(h1^c,16777619);h2=Math.imul(h2^c,3266489909)}
  return (h1>>>0).toString(16).padStart(8,"0")+(h2>>>0).toString(16).padStart(8,"0");
}
function freshVariationLedger(){return {seen:new Set(),families:{},topics:{},domains:{},representations:{},recentFamilies:[],offered:0}}
function sessionVariation(session){if(!session.variationLedger)session.variationLedger=freshVariationLedger();return session.variationLedger}
function variationRepresentation(q){return q.visualMeta?.kind||(q.visual?.includes("<table")?"table":q.visual?"figure":q.type)}
function rememberVariationQuestion(session,q,{persist=true}={}){
  const ledger=sessionVariation(session),identity=variationIdentity(q);
  if(ledger.seen.has(identity))return;
  ledger.seen.add(identity);ledger.offered++;
  ledger.families[q.family]=(ledger.families[q.family]||0)+1;
  const topicKey=`${q.domain}:${q.topic}`;ledger.topics[topicKey]=(ledger.topics[topicKey]||0)+1;
  ledger.domains[q.domain]=(ledger.domains[q.domain]||0)+1;
  const representation=variationRepresentation(q);ledger.representations[representation]=(ledger.representations[representation]||0)+1;
  ledger.recentFamilies=[...ledger.recentFamilies,q.family].slice(-3);
  if(persist){
    state.variation=normalizeVariationHistory(state.variation);
    const fingerprint=variationFingerprint(identity);
    state.variation.recent=state.variation.recent.filter(s=>s!==fingerprint).concat(fingerprint).slice(-VARIATION_CONTRACT.historyLimit);
    saveState();
  }
}
function distributeExamTopics(plan){
  const counts={};
  // Scored entries first: pilot questions never substitute for scored coverage.
  for(const entry of [...plan.filter(e=>!e.isPilot),...plan.filter(e=>e.isPilot)]){
    const topics=[...new Set(QUESTION_BANK[entry.domain].filter(g=>g.modes.includes(entry.mode)).map(g=>g.topic))];
    const ordered=shuffle(topics).sort((a,b)=>(counts[`${entry.domain}:${a}`]||0)-(counts[`${entry.domain}:${b}`]||0));
    entry.topic=ordered[0];const key=`${entry.domain}:${entry.topic}`;counts[key]=(counts[key]||0)+1;
  }
  return plan;
}
function generateSessionQuestion(session,domain,mode="mix",difficulty=3,topicHint=null){
  const ledger=sessionVariation(session),history=new Set(normalizeVariationHistory(state.variation).recent);
  if(domain==="mix")domain=shuffle(Object.keys(DOMAIN_META)).sort((a,b)=>(ledger.domains[a]||0)-(ledger.domains[b]||0))[0];
  const actualMode=domain==="D"?"non":mode==="mix"?(Math.random()<.36?"head":"non"):mode;
  const requested=clamp(Math.round(difficulty),1,5),all=QUESTION_BANK[domain].filter(g=>g.modes.includes(actualMode));
  const topics=topicHint?[topicHint]:shuffle([...new Set(all.map(g=>g.topic))]).sort((a,b)=>(ledger.topics[`${domain}:${a}`]||0)-(ledger.topics[`${domain}:${b}`]||0));
  const cap=session.kind==="exam"?VARIATION_CONTRACT.examFamilyLimit:topicHint?Infinity:Math.max(3,Math.ceil((session.total||10)/4));
  let best=null;
  for(const topic of topics){
    const candidates=all.filter(g=>g.topic===topic),pool=[];
    for(const generator of shuffle(candidates)){
      for(const level of [...generator.levels].sort((a,b)=>Math.abs(a-requested)-Math.abs(b-requested))){
        for(let sample=0;sample<VARIATION_CONTRACT.candidateSamples;sample++){
          const q=finalizeGeneratedQuestion(generator.fn(level,actualMode),{domain,mode:actualMode,requestedLevel:requested,effectiveLevel:level,generator});
          if(q.topic!==topic||validateGeneratedQuestion(q).length)continue;
          const identity=variationIdentity(q),familyCount=ledger.families[q.family]||0;
          if(ledger.seen.has(identity)||familyCount>=cap)continue;
          const recentlySeen=history.has(variationFingerprint(identity)),representation=variationRepresentation(q);
          const score=(recentlySeen?1000:0)+3*Math.abs(q.difficulty-requested)+1.6*familyCount+(ledger.recentFamilies.includes(q.family)?2:0)+.04*(ledger.representations[representation]||0);
          pool.push({q,identity,score,recentlySeen});
        }
      }
    }
    if(pool.length){
      pool.sort((a,b)=>a.score-b.score);best=pool[0];
      // Topic balance is hard in exams (topicHint), and prioritized in broad practice.
      break;
    }
  }
  if(!best){const error=new Error(`VARIATIE_VOORRAAD_ONVOLDOENDE: ${domain}/${actualMode}/${topicHint||"gemengd"}, vraagzwaarte ${requested}`);error.code="VARIATION_POOL_EXHAUSTED";throw error}
  const q=best.q;q.levelAdjusted=q.difficulty!==requested;q.rubricTarget=q.difficulty;
  q.selectionInfo={contract:1,requestedLevel:requested,selectedLevel:q.difficulty,topic:q.topic,familyLimit:Number.isFinite(cap)?cap:null,recentHistoryRelaxed:best.recentlySeen};
  return q;
}
function sessionQuestionOrStop(session,domain,mode,difficulty,topicHint){
  try{return generateSessionQuestion(session,domain,mode,difficulty,topicHint)}
  catch(error){
    if(error.code!=="VARIATION_POOL_EXHAUSTED")throw error;
    console.error(error.message);stopTimers();session.current=null;session.answered=true;session.variationIssue=error.message;
    const containerId=session.kind==="exam"?"examPlayArea":session.containerId||"playArea";
    document.getElementById(containerId).innerHTML=`<div class="card" role="alert"><h3>Nog niet genoeg verschillende vragen</h3><p>Voor deze selectie is de voorraad verschillende opgaven uitgeput. Je krijgt daarom niet stilzwijgend dezelfde vraag opnieuw. Je eerdere antwoorden en voortgang blijven behouden.</p><p>Kies een ander onderdeel of begin een nieuwe reeks.</p><button class="btn primary" data-action="quitSession">Terug naar de keuze</button></div>`;
    return null;
  }
}
function validateVariationQuestion(q){
  const v=q.variationData;if(!v)return [];
  let expected;
  switch(v.key){
    case "A.variation.packing":{
      const costs=[];for(let big=0;big<=v.limit;big++)for(let small=0;small<=Math.ceil(v.needed/v.small);small++)if(big*v.large+small*v.small>=v.needed)costs.push(big*v.largeCost+small*v.smallCost);
      expected=Math.min(...costs);break;
    }
    case "A.variation.remainders":{
      const matches=[];for(let n=v.lower;n<v.upper;n++)if(n%v.a===v.ra&&n%v.b===v.rb)matches.push(n);
      if(matches.length!==1)return ["restvoorwaarden leveren niet precies één getal op"];expected=matches[0];break;
    }
    case "A.variation.rounding":expected=v.rounded+(v.upper?v.step/2-1:-v.step/2);break;
    case "B.variation.remaining-direct":expected=v.total-v.total/v.a;break;
    case "B.variation.remaining-forward":expected=(v.total-v.total/v.a)*(1-1/v.b);break;
    case "B.variation.remaining-inverse":expected=v.left/((1-1/v.a)*(1-1/v.b));break;
    case "B.variation.wholes":expected=Math.abs(v.sizeA*v.na/v.da-v.sizeB*v.nb/v.db);break;
    case "B.variation.mixture":expected=(v.initial/(1+v.before))*(v.after-v.before);break;
    case "B.variation.reverse-chain":expected=v.final/((100+v.p1)*(100-v.p2)/10000);break;
    case "C.variation.fence":expected=(v.l-v.cutL)+v.cutW+v.cutL+(v.w-v.cutW)+v.l+v.w-v.gate;break;
    case "C.variation.tank":expected=Math.floor((2*v.l*v.w*v.rise*10+1000*v.rate)/(2000*v.rate))/10;break;
    case "C.variation.journey":expected=Math.round(10*(v.speed1*v.t1+v.speed2*v.t2)/(v.t1+v.t2+v.pause))/10;break;
    case "C.variation.scale-fence":{const length=v.scale*v.drawL/100;expected=(2*length+2*v.area/length-v.gate)*v.price;break}
    case "C.variation.flow-units":expected=v.flow/1000*v.minutes*60;break;
    case "D.variation.weighted":expected=v.countA*(v.ma-v.combined)/(v.combined-v.mb);break;
    case "D.variation.graph-rate":expected=(v.target-v.start)/v.step;break;
    case "D.variation.pattern-inverse":expected=Math.sqrt((v.target-v.c)/v.k);break;
    case "D.variation.formula-budget":expected=Math.floor((v.budget-v.base)/v.rate);break;
    default:return ["onbekende aanvullende variatieregel"];
  }
  return Number.isFinite(expected)&&almostEqual(q.answer,expected,1e-8)?[]:[`variatieantwoord onjuist: ${v.key}`];
}

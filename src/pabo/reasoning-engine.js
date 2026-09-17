/* Inhoudelijke vraagregistratie en controle, los van verhaaltekst en nummergenerator. */
const REASONING_GENERATORS=REASONING_DESIGNS.map(spec=>{
  const level=rubricLevelFromDemand(RUBRIC_DEMAND[spec.demand]).level;
  const fn=function(d,mode){
    const q=spec.build();q.domain=spec.domain;q.topic=spec.topic;q.mode=mode;
    q.reasoningData.design=spec.id;
    q.pedagogy={design:spec.id,structure:spec.structure,action:spec.action,context:spec.context,representation:spec.representation};
    return tagRubric(q,`reasoning.${spec.id}`);
  };
  Object.defineProperty(fn,"name",{value:`genReasoning_${spec.id.replace(/[^a-zA-Z0-9]/g,"_")}`});
  const generator={topic:spec.topic,modes:spec.modes||["non"],levels:[level],fn,design:spec.id};
  QUESTION_BANK[spec.domain].push(generator);return generator;
});
function reasoningExpected(v){
  switch(v.rule){
    case "digit-swap":{const possibilities=[];for(let h=1;h<=9;h++)if((100*h+10*v.tens+v.units)-(100*v.units+10*v.tens+h)===v.gap)possibilities.push(h);if(possibilities.length!==1)throw new Error("geen uniek honderdtallencijfer");return possibilities[0]}
    case "rounded-total":{const possibilities=[];for(let a=v.a-10;a<=v.a+10;a++)for(let b=v.b-10;b<=v.b+10;b++)if(Math.round(a/10)*10===v.a&&Math.round(b/10)*10===v.b)possibilities.push(a+b);return `Van ${Math.min(...possibilities)} tot en met ${Math.max(...possibilities)}.`}
    case "balance":return v.extra/(v.left-v.right);
    case "missing-digit":{const xs=Array.from({length:10},(_,i)=>i).filter(i=>i%2===0&&(v.hundreds+v.tens+i)%9===0);if(xs.length!==1)throw new Error("geen uniek laatste cijfer");return xs[0]}
    case "brackets-story":return `${v.packs} × ${v.each} − ${v.damaged}`;
    case "cycles":{for(let t=v.after+1;t<=v.after+v.a*v.b;t++)if(t%v.a===0&&t%v.b===0)return t;throw new Error("geen gezamenlijk moment")}
    case "nearest":{const sorted=v.pairs.map(([n,d])=>({n,d,gap:Math.abs(n/d-v.n/v.den)})).sort((a,b)=>a.gap-b.gap);if(almostEqual(sorted[0].gap,sorted[1].gap))throw new Error("dichtstbij niet uniek");return reasoningFraction(sorted[0].n,sorted[0].d)}
    case "between":return reasoningFraction(v.n+1,v.den);
    case "same-numerator":return `${v.n}/${Math.min(v.a,v.b)} is groter: evenveel stukken, maar ieder stuk is groter.`;
    case "line-origin":return v.left/v.den+v.index*(v.right-v.left)/(v.steps*v.den);
    case "counterexample":{if(!(v.big>v.a&&v.big/v.bigDen<v.a/v.smallDen))throw new Error("ongeldig tegenvoorbeeld");return `${v.big}/${v.bigDen} < ${v.a}/${v.smallDen}`}
    case "numerator-bound":{let answer=-1;for(let n=0;n<=v.den;n++)if(n/v.den>1/3&&n/v.den<2/3)answer=n;return answer}
    case "reference-whole":return `De tweede groep gebruikt 1/3 van ${v.total*3/4} lege plaatsen.`;
    case "overlap":return v.total*(1/2+1/3-1/6);
    case "restore":return (v.end-v.gift)/(1-1/v.den);
    case "share-of-rest":return (1-1/v.a)/v.b;
    case "operation-order":{const a=v.total-v.total/v.den-v.fixed,b=v.total-v.fixed-(v.total-v.fixed)/v.den;return `Plan ${a>b?"A":"B"} laat € ${Math.abs(a-b)} meer over.`}
    case "add-no-votes":return 2*(3*v.total/5)-v.total;
    case "same-area":return 2*(v.a+v.b)-2*(v.c+v.d);
    case "border":return 2*v.border*(v.l+v.w)-4*v.border*v.border;
    case "paint":{const walls=2*(v.l+v.w)*v.h-v.opening;for(let tins=1;tins<10000;tins++)if(tins*v.tin*v.coverage>=2*walls)return tins;throw new Error("onhaalbaar verfplan")}
    case "missing-height":return (v.area+v.cutL*v.cutH)/v.l;
    case "shared-edge":return 2*(v.l+v.r+v.h);
    case "enclosure":{const areas=[];for(let w=1;w<=v.limit;w++){const l=v.fence+v.gate-2*w;if(l>0)areas.push(w*l)}return Math.max(...areas)}
    case "interval-rate":return (v.a-v.start)/15>(v.b-v.a)/5?"Van 19.00 tot 19.15 uur.":"Van 19.15 tot 19.20 uur.";
    case "net-flow":return v.ins.reduce((a,b,i)=>a+b-v.outs[i],v.start);
    case "graph-story":return "Eerst verder weg, dan dezelfde afstand, daarna terug naar het vertrekpunt.";
    case "extrapolation":return "Nee. De eerdere toename garandeert niet hoeveel fietsen er vrijdag staan.";
    case "missing-bar":return v.total-v.values.reduce((a,b,i)=>a+(i===v.index?0:b),0);
    case "stock-plan":{
      // Independent reachability: test opening stocks, not the generator's three bounds.
      for(let initial=0;initial<=v.cap;initial++){
        let maximum=initial,feasible=true;
        for(let i=0;i<4;i++){
          if(maximum<v.demands[i]){feasible=false;break}
          maximum-=v.demands[i];
          if(i===0||i===2)maximum=Math.min(v.cap,maximum+v.limits[i===0?0:1]);
        }
        if(feasible&&maximum>=v.reserve)return initial;
      }
      throw new Error("geen haalbaar voorraadplan");
    }
    case "fixed-fee":{const [[n1,c1],[n2,c2]]=v.rows;return (c1*n2-c2*n1)/(n2-n1)}
    case "coefficient":return `Elke extra afdruk verhoogt de prijs met € ${v.rate}.`;
    case "table-repair":{const bad=v.rows.filter(([n,c])=>c!==v.base+v.rate*n);if(bad.length!==1)throw new Error("geen unieke foute tabelrij");return `De rij bij ${bad[0][0]} maanden.`}
    case "strict-threshold":return Math.floor((v.limit-v.base)/v.rate)+1;
    case "difference-only":return v.rate*(7+v.extra)+v.base-(v.rate*7+v.base);
    case "robust-choice":{const differences=[v.low,v.high].map(n=>v.base+v.aRate*n-(v.bBase+v.bRate*n)),lossA=Math.max(0,...differences),lossB=Math.max(0,...differences.map(x=>-x));if(lossA===lossB)throw new Error("gelijk maximaal nadeel");return `Drukker ${lossA<lossB?"A":"B"}; het grootste prijsnadeel is daar kleiner.`}
    default:throw new Error("onbekend denkontwerp");
  }
}
function validateReasoningQuestion(q){
  if(!q.reasoningData)return q.rubricKey?.startsWith("reasoning.")?["rekendata van denkontwerp ontbreken"]:[];
  const issues=[],v=q.reasoningData,spec=REASONING_DESIGNS.find(s=>s.id===v.design);
  if(!spec||q.rubricKey!==`reasoning.${v.design}`)issues.push("denkontwerp en rubric horen niet bij elkaar");
  try{
    const expected=reasoningExpected(v),actual=q.type==="mc"?q.options[q.answer]:q.answer;
    if(typeof expected==="number"?!Number.isFinite(expected)||!almostEqual(actual,expected,1e-8):actual!==expected)issues.push(`onjuist antwoord denkontwerp: ${v.design}`);
    if(spec&&(q.domain!==spec.domain||q.topic!==spec.topic))issues.push("denkontwerp buiten eigen leerdoel");
    for(const key of ["structure","action","context","representation"])if(!q.pedagogy?.[key])issues.push(`ontbrekend variatiekenmerk: ${key}`);
    if(q.type==="number"&&q.allowFraction&&!checkResponse(q,q.answerDisplay))issues.push("zichtbare breuk wordt niet geaccepteerd");
  }catch(error){issues.push(`ongeldige data denkontwerp: ${error.message}`)}
  return issues;
}
/* Hashes only, no question/answer text or additional identity. Older XP/history stays intact. */
function normalizeReasoningExposure(value){
  const rows=value?.schemaVersion===1&&Array.isArray(value.recent)?value.recent:[];
  return {schemaVersion:1,recent:rows.filter(row=>row&&["signature","family","context","representation","topic"].every(k=>typeof row[k]==="string"&&/^[0-9a-f]{16}$/.test(row[k]))).slice(-96).map(row=>({signature:row.signature,family:row.family,context:row.context,representation:row.representation,topic:row.topic}))};
}
function applyReasoningMetadata(q){
  if(q.pedagogy)return q;
  const k=q.rubricKey||q.difficultyProfile?.key||q.generator||q.topic;
  let structure=q.family||q.topic,action=k,context="getallen";
  // Explicit legacy mappings stop near-identical templates masquerading as new questions.
  if(k==="D.variation.graph-rate"||k==="C.variation.tank"){structure="linear-flow";action="find-time";context="vullen"}
  else if(k==="C.variation.flow-units"){structure="linear-flow";action="find-quantity";context="vullen"}
  else if(k.includes("tiling")){structure="surface-packaging";action="find-packs";context="tegels"}
  else if(k.includes("tariff")){structure="affine-comparison";action="find-crossover";context="tarieven"}
  else if(k.startsWith("B.variation.remaining")){structure="successive-fractions";action=k.endsWith("inverse")?"reverse-chain":"find-remainder";context="magazijn"}
  else if(k.startsWith("B.compare")){structure="fraction-order";action="order"}
  else if(k.startsWith("D.formula")){structure="affine-model";action=k.endsWith("inverse")?"reverse-chain":"substitute";context="tarieven"}
  q.pedagogy={design:k,structure,action,context,representation:q.visualMeta?.kind||(q.visual?.includes("<table")?"table":q.visual?"diagram":q.type==="order"?"ordering":"text")};return q;
}
function reasoningExposureRecord(q){
  applyReasoningMetadata(q);const p=q.pedagogy,hash=variationFingerprint;
  return {signature:hash(`${p.structure}|${p.action}`),family:hash(q.family||p.design),context:hash(p.context),representation:hash(p.representation),topic:hash(`${q.domain}|${q.topic}`)};
}
function rememberReasoningExposure(session,q,persist){
  const record=reasoningExposureRecord(q);
  session.reasoningRecent=[...(session.reasoningRecent||[]),record].slice(-96);
  if(persist){state.reasoningExposure=normalizeReasoningExposure(state.reasoningExposure);state.reasoningExposure.recent.push(record);state.reasoningExposure.recent=state.reasoningExposure.recent.slice(-96)}
}
function reasoningSelectionCost(q,recent){
  const record=reasoningExposureRecord(q),window=recent.slice(-32),neutral=q.pedagogy.context==="getallen";
  const count=(key)=>window.reduce((sum,item,i)=>sum+(item[key]===record[key]?(i>=window.length-8?1:.35):0),0);
  return {record,cooling:recent.slice(-5).some(item=>item.signature===record.signature),cost:4*count("signature")+2.4*count("family")+(neutral?0:2*count("context"))+.45*count("representation")};
}

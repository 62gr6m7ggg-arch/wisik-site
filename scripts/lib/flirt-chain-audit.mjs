import vm from "node:vm";
import { createHash } from "node:crypto";

export function runFlirtChainAudit(context, catalog, fixtures) {
  context.__flirtAuditInput = { catalog, fixtures };
  try {
    const result = vm.runInContext(`(() => {
      const {catalog,fixtures}=__flirtAuditInput;
      const savedState=state,savedSession=activeSession,savedRandom=Math.random;
      const counts={patterns:0,answerExamples:0,negativeExamples:0,chains:0,modeExclusions:0,ambiguousSuppressed:0};
      const evidence=[];
      const ensure=(ok,message)=>{if(!ok)throw new Error(message)};
      const response=(q,value)=>{if(q.type!=="mc")return value;const index=q.options.indexOf(value);ensure(index>=0,"Vast antwoord ontbreekt: "+value);return index};
      const reset=()=>{state=deepClone(DEFAULT_STATE);state.diagnostics=freshDiagnostics();activeSession={kind:"practice",answered:true,finished:false}};
      const invite=r=>diagnosticFeedbackMarkup(r,{}).includes('data-diagnostic-flirt=');
      try{
        Math.random=seededRandom(fixtures.seed);
        const codes=Object.keys(MISCONCEPTION_CATALOG).sort();
        ensure(JSON.stringify(fixtures.cases.map(x=>x.code).sort())===JSON.stringify(codes),"Vaste voorbeelden dekken niet exact alle patronen");
        for(const item of fixtures.cases){
          const code=item.code;counts.patterns++;reset();
          const questions=[0,1].map(v=>generateDiagnosticProbe(code,v,"mix"));
          evidence.push(questions.map(q=>({prompt:q.prompt,options:q.options,answer:q.answer})));
          for(let v=0;v<2;v++){
            const q=questions[v],correct=response(q,item.correct[v]),wrong=response(q,item.wrong[v]),other=response(q,item.other[v]);
            ensure(checkResponse(q,correct),code+": onafhankelijk uitgerekend antwoord afgekeurd");
            ensure(!checkResponse(q,wrong)&&!checkResponse(q,other),code+": foutvoorbeeld is geen fout");
            const match=classifyIncorrectResponse(q,wrong);
            ensure(match.kind==="pattern"&&match.code===code,code+": vaste denkfout verkeerd geclassificeerd");
            reset();ensure(!invite(recordDiagnosticOutcome(q,correct,true)),code+": correct antwoord toont flirt");
            reset();const unexpected=recordDiagnosticOutcome(q,other,false);
            ensure(unexpected.kind!=="pattern"&&!invite(unexpected),code+": andere fout geeft fout-positieve uitnodiging");
            counts.answerExamples+=2;counts.negativeExamples++;
          }
          reset();const [q0,q1]=questions,r0=response(q0,item.wrong[0]),r1=response(q1,item.wrong[1]);
          const first=recordDiagnosticOutcome(q0,r0,false);
          ensure(first.status==="suspected"&&!invite(first),code+": eerste aanwijzing activeert flirt");
          const repeated=recordDiagnosticOutcome(q0,r0,false);
          ensure(repeated.status==="suspected"&&!invite(repeated),code+": dezelfde vraag telt dubbel");
          const confirmed=recordDiagnosticOutcome(q1,r1,false);
          ensure(confirmed.status==="likely"&&invite(confirmed),code+": bevestigd patroon mist uitnodiging");
          ensure(diagnosticFeedbackMarkup(confirmed,q1).includes('data-diagnostic-flirt="'+code+'"'),code+": uitnodiging draagt andere code");
          const selected=matchingDiagnosticFlirt(catalog,code);
          ensure(selected?.id==="wisik-flirt-"+code.toLowerCase()&&selected.target.misconceptionCode===code,code+": verkeerde exacte film");
          const before=JSON.stringify(state);matchingDiagnosticFlirt(catalog,code);diagnosticFeedbackMarkup(confirmed,q1);
          ensure(JSON.stringify(state)===before,code+": selecteren wijzigt leerbewijs");counts.chains++;
          const other=recordDiagnosticOutcome(q1,response(q1,item.other[1]),false);
          ensure(!invite(other),code+": bestaand vermoeden maakt een andere fout alsnog een flirt-trigger");counts.negativeExamples++;
          for(const kind of ["exam","sprint"]){
            activeSession.kind=kind;
            ensure(!invite(confirmed),code+": uitnodiging tijdens "+kind);
            const beforeMode=JSON.stringify(state.diagnostics);
            ensure(recordDiagnosticOutcome(q0,r0,false,{sessionKind:kind}).kind==="not-recorded",code+": bewijs uit "+kind);
            ensure(JSON.stringify(state.diagnostics)===beforeMode,code+": diagnostiek gewijzigd tijdens "+kind);counts.modeExclusions++;
          }
          activeSession.kind="practice";activeSession.answered=false;ensure(!invite(confirmed),code+": uitnodiging vóór antwoorden");
          activeSession.answered=true;activeSession.finished=true;ensure(!invite(confirmed),code+": uitnodiging na beëindigen");
          activeSession.finished=false;
          for(const status of ["none","signal","suspected","recovered"])ensure(!diagnosticFlirtAllowed(code,status),code+": ongeldige status "+status);
        }
        reset();
        const ambiguous=tagRubric(makeNumberQ({domain:"D",topic:"statistics",mode:"non",difficulty:2,prompt:"Bereken het gemiddelde van 0, 2, 2.",answer:4/3,explanation:"4 gedeeld door 3."}),"D.average.direct");
        attachDiagnosticModels(ambiguous);
        const collision=recordDiagnosticOutcome(ambiguous,"2",false);
        ensure(collision.kind==="ambiguous"&&collision.codes.includes("D04")&&collision.codes.includes("D05")&&!invite(collision),"Dubbelzinnige denkroute mag geen flirt kiezen");
        ensure(Object.keys(state.diagnostics.patterns).length===0,"Dubbelzinnige fout legt toch patroon vast");counts.ambiguousSuppressed++;
        return {counts,evidence};
      }finally{state=savedState;activeSession=savedSession;Math.random=savedRandom}
    })()`, context, { timeout: 20_000 });
    return { seed: fixtures.seed, ...JSON.parse(JSON.stringify(result.counts)), fingerprint: createHash("sha256").update(JSON.stringify(result.evidence)).digest("hex") };
  } finally {
    delete context.__flirtAuditInput;
  }
}

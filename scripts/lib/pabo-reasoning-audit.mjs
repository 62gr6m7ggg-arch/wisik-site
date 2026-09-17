import {runVariationExpression} from './pabo-variation-context.mjs';
export function runPaboReasoningAudit(context){
  return runVariationExpression(context,`(()=>{
  const saved={state,random:Math.random},counts={designs:REASONING_DESIGNS.length,generated:0,mutations:0,journeys:0,questions:0,semanticRepeats:0,relaxed:0,persistenceChecks:0},failures=[],examples=[],journeys=[];
  const ensure=(ok,message)=>{if(!ok)throw new Error(message)};
  function question(g,mode){const domain=REASONING_DESIGNS.find(s=>s.id===g.design).domain,level=g.levels[0];return finalizeGeneratedQuestion(g.fn(level,mode),{domain,mode,requestedLevel:level,effectiveLevel:level,generator:g})}
  try{
    Math.random=seededRandom(17092026);ensure(REASONING_DESIGNS.length===36,'Not 36 designs');ensure(new Set(REASONING_DESIGNS.map(s=>s.structure+'|'+s.action)).size===36,'Cosmetic duplicates in designs');
    for(const g of REASONING_GENERATORS){
      for(const mode of g.modes)for(let i=0;i<120;i++){
        const q=question(g,mode),issues=validateGeneratedQuestion(q);ensure(!issues.length,g.design+': '+issues.join('; '));counts.generated++;
        ensure(q.difficulty===g.levels[0],g.design+': rubric not exact');ensure(mode!=='head'||!q.calculatorAllowed,'Calculator in mental arithmetic');
        const bad={...q,answer:q.type==='mc'?(q.answer+1)%4:q.answer+17};ensure(validateReasoningQuestion(bad).length>0,g.design+': answer mutation escaped');counts.mutations++;
        ensure(validateReasoningQuestion({...q,reasoningData:null}).length>0,'Missing structured data accepted');counts.mutations++;
        ensure((q.diagnosticModels||[]).length===0,'Unreviewed diagnosis attached to new design');
        if(i===0&&mode===g.modes[0])examples.push({id:g.design,title:REASONING_DESIGNS.find(s=>s.id===g.design).title,level:q.difficulty,prompt:q.prompt,visual:q.visual,answer:q.answerDisplay,explanation:q.explanation,pedagogy:q.pedagogy,data:q.reasoningData});
      }
    }
    // One real learner, multiple consecutive sessions, including browser reloads.
    for(const [domain,topic] of [['A','place-value'],['B','fraction-concept'],['B','fraction-operations'],['C','area-perimeter'],['D','charts'],['D','formulas']])for(const requested of [2,3,4,5]){
      state=deepClone(DEFAULT_STATE);state.xp=906;state.completedLessons=['A1','B2'];const trail=[];let last=null,localRepeats=0,relaxed=0;
      for(let round=0;round<5;round++){
        const session={kind:'practice',total:10};
        for(let i=0;i<10;i++){
          const q=generateSessionQuestion(session,domain,'non',requested,topic),record=reasoningExposureRecord(q);
          ensure(!validateGeneratedQuestion(q).length,'Invalid journey question');ensure(q.topic===topic,'Learning goal changed');
          if(last===record.signature){localRepeats++;counts.semanticRepeats++;ensure(q.selectionInfo.semanticCooldownRelaxed,'Unexplained adjacent semantic repeat')}
          if(q.selectionInfo.semanticCooldownRelaxed){relaxed++;counts.relaxed++}
          ensure(Math.abs(q.difficulty-requested)<=Math.min(2,Math.max(1,q.selectionInfo.nearestAvailableLevelDistance+1)),'Diversity forced needless difficulty jump');
          trail.push({design:q.pedagogy.design,structure:q.pedagogy.structure,action:q.pedagogy.action,level:q.difficulty,relaxed:q.selectionInfo.semanticCooldownRelaxed});
          rememberVariationQuestion(session,q);last=record.signature;counts.questions++;
        }
        const before=JSON.stringify(state.reasoningExposure);saveState();state=loadState();ensure(JSON.stringify(state.reasoningExposure)===before,'Semantic history lost on reload');ensure(state.xp===906&&state.completedLessons.length===2,'Progress lost');counts.persistenceChecks++;
      }
      ensure(new Set(trail.map(q=>q.design)).size>=3,'Journey has too few different designs');
      journeys.push({domain,topic,requested,distinctDesigns:new Set(trail.map(q=>q.design)).size,adjacentRepeats:localRepeats,relaxed,trail});counts.journeys++;
    }
    // Migration and privacy sanitization are separate from the existing 480-item contract.
    const row={signature:'1234567890123456',family:'1234567890123456',context:'1234567890123456',representation:'1234567890123456',topic:'1234567890123456',answer:'private'};
    const clean=normalizeReasoningExposure({schemaVersion:1,recent:[...Array(130).fill(row),{signature:'literal text'}],answers:['private']});
    ensure(clean.recent.length===96,'Unbounded semantic history');ensure(!JSON.stringify(clean).includes('private'),'Literal response persisted');ensure(Object.keys(clean).length===2,'Unexpected persisted keys');counts.persistenceChecks++;
    const legacy=deepClone(DEFAULT_STATE);delete legacy.reasoningExposure;legacy.version='1.7.1';legacy.xp=906;localStorage.setItem(STORAGE_KEY,JSON.stringify(legacy));state=loadState();ensure(state.xp===906&&state.reasoningExposure.recent.length===0,'Legacy state damaged');counts.persistenceChecks++;
    state.reasoningExposure=clean;resetProgress();ensure(state.reasoningExposure.recent.length===0,'Reset left semantic history');counts.persistenceChecks++;
    // Broader history mapping must cover the actual legacy problem families.
    for(const [key,expected] of [['C.advanced.tiling','tegels'],['D.advanced.tariff','tarieven'],['D.variation.graph-rate','vullen'],['C.variation.tank','vullen'],['B.variation.remaining-inverse','magazijn']])ensure(applyReasoningMetadata({rubricKey:key}).pedagogy.context===expected,'Legacy semantic mapping missing: '+key);
  }catch(error){failures.push(error.stack||String(error))}finally{state=saved.state;Math.random=saved.random}
  return {version:APP_VERSION,passed:!failures.length,counts,failures,examples,journeys};
})()`,180000);
}

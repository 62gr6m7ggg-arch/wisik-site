import vm from 'node:vm';
import {createHash} from 'node:crypto';
function auditInApp(config){
  const saved={state,activeSession,random:Math.random,getResponse,questionCounter,debug:console.debug},failures=[],traces=[];
  const counts={adaptiveFullExams:0,fixedLevelFullExams:0,sequentialFullExams:0,miniExams:0,practiceSessions:0,questions:0,duplicates:0,coverageFailures:0,familyLimitFailures:0,generatorFallbacks:0,selectionFailures:0,negativeChecks:0,migrationChecks:0};
  const summaries=[];
  const ensure=(value,message)=>{if(!value)throw new Error(message)};
  const reset=()=>{state=deepClone(DEFAULT_STATE);state.profile.sound=false;state.profile.reduceMotion=true;state.profile.name='Variatiecontrole';activeSession=null};
  const wrong=q=>q.type==='mc'?(q.answer+1)%q.options.length:q.type==='order'?[...q.answer].reverse():q.type==='number'?String(Number(q.answer)+1377):'onjuist';
  const profiles=['all-correct','all-wrong','alternating','first-weak','last-weak','domain-uneven','seventy-percent'];
  function inspect(session,name,full=true){
    const result=session.results,expected=full?55:15;ensure(result.length===expected,name+': incomplete session');
    const identities=result.map(r=>variationIdentity(r.question)),unique=new Set(identities);counts.questions+=result.length;
    counts.duplicates+=result.length-unique.size;
    const families={},topics=new Set(),scored={A:0,B:0,C:0,D:0},partCounts={1:0,2:0};
    for(let i=0;i<result.length;i++){
      const q=result[i].question,entry=session.plan[i];
      if(q.generatedByFallback)counts.generatorFallbacks++;
      ensure(validateGeneratedQuestion(q).length===0,name+': invalid '+q.generator);
      ensure(q.topic===entry.topic,name+': topic contract breached');
      ensure(q.mode===entry.mode,name+': mode contract breached');
      ensure(q.selectionInfo?.selectedLevel===q.difficulty,name+': difficulty mislabeled');
      ensure(q.requestedDifficulty===q.selectionInfo.requestedLevel,name+': missing requested level');
      if(q.mode==='head')ensure(!q.calculatorAllowed,name+': calculator in head phase');
      families[q.family]=(families[q.family]||0)+1;
      if(!entry.isPilot){scored[q.domain]++;topics.add(q.domain+':'+q.topic)}partCounts[entry.part]++;
      traces.push(name+'|'+identities[i]+'|'+q.difficulty+'|'+q.family);
    }
    const maxFamily=Math.max(...Object.values(families));if(maxFamily>3)counts.familyLimitFailures++;
    if(full){
      ensure(JSON.stringify(scored)===JSON.stringify({A:15,B:14,C:12,D:9}),name+': scored domain allocation changed');
      ensure(partCounts[1]===17&&partCounts[2]===38,name+': part allocation changed');
      if(topics.size!==18)counts.coverageFailures++;
    }
    summaries.push({name,questions:result.length,unique:unique.size,families:Object.keys(families).length,scoredTopics:topics.size,maxFamily});
    ensure(unique.size===result.length,name+': duplicate questions');ensure(maxFamily<=3,name+': too many questions from one family');
    if(full)ensure(topics.size===18,name+': scored coverage missing');
  }
  function realExam(name,seed,full=true,keepState=false){
    if(!keepState)reset();Math.random=seededRandom(seed);const answerRng=seededRandom(seed^0x73acdb);
    const choose=(q,index)=>name==='all-wrong'?false:name==='alternating'?index%2===0:name==='first-weak'?index>=20:name==='last-weak'?index<25:name==='domain-uneven'?q.domain!=='B':name==='seventy-percent'?answerRng()<.7:true;
    let expectedCorrect=0;
    getResponse=q=>{const good=choose(q,activeSession.index);if(good)expectedCorrect++;return good?canonicalResponseFor(q):wrong(q)};
    const diagBefore=JSON.stringify(state.diagnostics);startExam(full);
    for(let index=0;index<(full?55:15);index++){
      ensure(!activeSession.variationIssue,activeSession.variationIssue);
      if(!activeSession.current)startPart2();
      ensure(activeSession.current,'No question in actual runtime at '+index);
      if(index===2){const before=sessionVariation(activeSession).offered,id=activeSession.current.id;renderExamQuestion();ensure(sessionVariation(activeSession).offered===before&&activeSession.current.id===id,'Rerender counted a new question');counts.negativeChecks++}
      submitExamAnswer();
    }
    ensure(activeSession.finished&&activeSession.correct===expectedCorrect,'Actual grading/session completion mismatch');
    ensure(JSON.stringify(state.diagnostics)===diagBefore,'Exam altered diagnosis evidence');
    inspect(activeSession,name+'-'+seed,full);return activeSession;
  }
  try{
    console.debug=()=>{};
    for(const profile of profiles)for(let index=0;index<config.seedsPerProfile;index++){
      try{if(config.progress)console.log('EXAM',profile,index,Date.now());realExam(profile,config.seed+index*97+profiles.indexOf(profile)*10007);counts.adaptiveFullExams++}catch(error){counts.selectionFailures++;failures.push(profile+': '+error.message)}
    }
    for(let level=1;level<=5;level++)for(let index=0;index<config.seedsPerProfile;index++){
      try{
        if(config.progress)console.log('FIXED',level,index,Date.now());reset();Math.random=seededRandom(config.seed+level*3001+index*103);
        const session={kind:'exam',total:55,plan:makeFullExamPlan(),results:[]};
        for(const entry of session.plan){const q=generateSessionQuestion(session,entry.domain,entry.mode,level,entry.topic);rememberVariationQuestion(session,q,{persist:false});session.results.push({question:q})}
        inspect(session,'fixed-'+level+'-'+index);counts.fixedLevelFullExams++;
      }catch(error){counts.selectionFailures++;failures.push('fixed-'+level+': '+error.message)}
    }
    for(let i=0;i<config.seedsPerProfile;i++){realExam('all-correct',config.seed+80001+i,false);counts.miniExams++}
    reset();const first=realExam('all-correct',config.seed+91001,true,true),seen=new Set(first.results.map(r=>variationIdentity(r.question)));
    const second=realExam('all-correct',config.seed+91002,true,true);ensure(second.results.every(r=>!seen.has(variationIdentity(r.question))),'Second complete exam reuses an earlier item');counts.sequentialFullExams+=2;
    // Actual ordinary practice, including all 18 lesson topics at low/middle/high requests.
    for(const [domain,lessons] of Object.entries(LESSONS))for(const lesson of lessons)for(const level of [1,3,5]){
      reset();Math.random=seededRandom(config.seed+counts.practiceSessions*37);getResponse=q=>canonicalResponseFor(q);
      startPractice({domain,mode:'non',topic:lesson.topic,difficulty:level,count:5});
      const ids=[];
      for(let i=0;i<5;i++){ensure(!activeSession.variationIssue,activeSession.variationIssue);ids.push(variationIdentity(activeSession.current));ensure(activeSession.current.topic===lesson.topic,'Lesson escaped requested topic');submitPracticeAnswer();nextPractice()}
      ensure(activeSession.finished,'Practice did not finish');ensure(new Set(ids).size===5,'Ordinary focused practice repeats a question');counts.questions+=5;counts.practiceSessions++;
    }
    for(const domain of ['mix','A','B','C','D']){
      reset();Math.random=seededRandom(config.seed+counts.practiceSessions*71);getResponse=q=>canonicalResponseFor(q);startPractice({domain,mode:'mix',count:20,difficulty:5});
      const ids=[];for(let i=0;i<20;i++){ensure(!activeSession.variationIssue,activeSession.variationIssue);ids.push(variationIdentity(activeSession.current));submitPracticeAnswer();nextPractice()}
      ensure(new Set(ids).size===20,'Broad practice repeats a question');counts.questions+=20;counts.practiceSessions++;
    }
    // Canonical duplicate detection is independent of shuffled choices and SVG ids.
    const q={prompt:'Kies <strong>de juiste</strong> uitkomst.',type:'mc',options:['1','2','3','4'],visual:'',unit:''};
    ensure(variationIdentity(q)===variationIdentity({...q,options:[...q.options].reverse()}),'Options falsely counted as novelty');counts.negativeChecks++;
    const visual={...q,visual:'<svg id="random-a"><circle cx="20" cy="30"/></svg>'};
    ensure(variationIdentity(visual)===variationIdentity({...visual,visual:visual.visual.replace('random-a','random-b')}),'SVG identifier counted as novelty');counts.negativeChecks++;
    ensure(variationIdentity(visual)!==variationIdentity({...visual,visual:visual.visual.replace('cx="20"','cx="40"')}),'Geometrical coordinates missing from signature');counts.negativeChecks++;
    const table={...q,visual:'<table><tr><td>12</td></tr></table>'};ensure(variationIdentity(table)!==variationIdentity({...table,visual:table.visual.replace('12','13')}),'Table data missing from identity');counts.negativeChecks++;
    // Exhaustion must fail closed, without a fixed fallback or weakened cap.
    const bank=QUESTION_BANK.A;
    try{
      QUESTION_BANK.A=[{topic:'operations',modes:['head'],levels:[2],fn:function genVariationExhaustionFixture(){return tagRubric(makeNumberQ({domain:'A',topic:'operations',mode:'head',difficulty:2,prompt:'Bereken 48 × 25.',answer:1200,explanation:'48 × 25 = 1200.'}),'A.operations.direct')}}];
      const session={kind:'exam',total:55};reset();let item=generateSessionQuestion(session,'A','head',2,'operations');rememberVariationQuestion(session,item,{persist:false});
      let blocked=false;try{generateSessionQuestion(session,'A','head',2,'operations')}catch(error){blocked=error.code==='VARIATION_POOL_EXHAUSTED'}ensure(blocked,'Duplicate exhaustion did not fail closed');counts.negativeChecks++;
      session.variationLedger.seen.clear();session.variationLedger.families[item.family]=3;blocked=false;try{generateSessionQuestion(session,'A','head',2,'operations')}catch(error){blocked=error.code==='VARIATION_POOL_EXHAUSTED'}ensure(blocked,'Family cap silently relaxed');counts.negativeChecks++;
    }finally{QUESTION_BANK.A=bank}
    // Every new generator has an independently checked rule; mutations must be rejected.
    for(const [domain,gens] of Object.entries(VARIATION_GENERATORS))for(const gen of gens)for(const level of gen.levels){
      const mode=gen.modes[0],q=finalizeGeneratedQuestion(gen.fn(level,mode),{domain,mode,requestedLevel:level,effectiveLevel:level,generator:gen});
      ensure(validateVariationQuestion(q).length===0,'New generator rule invalid');ensure(validateVariationQuestion({...q,answer:q.answer+137}).length>0,'Wrong answer escaped variation rule');counts.negativeChecks++;
    }
    // Preserve old learner data, and do not persist question text or literal responses.
    reset();const previous=deepClone(state);previous.version='1.6.3';previous.xp=321;previous.profile.name='Bestaande voortgang';previous.completedLessons=['A1','B2'];previous.totalAnswered=17;previous.mastery.A.attempts=12;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(previous));const migrated=loadState();
    ensure(migrated.xp===321&&migrated.totalAnswered===17&&migrated.profile.name===previous.profile.name,'Migration lost profile/XP');counts.migrationChecks++;
    ensure(JSON.stringify(migrated.mastery)===JSON.stringify(previous.mastery)&&JSON.stringify(migrated.completedLessons)===JSON.stringify(previous.completedLessons),'Migration lost mastery/lessons');counts.migrationChecks++;
    ensure(JSON.stringify(migrated.diagnostics)===JSON.stringify(previous.diagnostics),'Migration changed diagnostics');counts.migrationChecks++;
    const recent=Array.from({length:600},(_,i)=>i.toString(16).padStart(16,'0')),clean=normalizeVariationHistory({schemaVersion:1,recent:[...recent,'literal answer'],responses:['private']});
    ensure(clean.recent.length===480&&Object.keys(clean).sort().join(',')==='recent,schemaVersion'&&clean.recent.every(s=>/^[0-9a-f]{16}$/.test(s)),'History not bounded or not response-free');counts.migrationChecks++;
    state=migrated;state.variation=clean;saveState();resetProgress();ensure(state.xp===0&&(!state.variation||!state.variation.recent.length),'Reset retained exposure history');counts.migrationChecks++;
  }catch(error){failures.push(error.stack||error.message)}
  finally{state=saved.state;activeSession=saved.activeSession;Math.random=saved.random;getResponse=saved.getResponse;questionCounter=saved.questionCounter;console.debug=saved.debug;stopTimers()}
  return {passed:failures.length===0,configuration:config,counts,summaries,failures,traces};
}
export function runPaboVariationAudit(context,{seed=16092026,seedsPerProfile=8,progress=false}={}){
  const result=JSON.parse(JSON.stringify(vm.runInContext(`(${auditInApp.toString()})(${JSON.stringify({seed,seedsPerProfile,progress})})`,context,{timeout:180000})));
  const {traces,...report}=result;return {...report,traceFingerprint:createHash('sha256').update(JSON.stringify(traces)).digest('hex')};
}

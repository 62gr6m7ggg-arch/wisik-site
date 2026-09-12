'use strict';
const $=s=>document.querySelector(s);
let current=null,state=null,variant=0,showConsequence=false,currentDrawing=null,playing=false,animationId=0,animationStart=0,animationBase=null,drag=null,lastFrame=0;
const drawing=$('#drawing'),controls=$('#controls');
let selectedEntry=null;
const defaultId='regel-01';
const initialRoute=location.hash.slice(1);
function showTent(focus=false){
 stop();document.body.classList.add('at-tent');document.body.classList.remove('menu-open');
 history.replaceState(null,'','#tent');document.title='Στοιχεῖα · Stoicheia';
 window.scrollTo({top:0,behavior:'instant'});if(focus)$('#enter-reference').focus({preventScroll:true});
}
function enterReference(id){
 document.body.classList.remove('at-tent');choose(id||selectedEntry.id,true);$('#title').focus({preventScroll:true});
}
function buildNav(){
 $('#catalog').innerHTML=SOURCE_CHAPTERS.map((name,i)=>{
 const entries=ENTRIES.filter(e=>e.group===i),sections=[...new Set(entries.map(e=>e.section))];
 return `<details data-group="${i}"><summary>${esc(name)}</summary>${sections.map(section=>`<div class="nav-section"><h3>${esc(section)}</h3>${entries.filter(e=>e.section===section).map(e=>`<button data-entry="${e.id}" title="${esc(e.text)}"><span class="entry-number">${e.number}</span><span><strong>${esc(e.label)}</strong><span class="entry-snippet">${esc(e.text)}</span></span></button>`).join('')}</div>`).join('')}</details>`;
 }).join('');
 $('#catalog').addEventListener('click',e=>{const b=e.target.closest('[data-entry]');if(b)choose(b.dataset.entry,true);});
 $('#pistes').innerHTML=PISTES.map((name,i)=>`<button data-piste="${i}"><span class="piste-symbol" aria-hidden="true">${['∠','⌖','△','◇','◯'][i]}</span><strong>${esc(name)}</strong><span>${esc(SOURCE_CHAPTERS[i])}</span></button>`).join('');
 $('#pistes').addEventListener('click',e=>{const b=e.target.closest('[data-piste]');if(!b)return;$('#reference-search').value='';filterNav();choose(ENTRIES.find(x=>x.group===Number(b.dataset.piste)).id,true);});
 $('#piste-menu').open=window.innerWidth>700;
}
function filterNav(){
 const q=$('#reference-search').value.trim().toLocaleLowerCase('nl');let count=0;
 document.querySelectorAll('[data-entry]').forEach(b=>{const e=ENTRIES.find(x=>x.id===b.dataset.entry),found=!q||(String(e.number)===q)||`${e.label} ${e.text} ${e.section}`.toLocaleLowerCase('nl').includes(q);b.hidden=!found;if(found)count++;});
 document.querySelectorAll('.nav-section').forEach(s=>s.hidden=![...s.querySelectorAll('[data-entry]')].some(b=>!b.hidden));
 document.querySelectorAll('#catalog details').forEach(d=>{d.hidden=![...d.querySelectorAll('.nav-section')].some(s=>!s.hidden);if(q&&!d.hidden)d.open=true;});
 $('#search-status').textContent=q?`${count} ${count===1?'uitspraak':'uitspraken'} gevonden`:'85 uitspraken · volgorde van de bron';
}
function choose(id,scroll=false){
 stop();drag=null;
 selectedEntry=ENTRIES.find(e=>e.id===id)||ENTRIES.find(e=>e.scene===id)||ENTRIES[0];
 current=TOPICS.find(t=>t.id===selectedEntry.scene);state=configuration(current.id);variant=selectedEntry.variant;showConsequence=false;
 if(selectedEntry.label==='definitie middellijn')state.values.a=180;
 const i=ENTRIES.indexOf(selectedEntry);
 $('#breadcrumb').textContent=SOURCE_CHAPTERS[selectedEntry.group]+' · '+selectedEntry.section;
 $('#title').textContent=selectedEntry.label;
 $('#index').textContent=`${i+1} / ${ENTRIES.length}`;
 $('#result-title').textContent=current.result;
 $('#page').textContent=`Bron · pagina ${selectedEntry.page} ↗`;$('#page').href='stellingen.pdf#page='+selectedEntry.page;
 $('#insight').textContent=current.insight;
 document.querySelectorAll('[data-entry]').forEach(b=>b.setAttribute('aria-current',b.dataset.entry===selectedEntry.id?'page':'false'));
 document.querySelectorAll('#catalog details').forEach(d=>{if(Number(d.dataset.group)===selectedEntry.group)d.open=true;});
 document.querySelectorAll('[data-piste]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.piste)===selectedEntry.group)));
 const isCriteria=['congruence','similarity'].includes(current.id);
 $('#variants').innerHTML=current.variants.map((label,j)=>`<button data-variant="${j}" aria-pressed="${j===variant}">${esc(label)}</button>`).join('');
 controls.innerHTML=state.c.map(c=>`<label class="slider-row" for="slider-${c.key}"><span>${esc(c.label)}</span><input id="slider-${c.key}" type="range" min="${c.min}" max="${c.max}" value="${state.values[c.key]}" step="${c.step}" data-control="${c.key}"><output id="value-${c.key}" for="slider-${c.key}"></output></label>`).join('');
 $('#previous').disabled=i===0;$('#next').disabled=i===ENTRIES.length-1;
 document.body.classList.remove('menu-open');$('#menu').setAttribute('aria-expanded','false');
 showTheory();render();history.replaceState(null,'','#'+selectedEntry.id);document.title=selectedEntry.label+' · Στοιχεῖα';
 if(scroll)window.scrollTo({top:0,behavior:'instant'});
}
function showTheory(){
 $('#theory').innerHTML=`<div class="rule">${esc(selectedEntry.text)}</div>`;
 $('#source-note').textContent=selectedEntry.sourceNote;$('#source-note').hidden=!selectedEntry.sourceNote;
}
function render(){
 const isCongruence=current.id==='congruence';
 $('#congruence-action').hidden=!isCongruence;
 $('#show-consequence').textContent=showConsequence?'Verberg het gevolg':'Toon het gevolg';
 $('#show-consequence').setAttribute('aria-pressed',String(showConsequence));
 $('#consequence-key').hidden=!showConsequence;
 const note=showConsequence?'Deze driehoeken zijn congruent. Dus ook de overige overeenkomstige zijden en hoeken zijn gelijk.':'Alleen de gegeven gelijkheden zijn gemarkeerd. De knop toont de overige gelijkheden als gevolg van congruentie.';
 if($('#consequence-note').textContent!==note)$('#consequence-note').textContent=note;
 if(isCongruence)$('#result-title').textContent=showConsequence?'Gegeven → congruent → gevolg':'Gegeven gelijkheden';
 const focusKey=document.activeElement?.dataset?.key;currentDrawing=scene(current.id,state,variant,showConsequence);drawing.innerHTML=`<title>${esc(current.title)}</title><desc>${esc(selectedEntry.text)} Versleep de punten met een gekleurde ring of gebruik de schuifregelaars. Focus een punt en gebruik de pijltjestoetsen.</desc>`+currentDrawing.svg;drawing.setAttribute('viewBox',currentDrawing.viewBox);$('#readout').innerHTML=currentDrawing.rows;
 state.c.forEach(c=>{const out=$('#value-'+c.key),input=$('#slider-'+c.key);if(input){input.value=state.values[c.key];out.textContent=fmt(state.values[c.key],c.step<1?2:0)+c.suffix;}});
 $('#interaction-hint').textContent=currentDrawing.handles.length?'Sleep de punten met een gekleurde ring · Ook met aanraken of Tab + pijltjestoetsen.':'Gebruik de schuifregelaars om de figuur te veranderen.';
 if(focusKey&&!drag){const f=drawing.querySelector(`[data-key="${focusKey}"]`);f?.focus({preventScroll:true});}
}
$('#show-consequence').addEventListener('click',()=>{stop();showConsequence=!showConsequence;render();});
controls.addEventListener('input',e=>{const key=e.target.dataset.control;if(!key)return;stop();state.values[key]=Number(e.target.value);render();});
$('#variants').addEventListener('click',e=>{const b=e.target.closest('[data-variant]');if(!b)return;const v=Number(b.dataset.variant);if(['congruence','similarity'].includes(current.id)){choose(ENTRIES.find(x=>x.scene===current.id&&x.variant===v).id);return;}stop();variant=v;showConsequence=false;state.fraction=.5;$('#variants').querySelectorAll('button').forEach((el,i)=>el.setAttribute('aria-pressed',String(i===variant)));render();});
$('#reference-search').addEventListener('input',filterNav);
$('#open-tent').addEventListener('click',()=>showTent(true));
$('#tent-door').addEventListener('click',()=>enterReference());
$('#enter-reference').addEventListener('click',()=>enterReference());
$('#enter-cyclic').addEventListener('click',()=>enterReference('cyclic'));
$('#menu').addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');$('#menu').setAttribute('aria-expanded',String(open));});
$('#reset').addEventListener('click',()=>{stop();state=configuration(current.id);if(selectedEntry.label==='definitie middellijn')state.values.a=180;showConsequence=false;render();});
$('#previous').addEventListener('click',()=>{const i=ENTRIES.indexOf(selectedEntry);if(i>0)choose(ENTRIES[i-1].id,true);});
$('#next').addEventListener('click',()=>{const i=ENTRIES.indexOf(selectedEntry);if(i<ENTRIES.length-1)choose(ENTRIES[i+1].id,true);});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(!id||id==='tent')showTent();else enterReference(id);});
function coords(e){const p=drawing.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(drawing.getScreenCTM().inverse());}
function moveHandle(key,p){
 const id=current.id,v=state.values;
 if(key.startsWith('cyc')){
 const i=Number(key.slice(3));let t=arg(CENTER,p),old=state.thetas[i];t=old+delta(old,t);const prev=i?state.thetas[i-1]:state.thetas[3]-TAU,next=i<3?state.thetas[i+1]:state.thetas[0]+TAU;state.thetas[i]=clamp(t,prev+.30,next-.30);
 }else if(key==='theta'){
 let t=arg(CENTER,p);if(id==='thales'){const eps=.20;if(Math.abs(Math.sin(t))<Math.sin(eps)){if(Math.cos(t)>0)t=t<0?-eps:eps;else t=t<0?-PI+eps:PI-eps;}}state.theta=t;
 }else if(key==='chord'){
 v.a=clamp(deg(norm(arg(CENTER,p)+PI/2)),25,335);v.a=Math.round(v.a);
 }else if(key==='arcpoint'){
 const sweep=rad(id==='constantangle'?110:v.sweep),start=PI/2-sweep/2,small=id==='circleangles'&&variant===1,lo=small?start+.12:start+sweep+.18,span=small?sweep-.24:TAU-sweep-.36,old=lo+state.fraction*span,raw=arg(CENTER,p),t=old+delta(old,raw);state.fraction=clamp((t-lo)/span,0,1);
 }else if(key==='q')v.q=clamp(p.x,110,540);
 else if(key==='locus'){
 if(id==='perpbisector')v.y=clamp(p.y,75,405);if(id==='bisector')v.t=clamp(variant?p.y-CENTER.y:p.x-CENTER.x,-155,155);if(id==='midparallel')v.x=clamp(p.x,110,530);if(id==='parabola')v.x=clamp(p.x-320,-195,195);if(id==='chordperp')v.h=clamp(p.y-CENTER.y,25,150);
 }else if(key.startsWith('p')){
 const i=Number(key.slice(1)),old=state.pts[i],q=V(clamp(p.x,70,570),clamp(p.y,65,410)),ps=state.pts.map((a,j)=>i===j?q:a);
 if(id==='quadSum'){
 const cs=ps.map((a,j)=>cross(sub(ps[(j+1)%4],a),sub(ps[(j+2)%4],ps[(j+1)%4])));if(!cs.every(x=>x>4500))return;
 }else{
 if(Math.abs(cross(sub(ps[1],ps[0]),sub(ps[2],ps[0])))<10000)return;
 if(ps.some((a,j)=>dist(a,ps[(j+1)%3])<80))return;
 }
 state.pts[i]=q;
 }
}
drawing.addEventListener('pointerdown',e=>{
 const el=e.target.closest('[data-key]');if(!el)return;e.preventDefault();stop();drag={key:el.dataset.key,pointerId:e.pointerId};drawing.setPointerCapture(e.pointerId);moveHandle(drag.key,coords(e));render();
});
drawing.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointerId)return;e.preventDefault();moveHandle(drag.key,coords(e));render();});
function finishDrag(e){if(!drag||e.pointerId!==drag.pointerId)return;const key=drag.key;drag=null;if(drawing.hasPointerCapture(e.pointerId))drawing.releasePointerCapture(e.pointerId);drawing.querySelector(`[data-key="${key}"]`)?.focus({preventScroll:true});}
drawing.addEventListener('pointerup',finishDrag);drawing.addEventListener('pointercancel',finishDrag);drawing.addEventListener('lostpointercapture',()=>{drag=null;});
drawing.addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;const el=e.target.closest('[data-key]');if(!el)return;e.preventDefault();stop();const key=el.dataset.key,h=currentDrawing.handles.find(x=>x.key===key),sign=['ArrowRight','ArrowDown'].includes(e.key)?1:-1,step=e.shiftKey?16:5;
 if(key.startsWith('cyc')||key==='theta'||key==='chord'||key==='arcpoint'){
 const t=arg(CENTER,h.p)+sign*rad(e.shiftKey?5:1);moveHandle(key,polar(CENTER,dist(h.p,CENTER),t));
 }else{const vertical=['ArrowUp','ArrowDown'].includes(e.key),direction=key==='locus'&&current.id==='bisector'?(variant?V(0,sign*step):V(sign*step,0)):vertical?V(0,sign*step):V(sign*step,0);moveHandle(key,add(h.p,direction));}render();
});
function stop(){playing=false;cancelAnimationFrame(animationId);$('#play').textContent='▷ Beweeg';$('#play').setAttribute('aria-pressed','false');}
function animate(now){
 if(!playing)return;
 if(now-lastFrame<35){animationId=requestAnimationFrame(animate);return;}lastFrame=now;
 const t=(now-animationStart)/1000,s=Math.sin(t*.65),id=current.id;
 state=JSON.parse(JSON.stringify(animationBase));
 if(id==='cyclic'){moveHandle('cyc0',polar(CENTER,RADIUS,animationBase.thetas[0]+s*.25));moveHandle('cyc2',polar(CENTER,RADIUS,animationBase.thetas[2]+Math.sin(t*.48)*.24));}
 else if(id==='circle'||id==='tangent')state.theta=animationBase.theta+t*.28;
 else if(id==='thales')state.theta=-PI/2+Math.sin(t*.55)*1.14;
 else if(['circleangles','constantangle','tangentchord'].includes(id))state.fraction=.5+s*.35;
 else if(state.pts){const i=id==='inequality'?1:2,base=animationBase.pts[i];moveHandle('p'+i,add(base,V(s*60,Math.sin(t*.44)*45)));}
 else if(state.c.length){const c=state.c[0],middle=(c.min+c.max)/2,range=(c.max-c.min)*.38;state.values[c.key]=clamp(middle+s*range,c.min,c.max);if(c.step===1)state.values[c.key]=Math.round(state.values[c.key]);}
 render();animationId=requestAnimationFrame(animate);
}
$('#play').addEventListener('click',()=>{if(playing){stop();return;}playing=true;animationBase=JSON.parse(JSON.stringify(state));animationStart=performance.now();$('#play').textContent='Ⅱ Pauze';$('#play').setAttribute('aria-pressed','true');animationId=requestAnimationFrame(animate);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
buildNav();filterNav();choose(initialRoute||defaultId);
if(!initialRoute||initialRoute==='tent')showTent();else document.body.classList.remove('at-tent');

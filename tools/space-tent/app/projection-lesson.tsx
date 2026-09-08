'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {Eye,Pause,Play} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Slider} from '@/components/ui/slider';
import Geometry from './geometry';
import {CUBE,EDGES,add,mul,parallelImage,projectionFrame,sub,type V3} from './geometry-math';
import {lessonProjection,lessonImageLengths,LESSON_FRAME,type LessonProjection} from './projection-lesson-math';

const STEPS=['Vertrouwde tekening','Recht van voren','Schuin kijken'];
const COLORS=['#ffa35e','#56d8cd','#aaa2ff'];
const centimeter=(v:number)=>v.toLocaleString('nl-NL',{maximumFractionDigits:2,minimumFractionDigits:Number.isInteger(v)?0:2});

/** An independent observer's view makes the viewing ray visible: in the main
 * projection that ray must collapse to a point, so drawing it there misleads.
 */
export function ViewingCue({projection:b}:{projection:LessonProjection}){
 const id=useId().replaceAll(':',''),center:V3=[.5,.5,.5],eye=add(center,mul(b.eye,1.9)),end=add(center,mul(b.eye,.7)),planeCenter=add(center,mul(b.eye,1.12));
 const plane=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,z])=>add(planeCenter,add(mul(b.planeRight,.48*x),mul(b.planeUp,.48*z))));
 const raw=(p:V3)=>parallelImage(sub(p,center),'spatial',-42,22);
 const bounds=projectionFrame([...Object.values(CUBE),eye,...plane].map(raw),224,188),project=(p:V3)=>raw(p).map((v,i)=>(i===0?112:94)+(v-bounds.center[i])*bounds.scale*1.32);
 const xy=(p:V3)=>project(p).map(v=>v.toFixed(2)).join(','),[ex,ey]=project(eye);
 return <figure className="viewing-cue"><svg viewBox="0 0 224 188" role="img" aria-label="Oriëntatiebeeld van dezelfde kubus: het oog en de pijl wijzen naar de kubus; het blauwe kader is het tekenvlak."><defs><marker id={'look-'+id} viewBox="0 0 8 8" markerWidth="7" markerHeight="7" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="#ffa35e" strokeWidth="1.5"/></marker></defs><polygon points={['A','B','F','E'].map(k=>xy(CUBE[k])).join(' ')} fill="#c6d6e2" fillOpacity=".1"/>{EDGES.map(edge=><polyline key={edge} points={xy(CUBE[edge[0]])+' '+xy(CUBE[edge[1]])} fill="none" stroke="#8caabd" strokeWidth="1.3"/>)}<polygon points={plane.map(xy).join(' ')} fill="#78c9ff" fillOpacity=".08" stroke="#78c9ff" strokeWidth="1.4"/><polyline points={xy(add(center,mul(b.eye,1.65)))+' '+xy(end)} stroke="#ffa35e" strokeWidth="2.5" fill="none" markerEnd={`url(#look-${id})`}/><Eye x={ex-10} y={ey-10} width="20" height="20" stroke="#ffa35e" strokeWidth="1.8"/></svg><figcaption>Oog → kubus<br/>Blauw: tekenvlak</figcaption></figure>;
}

export function ProjectionLessonFrame({position}:{position:number}){
 const b=lessonProjection(position),lengths=lessonImageLengths(b),front=Math.abs(position-1)<1e-6,oblique=position<1;
 return <div className="projection-lesson-frame" data-projection={b.kind}>
  <Geometry guidance={false} fixed projectionBasis={b} frameBounds={LESSON_FRAME} highlights={['AB','AD','AE']} ariaLabel="Dezelfde kubus ABCD.EFGH, weergegeven vanuit de aangegeven kijkrichting." caption="Werkelijk: AB = AD = AE = 6 cm."/>
  <div className="projection-orientation"><ViewingCue projection={b}/><div><p className="projection-kind">{oblique?'Schuine parallelprojectie':'Loodrechte parallelprojectie'}</p><p className="view-direction">{front?'Je kijkt recht van voren.':'Je kijkt schuin van voren, van rechts en van boven.'}</p><p className="projection-plane">{oblique||front?'Het tekenvlak is evenwijdig aan voorvlak ABFE.':'Het tekenvlak staat loodrecht op de kijkrichting. Voorvlak ABFE is daar nu niet evenwijdig aan.'}</p></div></div>
  <div className="insight-facts projection-measures" aria-label="Beeldlengtes in de voorbeeldtekening">{Object.entries(lengths).map(([name,value],i)=><span key={name} style={{color:COLORS[i]}}>Beeld {name}: {centimeter(value)} cm</span>)}</div>
  <p className="projection-scale-note">Vaste tekenschaal: een ribbe van 6 cm zonder projectieverkorting wordt als 4 cm getekend. Op je scherm schaalt de hele tekening mee.</p>
  <p className="insight-explanation">{front?'Nu valt de diepte weg. A/D, B/C, E/H en F/G vallen samen; AD wordt één beeldpunt. AB en AE blijven in beeld even lang.':oblique?'AB en AE hebben dezelfde beeldschaal, omdat het voorvlak evenwijdig aan het tekenvlak ligt. De dieptelijn AD wordt schuin en verkort getekend. De kijkpijl staat schuin op het tekenvlak.':'De kijkrichting én de stand van het tekenvlak zijn veranderd. De drie richtingen krijgen verschillende beeldschalen; de kubus zelf blijft gelijk. De kijkpijl staat loodrecht op het tekenvlak.'}</p>
 </div>;
}

export default function ProjectionLesson(){
 const [position,setPosition]=useState(0),[playing,setPlaying]=useState(false),frame=useRef<number|null>(null),current=useRef(0);
 function stop(){if(frame.current!==null)cancelAnimationFrame(frame.current);frame.current=null;setPlaying(false)}
 function moveTo(value:number){current.current=value;setPosition(value)}
 function go(target:number){
  stop();const start=current.current;
  if(Math.abs(target-start)<1e-6)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){moveTo(target);return;}
  setPlaying(true);const began=performance.now(),throughFront=(start<1&&target>1)||(start>1&&target<1),stops=throughFront?[start,1,target]:[start,target];
  const durations=stops.slice(1).map((end,i)=>Math.max(900,Math.abs(end-stops[i])*2200));
  function animate(now:number){let elapsed=now-began;for(let i=0;i<durations.length;i++){if(elapsed<durations[i]){const progress=elapsed/durations[i],smooth=progress*progress*(3-2*progress);moveTo(stops[i]+(stops[i+1]-stops[i])*smooth);frame.current=requestAnimationFrame(animate);return;}elapsed-=durations[i];if(i<durations.length-1){if(elapsed<1100){moveTo(stops[i+1]);frame.current=requestAnimationFrame(animate);return;}elapsed-=1100;}}moveTo(target);frame.current=null;setPlaying(false);}
  frame.current=requestAnimationFrame(animate);
 }
 useEffect(()=>()=>{if(frame.current!==null)cancelAnimationFrame(frame.current)},[]);
 const settled=STEPS.findIndex((_,i)=>Math.abs(position-i)<1e-6);
 return <div className="projection-lesson"><div className="insight-choices projection-steps" role="group" aria-label="Volg de verandering van projectie">{STEPS.map((label,i)=><Button key={label} variant={settled===i?'default':'outline'} aria-pressed={settled===i} onClick={()=>go(i)}>{i+1}. {label}</Button>)}</div><ProjectionLessonFrame position={position}/><div className="projection-playback"><Button variant="outline" onClick={()=>playing?stop():go(position>=2-1e-6?0:2)}>{playing?<Pause/>:<Play/>}{playing?'Pauze':position>=2-1e-6?'Terug naar het begin':'Bekijk de overgang'}</Button><label className="projection-slider">Volg de overgang zelf<Slider min={0} max={2} step={.02} value={[position]} onValueChange={v=>{stop();moveTo(v[0])}} aria-label="Van de vertrouwde tekening via het vooraanzicht naar schuin kijken"/></label></div><p className="projection-takeaway">Dezelfde kubus, andere weergave. Vergelijk beeldlengten altijd met de gegeven werkelijke maten.</p></div>;
}

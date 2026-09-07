'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowRight,Check,Target,CheckCircle2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Progress} from '@/components/ui/progress';
import {LEVELS,blocksForLevel} from './model';
import type {LearningProgress} from './route-progress';
export default function RouteHeader({progress:p,level,currentBlockId,working,loading,onContinue}:{progress:LearningProgress;level:number;currentBlockId?:string;working:boolean;loading:boolean;onContinue:()=>void}){
 const l=p.levels[level],bs=blocksForLevel(level),focus=bs.find(b=>b.id===currentBlockId)||bs.find(b=>!p.complete.includes(b.id));
 const [celebration,setCelebration]=useState(''),prev=useRef<{level:number;blocks:number;passed:boolean}|null>(null);
 useEffect(()=>{if(loading)return;const old=prev.current;prev.current={level,blocks:l.blocks,passed:l.passed};if(old?.level===level){if(l.passed&&!old.passed)setCelebration(`Level ${level} behaald!`);else if(l.blocks>old.blocks)setCelebration('Blok afgerond · +30 XP')}},[loading,level,l.blocks,l.passed]);
 useEffect(()=>{if(!celebration)return;const id=window.setTimeout(()=>setCelebration(''),5000);return()=>window.clearTimeout(id)},[celebration]);
 const remaining=focus?.questionIds.filter(id=>!p.evidence[id]).length||0;
 const goal=l.passed?(level===7?'Je hebt de volledige voorbereidingsroute afgerond.':'Level behaald. De volgende uitdaging staat klaar.'):focus?`${focus.title} · ${remaining} oefenvragen over`:!l.construction?'Volgende stap: zelfstandig construeren':!l.check?(level===7?'Maak de gemengde proeven A en B.':'Volgende stap: de zelfstandige levelcheck'):'Controleer je redeneringen en constructies op papier.';
 const milestones=[...bs.map(b=>({title:b.title,done:p.complete.includes(b.id)})),{title:'Constructies',done:l.construction},{title:'Levelcheck',done:l.check},{title:'Papierwerk',done:l.paper}];
 return <section className="route-hud no-print" aria-label="Je level en voortgang"><div className="route-location"><span className={'route-number '+(l.passed?'route-number-done':'')}>{l.passed?<Check/>:String(level).padStart(2,'0')}</span><div><span className="route-kicker">{level===7?'TOPLEVEL':`LEVEL ${level} VAN 7`}</span><strong>{LEVELS[level-1].title}</strong></div></div><div className="route-meter"><div className="route-meter-heading"><span>Je leerroute</span><strong>{loading?'…':l.percent+'%'}</strong></div><Progress className="route-fill" value={loading?null:l.percent} aria-label={`Voortgang level ${level}`} aria-valuetext={`${l.percent} procent van de levelonderdelen afgerond`}/><div className="route-goal"><span><Target/>{goal}</span>{focus&&!p.complete.includes(focus.id)&&<strong>+30 XP bij afronden</strong>}</div><div className="route-celebration" role="status">{celebration&&<span><CheckCircle2/>{celebration}</span>}</div></div><div className="route-next"><div className="route-milestones">{milestones.map((m,i)=><span key={m.title} className={m.done?'done':''} title={m.title} aria-label={`${m.title}: ${m.done?'afgerond':'nog te doen'}`}>{m.done?<Check/>:i+1}</span>)}</div>{!working&&<Button className="route-continue" size="sm" onClick={onContinue} disabled={loading}>Verder oefenen <ArrowRight/></Button>}</div></section>
}

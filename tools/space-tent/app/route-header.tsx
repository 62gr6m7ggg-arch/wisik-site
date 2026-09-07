'use client';

import {useEffect,useRef,useState} from 'react';
import {ArrowRight,Check,CheckCircle2,Target} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Progress} from '@/components/ui/progress';
import {BANK,LEVELS} from './model';
import {levelOneRoute,type LearningProgress} from './route-progress';

type Milestones={blocks:number;check:boolean;paper:boolean;atelier:boolean;passed:boolean};

export default function RouteHeader({progress:p,level,currentBlockId,working,loading,onContinue}:{
 progress:LearningProgress;level:number;currentBlockId?:string;working:boolean;loading:boolean;onContinue:()=>void;
}){
 const route=levelOneRoute(p);
 const [celebration,setCelebration]=useState('');
 const previous=useRef<Milestones|null>(null);
 useEffect(()=>{
  if(loading)return;
  const now={blocks:route.blocks,check:p.successfulCheck,paper:p.paperDone,atelier:!!p.workbench,passed:p.level1Passed};
  const old=previous.current;
  previous.current=now;
  if(!old)return;
  const message=now.passed&&!old.passed?'Level 1 behaald!':now.blocks>old.blocks?'Blok afgerond · +30 XP':now.check&&!old.check?'Levelcheck gehaald · +100 XP':now.paper&&!old.paper?'Papierwerk zelfgecontroleerd · +30 XP':now.atelier&&!old.atelier?'Constructieatelier afgerond · +60 XP':'';
  if(message)setCelebration(message);
 },[loading,route.blocks,p.successfulCheck,p.paperDone,!!p.workbench,p.level1Passed]);
 useEffect(()=>{
  if(!celebration)return;
  const timer=window.setTimeout(()=>setCelebration(''),5000);
  return ()=>window.clearTimeout(timer);
 },[celebration]);

 const nextBlock=BANK.blocks.find(block=>!p.complete.includes(block.id));
 const focusBlock=currentBlockId?BANK.blocks.find(block=>block.id===currentBlockId):nextBlock;
 const unavailable=level>2;
 const atelier=level===2;
 const value=unavailable?0:atelier?(p.workbench?100:0):route.percent;
 const title=LEVELS[level-1].title;
 let goal='',reward='',counter='';
 if(unavailable){
  goal='Dit level volgt. Je kunt verder met de beschikbare oefeningen.';
  counter='Nog niet beschikbaar';
 }else if(atelier){
  goal=p.workbench?'Atelier afgerond. Probeer ook de andere variant.':'Volgende mijlpaal: je eerste complete doorsnede';
  reward=p.workbench?'':'+60 XP';
  counter=p.workbench?'Atelier afgerond':'Atelier te ontdekken';
 }else{
  counter=`${route.milestones} van 6 mijlpalen`;
  if(p.level1Passed){goal='Level 1 behaald. Het constructieatelier wacht op je.';}
  else if(focusBlock){
   const remaining=focusBlock.questionIds.filter(id=>!p.evidence[id]).length;
   const completed=p.complete.includes(focusBlock.id);
   goal=completed?`Herhalen: ${focusBlock.title}`:remaining?`${focusBlock.title} · nog ${remaining} oefenvra${remaining===1?'ag':'gen'}`:`Rond je blok af: ${focusBlock.title}`;
   reward=completed?'':'+30 XP bij afronden';
  }else if(!p.successfulCheck){goal='Volgende mijlpaal: de zelfstandige levelcheck';reward='+100 XP';}
  else{goal='Laatste mijlpaal: je papierwerk controleren';reward='+30 XP';}
 }
 const milestoneStates=atelier?[!!p.workbench]:[
  ...BANK.blocks.map(block=>p.complete.includes(block.id)),p.successfulCheck,p.paperDone,
 ];
 const milestoneNames=atelier?['Constructieatelier']:[...BANK.blocks.map(block=>block.title),'Levelcheck','Papierwerk zelfgecontroleerd'];

 return <section className={'route-hud no-print'+(unavailable?' route-hud-unavailable':'')} aria-label="Je level en voortgang">
  <div className="route-location">
   <span className={'route-number'+(!atelier&&p.level1Passed&&level===1?' route-number-done':'')} aria-hidden="true">{!atelier&&p.level1Passed&&level===1?<Check/>:String(level).padStart(2,'0')}</span>
   <div><span className="route-kicker">{level===7?'TOPLEVEL':`LEVEL ${level} VAN 7`}</span><strong>{title}</strong></div>
  </div>
  <div className="route-meter">
   <div className="route-meter-heading"><span>{loading?'Voortgang ophalen…':unavailable?'Binnenkort':atelier?'Voortgang constructieatelier':'Je leerroute'}</span><strong>{loading?'…':unavailable?'':atelier?(p.workbench?'Afgerond':'Start'):`${value}%`}</strong></div>
   <Progress className="route-fill" value={loading?null:value} aria-label={atelier?'Voortgang van het constructieatelier, niet het volledige level 2':'Doorlopen route van level '+level} aria-valuetext={loading?'Voortgang wordt opgehaald':unavailable?'Nog niet beschikbaar':atelier?counter:`${value} procent van je leerroute; ${counter}`}/>
   <div className="route-goal"><span><Target aria-hidden="true"/>{goal}</span>{reward&&<strong>{reward}</strong>}</div>
   <div className="route-celebration" role="status" aria-live="polite" aria-atomic="true">{celebration&&<span key={celebration}><CheckCircle2 aria-hidden="true"/>{celebration}</span>}</div>
  </div>
  <div className="route-next">
   {!unavailable&&<div className="route-milestones" aria-label={counter}>{milestoneStates.map((done,index)=><span key={milestoneNames[index]} className={done?'done':''} title={milestoneNames[index]+(done?' · afgerond':' · nog te doen')} aria-label={milestoneNames[index]+(done?' afgerond':' nog te doen')}>{done?<Check aria-hidden="true"/>:<span aria-hidden="true">{index+1}</span>}</span>)}</div>}
   {working?<span className="route-counter">{atelier?'Volledige level 2 volgt':counter}</span>:<Button className="route-continue" size="sm" onClick={onContinue} disabled={loading}>{unavailable?(p.level1Passed?'Naar het atelier':'Verder met level 1'):atelier?'Open atelier':p.level1Passed?'Volgende uitdaging':'Verder oefenen'}<ArrowRight aria-hidden="true"/></Button>}
  </div>
 </section>
}

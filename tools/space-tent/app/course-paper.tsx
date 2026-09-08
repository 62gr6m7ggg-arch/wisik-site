'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {ArrowLeft,Printer,Eye,CheckCircle2} from 'lucide-react';
import {COURSE} from './model';
import CourseFigure from './course-figure';
import type {SaveEvent} from './workbench';
const keys=['figure','relations','intersection','reason'];
export default function CoursePaper({paperKey,save,onBack,alreadyDone}:{paperKey:string;save:SaveEvent;onBack:()=>void;alreadyDone:boolean}){
 const task=COURSE.papers[paperKey], [show,setShow]=useState(false),[checks,setChecks]=useState<string[]>([]),[done,setDone]=useState(alreadyDone),[busy,setBusy]=useState(false);
 if(!task)return <p>Deze papieropdracht kon niet worden geladen.</p>;
 return <section className="paper-view"><div className="section-top no-print"><Button variant="ghost" onClick={onBack}><ArrowLeft/>Mijn route</Button><span className="eyebrow">LEVEL {paperKey} · PAPIERWERK</span></div><div className="paper-sheet"><span className="eyebrow">ZELFSTANDIG CONSTRUEREN EN ONDERBOUWEN</span><h1 className="page-title">{task.title}</h1><p>{task.prompt}</p><p>Werk eerst op papier met potlood, liniaal, geodriehoek en zo nodig passer. Nummer je lijnen, geef nieuwe punten een naam en markeer evenwijdigheid en loodrechte stand.</p><div className="paper-layout"><ol>{task.steps.map((s,i)=><li key={i}>{s}</li>)}</ol><CourseFigure guidance={false} fixed scene={task.scene}/></div><div className="paper-writing-space" aria-hidden="true"/></div><div className="question-actions no-print"><Button variant="outline" onClick={()=>window.print()}><Printer/>Afdrukken</Button><Button onClick={()=>setShow(true)}><Eye/>Mijn werk controleren</Button></div>{show&&<div className="paper-feedback no-print"><h2>Vergelijk je volledige redenering.</h2><ol>{task.solution.map((s,i)=><li key={i}>{s}</li>)}</ol><p>Deze controle berust op jouw beoordeling van je papierwerk. De tool kan je tekening en bewijs op papier niet automatisch beoordelen. Laat een twijfelgeval nakijken door je docent of een medestudent.</p><div className="paper-checks">{task.rubric.map((text,i)=><label key={i}><Checkbox checked={checks.includes(keys[i])} onCheckedChange={v=>setChecks(c=>v?[...c,keys[i]]:c.filter(k=>k!==keys[i]))}/><span>{text}</span></label>)}</div><Button disabled={checks.length!==4||busy} onClick={async()=>{setBusy(true);if(await save('paper',{checks,level:paperKey}))setDone(true);setBusy(false)}}>Zelfcontrole vastleggen <CheckCircle2/></Button>{done&&<p role="status" className="positive">Papierwerk als zelfgecontroleerd vastgelegd.</p>}</div>}</section>
}

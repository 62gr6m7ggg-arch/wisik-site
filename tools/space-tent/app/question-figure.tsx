'use client';

import Geometry,{type IllustrationSegment} from './geometry';
import {CUBE,type V3} from './geometry-math';
import {questionGeometry} from './question-visuals';
import {COLORS} from './insight-scenes';
import {ExtendedPlane,PlaneHinge,ThreePlanes} from './insight-figure';
import CourseFigure from './course-figure';
import type {Question} from './model';

function AngleImage({reveal}:{reveal:boolean}){
 return <><svg className="math-schema" viewBox="0 0 320 210" role="img" aria-label="Alleen het vlakke beeld is gegeven: de beelden van l en m staan loodrecht."><path d="M40 150 H285 M95 190 V25" fill="none" stroke="#ffa35e" strokeWidth="3"/><path d="M95 128 H117 V150" fill="none" stroke="#56d8cd" strokeWidth="2"/><text x="280" y="175">l</text><text x="110" y="35">m</text><text x="130" y="135">90°</text></svg>{reveal?<><Geometry fixed compact highlights={['AF','AH']} caption="Tegenvoorbeeld: AF en AH maken werkelijk een hoek van 60°. Van boven worden hun beelden loodrecht."/><p className="insight-explanation">AB en AD maken werkelijk 90° en hebben hetzelfde loodrechte bovenaanzicht. Uit alleen die beeldhoek volgt dus geen unieke ruimtelijke hoek.</p></>:<p className="figure-caption">Alleen de beeldhoek is gegeven. Er is geen ruimtelijke kubus bij deze vraag gegeven.</p>}</>
}
function SegmentRatio({reveal,calculation}:{reveal:boolean;calculation:boolean}){
 const a=calculation?2:3,b=calculation?6:5;
 return <div className="ratio-example"><h3>Echte lengtes · gegeven</h3><svg className="math-schema" viewBox="0 0 320 170" role="img" aria-label={`Twee evenwijdige lijnstukken van ${a} en ${b} centimeter.`}><path d={`M35 45 H${35+a*35}`} stroke={COLORS[0]} strokeWidth="4"/><path d={`M35 110 H${35+b*35}`} stroke={COLORS[1]} strokeWidth="4"/><text x="35" y="30">{a} cm</text><text x="35" y="145">{b} cm</text></svg><h3>In de parallelprojectie</h3>{reveal?<div className="insight-facts"><span>{a} × ½ = {a/2} cm</span><span>{b} × ½ = {b/2} cm</span></div>:<p className="figure-caption">{calculation?'Het eerste beeld is 1 cm. De lengte van het tweede beeld moet je bepalen.':'De beeldlengtes zijn nog niet gegeven.'}</p>}{reveal&&<p className="insight-explanation">Beide lijnstukken hebben dezelfde richting en dus dezelfde beeldschaal. {calculation?'Hier is die schaalfactor ½.':'De factor ½ is een voorbeeld; iedere niet-nulle gemeenschappelijke factor behoudt 3 : 5.'}</p>}</div>
}
function SeparateSegments({reveal}:{reveal:boolean}){
 const points:Record<string,V3>={P:[0,1,0],Q:[1,1,0],R:[2,2,0],S:[2,3,0],J:[-.3,.5,0],K:[2.5,.5,0],L:[2.5,3.4,0],N:[-.3,3.4,0],...(reveal?{X:[2,1,0] as V3}:{})};
 const segments:IllustrationSegment[]=reveal?[{from:points.Q,to:[2.3,1,0],color:COLORS[0],dashed:true},{from:points.R,to:[2,.7,0],color:COLORS[1],dashed:true}]:[];
 return <Geometry fixed showCube={false} view="top" points={points} hiddenLabels={['J','K','L','N']} planes={[["J","K","L","N"]]} highlights={['PQ','RS']} segments={segments} selected={reveal?['X']:[]} fitToContent caption={reveal?'De volledige lijnen snijden in X, buiten beide zichtbare lijnstukken.':'Gegeven: twee lijnstukken in hetzelfde vlak, met verschillende richtingen.'}/>
}
function CollinearPoints({reveal}:{reveal:boolean}){
 const points:Record<string,V3>={P:[0,0,0],Q:[.5,0,0],R:[1,0,0],U:[0,1,0],V:[1,1,0],W:[0,0,1],X:[1,0,1],Y:[0,1,1],Z:[1,1,1]};
 return <Geometry fixed showCube={false} points={points} hiddenLabels={['U','V','W','X','Y','Z']} highlights={['PR']} planes={reveal?[["P","R","V","U"],["P","R","X","W"],["P","R","Z","Y"]]:[]} caption={reveal?'Alle drie verschillende vlakken bevatten P, Q en R.':'P, Q en R liggen op dezelfde rechte.'}/>
}
function ParallelLines({reveal,vertical=false,allThree=false}:{reveal:boolean;vertical?:boolean;allThree?:boolean}){
 if(vertical&&reveal)return <ThreePlanes initial="none" single/>;
 return <><svg className="math-schema" viewBox="0 0 320 230" role="img" aria-label={vertical?'Gegeven evenwijdige snijlijnen. De vraag bepaalt wat je over de derde snijlijn weet.':'Twee verschillende evenwijdige lijnen l en m.'}>{reveal&&<path d="M20 30 H300 V200 H20 Z" fill="#56d8cd" fillOpacity=".12"/>}<g transform={vertical?'translate(260,0) rotate(90)':''}><path d="M30 60 H210" stroke={COLORS[0]} strokeWidth="3"/><path d="M30 160 H210" stroke={COLORS[1]} strokeWidth="3"/>{vertical&&allThree&&<path d="M30 230 H210" stroke={COLORS[2]} strokeWidth="3"/>}</g>{vertical?<><text x="213" y="45">l</text><text x="110" y="45">m</text>{allThree&&<text x="40" y="45">n</text>}</>:<><text x="235" y="66">l</text><text x="235" y="166">m</text></>}{reveal&&<><circle cx="65" cy="60" r="4" fill="white"/><circle cx="175" cy="60" r="4" fill="white"/><circle cx="100" cy="160" r="4" fill="white"/><text x="58" y="47">P</text><text x="172" y="47">Q</text><text x="95" y="187">R</text></>}</svg><p className="figure-caption">{vertical?(allThree?'Drie verschillende evenwijdige snijlijnen zijn gegeven. Kunnen zij een punt delen?':'De twee evenwijdige snijlijnen zijn gegeven. Over de derde lijn moet je redeneren.'):reveal?'P en Q op l, R op m: drie niet-collineaire punten leggen het vlak vast.':'Alleen de twee lijnen zijn gegeven; er is nog geen vlak ingekleurd.'}</p></>
}
function RotatedCube({reveal}:{reveal:boolean}){
 return <><div className="projection-pair"><div><h3>Stand 1</h3><Geometry fixed compact camera={[12,12]} highlights={['AD']}/></div><div><h3>Stand 2</h3><Geometry fixed compact camera={[70,12]} highlights={['AD']}/></div></div><p className="figure-caption">{reveal?'De werkelijke kubus blijft dezelfde. Alleen de kijkrichting en daarmee de beeldlengte van AD verandert.':'Twee kijkrichtingen op dezelfde vaste kubus. AD wordt langer weergegeven.'}</p></>
}
export default function QuestionFigure({question:q,reveal=false,answer=[],selectable=[],onPoint,allowRotate=false,onExplore}:{allowRotate?:boolean;onExplore?:()=>void;question:Question;reveal?:boolean;answer?:string[];selectable?:string[];onPoint?:(point:string)=>void}){
 if(q.scene)return <CourseFigure scene={reveal?(q.revealScene||q.scene):q.scene} fixed={!allowRotate||!!q.scene.view&&q.scene.view!=='spatial'} selected={answer} selectable={reveal?[]:selectable} onPoint={onPoint} onExplore={onExplore}/>;
 if(q.id==='p3')return <AngleImage reveal={reveal}/>;
 if(q.id==='p4'||q.id==='retest-p2')return <SegmentRatio reveal={reveal} calculation={q.id==='retest-p2'}/>;
 if(q.id==='probe-p2')return <RotatedCube reveal={reveal}/>;
 if(q.id==='l3')return <SeparateSegments reveal={reveal}/>;
 if(q.id==='probe-l2')return reveal?<div className="projection-pair"><Geometry fixed compact highlights={['AB','HG']} caption="Evenwijdig: dezelfde richting, geen punt gemeen."/><Geometry fixed compact highlights={['AB','CG']} caption="Kruisend: verschillende richtingen, geen punt gemeen."/></div>:<div className="given-card"><span>Gegeven</span><strong>Twee verschillende lijnen</strong><p>Geen gemeenschappelijk punt.</p><p>Welke extra informatie heb je nodig voor je conclusie?</p></div>;
 if(q.id==='probe-v1')return <CollinearPoints reveal={reveal}/>;
 if(q.id==='cp-v2')return <ParallelLines reveal={reveal}/>;
 if(q.id==='probe-d2'||q.id==='cp-d2')return <ParallelLines reveal={reveal} vertical allThree={q.id==='probe-d2'}/>;
 if(q.id==='probe-d1')return reveal?<ThreePlanes initial="line" single/>:<div className="given-card"><span>Gegeven</span><strong>Drie verschillende vlakken</strong><p>Elk vlak bevat de volledige lijn l.</p><p>Onderzoek wat de drie vlakken samen gemeen hebben.</p></div>;
 if(q.id==='v1'&&reveal)return <PlaneHinge/>;
 if(q.id==='v4'&&reveal)return <ExtendedPlane point="T"/>;
 const props=questionGeometry(q,reveal,answer);
 const captions:Record<string,string>={p1:'Gegeven: kubusribbe 6 cm. Beeld AB: 4 cm; beeld AD: 2 cm. De tekening schaalt mee met je scherm.','probe-p1':'Deze vaste parallelprojectie laat AE korter zien dan AB.','retest-p1':'Balk met AB = 8 cm en AD = 4 cm. De twee beeldlengtes zijn hier gelijk.','p2':reveal?'M ligt ook in de projectie midden tussen A en G.':'AG is getekend. Het beeld van M moet je zelf bepalen.','cp-p1':reveal?'N verdeelt ook het beeld van EH in de verhouding 1 : 2.':'EH is getekend. Het beeld van N moet je zelf bepalen.','p5':reveal?'Vooraanzicht: A/D, B/C, E/H en F/G vallen samen.':'Het voorvlak is gegeven. Kijk loodrecht daarop, evenwijdig aan AD.','p6':reveal?'Bovenaanzicht: A/E, B/F, C/G en D/H vallen samen.':'Het grondvlak is gegeven. Kijk loodrecht daarop, evenwijdig aan AE.','cp-p2':reveal?'Rechterzijaanzicht: C en D krijgen hetzelfde beeld.':'Het rechterzijvlak is gegeven. Kijk loodrecht daarop, evenwijdig aan AB.'};
 const arrows:Record<string,{from:V3;to:V3}>={p5:{from:[-.25,-.65,.5],to:[-.25,0,.5]},p6:{from:[.5,-.25,1.6],to:[.5,-.25,1]},'cp-p2':{from:[1.6,-.2,.5],to:[1,-.2,.5]}};
 const arrow=!reveal?arrows[q.id]:undefined;
 return <Geometry {...props} segments={[...props.segments,...(arrow?[{...arrow,color:COLORS[0],arrow:true}]:[])]} selected={reveal?props.selected:answer} selectable={reveal?[]:selectable} onPoint={onPoint} fixed={!allowRotate} onExplore={onExplore} fitToContent={!!arrow||q.id==='v4'} caption={(q.id==='v2'&&reveal?`AB en ${props.selected[0]} bepalen het gekleurde vlak. Elk ander kubushoekpunt buiten AB is ook een geldige keuze.`:captions[q.id])||(reveal?'De markeringen laten de redenering bij deze opgave zien. Gestippelde verlengingen horen bij de volledige lijnen.':'De gegeven punten, lijnen en vlakken. De afbeelding is een parallelprojectie.')}/>
}

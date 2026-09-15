import {CUBE,EDGES,type V3} from '../geometry-math';
import type {GeoProps} from '../geometry';
export type KnowledgeScene=GeoProps&{caption:string};
const cube={showCube:false,points:CUBE,edges:EDGES};
const pyramidPoints:Record<string,V3>={A:[0,0,0],B:[6,0,0],C:[6,6,0],D:[0,6,0],T:[3,3,4],O:[3,3,0],M:[3,0,0]};
const pyramid={showCube:false,points:pyramidPoints,edges:['AB','BC','CD','DA','AT','BT','CT','DT'],highlights:['TO','TM','OM'],planes:[['A','B','C','D']]};
export const SCENES:Record<string,KnowledgeScene>={
 cube:{...cube,points:{...CUBE,M:[.5,0,0]},highlights:['AB','AC','AG'],caption:'Kubus ABCD.EFGH. AB is een ribbe, AC een vlakdiagonaal en AG een ruimtediagonaal. M is het midden van AB. Alle kubusribben zijn even lang.'},
 box:{...cube,dimensions:[3,4,5],highlights:['AC','AG'],caption:'Balk ABCD.EFGH: AC ligt in het grondvlak; AG loopt door het binnenste. De drie ribbenrichtingen staan loodrecht op elkaar.'},
 plane:{...cube,planes:[['A','B','C','D']],caption:'ABCD is een vierkant vlakdeel. Het meetkundige vlak ABC loopt ook buiten deze gekleurde begrenzing door.'},
 pyramid:{...pyramid,caption:'Regelmatige piramide T.ABCD: basiszijde 6, hoogte TO = 4. O is het basiscentrum, M het midden van AB. OM = 3 en de zijvlakhoogte TM = 5.'},
 dihedral:{...pyramid,planes:[['A','B','C','D'],['A','B','T'],['T','O','M']],caption:'AB is de snijlijn. MO en MT staan beide loodrecht op AB in M. Daarom is TMO een standvlak en is ∠TMO de standhoek. TO = 4 en OM = 3.'},
 prism:{showCube:false,points:{A:[0,0,0],B:[4,0,0],C:[0,3,0],D:[0,0,5],E:[4,0,5],F:[0,3,5]},edges:['AB','BC','CA','DE','EF','FD','AD','BE','CF'],planes:[['A','B','C'],['D','E','F']],caption:'Een recht driehoekig prisma ABC.DEF. De basisdriehoeken zijn evenwijdig en congruent; AD, BE en CF staan loodrecht op beide basisvlakken.'},
 frustum:{showCube:false,points:{A:[0,0,0],B:[6,0,0],C:[6,6,0],D:[0,6,0],E:[2,2,6],F:[4,2,6],G:[4,4,6],H:[2,4,6],T:[3,3,9]},edges:EDGES,planes:[['A','B','C','D'],['E','F','G','H']],segments:[{from:[2,2,6],to:[3,3,9],color:'#d8bbff',dashed:true},{from:[4,4,6],to:[3,3,9],color:'#d8bbff',dashed:true}],caption:'Afgeknotte piramide: grondzijde 6, bovenzijde 2 en hoogte 6. T is de oorspronkelijke top op hoogte 9. De kleine top heeft hoogteschaal 1/3 en inhoudsschaal 1/27.'},
 tetrahedron:{showCube:false,points:{O:[0,0,0],A:[3,0,0],B:[0,4,0],C:[0,0,5]},edges:['OA','OB','OC','AB','BC','CA'],planes:[['O','A','B']],highlights:['OC'],caption:'Viervlak OABC. OA = 3, OB = 4 en OC = 5 staan twee aan twee loodrecht. Basis OAB heeft oppervlakte 6; de inhoud is ⅓ × 6 × 5 = 10.'},
 'intersection-plane':{...cube,planes:[['A','B','G','H'],['A','D','G','F']],highlights:['AG'],caption:'De vlakken ABG en ADG hebben A en G gemeen. Hun snijlijn is AG. De gekleurde vierhoeken tonen de vlakdelen binnen de kubus.'},
 'three-planes':{...cube,planes:[['A','B','C','D'],['A','B','F','E'],['A','D','H','E']],selected:['A'],caption:'Vlakken ABC, ABF en ADH hebben alle drie alleen punt A gemeen. Per paar delen zij een hele lijn: AB, AD of AE.'},
 'line-plane':{...cube,points:{...CUBE,O:[.5,.5,0],I:[.5,.5,1],S:[.5,.5,.5]},planes:[['B','D','H','F'],['A','C','G','E']],highlights:['AG','OI'],caption:'Vlak ACG helpt het snijpunt van AG met vlak BDH te vinden. O = AC ∩ BD en I = EG ∩ FH. Hun lijn OI snijdt AG in het kubuscentrum S.'},
 'parallel-planes':{...cube,planes:[['A','B','C','D'],['E','F','G','H']],highlights:['AE'],caption:'Grond- en bovenvlak zijn evenwijdig. AE staat loodrecht op beide en geeft hun onderlinge afstand. EF ligt evenwijdig buiten het grondvlak.'},
 'perpendicular-plane':{...cube,planes:[['A','B','C','D'],['A','B','F','E']],highlights:['AE','AB','AD'],caption:'AE staat loodrecht op AB én AD, twee snijdende lijnen in het grondvlak. Daardoor staat AE loodrecht op het grondvlak en staan voor- en grondvlak loodrecht op elkaar.'},
 'diagonal-plane':{...cube,planes:[['A','C','G','E']],highlights:['AC','CG','AG'],caption:'Het diagonaalvlak snijdt de kubus in rechthoek ACGE. Met kubusribbe a is AC = a√2, CG = a en AG = a√3.'},
 section:{...cube,points:{...CUBE,P:[0,0,.5],Q:[1,0,.5],R:[1,1,.5],S:[0,1,.5]},planes:[['P','Q','R','S']],highlights:['PQ','QR','RS','SP'],caption:'P, Q, R en S zijn de middens van de vier opstaande ribben. Doorsnede PQRS is een vierkant, evenwijdig aan het grondvlak. Iedere rand ligt op een zijvlak.'},
 skew:{...cube,highlights:['AE','BC','AB'],caption:'AE en BC zijn kruisende lijnen. AB ontmoet beide en staat op beide loodrecht. Het lijnstuk AB is hun kortste verbinding. Hun richtingen maken een hoek van 90°.'},
 'point-plane':{showCube:false,points:{A:[0,0,0],B:[4,0,0],C:[4,3,0],D:[0,3,0],P:[2,1.5,3],F:[2,1.5,0]},edges:['AB','BC','CD','DA'],planes:[['A','B','C','D']],highlights:['PF','AP','AF'],caption:'F is de loodvoet van P op het horizontale vlak ABCD. PF staat loodrecht op het hele vlak. AF is de loodrechte projectie van AP; ∠PAF is de lijn-vlakhoek.'},
 axes:{showCube:false,points:{O:[0,0,0],X:[4,0,0],Y:[0,4,0],Z:[0,0,5],P:[2,3,4],F:[2,3,0]},edges:['OX','OY','OZ'],highlights:['PF','OF'],caption:'O is de oorsprong. OX, OY en OZ wijzen in de positieve x-, y- en z-richting. P = (2,3,4) projecteert op F = (2,3,0) in het xy-vlak.'}
};
export function footExample(x:number){const foot:[number,number]=[x,0];return {p:[x,1] as [number,number],foot,distance:1,segmentDistance:Math.hypot(x-Math.max(0,Math.min(2,x)),1),inside:x>=0&&x<=2};}
export function areaRectangle(x:number){return x*(10-x)}
export const FLAT_FIGURES=['line','lines','parallel','triangle','isosceles','equilateral','cosine','similarity','area','altitude','rhombus','trapezoid','perspective','circle','thales','sphere','cylinder','net','dynamic'];
export const FIGURE_KINDS=[...Object.keys(SCENES),...FLAT_FIGURES,'foot','foot-outside','foot-interactive','projection','views','function'];

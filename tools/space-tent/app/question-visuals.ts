import type {Question} from './model';
import {CUBE,type V3} from './geometry-math';
import {lineExtensions} from './insight-scenes';

export function questionGeometry(q:Question,reveal=false,answer:string[]=[]){
 let points:Record<string,V3>={...(q.extraPoints||{})},highlights=[...(q.highlights||[])],planes=(q.planes||[]).map(p=>[...p]);
 let selected:string[]=[],segments:ReturnType<typeof lineExtensions>=[];
 let view:'spatial'|'front'|'top'|'right'|'scaled'|'equal-image'='spatial';
 let dimensions:V3=[1,1,1];
 if(!reveal){if(q.id==='p2')delete points.M;if(q.id==='cp-p1')delete points.N;}
 if(q.id==='p1'||q.id==='probe-p1')view='scaled';
 if(q.id==='retest-p1'){view='equal-image';dimensions=[8,4,4];highlights=['AB','AD'];}
 if(q.id==='v4')segments=[{from:CUBE.B,to:points.T,color:'#ffa35e',dashed:true}];
 if(q.id==='probe-v2')points={M:[.5,0,1]};
 if(reveal){
  const lines:Record<string,string[]>={p2:['AM','MG'],'cp-p1':['EN','NH'],l2:['AF','BE'],l4:['AB','HG','DC'],'retest-l2':['AD','BC'],'cp-l1':['AC','FH'],'cp-l2':['AH','BG'],v3:['AG'],'cp-v1':['EH'],d1:['AB','EF'],d2:['AB'],d3:['AB','AD','AE'],d4:['BF','CG','AE'],'retest-d1':['EF','FG','BF'],'retest-d2':['BC','FG'],'cp-d1':['GH','EH','DH']};
  if(lines[q.id])highlights=lines[q.id];
  const addedPlanes:Record<string,string[][]>={l4:[['A','B','C','D'],['D','C','G','H']],'retest-l2':[['A','B','C','D']],'cp-l1':[['A','B','C','D'],['E','F','G','H']],'cp-l2':[['A','D','H','E'],['B','C','G','F']],'probe-v2':[['E','F','C','D']],'retest-v1':[['A','C','G','E']]};
  if(addedPlanes[q.id])planes=addedPlanes[q.id];
  const pointMap:Record<string,string[]>={p2:['M'],'cp-p1':['N'],l2:['I'],v3:['A','G'],'cp-v1':['E','H'],d2:['A','B'],d3:['A'],'retest-d1':['F'],'cp-d1':['H'],'probe-v2':['C']};
  selected=pointMap[q.id]||[];
  if(q.id==='l2')points.I=[.5,0,.5];
  if(q.id==='v2'){
   const chosen=q.acceptAny?.includes(answer[0])?answer[0]:'C';
   planes=['C','D'].includes(chosen)?[['A','B','C','D']]:['E','F'].includes(chosen)?[['A','B','F','E']]:[['A','B','G','H']];
   selected=[chosen];highlights=['AB'];
  }
  if(q.id==='p5')view='front';if(q.id==='p6')view='top';if(q.id==='cp-p2')view='right';
  if(['v3','cp-v1','d1','d2','d3','d4','retest-d1','retest-d2','cp-d1','l2','cp-l1','cp-l2'].includes(q.id))segments=lineExtensions(highlights,{...CUBE,...points});
 }
 return {points,highlights,planes,selected,segments,view,dimensions};
}

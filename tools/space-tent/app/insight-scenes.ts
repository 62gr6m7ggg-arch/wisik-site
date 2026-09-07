import {CUBE,add,mul,sub,type V3} from './geometry-math';

export type ExampleId='projection-views'|'midpoint'|'direction-scale'|'line-relations'|'shared-plane'|'external-intersection'|'false-crossing'|'plane-hinge'|'plane-definitions'|'plane-extension'|'plane-intersection'|'plane-pairs'|'parallel-planes'|'three-planes'|'triangle-walls';
export const COLORS=['#ffa35e','#56d8cd','#b6a1ff'];
export function lineExtensions(keys:string[],points:Record<string,V3>=CUBE){
 return keys.flatMap((key,i)=>{
  const a=points[key[0]],b=points[key[1]],u=sub(b,a),color=COLORS[i%3];
  return [{from:add(a,mul(u,-.18)),to:a,color,dashed:true},{from:b,to:add(b,mul(u,.18)),color,dashed:true}];
 });
}
export const THREE_CASES={
 line:{title:'Eén lijn',planes:[['A','B','C','D'],['A','B','F','E'],['A','B','G','H']],names:['ABC','ABF','ABG'],lines:['AB'],pairs:['ABC ∩ ABF = AB','ABC ∩ ABG = AB','ABF ∩ ABG = AB'],selected:['A','B'],text:'Elk paar levert dezelfde snijlijn AB. Alle punten van die lijn liggen in alle drie vlakken.'},
 point:{title:'Eén punt',planes:[['A','B','C','D'],['A','B','F','E'],['A','D','H','E']],names:['ABC','ABF','ADH'],lines:['AB','AD','AE'],pairs:['ABC ∩ ABF = AB','ABC ∩ ADH = AD','ABF ∩ ADH = AE'],selected:['A'],text:'De eerste twee vlakken delen AB. Alleen A van die lijn ligt ook in ADH. Samen delen de drie vlakken precies A.'},
 none:{title:'Geen punt',planes:[['A','B','F','E'],['B','C','G','F'],['A','C','G','E']],names:['ABF','BCG','ACG'],lines:['BF','CG','AE'],pairs:['ABF ∩ BCG = BF','BCG ∩ ACG = CG','ACG ∩ ABF = AE'],selected:[],text:'Elk paar snijdt, maar langs een andere verticale lijn. BF, CG en AE zijn evenwijdig; geen punt ligt op alle drie.'},
};

export const WORKED_SECTION:Record<string,V3>={P:[0,0,.25],Q:[1,0,.5],R:[1,1,.75],S:[0,1,.5]};

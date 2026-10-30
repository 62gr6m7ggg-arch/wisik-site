import {A_VARIANTS} from './variants-a.js?v=1.5.0';
import {B_VARIANTS} from './variants-b.js?v=1.5.0';
import {C_VARIANTS} from './variants-c.js?v=1.5.0';
import {D_VARIANTS} from './variants-d.js?v=1.5.0';

const official={...A_VARIANTS,...B_VARIANTS,...C_VARIANTS,...D_VARIANTS};
// Deze opmerkingen betroffen inmiddels volledig opgenomen officiële varianten.
const notes={
 A1:'',B4a:'',B6c:'',C2b:'',C3a:'',D5b:'',D6b:'',
 D3b:'De vraag schrijft gebruik van de omgekeerde bewering voor. Alleen bissectrices tekenen zonder die samenhang levert volgens het correctievoorschrift geen punten op.'
};
export function withOfficialMethods(exercise){
 const specs=official[exercise.id];
 if(!specs)return exercise;
 const methods=specs.map((spec,index)=>({
  title:spec.title,steps:spec.steps||exercise.steps,rubric:spec.rubric||exercise.rubric,
  refs:spec.refs||exercise.refs,figure:spec.figureKey||exercise.figure,
  figurePlan:spec.figurePlan,index,
  note:exercise.id==='B3'&&index>0?'':undefined
 }));
 return {...exercise,methods,legacyMethod:Math.max(0,specs.findIndex(s=>s.useBase)),
  refs:[...new Set(methods.flatMap(m=>m.refs))],
  alternative:Object.hasOwn(notes,exercise.id)?notes[exercise.id]:exercise.alternative};
}

export const methodsFor=exercise=>exercise.methods||[{title:'Redenering',steps:exercise.steps,rubric:exercise.rubric,refs:exercise.refs,figure:exercise.figure,index:0}];

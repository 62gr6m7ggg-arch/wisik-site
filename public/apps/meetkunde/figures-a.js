// Exacte basisfiguren met een eigen opbouw voor de tweede officiële A-routes.
export const A_FIGURE_BASES = {
 geoBuildRight:'geoBuild',
 altitudeExterior:'altitude'
};

export function enrichAModel(key,p,math){
 if(key==='geoBuildRight')return {...p,bounds:[-3.4,-3,3,2.3]};
 return p;
}

export function drawAVariant(key,step,p,g){
 const {line,poly,circle,point,angleMark,right,tick}=g;
 if(key==='geoBuildRight'){
  // Aanvankelijk zijn alleen de twee lijnen en het gegeven punt A zichtbaar.
  line([-3.1,1.6],[2.6,1.6]);line([-3.1,-2.4],[2.6,-2.4]);
  point('k',[2.6,1.6]);point('m',[2.6,-2.4]);point('A',p.A,10,4);
  if(step>=3){poly([p.Q,p.S,p.A],'shade');poly([p.A,p.T,p.R],'shade2');}
  if(step>=1){
   line(p.S,p.T,'aux');point('S',p.S,9,-10);point('T',p.T,9,23);
   right(p.A,p.S,p.Q);right(p.A,p.T,p.R);
   point('Q',p.Q,-20,-8);line(p.S,p.Q,'accent');line(p.A,p.T,'accent');
   tick(p.S,p.Q);tick(p.A,p.T);
  }
  if(step>=2){
   line(p.A,p.Q);line(p.A,p.R,'accent2');point('R',p.R,10,22);
   right(p.Q,p.A,p.R);
  }
  if(step>=3){
   line(p.Q,p.R);tick(p.A,p.Q,2);tick(p.A,p.R,2);
   angleMark(p.A,p.Q,p.S,'','accent',24);
   angleMark(p.R,p.A,p.T,'','accent',24);
  }
  return true;
 }
 if(key==='altitudeExterior'){
  // Alle zes punten, de cirkel en de hoogtelijn zijn gegeven in deze bewijsopgave.
  circle([0,0],1);poly([p.A,p.B,p.P]);line(p.P,p.C);line(p.B,p.Q);
  if(step>=2)poly([p.P,p.B,p.Q],'shade');
  if(step>=3)poly([p.P,p.B,p.R],'shade2');
  right(p.P,p.Q,p.B);
  for(const n of ['A','B','C','P','Q','R'])point(n,p[n],n==='Q'?-23:10,n==='R'?20:-10);
  if(step>=1){
   angleMark(p.C,p.P,p.B,'','accent',23);
   angleMark(p.A,p.P,p.B,'','accent2',42);
  }
  if(step>=2){
   line(p.P,p.B,'accent');line(p.B,p.Q,'accent2');
   angleMark(p.P,p.B,p.Q,'','accent2',28);
  }
  if(step>=3){
   line(p.R,p.C,'accent');
   angleMark(p.B,p.R,p.C,'','accent',30);
  }
  return true;
 }
 return false;
}

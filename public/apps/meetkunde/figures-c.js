// Exacte figuren voor de aanvullende officiële oplossingsmethoden van tentamen C.
export const C_FIGURE_BASES = {
 'c-rectangle-cyclic':'c-rectangle',
 'c-bisectors-reflection':'c-bisectorsBuild',
 'c-radius-constant':'c-radius',
 'c-radius-central':'c-radius',
 'c-tangent-extension':'c-tangent',
 'c-tangent-angle-sums':'c-tangentBisector',
 'c-tangent-small-triangles':'c-tangentBisector',
 'c-motion-chords':'c-motion',
 'c-motion-distances':'c-motion',
 'c-cyclic-other-pair':'c-cyclic'
};
export function enrichCModel(key,p,m){
 if(key==='c-bisectors-reflection'){
  const T=m.foot(p.C,p.P,p.Q),S=m.sub(m.mul(T,2),p.C);
  return {...p,T,S};
 }
 if(key==='c-tangent-extension'){
  const u=m.sub(p.D,p.A),E=m.add(p.D,m.mul(u,.8/m.norm(u)));
  return {...p,E};
 }
 if(key==='c-motion-distances')return {...p,Cp:[p.C[0],p.D[1]],Cpp:[p.D[0],p.C[1]]};
 return p;
}
function rectangleGivens(p,g){
 g.circle([0,0],1);g.poly([p.A,p.B,p.C,p.D]);g.line(p.A,p.C);
 for(const n of ['A','B','C','D','M'])g.point(n,p[n],n==='D'?-24:9,n==='A'||n==='B'||n==='M'?23:-12);
}
function radiusGivens(p,g){
 g.circle(p.M,1);g.poly([p.A,p.B,p.C]);g.line(p.M,p.D);g.line(p.C,p.D);
 for(const n of ['A','B','C','D','M','E'])g.point(n,p[n],n==='A'||n==='D'?-24:10,n==='D'?23:n==='E'?22:-12);
 g.right(p.M,p.E,p.B);
}
function tangentGivens(p,g,bisector=false){
 g.circle(p.O,1);g.line(p.A,[1.25,0]);g.line(p.A,p.C);g.line(p.B,p.D);g.line(p.C,p.D);
 for(const n of ['A','B','C','D'])g.point(n,p[n],n==='B'?-24:10,n==='A'||n==='D'?23:-12);
 if(bisector){
  g.line(p.A,g.lerp(p.A,p.Q,1.15));g.point('P',p.P,-20,22);g.point('Q',p.Q,12,-8);
  g.angleMark(p.C,p.A,p.Q,'','given',38);g.angleMark(p.Q,p.A,p.D,'','given',46);
 }
}
function motionGivens(p,g){
 g.poly([p.D,p.E,p.F,p.G]);g.poly([p.A,p.B,p.C]);
 for(const n of ['D','E','F','G','A','B','C'])g.point(n,p[n],n==='D'||n==='A'||n==='G'?-24:10,n==='D'||n==='B'||n==='E'?23:-12);
 g.right(p.A,p.C,p.B);g.tick(p.A,p.C);g.tick(p.B,p.C);
}
export function drawCVariant(key,step,p,g){
 if(!Object.hasOwn(C_FIGURE_BASES,key))return false;
 if(key==='c-rectangle-cyclic'){
  rectangleGivens(p,g);
  if(step>=1){g.right(p.A,p.B,p.C);g.right(p.A,p.D,p.C);}
  if(step===2){g.angleMark(p.B,p.A,p.C,'α','accent',25);g.angleMark(p.A,p.C,p.D,'α','accent',25);g.angleMark(p.C,p.A,p.D,'β','accent2',35);g.angleMark(p.A,p.C,p.B,'β','accent2',35);}
  if(step>=3){g.angleMark(p.B,p.A,p.D,'θ','accent',49);g.angleMark(p.B,p.C,p.D,'θ','accent',49);}
  if(step>=4){g.poly([p.A,p.B,p.C,p.D],'shade');g.right(p.D,p.A,p.B);g.right(p.B,p.C,p.D);}
 }else if(key==='c-bisectors-reflection'){
  g.circle([0,0],1);for(const n of ['P','Q','R'])g.point(n,p[n],n==='R'?-25:10,-12);
  if(step>=1){g.line(p.P,p.Q,'aux');g.line(p.R,p.C,'accent');g.point('C',p.C,10,-12);g.right(p.P,p.T,p.C);}
  if(step>=2){g.line(p.C,p.S,'aux');g.point('T',p.T,-24,18);g.point('S',p.S,10,22);g.tick(p.C,p.T);g.tick(p.T,p.S);}
  if(step>=3){g.line(p.P,p.A,'accent');g.line(p.Q,p.B,'accent');g.point('A',p.A,-24,-10);g.point('B',p.B,10,24);g.poly([p.A,p.B,p.C],'accent');}
 }else if(key==='c-radius-constant'){
  radiusGivens(p,g);
  if(step>=1){g.tick(p.A,p.E);g.tick(p.E,p.B);}
  if(step>=2){g.line(p.A,p.D,'aux');g.line(p.B,p.D,'aux');g.poly([p.A,p.E,p.D],'shade');g.poly([p.B,p.E,p.D],'shade2');g.angleMark(p.A,p.B,p.D,'β','accent',27);g.angleMark(p.B,p.A,p.D,'β','accent2',27);}
  if(step>=3){g.angleMark(p.A,p.C,p.D,'β','accent',28);g.angleMark(p.B,p.C,p.D,'β','accent2',40);}
  if(step>=4)g.line(p.C,p.D,'accent');
 }else if(key==='c-radius-central'){
  radiusGivens(p,g);
  if(step>=1){g.line(p.M,p.A,'aux');g.line(p.M,p.B,'aux');g.tick(p.M,p.A);g.tick(p.M,p.B);}
  if(step>=2){g.poly([p.A,p.E,p.M],'shade');g.poly([p.B,p.E,p.M],'shade2');g.line(p.E,p.M,'accent');g.right(p.M,p.E,p.A);}
  if(step>=3){g.angleMark(p.A,p.M,p.D,'α','accent',30);g.angleMark(p.B,p.M,p.D,'α','accent2',30);}
  if(step>=4){g.angleMark(p.A,p.C,p.D,'','accent',28);g.angleMark(p.B,p.C,p.D,'','accent2',36);g.line(p.C,p.D,'accent');}
 }else if(key==='c-tangent-extension'){
  tangentGivens(p,g);
  if(step>=1){g.point('E',p.E,10,23);g.line(p.D,p.E,'accent');g.angleMark(p.D,p.B,p.C,'β','accent',30);g.angleMark(p.E,p.D,p.C,'β','accent',29);}
  if(step>=2){g.angleMark(p.A,p.B,p.D,'180°−β','accent2',46);g.angleMark(p.A,p.D,p.C,'180°−β','accent2',46);}
  if(step>=3){g.poly([p.A,p.B,p.D],'shade');g.poly([p.A,p.D,p.C],'shade2');g.angleMark(p.B,p.A,p.D,'α','accent',34);}
 }else if(key==='c-tangent-angle-sums'){
  tangentGivens(p,g,true);
  if(step>=1){g.poly([p.A,p.D,p.Q],'shade');g.angleMark(p.A,p.Q,p.D,'θ','accent',25);g.angleMark(p.A,p.D,p.Q,'β','accent',31);g.angleMark(p.D,p.A,p.Q,'','accent',29);}
  if(step>=2){g.poly([p.A,p.B,p.P],'shade2');g.angleMark(p.A,p.P,p.B,step>=3?'θ':'φ','accent2',25);g.angleMark(p.A,p.B,p.P,step>=3?'β':'γ','accent2',30);g.angleMark(p.B,p.A,p.P,'','accent2',42);}
  if(step>=4)g.angleMark(p.Q,p.P,p.D,'θ','accent2',28);
 }else if(key==='c-tangent-small-triangles'){
  tangentGivens(p,g,true);
  if(step>=1){g.angleMark(p.A,p.B,p.P,'β','accent',28);g.angleMark(p.A,p.D,p.Q,'β','accent',32);}
  if(step>=2){g.poly([p.A,p.B,p.P],'shade');g.poly([p.A,p.D,p.Q],'shade2');g.angleMark(p.B,p.A,p.P,'α','accent2',32);g.angleMark(p.D,p.A,p.Q,'α','accent2',43);}
  if(step>=3){g.angleMark(p.A,p.P,p.B,'γ','accent',25);g.angleMark(p.A,p.Q,p.D,'γ','accent',25);}
  if(step>=4)g.angleMark(p.Q,p.P,p.D,'γ','accent',28);
 }else if(key==='c-motion-chords'){
  motionGivens(p,g);
  const interior=g.norm(g.sub(p.A,p.D))>1e-8&&g.norm(g.sub(p.B,p.D))>1e-8;
  if(step>=1){g.circle(p.M,g.norm(g.sub(p.A,p.B))/2,'aux');if(interior)g.right(p.B,p.D,p.A);}
  if(step>=2){g.line(p.D,p.C,'aux');g.line(p.A,p.C,'accent');g.line(p.B,p.C,'accent');if(interior){g.angleMark(p.A,p.D,p.C,'α','accent',30);g.angleMark(p.B,p.D,p.C,'α','accent2',39);}}
  if(step>=3)g.line(p.D,[1.65,1.65],'accent');
  if(step>=4){g.line([1,1],[Math.SQRT2,Math.SQRT2],'locus');if(!interior){if(g.norm(g.sub(p.A,p.D))<1e-8)g.angleMark(p.B,p.D,p.C,'45°','accent',32);else g.angleMark(p.A,p.D,p.C,'45°','accent',32);}}
 }else if(key==='c-motion-distances'){
  motionGivens(p,g);
  const nondegenerate=g.norm(g.sub(p.Cp,p.B))>1e-8&&g.norm(g.sub(p.Cpp,p.A))>1e-8;
  if(step>=1){g.line(p.C,p.Cp,'aux');g.line(p.C,p.Cpp,'aux');g.point('C′',p.Cp,10,23);g.point('C″',p.Cpp,-35,-12);g.right(p.C,p.Cp,p.D);g.right(p.C,p.Cpp,p.D);}
  if(step>=2&&nondegenerate){g.angleMark(p.Cp,p.B,p.C,'θ','accent',29);g.angleMark(p.Cpp,p.A,p.C,'θ','accent2',29);}
  if(step>=3){if(nondegenerate){g.poly([p.C,p.Cp,p.B],'shade');g.poly([p.C,p.Cpp,p.A],'shade2');}g.tick(p.C,p.Cp,2);g.tick(p.C,p.Cpp,2);g.line(p.C,p.Cp,'accent');g.line(p.C,p.Cpp,'accent2');}
  if(step>=4){g.line(p.D,[1.65,1.65],'accent');g.line([1,1],[Math.SQRT2,Math.SQRT2],'locus');}
 }else if(key==='c-cyclic-other-pair'){
  g.circle(p.O,1);g.poly([p.A,p.B,p.C]);g.line(p.D,p.E);g.line(p.D,p.F);
  for(const n of ['A','B','C','D','E','F'])g.point(n,p[n],n==='F'?-23:10,n==='D'||n==='A'||n==='B'?23:-12);
  if(step>=1){g.angleMark(p.A,p.D,p.F,'α','accent',29);g.angleMark(p.D,p.E,p.F,'α','accent',28);}
  if(step>=2){g.line(p.A,p.C,'accent2');g.line(p.D,p.E,'accent2');g.angleMark(p.A,p.C,p.B,'β','accent2',29);g.angleMark(p.D,p.E,p.B,'β','accent2',41);}
  if(step>=3){g.poly([p.D,p.E,p.F],'shade');g.poly([p.D,p.E,p.B],'shade2');g.line(p.B,p.F,'accent2');}
  if(step>=4){g.circle(p.result.o,p.result.r,'accent');g.poly([p.A,p.D,p.F,p.C],'shade');}
 }
 return true;
}

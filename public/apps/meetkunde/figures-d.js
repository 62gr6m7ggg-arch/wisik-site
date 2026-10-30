// Eigen tekenstappen voor de aanvullende officiële bewijsroutes van tentamen D.
export const D_FIGURE_BASES = {
 'd-triangle-half':'d-triangle',
 'd-triangle-inscribed':'d-triangle',
 'd-equilateral-arcs':'d-equilateralCircles',
 'd-mirror-sum':'d-mirror',
 'd-mirror-one':'d-mirrorBuild',
 'd-parallel-exterior':'d-parallel',
 'd-parallel-angleBuild':'d-parallelBuild',
 'd-bisector-exterior':'d-bisectorCircle',
 'd-bisector-similarity':'d-bisectorCircle'
};

export function enrichDModel(key,p,math){
 if(key==='d-triangle-inscribed')return {...p,F:math.polar(215)};
 return p;
}

export function drawDVariant(key,step,p,g){
 if(!Object.hasOwn(D_FIGURE_BASES,key))return false;
 const {line,poly,circle,point,angleMark,right,tick,add,sub,mul,norm,lerp}=g;
 const unit=v=>mul(v,1/norm(v));
 const mirror=(at,direction)=>{const u=unit(direction);line(sub(at,mul(u,.17)),add(at,mul(u,.17)),'locus');};
 const triangleGivens=()=>{
  circle(p.A,1);poly([p.A,p.B,p.C]);line(p.D,p.E);
  for(const n of ['A','B','C','D','E'])point(n,p[n],n==='E'?-22:10,n==='A'?22:-10);
  angleMark(p.B,p.A,p.C,'α','given',34);
 };
 const mirrorGivens=()=>{
  circle([0,0],1);poly([p.A,p.B,p.C]);line(p.A,p.S,'aux');line(p.S,p.B,'aux');line(p.S,p.C);
  line(p.T,add(p.S,mul(p.u,.27)),'locus');
  for(const n of ['A','B','C','S'])point(n,p[n],n==='S'?-24:10,n==='A'||n==='B'?23:-12);
  angleMark(p.A,p.S,p.T,'α','given',23);angleMark(p.C,p.S,p.B,'β','given',27);
 };
 const parallelGivens=build=>{
  line(p.A,p.C);line(p.L,p.U);
  for(const n of ['A','C','R'])point(n,p[n],n==='A'?-23:10,n==='R'?22:-12);
  point('m',p.U,7,4);
  if(!build){circle(p.O,1);circle(p.circle.o,p.circle.r);poly([p.A,p.B,p.C]);line(p.A,p.R);line(p.C,p.R);point('B',p.B,10,3);}
 };
 const bisectorGivens=()=>{
  circle(p.M,1);poly([p.A,p.B,p.C]);line(p.D,p.B);line(p.D,p.A);tick(p.A,p.C);tick(p.B,p.C);
  for(const n of ['A','B','C','D','M'])point(n,p[n],n==='D'||n==='C'?-24:10,n==='A'?23:-12);
  circle(p.circle.o,p.circle.r,'aux');line(p.E,p.C);line(p.D,p.F);
  for(const n of ['E','F','G'])point(n,p[n],n==='G'?-18:n==='F'?4:10,n==='G'?23:n==='F'?-16:22);
 };
 const arc=(center,r,a,b,through,style='locus')=>{
  const tau=2*Math.PI,wrap=t=>(t%tau+tau)%tau;
  const start=Math.atan2(a[1]-center[1],a[0]-center[0]),end=Math.atan2(b[1]-center[1],b[0]-center[0]);
  let delta=wrap(end-start);
  if(through){const t=Math.atan2(through[1]-center[1],through[0]-center[0]);if(wrap(t-start)>delta)delta-=tau;}
  else if(delta>Math.PI)delta-=tau;
  poly(Array.from({length:101},(_,i)=>{const t=start+delta*i/100;return [center[0]+r*Math.cos(t),center[1]+r*Math.sin(t)];}),style,false);
 };

 if(key==='d-triangle-half'){
  triangleGivens();
  if(step>=1){line(p.A,p.D,'aux');tick(p.A,p.D);tick(p.A,p.E);poly([p.A,p.D,p.E],'shade2');angleMark(p.A,p.D,p.E,'','accent2',33);angleMark(p.A,p.E,p.D,'','accent2',27);}
  if(step>=2){tick(p.A,p.B);poly([p.A,p.B,p.D],'shade');angleMark(p.A,p.D,p.B,'','accent',24);angleMark(p.A,p.B,p.D,'','accent',27);}
  if(step>=3)angleMark(p.E,p.D,p.B,'','accent2',45);
  if(step>=4)angleMark(p.C,p.D,p.E,'α/2','accent',46);
 }else if(key==='d-triangle-inscribed'){
  triangleGivens();
  if(step>=1){point('F',p.F,-23,22);line(p.B,p.F,'aux');line(p.E,p.F,'aux');angleMark(p.B,p.F,p.E,'α/2','accent',27);}
  if(step>=2){poly([p.B,p.F,p.E,p.D],'shade');line(p.B,p.D,'accent2');line(p.D,p.E,'accent2');angleMark(p.E,p.D,p.B,'','accent2',34);}
  if(step>=3)angleMark(p.C,p.D,p.E,'α/2','accent',46);
 }else if(key==='d-equilateral-arcs'){
  circle(p.c1.o,p.c1.r);circle(p.c2.o,p.c2.r);poly([p.A,p.B,p.C]);poly([p.B,p.D,p.E]);line(p.A,p.E);line(p.C,p.D);
  for(const n of ['A','B','C','D','E'])point(n,p[n],n==='A'?-22:10,n==='D'?24:-10);
  point('S',p.S,-22,5);
  if(step>=1)arc(p.c1.o,p.c1.r,p.A,p.B,p.C);
  if(step>=2){line(p.S,p.B,'aux');angleMark(p.A,p.S,p.B,'120°','accent',30);}
  if(step>=3)arc(p.c2.o,p.c2.r,p.B,p.E,null,'accent2');
  if(step>=4)angleMark(p.B,p.S,p.E,'60°','accent2',42);
  if(step>=5)line(p.A,p.E,'accent');
 }else if(key==='d-mirror-sum'){
  mirrorGivens();
  if(step>=1){angleMark(p.A,p.S,p.B,'','accent',39);angleMark(p.A,p.C,p.B,'','accent',25);}
  if(step>=2){angleMark(p.A,p.S,p.B,'','accent2',48);line(p.T,add(p.S,mul(p.u,.43)),'accent2');}
  if(step>=3){poly([p.A,p.B,p.C],'shade');angleMark(p.B,p.A,p.C,'','accent',26);angleMark(p.A,p.B,p.C,'','accent',26);}
  if(step>=4){angleMark(p.B,p.A,p.C,'β','accent',26);angleMark(p.A,p.B,p.C,'β','accent',26);tick(p.A,p.C);tick(p.B,p.C);}
 }else if(key==='d-mirror-one'){
  circle([0,0],1);
  for(const n of ['A','B','P','Q'])point(n,p[n],n==='P'?-23:10,n==='A'?23:-10);
  if(step>=1){line(p.A,p.B,'aux');line(mul(p.C1,1.18),mul(p.C1,-1.18),'aux');right(p.B,p.H,p.C1);tick(p.A,p.H);tick(p.B,p.H);point('C',p.C1,-25,-12);}
  if(step>=2){line(p.P,p.C1,'aux');mirror(p.P,sub(p.C1,p.P));line(p.A,p.P,'accent');line(p.P,p.B,'accent');}
  if(step>=3){line(p.Q,p.C1,'aux');const v=sub(p.C1,p.Q),u=unit([-v[1],v[0]]);mirror(p.Q,u);right(p.C1,p.Q,add(p.Q,u));line(p.A,p.Q,'accent');line(p.Q,p.B,'accent');}
 }else if(key==='d-parallel-exterior'){
  parallelGivens(false);
  if(step>=1){angleMark(p.A,p.C,p.B,'α','accent',27);angleMark(p.B,p.A,p.R,'α','accent',27);}
  if(step>=2){poly([p.A,p.B,p.C],'shade');angleMark(p.A,p.B,p.R,'','accent2',34);angleMark(p.B,p.A,p.C,'','accent2',37);}
  if(step>=3){angleMark(p.C,p.A,p.R,'','accent2',49);angleMark(p.A,p.R,p.L,'','accent2',29);}
  if(step>=4){line(p.A,p.C,'accent');line(p.L,p.U,'accent');line(p.A,p.R,'aux');}
 }else if(key==='d-parallel-angleBuild'){
  parallelGivens(true);
  if(step>=1){line(p.A,p.R,'aux');line(p.C,p.R,'aux');angleMark(p.A,p.C,p.R,'','accent',27);}
  if(step>=2){const end=lerp(p.A,p.B,1.5);line(p.A,end,'accent');point('l',end,8,-8);angleMark(p.R,p.A,p.B,'','accent',29);}
  if(step>=3){point('B',p.B,10,5);line(p.A,p.B,'accent2');line(p.B,p.C,'accent2');}
 }else if(key==='d-bisector-exterior'){
  bisectorGivens();
  if(step>=1){line(p.A,p.F,'aux');angleMark(p.A,p.C,p.F,'','accent',24);angleMark(p.A,p.D,p.F,'','accent',24);}
  if(step>=2){poly([p.A,p.D,p.G],'shade');angleMark(p.A,p.G,p.F,'','accent2',23);angleMark(p.D,p.A,p.G,'','accent2',28);}
  if(step>=3){poly([p.A,p.E,p.C],'shade2');angleMark(p.C,p.A,p.E,'','accent2',35);angleMark(p.A,p.E,p.C,'','accent2',25);}
  if(step>=4){circle(p.result.o,p.result.r,'accent');angleMark(p.A,p.G,p.F,'','accent',24);angleMark(p.A,p.E,p.F,'','accent',26);}
 }else if(key==='d-bisector-similarity'){
  bisectorGivens();
  if(step>=1){line(p.A,p.F,'aux');angleMark(p.A,p.C,p.E,'','accent',24);angleMark(p.A,p.D,p.G,'','accent',24);}
  if(step>=2){angleMark(p.G,p.A,p.D,'','accent2',27);angleMark(p.C,p.A,p.E,'','accent2',35);}
  if(step>=3){poly([p.A,p.G,p.D],'shade');poly([p.A,p.E,p.C],'shade2');angleMark(p.A,p.G,p.D,'','accent',24);angleMark(p.A,p.E,p.C,'','accent',25);}
  if(step>=4){circle(p.result.o,p.result.r,'accent');angleMark(p.A,p.G,p.F,'','accent2',33);angleMark(p.A,p.E,p.F,'','accent2',34);}
 }
 return true;
}

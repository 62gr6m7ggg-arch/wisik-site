// Aanvullende figuren bij uitsluitend de officiële alternatieven van tentamen B.
export const B_FIGURE_BASES = {
 'b-trapezoid-supplementary':'b-trapezoid',
 'b-centroid-similarity':'b-centroid',
 'b-centroid-two-medians':'b-centroid',
 'b-diameter-tangent':'b-diameter',
 'b-equilateral-other-angle':'b-equilateralProof',
 'b-equilateral-build-other':'b-equilateralBuild'
};

export function enrichBModel(key,p,m){
 const {add,sub,mul,mid,intersect,norm,diagramBounds}=m;
 if(key==='b-centroid-similarity')return {...p,T:intersect(p.B,p.C,p.D,p.E)};
 if(key==='b-centroid-two-medians')return {...p,P:intersect(p.C,p.D,p.B,p.E),Q:intersect(p.B,p.C,p.D,p.E)};
 if(key!=='b-equilateral-build-other')return p;
 const direction=sub(p.C,p.A),M=intersect(p.B,add(p.B,direction),p.m0,p.m1),v=sub(M,p.A),h=mul([-v[1],v[0]],Math.sqrt(3)/2),center=mid(p.A,M),candidates=[add(center,h),sub(center,h)],kDirection=sub(p.k1,p.k0);
 const distance=q=>{const w=sub(q,p.k0);return Math.abs(w[0]*kDirection[1]-w[1]*kDirection[0])/norm(kDirection);};
 const K=distance(candidates[0])<distance(candidates[1])?candidates[0]:candidates[1],r=norm(sub(M,p.A));
 const unit=mul(direction,1/norm(direction)),l0=add(p.B,mul(unit,.45)),l1=sub(M,mul(unit,.55));
 return {...p,M,K,r,l0,l1,bounds:diagramBounds([p.A,p.B,p.C,p.k0,p.k1,p.m0,p.m1,l0,l1],[{o:p.A,r},{o:M,r}])};
}

export function drawBVariant(key,step,p,g){
 if(!B_FIGURE_BASES[key])return false;
 const {line,poly,circle,point,angleMark,right,tick,polar,lerp}=g;
 if(key==='b-trapezoid-supplementary'){
  circle([0,0],1);poly([p.A,p.B,p.C,p.D]);
  for(const n of ['A','B','C','D'])point(n,p[n],n==='D'?-24:10,n==='A'?23:-12);
  if(step>=1&&step<3){angleMark(p.B,p.A,p.D,'α','accent',32);angleMark(p.A,p.D,p.C,'','accent2',28);}
  if(step===2)angleMark(p.D,p.C,p.B,'','accent2',28);
  if(step>=3){
   angleMark(p.A,p.D,p.C,'β','accent',28);angleMark(p.D,p.C,p.B,'β','accent',28);
   if(step===3){poly(Array.from({length:121},(_,i)=>polar(220+i*2)),'accent',false);poly(Array.from({length:121},(_,i)=>polar(140+i*2)),'accent2',false);}
  }
  if(step>=4){poly(Array.from({length:81},(_,i)=>polar(140+i)),'locus',false);poly(Array.from({length:81},(_,i)=>polar(20+i)),'locus',false);}
  if(step>=5){line(p.A,p.D,'accent');line(p.B,p.C,'accent');tick(p.A,p.D);tick(p.B,p.C);}
 }else if(key==='b-centroid-similarity'||key==='b-centroid-two-medians'){
  poly([p.A,p.B,p.C,p.D]);line(p.A,p.E);tick(p.A,p.C,2);tick(p.C,p.E,2);
  for(const n of ['A','B','C','D','E'])point(n,p[n],n==='D'?-24:10,n==='A'?23:-12);
  if(key==='b-centroid-similarity'){
   if(step>=1){line(p.B,p.D,'aux');point('S',p.S,-24,10);tick(p.D,p.S);tick(p.S,p.B);}
   if(step>=2){poly([p.D,p.B,p.E],'shade');line(p.S,p.E,'accent');}
   if(step>=3){line(p.B,p.T,'aux');point('T',p.T,-24,-12);poly([p.A,p.D,p.E],'shade');poly([p.C,p.T,p.E],'shade2');angleMark(p.A,p.D,p.E,'','accent',23);angleMark(p.C,p.T,p.E,'','accent',23);}
   if(step>=4){tick(p.D,p.T,3);tick(p.T,p.E,3);line(p.B,p.T,'accent2');}
   if(step>=5){line(p.E,p.S,'accent');line(p.B,p.T,'accent2');}
  }else{
   if(step>=1){line(p.B,p.E,'aux');line(p.D,p.P,'accent');point('P',p.P,10,-12);}
   if(step>=2){poly([p.A,p.B,p.E],'shade');poly([p.C,p.P,p.E],'shade2');angleMark(p.A,p.B,p.E,'','accent',23);angleMark(p.C,p.P,p.E,'','accent',23);}
   if(step>=3){tick(p.B,p.P);tick(p.P,p.E);}
   if(step>=4){line(p.D,p.E,'aux');line(p.B,p.Q,'accent2');point('Q',p.Q,-24,-12);tick(p.D,p.Q,3);tick(p.Q,p.E,3);}
   if(step>=5){line(p.D,p.P,'accent');line(p.B,p.Q,'accent2');}
  }
 }else if(key==='b-diameter-tangent'){
  circle(p.M,1);line(p.A,p.B);line([-.6,-1],[2.25,-1]);line(p.A,p.Pi);line(p.A,p.Qi);
  for(const n of ['A','B','M','P','Q'])point(n,p[n],n==='A'||n==='B'||n==='M'||n==='Q'?-24:10,n==='Q'?-4:n==='B'?23:-12);
  point('P′',p.Pi,9,23);point('Q′',p.Qi,-8,23);point('k',[2.25,-1],7,-10);
  if(step>=1){line(p.B,p.P,'aux');angleMark(p.Pi,p.B,p.P,'α','accent',29);angleMark(p.B,p.A,p.P,'α','accent',40);}
  if(step>=2)right(p.A,p.P,p.B);
  if(step>=3)right(p.Pi,p.P,p.B);
  if(step>=4){angleMark(p.A,p.B,p.P,'β','accent2',30);angleMark(p.A,p.Pi,p.B,'β','accent2',28);}
 }else if(key==='b-equilateral-other-angle'){
  poly([p.A,p.B,p.C]);line(p.k0,p.k1);line(p.l0,p.l1);point('l',p.l1,8,-8);poly([p.A,p.D,p.E]);
  for(const n of ['A','B','C'])point(n,p[n],n==='A'?-24:8,n==='B'||n==='C'?23:-12);
  point('D',p.D,10,23);point('E',p.E,10,-12);angleMark(p.A,p.E,p.D,'60°','given',32);
  if(step>=1)circle(p.circle.o,p.circle.r,'aux');
  if(step>=2){angleMark(p.A,p.D,p.E,step>=3?'60°':'','accent',30);angleMark(p.A,p.C,p.E,step>=3?'60°':'','accent',28);}
  if(step>=3)angleMark(p.B,p.A,p.C,'60°','accent2',28);
  if(step>=4){angleMark(p.D,p.A,p.E,'60°','accent',32);tick(p.A,p.D);tick(p.D,p.E);tick(p.E,p.A);}
 }else if(key==='b-equilateral-build-other'){
  poly([p.A,p.B,p.C]);line(p.k0,p.k1);line(p.m0,p.m1);
  for(const n of ['A','B','C'])point(n,p[n],n==='A'?-24:8,n==='B'||n==='C'?23:-12);
  point('k',p.k0,-18,0);point('m',p.m0,-20,-8);
  if(step>=1){line(p.l0,p.l1,'aux');point('l',p.l1,-18,-10);}
  if(step>=2){point('M',p.M,10,-12);line(p.A,p.M,'aux');}
  if(step>=3){circle(p.A,p.r,'aux');circle(p.M,p.r,'aux');point('K',p.K,-24,23);line(p.A,p.K,'accent');line(p.M,p.K,'accent');}
  if(step>=4){poly([p.A,p.K,p.M],'shade');tick(p.A,p.K);tick(p.K,p.M);tick(p.M,p.A);}
 }
 return true;
}

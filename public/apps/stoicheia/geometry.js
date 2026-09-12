'use strict';
const PI=Math.PI,TAU=2*PI;
const COL={burgundy:'#a4334a',orange:'#c75b14',teal:'#007f82',blue:'#365fbb',ink:'#344c60',muted:'#94a4b4'};
const V=(x,y)=>({x,y}),add=(a,b)=>V(a.x+b.x,a.y+b.y),sub=(a,b)=>V(a.x-b.x,a.y-b.y),mul=(a,k)=>V(a.x*k,a.y*k),dot=(a,b)=>a.x*b.x+a.y*b.y,cross=(a,b)=>a.x*b.y-a.y*b.x,len=a=>Math.hypot(a.x,a.y),dist=(a,b)=>len(sub(a,b)),mid=(a,b)=>mul(add(a,b),.5),unit=a=>mul(a,1/(len(a)||1)),perp=a=>V(-a.y,a.x),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rad=d=>d*PI/180,deg=r=>r*180/PI;
const polar=(o,r,t)=>add(o,V(r*Math.cos(t),r*Math.sin(t))),arg=(o,p)=>Math.atan2(p.y-o.y,p.x-o.x),norm=a=>(a%TAU+TAU)%TAU,delta=(a,b)=>((b-a+3*PI)%TAU)-PI;
const angle=(a,o,b)=>deg(Math.acos(clamp(dot(unit(sub(a,o)),unit(sub(b,o))),-1,1)));
const foot=(p,a,b)=>add(a,mul(sub(b,a),dot(sub(p,a),sub(b,a))/dot(sub(b,a),sub(b,a))));
const meet=(a,u,b,v)=>{const den=cross(u,v);return Math.abs(den)<1e-9?null:add(a,mul(u,cross(sub(b,a),v)/den));};
const fmt=(x,d=1)=>Number(x).toLocaleString('nl-NL',{minimumFractionDigits:d,maximumFractionDigits:d}),ang=x=>fmt(x)+'°',length=x=>fmt(x/40,2);
const roundedAngles=(arr,total)=>{const q=arr.map(x=>Math.round(x*10));let diff=Math.round(total*10)-q.reduce((a,b)=>a+b,0);const k=arr.indexOf(Math.max(...arr));q[k]+=diff;return q.map(x=>x/10);};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const control=(key,label,min,max,value,step=1,suffix='')=>({key,label,min,max,value,step,suffix});
function configuration(id){
 let c=[],pts=null;
 switch(id){
 case'angles':c=[control('turn','Draai de figuur',-70,70,0,1,'°')];break;
 case'vertical':c=[control('a','Snijhoek',25,150,55,1,'°')];break;
 case'parallel':c=[control('a','Snijlijn',30,80,58,1,'°'),control('tilt','Onderste lijn',-20,20,0,1,'°')];break;
 case'distance':c=[control('q','Punt Q',110,540,430),control('height','Hoogte P',65,240,170)];break;
 case'inequality':pts=[V(125,340),V(300,120),V(530,340)];break;
 case'perpbisector':c=[control('y','Positie P',75,405,105)];break;
 case'bisector':c=[control('a','Hoek van lijnen',35,135,70,1,'°'),control('t','Positie P',-155,155,110)];break;
 case'midparallel':c=[control('x','Positie P',110,530,360),control('gap','Tussenruimte',100,280,200)];break;
 case'circle':c=[control('r','Straal',85,170,150)];break;
 case'parabola':c=[control('x','Positie P',-195,195,145),control('p','Brandpuntsafstand',42,82,58)];break;
 case'triangleSum':case'exterior':case'circumcenter':case'incenter':case'orthocenter':case'centroid':pts=[V(125,350),V(475,350),V(330,105)];break;
 case'congruence':c=[control('turn','Draai tweede',-60,60,18,1,'°'),control('overlay','Leg op elkaar',0,100,0,1,'%')];break;
 case'similarity':c=[control('k','Schaalfactor',.6,1.5,1.25,.05,'×')];break;
 case'isosceles':c=[control('h','Hoogte',70,300,230),control('w','Halve basis',70,220,160)];break;
 case'equilateral':case'square':c=[control('size','Grootte',100,180,145),control('turn','Draai de figuur',-60,60,0,1,'°')];break;
 case'pythagoras':case'rightmidpoint':c=[control('a','Zijde a',2,5,3,.1),control('b','Zijde b',2,5,4,.1)];break;
 case'special45':case'special30':c=[control('size','Schaal',1,2.5,1.8,.05,'×')];break;
 case'quadSum':pts=[V(160,100),V(480,140),V(525,355),V(110,345)];break;
 case'parallelogram':c=[control('skew','Scheefstand',-100,100,65),control('h','Hoogte',110,260,210)];break;
 case'rhombus':c=[control('w','Halve diagonaal AC',80,215,180),control('h','Halve diagonaal BD',70,175,125)];break;
 case'rectangle':c=[control('w','Breedte',150,400,330),control('h','Hoogte',100,280,205)];break;
 case'chord':c=[control('a','Booghoek AB',25,335,125,1,'°')];break;
 case'equalArcs':c=[control('a','Beide booghoeken',25,135,80,1,'°')];break;
 case'chordperp':c=[control('h','Afstand tot M',25,150,90)];break;
 case'thales':break;
 case'circleangles':case'tangentchord':c=[control('sweep','Booghoek AB',45,155,110,1,'°')];break;
 case'constantangle':break;
 case'tangent':break;
 case'cyclic':break;
 }
 return {c,pts,values:Object.fromEntries(c.map(x=>[x.key,x.value])),theta:-.9,thetas:[rad(-145),rad(-40),rad(38),rad(133)],fraction:.50};
}
class Drawing{
 constructor(){this.parts=[];this.handles=[];this.rows=[];this.extent=[V(0,0),V(640,480)];this.metrics={};}
 line(a,b,c='ink',w=2.4,dash=false){this.parts.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${COL[c]||c}" stroke-width="${w}" ${dash?'stroke-dasharray="7 6"':''} stroke-linecap="round"/>`);}
 infinite(a,b,c='muted',w=1.5){const u=mul(unit(sub(b,a)),650);this.line(sub(a,u),add(a,u),c,w,true);}
 poly(ps,c='teal',opacity=.10,w=2.5){this.parts.push(`<polygon points="${ps.map(p=>p.x+','+p.y).join(' ')}" fill="${COL[c]}" fill-opacity="${opacity}" stroke="${COL[c]}" stroke-width="${w}" stroke-linejoin="round"/>`);}
 circle(o,r,c='muted',dash=false,fill=false){this.parts.push(`<circle cx="${o.x}" cy="${o.y}" r="${r}" fill="${fill?COL[c]:'none'}" fill-opacity=".055" stroke="${COL[c]}" stroke-width="2" ${dash?'stroke-dasharray="6 5"':''}/>`);}
 text(p,s,c='ink',cls='math-label',anchor='middle'){this.parts.push(`<text x="${p.x}" y="${p.y}" class="${cls}" style="fill:${COL[c]||c}" text-anchor="${anchor}" dominant-baseline="middle">${esc(s)}</text>`);}
 point(p,label='',offset=V(0,-18),c='ink'){this.parts.push(`<circle cx="${p.x}" cy="${p.y}" r="4" fill="${COL[c]}"/>`);if(label)this.text(add(p,offset),label,c);}
 handle(p,key,label,offset=V(0,-24)){this.handles.push({p,key,label});this.parts.push(`<g class="handle" tabindex="0" role="button" aria-label="Versleep punt ${esc(label)}; gebruik ook de pijltjestoetsen" data-key="${esc(key)}"><circle class="hit" cx="${p.x}" cy="${p.y}" r="22"/><circle class="halo" cx="${p.x}" cy="${p.y}" r="9"/><circle class="dot" cx="${p.x}" cy="${p.y}" r="3.2"/></g>`);this.text(add(p,offset),label);}
 arc(o,r,start,sweep,c='orange',width=3){const a=polar(o,r,start),b=polar(o,r,start+sweep);this.parts.push(`<path d="M ${a.x} ${a.y} A ${r} ${r} 0 ${Math.abs(sweep)>PI?1:0} ${sweep>0?1:0} ${b.x} ${b.y}" fill="none" stroke="${COL[c]}" stroke-width="${width}"/>`);}
 sector(o,r,start,sweep,c='orange',label=null,labelRadius=null){const a=polar(o,r,start),b=polar(o,r,start+sweep);this.parts.push(`<path d="M ${o.x} ${o.y} L ${a.x} ${a.y} A ${r} ${r} 0 ${Math.abs(sweep)>PI?1:0} ${sweep>0?1:0} ${b.x} ${b.y} Z" fill="${COL[c]}" fill-opacity=".15" stroke="${COL[c]}" stroke-width="1.5"/>`);if(label!==null)this.text(polar(o,labelRadius||r+18,start+sweep/2),label,c,'measure');}
 angle(a,o,b,c='orange',label=null,r=32){const start=arg(o,a),s=delta(start,arg(o,b));this.sector(o,r,start,s,c,label);}
 right(a,o,b,c='ink',r=13){const u=mul(unit(sub(a,o)),r),v=mul(unit(sub(b,o)),r);this.line(add(o,u),add(add(o,u),v),c,1.5);this.line(add(add(o,u),v),add(o,v),c,1.5);}
 tick(a,b,count=1,c='ink'){const m=mid(a,b),u=unit(sub(b,a)),v=mul(perp(u),6);for(let i=0;i<count;i++){const p=add(m,mul(u,(i-(count-1)/2)*6));this.line(sub(p,v),add(p,v),c,2);}}
 measure(a,b,text,c='ink',offset=18){const m=add(mid(a,b),mul(perp(unit(sub(b,a))),offset));this.text(m,text,c,'measure');}
 eq(label,value,c='teal'){this.rows.push(`<div class="equation ${c}"><div class="eq-label">${label}</div><div class="eq-value">${value}</div></div>`);}
 mini(items){this.rows.push(`<div class="mini-values">${items.map(x=>`<span>${x}</span>`).join('')}</div>`);}
 fit(ps,pad=70){this.extent.push(...ps.flatMap(p=>[sub(p,V(pad,pad)),add(p,V(pad,pad))]));}
 finish(){const xs=this.extent.map(p=>p.x),ys=this.extent.map(p=>p.y),x=Math.min(...xs),y=Math.min(...ys);return {svg:this.parts.join(''),rows:this.rows.join(''),handles:this.handles,viewBox:[x,y,Math.max(...xs)-x,Math.max(...ys)-y].join(' '),metrics:this.metrics};}
}
const CENTER=V(320,235),RADIUS=170;
function scene(id,state,variant=0,showConsequence=false){
 const d=new Drawing(),v=state.values,O=CENTER,r=RADIUS;
 const handles=(ps,labels)=>{const m=mul(ps.reduce(add,V(0,0)),1/ps.length);ps.forEach((p,i)=>d.handle(p,'p'+i,labels[i],mul(unit(sub(p,m)),24)));};
 if(id==='angles'){
 const t=rad(v.turn),a=polar(O,190,t+PI),b=polar(O,190,t),c=polar(O,170,t-PI/2);
 d.sector(O,72,t-PI,PI,'teal');d.line(a,b);d.line(O,c,'burgundy');d.right(a,O,c,'burgundy',20);d.right(c,O,b,'orange',20);d.text(polar(O,102,t-PI*.75),'90°','burgundy');d.text(polar(O,102,t-PI*.25),'90°','orange');[a,b,c].forEach((p,i)=>d.point(p,['A','B','C'][i]));d.point(O,'O',V(0,23));d.eq('Gestrekte hoek','<strong>180°</strong>');d.eq('Twee rechte hoeken','90° + 90° = <strong>180°</strong>','burgundy');
 }else if(id==='vertical'){
 const a=rad(v.a),p=V(90,235),q=V(550,235),b=polar(O,200,-a),bb=polar(O,200,PI-a);
 d.line(p,q);d.line(b,bb);d.sector(O,48,-a,a,'burgundy',ang(v.a));d.sector(O,48,PI-a,a,'burgundy',ang(v.a));d.sector(O,37,0,PI-a,'teal',ang(180-v.a),68);d.sector(O,37,PI,PI-a,'teal',ang(180-v.a),68);d.point(O,'O',V(0,25));d.eq('Overstaande hoeken',`${ang(v.a)} = <strong>${ang(v.a)}</strong>`,'burgundy');d.eq('Het andere paar',`${ang(180-v.a)} = <strong>${ang(180-v.a)}</strong>`);d.mini([`${ang(v.a)} + ${ang(180-v.a)} = 180°`]);
 }else if(id==='parallel'){
 const t=-rad(v.a),tilt=-rad(v.tilt),u=V(Math.cos(t),Math.sin(t)),a=V(360,155),b=V(360-160/Math.tan(rad(v.a)),315),p=polar(b,230,tilt),q=polar(b,230,tilt+PI);
 d.line(V(85,155),V(555,155),'ink');d.line(p,q,'ink');d.line(sub(a,mul(u,285)),add(a,mul(u,95)),'muted');
 if(!variant){d.sector(a,43,t,-t,'burgundy',ang(v.a));d.sector(b,43,t,rad(v.a-v.tilt),'teal',ang(v.a-v.tilt));}else{d.sector(a,43,t+PI,rad(v.a),'burgundy',ang(v.a));d.sector(b,43,t,rad(v.a-v.tilt),'teal',ang(v.a-v.tilt));}
 d.text(V(555,137),'l');d.text(add(p,V(0,-18)),'m');d.point(a,'S',V(0,-20));d.point(b,'T',V(0,25));
 d.eq(variant?'Z-hoeken':'F-hoeken',`${ang(v.a)} ${v.tilt===0?'=':'≠'} <strong>${ang(v.a-v.tilt)}</strong>`,'burgundy');d.eq('Ligging van l en m',v.tilt===0?'<strong>Evenwijdig</strong>':'<strong>Niet evenwijdig</strong>');d.mini([v.tilt===0?'Kanteling: 0°':`Kanteling: ${ang(v.tilt)}`]);
 }else if(id==='distance'){
 const a=V(75,355),b=V(565,355),h=V(230,355),p=V(230,355-v.height),q=V(v.q,355);
 d.line(a,b);d.line(p,h,'teal',3);d.line(p,q,'orange',3);d.right(p,h,b,'teal');d.point(h,'H',V(0,23));d.point(p,'P');d.handle(q,'q','Q',V(0,25));d.text(V(560,378),'l');d.eq('Afstand P tot l = PH',`<strong>${length(dist(p,h))}</strong>`);d.eq('Schuine verbinding PQ',`<strong>${length(dist(p,q))}</strong>`,'orange');d.mini(['PQ ≥ PH','Lengtes in dezelfde eenheid']);d.metrics={a:dist(p,h),b:dist(p,q)};
 }else if(id==='inequality'){
 const[a,b,c]=state.pts;d.poly([a,b,c]);d.line(a,b,'burgundy',3.5);d.line(b,c,'orange',3.5);d.line(a,c,'teal',3.5);handles([a,b,c],['A','B','C']);d.measure(a,b,length(dist(a,b)),'burgundy',-20);d.measure(b,c,length(dist(b,c)),'orange',-20);d.measure(a,c,length(dist(a,c)),'teal');d.eq('Via B: AB + BC',`${length(dist(a,b))} + ${length(dist(b,c))}<br>= <strong>${length(dist(a,b)+dist(b,c))}</strong>`,'burgundy');d.eq('Rechtstreeks: AC',`<strong>${length(dist(a,c))}</strong>`);d.mini([`De omweg is ${length(dist(a,b)+dist(b,c)-dist(a,c))} langer.`]);d.metrics={sum:dist(a,b)+dist(b,c),direct:dist(a,c)};
 }else if(id==='perpbisector'){
 const a=V(160,290),b=V(480,290),h=V(320,290),p=V(320,v.y);d.line(a,b);d.line(V(320,45),V(320,430),'teal',2,true);d.line(p,a,'burgundy',3);d.line(p,b,'orange',3);d.right(a,h,V(320,100),'teal');d.tick(a,h);d.tick(h,b);d.point(a,'A',V(-20,15));d.point(b,'B',V(20,15));d.point(h,'M',V(20,15));d.handle(p,'locus','P',V(23,0));d.eq('Afstanden tot A en B',`${length(dist(p,a))} = <strong>${length(dist(p,b))}</strong>`,'burgundy');d.eq('M is het midden',`AM = MB = <strong>4,00</strong>`);d.metrics={a:dist(p,a),b:dist(p,b)};
 }else if(id==='bisector'){
 const a=rad(v.a/2),u=V(Math.cos(a),Math.sin(a)),w=V(Math.cos(a),-Math.sin(a)),p=add(O,variant?V(0,v.t):V(v.t,0)),h=foot(p,O,add(O,u)),j=foot(p,O,add(O,w));
 d.line(sub(O,mul(u,240)),add(O,mul(u,240)));d.line(sub(O,mul(w,240)),add(O,mul(w,240)));d.line(V(60,O.y),V(580,O.y),'teal',1.7,true);d.line(V(O.x,35),V(O.x,435),'teal',1.7,true);d.line(p,h,'burgundy',3);d.line(p,j,'orange',3);d.right(p,h,add(h,mul(u,50)),'burgundy');d.right(p,j,add(j,mul(w,50)),'orange');d.sector(O,47,-a,a,'blue',ang(v.a/2),68);d.sector(O,47,0,a,'blue',ang(v.a/2),68);d.point(O,'O',V(-17,22));d.handle(p,'locus','P',V(20,-18));d.point(h,'H',V(17,13));d.point(j,'K',V(17,-13));d.eq('Loodrechte afstanden',`${length(dist(p,h))} = <strong>${length(dist(p,j))}</strong>`,'burgundy');d.eq('De gehalveerde hoek',`${ang(v.a/2)} + ${ang(v.a/2)}<br>= <strong>${ang(v.a)}</strong>`,'blue');d.metrics={a:dist(p,h),b:dist(p,j)};
 }else if(id==='midparallel'){
 const y1=235-v.gap/2,y2=235+v.gap/2,p=V(v.x,235),h=V(v.x,y1),j=V(v.x,y2);[y1,y2].forEach((y,i)=>{d.line(V(70,y),V(570,y));d.text(V(570,y-17),i?'m':'l');});d.line(V(70,235),V(570,235),'teal',2,true);d.line(h,j,'burgundy',3);d.right(p,h,V(570,y1));d.right(p,j,V(570,y2));d.handle(p,'locus','P',V(20,0));d.point(h,'H');d.point(j,'K',V(0,22));d.eq('Afstanden tot l en m',`${length(v.gap/2)} = <strong>${length(v.gap/2)}</strong>`,'burgundy');d.eq('Afstand tussen l en m',`<strong>${length(v.gap)}</strong>`);
 }else if(id==='circle'){
 const p=polar(O,v.r,state.theta);d.circle(O,v.r,'teal',false,true);d.line(O,p,'burgundy',3);d.point(O,'M',V(-20,0));d.handle(p,'theta','P',mul(unit(sub(p,O)),25));d.measure(O,p,'r','burgundy');d.eq('De vaste afstand MP',`MP = r = <strong>${length(v.r)}</strong>`,'burgundy');d.eq('Plaats van P','<strong>Op de cirkel</strong>');
 }else if(id==='parabola'){
 const base=V(320,285),f=add(base,V(0,-v.p)),lY=base.y+v.p,p=add(base,V(v.x,-v.x*v.x/(4*v.p))),q=V(p.x,lY);let ps=[];for(let x=-220;x<=220;x+=3)ps.push(add(base,V(x,-x*x/(4*v.p))));d.parts.push(`<polyline points="${ps.map(p=>p.x+','+p.y).join(' ')}" fill="none" stroke="${COL.teal}" stroke-width="3"/>`);d.line(V(60,lY),V(580,lY));d.line(p,f,'burgundy',3);d.line(p,q,'orange',3);d.right(p,q,V(580,lY),'orange');d.line(V(320,30),V(320,420),'muted',1.2,true);d.point(f,'F',V(-20,0));d.point(q,'Q',V(0,22));d.handle(p,'locus','P',V(15,-20));d.text(V(565,lY+23),'l');d.text(V(110,lY+23),'richtlijn','muted','small-label');d.eq('Afstand tot brandpunt F',`PF = <strong>${length(dist(p,f))}</strong>`,'burgundy');d.eq('Afstand tot richtlijn l',`PQ = <strong>${length(dist(p,q))}</strong>`,'orange');d.metrics={a:dist(p,f),b:dist(p,q)};
 }else if(['triangleSum','exterior','circumcenter','incenter','orthocenter','centroid'].includes(id)){
 const ps=state.pts,[a,b,c]=ps,rawAngles=ps.map((p,i)=>angle(ps[(i+1)%3],p,ps[(i+2)%3])),angles=roundedAngles(rawAngles,180),largestAngle=Math.max(...rawAngles);d.poly(ps,'teal',.06);
 if(id==='triangleSum'||id==='exterior'){
 ps.forEach((p,i)=>d.angle(ps[(i+1)%3],p,ps[(i+2)%3],['burgundy','teal','blue'][i],ang(angles[i]),29));
 if(id==='triangleSum'){d.eq('De drie binnenhoeken',`${ang(angles[0])} + ${ang(angles[1])}<br>+ ${ang(angles[2])} = <strong>180°</strong>`,'burgundy');d.eq('Verandering en behoud', 'De hoeken.<br><strong>De som blijft gelijk.</strong>');}
 else{const e=add(b,mul(unit(sub(b,a)),105));d.line(b,e,'orange',2.5,true);d.angle(e,b,c,'orange',ang(180-angles[1]),58);d.eq('Buitenhoek bij B',`<strong>${ang(180-angles[1])}</strong>`,'orange');d.eq('Binnenhoeken bij A en C',`${ang(angles[0])} + ${ang(angles[2])}<br>= <strong>${ang(180-angles[1])}</strong>`,'burgundy');d.fit([e],35);}
 d.metrics={sum:ps.reduce((s,p,i)=>s+angle(ps[(i+1)%3],p,ps[(i+2)%3]),0)};
 }else if(id==='centroid'){
 const z=mul(add(add(a,b),c),1/3),mids=[mid(b,c),mid(c,a),mid(a,b)];ps.forEach((p,i)=>{d.line(p,mids[i],i===0?'burgundy':'teal',2.5);d.tick(ps[(i+1)%3],mids[i],i+1);d.tick(mids[i],ps[(i+2)%3],i+1);});d.point(z,'Z',V(15,20),'burgundy');d.point(mids[0],'D',V(20,5));d.eq('Vanaf hoekpunt A',`${length(dist(a,z))} : ${length(dist(z,mids[0]))}<br>= <strong>2 : 1</strong>`,'burgundy');d.eq('Op alle zwaartelijnen','AZ = <strong>⅔ AD</strong>');d.metrics={ratio:dist(a,z)/dist(z,mids[0])};
 }else if(id==='circumcenter'){
 const mids=[mid(a,b),mid(b,c),mid(c,a)],m=meet(mids[0],perp(sub(b,a)),mids[1],perp(sub(c,b))),rr=dist(m,a);d.circle(m,rr,'muted',true);ps.forEach((p,i)=>{const q=ps[(i+1)%3],mi=mid(p,q);d.infinite(mi,add(mi,perp(sub(q,p))),'teal');d.line(mi,m,'teal',1.5,true);d.right(p,mi,add(mi,perp(sub(q,p))),'teal');d.line(m,p,['burgundy','orange','blue'][i],2,true);});d.point(m,'M',V(19,17),'burgundy');d.fit([V(m.x-rr,m.y-rr),V(m.x+rr,m.y+rr)],30);d.eq('Stralen van de omgeschreven cirkel',`MA = MB = MC<br>= <strong>${length(rr)}</strong>`,'burgundy');d.eq('Plaats van M',largestAngle>90+1e-7?'<strong>Buiten de driehoek</strong>':Math.abs(largestAngle-90)<1e-7?'<strong>Op de hypotenusa</strong>':'<strong>Binnen de driehoek</strong>');d.metrics={a:dist(m,a),b:dist(m,b),c:dist(m,c)};
 }else if(id==='incenter'){
 const la=dist(b,c),lb=dist(c,a),lc=dist(a,b),ic=mul(add(add(mul(a,la),mul(b,lb)),mul(c,lc)),1/(la+lb+lc)),rr=dist(ic,foot(ic,a,b));d.circle(ic,rr,'teal');ps.forEach((p,i)=>{const hit=meet(p,sub(ic,p),ps[(i+1)%3],sub(ps[(i+2)%3],ps[(i+1)%3]));d.line(p,hit,'blue',1.7,true);const h=foot(ic,p,ps[(i+1)%3]);d.line(ic,h,'burgundy',3);d.right(ic,h,p,'burgundy',9);});d.point(ic,'I',V(17,15),'burgundy');d.eq('Afstand I tot elke zijde',`r = <strong>${length(rr)}</strong>`,'burgundy');d.eq('Plaats van I','<strong>Altijd binnen</strong>');d.metrics={a:dist(ic,foot(ic,a,b)),b:dist(ic,foot(ic,b,c)),c:dist(ic,foot(ic,c,a))};
 }else{
 const h=meet(a,perp(sub(c,b)),b,perp(sub(c,a))),feet=ps.map((p,i)=>foot(p,ps[(i+1)%3],ps[(i+2)%3]));ps.forEach((p,i)=>{const f=feet[i],q=ps[(i+1)%3],e=ps[(i+2)%3];d.line(f,q,'muted',1.5,true);d.line(f,e,'muted',1.5,true);const candidates=[p,f,h].sort((x,y)=>dot(x,unit(perp(sub(e,q))))-dot(y,unit(perp(sub(e,q)))));d.line(candidates[0],candidates[2],['burgundy','teal','blue'][i],2.1);d.right(p,f,q,['burgundy','teal','blue'][i]);});d.point(h,'H',V(18,-17),'burgundy');d.fit([h,...feet],65);d.eq('Hoek met overstaande lijn','<strong>90° · 90° · 90°</strong>','burgundy');d.eq('Plaats van H',largestAngle>90+1e-7?'<strong>Buiten de driehoek</strong>':Math.abs(largestAngle-90)<1e-7?'<strong>Op het rechte hoekpunt</strong>':'<strong>Binnen de driehoek</strong>');d.metrics={dots:ps.map((p,i)=>dot(sub(h,p),sub(ps[(i+2)%3],ps[(i+1)%3])))};
 }
 handles(ps,['A','B','C']);
 }else if(id==='congruence'||id==='similarity'){
 const isC=id==='congruence',criterion=(isC?['HZH','ZHH','ZHZ','ZZZ','ZZR']:['hh','zhz','zzz','zzr'])[variant],right=criterion==='ZZR'||criterion==='zzr',base=right?[V(-65,55),V(80,55),V(-65,-60)]:[V(-83,65),V(90,65),V(-30,-75)],o1=V(170,235),k=isC?1:v.k,t=isC?rad(v.turn)*(1-v.overlay/100):rad(-15),o2=isC?V(460+(170-460)*v.overlay/100,235):V(460,235),rotate=(p,ang)=>V(p.x*Math.cos(ang)-p.y*Math.sin(ang),p.x*Math.sin(ang)+p.y*Math.cos(ang)),ps=base.map(p=>add(o1,p)),qs=base.map(p=>add(o2,mul(rotate(p,t),k)));
 let sideIdx=[],angleIdx=[];
 if(criterion==='HZH'){sideIdx=[0];angleIdx=[0,1];}if(criterion==='ZHH'){sideIdx=[0];angleIdx=[0,2];}if(criterion==='ZHZ'||criterion==='zhz'){sideIdx=[0,2];angleIdx=[0];}if(criterion==='ZZZ'||criterion==='zzz')sideIdx=[0,1,2];if(criterion==='hh')angleIdx=[0,1];if(right){sideIdx=[0,1];angleIdx=[0];}
 if(isC){
 const sideOrder=[...sideIdx,...[0,1,2].filter(i=>!sideIdx.includes(i))];
 const visibleSides=showConsequence?[0,1,2]:sideIdx,visibleAngles=showConsequence?[0,1,2]:angleIdx;
 [ps,qs].forEach((arr,j)=>{
 d.poly(arr,'muted',.035,1.8);
 visibleSides.forEach(i=>{const col=sideIdx.includes(i)?'burgundy':'blue';d.line(arr[i],arr[(i+1)%3],col,3.2);d.tick(arr[i],arr[(i+1)%3],sideOrder.indexOf(i)+1,col);});
 visibleAngles.forEach(i=>{const col=angleIdx.includes(i)?'burgundy':'blue',p=arr[i],a=arr[(i+1)%3],b=arr[(i+2)%3];
 if(right&&i===0)d.right(a,p,b,col,16);
 else{d.angle(a,p,b,col,ang(angle(a,p,b)),25);for(let n=0;n<i;n++)d.arc(p,21-n*4,arg(p,a),delta(arg(p,a),arg(p,b)),col,1.5);}
 });
 const center=mul(arr.reduce(add,V(0,0)),1/3);arr.forEach((p,i)=>d.point(p,(j?['D','E','F']:['A','B','C'])[i],mul(unit(sub(p,center)),22)));
 });
 const sides=['AB = DE','BC = EF','CA = FD'],angles=['∠A = ∠D','∠B = ∠E','∠C = ∠F'];
 d.eq('Gegeven · '+criterion,[...sideIdx.map(i=>sides[i]),...angleIdx.map(i=>angles[i]+(right&&i===0?' = 90°':''))].join('<br>'),'burgundy');
 if(showConsequence){d.eq('Dus · congruente driehoeken','<strong>△ABC ≅ △DEF</strong>');d.eq('Daaruit volgt óók',[...[0,1,2].filter(i=>!sideIdx.includes(i)).map(i=>sides[i]),...[0,1,2].filter(i=>!angleIdx.includes(i)).map(i=>angles[i])].join('<br>'),'blue');}
 d.mini(['A ↔ D · B ↔ E · C ↔ F']);
 d.metrics={givenSides:sideIdx.slice(),givenAngles:angleIdx.slice(),markedSides:visibleSides.slice(),markedAngles:visibleAngles.slice()};
 }else{
 [ps,qs].forEach((arr,j)=>{d.poly(arr,j?'orange':'teal',.065);sideIdx.forEach(i=>{d.line(arr[i],arr[(i+1)%3],j?'orange':'teal',4);if(isC)d.tick(arr[i],arr[(i+1)%3],i+1,j?'orange':'teal');});angleIdx.forEach(i=>{if(right&&i===0)d.right(arr[1],arr[0],arr[2],j?'orange':'teal',16);else d.angle(arr[(i+1)%3],arr[i],arr[(i+2)%3],j?'orange':'teal',ang(angle(arr[(i+1)%3],arr[i],arr[(i+2)%3])),25);});const center=mul(arr.reduce(add,V(0,0)),1/3);arr.forEach((p,i)=>d.point(p,(j?['D','E','F']:['A','B','C'])[i],mul(unit(sub(p,center)),22)));});
 d.eq(isC?'Congruentiekenmerk':'Gelijkvormigheidskenmerk',`<strong>${criterion}</strong>`);if(isC)d.eq('Corresponderende zijden','AB = DE<br>BC = EF<br>CA = FD','orange');else d.eq('Drie gelijke verhoudingen',`DE/AB = EF/BC = FD/CA<br>= <strong>${fmt(k,2)}</strong>`,'orange');d.mini(['A ↔ D · B ↔ E · C ↔ F']);d.metrics={ratios:ps.map((p,i)=>dist(qs[i],qs[(i+1)%3])/dist(p,ps[(i+1)%3]))};
 }
 }else if(id==='isosceles'||id==='equilateral'){
 let ps;if(id==='isosceles')ps=[V(320-v.w,375),V(320+v.w,375),V(320,375-v.h)];else ps=[polar(O,v.size,rad(150+v.turn)),polar(O,v.size,rad(30+v.turn)),polar(O,v.size,rad(-90+v.turn))];const[a,b,c]=ps;d.poly(ps);ps.forEach((p,i)=>{d.angle(ps[(i+1)%3],p,ps[(i+2)%3],i===2?'orange':'burgundy',ang(angle(ps[(i+1)%3],p,ps[(i+2)%3])),30);d.point(p,['A','B','C'][i],mul(unit(sub(p,O)),25));});d.tick(a,c,1,'burgundy');d.tick(b,c,1,'burgundy');if(id==='equilateral')d.tick(a,b,1,'burgundy');d.eq('Gelijke zijden',id==='isosceles'?`AC = BC = <strong>${length(dist(a,c))}</strong>`:`AB = BC = CA<br>= <strong>${length(dist(a,b))}</strong>`,'burgundy');d.eq('Gelijke hoeken',id==='isosceles'?`∠A = ∠B = <strong>${ang(angle(b,a,c))}</strong>`:'∠A = ∠B = ∠C = <strong>60°</strong>');d.metrics={a:dist(a,c),b:dist(b,c)};
 }else if(['pythagoras','rightmidpoint','special45','special30'].includes(id)){
 let aa,bb;if(id==='special45'){aa=bb=v.size*90;}else if(id==='special30'){aa=v.size*65;bb=aa*Math.sqrt(3);}else{aa=v.a*40;bb=v.b*40;}
 const c=V(240,300),a=add(c,V(0,-aa)),b=add(c,V(bb,0)),hyp=dist(a,b),ps=[a,b,c];d.poly(ps,'teal',.10);d.right(a,c,b,'ink',18);
 if(id==='pythagoras'){
 [[c,a,'burgundy'],[b,c,'orange'],[a,b,'teal']].forEach(([p,q,col])=>{const u=mul(perp(sub(q,p)),-1),z=add(q,u),w=add(p,u);d.poly([p,q,z,w],col,.12,2);d.text(mul(add(add(p,q),add(z,w)),.25),fmt(dist(p,q)**2/1600,2),col,'measure');d.fit([z,w],40);});
 d.eq('De twee kleine vierkanten',`${fmt(v.a**2,2)} + ${fmt(v.b**2,2)}<br>= <strong>${fmt(v.a**2+v.b**2,2)}</strong>`,'burgundy');d.eq('Het grote vierkant',`c² = <strong>${fmt(hyp**2/1600,2)}</strong>`);d.mini([`a = ${fmt(v.a,2)}`,`b = ${fmt(v.b,2)}`,`c ≈ ${fmt(hyp/40,3)}`]);
 }else if(id==='rightmidpoint'){
 const m=mid(a,b);d.circle(m,hyp/2,'muted',true);d.line(c,m,'burgundy',3);d.point(m,'M',V(18,-10),'burgundy');d.tick(a,m,1);d.tick(m,b,1);d.eq('Van de rechte hoek naar M',`CM = <strong>${length(dist(c,m))}</strong>`,'burgundy');d.eq('De halve hypotenusa',`AM = MB = ½ AB<br>= <strong>${length(hyp/2)}</strong>`);d.fit([V(m.x-hyp/2,m.y-hyp/2),V(m.x+hyp/2,m.y+hyp/2)],40);
 }else{
 const aAngle=angle(b,a,c),bAngle=angle(a,b,c);d.angle(b,a,c,'burgundy',ang(aAngle),35);d.angle(a,b,c,'orange',ang(bAngle),35);
 if(id==='special30'){const mirror=add(c,V(0,aa));d.line(a,mirror,'muted',2,true);d.line(mirror,b,'muted',2,true);d.fit([mirror],35);}
 d.measure(a,c,'1','burgundy',20);d.measure(c,b,id==='special45'?'1':'√3','orange',20);d.measure(a,b,id==='special45'?'√2':'2','teal',-18);
 d.eq('De scherpe hoeken',`${ang(aAngle)} en <strong>${ang(bAngle)}</strong>`,'burgundy');d.eq('Verhouding van de zijden',id==='special45'?'<strong>1 : 1 : √2</strong>':'<strong>1 : √3 : 2</strong>');d.mini(['Getallen bij zijden geven de verhouding aan.']);
 }
 d.point(a,'A',V(0,-23));d.point(b,'B',V(25,0));d.point(c,'C',V(-22,18));if(!id.startsWith('special')){d.measure(a,c,'a','burgundy',20);d.measure(c,b,'b','orange',18);d.measure(a,b,'c','teal',-16);}d.fit(ps,35);d.metrics={squareDiff:aa*aa+bb*bb-hyp*hyp,midDiff:dist(c,mid(a,b))-hyp/2};
 }else if(['quadSum','parallelogram','rhombus','rectangle','square'].includes(id)){
 let ps;if(id==='quadSum')ps=state.pts;if(id==='parallelogram'){const a=V(175-v.skew/2,235-v.h/2),b=add(a,V(290,0)),dd=add(a,V(v.skew,v.h));ps=[a,b,add(b,V(v.skew,v.h)),dd];}if(id==='rhombus')ps=[add(O,V(-v.w,0)),add(O,V(0,-v.h)),add(O,V(v.w,0)),add(O,V(0,v.h))];if(id==='rectangle')ps=[add(O,V(-v.w/2,-v.h/2)),add(O,V(v.w/2,-v.h/2)),add(O,V(v.w/2,v.h/2)),add(O,V(-v.w/2,v.h/2))];if(id==='square')ps=[0,1,2,3].map(i=>polar(O,v.size,rad(-135+i*90+v.turn)));
 const[a,b,c,dd]=ps,z=meet(a,sub(c,a),b,sub(dd,b)),angles=roundedAngles(ps.map((p,i)=>angle(ps[(i+3)%4],p,ps[(i+1)%4])),360);d.poly(ps,'teal',.08);d.line(a,c,'burgundy',1.8,true);if(id!=='quadSum')d.line(b,dd,'orange',1.8,true);
 ps.forEach((p,i)=>{if(id==='rectangle'||id==='square')d.right(ps[(i+3)%4],p,ps[(i+1)%4],'teal',16);else if(id==='rhombus'){d.angle(ps[(i+3)%4],p,z,'burgundy',i%2===0?ang(angles[i]/2):null,37);d.angle(z,p,ps[(i+1)%4],'orange',i%2===0?ang(angles[i]/2):null,25);}else d.angle(ps[(i+3)%4],p,ps[(i+1)%4],i%2?'orange':'burgundy',ang(angles[i]),29);if(id!=='quadSum')d.point(p,['A','B','C','D'][i],mul(unit(sub(p,O)),25));});
 if(id==='quadSum'){handles(ps,['A','B','C','D']);d.eq('De vier binnenhoeken',`${ang(angles[0])} + ${ang(angles[1])}<br>+ ${ang(angles[2])} + ${ang(angles[3])}<br>= <strong>360°</strong>`,'burgundy');d.eq('Twee driehoeken','180° + 180° = <strong>360°</strong>');}
 if(id==='parallelogram'){d.point(z,'S',V(0,20));d.eq('Overstaande zijden',`AB = CD = <strong>${length(dist(a,b))}</strong><br>BC = DA = <strong>${length(dist(b,c))}</strong>`);d.eq('Diagonalen in tweeën',`AS = SC = <strong>${length(dist(a,z))}</strong><br>BS = SD = <strong>${length(dist(b,z))}</strong>`,'burgundy');d.mini([`∠A = ∠C = ${ang(angles[0])}`,`∠B = ∠D = ${ang(angles[1])}`]);}
 if(id==='rhombus'){ps.forEach((p,i)=>d.tick(p,ps[(i+1)%4],1,'teal'));d.right(a,z,b,'ink',15);d.point(z,'S',V(18,20));d.eq('Vier gelijke zijden',`AB = BC = CD = DA<br>= <strong>${length(dist(a,b))}</strong>`);d.eq('Snijhoek van de diagonalen','<strong>90°</strong>','burgundy');d.mini([`∠A wordt ${ang(angles[0]/2)} + ${ang(angles[0]/2)}`]);}
 if(id==='rectangle'||id==='square'){d.point(z,'S',V(0,20));d.eq('Vier rechte hoeken','<strong>4 × 90° = 360°</strong>');d.eq('Gelijke diagonalen',`AC = BD<br>= <strong>${length(dist(a,c))}</strong>`,'burgundy');if(id==='square'){ps.forEach((p,i)=>d.tick(p,ps[(i+1)%4],1,'teal'));d.mini([`Alle zijden: ${length(dist(a,b))}`,'Diagonalen staan loodrecht.']);}}
 d.metrics={angleSum:ps.reduce((s,p,i)=>s+angle(ps[(i+3)%4],p,ps[(i+1)%4]),0),sideLengths:ps.map((p,i)=>dist(p,ps[(i+1)%4])),diagonals:[dist(a,c),dist(b,dd)]};
 }else if(id==='cyclic'){
 const ps=state.thetas.map(t=>polar(O,r,t)),raw=ps.map((p,i)=>angle(ps[(i+3)%4],p,ps[(i+1)%4])),a=Math.round(raw[0]*10)/10,b=Math.round(raw[1]*10)/10,as=[a,b,180-a,180-b];d.circle(O,r,'muted');d.poly(ps,'teal',.12);ps.forEach((p,i)=>{d.angle(ps[(i+3)%4],p,ps[(i+1)%4],i%2?'orange':'burgundy',ang(as[i]),27);});d.point(O,'M',V(0,20));ps.forEach((p,i)=>d.handle(p,'cyc'+i,['A','B','C','D'][i],mul(unit(sub(p,O)),27)));d.eq('∠A + ∠C',`${ang(as[0])} + ${ang(as[2])}<br>= <strong>180°</strong>`,'burgundy');d.eq('∠B + ∠D',`${ang(as[1])} + ${ang(as[3])}<br>= <strong>180°</strong>`,'orange');d.mini(['Alle vier hoekpunten liggen op de cirkel.']);d.metrics={ac:raw[0]+raw[2],bd:raw[1]+raw[3]};
 }else if(id==='chord'){
 const t=-PI/2,a=polar(O,r,t),b=polar(O,r,t+rad(v.a));d.circle(O,r);d.line(O,a,'muted',1.5,true);d.line(O,b,'muted',1.5,true);d.arc(O,r,t,rad(v.a),'orange',4);d.line(a,b,'burgundy',3);d.point(O,'M',V(-18,5));d.point(a,'A',V(0,-24));d.handle(b,'chord','B',mul(unit(sub(b,O)),26));d.eq('Lengte van de koorde AB',`<strong>${length(dist(a,b))}</strong>`,'burgundy');d.eq('Middellijn 2r',`<strong>${length(2*r)}</strong>`);d.mini([Math.abs(v.a-180)<.01?'AB gaat door M: een middellijn.':'AB gaat niet door M: geen middellijn.']);
 }else if(id==='equalArcs'){
 const sweep=rad(v.a),ts=[-PI*.92,-PI*.92+sweep,PI*.08,PI*.08+sweep],ps=ts.map(t=>polar(O,r,t));d.circle(O,r);d.arc(O,r,ts[0],sweep,'burgundy',5);d.arc(O,r,ts[2],sweep,'orange',5);d.line(ps[0],ps[1],'burgundy',3);d.line(ps[2],ps[3],'orange',3);ps.forEach((p,i)=>{d.line(O,p,'muted',1.3,true);d.point(p,['A','B','C','D'][i],mul(unit(sub(p,O)),24));});d.sector(O,35,ts[0],sweep,'burgundy',ang(v.a),62);d.sector(O,35,ts[2],sweep,'orange',ang(v.a),62);d.point(O,'M',V(-18,2));d.eq('De twee booghoeken',`${ang(v.a)} = <strong>${ang(v.a)}</strong>`,'orange');d.eq('De twee koorden',`${length(dist(ps[0],ps[1]))} = <strong>${length(dist(ps[2],ps[3]))}</strong>`,'burgundy');d.metrics={a:dist(ps[0],ps[1]),b:dist(ps[2],ps[3])};
 }else if(id==='chordperp'){
 const h=add(O,V(0,v.h)),w=Math.sqrt(r*r-v.h*v.h),a=add(h,V(-w,0)),b=add(h,V(w,0));d.circle(O,r);d.poly([O,a,b],'teal',.07);d.line(a,b,'burgundy',3);d.line(O,h,'orange',3);d.right(O,h,b,'orange');d.tick(a,h,1,'burgundy');d.tick(h,b,1,'burgundy');d.point(O,'M');d.point(a,'A',V(-22,0));d.point(b,'B',V(22,0));d.handle(h,'locus','H',V(0,24));d.eq('De twee helften van AB',`AH = HB = <strong>${length(w)}</strong>`,'burgundy');d.eq('Loodrechte afstand MH',`<strong>${length(v.h)}</strong>`,'orange');d.mini(['MA = MB = r']);
 }else if(id==='thales'){
 const a=add(O,V(-r,0)),b=add(O,V(r,0)),t=state.theta,c=polar(O,r,t);d.circle(O,r);d.poly([a,b,c]);d.line(a,b,'ink');d.right(a,c,b,'burgundy',19);d.text(add(c,mul(unit(sub(O,c)),52)),'90°','burgundy');d.point(O,'M',V(0,22));d.point(a,'A',V(-25,0));d.point(b,'B',V(25,0));d.handle(c,'theta','C',mul(unit(sub(c,O)),26));d.eq('De hoek tegenover AB',`∠ACB = <strong>${ang(angle(a,c,b))}</strong>`,'burgundy');d.eq('AB is een middellijn',`AB = 2r = <strong>${length(2*r)}</strong>`);d.metrics={angle:angle(a,c,b)};
 }else if(['circleangles','constantangle','tangentchord'].includes(id)){
 const sweep=rad(id==='constantangle'?110:v.sweep),start=PI/2-sweep/2,a=polar(O,r,start),b=polar(O,r,start+sweep);let ct;
 if(id==='circleangles'&&variant===1)ct=start+.12+state.fraction*(sweep-.24);else ct=start+sweep+.18+state.fraction*(TAU-sweep-.36);
 const c=polar(O,r,ct),theta=angle(a,c,b),major=id==='circleangles'&&variant===1,arcStart=major?start+sweep:start,arcSweep=major?TAU-sweep:sweep;
 d.circle(O,r);d.poly([a,b,c],'teal',.045);d.arc(O,r,arcStart,arcSweep,'orange',4);d.line(a,b,'teal',2.5);d.angle(a,c,b,'burgundy',ang(theta),33);
 if(id==='circleangles'){d.line(O,a,'orange',2);d.line(O,b,'orange',2);d.sector(O,43,arcStart,arcSweep,'orange',ang(deg(arcSweep)),66);d.eq('De omtrekshoek',`∠ACB = <strong>${ang(theta)}</strong>`,'burgundy');d.eq('De bijbehorende middelpuntshoek',`${ang(deg(arcSweep))} = <strong>2 × ${ang(theta)}</strong>`,'orange');d.mini([major?'De reflexhoek hoort bij de oranje boog.':'De oranje boog bevat C niet.']);d.metrics={central:deg(arcSweep),inscribed:theta};}
 if(id==='constantangle'){const dt=start+sweep+.32*(TAU-sweep),dd=polar(O,r,dt);d.line(a,dd,'orange',2);d.line(b,dd,'orange',2);d.angle(a,dd,b,'orange',ang(angle(a,dd,b)),26);d.point(dd,'D',mul(unit(sub(dd,O)),26));d.eq('Hoek bij het bewegende punt C',`∠ACB = <strong>${ang(theta)}</strong>`,'burgundy');d.eq('Hoek bij het vaste punt D',`∠ADB = <strong>${ang(angle(a,dd,b))}</strong>`,'orange');d.metrics={a:theta,b:angle(a,dd,b)};}
 if(id==='tangentchord'){const tangent=polar(a,170,start+PI/2),opposite=polar(a,145,start-PI/2);d.line(tangent,opposite,'orange',2.5);d.line(a,O,'muted',1.5,true);d.angle(tangent,a,b,'orange',ang(theta),46);d.right(O,a,tangent,'muted');d.eq('Tussen koorde AB en raaklijn',`<strong>${ang(angle(tangent,a,b))}</strong>`,'orange');d.eq('De bijbehorende omtrekshoek',`∠ACB = <strong>${ang(theta)}</strong>`,'burgundy');d.fit([tangent,opposite],28);d.metrics={a:angle(tangent,a,b),b:theta};}
 d.point(O,'M',V(0,-18));d.point(a,'A',mul(unit(sub(a,O)),27));d.point(b,'B',mul(unit(sub(b,O)),27));d.handle(c,'arcpoint','C',mul(unit(sub(c,O)),26));
 }else if(id==='tangent'){
 const t=state.theta,p=polar(O,r,t),u=V(-Math.sin(t),Math.cos(t)),a=sub(p,mul(u,150)),b=add(p,mul(u,150));d.circle(O,r);d.line(a,b,'orange',3);d.line(O,p,'burgundy',3);d.right(O,p,b,'burgundy',20);d.point(O,'M',V(-18,5));d.handle(p,'theta','T',mul(unit(sub(p,O)),25));d.eq('Straal en raaklijn',`<strong>${ang(angle(O,p,b))}</strong>`,'burgundy');d.eq('Gemeenschappelijke punten','<strong>Precies één: T</strong>','orange');d.fit([a,b],28);d.metrics={angle:angle(O,p,b)};
 }
 return d.finish();
}

/* Exact cyclic geometry on the chosen tent illustration. */
(()=>{
 const root=document.querySelector('.zone-stoicheia');if(!root)return;
 const poly=root.querySelector('[data-stoicheia-polygon]'),layer=root.querySelector('[data-stoicheia-points]');
 const base=[-145,-40,38,133].map(x=>x*Math.PI/180),amp=[.18,.21,.17,.20],phase=[0,.9,2,2.8];
 const dots=base.map((_,i)=>{const n=document.createElementNS('http://www.w3.org/2000/svg','circle');n.setAttribute('r','13');n.setAttribute('fill',i%2?'#aa4d0b':'#8b243b');layer.appendChild(n);return n;});
 let time=0,last=0,raf=0,visible=true;const motion=matchMedia('(prefers-reduced-motion: reduce)');
 function draw(){const pts=base.map((b,i)=>{const a=b+amp[i]*Math.sin(time*2*Math.PI/42+phase[i]);return [627+278*Math.cos(a),332+278*Math.sin(a)];});poly.setAttribute('points',pts.map(p=>p.join(',')).join(' '));pts.forEach((p,i)=>{dots[i].setAttribute('cx',p[0]);dots[i].setAttribute('cy',p[1]);});}
 function tick(now){if(last)time+=Math.min((now-last)/1000,.08);last=now;draw();raf=requestAnimationFrame(tick);}
 function sync(){cancelAnimationFrame(raf);last=0;if(visible&&!document.hidden&&!motion.matches)raf=requestAnimationFrame(tick);else draw();}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(root);
 document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);draw();
})();

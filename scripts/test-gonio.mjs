import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync(new URL('../public/rafelrand/sinus-s-en-de-geit/index.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1],ctx={};
vm.runInNewContext(script,ctx);const g=ctx.WisikGonioMath;
let checks=0;
const near=(a,b)=>{assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);checks++;};
for(let a=-1440;a<=1440;a+=13)for(let b=-720;b<=720;b+=17){
 const ar=g.rad(a),br=g.rad(b),u=g.vec(ar),v=g.vec(br),{m,d}=g.mid(ar,br),s=g.sum(m,d),f=g.diff(m,d);
 [0,1].forEach(i=>{near(s[i],u[i]+v[i]);near(f[i],u[i]-v[i]);});
 near(g.norm(s),2*Math.abs(Math.cos(d)));near(g.norm(f),2*Math.abs(Math.sin(d)));
 near(g.dot(g.vec(m),g.quarter(g.vec(m))),0);near(g.norm(g.quarter(u)),1);
 const r=g.rotate(u,br);near(r[0],Math.cos(ar+br));near(r[1],Math.sin(ar+br));
}
for(const t of [-Math.PI,-Math.PI/2,0,Math.PI/2,Math.PI]){
 near(g.norm(g.sum(.3,t)),2*Math.abs(Math.cos(t)));near(g.norm(g.diff(.3,t)),2*Math.abs(Math.sin(t)));
}
assert.equal(g.quarter([4,3]).join(','),'-3,4');assert.equal(g.quarter([5,12]).join(','),'-12,5');
near(g.sum(0,g.rad(120))[0],-1);near(g.sum(0,g.rad(90))[0],0);
assert.ok(!/<form\b/i.test(html));assert.ok(!/\beval\s*\(|new Function\b/.test(script));
assert.ok(!/https?:\/\/[^'\"]+\.js/.test(html));
assert.ok(html.includes('wisik.gonio.v1.checks'));
assert.ok(html.includes('2|cos d|')&&html.includes('2|sin d|'));
assert.ok(html.includes('nulvector')&&html.includes('cos a≠0'));
const rafel=fs.readFileSync(new URL('../public/rafelrand/index.html',import.meta.url),'utf8');
assert.ok(rafel.includes('href="/rafelrand/sinus-s-en-de-geit/"'));
assert.ok(rafel.includes('id="hbo-werkplaats"')&&rafel.includes('id="konijnenhol-zijpad"'));
console.log(`Gonio: ${checks} numerical assertions on production functions passed, including negative angles, multiple turns, null vectors and reversed directions. Navigation and privacy contracts passed.`);

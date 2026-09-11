/* One-time, idempotent static entrances. No runtime injection and no tool source edits. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const page='/rafelrand/konijnenhol/';
const style='<link rel="stylesheet" href="/rafelrand/konijnenhol/konijnenhol.css?v=1.0.0">';
const art='<span class="kh-burrow" aria-hidden="true"><span class="kh-ears"></span></span>';
const copy='<span class="kh-entry-copy"><strong>Konijnenhol</strong><small>Waarschuwing: dit is een konijnenhol.</small><em>Hoogstaand Diepgaan · Wiskundig-high door diep te gaan</em></span>';
const portal=`<a id="konijnenhol" class="kh-entry kh-entry--map" href="${page}" aria-label="Konijnenhol bij de Space-tent: Hoogstaand Diepgaan">${art}${copy}</a>\n\n      `;
const aside=`\n<section class="kh-sidepath" id="konijnenhol-zijpad" aria-labelledby="konijnenhol-zijpad-title"><h2 id="konijnenhol-zijpad-title">Een zijpad naast de Space-tent</h2><a class="kh-entry kh-entry--near" href="${page}">${art}${copy}</a><p>Een zelfstandige film buiten de leerroute van Ruimteklaar. Geen opgaven of voortgangsregistratie.</p></section>\n`;
function insert(source,needle,marker,addition){
  if(source.includes(marker))return source;
  if(source.split(needle).length!==2)throw new Error(`Verwacht precies één invoegpunt: ${needle}`);
  return source.replace(needle,addition+needle);
}
const targets=['public/index.html','public/rafelrand/index.html','public/rafelrand/space-tent/index.html'];
for(const rel of targets){
  const p=path.join(root,rel);let s=fs.readFileSync(p,'utf8');
  s=insert(s,'</head>','href="/rafelrand/konijnenhol/konijnenhol.css',style+'\n');
  s=rel==='public/index.html'
    ?insert(s,'<figure class="space-billboard space-billboard-map">','id="konijnenhol"',portal)
    :insert(s,'</main>','id="konijnenhol-zijpad"',aside);
  fs.writeFileSync(p,s);
}
const packagePath=path.join(root,'package.json');
const pkg=JSON.parse(fs.readFileSync(packagePath,'utf8'));
const guard='node scripts/test-konijnenhol.mjs --media';
if(!pkg.scripts.check.includes(guard)){pkg.scripts.check=guard+' && '+pkg.scripts.check;fs.writeFileSync(packagePath,JSON.stringify(pkg,null,2)+'\n')}
console.log('Drie statische ingangen aangebracht; bestaande tools, media en registers ongemoeid.');

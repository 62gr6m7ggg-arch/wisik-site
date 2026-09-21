// Mechanical version/count refresh for the public descriptions of this release.
import fs from 'node:fs';
const files=['space/index.html','review/index.html','../../public/assets/js/site-data.js','../../public/hbo/space-tent/index.html','../../public/backstage/space-tent/index.html','../../public/films/ruimteklaar/catalog.json'];
const d=JSON.parse(fs.readFileSync('app/content.json')),c=JSON.parse(fs.readFileSync('app/course-content.json'));
const qs=[...d.questions,...c.questions],bs=[...d.blocks,...c.blocks];
const variation=' Vanaf les 4 wissel je kubussen af met prisma’s, tetraëders, scheve en afgeknotte piramides en ingepaste balken, naar de vormvariatie van het HAN-huiswerk Ruimtemeetkunde 1.';
for(const file of files){
 let s=fs.readFileSync(file,'utf8').replaceAll('0.5.4','0.6.0');
 if(file.includes('/hbo/space-tent/'))s=s.replaceAll('draai kubussen, oefen met lijnen en vlakken en bouw een doorsnede','onderzoek kubussen, prisma’s en piramides, oefen met lijnen en vlakken en bouw een doorsnede').replace('Draai de kubus met je muis of vinger en ontdek wat er vanuit een ander aanzicht zichtbaar wordt.','Onderzoek kubussen, prisma’s, piramides en samengestelde figuren. Draai een oefenfiguur met je muis of vinger en ontdek wat er vanuit een ander aanzicht zichtbaar wordt.');
 s=s.replaceAll(variation,'').replace(/De hele bank bevat \d+ vragen, waaronder \d+ open rekenvragen\./,`De hele bank bevat ${qs.length} vragen, waaronder ${qs.filter(q=>q.type==='numeric').length} open rekenvragen.`+variation);
 s=s.replace(/De controle onderzoekt \d+ vragen, \d+ numerieke antwoorden en correcte afrondingen, \d+ theorie-inzichten en tien nieuwe constructietaken\./,`De controle onderzoekt ${qs.length} vragen, ${qs.filter(q=>q.type==='numeric').length} numerieke antwoorden en correcte afrondingen, ${bs.reduce((n,b)=>n+b.theory.length,0)} theorie-inzichten en tien constructietaken.`);
 fs.writeFileSync(file,s);
}

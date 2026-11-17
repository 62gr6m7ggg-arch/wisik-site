import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {paboScript,paboScriptReferences,paboHtmlPath} from './lib/pabo-source.mjs';
const html=fs.readFileSync(paboHtmlPath,'utf8');
new vm.Script(paboScript(html)); // Syntax only; do not evaluate the app or generate questions.
assert.match(html,/<html[^>]*lang="nl"/);
assert.match(html,/<meta name="viewport"/);
for(const source of paboScriptReferences(html)) {
  const local=source.startsWith('/')?'public'+source.split('?')[0]:path.join(path.dirname(paboHtmlPath),source.split('?')[0]);
  assert.ok(fs.existsSync(local),`Ontbrekend script: ${source}`);
  new vm.Script(fs.readFileSync(local,'utf8'),{filename:local});
}
assert.ok(paboScriptReferences(html).some(s=>s.startsWith('/assets/js/pabo-flirt-player.js?')));
for(const name of fs.readdirSync('src/pabo').filter(n=>n.endsWith('.css')))assert.ok(html.includes(fs.readFileSync('src/pabo/'+name,'utf8').trimEnd()),`Opmaakbron niet verwerkt: ${name}`);
console.log('Pabo-presentatie: scriptkoppelingen, syntax, mobiele instellingen en opmaak; nul rekenopgaven.');

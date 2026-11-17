import assert from 'node:assert/strict';
import fs from 'node:fs';
import {paboSourceManifest} from './lib/pabo-source.mjs';
const report=JSON.parse(fs.readFileSync('public/assets/data/pabo-release-audit.json','utf8'));
assert.equal(report.status,'passed','Geslaagd rekenbewijs ontbreekt');
assert.deepEqual(report.source,paboSourceManifest(process.cwd()),'Rekenbron of auditafhankelijkheid gewijzigd: vernieuw het rekenbewijs via de Pabo-vrijgavecontrole');
console.log('Bestaand rekenbewijs past bij de ongewijzigde rekenbron; nul rekenopgaven uitgevoerd.');

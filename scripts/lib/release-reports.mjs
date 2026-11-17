import assert from 'node:assert/strict';
export const generatedReports=['public/assets/data/pabo-release-audit.json','public/assets/data/ruimteklaar-release-audit.json'];
export function validateReportChanges(paths,result) {
  assert.equal(result.status,'passed','Geen geslaagde vrijgave om vast te leggen');
  for(const p of paths) {
    assert.ok(generatedReports.includes(p),`Controle wijzigde een ander bestand dan het vrijgavebewijs: ${p}`);
    assert.ok(result.modules.includes(p.includes('pabo-')?'pabo':'space'),`Geen uitgevoerde controle voor ${p}`);
  }
  return paths;
}

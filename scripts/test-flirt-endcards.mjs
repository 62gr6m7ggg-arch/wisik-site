import fs from "node:fs";
const evidence = JSON.parse(fs.readFileSync("tests/flirt-endcard-replacement-2026-09-09.json","utf8"));
const expected = ["A01","A02","A03","A04","A05","A06","A07","A08","B01","B02","B03","B04","B05","B06","B07","B08","C01","C02","C03","C04","C05","C06","C07","D01","D02","D03","D04","D05","D06","D07"];
if (JSON.stringify(Object.keys(evidence.codes).sort()) !== JSON.stringify(expected.sort())) throw new Error("slotkaartbewijs dekt niet exact 30 flirts");
for (const [code,e] of Object.entries(evidence.codes)) {
  if (!(e.staticEndcardDuration >= 2.0 && e.staticEndcardDuration <= 11.5)) throw new Error(`${code}: ongeldige oude slotkaartduur`);
  if (Math.abs(e.newVideoDuration-e.videoDuration) > 0.12) throw new Error(`${code}: videoduur veranderde; voice-over kan zijn timing verliezen`);
  if (e.replacement !== "neutral-navy-frame-preserve-duration") throw new Error(`${code}: oude slotkaart niet volgens neutrale strategie vervangen`);
}
if (evidence.speechOverlapCodes.length !== evidence.speechOverlapCount) throw new Error("spraakoverlaptelling inconsistent");
console.log(`Flirt-slotkaartcontrole geslaagd: 30 oude herstelset-kaarten vervangen; bij ${evidence.speechOverlapCount} flirts liep spraak door in het oude slotbeeld.`);

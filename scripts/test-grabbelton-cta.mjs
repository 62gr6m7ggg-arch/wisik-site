import fs from "node:fs";
const fail = message => { throw new Error(message); };
const grab = fs.readFileSync("public/assets/js/grabbelton.js", "utf8");
const pabo = fs.readFileSync("public/apps/pabo-rekenklaar/index.html", "utf8");
const page = fs.readFileSync("public/grabbelton/index.html", "utf8");
if (!grab.includes('endTitle.textContent = "Verder oefenen?"')) fail("klikbare eindkaart ontbreekt");
if (!grab.includes('player.addEventListener("ended", showEndCard)')) fail("eindkaart verschijnt niet na afloop");
if (!grab.includes('player.addEventListener("play", hideEndCard)')) fail("eindkaart verdwijnt niet bij opnieuw afspelen");
if (!grab.includes('?misconcept=${encodeURIComponent(video.target.misconceptionCode)}&ingang=grabbelton&modus=vier-vragen')) fail("gerichte Pabo-link ontbreekt");
if (!pabo.includes('const WISIK_MISCONCEPT_ENTRY = String(URL_FLAGS.get("misconcept")||"").toUpperCase()')) fail("Pabo deep-link parser ontbreekt");
if (!pabo.includes('Object.hasOwn(MISCONCEPTION_CATALOG,WISIK_MISCONCEPT_ENTRY)')) fail("Pabo opent het misconcept niet gericht");
if (page.includes('Verdere uitleg, herstelsets en rubric')) fail("Grabbelton gebruikt nog herstelsetjargon");
console.log("Grabbelton-vervolgroute geslaagd: klikbare eindkaart en gerichte Pabo-deeplink aanwezig.");

// Controleer de echte routefunctie: juiste onderwerpcode, directe set en veilige fallback.
const {default:vm}=await import("node:vm");
const {default:assert}=await import("node:assert/strict");
const calls=[];
const catalog=JSON.parse(fs.readFileSync("public/assets/data/grabbelton-videos.json","utf8"));
const codes=catalog.videos.map(v=>v.target.misconceptionCode);
const context={URLSearchParams,MISCONCEPTION_CATALOG:Object.fromEntries(codes.map(c=>[c,{}])),startDiagnosticRepair:(...args)=>calls.push(["set",...args]),openDiagnosticPattern:code=>calls.push(["uitleg",code])};
vm.createContext(context);
vm.runInContext(pabo.match(/function openWisikMisconceptEntry\(.*?\n}\n/s)[0],context);
for(const code of codes){
  assert.equal(context.openWisikMisconceptEntry(new URLSearchParams({misconcept:code.toLowerCase(),ingang:"grabbelton",modus:"vier-vragen"})),true);
  assert.deepEqual(calls.pop(),["set",code,true]);
}
context.openWisikMisconceptEntry(new URLSearchParams("misconcept=B03&ingang=grabbelton"));
assert.deepEqual(calls.pop(),["uitleg","B03"]);
for(const code of ["","X99","__proto__","constructor"]){assert.equal(context.openWisikMisconceptEntry(new URLSearchParams({misconcept:code,ingang:"grabbelton",modus:"vier-vragen"})),false);}
assert.equal(calls.length,0);
assert.equal((grab.match(/textContent = "Zelf proberen: vier vragen"/g)||[]).length,2);
console.log("Alle filmcodes openen hun eigen vier-vragenset; oude routes en ongeldige codes gecontroleerd.");

// Controleer ook de echte sessieopbouw, zonder de DOM-renderer na te bootsen.
const nodes=new Map();
Object.assign(context,{closeModal(){},stopTimers(){},showView(){},nextPracticeQuestion(){},document:{getElementById(id){if(!nodes.has(id))nodes.set(id,{style:{}});return nodes.get(id)}}});
context.MISCONCEPTION_CATALOG.B03={domain:"B"};
vm.runInContext('let activeSession=null;'+pabo.match(/function startDiagnosticRepair\(.*?\n}\n/s)[0],context);
context.openWisikMisconceptEntry(new URLSearchParams("misconcept=B03&ingang=grabbelton&modus=vier-vragen"));
const session=vm.runInContext('activeSession',context);
assert.equal(session.diagnosticCode,"B03");assert.equal(session.total,4);assert.equal(session.plan.length,4);assert.equal(session.selfPractice,true);assert.equal(session.label,"Zelf proberen: vier vragen");
vm.runInContext('startDiagnosticRepair("B03")',context);
assert.equal(vm.runInContext('activeSession.label',context),"Herstelset");
console.log("Vier vragen voor B03 bevestigd; bestaande herstelknop behoudt zijn werking.");

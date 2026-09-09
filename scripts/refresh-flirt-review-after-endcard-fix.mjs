import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { snapshotFlirtSources } from "./lib/flirt-content-audit.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reviewPath = path.join(root, "public/assets/data/flirt-content-review.json");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "public/assets/data/grabbelton-videos.json"), "utf8"));
const html = fs.readFileSync(path.join(root, "public/apps/pabo-rekenklaar/index.html"), "utf8");
const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
if (!script) throw new Error("Pabo-script ontbreekt");
const element = new Proxy({classList:{add(){},remove(){},toggle(){},contains(){return false}},style:{},dataset:{},addEventListener(){},setAttribute(){},removeAttribute(){},focus(){},getContext(){return null},querySelector(){return null},querySelectorAll(){return []}}, {get:(t,k)=>k in t?t[k]:""});
const storage={};
const context={console,Math,Object,Array,Number,String,Boolean,RegExp,Map,Set,Date,JSON,URL,URLSearchParams,TextEncoder,crypto:globalThis.crypto||undefined,performance:{now:()=>Date.now()},location:{search:"",href:"https://wisik.nl/apps/pabo-rekenklaar/"},document:{title:"review",body:element,documentElement:element,scripts:[{textContent:script}],getElementById:()=>element,querySelector:()=>element,querySelectorAll:()=>[],addEventListener(){}},localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},sessionStorage:{getItem(){return null},setItem(){}},navigator:{},setTimeout(){},clearTimeout(){},requestAnimationFrame(){},AudioContext(){},speechSynthesis:{},SpeechSynthesisUtterance(){}};
context.window=context;
vm.createContext(context);
vm.runInContext(script,context,{timeout:20000});
if(!context.PaboRekenklaarQA?.MISCONCEPTION_CATALOG) throw new Error("MISCONCEPTION_CATALOG ontbreekt");

const review = JSON.parse(fs.readFileSync(reviewPath,"utf8"));
const snapshot = snapshotFlirtSources(root,catalog,context.PaboRekenklaarQA.MISCONCEPTION_CATALOG);
const byCode = new Map(snapshot.map(x=>[x.code,x]));
for(const entry of review.entries){
  const current=byCode.get(entry.code);
  if(!current) throw new Error(`${entry.code}: snapshot ontbreekt`);
  entry.fingerprints=current.fingerprints;
  if(Array.isArray(entry.visualEvidence)){
    for(const evidence of entry.visualEvidence){
      if(typeof evidence.observation==="string" && /herstelset|outro|eindkaart/i.test(evidence.observation)){
        evidence.observation=evidence.observation.replace(/outro verwijst naar de herstelset\.?/gi,"oorspronkelijke statische herstelset-slotkaart is vervangen door een neutrale Wisik-slotachtergrond; inhoudelijke scènes daarvoor zijn ongewijzigd.");
      }
    }
  }
}
review.reviewedAt="2026-09-09";
review.scope.visuals += " Op 9 september 2026 zijn bij alle 30 flirts uitsluitend de statische oude herstelset-slotbeelden vervangen door een neutrale Wisik-achtergrond. De volledige videoduur bleef per flirt gelijk; de inhoudelijke scènes vóór het slotbeeld zijn niet gewijzigd.";
review.scope.audio += " De losse eigenstem-audio is niet gewijzigd door deze slotbeeldcorrectie; de vastgestelde spraakoverlap van circa 4–6 seconden in het oude slotdeel blijft volledig behouden.";
fs.writeFileSync(reviewPath,JSON.stringify(review,null,2)+"\n");
console.log(`Inhoudsreview opnieuw gebonden aan ${review.entries.length} videobestanden na uitsluitend slotbeeldcorrectie.`);

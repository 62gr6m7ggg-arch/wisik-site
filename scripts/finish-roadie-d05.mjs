import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { canonicalJson, digest } from "./lib/flirt-content-audit.mjs";

const root=process.cwd();
const filmDir=path.join(root,"public/films/rekenklaar/D05");
const sourceSrt=process.argv[2];
if(!sourceSrt || !fs.existsSync(sourceSrt)) throw new Error("HeyGen subtitles SRT missing");
const srt=fs.readFileSync(sourceSrt,"utf8").replace(/^\uFEFF/,"");
const vtt="WEBVTT\n\n"+srt.replace(/\r\n/g,"\n").replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2");
fs.writeFileSync(path.join(filmDir,"captions.vtt"),vtt);
const videoPath=path.join(filmDir,"flirt.mp4");
const probe=JSON.parse(execFileSync("ffprobe",["-v","error","-show_entries","format=duration:stream=codec_type","-of","json",videoPath],{encoding:"utf8"}));
const duration=Number(probe.format.duration);
if(!probe.streams.some(s=>s.codec_type==="video")||!probe.streams.some(s=>s.codec_type==="audio")||duration<20) throw new Error("D05 source has invalid video or audio");
const catalogPath=path.join(root,"public/assets/data/grabbelton-videos.json");
const catalog=JSON.parse(fs.readFileSync(catalogPath,"utf8"));
const item=catalog.videos.find(v=>v.target?.misconceptionCode==="D05");
if(!item) throw new Error("D05 absent from catalog");
item.release="roadie-d05-20261111";
item.durationSeconds=Math.round(duration);
item.captionsBurnedIn=false;
catalog.updatedAt="2026-11-11";
fs.writeFileSync(catalogPath,JSON.stringify(catalog,null,2)+"\n");
const reviewPath=path.join(root,"public/assets/data/flirt-content-review.json");
const review=JSON.parse(fs.readFileSync(reviewPath,"utf8"));
const entry=review.entries.find(e=>e.code==="D05");
if(!entry) throw new Error("D05 absent from review");
entry.verdict="aligned-with-notes";
entry.observedContent="Nieuwe Roadie-film met doorlopende Nederlandse eigenstem en geanimeerde vier bakjes: eerst 2, 4, 6 en 8 fiches. Vier fysieke verplaatsingen (een fiche van derde naar tweede bakje; drie van vierde naar eerste) eindigen zichtbaar in 5, 5, 5 en 5. Totaal blijft 20; de scheiding tussen bakjes is geen meetwaarde.";
entry.visualEvidence=[
  {timestamps:"0-41% van de film",observation:"Vier bakjes tonen exact 2, 4, 6 en 8 fiches; som is 20. De drie tussenruimten worden apart besproken."},
  {timestamps:"41%-71% van de film",observation:"Vier getekende fiches bewegen afzonderlijk, met behoud van totaal 20, tussen de bakjes. De eindtoestand is exact 5,5,5,5."},
  {timestamps:"71%-einde",observation:"20 gedeeld door 4 is 5; aantal bakjes (vier waarden) verandert niet."}
];
const cues=[...vtt.matchAll(/-->\s*(\d\d:\d\d:\d\d[.]\d{3})/g)];
entry.captionEvidence=`${cues.length} VTT-cues volgen de HeyGen-eigenstem. Laatste cue eindigt ${cues.at(-1)?.[1]||"onbekend"}, binnen ${duration.toFixed(2)} s.`;
entry.notes=[
  "Het nieuwe beeld herverdeelt alle twintig fiches daadwerkelijk. De drie lege tussenruimten worden niet als meetwaarden gebruikt.",
  "De gegenereerde Roadie-beweging is achter een exact geanimeerde demonstratie gemonteerd. Er is een technische film/audio- en VTT-controle, maar geen onafhankelijke menselijke audiovisuele kwaliteitsbeoordeling uitgevoerd."
];
entry.reviewedAt="2026-11-11";
entry.fingerprints.catalogItem=digest(canonicalJson(item));
for(const [key,route] of Object.entries({video:item.source.url,poster:item.posterSrc,captions:item.captionsSrc,transcript:item.transcriptUrl})){
 entry.fingerprints[key]=digest(fs.readFileSync(path.join(root,"public",route)));
}
review.reviewedAt="2026-11-11";
review.scope.visuals += " D05 Roadie: vier bakjes met 2/4/6/8 fiches worden in vier exacte verplaatsingen 5/5/5/5.";
review.scope.audio += " D05 gebruikt nu ingebedde Nederlandse Roadie-stem in de nieuwe MP4, zonder de oudere M4A-koppeling.";
fs.writeFileSync(reviewPath,JSON.stringify(review,null,2)+"\n");
console.log("D05: media, VTT, catalogus en inhoudelijk reviewbewijs bijgewerkt.");

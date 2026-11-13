import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const catalog = JSON.parse(fs.readFileSync('public/assets/data/grabbelton-videos.json','utf8'));
const codes = process.env.WISIK_FLIRT_CODES?.split(',').filter(Boolean);
const selected = catalog.videos.filter(v=>!codes || codes.includes(v.target.misconceptionCode));
const created=[];
class Video { constructor(v) { this.currentSrc=`https://wisik.nl${v.source.url}`; this.dataset={audioMode:v.audioMode}; this.muted=false; this.defaultMuted=false; this.playbackRate=1; this.defaultPlaybackRate=1; this.duration=v.durationSeconds; this.readyState=1; this.events=new Map(); this.textTracks=[{cues:[{startTime:1,endTime:2}]}]; } getAttribute(){return this.currentSrc;} addEventListener(n,f){this.events.set(n,f);} querySelector(){return null;} }
class Audio { constructor(src){created.push(src);this.duration=NaN;} addEventListener(){} setAttribute(){} }
const ctx={URL,console,HTMLVideoElement:Video,Audio};vm.runInNewContext(fs.readFileSync('public/assets/js/grabbelton-core.js','utf8'),ctx);
for (const v of selected) {
 const player=new Video(v),before=created.length,cues=JSON.stringify(player.textTracks);
 ctx.WisikGrabbeltonCore.attachOwnVoice(player);
 if(v.audioMode==='embedded') { assert.equal(created.length,before); assert.equal(player.muted,false); assert.equal(player.playbackRate,1); assert.equal(JSON.stringify(player.textTracks),cues); }
 else { assert.equal(created.length,before+1); assert.equal(player.muted,true); }
 const url=new URL(ctx.WisikGrabbeltonCore.versionedAssetUrl(v.source.url,'site',v));assert.equal(url.searchParams.get('v'),`site-${v.release}`);
}
// A newly converted code must not need a source-code allowlist.
const future={...catalog.videos[0],audioMode:'embedded',release:'future-media-version'};
const player=new Video(future),before=created.length;ctx.WisikGrabbeltonCore.attachOwnVoice(player);assert.equal(created.length,before);assert.equal(player.muted,false);
console.log(`Audiokeuze en filmcache: ${selected.length} catalogusfilms + nieuwe Roadie-conversie geslaagd.`);

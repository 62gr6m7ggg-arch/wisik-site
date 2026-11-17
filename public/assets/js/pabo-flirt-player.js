"use strict";
// Filmweergave en laden; rekenlogica en diagnostische beslissingen blijven in de app.
let diagnosticFlirtCatalog=null;
function matchingDiagnosticFlirt(catalog,code){
  const core=globalThis.WisikGrabbeltonCore;
  if(!core||!MISCONCEPTION_CATALOG[code])return null;
  const errors=core.validateCatalog(catalog,{knownToolIds:["pabo-rekenklaar"],knownMisconceptionCodes:Object.keys(MISCONCEPTION_CATALOG),expectedCanonicalToolId:"pabo-rekenklaar",requireKnownTargets:true});
  if(errors.length)return null;
  return core.publishedForWristband(catalog,"PABO").find(video=>video.target.toolId==="pabo-rekenklaar"&&video.target.misconceptionCode===code)||null;
}
async function loadDiagnosticFlirt(code){
  if(!globalThis.WisikGrabbeltonCore)throw new Error("Videospeler niet beschikbaar");
  if(!diagnosticFlirtCatalog){
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
    try{
      const response=await fetch(`/assets/data/grabbelton-videos.json?v=${encodeURIComponent(globalThis.WISIK_SITE_VERSION||APP_VERSION)}`,{cache:"no-cache",signal:controller.signal});
      if(!response.ok)throw new Error("Videocatalogus niet beschikbaar");
      const candidate=await response.json();
      if(!matchingDiagnosticFlirt(candidate,code))return null;
      diagnosticFlirtCatalog=candidate;
    }finally{clearTimeout(timeout)}
  }
  return matchingDiagnosticFlirt(diagnosticFlirtCatalog,code);
}
async function openDiagnosticFlirt(code){
  if(!diagnosticFlirtAllowed(code,state.diagnostics.patterns?.[code]?.status))return;
  const session=activeSession;
  openModal("Even anders kijken? Mag ik dan even met je flirten?",`<div id="diagnosticFlirtContent" aria-live="polite"><p>Je flirt wordt opgehaald…</p></div><div class="button-row" style="margin-top:18px"><button class="btn primary" type="button" data-start-repair="${code}">Start herstelset van vier vragen</button><button class="btn secondary" type="button" data-close-flirt>Verder met mijn oefenreeks</button></div>`);
  const revision=modalRevision;
  const stillOpen=()=>revision===modalRevision&&session===activeSession&&diagnosticFlirtAllowed(code,state.diagnostics.patterns?.[code]?.status);
  try{
    const video=await loadDiagnosticFlirt(code);
    if(!stillOpen())return;
    const content=document.getElementById("diagnosticFlirtContent");
    if(!video){content.innerHTML="<p>Voor dit denkpatroon staat nog geen flirt klaar. Je kunt wel verder met de uitleg en herstelset.</p>";return}
    const asset=url=>escapeHtml(globalThis.WisikGrabbeltonCore.versionedAssetUrl(url,globalThis.WISIK_SITE_VERSION||APP_VERSION,video));
    content.innerHTML=`<h4>${escapeHtml(video.title)}</h4><p>${escapeHtml(video.summary)}</p><video class="flirt-player" data-audio-mode="${escapeHtml(video.audioMode)}" controls tabindex="0" playsinline preload="none" crossorigin="anonymous" aria-label="Wisik-flirt: ${escapeHtml(video.title)}" src="${asset(video.source.url)}"${video.posterSrc?` poster="${asset(video.posterSrc)}"`:""}><track kind="captions" srclang="nl" label="Nederlands" src="${asset(video.captionsSrc)}"></video><p data-flirt-error hidden>De film kan nu niet worden afgespeeld. Je kunt het transcript lezen of verder oefenen.</p><p><a href="${asset(video.transcriptUrl)}" target="_blank" rel="noopener">Lees het transcript (nieuw tabblad)</a></p>`;
    content.querySelector("video").addEventListener("error",()=>{const message=content.querySelector("[data-flirt-error]");if(message)message.hidden=false},{once:true});
  }catch{
    if(stillOpen())document.getElementById("diagnosticFlirtContent").innerHTML="<p>De flirt kan nu niet worden geladen. Je kunt verder oefenen of de herstelset gebruiken.</p>";
  }
}

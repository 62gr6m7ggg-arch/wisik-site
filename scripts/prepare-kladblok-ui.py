from pathlib import Path
import json
import subprocess
import sys
root=Path(__file__).resolve().parents[1]
def replace(name,old,new):
 p=root/name;s=p.read_text()
 if s.count(old)!=1: raise RuntimeError(f'{name}: anker niet uniek: {old[:100]!r}')
 p.write_text(s.replace(old,new,1))
mode=sys.argv[1]
if mode=='checks':
 p='scripts/test-privacy-terrein.mjs'
 anchor="const backstage=read('public/backstage/index.html'),form=read('public/kladblok/index.html');"
 code='''// Defer + DOMContentLoaded kan het vangnet vóór het hoofdscript initialiseren.
// Beide volgordes moeten vóór enige gebruikersinteractie één melding tonen.
for(const order of ['main-first','fallback-first']){
  const h=createHarness({href:origin+'/kladblok/?product=Space-tent&bron='+encodeURIComponent(rawSource)});
  if(order==='main-first'){runMain(h);runLegacy(h);}else{runLegacy(h);runMain(h);}
  equal(Object.values(h.notes).filter(note=>!note.hidden).length,1,'één bronmelding na initialisatie: '+order);
  assert.equal(h.notes['[data-feedback-context]'].textContent,'','verborgen vangnet blijft leeg');
}
'''
 replace(p,anchor,code+anchor)
 p='scripts/check-privacy-terrein-browser.mjs'
 anchor="      const autoPayload=await form.evaluate(f=>Object.fromEntries(new FormData(f)));"
 code='''      assert.equal(await form.locator('[data-feedback-source]:visible, [data-feedback-context]:visible').count(),1,'vóór verzending exact één zichtbare bronmelding');
      assert.equal(await form.locator('[data-feedback-context]').textContent(),'','geen tweede bronmelding in het vangnet');
      const clipping=await form.evaluate(f=>{
        const errors=[],width=document.documentElement.clientWidth;
        for(const el of [f,...f.querySelectorAll('select,textarea,input:not([type="hidden"]):not([name="_honey"]),.form-note')]){
          const r=el.getBoundingClientRect();if(!r.width||!r.height)continue;
          if(r.left < -1 || r.right > width+1)errors.push((el.name||el.className||'form')+' buiten venster');
          if(el.matches('.form-note')&&el.scrollWidth>el.clientWidth+1)errors.push('bron- of privacytekst afgesneden');
        }
        return errors;
      });
      assert.deepEqual(clipping,[],'formulieronderdelen en bronadressen passen werkelijk in de viewport');
'''
 replace(p,anchor,code+anchor)
 replace(p,"      await form.screenshot({path:path.join(proof,label+'-formulier.png')});","      await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo({top:0,behavior:'instant'});});\n      await page.screenshot({path:path.join(proof,label+'-formulier.png'),fullPage:true});")
 print('Regressiechecks toegevoegd; productie nog ongewijzigd.')
elif mode=='fix':
 p='public/assets/js/site.js'
 anchor='      note.textContent = `Automatisch meegestuurde context: ${parts.join(" · ")}.`;'
 replace(p,anchor,anchor+'''
      // Het vangnet kan al vóór DOMContentLoaded zijn uitgevoerd. Het hoofdpad
      // neemt de zichtbare melding dan over, ook vóór iemand op verzenden klikt.
      const fallbackNote = form.querySelector("[data-feedback-context]");
      if (fallbackNote) {
        fallbackNote.hidden = true;
        fallbackNote.textContent = "";
      }''')
 css='''<style id="kladblok-form-fit">
/* Alleen dit formulier; geen globale wijziging aan de andere tenten. */
body[data-route="kladblok"] .kladblok-grid { grid-template-columns: minmax(0,.78fr) minmax(0,1.22fr); }
body[data-route="kladblok"] .kladblok-grid > *,
body[data-route="kladblok"] .wisik-direct-feedback-form .form-grid,
body[data-route="kladblok"] .wisik-direct-feedback-form .field { min-width: 0; }
body[data-route="kladblok"] .wisik-direct-feedback-form input,
body[data-route="kladblok"] .wisik-direct-feedback-form select,
body[data-route="kladblok"] .wisik-direct-feedback-form textarea { min-width: 0; max-width: 100%; }
body[data-route="kladblok"] .wisik-direct-feedback-form .form-note { overflow-wrap: anywhere; }
@media (max-width:820px) { body[data-route="kladblok"] .kladblok-grid { grid-template-columns: minmax(0,1fr); } }
</style>'''
 replace('public/kladblok/index.html','</head>',css+'</head>')
 package=json.loads((root/'package.json').read_text())
 assert package['version']=='0.1.29','Siteversie gewijzigd: eerst opnieuw afstemmen'
 tracked=subprocess.check_output(['git','ls-files'],cwd=root,text=True).splitlines()
 for name in tracked:
  if not(name.startswith('public/') or name.startswith('src/pabo/') or name=='tools/space-tent/index.html'):continue
  if Path(name).suffix not in {'.html','.js','.mjs','.ts','.tsx'}:continue
  p=root/name;before=p.read_text();after=before.replace('?v=0.1.29','?v=0.1.30').replace('data-site-version>0.1.29<','data-site-version>0.1.30<').replace('name="Siteversie" value="0.1.29"','name="Siteversie" value="0.1.30"')
  if after!=before:p.write_text(after)
 replace('public/assets/js/site-data.js','window.WISIK_SITE_VERSION = "0.1.29";','window.WISIK_SITE_VERSION = "0.1.30";')
 package['version']='0.1.30';(root/'package.json').write_text(json.dumps(package,ensure_ascii=False,indent=2)+'\n')
 p=root/'package-lock.json'
 if p.exists():
  lock=json.loads(p.read_text());lock['version']='0.1.30'
  if '' in lock.get('packages',{}):lock['packages']['']['version']='0.1.30'
  p.write_text(json.dumps(lock,ensure_ascii=False,indent=2)+'\n')
 (root/'docs/kladblok-ui-20260917.md').write_text('''# Aanvullende visuele controle: Kladblok 0.1.30

De privacy-nacontrole van site 0.1.29 is in run 35271350597 lokaal én live geslaagd na herstel van de testverwachtingen. Bij zelfstandige beoordeling van het eerdere schermafbeeldingen-artifact (run 35268596368, SHA256 32e274dcf24a7ae24ce806c129516bf8b1e999fd596d7b81b0c306df74e07e18) bleek daarnaast een echte weergavefout: twee bronmeldingen vóór verzending. In de smalle WebKit-afbeelding waren formulieronderdelen rechts afgesneden. Alleen een controle van document.scrollWidth was daarvoor niet toereikend.

Oorzaak dubbele melding: kladblok-context.js voert zijn eerste invulling tijdens defer uit, terwijl site.js zijn formulierinitialisatie op DOMContentLoaded uitvoert. Daardoor kon het vangnet al zichtbaar zijn voordat de hoofdmelding werd getoond. De eerdere VM-test simuleerde alleen de tegenovergestelde volgorde.

Herstel: zodra het hoofdpad een bronmelding toont, wordt uitsluitend de aanvullende vangnetmelding verborgen en leeggemaakt. Het zelfstandige vangnet en de verzendroute blijven bestaan; geen leeropslag of extra gegevensvelden. De nieuwe volgordetest moet op de oorspronkelijke productiecode eerst rood zijn en na herstel slagen. De browsertest controleert nu daadwerkelijk zichtbaarheid in plaats van alleen hidden-vlaggen.

Smalle weergave: uitsluitend op de Kladblokpagina mogen de formulierkolommen en invoervelden krimpen tot de beschikbare breedte. Lange bronadressen breken binnen hun eigen kader. Geen body-overloop verbergen; de test meet elk werkelijk formulieronderdeel ten opzichte van de viewport. Schermafbeeldingen worden met de hele pagina genomen om geen vaste header midden in een uitgesneden formulier te plakken.

Siteversie 0.1.30 en cacheverwijzingen bijgewerkt; Pabo- en Space-appversies, vragen, leerlogica, voortgang, media, servertoegang, routes en Cloudflare-instellingen blijven inhoudelijk gelijk. De auditbestanden worden voor de nieuwe siteversie opnieuw gegenereerd. De eerdere documenten met ongewijzigde productie beschrijven de afzonderlijke testcorrectieronde, niet deze aanvullende zichtbare UI-correctie. Bewaarbeleid en formulierbestemming veranderen niet.

Bewijs: de voorbereidingsworkflow bewaart de verwachte rode volgordetest, geslaagde regressies, browserresultaten en schermafbeeldingen. Na samenvoegen moet de privacy-livecontrole opnieuw slagen op de gepubliceerde 0.1.30-bron. Geen echte testmail, mailboxwijziging of fysieke iPhone-test. GitHub-bescherming blijft afzonderlijke eigenaaractie #61.
''')
 print('Beperkte Kladblokcorrectie aangebracht; nieuwe siteversie 0.1.30, appversies ongewijzigd.')
else:raise ValueError('Gebruik checks of fix')

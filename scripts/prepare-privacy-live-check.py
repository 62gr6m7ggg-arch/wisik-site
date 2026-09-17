from pathlib import Path
root=Path(__file__).resolve().parents[1]
def replace(name,old,new):
 p=root/name;s=p.read_text()
 if s.count(old)!=1: raise RuntimeError(f'{name}: wijzigingsanker niet uniek: {old[:100]!r}')
 p.write_text(s.replace(old,new,1))
replace('scripts/test-privacy-terrein.mjs',"import fs from 'node:fs';","import './test-deployed-privacy-file.mjs';\nimport fs from 'node:fs';")
p='scripts/check-privacy-terrein-browser.mjs'
replace(p,"import fs from 'node:fs';","import {verifyDeployedPrivacyFile} from './verify-deployed-privacy-file.mjs';\nimport fs from 'node:fs';")
replace(p,'let verifiedBytes=false;','let verifiedBytes=false;\nlet deploymentComparisons=[];')
replace(p,'      failures=[];','      failures=[];\n      deploymentComparisons=[];')
old="try{const response=await fetch(origin+url+'?privacy-check='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(20000)});const bytes=Buffer.from(await response.arrayBuffer());if(!response.ok||!bytes.equals(fs.readFileSync(path.join(pub,file))))failures.push(url);}catch{failures.push(url);}"
new="try{const response=await fetch(origin+url+'?privacy-check='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(20000)});const bytes=Buffer.from(await response.arrayBuffer());assert.equal(response.status,200,'HTTP-status voor '+url);deploymentComparisons.push(verifyDeployedPrivacyFile(fs.readFileSync(path.join(pub,file)),bytes,url));}catch(error){failures.push(url+' — '+error.message.slice(0,160));}"
replace(p,old,new)
replace(p,"assert.ok(verifiedBytes,'Livebestanden moeten bytegelijk zijn aan geteste release');","assert.ok(verifiedBytes,'Livebestanden moeten overeenkomen; alleen de expliciet getoetste e-mailomzetting is toegestaan');")
replace(p,"assert.equal(await page.locator('#privacy details').count(),6);","assert.equal(await page.locator('#privacy details').count(),6);\n      const contact=page.locator('#privacy a[href=\"mailto:kladblok@wisik.nl\"]');\n      assert.equal(await contact.count(),1,'zichtbaar maildoel is na laden correct');\n      assert.equal(await contact.innerText(),'kladblok@wisik.nl','leesbaar e-mailadres blijft beschikbaar');")
replace(p,'report.passed=true;report.verifiedLiveFiles=verifiedBytes?files.length:0;',"report.passed=true;report.verifiedLiveFiles=verifiedBytes?files.length:0;\n  report.deploymentComparisons=deploymentComparisons;\n  report.byteExactFiles=deploymentComparisons.filter(p=>p.mode==='byte-exact').length;\n  report.emailNormalizedFiles=deploymentComparisons.filter(p=>p.mode==='cloudflare-email-only').length;")
p='scripts/check-pabo-nav-browser.mjs'
replace(p,"const app='/apps/pabo-rekenklaar/';","const app='/apps/pabo-rekenklaar/';\nconst expectedToolVersion=JSON.parse(fs.readFileSync(path.join(publicRoot,'assets/data/pabo-release-audit.json'),'utf8')).toolVersion;\nassert.match(expectedToolVersion,/^\\d+\\.\\d+\\.\\d+$/,'Versie uit het gecontroleerde brongebonden auditbewijs vereist');")
replace(p,"assert.equal(url.searchParams.get('appversie'),'1.7.0');","assert.equal(url.searchParams.get('appversie'),expectedToolVersion);\n   assert.equal(await page.evaluate(()=>window.PaboRekenklaarQA.version),expectedToolVersion,'app, feedbacklink en brongebonden releaseversie komen overeen');")
p=root/'docs/privacy-live-controle-20260917.md'
p.write_text('''# Live-nacontrole na privacyrelease 0.1.29

De eerste privacy-livecontrole faalde na succesvolle publicatie: acht van negen bestanden waren byte-exact, de Backstage-HTML niet. De gerichte Node-diagnose in workflow 35270694021 gaf HTTP 200 en toonde Cloudflare-e-mailobfuscatie: uitsluitend de contactlink werd gecodeerd en een lokale decode-scriptverwijzing toegevoegd. Een afzonderlijke Python-urllib-aanvraag kreeg HTTP 403; dat is geen bewijs dat de pagina voor bezoekers onbereikbaar is.

De bescherming blijft intact. De controle verandert uitsluitend haar bronvergelijking, niet de website of Cloudflare. Alleen op /backstage/ wordt de exact waargenomen omzetting van de ene broncontactlink herkend. Beide gecodeerde adressen moeten zelfstandig naar het oorspronkelijke adres decoderen; precies één lokale decoderverwijzing in de waargenomen vorm is toegestaan. Vervolgens moeten alle overige UTF-8-bytes gelijk zijn. Geen algemene scriptverwijdering of vrije HTML-normalisatie. Vier positieve fixtures en dertien negatieve mutaties bewaken dit. De live-browsercontrole toetst ook dat de gebruiker het echte adres en maildoel terugkrijgt.

Bron: https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/ (geraadpleegd 17 september 2026). De concrete omzetting is uit de daadwerkelijk geserveerde HTML vastgesteld, niet uit een uitgelezen Cloudflare-accountinstelling.

Een gelijktijdige oudere Pabo-navigatietest faalde afzonderlijk omdat hij nog letterlijk 1.7.0 verwachtte terwijl de app al 1.8.0 was (workflow 35269603397). De verwachte versie wordt nu afgeleid uit het gecontroleerde brongebonden release-auditbestand; zowel de app zelf als de feedbacklink moeten hieraan voldoen. Bestaande navigatie-, opslag-, layout- en assetvergelijkingen blijven behouden.

Rapportage maakt onderscheid tussen byte-exacte bestanden en de ene gecontroleerde e-mailomzetting. De brongebonden audits, appcode, formulier, leerlogica, voortgang, routes, media, productiepagina's en Cloudflare-instellingen worden door deze naronde niet gewijzigd. Geen echte mailverzending of fysieke iPhone-test. De actieve main-bescherming blijft eigenaaractie #61.
''')
print('Alleen tests en controledocumentatie aangepast; productie blijft byte-ongewijzigd.')

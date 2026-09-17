# Live-nacontrole na privacyrelease 0.1.29

De eerste privacy-livecontrole faalde na succesvolle publicatie: acht van negen bestanden waren byte-exact, de Backstage-HTML niet. De gerichte Node-diagnose in workflow 35270694021 gaf HTTP 200 en toonde Cloudflare-e-mailobfuscatie: de contactlink werd gecodeerd en een lokale decode-scriptverwijzing toegevoegd. Een afzonderlijke Python-urllib-aanvraag kreeg HTTP 403; dat is geen bewijs dat de pagina voor bezoekers onbereikbaar is.

De bescherming blijft intact. De controle verandert uitsluitend haar bronvergelijking, niet de website of Cloudflare. Alleen op /backstage/ wordt de exact waargenomen omzetting van de ene broncontactlink herkend. Beide gecodeerde adressen moeten zelfstandig naar het oorspronkelijke adres decoderen; precies één lokale decoderverwijzing in de waargenomen vorm is toegestaan. Vervolgens moeten alle overige UTF-8-bytes gelijk zijn. Geen algemene scriptverwijdering of vrije HTML-normalisatie. Vier positieve fixtures en dertien negatieve mutaties bewaken dit. De live-browsercontrole toetst ook dat de gebruiker het echte adres en maildoel terugkrijgt.

Bron: https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/ (geraadpleegd 17 september 2026). De concrete omzetting is uit de daadwerkelijk geserveerde HTML vastgesteld, niet uit een uitgelezen Cloudflare-accountinstelling.

De eerste lokale proef van de extra adrescontrole las de zichtbare tekst terwijl het native contactonderdeel nog gesloten was (run 35271000519). De test opent en sluit het onderdeel nu via het toetsenbord en controleert het zichtbare adres pas na openen. De controle van het maildoel en de tekst blijft intact.

Een gelijktijdige oudere Pabo-navigatietest faalde afzonderlijk omdat hij nog letterlijk 1.7.0 verwachtte terwijl de app al 1.8.0 was (workflow 35269603397). De verwachte versie wordt nu afgeleid uit het gecontroleerde brongebonden release-auditbestand; zowel de app zelf als de feedbacklink moeten hieraan voldoen. Bestaande navigatie-, opslag-, layout- en assetvergelijkingen blijven behouden.

Rapportage maakt onderscheid tussen byte-exacte bestanden en de ene gecontroleerde e-mailomzetting. De brongebonden audits, appcode, formulier, leerlogica, voortgang, routes, media, productiepagina's en Cloudflare-instellingen worden door deze naronde niet gewijzigd. Geen echte mailverzending of fysieke iPhone-test. De actieve main-bescherming blijft eigenaaractie #61.

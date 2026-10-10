# Spacetent 0.7.0 · native Tentamenarena

## Bouwroute

De afgesloten PR 72 is niet samengevoegd. De losse HTML, verplichte upload,
iframe-inbouw en experimentele transportworkflows zijn niet overgenomen.
De nieuwe bron staat onder `tools/space-tent/app/arena` en wordt door de bestaande
Spacetent Vite/React-build opgebouwd. De arena wordt pas geladen bij openen.
De bestaande hoofdapp, cursusbank, lokale cursusopslag, levelcriteria,
beveiligingsheaders en de andere Wisik-tenten blijven behouden.

## Wat de bezoeker krijgt

- Digitaal bewerkt tentamen van 5 november 2018: 18 deelopgaven.
- Expliciete Wisik-reconstructie van de boek-oefentoets H9/H10: 33 deelopgaven.
- 24 herstelvragen met aanwijzingen, tussenstappen en strategie-uitleg.
- Native ruimtelijke figuren, zelfstandige pogingen, notities, markeren,
  instelbare tijd, zelfcontrole en exacte koppelingen naar bestaande lesblokken.
- Afdrukbare digitale opgaven en uitwerkingen; dit zijn geen PDF-facsimiles.

Het oorspronkelijke vragenblad van de boek-oefentoets is niet teruggevonden.
Aanvullende gegevens, gereconstrueerde formuleringen en gecorrigeerde
bronuitwerkingen worden zichtbaar aangegeven. De 150 minuten voor die
reconstructie zijn een oefenkeuze, geen historische toetsduur.
Papierwerk is zelfbeoordeling; de arena kent geen officieel cijfer, cursus-XP
of automatische beheersingsstatus toe. Niet beoordeeld betekent niet fout.

## Daadwerkelijk uitgevoerde controles

Gecontroleerde bouwrun: 38073627963, broncommit
`5a026a55a956408771e841ce7c6eba9b77e6c5a8`.
De volledige gecontroleerde kandidaat is door de runner vastgelegd als
`2916e343145ea391b571356de30326855ad846c1`.

- TypeScript en de bestaande volledige Spacetent-build: geslaagd.
- Nieuwe onafhankelijke bron-/meetkundecontroles: 3474 assertions geslaagd.
- Nieuwe geïntegreerde browserreeks: 2316 assertions geslaagd, in Chromium
  en WebKit op 1280, 390 en 320 pixels breed.
- Beide volledige toetsen, alle uitwerkingen, alle 24 trainingsantwoorden,
  echte browseropslag en herladen, export/import, les-terugkeer, afdrukken,
  conflicten tussen tabbladen en behoud van beschadigde opslag zijn getest.
- De bestaande vormvariatie-, instroom-, vraagbaak-, constructie-,
  doorfeesten- en beschermde review-browsercontroles zijn opnieuw geslaagd.
- De normale sitebrede `npm run build`/vrijgavecontroles zijn geslaagd.

Native bewijs: `tools/space-tent/validation/arena-native-070.json`.
Het bestaande releasebewijs bindt dit aan de exacte bron- en bundelvingerafdrukken.
Het workflow-artifact heet `native-arena-release-evidence`.
Desktop-, smalle Chromium- en mobiele/smalle WebKit-screenshots zijn ook visueel
bekeken. Het afdrukbare opgavenbestand is op leesbaarheid en vraag/antwoord-
scheiding bekeken. Er is geen fysieke iPhone-test uitgevoerd.

## Opslag en terugkeer

De cursus behoudt `wisik.space-tent.progress.v1`.
De arena gebruikt afzonderlijk `wisik.space-tent.arena.native.v1`.
De browserreeks vergelijkt de bestaande cursusgegevens byte voor byte na de
nieuwe oefenroutes. De arena-ingang verschijnt niet als extra hulpknop tijdens
zelfstandige cursuschecks of constructietests.
Opslagfouten worden gemeld; beschadigde gegevens worden niet stilzwijgend
gewist. Export/import is voor de arena apart beschikbaar. Browsergegevens
wissen of een ander browserprofiel gebruiken kan lokale voortgang verwijderen.

## Publicatie

De kandidaat mag alleen via PR 73 en de normale verplichte vrijgavecontrole
naar main. De normale Cloudflare Pages-publicatie volgt de merge.
`space-native-live.yml` controleert vervolgens de werkelijk geleverde bestanden,
de ongewijzigde restrictieve iframe-policy, de informatiepagina's en beide
leerlingroutes op wisik.nl in dezelfde zes browseromgevingen. Een geslaagde
pre-releasecontrole is niet op zichzelf bewijs dat de site al is bijgewerkt.

## Grenzen

Geen claim van empirisch bewezen leerwinst, perfecte foutloosheid of een
officieel toetsresultaat. Schriftelijke redeneringen en constructies vragen
zelfcontrole of docentbeoordeling. De oorspronkelijke PDF-bestanden blijven
bij het eerder aangeleverde cursusmateriaal; de native arena publiceert
leesbare digitale bewerkingen en eigen afdrukken, geen ruwe PDF-downloads.

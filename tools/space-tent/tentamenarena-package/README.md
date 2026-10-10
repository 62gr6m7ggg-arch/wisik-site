# Tentamenarena 1.0 — integratievoorbereiding

**Niet actief. Niet publiceren als voltooide Tentamenarena.**
Deze branch bevat de inbouwcode, nog niet de volledige HTML met bronbestanden.
De bestaande Spacetent en de main-branch zijn niet aangepast.

## Complete kandidaat in de bijbehorende ChatGPT-oplevering

Bestanden: `Spacetent_Tentamenarena_1.0.html` en `Spacetent_Tentamenarena_1.0_pakket.zip`.
De zelfstandige HTML bevat alle vier originele PDF's, 23 leesbare bronpagina's,
18 deelopgaven met 54 zelfcontrolecriteria, 24 nieuwe herstelvragen, lokale
voortgangsexport/import, markeren, timer en een voorlopige herstelroute op basis
van zelfbeoordeling. Er is geen automatische beoordeling van papierwerk en geen
cijfer/topstatus.

HTML SHA-256: `6fb2e448fe0a011b7ccf66fa62ac627c21747189d5bf117c80af409c7865f8a5`.

## Bronbevindingen

Er is één compleet tentamen: 5 november 2018 (5 pagina's, inclusief drie
werkbladen), met uitwerkingen (8 pagina's). Het andere opgavenbestand bestaat
uit tien extra oefeningen bij H9/H10 (2 pagina's). Van de afzonderlijke
oefentoets zijn alleen uitwerkingen aanwezig: pagina 6–8 van het gecombineerde
uitwerkingenbestand. Die oefentoets kan dus nog niet als tweede complete
simulatie worden aangeboden.

Afzonderlijke Wisik-notities, oorspronkelijke bestanden ongewijzigd:
- Opgave 3: kop 15 punten, deelpunten 16; totaalscore 54 tegenover 55.
- 2c: conclusie moet AH loodrecht op EFS zijn, niet DBF.
- 4c: CC'=12, niet 8. atan(12/sqrt164)=43,1384 graden; bron geeft circa 32.
- 5a: gevraagd in millimeters: 10sqrt1575 mm, circa 396,9 mm.
- 5c: V=75x sqrt(2025-45x); grenspunten 10,09238055 en 43,08458134 cm,
  beide inclusief wegens 'minimaal'.

## Getest en niet getest

De complete lokale kandidaat doorliep 108 browser/interactiecontroles en 26
wiskundige/inhoudscontroles. Alle PDF-bytes zijn tegen de oorspronkelijke
bestanden gecontroleerd. De browserreeks gebruikte Chromium met rechtstreeks
geplaatste HTML en een gecontroleerde Storage-fixture, omdat de werkomgeving
navigatie naar localhost en file-URL's blokkeerde. Dit is dus GEEN bewijs van
echte schijfopslag, Safari/PWA-gedrag of de end-to-endkoppeling met Spacetent.
De integratiecode zelf is nog niet met de volledige React-app gebouwd en getest.

## Vervolg binnen deze werkbranch

Plaats de volledige inhoud van het opleverpakket in deze pakketmap. Het pakket
bevat ook `bronbestanden/manifest.json`, bouwbroncode en tests. Het bestand kan
niet door deze integratiestub worden vervangen: het bevat de daadwerkelijke
bronnen en bediening.

Voer eerst de dry-run uit:

```sh
node tools/space-tent/tentamenarena-package/integratie/install.mjs .
```

Het script stopt als de geverifieerde bronbestanden zijn gewijzigd. Daarna kan
`--apply` de integratie plaatsen in de lokale werkbranch. Het script commit,
bouwt en publiceert niets. Daarna zijn de bestaande cursus-/buildcontroles,
volledige browserregressies en een echte les-terugkeertest nodig.

De bron-HTML wordt onder `tools/space-tent/app/tentamenarena/index.html`
bewaard en tijdens builds naar `.space-dist/tentamenarena/index.html` gekopieerd.
Zo blijft de arena behouden wanneer een toekomstige release de public-map
opnieuw opbouwt. De bestaande app-index niet vervangen door de arena-HTML.

Pas na volledige overdracht, succesvolle integratiecontroles en de gebruikelijke
releasechecks kan deze conceptwijziging klaar voor samenvoegen worden gemaakt.

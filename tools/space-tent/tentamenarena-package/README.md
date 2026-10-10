# Tentamenarena 1.0 — integratievoorbereiding

**Niet actief. Niet publiceren als voltooide Tentamenarena.**
Deze branch bevat de React-brug, de bronchecksums en een gecontroleerd
installatieprogramma. De complete arena-HTML is nog niet overgebracht. De
bestaande Spacetent en de main-branch zijn niet aangepast.

## Complete kandidaat in de ChatGPT-oplevering

`Spacetent_Tentamenarena_1.0.html` bevat de oorspronkelijke PDF's, 23 bronpagina's,
18 deelopgaven met 54 zelfcontrolecriteria, 24 nieuwe herstelvragen,
voortgangsexport/import, markeren, timer en een herstelroute op basis van
zelfbeoordeling. Geen automatische beoordeling van papierwerk, cijfer of topstatus.
Het ZIP-pakket bevat daarnaast de bouwbroncode, de originele bestanden en tests.

HTML SHA-256: `1fd4e4424c05d9d38add7f0aead7a955e57eab6c49215bbe5687b004805d9fbd`.

## Minimaal benodigde overdracht

Voor de installer hoeft nog één bestand naar deze branch te worden overgezet:

`tools/space-tent/tentamenarena-package/Spacetent_Tentamenarena_1.0.html`

De overige benodigde installerbestanden en het PDF-manifest staan al hier.
Het volledige ZIP-pakket kan eveneens in deze pakketmap worden uitgepakt voor
onderhoud en reproduceerbare tests. Vervang niet de bestaande publieke app-index:
dan zou de arena de hele Spacetent vervangen in plaats van uitbreiden.

## Bronbevindingen

Er is één compleet tentamen: 5 november 2018 (5 pagina's, inclusief drie
werkbladen), met uitwerkingen (8 pagina's). Het andere opgavenbestand bestaat uit
tien extra oefeningen bij H9/H10 (2 pagina's). Van een afzonderlijke oefentoets
zijn alleen uitwerkingen aanwezig: pagina 6–8 van het gecombineerde bestand.
Deze oefentoets is dus niet als tweede complete simulatie aangeboden.

Afzonderlijke Wisik-notities, oorspronkelijke bestanden ongewijzigd:
- Opgave 3: kop 15 punten, deelpunten 16; totaalscore 54 tegenover 55.
- 2c: conclusie moet AH loodrecht op EFS zijn, niet DBF.
- 4c: CC'=12, niet 8. atan(12/sqrt164)=43,1384 graden; bron geeft circa 32.
- 5a: gevraagd in millimeters: 10sqrt1575 mm, circa 396,9 mm.
- 5c: V=75x sqrt(2025-45x); grenspunten 10,09238055 en 43,08458134 cm,
  beide inclusief wegens 'minimaal'.

## Getest en niet getest

108 browser-/interactiecontroles en 26 wiskundige-/inhoudscontroles van de
zelfstandige kandidaat slaagden. Alle oorspronkelijke PDF-bytes zijn gecontroleerd.
De browserreeks gebruikte Chromium met rechtstreeks geplaatste lokale HTML en
een gecontroleerde Storage-fixture, omdat de werkomgeving navigatie naar lokale
bestanden en localhost blokkeerde. Dit bewijst geen echte schijfopslag,
Safari/PWA-gedrag of de end-to-endkoppeling met Spacetent. De integratiecode is
nog niet met de volledige React-app gebouwd en getest.

## Installeren en controleren — alleen in de werkbranch

```sh
node tools/space-tent/tentamenarena-package/integratie/install.mjs .
```

Dit is een dry-run: geen bestanden worden gewijzigd. Het script stopt als de
gecontroleerde Spacetent-bron of buildprocedure inmiddels is gewijzigd. Na een
geslaagde controle kan `--apply` de integratie in de lokale werkmap plaatsen.
Het script bouwt, commit of publiceert niets.

Daarna zijn de bestaande build-, cursus-, voortgangs- en browsercontroles nodig,
plus een echte test van openen, terugkeren en lesherstel. Pas daarna is een
release verantwoord. Deze PR blijft tot dat moment concept.

De bron-HTML komt onder `tools/space-tent/app/tentamenarena/index.html`; de
builduitvoer onder `.space-dist/tentamenarena/index.html`. De installer past de
build aan zodat toekomstige releases de arena niet kwijtraken. De oorspronkelijke
cursusresultaten en levelcriteria worden niet aangepast.

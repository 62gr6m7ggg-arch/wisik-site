# Tentamenarena 1.1 — nog niet online

De inhoud is gereed als lokaal HTML-bestand. De resterende overdracht is één bestand:

`Spacetent_Tentamenarena_1.1.html`

Upload dit bestand in DEZE map, op branch `space-tentamenarena-20261010`.
Niet op main en niet over `public/apps/ruimteklaar/index.html` heen.
De exacte bytegrootte en SHA-256 staan in `release.json`.

## Wat de upload start

De workflow controleert het bestand en de oorspronkelijke PDF-bytes, installeert
de koppeling met de bestaande Spacetent, bouwt de React-app en voert de bestaande
cursuscontroles plus native Chromium- en WebKit-tests uit. De browserreeks omvat
18 originele deelopgaven, 33 reconstructievragen, alle 24 herstelvragen, zes
figuurgroepen, PDF-lezers/downloads, herladen, nakijken, bewaren en les-terugkeer.

Pas na deze controles wordt de gebouwde kandidaat op de werkbranch vastgelegd.
Daarna draait de verplichte vrijgavecontrole op PRECIES die commit. Alleen bij
succes en een ongewijzigde main-branch wordt concept-PR 72 gereed gemeld en via
de normale branchbescherming samengevoegd. Geen admin-bypass of force-push.
De bestaande Cloudflare-koppeling moet de wijziging daarna publiceren; de
workflow controleert de live bestandsvingerafdruk en beide oefenroutes.
Een ontbrekend bestand of mislukte controle stopt de procedure vóór samenvoegen.

## Wat nu daadwerkelijk is gecontroleerd

Op 10 oktober 2026 opnieuw uitgevoerd: 200 lokale Chromium-controles van het
volledige HTML-bestand, waaronder alle 33 reconstructievragen en uitwerkingen,
alle 24 trainingsantwoorden, roteren en weergave op 320–1440 pixels. Deze reeks
gebruikte set_content en een Storage-fixture wegens de lokale browserbeperking.
Dat bewijst GEEN native Safari-/PWA-opslag of werking van de geïntegreerde React-app.

Daarnaast zijn de vier oorspronkelijke PDF-controlegetallen, alle 75 expliciete
leskoppelingen en onafhankelijke vector-/afstand-/oppervlakteberekeningen opnieuw
gecontroleerd. De native browsertests zijn voorbereid maar wachten op de upload.
De beperkte CSP-aanpassing is eerder gecontroleerd met de Cloudflare Pages-parser
in workflow 38039799899. Fysieke iPhone-tests zijn niet uitgevoerd.

## Bronnen en beoordeling

Het tentamen van 5 november 2018 is authentiek. De boek-oefentoets H9/H10 is een
Wisik-reconstructie, niet een teruggevonden tweede HAN-tentamen. De aannames bij
opgave 2 zijn expliciet vermeld. Een tijdsduur of puntentelling voor die
reconstructie is geen historische claim. Papierwerk wordt zelf beoordeeld;
er is geen officieel cijfer en geen wijziging van bestaande levelresultaten.

Correcties staan naast, niet in, de ongewijzigde oorspronkelijke bestanden.
Onder meer: bij reconstructie 3e is oppervlakte EBG = 3√29; bij 3g is afstand
F tot EBG = 12/√29. Bij BF/DE worden de kleinste en stompe hoek onderscheiden.

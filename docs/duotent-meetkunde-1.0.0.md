# Duotent vlakke meetkunde — eerste versie 1.0.0

## Doel en afbakening

Eén oefenomgeving bij het bestaande visuele naslagwerk. De missie “wiskunde leuk maken” krijgt vorm door een eigen poging, inzicht via figuur en redenering, en opnieuw zelfstandig toepassen. Geen simulatiestand, timer, verplichte volgorde of automatische beoordeling van vrije bewijzen.

- A: zes opgaven, elf deelvragen, 41 oorspronkelijke VWO-punten. Iedere deelvraag heeft bronaanduiding, eigen denkvraag, passende stellinglinks, uitleg in stappen met meetkundig geconstrueerde SVG, zelfbeoordeling en een nieuwe korte controlevraag met antwoord.
- A–D: de bestaande PDF’s, inclusief uitwerkingen, ongewijzigd beschikbaar. B–D hebben in deze eerste versie nog geen interactieve oefenroute.
- De bronvragen zijn leesbaar geparafraseerd op het scherm. De ongewijzigde PDF is de bron voor de oorspronkelijke formulering, figuren, werkbladen en officiële normering. Eigen vervolgvragen en toelichtingen zijn herkenbaar als Wisik-aanvullingen.
- Στοιχεῖα: `content.js`, `reference.js`, `geometry.js` en `app.js` blijven intact. Alleen toegangen en een gerichte terugweg zijn toegevoegd.

## Paden en onderhoud

- Oefendeel: `/apps/meetkunde/`; deelvraag bijvoorbeeld `#A1`.
- Naslagwerk: bestaande `/apps/stoicheia/#regel-XX`; optionele `?oefening=A1` levert een vaste interne teruglink. Geen vrije externe terug-URL.
- `content.js`: opgaven, stappen, bronnen, normering, vervolgvraag.
- `geometry.js`: analytisch bepaalde punten en progressieve tekenenlagen.
- `references.js`: gecontroleerde labels uit de oorspronkelijke stellingenlijst.
- `state.js`: validatie, lokale opslag en import/export.
- `app.js`: navigatie en bediening; `style.css`: responsive huisstijl.

Notities worden als tekst weergegeven. Geen analytics, account of uploads toegevoegd. Kladblok ontvangt alleen de bestaande expliciete broncontext (pagina, product, versie, deelvraag), geen antwoorden of notities.

Opslagsleutel `wisik-meetkunde-oefenen-v1`, schema 1. Import accepteert maximaal 1 MB, bekende deelvragen en beperkte tekstlengtes. Bestaand inhoudelijk werk krijgt bij conflict voorrang; een lege eerder bezochte deelvraag blokkeert de import niet. Bij opslagfouten blijft werken mogelijk en volgt een melding met exportmogelijkheid. Bestaande Wisik-voortgangssleutels worden niet aangeraakt.

## Verificatie

`npm run meetkunde:check` controleert de elf deelvragen, 41 punten, echte stelling-ID’s/labels, eindige SVG-coördinaten, koordemidden, congruente geodriehoeken, raaklijn- en bissectricefiguur, inversie/gelijkvormigheid, tweede koordenvierhoek, en 241 toegestane posities van de bewegende baan. Ook opslag, foutafhandeling en veilige samenvoeging van voortgang worden gecontroleerd. De test is toegevoegd aan de bestaande `npm run check`.

Browsercontrole: oorspronkelijke situatie versus geopende uitleg, volgende/vorige stap, notities, bezoek aan de juiste stelling en terugkeer met behoud van notities en stap. Smalle weergave gecontroleerd in een 360 px iframe met echte responsive pagina; dit is geen test op een fysieke telefoon. Een echte iPhone/Safari-test en gebruik door medestudenten blijven gewenst; niet als geslaagd geclaimd.

## Bekende begrenzingen

De vervolgvraag is een inhoudelijke oefenkans, geen gevalideerde beheersingsmeting. De student beoordeelt zijn eigen werk; alternatieve bewijzen kunnen menselijke bespreking vragen. Lokale voortgang is apparaat- en browsergebonden en niet versleuteld; export/import maakt overzetten mogelijk. De schematische figuren laten één geldige configuratie zien; de bewijsredenering draagt de algemene conclusie.

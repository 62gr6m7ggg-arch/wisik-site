# Levels 5 en 6 — inhoud en controle

Definitieve gegevens: `levels-5-6.json`.

- Level 5: vier blokken in bronvolgorde — punt tot lijn, punt tot vlak, inhoudsmethode, formules/gelijkvormigheid.
- Level 6: drie blokken — gemeenschappelijke loodlijn, parallel hulpvlak, gemengde methodekeuze.
- Totaal: 7 blokken, 21 theorievoorbeelden, 28 hoofdvragen, 14 diagnosevragen, 14 herkansingsvragen en 16 afzonderlijke levelcheckvragen. Alle 72 vragen hebben een relevante figuur. Beide levels bevatten alle vier vaardigheidstypen.
- Per blok is één specifieke misconceptie uitgewerkt met een trigger, twee gerichte bevestigingsvragen, een visuele herstelinstructie en twee vervolgvragen. De positie van het juiste keuzeantwoord varieert.
- Twee papieropdrachten met constructiestappen, een rubric van vier criteria en een volledige uitwerking.

## Bronnen

De volledige tekst en wiskunde-XML (`a:t` én `m:t`) van les 1.5 en 1.6 is gelezen. De dekking en specifieke slides staan ook in `sources` in het JSON-bestand. Toets Basis Ruimtemeetkunde 5 november 2018 is gebruikt om toepassingsniveau en papierconstructies te laten aansluiten. De nieuwe vragen kopiëren de toets niet.

Er zijn twee duidelijk verschillende bakmodellen:

1. Vaste trapeziumbak: lengte 10 dm, bodem 2 dm, opening 6 dm, hoogte 4 dm. Bij waterhoogte h geldt w(h)=2+h en V(h)=20h+5h².
2. Nieuwe vouwbak: plaatbreedte 60 cm, lengte 40 cm, bodem x, opening 2x. h(x)=√(900−30x), V(x)=60x√(900−30x), fysisch domein 0<x<30.

## Uitgevoerde onafhankelijke controles

`python validate-levels-5-6.py` is succesvol uitgevoerd. Dit controleert:

- Alle 33 numerieke antwoorden onafhankelijk: punt-lijnafstanden met een kruisproduct, punt-vlakafstanden met een normaalvector, kruisende-lijnafstanden met een gemengd product, hoeken via vectoren en volumeformules via afzonderlijke geometrische berekeningen. De inverse waterhoogte is onafhankelijk door bisectie bepaald.
- Alle 127 scènevermeldingen op eindige coördinaten en geldige puntverwijzingen.
- Alle 52 weergegeven vlakpolygonen op niet-degeneratie en coplanariteit.
- De 40 toegevoegde lijnstukken op niet-nul lengte. Bij de relevante antwoordfiguren zijn de voeten tevens gecontroleerd op ligging op de doellijn of het doelvlak en op de vereiste loodrechte stand. De gemeenschappelijke loodlijnen zijn op beide richtingen gecontroleerd.
- Unieke vraag-ID's, bestaande antwoordopties, onjuiste diagnoseopties, gescheiden oefen/check-ID's, alle vier vaardigheden in elke levelcheck en overeenstemming tussen afrondingsinstructie en `decimals`.

De numerieke resultaten en aantallen staan in `levels-5-6-validation.json`. Het reproduceerbare auteurscript is `build-levels-5-6.py`.

## Integratiepunten en grenzen

- Numerieke vragen hebben `working:true`, `decimals:2`; hoeken vragen hele graden en hebben `decimals:0`.
- `Scene.dimensions` schaalt genormaliseerde kubuscoördinaten. Bij eigen prisma's/piramiden zijn de punten fysieke coördinaten en worden geen extra dimensies opgegeven.
- Het hulpvlak ACUT bij de parallelvlakmethode bevat externe punten T(-1,1,1) en U(0,2,1). De weergave moet alle opgegeven punten omvatten; het vlak is exact coplanair en bevat de richtingen AC en BH.
- Antwoordfiguren worden uitsluitend in theorie, herstel of feedback gebruikt. Vragen die een hoogte laten berekenen krijgen die hoogte niet in het figuurbijschrift.
- Een eigen berekening of papierconstructie is niet automatisch inhoudelijk beoordeeld. De rubric is bedoeld voor eerlijke zelfcontrole of controle door docent/medestudent; dit JSON-bestand claimt geen automatische bewijsbeoordeling.
- De controles bewijzen consistentie van inhoud en geometrie. Browserweergave, mobiele bediening en integratie van het adaptieve systeem moeten in de applicatie worden gecontroleerd.

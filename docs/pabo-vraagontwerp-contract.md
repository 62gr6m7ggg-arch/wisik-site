# Pabo Rekenklaar: vraagontwerp en denkvariatie

**Versie 1.10.0 — 20 oktober 2026 — Edwin van der Plas / Wisik**

Doel: dezelfde wiskundige kennis vanuit verschillende kanten aanspreken, niet dezelfde som steeds anders aankleden.

## Ontwerpbron en uitbreiding

`src/pabo/reasoning-designs.js` bewaart de 36 oorspronkelijke parameteriseerbare vraagontwerpen: 6 getalinzicht, 6 breuken vergelijken, 6 geheel/rest, 6 meten/meetkunde, 6 grafieken/tabellen en 6 formules. Daarnaast bevat `src/pabo/rich-designs.js` 180 aanvullende ontwerpen: tien per bestaand deelonderwerp. Een ontwerp is niet automatisch een onafhankelijke familie. Expliciete equivalentiekoppelingen voegen bekende rekenstructuren samen. Verschillende getallen tellen niet als extra ontwerpen. Tabellen, een getallenlijn, meetkundige schetsen en grafieken dragen rekeninformatie, geen decoratie.

De registratie heeft per ontwerp een leerdoel, rekenstructuur, denkhandeling, context, presentatie en een beargumenteerde rubric. De vraagzwaarte is een expertvoorspelling, **geen empirisch gekalibreerde moeilijkheid**. De nieuwe redeneringsvragen hebben voorspelde zwaarte 2–5; de bestaande directe basisvragen blijven staan. Niet elk onderdeel heeft op elke zwaarte evenveel verschillende ontwerpen.

De bronbestanden worden met `npm run pabo:reasoning:build` in de zelfstandige HTML ingebouwd. Er is geen externe AI-aanroep tijdens het oefenen. Het bestaande adres, opslagkenmerk, XP, lesvoortgang, domein-/toetsverdeling en mediastructuur blijven behouden.

## Vragen ontwikkelen

Verzamel uiteenlopende echte informatievormen: een plattegrond, label, recept, prijslijst, meetreeks, planning of leerlingredenering. Eigen foto's kunnen inspiratie bieden, zonder derden herkenbaar in de vragen op te nemen. Het gaat om wat iemand moet kiezen, controleren, reconstrueren of beredeneren, niet om een origineel verhaaltje alleen.

Ontwerpopdracht voor een volgende ronde:

> Stel eerst een reeks korte vraagontwerpen voor, nog geen complete opgaven. Benoem leerdoel, denkhandeling, presentatie en het verschil met bestaande ontwerpen. Varieer onder andere reconstrueren, grenzen bewaken, schatten, vergelijken, verklaren, tegenvoorbeelden geven, gegevens herstellen en plannen onder voorwaarden. Vermijd tegeldozen, vultijden, omslagpunten van tarieven en magazijnvoorraden als standaardrecept. Verwerp ontwerpen die alleen namen, voorwerpen of getallen wijzigen. Werk pas daarna de inhoudelijk verschillende ontwerpen uit met antwoord, uitleg en controleerbare rekendata. Controleer ook onderling welke ontwerpen alsnog dezelfde aanpak vragen.

Blijf binnen het beoogde rekenkader. Creativiteit is geen vrijbrief voor onnodig moeilijke taal, onrealistische situaties, verborgen aannamen of extra vakkennis. Beoordeel leerdoel, formulering, antwoord, uitleg, afbeelding, niveau en mogelijke foutredeneringen gezamenlijk.

## Selectie en eerlijke begrenzing

De bestaande 480 exacte vraagvingerafdrukken blijven behouden. Daarnaast blijven maximaal 96 sets **gehashte kenmerken** van aangeboden vragen lokaal in dezelfde browser bewaard: aanpak, familie, context, presentatie en onderwerp. Geen extra letterlijke antwoorden, naam of centraal profiel. Reset wist ook deze geschiedenis. De bewaarplaats wordt niet over browsers of apparaten gesynchroniseerd.

De selectie kiest binnen leerdoel, rekenmodus en nabij beschikbaar niveau. Nieuwe exacte opgaven gaan voor; dezelfde combinatie van rekenstructuur en denkhandeling krijgt waar mogelijk acht tussenliggende vragen. Als in het gebruikelijke niveauvenster geen afgekoelde aanpak beschikbaar is, wordt eerst maximaal twee niveaus van de gevraagde zwaarte gezocht. Dit staat expliciet in `selectionInfo.semanticLevelWindowExpanded`; de feitelijke rubric, score en niveauaanduiding blijven leidend. Pas als ook dat geen aanbod oplevert, wordt de afkoelperiode ontspannen. Een directe herhaling wordt dan nog steeds vermeden zodra er een passend alternatief is. `selectionInfo.semanticCooldownRelaxed` maakt die beperking controleerbaar. Dit is geen garantie dat een student nooit meer een verwante vraag ziet.

Binnen toetsen blijven exact unieke opgaven en maximaal drie per familie harde voorwaarden. Te weinig voorraad resulteert niet in een stille vaste terugvalvraag. Herstelvragen en controlevragen behouden hun doelgerichte didactische functie; de sprint heeft zijn eigen hoofdrekencontract.

## Rekenkundige en diagnostische veiligheid

De nieuwe ontwerpen geven hun rekendata expliciet mee. `reasoningExpected` controleert antwoorden op basis van die gegevens, deels door enumeratie of een alternatieve berekening. Nieuwe vraagteksten worden niet via tekstherkenning aan een diagnose of flirt gekoppeld: daarvoor is een afzonderlijk ontworpen en geteste foutmodel nodig. Bestaande diagnostiek blijft intact. Een antwoordcheck is nog geen bewijs dat elke formulering of didactische keuze optimaal is.

De controles omvatten varianten per ontwerp, opzettelijk fout gemaakte antwoorden en ontbrekende data, migratie, begrensde opslag, sessies met herladen, de bestaande volledige toetsroutes en browserbediening. Het openbare Backstage-auditbewijs bevat de resultaten en ook de aantallen ontspannen afkoelperiodes. Externe gebruikerstests en docentfeedback blijven nodig.

## Sorteren

Het handvat gebruikt Pointer Events voor muis, pen en aanraking; alleen het handvat blokkeert de scrollbeweging. De rest van de rij kan normaal scrollen. Knoppen blijven aanwezig, het handvat ondersteunt pijltjestoetsen, de focus volgt het verplaatste item en een statusmelding kondigt de nieuwe positie aan. Afbreken, loslaten buiten de lijst, wisselen van vraag en nakijken beëindigen het slepen. Na nakijken zijn alle verplaatsroutes geblokkeerd.

Browserautomatisering is geen fysieke iPhone-test. Chromium-aanraking wordt via de browserinvoer gesimuleerd; WebKit krijgt gecontroleerde Pointer Events. Werkelijke Safari- en beginschermbediening verdienen aanvullend een gebruikerstest.


## Streefgetal en eerlijke telling (1.10.0)

Het streefgetal is 81 inhoudelijk verschillende families per deelonderwerp. Deze release haalt dit niet. `public/assets/data/pabo-variation-catalog.json` registreert per deelonderwerp het bestaande aantal, de uitbreiding en het concrete tekort. Een ander verhaal of getal wordt niet als zelfstandige familie geteld. Familie-indelingen zijn conservatieve ontwerpkeuzes, geen empirisch vastgestelde taxonomie. Families in verschillende onderwerpen kunnen een verwante rekenstructuur hebben; de aantallen per onderwerp mogen niet als wereldwijd unieke families worden opgeteld.

De bestaande 18 lessen, opslagnaam, XP, diagnostiek, flirts, toetsverdeling en Moshpit blijven behouden. De diagnostische herkenning wordt niet uitgebreid met ongevalideerde tekstregels. De 1.9.0-proef met andere toelichtingen is niet als basis gebruikt: de actuele productiebron 1.8.0 is de basis van 1.10.0.

`npm run pabo:rich` controleert de catalogus, 29.000 gegenereerde instanties en evenveel foutmutaties, plus drie opeenvolgende reeksen per deelonderwerp met herladen en behoud van voortgang. Het streefgetal is geen automatische vrijgavevoorwaarde; correcte opgaven, expliciete tekorten en werkende regressiecontroles zijn dat wel. Niet toegelaten of nog niet ontworpen families worden niet fictief aangevuld om een doelgetal te bereiken.

# Pabo Rekenklaar: vraagontwerp en denkvariatie

**Versie 1.8.0 — 17 september 2026 — Edwin van der Plas / Wisik**

Doel: dezelfde wiskundige kennis vanuit verschillende kanten aanspreken, niet dezelfde som steeds anders aankleden.

## Ontwerpbron en uitbreiding

`src/pabo/reasoning-designs.js` bevat 36 eigen parameteriseerbare vraagontwerpen: 6 getalinzicht, 6 breuken vergelijken, 6 geheel/rest, 6 meten/meetkunde, 6 grafieken/tabellen en 6 formules. Een ontwerp is een andere denkhandeling; verschillende getallen tellen niet als extra ontwerpen. Tabellen, een getallenlijn, meetkundige schetsen en grafieken dragen rekeninformatie, geen decoratie.

De registratie heeft per ontwerp een leerdoel, rekenstructuur, denkhandeling, context, presentatie en een beargumenteerde rubric. De vraagzwaarte is een expertvoorspelling, **geen empirisch gekalibreerde moeilijkheid**. De nieuwe redeneringsvragen hebben voorspelde zwaarte 2–5; de bestaande directe basisvragen blijven staan. Niet elk onderdeel heeft op elke zwaarte evenveel verschillende ontwerpen.

De bronbestanden worden met `npm run pabo:reasoning:build` in de zelfstandige HTML ingebouwd. Er is geen externe AI-aanroep tijdens het oefenen. Het bestaande adres, opslagkenmerk, XP, lesvoortgang, domein-/toetsverdeling en mediastructuur blijven behouden.

## Vragen ontwikkelen

Verzamel uiteenlopende echte informatievormen: een plattegrond, label, recept, prijslijst, meetreeks, planning of leerlingredenering. Eigen foto's kunnen inspiratie bieden, zonder derden herkenbaar in de vragen op te nemen. Het gaat om wat iemand moet kiezen, controleren, reconstrueren of beredeneren, niet om een origineel verhaaltje alleen.

Ontwerpopdracht voor een volgende ronde:

> Stel eerst een reeks korte vraagontwerpen voor, nog geen complete opgaven. Benoem leerdoel, denkhandeling, presentatie en het verschil met bestaande ontwerpen. Varieer onder andere reconstrueren, grenzen bewaken, schatten, vergelijken, verklaren, tegenvoorbeelden geven, gegevens herstellen en plannen onder voorwaarden. Vermijd tegeldozen, vultijden, omslagpunten van tarieven en magazijnvoorraden als standaardrecept. Verwerp ontwerpen die alleen namen, voorwerpen of getallen wijzigen. Werk pas daarna de inhoudelijk verschillende ontwerpen uit met antwoord, uitleg en controleerbare rekendata. Controleer ook onderling welke ontwerpen alsnog dezelfde aanpak vragen.

Blijf binnen het beoogde rekenkader. Creativiteit is geen vrijbrief voor onnodig moeilijke taal, onrealistische situaties, verborgen aannamen of extra vakkennis. Beoordeel leerdoel, formulering, antwoord, uitleg, afbeelding, niveau en mogelijke foutredeneringen gezamenlijk.

## Selectie en eerlijke begrenzing

De bestaande 480 exacte vraagvingerafdrukken blijven behouden. Daarnaast blijven maximaal 96 sets **gehashte kenmerken** van aangeboden vragen lokaal in dezelfde browser bewaard: aanpak, familie, context, presentatie en onderwerp. Geen extra letterlijke antwoorden, naam of centraal profiel. Reset wist ook deze geschiedenis. De bewaarplaats wordt niet over browsers of apparaten gesynchroniseerd.

De selectie kiest binnen leerdoel, rekenmodus en nabij beschikbaar niveau. Nieuwe exacte opgaven gaan voor; dezelfde combinatie van rekenstructuur en denkhandeling krijgt waar mogelijk vijf tussenliggende vragen. Als daarvoor te weinig passend aanbod bestaat, wordt de afkoelperiode ontspannen. Een directe herhaling wordt dan nog steeds vermeden zodra er een passend alternatief is. `selectionInfo.semanticCooldownRelaxed` maakt die beperking controleerbaar. Dit is geen garantie dat een student nooit meer een verwante vraag ziet.

Binnen toetsen blijven exact unieke opgaven en maximaal drie per familie harde voorwaarden. Te weinig voorraad resulteert niet in een stille vaste terugvalvraag. Herstelvragen en controlevragen behouden hun doelgerichte didactische functie; de sprint heeft zijn eigen hoofdrekencontract.

## Rekenkundige en diagnostische veiligheid

De nieuwe ontwerpen geven hun rekendata expliciet mee. `reasoningExpected` controleert antwoorden op basis van die gegevens, deels door enumeratie of een alternatieve berekening. Nieuwe vraagteksten worden niet via tekstherkenning aan een diagnose of flirt gekoppeld: daarvoor is een afzonderlijk ontworpen en geteste foutmodel nodig. Bestaande diagnostiek blijft intact. Een antwoordcheck is nog geen bewijs dat elke formulering of didactische keuze optimaal is.

De controles omvatten varianten per ontwerp, opzettelijk fout gemaakte antwoorden en ontbrekende data, migratie, begrensde opslag, sessies met herladen, de bestaande volledige toetsroutes en browserbediening. Het openbare Backstage-auditbewijs bevat de resultaten en ook de aantallen ontspannen afkoelperiodes. Externe gebruikerstests en docentfeedback blijven nodig.

## Sorteren

Het handvat gebruikt Pointer Events voor muis, pen en aanraking; alleen het handvat blokkeert de scrollbeweging. De rest van de rij kan normaal scrollen. Knoppen blijven aanwezig, het handvat ondersteunt pijltjestoetsen, de focus volgt het verplaatste item en een statusmelding kondigt de nieuwe positie aan. Afbreken, loslaten buiten de lijst, wisselen van vraag en nakijken beëindigen het slepen. Na nakijken zijn alle verplaatsroutes geblokkeerd.

Browserautomatisering is geen fysieke iPhone-test. Chromium-aanraking wordt via de browserinvoer gesimuleerd; WebKit krijgt gecontroleerde Pointer Events. Werkelijke Safari- en beginschermbediening verdienen aanvullend een gebruikerstest.

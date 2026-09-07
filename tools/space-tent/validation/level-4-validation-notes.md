# Level 4 — Hoeken: inhoud en onafhankelijke controle

Bestand: `level-4.json`.

## Dekking en opbouw

De volledige PowerPoint Ruimtemeetkunde 1.4 is gelezen door alle XML-tekstelementen met lokale naam `t` te extraheren, inclusief de wiskundige `m:t`-elementen. De opbouw volgt 10.1 (cosinusregel en oppervlakte), 10.2 (hoeken tussen lijnen en evenwijdig verschuiven), 10.3 (loodrecht op vlak en loodrechte projectie), 10.4 (standvlak en standhoek).

- 4 blokken met elk 3 geïllustreerde theorie-inzichten.
- Per blok 4 hoofdvragen, 2 gerichte probes en 2 herstelvragen.
- 8 aparte levelcheckvragen, verdeeld over alle vier blokken en alle vier vaardigheidscategorieën.
- 1 papieren standhoekconstructie met een hulpfiguur op ware grootte, bewijseisen, berekening en grenssituatie.
- 40 vragen, waarvan 18 open numerieke vragen met methodeveld en 4 puntconstructies.
- Elke numerieke vraag vraagt twee decimalen en heeft `decimals: 2`.
- Antwoordposities zijn verdeeld; de specifieke diagnostische afleiders zijn overeenkomstig opnieuw gekoppeld.

## Uitgevoerde controles

`python validate-level-4.py` is uitgevoerd en geslaagd. De bijbehorende getallen staan in `level-4-validation.json`.

Alle 18 numerieke antwoorden zijn onafhankelijk opnieuw berekend vanuit de coördinaten van hun eigen opgavescène:

- Driehoekshoeken met inproduct, in plaats van de cosinusregel uit de uitleg.
- Driehoeksoppervlakten met kruisproduct, in plaats van ½ab sin C uit de uitleg.
- Hoeken tussen lijnen met hun richtingsvectoren.
- Lijn–vlakhoeken met een normaalvector en het inproduct.
- Vlak–vlakhoeken met de kleinste hoek tussen normaalvectoren.

Daarnaast zijn 86 scènes gecontroleerd op eindige coördinaten, bestaande puntnamen en niet-ontaarde kanten, en 68 vlakpolygonen op echte ruimtelijke coplanariteit. In de drie uitgebreide EJG-scènes zijn de voetpunten I gecontroleerd op I ∈ EJ, FI ⟂ EJ, GI ⟂ EJ en FI ⟂ FG. Evenwijdige verschuiving, drie projectieconstructies, ID-koppelingen, diagnostische afleiders en de scheiding tussen oefenen en levelcheck zijn ook gecontroleerd.

Belangrijke exacte uitkomsten:

- Hoek tussen EG en IB bij I midden AE: arccos(2/√10) ≈ 50,7684795164°.
- AG met het grondvlak van een kubus: arctan(1/√2) ≈ 35,2643896828°.
- EJG met ABFE bij ribbe 4 en J midden BF: arctan(√5) ≈ 65,9051574479°.
- EJG met ABFE bij ribbe 6 en BJ = 2: arctan(√52/4) ≈ 60,9828593754°.
- Het laatste voetpunt is I = (54/13, 0, 42/13).

## Didactische keuzes en bronprecisie

Pythagoras wordt alleen met een bewezen rechte hoek toegepast. De bronvoorwaarde voor een lijn loodrecht op een vlak is expliciet geformuleerd met twee snijdende vlaklijnen door het voetpunt. De onvolledige terloopse bronuitspraak over evenwijdigheid van lijn en vlak is niet overgenomen. De kleinste hoek en het complement met de normaal worden onderscheiden.

Een aanvankelijk meerduidige afleider bij de standhoek is vervangen: de hoek tussen twee afzonderlijk verschoven loodrechte richtingen kan immers dezelfde maat opleveren. De definitieve afleider ∠DAG meet aantoonbaar een andere hoek dan de standhoek ∠DAH.

De papieropgave legt expliciet uit dat je in een parallelprojectie geen schermhoek van 90° mag gebruiken als ware ruimtelijke loodlijn. De loodlijn wordt eerst in een hulpfiguur op ware grootte geconstrueerd en daarna naar de ruimtefiguur teruggebracht.

Dit is een inhoudelijke en wiskundige controle, geen empirische meting van leereffect of diagnostische betrouwbaarheid. Papierconstructies en geschreven methoden vragen zelfcontrole of beoordeling door een docent.

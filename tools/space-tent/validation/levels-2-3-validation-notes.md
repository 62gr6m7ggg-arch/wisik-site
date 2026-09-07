# Levels 2 and 3 — inhoud en validatie

Geleverd: `levels-2-3.json`, met 8 blokken (4 per level), 24 inzichtlessen, 64 oefen-/probe-/herstelvragen, 16 afzonderlijke levelcheckvragen en 2 volledige papierconstructies met 4-punts zelfbeoordeling. Totaal 80 unieke vragen: 28 numerieke open antwoorden, 47 meerkeuzevragen en 5 puntselecties. Alle theorieën en vragen hebben exacte coördinaatfiguren. Oplossingsgeometrie staat waar relevant uitsluitend in `revealScene`.

## Volgorde en dekking

Level 2 volgt les 1.2: hulpvlak bij lijn-vlaksnijding; doorsnederand en evenwijdige vlakken; snijpunten buiten het lichaam; gelijkvormigheid met expliciete richting van de lengtefactor. De buitenpuntenles introduceert de benodigde verhouding in het diagonaalvlak voordat zij numeriek wordt toegepast; het volgende blok generaliseert dit.

Level 3 volgt les 1.3: overdracht van doorsnedeconstructies naar prisma en piramide; loodrechte driehoekshoogte en oppervlakte; samengestelde inhoud als prisma min drie piramides; sinus/cosinus/tangens en inverse goniometrie. Het volledige uitgewerkte voorbeeld met gelijkzijdige zijde 6 en prismahoogte 8 heeft restinhoud 18√27, overeenkomstig de aangeleverde bron.

De PPTX-bestanden les 1.2 en les 1.3 zijn opnieuw uitgelezen via alle XML-nodes met lokale naam `t`, dus inclusief `m:t`. Daardoor zijn ook de oorspronkelijk ontbrekende formules en puntletters meegenomen. De extracties staan als `lesson-1-2-all-text.txt` en `lesson-1-3-all-text.txt` naast het bestand. Nieuwe voorbeelden zijn volledig gespecificeerd; de ontbrekende originele plaatjes zijn niet geraden.

## Diagnostiek

Ieder blok heeft precies één gerichte hypothese: ongeschikt hulpvlak; drie punten verwarren met drie randzijden; buitenpunten afwijzen; lengtefactor omkeren; kubusregels ongeoorloofd op piramide/prisma toepassen; schuine zijde als hoogte nemen; piramidefactor ⅓ vergeten; tangens omkeren. Alleen de specifiek benoemde foute keuze triggert de hypothese; de twee probes gebruiken andere situaties. De daadwerkelijke bevestiging en het uitstellen van feedback zijn verantwoordelijkheid van de bestaande runtime.

De volgorde van de antwoordopties is per vraag deterministisch gemengd; antwoord-ID's en diagnoseverwijzingen zijn daarna consequent hernummerd. De correcte positie is dus niet voortdurend dezelfde. Geen vraag toont vooraf een expliciete juiste snijlijn of berekende antwoordwaarde wanneer juist die constructie/waarde de opdracht vormt. Gegeven constructiedelen blijven natuurlijk zichtbaar waar vervolgconstructies daaruit moeten worden afgeleid.

## Uitgevoerde controle

`python build_levels_2_3.py` controleert het schema, unieke ID's, blockreferenties, afgeschermde aparte checks, de foutpatroonreferenties en dekking van inzicht/construeren/onderbouwen/rekenen per levelcheck.

`python validate_levels_2_3.py` is onafhankelijk van de generatieformules en gebruikt coördinaten, vectorproducten, lineaire algebra en scipy ConvexHull:

- Alle 28 numerieke antwoordsleutels onafhankelijk opnieuw berekend.
- 131 figuurvoorkomens gecontroleerd op eindige coördinaten, bestaande puntlabels en geldige lijnsegmenten.
- Alle 48 getekende vlakveelhoeken gecontroleerd op niet-degeneratie en coplanariteit.
- Volledige randpunten van 3 niet-triviale doorsneden onafhankelijk via alle ribbe-vlaksnijdingen teruggevonden: kubus, driehoekig prisma en scheve piramidedoorsnede.
- De buitenpunten X en Y en het uiteindelijke punt S van de piramideconstructie onafhankelijk met ruimtelijke lijnsnijding gecontroleerd.
- In 3 samengestelde-inhoudsvoorbeelden bevestigd dat convex-hull-inhoud van het resterende lichaam gelijk is aan prisma-inhoud min de drie tetraëders.

Alle numerieke lengtes/oppervlakken/inhouden vragen twee decimalen en hebben `decimals: 2`; hele-gradenopgaven hebben `decimals: 0`. `working: true` vraagt om een eigen rekenwijze. De korte redenering en de zelfstandige papierconstructie moeten door leerling/docent worden beoordeeld; selectie- en antwoordcontrole bewijzen op zichzelf geen zelfstandige tekenvaardigheid of tentamengereedheid.

Deze controle betreft de inhoudsassets en exacte geometrie. De uiteindelijke kaartweergave, touchbediening, adaptieve route en browseropmaak moeten door de root-agent in de geïntegreerde app worden gecontroleerd.

# Oefenatelier 1.5.0 — officiële oplossingsmethoden A–D

Bij ‘Bekijk de redenering, stap voor stap’ zijn alle afzonderlijke methoden uit de bestaande officiële correctievoorschriften beschikbaar, in dezelfde volgorde als de bron. Het aantal is per deelvraag gecontroleerd; een alternatief binnen één beoordelingsstap telt niet als extra methode. Er zijn geen eigen aanvullende bewijsroutes opgenomen.

| Tentamen | Deelvragen | Officiële methoden | Toegevoegde methoden |
| --- | ---: | ---: | ---: |
| A | 11 | 14 | 3 |
| B | 10 | 17 | 7 |
| C | 11 | 22 | 11 |
| D | 10 | 19 | 9 |
| Totaal | 42 | 72 | 30 |

Bronnen zijn de correctiepagina’s van de ongewijzigde PDF-bundels: A 12–18, B 11–16, C 11–17 en D 11–16 (fysieke PDF-pagina’s). De `variants-*.js`-bestanden leggen per deelvraag het aantal en de bronvolgorde vast. D1 heeft drie methoden; de derde gebruikt hulppunt F op de grote boog EB, de omtrekshoekstelling en koordenvierhoek BFED. D5b begint in de bron met de hoekconstructie; de cirkelconstructie is de tweede methode.

Elke methode heeft volledige stappen, passende figuren, stellingverwijzingen en de bijbehorende beoordelingspunten. Voor 27 aanvullingen zijn eigen figuurstappen toegevoegd; drie gebruiken een gecontroleerde volgorde van bestaande figuurstappen. Korte opmerkingen die alleen een inmiddels uitgewerkte methode aankondigden, zijn vervangen door de methodekeuze. Officiële beperkingen en waarschuwingen blijven beschikbaar.

De gekozen methode en de positie binnen elke methode worden lokaal bewaard. Het bestaande opslagschema en de opslagsleutel blijven behouden; notities, reflecties en import/export blijven werken. Bij bestaande voortgang opent D5b weer de oorspronkelijke cirkelconstructie en C4b weer de oorspronkelijke buitenhoekenroute. Het eigen oefententamen E en alle PDF-bestanden blijven inhoudelijk ongewijzigd. De browsermodulegraaf en stylesheet gebruiken versie 1.5.0; de koepelsite blijft 0.1.31.

## Verificatie

- `npm run meetkunde:check`: alle bestaande controles en nieuwe controles voor 72 methoden, scores, figuurstappen, methodekeuze en voortgang slagen.
- Extra meetkundige controles: F op de oorspronkelijke cirkel en de juiste halve hoek bij D1; de tweede gelijkzijdige constructie bij B6c; spiegeling bij C2b; verlengde raaklijn bij C4a; gelijke loodrechte afstanden bij C5a over het hele bewegingsinterval; de juiste richting van de raaklijn bij D5a; verborgen constructieantwoorden.
- De 27 aanvullende eindfiguren zijn gerenderd en visueel beoordeeld. Lange hoeklabels die elkaar raakten zijn vereenvoudigd; de uitlegtekst behoudt de volledige hoekrelaties.
- Publicatie volgt de bestaande GitHub/Cloudflare-route, met de verplichte volledige vrijgavecontrole vóór samenvoegen naar `main`.

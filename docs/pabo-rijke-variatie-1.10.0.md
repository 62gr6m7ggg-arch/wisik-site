# Pabo Rekenklaar 1.10.0 — rijke variatie

## Aanleiding en basis

De screenshots van 20 oktober laten terugkerende kaartjespakketten en sorteervragen zien. De productiebron is versie 1.8.0 op `fe7ff24c66435f4fc12c80f2c27f59bf2454a231`. De 36 bestaande denkontwerpen en de eerdere variatiemodule blijven intact. De ongepubliceerde 1.9.0-proef is niet overschreven of stilzwijgend meegenomen.

## Wijziging

- 180 aanvullende ontwerpen, tien in ieder van de bestaande achttien deelonderwerpen.
- Afwisseling in situaties en informatie: kassabonnen, recepten, verpakking, weeggegevens, dienstregelingen, budgetten, stroken, tijdlijnen, geometrische schetsen, coördinatenroosters, grafieken, pictogrammen en tabellen.
- Per ontwerp expliciete rekendata en een afzonderlijke herberekening van het antwoord.
- 52 expliciete equivalentiekoppelingen voorkomen dat verwante nieuwe uitvoeringen als onafhankelijke families worden geteld. De telling is bewust conservatief en mag niet als bewijs van leerwinst worden opgevat.
- De semanticahistorie remt herhaling over acht aangeboden vragen. Als het gebruikelijke niveauvenster is uitgeput, kan de selectie maximaal twee niveaus afwijken. Dat is zichtbaar in de selectiedata; het feitelijke niveau en de daarop gebaseerde score blijven behouden.
- De afgeronde-bezoekersaantallenvraag vraagt naar het kleinste én grootste mogelijke totaal, zodat een te ruim interval niet meer ook aan de vraag voldoet.
- Gerichte herstelvragen worden alleen gezocht in het relevante onderwerp en generatoren met bestaande gevalideerde diagnosemodellen. De nieuwe algemene vragen verdringen die herstelvragen niet en krijgen geen ongevalideerde diagnose.

## Eerlijke omvang

Het afgesproken streefgetal van 81 onafhankelijke families per deelonderwerp is niet gehaald. De huidige telling varieert tussen 7 en 18 families per onderwerp. De uitbreiding levert 129 extra onderwerp-familiekoppelingen, geen claim van 129 wereldwijd unieke rekenstructuren. De exacte aantallen en tekorten staan in `public/assets/data/pabo-variation-catalog.json`.

Dit is een publiceerbare inhoudelijke uitbreiding met openstaande omvangsdoelstelling, geen verklaring dat de volledige beoogde voorraad is gerealiseerd. Er zijn geen cosmetische varianten toegevoegd om de aantallen tot 81 op te vullen.

## Controle en vrijgave

De controles worden vóór publicatie uitgevoerd op de exacte kandidaat:

- `npm run pabo:rich`: 29.000 gegenereerde instanties en 29.000 foutmutaties, cataloguscontrole en 648 opgaven over drie opvolgende sessies per onderwerp met herladen.
- `npm run pabo:reasoning`: alle 216 ontwerpen, 40.440 varianten, 80.880 foutmutaties en 72 meer-sessie-routes, samen 3.600 vragen; behoud van XP, afgeronde lessen en begrensde lokale historie.
- Het bestaande `npm run build`: volledige vrijgavecontrole, 98 volledige toetsen, korte toetsen, oefenreeksen, alle diagnosepatronen, flirts, media, navigatie en overige Wisik-regressies.
- `Pabo rijke variatie vrijgave`: reproduceerbare bouw, alle ontwerpen en volledige toetsen in desktop-Chromium, twee mobiele Chromium-breedtes en mobiel WebKit. Dit is geen fysieke iPhone-test.
- Publicatie uitsluitend via de bestaande GitHub-PR naar `main`, daarna de bestaande Cloudflare Pages-koppeling en live bronvingerafdruk-/browsercontroles.

Een controle wordt pas als geslaagd beschreven wanneer de bijbehorende run daadwerkelijk slaagt. De lokale browserdownload is niet bruikbaar gebleken; browserbewijs komt daarom uit de bestaande GitHub Actions-testomgeving. De lokaal geslaagde afzonderlijke controles vervangen de volledige vrijgavecontrole niet.

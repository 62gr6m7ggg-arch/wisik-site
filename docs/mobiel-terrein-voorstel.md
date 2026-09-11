# Mobiele festivalwandeling — proefversie 1.0.0

Fred meldde dat de homepage op mobiel veel tekst en weinig zichtbaar terrein biedt. Deze proefversie maakt de ingangen herkenbaar en verkort de weg naar een activiteit.

Bij een schermbreedte tot en met 1000 pixels verschijnen een korte introductie, vier compacte polsbandjes en een verticale wandeling. Pabo Rekenklaar, Moshpit en Grabbelton staan vooraan. Daarna volgen de Space-tent, het Konijnenhol en de overige ingangen. De bordjes vermelden kort de activiteit en de status. De grote illustratie en het bordje vormen samen één link.

De uitklapbare lijst gebruikt dezelfde namen en bestemmingen als de wandeling. De bestaande uitgebreide desktopweergave blijft beschikbaar boven 1000 pixels. Wisselen tussen beide weergaven herstelt de oorspronkelijke navigatievolgorde. Zonder JavaScript blijven de gewone HTML-links en de uitgebreide lijst bruikbaar.

## Afbakening

- Alleen de homepage en een eigen CSS/JS-module veranderen; de bestaande apps en hun opgeslagen voortgang worden niet aangepast.
- Pabo Rekenklaar en de Space-tent gebruiken op mobiel hun bestaande app-ingang uit het centrale register.
- Kladblok blijft één centraal formulier; de illustratie is een link naar `/kladblok/`.
- Negen illustraties delen één WebP-bestand van circa 451 kB. Dat is 78% kleiner dan het oorspronkelijke PNG-bestand. De illustraties zijn decoratief; de zichtbare linktekst draagt de betekenis.
- De module heeft versie 1.0.0; de bestaande siteversie en productversies blijven gelijk.
- Dit voorstel gaat via een afzonderlijke preview en pull request. De productiehomepage wordt pas vervangen na akkoord op de proefversie.

## Controle

`npm run check` bevat de bestaande vrijgavecontroles en een extra runtimecontrole voor de mobiele navigatie: directe app-ingangen, de complete lijst, gelijke bestemmingen, toetsenbordvolgorde, openen via een lijst-URL en herhaald terugschakelen naar desktop. De test controleert gedrag met een DOM-fixture, niet de visuele weergave in een echte browser.

Nog uit te voeren op de preview: Safari op iPhone en een Android-browser, smal en breed scherm, liggende stand, vergroten van tekst en toetsenbordbediening. Controleer dat er geen horizontale schuifbalk is, alle bordjes leesbaar blijven en iedere afbeelding met bordje één ruime aantikbare ingang vormt.

Laat Edwin, Fred en twee andere mobiele bezoekers zonder uitleg drie taken uitvoeren: open Pabo Rekenklaar, vind een flirt en keer terug naar het terrein. Noteer waar iemand zoekt of twijfelt. De beslissing om dit live te zetten volgt op die beoordeling; illustraties alleen zijn nog geen bewijs dat mensen sneller hun weg vinden.

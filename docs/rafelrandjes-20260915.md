# Rafelrandjes — site-editie 0.1.28

## Indeling
De HBO-werkplaats (digitale Summer Course Bouwkunde/Civiele Techniek) is een concept
op de Rafelrandjes. De vaste inhoudelijke ingang is `/rafelrand/#hbo-werkplaats`.
De onderwijsroute `/hbo/` blijft bestaan en toont het geopende Space-hoofdpodium.
Een nieuwe optionele `data-maturity`-filter beperkt alleen de betreffende kaartlijst;
de complete lijst en onderwijsroutefilters behouden ook de aangekondigde concepten.
Het oude HBO-Summer-Course-anker verwijst zichtbaar naar de nieuwe werkplaats.

Op het terrein vormen Rafelrandjes en de werkplaats één `data-terrain-group`.
De bestaande mobiele navigatie verplaatst deze groep zoals de Space-tentgroep.
Spacetent, artiesten-ingang, toekomstbord en de andere geopende podia blijven intact.
Konijnenhol is een zelfstandig zijpad bij Spacetent, niet een onaffe leeractiviteit.
Zijn bestaande `/rafelrand/konijnenhol/`-URL blijft bewust geldig voor bladwijzers,
media en bestaande verwijzingen. De classificatie en de kruimelnavigatie zijn aangepast.
De VO-route toont nu het werkelijk geopende Euclides-naslagwerk; niet langer de
tegenstrijdige claim dat er nog geen openbare attractie is.

## Beeldtaal
Origineel CSS-schetsvel met onregelmatige scheurranden, zachte duimvegen, vouw,
lijntjes, plakband en een stempel. Textuur is decoratief, wordt niet door screenreaders
voorgelezen en kan geen klik onderscheppen. Het knippen gebeurt alleen op de
achtergrond; tekst en focusranden blijven vrij. Geen nieuwe geluiden of animaties.

Ontwerprichting van Edwin: de teksten van Prins S. en De Geit als inspiratie bij
cosmetische twijfel. Vertaling naar materiaalgevoel, speelsheid en eigenzinnigheid,
niet naar gekopieerde songregels, bandbeelden of een gesuggereerde samenwerking.
Bronnen voor deze interne ontwerpnotitie:
- https://prinssendegeit.nl/ (eigen toelichting op de band en Partijtje)
- https://lyrhub.com/en/track/Prins-S-en-De-Geit/Kladblok (geraadpleegde tekst)
Geen teksten, beelden, audio of externe fontbestanden van de band in de site.

## Testen en grenzen
`test-rafelrandjes.mjs` controleert classificatie, links, conceptstatus en de echte
kaartfilter. De bestaande mobiele DOM-test modelleert beide verplaatsbare groepen.
`check-rafelrandjes-browser.mjs` controleert de echte pagina's op vier browserscherm-
combinaties, van 320 tot 1440 pixels, ook zonder JavaScript en met toetsenbord.
De bestaande artiesten-ingangbrowserproef blijft een afzonderlijke regressietest.
Met LIVE_ORIGIN=https://wisik.nl toetsen beide scripts de gepubliceerde site.

De app-bron, opgaven, antwoorden, leerlogica, voortgangsopslag en inlogserver zijn
niet aangepast. De twee gedeelde scriptverwijzingen in Pabo-HTML krijgen alleen
het nieuwe site-cacheversienummer. Openbare auditbestanden worden opnieuw gegenereerd
na de wijziging. Er is geen nieuwe inhoudelijke of empirische leereffectaudit,
geen fysieke iPhone-gebruikstest en geen professionele toegankelijkheidsaudit.

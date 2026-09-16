# Pabo Rekenklaar 1.7.0 — variatie en inhoudelijke spreiding

## Aanleiding en scope

In 1.6.3 leidde een hoge adaptieve vraagzwaarte tot slechts één generator per domein. De vaste lijsten bij die generatoren hadden vaak maar drie of vier situaties. De laatste-twee-families-vermijding mocht na 35 pogingen worden losgelaten. Een technisch juiste vraag betekende daardoor nog geen goede volledige oefentoets.

Deze release verandert de vraagvoorraad en de selectie in Pabo Rekenklaar, niet de andere tenten of de gepubliceerde rekenflirts.

## Selectiecontract

De volledige toets behoudt 55 vragen: 17 hoofdrekenen en 38 uitwerken, inclusief vijf niet-meetellende proefvragen. De 50 meetellende vragen blijven over A/B/C/D verdeeld als 15/14/12/9. Eerst worden de bestaande 18 deelonderwerpen verdeeld; proefvragen kunnen de dekking van meetellende vragen niet vervangen. De vraagzwaarte wordt binnen het gekozen onderwerp aangepast. Een lagere werkelijke vraagzwaarte wordt niet als hoger geëtiketteerd.

Een inhoudelijk identieke vraag kan binnen één toets niet nogmaals worden gekozen. De identiteit omvat vraagtekst, tabel-/grafiek-/figuurgegevens, eenheden en sorteergegevens, maar niet een willekeurig vraag-id of de volgorde van meerkeuzeopties. Iedere vraagfamilie heeft over beide toetsdelen samen maximaal drie plaatsen. Bij een voorraadtekort stopt de selectie met een zichtbare melding; er komt geen stille vaste terugvalvraag.

Gewone oefenreeksen gebruiken eveneens de nieuwe selectie. Bij gericht leren mag dezelfde denkhandeling vaker terugkomen. Gerichte diagnostische controlevragen, herstelsets en de Moshpit behouden hun afzonderlijke contract; deze release schaft zinvolle herhaling daar niet af.

## Inhoud

Zestien aanvullende generatoren: een bestelling optimaliseren, twee restvoorwaarden combineren, afrondingsgrenzen terugvinden, een voorraad met breuken verwerken, breuken van verschillende gehelen vergelijken, een mengverhouding veranderen, twee procentuele veranderingen omkeren, een L-vorm omheinen, een tank vullen, gemiddelde reissnelheid inclusief pauze bepalen, een ontbrekende maat uit schaal en oppervlakte afleiden, samengestelde eenheden verwerken, een groepsgrootte uit gewogen gemiddelden bepalen, vanuit een grafiek extrapoleren, een figuurnummer terugzoeken en een kostenformule uit waarnemingen afleiden.

De kleine vaste gevorderde keuzelijsten zijn geparametriseerd. De bestaande en aanvullende vragen krijgen geen officieel RWT-moeilijkheidskeurmerk: de rubric blijft een expertinschatting. De aanvullende vragen krijgen niet automatisch de diagnostische interpretatie van een oudere vraag.

## Privacy en behoud

De bestaande opslagsleutel blijft behouden. Naam, XP, lessen, beheersing en diagnostiek worden niet gereset. Alleen maximaal 480 vraagvingerafdrukken worden toegevoegd, lokaal in dezelfde browser; geen extra letterlijke antwoorden en geen centrale registratie. Eerder getoonde vragen krijgen een lagere prioriteit. Als de bruikbare voorraad dat niet toelaat, mag de vermijding van vorige sessies wijken; de uitsluiting van duplicaten in de lopende toets en de familielimiet niet. Voortgang wissen verwijdert ook deze lijst.

## Vrijgavecontrole

De nieuwe negende vrijgavepoort `session-variation` vereist 98 volledige toetsroutes: 56 met de echte start-, weergave-, antwoord- en overgangsfuncties bij zeven antwoordprofielen, 40 met vaste vraagzwaartes 1–5, en twee opeenvolgende volledige toetsen. Daarnaast worden acht korte toetsen en 59 oefenreeksen uitgevoerd. De proef omvat bron-/rubriccontrole, canonieke antwoorden, harde duplicaat- en familielimieten, alle 18 deelonderwerpen, calculatorbeleid, herhaald renderen, negatieve mutaties, behoud van bestaande voortgang en begrensde lokale opslag. Resultaten en een reproduceerbare tracevingerafdruk staan in het openbare vrijgavebewijs.

De afzonderlijke browsercontrole maakt in Chromium (1280, 390 en 320 pixels) en WebKit (390 pixels) een volledige toets via de invoervelden en antwoordknoppen. Alle zestien aanvullende generatoren worden daarna weergegeven en beantwoord, met controles op zichtbare uitleg en horizontale overflow. Dit is browseremulatie, geen test op een fysieke iPhone.

Een geslaagde technische controle is geen onafhankelijke vakdidactische goedkeuring, geen empirische kalibratie, geen bewijs van leerwinst en geen garantie op slagen voor de RWT. Een nieuwe praktijktest door studenten en een rekendocent blijft nodig.

## Reproduceren

- `npm run pabo:variation:build` bouwt de drie variatiebronbestanden in de zelfstandige HTML in.
- `npm run pabo:variation` controleert generatoren en volledige sessies.
- `npm run audit:update` vernieuwt alle negen vrijgavepoorten en bindt het bewijs aan de HTML-vingerafdruk.
- `npm run build` weigert ontbrekend, gewijzigd of onjuist vrijgavebewijs.

Bronnen voor dit wijzigingsverslag: de eigen applicatiecode en de bijbehorende uitvoerbare tests. Het oorspronkelijke openbare toetskader is niet in deze release gewijzigd.

# Testresultaten Wisik 0.1.16

## Gerichte flirts in Pabo Rekenklaar 1.6.2

De VM-integratiecontrole `scripts/test-pabo-flirts.mjs` test alle 30 ketens van vast antwoord via classificatie en bewijsopbouw naar de juiste flirt. De 60 vaste opgaven hebben 120 afzonderlijk uitgerekende goede/kenmerkend foute antwoordchecks; 90 andere foutantwoorden leveren geen onterechte uitnodiging. Daarnaast zijn 60 toets-/sprintuitsluitingen en een werkelijk dubbelzinnige D04/D05-denkroute gecontroleerd. De ketens worden met dezelfde seed tweemaal herhaald. Eén aanwijzing of dezelfde fout opnieuw toont geen uitnodiging; een voldoende onderbouwd patroon wel.

Voor alle 30 codes wordt vervolgens de echte spelerfunctie uitgevoerd: titel, toelichting, MP4, poster, VTT, transcript en herstelsetcode moeten aansluiten. Opzettelijk verkeerde classificatie, verkeerde filmselectie, fout-positieve uitnodiging, verwisselde codes, gewijzigde titel en ontbrekende/gewijzigde inhoudsreview laten de tests terecht falen. Openen en sluiten wijzigen geen voortgang, XP of diagnostiek.

Inhoudelijke review na beeldherstel: 19 films sluiten aan, 11 hebben kanttekeningen en er zijn geen open beeldmismatches. C01 toont 100×100 vakjes, beide lengtefactoren en een vergroot vakje van 1 cm²; C04 toont twee congruente driehoeken die een parallellogram vormen. Deze status blijft afzonderlijk zichtbaar naast de acht technische poorten. Bestandsvingerafdrukken bewaken catalogus, misconceptbeschrijving, film, poster, VTT en transcript. Volledige scripts en minimaal zes beeldmomenten per film zijn beoordeeld; de audio is niet onafhankelijk beluisterd. Het is geen empirische meting van diagnostische fout-positieven of leerwinst.

De C01/C04-correcties zijn reproduceerbaar met `scripts/repair-flirt-diagrams.py`. Van de gecodeerde MP4's zijn intro, opbouw, kernuitleg en afsluiting opnieuw bekeken, inclusief de overgangsframes. De illustraties houden de ondertitelzone vrij. C01 blijft 1.381 frames (55,24 s), C04 1.223 frames (48,92 s video / 48,928005 s bestand), beide 1080p25 H.264/yuv420p. De volledige AAC-audiopakketten hebben vóór en na herstel dezelfde SHA-256; beide films decoderen volledig zonder fouten. C01-ondertitel “100 cms” is gecorrigeerd naar “100 cm”, zonder gewijzigde tijdstippen. Alleen deze twee inhoudsoordelen en hun gewijzigde bestandsvingerafdrukken zijn vernieuwd; de overige 28 beoordelingen blijven behouden.

Ook gecontroleerd: Nederlandse ondertiteling en transcript, geen autoplay, videobediening in de focustrap, stoppen en vrijgeven van media bij sluiten, behoud van de oefenreeks en focus, late netwerkresponsen na sluiten of vervangen van het venster, en een bruikbare herstelroute bij netwerk- of afspeelfouten. Dit is een runtimecontrole met DOM-doubles, geen visuele browsertest of test op een echte iPhone.

## Zichtbaarheid Backstage-vrijgavecontrole

Gecontroleerd:

- de actuele vrijgavestatus staat direct in de Backstage-hero en vóór de lange roadie-sectie;
- een prominente knop en beide Backstage-ingangen op de homepage verwijzen rechtstreeks naar `#vrijgavecontrole`;
- de vaste navigatie bedekt de sprongbestemming niet;
- zonder JavaScript blijft een directe link naar het machineleesbare bewijs beschikbaar;
- de Backstage-HTML en het auditrapport gebruiken expliciete hervalidatie-/no-cache-regels;
- de acht technische detailcontroles en 30 inhoudelijke beoordelingen zijn compact uitklapbaar; eventuele beeldmismatches worden direct gemeld, met een afzonderlijke telling van resterende kanttekeningen.

## Deterministische Pabo-vrijgavecontrole

Geslaagd:

- 17.000 vraaginstanties in 170 generatorcombinaties;
- 3.500 rubricselecties;
- nul terugvalvragen en nul vrijgavefouten;
- dezelfde kwaliteitscontrole tweemaal reproduceerbaar met seed `12062026`;
- 600 grafiekinstanties gecontroleerd op technische schaal-, raster-, mobiele afstands- en SVG-regels;
- 30 diagnostische patronen en 1.200 gerichte controlevragen;
- 8.865 natuurlijke diagnostische terugclassificaties;
- 8.863 eenduidige matches;
- twee inhoudelijk dubbelzinnige antwoorden correct zonder diagnose gehouden;
- natuurlijke dekking 30 van 30 patronen;
- openbaar Backstage-bewijs gekoppeld aan de SHA-256-vingerafdruk van de geteste appbron.

## Statische kwaliteitscontrole

Geslaagd:

- 42 HTML-pagina's gecontroleerd;
- verplichte taal-, viewport- en titelgegevens aanwezig;
- geen dubbele statische id's;
- interne paden bestaan;
- JavaScript-syntaxis geldig;
- Wisik-versies in code, productpagina en formulier zijn consistent;
- Pabo-vrijgavecontrole en publiek auditbewijs actueel;
- `genBConversions` exact één keer gedeclareerd;
- afgekeurde RWT 3.1-verwijzing afwezig;
- officiële RWT 2.2-verwijzing aanwezig.

## Moshpit en Grabbelton

Na de eerste publicatie zijn alle 120 assets via HTTPS bereikbaar bevonden met passende MIME-types. MP4-byte-ranges zijn voor A01, B01, C01 en D01 gecontroleerd (HTTP 206). De hosting overschrijft voor MP4/JPEG de gewenste cacheheader met vier uur browsercache; daarom krijgen alle speler-assets vanaf 0.1.13 een geteste versieparameter. De 30 cataloguspaden blijven ongewijzigd. C01/C04 gebruiken vanaf Wisik 0.1.16 de herstelde beelden; de andere 28 MP4's zijn ongewijzigd.

Festivalrelease v1: alle 30 aangeleverde MP4's zijn met ffprobe gelezen en met ffmpeg volledig gedecodeerd zonder fouten. Ze gebruiken H.264/avc1 (yuv420p, 1080p25) en AAC-LC, met faststart. De duur is 45,016–55,240 seconden; de catalogusduur is correct afgerond. Alle 30 posters zijn leesbaar en alle 30 VTT's zijn parseerbaar (383 cues, zonder ongeldige tijdstippen, overlap of overschrijding van de filmduur). D07 bevat ook productienotities in het aangeleverde transcript; dit bekende redactionele restant is geen technische releaseblokkade. Dit is geen didactische herbeoordeling of bewijs van afspelen op een echte iPhone.

Automatisch gecontroleerd:

- Moshpit verwijst naar de ene bestaande 60-seconden-sprint en bevat geen eigen vragenbank, timer of vraaggenerator;
- de sprint begint pas na een bewuste tweede startklik in Pabo Rekenklaar;
- 2.250 extra sprintvragen blijven zonder terugval beperkt tot korte hoofdrekenvragen in de domeinen A, B en C;
- sprintantwoorden beïnvloeden geen gewone beheersing, dagdoel, foutenlijst of diagnostiek;
- de klok gebruikt werkelijk verstreken tijd en blijft daardoor betrouwbaarder na een mobiel achtergrondtabblad;
- Grabbelton gebruikt één centrale catalogus met alle 30 gepubliceerde flirts uit festivalversie v1;
- de catalogus accepteert zonder vaste bovengrens 1, 30 en 45 geldige publicaties;
- alleen gepubliceerde video’s met geldig polsbandje, bestaande misconceptcode, toegestane bron, Nederlandse ondertiteling en transcript worden selecteerbaar;
- de trekking geeft voorrang aan een voldoende onderbouwde misconceptcode, vermijdt directe herhaling wanneer er een alternatief is en geeft geen diagnose af;
- beide zijpodia zijn zichtbaar vanaf het terrein én op mobiel, staan eenmaal in de sitemap en worden in Backstage verantwoord.

## Backstage: missie en roadie

Automatisch gecontroleerd:

- de missie **Mijn missie is wiskunde leuk maken** staat prominent in Backstage;
- de moodboardzin **Wiskunde hoeft niet stil te zitten** is opgenomen;
- Edwin van der Plas wordt benoemd als initiatiefnemer en roadie achter Wisik;
- het HAN-portret is uitsluitend via de grote festivalachtige videokaart bereikbaar;
- de eerdere losse, dubbele videoknop is verwijderd en exact één videolink verwijst naar `https://youtu.be/JygCTgAxcsk`;
- de aangeleverde festivalfoto staat als lokale kaartachtergrond ingesteld, met aparte desktop- en mobiele uitsneden;
- de fotokaart gebruikt een donkere ondergradient en tekstschaduw voor leesbare tekst;
- de externe videolink opent veilig in een nieuw tabblad en heeft een toegankelijke naam;
- Wisik laadt geen YouTube-iframe, autoplaycode of externe thumbnail voordat de bezoeker zelf klikt;
- de videokeuze en het openen van YouTube worden zichtbaar toegelicht;
- tablet-, smalscherm- en verminderde-bewegingsinstellingen zijn aanwezig;
- het onderscheid tussen persoonlijke introductie en institutionele goedkeuring blijft expliciet.

## Pabo Rekenklaar: uitgang naar Wisik

Automatisch gecontroleerd:

- het klikbare Wisik-logo verwijst naar het hoofddomein;
- de vaste bovenbalk bevat een expliciete terugweg naar het Wisik-terrein;
- de mobiele vormgeving houdt de uitgang zichtbaar;
- vóór vertrek wordt een aanvullend lokaal voortgangssnapshot opgeslagen;
- de bron-URL en attractieversie kunnen aan een Kladbloknotitie worden toegevoegd.
- de bridge ontleent het versienummer aan de app zelf en bevat geen verouderde tweede versiebron.

## Kladblokfunctie

Automatisch gecontroleerd:

- onderaan het terrein staat geen tweede formulier meer, maar één duidelijke doorgang naar `/kladblok/`;
- de losse Kladblokpagina is het enige centrale formulier;
- directe HTTPS-formulierpost naar `kladblok@wisik.nl` via FormSubmit;
- POST-methode en vaste bedankroute;
- alle gebruikersvelden hebben een bruikbare naam;
- berichtlengte minimaal 10 en maximaal 2.000 tekens;
- optioneel e-mailadres gebruikt browservalidatie;
- honeypot aanwezig;
- FormSubmit-spamcontrole niet uitgeschakeld;
- externe verwerking en bewaartermijn zichtbaar;
- Content-Security-Policy staat alleen de noodzakelijke externe formulierpost toe;
- geen afhankelijkheid van betaalde Cloudflare Email Sending;
- nergens in de publieke site staat nog een oud Kladblokformulier, een Turnstile-element, de Cloudflare-sleutelmelding of Kladblok-API-code;
- bronpagina en attractieversie worden automatisch ingevuld wanneer die context beschikbaar is.

## Safari-cachefix

Automatisch gecontroleerd:

- alle sitepagina's laden de gedeelde scripts via versiegebonden URL's;
- de terreinpagina omzeilt daardoor definitief eerder gecachte Kladbloklogica;
- de directe formulierklasse wijkt af van de klasse waarop een oudere scriptversie reageerde;
- het actuele script herstelt een eventueel eerder uitgeschakelde verzendknop;
- terugkeer via de iOS-navigatiecache laat de knop bruikbaar;
- JavaScript krijgt geen cacheduur van zeven dagen meer;
- de gedeelde CSS wordt bij elk bezoek hervalideerd, naast de versiegebonden URL;
- een brede assets-cache-regel kan de JavaScriptinstelling niet overschrijven.

## Responsieve controle

Automatisch afgedwongen zijn de viewportinstelling, mobiele breekpunten, versiegebonden vormgeving, toegankelijke knoppen en de aanwezigheid van beide zijpodia. Het historische bestand `tests/Wisik_v0.1_browsertest.json` geldt nadrukkelijk niet als actueel browserbewijs voor 0.1.13. Na publicatie horen de nieuwe Moshpit- en Grabbeltonroutes daarom nog op de live site te worden gecontroleerd op een smal scherm, inclusief horizontale overflow, toetsenbordfocus en consolefouten.

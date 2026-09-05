# Testresultaten Wisik 0.1.11

## Zichtbaarheid Backstage-vrijgavecontrole

Gecontroleerd:

- de actuele vrijgavestatus staat direct in de Backstage-hero en vóór de lange roadie-sectie;
- een prominente knop en beide Backstage-ingangen op de homepage verwijzen rechtstreeks naar `#vrijgavecontrole`;
- de vaste navigatie bedekt de sprongbestemming niet;
- zonder JavaScript blijft een directe link naar het machineleesbare bewijs beschikbaar;
- de Backstage-HTML en het auditrapport gebruiken expliciete hervalidatie-/no-cache-regels;
- de zes detailcontroles zijn compact uitklapbaar en de kerncijfers hebben begrijpelijke labels.

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

- 12 HTML-pagina's gecontroleerd;
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

Automatisch gecontroleerd:

- Moshpit verwijst naar de ene bestaande 60-seconden-sprint en bevat geen eigen vragenbank, timer of vraaggenerator;
- de sprint begint pas na een bewuste tweede startklik in Pabo Rekenklaar;
- 2.250 extra sprintvragen blijven zonder terugval beperkt tot korte hoofdrekenvragen in de domeinen A, B en C;
- sprintantwoorden beïnvloeden geen gewone beheersing, dagdoel, foutenlijst of diagnostiek;
- de klok gebruikt werkelijk verstreken tijd en blijft daardoor betrouwbaarder na een mobiel achtergrondtabblad;
- Grabbelton gebruikt één centrale catalogus en toont nu eerlijk nul gepubliceerde filmpjes;
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

Automatisch afgedwongen zijn de viewportinstelling, mobiele breekpunten, versiegebonden vormgeving, toegankelijke knoppen en de aanwezigheid van beide zijpodia. Het historische bestand `tests/Wisik_v0.1_browsertest.json` geldt nadrukkelijk niet als actueel browserbewijs voor 0.1.11. Na publicatie horen de nieuwe Moshpit- en Grabbeltonroutes daarom nog op de live site te worden gecontroleerd op een smal scherm, inclusief horizontale overflow, toetsenbordfocus en consolefouten.

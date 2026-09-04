# Testresultaten Wisik 0.1.6

## Statische kwaliteitscontrole

Geslaagd:

- 10 HTML-pagina's gecontroleerd;
- verplichte taal-, viewport- en titelgegevens aanwezig;
- geen dubbele statische id's;
- interne paden bestaan;
- JavaScript-syntaxis geldig;
- Wisik-versies in code, productpagina en formulier zijn consistent;
- Pabo Rekenklaar 1.6.0 opgenomen;
- `genBConversions` exact één keer gedeclareerd;
- afgekeurde RWT 3.1-verwijzing afwezig;
- officiële RWT 2.2-verwijzing aanwezig.

## Pabo Rekenklaar: uitgang naar Wisik

Automatisch gecontroleerd:

- het klikbare Wisik-logo verwijst naar `https://wisik.nl/`;
- de sticky bovenbalk bevat een expliciete knop **Terug naar het Wisik-terrein**;
- op mobiele schermen wordt die knop compact weergegeven als **Terrein**;
- op zeer smalle schermen maakt de bovenbalk ruimte zonder de uitgang te verbergen;
- vóór vertrek worden lokale voortgang en context expliciet opgeslagen;
- opslag vindt ook plaats bij `pagehide` en wanneer de browser naar de achtergrond gaat;
- de bron-URL, het actieve onderdeel en Pabo-versie 1.6.0 worden in de browsersessie geregistreerd;
- de interne QA-metadata bevat de canonieke Wisik-URL en gedeelde contextsleutel.

## Kladblokfunctie

Automatisch gecontroleerd:

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
- geen overbodige Pages Functions of Turnstile-code;
- bronpagina, product, productversie en actief onderdeel worden automatisch ingevuld wanneer die context beschikbaar is;
- Pabo Rekenklaar wordt dan automatisch als attractie geselecteerd en in het e-mailonderwerp opgenomen.

## Safari-cachefix

Automatisch gecontroleerd:

- het Kladblok laadt `site-data.js` en `site.js` via een nieuwe versiegebonden URL;
- de directe formulierklasse wijkt af van de klasse waarop een oudere scriptversie reageerde;
- het actuele script herstelt een eventueel eerder uitgeschakelde verzendknop;
- terugkeer via de iOS-navigatiecache laat de knop bruikbaar;
- JavaScript krijgt geen cacheduur van zeven dagen meer;
- een brede assets-cache-regel kan de JavaScriptinstelling niet overschrijven.

## Responsieve browsertest

De bestaande interfacecontroles blijven van toepassing, waaronder:

- homepage en Pabo-zone zichtbaar;
- attractieregister rendert de kaarten;
- routekeuzedialoog opent en sluit;
- PABO-filter werkt;
- mobiel menu opent en sluit;
- geen horizontale overflow bij 390 pixels;
- geen onverwachte consolefouten.

Zie `tests/Wisik_v0.1_browsertest.json`.

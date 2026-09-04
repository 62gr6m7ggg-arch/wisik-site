# Testresultaten Wisik 0.1.5

## Statische kwaliteitscontrole

Geslaagd:

- 10 HTML-pagina's gecontroleerd;
- verplichte taal-, viewport- en titelgegevens aanwezig;
- geen dubbele statische id's;
- interne paden bestaan;
- JavaScript-syntaxis geldig;
- Wisik-versies in code en formulier zijn consistent;
- Pabo Rekenklaar 1.5.9 opgenomen;
- `genBConversions` exact één keer gedeclareerd;
- afgekeurde RWT 3.1-verwijzing afwezig;
- officiële RWT 2.2-verwijzing aanwezig.

## Kladblokfunctie

Automatisch gecontroleerd:

- directe HTTPS-formulierpost naar `kladblok@wisik.nl` via FormSubmit;
- POST-methode en vaste bedankroute;
- alle velden hebben een bruikbare naam;
- berichtlengte minimaal 10 en maximaal 2.000 tekens;
- optioneel e-mailadres gebruikt browservalidatie;
- honeypot aanwezig;
- FormSubmit-spamcontrole niet uitgeschakeld;
- externe verwerking en bewaartermijn zichtbaar;
- Content-Security-Policy staat alleen de noodzakelijke externe formulierpost toe;
- geen afhankelijkheid van betaalde Cloudflare Email Sending;
- geen overbodige Pages Functions of Turnstile-code.

## Safari-cachefix

Automatisch gecontroleerd:

- het Kladblok laadt `site-data.js` en `site.js` via een nieuwe versiegebonden URL;
- de directe formulierklasse wijkt af van de klasse waarop de oude scriptversie reageerde;
- het actuele script herstelt een eventueel eerder uitgeschakelde verzendknop;
- terugkeer via de iOS-navigatiecache laat de knop bruikbaar;
- JavaScript krijgt geen cacheduur van zeven dagen meer;
- een brede assets-cache-regel kan de JavaScriptinstelling niet overschrijven.

## Responsieve browsertest

De bestaande 12 gerichte interfacecontroles blijven van toepassing:

- homepage opgebouwd;
- Pabo-zone zichtbaar;
- attractieregister rendert twee kaarten;
- routekeuzedialoog opent en sluit;
- PABO-filter werkt;
- mobiel menu opent en sluit;
- geen horizontale overflow bij 390 pixels;
- geen onverwachte consolefouten.

Zie `tests/Wisik_v0.1_browsertest.json`.

## Eenmalige productiestap

FormSubmit vereist bij het eerste gebruik bevestiging van het ontvangstadres. De eerste echte testinzending kan daarom een activatiemail opleveren. Na bevestiging worden de bewaarde eerste inzending en volgende inzendingen per e-mail bezorgd.

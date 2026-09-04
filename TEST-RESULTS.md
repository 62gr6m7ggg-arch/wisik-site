# Testresultaten Wisik 0.1.0

## Statische kwaliteitscontrole

Geslaagd:

- 10 HTML-pagina's gecontroleerd;
- verplichte taal-, viewport- en titelgegevens aanwezig;
- geen dubbele statische id's;
- interne paden bestaan;
- JavaScript-syntaxis geldig;
- Pabo Rekenklaar 1.5.9 opgenomen;
- `genBConversions` exact één keer gedeclareerd;
- afgekeurde RWT 3.1-verwijzing afwezig;
- officiële RWT 2.2-verwijzing aanwezig.

## Kladblokfunctie

Met gemockte Cloudflare-responsen geslaagd:

- geldige inzending;
- Turnstile-gate;
- e-mailpayload inclusief optionele Reply-To;
- afwijzing van te korte notities;
- neutrale honeypot-afhandeling.

## Responsieve browsertest

12 gerichte controles geslaagd:

- homepage opgebouwd;
- Pabo-zone zichtbaar;
- attractieregister rendert twee kaarten;
- routekeuzedialoog opent en sluit;
- PABO-filter werkt;
- mobiel menu opent en sluit;
- geen horizontale overflow bij 390 pixels;
- geen onverwachte consolefouten.

De test is uitgevoerd met Chromium via Playwright op een desktopviewport van 1440 × 1000 en een mobiele viewport van 390 × 844. Zie `tests/Wisik_v0.1_browsertest.json`.

## Nog niet end-to-end getest

De daadwerkelijke aflevering via Cloudflare Email Service kan pas worden getest nadat het domein, de Turnstile-widget, het geverifieerde ontvangstadres en de Cloudflare-secrets zijn ingesteld.

# Wisik.nl — siteprototype 0.1.0

Dit pakket bevat een eerste werkende, responsieve koepelsite voor Wisik:

- festival-/pretparkachtige homepage;
- zichtbare onderwijsroutes VO, PABO en HBO;
- ontwikkelstatus via MainStage, bouwplaats en Rafelrand;
- centrale attractieregistratie in `public/assets/js/site-data.js`;
- Pabo Rekenklaar 1.5.9 onder `public/apps/pabo-rekenklaar/`;
- afzonderlijke routepagina's;
- Backstage-pagina voor kwaliteit en verantwoording;
- Wisik-Kladblok met een Cloudflare Pages Function voor e-mailverzending;
- mobiele navigatie en een gewone lijstweergave naast de terreinplattegrond;
- automatische kwaliteitscontrole.

## Lokaal bekijken

De statische pagina's zijn direct te serveren:

```bash
python -m http.server 8000 --directory public
```

Open daarna `http://localhost:8000`.

Voor de Cloudflare Functions:

```bash
npm install
npm run preview
```

Het Kladblok verzendt pas nadat de vereiste Cloudflare-variabelen en secrets zijn ingesteld.

## Kwaliteitscontrole

```bash
npm run check
```

De controle test onder meer:

- HTML-basisstructuur;
- dubbele id's;
- interne links;
- JavaScript-syntaxis;
- aanwezigheid van Pabo Rekenklaar 1.5.9;
- exact één declaratie van `genBConversions`;
- afwezigheid van de afgekeurde RWT 3.1-bron;
- aanwezigheid van de officiële RWT 2.2-verwijzing.

Zie `DEPLOYMENT.md` voor publicatie op Cloudflare Pages.

# Wisik.nl — versie 0.1.6

Wisik is een responsieve koepelsite in festival-/pretparkstijl voor rekenen en wiskunde.

De repository bevat onder meer:

- de festivalachtige homepage en terreinplattegrond;
- zichtbare onderwijsroutes VO, PABO en HBO;
- ontwikkelstatus via MainStage, bouwplaats en Rafelrand;
- een centraal attractieregister in `public/assets/js/site-data.js`;
- Pabo Rekenklaar 1.6.0 onder `public/apps/pabo-rekenklaar/`;
- een permanente, mobiele terugweg vanuit Pabo Rekenklaar naar het Wisik-terrein;
- lokale opslag van Pabo-voortgang vóór het verlaten van de attractie;
- automatische bronpagina-, product-, onderdeel- en versiecontext voor het Wisik-Kladblok;
- afzonderlijke routepagina's;
- Backstage voor kwaliteit en verantwoording;
- het Wisik-Kladblok als gratis HTML-formulier via FormSubmit;
- Cloudflare Email Routing voor `kladblok@wisik.nl`;
- een vaste terugweg vanuit Pabo Rekenklaar naar het Wisik-terrein;
- automatische bronpagina- en attractieversieregistratie in het Kladblok;
- een cachebestendige Kladblokroute voor Safari en andere mobiele browsers;
- mobiele navigatie en een gewone lijstweergave naast de terreinplattegrond;
- automatische kwaliteitscontrole bij iedere wijziging.

## Lokaal bekijken

```bash
python -m http.server 8000 --directory public
```

Open daarna `http://localhost:8000`.

## Kwaliteitscontrole

```bash
npm run check
```

De controle test onder meer:

- HTML-basisstructuur en interne links;
- dubbele id's;
- JavaScript-syntaxis;
- versiegebonden scripts en korte JavaScript-caching op het Kladblok;
- Kladblokvelden, honeypot, succesroute en Content-Security-Policy;
- automatische Kladblokcontext vanuit Pabo Rekenklaar;
- zichtbare desktop- en mobiele terreinuitgangen;
- lokale opslag bij vertrek, `pagehide` en achtergrondwissel;
- afwezigheid van overbodige Kladblok-API-code en betaalde e-mailafhankelijkheden;
- Pabo Rekenklaar 1.6.0;
- exact één declaratie van `genBConversions`;
- afwezigheid van de afgekeurde RWT 3.1-bron;
- aanwezigheid van de officiële RWT 2.2-verwijzing.

Zie `DEPLOYMENT.md` voor de publicatie- en beheerroute.

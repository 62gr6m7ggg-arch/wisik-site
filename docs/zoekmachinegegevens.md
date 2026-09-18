# Zoekmachinegegevens van Wisik

## Afbakening

De homepage en de informatiepagina van iedere **open hoofdtent** krijgen statische
JSON-LD en één canonical naar hun eigen openbare URL. Nu zijn dat Pabo Rekenklaar,
Space-tent / Ruimteklaar en Meet Euclides & Friends. Voor Euclides zijn
informatiepagina en app hetzelfde. De aparte Pabo- en Space-apps worden niet
gewijzigd; hun oefenlogica, voortgang en bestaande vrijgavebewijzen blijven intact.

Deze gegevens zijn al aanwezig in de geleverde HTML, zonder een browser-script,
extra netwerkverzoek, cookie of externe dienst. De body, vormgeving en navigatie
blijven ongewijzigd. Geen site- of appversiebump nodig voor alleen statische headmetadata.

## Eén bron voor de tenten

- `public/assets/js/site-data.js` blijft het enige attractieregister. Naam en
  product-/app-URL komen daaruit. Alleen `maturity: "mainstage"` met status `open`
  of `openingsklaar` wordt als beschikbare hoofdtent beschreven.
- De paginatitel en omschrijving worden uit de bestaande HTML-head gelezen.
  Die hoeven dus niet nog eens in een JSON-LD-record te worden bijgehouden.
- `src/site-metadata.json` bevat uitsluitend stabiele sitegegevens: domein,
  sitenaam, taal, maker en algemene sitepagina's. Het is geen tweede tentenlijst.
- De sitemap combineert die algemene pagina's met open zijpodia uit
  `WISIK_VENUES` en hoofdtentpagina's uit `WISIK_TOOLS`. De bestaande twaalf
  sitemap-URL's zijn behouden. Geen test-/artiesten-ingang of concept-app toegevoegd.

De homepage beschrijft `WebSite`, `Person` en `WebPage`. Tentpagina's beschrijven
`WebPage` en de combinatie `WebApplication` / `LearningResource`. Alleen waar er
al een zichtbaar kruimelpad staat, wordt een overeenkomstige `BreadcrumbList`
gegenereerd. Geen verzonnen organisatie, beoordelingen, sterren, officiële
erkenning of gegarandeerde leerresultaten. Ook geen afzonderlijke oefeningen,
versienummers, les-/videaantallen of automatisch opgehoogde wijzigingsdatums.

## Onderhoud en publiceren

```bash
npm run seo:build
npm run check
```

`seo:build` werkt alleen het gemarkeerde SEO-blok in de head en `sitemap.xml` bij.
Deze gegenereerde bestanden worden samen met de bronwijziging gecommit. Een
gewone `npm run check` is read-only en weigert ontbrekende of verouderde uitvoer.
Cloudflare's bestaande `npm run build` voert via `prebuild` automatisch dezelfde
generator uit en daarna alle bestaande vrijgavecontroles. Geen workflow of
branchbeveiliging afgezwakt of omzeild.

Bij een nieuwe tent: registreer die in de bestaande lijst en maak de gewone
openbare informatie-/app-pagina's. Geef de informatiepagina een passende titel
en metaomschrijving. Daarna genereert bovenstaande opdracht automatisch de
JSON-LD en sitemapvermelding. Bij naams- of URL-wijzigingen gebeurt hetzelfde.
Bij sluiten of verplaatsen ruimt de generator het eigen oude SEO-blok op.
Een **301-doorverwijzing bij een echte verhuizing blijft een aparte beheeractie**;
de generator mag niet zelfstandig bezoekerlinks of redirects veranderen.

Gewone oefen-, CSS-, feedback- en voortgangswijzigingen vragen geen handmatige
JSON-LD-wijziging. Een wijziging in doelgroep of onderwijsniveau vraagt nog wel
inhoudelijke afstemming van de zichtbare tentbeschrijving. De generator kan de
juistheid van zulke menselijke beschrijvingen niet zelfstandig vaststellen.

## Controle en grenzen

`seo:check` controleert bronbinding, herhaalbaarheid, geldige JSON, unieke entiteiten,
één canonical, geen `noindex`, beschikbare lokale paden en veilige JSON-inbedding.
Regressies simuleren toevoegen, hernoemen, verplaatsen en sluiten van een tent.
Ook wordt gecontroleerd dat de bestaande HTML buiten het beheerde blok gelijk blijft.

Schema.org-validiteit is niet hetzelfde als geschiktheid voor Google-rich-results.
Voor een software-app-rich-result stelt Google extra eisen, onder meer een echte
review of beoordeling. Die worden niet gefabriceerd. De appmarkering is hier
een semantische beschrijving, geen belofte van sterren of een uitgebreid resultaat.
`LearningResource` levert op zichzelf geen afzonderlijk Google-rich-result op.

De lokale controles zijn geen Google Rich Results Test of Search Console-inspectie.
Daadwerkelijke indexering, vertoningen, klikken en een effect op vindbaarheid zijn
alleen later te beoordelen; deze implementatie garandeert geen hogere ranking.

Bronnen geraadpleegd op 18 september 2026:

- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://developers.google.com/search/docs/appearance/structured-data/software-app
- https://schema.org/LearningResource
- https://schema.org/WebApplication

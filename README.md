# Wisik.nl — versie 0.1.15

Wisik is een responsieve koepelsite in festival-/pretparkstijl voor rekenen en wiskunde.

De repository bevat onder meer:

- de festivalachtige homepage en terreinplattegrond;
- zichtbare onderwijsroutes VO, PABO en HBO;
- ontwikkelstatus via MainStage, bouwplaats en Rafelrand;
- een centraal attractieregister in `public/assets/js/site-data.js`;
- een apart zijpodiaregister dat Moshpit en Grabbelton naar hun canonieke bron koppelt;
- Pabo Rekenklaar onder `public/apps/pabo-rekenklaar/`;
- de Moshpit als bewuste ingang naar de bestaande 60-seconden-sprint, zonder tweede vragenbank;
- een schaalbare Grabbelton-catalogus met 30 gepubliceerde flirts, gekoppeld aan bestaande misconceptcodes;
- een vrijwillige uitnodiging bij bevestigd terugkerend denkpatroon in Pabo-oefenfeedback: de exacte flirt uit dezelfde catalogus, met ondertiteling, transcript en gerichte herstelset;
- vaste ketentests voor alle 30 flirtpatronen en hun gerenderde spelers, met afzonderlijke inhoudsreview en bewaking van gewijzigde tekst en media;
- een permanente, mobiele terugweg vanuit Pabo Rekenklaar naar het Wisik-terrein;
- lokale opslag van Pabo-voortgang vóór het verlaten van de attractie;
- automatische bronpagina- en attractieversieregistratie in het Wisik-Kladblok;
- Backstage met een actueel, machineleesbaar vrijgavebewijs, kwaliteitsverantwoording, de missie **wiskunde leuk maken** en het HAN-portret van de roadie achter Wisik;
- één centraal Wisik-Kladblok als gratis HTML-formulier via FormSubmit;
- Cloudflare Email Routing voor `kladblok@wisik.nl`;
- een duidelijke doorgang vanaf het terrein naar dat centrale Kladblok;
- versiegebonden scripts op alle sitepagina's voor Safari en andere mobiele browsers;
- versiegebonden gedeelde CSS, zodat nieuwe mobiele terreinindelingen niet achter een oude browsercache blijven hangen;
- mobiele navigatie en een gewone lijstweergave naast de terreinplattegrond;
- een verplichte deterministische vrijgavecontrole bij iedere wijziging.

Backstage toont de actuele technische vrijgavestatus en eventuele inhoudelijke flirtproblemen direct in de pagina-intro. De terreinplattegrond en de Backstage-knop op de homepage springen rechtstreeks naar het volledige openbare bewijs; op smalle schermen blijven de acht technische detailcontroles compact uitklapbaar. Het HAN-portret is bereikbaar via één fotokaart met een speciaal afgestemde mobiele uitsnede; er staat geen tweede videoknop naast.

## Lokaal bekijken

```bash
python -m http.server 8000 --directory public
```

Open daarna `http://localhost:8000`.

## Kwaliteitscontrole

De flirtcontrole gebruikt `tests/flirt-cases.json` met onafhankelijk uitgerekende goede, kenmerkend foute en andere foute antwoorden. Dezelfde seed moet hetzelfde resultaat geven. Ook een dubbelzinnig antwoord, een herhaalde identieke vraag en toets/sprint worden gecontroleerd. De DOM-double test voor alle 30 codes de daadwerkelijk gerenderde titel, toelichting, film, poster, ondertiteling, transcript en herstelsetcode.

De inhoudsreview staat in `public/assets/data/flirt-content-review.json`. Per film zijn het bedoelde misconcept, gewenste inzicht, geobserveerde inhoud, beeldmomenten en kanttekeningen vastgelegd. SHA-256-vingerafdrukken verbinden die review met de catalogus, het canonieke misconcept en alle vier bestanden. Een wijziging laat de controle falen totdat de getroffen inhoud opnieuw is bekeken en de betreffende review bewust is bijgewerkt. `npm run audit:update` vernieuwt deze inhoudelijke beoordeling en vingerafdrukken **niet** automatisch.

De eerste review bevat 17 aansluitende films, 11 films met kanttekeningen en twee beeldproblemen (C01 en C04). Die bestaande festivalpublicaties blijven beschikbaar conform de gekozen experimenteerruimte. Backstage toont de herstelpunten expliciet; een geslaagde technische controle is geen inhoudelijke goedkeuring. De review gebruikt volledige VTT/transcripten en minimaal zes beeldmomenten per film. De audiotrack is niet onafhankelijk beluisterd; empirische fout-positieven en leerwinst zijn niet vastgesteld.

```bash
npm run check
```

De controle test onder meer:

- HTML-basisstructuur en interne links;
- dubbele id's;
- JavaScript-syntaxis;
- versiegebonden scripts op alle sitepagina's en korte JavaScript-caching;
- Kladblokvelden, honeypot, succesroute en Content-Security-Policy;
- exact één Kladblokformulier en een werkende doorgang vanaf het terrein;
- automatische Kladblokcontext vanuit Pabo Rekenklaar;
- zichtbare desktop- en mobiele terreinuitgangen;
- lokale opslag bij vertrek en mobiele paginawissels;
- exact één Backstage-roadiekaart met de lokale festivalfoto, missietekst, HAN-link, mobiele uitsnede, toegankelijkheid en privacyvriendelijke videokeuze;
- sitebrede afwezigheid van oude Kladblok-, Turnstile- en Cloudflare-fallbackcode;
- 17.000 gegenereerde Pabo-vraaginstanties in 170 generatorcombinaties;
- herhaalde deterministische antwoordcontrole en nul terugvalvragen;
- technische afleesbaarheidsregels voor 600 grafiekinstanties;
- 30 diagnostische patronen, 1.200 controlevragen en natuurlijke terugclassificatie;
- actualiteit van het openbare Backstage-auditbewijs;
- exact één declaratie van `genBConversions`;
- afwezigheid van de afgekeurde RWT 3.1-bron;
- aanwezigheid van de officiële RWT 2.2-verwijzing;
- één canonieke Pabo-vragenbank en één canonieke sprintfunctie;
- een Moshpit-startscherm vóór de klok loopt, 2.250 extra veilige sprintvragen en scheiding tussen sprintfouten en gewone leerdata;
- een geldige, onbegrensd schaalbare Grabbelton-catalogus met 30 gepubliceerde flirts en 120 lokale media-/toegankelijkheidsbestanden;
- selectieproeven met 1, 30 en 45 filmpjes, polsbandfilters en herhalingsremming.

Na een bewuste wijziging van Pabo Rekenklaar wordt het openbare bewijs lokaal vernieuwd met:

```bash
npm run audit:update
```

De gewone controle schrijft niets en faalt als dat bewijs ontbreekt of niet meer bij de broncode past. Het publieke rapport staat in `public/assets/data/pabo-release-audit.json`.

Zie `DEPLOYMENT.md` voor de publicatie- en beheerroute.

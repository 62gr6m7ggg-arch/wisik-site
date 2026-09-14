# Ruimteklaar testmodus — 1.0, voor leerlingeditie 0.4.5

Ingang: `/apps/ruimteklaar/test/`. Dit is geen alternatieve leerlingenroute.
De module gebruikt de bestaande QuestionCard, LearningView, ConstructionLab,
Workbench, LevelCheck en papiercomponenten. Geen kopieën van de wiskunde.

261 losse vragen (oefenen, diagnose, herstel, levelchecks, eindproeven), tien
cursusconstructies, de werkbank met twee varianten, 23 lesblokken, acht volledige
checks/proeven en acht papieropdrachten zijn vrij opvraagbaar. Filters op level,
soort, onderwerp, vraagfunctie en tekst/code; vorige, volgende/overslaan, opnieuw
proberen en expliciete beoordelaarsuitwerking. Het bestaande Kladblok ontvangt
alleen de bronlink, itemcode en versie, geen wachtwoord of testantwoorden.

## Voortgang
De testmodule importeert geen local-progress-store en schrijft geen browseropslag.
De test-events blijven uitsluitend in React-geheugen, per onderdeel, zolang het
blad open blijft. Herladen en uitloggen verwijderen deze events. De gewone app,
haar opslagkeys, XP en routevoorwaarden worden niet veranderd.

## Activeren nadat Edwin het wachtwoord heeft bepaald
Stel in Cloudflare Pages > wisik-site > Settings > Variables and Secrets uitsluitend
voor Production beide **Secrets** in, en voer daarna een nieuwe deployment uit:

- `RUIMTEKLAAR_TEST_PASSWORD`: een uniek wachtwoord / wachtzin van minstens 20 tekens.
- `RUIMTEKLAAR_TEST_SESSION_SECRET`: een onafhankelijk willekeurig geheim van minstens
  32 tekens (bijvoorbeeld lokaal `openssl rand -hex 32`). Dit is niet het wachtwoord.

Geen echte waarden in GitHub, HTML, JavaScript, een URL of een chat publiceren.
Zonder beide geldige secrets blijft de module dicht (503). Er is geen standaard-,
tijdelijk of terugvalwachtwoord. Previewdeployments blijven zonder eigen secrets
ook gesloten. Het wachtwoord kan later in Cloudflare worden gewijzigd; wijziging
van een van beide secrets maakt bestaande sessies ongeldig na herdeployment.

## Bescherming
Een Pages Function levert HTML, JavaScript en CSS van de testmodule uitsluitend na
servercontrole. Alle testbestanden zijn in `server/`, niet in `public/`, opgenomen.
Er is geen publiek statisch testbestand om op terug te vallen bij Function-uitval.
`_routes.json` beperkt Functions tot de test-ingang; de rest van Wisik blijft statisch.

Login vereist HTTPS, een POST-formulier en dezelfde Origin. Wachtwoordvergelijking
gebruikt HMAC-verificatie. De sessie is ondertekend, aan het huidige domein gebonden
en verloopt na één uur. Cookie: __Host-prefix, Secure, HttpOnly, SameSite=Strict.
Alle antwoorden van de test-ingang zijn no-store/noindex. Logout is alleen POST
vanaf dezelfde Origin. De browser controleert de sessie periodiek en bij terugkeer.

Een begrensde, vluchtige loginrem telt vijf pogingen per kwartier per netwerkadres
**binnen één Worker-isolate**. De sleutel wordt gehasht; er is geen permanente
opslag. Dit is geen wereldwijd sluitende bescherming tegen verspreide aanvallen.
Configureer vóór brede verspreiding van het gedeelde wachtwoord daarnaast een
Cloudflare WAF rate-limit op POST `/apps/ruimteklaar/test/login` (eventueel Turnstile).
Gebruik het gedeelde wachtwoord niet als individueel toets- of identiteitsbewijs.

De repository en de gewone oefenapp bevatten al de opgaven en antwoorden. Deze
beveiliging schermt de gehoste testomgeving af, niet de reeds openbare broncode.
Geleverde code kan door een geautoriseerde bezoeker worden bewaard; uitloggen
verwijdert geen eerder door die bezoeker gedownloade informatie.

## Bouw- en testproces
Vanuit `tools/space-tent`: `npm ci`, `node scripts/build-review.mjs`.
Vanuit de repository: `node scripts/test-ruimteklaar-review-auth.mjs`.
Browserproeven: `node scripts/check-review-browser.mjs` vanuit `tools/space-tent`.
Het server-only bundelbestand wordt gecommit. Publicatiecontrole controleert dat
alle verwachte broncomponenten gebonden zijn en geen testbundle publiek staat.

Cloudflare-documentatie:
https://developers.cloudflare.com/pages/functions/routing/
https://developers.cloudflare.com/pages/functions/bindings/
https://developers.cloudflare.com/workers/examples/basic-auth/

Geen fysiek iPhone-gebruiksonderzoek of professionele penetratietest verricht.

# Spacetent — afgeschermde testmodus 0.1

Route: `/apps/ruimteklaar/test/`. Opdracht Edwin: vrije navigatie voor inhoudscontrole,
alleen toegankelijk met een wachtwoord dat later wordt gekozen.

## Inhoud en scheiding

De catalogus wordt rechtstreeks uit de originele gegevens opgebouwd: 261 vragen
(inclusief diagnose, herstel en checks), 10 cursusconstructies, beide
atelier-varianten, 23 blokroutes, 8 checks en 8 papieropdrachten. De bestaande
React-componenten verzorgen figuren, invoer, feedback, constructies en proefregels.
Filters: onderdeel, les, onderwerp, vraagsoort en tekst/code. Vorige, volgende,
overslaan, opnieuw, antwoord/uitwerking tonen en een kopieerbare vraagverwijzing.

Alle testpogingen bestaan uitsluitend in React-geheugen. Wisselen of herladen
wist de testpoging. De gewone localStorage, XP, diagnose, levels en opgeslagen
constructies worden niet gelezen, geïmporteerd, ontgrendeld of aangepast. De
alleen-in-geheugen save-callback controleert uitsluitend de toegangsessie via GET;
geen antwoorden of berekeningen worden naar de server verstuurd. Een blokroute
kan daarmee inclusief zijn originele diagnoseketen getest worden, zonder iets
als echte voortgang te registreren.

De enige wijziging aan een gewone oefencomponent is een optionele
`initialVariant`-prop van Workbench: standaard 0, zoals voorheen. De reviewer
kan hierdoor ook variant 1 direct openen, zonder eerst variant 0 te voltooien.
De normale route en hoofdinterface veranderen niet.

## Wachtwoordbeveiliging — standaard gesloten

De Cloudflare Pages Function beschermt de ingang én de JavaScript/CSS-bestanden.
De testbestanden worden als stringmodule in de Function gebundeld, buiten public/.
Er is dus geen openbare statische testkopie die bij een uitgeschakelde Function of
bij Pages 'fail open' alsnog beschikbaar wordt. De normale routes blijven statisch.

De server vereist ALLE volgende bindings; ontbreken of ongeldige waarden geven
503 en geen testinhoud. Er is geen standaardwachtwoord, URL-bypass, test-account,
client-side geheim, frontend-ontgrendeling of productie-testvlag.

- `RUIMTEKLAAR_TEST_PASSWORD`: Cloudflare secret, 16–256 tekens, geen witruimte aan
  het begin/einde. Gebruik een uniek, lang wachtwoord, niet een bestaand accountwachtwoord.
- `RUIMTEKLAAR_TEST_SESSION_SECRET`: Cloudflare secret, willekeurige sleutel van
  minstens 32 bytes in base64url (43 tekens). Niet hetzelfde als het wachtwoord.
- `RUIMTEKLAAR_TEST_TURNSTILE_SITE_KEY`: publieke site key van een managed Turnstile
  widget voor het juiste domein. Officiële always-pass testkeys worden geweigerd.
- `RUIMTEKLAAR_TEST_TURNSTILE_SECRET_KEY`: bijbehorende Cloudflare secret.

Turnstile beperkt geautomatiseerde wachtwoordpogingen; de server valideert token,
hostname en action. Geen aanmelding als die controle mislukt of niet bereikbaar
is. Dit is geen absolute garantie tegen raden: activeer aanvullend een Cloudflare
WAF-rate-limit op POST naar `/apps/ruimteklaar/test/login` bij ingebruikname.

Na aanmelden: ondertekende HMAC-SHA-256-cookie met HttpOnly, Secure,
SameSite=Strict, beperkt pad en vier uur looptijd. Servercontrole op elk beschermd
verzoek. De reviewer controleert ook periodiek, bij terugkeren naar het tabblad,
voor navigeren en voor een test-save. Wachtwoord- of sleutelwijziging maakt oude
sessies ongeldig. Uitloggen verwijdert alleen de testcookie, niet de leerdata.
Stateless cookies: een eerder buitgemaakte cookie blijft tot verloop of een
wachtwoord/sleutelwijziging geldig; uitloggen is geen globale server-revocatie.

POST vereist dezelfde Origin; ongeldige methoden en grote of dubbele invoer
worden afgewezen. No-store en noindex op alle antwoorden. CSP blokkeert framing
en externe scripts in de ingelogde testapp. Er zijn geen nieuwe databases of
leerresultatenlogs. Cloudflare verwerkt wel technische verzoeken en de
Turnstile-beveiligingscontrole; dit is dus niet 'geen gegevensverwerking'.

Het GitHub-project en de gewone leerling-app bevatten reeds de vraaggegevens.
Deze toegangscontrole beveiligt de webtestmodus, niet de geheimhouding van die
bestaande openbare broncode of een eenmaal door een bevoegde tester ontvangen kopie.

## Later activeren

Kies het wachtwoord pas bij ingebruikname en voer het rechtstreeks in Cloudflare
in als secret, niet in een chat, commit, URL of configuratiebestand. Stel ook de
sleutel en Turnstile in. Pages: Workers & Pages → wisik-site → Settings → Variables
and Secrets. Stel productie en eventuele previews bewust afzonderlijk in; geef
previews niet onnodig het productiewachtwoord. Kies fail closed in Runtime.
Daarna opnieuw deployen en op het echte domein fout/correct wachtwoord, rechtstreekse
bundeltoegang, Turnstile, sessieverloop, uitloggen en ongewijzigde leerlingvoortgang
testen. Tot die activering blijft de ingang bewust dicht.

Bronnen voor de hosting-/beveiligingskoppeling (geraadpleegd 14 september 2026):
- https://developers.cloudflare.com/pages/functions/routing/
- https://developers.cloudflare.com/pages/functions/bindings/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/workers/runtime-apis/web-crypto/

## Bouwen en controleren

Vanuit tools/space-tent: `npm ci && npm run build && npm run audit:build && npm test`.
Vanuit de repositoryroot: `node tools/ruimteklaar-review/build.mjs`,
`node tools/ruimteklaar-review/test-auth.mjs`,
`node tools/ruimteklaar-review/test-browser.mjs` (Playwright met Chromium/WebKit).
De browsercontrole schrijft .browser/results.json. Kopieer dat naar
browser-results.json vóór `npm run check:review`. Gebouwde testbestanden NOOIT
naar public/ kopiëren. Root check bindt gegenereerde assets en originele bronfiles
met hashes; een latere bronwijziging vereist opnieuw bouwen/testen van de reviewer.

Grenzen: geautomatiseerde tests zijn geen fysieke iPhone-test, onafhankelijke
penetratietest of bewijs van intuïtiviteit. De echte Turnstile-widget en het
productiewachtwoord zijn nog niet ingesteld of live getest.

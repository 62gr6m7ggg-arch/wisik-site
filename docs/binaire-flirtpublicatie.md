# Standaardroute voor vervanging van Wisik-flirts

## Besluit en toepassingsgebied

Op 17 november 2026 heeft de eigenaar de met A04 geslaagde route als standaard
aangewezen: **ChatGPT-bestand → Cloudflare-productie → livecontrole →
GitHub-synchronisatie → automatische publicatiebevestiging**.

Dit geldt voor vervanging van een reeds goedgekeurde flirt. Filmproductie en
inhoudelijke beoordeling worden niet herhaald. De eigenaar heeft de noodzakelijke
publicatiestappen voor wisik.nl toegestaan; vraag daarvoor niet opnieuw om
toestemming. Die toestemming schakelt platformbeveiligingen niet uit.

Deze route vervangt de eerdere standaard van lokale binaire Git-push of een
ZIP-overdrachtsworkflow vanuit main. Browserupload en aanmelden bij GitHub/Apple
zijn geen vereiste voor deze route. De gekoppelde GitHub-verbinding blijft nodig
voor tekstwijzigingen, PR en merge, niet voor de overdracht van lokale MP4-bytes.

## 1. Hervatten en bestandstoegang bevestigen

- Lees één keer AGENTS.md, actuele main-SHA, relevante branch/PR en hervatpunt.
  Gebruik een bestaande bruikbare branch; maak geen tweede branch of PR voor
  hetzelfde pakket.
- Haal de definitieve goedgekeurde MP4 als echt bestand op. Noteer bestandsnaam,
  aantal bytes en SHA-256. Gebruik bestaande pakketbestanden en reviewgegevens.
- Bevestig de Cloudflare-koppeling, het Pages-project `wisik-site`, de huidige
  productie-deployment en de mogelijkheid om de lokale bytes naar de Pages
  assetopslag te sturen. Dat moet vaststaan vóór nieuwe controles.
- Een GitHub-connector met schrijfrechten levert niet automatisch lokale
  Git-credentials. Herhaal daarom geen mislukte CLI-login of browserlogin.
  Ontbreekt bestandstoegang of Cloudflare-transport, meld precies wat ontbreekt.

## 2. Uitsluitend de bedoelde vervanging voorbereiden

Neem de actuele productiebron en vergelijk die met main. Neem eventuele nog niet
gesynchroniseerde productieaanpassingen mee; zet ze niet ongemerkt terug. Plaats
de goedgekeurde film ongewijzigd met de bestaande pakketvervanger
`node scripts/replace-flirt.mjs CODE PAKKETMAP`, of hervat de al geplaatste versie.

Het pakket omvat de MP4, poster, captions, transcript en de catalogus-/reviewupdate.
Bij ingebed geluid hoort `audioMode: "embedded"`, zodat de oude losse stem niet
tegelijk afspeelt. Behoud de algemene standaard dat extra ondertiteling uit staat;
leg in metadata alleen vast wat de betreffende film daadwerkelijk bevat.

Bouw een volledige Pages-publicatie met alle overige actuele bestanden intact.
Behoud Pages Functions, routes, headers, redirects, configuratie en bindings.
Compileer de bestaande Functions voor de upload; een manifest met alleen de
vervangende film is geen geldige vervanging van de complete site.

Gebruik bestaand bewijs. Alleen als technische verificatie voor de gewijzigde
inhoud ontbreekt, controleer de betrokken flirt en beide spelers gericht:
`WISIK_FLIRT_CODES=CODE node scripts/test-flirt-media.mjs` en
`node scripts/test-flirt-player.mjs`. Geen volledige audit, rekentests,
filmproductie of nieuwe inhoudelijke beoordeling.

## 3. Rechtstreeks publiceren via Cloudflare

De bij A04 bewezen technische scheiding:

1. De Cloudflare-koppeling vraagt een tijdelijk Pages-uploadtoken op via
   `GET /accounts/{account_id}/pages/projects/wisik-site/upload-token`.
2. De bestandsomgeving uploadt de echte bytes rechtstreeks naar de officiële
   Pages-assetopslag. De gebruikte native API-stappen zijn
   `/pages/assets/check-missing`, `/pages/assets/upload` en
   `/pages/assets/upsert-hashes`. Reeds aanwezige assets worden hergebruikt.
3. De Cloudflare-koppeling maakt de volledige productie-deployment aan via
   `POST /accounts/{account_id}/pages/projects/wisik-site/deployments`, met
   `branch=main`, het assetmanifest, de bestaande controlebestanden en de
   gecompileerde Functions. Leg de werkelijke broncommit vast en markeer
   `commit_dirty=true` als de mediavervanging nog niet in die commit staat.
4. Wacht op `deploy: success` en bevestig de productie-aliassen wisik.nl en
   www.wisik.nl. Noteer ook de onveranderlijke deployment-URL.

Gebruik de actuele officiële Cloudflare-API of passende CLI; sla geen token in
de repository of in een hervatdocument op en verwijder tijdelijke tokenbestanden.
De eventuele protocolcodering gebeurt uitsluitend binnen de bestandsomgeving.
Geen Base64-film in chat, modelcontext of GitHub-toolargumenten en geen film in
tekstfragmenten.

Bij A04 vroeg `wrangler pages project upload` ondanks het assettoken alsnog om
een volledige login. Herhaal die mislukte aanmeldroute niet: de native
assetupload plus de Cloudflare-koppeling heeft de publicatie wel voltooid.

## 4. Werkelijke aflevering vaststellen

Download `https://wisik.nl/films/rekenklaar/CODE/flirt.mp4` terug en vergelijk
grootte en SHA-256 met het goedgekeurde origineel. Controleer de bijgewerkte
cataloguskoppeling. Een Cloudflare-status alleen volstaat niet.

Bij A04 toonde de browser kort de oude film; één normale herlaadactie leverde de
nieuwe versie. De browserdownload gaf vervolgens exact dezelfde bytes en hash.
Gebruik bij benodigde browsercontrole de ondersteunde media-downloadfunctie.
Een nog niet uitgevoerde of geblokkeerde livecontrole moet als zodanig worden
gemeld; presenteer een upload dan niet als bewezen livevervanging.

## 5. GitHub gelijkzetten en afronden

Deze stap voorkomt dat een volgende automatische publicatie de oude flirt
terugzet. Laat haar niet weg nadat Cloudflare is geslaagd.

- Neem de vier gepubliceerde mediabestanden en de bijbehorende catalogus en review
  over vanaf de onveranderlijke deployment-URL. Gebruik standaard `curl` met
  HTTPS, foutafhandeling en omvang-/tijdslimieten; controleer vooraf vastgelegde
  SHA-256-hashes vóór het committen. Python urllib kreeg bij A04 HTTP 403;
  standaard curl slaagde.
- Als een lokale binaire Git-push ontbreekt, kan een eenmalige GitHub Actions-
  workflow die bestanden downloaden en met het bestaande repositorytoken op
  dezelfde featurebranch committen. Beperk de trigger tot die branch en die
  overdracht. Verwijder de tijdelijke workflow na succes, vóór de PR, zodat de
  uiteindelijke diff uitsluitend het mediapakket bevat.
- Controleer dat de branch geen andere wijzigingen bevat. Open of hervat één PR
  naar main. De bestaande `Verplichte vrijgavecontrole` selecteert alleen de
  betrokken film/spelers; voeg geen extra lokale controleronde toe.
- Merge zodra die check slaagt en publicatie is opgedragen. Laat de automatische
  Cloudflare-publicatie uit main afronden; start geen parallelle handmatige
  deployment. `Wisik publicatiebevestiging` controleert alleen de aflevering.
- Meld publicatie en bronsynchronisatie afzonderlijk als één van beide nog
  geblokkeerd is. De route is pas volledig afgerond wanneer beide zijn geslaagd.

## Hervatpunt bij een onderbreking

Bewaar filmcode, bestandsnaam, grootte, SHA-256, broncommit, branch, PR,
Cloudflare-deployment-ID/URL, CI-run, laatste geslaagde fase, volgende fase en
eventuele concrete fout. Begin daarna bij de eerste onafgeronde stap.
Een afgebroken chatstream is op zichzelf geen bewijs dat de externe handeling
is mislukt. Controleer haar status vóór een nieuwe upload of deployment.

## Geslaagde referentie: A04, 17 november 2026

- Bestand: `A04_Roadie_balans.mp4`, **5.964.130 bytes**.
- SHA-256: `45533dbab795b4f2ee8237b9df7b34c05a5d0916702cea59492d4d11d756459a`.
- Directe productie-deployment: `ce9b439c-52c8-43e2-8c16-82216c2cae3a`,
  `https://ce9b439c.wisik-site.pages.dev`.
- Vanaf wisik.nl teruggelezen film: exact dezelfde grootte en SHA-256.
- Bestaande branch: `publish/a04-roadie-20261117`.
- Bronsynchronisatie: Actions-run `44064253861`, daarna [PR #114](https://github.com/62gr6m7ggg-arch/wisik-site/pull/114).
- Main-commit: `5b1fbf379e962fc8f55bbd716722f3edc2771b71`.
- Automatische productie-deployment: `9c712341-938e-43cb-9209-6431db1e93b5`.
- Publicatiebevestiging: Actions-run `44064654155`, geslaagd.
- Geen rekentests of hernieuwde filmproductie/beoordeling.

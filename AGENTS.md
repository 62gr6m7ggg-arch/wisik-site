# Wisik: gerichte vervanging en publicatie

De eigenaar bepaalt de wijziging. GitHub voert het expliciete releasebeleid uit;
het voegt geen inhoudelijke goedkeuring of onafhankelijke review toe.

## Eerst voortgang lezen, daarna handelen
- Lees één keer de actuele main-SHA, bestaande relevante PR en bijbehorende check.
  Hervat die PR; maak geen tweede branch/PR voor hetzelfde goedgekeurde pakket.
- De PR-body bevat pakket/onderdeel, basiscommit, afgeronde stap en eerstvolgende
  stap. Actions-artifacts `wisik-vrijgavebewijs` en `wisik-publicatie-hervatpunt`
  bevatten exacte commits, modules, foutcommando's en resultaten.
- Lees alleen de relevante bestanden en compacte logregels. Print geen complete
  toolregistratie, repositoryboom, binaire bestanden of volledige succeslogs.

## Standaardroute voor vervanging van goedgekeurde flirts
Op 17 november 2026 heeft de eigenaar de met A04 geslaagde route als standaard
gekozen: **rechtstreeks naar Cloudflare, live-aflevering controleren, daarna
GitHub synchroniseren**. Volg `docs/binaire-flirtpublicatie.md`. Deze volgorde
vervangt voor flirtvervangingen de eerdere voorkeur voor binaire Git-push,
ZIP-overdracht vanuit main en GitHub-browserupload.

- Lees eerst het hervatpunt; gebruik de goedgekeurde film ongewijzigd en leg
  bestandsgrootte en SHA-256 vast. Geen nieuwe filmproductie of inhoudelijke review.
- Bevestig toegang tot het echte bestand en tot de Cloudflare Pages-publicatie.
  De GitHub-connector kan tekst schrijven, maar deelt niet automatisch lokale
  MP4-bytes of terminalcredentials. Begin niet opnieuw met een GitHub-/Apple-login.
- Bereid de complete actuele site voor met uitsluitend de bedoelde mediavervanging
  en catalogus-/reviewgegevens. Behoud Pages Functions, routes, headers, redirects
  en bestaande bindings. Een los MP4-bestand is geen volledige Pages-deployment.
- Upload de bestanden vanuit de bestandsomgeving rechtstreeks naar Cloudflare;
  laat de connector de productie-deployment aanmaken. Geen Base64 van media in
  chat of GitHub-toolargumenten, geen fragmentatie en geen beveiligingen omzeilen.
- Controleer de productie-deployment én de werkelijk vanaf wisik.nl gedownloade
  film: grootte en SHA-256 moeten overeenkomen. Een geslaagde upload alleen is
  geen bewijs dat de nieuwe film live staat.
- Synchroniseer de gepubliceerde bestanden vervolgens naar dezelfde bruikbare
  featurebranch. Haal ze met standaard `curl` op vanaf de onveranderlijke
  deployment-URL en verifieer hun hashes. Hervat één PR; verwijder een eventuele
  eenmalige overdrachtsworkflow vóór het openen van die PR.
- Laat de bestaande gerichte vrijgavecontrole slagen, merge zonder opnieuw
  toestemming te vragen en wacht op de automatische publicatiebevestiging.
  Publicatie én bronsynchronisatie horen bij de afronding.
- Herhaal geen geslaagde controles, audits of ongerelateerde rekentests. Bij een
  echte blokkade: meld de concrete fout en leg de bereikte fase vast; wissel niet
  stilzwijgend naar een nieuwe transportproef.

## Publicatieroute voor overige wijzigingen en GitHub-synchronisatie
Voor flirtvervangingen geldt eerst de Cloudflare-route hierboven. De onderstaande
GitHub-stappen volgen daarna voor dezelfde bronbestanden; publiceer niet nogmaals
handmatig terwijl de automatische deployment loopt.

1. Lees broncode via bestaande checkout of een publieke clone. Schrijf naar GitHub
   via de gekoppelde GitHub-verbinding. Een lokale terminal zonder credentials is
   geen bewijs dat die verbinding rechten mist; probeer die route niet opnieuw.
2. Plaats het goedgekeurde pakket. Flirts: `npm run flirt:replace -- CODE PAKKET`.
   Inhoudelijke review is onderdeel van de filmgoedkeuring, geen tweede goedkeuring.
3. `npm run release:prepare -- --base=<actuele-main-sha>` maakt alleen het
   pakket-/testplan; geen rekentests en geen rapportgeneratie in de voorbereiding.
   Draai niet daarnaast `check`, `build` of een lokale volledige audit.
   Gerichte ontwikkeltests zijn alleen nodig bij nieuwe code of een concrete fout.
4. Commit de bronwijziging. GitHub voert de geselecteerde controles één keer uit.
   Eventuele nieuwe rekenrapporten worden door dezelfde geslaagde run als een
   uitsluitend uit bewijs bestaande vervolgcommit opgeslagen. De vrijgavecheck
   verwijst op die commit naar exact dezelfde geteste bron, basis en rapporthashes.
   Dit start geen tweede workflow. Merge zodra de check slaagt en publicatie is
   opgedragen; gebruik de actuele PR-head (die de bewijscommit kan bevatten).
   Geen nieuwe toestemmingsvraag.
5. Cloudflare publiceert automatisch vanuit main. Na samenvoegen controleert
   `Wisik publicatiebevestiging` (workflow `publication.yml`) alleen aflevering.
   Wacht niet op een niet-bestaande tweede algemene audit en start geen tweede
   deployment terwijl de automatische publicatie bezig is.

## Omvang en fouten
- `scripts/release-policy.mjs` en `classify-release-change.mjs` bepalen samen de testselectie. Gedeelde
  afhankelijkheden komen erbij; ongewijzigde tenten niet. Een onbekend pad stopt
  direct met uitleg: voeg een modulekoppeling toe, geen blinde volledige audit.
- Een brede audit hoort bij release-infrastructuur, expliciet volledige controle
  en de wekelijkse regressie. Historische workflows zijn uitsluitend handmatig.
- Een fout stopt bij het concrete commando. Repareer die oorzaak en herhaal alleen
  betrokken controles. Geen automatische retries van audits, geen volledige
  logdump en geen claim dat het aan GitHub-rechten ligt zonder concrete fout.
- Publicatiestatus is los van teststatus. Meld altijd welke stap is mislukt en
  bewaar de commit/PR als hervatpunt. Oude toestemmingen blijven gelden.

## Grenzen voor media, speler en rekenen
- Media: alleen gewijzigde filmcodes; pakket, koppeling, audio en beide spelers.
- Speler: beide spelers, audio en vervolgknoppen; geen vraaggenerator of rekentest.
- Pabo-opmaak: scriptkoppelingen, syntax en navigatie; geen rekenopgaven.
- Pabo-appcode, rekenbronnen en bijbehorende auditafhankelijkheden: rekentests.
- Bij de Pabo-HTML wordt de applicatiescriptcode expliciet met de basis vergeleken.
  Extra/onbekende scripts worden niet stilzwijgend als opmaak geclassificeerd.
- Bestaand rekenbewijs wordt goedkoop aan de rekenbron gebonden. Film, speler,
  opmaak en siteversie maken dat bewijs niet ongeldig.
- `.release/` is een hervatpunt/artifact, nooit zelf een te publiceren bronwijziging.

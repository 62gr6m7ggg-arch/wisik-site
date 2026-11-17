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

## Binaire transportpoort — vóór elke filmcontrole
- Een GitHub-connector met pushrechten kan tekst schrijven, maar heeft niet per definitie toegang tot lokale MP4-bytes. Maak dit onderscheid expliciet.
- Voor een flirt eerst controleren of een echte geauthenticeerde binaire Git-push in de Work-checkout beschikbaar is. Gebruik bij een complete pakketmap `node scripts/publish-flirt-package.mjs CODE MAP [SHA256]`; zie `docs/binaire-flirtpublicatie.md`.
- Ontbreekt binaire Git-push en is er een openbare HTTPS-download van het goedgekeurde ZIP-pakket? Start vanuit main de handmatige workflow **Goedgekeurd flirtpakket overzetten** met flirtcode, downloadlink en ZIP-SHA-256. Gebruik een link zonder geheimen. De workflow meldt de branch waarop je één PR opent of hervat. Draai `release:prepare` niet nog eens voor deze overdracht; de bestaande CI controleert de PR.
- Ontbreken beide transportmogelijkheden, leg dan de concrete blokkade vast vóór `flirt:replace`, PR of audit. Geen Base64 in chat.
- Gebruik dezelfde bestaande branch/PR voor dezelfde overdrachtsroute en herhaal geen eerder goedgekeurde filmproductie of controles. De browserupload is een expliciete noodroute, geen automatische mogelijkheid van iedere Chat.

## Verplichte keuze van transport — geen improvisatie
- **Voor elke MP4-overdracht:** bepaal eerst of het goedgekeurde pakket als echte bestanden beschikbaar is in een Work-checkout mét werkende geauthenticeerde Git-push, of als publieke HTTPS-ZIP met bekende SHA-256. Noteer de gekozen route en het hervatpunt. Zolang geen van beide aantoonbaar beschikbaar is: **stop vóór encoderen, uploaden, PR en audits**.
- Een GitHub-tool voor `create_blob` of `update_file` is **geen bestandsbrug**. Base64 van de film als toolargument (ook wanneer dit buiten de zichtbare chat blijft) is uitdrukkelijk niet de standaard- of herstelroute. Hak de film ook niet op in tekststukken.
- **Standaard bij een publiek toegankelijk goedgekeurd pakket:** gebruik uitsluitend de bestaande workflow `.github/workflows/flirt-package-transfer.yml`, vanuit `main`, met code, HTTPS-ZIP-URL en SHA-256. Zij haalt de bytes zelf op en plaatst ze op een herbruikbare publicatiebranch. Werk vervolgens vanuit die branch verder, niet vanuit een tweede transportexperiment.
- **Alleen wanneer echte geauthenticeerde binaire Git-push bewezen beschikbaar is:** gebruik `scripts/publish-flirt-package.mjs` op de bestaande featurebranch. GitHub-connectorrechten impliceren geen lokale terminalcredentials.
- Ontbreekt de ZIP-URL/SHA of is het pakket niet in de huidige omgeving toegankelijk, meld exact welk invoerbestand of transport ontbreekt. Herhaal geen reeds afgeronde filmproductie of controles. Geen hypothetische 'upload geslaagd'-melding.
- Herstel na een streamingonderbreking op basis van GitHub-branch, commit, workflow-run en PR; een afgebroken chatstream is op zichzelf geen bewijs van een mislukte GitHub-overdracht.

## Publicatieroute
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

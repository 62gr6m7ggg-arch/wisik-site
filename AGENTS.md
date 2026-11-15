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

## Publicatieroute
1. Lees broncode via bestaande checkout of een publieke clone. Schrijf naar GitHub
   via de gekoppelde GitHub-verbinding. Een lokale terminal zonder credentials is
   geen bewijs dat die verbinding rechten mist; probeer die route niet opnieuw.
2. Plaats het goedgekeurde pakket. Flirts: `npm run flirt:replace -- CODE PAKKET`.
   Inhoudelijke review is onderdeel van de filmgoedkeuring, geen tweede goedkeuring.
3. `npm run release:prepare -- --base=<actuele-main-sha>` selecteert modules,
   voert relevante controles uit en vernieuwt alleen hun technische rapporten.
   Voer hierna niet ook `npm run check`, `build` en `deploy` uit.
4. Commit de wijziging en automatisch gegenereerde relevante rapporten samen.
   GitHub draait één gezaghebbende vrijgavecheck op de kandidaat. Merge de PR
   zodra die slaagt en publicatie is opgedragen. Geen nieuwe toestemmingsvraag.
5. Cloudflare publiceert automatisch vanuit main. Na samenvoegen controleert
   `Wisik publicatiebevestiging` (workflow `publication.yml`) alleen aflevering.
   Wacht niet op een niet-bestaande tweede algemene audit en start geen tweede
   deployment terwijl de automatische publicatie bezig is.

## Omvang en fouten
- `scripts/release-policy.mjs` is de enige automatische testselectie. Gedeelde
  afhankelijkheden komen erbij; ongewijzigde tenten niet. Een onbekend pad stopt
  direct met uitleg: voeg een modulekoppeling toe, geen blinde volledige audit.
- Een brede audit hoort bij release-infrastructuur, expliciet volledige controle
  en de wekelijkse regressie. Historische workflows zijn uitsluitend handmatig.
- Een fout stopt bij het concrete commando. Repareer die oorzaak en herhaal alleen
  betrokken controles. Geen automatische retries van audits, geen volledige
  logdump en geen claim dat het aan GitHub-rechten ligt zonder concrete fout.
- Publicatiestatus is los van teststatus. Meld altijd welke stap is mislukt en
  bewaar de commit/PR als hervatpunt. Oude toestemmingen blijven gelden.

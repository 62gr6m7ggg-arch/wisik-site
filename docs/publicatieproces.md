# Wisik publicatieproces — 17 november 2026

De eigenaar keurt inhoud en publicatie goed. De automatisering toetst vooraf
vastgelegde technische voorwaarden; zij vraagt geen extra reviewer of audit aan.
Eén verplichte status blijft behouden: **Verplichte vrijgavecontrole**.
De bestaande GitHub-regel heeft nul vereiste reviewers. Geen bypass nodig.

| Wijziging | Automatische controle vóór samenvoegen |
| --- | --- |
| Eén flirt + catalogus/review | Gewijzigde film, audio, poster, VTT, mobiel transcript, inhoudsvingerafdruk en beide spelers; **nul rekenopgaven** |
| Spelercode | Beide spelers, audio en vervolgknoppen; **nul rekenopgaven** |
| Pabo-opmaak / ondertitels | Opmaak, scriptkoppelingen en navigatie; geen rekentests |
| Pabo-applicatiecode / rekenbronnen | Pabo-rekenaudit, didactiek/variatie, navigatie en flirtintegratie |
| Spacetent | Spacetent, bron/bundelbinding en beschermde testomgeving |
| Meetkunde / Stoicheia | Meetkundecontrole |
| Gonio | Productiewiskunde en integriteit |
| Konijnenhol | Zelfstandige film en navigatie |
| Gedeelde websitecode | Gedeelde site-/navigatie-/privacycontroles |
| Aflevercontrole | Alleen integriteit van de aflevercontrole |
| Alleen documentatie | Beleidscontrole; geen productaudit |
| Releasebeleid/workflows | Eenmalige brede regressie |
| Onbekende module | Directe configuratiefout; module expliciet registreren |

Combinaties nemen de vereniging van benodigde controles, zonder dubbele commando's.
De wekelijkse brede regressie blijft bestaan. Oude project- en herstelworkflows
zijn beschikbaar via workflow_dispatch, maar starten niet meer bij iedere push.
Browsertests blijven beschikbaar voor gerichte handmatige validatie wanneer de
bediening of vormgeving verandert; er wordt geen browser geïnstalleerd voor een
MP4-vervanging. GitHub-controles hebben vaste tijdslimieten en herhalen niet vanzelf.

## Flirtpakket

Eén map bevat `flirt.mp4`, `poster.jpg`, `captions.vtt`, `transcript.html`,
`metadata.json` en `review.json`. Film kleiner dan 24 MiB. Transcript heeft een
mobiele viewport. De goedgekeurde lichte versie is het publicatiebestand.

`metadata.json` bevat bijvoorbeeld:

```json
{"approved":true,"audioMode":"embedded","captionsBurnedIn":false,"summary":"De goedgekeurde beschrijving van de nieuwe film."}
```

`review.json` bevat de inhoudelijk beoordeelde velden `verdict`,
`expectedMisconception`, `intendedInsight`, `observedContent`, `captionEvidence`,
`visualEvidence` (met beeldmomenten) en `notes`. Gebruik de bestaande beoordeling
als structuur; beschrijf de daadwerkelijk goedgekeurde film. Maak geen bewijs op.
Het vervangcommando berekent bestandsvingerafdrukken automatisch, niet het
inhoudelijke oordeel. `approved` legt eerdere toestemming vast en vraagt geen
extra akkoord.

```sh
npm run flirt:replace -- C02 /pad/naar/pakket
npm run release:prepare -- --base=<main-commit-sha>
```

De eerste stap controleert de pakketvorm vóór schrijven en herstelt lokale
bestanden bij een mislukte samenstelling. Zij leest alleen de canonieke
misconceptdefinities en initialiseert geen rekenapp. De tweede stap schrijft
uitsluitend `.release/plan.json`: geen tests en geen rapportgeneratie.
Media, catalogus en review worden in dezelfde commit gepubliceerd.

GitHub voert de geselecteerde controles één keer uit op de definitieve kandidaat.
Een mediawijziging beperkt ook de spelercontrole tot de betrokken codes. Een
spelerwijziging test beide spelers voor alle codes, zonder vragen te genereren.
De controles bevatten expliciete verboden op onbedoeld starten van rekentests.

Het rekenbewijs bindt aan de Pabo-applicatiescriptcode, rekenbronnen en gebruikte
auditcode. HTML-opmaak, films, spelers en algemene siteversies vallen buiten die
vingerafdruk. Een lichte bronvergelijking bevestigt dat bestaand rekenbewijs nog
past; de berekeningen worden daarvoor niet herhaald. Als de applicatiescriptcode
of scriptkoppeling in de Pabo-HTML verandert, selecteert de planner wel rekentests.
Een onbekende scriptstructuur stopt met een concrete melding.

Wanneer rekenbronnen wijzigen, maakt de ene CI-run het nieuwe rapport. Alleen de
expliciet toegestane JSON-rapporten mogen daarna naar dezelfde PR worden geschreven.
De run controleert dat PR-head en basis niet zijn veranderd en bindt de geslaagde
check aan de bewijscommit. Broncode mag niet door die stap wijzigen. GITHUB_TOKEN
voorkomt een recursieve workflow; een tweede rekenronde is niet nodig.
Het artifact bewaart geteste bron, basis, vervolgcommit en rapporthashes.
Bij periodieke/handmatige controles blijven nieuwe rapporten in het artifact.

`npm run check` en `npm run release:full` blijven expliciete ontwikkelcommando's;
zij horen niet standaard bij een reeds geplande publicatie.

## Publicatie en hervatten

Goedkeuring → pakket → gerichte voorbereiding → één PR-check → merge →
automatische Cloudflare-publicatie → beperkte controle van gewijzigde online bestanden.
Cloudflare heeft een lege build command en publiceert `public` vanuit `main`.
De bescherming zit vóór de merge. Herstel geen dubbele Cloudflare-audit op basis
van de oude handleiding. De afleveringcontrole is geen extra samenvoegvoorwaarde.

Bij een fout: lees het ene foutcommando in het artifact, herstel de oorzaak,
werk dezelfde PR bij. Na merge: onderzoek alleen publicatie als aflevering niet
bevestigd is. Maximaal zes afleverpogingen; geen oneindige wachtrij of testherhaling.
Een storing in aflevercontrole betekent niet automatisch dat de website offline is.

PR-body/hervatpunt: onderdeel, pakketversie/hash, main-basis, afgeronde stappen,
eerstvolgende stap, eventuele fout. Commit-ID en run-ID zijn de primaire status;
chatgeschiedenis is niet de enige opslag. Artifacts worden 14 dagen bewaard.
De branch/PR en workflowlog blijven de blijvende bron voor hervatten.

De aflevercontrole accepteert uitsluitend de eerder exact vastgelegde Cloudflare-
statistiektoevoeging in HTML. Gewijzigde applicatiebytes of andere scripts blijven
afgekeurd. Het is dus geen blinde verwijdering van hostingcode.

Een fout bij het archiveren van logs blokkeert geen geslaagde vrijgave. De echte
teststap blijft verplicht; de workflowlog en PR blijven beschikbaar als het
optionele artifact tijdelijk niet opgeslagen kan worden.

Backstage gebruikt daarnaast de al eerder vastgelegde Cloudflare-e-mailbescherming.
De aflevercontrole hergebruikt de bestaande strikte decodercontrole: precies één
contactlink, hetzelfde gedecodeerde adres en dezelfde zichtbare tekst. Overige
HTML-wijzigingen worden afgewezen, ook in combinatie met de statistiektoevoeging.

Cloudflare build watch paths zijn beperkt tot `public/*`, `functions/*`, `server/*`,
`wrangler.jsonc`, `package.json` en `package-lock.json`. Alleen documentatie of
tests aanpassen start daardoor geen nieuwe websitebuild. Productie vanuit main
blijft ingeschakeld; de build command blijft leeg.

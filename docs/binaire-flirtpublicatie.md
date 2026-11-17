# Vaste binaire publicatieroute voor Wisik-flirts

## Waarom
Een gekoppelde GitHub-verbinding met push/adminrechten is niet automatisch een transportkanaal voor een MP4 uit ChatGPT Library. Tekstcommits kunnen slagen terwijl de film ontbreekt. **Start daarom geen audit of PR zolang de binaire film niet aantoonbaar op de branch staat.**

## Voorkeursroute: één Work met binaire Git-checkout
1. Neem de bestaande goedgekeurde pakketmap (vier media + metadata.json + review.json) en de bestaande featurebranch. Een ZIP eerst lokaal uitpakken; gebruik geen Base64 door de chat.
2. Zorg dat de Work-omgeving een werkende, geauthenticeerde `git push` heeft. De gekoppelde GitHub-connector bewijst rechten, maar maakt een ongeauthenticeerde lokale CLI niet automatisch bruikbaar.
3. Gebruik in een **schone checkout van de bestaande branch**:
   ```sh
   node scripts/publish-flirt-package.mjs A03 /pad/naar/uitgepakt/A03 d7ff5983e8421613d901b23ef4faa9e477300a4728db1778a2ab648d7d95c4d0
   ```
   Dit controleert eerst pakket, grootte, hash en bereikbaarheid van GitHub; pas daarna plaatst `flirt:replace` het pakket en maakt `release:prepare` alleen het testplan. Vervolgens commit en pusht het pakket. De gerichte tests draaien één keer in GitHub. **Niet uitvoeren op main.** Gebruik voor andere flirts hun eigen vastgelegde SHA.
4. Hervat de bestaande PR, of open precies één PR. Laat de bestaande `Verplichte vrijgavecontrole` slagen, merge, en laat Cloudflare automatisch publiceren. Controleer alleen de aflevering.

## Als Work geen geauthenticeerde binaire Git-route heeft
**Stop onmiddellijk vóór audits.** Dit is een transportblokkade, geen GitHub-permissiegebrek en geen filmfout. Gebruik de GitHub-webinterface om de goedgekeurde MP4 en poster op **dezelfde featurebranch** te uploaden (GitHub UI: branch selecteren → doelmap → Add file → Upload files), mits bestand onder de GitHub-webuploadlimiet blijft. Daarna is nog steeds `flirt:replace` of een gelijkwaardige gecontroleerde catalogus-/reviewupdate nodig. Als dat niet beschikbaar is, niet mergen: het pakket is onvolledig.

Een browserupload is een expliciete noodroute, geen claim dat ChatGPT automatisch toegang heeft tot de browser of bestanden. **Vermijd Base64 via modelcontext, fragmentatie in chat en onbewezen Cloudflare-handmatige deployments.**

## Herstart/hervatpunt
Bewaar op de bestaande branch: code, branch, pakket-SHA256, laatste commit, PR, CI-run, laatste geslaagde fase, eerstvolgende fase en concrete fout. Begin in een nieuwe Work bij de eerste niet-afgeronde stap. Filmgoedkeuring, HeyGen, volledige decodering en geslaagde gerichte controles worden niet herhaald.

## A03 (15 november 2026)
Bestaande branch `roadie-a03-20261115`; goedgekeurde film `A03_Roadie_v4.mp4` (18.369.096 bytes); SHA256 `d7ff5983e8421613d901b23ef4faa9e477300a4728db1778a2ab648d7d95c4d0`. Complete pakketnaam `A03_publicatiepakket_2026-11-15.zip`. De branch heeft ondertiteling en transcript, maar nog niet de nieuwe MP4/poster/catalogus. **A03 is niet live.**

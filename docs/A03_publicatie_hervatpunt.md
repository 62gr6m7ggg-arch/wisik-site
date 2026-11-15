# A03 — publicatiehervatpunt (15 november 2026, bijgewerkt)

**Opdracht van eigenaar:** Zet de goedgekeurde nieuwe Roadie-A03 live ter vervanging van de oude A03 op wisik.nl. Als de ChatGPT Work-contextlimiet nadert: bewaar status en hervat in een nieuwe Work zonder reeds afgeronde stappen te herhalen. Publicatie is uitdrukkelijk toegestaan; geen nieuwe toestemming of inhoudelijke review nodig.

## Identiteit en repo
- Repository: `62gr6m7ggg-arch/wisik-site`, default branch `main`.
- **Bestaande werkbranch**: `roadie-a03-20261115`; niet opnieuw aanmaken.
- GitHub-verbinding bevestigd: `admin=true`, `push=true`. CLI/DNS-beperkingen in een losse container zijn GEEN bewijs van ontbrekende GitHub-rechten.
- Eerdere basismain: `b69c50f3b0050f3036926ab7dd0d7e4326e830ed`. Haal alleen de actuele main-SHA op vóór release:prepare.
- Originele goedgekeurde film in ChatGPT Library: `A03_Roadie_v4.mp4`; file-ID `file_000000005a84822f8fad07be6174758f`; Library-ID `libfile_fde3_f-1d2b4d51ab34819183ba8863df0233cf_7df89a8c346c8191a366b812599f6f5c`.
- Film: 18.369.096 bytes, H.264/AAC, 1280×720, 77 seconden; SHA-256 `d7ff5983e8421613d901b23ef4faa9e477300a4728db1778a2ab648d7d95c4d0`.
- Bronnen in Library: `A03_Roadie_project_v4.zip` (originale montage). In de Chat van 12:12 is het COMPLETE zeskoppige pakket `A03_publicatiepakket_2026-11-15.zip` gemaakt: `flirt.mp4, poster.jpg, captions.vtt, transcript.html, metadata.json, review.json`.

## Afgeronde stappen (NIET opnieuw uitvoeren)
- Film gemaakt, 77 s, gebruiker keurde film en stem goed.
- De eerder afgeronde decodecontrole, caption-overlapcontrole en steekproef van 11:33 uur blijven geldig. Niet opnieuw HeyGen / audio / animatie / volledige review.
- A03-pakket is voorbereid en als downloadbaar ZIP geleverd in de Chat van 12:12 uur.
- GitHub-branch en admin/push-rechten gecontroleerd. Er bestond bij start geen A03-publicatie-PR.
- **Nieuwe A03 ondertiteling gecommit op branch**: `ea084b002c3624416132533fc3a9303f5f297ccb` (`public/films/rekenklaar/A03/captions.vtt`).
- **Nieuwe A03 transcript gecommit op branch**: `746943b8b619be715bfe94346e3a5e52afae29e9` (`public/films/rekenklaar/A03/transcript.html`). Deze is de laatste bekende branch-HEAD vóór deze notitie.
- Bestaand `AGENTS.md` en `docs/publicatieproces.md` gelezen. Geen dubbele algemene audits.

## Resterende stappen, in deze volgorde
1. **Binaire overdracht**: upload de goedgekeurde `flirt.mp4` en `poster.jpg` naar `public/films/rekenklaar/A03/` op dezelfde branch. Poster is uit film op 12 s geëxtraheerd. De huidige gekoppelde GitHub-connector kan binaire bestanden niet direct vanuit de lokale container bijvoegen: zijn create_blob verwacht tekst/base64, terwijl de container geen netwerk/DNS heeft. Dit is een FILE-TRANSPORT-beperking, geen GitHub-authorisatieprobleem. Gebruik waar beschikbaar Work-browser/upload of een andere geldige bestandsoverdracht. Niet beweren dat GitHub-rechten ontbreken.
2. Werk catalogus `public/assets/data/grabbelton-videos.json` en review `public/assets/data/flirt-content-review.json` bij op de reeds goedgekeurde A03. Gebruik bij lokale checkout en volledig pakket `npm run flirt:replace -- A03 <pakketmap>` om dit met vingerafdrukken automatisch te doen. `audioMode=embedded`, `captionsBurnedIn=false`, 77 s. Toestemming is vastgelegd in `metadata.json`, inhoud in `review.json` van ZIP.
3. Voer precies éénmaal `npm run release:prepare -- --base=<actuele-main-sha>` uit en commit de relevante rapporten. Geen afzonderlijke `npm run check`, `build`, brede audit of audio-/filmdecodering.
4. Maak één PR van bestaande branch naar main; laat één gezaghebbende `Verplichte vrijgavecontrole` slagen. Bij een fout uitsluitend de concrete falende stap herstellen; geen nieuwe PR.
5. Merge die PR na de geslaagde vrijgave; Cloudflare publiceert automatisch uit main. Verifieer de gewijzigde A03-media en de beperkte `Wisik publicatiebevestiging` (publication.yml). Claim niet live vóór bevestiging.

## Huidige status
**A03 nog niet live; nieuwe ondertiteling en transcript staan wel op GitHub.** Nu uitsluitend film/poster-upload en releasepad afmaken. Houd de eigenaar tussentijds op de hoogte, en bij een naderende contextlimiet update je ditzelfde document met exact commit/PR/run-ID en de eerste niet-afgeronde stap.

## Hervatting na procesreparatie — 15 november 2026
- Proces-PR #108 is succesvol gesquasht naar main op commit `0962aa6414a5afead87e8574cfb459c62de598a5`; gerichte GitHub-check geslaagd.
- Nieuwe route op main: `scripts/publish-flirt-package.mjs`, `docs/binaire-flirtpublicatie.md`, aangepaste `AGENTS.md` en herstelde FFmpeg-installatie in `.github/workflows/quality.yml`.
- Bestaande A03-branch: `roadie-a03-20261115` op commit `a0768aeed894cea1178bf68930695f61dd6b2ec5`. Nog geen A03-PR; film en poster ontbreken nog op de branch.
- Deze chat kan tekstbestanden naar GitHub schrijven, maar beschikt niet over een geauthenticeerde binaire `git push` vanuit de bestandscontainer. Het nieuwe script maakt die toegang niet automatisch beschikbaar. **Stop bij deze transportpoort; geen dubbele filmchecks, audits of PR met ontbrekende film.**
- Voor een Work met werkende Git-checkout: eerst actuele main in de bestaande A03-branch integreren zodat het nieuwe script beschikbaar is; pak `A03_publicatiepakket_2026-11-15.zip` uit; gebruik `node scripts/publish-flirt-package.mjs A03 <pakketmap> d7ff5983e8421613d901b23ef4faa9e477300a4728db1778a2ab648d7d95c4d0` in een schone checkout van de A03-branch. Daarna één PR, één CI-check, merge en aflevering.
- De oorspronkelijke goedkeuring en controles van de 77s film blijven geldig. Geen nieuwe toestemming nodig. **A03 nog niet live.**

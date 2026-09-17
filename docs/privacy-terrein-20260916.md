# Privacy Wisik-terrein — implementatievoorstel 16 september 2026

Deze notitie is de overdracht voor de codewijzigingen. De inhoudelijke bron staat in `PRIVACY-NOTITIES.md`.

## Doel

Maak de privacy-uitleg terreinbreed in plaats van alleen op Pabo Rekenklaar gericht. Laat tentgebonden bijzonderheden bij de tent staan. Verander geen leerlogica, voortgangsgegevens, app-routes of beoordelingslogica.

## 1. Backstage

Vervang in `public/backstage/index.html` het huidige privacykaartje:

> Gewoon gebruik van Pabo Rekenklaar bewaart voortgang lokaal. Het Wisik-Kladblok verzendt alleen wat de bezoeker zelf invult en de vooraf toegelichte broncontext.

Door:

> **Privacy op het hele terrein**  
> Je kunt Wisik zonder account gebruiken. Oefententen zoals Pabo Rekenklaar en de Space-tent bewaren je voortgang in je eigen browser, niet in een centraal studentendossier. Via het Kladblok verstuur je zelf een bericht, met de vooraf toegelichte brongegevens. Voor het bezoeken van de website en het gebruiken van externe diensten worden daarnaast technische gegevens verwerkt.

Voeg een link `Lees hoe Wisik met gegevens omgaat →` toe naar `#privacy`.

Voeg op dezelfde Backstage-pagina een sectie met `id="privacy"` toe. Gebruik bij voorkeur gewone HTML `<details>`/`<summary>` zodat geen extra JavaScript of externe dependency nodig is. Behandel daarin:

1. **Oefenen en voortgang bewaren** — geen account; Pabo Rekenklaar en Space-tent bewaren leerstatus lokaal; geen centraal studentendossier.
2. **Je eigen browser is je bewaarplek** — browser/devicegebonden; wissen van browsergegevens kan voortgang verwijderen; Space-tent kan door gebruiker zelf als JSON worden geëxporteerd/geïmporteerd.
3. **Kladblok** — alleen zelf ingevulde gegevens plus vooraf toegelichte, dataminimale broncontext; geen antwoorden, XP, diagnoses of leerhistorie; e-mailadres optioneel.
4. **Bewaartermijn Kladblok** — FormSubmit: externe termijn volgens actuele documentatie; ontvangen Kladblok-e-mails bij Wisik in beginsel maximaal 3 maanden. Langer alleen wanneer nodig voor opvolging of wanneer een vervolggesprek uit de inzending is ontstaan; daarna niet langer om die reden bewaren.
5. **Technische verbindingen** — lokale leeropslag betekent niet dat er geen technische web-/beveiligingsgegevens worden verwerkt. Geen absolute claims over Cloudflare/cookies/analytics toevoegen zonder actuele controle.
6. **Contact** — privacyvragen kunnen via `kladblok@wisik.nl` worden gesteld; vraag gebruikers geen gevoelige leerlinggegevens mee te sturen.

## 2. Kladblok: dataminimalisatie

Controleer `public/assets/js/site.js` en `public/assets/js/kladblok-context.js` gezamenlijk. Er bestaan momenteel twee contextpaden; voorkom dat één daarvan alsnog een volledige URL met onnodige queryparameters of fragment doorstuurt.

Gewenst contract voor automatisch meegestuurde context:

- product/tent;
- productversie;
- relevante Wisik-pagina als origin + pathname;
- actief hoofdonderdeel indien beschikbaar;
- geen willekeurige queryparameters;
- geen hash/fragment;
- geen antwoorden, XP, diagnosecodes, foutpatronen of andere lokale leerstatus.

Toon vóór verzenden zichtbaar welke soort context wordt meegestuurd. Houd de bestaande bescherming dat alleen same-origin Wisik-bronnen als broncontext worden geaccepteerd.

Werk in `public/kladblok/index.html` de zichtbare privacytekst bij met:

> Ontvangen Kladblok-e-mails worden bij Wisik in beginsel maximaal 3 maanden bewaard. Alleen wanneer een bericht nog nodig is voor opvolging of heeft geleid tot een vervolggesprek kan het langer worden bewaard.

Behoud daarnaast de bestaande waarschuwing om geen namen van leerlingen, studentnummers of andere gevoelige persoonsgegevens te delen en de uitleg over FormSubmit.

Voeg `Space-tent` toe als afzonderlijke keuze bij `Attractie of terrein` als die keuze nog ontbreekt.

## 3. Tentpagina's

### Pabo Rekenklaar

Voeg op `public/pabo/pabo-rekenklaar/index.html` een korte verwijzing toe naar `/backstage/#privacy`, zonder de bestaande oefenlogica te veranderen.

Voorkeurstekst:

> Je oefenvoortgang blijft in deze browser. Lees meer over privacy op Wisik.

### Space-tent

Behoud de bestaande sectie `Je voortgang blijft bij jou` in `public/hbo/space-tent/index.html`. Voeg daar alleen een link naar `/backstage/#privacy` toe voor de terreinbrede uitleg. De bestaande JSON-export/import-uitleg blijft staan.

## 4. Tests

Voeg of actualiseer regressietests zodat minimaal wordt gecontroleerd:

- Kladblokbron is same-origin;
- queryparameters en fragmenten worden niet in de verzonden bronpagina opgenomen;
- product, productversie en actief onderdeel blijven beschikbaar;
- rekenantwoorden, XP, diagnoses en andere leerstatus worden niet naar het Kladblok gekopieerd;
- Pabo Rekenklaar en Space-tent behouden hun bestaande lokale voortgangscontract;
- Backstage bevat `id="privacy"` en verwijzingen ernaartoe zijn geldig;
- Kladblok vermeldt de Wisik-bewaartermijn van 3 maanden met de twee uitzonderingsgronden.

## 5. Niet doen

- Geen bestaande browseropslag wissen of migreren.
- Geen centrale database toevoegen.
- Geen tenten technisch aan elkaar koppelen.
- Geen Cloudflare-instellingen wijzigen.
- Geen nieuwe analytics/cookies toevoegen.
- Geen onbevestigde absolute privacyclaims publiceren.

## 6. Publicatie

Werk bij voorkeur op branch `privacy-terrein-20260916`, voer de bestaande kwaliteitscontrole uit en merge pas daarna naar `main`. Volgens `DEPLOYMENT.md` activeert `main` de bestaande Cloudflare Pages-publicatieroute.

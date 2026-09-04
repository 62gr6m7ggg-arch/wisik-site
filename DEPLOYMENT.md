# Wisik.nl publiceren op Cloudflare Pages

## Fase 1 — site zonder automatisch Kladblok

1. Maak in GitHub een nieuwe repository, bijvoorbeeld `wisik-site`.
2. Plaats de inhoud van dit pakket in de repository en push naar `main`.
3. Voeg `wisik.nl` in Cloudflare toe als website/zone.
4. Cloudflare geeft twee nameservers. Vervang bij mijn.host de huidige nameservers van `wisik.nl` door deze Cloudflare-nameservers.
5. Maak in Cloudflare onder **Workers & Pages** een Pages-project vanuit de GitHub-repository.
6. Gebruik geen build command en stel de outputdirectory in op `public`.
7. Voeg bij het Pages-project onder **Custom domains** het domein `wisik.nl` toe.
8. Test eerst de automatisch aangemaakte `pages.dev`-preview en daarna `https://wisik.nl`.

De site zelf werkt dan. Het Kladblok toont zolang de backend niet is geconfigureerd een mailalternatief.

## Fase 2 — automatisch Wisik-Kladblok

Het formulier gebruikt:

- Cloudflare Turnstile voor spamcontrole;
- een Pages Function op `/api/feedback`;
- Cloudflare Email Service REST API voor verzending naar één geverifieerd ontvangstadres.

### A. Turnstile

1. Maak in Cloudflare een Turnstile-widget met als toegestane host `wisik.nl` en eventueel de `pages.dev`-previewhost.
2. Noteer de publieke sitekey en de geheime secret key.

### B. E-mail

1. Activeer Cloudflare Email Service voor `wisik.nl`.
2. Voeg het persoonlijke ontvangstadres toe als **verified destination address**.
3. Activeer Email Sending voor `wisik.nl`.
4. Gebruik als afzender bijvoorbeeld `kladblok@wisik.nl`.
5. Maak een Cloudflare API-token met uitsluitend de noodzakelijke machtiging voor Email Sending.

### C. Variabelen en secrets in Pages

Voeg bij het Pages-project onder **Settings → Variables and Secrets** toe:

| Naam | Type | Inhoud |
|---|---|---|
| `TURNSTILE_SITE_KEY` | gewone variabele | publieke sitekey |
| `TURNSTILE_SECRET_KEY` | secret | geheime Turnstile-key |
| `CF_ACCOUNT_ID` | gewone variabele | Cloudflare account-ID |
| `EMAIL_API_TOKEN` | secret | beperkt Email Sending-token |
| `FEEDBACK_TO` | gewone variabele | geverifieerd ontvangstadres |
| `FEEDBACK_FROM` | gewone variabele | `kladblok@wisik.nl` |

Voer daarna een nieuwe deployment uit. Test minimaal:

- geldige inzending;
- te kort bericht;
- ongeldig e-mailadres;
- niet-voltooide Turnstile;
- ontvangst van de e-mail;
- antwoordknop naar het optioneel ingevulde adres;
- mobiel Safari en desktopbrowser.

## Fase 3 — www en definitieve verwijzingen

- Voeg eventueel `www.wisik.nl` toe en stuur dit permanent door naar `https://wisik.nl`.
- Laat de oude Pabo-Rekenklaar-URL tijdelijk bestaan met een duidelijke verwijzing naar Wisik.
- Let op: lokale voortgang is domeingebonden. Voortgang op een oude URL verschijnt niet automatisch op `wisik.nl`. Voeg vóór een grootschalige verhuizing export/import toe wanneer behoud voor bestaande gebruikers belangrijk is.

## Publicatieregel

Publiceer alleen vanuit `main` nadat de GitHub Action **Wisik kwaliteitscontrole** is geslaagd.

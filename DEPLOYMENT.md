# Wisik.nl publiceren en beheren

## Website

- GitHub-repository: `62gr6m7ggg-arch/wisik-site`
- productiebranch: `main`
- Cloudflare Pages-project: `wisik-site`
- build command: leeg
- outputdirectory: `public`
- hoofddomein: `https://wisik.nl`
- `www.wisik.nl` wordt permanent doorgestuurd naar het hoofddomein.

Elke wijziging aan `main` activeert automatisch:

1. de GitHub-kwaliteitscontrole;
2. een nieuwe Cloudflare Pages-deployment.

## Pabo Rekenklaar

Pabo Rekenklaar staat onder:

```text
/apps/pabo-rekenklaar/
```

Versie 1.6.0 heeft in de sticky bovenbalk twee herkenbare terugwegen naar Wisik:

- het klikbare Wisik-logo;
- de tekstknop **Terug naar het Wisik-terrein**, op mobiel verkort tot **Terrein**.

Vóór vertrek wordt de bestaande lokale voortgang opnieuw naar `localStorage` geschreven. De tool registreert daarnaast alleen voor de actuele browsersessie:

- productnaam;
- productversie;
- exacte bron-URL;
- actief hoofdonderdeel;
- moment van opslaan.

Die context kan het Wisik-Kladblok automatisch toevoegen aan een latere notitie. Rekenantwoorden, XP, diagnostische patronen en andere lokale voortgang worden niet naar het Kladblok gekopieerd.

Lokale voortgang is domeingebonden. Voortgang op een oudere URL verschijnt niet automatisch op Wisik. Voeg vóór grootschalige migratie export/import toe wanneer behoud voor bestaande gebruikers nodig is.

## Wisik-Kladblok

Het Kladblok gebruikt geen betaalde Cloudflare Email Sending-dienst en geen eigen backenddatabase.

De route is:

1. de gebruiker vult het HTML-formulier op `/kladblok/` in;
2. beschikbare broncontext uit dezelfde browsersessie wordt in verborgen, zichtbaar toegelichte velden geplaatst;
3. de browser verstuurt het formulier via HTTPS naar FormSubmit;
4. FormSubmit voert spamcontrole uit en mailt de inzending naar `kladblok@wisik.nl`;
5. Cloudflare Email Routing stuurt die mail door naar het geverifieerde persoonlijke ontvangstadres.

De formulieractie is:

```text
https://formsubmit.co/kladblok@wisik.nl
```

Het formulier bevat:

- de standaard spamcontrole van FormSubmit;
- een honeypotveld;
- browservalidatie voor verplichte velden, minimale berichtlengte en e-mailadres;
- een vaste bedankroute terug naar Wisik;
- een zichtbare privacywaarschuwing;
- optionele automatische context: bronpagina, product, productversie en actief onderdeel;
- geen uploads of bijlagen.

## E-mail

Cloudflare Email Routing moet actief blijven voor:

```text
kladblok@wisik.nl → geverifieerd persoonlijk ontvangstadres
```

Een betaald Workers-abonnement, Cloudflare Email Sending-token en Pages-secrets zijn voor deze versie niet nodig.

## Publicatieregel

Publiceer alleen vanuit `main` nadat **Wisik kwaliteitscontrole** is geslaagd. Die controle blokkeert onder meer een release wanneer:

- een van de Pabo-terreinuitgangen ontbreekt;
- de mobiele uitgangstekst of smalschermregeling ontbreekt;
- voortgang niet vóór vertrek wordt opgeslagen;
- de Pabo-broncontext niet beschikbaar is voor het Kladblok;
- versienummers op de app, productpagina en koepelsite uiteenlopen.

Controleer na structurele wijzigingen ook mobiel Safari, een desktopbrowser, het `www`-redirect en een echte Kladblokinlevering.

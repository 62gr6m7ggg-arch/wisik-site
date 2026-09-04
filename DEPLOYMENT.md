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

## Wisik-Kladblok

Het Kladblok gebruikt geen betaalde Cloudflare Email Sending-dienst en geen eigen backenddatabase.

De route is:

1. de gebruiker vult het HTML-formulier op `/kladblok/` in;
2. de browser verstuurt het formulier via HTTPS naar FormSubmit;
3. FormSubmit voert spamcontrole uit en mailt de inzending naar `kladblok@wisik.nl`;
4. Cloudflare Email Routing stuurt die mail door naar het geverifieerde persoonlijke ontvangstadres.

De formulieractie is:

```text
https://formsubmit.co/kladblok@wisik.nl
```

De eerste echte inzending kan een eenmalige activatiemail van FormSubmit veroorzaken. Bevestig die via het ontvangstadres. Daarna worden volgende inzendingen automatisch bezorgd. FormSubmit vermeldt dat nog niet bevestigde en gearchiveerde inzendingen maximaal 30 dagen worden bewaard.

Het formulier bevat:

- de standaard spamcontrole van FormSubmit;
- een honeypotveld;
- browservalidatie voor verplichte velden, minimale berichtlengte en e-mailadres;
- een vaste bedankroute terug naar Wisik;
- een zichtbare privacywaarschuwing;
- geen uploads of bijlagen.

## E-mail

Cloudflare Email Routing moet actief blijven voor:

```text
kladblok@wisik.nl → geverifieerd persoonlijk ontvangstadres
```

Een betaald Workers-abonnement, Cloudflare Email Sending-token en Pages-secrets zijn voor deze versie niet nodig.

## Publicatieregel

Publiceer alleen vanuit `main` nadat **Wisik kwaliteitscontrole** is geslaagd. Controleer na structurele wijzigingen ook mobiel Safari, een desktopbrowser, het `www`-redirect en een echte Kladblokinlevering.

## Pabo Rekenklaar

Pabo Rekenklaar staat onder:

```text
/apps/pabo-rekenklaar/
```

Lokale voortgang is domeingebonden. Voortgang op een oudere URL verschijnt niet automatisch op Wisik. Voeg vóór grootschalige migratie export/import toe wanneer behoud voor bestaande gebruikers nodig is.

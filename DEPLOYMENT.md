# Wisik.nl publiceren en beheren

## Website

- GitHub-repository: `62gr6m7ggg-arch/wisik-site`
- productiebranch: `main`
- Cloudflare Pages-project: `wisik-site`
- vereiste build command: `npm run build`
- outputdirectory: `public`
- hoofddomein: `https://wisik.nl`
- `www.wisik.nl` wordt permanent doorgestuurd naar het hoofddomein.

Elke wijziging aan `main` activeert automatisch:

1. de GitHub-kwaliteitscontrole;
2. een nieuwe Cloudflare Pages-build, die dezelfde controle opnieuw moet uitvoeren.

De Cloudflare-buildopdracht mag daarom niet leeg zijn. Met `npm run build` stopt ook Cloudflare vóór publicatie wanneer de vrijgavecontrole faalt. De GitHub-workflow alleen kan een los daarvan gestarte Cloudflare-deployment niet tegenhouden.

## Automatisch vrijgavebewijs

De verplichte controle voert de kwaliteits-API van Pabo Rekenklaar in een frisse, afgeschermde JavaScript-omgeving uit. Zij controleert onder meer:

- 17.000 gegenereerde vraaginstanties in 170 generatorcombinaties;
- 2.250 afzonderlijke Moshpit-vragen op het strikte korte-hoofdrekencontract;
- herberekenbare antwoorden en een identieke herhaling met dezelfde seed;
- nul terugvalvragen;
- technische afleesbaarheidsregels en toegankelijke markering voor grafieken;
- 30 diagnostische patronen, 1.200 gerichte controlevragen en natuurlijke terugclassificatie;
- het veilig niet stellen van een diagnose als één fout antwoord bij meer dan één patroon past.

Een geslaagde controle levert `public/assets/data/pabo-release-audit.json` op. Backstage toont dit bestand alleen groen wanneer schema, Wisik-versie, attractieversie en alle zes vrijgavepoorten overeenkomen. Bij een volgende kandidaat die faalt, blijft het laatst geslaagde online bewijs staan; een rood kandidaatrapport wordt niet als openbare release gepubliceerd.

De audit is een sterke interne regressie- en consistentiecontrole. Zij is geen bewijs van leerwinst, geen empirische kalibratie en geen vervanging voor vakdidactische review of mobiele gebruikerstests.

## Pabo Rekenklaar

Pabo Rekenklaar staat onder:

```text
/apps/pabo-rekenklaar/
```

Versie 1.6.1 heeft in de sticky bovenbalk twee herkenbare terugwegen naar Wisik:

- het klikbare Wisik-logo;
- de tekstknop **Terug naar het Wisik-terrein**, op mobiel verkort tot **Terrein**.

De Moshpit gebruikt de toegestane ingang `/apps/pabo-rekenklaar/?ingang=moshpit&modus=sprint`. Deze route zet binnen Pabo Rekenklaar eerst het startscherm klaar; de klok begint pas na de tweede, bewuste klik. De gewone app-route en de diagnostiek- en releasecontroleparameters blijven daarvan gescheiden.

Vóór vertrek wordt de bestaande lokale voortgang opnieuw naar `localStorage` geschreven. De tool registreert daarnaast alleen voor de actuele browsersessie:

- productnaam;
- productversie;
- exacte bron-URL;
- actief hoofdonderdeel;
- moment van opslaan.

Die context kan het Wisik-Kladblok automatisch toevoegen aan een latere notitie. Rekenantwoorden, XP, diagnostische patronen en andere lokale voortgang worden niet naar het Kladblok gekopieerd.

Lokale voortgang is domeingebonden. Voortgang op een oudere URL verschijnt niet automatisch op Wisik. Voeg vóór grootschalige migratie export/import toe wanneer behoud voor bestaande gebruikers nodig is.

## Grabbelton-media

De enige openbare videocatalogus staat in `public/assets/data/grabbelton-videos.json`. Voeg een filmpje eerst als `draft` toe en publiceer het pas wanneer bron, Nederlandse ondertiteling, transcript, polsband en een bestaande Pabo-misconceptcode compleet zijn. Zelfgehoste media mogen van `wisik.nl` of `media.wisik.nl` komen; de Content-Security-Policy staat geen automatische externe videospeler toe.

Voor media op `media.wisik.nl` is daarnaast een technisch aflevercontract verplicht vóór de status `published`:

- video krijgt het juiste MIME-type (`video/mp4` of `video/webm`), byte-range-ondersteuning en `Access-Control-Allow-Origin: https://wisik.nl`;
- Nederlandse ondertiteling krijgt `Content-Type: text/vtt` en dezelfde CORS-header;
- video, ondertiteling en transcript worden vanaf `https://wisik.nl/grabbelton/` daadwerkelijk geladen en afgespeeld voordat de cataloguswijziging wordt vrijgegeven.

Media onder hetzelfde `wisik.nl`-domein heeft geen cross-origin-configuratie nodig, maar blijft aan dezelfde publicatiecontrole onderworpen.

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
- versienummers op de app, productpagina en koepelsite uiteenlopen;
- het openbare auditbewijs niet bij de actuele bronvingerafdruk hoort;
- een vraagvariant structureel ongeldig of intern tegenstrijdig is;
- een canoniek antwoord niet kan worden herberekend of geaccepteerd;
- een terugvalvraag wordt gebruikt;
- een grafiek de technische schaal-, raster- of toegankelijkheidsregels schendt;
- een diagnostisch antwoord aan het verkeerde patroon wordt gekoppeld.

Voor volledige afdwinging zijn beide externe instellingen nodig:

1. laat GitHub alleen wijzigingen naar `main` toe nadat **Verplichte vrijgavecontrole** is geslaagd;
2. stel in Cloudflare Pages de build command in op `npm run build`.

Controleer na structurele wijzigingen ook mobiel Safari, een desktopbrowser, het `www`-redirect en een echte Kladblokinlevering.

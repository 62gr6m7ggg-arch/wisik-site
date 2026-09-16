# Privacy-notities voor de definitieve Wisik-privacyverklaring

Laatst inhoudelijk gecontroleerd: 16 september 2026.

## Terreinbreed uitgangspunt

- Wisik is zonder account te gebruiken.
- De gewone koepelsite gebruikt in deze versie geen advertentiecookies en geen externe analytics. Deze formulering alleen publiek gebruiken zolang de feitelijke hosting- en analyticsinstellingen dit blijven ondersteunen.
- Leerresultaten van oefententen worden niet als centraal studentendossier bij Wisik opgeslagen.
- Technische web-, beveiligings-, bezorg- en e-mailrouteringslogs kunnen wel technische verbindingsgegevens bevatten. Lokale opslag van leerresultaten betekent dus niet dat een websitebezoek zonder enige technische gegevensverwerking plaatsvindt.
- Bij iedere nieuwe of wezenlijk gewijzigde tent moet vóór publicatie worden gecontroleerd: wat wordt lokaal bewaard, wat wordt naar een server verzonden, welke externe diensten worden gebruikt en welke aanvullende privacy-uitleg nodig is.

## Pabo Rekenklaar

- Pabo Rekenklaar bewaart voortgang lokaal in de browser van de gebruiker.
- Vóór een terugkeer naar het Wisik-terrein schrijft Pabo Rekenklaar die bestaande lokale voortgang nogmaals naar `localStorage`; er wordt daarbij niets naar een resultaatserver verzonden.
- Pabo Rekenklaar bewaart voor de actuele browsersessie afzonderlijk alleen context voor eventuele feedback: productnaam, productversie, bronpagina, actief hoofdonderdeel en opslagtijdstip.
- Rekenantwoorden, XP, diagnostische codes, foutpatronen en andere lokaal opgeslagen voortgang mogen niet automatisch aan het Kladblok worden toegevoegd.

## Space-tent / Ruimteklaar

- Antwoorden, hulpgebruik en voortgang worden uitsluitend in de lokale browseropslag bewaard (`wisik.space-tent.progress.v1`).
- De app gebruikt geen account, analytics of resultaatendpoint.
- De gebruiker kan zelf een JSON-bestand downloaden en op een ander apparaat importeren; dit bestand bevat leerresultaten. De gebruiker kiest zelf waar dit bestand wordt bewaard en met wie het wordt gedeeld.
- Browsergegevens wissen verwijdert de lokale voortgang. Voortgang van de eerdere ChatGPT-site verhuist niet automatisch.
- De lokale resultaten zijn geen geauthenticeerd toetsbewijs.
- De Vraagbaak bewaart geen zoektekst of leesgeschiedenis. Gebruik van hulp tijdens een onafgemaakte onafhankelijke controle kan wel als hulpgebruik onderdeel zijn van de lokaal opgeslagen leerstatus.

## Wisik-Kladblok

- Het Wisik-Kladblok verstuurt alleen de velden die de gebruiker zelf invult, plus de siteversie en beschikbare, vooraf toegelichte broncontext uit dezelfde browsersessie.
- De broncontext moet dataminimaal zijn: Wisik-product/tent, productversie, relevante Wisik-pagina en actief onderdeel. Niet-noodzakelijke URL-queryparameters en fragmentgegevens worden niet meegestuurd.
- Het formulier stuurt geen rekenantwoorden, XP, diagnostische codes, foutpatronen of andere lokaal opgeslagen voortgang mee.
- Een e-mailadres is optioneel en alleen nodig wanneer de gebruiker een reactie wil ontvangen.
- Het Kladblok toont zichtbaar wanneer automatisch broncontext wordt toegevoegd en welke soort context dat is.
- Na verzending verwerkt FormSubmit de formuliergegevens, voert de dienst de spamcontrole uit en bezorgt zij de notitie per e-mail aan `kladblok@wisik.nl`.
- Cloudflare Email Routing stuurt berichten voor `kladblok@wisik.nl` door naar het geverifieerde persoonlijke ontvangstadres.
- FormSubmit vermeldt in zijn documentatie dat formulierinzendingen gedurende 30 dagen worden bewaard. Deze externe verwerking en bewaartermijn moeten zichtbaar bij het Kladblok blijven staan zolang dit feitelijk klopt.
- Wisik houdt geen eigen formulierdatabase of afzonderlijke blijvende kopie van het bericht bij. De ontvangen e-mail is wel een door Wisik bewaarde kopie.
- Ontvangen Kladblok-e-mails worden in beginsel maximaal **3 maanden** bewaard. Een bericht kan langer worden bewaard wanneer dat redelijkerwijs nodig is voor de opvolging of wanneer uit de inzending een vervolggesprek is ontstaan. Zodra die noodzaak vervalt, hoort het bericht niet langer om die reden bewaard te blijven.
- Publiceer een gebruikersreactie alleen geanonimiseerd en wanneer het afzonderlijke toestemmingsvak is aangevinkt.
- De gebruiker wordt gevraagd geen namen van leerlingen, studentnummers of andere gevoelige persoonsgegevens in te sturen.

## Publieke uitleg op Backstage

Voorkeursopzet: één terreinbrede privacy-uitleg op `/backstage/#privacy`, met een korte zichtbare samenvatting en een verdiepende sectie. Tentgebonden bijzonderheden blijven daarnaast op de betreffende productpagina staan.

Voorgestelde korte tekst:

> **Privacy op het hele terrein**  
> Je kunt Wisik zonder account gebruiken. Oefententen zoals Pabo Rekenklaar en de Space-tent bewaren je voortgang in je eigen browser, niet in een centraal studentendossier. Via het Kladblok verstuur je zelf een bericht, met de vooraf toegelichte brongegevens. Voor het bezoeken van de website en het gebruiken van externe diensten worden daarnaast technische gegevens verwerkt.

De verdiepende uitleg moet ten minste afzonderlijk behandelen: lokale leergegevens, browseropslag/export, het Kladblok, de bewaartermijn van Kladblok-e-mails, technische verbindingen/externe diensten en contact voor privacyvragen.

## Open controlepunten

- Controleer vóór een absolute publieke claim over cookies, analytics of technische logs de feitelijk actieve Cloudflare- en eventuele andere externe instellingen.
- Controleer periodiek of de genoemde bewaartermijn en werking van FormSubmit nog overeenkomen met de actuele dienst.
- Controleer na wijzigingen aan het Kladblok dat geen leerresultaten of onnodige URL-gegevens in de verzonden broncontext terechtkomen.

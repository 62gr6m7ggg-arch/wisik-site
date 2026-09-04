# Privacy-notities voor de definitieve Wisik-privacyverklaring

- De gewone koepelsite gebruikt in deze versie geen advertentiecookies en geen externe analytics.
- Pabo Rekenklaar bewaart voortgang lokaal in de browser van de gebruiker.
- Vóór een terugkeer naar het Wisik-terrein schrijft Pabo Rekenklaar die bestaande lokale voortgang nogmaals naar `localStorage`; er wordt daarbij niets naar een server verzonden.
- Pabo Rekenklaar bewaart voor de actuele browsersessie afzonderlijk alleen context voor eventuele feedback: productnaam, productversie, exacte bron-URL, actief hoofdonderdeel en opslagtijdstip.
- Het Wisik-Kladblok verstuurt alleen de velden die de gebruiker zelf invult, plus de siteversie en beschikbare broncontext uit dezelfde browsersessie.
- Het formulier stuurt geen rekenantwoorden, XP, diagnostische codes, foutpatronen of andere lokaal opgeslagen voortgang mee.
- Een e-mailadres is optioneel en alleen nodig wanneer de gebruiker een reactie wil ontvangen.
- Het Kladblok toont zichtbaar wanneer automatisch broncontext wordt toegevoegd.
- Na verzending verwerkt FormSubmit de formuliergegevens, voert de dienst de spamcontrole uit en bezorgt zij de notitie per e-mail aan `kladblok@wisik.nl`.
- Cloudflare Email Routing stuurt berichten voor `kladblok@wisik.nl` door naar het geverifieerde persoonlijke ontvangstadres.
- FormSubmit vermeldt in zijn actuele documentatie dat formulierinzendingen gedurende 30 dagen worden bewaard. Deze externe verwerking en bewaartermijn staan daarom zichtbaar bij het Kladblok.
- Wisik houdt geen eigen database of blijvende kopie van het bericht bij.
- Server-, beveiligings-, bezorg- en e-mailrouteringslogs kunnen technische verbindingsgegevens bevatten.
- Publiceer een gebruikersreactie alleen geanonimiseerd en wanneer het afzonderlijke toestemmingsvak is aangevinkt.

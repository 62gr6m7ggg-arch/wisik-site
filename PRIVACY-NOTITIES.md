# Privacy-notities voor de definitieve Wisik-privacyverklaring

- De gewone koepelsite gebruikt in deze versie geen advertentiecookies en geen externe analytics.
- Pabo Rekenklaar bewaart voortgang lokaal in de browser van de gebruiker.
- Het Wisik-Kladblok verzendt alleen de velden die de gebruiker zelf invult, plus pagina en siteversie.
- Het formulier stuurt geen rekenantwoorden, XP, diagnostische codes of lokaal opgeslagen voortgang mee.
- Een e-mailadres is optioneel en alleen nodig wanneer de gebruiker een reactie wil ontvangen.
- De server gebruikt het IP-adres alleen kortstondig voor de Turnstile-validatie; het wordt niet in de Kladbloknotitie opgenomen.
- Na succesvolle Turnstile-validatie stuurt de Wisik Pages Function de opgeschoonde formuliergegevens door naar FormSubmit, dat de notitie per e-mail bezorgt aan `kladblok@wisik.nl`.
- FormSubmit vermeldt in zijn actuele documentatie dat formulierinzendingen gedurende 30 dagen worden bewaard. Neem deze externe verwerking en bewaartermijn expliciet op in de openbare privacytekst bij het Kladblok.
- De Cloudflare Pages Function houdt geen eigen database of blijvende kopie van het bericht bij.
- Server-, beveiligings- en e-mailrouteringslogs kunnen technische verbindingsgegevens bevatten.
- Publiceer een gebruikersreactie alleen geanonimiseerd en wanneer het afzonderlijke toestemmingsvak is aangevinkt.

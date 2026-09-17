# Terreinbrede privacy — uitvoering

Opvolging van issue #56 op de bestaande privacybranch, bijgewerkt met de actuele main inclusief Pabo 1.8.0. Wisik-siteversie 0.1.29; appversies, vragen, antwoorden, beoordelingslogica en lokale voortgang blijven ongewijzigd.

Backstage bevat één terreinbrede privacysectie met zes native uitklaponderdelen. Beide productpagina's verwijzen ernaartoe. Kladblok vermeldt het afzonderlijke Wisik-beleid van drie maanden met uitzonderingen voor opvolging/vervolggesprek, plus de gedocumenteerde FormSubmit-termijn van dertig dagen. Space-tent is een eigen formulierkeuze. Er is nog steeds maar één formulier.

Beide contextpaden accepteren alleen dezelfde http(s)-origin en geven uitsluitend origin + pathname door, ook bij oude sessiecontext, referrer, rechtstreekse links en verzending. URL-credentials, queryparameters en fragmenten verdwijnen. De vier expliciete contextvelden worden behouden; er wordt geen lokale leerstatus ingelezen. De twee paden gebruiken dezelfde bron als het hoofdscript beschikbaar is; het zelfstandige vangnet blijft bruikbaar.

De nieuwe dependencyvrije privacyregressietest is onderdeel van npm run check/build. Browsercontrole onderschept de FormSubmit-POST vóór verzending; er wordt geen echte testmail verstuurd. De workflow bewaart bewijs en schermafbeeldingen. Voor publicatie moeten de gehele bestaande vrijgavecontrole en de nieuwe tests slagen. Na publicatie worden de daadwerkelijk geserveerde bestanden bytegelijk vergeleken en de privacybrowserroutes herhaald.

Grenzen: geen fysieke iPhone-test, juridische volledigheidsverklaring, pentest of inzage in Cloudflare-accountinstellingen. Het bewaarbeleid is gepubliceerd; er is geen automatische verwijdering van e-mails ingesteld en geen mailbox gewijzigd. Branchbescherming is alleen voorbereid in een importbestand en vereist activering door de eigenaar; zie github-main-bescherming.md.

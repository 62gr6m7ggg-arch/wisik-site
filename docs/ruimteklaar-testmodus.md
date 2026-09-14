# Ruimteklaar testmodus — toegang 1.1, leerlingeditie 0.4.5

Ingang: `/apps/ruimteklaar/test/`. De testmodus is geen alternatieve leerlingenroute.
261 losse vragen, tien cursusconstructies, één werkbank met twee varianten,
23 lesblokken, acht checks/proeven en acht papieronderdelen zijn vrij opvraagbaar.
Filters, overslaan, opnieuw testen, beoordelaarsuitwerking en het bestaande
Kladblok blijven ongewijzigd. De echte leerlingcomponenten worden hergebruikt.
Testpogingen blijven uitsluitend in het tabbladgeheugen; geen wijziging van
leerlingopslag, XP of routevoorwaarden, geen verzending naar een voortgangs-API.

## Nieuwe toegangsregel van Edwin
Het inlogscherm heeft uitsluitend één zichtbaar wachtwoordveld. Geen voorbeeld,
placeholder, aanwijzing, uitleg, zichtbaar label of knop. Enter (of Ga/Gereed op
het mobiele toetsenbord) verstuurt het formulier. Een afwijzing geeft alleen een
rode veldrand en een generieke, alleen voor schermlezers aanwezige foutmelding.

De eerste invoer is een positief geheel getal groter dan 1, gevolgd door de
volledige priemfactorisatie, met spaties tussen de onderdelen. Bijvoorbeeld:
`360 2 2 2 3 3 5`, `360 2^3 3^2 5` of `360 2³ 3² 5`.
Volgorde, herhaalde factoren en extra witruimte maken niet uit. Een priemgetal
zelf is geldig: `13 13`. Samengestelde factoren zijn ongeldig, ook wanneer hun
product klopt: `12 4 3` wordt dus afgewezen. 0, 1, negatieve getallen en nul- of
negatieve exponenten worden niet als priemfactorisatie geaccepteerd.

Exacte BigInt-rekenkunde, geen eval en geen afgeronde producten. Voor een
voorspelbare rekentijd is het getal begrensd op 18 446 744 073 709 551 615 (2^64-1),
met maximaal 512 invoertekens. De eerste twaalf priemgetallen zijn de getuigen
voor deterministische Miller-Rabin-primaliteit binnen dit bereik. Referentie:
Sorenson en Webster, Strong Pseudoprimes to Twelve Prime Bases, arXiv:1509.00864.
Grotere invoer wordt afgewezen; er wordt niet teruggevallen op een waarschijnlijkheidstest.

## Aard en grenzen van de toegang
Dit is op uitdrukkelijk verzoek een WISKUNDIGE TOEGANGSDREMPEL, geen geheime
wachtwoordbeveiliging of identiteitscontrole. Wie de regel kent, kan zelf een
code maken. De openbare bronrepository bevat de implementatie en tests; deze
regel is dus niet geheim voor iemand die de broncode onderzoekt. Gebruik deze
toegang niet voor persoonsgegevens, beheerrechten of vertrouwelijke gegevens.

De server toetst bij ELK verzoek de volledige wiskundige code opnieuw, ook voor
HTML, JavaScript, CSS en de statuscontrole. Een losse logged-in-vlag of een
willekeurige cookie verleent geen toegang. Het inlogformulier werkt via HTTPS
POST met Origin-controle. De code staat niet in de URL of de formulierrespons.

Na aanvaarding bewaart een __Host-cookie de gecanoniseerde code in een gecodeerde
(en dus NIET versleutelde of ondertekende) credential-envelope, met HttpOnly,
Secure, SameSite=Strict en Max-Age=3600. Bij normaal gebruik vraagt de browser na
één uur opnieuw om invoer. Uitloggen verwijdert de cookie. Dit is geen hard
niet-verlengbare sessiegrens: iemand met een geldige factorisatie is volgens deze
regel bevoegd en kan opnieuw inloggen of de envelope met diezelfde code vernieuwen.
Verouderde, beschadigde en dubbel aangeleverde cookies worden geweigerd.
Er wordt geen pseudo-geheime sleutel in de openbare broncode ingebakken.

De eerdere Cloudflare-instellingen RUIMTEKLAAR_TEST_PASSWORD en
RUIMTEKLAAR_TEST_SESSION_SECRET zijn voor deze nieuwe toegangsregel niet nodig en
worden niet gebruikt. Er is geen extra activeringsstap nodig. De hostgebonden
credential wordt op elke deployment op dezelfde wijze getoetst, ook op previews.
Alleen het testpad gebruikt de Pages Function; de leerlingapp blijft statisch.
De testbundels blijven in server/, buiten public/. Een Function-uitval mag nooit
een openbaar statisch testbestand opleveren. Antwoorden krijgen no-store/noindex.

De vijf-pogingenrem per vijftien minuten is vluchtig per Worker-isolate, niet een
wereldwijde WAF-rate-limit. De in-memory sleutel is een hash van origin en IP;
geen ruwe IP-adressen of ingevoerde codes worden door deze code gelogd.

## Controles
`scripts/test-ruimteklaar-review-auth.mjs` controleert de rekenregel tegen een
onafhankelijke kleine-getallenzeef en trial-division-factorisaties, grensgevallen,
schijnpriemen, exponenten, ongeldige invoer, header-/formuliergrenzen en afscherming.
De bestaande browserproef opent alle 311 onderdelen in drie browsers, inclusief
invoer met Enter, filters, leerlingcomponenten, ongewijzigde opslag en uitloggen.
Bronbestanden, testbewijs en serverbundel zijn gekoppeld in
`server/ruimteklaar-test-manifest.json`. De gewone leerlingbundel blijft identiek.
Geen professionele penetratietest en geen test op een fysieke iPhone.

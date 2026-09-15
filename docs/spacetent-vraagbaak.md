# Spacetent Vraagbaak A–Z

De vraagbaak hoort bij Spacetent. Versie 0.5.0 bevat 145 begrippen uit de zes
PowerPoints Ruimtemeetkunde 1 en het bijbehorende aangeleverde cursusmateriaal.
De moderne lespresentaties bepalen de kern; extra stof en de GeoGebra-leertaak
hebben een eigen label. Het oudere studiewijzermateriaal is geen bewijs dat alle
daarin genoemde hoofdstukken in de huidige zes lessen verplicht zijn.

## Inhoud onderhouden

`tools/space-tent/app/knowledge/entries.json` is de inhoudelijke bron. Elk begrip
heeft een stabiel id, naam, zoekalternatieven, categorie, cursus, stoflabel,
leskoppelingen, bronverwijzingen, uitleg, aanpak, voorbeeld, valkuilen en verwante
begrippen. De broncatalogus staat in `sources.json`. De bestanden bevatten geen
antwoorden uit lopende leerlingpogingen. Volledige PowerPoints en boeken worden
niet opnieuw gepubliceerd.

Voeg een begrip toe met een uniek id en complete inhoud. Kies een bestaande
figuur die bij het begrip past, of voeg een exact berekende figuur toe in
`figure-data.ts` en `figures.tsx`. Het bijschrift specificeert de figuurgegevens;
een uitgewerkt rekenvoorbeeld kan eigen gegevens hebben. Vermeld bij ieder begrip
de inhoudelijke reviewstatus en datum. `inhoudelijk-nagekeken` betekent een interne
controle, geen onafhankelijke vakdocentreview of aangetoonde leerwinst.

De lijst sorteert zelf volgens het Nederlandse alfabet. Namen en synoniemen
krijgen voorrang bij zoeken; als die niets opleveren wordt ook de uitleg doorzocht.
Verwante begrippen en enkele begrippen in de tekst zijn aanklikbaar. De A–Z-knoppen,
scrollpositie van de lijst en vaste terugknop ondersteunen gebruik op de telefoon.

## Terugkeer en checks

`KnowledgeProvider` toont een modaal paneel terwijl de leercomponent gemonteerd
blijft. Antwoorden, schriftelijke aanpak, constructie, selectie, camera en undo
blijven zo behouden. De terugknop, Escape en browser-terug sluiten de vraagbaak.
De vraagbaak is ook beschikbaar wanneer latere leerlevels nog op slot staan.

Alleen een artikel openen roept de hulpregistratie van de actieve oefening aan.
Zoeken en bladeren tellen niet als hulp. Bij een onafgemaakte zelfstandige check
geldt de gehele poging daarna als werken met hulp. Een nieuwe poging kan weer
zelfstandig worden behaald. Eerder behaalde onafhankelijke resultaten blijven
geldig. Een diagnostische controlevraag met geraadpleegde uitleg kan een vermoeden
niet als onafhankelijke aanwijzing bevestigen.

Voortgang bewaart uitsluitend dát er bij de vraag en poging hulp is gebruikt:
geen zoektermen, artikel-id's of leesgeschiedenis. De reviewer gebruikt tijdelijke
testpogingen; deze schrijft geen leerlinggegevens. Andere Wisik-tenten gebruiken
deze gegevens of component niet.

## Uitbreiden en controleren

Behoud eigenaarschap, inhoud en beoordeling binnen Spacetent. Nieuwe cursussen
kunnen later een eigen cursus-id, broncatalogus en begrippen krijgen. Een gedeeld
Wisik-overzicht kan daarna naar zulke tentgebonden inhoud verwijzen; het hoeft
geen gedeelde beoordeling of gedeeld voortgangsbestand te introduceren.

`npm test` in `tools/space-tent` controleert de inhoudsstructuur, meetkundige
voorbeelden en de regels voor hulpregistratie. `check-knowledge-browser.mjs`
controleert alle 145 artikelen op desktop en 320 px, plus representatieve
artikelen op andere breedten en WebKit. Het controleert ook onafgemaakte antwoorden,
constructies, camera, undo, browser-terug en het hervatten van geholpen checks.
De bestaande constructie- en reviewtests blijven verplichte regressiecontroles.
`npm run audit:build` maakt de versies zonder testafhankelijkheden voor de centrale
Wisik-vrijgavecontrole. De workflow bindt de gecontroleerde bron, bundel en
browserresultaten voordat publicatie vanuit `main` plaatsvindt.

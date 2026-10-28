# Oefenatelier 1.1.0 — tentamen D

Tentamen D heeft nu zes opgaven en tien interactieve deelvragen (40 oorspronkelijke VWO-punten), naast de bestaande elf deelvragen van A (41 punten). De inhoud volgt de ongewijzigde PDF van D: oorspronkelijke jaar-/tijdvak-/vraagnummers, vraagpagina, werkbladpagina en correctiepagina staan per deelvraag vast. B en C blijven PDF-oefententamens.

Iedere D-deelvraag heeft een eigen hint, gecontroleerde verwijzingen naar de oorspronkelijke stellingenlijst, een bewijs of constructie in stappen met analytisch geconstrueerde SVG-figuren, officiële deelscores in eigen bewoordingen en een herkenbaar eigen korte vervolgopgave. Constructies tonen bij de start alleen de gegeven situatie. De bronvoorwaarden voor de spiegelconstructie worden expliciet behouden.

De routing en PDF-verwijzingen zijn nu tentamenafhankelijk. Vorige/volgende blijft binnen het gekozen tentamen. De keuzelijst groepeert A en D. De veilige teruglink in de stellingentent accepteert ook de tien vaste D-ID's. Opslagsleutel en schema blijven gelijk: A-notities en uitlegstappen blijven behouden, D krijgt afzonderlijke records. Import/export ondersteunt beide tentamens.

## Controle

De meetkundecontrole toetst beide aantallen/puntentotalen, alle stellingverwijzingen en alle figuurstappen. Voor D worden onafhankelijk afgeleide meetkundige relaties getest: hoekhalvering, congruentie, de gestrekte hoek, beide fysieke spiegelrichtingen, cirkellidmaatschap, raaklijnen, de gegeven hoekongelijkheid, bissectrice en de nieuwe koordenvierhoek. Ook behoud van A-voortgang bij het toevoegen van D en teruglinks voor iedere deelvraag worden gecontroleerd. Bestaande A-controles, inclusief 241 baanposities, blijven aanwezig.

Alle tien eindfiguren visueel nagekeken. Browsercontrole richt zich op keuze, bewijsstappen, PDF- en werkbladverwijzingen, terugkeer uit het naslagwerk en smalle weergave. Een fysieke iPhone/Safari-test en vakdidactische gebruikerstest zijn niet uitgevoerd. De vervolgvragen zijn oefenkansen, geen gevalideerde beheersingsmeting; bewijzen worden niet automatisch beoordeeld.

De koepelsite blijft 0.1.31. De onderdeelversie van het oefenatelier is 1.1.0.

## Live-nacontrole: modulecache

Een terugkerende browser laadde na de eerste publicatie nog content.js 1.0.0 naast de nieuwe appcode. Daarom dragen nu alle lokale imports in de browsermodulegraaf expliciet de onderdeelversie, inclusief de import van content.js vanuit state.js. De HTML verwijst naar een vernieuwde entry-URL. Een regressiecontrole bewaakt dit cachecontract. Alleen no-cache-headers zijn voor deze release niet voldoende gebleken.

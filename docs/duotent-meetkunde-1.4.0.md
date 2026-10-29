# Oefenatelier 1.4.0 — tentamen E

Het gecorrigeerde Wisik-oefententamen E is toegevoegd als volledige oefenroute naast A–D: zes opgaven, acht deelvragen, 40 punten en 120 minuten. De twee bewijsrichtingen van opgave 1 worden afzonderlijk aangeboden. De collectie bevat nu 50 deelvragen. E wordt herkenbaar als eigen oefententamen in HAN-stijl aangeboden, met een Wisik-antwoordmodel. Alleen E5 verwijst naar de gebruikte VWO-opgave (2014, tijdvak I, vraag 18).

Elke deelvraag heeft een denkvraag, stellingkoppelingen, stapsgewijze figuren, beoordelingspunten en een vervolgopgave met antwoord. Lengtes staan consequent tussen strepen, bijvoorbeeld |AB|; lijnen en lijnstukken worden in de tekst benoemd. De twee constructies beginnen met alleen de gegeven punten, cirkel en lijn. Bij E3 verschijnen beide grote open bogen en worden A en B uitgesloten. Bij E4 volstaat één raakcirkel; de andere oplossing wordt toegelicht. De figuren zijn analytisch geconstrueerd.

De gecombineerde PDF telt 19 pagina's: de gecorrigeerde opgaven en stellingen (11 pagina's) gevolgd door het antwoordmodel (8 pagina's). Beide onderdelen zijn ook afzonderlijk te openen. Alle pagina's zijn tekstueel identiek aan de gecorrigeerde brondocumenten van 29 oktober 2026. De bundel heeft bladwijzers; de bron-, werkblad- en antwoordlinks wijzen naar de juiste fysieke PDF-pagina's.

De keuzelijst, overzichtskaarten en teruglinks vanuit Stoicheia bevatten E. Alle imports in de oefenmodule dragen versie 1.4.0. De opslagsleutel en het schema blijven gelijk. De koepelsite blijft 0.1.31.

## Controle

- `npm run meetkunde:check` slaagt voor alle 50 deelvragen en vijf puntentotalen. Bestaande tests blijven behouden. Nieuwe controles toetsen de PDF-mapping, rubricpunten, beide equivalente rechthoekvoorwaarden, de congruentieconfiguratie, de volledige grote bogen, uitgesloten eindpunten, beide mogelijke raakcirkels, de koordenvierhoek, raaklijn-koordehoeken en productrelaties.
- Constructieantwoorden zijn bij de start verborgen. De resultaatcirkel bij E5 valt volledig binnen het figuurkader. De acht eindfiguren zijn visueel bekeken.
- Browser: alle E-routes, opdrachtkoppen en bron-/antwoordverwijzingen gecontroleerd. E3 → stelling 10 → E3 bewaart een notitie; uitlegstap 2 van 4 blijft bij terugkeer behouden. De testnotitie is daarna verwijderd. Er zijn geen fouten van de applicatie in de browserconsole gevonden.
- Smalle weergaven van 360 en 430 pixels gecontroleerd, inclusief vergrote constructiefiguren en stapbediening. Geen horizontale overloop. Geen test op fysieke iPhone/Safari of empirische toetsafname uitgevoerd.
- PDF-overgang naar de uitwerkingen en de twee constructie-uitwerkingen visueel gecontroleerd; alle 19 pagina's zijn bij samenvoegen tekstueel vergeleken met de gecorrigeerde bronbestanden.
- De lokale volledige controle met Node 24 stopte op de bestaande tijdslimiet van 180 seconden in de Pabo-variatieaudit. Die audit en tijdslimiet zijn niet aangepast. De verplichte GitHub-controle voert de volledige `npm run check` uit met Node 22 en moet slagen voordat deze versie wordt samengevoegd en gepubliceerd.

Publicatie via de bestaande GitHub/Cloudflare-route. Tijdelijke QA-pagina's worden niet gepubliceerd.

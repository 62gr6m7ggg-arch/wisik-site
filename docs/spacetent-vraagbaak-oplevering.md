# Vraagbaak 0.5.0 — opleverstatus 15 september 2026

De implementatie staat op branch `feat/space-vraagbaak`. De gebruiker heeft op
15 september 2026 expliciet toestemming gegeven om versie 0.5.0 naar de bestaande
openbare repository `62gr6m7ggg-arch/wisik-site` door te zetten en na de resterende
browser- en vrijgavecontroles op Wisik.nl te publiceren. De eerdere automatische
blokkade is daarmee van een expliciet akkoord voorzien. Publicatie volgt pas na
de hieronder beschreven controles.

## Gereed en lokaal gecontroleerd

- 145 complete begripsartikelen, 440 verwijzingen naar verwante begrippen en
  43 figuurvarianten, binnen Spacetent.
- Alfabetische navigatie, zoeken, alternatieve namen, spelfoutsuggesties,
  leesbare mobiele weergave en de vaste terugknop.
- Behoud van vraag, antwoord, berekening, constructie, selectie, camera, undo en
  scrollpositie bij terugkeer; ook via Escape en de terugknop van de browser.
- Alleen zoeken registreert geen hulp. Uitleg raadplegen tijdens een onafgemaakte
  check, ook tussen twee antwoorden door, maakt de poging geholpen. Herladen kan
  die markering niet wissen. Een latere nieuwe zelfstandige poging kan slagen;
  oudere zelfstandige resultaten blijven geldig.
- Geen opslag van zoektermen, artikel-id's of leesgeschiedenis. De beschermde
  beoordelaarsomgeving houdt alle testpogingen buiten leerlingopslag.
- TypeScript, volledige bestaande logica- en meetkundecontroles en de nieuwe
  vraagbaakcontroles geslaagd; publieke en private productiebundels gebouwd.
- Chromium: alle 145 artikelen op 1366 en 320 px, representatieve artikelen op
  1024 en 390 px, plus de terugkeer- en checkstromen op alle vier formaten.
- Beoordelaarsomgeving: alle 311 onderdelen op desktop en mobiel in Chromium,
  inclusief de vraagbaak en ongewijzigde leerling- en sessieopslag.

De twee actuele lokale bewijzen staan in
`tools/space-tent/validation/knowledge-chromium-050.json` en
`tools/space-tent/validation/review-chromium-050.json`.
Dit is interne inhoudelijke controle en browserautomatisering, geen onafhankelijke
vakdocentreview of test op een fysieke iPhone.

## Vrijgavestappen na gebruikersbevestiging

1. Push de bestaande featurebranch naar dezelfde Wisik-repository; publiceer geen
   losse kopie op een andere bestemming.
2. Laat `.github/workflows/ruimteklaar-knowledge.yml` de volledige Chromium- en
   WebKit-tests en bestaande constructiecontroles uitvoeren. WebKit kon lokaal
   niet starten doordat systeemafhankelijkheden ontbreken.
3. De workflow maakt pas na geslaagde tests de definitieve openbare bundel,
   private beoordelaarsbundel en brongebonden vrijgavebewijzen. De centrale
   `npm run build`-controle moet daarna slagen.
4. Dien de gecontroleerde branch als PR in, laat Wisik kwaliteitscontrole slagen,
   merge naar `main` en controleer de Cloudflare-build en actuele versie online.

De code of de vereiste controles zijn niet aangepast om de publicatieblokkade
te omzeilen. De overige Wisik-tenten zijn buiten deze wijziging gebleven.

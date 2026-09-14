# Spacetent — artiesten-ingang

Site-editie 0.1.26. De deurbel leidt naar `/apps/ruimteklaar/test/`.
De bestaande toegangscontrole wordt niet gewijzigd of overgeslagen. De deurbel
maakt geen geluid, schrijft geen voortgang en toont geen aanwijzing voor de code.

## Verplaatsen naar een hoofdpodium

De kaart bevat één `div.space-venue[data-terrain-group][data-venue-id="ruimteklaar"]`.
Daarin staan twee onafhankelijke links: de normale Spacetent en de deurbel.
Verplaats **deze hele groep** en pas desgewenst alleen de groepspositie aan. De
bel heeft geen eigen terreincoördinaten. De mobiele navigatie verplaatst en
herstelt dezelfde groep; ook zonder JavaScript blijven beide gewone links werken.

In de centrale registratie van Ruimteklaar staat `artistEntrance`. De gedeelde
attractiekaart rendert deze onafhankelijk van `venue`, `maturity`, `route` en
`status`. Promotie naar een MainStage behoudt dus automatisch de kaartingang.
De handgeschreven Rafelrand-kaart en tentpagina bevatten dezelfde link, binnen
het eigen tentonderdeel. Bij een toekomstige paginaverhuizing blijft de testroute
ongewijzigd: deze hangt onder `/apps/`, niet onder `/rafelrand/`.

## Controle

`node scripts/test-space-artist-entrance.mjs` controleert registratie, drie
statische ingangen, componentgroepering, een gesimuleerde MainStage-promotie,
exacte test-URL en scheiding van gewone toegang en artiesten-ingang.
`node scripts/test-mobile-terrein.mjs` controleert de nieuwe groep naast de
bestaande route-, lijst- en focusvolgorde bij herhaald wisselen van schermbreedte.

`node scripts/check-space-artist-entrance-browser.mjs` toetst de echte pagina's,
verplaatsing naar een nieuw podium, schermbreedten van 320 tot 1440 pixels,
aanraakdoelen, klik/tik/toetsenbord, zonder-JavaScript-navigatie, inloggen,
afwijzen, uitloggen, vrij kiezen en de afzonderlijke leerlingroute. Met
`LIVE_ORIGIN=https://wisik.nl` draait dezelfde proef op de publicatie en worden
ook de gedeelde online CSS- en JavaScriptbestanden met de geteste bron vergeleken.
Browserproeven zijn geautomatiseerd; geen fysieke iPhone-gebruikstest.

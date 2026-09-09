# Eigen stem bij alle 30 Pabo-flirts

## Status

De code, segmenttijden, D01-ondertiteling, technische audit én het audiobestand staan op deze branch. De binaire upload is byte-voor-byte gecontroleerd; de live site blijft ongewijzigd tot de kwaliteitscontrole groen is en deze PR wordt gemerged.

## Gecontroleerd audiobestand

Het volgende bestand is aanwezig en gecontroleerd:

- repositorypad: `public/assets/audio/flirts-eigenstem-2026-09-09.m4a`
- bestandsgrootte: `7.229.573 bytes`
- SHA-256: `c3d4faed91f3ea84ec7d5999f5fc2ccb22bdb3f6d679318ce48eb22679ce5be1`
- techniek: AAC-LC, mono, 24 kHz, circa 32 kbit/s
- speelduur: circa 1.924,5 seconden

## Montagekeuzes

- A–D zijn volledig uit de nieuwe lange domeinopnamen gesegmenteerd.
- Voor B05 is de losse tweede verbetering gebruikt.
- In D05 is alleen de verspreking verwijderd; de inhoudelijke conclusie `is dus vijf` is behouden.
- Bij D07 is de eerste afgebroken poging verwijderd en alleen de volledige herstart gebruikt.
- De bestaande gecorrigeerde livebeelden blijven staan, zodat de oude beeldfouten van C01 en C04 niet terugkeren.

## Werking

`grabbelton-core.js` herkent de code in iedere Pabo-flirt, dempt het oude ingebedde audiospoor en synchroniseert het juiste fragment uit het ene audiobestand. Dit werkt zowel in de Grabbelton als in de diagnostische flirtweergave van Pabo Rekenklaar. De bestaande ondertiteling wordt proportioneel op de nieuwe spreeksnelheid getimed.

## Controle vóór merge

1. De repositorylocatie, bestandsgrootte en Git-blobhash zijn gecontroleerd.
2. De automatische kwaliteitscontrole moet groen zijn.
3. Test minimaal A01, B05, C01, C04, D05 en D07 na deployment op mobiel en desktop.
4. Controleer pauzeren, hervatten en slepen in de tijdlijn.
5. Bij een regressie: release terugdraaien; anders blijft de eigenstemrelease actief.

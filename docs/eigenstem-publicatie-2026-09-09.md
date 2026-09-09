# Eigen stem bij alle 30 Pabo-flirts

## Status

De code, segmenttijden, D01-ondertiteling en technische audit staan op deze branch. **Niet mergen voordat het audiobestand hieronder op de branch staat.** De live site blijft daardoor intussen ongewijzigd.

## Nog toe te voegen bestand

Upload exact dit bestand:

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

1. Controleer dat het bestand op exact het genoemde repositorypad staat.
2. Vergelijk de SHA-256 met de waarde hierboven.
3. Test minimaal A01, B05, C01, C04, D05 en D07 op mobiel en desktop.
4. Controleer pauzeren, hervatten en slepen in de tijdlijn.
5. Merge pas daarna naar `main`.

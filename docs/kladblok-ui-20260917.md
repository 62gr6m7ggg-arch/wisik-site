# Aanvullende visuele controle: Kladblok 0.1.30

De privacy-nacontrole van site 0.1.29 is in run 35271350597 lokaal én live geslaagd na herstel van de testverwachtingen. Bij zelfstandige beoordeling van het eerdere schermafbeeldingen-artifact (run 35268596368, SHA256 32e274dcf24a7ae24ce806c129516bf8b1e999fd596d7b81b0c306df74e07e18) bleek daarnaast een echte weergavefout: twee bronmeldingen vóór verzending. In de smalle WebKit-afbeelding waren formulieronderdelen rechts afgesneden. Alleen een controle van document.scrollWidth was daarvoor niet toereikend.

Oorzaak dubbele melding: kladblok-context.js voert zijn eerste invulling tijdens defer uit, terwijl site.js zijn formulierinitialisatie op DOMContentLoaded uitvoert. Daardoor kon het vangnet al zichtbaar zijn voordat de hoofdmelding werd getoond. De eerdere VM-test simuleerde alleen de tegenovergestelde volgorde.

Herstel: zodra het hoofdpad een bronmelding toont, wordt uitsluitend de aanvullende vangnetmelding verborgen en leeggemaakt. Het zelfstandige vangnet en de verzendroute blijven bestaan; geen leeropslag of extra gegevensvelden. De nieuwe volgordetest moet op de oorspronkelijke productiecode eerst rood zijn en na herstel slagen. De browsertest controleert nu daadwerkelijk zichtbaarheid in plaats van alleen hidden-vlaggen.

Smalle weergave: uitsluitend op de Kladblokpagina mogen de formulierkolommen en invoervelden krimpen tot de beschikbare breedte. Lange bronadressen breken binnen hun eigen kader. Geen body-overloop verbergen; de test meet elk werkelijk formulieronderdeel ten opzichte van de viewport. Schermafbeeldingen worden met de hele pagina genomen om geen vaste header midden in een uitgesneden formulier te plakken.

Siteversie 0.1.30 en cacheverwijzingen bijgewerkt; Pabo- en Space-appversies, vragen, leerlogica, voortgang, media, servertoegang, routes en Cloudflare-instellingen blijven inhoudelijk gelijk. De auditbestanden worden voor de nieuwe siteversie opnieuw gegenereerd. De eerdere documenten met ongewijzigde productie beschrijven de afzonderlijke testcorrectieronde, niet deze aanvullende zichtbare UI-correctie. Bewaarbeleid en formulierbestemming veranderen niet.

Bewijs: de voorbereidingsworkflow bewaart de verwachte rode volgordetest, geslaagde regressies, browserresultaten en schermafbeeldingen. Na samenvoegen moet de privacy-livecontrole opnieuw slagen op de gepubliceerde 0.1.30-bron. Geen echte testmail, mailboxwijziging of fysieke iPhone-test. GitHub-bescherming blijft afzonderlijke eigenaaractie #61.

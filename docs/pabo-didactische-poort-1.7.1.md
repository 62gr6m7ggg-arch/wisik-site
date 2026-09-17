# Pabo Rekenklaar 1.7.1 — didactische poort

Aanleiding was een patroonvraag waarin de vakterm `tweede verschillen` in de vraag stond en de feedback direct naar een formule met n² sprong. De vraag is herschreven naar een natuurlijke rekenroute: eerst de sprongen tussen opeenvolgende getallen, vervolgens de verandering van die sprongen, en daarna de volgende sprong bepalen.

Vanaf deze release draait `npm run pabo:didactic` als vast onderdeel van `npm run check`. De poort bemonstert alle vraaggeneratoren over domein, modus en vraagzwaarte en controleert onder meer of vraag en uitleg aanwezig zijn, of leerlingfeedback geen interne moeilijkheidstaal bevat, of geselecteerde vaktermen niet onverklaard blijven en of formele theorie pas achteraf in feedback wordt geïntroduceerd. Signaleringen zijn bedoeld als review-trigger; de poort vervangt geen menselijke vakdidactische beoordeling.

Voor 1.7.1 zijn 6.480 gegenereerde vragen uit 63 generatoren in deze extra didactische controle onderzocht. De vrijgave blijft daarnaast onder de bestaande technische, variatie-, diagnostiek- en flirtcontroles vallen.

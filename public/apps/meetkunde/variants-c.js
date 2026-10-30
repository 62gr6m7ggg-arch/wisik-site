// Oplossingsmethoden in de volgorde van de officiële correctievoorschriften.
// Bronnen: PDF C, fysieke uitwerkingspagina's 11–17. Een 'of' binnen één
// beoordelingsstap blijft één methode; een volledig nieuw antwoordblok is een route.
export const C_VARIANTS = {
 C1a:[
  {title:'Via evenwijdige zijden en een parallellogram',useBase:true},
  {title:'Via gelijke overstaande hoeken in een koordenvierhoek',figureKey:'c-rectangle-cyclic',refs:[73,6,18,84,63],
   steps:[
    ['Vind twee rechte hoeken','AC is een middellijn. Volgens Thales zijn ∠ABC en ∠ADC beide 90°.'],
    ['Vergelijk de twee driehoeken','AB ∥ CD, dus ∠BAC = ∠ACD door Z-hoeken. In de rechthoekige driehoeken zijn de overige scherpe hoeken hun complementen: ∠ACB = ∠CAD. Dit mag ook via congruentie van △ABC en △CDA volgens ZHH worden afgeleid.'],
    ['Vergelijk de overstaande hoeken','De diagonaal AC verdeelt de hoeken bij A en C: ∠BAD = ∠BAC + ∠CAD en ∠BCD = ∠BCA + ∠ACD. Door de twee gevonden hoekgelijkheden zijn deze sommen gelijk.'],
    ['Gebruik de koordenvierhoek','A, B, C en D liggen op dezelfde cirkel, dus ∠BAD + ∠BCD = 180°. De hoeken zijn ook gelijk; daarom zijn ze allebei 90°. Samen met de rechte hoeken bij B en D heeft ABCD vier rechte hoeken en is het een rechthoek.']
   ],rubric:['∠ABC = ∠ADC = 90° via Thales (1 punt).','Gelijke scherpe hoeken via Z-hoeken en congruentie of complementen (1 punt).','∠BAD = ∠BCD afgeleid (1 punt).','Koordenvierhoek gebruikt om beide hoeken 90° en de vierhoek een rechthoek te noemen (1 punt).']}
 ],
 C1b:[{title:'Via een buitenhoek en een middelpuntshoek',useBase:true}],
 C2a:[{title:'Via constante hoeken, bissectrices en HZH',useBase:true}],
 C2b:[
  {title:'Via drie loodlijnen',useBase:true},
  {title:'Via één loodlijn en een spiegeling',figureKey:'c-bisectors-reflection',refs:[11,20,30],
   steps:[
    ['Construeer eerst C','Teken PQ en trek door R de loodlijn op PQ. Het tweede snijpunt van deze lijn met de cirkel is C. Dit gebruikt de gegeven eigenschap CR ⟂ PQ.'],
    ['Spiegel C in PQ','Construeer het voetpunt T van C op PQ. Zet aan de andere kant van PQ op dezelfde loodlijn de afstand TC af: TS = TC. Het gevonden punt S is het spiegelbeeld van C in PQ. Uit vraag 6 volgt dat dit het snijpunt van de bissectrices is.'],
    ['Vind A en B en verbind','Trek de lijnen PS en QS door. Het tweede snijpunt van PS met de cirkel is A, dat van QS is B. Verbind A, B en C en laat de hulpconstructie staan. AP, BQ en CR zijn daarmee de gezochte bissectrices.']
   ],rubric:['Loodlijn door R op PQ getekend en C gevonden (1 punt).','S als spiegelbeeld van C in PQ geconstrueerd (1 punt).','A en B gevonden met PS en QS en de driehoek voltooid (1 punt).']}
 ],
 C3a:[
  {title:'Via de middelloodlijn en gelijke koorden',useBase:true},
  {title:'Via ZHZ en gelijke koorden',figurePlan:[1,3,3,4],refs:[71,22,70,12],
   steps:[
    ['Vind het midden van AB','MD staat vanuit het middelpunt loodrecht op koorde AB. Volgens de loodlijn-op-koorde-stelling is E het midden van AB, dus AE = EB.'],
    ['Bewijs congruentie','Verbind D met A en B. In △AED en △BED geldt AE = EB, ED = ED en ∠AED = ∠BED = 90°. Dus △AED ≅ △BED volgens ZHZ.'],
    ['Vergelijk de koorden','De overeenkomstige zijden AD en BD zijn door congruentie even lang. Het zijn dus gelijke koorden van dezelfde cirkel.'],
    ['Herken de bissectrice','Bij gelijke koorden AD en BD horen gelijke omtrekshoeken ∠ACD en ∠BCD. Omdat CD binnen ∠ACB ligt, is CD de bissectrice.']
   ],rubric:['E als midden van AB onderbouwd (1 punt).','△AED ≅ △BED volgens ZHZ onderbouwd (1 punt).','AD = BD door congruentie (1 punt).','Gelijke omtrekshoeken via gelijke koorden en bissectrice geconcludeerd (1 punt).']},
  {title:'Via ZHZ en de constante hoek',figureKey:'c-radius-constant',refs:[71,22,78,12],
   steps:[
    ['Vind het midden van AB','MD staat vanuit het middelpunt loodrecht op koorde AB. Daarom is E het midden van AB en geldt AE = EB.'],
    ['Vergelijk de rechthoekige driehoeken','Verbind D met A en B. AE = EB, ED is gemeenschappelijk en ∠AED = ∠BED = 90°. Dus △AED ≅ △BED volgens ZHZ. Hieruit volgen gelijke basishoeken ∠ABD = ∠BAD.'],
    ['Verplaats de hoeken naar C','De omtrekshoeken ∠ACD en ∠ABD staan op koorde AD aan dezelfde kant daarvan. Dus ∠ACD = ∠ABD. Op koorde BD geldt op dezelfde manier ∠BCD = ∠BAD.'],
    ['Combineer de gelijkheden','Omdat ∠ABD = ∠BAD, zijn ook ∠ACD en ∠BCD gelijk. CD ligt binnen ∠ACB en is dus de bissectrice.']
   ],rubric:['E als midden van AB onderbouwd (1 punt).','Congruentie van △AED en △BED volgens ZHZ onderbouwd (1 punt).','Beide toepassingen van de constante hoek benoemd (1 punt).','Gelijke basishoeken verbonden aan de twee gelijke hoeken bij C en de bissectrice (1 punt).']},
  {title:'Via ZZR en middelpuntshoeken',figureKey:'c-radius-central',refs:[16,24,77,12],
   steps:[
    ['Teken twee stralen','Verbind M met A en B. AM = BM, want dit zijn stralen van dezelfde cirkel.'],
    ['Gebruik congruentie met een rechte hoek','In △AEM en △BEM zijn de schuine zijden AM en BM gelijk, is EM gemeenschappelijk en zijn de hoeken bij E recht. Dus △AEM ≅ △BEM volgens ZZR.'],
    ['Vergelijk de middelpuntshoeken','Uit de congruentie volgt ∠AME = ∠BME. E en D liggen op dezelfde straal vanuit M, dus ∠AMD = ∠BMD. Daarom zijn ook de helften van deze hoeken gelijk.'],
    ['Gebruik de omtrekshoekstelling','∠ACD = ½∠AMD en ∠BCD = ½∠BMD: elke omtrekshoek is de helft van de middelpuntshoek bij dezelfde boog. Dus ∠ACD = ∠BCD en CD is de bissectrice.']
   ],rubric:['AM = BM als stralen benoemd (1 punt).','△AEM ≅ △BEM volgens ZZR onderbouwd (1 punt).','Gelijkheid van de middelpuntshoeken en hun helften afgeleid (1 punt).','Omtrekshoekstelling gebruikt en bissectrice geconcludeerd (1 punt).']}
 ],
 C3b:[{title:'Via evenwijdigheid en twee loodlijnen',useBase:true}],
 C4a:[
  {title:'Via de raaklijn-koordehoek bij D',useBase:true},
  {title:'Via een verlengde raaklijn en supplementaire hoeken',figureKey:'c-tangent-extension',refs:[81,2,25],
   steps:[
    ['Verleng de raaklijn','Kies E op het verlengde van AD voorbij D. Voor koorde CD geeft de koorde-raaklijnstelling ∠DBC = ∠EDC.'],
    ['Neem de supplementaire hoeken','A, B en C liggen op één lijn, dus ∠ABD = 180° − ∠CBD. A, D en E liggen ook op één lijn, dus ∠ADC = 180° − ∠EDC. Omdat ∠CBD = ∠DBC = ∠EDC, volgt ∠ABD = ∠ADC.'],
    ['Gebruik de gemeenschappelijke hoek','∠BAD = ∠DAC omdat AB en AC op dezelfde straal liggen. Samen met ∠ABD = ∠ADC geeft dit △ABD ∼ △ADC volgens hh, met A ↔ A, B ↔ D en D ↔ C.']
   ],rubric:['E op het verlengde gekozen en ∠DBC = ∠EDC via koorde en raaklijn (1 punt).','Gestrekte hoeken gebruikt voor ∠ABD = ∠ADC (1 punt).','Gemeenschappelijke hoek en gelijkvormigheid volgens hh (1 punt).']}
 ],
 C4b:[
  {title:'Via hoekensommen en overstaande hoeken',figureKey:'c-tangent-angle-sums',refs:[18,12,25,5],
   steps:[
    ['Bereken de hoek bij Q','In △ADQ geldt ∠DAQ = ½∠A, omdat AQ een bissectrice is, en ∠ADQ = ∠ADC. Dus ∠PQD = ∠AQD = 180° − ∠ADC − ½∠A.'],
    ['Bereken de hoek APB','In △ABP geldt ∠BAP = ½∠A en ∠ABP = ∠ABD. Daarom ∠APB = 180° − ∠ABD − ½∠A.'],
    ['Vergelijk de uitkomsten','Uit de gelijkvormigheid van △ABD en △ADC uit vraag 8 volgt ∠ADC = ∠ABD. De twee berekende hoeksommen zijn daarom gelijk: ∠PQD = ∠APB.'],
    ['Gebruik overstaande hoeken','De lijnen AQ en BD snijden elkaar in P. Daarom zijn ∠APB en ∠QPD overstaande hoeken en dus gelijk. Hieruit volgt ∠PQD = ∠QPD.']
   ],rubric:['∠PQD via de hoekensom berekend (1 punt).','∠APB via de hoekensom berekend (1 punt).','∠ADC = ∠ABD gebruikt voor ∠PQD = ∠APB (1 punt).','Overstaande hoeken gebruikt en conclusie getrokken (1 punt).']},
  {title:'Via twee buitenhoeken',useBase:true},
  {title:'Via twee kleinere gelijkvormige driehoeken',figureKey:'c-tangent-small-triangles',refs:[25,12,5],
   steps:[
    ['Gebruik de eerdere gelijkvormigheid','Uit △ABD ∼ △ADC volgt ∠ABD = ∠ADC. Omdat P op BD en Q op CD ligt, is dus ∠ABP = ∠ADQ.'],
    ['Vergelijk de hoeken bij A','AP en AQ vormen de bissectrice van ∠A. Dus ∠BAP = ∠DAQ. Samen met de vorige hoekgelijkheid volgt △ABP ∼ △ADQ volgens hh.'],
    ['Lees de derde hoeken af','Uit de gelijkvormigheid volgt ∠APB = ∠AQD. A, P en Q liggen op dezelfde lijn, met A en P aan dezelfde kant van Q. Daarom is ∠AQD = ∠PQD.'],
    ['Gebruik overstaande hoeken','Bij het snijpunt P zijn ∠APB en ∠QPD overstaande hoeken, dus gelijk. Samen geeft dit ∠PQD = ∠QPD.']
   ],rubric:['∠ABP = ∠ADQ uit de eerdere gelijkvormigheid (1 punt).','△ABP ∼ △ADQ met de halve hoeken bij A onderbouwd (1 punt).','∠APB = ∠AQD = ∠PQD afgeleid (1 punt).','Overstaande hoeken gebruikt en conclusie getrokken (1 punt).']}
 ],
 C5a:[
  {title:'Via een koordenvierhoek en een hoek van 45°',useBase:true},
  {title:'Via een koordenvierhoek en gelijke koorden',figureKey:'c-motion-chords',refs:[45,85,70,12],
   steps:[
    ['Vind een koordenvierhoek','In een tussenstand zijn ∠BDA en ∠BCA beide 90°. De som van deze overstaande hoeken is 180°, dus DBCA is een koordenvierhoek.'],
    ['Gebruik de gelijke koorden','De gegeven driehoek is gelijkbenig: AC = BC. Dit zijn gelijke koorden in de gevonden cirkel. De bijbehorende omtrekshoeken zijn daarom gelijk: ∠ADC = ∠BDC.'],
    ['Herken de bissectrice','C ligt binnen de papierhoek bij D en ∠ADC = ∠BDC. DC verdeelt die hoek dus in twee gelijke hoeken. C ligt op de bissectrice van ∠D.'],
    ['Controleer de eindstanden','Als A of B met D samenvalt, is de hoek tussen DC en een papierzijde rechtstreeks een basishoek van de gelijkbenige rechthoekige driehoek, dus 45°. Ook in deze eindstanden ligt C op dezelfde bissectrice.']
   ],rubric:['Koordenvierhoek via twee rechte hoeken onderbouwd (2 punten).','Gelijke koorden AC en BC verbonden aan ∠ADC = ∠BDC (2 punten).','Baan op de bissectrice geconcludeerd (1 punt).']},
  {title:'Via loodrechte afstanden en congruentie',figureKey:'c-motion-distances',refs:[8,21,45,12],
   steps:[
    ['Teken de loodrechte afstanden','Noem C′ het voetpunt van C op lijn BD en C″ het voetpunt van C op lijn AD. Als C′ niet met B en C″ niet met A samenvalt, zijn CC′B en CC″A rechthoekige driehoeken. CC′ en CC″ zijn de afstanden van C tot de twee papierzijden. De samenvallende stand controleren we rechtstreeks in de laatste stap.'],
    ['Vergelijk de scherpe hoeken','BC staat loodrecht op AC, en de lijnen BC′ en AC″ staan ook loodrecht op elkaar. Daarom zijn de scherpe hoeken ∠C′BC en ∠C″AC gelijk. In de stand uit de oorspronkelijke examenfiguur schrijf je dit zoals in het voorschrift als ∠C′BC + 45° = 90° + ∠DAB, dus ∠C′BC = 45° + ∠DAB = ∠C″AC.'],
    ['Gebruik congruentie','De rechthoekige driehoeken CC′B en CC″A hebben ook gelijke schuine zijden BC = AC. Met de gelijke scherpe hoeken zijn ze congruent volgens ZHH. Dus CC′ = CC″.'],
    ['Herken de bissectrice en controleer grensstanden','C heeft gelijke loodrechte afstanden tot beide papierzijden en ligt binnen de papierhoek. Dus C ligt op de bissectrice. In de symmetrische stand vallen C′ en B en ook C″ en A samen; dan volgt de gelijke afstand direct uit BC = AC. Bij A = D of B = D maken de gelijke basishoeken van 45° duidelijk dat C ook op de bissectrice ligt.']
   ],rubric:['Voetpunt C′ gebruikt en de hoekrelatie met 45° en ∠DAB verantwoord (2 punten).','Voetpunt C″ gebruikt en de gelijke scherpe hoeken afgeleid (1 punt).','Congruentie met rechte hoeken, gelijke scherpe hoeken en BC = AC onderbouwd (1 punt).','CC′ = CC″ en ligging op de bissectrice geconcludeerd (1 punt).']}
 ],
 C5b:[{title:'Via het midden van de schuine zijde',useBase:true}],
 C6:[
  {title:'Via de overstaande hoeken bij A en F',useBase:true},
  {title:'Via de overstaande hoeken bij D en C',figureKey:'c-cyclic-other-pair',refs:[81,6,2,85],
   steps:[
    ['Gebruik koorde en raaklijn bij D','DA ligt op de raaklijn aan de gegeven cirkel. Bij koorde DF hoort daarom de hoekgelijkheid ∠ADF = ∠DEF.'],
    ['Gebruik de evenwijdige lijnen','AC ∥ DE en B, E, F en C liggen op dezelfde lijn. Daarom ∠ACB = ∠DEB door F-hoeken. Omdat CB en CF op dezelfde straal liggen, is ook ∠ACF = ∠DEB.'],
    ['Maak een gestrekte hoek bij E','B, E en F liggen op één lijn. De aangrenzende hoeken ∠DEF en ∠DEB vormen daarom samen 180°.'],
    ['Herken de nieuwe koordenvierhoek','Met de gevonden gelijkheden volgt ∠ADF + ∠ACF = ∠DEF + ∠DEB = 180°. Dit zijn de overstaande hoeken bij D en C van ADFC. Volgens de omgekeerde koordenvierhoekstelling is ADFC een koordenvierhoek.']
   ],rubric:['∠ADF = ∠DEF via koorde en raaklijn (1 punt).','∠ACB = ∠DEB via F-hoeken (1 punt).','∠DEF + ∠DEB = 180° via een gestrekte hoek (1 punt).','Som van overstaande hoeken gebruikt en koordenvierhoek geconcludeerd (1 punt).']}
 ]
};

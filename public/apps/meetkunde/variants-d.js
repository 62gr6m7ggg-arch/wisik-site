// Volgorde en aantal routes: officiële correctievoorschriften in PDF D, p. 11–16.
// Eén route per volledig antwoordmodel; opmerkingen zijn geen extra routes.
export const D_VARIANTS = {
 D1: [
  {title:'Gelijkbenige driehoeken met β en γ',useBase:true},
  {title:'Basishoeken als halve tophoeken',figureKey:'d-triangle-half',refs:[16,36,18,2],
   steps:[
    ['Bereken de basishoeken van ADE','Teken straal AD. Omdat AD = AE is △ADE gelijkbenig. De twee gelijke basishoeken hebben samen grootte 180° − ∠DAE. Dus ∠ADE = ∠AED = 90° − ½∠DAE.'],
    ['Bereken de basishoeken van ABD','AB = AD, dus ook △ABD is gelijkbenig. Op dezelfde manier volgt ∠ADB = ∠ABD = 90° − ½∠DAB.'],
    ['Tel de hoeken bij D op','AD ligt binnen ∠EDB. Daarom ∠EDB = ∠ADE + ∠ADB = 180° − ½(∠DAE + ∠DAB). De twee hoeken bij A vormen samen ∠BAE = α, dus ∠EDB = 180° − ½α.'],
    ['Gebruik de gestrekte hoek','B, D en C liggen op één lijn. De hoeken EDB en CDE zijn daarom samen 180°. Dus ∠CDE = 180° − ∠EDB = ½α.']
   ],
   rubric:['∠ADE = ∠AED = 90° − ½∠DAE via gelijkbenigheid en hoekensom (2 punten).','∠ADB = ∠ABD = 90° − ½∠DAB via gelijkbenigheid en hoekensom (1 punt).','∠EDB = 180° − ½α afgeleid (1 punt).','∠CDE = ½α met een gestrekte hoek geconcludeerd (1 punt).']},
  {title:'Omtrekshoek en koordenvierhoek',figureKey:'d-triangle-inscribed',refs:[77,84,2],
   steps:[
    ['Kies een hulppunt op de grote boog','Kies F op de grote cirkelboog EB en teken FB en FE. De omtrekshoek BFE en de middelpuntshoek BAE horen bij dezelfde kleine boog BE. Dus ∠BFE = ½∠BAE = ½α.'],
    ['Gebruik de koordenvierhoek','B, F, E en D liggen op dezelfde cirkel. In koordenvierhoek BFED zijn de hoeken BFE en EDB overstaande hoeken. Hun som is 180°, dus ∠EDB = 180° − ½α.'],
    ['Gebruik de gestrekte hoek bij D','B, D en C liggen op één lijn. Daarom ∠CDE = 180° − ∠EDB = 180° − (180° − ½α) = ½α.']
   ],
   rubric:['F op de grote boog EB gekozen en ∠BFE = ½α met de omtrekshoekstelling onderbouwd (2 punten).','∠EDB = 180° − ½α met de koordenvierhoekstelling afgeleid (2 punten).','∠CDE = ½α met een gestrekte hoek geconcludeerd (1 punt).']}
 ],
 D2a:[{title:'Congruentie met ZHZ',useBase:true}],
 D2b:[
  {title:'Koordenvierhoek en constante hoek',useBase:true},
  {title:'Cirkelbogen en omtrekshoeken',figureKey:'d-equilateral-arcs',refs:[39,77,2],
   steps:[
    ['Bepaal boog ACB','△ABC is gelijkzijdig. De drie bijbehorende kleine cirkelbogen AB, BC en CA zijn daarom even groot: elk 120°. De boog van A via C naar B is dus 240°, tweederde van de cirkel.'],
    ['Bereken de eerste omtrekshoek','De omtrekshoek ASB hoort bij boog ACB. Volgens de omtrekshoekstelling is ∠ASB = ½ · 240° = 120°.'],
    ['Bepaal boog BE','Ook △BDE is gelijkzijdig. In de tweede cirkel is de kleine boog BE dus 120°, eenderde van de cirkel. S ligt op de andere boog.'],
    ['Bereken de tweede omtrekshoek','∠BSE is de omtrekshoek op deze kleine boog BE. Daarom ∠BSE = ½ · 120° = 60°.'],
    ['Tel de aangrenzende hoeken op','In de getekende ligging ligt SB binnen ∠ASE. Dus ∠ASE = ∠ASB + ∠BSE = 120° + 60° = 180°. Hoek ASE is gestrekt.']
   ],
   rubric:['Boog ACB als tweederde van de eerste cirkelboog herkend (1 punt).','∠ASB = 120° met de omtrekshoekstelling afgeleid (1 punt).','Boog BE als eenderde van de tweede cirkelboog herkend (1 punt).','∠BSE = 60° met de omtrekshoekstelling afgeleid (1 punt).','∠ASE = 180° geconcludeerd (1 punt).']}
 ],
 D3a:[
  {title:'Koordenvierhoek en spiegelhoeken',useBase:true},
  {title:'Constante hoek en hoekensom',figureKey:'d-mirror-sum',refs:[78,2,18],
   steps:[
    ['Vergelijk de hoeken op koorde AB','S en C liggen op de cirkel aan dezelfde kant van koorde AB. De constante-hoekstelling geeft ∠ASB = ∠ACB.'],
    ['Gebruik de gestrekte spiegelhoek','De hoeken α, ASB en β vormen samen een gestrekte hoek. Dus ∠ASB = 180° − (α + β). Omdat α = β bij weerkaatsing, volgt ∠ASB = 180° − 2β.'],
    ['Schrijf de hoekensom van ABC','In △ABC geldt ∠ACB = 180° − ∠BAC − ∠ABC. Samen met de vorige stappen geeft dit 2β = ∠BAC + ∠ABC.'],
    ['Vervang ∠BAC door β','∠BAC en ∠BSC staan op dezelfde koorde BC aan dezelfde kant daarvan. Dus ∠BAC = ∠BSC = β. Invullen geeft 2β = β + ∠ABC, zodat ∠ABC = β = ∠BAC.']
   ],
   rubric:['∠ASB = ∠ACB met de constante-hoekstelling afgeleid (1 punt).','∠ASB = 180° − 2β via de gestrekte hoek en α = β afgeleid (1 punt).','De hoekensom van △ABC opgesteld (1 punt).','Met ∠BAC = β de gelijkheid ∠ABC = ∠BAC geconcludeerd (1 punt).']}
 ],
 D3b:[
  {title:'Twee snijpunten van de middelloodlijn',useBase:true},
  {title:'Eén snijpunt en een loodrechte spiegelstand',figureKey:'d-mirror-one',refs:[11,37,73],
   steps:[
    ['Construeer één snijpunt C','Teken de middelloodlijn van AB en kies het bovenste snijpunt met de cirkel. Noem dit punt C. Dan AC = BC en dus ∠BAC = ∠ABC. De omgekeerde bewering uit vraag 19 levert hiermee de spiegelrichting.'],
    ['Teken het spiegeltje in P','Trek PC en teken in P een kort spiegeltje langs deze lijn. Controleer de getekende lichtweg A → P → B: de inkomende en uitgaande lichtstraal maken gelijke hoeken met het spiegeltje.'],
    ['Teken de andere spiegelstand in Q','Trek QC als hulplijn en teken door Q de loodlijn op QC. Het spiegeltje in Q ligt langs die loodlijn. In deze ligging is QC zelf de onjuiste stand; de loodrechte richting weerkaatst A → Q naar B. Deze richting is gelijk aan de lijn naar het andere snijpunt van de middelloodlijn met de cirkel, want die twee snijpunten zijn de eindpunten van een middellijn.']
   ],
   rubric:['Eén snijpunt C van de middelloodlijn van AB met de cirkel getekend (1 punt).','In P het spiegeltje in de richting van C getekend (1 punt).','In Q het spiegeltje loodrecht op QC getekend (2 punten).']}
 ],
 D4:[{title:'Gelijkbenige driehoeken en constante hoek',useBase:true}],
 D5a:[
  {title:'Twee koorde-raaklijnhoeken op BR',useBase:true},
  {title:'Buitenhoek en koorde-raaklijnhoek op AR',figureKey:'d-parallel-exterior',refs:[81,19,7],
   steps:[
    ['Gebruik de raaklijn in A','AR raakt de eerste cirkel in A. Met koorde AB geeft de koorde-raaklijnstelling ∠BAR = ∠ACB.'],
    ['Gebruik de buitenhoek bij B','C, B en R liggen op één lijn, met B tussen C en R. ∠ABR is dus de buitenhoek van △ABC bij B. Daarom ∠ABR = ∠BAC + ∠ACB, ofwel ∠BAC = ∠ABR − ∠ACB.'],
    ['Bereken ∠CAR op twee manieren','AB ligt binnen de getekende hoek CAR. Daardoor ∠CAR = ∠BAC + ∠BAR = ∠ABR − ∠ACB + ∠ACB = ∠ABR. In de tweede cirkel is AR een koorde en raakt m in R. De koorde-raaklijnstelling geeft ∠ABR = de aangegeven hoek tussen RA en m.'],
    ['Herken gelijke Z-hoeken','Dus ∠CAR is gelijk aan de aangegeven hoek tussen RA en m. Deze hoeken zijn Z-hoeken bij de snijlijn AR van AC en m. De omgekeerde Z-hoekenstelling geeft AC ∥ m.']
   ],
   rubric:['∠BAR = ∠ACB met de koorde-raaklijnstelling afgeleid (1 punt).','∠BAC = ∠ABR − ∠ACB met de buitenhoekstelling afgeleid (1 punt).','∠CAR = ∠ABR en de koorde-raaklijnhoek tussen AR en m verbonden (1 punt).','AC ∥ m met gelijke Z-hoeken onderbouwd (1 punt).']}
 ],
 D5b:[
  {title:'Constructie met een koorde-raaklijnhoek',figureKey:'d-parallel-angleBuild',refs:[81],
   steps:[
    ['Teken de twee hulplijnen','Teken AR en de lijn CR. De gezochte B ligt op CR. In de oorspronkelijke cirkel hoort de hoek tussen raaklijn AR en koorde AB bij de omtrekshoek ACB.'],
    ['Construeer de koordelijn door A','Neem de hoek tussen AC en CR over bij A. Teken daarvoor door A een lijn l zodat de hoek tussen AR en l gelijk is aan de hoek tussen AC en CR. Kies de stand uit het werkblad: l gaat naar het gezochte punt tussen C en R. Dit is de koorde-raaklijnhoek uit vraag 15.'],
    ['Benoem het snijpunt','Het snijpunt van l en CR is B. Markeer B en laat de overgenomen hoek en hulplijnen zichtbaar. Hiermee zijn de oorspronkelijke hoekvoorwaarde en de ligging van B hersteld.']
   ],
   rubric:['AR en CR getekend en door A de lijn l met de voorgeschreven koorde-raaklijnhoek geconstrueerd (2 punten).','B als snijpunt van l en CR benoemd (1 punt).']},
  {title:'Constructie via het cirkelmiddelpunt',useBase:true}
 ],
 D6a:[{title:'Koorde-raaklijnhoek en gelijkbenigheid',useBase:true}],
 D6b:[
  {title:'Overstaande hoeken bij A en F',useBase:true},
  {title:'Buitenhoek bij G en hoekensom',figureKey:'d-bisector-exterior',refs:[78,19,12,18,85],
   steps:[
    ['Gebruik de constante hoek op koorde AF','A, C, D en F liggen op de gestippelde cirkel. C en D zien koorde AF vanaf dezelfde kant, dus ∠ACF = ∠ADF. Omdat C, F en E op één lijn liggen, is ook ∠ACE = ∠ADF.'],
    ['Bereken de buitenhoek bij G','G ligt op lijnstuk AC en op lijnstuk DF. In △ADG is ∠AGF een buitenhoek, omdat GF het verlengde van GD is. Dus ∠AGF = ∠ADG + ∠GAD = ∠ADF + ∠CAD.'],
    ['Bereken de hoek bij E','Uit vraag 5 is AC de bissectrice van ∠BAD. E ligt op AB, zodat ∠CAE = ∠CAD. In △AEC geldt daarom ∠AEF = ∠AEC = 180° − ∠ACE − ∠CAE = 180° − ∠ACE − ∠CAD.'],
    ['Tel de overstaande hoeken op','Uit stap 1 is ∠ADF = ∠ACE. Daarom ∠AGF + ∠AEF = (∠ADF + ∠CAD) + (180° − ∠ACE − ∠CAD) = 180°. De omgekeerde koordenvierhoekstelling geeft dat A, E, F en G op één cirkel liggen. Dus G ligt op de cirkel door A, E en F.']
   ],
   rubric:['∠ACE = ∠ADF via de constante-hoekstelling afgeleid (1 punt).','∠AGF = ∠ADF + ∠CAD als buitenhoek berekend (1 punt).','∠AEF = 180° − ∠ACE − ∠CAD met de bissectrice en hoekensom afgeleid (1 punt).','Overstaande hoeken met som 180° en de koordenvierhoek geconcludeerd (1 punt).']},
  {title:'Gelijkvormigheid van AGD en AEC',figureKey:'d-bisector-similarity',refs:[78,12,25,2,85],
   steps:[
    ['Vind het eerste paar gelijke hoeken','Op de gestippelde cirkel staan ∠ACF en ∠ADF op dezelfde koorde AF aan dezelfde kant daarvan. Omdat C, F en E op één lijn liggen en D, G en F ook, volgt ∠ACE = ∠ADG.'],
    ['Vind het tweede paar gelijke hoeken','Uit vraag 5 volgt ∠CAD = ∠CAE. G ligt op AC, dus ∠GAD = ∠CAE.'],
    ['Gebruik gelijkvormigheid met hh','△AGD en △AEC hebben twee paren gelijke hoeken en zijn dus gelijkvormig volgens hh. De overeenkomst is A ↔ A, G ↔ E en D ↔ C. Daarom zijn ook de overige overeenkomstige hoeken gelijk: ∠AGD = ∠AEC.'],
    ['Gebruik de gestrekte hoek bij G','GD en GF zijn tegengestelde richtingen, dus ∠AGF = 180° − ∠AGD. Verder is ∠AEF = ∠AEC. Daarom ∠AGF + ∠AEF = 180° − ∠AGD + ∠AEC = 180°. De omgekeerde koordenvierhoekstelling geeft dat A, E, F en G op één cirkel liggen.']
   ],
   rubric:['∠ACE = ∠ADG met de constante-hoekstelling afgeleid (1 punt).','∠GAD = ∠CAE met de bissectrice afgeleid (1 punt).','△AGD ∼ △AEC volgens hh en ∠AGD = ∠AEC onderbouwd (1 punt).','De gestrekte hoek bij G en de koordenvierhoek geconcludeerd (1 punt).']}
 ]
};

// Uitsluitend de afzonderlijke methoden uit de officiële antwoordmodellen in PDF B.
// Volgorde en aantallen: p. 11 (B1), 12 (B2), 13 (B3), 14 (B4), 15 (B5), 16 (B6).
export const B_VARIANTS = {
 B1: [
  {title:'Z-hoeken, gelijke bogen en koorden',useBase:true},
  {title:'Supplementaire hoeken en gelijke bogen',figureKey:'b-trapezoid-supplementary',refs:[6,84,77,70],
   steps:[
    ['Gebruik de evenwijdige zijden','AB ∥ CD. De binnenhoeken ∠BAD en ∠ADC aan dezelfde kant van snijlijn AD zijn daarom samen 180°.'],
    ['Gebruik de koordenvierhoek','A, B, C en D liggen op één cirkel. De overstaande hoeken ∠BAD en ∠DCB zijn dus ook samen 180°.'],
    ['Vergelijk de twee sommen','In beide sommen komt ∠BAD voor. Daaruit volgt ∠ADC = ∠DCB. Deze gelijke omtrekshoeken horen bij even grote bogen: boog ABC = boog DAB.'],
    ['Haal de gemeenschappelijke boog weg','Boog ABC bestaat uit boog AB en boog BC. Boog DAB bestaat uit boog DA en dezelfde boog AB. Dus boog BC = boog DA.'],
    ['Vertaal bogen naar zijden','Bij gelijke bogen van dezelfde cirkel horen gelijke koorden. Daarom |AD| = |BC|. Het trapezium heeft dus twee even lange overstaande zijden.']
   ],
   rubric:['∠BAD + ∠ADC = 180° uit evenwijdigheid afgeleid (1 punt).','∠BAD + ∠DCB = 180° via de koordenvierhoek (1 punt).','∠ADC = ∠DCB en boog ABC = boog DAB geconcludeerd (1 punt).','De gemeenschappelijke boog AB verwijderd, zodat boog AD = boog BC (1 punt).','|AD| = |BC| met boog en koorde onderbouwd (1 punt).']}
 ],
 B2a:[{title:'Middelpunt via twee loodlijnen',useBase:true}],
 B2b:[{title:'Koorde-raaklijnhoeken en hoekensom',useBase:true}],
 B3:[
  {title:'De verhouding 2 : 1 op een zwaartelijn',useBase:true},
  {title:'Een tweede zwaartelijn met gelijkvormigheid',figureKey:'b-centroid-similarity',refs:[55,25,33,34],
   steps:[
    ['Vind het midden van DB','Noem het snijpunt van AC en DB punt S. De diagonalen van parallellogram ABCD delen elkaar middendoor, dus |DS| = |SB|.'],
    ['Herken de eerste zwaartelijn','ES is de zwaartelijn van △DBE vanuit E. De punten E, C, S en A liggen op één lijn, dus C ligt op deze zwaartelijn.'],
    ['Vergelijk twee driehoeken','Noem het snijpunt van de lijnen BC en DE punt T. Omdat AD ∥ BC, geldt ∠ADE = ∠CTE (F-hoeken). Ook ∠DEA = ∠TEC, want E, C en A liggen op één straal vanuit E en E, T en D eveneens. Dus △ADE ∼ △CTE volgens hh, met A ↔ C, D ↔ T en E ↔ E.'],
    ['Bewijs dat T een midden is','Gegeven is |AC| = |CE|, dus C is het midden van AE en |CE|/|AE| = ½. Uit de gelijkvormigheid volgt |TE|/|DE| = ½. T ligt op DE en is dus het midden van DE. Daarmee is BT een zwaartelijn van △DBE; C ligt op BT.'],
    ['Neem het snijpunt van de zwaartelijnen','C ligt op de zwaartelijnen ES en BT van △DBE. C is dus het snijpunt van de zwaartelijnen, oftewel het zwaartepunt.']
   ],
   rubric:['AC deelt DB middendoor (1 punt).','C op de zwaartelijn vanuit E herkend (1 punt).','△ADE ∼ △CTE met twee gelijke hoeken onderbouwd (1 punt).','T als midden van DE en BT als tweede zwaartelijn vastgesteld (1 punt).','C als snijpunt van de zwaartelijnen geconcludeerd (1 punt).']},
  {title:'Twee zwaartelijnen met twee gelijkvormigheden',figureKey:'b-centroid-two-medians',refs:[55,25,33,34],
   steps:[
    ['Teken de eerste hulplijn','Noem het snijpunt van de lijnen CD en BE punt P. De lijn DP gaat door C.'],
    ['Vergelijk △ABE en △CPE','AB ∥ CD, dus AB ∥ CP. Daarom ∠ABE = ∠CPE en ∠BAE = ∠PCE (F-hoeken). De driehoeken ABE en CPE zijn gelijkvormig volgens hh, met A ↔ C, B ↔ P en E ↔ E.'],
    ['Vind de eerste zwaartelijn','C is het midden van AE, zodat |CE|/|AE| = ½. De gelijkvormigheid geeft |PE|/|BE| = ½. P is dus het midden van BE, waardoor DP een zwaartelijn van △DBE is. C ligt op DP.'],
    ['Vind op dezelfde manier een tweede zwaartelijn','Noem het snijpunt van de lijnen BC en DE punt Q. Omdat AD ∥ CQ, geldt ∠ADE = ∠CQE en ∠DEA = ∠QEC. Dus △ADE ∼ △CQE volgens hh. Met |CE|/|AE| = ½ volgt |QE|/|DE| = ½. Q is het midden van DE; BQ is dus een zwaartelijn en C ligt erop.'],
    ['Concludeer dat C het zwaartepunt is','C ligt op de zwaartelijnen DP en BQ van △DBE. Daarom is C het snijpunt van de zwaartelijnen.']
   ],
   rubric:['P als snijpunt van CD en BE ingevoerd (1 punt).','△ABE ∼ △CPE met F-hoeken onderbouwd (1 punt).','P als midden van BE en DP als zwaartelijn vastgesteld (1 punt).','Met Q = BC ∩ DE ook BQ als zwaartelijn door C onderbouwd (1 punt).','C als snijpunt van de zwaartelijnen geconcludeerd (1 punt).']}
 ],
 B4a:[
  {title:'Twee complementen van dezelfde hoek',useBase:true},
  {title:'Koorde-raaklijnhoek en Thales',figureKey:'b-diameter-tangent',refs:[81,73,2,18],
   steps:[
    ['Gebruik koorde en raaklijn','BP′ ligt op raaklijn k en BP is een koorde. Daarom ∠P′BP = ∠BAP volgens de stelling van de hoek tussen koorde en raaklijn.'],
    ['Gebruik de middellijn','AB is een middellijn en P ligt op de cirkel. Volgens Thales is ∠APB = 90°.'],
    ['Gebruik een gestrekte hoek bij P','A, P en P′ liggen op één lijn, met P ertussen. Dus ∠P′PB = 180° − ∠APB = 90°. Ook △BP′P is rechthoekig.'],
    ['Vergelijk de twee scherpe hoeken','De hoekensom in △APB geeft ∠ABP = 90° − ∠BAP. In △BP′P geldt ∠AP′B = ∠PP′B = 90° − ∠P′BP. Omdat ∠BAP = ∠P′BP, zijn ook hun complementen gelijk: ∠ABP = ∠AP′B.']
   ],
   rubric:['∠P′BP = ∠BAP met koorde en raaklijn onderbouwd (1 punt).','∠APB = 90° via Thales (1 punt).','∠P′PB = 90° via de gestrekte hoek (1 punt).','Beide gevraagde hoeken als gelijke complementen geschreven (1 punt).']},
  {title:'Gelijkvormigheid van twee rechthoekige driehoeken',figurePlan:[1,3,4],refs:[82,73,25],
   steps:[
    ['Vind de rechte hoek bij B','k raakt de cirkel in B. De straal MB staat loodrecht op k. Omdat A, M en B op één lijn liggen, is ∠ABP′ = 90°.'],
    ['Vind de rechte hoek bij P','AB is een middellijn. Daarom is ∠APB = 90° volgens Thales. Dus ∠APB = ∠ABP′.'],
    ['Gebruik gelijkvormigheid','A, P en P′ liggen op één straal vanuit A, dus ∠BAP = ∠P′AB. Met de gelijke rechte hoeken volgt △APB ∼ △ABP′ volgens hh, met A ↔ A, P ↔ B en B ↔ P′. De overeenkomstige derde hoeken zijn daarom gelijk: ∠ABP = ∠AP′B.']
   ],
   rubric:['∠ABP′ = 90° met de raaklijn onderbouwd (1 punt).','∠APB = 90° met Thales onderbouwd (1 punt).','Twee gelijke hoeken, hh en de gevraagde overeenkomstige hoeken gebruikt (2 punten).']}
 ],
 B4b:[{title:'Supplementaire overstaande hoeken',useBase:true}],
 B5:[{title:'Derde bissectrice en congruentie',useBase:true}],
 B6a:[{title:'Overstaande hoeken met som 180°',useBase:true}],
 B6b:[
  {title:'Verplaats de hoek bij A',useBase:true},
  {title:'Verplaats de hoek bij D',figureKey:'b-equilateral-other-angle',refs:[83,78,6,18,40],
   steps:[
    ['Gebruik de omgeschreven cirkel','Uit vraag 6 volgt dat ACDE een koordenvierhoek is. Er bestaat dus een omgeschreven cirkel door A, C, D en E.'],
    ['Vergelijk omtrekshoeken op AE','∠ADE en ∠ACE staan op dezelfde koorde AE en aan dezelfde kant daarvan. Volgens de constante-hoekstelling geldt ∠ADE = ∠ACE.'],
    ['Gebruik de evenwijdige lijnen','CE ∥ AB. Daarom ∠ACE = ∠BAC (Z-hoeken). Omdat △ABC gelijkzijdig is, is ∠BAC = 60°. Dus ∠ADE = 60°.'],
    ['Maak de driehoek gelijkzijdig','Gegeven is ∠AED = 60°. De hoekensom in △ADE geeft nu ∠DAE = 180° − 60° − 60° = 60°. Alle drie de hoeken zijn gelijk, dus △ADE is gelijkzijdig.']
   ],
   rubric:['De omgeschreven cirkel van ACDE gebruikt (1 punt).','∠ADE = ∠ACE met constante hoek onderbouwd (1 punt).','∠ACE = ∠BAC = 60° met Z-hoeken onderbouwd (1 punt).','∠ADE = 60° geconcludeerd (1 punt).','De derde hoek en gelijkzijdigheid afgeleid (1 punt).']}
 ],
 B6c:[
  {title:'Hulplijn door C evenwijdig aan AB',useBase:true},
  {title:'Hulplijn door B evenwijdig aan AC',figureKey:'b-equilateral-build-other',refs:[6,39,40],
   steps:[
    ['Teken de andere hulp-evenwijdige','Trek door B de lijn l evenwijdig aan AC. Hiermee verwissel je de rollen van B en C ten opzichte van de situatie uit vraag 6 en 7.'],
    ['Bepaal M op de gegeven lijn','Noem het snijpunt van l met m punt M. Deze keuze van M zorgt voor de evenwijdigheid die nodig is om vraag 6 en 7 te gebruiken.'],
    ['Teken de gelijkzijdige driehoek','Construeer de gelijkzijdige driehoek op AM aan de kant van k. Teken daartoe passerbogen met middelpunten A en M en straal |AM|. Hun snijpunt aan die kant is K. Teken AK en MK.'],
    ['Verklaar waarom K op k ligt','Na verwisseling van B en C is dit dezelfde situatie als in vraag 6 en 7: ABC is gelijkzijdig, BM ∥ AC en de geconstrueerde hoek bij M is 60°. Het resultaat van vraag 7 bepaalt de gelijkzijdige driehoek met derde hoekpunt op lijn BC, dus op k. De passerconstructie geeft datzelfde punt K. Zo ligt K op k en M op m.']
   ],
   rubric:['De lijn door B evenwijdig aan AC getekend (1 punt).','M als snijpunt van deze lijn met m benoemd (1 punt).','Driehoek AKM getekend (1 punt).','De constructie met de situatie van vraag 6 en 7 verklaard (1 punt).']}
 ]
};

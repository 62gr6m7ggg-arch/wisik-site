// Varianten uit de officiële correctievoorschriften in de bestaande A-bundel.
// Fysieke PDF-pagina's: A1 12; A2 13; A3 14; A4 15–16; A5 17; A6 18.
// Alleen afzonderlijk aangeboden oplossingsmethoden tellen als variant.
export const A_VARIANTS = {
 A1: [
  {title:'Via congruentie en Thales',useBase:true},
  {title:'Via de loodlijn op een koorde en Thales',refs:[71,74],figurePlan:[2,3],
   steps:[
    ['Gebruik de loodlijn op een koorde','De loodlijn vanuit het middelpunt M op koorde PQ snijdt die koorde in het midden. Omdat S het midden van PQ is, geldt MS ⟂ PQ. Dit volgt rechtstreeks uit de stelling over de loodlijn op een koorde; congruentie is in deze route niet nodig.'],
    ['Pas de omgekeerde stelling van Thales toe','C en S liggen op de koordelijn PQ. Als C ≠ S, is ∠CSM dus 90°. Volgens de omgekeerde stelling van Thales ligt S op de cirkel met middellijn MC. Als C = S, is S zelf het eindpunt C van de middellijn en ligt het direct op die cirkel.']
   ],
   rubric:['De loodlijn vanuit M op koorde PQ gaat door het midden S (2 punten).','S ligt op de cirkel met middellijn MC via Thales; het eindpuntgeval is direct (1 punt).']}
 ],
 A2a:[{title:'Via gelijke hoeken en ZHH',useBase:true}],
 A2b:[
  {title:'Beide afstanden verwisseld overzetten',useBase:true},
  {title:'Eén afstand overzetten en een rechte hoek tekenen',refs:[20,41,35],figureKey:'geoBuildRight',
   steps:[
    ['Teken de loodlijn en zet één afstand over','Trek door A de loodlijn op k en m. Noem de snijpunten S op k en T op m. Zet op k, links van S, de lengte AT over: kies Q zo dat SQ = AT. Laat de hulpconstructie staan.'],
    ['Construeer de rechte hoek bij A','Verbind A met Q. Trek door A de loodlijn op AQ en neem het snijpunt van die lijn met m als R. Daarmee is ∠QAR = 90°.'],
    ['Voltooi en verantwoord de geodriehoek','Teken QR. De rechte hoeken bij S en T en de rechte hoek QAR geven ∠AQS = ∠RAT, zoals in vraag 12. Samen met SQ = AT zijn △QSA en △ATR congruent volgens HZH. Dus AQ = AR. Met de geconstrueerde rechte hoek bij A is △QAR een geodriehoek. De spiegelbeeldige constructie is ook goed.']
   ],
   rubric:['De gelijke lijnstukken SQ en AT getekend met de bijbehorende loodlijn (1 punt).','De rechte hoek QAR bij A geconstrueerd (1 punt).','De geodriehoek voltooid met gebruik van de beschreven congruente driehoeken (1 punt).']}
 ],
 A3a:[{title:'Via Z-hoeken en de bissectrice',useBase:true}],
 A3b:[{title:'Via koorde en raaklijn en de buitenhoek',useBase:true}],
 A4a:[
  {title:'Via de vaste boog AC en de rechte hoek bij Q',useBase:true},
  {title:'Via twee vaste bogen en een buitenhoek',refs:[78,18,19],figureKey:'altitudeExterior',
   steps:[
    ['Gebruik de twee vaste bogen','De punten A, B en C staan vast. Dus de bogen CB en AB zijn constant. Volgens de stelling van de constante hoek zijn daarom zowel ∠CPB als ∠APB constant wanneer P over de toegestane boog beweegt.'],
    ['Gebruik de rechthoekige driehoek PBQ','BQ is een hoogtelijn, dus BQ ⟂ AP. In △PBQ geldt ∠PBQ = 90° − ∠QPB. Omdat Q op AP ligt, is ∠QPB = ∠APB. Dus ∠PBQ is constant. In de eindstand Q = A blijft deze hoekrelatie geldig.'],
    ['Neem de buitenhoek bij R','In △PBR is ∠BRC een buitenhoek, omdat C, R en P op één lijn liggen. Daarom ∠BRC = ∠PBR + ∠RPB = ∠PBQ + ∠CPB. Beide termen zijn constant, dus ∠BRC verandert niet.']
   ],
   rubric:['Constante bogen CB en AB verbonden aan constante hoeken CPB en APB (2 punten).','∠PBQ = 90° − ∠APB en dus constant afgeleid (1 punt).','∠BRC als som van twee constante hoeken geschreven via de buitenhoekstelling (1 punt).']}
 ],
 A4b:[{title:'Via een cirkelboog en de randposities van P',useBase:true}],
 A5a:[{title:'Via productgelijkheid en gelijkvormigheid zhz',useBase:true}],
 A5b:[{title:'Via gelijkvormigheid en Thales',useBase:true}],
 A6a:[{title:'Via constante hoek, Z-hoeken en supplementaire hoeken',useBase:true}],
 A6b:[{title:'Via constante hoeken in de twee cirkels',useBase:true}]
};

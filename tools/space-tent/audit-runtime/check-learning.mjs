// scripts/check-learning.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// app/content.json
var content_default = {
  blocks: [
    {
      id: "projection",
      title: "Kijken in de ruimte",
      subtitle: "Parallelprojectie en aanzichten",
      theory: [
        {
          title: "Een beeld laat diepte weg",
          text: "Je scherm heeft twee richtingen; de ruimte heeft er drie. Verschillende punten kunnen op dezelfde beeldplek terechtkomen. Vraag steeds: zie ik iets, of volgt het uit de gegevens?",
          example: "projection-views"
        },
        {
          title: "Het midden blijft het midden",
          text: "Punten op \xE9\xE9n rechte blijven op \xE9\xE9n rechte, tenzij die hele lijn tot een punt wordt geprojecteerd. De verhoudingen langs dezelfde richting blijven behouden.",
          highlights: [
            "AG"
          ],
          example: "midpoint"
        },
        {
          title: "Elke richting heeft haar beeldschaal",
          text: "Parallelle lijnstukken worden met dezelfde factor weergegeven. Verschillende richtingen kunnen verschillende factoren hebben. Ook rechte hoeken hoeven op het scherm niet recht te lijken.",
          highlights: [
            "AB",
            "AD",
            "AE"
          ],
          example: "direction-scale"
        },
        {
          title: "Een aanzicht kiest wat verdwijnt",
          text: "Bij het vooraanzicht langs AD valt de diepte weg: A en D vallen samen. Bij het bovenaanzicht langs AE valt de hoogte weg: A en E vallen samen. De gekozen kijkrichting moet altijd gegeven zijn.",
          highlights: [
            "AD",
            "AE"
          ],
          example: "projection-views"
        }
      ],
      questionIds: [
        "p1",
        "p2",
        "p3",
        "p4",
        "p5",
        "p6"
      ],
      probeIds: [
        "probe-p1",
        "probe-p2"
      ],
      retestIds: [
        "retest-p1",
        "retest-p2"
      ],
      repair: {
        title: "Het object blijft hetzelfde",
        text: "Vergelijk twee projecties van dezelfde kubus. De ribben lijken langer of korter, maar blijven werkelijk even lang. De richting bepaalt de beeldschaal; de gegevens bepalen de echte maat. Zonder extra projectiegegevens mag je beeldverhoudingen alleen langs dezelfde richting rechtstreeks gebruiken, zolang die richting niet tot een punt wordt geprojecteerd.",
        highlights: [
          "AB",
          "AD",
          "AE"
        ],
        example: "direction-scale"
      },
      misconception: {
        label: "Beeldlengte wordt als werkelijke lengte gelezen",
        trigger: {
          qid: "p1",
          wrongAnswer: "a"
        },
        probeWrongAnswers: [
          "b",
          "a"
        ]
      }
    },
    {
      id: "lines",
      title: "Lijnen doorgronden",
      subtitle: "Snijden, evenwijdig of kruisen",
      theory: [
        {
          title: "Eerst een gedeeld vlak zoeken",
          text: "Twee verschillende lijnen in \xE9\xE9n vlak snijden elkaar of zijn evenwijdig. Dat de getekende stukjes elkaar niet raken, is nog geen bewijs voor evenwijdigheid.",
          highlights: [
            "AF",
            "BE"
          ],
          planes: [
            [
              "A",
              "B",
              "F",
              "E"
            ]
          ],
          example: "shared-plane"
        },
        {
          title: "De ruimte heeft een derde mogelijkheid",
          text: "Kruisende lijnen hebben geen gemeenschappelijk punt \xE9n verschillende richtingen. Ze liggen niet samen in \xE9\xE9n vlak.",
          highlights: [
            "AB",
            "CG"
          ],
          example: "line-relations"
        },
        {
          title: "Een lijn stopt niet bij de rand",
          text: "Een lijn loopt aan beide kanten onbeperkt door. Neem M halverwege EA. De lijnstukken GM en AC raken elkaar niet binnen de kubus. Verleng GM voorbij M en AC voorbij A: de lijnen ontmoeten elkaar buiten de kubus in S. Ze liggen allebei in het diagonale vlak ACGE. Het zijn dus snijdende lijnen, ook al ligt hun snijpunt buiten de getekende kubus.",
          example: "external-intersection"
        },
        {
          title: "Een reden is sterker dan een beeld",
          text: "Zoek een gedeeld punt, een gedeeld vlak of een geometrisch argument over de richtingen. Alleen een kruising op het scherm bewijst geen ruimtelijk snijpunt.",
          example: "false-crossing"
        }
      ],
      questionIds: [
        "l1",
        "l2",
        "l3",
        "l4"
      ],
      probeIds: [
        "probe-l1",
        "probe-l2"
      ],
      retestIds: [
        "retest-l1",
        "retest-l2"
      ],
      repair: {
        title: "Niet snijden is nog niet evenwijdig",
        text: "Op \xE9\xE9n blad zijn twee verschillende lijnen zonder snijpunt evenwijdig. In de ruimte kun je \xE9\xE9n lijn optillen en van richting veranderen. Dan ontbreekt nog steeds een snijpunt, maar de lijnen zijn kruisend. Controleer altijd ook hun richting of een gemeenschappelijk vlak.",
        highlights: [
          "AB",
          "CG"
        ],
        example: "line-relations"
      },
      misconception: {
        label: "Niet snijden wordt gelijkgesteld aan evenwijdigheid",
        trigger: {
          qid: "l1",
          wrongAnswer: "b"
        },
        probeWrongAnswers: [
          "a",
          "a"
        ]
      }
    },
    {
      id: "planes",
      title: "Vlakken vastleggen",
      subtitle: "Een vlak bepalen en een snijlijn vinden",
      theory: [
        {
          title: "Drie punten, met \xE9\xE9n voorwaarde",
          text: "Drie punten bepalen precies \xE9\xE9n vlak als ze niet op \xE9\xE9n lijn liggen. Rond \xE9\xE9n lijn passen juist oneindig veel vlakken.",
          highlights: [
            "AB"
          ],
          example: "plane-hinge"
        },
        {
          title: "Dezelfde gedachte in andere vormen",
          text: "Ook \xE9\xE9n lijn en een punt erbuiten, twee snijdende lijnen, of twee verschillende evenwijdige lijnen bepalen precies \xE9\xE9n vlak.",
          example: "plane-definitions"
        },
        {
          title: "Een vlak loopt buiten de kubus door",
          text: "Vlak ABC is het hele vlak door A, B en C. Driehoek ABC en vierhoek ABCD zijn slechts delen daarvan.",
          planes: [
            [
              "A",
              "B",
              "C",
              "D"
            ]
          ],
          example: "plane-extension"
        },
        {
          title: "Twee gedeelde punten geven een snijlijn",
          text: "Twee verschillende vlakken die twee verschillende punten gemeen hebben, bevatten de hele lijn door die punten. Die lijn is hun snijlijn.",
          example: "plane-intersection"
        }
      ],
      questionIds: [
        "v1",
        "v2",
        "v3",
        "v4"
      ],
      probeIds: [
        "probe-v1",
        "probe-v2"
      ],
      retestIds: [
        "retest-v1"
      ],
      repair: {
        title: "Een punt buiten de lijn maakt het verschil",
        text: "Denk aan een halfdoorzichtig vlak dat om lijn AB draait. Drie punten op AB blijven in elke stand in het vlak. Zet een punt buiten AB vast: nog maar \xE9\xE9n vlak door AB bevat ook dat punt.",
        highlights: [
          "AB"
        ],
        example: "plane-hinge"
      },
      misconception: {
        label: "De voorwaarde niet op \xE9\xE9n lijn wordt overgeslagen",
        trigger: {
          qid: "v1",
          wrongAnswer: "a"
        },
        probeWrongAnswers: [
          "b",
          "c"
        ]
      }
    },
    {
      id: "threeplanes",
      title: "Drie vlakken tegelijk",
      subtitle: "Paarsgewijze en gezamenlijke doorsneden",
      theory: [
        {
          title: "Begin met elk paar",
          text: "Onderzoek bij drie verschillende vlakken eerst elk paar: evenwijdig, of een snijlijn? Daarna vraag je wat in alle drie ligt.",
          example: "plane-pairs"
        },
        {
          title: "Een parallel paar",
          text: "Drie evenwijdige vlakken hebben geen snijlijnen. Zijn precies twee vlakken evenwijdig, dan snijdt het derde ze in twee evenwijdige lijnen.",
          planes: [
            [
              "A",
              "B",
              "C",
              "D"
            ],
            [
              "E",
              "F",
              "G",
              "H"
            ],
            [
              "A",
              "B",
              "F",
              "E"
            ]
          ],
          example: "parallel-planes"
        },
        {
          title: "Elk paar snijdt: drie mogelijkheden",
          text: "Als elk paar van drie verschillende vlakken snijdt, kunnen de vlakken \xE9\xE9n lijn delen, drie verschillende evenwijdige snijlijnen hebben, of drie verschillende snijlijnen die door hetzelfde punt gaan. Vergelijk hieronder de drie situaties.",
          example: "three-planes"
        },
        {
          title: "Per paar is nog niet allemaal samen",
          text: "Drie verticale wanden langs de zijden van een driehoek ontmoeten elkaar per paar. Toch ligt nergens een punt in alle drie wanden.",
          planes: [
            [
              "A",
              "B",
              "F",
              "E"
            ],
            [
              "B",
              "C",
              "G",
              "F"
            ],
            [
              "A",
              "C",
              "G",
              "E"
            ]
          ],
          example: "triangle-walls"
        }
      ],
      questionIds: [
        "d1",
        "d2",
        "d3",
        "d4"
      ],
      probeIds: [
        "probe-d1",
        "probe-d2"
      ],
      retestIds: [
        "retest-d1",
        "retest-d2"
      ],
      repair: {
        title: "Zoek wat in alle drie ligt",
        text: "Vergelijk drie situaties: boekbladen die \xE9\xE9n lijn delen, drie verticale wanden langs een driehoek, en een vloer met twee aangrenzende muren. Zoek eerst de snijlijn van elk paar. Pas daarna bepaal je of alle drie een lijn, \xE9\xE9n punt of niets delen.",
        planes: [
          [
            "A",
            "B",
            "F",
            "E"
          ],
          [
            "B",
            "C",
            "G",
            "F"
          ],
          [
            "A",
            "C",
            "G",
            "E"
          ]
        ],
        example: "three-planes"
      },
      misconception: {
        label: "Paarsgewijze sneden worden voor \xE9\xE9n gezamenlijke snede gehouden",
        trigger: {
          qid: "d4",
          wrongAnswer: "a"
        },
        probeWrongAnswers: [
          "a",
          "b"
        ]
      }
    }
  ],
  questions: [
    {
      id: "p1",
      block: "projection",
      skill: "inzicht",
      type: "choice",
      prompt: "Een kubus heeft ribben van 6 cm. In een parallelprojectietekening zijn de beeldlengtes AB = 4 cm en AD = 2 cm. Wat volgt daaruit?",
      options: [
        {
          id: "a",
          text: "AD is in werkelijkheid half zo lang als AB."
        },
        {
          id: "b",
          text: "De kubus is verkeerd geconstrueerd."
        },
        {
          id: "c",
          text: "De richtingen AB en AD worden met verschillende factoren weergegeven."
        },
        {
          id: "d",
          text: "AB en AD staan in werkelijkheid niet loodrecht."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "De kubusgegevens bepalen dat AB en AD even lang zijn. De projectie kan de diepte sterker verkorten dan de horizontale richting.",
      hint: "Welke lengtes volgen uit het woord kubus?",
      highlights: [
        "AB",
        "AD"
      ]
    },
    {
      id: "p2",
      block: "projection",
      skill: "onderbouwen",
      type: "choice",
      prompt: "M is het midden van AG. De beelden van A en G zijn verschillend. Waar ligt het beeld van M in een parallelprojectie?",
      options: [
        {
          id: "a",
          text: "In het midden tussen de beelden van A en G."
        },
        {
          id: "b",
          text: "Dichter bij A, omdat G verder naar achteren ligt."
        },
        {
          id: "c",
          text: "Dichter bij G, omdat de diepte wordt verkort."
        },
        {
          id: "d",
          text: "Dat is zonder de kijkrichting niet te bepalen."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "AM en MG hebben dezelfde richting en lengte. Beide worden met dezelfde factor geprojecteerd, dus het midden blijft het midden.",
      hint: "Vergelijk twee delen van dezelfde rechte.",
      highlights: [
        "AG"
      ],
      extraPoints: {
        M: [
          0.5,
          0.5,
          0.5
        ]
      }
    },
    {
      id: "p3",
      block: "projection",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Je kent alleen een parallelprojectietekening van twee ruimtelijke lijnen. Hun beelden maken een hoek van 90\xB0. Wat kun je besluiten?",
      options: [
        {
          id: "a",
          text: "De ruimtelijke hoek is 90\xB0."
        },
        {
          id: "b",
          text: "De ruimtelijke hoek is kleiner dan 90\xB0."
        },
        {
          id: "c",
          text: "De ruimtelijke hoek is groter dan 90\xB0."
        },
        {
          id: "d",
          text: "Deze beeldhoek is onvoldoende om de ruimtelijke hoek vast te stellen."
        }
      ],
      answer: [
        "d"
      ],
      explanation: "Een algemene parallelprojectie behoudt hoeken niet. Extra ruimtelijke gegevens zijn nodig; de twee lijnen kunnen zelfs kruisend zijn.",
      hint: "Welke eigenschappen kan een projectie veranderen?"
    },
    {
      id: "p4",
      block: "projection",
      skill: "rekenen",
      type: "choice",
      prompt: "Twee evenwijdige lijnstukken zijn in werkelijkheid 3 en 5 cm lang. Geen van beide wordt tot een punt geprojecteerd. Wat geldt voor hun beeldlengtes?",
      options: [
        {
          id: "a",
          text: "Beide worden even lang."
        },
        {
          id: "b",
          text: "Hun verhouding blijft 3 : 5."
        },
        {
          id: "c",
          text: "Hun verhouding wordt 3 : 10."
        },
        {
          id: "d",
          text: "Iedere verhouding is mogelijk."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Omdat de lijnstukken dezelfde richting hebben, geldt voor beide dezelfde schaalfactor. Die valt weg in de verhouding.",
      hint: "Wat gebeurt er met een verhouding als je beide getallen met dezelfde factor vermenigvuldigt?"
    },
    {
      id: "p5",
      block: "projection",
      skill: "inzicht",
      type: "choice",
      prompt: "Voor het vooraanzicht kijk je loodrecht op vlak ABFE, langs richting AD. Welke twee hoekpunten vallen in dit aanzicht samen?",
      options: [
        {
          id: "a",
          text: "A en D."
        },
        {
          id: "b",
          text: "A en B."
        },
        {
          id: "c",
          text: "A en E."
        },
        {
          id: "d",
          text: "A en G."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "A en D liggen achter elkaar in de kijkrichting AD. Hun diepteverschil verdwijnt in het vooraanzicht.",
      hint: "Welke punten liggen op \xE9\xE9n lijn evenwijdig aan de kijkrichting?",
      planes: [
        [
          "A",
          "B",
          "F",
          "E"
        ]
      ]
    },
    {
      id: "p6",
      block: "projection",
      skill: "inzicht",
      type: "choice",
      prompt: "Voor het bovenaanzicht kijk je loodrecht op vlak ABCD, langs richting AE. Welke twee hoekpunten vallen in dit aanzicht samen?",
      options: [
        {
          id: "a",
          text: "A en B."
        },
        {
          id: "b",
          text: "A en D."
        },
        {
          id: "c",
          text: "A en E."
        },
        {
          id: "d",
          text: "A en C."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "A en E liggen boven elkaar in richting AE. Het hoogteverschil verdwijnt wanneer je van boven kijkt.",
      hint: "Welke richting wordt in dit aanzicht weggelaten?",
      planes: [
        [
          "A",
          "B",
          "C",
          "D"
        ]
      ]
    },
    {
      id: "probe-p1",
      block: "projection",
      skill: "inzicht",
      type: "choice",
      prompt: "In een nieuwe tekening van een kubus lijkt AE korter dan AB. Welke informatie bepaalt of deze ribben werkelijk even lang zijn?",
      options: [
        {
          id: "a",
          text: "De definitie van een kubus: alle ribben zijn even lang."
        },
        {
          id: "b",
          text: "De gemeten beeldlengtes: AE is echt korter."
        },
        {
          id: "c",
          text: "De kleur van de ribben."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "De ruimtelijke kubusgegevens bepalen de werkelijke lengtes; beeldlengtes kunnen per richting verschillend zijn.",
      hint: "Ga uit van de gegeven ruimtefiguur.",
      highlights: [
        "AE",
        "AB"
      ]
    },
    {
      id: "probe-p2",
      block: "projection",
      skill: "inzicht",
      type: "choice",
      prompt: "Je draait het beeld van een vaste kubus. Daardoor wordt AD op het scherm langer. Wat is er met de werkelijke lengte van AD gebeurd?",
      options: [
        {
          id: "a",
          text: "Die is groter geworden."
        },
        {
          id: "b",
          text: "Die is gelijk gebleven."
        },
        {
          id: "c",
          text: "Die is niet meer vast te stellen."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Alleen de weergave verandert. Het draaien van de kijkrichting verandert geen ribbe van de kubus.",
      hint: "Vergelijk het object met de manier waarop je het bekijkt.",
      highlights: [
        "AD"
      ]
    },
    {
      id: "retest-p1",
      block: "projection",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een balk heeft AB = 8 cm en AD = 4 cm. In een parallelprojectie zijn beide beeldlengtes 4 cm. Kan dat?",
      options: [
        {
          id: "a",
          text: "Nee, gelijke beeldlengtes vereisen gelijke echte lengtes."
        },
        {
          id: "b",
          text: "Ja, AB kan met factor 1/2 en AD met factor 1 worden weergegeven."
        },
        {
          id: "c",
          text: "Ja, maar alleen als de balk een kubus is."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Bij een algemene parallelprojectie kunnen verschillende richtingen verschillende schaalfactoren hebben. Een balk hoeft in het beeld dus geen maatvaste tekening te zijn.",
      hint: "Vergelijk de schaalfactor per richting."
    },
    {
      id: "retest-p2",
      block: "projection",
      skill: "rekenen",
      type: "choice",
      prompt: "Twee evenwijdige lijnstukken zijn 2 en 6 cm lang. Het eerste wordt 1 cm lang getekend; geen van beide valt tot een punt samen. Hoe lang wordt het tweede getekend?",
      options: [
        {
          id: "a",
          text: "2 cm."
        },
        {
          id: "b",
          text: "3 cm."
        },
        {
          id: "c",
          text: "6 cm."
        },
        {
          id: "d",
          text: "Dat is niet te bepalen."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Beide lijnstukken krijgen dezelfde schaalfactor 1/2. Daarom wordt 6 cm als 3 cm getekend.",
      hint: "De lijnstukken hebben dezelfde richting."
    },
    {
      id: "l1",
      block: "lines",
      skill: "inzicht",
      type: "choice",
      prompt: "Wat is de onderlinge ligging van de lijnen AB en CG in de kubus?",
      options: [
        {
          id: "a",
          text: "Snijdend."
        },
        {
          id: "b",
          text: "Evenwijdig."
        },
        {
          id: "c",
          text: "Kruisend."
        },
        {
          id: "d",
          text: "Samenvallend."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "AB en CG hebben geen gemeenschappelijk punt en hun richtingen verschillen. Ze zijn kruisend: ze liggen niet samen in \xE9\xE9n vlak.",
      hint: "Onderzoek zowel een gemeenschappelijk punt als de richtingen.",
      highlights: [
        "AB",
        "CG"
      ]
    },
    {
      id: "l2",
      block: "lines",
      skill: "onderbouwen",
      type: "choice",
      prompt: "AF en BE zijn diagonalen van zijvlak ABFE. Welke conclusie is goed onderbouwd?",
      options: [
        {
          id: "a",
          text: "Ze kruisen, want dit zijn ruimtelijke lijnen."
        },
        {
          id: "b",
          text: "Ze snijden, want ze zijn diagonalen van hetzelfde vierkant."
        },
        {
          id: "c",
          text: "Ze zijn evenwijdig, want ze zijn even lang."
        },
        {
          id: "d",
          text: "Ze snijden uitsluitend als je de kubus van voren bekijkt."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "De diagonalen liggen in \xE9\xE9n vlak en delen het middelpunt van dat vierkant. De kijkrichting verandert dit snijpunt niet.",
      hint: "Zoek een vlak dat beide lijnen bevat.",
      highlights: [
        "AF",
        "BE"
      ],
      planes: [
        [
          "A",
          "B",
          "F",
          "E"
        ]
      ]
    },
    {
      id: "l3",
      block: "lines",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Twee verschillende lijnen liggen in hetzelfde vlak en zijn niet evenwijdig. De zichtbare lijnstukken raken elkaar niet. Wat geldt voor de volledige lijnen?",
      options: [
        {
          id: "a",
          text: "Ze zijn evenwijdig."
        },
        {
          id: "b",
          text: "Ze zijn kruisend."
        },
        {
          id: "c",
          text: "De volledige lijnen snijden; daarvoor moet je minstens \xE9\xE9n lijnstuk verlengen."
        },
        {
          id: "d",
          text: "Ze hebben geen gemeenschappelijk punt."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "In \xE9\xE9n vlak snijden verschillende niet-evenwijdige lijnen elkaar. Een lijn loopt verder dan het stukje dat je tekent.",
      hint: "Maak onderscheid tussen een lijn en een lijnstuk."
    },
    {
      id: "l4",
      block: "lines",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Wat bewijst dat AB en HG in de kubus evenwijdig zijn?",
      options: [
        {
          id: "a",
          text: "Hun lijnstukken raken elkaar niet."
        },
        {
          id: "b",
          text: "Ze lijken even lang op het scherm."
        },
        {
          id: "c",
          text: "AB is evenwijdig aan DC en DC is evenwijdig aan HG."
        },
        {
          id: "d",
          text: "Ze hebben geen gemeenschappelijke letter."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "Tegenoverliggende zijden van de vierkanten ABCD en DCGH zijn evenwijdig. Via DC vergelijk je de richtingen van AB en HG.",
      hint: "Zoek een ribbe waarmee je beide richtingen kunt vergelijken.",
      highlights: [
        "AB",
        "HG"
      ]
    },
    {
      id: "probe-l1",
      block: "lines",
      skill: "inzicht",
      type: "choice",
      prompt: "AE en BC hebben geen gemeenschappelijk punt en hebben verschillende richtingen. Hoe heten deze lijnen?",
      options: [
        {
          id: "a",
          text: "Evenwijdig."
        },
        {
          id: "b",
          text: "Kruisend."
        },
        {
          id: "c",
          text: "Snijdend."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Geen gedeeld punt en verschillende richtingen betekent hier kruisend. Voor evenwijdigheid moet de richting hetzelfde zijn.",
      hint: "Is alleen het ontbreken van een snijpunt genoeg voor evenwijdigheid?",
      highlights: [
        "AE",
        "BC"
      ]
    },
    {
      id: "probe-l2",
      block: "lines",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Twee verschillende lijnen hebben geen gemeenschappelijk punt. Welke extra informatie bewijst dat ze evenwijdig zijn?",
      options: [
        {
          id: "a",
          text: "Er is geen extra informatie nodig."
        },
        {
          id: "b",
          text: "Ze liggen in hetzelfde vlak."
        },
        {
          id: "c",
          text: "Ze hebben dezelfde kleur in de tekening."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Binnen \xE9\xE9n vlak zijn verschillende lijnen zonder snijpunt evenwijdig. Zonder die extra informatie kunnen ze ook kruisend zijn.",
      hint: "Denk aan het verschil tussen meetkunde in een vlak en in de ruimte."
    },
    {
      id: "retest-l1",
      block: "lines",
      skill: "inzicht",
      type: "choice",
      prompt: "Welke beschrijving van AD en BF is juist?",
      options: [
        {
          id: "a",
          text: "Evenwijdig: ze ontmoeten elkaar niet."
        },
        {
          id: "b",
          text: "Kruisend: geen gedeeld punt en verschillende richtingen."
        },
        {
          id: "c",
          text: "Snijdend: de lijnstukken zijn ribben van dezelfde kubus."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "AD ligt in het linkervlak, BF in het evenwijdige rechtervlak. Daardoor hebben ze geen gemeenschappelijk punt. AD heeft de diepterichting en BF de hoogterichting: de richtingen verschillen. Dus de lijnen zijn kruisend.",
      hint: "Onderzoek de twee voorwaarden afzonderlijk.",
      highlights: [
        "AD",
        "BF"
      ]
    },
    {
      id: "retest-l2",
      block: "lines",
      skill: "onderbouwen",
      type: "choice",
      prompt: "En hoe liggen AD en BC ten opzichte van elkaar?",
      options: [
        {
          id: "a",
          text: "Evenwijdig, want het zijn tegenoverliggende zijden van vierkant ABCD."
        },
        {
          id: "b",
          text: "Kruisend, want ze hebben geen gedeelde letter."
        },
        {
          id: "c",
          text: "Snijdend, want ze liggen in hetzelfde vlak."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Tegenoverliggende zijden van een vierkant hebben dezelfde richting en geen gemeenschappelijk punt.",
      hint: "Welk zijvlak bevat beide lijnen?",
      highlights: [
        "AD",
        "BC"
      ]
    },
    {
      id: "v1",
      block: "planes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "M is het midden van AB. Bepalen A, M en B precies \xE9\xE9n vlak?",
      options: [
        {
          id: "a",
          text: "Ja, want er zijn drie punten."
        },
        {
          id: "b",
          text: "Ja, want de punten liggen in een kubus."
        },
        {
          id: "c",
          text: "Nee, de drie punten liggen op \xE9\xE9n lijn."
        },
        {
          id: "d",
          text: "Nee, omdat M geen hoekpunt is."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "Elk vlak door lijn AB bevat ook M. Je kunt zulke vlakken om AB draaien; het vlak is niet uniek.",
      hint: "Welke voorwaarde hoort bij drie punten die \xE9\xE9n vlak bepalen?",
      highlights: [
        "AB"
      ],
      extraPoints: {
        M: [
          0.5,
          0,
          0
        ]
      }
    },
    {
      id: "v2",
      block: "planes",
      skill: "construeren",
      type: "points",
      prompt: "Lijn AB is gegeven. Kies \xE9\xE9n ander kubushoekpunt waarmee AB precies \xE9\xE9n vlak bepaalt. Het extra punt moet buiten AB liggen.",
      answer: [
        "C"
      ],
      selectCount: 1,
      explanation: "Elk van C, D, E, F, G en H ligt buiten AB en is geldig. De gekozen lijn en het punt erbuiten bepalen \xE9\xE9n vlak.",
      hint: "Zoek een punt dat niet op de gegeven lijn ligt.",
      acceptAny: [
        "C",
        "D",
        "E",
        "F",
        "G",
        "H"
      ],
      highlights: [
        "AB"
      ]
    },
    {
      id: "v3",
      block: "planes",
      skill: "construeren",
      type: "points",
      prompt: "Kies twee kubushoekpunten die samen de snijlijn van vlak ABG en vlak ADG bepalen.",
      answer: [
        "A",
        "G"
      ],
      selectCount: 2,
      explanation: "A en G liggen in beide verschillende vlakken. Daarom is de volledige lijn AG hun snijlijn.",
      hint: "Zoek twee verschillende punten die in beide vlakken liggen.",
      planes: [
        [
          "A",
          "B",
          "G",
          "H"
        ],
        [
          "A",
          "D",
          "G",
          "F"
        ]
      ]
    },
    {
      id: "v4",
      block: "planes",
      skill: "inzicht",
      type: "choice",
      prompt: "T ligt op het verlengde van AB voorbij B. Ligt T in vlak ABC?",
      options: [
        {
          id: "a",
          text: "Nee, T ligt buiten de kubus."
        },
        {
          id: "b",
          text: "Ja, de hele lijn AB ligt in vlak ABC."
        },
        {
          id: "c",
          text: "Alleen als AT kleiner is dan AC."
        },
        {
          id: "d",
          text: "Dat hangt van de kijkrichting af."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Vlak ABC loopt buiten de kubus door. De getekende vierhoek ABCD toont maar een begrensd stukje van dit vlak.",
      hint: "Waar eindigt een meetkundig vlak?",
      highlights: [
        "AB"
      ],
      planes: [
        [
          "A",
          "B",
          "C",
          "D"
        ]
      ],
      extraPoints: {
        T: [
          1.35,
          0,
          0
        ]
      }
    },
    {
      id: "probe-v1",
      block: "planes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "P, Q en R zijn drie verschillende punten op \xE9\xE9n rechte. Kunnen verschillende vlakken alle drie de punten bevatten?",
      options: [
        {
          id: "a",
          text: "Ja, je kunt een vlak om die rechte draaien."
        },
        {
          id: "b",
          text: "Nee, drie verschillende punten bepalen altijd \xE9\xE9n vlak."
        },
        {
          id: "c",
          text: "Nee, geen enkel vlak kan een hele rechte bevatten."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Alle vlakken door de rechte bevatten P, Q en R. Drie punten op \xE9\xE9n rechte bepalen dus geen uniek vlak.",
      hint: "Stel je een boek voor waarvan de rug de rechte is."
    },
    {
      id: "probe-v2",
      block: "planes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Je hebt lijn EF. Welk extra gegeven bepaalt daarmee precies \xE9\xE9n vlak?",
      options: [
        {
          id: "a",
          text: "Het midden van EF."
        },
        {
          id: "b",
          text: "Punt C."
        },
        {
          id: "c",
          text: "Beide gegevens werken."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "C ligt buiten EF en bepaalt samen met EF \xE9\xE9n vlak. Het midden van EF ligt al op de lijn en voegt geen richting toe.",
      hint: "Ligt het extra punt op of buiten de gegeven lijn?",
      highlights: [
        "EF"
      ]
    },
    {
      id: "retest-v1",
      block: "planes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "K is het midden van CG. Welke uitspraak is juist?",
      options: [
        {
          id: "a",
          text: "C, K en G bepalen \xE9\xE9n vlak; C, K en A niet."
        },
        {
          id: "b",
          text: "Beide drietallen bepalen \xE9\xE9n vlak."
        },
        {
          id: "c",
          text: "C, K en G bepalen geen uniek vlak; C, K en A wel."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "C, K en G liggen op \xE9\xE9n rechte. A ligt buiten die rechte en maakt het vlak door C, K en A uniek.",
      hint: "Zoek in elk drietal of de punten op \xE9\xE9n rechte liggen.",
      highlights: [
        "CG"
      ],
      extraPoints: {
        K: [
          1,
          1,
          0.5
        ]
      }
    },
    {
      id: "d1",
      block: "threeplanes",
      skill: "inzicht",
      type: "choice",
      prompt: "Bekijk vlak ABC, vlak EFG en vlak ABF. Welke twee snijlijnen levert vlak ABF op?",
      options: [
        {
          id: "a",
          text: "AB en EF; die zijn evenwijdig."
        },
        {
          id: "b",
          text: "AB en BF; die snijden in B."
        },
        {
          id: "c",
          text: "AE en BF; die zijn kruisend."
        },
        {
          id: "d",
          text: "Er zijn geen snijlijnen omdat ABC en EFG evenwijdig zijn."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Het ondervlak en bovenvlak zijn evenwijdig. Het voorvlak snijdt ze langs tegenoverliggende ribben AB en EF.",
      hint: "Bekijk eerst elk paar vlakken afzonderlijk.",
      planes: [
        [
          "A",
          "B",
          "C",
          "D"
        ],
        [
          "E",
          "F",
          "G",
          "H"
        ],
        [
          "A",
          "B",
          "F",
          "E"
        ]
      ]
    },
    {
      id: "d2",
      block: "threeplanes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Wat hebben vlak ABC, vlak ABF en vlak ABG alle drie gemeen?",
      options: [
        {
          id: "a",
          text: "Alleen punt A."
        },
        {
          id: "b",
          text: "Alleen de punten A en B."
        },
        {
          id: "c",
          text: "De hele lijn AB, want alle drie de vlakken bevatten A en B."
        },
        {
          id: "d",
          text: "Het hele vlak ABC."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "Alle drie bevatten A en B en dus de hele lijn AB. Het zijn drie verschillende vlakken.",
      hint: "Welke volledige lijn ligt in elk van de drie vlakken?",
      planes: [
        [
          "A",
          "B",
          "C",
          "D"
        ],
        [
          "A",
          "B",
          "F",
          "E"
        ],
        [
          "A",
          "B",
          "G",
          "H"
        ]
      ]
    },
    {
      id: "d3",
      block: "threeplanes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Wat hebben vlak ABC, vlak ABF en vlak ADH alle drie gemeen?",
      options: [
        {
          id: "a",
          text: "De hele lijn AB."
        },
        {
          id: "b",
          text: "Precies punt A."
        },
        {
          id: "c",
          text: "Geen enkel punt."
        },
        {
          id: "d",
          text: "Drie evenwijdige lijnen."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Onder- en voorvlak delen AB. Van die lijn ligt alleen A in het linkervlak ADH. De gezamenlijke doorsnede is precies A.",
      hint: "Vind eerst de doorsnede van twee vlakken en vergelijk die met het derde.",
      planes: [
        [
          "A",
          "B",
          "C",
          "D"
        ],
        [
          "A",
          "B",
          "F",
          "E"
        ],
        [
          "A",
          "D",
          "H",
          "E"
        ]
      ]
    },
    {
      id: "d4",
      block: "threeplanes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Vlak ABF, vlak BCG en vlak ACG snijden elkaar paarsgewijs langs BF, CG en AE. Wat geldt voor alle drie de vlakken samen?",
      options: [
        {
          id: "a",
          text: "Ze hebben \xE9\xE9n gemeenschappelijk punt."
        },
        {
          id: "b",
          text: "Ze hebben lijn BF gemeen."
        },
        {
          id: "c",
          text: "Ze hebben geen gemeenschappelijk punt."
        },
        {
          id: "d",
          text: "Ze vallen samen."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "BF, CG en AE zijn drie verschillende evenwijdige lijnen. Ze ontmoeten elkaar niet; er is geen punt dat in alle drie vlakken ligt.",
      hint: "Moet een gezamenlijk punt ook op alle paarsgewijze snijlijnen liggen?",
      planes: [
        [
          "A",
          "B",
          "F",
          "E"
        ],
        [
          "B",
          "C",
          "G",
          "F"
        ],
        [
          "A",
          "C",
          "G",
          "E"
        ]
      ]
    },
    {
      id: "probe-d1",
      block: "threeplanes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Drie verschillende vlakken bevatten allemaal dezelfde lijn l. Wat is hun gezamenlijke doorsnede?",
      options: [
        {
          id: "a",
          text: "Precies \xE9\xE9n punt."
        },
        {
          id: "b",
          text: "De hele lijn l."
        },
        {
          id: "c",
          text: "Geen enkel punt."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Alle punten van l liggen in elk van de vlakken. De gezamenlijke doorsnede is de lijn, niet \xE9\xE9n punt.",
      hint: "Wat betekent dat een heel vlak een lijn bevat?"
    },
    {
      id: "probe-d2",
      block: "threeplanes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "De drie paarsgewijze snijlijnen van drie vlakken zijn verschillend en evenwijdig. Kan er \xE9\xE9n punt in alle drie vlakken liggen?",
      options: [
        {
          id: "a",
          text: "Nee; dat punt zou op alle drie de parallelle snijlijnen moeten liggen."
        },
        {
          id: "b",
          text: "Ja; dat punt ligt dan buiten de tekening."
        },
        {
          id: "c",
          text: "Ja; drie vlakken delen altijd een punt."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Verschillende evenwijdige lijnen hebben ook buiten de tekening geen gemeenschappelijk punt. Een punt in alle drie vlakken zou op alle drie snijlijnen liggen.",
      hint: "Lijnen en vlakken zijn onbegrensd, maar evenwijdigheid blijft gelden."
    },
    {
      id: "retest-d1",
      block: "threeplanes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Wat hebben vlak EFG, vlak ABF en vlak BCG alle drie gemeen?",
      options: [
        {
          id: "a",
          text: "Precies punt F."
        },
        {
          id: "b",
          text: "De hele lijn EF."
        },
        {
          id: "c",
          text: "De hele lijn FG."
        },
        {
          id: "d",
          text: "Geen enkel punt."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Het bovenvlak en voorvlak delen EF. Van die lijn ligt alleen F in het rechtervlak BCG.",
      hint: "Snijd eerst twee vlakken en betrek daarna het derde.",
      planes: [
        [
          "E",
          "F",
          "G",
          "H"
        ],
        [
          "A",
          "B",
          "F",
          "E"
        ],
        [
          "B",
          "C",
          "G",
          "F"
        ]
      ]
    },
    {
      id: "retest-d2",
      block: "threeplanes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Wat hebben vlak ABC, vlak EFG en vlak BCG alle drie gemeen?",
      options: [
        {
          id: "a",
          text: "Precies punt C."
        },
        {
          id: "b",
          text: "De hele lijn CG."
        },
        {
          id: "c",
          text: "Geen enkel punt."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "Het ondervlak ABC en bovenvlak EFG zijn evenwijdig en verschillend. Geen punt ligt in beide, dus ook niet in alle drie.",
      hint: "Heeft ieder tweetal in deze opgave een gemeenschappelijk punt?",
      planes: [
        [
          "A",
          "B",
          "C",
          "D"
        ],
        [
          "E",
          "F",
          "G",
          "H"
        ],
        [
          "B",
          "C",
          "G",
          "F"
        ]
      ]
    },
    {
      id: "cp-p1",
      block: "projection",
      skill: "onderbouwen",
      type: "choice",
      prompt: "N ligt op EH met EN : NH = 1 : 2. E en H vallen in de parallelprojectie niet samen. Welke conclusie is geldig?",
      options: [
        {
          id: "a",
          text: "Het beeld van N ligt in het midden van EH."
        },
        {
          id: "b",
          text: "De beeldverhouding EN : NH blijft 1 : 2."
        },
        {
          id: "c",
          text: "De beeldverhouding wordt 1 : 4."
        },
        {
          id: "d",
          text: "N kan overal in het beeld liggen."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Beide delen liggen op dezelfde rechte. Ze worden met dezelfde factor weergegeven, dus de verhouding blijft 1 : 2.",
      hint: "Vergelijk de richting van de twee lijnstukken.",
      highlights: [
        "EH"
      ],
      extraPoints: {
        N: [
          0,
          0.3333333333333333,
          1
        ]
      }
    },
    {
      id: "cp-p2",
      block: "projection",
      skill: "inzicht",
      type: "choice",
      prompt: "Je maakt een rechterzijaanzicht door loodrecht op vlak BCGF te kijken, langs richting AB. Welk tweetal valt dan samen?",
      options: [
        {
          id: "a",
          text: "C en D."
        },
        {
          id: "b",
          text: "C en G."
        },
        {
          id: "c",
          text: "B en C."
        },
        {
          id: "d",
          text: "A en H."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "CD heeft dezelfde richting als AB. C en D liggen dus achter elkaar in deze kijkrichting.",
      hint: "Zoek twee punten met een verbindingslijn evenwijdig aan AB.",
      planes: [
        [
          "B",
          "C",
          "G",
          "F"
        ]
      ]
    },
    {
      id: "cp-l1",
      block: "lines",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Welke conclusie over AC en FH in de kubus is correct?",
      options: [
        {
          id: "a",
          text: "Snijdend, omdat de beelden van diagonalen elkaar kunnen kruisen."
        },
        {
          id: "b",
          text: "Evenwijdig, omdat beide lijnen diagonalen zijn."
        },
        {
          id: "c",
          text: "Kruisend: ze liggen in verschillende parallelle horizontale vlakken en hebben verschillende richtingen."
        },
        {
          id: "d",
          text: "Samenvallend, omdat beide lijnen door het midden van een zijvlak gaan."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "AC ligt in het ondervlak, FH in het evenwijdige bovenvlak. Ze delen geen punt. Hun richtingen zijn verschillend, dus ze zijn kruisend.",
      hint: "Onderzoek eerst de vlakken waarin de lijnen liggen en daarna hun richtingen.",
      highlights: [
        "AC",
        "FH"
      ]
    },
    {
      id: "cp-l2",
      block: "lines",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een student zegt: \u201CAH en BG zijn evenwijdig, want de getekende stukjes raken elkaar niet.\u201D Welke beoordeling klopt?",
      options: [
        {
          id: "a",
          text: "De conclusie is goed, maar de reden bewijst haar niet: gebruik dat ADHE en BCGF overeenkomstige parallelle vierkanten zijn."
        },
        {
          id: "b",
          text: "De reden is volledig: niet raken bewijst altijd evenwijdigheid."
        },
        {
          id: "c",
          text: "De conclusie is fout: AH en BG zijn kruisend."
        },
        {
          id: "d",
          text: "Er is geen ruimtelijk argument mogelijk."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "AH en BG zijn overeenkomstige diagonalen in parallelle zijvlakken en hebben dezelfde richting. Alleen niet raken is onvoldoende: dat kan ook bij kruisende lijnen.",
      hint: "Beoordeel de conclusie en de gegeven reden afzonderlijk.",
      highlights: [
        "AH",
        "BG"
      ]
    },
    {
      id: "cp-v1",
      block: "planes",
      skill: "construeren",
      type: "points",
      prompt: "Kies twee hoekpunten die de snijlijn bepalen van vlak EFG en vlak BCH.",
      answer: [
        "E",
        "H"
      ],
      selectCount: 2,
      explanation: "E en H liggen in beide verschillende vlakken. Hun snijlijn is daarom EH.",
      hint: "Welke twee punten van het bovenvlak liggen ook in vlak BCH?",
      planes: [
        [
          "E",
          "F",
          "G",
          "H"
        ],
        [
          "B",
          "C",
          "H",
          "E"
        ]
      ]
    },
    {
      id: "cp-v2",
      block: "planes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Twee verschillende evenwijdige lijnen l en m zijn gegeven. Bepalen zij precies \xE9\xE9n vlak?",
      options: [
        {
          id: "a",
          text: "Nee, omdat ze geen gemeenschappelijk punt hebben."
        },
        {
          id: "b",
          text: "Ja: neem twee punten op l en \xE9\xE9n punt op m; die drie punten liggen niet op \xE9\xE9n lijn."
        },
        {
          id: "c",
          text: "Alleen als de lijnen even lang zijn."
        },
        {
          id: "d",
          text: "Ja, maar alleen wanneer ze horizontaal getekend zijn."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Twee verschillende evenwijdige lijnen liggen in \xE9\xE9n vlak. Twee punten op de ene lijn en \xE9\xE9n op de andere bepalen dit vlak uniek.",
      hint: "Vertaal de gegevens naar drie punten die niet op \xE9\xE9n lijn liggen."
    },
    {
      id: "cp-d1",
      block: "threeplanes",
      skill: "inzicht",
      type: "points",
      prompt: "Vlak EFG, vlak CDH en vlak ADH hebben precies \xE9\xE9n punt gemeen. Kies dat punt.",
      answer: [
        "H"
      ],
      selectCount: 1,
      explanation: "Het bovenvlak, achtervlak en linkervlak ontmoeten elkaar precies in H.",
      hint: "Zoek eerst de snijlijn van twee vlakken en toets welke punten ook in het derde liggen.",
      planes: [
        [
          "E",
          "F",
          "G",
          "H"
        ],
        [
          "C",
          "D",
          "H",
          "G"
        ],
        [
          "A",
          "D",
          "H",
          "E"
        ]
      ]
    },
    {
      id: "cp-d2",
      block: "threeplanes",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Drie verschillende vlakken snijden elkaar paarsgewijs in drie verschillende lijnen. Twee van die snijlijnen zijn evenwijdig. Wat volgt?",
      options: [
        {
          id: "a",
          text: "De derde snijlijn snijdt de andere twee."
        },
        {
          id: "b",
          text: "De derde snijlijn is ook evenwijdig aan de andere twee."
        },
        {
          id: "c",
          text: "De drie vlakken delen precies \xE9\xE9n punt."
        },
        {
          id: "d",
          text: "De drie vlakken vallen samen."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Een snijpunt van twee paarsgewijze snijlijnen zou in alle drie vlakken liggen en dus ook op de derde snijlijn. Dat kan niet wanneer twee daarvan verschillend en evenwijdig zijn. De derde lijn is coplanair met elk van de andere en moet dus ook evenwijdig zijn.",
      hint: "Wat zou een snijpunt van twee snijlijnen betekenen voor het derde vlak?"
    }
  ],
  checkpointIds: [
    "cp-p1",
    "cp-p2",
    "cp-l1",
    "cp-l2",
    "cp-v1",
    "cp-v2",
    "cp-d1",
    "cp-d2"
  ]
};

// app/model.ts
var BANK = content_default;
var QUESTIONS = Object.fromEntries(BANK.questions.map((q) => [q.id, q]));
var SKILLS = ["inzicht", "construeren", "onderbouwen", "rekenen"];
function correctAnswer(q, a) {
  if (new Set(a).size !== a.length) return false;
  if (q.acceptAny?.length) return a.length === (q.selectCount || 1) && a.every((k) => q.acceptAny.includes(k));
  return a.length === q.answer.length && [...a].sort().join("|") === [...q.answer].sort().join("|");
}
function deriveProgress(events) {
  const answers = events.filter((e) => e.type === "answer");
  const evidence = {};
  for (const e of visibleEvidenceAnswers(events, BANK.checkpointIds)) {
    const id = e.payload.questionId, q = QUESTIONS[id];
    if (!q) continue;
    const old = evidence[id];
    const ok = correctAnswer(q, e.payload.answer);
    evidence[id] = { correct: !!old?.correct || ok, independent: !!old?.independent || !old && ok && !e.payload.helped, helped: !!old?.helped || e.payload.helped || !ok, tries: (old?.tries || 0) + 1 };
  }
  const complete = [...new Set(events.filter((e) => e.type === "block").map((e) => String(e.payload.blockId)))];
  const mainIds = BANK.blocks.flatMap((b) => b.questionIds), assessed = [...mainIds, ...BANK.checkpointIds];
  const skills = Object.fromEntries(SKILLS.map((s) => {
    const ids = assessed.filter((id) => QUESTIONS[id]?.skill === s);
    return [s, { total: ids.length, independent: ids.filter((id) => evidence[id]?.independent).length, helped: ids.filter((id) => evidence[id]?.correct && !evidence[id]?.independent).length }];
  }));
  const sessions = {};
  for (const a of answers.filter((e) => e.payload.context === "check" && BANK.checkpointIds.includes(e.payload.questionId))) (sessions[a.payload.sessionId] ??= []).push(a);
  const successfulCheck = Object.values(sessions).some((es2) => es2.length === BANK.checkpointIds.length && new Set(es2.map((e) => e.payload.questionId)).size === BANK.checkpointIds.length && es2.every((e) => correctAnswer(QUESTIONS[e.payload.questionId], e.payload.answer) && !e.payload.helped));
  const paper = events.filter((e) => e.type === "paper").at(-1);
  const paperDone = Array.isArray(paper?.payload.checks) && paper.payload.checks.length === 4;
  const workbench = events.filter((e) => e.type === "workbench" && e.payload.correct === true).at(-1);
  const rewarded = /* @__PURE__ */ new Set([...mainIds, ...BANK.blocks.flatMap((b) => b.retestIds)]);
  const xp = Object.entries(evidence).reduce((n, [id, v]) => n + (rewarded.has(id) && v.correct ? v.independent ? 20 : 10 : 0), 0) + complete.length * 30 + (workbench ? 60 : 0) + (paperDone ? 30 : 0) + (successfulCheck ? 100 : 0);
  return { answers, evidence, complete, skills, successfulCheck, paperDone, workbench, xp, level1Passed: complete.length === 4 && successfulCheck && paperDone };
}
function visibleEvidenceAnswers(events, checkpointIds) {
  const seen = /* @__PURE__ */ new Set();
  const answers = events.filter((e) => {
    if (e.type !== "answer" || seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  }), sessions = /* @__PURE__ */ new Map();
  for (const e of answers) if (e.payload.context === "check" && checkpointIds.includes(e.payload.questionId)) {
    const rows = sessions.get(e.payload.sessionId) || [];
    rows.push(e);
    sessions.set(e.payload.sessionId, rows);
  }
  const complete = new Set([...sessions].filter(([, rows]) => checkpointIds.every((id) => rows.some((e) => e.payload.questionId === id))).map(([id]) => id));
  return answers.filter((e) => e.payload.context !== "probe" && (e.payload.context !== "check" || complete.has(e.payload.sessionId)));
}

// app/geometry-math.ts
function parallelImage([x, y, z], view = "spatial", angle = 28, tilt = 24) {
  if (view === "front") return [x, -z];
  if (view === "top") return [x, -y];
  if (view === "right") return [y, -z];
  if (view === "scaled") return [4 * x + y, -Math.sqrt(3) * y - 3 * z];
  if (view === "equal-image") return [0.5 * x + 0.5 * y, -Math.sqrt(3) / 2 * y - 0.75 * z];
  const a = angle * Math.PI / 180, t = tilt * Math.PI / 180;
  return [Math.cos(a) * x + Math.sin(a) * y, Math.sin(t) * (Math.sin(a) * x - Math.cos(a) * y) - Math.cos(t) * z];
}
var CUBE = { A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0], E: [0, 0, 1], F: [1, 0, 1], G: [1, 1, 1], H: [0, 1, 1] };
var sub = (a, b) => a.map((x, i) => x - b[i]);
var add = (a, b) => a.map((x, i) => x + b[i]);
var mul = (a, s) => a.map((x) => x * s);
var dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
var cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
var distance = (a, b) => Math.sqrt(dot(sub(a, b), sub(a, b)));
function lineIntersection(a, b) {
  const u = sub(a.b, a.a), v = sub(b.b, b.a), w = sub(b.a, a.a), n = cross(u, v), den = dot(n, n);
  if (den < 1e-10 || Math.abs(dot(w, n)) > 1e-7) return null;
  const t = dot(cross(w, v), n) / den, p2 = add(a.a, mul(u, t));
  return p2.every(Number.isFinite) ? p2 : null;
}
function constructionBounds(points, lines) {
  const bounds = [...points, ...lines.flatMap((l) => [l.a, l.b])];
  const contains2 = (l, p2) => l.infinite || distance(p2, l.a) + distance(p2, l.b) - distance(l.a, l.b) < 1e-6;
  for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
    const p2 = lineIntersection(lines[i], lines[j]);
    if (p2 && contains2(lines[i], p2) && contains2(lines[j], p2)) bounds.push(p2);
  }
  return bounds;
}
function projectionFrame(points, width, height) {
  const xs = points.map((p2) => p2[0]), ys = points.map((p2) => p2[1]);
  const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
  return { center: [(xmin + xmax) / 2, (ymin + ymax) / 2], scale: Math.min(Math.max(1, width - 100) / Math.max(0.1, xmax - xmin), Math.max(1, height - 100) / Math.max(0.1, ymax - ymin)) };
}
function clipProjectedLine(a, b, width, height, padding = 18) {
  const d = b.map((v, i) => v - a[i]);
  let lo = -Infinity, hi = Infinity;
  if (Math.hypot(...d) < 1e-9) return null;
  for (let i = 0; i < 2; i++) {
    const min = padding, max = (i === 0 ? width : height) - padding;
    if (Math.abs(d[i]) < 1e-9) {
      if (a[i] < min || a[i] > max) return null;
      continue;
    }
    const t1 = (min - a[i]) / d[i], t2 = (max - a[i]) / d[i];
    lo = Math.max(lo, Math.min(t1, t2));
    hi = Math.min(hi, Math.max(t1, t2));
  }
  return lo > hi ? null : [a.map((v, i) => v + lo * d[i]), a.map((v, i) => v + hi * d[i])];
}

// app/workbench-math.ts
function initialPoints(variant) {
  return { ...CUBE, ...variant === 1 ? { P: [0, 0, 0.3], Q: [1, 0, 0.6], R: [1, 1, 0.8] } : { P: [0, 0, 0.4], Q: [1, 0, 0.7], R: [1, 1, 0.5] } };
}
function sectionPoints(variant) {
  const p2 = initialPoints(variant);
  return [p2.P, p2.Q, p2.R, [0, 1, p2.P[2] + p2.R[2] - p2.Q[2]]];
}
function pointOnSegment(p2, l) {
  return distance(p2, l.a) + distance(p2, l.b) - distance(l.a, l.b) < 1e-6;
}
function verifyWorkbench(input, points, variant) {
  if (!Array.isArray(input) || !points || typeof points !== "object") return false;
  const vec = (p2) => Array.isArray(p2) && p2.length === 3 && p2.every((x) => typeof x === "number" && Number.isFinite(x) && Math.abs(x) < 20);
  const valid = input.filter((l) => {
    if (!l || typeof l !== "object") return false;
    const v = l;
    return vec(v.a) && vec(v.b) && distance(v.a, v.b) > 1e-6 && !v.infinite;
  });
  const corners = sectionPoints(variant);
  return corners.every((a, i) => {
    const b = corners[(i + 1) % 4];
    return valid.some((l) => {
      const u = sub(l.b, l.a);
      return dot(cross(sub(a, l.a), u), cross(sub(a, l.a), u)) < 1e-10 && dot(cross(sub(b, l.a), u), cross(sub(b, l.a), u)) < 1e-10 && pointOnSegment(a, l) && pointOnSegment(b, l);
    });
  });
}

// app/route-progress.ts
function levelOneRoute(progress) {
  const questionIds = BANK.blocks.flatMap((block) => block.questionIds);
  const answered = questionIds.filter((id) => progress.evidence[id]).length;
  const blocks2 = BANK.blocks.filter((block) => progress.complete.includes(block.id)).length;
  const milestones = blocks2 + Number(progress.successfulCheck) + Number(progress.paperDone);
  const total = questionIds.length + BANK.blocks.length + 2;
  const completed = answered + milestones;
  const percent = progress.level1Passed ? 100 : Math.min(99, Math.floor(completed / total * 100));
  return { answered, blocks: blocks2, milestones, completed, total, percent };
}

// app/insight-scenes.ts
var COLORS = ["#ffa35e", "#56d8cd", "#b6a1ff"];
function lineExtensions(keys, points = CUBE) {
  return keys.flatMap((key, i) => {
    const a = points[key[0]], b = points[key[1]], u = sub(b, a), color = COLORS[i % 3];
    return [{ from: add(a, mul(u, -0.18)), to: a, color, dashed: true }, { from: b, to: add(b, mul(u, 0.18)), color, dashed: true }];
  });
}
var THREE_CASES = {
  line: { title: "E\xE9n lijn", planes: [["A", "B", "C", "D"], ["A", "B", "F", "E"], ["A", "B", "G", "H"]], names: ["ABC", "ABF", "ABG"], lines: ["AB"], pairs: ["ABC \u2229 ABF = AB", "ABC \u2229 ABG = AB", "ABF \u2229 ABG = AB"], selected: ["A", "B"], text: "Elk paar levert dezelfde snijlijn AB. Alle punten van die lijn liggen in alle drie vlakken." },
  point: { title: "E\xE9n punt", planes: [["A", "B", "C", "D"], ["A", "B", "F", "E"], ["A", "D", "H", "E"]], names: ["ABC", "ABF", "ADH"], lines: ["AB", "AD", "AE"], pairs: ["ABC \u2229 ABF = AB", "ABC \u2229 ADH = AD", "ABF \u2229 ADH = AE"], selected: ["A"], text: "De eerste twee vlakken delen AB. Alleen A van die lijn ligt ook in ADH. Samen delen de drie vlakken precies A." },
  none: { title: "Geen punt", planes: [["A", "B", "F", "E"], ["B", "C", "G", "F"], ["A", "C", "G", "E"]], names: ["ABF", "BCG", "ACG"], lines: ["BF", "CG", "AE"], pairs: ["ABF \u2229 BCG = BF", "BCG \u2229 ACG = CG", "ACG \u2229 ABF = AE"], selected: [], text: "Elk paar snijdt, maar langs een andere verticale lijn. BF, CG en AE zijn evenwijdig; geen punt ligt op alle drie." }
};
var WORKED_SECTION = { P: [0, 0, 0.25], Q: [1, 0, 0.5], R: [1, 1, 0.75], S: [0, 1, 0.5] };

// app/question-visuals.ts
function questionGeometry(q, reveal = false, answer = []) {
  let points = { ...q.extraPoints || {} }, highlights = [...q.highlights || []], planes = (q.planes || []).map((p2) => [...p2]);
  let selected = [], segments = [];
  let view = "spatial";
  let dimensions = [1, 1, 1];
  if (!reveal) {
    if (q.id === "p2") delete points.M;
    if (q.id === "cp-p1") delete points.N;
  }
  if (q.id === "p1" || q.id === "probe-p1") view = "scaled";
  if (q.id === "retest-p1") {
    view = "equal-image";
    dimensions = [8, 4, 4];
    highlights = ["AB", "AD"];
  }
  if (q.id === "v4") segments = [{ from: CUBE.B, to: points.T, color: "#ffa35e", dashed: true }];
  if (q.id === "probe-v2") points = { M: [0.5, 0, 1] };
  if (reveal) {
    const lines = { p2: ["AM", "MG"], "cp-p1": ["EN", "NH"], l2: ["AF", "BE"], l4: ["AB", "HG", "DC"], "retest-l2": ["AD", "BC"], "cp-l1": ["AC", "FH"], "cp-l2": ["AH", "BG"], v3: ["AG"], "cp-v1": ["EH"], d1: ["AB", "EF"], d2: ["AB"], d3: ["AB", "AD", "AE"], d4: ["BF", "CG", "AE"], "retest-d1": ["EF", "FG", "BF"], "retest-d2": ["BC", "FG"], "cp-d1": ["GH", "EH", "DH"] };
    if (lines[q.id]) highlights = lines[q.id];
    const addedPlanes = { l4: [["A", "B", "C", "D"], ["D", "C", "G", "H"]], "retest-l2": [["A", "B", "C", "D"]], "cp-l1": [["A", "B", "C", "D"], ["E", "F", "G", "H"]], "cp-l2": [["A", "D", "H", "E"], ["B", "C", "G", "F"]], "probe-v2": [["E", "F", "C", "D"]], "retest-v1": [["A", "C", "G", "E"]] };
    if (addedPlanes[q.id]) planes = addedPlanes[q.id];
    const pointMap = { p2: ["M"], "cp-p1": ["N"], l2: ["I"], v3: ["A", "G"], "cp-v1": ["E", "H"], d2: ["A", "B"], d3: ["A"], "retest-d1": ["F"], "cp-d1": ["H"], "probe-v2": ["C"] };
    selected = pointMap[q.id] || [];
    if (q.id === "l2") points.I = [0.5, 0, 0.5];
    if (q.id === "v2") {
      const chosen = q.acceptAny?.includes(answer[0]) ? answer[0] : "C";
      planes = ["C", "D"].includes(chosen) ? [["A", "B", "C", "D"]] : ["E", "F"].includes(chosen) ? [["A", "B", "F", "E"]] : [["A", "B", "G", "H"]];
      selected = [chosen];
      highlights = ["AB"];
    }
    if (q.id === "p5") view = "front";
    if (q.id === "p6") view = "top";
    if (q.id === "cp-p2") view = "right";
    if (["v3", "cp-v1", "d1", "d2", "d3", "d4", "retest-d1", "retest-d2", "cp-d1", "l2", "cp-l1", "cp-l2"].includes(q.id)) segments = lineExtensions(highlights, { ...CUBE, ...points });
  }
  return { points, highlights, planes, selected, segments, view, dimensions };
}

// scripts/check-learning.mjs
var bank = JSON.parse(readFileSync("app/content.json", "utf8"));
assert.equal(bank.questions.length, 41);
assert.equal(new Set(bank.questions.map((q) => q.id)).size, 41);
for (const b of bank.blocks) {
  for (const id of [...b.questionIds, ...b.probeIds, ...b.retestIds]) assert.ok(QUESTIONS[id]);
  assert.equal(b.probeIds.length, 2);
  b.probeIds.forEach((id, i) => assert.equal(correctAnswer(QUESTIONS[id], [b.misconception.probeWrongAnswers[i]]), false));
}
for (const q of bank.questions) {
  assert.equal(correctAnswer(q, q.answer), true, q.id);
  for (const plane of q.planes || []) {
    const ps = plane.map((p2) => ({ ...CUBE, ...q.extraPoints })[p2]);
    assert.ok(ps.every(Boolean), q.id);
    const normal2 = cross(sub(ps[1], ps[0]), sub(ps[2], ps[0]));
    for (const p2 of ps) assert.ok(Math.abs(dot(sub(p2, ps[0]), normal2)) < 1e-8, q.id + " nonplanar");
  }
}
assert.equal(correctAnswer(QUESTIONS.v2, ["H"]), true);
assert.equal(correctAnswer(QUESTIONS.v2, ["A"]), false);
assert.equal(correctAnswer(QUESTIONS.v3, ["G", "A"]), true);
var mk = (id, answer, helped = false, context = "practice", sessionId = "session-1") => ({ id: crypto.randomUUID(), type: "answer", at: Date.now(), payload: { questionId: id, answer, helped, context, sessionId, correct: correctAnswer(QUESTIONS[id], answer) } });
var es = [mk("p1", ["a"]), mk("p1", QUESTIONS.p1.answer)];
var p = deriveProgress(es);
assert.equal(p.evidence.p1.independent, false);
assert.equal(p.evidence.p1.correct, true);
assert.equal(p.xp, 10);
es.push(mk("p1", QUESTIONS.p1.answer));
assert.equal(deriveProgress(es).xp, 10);
var probes = bank.blocks[0].probeIds.map((id) => mk(id, QUESTIONS[id].answer, false, "probe"));
assert.equal(deriveProgress(probes).xp, 0, "Probes must not leak correctness via XP");
var cps = bank.checkpointIds.map((id) => mk(id, QUESTIONS[id].answer, false, "check"));
assert.equal(deriveProgress(cps.slice(0, -1)).xp, 0, "No XP clue during checkpoint");
assert.equal(deriveProgress(cps).successfulCheck, true);
assert.equal(deriveProgress(cps).level1Passed, false, "Checkpoint alone is not a level pass");
var mixed = [...cps, { id: "block-projection", type: "block", at: 1, payload: { blockId: "projection" } }];
assert.equal(deriveProgress(mixed).level1Passed, false);
var all = [...cps, ...bank.blocks.map((b) => ({ id: b.id, type: "block", at: 1, payload: { blockId: b.id } })), { id: "paper-complete", type: "paper", at: 1, payload: { checks: ["figure", "relations", "intersection", "reason"] } }];
assert.equal(deriveProgress(all).level1Passed, true);
assert.equal(lineIntersection({ id: "a", name: "AE", a: CUBE.A, b: CUBE.E }, { id: "b", name: "BC", a: CUBE.B, b: CUBE.C }), null, "A crossing in the image is not a 3D intersection");
for (const variant of [0, 1]) {
  const ps = initialPoints(variant), corners = sectionPoints(variant);
  const parallel = { id: "parallel", name: "l", a: ps.R, b: add(ps.R, sub(ps.Q, ps.P)), infinite: true };
  const side = { id: "side", name: "DH", a: ps.D, b: ps.H };
  const s = lineIntersection(parallel, side);
  assert.ok(s && distance(s, corners[3]) < 1e-8);
  const alternative = lineIntersection({ id: "alt", name: "l2", a: ps.P, b: add(ps.P, sub(ps.R, ps.Q)), infinite: true }, side);
  assert.ok(alternative && distance(alternative, corners[3]) < 1e-8);
  const edges = corners.map((a, i) => ({ id: String(i), name: String(i), a, b: corners[(i + 1) % 4] }));
  assert.equal(verifyWorkbench(edges, { ...ps, S: s }, variant), true);
  assert.equal(verifyWorkbench(edges.slice(0, 3), ps, variant), false);
  const triangle = [ps.P, ps.Q, ps.R].map((a, i, arr) => ({ id: String(i), name: String(i), a, b: arr[(i + 1) % 3] }));
  assert.equal(verifyWorkbench(triangle, ps, variant), false, "A triangle through PQR is not the cube section");
}
assert.equal(verifyWorkbench([null, { a: [NaN, 0, 0], b: [1, 1, 1] }], {}, 0), false);
var route = (events) => levelOneRoute(deriveProgress(events));
assert.equal(route([]).percent, 0);
assert.equal(route([mk("p1", ["a"])]).percent, route([mk("p1", QUESTIONS.p1.answer)]).percent, "Practice coverage does not reveal correctness");
assert.equal(route(es).completed, 1, "Repeating a question cannot inflate route coverage");
assert.equal(route(probes).percent, 0, "Diagnostic answers do not move the route");
assert.equal(route(cps.slice(0, -1)).percent, 0, "Incomplete checkpoint reveals no result via the route");
var attempted = bank.blocks.flatMap((b) => b.questionIds).map((id) => mk(id, []));
var blocks = bank.blocks.map((b) => ({ id: b.id, type: "block", at: 1, payload: { blockId: b.id } }));
assert.ok(route([...attempted, ...blocks]).percent < 100, "Practice alone must never look like a completed level");
assert.equal(route([...attempted, ...all]).percent, 100);
var near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
var length2 = (p2) => Math.hypot(...p2);
var pi = (p2, view) => parallelImage(p2, view);
for (const [view, pairs] of [["front", ["AD", "BC", "EH", "FG"]], ["top", ["AE", "BF", "CG", "DH"]], ["right", ["AB", "CD", "EF", "GH"]]]) {
  for (const pair of pairs) assert.deepEqual(pi(CUBE[pair[0]], view), pi(CUBE[pair[1]], view));
}
near(length2(pi(CUBE.B, "scaled")), 4);
near(length2(pi(CUBE.D, "scaled")), 2);
near(length2(pi(CUBE.E, "scaled")), 3);
near(length2(pi([8, 0, 0], "equal-image")), 4);
near(length2(pi([0, 4, 0], "equal-image")), 4);
near(dot(CUBE.F, CUBE.H) / distance(CUBE.A, CUBE.F) / distance(CUBE.A, CUBE.H), 0.5);
for (const scene of Object.values(THREE_CASES)) for (const plane of scene.planes) {
  const ps = plane.map((k) => CUBE[k]), normal2 = cross(sub(ps[1], ps[0]), sub(ps[2], ps[0]));
  for (const point of ps) near(dot(normal2, sub(point, ps[0])), 0);
}
var contains = (plane, p2) => {
  const ps = plane.map((k) => CUBE[k]);
  return Math.abs(dot(cross(sub(ps[1], ps[0]), sub(ps[2], ps[0])), sub(p2, ps[0]))) < 1e-8;
};
for (const plane of THREE_CASES.line.planes) {
  assert.ok(contains(plane, CUBE.A));
  assert.ok(contains(plane, CUBE.B));
}
for (const plane of THREE_CASES.point.planes) assert.ok(contains(plane, CUBE.A));
assert.equal(THREE_CASES.none.planes.every((plane) => contains(plane, CUBE.B)), false);
for (const angle of [0, 15, 35, 45, 90]) {
  const t = angle * Math.PI / 180, u = [0, Math.cos(t), Math.sin(t)], n = cross([1, 0, 0], u);
  near(dot(n, [0.5, 0, 0]), 0);
  assert.equal(Math.abs(dot(n, CUBE.C)) < 1e-8, angle === 0);
}
var wp = WORKED_SECTION;
var normal = cross(sub(wp.Q, wp.P), sub(wp.R, wp.P));
near(dot(normal, sub(wp.S, wp.P)), 0);
near(dot(cross(sub(wp.Q, wp.P), sub(wp.R, wp.S)), cross(sub(wp.Q, wp.P), sub(wp.R, wp.S))), 0);
for (const q of bank.questions) for (const reveal of [false, true]) {
  const v = questionGeometry(q, reveal), points = { ...CUBE, ...v.points };
  for (const line of v.highlights) assert.ok(points[line[0]] && points[line[1]], q.id + " missing line point");
  for (const plane of v.planes) {
    const ps = plane.map((k) => points[k]);
    assert.ok(ps.every(Boolean));
    const n = cross(sub(ps[1], ps[0]), sub(ps[2], ps[0]));
    for (const p2 of ps) near(dot(n, sub(p2, ps[0])), 0);
  }
}
assert.equal(questionGeometry(QUESTIONS.p2).points.M, void 0);
assert.ok(questionGeometry(QUESTIONS.p2, true).points.M);
assert.equal(questionGeometry(QUESTIONS["cp-p1"]).points.N, void 0);
assert.equal(questionGeometry(QUESTIONS.l4).highlights.includes("DC"), false);
assert.ok(questionGeometry(QUESTIONS.l4, true).highlights.includes("DC"));
assert.equal(questionGeometry(QUESTIONS["retest-l2"]).planes.length, 0);
for (const id of ["v3", "cp-v1"]) assert.equal(questionGeometry(QUESTIONS[id]).highlights.length, 0);
assert.equal(questionGeometry(QUESTIONS.p5).view, "spatial");
assert.equal(questionGeometry(QUESTIONS.p5, true).view, "front");
for (const chosen of QUESTIONS.v2.acceptAny) {
  const visual = questionGeometry(QUESTIONS.v2, true, [chosen]);
  assert.ok(visual.planes[0].includes(chosen));
  assert.deepEqual(visual.selected, [chosen]);
}
assert.ok(bank.blocks.every((b) => b.theory.every((t) => t.example) && b.repair.example));
for (const variant of [0, 1]) {
  const ps = initialPoints(variant);
  const line = (a, b, infinite = true) => ({ id: a + b, name: a + b, a: ps[a], b: ps[b], infinite });
  const lines = [line("P", "Q"), line("A", "B"), line("Q", "R"), line("B", "C")];
  const left = lineIntersection(lines[0], lines[1]), right = lineIntersection(lines[2], lines[3]);
  assert.ok(left && right);
  const bounds = constructionBounds(Object.values(ps), lines);
  for (const target of [left, right]) assert.ok(bounds.some((p2) => distance(p2, target) < 1e-8));
  const unextended = constructionBounds(Object.values(ps), lines.map((l) => ({ ...l, infinite: false })));
  for (const target of [left, right]) assert.ok(!unextended.some((p2) => distance(p2, target) < 1e-8), "Unextended segments must not disclose a future intersection");
  for (const width of [280, 320, 440, 800]) for (const camera of [[28, 24], [-60, 40], [70, 15]]) {
    const raw = (p2) => parallelImage(p2, "spatial", ...camera), height = width < 390 ? 310 : 390;
    const { center, scale } = projectionFrame(bounds.map(raw), width, height);
    const project = (p2) => raw(p2).map((v, i) => (i === 0 ? width : height) / 2 + (v - center[i]) * scale);
    for (const p2 of bounds) {
      const [x, y] = project(p2);
      assert.ok(x >= 49.99 && x <= width - 49.99 && y >= 49.99 && y <= height - 49.99, "Construction point has a visible margin");
    }
    for (const l of lines) {
      const ends = clipProjectedLine(project(l.a), project(l.b), width, height);
      assert.ok(ends);
      for (const [x, y] of ends) assert.ok(x >= 17.99 && x <= width - 17.99 && y >= 17.99 && y <= height - 17.99);
    }
    for (const [target, pair] of [[left, lines.slice(0, 2)], [right, lines.slice(2)]]) for (const l of pair) {
      const [a, b] = clipProjectedLine(project(l.a), project(l.b), width, height), p2 = project(target);
      const distance2 = (u, v) => Math.hypot(u[0] - v[0], u[1] - v[1]);
      assert.ok(Math.abs(distance2(a, p2) + distance2(p2, b) - distance2(a, b)) < 1e-6);
    }
  }
}
assert.ok(lineIntersection({ a: [0, 0, 1], b: [1, 0, 0.99] }, { a: [0, 0, 0], b: [1, 0, 0] })?.[0] > 99, "A remote intersection is still an intersection");
assert.equal(clipProjectedLine([20, 20], [20, 20], 320, 310), null);
console.log("Construction framing checks passed: both variants, external intersections, 4 widths and 3 cameras; no premature points.");
console.log("Learning checks passed: 41 questions, 16 theory examples, 4 visual repair routes, projection/plane geometry and unrevealed answers, scoring, route progress, checkpoint gates and both valid construction routes in both variants.");

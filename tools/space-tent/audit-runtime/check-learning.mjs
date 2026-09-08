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

// app/course-content.json
var course_content_default = {
  blocks: [
    {
      id: "l2-hulpvlak",
      level: 2,
      title: "Een lijn ontmoet een vlak",
      subtitle: "Kies een hulpvlak en verantwoord elke stap.",
      theory: [
        {
          title: "Maak van ruimte een vlakprobleem",
          text: "Wil je AG \u2229 BDE vinden? Neem eerst een hulpvlak dat de gehele lijn AG bevat, bijvoorbeeld ACGE. Je kunt daarna binnen dat hulpvlak verder construeren.",
          scene: {
            caption: "ACGE bevat AG. K is het midden van BD; E en K liggen in beide vlakken.",
            showCube: true,
            points: {
              K: [
                0.5,
                0.5,
                0
              ]
            },
            highlights: [
              "AG",
              "EK"
            ],
            planes: [
              [
                "A",
                "C",
                "G",
                "E"
              ],
              [
                "B",
                "D",
                "E"
              ]
            ]
          }
        },
        {
          title: "Twee gemeenschappelijke punten",
          text: "K = AC \u2229 BD en E liggen in ACGE \xE9n BDE. Daarom is EK de snijlijn van deze twee vlakken. Een lijn-vlaksnijding wordt nu een snijding van twee lijnen in \xE9\xE9n vlak.",
          scene: {
            caption: "ACGE bevat AG. K is het midden van BD; E en K liggen in beide vlakken.",
            showCube: true,
            points: {
              K: [
                0.5,
                0.5,
                0
              ]
            },
            highlights: [
              "AG",
              "EK"
            ],
            planes: [
              [
                "A",
                "C",
                "G",
                "E"
              ],
              [
                "B",
                "D",
                "E"
              ]
            ]
          }
        },
        {
          title: "Controleer de betekenis van het snijpunt",
          text: "S = AG \u2229 EK ligt op AG en in BDE. Een kruising van getekende lijnen alleen is geen bewijs: hun ruimtelijke ligging moet de constructie rechtvaardigen.",
          scene: {
            caption: "S = AG \u2229 EK ligt in vlak BDE. De gelijke co\xF6rdinaten van S zijn elk \u2153 van de kubusribbe.",
            showCube: true,
            points: {
              K: [
                0.5,
                0.5,
                0
              ],
              S: [
                0.3333333333333333,
                0.3333333333333333,
                0.3333333333333333
              ]
            },
            highlights: [
              "AG",
              "EK"
            ],
            planes: [
              [
                "B",
                "D",
                "E"
              ]
            ]
          }
        }
      ],
      questionIds: [
        "l2-hulpvlak-1",
        "l2-hulpvlak-2",
        "l2-hulpvlak-3",
        "l2-hulpvlak-4"
      ],
      probeIds: [
        "l2-hulpvlak-p1",
        "l2-hulpvlak-p2"
      ],
      retestIds: [
        "l2-hulpvlak-r1",
        "l2-hulpvlak-r2"
      ],
      misconception: {
        label: "Een hulpvlak hoeft de onderzochte lijn niet te bevatten",
        trigger: {
          qid: "l2-hulpvlak-1",
          wrongAnswer: "a"
        },
        probeWrongAnswers: [
          "c",
          "b"
        ]
      },
      repair: {
        title: "Het hulpvlak draagt de hele lijn",
        text: "Controleer eerst beide punten van de lijn. In het voorbeeld bevat ACGE zowel A als G. Pas daarna teken je EK = ACGE \u2229 BDE en vind je S = AG \u2229 EK. ABCD snijdt BDE wel, maar bevat AG niet en levert dus niet deze constructie.",
        scene: {
          caption: "S = AG \u2229 EK ligt in vlak BDE. De gelijke co\xF6rdinaten van S zijn elk \u2153 van de kubusribbe.",
          showCube: true,
          points: {
            K: [
              0.5,
              0.5,
              0
            ],
            S: [
              0.3333333333333333,
              0.3333333333333333,
              0.3333333333333333
            ]
          },
          highlights: [
            "AG",
            "EK"
          ],
          planes: [
            [
              "B",
              "D",
              "E"
            ]
          ]
        }
      }
    },
    {
      id: "l2-doorsnede",
      level: 2,
      title: "De rand van een doorsnede",
      subtitle: "Van gegeven punten naar een gesloten veelhoek.",
      theory: [
        {
          title: "Verbind binnen \xE9\xE9n zijvlak",
          text: "P en Q liggen beide in ABFE: teken PQ. Q en R liggen beide in BCGF: teken QR. Verbind niet automatisch elk paar gegeven punten als randzijde.",
          scene: {
            caption: "PQ ligt in ABFE; QR ligt in BCGF. PR is geen rand in een zijvlak.",
            showCube: true,
            points: {
              P: [
                0,
                0,
                0.25
              ],
              Q: [
                1,
                0,
                0.5
              ],
              R: [
                1,
                1,
                0.75
              ]
            },
            highlights: [
              "PQ",
              "QR"
            ]
          }
        },
        {
          title: "Gebruik evenwijdige vlakken",
          text: "BCGF en ADHE zijn evenwijdig. Hun snijlijnen met het doorsnedevlak zijn dus evenwijdig. Teken door P een lijn evenwijdig aan QR; die ontmoet DH in S.",
          scene: {
            caption: "De doorsnede is PQRS; S is het midden van DH. PS \u2225 QR en PQ \u2225 SR.",
            showCube: true,
            points: {
              P: [
                0,
                0,
                0.25
              ],
              Q: [
                1,
                0,
                0.5
              ],
              R: [
                1,
                1,
                0.75
              ],
              S: [
                0,
                1,
                0.5
              ]
            },
            highlights: [
              "PQ",
              "QR",
              "RS",
              "SP"
            ],
            planes: [
              [
                "P",
                "Q",
                "R",
                "S"
              ]
            ]
          }
        },
        {
          title: "Sluit en controleer de rand",
          text: "Verbind S met R in het achtervlak. De rand is P\u2013Q\u2013R\u2013S\u2013P. Elk randstuk ligt in een zijvlak; PR ligt binnen de veelhoek en is daarom een diagonaal.",
          scene: {
            caption: "De doorsnede is PQRS; S is het midden van DH. PS \u2225 QR en PQ \u2225 SR.",
            showCube: true,
            points: {
              P: [
                0,
                0,
                0.25
              ],
              Q: [
                1,
                0,
                0.5
              ],
              R: [
                1,
                1,
                0.75
              ],
              S: [
                0,
                1,
                0.5
              ]
            },
            highlights: [
              "PQ",
              "QR",
              "RS",
              "SP"
            ],
            planes: [
              [
                "P",
                "Q",
                "R",
                "S"
              ]
            ]
          }
        }
      ],
      questionIds: [
        "l2-doorsnede-1",
        "l2-doorsnede-2",
        "l2-doorsnede-3",
        "l2-doorsnede-4"
      ],
      probeIds: [
        "l2-doorsnede-p1",
        "l2-doorsnede-p2"
      ],
      retestIds: [
        "l2-doorsnede-r1",
        "l2-doorsnede-r2"
      ],
      misconception: {
        label: "Drie gegeven punten vormen automatisch de volledige doorsnederand",
        trigger: {
          qid: "l2-doorsnede-1",
          wrongAnswer: "c"
        },
        probeWrongAnswers: [
          "a",
          "b"
        ]
      },
      repair: {
        title: "Drie punten bepalen het vlak, niet het aantal zijden",
        text: "Het doorsnedevlak door P, Q en R raakt ook ribbe DH in S. Alleen lijnen in zijvlakken behoren tot de rand. Loop P\u2013Q\u2013R\u2013S\u2013P langs en noem bij elk stuk het bijbehorende zijvlak.",
        scene: {
          caption: "De doorsnede is PQRS; S is het midden van DH. PS \u2225 QR en PQ \u2225 SR.",
          showCube: true,
          points: {
            P: [
              0,
              0,
              0.25
            ],
            Q: [
              1,
              0,
              0.5
            ],
            R: [
              1,
              1,
              0.75
            ],
            S: [
              0,
              1,
              0.5
            ]
          },
          highlights: [
            "PQ",
            "QR",
            "RS",
            "SP"
          ],
          planes: [
            [
              "P",
              "Q",
              "R",
              "S"
            ]
          ]
        }
      }
    },
    {
      id: "l2-buiten",
      level: 2,
      title: "Verder dan de kubusrand",
      subtitle: "Gebruik verlengde lijnen zonder schijnsnijpunten.",
      theory: [
        {
          title: "Een lijn is onbeperkt",
          text: "M ligt halverwege AE. De zichtbare lijnstukken GM en AC raken niet, maar hun volledige lijnen liggen in hetzelfde diagonaalvlak en snijden buiten de kubus in X.",
          scene: {
            caption: "X ligt buiten de kubus, voorbij A op AC. GM en AC snijden in X.",
            showCube: true,
            points: {
              M: [
                0,
                0,
                0.5
              ],
              X: [
                -1,
                -1,
                0
              ]
            },
            highlights: [
              "GM",
              "AC"
            ],
            segments: [
              {
                from: [
                  0,
                  0,
                  0.5
                ],
                to: [
                  -1.1,
                  -1.1,
                  -0.05
                ],
                color: "#ffab66",
                dashed: true
              },
              {
                from: [
                  0,
                  0,
                  0
                ],
                to: [
                  -1.1,
                  -1.1,
                  0
                ],
                color: "#66d9ca",
                dashed: true
              }
            ]
          }
        },
        {
          title: "Buitenpunten blijven bruikbaar",
          text: "X ligt zowel in het grondvlak als in elk vlak dat de volledige lijn GM bevat. Als je een tweede gemeenschappelijk grondvlakpunt hebt, bepalen deze punten de snijlijn, ook wanneer zij buiten het lichaam liggen.",
          scene: {
            caption: "X ligt buiten de kubus, voorbij A op AC. GM en AC snijden in X.",
            showCube: true,
            points: {
              M: [
                0,
                0,
                0.5
              ],
              X: [
                -1,
                -1,
                0
              ]
            },
            highlights: [
              "GM",
              "AC"
            ],
            segments: [
              {
                from: [
                  0,
                  0,
                  0.5
                ],
                to: [
                  -1.1,
                  -1.1,
                  -0.05
                ],
                color: "#ffab66",
                dashed: true
              },
              {
                from: [
                  0,
                  0,
                  0
                ],
                to: [
                  -1.1,
                  -1.1,
                  0
                ],
                color: "#66d9ca",
                dashed: true
              }
            ]
          }
        },
        {
          title: "Reken in het gemeenschappelijke vlak",
          text: "Omdat AM \u2225 CG zijn de driehoeken XAM en XCG gelijkvormig. Met M halverwege AE geldt XA/XC = 1/2. A ligt tussen X en C, dus XC = XA + AC en XA = AC. Controleer eerst de gemeenschappelijke vlakligging voordat je zo\u2019n verhouding gebruikt.",
          scene: {
            caption: "X ligt buiten de kubus, voorbij A op AC. GM en AC snijden in X.",
            showCube: true,
            points: {
              M: [
                0,
                0,
                0.5
              ],
              X: [
                -1,
                -1,
                0
              ]
            },
            highlights: [
              "GM",
              "AC"
            ],
            segments: [
              {
                from: [
                  0,
                  0,
                  0.5
                ],
                to: [
                  -1.1,
                  -1.1,
                  -0.05
                ],
                color: "#ffab66",
                dashed: true
              },
              {
                from: [
                  0,
                  0,
                  0
                ],
                to: [
                  -1.1,
                  -1.1,
                  0
                ],
                color: "#66d9ca",
                dashed: true
              }
            ]
          }
        }
      ],
      questionIds: [
        "l2-buiten-1",
        "l2-buiten-2",
        "l2-buiten-3",
        "l2-buiten-4"
      ],
      probeIds: [
        "l2-buiten-p1",
        "l2-buiten-p2"
      ],
      retestIds: [
        "l2-buiten-r1",
        "l2-buiten-r2"
      ],
      misconception: {
        label: "Een snijpunt buiten het lichaam bestaat niet",
        trigger: {
          qid: "l2-buiten-1",
          wrongAnswer: "a"
        },
        probeWrongAnswers: [
          "b",
          "b"
        ]
      },
      repair: {
        title: "Verleng het wiskundige object",
        text: "Het getekende AC is een diagonaal lijnstuk; de lijn AC loopt in beide richtingen door. Hetzelfde geldt voor GM. Binnen ACGE vind je X. Het buitenpunt is geldig voor de constructie, zonder dat het een hoekpunt van de uiteindelijke doorsnede hoeft te zijn.",
        scene: {
          caption: "X ligt buiten de kubus, voorbij A op AC. GM en AC snijden in X.",
          showCube: true,
          points: {
            M: [
              0,
              0,
              0.5
            ],
            X: [
              -1,
              -1,
              0
            ]
          },
          highlights: [
            "GM",
            "AC"
          ],
          segments: [
            {
              from: [
                0,
                0,
                0.5
              ],
              to: [
                -1.1,
                -1.1,
                -0.05
              ],
              color: "#ffab66",
              dashed: true
            },
            {
              from: [
                0,
                0,
                0
              ],
              to: [
                -1.1,
                -1.1,
                0
              ],
              color: "#66d9ca",
              dashed: true
            }
          ]
        }
      }
    },
    {
      id: "l2-gelijkvormig",
      level: 2,
      title: "Gelijkvormigheid als meetgereedschap",
      subtitle: "Koppel overeenkomstige zijden en kies de richting.",
      theory: [
        {
          title: "Eerst de overeenkomst",
          text: "PQ \u2225 BC. De driehoeken APQ en ABC hebben overeenkomstige hoeken; P hoort bij B en Q bij C. Daarom horen AP bij AB, AQ bij AC en PQ bij BC.",
          scene: {
            caption: "AB = 6 cm, AC = 8 cm; P is het midden van AB en PQ \u2225 BC.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                0,
                8,
                0
              ],
              P: [
                3,
                0,
                0
              ],
              Q: [
                0,
                4,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA",
              "PQ"
            ],
            view: "top"
          }
        },
        {
          title: "De factor heeft een richting",
          text: "AB = 6 en AP = 3. Van ABC naar APQ is k = 3/6 = 1/2. Terug van APQ naar ABC is de factor 2. Noteer de richting voordat je vermenigvuldigt.",
          scene: {
            caption: "AB = 6 cm, AC = 8 cm; P is het midden van AB en PQ \u2225 BC.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                0,
                8,
                0
              ],
              P: [
                3,
                0,
                0
              ],
              Q: [
                0,
                4,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA",
              "PQ"
            ],
            view: "top"
          }
        },
        {
          title: "E\xE9n factor, alle lengtes",
          text: "Omdat AC = 8 en BC = 10, worden AQ = 4 en PQ = 5. Dit gaat over lengtes. Een oppervlak vraagt twee lengtefactoren; een volume drie. Dat onderscheid gebruik je later bij ruimtefiguren.",
          scene: {
            caption: "ABC: zijden 6, 8 en 10 cm. APQ: zijden 3, 4 en 5 cm.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                0,
                8,
                0
              ],
              P: [
                3,
                0,
                0
              ],
              Q: [
                0,
                4,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA",
              "PQ"
            ],
            highlights: [
              "PQ"
            ],
            view: "top"
          }
        }
      ],
      questionIds: [
        "l2-gelijkvormig-1",
        "l2-gelijkvormig-2",
        "l2-gelijkvormig-3",
        "l2-gelijkvormig-4"
      ],
      probeIds: [
        "l2-gelijkvormig-p1",
        "l2-gelijkvormig-p2"
      ],
      retestIds: [
        "l2-gelijkvormig-r1",
        "l2-gelijkvormig-r2"
      ],
      misconception: {
        label: "De lengtefactor wordt in de omgekeerde richting gebruikt",
        trigger: {
          qid: "l2-gelijkvormig-1",
          wrongAnswer: "c"
        },
        probeWrongAnswers: [
          "c",
          "a"
        ]
      },
      repair: {
        title: "Schrijf de pijl bij de factor",
        text: "ABC \u2192 APQ betekent nieuw/oud = AP/AB = 3/6. Vermenigvuldig AC = 8 met 1/2 en krijg AQ = 4. Controleer of een verkleining inderdaad een kleinere lengte oplevert.",
        scene: {
          caption: "AB = 6 cm, AC = 8 cm; P is het midden van AB en PQ \u2225 BC.",
          showCube: false,
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              6,
              0,
              0
            ],
            C: [
              0,
              8,
              0
            ],
            P: [
              3,
              0,
              0
            ],
            Q: [
              0,
              4,
              0
            ]
          },
          edges: [
            "AB",
            "BC",
            "CA",
            "PQ"
          ],
          view: "top"
        }
      }
    },
    {
      id: "l3-ruimtefiguren",
      level: 3,
      title: "Dezelfde regels, andere lichamen",
      subtitle: "Kies constructies die ook bij prisma en piramide geldig zijn.",
      theory: [
        {
          title: "Zoek eerst het gemeenschappelijke zijvlak",
          text: "In een prisma verbind je twee gegeven punten zodra ze in \xE9\xE9n zijvlak liggen. In dit voorbeeld leveren PR, RS, SQ en QP samen een trapezium op. De doorsnede heeft meer hoekpunten dan er gegeven waren.",
          scene: {
            caption: "De doorsnede is P\u2013R\u2013S\u2013Q. S is het midden van CF. PQ \u2225 RS.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                2,
                0,
                0
              ],
              C: [
                0,
                2,
                0
              ],
              D: [
                0,
                0,
                3
              ],
              E: [
                2,
                0,
                3
              ],
              F: [
                0,
                2,
                3
              ],
              P: [
                1,
                0,
                0
              ],
              Q: [
                0,
                1,
                0
              ],
              R: [
                2,
                0,
                1.5
              ],
              S: [
                0,
                2,
                1.5
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA",
              "DE",
              "EF",
              "FD",
              "AD",
              "BE",
              "CF"
            ],
            highlights: [
              "PR",
              "RS",
              "SQ",
              "QP"
            ],
            planes: [
              [
                "P",
                "R",
                "S",
                "Q"
              ]
            ]
          }
        },
        {
          title: "Controleer de voorwaarde voor evenwijdigheid",
          text: "In een kubus zijn overstaande zijvlakken evenwijdig. In een piramide ontmoeten verschillende zijvlakken elkaar bij de top. De kubusregel mag je daar niet zonder nieuwe onderbouwing toepassen.",
          scene: {
            caption: "De volledige doorsnede is PQRS. S ligt op DT met DS = \xBC DT.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                2,
                0,
                0
              ],
              C: [
                2,
                2,
                0
              ],
              D: [
                0,
                2,
                0
              ],
              T: [
                1,
                1,
                4
              ],
              P: [
                0.25,
                0.25,
                1
              ],
              Q: [
                1.5,
                0.5,
                2
              ],
              R: [
                1.5,
                1.5,
                2
              ],
              S: [
                0.25,
                1.75,
                1
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "AT",
              "BT",
              "CT",
              "DT"
            ],
            highlights: [
              "PQ",
              "QR",
              "RS",
              "SP"
            ],
            planes: [
              [
                "P",
                "Q",
                "R",
                "S"
              ]
            ]
          }
        },
        {
          title: "Gebruik een snijlijn buiten het lichaam",
          text: "Verleng PQ en AB tot X. Omdat QR evenwijdig aan het grondvlak is, loopt de grondvlak-snijlijn door X evenwijdig aan QR. Vind Y op de verlengde CD, teken RY en vind S op DT. Sluit de rand via SP.",
          scene: {
            caption: "X = PQ \u2229 AB ligt voorbij A. Door X loopt de grondvlak-snijlijn evenwijdig aan QR; Y ligt op de verlengde CD.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                2,
                0,
                0
              ],
              C: [
                2,
                2,
                0
              ],
              D: [
                0,
                2,
                0
              ],
              T: [
                1,
                1,
                4
              ],
              P: [
                0.25,
                0.25,
                1
              ],
              Q: [
                1.5,
                0.5,
                2
              ],
              R: [
                1.5,
                1.5,
                2
              ],
              S: [
                0.25,
                1.75,
                1
              ],
              X: [
                -1,
                0,
                0
              ],
              Y: [
                -1,
                2,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "AT",
              "BT",
              "CT",
              "DT"
            ],
            highlights: [
              "PQ",
              "QR",
              "RS",
              "SP"
            ],
            segments: [
              {
                from: [
                  0.25,
                  0.25,
                  1
                ],
                to: [
                  -1,
                  0,
                  0
                ],
                color: "#ffab66",
                dashed: true
              },
              {
                from: [
                  -1,
                  0,
                  0
                ],
                to: [
                  -1,
                  2,
                  0
                ],
                color: "#66d9ca",
                dashed: true
              },
              {
                from: [
                  -1,
                  2,
                  0
                ],
                to: [
                  1.5,
                  1.5,
                  2
                ],
                color: "#ffab66",
                dashed: true
              },
              {
                from: [
                  0,
                  0,
                  0
                ],
                to: [
                  -1,
                  0,
                  0
                ],
                color: "#66d9ca",
                dashed: true
              },
              {
                from: [
                  0,
                  2,
                  0
                ],
                to: [
                  -1,
                  2,
                  0
                ],
                color: "#66d9ca",
                dashed: true
              }
            ]
          }
        }
      ],
      questionIds: [
        "l3-ruimtefiguren-1",
        "l3-ruimtefiguren-2",
        "l3-ruimtefiguren-3",
        "l3-ruimtefiguren-4"
      ],
      probeIds: [
        "l3-ruimtefiguren-p1",
        "l3-ruimtefiguren-p2"
      ],
      retestIds: [
        "l3-ruimtefiguren-r1",
        "l3-ruimtefiguren-r2"
      ],
      misconception: {
        label: "Tegenoverliggende zijvlakken zijn bij elk lichaam evenwijdig",
        trigger: {
          qid: "l3-ruimtefiguren-1",
          wrongAnswer: "b"
        },
        probeWrongAnswers: [
          "c",
          "a"
        ]
      },
      repair: {
        title: "Controleer eerst welke vlakken evenwijdig zijn",
        text: "De regel over evenwijdige snijlijnen geldt pas nadat je evenwijdige vlakken hebt vastgesteld. ABT en CDT bevatten allebei T en zijn niet evenwijdig. Gebruik bij deze piramide daarom de grondvlak-snijlijn; daarmee ontstaat S op DT zonder een ongeldige evenwijdigheidsaanname.",
        scene: {
          caption: "X = PQ \u2229 AB ligt voorbij A. Door X loopt de grondvlak-snijlijn evenwijdig aan QR; Y ligt op de verlengde CD.",
          showCube: false,
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              2,
              0,
              0
            ],
            C: [
              2,
              2,
              0
            ],
            D: [
              0,
              2,
              0
            ],
            T: [
              1,
              1,
              4
            ],
            P: [
              0.25,
              0.25,
              1
            ],
            Q: [
              1.5,
              0.5,
              2
            ],
            R: [
              1.5,
              1.5,
              2
            ],
            S: [
              0.25,
              1.75,
              1
            ],
            X: [
              -1,
              0,
              0
            ],
            Y: [
              -1,
              2,
              0
            ]
          },
          edges: [
            "AB",
            "BC",
            "CD",
            "DA",
            "AT",
            "BT",
            "CT",
            "DT"
          ],
          highlights: [
            "PQ",
            "QR",
            "RS",
            "SP"
          ],
          segments: [
            {
              from: [
                0.25,
                0.25,
                1
              ],
              to: [
                -1,
                0,
                0
              ],
              color: "#ffab66",
              dashed: true
            },
            {
              from: [
                -1,
                0,
                0
              ],
              to: [
                -1,
                2,
                0
              ],
              color: "#66d9ca",
              dashed: true
            },
            {
              from: [
                -1,
                2,
                0
              ],
              to: [
                1.5,
                1.5,
                2
              ],
              color: "#ffab66",
              dashed: true
            },
            {
              from: [
                0,
                0,
                0
              ],
              to: [
                -1,
                0,
                0
              ],
              color: "#66d9ca",
              dashed: true
            },
            {
              from: [
                0,
                2,
                0
              ],
              to: [
                -1,
                2,
                0
              ],
              color: "#66d9ca",
              dashed: true
            }
          ]
        }
      }
    },
    {
      id: "l3-oppervlakte",
      level: 3,
      title: "Basis en loodrechte hoogte",
      subtitle: "Bereken een oppervlakte uit de juiste driehoek.",
      theory: [
        {
          title: "De hoogte hoort bij een gekozen basis",
          text: "Neem AB als basis. De hoogte is de loodrechte afstand van C tot lijn AB: CM. In de gelijkzijdige driehoek loopt die hoogte door het midden M. De zijde AC is langer en is geen hoogte.",
          scene: {
            caption: "AB = 6 cm, AM = 3 cm; CM \u27C2 AB en CM = \u221A27 cm.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                3,
                5.196152422706632,
                0
              ],
              M: [
                3,
                0,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA"
            ],
            highlights: [
              "CM"
            ],
            view: "top"
          }
        },
        {
          title: "Bereken een ontbrekende hoogte",
          text: "Met AB = AC = 6 en AM = 3 geeft Pythagoras CM = \u221A(6\xB2 \u2212 3\xB2) = \u221A27. Pas daarna volgt oppervlakte = 1/2 \xD7 6 \xD7 \u221A27. Rond pas aan het eind af.",
          scene: {
            caption: "AB = 6 cm, AM = 3 cm; CM \u27C2 AB en CM = \u221A27 cm.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                3,
                5.196152422706632,
                0
              ],
              M: [
                3,
                0,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA"
            ],
            highlights: [
              "CM"
            ],
            view: "top"
          }
        },
        {
          title: "Het voetpunt mag buiten liggen",
          text: "Bij een stomphoekige driehoek kan H op de verlengde AB liggen. Toch is CH de hoogte bij AB. De formule 1/2 \xD7 basis \xD7 hoogte verandert niet.",
          scene: {
            caption: "AB = 6 cm. CH = 4 cm en CH \u27C2 lijn AB; H ligt op de verlengde AB voorbij A.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                -2,
                4,
                0
              ],
              H: [
                -2,
                0,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA"
            ],
            highlights: [
              "CH"
            ],
            segments: [
              {
                from: [
                  -2,
                  0,
                  0
                ],
                to: [
                  0,
                  0,
                  0
                ],
                color: "#66d9ca",
                dashed: true
              }
            ],
            view: "top"
          }
        }
      ],
      questionIds: [
        "l3-oppervlakte-1",
        "l3-oppervlakte-2",
        "l3-oppervlakte-3",
        "l3-oppervlakte-4"
      ],
      probeIds: [
        "l3-oppervlakte-p1",
        "l3-oppervlakte-p2"
      ],
      retestIds: [
        "l3-oppervlakte-r1",
        "l3-oppervlakte-r2"
      ],
      misconception: {
        label: "Een schuine zijde wordt als loodrechte hoogte gebruikt",
        trigger: {
          qid: "l3-oppervlakte-1",
          wrongAnswer: "c"
        },
        probeWrongAnswers: [
          "c",
          "c"
        ]
      },
      repair: {
        title: "Teken eerst de loodlijn",
        text: "Kies de basis AB en teken vanuit C een loodlijn op de volledige lijn AB. Het lijnstuk tot het voetpunt is de hoogte. In dit voorbeeld is AC = 6, maar CM = \u221A27. Alleen CM hoort als hoogte bij basis AB.",
        scene: {
          caption: "AB = 6 cm, AM = 3 cm; CM \u27C2 AB en CM = \u221A27 cm.",
          showCube: false,
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              6,
              0,
              0
            ],
            C: [
              3,
              5.196152422706632,
              0
            ],
            M: [
              3,
              0,
              0
            ]
          },
          edges: [
            "AB",
            "BC",
            "CA"
          ],
          highlights: [
            "CM"
          ],
          view: "top"
        }
      }
    },
    {
      id: "l3-inhoud",
      level: 3,
      title: "Een ingewikkelde inhoud ontleden",
      subtitle: "Vul aan tot een bekend lichaam en trek gecontroleerd af.",
      theory: [
        {
          title: "Prisma en piramide hebben verschillende formules",
          text: "Voor een prisma is V = B \xD7 h. Voor een piramide met dezelfde grondoppervlakte B en loodrechte hoogte h is V = 1/3 \xD7 B \xD7 h. Een schuine ribbe is niet automatisch de hoogte.",
          scene: {
            caption: "Piramide met grondvlak 6 \xD7 4 cm en loodrechte hoogte TO = 5 cm.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                6,
                4,
                0
              ],
              D: [
                0,
                4,
                0
              ],
              T: [
                3,
                2,
                5
              ],
              O: [
                3,
                2,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "AT",
              "BT",
              "CT",
              "DT"
            ],
            highlights: [
              "TO"
            ]
          }
        },
        {
          title: "Maak eerst het volledige prisma",
          text: "Het rechthoekige driehoekige grondvlak heeft oppervlakte 1/2 \xD7 3 \xD7 4 = 6 cm\xB2. Met hoogte 9 cm is de prisma-inhoud 54 cm\xB3. Bepaal daarna precies welke stukken ontbreken.",
          scene: {
            caption: "ABC is rechthoekig met AB = 3 en AC = 4 cm. AD = 9 cm. P, Q, R zijn middens van DE, EF, FD. Verwijder de drie hoekpiramides A.DPR, B.EPQ en C.FQR.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                3,
                0,
                0
              ],
              C: [
                0,
                4,
                0
              ],
              D: [
                0,
                0,
                9
              ],
              E: [
                3,
                0,
                9
              ],
              F: [
                0,
                4,
                9
              ],
              P: [
                1.5,
                0,
                9
              ],
              Q: [
                1.5,
                2,
                9
              ],
              R: [
                0,
                2,
                9
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA",
              "DE",
              "EF",
              "FD",
              "AD",
              "BE",
              "CF"
            ]
          }
        },
        {
          title: "Trek zonder dubbel te tellen af",
          text: "P, Q en R zijn middens. Iedere bovenste hoekdriehoek heeft 1/4 van de grondoppervlakte. Elke verwijderde piramide heeft inhoud 1/3 \xD7 1,5 \xD7 9 = 4,5 cm\xB3. De drie delen overlappen niet in hun binnenste, dus de rest is 40,5 cm\xB3.",
          scene: {
            caption: "Overblijvend lichaam ABCPQR. Volledig prisma minus drie niet-overlappende hoekpiramides.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                3,
                0,
                0
              ],
              C: [
                0,
                4,
                0
              ],
              P: [
                1.5,
                0,
                9
              ],
              Q: [
                1.5,
                2,
                9
              ],
              R: [
                0,
                2,
                9
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA",
              "PQ",
              "QR",
              "RP",
              "AP",
              "AR",
              "BP",
              "BQ",
              "CQ",
              "CR"
            ],
            planes: [
              [
                "P",
                "Q",
                "R"
              ]
            ]
          }
        }
      ],
      questionIds: [
        "l3-inhoud-1",
        "l3-inhoud-2",
        "l3-inhoud-3",
        "l3-inhoud-4"
      ],
      probeIds: [
        "l3-inhoud-p1",
        "l3-inhoud-p2"
      ],
      retestIds: [
        "l3-inhoud-r1",
        "l3-inhoud-r2"
      ],
      misconception: {
        label: "Voor een piramide wordt de prismaformule B \xD7 h gebruikt",
        trigger: {
          qid: "l3-inhoud-1",
          wrongAnswer: "b"
        },
        probeWrongAnswers: [
          "b",
          "b"
        ]
      },
      repair: {
        title: "Het lichaam bepaalt de extra factor",
        text: "B \xD7 h beschrijft het volledige prisma. De piramide met dezelfde grondoppervlakte en loodrechte hoogte heeft een derde van die inhoud. Bij B = 24 en h = 5 wordt dat 120/3 = 40 cm\xB3. Gebruik dit ook voor ieder piramidedeel dat je aftrekt.",
        scene: {
          caption: "Piramide met grondvlak 6 \xD7 4 cm en loodrechte hoogte TO = 5 cm.",
          showCube: false,
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              6,
              0,
              0
            ],
            C: [
              6,
              4,
              0
            ],
            D: [
              0,
              4,
              0
            ],
            T: [
              3,
              2,
              5
            ],
            O: [
              3,
              2,
              0
            ]
          },
          edges: [
            "AB",
            "BC",
            "CD",
            "DA",
            "AT",
            "BT",
            "CT",
            "DT"
          ],
          highlights: [
            "TO"
          ]
        }
      }
    },
    {
      id: "l3-goniometrie",
      level: 3,
      title: "Goniometrie in de juiste driehoek",
      subtitle: "Benoem de zijden, kies de verhouding en reken beide kanten op.",
      theory: [
        {
          title: "De hoek bepaalt overstaand en aanliggend",
          text: "In ABC is B de rechte hoek. Bij hoek A is BC overstaand en AB aanliggend; AC is altijd de schuine zijde. Kies je hoek C, dan wisselen de rollen van AB en BC.",
          scene: {
            caption: "Rechthoekige driehoek ABC: \u2220B = 90\xB0, AB = 4 cm, BC = 3 cm, AC = 5 cm.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                4,
                0,
                0
              ],
              C: [
                4,
                3,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA"
            ],
            view: "top"
          }
        },
        {
          title: "Drie verhoudingen, \xE9\xE9n rechthoekige driehoek",
          text: "Bij hoek A geldt sin(A) = BC/AC = 3/5, cos(A) = AB/AC = 4/5 en tan(A) = BC/AB = 3/4. Kies de verhouding waarin je bekende en gezochte grootheden voorkomen.",
          scene: {
            caption: "Rechthoekige driehoek ABC: \u2220B = 90\xB0, AB = 4 cm, BC = 3 cm, AC = 5 cm.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                4,
                0,
                0
              ],
              C: [
                4,
                3,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA"
            ],
            view: "top"
          }
        },
        {
          title: "Van lengte naar hoek, en terug",
          text: "Met tan(A) = 3/4 vind je A = arctan(3/4) \u2248 36,87\xB0. Andersom: bij A = 30\xB0 en AB = 10 geeft BC = 10 \xD7 tan(30\xB0). Gebruik gradenmodus en rond pas het eindantwoord af.",
          scene: {
            caption: "\u2220B = 90\xB0, \u2220A = 30\xB0 en AB = 10 cm; BC volgt uit de tangens.",
            showCube: false,
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                10,
                0,
                0
              ],
              C: [
                10,
                5.773502691896258,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA"
            ],
            view: "top"
          }
        }
      ],
      questionIds: [
        "l3-goniometrie-1",
        "l3-goniometrie-2",
        "l3-goniometrie-3",
        "l3-goniometrie-4"
      ],
      probeIds: [
        "l3-goniometrie-p1",
        "l3-goniometrie-p2"
      ],
      retestIds: [
        "l3-goniometrie-r1",
        "l3-goniometrie-r2"
      ],
      misconception: {
        label: "Bij tangens worden overstaande en aanliggende zijde omgedraaid",
        trigger: {
          qid: "l3-goniometrie-1",
          wrongAnswer: "a"
        },
        probeWrongAnswers: [
          "b",
          "b"
        ]
      },
      repair: {
        title: "Begin altijd bij de gevraagde hoek",
        text: "Markeer A. BC ligt daar tegenover; AB raakt A en is niet de schuine zijde. Daarom tan(A) = BC/AB = 3/4. Bij C worden de rollen omgekeerd: tan(C) = AB/BC. De regel verandert niet, alleen de gekozen hoek.",
        scene: {
          caption: "Rechthoekige driehoek ABC: \u2220B = 90\xB0, AB = 4 cm, BC = 3 cm, AC = 5 cm.",
          showCube: false,
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              4,
              0,
              0
            ],
            C: [
              4,
              3,
              0
            ]
          },
          edges: [
            "AB",
            "BC",
            "CA"
          ],
          view: "top"
        }
      }
    },
    {
      id: "l4-cos",
      level: 4,
      title: "De juiste driehoek",
      subtitle: "Cosinusregel en oppervlakte zonder een rechte hoek te veronderstellen.",
      theory: [
        {
          title: "Eerst de driehoek, dan de formule",
          text: "Een ruimtelijke hoek bereken je in een geschikte vlakke driehoek. Pythagoras en de gebruikelijke verhoudingen sin, cos en tan tussen rechthoekszijden vereisen een rechte hoek. Voor een willekeurige driehoek geldt a\xB2 = b\xB2 + c\xB2 \u2212 2bc cos \u03B1, met zijde a tegenover hoek \u03B1. Bij \u03B1 = 90\xB0 wordt cos \u03B1 nul en volgt Pythagoras. De schets bepaalt dus nooit of je de rechthoekige formule mag gebruiken.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                1,
                4.898979485566356,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA"
            ],
            showCube: false,
            view: "top",
            caption: "Driehoek ABC: AB = 6 cm, AC = 5 cm, BC = 7 cm."
          }
        },
        {
          title: "Waarom de cosinusregel klopt",
          text: "Laat uit C de loodlijn CD op AB neer. Neem AB = c, AC = b en \u2220CAB = \u03B1. Dan AD = b cos \u03B1 en CD = b sin \u03B1. Pythagoras in BCD geeft BC\xB2 = (c \u2212 b cos \u03B1)\xB2 + (b sin \u03B1)\xB2 = c\xB2 + b\xB2 \u2212 2bc cos \u03B1. De formule geldt ook bij een stompe hoek; de loodrechte projectie kan dan op het verlengde van AB liggen.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                1,
                4.898979485566356,
                0
              ],
              D: [
                1,
                0,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA"
            ],
            showCube: false,
            view: "top",
            caption: "Hoogtelijn CD staat loodrecht op AB. Deze driehoek heeft AB = 6, AC = 5 en BC = 7 cm.",
            segments: [
              {
                from: [
                  1,
                  4.898979485566356,
                  0
                ],
                to: [
                  1,
                  0,
                  0
                ],
                color: "#72e1b8",
                dashed: true
              }
            ]
          }
        },
        {
          title: "Van drie zijden naar hoek \xE9n oppervlakte",
          text: "Bij AB = 6, AC = 5 en BC = 7 is cos A = (6\xB2 + 5\xB2 \u2212 7\xB2)/(2 \xD7 6 \xD7 5) = 0,2. Dus A \u2248 78,46\xB0. Daarna volgt de oppervlakte met \xBD \xD7 AB \xD7 AC \xD7 sin A \u2248 14,70 cm\xB2. Bewaar tussentijds de volledige waarde in je rekenmachine. De grootste zijde ligt tegenover de grootste hoek: zo controleer je of de uitkomst aannemelijk is.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                1,
                4.898979485566356,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA"
            ],
            showCube: false,
            view: "top",
            caption: "De hoek bij A ligt tussen de zijden van 6 en 5 cm. De zijde van 7 cm ligt ertegenover.",
            highlights: [
              "AB",
              "AC"
            ]
          }
        }
      ],
      questionIds: [
        "l4-cos-q1",
        "l4-cos-q2",
        "l4-cos-q3",
        "l4-cos-q4"
      ],
      probeIds: [
        "l4-cos-p1",
        "l4-cos-p2"
      ],
      retestIds: [
        "l4-cos-r1",
        "l4-cos-r2"
      ],
      repair: {
        title: "Controleer de rechte hoek v\xF3\xF3r Pythagoras",
        text: "De tekening kan een hoek rechthoekig laten lijken. Dat is geen bewijs. Met zijden 5, 6 en 7 is 5\xB2 + 6\xB2 = 61, terwijl 7\xB2 = 49. Gebruik daarom de cosinusregel. In een echte 3\u20134\u20135-driehoek wordt de cosinusterm bij de rechte hoek precies nul. Pythagoras is dus een bijzonder geval, geen algemene driehoeksregel.",
        scene: {
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              6,
              0,
              0
            ],
            C: [
              1,
              4.898979485566356,
              0
            ]
          },
          edges: [
            "AB",
            "BC",
            "CA"
          ],
          showCube: false,
          view: "top",
          caption: "5\xB2 + 6\xB2 is niet gelijk aan 7\xB2: deze driehoek is niet rechthoekig."
        }
      },
      misconception: {
        label: "Pythagoras toepassen zonder aangetoonde rechte hoek",
        trigger: {
          qid: "l4-cos-q1",
          wrongAnswer: "d"
        },
        probeWrongAnswers: [
          "a",
          "a"
        ]
      }
    },
    {
      id: "l4-lines",
      level: 4,
      title: "Hoeken tussen lijnen",
      subtitle: "Kruisende lijnen vergelijken door evenwijdig verschuiven.",
      theory: [
        {
          title: "Een hoek hoort bij richtingen",
          text: "Voor twee verschillende lijnen gebruiken we de kleinste hoek tussen hun richtingen: van 0\xB0 tot en met 90\xB0. Ook kruisende lijnen hebben zo een hoek. Breng ze door evenwijdig verschuiven door \xE9\xE9n punt. Dit verandert de richtingen en dus hun hoek niet. Twee lijnen die op papier lijken te snijden, hoeven in de ruimte niet te snijden.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                4,
                0,
                0
              ],
              C: [
                4,
                4,
                0
              ],
              D: [
                0,
                4,
                0
              ],
              E: [
                0,
                0,
                4
              ],
              F: [
                4,
                0,
                4
              ],
              G: [
                4,
                4,
                4
              ],
              H: [
                0,
                4,
                4
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            caption: "AB en DG kruisen. DG is evenwijdig aan AF; \u2220BAF vertegenwoordigt de hoek tussen AB en DG.",
            view: "spatial",
            highlights: [
              "AB",
              "DG"
            ]
          }
        },
        {
          title: "Verplaats beide punten even ver",
          text: "I ligt halverwege AE. Om de richting van IB door E te krijgen, schuif je de hele lijn een halve ribbe omhoog: I wordt E en B wordt J, het midden van BF. Daarom is EJ evenwijdig aan IB. Verplaats nooit slechts \xE9\xE9n eindpunt; dan draai je de lijn en verandert de hoek. Nu kun je in driehoek EJG rekenen.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                4,
                0,
                0
              ],
              C: [
                4,
                4,
                0
              ],
              D: [
                0,
                4,
                0
              ],
              E: [
                0,
                0,
                4
              ],
              F: [
                4,
                0,
                4
              ],
              G: [
                4,
                4,
                4
              ],
              H: [
                0,
                4,
                4
              ],
              I: [
                0,
                0,
                2
              ],
              J: [
                4,
                0,
                2
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            caption: "EJ \u2225 IB: I verschuift naar E en B naar J. De hoek wordt gemeten in driehoek EJG.",
            view: "spatial",
            highlights: [
              "EG",
              "IB",
              "EJ",
              "JG"
            ]
          }
        },
        {
          title: "Kies daarna de passende hoekberekening",
          text: "Bij ribbe 4 zijn EG = 4\u221A2 en EJ = JG = \u221A20. De cosinusregel in EJG geeft cos \u2220GEJ = (32 + 20 \u2212 20)/(2\u221A32\u221A20) = 2/\u221A10. Dus de hoek tussen EG en IB is ongeveer 50,77\xB0. Levert je driehoek 129,23\xB0 op, neem dan de supplementaire hoek 180\xB0 \u2212 129,23\xB0: de hoek tussen lijnen is de kleinste.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                4,
                0,
                0
              ],
              C: [
                4,
                4,
                0
              ],
              D: [
                0,
                4,
                0
              ],
              E: [
                0,
                0,
                4
              ],
              F: [
                4,
                0,
                4
              ],
              G: [
                4,
                4,
                4
              ],
              H: [
                0,
                4,
                4
              ],
              I: [
                0,
                0,
                2
              ],
              J: [
                4,
                0,
                2
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            caption: "In driehoek EJG: EG = 4\u221A2 cm; EJ = JG = \u221A20 cm. Gezochte hoek bij E.",
            view: "spatial",
            highlights: [
              "EG",
              "IB",
              "EJ",
              "JG"
            ]
          }
        }
      ],
      questionIds: [
        "l4-lines-q1",
        "l4-lines-q2",
        "l4-lines-q3",
        "l4-lines-q4"
      ],
      probeIds: [
        "l4-lines-p1",
        "l4-lines-p2"
      ],
      retestIds: [
        "l4-lines-r1",
        "l4-lines-r2"
      ],
      repair: {
        title: "Niet snijden betekent niet: geen hoek",
        text: "Kruisen gaat over de ligging van lijnen; de hoek gaat over hun richtingen. In de kubus kruisen AB en DG. Schuif DG evenwijdig naar AF. Nu lees je dezelfde richtingshoek af in driehoek ABF, waar hij 45\xB0 is. Alleen een lijn draaien zou die richting en dus de hoek veranderen.",
        scene: {
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              4,
              0,
              0
            ],
            C: [
              4,
              4,
              0
            ],
            D: [
              0,
              4,
              0
            ],
            E: [
              0,
              0,
              4
            ],
            F: [
              4,
              0,
              4
            ],
            G: [
              4,
              4,
              4
            ],
            H: [
              0,
              4,
              4
            ]
          },
          edges: [
            "AB",
            "BC",
            "CD",
            "DA",
            "EF",
            "FG",
            "GH",
            "HE",
            "AE",
            "BF",
            "CG",
            "DH"
          ],
          showCube: false,
          caption: "DG en AF hebben dezelfde richting. De hoek tussen AB en DG is daarom \u2220BAF.",
          view: "spatial",
          highlights: [
            "AB",
            "DG",
            "AF"
          ]
        }
      },
      misconception: {
        label: "Denken dat kruisende lijnen geen hoek hebben",
        trigger: {
          qid: "l4-lines-q1",
          wrongAnswer: "a"
        },
        probeWrongAnswers: [
          "b",
          "a"
        ]
      }
    },
    {
      id: "l4-plane",
      level: 4,
      title: "Van lijn naar vlak",
      subtitle: "Loodrecht bewijzen en de juiste projectie construeren.",
      theory: [
        {
          title: "Loodrecht op een vlak vraagt twee richtingen",
          text: "Om AE loodrecht op vlak ABCD te bewijzen, volstaan AE \u27C2 AB en AE \u27C2 AD: AB en AD zijn twee snijdende lijnen van het vlak door A. E\xE9n lijn is onvoldoende. De lijn AF staat bijvoorbeeld wel loodrecht op AD, maar niet op het hele grondvlak. Houd bij een bewijs dus bij welke lijnen in het vlak liggen en waar ze elkaar snijden.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                4,
                0,
                0
              ],
              C: [
                4,
                4,
                0
              ],
              D: [
                0,
                4,
                0
              ],
              E: [
                0,
                0,
                4
              ],
              F: [
                4,
                0,
                4
              ],
              G: [
                4,
                4,
                4
              ],
              H: [
                0,
                4,
                4
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            caption: "AB en AD snijden in A en liggen in ABCD; AE staat loodrecht op beide.",
            view: "spatial",
            highlights: [
              "AE",
              "AB",
              "AD"
            ],
            planes: [
              [
                "A",
                "B",
                "C",
                "D"
              ]
            ]
          }
        },
        {
          title: "Projecteer loodrecht, punt voor punt",
          text: "De hoek tussen een lijn en een vlak is de hoek tussen de lijn en haar loodrechte projectie op het vlak. Voor AG en ABCD blijft A op A en wordt G op C geprojecteerd, want CG \u27C2 ABCD. De projectie is dus AC. Een andere lijn door A in het grondvlak, zoals AB, geeft meestal een andere hoek en is niet de definitie.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                4,
                0,
                0
              ],
              C: [
                4,
                4,
                0
              ],
              D: [
                0,
                4,
                0
              ],
              E: [
                0,
                0,
                4
              ],
              F: [
                4,
                0,
                4
              ],
              G: [
                4,
                4,
                4
              ],
              H: [
                0,
                4,
                4
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            caption: "G projecteert loodrecht op C; A ligt al in het grondvlak. De gevraagde hoek is \u2220GAC.",
            view: "spatial",
            highlights: [
              "AG",
              "AC",
              "CG"
            ],
            planes: [
              [
                "A",
                "B",
                "C",
                "D"
              ]
            ]
          }
        },
        {
          title: "De hoek wordt een rechthoekige driehoek",
          text: "In een kubus met ribbe 4 is AC = 4\u221A2 en CG = 4. In driehoek ACG geldt tan \u2220GAC = CG/AC = 1/\u221A2; de lijn\u2013vlakhoek is ongeveer 35,26\xB0. De hoek met de normaal is het complement: 54,74\xB0. Een lijn evenwijdig aan het vlak heeft hoek 0\xB0; een lijn loodrecht op het vlak heeft hoek 90\xB0 en projecteert op \xE9\xE9n punt.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                4,
                0,
                0
              ],
              C: [
                4,
                4,
                0
              ],
              D: [
                0,
                4,
                0
              ],
              E: [
                0,
                0,
                4
              ],
              F: [
                4,
                0,
                4
              ],
              G: [
                4,
                4,
                4
              ],
              H: [
                0,
                4,
                4
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            caption: "Driehoek ACG is recht bij C: AC = 4\u221A2 cm en CG = 4 cm.",
            view: "spatial",
            highlights: [
              "AG",
              "AC",
              "CG"
            ],
            planes: [
              [
                "A",
                "B",
                "C",
                "D"
              ]
            ]
          }
        }
      ],
      questionIds: [
        "l4-plane-q1",
        "l4-plane-q2",
        "l4-plane-q3",
        "l4-plane-q4"
      ],
      probeIds: [
        "l4-plane-p1",
        "l4-plane-p2"
      ],
      retestIds: [
        "l4-plane-r1",
        "l4-plane-r2"
      ],
      repair: {
        title: "Een projectie is geen willekeurige lijn in het vlak",
        text: "Voor AG en ABCD bepaal je eerst de voetpunten: A blijft A en G wordt C omdat CG loodrecht op ABCD staat. Daardoor is AC de enige loodrechte projectielijn. AB ligt wel in het vlak, maar heeft niet de richting van deze projectie. Bij de kubus geeft \u2220GAB ongeveer 54,74\xB0, terwijl de echte lijn\u2013vlakhoek \u2220GAC ongeveer 35,26\xB0 is.",
        scene: {
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              4,
              0,
              0
            ],
            C: [
              4,
              4,
              0
            ],
            D: [
              0,
              4,
              0
            ],
            E: [
              0,
              0,
              4
            ],
            F: [
              4,
              0,
              4
            ],
            G: [
              4,
              4,
              4
            ],
            H: [
              0,
              4,
              4
            ]
          },
          edges: [
            "AB",
            "BC",
            "CD",
            "DA",
            "EF",
            "FG",
            "GH",
            "HE",
            "AE",
            "BF",
            "CG",
            "DH"
          ],
          showCube: false,
          caption: "G projecteert loodrecht op C; A ligt al in het grondvlak. De gevraagde hoek is \u2220GAC.",
          view: "spatial",
          highlights: [
            "AG",
            "AC",
            "CG"
          ],
          planes: [
            [
              "A",
              "B",
              "C",
              "D"
            ]
          ]
        }
      },
      misconception: {
        label: "Een willekeurige vlaklijn gebruiken in plaats van de loodrechte projectie",
        trigger: {
          qid: "l4-plane-q1",
          wrongAnswer: "d"
        },
        probeWrongAnswers: [
          "d",
          "a"
        ]
      }
    },
    {
      id: "l4-dihedral",
      level: 4,
      title: "Standhoeken construeren",
      subtitle: "Van twee vlakken naar een doorsnede loodrecht op de snijlijn.",
      theory: [
        {
          title: "Kijk loodrecht op de scharnierlijn",
          text: "Twee snijdende vlakken hebben een gemeenschappelijke snijlijn. Kies in elk vlak een lijn door hetzelfde punt op die snijlijn, beide loodrecht op de snijlijn. Hun hoek is een standhoek. Het vlak door die twee loodlijnen heet een standvlak. Bij ABCD en ABGH is AB de snijlijn: AD en AH voldoen, dus \u2220DAH is geschikt. Een willekeurige hoek tussen twee lijnen uit de vlakken is dat niet.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                4,
                0,
                0
              ],
              C: [
                4,
                4,
                0
              ],
              D: [
                0,
                4,
                0
              ],
              E: [
                0,
                0,
                4
              ],
              F: [
                4,
                0,
                4
              ],
              G: [
                4,
                4,
                4
              ],
              H: [
                0,
                4,
                4
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            caption: "AD en AH staan beide loodrecht op snijlijn AB. \u2220DAH is een standhoek.",
            view: "spatial",
            highlights: [
              "AB",
              "AD",
              "AH"
            ],
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
                "G",
                "H"
              ]
            ]
          }
        },
        {
          title: "Een standvlak maakt een vlakke opgave",
          text: "In een balk met AD = 6 en AE = 4 is ADHE een standvlak voor ABCD en ABGH. De rechthoekige driehoek ADH geeft tan \u2220DAH = DH/AD = 4/6, dus ongeveer 33,69\xB0. AB kan elke lengte hebben: de standhoek verandert daardoor niet. De hoek tussen de vlakken is de kleinste van de twee bijbehorende standhoeken, dus hoogstens 90\xB0.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                5,
                0,
                0
              ],
              C: [
                5,
                6,
                0
              ],
              D: [
                0,
                6,
                0
              ],
              E: [
                0,
                0,
                4
              ],
              F: [
                5,
                0,
                4
              ],
              G: [
                5,
                6,
                4
              ],
              H: [
                0,
                6,
                4
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            caption: "ADHE staat loodrecht op snijlijn AB. AD = 6 cm en DH = 4 cm.",
            view: "spatial",
            highlights: [
              "AB",
              "AD",
              "AH",
              "DH"
            ],
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
                "G",
                "H"
              ],
              [
                "A",
                "D",
                "H",
                "E"
              ]
            ]
          }
        },
        {
          title: "Soms moet je het voetpunt eerst construeren",
          text: "Neem ribbe 4 en J halverwege BF. De vlakken EJG en ABFE snijden langs EJ. Laat uit F de loodlijn FI op EJ neer. Ook GI staat loodrecht op EJ: FG staat loodrecht op het voorvlak en FI \u27C2 EJ. Daarom is FIG een standvlak. Uit de oppervlakte van de rechthoekige driehoek EFJ volgt FI = EF \xD7 FJ / EJ = 8/\u221A20. In de rechthoekige driehoek FIG is tan \u2220FIG = FG/FI = \u221A5; de standhoek is ongeveer 65,91\xB0.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                4,
                0,
                0
              ],
              C: [
                4,
                4,
                0
              ],
              D: [
                0,
                4,
                0
              ],
              E: [
                0,
                0,
                4
              ],
              F: [
                4,
                0,
                4
              ],
              G: [
                4,
                4,
                4
              ],
              H: [
                0,
                4,
                4
              ],
              J: [
                4,
                0,
                2
              ],
              I: [
                3.2,
                0,
                2.4
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            caption: "I is de loodrechte projectie van F op EJ. FI en GI staan loodrecht op EJ; \u2220FIG is de standhoek.",
            view: "spatial",
            highlights: [
              "EJ",
              "FI",
              "GI",
              "FG"
            ],
            planes: [
              [
                "E",
                "J",
                "G"
              ],
              [
                "A",
                "B",
                "F",
                "E"
              ]
            ]
          }
        }
      ],
      questionIds: [
        "l4-dihedral-q1",
        "l4-dihedral-q2",
        "l4-dihedral-q3",
        "l4-dihedral-q4"
      ],
      probeIds: [
        "l4-dihedral-p1",
        "l4-dihedral-p2"
      ],
      retestIds: [
        "l4-dihedral-r1",
        "l4-dihedral-r2"
      ],
      repair: {
        title: "Een gemeenschappelijk hoekpunt is nog geen standhoek",
        text: "Begin bij de snijlijn AB van ABCD en ABGH. Kies door A in elk vlak een lijn loodrecht op AB: AD en AH. Pas dan meet \u2220DAH de hoek tussen de vlakken. \u2220GAB deelt wel hoekpunt A, maar gebruikt de snijlijn zelf als been en meet daardoor iets anders. De twee loodrechte voorwaarden zijn essentieel.",
        scene: {
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              4,
              0,
              0
            ],
            C: [
              4,
              4,
              0
            ],
            D: [
              0,
              4,
              0
            ],
            E: [
              0,
              0,
              4
            ],
            F: [
              4,
              0,
              4
            ],
            G: [
              4,
              4,
              4
            ],
            H: [
              0,
              4,
              4
            ]
          },
          edges: [
            "AB",
            "BC",
            "CD",
            "DA",
            "EF",
            "FG",
            "GH",
            "HE",
            "AE",
            "BF",
            "CG",
            "DH"
          ],
          showCube: false,
          caption: "AD en AH staan beide loodrecht op snijlijn AB. \u2220DAH is een standhoek.",
          view: "spatial",
          highlights: [
            "AB",
            "AD",
            "AH"
          ],
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
              "G",
              "H"
            ]
          ]
        }
      },
      misconception: {
        label: "Een willekeurig lijnenpaar met gedeeld hoekpunt als standhoek kiezen",
        trigger: {
          qid: "l4-dihedral-q1",
          wrongAnswer: "b"
        },
        probeWrongAnswers: [
          "d",
          "d"
        ]
      }
    },
    {
      id: "l5-point-line",
      level: 5,
      title: "Punt tot lijn",
      subtitle: "Vind de voet, kies het juiste vlak en bereken de kortste lengte.",
      theory: [
        {
          title: "Afstand zoekt een loodrechte verbinding",
          text: "De afstand van een punt P tot een lijn l is de lengte van PP\u2032 met P\u2032 op l en PP\u2032 \u27C2 l. Kies eerst het vlak door P en l. In het voorvlak van de kubus ligt de voet van F op EB in het midden M. Bij ribbe 6 is FM = 3\u221A2 cm. Een verbinding met E of B is langer.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ],
              M: [
                0.5,
                0,
                0.5
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "EB"
            ],
            planes: [],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
            segments: [
              {
                from: [
                  1,
                  0,
                  1
                ],
                to: [
                  0.5,
                  0,
                  0.5
                ],
                color: "#65d6af",
                dashed: false
              }
            ]
          }
        },
        {
          title: "Een oppervlakte levert ook de hoogte",
          text: "In een rechthoekige driehoek met rechthoekszijden 6 en 4 is de schuine zijde \u221A52. Schrijf de oppervlakte op twee manieren: \xBD \xD7 6 \xD7 4 = \xBD \xD7 \u221A52 \xD7 h. De loodrechte afstand van de rechte hoek tot de schuine zijde is dus 24/\u221A52 \u2248 3,33 cm.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              P: [
                0,
                4,
                0
              ]
            },
            edges: [
              "AB",
              "BP",
              "PA"
            ],
            showCube: false,
            highlights: [],
            planes: [],
            caption: "Rechthoekige driehoek ABP: AB = 6 cm, AP = 4 cm en AP \u27C2 AB.",
            segments: [
              {
                from: [
                  0,
                  0,
                  0
                ],
                to: [
                  1.8461538461538463,
                  2.769230769230769,
                  0
                ],
                color: "#65d6af",
                dashed: false
              }
            ]
          }
        },
        {
          title: "De voet mag buiten een lijnstuk liggen",
          text: "Een lijn loopt onbeperkt door. Hier zijn A = (0,0), B = (4,0) en P = (6,3) in cm. De voet N = (6,0) ligt voorbij B. Daarom is d(P,AB) = 3 cm, terwijl de kortste afstand tot het lijnstuk AB gelijk is aan PB = \u221A13 cm.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                4,
                0,
                0
              ],
              P: [
                6,
                3,
                0
              ],
              N: [
                6,
                0,
                0
              ]
            },
            edges: [
              "AB",
              "BP",
              "PA"
            ],
            showCube: false,
            highlights: [],
            planes: [],
            caption: "AB is de volledige lijn door A en B; N ligt op het verlengde.",
            segments: [
              {
                from: [
                  4,
                  0,
                  0
                ],
                to: [
                  7,
                  0,
                  0
                ],
                color: "#67c9eb",
                dashed: true
              },
              {
                from: [
                  6,
                  3,
                  0
                ],
                to: [
                  6,
                  0,
                  0
                ],
                color: "#65d6af",
                dashed: false
              }
            ]
          }
        }
      ],
      questionIds: [
        "l5-point-line-q1",
        "l5-point-line-q2",
        "l5-point-line-q3",
        "l5-point-line-q4"
      ],
      probeIds: [
        "l5-point-line-p1",
        "l5-point-line-p2"
      ],
      retestIds: [
        "l5-point-line-r1",
        "l5-point-line-r2"
      ],
      repair: {
        title: "De kortste verbinding eindigt niet altijd bij een hoekpunt",
        text: "Zoek op de hele lijn de voet van de loodlijn. Bij een kubus met ribbe 6 heeft FE lengte 6, maar FM naar het midden van EB heeft lengte 3\u221A2 en is korter. Controleer zowel M \u2208 EB als FM \u27C2 EB.",
        scene: {
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              1,
              0,
              0
            ],
            C: [
              1,
              1,
              0
            ],
            D: [
              0,
              1,
              0
            ],
            E: [
              0,
              0,
              1
            ],
            F: [
              1,
              0,
              1
            ],
            G: [
              1,
              1,
              1
            ],
            H: [
              0,
              1,
              1
            ],
            M: [
              0.5,
              0,
              0.5
            ]
          },
          edges: [
            "AB",
            "BC",
            "CD",
            "DA",
            "EF",
            "FG",
            "GH",
            "HE",
            "AE",
            "BF",
            "CG",
            "DH"
          ],
          showCube: true,
          dimensions: [
            6,
            6,
            6
          ],
          highlights: [
            "EB"
          ],
          planes: [],
          caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
          segments: [
            {
              from: [
                1,
                0,
                1
              ],
              to: [
                0.5,
                0,
                0.5
              ],
              color: "#65d6af",
              dashed: false
            }
          ]
        }
      },
      misconception: {
        label: "De afstand tot een lijn wordt vervangen door de afstand tot een benoemd eindpunt.",
        trigger: {
          qid: "l5-point-line-q1",
          wrongAnswer: "endpoint"
        },
        probeWrongAnswers: [
          "endpoint",
          "endpoint"
        ]
      }
    },
    {
      id: "l5-point-plane",
      level: 5,
      title: "Punt tot vlak",
      subtitle: "Onderbouw de loodrechte stand en kies een bruikbaar hulpvlak.",
      theory: [
        {
          title: "Loodrecht op een vlak vraagt twee richtingen",
          text: "Een lijn door N staat loodrecht op vlak V als zij loodrecht staat op twee snijdende lijnen van V door N. In de kubus staat AB loodrecht op AD \xE9n AE; daardoor AB \u27C2 ADHE. Alleen AC \u27C2 AE zou niet genoeg zijn: AC loopt schuin ten opzichte van ADHE.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "AB",
              "AD",
              "AE"
            ],
            planes: [
              [
                "A",
                "D",
                "H",
                "E"
              ]
            ],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
          }
        },
        {
          title: "Breng de afstand terug naar een vlakke figuur",
          text: "Voor d(B,ACGE) kun je in grondvlak ABCD werken. Het diagonaalvlak bevat de verticale richting AE. De loodlijn uit B op AC is ook loodrecht op die verticale richting. Met M als snijpunt van AC en BD is BM dus de gezochte afstand. Bij ribbe 6 is BM = 3\u221A2 cm.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ],
              M: [
                0.5,
                0.5,
                0
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "AC"
            ],
            planes: [
              [
                "A",
                "C",
                "G",
                "E"
              ]
            ],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
            segments: [
              {
                from: [
                  1,
                  0,
                  0
                ],
                to: [
                  0.5,
                  0.5,
                  0
                ],
                color: "#65d6af",
                dashed: false
              }
            ]
          }
        },
        {
          title: "Een hulpvlak moet de loodrechte richting bevatten",
          text: "Een willekeurig vlak door het punt geeft niet vanzelf een afstand tot het doelvlak. Bij een kubus en het schuine vlak AFH is vlak ACGE bruikbaar. Met I het midden van FH geldt EI \u27C2 FH en AE \u27C2 FH. De afstand van E tot AFH wordt zo de hoogte uit E in driehoek AEI op AI.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ],
              I: [
                0.5,
                0.5,
                1
              ],
              N: [
                0.3333333333333333,
                0.3333333333333333,
                0.6666666666666666
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "AI"
            ],
            planes: [
              [
                "A",
                "F",
                "H"
              ],
              [
                "A",
                "C",
                "G",
                "E"
              ]
            ],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
            segments: [
              {
                from: [
                  0,
                  0,
                  1
                ],
                to: [
                  0.3333333333333333,
                  0.3333333333333333,
                  0.6666666666666666
                ],
                color: "#65d6af",
                dashed: false
              }
            ]
          }
        }
      ],
      questionIds: [
        "l5-point-plane-q1",
        "l5-point-plane-q2",
        "l5-point-plane-q3",
        "l5-point-plane-q4"
      ],
      probeIds: [
        "l5-point-plane-p1",
        "l5-point-plane-p2"
      ],
      retestIds: [
        "l5-point-plane-r1",
        "l5-point-plane-r2"
      ],
      repair: {
        title: "E\xE9n richting bepaalt nog geen vlak",
        text: "AC \u27C2 AE is waar, maar AC is niet loodrecht op vlak ADHE. Vergelijk met AB: AB \u27C2 AE \xE9n AB \u27C2 AD. Deze twee snijdende richtingen zijn samen w\xE9l voldoende om AB \u27C2 ADHE te bewijzen.",
        scene: {
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              1,
              0,
              0
            ],
            C: [
              1,
              1,
              0
            ],
            D: [
              0,
              1,
              0
            ],
            E: [
              0,
              0,
              1
            ],
            F: [
              1,
              0,
              1
            ],
            G: [
              1,
              1,
              1
            ],
            H: [
              0,
              1,
              1
            ]
          },
          edges: [
            "AB",
            "BC",
            "CD",
            "DA",
            "EF",
            "FG",
            "GH",
            "HE",
            "AE",
            "BF",
            "CG",
            "DH"
          ],
          showCube: true,
          dimensions: [
            6,
            6,
            6
          ],
          highlights: [
            "AC",
            "AB",
            "AD",
            "AE"
          ],
          planes: [
            [
              "A",
              "D",
              "H",
              "E"
            ]
          ],
          caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
        }
      },
      misconception: {
        label: "E\xE9n loodrechte lijn in een vlak wordt voldoende geacht voor loodrechte stand op het hele vlak.",
        trigger: {
          qid: "l5-point-plane-q1",
          wrongAnswer: "one"
        },
        probeWrongAnswers: [
          "one",
          "one"
        ]
      }
    },
    {
      id: "l5-volume",
      level: 5,
      title: "Afstand via inhoud",
      subtitle: "Bereken \xE9\xE9n piramide op twee manieren.",
      theory: [
        {
          title: "Dezelfde piramide, een ander grondvlak",
          text: "Bij een tetra\xEBder kun je elk zijvlak als grondvlak kiezen. De inhoud verandert daardoor niet. Gebruik eerst een grondvlak en hoogte die eenvoudig zijn. Schrijf daarna dezelfde inhoud als \u2153 \xD7 de oppervlakte van het doelvlak \xD7 de gezochte afstand.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                0,
                3,
                0
              ],
              T: [
                0,
                0,
                6
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA",
              "AT",
              "BT",
              "CT"
            ],
            showCube: false,
            highlights: [],
            planes: [],
            caption: "Tetra\xEBder ABCT: AB = 6 cm, AC = 3 cm, AT = 6 cm; AB, AC en AT zijn onderling loodrecht."
          }
        },
        {
          title: "Los de factor \xE9\xE9n derde mee op",
          text: "Uit V = \u2153Bh volgt h = 3V/B. Voor een tetra\xEBder met inhoud 18 cm\xB3 en grondvlakoppervlakte 9 cm\xB2 is de hoogte dus 6 cm. De breuk V/B = 2 cm mist de factor 3. De eenheden helpen: cm\xB3/cm\xB2 geeft cm.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                0,
                3,
                0
              ],
              T: [
                0,
                0,
                6
              ]
            },
            edges: [
              "AB",
              "BC",
              "CA",
              "AT",
              "BT",
              "CT"
            ],
            showCube: false,
            highlights: [],
            planes: [],
            caption: "Tetra\xEBder ABCT: AB = 6 cm, AC = 3 cm, AT = 6 cm; AB, AC en AT zijn onderling loodrecht.",
            segments: [
              {
                from: [
                  0,
                  0,
                  6
                ],
                to: [
                  0,
                  0,
                  0
                ],
                color: "#65d6af",
                dashed: false
              }
            ]
          }
        },
        {
          title: "Een afstand naar een schuin kubusvlak",
          text: "In kubus met ribbe 6 is tetra\xEBder F.BGE eenvoudig te berekenen met grondvlak FGE en hoogte FB. V = \u2153 \xD7 18 \xD7 6 = 36 cm\xB3. Driehoek BGE is gelijkzijdig met zijde 6\u221A2 en oppervlakte 18\u221A3. Dus d(F,BGE) = 108/(18\u221A3) = 2\u221A3 cm.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ],
              N: [
                0.6666666666666666,
                0.3333333333333333,
                0.6666666666666666
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "BG",
              "GE",
              "EB"
            ],
            planes: [
              [
                "B",
                "G",
                "E"
              ]
            ],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
            segments: [
              {
                from: [
                  1,
                  0,
                  1
                ],
                to: [
                  0.6666666666666666,
                  0.3333333333333333,
                  0.6666666666666666
                ],
                color: "#65d6af",
                dashed: false
              }
            ]
          }
        }
      ],
      questionIds: [
        "l5-volume-q1",
        "l5-volume-q2",
        "l5-volume-q3",
        "l5-volume-q4"
      ],
      probeIds: [
        "l5-volume-p1",
        "l5-volume-p2"
      ],
      retestIds: [
        "l5-volume-r1",
        "l5-volume-r2"
      ],
      repair: {
        title: "Behoud de factor \u2153",
        text: "Een piramide is geen prisma: V = \u2153Bh. Daarom krijg je h pas door 3V door B te delen. Bij V = 18 cm\xB3 en B = 9 cm\xB2 geeft h = 6 cm bij terugsubstitutie \u2153 \xD7 9 \xD7 6 = 18 cm\xB3.",
        scene: {
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              6,
              0,
              0
            ],
            C: [
              0,
              3,
              0
            ],
            T: [
              0,
              0,
              6
            ]
          },
          edges: [
            "AB",
            "BC",
            "CA",
            "AT",
            "BT",
            "CT"
          ],
          showCube: false,
          highlights: [],
          planes: [],
          caption: "Tetra\xEBder ABCT: AB = 6 cm, AC = 3 cm, AT = 6 cm; AB, AC en AT zijn onderling loodrecht.",
          segments: [
            {
              from: [
                0,
                0,
                6
              ],
              to: [
                0,
                0,
                0
              ],
              color: "#65d6af",
              dashed: false
            }
          ]
        }
      },
      misconception: {
        label: "De prismaformule h = V/B wordt gebruikt voor een piramide.",
        trigger: {
          qid: "l5-volume-q1",
          wrongAnswer: "divide"
        },
        probeWrongAnswers: [
          "divide",
          "divide"
        ]
      }
    },
    {
      id: "l5-model",
      level: 5,
      title: "Van figuur naar formule",
      subtitle: "Gelijkvormigheid, inhoud en een controle van het domein.",
      theory: [
        {
          title: "Breedte groeit volgens gelijkvormigheid",
          text: "In deze bak is de bodem 2 dm breed en de bovenkant 6 dm, op 4 dm hoogte. De totale breedtetoename is 4 dm over 4 dm hoogte. Daarom geldt w(h) = 2 + h voor 0 \u2264 h \u2264 4. Op halve hoogte h = 2 is de breedte 4 dm. Alleen de toename is evenredig met h; de totale breedte start bij 2.",
          scene: {
            points: {
              A: [
                -1,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                3,
                0,
                4
              ],
              D: [
                -3,
                0,
                4
              ],
              E: [
                -1,
                10,
                0
              ],
              F: [
                1,
                10,
                0
              ],
              G: [
                3,
                10,
                4
              ],
              H: [
                -3,
                10,
                4
              ],
              P: [
                -2,
                0,
                2
              ],
              Q: [
                2,
                0,
                2
              ],
              R: [
                2,
                10,
                2
              ],
              S: [
                -2,
                10,
                2
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            highlights: [],
            planes: [
              [
                "P",
                "Q",
                "R",
                "S"
              ]
            ],
            caption: "Rechte open bak van 10 dm lang. Trapeziumdoorsnede: bodem 2 dm, bovenkant 6 dm, verticale hoogte 4 dm. Symmetrische schuine wanden."
          }
        },
        {
          title: "De inhoud is een trapezium, geen rechthoek",
          text: "Tot waterhoogte h heeft de doorsnede evenwijdige zijden 2 en 2+h. De oppervlakte is \xBD(2 + 2+h)h. Vermenigvuldig met baklengte 10: V(h) = 20h + 5h\xB2 dm\xB3. Controleer V(0) = 0 en V(4) = 160 dm\xB3. Bij h = 2 zit er 60 dm\xB3 in, minder dan de helft.",
          scene: {
            points: {
              A: [
                -1,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                3,
                0,
                4
              ],
              D: [
                -3,
                0,
                4
              ],
              E: [
                -1,
                10,
                0
              ],
              F: [
                1,
                10,
                0
              ],
              G: [
                3,
                10,
                4
              ],
              H: [
                -3,
                10,
                4
              ],
              P: [
                -2,
                0,
                2
              ],
              Q: [
                2,
                0,
                2
              ],
              R: [
                2,
                10,
                2
              ],
              S: [
                -2,
                10,
                2
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            highlights: [],
            planes: [
              [
                "P",
                "Q",
                "R",
                "S"
              ]
            ],
            caption: "Rechte open bak van 10 dm lang. Trapeziumdoorsnede: bodem 2 dm, bovenkant 6 dm, verticale hoogte 4 dm. Symmetrische schuine wanden."
          }
        },
        {
          title: "Een gevouwen bak levert een andere formule",
          text: "Een nieuwe bak wordt gevouwen uit een plaat van 60 cm breed en 40 cm lang. Bodem x, bovenopening 2x. Elke schuine wand heeft lengte (60\u2212x)/2 en wijkt horizontaal x/2 uit. Pythagoras geeft h\xB2 = ((60\u2212x)/2)\xB2 \u2212 (x/2)\xB2 = 900\u221230x. Dus V(x) = 60x\u221A(900\u221230x) cm\xB3, met 0 < x < 30 voor een echte bak.",
          scene: {
            points: {
              A: [
                -6,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                12,
                0,
                23.2379000772445
              ],
              D: [
                -12,
                0,
                23.2379000772445
              ],
              E: [
                -6,
                40,
                0
              ],
              F: [
                6,
                40,
                0
              ],
              G: [
                12,
                40,
                23.2379000772445
              ],
              H: [
                -12,
                40,
                23.2379000772445
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            highlights: [],
            planes: [],
            caption: "Oorspronkelijke vouwbak: plaatbreedte 60 cm, baklengte 40 cm, bodem x = 12 cm en bovenopening 2x = 24 cm. De twee schuine wanden zijn even breed. Hoogte h is onbekend."
          }
        }
      ],
      questionIds: [
        "l5-model-q1",
        "l5-model-q2",
        "l5-model-q3",
        "l5-model-q4"
      ],
      probeIds: [
        "l5-model-p1",
        "l5-model-p2"
      ],
      retestIds: [
        "l5-model-r1",
        "l5-model-r2"
      ],
      repair: {
        title: "De beginwaarde hoort in de formule",
        text: "Bij h = 0 is de breedte al 2 dm. Gelijkvormigheid geldt voor de extra driehoekjes naast die bodem. Daarom is de toename h, en de volledige breedte 2+h. Controleer een formule steeds aan de onderkant \xE9n bovenkant van de bak.",
        scene: {
          points: {
            A: [
              -1,
              0,
              0
            ],
            B: [
              1,
              0,
              0
            ],
            C: [
              3,
              0,
              4
            ],
            D: [
              -3,
              0,
              4
            ],
            E: [
              -1,
              10,
              0
            ],
            F: [
              1,
              10,
              0
            ],
            G: [
              3,
              10,
              4
            ],
            H: [
              -3,
              10,
              4
            ],
            P: [
              -2,
              0,
              2
            ],
            Q: [
              2,
              0,
              2
            ],
            R: [
              2,
              10,
              2
            ],
            S: [
              -2,
              10,
              2
            ]
          },
          edges: [
            "AB",
            "BC",
            "CD",
            "DA",
            "EF",
            "FG",
            "GH",
            "HE",
            "AE",
            "BF",
            "CG",
            "DH"
          ],
          showCube: false,
          highlights: [],
          planes: [
            [
              "P",
              "Q",
              "R",
              "S"
            ]
          ],
          caption: "Rechte open bak van 10 dm lang. Trapeziumdoorsnede: bodem 2 dm, bovenkant 6 dm, verticale hoogte 4 dm. Symmetrische schuine wanden."
        }
      },
      misconception: {
        label: "De totale breedte wordt evenredig met de hoogte verondersteld, terwijl de bodem al breedte heeft.",
        trigger: {
          qid: "l5-model-q1",
          wrongAnswer: "origin"
        },
        probeWrongAnswers: [
          "origin",
          "origin"
        ]
      }
    },
    {
      id: "l6-common-perpendicular",
      level: 6,
      title: "Kruisende lijnen meten",
      subtitle: "Een gemeenschappelijke loodlijn staat op beide lijnen loodrecht.",
      theory: [
        {
          title: "Twee vrije eindpunten, twee loodrechte richtingen",
          text: "De afstand tussen twee kruisende lijnen is de lengte van hun gemeenschappelijke loodlijn. Haar voetpunten liggen op de twee lijnen en de verbinding staat loodrecht op beide. In de kubus vormt BC de gemeenschappelijke loodlijn van AB en CG; d(AB,CG) = 6 cm.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "AB",
              "CG"
            ],
            planes: [],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
            segments: [
              {
                from: [
                  1,
                  0,
                  0
                ],
                to: [
                  1,
                  1,
                  0
                ],
                color: "#65d6af",
                dashed: false
              }
            ]
          }
        },
        {
          title: "Een punt-lijnafstand is slechts een kandidaat",
          text: "Kies je willekeurig A op AB, dan is d(A,CG) = AC = 6\u221A2. Dat is groter dan d(AB,CG) = BC = 6. Het punt op de eerste lijn moet ook mogen verschuiven. Alleen een verbinding die op beide richtingen loodrecht staat kan de lijnafstand zijn.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "AB",
              "CG"
            ],
            planes: [],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
            segments: [
              {
                from: [
                  0,
                  0,
                  0
                ],
                to: [
                  1,
                  1,
                  0
                ],
                color: "#ffa55c",
                dashed: false
              },
              {
                from: [
                  1,
                  0,
                  0
                ],
                to: [
                  1,
                  1,
                  0
                ],
                color: "#65d6af",
                dashed: false
              }
            ]
          }
        },
        {
          title: "Een snijpunt op het scherm is geen ruimtelijk snijpunt",
          text: "De diagonalen AC in het grondvlak en FH in het bovenvlak kunnen in een projectie over elkaar lopen. Ze liggen in verschillende horizontale vlakken en zijn kruisend. Hun verticale verbinding tussen de middelpunten O en I is loodrecht op beide. De afstand is de kubushoogte.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ],
              O: [
                0.5,
                0.5,
                0
              ],
              I: [
                0.5,
                0.5,
                1
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "AC",
              "FH"
            ],
            planes: [],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
            segments: [
              {
                from: [
                  0.5,
                  0.5,
                  0
                ],
                to: [
                  0.5,
                  0.5,
                  1
                ],
                color: "#65d6af",
                dashed: false
              }
            ]
          }
        }
      ],
      questionIds: [
        "l6-common-perpendicular-q1",
        "l6-common-perpendicular-q2",
        "l6-common-perpendicular-q3",
        "l6-common-perpendicular-q4"
      ],
      probeIds: [
        "l6-common-perpendicular-p1",
        "l6-common-perpendicular-p2"
      ],
      retestIds: [
        "l6-common-perpendicular-r1",
        "l6-common-perpendicular-r2"
      ],
      repair: {
        title: "Laat ook het eerste voetpunt vrij",
        text: "Bij AB en CG is AC niet de kortste verbinding: A kan over AB naar B verschuiven. De verbinding BC is loodrecht op beide lijnen. Een willekeurig punt op een lijn mag je dus niet zonder meer gebruiken voor een punt-lijnafstand.",
        scene: {
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              1,
              0,
              0
            ],
            C: [
              1,
              1,
              0
            ],
            D: [
              0,
              1,
              0
            ],
            E: [
              0,
              0,
              1
            ],
            F: [
              1,
              0,
              1
            ],
            G: [
              1,
              1,
              1
            ],
            H: [
              0,
              1,
              1
            ]
          },
          edges: [
            "AB",
            "BC",
            "CD",
            "DA",
            "EF",
            "FG",
            "GH",
            "HE",
            "AE",
            "BF",
            "CG",
            "DH"
          ],
          showCube: true,
          dimensions: [
            6,
            6,
            6
          ],
          highlights: [
            "AB",
            "CG"
          ],
          planes: [],
          caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
          segments: [
            {
              from: [
                0,
                0,
                0
              ],
              to: [
                1,
                1,
                0
              ],
              color: "#ffa55c",
              dashed: false
            },
            {
              from: [
                1,
                0,
                0
              ],
              to: [
                1,
                1,
                0
              ],
              color: "#65d6af",
              dashed: false
            }
          ]
        }
      },
      misconception: {
        label: "De afstand tussen twee lijnen wordt gelijkgesteld aan de afstand vanuit \xE9\xE9n willekeurig punt tot de andere lijn.",
        trigger: {
          qid: "l6-common-perpendicular-q1",
          wrongAnswer: "onepoint"
        },
        probeWrongAnswers: [
          "onepoint",
          "onepoint"
        ]
      }
    },
    {
      id: "l6-parallel-plane",
      level: 6,
      title: "Van twee lijnen naar \xE9\xE9n vlak",
      subtitle: "Kies een hulpvlak dat de eerste lijn bevat en de tweede richting volgt.",
      theory: [
        {
          title: "Bouw een vlak uit beide richtingen",
          text: "Voor kruisende lijnen l en m maak je een hulpvlak V door l dat evenwijdig is aan m. Teken door een punt van l een lijn evenwijdig aan m; samen met l bepaalt die V. Daarna mag je w\xE9l een willekeurig punt P van m kiezen: d(l,m) = d(P,V). Dit geldt omdat de lijnen niet evenwijdig zijn en de projectie van m in V de lijn l snijdt.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ],
              T: [
                -1,
                1,
                1
              ],
              U: [
                0,
                2,
                1
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "AC",
              "BH",
              "AT"
            ],
            planes: [
              [
                "A",
                "C",
                "U",
                "T"
              ]
            ],
            caption: "Voorbeeld l = AC en m = BH. V is het hulpvlak ACUT: het bevat AC en AT \u2225 BH. De vlakvulling toont V; BH ligt erbuiten."
          }
        },
        {
          title: "Controleer de richting, niet de ligging op papier",
          text: "Voor AC en BH kun je V opspannen met AC en AT, waarbij T = (\u22121,1,1) in een kubus met eenheidsco\xF6rdinaten. AT heeft dezelfde richting als BH. Het hulpvlak heeft vergelijking x\u2212y+2z = 0. Het grondvlak ABCD is ongeschikt: BH heeft een verticale component en is dus niet evenwijdig aan dat grondvlak.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ],
              T: [
                -1,
                1,
                1
              ],
              U: [
                0,
                2,
                1
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "AC",
              "BH",
              "AT"
            ],
            planes: [
              [
                "A",
                "C",
                "U",
                "T"
              ]
            ],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
          }
        },
        {
          title: "Bereken de afstand in een passend hulpvlak",
          text: "In een kubus met ribbe a is d(AC,BH) = a/\u221A6. Een meetkundige route gebruikt O, het midden van AC, in vlak BDHF. De afstand is de hoogte uit O op BH in driehoek OBH. BO = a/\u221A2 en OH = a\u221A(3/2), terwijl BH = a\u221A3. Opp(OBH) = a\xB2/(2\u221A2), dus de hoogte is a/\u221A6.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ],
              O: [
                0.5,
                0.5,
                0
              ],
              N: [
                0.6666666666666666,
                0.3333333333333333,
                0.3333333333333333
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "AC",
              "BH",
              "OB",
              "OH"
            ],
            planes: [
              [
                "B",
                "D",
                "H",
                "F"
              ]
            ],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
            segments: [
              {
                from: [
                  0.5,
                  0.5,
                  0
                ],
                to: [
                  0.6666666666666666,
                  0.3333333333333333,
                  0.3333333333333333
                ],
                color: "#65d6af",
                dashed: false
              }
            ]
          }
        }
      ],
      questionIds: [
        "l6-parallel-plane-q1",
        "l6-parallel-plane-q2",
        "l6-parallel-plane-q3",
        "l6-parallel-plane-q4"
      ],
      probeIds: [
        "l6-parallel-plane-p1",
        "l6-parallel-plane-p2"
      ],
      retestIds: [
        "l6-parallel-plane-r1",
        "l6-parallel-plane-r2"
      ],
      repair: {
        title: "Er zijn twee voorwaarden voor het hulpvlak",
        text: "Dat V de eerste lijn bevat is noodzakelijk, maar niet voldoende. V moet ook evenwijdig zijn aan de tweede lijn. Voor AB en CG werkt ABFE: AB ligt erin en BF \u2225 CG. ABCD bevat wel AB, maar CG staat er loodrecht op; dat geeft de verkeerde reductie.",
        scene: {
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              1,
              0,
              0
            ],
            C: [
              1,
              1,
              0
            ],
            D: [
              0,
              1,
              0
            ],
            E: [
              0,
              0,
              1
            ],
            F: [
              1,
              0,
              1
            ],
            G: [
              1,
              1,
              1
            ],
            H: [
              0,
              1,
              1
            ]
          },
          edges: [
            "AB",
            "BC",
            "CD",
            "DA",
            "EF",
            "FG",
            "GH",
            "HE",
            "AE",
            "BF",
            "CG",
            "DH"
          ],
          showCube: true,
          dimensions: [
            6,
            6,
            6
          ],
          highlights: [
            "AB",
            "CG",
            "BF"
          ],
          planes: [
            [
              "A",
              "B",
              "F",
              "E"
            ]
          ],
          caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
        }
      },
      misconception: {
        label: "Een willekeurig vlak door de eerste lijn wordt geschikt geacht, zonder de parallelvoorwaarde met de tweede lijn.",
        trigger: {
          qid: "l6-parallel-plane-q1",
          wrongAnswer: "contain"
        },
        probeWrongAnswers: [
          "contain",
          "contain"
        ]
      }
    },
    {
      id: "l6-method",
      level: 6,
      title: "Zelf de methode kiezen",
      subtitle: "Combineer projecties, standvlakken, afstanden en formulemodellen.",
      theory: [
        {
          title: "Een hoek met een vlak gebruikt de projectie",
          text: "Voor de hoek tussen AG en ABCD projecteer je G loodrecht naar C. De projectie van AG is AC. Daarom is de gevraagde hoek \u2220GAC. Bij ribbe 6 geldt tan \u03B1 = CG/AC = 1/\u221A2, dus \u03B1 \u2248 35\xB0. De hoek met de verticale richting is de aanvullende hoek.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "AG",
              "AC",
              "CG"
            ],
            planes: [
              [
                "A",
                "B",
                "C",
                "D"
              ]
            ],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
          }
        },
        {
          title: "Een vlakkenhoek gebruikt een standvlak",
          text: "Vlakken ACG en ABCD snijden elkaar in AC. Een standvlak moet loodrecht staan op AC. In een kubus is vlak BDHF geschikt. Het snijdt de twee vlakken in OI en BD, met O het midden van AC en I het midden van EG. Die lijnen staan loodrecht, dus de vlakkenhoek is 90\xB0. Een willekeurige hoek bij A is niet voldoende.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                1,
                0,
                0
              ],
              C: [
                1,
                1,
                0
              ],
              D: [
                0,
                1,
                0
              ],
              E: [
                0,
                0,
                1
              ],
              F: [
                1,
                0,
                1
              ],
              G: [
                1,
                1,
                1
              ],
              H: [
                0,
                1,
                1
              ],
              O: [
                0.5,
                0.5,
                0
              ],
              I: [
                0.5,
                0.5,
                1
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: true,
            dimensions: [
              6,
              6,
              6
            ],
            highlights: [
              "AC",
              "BD",
              "OI"
            ],
            planes: [
              [
                "A",
                "C",
                "G",
                "E"
              ],
              [
                "B",
                "D",
                "H",
                "F"
              ]
            ],
            caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
          }
        },
        {
          title: "Kies eerst het doel, reken daarna",
          text: "Een afstand vraagt om een loodrechte lengte; een hoek vraagt om twee juiste richtingen. Bij een afgeknotte balk blijven deze regels geldig. Een formulemodel vraagt bovendien een domein en een controle met de figuur. Noteer daarom eerst wat je construeert, waarom het geldig is en pas daarna de berekening.",
          scene: {
            points: {
              A: [
                0,
                0,
                0
              ],
              B: [
                6,
                0,
                0
              ],
              C: [
                6,
                4,
                0
              ],
              D: [
                0,
                4,
                0
              ],
              E: [
                0,
                0,
                5
              ],
              F: [
                6,
                0,
                2
              ],
              G: [
                6,
                4,
                2
              ],
              H: [
                0,
                4,
                5
              ]
            },
            edges: [
              "AB",
              "BC",
              "CD",
              "DA",
              "EF",
              "FG",
              "GH",
              "HE",
              "AE",
              "BF",
              "CG",
              "DH"
            ],
            showCube: false,
            highlights: [],
            planes: [
              [
                "E",
                "F",
                "G",
                "H"
              ]
            ],
            caption: "Afgeknotte balk: rechthoekig grondvlak 6 \xD7 4 cm. Hoogtes AE = DH = 5 cm en BF = CG = 2 cm; EFGH is een vlak."
          }
        }
      ],
      questionIds: [
        "l6-method-q1",
        "l6-method-q2",
        "l6-method-q3",
        "l6-method-q4"
      ],
      probeIds: [
        "l6-method-p1",
        "l6-method-p2"
      ],
      retestIds: [
        "l6-method-r1",
        "l6-method-r2"
      ],
      repair: {
        title: "De projectiehoek en normaalhoek vullen elkaar aan",
        text: "In driehoek ACG is \u2220GAC de hoek van AG met ABCD. CG staat loodrecht op het grondvlak. Daarom is \u2220AGC de hoek met de normaalrichting en geldt \u2220GAC + \u2220AGC = 90\xB0. Projecteer eerst, zodat je niet per ongeluk de aanvullende hoek berekent.",
        scene: {
          points: {
            A: [
              0,
              0,
              0
            ],
            B: [
              1,
              0,
              0
            ],
            C: [
              1,
              1,
              0
            ],
            D: [
              0,
              1,
              0
            ],
            E: [
              0,
              0,
              1
            ],
            F: [
              1,
              0,
              1
            ],
            G: [
              1,
              1,
              1
            ],
            H: [
              0,
              1,
              1
            ]
          },
          edges: [
            "AB",
            "BC",
            "CD",
            "DA",
            "EF",
            "FG",
            "GH",
            "HE",
            "AE",
            "BF",
            "CG",
            "DH"
          ],
          showCube: true,
          dimensions: [
            6,
            6,
            6
          ],
          highlights: [
            "AG",
            "AC",
            "CG"
          ],
          planes: [
            [
              "A",
              "B",
              "C",
              "D"
            ]
          ],
          caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
        }
      },
      misconception: {
        label: "De hoek met de normaal wordt verward met de hoek tussen lijn en vlak.",
        trigger: {
          qid: "l6-method-q1",
          wrongAnswer: "normal"
        },
        probeWrongAnswers: [
          "normal",
          "normal"
        ]
      }
    }
  ],
  questions: [
    {
      id: "l2-hulpvlak-1",
      block: "l2-hulpvlak",
      skill: "construeren",
      type: "choice",
      prompt: "Je zoekt AG \u2229 vlak BDE. Welk hulpvlak voldoet aan de noodzakelijke voorwaarde?",
      options: [
        {
          id: "a",
          text: "ABCD: het is genoeg dat het hulpvlak het doelvlak snijdt."
        },
        {
          id: "b",
          text: "EFGH: een hulpvlak moet altijd het bovenvlak zijn."
        },
        {
          id: "c",
          text: "ACGE: de gehele lijn AG ligt in dit vlak."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "ACGE bevat AG. Het hulpvlak moet de te onderzoeken lijn bevatten; alleen het doelvlak snijden is onvoldoende.",
      hint: "Controleer of beide punten A en G in het gekozen vlak liggen.",
      scene: {
        caption: "Kubus ABCD.EFGH. Gezocht: het snijpunt van lijn AG met vlak BDE.",
        showCube: true,
        highlights: [
          "AG"
        ],
        planes: [
          [
            "B",
            "D",
            "E"
          ]
        ]
      },
      revealScene: {
        caption: "ACGE bevat AG. K is het midden van BD; E en K liggen in beide vlakken.",
        showCube: true,
        points: {
          K: [
            0.5,
            0.5,
            0
          ]
        },
        highlights: [
          "AG",
          "EK"
        ],
        planes: [
          [
            "A",
            "C",
            "G",
            "E"
          ],
          [
            "B",
            "D",
            "E"
          ]
        ]
      }
    },
    {
      id: "l2-hulpvlak-2",
      block: "l2-hulpvlak",
      skill: "construeren",
      type: "points",
      prompt: "K is het midden van BD. Selecteer de twee gegeven punten waarmee je de snijlijn van de vlakken ACGE en BDE kunt tekenen.",
      answer: [
        "E",
        "K"
      ],
      selectCount: 2,
      explanation: "E ligt in beide vlakken. K ligt op BD en op AC, dus ook in beide vlakken. Twee verschillende gemeenschappelijke punten bepalen de snijlijn EK.",
      hint: "Zoek punten die tegelijk in het hulpvlak \xE9n in het doelvlak liggen.",
      scene: {
        caption: "K is het midden van BD en AC.",
        showCube: true,
        points: {
          K: [
            0.5,
            0.5,
            0
          ]
        },
        planes: [
          [
            "A",
            "C",
            "G",
            "E"
          ],
          [
            "B",
            "D",
            "E"
          ]
        ]
      },
      revealScene: {
        caption: "ACGE bevat AG. K is het midden van BD; E en K liggen in beide vlakken.",
        showCube: true,
        points: {
          K: [
            0.5,
            0.5,
            0
          ]
        },
        highlights: [
          "AG",
          "EK"
        ],
        planes: [
          [
            "A",
            "C",
            "G",
            "E"
          ],
          [
            "B",
            "D",
            "E"
          ]
        ]
      }
    },
    {
      id: "l2-hulpvlak-3",
      block: "l2-hulpvlak",
      skill: "rekenen",
      type: "numeric",
      prompt: "De kubusribbe is 3 cm. S = AG \u2229 vlak BDE ligt op een derde van AG, gemeten vanaf A. Bereken AS in cm, op twee decimalen.",
      answer: [
        "1.7320508075688772"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "AG = \u221A(3\xB2 + 3\xB2 + 3\xB2) = 3\u221A3 cm. AS = \u2153 \xD7 AG = \u221A3 \u2248 1,73 cm.",
      hint: "Bereken eerst de ruimtediagonaal en pas daarna de verhouding toe.",
      scene: {
        caption: "S = AG \u2229 EK ligt in vlak BDE. De gelijke co\xF6rdinaten van S zijn elk \u2153 van de kubusribbe.",
        showCube: true,
        points: {
          K: [
            0.5,
            0.5,
            0
          ],
          S: [
            0.3333333333333333,
            0.3333333333333333,
            0.3333333333333333
          ]
        },
        highlights: [
          "AG",
          "EK"
        ],
        planes: [
          [
            "B",
            "D",
            "E"
          ]
        ]
      }
    },
    {
      id: "l2-hulpvlak-4",
      block: "l2-hulpvlak",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Met hulpvlak ACGE vind je s = EK en vervolgens S = AG \u2229 s. Waarom is S het gevraagde punt?",
      options: [
        {
          id: "a",
          text: "Omdat elk punt van ACGE ook in BDE ligt."
        },
        {
          id: "b",
          text: "Omdat S op AG ligt en s geheel in vlak BDE ligt."
        },
        {
          id: "c",
          text: "Omdat iedere kruising op de tekening een snijpunt in de ruimte is."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "S ligt op de oorspronkelijke lijn AG \xE9n op EK. Omdat EK in BDE ligt, ligt S ook in BDE. De lijn AG ligt niet geheel in BDE, dus dit snijpunt is uniek.",
      hint: "Welke twee voorwaarden moet het gezochte punt vervullen?",
      scene: {
        caption: "S = AG \u2229 EK ligt in vlak BDE. De gelijke co\xF6rdinaten van S zijn elk \u2153 van de kubusribbe.",
        showCube: true,
        points: {
          K: [
            0.5,
            0.5,
            0
          ],
          S: [
            0.3333333333333333,
            0.3333333333333333,
            0.3333333333333333
          ]
        },
        highlights: [
          "AG",
          "EK"
        ],
        planes: [
          [
            "B",
            "D",
            "E"
          ]
        ]
      }
    },
    {
      id: "l2-hulpvlak-p1",
      block: "l2-hulpvlak",
      skill: "construeren",
      type: "choice",
      prompt: "Voor BH \u2229 vlak ADF kies je een hulpvlak. Welke keuze is bruikbaar?",
      options: [
        {
          id: "a",
          text: "BDHF, want dit vlak bevat BH."
        },
        {
          id: "b",
          text: "EFGH, want H is een punt van de lijn en \xE9\xE9n punt is voldoende."
        },
        {
          id: "c",
          text: "ABCD, want dat snijdt ADF; BH hoeft er niet in te liggen."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "BDHF bevat de gehele lijn BH. E\xE9n punt van BH of alleen een snijding met het doelvlak is onvoldoende.",
      hint: "Controleer beide eindpunten van de benoemde lijn.",
      scene: {
        caption: "Onderzoek lijn BH en vlak ADF.",
        showCube: true,
        highlights: [
          "BH"
        ],
        planes: [
          [
            "A",
            "D",
            "F"
          ]
        ]
      }
    },
    {
      id: "l2-hulpvlak-p2",
      block: "l2-hulpvlak",
      skill: "construeren",
      type: "choice",
      prompt: "Q ligt op CT. Welk hulpvlak kies je voor AQ \u2229 vlak BDT?",
      options: [
        {
          id: "a",
          text: "BCT: daarin ligt Q, dus ook AQ."
        },
        {
          id: "b",
          text: "ABCD: elk vlak dat BDT snijdt kan als hulpvlak dienen."
        },
        {
          id: "c",
          text: "ACT: dit vlak bevat A en Q, en daarmee de lijn AQ."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "Omdat Q op CT ligt, ligt Q in ACT. A ligt daar ook, dus AQ ligt geheel in ACT. ABCD bevat Q niet.",
      hint: "Een vlak dat twee verschillende punten van een lijn bevat, bevat die hele lijn.",
      scene: {
        caption: "Vierkante piramide ABCD.T; Q is het midden van CT. Onderzoek AQ \u2229 vlak BDT.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          T: [
            0.5,
            0.5,
            1
          ],
          Q: [
            0.75,
            0.75,
            0.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "AQ"
        ],
        planes: [
          [
            "B",
            "D",
            "T"
          ]
        ]
      }
    },
    {
      id: "l2-hulpvlak-r1",
      block: "l2-hulpvlak",
      skill: "construeren",
      type: "choice",
      prompt: "Je zoekt EC \u2229 vlak ABG. Waarom is ACGE een bruikbaar hulpvlak?",
      options: [
        {
          id: "a",
          text: "Omdat ACGE zowel E als C bevat."
        },
        {
          id: "b",
          text: "Omdat ieder diagonaalvlak elk gewenst snijpunt bevat."
        },
        {
          id: "c",
          text: "Omdat EC en AG op het scherm ergens kruisen."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "E en C liggen in ACGE; daarom ligt EC in het hulpvlak. De snijlijn met ABG is AG, zodat EC \u2229 AG de volgende stap is.",
      hint: "Benoem de noodzakelijke eigenschap van het hulpvlak.",
      scene: {
        caption: "Kubus; onderzoek EC \u2229 vlak ABG.",
        showCube: true,
        highlights: [
          "EC"
        ],
        planes: [
          [
            "A",
            "B",
            "G"
          ]
        ]
      }
    },
    {
      id: "l2-hulpvlak-r2",
      block: "l2-hulpvlak",
      skill: "construeren",
      type: "points",
      prompt: "O is het snijpunt van AC en BD. Voor AQ \u2229 vlak BDT gebruik je hulpvlak ACT. Selecteer de twee punten die de snijlijn ACT \u2229 BDT bepalen.",
      answer: [
        "O",
        "T"
      ],
      selectCount: 2,
      explanation: "T ligt in beide vlakken. O ligt op AC \xE9n BD. Daarom is OT de snijlijn; daarna zoek je AQ \u2229 OT.",
      hint: "Zoek \xE9\xE9n gemeenschappelijk toppunt en \xE9\xE9n gemeenschappelijk punt in het grondvlak.",
      scene: {
        caption: "Q is het midden van CT; O = AC \u2229 BD.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          T: [
            0.5,
            0.5,
            1
          ],
          Q: [
            0.75,
            0.75,
            0.5
          ],
          O: [
            0.5,
            0.5,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "AC",
          "BD",
          "AQ"
        ],
        planes: [
          [
            "A",
            "C",
            "T"
          ],
          [
            "B",
            "D",
            "T"
          ]
        ]
      }
    },
    {
      id: "l2-doorsnede-1",
      block: "l2-doorsnede",
      skill: "inzicht",
      type: "choice",
      prompt: "P, Q en R bepalen een vlak. Welke uitspraak over de rand van de doorsnede is juist?",
      options: [
        {
          id: "a",
          text: "PQ en QR zijn zijden in twee zijvlakken; PR loopt door het binnenste en is hier geen randzijde."
        },
        {
          id: "b",
          text: "Je mag nog geen enkel lijnstuk tekenen zolang niet alle hoekpunten bekend zijn."
        },
        {
          id: "c",
          text: "PQ, QR en PR zijn automatisch alle drie zijden, want drie punten bepalen een vlak."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "PQ ligt in voorvlak ABFE en QR in rechtervlak BCGF. P en R delen geen zijvlak; PR is hier een diagonaal binnen de doorsnede. Het vlak wordt door drie punten bepaald, de volledige rand niet.",
      hint: "Een randzijde van de doorsnede moet in een zijvlak van de kubus liggen.",
      scene: {
        caption: "P op AE: AP = \xBC AE. Q is het midden van BF. R op CG: CR = \xBE CG.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.25
          ],
          Q: [
            1,
            0,
            0.5
          ],
          R: [
            1,
            1,
            0.75
          ]
        }
      },
      revealScene: {
        caption: "PQ ligt in ABFE; QR ligt in BCGF. PR is geen rand in een zijvlak.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.25
          ],
          Q: [
            1,
            0,
            0.5
          ],
          R: [
            1,
            1,
            0.75
          ]
        },
        highlights: [
          "PQ",
          "QR"
        ]
      }
    },
    {
      id: "l2-doorsnede-2",
      block: "l2-doorsnede",
      skill: "construeren",
      type: "choice",
      prompt: "Je hebt QR getekend. Hoe bepaal je de snijlijn van hetzelfde doorsnedevlak met het tegenoverliggende vlak ADHE?",
      options: [
        {
          id: "a",
          text: "Teken door P een lijn evenwijdig aan QR."
        },
        {
          id: "b",
          text: "Verleng QR tot het de ribbe AE raakt."
        },
        {
          id: "c",
          text: "Teken door P een lijn loodrecht op QR."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "BCGF en ADHE zijn evenwijdige vlakken. Als een derde vlak beide snijdt, zijn hun snijlijnen evenwijdig. De gezochte lijn gaat bovendien door P.",
      hint: "Gebruik het verband tussen snijlijnen in twee evenwijdige vlakken.",
      scene: {
        caption: "PQ ligt in ABFE; QR ligt in BCGF. PR is geen rand in een zijvlak.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.25
          ],
          Q: [
            1,
            0,
            0.5
          ],
          R: [
            1,
            1,
            0.75
          ]
        },
        highlights: [
          "PQ",
          "QR"
        ]
      },
      revealScene: {
        caption: "De doorsnede is PQRS; S is het midden van DH. PS \u2225 QR en PQ \u2225 SR.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.25
          ],
          Q: [
            1,
            0,
            0.5
          ],
          R: [
            1,
            1,
            0.75
          ],
          S: [
            0,
            1,
            0.5
          ]
        },
        highlights: [
          "PQ",
          "QR",
          "RS",
          "SP"
        ],
        planes: [
          [
            "P",
            "Q",
            "R",
            "S"
          ]
        ]
      }
    },
    {
      id: "l2-doorsnede-3",
      block: "l2-doorsnede",
      skill: "rekenen",
      type: "numeric",
      prompt: "De kubusribbe is 8 cm. AP = 2 cm, BQ = 4 cm en CR = 6 cm. De doorsnede ontmoet DH in S. Bereken DS in cm, op twee decimalen.",
      answer: [
        "4"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "Van Q naar R neemt de hoogte met 6 \u2212 4 = 2 cm toe over \xE9\xE9n kubusdiepte. PS is evenwijdig aan QR, dus ook van P naar S komt er 2 cm bij: DS = 2 + 2 = 4 cm.",
      hint: "Vergelijk de gelijke verplaatsingen van voorvlak naar achtervlak.",
      scene: {
        caption: "PQ ligt in ABFE; QR ligt in BCGF. PR is geen rand in een zijvlak.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.25
          ],
          Q: [
            1,
            0,
            0.5
          ],
          R: [
            1,
            1,
            0.75
          ]
        },
        highlights: [
          "PQ",
          "QR"
        ]
      },
      revealScene: {
        caption: "De doorsnede is PQRS; S is het midden van DH. PS \u2225 QR en PQ \u2225 SR.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.25
          ],
          Q: [
            1,
            0,
            0.5
          ],
          R: [
            1,
            1,
            0.75
          ],
          S: [
            0,
            1,
            0.5
          ]
        },
        highlights: [
          "PQ",
          "QR",
          "RS",
          "SP"
        ],
        planes: [
          [
            "P",
            "Q",
            "R",
            "S"
          ]
        ]
      }
    },
    {
      id: "l2-doorsnede-4",
      block: "l2-doorsnede",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Waarom is de doorsnede in dit voorbeeld een vierhoek en geen driehoek?",
      options: [
        {
          id: "a",
          text: "Omdat in een kubus geen driehoek te tekenen is."
        },
        {
          id: "b",
          text: "Omdat elke kubusdoorsnede vier zijden heeft."
        },
        {
          id: "c",
          text: "Omdat de rand achtereenvolgens vier zijvlakken doorloopt en sluit via S op DH."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "De rand loopt P\u2013Q\u2013R\u2013S\u2013P in vier zijvlakken. De boven- en ondervlakken worden niet geraakt. Andere kubusdoorsneden kunnen wel driehoeken zijn.",
      hint: "Loop de rand langs; verbind alleen punten die hetzelfde zijvlak delen.",
      scene: {
        caption: "De doorsnede is PQRS; S is het midden van DH. PS \u2225 QR en PQ \u2225 SR.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.25
          ],
          Q: [
            1,
            0,
            0.5
          ],
          R: [
            1,
            1,
            0.75
          ],
          S: [
            0,
            1,
            0.5
          ]
        },
        highlights: [
          "PQ",
          "QR",
          "RS",
          "SP"
        ],
        planes: [
          [
            "P",
            "Q",
            "R",
            "S"
          ]
        ]
      }
    },
    {
      id: "l2-doorsnede-p1",
      block: "l2-doorsnede",
      skill: "inzicht",
      type: "choice",
      prompt: "Welke van de drie verbindingen PQ, QR en PR is in dit voorbeeld geen randzijde van de doorsnede?",
      options: [
        {
          id: "a",
          text: "Geen: drie gegeven punten moeten met alle drie de verbindingen de rand vormen."
        },
        {
          id: "b",
          text: "PQ: een doorsnede mag het grondvlak niet raken."
        },
        {
          id: "c",
          text: "PR: P en R liggen niet in \xE9\xE9n zijvlak."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "PQ ligt in het grondvlak en QR in het rechtervlak. PR ligt niet in \xE9\xE9n zijvlak en is een diagonaal in de doorsnede.",
      hint: "Zoek voor ieder lijnstuk een zijvlak dat beide eindpunten bevat.",
      scene: {
        caption: "P is het midden van AB; Q is het midden van BC; R is het midden van FG.",
        showCube: true,
        points: {
          P: [
            0.5,
            0,
            0
          ],
          Q: [
            1,
            0.5,
            0
          ],
          R: [
            1,
            0.5,
            1
          ]
        }
      }
    },
    {
      id: "l2-doorsnede-p2",
      block: "l2-doorsnede",
      skill: "inzicht",
      type: "choice",
      prompt: "Bij deze prismadoorsnede liggen PQ in ABC en QR in ACFD. Wat kun je zeggen over PR?",
      options: [
        {
          id: "a",
          text: "PR is geen randzijde, want P en R delen geen zijvlak van dit prisma."
        },
        {
          id: "b",
          text: "PR is ook een randzijde: bij drie gegeven punten is de rand altijd hun driehoek."
        },
        {
          id: "c",
          text: "PR kan helemaal niet in het doorsnedevlak liggen."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Alle drie punten liggen in het doorsnedevlak, dus PR ook. Maar PR ligt binnen de doorsnede en niet in een zijvlak van het prisma; de rand is groter dan driehoek PQR.",
      hint: "Een lijnstuk kan wel in het doorsnedevlak liggen zonder aan de buitenrand te liggen.",
      scene: {
        caption: "Recht driehoekig prisma ABC.DEF. P ligt op AB; Q op AC; R recht boven Q op DF.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            0,
            2,
            0
          ],
          D: [
            0,
            0,
            3
          ],
          E: [
            2,
            0,
            3
          ],
          F: [
            0,
            2,
            3
          ],
          P: [
            1,
            0,
            0
          ],
          Q: [
            0,
            1,
            0
          ],
          R: [
            0,
            1,
            3
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ]
      }
    },
    {
      id: "l2-doorsnede-r1",
      block: "l2-doorsnede",
      skill: "construeren",
      type: "choice",
      prompt: "Bij een kubusdoorsnede heb je een randlijn in ABFE en een gegeven punt U in het tegenoverliggende vlak DCGH. Welke richting heeft de randlijn door U?",
      options: [
        {
          id: "a",
          text: "Altijd evenwijdig aan AE."
        },
        {
          id: "b",
          text: "Evenwijdig aan de randlijn in ABFE."
        },
        {
          id: "c",
          text: "Loodrecht op de randlijn in ABFE."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "ABFE en DCGH zijn evenwijdig. Hun snijlijnen met hetzelfde doorsnedevlak zijn daarom evenwijdig. De richting volgt uit de reeds getekende randlijn.",
      hint: "Noem de twee evenwijdige vlakken.",
      scene: {
        caption: "P op AE en Q op BF; U ligt op DH.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.25
          ],
          Q: [
            1,
            0,
            0.5
          ],
          U: [
            0,
            1,
            0.5
          ]
        },
        highlights: [
          "PQ"
        ]
      }
    },
    {
      id: "l2-doorsnede-r2",
      block: "l2-doorsnede",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een leerling tekent alleen driehoek PQR en noemt dat de complete doorsnede. Welke controle toont de fout?",
      options: [
        {
          id: "a",
          text: "Nagaan of de driehoek op het scherm groot genoeg is."
        },
        {
          id: "b",
          text: "Nagaan of elk getekend randstuk in een zijvlak ligt en de rand alle geraakte zijvlakken doorloopt."
        },
        {
          id: "c",
          text: "Nagaan of twee zijden even lang lijken."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "PR ligt niet in een zijvlak. De rand moet via het vierde punt S op DH lopen, zodat elk randstuk werkelijk een zijde van de doorsnede is.",
      hint: "Controleer de ligging van PR.",
      scene: {
        caption: "P op AE: AP = \xBC AE. Q is het midden van BF. R op CG: CR = \xBE CG.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.25
          ],
          Q: [
            1,
            0,
            0.5
          ],
          R: [
            1,
            1,
            0.75
          ]
        }
      }
    },
    {
      id: "l2-buiten-1",
      block: "l2-buiten",
      skill: "inzicht",
      type: "choice",
      prompt: "M is het midden van AE. De lijnstukken GM en AC raken elkaar niet. Wat geldt voor de volledige lijnen?",
      options: [
        {
          id: "a",
          text: "Ze kunnen niet snijden: het snijpunt zou buiten de kubus liggen."
        },
        {
          id: "b",
          text: "Ze snijden buiten de kubus wanneer je beide lijnen voorbij M respectievelijk A verlengt."
        },
        {
          id: "c",
          text: "Ze zijn evenwijdig, want de zichtbare lijnstukken zijn los van elkaar."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "GM en AC liggen samen in diagonaalvlak ACGE en zijn niet evenwijdig. Ze snijden voorbij A. Een volledige lijn stopt niet bij een kubusrand.",
      hint: "Bekijk de lijnen binnen diagonaalvlak ACGE en verleng ze denkbeeldig.",
      scene: {
        caption: "M is het midden van AE. Onderzoek de volledige lijnen GM en AC.",
        showCube: true,
        points: {
          M: [
            0,
            0,
            0.5
          ]
        },
        highlights: [
          "GM",
          "AC"
        ]
      },
      revealScene: {
        caption: "X ligt buiten de kubus, voorbij A op AC. GM en AC snijden in X.",
        showCube: true,
        points: {
          M: [
            0,
            0,
            0.5
          ],
          X: [
            -1,
            -1,
            0
          ]
        },
        highlights: [
          "GM",
          "AC"
        ],
        segments: [
          {
            from: [
              0,
              0,
              0.5
            ],
            to: [
              -1.1,
              -1.1,
              -0.05
            ],
            color: "#ffab66",
            dashed: true
          },
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              -1.1,
              -1.1,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ]
      }
    },
    {
      id: "l2-buiten-2",
      block: "l2-buiten",
      skill: "construeren",
      type: "choice",
      prompt: "Waarom mag je een buiten de kubus gevonden punt X gebruiken om een snijlijn in het grondvlak te construeren?",
      options: [
        {
          id: "a",
          text: "Omdat X op het doorsnedevlak \xE9n op het grondvlak kan liggen, ook buiten het vaste lichaam."
        },
        {
          id: "b",
          text: "Omdat het verlengen van lijnen hun onderlinge ligging verandert."
        },
        {
          id: "c",
          text: "Omdat elk willekeurig punt buiten de kubus in alle vlakken ligt."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "De vlakken lopen onbeperkt door. Een gemeenschappelijk punt buiten het vaste lichaam is bruikbaar om hun snijlijn te bepalen. Alleen het deel van de snijlijn binnen het lichaam kan tot de doorsnederand behoren.",
      hint: "Maak onderscheid tussen een vlak en het getekende zijvlak van het lichaam.",
      scene: {
        caption: "X ligt buiten de kubus, voorbij A op AC. GM en AC snijden in X.",
        showCube: true,
        points: {
          M: [
            0,
            0,
            0.5
          ],
          X: [
            -1,
            -1,
            0
          ]
        },
        highlights: [
          "GM",
          "AC"
        ],
        segments: [
          {
            from: [
              0,
              0,
              0.5
            ],
            to: [
              -1.1,
              -1.1,
              -0.05
            ],
            color: "#ffab66",
            dashed: true
          },
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              -1.1,
              -1.1,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ]
      }
    },
    {
      id: "l2-buiten-3",
      block: "l2-buiten",
      skill: "rekenen",
      type: "numeric",
      prompt: "De kubusribbe is 6 cm en M is het midden van AE. X = GM \u2229 AC ligt voorbij A. Bereken AX in cm, op twee decimalen.",
      answer: [
        "8.485281374238571"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "Binnen vlak ACGE zijn driehoeken XAM en XCG gelijkvormig. AM = 3 en CG = 6, dus XA/XC = 1/2. Omdat XC = XA + AC volgt XA = AC = 6\u221A2 \u2248 8,49 cm.",
      hint: "Schrijf XC als XA + AC; A ligt tussen X en C.",
      scene: {
        caption: "X ligt buiten de kubus, voorbij A op AC. GM en AC snijden in X.",
        showCube: true,
        points: {
          M: [
            0,
            0,
            0.5
          ],
          X: [
            -1,
            -1,
            0
          ]
        },
        highlights: [
          "GM",
          "AC"
        ],
        segments: [
          {
            from: [
              0,
              0,
              0.5
            ],
            to: [
              -1.1,
              -1.1,
              -0.05
            ],
            color: "#ffab66",
            dashed: true
          },
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              -1.1,
              -1.1,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ]
      }
    },
    {
      id: "l2-buiten-4",
      block: "l2-buiten",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Je vindt een kruising van twee gestippelde lijnen buiten de figuur. Wat moet je controleren voordat je die kruising als ruimtelijk snijpunt gebruikt?",
      options: [
        {
          id: "a",
          text: "Of de lijnen in \xE9\xE9n vlak liggen en daar niet evenwijdig zijn."
        },
        {
          id: "b",
          text: "Of het snijpunt links van de figuur ligt."
        },
        {
          id: "c",
          text: "Alleen of de stippels elkaar op het scherm raken."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Een projectie kan kruisende ruimtelijke lijnen over elkaar tekenen. Coplanariteit en niet-evenwijdigheid rechtvaardigen een werkelijk, uniek snijpunt. In het voorbeeld liggen GM en AC samen in ACGE.",
      hint: "Een getekende kruising is nog geen ruimtelijk bewijs.",
      scene: {
        caption: "X ligt buiten de kubus, voorbij A op AC. GM en AC snijden in X.",
        showCube: true,
        points: {
          M: [
            0,
            0,
            0.5
          ],
          X: [
            -1,
            -1,
            0
          ]
        },
        highlights: [
          "GM",
          "AC"
        ],
        segments: [
          {
            from: [
              0,
              0,
              0.5
            ],
            to: [
              -1.1,
              -1.1,
              -0.05
            ],
            color: "#ffab66",
            dashed: true
          },
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              -1.1,
              -1.1,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ]
      }
    },
    {
      id: "l2-buiten-p1",
      block: "l2-buiten",
      skill: "inzicht",
      type: "choice",
      prompt: "De volledige lijn PQ bereikt de lijn AB voorbij A. Is dat punt een bruikbaar snijpunt?",
      options: [
        {
          id: "a",
          text: "Nee: een lijn door twee punten op verticale ribben is altijd evenwijdig aan AB."
        },
        {
          id: "b",
          text: "Nee: buiten de kubus bestaan de lijn PQ en AB niet meer."
        },
        {
          id: "c",
          text: "Ja: beide volledige lijnen liggen in ABFE en mogen buiten de ribben worden verlengd."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "PQ en AB liggen in hetzelfde voorvlak en zijn niet evenwijdig. Hun snijpunt voorbij A behoort tot de volledige lijnen.",
      hint: "Een ribbe is begrensd; de lijn door de eindpunten niet.",
      scene: {
        caption: "P op AE met AP = \u2153 AE; Q op BF met BQ = \u2154 BF. Onderzoek PQ en AB.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.3333333333333333
          ],
          Q: [
            1,
            0,
            0.6666666666666666
          ]
        },
        highlights: [
          "PQ",
          "AB"
        ]
      }
    },
    {
      id: "l2-buiten-p2",
      block: "l2-buiten",
      skill: "inzicht",
      type: "choice",
      prompt: "In zijvlak ABT van een piramide ontmoet de verlengde PQ de verlengde AB buiten het grondvlak. Welke uitspraak klopt?",
      options: [
        {
          id: "a",
          text: "Het is een snijpunt van de volledige lijnen, maar geen punt op het lijnstuk AB."
        },
        {
          id: "b",
          text: "Het is geen snijpunt, want buiten het getekende lichaam bestaan deze lijnen niet."
        },
        {
          id: "c",
          text: "Het punt ligt automatisch in het binnenste van de piramide."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "De volledige lijnen blijven bestaan buiten de driehoek ABT. Het snijpunt ligt op de lijn AB, maar buiten het lijnstuk AB.",
      hint: "Onderscheid lijn en lijnstuk.",
      scene: {
        caption: "P ligt op AT met AP = \xBC AT; Q is het midden van BT. Onderzoek PQ en AB.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          T: [
            0.5,
            0.5,
            1
          ],
          P: [
            0.125,
            0.125,
            0.25
          ],
          Q: [
            0.75,
            0.25,
            0.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "PQ",
          "AB"
        ]
      }
    },
    {
      id: "l2-buiten-r1",
      block: "l2-buiten",
      skill: "construeren",
      type: "choice",
      prompt: "Twee reeds geconstrueerde punten X en Y liggen buiten de kubus, maar beide in het grondvlak \xE9n in het doorsnedevlak. Wat is je volgende geldige stap?",
      options: [
        {
          id: "a",
          text: "Verplaats beide punten eerst naar binnen de kubus."
        },
        {
          id: "b",
          text: "Teken XY als snijlijn van de twee vlakken."
        },
        {
          id: "c",
          text: "Negeer ze; alleen ribbepunten mogen een snijlijn bepalen."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Twee verschillende gemeenschappelijke punten bepalen de snijlijn van de vlakken, ongeacht of ze binnen het lichaam liggen. Zoek daarna waar XY de begrenzing van het grondvlak ontmoet.",
      hint: "Wat bepalen twee verschillende punten?",
      scene: {
        caption: "X en Y liggen in het grondvlak buiten de kubus; beide zijn punten van hetzelfde doorsnedevlak.",
        showCube: true,
        points: {
          X: [
            -0.5,
            0,
            0
          ],
          Y: [
            1.5,
            1,
            0
          ]
        },
        segments: [
          {
            from: [
              -0.5,
              0,
              0
            ],
            to: [
              1.5,
              1,
              0
            ],
            color: "#ffab66",
            dashed: true
          }
        ]
      }
    },
    {
      id: "l2-buiten-r2",
      block: "l2-buiten",
      skill: "rekenen",
      type: "numeric",
      prompt: "De kubusribbe is 6 cm. M ligt op AE met AM = 2 cm. X = GM \u2229 AC ligt voorbij A. Bereken AX in cm, op twee decimalen.",
      answer: [
        "4.242640687119286"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "Door gelijkvormigheid geldt XA/XC = AM/CG = 1/3. Met XC = XA + 6\u221A2 volgt 3XA = XA + 6\u221A2, dus XA = 3\u221A2 \u2248 4,24 cm.",
      hint: "Gebruik XA/(XA + AC) = AM/CG.",
      scene: {
        caption: "Ribbe 6 cm; AM = 2 cm. GM en AC zijn de volledige lijnen.",
        showCube: true,
        points: {
          M: [
            0,
            0,
            0.3333333333333333
          ]
        },
        highlights: [
          "GM",
          "AC"
        ]
      },
      revealScene: {
        caption: "XA = \xBD AC. X ligt voorbij A.",
        showCube: true,
        points: {
          M: [
            0,
            0,
            0.3333333333333333
          ],
          X: [
            -0.5,
            -0.5,
            0
          ]
        },
        highlights: [
          "GM",
          "AC"
        ],
        segments: [
          {
            from: [
              0,
              0,
              0.3333333333333333
            ],
            to: [
              -0.6,
              -0.6,
              -0.06666666666666667
            ],
            color: "#ffab66",
            dashed: true
          },
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              -0.6,
              -0.6,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ]
      }
    },
    {
      id: "l2-gelijkvormig-1",
      block: "l2-gelijkvormig",
      skill: "rekenen",
      type: "choice",
      prompt: "Driehoek APQ is gelijkvormig met ABC. AB = 6 cm en AP = 3 cm. Wat is de lengtefactor van ABC naar APQ?",
      options: [
        {
          id: "a",
          text: "\xBD"
        },
        {
          id: "b",
          text: "\xBC"
        },
        {
          id: "c",
          text: "2"
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Van groot naar klein vermenigvuldig je met AP/AB = 3/6 = 1/2. De factor 2 hoort bij de omgekeerde richting.",
      hint: "Zet de nieuwe lengte boven de oorspronkelijke lengte.",
      scene: {
        caption: "AB = 6 cm, AC = 8 cm; P is het midden van AB en PQ \u2225 BC.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          P: [
            3,
            0,
            0
          ],
          Q: [
            0,
            4,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "PQ"
        ],
        view: "top"
      }
    },
    {
      id: "l2-gelijkvormig-2",
      block: "l2-gelijkvormig",
      skill: "rekenen",
      type: "numeric",
      prompt: "AB = 6 cm, AP = 3 cm, AC = 8 cm en PQ \u2225 BC. Bereken AQ in cm, op twee decimalen.",
      answer: [
        "4"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "De lengtefactor ABC \u2192 APQ is 3/6 = 1/2. Daarom is AQ = 1/2 \xD7 8 = 4 cm.",
      hint: "Gebruik dezelfde factor op de overeenkomstige zijde AC.",
      scene: {
        caption: "AB = 6 cm, AC = 8 cm; P is het midden van AB en PQ \u2225 BC.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          P: [
            3,
            0,
            0
          ],
          Q: [
            0,
            4,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "PQ"
        ],
        view: "top"
      }
    },
    {
      id: "l2-gelijkvormig-3",
      block: "l2-gelijkvormig",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Welke verhoudingstabel hoort bij de gelijkvormige driehoeken APQ en ABC?",
      options: [
        {
          id: "a",
          text: "AP/AB = AC/AQ = PQ/BC"
        },
        {
          id: "b",
          text: "AP/AC = AQ/BC = PQ/AB"
        },
        {
          id: "c",
          text: "AP/AB = AQ/AC = PQ/BC"
        }
      ],
      answer: [
        "c"
      ],
      explanation: "De overeenkomstige hoekpunten zijn A \u2194 A, P \u2194 B en Q \u2194 C. Alle breuken moeten dezelfde richting gebruiken: klein gedeeld door groot.",
      hint: "Koppel eerst overeenkomstige hoekpunten en zijden.",
      scene: {
        caption: "AB = 6 cm, AC = 8 cm; P is het midden van AB en PQ \u2225 BC.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          P: [
            3,
            0,
            0
          ],
          Q: [
            0,
            4,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "PQ"
        ],
        view: "top"
      }
    },
    {
      id: "l2-gelijkvormig-4",
      block: "l2-gelijkvormig",
      skill: "rekenen",
      type: "numeric",
      prompt: "In driehoek ABC is AB = 10 cm en BC = 15 cm. P ligt op AB met AP = 6 cm; PQ \u2225 BC en Q ligt op AC. Bereken PQ in cm, op twee decimalen.",
      answer: [
        "9"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "AP/AB = 6/10 = 0,6. PQ hoort bij BC, dus PQ = 0,6 \xD7 15 = 9 cm.",
      hint: "Kies de factor van ABC naar APQ.",
      scene: {
        caption: "AB = 10 cm, BC = 15 cm; AP = 6 cm en PQ \u2225 BC.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            10,
            0,
            0
          ],
          C: [
            0,
            11.180339887498949,
            0
          ],
          P: [
            6,
            0,
            0
          ],
          Q: [
            0,
            6.708203932499369,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "PQ"
        ],
        view: "top"
      }
    },
    {
      id: "l2-gelijkvormig-p1",
      block: "l2-gelijkvormig",
      skill: "rekenen",
      type: "choice",
      prompt: "Een grote driehoek en een gelijkvormige kleine driehoek hebben overeenkomstige zijden van 12 en 4 cm. Wat is de factor van groot naar klein?",
      options: [
        {
          id: "a",
          text: "9"
        },
        {
          id: "b",
          text: "\u2153"
        },
        {
          id: "c",
          text: "3"
        }
      ],
      answer: [
        "b"
      ],
      explanation: "De factor is 4/12 = 1/3. De factor 3 hoort bij de stap terug, van klein naar groot.",
      hint: "Welke lengte is het resultaat van de verkleining?",
      scene: {
        caption: "AB = 12 cm en AP = 4 cm; PQ \u2225 BC.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            12,
            0,
            0
          ],
          C: [
            0,
            9,
            0
          ],
          P: [
            4,
            0,
            0
          ],
          Q: [
            0,
            3,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "PQ"
        ],
        view: "top"
      }
    },
    {
      id: "l2-gelijkvormig-p2",
      block: "l2-gelijkvormig",
      skill: "rekenen",
      type: "choice",
      prompt: "Een piramide is op halve hoogte evenwijdig aan het grondvlak gesneden. Van de hele piramide naar de kleine toppiramide: welke lengtefactor geldt?",
      options: [
        {
          id: "a",
          text: "2"
        },
        {
          id: "b",
          text: "\xBD"
        },
        {
          id: "c",
          text: "\xBC"
        }
      ],
      answer: [
        "b"
      ],
      explanation: "De hoogte vanaf T tot het snijvlak is de helft van de totale hoogte. Bij deze gelijkvormige piramides is de lengtefactor dus 1/2.",
      hint: "Meet beide hoogtes vanuit hetzelfde toppunt T.",
      scene: {
        caption: "Vierkante piramide met grondzijde 8 cm en hoogte 6 cm; het snijvlak ligt op halve hoogte.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            8,
            8,
            0
          ],
          D: [
            0,
            8,
            0
          ],
          T: [
            4,
            4,
            6
          ],
          P: [
            2,
            2,
            3
          ],
          Q: [
            6,
            2,
            3
          ],
          R: [
            6,
            6,
            3
          ],
          S: [
            2,
            6,
            3
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        planes: [
          [
            "P",
            "Q",
            "R",
            "S"
          ]
        ]
      }
    },
    {
      id: "l2-gelijkvormig-r1",
      block: "l2-gelijkvormig",
      skill: "rekenen",
      type: "numeric",
      prompt: "AB = 15 cm, AP = 9 cm en AC = 20 cm. PQ \u2225 BC. Bereken AQ in cm, op twee decimalen.",
      answer: [
        "12"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "De factor ABC \u2192 APQ is 9/15 = 0,6. Daarom AQ = 0,6 \xD7 20 = 12 cm.",
      hint: "Gebruik klein/groot voor de richting naar APQ.",
      scene: {
        caption: "AB = 15 cm, AP = 9 cm, AC = 20 cm; PQ \u2225 BC.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            15,
            0,
            0
          ],
          C: [
            0,
            20,
            0
          ],
          P: [
            9,
            0,
            0
          ],
          Q: [
            0,
            12,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "PQ"
        ],
        view: "top"
      }
    },
    {
      id: "l2-gelijkvormig-r2",
      block: "l2-gelijkvormig",
      skill: "rekenen",
      type: "numeric",
      prompt: "AP = 4 cm, AB = 10 cm en PQ = 6 cm. PQ \u2225 BC. Bereken BC in cm, op twee decimalen.",
      answer: [
        "15"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "Van APQ naar ABC is de factor AB/AP = 10/4 = 2,5. Dus BC = 2,5 \xD7 6 = 15 cm.",
      hint: "Nu zoek je een lengte in de grote driehoek; keer de factor passend om.",
      scene: {
        caption: "AP = 4 cm, AB = 10 cm en PQ = 6 cm; PQ \u2225 BC.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            10,
            0,
            0
          ],
          C: [
            0,
            11.180339887498949,
            0
          ],
          P: [
            4,
            0,
            0
          ],
          Q: [
            0,
            4.47213595499958,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "PQ"
        ],
        view: "top"
      }
    },
    {
      id: "l3-ruimtefiguren-1",
      block: "l3-ruimtefiguren",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een leerling wil in deze piramide door R een lijn evenwijdig aan PQ tekenen, met als reden dat ABT en CDT tegenoverliggende zijvlakken zijn. Is die redenering geldig?",
      options: [
        {
          id: "a",
          text: "Nee: de vlakken ABT en CDT bevatten allebei T en zijn niet evenwijdig."
        },
        {
          id: "b",
          text: "Ja: tegenoverliggende zijvlakken zijn bij elk lichaam evenwijdig."
        },
        {
          id: "c",
          text: "Nee: in een piramide mogen nooit evenwijdige lijnen voorkomen."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "De evenwijdigheidsregel vereist twee evenwijdige vlakken. ABT en CDT zijn verschillende vlakken die T gemeen hebben. In dit voorbeeld is de werkelijke doorsnederand door R bovendien niet evenwijdig aan PQ.",
      hint: "Controleer eerst de voorwaarde van de regel, niet alleen de naam van de vlakken.",
      scene: {
        caption: "Vierkante piramide ABCD.T. P op AT: AP = \xBC AT. Q en R zijn de middens van BT en CT.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            2,
            2,
            0
          ],
          D: [
            0,
            2,
            0
          ],
          T: [
            1,
            1,
            4
          ],
          P: [
            0.25,
            0.25,
            1
          ],
          Q: [
            1.5,
            0.5,
            2
          ],
          R: [
            1.5,
            1.5,
            2
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "PQ",
          "QR"
        ]
      },
      revealScene: {
        caption: "De volledige doorsnede is PQRS. S ligt op DT met DS = \xBC DT.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            2,
            2,
            0
          ],
          D: [
            0,
            2,
            0
          ],
          T: [
            1,
            1,
            4
          ],
          P: [
            0.25,
            0.25,
            1
          ],
          Q: [
            1.5,
            0.5,
            2
          ],
          R: [
            1.5,
            1.5,
            2
          ],
          S: [
            0.25,
            1.75,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "PQ",
          "QR",
          "RS",
          "SP"
        ],
        planes: [
          [
            "P",
            "Q",
            "R",
            "S"
          ]
        ]
      }
    },
    {
      id: "l3-ruimtefiguren-2",
      block: "l3-ruimtefiguren",
      skill: "construeren",
      type: "points",
      prompt: "In het prisma ligt P op AB, Q op AC en R op BE. Selecteer de twee gegeven punten waarmee je meteen een randstuk in zijvlak ABED tekent.",
      answer: [
        "P",
        "R"
      ],
      selectCount: 2,
      explanation: "P en R liggen beide in ABED, dus PR is een randstuk in dit zijvlak. Q ligt op AC en niet in ABED.",
      hint: "Zoek twee gegeven doorsnedepunten die hetzelfde zijvlak delen.",
      scene: {
        caption: "Recht driehoekig prisma ABC.DEF. P en Q zijn de middens van AB en AC; R is het midden van BE.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            0,
            2,
            0
          ],
          D: [
            0,
            0,
            3
          ],
          E: [
            2,
            0,
            3
          ],
          F: [
            0,
            2,
            3
          ],
          P: [
            1,
            0,
            0
          ],
          Q: [
            0,
            1,
            0
          ],
          R: [
            2,
            0,
            1.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ]
      },
      revealScene: {
        caption: "De doorsnede is P\u2013R\u2013S\u2013Q. S is het midden van CF. PQ \u2225 RS.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            0,
            2,
            0
          ],
          D: [
            0,
            0,
            3
          ],
          E: [
            2,
            0,
            3
          ],
          F: [
            0,
            2,
            3
          ],
          P: [
            1,
            0,
            0
          ],
          Q: [
            0,
            1,
            0
          ],
          R: [
            2,
            0,
            1.5
          ],
          S: [
            0,
            2,
            1.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ],
        highlights: [
          "PR",
          "RS",
          "SQ",
          "QP"
        ],
        planes: [
          [
            "P",
            "R",
            "S",
            "Q"
          ]
        ]
      }
    },
    {
      id: "l3-ruimtefiguren-3",
      block: "l3-ruimtefiguren",
      skill: "inzicht",
      type: "choice",
      prompt: "Construeer denkbeeldig of op papier de volledige doorsnede door P, Q en R in dit prisma. Welke figuur ontstaat?",
      options: [
        {
          id: "a",
          text: "Altijd een zeshoek, omdat een prisma zes hoekpunten heeft."
        },
        {
          id: "b",
          text: "Een trapezium met vier hoekpunten P, R, S en Q."
        },
        {
          id: "c",
          text: "Een driehoek, omdat slechts drie punten gegeven waren."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "S is het vierde snijpunt op een ribbe. PQ is evenwijdig aan RS, terwijl PR en QS niet evenwijdig zijn. De doorsnede is een trapezium.",
      hint: "Het aantal gegeven punten bepaalt het vlak; volg vervolgens de volledige rand.",
      scene: {
        caption: "Recht driehoekig prisma ABC.DEF. P en Q zijn de middens van AB en AC; R is het midden van BE.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            0,
            2,
            0
          ],
          D: [
            0,
            0,
            3
          ],
          E: [
            2,
            0,
            3
          ],
          F: [
            0,
            2,
            3
          ],
          P: [
            1,
            0,
            0
          ],
          Q: [
            0,
            1,
            0
          ],
          R: [
            2,
            0,
            1.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ]
      },
      revealScene: {
        caption: "De doorsnede is P\u2013R\u2013S\u2013Q. S is het midden van CF. PQ \u2225 RS.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            0,
            2,
            0
          ],
          D: [
            0,
            0,
            3
          ],
          E: [
            2,
            0,
            3
          ],
          F: [
            0,
            2,
            3
          ],
          P: [
            1,
            0,
            0
          ],
          Q: [
            0,
            1,
            0
          ],
          R: [
            2,
            0,
            1.5
          ],
          S: [
            0,
            2,
            1.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ],
        highlights: [
          "PR",
          "RS",
          "SQ",
          "QP"
        ],
        planes: [
          [
            "P",
            "R",
            "S",
            "Q"
          ]
        ]
      }
    },
    {
      id: "l3-ruimtefiguren-4",
      block: "l3-ruimtefiguren",
      skill: "construeren",
      type: "choice",
      prompt: "In de piramide is X = PQ \u2229 AB al geconstrueerd. QR is evenwijdig aan grondvlak ABCD. Hoe teken je de snijlijn van het doorsnedevlak met het grondvlak?",
      options: [
        {
          id: "a",
          text: "Door X evenwijdig aan QR."
        },
        {
          id: "b",
          text: "Door X loodrecht op QR."
        },
        {
          id: "c",
          text: "Door X naar T."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "QR ligt in het doorsnedevlak en is evenwijdig aan het grondvlak. De snijlijn van de twee vlakken is daarom evenwijdig aan QR en loopt door hun gemeenschappelijke punt X.",
      hint: "Je kent \xE9\xE9n punt en de richting van de gezochte grondvlaklijn.",
      scene: {
        caption: "X = PQ \u2229 AB. QR ligt in het doorsnedevlak en is evenwijdig aan BC, dus aan het grondvlak.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            2,
            2,
            0
          ],
          D: [
            0,
            2,
            0
          ],
          T: [
            1,
            1,
            4
          ],
          P: [
            0.25,
            0.25,
            1
          ],
          Q: [
            1.5,
            0.5,
            2
          ],
          R: [
            1.5,
            1.5,
            2
          ],
          X: [
            -1,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "PQ",
          "QR"
        ],
        segments: [
          {
            from: [
              0.25,
              0.25,
              1
            ],
            to: [
              -1,
              0,
              0
            ],
            color: "#ffab66",
            dashed: true
          },
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              -1,
              0,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ]
      },
      revealScene: {
        caption: "X = PQ \u2229 AB ligt voorbij A. Door X loopt de grondvlak-snijlijn evenwijdig aan QR; Y ligt op de verlengde CD.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            2,
            2,
            0
          ],
          D: [
            0,
            2,
            0
          ],
          T: [
            1,
            1,
            4
          ],
          P: [
            0.25,
            0.25,
            1
          ],
          Q: [
            1.5,
            0.5,
            2
          ],
          R: [
            1.5,
            1.5,
            2
          ],
          S: [
            0.25,
            1.75,
            1
          ],
          X: [
            -1,
            0,
            0
          ],
          Y: [
            -1,
            2,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "PQ",
          "QR",
          "RS",
          "SP"
        ],
        segments: [
          {
            from: [
              0.25,
              0.25,
              1
            ],
            to: [
              -1,
              0,
              0
            ],
            color: "#ffab66",
            dashed: true
          },
          {
            from: [
              -1,
              0,
              0
            ],
            to: [
              -1,
              2,
              0
            ],
            color: "#66d9ca",
            dashed: true
          },
          {
            from: [
              -1,
              2,
              0
            ],
            to: [
              1.5,
              1.5,
              2
            ],
            color: "#ffab66",
            dashed: true
          },
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              -1,
              0,
              0
            ],
            color: "#66d9ca",
            dashed: true
          },
          {
            from: [
              0,
              2,
              0
            ],
            to: [
              -1,
              2,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ]
      }
    },
    {
      id: "l3-ruimtefiguren-p1",
      block: "l3-ruimtefiguren",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Mag je bij een driehoekig prisma aannemen dat de rechthoekige zijvlakken ABED en ACFD evenwijdig zijn?",
      options: [
        {
          id: "a",
          text: "Nee: ze delen de ribbe AD en zijn verschillende vlakken."
        },
        {
          id: "b",
          text: "Ja: rechthoekige vlakken zijn altijd evenwijdig."
        },
        {
          id: "c",
          text: "Ja: alle zijvlakken van een prisma zijn onderling evenwijdig."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "ABED en ACFD snijden elkaar langs AD. In een prisma zijn de twee grondvlakken ABC en DEF wel evenwijdig; dat geldt niet voor alle zijvlakken.",
      hint: "Controleer of de twee vlakken een lijn gemeen hebben.",
      scene: {
        caption: "Driehoekig prisma ABC.DEF; de zijvlakken ABED en ACFD delen AD.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            0,
            2,
            0
          ],
          D: [
            0,
            0,
            3
          ],
          E: [
            2,
            0,
            3
          ],
          F: [
            0,
            2,
            3
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ],
        planes: [
          [
            "A",
            "B",
            "E",
            "D"
          ],
          [
            "A",
            "C",
            "F",
            "D"
          ]
        ]
      }
    },
    {
      id: "l3-ruimtefiguren-p2",
      block: "l3-ruimtefiguren",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Bij een vierkante piramide worden de vlakken BCT en ADT tegenoverliggende zijvlakken genoemd. Zijn deze vlakken evenwijdig?",
      options: [
        {
          id: "a",
          text: "Ja: tegenoverliggend betekent bij alle ruimtefiguren evenwijdig."
        },
        {
          id: "b",
          text: "Nee: beide vlakken bevatten T en zijn niet hetzelfde vlak."
        },
        {
          id: "c",
          text: "Ja: BC en AD zijn even lang."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "BC en AD zijn evenwijdig, maar dat maakt de volledige vlakken BCT en ADT niet evenwijdig. De vlakken hebben T gemeen.",
      hint: "Onderscheid de ligging van twee ribben en die van de vlakken die ze bevatten.",
      scene: {
        caption: "Vierkante piramide ABCD.T.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            2,
            2,
            0
          ],
          D: [
            0,
            2,
            0
          ],
          T: [
            1,
            1,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        planes: [
          [
            "B",
            "C",
            "T"
          ],
          [
            "A",
            "D",
            "T"
          ]
        ]
      }
    },
    {
      id: "l3-ruimtefiguren-r1",
      block: "l3-ruimtefiguren",
      skill: "construeren",
      type: "choice",
      prompt: "Een vlak snijdt beide driehoekige grondvlakken ABC en DEF van een prisma in rechte lijnen. Welke eigenschap kun je zeker gebruiken?",
      options: [
        {
          id: "a",
          text: "De twee snijlijnen zijn loodrecht."
        },
        {
          id: "b",
          text: "De twee snijlijnen zijn evenwijdig, want ABC en DEF zijn evenwijdige vlakken."
        },
        {
          id: "c",
          text: "De twee snijlijnen moeten even lang zijn."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "De snijlijnen van \xE9\xE9n vlak met twee verschillende evenwijdige vlakken zijn evenwijdig. De begrensde lijnstukken in de driehoeken hoeven niet even lang te zijn.",
      hint: "Gebruik een eigenschap van de vlakken, niet van hoe lang de lijnstukken lijken.",
      scene: {
        caption: "Recht driehoekig prisma ABC.DEF.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            0,
            2,
            0
          ],
          D: [
            0,
            0,
            3
          ],
          E: [
            2,
            0,
            3
          ],
          F: [
            0,
            2,
            3
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ],
        planes: [
          [
            "A",
            "B",
            "C"
          ],
          [
            "D",
            "E",
            "F"
          ]
        ]
      }
    },
    {
      id: "l3-ruimtefiguren-r2",
      block: "l3-ruimtefiguren",
      skill: "construeren",
      type: "points",
      prompt: "Selecteer de twee hoekpunten die de gemeenschappelijke ribbe van de piramidevlakken ABT en BCT bepalen.",
      answer: [
        "B",
        "T"
      ],
      selectCount: 2,
      explanation: "Beide vlakken bevatten B en T. Hun snijlijn is BT; ze zijn dus niet evenwijdig.",
      hint: "Zoek twee verschillende punten in beide vlaknamen.",
      scene: {
        caption: "Vierkante piramide ABCD.T; onderzoek de vlakken ABT en BCT.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            2,
            2,
            0
          ],
          D: [
            0,
            2,
            0
          ],
          T: [
            1,
            1,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        planes: [
          [
            "A",
            "B",
            "T"
          ],
          [
            "B",
            "C",
            "T"
          ]
        ]
      }
    },
    {
      id: "l3-oppervlakte-1",
      block: "l3-oppervlakte",
      skill: "inzicht",
      type: "choice",
      prompt: "Bij basis AB van de gelijkzijdige driehoek: welk lijnstuk is de bijbehorende hoogte?",
      options: [
        {
          id: "a",
          text: "AM, want M is het midden van de basis."
        },
        {
          id: "b",
          text: "CM, want CM staat loodrecht op AB."
        },
        {
          id: "c",
          text: "AC, want dat is een van de twee andere zijden."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "De hoogte bij AB is de loodrechte afstand van C tot de lijn AB. Dat is CM. De schuine zijde AC is niet de hoogte.",
      hint: "Zoek het lijnstuk van de overstaande hoek naar de basislijn onder 90\xB0.",
      scene: {
        caption: "Gelijkzijdige driehoek ABC met zijde 6 cm. M is het midden van AB.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            3,
            5.196152422706632,
            0
          ],
          M: [
            3,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        view: "top"
      },
      revealScene: {
        caption: "AB = 6 cm, AM = 3 cm; CM \u27C2 AB en CM = \u221A27 cm.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            3,
            5.196152422706632,
            0
          ],
          M: [
            3,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        highlights: [
          "CM"
        ],
        view: "top"
      }
    },
    {
      id: "l3-oppervlakte-2",
      block: "l3-oppervlakte",
      skill: "rekenen",
      type: "numeric",
      prompt: "De gelijkzijdige driehoek heeft zijden van 6 cm. M is het midden van AB. Bereken de oppervlakte in cm\xB2, op twee decimalen.",
      answer: [
        "15.588457268119894"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB2",
      working: true,
      explanation: "AM = 3 cm. In rechthoekige driehoek AMC geldt CM = \u221A(6\xB2 \u2212 3\xB2) = \u221A27. Oppervlakte = 1/2 \xD7 6 \xD7 \u221A27 = 9\u221A3 \u2248 15,59 cm\xB2.",
      hint: "Bereken eerst de loodrechte hoogte met Pythagoras.",
      scene: {
        caption: "Gelijkzijdige driehoek ABC met zijde 6 cm. M is het midden van AB.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            3,
            5.196152422706632,
            0
          ],
          M: [
            3,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        view: "top"
      },
      revealScene: {
        caption: "AB = 6 cm, AM = 3 cm; CM \u27C2 AB en CM = \u221A27 cm.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            3,
            5.196152422706632,
            0
          ],
          M: [
            3,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        highlights: [
          "CM"
        ],
        view: "top"
      }
    },
    {
      id: "l3-oppervlakte-3",
      block: "l3-oppervlakte",
      skill: "rekenen",
      type: "numeric",
      prompt: "In de stomphoekige driehoek is AB = 6 cm en CH = 4 cm. H ligt buiten het lijnstuk AB en CH \u27C2 AB. Bereken de oppervlakte in cm\xB2, op twee decimalen.",
      answer: [
        "12"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB2",
      working: true,
      explanation: "De hoogte bij basis AB is nog steeds CH = 4 cm. Oppervlakte = 1/2 \xD7 6 \xD7 4 = 12 cm\xB2. Het voetpunt mag buiten het lijnstuk AB liggen.",
      hint: "De hoogte loopt naar de volledige basislijn, niet noodzakelijk naar het basislijnstuk.",
      scene: {
        caption: "AB = 6 cm. CH = 4 cm en CH \u27C2 lijn AB; H ligt op de verlengde AB voorbij A.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            -2,
            4,
            0
          ],
          H: [
            -2,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        highlights: [
          "CH"
        ],
        segments: [
          {
            from: [
              -2,
              0,
              0
            ],
            to: [
              0,
              0,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ],
        view: "top"
      }
    },
    {
      id: "l3-oppervlakte-4",
      block: "l3-oppervlakte",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Waarom mag je in een driehoek niet zomaar twee zijden invullen in \xBD \xD7 basis \xD7 hoogte?",
      options: [
        {
          id: "a",
          text: "Omdat de formule uitsluitend voor gelijkzijdige driehoeken geldt."
        },
        {
          id: "b",
          text: "Omdat de langste zijde nooit de basis kan zijn."
        },
        {
          id: "c",
          text: "Omdat de hoogte loodrecht op de gekozen basislijn moet staan; een willekeurige tweede zijde hoeft dat niet te doen."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "Je mag iedere zijde als basis kiezen, maar moet dan de bijbehorende loodrechte hoogte gebruiken. Alleen bij een rechte hoek zijn de twee rechthoekszijden direct een geschikt basis-hoogtepaar.",
      hint: "Welke hoekvoorwaarde hoort bij het woord hoogte?",
      scene: {
        caption: "AB = 6 cm, AM = 3 cm; CM \u27C2 AB en CM = \u221A27 cm.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            3,
            5.196152422706632,
            0
          ],
          M: [
            3,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        highlights: [
          "CM"
        ],
        view: "top"
      }
    },
    {
      id: "l3-oppervlakte-p1",
      block: "l3-oppervlakte",
      skill: "inzicht",
      type: "choice",
      prompt: "Bij basis AB van deze stomphoekige driehoek: welke lengte is de hoogte?",
      options: [
        {
          id: "a",
          text: "AH, want H ligt op de basislijn."
        },
        {
          id: "b",
          text: "CH, want dit is de loodrechte afstand van C tot lijn AB."
        },
        {
          id: "c",
          text: "AC, want een hoogte is altijd een schuine zijde van de driehoek."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "CH staat loodrecht op de basislijn. De plaats van het voetpunt buiten de driehoek verandert dat niet.",
      hint: "Zoek de loodlijn vanuit het overstaande hoekpunt.",
      scene: {
        caption: "AB = 6 cm. CH = 4 cm en CH \u27C2 lijn AB; H ligt op de verlengde AB voorbij A.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            -2,
            4,
            0
          ],
          H: [
            -2,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        highlights: [
          "CH"
        ],
        segments: [
          {
            from: [
              -2,
              0,
              0
            ],
            to: [
              0,
              0,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ],
        view: "top"
      }
    },
    {
      id: "l3-oppervlakte-p2",
      block: "l3-oppervlakte",
      skill: "inzicht",
      type: "choice",
      prompt: "Een driehoekig piramidezijvlak ABT heeft AB = 6 cm en AT = BT = 5 cm. M is het midden van AB; TM = 4 cm. Welke hoogte hoort bij basis AB?",
      options: [
        {
          id: "a",
          text: "AM = 3 cm, want een halve basis is altijd een hoogte."
        },
        {
          id: "b",
          text: "TM = 4 cm, want TM staat in dit zijvlak loodrecht op AB."
        },
        {
          id: "c",
          text: "AT = 5 cm, want de piramideribbe is de hoogte van het driehoekige zijvlak."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "De hoogte binnen zijvlak ABT is TM. De schuine ribbe AT heeft lengte 5, maar maakt geen rechte hoek met AB.",
      hint: "Het gaat om de hoogte van de driehoek bij basis AB.",
      scene: {
        caption: "Driehoekig zijvlak ABT: AB = 6 cm, AT = BT = 5 cm, TM = 4 cm.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          T: [
            3,
            0,
            4
          ],
          M: [
            3,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BT",
          "TA"
        ],
        highlights: [
          "TM"
        ]
      }
    },
    {
      id: "l3-oppervlakte-r1",
      block: "l3-oppervlakte",
      skill: "rekenen",
      type: "numeric",
      prompt: "Driehoek ABC heeft AB = 10 cm, AC = 5 cm en AM = 3 cm. M ligt op AB en CM \u27C2 AB. Bereken de oppervlakte in cm\xB2, op twee decimalen.",
      answer: [
        "20"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB2",
      working: true,
      explanation: "CM = \u221A(AC\xB2 \u2212 AM\xB2) = \u221A(25 \u2212 9) = 4 cm. Oppervlakte = 1/2 \xD7 10 \xD7 4 = 20 cm\xB2.",
      hint: "Gebruik eerst rechthoekige driehoek AMC.",
      scene: {
        caption: "AB = 10 cm, AC = 5 cm, AM = 3 cm; CM \u27C2 AB.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            10,
            0,
            0
          ],
          C: [
            3,
            4,
            0
          ],
          M: [
            3,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        highlights: [
          "CM"
        ],
        view: "top"
      }
    },
    {
      id: "l3-oppervlakte-r2",
      block: "l3-oppervlakte",
      skill: "rekenen",
      type: "numeric",
      prompt: "AB = 8 cm. C ligt op loodrechte afstand 3 cm van lijn AB; het voetpunt H ligt buiten AB. Bereken de oppervlakte in cm\xB2, op twee decimalen.",
      answer: [
        "12"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB2",
      working: true,
      explanation: "Bij basis AB is de hoogte CH = 3 cm. Oppervlakte = 1/2 \xD7 8 \xD7 3 = 12 cm\xB2, ook met het voetpunt buiten de driehoek.",
      hint: "Gebruik de gegeven loodrechte afstand.",
      scene: {
        caption: "AB = 8 cm en CH = 3 cm; CH \u27C2 AB en H ligt voorbij A.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            -2,
            3,
            0
          ],
          H: [
            -2,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        highlights: [
          "CH"
        ],
        segments: [
          {
            from: [
              -2,
              0,
              0
            ],
            to: [
              0,
              0,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ],
        view: "top"
      }
    },
    {
      id: "l3-inhoud-1",
      block: "l3-inhoud",
      skill: "rekenen",
      type: "choice",
      prompt: "Een piramide heeft grondoppervlakte 24 cm\xB2 en loodrechte hoogte 5 cm. Welke inhoud hoort daarbij?",
      options: [
        {
          id: "a",
          text: "40 cm\xB3"
        },
        {
          id: "b",
          text: "120 cm\xB3"
        },
        {
          id: "c",
          text: "60 cm\xB3"
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Voor een piramide geldt V = 1/3 \xD7 grondoppervlakte \xD7 loodrechte hoogte = 1/3 \xD7 24 \xD7 5 = 40 cm\xB3. De uitkomst 120 hoort bij een prisma met dezelfde grondoppervlakte en hoogte.",
      hint: "Welk deel van een overeenkomstig prisma vult een piramide?",
      scene: {
        caption: "Piramide met grondvlak 6 \xD7 4 cm en loodrechte hoogte TO = 5 cm.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          T: [
            3,
            2,
            5
          ],
          O: [
            3,
            2,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "TO"
        ]
      }
    },
    {
      id: "l3-inhoud-2",
      block: "l3-inhoud",
      skill: "rekenen",
      type: "numeric",
      prompt: "Het rechte prisma heeft een rechthoekige driehoek als grondvlak: AB = 3 cm en AC = 4 cm. De prismahoogte is 9 cm. Bereken de inhoud in cm\xB3, op twee decimalen.",
      answer: [
        "54"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB3",
      working: true,
      explanation: "Grondoppervlakte = 1/2 \xD7 3 \xD7 4 = 6 cm\xB2. Prisma-inhoud = 6 \xD7 9 = 54 cm\xB3.",
      hint: "Bereken eerst de driehoekige grondoppervlakte; pas daarna de prismahoogte toe.",
      scene: {
        caption: "Recht prisma ABC.DEF met rechthoekige driehoek ABC: AB = 3 cm, AC = 4 cm en hoogte AD = 9 cm.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            3,
            0,
            0
          ],
          C: [
            0,
            4,
            0
          ],
          D: [
            0,
            0,
            9
          ],
          E: [
            3,
            0,
            9
          ],
          F: [
            0,
            4,
            9
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ]
      }
    },
    {
      id: "l3-inhoud-3",
      block: "l3-inhoud",
      skill: "rekenen",
      type: "numeric",
      prompt: "In hetzelfde prisma zijn P en R middens van DE en DF. Bereken de inhoud van de weggehaalde piramide A.DPR in cm\xB3, op twee decimalen.",
      answer: [
        "4.5"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB3",
      working: true,
      explanation: "DPR is door middenparallel gelijkvormig met DEF, met lengtefactor 1/2 en oppervlaktefactor 1/4. Oppervlakte DPR = 6/4 = 1,5 cm\xB2. De afstand van A tot het bovenvlak is 9 cm. Inhoud = 1/3 \xD7 1,5 \xD7 9 = 4,5 cm\xB3.",
      hint: "Neem DPR als grondvlak; de piramidehoogte is de afstand van A tot vlak DEF.",
      scene: {
        caption: "ABC is rechthoekig met AB = 3 en AC = 4 cm. AD = 9 cm. P, Q, R zijn middens van DE, EF, FD. Verwijder de drie hoekpiramides A.DPR, B.EPQ en C.FQR.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            3,
            0,
            0
          ],
          C: [
            0,
            4,
            0
          ],
          D: [
            0,
            0,
            9
          ],
          E: [
            3,
            0,
            9
          ],
          F: [
            0,
            4,
            9
          ],
          P: [
            1.5,
            0,
            9
          ],
          Q: [
            1.5,
            2,
            9
          ],
          R: [
            0,
            2,
            9
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ]
      },
      revealScene: {
        caption: "Piramide A.DPR: driehoek DPR heeft oppervlakte 1,5 cm\xB2; hoogte AD = 9 cm.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          D: [
            0,
            0,
            9
          ],
          P: [
            1.5,
            0,
            9
          ],
          R: [
            0,
            2,
            9
          ]
        },
        edges: [
          "DP",
          "PR",
          "RD",
          "AD",
          "AP",
          "AR"
        ]
      }
    },
    {
      id: "l3-inhoud-4",
      block: "l3-inhoud",
      skill: "rekenen",
      type: "numeric",
      prompt: "Van het prisma met AB = 3 cm, AC = 4 cm en hoogte 9 cm verwijder je A.DPR, B.EPQ en C.FQR. P, Q en R zijn ribbemiddens. Bereken de resterende inhoud in cm\xB3, op twee decimalen.",
      answer: [
        "40.5"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB3",
      working: true,
      explanation: "Het prisma heeft inhoud 54 cm\xB3. Iedere hoekpiramide heeft grondoppervlakte 1,5 cm\xB2 en hoogte 9 cm, dus inhoud 4,5 cm\xB3. De drie verwijderde delen overlappen niet in hun binnenste. Rest = 54 \u2212 3 \xD7 4,5 = 40,5 cm\xB3.",
      hint: "Maak een som: volledig lichaam min precies de drie verwijderde delen.",
      scene: {
        caption: "ABC is rechthoekig met AB = 3 en AC = 4 cm. AD = 9 cm. P, Q, R zijn middens van DE, EF, FD. Verwijder de drie hoekpiramides A.DPR, B.EPQ en C.FQR.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            3,
            0,
            0
          ],
          C: [
            0,
            4,
            0
          ],
          D: [
            0,
            0,
            9
          ],
          E: [
            3,
            0,
            9
          ],
          F: [
            0,
            4,
            9
          ],
          P: [
            1.5,
            0,
            9
          ],
          Q: [
            1.5,
            2,
            9
          ],
          R: [
            0,
            2,
            9
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ]
      },
      revealScene: {
        caption: "Overblijvend lichaam ABCPQR. Volledig prisma minus drie niet-overlappende hoekpiramides.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            3,
            0,
            0
          ],
          C: [
            0,
            4,
            0
          ],
          P: [
            1.5,
            0,
            9
          ],
          Q: [
            1.5,
            2,
            9
          ],
          R: [
            0,
            2,
            9
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "PQ",
          "QR",
          "RP",
          "AP",
          "AR",
          "BP",
          "BQ",
          "CQ",
          "CR"
        ],
        planes: [
          [
            "P",
            "Q",
            "R"
          ]
        ]
      }
    },
    {
      id: "l3-inhoud-p1",
      block: "l3-inhoud",
      skill: "rekenen",
      type: "choice",
      prompt: "Een piramide heeft een driehoekig grondvlak met oppervlakte 15 cm\xB2 en loodrechte hoogte 6 cm. Wat is de inhoud?",
      options: [
        {
          id: "a",
          text: "30 cm\xB3"
        },
        {
          id: "b",
          text: "90 cm\xB3"
        },
        {
          id: "c",
          text: "45 cm\xB3"
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Het grondvlak mag elke vorm hebben. Voor een piramide blijft de factor 1/3 nodig: V = 1/3 \xD7 15 \xD7 6 = 30 cm\xB3.",
      hint: "De grondoppervlakte is al gegeven; kies nu de formule voor het lichaam.",
      scene: {
        caption: "Piramide ABC.T: oppervlakte ABC = 15 cm\xB2, TO = 6 cm en TO \u27C2 vlak ABC.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            5,
            0
          ],
          T: [
            2,
            2,
            6
          ],
          O: [
            2,
            2,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        highlights: [
          "TO"
        ]
      }
    },
    {
      id: "l3-inhoud-p2",
      block: "l3-inhoud",
      skill: "rekenen",
      type: "choice",
      prompt: "Deze schuine piramide heeft grondoppervlakte 24 cm\xB2 en loodrechte hoogte 5 cm. Wat is de inhoud?",
      options: [
        {
          id: "a",
          text: "40 cm\xB3"
        },
        {
          id: "b",
          text: "120 cm\xB3"
        },
        {
          id: "c",
          text: "Dat kan niet worden berekend zonder alle schuine ribben."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Ook bij een schuine piramide is V = 1/3 \xD7 B \xD7 h. Met de loodrechte hoogte 5 cm krijg je 40 cm\xB3; de schuine ribben zijn niet nodig.",
      hint: "De inhoudsformule gebruikt de loodrechte hoogte en geldt ook bij een schuine topstand.",
      scene: {
        caption: "Schuine piramide: grondvlak 6 \xD7 4 cm; loodrechte hoogte TO = 5 cm. O ligt buiten het grondvlak.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          T: [
            10,
            2,
            5
          ],
          O: [
            10,
            2,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "TO"
        ]
      }
    },
    {
      id: "l3-inhoud-r1",
      block: "l3-inhoud",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een piramide heeft grondoppervlakte 18 cm\xB2 en loodrechte hoogte 7 cm. Bereken de inhoud in cm\xB3, op twee decimalen.",
      answer: [
        "42"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB3",
      working: true,
      explanation: "V = 1/3 \xD7 18 \xD7 7 = 42 cm\xB3.",
      hint: "Noteer de factor die een piramide onderscheidt van een prisma.",
      scene: {
        caption: "Piramide: rechthoekig grondvlak 6 \xD7 3 cm en loodrechte hoogte 7 cm.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            3,
            0
          ],
          D: [
            0,
            3,
            0
          ],
          T: [
            3,
            1.5,
            7
          ],
          O: [
            3,
            1.5,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "TO"
        ]
      }
    },
    {
      id: "l3-inhoud-r2",
      block: "l3-inhoud",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een recht driehoekig prisma heeft AB = 6 cm, AC = 8 cm, hoek A = 90\xB0 en hoogte 10 cm. P, Q, R zijn middens van de bovenribben. Verwijder de drie hoekpiramides A.DPR, B.EPQ en C.FQR. Bereken de restinhoud in cm\xB3, op twee decimalen.",
      answer: [
        "180"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB3",
      working: true,
      explanation: "Grondoppervlakte = 1/2 \xD7 6 \xD7 8 = 24 cm\xB2; prisma-inhoud = 240 cm\xB3. Elke hoekpiramide heeft grondoppervlakte 24/4 = 6 cm\xB2 en hoogte 10 cm, dus inhoud 20 cm\xB3. Rest = 240 \u2212 3 \xD7 20 = 180 cm\xB3.",
      hint: "Gebruik de oppervlaktefactor 1/4 voor iedere hoekdriehoek en daarna de piramidefactor 1/3.",
      scene: {
        caption: "Recht prisma: AB = 6 cm, AC = 8 cm, AD = 10 cm; P, Q, R zijn ribbemiddens.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          D: [
            0,
            0,
            10
          ],
          E: [
            6,
            0,
            10
          ],
          F: [
            0,
            8,
            10
          ],
          P: [
            3,
            0,
            10
          ],
          Q: [
            3,
            4,
            10
          ],
          R: [
            0,
            4,
            10
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ]
      },
      revealScene: {
        caption: "Overblijvend lichaam na verwijderen van de drie hoekpiramides.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          P: [
            3,
            0,
            10
          ],
          Q: [
            3,
            4,
            10
          ],
          R: [
            0,
            4,
            10
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "PQ",
          "QR",
          "RP",
          "AP",
          "AR",
          "BP",
          "BQ",
          "CQ",
          "CR"
        ],
        planes: [
          [
            "P",
            "Q",
            "R"
          ]
        ]
      }
    },
    {
      id: "l3-goniometrie-1",
      block: "l3-goniometrie",
      skill: "inzicht",
      type: "choice",
      prompt: "In driehoek ABC is hoek B recht. Welke verhouding is tan(\u2220A)?",
      options: [
        {
          id: "a",
          text: "AB / BC"
        },
        {
          id: "b",
          text: "BC / AC"
        },
        {
          id: "c",
          text: "BC / AB"
        }
      ],
      answer: [
        "c"
      ],
      explanation: "Bij hoek A is BC de overstaande en AB de aanliggende rechthoekszijde. Tangens = overstaand/aanliggend, dus BC/AB.",
      hint: "Markeer eerst de gekozen hoek en benoem de twee rechthoekszijden ten opzichte daarvan.",
      scene: {
        caption: "Rechthoekige driehoek ABC: \u2220B = 90\xB0, AB = 4 cm, BC = 3 cm, AC = 5 cm.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            3,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        view: "top"
      }
    },
    {
      id: "l3-goniometrie-2",
      block: "l3-goniometrie",
      skill: "rekenen",
      type: "numeric",
      prompt: "In de rechthoekige driehoek is AB = 8 cm en BC = 6 cm. Bereken hoek A in graden; rond af op een heel aantal graden.",
      answer: [
        "37"
      ],
      tolerance: 0.6,
      decimals: 0,
      unit: "\xB0",
      working: true,
      explanation: "tan(A) = 6/8 = 0,75. A = arctan(0,75) \u2248 36,87\xB0, afgerond 37\xB0. Gebruik gradenmodus.",
      hint: "Je kent overstaande en aanliggende zijde; gebruik de inverse tangens.",
      scene: {
        caption: "\u2220B = 90\xB0, AB = 8 cm en BC = 6 cm.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            8,
            6,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        view: "top"
      }
    },
    {
      id: "l3-goniometrie-3",
      block: "l3-goniometrie",
      skill: "rekenen",
      type: "numeric",
      prompt: "In driehoek ABC is \u2220B = 90\xB0, \u2220A = 30\xB0 en AB = 10 cm. Bereken BC in cm, op twee decimalen.",
      answer: [
        "5.773502691896258"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "tan(30\xB0) = BC/10, dus BC = 10 \xD7 tan(30\xB0) \u2248 5,77 cm.",
      hint: "Schrijf eerst de verhouding op; los daarna de vergelijking voor BC op.",
      scene: {
        caption: "\u2220B = 90\xB0, \u2220A = 30\xB0 en AB = 10 cm.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            10,
            0,
            0
          ],
          C: [
            10,
            5.773502691896258,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        view: "top"
      }
    },
    {
      id: "l3-goniometrie-4",
      block: "l3-goniometrie",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een ladder AC is 6 m lang en maakt bij A een hoek van 60\xB0 met de horizontale grond AB. De muur BC staat loodrecht op de grond. Bereken de hoogte BC in m, op twee decimalen.",
      answer: [
        "5.196152422706632"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "m",
      working: true,
      explanation: "AC is de schuine zijde en BC staat tegenover hoek A. sin(60\xB0) = BC/6, dus BC = 6 \xD7 sin(60\xB0) = 3\u221A3 \u2248 5,20 m.",
      hint: "Gebruik de verhouding met overstaande zijde en schuine zijde.",
      scene: {
        caption: "Ladder AC = 6 m, grond AB horizontaal, muur BC verticaal; \u2220A = 60\xB0.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            3,
            0,
            0
          ],
          C: [
            3,
            0,
            5.196152422706632
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ]
      }
    },
    {
      id: "l3-goniometrie-p1",
      block: "l3-goniometrie",
      skill: "inzicht",
      type: "choice",
      prompt: "\u2220B = 90\xB0, AB = 6 cm en BC = 8 cm. Welke verhouding is tan(\u2220C)?",
      options: [
        {
          id: "a",
          text: "AB / BC"
        },
        {
          id: "b",
          text: "BC / AB"
        },
        {
          id: "c",
          text: "AB / AC"
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Ten opzichte van hoek C is AB overstaand en BC aanliggend. Daarom tan(C) = AB/BC. De rollen wisselen wanneer je de andere scherpe hoek kiest.",
      hint: "Benoem de zijden opnieuw vanuit hoek C.",
      scene: {
        caption: "\u2220B = 90\xB0, AB = 6 cm en BC = 8 cm; de gevraagde hoek ligt bij C.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            8,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        view: "top"
      }
    },
    {
      id: "l3-goniometrie-p2",
      block: "l3-goniometrie",
      skill: "inzicht",
      type: "choice",
      prompt: "In driehoek KLM is \u2220L = 90\xB0, KL = 12 cm en LM = 5 cm. Welke verhouding is tan(\u2220K)?",
      options: [
        {
          id: "a",
          text: "LM / KL"
        },
        {
          id: "b",
          text: "KL / LM"
        },
        {
          id: "c",
          text: "LM / KM"
        }
      ],
      answer: [
        "a"
      ],
      explanation: "LM ligt tegenover K, KL is de aanliggende rechthoekszijde. Dus tan(K) = LM/KL = 5/12.",
      hint: "De verhouding tangens blijft overstaand gedeeld door aanliggend, ongeacht de letters.",
      scene: {
        caption: "\u2220L = 90\xB0, KL = 12 cm en LM = 5 cm.",
        showCube: false,
        points: {
          K: [
            0,
            0,
            0
          ],
          L: [
            12,
            0,
            0
          ],
          M: [
            12,
            5,
            0
          ]
        },
        edges: [
          "KL",
          "LM",
          "MK"
        ],
        view: "top"
      }
    },
    {
      id: "l3-goniometrie-r1",
      block: "l3-goniometrie",
      skill: "rekenen",
      type: "numeric",
      prompt: "\u2220B = 90\xB0, AB = 5 cm en BC = 12 cm. Bereken hoek C in graden; rond af op een heel aantal graden.",
      answer: [
        "23"
      ],
      tolerance: 0.6,
      decimals: 0,
      unit: "\xB0",
      working: true,
      explanation: "Bij C is AB de overstaande en BC de aanliggende zijde. tan(C) = 5/12, dus C = arctan(5/12) \u2248 22,62\xB0, afgerond 23\xB0.",
      hint: "Kijk vanuit de gevraagde hoek C, niet vanuit A.",
      scene: {
        caption: "\u2220B = 90\xB0, AB = 5 cm en BC = 12 cm; bepaal \u2220C.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            5,
            0,
            0
          ],
          C: [
            5,
            12,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        view: "top"
      }
    },
    {
      id: "l3-goniometrie-r2",
      block: "l3-goniometrie",
      skill: "rekenen",
      type: "numeric",
      prompt: "In een rechthoekige driehoek is \u2220B = 90\xB0, AC = 10 cm en \u2220A = 35\xB0. Bereken BC in cm, op twee decimalen.",
      answer: [
        "5.7357643635104605"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "BC ligt tegenover A en AC is de schuine zijde. sin(35\xB0) = BC/10, dus BC = 10 \xD7 sin(35\xB0) \u2248 5,74 cm.",
      hint: "Kies de verhouding met de gegeven schuine zijde.",
      scene: {
        caption: "\u2220B = 90\xB0, AC = 10 cm en \u2220A = 35\xB0.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8.191520442889917,
            0,
            0
          ],
          C: [
            8.191520442889917,
            5.7357643635104605,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        view: "top"
      }
    },
    {
      id: "l2-hulpvlak-check-1",
      block: "l2-hulpvlak",
      skill: "construeren",
      type: "choice",
      prompt: "Je zoekt DF \u2229 vlak ACG. Welk hulpvlak is passend?",
      options: [
        {
          id: "a",
          text: "BDHF, omdat D en F in dat vlak liggen."
        },
        {
          id: "b",
          text: "ABCD, omdat D in dat vlak ligt; \xE9\xE9n lijnpunt is genoeg."
        },
        {
          id: "c",
          text: "EFGH, omdat een hulpvlak altijd horizontaal moet zijn."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "BDHF bevat de gehele lijn DF. Het snijdt ACG in de lijn door het middelpunt van het grondvlak en het middelpunt van het bovenvlak. DF ontmoet die lijn in het kubusmiddelpunt.",
      hint: "Controleer beide punten van de te onderzoeken lijn.",
      scene: {
        caption: "Kubus ABCD.EFGH; onderzoek DF \u2229 vlak ACG.",
        showCube: true,
        highlights: [
          "DF"
        ],
        planes: [
          [
            "A",
            "C",
            "G"
          ]
        ]
      }
    },
    {
      id: "l2-hulpvlak-check-2",
      block: "l2-hulpvlak",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een hulpvlak H bevat lijn l. H snijdt doelvlak V in s. l snijdt s in precies \xE9\xE9n punt S. Welke conclusie volgt?",
      options: [
        {
          id: "a",
          text: "Elk punt van H ligt ook in V."
        },
        {
          id: "b",
          text: "De hele lijn l ligt in V."
        },
        {
          id: "c",
          text: "S ligt op l en in V."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "S ligt op l en op s. Omdat s in V ligt, ligt S in V. Dit bewijst de lijn-vlaksnijding zonder te vertrouwen op de projectie.",
      hint: "Gebruik dat de snijlijn in beide vlakken ligt.",
      scene: {
        caption: "S = AG \u2229 EK ligt in vlak BDE. De gelijke co\xF6rdinaten van S zijn elk \u2153 van de kubusribbe.",
        showCube: true,
        points: {
          K: [
            0.5,
            0.5,
            0
          ],
          S: [
            0.3333333333333333,
            0.3333333333333333,
            0.3333333333333333
          ]
        },
        highlights: [
          "AG",
          "EK"
        ],
        planes: [
          [
            "B",
            "D",
            "E"
          ]
        ]
      }
    },
    {
      id: "l2-doorsnede-check-3",
      block: "l2-doorsnede",
      skill: "inzicht",
      type: "choice",
      prompt: "In een nieuwe kubusdoorsnede ligt P op AB, Q op BC en R op FG. Welke verbinding is geen randzijde, hoewel zij in het doorsnedevlak ligt?",
      options: [
        {
          id: "a",
          text: "PR"
        },
        {
          id: "b",
          text: "PQ"
        },
        {
          id: "c",
          text: "QR"
        }
      ],
      answer: [
        "a"
      ],
      explanation: "PR ligt niet in \xE9\xE9n kubuszijvlak. Het is een diagonaal binnen de doorsnede; PQ en QR liggen wel in zijvlakken.",
      hint: "Toets voor elk lijnstuk of de twee eindpunten een zijvlak delen.",
      scene: {
        caption: "P is het midden van AB; Q is het midden van BC; R is het midden van FG.",
        showCube: true,
        points: {
          P: [
            0.5,
            0,
            0
          ],
          Q: [
            1,
            0.5,
            0
          ],
          R: [
            1,
            0.5,
            1
          ]
        }
      }
    },
    {
      id: "l2-doorsnede-check-4",
      block: "l2-doorsnede",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een kubus heeft ribbe 10 cm. P op AE, Q op BF en R op CG hebben hoogtes AP = 2 cm, BQ = 5 cm en CR = 7 cm. Het vlak PQR snijdt DH in S. Bereken DS in cm, op twee decimalen.",
      answer: [
        "4"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "PS \u2225 QR. Van Q naar R stijgt de hoogte 7 \u2212 5 = 2 cm over dezelfde diepte als van P naar S. Daarom DS = 2 + 2 = 4 cm.",
      hint: "Vergelijk de gelijke richtingen in tegenoverliggende vlakken.",
      scene: {
        caption: "Ribbe 10 cm; AP = 2 cm, BQ = 5 cm en CR = 7 cm.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.2
          ],
          Q: [
            1,
            0,
            0.5
          ],
          R: [
            1,
            1,
            0.7
          ]
        },
        highlights: [
          "PQ",
          "QR"
        ]
      }
    },
    {
      id: "l2-buiten-check-5",
      block: "l2-buiten",
      skill: "construeren",
      type: "choice",
      prompt: "Je hebt X en Y buiten een balk geconstrueerd. Beide liggen in het doorsnedevlak en het grondvlak. Welke constructiestap is geldig?",
      options: [
        {
          id: "a",
          text: "Teken geen lijn: buitenpunten tellen niet."
        },
        {
          id: "b",
          text: "Teken XY als snijlijn en bepaal daarna de stukken binnen de balk."
        },
        {
          id: "c",
          text: "Verbind X met een willekeurige bovenhoek om de grondvlak-snijlijn te krijgen."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Twee verschillende gemeenschappelijke punten bepalen de snijlijn. Hun ligging buiten het vaste lichaam verandert de vlakmeetkundige constructie niet.",
      hint: "Een vlak loopt verder dan een getekend zijvlak.",
      scene: {
        caption: "X en Y zijn twee verschillende gemeenschappelijke punten van grondvlak en doorsnedevlak.",
        showCube: true,
        points: {
          X: [
            -0.5,
            0,
            0
          ],
          Y: [
            1.5,
            1,
            0
          ]
        }
      }
    },
    {
      id: "l2-buiten-check-6",
      block: "l2-buiten",
      skill: "rekenen",
      type: "numeric",
      prompt: "De kubusribbe is 4 cm. M op AE heeft AM = 1 cm. X = GM \u2229 AC ligt voorbij A. Bereken AX in cm, op twee decimalen.",
      answer: [
        "1.885618083164127"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "XA/XC = AM/CG = 1/4. AC = 4\u221A2 en XC = XA + AC, dus 4XA = XA + 4\u221A2. Daarom XA = 4\u221A2/3 \u2248 1,89 cm.",
      hint: "Gebruik gelijkvormigheid binnen diagonaalvlak ACGE.",
      scene: {
        caption: "Ribbe 4 cm; AM = 1 cm. Onderzoek de volledige lijnen GM en AC.",
        showCube: true,
        points: {
          M: [
            0,
            0,
            0.25
          ]
        },
        highlights: [
          "GM",
          "AC"
        ]
      }
    },
    {
      id: "l2-gelijkvormig-check-7",
      block: "l2-gelijkvormig",
      skill: "rekenen",
      type: "numeric",
      prompt: "In driehoek ABC is AB = 12 cm en BC = 20 cm. P ligt op AB met AP = 9 cm; PQ \u2225 BC. Bereken PQ in cm, op twee decimalen.",
      answer: [
        "15"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "ABC \u2192 APQ heeft lengtefactor 9/12 = 3/4. Daarom PQ = 3/4 \xD7 20 = 15 cm.",
      hint: "Koppel PQ aan de overeenkomstige zijde BC.",
      scene: {
        caption: "AB = 12 cm, BC = 20 cm en AP = 9 cm; PQ \u2225 BC.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            12,
            0,
            0
          ],
          C: [
            0,
            16,
            0
          ],
          P: [
            9,
            0,
            0
          ],
          Q: [
            0,
            12,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "PQ"
        ],
        view: "top"
      }
    },
    {
      id: "l2-gelijkvormig-check-8",
      block: "l2-gelijkvormig",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een leerling vindt AP/AB = 2/5 en schrijft vervolgens AQ = AC \xD7 5/2. Wat moet worden verbeterd?",
      options: [
        {
          id: "a",
          text: "Niets: je moet de factor bij iedere volgende zijde omkeren."
        },
        {
          id: "b",
          text: "Gebruik AQ = AC \xD7 2/5; beide lengtes gaan van de grote naar de kleine driehoek."
        },
        {
          id: "c",
          text: "Gebruik AQ = AC \xD7 (2/5)\xB2, want het gaat om een driehoek."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "AQ en AP horen bij de kleine driehoek, AC en AB bij de grote. Alle lengteverhoudingen moeten dezelfde richting volgen.",
      hint: "Schrijf bij beide zijden dezelfde pijl van groot naar klein.",
      scene: {
        caption: "PQ \u2225 BC en AP/AB = 2/5.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            10,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          P: [
            4,
            0,
            0
          ],
          Q: [
            0,
            3.2,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "PQ"
        ],
        view: "top"
      }
    },
    {
      id: "l3-ruimtefiguren-check-1",
      block: "l3-ruimtefiguren",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Welke eigenschap rechtvaardigt het tekenen van evenwijdige snijlijnen?",
      options: [
        {
          id: "a",
          text: "De twee vlakken liggen aan verschillende kanten van de tekening."
        },
        {
          id: "b",
          text: "De twee betrokken vlakken zijn evenwijdig en worden door hetzelfde derde vlak gesneden."
        },
        {
          id: "c",
          text: "De twee vlakken hebben dezelfde vorm of oppervlakte."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "De regel berust op evenwijdigheid van de vlakken, niet op hun naam, vorm of positie op het scherm.",
      hint: "Noem de noodzakelijke voorwaarde voordat je de constructieregel gebruikt.",
      scene: {
        caption: "Driehoekig prisma ABC.DEF; ABC en DEF zijn evenwijdige vlakken.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            0,
            2,
            0
          ],
          D: [
            0,
            0,
            3
          ],
          E: [
            2,
            0,
            3
          ],
          F: [
            0,
            2,
            3
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ],
        planes: [
          [
            "A",
            "B",
            "C"
          ],
          [
            "D",
            "E",
            "F"
          ]
        ]
      }
    },
    {
      id: "l3-ruimtefiguren-check-2",
      block: "l3-ruimtefiguren",
      skill: "construeren",
      type: "points",
      prompt: "In het prisma is P het midden van AB, Q het midden van AC en R het midden van BE. Selecteer de twee gegeven punten waarmee je een randstuk in grondvlak ABC tekent.",
      answer: [
        "P",
        "Q"
      ],
      selectCount: 2,
      explanation: "P en Q liggen op ribben van grondvlak ABC. Daarom is PQ de eerste randzijde in dat vlak.",
      hint: "Controleer welke twee gegeven punten dezelfde hoogte nul hebben.",
      scene: {
        caption: "Recht driehoekig prisma ABC.DEF. P en Q zijn de middens van AB en AC; R is het midden van BE.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            0,
            2,
            0
          ],
          D: [
            0,
            0,
            3
          ],
          E: [
            2,
            0,
            3
          ],
          F: [
            0,
            2,
            3
          ],
          P: [
            1,
            0,
            0
          ],
          Q: [
            0,
            1,
            0
          ],
          R: [
            2,
            0,
            1.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ]
      }
    },
    {
      id: "l3-ruimtefiguren-check-3",
      block: "l3-ruimtefiguren",
      skill: "construeren",
      type: "choice",
      prompt: "Bij de piramideconstructie zijn X = PQ \u2229 AB en Y = (lijn door X evenwijdig aan QR) \u2229 CD gevonden. Hoe vind je het vierde hoekpunt S op DT?",
      options: [
        {
          id: "a",
          text: "Teken RY en neem S = RY \u2229 DT."
        },
        {
          id: "b",
          text: "Neem automatisch het midden van DT."
        },
        {
          id: "c",
          text: "Teken door R altijd een lijn evenwijdig aan PQ."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "R en Y liggen beide in zijvlak CDT \xE9n in het doorsnedevlak. Daarom is RY hun snijlijn. Het snijpunt met DT is S.",
      hint: "Zoek in zijvlak CDT twee punten die al in het doorsnedevlak liggen.",
      scene: {
        caption: "P op AT met AP = \xBC AT; Q en R zijn middens van BT en CT. X en Y liggen op de verlengde AB en CD.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            2,
            2,
            0
          ],
          D: [
            0,
            2,
            0
          ],
          T: [
            1,
            1,
            4
          ],
          P: [
            0.25,
            0.25,
            1
          ],
          Q: [
            1.5,
            0.5,
            2
          ],
          R: [
            1.5,
            1.5,
            2
          ],
          X: [
            -1,
            0,
            0
          ],
          Y: [
            -1,
            2,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "PQ",
          "QR"
        ],
        segments: [
          {
            from: [
              -1,
              0,
              0
            ],
            to: [
              -1,
              2,
              0
            ],
            color: "#66d9ca",
            dashed: true
          },
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              -1,
              0,
              0
            ],
            color: "#66d9ca",
            dashed: true
          },
          {
            from: [
              0,
              2,
              0
            ],
            to: [
              -1,
              2,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ]
      },
      revealScene: {
        caption: "X = PQ \u2229 AB ligt voorbij A. Door X loopt de grondvlak-snijlijn evenwijdig aan QR; Y ligt op de verlengde CD.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            2,
            2,
            0
          ],
          D: [
            0,
            2,
            0
          ],
          T: [
            1,
            1,
            4
          ],
          P: [
            0.25,
            0.25,
            1
          ],
          Q: [
            1.5,
            0.5,
            2
          ],
          R: [
            1.5,
            1.5,
            2
          ],
          S: [
            0.25,
            1.75,
            1
          ],
          X: [
            -1,
            0,
            0
          ],
          Y: [
            -1,
            2,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        highlights: [
          "PQ",
          "QR",
          "RS",
          "SP"
        ],
        segments: [
          {
            from: [
              0.25,
              0.25,
              1
            ],
            to: [
              -1,
              0,
              0
            ],
            color: "#ffab66",
            dashed: true
          },
          {
            from: [
              -1,
              0,
              0
            ],
            to: [
              -1,
              2,
              0
            ],
            color: "#66d9ca",
            dashed: true
          },
          {
            from: [
              -1,
              2,
              0
            ],
            to: [
              1.5,
              1.5,
              2
            ],
            color: "#ffab66",
            dashed: true
          },
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              -1,
              0,
              0
            ],
            color: "#66d9ca",
            dashed: true
          },
          {
            from: [
              0,
              2,
              0
            ],
            to: [
              -1,
              2,
              0
            ],
            color: "#66d9ca",
            dashed: true
          }
        ]
      }
    },
    {
      id: "l3-oppervlakte-check-4",
      block: "l3-oppervlakte",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een gelijkbenige driehoek heeft basis AB = 10 cm en AC = BC = 13 cm. Bereken de oppervlakte in cm\xB2, op twee decimalen.",
      answer: [
        "60"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB2",
      working: true,
      explanation: "De hoogte naar het midden M van AB is CM = \u221A(13\xB2 \u2212 5\xB2) = 12 cm. Oppervlakte = 1/2 \xD7 10 \xD7 12 = 60 cm\xB2.",
      hint: "Bereken de loodrechte hoogte met een halve basis en Pythagoras.",
      scene: {
        caption: "AB = 10 cm, AC = BC = 13 cm; M is het midden van AB.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            10,
            0,
            0
          ],
          C: [
            5,
            12,
            0
          ],
          M: [
            5,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        view: "top"
      }
    },
    {
      id: "l3-inhoud-check-5",
      block: "l3-inhoud",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een recht prisma heeft een gelijkzijdig driehoekig grondvlak met zijde 6 cm en hoogte 8 cm. P, Q en R zijn middens van DE, EF en FD. Je verwijdert hoekpiramides A.DPR, B.EPQ en C.FQR. Bereken de restinhoud in cm\xB3, op twee decimalen.",
      answer: [
        "93.53074360871936"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB3",
      working: true,
      explanation: "De driehoekshoogte is \u221A(6\xB2 \u2212 3\xB2) = \u221A27. Grondoppervlakte = 3\u221A27. Het prisma bevat 24\u221A27. Iedere hoekpiramide bevat 1/3 \xD7 (3\u221A27/4) \xD7 8 = 2\u221A27. Rest = 24\u221A27 \u2212 6\u221A27 = 18\u221A27 = 54\u221A3 \u2248 93,53 cm\xB3.",
      hint: "Combineer de driehoekshoogte, oppervlaktefactor 1/4 en de piramideformule.",
      scene: {
        caption: "Gelijkzijdig grondvlak ABC met zijde 6 cm; prismahoogte 8 cm. P, Q, R zijn ribbemiddens van het bovenvlak.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            3,
            5.196152422706632,
            0
          ],
          D: [
            0,
            0,
            8
          ],
          E: [
            6,
            0,
            8
          ],
          F: [
            3,
            5.196152422706632,
            8
          ],
          P: [
            3,
            0,
            8
          ],
          Q: [
            4.5,
            2.598076211353316,
            8
          ],
          R: [
            1.5,
            2.598076211353316,
            8
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ]
      }
    },
    {
      id: "l3-inhoud-check-6",
      block: "l3-inhoud",
      skill: "inzicht",
      type: "choice",
      prompt: "Je berekent een restinhoud als groot lichaam min meerdere kleinere lichamen. Welke controle voorkomt een te kleine uitkomst door dubbel aftrekken?",
      options: [
        {
          id: "a",
          text: "Tel altijd eerst alle ribbelengtes op."
        },
        {
          id: "b",
          text: "Controleer dat de afgetrokken delen precies het verwijderde gebied vormen en niet in hun binnenste overlappen."
        },
        {
          id: "c",
          text: "Controleer alleen dat alle delen piramides heten."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Een overlap zou twee keer worden afgetrokken. Je moet ook controleren dat er geen te verwijderen deel overblijft of een behouden deel wordt afgetrokken.",
      hint: "Vergelijk de geometrische delen voordat je hun inhouden optelt of aftrekt.",
      scene: {
        caption: "ABC is rechthoekig met AB = 3 en AC = 4 cm. AD = 9 cm. P, Q, R zijn middens van DE, EF, FD. Verwijder de drie hoekpiramides A.DPR, B.EPQ en C.FQR.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            3,
            0,
            0
          ],
          C: [
            0,
            4,
            0
          ],
          D: [
            0,
            0,
            9
          ],
          E: [
            3,
            0,
            9
          ],
          F: [
            0,
            4,
            9
          ],
          P: [
            1.5,
            0,
            9
          ],
          Q: [
            1.5,
            2,
            9
          ],
          R: [
            0,
            2,
            9
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ]
      }
    },
    {
      id: "l3-goniometrie-check-7",
      block: "l3-goniometrie",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een kubus heeft ribbe 4 cm. Driehoek ACG is rechthoekig bij C. Bereken \u2220CAG in graden; rond af op een heel aantal graden.",
      answer: [
        "35"
      ],
      tolerance: 0.6,
      decimals: 0,
      unit: "\xB0",
      working: true,
      explanation: "AC = \u221A(4\xB2 + 4\xB2) = 4\u221A2 cm en CG = 4 cm. tan(\u2220CAG) = CG/AC = 1/\u221A2. De hoek is ongeveer 35,26\xB0, dus afgerond 35\xB0.",
      hint: "Bereken eerst de diagonaal van het grondvlak en werk dan in driehoek ACG.",
      scene: {
        caption: "Kubusribbe 4 cm; werk in rechthoekige driehoek ACG.",
        showCube: true,
        highlights: [
          "AC",
          "CG",
          "AG"
        ],
        planes: [
          [
            "A",
            "C",
            "G"
          ]
        ]
      }
    },
    {
      id: "l3-goniometrie-check-8",
      block: "l3-goniometrie",
      skill: "inzicht",
      type: "choice",
      prompt: "In een rechthoekige driehoek ABC is B de rechte hoek. Je kent AC en hoek C en zoekt AB. Welke vergelijking past?",
      options: [
        {
          id: "a",
          text: "cos(C) = AB / AC"
        },
        {
          id: "b",
          text: "tan(C) = AC / AB"
        },
        {
          id: "c",
          text: "sin(C) = AB / AC"
        }
      ],
      answer: [
        "c"
      ],
      explanation: "Ten opzichte van C is AB overstaand en AC de schuine zijde. Sinus koppelt precies die twee zijden.",
      hint: "Benoem de zijden vanuit hoek C.",
      scene: {
        caption: "\u2220B = 90\xB0; AC en hoek C zijn bekend, AB wordt gezocht.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            3,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        view: "top"
      }
    },
    {
      id: "l4-cos-q1",
      block: "l4-cos",
      skill: "onderbouwen",
      type: "choice",
      prompt: "In driehoek ABC is AB = 6 cm, AC = 5 cm en BC = 7 cm. Welke redenering is geldig?",
      options: [
        {
          id: "a",
          text: "Gebruik de cosinusregel; een rechte hoek is hier niet gegeven en volgt ook niet uit de zijden."
        },
        {
          id: "b",
          text: "De hoeken zijn zonder gradenboog niet te bepalen."
        },
        {
          id: "c",
          text: "Gebruik cos A = 5/6, want dat zijn de twee zijden bij A."
        },
        {
          id: "d",
          text: "Gebruik Pythagoras; die geldt voor elke driehoek die je uit een ruimtelijke figuur haalt."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "Pythagoras vereist een rechte hoek. Hier is 7\xB2 niet gelijk aan 5\xB2 + 6\xB2. De cosinusregel gebruikt de drie bekende zijden zonder een rechte hoek te veronderstellen.",
      hint: "Welke voorwaarde hoort bij Pythagoras?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            1,
            4.898979485566356,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        showCube: false,
        view: "top",
        caption: "Driehoek ABC: AB = 6 cm, AC = 5 cm, BC = 7 cm."
      }
    },
    {
      id: "l4-cos-q2",
      block: "l4-cos",
      skill: "rekenen",
      type: "numeric",
      prompt: "AB = 6 cm, AC = 5 cm en BC = 7 cm. Bereken \u2220CAB in graden. Rond af op twee decimalen.",
      answer: [
        "78.46304096718453"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "cos A = (6\xB2 + 5\xB2 \u2212 7\xB2)/(2 \xD7 6 \xD7 5) = 0,2. Daarom A = arccos(0,2) \u2248 78,46\xB0. Gebruik de gradenstand.",
      hint: "Welke zijde ligt tegenover de gevraagde hoek?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            1,
            4.898979485566356,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        showCube: false,
        view: "top",
        caption: "Driehoek ABC: AB = 6 cm, AC = 5 cm, BC = 7 cm."
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            1,
            4.898979485566356,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        showCube: false,
        view: "top",
        caption: "Driehoek ABC: AB = 6 cm, AC = 5 cm, BC = 7 cm.",
        highlights: [
          "AB",
          "AC"
        ]
      }
    },
    {
      id: "l4-cos-q3",
      block: "l4-cos",
      skill: "rekenen",
      type: "numeric",
      prompt: "AB = 6 cm, AC = 4 cm en \u2220CAB = 60\xB0. Bereken BC in cm. Rond af op twee decimalen.",
      answer: [
        "5.291502622129181"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "BC\xB2 = 6\xB2 + 4\xB2 \u2212 2 \xD7 6 \xD7 4 \xD7 cos 60\xB0 = 28. Dus BC = \u221A28 \u2248 5,29 cm. De zijde en zijn kwadraat zijn verschillende grootheden.",
      hint: "Je kent twee zijden en de ingesloten hoek.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            2.0000000000000004,
            3.4641016151377544,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        showCube: false,
        view: "top",
        caption: "AB = 6 cm, AC = 4 cm, \u2220CAB = 60\xB0; BC is onbekend."
      }
    },
    {
      id: "l4-cos-q4",
      block: "l4-cos",
      skill: "rekenen",
      type: "numeric",
      prompt: "Driehoek ABC heeft AB = 7 cm, AC = 6 cm en BC = 10 cm. Bereken de oppervlakte in cm\xB2. Rond pas het eindantwoord af op twee decimalen.",
      answer: [
        "20.662465970933866"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB2",
      working: true,
      explanation: "cos A = (7\xB2 + 6\xB2 \u2212 10\xB2)/(2 \xD7 7 \xD7 6) = \u22125/28. De hoek A is dus stomp. Oppervlakte = \xBD \xD7 7 \xD7 6 \xD7 sin(arccos(\u22125/28)) \u2248 20,66 cm\xB2. Ook voor een stompe hoek geldt deze oppervlakteformule.",
      hint: "Bepaal eerst de hoek tussen twee bekende zijden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            7,
            0,
            0
          ],
          C: [
            -1.0714285714285714,
            5.9035617059811045,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        showCube: false,
        view: "top",
        caption: "Driehoek ABC: AB = 7 cm, AC = 6 cm, BC = 10 cm."
      }
    },
    {
      id: "l4-cos-p1",
      block: "l4-cos",
      skill: "inzicht",
      type: "choice",
      prompt: "In een driehoek zijn twee zijden 4 en 5 cm. De overstaande zijde van hun ingesloten hoek \u03B1 is 7 cm. Welke vergelijking hoort erbij?",
      options: [
        {
          id: "a",
          text: "7\xB2 = 4\xB2 + 5\xB2, want een driehoek heeft altijd een schuine zijde."
        },
        {
          id: "b",
          text: "7\xB2 = 4\xB2 + 5\xB2 \u2212 2 \xD7 4 \xD7 5 \xD7 cos \u03B1"
        },
        {
          id: "c",
          text: "7 = 4 + 5 \u2212 2 \xD7 4 \xD7 5 \xD7 cos \u03B1"
        },
        {
          id: "d",
          text: "cos \u03B1 = 4/5, ongeacht de derde zijde."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Alleen een rechthoekige driehoek heeft een hypotenusa. Met deze drie zijden is geen rechte hoek aanwezig; de cosinusterm mag daarom niet vervallen.",
      hint: "Welke formule blijft geldig zonder een rechte hoek?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            5,
            0,
            0
          ],
          C: [
            -0.8,
            3.919183588453085,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        showCube: false,
        view: "top",
        caption: "Driehoek ABC: AB = 5 cm, AC = 4 cm, BC = 7 cm."
      }
    },
    {
      id: "l4-cos-p2",
      block: "l4-cos",
      skill: "inzicht",
      type: "choice",
      prompt: "Twee zijden van een driehoek zijn 6 en 8 cm en sluiten een hoek van 120\xB0 in. Hoe bepaal je het kwadraat van de derde zijde c?",
      options: [
        {
          id: "a",
          text: "c\xB2 = 6\xB2 + 8\xB2 = 100; ook bij 120\xB0 geldt Pythagoras."
        },
        {
          id: "b",
          text: "c\xB2 = 8\xB2 \u2212 6\xB2 = 28."
        },
        {
          id: "c",
          text: "c\xB2 = 6\xB2 + 8\xB2 \u2212 2 \xD7 6 \xD7 8 \xD7 cos 120\xB0 = 148."
        },
        {
          id: "d",
          text: "c\xB2 = (6 + 8)\xB2 = 196."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "cos 120\xB0 = \u2212\xBD. De correctieterm is daarom positief: c\xB2 = 100 + 48 = 148. Bij een stompe ingesloten hoek is de tegenoverliggende zijde langer dan bij 90\xB0.",
      hint: "Wat is het teken van cos 120\xB0?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            -2.9999999999999982,
            5.196152422706633,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        showCube: false,
        view: "top",
        caption: "AB = 8 cm, AC = 6 cm; de hoek bij A is 120\xB0."
      }
    },
    {
      id: "l4-cos-r1",
      block: "l4-cos",
      skill: "rekenen",
      type: "numeric",
      prompt: "AB = 8 cm, AC = 7 cm en BC = 9 cm. Bereken \u2220CAB in graden, op twee decimalen.",
      answer: [
        "73.39845040097977"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "cos A = (8\xB2 + 7\xB2 \u2212 9\xB2)/(2 \xD7 8 \xD7 7) = 2/7. Dus A \u2248 73,40\xB0.",
      hint: "Koppel de overstaande zijde aan de gevraagde hoek.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            2,
            6.708203932499369,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        showCube: false,
        view: "top",
        caption: "Driehoek ABC: AB = 8 cm, AC = 7 cm, BC = 9 cm."
      }
    },
    {
      id: "l4-cos-r2",
      block: "l4-cos",
      skill: "rekenen",
      type: "numeric",
      prompt: "Driehoek ABC heeft AB = 6 cm, AC = 4 cm en BC = 8 cm. Bereken de oppervlakte in cm\xB2, op twee decimalen.",
      answer: [
        "11.61895003862225"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm\xB2",
      working: true,
      explanation: "cos A = (6\xB2 + 4\xB2 \u2212 8\xB2)/(2 \xD7 6 \xD7 4) = \u2212\xBC. Oppervlakte = \xBD \xD7 6 \xD7 4 \xD7 sin(arccos(\u2212\xBC)) \u2248 11,62 cm\xB2.",
      hint: "Een stompe hoek verhindert het gebruik van de cosinusregel niet.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            -1,
            3.872983346207417,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        showCube: false,
        view: "top",
        caption: "Driehoek ABC: AB = 6 cm, AC = 4 cm, BC = 8 cm."
      }
    },
    {
      id: "l4-lines-q1",
      block: "l4-lines",
      skill: "inzicht",
      type: "choice",
      prompt: "De lijnen EG en IB kruisen; I is het midden van AE. Wat betekent dat voor hun hoek?",
      options: [
        {
          id: "a",
          text: "Er bestaat geen hoek, omdat de lijnen elkaar niet snijden."
        },
        {
          id: "b",
          text: "De hoek is altijd 90\xB0, omdat de lijnen in verschillende vlakken liggen."
        },
        {
          id: "c",
          text: "Je mag de hoek direct meten in elke perspectieftekening."
        },
        {
          id: "d",
          text: "Die kun je bepalen door \xE9\xE9n lijn evenwijdig te verschuiven tot beide lijnen een punt gemeen hebben."
        }
      ],
      answer: [
        "d"
      ],
      explanation: "Een hoek tussen lijnen wordt bepaald door hun richtingen. Evenwijdig verschuiven brengt deze richtingen bij elkaar, zonder ze te veranderen.",
      hint: "Moeten richtingen een gemeenschappelijk beginpunt hebben om ze te vergelijken?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ],
          I: [
            0,
            0,
            2
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus met ribbe 4 cm; I is het midden van AE. Gegeven lijnen: EG en IB.",
        view: "spatial",
        highlights: [
          "EG",
          "IB"
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ],
          I: [
            0,
            0,
            2
          ],
          J: [
            4,
            0,
            2
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "EJ \u2225 IB: I verschuift naar E en B naar J. De hoek wordt gemeten in driehoek EJG.",
        view: "spatial",
        highlights: [
          "EG",
          "IB",
          "EJ",
          "JG"
        ]
      }
    },
    {
      id: "l4-lines-q2",
      block: "l4-lines",
      skill: "rekenen",
      type: "numeric",
      prompt: "Bereken in een kubus de kleinste hoek tussen AB en DG in graden. Rond af op twee decimalen.",
      answer: [
        "45"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "DG \u2225 AF. Daardoor is \u2220(AB,DG) gelijk aan \u2220BAF. In het vierkant ABFE is AF een diagonaal: \u2220BAF = 45\xB0.",
      hint: "Welke lijn door A is evenwijdig aan DG?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AB",
          "DG"
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "DG \u2225 AF. In het vierkant ABFE maakt AF een hoek van 45\xB0 met AB.",
        view: "spatial",
        highlights: [
          "AB",
          "DG",
          "AF"
        ]
      }
    },
    {
      id: "l4-lines-q3",
      block: "l4-lines",
      skill: "construeren",
      type: "points",
      prompt: "I is het midden van AE en J het midden van BF. Selecteer de twee punten die de lijn door E evenwijdig aan IB bepalen.",
      answer: [
        "E",
        "J"
      ],
      selectCount: 2,
      explanation: "Een verschuiving over een halve ribbe omhoog stuurt I naar E en B naar J. De lijn EJ heeft daardoor precies dezelfde richting als IB.",
      hint: "Welke gelijke verplaatsing stuurt I naar E en waar komt B dan terecht?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ],
          I: [
            0,
            0,
            2
          ],
          J: [
            4,
            0,
            2
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "I is het midden van AE, J het midden van BF. Ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "EG",
          "IB"
        ]
      },
      extraPoints: {
        A: [
          0,
          0,
          0
        ],
        B: [
          4,
          0,
          0
        ],
        C: [
          4,
          4,
          0
        ],
        D: [
          0,
          4,
          0
        ],
        E: [
          0,
          0,
          4
        ],
        F: [
          4,
          0,
          4
        ],
        G: [
          4,
          4,
          4
        ],
        H: [
          0,
          4,
          4
        ],
        I: [
          0,
          0,
          2
        ],
        J: [
          4,
          0,
          2
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ],
          I: [
            0,
            0,
            2
          ],
          J: [
            4,
            0,
            2
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "EJ \u2225 IB: I verschuift naar E en B naar J. De hoek wordt gemeten in driehoek EJG.",
        view: "spatial",
        highlights: [
          "EG",
          "IB",
          "EJ",
          "JG"
        ]
      }
    },
    {
      id: "l4-lines-q4",
      block: "l4-lines",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een kubus heeft ribbe 4 cm; I is het midden van AE. Bereken de kleinste hoek tussen EG en IB in graden, op twee decimalen.",
      answer: [
        "50.768479516407744"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "Verschuif IB naar EJ, met J het midden van BF. In EJG zijn EG\xB2 = 32 en EJ\xB2 = JG\xB2 = 20. Dus cos \u2220GEJ = 32/(2\u221A32\u221A20) = 2/\u221A10. De kleinste hoek is 50,77\xB0.",
      hint: "Zorg eerst voor twee lijnen door hetzelfde punt.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ],
          I: [
            0,
            0,
            2
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus met ribbe 4 cm; I is het midden van AE. Gegeven lijnen: EG en IB.",
        view: "spatial",
        highlights: [
          "EG",
          "IB"
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ],
          I: [
            0,
            0,
            2
          ],
          J: [
            4,
            0,
            2
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "EJ \u2225 IB: I verschuift naar E en B naar J. De hoek wordt gemeten in driehoek EJG.",
        view: "spatial",
        highlights: [
          "EG",
          "IB",
          "EJ",
          "JG"
        ]
      }
    },
    {
      id: "l4-lines-p1",
      block: "l4-lines",
      skill: "inzicht",
      type: "choice",
      prompt: "AC ligt in het grondvlak en FH in het bovenvlak van een kubus. Wat kun je zeggen over de hoek tussen deze kruisende lijnen?",
      options: [
        {
          id: "a",
          text: "De hoek is 90\xB0: AC \u2225 EG en de diagonalen EG en FH van het bovenvlak staan loodrecht op elkaar."
        },
        {
          id: "b",
          text: "Die hoek bestaat niet, want AC en FH hebben geen gemeenschappelijk punt."
        },
        {
          id: "c",
          text: "De hoek verandert als je de kubus draait."
        },
        {
          id: "d",
          text: "De hoek is 0\xB0, want de grond- en bovenvlakken zijn evenwijdig."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "De evenwijdige vlakken maken de lijnen zelf niet evenwijdig. Verschuif AC naar EG; de twee diagonalen van een vierkant zijn loodrecht.",
      hint: "Vergelijk de richtingen in \xE9\xE9n vlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AC",
          "FH"
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AC",
          "EG",
          "FH"
        ]
      }
    },
    {
      id: "l4-lines-p2",
      block: "l4-lines",
      skill: "inzicht",
      type: "choice",
      prompt: "In een kubus kruisen BC en ED. Welke uitspraak is juist?",
      options: [
        {
          id: "a",
          text: "Hun hoek is ongedefinieerd, omdat BC en ED elkaar niet snijden."
        },
        {
          id: "b",
          text: "Hun hoek is 45\xB0: BC \u2225 AD en ED maakt in het vierkant ADHE een hoek van 45\xB0 met AD."
        },
        {
          id: "c",
          text: "Hun hoek moet uit de schermtekening gemeten worden."
        },
        {
          id: "d",
          text: "Hun hoek is 90\xB0, omdat BC een ribbe en ED een diagonaal is."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Verschuif de richting van BC naar AD. De hoek tussen een zijde en een diagonaal van het vierkant ADHE is 45\xB0.",
      hint: "Welke lijn in ADHE heeft dezelfde richting als BC?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "BC",
          "ED"
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "BC",
          "ED",
          "AD"
        ]
      }
    },
    {
      id: "l4-lines-r1",
      block: "l4-lines",
      skill: "rekenen",
      type: "numeric",
      prompt: "In een kubus zijn de lijnen AC en FH gegeven. Bereken hun kleinste hoek in graden, op twee decimalen.",
      answer: [
        "90"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "AC \u2225 EG. De hoek tussen AC en FH is daarom de hoek tussen EG en FH. De diagonalen van het vierkant EFGH staan loodrecht: 90\xB0.",
      hint: "Maak door evenwijdig verschuiven twee lijnen in hetzelfde vlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            5,
            0,
            0
          ],
          C: [
            5,
            5,
            0
          ],
          D: [
            0,
            5,
            0
          ],
          E: [
            0,
            0,
            5
          ],
          F: [
            5,
            0,
            5
          ],
          G: [
            5,
            5,
            5
          ],
          H: [
            0,
            5,
            5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 5 cm.",
        view: "spatial",
        highlights: [
          "AC",
          "FH"
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            5,
            0,
            0
          ],
          C: [
            5,
            5,
            0
          ],
          D: [
            0,
            5,
            0
          ],
          E: [
            0,
            0,
            5
          ],
          F: [
            5,
            0,
            5
          ],
          G: [
            5,
            5,
            5
          ],
          H: [
            0,
            5,
            5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 5 cm.",
        view: "spatial",
        highlights: [
          "AC",
          "EG",
          "FH"
        ]
      }
    },
    {
      id: "l4-lines-r2",
      block: "l4-lines",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een balk heeft AB = 6 cm, AD = 4 cm en AE = 3 cm. Bereken de kleinste hoek tussen AB en DG in graden, op twee decimalen.",
      answer: [
        "26.56505117707799"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "DG \u2225 AF. In de rechthoekige driehoek ABF geldt tan \u2220BAF = BF/AB = 3/6. De kleinste hoek is dus arctan(\xBD) \u2248 26,57\xB0.",
      hint: "Het evenwijdig verschuiven blijft geldig wanneer de kubus een balk wordt.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            3
          ],
          F: [
            6,
            0,
            3
          ],
          G: [
            6,
            4,
            3
          ],
          H: [
            0,
            4,
            3
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Balk: AB = 6 cm, AD = 4 cm, AE = 3 cm.",
        view: "spatial",
        highlights: [
          "AB",
          "DG"
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            3
          ],
          F: [
            6,
            0,
            3
          ],
          G: [
            6,
            4,
            3
          ],
          H: [
            0,
            4,
            3
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "DG \u2225 AF; gebruik de rechthoekige driehoek ABF.",
        view: "spatial",
        highlights: [
          "AB",
          "DG",
          "AF"
        ]
      }
    },
    {
      id: "l4-plane-q1",
      block: "l4-plane",
      skill: "inzicht",
      type: "choice",
      prompt: "Welke hoek moet je berekenen voor de hoek tussen AG en het grondvlak ABCD?",
      options: [
        {
          id: "a",
          text: "\u2220ABC, omdat die volledig in het grondvlak ligt."
        },
        {
          id: "b",
          text: "\u2220AGC, want de hoek met de normaal is altijd dezelfde hoek."
        },
        {
          id: "c",
          text: "\u2220GAC, omdat AC de loodrechte projectie van AG op ABCD is."
        },
        {
          id: "d",
          text: "\u2220GAB, want elke lijn door A in ABCD is geschikt."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "G wordt langs CG loodrecht op C geprojecteerd; A blijft A. De projectie van AG is AC. Daarom hoort \u2220GAC bij de lijn\u2013vlakhoek.",
      hint: "Op welk punt van het grondvlak valt G bij loodrecht projecteren?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "AG is de lichaamsdiagonaal; ABCD is het grondvlak. Ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "G projecteert loodrecht op C; A ligt al in het grondvlak. De gevraagde hoek is \u2220GAC.",
        view: "spatial",
        highlights: [
          "AG",
          "AC",
          "CG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      }
    },
    {
      id: "l4-plane-q2",
      block: "l4-plane",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Welke gegevens vormen samen een geldig bewijs dat AE loodrecht op vlak ABCD staat?",
      options: [
        {
          id: "a",
          text: "Alleen AE \u27C2 AB; \xE9\xE9n lijn van het vlak is voldoende."
        },
        {
          id: "b",
          text: "AE \u27C2 AB en AE \u27C2 DC; twee evenwijdige richtingen zijn voldoende."
        },
        {
          id: "c",
          text: "AE lijkt verticaal op het scherm en ABCD lijkt horizontaal."
        },
        {
          id: "d",
          text: "AE \u27C2 AB en AE \u27C2 AD; AB en AD snijden in A en liggen in ABCD."
        }
      ],
      answer: [
        "d"
      ],
      explanation: "Je hebt twee verschillende snijdende richtingen in het vlak nodig. AB en DC zijn evenwijdig en leveren maar \xE9\xE9n richting. Een schermori\xEBntatie levert geen ruimtelijk bewijs.",
      hint: "Hoeveel onafhankelijke richtingen in het vlak moet je controleren?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AE"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AE",
          "AB",
          "AD"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      }
    },
    {
      id: "l4-plane-q3",
      block: "l4-plane",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een kubus heeft ribbe 4 cm. Bereken de hoek tussen AG en ABCD in graden, op twee decimalen.",
      answer: [
        "35.264389682754654"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "De projectie van AG is AC. AC = 4\u221A2 en CG = 4. In de rechthoekige driehoek ACG is tan \u03B1 = 4/(4\u221A2) = 1/\u221A2. Dus \u03B1 \u2248 35,26\xB0.",
      hint: "Bereken eerst de lengte van de loodrechte projectie.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "AG is de lichaamsdiagonaal; ABCD is het grondvlak. Ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "G projecteert loodrecht op C; A ligt al in het grondvlak. De gevraagde hoek is \u2220GAC.",
        view: "spatial",
        highlights: [
          "AG",
          "AC",
          "CG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      }
    },
    {
      id: "l4-plane-q4",
      block: "l4-plane",
      skill: "construeren",
      type: "points",
      prompt: "Selecteer de twee eindpunten van de loodrechte projectie van BG op het vlak ADHE.",
      answer: [
        "A",
        "H"
      ],
      selectCount: 2,
      explanation: "B projecteert loodrecht op A en G op H: BA en GH staan loodrecht op vlak ADHE. De geprojecteerde lijn is daarom AH.",
      hint: "Projecteer beide eindpunten van BG op het gekozen vlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Projecteer BG loodrecht op het zijvlak ADHE.",
        view: "spatial",
        highlights: [
          "BG"
        ],
        planes: [
          [
            "A",
            "D",
            "H",
            "E"
          ]
        ]
      },
      extraPoints: {
        A: [
          0,
          0,
          0
        ],
        B: [
          4,
          0,
          0
        ],
        C: [
          4,
          4,
          0
        ],
        D: [
          0,
          4,
          0
        ],
        E: [
          0,
          0,
          4
        ],
        F: [
          4,
          0,
          4
        ],
        G: [
          4,
          4,
          4
        ],
        H: [
          0,
          4,
          4
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "B \u2192 A en G \u2192 H langs loodlijnen op ADHE. De projectie van BG is AH.",
        view: "spatial",
        highlights: [
          "BG",
          "BA",
          "GH",
          "AH"
        ],
        planes: [
          [
            "A",
            "D",
            "H",
            "E"
          ]
        ]
      }
    },
    {
      id: "l4-plane-p1",
      block: "l4-plane",
      skill: "inzicht",
      type: "choice",
      prompt: "Welke hoek vertegenwoordigt de hoek tussen AG en het vlak ABFE?",
      options: [
        {
          id: "a",
          text: "\u2220GAF, omdat G loodrecht op F projecteert en A al in ABFE ligt."
        },
        {
          id: "b",
          text: "\u2220AFG, omdat een rechte hoek altijd de lijn\u2013vlakhoek is."
        },
        {
          id: "c",
          text: "\u2220AGF, omdat de hoek met GF direct de gevraagde hoek is."
        },
        {
          id: "d",
          text: "\u2220GAB, omdat elke lijn door A in ABFE als projectie mag dienen."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "De projectielijn is AF, omdat GF loodrecht staat op ABFE. Een willekeurige lijn in het vlak, zoals AB, vervangt die projectie niet.",
      hint: "Langs welke loodlijn bereikt G het vlak ABFE?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AG"
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
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AG",
          "AF",
          "GF"
        ],
        planes: [
          [
            "A",
            "B",
            "F",
            "E"
          ]
        ]
      }
    },
    {
      id: "l4-plane-p2",
      block: "l4-plane",
      skill: "inzicht",
      type: "choice",
      prompt: "Welke hoek vertegenwoordigt de hoek tussen BG en het vlak ADHE?",
      options: [
        {
          id: "a",
          text: "De kleinste hoek tussen BG en AD; elke lijn in ADHE is geschikt."
        },
        {
          id: "b",
          text: "De kleinste hoek tussen BG en AH; AH is de loodrechte projectie van BG."
        },
        {
          id: "c",
          text: "Altijd 90\xB0, want BG ligt niet in ADHE."
        },
        {
          id: "d",
          text: "De hoek tussen BG en BA; een loodlijn op het vlak geeft altijd de lijn\u2013vlakhoek."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "B projecteert op A en G op H. De projectie is dus AH. Hier is BG evenwijdig aan AH en aan het vlak, zodat de hoek 0\xB0 is. Dat BG buiten ADHE ligt, maakt de hoek niet recht.",
      hint: "Projecteer zowel B als G; vergelijk daarna de richtingen.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "BG"
        ],
        planes: [
          [
            "A",
            "D",
            "H",
            "E"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "BG",
          "AH",
          "BA",
          "GH"
        ],
        planes: [
          [
            "A",
            "D",
            "H",
            "E"
          ]
        ]
      }
    },
    {
      id: "l4-plane-r1",
      block: "l4-plane",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een balk heeft AB = 8 cm, AD = 6 cm en AE = 6 cm. Bereken de hoek tussen AG en ABCD in graden, op twee decimalen.",
      answer: [
        "30.96375653207352"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "AC = \u221A(8\xB2 + 6\xB2) = 10 cm. CG = 6 cm en AC is de loodrechte projectie. Daarom tan \u03B1 = 6/10 en \u03B1 \u2248 30,96\xB0.",
      hint: "De projectielengte is een diagonaal van het grondvlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            8,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            8,
            0,
            6
          ],
          G: [
            8,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "AB = 8 cm, AD = 6 cm, AE = 6 cm.",
        view: "spatial",
        highlights: [
          "AG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            8,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            8,
            0,
            6
          ],
          G: [
            8,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Projectie AC = 10 cm; loodrechte hoogte CG = 6 cm.",
        view: "spatial",
        highlights: [
          "AG",
          "AC",
          "CG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      }
    },
    {
      id: "l4-plane-r2",
      block: "l4-plane",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een lijn maakt 28\xB0 met een normaal op een vlak. Hoe groot is de hoek tussen de lijn en het vlak?",
      options: [
        {
          id: "a",
          text: "Die hoek is zonder de lengte van de lijn niet te bepalen."
        },
        {
          id: "b",
          text: "28\xB0, want normaal en vlak geven dezelfde hoek."
        },
        {
          id: "c",
          text: "62\xB0, want de normaal staat loodrecht op de projectierichting."
        },
        {
          id: "d",
          text: "90\xB0, want de normaal staat loodrecht op het vlak."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "Lijn\u2013vlakhoek en de kleinste hoek met de normaal vullen elkaar aan tot 90\xB0. De gevraagde hoek is 90\xB0 \u2212 28\xB0 = 62\xB0.",
      hint: "Maak een doorsnede door de lijn en de normaal.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            3,
            0
          ],
          D: [
            0,
            3,
            0
          ],
          E: [
            0,
            0,
            9.40363232673166
          ],
          F: [
            4,
            0,
            9.40363232673166
          ],
          G: [
            4,
            3,
            9.40363232673166
          ],
          H: [
            0,
            3,
            9.40363232673166
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "CG staat loodrecht op ABCD; de hoek tussen GA en GC is gegeven als 28\xB0.",
        view: "spatial",
        highlights: [
          "AG",
          "CG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      }
    },
    {
      id: "l4-dihedral-q1",
      block: "l4-dihedral",
      skill: "inzicht",
      type: "choice",
      prompt: "Welke hoek kun je gebruiken als standhoek tussen de vlakken ABCD en ABGH?",
      options: [
        {
          id: "a",
          text: "\u2220DAG: iedere diagonaal in het schuine vlak mag als been dienen."
        },
        {
          id: "b",
          text: "\u2220GAB: twee lijnen uit de vlakken met hetzelfde beginpunt zijn altijd voldoende."
        },
        {
          id: "c",
          text: "\u2220ABC: elke hoek in het grondvlak is een standhoek."
        },
        {
          id: "d",
          text: "\u2220DAH: AD en AH liggen in de juiste vlakken en staan beide loodrecht op hun snijlijn AB."
        }
      ],
      answer: [
        "d"
      ],
      explanation: "Een standhoek gebruikt in beide vlakken een loodlijn op dezelfde snijlijn, door hetzelfde punt. AD en AH voldoen in A. AB zelf gebruiken als \xE9\xE9n been levert geen standhoek.",
      hint: "Bepaal eerst de snijlijn en controleer beide loodrechte richtingen.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Vlakken ABCD en ABGH snijden langs AB. De standhoek moet nog gekozen worden.",
        view: "spatial",
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
            "G",
            "H"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "AD en AH staan beide loodrecht op snijlijn AB. \u2220DAH is een standhoek.",
        view: "spatial",
        highlights: [
          "AB",
          "AD",
          "AH"
        ],
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
            "G",
            "H"
          ]
        ]
      }
    },
    {
      id: "l4-dihedral-q2",
      block: "l4-dihedral",
      skill: "construeren",
      type: "points",
      prompt: "De vlakken ABCD en ADGF snijden langs AD. Selecteer de drie hoekpunten van de driehoek die een standhoek in A bevat en waarmee je deze hoek kunt berekenen.",
      answer: [
        "A",
        "B",
        "F"
      ],
      selectCount: 3,
      explanation: "AB ligt in ABCD, AF in ADGF. Beide staan loodrecht op AD. Daardoor is \u2220BAF een standhoek en ABF de bijbehorende rechthoekige driehoek.",
      hint: "Zoek in elk vlak een loodlijn op AD door A.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Gegeven vlakken ABCD en ADGF; hun snijlijn is AD.",
        view: "spatial",
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ],
          [
            "A",
            "D",
            "G",
            "F"
          ]
        ]
      },
      extraPoints: {
        A: [
          0,
          0,
          0
        ],
        B: [
          4,
          0,
          0
        ],
        C: [
          4,
          4,
          0
        ],
        D: [
          0,
          4,
          0
        ],
        E: [
          0,
          0,
          4
        ],
        F: [
          4,
          0,
          4
        ],
        G: [
          4,
          4,
          4
        ],
        H: [
          0,
          4,
          4
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "AB \u27C2 AD en AF \u27C2 AD; \u2220BAF vertegenwoordigt de vlak\u2013vlakhoek.",
        view: "spatial",
        highlights: [
          "AD",
          "AB",
          "AF",
          "BF"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ],
          [
            "A",
            "D",
            "G",
            "F"
          ]
        ]
      }
    },
    {
      id: "l4-dihedral-q3",
      block: "l4-dihedral",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een balk heeft AB = 5 cm, AD = 6 cm en AE = 4 cm. Bereken de kleinste hoek tussen ABCD en ABGH in graden, op twee decimalen.",
      answer: [
        "33.690067525979785"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "AB is de snijlijn. In standvlak ADHE is \u2220DAH de gevraagde hoek. tan \u2220DAH = DH/AD = 4/6. Dus de vlak\u2013vlakhoek is ongeveer 33,69\xB0.",
      hint: "Welke rechthoekige doorsnede staat loodrecht op AB?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            5,
            0,
            0
          ],
          C: [
            5,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            5,
            0,
            4
          ],
          G: [
            5,
            6,
            4
          ],
          H: [
            0,
            6,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Balk: AB = 5 cm, AD = 6 cm, AE = 4 cm.",
        view: "spatial",
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
            "G",
            "H"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            5,
            0,
            0
          ],
          C: [
            5,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            5,
            0,
            4
          ],
          G: [
            5,
            6,
            4
          ],
          H: [
            0,
            6,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Standdriehoek ADH: AD = 6 cm, DH = 4 cm.",
        view: "spatial",
        highlights: [
          "AD",
          "AH",
          "DH"
        ],
        planes: [
          [
            "A",
            "D",
            "H",
            "E"
          ]
        ]
      }
    },
    {
      id: "l4-dihedral-q4",
      block: "l4-dihedral",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een kubus heeft ribbe 4 cm; J is het midden van BF. Bereken de kleinste hoek tussen EJG en ABFE in graden, op twee decimalen.",
      answer: [
        "65.9051574478893"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "Laat FI loodrecht op EJ vallen. EJ = \u221A20 en uit de oppervlakte van EFJ volgt FI = 4 \xD7 2/\u221A20. FG = 4 en driehoek FIG is recht bij F. tan \u2220FIG = 4/(8/\u221A20) = \u221A5, dus de hoek is ongeveer 65,91\xB0.",
      hint: "Construeer in het voorvlak eerst het voetpunt van F op de snijlijn EJ.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ],
          J: [
            4,
            0,
            2
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus met ribbe 4 cm; J is het midden van BF. Vlakken EJG en ABFE snijden langs EJ.",
        view: "spatial",
        planes: [
          [
            "E",
            "J",
            "G"
          ],
          [
            "A",
            "B",
            "F",
            "E"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ],
          J: [
            4,
            0,
            2
          ],
          I: [
            3.2,
            0,
            2.4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "I is de loodrechte projectie van F op EJ. FI en GI staan loodrecht op EJ; \u2220FIG is de standhoek.",
        view: "spatial",
        highlights: [
          "EJ",
          "FI",
          "GI",
          "FG"
        ],
        planes: [
          [
            "E",
            "J",
            "G"
          ],
          [
            "A",
            "B",
            "F",
            "E"
          ]
        ]
      }
    },
    {
      id: "l4-dihedral-p1",
      block: "l4-dihedral",
      skill: "inzicht",
      type: "choice",
      prompt: "De vlakken ABCD en ADGF snijden langs AD. Welke redenering bepaalt een standhoek?",
      options: [
        {
          id: "a",
          text: "Neem \u2220BAF: AB en AF staan beide loodrecht op AD en vertrekken beide uit A."
        },
        {
          id: "b",
          text: "Neem \u2220GAD: omdat G in het schuine vlak ligt, is iedere hoek met G geschikt."
        },
        {
          id: "c",
          text: "Neem \u2220BCD: het grondvlak bevat vanzelf de gevraagde hoek."
        },
        {
          id: "d",
          text: "Neem \u2220FAD: elk paar lijnen uit de twee vlakken door A is geschikt."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "AD is de snijlijn. Een been langs AD voldoet niet aan de eis loodrecht op AD. AB en AF voldoen wel en vertrekken vanuit hetzelfde punt A.",
      hint: "Moeten de benen langs de snijlijn lopen of er loodrecht op staan?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ],
          [
            "A",
            "D",
            "G",
            "F"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AD",
          "AB",
          "AF"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ],
          [
            "A",
            "D",
            "G",
            "F"
          ]
        ]
      }
    },
    {
      id: "l4-dihedral-p2",
      block: "l4-dihedral",
      skill: "inzicht",
      type: "choice",
      prompt: "De vlakken EFGH en ABGH snijden langs GH. Welke hoek is een standhoek tussen deze vlakken?",
      options: [
        {
          id: "a",
          text: "\u2220BHG: GH mag als een van de benen dienen omdat het de snijlijn is."
        },
        {
          id: "b",
          text: "\u2220AHE: HA en HE staan beide loodrecht op GH en liggen elk in een van de vlakken."
        },
        {
          id: "c",
          text: "\u2220EHG: elke hoek in het bovenvlak voldoet."
        },
        {
          id: "d",
          text: "\u2220AHG: twee lijnen door H in de vlakken vormen altijd de standhoek."
        }
      ],
      answer: [
        "b"
      ],
      explanation: "Kies loodlijnen op GH door H: HE in het bovenvlak en HA in ABGH. Een been langs GH meet de standhoek niet.",
      hint: "Zoek door H in elk vlak een richting loodrecht op GH.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
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
            "G",
            "H"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "GH",
          "HA",
          "HE"
        ],
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
            "G",
            "H"
          ]
        ]
      }
    },
    {
      id: "l4-dihedral-r1",
      block: "l4-dihedral",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een balk heeft AB = 7 cm, AD = 3 cm en AE = 4 cm. Bereken de kleinste hoek tussen ABCD en ABGH in graden, op twee decimalen.",
      answer: [
        "53.13010235415598"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "Het standvlak ADHE geeft tan \u2220DAH = DH/AD = 4/3. Dus de vlak\u2013vlakhoek is 53,13\xB0. De lengte AB speelt in deze standhoek geen rol.",
      hint: "Teken een doorsnede loodrecht op de snijlijn AB.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            7,
            0,
            0
          ],
          C: [
            7,
            3,
            0
          ],
          D: [
            0,
            3,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            7,
            0,
            4
          ],
          G: [
            7,
            3,
            4
          ],
          H: [
            0,
            3,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "AB = 7 cm, AD = 3 cm, AE = 4 cm.",
        view: "spatial",
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
            "G",
            "H"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            7,
            0,
            0
          ],
          C: [
            7,
            3,
            0
          ],
          D: [
            0,
            3,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            7,
            0,
            4
          ],
          G: [
            7,
            3,
            4
          ],
          H: [
            0,
            3,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 7 cm.",
        view: "spatial",
        highlights: [
          "AD",
          "AH",
          "DH"
        ],
        planes: [
          [
            "A",
            "D",
            "H",
            "E"
          ]
        ]
      }
    },
    {
      id: "l4-dihedral-r2",
      block: "l4-dihedral",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Waarom is vlak ADHE een standvlak bij de vlakken ABCD en ABGH van een kubus?",
      options: [
        {
          id: "a",
          text: "ADHE bevat de snijlijn AB."
        },
        {
          id: "b",
          text: "Elk zijvlak van de kubus is automatisch geschikt als standvlak bij elk vlakkenpaar."
        },
        {
          id: "c",
          text: "AB is hun snijlijn; AB staat loodrecht op de twee snijdende lijnen AD en AE in ADHE."
        },
        {
          id: "d",
          text: "ADHE maakt in de schermtekening een rechte hoek met het grondvlak."
        }
      ],
      answer: [
        "c"
      ],
      explanation: "Een standvlak staat loodrecht op de snijlijn. AB \u27C2 AD en AB \u27C2 AE, met AD en AE snijdend in A. Daarom AB \u27C2 ADHE. De snijlijnen van dit standvlak met de twee oorspronkelijke vlakken zijn AD en AH.",
      hint: "Gebruik het criterium voor een lijn loodrecht op een vlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Vlakken ABCD en ABGH snijden langs AB. De standhoek moet nog gekozen worden.",
        view: "spatial",
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
            "G",
            "H"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AB",
          "AD",
          "AE",
          "AH"
        ],
        planes: [
          [
            "A",
            "D",
            "H",
            "E"
          ]
        ]
      }
    },
    {
      id: "l4-check-1",
      block: "l4-cos",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een driehoek heeft zijden 4, 7 en 9 cm. Welke aanpak is geschikt voor de grootste hoek?",
      options: [
        {
          id: "a",
          text: "Meet de hoek op de afbeelding; de zijden zijn niet genoeg."
        },
        {
          id: "b",
          text: "Gebruik Pythagoras; de grootste zijde is altijd een hypotenusa."
        },
        {
          id: "c",
          text: "Bereken arccos(4/7), omdat de kleinste twee zijden bekend zijn."
        },
        {
          id: "d",
          text: "Gebruik de cosinusregel voor de hoek tegenover de zijde van 9 cm."
        }
      ],
      answer: [
        "d"
      ],
      explanation: "De grootste hoek ligt tegenover de grootste zijde. Omdat 4\xB2 + 7\xB2 \u2260 9\xB2 is de driehoek niet rechthoekig. De cosinusregel is wel geldig.",
      hint: "Verbind de grootste hoek met zijn overstaande zijde.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            7,
            0,
            0
          ],
          C: [
            -1.1428571428571428,
            3.8332593899996397,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        showCube: false,
        view: "top",
        caption: "Driehoek ABC: AB = 7 cm, AC = 4 cm, BC = 9 cm."
      }
    },
    {
      id: "l4-check-2",
      block: "l4-cos",
      skill: "rekenen",
      type: "numeric",
      prompt: "AB = 7 cm, AC = 5 cm en \u2220CAB = 110\xB0. Bereken BC in cm, op twee decimalen.",
      answer: [
        "9.896535253956145"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "cm",
      working: true,
      explanation: "BC\xB2 = 7\xB2 + 5\xB2 \u2212 2 \xD7 7 \xD7 5 \xD7 cos 110\xB0. Dat geeft BC \u2248 9,90 cm. Het negatieve teken van cos 110\xB0 vergroot hier BC\xB2.",
      hint: "De gegeven hoek ligt tussen de twee bekende zijden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            7,
            0,
            0
          ],
          C: [
            -1.7101007166283446,
            4.698463103929542,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA"
        ],
        showCube: false,
        view: "top",
        caption: "AB = 7 cm, AC = 5 cm en \u2220CAB = 110\xB0. BC is onbekend."
      }
    },
    {
      id: "l4-check-3",
      block: "l4-lines",
      skill: "construeren",
      type: "points",
      prompt: "Een kubus bevat de kruisende lijnen AB en DG. Selecteer twee hoekpunten die de lijn door A evenwijdig aan DG bepalen.",
      answer: [
        "A",
        "F"
      ],
      selectCount: 2,
      explanation: "De verplaatsing van D naar G is \xE9\xE9n ribbe in de richting van AB en \xE9\xE9n ribbe omhoog. Vanaf A voert dezelfde verplaatsing naar F: AF \u2225 DG.",
      hint: "Vergelijk de volledige verplaatsing tussen de eindpunten.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 6 cm.",
        view: "spatial",
        highlights: [
          "AB",
          "DG"
        ]
      },
      extraPoints: {
        A: [
          0,
          0,
          0
        ],
        B: [
          6,
          0,
          0
        ],
        C: [
          6,
          6,
          0
        ],
        D: [
          0,
          6,
          0
        ],
        E: [
          0,
          0,
          6
        ],
        F: [
          6,
          0,
          6
        ],
        G: [
          6,
          6,
          6
        ],
        H: [
          0,
          6,
          6
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 6 cm.",
        view: "spatial",
        highlights: [
          "AB",
          "DG",
          "AF"
        ]
      }
    },
    {
      id: "l4-check-4",
      block: "l4-lines",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een balk heeft AB = 8 cm, AD = 5 cm en AE = 6 cm. Bereken de kleinste hoek tussen AB en DG in graden, op twee decimalen.",
      answer: [
        "36.86989764584402"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "DG \u2225 AF. Daarom is de gevraagde hoek \u2220BAF en tan \u2220BAF = BF/AB = 6/8. De hoek is 36,87\xB0.",
      hint: "Breng de twee richtingen door \xE9\xE9n punt.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            8,
            5,
            0
          ],
          D: [
            0,
            5,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            8,
            0,
            6
          ],
          G: [
            8,
            5,
            6
          ],
          H: [
            0,
            5,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "AB = 8 cm, AD = 5 cm en AE = 6 cm.",
        view: "spatial",
        highlights: [
          "AB",
          "DG"
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            8,
            5,
            0
          ],
          D: [
            0,
            5,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            8,
            0,
            6
          ],
          G: [
            8,
            5,
            6
          ],
          H: [
            0,
            5,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 8 cm.",
        view: "spatial",
        highlights: [
          "AB",
          "DG",
          "AF"
        ]
      }
    },
    {
      id: "l4-check-5",
      block: "l4-plane",
      skill: "construeren",
      type: "points",
      prompt: "Selecteer de twee eindpunten van de loodrechte projectie van AG op vlak DCGH.",
      answer: [
        "D",
        "G"
      ],
      selectCount: 2,
      explanation: "A projecteert langs AD op D; G ligt al in DCGH en blijft G. De projectie is daarom DG. AD staat loodrecht op DC en DH, dus loodrecht op het achtervlak.",
      hint: "Projecteer ieder eindpunt afzonderlijk.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AG"
        ],
        planes: [
          [
            "D",
            "C",
            "G",
            "H"
          ]
        ]
      },
      extraPoints: {
        A: [
          0,
          0,
          0
        ],
        B: [
          4,
          0,
          0
        ],
        C: [
          4,
          4,
          0
        ],
        D: [
          0,
          4,
          0
        ],
        E: [
          0,
          0,
          4
        ],
        F: [
          4,
          0,
          4
        ],
        G: [
          4,
          4,
          4
        ],
        H: [
          0,
          4,
          4
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 4 cm.",
        view: "spatial",
        highlights: [
          "AG",
          "AD",
          "DG"
        ],
        planes: [
          [
            "D",
            "C",
            "G",
            "H"
          ]
        ]
      }
    },
    {
      id: "l4-check-6",
      block: "l4-plane",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een balk heeft AB = 3 cm, AD = 4 cm en AE = 12 cm. Bereken de hoek tussen AG en ABCD in graden, op twee decimalen.",
      answer: [
        "67.38013505195957"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "De projectie AC heeft lengte \u221A(3\xB2 + 4\xB2) = 5 cm. In de rechthoekige driehoek ACG is tan \u03B1 = CG/AC = 12/5. Dus \u03B1 \u2248 67,38\xB0.",
      hint: "De gevraagde hoek ligt tussen de lijn en zijn loodrechte projectie.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            3,
            0,
            0
          ],
          C: [
            3,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            12
          ],
          F: [
            3,
            0,
            12
          ],
          G: [
            3,
            4,
            12
          ],
          H: [
            0,
            4,
            12
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "AB = 3 cm, AD = 4 cm, AE = 12 cm.",
        view: "spatial",
        highlights: [
          "AG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            3,
            0,
            0
          ],
          C: [
            3,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            12
          ],
          F: [
            3,
            0,
            12
          ],
          G: [
            3,
            4,
            12
          ],
          H: [
            0,
            4,
            12
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus ABCD.EFGH; ribbe 3 cm.",
        view: "spatial",
        highlights: [
          "AG",
          "AC",
          "CG"
        ]
      }
    },
    {
      id: "l4-check-7",
      block: "l4-dihedral",
      skill: "inzicht",
      type: "choice",
      prompt: "Je wilt de hoek tussen twee snijdende vlakken V en W construeren. Welke werkwijze is altijd geldig?",
      options: [
        {
          id: "a",
          text: "Kies een punt op de snijlijn en trek door dat punt in elk vlak een loodlijn op de snijlijn."
        },
        {
          id: "b",
          text: "Kies in elk vlak een lijn evenwijdig aan de snijlijn."
        },
        {
          id: "c",
          text: "Meet op het scherm de hoek tussen de zichtbare randen van de twee vlakken."
        },
        {
          id: "d",
          text: "Kies willekeurige lijnen in V en W door een gemeenschappelijk punt."
        }
      ],
      answer: [
        "a"
      ],
      explanation: "De twee loodlijnen bepalen een standvlak en een standhoek. Door loodrecht op de snijlijn te kijken, meet je de opening tussen de vlakken. Bij een stomp resultaat kies je de supplementaire, kleinste hoek.",
      hint: "Welke richting moet het standvlak hebben ten opzichte van de snijlijn?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            4
          ],
          F: [
            4,
            0,
            4
          ],
          G: [
            4,
            4,
            4
          ],
          H: [
            0,
            4,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "V = ABCD en W = ABGH illustreren twee snijdende vlakken.",
        view: "spatial",
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
            "G",
            "H"
          ]
        ]
      }
    },
    {
      id: "l4-check-8",
      block: "l4-dihedral",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een kubus heeft ribbe 6 cm. J ligt op BF met BJ = 2 cm. Bereken de kleinste hoek tussen EJG en ABFE in graden, op twee decimalen.",
      answer: [
        "60.98285937539848"
      ],
      tolerance: 0.02,
      decimals: 2,
      unit: "\xB0",
      working: true,
      explanation: "De snijlijn is EJ. Laat FI loodrecht op EJ vallen. EF = 6, FJ = 4 en EJ = \u221A52, dus FI = EF \xD7 FJ/EJ = 24/\u221A52. FG = 6. De standhoek FIG voldoet aan tan \u03B8 = FG/FI = \u221A52/4, zodat \u03B8 \u2248 60,98\xB0.",
      hint: "Construeer een standvlak door G en een loodlijn op EJ in het voorvlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ],
          J: [
            6,
            0,
            2
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus: ribbe 6 cm; BJ = 2 cm. Gegeven vlakken EJG en ABFE.",
        view: "spatial",
        planes: [
          [
            "E",
            "J",
            "G"
          ],
          [
            "A",
            "B",
            "F",
            "E"
          ]
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ],
          J: [
            6,
            0,
            2
          ],
          I: [
            4.153846153846154,
            0,
            3.230769230769231
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "FI \u27C2 EJ en GI \u27C2 EJ. EF = 6, FJ = 4, EJ = \u221A52 cm.",
        view: "spatial",
        highlights: [
          "EJ",
          "FI",
          "GI",
          "FG"
        ],
        planes: [
          [
            "E",
            "J",
            "G"
          ],
          [
            "A",
            "B",
            "F",
            "E"
          ]
        ]
      }
    },
    {
      id: "l5-point-line-q1",
      block: "l5-point-line",
      skill: "inzicht",
      type: "choice",
      prompt: "Kubus met ribbe 6 cm. Wat is de afstand van F tot de volledige lijn EB?",
      options: [
        {
          id: "endpoint",
          text: "6 cm, want E en B zijn de dichtstbijzijnde benoemde punten."
        },
        {
          id: "foot",
          text: "3\u221A2 cm, via de loodrechte voet op EB."
        },
        {
          id: "diagonal",
          text: "6\u221A2 cm, de lengte van EB."
        }
      ],
      answer: [
        "foot"
      ],
      explanation: "Het dichtstbijzijnde punt hoeft geen hoekpunt te zijn. In vierkant ABFE is de loodlijn uit F naar EB de halve andere diagonaal: 3\u221A2 cm.",
      hint: "Zoek de kortste verbinding binnen vlak ABFE.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "EB"
        ],
        planes: [],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          M: [
            0.5,
            0,
            0.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "EB"
        ],
        planes: [],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              1,
              0,
              1
            ],
            to: [
              0.5,
              0,
              0.5
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-point-line-q2",
      block: "l5-point-line",
      skill: "construeren",
      type: "points",
      prompt: "Kubus met ribbe 4 cm. M is het midden van EB, N het midden van AB en O het middelpunt van de kubus. Kies de loodrechte voet van F op EB.",
      answer: [
        "M"
      ],
      selectCount: 1,
      explanation: "M ligt op EB en FM staat loodrecht op EB. N en O liggen niet op de lijn EB.",
      hint: "De voet moet aan twee voorwaarden voldoen: op de lijn liggen \xE9n een loodrechte verbinding geven.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          M: [
            0.5,
            0,
            0.5
          ],
          N: [
            0.5,
            0,
            0
          ],
          O: [
            0.5,
            0.5,
            0.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          4,
          4,
          4
        ],
        highlights: [
          "EB"
        ],
        planes: [],
        caption: "AB = 4 cm, AD = 4 cm en AE = 4 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      extraPoints: {
        M: [
          0.5,
          0,
          0.5
        ],
        N: [
          0.5,
          0,
          0
        ],
        O: [
          0.5,
          0.5,
          0.5
        ]
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          M: [
            0.5,
            0,
            0.5
          ],
          N: [
            0.5,
            0,
            0
          ],
          O: [
            0.5,
            0.5,
            0.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          4,
          4,
          4
        ],
        highlights: [
          "EB"
        ],
        planes: [],
        caption: "AB = 4 cm, AD = 4 cm en AE = 4 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              1,
              0,
              1
            ],
            to: [
              0.5,
              0,
              0.5
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-point-line-q3",
      block: "l5-point-line",
      skill: "rekenen",
      type: "numeric",
      prompt: "Rechthoekige driehoek ABP met AB = 9 cm en AP = 12 cm. Bereken de afstand van A tot de volledige lijn BP, in cm op twee decimalen.",
      answer: [
        "7.2"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "BP = 15. De oppervlakte is 54 = \xBD \xD7 15 \xD7 h, dus h = 7,20 cm.",
      hint: "Gebruik de oppervlakte van dezelfde driehoek op twee manieren.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            9,
            0,
            0
          ],
          P: [
            0,
            12,
            0
          ]
        },
        edges: [
          "AB",
          "BP",
          "PA"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Rechthoekige driehoek ABP: AB = 9 cm, AP = 12 cm en AP \u27C2 AB."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            9,
            0,
            0
          ],
          P: [
            0,
            12,
            0
          ]
        },
        edges: [
          "AB",
          "BP",
          "PA"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Rechthoekige driehoek ABP: AB = 9 cm, AP = 12 cm en AP \u27C2 AB.",
        segments: [
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              5.76,
              4.32,
              0
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-point-line-q4",
      block: "l5-point-line",
      skill: "rekenen",
      type: "numeric",
      prompt: "A = (0,0), B = (4,0), P = (7,2), in cm. Bereken d(P,AB), in cm op twee decimalen.",
      answer: [
        "2"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "De loodrechte voet is N = (7,0), buiten het lijnstuk AB. PN = 2,00 cm. PB = \u221A13 hoort bij de afstand tot het lijnstuk, niet tot de volledige lijn.",
      hint: "Teken de horizontale lijn AB verder door.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          P: [
            7,
            2,
            0
          ]
        },
        edges: [
          "AB",
          "AP",
          "BP"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Co\xF6rdinaten in cm: A(0,0), B(4,0), P(7,2). AB betekent de volledige lijn."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          P: [
            7,
            2,
            0
          ],
          N: [
            7,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "AP",
          "BP"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Co\xF6rdinaten in cm: A(0,0), B(4,0), P(7,2). AB betekent de volledige lijn.",
        segments: [
          {
            from: [
              4,
              0,
              0
            ],
            to: [
              8,
              0,
              0
            ],
            color: "#67c9eb",
            dashed: true
          },
          {
            from: [
              7,
              2,
              0
            ],
            to: [
              7,
              0,
              0
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-point-line-p1",
      block: "l5-point-line",
      skill: "inzicht",
      type: "choice",
      prompt: "Wat is de afstand van P(3,4) tot de lijn door A(0,0) en B(10,0), in cm?",
      options: [
        {
          id: "foot",
          text: "4"
        },
        {
          id: "other",
          text: "\u221A65"
        },
        {
          id: "endpoint",
          text: "5"
        }
      ],
      answer: [
        "foot"
      ],
      explanation: "De loodrechte voet (3,0) ligt tussen A en B. De afstand is 4 cm; PA = 5 is een schuine verbinding.",
      hint: "Beoordeel welke verbinding werkelijk de kortste is.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            10,
            0,
            0
          ],
          P: [
            3,
            4,
            0
          ]
        },
        edges: [
          "AB",
          "AP",
          "BP"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "A(0,0), B(10,0), P(3,4), alle co\xF6rdinaten in cm."
      }
    },
    {
      id: "l5-point-line-p2",
      block: "l5-point-line",
      skill: "inzicht",
      type: "choice",
      prompt: "Vierkante piramide met grondzijde 6 cm en hoogte TO = 4 cm. Wat is d(T,AB)?",
      options: [
        {
          id: "height",
          text: "4 cm"
        },
        {
          id: "endpoint",
          text: "TA = \u221A34 cm"
        },
        {
          id: "foot",
          text: "5 cm, via het midden van AB"
        }
      ],
      answer: [
        "foot"
      ],
      explanation: "Het midden M van AB ligt 3 cm van O. TM\xB2 = TO\xB2 + OM\xB2 = 16 + 9 = 25. TM is loodrecht op AB.",
      hint: "Kies een punt op AB; de top staat recht boven het grondvlakmiddelpunt.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          T: [
            3,
            3,
            4
          ],
          O: [
            3,
            3,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Vierkante piramide: zijde grondvlak 6 cm, top T recht boven middelpunt O, TO = 4 cm."
      }
    },
    {
      id: "l5-point-line-r1",
      block: "l5-point-line",
      skill: "rekenen",
      type: "numeric",
      prompt: "Kubus met ribbe 10 cm. Bereken d(H,EG), in cm op twee decimalen.",
      answer: [
        "7.07106781187"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "In bovenvlak EFGH is de afstand van H tot diagonaal EG de halve diagonaal HF: 5\u221A2 \u2248 7,07 cm.",
      hint: "Werk in het bovenvlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          10,
          10,
          10
        ],
        highlights: [
          "EG"
        ],
        planes: [],
        caption: "AB = 10 cm, AD = 10 cm en AE = 10 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          M: [
            0.5,
            0.5,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          10,
          10,
          10
        ],
        highlights: [
          "EG"
        ],
        planes: [],
        caption: "AB = 10 cm, AD = 10 cm en AE = 10 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              0,
              1,
              1
            ],
            to: [
              0.5,
              0.5,
              1
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-point-line-r2",
      block: "l5-point-line",
      skill: "rekenen",
      type: "numeric",
      prompt: "Rechthoekige driehoek ABP met AB = 5 cm en AP = 12 cm. Bereken d(A,BP), in cm op twee decimalen.",
      answer: [
        "4.61538461538"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "BP = 13 cm. Met \xBD \xD7 5 \xD7 12 = \xBD \xD7 13 \xD7 h volgt h = 60/13 \u2248 4,62 cm.",
      hint: "De hoogte op de schuine zijde is meestal geen getekende zijde.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            5,
            0,
            0
          ],
          P: [
            0,
            12,
            0
          ]
        },
        edges: [
          "AB",
          "BP",
          "PA"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Rechthoekige driehoek ABP: AB = 5 cm, AP = 12 cm en AP \u27C2 AB."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l5-point-plane-q1",
      block: "l5-point-plane",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een student ziet AC \u27C2 AE in een kubus en concludeert AC \u27C2 vlak ADHE. Is die redenering geldig?",
      options: [
        {
          id: "drawing",
          text: "Alleen als AC in de tekening horizontaal staat."
        },
        {
          id: "one",
          text: "Ja, \xE9\xE9n loodrechte lijn in het vlak is voldoende."
        },
        {
          id: "two",
          text: "Nee, AC is niet loodrecht op AD; \xE9\xE9n richting is onvoldoende."
        }
      ],
      answer: [
        "two"
      ],
      explanation: "AC staat loodrecht op de verticale AE, maar niet op AD. Voor loodrechte stand op ADHE moeten twee snijdende richtingen in dat vlak worden gecontroleerd.",
      hint: "Controleer ook een tweede lijn door A in hetzelfde vlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "AC",
          "AE"
        ],
        planes: [
          [
            "A",
            "D",
            "H",
            "E"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l5-point-plane-q2",
      block: "l5-point-plane",
      skill: "construeren",
      type: "choice",
      prompt: "Je wilt d(B,ACGE) construeren. Welke aanpak bepaalt een geschikte voet M?",
      options: [
        {
          id: "ground",
          text: "Construeer in ABCD de loodlijn uit B op AC; neem M op AC."
        },
        {
          id: "vertical",
          text: "Laat uit B een verticale lijn omhoog lopen tot het bovenvlak."
        },
        {
          id: "corner",
          text: "Verbind B met G: G ligt in het doelvlak."
        }
      ],
      answer: [
        "ground"
      ],
      explanation: "ACGE bevat AC en de verticale richting. Een horizontale lijn loodrecht op AC staat op beide richtingen loodrecht. De loodrechte voet op AC is daardoor ook de voet op ACGE.",
      hint: "Zoek een hulpvlak waarin de afstand als lijnstuk te construeren is.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [],
        planes: [
          [
            "A",
            "C",
            "G",
            "E"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          M: [
            0.5,
            0.5,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [],
        planes: [
          [
            "A",
            "C",
            "G",
            "E"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              1,
              0,
              0
            ],
            to: [
              0.5,
              0.5,
              0
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-point-plane-q3",
      block: "l5-point-plane",
      skill: "rekenen",
      type: "numeric",
      prompt: "Balk ABCD.EFGH: AB = 8 cm, AD = 6 cm, AE = 5 cm. Bereken d(B,ACGE), in cm op twee decimalen.",
      answer: [
        "4.8"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "Werk in rechthoek ABCD. AC = \u221A(8\xB2 + 6\xB2) = 10. Opp(ABC) = 24 = \xBD \xD7 10 \xD7 BM. Dus BM = 4,80 cm. De verticale richting maakt dit ook de afstand tot ACGE.",
      hint: "Bereken eerst de hoogte van driehoek ABC op zijde AC.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          6,
          5
        ],
        highlights: [],
        planes: [
          [
            "A",
            "C",
            "G",
            "E"
          ]
        ],
        caption: "AB = 8 cm, AD = 6 cm en AE = 5 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          M: [
            0.64,
            0.64,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          6,
          5
        ],
        highlights: [],
        planes: [
          [
            "A",
            "C",
            "G",
            "E"
          ]
        ],
        caption: "AB = 8 cm, AD = 6 cm en AE = 5 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              1,
              0,
              0
            ],
            to: [
              0.64,
              0.64,
              0
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-point-plane-q4",
      block: "l5-point-plane",
      skill: "rekenen",
      type: "numeric",
      prompt: "Kubus met ribbe 6 cm. I is het midden van FH. Bereken d(E,AFH), in cm op twee decimalen.",
      answer: [
        "3.46410161514"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "In driehoek AEI zijn AE = 6, EI = 3\u221A2 en AI = 3\u221A6. De gezochte hoogte is AE \xD7 EI / AI = 2\u221A3 \u2248 3,46 cm. Vlak AEI staat loodrecht op FH en snijdt AFH in AI.",
      hint: "Gebruik de rechthoekige driehoek AEI en schrijf haar oppervlakte twee keer.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          I: [
            0.5,
            0.5,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [],
        planes: [
          [
            "A",
            "F",
            "H"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          I: [
            0.5,
            0.5,
            1
          ],
          N: [
            0.3333333333333333,
            0.3333333333333333,
            0.6666666666666666
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [],
        planes: [
          [
            "A",
            "F",
            "H"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              0,
              0,
              1
            ],
            to: [
              0.3333333333333333,
              0.3333333333333333,
              0.6666666666666666
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-point-plane-p1",
      block: "l5-point-plane",
      skill: "onderbouwen",
      type: "choice",
      prompt: "In een kubus geldt BD \u27C2 BF. Daaruit volgt volgens een student BD \u27C2 BCGF. Klopt dat?",
      options: [
        {
          id: "one",
          text: "Ja, want BF ligt in BCGF."
        },
        {
          id: "two",
          text: "Nee, BD is niet loodrecht op BC."
        },
        {
          id: "parallel",
          text: "Nee, BD is evenwijdig aan BCGF."
        }
      ],
      answer: [
        "two"
      ],
      explanation: "BF geeft alleen de verticale richting. BD staat niet loodrecht op de andere richting BC van het vlak.",
      hint: "Onderzoek welke twee richtingen het zijvlak bepalen.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          5,
          5,
          5
        ],
        highlights: [
          "BD",
          "BF"
        ],
        planes: [
          [
            "B",
            "C",
            "G",
            "F"
          ]
        ],
        caption: "AB = 5 cm, AD = 5 cm en AE = 5 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l5-point-plane-p2",
      block: "l5-point-plane",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Van P buiten rechthoek ABCD is alleen AP \u27C2 AB gegeven. Mag je AP de afstand van P tot vlak ABCD noemen?",
      options: [
        {
          id: "two",
          text: "Nee, AP moet ook loodrecht staan op een tweede snijdende richting in ABCD."
        },
        {
          id: "never",
          text: "Nee, een voet kan nooit bij een hoekpunt liggen."
        },
        {
          id: "one",
          text: "Ja, loodrecht op AB is voldoende."
        }
      ],
      answer: [
        "two"
      ],
      explanation: "Een lijn kan loodrecht op AB staan en toch schuin lopen ten opzichte van ABCD. Een tweede onafhankelijke richting is nodig.",
      hint: "Welke informatie maakt een vlak verschillend van \xE9\xE9n lijn?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            5,
            0,
            0
          ],
          C: [
            5,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          P: [
            0,
            3,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AP"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "ABCD is horizontaal. P ligt buiten het vlak; AP \u27C2 AB is gegeven. Er is niets gegeven over AP en AD."
      }
    },
    {
      id: "l5-point-plane-r1",
      block: "l5-point-plane",
      skill: "rekenen",
      type: "numeric",
      prompt: "Balk: AB = 5 cm, AD = 12 cm, AE = 7 cm. Bereken d(D,ACGE), in cm op twee decimalen.",
      answer: [
        "4.61538461538"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "AC = 13 en opp(ADC) = 30. De hoogte uit D op AC is 60/13 \u2248 4,62 cm. Zij staat ook loodrecht op de verticale richting van ACGE.",
      hint: "Het hulpvlak kan opnieuw het grondvlak zijn.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          5,
          12,
          7
        ],
        highlights: [],
        planes: [
          [
            "A",
            "C",
            "G",
            "E"
          ]
        ],
        caption: "AB = 5 cm, AD = 12 cm en AE = 7 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          M: [
            0.8520710059171598,
            0.8520710059171598,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          5,
          12,
          7
        ],
        highlights: [],
        planes: [
          [
            "A",
            "C",
            "G",
            "E"
          ]
        ],
        caption: "AB = 5 cm, AD = 12 cm en AE = 7 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              0,
              1,
              0
            ],
            to: [
              0.8520710059171598,
              0.8520710059171598,
              0
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-point-plane-r2",
      block: "l5-point-plane",
      skill: "onderbouwen",
      type: "choice",
      prompt: "In een kubus moet je bewijzen dat BF de afstand van F tot ABCD voorstelt. Welke onderbouwing is volledig?",
      options: [
        {
          id: "two",
          text: "B ligt in ABCD; BF \u27C2 BA en BF \u27C2 BC, en BA en BC snijden elkaar."
        },
        {
          id: "one",
          text: "BF \u27C2 BA; meer is niet nodig."
        },
        {
          id: "page",
          text: "BF lijkt verticaal op het scherm."
        }
      ],
      answer: [
        "two"
      ],
      explanation: "De voet B ligt in het doelvlak. De twee snijdende lijnen BA en BC liggen in dat vlak, dus de loodrechte stand op beide bewijst BF \u27C2 ABCD.",
      hint: "Combineer de ligging van de voet met de twee-richtingenregel.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          7,
          7,
          7
        ],
        highlights: [
          "BF"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ],
        caption: "AB = 7 cm, AD = 7 cm en AE = 7 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l5-volume-q1",
      block: "l5-volume",
      skill: "inzicht",
      type: "choice",
      prompt: "Een tetra\xEBder heeft inhoud 18 cm\xB3 en een gekozen grondvlak van 9 cm\xB2. Welke hoogte hoort daarbij?",
      options: [
        {
          id: "triple",
          text: "6 cm, want h = 3V/B."
        },
        {
          id: "third",
          text: "\u2154 cm, want h = V/(3B)."
        },
        {
          id: "divide",
          text: "2 cm, want h = V/B."
        }
      ],
      answer: [
        "triple"
      ],
      explanation: "Voor iedere piramide geldt V = \u2153Bh. Vermenigvuldig eerst met 3: 3V = Bh. Dan h = 54/9 = 6 cm.",
      hint: "Schrijf eerst de inhoudsformule voordat je getallen invult.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            3,
            0
          ],
          T: [
            0,
            0,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Tetra\xEBder met inhoud 18 cm\xB3. Het gekozen grondvlak ABC heeft oppervlakte 9 cm\xB2. De hoogte is gevraagd."
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            3,
            0
          ],
          T: [
            0,
            0,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Tetra\xEBder ABCT: AB = 6 cm, AC = 3 cm, AT = 6 cm; AB, AC en AT zijn onderling loodrecht.",
        segments: [
          {
            from: [
              0,
              0,
              6
            ],
            to: [
              0,
              0,
              0
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-volume-q2",
      block: "l5-volume",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Voor d(F,BGE) in een kubus kies je tetra\xEBder F.BGE. Welke tweede keuze maakt zijn inhoud direct berekenbaar?",
      options: [
        {
          id: "cube",
          text: "Neem de volledige kubusinhoud."
        },
        {
          id: "right",
          text: "Grondvlak FGE met hoogte FB."
        },
        {
          id: "wrong",
          text: "Grondvlak BGE met hoogte FE."
        }
      ],
      answer: [
        "right"
      ],
      explanation: "FGE ligt in het bovenvlak en FB staat daar loodrecht op. De driehoek FGE is een half bovenvlak. FE staat niet loodrecht op BGE.",
      hint: "Zoek een grondvlak waarvan oppervlakte \xE9n loodrechte hoogte bekend zijn.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [],
        planes: [
          [
            "B",
            "G",
            "E"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "FB"
        ],
        planes: [
          [
            "F",
            "G",
            "E"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l5-volume-q3",
      block: "l5-volume",
      skill: "rekenen",
      type: "numeric",
      prompt: "Kubus met ribbe 8 cm. Bereken d(F,BGE), in cm op twee decimalen.",
      answer: [
        "4.61880215352"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "V(F.BGE) = 8\xB3/6 = 256/3. Opp(BGE) = 32\u221A3. De afstand is 3V/B = 8/\u221A3 \u2248 4,62 cm.",
      hint: "Bereken de tetra\xEBderinhoud met een driehoek in het bovenvlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          8,
          8
        ],
        highlights: [],
        planes: [
          [
            "B",
            "G",
            "E"
          ]
        ],
        caption: "AB = 8 cm, AD = 8 cm en AE = 8 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          N: [
            0.6666666666666666,
            0.3333333333333333,
            0.6666666666666666
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          8,
          8
        ],
        highlights: [],
        planes: [
          [
            "B",
            "G",
            "E"
          ]
        ],
        caption: "AB = 8 cm, AD = 8 cm en AE = 8 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              1,
              0,
              1
            ],
            to: [
              0.6666666666666666,
              0.3333333333333333,
              0.6666666666666666
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-volume-q4",
      block: "l5-volume",
      skill: "rekenen",
      type: "numeric",
      prompt: "Tetra\xEBder ABCT: AB = 3 cm, AC = 4 cm en AT = 6 cm zijn onderling loodrecht. De oppervlakte van BCT is 3\u221A29 cm\xB2. Bereken d(A,BCT), in cm op twee decimalen.",
      answer: [
        "2.22834405812"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "V = \u2153 \xD7 \xBD \xD7 3 \xD7 4 \xD7 6 = 12 cm\xB3. Met BCT als grondvlak is h = 3 \xD7 12/(3\u221A29) = 12/\u221A29 \u2248 2,23 cm.",
      hint: "Hetzelfde lichaam heeft bij beide grondvlakkeuzes dezelfde inhoud.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            3,
            0,
            0
          ],
          C: [
            0,
            4,
            0
          ],
          T: [
            0,
            0,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Tetra\xEBder ABCT: AB = 3 cm, AC = 4 cm, AT = 6 cm; AB, AC en AT zijn onderling loodrecht."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            3,
            0,
            0
          ],
          C: [
            0,
            4,
            0
          ],
          T: [
            0,
            0,
            6
          ],
          N: [
            1.6551724137931034,
            1.2413793103448276,
            0.8275862068965517
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Tetra\xEBder ABCT: AB = 3 cm, AC = 4 cm, AT = 6 cm; AB, AC en AT zijn onderling loodrecht.",
        segments: [
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              1.6551724137931034,
              1.2413793103448276,
              0.8275862068965517
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-volume-p1",
      block: "l5-volume",
      skill: "inzicht",
      type: "choice",
      prompt: "Vierkante piramide: inhoud 80 cm\xB3 en grondvlak 40 cm\xB2. Wat is de loodrechte hoogte?",
      options: [
        {
          id: "third",
          text: "\u2154 cm"
        },
        {
          id: "divide",
          text: "2 cm"
        },
        {
          id: "triple",
          text: "6 cm"
        }
      ],
      answer: [
        "triple"
      ],
      explanation: "h = 3V/B = 240/40 = 6 cm.",
      hint: "Gebruik de inhoudsformule voor een piramide.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6.324555320336759,
            0,
            0
          ],
          C: [
            6.324555320336759,
            6.324555320336759,
            0
          ],
          D: [
            0,
            6.324555320336759,
            0
          ],
          T: [
            3.1622776601683795,
            3.1622776601683795,
            6
          ],
          O: [
            3.1622776601683795,
            3.1622776601683795,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Vierkante piramide met inhoud 80 cm\xB3 en grondvlakoppervlakte 40 cm\xB2. De loodrechte hoogte is onbekend."
      }
    },
    {
      id: "l5-volume-p2",
      block: "l5-volume",
      skill: "inzicht",
      type: "choice",
      prompt: "Een tetra\xEBder heeft inhoud 35 cm\xB3. Je kiest een ander zijvlak als grondvlak, met oppervlakte 15 cm\xB2. Wat is de bijbehorende hoogte?",
      options: [
        {
          id: "divide",
          text: "7/3 cm"
        },
        {
          id: "triple",
          text: "7 cm"
        },
        {
          id: "third",
          text: "7/9 cm"
        }
      ],
      answer: [
        "triple"
      ],
      explanation: "Ook bij een andere grondvlakkeuze geldt h = 3V/B = 105/15 = 7 cm.",
      hint: "De piramidefactor hangt niet af van welk vlak je kiest.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            5,
            0
          ],
          T: [
            0,
            0,
            7
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Tetra\xEBder met inhoud 35 cm\xB3. Het nieuw gekozen grondvlak heeft oppervlakte 15 cm\xB2. De bijbehorende hoogte is gevraagd."
      }
    },
    {
      id: "l5-volume-r1",
      block: "l5-volume",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een piramide heeft inhoud 96 cm\xB3 en grondvlakoppervlakte 24 cm\xB2. Bereken de loodrechte hoogte, in cm op twee decimalen.",
      answer: [
        "12"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "h = 3V/B = 288/24 = 12,00 cm.",
      hint: "Isoleer h in V = \u2153Bh.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4.898979485566356,
            0,
            0
          ],
          C: [
            4.898979485566356,
            4.898979485566356,
            0
          ],
          D: [
            0,
            4.898979485566356,
            0
          ],
          T: [
            2.449489742783178,
            2.449489742783178,
            12
          ],
          O: [
            2.449489742783178,
            2.449489742783178,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Piramide met inhoud 96 cm\xB3 en grondvlakoppervlakte 24 cm\xB2. De loodrechte hoogte is onbekend."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l5-volume-r2",
      block: "l5-volume",
      skill: "rekenen",
      type: "numeric",
      prompt: "Kubus met ribbe 9 cm. Bereken d(E,AFH) met de inhoudsmethode, in cm op twee decimalen.",
      answer: [
        "5.19615242271"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "Tetra\xEBder E.AFH heeft inhoud 9\xB3/6 = 121,5 cm\xB3. Opp(AFH) = 81\u221A3/2. h = 3V/B = 9/\u221A3 = 3\u221A3 \u2248 5,20 cm.",
      hint: "Kies eerst driehoek EFH als grondvlak en EA als hoogte.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          9,
          9,
          9
        ],
        highlights: [],
        planes: [
          [
            "A",
            "F",
            "H"
          ]
        ],
        caption: "AB = 9 cm, AD = 9 cm en AE = 9 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          N: [
            0.3333333333333333,
            0.3333333333333333,
            0.6666666666666666
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          9,
          9,
          9
        ],
        highlights: [],
        planes: [
          [
            "A",
            "F",
            "H"
          ]
        ],
        caption: "AB = 9 cm, AD = 9 cm en AE = 9 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              0,
              0,
              1
            ],
            to: [
              0.3333333333333333,
              0.3333333333333333,
              0.6666666666666666
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-model-q1",
      block: "l5-model",
      skill: "inzicht",
      type: "choice",
      prompt: "Bij de bak met bodem 2 dm, bovenkant 6 dm en hoogte 4 dm is h de waterhoogte. Welke breedteformule klopt?",
      options: [
        {
          id: "origin",
          text: "w(h) = 1,5h"
        },
        {
          id: "offset",
          text: "w(h) = 2+h"
        },
        {
          id: "constant",
          text: "w(h) = 6"
        }
      ],
      answer: [
        "offset"
      ],
      explanation: "De breedte begint bij 2 dm, niet bij 0. De toename is (6\u22122)/4 = 1 dm per dm hoogte. Dus w(h) = 2+h.",
      hint: "Controleer eerst wat elke formule geeft bij h = 0.",
      scene: {
        points: {
          A: [
            -1,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            3,
            0,
            4
          ],
          D: [
            -3,
            0,
            4
          ],
          E: [
            -1,
            10,
            0
          ],
          F: [
            1,
            10,
            0
          ],
          G: [
            3,
            10,
            4
          ],
          H: [
            -3,
            10,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Rechte open bak van 10 dm lang. Trapeziumdoorsnede: bodem 2 dm, bovenkant 6 dm, verticale hoogte 4 dm. Symmetrische schuine wanden."
      }
    },
    {
      id: "l5-model-q2",
      block: "l5-model",
      skill: "rekenen",
      type: "numeric",
      prompt: "De bak is 10 dm lang, onder 2 dm breed, boven 6 dm breed en 4 dm hoog. Bereken de inhoud bij waterhoogte h = 3 dm, in dm\xB3 op twee decimalen.",
      answer: [
        "105"
      ],
      tolerance: 0.02,
      unit: "dm\xB3",
      explanation: "Op hoogte 3 is w = 5. Het gevulde trapezium heeft oppervlakte \xBD(2+5)\xD73 = 10,5 dm\xB2. Volume = 10\xD710,5 = 105,00 dm\xB3.",
      hint: "Gebruik het gemiddelde van de twee evenwijdige breedtes.",
      scene: {
        points: {
          A: [
            -1,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            3,
            0,
            4
          ],
          D: [
            -3,
            0,
            4
          ],
          E: [
            -1,
            10,
            0
          ],
          F: [
            1,
            10,
            0
          ],
          G: [
            3,
            10,
            4
          ],
          H: [
            -3,
            10,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Rechte open bak van 10 dm lang. Trapeziumdoorsnede: bodem 2 dm, bovenkant 6 dm, verticale hoogte 4 dm. Symmetrische schuine wanden."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l5-model-q3",
      block: "l5-model",
      skill: "rekenen",
      type: "numeric",
      prompt: "Dezelfde bak heeft V(h) = 20h + 5h\xB2 dm\xB3 voor 0 \u2264 h \u2264 4. Bepaal de waterhoogte bij 80 dm\xB3, in dm op twee decimalen.",
      answer: [
        "2.472135955"
      ],
      tolerance: 0.02,
      unit: "dm",
      explanation: "20h + 5h\xB2 = 80 geeft h\xB2 + 4h \u2212 16 = 0. h = \u22122 \xB1 2\u221A5. Alleen h = \u22122 + 2\u221A5 \u2248 2,47 dm ligt in [0,4]. De andere wortel is fysisch ongeldig.",
      hint: "Los de vergelijking op en controleer het toegestane hoogte-interval.",
      scene: {
        points: {
          A: [
            -1,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            3,
            0,
            4
          ],
          D: [
            -3,
            0,
            4
          ],
          E: [
            -1,
            10,
            0
          ],
          F: [
            1,
            10,
            0
          ],
          G: [
            3,
            10,
            4
          ],
          H: [
            -3,
            10,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Rechte open bak van 10 dm lang. Trapeziumdoorsnede: bodem 2 dm, bovenkant 6 dm, verticale hoogte 4 dm. Symmetrische schuine wanden."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l5-model-q4",
      block: "l5-model",
      skill: "rekenen",
      type: "numeric",
      prompt: "De gevouwen bak heeft plaatbreedte 60 cm, lengte 40 cm, bodem x = 12 cm en opening 2x = 24 cm. Bereken de verticale hoogte h, in cm op twee decimalen.",
      answer: [
        "23.2379000772"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "Elke wand is (60\u221212)/2 = 24 cm lang. De horizontale uitwijking is (24\u221212)/2 = 6 cm. h = \u221A(24\xB2\u22126\xB2) = \u221A540 \u2248 23,24 cm.",
      hint: "Teken \xE9\xE9n rechthoekige driehoek in de voorste trapeziumdoorsnede.",
      scene: {
        points: {
          A: [
            -6,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            12,
            0,
            23.2379000772445
          ],
          D: [
            -12,
            0,
            23.2379000772445
          ],
          E: [
            -6,
            40,
            0
          ],
          F: [
            6,
            40,
            0
          ],
          G: [
            12,
            40,
            23.2379000772445
          ],
          H: [
            -12,
            40,
            23.2379000772445
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Oorspronkelijke vouwbak: plaatbreedte 60 cm, baklengte 40 cm, bodem x = 12 cm en bovenopening 2x = 24 cm. De twee schuine wanden zijn even breed. Hoogte h is onbekend."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            -6,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            12,
            0,
            23.2379000772445
          ],
          D: [
            -12,
            0,
            23.2379000772445
          ],
          E: [
            -6,
            40,
            0
          ],
          F: [
            6,
            40,
            0
          ],
          G: [
            12,
            40,
            23.2379000772445
          ],
          H: [
            -12,
            40,
            23.2379000772445
          ],
          N: [
            12,
            0,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Oorspronkelijke vouwbak: plaatbreedte 60 cm, baklengte 40 cm, bodem x = 12 cm en bovenopening 2x = 24 cm. De twee schuine wanden zijn even breed. Hoogte h is onbekend.",
        segments: [
          {
            from: [
              12,
              0,
              23.2379000772445
            ],
            to: [
              12,
              0,
              0
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l5-model-p1",
      block: "l5-model",
      skill: "inzicht",
      type: "choice",
      prompt: "Een trapeziumvormige geul is onder 4 m breed en boven 10 m, op 3 m hoogte. Welke formule geeft de breedte op hoogte h?",
      options: [
        {
          id: "offset",
          text: "w(h) = 4+2h"
        },
        {
          id: "constant",
          text: "w(h) = 4h"
        },
        {
          id: "origin",
          text: "w(h) = (10/3)h"
        }
      ],
      answer: [
        "offset"
      ],
      explanation: "De beginbreedte is 4. De breedte neemt (10\u22124)/3 = 2 m per meter hoogte toe.",
      hint: "Controleer de formule bij h = 0 en h = 3.",
      scene: {
        points: {
          A: [
            -2,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            5,
            0,
            3
          ],
          D: [
            -5,
            0,
            3
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Trapezium: bodembreedte 4 m, bovenbreedte 10 m, hoogte 3 m. h wordt gemeten vanaf de bodem."
      }
    },
    {
      id: "l5-model-p2",
      block: "l5-model",
      skill: "inzicht",
      type: "choice",
      prompt: "Een bak is onder 6 cm breed en boven 10 cm, op hoogte 8 cm. Hoe breed is de horizontale doorsnede op hoogte 4 cm?",
      options: [
        {
          id: "constant",
          text: "10 cm, overal dezelfde breedte."
        },
        {
          id: "origin",
          text: "5 cm, omdat 4 de helft van 8 is."
        },
        {
          id: "offset",
          text: "8 cm, omdat de toename van 4 cm gehalveerd wordt."
        }
      ],
      answer: [
        "offset"
      ],
      explanation: "De totale breedte is niet evenredig met de hoogte. Op halve hoogte is de toename 2 cm, boven op de bodem van 6 cm.",
      hint: "Welke grootheid begint hier bij nul?",
      scene: {
        points: {
          A: [
            -3,
            0,
            0
          ],
          B: [
            3,
            0,
            0
          ],
          C: [
            5,
            0,
            8
          ],
          D: [
            -5,
            0,
            8
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Symmetrische trapeziumdoorsnede: bodem 6 cm, bovenkant 10 cm, hoogte 8 cm."
      }
    },
    {
      id: "l5-model-r1",
      block: "l5-model",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een trapeziumvormige bak is onder 3 dm breed en boven 9 dm, op hoogte 6 dm. Hoe breed is de doorsnede op hoogte 2 dm? Geef dm op twee decimalen.",
      answer: [
        "5"
      ],
      tolerance: 0.02,
      unit: "dm",
      explanation: "De breedtetoename is (9\u22123)/6 = 1 dm per dm. w(2) = 3+2 = 5,00 dm.",
      hint: "Begin met de bodembreedte en tel de toename erbij.",
      scene: {
        points: {
          A: [
            -1.5,
            0,
            0
          ],
          B: [
            1.5,
            0,
            0
          ],
          C: [
            4.5,
            0,
            6
          ],
          D: [
            -4.5,
            0,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Bodembreedte 3 dm; bovenbreedte 9 dm; hoogte 6 dm."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l5-model-r2",
      block: "l5-model",
      skill: "inzicht",
      type: "choice",
      prompt: "Voor de bak van 10 dm lang, onder 2 dm breed en met w(h)=2+h: welke inhoudsformule is juist?",
      options: [
        {
          id: "top",
          text: "V(h) = 10 \xD7 (2+h) \xD7 h"
        },
        {
          id: "linear",
          text: "V(h) = 40h"
        },
        {
          id: "trapezoid",
          text: "V(h) = 10 \xD7 \xBD(2 + 2+h) \xD7 h"
        }
      ],
      answer: [
        "trapezoid"
      ],
      explanation: "De gevulde doorsnede is een trapezium. Gebruik het gemiddelde van bodem- en waterbreedte, niet alleen de breedte bovenaan.",
      hint: "Welk vlak figuur krijg je als je loodrecht op de lengte doorsnijdt?",
      scene: {
        points: {
          A: [
            -1,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            3,
            0,
            4
          ],
          D: [
            -3,
            0,
            4
          ],
          E: [
            -1,
            10,
            0
          ],
          F: [
            1,
            10,
            0
          ],
          G: [
            3,
            10,
            4
          ],
          H: [
            -3,
            10,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Rechte open bak van 10 dm lang. Trapeziumdoorsnede: bodem 2 dm, bovenkant 6 dm, verticale hoogte 4 dm. Symmetrische schuine wanden."
      }
    },
    {
      id: "l6-common-perpendicular-q1",
      block: "l6-common-perpendicular",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Kubus met ribbe 6 cm. Een student kiest A op AB en gebruikt AC = 6\u221A2 als afstand tussen AB en CG. Wat klopt?",
      options: [
        {
          id: "zero",
          text: "De afstand is 0 omdat AB en CG in de tekening naar elkaar toe lopen."
        },
        {
          id: "onepoint",
          text: "Dat is goed: \xE9\xE9n willekeurig punt op AB is voldoende."
        },
        {
          id: "both",
          text: "Dat is te groot: BC staat loodrecht op beide lijnen en heeft lengte 6."
        }
      ],
      answer: [
        "both"
      ],
      explanation: "AC staat wel loodrecht op CG, maar niet op AB. BC verbindt B op AB met C op CG en staat op beide lijnen loodrecht.",
      hint: "Controleer de loodrechte stand bij beide uiteinden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "AB",
          "CG"
        ],
        planes: [],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "AB",
          "CG"
        ],
        planes: [],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              1,
              0,
              0
            ],
            to: [
              1,
              1,
              0
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l6-common-perpendicular-q2",
      block: "l6-common-perpendicular",
      skill: "construeren",
      type: "points",
      prompt: "Balk: AB = 8 cm, AD = 5 cm, AE = 3 cm. Kies de twee voetpunten van de gemeenschappelijke loodlijn van AB en DH.",
      answer: [
        "A",
        "D"
      ],
      selectCount: 2,
      explanation: "A ligt op AB en D ligt op DH. AD staat loodrecht op AB en DH; AD vormt daarom de gemeenschappelijke loodlijn.",
      hint: "De verbinding moet op beide volledige lijnen eindigen.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          5,
          3
        ],
        highlights: [
          "AB",
          "DH"
        ],
        planes: [],
        caption: "AB = 8 cm, AD = 5 cm en AE = 3 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      extraPoints: {},
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          5,
          3
        ],
        highlights: [
          "AB",
          "DH"
        ],
        planes: [],
        caption: "AB = 8 cm, AD = 5 cm en AE = 3 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              0,
              1,
              0
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l6-common-perpendicular-q3",
      block: "l6-common-perpendicular",
      skill: "rekenen",
      type: "numeric",
      prompt: "Balk: AB = 8 cm, AD = 5 cm, AE = 3 cm. Bereken de afstand tussen de volledige lijnen AB en DH, in cm op twee decimalen.",
      answer: [
        "5"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "AD is de gemeenschappelijke loodlijn: AD \u27C2 AB en AD \u27C2 DH. De afstand is AD = 5,00 cm.",
      hint: "Zoek twee voetpunten op de lijnen; kijk niet naar de lengte van een willekeurige diagonaal.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          5,
          3
        ],
        highlights: [
          "AB",
          "DH"
        ],
        planes: [],
        caption: "AB = 8 cm, AD = 5 cm en AE = 3 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          5,
          3
        ],
        highlights: [
          "AB",
          "DH"
        ],
        planes: [],
        caption: "AB = 8 cm, AD = 5 cm en AE = 3 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              0,
              0,
              0
            ],
            to: [
              0,
              1,
              0
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l6-common-perpendicular-q4",
      block: "l6-common-perpendicular",
      skill: "rekenen",
      type: "numeric",
      prompt: "Balk: AB = 8 cm, AD = 6 cm, AE = 5 cm. Bereken de afstand tussen AC en FH, in cm op twee decimalen.",
      answer: [
        "5"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "De grondvlakdiagonaal AC en bovenvlakdiagonaal FH hebben horizontale richtingen. Hun middelpunten liggen recht boven elkaar. De verticale verbinding is loodrecht op beide, dus de afstand is 5,00 cm.",
      hint: "De voetpunten hoeven geen hoekpunten te zijn.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          6,
          5
        ],
        highlights: [
          "AC",
          "FH"
        ],
        planes: [],
        caption: "AB = 8 cm, AD = 6 cm en AE = 5 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          O: [
            0.5,
            0.5,
            0
          ],
          I: [
            0.5,
            0.5,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          6,
          5
        ],
        highlights: [
          "AC",
          "FH"
        ],
        planes: [],
        caption: "AB = 8 cm, AD = 6 cm en AE = 5 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              0.5,
              0.5,
              0
            ],
            to: [
              0.5,
              0.5,
              1
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l6-common-perpendicular-p1",
      block: "l6-common-perpendicular",
      skill: "inzicht",
      type: "choice",
      prompt: "Kubus met ribbe 4 cm. Is d(C,AE) = CA = 4\u221A2 ook de afstand tussen CD en AE?",
      options: [
        {
          id: "onepoint",
          text: "Ja, want C ligt op CD."
        },
        {
          id: "both",
          text: "Nee, DA = 4 is een kortere verbinding loodrecht op beide lijnen."
        },
        {
          id: "zero",
          text: "Nee, de lijnen snijden elkaar."
        }
      ],
      answer: [
        "both"
      ],
      explanation: "CA staat niet loodrecht op CD. DA is loodrecht op CD en AE en verbindt punten van die twee lijnen.",
      hint: "Controleer of het punt C op de eerste lijn optimaal gekozen is.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          4,
          4,
          4
        ],
        highlights: [
          "CD",
          "AE"
        ],
        planes: [],
        caption: "AB = 4 cm, AD = 4 cm en AE = 4 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l6-common-perpendicular-p2",
      block: "l6-common-perpendicular",
      skill: "inzicht",
      type: "choice",
      prompt: "Kubus met ribbe 5 cm. Je zoekt d(AC,FH). Is d(A,FH) meteen voldoende omdat A op AC ligt?",
      options: [
        {
          id: "both",
          text: "Nee, de voet op AC kan elders liggen; hier ligt die in het midden O."
        },
        {
          id: "parallel",
          text: "Ja, omdat AC evenwijdig is aan FH."
        },
        {
          id: "onepoint",
          text: "Ja, elk punt van AC geeft dezelfde punt-lijnafstand."
        }
      ],
      answer: [
        "both"
      ],
      explanation: "De gemeenschappelijke loodlijn verbindt de middelpunten van AC en FH. Een vast gekozen A geeft een grotere afstand. AC en FH zijn bovendien niet evenwijdig.",
      hint: "Vergelijk de verbinding vanuit A met een verticale verbinding vanuit het grondvlakmiddelpunt.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          5,
          5,
          5
        ],
        highlights: [
          "AC",
          "FH"
        ],
        planes: [],
        caption: "AB = 5 cm, AD = 5 cm en AE = 5 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l6-common-perpendicular-r1",
      block: "l6-common-perpendicular",
      skill: "rekenen",
      type: "numeric",
      prompt: "Balk: AB = 7 cm, AD = 9 cm, AE = 4 cm. Bereken d(EF,CG), in cm op twee decimalen.",
      answer: [
        "9"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "FG verbindt F op EF met G op CG en staat loodrecht op beide. FG = AD = 9,00 cm.",
      hint: "Zoek een bestaande ribbe die beide lijnen loodrecht verbindt.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          7,
          9,
          4
        ],
        highlights: [
          "EF",
          "CG"
        ],
        planes: [],
        caption: "AB = 7 cm, AD = 9 cm en AE = 4 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          7,
          9,
          4
        ],
        highlights: [
          "EF",
          "CG"
        ],
        planes: [],
        caption: "AB = 7 cm, AD = 9 cm en AE = 4 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              1,
              0,
              1
            ],
            to: [
              1,
              1,
              1
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l6-common-perpendicular-r2",
      block: "l6-common-perpendicular",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Voor twee kruisende lijnen l en m zijn X \u2208 l en Y \u2208 m gegeven. Wanneer bewijst XY dat je hun afstand hebt gevonden?",
      options: [
        {
          id: "both",
          text: "Als XY loodrecht staat op l \xE9n op m."
        },
        {
          id: "onepoint",
          text: "Als XY loodrecht staat op alleen m."
        },
        {
          id: "screen",
          text: "Als XY op het scherm het kortst lijkt."
        }
      ],
      answer: [
        "both"
      ],
      explanation: "De gemeenschappelijke loodlijn moet op beide lijnrichtingen loodrecht staan. Anders kun je een voetpunt verschuiven en de verbinding korter maken.",
      hint: "Er zijn twee eindpunten die mogen verschuiven.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          X: [
            0.5,
            0,
            0
          ],
          Y: [
            1,
            1,
            0.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "AB",
          "CG",
          "XY"
        ],
        planes: [],
        caption: "Voorbeeld: l = AB, m = CG, X \u2208 l en Y \u2208 m. XY is een kandidaatverbinding; controleer de voorwaarden."
      }
    },
    {
      id: "l6-parallel-plane-q1",
      block: "l6-parallel-plane",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Voor d(AC,BH) in een kubus stelt iemand V = ABCD voor, omdat AC in ABCD ligt. Is dit hulpvlak geschikt voor de parallelvlakmethode?",
      options: [
        {
          id: "parallel",
          text: "Nee, BH is niet evenwijdig aan ABCD."
        },
        {
          id: "none",
          text: "Nee, een grondvlak mag nooit een hulpvlak zijn."
        },
        {
          id: "contain",
          text: "Ja, AC in het hulpvlak is de enige voorwaarde."
        }
      ],
      answer: [
        "parallel"
      ],
      explanation: "Het hulpvlak moet AC bevatten \xE9n evenwijdig zijn aan BH. BH loopt van onder naar boven en is niet evenwijdig aan ABCD.",
      hint: "Controleer beide voorwaarden van de methode.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "AC",
          "BH"
        ],
        planes: [],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l6-parallel-plane-q2",
      block: "l6-parallel-plane",
      skill: "construeren",
      type: "choice",
      prompt: "Je maakt een hulpvlak door lijn l, evenwijdig aan een kruisende lijn m. Welke constructiestap is geldig?",
      options: [
        {
          id: "arbitrary",
          text: "Neem een willekeurig vlak dat l bevat."
        },
        {
          id: "correct",
          text: "Kies A op l, construeer door A een lijn n \u2225 m en neem het vlak door l en n."
        },
        {
          id: "perp",
          text: "Kies A op l, trek door A een lijn loodrecht op m; elk vlak door beide is geschikt."
        }
      ],
      answer: [
        "correct"
      ],
      explanation: "Omdat l en m kruisend zijn, hebben zij verschillende richtingen. l en n zijn snijdende, niet-evenwijdige lijnen en bepalen dus een uniek vlak met de gewenste richtingen.",
      hint: "Een vlak wordt bepaald door twee snijdende lijnen.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          5,
          5,
          5
        ],
        highlights: [
          "AC",
          "BH"
        ],
        planes: [],
        caption: "Voorbeeld van kruisende lijnen: l = AC en m = BH in een kubus. Kies zelf een geschikt hulpvlak."
      }
    },
    {
      id: "l6-parallel-plane-q3",
      block: "l6-parallel-plane",
      skill: "rekenen",
      type: "numeric",
      prompt: "Kubus met ribbe 6 cm. O is het midden van AC. In vlak BDHF is opp(OBH) = 9\u221A2 cm\xB2 en BH = 6\u221A3 cm. Bereken d(AC,BH), in cm op twee decimalen.",
      answer: [
        "2.44948974278"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "De loodlijn uit O op BH is ook loodrecht op AC, omdat AC loodrecht staat op vlak BDHF. De hoogte is 2 \xD7 9\u221A2/(6\u221A3) = \u221A6 \u2248 2,45 cm.",
      hint: "Gebruik de oppervlakte van OBH om de hoogte op BH te vinden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          O: [
            0.5,
            0.5,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "AC",
          "BH"
        ],
        planes: [
          [
            "B",
            "D",
            "H",
            "F"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          O: [
            0.5,
            0.5,
            0
          ],
          N: [
            0.6666666666666666,
            0.3333333333333333,
            0.3333333333333333
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "AC",
          "BH"
        ],
        planes: [
          [
            "B",
            "D",
            "H",
            "F"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              0.5,
              0.5,
              0
            ],
            to: [
              0.6666666666666666,
              0.3333333333333333,
              0.3333333333333333
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l6-parallel-plane-q4",
      block: "l6-parallel-plane",
      skill: "rekenen",
      type: "numeric",
      prompt: "Kubus met ribbe 10 cm. Bereken d(BD,AG), in cm op twee decimalen. Je mag een hulpvlak of de symmetrie van de kubus gebruiken.",
      answer: [
        "4.08248290464"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "Een spiegeling verwisselt het paar AC en BH met BD en AG en bewaart afstanden. Of werk met O, het midden van BD: de gemeenschappelijke loodlijn eindigt op AG in (a/3,a/3,a/3). De afstand is a/\u221A6 = 10/\u221A6 \u2248 4,08 cm.",
      hint: "Zoek een symmetrisch paar lijnen of werk in het diagonale vlak ACGE.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          10,
          10,
          10
        ],
        highlights: [
          "BD",
          "AG"
        ],
        planes: [],
        caption: "AB = 10 cm, AD = 10 cm en AE = 10 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          O: [
            0.5,
            0.5,
            0
          ],
          N: [
            0.3333333333333333,
            0.3333333333333333,
            0.3333333333333333
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          10,
          10,
          10
        ],
        highlights: [
          "BD",
          "AG"
        ],
        planes: [],
        caption: "AB = 10 cm, AD = 10 cm en AE = 10 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              0.5,
              0.5,
              0
            ],
            to: [
              0.3333333333333333,
              0.3333333333333333,
              0.3333333333333333
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l6-parallel-plane-p1",
      block: "l6-parallel-plane",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Voor d(AB,CG) kiest iemand hulpvlak ABCD omdat dit AB bevat. Wat moet nog worden gecontroleerd?",
      options: [
        {
          id: "size",
          text: "Of de oppervlakte van ABCD groter dan 1 is."
        },
        {
          id: "contain",
          text: "Niets: ieder vlak door AB werkt."
        },
        {
          id: "parallel",
          text: "Of CG evenwijdig is aan ABCD; dat is hier niet zo."
        }
      ],
      answer: [
        "parallel"
      ],
      explanation: "CG staat juist loodrecht op ABCD. Een geschikt vlak is bijvoorbeeld ABFE: daarin ligt AB en het is evenwijdig aan CG.",
      hint: "Het hulpvlak moet beide lijnrichtingen hebben.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          4,
          4,
          4
        ],
        highlights: [
          "AB",
          "CG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ],
        caption: "AB = 4 cm, AD = 4 cm en AE = 4 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l6-parallel-plane-p2",
      block: "l6-parallel-plane",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Je zoekt d(EF,AD). Is bovenvlak EFGH geschikt als hulpvlak door EF, en waarom?",
      options: [
        {
          id: "contain",
          text: "Ja, uitsluitend omdat EF erin ligt; de richting AD doet er niet toe."
        },
        {
          id: "parallel",
          text: "Ja, EF ligt erin \xE9n AD is evenwijdig aan een richting van dit vlak."
        },
        {
          id: "no",
          text: "Nee, een vlak met vier hoekpunten is nooit geschikt."
        }
      ],
      answer: [
        "parallel"
      ],
      explanation: "Beide voorwaarden tellen: EF ligt in EFGH en AD \u2225 EH, dus AD is evenwijdig aan EFGH. Daarna kun je de afstand van A tot het bovenvlak nemen.",
      hint: "Beoordeel de hele onderbouwing, niet alleen ja of nee.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          7,
          7,
          7
        ],
        highlights: [
          "EF",
          "AD"
        ],
        planes: [
          [
            "E",
            "F",
            "G",
            "H"
          ]
        ],
        caption: "AB = 7 cm, AD = 7 cm en AE = 7 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l6-parallel-plane-r1",
      block: "l6-parallel-plane",
      skill: "construeren",
      type: "choice",
      prompt: "Balk ABCD.EFGH. Welk hulpvlak is geschikt om d(AB,DH) via een punt-vlakafstand te berekenen?",
      options: [
        {
          id: "ground",
          text: "ABCD: bevat AB, dus de tweede voorwaarde is overbodig."
        },
        {
          id: "side",
          text: "BCGF: bevat DH."
        },
        {
          id: "correct",
          text: "ABFE: bevat AB en is evenwijdig aan DH."
        }
      ],
      answer: [
        "correct"
      ],
      explanation: "ABFE bevat AB en de verticale richting BF, die evenwijdig is aan DH. De afstand van D tot ABFE is daarom de gezochte lijnafstand.",
      hint: "Zoek in het vlak een lijn met de richting van DH.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          7,
          4,
          3
        ],
        highlights: [
          "AB",
          "DH"
        ],
        planes: [],
        caption: "AB = 7 cm, AD = 4 cm en AE = 3 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l6-parallel-plane-r2",
      block: "l6-parallel-plane",
      skill: "rekenen",
      type: "numeric",
      prompt: "Kubus met ribbe 12 cm. Bereken d(AC,BH), in cm op twee decimalen.",
      answer: [
        "4.89897948557"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "Met O het midden van AC is de hoogte uit O op BH gemeenschappelijk loodrecht. De kubus is tweemaal zo groot als de kubus met ribbe 6, dus ook de afstand verdubbelt: 12/\u221A6 = 2\u221A6 \u2248 4,90 cm.",
      hint: "Gebruik een geschikte vlakke driehoek of schaal een bewezen resultaat.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          12,
          12,
          12
        ],
        highlights: [
          "AC",
          "BH"
        ],
        planes: [],
        caption: "AB = 12 cm, AD = 12 cm en AE = 12 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          O: [
            0.5,
            0.5,
            0
          ],
          N: [
            0.6666666666666666,
            0.3333333333333333,
            0.3333333333333333
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          12,
          12,
          12
        ],
        highlights: [
          "AC",
          "BH"
        ],
        planes: [],
        caption: "AB = 12 cm, AD = 12 cm en AE = 12 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben.",
        segments: [
          {
            from: [
              0.5,
              0.5,
              0
            ],
            to: [
              0.6666666666666666,
              0.3333333333333333,
              0.3333333333333333
            ],
            color: "#65d6af",
            dashed: false
          }
        ]
      }
    },
    {
      id: "l6-method-q1",
      block: "l6-method",
      skill: "inzicht",
      type: "choice",
      prompt: "Welke hoek geeft de hoek tussen AG en grondvlak ABCD in een kubus?",
      options: [
        {
          id: "normal",
          text: "De hoek tussen AG en de verticale lijn CG."
        },
        {
          id: "projection",
          text: "\u2220GAC, tussen AG en zijn loodrechte projectie AC."
        },
        {
          id: "any",
          text: "\u2220GAB, want AB ligt in het grondvlak."
        }
      ],
      answer: [
        "projection"
      ],
      explanation: "De lijn-vlakhoek is de scherpe hoek tussen de lijn en haar loodrechte projectie op het vlak. De hoek met de normaal is de complementaire hoek.",
      hint: "Projecteer eerst het punt G loodrecht op het grondvlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "AG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "AG",
          "AC",
          "CG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l6-method-q2",
      block: "l6-method",
      skill: "rekenen",
      type: "numeric",
      prompt: "Balk: AB = 8 cm, AD = 6 cm, AE = 5 cm. Bereken de hoek tussen AG en ABCD, in hele graden.",
      answer: [
        "26.5650511771"
      ],
      tolerance: 0.6,
      unit: "\xB0",
      explanation: "AC = \u221A(8\xB2+6\xB2) = 10 cm en CG = 5 cm. tan \u03B1 = 5/10. \u03B1 \u2248 26,57\xB0, dus afgerond 27\xB0.",
      hint: "Bepaal eerst de loodrechte projectie van AG.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          6,
          5
        ],
        highlights: [
          "AG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ],
        caption: "AB = 8 cm, AD = 6 cm en AE = 5 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 0,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          6,
          5
        ],
        highlights: [
          "AG",
          "AC",
          "CG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ],
        caption: "AB = 8 cm, AD = 6 cm en AE = 5 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l6-method-q3",
      block: "l6-method",
      skill: "rekenen",
      type: "numeric",
      prompt: "Afgeknotte balk: AB = 6 cm, AD = 4 cm, AE = DH = 5 cm en BF = CG = 2 cm. Bereken de scherpe hoek tussen EFGH en ABCD, in hele graden.",
      answer: [
        "26.5650511771"
      ],
      tolerance: 0.6,
      unit: "\xB0",
      explanation: "De hoogte daalt 3 cm over AB = 6 cm. Het voorvlak ABFE is een standvlak loodrecht op de richting AD van de snijlijn der verlengde vlakken. Daarom tan \u03B1 = 3/6 en \u03B1 \u2248 27\xB0.",
      hint: "Zoek een doorsnede waarin de helling als rechthoekige driehoek zichtbaar wordt.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            5
          ],
          F: [
            6,
            0,
            2
          ],
          G: [
            6,
            4,
            2
          ],
          H: [
            0,
            4,
            5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [
          [
            "E",
            "F",
            "G",
            "H"
          ]
        ],
        caption: "Grondvlak 6 \xD7 4 cm, AE = DH = 5 cm en BF = CG = 2 cm. Alle opstaande ribben zijn loodrecht op ABCD."
      },
      working: true,
      decimals: 0
    },
    {
      id: "l6-method-q4",
      block: "l6-method",
      skill: "inzicht",
      type: "choice",
      prompt: "Voor de gevouwen bak geldt h = \u221A(900\u221230x), met bodem x cm. Welk domein beschrijft echte bakken met positieve breedte \xE9n positieve hoogte?",
      options: [
        {
          id: "physical",
          text: "0 < x < 30"
        },
        {
          id: "radical",
          text: "x \u2264 30, ook alle negatieve waarden"
        },
        {
          id: "plate",
          text: "0 < x < 60"
        }
      ],
      answer: [
        "physical"
      ],
      explanation: "De wortel vraagt x \u2264 30. Daarbovenop moet x > 0 en moet h > 0, dus x < 30. Bij x = 30 is de bak plat; bij x = 0 is de bodembreedte nul.",
      hint: "Een algebra\xEFsche voorwaarde is nog niet automatisch het volledige fysieke domein.",
      scene: {
        points: {
          A: [
            -6,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            12,
            0,
            23.2379000772445
          ],
          D: [
            -12,
            0,
            23.2379000772445
          ],
          E: [
            -6,
            40,
            0
          ],
          F: [
            6,
            40,
            0
          ],
          G: [
            12,
            40,
            23.2379000772445
          ],
          H: [
            -12,
            40,
            23.2379000772445
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Oorspronkelijke vouwbak: plaatbreedte 60 cm, baklengte 40 cm, bodem x = 12 cm en bovenopening 2x = 24 cm. De twee schuine wanden zijn even breed. Hoogte h is onbekend."
      }
    },
    {
      id: "l6-method-p1",
      block: "l6-method",
      skill: "inzicht",
      type: "choice",
      prompt: "Welke twee lijnen gebruik je voor de hoek tussen CE en ABCD in een kubus?",
      options: [
        {
          id: "projection",
          text: "CE en CA, de projectie van CE op ABCD."
        },
        {
          id: "any",
          text: "CE en CB, want CB ligt in ABCD."
        },
        {
          id: "normal",
          text: "CE en AE, de verticale normaal."
        }
      ],
      answer: [
        "projection"
      ],
      explanation: "E projecteert naar A en C ligt al in het grondvlak. De projectie is dus CA.",
      hint: "Projecteer beide eindpunten op het doelvlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          5,
          5,
          5
        ],
        highlights: [
          "CE"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ],
        caption: "AB = 5 cm, AD = 5 cm en AE = 5 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l6-method-p2",
      block: "l6-method",
      skill: "inzicht",
      type: "choice",
      prompt: "Vierkante piramide: T staat recht boven O. Je zoekt de hoek van TA met het grondvlak ABCD. Welke hoek is dat?",
      options: [
        {
          id: "any",
          text: "\u2220TAB, omdat AB in het grondvlak ligt."
        },
        {
          id: "normal",
          text: "De hoek tussen TA en TO."
        },
        {
          id: "projection",
          text: "\u2220TAO, tussen TA en AO."
        }
      ],
      answer: [
        "projection"
      ],
      explanation: "De top T projecteert naar O. AO is dus de projectie van AT. De hoek met TO hoort bij de normaal en vult de gevraagde hoek aan tot 90\xB0.",
      hint: "Welke lijn ontstaat als je TA loodrecht op het grondvlak projecteert?",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          T: [
            3,
            3,
            4
          ],
          O: [
            3,
            3,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Vierkante piramide: zijde grondvlak 6 cm, top T recht boven middelpunt O, TO = 4 cm."
      }
    },
    {
      id: "l6-method-r1",
      block: "l6-method",
      skill: "rekenen",
      type: "numeric",
      prompt: "Vierkante piramide: grondzijde 8 cm en TO = 6 cm, T recht boven middelpunt O. Bereken de hoek van TA met het grondvlak, in hele graden.",
      answer: [
        "46.6861433417"
      ],
      tolerance: 0.6,
      unit: "\xB0",
      explanation: "AO is de halve gronddiagonaal: 4\u221A2 cm. tan \u03B1 = TO/AO = 6/(4\u221A2). \u03B1 \u2248 46,69\xB0, dus 47\xB0.",
      hint: "Werk met de lijn en haar projectie.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            8,
            8,
            0
          ],
          D: [
            0,
            8,
            0
          ],
          T: [
            4,
            4,
            6
          ],
          O: [
            4,
            4,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Vierkante piramide: zijde grondvlak 8 cm, top T recht boven middelpunt O, TO = 6 cm."
      },
      working: true,
      decimals: 0
    },
    {
      id: "l6-method-r2",
      block: "l6-method",
      skill: "inzicht",
      type: "choice",
      prompt: "Kubus: je zoekt d(E,AFH), geen hoek. Welke grootheid bereken je uiteindelijk?",
      options: [
        {
          id: "angle",
          text: "De hoek tussen EA en AFH."
        },
        {
          id: "edge",
          text: "De lengte van een willekeurige ribbe in AFH."
        },
        {
          id: "length",
          text: "De lengte EN van de loodlijn uit E op AFH."
        }
      ],
      answer: [
        "length"
      ],
      explanation: "De afstand is een loodrechte lengte. Een hoek kan een tussenstap zijn om die lengte te berekenen, maar is niet het eindantwoord.",
      hint: "Let op wat d(E,AFH) en de gevraagde eenheid betekenen.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [],
        planes: [
          [
            "A",
            "F",
            "H"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l5-check-1",
      block: "l5-point-line",
      skill: "rekenen",
      type: "numeric",
      prompt: "Rechthoekige driehoek ABP: AB = 8 cm en AP = 15 cm. Bereken d(A,BP), in cm op twee decimalen.",
      answer: [
        "7.05882352941"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "BP = 17. Met de oppervlakte volgt h = 8\xD715/17 \u2248 7,06 cm.",
      hint: "Kies zelf een geschikte methode.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          P: [
            0,
            15,
            0
          ]
        },
        edges: [
          "AB",
          "BP",
          "PA"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Rechthoekige driehoek ABP: AB = 8 cm, AP = 15 cm en AP \u27C2 AB."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l5-check-2",
      block: "l5-point-line",
      skill: "construeren",
      type: "points",
      prompt: "Kubus. M is het midden van FH, N het midden van EF, O het middelpunt van de kubus. Selecteer de loodrechte voet van G op de volledige lijn FH.",
      answer: [
        "M"
      ],
      selectCount: 1,
      explanation: "De voet M ligt op FH; GM is een halve diagonaal EG en staat loodrecht op FH.",
      hint: "Gebruik de ligging van de punten.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          M: [
            0.5,
            0.5,
            1
          ],
          N: [
            0.5,
            0,
            1
          ],
          O: [
            0.5,
            0.5,
            0.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          7,
          7,
          7
        ],
        highlights: [
          "FH"
        ],
        planes: [],
        caption: "AB = 7 cm, AD = 7 cm en AE = 7 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      extraPoints: {
        M: [
          0.5,
          0.5,
          1
        ],
        N: [
          0.5,
          0,
          1
        ],
        O: [
          0.5,
          0.5,
          0.5
        ]
      }
    },
    {
      id: "l5-check-3",
      block: "l5-point-plane",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een lijn PN raakt vlak V in N. Welk gegeven is voldoende om PN \u27C2 V te bewijzen?",
      options: [
        {
          id: "one",
          text: "PN staat loodrecht op \xE9\xE9n lijn in V."
        },
        {
          id: "outside",
          text: "P ligt buiten V."
        },
        {
          id: "two",
          text: "PN staat loodrecht op twee snijdende lijnen in V door N."
        }
      ],
      answer: [
        "two"
      ],
      explanation: "De loodrechte stand op twee snijdende richtingen van het vlak bewijst de loodrechte stand op het hele vlak.",
      hint: "Gebruik een geldige meetkundige voorwaarde.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ],
          P: [
            0.5,
            0.5,
            1.4
          ],
          N: [
            0.5,
            0.5,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          5,
          5,
          5
        ],
        highlights: [
          "PN"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ],
        caption: "V is het vlak ABCD. N ligt in V; P ligt erbuiten. De tekening is een voorbeeldsituatie, geen bewijs van loodrechte stand."
      }
    },
    {
      id: "l5-check-4",
      block: "l5-point-plane",
      skill: "rekenen",
      type: "numeric",
      prompt: "Balk: AB = 9 cm, AD = 12 cm, AE = 4 cm. Bereken d(B,ACGE), in cm op twee decimalen.",
      answer: [
        "7.2"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "AC = 15; opp(ABC) = 54. De hoogte op AC is 108/15 = 7,20 cm en staat ook loodrecht op de verticale richting.",
      hint: "Bepaal zelf het hulpvlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          9,
          12,
          4
        ],
        highlights: [],
        planes: [
          [
            "A",
            "C",
            "G",
            "E"
          ]
        ],
        caption: "AB = 9 cm, AD = 12 cm en AE = 4 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l5-check-5",
      block: "l5-volume",
      skill: "rekenen",
      type: "numeric",
      prompt: "Kubus met ribbe 7 cm. Bereken d(F,BGE), in cm op twee decimalen.",
      answer: [
        "4.04145188433"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "V = 7\xB3/6, B = 49\u221A3/2. h = 3V/B = 7/\u221A3 \u2248 4,04 cm.",
      hint: "Kies een passende afstandsmethode.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          7,
          7,
          7
        ],
        highlights: [],
        planes: [
          [
            "B",
            "G",
            "E"
          ]
        ],
        caption: "AB = 7 cm, AD = 7 cm en AE = 7 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l5-check-6",
      block: "l5-volume",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Je berekent een tetra\xEBder eerst met een horizontaal grondvlak en daarna met een schuin grondvlak. Welke grootheid blijft zeker gelijk?",
      options: [
        {
          id: "height",
          text: "De hoogte."
        },
        {
          id: "area",
          text: "De grondvlakoppervlakte."
        },
        {
          id: "volume",
          text: "De inhoud."
        }
      ],
      answer: [
        "volume"
      ],
      explanation: "Hetzelfde lichaam heeft dezelfde inhoud. Het gekozen grondvlak en de bijbehorende hoogte kunnen veranderen, maar hun product B\xD7h blijft driemaal de inhoud.",
      hint: "Bedenk wat er aan het lichaam zelf verandert.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            4,
            0,
            0
          ],
          C: [
            0,
            6,
            0
          ],
          T: [
            0,
            0,
            9
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Tetra\xEBder ABCT: AB = 4 cm, AC = 6 cm, AT = 9 cm; AB, AC en AT zijn onderling loodrecht."
      }
    },
    {
      id: "l5-check-7",
      block: "l5-model",
      skill: "rekenen",
      type: "numeric",
      prompt: "Bak: lengte 10 dm, onderbreedte 2 dm, bovenbreedte 6 dm en hoogte 4 dm. Bereken de inhoud tot hoogte h = 1,5 dm, in dm\xB3 op twee decimalen.",
      answer: [
        "41.25"
      ],
      tolerance: 0.02,
      unit: "dm\xB3",
      explanation: "w(1,5) = 3,5. V = 10 \xD7 \xBD(2+3,5) \xD7 1,5 = 41,25 dm\xB3.",
      hint: "Stel zelf de benodigde doorsnede op.",
      scene: {
        points: {
          A: [
            -1,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            3,
            0,
            4
          ],
          D: [
            -3,
            0,
            4
          ],
          E: [
            -1,
            10,
            0
          ],
          F: [
            1,
            10,
            0
          ],
          G: [
            3,
            10,
            4
          ],
          H: [
            -3,
            10,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Rechte open bak van 10 dm lang. Trapeziumdoorsnede: bodem 2 dm, bovenkant 6 dm, verticale hoogte 4 dm. Symmetrische schuine wanden."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l5-check-8",
      block: "l5-model",
      skill: "inzicht",
      type: "choice",
      prompt: "Voor de vouwbak uit een 60 cm brede plaat is bodem x en opening 2x. Welke formule voor de hoogte is juist?",
      options: [
        {
          id: "right",
          text: "h = \u221A(900\u221230x)"
        },
        {
          id: "linear",
          text: "h = 30\u2212x"
        },
        {
          id: "wrong",
          text: "h = (60\u2212x)/2"
        }
      ],
      answer: [
        "right"
      ],
      explanation: "De schuine wand heeft lengte (60\u2212x)/2 en de horizontale uitwijking is x/2. Pythagoras geeft h\xB2 = ((60\u2212x)/2)\xB2\u2212(x/2)\xB2 = 900\u221230x.",
      hint: "Gebruik een rechthoekige driehoek in de trapeziumdoorsnede.",
      scene: {
        points: {
          A: [
            -5,
            0,
            0
          ],
          B: [
            5,
            0,
            0
          ],
          C: [
            10,
            0,
            24.49489742783178
          ],
          D: [
            -10,
            0,
            24.49489742783178
          ],
          E: [
            -5,
            40,
            0
          ],
          F: [
            5,
            40,
            0
          ],
          G: [
            10,
            40,
            24.49489742783178
          ],
          H: [
            -10,
            40,
            24.49489742783178
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Oorspronkelijke vouwbak: plaatbreedte 60 cm, baklengte 40 cm, bodem x = 10 cm en bovenopening 2x = 20 cm. De twee schuine wanden zijn even breed. Hoogte h is onbekend."
      }
    },
    {
      id: "l6-check-1",
      block: "l6-common-perpendicular",
      skill: "construeren",
      type: "points",
      prompt: "Balk: AB = 9 cm, AD = 7 cm, AE = 4 cm. Kies de twee voetpunten van de gemeenschappelijke loodlijn van EF en CG.",
      answer: [
        "F",
        "G"
      ],
      selectCount: 2,
      explanation: "FG staat loodrecht op EF en CG en eindigt op beide lijnen.",
      hint: "Bepaal de geschikte verbinding.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          9,
          7,
          4
        ],
        highlights: [
          "EF",
          "CG"
        ],
        planes: [],
        caption: "AB = 9 cm, AD = 7 cm en AE = 4 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      extraPoints: {}
    },
    {
      id: "l6-check-2",
      block: "l6-common-perpendicular",
      skill: "rekenen",
      type: "numeric",
      prompt: "Balk: AB = 9 cm, AD = 7 cm, AE = 4 cm. Bereken d(AC,FH), in cm op twee decimalen.",
      answer: [
        "4"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "De verbinding tussen de middelpunten is verticaal, loodrecht op beide horizontale lijnen, en heeft lengte AE = 4,00 cm.",
      hint: "Zoek zelf de gemeenschappelijke loodlijn.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          9,
          7,
          4
        ],
        highlights: [
          "AC",
          "FH"
        ],
        planes: [],
        caption: "AB = 9 cm, AD = 7 cm en AE = 4 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l6-check-3",
      block: "l6-parallel-plane",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Waarom mag je bij kruisende lijnen l en m niet zomaar een willekeurig vlak door l kiezen om een punt-vlakafstand te berekenen?",
      options: [
        {
          id: "parallel",
          text: "Het vlak moet tevens evenwijdig zijn aan m."
        },
        {
          id: "horizontal",
          text: "Het vlak moet horizontaal liggen."
        },
        {
          id: "vertex",
          text: "Het vlak moet door minstens drie hoekpunten lopen."
        }
      ],
      answer: [
        "parallel"
      ],
      explanation: "Zonder de richting van m in het hulpvlak kan de punt-vlakafstand anders zijn dan de afstand tussen de lijnen.",
      hint: "Denk aan de voorwaarden van de reductie.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          8,
          8,
          8
        ],
        highlights: [
          "AC",
          "BH"
        ],
        planes: [],
        caption: "Voorbeeld van kruisende lijnen: l = AC en m = BH in een kubus. Kies zelf een geschikt hulpvlak."
      }
    },
    {
      id: "l6-check-4",
      block: "l6-parallel-plane",
      skill: "rekenen",
      type: "numeric",
      prompt: "Kubus met ribbe 9 cm. Bereken de afstand tussen AC en BH, in cm op twee decimalen.",
      answer: [
        "3.67423461417"
      ],
      tolerance: 0.02,
      unit: "cm",
      explanation: "Met O het midden van AC ligt de gemeenschappelijke loodlijn in vlak BDHF. De hoogte uit O op BH is a/\u221A6 = 9/\u221A6 \u2248 3,67 cm.",
      hint: "Kies zelf een hulpvlak en passende driehoek.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          9,
          9,
          9
        ],
        highlights: [
          "AC",
          "BH"
        ],
        planes: [],
        caption: "AB = 9 cm, AD = 9 cm en AE = 9 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l6-check-5",
      block: "l6-method",
      skill: "rekenen",
      type: "numeric",
      prompt: "Balk: AB = 12 cm, AD = 9 cm, AE = 8 cm. Bereken de hoek van AG met het grondvlak, in hele graden.",
      answer: [
        "28.0724869359"
      ],
      tolerance: 0.6,
      unit: "\xB0",
      explanation: "De projectie is AC = 15 cm. tan \u03B1 = 8/15, dus \u03B1 \u2248 28,07\xB0 en afgerond 28\xB0.",
      hint: "Bepaal eerst welke twee lijnen de hoek voorstellen.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          12,
          9,
          8
        ],
        highlights: [
          "AG"
        ],
        planes: [],
        caption: "AB = 12 cm, AD = 9 cm en AE = 8 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      },
      working: true,
      decimals: 0
    },
    {
      id: "l6-check-6",
      block: "l6-method",
      skill: "rekenen",
      type: "numeric",
      prompt: "Afgeknotte balk: grondvlak AB = 8 cm en AD = 5 cm, opstaande ribben loodrecht op het grondvlak. AE = DH = 7 cm en BF = CG = 3 cm. Bereken de hoek tussen EFGH en ABCD, in hele graden.",
      answer: [
        "26.5650511771"
      ],
      tolerance: 0.6,
      unit: "\xB0",
      explanation: "In een standvlak langs AB daalt het bovenvlak 4 cm over 8 cm. tan \u03B1 = 4/8; \u03B1 \u2248 26,57\xB0, dus 27\xB0.",
      hint: "Bepaal zelf een standvlak.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            8,
            5,
            0
          ],
          D: [
            0,
            5,
            0
          ],
          E: [
            0,
            0,
            7
          ],
          F: [
            8,
            0,
            3
          ],
          G: [
            8,
            5,
            3
          ],
          H: [
            0,
            5,
            7
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [
          [
            "E",
            "F",
            "G",
            "H"
          ]
        ],
        caption: "AB = 8 cm, AD = 5 cm, AE = DH = 7 cm en BF = CG = 3 cm."
      },
      working: true,
      decimals: 0
    },
    {
      id: "l6-check-7",
      block: "l6-method",
      skill: "rekenen",
      type: "numeric",
      prompt: "Vouwbak: plaatbreedte 60 cm, lengte 40 cm, bodem x = 20 cm, opening 2x. Bereken de inhoud, in cm\xB3 op twee decimalen.",
      answer: [
        "20784.6096908"
      ],
      tolerance: 0.03,
      unit: "cm\xB3",
      explanation: "Wandlengte 20, horizontale uitwijking 10, hoogte \u221A300 = 10\u221A3. Doorsnedeoppervlakte = \xBD(20+40)\xD710\u221A3 = 300\u221A3. Inhoud = 12000\u221A3 \u2248 20784,61 cm\xB3.",
      hint: "Bepaal eerst de verticale hoogte van het trapezium.",
      scene: {
        points: {
          A: [
            -10,
            0,
            0
          ],
          B: [
            10,
            0,
            0
          ],
          C: [
            20,
            0,
            17.320508075688775
          ],
          D: [
            -20,
            0,
            17.320508075688775
          ],
          E: [
            -10,
            40,
            0
          ],
          F: [
            10,
            40,
            0
          ],
          G: [
            20,
            40,
            17.320508075688775
          ],
          H: [
            -20,
            40,
            17.320508075688775
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        highlights: [],
        planes: [],
        caption: "Oorspronkelijke vouwbak: plaatbreedte 60 cm, baklengte 40 cm, bodem x = 20 cm en bovenopening 2x = 40 cm. De twee schuine wanden zijn even breed. Hoogte h is onbekend."
      },
      working: true,
      decimals: 2
    },
    {
      id: "l6-check-8",
      block: "l6-method",
      skill: "inzicht",
      type: "choice",
      prompt: "Je hebt voor d(E,AFH) een waarde in graden berekend. Welke conclusie is juist?",
      options: [
        {
          id: "zero",
          text: "Elke uitkomst in graden betekent dat de afstand 0 is."
        },
        {
          id: "length",
          text: "Er ontbreekt nog een stap: de gevraagde afstand moet een lengte zijn."
        },
        {
          id: "done",
          text: "De berekening is klaar, want afstand en hoek zijn hetzelfde."
        }
      ],
      answer: [
        "length"
      ],
      explanation: "Een hoek kan dienen om een hoogte uit te rekenen, maar d(E,AFH) moet worden uitgedrukt in een lengtemaat.",
      hint: "Controleer wat de opgave vraagt en welke eenheid daarbij hoort.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          7,
          7,
          7
        ],
        highlights: [],
        planes: [
          [
            "A",
            "F",
            "H"
          ]
        ],
        caption: "AB = 7 cm, AD = 7 cm en AE = 7 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    {
      id: "l7a-01",
      block: "l7a",
      skill: "inzicht",
      type: "choice",
      prompt: "In kubus ABCD.EFGH hebben alle ribben lengte 6 cm. Welke uitspraak over de volledige lijnen AE en BG is juist?",
      answer: [
        "k"
      ],
      explanation: "AE ligt bij x = 0, terwijl elk punt van BG x = 6 heeft: ze snijden niet. Hun richtingen verschillen, dus ze zijn niet evenwijdig. De lijnen kruisen.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus met ribben van 6 cm. Onderzoek AE en BG.",
        highlights: [
          "AE",
          "BG"
        ]
      },
      options: [
        {
          id: "s",
          text: "Ze snijden als je beide lijnstukken ver genoeg verlengt."
        },
        {
          id: "k",
          text: "Ze kruisen: ze zijn niet evenwijdig en hebben geen gemeenschappelijk punt."
        },
        {
          id: "e",
          text: "Ze zijn evenwijdig, omdat zijvlakken van een kubus evenwijdig zijn."
        },
        {
          id: "o",
          text: "Dat hangt af van de kijkrichting."
        }
      ]
    },
    {
      id: "l7a-02",
      block: "l7a",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een leerling meet in deze parallelprojectie de getekende hoek tussen AB en AD. Mag die gemeten hoek als werkelijke hoek worden gebruikt?",
      answer: [
        "n"
      ],
      explanation: "Een parallelprojectie bewaart evenwijdigheid en verhoudingen op \xE9\xE9n lijn, maar in het algemeen geen hoeken. Uit het feit dat de figuur een balk is, volgt AB \u27C2 AD; meten in de schets bewijst dat niet.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            4,
            0
          ],
          D: [
            0,
            4,
            0
          ],
          E: [
            0,
            0,
            5
          ],
          F: [
            6,
            0,
            5
          ],
          G: [
            6,
            4,
            5
          ],
          H: [
            0,
            4,
            5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Balk ABCD.EFGH, AB = 6 cm, AD = 4 cm en AE = 5 cm.",
        highlights: [
          "AB",
          "AD"
        ]
      },
      options: [
        {
          id: "j",
          text: "Ja, want parallelprojectie bewaart alle hoeken."
        },
        {
          id: "n",
          text: "Nee; de rechte hoek volgt uit de eigenschappen van een balk."
        },
        {
          id: "l",
          text: "Alleen als de leerling de langste ribbe als basis kiest."
        },
        {
          id: "d",
          text: "Nee, want AB en AD kruisen in de ruimte."
        }
      ]
    },
    {
      id: "l7a-03",
      block: "l7a",
      skill: "construeren",
      type: "choice",
      prompt: "P ligt op AE, Q op BF en R op CG. Je construeert de doorsnede door P, Q en R. Waarom mag je door P in vlak ADHE een lijn evenwijdig aan QR tekenen?",
      answer: [
        "v"
      ],
      explanation: "De zijvlakken ADHE en BCGF zijn evenwijdig. E\xE9n snijdend vlak maakt daarin evenwijdige snijlijnen. QR is de snijlijn in BCGF, dus de snijlijn door P in ADHE is daaraan evenwijdig.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ],
          P: [
            0,
            0,
            2
          ],
          Q: [
            6,
            0,
            4
          ],
          R: [
            6,
            6,
            5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus met AP = 2 cm, BQ = 4 cm en CR = 5 cm. Alleen gegeven punten en de bestaande verbinding QR.",
        highlights: [
          "QR"
        ]
      },
      options: [
        {
          id: "p",
          text: "Omdat P en Q beide op een verticale ribbe liggen."
        },
        {
          id: "v",
          text: "Omdat hetzelfde doorsnedevlak twee evenwijdige zijvlakken snijdt."
        },
        {
          id: "r",
          text: "Omdat alle lijnen door P evenwijdig zijn aan lijnen door Q."
        },
        {
          id: "t",
          text: "Omdat QR in de tekening schuin omhoog loopt."
        }
      ]
    },
    {
      id: "l7a-04",
      block: "l7a",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een rechte piramide heeft een rechthoekig grondvlak van 8 bij 6 cm en hoogte 12 cm. Een vlak evenwijdig aan het grondvlak ligt 9 cm boven het grondvlak. Bereken de oppervlakte van de doorsnede in cm\xB2, op \xE9\xE9n decimaal.",
      answer: [
        "3"
      ],
      explanation: "Vanaf de top is de afstand tot de doorsnede 3 cm. De lengteschaal is dus 3/12 = 1/4. Oppervlakten schalen met het kwadraat: 48 \xD7 (1/4)\xB2 = 3,0 cm\xB2.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            -4,
            -3,
            0
          ],
          B: [
            4,
            -3,
            0
          ],
          C: [
            4,
            3,
            0
          ],
          D: [
            -4,
            3,
            0
          ],
          T: [
            0,
            0,
            12
          ],
          P: [
            -1,
            -0.75,
            9
          ],
          Q: [
            1,
            -0.75,
            9
          ],
          R: [
            1,
            0.75,
            9
          ],
          S: [
            -1,
            0.75,
            9
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        showCube: false,
        caption: "Rechte piramide: grondvlak 8 \xD7 6 cm, hoogte 12 cm; doorsnede op hoogte 9 cm.",
        planes: [
          [
            "P",
            "Q",
            "R",
            "S"
          ]
        ],
        highlights: [
          "PQ",
          "QR",
          "RS",
          "SP"
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm\xB2",
      working: true
    },
    {
      id: "l7a-05",
      block: "l7a",
      skill: "rekenen",
      type: "numeric",
      prompt: "Bij tetra\xEBder ABCT staan AB, AC en AT in A onderling loodrecht. AB = 8 cm, AC = 6 cm en AT = 12 cm. Bereken de inhoud in cm\xB3, op \xE9\xE9n decimaal.",
      answer: [
        "96"
      ],
      explanation: "Driehoek ABC heeft oppervlakte \xBD \xD7 8 \xD7 6 = 24 cm\xB2. AT is loodrecht op het grondvlak en is dus de hoogte. De inhoud is \u2153 \xD7 24 \xD7 12 = 96,0 cm\xB3.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            0,
            6,
            0
          ],
          T: [
            0,
            0,
            12
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        caption: "Tetra\xEBder met drie onderling loodrechte ribben vanuit A: 8, 6 en 12 cm."
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm\xB3",
      working: true
    },
    {
      id: "l7a-06",
      block: "l7a",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een balk heeft afmetingen AB = 8 cm, AD = 6 cm en AE = 5 cm. Men verwijdert de tetra\xEBder APQE, waarbij AP = 4 cm en AQ = 3 cm en Q op AD ligt. Hoeveel inhoud blijft over? Geef cm\xB3 op \xE9\xE9n decimaal.",
      answer: [
        "230"
      ],
      explanation: "De balk heeft inhoud 240 cm\xB3. De weggehaalde tetra\xEBder heeft rechthoekige basis APQ met oppervlakte 6 cm\xB2 en hoogte 5 cm: inhoud \u2153 \xD7 6 \xD7 5 = 10 cm\xB3. Er blijft 230,0 cm\xB3 over.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            8,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            5
          ],
          F: [
            8,
            0,
            5
          ],
          G: [
            8,
            6,
            5
          ],
          H: [
            0,
            6,
            5
          ],
          P: [
            4,
            0,
            0
          ],
          Q: [
            0,
            3,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Balk 8 \xD7 6 \xD7 5 cm. Het hoekstuk APQE wordt verwijderd.",
        highlights: [
          "PQ",
          "PE",
          "QE"
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm\xB3",
      working: true
    },
    {
      id: "l7a-07",
      block: "l7a",
      skill: "rekenen",
      type: "numeric",
      prompt: "Bereken de kleinste hoek tussen de volledige lijnen AG en EF van een kubus. Geef het antwoord in graden, op \xE9\xE9n decimaal.",
      answer: [
        "54.7356103172"
      ],
      explanation: "EF is evenwijdig aan AB, dus de gevraagde hoek is de hoek tussen AG en AB. In de rechthoekige driehoek ABG zijn AB = 6 en AG = 6\u221A3. Daarom cos \u03B1 = 1/\u221A3 en \u03B1 \u2248 54,7\xB0.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus met ribben van 6 cm. Gevraagd is de hoek tussen AG en EF.",
        highlights: [
          "AG",
          "EF"
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "\xB0",
      working: true
    },
    {
      id: "l7a-08",
      block: "l7a",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een balk heeft AB = 6 cm, AD = 8 cm en AE = 10 cm. Bereken de hoek tussen AG en vlak ABCD in graden, op \xE9\xE9n decimaal.",
      answer: [
        "45"
      ],
      explanation: "G projecteert loodrecht op C. De gezochte hoek is GAC. AC = \u221A(6\xB2 + 8\xB2) = 10 en CG = 10. Dus tan \u03B1 = 10/10 = 1 en \u03B1 = 45,0\xB0.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            8,
            0
          ],
          D: [
            0,
            8,
            0
          ],
          E: [
            0,
            0,
            10
          ],
          F: [
            6,
            0,
            10
          ],
          G: [
            6,
            8,
            10
          ],
          H: [
            0,
            8,
            10
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Balk 6 \xD7 8 \xD7 10 cm. Gevraagd is de hoek van AG met het grondvlak.",
        highlights: [
          "AG"
        ],
        planes: [
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "\xB0",
      working: true
    },
    {
      id: "l7a-09",
      block: "l7a",
      skill: "rekenen",
      type: "numeric",
      prompt: "Dezelfde balk heeft AB = 6 cm, AD = 8 cm en AE = 10 cm. Bereken de kleinste hoek tussen de vlakken ABG en ABCD in graden, op \xE9\xE9n decimaal.",
      answer: [
        "51.3401917459"
      ],
      explanation: "De snijlijn is AB. Zijvlak BCGF staat loodrecht op AB en is een standvlak. De gevraagde hoek is GBC: BG ligt in ABG en BC ligt in ABCD. Tan \u03B1 = CG/BC = 10/8, dus \u03B1 \u2248 51,3\xB0.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            8,
            0
          ],
          D: [
            0,
            8,
            0
          ],
          E: [
            0,
            0,
            10
          ],
          F: [
            6,
            0,
            10
          ],
          G: [
            6,
            8,
            10
          ],
          H: [
            0,
            8,
            10
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Balk 6 \xD7 8 \xD7 10 cm. De twee bedoelde vlakken zijn ABG en ABCD.",
        planes: [
          [
            "A",
            "B",
            "G"
          ],
          [
            "A",
            "B",
            "C",
            "D"
          ]
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "\xB0",
      working: true
    },
    {
      id: "l7a-10",
      block: "l7a",
      skill: "rekenen",
      type: "numeric",
      prompt: "In een balk is AB = 6 cm en AD = 8 cm. Bereken de afstand van punt B tot de volledige lijn AC in cm, op \xE9\xE9n decimaal.",
      answer: [
        "4.8"
      ],
      explanation: "In driehoek ABC is AC = 10 cm. De oppervlakte is \xBD \xD7 6 \xD7 8 = 24 cm\xB2. Met AC als basis geldt 24 = \xBD \xD7 10 \xD7 d, dus d = 4,8 cm.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            8,
            0
          ],
          D: [
            0,
            8,
            0
          ],
          E: [
            0,
            0,
            10
          ],
          F: [
            6,
            0,
            10
          ],
          G: [
            6,
            8,
            10
          ],
          H: [
            0,
            8,
            10
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Balk met AB = 6 cm en AD = 8 cm. B en de lijn AC bepalen de gevraagde afstand.",
        highlights: [
          "AC"
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm",
      working: true,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            8,
            0
          ],
          D: [
            0,
            8,
            0
          ],
          E: [
            0,
            0,
            10
          ],
          F: [
            6,
            0,
            10
          ],
          G: [
            6,
            8,
            10
          ],
          H: [
            0,
            8,
            10
          ],
          P: [
            2.16,
            2.88,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "P is de loodvoet van B op AC. BP staat loodrecht op AC.",
        highlights: [
          "AC",
          "BP"
        ]
      }
    },
    {
      id: "l7a-11",
      block: "l7a",
      skill: "rekenen",
      type: "numeric",
      prompt: "Bij tetra\xEBder ABCT staan AB, AC en AT in A onderling loodrecht; hun lengtes zijn 8, 6 en 12 cm. Bereken de afstand van A tot vlak BCT in cm, op \xE9\xE9n decimaal.",
      answer: [
        "4.45668811625"
      ],
      explanation: "De inhoud is 96 cm\xB3. Neem M als loodvoet van A op BC. Dan BC = 10 en AM = 4,8. Omdat AT loodrecht op het grondvlak staat, is TM = \u221A(12\xB2 + 4,8\xB2). BCT heeft oppervlakte \xBD \xD7 10 \xD7 TM. Met BCT als grondvlak geldt d = 3 \xD7 96 / opp(BCT) \u2248 4,5 cm.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            8,
            0,
            0
          ],
          C: [
            0,
            6,
            0
          ],
          T: [
            0,
            0,
            12
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        caption: "Tetra\xEBder met AB = 8, AC = 6 en AT = 12 cm. Gezocht: afstand van A tot BCT.",
        planes: [
          [
            "B",
            "C",
            "T"
          ]
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm",
      working: true
    },
    {
      id: "l7a-12",
      block: "l7a",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een kubus heeft ribben van 6 cm. Bereken de afstand tussen de volledige lijnen AC en BH in cm, op \xE9\xE9n decimaal.",
      answer: [
        "2.44948974278"
      ],
      explanation: "Neem het verticale diagonaalvlak DBFH: dit staat loodrecht op AC. M = AC \u2229 BD is het middelpunt van het grondvlak. De loodlijn vanuit M op BH staat daardoor loodrecht op beide lijnen. In driehoek MBH is MB = 3\u221A2 en de hoogte vanuit H op MB gelijk aan 6. Dus opp(MBH) = 9\u221A2. BH = 6\u221A3, zodat d = 2 \xD7 9\u221A2/(6\u221A3) = \u221A6 \u2248 2,4 cm.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus met ribben van 6 cm. Gezocht: afstand tussen AC en BH.",
        highlights: [
          "AC",
          "BH"
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm",
      working: true
    },
    {
      id: "l7a-13",
      block: "l7a",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Je zoekt de afstand tussen de kruisende lijnen AC en BH. Welke aanpak is geldig?",
      answer: [
        "v"
      ],
      explanation: "Een vlak door BH dat evenwijdig is aan AC heeft overal dezelfde afstand tot AC. In dat vlak kan een evenwijdige verschuiving in de richting van AC het voetpunt op BH brengen. Daarom is de loodrechte punt-vlakafstand gelijk aan de afstand van de kruisende lijnen.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Kubus. De gevraagde afstand hoort bij AC en BH.",
        highlights: [
          "AC",
          "BH"
        ]
      },
      options: [
        {
          id: "a",
          text: "Meet de afstand tussen het midden van AC en het midden van BH; middelpunten zijn altijd het dichtst bij elkaar."
        },
        {
          id: "v",
          text: "Neem een vlak door BH dat evenwijdig is aan AC en bereken de loodrechte afstand van A tot dat vlak."
        },
        {
          id: "b",
          text: "Verschuif BH evenwijdig totdat BH de lijn AC snijdt; de afstand verandert dan niet."
        },
        {
          id: "d",
          text: "Meet de afstand tussen de geprojecteerde lijnen in de tekening."
        }
      ]
    },
    {
      id: "l7a-14",
      block: "l7a",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een plaat van 60 cm breed en 40 cm lang wordt tot een symmetrische open goot gevouwen. De bodem is 12 cm breed, de opening bovenaan is twee keer zo breed als de bodem. Langs de lengte verandert de dwarsdoorsnede niet. Bereken de inhoud van de goot in cm\xB3, op \xE9\xE9n decimaal.",
      answer: [
        "16731.2880556"
      ],
      explanation: "Elke opstaande zijkant is (60 \u2212 12)/2 = 24 cm breed. De horizontale uitwijking is (24 \u2212 12)/2 = 6 cm. De hoogte is \u221A(24\xB2 \u2212 6\xB2) = \u221A540. De trapeziumoppervlakte is \xBD(12 + 24)\u221A540 = 18\u221A540. De inhoud is 40 \xD7 18\u221A540 \u2248 16731,3 cm\xB3.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            12,
            0,
            0
          ],
          C: [
            18,
            0,
            23.2379000772445
          ],
          D: [
            -6,
            0,
            23.2379000772445
          ],
          E: [
            0,
            40,
            0
          ],
          F: [
            12,
            40,
            0
          ],
          G: [
            18,
            40,
            23.2379000772445
          ],
          H: [
            -6,
            40,
            23.2379000772445
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Open goot: plaatbreedte 60 cm, lengte 40 cm, bodem 12 cm en opening 24 cm. De bovenste verbindingen begrenzen de opening."
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm\xB3",
      working: true
    },
    {
      id: "l7b-01",
      block: "l7b",
      skill: "inzicht",
      type: "choice",
      prompt: "Een recht driehoekig prisma is ABC.DEF, met AD, BE en CF als opstaande ribben. Welke uitspraak over de volledige lijnen AB en CF is juist?",
      answer: [
        "k"
      ],
      explanation: "AB ligt in het grondvlak. CF snijdt dat grondvlak alleen in C, en C ligt niet op AB. De lijnen snijden dus niet; hun richtingen verschillen. Het zijn kruisende lijnen.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          D: [
            0,
            0,
            5
          ],
          E: [
            6,
            0,
            5
          ],
          F: [
            0,
            8,
            5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ],
        showCube: false,
        caption: "Recht driehoekig prisma met AB = 6, AC = 8 en AD = 5 cm. AB \u27C2 AC.",
        highlights: [
          "AB",
          "CF"
        ]
      },
      options: [
        {
          id: "s",
          text: "Ze snijden buiten het prisma."
        },
        {
          id: "e",
          text: "Ze zijn evenwijdig omdat het een prisma is."
        },
        {
          id: "k",
          text: "Ze kruisen: geen gemeenschappelijk punt en verschillende richtingen."
        },
        {
          id: "o",
          text: "Ze staan in elk aanzicht loodrecht op elkaar, dus ze snijden."
        }
      ]
    },
    {
      id: "l7b-02",
      block: "l7b",
      skill: "onderbouwen",
      type: "choice",
      prompt: "P is het midden van ruimtediagonaal AG van een kubus. Welke eigenschap blijft zeker geldig in een niet-ontaarde parallelprojectie van AG?",
      answer: [
        "m"
      ],
      explanation: "Een parallelprojectie bewaart verhoudingen van lijnstukken op dezelfde lijn. Het beeld van P deelt daarom het beeld van AG in twee gelijke stukken. De werkelijke lengte en hoek hoeven niet bewaard te blijven.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ],
          P: [
            3,
            3,
            3
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "P is het midden van AG. De figuur is een parallelprojectie.",
        highlights: [
          "AG"
        ]
      },
      options: [
        {
          id: "l",
          text: "Het getekende AG heeft dezelfde lengte als het werkelijke AG."
        },
        {
          id: "h",
          text: "Elke hoek met AG behoudt zijn grootte."
        },
        {
          id: "m",
          text: "Het getekende P is het midden van het getekende AG."
        },
        {
          id: "r",
          text: "AG blijft loodrecht op elke ribbe die AG kruist."
        }
      ]
    },
    {
      id: "l7b-03",
      block: "l7b",
      skill: "construeren",
      type: "choice",
      prompt: "In piramide ABCDT liggen P, Q en R op respectievelijk TA, TB en TC. Er is vastgesteld dat PQ \u2225 AB en QR \u2225 BC. Welke conclusie volgt over het vlak PQR?",
      answer: [
        "p"
      ],
      explanation: "PQ en QR zijn twee snijdende lijnen in vlak PQR. Ze zijn evenwijdig aan de snijdende lijnen AB en BC in het grondvlak. Daarmee zijn de vlakken PQR en ABCD evenwijdig. E\xE9n evenwijdig lijnenpaar alleen zou niet voldoende zijn.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            -4,
            -4,
            0
          ],
          B: [
            4,
            -4,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            -4,
            4,
            0
          ],
          T: [
            0,
            0,
            8
          ],
          P: [
            -2,
            -2,
            4
          ],
          Q: [
            2,
            -2,
            4
          ],
          R: [
            2,
            2,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        showCube: false,
        caption: "Vierzijdige piramide. PQ \u2225 AB en QR \u2225 BC zijn vastgesteld.",
        highlights: [
          "PQ",
          "QR"
        ]
      },
      options: [
        {
          id: "e",
          text: "De doorsnede moet een driehoek zijn, omdat drie punten gegeven zijn."
        },
        {
          id: "p",
          text: "Vlak PQR is evenwijdig aan het grondvlak ABCD."
        },
        {
          id: "l",
          text: "Vlak PQR staat loodrecht op het grondvlak."
        },
        {
          id: "n",
          text: "Alleen PQ is bruikbaar; de richting van QR zegt niets over het vlak."
        }
      ]
    },
    {
      id: "l7b-04",
      block: "l7b",
      skill: "rekenen",
      type: "numeric",
      prompt: "In tetra\xEBder ABCT is ABC een rechthoekige driehoek met AB = 6 cm en AC = 8 cm. P ligt op TA met TP : PA = 2 : 1. Een vlak door P evenwijdig aan ABC snijdt de tetra\xEBder. Bereken de oppervlakte van deze doorsnede in cm\xB2, op \xE9\xE9n decimaal.",
      answer: [
        "10.6666666667"
      ],
      explanation: "Vanaf de top is TP/TA = 2/3. De oppervlakte van ABC is 24 cm\xB2. De doorsnede heeft oppervlakte 24 \xD7 (2/3)\xB2 = 32/3 \u2248 10,7 cm\xB2.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          T: [
            0,
            0,
            12
          ],
          P: [
            0,
            0,
            4
          ],
          Q: [
            4,
            0,
            4
          ],
          R: [
            0,
            5.333333333333333,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        caption: "Tetra\xEBder: AB \u27C2 AC, AB = 6 cm, AC = 8 cm, TP : PA = 2 : 1.",
        planes: [
          [
            "P",
            "Q",
            "R"
          ]
        ],
        highlights: [
          "PQ",
          "QR",
          "RP"
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm\xB2",
      working: true
    },
    {
      id: "l7b-05",
      block: "l7b",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een recht prisma ABC.DEF heeft een rechthoekige grondvlakdriehoek ABC met AB = 6 cm en AC = 8 cm. AD = 10 cm. Men verwijdert tetra\xEBder ABCP, met P op AD en AP = 4 cm. Bereken de overblijvende inhoud in cm\xB3, op \xE9\xE9n decimaal.",
      answer: [
        "208"
      ],
      explanation: "De grondvlakoppervlakte is 24 cm\xB2. Het hele prisma heeft inhoud 24 \xD7 10 = 240 cm\xB3. De verwijderde tetra\xEBder heeft inhoud \u2153 \xD7 24 \xD7 4 = 32 cm\xB3. Er blijft 208,0 cm\xB3 over.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          D: [
            0,
            0,
            10
          ],
          E: [
            6,
            0,
            10
          ],
          F: [
            0,
            8,
            10
          ],
          P: [
            0,
            0,
            4
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ],
        showCube: false,
        caption: "Recht driehoekig prisma: AB \u27C2 AC, AB = 6, AC = 8 en AD = 10 cm; AP = 4 cm.",
        highlights: [
          "BP",
          "CP"
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm\xB3",
      working: true
    },
    {
      id: "l7b-06",
      block: "l7b",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een rechte piramide heeft een vierkant grondvlak met zijde 8 cm en hoogte 9 cm. Een vlak op 3 cm boven het grondvlak, evenwijdig aan dat grondvlak, snijdt de top eraf. Bereken de inhoud van het onderste stuk in cm\xB3, op \xE9\xE9n decimaal.",
      answer: [
        "135.111111111"
      ],
      explanation: "De hele piramide heeft inhoud \u2153 \xD7 64 \xD7 9 = 192 cm\xB3. De bovenste piramide heeft hoogte 6 cm en lengteschaal 2/3. Inhouden schalen met de derde macht: de top heeft inhoud 192 \xD7 (2/3)\xB3. Onder blijft 192 \xD7 (1 \u2212 8/27) \u2248 135,1 cm\xB3.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            -4,
            -4,
            0
          ],
          B: [
            4,
            -4,
            0
          ],
          C: [
            4,
            4,
            0
          ],
          D: [
            -4,
            4,
            0
          ],
          T: [
            0,
            0,
            9
          ],
          P: [
            -2.6666666666666665,
            -2.6666666666666665,
            3
          ],
          Q: [
            2.6666666666666665,
            -2.6666666666666665,
            3
          ],
          R: [
            2.6666666666666665,
            2.6666666666666665,
            3
          ],
          S: [
            -2.6666666666666665,
            2.6666666666666665,
            3
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        showCube: false,
        caption: "Vierkante piramide: grondzijde 8 cm, hoogte 9 cm; snijvlak 3 cm boven het grondvlak.",
        planes: [
          [
            "P",
            "Q",
            "R",
            "S"
          ]
        ],
        highlights: [
          "PQ",
          "QR",
          "RS",
          "SP"
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm\xB3",
      working: true
    },
    {
      id: "l7b-07",
      block: "l7b",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een rechte piramide heeft een rechthoekig grondvlak van 10 bij 6 cm. De top T ligt 6 cm loodrecht boven het middelpunt van ABCD. Bereken hoek ATB in graden, op \xE9\xE9n decimaal.",
      answer: [
        "73.398450401"
      ],
      explanation: "De afstand van het grondvlakmiddelpunt tot A en B is \u221A(5\xB2 + 3\xB2) = \u221A34. Dus TA = TB = \u221A(34 + 36) = \u221A70. In driehoek ATB geldt cos \u2220ATB = (70 + 70 \u2212 100)/(2 \xD7 70) = 2/7. De hoek is ongeveer 73,4\xB0.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            10,
            0,
            0
          ],
          C: [
            10,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          T: [
            5,
            3,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        showCube: false,
        caption: "Rechte piramide: AB = 10 cm, AD = 6 cm en hoogte 6 cm. Gevraagd is hoek ATB.",
        highlights: [
          "AT",
          "BT"
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "\xB0",
      working: true
    },
    {
      id: "l7b-08",
      block: "l7b",
      skill: "rekenen",
      type: "numeric",
      prompt: "In een recht driehoekig prisma ABC.DEF is AB \u27C2 AC, AB = 6 cm, AC = 8 cm en AD = 5 cm. Bereken de hoek tussen BF en vlak ABED in graden, op \xE9\xE9n decimaal.",
      answer: [
        "45.687615376"
      ],
      explanation: "F projecteert loodrecht op D in vlak ABED; FD = 8 cm. De projectie van BF is BD met lengte \u221A(6\xB2 + 5\xB2) = \u221A61. Daarom tan \u03B1 = 8/\u221A61 en \u03B1 \u2248 45,7\xB0.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          D: [
            0,
            0,
            5
          ],
          E: [
            6,
            0,
            5
          ],
          F: [
            0,
            8,
            5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "DE",
          "EF",
          "FD",
          "AD",
          "BE",
          "CF"
        ],
        showCube: false,
        caption: "Recht driehoekig prisma: AB = 6, AC = 8 en AD = 5 cm. Gezocht: hoek van BF met ABED.",
        highlights: [
          "BF"
        ],
        planes: [
          [
            "A",
            "B",
            "E",
            "D"
          ]
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "\xB0",
      working: true
    },
    {
      id: "l7b-09",
      block: "l7b",
      skill: "rekenen",
      type: "numeric",
      prompt: "In tetra\xEBder ABCT staan AB, AC en AT in A onderling loodrecht. AB = 6 cm, AC = 8 cm en AT = 6 cm. Bereken de kleinste hoek tussen BCT en ABC in graden, op \xE9\xE9n decimaal.",
      answer: [
        "51.3401917459"
      ],
      explanation: "Noem de loodvoet van A op BC het punt M. BC = 10 en AM = 6 \xD7 8/10 = 4,8. AT \u27C2 ABC; bovendien zijn AM en TM loodrecht op BC. Vlak ATM is dus een standvlak en de gezochte hoek is TMA. Tan \u03B1 = 6/4,8 = 1,25, dus \u03B1 \u2248 51,3\xB0.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          T: [
            0,
            0,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        caption: "Tetra\xEBder met drie onderling loodrechte ribben vanuit A: 6, 8 en 6 cm.",
        planes: [
          [
            "B",
            "C",
            "T"
          ],
          [
            "A",
            "B",
            "C"
          ]
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "\xB0",
      working: true
    },
    {
      id: "l7b-10",
      block: "l7b",
      skill: "rekenen",
      type: "numeric",
      prompt: "In tetra\xEBder ABCT staan AB, AC en AT in A onderling loodrecht, met AB = 6 cm, AC = 8 cm en AT = 6 cm. Bereken de afstand van C tot de volledige lijn BT in cm, op \xE9\xE9n decimaal.",
      answer: [
        "9.05538513814"
      ],
      explanation: "BC = CT = 10 cm, dus driehoek BCT is gelijkbenig. De loodvoet vanuit C ligt in het midden van BT. BT = 6\u221A2, dus d = \u221A(10\xB2 \u2212 (3\u221A2)\xB2) = \u221A82 \u2248 9,1 cm.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          T: [
            0,
            0,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        caption: "Tetra\xEBder: AB = AT = 6 cm, AC = 8 cm. Gezocht: afstand van C tot BT.",
        highlights: [
          "BT"
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm",
      working: true,
      revealScene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          T: [
            0,
            0,
            6
          ],
          P: [
            3,
            0,
            3
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        caption: "P is de loodvoet van C op BT. CP \u27C2 BT.",
        highlights: [
          "BT",
          "CP"
        ]
      }
    },
    {
      id: "l7b-11",
      block: "l7b",
      skill: "rekenen",
      type: "numeric",
      prompt: "In dezelfde tetra\xEBder ABCT staan AB, AC en AT onderling loodrecht in A. AB = 6 cm, AC = 8 cm en AT = 6 cm. Bereken de afstand van A tot vlak BCT in cm, op \xE9\xE9n decimaal.",
      answer: [
        "3.74817028533"
      ],
      explanation: "De inhoud is \u2153 \xD7 (\xBD \xD7 6 \xD7 8) \xD7 6 = 48 cm\xB3. Driehoek BCT heeft basis BT = 6\u221A2 en hoogte \u221A82, dus oppervlakte 6\u221A41. Nu is 48 = \u2153 \xD7 6\u221A41 \xD7 d. Dit geeft d = 24/\u221A41 \u2248 3,7 cm.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          T: [
            0,
            0,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        caption: "Tetra\xEBder: AB = AT = 6 cm en AC = 8 cm. Gezocht: afstand van A tot vlak BCT.",
        planes: [
          [
            "B",
            "C",
            "T"
          ]
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm",
      working: true
    },
    {
      id: "l7b-12",
      block: "l7b",
      skill: "rekenen",
      type: "numeric",
      prompt: "In tetra\xEBder ABCT staan AB, AC en AT in A onderling loodrecht; AB = 6 cm, AC = 8 cm en AT = 6 cm. Bereken de afstand tussen de volledige lijnen AB en CT in cm, op \xE9\xE9n decimaal.",
      answer: [
        "4.8"
      ],
      explanation: "Vlak ACT staat loodrecht op AB. De loodlijn vanuit A op CT ligt in ACT en staat daardoor ook loodrecht op AB. In de rechthoekige driehoek ACT is CT = 10 cm en de oppervlakte 24 cm\xB2. De hoogte op CT is 2 \xD7 24/10 = 4,8 cm.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          T: [
            0,
            0,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        caption: "Tetra\xEBder: AB = 6, AC = 8 en AT = 6 cm. Gezocht: afstand tussen AB en CT.",
        highlights: [
          "AB",
          "CT"
        ]
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "cm",
      working: true
    },
    {
      id: "l7b-13",
      block: "l7b",
      skill: "onderbouwen",
      type: "choice",
      prompt: "Een student verschuift de kruisende lijn CT evenwijdig totdat deze AB snijdt en gebruikt de nieuwe figuur. Welke bewering is juist?",
      answer: [
        "h"
      ],
      explanation: "Een evenwijdige verschuiving bewaart de richting en daarmee de hoek met AB. De onderlinge afstand kan juist veranderen; na verschuiven tot een snijpunt is die afstand nul. Voor een afstandsvraag moet je een gemeenschappelijke loodlijn of een passend parallelvlak gebruiken.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            0,
            8,
            0
          ],
          T: [
            0,
            0,
            6
          ]
        },
        edges: [
          "AB",
          "BC",
          "CA",
          "AT",
          "BT",
          "CT"
        ],
        showCube: false,
        caption: "Tetra\xEBder. De volledige lijnen AB en CT kruisen.",
        highlights: [
          "AB",
          "CT"
        ]
      },
      options: [
        {
          id: "b",
          text: "Zowel de hoek als de afstand tussen de lijnen blijven altijd gelijk."
        },
        {
          id: "h",
          text: "De hoek tussen de lijnen blijft gelijk; de afstand hoeft niet gelijk te blijven."
        },
        {
          id: "a",
          text: "De afstand blijft gelijk; de hoek verandert."
        },
        {
          id: "g",
          text: "De oorspronkelijke lijnen blijken dus toch snijdend te zijn."
        }
      ]
    },
    {
      id: "l7b-14",
      block: "l7b",
      skill: "rekenen",
      type: "numeric",
      prompt: "Een open watertank heeft de vorm van een omgekeerde rechte vierkante piramide. De punt is onderaan. De totale hoogte is 9 dm en de bovenzijde is een vierkant van 12 bij 12 dm. Tot welke hoogte vanaf de punt moet het water komen zodat de tank voor de helft van zijn inhoud is gevuld? Geef dm op \xE9\xE9n decimaal.",
      answer: [
        "7.14330473386"
      ],
      explanation: "Het gevulde deel is gelijkvormig aan de hele piramide. Bij waterhoogte h is de lengteschaal h/9 en de inhoudsverhouding (h/9)\xB3. Dus (h/9)\xB3 = \xBD, zodat h = 9 \xD7 \u221B(\xBD) \u2248 7,1 dm. Halve inhoud betekent niet halve hoogte.",
      hint: "Bepaal eerst welke gegevens en eigenschappen je uit de ruimtelijke figuur kunt afleiden.",
      scene: {
        points: {
          T: [
            0,
            0,
            0
          ],
          A: [
            -6,
            -6,
            9
          ],
          B: [
            6,
            -6,
            9
          ],
          C: [
            6,
            6,
            9
          ],
          D: [
            -6,
            6,
            9
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        showCube: false,
        caption: "Omgekeerde vierkante piramide: totale hoogte 9 dm, bovenzijde 12 \xD7 12 dm."
      },
      tolerance: 0.02,
      decimals: 1,
      unit: "dm",
      working: true
    }
  ],
  checks: {
    "2": [
      "l2-hulpvlak-check-1",
      "l2-hulpvlak-check-2",
      "l2-doorsnede-check-3",
      "l2-doorsnede-check-4",
      "l2-buiten-check-5",
      "l2-buiten-check-6",
      "l2-gelijkvormig-check-7",
      "l2-gelijkvormig-check-8"
    ],
    "3": [
      "l3-ruimtefiguren-check-1",
      "l3-ruimtefiguren-check-2",
      "l3-ruimtefiguren-check-3",
      "l3-oppervlakte-check-4",
      "l3-inhoud-check-5",
      "l3-inhoud-check-6",
      "l3-goniometrie-check-7",
      "l3-goniometrie-check-8"
    ],
    "4": [
      "l4-check-1",
      "l4-check-2",
      "l4-check-3",
      "l4-check-4",
      "l4-check-5",
      "l4-check-6",
      "l4-check-7",
      "l4-check-8"
    ],
    "5": [
      "l5-check-1",
      "l5-check-2",
      "l5-check-3",
      "l5-check-4",
      "l5-check-5",
      "l5-check-6",
      "l5-check-7",
      "l5-check-8"
    ],
    "6": [
      "l6-check-1",
      "l6-check-2",
      "l6-check-3",
      "l6-check-4",
      "l6-check-5",
      "l6-check-6",
      "l6-check-7",
      "l6-check-8"
    ],
    "7a": [
      "l7a-01",
      "l7a-02",
      "l7a-03",
      "l7a-04",
      "l7a-05",
      "l7a-06",
      "l7a-07",
      "l7a-08",
      "l7a-09",
      "l7a-10",
      "l7a-11",
      "l7a-12",
      "l7a-13",
      "l7a-14"
    ],
    "7b": [
      "l7b-01",
      "l7b-02",
      "l7b-03",
      "l7b-04",
      "l7b-05",
      "l7b-06",
      "l7b-07",
      "l7b-08",
      "l7b-09",
      "l7b-10",
      "l7b-11",
      "l7b-12",
      "l7b-13",
      "l7b-14"
    ]
  },
  papers: {
    "2": {
      title: "Construeer een doorsnede en verantwoord je hulplijnen",
      prompt: "Teken een kubus ABCD.EFGH in parallelprojectie. De ribbe is 8 cm. Plaats P op AE met AP = 2 cm, Q op BF met BQ = 4 cm en R op CG met CR = 6 cm. Construeer de volledige doorsnede door P, Q en R met liniaal. Bereken ook de afstand DS van het vierde hoekpunt S tot D.",
      steps: [
        "Maak eerst zelf de kubustekening; geef onzichtbare ribben gestippeld weer.",
        "Plaats P, Q en R met de opgegeven verhoudingen op de getekende ribben.",
        "Construeer de volledige doorsnederand en laat de noodzakelijke hulplijnen staan. Schrijf bij elke stap een korte reden.",
        "Bereken DS en controleer of je uitkomst overeenkomt met de plaats van S op DH. Beoordeel pas daarna met het uitwerkingsmodel."
      ],
      rubric: [
        "De parallelprojectie en de plaatsing van de drie gegeven punten kloppen met de opgegeven ribbeverhoudingen.",
        "De constructie gebruikt punten in hetzelfde zijvlak en een terecht toegepaste evenwijdigheidsregel.",
        "De volledige rand is gesloten; randstukken en eventuele hulplijnen zijn herkenbaar en alle hoekpunten benoemd.",
        "De berekening en de schriftelijke redenen onderbouwen de plaats van S; eventuele correcties zijn verklaard."
      ],
      solution: [
        "Verbind P met Q in ABFE en Q met R in BCGF.",
        "BCGF \u2225 ADHE. Teken daarom door P een lijn evenwijdig aan QR en noem het snijpunt met DH S.",
        "Verbind S met R in DCGH. De gesloten doorsnederand is P\u2013Q\u2013R\u2013S\u2013P. PR is een diagonaal en geen randzijde.",
        "Van Q naar R is de hoogteverandering 6 \u2212 4 = 2 cm. PS heeft dezelfde richting over dezelfde diepte, dus DS = AP + 2 = 4 cm.",
        "Controleer als extra onderbouwing dat PQ \u2225 SR, omdat de voor- en achtervlakken evenwijdig zijn."
      ],
      scene: {
        caption: "P op AE: AP = \xBC AE. Q is het midden van BF. R op CG: CR = \xBE CG.",
        showCube: true,
        points: {
          P: [
            0,
            0,
            0.25
          ],
          Q: [
            1,
            0,
            0.5
          ],
          R: [
            1,
            1,
            0.75
          ]
        }
      }
    },
    "3": {
      title: "Piramideconstructie met snijpunten buiten de figuur",
      prompt: "Teken een vierkante piramide ABCD.T in parallelprojectie, met T recht boven het middelpunt van ABCD. Neem P op AT met AP = \xBC AT; Q en R zijn de middens van BT en CT. Construeer de doorsnede door P, Q en R. Gebruik waar nodig verlengde ribben en verantwoord waarom iedere stap geldig is.",
      steps: [
        "Teken de piramide en plaats de drie gegeven punten met de juiste verhoudingen.",
        "Teken eerst de randstukken die uit twee punten in hetzelfde zijvlak volgen.",
        "Construeer het vierde hoekpunt met een snijlijn in het grondvlak; laat buiten de figuur voldoende tekenruimte.",
        "Sluit de rand, benoem het vierde hoekpunt S en leg uit waarom de evenwijdigheidsregel voor overstaande kubusvlakken hier niet rechtstreeks bruikbaar is."
      ],
      rubric: [
        "P, Q en R staan correct op de piramideribben; zichtbare en onzichtbare lijnen zijn duidelijk.",
        "De buitenpunten worden met geldige verlengingen in gemeenschappelijke vlakken geconstrueerd.",
        "Het vierde hoekpunt wordt afgeleid uit de snijlijn van twee vlakken; de uiteindelijke rand is P\u2013Q\u2013R\u2013S\u2013P.",
        "De onderbouwing vermeldt waarom iedere gebruikte evenwijdigheid geldt en onderscheidt dit van een ongeldige aanname over piramidezijvlakken."
      ],
      solution: [
        "PQ ligt in zijvlak ABT en QR in BCT; teken beide. Omdat Q en R middelpunten zijn, is QR \u2225 BC en dus evenwijdig aan het grondvlak.",
        "Verleng PQ en AB tot X. Dit punt ligt buiten de piramide, voorbij A, en is gemeenschappelijk aan doorsnedevlak en grondvlak.",
        "Teken door X in het grondvlak een lijn evenwijdig aan QR. Deze ontmoet de verlengde CD in Y.",
        "R en Y liggen beide in CDT en in het doorsnedevlak. Teken daarom RY; het snijpunt met DT is S. Verbind S met P.",
        "De doorsnede is PQRS; DS = \xBC DT. De vlakken ABT en CDT zijn verschillende vlakken die T bevatten en zijn dus niet evenwijdig. Je mocht de rand door R niet zomaar evenwijdig aan PQ tekenen."
      ],
      scene: {
        caption: "Vierkante piramide; P op AT met AP = \xBC AT en Q, R midden op BT en CT.",
        showCube: false,
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            2,
            0,
            0
          ],
          C: [
            2,
            2,
            0
          ],
          D: [
            0,
            2,
            0
          ],
          T: [
            1,
            1,
            4
          ],
          P: [
            0.25,
            0.25,
            1
          ],
          Q: [
            1.5,
            0.5,
            2
          ],
          R: [
            1.5,
            1.5,
            2
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ]
      }
    },
    "4": {
      title: "Op papier: een standhoek zelf construeren",
      prompt: "Teken een kubus ABCD.EFGH met ribbe 6 cm in parallelprojectie. Neem J op BF met BJ = 2 cm. Construeer de standhoek tussen de vlakken EJG en ABFE, bewijs waarom jouw hoek geldig is en bereken hem in graden op twee decimalen. Voeg daarna toe hoe de hoek verandert als J naar F schuift. De schermschets is een ruimtelijke illustratie: construeer benodigde loodlijnen in een hulpfiguur op ware grootte.",
      steps: [
        "Teken de gegeven kubus, plaats J correct en bepaal de snijlijn van de twee vlakken.",
        "Teken driehoek EFJ op ware grootte. Construeer vanuit F de loodlijn op EJ en noem het voetpunt I. Breng I terug op EJ in je ruimtelijke tekening; teken daar niet zomaar een schermhoek van 90\xB0.",
        "Teken een geschikte standdriehoek op ware grootte. Noteer bij elke rechte hoek welke ruimtelijke eigenschap haar rechtvaardigt.",
        "Bereken de vlak\u2013vlakhoek en controleer of de uitkomst tussen 0\xB0 en 90\xB0 ligt. Onderbouw vervolgens de grenssituatie J \u2192 F."
      ],
      rubric: [
        "Snijlijn EJ correct gekozen; J ligt op BF met BJ = 2 en FJ = 4 cm.",
        "Voetpunt I met een echte loodrechte constructie in de hulpfiguur gevonden; FI en GI beide loodrecht op EJ onderbouwd.",
        "Rechthoekige standdriehoek FIG met juiste lengtes gebruikt; berekening leidt tot circa 60,98\xB0.",
        "Eigen uitleg onderscheidt de standhoek van een willekeurige hoek; bij J \u2192 F wordt de hoek 90\xB0."
      ],
      solution: [
        "E en J liggen in beide vlakken. Hun snijlijn is daarom EJ. In het voorvlak ABFE construeer je FI \u27C2 EJ.",
        "FG staat loodrecht op vlak ABFE en dus op de richtingen FI en EJ. Omdat EJ loodrecht staat op zowel FI als de richting FG, staat EJ loodrecht op vlak FIG. Daarom is ook GI \u27C2 EJ en is \u2220FIG een standhoek.",
        "EF = 6 en FJ = 4 geven EJ = \u221A52. De oppervlakte van EFJ is zowel \xBD \xD7 6 \xD7 4 als \xBD \xD7 EJ \xD7 FI. Dus FI = 24/\u221A52 cm.",
        "Driehoek FIG is recht bij F. tan \u2220FIG = FG/FI = 6/(24/\u221A52) = \u221A52/4. De kleinste hoek is 60,98\xB0.",
        "Als J naar F schuift, wordt vlak EJG het bovenvlak EFGH. Dat staat loodrecht op het voorvlak ABFE, dus de hoek wordt 90\xB0. In de tussenliggende constructies wordt FI steeds kleiner; de hoek nadert 90\xB0."
      ],
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ],
          J: [
            6,
            0,
            2
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Papieropgave: ribbe 6 cm; J op BF met BJ = 2 cm. Construeer de standhoek zelf.",
        view: "spatial",
        planes: [
          [
            "E",
            "J",
            "G"
          ],
          [
            "A",
            "B",
            "F",
            "E"
          ]
        ]
      }
    },
    "5": {
      title: "Op papier: een loodrechte afstand \xE9n een bakmodel",
      prompt: "Werk zonder hulp op papier. A: teken een kubus ABCD.EFGH met ribbe 6 cm in parallelprojectie. Construeer de loodrechte voet N van E op vlak AFH, nummer je hulplijnen en bereken EN. B: een open bak wordt uit een plaat van 60 cm bij 40 cm gevouwen. De bodem is x cm breed, de opening 2x. Teken de trapeziumdoorsnede, leid h(x) en V(x) af en bepaal het domein voor een echte bak.",
      steps: [
        "Teken bij A het hulpvlak ACGE; benoem I als het midden van FH.",
        "Maak driehoek AEI daarnaast op ware grootte en construeer uit E de loodlijn op AI. Breng de voet N met de verhouding AN:NI terug in de ruimtelijke tekening.",
        "Bewijs waarom deze loodlijn ook loodrecht op vlak AFH staat en bereken EN.",
        "Teken bij B \xE9\xE9n rechthoekige driehoek in de trapeziumdoorsnede en stel vervolgens de hoogte- en inhoudsformule op."
      ],
      rubric: [
        "Hulpvlak en voet zijn correct geconstrueerd; hulplijnen en nieuwe punten zijn benoemd.",
        "De loodrechte stand op het doelvlak is meetkundig onderbouwd, niet op het beeld geschat.",
        "De lengteberekening gebruikt juiste exacte tussenwaarden en eindigt met een lengte-eenheid.",
        "De bakformules volgen uit de figuur en bevatten een juist fysisch domein."
      ],
      solution: [
        "A: FH \u27C2 ACGE; I is het midden van FH en ligt ook op EG. AI is de snijlijn van AFH met ACGE.",
        "AE = 6, EI = 3\u221A2, AI = 3\u221A6. De hoogte EN is AE\xD7EI/AI = 2\u221A3 \u2248 3,46 cm. AN/AI = AE\xB2/AI\xB2 = 2/3; dus AN:NI = 2:1.",
        "EN \u27C2 AI. Bovendien EN ligt in ACGE en staat daarom loodrecht op de richting FH. Daarmee staat EN loodrecht op twee richtingen van AFH en dus op AFH.",
        "B: wandlengte (60\u2212x)/2, horizontale uitwijking x/2. h(x) = \u221A(900\u221230x) cm.",
        "V(x) = 40\xD7\xBD(x+2x)\xD7h = 60x\u221A(900\u221230x) cm\xB3. Voor positieve bodem en hoogte geldt 0 < x < 30."
      ],
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [],
        planes: [
          [
            "A",
            "F",
            "H"
          ]
        ],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    "6": {
      title: "Op papier: kruisende lijnen zelfstandig onderzoeken",
      prompt: "Teken kubus ABCD.EFGH met ribbe 6 cm in parallelprojectie. Construeer de gemeenschappelijke loodlijn van AC en BH en bereken haar lengte. Beschrijf daarnaast hoe je hetzelfde probleem met de parallelvlakmethode kunt omzetten naar een punt-vlakafstand. Nummer alle constructiestappen.",
      steps: [
        "Bepaal de onderlinge ligging van AC en BH en motiveer die.",
        "Kies een passend hulpvlak en maak de nodige driehoek op ware grootte.",
        "Construeer de gemeenschappelijke loodlijn en breng haar voet terug in de kubustekening.",
        "Bereken de lengte en leg uit waarom een willekeurig gekozen punt op AC niet zonder meer hetzelfde resultaat geeft."
      ],
      rubric: [
        "Kruisende ligging wordt ruimtelijk onderbouwd, onafhankelijk van een toevallige projectie.",
        "Het hulpvlak en de twee voetpunten zijn geldig geconstrueerd en herkenbaar benoemd.",
        "Loodrechte stand op beide lijnrichtingen is aangetoond.",
        "Berekening en parallelvlakreductie zijn correct; de voorwaarden van die reductie zijn genoemd."
      ],
      solution: [
        "AC en BH zijn niet evenwijdig. BH ontmoet ABCD alleen in B, en B ligt niet op AC; ze snijden dus niet.",
        "Neem O als het midden van AC. In de kubus is AC loodrecht op BD en op de verticale richting, dus op vlak BDHF.",
        "Construeer in de ware-groottefiguur OBH de loodlijn ON op BH. BH = 6\u221A3. Opp(OBH) = 9\u221A2. Dus ON = 18\u221A2/(6\u221A3) = \u221A6 \u2248 2,45 cm.",
        "De voet N ligt op BH met BN:NH = 1:2. Breng deze verhouding terug op BH in de parallelprojectie. ON ligt in BDHF en is daarom ook loodrecht op AC.",
        "Parallelvlakroute: construeer door A een lijn AT \u2225 BH en neem V door AT en AC. V bevat AC en is evenwijdig aan BH. Dan geldt d(AC,BH) = d(B,V)."
      ],
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            1,
            0,
            0
          ],
          C: [
            1,
            1,
            0
          ],
          D: [
            0,
            1,
            0
          ],
          E: [
            0,
            0,
            1
          ],
          F: [
            1,
            0,
            1
          ],
          G: [
            1,
            1,
            1
          ],
          H: [
            0,
            1,
            1
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: true,
        dimensions: [
          6,
          6,
          6
        ],
        highlights: [
          "AC",
          "BH"
        ],
        planes: [],
        caption: "AB = 6 cm, AD = 6 cm en AE = 6 cm. Alle ribben van de balk staan volgens de gebruikelijke bouw loodrecht op aangrenzende ribben."
      }
    },
    "7a": {
      title: "Examenwerkblad A \xB7 kubus en verantwoording",
      prompt: "Teken op papier een kubus ABCD.EFGH met ribben van 6 cm in parallelprojectie. Neem P op AE met AP = 2 cm, Q als midden van EH en R als midden van BC. Construeer de volledige doorsnede door P, Q en R. Nummer je constructielijnen en verklaar de twee gebruikte meetkundige principes. Bereken vervolgens de afstand tussen AC en BH in cm, op \xE9\xE9n decimaal.",
      steps: [
        "Maak eerst zelf een ruime tekening, met plaats buiten de kubus voor hulppunten.",
        "Construeer de doorsnede; benoem nieuwe punten en nummer de lijnen in de volgorde waarin je werkt.",
        "Schrijf waarom je hulppunten en evenwijdige lijnen bruikbaar zijn.",
        "Maak een aparte tekening voor de afstandsvraag en werk je berekening uit voordat je de uitwerking opent."
      ],
      rubric: [
        "De doorsnede is de zeshoek P\u2013X\u2013R\u2013S\u2013Y\u2013Q, met X op AB, S op CG en Y op GH; alle grenzen liggen in zijvlakken.",
        "Een correct hulppunt buiten de kubus en de snijlijn in het grondvlak zijn zichtbaar, met verklaarde gemeenschappelijke-vlakredenering.",
        "Evenwijdige snijlijnen zijn correct gebruikt en gemarkeerd; de constructievolgorde is navolgbaar zonder alleen op de vorm van de schets te vertrouwen.",
        "De afstand is via een gemeenschappelijke loodlijn bepaald en onderbouwd; d(AC,BH) = \u221A6 \u2248 2,4 cm."
      ],
      solution: [
        "Teken PQ. Verleng PQ en AD tot hun snijpunt U buiten de kubus.",
        "Teken UR en noem X het snijpunt met AB.",
        "Trek door R een evenwijdige aan PQ; die snijdt CG in S.",
        "Trek door Q een evenwijdige aan UR; die snijdt GH in Y.",
        "Teken de zes grenslijnstukken PX, XR, RS, SY, YQ en QP.",
        "Voor de afstand: M = AC \u2229 BD. Vlak DBFH staat loodrecht op AC. De hoogte vanuit M op BH is daarom de gemeenschappelijke loodlijn.",
        "MB = 3\u221A2 en de hoogte vanuit H op MB is 6, zodat opp(MBH) = 9\u221A2. BH = 6\u221A3. De afstand is 2 \xD7 9\u221A2/(6\u221A3) = \u221A6 \u2248 2,4 cm."
      ],
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            6,
            0
          ],
          D: [
            0,
            6,
            0
          ],
          E: [
            0,
            0,
            6
          ],
          F: [
            6,
            0,
            6
          ],
          G: [
            6,
            6,
            6
          ],
          H: [
            0,
            6,
            6
          ],
          P: [
            0,
            0,
            2
          ],
          Q: [
            0,
            3,
            6
          ],
          R: [
            6,
            3,
            0
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "EF",
          "FG",
          "GH",
          "HE",
          "AE",
          "BF",
          "CG",
          "DH"
        ],
        showCube: false,
        caption: "Papieren werkblad A: kubus met ribben 6 cm; AP = 2 cm; Q en R zijn middens."
      }
    },
    "7b": {
      title: "Examenwerkblad B \xB7 scheve piramide en transfer",
      prompt: "Teken op papier de scheve piramide ABCDT. Het rechthoekige grondvlak heeft AB = 6 cm en AD = 8 cm. De loodrechte hoogte is 9 cm; de loodvoet van T ligt in het grondvlak op 1 cm van AD en 2 cm van AB. P, Q en R zijn de middens van AB, BC en DT. Construeer de volledige doorsnede door P, Q en R, met genummerde hulplijnen en argumenten. Bereken daarna de inhoud van de hele piramide in cm\xB3 en leg uit waarom de lengte van een schuine opstaande ribbe niet de hoogte in de inhoudsformule is.",
      steps: [
        "Maak zelf een ruime parallelprojectie en geef P, Q en R aan.",
        "Construeer de doorsnede en nummer de gebruikte lijnen; benoem alle nieuwe punten.",
        "Onderbouw de snijlijnen in twee verschillende zijvlakken.",
        "Bereken de inhoud met een duidelijk gekozen grondvlak en loodrechte hoogte."
      ],
      rubric: [
        "De volledige doorsnede is de vijfhoek P\u2013Q\u2013Y\u2013R\u2013X, met X op TA en Y op TC.",
        "De hulppunten U = PQ \u2229 AD en V = PQ \u2229 CD staan correct buiten het grondvlak; de constructievolgorde is leesbaar.",
        "De verbindingen UR en VR worden verantwoord doordat beide punten in het doorsnedevlak \xE9n in hetzelfde zijvlak liggen.",
        "De inhoud is \u2153 \xD7 6 \xD7 8 \xD7 9 = 144 cm\xB3; de hoogte is loodrecht op het grondvlak en is geen schuine opstaande ribbe."
      ],
      solution: [
        "Teken PQ. Noem U = PQ \u2229 AD en V = PQ \u2229 CD; beide hulppunten liggen buiten het grondvlak.",
        "Teken UR; deze lijn ligt in zijvlak TAD. Noem X = UR \u2229 TA.",
        "Teken VR; deze lijn ligt in zijvlak TCD. Noem Y = VR \u2229 TC.",
        "Teken de vijf grenslijnstukken PQ, QY, YR, RX en XP.",
        "Omdat ABCD een rechthoek is, is de grondvlakoppervlakte 6 \xD7 8 = 48 cm\xB2. De loodrechte hoogte is 9 cm. Dus de inhoud is \u2153 \xD7 48 \xD7 9 = 144 cm\xB3.",
        "Een schuine ribbe van T naar een hoekpunt is niet loodrecht op ABCD en mag daarom niet als hoogte in deze inhoudsformule worden gebruikt."
      ],
      scene: {
        points: {
          A: [
            0,
            0,
            0
          ],
          B: [
            6,
            0,
            0
          ],
          C: [
            6,
            8,
            0
          ],
          D: [
            0,
            8,
            0
          ],
          T: [
            1,
            2,
            9
          ],
          P: [
            3,
            0,
            0
          ],
          Q: [
            6,
            4,
            0
          ],
          R: [
            0.5,
            5,
            4.5
          ]
        },
        edges: [
          "AB",
          "BC",
          "CD",
          "DA",
          "AT",
          "BT",
          "CT",
          "DT"
        ],
        showCube: false,
        caption: "Papieren werkblad B: scheve piramide; grondvlak 6 \xD7 8 cm en loodrechte hoogte 9 cm. P, Q en R zijn middens."
      }
    }
  },
  sources: [
    {
      level: 2,
      source: "Ruimtemeetkunde 2025-2026 les 1.2 (1).pptx",
      slides: "10\u201313",
      coverage: "Lijn-vlaksnijding via een hulpvlak; voorwaarde dat het hulpvlak de lijn bevat; snijlijn construeren en redenering waarom dit werkt. MathML-tekst inclusief alle m:t-nodes herlezen."
    },
    {
      level: 2,
      source: "Ruimtemeetkunde 2025-2026 les 1.2 (1).pptx",
      slides: "14\u201317, 20",
      coverage: "Doorsneden: twee punten in een zijvlak verbinden, evenwijdige snijlijnen in evenwijdige vlakken, buiten het lichaam liggende hulpsnijpunten. Nieuwe volledig gespecificeerde voorbeelden."
    },
    {
      level: 2,
      source: "Ruimtemeetkunde 2025-2026 les 1.2 (1).pptx",
      slides: "21\u201323",
      coverage: "Gelijkvormigheid en richting van de lengtefactor; voorbereiding op driehoeksoppervlakte en piramide-inhoud."
    },
    {
      level: 3,
      source: "Ruimtemeetkunde 2025-2026 les 1.3 (1).pptx",
      slides: "5\u20139",
      coverage: "Complexere doorsneden via de grondvlak-snijlijn en evenwijdigheid; overdracht naar prisma en piramide, ook zelf tekenen op papier."
    },
    {
      level: 3,
      source: "Ruimtemeetkunde 2025-2026 les 1.3 (1).pptx",
      slides: "10\u201311",
      coverage: "Driehoekshoogte met Pythagoras, aanvullen tot prisma en drie piramides aftrekken. Apart levelcheckvoorbeeld met gelijkzijdige zijde 6 en prismahoogte 8 geeft 18\u221A27, conform opnieuw uitgelezen formules."
    },
    {
      level: 3,
      source: "Ruimtemeetkunde 2025-2026 les 1.3 (1).pptx",
      slides: "12\u201313",
      coverage: "Start hoofdstuk 10: sinus, cosinus, tangens, lengtes berekenen en inverse goniometrie voor hoeken."
    },
    {
      level: 4,
      source: "Ruimtemeetkunde 1.4 \u2014 57bcb5d8-80a6-4fe3-ae19-f986b4f699c8.pptx",
      slides: "5\u201310",
      coverage: "10.1: herleiding cosinusregel met hoogtelijn; zijden, hoeken en oppervlakte; nieuwe getallenvoorbeelden met onafhankelijke berekening."
    },
    {
      level: 4,
      source: "Ruimtemeetkunde 1.4 \u2014 57bcb5d8-80a6-4fe3-ae19-f986b4f699c8.pptx",
      slides: "11\u201313",
      coverage: "10.2: kleinste hoek tussen lijnen, kruisende lijnen evenwijdig verschuiven, kubus met midden van AE; alternatieve balken."
    },
    {
      level: 4,
      source: "Ruimtemeetkunde 1.4 \u2014 57bcb5d8-80a6-4fe3-ae19-f986b4f699c8.pptx",
      slides: "15\u201316",
      coverage: "10.3: loodrecht op een vlak via twee snijdende vlaklijnen; loodrechte projectie en lijn\u2013vlakhoek. Noodzakelijke voorwaarden expliciet gemaakt."
    },
    {
      level: 4,
      source: "Ruimtemeetkunde 1.4 \u2014 57bcb5d8-80a6-4fe3-ae19-f986b4f699c8.pptx",
      slides: "17\u201320",
      coverage: "10.4: snijlijn, standvlak, standhoek, kubusvoorbeeld EJG/ABFE; ware-grootte-constructie op papier met nieuwe afmetingen."
    },
    {
      level: 5,
      source: "Ruimtemeetkunde 1.5 (c7ab7d89-b3b1-4921-946a-f98c38e61550.pptx)",
      slides: "8, 10\u201314 (alle a:t- en m:t-tekst gelezen)",
      coverage: "10.5 punt-lijn via hulpvlak en oppervlakte; 10.6 punt-vlak en inhoudsmethode; 2.5 formules met gelijkvormigheid, voorbeeldwaarden en controle."
    },
    {
      level: 5,
      source: "Toets Basis RuimteMeetkunde, 5 november 2018",
      slides: "Opgaven 4d en 5",
      coverage: "Afstand tot schuin vlak en variabele vouwbak. De twee bakcontexten, maten en vragen in deze uitbreiding zijn nieuw; het zijn geen letterlijke tentamenvragen."
    },
    {
      level: 6,
      source: "Ruimtemeetkunde 1.6 (aeec9db6-624c-4c01-a9d2-e731e62a8118.pptx)",
      slides: "4\u20138, 10, 12 (alle a:t- en m:t-tekst gelezen)",
      coverage: "Herhaling constructies, lijn-vlakhoeken en vlakkenhoeken; punt-vlakafstanden; kruisende lijnen via parallel hulpvlak; zelfstandige methodekeuze."
    },
    {
      level: 6,
      source: "Toets Basis RuimteMeetkunde, 5 november 2018",
      slides: "Opgaven 3d\u2013e en 5",
      coverage: "Nieuwe toepassingen met kruisende lijnen, afgeknotte balken, standvlakken en fysisch domein van een volumeformule."
    },
    {
      level: 7,
      source: "RMa Toets 2018 Basis Ruimtemeetkunde VT en DT 5 november 2018.pdf; Uitwerkingen tentamen Basis RM 5 november 2018.pdf",
      slides: "Opgaven 1\u20135 en beoordelingsopmerkingen AB1\u2013AB13",
      coverage: "Nieuwe examenopgaven naar de getoetste vaardigheden: ligging en bewijs, hulpvlak en doorsnede, inhoud, lijn- en vlakhoeken, punt-lijn- en punt-vlakafstand, kruisende lijnen, gelijkvormigheid en formulemodel. Geen kopie van ontbrekende bronfiguren. Papieren constructievolgorde, nieuwe puntnamen en symbolen sluiten aan op de toetsinstructie."
    },
    {
      level: 7,
      source: "Ruimtemeetkunde 2025-2026 lessen 1.1\u20131.6",
      slides: "1.2: 10\u201322; 1.3: 5\u201311; 1.4: 5\u201320; 1.5: 8\u201314; 1.6: 4\u201310",
      coverage: "Cumulatieve dekking van zes lessen; tweede variant wisselt kubussen en balken af met driehoekige prisma\u2019s, scheve piramides, afgeknotte piramides en een omgekeerd volumemodel."
    }
  ]
};

// app/construction-tasks.json
var construction_tasks_default = {
  tasks: [
    {
      id: "construct-l2-parallel",
      level: 2,
      title: "Een doorsnede via evenwijdige vlakken",
      prompt: "Construeer de volledige doorsnede van de kubus met vlak PQR. De kubus heeft ribben 6 cm; AP = 2 cm, BQ = 3 cm en CR = 4 cm.",
      points: {
        A: [
          0,
          0,
          0
        ],
        B: [
          6,
          0,
          0
        ],
        C: [
          6,
          6,
          0
        ],
        D: [
          0,
          6,
          0
        ],
        E: [
          0,
          0,
          6
        ],
        F: [
          6,
          0,
          6
        ],
        G: [
          6,
          6,
          6
        ],
        H: [
          0,
          6,
          6
        ],
        P: [
          0,
          0,
          2
        ],
        Q: [
          6,
          0,
          3
        ],
        R: [
          6,
          6,
          4
        ]
      },
      edges: [
        "AB",
        "BC",
        "CD",
        "DA",
        "EF",
        "FG",
        "GH",
        "HE",
        "AE",
        "BF",
        "CG",
        "DH"
      ],
      givens: [
        "P",
        "Q",
        "R"
      ],
      targetSegments: [
        [
          [
            0,
            0,
            2
          ],
          [
            6,
            0,
            3
          ]
        ],
        [
          [
            6,
            0,
            3
          ],
          [
            6,
            6,
            4
          ]
        ],
        [
          [
            6,
            6,
            4
          ],
          [
            0,
            6,
            3
          ]
        ],
        [
          [
            0,
            6,
            3
          ],
          [
            0,
            0,
            2
          ]
        ]
      ],
      hints: [
        "Welke twee gegeven punten delen een zijvlak?",
        "Gebruik de evenwijdige zijvlakken BCGF en ADHE.",
        "Trek door P een evenwijdige aan QR en bepaal het snijpunt met DH."
      ],
      solution: [
        "Teken PQ en QR.",
        "Teken door P de lijn evenwijdig aan QR. Deze snijdt DH in een nieuw punt S.",
        "Teken de lijnstukken PS en SR. De doorsnede is PQRS."
      ],
      reason: {
        prompt: "Waarom is de lijn door P evenwijdig aan QR bruikbaar?",
        options: [
          {
            id: "v",
            text: "Het doorsnedevlak maakt evenwijdige snijlijnen in de evenwijdige vlakken ADHE en BCGF."
          },
          {
            id: "a",
            text: "Alle zijvlakken van een kubus zijn onderling evenwijdig."
          },
          {
            id: "p",
            text: "Elke lijn door P ligt in vlak PQR."
          }
        ],
        answer: "v"
      },
      targetPoints: [
        [
          0,
          6,
          3
        ]
      ],
      solutionPoints: {
        S: [
          0,
          6,
          3
        ]
      }
    },
    {
      id: "construct-l2-six",
      level: 2,
      title: "Een doorsnede met zes zijden",
      prompt: "Construeer de volledige doorsnede van vlak PQR met de kubus. P, Q en R zijn de middens van AB, BC en CG.",
      points: {
        A: [
          0,
          0,
          0
        ],
        B: [
          6,
          0,
          0
        ],
        C: [
          6,
          6,
          0
        ],
        D: [
          0,
          6,
          0
        ],
        E: [
          0,
          0,
          6
        ],
        F: [
          6,
          0,
          6
        ],
        G: [
          6,
          6,
          6
        ],
        H: [
          0,
          6,
          6
        ],
        P: [
          3,
          0,
          0
        ],
        Q: [
          6,
          3,
          0
        ],
        R: [
          6,
          6,
          3
        ]
      },
      edges: [
        "AB",
        "BC",
        "CD",
        "DA",
        "EF",
        "FG",
        "GH",
        "HE",
        "AE",
        "BF",
        "CG",
        "DH"
      ],
      givens: [
        "P",
        "Q",
        "R"
      ],
      targetSegments: [
        [
          [
            3,
            0,
            0
          ],
          [
            6,
            3,
            0
          ]
        ],
        [
          [
            6,
            3,
            0
          ],
          [
            6,
            6,
            3
          ]
        ],
        [
          [
            6,
            6,
            3
          ],
          [
            3,
            6,
            6
          ]
        ],
        [
          [
            3,
            6,
            6
          ],
          [
            0,
            3,
            6
          ]
        ],
        [
          [
            0,
            3,
            6
          ],
          [
            0,
            0,
            3
          ]
        ],
        [
          [
            0,
            0,
            3
          ],
          [
            3,
            0,
            0
          ]
        ]
      ],
      hints: [
        "De drie gegeven punten zijn nog niet alle hoekpunten van de doorsnede.",
        "Verleng QR en onderzoek het snijpunt met de volledige lijn BF.",
        "Verbind dat hulppunt met P. Daarmee vind je het doorsnedepunt op AE; gebruik vervolgens evenwijdige zijvlakken."
      ],
      solution: [
        "Teken PQ en QR. Noem X het snijpunt van de volledige lijnen QR en BF; X ligt onder B.",
        "Teken PX. Het snijpunt met AE is U.",
        "Trek door U een evenwijdige aan QR. Deze snijdt EH in T.",
        "Trek door T een evenwijdige aan PQ. Deze snijdt GH in S.",
        "Teken de zes grenslijnstukken PQ, QR, RS, ST, TU en UP."
      ],
      reason: {
        prompt: "Waarom mag X = QR \u2229 BF buiten de kubus gebruikt worden?",
        options: [
          {
            id: "h",
            text: "X ligt zowel in het doorsnedevlak als in vlak ABFE; daarom ligt PX in beide vlakken."
          },
          {
            id: "b",
            text: "Elk buitenpunt is automatisch een hoekpunt van de doorsnede."
          },
          {
            id: "z",
            text: "Lijnen die elkaar in de tekening kruisen snijden altijd in de ruimte."
          }
        ],
        answer: "h"
      },
      targetPoints: [
        [
          3,
          6,
          6
        ],
        [
          0,
          3,
          6
        ],
        [
          0,
          0,
          3
        ]
      ],
      solutionPoints: {
        X: [
          6,
          0,
          -3
        ],
        U: [
          0,
          0,
          3
        ],
        T: [
          0,
          3,
          6
        ],
        S: [
          3,
          6,
          6
        ]
      }
    },
    {
      id: "construct-l3-pyramid",
      level: 3,
      title: "Een schuine doorsnede van een piramide",
      prompt: "Construeer de doorsnede van vierzijdige piramide ABCDT met vlak PQR. P en Q zijn de middens van TA en TB; R ligt op TC met CR : RT = 1 : 3.",
      points: {
        A: [
          -4,
          -4,
          0
        ],
        B: [
          4,
          -4,
          0
        ],
        C: [
          4,
          4,
          0
        ],
        D: [
          -4,
          4,
          0
        ],
        T: [
          0,
          0,
          8
        ],
        P: [
          -2,
          -2,
          4
        ],
        Q: [
          2,
          -2,
          4
        ],
        R: [
          3,
          3,
          2
        ]
      },
      edges: [
        "AB",
        "BC",
        "CD",
        "DA",
        "AT",
        "BT",
        "CT",
        "DT"
      ],
      givens: [
        "P",
        "Q",
        "R"
      ],
      targetSegments: [
        [
          [
            -2,
            -2,
            4
          ],
          [
            2,
            -2,
            4
          ]
        ],
        [
          [
            2,
            -2,
            4
          ],
          [
            3,
            3,
            2
          ]
        ],
        [
          [
            3,
            3,
            2
          ],
          [
            -3,
            3,
            2
          ]
        ],
        [
          [
            -3,
            3,
            2
          ],
          [
            -2,
            -2,
            4
          ]
        ]
      ],
      hints: [
        "Welke eigenschap heeft de middenparallel PQ in driehoek TAB?",
        "PQ is evenwijdig aan AB en daarmee aan CD. Onderzoek vlak TCD.",
        "Trek door R de lijn evenwijdig aan PQ en snijd deze met TD."
      ],
      solution: [
        "Teken PQ en QR. PQ is evenwijdig aan AB en CD.",
        "Trek door R een evenwijdige aan PQ. Deze ligt in vlak TCD en snijdt TD in S.",
        "Teken RS en SP. De volledige doorsnede is PQRS."
      ],
      reason: {
        prompt: "Waarom ligt de evenwijdige door R aan PQ in vlak TCD?",
        options: [
          {
            id: "c",
            text: "R ligt in TCD en de richting van PQ is evenwijdig aan de lijn CD in dat vlak."
          },
          {
            id: "t",
            text: "Alle zijvlakken van een piramide zijn evenwijdig."
          },
          {
            id: "m",
            text: "Omdat R altijd het midden van TC is."
          }
        ],
        answer: "c"
      },
      targetPoints: [
        [
          -3,
          3,
          2
        ]
      ],
      solutionPoints: {
        S: [
          -3,
          3,
          2
        ]
      }
    },
    {
      id: "construct-l3-prism",
      level: 3,
      title: "Vier zijden in een driehoekig prisma",
      prompt: "Construeer de volledige doorsnede van het rechte driehoekige prisma ABC.DEF met vlak PQR. P, Q en R zijn de middens van AB, BC en CF.",
      points: {
        A: [
          0,
          0,
          0
        ],
        B: [
          6,
          0,
          0
        ],
        C: [
          2,
          4,
          0
        ],
        D: [
          0,
          0,
          6
        ],
        E: [
          6,
          0,
          6
        ],
        F: [
          2,
          4,
          6
        ],
        P: [
          3,
          0,
          0
        ],
        Q: [
          4,
          2,
          0
        ],
        R: [
          2,
          4,
          3
        ]
      },
      edges: [
        "AB",
        "BC",
        "CA",
        "DE",
        "EF",
        "FD",
        "AD",
        "BE",
        "CF"
      ],
      givens: [
        "P",
        "Q",
        "R"
      ],
      targetSegments: [
        [
          [
            3,
            0,
            0
          ],
          [
            4,
            2,
            0
          ]
        ],
        [
          [
            4,
            2,
            0
          ],
          [
            2,
            4,
            3
          ]
        ],
        [
          [
            2,
            4,
            3
          ],
          [
            0,
            0,
            3
          ]
        ],
        [
          [
            0,
            0,
            3
          ],
          [
            3,
            0,
            0
          ]
        ]
      ],
      hints: [
        "Een driehoekig prisma hoeft geen driehoekige doorsnede te hebben.",
        "De volledige lijnen QR en BE liggen in hetzelfde zijvlak.",
        "Zoek X = QR \u2229 BE. De lijn PX snijdt AD in het ontbrekende hoekpunt."
      ],
      solution: [
        "Teken PQ en QR. Verleng QR en BE tot hun snijpunt X onder B.",
        "Teken PX; deze lijn ligt in vlak ABED.",
        "Het snijpunt U van PX en AD ligt op de doorsnede.",
        "Teken UP en UR. De volledige doorsnede is PQRU."
      ],
      reason: {
        prompt: "Waarom mag je de gevonden punten R en U verbinden?",
        options: [
          {
            id: "f",
            text: "R en U liggen in het doorsnedevlak \xE9n in hetzelfde zijvlak ACFD."
          },
          {
            id: "n",
            text: "Elke twee punten van een prisma liggen op hetzelfde zijvlak."
          },
          {
            id: "d",
            text: "Een doorsnede moet altijd de kleinste driehoek door de gegeven punten zijn."
          }
        ],
        answer: "f"
      },
      targetPoints: [
        [
          0,
          0,
          3
        ]
      ],
      solutionPoints: {
        X: [
          6,
          0,
          -3
        ],
        U: [
          0,
          0,
          3
        ]
      }
    },
    {
      id: "construct-l2-lineplane",
      level: 2,
      title: "Een lijn door een diagonaalvlak",
      prompt: "Construeer het snijpunt van de volledige lijn AP met vlak BDH. De kubus heeft ribben 6 cm en P is het midden van FG. Teken ook het lijnstuk van A naar het gevonden punt.",
      points: {
        A: [
          0,
          0,
          0
        ],
        B: [
          6,
          0,
          0
        ],
        C: [
          6,
          6,
          0
        ],
        D: [
          0,
          6,
          0
        ],
        E: [
          0,
          0,
          6
        ],
        F: [
          6,
          0,
          6
        ],
        G: [
          6,
          6,
          6
        ],
        H: [
          0,
          6,
          6
        ],
        P: [
          6,
          3,
          6
        ]
      },
      edges: [
        "AB",
        "BC",
        "CD",
        "DA",
        "EF",
        "FG",
        "GH",
        "HE",
        "AE",
        "BF",
        "CG",
        "DH"
      ],
      givens: [
        "P"
      ],
      targetSegments: [
        [
          [
            0,
            0,
            0
          ],
          [
            4,
            2,
            4
          ]
        ]
      ],
      hints: [
        "Een hulpvlak door AP kan verticaal zijn.",
        "Construeer K als midden van BC. Vlak AKP bevat AP en de verticale lijn KP.",
        "Snijd AK met BD. Trek door dat snijpunt een evenwijdige aan AE en snijd deze met AP."
      ],
      solution: [
        "Construeer K, het midden van BC.",
        "Teken AP, AK en BD. Noem Y = AK \u2229 BD.",
        "Trek door Y een evenwijdige aan AE. Dit is de snijlijn van het hulpvlak AKP en vlak BDH.",
        "Noem X het snijpunt van die lijn met AP. Teken AX."
      ],
      reason: {
        prompt: "Wat garandeert dat het gevonden punt X in vlak BDH ligt?",
        options: [
          {
            id: "s",
            text: "X ligt op de snijlijn van het hulpvlak AKP met vlak BDH."
          },
          {
            id: "p",
            text: "X ligt ongeveer in het midden van de getekende kubus."
          },
          {
            id: "b",
            text: "Elke lijn door A snijdt vlak BDH in B."
          }
        ],
        answer: "s"
      },
      targetPoints: [
        [
          4,
          2,
          4
        ]
      ],
      solutionPoints: {
        K: [
          6,
          3,
          0
        ],
        Y: [
          4,
          2,
          0
        ],
        X: [
          4,
          2,
          4
        ]
      }
    },
    {
      id: "construct-l4-standvlak",
      level: 4,
      title: "De hoek zichtbaar maken",
      prompt: "De top T van de rechte vierkante piramide ligt 6 cm boven het grondvlakmiddelpunt. Het grondvlak heeft zijde 8 cm. Construeer de twee lijnstukken die samen de kleinste hoek tussen vlak BCT en vlak ABCD voorstellen, bij het midden van BC.",
      points: {
        A: [
          -4,
          -4,
          0
        ],
        B: [
          4,
          -4,
          0
        ],
        C: [
          4,
          4,
          0
        ],
        D: [
          -4,
          4,
          0
        ],
        T: [
          0,
          0,
          6
        ]
      },
      edges: [
        "AB",
        "BC",
        "CD",
        "DA",
        "AT",
        "BT",
        "CT",
        "DT"
      ],
      givens: [],
      targetSegments: [
        [
          [
            0,
            0,
            0
          ],
          [
            4,
            0,
            0
          ]
        ],
        [
          [
            4,
            0,
            0
          ],
          [
            0,
            0,
            6
          ]
        ]
      ],
      hints: [
        "De snijlijn van de twee vlakken is BC.",
        "Maak een vlak loodrecht op BC door het grondvlakmiddelpunt en T.",
        "Construeer het midden M van BC en het middelpunt O van het grondvlak. De hoek wordt gevormd door MO en MT."
      ],
      solution: [
        "Construeer M als midden van BC.",
        "Teken AC en BD en noem hun snijpunt O.",
        "Teken MO en MT. Beide staan loodrecht op BC; hoek OMT is de gevraagde vlakhoek."
      ],
      reason: {
        prompt: "Waarom is hoek OMT de hoek tussen de vlakken?",
        options: [
          {
            id: "l",
            text: "MO en MT liggen elk in een van de vlakken en staan beide loodrecht op hun snijlijn BC."
          },
          {
            id: "g",
            text: "Elke hoek bij een punt van BC is de vlakhoek."
          },
          {
            id: "r",
            text: "MT en MO zijn even lang."
          }
        ],
        answer: "l"
      },
      targetPoints: [
        [
          0,
          0,
          0
        ],
        [
          4,
          0,
          0
        ]
      ],
      solutionPoints: {
        M: [
          4,
          0,
          0
        ],
        O: [
          0,
          0,
          0
        ]
      }
    },
    {
      id: "construct-l5-foot",
      level: 5,
      title: "De echte kortste verbinding",
      prompt: "Construeer het kortste lijnstuk van B naar de volledige lijn AC in balk ABCD.EFGH. AB = 8 cm, AD = 6 cm en AE = 4 cm.",
      points: {
        A: [
          0,
          0,
          0
        ],
        B: [
          8,
          0,
          0
        ],
        C: [
          8,
          6,
          0
        ],
        D: [
          0,
          6,
          0
        ],
        E: [
          0,
          0,
          4
        ],
        F: [
          8,
          0,
          4
        ],
        G: [
          8,
          6,
          4
        ],
        H: [
          0,
          6,
          4
        ]
      },
      edges: [
        "AB",
        "BC",
        "CD",
        "DA",
        "EF",
        "FG",
        "GH",
        "HE",
        "AE",
        "BF",
        "CG",
        "DH"
      ],
      givens: [],
      targetSegments: [
        [
          [
            8,
            0,
            0
          ],
          [
            5.12,
            3.84,
            0
          ]
        ]
      ],
      hints: [
        "De afstand tot een lijn meet je loodrecht op die lijn.",
        "De gevraagde constructie ligt geheel in vlak ABCD.",
        "Teken AC en construeer de loodvoet van B op AC. Verbind B met deze loodvoet."
      ],
      solution: [
        "Teken AC.",
        "Projecteer B loodrecht op de volledige lijn AC; noem de loodvoet P.",
        "Teken BP. Dit lijnstuk geeft de afstand van B tot AC."
      ],
      reason: {
        prompt: "Waarom is BP de afstand van B tot AC?",
        options: [
          {
            id: "k",
            text: "P ligt op AC en BP staat loodrecht op AC."
          },
          {
            id: "m",
            text: "P ligt altijd in het midden van AC."
          },
          {
            id: "b",
            text: "BP is het kortste getekende lijnstuk op het beeldscherm."
          }
        ],
        answer: "k"
      },
      targetPoints: [
        [
          5.12,
          3.84,
          0
        ]
      ],
      solutionPoints: {
        P: [
          5.12,
          3.84,
          0
        ]
      }
    },
    {
      id: "construct-l6-commonfoot",
      level: 6,
      title: "Een gemeenschappelijke loodlijn",
      prompt: "Bij tetra\xEBder ABCT staan AB, AC en AT in A onderling loodrecht. AB = 6 cm, AC = 8 cm en AT = 6 cm. Construeer het kortste verbindingslijnstuk tussen de volledige lijnen AB en CT.",
      points: {
        A: [
          0,
          0,
          0
        ],
        B: [
          6,
          0,
          0
        ],
        C: [
          0,
          8,
          0
        ],
        T: [
          0,
          0,
          6
        ]
      },
      edges: [
        "AB",
        "BC",
        "CA",
        "AT",
        "BT",
        "CT"
      ],
      givens: [],
      targetSegments: [
        [
          [
            0,
            0,
            0
          ],
          [
            0,
            2.88,
            3.84
          ]
        ]
      ],
      hints: [
        "Onderzoek welk vlak door CT loodrecht staat op AB.",
        "Vlak ACT staat loodrecht op AB en snijdt AB in A.",
        "Construeer in vlak ACT de loodvoet van A op CT. De verbinding met A staat loodrecht op beide lijnen."
      ],
      solution: [
        "Teken CT en projecteer A loodrecht op CT; noem de loodvoet P.",
        "Teken AP. AP ligt in vlak ACT en staat daardoor loodrecht op AB; door de constructie is AP ook loodrecht op CT.",
        "Daarom is AP de gemeenschappelijke loodlijn en de kortste verbinding."
      ],
      reason: {
        prompt: "Waarom volstaat een loodlijn vanuit A op CT hier?",
        options: [
          {
            id: "v",
            text: "AB staat loodrecht op vlak ACT, dus op AP; daarnaast is AP loodrecht op CT."
          },
          {
            id: "a",
            text: "Een loodlijn vanuit een willekeurig punt op AB is altijd de kortste verbinding."
          },
          {
            id: "p",
            text: "AB en CT zijn evenwijdig, omdat zij niet snijden."
          }
        ],
        answer: "v"
      },
      targetPoints: [
        [
          0,
          2.88,
          3.84
        ]
      ],
      solutionPoints: {
        P: [
          0,
          2.88,
          3.84
        ]
      }
    },
    {
      id: "construct-l7-a",
      level: 7,
      title: "Examenconstructie A \xB7 buiten de kubus",
      prompt: "Construeer de volledige doorsnede van de kubus met vlak PQR. De kubus heeft ribben 6 cm; AP = 2 cm, Q is het midden van EH en R is het midden van BC. Geef ook de reden voor je constructie.",
      points: {
        A: [
          0,
          0,
          0
        ],
        B: [
          6,
          0,
          0
        ],
        C: [
          6,
          6,
          0
        ],
        D: [
          0,
          6,
          0
        ],
        E: [
          0,
          0,
          6
        ],
        F: [
          6,
          0,
          6
        ],
        G: [
          6,
          6,
          6
        ],
        H: [
          0,
          6,
          6
        ],
        P: [
          0,
          0,
          2
        ],
        Q: [
          0,
          3,
          6
        ],
        R: [
          6,
          3,
          0
        ]
      },
      edges: [
        "AB",
        "BC",
        "CD",
        "DA",
        "EF",
        "FG",
        "GH",
        "HE",
        "AE",
        "BF",
        "CG",
        "DH"
      ],
      givens: [
        "P",
        "Q",
        "R"
      ],
      targetSegments: [
        [
          [
            0,
            0,
            2
          ],
          [
            2,
            0,
            0
          ]
        ],
        [
          [
            2,
            0,
            0
          ],
          [
            6,
            3,
            0
          ]
        ],
        [
          [
            6,
            3,
            0
          ],
          [
            6,
            6,
            4
          ]
        ],
        [
          [
            6,
            6,
            4
          ],
          [
            4,
            6,
            6
          ]
        ],
        [
          [
            4,
            6,
            6
          ],
          [
            0,
            3,
            6
          ]
        ],
        [
          [
            0,
            3,
            6
          ],
          [
            0,
            0,
            2
          ]
        ]
      ],
      hints: [
        "Zoek eerst twee gegeven punten in hetzelfde zijvlak.",
        "Verleng PQ tot de lijn AD om een hulppunt in het grondvlak te vinden.",
        "Gebruik de grondvlak-snijlijn door dit hulppunt en R, en daarna evenwijdige tegenoverliggende zijvlakken."
      ],
      solution: [
        "Teken PQ. Verleng PQ en AD tot hun snijpunt U buiten de kubus.",
        "Teken UR en noem X het snijpunt met AB.",
        "Trek door R een evenwijdige aan PQ; die snijdt CG in S.",
        "Trek door Q een evenwijdige aan UR; die snijdt GH in Y.",
        "Teken de zes grenslijnstukken PX, XR, RS, SY, YQ en QP."
      ],
      reason: {
        prompt: "Waarom hoort de lijn UR bij de doorsnede?",
        options: [
          {
            id: "g",
            text: "U en R liggen zowel in vlak PQR als in het grondvlak."
          },
          {
            id: "r",
            text: "U is het middelpunt van het grondvlak."
          },
          {
            id: "p",
            text: "Elke lijn door R hoort bij het doorsnedevlak."
          }
        ],
        answer: "g"
      },
      targetPoints: [
        [
          2,
          0,
          0
        ],
        [
          6,
          6,
          4
        ],
        [
          4,
          6,
          6
        ]
      ],
      exam: "a",
      solutionPoints: {
        U: [
          0,
          -1.5,
          0
        ],
        X: [
          2,
          0,
          0
        ],
        S: [
          6,
          6,
          4
        ],
        Y: [
          4,
          6,
          6
        ]
      }
    },
    {
      id: "construct-l7-b",
      level: 7,
      title: "Examenconstructie B \xB7 scheve piramide",
      prompt: "Construeer de volledige doorsnede van de scheve vierzijdige piramide ABCDT met vlak PQR. ABCD is een rechthoek. P, Q en R zijn de middens van AB, BC en DT. Geef ook de reden voor je constructie.",
      points: {
        A: [
          0,
          0,
          0
        ],
        B: [
          6,
          0,
          0
        ],
        C: [
          6,
          8,
          0
        ],
        D: [
          0,
          8,
          0
        ],
        T: [
          1,
          2,
          9
        ],
        P: [
          3,
          0,
          0
        ],
        Q: [
          6,
          4,
          0
        ],
        R: [
          0.5,
          5,
          4.5
        ]
      },
      edges: [
        "AB",
        "BC",
        "CD",
        "DA",
        "AT",
        "BT",
        "CT",
        "DT"
      ],
      givens: [
        "P",
        "Q",
        "R"
      ],
      targetSegments: [
        [
          [
            3,
            0,
            0
          ],
          [
            6,
            4,
            0
          ]
        ],
        [
          [
            6,
            4,
            0
          ],
          [
            4.75,
            6.5,
            2.25
          ]
        ],
        [
          [
            4.75,
            6.5,
            2.25
          ],
          [
            0.5,
            5,
            4.5
          ]
        ],
        [
          [
            0.5,
            5,
            4.5
          ],
          [
            0.25,
            0.5,
            2.25
          ]
        ],
        [
          [
            0.25,
            0.5,
            2.25
          ],
          [
            3,
            0,
            0
          ]
        ]
      ],
      hints: [
        "PQ ligt in het grondvlak, maar R niet.",
        "Verleng PQ en zoek snijpunten met de volledige lijnen AD en CD.",
        "Verbind beide gevonden hulppunten met R. In de zijvlakken TAD en TCD vind je zo de ontbrekende doorsnedepunten."
      ],
      solution: [
        "Teken PQ. Noem U = PQ \u2229 AD en V = PQ \u2229 CD; beide hulppunten liggen buiten het grondvlak.",
        "Teken UR; deze lijn ligt in zijvlak TAD. Noem X = UR \u2229 TA.",
        "Teken VR; deze lijn ligt in zijvlak TCD. Noem Y = VR \u2229 TC.",
        "Teken de vijf grenslijnstukken PQ, QY, YR, RX en XP."
      ],
      reason: {
        prompt: "Waarom mag je R verbinden met U = PQ \u2229 AD?",
        options: [
          {
            id: "t",
            text: "R en U liggen allebei in vlak PQR \xE9n in zijvlak TAD."
          },
          {
            id: "e",
            text: "De zijvlakken TAD en TCD zijn evenwijdig."
          },
          {
            id: "m",
            text: "Omdat alle middens van ribben in \xE9\xE9n vlak liggen."
          }
        ],
        answer: "t"
      },
      targetPoints: [
        [
          0.25,
          0.5,
          2.25
        ],
        [
          4.75,
          6.5,
          2.25
        ]
      ],
      exam: "b",
      solutionPoints: {
        U: [
          0,
          -4,
          0
        ],
        V: [
          9,
          8,
          0
        ],
        X: [
          0.25,
          0.5,
          2.25
        ],
        Y: [
          4.75,
          6.5,
          2.25
        ]
      }
    }
  ]
};

// app/numeric.ts
function numericValue(input) {
  const s = input.trim().replaceAll(",", ".").replaceAll("\xD7", "*").replaceAll("\xB7", "*").replaceAll("\xF7", "/").replaceAll("\xB2", "^2").replaceAll("\xB3", "^3").replaceAll("\u2212", "-").replaceAll("\u03C0", "pi").replaceAll("\u221A", "sqrt").replace(/\s+/g, "");
  if (!s || s.length > 120) return null;
  const tokens = s.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|sqrt|pi|[()+\-*/^]/g) || [];
  if (tokens.join("") !== s || tokens.length > 80) return null;
  let i = 0;
  function atom() {
    const t = tokens[i++];
    if (t === "(") {
      const v = sum();
      if (tokens[i++] !== ")") throw Error();
      return v;
    }
    if (t === "sqrt") return Math.sqrt(atom());
    if (t === "pi") return Math.PI;
    if (t && /^(\d|\.)/.test(t)) return Number(t);
    throw Error();
  }
  function power() {
    const v = atom();
    return tokens[i] === "^" ? (i++, v ** unary()) : v;
  }
  function unary() {
    if (tokens[i] === "+") {
      i++;
      return unary();
    }
    if (tokens[i] === "-") {
      i++;
      return -unary();
    }
    return power();
  }
  function product() {
    let v = unary();
    while (tokens[i] === "*" || tokens[i] === "/") {
      const op = tokens[i++], b = unary();
      v = op === "*" ? v * b : v / b;
    }
    return v;
  }
  function sum() {
    let v = product();
    while (tokens[i] === "+" || tokens[i] === "-") {
      const op = tokens[i++], b = product();
      v = op === "+" ? v + b : v - b;
    }
    return v;
  }
  try {
    const value = sum();
    return i === tokens.length && Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

// app/model.ts
var COURSE = course_content_default;
var CHECKS = { "1": content_default.checkpointIds, ...COURSE.checks };
var BANK = { blocks: [...content_default.blocks.map((b) => ({ ...b, level: 1 })), ...COURSE.blocks], questions: [...content_default.questions, ...COURSE.questions], checkpointIds: Object.values(CHECKS).flat() };
var QUESTIONS = Object.fromEntries(BANK.questions.map((q) => [q.id, q]));
var SKILLS = ["inzicht", "construeren", "onderbouwen", "rekenen"];
function correctAnswer(q, a) {
  if (new Set(a).size !== a.length) return false;
  if (q.type === "numeric") {
    const n = a.length === 1 ? numericValue(a[0]) : null;
    if (n === null) return false;
    const expected = Number(q.answer[0]);
    return q.decimals !== void 0 ? Math.abs(n - expected) <= 1e-6 || Math.abs(n - Number(expected.toFixed(q.decimals))) <= 1e-7 : Math.abs(n - expected) <= (q.tolerance ?? 0.02);
  }
  if (q.acceptAny?.length) return a.length === (q.selectCount || 1) && a.every((k) => q.acceptAny.includes(k));
  return a.length === q.answer.length && [...a].sort().join("|") === [...q.answer].sort().join("|");
}
function checkGroup(questionId) {
  return Object.keys(CHECKS).find((k) => CHECKS[k].includes(questionId));
}
function blocksForLevel(level) {
  return BANK.blocks.filter((b) => (b.level || 1) === level);
}
function checkAttempts(events, key) {
  const ids = CHECKS[key] || [], groups = /* @__PURE__ */ new Map();
  for (const e of events) if (e.type === "answer" && e.payload.context === "check" && ids.includes(String(e.payload.questionId))) {
    const sid = String(e.payload.sessionId);
    const rows = groups.get(sid) || [];
    if (!rows.some((a) => a.payload.questionId === e.payload.questionId)) rows.push(e);
    groups.set(sid, rows);
  }
  return [...groups].map(([sessionId, rows]) => ({ sessionId, rows, complete: ids.length > 0 && rows.length === ids.length, passed: ids.length > 0 && rows.length === ids.length && rows.every((e) => correctAnswer(QUESTIONS[e.payload.questionId], e.payload.answer) && !e.payload.helped), at: Math.max(...rows.map((e) => e.at)), startedAt: Math.min(...rows.map((e) => e.at)) }));
}
var RETENTION_MS = 24 * 60 * 60 * 1e3;
function deriveProgress(events) {
  const answers = events.filter((e) => e.type === "answer");
  const evidence = {};
  for (const e of visibleEvidenceAnswers(events, BANK.checkpointIds)) {
    const id = e.payload.questionId, q = QUESTIONS[id];
    if (!q) continue;
    const old = evidence[id], ok = correctAnswer(q, e.payload.answer);
    evidence[id] = { correct: !!old?.correct || ok, independent: !!old?.independent || !old && ok && !e.payload.helped, helped: !!old?.helped || e.payload.helped || !ok, tries: (old?.tries || 0) + 1 };
  }
  const complete = [...new Set(events.filter((e) => e.type === "block" && BANK.blocks.some((b) => b.id === e.payload.blockId)).map((e) => String(e.payload.blockId)))];
  const mainIds = BANK.blocks.flatMap((b) => b.questionIds), assessed = [...mainIds, ...BANK.checkpointIds];
  const skillsFor = (ids) => Object.fromEntries(SKILLS.map((s) => {
    const selected = ids.filter((id) => QUESTIONS[id]?.skill === s);
    return [s, { total: selected.length, independent: selected.filter((id) => evidence[id]?.independent).length, helped: selected.filter((id) => evidence[id]?.correct && !evidence[id]?.independent).length }];
  }));
  const skills = skillsFor(assessed), checks = Object.fromEntries(Object.keys(CHECKS).map((key) => [key, checkAttempts(events, key).some((a) => a.passed)]));
  const paperDoneFor = (key) => events.some((e) => e.type === "paper" && String(e.payload.level ?? 1) === key && Array.isArray(e.payload.checks) && new Set(e.payload.checks).size === 4);
  const workbench = events.filter((e) => e.type === "workbench" && e.payload.correct === true).at(-1);
  const constructions = events.filter((e) => e.type === "construction" && e.payload.correct === true);
  const tasks = construction_tasks_default.tasks;
  const firstA = checkAttempts(events, "7a").find((a) => a.passed);
  const laterB = !!firstA && checkAttempts(events, "7b").some((a) => a.passed && a.startedAt >= firstA.at + RETENTION_MS);
  const levels = {};
  for (let level = 1; level <= 7; level++) {
    const bs = blocksForLevel(level), ids = bs.flatMap((b) => b.questionIds), done = bs.filter((b) => complete.includes(b.id)).length;
    const required = tasks.filter((t) => t.level === level), construction = required.every((t) => constructions.some((e) => e.payload.taskId === t.id && (level !== 7 || e.payload.helped === false)));
    const paper = level === 7 ? paperDoneFor("7a") && paperDoneFor("7b") : paperDoneFor(String(level)), check = level === 7 ? !!checks["7a"] && laterB : !!checks[String(level)];
    const passed = done === bs.length && check && paper && construction && (level !== 7 || [1, 2, 3, 4, 5, 6].every((l) => levels[l].passed));
    const total = ids.length + bs.length + 2 + required.length, finished = ids.filter((id) => evidence[id]).length + done + Number(check) + Number(paper) + required.filter((t) => constructions.some((e) => e.payload.taskId === t.id && (level !== 7 || e.payload.helped === false))).length;
    levels[level] = { passed, check, paper, construction, blocks: done, totalBlocks: bs.length, percent: passed ? 100 : Math.min(99, Math.floor(finished / Math.max(1, total) * 100)), skills: skillsFor([...ids, ...level === 7 ? [...CHECKS["7a"] || [], ...CHECKS["7b"] || []] : CHECKS[level] || []]) };
  }
  const successfulCheck = !!checks["1"], paperDone = paperDoneFor("1");
  const rewarded = /* @__PURE__ */ new Set([...mainIds, ...BANK.blocks.flatMap((b) => b.retestIds)]), constructionIds = new Set(constructions.map((e) => String(e.payload.taskId)));
  const xp = Object.entries(evidence).reduce((n, [id, v]) => n + (rewarded.has(id) && v.correct ? v.independent ? 20 : 10 : 0), 0) + complete.length * 30 + (workbench ? 60 : 0) + constructionIds.size * 60 + Object.values(levels).filter((l) => l.paper).length * 30 + Object.values(checks).filter(Boolean).length * 100;
  return { answers, evidence, complete, skills, successfulCheck, paperDone, workbench, xp, level1Passed: levels[1].passed, levels, checks, constructions, firstSummitAt: firstA?.at, retentionReadyAt: firstA ? firstA.at + RETENTION_MS : void 0 };
}
function visibleEvidenceAnswers(events, checkpointIds) {
  const seen = /* @__PURE__ */ new Set();
  const answers = events.filter((e) => {
    if (e.type !== "answer" || seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
  const groups = /* @__PURE__ */ new Map();
  for (const e of answers) if (e.payload.context === "check" && checkpointIds.includes(e.payload.questionId)) {
    const key = checkGroup(e.payload.questionId) + "|" + e.payload.sessionId;
    const ids = groups.get(key) || /* @__PURE__ */ new Set();
    ids.add(e.payload.questionId);
    groups.set(key, ids);
  }
  return answers.filter((e) => {
    if (e.payload.context === "probe") return false;
    if (e.payload.context !== "check") return true;
    const group = checkGroup(e.payload.questionId);
    return !!group && CHECKS[group].every((id) => groups.get(group + "|" + e.payload.sessionId)?.has(id));
  });
}

// app/geometry-math.ts
function parallelImage([x, y, z], view = "spatial", angle = 28, tilt = 24) {
  if (view === "front") return [x, -z];
  if (view === "top") return [x, -y];
  if (view === "right") return [y, -z];
  if (view === "scaled") return [4 * x + y, -Math.sqrt(3) * y - 4 * z];
  if (view === "equal-image") return [0.5 * x + 0.5 * y, -Math.sqrt(3) / 2 * y - 0.5 * z];
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
  const questionIds = blocksForLevel(1).flatMap((block) => block.questionIds);
  const answered = questionIds.filter((id) => progress.evidence[id]).length;
  const blocks2 = blocksForLevel(1).filter((block) => progress.complete.includes(block.id)).length;
  const milestones = blocks2 + Number(progress.successfulCheck) + Number(progress.paperDone);
  const total = questionIds.length + blocksForLevel(1).length + 2;
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

// app/projection-lesson-math.ts
var LESSON_CAMERA = [28, 35];

// app/question-visuals.ts
function questionGeometry(q, reveal = false, answer = []) {
  let points = { ...q.extraPoints || {} }, highlights = [...q.highlights || []], planes = (q.planes || []).map((p2) => [...p2]);
  let selected = [], segments = [];
  let view = "spatial";
  let dimensions = [1, 1, 1], camera = [28, 24];
  if (!reveal) {
    if (q.id === "p2") delete points.M;
    if (q.id === "cp-p1") delete points.N;
  }
  if (q.id === "p1") view = "scaled";
  if (q.id === "probe-p1") {
    view = "spatial";
    camera = LESSON_CAMERA;
  }
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
  return { points, highlights, planes, selected, segments, view, dimensions, camera };
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
near(length2(pi(CUBE.E, "scaled")), 4);
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

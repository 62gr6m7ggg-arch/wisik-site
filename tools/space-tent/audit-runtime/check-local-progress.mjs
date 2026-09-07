// scripts/check-local-progress.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

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
  const successfulCheck = Object.values(sessions).some((es) => es.length === BANK.checkpointIds.length && new Set(es.map((e) => e.payload.questionId)).size === BANK.checkpointIds.length && es.every((e) => correctAnswer(QUESTIONS[e.payload.questionId], e.payload.answer) && !e.payload.helped));
  const paper2 = events.filter((e) => e.type === "paper").at(-1);
  const paperDone = Array.isArray(paper2?.payload.checks) && paper2.payload.checks.length === 4;
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
var CUBE = { A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0], E: [0, 0, 1], F: [1, 0, 1], G: [1, 1, 1], H: [0, 1, 1] };
var sub = (a, b) => a.map((x, i) => x - b[i]);
var dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
var cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
var distance = (a, b) => Math.sqrt(dot(sub(a, b), sub(a, b)));

// app/workbench-math.ts
function initialPoints(variant) {
  return { ...CUBE, ...variant === 1 ? { P: [0, 0, 0.3], Q: [1, 0, 0.6], R: [1, 1, 0.8] } : { P: [0, 0, 0.4], Q: [1, 0, 0.7], R: [1, 1, 0.5] } };
}
function sectionPoints(variant) {
  const p = initialPoints(variant);
  return [p.P, p.Q, p.R, [0, 1, p.P[2] + p.R[2] - p.Q[2]]];
}
function pointOnSegment(p, l) {
  return distance(p, l.a) + distance(p, l.b) - distance(l.a, l.b) < 1e-6;
}
function verifyWorkbench(input, points, variant) {
  if (!Array.isArray(input) || !points || typeof points !== "object") return false;
  const vec = (p) => Array.isArray(p) && p.length === 3 && p.every((x) => typeof x === "number" && Number.isFinite(x) && Math.abs(x) < 20);
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

// app/local-progress.ts
var LOCAL_PROGRESS_KEY = "wisik.space-tent.progress.v1";
var LOCAL_PROGRESS_FORMAT = "wisik-space-tent-progress";
var LOCAL_PROGRESS_VERSION = 1;
var MAX_PROGRESS_CHARACTERS = 2e6;
var MAX_PROGRESS_EVENTS = 5e3;
var contexts = {
  practice: new Set(BANK.blocks.flatMap((b) => b.questionIds)),
  probe: new Set(BANK.blocks.flatMap((b) => b.probeIds)),
  retest: new Set(BANK.blocks.flatMap((b) => b.retestIds)),
  check: new Set(BANK.checkpointIds)
};
var paperChecks = ["figure", "relations", "intersection", "reason"];
var record = (v) => !!v && typeof v === "object" && !Array.isArray(v);
var own = (v, key) => Object.prototype.hasOwnProperty.call(v, key);
function fail(message) {
  throw new Error(message);
}
var clone = (events) => JSON.parse(JSON.stringify(events));
var vector = (v) => Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === "number" && Number.isFinite(n) && Math.abs(n) < 20);
function normalizeEvent(value) {
  if (!record(value) || typeof value.id !== "string" || !/^[a-zA-Z0-9-]{10,80}$/.test(value.id) || typeof value.at !== "number" || !Number.isSafeInteger(value.at) || value.at < 0 || value.at > 864e13 || !record(value.payload)) fail("Het voortgangsbestand bevat een ongeldige handeling.");
  const payload = value.payload;
  let clean;
  if (value.type === "answer") {
    const { questionId, answer: answer2, helped, context, sessionId } = payload;
    if (typeof questionId !== "string" || !own(QUESTIONS, questionId)) fail("Het voortgangsbestand bevat een onbekende vraag.");
    const question = QUESTIONS[questionId];
    if (typeof context !== "string" || !own(contexts, context) || !contexts[context].has(questionId)) fail("Een antwoord hoort niet bij deze oefenreeks.");
    const allowed = question.type === "choice" ? (question.options || []).map((o) => o.id) : [...Object.keys(CUBE), ...Object.keys(question.extraPoints || {})];
    const answerCount = question.selectCount || (question.type === "points" ? question.answer.length : 1);
    if (!Array.isArray(answer2) || answer2.length !== answerCount || answer2.some((v) => typeof v !== "string" || !allowed.includes(v)) || new Set(answer2).size !== answer2.length || typeof helped !== "boolean" || typeof sessionId !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(sessionId)) fail("Het voortgangsbestand bevat een ongeldig antwoord.");
    clean = { questionId, answer: [...answer2], helped, context, sessionId, correct: correctAnswer(question, answer2) };
  } else if (value.type === "block") {
    const block2 = BANK.blocks.find((b) => b.id === payload.blockId);
    if (!block2) fail("Het voortgangsbestand bevat een onbekend lesblok.");
    clean = { blockId: block2.id };
  } else if (value.type === "paper") {
    const { checks } = payload;
    if (!Array.isArray(checks) || checks.length > 4 || checks.some((v) => typeof v !== "string" || !paperChecks.includes(v)) || new Set(checks).size !== checks.length) fail("Het voortgangsbestand bevat een ongeldige zelfcontrole.");
    clean = { checks: paperChecks.filter((check2) => checks.includes(check2)), source: "self-check" };
  } else if (value.type === "workbench") {
    const { lines, points, variant, helped } = payload;
    if (variant !== 0 && variant !== 1 || typeof helped !== "boolean" || !Array.isArray(lines) || lines.length > 60 || !record(points) || Object.keys(points).length > 32 || Object.values(points).some((p) => !vector(p))) fail("Het voortgangsbestand bevat een ongeldige constructie.");
    const proof = lines.map((line, index) => {
      if (!record(line) || !vector(line.a) || !vector(line.b) || distance(line.a, line.b) <= 1e-6 || line.infinite !== void 0 && typeof line.infinite !== "boolean") fail("Het voortgangsbestand bevat een ongeldige constructielijn.");
      return { id: `proof-${index}`, name: `h${index + 1}`, a: [...line.a], b: [...line.b], infinite: line.infinite === true };
    });
    const cleanPoints = initialPoints(variant);
    clean = { variant, helped, lines: proof, points: cleanPoints, correct: verifyWorkbench(proof, cleanPoints, variant) };
  } else fail("Het voortgangsbestand bevat een onbekende handeling.");
  return { id: value.id, type: value.type, at: value.at, payload: clean };
}
function orderedUnique(events) {
  const byId = /* @__PURE__ */ new Map();
  for (const event of events) {
    const previous = byId.get(event.id);
    if (previous) {
      if (previous.type !== event.type || JSON.stringify(previous.payload) !== JSON.stringify(event.payload)) fail("Twee handelingen hebben hetzelfde nummer maar een verschillende inhoud. Er is niets overschreven.");
    } else byId.set(event.id, event);
  }
  if (byId.size > MAX_PROGRESS_EVENTS) fail("Er zijn te veel opgeslagen handelingen voor \xE9\xE9n voortgangsbestand. Bewaar eerst een kopie van je voortgang.");
  return [...byId.values()].sort((a, b) => a.at - b.at);
}
function validateBlockEvidence(events) {
  const attempted = /* @__PURE__ */ new Set();
  for (const event of events) {
    if (event.type === "answer" && event.payload.context === "practice") attempted.add(String(event.payload.questionId));
    if (event.type === "block") {
      const block2 = BANK.blocks.find((b) => b.id === event.payload.blockId);
      if (!block2.questionIds.every((id) => attempted.has(id))) fail("Een lesblok is als afgerond gemarkeerd terwijl niet alle oefenantwoorden aanwezig zijn.");
    }
  }
}
function validateLocalEvents(values) {
  if (!Array.isArray(values) || values.length > MAX_PROGRESS_EVENTS) fail("Het voortgangsbestand bevat geen geldige reeks handelingen.");
  const events = orderedUnique(values.map(normalizeEvent));
  validateBlockEvidence(events);
  return events;
}
function mergeLocalEvents(existing, incoming) {
  const events = orderedUnique([...validateLocalEvents(existing), ...validateLocalEvents(incoming)]);
  validateBlockEvidence(events);
  return events;
}
function parse(text) {
  if (typeof text !== "string" || text.length > MAX_PROGRESS_CHARACTERS) fail("Het voortgangsbestand is te groot.");
  let envelope2;
  try {
    envelope2 = JSON.parse(text);
  } catch {
    return fail("Dit is geen leesbaar voortgangsbestand. Je bestaande voortgang is niet vervangen.");
  }
  if (!record(envelope2) || envelope2.format !== LOCAL_PROGRESS_FORMAT || envelope2.version !== LOCAL_PROGRESS_VERSION) fail("Dit bestand is geen ondersteunde Space-tent-voortgang.");
  return validateLocalEvents(envelope2.events);
}
function serialize(events) {
  const envelope2 = { format: LOCAL_PROGRESS_FORMAT, version: LOCAL_PROGRESS_VERSION, events };
  const text = JSON.stringify(envelope2);
  if (text.length > MAX_PROGRESS_CHARACTERS) fail("Je voortgang is te groot voor de lokale opslag. Bewaar eerst een kopie van je voortgang.");
  return text;
}
function createLocalProgressStore(storage) {
  let lastGood = [];
  const getStorage = () => typeof storage === "function" ? storage() : storage;
  function read() {
    let text;
    try {
      text = getStorage().getItem(LOCAL_PROGRESS_KEY);
    } catch {
      return fail("De browser geeft geen toegang tot je lokale voortgang. Je voortgang is nog niet veilig opgeslagen.");
    }
    return text === null ? [] : parse(text);
  }
  function success(events) {
    lastGood = clone(events);
    return { ok: true, events: clone(events) };
  }
  function failure(error) {
    return { ok: false, events: clone(lastGood), error: error instanceof Error ? error.message : "Je voortgang kon niet worden bewaard." };
  }
  function write(events) {
    const text = serialize(events);
    try {
      getStorage().setItem(LOCAL_PROGRESS_KEY, text);
    } catch {
      return fail("Opslaan op dit apparaat is niet gelukt. De browseropslag is vol of geblokkeerd. Je nieuwste handeling is nog niet bewaard; probeer opnieuw.");
    }
    let saved;
    try {
      saved = getStorage().getItem(LOCAL_PROGRESS_KEY);
    } catch {
      return fail("De browser kon niet bevestigen dat je voortgang is opgeslagen. Probeer opnieuw.");
    }
    if (saved !== text) fail("De browser heeft je voortgang niet bevestigd. Je nieuwste handeling is nog niet veilig bewaard.");
    return success(events);
  }
  return {
    load() {
      try {
        return success(read());
      } catch (error) {
        return failure(error);
      }
    },
    append(event, at = Date.now()) {
      try {
        const existing = read();
        const time2 = Math.max(at, existing.at(-1)?.at ?? 0);
        const next = normalizeEvent({ ...event, at: time2 });
        if (next.type === "workbench" && !next.payload.correct) fail("De constructie is nog niet compleet. Controleer de vier zijden van de doorsnede voordat je deze afrondt.");
        const merged = orderedUnique([...existing, next]);
        validateBlockEvidence(merged);
        return write(merged);
      } catch (error) {
        return failure(error);
      }
    },
    exportProgress() {
      try {
        const events = read();
        return { ...success(events), text: serialize(events) };
      } catch (error) {
        return failure(error);
      }
    },
    importProgress(text) {
      try {
        return write(mergeLocalEvents(read(), parse(text)));
      } catch (error) {
        return failure(error);
      }
    }
  };
}

// scripts/check-local-progress.mjs
var localEntry = resolve(process.cwd(), "app/local-progress.ts");
var serial = 0;
var freshId = () => `local-test-${String(++serial).padStart(6, "0")}`;
var answer = (questionId, value = QUESTIONS[questionId].answer, extras = {}) => ({ id: freshId(), type: "answer", payload: { questionId, answer: [...value], helped: false, context: "practice", sessionId: "learning-session-1", ...extras } });
var stamped = (event, at = ++serial) => ({ ...event, at });
var envelope = (events) => JSON.stringify({ format: LOCAL_PROGRESS_FORMAT, version: LOCAL_PROGRESS_VERSION, events });
var MemoryStorage = class {
  values = /* @__PURE__ */ new Map();
  writes = 0;
  denyRead = false;
  denyWrite = false;
  discardWrite = false;
  getItem(key) {
    if (this.denyRead) throw new Error("SecurityError");
    return this.values.get(key) ?? null;
  }
  setItem(key, text) {
    if (this.denyWrite) throw new Error("QuotaExceededError");
    this.writes++;
    if (!this.discardWrite) this.values.set(key, text);
  }
};
var create = () => {
  const storage = new MemoryStorage();
  return { storage, store: createLocalProgressStore(storage) };
};
var eventCount = (result) => {
  assert.equal(result.ok, true, result.error);
  return result.events.length;
};
var assertFailure = (result, pattern) => {
  assert.equal(result.ok, false);
  assert.match(result.error, pattern);
};
var invalidImport = (events, pattern) => {
  const { store, storage } = create();
  store.append(answer("p1"), 1);
  const previous = storage.getItem(LOCAL_PROGRESS_KEY);
  assertFailure(store.importProgress(envelope(events)), pattern);
  assert.equal(storage.getItem(LOCAL_PROGRESS_KEY), previous, "Invalid imports must never overwrite existing progress");
};
var networkCalls = 0;
var originalFetch = globalThis.fetch;
globalThis.fetch = () => {
  networkCalls++;
  throw new Error("Local progress must not use fetch");
};
var first = create();
assert.deepEqual(first.store.load(), { ok: true, events: [] });
var wrong = answer("p1", ["a"], { correct: true });
assert.equal(eventCount(first.store.append(wrong, 100)), 1);
var reloaded = createLocalProgressStore(first.storage).load();
assert.equal(reloaded.events[0].payload.correct, false, "Ignore claimed correctness");
assert.equal(deriveProgress(reloaded.events).xp, 0);
var right = answer("p1");
assert.equal(eventCount(first.store.append(right, 101)), 2);
var progress = deriveProgress(first.store.load().events);
assert.equal(progress.evidence.p1.independent, false, "A corrected answer remains a retry after reload");
assert.equal(progress.xp, 10);
assert.equal(eventCount(first.store.append(right, 999)), 2, "Retrying an event ID is idempotent");
var exported = first.store.exportProgress();
assert.equal(exported.ok, true);
var second = create();
second.store.append(answer("p2"), 102);
assert.equal(eventCount(second.store.importProgress(exported.text)), 3);
assert.equal(eventCount(second.store.importProgress(exported.text)), 3, "Repeated import does not add attempts or XP");
assert.equal(deriveProgress(second.store.load().events).xp, 30);
assert.equal(eventCount(createLocalProgressStore(second.storage).load()), 3);
assert.equal(eventCount(first.store.load()), 2, "Export/import does not mutate the source device");
var beforeConflict = first.storage.getItem(LOCAL_PROGRESS_KEY);
assertFailure(first.store.append({ ...wrong, payload: { ...wrong.payload, answer: ["c"] } }, 200), /hetzelfde nummer/);
assert.equal(first.storage.getItem(LOCAL_PROGRESS_KEY), beforeConflict);
var isolated = first.store.load();
isolated.events[0].payload.answer[0] = "c";
assert.equal(first.store.load().events[0].payload.answer[0], "a");
for (const block2 of BANK.blocks) for (const [context, ids] of [["practice", block2.questionIds], ["probe", block2.probeIds], ["retest", block2.retestIds]]) {
  for (const id of ids) {
    const result = create().store.append(answer(id, QUESTIONS[id].answer, { context }));
    assert.equal(result.ok, true, id + ": " + result.error);
    assert.equal(result.events[0].payload.correct, true, id);
  }
}
invalidImport([stamped(answer("p1", ["c"], { context: "check" }))], /oefenreeks/);
invalidImport([stamped(answer("p1", ["niet-bestaand"]))], /ongeldig antwoord/);
invalidImport([stamped(answer("v3", ["A", "A"]))], /ongeldig antwoord/);
invalidImport([stamped({ ...answer("p1"), payload: { ...answer("p1").payload, questionId: "__proto__" } })], /onbekende vraag/);
invalidImport([{ id: freshId(), at: 1, type: "admin", payload: { level1Passed: true } }], /onbekende handeling/);
invalidImport([{ ...stamped(answer("p1")), at: 1.5 }], /ongeldige handeling/);
var block = BANK.blocks[0];
var blockEvent = { id: freshId(), type: "block", payload: { blockId: block.id } };
invalidImport([stamped(blockEvent)], /niet alle oefenantwoorden/);
invalidImport([stamped({ ...blockEvent, payload: { blockId: "level-seven" } })], /onbekend lesblok/);
var covered = create();
block.questionIds.forEach((id, i) => assert.equal(covered.store.append(answer(id), 10 + i).ok, true));
assert.equal(covered.store.append(blockEvent, 20).ok, true);
assert.deepEqual(deriveProgress(covered.store.load().events).complete, [block.id]);
assert.equal(deriveProgress(covered.store.load().events).level1Passed, false);
invalidImport([stamped(blockEvent, 0), ...block.questionIds.map((id, i) => stamped(answer(id), i + 1))], /niet alle oefenantwoorden/);
var check = create();
for (const [i, id] of BANK.checkpointIds.entries()) {
  assert.equal(check.store.append(answer(id, QUESTIONS[id].answer, { context: "check", sessionId: "check-session" }), 100 + i).ok, true);
  assert.equal(deriveProgress(check.store.load().events).successfulCheck, i === BANK.checkpointIds.length - 1);
}
assert.equal(deriveProgress(check.store.load().events).level1Passed, false);
var checkEvents = check.store.load().events;
var changedCheck = checkEvents.map((event, i) => i ? event : { ...event, payload: { ...event.payload, answer: [QUESTIONS[event.payload.questionId].options.find((o) => !QUESTIONS[event.payload.questionId].answer.includes(o.id)).id], correct: true } });
var tampered = create();
assert.equal(tampered.store.importProgress(envelope(changedCheck)).ok, true);
assert.equal(deriveProgress(tampered.store.load().events).successfulCheck, false, "Do not trust imported checkpoint success");
var differentSessions = create();
assert.equal(differentSessions.store.importProgress(envelope(checkEvents.map((event, i) => ({ ...event, payload: { ...event.payload, sessionId: `session-${i}` } })))).ok, true);
assert.equal(deriveProgress(differentSessions.store.load().events).successfulCheck, false);
invalidImport([{ id: freshId(), at: 1, type: "paper", payload: { checks: ["figure", "figure", "figure", "figure"] } }], /ongeldige zelfcontrole/);
var paper = create();
paper.store.append({ id: freshId(), type: "paper", payload: { checks: ["figure"], source: "teacher-certified" } }, 1);
assert.equal(deriveProgress(paper.store.load().events).paperDone, false);
paper.store.append({ id: freshId(), type: "paper", payload: { checks: ["figure", "relations", "intersection", "reason"], source: "teacher-certified" } }, 2);
assert.equal(deriveProgress(paper.store.load().events).paperDone, true);
assert.equal(paper.store.load().events[1].payload.source, "self-check");
var full = create();
var time = 0;
for (const b of BANK.blocks) {
  for (const id of b.questionIds) full.store.append(answer(id), ++time);
  full.store.append({ id: freshId(), type: "block", payload: { blockId: b.id } }, ++time);
}
assert.equal(deriveProgress(full.store.load().events).level1Passed, false);
full.store.importProgress(check.store.exportProgress().text);
assert.equal(deriveProgress(full.store.load().events).level1Passed, false);
full.store.importProgress(paper.store.exportProgress().text);
assert.equal(deriveProgress(full.store.load().events).level1Passed, true);
assert.equal(deriveProgress(createLocalProgressStore(full.storage).load().events).level1Passed, true);
for (const variant of [0, 1]) {
  const construct = create();
  const points = initialPoints(variant), corners = sectionPoints(variant);
  const lines = corners.map((a, i) => ({ id: freshId(), name: "private-name-must-not-survive", a, b: corners[(i + 1) % 4] }));
  const event = { id: freshId(), type: "workbench", payload: { variant, helped: false, correct: false, points: { ...points, privatePointName: [0, 0, 0] }, lines, userId: "private-account-id" } };
  assert.equal(construct.store.append(event, 100).ok, true);
  assert.equal(deriveProgress(construct.store.load().events).xp, 60);
  const copy = construct.store.exportProgress();
  assert.ok(!copy.text.includes("private-") && !copy.text.includes("privatePointName") && !copy.text.includes("userId"));
  const other = create();
  assert.equal(other.store.importProgress(copy.text).ok, true);
  assert.equal(deriveProgress(createLocalProgressStore(other.storage).load().events).workbench.payload.correct, true);
  const wrongProof = { ...event, id: freshId(), payload: { ...event.payload, lines: lines.slice(0, 3), correct: true } };
  const rejected = create();
  assertFailure(rejected.store.append(wrongProof), /nog niet compleet/);
  assert.equal(rejected.store.load().events.length, 0);
  const proofImport = create();
  assert.equal(proofImport.store.importProgress(envelope([stamped(wrongProof)])).ok, true);
  assert.equal(deriveProgress(proofImport.store.load().events).workbench, void 0, "A forged correct flag must not pass an incomplete construction");
  const forged = { id: freshId(), type: "workbench", at: 1, payload: { correct: true, variant, helped: false } };
  invalidImport([forged], /ongeldige constructie/);
}
var safe = create();
safe.store.append(answer("p1"), 100);
var beforeBadFile = safe.storage.getItem(LOCAL_PROGRESS_KEY);
for (const text of ["not JSON", "<html>wrong file</html>", "{}", JSON.stringify({ format: LOCAL_PROGRESS_FORMAT, version: 999, events: [] }), " ".repeat(MAX_PROGRESS_CHARACTERS + 1)]) {
  assert.equal(safe.store.importProgress(text).ok, false);
  assert.equal(safe.storage.getItem(LOCAL_PROGRESS_KEY), beforeBadFile);
}
safe.storage.values.set(LOCAL_PROGRESS_KEY, "damaged");
assertFailure(safe.store.load(), /geen leesbaar/);
assertFailure(safe.store.append(answer("p2")), /geen leesbaar/);
assert.equal(safe.storage.getItem(LOCAL_PROGRESS_KEY), "damaged", "Do not silently replace corrupt storage");
var quota = create();
quota.store.append(answer("p1"), 100);
var beforeQuota = quota.storage.getItem(LOCAL_PROGRESS_KEY);
quota.storage.denyWrite = true;
var unsaved = answer("p2");
assertFailure(quota.store.append(unsaved, 101), /vol of geblokkeerd/);
assert.equal(quota.storage.getItem(LOCAL_PROGRESS_KEY), beforeQuota);
assert.equal(quota.store.load().events.length, 1);
assertFailure(quota.store.importProgress(exported.text), /vol of geblokkeerd/);
assert.equal(quota.storage.getItem(LOCAL_PROGRESS_KEY), beforeQuota);
quota.storage.denyWrite = false;
assert.equal(quota.store.append(unsaved, 102).ok, true);
assert.equal(quota.store.load().events.length, 2);
var inaccessible = createLocalProgressStore(() => {
  throw new Error("SecurityError");
});
assertFailure(inaccessible.load(), /geen toegang/);
assertFailure(inaccessible.append(answer("p1")), /geen toegang/);
var silent = create();
silent.storage.discardWrite = true;
assertFailure(silent.store.append(answer("p1")), /niet bevestigd/);
assert.equal(silent.store.load().events.length, 0);
var tabs = create();
var tabTwo = createLocalProgressStore(tabs.storage);
tabs.store.append(answer("p1", ["a"]), 1e3);
tabTwo.append(answer("p1"), 1);
assert.equal(tabs.store.load().events.length, 2);
assert.equal(deriveProgress(tabs.store.load().events).evidence.p1.independent, false);
assert.equal(networkCalls, 0);
globalThis.fetch = originalFetch;
var source = readFileSync(localEntry, "utf8");
assert.ok(!/\b(fetch|XMLHttpRequest|sendBeacon|WebSocket)\s*\(/.test(source), "The adapter contains no network sender");
console.log("Local progress checks passed: all 41 questions, fresh/reloaded storage, scoring and level gates, proof rechecking for both construction variants, duplicate/conflicting IDs, safe import/export, malformed files, quota/security failures, clock reversal and no network calls.");

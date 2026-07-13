import type { AcademyContent } from "../domains/academy/validation/validateEducationContent";
import type { SessionTemplatePart } from "../domains/academy/entities/SessionTemplatePart";
import {
  toEducationBlockId,
  toExerciseId,
  toLearningQuestionId,
  toProgramId,
  toSessionTemplateId,
  toThemeId,
} from "../domains/academy/types/ids";

const PROGRAM_ID = toProgramId("program-7v7");

const questions: AcademyContent["learningQuestions"] = [
  {
    id: toLearningQuestionId("Q1"),
    programId: PROGRAM_ID,
    title: "Hur gor jag mig spelbar?",
    description:
      "Spelvinkel, spelavstand, scanning, kommunikation och mottagning.",
  },
  {
    id: toLearningQuestionId("Q2"),
    programId: PROGRAM_ID,
    title: "Hur skapar jag yta at mig sjalv?",
    description:
      "Rorelse fore boll, komma loss fran markering och skapa tid.",
  },
  {
    id: toLearningQuestionId("Q3"),
    programId: PROGRAM_ID,
    title: "Hur vinner jag min 1 mot 1?",
    description:
      "Tempovaxling, riktningsforandring, skydda boll, press och fordrojning.",
  },
  {
    id: toLearningQuestionId("Q4"),
    programId: PROGRAM_ID,
    title: "Hur skapar vi ett overlage?",
    description:
      "2 mot 1, 3 mot 2, fri spelare och att lasa forsvararens beslut.",
  },
  {
    id: toLearningQuestionId("Q5"),
    programId: PROGRAM_ID,
    title: "Hur tar vi oss framat tillsammans?",
    description:
      "Diamantstruktur, hitta ytter, mittfaltare eller anfallare och spela forbi press.",
  },
  {
    id: toLearningQuestionId("Q6"),
    programId: PROGRAM_ID,
    title: "Hur skapar vi malchanser?",
    description: "Kreativitet, mod, kombinationer, utmaningar och avslut.",
  },
];

const exercises: AcademyContent["exercises"] = [
  {
    id: toExerciseId("ex-2v1-standard"),
    title: "Standard 2 mot 1 Battle Rondo",
    activityType: "Battle Rondo",
    players: "3-9",
    duration: 12,
    area: "7 x 7 till 10 x 10 m",
    purpose:
      "Lara spelarna att paverka forsvararen och valja mellan passning och dribbling.",
    setup: [
      "En bollhallare, en fri spelare och en forsvarare.",
      "Den fria spelaren skapar bredd och ratt spelavstand.",
    ],
    rules: [
      "Bollhallaren maste driva in i ytan innan passning.",
      "Poang nar bollen kontrollerat fors ut genom bortre sidan.",
    ],
    coachingPoints: [
      "Driv mot forsvararen.",
      "Las forsvararens reaktion.",
      "Kommunicera: driv, passa eller fortsatt.",
    ],
    progressions: [
      "Minska ytan.",
      "Lagg till aterhamtande forsvarare.",
      "Infor tidsgrans.",
    ],
    simplifications: ["Oka ytan.", "Lat forsvararen starta langre bort."],
    tags: ["2v1", "fri spelare", "lasa press"],
  },
  {
    id: toExerciseId("ex-4v1"),
    title: "4 mot 1 Rondo",
    activityType: "Rondo",
    players: "5-10",
    duration: 12,
    area: "8 x 8 m",
    purpose: "Utveckla mottagning, spelbarhet, kommunikation och presslasning.",
    setup: [
      "Fyra spelare runt kvadraten och en forsvarare i mitten.",
      "Spelarna haller sin sida.",
    ],
    rules: ["Tva tillslag.", "Passning till narliggande sida."],
    coachingPoints: [
      "Ta emot med bortre fot.",
      "Ror dig fore passningen.",
      "Ge tydlig information.",
    ],
    progressions: ["Mindre yta.", "Ett tillslag nar mojligt."],
    simplifications: ["Storre yta.", "Passiv forsvarare forsta minuten."],
    tags: ["rondo", "mottagning", "kommunikation"],
  },
  {
    id: toExerciseId("ex-buildout-winger"),
    title: "2 mot 1 - hitta yttern",
    activityType: "Utbrytsspel",
    players: "4-10",
    duration: 18,
    area: "Halv planhalva, delad vertikalt",
    purpose:
      "Aterskapa relationen mellan forsvarare och ytter i uppbyggnadsspelet.",
    setup: [
      "Malvakt startar hos forsvarare.",
      "Ytter haller bredd. En motstandare pressar.",
    ],
    rules: [
      "Anfallarna gor mal i litet mal eller driver over linje.",
      "Forsvararen far kontra mot stort mal.",
    ],
    coachingPoints: [
      "Driv fram i fart.",
      "Passa till ratt fot.",
      "Flytta fram nar bollen gar framat.",
    ],
    progressions: [
      "5-7 sekunders tidsgrans.",
      "Lagg till aterhamtande forsvarare.",
    ],
    simplifications: ["Forsvararen startar langre bort.", "Storre korridor."],
    tags: ["uppbyggnad", "ytter", "2v1"],
  },
  {
    id: toExerciseId("ex-pattern-winger"),
    title: "Monsterspel - hitta yttern",
    activityType: "Mönsterspel",
    players: "7-14",
    duration: 10,
    area: "7 mot 7-plan",
    purpose: "Tydliggora avstand, forflyttningar och kollektiv framflyttning.",
    setup: [
      "Hela laget i diamantstruktur.",
      "Bollen flyttas sida till sida innan progression.",
    ],
    rules: [
      "Alla flyttar fram nar bollhallaren gar framat.",
      "Anfallaren haller vertikal linje med bollhallaren.",
    ],
    coachingPoints: ["Ratt avstand.", "Flytta som en enhet.", "Kommunicera fore mottagning."],
    progressions: [
      "Lagg till skuggmotstand.",
      "Lat spelarna valja losning sjalva.",
    ],
    simplifications: ["Genomfor utan motstand i lugnt tempo."],
    tags: ["diamant", "monsterspel", "ytter"],
  },
  {
    id: toExerciseId("ex-5v5-four-goals"),
    title: "5 mot 5 med fyra mal",
    activityType: "Smålagsspel",
    players: "10-14",
    duration: 25,
    area: "35 x 25 m",
    purpose:
      "Ge spelarna en fri, matchlik miljo dar de kan kanna igen overlagen.",
    setup: ["Tva lag. Tva sma mal pa vardera kortsidan."],
    rules: [
      "Fritt spel.",
      "Bonuspoang nar laget spelar forbi press genom ett 2 mot 1.",
    ],
    coachingPoints: ["Observera mer an du instruerar.", "Fraga vad spelarna sag."],
    progressions: ["Ta bort bonusregeln.", "Oka planens langd."],
    simplifications: [
      "Gor malen storre.",
      "Skapa numerart overlage for bollhallande lag.",
    ],
    tags: ["smalagsspel", "kreativitet", "2v1"],
  },
  {
    id: toExerciseId("ex-back-pressure"),
    title: "1 mot 1 med ryggen mot press",
    activityType: "Battle Rondo",
    players: "3-9",
    duration: 12,
    area: "7 x 7 m",
    purpose: "Utveckla scanning, skydda boll och beslutet att vanda eller spela tillbaka.",
    setup: [
      "Mottagare i mitten, passare framfor och forsvarare bakom.",
    ],
    rules: [
      "Forsvararen far ga nar passningen slas.",
      "Mottagaren far vanda eller sakra bollen tillbaka.",
    ],
    coachingPoints: [
      "Titta over axeln.",
      "Kann trycket.",
      "Anvand kroppen mellan boll och motstandare.",
    ],
    progressions: ["Passaren foljer med och skapar 2 mot 1."],
    simplifications: ["Forsvararen startar langre bort."],
    tags: ["anfallare", "rygg mot mal", "scanning"],
  },
];

const themes: AcademyContent["themes"] = questions.map((question) => ({
  id: toThemeId(`theme-${question.id}`),
  learningQuestionId: question.id,
  title: question.title,
  description: question.description,
}));

const educationBlocks: AcademyContent["educationBlocks"] = [
  {
    id: toEducationBlockId("block-spelbarhet"),
    themeId: toThemeId("theme-Q1"),
    title: "Spelvinkel och spelavstand",
    level: 1,
    description:
      "Spelarna lar sig att skapa en tydlig passningslinje och ett anvandbart avstand till bollhallaren.",
    desiredBehaviours: [
      "Flytta fore passningen.",
      "Visa ratt fot.",
      "Kommunicera tidigt.",
    ],
  },
  {
    id: toEducationBlockId("block-winger"),
    themeId: toThemeId("theme-Q4"),
    title: "Hitta yttern genom 2 mot 1",
    level: 1,
    description:
      "Spelarna lar sig att skapa och utnyttja ett numerart overlage pa kanten.",
    desiredBehaviours: [
      "Bollhallaren driver mot forsvararen.",
      "Yttern skapar bredd.",
      "Beslut tas efter forsvararens agerande.",
    ],
  },
  {
    id: toEducationBlockId("block-striker"),
    themeId: toThemeId("theme-Q5"),
    title: "Involvera anfallaren",
    level: 1,
    description:
      "Laget anvander anfallaren som framatriktad losning och stodpunkt.",
    desiredBehaviours: [
      "Anfallaren ligger i linje med bollen.",
      "Scanna fore mottagning.",
      "Vand eller spela tillbaka utifran press.",
    ],
  },
];

const wingerParts: SessionTemplatePart[] = [
  {
    exerciseId: toExerciseId("ex-2v1-standard"),
    duration: 12,
    focus:
      "Spelavstand, locka forsvararen och valj passning eller dribbling.",
  },
  {
    exerciseId: toExerciseId("ex-4v1"),
    duration: 12,
    focus: "Mottagning med bortre fot, las press och kommunicera.",
  },
  {
    exerciseId: toExerciseId("ex-buildout-winger"),
    duration: 18,
    focus: "Aterskapa 2 mot 1 mellan forsvarare och ytter.",
  },
  {
    exerciseId: toExerciseId("ex-pattern-winger"),
    duration: 10,
    focus: "Hela laget kanner igen situationen.",
    optional: true,
  },
  {
    exerciseId: toExerciseId("ex-5v5-four-goals"),
    duration: 25,
    focus: "Fri tillampning i matchlik miljo.",
  },
];

const sessionTemplates: AcademyContent["sessionTemplates"] = [
  {
    id: toSessionTemplateId("session-spelbarhet-1"),
    title: "Spelbarhet - introduktion",
    blockId: toEducationBlockId("block-spelbarhet"),
    stage: "Introduktion",
    duration: 70,
    players: "10-14",
    keyMessage:
      "Flytta dig sa att bollhallaren ser en tydlig och anvandbar passningslinje.",
    objectives: [
      "Skapa vinkel.",
      "Ta emot med oppet kroppslage.",
      "Kommunicera fore passning.",
    ],
    parts: [
      {
        exerciseId: toExerciseId("ex-4v1"),
        duration: 15,
        focus: "Rorelse och mottagning.",
      },
      {
        exerciseId: toExerciseId("ex-5v5-four-goals"),
        duration: 30,
        focus: "Kann igen var ny spelbarhet behover skapas.",
      },
    ],
    reflectionQuestions: [
      "Nar blev du latt att passa?",
      "Hur kunde du visa vilken fot du ville ha bollen pa?",
    ],
  },
  {
    id: toSessionTemplateId("session-winger-1"),
    title: "Hitta yttern - introduktion",
    blockId: toEducationBlockId("block-winger"),
    stage: "Introduktion",
    duration: 77,
    players: "10-14",
    keyMessage:
      "Driv mot forsvararen och valj losning efter hur forsvararen agerar.",
    objectives: [
      "Forsta grundlaggande 2 mot 1.",
      "Skapa bredd.",
      "Kommunicera som fri spelare.",
    ],
    parts: wingerParts,
    reflectionQuestions: [
      "Nar blev yttern fri?",
      "Nar var det battre att fortsatta driva?",
    ],
  },
  {
    id: toSessionTemplateId("session-winger-2"),
    title: "Hitta yttern - hogre tempo",
    blockId: toEducationBlockId("block-winger"),
    stage: "Utveckling",
    duration: 75,
    players: "10-14",
    keyMessage: "Samma beslut, men i hogre fart och med mindre tid.",
    objectives: [
      "Utfora 2 mot 1 i fart.",
      "Passa till ratt fot.",
      "Flytta laget framat efter passningen.",
    ],
    parts: wingerParts.map((part) => ({
      ...part,
      duration: part.optional ? 8 : part.duration,
    })),
    reflectionQuestions: [
      "Hur paverkade tempot beslutet?",
      "Vad gjorde den fria spelaren for att hjalpa?",
    ],
  },
  {
    id: toSessionTemplateId("session-winger-3"),
    title: "Hitta yttern - fler alternativ",
    blockId: toEducationBlockId("block-winger"),
    stage: "Fördjupning",
    duration: 80,
    players: "10-16",
    keyMessage: "Kann igen den fria spelaren aven nar fler spelare deltar.",
    objectives: [
      "Se 2 mot 1 inom 3 mot 2.",
      "Anvand central mittfaltare som alternativ.",
    ],
    parts: wingerParts,
    reflectionQuestions: [
      "Vilka tre losningar sag ni?",
      "Hur forandrades losningen nar pressen kom centralt?",
    ],
  },
  {
    id: toSessionTemplateId("session-winger-4"),
    title: "Hitta yttern - matchlik tillampning",
    blockId: toEducationBlockId("block-winger"),
    stage: "Tillämpning",
    duration: 75,
    players: "10-16",
    keyMessage: "Identifiera sjalv nar kanten ger en fri spelare.",
    objectives: [
      "Losa temat utan tvingande regler.",
      "Forklara beslut efterat.",
    ],
    parts: [
      {
        exerciseId: toExerciseId("ex-2v1-standard"),
        duration: 10,
        focus: "Kort repetition.",
      },
      {
        exerciseId: toExerciseId("ex-5v5-four-goals"),
        duration: 45,
        focus: "Fri matchlik tillampning.",
      },
    ],
    reflectionQuestions: [
      "Vilka situationer kande ni igen sjalva?",
      "Nar valde ni en annan losning an kanten?",
    ],
  },
  {
    id: toSessionTemplateId("session-striker-1"),
    title: "Involvera anfallaren - introduktion",
    blockId: toEducationBlockId("block-striker"),
    stage: "Introduktion",
    duration: 75,
    players: "10-14",
    keyMessage: "Anfallaren scannar, sakrar eller vander utifran pressen.",
    objectives: [
      "Ta emot med ryggen mot press.",
      "Skapa understod under bollen.",
    ],
    parts: [
      {
        exerciseId: toExerciseId("ex-back-pressure"),
        duration: 15,
        focus: "Scanning och skydda boll.",
      },
      {
        exerciseId: toExerciseId("ex-4v1"),
        duration: 12,
        focus: "Information fore mottagning.",
      },
      {
        exerciseId: toExerciseId("ex-5v5-four-goals"),
        duration: 30,
        focus:
          "Anvand anfallaren som stodpunkt utan att tvinga losningen.",
      },
    ],
    reflectionQuestions: [
      "Nar kunde anfallaren vanda?",
      "Nar behovde laget ge stod under bollen?",
    ],
  },
];

export const academyContent: AcademyContent = {
  programs: [
    {
      id: PROGRAM_ID,
      title: "7 mot 7",
      description: "",
    },
  ],
  learningQuestions: questions,
  themes,
  educationBlocks,
  sessionTemplates,
  exercises,
};
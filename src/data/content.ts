import { EducationBlock, Exercise, GuidingQuestion, Session } from "@/types/education";

export const questions: GuidingQuestion[] = [
  { id: "Q1", title: "Hur gör jag mig spelbar?", description: "Spelvinkel, spelavstånd, scanning, kommunikation och mottagning." },
  { id: "Q2", title: "Hur skapar jag yta åt mig själv?", description: "Rörelse före boll, komma loss från markering och skapa tid." },
  { id: "Q3", title: "Hur vinner jag min 1 mot 1?", description: "Tempoväxling, riktningsförändring, skydda boll, press och fördröjning." },
  { id: "Q4", title: "Hur skapar vi ett överläge?", description: "2 mot 1, 3 mot 2, fri spelare och att läsa försvararens beslut." },
  { id: "Q5", title: "Hur tar vi oss framåt tillsammans?", description: "Diamantstruktur, hitta ytter, mittfältare eller anfallare och spela förbi press." },
  { id: "Q6", title: "Hur skapar vi målchanser?", description: "Kreativitet, mod, kombinationer, utmaningar och avslut." }
];

export const exercises: Exercise[] = [
  {
    id: "ex-2v1-standard",
    title: "Standard 2 mot 1 Battle Rondo",
    activityType: "Battle Rondo",
    players: "3–9",
    duration: 12,
    area: "7 × 7 till 10 × 10 m",
    purpose: "Lära spelarna att påverka försvararen och välja mellan passning och dribbling.",
    setup: ["En bollhållare, en fri spelare och en försvarare.", "Den fria spelaren skapar bredd och rätt spelavstånd."],
    rules: ["Bollhållaren måste driva in i ytan innan passning.", "Poäng när bollen kontrollerat förs ut genom bortre sidan."],
    coachingPoints: ["Driv mot försvararen.", "Läs försvararens reaktion.", "Kommunicera: driv, passa eller fortsätt."],
    progressions: ["Minska ytan.", "Lägg till återhämtande försvarare.", "Inför tidsgräns."],
    simplifications: ["Öka ytan.", "Låt försvararen starta längre bort."],
    tags: ["2v1", "fri spelare", "läsa press"]
  },
  {
    id: "ex-4v1",
    title: "4 mot 1 Rondo",
    activityType: "Rondo",
    players: "5–10",
    duration: 12,
    area: "8 × 8 m",
    purpose: "Utveckla mottagning, spelbarhet, kommunikation och pressläsning.",
    setup: ["Fyra spelare runt kvadraten och en försvarare i mitten.", "Spelarna håller sin sida."],
    rules: ["Två tillslag.", "Passning till närliggande sida."],
    coachingPoints: ["Ta emot med bortre fot.", "Rör dig före passningen.", "Ge tydlig information."],
    progressions: ["Mindre yta.", "Ett tillslag när möjligt."],
    simplifications: ["Större yta.", "Passiv försvarare första minuten."],
    tags: ["rondo", "mottagning", "kommunikation"]
  },
  {
    id: "ex-buildout-winger",
    title: "2 mot 1 – hitta yttern",
    activityType: "Utbrytsspel",
    players: "4–10",
    duration: 18,
    area: "Halv planhalva, delad vertikalt",
    purpose: "Återskapa relationen mellan försvarare och ytter i uppbyggnadsspelet.",
    setup: ["Målvakt startar hos försvarare.", "Ytter håller bredd. En motståndare pressar."],
    rules: ["Anfallarna gör mål i litet mål eller driver över linje.", "Försvararen får kontra mot stort mål."],
    coachingPoints: ["Driv fram i fart.", "Passa till rätt fot.", "Flytta fram när bollen går framåt."],
    progressions: ["5–7 sekunders tidsgräns.", "Lägg till återhämtande försvarare."],
    simplifications: ["Försvararen startar längre bort.", "Större korridor."],
    tags: ["uppbyggnad", "ytter", "2v1"]
  },
  {
    id: "ex-pattern-winger",
    title: "Mönsterspel – hitta yttern",
    activityType: "Mönsterspel",
    players: "7–14",
    duration: 10,
    area: "7 mot 7-plan",
    purpose: "Tydliggöra avstånd, förflyttningar och kollektiv framflyttning.",
    setup: ["Hela laget i diamantstruktur.", "Bollen flyttas sida till sida innan progression."],
    rules: ["Alla flyttar fram när bollhållaren går framåt.", "Anfallaren håller vertikal linje med bollhållaren."],
    coachingPoints: ["Rätt avstånd.", "Flytta som en enhet.", "Kommunicera före mottagning."],
    progressions: ["Lägg till skuggmotstånd.", "Låt spelarna välja lösning själva."],
    simplifications: ["Genomför utan motstånd i lugnt tempo."],
    tags: ["diamant", "mönsterspel", "ytter"]
  },
  {
    id: "ex-5v5-four-goals",
    title: "5 mot 5 med fyra mål",
    activityType: "Smålagsspel",
    players: "10–14",
    duration: 25,
    area: "35 × 25 m",
    purpose: "Ge spelarna en fri, matchlik miljö där de kan känna igen överlägen.",
    setup: ["Två lag. Två små mål på vardera kortsidan."],
    rules: ["Fritt spel.", "Bonuspoäng när laget spelar förbi press genom ett 2 mot 1."],
    coachingPoints: ["Observera mer än du instruerar.", "Fråga vad spelarna såg."],
    progressions: ["Ta bort bonusregeln.", "Öka planens längd."],
    simplifications: ["Gör målen större.", "Skapa numerärt överläge för bollhållande lag."],
    tags: ["smålagsspel", "kreativitet", "2v1"]
  },
  {
    id: "ex-back-pressure",
    title: "1 mot 1 med ryggen mot press",
    activityType: "Battle Rondo",
    players: "3–9",
    duration: 12,
    area: "7 × 7 m",
    purpose: "Utveckla scanning, skydda boll och beslutet att vända eller spela tillbaka.",
    setup: ["Mottagare i mitten, passare framför och försvarare bakom."],
    rules: ["Försvararen får gå när passningen slås.", "Mottagaren får vända eller säkra bollen tillbaka."],
    coachingPoints: ["Titta över axeln.", "Känn trycket.", "Använd kroppen mellan boll och motståndare."],
    progressions: ["Passaren följer med och skapar 2 mot 1."],
    simplifications: ["Försvararen startar längre bort."],
    tags: ["anfallare", "rygg mot mål", "scanning"]
  }
];

export const blocks: EducationBlock[] = [
  {
    id: "block-spelbarhet",
    questionId: "Q1",
    title: "Spelvinkel och spelavstånd",
    level: 1,
    description: "Spelarna lär sig att skapa en tydlig passningslinje och ett användbart avstånd till bollhållaren.",
    desiredBehaviours: ["Flytta före passningen.", "Visa rätt fot.", "Kommunicera tidigt."],
    sessionIds: ["session-spelbarhet-1"]
  },
  {
    id: "block-winger",
    questionId: "Q4",
    title: "Hitta yttern genom 2 mot 1",
    level: 1,
    description: "Spelarna lär sig att skapa och utnyttja ett numerärt överläge på kanten.",
    desiredBehaviours: ["Bollhållaren driver mot försvararen.", "Yttern skapar bredd.", "Beslut tas efter försvararens agerande."],
    sessionIds: ["session-winger-1", "session-winger-2", "session-winger-3", "session-winger-4"]
  },
  {
    id: "block-striker",
    questionId: "Q5",
    title: "Involvera anfallaren",
    level: 1,
    description: "Laget använder anfallaren som framåtriktad lösning och stödpunkt.",
    desiredBehaviours: ["Anfallaren ligger i linje med bollen.", "Scanna före mottagning.", "Vänd eller spela tillbaka utifrån press."],
    sessionIds: ["session-striker-1"]
  }
];

const wingerParts = [
  { exerciseId: "ex-2v1-standard", duration: 12, focus: "Spelavstånd, locka försvararen och välj passning eller dribbling." },
  { exerciseId: "ex-4v1", duration: 12, focus: "Mottagning med bortre fot, läs press och kommunicera." },
  { exerciseId: "ex-buildout-winger", duration: 18, focus: "Återskapa 2 mot 1 mellan försvarare och ytter." },
  { exerciseId: "ex-pattern-winger", duration: 10, focus: "Hela laget känner igen situationen.", optional: true },
  { exerciseId: "ex-5v5-four-goals", duration: 25, focus: "Fri tillämpning i matchlik miljö." }
];

export const sessions: Session[] = [
  {
    id: "session-spelbarhet-1",
    title: "Spelbarhet – introduktion",
    blockId: "block-spelbarhet",
    stage: "Introduktion",
    duration: 70,
    players: "10–14",
    keyMessage: "Flytta dig så att bollhållaren ser en tydlig och användbar passningslinje.",
    objectives: ["Skapa vinkel.", "Ta emot med öppet kroppsläge.", "Kommunicera före passning."],
    parts: [
      { exerciseId: "ex-4v1", duration: 15, focus: "Rörelse och mottagning." },
      { exerciseId: "ex-5v5-four-goals", duration: 30, focus: "Känn igen var ny spelbarhet behöver skapas." }
    ],
    reflectionQuestions: ["När blev du lätt att passa?", "Hur kunde du visa vilken fot du ville ha bollen på?"]
  },
  {
    id: "session-winger-1",
    title: "Hitta yttern – introduktion",
    blockId: "block-winger",
    stage: "Introduktion",
    duration: 77,
    players: "10–14",
    keyMessage: "Driv mot försvararen och välj lösning efter hur försvararen agerar.",
    objectives: ["Förstå grundläggande 2 mot 1.", "Skapa bredd.", "Kommunicera som fri spelare."],
    parts: wingerParts,
    reflectionQuestions: ["När blev yttern fri?", "När var det bättre att fortsätta driva?"]
  },
  {
    id: "session-winger-2",
    title: "Hitta yttern – högre tempo",
    blockId: "block-winger",
    stage: "Utveckling",
    duration: 75,
    players: "10–14",
    keyMessage: "Samma beslut, men i högre fart och med mindre tid.",
    objectives: ["Utföra 2 mot 1 i fart.", "Passa till rätt fot.", "Flytta laget framåt efter passningen."],
    parts: wingerParts.map((part) => ({ ...part, duration: part.optional ? 8 : part.duration })),
    reflectionQuestions: ["Hur påverkade tempot beslutet?", "Vad gjorde den fria spelaren för att hjälpa?"]
  },
  {
    id: "session-winger-3",
    title: "Hitta yttern – fler alternativ",
    blockId: "block-winger",
    stage: "Fördjupning",
    duration: 80,
    players: "10–16",
    keyMessage: "Känn igen den fria spelaren även när fler spelare deltar.",
    objectives: ["Se 2 mot 1 inom 3 mot 2.", "Använd central mittfältare som alternativ."],
    parts: wingerParts,
    reflectionQuestions: ["Vilka tre lösningar såg ni?", "Hur förändrades lösningen när pressen kom centralt?"]
  },
  {
    id: "session-winger-4",
    title: "Hitta yttern – matchlik tillämpning",
    blockId: "block-winger",
    stage: "Tillämpning",
    duration: 75,
    players: "10–16",
    keyMessage: "Identifiera själv när kanten ger en fri spelare.",
    objectives: ["Lösa temat utan tvingande regler.", "Förklara beslut efteråt."],
    parts: [
      { exerciseId: "ex-2v1-standard", duration: 10, focus: "Kort repetition." },
      { exerciseId: "ex-5v5-four-goals", duration: 45, focus: "Fri matchlik tillämpning." }
    ],
    reflectionQuestions: ["Vilka situationer kände ni igen själva?", "När valde ni en annan lösning än kanten?"]
  },
  {
    id: "session-striker-1",
    title: "Involvera anfallaren – introduktion",
    blockId: "block-striker",
    stage: "Introduktion",
    duration: 75,
    players: "10–14",
    keyMessage: "Anfallaren scannar, säkrar eller vänder utifrån pressen.",
    objectives: ["Ta emot med ryggen mot press.", "Skapa understöd under bollen."],
    parts: [
      { exerciseId: "ex-back-pressure", duration: 15, focus: "Scanning och skydda boll." },
      { exerciseId: "ex-4v1", duration: 12, focus: "Information före mottagning." },
      { exerciseId: "ex-5v5-four-goals", duration: 30, focus: "Använd anfallaren som stödpunkt utan att tvinga lösningen." }
    ],
    reflectionQuestions: ["När kunde anfallaren vända?", "När behövde laget ge stöd under bollen?"]
  }
];

export const getExercise = (id: string) => exercises.find((exercise) => exercise.id === id);
export const getSession = (id: string) => sessions.find((session) => session.id === id);
export const getBlock = (id: string) => blocks.find((block) => block.id === id);

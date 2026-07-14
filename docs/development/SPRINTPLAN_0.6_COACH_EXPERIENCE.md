# Sprintplan 0.6.1 - Coach Experience Foundation

Datum: 2026-07-13

## Status

Sprint 0.6.1 ar levererad.

Efterfoljande arbete har fortsatt i Sprint 0.6.2 (Complete Coach Flow), dar reflektion, recommendation och progressionsbeslut har knutits ihop i ett sammanhangande coachflode.

Nasta steg planeras i Sprint 0.6.3 (UX Polish).

## Mal

Sprint 0.6.1 ska etablera grunden for coach experience och gora Akademiplattformen praktiskt anvandbar for tranaren fore och under ett traningspass.

Fokus:

- mobilforst coach experience
- snabbt flode med fa steg
- ateranvanda befintliga funktioner for Education Plan, Scheduled Session, Session Template, Reflection, Recommendation och Team Progression
- inga nya stora domaner

## Uppdrag

Efter Sprint 0.6.1 ska en tranare kunna:

1. oppna dagens eller nasta planerade pass
2. fa en tydlig oversikt over passets syfte och struktur
3. ga igenom passets delar pa traningsplanen
4. markera passet som genomfort
5. gora en snabb reflektion direkt efter passet
6. se systemets recommendation
7. fatta beslut om nasta steg i lagets utbildningsplan

## Godkanda produktbeslut som ligger till grund

- exakt en aktiv Education Plan per lag
- exakt ett aktivt Education Block per plan
- Recommendation ar radgivande, inte styrande
- block avslutas nar planerade pass ar genomforda och tranaren godkanner avslut
- nasta block foreslas enligt planens ordning och tranaren bekraftar overgangen
- antal pass definieras per block med minimi-, rekommenderat och eventuellt maxantal
- manuell overstyrning ska sparas med ursprunglig recommendation, beslut och valfri motivering
- upprepade likadana recommendationer ska leda till forslag om att forenkla eller ga tillbaka till tidigare block

## Steg 1 - Granskning av nulage

Granska befintlig implementation innan ny kod skrivs.

Identifiera:

- vilka befintliga sidor och komponenter som kan ateranvandas
- hur pass, utbildningsplan, reflektion och recommendation exponeras idag
- vilka API-endpoints som redan stoder tranarflodet
- vilka data som saknas for att visa ett komplett traningspass
- eventuella inkonsekvenser mellan UI, Application Layer och domanmodell
- vilka delar som endast kraver UI-arbete
- vilka delar som kraver mindre utokningar av API eller Application Layer

Redovisa aven:

- filer som behover andras
- filer som bor lamnas ororda
- tekniska risker
- tillganglighetsrisker
- mobilitets- och prestandarisker

Ingen implementation far ske i detta steg.

## Steg 2 - Malbild

Malbilden ska beskriva:

- tranarens situation fore traningen
- tranarens situation under traningen
- tranarens situation direkt efter traningen
- hur dagens pass valjs
- hur passets innehall presenteras
- hur tranaren gar mellan passdelar
- hur passet avslutas
- hur reflektion och recommendation kopplas till flodet
- hur nasta steg i Education Plan presenteras

Malbilden ska godkannas innan fortsatt arbete.

## Steg 3 - Anvandarfloden

### Flode A - Oppna dagens traning

Tranaren ska kunna:

1. oppna tranarlaget
2. se dagens eller nasta planerade pass
3. se lag, tema, block och laramal
4. oppna passet

### Flode B - Forbereda traningen

Tranaren ska kunna se:

- passets overgripande syfte
- huvudfraga
- tema
- laramal
- spelprincip
- uppskattad passlangd
- passets delar i ordning
- nodvandig utrustning, om sadan data finns

### Flode C - Genomfora passet

Tranaren ska kunna:

- oppna en passdel
- se ovning och instruktion
- se coachingfragor
- se progression eller variation
- ga till foregaende eller nasta passdel
- alltid kunna aterga till passoversikten

### Flode D - Avsluta passet

Tranaren ska kunna:

- markera passet som completed
- bekrafta att passet faktiskt genomfords
- ga direkt vidare till reflektion

### Flode E - Reflektion

Tranaren ska kunna:

- ange understandingScore
- ange independenceScore
- lamna eventuella korta kommentarer om sadant redan ingar i domanen
- spara reflektionen

Det ska vara tydligt att exakt en reflektion far skapas per ScheduledSession.

Reflektion far endast skapas for ett completed pass.

### Flode F - Recommendation och beslut

Efter sparad reflektion ska tranaren kunna se:

- recommendation
- pedagogisk motivering
- underlag som anvants
- eventuellt fallback-lage
- foreslaget nasta steg i utbildningsplanen

Tranaren ska kunna:

- acceptera recommendation
- valja ett annat nasta steg
- lamna valfri motivering vid overstyrning

Infors inte automatisk progression utan tranares bekraftelse.

## Steg 4 - Informationsmodell for tranarflodet

Informationsflode:

EducationPlan
-> Active EducationPlanBlock
-> ScheduledSession
-> SessionTemplate
-> Session Parts och Exercises
-> Completed ScheduledSession
-> SessionReflection
-> Recommendation
-> Coach Decision
-> EducationPlan Progress

Beskriv:

- var informationen skapas
- var informationen lases
- vilka delar som ar domandata
- vilka delar som ar Application DTOs
- vilka delar som endast ar presentation
- vilka statusovergangar som sker
- vilka operationer som kraver tranares uttryckliga beslut

Ingen databasmodell ska tas fram innan informationsflodet ar godkant.

## Steg 5 - UX-principer

### Mobil forst

Granssnittet ska fungera val pa en mobiltelefon i staende lage.

Det ska inte krava:

- horisontell scroll
- precisa sma klickytor
- omfattande textinmatning
- flera oppna vyer
- komplex navigering

### Primar handling

Varje vy ska ha en tydlig primar handling.

Exempel:

- Oppna pass
- Starta traningslage
- Nasta passdel
- Avsluta pass
- Spara reflektion
- Visa recommendation
- Bekrafta nasta steg

### Progressiv information

Visa forst den information som behovs i stunden.

### Traningsplansanpassning

Granssnittet ska vara anvandbart vid begransad tid, solljus, kalla eller vata hander, rorelse, avbrott och svag uppkoppling.

### Tillganglighet

Sakerstall:

- semantisk HTML
- tangentbordsnavigering
- tydliga labels
- tillrackliga klickytor
- begriplig felhantering
- att farg inte ar enda informationsbarare

## Steg 6 - Scope

Version 0.6 far omfatta:

### Tranaroversikt

- dagens eller nasta pass
- aktiv Education Plan
- aktivt block
- aktuellt tema
- rekommenderat nasta steg

### Passvy

- passets syfte
- passets delar
- ovningar
- instruktioner
- coachingfragor
- progression eller variation dar data redan finns

### Genomforandeflode

- navigering mellan passdelar
- statusmarkering completed
- tydlig avslutning av pass

### Reflektionsflode

- snabb reflektion
- score-falt
- tydlig validering
- koppling till aktuellt pass

### Recommendationflode

- visa recommendation
- visa motivering och evidence
- acceptera eller overstyra
- spara tranares beslut om stod redan finns eller efter separat godkant produktbeslut

### API och Application Layer

Endast de utokningar som kravs for ovanstaende floden.

### UI

Mobilanpassade sidor och ateranvandbara komponenter for tranarflodet.

## Steg 7 - Produktbeslut

Minst foljande fragor ska besvaras innan implementation:

1. Hur valjs dagens pass om flera pass ar planerade samma dag?
2. Vad visas om inget pass ar planerat?
3. Far ett completed pass oppnas igen?
4. Far ett pass markeras completed utan att alla passdelar oppnats?
5. Ska tranaren kunna avbryta eller hoppa over en passdel?
6. Ska tiden per passdel visas, och ar den radgivande eller styrande?
7. Vilka kommentarer far lamnas i reflektionen?
8. Hur sparas tranares overstyrning av Recommendation?
9. Paverkar ett accepterat beslut progressionen direkt eller kravs separat bekraftelse?
10. Vad hander om natverksanrop misslyckas nar passet avslutas eller reflektionen sparas?

Codex far inte sjalv fatta dessa beslut genom implementation.

Presentera rekommendationer och konsekvenser for varje fraga.

Invanta godkannande.

## Steg 8 - Teknisk design

Efter godkanda produktbeslut ska Codex presentera teknisk design.

Den ska innehalla:

- foreslagna routes och sidor
- foreslagna komponenter
- state- och dataflode
- befintliga API-anrop som ateranvands
- eventuella nya Application use cases
- eventuella API-utokningar
- felhantering
- loading- och empty states
- paverkan pa befintliga kontrakt
- paverkan pa tester

Undvik globala state-bibliotek om befintlig React- och Next.js-struktur ar tillracklig.

Infors inga nya beroenden utan tydlig och dokumenterad nytta.

## Steg 9 - Prioriterad andringsplan

Ta fram en andringsplan innan implementation.

For varje andring ska foljande anges:

- andring
- anvandarnytta
- motivering
- berorda filer
- risk
- verifiering
- prioritet
- nodvandig eller valfri

Planen ska aven skilja mellan:

- UI-only
- Application/API
- Domain
- Infrastructure
- Dokumentation

Invanta godkannande innan implementation.

## Steg 10 - Implementation

Efter godkand andringsplan:

- gor minsta mojliga andring
- ateranvand befintliga komponenter och use cases
- bevara befintliga publika kontrakt dar mojligt
- hall route- och presentationslagret tunt
- flytta inte produktregler till UI
- duplicera inte domanlogik i komponenter
- for in ingen funktionalitet utanfor godkant scope
- anvand tydliga loading-, empty-, success- och error states
- optimera for enkelhet fore generell flexibilitet

Om implementationen kravt ett nytt produkt- eller domanbeslut ska arbetet stoppas.

## Steg 11 - Tester

### Unit tests

- presentation av passdata
- status- och felmappning
- reflektionens validering
- Recommendation-presentation
- coach decision-regler om sadana infors

### Komponent- eller UI-tester

Verifiera centrala anvandarfloden dar projektets testmiljo stodjer det:

- oppna dagens pass
- navigera mellan passdelar
- avsluta pass
- skapa reflektion
- visa recommendation
- hantera valideringsfel
- hantera natverksfel

### Application/API integration tests

- lasa dagens eller nasta pass
- markera pass completed
- skapa reflection
- hamta recommendation
- organization-isolering
- felaktiga statusovergangar
- eventuell coach decision

### Regression

Befintliga tester for Version 0.4 och Version 0.5 ska fortsatta passera.

## Steg 12 - Verifiering

Kors minst:

- npm test
- npm run test:integration
- npm run build

Kors aven lint separat om det finns ett sarskilt script.

Redovisa:

- antal passerade tester
- eventuella hoppade tester
- build-resultat
- kanda varningar
- manuellt verifierade anvandarfloden
- eventuella kvarvarande begransningar

## Steg 13 - Dokumentation

Nar Version 0.6 ar fardig ska foljande uppdateras:

- malbild och beslutsunderlag for Version 0.6
- informationsmodell
- UI- och UX-dokumentation
- API-dokumentation
- roadmap
- andringslogg
- kanda begransningar
- rekommenderade nasta steg

Dokumentera sarskilt:

- vilka tranarfloden som stodjs
- vilka beslut som fortfarande ar manuella
- hur Recommendation anvands
- vilka funktioner som medvetet ligger utanfor scope

## Definition of Done

Version 0.6 ar klar nar:

- tranaren kan oppna dagens eller nasta planerade pass
- tranaren kan genomfora passet steg for steg
- ett pass kan markeras som completed enligt domanreglerna
- exakt en reflektion kan skapas for ett completed pass
- recommendation visas efter sparad reflektion
- tranaren kan acceptera eller overstyra recommendation enligt produktbeslut
- alla nya anvandarfloden fungerar pa mobil
- samtliga beslutade tester passerar
- npm test, npm run test:integration och npm run build ar grona
- dokumentation och andringslogg ar uppdaterade

## Arkitekturregel

Version 0.6 ska i forsta hand ateranvanda befintliga domanobjekt, use cases, API-kontrakt och komponenter.

Nya entiteter, repositories, endpoints eller arkitekturmönster far endast foras in om befintlig struktur inte kan uppfylla malbilden pa ett rimligt satt.

Version 0.6 ska prioritera konsolidering framfor expansion.

## Godkannandepunkt for Version 0.6

Innan implementation far paborjas ska foljande vara dokumenterat och godkant:

1. Malbild for Coach Experience.
2. Anvandarfloden fore, under och efter traning.
3. Informationsmodell for tranarflodet.
4. UX-principer och mobilkrav.
5. Produktbeslut for passval, statusovergangar, reflektion och tranares beslut.
6. Scope och uttryckliga avgransningar.
7. Teknisk design.
8. Prioriterad andringsplan med berorda filer, risk och verifiering.

Om nya produkt- eller domanbeslut identifieras under implementationen ska arbetet stoppas tills de har dokumenterats och godkants.

## Git

Ingen commit.

Ingen push.

## Slutmål

Version 0.6 ska gora Akademiplattformens befintliga utbildningsmotor praktiskt anvandbar for tranaren pa traningsplanen.

Nar versionen ar fardig ska tranaren kunna ga fran planerat pass till genomforande, reflektion, recommendation och beslut om nasta steg i ett sammanhangande och mobilanpassat flode.

Version 0.6 ska prioritera anvandbarhet, tydlighet och pedagogiskt stod framfor nya domaner, avancerade funktioner eller teknisk generalisering.
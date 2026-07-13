# Akademiplattform - Konsoliderad nulagesbild

Datum: 2026-07-13

## Syfte

Detta dokument sammanfattar faktisk status i repot och ersatter tidigare sammanfattningar som inte langre speglar levererad implementation.

## Overgripande status

- Version 0.1: klar.
- Version 0.2: klar och verifierad for datalagergrund.
- Version 0.3: klar som forsta kompletta vertikala referensimplementation for Training.

## Vad som ar verifierat i kodbasen

### Arkitektur

- DDD + Clean Architecture-principer ar etablerade i lagerindelning.
- Application Layer finns for Training (commands, queries, handlers, DTO).
- Unit of Work-kontrakt finns och kopplas till transaktionshantering via TransactionRunner.
- API-lager ar tunt och delegerar till Application Layer.

### Data och doman

- Sex huvudfragor for 7v7 finns implementerade i innehallsmodellen.
- Traningar, block, teman, pass och ovningar ar modellerade och tillgangliga.
- Reflection-vy finns med enkel rekommendationslogik i UI.

### Persistence

- PostgreSQL persistence foundation finns med migrationer.
- TrainingRepository har stod for create/update/archive i local + postgres implementation.
- Organization-isolering ar implementerad och verifierad i tester.

### API

Foljande endpoints ar implementerade:

- POST /api/trainings
- GET /api/trainings
- GET /api/trainings/{id}
- PUT /api/trainings/{id}
- DELETE /api/trainings/{id}

DELETE representerar arkivering (status cancelled), inte fysisk borttagning.

### Tester och verifiering

Verifierad korning med TEST_DATABASE_URL satt:

- npm test: 62 pass, 0 fail
- npm run test:integration: 7 pass, 0 fail
- npm run build: pass

## Gap mot langsiktig vision

- Academy-domanen ar fortfarande referensimplementation och inte full PostgreSQL-backed.
- Rekommendationsmotor finns i enkel form i UI, men inte som fullstandig applikationstjanst med historikdriven beslutslogik.
- CI saknar central orkestrering av full DB-testmatris mot riktig PostgreSQL.

## Konsoliderad tolkning av produktniva

Projektet har passerat prototypfasen for arkitektur och datalager. Fokus bor nu flyttas till nasta vertikala affarsflode med samma kvalitetsniva som v0.3.

## Rekommenderat nasta steg

Version 0.4 bor inledas med en Reflection vertikal (HTTP -> Application -> Unit of Work -> Repository -> PostgreSQL) eftersom den knyter ihop utbildningsfilosofi, progression och rekommendation.

Minsta leverans for nasta steg:

1. Reflection Application use cases: create, list by session/team.
2. Reflection API-endpoints med Organization Context.
3. Persistens i PostgreSQL med organization-isolering.
4. Enkel Recommendation service i Application Layer som anvander reflektionsutfall.
5. Tester pa unit, integration, API, isolation och rollback.

---

## Version 0.5 - Education Plan och Team Progression (underlag for godkannande)

Detta avsnitt ersatter tidigare v0.5-planering och foljer instruktionen for Version 0.5: Education Plan and Team Progression.

Status:

- Steg 1-8 ar genomforda som planeringsarbete.
- Ingen implementation ar paborjad.
- Stoppregel galler tills produktbeslut ar dokumenterade och godkanda.

### Steg 1 - Analys (ingen kod)

#### Befintliga domanobjekt som kan ateranvandas

- Organization och Team i organization-domanen.
- ScheduledSession, SessionReflection och TeamProgress i training-domanen.
- EducationProgram, Theme, EducationBlock, SessionTemplate i academy-domanen.
- Org-scope, Unit of Work, ApplicationError och tunt API-monster fran v0.3-v0.4.

#### Nya domanobjekt som behovs

- EducationPlan (central doman)
- EducationPlanBlock (planens blockrad med status/progression)
- EducationPlanProgress (spårbar progression over tid)

Notering:

- Team-specifika objekt ska hallas minimala; planen ska kunna ateranvandas for flera lag via relation, inte via duplicerad modell.

#### Paverkan pa API

Nya endpoints behovs for:

- starta utbildningsplan for lag
- hamta lagets aktiva plan
- hamta progression for planen
- hamta rekommenderat nasta pass i planen

#### Paverkan pa databas

Nya tabeller och relationer behovs endast for Education Plan och Progression:

- education_plan
- education_plan_block
- education_plan_progress_event (eller likvardig minimal progress-tabell)

Samtliga med organization-scope och referenser till team/block/template dar relevant.

#### Paverkan pa tester

- Unit tests for planregler och progression
- Integration tests for repository + org-isolering
- API integration tests for planflode
- Migrationsverifiering (upp och ned)
- Build-verifiering

#### Paverkan pa befintliga aggregat

- Training-aggregatet behalls for scheduled sessions och reflection.
- Academy-aggregatet behalls for utbildningsinnehall.
- Nytt EducationPlan-aggregat introduceras som orchestrerar progression och refererar till befintliga aggregat utan att ta over deras ansvar.

### Steg 2 - Malbild

Version 0.5 ska losa foljande problem:

- Traning och reflection ar idag separata handelser men inte sammanhallna i en planerad utbildningsresa.
- Tranaren saknar ett tydligt planobjekt for att folja blockprogression over tid.

Efter Version 0.5 ska tranaren kunna:

1. Starta en utbildningsplan for ett lag.
2. Se lagets aktuella block och tema.
3. Folja progression genom planen baserat pa genomforda pass och reflection.
4. Se rekommenderat nasta pass inom ramen for den aktiva planen.
5. Anvanda recommendation fran Version 0.4 som stod i progressionen.

Version 0.5 bygger vidare pa Version 0.4 genom att:

- bevara beslutade reflection-regler
- ateranvanda recommendation-flodet
- behalla org-isolerad arkitektur och felmodell

Utryckligen inte i Version 0.5:

- AI/statistik/dashboard/rapporter/notifieringar
- avancerad administration
- rollbaserad behorighet
- innehallsredigering/ovningseditor
- fler-sasongsanalys

### Steg 3 - Informationsmodell (utan databasfokus)

Informationsflode:

EducationPlan
-> EducationBlock
-> SessionTemplate
-> ScheduledSession
-> Reflection
-> Recommendation
-> Progress

Forklaring av informationsflodet:

1. EducationPlan valjer vilka block laget arbetar efter.
2. Aktivt EducationBlock styr vilken grupp av SessionTemplate som ar aktuell.
3. SessionTemplate instansieras som ScheduledSession i lagets schema.
4. Genomford ScheduledSession ger Reflection.
5. Reflection ger Recommendation (stod).
6. Recommendation och utfall uppdaterar Progress i planen.

### Steg 4 - Domanmodell (forslag for godkannande)

Entiteter:

- EducationPlan
- EducationPlanBlock
- EducationPlanProgressEvent

Vardeobjekt:

- PlanStatus
- BlockProgressStatus
- ProgressionSnapshot

Aggregat:

- EducationPlan ar centralt aggregat.
- EducationPlan ager livscykel for EducationPlanBlock och progression events.

Agarskap och livscykel:

- Plan skapas for ett lag inom organisation.
- Plan har ett aktivt block at gangen (om inte annat beslutas).
- Block overgar mellan planned, active, completed, skipped (slutlig lista kravs produktbeslut).
- Progression uppdateras nar pass genomfors och reflection/recommendation finns.

Relationer:

- Team -> EducationPlan
- EducationPlan -> EducationPlanBlock
- EducationPlanBlock -> EducationBlock
- EducationPlanBlock -> SessionTemplate (via planerat/rek. nasta pass)

Affarsregler som krav pa beslut innan kod:

- antal aktiva planer per lag
- antal aktiva block per plan
- kriterium for block avslut
- val av nasta block
- recommendation som styrande eller radgivande

#### Faststallda produktbeslut for Version 0.5

- Exakt en aktiv Education Plan per lag.
- En plan kan ha status Draft, Active, Completed eller Archived.
- Nar en ny plan aktiveras ska tidigare plan avslutas.
- Exakt ett aktivt Education Block per plan.
- Ovriga block har status Planned, Completed eller Skipped.
- Ett block avslutas nar planerade pass ar genomforda och tranaren aktivt godkanner avslut.
- Nasta block foreslas enligt planens ordning men tranaren bekraftar overgangen.
- Recommendation ar radgivande, inte styrande.
- Antal pass definieras per block med minimi-, rekommenderat och eventuellt maxantal.
- Tranarens overstyrning ska sparas med ursprunglig recommendation, beslut och valfri motivering.
- Upprepade identiska recommendationer ska till sist byta riktning mot forenkling eller atergang till tidigare block.
- Team ager planen organisatoriskt, men Education Plan ar den centrala domen och ska kunna ateranvandas for flera lag.

### Steg 5 - Produktbeslut (faststallda)

Foljande produktbeslut ar nu dokumenterade och godkanda:

1. Ett lag far ha exakt en aktiv utbildningsplan.
2. Endast ett block far vara aktivt at gangen per plan.
3. Ett block ar avslutat nar planerade pass ar genomforda och tranaren godkanner avslut.
4. Nasta block valjs enligt planens ordning och kraver tranares bekraftelse.
5. Recommendation ar radgivande och inte styrande.
6. Antal pass definieras per block med minimi-, rekommenderat och eventuellt maxantal.
7. Tranarens manuella overstyrning ar tillaten och ska sparas med ursprunglig recommendation, beslut och motivering.
8. Upprepade likadana recommendationer ska leda till forslag om att forenkla eller ga tillbaka till tidigare block.

### Steg 6 - Scope for Version 0.5

#### Education Plan

- EducationPlan
- aktivt block
- aktuellt tema
- aktuell progression

#### Team

- koppla lag till utbildningsplan
- grundlaggande laginformation
- organisationstillhorighet

#### Progression

- blockstatus
- genomforda pass
- koppling till Reflection
- koppling till Recommendation
- rekommenderat nasta pass

#### API

Endast endpoints som kravs for ovanstaende funktionalitet.

#### Databas

Endast tabeller/relationer som kravs for Education Plan och Progression.

Ingen generell administration.

### Steg 7 - Arkitektur

Foljande ar krav:

- Domain
- Application
- Infrastructure
- API
- Repository Pattern
- Dependency Inversion

Inga nya arkitekturmonster utan tydlig motivering.

### Steg 8 - Prioriterad andringsplan (innan implementation)

1. Beskrivning: Introducera EducationPlan-aggregat med block/progression.
- Motivering: central doman for lagets utbildningsresa.
- Berorda filer: nya filer under src/domains/training eller separat education-plan-doman; typer i src/domains/shared vid behov.
- Risk: Medel.
- Verifiering: unit tests for domanregler.
- Prioritet: Hog.
- Nodvandig/valfri: Nodvandig.

2. Beskrivning: Application use cases for planstart, planstatus, progression, nasta pass.
- Motivering: krav for tranarens arbetsfloden.
- Berorda filer: src/application/educationPlan/** samt Unit of Work-koppling.
- Risk: Medel.
- Verifiering: unit + integration.
- Prioritet: Hog.
- Nodvandig/valfri: Nodvandig.

3. Beskrivning: Repository-kontrakt och infrastruktur for Education Plan.
- Motivering: persistence och org-isolering for plan/progression.
- Berorda filer: repository-kontrakt + local/postgres implementation + migrations + fixtures.
- Risk: Medel.
- Verifiering: integration + migrations upp/ned.
- Prioritet: Hog.
- Nodvandig/valfri: Nodvandig.

4. Beskrivning: API-endpoints for Education Plan-flode.
- Motivering: exponerar planfunktionalitet till UI.
- Berorda filer: src/app/api/education-plans/** (eller motsvarande) + tester.
- Risk: Medel.
- Verifiering: API integration tests.
- Prioritet: Hog.
- Nodvandig/valfri: Nodvandig.

5. Beskrivning: Dokumentationskonsolidering for v0.5.
- Motivering: krav pa beslutsunderlag, roadmap, domanmodell, informationsmodell och andringslogg.
- Berorda filer: docs/development/** och docs/architecture/**.
- Risk: Lag.
- Verifiering: manuell konsistenskontroll.
- Prioritet: Medel.
- Nodvandig/valfri: Nodvandig.

### Steg 9-11 - Verkstallighetsregel

- Steg 9 (Implementation), Steg 10 (Tester), Steg 11 (Dokumentation efter implementation) far paborjas forst efter godkant scope och godkanda produktbeslut.

### Begransningar for Version 0.5

Far inte inforas:

- AI
- statistik
- dashboards
- rapporter
- notifieringar
- avancerad administration
- rollbaserad behorighet
- innehallsredigering
- ovningseditor
- analys over flera sasonger

Ingen funktion far inforas enbart for att komplettera CRUD.

### Git

Ingen commit.

Ingen push.

### Stoppregel

Om analysen visar att nya produktbeslut kravs ska implementation stoppas tills besluten ar dokumenterade och godkanda.

### Godkannandepunkt for Version 0.5

Innan implementation av Version 0.5 far paborjas ska foljande vara dokumenterat och godkant:

1. Malbild for Education Plan och Team Progression.
2. Informationsmodell som beskriver flodet:

	* EducationPlan
	* EducationBlock
	* SessionTemplate
	* ScheduledSession
	* Reflection
	* Recommendation
	* Progress
3. Domanmodell for EducationPlan, EducationPlanBlock och Progress, inklusive entiteter, aggregat, relationer och affarsregler.
4. Produktbeslut for:

	* aktiva utbildningsplaner
	* aktiva block
	* kriterier for blockavslut
	* val av nasta block
	* Recommendation som styrande eller radgivande
	* manuell overstyrning
5. Scope for Version 0.5, inklusive Team, Education Plan, Progression, API och databas.
6. Prioriterad andringsplan med berorda filer, riskbedomning, verifieringsstrategi och prioritet.

Nar samtliga punkter ar godkanda far implementation paborjas.

Om nya produkt- eller domanbeslut identifieras under implementationen ska arbetet stoppas, beslutet dokumenteras och invanta godkannande innan implementationen fortsatter.

Malet ar att sakerstalla att Version 0.5 implementeras utifran en beslutad produkt- och domanmodell, dar implementationen foljer specifikationen och inte tvartom.

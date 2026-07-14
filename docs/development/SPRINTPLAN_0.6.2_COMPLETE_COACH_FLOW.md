# Sprintplan v0.6.2 - Complete Coach Flow

Datum: 2026-07-13

## Status

Detta dokument uppfyller kravbilden for Sprint 0.6.2 steg 1-6:

- nulagesgranskning
- malbild
- produktbeslut med rekommendationer
- scope
- teknisk design
- prioriterad andringsplan

Ingen implementation ar paborjad i detta dokument.

---

## Steg 1 - Granskning av nulage

### Verifierad befintlig implementation

Coach Experience:

- Coachdashboard pa startsidan finns i `src/app/page.tsx`.
- Stegvis passgenomforande finns i `src/components/CoachSessionStepper.tsx`.
- Sammanstald coachdata finns i `src/application/services/coachExperienceService.ts`.

Education Plan:

- Lokal repository med aktiv plan/block finns i `src/infrastructure/repositories/local/localEducationPlanRepository.ts`.
- API for list/get/start plan finns i `src/app/api/education-plans/route.ts`.
- Domanmodell med progress events finns i `src/domains/educationPlan/entities/EducationPlan.ts` och `src/domains/educationPlan/entities/EducationPlanProgress.ts`.

Scheduled Session:

- CRUD + statusupdate finns via `src/app/api/trainings/route.ts` och `src/app/api/trainings/[id]/route.ts`.
- Status uppdateras via `updateTrainingHandler` i `src/application/training/handlers/updateTrainingHandler.ts`.

Reflection:

- POST/GET/list finns via `src/app/api/reflections/route.ts` och `src/app/api/reflections/[id]/route.ts`.
- Domankrav verifierat: reflection endast for completed session och exakt en reflection per session i `src/application/reflection/handlers/createReflectionHandler.ts`.

Recommendation:

- Recommendation endpoint finns i `src/app/api/reflections/recommendation/route.ts`.
- Rule engine finns i `src/application/reflection/handlers/recommendationService.ts`.

Team Progression:

- TeamProgress-data finns i TrainingRepository men anvands inte i sammanhanget coach decision -> progression.
- EducationPlan progress events finns i doman men saknar application/api-flode for coach decision.

### Vad som kan ateranvandas direkt

- `CoachSessionStepper` for passdel-navigation.
- `updateTrainingHandler` for completed-status.
- `createReflectionHandler` for reflectionregler.
- `getRecommendationHandler` for recommendation + fallback.
- Befintlig `ApplicationError`-modell och org-scope i API-routes.

### Vad som saknas for komplett coachflode

1. Sammanhangande UI-flode efter completed:
- idag leder coach stepper till separat `/reflektion`-sida med klientlogik och utan API-koppling.

2. Reflektion i samma flode:
- `/reflektion` anvander inte POST `/api/reflections`.

3. Coach decision i progression:
- ingen befintlig operation som sparar coachens beslut som ett progressionshandelse i Education Plan.

4. Progressionsuppdatering efter beslut:
- ingen application-handler som skriver progress event till aktiv Education Plan.

5. End-to-end tester for komplett coachflode:
- saknas i integration/UI-niva.

### Statusovergangar som saknas

- explicit UI-overgang `in-progress -> completed` med bekraftelse
- `completed -> reflection created` i samma flode
- `recommendation shown -> coach decision saved`
- `coach decision saved -> education plan progress updated`

### Filer som behover andras (forslag)

UI:

- `src/components/CoachSessionStepper.tsx`
- `src/app/page.tsx`
- `src/app/reflektion/page.tsx` (antingen inbaddning eller tydlig fallbackvag)

Application:

- ny coach flow-handler for samlad progression (forslag under `src/application/educationPlan/handlers/`)
- eventuell utokning av `src/application/services/coachExperienceService.ts`

API:

- befintligt: `src/app/api/trainings/[id]/route.ts` (ateranvand statusupdate)
- befintligt: `src/app/api/reflections/route.ts` (ateranvand reflection-create)
- ny minimal operation for att skriva beslut som progress-event i befintlig Education Plan-resurs (se teknisk design)

Domain/Infrastructure:

- `src/domains/educationPlan/entities/EducationPlanProgress.ts` (ev optional metadata)
- `src/infrastructure/repositories/local/localEducationPlanRepository.ts`
- motsvarande postgres-implementation nar local-flodet ar verifierat

Tester:

- `tests/application/coachExperience.test.ts`
- nya tester i `tests/application/` for coach decision/progression
- nya integrationstester i `tests/integration/`

### Filer som bor lamnas ororda

- Academy-innehallsmodellen i `src/data/academyContent.ts` (ingen ny doman)
- Core recommendation-motorn i `src/application/reflection/handlers/recommendationService.ts`
- Training/Reflection grundkontrakt som redan verifierats i v0.4

### Tekniska risker

1. Dubbelkallor i UI:
- risk att status/reflection/recommendation visas olika mellan dashboard och stepper.

2. Delvis seedad planlogik:
- local plan-data har begransad progression, risk for glapp nar coach decision ska skrivas.

3. Alias/import/runtime-kanslighet i test:
- tidigare runtimeproblem i dist-test vid alias-importer.

4. Avsaknad av transaktionssammanhang i UI-kedjan:
- completed + reflection + decision + progression riskerar halvfardigt flode utan samordning.

### UX-risker

1. For manga steg/omdirigeringar pa mobil.
2. Otydlig skillnad mellan recommendation och progressionsbeslut.
3. Svag felaterkoppling vid natverksfel i slutet av passet.

---

## Steg 2 - Malbild for Sprint 0.6.2

Tranarens sammanhangande resa:

Coach Dashboard
-> Starta pass
-> Coach Session Stepper
-> Markera completed
-> Reflection (inline i samma flode)
-> Recommendation
-> Beslut om progression (acceptera/overstyra recommendation)
-> Education Plan Progress uppdateras
-> Tillbaka till dashboard med uppdaterad status

Informationslivscykel i malbilden:

1. Dashboard laser plan/session/recommendation.
2. Completed skapas via statusupdate pa scheduled session.
3. Reflection skapas direkt efter completed.
4. Recommendation visas direkt fran sparad reflection.
5. Progressionsbeslut sparas med valfri motivering.
6. Progress event skrivs till Education Plan.
7. Dashboard visar uppdaterat nasta steg.

---

## Steg 3 - Produktbeslut (rekommendationer for godkannande)

Foljande ar rekommenderade beslut for Sprint 0.6.2.

1. Hur markeras pass som completed?
- Rekommendation: explicit knapp "Markera genomfort" i sista steget med bekraftelsedialog.
- Konsekvens: minskar felaktig statusandring i farten.

2. Far ett completed pass oppnas igen?
- Rekommendation: ja, read-only i coach-laget efter completed.
- Konsekvens: tranaren kan repetera upplagg utan ny statusandring.

3. Far tranaren avbryta pagaende pass?
- Rekommendation: nej i 0.6.2 (ingen ny status "in-progress"/"aborted").
- Konsekvens: undviker ny domanregel i denna sprint.

4. Nar skapas reflektion?
- Rekommendation: omedelbart efter completed i samma flode.
- Konsekvens: stoder snabb efter-traning process.

5. Hur sparas progressionbeslut?
- Rekommendation: spara som progress-event pa aktiv Education Plan med decisionType + optional rationale + recommendationSnapshot.
- Konsekvens: konsoliderar i befintlig EducationPlan-progress, ingen ny stor doman.

6. Nar uppdateras Education Plan Progress?
- Rekommendation: direkt nar progressionsbeslut sparas.
- Konsekvens: dashboard kan visa uppdaterad progression utan senare batchjobb.

7. Kan tranaren andra beslut efterat?
- Rekommendation: nej i 0.6.2 (inga edits), men nytt beslut kan laggas som nytt event.
- Konsekvens: enkel audit-logg, ingen edit-komplexitet.

Ingen implementation ska starta forran dessa beslut ar godkanda.

---

## Steg 4 - Scope for Sprint 0.6.2

Ingaar:

- Dashboard med nasta pass + aktiv plan/block + rekommenderat nasta steg
- Passgenomforande i stepper
- Completed-markering
- Reflection-create i samma coachflode
- Recommendation-visning direkt efter reflection
- Progressionsbeslut (acceptera/overstyra + valfri motivering)
- Progress event pa Education Plan efter decision

Ingar inte:

- ny stor doman
- avancerad live-tracking eller tidsstyrning
- generell CRUD for separata beslutresurser
- full offline/synk

---

## Steg 5 - Teknisk design (forslag)

### Komponenter och sidor

1. `CoachSessionStepper` utokas med:
- completed action
- inline reflection form
- recommendation panel
- decision panel

2. `HomePage` i `src/app/page.tsx`:
- visar uppdaterad coachstatus efter sparad decision

3. `/reflektion` behalls som fallback, men primarvag blir inline i coachflodet.

### Data- och stateflode

1. load coach dashboard data
2. complete session (PUT /api/trainings/{id})
3. create reflection (POST /api/reflections)
4. show recommendation (fran create-response eller GET recommendation)
5. save progression decision as education plan progress event (via Education Plan API)
6. reload dashboard summary

### API-anrop

Ateranvands:

- `PUT /api/trainings/{id}`
- `POST /api/reflections`
- `GET /api/reflections/recommendation`

Ny minimal utokning (endast om beslut 5-6 godkanns):

- `POST /api/education-plans/{id}/progress-events`
  - input: scheduledSessionId, recommendationType, decisionType, rationale
  - output: uppdaterad progress summary

Designregel:

- Coach Decision modelleras som ett progressionshandelse (Progress Event) i Education Plan.
- Ingen ny doman eller fristaende resurs introduceras om befintlig progressionsmodell kan utokas for att bara beslutet.

### Application/use cases

Nya use cases (smala):

- `saveEducationPlanProgressDecisionHandler`
- `appendEducationPlanProgressHandler`

### Felhantering och loading

- loading: tydliga disabled-state pa primara knappar
- error: visning per steg (completed/reflection/progressionbeslut)
- recover: "forsok igen" utan att tappa redan sparad data
- empty: tydligt lage nar pass saknas/recommendation fallback

---

## Steg 6 - Prioriterad andringsplan (forslag)

### UI

1. Andring: utoka `CoachSessionStepper` till komplett flode
- Anvandarnytta: ett sammanhangande mobilflode
- Motivering: central DoD for 0.6.2
- Berorda filer: `src/components/CoachSessionStepper.tsx`, `src/app/page.tsx`
- Risk: Medel
- Verifiering: unit + manuell mobilkontroll
- Prioritet: Hog

2. Andring: tydlig completed-bekraftelse
- Anvandarnytta: minskar felstatus
- Motivering: produktkrav
- Berorda filer: `src/components/CoachSessionStepper.tsx`
- Risk: Lag
- Verifiering: komponenttest
- Prioritet: Hog

### Application

3. Andring: ny handler for progressionsbeslut och progression
- Anvandarnytta: recommendation leder till faktiskt beslut
- Motivering: binder ihop v0.4-v0.5-v0.6
- Berorda filer: `src/application/educationPlan/handlers/*`
- Risk: Medel
- Verifiering: unit tests
- Prioritet: Hog

### API

4. Andring: ny minimal endpoint for progress-events pa education plan
- Anvandarnytta: en tydlig save-punkt efter recommendation
- Motivering: behov av explicit beslutslagring
- Berorda filer: `src/app/api/education-plans/*`
- Risk: Medel
- Verifiering: integration tests
- Prioritet: Hog

### Domain

5. Andring: optional metadata i progress event for decision/rationale
- Anvandarnytta: spårbarhet for coachbeslut
- Motivering: krav i produktbeslut
- Berorda filer: `src/domains/educationPlan/entities/EducationPlanProgress.ts`
- Risk: Medel
- Verifiering: domantester
- Prioritet: Medel

### Infrastructure

6. Andring: local + database repository-stod for progress-events med beslutmetadata
- Anvandarnytta: samma beteende i local och postgres
- Motivering: konsekvent vertikal
- Berorda filer: `src/infrastructure/repositories/local/*`, `src/infrastructure/repositories/database/*`
- Risk: Medel
- Verifiering: integration tests
- Prioritet: Hog

### Dokumentation

7. Andring: uppdatera changelog/roadmap/coach-dokument
- Anvandarnytta: spårbar leverans och beslut
- Motivering: DoD-krav
- Berorda filer: `docs/development/*`
- Risk: Lag
- Verifiering: manuell konsistens
- Prioritet: Medel

---

## Definition of Done

Sprint 0.6.2 ar klar nar:

- tranaren kan oppna dagens eller nasta pass
- passet kan genomforas steg for steg
- passet kan markeras som genomfort
- reflektion kan skapas direkt i samma arbetsflode
- recommendation visas direkt efter sparad reflektion
- tranaren kan acceptera eller overstyra recommendation
- beslutet sparas som ett progressionshandelse i Education Plan
- dashboarden visar uppdaterad status utan omladdning
- samtliga relevanta tester passerar
- `npm test`, `npm run test:integration` och `npm run build` ar grona
- dokumentation och andringslogg ar uppdaterade

## Godkannande for implementation

Implementation for Sprint 0.6.2 far starta forst nar:

1. malbilden ovan ar godkand
2. produktbesluten i steg 3 ar godkanda
3. andringsplanen i steg 6 ar godkand

Tills dess: ingen implementation.
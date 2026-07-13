# Akademiplattform - Andringslogg Version 0.5

## Sammanfattning

Version 0.5 inleds med Education Plan och Team Progression som ny vertikal.

Huvudresultat hittills:

- Ny doman for Education Plan med plan, block och progression.
- Application Layer-skaft for list, get och start av Education Plan.
- Local repository for Education Plan med organization-scoping.
- HTTP API for /api/education-plans.
- Verifierade unit tests och build efter den forsta slicen.

Faststallda produktbeslut for Version 0.5:

- Exakt en aktiv Education Plan per lag.
- Exakt ett aktivt Education Block per plan.
- Block avslutas nar planerade pass ar genomforda och tranaren godkanner avslut.
- Nasta block foreslas enligt planens ordning men behover alltid tranares bekraftelse.
- Recommendation ar radgivande, inte styrande.
- Antal pass definieras per block med minimi-, rekommenderat och eventuellt maxantal.
- Manuell overstyrning ska sparas med ursprunglig recommendation, beslut och valfri motivering.
- Upprepade likadana recommendationer ska leda till forslag om att forenkla eller ga tillbaka till tidigare block.
- Team ar agare av planen, men Education Plan ar den centrala domen och ska kunna ateranvandas for flera lag.

Arbetet ar fortfarande delvis i gang. PostgreSQL-implementation, migrations och integrationstester for Education Plan aterstar.

## Arkitekturforandringar

### 1. Nya domanobjekt for Education Plan

Tillagda filer:

- src/domains/educationPlan/types/ids.ts
- src/domains/educationPlan/entities/EducationPlan.ts
- src/domains/educationPlan/entities/EducationPlanBlock.ts
- src/domains/educationPlan/entities/EducationPlanProgress.ts
- src/domains/educationPlan/repositories/EducationPlanRepository.ts

Innehall:

- EducationPlan som centralt aggregat.
- EducationPlanBlock med status och ordning.
- EducationPlanProgressEvent for spårbar progression.
- Brandade id-typer for plan, block och progress.
- Repository-kontrakt for list, get, team-scope och save.

### 2. Application Layer for Education Plan

Tillagda filer:

- src/application/educationPlan/commands/StartEducationPlanCommand.ts
- src/application/educationPlan/queries/ListEducationPlansQuery.ts
- src/application/educationPlan/queries/GetEducationPlanQuery.ts
- src/application/educationPlan/dto/EducationPlanDto.ts
- src/application/educationPlan/handlers/educationPlanValidation.ts
- src/application/educationPlan/handlers/educationPlanMapper.ts
- src/application/educationPlan/handlers/listEducationPlansHandler.ts
- src/application/educationPlan/handlers/getEducationPlanHandler.ts
- src/application/educationPlan/handlers/startEducationPlanHandler.ts
- src/application/educationPlan/unitOfWork/EducationPlanUnitOfWork.ts
- src/application/educationPlan/unitOfWork/createEducationPlanUnitOfWork.ts

Use cases hittills:

- ListEducationPlans
- GetEducationPlan
- StartEducationPlan

### 3. Local repository for Education Plan

Tillagd fil:

- src/infrastructure/repositories/local/localEducationPlanRepository.ts

Innehall:

- Organization-scoped in memory data for Education Plan.
- Basstod for list, get, team-scope och save.
- Startdata for en organisation for att ge direkt verifierbarhet.

### 4. Request runtime wiring

Uppdaterad fil:

- src/composition/createRuntimeDependencies.ts

Innehall:

- RuntimeDependencies innehaller nu educationPlanRepository.
- Local provider komponerar Education Plan repository.
- Database provider ar forberedd med samma runtime-kontrakt.

### 5. HTTP API for Education Plan

Tillagd fil:

- src/app/api/education-plans/route.ts

Endpoints:

- GET /api/education-plans
- GET /api/education-plans?id={id}
- GET /api/education-plans?teamId={teamId}
- POST /api/education-plans

Notering:

- Route-lagret ar tunt och foljer samma transportmonster som Training och Reflection.
- x-organization-id anvands som organisation-scope.

### 6. Teststod for ny vertikal

Tillagda filer:

- tests/application/educationPlan.test.ts
- tests/application/educationPlanHandlers.unit.test.ts

Verifierar:

- domanens plan/block/progress-flode
- list/get/start use cases
- validation och not found-beteende

## Verifiering

Korning efter den forsta Education Plan-slicen:

- npm test: 69 pass, 0 fail
- npm run build: pass

## Kanda begransningar / kvar att gora

1. PostgreSQL-repository for Education Plan ar inte implementerat.
2. Migrations for education_plan, education_plan_block och progress saknas.
3. API-integrationstester for Education Plan saknas.
4. Domanreglerna for Education Plan kommer att behova uppdateras sa att de speglar de faststallda produktbesluten.

## Versionssummering

Version 0.5 har startat som ny vertikal for Education Plan och Team Progression. Den forsta slicen etablerar doman, application, local repository och API-grund, och ger en verifierad bas for fortsatta implementationer.

## Inga commits eller push

Arbetet har genomforts utan commit och utan push.
# Akademiplattform – Andringslogg Version 0.3

## Sammanfattning

Version 0.3 etablerar Application Layer och ett komplett vertikalt flode for Training enligt Clean Architecture och DDD.

Huvudresultat:

- Application Layer med commands, queries, handlers och DTO for Training.
- Explicit Unit of Work-kontrakt med transaktionsgrans via TransactionRunner.
- Standardiserad felmodell i Application-lagret.
- Forsta HTTP API for Training med tydlig transportgrans.
- Organization isolation genom hela vertikalen.
- Write-stod i TrainingRepository for create/update/archive.
- Verifierade tester for unit, integration, API, isolering och transaktionsbeteende.

## Arkitekturforandringar

### 1. Application Layer for Training

Tillagda mappar/filer:

- src/application/training/commands/
- src/application/training/queries/
- src/application/training/handlers/
- src/application/training/dto/

Use cases:

- CreateTraining
- GetTraining
- ListTrainings
- UpdateTraining
- ArchiveTraining

### 2. Unit of Work

Tillagda filer:

- src/application/unitOfWork/TrainingUnitOfWork.ts
- src/application/unitOfWork/createTrainingUnitOfWork.ts

Innehall:

- Ett explicit Unit of Work-kontrakt ar infort i Application-lagret.
- TransactionRunner ar den konkreta implementationen for transaktionshantering.
- UoW exekverar operationer inom TransactionRunner.
- Application handlers arbetar mot repositories via UoW.

### 3. Standardiserad felmodell

Tillagd fil:

- src/application/errors/ApplicationError.ts

Kategorier:

- Validation
- NotFound
- Conflict
- Forbidden
- DomainRuleViolation
- InfrastructureFailure

### 4. HTTP API for Training

Tillagda filer:

- src/app/api/trainings/route.ts
- src/app/api/trainings/[id]/route.ts

Endpoints:

- POST /api/trainings
- GET /api/trainings
- GET /api/trainings/{id}
- PUT /api/trainings/{id}
- DELETE /api/trainings/{id}

Notering:

- DELETE arkiverar Training genom att satta status till `cancelled`; ingen fysisk borttagning sker.
- Organization Context lases fran request-header x-organization-id.
- Route handlers foljer Clean Architecture och ansvarar endast for:
	- transport (HTTP)
	- modellbindning
	- skapande av Organization Context
	- anrop till Application Layer
	- oversattning till HTTP-svar

### 5. Repository-kontrakt och implementation

Uppdaterade filer:

- src/domains/training/repositories/TrainingRepository.ts
- src/infrastructure/repositories/local/localTrainingRepository.ts
- src/infrastructure/repositories/database/postgresTrainingRepository.ts

Innehall:

- TrainingRepository har utvecklats fran ett read-only-kontrakt till fullt stod for create/update/archive.
- CreateScheduledSessionInput
- UpdateScheduledSessionInput
- createScheduledSession(...)
- updateScheduledSession(...)
- archiveScheduledSession(...)

### 6. Composition for request scope

Tillagd fil:

- src/composition/createRequestRuntimeDependencies.ts

Innehall:

- Request-scopad dependency-komposition med organizationId.

## Tester

Teststrategin omfattar nu samtliga lager i den vertikala arkitekturen.

### 1. Unit tests (Application handlers)

Tillagd fil:

- tests/application/trainingHandlers.unit.test.ts

Verifierar:

- end-to-end use case-flode i Application-lagret med doubles
- validationfel
- not found-fel

### 2. Integration tests (Application -> PostgreSQL)

Tillagd fil:

- tests/integration/trainingApplicationPostgres.integration.test.ts

Verifierar:

- create/list/get genom Application Layer
- organization isolation
- transaction rollback och commit

### 3. API tests (HTTP -> Application -> PostgreSQL)

Tillagd fil:

- tests/integration/trainingsApi.integration.test.ts

Verifierar:

- komplett CRUD/archive-flode via route handlers
- organization isolation over HTTP

### 4. Testharness-stabilisering

Uppdaterade filer:

- tests/integration/fixtures/postgresTestDatabase.ts
- package.json

Innehall:

- schema-scopad testpool satt till max 1 for att undvika externa pool-limitproblem
- testscript kor med --test-concurrency=1 for deterministisk DB-testkorning

## Verifiering

Korning med satt TEST_DATABASE_URL:

- npm test
- npm run test:integration
- npm run build

Resultat:

- Unit tests: 62 pass
- Integration tests: 7 pass
- Build: Pass

## Kanda begransningar / kvar att gora

1. Academy-domanen anvander fortfarande en referensimplementation och har an nu inte migrerats till PostgreSQL.
2. API-ytan ar etablerad for Training, men fler domaner saknar motsvarande vertikala floden.
3. CI saknar fortfarande central orkestrering av hela DB-testmatrisen med riktig Postgres.

## Versionssummering

Version 0.3 etablerar den forsta kompletta vertikala referensarkitekturen fran HTTP API via Application Layer och Unit of Work till PostgreSQL. Denna implementation fungerar som mall for kommande domaner.
Version 0.3 markerar overgangen fran etablerad infrastruktur till en komplett applikationsarkitektur dar hela flodet fran API till datalager ar verifierat.

## Inga commits eller push

Arbetet har genomforts utan commit och utan push.

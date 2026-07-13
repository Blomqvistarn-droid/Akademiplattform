# Akademiplattform – Andringslogg Version 0.2

## Sammanfattning

Denna andringslogg sammanfattar allt arbete som utforts i Version 0.2-datalager hittills.

Huvudresultat:

- Foundation for datalager etablerad.
- Async repository-kontrakt inforda.
- Composition root inford med explicit provider-val.
- Organization-context inford som obligatorisk scope-mekanism.
- PostgreSQL-grund, migrationsstod och testfixturer inforda.
- Referensaggregat for training implementerat for local och database read-only.
- Gemensamma kontraktstester etablerade och kopplade till local samt DB (skip utan DB-konfiguration).
- UI frikopplat fran concreta repository-importer via application services.
- Databasprovider oppnad igen med academy-adapter och aktiv composition for database-laget.
- Transaktionskontext for en-connection-semantik inford for PostgreSQL.

## Genomforda arkitekturforandringar

### 1. Application-lager

Skapat organization-context och transaktionsabstraktion:

- src/application/context/OrganizationContext.ts
- src/application/transactions/TransactionRunner.ts

Innehall:

- `OrganizationContext` med `organizationId`.
- Validering av non-empty scope vid context-skapande.
- `TransactionRunner` med `executeInTransaction`.

### 2. Infrastructure-konfiguration

Skapat explicit konfiguration och startfel vid ogiltig setup:

- src/infrastructure/config/repositoryProvider.ts
- src/infrastructure/config/organizationContext.ts

Innehall:

- Tvingar `REPOSITORY_PROVIDER` till `local` eller `database`.
- Kraver `ORGANIZATION_ID` for scopade beroenden.

### 3. PostgreSQL persistence foundation

Skapat PostgreSQL-konfiguration och poolhantering:

- src/infrastructure/persistence/postgres/postgresConfig.ts
- src/infrastructure/persistence/postgres/postgresPool.ts

Innehall:

- Inlasning av `DATABASE_URL`.
- Pool-konfiguration via miljo.
- Delad pool och kontrollerad nedstangning.

### 4. Transaktioner

Skapat concrete transaktionsrunners:

- src/infrastructure/transactions/InMemoryTransactionRunner.ts
- src/infrastructure/transactions/PostgresTransactionRunner.ts

Innehall:

- In-memory passthrough for local provider.
- Postgres runner med `BEGIN/COMMIT/ROLLBACK`.

### 5. Composition root

Skapat central composition root:

- src/composition/createRuntimeDependencies.ts

Innehall:

- Last konfiguration.
- Valjer provider explicit (`local` eller `database`).
- Skapar context, repositories och transaction runner.
- Databasprovider bygger nu utbildningsrepo-adapter, training PostgreSQL-repo och PostgreSQL transaction runner.

### 6. Repository-kontrakt migrerade till async

Domain-kontrakt migrerade till Promise-baserade metoder:

- src/domains/academy/repositories/EducationContentRepository.ts
- src/domains/organization/repositories/OrganizationRepository.ts
- src/domains/training/repositories/TrainingRepository.ts

Innehall:

- Samma metodnamn/semantik.
- Read-only-beteende bibehallt.
- `null` vid saknat objekt bibehallt.

### 7. Local repository-implementationer uppdaterade

Migrerade local repositories till async:

- src/infrastructure/repositories/local/localEducationContentRepository.ts
- src/infrastructure/repositories/local/localTrainingRepository.ts

Innehall:

- `Promise`-retur utan semantisk andring.
- Training-data scopas per `organizationId`.

### 8. Database repositories

#### 8.1 Education content (adapter)

- src/infrastructure/repositories/database/postgresEducationContentRepository.ts

Status:

- Databasprovider har nu en explicit adapter for academy content.
- Adaptern ar tillsvidare read-through mot validerad academy content-kalla i kodbasen.
- Detta ersatter tidigare fail-fast-blockering i composition root.

#### 8.2 Training (read-only implemented)

- src/infrastructure/repositories/database/postgresTrainingRepository.ts

Innehall:

- Riktiga SQL-readfrågor.
- Obligatorisk `organization_id`-filtrering i samtliga operationer.
- Explicit rad-till-doman-mappning.
- UTC-normalisering via `toISOString()`.

### 9. Queries och app-anrop

Migrerat anrop till async i academy-query och berorda sidor:

- src/domains/academy/queries/getProgramStructures.ts
- src/app/page.tsx
- src/app/utbildning/page.tsx
- src/app/pass/page.tsx
- src/app/pass/[id]/page.tsx
- src/app/ovningar/page.tsx
- src/app/ovningar/[id]/page.tsx

Innehall:

- Awaitade repositoryanrop.
- Klientsidor laddar data via `useEffect` dar nodvandigt.

## Migrationer och schema

### 1. Initial foundation migration

- migrations/000001_foundation.js

Innehall:

- `organization`-tabell.
- `uuid` PK och UTC-falt (`created_at`, `updated_at`).

### 2. Referensaggregat training

- migrations/000002_training_reference_aggregate.js

Innehall:

- Tabeller: `team`, `scheduled_session`, `session_reflection`, `team_progress`.
- FK med organization-scope.
- Constraint-regler (status check, count >= 0, uniqueness).
- Index for accessmonster.

## Tester

### 1. Befintliga academy-tester uppdaterade till async

- tests/academy/localEducationContentRepository.test.ts
- tests/academy/getProgramStructures.test.ts

### 2. Gemensamma kontraktstester (training)

- tests/contracts/runTrainingRepositoryContractTests.ts
- tests/contracts/localTrainingRepository.contract.test.ts
- tests/contracts/postgresTrainingRepository.contract.test.ts

Innehall:

- Samma assertions for local och database.
- Verifierar read-only-kontrakt, not-found och organization-isolering.
- DB-kontraktstester skippar tydligt om `TEST_DATABASE_URL` saknas.
- PostgreSQL-kontraktstestsetupen ar korrigerad sa att isolerat testschema, seeddata och schema-scopad pool lever under hela testsviten och stadas i `test.after`.

### 3. DB-fixtures och integration

- tests/integration/fixtures/postgresTestDatabase.ts
- tests/integration/fixtures/seedTrainingReferenceAggregate.ts
- tests/integration/postgresMigration.integration.test.ts

Innehall:

- Isolerat schema per testkörning.
- Schema-scoped pool.
- Skapande av referensschema och seeddata for kontraktstest mot DB.
- Explicit helper for langlivat isolerat testschema tillagd for kontraktstest som inte far stadas fore assertions.

## Scripts och beroenden

### 1. Package scripts

Uppdaterat package.json med:

- `test:integration`
- `db:migrate:up`
- `db:migrate:down`
- `db:migrate:create`

### 2. Beroenden

Tillagda paket:

- `pg`
- `node-pg-migrate`
- `@types/pg`

### 3. Miljoexempel

Skapat:

- .env.example

Innehall:

- `REPOSITORY_PROVIDER`
- `ORGANIZATION_ID`
- `DATABASE_URL`
- `TEST_DATABASE_URL`
- pool-konfiguration

## Verifiering (senaste korning)

Kommando:

- `npm test`
- `npm run build`
- `git status --short`

Resultat:

- Tester: 51 total, 50 passerade, 1 skip (DB-kontraktstest utan TEST_DATABASE_URL).
- Build: passerade.

### Verifiering 2026-07-13 (extra korning)

Kommando:

- `npm test`
- `npm run build`

Resultat:

- `TEST_DATABASE_URL`: unset.
- Tester: 51 total, 50 passerade, 1 skip (forvantat utan TEST_DATABASE_URL).
- Build: passerade.

### Verifiering 2026-07-13 (senaste status)

Kommando:

- `npm test`
- `npm run build`

Resultat:

- `TEST_DATABASE_URL`: fortfarande unset.
- Tester: 51 total, 50 passerade, 1 skip.
- Build: passerade utan fel.
- Full migrationstest mot tom PostgreSQL-databas kunde inte koras pa grund av saknad DB-anslutning i miljo.

### Verifiering 2026-07-13 (riktig PostgreSQL efter setup-fix)

Bakgrund:

- PostgreSQL TrainingRepository-kontraktstesterna gav tidigare tomma resultat trots seedning.
- Rotorsak: det isolerade testschemat städades bort innan kontraktstesterna körde sina assertions.

Korrigering:

- `tests/integration/fixtures/postgresTestDatabase.ts` uppdaterades med en helper som skapar ett langlivat isolerat testschema med explicit `dispose()`.
- `tests/contracts/postgresTrainingRepository.contract.test.ts` uppdaterades sa att schema, seeddata och schema-scopad pool skapas en gang, ateranvands under hela kontraktstestsviten och stadas i `test.after`.

Kommando:

- `npm test`
- `npm run test:integration`
- `npm run build`

Resultat:

- `npm test`: 56 total, 56 passerade, 0 skip, 0 fail.
- PostgreSQL-kontraktstesterna kor nu mot riktig databas och skippar inte langre nar `TEST_DATABASE_URL` ar satt.
- Verifierat passerande for:
	- scoped scheduled sessions
	- resolves/misses scheduled session by ID
	- reflections per team och per session
	- team progress
	- organization-isolering
	- readonly contract typing
- `npm run test:integration`: 4/4 passerade.
- `npm run build`: passerade.
- Separata PostgreSQL-integrationstester verifierar dessutom cross-organization foreign key-skydd och samma connection inom transaction scope.

## Kompletteringar efter review

Foljande kompletteringar ar tillagda i efterfoljande steg:

1. UI-frikoppling
- App-sidor anvander nu application service i stallet for direkta imports av concreta repositories.
- Interaktiva delar ligger i separata klientkomponenter med server-side datainhamtning.

2. Async-kontrakt dokumentation
- ADR skapad for beslutet om Promise-baserade repository-kontrakt:
	- docs/architecture/adr/ADR-0002-async-repository-contracts.md

3. DB-integritet
- Negativ integrationstest tillagt som verifierar att cross-organization relation i `scheduled_session` nekas av DB constraints.

4. Transaktionssemantik
- Async context-baserad transaktionskontext tillagd for PostgreSQL.
- `PostgresTransactionRunner` och PostgreSQL repository-fragor anvander samma connection inom transaktionsscope.
- Enhetstest tillagt for att verifiera samma-connection-beteende.

## Kanda begransningar / kvar att gora

1. Academy database-adaptern ar inte SQL-backed an, utan read-through mot academy content-kallan i kodbasen.
2. Migrationskedjan verifieras inte an automatiskt i CI mot riktig databasmotor.
3. Full DB-kontraktstestkorning kraver fortsatt satt `TEST_DATABASE_URL` i den miljo dar testerna kors.

## Inga commits eller push

Arbetet har genomforts utan commit och utan push.

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

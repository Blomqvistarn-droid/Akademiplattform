# Sprintplan v0.4 - Reflection Vertical

Datum: 2026-07-13

## Mål

Leverera en komplett Reflection-vertikal enligt samma referensarkitektur som v0.3:

HTTP -> API -> Application -> Unit of Work -> Repository -> PostgreSQL

Fokus:

- Reflektion efter genomfort traning
- Enkel rekommendation baserad pa reflektionsdata
- Full organization isolation
- Full testtackning pa unit/integration/API/security/transaction

## Scope

### Inkluderat

- Reflection-domain use cases i Application Layer
- Reflection API-endpoints
- PostgreSQL repository-stod for reflection-write/read
- Recommendation service (regelbaserad v1) i Application Layer
- Tester for hela vertikalflodet

### Exkluderat

- Ny UI-design
- Avancerad ML/AI-rekommendation
- Statistikdashboards
- Fler domaner an Reflection/Training-kopplingen

## Use cases (exakta)

1. CreateReflection
- Input: scheduledSessionId, understandingScore (1-5), independenceScore (1-5), notes
- Output: reflectionId, createdAt, recommendation

2. GetReflection
- Input: reflectionId
- Output: reflection

3. ListReflectionsByScheduledSession
- Input: scheduledSessionId
- Output: reflections[]

4. ListReflectionsByTeam
- Input: teamId
- Output: reflections[]

5. GetTrainingRecommendation
- Input: scheduledSessionId eller teamId (senaste reflektionsunderlag)
- Output: recommendationType + message

RecommendationType v1:
- repeat
- simplify
- progress
- advance

## API-endpoints (exakta)

Bas: /api/reflections

1. POST /api/reflections
- Header: x-organization-id (required)
- Body:
  - scheduledSessionId: string
  - understandingScore: number (1-5)
  - independenceScore: number (1-5)
  - notes: string
- Response 201: reflection + recommendation

2. GET /api/reflections/{id}
- Header: x-organization-id (required)
- Response 200: reflection
- Response 404: not found in organization scope

3. GET /api/reflections
- Header: x-organization-id (required)
- Query (exactly one required):
  - scheduledSessionId=...
  - teamId=...
- Response 200: reflections[]
- Response 400: invalid query combination

4. GET /api/reflections/recommendation
- Header: x-organization-id (required)
- Query: scheduledSessionId=... (required in v1)
- Response 200: recommendation

## Application Layer struktur

application/
  reflection/
    commands/
      CreateReflectionCommand.ts
    queries/
      GetReflectionQuery.ts
      ListReflectionsQuery.ts
      GetRecommendationQuery.ts
    dto/
      ReflectionDto.ts
      RecommendationDto.ts
    handlers/
      createReflectionHandler.ts
      getReflectionHandler.ts
      listReflectionsHandler.ts
      getRecommendationHandler.ts
      reflectionValidation.ts
      reflectionMapper.ts

## Repository kontrakt

domains/training/repositories/TrainingRepository.ts utokas med:

- createReflection(...)
- getReflection(...)
- getReflectionsByScheduledSession(...)
- getReflectionsByTeam(...)

Notering:

- Ingen SQL i Application Layer.
- Inga API-typer i Domain.

## Datamodell (v0.4-minimum)

Befintlig tabell session_reflection anvands.

Minimikrav:

- understanding_score integer not null check 1-5
- independence_score integer not null check 1-5
- notes text not null
- organization_id scope
- fk till scheduled_session inom samma organization

Om migration kravs:
- Ny migration for score-falt och checks.

## Felmodell och HTTP-oversattning

ApplicationError-kategorier:

- Validation -> 400
- NotFound -> 404
- Conflict -> 409
- Forbidden -> 403
- DomainRuleViolation -> 422
- InfrastructureFailure -> 500

## Teststrategi och kriterier

Teststrategin omfattar samtliga lager i vertikalflodet.

### Unit tests (Application)

Maste verifiera:

- CreateReflection validerar score 1-5
- NotFound vid fel organization scope
- Recommendation-regler (repeat/simplify/progress/advance)
- Felkategorier mappas korrekt

Godkant nar:
- samtliga handlers har enhetstester
- alla brancher i recommendation-regler har assertions

### Integration tests (Application -> PostgreSQL)

Maste verifiera:

- create + read reflection i samma organization
- list by session och list by team
- cross-organization nekas
- transaction rollback: reflection sparas inte vid kastat fel
- transaction commit: reflection sparas

Godkant nar:
- testdata seedas i isolerat schema
- inga tester beroende av public-data

### API tests (HTTP -> Application -> PostgreSQL)

Maste verifiera:

- POST/GET/list/recommendation fungerar
- x-organization-id krav
- 404 vid cross-organization access
- 400 vid invalid query kombination

Godkant nar:
- endpointkontrakt verifierade med status + payload

### Security tests

Maste verifiera:

- org A kan inte lasa org B reflections
- org A kan inte skapa reflection pa scheduled session som tillhor org B

### Transaction tests

Maste verifiera:

- rollback vid fel
- commit vid success
- samma connection inom transaction scope (ateranvand befintligt monster)

## Definition of Done (v0.4 Reflection)

Klar nar:

- Reflection use cases finns i Application Layer
- API-endpoints ovan ar implementerade
- Organization isolation verifierad i negativa tester
- recommendation v1 levererar deterministiskt resultat
- npm test passerar
- npm run test:integration passerar
- npm run build passerar
- CHANGELOG_0.4 uppdaterad
- ROADMAP uppdaterad

## Sprintnedbrytning (foreslaget)

### Sprint 0.4.1 - Foundation (1-2 dagar)

- Kontrakt + DTO + handlerskelett
- API routes scaffold
- Enhetstester for validation och error mapping

Leverabel:
- compilable vertical skeleton + unit tests green

### Sprint 0.4.2 - PostgreSQL + Recommendation (1-2 dagar)

- Repository implementation + ev migration
- Recommendation service i Application Layer
- Integration och API-tester

Leverabel:
- end-to-end reflection vertical green

### Sprint 0.4.3 - Hardening (0.5-1 dag)

- Security negative tests
- Transaction rollback/commit verifiering
- Dokumentation + changelog

Leverabel:
- full DoD uppfylld

## Risker och hantering

1. Pool-limit i extern DB testmiljo
- Hantering: behall max=1 i testpool + serial testkonkurrens

2. Scope-lackage mellan organizationer
- Hantering: negativa tester tidigt, alltid org-filter i repository queries

3. Otydlig recommendation-logik
- Hantering: explicit regelmatris + enhetstester per regel

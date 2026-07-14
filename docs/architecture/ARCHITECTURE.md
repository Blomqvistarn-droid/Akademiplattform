# Arkitektur

## Syfte

Akademiplattform ska byggas som en stabil och långsiktig plattform för utbildning av fotbollstränare.

Målet är att skapa en lösning som är:

- enkel att utveckla vidare
- enkel att underhålla
- enkel att testa
- redo för framtida databas och inloggning

## Arkitekturprinciper

Projektet byggs som en modulär monolit.

Det innebär att hela systemet finns i en och samma Next.js-applikation, men att funktionerna delas upp i tydliga domäner med ett klart ansvar.

Presentation (UI) ska vara separerad från affärslogik och datalagring.

Innehåll (utbildningsmaterial) ska hållas åtskilt från användardata (lag, tränare, planerade träningar och reflektioner).

## Lagerindelning

### Domain

- Domänregler, entiteter och värden.
- Inga beroenden mot HTTP, SQL eller ramverksdetaljer.

### Application

- Use cases, orkestrering och transaktionsgränser.
- Felöversättning till standardiserad felmodell.
- Arbetar endast mot repository-kontrakt och Unit of Work.

### Infrastructure

- Repositoryimplementationer, PostgreSQL, migrations och tekniska adapters.
- Ansvarar för persistence-detaljer och query/mapping mot databas.

### API

- Tunt transportlager i Next.js route handlers.
- Läser organization context från request, validerar transportdata och anropar Application-lagret.

## Version 0.3 Referensflöde

För Training är första kompletta vertikalen nu etablerad:

HTTP -> API Route -> Application Handler -> Unit of Work -> Repository -> PostgreSQL -> Commit/Rollback -> HTTP Response

Följande use cases är implementerade i Application-lagret:

- CreateTraining
- GetTraining
- ListTrainings
- UpdateTraining
- ArchiveTraining

## Version 0.6.2 Referensflöde (Complete Coach Flow)

Andra kompletta vertikalen i coachflodet:

HTTP -> API Route -> Application Handler -> Unit of Work -> Repository -> Commit/Rollback -> HTTP Response

Sammanhangande flode:

- PUT /api/trainings/{id} (completed)
- POST /api/reflections (inline-reflektion)
- GET /api/reflections/recommendation (recommendation)
- POST /api/education-plans/{id}/progress-events (coach decision som progress event)

Designregel i 0.6.2:

- coach decision tillhor Education Plan Progress
- ingen ny huvuddoman eller fristaende coach-decision-resurs introduceras

## Arkitekturkrav: Organization Isolation

- Alla write/read-operationer kräver organization context.
- Organization-scope appliceras i repositorylagret.
- Cross-organization access ska ge NotFound/Forbidden beroende på use case.
- Negativa tester ska alltid finnas för isolering.

## Arkitekturkrav: Transaction Boundaries

- Transaktioner öppnas av Unit of Work via TransactionRunner.
- Repositories ska inte själva äga transaktionslivscykeln.
- PostgreSQL-körningar inom transaktion ska använda samma connection scope.
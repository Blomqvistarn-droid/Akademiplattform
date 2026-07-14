# Akademiplattform – Roadmap

Akademiplattform är en digital plattform för strukturerad fotbollsutbildning och tränararbete. Denna roadmap är ett levande dokument som uppdateras löpande utifrån sprintutfall, lärdomar och arkitekturbeslut.

## Vision

- En digital plattform för fotbollsutbildning.
- Flera organisationer.
- Flera lag.
- Återanvändbara utbildningsprogram.
- Planering, genomförande och uppföljning av träningspass.
- En arkitektur som är lätt att vidareutveckla.

## Arkitekturprinciper

- Clean Architecture
- Domain-Driven Design (lättvikt)
- Repository Pattern
- TypeScript strict
- En domänmodell per domän
- Små och granskningsbara commits

## Roadmap

### Version 0.1 – Arkitekturgrund

Status: Klar

Innehåll:

- Domändokumentation
- Domänmodell
- Domänentiteter
- Repository-kontrakt
- Repository-lager
- Mapping-adapter
- Migrering till academy-domänmodellen
- Avveckling av gamla utbildningstyper

### Version 0.2 – Datalager

Status: Klar

Planerat innehåll:

- Repository-implementationer
- Datavalidering
- Tester
- Supabase-integration
- Datamigrering

### Version 0.3 – Organisation

Status: Klar (första vertikala referensflöde)

Planerat innehåll:

- Application Layer (commands, queries, handlers, DTO)
- Unit of Work och transaktionsgränser
- Standardiserad felmodell
- HTTP API för Training (CRUD + arkivering)
- Organization isolation genom hela flödet
- Unit-, integrations- och API-tester

Levererat i versionen:

- POST /api/trainings
- GET /api/trainings
- GET /api/trainings/{id}
- PUT /api/trainings/{id}
- DELETE /api/trainings/{id}

### Version 0.4 – Reflection Foundation

Status: Delvis klar (Sprint 0.4.1 levererad, produktbeslut återstår)

Planerat innehåll:

- Reflektion efter träningspass
- Förståelsevärde
- Självständighetsvärde
- Regelbaserad rekommendation
- Local Repository + PostgreSQL Repository
- Grundläggande API för reflections
- Verifierad end-to-end-vertikal

Levererat i versionen:

- POST /api/reflections
- GET /api/reflections
- GET /api/reflections/{id}
- GET /api/reflections/recommendation
- Recommendation med pedagogisk motivering, underlag och fallback
- Reflection-integrationstester för repository och API

### Version 0.5 – Education Plan och Team Progression

Status: Klar som beslutad planerings- och implementeringsgrund

Levererat och dokumenterat:

- Education Plan som central domän för plan, block och progression
- Application Layer för list, get och start av Education Plan
- Local repository med organization-scoping
- HTTP API för /api/education-plans
- Produktbeslut för en aktiv plan per lag, ett aktivt block per plan och rådgivande Recommendation

### Version 0.6 - Sprintserie

Status: Klar

Sprintindelning:

- Sprint 0.6.1 - Coach Experience Foundation: Klar
- Sprint 0.6.2 - Complete Coach Flow: Klar
- Sprint 0.6.3 - UX Polish: Klar

Levererat i versionen:

- mobilförst tränarläge
- dagens eller nästa planerade pass
- passöversikt med syfte, delar och lärandemål
- navigering mellan passdelar
- markera pass som completed
- snabb reflektion direkt efter pass
- recommendation och progressionsbeslut i Education Plan i ett sammanhängande flöde
- konsekvent navigation och aktiv bottom nav-markering
- standardiserade loading-, empty-, error- och success-ytor i kärnvyer
- förbättrad mobilupplevelse utan oavsiktlig horisontell overflow
- förbättrad tillgänglighet med labels, aria-live och fokusförbättringar
- gemensamma UX-mönster i presentationslagret
- stabil ESLint-konfiguration utan interaktiv prompt

Levererat i Sprint 0.6.2:

- completed-markering med aktiv bekräftelse
- inline-reflektion i coachflödet
- recommendation direkt efter sparad reflektion
- coach decision sparad som Progress Event i Education Plan
- progressuppdatering direkt efter beslut
- integrationstest för komplett coachflöde

Levererat i Sprint 0.6.3:

- UX-polish i presentationslagret utan ny domänlogik
- gemensamma state- och feedbackmönster i UI
- route-nivå loading, error och not-found-stöd
- förbättrade mobil- och tillgänglighetsytor i kärnflöden
- lint-körning som passerar utan interaktiv setup

### Version 0.7 – Data Parity & Quality Hardening

Status: Klar

Levererat innehåll:

- Education Plan parity mellan local och database-provider
- tydlig runtime-komposition utan dold lokal fallback i databasläge
- stabil kvalitetsgrind för lint, build, unit och integration
- automatiserad verifiering av coachflödets kritiska väg
- uppdaterad arkitektur- och driftverifieringsdokumentation

### Version 0.8 - Program & Content Expansion

Status: Planerad

Planerat innehåll:

- tydlig produktväg från program till tema, block och pass
- förbättrad övningsbank med filtrering och sök för planeringsflödet
- sammanhållen koppling mellan planering, genomförande och recommendation
- bibehållen kvalitetsgrind och regressionsverifiering av kritisk coachkedja

### Version 1.0

En stabil första produktionsversion med komplett utbildningsflöde från planering till uppföljning.

Planerat innehåll:

- Kompletta utbildningsprogram
- Återanvändbara övningar
- Flera nivåer
- Filtrering
- Sökning

## Sprintstatus

### Sprint 1

Klart:

- [x] Arkitekturdokumentation
- [x] Domänmodell
- [x] Domänstruktur
- [x] Domänentiteter
- [x] EducationContentRepository
- [x] OrganizationRepository
- [x] TrainingRepository
- [x] Mapping-adapter

Pågående:

- [x] Migrering till academy-domänmodellen

Planerat:

- [x] Avveckling av src/types/education.ts
- [x] Repository-tester

## Principer

Roadmapen är ett levande dokument som uppdateras efter varje sprint och större arkitekturbeslut för att spegla aktuell riktning, prioriteringar och tekniska beslut.

## Verifierad status

v0.3:

- `npm test`: 62 pass, 0 fail
- `npm run test:integration`: 7 pass, 0 fail
- `npm run build`: passerar

v0.4 (senaste verifiering):

- `npm test`: 63 pass, 0 fail
- `npm run test:integration`: 11 pass, 0 fail
- `npm run build`: passerar

v0.6 (senaste verifiering):

- `npm test`: 66 pass, 0 fail, 1 skip
- `npm run test:integration`: 6 pass, 0 fail, 4 skip
- `npm run lint`: passerar utan interaktiv prompt
- `npm run build`: passerar

v0.7 (senaste verifiering):

- `npm run lint`: pass, 0 warnings, 0 errors
- `npm test`: 84 pass, 0 fail, 0 skip
- `npm run build`: passerar

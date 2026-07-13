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

Status: Pågår

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

Planerat innehåll:

- Repository-implementationer
- Datavalidering
- Tester
- Supabase-integration
- Datamigrering

### Version 0.3 – Organisation

Planerat innehåll:

- Organisationer
- Lag
- Roller
- Medlemmar
- Behörigheter

### Version 0.4 – Tränarplattform

Planerat innehåll:

- Planering av träningspass
- Kalender
- Passhistorik
- Reflektioner
- Progression

### Version 0.5 – Akademi

Planerat innehåll:

- Kompletta utbildningsprogram
- Återanvändbara övningar
- Flera nivåer
- Filtrering
- Sökning

### Version 1.0

En stabil första produktionsversion med komplett utbildningsflöde från planering till uppföljning.

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

- [ ] Migrering till academy-domänmodellen

Planerat:

- [ ] Avveckling av src/types/education.ts
- [ ] Repository-tester

## Principer

Roadmapen är ett levande dokument som uppdateras efter varje sprint och större arkitekturbeslut för att spegla aktuell riktning, prioriteringar och tekniska beslut.

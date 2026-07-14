# Akademiplattform - Ändringslogg Version 0.7

Versionstatus: Implementerad
Sprintstatus: Klar
Implementation: Genomförd

## Sammanfattning

Version 0.7 planeras som en hårdningssprint med fokus på Data Parity & Quality Hardening.

Syftet med sprinten är att minska teknisk risk efter 0.6-seriens levererade coachflöde innan ny större produktfunktionalitet byggs ovanpå Education Plan.

Övergripande mål:

- verifierad parity mellan local och database Education Plan repositories
- explicit och fail-fast provider-val i databasläge
- stabil kvalitetsgrind för lint, build, unit och integration
- automatiserad verifiering av coachflödets kritiska väg

Relaterat styrdokument:

- docs/development/SPRINTPLAN_0.7_DATA_PARITY_QUALITY_HARDENING.md

## Historik

Föregående version:

- Version 0.6 - Complete Coach Flow & UX Polish (klar)

Nuvarande version:

- Version 0.7 - Data Parity & Quality Hardening (klar)

## Status

Nuvarande status:

- sprintinriktning definierad
- scope och definition of done fastställda i sprintplan
- tre implementationsslice genomförda
- fail-fast för Education Plan i databasläge implementerad
- gemensam kontraktstestsvit för Education Plan repository etablerad
- postgres Education Plan repository implementerad och verifierad mot kontraktstestsviten
- migrations- och schemaunderlag för Education Plan tillagda
- databasintegrationstest för kritisk coachkedja tillagt och verifierat
- slutlig kvalitetsgrind genomförd: lint, test och build passerar
- definition of done är avstämd och uppfylld

## Beslutad inriktning

Sprint 0.7 ska prioritera:

1. Education Plan database parity
2. runtime-komposition och explicit provider-val
3. kvalitetsgrind och verifieringsbarhet
4. automatiserat högvärdestest för coachflödets kritiska kedja

Sprint 0.7 ska inte användas för:

- ny huvuddomän
- ny större användarfunktion
- bred plattformsomläggning
- fullständig CI/CD-omläggning

## Parity-kontrakt

Parity i 0.7 avser verifierat gemensamt beteendekontrakt, inte bara metodlikhet mellan implementationer.

Parity ska omfatta:

- domänbeteende
- statusövergångar
- validering
- felbeteende
- metadata
- ordning och persistens
- idempotens där det är relevant

Följande operationer ska följas upp i sprinten:

| Operation | Förväntan |
| --------- | --------- |
| skapa och hämta plan | samma domänresultat |
| lista planer | samma filtrering och sortering |
| starta plan eller block | samma statusövergång |
| spara progress event | samma eventtyp och metadata |
| spara coach decision | samma progression och returvärde |
| hämta efter sparning | ingen förlorad data |
| ogiltig operation | samma felkategori |

## Arkitekturbeslut

Följande beslut gäller för sprinten:

1. Databasläge får aldrig tyst falla tillbaka till local-repository.
2. Om database-provider är vald och inte kan initieras ska körningen misslyckas tydligt vid uppstart eller första användning.
3. Local-repository får endast användas när local uttryckligen är valt.
4. Repository-kontraktet ska definieras före implementationdetaljer i database-provider.

## Planerad leverans

### P1 - Education Plan database parity

Planerat:

- gemensam repository contract test suite
- verifierad likvärdighet för kärnoperationer i local och database-provider
- återläsningsverifiering efter progression och coach decision

### P2 - Runtime-komposition och miljöstyrning

Planerat:

- explicit providerkonfiguration via miljöinställning
- fail-fast vid okänt providervärde eller ofullständig databaskonfiguration
- diagnostiserbar aktiv provider utan exponering av känsliga värden

### P3 - Kvalitetsgrind

Obligatorisk nivå:

- npm run lint
- npm test
- npm run build
- miljöoberoende integrationstester

Databasnivå:

- repository contract/parity tests
- database integration tests
- kritiskt coachflöde mot database-provider

Regel för skip:

- varje skip ska vara avsiktlig
- varje skip ska vara dokumenterad
- varje skip ska vara kopplad till tydligt miljökrav
- varje skip ska redovisas i verifieringsutfallet

### P4 - Kritisk flödesverifiering

Planerat testutfall:

- completed
- reflection sparas
- recommendation genereras
- coach decision sparas
- progress event finns
- uppdaterad Education Plan kan läsas tillbaka

## Genomfört i sprinten

Första implementation i Sprint 0.7:

- tyst local fallback för Education Plan i databasläge har tagits bort
- databasläget använder nu explicit Education Plan database-provider och failar tydligt när den ännu inte är implementerad
- återanvändbar kontraktstestsvit för Education Plan repository har lagts till
- kontraktstestsviten körs initialt mot local Education Plan repository
- runtime-tester verifierar att database-provider inte längre kan falla tillbaka till local repository

Andra implementation i Sprint 0.7:

- postgres Education Plan repository är implementerad för list/get/getByTeam/getActive/save
- samma kontraktstestsvit körs nu för både local och postgres Education Plan repositories
- testfixturer för isolerat Education Plan-schema och seedad organisationsdata har lagts till för databastester
- migration 000005 för Education Plan-tabeller har lagts till

Tredje implementation i Sprint 0.7:

- databasintegrationstest för den kritiska coachkedjan har lagts till
- testfixtur för Education Plan-tabeller och seeddata i coachflödestest har lagts till
- kritisk kedja verifieras nu i databasläge: completed -> reflection -> recommendation -> decision -> återläst progress update

## Ändrade filer i 0.7

- src/composition/createRuntimeDependencies.ts
- src/infrastructure/repositories/database/postgresEducationPlanRepository.ts
- tests/contracts/educationPlanRepository.contract.test.ts
- tests/contracts/postgresEducationPlanRepository.contract.test.ts
- tests/contracts/runEducationPlanRepositoryContractTests.ts
- tests/contracts/runtimeDependencies.contract.test.ts
- tests/integration/fixtures/seedEducationPlanReferenceAggregate.ts
- tests/integration/fixtures/seedEducationPlanForCoachFlow.ts
- tests/integration/coachFlowPostgres.integration.test.ts
- migrations/000005_education_plan_foundation.js
- tests/migrations/educationPlanMigrations.unit.test.ts

## Verifieringsutfall

Verifierat efter tredje implementationsslice:

- npm test: pass, 84 tester passerar
- riktad integration: coachFlowPostgres + coachFlow: pass, 2/2 tester passerar
- npm run lint: pass, 0 warnings, 0 errors
- npm run build: pass
- inga oförklarade skips i slutlig verifieringskörning

Specifikt verifierat:

- local provider använder fortsatt local Education Plan repository
- database provider failar tydligt när DATABASE_URL saknas
- database provider faller inte tillbaka till local Education Plan repository när REPOSITORY_PROVIDER=database
- Education Plan repository-kontraktet passerar för local implementationen
- Education Plan repository-kontraktet passerar för postgres implementationen
- postgres Education Plan repository klarar save + read-back + teamlist + active plan + organizationsisolering
- migration 000005 definierar up/down-operationer för Education Plan-tabeller
- kritisk coachkedja är verifierad i databasläge via integrationsflöde

## DoD-avstämning

1. Uppfyllt: samma kontraktstestsvit passerar för local och database Education Plan repositories.
2. Uppfyllt: kritiska operationer har verifierad likvärdighet för resultat, statusövergångar, progress events, metadata och felbeteende.
3. Uppfyllt: database-provider väljs explicit och använder aldrig dold local fallback.
4. Uppfyllt: felaktig eller ofullständig providerkonfiguration ger ett tydligt fail-fast-fel.
5. Uppfyllt: lint, unit tests och build passerar utan interaktivitet.
6. Uppfyllt: miljöoberoende integrationstester passerar obligatoriskt.
7. Uppfyllt: databasintegrationstester passerar i dokumenterad databasmiljö utan oförklarade skips.
8. Uppfyllt: ett automatiserat test täcker kedjan completed -> reflection -> recommendation -> decision -> återläst progress update.
9. Uppfyllt: dokumentationen beskriver aktiv driftmodell, provider-val, verifieringskommandon och kvarvarande begränsningar.
10. Uppfyllt: ingen ny huvuddomän eller ny produktfunktion har införts.

## Öppna risker

1. Local-repositoryns nuvarande beteende riskerar att bli normgivande även där kontraktet borde vara facit.
2. Miljöberoende tester kan ge skenbar kvalitet om skips inte redovisas tydligt.
3. Databasparitet kan exponera skillnader i statusövergångar eller metadata som kräver mindre domänjusteringar.
4. För bred UI-automation riskerar att spräcka sprintens fokus.

## Definition of Done

Sprint 0.7 ska avslutas först när:

1. Samma kontraktstestsvit passerar för local och database Education Plan repositories.
2. Kritiska operationer har verifierad likvärdighet för resultat, statusövergångar, progress events, metadata och felbeteende.
3. Database-provider väljs explicit och använder aldrig dold local fallback.
4. Felaktig eller ofullständig providerkonfiguration ger ett tydligt fail-fast-fel.
5. Lint, unit tests och build passerar utan interaktivitet.
6. Miljöoberoende integrationstester passerar obligatoriskt.
7. Databasintegrationstester passerar i dokumenterad databasmiljö utan oförklarade skips.
8. Ett automatiserat test täcker kedjan completed -> reflection -> recommendation -> decision -> återläst progress update.
9. Dokumentationen beskriver aktiv driftmodell, provider-val, verifieringskommandon och kvarvarande begränsningar.
10. Ingen ny huvuddomän eller ny produktfunktion har införts.

## Inga commits eller push

Arbetet är ännu inte loggat med commit eller push i denna changelog.

## Avslutning Version 0.7

Version 0.7 är färdigställd och verifierad.

Fokus för versionen har varit Data Parity & Quality Hardening för Education Plan-flödet, med explicit provider-val, borttagen dold fallback, verifierad repository-parity och automatiserad databasverifiering av kritisk coachkedja.
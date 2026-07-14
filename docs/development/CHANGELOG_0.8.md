# Akademiplattform - Andringslogg Version 0.8

Versionstatus: Implementerad
Sprintstatus: Klar
Implementation: Genomford

## Sammanfattning

Version 0.8 bygger vidare pa den stabila grund som etablerades i 0.7 och fokuserar pa produktnytta i utbildnings- och planeringsflodet.

Sprint 0.8 har levererat en klickbar huvudresa i utbildningsmodellen utan att introducera ny huvuddoman.

Overgripande mal for versionen:

- fullt navigerbar kedja Program -> Huvudfraga -> Tema -> Block -> Pass
- forbattrad ovningsbank for planering och genomforande
- bibehallen koppling till Education Plan och coachflodet
- fortsatt grona kvalitetsgrindar och regressionsfrihet i kritiska floden

Relaterat styrdokument:

- docs/development/SPRINTPLAN_0.8_PROGRAM_CONTENT_EXPANSION.md

## Historik

Foregaende version:

- Version 0.7 - Data Parity & Quality Hardening (klar)

Nuvarande version:

- Version 0.8 - Program & Content Expansion (klar)

## Status

Nuvarande status:

- sprintinriktning och scope ar faststallda
- implementation i 0.8 ar genomford
- klickbar utbildningsresa ar implementerad i appen
- ovningsbanken ar uppgraderad med utokad sokning och typfilter
- breadcrumb-stod ar tillagt genom utbildningskedjan inklusive passdetalj
- regressionsnara academy-tester ar tillagda for programresan
- kvalitetsgrind verifierad: lint, test, test:integration och build passerar

## Genomfort i sprinten

### P1 - Klickbar huvudresa i utbildning

Genomfort:

- utbildningssidan startar pa programniva med tydlig ingang
- navigering vidare till huvudfraga, tema och block
- blockniva visar kopplade pass och leder vidare till passdetalj
- passdetalj visar breadcrumb tillbaka till utbildningskontexten

### P2 - Ovningsbank for planering

Genomfort:

- textsok breddat till titel, syfte, aktivitetstyp och taggar
- filter pa aktivitetstyp tillagt
- snabbare urval for planeringsscenarier

### P3 - Regression och verifiering

Genomfort:

- test for komplett programresa tillagt
- test for stegvis progression i winger-sparet tillagt
- lint, test och build verifierade efter implementation

## Andrade filer i 0.8

- src/app/utbildning/page.tsx
- src/app/utbildning/program/[programId]/page.tsx
- src/app/utbildning/program/[programId]/fragor/[questionId]/page.tsx
- src/app/utbildning/program/[programId]/fragor/[questionId]/teman/[themeId]/page.tsx
- src/app/utbildning/block/[blockId]/page.tsx
- src/app/pass/[id]/page.tsx
- src/application/services/academyReadService.ts
- src/components/ExercisesExplorer.tsx
- src/components/EducationBreadcrumbs.tsx
- src/app/globals.css
- tests/academy/programJourney.test.ts

## Verifieringsutfall

Verifierat vid sprintstangning:

- npm run lint: pass
- npm test: pass, 86 tester passerar
- npm run test:integration: pass, 13 tester passerar, 0 skip
- npm run build: pass

Notering:

- en tillfallig filesystems-lasning i .next relaterad till synkad katalog noterades under build, och verifieringen passerade efter ny korning

## DoD-avstamning

1. Uppfyllt: primar anvandarresa Program -> Huvudfraga -> Tema -> Block -> Pass ar klickbar i appen.
2. Uppfyllt: ovningsbankens sok och filtrering ar forstarkta for planering.
3. Uppfyllt: befintliga domanmodeller, use cases och repositories ar ateranvanda utan ny huvuddoman.
4. Uppfyllt: lint, test och build passerar.
5. Uppfyllt: kopplingen till Education Plan och coachflodet ar bibehallen.
6. Uppfyllt: regressionsverifiering av coachflodets kritiska kedja passerar i integrationssviten.

## Oppna risker

1. Scope-expansion riskerar att blanda innehallsexpansion med bred UX-redesign.
2. Navigationsforbattringar kan skapa regressionsrisk om passfloden andras utan ytterligare integrationstester.
3. Datakvalitet i innehallsmodellen behover fortsatt validering nar fler block/pass adderas.

## Avslutning Version 0.8

Version 0.8 ar formellt stangd som klar.

Fokus i versionen har varit Program -> Huvudfraga -> Tema -> Block -> Pass, forstarkt planeringsstod i ovningsbanken, bibehallen Education Plan/Coach Flow-koppling och verifierad regressionsfrihet genom lint, test, test:integration och build.

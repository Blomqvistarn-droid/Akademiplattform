# Sprintplan 0.8 - Program & Content Expansion

Datum: 2026-07-14

## Status

Detta dokument beskriver inriktning och slutlig leveransstatus for Sprint 0.8.

- 0.7 är avslutad med verifierad data parity och kvalitetsgrind
- Sprint 0.8 ar avslutad och klar
- fokus flyttas från teknisk hårdning till produktnytta i utbildningsflödet

Forsta leverans i sprinten:

- klickbar huvudresa Program -> Huvudfraga -> Tema -> Block -> Pass under Utbildning
- blockniva som visar kopplade pass och leder vidare till passdetalj
- ovningsbank med utokad sokning och aktivitetstypfilter
- verifierat med grona kvalitetsgrindar: lint, test, build

Relaterad leveranslogg:

- se CHANGELOG_0.8.md for detaljerad andrings- och verifieringslogg

Formell stangning:

- Sprint 0.8 stangs efter verifierad DoD-avstamning
- kvalitetsgrind passerar: lint, test, test:integration, build

## Sammanfattning

Sprint 0.8 ska leverera tydlig användarnytta i tränarens planerings- och genomförandeflöde, byggt på den stabila grund som säkrades i 0.7.

Sprinten ska inte introducera någon ny huvuddomän, utan bygga vidare på befintliga domänmodeller, use cases och repositories.

Målet är att göra innehållsmodellen mer komplett i produkten:

- Program
- Huvudfrågor
- Teman
- Utbildningsblock
- Pass
- Övningar

Sprinten ska samtidigt behålla den verifieringsdisciplin som etablerades i 0.7.

Primär användarresa i sprinten:

- Program -> Huvudfråga -> Tema -> Block -> Pass

## Målbild för Sprint 0.8

Efter sprinten ska tränaren kunna:

- navigera tydligt från Program till Huvudfråga, Tema, Block och Pass
- hitta och välja övningar via förbättrad filtrering och sök
- starta planering och genomförande utan manuella workaround
- fortsätta använda reflektion och recommendation i ett sammanhängande coachflöde
- göra ovanstående effektivt i mobilupplevelsen

## Problem som Sprint 0.8 ska lösa

### 1. Innehållet är inte tillräckligt exponerat i produktflödet

Problem:
- innehållsmodellen finns men är ännu inte fullt synlig i appens dagliga tränarflöde

Konsekvens:
- högre kognitiv last vid planering
- risk att tränaren inte nyttjar utbildningsstrukturen fullt ut

### 2. Sök och filtrering behöver stödja verklig planering

Problem:
- övningssök och filtrering täcker inte hela planeringsbehovet i praktiken

Konsekvens:
- längre tid från idé till färdigt pass
- sämre återanvändning av övningsinnehåll

### 3. Produktnyttan behöver växa utan regressionsrisk

Problem:
- ökande produktscope kan snabbt ge regressionsrisk i coachflödets kritiska kedja

Konsekvens:
- risk för förlorad stabilitet från 0.7

## Rekommenderat scope

Ingår:

- fullt navigerbar kedja Program -> Huvudfråga -> Tema -> Block -> Pass
- förbättrad övningsbank med filtrering och sök för planeringsflöden
- återanvändning av befintliga domänmodeller, use cases och repositories
- bevarad koppling till Education Plan och recommendation-flödet
- fortsatt mobil först i kärnvyer
- verifiering av regressionsfri coachkedja

Ingår inte:

- ny huvuddomän
- full redesign av UI
- ny auth-modell eller ny organisationsmodell
- omfattande CI/CD-omläggning
- avancerad statistikplattform

## Prioriterad ändringsordning

### P1 - Program till pass via huvudfråga i produktflödet

Mål:
- göra innehållshierarkin Program -> Huvudfråga -> Tema -> Block -> Pass konkret och navigerbar i appen

Förväntat resultat:
- tränaren kan gå från Program till Pass utan manuella sidospår

### P2 - Övningsbank och planeringssök

Mål:
- förbättra filtrering och sök för tränarens verkliga planering

Förväntat resultat:
- snabbare urval av relevanta övningar
- bättre återanvändning mellan pass

### P3 - Flödeskoppling till genomförande

Mål:
- säkerställa att planering, genomförande och reflektion hänger ihop

Förväntat resultat:
- sammanhängande coachupplevelse från plan till rekommendation

### P4 - Regression och kvalitetsgrind

Mål:
- behålla den verifieringsnivå som etablerades i 0.7

Förväntat resultat:
- lint, test och build fortsatt stabila
- kritiska flöden verifierade utan regressionsintroduktion

## Förslag på verifiering

Obligatorisk kvalitetsgrind:

- npm run lint
- npm test
- npm run build

Databasspecifik verifiering:

- relevanta repository- och integrationsflöden för Education Plan
- coachkedja i databasläge

Manuellt:

- Program -> Huvudfråga -> Tema -> Block -> Pass i mobil vy
- övningssök och filtrering i planeringsscenario
- kärnflöde med reflektion och recommendation utan regressionsfel

## Success Metrics

- tränaren kan navigera Program -> Huvudfråga -> Tema -> Block -> Pass utan avbrott
- planeringssök minskar antalet manuella steg för att hitta passinnehåll
- kritiska coachflöden passerar verifiering utan regressionsfel
- lint, test och build är gröna i sprintens slutverifiering
- mobilupplevelsen för kärnresan är verifierad i relevanta vyer

## Definition of Done

Sprint 0.8 är klar när:

1. Program, tema, block och pass är sammanhängande i produktflödet.
2. Primär användarresa Program -> Huvudfråga -> Tema -> Block -> Pass är fullt navigerbar.
3. Övningsbankens filtrering och sök stödjer planeringsfall enligt sprintscope.
4. Befintliga domänmodeller, use cases och repositories har återanvänts utan ny huvuddomän.
5. Kopplingen till Education Plan och Coach Flow är bibehållen.
6. Coachflödets kritiska kedja är fortsatt verifierad utan regression.
7. Lint, test och build passerar utan interaktivitet.
8. Dokumentation är uppdaterad med levererat scope, verifieringsutfall och kända begränsningar.

## Risker

1. Scope kan bli för brett om innehållsexpansion blandas med större UX-redesign.
2. Ny planeringsfunktionalitet kan påverka befintlig coachkedja utan tydlig regressionstäckning.
3. Innehållskvalitet kan bli ojämn om modellutökning sker snabbare än validering.

## Faststallda produktbeslut

1. Sprint 0.8 prioriterar produktnytta i innehålls- och planeringsflödet.
2. Coachkedjans verifieringsnivå från 0.7 ska bibehållas.
3. Ingen ny huvuddomän introduceras i 0.8.
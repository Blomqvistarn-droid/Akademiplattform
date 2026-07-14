# Sprintplan 0.9 - Coach Loop Completion

Datum: 2026-07-14

## Status

Detta dokument beskriver inriktning och slutlig leveransstatus for Sprint 0.9.

- 0.8 ar avslutad och klar
- Sprint 0.9 ar avslutad och klar
- fokus ar att slutföra den sammanhängande coachloopen utan ny huvuddomän

Forsta leverans i sprinten:

- integrerat Forbered-steg i befintlig coachstepper (ingen separat funktion)
- visuell stegprogression i hela loopen
- klickbart Program- och Pass-led i samma coachflode
- explicit Nasta steg efter recommendation och beslut
- integrationsverifiering for recommendation-steget skarpt i local och database-lage
- roadmap synkad till exakt 0.9-kedja och constraints

Formell stangning:

- Sprint 0.9 stangs efter verifierad DoD-avstamning
- kvalitetsgrind passerar: lint, test, test:integration, build

## Sammanfattning

Sprint 0.9 ska bygga vidare pa 0.8 genom att slutföra coachens sammanhängande arbetsflöde från planering till uppföljning.

Sprinten ska inte introducera nagon ny huvuddoman, utan ateranvanda befintliga domanmodeller, use cases och repositories.

Planeringsmoment ska integreras i det befintliga coachflödet och inte byggas som en fristående funktion.

Primar anvandarresa i sprinten:

- Program -> Pass -> Forbered -> Genomfor -> Reflektera -> Rekommendation -> Nasta steg

## Malbild for Sprint 0.9

Efter sprinten ska coachen kunna:

- ga hela loopen från Program till Nasta steg utan manuella sidospar
- valja pass och gora nodvandiga planeringsjusteringar innan genomforande
- genomfora pass med tydlig progressindikator i flodet
- avsluta med reflektion och fa recommendation i samma sammanhang
- arbeta i en sammanhallen mobilupplevelse mellan planering, genomforande och uppfoljning

## Problem som Sprint 0.9 ska losa

### 1. Glapp mellan planering och genomforande

Problem:
- overgangen mellan valt pass, forberedelse och faktisk session ar inte tillrackligt styrd

Konsekvens:
- coachen tappar flodeskontekst
- risk for ojamn kvalitet i genomforandet

### 2. Planeringsmoment ar inte tillrackligt tydliga

Problem:
- viktiga forberedelser innan pass saknar tydlig struktur i upplevelsen

Konsekvens:
- hogre kognitiv last
- storre variation i hur pass genomfors

### 3. Kedjan Program -> Pass -> Forbered -> Genomfor -> Reflektera -> Rekommendation -> Nasta steg kan bli fragmenterad

Problem:
- nar coachen gar genom hela kedjan saknas ett konsekvent loopat stegflode till nasta steg

Konsekvens:
- risk for regressionsfel i coachkedjan
- svagare produktnytta av befintlig Education Plan-logik

## Rekommenderat scope

Ingar:

- tydligt integrerat planeringsmoment mellan passval och genomforande
- sammanhallen overgang till reflektion, recommendation och nasta steg
- visuell progressindikator i coachens stegkedja
- fortsatt mobil-fokus i berorda vyer
- regressionsverifiering av kritisk coachkedja i local och database-lage
- bibehallen koppling till Education Plan, Reflection och Recommendation

Ingar inte:

- ny huvuddoman
- bred redesign av hela UI
- ny auth-modell eller ny organisationsmodell
- omfattande CI/CD-omlaggning

## Prioriterad andringsordning

### P1 - Planeringssteg mellan passval och genomforande

Mal:
- ge coachen ett tydligt och snabbt planeringssteg som kopplar Program och Pass till faktisk session

Forvantat resultat:
- farre manuella hopp mellan vyer
- konsekvent start av passflodet

### P2 - Sammanhallen coach-loop

Mal:
- knyta ihop Program -> Pass -> Forbered -> Genomfor -> Reflektera -> Rekommendation -> Nasta steg utan avbrott

Forvantat resultat:
- coachen far ett komplett loopat flode
- hogre anvandarvarde av redan byggd domanlogik

### P3 - Regression och kvalitetsgrind

Mal:
- bibehalla verifieringsnivan fran 0.7 och 0.8

Forvantat resultat:
- lint, test, test:integration och build fortsatt stabila
- kritisk coachkedja verifierad utan regressionsintroduktion

## Forslag pa verifiering

Obligatorisk kvalitetsgrind:

- npm run lint
- npm test
- npm run test:integration
- npm run build

Databasspecifik verifiering:

- coachkedja i databaslage
- relevanta Education Plan- och reflectionsfloden

Lagespecifik regressionsverifiering:

- kritisk coachkedja i local-lage
- kritisk coachkedja i database-lage

Manuellt:

- Program -> Pass -> Forbered -> Genomfor i mobil vy
- Reflektera -> Rekommendation -> Nasta steg efter genomford pass
- kontroll av sammanhang och tydlig stegprogression

## Success Metrics

- coachen kan gora hela loopen Program -> Pass -> Forbered -> Genomfor -> Reflektera -> Rekommendation -> Nasta steg utan manuella sidospar
- planeringssteget minskar tiden fran passval till startat pass
- kritiska coachfloden passerar regressionstester utan fel
- lint, test, test:integration och build ar grona vid sprintens slut

## Definition of Done

Sprint 0.9 ar klar nar:

1. Planeringssteg mellan passval och genomforande ar implementerat och anvandbart.
2. Flodet Program -> Pass -> Forbered -> Genomfor -> Reflektera -> Rekommendation -> Nasta steg ar sammanhallet utan sidospar.
3. Befintliga domanmodeller, use cases och repositories har ateranvants utan ny huvuddoman.
4. Kopplingen till Education Plan, Reflection och Recommendation ar bibehallen.
5. Kritisk coachkedja ar verifierad i local och database-lage.
6. Lint, test, test:integration och build passerar utan interaktivitet.
7. Dokumentation ar uppdaterad med levererat scope, verifieringsutfall och kanda begransningar.

## Risker

1. Scope kan glida mot bred UX-redesign i stallet for flodesforbattring.
2. Delar av planeringslogiken kan dupliceras om stegansvar inte avgransas tydligt.
3. Flodesandringar kan skapa regressionsrisk i coachkedjan utan tillracklig integrationsverifiering.

## Faststallda produktbeslut

1. Sprint 0.9 prioriterar komplett coach-loop over nya domaninitiativ.
2. Verifieringsnivan fran 0.7 och 0.8 ska bibehallas.
3. Ingen ny huvuddoman introduceras i 0.9.
4. Planeringsmoment integreras i befintligt coachflode och etableras inte som separat produktfunktion.
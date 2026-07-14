# Sprintplan 0.7 - Data Parity & Quality Hardening

Datum: 2026-07-14

## Status

Detta dokument beskriver genomförd leverans för Sprint 0.7.

- nulägesbedömning är genomförd på roadmap-, changelog- och sprintnivå
- rekommenderad målbild är definierad
- scope, risker och definition of done är föreslagna
- tre implementationsslice är genomförda: fail-fast för Education Plan i databasläge, postgres Education Plan repository med gemensam kontraktstestsvit, samt databasintegrationstest för kritisk coachkedja
- slutlig verifieringsgrind är genomförd: lint, test och build passerar
- sprint 0.7 är stängd som klar

## Sammanfattning

Sprint 0.7 bör vara en hårdningssprint snarare än en ny funktionssprint.

Motivering:

- coachflödet är nu levererat genom Sprint 0.6.1-0.6.3
- största kvarvarande risk ligger i datalagerparitet, verifieringsbarhet och driftmässig robusthet
- nästa sprint bör minska teknisk risk innan större ny funktionalitet byggs ovanpå Education Plan-flödet

Rekommenderat namn:

- Data Parity & Quality Hardening

## Målbild för Sprint 0.7

Efter sprinten ska lösningen vara mer produktionsnära utan att introducera ny huvuddomän:

- Education Plan fungerar mot avsedd database-provider utan runtime-beroende av lokal fallback
- kritiska coachflöden kan verifieras repeterbart i automatiserade körningar
- kvalitetsgrinden för lint, build, unit och integration är stabil och tydlig
- roadmap och arkitekturdokument speglar faktisk målarkitektur och verifierad driftmodell

## Definition av parity

Parity i Sprint 0.7 betyder inte att två implementationer råkar ha liknande metoder. Parity ska avse samma verifierade beteendekontrakt för local och database-provider.

Parity avser observerbart beteende genom repository-kontrakt och use cases. Intern implementation, databasstruktur och optimeringar får skilja sig så länge kontraktet uppfylls.

Parity ska omfatta:

- domänbeteende
- statusövergångar
- validering
- felbeteende
- metadata
- ordning och persistens
- idempotens där det är relevant

Följande beteenden ska verifieras för båda repository-varianterna:

| Operation | Local | Database | Förväntat beteende |
| --------- | ----- | -------- | ------------------ |
| skapa och hämta plan | Ja | Ja | samma domänresultat |
| lista planer | Ja | Ja | samma filtrering och sortering |
| starta plan eller block | Ja | Ja | samma statusövergång |
| spara progress event | Ja | Ja | samma eventtyp och metadata |
| spara coach decision | Ja | Ja | samma progression och returvärde |
| hämta efter sparning | Ja | Ja | ingen förlorad data |
| ogiltig operation | Ja | Ja | samma felkategori |

## Problem som Sprint 0.7 bör lösa

### 1. Datalagerparitet

Problem:
- Education Plan har inte full parity mellan local och database-provider i runtime-kompositionen

Konsekvens:
- risk för skillnader mellan utvecklingsläge och verklig drift
- svårt att lita på att progression och planstatus beter sig likadant i alla miljöer

### 2. Otydlig verifieringsyta

Problem:
- delar av verifieringen är fortfarande miljöberoende och ger olika testutfall mellan körmiljöer

Konsekvens:
- svårare att bedöma releasekvalitet snabbt och konsekvent
- högre manuell regressionskostnad

### 3. Dold fallback i databasläge

Problem:
- applikationen får inte se fungerande ut samtidigt som data i praktiken sparas i local-repository på grund av tyst fallback

Konsekvens:
- hög risk för felsökning på fel datakälla
- osäker verifiering av faktisk driftmodell

### 4. Begränsad automatisering av kritiska UI-flöden

Problem:
- kritiska coachflöden är huvudsakligen verifierade manuellt

Konsekvens:
- regressionsrisk i det mest affärsnära användarflödet
- återkommande manuell kontroll krävs vid förändringar

## Rekommenderat scope

Ingår:

- database-provider för Education Plan med samma centrala beteenden som local-läget
- runtime-komposition som väljer rätt repository utan dold lokal fallback
- gemensam repository contract test suite för Education Plan
- explicit providerkonfiguration med fail-fast-beteende
- dokumenterad testdatabas eller testisolering
- automatiserad verifiering av coachflödets kritiska väg
- verifiering av återläsning efter progression och coach decision
- stabil kvalitetsgrind för lint, build, unit och integration
- dokumentation av faktisk driftmodell, verifieringsmodell och kvarvarande begränsningar

Ingår inte:

- ny huvuddomän
- ny större användarfunktion
- redesign av UI
- generell plattformsomläggning
- prestandaoptimering utöver uppenbara blockerande problem
- ny generell observability-plattform
- fullständig CI/CD-omläggning
- migrering av andra repositories som inte krävs för Education Plan-flödet
- bred refaktorering utan direkt koppling till parity eller verifiering

## Prioriterad ändringsordning

### P1 - Education Plan database parity

Mål:
- få Education Plan att fungera mot avsedd database-provider med samma kärnbeteenden som local-repository

Förväntat resultat:
- list/get/start/progression fungerar konsekvent mellan repository-varianter
- coach decision och progressionsevent beter sig likadant i båda lägen
- samma kontraktstestsvit kan köras mot båda implementationerna

### P2 - Runtime-komposition och miljöstyrning

Mål:
- göra repository-val explicit och verifierbart i runtime

Förväntat resultat:
- ingen oavsiktlig lokal fallback i databasläge
- tydlig konfiguration för lokal miljö respektive databasläge
- aktiv provider är diagnostiserbar utan att exponera känsliga värden

Arkitekturregel:

- om database-provider är vald och inte kan initieras ska applikationen misslyckas tydligt vid uppstart eller första användning
- applikationen får aldrig tyst växla till local-repository i databasläge

Acceptanskriterier:

- explicit provider väljs via miljökonfiguration
- okänt providervärde ger tydligt konfigurationsfel
- saknad databaskonfiguration i databasläge ger tydligt fail-fast-fel
- local används endast när local uttryckligen är valt

Status efter första implementationsslice:

- uppfyllt för Education Plan repository-val i runtime-kompositionen
- databasläge använder inte längre local fallback för Education Plan

Status efter andra implementationsslice:

- postgres Education Plan repository finns nu för list/get/getByTeam/getActive/save
- samma kontraktstestsvit körs mot både local och postgres implementationen
- migrationsunderlag för Education Plan-tabeller är tillagt

Status efter tredje implementationsslice:

- integrationsflöde för kritisk coachkedja är tillagt och verifierat i databasläge
- kedjan completed -> reflection -> recommendation -> decision -> återläst progress update är nu automatiskt verifierad mot database-provider

### P3 - Automatiserad kvalitetsgrind

Mål:
- säkerställa repeterbar körning av lint, build, unit och integration

Förväntat resultat:
- tydlig verifieringssekvens för sprintens leverans
- färre oklarheter kring skip, miljöberoenden och förväntat utfall

Obligatorisk kvalitetsgrind:

- npm run lint
- npm test
- npm run build
- integrationsprov som inte kräver extern miljö

Databasverifiering:

- repository contract/parity tests
- database integration tests
- kritiskt coachflöde mot database-provider

Regel för skip:

- varje skip ska vara avsiktlig
- varje skip ska vara dokumenterad
- varje skip ska vara kopplad till ett tydligt miljökrav
- varje skip ska vara synlig i slutrapporten

### P4 - Kritisk flödesverifiering

Mål:
- automatisera den viktigaste vägen i coachflödet

Förväntat resultat:
- minst ett högvärdestest som täcker completed -> reflection -> recommendation -> decision -> progress update
- minskad regressionsrisk i coachupplevelsen

Testnivå:

- huvudspåret i denna sprint är ett stabilt applikations- eller integrationstest för hela kritiska kedjan
- högst ett tunt browsertest kan tillföras om nuvarande arkitektur och verktyg stödjer det utan tung ny setup

Det kritiska testet ska verifiera:

- completed
- reflection sparas
- recommendation genereras
- coach decision sparas
- progress event finns
- uppdaterad Education Plan kan läsas tillbaka

## Tekniska riktlinjer

- konsolidering framför expansion ska fortsatt gälla
- befintlig domänmodell för Education Plan ska återanvändas
- ingen separat ny resursmodell för coach decision ska införas
- parity ska mätas i beteende, inte bara i lagringsformat
- testbarhet och diagnostik väger högre än snabb ny funktionalitet i denna sprint
- repository-kontraktet ska definieras före implementationdetaljer i database-provider
- use cases och domänregler är facit, inte local-repositoryns interna implementation

## Förslag på verifiering

Obligatorisk kvalitetsgrind:

- npm run lint
- npm test
- npm run build
- miljöoberoende integrationstester

Databasverifiering:

- riktad verifiering av Education Plan repository parity
- database integration tests
- kritiskt coachflöde mot database-provider i dokumenterad databasmiljö

Aktuellt verifierat i denna sprint:

- kontraktstestsvit etablerad och körd mot local Education Plan repository
- runtime-tester verifierar fail-fast och frånvaro av dold local fallback i databasläge
- kontraktstestsvit etablerad och körd mot postgres Education Plan repository
- migration 000005 verifierad via migrationstest
- ordinarie testsvit passerar med 84 gröna tester
- databasintegrationstest för kritisk coachkedja passerar

Manuellt:

- stickprov i coachflödet i lokal miljö
- stickprov i databasläge där miljön tillåter
- kontroll av att progression syns konsekvent efter sparade beslut

## Success Metrics

- 100 % av kontraktstesterna passerar för både local och database Education Plan repository.
- Inga oavsiktliga fallbacks till local repository sker i databasläge.
- Alla obligatoriska kvalitetsgrindar passerar utan manuella ingrepp.
- Minst ett komplett coachflöde verifieras automatiskt mot database-provider.
- Ingen förändring av domänmodellen eller API-kontrakten krävs för att uppnå parity.

## Definition of Done

Sprint 0.7 är klar när:

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

Slutlig avstämning:

- samtliga punkter i Definition of Done är uppfyllda
- verifierat med lint, test, build och databasintegration för kritisk coachkedja

## Risker

1. Databasmigrering och repository-parity kan visa att lokalmodellen döljer beteendeskillnader som kräver mindre domänjusteringar.
2. Miljöberoende tester kan behöva delas upp tydligare mellan obligatoriska och valfria verifieringar.
3. För stor ambition i UI-automation kan göra sprinten bredare än nödvändigt; fokus bör ligga på den kritiska vägen.
4. Tester riskerar att koda local-repositoryns implementation i stället för repository-kontraktet.

Åtgärd:

- definiera repository-kontraktet först
- kör samma kontraktstestsvit mot båda implementationerna
- låt domänregler och use cases vara facit, inte local-repositoryns interna detaljer

## Rekommenderat produktbeslut före implementation

Följande bör bekräftas innan implementation startar:

1. Sprint 0.7 prioriterar hårdning framför ny användarfunktionalitet.
2. Education Plan database parity är den viktigaste tekniska leveransen.
3. Ett begränsat antal högvärdestester är tillräckligt i denna sprint; full UI-testsvit ingår inte.
4. Kvarvarande roadmap för utbildningsprogram, övningar och sök skjuts efter denna hårdningssprint.
5. Databasläge får aldrig tyst falla tillbaka till local-repository; felaktig databas-konfiguration ska vara synlig och stoppa berörd körning.

Status:

- produktbesluten ovan är tillämpade i genomförd implementation

# Akademiplattform – Reviderat beslutsunderlag för Version 0.4

## 1. Bakgrund

Akademiplattformen är en långsiktig utbildningsplattform för fotboll.

Plattformens kärna är en gemensam utbildningsmotor som ska stödja klubbens spelarutbildning genom olika spelformer, åldrar och utbildningsområden.

Appen är ett gränssnitt ovanpå denna utbildningsmotor.

All funktionalitet ska bedömas mot följande princip:

> Ingen funktion ska byggas om den inte hjälper tränaren att utbilda bättre spelare.

Projektet ska utvecklas genom små, fungerande och tydligt avgränsade releaser.

---

## 2. Ursprunglig roadmap

Den ursprungliga roadmapen definierades enligt följande:

### Version 0.1

* Projektgrund
* Git
* GitHub
* Next.js
* Grundlayout
* Navigation

### Version 0.2

* Datamodell
* Informationsmodell
* Utbildningsmotor

### Version 0.3

* Block
* Pass
* Övningar
* Progression

### Version 0.4

* Reflektion
* Rekommendationsmotor

### Version 0.5

* Admin
* Flera lag

### Version 1.0

* Databas
* Inloggning
* Mobiloptimering

Den ursprungliga produktvisionen angav även att den första versionen skulle fungera utan databas, inloggning och statistik.

---

## 3. Identifierad avvikelse

Den nuvarande implementationen av Version 0.4 innehåller bland annat:

* PostgreSQL repository
* databasmigreringar
* databasconstraints
* organisation-scope
* databasbaserade integrationstester
* HTTP API
* Application Layer
* repository-kontrakt för datalagring

Detta innebär att delar som ursprungligen planerades till Version 1.0 har införts redan i Version 0.4.

Avvikelsen ska inte automatiskt tas bort, men den ska dokumenteras, motiveras och beslutas innan fortsatt implementation.

Codex ska därför inte utgå från att den nuvarande implementationen automatiskt definierar rätt roadmap.

---

## 4. Beslut som behöver fattas

Innan Version 0.4 fortsätter ska följande beslut dokumenteras.

### Beslut A – Behåll tidig databasintroduktion

Projektet accepterar att PostgreSQL och tillhörande infrastruktur införs redan i Version 0.4.

Konsekvenser:

* Version 1.0 behöver omdefinieras
* roadmapen behöver uppdateras
* databas och repository blir en del av plattformens grundarkitektur
* framtida funktioner kan bygga direkt mot beständig lagring

### Beslut B – Återgå till ursprunglig roadmap

Version 0.4 ska fungera med lokala eller statiska data.

Konsekvenser:

* PostgreSQL-implementationen tas bort eller avaktiveras
* migreringar skjuts till Version 1.0
* rekommendationsmotorn byggs ovanpå Local Repository
* Version 0.4 hålls enklare

### Rekommenderat beslut

Behåll den tidiga databasintroduktionen, förutsatt att den befintliga arkitekturen är stabil och inte skapar onödig komplexitet.

Skälet är att implementationen redan finns och att repository-abstraktionen gör det möjligt att stödja både lokal och beständig lagring.

Roadmapen ska dock uppdateras så att detta är ett medvetet arkitekturbeslut, inte en odokumenterad avvikelse.

---

## 5. Målbild för Version 0.4

Version 0.4 ska etablera Reflection-vertikalen genom hela systemet.

Efter versionen ska en tränare kunna:

1. genomföra ett träningspass
2. göra en kort reflektion efter passet
3. ange hur väl laget förstod innehållet
4. ange hur självständigt laget kunde utföra det
5. få en enkel och tydlig rekommendation om nästa steg

Systemet ska kunna rekommendera att laget:

* förenklar
* upprepar
* går vidare inom temat
* går vidare till nästa block

Version 0.4 ska skapa en grund för framtida rekommendationer, men ska inte innehålla avancerad analys, AI eller statistik.

---

## 6. Koppling till utbildningsfilosofin

Reflection och Recommendation ska stödja utbildningsmodellen, inte bli en fristående teknisk funktion.

Reflektionen ska hjälpa tränaren att bedöma om spelarna:

* har förstått spelproblemet
* kan använda aktuell spelprincip
* kan fatta egna beslut
* är redo för ökad komplexitet
* behöver fler repetitioner
* behöver ett enklare sammanhang

Rekommendationen ska utgå från den pedagogiska progressionen:

1. Introduktion
2. Utveckling
3. Fördjupning
4. Tillämpning

Rekommendationen ska även ta hänsyn till att varje tema normalt genomförs under tre till fyra träningspass.

---

## 7. Scope för Version 0.4

### Ingår

#### Domänmodell

* SessionReflection
* koppling till ScheduledSession
* understandingScore
* independenceScore
* repository-kontrakt för Reflection

#### Application Layer

* skapa reflection
* hämta reflection
* lista reflections
* hämta rekommendation
* validering
* mapping
* regelbaserad recommendation service

#### Infrastruktur

* Local Repository
* PostgreSQL Repository
* migration
* test-fixtures
* repository-baserad dataåtkomst

#### API

* skapa reflection
* hämta enskild reflection
* lista reflections
* hämta rekommendation
* organisation-scope
* befintlig felmodell

#### Kvalitet

* domäntester
* handler-tester
* repository-integrationstester
* API-integrationstester för centrala flöden
* build-verifiering

---

## 8. Utanför scope

Version 0.4 ska inte innehålla:

* AI-genererade rekommendationer
* maskininlärning
* adaptiva modeller
* trendanalys
* statistikdashboard
* rapporter
* export
* notifieringar
* administrativ redigering
* avancerade behörighetsnivåer
* spelarindividuella reflektioner
* målvaktsanpassad rekommendationslogik
* automatisk analys av flera säsonger
* UI för fullständig historik

Update och Delete för Reflection ska endast införas om ett verkligt användarbehov dokumenteras.

De ska inte läggas till enbart för att komplettera CRUD.

---

## 9. Domänregler som måste fastställas

Codex ska inte själv fatta följande produktbeslut under implementationen.

### Reflection

* En reflection ska tillhöra ett ScheduledSession.
* Ett ScheduledSession ska tillhöra aktuell organisation.
* understandingScore ska vara ett heltal mellan 1 och 5.
* independenceScore ska vara ett heltal mellan 1 och 5.
* Score-fälten ska vara obligatoriska för nya reflections.
* Det ska dokumenteras om ett pass kan ha en eller flera reflections.
* Det ska dokumenteras vem som får skapa reflection.
* Det ska dokumenteras om reflection kan göras innan passet är avslutat.
* Det ska dokumenteras om reflection får ändras efter att den skapats.

### Recommendation

Recommendation ska vara:

* deterministisk
* begriplig för tränaren
* möjlig att testa
* baserad på dokumenterade regler
* kopplad till utbildningsprogressionen

Recommendation ska inte vara en teknisk poängberäkning utan pedagogisk innebörd.

---

## 10. Föreslagen rekommendationsmodell för Version 0.4

Följande modell används som utgångspunkt.

### Förenkla

När:

* understandingScore är 1 eller 2

Syfte:

* minska komplexiteten
* återgå till mindre spelsituation
* tydliggöra spelproblemet
* använda fler frågor och enklare constraints

### Upprepa

När:

* understandingScore är 3
* eller independenceScore är 1 eller 2

Syfte:

* ge fler repetitioner
* behålla samma lärandemål
* justera övning eller coaching

### Gå vidare inom temat

När:

* understandingScore är minst 4
* independenceScore är 3 eller 4

Syfte:

* öka komplexiteten
* fortsätta till nästa pass i progressionen
* behålla samma huvudfråga och tema

### Gå vidare till nästa block

När:

* understandingScore är 5
* independenceScore är 5
* blockets tidigare pass är genomförda
* lärandemålet bedöms uppnått

Syfte:

* gå vidare i utbildningsplanen

Det ska finnas en tydlig fallback om det saknas tillräckligt underlag för recommendation.

---

## 11. API-kontrakt

### POST /api/reflections

Skapar en reflection.

Ska validera:

* organisation
* scheduledSessionId
* understandingScore
* independenceScore
* eventuella obligatoriska reflektionsfält

Ska hantera:

* ogiltiga score-värden
* saknat pass
* pass utanför organisationen
* duplicerad reflection enligt beslutad regel

### GET /api/reflections/{id}

Hämtar en reflection inom aktuell organisation.

Ska inte exponera reflections från andra organisationer.

### GET /api/reflections

Ska stödja tydligt definierade filter.

Primära filter:

* scheduledSessionId
* teamId

Det ska vara tydligt om ett filter krävs eller om alla reflections i organisationen kan hämtas.

### GET /api/reflections/recommendation

Returnerar recommendation för ett specifikt ScheduledSession.

Svaret ska innehålla:

* recommendation type
* pedagogisk motivering
* underlag som användes
* eventuell information om att underlaget är otillräckligt

---

## 12. Databasbeslut

Om PostgreSQL behålls i Version 0.4 ska följande gälla.

* Databasdesignen ska stödja domänmodellen, inte styra den.
* Repository-kontrakt ska ligga innanför infrastrukturen.
* Migrering ska ha fungerande rollback.
* Constraints ska spegla domänregler.
* Äldre data får inte automatiskt få missvisande reflektionsvärden.

Defaultvärden för score-fält ska särskilt granskas.

Om äldre rows saknar verkliga score-värden är NULL normalt mer semantiskt korrekt än ett defaultvärde som kan tolkas som ett faktiskt tränarsvar.

Codex ska redovisa hur migreringen hanterar befintliga rows.

---

## 13. Teststrategi

Version 0.4 är inte klar enbart för att unit tests och build passerar.

Minimikrav:

### Unit tests

* validering av score
* mappning
* recommendation-regler
* not found
* organization-scope
* dupliceringsregel
* otillräckligt rekommendationsunderlag

### Repository integration tests

* create
* get
* list per session
* list per team
* organization-isolering
* constraints
* migrationens förväntade schema

### API integration tests

* lyckad POST
* felaktig POST
* GET av befintlig reflection
* GET av saknad reflection
* cross-organization access
* recommendation
* saknat organization-header
* korrekt HTTP-status för ApplicationError

---

## 14. Definition of Done

Version 0.4 är klar när:

* målbilden är uppfylld
* scope följs
* domänreglerna är dokumenterade
* recommendation-reglerna är dokumenterade
* API-kontrakten är tydliga
* databasavvikelsen från ursprunglig roadmap är beslutad
* samtliga tester passerar
* build passerar
* migrering upp och ned är verifierad
* inga oavsiktliga ändringar har införts
* inga nya funktioner utanför scope har lagts till
* ändringsloggen är uppdaterad
* roadmapen är uppdaterad

---

## 15. Reviderad roadmap

### Version 0.4 – Reflection Foundation

* reflektion efter träningspass
* förståelsevärde
* självständighetsvärde
* regelbaserad rekommendation
* Local Repository
* PostgreSQL Repository
* grundläggande API
* testad end-to-end-vertikal

### Version 0.5 – Team och administration

* flera lag
* grundläggande administration
* koppling mellan lag och utbildningsplan
* hantering av lagets progression

### Version 0.6 – Training Experience

* mobilanpassat tränarflöde
* genomförande av pass på planen
* snabb reflektion efter pass
* tydligare rekommendationspresentation

### Version 0.7 – Education Planning

* utbildningsöversikt
* blockprogression
* planering av kommande pass
* status för tema och lärandemål

### Version 1.0 – Första användbara produkt

* inloggning
* stabil databas
* organisationer
* flera lag
* mobiloptimering
* utbildningsöversikt
* pass
* övningsbank
* reflektion
* recommendation
* grundläggande administration

Version 1.0 ska inte innehålla avancerad statistik eller AI.

---

## 16. Arbetsinstruktion till Codex

Codex ska först granska den befintliga Version 0.4-implementationen mot detta dokument.

Ingen ny funktionalitet ska implementeras innan granskningen är klar.

Codex ska leverera en gap-analys med följande rubriker:

1. Funktionalitet som överensstämmer med målbilden
2. Funktionalitet som ligger utanför scope
3. Domänbeslut som verkar ha fattats utan dokumentation
4. Avvikelser från ursprunglig roadmap
5. Risker i databas och migrering
6. Saknade tester
7. Rekommenderade ändringar
8. Filer som behöver ändras
9. Filer som bör lämnas orörda

Codex ska därefter föreslå en ändringsplan.

Ändringsplanen ska ange:

* ändring
* motivering
* berörda filer
* risk
* verifiering
* om ändringen är nödvändig eller valfri

Codex ska inte implementera ändringsplanen innan planen är presenterad och godkänd.

Vid implementation ska Codex:

* göra minsta möjliga ändring
* undvika generell CRUD-funktionalitet utan användarbehov
* inte införa nya abstraktioner utan tydlig nytta
* bevara befintliga fungerande kontrakt när möjligt
* uppdatera tester samtidigt med implementationen
* verifiera organisation-isolering
* verifiera migrering och rollback
* inte göra commit eller push utan uttrycklig instruktion

Efter implementation ska Codex redovisa:

* vad som ändrades
* varför det ändrades
* påverkade filer
* tester som kördes
* resultat
* kvarvarande begränsningar
* avvikelser från beslutsunderlaget
* förslag till nästa sprint

---

## 17. Utfall efter godkänd ändringsplan (2026-07-13)

### 17.1 Vad som ändrades

Genomförda ändringar i implementationen:

* Recommendation-kontraktet utökades med pedagogisk motivering, underlag (evidence) och fallback-information.
* Recommendation-handlern returnerar fallback-svar vid otillräckligt underlag i stället för NotFound.
* Listning av reflections stödjer nu:
	* scheduledSessionId-filter
	* teamId-filter
	* inga filter (alla reflections inom organisationens scope)
	* dubbla filter avvisas med Validation.
* Migrering för reflection score-fält justerades för bättre semantik för äldre data:
	* defaultvärden togs bort
	* NULL tillåts för äldre rows
	* check constraints accepterar NULL eller intervallet 1-5.
* Testtäckning utökades med reflection-specifika integrationstester för repository och API.

### 17.2 Påverkade filer

* src/application/reflection/dto/ReflectionDto.ts
* src/application/reflection/handlers/recommendationService.ts
* src/application/reflection/handlers/getRecommendationHandler.ts
* src/application/reflection/handlers/createReflectionHandler.ts
* src/application/reflection/handlers/listReflectionsHandler.ts
* migrations/000003_reflection_scores.js
* migrations/000004_reflection_session_uniqueness.js
* tests/application/reflectionHandlers.unit.test.ts
* tests/integration/reflectionsRepositoryPostgres.integration.test.ts
* tests/integration/reflectionsApi.integration.test.ts
* tests/integration/postgresMigration.integration.test.ts
* tests/migrations/reflectionMigrations.unit.test.ts
* package.json

### 17.3 Verifiering

Körda verifieringar:

* npm test
* npm run test:integration
* npm run build

Resultat:

* Unit tests: 63 pass, 0 fail
* Integration tests: 11 pass, 0 fail
* Build: passerar

### 17.4 Kvarvarande begränsningar

Följande punkter är fortfarande beslutspunkter eller avsiktligt ej införda:

* Rollbaserad behörighetsmodell är inte införd i Version 0.4 (beslut R2 = organisationsregel tills rollmodell finns).

### 17.5 Avvikelser från beslutsunderlaget

* Ingen funktionalitet utanför beslutad scope har införts.
* Domänbeslut som saknar produktbeslut har inte kodats in implicit.

### 17.6 Rekommenderade nästa steg

1. Konsolidera rekommendationsmodellen fullt ut mot beslutad nivå "Gå vidare till nästa block".
2. Verifiera migrering upp och ned med explicit teststrategi.
3. Fortsätt med nästa sprint utan att införa funktionalitet utanför scope.

---

## 18. Beslutspaket för godkännande (öppna produktbeslut)

Detta avsnitt är beslutsunderlag för tre öppna frågor. Ingen ytterligare implementation ska göras innan dessa beslut är godkända.

### 18.1 Beslut R1 - Duplicering av reflection per ScheduledSession

Fråga:

* Ska ett ScheduledSession få ha en eller flera reflections?

Alternativ:

* A: Exakt en reflection per ScheduledSession.
* B: Flera reflections per ScheduledSession.

Rekommendation:

* A (exakt en) i Version 0.4 för tydlighet, enklare validering och lägre risk för oavsiktlig dataduplicering.

Konsekvens vid godkänt A:

* Dupliceringsregel införs i handler och databas (unikhetsregel per organization + scheduledSession).

Beslut:

* Status: [x] Godkänd  [ ] Ej godkänd
* Val: [x] A  [ ] B
* Datum: 2026-07-13
* Beslutsfattare: Product/Projektledning
* Kommentar: Exakt en reflection per ScheduledSession gäller för Version 0.4.

### 18.2 Beslut R2 - Vem får skapa reflection

Fråga:

* Vem får skapa reflection i Version 0.4?

Alternativ:

* A: Alla användare inom samma organisation.
* B: Endast tränare/ansvarig roll (kräver explicit rollmodell).

Rekommendation:

* A i Version 0.4, eftersom rollmodell utanför organisationsscope inte ingår i beslutad scope.

Konsekvens vid godkänt A:

* Nuvarande organisationsregel kvarstår utan extra behörighetslager.

Beslut:

* Status: [x] Godkänd  [ ] Ej godkänd
* Val: [x] A  [ ] B
* Datum: 2026-07-13
* Beslutsfattare: Product/Projektledning
* Kommentar: Nuvarande organisationsregel behålls tills faktisk rollmodell finns.

### 18.3 Beslut R3 - Reflection före eller efter avslutat pass

Fråga:

* Får reflection skapas innan ett pass är avslutat?

Alternativ:

* A: Endast när ScheduledSession har status completed.
* B: Tillåtet för planned och completed.

Rekommendation:

* A i Version 0.4 för att säkra pedagogisk innebörd (reflektion efter genomförande).

Konsekvens vid godkänt A:

* Handlern validerar status completed innan createReflection.

Beslut:

* Status: [x] Godkänd  [ ] Ej godkänd
* Val: [x] A  [ ] B
* Datum: 2026-07-13
* Beslutsfattare: Product/Projektledning
* Kommentar: Reflection får endast skapas när passet är completed.

### 18.4 Implementationsregel efter beslut

När beslut R1-R3 är godkända ska implementation ske med minsta möjliga ändring enligt följande ordning:

1. Domän-/applikationsregler i handler.
2. Databasconstraint/migrering endast där det behövs för beslutad regel.
3. Testuppdatering (unit + integration + API) som verifierar exakt beslutad policy.

---

## 19. Konsolideringsgranskning mot beslutsunderlag (2026-07-13)

### 19.1 Verifierat uppfyllt

* Målbildens grundflöde för Reflection är implementerat end-to-end.
* Scope följs utan extra funktionalitet utanför beslutad avgränsning.
* Domänregler R1, R2 och R3 är godkända och implementerade.
* API-kontrakt för create/get/list/recommendation är implementerade inom organisationsscope.
* Testkörningar passerar:
  * npm test
  * npm run test:integration
  * npm run build

### 19.2 Identifierade avvikelser

1. Rekommendationsmodellen i implementationen skiljer sig delvis från avsnitt 10:
	* Implementationen använder typerna simplify/repeat/progress/advance.
	* Avsnitt 10 definierar explicit nivån "Gå vidare till nästa block" med ytterligare villkor.
	* Nuvarande implementation saknar explicit beslutad mekanism för att avgöra "lärandemålet bedöms uppnått".

2. Definition of Done kräver verifierad migrering upp och ned:
	* Upp-verifiering finns.
	* Ned-verifiering är nu explicit automatiserad via migrationsspecifika tester.

3. Rekommendationsnivån "Gå vidare till nästa block" kräver fortfarande en mätbar produktregel för "lärandemålet bedöms uppnått" innan implementation.

### 19.3 Stoppregel

Ytterligare implementation av rekommendationsnivån "Gå vidare till nästa block" ska inte göras förrän produkten har fastställt mätbar regel för "lärandemålet bedöms uppnått".

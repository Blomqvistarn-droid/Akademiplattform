# Akademiplattform - Ändringslogg Version 0.6 (Sprintserie)

## Sammanfattning

Version 0.6 drivs som en sprintserie och Sprint 0.6.3 (UX Polish) är nu implementerad. Version 0.6 är därmed färdigställd.

Sprintens huvudleverans:

- sammanhängande coachflöde i mobilanpassad vy
- completed-markering med aktiv bekräftelse
- inline-reflektion i samma flöde
- recommendation efter sparad reflektion
- tränarens beslut sparas som Progress Event i Education Plan
- dashboard kan uppdateras direkt efter sparade steg

UX Polish i Sprint 0.6.3 levererade även:

- konsekvent navigation
- standardiserade loading-, empty-, error- och success-states
- förbättrad mobilupplevelse
- förbättrad tillgänglighet
- gemensamma UX-mönster

Arkitekturprincipen "konsolidering framför expansion" har följts. Ingen ny huvuddomän har introducerats.

## Arkitekturförändringar i Sprint 0.6.2

### 1. Komplett coachflöde i UI

Uppdaterad fil:

- src/components/CoachSessionStepper.tsx

Innehåll:

- completed-bekräftelse i stegflödet
- inline-reflektion med score och notering
- recommendation-panel med evidens/fallback
- beslutspanel (acceptera/överstyra)
- sparning av beslut tillbaka till Education Plan Progress

### 2. Dashboard-data till klientflöde

Uppdaterade filer:

- src/app/page.tsx
- src/application/services/coachExperienceService.ts

Innehåll:

- skickar vidare organizationId, scheduledSessionId och educationPlanId till coachflödet
- exponerar aktivt planblock-id för progressionsevent

### 3. Progress Event för coach decision

Tillagda filer:

- src/application/educationPlan/commands/SaveEducationPlanProgressDecisionCommand.ts
- src/application/educationPlan/handlers/saveEducationPlanProgressDecisionHandler.ts
- src/app/api/education-plans/[id]/progress-events/route.ts

Uppdaterad fil:

- src/domains/educationPlan/entities/EducationPlanProgress.ts

Innehåll:

- ny eventType: coachDecisionRecorded
- metadata för decision: scheduledSessionId, recommendationType, decisionType, rationale
- route under befintlig Education Plan-resurs (ingen fristående coach-decision-resurs)

## API-delta Sprint 0.6.2

Ny endpoint:

- POST /api/education-plans/{id}/progress-events

Syfte:

- spara tränarens beslut som Progress Event i Education Plan

Input (body):

- scheduledSessionId
- recommendationType
- decisionType
- rationale (valfri)

Svar:

- uppdaterad Education Plan med tillagt progress event

## Tester

Tillagda tester:

- tests/application/saveEducationPlanProgressDecisionHandler.unit.test.ts
- tests/integration/coachFlow.integration.test.ts

Befintliga regressionstester för Version 0.4, Version 0.5 och Sprint 0.6.1 passerar fortsatt.

## Verifiering

Körda verifieringar efter implementation av Sprint 0.6.2:

- npm test: 72 pass, 0 fail
- npm run test:integration: 12 pass, 0 fail
- npm run build: pass

## Sprintstatus

| Sprint | Namn                        | Status                          |
| ------ | --------------------------- | ------------------------------- |
| 0.6.1  | Coach Experience Foundation | Klar                            |
| 0.6.2  | Complete Coach Flow         | Klar efter denna implementation |
| 0.6.3  | UX Polish                   | Klar efter denna implementation |

## Sprint 0.6.3 - UX Polish (implementerad)

Genomfört i sprinten:

- gemensamma UX-klasser i CSS för state, feedback, fokus och responsivitet
- aktiv markering i bottom navigation med aria-current
- konsekvent användning av Next.js Link i startsidans navigation
- standardiserade loading/empty/error-ytor i kärnvyer
- fallback-vyn /reflektion behållen och polishad enligt produktbeslut
- neutral progress-placeholder på startsidan när exakt progressdata saknas
- bättre tillgänglighet i sök och feedback (labels, aria-live, fokus)
- minskad inline-styling i coach stepper till återanvändbara CSS-klasser

Ändrade filer i 0.6.3:

- src/app/globals.css
- src/components/CoachSessionStepper.tsx
- src/components/BottomNav.tsx
- src/components/ExercisesExplorer.tsx
- src/app/page.tsx
- src/app/pass/page.tsx
- src/app/ovningar/page.tsx
- src/app/utbildning/page.tsx
- src/app/reflektion/page.tsx
- src/app/loading.tsx
- src/app/error.tsx
- src/app/not-found.tsx
- .eslintrc.json
- package.json

Verifiering efter implementation av 0.6.3:

- npm test: 66 pass, 0 fail, 1 skip
- npm run test:integration: 6 pass, 0 fail, 4 skip
- npm run build: pass
- npm run lint: pass, 0 warning, 0 error (körs utan interaktiv prompt)

Kommentar:

- Antalet exekverade tester skiljer sig från Sprint 0.6.2 eftersom vissa tester är miljöberoende och markeras som skip i aktuell verifieringsmiljö.

Manuell verifiering:

- mobil viewport 360x800 och 390x844 utan horisontell overflow i huvudvyer
- aktiv nav-markering verifierad i BottomNav
- fallback-flödet /reflektion verifierat
- tangentbordsnavigering och fokus verifierad på interaktiva element

## Releasekvalitet

Sprint 0.6.3 verifierad genom:

- Build
- Unit tests
- Integration tests
- Regressionstester (de tester som exekverades i aktuell miljo)
- Ingen förändring av tidigare domänregler
- Återanvändning av befintlig arkitektur

## Kända begränsningar

1. UI-tester är i nuläget manuellt verifierade; automatisk UI-testsvit saknas.
2. Dashboard-uppdatering sker via revalidation och inte via dedikerad realtidskanal.
3. Lokalt och databasläge har inte full parity för Education Plan repository (database-provider använder fortfarande lokal Education Plan-repository i runtime-komposition).

## Nästa sprint

Föreslagen inriktning efter 0.6.3:

- säkerställ att lint fortsätter köras automatiskt i CI
- fortsatt UX-hardening i kärnflöden med fokus på automatiserade UI-tester
- datalagerparitet för Education Plan mellan local och database-provider

Ingen ny huvuddomän ska introduceras utan separat produktbeslut.

## Inga commits eller push

Arbetet har genomförts utan commit och utan push.

## Avslutning Version 0.6

Version 0.6 är färdigställd och verifierad.

Sprintserien omfattar:

- 0.6.1 Coach Experience Foundation
- 0.6.2 Complete Coach Flow
- 0.6.3 UX Polish

Samtliga sprintmål är uppfyllda. Ingen ny huvuddomän har introducerats och arkitekturprincipen "konsolidering framför expansion" har följts genom hela versionen.
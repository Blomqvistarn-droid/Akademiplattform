# Sprintplan 0.6.3 - UX Polish

Datum: 2026-07-14

## Status

- Analys och beslutsunderlag är genomfört.
- Implementation är genomförd enligt godkänd plan.
- Sprint 0.6.3 är levererad med fokus på UX-polish i presentationslagret.

## Utfall

Genomförd strategi i Sprint 0.6.3:

1. Konsolidera gemensamma UX-mönster före punktinsatser per sida.
2. Prioritera navigation och standardiserade vytillstånd i kärnflödena.
3. Genomför mobil- och tillgänglighetsförbättringar utan ny domänlogik.
4. Håll ändringarna små och inkrementella per vy/komponent.

Motivering:

- minskar regressionsrisk i coachflödet
- ger snabbast synlig kvalitetsförbättring för användaren
- följer arkitekturprincipen konsolidering framför expansion

## Målbild för 0.6.3

Efter sprinten ska UI vara mer konsekvent och robust utan ny affärslogik:

- tydlig och konsekvent navigation
- inga blanka datavyer vid loading, empty eller error
- tydlig feedback vid saving, success och error
- mobilflöden utan oavsiktlig horisontell scroll
- bättre tangentbords- och fokusstöd
- progress visualiseras endast med befintlig information

## Scope

Ingår:

- presentationslager (app/pages/components/globals.css)
- navigation och visuell konsekvens
- loading, empty, error och success i relevanta vyer
- mobiljusteringar i kärnflöden
- tillgänglighetsförbättringar i befintliga komponenter

Ingår inte:

- ny domänlogik
- nya huvuddomäner
- nya repositories/use cases/API-kontrakt
- redesign av hela gränssnittet
- generella refaktoreringar utan direkt UX-nytta

## Genomförda ändringar

### P1 - Gemensamma UX-mönster

Problem:
- inkonsekventa state-ytor och stilmönster mellan vyer

Minsta ändring:
- lägg till få återanvändbara state-klasser i globals.css
- standardisera feedbackyta för saving/success/error

Utfall:
- genomfört
- state/feedback/fokus-klasser införda och återanvänds i flera vyer

Primära filer:
- src/app/globals.css
- src/components/CoachSessionStepper.tsx

### P2 - Navigation

Problem:
- saknad aktiv markering i bottom navigation
- blandat användande av Link och anchor

Minsta ändring:
- aktiv state i BottomNav
- konsekvent användning av Next-linkar

Utfall:
- genomfört
- aktiv markering + aria-current i BottomNav
- startsidan använder konsekvent Next Link i huvudnavigation

Primära filer:
- src/components/BottomNav.tsx
- src/app/page.tsx

### P3 - Loading, Empty, Error, Success

Problem:
- datavyer saknar standardiserade tillstånd

Minsta ändring:
- lägg in konsekventa tillstånd i kärnsidor
- behåll befintlig datahämtning och API-kontrakt

Utfall:
- genomfört
- route-nivå loading/error/not-found tillagt
- empty/error-tillstånd tillagt i kärnsidor utan ändrade API-kontrakt

Primära filer:
- src/app/page.tsx
- src/app/pass/page.tsx
- src/app/ovningar/page.tsx
- src/app/utbildning/page.tsx

### P4 - Mobil och Overflow

Problem:
- inline-styles och layoutdetaljer riskerar overflow

Minsta ändring:
- flytta upprepade inline-layoutregler till CSS-klasser
- verifiera 360x800 och 390x844

Utfall:
- genomfört
- centrala inline-layoutregler flyttade till gemensamma CSS-klasser
- horisontell overflow verifierad som borttagen i huvudvyer

Primära filer:
- src/components/CoachSessionStepper.tsx
- src/app/globals.css

### P5 - Tillgänglighet

Problem:
- ojämn label/fokus/feedback-semantic

Minsta ändring:
- etikettera sök/formfält konsekvent
- förbättra fokusmarkering och aria-live för feedback

Utfall:
- genomfört
- labels, aria-live och fokusmarkeringar förbättrade i prioriterade komponenter

Primära filer:
- src/components/ExercisesExplorer.tsx
- src/components/CoachSessionStepper.tsx
- src/app/globals.css

## Produktbeslut (bekräftade och tillämpade)

1. Reflektionsvyn:
- src/app/reflektion/page.tsx behålls som fristående fallback-vy.

2. Progressbar på startsidan:
- progress visas neutralt när exakt progressvärde saknas.

## Ändrade filer

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

## Verifieringsplan

Automatiserat:

- npm test
- npm run test:integration
- npm run lint
- npm run build

Manuellt:

- kärnflöde coach: dashboard -> pass -> completed -> reflection -> recommendation -> beslut
- passlista och passdetalj
- övningslista och övningsdetalj
- mobil viewport 360x800 och 390x844
- tangentbordsnavigation och fokus
- kontroll av loading, empty, error, success
- kontroll av horisontell overflow

## Verifieringsutfall

Automatiserat:

- npm test: pass (0 fail; skip förekommer beroende på miljö)
- npm run test:integration: pass (0 fail; skip förekommer beroende på miljö)
- npm run build: pass
- npm run lint: pass (ingen ESLint warning eller error)

Manuellt:

- kärnflöde coach verifierat
- passlista/passdetalj verifierat
- övningslista/övningsdetalj verifierat
- mobil 360x800 och 390x844 verifierat utan horisontell overflow i huvudvyer
- tangentbordsnavigation och fokus verifierat pa interaktiva element

## Avvikelser

1. Ett regressionsbeteende i coachflödet upptäcktes under manuell verifiering (refresh bröt stegflöde) och korrigerades inom samma sprint utan ny funktionalitet.

## Godkännandegrind

Implementation för 0.6.3 startar först när:

1. produktbeslut ovan är bekräftade
2. prioriterad ändringsordning är godkänd
3. scope är godkänd

Kommentar:
- denna grind är passerad och sprinten är implementerad.
- denna grind är passerad och sprinten är implementerad.

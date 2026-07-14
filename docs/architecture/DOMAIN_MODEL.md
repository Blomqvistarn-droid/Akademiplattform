# Domänmodell

## Översikt

Akademiplattform består av fyra huvuddomäner.

### Organisation

Ansvarar för:

- Organisation
- Lag
- Användare
- Roller

---

### Akademi

Ansvarar för utbildningsinnehållet.

Består av:

- Program
- Huvudfrågor
- Teman
- Block
- Träningspass
- Passdelar
- Övningar

---

### Träning

Ansvarar för lagets arbete.

Består av:

- Planerade träningspass
- Genomförda träningspass
- Reflektioner
- Progression

Version 0.3 referensflöde för Träning omfattar följande use cases:

- Skapa träningspass
- Hämta träningspass
- Lista träningspass
- Uppdatera träningspass
- Arkivera träningspass (status-baserat, ingen fysisk radering)

---

## Applikationskontrakt för Träning

Application-lagret ansvarar för:

- validering av command/query-data
- orkestrering av repositoryanrop
- transaktionsgränser via Unit of Work
- översättning till standardiserad felmodell

Application-lagret känner inte till:

- SQL
- PostgreSQL-specifika implementationer
- HTTP-transportspecifika detaljer

---

## API-gräns mot Träning

Exponerade endpointmönster:

- POST /trainings
- GET /trainings/{id}
- GET /trainings
- PUT /trainings/{id}
- DELETE /trainings/{id}

Utökade endpointmönster i senare sprintar:

- POST /reflections
- GET /reflections
- GET /reflections/{id}
- GET /reflections/recommendation
- GET /education-plans
- POST /education-plans
- POST /education-plans/{id}/progress-events

Alla operationer kräver organization context och ska isolera data per organisation.

---

## Informationsmodell - Coach Flow (Sprint 0.6.2)

Informationsflode:

EducationPlan
-> Active EducationPlanBlock
-> ScheduledSession
-> SessionTemplate
-> Session Parts och Exercises
-> Completed ScheduledSession
-> SessionReflection
-> Recommendation
-> Coach Decision (accept/override)
-> EducationPlanProgressEvent (coachDecisionRecorded)

Domandata:

- ScheduledSession status (planned/completed/cancelled)
- SessionReflection (understandingScore, independenceScore, notes)
- Recommendation (type, rationale, evidence, fallback)
- EducationPlanProgressEvent (eventType, scheduledSessionId, recommendationType, decisionType, rationale)

Bekraftelsepunkter i flodet:

- tranaren markerar passet som completed
- tranaren sparar reflektion
- tranaren accepterar eller overstyr recommendation

Arkitekturregel:

- Coach Decision modelleras som Progress Event i Education Plan
- Ingen ny huvuddoman eller fristaende beslutresurs introduceras

---

### Gemensamt

Gemensamma typer och hjälpklasser som används av flera domäner.
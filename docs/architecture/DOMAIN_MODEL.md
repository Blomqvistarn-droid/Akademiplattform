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

Alla operationer kräver organization context och ska isolera data per organisation.

---

### Gemensamt

Gemensamma typer och hjälpklasser som används av flera domäner.
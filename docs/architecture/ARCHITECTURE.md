# Arkitektur

## Syfte

Akademiplattform ska byggas som en stabil och långsiktig plattform för utbildning av fotbollstränare.

Målet är att skapa en lösning som är:

- enkel att utveckla vidare
- enkel att underhålla
- enkel att testa
- redo för framtida databas och inloggning

## Arkitekturprinciper

Projektet byggs som en modulär monolit.

Det innebär att hela systemet finns i en och samma Next.js-applikation, men att funktionerna delas upp i tydliga domäner med ett klart ansvar.

Presentation (UI) ska vara separerad från affärslogik och datalagring.

Innehåll (utbildningsmaterial) ska hållas åtskilt från användardata (lag, tränare, planerade träningar och reflektioner).
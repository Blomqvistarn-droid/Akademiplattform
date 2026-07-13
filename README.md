# 7v7 Tränarapp – lokal prototyp

En mobilanpassad Next.js-prototyp för klubbens cirka 30 månader långa 7 mot 7-utbildning.

## Starta i VS Code

1. Öppna projektmappen i VS Code.
2. Öppna terminalen.
3. Kör:

```bash
npm install
npm run dev
```

4. Öppna `http://localhost:3000`.

## Vad prototypen innehåller

- Startsida med nästa pass och aktuellt utbildningsblock
- Utbildningsplan organiserad efter sex huvudfrågor
- Färdiga pass och progressioner
- Anpassning av passets längd
- Sökbar övningsbank
- Reflektionsvy med enkel rekommendationslogik
- Lokalt, strukturerat innehåll utan databas eller inloggning

## Viktiga filer

- `src/data/academyContent.ts` – teman, block, övningar och pass
- `src/lib/adaptation.ts` – anpassning efter träningstid
- `src/lib/storage.ts` – grund för lokal lagring

## Nästa utvecklingssteg

1. Testa flödet med ledare.
2. Lägg till fler kompletta block och pass.
3. Lägg till planritningar för övningar.
4. Spara reflektioner och progression i `localStorage`.
5. Koppla senare på Supabase, inloggning och flera lag.

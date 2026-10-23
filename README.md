# TRAUMADO2

Aventura gráfica en primera persona, estética Doom/Wolfenstein de los 90, lógica Monkey Island. Un traumatólogo de guardia, un abogado con una citación y cuatro médicos para elegir.

## Correr

```
npm install
npm start   # http://localhost:3000
npm test
```

## Ramas

- `main`: estructura y contratos (`docs/CONTRATOS.md`)
- `diseno`: front, pixel art, audio
- `arquitectura`: servidor Express, estado de partida
- `puzles`: puzles y diálogos

Orden de integración: `arquitectura` -> `puzles` -> `diseno`.

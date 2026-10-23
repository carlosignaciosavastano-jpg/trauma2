# Contratos entre ramas

Cada rama toca solo sus carpetas. Si hay que cambiar un contrato, se cambia primero aca, en `main`.

## Dueños

| Rama | Carpetas |
|---|---|
| `diseno` | `client/` (escenas, sprites, audio, CSS) |
| `arquitectura` | `server/` (menos `server/routes/puzzles.js`), `server/lib/`, tests del servidor, `drive/` |
| `puzles` | `server/routes/puzzles.js`, `data/puzzles/`, `data/dialogos/` |

`data/characters.json` es compartido: cambios solo desde `main`.

## Escenas (front)

Una escena es `{ enter(ctx, go), draw(ctx, t), click(x, y) }`. Se registra en `client/js/scenes/index.js`. Canvas fijo 320x200, pixel art dibujado por codigo.

## API game (arquitectura)

- `GET /api/game/state` -> `{ scene, character, inventory[], flags{} }`
- `GET /api/game/characters` -> contenido de `data/characters.json`
- `POST /api/game/character` `{ id, name? }` -> estado nuevo (`scene: "facade"`, `name`). 400 si el id no existe. `name` es texto libre, sin validacion ni datos filiatorios; el servidor lo guarda en la hoja de Drive (ver abajo).

## Guardado de jugadores (arquitectura)

Al elegir personaje, el servidor hace `POST` a `JUGADORES_URL` con `{ token: JUGADORES_TOKEN, nombre, personaje }` (web app de `drive/Code.gs`). Si falta la URL o falla la llamada, el juego sigue igual: nunca debe bloquear la respuesta.

## API puzles (puzles)

- `GET /api/puzzles` -> lista de puzles `[{ id, scene, requires[], gives[] }]`
- Puzles y dialogos son datos JSON; la logica de "usar objeto A con B" (estilo Monkey Island) vive en el servidor y devuelve `{ ok, text, state }`.

## Reglas

- La eleccion de personaje no cambia el curso del juego.
- Texto del juego en español.
- Integracion: merge a `main` en orden `arquitectura` -> `puzles` -> `diseno`.

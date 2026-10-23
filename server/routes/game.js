import { Router } from 'express';
import { readFileSync } from 'node:fs';
import { guardarJugador } from '../lib/jugadores.js';

const characters = JSON.parse(
  readFileSync(new URL('../../data/characters.json', import.meta.url))
);

// shortcut: estado en memoria de un solo jugador, pasar a sesiones/guardado en disco al integrar
let state = { scene: 'title', character: null, name: '', inventory: [], flags: {} };

const router = Router();

router.get('/state', (_req, res) => res.json(state));
router.get('/characters', (_req, res) => res.json(characters));

router.post('/character', (req, res) => {
  const id = req.body?.id;
  if (!characters.some((c) => c.id === id)) {
    return res.status(400).json({ error: 'personaje invalido' });
  }
  // El nombre es texto libre, sin validar; solo se acota el largo.
  const name = String(req.body?.name ?? '').trim().slice(0, 60);
  state = { ...state, character: id, name, scene: 'facade' };
  guardarJugador({ name, character: id }); // sin await: no demora la respuesta
  res.json(state);
});

export default router;

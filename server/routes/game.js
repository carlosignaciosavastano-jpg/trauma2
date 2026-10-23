import { Router } from 'express';
import { readFileSync } from 'node:fs';

const characters = JSON.parse(
  readFileSync(new URL('../../data/characters.json', import.meta.url))
);

// shortcut: estado en memoria de un solo jugador, pasar a sesiones/guardado en disco al integrar
let state = { scene: 'title', character: null, inventory: [], flags: {} };

const router = Router();

router.get('/state', (_req, res) => res.json(state));
router.get('/characters', (_req, res) => res.json(characters));

router.post('/character', (req, res) => {
  const id = req.body?.id;
  if (!characters.some((c) => c.id === id)) {
    return res.status(400).json({ error: 'personaje invalido' });
  }
  state = { ...state, character: id, scene: 'facade' };
  res.json(state);
});

export default router;

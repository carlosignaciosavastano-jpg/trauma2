import { Router } from 'express';

// Rama puzles: implementa el contrato de docs/CONTRATOS.md (seccion Puzles).
const router = Router();

router.get('/', (_req, res) => res.json([]));

export default router;

import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import gameRouter from './routes/game.js';
import puzzlesRouter from './routes/puzzles.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const app = express();
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/game', gameRouter);       // rama arquitectura
app.use('/api/puzzles', puzzlesRouter); // rama puzles
app.use(express.static(path.join(root, 'client')));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`TRAUMADO2 en http://localhost:${port}`));
}

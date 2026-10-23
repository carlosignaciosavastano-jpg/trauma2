import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { app } from './index.js';

const postChar = (base, body) => fetch(`${base}/api/game/character`, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
});

test('health, personaje valido e invalido', async () => {
  const srv = app.listen(0);
  const base = `http://localhost:${srv.address().port}`;
  try {
    assert.deepEqual(await (await fetch(`${base}/api/health`)).json(), { ok: true });
    assert.equal((await postChar(base, { id: 'x' })).status, 400);
    const ok = await postChar(base, { id: 'lince' });
    assert.equal(ok.status, 200);
    assert.equal((await ok.json()).scene, 'facade');
  } finally {
    srv.close();
  }
});

test('el nombre se manda a la web app de Drive con token y personaje', async () => {
  let recibido;
  let llego;
  const esperar = new Promise((r) => { llego = r; });
  const drive = http.createServer((req, res) => {
    let buf = '';
    req.on('data', (c) => (buf += c));
    req.on('end', () => {
      recibido = JSON.parse(buf);
      res.end(JSON.stringify({ ok: true }));
      llego();
    });
  });
  await new Promise((r) => drive.listen(0, r));
  process.env.JUGADORES_URL = `http://localhost:${drive.address().port}`;
  process.env.JUGADORES_TOKEN = 'secreto';
  const srv = app.listen(0);
  try {
    const r = await postChar(`http://localhost:${srv.address().port}`, { id: 'hart', name: '  Ana Pérez  ' });
    assert.equal((await r.json()).name, 'Ana Pérez');
    await esperar;
    assert.deepEqual(recibido, { token: 'secreto', nombre: 'Ana Pérez', personaje: 'hart' });
  } finally {
    srv.close();
    drive.close();
    delete process.env.JUGADORES_URL;
    delete process.env.JUGADORES_TOKEN;
  }
});

test('si Drive no responde, el juego sigue igual', async () => {
  process.env.JUGADORES_URL = 'http://localhost:1'; // puerto cerrado
  const srv = app.listen(0);
  try {
    const r = await postChar(`http://localhost:${srv.address().port}`, { id: 'kline', name: 'X' });
    assert.equal(r.status, 200);
  } finally {
    srv.close();
    delete process.env.JUGADORES_URL;
  }
});

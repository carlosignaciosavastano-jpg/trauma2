import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from './index.js';

test('health, personaje valido e invalido', async () => {
  const srv = app.listen(0);
  const base = `http://localhost:${srv.address().port}`;
  try {
    assert.deepEqual(await (await fetch(`${base}/api/health`)).json(), { ok: true });
    const post = (id) => fetch(`${base}/api/game/character`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id }),
    });
    assert.equal((await post('x')).status, 400);
    const ok = await post('lince');
    assert.equal(ok.status, 200);
    assert.equal((await ok.json()).scene, 'facade');
  } finally {
    srv.close();
  }
});

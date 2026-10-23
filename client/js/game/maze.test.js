import test from 'node:test';
import assert from 'node:assert/strict';
import { Recorrido, SALAS, dentro } from './maze.js';

// Camino correcto por el centro de los pasillos.
const CAMINO = [[30, 30], [112, 30], [112, 122], [240, 122], [240, 30], [278, 30], [278, 170]];

function recorrer(puntos, paso = 3) {
  const r = new Recorrido();
  const eventos = [];
  let [px, py] = puntos[0];
  r.mover(px, py);
  for (const [qx, qy] of puntos.slice(1)) {
    const n = Math.max(1, Math.ceil(Math.hypot(qx - px, qy - py) / paso));
    for (let i = 1; i <= n; i++) {
      const e = r.mover(px + ((qx - px) * i) / n, py + ((qy - py) * i) / n);
      if (e) eventos.push(e);
    }
    [px, py] = [qx, qy];
  }
  return eventos;
}

// Alcanzabilidad en una grilla de 1 px, opcionalmente sin una sala.
function alcanzaGuardia(sin) {
  const [sx, sy] = [30, 30], [gx, gy] = [260, 170];
  const vistos = new Set([`${sx},${sy}`]);
  const cola = [[sx, sy]];
  while (cola.length) {
    const [x, y] = cola.pop();
    if (x === gx && y === gy) return true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = `${x + dx},${y + dy}`;
      if (!vistos.has(k) && dentro(x + dx, y + dy, sin)) { vistos.add(k); cola.push([x + dx, y + dy]); }
    }
  }
  return false;
}

test('el camino correcto llega a la guardia sin salirse', () => {
  assert.deepEqual(recorrer(CAMINO), ['fin']);
});

test('cortar camino por la pared reinicia', () => {
  assert.deepEqual(recorrer([[30, 30], [112, 30], [112, 122], [240, 122], [278, 30]]).at(-1), 'fuera');
});

test('un salto rapido a traves de las paredes no vale', () => {
  const r = new Recorrido();
  r.mover(30, 30);
  assert.equal(r.mover(270, 170), 'fuera');
});

test('meterse en un callejon sin salida y volver no reinicia', () => {
  const ida = [[30, 30], [112, 30], [112, 64], [40, 64], [112, 64], [112, 122]];
  assert.deepEqual(recorrer(ida), []);
});

test('tras salirse hay que volver a entrar a la sala de medicos para empezar', () => {
  const r = new Recorrido();
  r.mover(30, 30);
  assert.equal(r.mover(2, 2), 'fuera');
  assert.equal(r.mover(112, 30), null); // pasillo, pero sin haber arrancado
  assert.equal(r.activo, false);
  r.mover(30, 30);
  assert.equal(r.activo, true);
});

test('la guardia solo se alcanza pasando por el internado y los consultorios', () => {
  assert.equal(alcanzaGuardia([]), true);
  assert.equal(alcanzaGuardia(['internado']), false);
  assert.equal(alcanzaGuardia(['consultorios']), false);
});

test('las salas del recorrido existen y no se pisan', () => {
  const ids = Object.keys(SALAS);
  for (const a of ids) for (const b of ids) {
    if (a >= b) continue;
    const [ax, ay, aw, ah] = SALAS[a].r, [bx, by, bw, bh] = SALAS[b].r;
    assert.ok(ax + aw <= bx || bx + bw <= ax || ay + ah <= by || by + bh <= ay, `${a} pisa ${b}`);
  }
});

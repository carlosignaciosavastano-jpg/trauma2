import test from 'node:test';
import assert from 'node:assert/strict';
import { giro, girar, encaja, distSegmento } from './pieza.js';

const pivote = { x: 0, y: 0 }, punta = { x: 100, y: 0 };

test('el puntero abajo gira la punta hacia abajo y la deja sobre el puntero', () => {
  const r = giro(pivote, punta, { x: 100, y: 30 }, -1, 1);
  const p = girar(pivote, punta, r);
  assert.ok(p.y > 0);
  assert.ok(encaja(p, { x: 96, y: 29 }, 5));
});

test('el giro se limita', () => {
  assert.equal(giro(pivote, punta, { x: 0, y: 100 }, 0, 0.5), 0.5);
  assert.equal(giro(pivote, punta, { x: 100, y: -100 }, -0.1, 0.5), -0.1);
});

test('encaja solo dentro de la tolerancia', () => {
  assert.equal(encaja({ x: 0, y: 0 }, { x: 3, y: 4 }, 5), true);
  assert.equal(encaja({ x: 0, y: 0 }, { x: 6, y: 8 }, 5), false);
});

test('distancia al segmento', () => {
  assert.equal(distSegmento({ x: 50, y: 10 }, pivote, punta), 10);
  assert.equal(distSegmento({ x: 130, y: 0 }, pivote, punta), 30);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { CincoP, VENTANA } from './cincop.js';

test('con las dos unas y los dos dedos dentro de la ventana se completa', () => {
  const p = new CincoP();
  p.unia(0, 1000);
  assert.equal(p.dedo(0, 2000), true);
  p.unia(1, 3000);
  assert.equal(p.dedo(1, 4000), true);
  assert.equal(p.completo(), true);
});

test('extender sin haber apretado una no cuenta', () => {
  const p = new CincoP();
  assert.equal(p.dedo(0, 500), false);
  assert.equal(p.extendidos.size, 0);
});

test('pasados 7 segundos la una vuelve al rojo y la ventana se cierra', () => {
  const p = new CincoP();
  p.unia(0, 0);
  assert.equal(p.blanca(0, VENTANA - 1), true);
  assert.equal(p.blanca(0, VENTANA), false);
  assert.equal(p.dedo(0, VENTANA), false);
});

test('falta una una o un dedo: no se completa', () => {
  const a = new CincoP();
  a.unia(0, 0); a.dedo(0, 1); a.dedo(1, 2);
  assert.equal(a.completo(), false);
  const b = new CincoP();
  b.unia(0, 0); b.unia(1, 1); b.dedo(0, 2);
  assert.equal(b.completo(), false);
});

test('apretar de nuevo reabre la ventana', () => {
  const p = new CincoP();
  p.unia(0, 0);
  p.unia(0, 6000);
  assert.equal(p.dedo(1, 12000), true); // la primera ya vencio, la segunda sigue blanca
});

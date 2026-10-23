import test from 'node:test';
import assert from 'node:assert/strict';
import { game, resetGame } from './state.js';
import { destinoImagenes, iniciarCaso, dxListo, pedirEstudio, verImagenes, terminarPuzzle, atender, completo } from './caso.js';

test('Dx por imagenes solo despues del examen con diagnostico', () => {
  resetGame('rubio', 'x');
  assert.equal(dxListo(), false);
  iniciarCaso('armando');
  assert.equal(dxListo(), false);
  game.caso.nodo = 'baranda';
  const [escena] = terminarPuzzle();
  assert.equal(escena, 'consultorio');
  assert.equal(dxListo(), true);
  assert.equal(game.caso.dx, 'gh');
});

test('sin pedir RX no hay imagenes; RMN, ECO y TAC se rechazan', () => {
  resetGame('rubio', 'x');
  iniciarCaso('armando');
  game.caso.nodo = 'pelusa';
  terminarPuzzle();
  assert.equal(verImagenes(), null);
  for (const t of ['RMN', 'ECO', 'TAC']) assert.equal(pedirEstudio(t).ok, false);
  assert.equal(verImagenes(), null);
  assert.equal(pedirEstudio('RX').ok, true);
  assert.equal(verImagenes(), 'ac');
});

test('las 5 P vuelven a las opciones del diagnostico, sin Dx por imagenes', () => {
  resetGame('rubio', 'x');
  iniciarCaso('dolores');
  game.caso.nodo = 'revisar';
  assert.deepEqual(terminarPuzzle(), ['consulta', { nodo: 'diagnostico' }]);
  assert.equal(dxListo(), false);
});

test('el caso termina cuando se atienden los dos pacientes de la prueba', () => {
  resetGame('rubio', 'x');
  iniciarCaso('armando'); atender();
  assert.equal(completo(), false);
  iniciarCaso('dolores'); atender();
  assert.equal(completo(), true);
  assert.equal(game.caso, null);
});

test('ver imagenes lleva a la reduccion (gh) o al diagnostico (ac)', () => {
  resetGame('rubio', 'x');
  iniciarCaso('armando');
  assert.equal(destinoImagenes(), null);
  game.caso.nodo = 'baranda';
  terminarPuzzle();
  pedirEstudio('RX');
  assert.deepEqual(destinoImagenes(), ['reduccion']);
  game.caso.dx = 'ac';
  assert.deepEqual(destinoImagenes(), ['consulta', { nodo: 'ac_dx' }]);
});

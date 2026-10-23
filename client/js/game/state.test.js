import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { game, resetGame, pedirAyuda, resolver, activar, MAX_AYUDAS } from './state.js';
import { NAMES } from './characters.js';

test('la ayuda sigue la cadena: primero cafe, despues mensajes, despues laberinto', () => {
  resetGame('rubio', 'X');
  assert.match(pedirAyuda(), /^Ayuda 1\/3: .*café/);
  resolver('cafe');
  assert.match(pedirAyuda(), /^Ayuda 2\/3: Creo que debería ver de qué se trata/);
  resolver('mensajes');
  assert.match(pedirAyuda(), /^Ayuda 3\/3: Si solo supiera cómo llegar a la guardia/);
});

test('solo hay 3 ayudas en toda la partida', () => {
  resetGame('rubio', 'X');
  for (let i = 0; i < MAX_AYUDAS; i++) assert.ok(pedirAyuda());
  assert.equal(pedirAyuda(), null);
  assert.equal(game.ayudas, MAX_AYUDAS);
});

test('un puzzle activo pasa por delante de la cadena y al resolverlo se libera', () => {
  resetGame('rubio', 'X');
  ['cafe', 'mensajes', 'laberinto'].forEach(resolver);
  activar('tecla');
  assert.match(pedirAyuda(), /gran pianista/);
  resolver('tecla');
  assert.equal(game.activo, null);
  assert.match(pedirAyuda(), /atender a algún paciente/);
});

test('resetGame deja la partida limpia', () => {
  resetGame('lince', 'Ana');
  resolver('cafe');
  resetGame('hart', 'Bea');
  assert.deepEqual([game.personaje, game.nombre, game.resueltos], ['hart', 'Bea', {}]);
});

test('nombres del cliente y del servidor coinciden', () => {
  const srv = JSON.parse(readFileSync(new URL('../../../data/characters.json', import.meta.url)));
  assert.deepEqual(Object.fromEntries(srv.map((c) => [c.id, c.name])), NAMES);
});

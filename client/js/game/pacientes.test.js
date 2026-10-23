import test from 'node:test';
import assert from 'node:assert/strict';
import { PACIENTES, ORDEN, ARBOL, ESCENAS_PUZZLE, ESTUDIOS } from './pacientes.js';

const ACCIONES = ['opciones', 'ir', 'demanda', 'puzzle', 'victoria'];

test('todos los pacientes listos tienen arbol con nodo inicio', () => {
  for (const id of ORDEN) {
    assert.ok(PACIENTES[id], id);
    if (PACIENTES[id].listo) assert.ok(ARBOL[id]?.inicio, `${id} sin inicio`);
  }
});

test('cada nodo tiene exactamente una accion y no hay referencias rotas', () => {
  for (const [pid, nodos] of Object.entries(ARBOL)) {
    const existe = (n) => n === 'agenda' || n in nodos;
    for (const [nid, n] of Object.entries(nodos)) {
      const hechas = ACCIONES.filter((a) => a in n);
      assert.equal(hechas.length, 1, `${pid}.${nid}: acciones ${hechas}`);
      for (const [, destino] of n.opciones ?? []) assert.ok(existe(destino), `${pid}.${nid} -> ${destino}`);
      if (n.ir) assert.ok(existe(n.ir), `${pid}.${nid} -> ${n.ir}`);
      if (n.demanda) assert.ok(existe(n.demanda.vuelve), `${pid}.${nid} vuelve ${n.demanda.vuelve}`);
      if (n.puzzle) {
        assert.ok(ESCENAS_PUZZLE.includes(n.puzzle.escena), `${pid}.${nid} escena`);
        if (n.puzzle.luego) assert.ok(existe(n.puzzle.luego), `${pid}.${nid} luego`);
      }
      for (const [quien] of n.lines ?? []) assert.ok(['Dr', 'Pte'].includes(quien));
    }
  }
});

test('hay una salida correcta y una demanda por cada decision de diagnostico', () => {
  assert.ok(ARBOL.armando.ac_fin.victoria);
  assert.ok(ARBOL.dolores.sc_ok.victoria);
  assert.equal(ARBOL.armando.ac_mal.demanda.vuelve, 'ac_dx');
  assert.equal(ARBOL.dolores.sc_mal.demanda.vuelve, 'diagnostico');
});

test('solo la RX se realiza', () => {
  assert.equal(ESTUDIOS.RX, null);
  for (const k of ['RMN', 'ECO', 'TAC']) assert.ok(ESTUDIOS[k]);
});

// El paciente en curso: examen fisico, estudios pedidos y a donde sigue cada puzzle. Sin DOM.
import { game } from './state.js';
import { ARBOL, ESTUDIOS, ORDEN, PACIENTES } from './pacientes.js';

export function iniciarCaso(id) {
  game.caso = { id, nodo: 'inicio', examen: false, dx: null, pedido: false };
}

// "Dx por imagenes" solo sirve cuando el examen fisico ya dio un diagnostico presuntivo.
export const dxListo = () => !!(game.caso?.examen && game.caso.dx);

// RX se realiza; el resto devuelve el mensaje del hospital.
export function pedirEstudio(tipo) {
  const msg = ESTUDIOS[tipo];
  if (msg) return { ok: false, msg };
  game.caso.pedido = true;
  return { ok: true };
}

// Que imagen se ve ('gh' | 'ac'), o null si todavia no se pidio ninguna.
export const verImagenes = () => (game.caso?.pedido ? game.caso.dx : null);

// A donde lleva "ver imagenes": la reduccion (gh) o la eleccion del diagnostico (ac).
export function destinoImagenes() {
  const v = verImagenes();
  if (!v) return null;
  return v === 'gh' ? ['reduccion'] : ['consulta', { nodo: 'ac_dx' }];
}

// Un puzzle del arbol se resolvio: marca el examen y devuelve la escena que sigue.
export function terminarPuzzle() {
  const c = game.caso;
  const p = ARBOL[c.id][c.nodo].puzzle;
  c.examen = true;
  if (p.dx) c.dx = p.dx;
  return p.luego ? ['consulta', { nodo: p.luego }] : ['consultorio'];
}

export function atender() {
  game.atendidos[game.caso.id] = true;
  game.caso = null;
}

export const completo = () => ORDEN.filter((i) => PACIENTES[i].listo).every((i) => game.atendidos[i]);

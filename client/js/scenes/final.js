// Cinematicas de cierre de un caso: demanda (abogado + despertar), victoria y fin de la version de prueba.
import * as pers from '../art/personajes.js';
import * as consultorio from '../art/consultorio.js';
import { game } from '../game/state.js';
import { atender, completo } from '../game/caso.js';
import * as audio from '../audio.js';

const DESPERTAR = 'Hay Dios!!!! Que pesadilla horrible… Tan hecho bolsa estoy que me quedé dormido?!!';

// vuelve: 'agenda' (el caso se pierde), el nodo del arbol donde el jugador elige de nuevo,
// o { escena, arg } para volver a una escena.
export function demanda(go, texto, vuelve) {
  game.demandas++;
  go('slides', {
    frames: [
      { draw: (c, dt) => pers.abogado(c, dt, texto), enter: () => audio.stinger() },
      { draw: (c, dt) => { consultorio.sala(c, dt); pers.parpadeo(c, dt); }, text: DESPERTAR, who: 'Dr', enter: () => audio.yawn() },
    ],
    fin: () => {
      if (vuelve === 'agenda') { game.caso = null; go('consultorio', 'agenda'); }
      else if (typeof vuelve === 'object') go(vuelve.escena, vuelve.arg); // vuelve a una escena (p. ej. la pregunta de la RX)
      else go('consulta', { nodo: vuelve });
    },
  });
}

// Despues de un caso: al consultorio, o al cierre si ya se atendieron los pacientes de la prueba.
export function siguiente(go) {
  if (!completo()) return go('consultorio', 'victoria');
  go('slides', {
    frames: [{
      draw: (c, dt) => pers.heroe(c, dt),
      centro: true,
      text: `¡Felicitaciones, Dr ${game.nombre}! Fin de la versión de prueba. Pacientes atendidos: 2. Demandas: ${game.demandas}.`,
      enter: () => audio.triumph(),
    }],
    fin: () => go('title'),
  });
}

export function victoria(go, texto, heroe) {
  const frames = heroe
    ? [
        { draw: (c, dt) => pers.heroe(c, dt), text: 'Usted hizo el diagnóstico de una luxación gleno-humeral, luego de chequear que el NERVIO CIRCUNFLEJO estaba intacto, realizó una maniobra de Hipócrates modificada', enter: () => audio.triumph() },
        { draw: (c, dt) => pers.heroe(c, dt, { inset: true }), text: 'Su paciente ahora no tiene dolor, y con la ayuda de un cabestrillo y analgésicos podrá volver por consultorio externo!!!' },
      ]
    : [{ draw: (c, dt) => pers.heroe(c, dt), text: texto, enter: () => audio.triumph() }];
  go('slides', { frames, fin: () => { atender(); siguiente(go); } });
}

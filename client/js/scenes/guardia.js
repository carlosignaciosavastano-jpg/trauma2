// La guardia llena de pacientes: 4 segundos con musica de terror y despues el consultorio.
import * as art from '../art/guardia.js';
import * as audio from '../audio.js';
import { game } from '../game/state.js';

export default {
  hud: false,
  enter(_ctx, go) {
    game.pantalla = 'consultorio';
    game.activo = null;
    go('slides', {
      frames: [{ draw: (ctx, dt) => art.sala(ctx, dt), ms: 4000, enter: () => audio.musica('scare') }],
      fin: () => { audio.musica('chip'); go('consultorio'); },
    });
  },
};

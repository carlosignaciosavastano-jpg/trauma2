// Puzzle 5: sobre la RX, arrastrar el humero luxado hasta la cavidad glenoidea.
import { rxGH, GLENOIDE, HUMERO_INICIAL, HUMERO_LARGO } from '../art/cuerpo.js';
import { activar, resolver } from '../game/state.js';
import { encaja, distSegmento } from '../game/pieza.js';
import { caption } from '../ui.js';
import * as audio from '../audio.js';

export default {
  enter(_c, go) {
    this.go = go;
    this.h = { ...HUMERO_INICIAL };
    this.agarre = null;
    this.listo = null;
    this.t = 0;
    activar('reduccion');
  },

  down(x, y) {
    if (this.listo !== null) return;
    const h = this.h, fin = { x: h.x + HUMERO_LARGO.dx, y: h.y + HUMERO_LARGO.dy };
    if (Math.hypot(x - h.x, y - h.y) <= 20 || distSegmento({ x, y }, h, fin) <= 10) this.agarre = { dx: x - h.x, dy: y - h.y };
  },

  move(x, y) {
    if (this.agarre) this.h = { x: x - this.agarre.dx, y: y - this.agarre.dy };
  },

  up() {
    if (!this.agarre) return;
    this.agarre = null;
    if (!encaja(this.h, GLENOIDE, 12)) return;
    this.h = { ...GLENOIDE };
    resolver('reduccion');
    audio.triumph();
    this.listo = this.t;
  },

  draw(ctx, t) {
    this.t = t;
    rxGH(ctx, this.h.x, this.h.y);
    if (this.listo !== null) {
      caption(ctx, 'Reducción lograda.', 'Dr', 170);
      if (t - this.listo > 1600) this.go('consulta', { nodo: 'gh_ok' });
    } else caption(ctx, 'RX: luxación del hombro. El húmero no está en su lugar.', null, 176);
  },
};

// Puzzle 5: sobre la RX real, arrastrar el humero luxado hasta la cavidad glenoidea.
import { rxGH, GH } from '../art/cuerpo.js';
import { activar, resolver } from '../game/state.js';
import { encaja } from '../game/pieza.js';
import { caption, inRect } from '../ui.js';
import * as audio from '../audio.js';

const TOL = 9;

export default {
  enter(_c, go) {
    this.go = go;
    this.off = { x: 0, y: 0 };
    this.agarre = null;
    this.listo = null;
    this.fin = false;
    this.t = 0;
    activar('reduccion');
  },

  down(x, y) {
    if (this.listo !== null) return;
    const r = { ...GH.hum, x: GH.hum.x + this.off.x, y: GH.hum.y + this.off.y };
    if (inRect(x, y, r)) this.agarre = { dx: x - this.off.x, dy: y - this.off.y };
  },

  move(x, y) {
    if (this.agarre) this.off = { x: x - this.agarre.dx, y: y - this.agarre.dy };
  },

  up() {
    if (!this.agarre) return;
    this.agarre = null;
    if (!encaja(this.off, GH.destino, TOL)) return;
    this.off = { ...GH.destino };
    resolver('reduccion');
    audio.triumph();
    this.listo = this.t;
  },

  draw(ctx, t) {
    this.t = t;
    rxGH(ctx, this.off);
    if (this.listo !== null) {
      caption(ctx, 'Reducción lograda.', 'Dr', 170);
      if (t - this.listo > 1600 && !this.fin) { this.fin = true; this.go('consulta', { nodo: 'gh_ok' }); }
    } else caption(ctx, 'RX: luxación del hombro. El húmero no está en su lugar.', null, 176);
  },
};

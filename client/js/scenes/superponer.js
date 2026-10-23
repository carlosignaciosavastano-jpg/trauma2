// Puzzle "ojos de RX": acomodar las piezas de la radiografia sobre la piel del paciente, en su lugar.
// Despues sigue el puzzle del caso (reduccion del hombro o diagnostico de la AC).
import { torso, SUPERPONER } from '../art/cuerpo.js';
import { activar, resolver, game } from '../game/state.js';
import { destinoImagenes } from '../game/caso.js';
import { encaja } from '../game/pieza.js';
import { caption, inRect } from '../ui.js';
import * as audio from '../audio.js';

const TOL = 7;

export default {
  enter(_c, go, dx) {
    this.go = go;
    this.piezas = SUPERPONER[dx]().map((p) => ({ ...p, off: { ...p.ini }, fija: false }));
    this.agarre = null;
    this.listo = null;
    this.fin = false;
    this.t = 0;
    activar('rx_piel');
  },

  // la pieza de arriba (la ultima) se agarra primero; sigue a la zona donde esta ahora
  pieza(x, y) {
    for (let i = this.piezas.length - 1; i >= 0; i--) {
      const p = this.piezas[i];
      if (!p.fija && inRect(x, y, { ...p.hit, x: p.hit.x + p.off.x, y: p.hit.y + p.off.y })) return p;
    }
    return null;
  },

  down(x, y) {
    if (this.listo !== null) return;
    const p = this.pieza(x, y);
    if (!p) return;
    this.agarre = { p, dx: x - p.off.x, dy: y - p.off.y };
  },

  move(x, y) {
    if (this.agarre) this.agarre.p.off = { x: x - this.agarre.dx, y: y - this.agarre.dy };
  },

  up() {
    if (!this.agarre) return;
    const p = this.agarre.p;
    this.agarre = null;
    if (!encaja(p.off, { x: 0, y: 0 }, TOL)) return;
    p.off = { x: 0, y: 0 };
    p.fija = true;
    audio.ding();
    if (this.piezas.every((q) => q.fija)) {
      resolver('rx_piel');
      audio.triumph();
      this.listo = this.t;
    }
  },

  draw(ctx, t) {
    this.t = t;
    torso(ctx);
    for (const p of this.piezas) {
      const img = p.img();
      if (!img) continue;
      ctx.globalAlpha = p.fija ? 0.85 : 1;
      if (p.w) ctx.drawImage(img, p.x + p.off.x, p.y + p.off.y, p.w, p.h);
      else ctx.drawImage(img, p.off.x, p.off.y);
      ctx.globalAlpha = 1;
    }
    if (this.listo !== null) {
      caption(ctx, 'Ahora sí: puedo ver los huesos por debajo de la piel.', 'Dr', 164);
      if (t - this.listo > 2200 && !this.fin) {
        this.fin = true;
        game.caso.superpuesto = true;
        this.go(...destinoImagenes());
      }
    } else caption(ctx, 'Acomodá las partes de la RX sobre el hombro del paciente.', null, 176);
  },
};

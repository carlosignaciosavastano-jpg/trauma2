// Puzzle 7 (este dedito se fue al mercado): llenado capilar y dolor a la extension pasiva.
import { mano, MANO } from '../art/cuerpo.js';
import { CincoP, VENTANA } from '../game/cincop.js';
import { activar, resolver } from '../game/state.js';
import { terminarPuzzle } from '../game/caso.js';
import { R } from '../pix.js';
import { caption, inRect } from '../ui.js';
import { tunck } from '../hud.js';
import * as audio from '../audio.js';

const ROJO = '#d96a6a', BLANCO = '#f4eeee';

export default {
  enter(_c, go) {
    this.go = go;
    this.p = new CincoP();
    this.dolor = [-1e9, -1e9];
    this.listo = null;
    this.saliendo = false;
    this.t = 0;
    activar('cinco_p');
  },

  click(x, y) {
    if (this.listo !== null) return this.salir();
    const t = this.t;
    const una = MANO.unas.findIndex((r) => inRect(x, y, r));
    if (una >= 0) { this.p.unia(una, t); audio.ding(); return; }
    const dedo = MANO.dedos.findIndex((r) => inRect(x, y, r));
    if (dedo < 0) return;
    if (!this.p.dedo(dedo, t)) return tunck(); // fuera de la ventana: todavia no corresponde
    this.dolor[dedo] = t;
    audio.scream();
    if (this.p.completo()) { resolver('cinco_p'); audio.triumph(); this.listo = t; }
  },

  salir() {
    if (this.saliendo) return;
    this.saliendo = true;
    this.go(...terminarPuzzle());
  },

  draw(ctx, t) {
    this.t = t;
    const color = (i) => (this.p.blanca(i, t) ? (t - this.p.unas[i] > VENTANA * 0.85 ? '#eab0b0' : BLANCO) : ROJO);
    mano(ctx, { unas: [color(0), color(1)], temblor: this.dolor.map((d) => (t - d < 600 ? (t - d) / 12 : 0)) });
    this.dolor.forEach((d, i) => {
      if (t - d < 800) {
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#d02020';
        ctx.fillText('AAAAY!!', MANO.dedos[i].x + 10, 54 - (t - d) / 40);
      }
    });
    if (this.p.ventana(t)) R(ctx, '#ffd23f', 0, 0, 320, 2); // la ventana de 7 segundos esta abierta
    if (this.listo !== null) {
      caption(ctx, 'Dolor a la extensión pasiva y llenado capilar enlentecido… esto no está bien.', 'Dr', 160);
      if (t - this.listo > 3500) this.salir();
    } else caption(ctx, 'La paciente tiene la mano enyesada y los dedos hinchados.', null, 176);
  },
};

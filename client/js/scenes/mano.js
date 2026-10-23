// Puzzle 7 (este dedito se fue al mercado): llenado capilar y dolor a la extension pasiva.
import { mano, MANO } from '../art/cuerpo.js';
import { CincoP, VENTANA } from '../game/cincop.js';
import { activar, resolver } from '../game/state.js';
import { terminarPuzzle } from '../game/caso.js';
import { R, W, H } from '../pix.js';
import { button, caption, inRect, wrap } from '../ui.js';
import { tunck } from '../hud.js';
import * as audio from '../audio.js';

const ACTIVAR = { x: 70, y: 112, w: 82, h: 18 }, SEGUIR = { x: 164, y: 112, w: 86, h: 18 };
const ROJO = '#d96a6a', BLANCO = '#f4eeee';

export default {
  enter(_c, go) {
    this.go = go;
    this.p = new CincoP();
    // se pide activar el sonido para este puzzle
    this.pideSonido = audio.silenciado() || !audio.on();
    this.dolor = [-1e9, -1e9];
    this.listo = null;
    this.saliendo = false;
    this.t = 0;
    activar('cinco_p');
  },

  click(x, y) {
    if (this.pideSonido) {
      if (inRect(x, y, ACTIVAR)) { audio.start(); audio.silenciar(false); this.pideSonido = false; audio.ding(); }
      else if (inRect(x, y, SEGUIR)) this.pideSonido = false;
      return;
    }
    if (this.listo !== null) return this.salir();
    const t = this.t;
    const una = MANO.unas.findIndex((r) => inRect(x, y, r));
    if (una >= 0) { this.p.unia(una, t); audio.ding(); return; }
    const dedo = MANO.dedos.findIndex((r) => inRect(x, y, r));
    if (dedo < 0) return;
    if (!this.p.dedo(dedo, t)) return tunck(); // fuera de la ventana: todavia no corresponde
    this.dolor[dedo] = t;
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
    if (this.p.ventana(t)) R(ctx, '#ffd23f', 0, 0, 320, 2); // la ventana de 7 segundos esta abierta
    if (this.listo !== null) {
      caption(ctx, 'Dolor a la extensión pasiva y llenado capilar enlentecido… esto no está bien.', 'Dr', 160);
      if (t - this.listo > 3500) this.salir();
    } else caption(ctx, 'La paciente tiene la mano enyesada y los dedos hinchados.', null, 176);
    if (this.pideSonido) {
      R(ctx, 'rgba(0,0,0,0.78)', 0, 0, W, H);
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd23f';
      ctx.fillText('ESTE PUZZLE NECESITA SONIDO', 160, 66);
      ctx.font = '8px monospace';
      ctx.fillStyle = '#fff';
      wrap(ctx, 'Activá el sonido para jugar este puzzle.', 230).forEach((l, i) => ctx.fillText(l, 160, 82 + i * 10));
      button(ctx, ACTIVAR, 'Activar sonido');
      button(ctx, SEGUIR, 'Seguir sin sonido');
    }
  },
};

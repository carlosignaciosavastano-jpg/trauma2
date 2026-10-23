// Puzzle 4 (el enigma de la depresion): tocar en orden los puntos de la "U osea" del hombro.
import { torso, PUNTOS_U_GH as PUNTOS_U } from '../art/cuerpo.js';
import { R } from '../pix.js';
import { activar, resolver } from '../game/state.js';
import { terminarPuzzle } from '../game/caso.js';
import { caption, mouse } from '../ui.js';
import { tunck } from '../hud.js';
import * as audio from '../audio.js';

const RADIO = 10;

export default {
  enter(_c, go) {
    this.go = go;
    this.paso = 0;
    this.listo = null;
    this.saliendo = false;
    this.t = 0;
    activar('charretera');
  },

  click(x, y) {
    if (this.listo !== null) return this.salir();
    const i = PUNTOS_U.findIndex((p) => Math.hypot(p.x - x, p.y - y) <= RADIO);
    if (i < 0) return;
    if (i !== this.paso) { this.paso = 0; return tunck(); }
    audio.ding();
    if (++this.paso === PUNTOS_U.length) {
      resolver('charretera');
      audio.triumph();
      this.listo = this.t;
    }
  },

  salir() {
    if (this.saliendo) return;
    this.saliendo = true;
    this.go(...terminarPuzzle());
  },

  draw(ctx, t) {
    this.t = t;
    torso(ctx, 'torso_gh.jpg');
    ctx.strokeStyle = '#ffd23f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    PUNTOS_U.slice(0, this.paso).forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.stroke();
    ctx.lineWidth = 1;
    PUNTOS_U.forEach((p, i) => {
      if (i < this.paso) R(ctx, '#ffd23f', p.x - 3, p.y - 3, 6, 6);
      else if (Math.hypot(p.x - mouse.x, p.y - mouse.y) <= RADIO) R(ctx, 'rgba(255,255,255,0.5)', p.x - 4, p.y - 4, 8, 8);
    });
    if (this.listo !== null) {
      caption(ctx, 'Claro!!!! El signo de la Charretera!!!!', 'Dr', 160);
      if (t - this.listo > 3000) this.salir();
    }
  },
};

// Puzzle 5 (luxacion gleno-humeral): se mira la RX 4 s, se pregunta si el jugador sabe que es, y
// con un fundido pasa a un dibujo donde se reduce el hombro arrastrando el humero.
import { rxGH, dibujoGH, DIB } from '../art/cuerpo.js';
import { R, W } from '../pix.js';
import { activar, resolver } from '../game/state.js';
import { DEMANDA_RX } from '../game/pacientes.js';
import { encaja, distSegmento } from '../game/pieza.js';
import { caption, inRect, options } from '../ui.js';
import { demanda } from './final.js';
import * as audio from '../audio.js';

const VER_MS = 4000, FADE_MS = 1200;
const DIAGNOSTICOS = ['Luxación acromio-clavicular', 'Luxación gleno-humeral', 'Nada'];

export default {
  enter(_c, go, arg = {}) {
    this.go = go;
    this.fase = arg.opciones ? 'opciones' : 'ver'; // despues de la demanda vuelve directo a las opciones
    this.t0 = null;
    this.fade0 = null;
    this.off = { x: 0, y: 0 };
    this.agarre = null;
    this.listo = null;
    this.fin = false;
    this.rects = [];
    this.t = 0;
    activar('reduccion');
  },

  fundido() { this.fase = 'fade'; this.fade0 = null; },

  mal() { demanda(this.go, DEMANDA_RX, { escena: 'reduccion', arg: { opciones: true } }); },

  click(x, y) {
    if (this.fase === 'opciones') {
      const i = this.rects.findIndex((r) => inRect(x, y, r));
      if (i === 1) this.fundido(); else if (i >= 0) this.mal();
    }
  },

  // el humero se agarra de la cabeza o del cuerpo
  down(x, y) {
    if (this.fase !== 'puzzle') return;
    const h = { x: DIB.cabeza.x + this.off.x, y: DIB.cabeza.y + this.off.y };
    const fin = { x: h.x + DIB.largo.dx, y: h.y + DIB.largo.dy };
    if (Math.hypot(x - h.x, y - h.y) <= DIB.cabeza.r + 8 || distSegmento({ x, y }, h, fin) <= 18) this.agarre = { dx: x - this.off.x, dy: y - this.off.y };
  },

  move(x, y) {
    if (this.agarre) this.off = { x: x - this.agarre.dx, y: y - this.agarre.dy };
  },

  up() {
    if (!this.agarre) return;
    this.agarre = null;
    if (!encaja(this.off, DIB.destino, DIB.tol)) return;
    this.off = { ...DIB.destino };
    resolver('reduccion');
    audio.triumph();
    this.listo = this.t;
    this.fase = 'listo';
  },

  draw(ctx, t) {
    this.t = t;
    this.t0 ??= t;
    if (this.fase === 'ver' || this.fase === 'opciones') {
      rxGH(ctx);
      if (this.fase === 'ver') {
        caption(ctx, 'RX del paciente.', null, 176);
        if (t - this.t0 >= VER_MS) this.fase = 'opciones';
      } else {
        caption(ctx, 'Tienes idea de lo que tenemos aquí?', 'Dr', 116);
        this.rects = options(ctx, DIAGNOSTICOS);
      }
      return;
    }
    if (this.fase === 'fade') {
      this.fade0 ??= t;
      const k = Math.min(1, (t - this.fade0) / FADE_MS);
      rxGH(ctx);
      ctx.globalAlpha = k;
      dibujoGH(ctx, this.off, t);
      ctx.globalAlpha = 1;
      if (k >= 1) this.fase = 'puzzle';
      return;
    }
    dibujoGH(ctx, this.off, t);
    if (this.fase === 'listo') {
      caption(ctx, 'Reducción lograda.', 'Dr', 170);
      if (t - this.listo > 1600 && !this.fin) { this.fin = true; this.go('consulta', { nodo: 'gh_ok' }); }
    }
  },
};

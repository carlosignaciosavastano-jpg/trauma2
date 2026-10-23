// Puzzle 6 (el que no sabe lo que busca): signo de la tecla sobre el tercio lateral de la clavicula.
import { torso, TERCIO_LATERAL as ZONA } from '../art/cuerpo.js';
import { R } from '../pix.js';
import { activar, resolver } from '../game/state.js';
import { terminarPuzzle } from '../game/caso.js';
import { caption, inRect } from '../ui.js';
import * as audio from '../audio.js';

const PULSOS = 4, CADENCIA = 1000, PRESION = 450; // 4 presiones, una por segundo

export default {
  enter(_c, go) {
    this.go = go;
    this.listo = null;
    this.sonados = 0;
    this.saliendo = false;
    this.t = 0;
    activar('tecla');
  },

  click(x, y) {
    if (this.listo !== null) return this.t - this.listo > PULSOS * CADENCIA && this.salir();
    if (!inRect(x, y, ZONA)) return;
    resolver('tecla');
    this.listo = this.t;
  },

  salir() {
    if (this.saliendo) return;
    this.saliendo = true;
    this.go(...terminarPuzzle());
  },

  draw(ctx, t) {
    this.t = t;
    torso(ctx);
    if (this.listo !== null) {
      // el dedo presiona y la clavicula "rebota" como la tecla de un piano
      const ms = t - this.listo;
      const n = Math.min(PULSOS - 1, Math.floor(ms / CADENCIA));
      const fase = Math.min(1, (ms - n * CADENCIA) / PRESION);
      if (this.sonados <= n) { this.sonados = n + 1; audio.tunck(); }
      if (ms >= PULSOS * CADENCIA && this.sonados === PULSOS) { this.sonados++; audio.triumph(); }
      const cx = ZONA.x + ZONA.w / 2, cy = ZONA.y + ZONA.h / 2;
      const baja = Math.sin(fase * Math.PI) * 5;
      ctx.fillStyle = 'rgba(70,30,10,0.35)';
      ctx.beginPath(); ctx.ellipse(cx, cy + 6, 22, 5, 0, 0, Math.PI * 2); ctx.fill();
      R(ctx, '#a0714f', cx - 5, 0, 10, cy - 4 + baja);
      R(ctx, '#150d08', cx - 3, cy - 30 + baja, 1, 2);
      R(ctx, '#150d08', cx + 2, cy - 18 + baja, 1, 2);
      if (ms >= PULSOS * CADENCIA) caption(ctx, 'Signo de la tecla positivo: seudocharretera de la luxación acromio-clavicular.', 'Dr', 160);
      if (ms > PULSOS * CADENCIA + 4500) this.salir();
    }
  },
};

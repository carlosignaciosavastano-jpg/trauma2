// Cinematica: el Dr toma el cafe (primer plano). Guion por tiempos, sin interaccion.
import { R, W, H } from '../pix.js';
import * as art from '../art/sala.js';
import * as audio from '../audio.js';
import { wrap } from '../ui.js';

const FIN = 11200;
const TEXTO = 'Dr hace media hora que lo llamo, tiene un pacientito';
const lerp = (a, b, k) => a + (b - a) * Math.min(1, Math.max(0, k));

export default {
  hud: false,
  enter(_ctx, go) {
    this.go = go;
    this.t0 = null;
    this.hechos = new Set();
  },

  draw(ctx, t) {
    this.t0 ??= t;
    const dt = t - this.t0;
    const cue = (ms, fn) => {
      if (dt >= ms && !this.hechos.has(ms)) { this.hechos.add(ms); fn(); }
    };
    const portazo = dt >= 8600;

    art.cara(ctx, { venas: Math.min(1, Math.max(0, (dt - 2600) / 1600)), sorpresa: portazo });
    // la taza sube a la boca, se bebe y desaparece
    if (dt < 4400) art.taza(ctx, lerp(200, 112, (dt - 1000) / 1400), lerp(176, 140, (dt - 1000) / 1400), dt, dt < 2400);
    cue(2400, audio.sip);

    // destello de luz detras de el
    if (dt >= 4400 && dt < 5300) {
      cue(4400, audio.ding);
      R(ctx, `rgba(255,255,255,${1 - Math.abs(dt - 4850) / 450})`, 0, 0, W, H);
    }

    // aparece la sombra femenina y habla; el portazo la hace desaparecer
    if (dt >= 5300 && !portazo) {
      art.sombra(ctx);
      cue(5400, audio.babble);
      if (dt >= 6000) {
        art.globo(ctx, 126, 8, 180, 36);
        ctx.font = '8px monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#000';
        wrap(ctx, `"${TEXTO}"`, 170).forEach((l, i) => ctx.fillText(l, 132, 22 + i * 10));
      }
    }
    cue(8600, audio.door);
    if (dt >= 8600 && dt < 8800) R(ctx, 'rgba(255,255,255,0.35)', 0, 0, W, H);

    if (dt >= FIN) this.go('sala', 'espalda');
  },
};

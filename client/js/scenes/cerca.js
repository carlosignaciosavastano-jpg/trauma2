// Cinematica: el Dr toma el cafe (primer plano). Guion por tiempos, sin interaccion.
import { R, W, H } from '../pix.js';
import * as art from '../art/sala.js';
import * as audio from '../audio.js';
import { wrap } from '../ui.js';

const PORTAZO = 11600; // 3 s mas de dialogo que antes, y despues ella se va
const SALE = 10800; // desde aca la secretaria camina hacia la puerta y se va
const FIN = 14200;
const PUERTA = { x: 218, y: 46, w: 88, h: 154 };
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
    const portazo = dt >= PORTAZO;

    art.cara(ctx, { venas: Math.min(1, Math.max(0, (dt - 2600) / 1600)), sorpresa: portazo });
    // la taza sube a la boca, se bebe y desaparece
    if (dt < 4400) art.taza(ctx, lerp(200, 112, (dt - 1000) / 1400), lerp(176, 140, (dt - 1000) / 1400), dt, dt < 2400);
    cue(2400, audio.sip);

    // destello de luz detras de el
    if (dt >= 4400 && dt < 5300) {
      cue(4400, audio.ding);
      R(ctx, `rgba(255,255,255,${1 - Math.abs(dt - 4850) / 450})`, 0, 0, W, H);
    }

    // puerta abierta con la luz del pasillo; la secretaria es una silueta a contraluz y se va caminando
    if (dt >= 5300 && !portazo) {
      const sale = lerp(0, 1, (dt - SALE) / 700);
      R(ctx, '#fff4cf', PUERTA.x, PUERTA.y, PUERTA.w, PUERTA.h);
      R(ctx, '#fffbe8', PUERTA.x + 10, PUERTA.y + 6, PUERTA.w - 20, PUERTA.h - 6);
      R(ctx, '#3a2a1c', PUERTA.x - 4, PUERTA.y - 4, PUERTA.w + 8, 4);
      R(ctx, '#3a2a1c', PUERTA.x - 4, PUERTA.y, 4, PUERTA.h);
      R(ctx, '#3a2a1c', PUERTA.x + PUERTA.w, PUERTA.y, 4, PUERTA.h);
      R(ctx, 'rgba(255,244,207,0.18)', PUERTA.x - 40, PUERTA.y + 40, 40, PUERTA.h - 40); // luz que entra a la sala
      ctx.save();
      ctx.beginPath();
      ctx.rect(PUERTA.x, PUERTA.y, PUERTA.w, PUERTA.h);
      ctx.clip();
      ctx.translate(262 + sale * 70, 200);
      ctx.scale(0.8, 0.8);
      ctx.translate(-262, -200);
      art.sombra(ctx);
      ctx.restore();
      cue(5400, audio.babble);
      if (dt >= 6000 && dt < SALE) {
        art.globo(ctx, 126, 8, 180, 36);
        ctx.font = '8px monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#000';
        wrap(ctx, `"${TEXTO}"`, 170).forEach((l, i) => ctx.fillText(l, 132, 22 + i * 10));
      }
    }
    cue(PORTAZO, audio.door);
    if (dt >= PORTAZO && dt < PORTAZO + 200) R(ctx, 'rgba(255,255,255,0.35)', 0, 0, W, H);

    if (dt >= FIN) this.go('sala', 'espalda');
  },
};

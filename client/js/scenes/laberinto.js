// Puzzle 3: el mapa del celular es un laberinto que se recorre con el mouse.
import { R, W, H } from '../pix.js';
import { Recorrido, SALAS, SIN_SALIDA, PASILLOS } from '../game/maze.js';
import { resolver } from '../game/state.js';
import * as audio from '../audio.js';

export default {
  hud: false,

  enter(_ctx, go) {
    this.go = go;
    this.rec = new Recorrido();
    this.fuera = -1e9;
    this.llego = null;
    this.t = 0;
  },

  move(x, y) {
    if (this.llego !== null) return;
    const e = this.rec.mover(x, y);
    if (e === 'fuera') { audio.tunck(); this.fuera = this.t; }
    if (e === 'fin') { resolver('laberinto'); audio.triumph(); this.llego = this.t; }
  },

  draw(ctx, t) {
    this.t = t;
    R(ctx, '#0e2238', 0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#9fd0ff';
    ctx.fillText('PLANO DEL HOSPITAL', 140, 8);

    // pasillos y salas con borde, para que se vean las paredes
    const piso = (r, col) => {
      R(ctx, '#2c4a66', r[0] - 1, r[1] - 1, r[2] + 2, r[3] + 2);
      R(ctx, col, r[0], r[1], r[2], r[3]);
    };
    PASILLOS.forEach((p) => piso(p, '#e8e4d0'));
    for (const s of Object.values(SIN_SALIDA)) piso(s.r, '#c9ced2');
    for (const s of Object.values(SALAS)) piso(s.r, '#d5dde2');
    // los bordes de las uniones se tapan con el piso para que no queden costuras
    PASILLOS.forEach((p) => R(ctx, '#e8e4d0', p[0] + 1, p[1] + 1, p[2] - 2, p[3] - 2));

    ctx.fillStyle = '#0e2238';
    for (const s of [...Object.values(SALAS), ...Object.values(SIN_SALIDA)]) {
      const [x, y, w, h] = s.r;
      // letra grande si entra, mas chica si no; el nombre se parte en palabras si hace falta
      ctx.font = 'bold 7px monospace';
      let partes = [s.nombre];
      if (ctx.measureText(s.nombre).width > w - 4) partes = s.nombre.split(' ');
      if (partes.some((l) => ctx.measureText(l).width > w - 4)) ctx.font = 'bold 6px monospace';
      partes.forEach((l, i) => ctx.fillText(l, x + w / 2, y + h / 2 + 2.5 + (i - (partes.length - 1) / 2) * 8));
    }
    // inicio y meta
    const pulso = Math.floor(t / 400) % 2;
    R(ctx, pulso ? '#3fbf5a' : '#2a8f40', 14, 14, 6, 6);
    R(ctx, '#d02020', 262, 154, 8, 3);
    R(ctx, '#d02020', 264.5, 151.5, 3, 8);

    // huella del recorrido
    for (const [x, y] of this.rec.huella) R(ctx, '#ffd23f', x - 1, y - 1, 2, 2);

    // mensajes
    R(ctx, '#000', 0, 187, W, 13);
    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = '#ffd23f';
    ctx.fillText(
      t - this.fuera < 1600
        ? 'Tocaste la pared: volvé a empezar'
        : 'Llevá el mouse de la SALA DE MÉDICOS a la GUARDIA',
      160,
      197,
    );
    if (t - this.fuera < 400) R(ctx, 'rgba(208,32,32,0.35)', 0, 0, W, H);
    if (this.llego !== null) {
      R(ctx, 'rgba(0,0,0,0.6)', 0, 80, W, 40);
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText('¡Llegaste a la guardia!', 160, 106);
      if (t - this.llego > 1800) this.go('guardia');
    }
  },
};

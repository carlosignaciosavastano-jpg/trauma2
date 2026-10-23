// El consultorio del Dr: computadora con "Agenda de turnos" y "Dx por Imagenes".
import { sala, BOTONES } from '../art/consultorio.js';
import { R, W, H } from '../pix.js';
import { game } from '../game/state.js';
import { ORDEN, PACIENTES } from '../game/pacientes.js';
import { destinoImagenes, dxListo, pedirEstudio, verImagenes } from '../game/caso.js';
import { button, inRect, wrap } from '../ui.js';
import { decir, tunck } from '../hud.js';
import * as audio from '../audio.js';

const VOLVER = { x: 236, y: 178, w: 76, h: 16 };
const filas = (n, y0 = 38) => Array.from({ length: n }, (_, i) => ({ x: 40, y: y0 + i * 26, w: 240, h: 20 }));
const ESTUDIOS = ['RX', 'RMN', 'ECO', 'TAC'];

export default {
  enter(_c, go, modo) {
    this.go = go;
    this.t = 0;
    game.pantalla = 'consultorio';
    this.modo = modo === 'agenda' || modo === 'victoria' ? 'agenda' : 'hub';
    if (modo === 'victoria') { audio.hum(); decir('A quien más tengo que ver?', 4000); }
  },

  // Fondo de las pantallas de la computadora.
  ventana(ctx, titulo) {
    R(ctx, '#0c2a52', 0, 0, W, H);
    R(ctx, '#1d4a98', 0, 0, W, 16);
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';
    ctx.fillText(titulo, 6, 11);
    button(ctx, VOLVER, '< Volver');
  },

  imagenes() { this.go(...destinoImagenes()); },

  draw(ctx, t) {
    this.t = t;
    if (this.modo === 'hub') {
      sala(ctx, t);
      ctx.textAlign = 'center';
      ctx.font = '6px monospace';
      ctx.fillStyle = '#9fd0ff';
      const esperan = ORDEN.length - Object.keys(game.atendidos).length;
      ctx.fillText(`Pacientes en espera: ${esperan}`, 160, 84);
      BOTONES.forEach((b) => button(ctx, b, b.t, { off: b.t[0] === 'D' && !dxListo() }));
      return;
    }
    const titulos = { agenda: 'Agenda de turnos', dx: 'Dx por Imágenes', estudios: 'Pedir estudios', msg: 'Mensaje del sistema' };
    this.ventana(ctx, titulos[this.modo]);
    this.rects = [];
    if (this.modo === 'agenda') {
      this.rects = filas(ORDEN.length);
      ORDEN.forEach((id, i) => button(ctx, this.rects[i], `${game.atendidos[id] ? '✔ ' : ''}${PACIENTES[id].nombre}`, { off: !!game.atendidos[id] }));
    } else if (this.modo === 'dx') {
      this.rects = filas(2, 50);
      ['1) Pedir imágenes', '2) Ver imágenes'].forEach((tx, i) => button(ctx, this.rects[i], tx));
    } else if (this.modo === 'estudios') {
      this.rects = filas(4, 30);
      ESTUDIOS.forEach((e, i) => button(ctx, this.rects[i], e));
    } else {
      ctx.font = '8px monospace';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      wrap(ctx, this.msg, 270).forEach((l, i) => ctx.fillText(l, 24, 60 + i * 12));
    }
  },

  click(x, y) {
    if (this.modo === 'hub') {
      if (inRect(x, y, BOTONES[0])) this.modo = 'agenda';
      else if (inRect(x, y, BOTONES[1])) { if (dxListo()) this.modo = 'dx'; else tunck(); }
      return;
    }
    if (inRect(x, y, VOLVER)) {
      this.modo = this.modo === 'estudios' ? 'dx' : this.modo === 'msg' ? 'estudios' : 'hub';
      return;
    }
    const i = (this.rects ?? []).findIndex((r) => inRect(x, y, r));
    if (i < 0) return;
    if (this.modo === 'agenda') {
      const id = ORDEN[i];
      if (game.atendidos[id]) return tunck();
      if (!PACIENTES[id].listo) { audio.tunck(); return decir('Este paciente se atiende en la próxima versión.', 3500); }
      this.go('consulta', { id });
    } else if (this.modo === 'dx') {
      if (i === 0) this.modo = 'estudios';
      else {
        if (verImagenes()) this.imagenes(); else tunck();
      }
    } else if (this.modo === 'estudios') {
      const r = pedirEstudio(ESTUDIOS[i]);
      if (r.ok) this.imagenes();
      else { this.msg = r.msg; this.modo = 'msg'; }
    }
  },
};

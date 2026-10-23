// Ayudas de interfaz compartidas por las escenas: puntero, texto con efecto de maquina de escribir,
// cuadro de dialogo y botones.
import { R, W, H } from './pix.js';
import * as audio from './audio.js';

export const mouse = { x: -1, y: -1 }; // lo actualiza main.js en cada movimiento

export const inRect = (x, y, r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
export const hover = (r) => inRect(mouse.x, mouse.y, r);

// Parte el texto en lineas que entran en maxW (ctx.font ya debe estar puesto).
export function wrap(ctx, text, maxW) {
  const lines = [];
  let cur = '';
  for (const w of text.split(' ')) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && ctx.measureText(next).width > maxW) { lines.push(cur); cur = w; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

// Texto que aparece letra a letra con sonido de maquina de escribir.
export class Typer {
  constructor(text, cps = 28) { this.text = text; this.cps = cps; this.t0 = null; this.n = 0; }
  shown(t) {
    this.t0 ??= t;
    const n = Math.min(this.text.length, Math.floor(((t - this.t0) * this.cps) / 1000));
    if (n > this.n && n % 2 === 0) audio.type();
    this.n = n;
    return this.text.slice(0, n);
  }
  done(t) { return this.shown(t).length === this.text.length; }
  skip() { this.t0 = -1e9; }
}

export const COLOR = { Dr: '#ffd23f', Pte: '#8fe3a0' };

// Cuadro de texto abajo: `who` colorea el nombre de quien habla. Devuelve la altura usada.
export function caption(ctx, text, who, y = 150) {
  ctx.font = '8px monospace';
  ctx.textAlign = 'left';
  const lines = wrap(ctx, text, W - 20);
  const h = 10 + lines.length * 10 + (who ? 10 : 0);
  const top = Math.min(y, H - h);
  R(ctx, 'rgba(0,0,0,0.85)', 0, top, W, H - top);
  let ty = top + 10;
  if (who) { ctx.fillStyle = COLOR[who] ?? '#fff'; ctx.fillText(`${who}:`, 8, ty); ty += 10; }
  ctx.fillStyle = '#fff';
  for (const l of lines) { ctx.fillText(l, 8, ty); ty += 10; }
  return H - top;
}

export function button(ctx, r, label, { off = false } = {}) {
  const on = !off && hover(r);
  R(ctx, '#000', r.x - 1, r.y - 1, r.w + 2, r.h + 2);
  R(ctx, off ? '#444' : on ? '#ffd23f' : '#d02020', r.x, r.y, r.w, r.h);
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = off ? '#888' : on ? '#000' : '#fff';
  ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2 + 3);
}

// Lista de opciones de dialogo, de abajo hacia arriba. Devuelve los rectangulos para detectar clicks.
export function options(ctx, list) {
  ctx.font = '8px monospace';
  const rows = list.map((t) => wrap(ctx, t, W - 34));
  const h = rows.reduce((s, r) => s + r.length * 9 + 4, 4);
  const top = H - h;
  R(ctx, 'rgba(0,0,0,0.88)', 0, top, W, h);
  ctx.textAlign = 'left';
  let y = top + 2;
  return rows.map((lines, i) => {
    const r = { x: 2, y, w: W - 4, h: lines.length * 9 + 3 };
    if (hover(r)) R(ctx, 'rgba(255,210,63,0.25)', r.x, r.y, r.w, r.h);
    ctx.fillStyle = '#ffd23f';
    ctx.fillText(`${i + 1})`, 6, y + 8);
    ctx.fillStyle = '#fff';
    lines.forEach((l, k) => ctx.fillText(l, 22, y + 8 + k * 9));
    y += r.h + 1;
    return r;
  });
}

// Interfaz fija sobre las escenas: el lugar del celular en el margen derecho, el smartphone
// (mensajes, mapa, ayuda) y el aviso "Hummm" de la voz del doctor.
import { R, W, H } from './pix.js';
import { game, pedirAyuda, resolver } from './game/state.js';
import * as audio from './audio.js';
import { inRect, wrap, button } from './ui.js';

export const DOCK = { x: 299, y: 62, w: 18, h: 34 };
const PHONE = { x: 100, y: 6, w: 120, h: 188 };
const BTN = [60, 88, 116].map((y) => ({ x: 110, y, w: 100, h: 22 }));
const HOME = { x: 150, y: 176, w: 20, h: 12 }; // boton fisico de abajo: volver / cerrar

const MENSAJES = {
  sala: ['4000 llamadas perdidas', 'Dr tiene un paciente esperando en la guardia', 'mensaje enviado hace 5 horas'],
  consultorio: ['Guardia: hay pacientes esperando.', 'Director: recuerde que los recursos de la institución no son infinitos.'],
};

let go, abierto = false, vista = 'home', ayuda = '', aviso = null;

export const init = (fn) => { go = fn; };

export function decir(text, ms = 3500) { aviso = { text, ms, t0: null }; }

// "Tunck": la accion todavia no corresponde. Siempre suena igual y el doctor murmura lo mismo.
export function tunck() {
  audio.tunck();
  audio.hum();
  decir('Hummm… Creo que aún debo hacer algo más');
}

function abrir() { abierto = true; vista = 'home'; }

function mapa() {
  if (game.pantalla !== 'sala') return decir('Hummm… ya estoy en la guardia.');
  if (!game.resueltos.mensajes) return tunck();
  if (game.resueltos.laberinto) return decir('Ya conozco el camino.');
  abierto = false;
  go('laberinto');
}

function clickCelular(x, y) {
  if (!inRect(x, y, PHONE)) { abierto = false; return; }
  if (inRect(x, y, HOME)) { if (vista === 'home') abierto = false; else vista = 'home'; return; }
  if (vista !== 'home') return;
  if (inRect(x, y, BTN[0])) {
    vista = 'msgs';
    if (game.pantalla === 'sala') resolver('mensajes'); // desbloquea el mapa
  } else if (inRect(x, y, BTN[1])) mapa();
  else if (inRect(x, y, BTN[2])) {
    const a = pedirAyuda();
    if (a) { ayuda = a; vista = 'ayuda'; } else { audio.tunck(); decir('Ya usé mis 3 ayudas. Ahora a arreglármelas solo.'); }
  }
}

// Devuelve true si el HUD se quedo con el evento (celular abierto o click en el celular guardado).
export function handle(type, x, y) {
  if (abierto) { if (type === 'click') clickCelular(x, y); return true; }
  if (type === 'click' && game.celular && inRect(x, y, DOCK)) { abrir(); return true; }
  return false;
}

function dibujarCelular(ctx) {
  R(ctx, 'rgba(0,0,0,0.55)', 0, 0, W, H);
  R(ctx, '#111', PHONE.x, PHONE.y, PHONE.w, PHONE.h);
  R(ctx, '#2c2c34', PHONE.x + 2, PHONE.y + 2, PHONE.w - 4, PHONE.h - 4);
  R(ctx, '#1a3a5a', PHONE.x + 6, PHONE.y + 12, PHONE.w - 12, 158);
  ctx.textAlign = 'center';
  ctx.font = 'bold 8px monospace';
  ctx.fillStyle = '#9fd0ff';
  ctx.fillText('Hospital Móvil', 160, 28);
  ctx.fillStyle = '#fff';
  ctx.font = '10px monospace';
  ctx.fillText('07:12', 160, 46);
  ctx.beginPath();
  ctx.arc(160, 182, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#555';
  ctx.fill();

  if (vista === 'home') {
    ['1  MENSAJES', '2  MAPA', '3  AYUDA!!!'].forEach((t, i) => button(ctx, BTN[i], t));
    return;
  }
  ctx.font = '8px monospace';
  ctx.textAlign = 'left';
  const lineas = vista === 'ayuda' ? [ayuda] : MENSAJES[game.pantalla] ?? MENSAJES.consultorio;
  let y = 62;
  lineas.forEach((m, i) => {
    const extra = vista === 'msgs' && game.pantalla === 'sala' && i === 2;
    ctx.fillStyle = extra ? '#8aa' : '#fff';
    for (const l of wrap(ctx, m, 100)) { ctx.fillText(l, 110, y); y += 10; }
    y += 8;
  });
}

export function draw(ctx, t) {
  if (game.dock) {
    R(ctx, '#000', 296, 54, 24, 50);
    R(ctx, '#d02020', 296, 54, 1, 50);
    if (game.celular) {
      R(ctx, '#111', DOCK.x, DOCK.y, DOCK.w, DOCK.h);
      R(ctx, '#2e6fb8', DOCK.x + 2, DOCK.y + 3, DOCK.w - 4, DOCK.h - 10);
      R(ctx, '#9fd0ff', DOCK.x + 4, DOCK.y + 6, DOCK.w - 8, 2);
      R(ctx, '#555', DOCK.x + 7, DOCK.y + DOCK.h - 5, 4, 2);
    } else {
      ctx.strokeStyle = '#ffd23f';
      ctx.setLineDash([2, 2]);
      ctx.strokeRect(DOCK.x + 0.5, DOCK.y + 0.5, DOCK.w - 1, DOCK.h - 1);
      ctx.setLineDash([]);
    }
  }
  if (abierto) dibujarCelular(ctx);
  if (aviso) {
    aviso.t0 ??= t;
    if (t - aviso.t0 > aviso.ms) aviso = null;
    else {
      R(ctx, '#000', 0, 186, W, 14);
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd23f';
      ctx.fillText(aviso.text, 160, 196);
    }
  }
}

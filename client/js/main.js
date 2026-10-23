import { scenes } from './scenes/index.js';
import * as hud from './hud.js';
import { mouse, inRect } from './ui.js';
import * as audio from './audio.js';
import { R } from './pix.js';

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
let current = null;

// Cambia de escena. Una escena es { enter?(ctx, go, arg), draw(ctx, t), down/move/up/click?(x, y), hud? }.
// hud: false oculta el celular y el aviso (cinematicas y laberinto).
function go(name, arg) {
  current = scenes[name];
  current.enter?.(ctx, go, arg);
}
hud.init(go);

// Parlante siempre visible arriba a la derecha: silencia o activa todo el sonido del juego.
const PARLANTE = { x: 300, y: 3, w: 16, h: 12 };
function dibujarParlante() {
  const m = audio.silenciado();
  R(ctx, 'rgba(0,0,0,0.6)', PARLANTE.x - 1, PARLANTE.y - 1, PARLANTE.w + 2, PARLANTE.h + 2);
  R(ctx, '#fff', PARLANTE.x + 2, PARLANTE.y + 4, 3, 4);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(PARLANTE.x + 5, PARLANTE.y + 4); ctx.lineTo(PARLANTE.x + 9, PARLANTE.y + 1);
  ctx.lineTo(PARLANTE.x + 9, PARLANTE.y + 11); ctx.lineTo(PARLANTE.x + 5, PARLANTE.y + 8);
  ctx.fill();
  ctx.strokeStyle = m ? '#ff5a4a' : '#fff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (m) { ctx.moveTo(PARLANTE.x + 10, PARLANTE.y + 3); ctx.lineTo(PARLANTE.x + 15, PARLANTE.y + 9); ctx.moveTo(PARLANTE.x + 15, PARLANTE.y + 3); ctx.lineTo(PARLANTE.x + 10, PARLANTE.y + 9); }
  else { ctx.moveTo(PARLANTE.x + 11, PARLANTE.y + 4); ctx.lineTo(PARLANTE.x + 12, PARLANTE.y + 6); ctx.lineTo(PARLANTE.x + 11, PARLANTE.y + 8); ctx.moveTo(PARLANTE.x + 13, PARLANTE.y + 2); ctx.lineTo(PARLANTE.x + 15, PARLANTE.y + 6); ctx.lineTo(PARLANTE.x + 13, PARLANTE.y + 10); }
  ctx.stroke();
}

// Punteros en pixeles del canvas (320x200), no de la pantalla. down captura el puntero
// para que el arrastre siga si el mouse sale del canvas.
for (const [dom, name] of [['pointerdown', 'down'], ['pointermove', 'move'], ['pointerup', 'up'], ['click', 'click']]) {
  canvas.addEventListener(dom, (e) => {
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * canvas.width;
    const y = ((e.clientY - r.top) / r.height) * canvas.height;
    if (name === 'down') canvas.setPointerCapture?.(e.pointerId);
    if (name === 'move') { mouse.x = x; mouse.y = y; }
    if (inRect(x, y, PARLANTE)) { // el parlante se queda con todos los eventos sobre el
      if (name === 'click') audio.silenciar(!audio.silenciado());
      return;
    }
    if (current.hud !== false && hud.handle(name, x, y)) return;
    current[name]?.(x, y);
  });
}

function frame(t) {
  current.draw(ctx, t);
  if (current.hud !== false) hud.draw(ctx, t);
  dibujarParlante();
  requestAnimationFrame(frame);
}

go('title');
requestAnimationFrame(frame);

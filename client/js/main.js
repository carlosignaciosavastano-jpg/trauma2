import { scenes } from './scenes/index.js';
import * as hud from './hud.js';
import { mouse } from './ui.js';

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

// Punteros en pixeles del canvas (320x200), no de la pantalla. down captura el puntero
// para que el arrastre siga si el mouse sale del canvas.
for (const [dom, name] of [['pointerdown', 'down'], ['pointermove', 'move'], ['pointerup', 'up'], ['click', 'click']]) {
  canvas.addEventListener(dom, (e) => {
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * canvas.width;
    const y = ((e.clientY - r.top) / r.height) * canvas.height;
    if (name === 'down') canvas.setPointerCapture?.(e.pointerId);
    if (name === 'move') { mouse.x = x; mouse.y = y; }
    if (current.hud !== false && hud.handle(name, x, y)) return;
    current[name]?.(x, y);
  });
}

function frame(t) {
  current.draw(ctx, t);
  if (current.hud !== false) hud.draw(ctx, t);
  requestAnimationFrame(frame);
}

go('title');
requestAnimationFrame(frame);

import { scenes } from './scenes/index.js';

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
let current = null;

// Cambia de escena; cada escena es { enter(ctx, go), draw(ctx, t), click?(x, y), move?(x, y) }.
function go(name) {
  current = scenes[name];
  current.enter?.(ctx, go);
}

// Coordenadas del puntero en pixeles del canvas (320x200), no de la pantalla.
const at = (fn) => (e) => {
  const r = canvas.getBoundingClientRect();
  fn?.(((e.clientX - r.left) / r.width) * canvas.width, ((e.clientY - r.top) / r.height) * canvas.height);
};
canvas.addEventListener('click', (e) => at(current.click?.bind(current))(e));
canvas.addEventListener('mousemove', (e) => at(current.move?.bind(current))(e));

function frame(t) {
  current.draw(ctx, t);
  requestAnimationFrame(frame);
}

go('title');
requestAnimationFrame(frame);

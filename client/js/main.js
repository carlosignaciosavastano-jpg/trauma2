import { scenes } from './scenes/index.js';

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
let current = null;

// Cambia de escena; cada escena es { enter(ctx, go), draw(ctx, t), click(x, y) }.
function go(name) {
  current = scenes[name];
  current.enter?.(ctx, go);
}

canvas.addEventListener('click', (e) => {
  const r = canvas.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * canvas.width;
  const y = ((e.clientY - r.top) / r.height) * canvas.height;
  current.click?.(x, y);
});

function frame(t) {
  current.draw(ctx, t);
  requestAnimationFrame(frame);
}

go('title');
requestAnimationFrame(frame);

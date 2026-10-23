// Rama diseno: reemplazar por la pantalla de titulo (quirofano pixel art, lampara titilante).
export default {
  enter(_ctx, go) { this.go = go; },
  draw(ctx) {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 320, 200);
    ctx.fillStyle = '#c33';
    ctx.font = '24px monospace';
    ctx.fillText('TRAUMADO2', 80, 100);
  },
  click() { this.go('facade'); },
};

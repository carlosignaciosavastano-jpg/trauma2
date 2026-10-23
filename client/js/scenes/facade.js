// Rama diseno: reemplazar por fachada del hospital + seleccion de personaje.
// Al elegir, llamar POST /api/game/character con { id } (ids en data/characters.json).
export default {
  draw(ctx) {
    ctx.fillStyle = '#223';
    ctx.fillRect(0, 0, 320, 200);
    ctx.fillStyle = '#ccc';
    ctx.font = '12px monospace';
    ctx.fillText('Fachada (placeholder)', 90, 100);
  },
};

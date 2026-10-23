// Puzzle de arrastrar un hueso: gira alrededor de un pivote siguiendo al puntero y encaja al soltar.
// Funciones puras (se prueban con node).
export const angulo = (desde, hasta) => Math.atan2(hasta.y - desde.y, hasta.x - desde.x);

// Rotacion (rad) que lleva la punta hasta la direccion del puntero, limitada a [min, max].
export function giro(pivote, punta, puntero, min = -0.1, max = 0.6) {
  return Math.min(max, Math.max(min, angulo(pivote, puntero) - angulo(pivote, punta)));
}

// Posicion de la punta despues de girar rot alrededor del pivote.
export function girar(pivote, punta, rot) {
  const dx = punta.x - pivote.x, dy = punta.y - pivote.y;
  const c = Math.cos(rot), s = Math.sin(rot);
  return { x: pivote.x + dx * c - dy * s, y: pivote.y + dx * s + dy * c };
}

export const encaja = (a, b, tol) => Math.hypot(a.x - b.x, a.y - b.y) <= tol;

// Distancia de un punto al segmento a-b (para "agarrar" un hueso largo).
export function distSegmento(p, a, b) {
  const vx = b.x - a.x, vy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / (vx * vx + vy * vy || 1)));
  return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
}

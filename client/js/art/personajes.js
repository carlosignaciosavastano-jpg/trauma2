// Abogado, heroe, enfermero y el "despertar" del Dr. Todo por codigo, 320x200.
import { R, W, H } from '../pix.js';
import { drawSprite } from '../sprites.js';
import { wrap } from '../ui.js';

const el = (c, col, x, y, rx, ry) => { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); };

// Abogado con la citacion judicial en la mano; `texto` va escrito en la citacion.
export function abogado(c, dt, texto) {
  R(c, '#4a1414', 0, 0, W, H);
  R(c, '#2a0a0a', 0, 150, W, 50);
  for (let x = 20; x < W; x += 60) R(c, '#5c1c1c', x, 0, 8, 150);
  // traje, camisa, corbata
  c.fillStyle = '#1c1c26';
  c.beginPath(); c.moveTo(20, 200); c.lineTo(40, 112); c.lineTo(160, 100); c.lineTo(190, 200); c.closePath(); c.fill();
  c.fillStyle = '#eee';
  c.beginPath(); c.moveTo(88, 104); c.lineTo(112, 104); c.lineTo(100, 150); c.closePath(); c.fill();
  R(c, '#c0201e', 97, 108, 6, 44);
  // cabeza: mandibula cuadrada, anteojos oscuros, sonrisa de dientes
  el(c, '#e6b088', 100, 62, 34, 40);
  R(c, '#e6b088', 70, 64, 60, 34);
  el(c, '#101010', 100, 30, 36, 14);
  R(c, '#101010', 70, 26, 60, 10);
  R(c, '#0a0a0a', 72, 50, 24, 10); R(c, '#0a0a0a', 104, 50, 24, 10); R(c, '#0a0a0a', 96, 53, 8, 3);
  R(c, '#3a0e0e', 78, 82, 44, 10);
  R(c, '#fff', 80, 82, 40, 5);
  for (let k = 0; k < 6; k++) R(c, '#3a0e0e', 86 + k * 6, 82, 1, 5);
  // citacion que se agita
  c.save();
  c.translate(240, 100);
  c.rotate(Math.sin(dt / 250) * 0.04);
  R(c, '#f4f0e0', -62, -62, 124, 124);
  R(c, '#c0201e', -62, -62, 124, 12);
  c.font = 'bold 8px monospace';
  c.textAlign = 'center';
  c.fillStyle = '#fff';
  c.fillText('CITACIÓN JUDICIAL', 0, -53);
  c.fillStyle = '#222';
  c.font = '6px monospace';
  wrap(c, texto, 112).slice(0, 10).forEach((l, i) => c.fillText(l, 0, -38 + i * 8));
  el(c, '#c0201e', 38, 52, 9, 9);
  c.restore();
}

// Enfermero obeso con el ombligo al aire; (x, y) = pies, s = escala.
export function enfermero(c, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  R(c, '#2c5aa8', -18, -34, 36, 34); // pantalon
  el(c, '#e8b890', 0, -52, 26, 24); // panza
  el(c, '#7a4a30', 0, -48, 2, 2); // ombligo
  R(c, '#2c5aa8', -26, -76, 52, 20); // chaqueta corta
  R(c, '#e8b890', -33, -74, 8, 22); R(c, '#e8b890', 25, -74, 8, 22);
  el(c, '#e8b890', 0, -92, 12, 14);
  R(c, '#1c4a98', -13, -108, 26, 8); // gorro
  R(c, '#222', -6, -94, 2, 2); R(c, '#222', 4, -94, 2, 2);
  R(c, '#7a2a1a', -4, -86, 8, 1);
  c.restore();
}

// Fondo de destello radiante.
function destello(c, dt) {
  R(c, '#ffe27a', 0, 0, W, H);
  c.fillStyle = '#fff6c8';
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2 + dt / 4000;
    c.beginPath();
    c.moveTo(110, 100);
    c.lineTo(110 + Math.cos(a) * 400, 100 + Math.sin(a) * 400);
    c.lineTo(110 + Math.cos(a + 0.1) * 400, 100 + Math.sin(a + 0.1) * 400);
    c.closePath();
    c.fill();
  }
}

// El Dr en pose de superheroe (capa al viento, punos en la cintura). inset: pantalla dentro de la pantalla.
export function heroe(c, dt, { inset = false } = {}) {
  destello(c, dt);
  c.save();
  c.translate(110, 196);
  c.scale(2.7, 2.7);
  c.fillStyle = '#c0302e';
  c.beginPath(); c.moveTo(-12, -48); c.lineTo(-30 - Math.sin(dt / 120) * 3, -8); c.lineTo(30 + Math.sin(dt / 120) * 3, -8); c.lineTo(12, -48); c.closePath(); c.fill();
  drawSprite(c, 'rubio', 0, 0);
  R(c, '#a0714f', -20, -36, 6, 4); R(c, '#a0714f', 14, -36, 6, 4); // punos en la cintura
  c.restore();
  if (!inset) return;
  R(c, '#000', 178, 14, 132, 104);
  R(c, '#b9b4a2', 180, 16, 128, 100);
  R(c, '#cfe0ee', 184, 20, 120, 92);
  c.save();
  c.beginPath(); c.rect(184, 20, 120, 92); c.clip();
  enfermero(c, 270, 112, 0.9);
  c.translate(222, 112);
  c.scale(0.95, 0.95);
  drawSprite(c, 'rubio', 0, 0);
  c.restore();
  R(c, '#fff', 188, 24, 22, 6); // etiqueta de camara
  c.fillStyle = '#d02020';
  c.fillRect(192, 26, 3, 3);
}

// Parpadeo: el Dr abre y cierra los ojos al despertar. `fondo` ya esta dibujado.
export function parpadeo(c, dt) {
  const ciclo = [[0, 700, 1], [700, 1000, 0.15], [1000, 1500, 1], [1500, 1900, 0.4], [1900, 2300, 1], [2300, 2600, 0.5]];
  let cierre = 0;
  for (const [a, b, v] of ciclo) if (dt >= a && dt < b) cierre = v;
  if (dt < 2600 && cierre === 0) cierre = 0.15;
  if (dt >= 2600) cierre = 0;
  if (cierre > 0) {
    const h = (H / 2) * cierre;
    R(c, '#000', 0, 0, W, h);
    R(c, '#000', 0, H - h, W, h);
  }
}

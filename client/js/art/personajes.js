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
  if (inset) reduccionEnCamilla(c, dt);
}

// Pantalla dentro de la pantalla: el paciente acostado en una camilla; el enfermero tira de una sabana
// puesta en la axila (contratraccion) y el Dr tira de la muñeca hacia el otro lado (maniobra de Hipocrates).
function reduccionEnCamilla(c, dt) {
  const X = 158, Y = 10, w = 154, h = 114;
  R(c, '#000', X - 2, Y - 2, w + 4, h + 4);
  c.save();
  c.beginPath(); c.rect(X, Y, w, h); c.clip();
  R(c, '#cfe0ee', X, Y, w, h); // pared
  R(c, '#9fb0a8', X, Y + 84, w, h - 84); // piso
  const tira = Math.sin(dt / 160) * 1.5; // el tironeo: los dos tiran para su lado
  // camilla
  R(c, '#6c7a80', 198, 92, 94, 3);
  R(c, '#cfd8dc', 196, 86, 98, 7);
  R(c, '#555', 204, 95, 2, 12); R(c, '#555', 284, 95, 2, 12);
  el(c, '#222', 205, 109, 4, 4); el(c, '#222', 285, 109, 4, 4);
  // paciente acostado: cabeza a la izquierda, brazo estirado hacia el Dr
  el(c, '#e8b890', 208, 80, 7, 6.5);
  R(c, '#6a3a20', 202, 73, 13, 4);
  R(c, '#7fb2e0', 216, 78, 44, 9); // camisolin
  R(c, '#7fb2e0', 260, 79, 30, 7);
  // brazo estirado y un poco separado del cuerpo, tironeado desde la muñeca (como en la maniobra de referencia)
  c.strokeStyle = '#e8b890'; c.lineWidth = 4;
  c.beginPath(); c.moveTo(228, 86); c.lineTo(283 + tira, 98); c.stroke();
  el(c, '#e8b890', 284 + tira, 98, 3, 3);
  // sabana en la axila: pasa por debajo del brazo y va hasta las manos del enfermero
  c.strokeStyle = '#fff'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(228, 87); c.lineTo(190 - tira, 70); c.stroke();
  c.lineWidth = 1;
  enfermero(c, 176 - tira, 120, 0.62);
  el(c, '#e8b890', 190 - tira, 70, 3, 3); // sus manos sobre la sabana
  // el Dr, del otro lado, agarrando la muñeca
  c.save();
  c.translate(291 + tira, 120);
  c.scale(0.72, 0.72);
  drawSprite(c, 'rubio', 0, 0);
  c.restore();
  c.strokeStyle = '#a0714f'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(289 + tira, 100); c.lineTo(284 + tira, 98); c.stroke();
  c.lineWidth = 1;
  // flechas azules de la traccion, una por cada eje (sabana y brazo), como en el esquema
  c.strokeStyle = '#2a5bd7'; c.fillStyle = '#2a5bd7'; c.lineWidth = 1.5;
  for (const [x0, y0, x1, y1] of [[214, 76, 198, 69], [250, 91, 270, 96]]) {
    const a = Math.atan2(y1 - y0, x1 - x0);
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - 5 * Math.cos(a - 0.5), y1 - 5 * Math.sin(a - 0.5)); c.lineTo(x1 - 5 * Math.cos(a + 0.5), y1 - 5 * Math.sin(a + 0.5)); c.closePath(); c.fill();
  }
  c.lineWidth = 1;
  c.restore();
  R(c, '#fff', X + 4, Y + 4, 22, 6); // etiqueta de camara
  c.fillStyle = '#d02020';
  c.fillRect(X + 8, Y + 6, 3, 3);
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

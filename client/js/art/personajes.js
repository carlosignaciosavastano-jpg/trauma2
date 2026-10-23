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
  if (inset === 'yeso') yesoAbierto(c);
  else if (inset === 'cabestrillo') pacienteConCabestrillo(c);
  else if (inset) reduccionEnCamilla(c, dt);
}

// Pantalla dentro de la pantalla: el paciente acostado en una camilla; el enfermero tira de una sabana
// puesta en la axila (contratraccion) y el Dr tira de la muñeca hacia el otro lado (maniobra de Hipocrates).
function marco(c, dibujar) {
  const X = 158, Y = 10, w = 154, h = 114;
  R(c, '#000', X - 2, Y - 2, w + 4, h + 4);
  c.save();
  c.beginPath(); c.rect(X, Y, w, h); c.clip();
  R(c, '#cfe0ee', X, Y, w, h); // pared
  R(c, '#9fb0a8', X, Y + 84, w, h - 84); // piso
  dibujar();
  c.restore();
}

// Antebrazo con el yeso cortado a lo largo (las dos valvas separadas) y la mano de color y tamaño normales.
function yesoAbierto(c) {
  marco(c, () => {
    const piel = '#e8b890', yeso = '#ece7da', borde = '#b9b2a0';
    R(c, '#8a6a4a', 166, 96, 138, 4); // mesa
    R(c, piel, 176, 56, 70, 22); // antebrazo
    R(c, '#f6f2ea', 176, 52, 66, 4); R(c, '#f6f2ea', 176, 78, 66, 4); // algodon
    R(c, yeso, 174, 40, 68, 12); R(c, borde, 174, 51, 68, 1); // valva superior
    R(c, yeso, 174, 82, 68, 12); R(c, borde, 174, 82, 68, 1); // valva inferior
    R(c, piel, 242, 54, 26, 26); // palma
    R(c, piel, 250, 46, 5, 10); R(c, '#f2c9ae', 250, 46, 5, 2); // pulgar
    const largos = [22, 26, 28, 25, 19];
    largos.forEach((l, i) => { R(c, piel, 268, 54 + i * 5, l, 4); R(c, '#f2c9ae', 268 + l - 3, 54 + i * 5, 3, 4); });
    R(c, '#c8a07c', 242, 54, 1, 26); // pliegue de la muñeca
    // sierra apoyada a un lado
    R(c, '#cfd4d8', 178, 30, 52, 4); for (let x = 178; x < 230; x += 3) R(c, '#9aa0a5', x, 34, 2, 2);
    R(c, '#7a3fb0', 226, 27, 14, 9);
  });
  camara(c);
}

// Paciente de frente con el brazo en cabestrillo (pañuelo azul colgado del cuello).
function pacienteConCabestrillo(c) {
  marco(c, () => {
    const piel = '#e8b890', bata = '#9ec3dc', azul = '#2a5d9f';
    R(c, bata, 214, 54, 44, 52); // torso
    R(c, bata, 208, 56, 8, 38); R(c, piel, 208, 92, 8, 8); // brazo sano
    R(c, '#4a5560', 218, 106, 15, 16); R(c, '#4a5560', 239, 106, 15, 16); // piernas
    R(c, piel, 232, 46, 8, 8);
    el(c, piel, 236, 36, 11, 12); // cabeza
    R(c, '#3a2a20', 225, 22, 22, 7);
    R(c, '#150d08', 231, 35, 2, 2); R(c, '#150d08', 240, 35, 2, 2);
    R(c, bata, 252, 56, 8, 22); // brazo lesionado
    R(c, bata, 224, 78, 36, 8); // antebrazo cruzado
    R(c, piel, 216, 79, 9, 7); // mano
    c.fillStyle = azul; c.beginPath(); c.moveTo(220, 76); c.lineTo(262, 76); c.lineTo(262, 90); c.lineTo(250, 98); c.lineTo(228, 98); c.lineTo(220, 90); c.closePath(); c.fill();
    c.strokeStyle = azul; c.lineWidth = 3;
    c.beginPath(); c.moveTo(262, 76); c.lineTo(246, 50); c.lineTo(230, 50); c.lineTo(220, 76); c.stroke();
    c.lineWidth = 1;
    R(c, piel, 216, 79, 9, 6);
  });
  camara(c);
}

function reduccionEnCamilla(c, dt) {
  marco(c, () => {
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
  c.beginPath(); c.moveTo(228, 86); c.lineTo(260 + tira, 94); c.stroke();
  el(c, '#e8b890', 261 + tira, 94.5, 3, 3);
  // sabana en la axila: pasa por debajo del brazo y va hasta las manos del enfermero
  c.strokeStyle = '#fff'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(228, 87); c.lineTo(190 - tira, 70); c.stroke();
  c.lineWidth = 1;
  enfermero(c, 176 - tira, 120, 0.62);
  el(c, '#e8b890', 190 - tira, 70, 3, 3); // sus manos sobre la sabana
  // el Dr, de costado y echado hacia atras, con los brazos estirados tirando de la muñeca
  drDeLado(c, 292 + tira, 120, { x: 262 + tira, y: 95 });
  // flechas azules de la traccion, una por cada eje (sabana y brazo), como en el esquema
  c.strokeStyle = '#2a5bd7'; c.fillStyle = '#2a5bd7'; c.lineWidth = 1.5;
  for (const [x0, y0, x1, y1] of [[214, 76, 198, 69], [238, 90, 252, 93]]) {
    const a = Math.atan2(y1 - y0, x1 - x0);
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - 5 * Math.cos(a - 0.5), y1 - 5 * Math.sin(a - 0.5)); c.lineTo(x1 - 5 * Math.cos(a + 0.5), y1 - 5 * Math.sin(a + 0.5)); c.closePath(); c.fill();
  }
  c.lineWidth = 1;
  });
  camara(c);
}

function camara(c) {
  R(c, '#fff', 162, 14, 22, 6);
  R(c, '#d02020', 166, 16, 3, 3);
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

// El Dr de perfil (mira a la izquierda), inclinado hacia atras; los dos brazos van hasta la muñeca `mano`.
function drDeLado(c, x, y, mano) {
  const piel = '#a0714f', ropa = '#7a3fb0', giro = 0.3;
  R(c, 'rgba(0,0,0,0.25)', x - 14, y - 1, 28, 3);
  R(c, ropa, x - 9, y - 30, 6, 28); R(c, '#1c1c1c', x - 10, y - 4, 9, 3); // pierna adelantada
  R(c, ropa, x + 2, y - 30, 6, 28); R(c, '#1c1c1c', x + 1, y - 4, 9, 3); // pierna de atras
  c.save();
  c.translate(x, y - 28);
  c.rotate(giro);
  R(c, ropa, -7, -26, 14, 27); // torso
  R(c, piel, -2, -30, 4, 5); // cuello
  el(c, piel, 0, -35, 6, 7); // cabeza de perfil
  R(c, piel, -9, -36, 3, 3); // nariz
  R(c, '#1a110b', -5, -43, 11, 5); // pelo
  R(c, '#1a110b', -2, -37, 2, 2); // ojo
  c.restore();
  const hombro = { x: x + 24 * Math.sin(giro), y: y - 28 - 24 * Math.cos(giro) };
  c.strokeStyle = piel; c.lineWidth = 3;
  for (const dy of [0, 3]) { c.beginPath(); c.moveTo(hombro.x, hombro.y + dy); c.lineTo(mano.x + 2, mano.y - 1 + dy / 2); c.stroke(); }
  c.lineWidth = 1;
  el(c, piel, mano.x + 1, mano.y, 3.5, 3.5); // punos cerrados sobre la muñeca
}

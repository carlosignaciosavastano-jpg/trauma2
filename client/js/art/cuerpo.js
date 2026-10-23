// Examen fisico y radiografias de los casos de hombro y mano.
import { R, W, H, mk } from '../pix.js';
import { imagen } from './imagenes.js';

const el = (c, col, x, y, rx, ry) => { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); };

// ---- Torso con el hombro desnudo (foto) ----------------------------------------------------------
export const ESC_TORSO = W / 329; // la foto tiene 329 px de ancho

// Puntos de la "U osea" (puzzle 4), en pixeles del canvas.
export const PUNTOS_U = [
  { nombre: 'articulación esterno-clavicular', x: 70, y: 112 },
  { nombre: 'clavícula', x: 130, y: 88 },
  { nombre: 'articulación acromio-clavicular', x: 185, y: 68 },
  { nombre: 'acromion', x: 213, y: 77 },
];
// Tercio lateral de la clavicula (puzzle 6: signo de la tecla).
export const TERCIO_LATERAL = { x: 142, y: 62, w: 52, h: 30 };

export function torso(c) {
  R(c, '#d9a37d', 0, 0, W, H);
  const i = imagen('torso.jpg');
  if (i) { c.imageSmoothingEnabled = false; c.drawImage(i, 0, 0, W, i.height * ESC_TORSO); }
}

// ---- Radiografia de luxacion gleno-humeral (dibujada por codigo) ---------------------------------
export const GLENOIDE = { x: 238, y: 92 }; // donde tiene que quedar el centro de la cabeza humeral
export const HUMERO_INICIAL = { x: 206, y: 134 };
export const HUMERO_LARGO = { dx: 24, dy: 78 }; // del centro de la cabeza al extremo del cuerpo

const HUESO = 'rgba(226,218,200,0.78)';

// Costillas, clavicula y escapula. fondo=false deja solo el hueso (pieza para superponer a la piel).
export function rxGHBase(c, { fondo = true } = {}) {
  if (fondo) {
    R(c, '#08080a', 0, 0, W, H);
    el(c, 'rgba(60,56,50,0.5)', 250, 110, 120, 90); // partes blandas
  }
  // costillas
  c.strokeStyle = 'rgba(190,184,170,0.55)';
  c.lineWidth = 6;
  for (let k = 0; k < 5; k++) {
    c.beginPath();
    c.ellipse(-40, 40 + k * 38, 130 - k * 4, 60, 0, -0.5, 0.6);
    c.stroke();
  }
  // clavicula
  c.strokeStyle = HUESO;
  c.lineWidth = 9;
  c.lineCap = 'round';
  c.beginPath(); c.moveTo(40, 30); c.quadraticCurveTo(130, 20, 214, 48); c.stroke();
  // escapula: cuerpo, acromion, coracoides y glenoides
  c.fillStyle = HUESO;
  c.beginPath();
  for (const [x, y] of [[118, 66], [160, 56], [206, 62], [212, 82], [206, 104], [190, 150], [150, 192], [118, 168], [108, 112]]) c.lineTo(x, y);
  c.fill();
  c.beginPath();
  for (const [x, y] of [[196, 52], [252, 46], [266, 60], [216, 70]]) c.lineTo(x, y);
  c.fill();
  c.beginPath(); c.arc(194, 64, 9, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#f2ecdc'; // borde de la cavidad glenoidea
  c.lineWidth = 3;
  c.beginPath(); c.arc(224, 92, 15, -1.3, 1.3); c.stroke();
  c.lineWidth = 1;
}

// Humero: cabeza, cuello y cuerpo, con la cabeza centrada en (hx, hy).
export function rxGHHumero(c, hx, hy) {
  c.strokeStyle = HUESO;
  c.lineWidth = 15;
  c.beginPath(); c.moveTo(hx + 3, hy + 10); c.lineTo(hx + HUMERO_LARGO.dx, hy + HUMERO_LARGO.dy); c.stroke();
  el(c, HUESO, hx, hy, 17, 16);
  el(c, 'rgba(255,250,235,0.35)', hx - 4, hy - 4, 8, 7);
  c.lineCap = 'butt';
  c.lineWidth = 1;
}

export function rxGH(c, hx, hy) {
  rxGHBase(c);
  rxGHHumero(c, hx, hy);
}

// ---- Radiografia de luxacion acromio-clavicular (foto: base + clavicula que se arrastra) ---------
export const RX_AC = {
  S: H / 339,
  pivote: { x: 42, y: 95 }, // fuente: extremo medial de la clavicula
  punta: { x: 213, y: 42 }, // extremo lateral, hoy fuera de lugar
  destino: { x: 221, y: 100 }, // sobre el acromion
  recorte: { x: 36, y: 20 }, // de donde se recorto la imagen de la clavicula
};

// Convierte coordenadas de la foto a las del canvas.
export const aCanvas = (p) => ({ x: (W - 387 * RX_AC.S) / 2 + p.x * RX_AC.S, y: p.y * RX_AC.S });

export function rxAC(c, rot) {
  R(c, '#0b0b0b', 0, 0, W, H);
  const b = imagen('rx_ac_base.jpg'), k = imagen('rx_clavicula.png');
  c.imageSmoothingEnabled = false;
  const { S } = RX_AC;
  if (b) c.drawImage(b, (W - 387 * S) / 2, 0, 387 * S, 339 * S);
  if (k) {
    const p = aCanvas(RX_AC.pivote);
    c.save();
    c.translate(p.x, p.y);
    c.rotate(rot);
    c.scale(S, S);
    c.drawImage(k, RX_AC.recorte.x - RX_AC.pivote.x, RX_AC.recorte.y - RX_AC.pivote.y);
    c.restore();
  }
}

// RX de la luxacion AC para elegir el diagnostico (foto completa, arriba de las opciones).
export function rxDiagnostico(c) {
  R(c, '#0b0b0b', 0, 0, W, H);
  const i = imagen('rx_ac.jpg');
  if (!i) return;
  c.imageSmoothingEnabled = false;
  const s = W / i.width; // ancho completo, se recorta alto
  c.drawImage(i, 0, 90 / s, i.width, 130 / s, 0, 0, W, 130);
}

// ---- Mano enyesada (puzzle 7 y pantalla de la paciente) ------------------------------------------
// Dedos de izquierda a derecha: 5to, 4to, medio, indice. Medio e indice estan semiflexionados.
const DEDOS = [
  { x: 118, flex: false }, { x: 144, flex: false }, { x: 170, flex: true }, { x: 196, flex: true },
];
const TOPE = { recto: 38, flex: 62 };
const w = 20;

// Rectangulos para los clicks. unas[0] = indice, unas[1] = medio; dedos igual.
export const MANO = {
  unas: [DEDOS[3], DEDOS[2]].map((d) => ({ x: d.x - 7, y: TOPE.flex + 1, w: 14, h: 9 })),
  dedos: [DEDOS[3], DEDOS[2]].map((d) => ({ x: d.x - 10, y: TOPE.flex, w: w, h: 42 })),
};

// colores[i]: color de la una i (null = normal). temblor: px de sacudida del dedo que duele.
export function mano(c, { unas = ['#d96a6a', '#d96a6a'], temblor = [0, 0] } = {}) {
  R(c, '#cfd9d2', 0, 0, W, H);
  R(c, '#8fa89a', 0, 168, W, 32);
  // yeso hasta la palma
  R(c, '#f4f1e8', 100, 128, 120, 72);
  R(c, '#d9d4c4', 100, 128, 120, 3);
  c.fillStyle = '#9b958a';
  for (let k = 0; k < 9; k++) c.fillRect(112 + k * 11, 150 + (k % 3) * 9, 6, 1);
  R(c, '#d8a07a', 106, 96, 108, 36); // palma
  DEDOS.forEach((d, i) => {
    const fi = i === 3 ? 0 : i === 2 ? 1 : -1; // indice/medio -> 0/1
    const sh = fi >= 0 ? Math.sin(temblor[fi]) * 3 : 0;
    const top = d.flex ? TOPE.flex : TOPE.recto;
    // dedos hinchados como salchichas
    R(c, '#c98a82', d.x - 10 + sh, top, w, 100 - top);
    el(c, '#c98a82', d.x + sh, top, 10, 6);
    R(c, '#e5b0a8', d.x - 6 + sh, top + 4, 3, 90 - top);
    R(c, 'rgba(90,40,50,0.25)', d.x - 10 + sh, 84, w, 2);
    if (d.flex) R(c, 'rgba(90,40,50,0.35)', d.x - 10 + sh, top + 20, w, 2); // pliegue de la flexion
    const una = fi >= 0 ? unas[fi] : '#d96a6a';
    R(c, '#b87870', d.x - 8 + sh, top - 1, 16, 12);
    R(c, una, d.x - 7 + sh, top, 14, 9);
  });
}

// ---- Piezas de RX para acomodar sobre la piel del paciente ---------------------------------------
// Cada pieza: { img(): lo que se dibuja, x, y: posicion correcta (esquina), hit: zona para agarrarla,
//               ini: desplazamiento inicial }. Se dibujan en 1:1 sobre el torso.
let gh = null;
function piezasGH() {
  if (!gh) {
    const base = mk(), hum = mk();
    rxGHBase(base.getContext('2d'), { fondo: false });
    rxGHHumero(hum.getContext('2d'), HUMERO_INICIAL.x, HUMERO_INICIAL.y);
    gh = { base, hum };
  }
  return gh;
}

export const SUPERPONER = {
  gh: () => [
    { img: () => piezasGH().base, x: 0, y: 0, hit: { x: 0, y: 20, w: 270, h: 180 }, ini: { x: -38, y: 28 } },
    { img: () => piezasGH().hum, x: 0, y: 0, hit: { x: HUMERO_INICIAL.x - 20, y: HUMERO_INICIAL.y - 18, w: 60, h: 112 }, ini: { x: 34, y: -26 } },
  ],
  ac: () => [
    { img: () => imagen('rx_ac_pieza.png'), x: 45, y: 10, w: 240, h: 210, hit: { x: 45, y: 10, w: 240, h: 210 }, ini: { x: -40, y: 30 } },
    { img: () => imagen('rx_clav_pieza.png'), x: 67, y: 22, w: 115, h: 67, hit: { x: 67, y: 22, w: 115, h: 67 }, ini: { x: 30, y: 62 } },
  ],
};

// Examen fisico y radiografias de los casos de hombro y mano.
import { R, W, H } from '../pix.js';
import { imagen } from './imagenes.js';

const el = (c, col, x, y, rx, ry) => { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); };

// ---- Torso con el hombro desnudo (foto) ----------------------------------------------------------

// Puntos de la "U osea" (puzzle 4), en pixeles del canvas.
export const PUNTOS_U = [
  { nombre: 'articulación esterno-clavicular', x: 70, y: 112 },
  { nombre: 'clavícula', x: 130, y: 88 },
  { nombre: 'articulación acromio-clavicular', x: 185, y: 68 },
  { nombre: 'acromion', x: 213, y: 77 },
];
// Foto del hombro luxado (gleno-humeral): la U osea sigue la clavicula, el acromion y el hueco bajo el.
export const PUNTOS_U_GH = [
  { nombre: 'clavícula', x: 100, y: 30 },
  { nombre: 'clavícula lateral', x: 140, y: 40 },
  { nombre: 'acromion', x: 172, y: 50 },
  { nombre: 'hueco bajo el acromion', x: 192, y: 78 },
];
// Tercio lateral de la clavicula (puzzle 6: signo de la tecla).
export const TERCIO_LATERAL = { x: 142, y: 62, w: 52, h: 30 };

export function torso(c, foto = 'torso.jpg') {
  R(c, '#d9a37d', 0, 0, W, H);
  const i = imagen(foto);
  if (i) { c.imageSmoothingEnabled = false; c.drawImage(i, 0, 0, W, (i.height * W) / i.width); }
}

// ---- Radiografia real de luxacion gleno-humeral (base + humero, recortados de la placa) -----------
// Posiciones en pixeles del canvas; el humero esta hoy luxado (abajo y adentro de la glenoides).
export const GH = {
  base: { x: 52, y: 5, w: 178, h: 184 },
  hum: { x: 157, y: 91, w: 78, h: 108 },
  destino: { x: 0, y: -35 }, // cuanto hay que subir el humero para que la cabeza entre en la glenoides
};

// off: desplazamiento del humero respecto de su lugar luxado.
export function rxGH(c, off = { x: 0, y: 0 }) {
  R(c, '#08080a', 0, 0, W, H);
  const b = imagen('gh_base.png'), h = imagen('gh_hum.png');
  c.imageSmoothingEnabled = false;
  if (b) c.drawImage(b, GH.base.x, GH.base.y, GH.base.w, GH.base.h);
  if (h) c.drawImage(h, GH.hum.x + off.x, GH.hum.y + off.y, GH.hum.w, GH.hum.h);
}

// ---- Dibujo del hombro para reducir la luxacion (aparece despues de interpretar la RX) -------------
export const DIB = {
  cabeza: { x: 168, y: 150, r: 22 }, // cabeza humeral luxada: abajo y adentro
  largo: { dx: 34, dy: 92 },
  destino: { x: 18, y: -56 }, // cuanto hay que subir el humero para que la cabeza entre en la cuenca
  tol: 26, // generosa: la reduccion tiene que ser facil
};

export function dibujoGH(c, off = { x: 0, y: 0 }, t = 0) {
  R(c, '#efe6d0', 0, 0, W, H);
  c.lineJoin = 'round';
  c.lineCap = 'round';
  const hueso = (pts) => {
    c.beginPath();
    pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath();
    c.fillStyle = '#f9f4e4';
    c.fill();
    c.strokeStyle = '#3b2f25';
    c.lineWidth = 2;
    c.stroke();
  };
  hueso([[58, 58], [110, 46], [168, 52], [174, 72], [168, 98], [150, 140], [112, 172], [80, 150], [64, 100]]); // escapula
  hueso([[158, 42], [214, 36], [228, 50], [176, 64]]); // acromion
  c.strokeStyle = '#3b2f25'; c.lineWidth = 12; c.beginPath(); c.moveTo(18, 30); c.lineTo(168, 44); c.stroke();
  c.strokeStyle = '#f9f4e4'; c.lineWidth = 8; c.beginPath(); c.moveTo(18, 30); c.lineTo(168, 44); c.stroke();
  // cavidad glenoidea: late para que se vea adonde va el humero
  const p = 0.5 + 0.5 * Math.sin(t / 300);
  c.strokeStyle = `rgba(200,60,40,${0.55 + 0.4 * p})`;
  c.lineWidth = 5;
  c.beginPath(); c.arc(DIB.cabeza.x + DIB.destino.x, DIB.cabeza.y + DIB.destino.y, DIB.cabeza.r + 5, Math.PI - 1.2, Math.PI + 1.2); c.stroke();
  // humero
  const hx = DIB.cabeza.x + off.x, hy = DIB.cabeza.y + off.y;
  c.strokeStyle = '#3b2f25'; c.lineWidth = 26; c.beginPath(); c.moveTo(hx + 4, hy + 8); c.lineTo(hx + DIB.largo.dx, hy + DIB.largo.dy); c.stroke();
  c.strokeStyle = '#f9f4e4'; c.lineWidth = 22; c.beginPath(); c.moveTo(hx + 4, hy + 8); c.lineTo(hx + DIB.largo.dx, hy + DIB.largo.dy); c.stroke();
  c.beginPath(); c.arc(hx, hy, DIB.cabeza.r, 0, Math.PI * 2);
  c.fillStyle = '#f9f4e4'; c.fill(); c.strokeStyle = '#3b2f25'; c.lineWidth = 2; c.stroke();
  c.lineWidth = 1;
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
  c.drawImage(i, 0, 10, i.width, 150, 0, 0, W, 124); // clavicula y acromion, arriba de las opciones
}

// ---- Mano enyesada (puzzle 7 y pantalla de la paciente) ------------------------------------------
// Dedos de izquierda a derecha: 5to, 4to, medio, indice. Medio e indice estan semiflexionados.
const DEDOS = [
  { x: 118, flex: false }, { x: 144, flex: false }, { x: 170, flex: true }, { x: 196, flex: true },
];
const TOPE = { recto: 38, flex: 38 }; // los cuatro dedos miden lo mismo; la flexion se marca con un pliegue
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

// Consultorio en primera persona: puerta, esqueleto, negatoscopio con RX de perro, ficus, escritorio,
// monitor y las manos peludas del Dr. Todo por codigo, 320x200.
import { R, W } from '../pix.js';

const el = (c, col, x, y, rx, ry) => { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); };

// Monitor grande (solo el Dr) o chico a un costado (cuando hay un paciente en la silla).
export const MONITOR = { centro: { x: 88, y: 66, w: 144, h: 92 }, lado: { x: 4, y: 94, w: 78, h: 60 } };
export const PANTALLA = { x: 94, y: 72, w: 132, h: 76 }; // zona util del monitor grande
// Los dos botones de la pantalla del hub.
export const BOTONES = [
  { x: 104, y: 92, w: 112, h: 18, t: 'Agenda de turnos' },
  { x: 104, y: 116, w: 112, h: 18, t: 'Dx por Imágenes' },
];

function esqueleto(c) {
  R(c, '#555', 108, 20, 2, 100);
  R(c, '#555', 98, 118, 22, 3);
  el(c, '#ece8da', 109, 34, 7, 8); // craneo
  R(c, '#ece8da', 106, 41, 7, 4);
  R(c, '#222', 105, 33, 2, 3); R(c, '#222', 111, 33, 2, 3);
  R(c, '#ece8da', 108, 46, 2, 34); // columna
  for (let k = 0; k < 5; k++) { R(c, '#ece8da', 100, 50 + k * 6, 18, 1); }
  R(c, '#ece8da', 102, 80, 14, 5); // pelvis
  R(c, '#ece8da', 103, 85, 2, 28); R(c, '#ece8da', 113, 85, 2, 28);
  R(c, '#ece8da', 98, 48, 2, 26); R(c, '#ece8da', 118, 48, 2, 26); // brazos
}

function negatoscopio(c, t) {
  R(c, '#7d8a90', 190, 32, 66, 54);
  const brillo = 232 + Math.round(Math.sin(t / 350) * 6);
  R(c, `rgb(${brillo},242,255)`, 193, 35, 60, 48);
  R(c, '#10161c', 197, 39, 52, 40);
  c.fillStyle = '#cfe0ee'; // RX de perro: craneo con hocico, columna, costillas, patas y cola
  c.fillRect(200, 52, 12, 8); c.fillRect(196, 56, 6, 4);
  c.fillRect(212, 55, 32, 2);
  for (let k = 0; k < 5; k++) c.fillRect(216 + k * 5, 57, 1, 8);
  for (const x of [218, 238]) { c.fillRect(x, 60, 2, 14); c.fillRect(x - 2, 74, 6, 2); }
  c.fillRect(244, 50, 4, 2); c.fillRect(246, 46, 2, 5);
}

function ficus(c) {
  c.save();
  c.fillStyle = '#050505'; // hoja casi negra del lado izquierdo
  c.beginPath(); c.ellipse(16, 40, 30, 11, -0.9, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(20, 76, 30, 10, -0.2, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(8, 14, 26, 9, -1.2, 0, Math.PI * 2); c.fill();
  R(c, '#050505', 0, 0, 4, 120);
  c.restore();
}

function escritorio(c) {
  R(c, '#8a5a2f', 0, 124, W, 76);
  R(c, '#a8713c', 0, 124, W, 4);
  R(c, '#6b4220', 0, 128, W, 2);
  // recetario con membrete, lapicera y sello
  R(c, '#f2efe4', 238, 134, 44, 32);
  R(c, '#c0302e', 238, 134, 44, 6);
  R(c, '#fff', 244, 135, 20, 4);
  R(c, '#999', 242, 146, 36, 1); R(c, '#999', 242, 152, 36, 1); R(c, '#999', 242, 158, 30, 1);
  c.strokeStyle = '#1d3a8a'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(262, 170); c.lineTo(292, 150); c.stroke(); c.lineWidth = 1;
  R(c, '#2a2a2a', 214, 174, 102, 22);
  R(c, '#3f3a34', 216, 176, 98, 18);
  c.textAlign = 'center';
  c.font = 'bold 6px monospace';
  c.fillStyle = '#e8d9a0';
  c.fillText('Dr Rubio · MP 007', 265, 184);
  c.font = '5px monospace';
  c.fillText('Médico de las estrellas', 265, 191);
}

function monitor(c, m) {
  R(c, '#b9b4a2', m.x, m.y, m.w, m.h);
  R(c, '#8c8776', m.x, m.y + m.h - 3, m.w, 3);
  R(c, '#0c2a52', m.x + 6, m.y + 6, m.w - 12, m.h - 18);
  R(c, '#b9b4a2', m.x + m.w / 2 - 14, m.y + m.h, 28, 6);
  R(c, '#8c8776', m.x + m.w / 2 - 22, m.y + m.h + 6, 44, 3);
  R(c, '#3fbf5a', m.x + m.w - 10, m.y + m.h - 7, 3, 2);
}

function manos(c) {
  R(c, '#c2bfb2', 100, 168, 120, 10); // teclado
  for (const x of [112, 176]) {
    R(c, '#a0714f', x, 176, 34, 24);
    R(c, '#a0714f', x + 4, 170, 26, 8);
    c.fillStyle = '#150d08';
    for (let k = 0; k < 26; k++) c.fillRect(x + 1 + ((k * 7) % 32), 172 + ((k * 5) % 26), 1, 1);
  }
}

// o: { lado: bool, t, detras(c): dibuja algo entre la pared y el escritorio (el paciente) }
export function sala(c, t = 0, { lado = false, detras } = {}) {
  R(c, '#a9c0ad', 0, 0, W, 124);
  R(c, '#8fa894', 0, 108, W, 16);
  R(c, '#4b3320', 130, 20, 52, 104);
  R(c, '#8c6a43', 134, 24, 44, 100);
  R(c, '#d8c88a', 170, 78, 4, 4);
  esqueleto(c);
  negatoscopio(c, t);
  detras?.(c);
  escritorio(c);
  const m = lado ? MONITOR.lado : MONITOR.centro;
  monitor(c, m);
  if (!lado) manos(c);
  ficus(c);
}

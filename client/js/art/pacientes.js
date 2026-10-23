// Pacientes en estilo caricatura grotesca (a lo Ren & Stimpy): caras enormes, ojos desorbitados y venas.
import { R } from '../pix.js';

const el = (c, col, x, y, rx, ry) => { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); };

const LOOK = {
  armando: { piel: '#e0a67a', pelo: '#3a2a1c', ropa: '#4f7a4a' },
  dolores: { piel: '#ecbf9c', pelo: '#7a3a8a', ropa: '#b04a7a' },
};

// Cara con centro (cx, cy) y escala s (s=1: cabeza de 120 px de ancho). enojo 0-1 aprieta cejas y dientes.
export function cara(c, id, cx, cy, s, enojo = 1, t = 0) {
  const L = LOOK[id] ?? LOOK.armando, A = id === 'armando';
  c.save();
  c.translate(cx, cy);
  c.scale(s, s);
  R(c, L.piel, -22, 50, 44, 70); // cuello
  el(c, L.piel, -62, 4, 11, 17);
  el(c, L.piel, 62, 4, 11, 17);
  el(c, L.piel, 0, 0, 60, 70); // cabeza
  el(c, L.piel, 0, 42, 52, 38); // mandibula pesada
  el(c, 'rgba(150,70,40,0.25)', 0, 70, 40, 8);
  // pelo
  if (A) {
    for (const x of [-46, -30, 30, 46]) el(c, L.pelo, x, -52 + Math.abs(x) / 6, 7, 11); // mechones sobre las orejas
    el(c, L.pelo, -58, -6, 6, 16);
    el(c, L.pelo, 58, -6, 6, 16);
  } else {
    el(c, L.pelo, 0, -52, 66, 30);
    el(c, L.pelo, -58, -24, 14, 34);
    el(c, L.pelo, 58, -24, 14, 34);
    el(c, '#f4f0a0', -58, 12, 3, 3); // aros
    el(c, '#f4f0a0', 58, 12, 3, 3);
  }
  // ojos desorbitados con venas
  for (const sx of [-1, 1]) {
    const ex = sx * 25, ey = -14;
    el(c, '#fff', ex, ey, 18, 21);
    c.strokeStyle = '#d8281e';
    c.lineWidth = 1;
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * Math.PI * 2 + sx;
      c.beginPath();
      c.moveTo(ex + Math.cos(a) * 17, ey + Math.sin(a) * 20);
      c.lineTo(ex + Math.cos(a) * 9, ey + Math.sin(a) * 10);
      c.stroke();
    }
    el(c, '#3a2312', ex - sx * 2, ey + 3, 7, 7);
    el(c, '#000', ex - sx * 2, ey + 3, 3, 3);
    // ceja: con enojo el extremo interno baja
    c.strokeStyle = A ? '#2a1c10' : '#3a1a4a';
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(sx * 46, ey - 26 - enojo * 2);
    c.lineTo(sx * 6, ey - 20 + enojo * 12);
    c.stroke();
  }
  c.lineWidth = 1;
  // nariz grande
  el(c, '#c98a62', 0, 14, 13, 17);
  el(c, '#4a2a1a', -6, 24, 3, 2);
  el(c, '#4a2a1a', 6, 24, 3, 2);
  // boca apretada con dientes
  const bo = 4 + Math.sin(t / 90) * 1.5 * enojo;
  R(c, '#3a0e0e', -26, 44, 52, 12 + bo);
  R(c, '#f6f2e0', -24, 44, 48, 6);
  R(c, '#f6f2e0', -24, 50 + bo, 48, 6);
  c.fillStyle = '#3a0e0e';
  for (let k = -20; k <= 20; k += 8) c.fillRect(k, 44, 1, 12 + bo);
  if (A) { // bigote
    el(c, '#2a1c10', -13, 38, 14, 6);
    el(c, '#2a1c10', 13, 38, 14, 6);
  } else R(c, '#c0304a', -27, 56 + bo, 54, 3); // labial
  // vena de la sien hinchada
  c.strokeStyle = '#7a3a9a';
  c.lineWidth = 2;
  c.beginPath(); c.moveTo(40, -48); c.lineTo(46, -34); c.lineTo(41, -22); c.stroke();
  c.lineWidth = 1;
  c.restore();
}

// Paciente sentado frente al escritorio: la cabeza arriba, el tronco tapado por el escritorio.
export function sentado(c, id, cx, top, t = 0) {
  const L = LOOK[id] ?? LOOK.armando, s = 0.5;
  R(c, '#3a3a44', cx - 36, top + 56, 72, 90); // respaldo de la silla
  R(c, L.ropa, cx - 40, top + 84, 80, 70);
  R(c, 'rgba(0,0,0,0.18)', cx - 40, top + 84, 80, 4);
  if (id === 'armando') {
    // brazo en cabestrillo improvisado con un panuelo
    c.fillStyle = '#f2f2f2';
    c.beginPath(); c.moveTo(cx - 34, top + 84); c.lineTo(cx + 40, top + 84); c.lineTo(cx + 14, top + 140); c.closePath(); c.fill();
    R(c, '#cf3a3a', cx - 6, top + 100, 8, 8);
  } else {
    R(c, '#f2eee0', cx + 20, top + 96, 22, 40); // yeso
  }
  cara(c, id, cx, top + 36, s, 0.6 + Math.sin(t / 700) * 0.1, t);
}

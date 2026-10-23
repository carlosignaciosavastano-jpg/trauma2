// Dibujos de la sala de medicos de la back story 1 (Dr Rubio). Todo por codigo, 320x200.
import { R, W, H } from '../pix.js';
import { drawSprite } from '../sprites.js';

const SKIN = '#a0714f', HAIR = '#1a110b', V = '#7a3fb0';

// Zonas que usa la escena para arrastrar y soltar (vista de frente).
export const ZONA = {
  taza: { x: 56, y: 114, w: 24, h: 22 },
  celular: { x: 230, y: 108, w: 18, h: 28 },
  dr: { x: 108, y: 20, w: 104, h: 104 },
};

function elipse(c, col, x, y, rx, ry) {
  c.fillStyle = col;
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fill();
}

export function fondo(c) {
  R(c, '#6b8f89', 0, 0, W, 112);
  R(c, '#587a74', 0, 98, W, 14);
  R(c, '#6e5a46', 0, 112, W, 88);
  for (let x = 0; x < W; x += 24) R(c, '#5f4e3d', x, 112, 1, 88);
  // ventana con cortina y cartel
  R(c, '#e8e4d4', 20, 18, 74, 54);
  R(c, '#2a3a55', 24, 22, 66, 46);
  R(c, '#9fc4e8', 26, 24, 62, 42);
  R(c, '#e8e4d4', 56, 24, 2, 42);
  R(c, '#e8e4d4', 26, 44, 62, 2);
  R(c, '#e8e4d4', 232, 22, 40, 28);
  R(c, '#c0302e', 236, 26, 32, 3);
  R(c, '#888', 236, 33, 32, 2);
  R(c, '#888', 236, 38, 26, 2);
  // reloj: las 7 de la manana
  elipse(c, '#222', 178, 30, 11, 11);
  elipse(c, '#f4f0e4', 178, 30, 9, 9);
  R(c, '#222', 178, 23, 1, 7);
  R(c, '#222', 178, 30, 5, 1);
}

export function escritorio(c) {
  R(c, '#6b4220', 24, 134, 252, 66);
  R(c, '#a8713c', 20, 126, 260, 10);
  R(c, '#8a5a30', 20, 136, 260, 2);
  R(c, '#5a3618', 40, 142, 100, 40);
  R(c, '#5a3618', 160, 142, 100, 40);
}

export function taza(c, x, y, t = 0, llena = true) {
  R(c, '#f2f2f2', x, y, 14, 12);
  R(c, '#cfcfcf', x + 2, y + 10, 10, 2);
  R(c, '#f2f2f2', x + 14, y + 2, 4, 2);
  R(c, '#f2f2f2', x + 16, y + 2, 2, 6);
  R(c, '#f2f2f2', x + 14, y + 6, 4, 2);
  if (llena) {
    R(c, '#3a1e0e', x + 1, y + 1, 12, 3);
    for (let i = 0; i < 3; i++) R(c, 'rgba(255,255,255,0.55)', x + 3 + i * 4, y - 4 - ((t / 90 + i * 5) % 12), 2, 3);
  }
}

export function celular(c, x, y, vibra = 0) {
  const dx = vibra ? Math.round(Math.sin(vibra / 30)) : 0;
  R(c, '#111', x + dx, y, 12, 20);
  R(c, '#2e6fb8', x + 1 + dx, y + 2, 10, 14);
  R(c, '#9fd0ff', x + 2 + dx, y + 4, 8, 1);
  R(c, '#9fd0ff', x + 2 + dx, y + 7, 6, 1);
  R(c, '#555', x + 5 + dx, y + 17, 2, 1);
}

// Toma lateral: el Dr duerme sobre el escritorio; taza a la izquierda, celular a la derecha.
export function lateral(c, t) {
  fondo(c);
  R(c, '#6b4220', 44, 132, 232, 68);
  R(c, '#a8713c', 40, 124, 240, 10);
  // silla y torso doblado sobre el escritorio
  R(c, '#2a2a30', 215, 120, 8, 60);
  R(c, '#2a2a30', 205, 100, 24, 8);
  R(c, V, 168, 78, 52, 46);
  R(c, '#5d2d8a', 168, 118, 52, 6);
  // brazos cruzados sobre la mesa y cabeza apoyada de perfil
  R(c, V, 110, 106, 64, 16);
  R(c, SKIN, 104, 106, 8, 14);
  elipse(c, SKIN, 138, 100, 20, 14);
  R(c, HAIR, 120, 84, 38, 10);
  R(c, HAIR, 116, 90, 8, 14);
  R(c, '#000', 128, 98, 8, 2); // ojo cerrado
  R(c, '#7d5538', 120, 104, 5, 4); // nariz
  // "Zzz" que sube
  c.font = 'bold 10px monospace';
  c.textAlign = 'left';
  c.fillStyle = '#fff';
  for (let i = 0; i < 3; i++) {
    const k = (t / 500 + i) % 3;
    c.globalAlpha = 1 - k / 3;
    c.fillText('z', 148 + i * 8 + k * 6, 76 - i * 8 - k * 8);
  }
  c.globalAlpha = 1;
  taza(c, 66, 112, t);
  celular(c, 250, 106, (t % 1500) < 400 ? t : 0);
}

// Vista de frente: el Dr (sprite al doble) detras del escritorio, con la taza y el celular encima.
export function frente(c, t, { taza: tz = true, celular: cl = true } = {}) {
  fondo(c);
  c.save();
  c.scale(2, 2);
  drawSprite(c, 'rubio', 80, 76);
  c.restore();
  escritorio(c);
  if (tz) taza(c, 62, 118, t);
  if (cl) celular(c, 233, 112, 0);
}

// Vista de espalda: el Dr sentado, de espaldas, frente al escritorio.
export function espalda(c, t, { celular: cl = true } = {}) {
  fondo(c);
  R(c, '#6b4220', 24, 110, 252, 30);
  R(c, '#a8713c', 20, 104, 260, 8);
  taza(c, 62, 92, 0, false);
  if (cl) celular(c, 233, 86, 0);
  // silla, espalda y cabeza de atras
  R(c, '#222', 112, 128, 96, 72);
  R(c, '#2e2e36', 118, 130, 84, 64);
  R(c, V, 124, 96, 72, 72);
  R(c, '#5d2d8a', 158, 98, 2, 70);
  R(c, SKIN, 150, 86, 20, 12);
  elipse(c, HAIR, 160, 72, 24, 22);
  R(c, SKIN, 134, 70, 5, 10);
  R(c, SKIN, 181, 70, 5, 10);
}

// Primer plano de la cara, rasgos toscos de cavernicola: ojos enormes inyectados en sangre.
// o: { venas 0-1, sorpresa bool }
export function cara(c, o = {}) {
  const v = o.venas ?? 0, sorp = !!o.sorpresa;
  R(c, '#2b2b33', 0, 0, W, H);
  R(c, '#3b3b46', 0, 150, W, 50);
  R(c, SKIN, 98, 150, 64, 50); // cuello
  elipse(c, SKIN, 85, 100, 12, 20); // orejas
  elipse(c, SKIN, 175, 100, 12, 20);
  elipse(c, '#8d6244', 85, 100, 6, 12);
  elipse(c, '#8d6244', 175, 100, 6, 12);
  elipse(c, SKIN, 130, 98, 56, 76); // cabeza
  elipse(c, '#8d6244', 130, 138, 50, 36); // mandibula marcada
  elipse(c, SKIN, 130, 136, 46, 30);
  elipse(c, HAIR, 130, 36, 52, 16); // pelo
  R(c, HAIR, 80, 36, 100, 14);
  // ceja pesada, una sola, y arco superciliar
  R(c, '#2a1a10', 86, 62, 88, 9);
  R(c, '#7d5538', 88, 71, 84, 4);
  const ry = sorp ? 15 : 12, pr = sorp ? 2 : 4;
  for (const ex of [108, 152]) {
    elipse(c, '#f6f0ec', ex, 86, 18, ry);
    c.strokeStyle = '#d8281e'; // venas de los ojos
    c.lineWidth = 1;
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * Math.PI * 2;
      c.beginPath();
      c.moveTo(ex + Math.cos(a) * 17, 86 + Math.sin(a) * (ry - 1));
      c.lineTo(ex + Math.cos(a) * 8, 86 + Math.sin(a) * 6);
      c.stroke();
    }
    elipse(c, '#3a2312', ex, 86, 6, 6);
    elipse(c, '#000', ex, 86, pr, pr);
    R(c, '#fff', ex - 2, 83, 2, 2);
  }
  elipse(c, '#6a4630', 130, 112, 14, 11); // nariz
  elipse(c, '#2a1a10', 124, 116, 3, 2);
  elipse(c, '#2a1a10', 136, 116, 3, 2);
  if (sorp) elipse(c, '#2a0e0e', 130, 146, 10, 12);
  else {
    R(c, '#2a0e0e', 108, 144, 44, 4);
    R(c, '#c98a7a', 114, 148, 32, 5);
  }
  c.fillStyle = 'rgba(30,20,10,0.5)'; // barba de varios dias
  for (let i = 0; i < 70; i++) c.fillRect(100 + ((i * 37) % 60), 150 + ((i * 23) % 22), 1, 1);
  // venas hinchadas del cuello y de la frente
  c.strokeStyle = '#5a3a8c';
  c.lineWidth = 1 + Math.round(v * 2);
  for (const [x0, y0, x1, y1] of [[110, 190, 118, 160], [150, 190, 142, 160], [118, 56, 124, 44], [142, 56, 136, 44]]) {
    c.beginPath();
    c.moveTo(x0, y0);
    c.lineTo(x0 + (x1 - x0) * v, y0 + (y1 - y0) * v);
    c.stroke();
  }
  c.lineWidth = 1;
}

// Silueta femenina con sobrepeso sobre el hombro del Dr.
export function sombra(c) {
  c.fillStyle = '#0c0c12';
  c.beginPath();
  c.ellipse(262, 168, 52, 46, 0, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.ellipse(262, 100, 20, 24, 0, 0, Math.PI * 2);
  c.fill();
  R(c, '#0c0c12', 248, 118, 28, 20);
}

export function globo(c, x, y, w, h) {
  R(c, '#000', x - 1, y - 1, w + 2, h + 2);
  R(c, '#fff', x, y, w, h);
  R(c, '#fff', x + 14, y + h, 6, 6);
}

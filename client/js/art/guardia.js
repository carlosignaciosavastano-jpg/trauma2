// Sala de espera de la guardia: cuatro pacientes y el Dr visto de espaldas.
import { R, W, H } from '../pix.js';

const elipse = (c, col, x, y, rx, ry) => {
  c.fillStyle = col;
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fill();
};

function etiqueta(c, texto, x, y) {
  c.font = 'bold 6px monospace';
  c.textAlign = 'center';
  const w = c.measureText(texto).width + 6;
  R(c, '#000', x - w / 2, y - 7, w, 9);
  c.fillStyle = '#ffd23f';
  c.fillText(texto, x, y);
}

function sentado(c, x, y, camisa, piel) {
  R(c, '#3a3a44', x - 7, y + 14, 14, 10); // piernas
  R(c, '#222', x - 8, y + 22, 7, 3);
  R(c, '#222', x + 1, y + 22, 7, 3);
  R(c, camisa, x - 8, y - 2, 16, 18); // torso
  elipse(c, piel, x, y - 8, 7, 8); // cabeza
}

const laescalera = (c, x, y) => {
  sentado(c, x, y, '#3f6fb0', '#e0b090');
  R(c, '#8a8a8a', x - 8, y - 15, 3, 7); // pelo gris a los costados
  R(c, '#8a8a8a', x + 5, y - 15, 3, 7);
  R(c, '#000', x - 3, y - 4, 6, 1); // mueca
  R(c, '#e0b090', x + 6, y + 2, 9, 4); // brazo sostenido
  R(c, '#fff', x + 5, y + 1, 7, 6); // panuelo
  R(c, '#c0302e', x + 7, y + 3, 2, 2);
  R(c, '#fff', x - 6, y + 4, 10, 3); // nudo del panuelo al cuello
};

const dedalos = (c, x, y) => {
  sentado(c, x, y, '#d070a0', '#f0c8a8');
  R(c, '#ccc', x - 7, y - 16, 14, 5); // pelo canoso con rodete
  R(c, '#ccc', x - 3, y - 19, 6, 4);
  R(c, '#222', x - 5, y - 9, 4, 3); // anteojos
  R(c, '#222', x + 1, y - 9, 4, 3);
  R(c, '#fff', x + 7, y - 14, 8, 14); // yeso
  for (let i = 0; i < 4; i++) { // dedos hinchados como salchichas
    R(c, '#e08a8a', x + 7 + i * 2, y - 22, 2, 8);
    R(c, '#c05a5a', x + 7 + i * 2, y - 22, 2, 1);
  }
};

const tirado = (c, x, y) => {
  R(c, '#6a8a4a', x - 20, y, 30, 9); // cuerpo en el piso
  elipse(c, '#e0b090', x - 24, y + 4, 6, 6);
  R(c, '#000', x - 27, y + 3, 2, 1);
  R(c, '#3a3a44', x + 10, y, 14, 7); // pierna estirada por el tercero
  R(c, '#222', x + 24, y - 6, 4, 8);
  // el tercero, de pie, elongando
  R(c, '#d0a030', x + 30, y - 22, 10, 18);
  elipse(c, '#e0b090', x + 35, y - 28, 5, 6);
  R(c, '#e0b090', x + 26, y - 14, 6, 3);
  R(c, '#222', x + 31, y - 4, 4, 12);
  R(c, '#222', x + 37, y - 4, 4, 12);
};

const leonel = (c, x, y) => {
  R(c, '#222', x - 5, y + 18, 4, 14); // piernas y medias
  R(c, '#fff', x - 5, y + 24, 4, 8);
  R(c, '#222', x + 1, y + 18, 4, 14);
  R(c, '#fff', x + 1, y + 24, 4, 8);
  elipse(c, '#a04a6a', x + 3, y + 22, 8, 7); // rodilla del triple de tamano
  R(c, '#222', x - 7, y + 10, 14, 8); // short
  for (let i = 0; i < 4; i++) R(c, i % 2 ? '#fff' : '#74acdf', x - 7 + i * 4, y - 4, 4, 14); // camiseta a rayas
  elipse(c, '#e0b090', x, y - 10, 6, 7);
  R(c, '#2a1a10', x - 7, y - 18, 14, 6);
  R(c, '#000', x - 3, y - 6, 6, 1);
};

// dt en ms: el parpadeo de la luz y el temblor dan clima de terror.
export function sala(c, dt) {
  R(c, '#8fa89a', 0, 0, W, 112);
  R(c, '#6f8a7c', 0, 96, W, 16);
  R(c, '#7a7064', 0, 112, W, 88);
  for (let x = 0; x < W; x += 20) R(c, '#6a6054', x, 112, 1, 88);
  R(c, '#fff', 120, 12, 80, 18);
  R(c, '#d02020', 124, 15, 8, 12);
  R(c, '#d02020', 122, 19, 12, 4);
  c.font = 'bold 12px monospace';
  c.textAlign = 'center';
  c.fillStyle = '#222';
  c.fillText('GUARDIA', 168, 26);
  R(c, '#4a3a2c', 20, 100, 280, 8); // banco corrido
  R(c, '#4a3a2c', 24, 108, 4, 16);
  R(c, '#4a3a2c', 292, 108, 4, 16);

  laescalera(c, 64, 82);
  dedalos(c, 124, 84);
  tirado(c, 196, 132);
  leonel(c, 266, 76);
  etiqueta(c, 'Laescalera Armando', 64, 62);
  etiqueta(c, 'Dedalos Dolores', 124, 52);
  etiqueta(c, 'Tirado JuanMarcos', 200, 112);
  etiqueta(c, 'Leonel Armando Mise', 262, 52);

  // el Dr de espaldas, pelo desordenado
  R(c, '#7a3fb0', 128, 176, 64, 24);
  R(c, '#a0714f', 152, 168, 16, 10);
  elipse(c, '#1a110b', 160, 160, 20, 18);
  for (const [dx, dy, w, h] of [[-14, -20, 3, 8], [-6, -22, 3, 9], [2, -21, 3, 8], [10, -19, 3, 7], [-18, -10, 6, 3], [14, -10, 6, 3]]) R(c, '#1a110b', 160 + dx, 160 + dy, w, h);
  R(c, '#a0714f', 138, 156, 5, 9);
  R(c, '#a0714f', 177, 156, 5, 9);

  // viñeta y parpadeo
  const flick = Math.sin(dt / 90) > 0.85 ? 0.35 : 0.12;
  R(c, `rgba(40,0,0,${flick + 0.2})`, 0, 0, W, H);
  c.fillStyle = 'rgba(0,0,0,0.5)';
  for (let k = 0; k < 6; k++) c.fillRect(0, k * 4, W, 2 + k);
  for (let k = 0; k < 6; k++) c.fillRect(0, H - k * 4 - 2 - k, W, 2 + k);
}

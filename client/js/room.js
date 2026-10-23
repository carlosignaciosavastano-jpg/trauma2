import { R, W, H } from './pix.js';

const basin = (c, x, y, w) => {
  c.fillStyle = '#aab0ae';
  c.beginPath(); c.ellipse(x, y, w / 2, 6, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#5a1818';
  c.beginPath(); c.ellipse(x, y + 1, w / 2 - 3, 4, 0, 0, Math.PI * 2); c.fill();
  R(c, '#e8e4dc', x - 8, y - 4, 10, 4);
  R(c, '#e8e4dc', x + 2, y - 3, 8, 4);
  R(c, '#a31515', x - 5, y - 3, 3, 2);
  R(c, '#a31515', x + 4, y - 2, 3, 2);
};

const gauze = (c, x, y) => {
  R(c, '#e9e4d8', x, y, 9, 5);
  R(c, '#a31515', x + 2, y + 1, 3, 2);
};

// Quirofano desordenado. lit=false: lampara apagada (todo oscurecido).
export function drawRoom(c, lit) {
  // pared de azulejos, con manchas
  R(c, '#3d6f69', 0, 0, W, 122);
  for (let y = 0; y < 122; y += 10) R(c, '#2f5a55', 0, y, W, 1);
  for (let x = 0; x < W; x += 10) R(c, '#2f5a55', x, 0, 1, 122);
  R(c, '#6b4a2f', 20, 30, 10, 10);
  R(c, '#222', 150, 70, 10, 10);
  R(c, '#7a2a2a', 40, 90, 10, 20);
  R(c, '#25403d', 0, 118, W, 4);

  // piso damero sucio
  for (let y = 122; y < H; y += 13)
    for (let x = 0; x < W; x += 20)
      R(c, (x / 20 + (y - 122) / 13) & 1 ? '#77756c' : '#5d5b54', x, y, 20, 13);

  // puerta de la derecha: pasillo claro, hoja entreabierta y el abogado a contraluz
  R(c, '#2a2a2a', 256, 32, 60, 122);
  R(c, '#c8c39a', 260, 38, 52, 114);
  R(c, '#4a3a2a', 260, 38, 8, 114);
  R(c, '#5a4a42', 283, 60, 10, 11);
  R(c, '#15151f', 277, 71, 22, 60);
  R(c, '#15151f', 280, 131, 7, 21);
  R(c, '#15151f', 289, 131, 7, 21);
  R(c, '#7a1c1c', 287, 72, 2, 14);
  R(c, '#15151f', 299, 76, 4, 14);
  R(c, '#f2eedd', 299, 88, 10, 13);
  R(c, '#999', 301, 91, 6, 1);
  R(c, '#999', 301, 94, 6, 1);
  R(c, '#b02020', 304, 97, 3, 3);

  // camilla Finochietto vacia: tabla, columna central y base, sabana a medio caer
  R(c, '#4a7f9f', 94, 104, 132, 4);
  R(c, '#c9ccc8', 90, 108, 140, 8);
  R(c, '#8a8d8a', 90, 116, 140, 3);
  R(c, '#9a9d9a', 152, 119, 16, 26);
  R(c, '#7d807d', 128, 145, 64, 5);
  R(c, '#8fc6a3', 200, 112, 28, 22);
  R(c, '#8fc6a3', 212, 134, 10, 8);
  R(c, '#8a1c1c', 206, 118, 8, 6);

  // atril de suero tirado
  c.save();
  c.translate(30, 150);
  c.rotate(-1.2);
  R(c, '#aaa', 0, 0, 2, 40);
  R(c, '#aaa', -6, 0, 14, 2);
  R(c, '#d8d8c8', -3, 3, 6, 10);
  c.restore();

  // lebrillos con gasas y compresas, mas manchas y gasas sueltas por el piso
  c.fillStyle = '#6d1010';
  for (const [x, y, rx] of [[60, 176, 14], [200, 168, 10], [250, 186, 12]]) {
    c.beginPath(); c.ellipse(x, y, rx, 4, 0, 0, Math.PI * 2); c.fill();
  }
  basin(c, 40, 172, 36);
  basin(c, 215, 180, 40);
  basin(c, 110, 188, 30);
  basin(c, 285, 166, 28);
  for (const [x, y] of [[75, 160], [140, 175], [170, 160], [240, 170], [8, 188], [180, 190]]) gauze(c, x, y);

  // lampara quirurgica de techo
  R(c, '#444', 158, 0, 4, 14);
  R(c, '#555', 140, 14, 40, 3);
  R(c, '#777', 126, 17, 68, 6);
  const bulb = lit ? '#fffbe0' : '#555a5a';
  for (let x = 132; x < 190; x += 12) R(c, bulb, x, 23, 8, 4);

  if (lit) {
    const g = c.createLinearGradient(0, 27, 0, 150);
    g.addColorStop(0, 'rgba(255,250,200,0.55)');
    g.addColorStop(1, 'rgba(255,250,200,0.05)');
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(134, 27); c.lineTo(186, 27); c.lineTo(260, 150); c.lineTo(60, 150);
    c.closePath();
    c.fill();
  } else {
    R(c, 'rgba(0,0,12,0.65)', 0, 0, W, H);
  }
}

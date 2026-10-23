import { R } from './pix.js';

const COAT = '#f2f2f2';

// Cuerpo comun: sombra, piernas, torso, bata opcional, brazos con mano, cuello y cabeza.
// o: { h, tw, nw, skin, top, pants, coat, hair, face(), hand() }
function body(c, cx, by, o) {
  const top = by - o.h;
  const hw = Math.round(o.h * 0.2), hh = Math.round(o.h * 0.22);
  const ty = top + hh + 2, th = Math.round(o.h * 0.36), ly = ty + th;
  const tx = cx - Math.round(o.tw / 2), lw = Math.round(o.tw * 0.4);
  const coatLen = th + Math.round(o.h * 0.12);

  R(c, 'rgba(0,0,0,0.3)', cx - 16, by - 1, 32, 3);
  for (const lx of [cx - lw - 1, cx + 1]) {
    R(c, o.pants, lx, ly, lw, by - ly - 3);
    R(c, '#1c1c1c', lx - 1, by - 3, lw + 2, 3);
  }
  R(c, o.top, tx, ty, o.tw, th);
  if (o.coat) {
    R(c, COAT, tx - 1, ty, o.tw + 2, coatLen);
    R(c, o.top, cx - 2, ty + 1, 4, coatLen - 2);
    R(c, '#c8c8c8', cx - 2, ty + 1, 1, coatLen - 2);
  }

  const al = Math.round(th * 0.95), sleeve = o.coat ? al : Math.round(al * 0.4);
  for (const ax of [tx - 3, tx + o.tw]) {
    R(c, o.coat ? COAT : o.top, ax, ty + 1, 3, sleeve);
    if (!o.coat) R(c, o.skin, ax, ty + 1 + sleeve, 3, al - sleeve);
    o.hand(c, ax + 1, ty + 1 + al, o);
  }

  R(c, o.skin, cx - Math.round((o.nw || 5) / 2), top + hh, o.nw || 5, 3);
  R(c, o.skin, cx - Math.round(hw / 2), top, hw, hh);
  o.face(c, cx, top, hw, hh, o, { ty, th });
}

const handBasic = (c, x, y, o) => R(c, o.skin, x - 1, y, 3, 4);
const handStrong = (c, x, y, o) => {
  R(c, o.skin, x - 2, y, 4, 5);
  R(c, 'rgba(0,0,0,0.2)', x - 2, y + 1, 4, 1);
};
// dedos ridiculamente largos
const handLong = (c, x, y, o) => {
  R(c, o.skin, x - 2, y, 5, 3);
  for (let i = 0; i < 5; i += 2) R(c, o.skin, x - 2 + i, y + 3, 1, 7);
};
// manos y antebrazos muy pelludos
const handHairy = (c, x, y, o) => {
  R(c, o.skin, x - 2, y, 4, 5);
  for (let k = 0; k < 6; k++) R(c, '#150d08', x - 1 + (k % 2) * 2, y - 2 * k + 1, 1, 1);
  for (let k = 0; k < 4; k++) R(c, '#150d08', x - 2 + (k % 2) * 3, y + k, 1, 1);
};

const eyes = (c, hx, hw, y, col) => {
  R(c, col, hx + 2, y, 2, 2);
  R(c, col, hx + hw - 4, y, 2, 2);
};

// Rasgos exagerados de caricatura: frente baja, ceja pesada, mandibula y orejas grandes.
function faceRubio(c, cx, t, hw, hh, o) {
  const hx = cx - Math.round(hw / 2);
  R(c, o.skin, hx - 1, t + hh * 0.5, hw + 2, hh * 0.5);
  R(c, o.skin, hx - 3, t + 5, 2, 5);
  R(c, o.skin, hx + hw + 1, t + 5, 2, 5);
  R(c, o.hair, hx, t, hw, 3);
  R(c, o.hair, hx - 1, t + 2, 1, 6);
  R(c, o.hair, hx + hw, t + 2, 1, 6);
  R(c, '#150d08', hx, t + 5, hw, 2);
  eyes(c, hx, hw, t + 8, '#000');
  R(c, '#7d5538', cx - 1, t + 10, 3, 3);
  R(c, '#3a1a12', cx - 3, t + hh - 3, 6, 1);
}

// Ojos grandes, frente amplia: linea de pelo italiana con entradas.
function faceLince(c, cx, t, hw, hh, o) {
  const hx = cx - Math.round(hw / 2);
  R(c, o.hair, hx + 3, t, hw - 6, 2);
  R(c, o.hair, cx - 1, t + 2, 2, 2);
  R(c, o.hair, hx - 1, t + 4, 2, 5);
  R(c, o.hair, hx + hw - 1, t + 4, 2, 5);
  for (const ex of [hx + 1, hx + hw - 5]) {
    R(c, '#222', ex, t + 7, 4, 1);
    R(c, '#fff', ex, t + 8, 4, 4);
    R(c, '#3a2616', ex + 1, t + 9, 2, 2);
  }
  R(c, '#d9a98a', cx, t + 11, 1, 3);
  R(c, '#8a4a3a', cx - 2, t + hh - 3, 4, 1);
}

function faceKline(c, cx, t, hw, hh, o) {
  const hx = cx - Math.round(hw / 2);
  R(c, o.hair, hx, t, hw, 4);
  R(c, o.hair, hx - 1, t + 2, 1, 5);
  R(c, o.hair, hx + hw, t + 2, 1, 5);
  eyes(c, hx, hw, t + 8, '#6fa0d8');
  R(c, '#e3b08e', cx, t + 10, 1, 3);
  R(c, '#a85a4a', cx - 2, t + hh - 7, 4, 1);
  // barba rala: pixeles sueltos en el menton
  for (let i = 0; i < hw; i += 2)
    for (let j = 0; j < 4; j++) if ((i + j) % 3 === 0) R(c, '#d8bf64', hx + i, t + hh - 5 + j, 1, 1);
}

function faceHart(c, cx, t, hw, hh, o) {
  const hx = cx - Math.round(hw / 2);
  R(c, o.hair, hx - 1, t - 1, hw + 2, 5);
  R(c, o.hair, hx - 1, t + 3, 2, 4);
  R(c, o.hair, hx + hw - 1, t + 3, 2, 4);
  eyes(c, hx, hw, t + 8, '#2e9b4a');
  R(c, '#c0504a', cx - 2, t + hh - 4, 4, 1);
  // trenza peliroja al costado, hasta la cintura
  for (let k = 0; k < 7; k++) R(c, k % 2 ? '#b8401f' : '#8f2f14', cx + Math.round(hw / 2), t + hh - 2 + k * 3, 3, 3);
}

const V = '#7a3fb0', B = '#2f5fb0', RED = '#c0302e';

// Alturas distintas a proposito: Kline es el mas alto.
export const SPRITES = {
  rubio: { h: 66, tw: 28, nw: 7, skin: '#a0714f', top: V, pants: V, hair: '#1a110b', coat: false, face: faceRubio, hand: handHairy },
  lince: { h: 72, tw: 20, skin: '#f1c9a5', top: B, pants: B, hair: '#3a2616', coat: true, face: faceLince, hand: handStrong },
  kline: { h: 84, tw: 22, skin: '#f4d9c2', top: '#8fb0d0', pants: '#3a3a44', hair: '#e6cd6a', coat: true, face: faceKline, hand: handLong },
  hart: { h: 68, tw: 19, skin: '#f6dcc6', top: RED, pants: RED, hair: '#b8401f', coat: true, face: faceHart, hand: handBasic },
};

export const drawSprite = (c, id, cx, by) => body(c, cx, by, SPRITES[id]);

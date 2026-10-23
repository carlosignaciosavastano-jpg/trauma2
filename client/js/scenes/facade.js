import { R, W, mk } from '../pix.js';
import { SPRITES, drawSprite } from '../sprites.js';
import { player } from '../player.js';
import { NAMES } from '../game/characters.js';
import { resetGame } from '../game/state.js';

const IDS = Object.keys(SPRITES);
const XS = [55, 125, 195, 265];
const BASE = 168; // pies de los personajes; los nombres van debajo

export function drawFacade(c) {
  const sky = ['#4d7fc4', '#5a8bd0', '#6a9bd8', '#7aa9de', '#8bb6e4', '#9cc2ea', '#aecdee'];
  R(c, sky[6], 0, 0, W, 152);
  sky.forEach((col, i) => R(c, col, 0, i * 14, W, 14));

  // edificio, techo y ventanas (las del centro quedan libres para el acceso)
  R(c, '#cdbf9a', 16, 36, 288, 116);
  R(c, '#8a7e66', 10, 30, 300, 8);
  for (const y of [46, 74, 104])
    for (let x = 24; x < 290; x += 36) {
      if (x + 18 > 120 && x < 200) continue;
      R(c, '#e8e4d4', x - 1, y - 1, 20, 18);
      R(c, (x + y) % 3 ? '#4a6a8a' : '#e8d070', x, y, 18, 16);
      R(c, 'rgba(255,255,255,0.35)', x + 2, y + 2, 5, 2);
    }

  // cartel, cruz roja, marquesina y puerta de vidrio
  R(c, '#d02020', 157, 38, 6, 14);
  R(c, '#d02020', 153, 42, 14, 6);
  R(c, '#222', 117, 57, 86, 24);
  R(c, '#fff', 118, 58, 84, 22);
  c.font = 'bold 14px monospace';
  c.textAlign = 'center';
  c.fillStyle = '#222';
  c.fillText('HOSPITAL', 160, 74);
  R(c, '#a02c2c', 122, 92, 76, 8);
  R(c, '#2a3a4a', 140, 104, 40, 48);
  R(c, '#8aa0b4', 159, 104, 2, 48);
  R(c, '#9a968a', 130, 148, 60, 4);

  // vereda
  R(c, '#8d8b84', 0, 152, W, 48);
  R(c, '#767468', 0, 168, W, 1);
  for (let x = 0; x < W; x += 40) R(c, '#767468', x, 152, 1, 16);
}


export default {
  enter(_ctx, go) {
    this.go = go;
    this.bg = mk();
    drawFacade(this.bg.getContext('2d'));
    this.hover = -1;
  },

  hit(x, y) {
    return IDS.findIndex((id, i) => Math.abs(x - XS[i]) < 16 && y > BASE - SPRITES[id].h && y < BASE + 14);
  },

  move(x, y) {
    this.hover = this.hit(x, y);
  },

  // Elegir personaje no cambia el curso del juego: arranca la historia general y despues la back story.
  click(x, y) {
    const i = this.hit(x, y);
    if (i < 0) return;
    const id = IDS[i];
    resetGame(id, player.name);
    // El servidor solo guarda quien es el jugador; si no hay servidor (pagina publicada) se ignora.
    fetch('/api/game/character', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, name: player.name }),
    }).catch(() => {});
    this.go('historia');
  },

  draw(ctx) {
    ctx.drawImage(this.bg, 0, 0);
    ctx.textAlign = 'center';
    IDS.forEach((id, i) => {
      drawSprite(ctx, id, XS[i], BASE);

      // nombre debajo del personaje, con contorno para que se lea sobre la vereda
      const on = i === this.hover;
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#000';
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) ctx.fillText(NAMES[id], XS[i] + dx, BASE + 11 + dy);
      ctx.fillStyle = on ? '#ffd23f' : '#fff';
      ctx.fillText(NAMES[id], XS[i], BASE + 11);

      if (on) {
        const top = BASE - SPRITES[id].h;
        R(ctx, '#ffd23f', XS[i] - 14, BASE + 1, 28, 2);
        R(ctx, '#ffd23f', XS[i] - 3, top - 8, 7, 1);
        R(ctx, '#ffd23f', XS[i] - 2, top - 7, 5, 1);
        R(ctx, '#ffd23f', XS[i] - 1, top - 6, 3, 1);
      }
    });

    R(ctx, '#000', 0, 184, W, 16);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffd23f';
    ctx.fillText('ELEGÍ A TU MÉDICO DE GUARDIA', 160, 196);
  },
};

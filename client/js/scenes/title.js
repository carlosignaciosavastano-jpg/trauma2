import { mk, blur } from '../pix.js';
import { drawRoom } from '../room.js';
import * as audio from '../audio.js';

export default {
  enter(_ctx, go) {
    this.go = go;
    // [apagada, prendida]: se dibujan y desenfocan una sola vez
    this.bg = [false, true].map((lit) => {
      const c = mk();
      drawRoom(c.getContext('2d'), lit);
      return blur(c);
    });
    this.lit = true;
    this.burst = 0;
    this.next = 0;
  },

  draw(ctx, t) {
    // lampara: prendida un rato, despues una rafaga de parpadeos (cantidad par: termina prendida)
    if (!this.next) this.next = t + 1500;
    if (t >= this.next) {
      if (!this.burst) this.burst = 2 * (1 + Math.floor(Math.random() * 3));
      this.lit = !this.lit;
      this.burst--;
      this.next = t + (this.burst ? 40 + Math.random() * 100 : 800 + Math.random() * 2500);
    }
    audio.buzz(this.lit);
    ctx.drawImage(this.bg[+this.lit], 0, 0);

    ctx.textAlign = 'center';
    ctx.font = 'bold 30px monospace';
    ctx.fillStyle = '#000';
    for (const [dx, dy] of [[2, 2], [-1, 0], [1, 0], [0, -1], [0, 1]]) ctx.fillText('TRAUMADO2', 160 + dx, 52 + dy);
    ctx.fillStyle = '#d02020';
    ctx.fillText('TRAUMADO2', 160, 52);

    if (Math.floor(t / 500) % 2) {
      ctx.font = '10px monospace';
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(audio.on() ? 'CLICK PARA JUGAR' : 'CLICK PARA ACTIVAR EL SONIDO', 160, 192);
    }
  },

  // Primer click activa el audio (exigencia del navegador), el segundo avanza.
  click() {
    if (!audio.on()) return audio.start();
    audio.buzz(false);
    this.go('facade');
  },
};

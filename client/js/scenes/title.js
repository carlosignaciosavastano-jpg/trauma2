import { mk, blur } from '../pix.js';
import { drawRoom } from '../room.js';
import * as audio from '../audio.js';
import { player } from '../player.js';

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

    // Campo de nombre + boton OK (HTML sobre el canvas). Sin validacion: el nombre es libre.
    this.input = document.getElementById('name');
    this.ok = document.getElementById('ok');
    this.input.hidden = this.ok.hidden = false;
    this.input.value = player.name;
    this.input.onkeydown = (e) => e.key === 'Enter' && this.submit();
    this.ok.onclick = () => this.submit();
    this.input.focus();
  },

  // OK o Enter: guarda el nombre y pasa a la seleccion de personaje (el gesto tambien habilita el audio).
  submit() {
    player.name = this.input.value.trim();
    this.input.hidden = this.ok.hidden = true;
    audio.start();
    audio.buzz(false);
    this.go('facade');
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

    if (!audio.on() && Math.floor(t / 500) % 2) {
      ctx.font = '10px monospace';
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText('CLICK EN LA PANTALLA PARA ACTIVAR EL SONIDO', 160, 192);
    }
  },

  // Click en el fondo: solo activa el audio (el navegador lo exige). Para avanzar: OK o Enter.
  click() {
    audio.start();
  },
};

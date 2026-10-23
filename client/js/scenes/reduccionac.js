// Puzzle de la luxacion acromio-clavicular: sobre la RX, bajar la clavicula hasta el acromion.
import { rxAC, RX_AC, aCanvas } from '../art/cuerpo.js';
import { activar, resolver } from '../game/state.js';
import { terminarPuzzle } from '../game/caso.js';
import { giro, girar, encaja, distSegmento } from '../game/pieza.js';
import { caption } from '../ui.js';
import * as audio from '../audio.js';

const PIVOTE = aCanvas(RX_AC.pivote), PUNTA = aCanvas(RX_AC.punta), DESTINO = aCanvas(RX_AC.destino);
const ROT_OK = giro(PIVOTE, PUNTA, DESTINO, -1, 1); // giro exacto que apoya la clavicula en el acromion

export default {
  enter(_c, go) {
    this.go = go;
    this.rot = 0;
    this.agarre = false;
    this.listo = null;
    this.fin = false;
    this.t = 0;
    activar('reduccion');
  },

  down(x, y) {
    if (this.listo !== null) return;
    const punta = girar(PIVOTE, PUNTA, this.rot);
    if (distSegmento({ x, y }, PIVOTE, punta) <= 14) this.agarre = true;
  },

  move(x, y) {
    if (this.agarre) this.rot = giro(PIVOTE, PUNTA, { x, y }, -0.05, 0.5);
  },

  up() {
    if (!this.agarre) return;
    this.agarre = false;
    if (!encaja(girar(PIVOTE, PUNTA, this.rot), DESTINO, 9)) return;
    this.rot = ROT_OK;
    resolver('reduccion');
    audio.triumph();
    this.listo = this.t;
  },

  draw(ctx, t) {
    this.t = t;
    rxAC(ctx, this.rot);
    if (this.listo !== null) {
      caption(ctx, 'Reducción lograda.', 'Dr', 170);
      if (t - this.listo > 1600 && !this.fin) { this.fin = true; this.go(...terminarPuzzle()); }
    } else caption(ctx, 'RX: luxación acromio-clavicular. La clavícula no está en su lugar.', null, 176);
  },
};

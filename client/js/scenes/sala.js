// Back story 1, sala de medicos: lateral -> frente (puzzle 1: el cafe) -> primer plano -> espalda
// (puzzle 2: el celular al lugar del margen derecho).
import * as art from '../art/sala.js';
import { game, resolver } from '../game/state.js';
import { Typer, caption, inRect, mouse } from '../ui.js';
import { decir, tunck } from '../hud.js';
import * as audio from '../audio.js';

const TEXTO = 'Un día difícil para un R1, toda la noche despierto viendo pacientes con traumatismos del 5° dedo del pie, ODIO las patas de los sillones y las camas!!!!......Si tan solo tuviera la energía suficiente para continuar!!!';
const CELULAR_ESPALDA = { x: 230, y: 84, w: 18, h: 26 };
const MARGEN = { x: 290, y: 0, w: 30, h: 200 }; // soltar el celular aca cuenta como "en el lugar"

export default {
  enter(_ctx, go, etapa = 'lateral') {
    this.go = go;
    this.etapa = etapa;
    this.t0 = null;
    this.arrastre = null;
    this.bostezo = false;
    this.typer = new Typer(TEXTO);
    game.pantalla = 'sala';
    if (etapa === 'espalda') decir('Arrastrá el celular al lugar de la derecha', 6000);
  },

  pasarAFrente() { this.etapa = 'frente'; this.t0 = null; },

  draw(ctx, t) {
    this.t0 ??= t;
    const dt = t - this.t0;
    if (this.etapa === 'lateral') {
      art.lateral(ctx, dt);
      if (dt > 1200 && !this.bostezo) { this.bostezo = true; audio.yawn(); }
      if (dt > 4200) this.pasarAFrente();
    } else if (this.etapa === 'frente') {
      art.frente(ctx, dt, { taza: this.arrastre !== 'taza', celular: this.arrastre !== 'celular' });
      caption(ctx, this.typer.shown(t), null, 150);
      if (!game.dock && this.typer.done(t)) {
        game.dock = true; // aparece el lugar del celular en el margen
        decir('Arrastrá los objetos con el mouse', 6000);
      }
    } else {
      art.espalda(ctx, dt, { celular: this.arrastre !== 'celular' && !game.celular });
    }
    if (this.arrastre === 'taza') art.taza(ctx, mouse.x - 9, mouse.y - 8, dt);
    if (this.arrastre === 'celular') art.celular(ctx, mouse.x - 6, mouse.y - 10);
  },

  down(x, y) {
    if (this.etapa === 'frente' && game.dock) {
      if (inRect(x, y, art.ZONA.taza)) this.arrastre = 'taza';
      else if (inRect(x, y, art.ZONA.celular)) this.arrastre = 'celular';
    } else if (this.etapa === 'espalda' && !game.celular && inRect(x, y, CELULAR_ESPALDA)) this.arrastre = 'celular';
  },

  up(x, y) {
    const item = this.arrastre;
    this.arrastre = null;
    if (item === 'taza' && inRect(x, y, art.ZONA.dr)) {
      resolver('cafe');
      this.go('cerca');
    } else if (item === 'celular' && inRect(x, y, MARGEN)) {
      if (this.etapa === 'frente') return tunck(); // todavia falta energia: primero el cafe
      game.celular = true;
      audio.ding();
      decir('Celular guardado. Tocalo en el margen derecho', 5000);
    }
  },

  click() {
    if (this.etapa === 'lateral') this.pasarAFrente();
    else if (this.etapa === 'frente' && !game.dock) this.typer.skip();
  },
};

// Consulta con un paciente: entrada indignada, dialogo por nodos (game/pacientes.js) y salida a puzzles,
// demandas o victoria.
import { sala } from '../art/consultorio.js';
import { sentado, cara } from '../art/pacientes.js';
import { mano, rxDiagnostico } from '../art/cuerpo.js';
import { W, H, mk, blur } from '../pix.js';
import * as guardia from '../art/guardia.js';
import { game } from '../game/state.js';
import { ARBOL, PACIENTES } from '../game/pacientes.js';
import { iniciarCaso } from '../game/caso.js';
import { Typer, caption, options, inRect } from '../ui.js';
import { demanda, victoria } from './final.js';
import * as audio from '../audio.js';

let espera = null; // sala de espera desenfocada (se arma una vez)
function fondoEspera() {
  if (!espera) {
    const src = mk();
    guardia.sala(src.getContext('2d'), 0);
    espera = blur(src);
  }
  return espera;
}

const INTRO_MS = 2400;

export default {
  enter(_c, go, arg = {}) {
    this.go = go;
    this.t = 0;
    this.rects = [];
    this.siguiente = null;
    game.pantalla = 'consultorio';
    if (arg.id) {
      iniciarCaso(arg.id);
      this.fase = 'intro';
      this.t0 = null;
      audio.babble();
    } else this.entrar(arg.nodo ?? game.caso.nodo);
  },

  entrar(nid) {
    game.caso.nodo = nid;
    this.n = ARBOL[game.caso.id][nid];
    this.cola = [...(this.n.lines ?? [])];
    this.fase = 'dialogo';
    this.avanzar();
  },

  avanzar() {
    if (this.cola.length) {
      const [who, text] = this.cola.shift();
      this.linea = { who, text };
      this.typer = new Typer(text);
      if (who === 'Pte') audio.babble();
      return;
    }
    this.linea = null;
    if (this.siguiente) { const s = this.siguiente; this.siguiente = null; return s(); }
    this.accion();
  },

  accion() {
    const n = this.n;
    if (n.opciones) this.fase = 'opciones';
    else if (n.ir) this.entrar(n.ir);
    else if (n.demanda) demanda(this.go, n.demanda.texto, n.demanda.vuelve);
    else if (n.puzzle) this.go(n.puzzle.escena);
    else if (n.victoria) victoria(this.go, n.victoria, n.heroe);
  },

  elegir(i) {
    const [texto, destino] = this.n.opciones[i];
    this.cola = [['Dr', texto]];
    this.siguiente = () => this.entrar(destino);
    this.fase = 'dialogo';
    this.avanzar();
  },

  draw(ctx, t) {
    this.t = t;
    const id = game.caso.id;
    if (this.fase === 'intro') {
      this.t0 ??= t;
      ctx.drawImage(fondoEspera(), 0, 0);
      cara(ctx, id, 160, 92, 1.25, 1, t);
      caption(ctx, PACIENTES[id].nombre, null, 176);
      if (t - this.t0 > INTRO_MS) this.entrar('inicio');
      return;
    }
    const vista = this.n.vista;
    if (vista === 'mano') mano(ctx);
    else if (vista === 'rx_ac') rxDiagnostico(ctx);
    else sala(ctx, t, { lado: true, detras: (c) => sentado(c, id, 160, 30, t) });

    if (this.fase === 'opciones') this.rects = options(ctx, this.n.opciones.map((o) => o[0]));
    else if (this.linea) {
      caption(ctx, this.typer.shown(t), this.linea.who);
      if (this.typer.done(t) && Math.floor(t / 400) % 2) { ctx.fillStyle = '#ffd23f'; ctx.fillText('▼', W - 12, H - 6); }
    }
  },

  click(x, y) {
    if (this.fase === 'intro') return this.entrar('inicio');
    if (this.fase === 'opciones') {
      const i = this.rects.findIndex((r) => inRect(x, y, r));
      if (i >= 0) this.elegir(i);
    } else if (this.linea) {
      if (!this.typer.done(this.t)) this.typer.skip();
      else this.avanzar();
    }
  },
};

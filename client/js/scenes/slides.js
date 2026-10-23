// Cinematica de cuadros: [{ draw(ctx, ms), text?, who?, ms?, centro?, enter?() }].
// Sin ms avanza con click (el primer click completa el texto); con ms avanza solo.
import { R, W, H } from '../pix.js';
import { Typer, caption, wrap } from '../ui.js';

export default {
  hud: false,

  enter(_ctx, _go, { frames, fin }) {
    this.frames = frames;
    this.fin = fin;
    this.i = -1;
    this.last = 0;
    this.siguiente();
  },

  siguiente() {
    if (++this.i >= this.frames.length) return this.fin();
    this.f = this.frames[this.i];
    this.t0 = null;
    this.typer = this.f.text ? new Typer(this.f.text, this.f.cps) : null;
    this.f.enter?.();
  },

  draw(ctx, t) {
    this.last = t;
    this.t0 ??= t;
    const f = this.f, dt = t - this.t0;
    f.draw(ctx, dt);
    if (this.typer) {
      const s = this.typer.shown(t);
      if (f.centro) {
        R(ctx, 'rgba(0,0,0,0.55)', 0, 54, W, 92);
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        wrap(ctx, s, W - 40).forEach((l, i) => ctx.fillText(l, W / 2, 76 + i * 16));
      } else caption(ctx, s, f.who, f.y);
      if (!f.ms && this.typer.done(t) && Math.floor(t / 400) % 2) {
        ctx.fillStyle = '#ffd23f';
        ctx.fillText('▼', W - 12, H - 6);
      }
    }
    if (f.ms && dt >= f.ms) this.siguiente();
  },

  click() {
    if (this.f.ms) return;
    if (this.typer && !this.typer.done(this.last)) this.typer.skip();
    else this.siguiente();
  },
};

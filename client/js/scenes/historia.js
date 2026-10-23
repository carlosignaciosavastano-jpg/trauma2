// Historia general sobre la fachada desenfocada y, despues, la back story del personaje elegido.
import { mk, blur, R, W, H } from '../pix.js';
import { drawFacade } from './facade.js';
import { game } from '../game/state.js';
import { NAMES } from '../game/characters.js';

export default {
  hud: false,
  enter(_ctx, go) {
    const c = mk();
    drawFacade(c.getContext('2d'));
    const bg = blur(c);
    const frames = [{
      draw: (ctx) => ctx.drawImage(bg, 0, 0),
      centro: true,
      text: 'Por un fenómeno desconocido en la medicina, usted se ha recibido de médico, y más extraño aún, quiere ser TRAUMATÓLOGO',
    }];
    go('slides', { frames, fin: () => go(game.personaje === 'rubio' ? 'sala' : 'pronto') });
  },
};

// Las back stories de los otros tres medicos todavia no estan escritas.
export const pronto = {
  hud: false,
  enter(_ctx, go) {
    this.go = go;
  },
  draw(ctx) {
    R(ctx, '#111', 0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd23f';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`Back story de ${NAMES[game.personaje]}`, W / 2, 80);
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.fillText('en desarrollo. Por ahora jugá con el Dr Rubio.', W / 2, 100);
    ctx.fillText('(click para volver)', W / 2, 130);
  },
  click() { this.go('facade'); },
};

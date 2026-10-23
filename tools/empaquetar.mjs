// Empaqueta el juego en UN solo HTML (JS + imagenes embebidas) para publicarlo sin servidor.
// Uso: node tools/empaquetar.mjs salida.html
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const salida = process.argv[2] ?? 'traumado2.html';
const js = execFileSync('npx', ['--yes', 'esbuild@0.24.0', 'client/js/main.js', '--bundle', '--format=iife', '--minify'], { encoding: 'utf8', maxBuffer: 1 << 26 });

const mime = { jpg: 'image/jpeg', png: 'image/png' };
const assets = Object.fromEntries(
  readdirSync('client/assets').map((f) => [f, `data:${mime[f.split('.').pop()]};base64,${readFileSync(`client/assets/${f}`).toString('base64')}`]),
);

// Del index.html se toma tal cual el <style> y el cuerpo; el JS va inline.
const index = readFileSync('client/index.html', 'utf8');
const estilo = index.match(/<style>[\s\S]*<\/style>/)[0];
const cuerpo = index.match(/<div id="game">[\s\S]*<\/div>/)[0];
const html = `<title>TRAUMADO2</title>
${estilo}
${cuerpo}
<script>globalThis.TRAUMA_ASSETS=${JSON.stringify(assets)};</script>
<script>${js.replaceAll('</script', '<\\/script')}</script>
`;
writeFileSync(salida, html);
console.log(`${salida}: ${(html.length / 1024).toFixed(0)} KB`);

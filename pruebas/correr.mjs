// Escuadra · corre todas las pruebas (v1.28). Sirve la app desde la carpeta del proyecto en un servidor local, corre
// cada prueba (tNNN.mjs) en Chromium con Playwright y falla si alguna revisión sale «FALLA».
// En GitHub lo corre .github/workflows/pruebas.yml cada vez que subes cambios. En tu compu:
//   npm install --prefix pruebas playwright && npx --prefix pruebas playwright install chromium && node pruebas/correr.mjs
import http from 'node:http';
import { spawn } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, statSync, mkdirSync, appendFileSync, rmSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const AQUI = dirname(fileURLToPath(import.meta.url)), RAIZ = process.env.SRC || join(AQUI, '..');
const PUERTOS = [8765, 8771], OUT = process.env.OUT_DIR || join(os.tmpdir(), 'escuadra-pruebas');
// cada corrida empieza con la carpeta de resultados vacía (si no, las imágenes de una corrida anterior se mezclan)
try { rmSync(OUT, { recursive: true, force: true }); } catch (e) { }
mkdirSync(OUT, { recursive: true });
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.mjs': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
const servidor = puerto => new Promise(res => {
  const s = http.createServer((req, resp) => {
    let ruta = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (ruta.endsWith('/')) ruta += 'index.html';
    const f = join(RAIZ, ruta); if (!f.startsWith(RAIZ) || !existsSync(f) || statSync(f).isDirectory()) { resp.writeHead(404); resp.end('no'); return; }
    resp.writeHead(200, { 'Content-Type': TIPOS[extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); resp.end(readFileSync(f));
  });
  s.listen(puerto, () => res(s));
});
const corre = (archivo) => new Promise(res => {
  const t0 = Date.now(), env = Object.assign({}, process.env, { SRC: RAIZ, OUT_DIR: OUT });
  delete env.PORT;
  const h = spawn(process.execPath, [join(AQUI, archivo)], { env, cwd: RAIZ });
  let out = ''; h.stdout.on('data', d => { out += d; }); h.stderr.on('data', d => { out += d; });
  const lim = setTimeout(() => { out += '\nFALLA se pasó de 8 minutos'; h.kill('SIGKILL'); }, 8 * 60 * 1000);
  h.on('close', code => { clearTimeout(lim); res({ archivo, code, out, s: Math.round((Date.now() - t0) / 1000) }); });
});

const srv = await Promise.all(PUERTOS.map(servidor));
const lista = readdirSync(AQUI).filter(f => /^t\d+\.mjs$/.test(f)).sort();
const filtro = process.argv[2] ? new RegExp(process.argv[2]) : null;
let malas = 0; const resumen = [];
for (const f of lista.filter(x => !filtro || filtro.test(x))) {
  const r = await corre(f), fallas = r.out.split('\n').filter(l => /^FALLA/.test(l)), oks = r.out.split('\n').filter(l => /^OK/.test(l)).length;
  const bien = r.code === 0 && !fallas.length;
  if (!bien) malas++;
  const lin = (bien ? '✅ ' : '❌ ') + f + ' · ' + oks + ' revisiones bien' + (fallas.length ? ', ' + fallas.length + ' mal' : '') + (r.code ? ' · terminó con error ' + r.code : '') + ' · ' + r.s + ' s';
  console.log(lin); resumen.push(lin);
  if (!bien) { fallas.forEach(l => console.log('   ' + l)); if (r.code && !fallas.length) console.log(r.out.split('\n').slice(-15).map(l => '   ' + l).join('\n')); }
}
srv.forEach(s => s.close());
console.log(malas ? '\n' + malas + ' archivo(s) de pruebas con fallas' : '\nTODO BIEN');
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, '## Pruebas de Escuadra\n\n' + resumen.map(x => '- ' + x).join('\n') + '\n\n' + (malas ? '**' + malas + ' con fallas**' : '**Todo bien**') + '\n');
process.exit(malas ? 1 : 0);

import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const PORT = process.env.PORT || 8765;
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t160'; 
mkdirSync(OUT, { recursive: true });
const SRC = (process.env.SRC || process.cwd());
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));


const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); r.continue(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => { if (!/prueba-error-escuadra/.test(e.message)) errs.push(e.message); }); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-06T07:00:00-06:00') });
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
const NOM = ['BARRIENTOS CORONADO MICHEL ARMANDO','CORTES TAMAYO MIGUEL ALEXANDER','CRUZ LOPEZ MARCO FABIAN','CRUZ PACHECO KARLA ESTEFANY','DIMAS FLORES LUIS ANGEL','DOMINGUEZ GUTIERREZ JESUS FABIAN','GALVAN RAMIREZ CRISTOFER JESUS','GOMEZ GOMEZ JOSE YAEL','GRANADOS SANCHEZ ANGELES GUADALUPE','GUERRERO ALDANA NATALIA','GUEVARA SALAZAR DAVID FROILAN','GUTIERREZ ATILANO JUAN PABLO','LOPEZ PACHECO HECTOR MANUEL','MARTIN ZERMEÑO ELIOT JAFET','MARTINEZ RAZO ISAI ALEXANDER','MENDOZA RAMIREZ ANGEL EDUARDO','MORENO RAMIREZ DIANA JAQUELINE','RAMIREZ TORRES BRISA JACQUELIN','RODRIGUEZ DE ANDA IGNACIO GUADALUPE','SEGURA RODRIGUEZ CRISTHIAN DE JESUS','VILLANUEVA AMEZQUITA TERA DE JESUS','VILLANUEVA URBANO JESUS'];
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, NOM); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
await p.evaluate(() => { window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); });
await p.evaluate(() => { location.hash = '#/imprimir'; }); await p.waitForTimeout(600);
const t0 = await p.evaluate(() => document.getElementById('view').innerText);
ok('Imprimir trae «Examen práctico de FreeCAD 2D» con 22 hojas', /Examen práctico de FreeCAD 2D/.test(t0) && /\(22 hojas\)/.test(t0));
const r = await p.evaluate(async () => {
  document.querySelector('[data-act=pfi-fc][data-q=grupo]').click(); await new Promise(r => setTimeout(r, 1500));
  const hs = [...document.querySelectorAll('#print-root .pfx')];
  return { n: hs.length, nombres: hs.map(h => h.querySelector('.nom').textContent), img: hs.every(h => { const i = h.querySelector('img.plano'); return i && i.complete && i.naturalWidth === 1376; }), rub: hs.every(h => /Posicionamiento y Origen/.test(h.innerText) && /100 pts/.test(h.innerText)), logo: /image-set/.test((document.getElementById('page-style') || {}).textContent || ''), zoom: hs.filter(h => h.dataset.zoom).length };
});
ok('22 hojas, una por alumno, con su nombre', r.n === 22 && JSON.stringify(r.nombres.slice().sort()) === JSON.stringify(NOM.slice().sort()), r.n);
ok('cada hoja trae el plano cargado y la rúbrica', r.img && r.rub);
ok('el logo de CETAC va en la hoja (margen superior derecho de @page)', r.logo);
ok('cada hoja cabe en una carta sin reducirse', r.zoom === 0, 'reducidas: ' + r.zoom);
const bl = await p.evaluate(async () => { document.querySelector('[data-act=pfi-fc][data-q=blanco]').click(); await new Promise(r => setTimeout(r, 1200)); return document.querySelectorAll('#print-root .pfx').length + '|' + document.querySelector('#print-root .pfx .nom').textContent.length; });
ok('en blanco: una hoja sin nombre', bl === '1|0', bl);
const uno = await p.evaluate(async () => { const s = document.getElementById('pfi-fc-al'); s.selectedIndex = 3; document.querySelector('[data-act=pfi-fc][data-q=uno]').click(); await new Promise(r => setTimeout(r, 1200)); return [document.querySelectorAll('#print-root .pfx').length, document.querySelector('#print-root .pfx .nom').textContent]; });
ok('un alumno: solo su hoja', uno[0] === 1 && uno[1] === NOM[3], JSON.stringify(uno));
// PDF real de la primera hoja para ver que cabe en 1 página con logo
await p.evaluate(async () => { document.querySelector('[data-act=pfi-fc][data-q=grupo]').click(); await new Promise(r => setTimeout(r, 1200)); });
const pg = await p.context().newPage();
await p.emulateMedia({ media: 'print' });
await p.pdf({ path: OUT + '/examen.pdf', format: 'Letter', preferCSSPageSize: true, printBackground: true });
const np = (execFileSync('pdfinfo', [OUT + '/examen.pdf']).toString().match(/Pages:\s+(\d+)/) || [])[1];
ok('el PDF real sale en 22 páginas (1 por alumno)', np === '22', np);
execFileSync('pdftoppm', ['-r', '60', '-f', '1', '-l', '1', '-png', OUT + '/examen.pdf', OUT + '/hoja']);
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

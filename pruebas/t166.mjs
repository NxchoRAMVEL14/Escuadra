import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t166';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-09T07:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));





await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
const NOM = ['BARRIENTOS CORONADO MICHEL ARMANDO','CORTES TAMAYO MIGUEL ALEXANDER','CRUZ LOPEZ MARCO FABIAN','CRUZ PACHECO KARLA ESTEFANY','DIMAS FLORES LUIS ANGEL','DOMINGUEZ GUTIERREZ JESUS FABIAN','GALVAN RAMIREZ CRISTOFER JESUS','GOMEZ GOMEZ JOSE YAEL','GRANADOS SANCHEZ ANGELES GUADALUPE','GUERRERO ALDANA NATALIA','GUEVARA SALAZAR DAVID FROILAN','GUTIERREZ ATILANO JUAN PABLO','LOPEZ PACHECO HECTOR MANUEL','MARTIN ZERMEÑO ELIOT JAFET','MARTINEZ RAZO ISAI ALEXANDER','MENDOZA RAMIREZ ANGEL EDUARDO','MORENO RAMIREZ DIANA JAQUELINE','RAMIREZ TORRES BRISA JACQUELIN','RODRIGUEZ DE ANDA IGNACIO GUADALUPE','SEGURA RODRIGUEZ CRISTHIAN DE JESUS','VILLANUEVA AMEZQUITA TERA DE JESUS','VILLANUEVA URBANO JESUS'];
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(500);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, NOM); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); }); await p.waitForTimeout(500);
await p.evaluate(() => { const E = window.E, S = E.store, C = E.calc, g = E.data.grupoActual(), al = E.data.alumnos(g); C.fechasLista(g, C.parcial('P2')).forEach(f => { const d = {}; al.forEach((a, i) => { d[a.id] = i % 5 === 0 ? 'F' : 'A'; }); S.put('asis:' + g.id + ':' + f, d, { silent: true }); }); const o = {}; al.forEach((a, i) => { o[a.id] = 50 + (i * 7) % 50; }); S.put('act:' + g.id + ':ex', { id: 'ex', parcial: 'P2', categoria: 'examen', nombre: 'Examen', peso: 1, max: 100, fecha: '2026-11-05', cuenta: true, notas: o }, {}); });
const prueba = async (act, nombre, pid) => {
  await p.evaluate(() => { location.hash = '#/imprimir'; }); await p.waitForTimeout(600);
  if (pid) await p.evaluate(pid => { const s = document.querySelector('[data-ch=pr][data-f=parcial]'); if (s) { s.value = pid; s.dispatchEvent(new Event('change', { bubbles: true })); } }, pid); await p.waitForTimeout(300);
  await p.evaluate(a => document.querySelector('[data-act=' + a + ']').click(), act); await p.waitForTimeout(1200);
  await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT + '/' + nombre + '.pdf', preferCSSPageSize: true, printBackground: true }); await p.emulateMedia({ media: 'screen' });
  const n = (execFileSync('pdfinfo', [OUT + '/' + nombre + '.pdf']).toString().match(/Pages:\s+(\d+)/) || [])[1];
  const t1 = execFileSync('pdftotext', ['-f', '1', '-l', '1', OUT + '/' + nombre + '.pdf', '-']).toString();
  return { n, firma: /Nombre y firma del docente/.test(t1), z: await p.evaluate(() => (document.querySelector('#print-root .una-hoja') || { style: {} }).style.zoom || '1') };
};
const a = await prueba('pr-acta', 'acta');
ok('acta de 22 alumnos en horizontal: una sola hoja con la firma', a.n === '1' && a.firma, JSON.stringify(a));
execFileSync('pdftoppm', ['-r', '50', '-png', OUT + '/acta.pdf', OUT + '/acta']);
const l = await prueba('pr-asis', 'asis', 'P2');
ok('lista de asistencia de 22 alumnos: una sola hoja con la firma', l.n === '1' && l.firma, JSON.stringify(l));
const pt = await prueba('pr-part', 'part', 'P2');
ok('registro de participación: una sola hoja con la firma', pt.n === '1' && pt.firma, JSON.stringify(pt));
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

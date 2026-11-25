// v1.45.0: paquete 2 · línea de tiempo, comparar parciales, predicción del final, mapa de temas y reporte para tutoría
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t185';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-12-01T09:00:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/alumnos'); await p.waitForTimeout(1500);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera']); await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; c.vaciasCero = false; }, {}); }); await p.waitForTimeout(400);
// P1 manual, P2 y P3 con un examen (solo el examen pesa). Ana 9/9/9 · Beto 7/6/8 · Carla 5/5/6 · Dani 8/7/7
const info = await p.evaluate(() => { const E = window.E, S = E.store, g = E.data.grupoActual(), al = E.data.alumnos(g), ps = E.data.parciales(), C = E.calc;
  const tabla = [[90, 90, 90], [70, 65, 80], [50, 50, 60], [80, 70, 70]];
  const man = {}; al.forEach((a, j) => { man[a.id] = { cal: tabla[j][0] }; }); S.update('manual:' + g.id, m => { m[ps[0].id] = { activo: true, alumnos: man }; }, {});
  [1, 2].forEach(i => { const pp = ps[i], notas = {}; al.forEach((a, j) => { notas[a.id] = tabla[j][i]; }); S.put('act:' + g.id + ':ex' + i, { id: 'ex' + i, parcial: pp.id, categoria: 'examen', nombre: 'Examen ' + (i + 1), peso: 1, max: 100, fecha: u3(pp.inicio), cuenta: true, notas: notas, instrumento: 'Exa' }, { silent: true }); });
  function u3(f) { return E.u.addDays(f, 3); }
  // una tarea que Beto no entregó, una falta y una observación
  S.put('act:' + g.id + ':t3', { id: 't3', parcial: 'P3', categoria: 'trabajos', nombre: 'Tarea de engranes', peso: 1, max: 10, fecha: '2026-11-20', cuenta: false, notas: { [al[0].id]: 10, [al[2].id]: 8 } }, { silent: true });
  const d = {}; al.forEach(a => { d[a.id] = a === al[1] ? 'F' : 'A'; }); S.put('asis:' + g.id + ':2026-11-24', d, { silent: true });
  S.put('obs:' + g.id + ':2026-11-25', { [al[1].id]: ['explico'] }, { silent: true });
  S.update('config', c => { c.pond = { examen: 100, trabajo: 0, libreta: 0, participacion: 0, asistencia: 0, proyecto: 0 }; c.pondP = {}; }, {}); C.pondDe = () => ({ examen: 100 });
  return { al: al.map(a => a.id), pr: al.map(a => { const x = E.seguir.pred(g, a.id); return [x.est, x.nec, x.ritmo]; }) };
});
ok('predicción: asegurado, en riesgo, no le alcanza y en camino', info.pr.map(x => x[0]).join() === 'asegurado,riesgo,nolcanza,camino', JSON.stringify(info.pr));
ok('Beto necesita 8 y lleva 7', info.pr[1][1] === 8 && info.pr[1][2] === 7);
await p.evaluate(() => { location.hash = '#/comparar'; }); await p.waitForTimeout(700);
let v = await p.evaluate(() => document.getElementById('view').innerText);
ok('comparar: promedio por parcial', /Comparar parciales/.test(v) && /7\.3/.test(v) && /2 de 4 aprueban/.test(v), (v.match(/[\d.]+\n1er[^\n]*\n[^\n]*/) || [])[0]);
ok('subieron Beto (+2) y Carla (+1); nadie bajó', /Subieron \(2\)/.test(v) && /Beto[^\n]*▲ \+2/.test(v) && /Bajaron \(0\)/.test(v));
ok('tabla de cómo terminaría el semestre', /No alcanza/.test(v) && /En riesgo/.test(v) && (await p.evaluate(() => document.querySelectorAll('.sv-t tr').length)) === 5);
await p.screenshot({ path: OUT + '/comparar.png', fullPage: true });
// línea de tiempo
await p.evaluate(id => { location.hash = '#/linea/' + id; }, info.al[1]); await p.waitForTimeout(600);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('línea de tiempo: examen, no entregó, falta, observación y cierre de parcial', /Examen 3/.test(v) && !/Examen: Examen/.test(v) && /No entregó: Tarea de engranes/.test(v) && /Faltó/.test(v) && /Explicó a un compañero/.test(v) && /Cerró el 2º parcial/.test(v), v.slice(0, 500));
ok('ordenada del más reciente al más antiguo, por mes', await p.evaluate(() => { const f = [...document.querySelectorAll('.sv-mes')].map(x => x.textContent); return f[0] === 'noviembre 2026' && f.indexOf('septiembre 2026') > 0; }));
await p.screenshot({ path: OUT + '/linea.png', fullPage: true });
await p.evaluate(id => { location.hash = '#/linea/' + id + '/asis'; }, info.al[1]); await p.waitForTimeout(400);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('filtro de faltas', /Faltó/.test(v) && !/Examen 3/.test(v));
// ficha
await p.evaluate(id => { location.hash = '#/alumno/' + id; }, info.al[2]); await p.waitForTimeout(600);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('ficha: tarjeta del semestre con enlace a la línea de tiempo', /Ya no le alcanza/.test(v) && /Línea de tiempo/.test(v));
// reportes
await p.evaluate(() => { location.hash = '#/comparar'; }); await p.waitForTimeout(500);
await p.click('[data-act=sv-rep]'); await p.waitForTimeout(400);
v = await p.evaluate(() => document.getElementById('print-root').innerText);
ok('reporte para tutoría: parciales, riesgo y cambios', /Reporte del grupo para tutoría/.test(v) && /En riesgo de reprobar/.test(v) && /Carla/.test(v) && /Subieron:/.test(v), v.slice(0, 300));
await p.evaluate(id => { location.hash = '#/linea/' + id; }, info.al[1]); await p.waitForTimeout(400);
await p.click('[data-act=sv-rep-al]'); await p.waitForTimeout(400);
v = await p.evaluate(() => document.getElementById('print-root').innerText);
ok('reporte del alumno', /Reporte del alumno · Beto/.test(v) && /Sin entregar: Tarea de engranes/.test(v));
await p.evaluate(() => { location.hash = '#/tutoria'; }); await p.waitForTimeout(500);
ok('tutoría trae el reporte', await p.evaluate(() => !!document.querySelector('#view [data-act=sv-rep]')));
await p.evaluate(() => { location.hash = '#/mapatemas'; }); await p.waitForTimeout(600);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('mapa de temas abre (sin datos por tema explica de dónde salen)', /Mapa de temas/.test(v));
ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

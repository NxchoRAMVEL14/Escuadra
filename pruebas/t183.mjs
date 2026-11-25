// v1.43.0: cierre de semestre, copiar a otro grupo y alerta temprana
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t183';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City', acceptDownloads: true });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept()); p.on('popup', pp => pp.close().catch(() => { }));
await p.clock.install({ time: new Date('2026-12-10T09:00:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(400);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera']); await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; c.vaciasCero = false; }, {}); }); await p.waitForTimeout(400);
// calificaciones: un examen por parcial con peso total (Ana 9/9/9, Beto 7/7/6, Carla 6/6/6, Dani sin el 3.º)
const info = await p.evaluate(() => { const E = window.E, S = E.store, g = E.data.grupoActual(), al = E.data.alumnos(g), ps = E.data.parciales(), C = E.calc;
  ps.forEach(pp => C.KEYS.forEach(k => { }));
  const tabla = [[95, 95, 95], [75, 75, 65], [65, 65, 65], [85, 85, null]];
  const man = {}; al.forEach((a, j) => { man[a.id] = { cal: tabla[j][0] / 10 }; }); S.update('manual:' + g.id, m => { m[ps[0].id] = { activo: true, alumnos: man }; }, {});
  ps.forEach((pp, i) => { if (i === 0) return; const notas = {}; al.forEach((a, j) => { if (tabla[j][i] != null) notas[a.id] = tabla[j][i]; }); S.put('act:' + g.id + ':ex' + i, { id: 'ex' + i, parcial: pp.id, categoria: 'examen', nombre: 'Examen ' + (i + 1), peso: 1, max: 100, fecha: pp.inicio, cuenta: true, notas: notas, instrumento: 'Exa' }, { silent: true }); });
  // config: solo examen pesa (para resultados predecibles)
  S.update('config', c => { c.pond = { examen: 100, trabajo: 0, libreta: 0, participacion: 0, asistencia: 0, proyecto: 0 }; c.pondP = {}; }, {});
  return { gid: g.id, ps: ps.map(x => x.id), al: al.map(a => a.id), fin: al.map(a => C.finalSem(g, a.id)) };
});
ok('datos de prueba: finales calculadas', info.fin[0].aprobado === true && info.fin[2].aprobado === false && info.fin[3].completo === false, JSON.stringify(info.fin.map(x => [x.suma, x.aprobado, x.completo])));
await p.evaluate(() => { location.hash = '#/finsem'; }); await p.waitForTimeout(700);
let v = await p.evaluate(() => document.getElementById('view').innerText);
ok('cierre de semestre: aprobados, extraordinario e incompletos', /Aprobados/.test(v) && /Extraordinario/.test(v) && /Van a extraordinario \(2\)/.test(v) && /Carla/.test(v) && /le faltaron 3/.test(v), (v.match(/Van a extraordinario[^\n]*\n[^\n]*\n[^\n]*/) || [])[0]);
ok('los 11 pasos del cierre con enlaces', (await p.evaluate(() => document.querySelectorAll('[data-ch=fs-paso]').length)) === 11 && /Pasa al siguiente semestre/.test(v));
await p.evaluate(() => { const c = document.querySelector('[data-ch=fs-paso]'); c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(300);
ok('palomear un paso se guarda', /1\/11/.test(await p.evaluate(() => document.getElementById('view').innerText)));
const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-act=fs-csv]')]); await dl.saveAs(OUT + '/cierre.csv');
const csvt = execFileSync('cat', [OUT + '/cierre.csv']).toString();
ok('descarga para Excel con la tabla final', /Alumno/.test(csvt) && /Extraordinario/.test(csvt) && csvt.split('\n').length === 5, csvt.split('\n')[1]);
await p.click('[data-act=fs-imp]'); await p.waitForTimeout(600); await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT + '/final.pdf', preferCSSPageSize: true, printBackground: true }); await p.emulateMedia({ media: 'screen' });
ok('tabla final impresa', /Calificaciones finales del semestre/.test(execFileSync('pdftotext', [OUT + '/final.pdf', '-']).toString()));
// copiar a otro grupo
await p.evaluate(gid => { const E = window.E, S = E.store; S.put('grupo:gnuevo', { id: 'gnuevo', nombre: '4°A', alumnos: [], horario: [] }); S.put('exa:' + gid + ':x1', { id: 'x1', parcial: E.data.parciales()[0].id, titulo: 'Examen del 1er parcial', fecha: E.data.parciales()[0].inicio, items: [{ id: 'q1' }], res: { a: 1 }, actId: 'ex0' }); }, info.gid);
await p.evaluate(() => { location.hash = '#/copiar'; }); await p.waitForTimeout(600);
await p.evaluate(gid => { const s = document.querySelector('[data-ch=cps][data-k=src]'); s.value = gid; s.dispatchEvent(new Event('change', { bubbles: true })); }, info.gid); await p.waitForTimeout(300);
await p.evaluate(() => { const s = document.querySelector('[data-ch=cps][data-k=dst]'); s.value = 'gnuevo'; s.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(300);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('copiar: vista previa de 2 actividades y 1 examen', /2 actividades/.test(v) && /1 exámenes/.test(v), (v.match(/Se va a copiar[\s\S]{0,140}/) || [])[0]);
await p.click('[data-act=cps-ok]'); await p.waitForTimeout(400);
const cp = await p.evaluate(() => { const S = window.E.store, a = S.list('act:gnuevo:'), x = S.list('exa:gnuevo:'); return { n: a.length, notas: a.every(z => Object.keys(z.notas).length === 0), ex: x.length, res: x[0] && Object.keys(x[0].res).length, act: x[0] && x[0].actId }; });
ok('copiado sin calificaciones ni resultados', cp.n === 2 && cp.notas && cp.ex === 1 && cp.res === 0 && !cp.act, JSON.stringify(cp));
await p.click('[data-act=cps-ok]').catch(() => { }); await p.waitForTimeout(300);
ok('volver a copiar no duplica actividades', await p.evaluate(() => window.E.store.list('act:gnuevo:').length) === 2);
// alerta temprana: Beto falta seguido en el parcial actual y va con 6
await p.evaluate(([gid, beto]) => { const E = window.E, C = E.calc, g = E.data.grupoActual(), u = E.u, pa = E.calc.parcialActual(); let f = pa.inicio, n = 0; const dias = []; while (f <= '2026-12-10' && dias.length < 40) { if (C.esClase(g, f)) dias.push(f); f = u.addDays(f, 1); }
  dias.slice(-3).forEach(d => { const doc = {}; E.data.alumnos(g).forEach(a => { doc[a.id] = 'A'; }); doc[beto] = 'F'; E.store.put('asis:' + gid + ':' + d, doc); }); }, [info.gid, info.al[1]]);
await p.evaluate(() => { location.hash = '#/alerta'; }); await p.waitForTimeout(700);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('alerta temprana: Beto en rojo con sus razones (va con 6, faltó seguido)', /Atiéndelos esta semana/.test(v) && /Beto/.test(v.split('Vigílalos')[0]) && /Faltó sus últimas 3 clases/.test(v) && /Va con \d en el parcial/.test(v), (v.match(/Atiéndelos[\s\S]{0,300}/) || [])[0].replace(/\n/g, ' '));
ok('Ana va bien (verde)', /Van bien[\s\S]*Ana/.test(v));
ok('botón para avisar a los papás', await p.evaluate(() => !!document.querySelector('[data-act=at-wa]')));
await p.evaluate(() => { location.hash = '#/inicio'; }); await p.waitForTimeout(600);
ok('en Inicio avisa cuántos van en rojo', /Alerta temprana:/.test(await p.evaluate(() => document.getElementById('view').innerText)));
ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

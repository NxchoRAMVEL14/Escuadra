import { chromium } from 'playwright';
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-07T11:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));


await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
// v1.31.0: estas revisiones son del redondeo «normal» y mínimo 6 (opción en Ajustes); lo de 7 y hacia abajo lo revisa t170
await p.evaluate(() => window.E.store.update('config', c => { c.redondeo = 'normal'; c.minAprob = 60; c.minAprobFijo = true; }, {}));
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
const nombres = ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera', 'Eli Rojas Paz', 'Fer Ruiz Gil'];
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, nombres); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const r = await p.evaluate(() => {
  const E = window.E, S = E.store, C = E.calc, g = E.data.grupoActual(), al = E.data.alumnos(g), P2 = C.parcial('P2'), out = {};
  out.of = [C.oficial(75), C.oficial(74.9), C.oficial(38), C.oficial(0), C.oficial(100), C.oficial(55)];
  // asistencia del 2º parcial: todos vienen, Fer nunca viene
  C.fechasLista(g, P2).forEach(f => { const d = {}; al.forEach(a => { d[a.id] = a === al[5] ? 'F' : 'A'; }); S.put('asis:' + g.id + ':' + f, d, { silent: true }); });
  // calificaciones: examen y trabajos
  const notas = (vals) => { const o = {}; al.forEach((a, i) => { o[a.id] = vals[i]; }); return o; };
  S.put('act:' + g.id + ':ex', { id: 'ex', parcial: 'P2', categoria: 'examen', nombre: 'Examen', peso: 1, max: 100, fecha: '2026-11-05', cuenta: true, notas: notas([80, 74, 30, 60, 55, 40]) }, { silent: true });
  S.put('act:' + g.id + ':tr', { id: 'tr', parcial: 'P2', categoria: 'trabajos', nombre: 'Libreta', peso: 1, max: 100, fecha: '2026-11-05', cuenta: true, notas: notas([70, 74, 30, 60, 55, 40]) }, { silent: true });
  S.update('config', c => { c.vaciasCero = true; }, {});
  out.cal = al.map(a => { const k = C.cal(g, 'P2', a.id); return [Math.round(k.bruta * 10) / 10, k.final]; });
  out.fila = C.actaFila(g, al[0].id).slice(3, 6);
  return out;
});
ok('redondeo oficial: 7.5 → 8, 7.49 → 7, mínimo 5 (38 y 0 → 5), 100 → 10, 5.5 → 6', JSON.stringify(r.of) === '[8,7,5,5,10,6]', JSON.stringify(r.of));
ok('la calificación del parcial ya es la oficial (se guarda 80 = 8)', r.cal.every(x => x[1] % 10 === 0 && x[1] >= 50), JSON.stringify(r.cal));
ok('un alumno con 32 de 100 queda en 5, nunca abajo', r.cal[2][1] === 50, JSON.stringify(r.cal[2]));
ok('en el acta: calificación 5 a 10 sin decimales', Number.isInteger(r.fila[0]) && r.fila[0] >= 5 && r.fila[0] <= 10, JSON.stringify(r.fila));
await p.evaluate(() => { location.hash = '#/calificaciones/P2'; }); await p.waitForTimeout(700);
const tabla = await p.evaluate(() => [...document.querySelectorAll('#view .tbl tbody tr')].map(tr => tr.querySelector('.g') ? tr.querySelector('.g').textContent : '').slice(0, 6));
ok('Calificaciones muestra 8, 7, 5… (no 80 ni 76)', tabla.every(t => /^(10|[5-9])\*?$/.test(t)), JSON.stringify(tabla));
// dar de baja a Eli
const eli = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(); return E.data.alumnos(g)[4].id; });
await p.evaluate(id => { location.hash = '#/alumno/' + id; }, eli); await p.waitForTimeout(600);
await p.evaluate(() => [...document.querySelectorAll('[data-act=alumno-baja]')][0].click()); await p.waitForTimeout(400);
const rb = await p.evaluate(id => { const E = window.E, C = E.calc, g = E.data.grupoActual(), a = E.data.alumno(g, id); return { f: a.bajaF, en: C.actaAlumnos(g).some(x => x.id === id), fila: C.actaFila(g, id).slice(3, 6), dias: C.fechasLista(g, C.parcial('P2')).length }; }, eli);
ok('al dar de baja se guarda la fecha', rb.f === '2026-11-07', rb.f);
ok('la baja sigue en el acta (lista oficial) con asistencia 2 y calificación 5', rb.en && rb.fila[0] === 5 && rb.fila[1] === 2 && rb.fila[2] === rb.dias - 2, JSON.stringify(rb));
// copiar para la plataforma: solo calificación y asistencias
await p.evaluate(() => { window.__clip = []; navigator.clipboard.writeText = t => { window.__clip.push(t); return Promise.resolve(); }; });
await p.evaluate(() => { location.hash = '#/calificaciones/final'; }); await p.waitForTimeout(700);
const v = await p.evaluate(() => document.getElementById('view').innerText);
ok('«Para subir a la plataforma» del 2º parcial con su fecha (12 de noviembre)', /Para subir a la plataforma · 2º parcial/.test(v) && /12 de noviembre/.test(v), v.slice(0, 200));
ok('avisa que Fer tiene 0 asistencias (la plataforma no acepta 0)', /0 asistencias/.test(v) && /Fer/.test(v));
await p.click('[data-act=plat-copy][data-q=dos]'); await p.waitForTimeout(300);
const clip = await p.evaluate(() => (window.__clip || []).slice(-1)[0] || '');
const lin = clip.split('\n');
ok('copia 6 renglones (con la baja) de calificación y asistencias, sin faltas', lin.length === 6 && lin.every(l => l.split('\t').length === 2) && lin[4] === '5\t2', JSON.stringify(lin));
ok('el Excel para Norma sigue con faltas', await p.evaluate(() => !!document.querySelector('[data-act=acta-xlsx]')));
ok('ya no se puede elegir escala 100 en Ajustes', await p.evaluate(() => { location.hash = '#/ajustes'; return true; }) && !(await p.evaluate(() => !!document.querySelector('[data-path=escalaActa], select[data-k=escalaActa]'))));
// Para aprobar habla en base 10
await p.evaluate(id => { location.hash = '#/alumno/' + id; }, await p.evaluate(() => { const g = window.E.data.grupoActual(); return window.E.data.alumnos(g)[2].id; })); await p.waitForTimeout(700);
const fa = await p.evaluate(() => document.getElementById('view').innerText);
ok('la ficha y «Para aprobar» dicen «aprobatorio 6», no 60', /aprobatorio 6\b/.test(fa) && !/aprobatorio 60/.test(fa), (fa.match(/aprobatorio \d+/) || [''])[0]);
// captura a mano en base 10
const man = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), al = E.data.alumnos(g); E.store.update('manual:' + g.id, d => { d.P1 = { activo: true, alumnos: {} }; }, {});
  E.changes['manual-val']({ value: '8', dataset: { pid: 'P1', aid: al[0].id, f: 'cal' } }); E.changes['manual-val']({ value: '7.5', dataset: { pid: 'P1', aid: al[1].id, f: 'cal' } });
  const d = E.store.get('manual:' + g.id).P1.alumnos; return [d[al[0].id].cal, d[al[1].id].cal, E.calc.cal(g, 'P1', al[0].id).final]; });
ok('captura a mano: escribes 8 y queda 8 (7.5 → 8)', JSON.stringify(man) === '[80,80,80]', JSON.stringify(man));
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

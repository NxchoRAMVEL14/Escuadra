import { chromium } from 'playwright';
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-12-10T11:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(500);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera']); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const r = await p.evaluate(() => {
  const E = window.E, C = E.calc, D = E.data, o = {};
  o.min = C.min10(); o.abajo = C.abajo();
  o.of = [69.9, 66, 65, 70, 79.99, 75, 100, 40].map(v => C.oficial(v));
  // semáforo y colores con 69.6 (6, rojo) y 70 (7, amarillo)
  o.sf = [E.semaforo ? E.semaforo.nivel(69.6) : null, E.semaforo ? E.semaforo.nivel(70) : null, E.semaforo ? E.semaforo.nivel(80) : null];
  return o;
});
ok('mínimo aprobatorio 7 y redondeo hacia abajo de fábrica', r.min === 7 && r.abajo, JSON.stringify(r));
ok('6.99, 6.6 y 6.5 bajan a 6; 7.99 es 7; nunca menos de 5', JSON.stringify(r.of) === JSON.stringify([6, 6, 6, 7, 7, 7, 10, 5]), JSON.stringify(r.of));
ok('semáforo: 69.6 = 🔴, 70 = 🟡, 80 = 🟢', JSON.stringify(r.sf) === JSON.stringify(['mal', 'reg', 'bien']), JSON.stringify(r.sf));
// final del semestre: suma de oficiales ≥ 21
const f = await p.evaluate(() => {
  const E = window.E, S = E.store, C = E.calc, g = E.data.grupoActual(), al = E.data.alumnos(g);
  S.update('config', c => { c.vaciasCero = false; }, {});
  const notas = v => { const o = {}; al.forEach((a, i) => { o[a.id] = v[i]; }); return o; };
  // un examen por parcial; peso todo en examen para controlar la calificación
  S.put('manual:' + g.id, { P1: { activo: true, alumnos: notas([70, 80, 60, 90]).constructor === Object ? Object.fromEntries(al.map((a, i) => [a.id, { cal: [70, 80, 60, 90][i] }])) : {} } }, { silent: true });
  ['P2', 'P3'].forEach((pid, j) => { const v = [[79, 69, 79, 95], [69, 60, 75, 95]][j]; S.put('act:' + g.id + ':x' + pid, { id: 'x' + pid, parcial: pid, categoria: 'examen', nombre: 'Examen', peso: 1, max: 100, fecha: '2026-09-20', cuenta: true, notas: notas(v) }, { silent: true }); });
  S.update('config', c => { c.pond = { examen: 100, proyecto: 0, trabajos: 0, asistencia: 0, participacion: 0 }; c.pondP = { tercero: { activo: false } }; }, {});
  return al.map(a => { const x = C.finalSem(g, a.id); return [x.parciales.map(v => C.oficial(v)).join('+'), x.suma, x.meta, x.aprobado, C.oficial(x.final)]; });
});
ok('Ana 7+7+6 = 20 de 21: reprueba aunque su promedio crudo sea 7.6', f[0][1] === 20 && f[0][2] === 21 && f[0][3] === false && f[0][4] === 6, JSON.stringify(f[0]));
ok('Beto 8+6+6 = 20: reprueba', f[1][1] === 20 && f[1][3] === false, JSON.stringify(f[1]));
ok('Carla 6+7+7… 69.9 cuenta 6: suma 20 y reprueba', f[2][0] === '6+7+7' && f[2][3] === false, JSON.stringify(f[2]));
ok('Dani 9+9+9 = 27: aprueba con 9', f[3][1] === 27 && f[3][3] === true && f[3][4] === 9, JSON.stringify(f[3]));
await p.evaluate(() => { location.hash = '#/calificaciones/final'; }); await p.waitForTimeout(700);
let v = await p.evaluate(() => document.getElementById('view').innerText);
ok('la tabla final muestra la suma 20/21 y explica la regla', /20\/21/.test(v) && /Se aprueba con 7 y juntando 21/.test(v) && /hacia abajo/.test(v));
const acta = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(); return E.data.alumnos(g).map(a => E.calc.actaFila(g, a.id).slice(-1)[0]); });
ok('el acta pone la final hacia abajo (20/3 = 6.67 → 6)', acta[0] === 6 && acta[3] === 9, JSON.stringify(acta));
await p.evaluate(() => { location.hash = '#/aprobar/P3'; }); await p.waitForTimeout(700);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('Para aprobar del 3º: cuánto necesita cada uno para juntar 21', /Para el semestre: 21 puntos/.test(v) && /Ana Pérez Lara/.test(v) && /necesita 7 en este parcial/.test(v), (v.match(/Lleva \d+ de 21[^\n]*/) || [''])[0]);
// redondeo normal desde Ajustes
await p.evaluate(() => { location.hash = '#/ajustes/cal'; }); await p.waitForTimeout(600);
await p.evaluate(() => { const s = document.querySelector('[data-path=redondeo]'); s.value = 'normal'; s.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(400);
const n = await p.evaluate(() => [window.E.calc.oficial(65), window.E.calc.oficial(64.9)]);
ok('con «Normal» en Ajustes, 6.5 sube a 7 y 6.49 baja a 6', n[0] === 7 && n[1] === 6, JSON.stringify(n));
await p.evaluate(() => { const i = document.querySelector('[data-ch=cfg10][data-path=minAprob]'); i.value = '6'; i.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(400);
const m = await p.evaluate(() => [window.E.calc.min10(), window.E.data.cfg().minAprob]);
ok('el mínimo se cambia en base 10 (6 → 60) y se respeta', m[0] === 6 && m[1] === 60, JSON.stringify(m));
// semestre nuevo con otros nombres de parcial: el 3º trae proyecto 60
const w = await p.evaluate(() => { const E = window.E, S = E.store; S.update('config', c => { c.pondP = { tercero: { examen: 20, proyecto: 60, trabajos: 10, asistencia: 5, participacion: 5 } }; }, {}); const ps = E.data.parciales().map((x, i) => Object.assign({}, x, { id: 'S2P' + (i + 1) })); S.put('parciales', ps); return [E.calc.pond('S2P3'), E.calc.pond('S2P2')]; });
ok('en otro semestre, su 3er parcial también va con proyecto 60 y los demás con los de siempre', w[0].proyecto === 60 && w[0].examen === 20 && w[1].proyecto === 0, JSON.stringify(w));
ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

import { chromium } from 'playwright';
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-20T11:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
const nombres = ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera'];
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, nombres); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const r = await p.evaluate(() => {
  const E = window.E, S = E.store, C = E.calc, g = E.data.grupoActual(), al = E.data.alumnos(g), out = {};
  const notas = v => { const o = {}; al.forEach((a, i) => { o[a.id] = v[i]; }); return o; };
  S.update('config', c => { c.vaciasCero = false; }, {});
  // 2º parcial: examen, libreta y una actividad marcada como proyecto (no debe cambiar el cálculo)
  S.put('act:' + g.id + ':e2', { id: 'e2', parcial: 'P2', categoria: 'examen', nombre: 'Examen', peso: 1, max: 100, fecha: '2026-11-05', cuenta: true, notas: notas([80, 60, 90, 40]) }, { silent: true });
  S.put('act:' + g.id + ':t2', { id: 't2', parcial: 'P2', categoria: 'trabajos', nombre: 'Libreta', peso: 1, max: 100, fecha: '2026-11-05', cuenta: true, notas: notas([70, 50, 100, 60]) }, { silent: true });
  S.put('act:' + g.id + ':p2', { id: 'p2', parcial: 'P2', categoria: 'trabajos', nombre: 'Proyecto vs 2 pruebas', peso: 1, max: 100, fecha: '2026-11-05', cuenta: true, notas: notas([90, 30, 80, 70]) }, { silent: true });
  out.p2a = al.map(a => C.cal(g, 'P2', a.id).bruta);
  S.update('act:' + g.id + ':p2', a => { a.categoria = 'proyecto'; });
  out.p2b = al.map(a => C.cal(g, 'P2', a.id).bruta);
  out.w2 = C.pond('P2'); out.w3 = C.pond('P3'); out.sep2 = C.separa('P2'); out.sep3 = C.separa('P3');
  // 3er parcial
  S.put('act:' + g.id + ':e3', { id: 'e3', parcial: 'P3', categoria: 'examen', nombre: 'Examen teórico', peso: 1, max: 100, fecha: '2026-11-18', cuenta: true, notas: notas([100, 50, 80, 60]) }, { silent: true });
  S.put('act:' + g.id + ':t3', { id: 't3', parcial: 'P3', categoria: 'trabajos', nombre: 'Libreta', peso: 1, max: 100, fecha: '2026-11-18', cuenta: true, notas: notas([100, 50, 80, 60]) }, { silent: true });
  S.put('act:' + g.id + ':p3', { id: 'p3', parcial: 'P3', categoria: 'trabajos', nombre: 'Prueba física del proyecto', peso: 1, max: 100, fecha: '2026-11-18', cuenta: true, notas: notas([60, 100, 80, 60]) }, { silent: true });
  const k = C.cal(g, 'P3', al[0].id); out.k3 = k.comp; out.txt = C.pondTxt('P3');
  return out;
});
ok('P1/P2 siguen 50/40/5/5 y sin rubro de proyecto', r.w2.examen === 50 && r.w2.trabajos === 40 && r.w2.proyecto === 0 && !r.sep2, JSON.stringify(r.w2));
ok('marcar algo como proyecto en el 2º parcial no cambia ninguna calificación', JSON.stringify(r.p2a) === JSON.stringify(r.p2b), JSON.stringify([r.p2a, r.p2b]));
ok('el 3er parcial trae 60/20/10/5/5', r.sep3 && r.w3.proyecto === 60 && r.w3.examen === 20 && r.w3.trabajos === 10 && r.w3.asistencia === 5 && r.w3.participacion === 5, r.txt);
await p.evaluate(() => { location.hash = '#/calificaciones/P3'; }); await p.waitForTimeout(700);
let v = await p.evaluate(() => document.getElementById('view').innerText);
ok('Calificaciones del 3º: bloques Proyecto 60 %, Examen teórico 20 %, Tareas y ejercicios 10 %', /Proyecto\s*60%/.test(v) && /Examen teórico\s*20%/.test(v) && /Tareas y ejercicios\s*10%/.test(v));
ok('sugiere pasar «Prueba física del proyecto» a Proyecto', /¿Estas van en Proyecto\?/.test(v) && /Prueba física del proyecto/.test(v));
await p.click('[data-act=act-aproy]'); await p.waitForTimeout(400);
const r2 = await p.evaluate(() => { const E = window.E, C = E.calc, g = E.data.grupoActual(), al = E.data.alumnos(g); return al.map(a => { const k = C.cal(g, 'P3', a.id); return { pr: k.comp.proyecto, ex: k.comp.examen, tr: k.comp.trabajos, bruta: k.bruta, as: k.comp.asistencia, pa: k.comp.participacion }; }); });
const esp = x => { let s = 0, w = 0; [[x.pr, 60], [x.ex, 20], [x.tr, 10], [x.as, 5], [x.pa, 5]].forEach(([v, ww]) => { if (v != null) { s += v * ww; w += ww; } }); return s / w; };
ok('la calificación del 3º pondera proyecto 60, examen 20, tareas 10', r2.every(x => x.pr != null && Math.abs(x.bruta - esp(x)) < 1e-6), JSON.stringify(r2[1]));
ok('Beto: proyecto 100, examen 50, tareas 50 → sube por el proyecto', r2[1].bruta > 80, String(r2[1].bruta));
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('la tabla trae columna Proy', /Proy/.test(v));
// Ajustes: P3 con propios, P1/P2 con los de siempre; apagar y prender
await p.evaluate(() => { location.hash = '#/ajustes/cal'; }); await p.waitForTimeout(600);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('Ajustes muestra 3er parcial con sus propios porcentajes y 2º con los de siempre', /3er parcial: sus propios porcentajes/.test(v) && /2º parcial: los de siempre/.test(v));
await p.evaluate(() => { const i = document.querySelector('[data-path="pondP.P3.examen"]'); i.value = '25'; i.dispatchEvent(new Event('change', { bubbles: true })); const j = document.querySelector('[data-path="pondP.P3.proyecto"]'); j.value = '55'; j.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(400);
const w3 = await p.evaluate(() => window.E.calc.pond('P3'));
ok('cambiar un porcentaje del 3º conserva los demás', w3.examen === 25 && w3.proyecto === 55 && w3.trabajos === 10 && w3.asistencia === 5, JSON.stringify(w3));
await p.evaluate(() => { const i = document.querySelector('[data-ch=cfg-pp][data-pid=P2]'); i.checked = true; i.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(400);
const w2 = await p.evaluate(() => [window.E.calc.pond('P2'), window.E.calc.propio('P2')]);
ok('prender propios en el 2º parte de los de siempre (no cambia nada)', w2[1] && w2[0].examen === 50 && w2[0].trabajos === 40 && w2[0].proyecto === 0, JSON.stringify(w2));
// planeación del 3º
await p.evaluate(() => { location.hash = '#/plan/plan_3AMEC_P3'; }); await p.waitForTimeout(600);
const btnPlan = await p.evaluate(() => !!document.querySelector('[data-act=plan-crit]'));
ok('la planeación del 3º ofrece pasar los porcentajes (cambiaron a 25/55)', btnPlan);
await p.click('[data-act=plan-crit]'); await p.waitForTimeout(500);
const pl = await p.evaluate(() => window.E.store.get('plan:plan_3AMEC_P3'));
ok('la planeación queda con sumativa, encuadre y momentos 5/45/50', /Proyecto 55 %/.test(pl.estrategia.sum) && /examen teórico 25 %/.test(pl.estrategia.sum) && /Encuadre: criterios/.test(pl.secuencia.apertura.desc) && pl.secuencia.desarrollo.pond === 45 && pl.secuencia.cierre.pond === 50 && (pl.estrategia.sum.match(/Proyecto \d+ %/g) || []).length === 1, pl.estrategia.sum.slice(-160));
// Para aprobar y la hoja para padres usan los porcentajes del 3º
const alu = await p.evaluate(() => { const g = window.E.data.grupoActual(); return window.E.data.alumnos(g)[1].id; });
const cd = await p.evaluate(id => { const E = window.E, g = E.data.grupoActual(); return E.casa ? E.casa.consultaDatos(g, E.data.alumno(g, id), 'P3').r : null; }, alu);
ok('la consulta del alumno (QR) trae Proyecto, Examen y Tareas con su valor', cd && cd.some(x => x[0] === 'Proyecto' && x[1] === 55) && cd.some(x => x[0] === 'Tareas y ejercicios'), JSON.stringify(cd));
ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

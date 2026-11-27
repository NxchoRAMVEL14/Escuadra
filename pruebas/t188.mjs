// v1.48.0: paquete 5 · simuladores de escalera, hoja de práctica, retos FreeCAD, clase invertida, banco de proyectos, cobertura
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t188';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-24T16:00:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
// ---- lógica de los simuladores (sin navegador)
const L = await p.evaluate(() => 0); void L;
await p.goto('http://localhost:' + PORT + '/#/alumnos'); await p.waitForTimeout(1500);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz']); await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); }); await p.waitForTimeout(400);
const logica = await p.evaluate(() => { const SM = window.E.sims, run = (id, pasos) => { const s = SM.get(id), v = {}; const out = []; pasos.forEach(([set, dt, n]) => { Object.assign(v, set); for (let i = 0; i < (n || 1); i++) SM.paso(s, v, dt || 0.05); out.push(Object.assign({}, v)); }); return out; };
  const a = run('arranque', [[{ S1: true }], [{ S1: false }], [{ S0: true }], [{ S0: false }], [{ S1: true }], [{ S1: false, F1: true }]]);
  const sem = run('semaforo', [[{ S1: true }], [{ S1: false }, 0.1, 55], [{}, 0.1, 40], [{}, 0.1, 30]]);
  const ban = run('banda', [[{ S1: true }], [{ S1: false }], [{ B1: true }], [{ B1: false }]]);
  const pr = run('prensa', [[{ S1: true }], [{ S2: true }], [{ B2: true }], [{ B2: false }], [{ S1: false, S2: false }], [{ S1: true, S2: true }]]);
  return { a: a.map(v => v.K1 ? 1 : 0).join(''), sem: sem.map(v => (v.H1 ? 'R' : '') + (v.H2 ? 'V' : '') + (v.H3 ? 'A' : '')).join(','), ban: ban.map(v => v.K1 ? 1 : 0).join(''), pr: pr.map(v => v.Y1 ? 1 : 0).join('') };
});
ok('arranque y paro: autorretención, paro y térmico', logica.a === '110010', logica.a);
ok('semáforo: rojo → verde → amarillo → rojo', logica.sem === 'R,V,A,R', logica.sem);
ok('banda: se detiene con la pieza y no arranca sola', logica.ban === '1100', logica.ban);
ok('prensa: baja solo con las dos manos y sube al llegar abajo', logica.pr === '010001', logica.pr);
const mat = await p.evaluate(() => window.E.sims.material(window.E.sims.get('semaforo')).map(m => m[1] + ' ' + m[0]).join(' | '));
ok('lista de material contada del diagrama', /3 Luz piloto|Luz piloto de 24 V roja/.test(mat) && /Temporizador a la conexión \(TON\) de 24 V, ajustado a 5 s/.test(mat) && /Fuente de 24 V DC/.test(mat), mat.slice(0, 300));
// vista y hoja de práctica
await p.evaluate(() => { location.hash = '#/simuladores'; }); await p.waitForTimeout(600);
ok('simuladores: elevador y 5 nuevos', (await p.evaluate(() => document.querySelectorAll('[data-act=c5-hoja]').length)) === 5 && /Elevador de 2 pisos/.test(await p.evaluate(() => document.getElementById('view').innerText)));
await p.evaluate(() => document.querySelector('[data-act=c5-hoja][data-id=cilindro]').click()); await p.waitForTimeout(400);
let v = await p.evaluate(() => document.getElementById('print-root').innerText);
ok('hoja de práctica: material, E/S, diagrama, pasos, preguntas y cotejo', /Práctica: Cilindro neumático/.test(v) && /Electroválvula 5\/2/.test(v) && /Final de carrera/.test(v) && /Procedimiento/.test(v) && /Lista de cotejo/.test(v) && await p.evaluate(() => !!document.querySelector('#print-root .c5-lad svg')));
// sim.html
const sp = await ctx.newPage(); sp.on('pageerror', e => errs.push('sim: ' + e.message)); await sp.goto('http://localhost:' + PORT + '/sim.html#arranque'); await sp.waitForTimeout(600);
const bt = await sp.$('[data-k=S1]'); const bb = await bt.boundingBox(); await sp.mouse.move(bb.x + 10, bb.y + 10); await sp.mouse.down(); await sp.waitForTimeout(200); await sp.mouse.up(); await sp.waitForTimeout(300);
ok('sim.html: arranca con el botón y se queda encendido', /Girando/.test(await sp.evaluate(() => document.getElementById('esc').textContent)) && await sp.evaluate(() => document.querySelectorAll('.led.on').length >= 2));
await sp.goto('http://localhost:' + PORT + '/sim.html#cilindro'); await sp.waitForTimeout(500);
await sp.click('[data-k=S4]'); await sp.waitForTimeout(1200);
ok('sim.html: cilindro en ciclo continuo', /Saliendo|Entrando|Afuera/.test(await sp.evaluate(() => document.getElementById('esc').textContent)));
await sp.screenshot({ path: OUT + '/sim.png', fullPage: true }); await sp.close();
// 28 · retos FreeCAD
const vol = await p.evaluate(() => { const T = window.E.retofc.TIPOS; return [T.placa.vol({ L: 80, W: 50, T: 6, d: 8, m: 10 }), T.eje.vol({ D1: 20, L1: 40, D2: 10, L2: 30 })]; });
ok('volúmenes exactos', Math.abs(vol[0] - (24000 - 4 * Math.PI * 16 * 6)) < 1e-6 && Math.abs(vol[1] - Math.PI / 4 * (400 * 40 + 100 * 30)) < 1e-6);
await p.evaluate(() => { location.hash = '#/retosfc'; }); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('[data-act=rf-nuevo][data-t=brida]').click()); await p.waitForTimeout(500);
const rv = await p.evaluate(() => { const g = window.E.data.grupoActual(); return window.E.retofc.lista(g)[0].vol; });
ok('reto con plano acotado', await p.evaluate(() => !!document.querySelector('.rf-plano svg')) && /Brida/.test(await p.evaluate(() => document.getElementById('view').innerText)));
await p.evaluate(x => { const s = (i, val) => { const el = document.querySelectorAll('[data-ch=rf-v]')[i]; el.value = val; el.dispatchEvent(new Event('change', { bubbles: true })); }; s(0, (x * 1.004).toFixed(2)); s(1, (x * 1.03).toFixed(0)); s(2, '1234'); }, rv); await p.waitForTimeout(400);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('revisa ±1 % (✓), ±5 % (≈) y lejos (✗)', /\(1 ✓\)/.test(v) && /≈ revisa una cota/.test(v) && /✗/.test(v));
await p.evaluate(() => document.querySelector('[data-act=rf-act]').click()); await p.waitForTimeout(300);
ok('pasa a calificaciones (✓ = 10, ≈ = 7)', await p.evaluate(() => { const S = window.E.store, g = window.E.data.grupoActual(), al = window.E.data.alumnos(g), a = S.list('act:' + g.id + ':').find(x => x.instrumento === 'Reto FreeCAD'); return a && a.notas[al[0].id] === 100 && a.notas[al[1].id] === 70 && a.notas[al[2].id] == null; }));
// 29 · clase invertida
await p.evaluate(() => { location.hash = '#/invertida'; }); await p.waitForTimeout(600);
const nprox = await p.evaluate(() => document.querySelectorAll('[data-act=iv-nueva]').length);
ok('clase invertida: próximas clases del plan', nprox > 0, nprox);
if (nprox) {
  await p.evaluate(() => document.querySelector('[data-act=iv-nueva]').click()); await p.waitForTimeout(500);
  await p.evaluate(() => { const el = document.querySelector('[data-ch=iv-c][data-k=url]'); el.value = 'https://youtu.be/ejemplo'; el.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('[data-act=iv-qr]').click()); await p.waitForTimeout(800);
  const iurl = await p.evaluate(() => window.E.ui.c5Url);
  const rp = await ctx.newPage(); rp.on('pageerror', e => errs.push('repaso: ' + e.message)); await rp.goto(iurl); await rp.waitForTimeout(600);
  const t0 = await rp.evaluate(() => document.body.innerText);
  ok('repaso.html: primero el material y luego las preguntas', /Antes de la clase/.test(t0) && /Ver el material/.test(t0) && /Ya lo vi/.test(t0), t0.slice(0, 200));
  await rp.click('#ya'); await rp.waitForTimeout(300);
  // contesta todo con la opción correcta según el payload
  for (let i = 0; i < 4; i++) { const ok2 = await rp.evaluate(() => !!document.querySelector('.op')); if (!ok2) break; await rp.click('.op'); await rp.waitForTimeout(100); await rp.click('#sig'); await rp.waitForTimeout(100); }
  await rp.fill('#num', '2'); await rp.click('#vcod'); await rp.waitForTimeout(200);
  const cod = await rp.evaluate(() => (document.querySelector('#cod .score') || {}).textContent); await rp.close();
  await p.evaluate(() => window.E.modal.close()); await p.waitForTimeout(200);
  await p.evaluate(c => { const el = document.querySelectorAll('[data-ch=rc-cod]')[1]; el.value = c; el.dispatchEvent(new Event('change', { bubbles: true })); }, cod); await p.waitForTimeout(500);
  v = await p.evaluate(() => document.getElementById('view').innerText);
  ok('con el código sabes quién lo hizo y cuántas tuvo bien', /¿Quién lo hizo\? \(1 de 3\)/.test(v) && /✓ \d de \d/.test(v), cod + ' · ' + (v.match(/Quién lo hizo[^\n]*/) || [])[0]);
}
// 30 · banco de proyectos
await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), al = E.data.alumnos(g), pid = E.proyecto.canon(g, E.calc.parcialActual().id); E.store.put('proy:' + g.id + ':' + pid, { equipos: [{ id: 'eqA', nombre: 'Equipo 1', al: [al[0].id, al[1].id] }] }); location.hash = '#/proyectos'; }); await p.waitForTimeout(600);
ok('banco de proyectos: 12', (await p.evaluate(() => document.querySelectorAll('[data-ch=bp-asig]').length)) === 12);
await p.evaluate(() => { const s = document.querySelector('[data-ch=bp-asig][data-p=tijera]'); s.value = 'eqA'; s.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(400);
ok('asignar a un equipo', /Lo hace: Equipo 1/.test(await p.evaluate(() => document.getElementById('view').innerText)) && await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), pid = E.proyecto.canon(g, E.calc.parcialActual().id); return E.proyecto.doc(g, pid).equipos[0].proy === 'Elevador de tijera'; }));
// 31 · cobertura
await p.evaluate(() => { location.hash = '#/cobertura'; }); await p.waitForTimeout(800);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('cobertura: submódulos, actividades clave y desarrollos con su estado', /Submódulo 2/.test(v) && /h de tu plan dadas/.test(v) && /Visto|Planeado|No está en tu plan/.test(v), v.slice(0, 400));
await p.screenshot({ path: OUT + '/cobertura.png', fullPage: true });
ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

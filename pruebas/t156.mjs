import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const PORT = process.env.PORT || 8765;
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t156'; 
mkdirSync(OUT, { recursive: true });
const SRC = (process.env.SRC || process.cwd());
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));

// 0) estático: sin sinLogo ni BANDA; el logo va fijo; cada impresión pasa por P.run
const pj = readFileSync(SRC + '/print.js', 'utf8');
const todos = readdirSync(SRC).filter(f => f.endsWith('.js') && f !== 'escuadra.min.js').map(f => [f, readFileSync(SRC + '/' + f, 'utf8')]);
const conSin = todos.filter(([, s]) => /sinLogo/.test(s)).map(([f]) => f);



const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => { if (!/prueba-error-escuadra/.test(e.message)) errs.push(e.message); }); let rechaza = false; p.on('dialog', d => rechaza ? d.dismiss() : d.accept());
await p.clock.install({ time: new Date('2026-10-30T11:10:00-06:00') });
await p.addInitScript(() => { window.__clip = []; Object.defineProperty(navigator, 'clipboard', { value: { writeText: t => { window.__clip.push(t); return Promise.resolve(); } }, configurable: true }); });

await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);

// grupo de prueba con 40 alumnos (la lista ocupa varias hojas)
const nom = ['Karla', 'Ana', 'Beto', 'Carla', 'Dani', 'Eli', 'Fer', 'Gabo', 'Hugo', 'Ivan'];
const ape = ['Cruz Ruiz', 'Pérez Lara', 'Soto Mena', 'Díaz Ortiz', 'Luna Vera', 'Rojas Paz'];
const nombres = []; for (let i = 0; i < 40; i++) nombres.push(nom[i % nom.length] + ' ' + ape[(i * 7) % ape.length] + ' ' + (i + 1));
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, nombres); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const gid = await p.evaluate(() => window.E.data.grupoActual().id);
ok('grupo de prueba con 40 alumnos', !!gid, gid);

// horario parecido al real del 3°A (varias clases por día, una con receso de por medio)
await p.evaluate(gid => {
  window.E.store.update('grupo:' + gid, g => {
    g.inicioDocente = '2026-10-01';
    g.horario = [
      { dia: 2, inicio: '07:30', fin: '10:00', horas: 3 }, { dia: 2, inicio: '12:10', fin: '13:00', horas: 1 },
      { dia: 3, inicio: '07:30', fin: '10:00', horas: 3 }, { dia: 3, inicio: '10:30', fin: '12:10', horas: 2 },
      { dia: 4, inicio: '09:10', fin: '10:00', horas: 1 }, { dia: 4, inicio: '10:30', fin: '12:10', horas: 2 },
      { dia: 5, inicio: '07:30', fin: '10:00', horas: 3 }
    ];
  });
}, gid);

// pases de lista con marcas y excepciones por clase (aid|clase), en las primeras 9 clases del parcial
await p.evaluate(gid => {
  const E = window.E, g = E.data.grupoActual(), pp = E.calc.parcialActual(), al = E.data.alumnos(g);
  let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  E.calc.clases(g, pp).slice(0, 9).forEach(c => {
    const cl = E.calc.clasesDia(g, c.fecha), doc = {};
    al.forEach(a => { doc[a.id] = rnd() < 0.08 ? 'F' : rnd() < 0.05 ? 'R' : 'A'; cl.forEach(k => { if (rnd() < 0.12) doc[a.id + '|' + k.k] = rnd() < 0.5 ? 'F' : 'J'; }); });
    E.store.put('asis:' + g.id + ':' + c.fecha, doc, { silent: true });
  });
}, gid);
const esp = ms => p.waitForTimeout(ms);
const ev = (fn, x) => p.evaluate(fn, x);
// equipos al azar y marcar avance
await ev(async () => { location.hash = '#/proyecto'; }); await esp(400);
await ev(() => { document.getElementById('pj-k').value = '4'; document.querySelector('[data-act=pj-armar][data-m=azar]').click(); }); await esp(300);
await ev(() => document.querySelector('[data-act=pj-edit-ok]').click()); await esp(300);
const r0 = await ev(() => {
  const E = window.E, g = E.data.grupoActual(), PJ = E.proyecto, pid = PJ.canon(g, E.calc.parcialActual().id), ms = PJ.metas(g, pid), eq = PJ.doc(g, pid).equipos[0];
  // el equipo 1 ya terminó la etapa 2 (prototipo)
  document.querySelector('[data-act=pj-st][data-eq="' + eq.id + '"][data-et="' + ms[1].id + '"]').click();
  document.querySelector('[data-act=pj-st][data-eq="' + eq.id + '"][data-et="' + ms[1].id + '"]').click();
  return { pid, n: ms.length, nombre: PJ.def(g, pid).nombre, e2: ms[1].id, t2: ms[1].t, eq: eq.id, st: PJ.estado(g, pid, eq).st[ms[1].id], btn: !!document.querySelector('[data-act=pj-et-edit]') };
});
ok('Proyecto tiene «✏️ Editar proyecto» y el avance se marca como antes', r0.btn && r0.n === 12 && r0.st && r0.st.st === 'ok', r0.nombre + ' · ' + r0.n + ' etapas');
// editar
await ev(() => document.querySelector('[data-act=pj-et-edit]').click()); await esp(300);
const cambia = async (sel, v) => { await ev(([s, v]) => { const el = document.querySelector(s); el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); }, [sel, v]); await esp(250); };
await cambia('[data-ch=pj-def-nom]', 'Brazo robótico');
await cambia('[data-ch=pj-et-t][data-i="1"]', 'Prototipo de cartón y prueba de movimiento');
await cambia('[data-ch=pj-et-f][data-i="0"]', '2026-11-20');
await cambia('[data-ch=pj-et-f][data-i="1"]', '2026-11-25');
await cambia('[data-ch=pj-proy][data-eq="' + r0.eq + '"]', 'Garra de 3 dedos');
await ev(() => document.querySelector('[data-act=pj-et-sube][data-i="1"]').click()); await esp(250);     // prototipo sube a la etapa 1
await ev(() => document.querySelector('[data-act=pj-et-del][data-i="11"]').click()); await esp(250);     // quita «Exposición»
await ev(() => document.querySelector('[data-act=pj-et-add]').click()); await esp(300);
const nuevo = await ev(() => document.activeElement && document.activeElement.classList.contains('pj-ett'));
await cambia('[data-ch=pj-et-t][data-i="11"]', 'Entrega de bitácora'); await cambia('[data-ch=pj-et-f][data-i="11"]', '2026-12-04');
await p.screenshot({ path: OUT + '/editor.png', fullPage: true });
const r1 = await ev(r0 => {
  const E = window.E, g = E.data.grupoActual(), PJ = E.proyecto, ms = PJ.metas(g, r0.pid), def = PJ.def(g, r0.pid), eq = PJ.doc(g, r0.pid).equipos.find(x => x.id === r0.eq), est = PJ.estado(g, r0.pid, eq, '2026-10-30');
  return { nombre: def.nombre, propio: def.propio, ts: ms.map(m => m.t), fs: ms.map(m => m.f), man: ms.map(m => m.man), primera: ms[0], st: est.st[r0.e2], proy: eq.proy, idsiguen: ms[0].id === r0.e2 };
}, r0);
ok('cambia el nombre del proyecto y de una etapa', r1.nombre === 'Brazo robótico' && r1.ts[0] === 'Prototipo de cartón y prueba de movimiento' && r1.propio);
ok('ordenar: la etapa sube y conserva su avance (✓ lista del equipo)', r1.idsiguen && r1.st && r1.st.st === 'ok', r1.ts.slice(0, 2).join(' → '));
ok('la fecha que pones manda; las que no tocas siguen saliendo del guion', r1.fs[0] === '2026-11-25' && r1.man[0] && r1.fs[1] === '2026-11-20' && r1.man[1] && !r1.man[2] && r1.fs[2], r1.fs.slice(0, 3).join(', '));
ok('quitar y agregar etapas (la nueva queda lista para escribir su nombre)', r1.ts.length === 12 && r1.ts.indexOf('Exposición') < 0 && r1.ts[11] === 'Entrega de bitácora' && r1.fs[11] === '2026-12-04' && nuevo, r1.ts.length + ' etapas');
ok('nombre del proyecto de cada equipo', r1.proy === 'Garra de 3 dedos');
await ev(() => document.querySelector('[data-act=pj-et-ok]').click()); await esp(300);
const r2 = await ev(() => ({ txt: document.getElementById('view').textContent.replace(/\s+/g, ' ') }));
ok('la vista muestra el nombre nuevo, el proyecto del equipo y las fechas «a mano»', /Brazo robótico/.test(r2.txt) && /Equipo 1 · Garra de 3 dedos/.test(r2.txt) && /a mano/.test(r2.txt) && /Entrega de bitácora/.test(r2.txt));
await p.screenshot({ path: OUT + '/vista.png', fullPage: false });
// deshacer el último cambio de fecha
const r3 = await ev(async r0 => {
  const E = window.E, g = E.data.grupoActual(), PJ = E.proyecto;
  E.undo.undo(); await new Promise(r => setTimeout(r, 200));   // deshace «✓ Listo»? no guarda nada; deshace la fecha de la etapa nueva
  return PJ.metas(g, r0.pid)[11].f;
}, r0);
ok('↶ Deshacer regresa el último cambio del proyecto', r3 !== '2026-12-04', String(r3));
// fechas del guion y etapas originales
await ev(() => document.querySelector('[data-act=pj-et-edit]').click()); await esp(300);
await ev(() => document.querySelector('[data-act=pj-et-guion]').click()); await esp(300);
const r4 = await ev(r0 => { const E = window.E, g = E.data.grupoActual(); return E.proyecto.metas(g, r0.pid).filter(m => m.man).length; }, r0);
ok('«Usar las fechas del guion» quita las fechas a mano', r4 === 0, r4);
await ev(() => document.querySelector('[data-act=pj-et-orig]').click()); await esp(300);
const r5 = await ev(r0 => { const E = window.E, g = E.data.grupoActual(), PJ = E.proyecto, ms = PJ.metas(g, r0.pid), eq = PJ.doc(g, r0.pid).equipos.find(x => x.id === r0.eq); return { n: ms.length, nombre: PJ.def(g, r0.pid).nombre, t2: ms[1].t, st: (PJ.estado(g, r0.pid, eq).st[r0.e2] || {}).st, proy: eq.proy }; }, r0);
ok('«Volver a las etapas originales» regresa las 12 con su avance (y el proyecto del equipo se queda)', r5.n === 12 && r5.nombre === r0.nombre && r5.t2 === r0.t2 && r5.st === 'ok' && r5.proy === 'Garra de 3 dedos', JSON.stringify(r5));
// otras pantallas que usan el proyecto
const r6 = await ev(async () => { const out = {}; for (const h of ['inicio', 'pendientes', 'consejo', 'historial']) { location.hash = '#/' + h; await new Promise(r => setTimeout(r, 350)); out[h] = !/Algo falló/.test(document.getElementById('view').innerText); } out.hist = /Proyecto del 2º parcial/.test(document.getElementById('view').innerText); return out; });
ok('Inicio, Pendientes, Consejo e Historial siguen bien (el historial dice «Proyecto del 2º parcial»)', r6.inicio && r6.pendientes && r6.consejo && r6.historial && r6.hist, JSON.stringify(r6));
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

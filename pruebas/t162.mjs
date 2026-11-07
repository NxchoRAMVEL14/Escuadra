import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const PORT = process.env.PORT || 8765;
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t162'; 
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
await ev(() => { window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); });
await ev(() => { location.hash = '#/proyecto'; }); await esp(400);
await ev(() => { document.getElementById('pj-k').value = '10'; document.querySelector('[data-act=pj-armar][data-m=azar]').click(); }); await esp(300);
await ev(() => document.querySelector('[data-act=pj-edit-ok]').click()); await esp(300);
const r0 = await ev(() => {
  const E = window.E, S = E.store, g = E.data.grupoActual(), PJ = E.proyecto, pid = PJ.canon(g, E.calc.parcialActual().id);
  S.update('proy:' + g.id + ':' + pid, d => { d.equipos[0].proy = 'Garra de 3 dedos'; d.equipos[1].proy = 'Brazo de 2 ejes'; d.equipos[2].proy = 'Grúa con pistón'; }, {});
  return { pid, eqs: PJ.doc(g, pid).equipos.map(e => ({ id: e.id, n: e.al.length, nombre: e.nombre })), tipos: PJ.doc(g, pid).equipos.map(e => E.pruebas.tipo(g, pid, e)) };
});
await esp(300);
// el 2º parcial: equipo 1 (garra) y 2 (brazo) con sus 3 mejoras
await ev(r0 => { const E = window.E, S = E.store, g = E.data.grupoActual();
  S.update('prueba:' + g.id + ':' + r0.pid, d => { d.eq = d.eq || {}; d.eq[r0.eqs[0].id] = { bit: { mej: ['Reforzar la base con MDF de 6 mm', 'Cambiar el eje por uno de 6 mm', 'Corregir los planos en FreeCAD'] }, pts: {}, f: '2026-11-05' }; d.eq[r0.eqs[1].id] = { bit: { mej: ['Más tornillos en el codo', '', ''] } }; r0.eqs.slice(3).forEach(e => { d.eq[e.id] = { tipo: 'brazo' }; }); }, {}); }, r0);
const pr = async (sel) => { await ev(s => { const b = document.querySelector(s); b.click(); }, sel); await esp(1200); return ev(() => [...document.querySelectorAll('#print-root .pfi-hoja')].map(h => ({ t: h.innerText, z: h.dataset.zoom || '' }))); };
await ev(pid => { location.hash = '#/proyecto/' + pid; }, r0.pid); await esp(600);
const h2 = await pr('[data-act=pfi-print][data-q=rub]');
ok('rúbricas del 2º parcial: la del equipo 1 trae sus 3 mejoras hacia el 3er parcial', /Plan de mejora hacia el 3er parcial/.test(h2[0].t) && /Reforzar la base con MDF de 6 mm/.test(h2[0].t) && /Corregir los planos en FreeCAD/.test(h2[0].t), h2[0].t.slice(-300));
ok('la del equipo 2 trae la suya y renglones para las que faltan', /Más tornillos en el codo/.test(h2[1].t) && /Plan de mejora/.test(h2[1].t));
ok('las 10 rúbricas siguen saliendo en una hoja cada una (sin reducirse de más)', h2.length === 10 && h2.every(x => !x.z || Number(x.z) >= 0.9), h2.map(x => x.z).join(','));
await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT + '/rub2.pdf', format: 'Letter', preferCSSPageSize: true, printBackground: true }); await p.emulateMedia({ media: 'screen' });
const np = (execFileSync('pdfinfo', [OUT + '/rub2.pdf']).toString().match(/Pages:\s+(\d+)/) || [])[1];
ok('el PDF real de las 10 rúbricas sale en 10 páginas', np === '10', np);
execFileSync('pdftoppm', ['-r', '60', '-f', '1', '-l', '1', '-png', OUT + '/rub2.pdf', OUT + '/rub2']);
const h2c = await pr('[data-act=pfi-print][data-q=rub][data-c="1"]');
ok('también en «Rúbricas con los puntos capturados»', /Reforzar la base/.test(h2c[0].t));

// el 3er parcial: mismos equipos (copiados), sin nombre de proyecto propio
const r3 = await ev(r0 => { const E = window.E, S = E.store, g = E.data.grupoActual(), PJ = E.proyecto, PF = E.pruebas;
  const p3 = PJ.parciales(g).find(p => p.inicio > E.calc.parcial(r0.pid).inicio).id, src = PJ.doc(g, r0.pid).equipos;
  S.update('proy:' + g.id + ':' + p3, d => { d.equipos = src.map(e => ({ id: 'q' + e.id, nombre: e.nombre, al: e.al.slice(), nota: '' })); }, {});
  const eqs = PJ.doc(g, p3).equipos;
  return { p3, nombre: PJ.def(g, p3).nombre, proy: eqs.slice(0, 3).map(e => PJ.proyDe(g, p3, e)), tipos: eqs.slice(0, 3).map(e => PF.tipo(g, p3, e)), mej: PF.mejoras(g, p3, eqs[0]).length };
}, r0);
ok('el proyecto del 3er parcial se llama «Garra o brazo hidráulico»', r3.nombre === 'Garra o brazo hidráulico', r3.nombre);
ok('cada equipo hereda su mecanismo del 2º parcial (versión hidráulica)', r3.proy[0] === 'Garra de 3 dedos (versión hidráulica)' && r3.proy[1] === 'Brazo de 2 ejes (versión hidráulica)', JSON.stringify(r3.proy));
ok('y su tipo para la rúbrica (garra o brazo)', r3.tipos[0] === 'garra' && r3.tipos[1] === 'brazo', JSON.stringify(r3.tipos));
await ev(pid => { location.hash = '#/proyecto/' + pid; }, r3.p3); await esp(600);
const h3 = await pr('[data-act=pfi-print][data-q=rub]');
ok('la rúbrica del 3er parcial trae las mejoras del 2º para palomear si las hicieron', /Mejoras que comprometieron en el 2do parcial|Mejoras que comprometieron en el 2/.test(h3[0].t) && /Reforzar la base/.test(h3[0].t) && !/Plan de mejora hacia/.test(h3[0].t), h3[0].t.slice(-260));
ok('y el nombre del equipo con su mecanismo hidráulico', /Garra de 3 dedos \(versión hidráulica\)/.test(h3[0].t));
// un proyecto guardado con el nombre viejo se muestra con el nuevo
const viejo = await ev(p3 => { const E = window.E, S = E.store, g = E.data.grupoActual(); S.update('proy:' + g.id + ':' + p3, d => { d.def = { nombre: 'Grúa hidráulica', et: [{ id: 'x', t: 'Diseño', base: [], f: '' }] }; }, {}); return E.proyecto.def(g, p3).nombre; }, r3.p3);
ok('si lo tenías guardado como «Grúa hidráulica», ahora dice «Garra o brazo hidráulico»', viejo === 'Garra o brazo hidráulico', viejo);
// clases, temas y planeación del 3er parcial ya no hablan de grúa
const txt = await ev(() => { const E = window.E; return JSON.stringify([E.CLASES || null]).length; });
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

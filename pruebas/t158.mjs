import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const PORT = process.env.PORT || 8765;
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t158'; 
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
const t0 = await ev(() => document.getElementById('view').innerText);
ok('la tarjeta «Pruebas físicas» sale en Proyecto con cada equipo', /Pruebas físicas y bitácora de fallas/.test(t0) && (t0.match(/sin capturar/g) || []).length === 10, (t0.match(/sin capturar/g) || []).length + ' equipos');
ok('el tipo se lee del nombre del proyecto del equipo; si no dice, hay que elegirlo', JSON.stringify(r0.tipos.slice(0, 4)) === '["garra","brazo","grua",null]', JSON.stringify(r0.tipos.slice(0, 4)));
// sin tipo no deja imprimir rúbricas; se elige en la captura
const av = await ev(r0 => { document.querySelector('[data-act=pfi-print][data-q=rub]').click(); return document.getElementById('toasts').innerText; }, r0);
ok('si falta el tipo, avisa qué equipos', /Elige si es garra, brazo o grúa: Equipo 4/.test(av));
await ev(r0 => { const E = window.E; r0.eqs.slice(3).forEach((e, i) => E.changes['pfi-tipo']({ value: i % 2 ? 'brazo' : 'garra', dataset: { pid: r0.pid, eq: e.id } })); }, r0); await esp(300);
// imprimir rúbricas (una por equipo), bitácora por equipo y por alumno
const imp = await ev(async r0 => {
  const E = window.E, out = {}, txt = () => document.getElementById('print-root').innerText, hojas = () => document.querySelectorAll('#print-root .pfi-hoja').length;
  document.querySelector('[data-act=pfi-print][data-q=rub]').click(); await new Promise(r => setTimeout(r, 300));
  const hs = [...document.querySelectorAll('#print-root .pfi-hoja')]; out.rub = hojas(); out.rubGarra = /Garras Robóticas/.test(hs[0].innerText) && /Garra de 3 dedos/.test(hs[0].innerText); out.rubBrazo = /Brazos Robóticos y Grúas/.test(hs[1].innerText) && /Brazos Robóticos y Grúas/.test(hs[2].innerText);
  out.integ = E.data.alumnos(E.data.grupoActual()).filter(a => E.proyecto.doc(E.data.grupoActual(), r0.pid).equipos[0].al.indexOf(a.id) >= 0).every(a => hs[0].innerText.indexOf(a.nombre) >= 0);
  out.pts = [...hs[0].querySelectorAll('td.n')].map(td => td.textContent).join(',') === '20,15,15,25,25' && /Calificación Total/.test(hs[0].textContent);
  document.querySelector('[data-act=pfi-print][data-q=bitEq]').click(); await new Promise(r => setTimeout(r, 300)); out.bitEq = hojas(); out.bitTxt = txt();
  out.ck = (document.querySelector('#print-root .pfi-hoja').innerHTML.match(/<span class="ck">✓<\/span>Garra/) || []).length === 1;
  document.querySelector('[data-act=pfi-print][data-q=bitAl]').click(); await new Promise(r => setTimeout(r, 300)); out.bitAl = hojas(); out.bitAl1 = document.querySelector('#print-root .pfi-hoja').innerText;
  return out;
}, r0);
const tot = r0.eqs.reduce((s, e) => s + e.n, 0);
ok('rúbricas: una hoja por equipo, la de garras o la de brazos y grúas según el tipo, con proyecto e integrantes', imp.rub === 10 && imp.rubGarra && imp.rubBrazo && imp.integ && imp.pts);
ok('bitácora por equipo: una hoja por equipo, con el tipo de mecanismo marcado', imp.bitEq === 10 && imp.ck && /Fase 3: Plan de Mejora Continua/.test(imp.bitTxt));
ok('bitácora por alumno: una hoja por alumno con su nombre y su equipo', imp.bitAl === tot && /Reporte Técnico del Alumno/.test(imp.bitAl1) && /Nombre:/.test(imp.bitAl1), imp.bitAl + ' hojas');
// PDF real: una hoja por equipo con logo
await ev(() => document.querySelector('[data-act=pfi-print][data-q=rub]').click()); await esp(300);
await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT + '/rubricas.pdf', preferCSSPageSize: true, printBackground: false }); await p.emulateMedia({ media: 'screen' });
const pags = Number((execFileSync('pdfinfo', [OUT + '/rubricas.pdf']).toString().match(/Pages:\s+(\d+)/) || [])[1]);
execFileSync('pdftoppm', ['-r', '60', '-png', '-f', '1', '-l', '1', OUT + '/rubricas.pdf', OUT + '/rub']);
ok('el PDF de rúbricas sale con una hoja por equipo', pags === 10, pags + ' hojas');
// capturar el Equipo 1 (garra): 18, 15, 12, 20, 25 = 90
await ev(r0 => document.querySelector('[data-act=pfi-cap][data-eq="' + r0.eqs[0].id + '"]').click(), r0); await esp(300);
const vals = ['18', '15', '12', '20', '25'];
for (let i = 0; i < 5; i++) { await ev(([i, v]) => { const el = document.querySelectorAll('.modal [data-ch=pfi-pt]')[i]; el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); }, [i, vals[i]]); await esp(150); }
const malo = await ev(() => { const el = document.querySelectorAll('.modal [data-ch=pfi-pt]')[0]; el.value = '30'; el.dispatchEvent(new Event('change', { bubbles: true })); return document.getElementById('toasts').innerText; });
await ev(() => { const el = document.querySelectorAll('.modal [data-ch=pfi-pt]')[0]; el.value = '18'; el.dispatchEvent(new Event('change', { bubbles: true })); }); await esp(150);
await ev(r0 => { const d = document.querySelector('.modal details'); d.open = true; ['Reforzar la base con escuadras', 'Cambiar el eje por uno de 6 mm', 'Corregir los planos en FreeCAD'].forEach((t, i) => { const el = document.querySelector('.modal [data-ch=pfi-mej][data-i="' + i + '"]'); el.value = t; el.dispatchEvent(new Event('change', { bubbles: true })); }); const s = document.querySelector('.modal input[name=pfi-p1ok][value=si]'); s.checked = true; s.dispatchEvent(new Event('change', { bubbles: true })); const m = document.querySelector('.modal [data-ch=pfi-bit][data-k=mat]'); m.value = 'MDF de 3 mm'; m.dispatchEvent(new Event('change', { bubbles: true })); }, r0); await esp(300);
await p.screenshot({ path: OUT + '/captura.png', fullPage: true });
const r1 = await ev(r0 => {
  const E = window.E, g = E.data.grupoActual(), PF = E.pruebas, eq = E.proyecto.doc(g, r0.pid).equipos[0], id = PF.doc(g, r0.pid).actId, a = E.store.get('act:' + g.id + ':' + id);
  return { tot: PF.total(g, r0.pid, eq), totTxt: document.getElementById('pfi-tot').textContent, act: a && { cat: a.categoria, max: a.max, nombre: a.nombre, notas: eq.al.map(x => a.notas[x]) }, otros: a && Object.keys(a.notas).length, bit: PF.eq(g, r0.pid, eq.id).bit, nota: E.calc.nota(a, eq.al[0]) };
}, r0);
ok('capturar: el total se suma (90 / 100) y no deja pasar más puntos de los posibles', r1.tot === 90 && /90 \/ 100/.test(r1.totTxt) && /de 0 a 20 puntos/.test(malo), r1.totTxt);
ok('pasa a Calificaciones: actividad de Libreta, Proyecto y Bitácora con 90 a cada integrante', r1.act && r1.act.cat === 'trabajos' && r1.act.notas.every(n => n === 90) && r1.otros === r0.eqs[0].n && r1.nota === 90, JSON.stringify(r1.act));
ok('las respuestas de la bitácora y las 3 mejoras se guardan', r1.bit.mej.length === 3 && r1.bit.p1ok === 'si' && r1.bit.mat === 'MDF de 3 mm');
await ev(() => document.querySelector('.modal [data-act=pfi-cerrar]').click()); await esp(300);
const t1 = await ev(() => document.getElementById('view').innerText);
ok('la tarjeta y el equipo muestran «90 / 100»', /90 \/ 100/.test(t1) && /Prueba física: 90 \/ 100/.test(t1));
// rúbrica con puntos
const conP = await ev(r0 => { document.querySelector('[data-act=pfi-print][data-q=rub][data-c="1"]').click(); const h = document.querySelector('#print-root .pfi-hoja'); return h.querySelector('.tot').textContent + ' | ' + [...h.querySelectorAll('td.o')].map(td => td.textContent).join(','); }, r0);
ok('«Rúbricas con los puntos capturados» imprime los puntos y el total', /90 \/ 100/.test(conP) && /18,15,12,20,25/.test(conP), conP);
// 3er parcial: los mismos equipos; sus mejoras salen para palomearlas
const r2 = await ev(async r0 => {
  const E = window.E, g = E.data.grupoActual(), PJ = E.proyecto, p3 = PJ.parciales(g).find(p => p.inicio > E.calc.parcial(r0.pid).inicio); if (!p3) return { sin: true };
  location.hash = '#/proyecto/' + p3.id; await new Promise(r => setTimeout(r, 300));
  E.actions['pj-copiar']({ dataset: { pid: p3.id } }); await new Promise(r => setTimeout(r, 200)); E.actions['pj-edit-ok']({ dataset: { pid: p3.id } }); await new Promise(r => setTimeout(r, 400));
  const txt = document.getElementById('view').innerText, b = document.querySelector('[data-act=pfi-mej-ok]'); if (b) b.click(); await new Promise(r => setTimeout(r, 300));
  const hechas = ((E.pruebas.doc(g, p3.id).hechas || {})); return { p3: p3.nombre, mej: /Plan de mejora \(del 2º parcial\)/.test(txt) && /Reforzar la base con escuadras/.test(txt) && /Corregir los planos en FreeCAD/.test(txt), una: Object.keys(hechas).length === 1 && Object.keys(Object.values(hechas)[0]).length === 1, tarjeta: /Pruebas físicas y bitácora de fallas/.test(txt) };
}, r0);
await p.screenshot({ path: OUT + '/p3.png', fullPage: false });
ok('en el 3er parcial el equipo ve sus 3 mejoras y las palomea', !r2.sin && r2.mej && r2.una && r2.tarjeta, JSON.stringify(r2));
// editar una rúbrica
const r3 = await ev(async () => { const E = window.E; E.actions['pfi-rub-ed'](); await new Promise(r => setTimeout(r, 200)); const el = document.querySelector('.modal [data-ch=pfi-rub][data-k=garra][data-i="0"][data-f=pts]'); el.value = '30'; el.dispatchEvent(new Event('change', { bubbles: true })); await new Promise(r => setTimeout(r, 200)); const mx = E.pruebas.max('garra'); E.actions['pfi-rub-orig']({ dataset: { k: 'garra' } }); await new Promise(r => setTimeout(r, 200)); E.modal.close(); return { mx, mx2: E.pruebas.max('garra') }; });
ok('las rúbricas se editan (puntos posibles) y vuelven a la original', r3.mx === 110 && r3.mx2 === 100, JSON.stringify(r3));
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const PORT = process.env.PORT || 8765;
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t152';
mkdirSync(OUT, { recursive: true });
const SRC = (process.env.SRC || process.cwd());
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));

// 0) estático: sin sinLogo ni BANDA; el logo va fijo; cada impresión pasa por P.run
const pj = readFileSync(SRC + '/print.js', 'utf8');
const todos = readdirSync(SRC).filter(f => f.endsWith('.js') && f !== 'escuadra.min.js').map(f => [f, readFileSync(SRC + '/' + f, 'utf8')]);
const conSin = todos.filter(([, s]) => /sinLogo/.test(s)).map(([f]) => f);
ok('ya no existe sinLogo en ningún archivo', conSin.length === 0, conSin.join(',') || 'limpio');
ok('el logo va en el margen superior de @page como imagen (image-set, sale aunque «Gráficos de fondo» esté apagado)', /@top-right\{content:image-set\(url/.test(pj) && !/background:url\("' \+ LOGO/.test(pj) && !/BANDA/.test(pj));

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-10-30T11:10:00-06:00') });

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
// ===== v1.27.25: asistencia por DÍA =====
const r1 = await p.evaluate(() => {
  const E = window.E, C = E.calc, g = E.data.grupoActual(), pp = C.parcialActual(), al = E.data.alumnos(g);
  const fechas = C.fechasRegistradas(g, pp), fallos = [];
  // regla independiente: falta solo si no fue a ninguna clase del día
  al.forEach(a => {
    let a1 = 0, f1 = 0;
    fechas.forEach(f => { const doc = E.store.get('asis:' + g.id + ':' + f) || {}, cl = C.clasesDia(g, f), ms = cl.map(c => { const x = doc[a.id + '|' + c.k]; return x != null ? x : (doc[a.id] || 'A'); }); if (ms.some(m => C.cuenta(m))) a1++; else f1++; });
    const r = C.asis(g, pp, a.id); if (r.ses !== fechas.length || r.a !== a1 || r.f !== f1) fallos.push(a.nombre + ' ' + r.a + '/' + r.f + '/' + r.ses + ' vs ' + a1 + '/' + f1 + '/' + fechas.length);
  });
  // la hoja impresa
  E.print.asistencia(g, pp, { marcas: true });
  const root = document.getElementById('print-root'), tabs = [...root.querySelectorAll('table.att')], fl = C.fechasLista(g, pp);
  const filasCab = tabs.map(t => t.querySelectorAll('thead tr').length);
  const cols = tabs.reduce((s, t) => s + t.querySelectorAll('thead tr')[0].querySelectorAll('th').length, 0) - tabs.length * 2 - 2;
  const sym = { A: '•', F: 'F', R: 'R', J: 'J' }, fp = [];
  al.forEach(a => {
    const exp = fl.map(f => { const doc = E.store.get('asis:' + g.id + ':' + f); return doc ? sym[C.marca(doc, a.id, C.clasesCuenta(g, f)[0])] : ''; }).join('');
    let got = '', tA, tF; tabs.forEach((t, ti) => { const tr = [...t.querySelectorAll('tbody tr')].find(r => r.querySelector('td.nm').textContent === a.nombre), tds = [...tr.querySelectorAll('td')], ult = ti === tabs.length - 1; got += (ult ? tds.slice(2, -2) : tds.slice(2)).map(td => td.textContent.trim()).join(''); if (ult) { tA = tds[tds.length - 2].textContent; tF = tds[tds.length - 1].textContent; } });
    const r = C.asis(g, pp, a.id); if (got !== exp || String(r.a) !== tA || String(r.f) !== tF) fp.push(a.nombre + ' ' + got + ' vs ' + exp + ' · ' + tA + '/' + tF);
  });
  const nota = root.textContent.includes('A y F cuentan días');
  // la calificación usa el mismo porcentaje
  const a0 = al[0], k = C.cal(g, pp.id, a0.id), pct = C.asis(g, pp, a0.id).pct;
  // con el interruptor de Ajustes vuelve a contar clases
  E.store.update('config', c => { c.asisPorClase = true; }, {});
  const clasesTot = fechas.reduce((s, f) => s + Math.max(1, C.clasesDia(g, f).length), 0), sesClase = C.asis(g, pp, a0.id).ses;
  E.store.update('config', c => { c.asisPorClase = false; }, {});
  return { porClase: C.porClase(), fallos: fallos.slice(0, 4), nF: fallos.length, dias: fechas.length, fp: fp.slice(0, 3), nP: fp.length, cols: cols, fl: fl.length, filasCab: filasCab, nota: nota, comp: k.comp.asistencia, pct: pct, clasesTot: clasesTot, sesClase: sesClase, ses: C.asis(g, pp, a0.id).ses };
});
await p.evaluate(() => { const E = window.E; E.print.asistencia(E.data.grupoActual(), E.calc.parcialActual(), { marcas: true }); }); await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT + '/asis.pdf', preferCSSPageSize: true, printBackground: true }); await p.emulateMedia({ media: 'screen' });
ok('por omisión la asistencia cuenta por día', r1.porClase === false);
ok('C.asis: 1 día = 1 sesión; falta solo si faltó a todas las clases del día', r1.nF === 0, r1.nF ? r1.fallos.join(' | ') : r1.dias + ' días registrados, 40 alumnos');
ok('hoja impresa: una columna por día y un solo renglón de encabezado', r1.cols === r1.fl && r1.filasCab.every(n => n === 1), 'columnas ' + r1.cols + ' · días ' + r1.fl + ' · renglones ' + r1.filasCab.join(','));
ok('hoja impresa: cada celda es la marca del día y los totales = C.asis', r1.nP === 0, r1.fp.join(' | ') || 'coinciden');
ok('la nota al pie explica que A y F cuentan días', r1.nota);
ok('el 5 % de asistencia de la calificación usa el conteo por día', r1.comp != null && Math.abs(r1.comp - r1.pct) < 0.01, r1.comp + ' vs ' + r1.pct);
ok('con «Contar la asistencia por clase» encendido vuelve a contar clases', r1.sesClase === r1.clasesTot && r1.ses === r1.dias, r1.sesClase + ' clases · ' + r1.ses + ' días');

// ===== Tutoría: adeudos e inscripción =====
const a0 = await p.evaluate(() => { const al = window.E.data.alumnos(window.E.data.grupoActual()); return [al[0].id, al[1].id, al[0].nombre]; });
await p.evaluate(id => { location.hash = '#/tutoria/alumno/' + id; }, a0[0]); await p.waitForTimeout(500);
const tieneCard = await p.evaluate(() => /Inscripción y adeudos/.test(document.body.innerText));
ok('la ficha de tutoría del alumno tiene «Inscripción y adeudos»', tieneCard);
const add = async (tipo, t, extra) => { await p.evaluate(([tipo, t, extra]) => { document.querySelector('details.sub summary') && 0; const s = document.getElementById('ta-tipo'); s.value = tipo; document.getElementById('ta-t').value = t; Object.keys(extra || {}).forEach(k => { document.getElementById(k).value = extra[k]; }); document.querySelector('[data-act=ta-add]').click(); }, [tipo, t, extra]); await p.waitForTimeout(300); };
await add('mat', 'Matemáticas II', { 'ta-sem': '2°', 'ta-via': 'Extraordinario 15 nov' });
await add('pag', 'Cuota de inscripción', { 'ta-monto': '$350' });
await add('doc', 'Acta de nacimiento');
await p.evaluate(() => document.querySelector('[data-act=ta-ins][data-e=pen]').click()); await p.waitForTimeout(300);
await p.evaluate(() => { const c = [...document.querySelectorAll('h3')].find(h => /Inscripción y adeudos/.test(h.textContent)); c.scrollIntoView(); }); await p.screenshot({ path: OUT + '/ficha.png' });
const r2 = await p.evaluate(([aid, aid2]) => {
  const E = window.E, T = E.tutoria, g = E.data.grupoActual(), d = T.debe(g, aid);
  const ficha = document.body.innerText;
  // marcar el documento como resuelto
  const y = T.adeu(g)[aid].doc[0]; document.querySelector('[data-act=ta-ok][data-id="' + y.id + '"]').click();
  const d2 = T.debe(g, aid);
  E.store.update('tutadeu:' + g.id, x => { x[aid2] = { ins: { e: 'ins', f: '2026-10-30' } }; });
  location.hash = '#/tutoria/adeudos';
  return { d: { mat: d.mat.length, pag: d.pag.length, doc: d.doc.length, monto: d.pag[0] && d.pag[0].monto, sem: d.mat[0] && d.mat[0].sem, ins: d.ins && d.ins.e }, doc2: d2.doc.length, wa: /Avisar a casa/.test(ficha), msg: T.msgAdeudo(g, E.data.alumno(g, aid)), res: T.resumenAdeudos(g) };
}, [a0[0], a0[1]]);
await p.waitForTimeout(500);
const vista = await p.evaluate(() => document.body.innerText);
await p.screenshot({ path: OUT + '/adeudos.png' });
ok('se registran materia, pago (con monto) y documento, y la inscripción queda pendiente', r2.d.mat === 1 && r2.d.pag === 1 && r2.d.doc === 1 && r2.d.monto === 350 && r2.d.sem === '2°' && r2.d.ins === 'pen', JSON.stringify(r2.d));
ok('marcar ✓ quita el adeudo de lo pendiente', r2.doc2 === 0);
ok('botón «Avisar a casa» y mensaje con lo que falta', r2.wa && /Matemáticas II \(2° semestre\) — Extraordinario 15 nov/.test(r2.msg) && /Cuota de inscripción \(\$350\)/.test(r2.msg) && !/Acta/.test(r2.msg), r2.msg.split('\n').slice(1, 4).join(' / '));
ok('resumen del grupo: inscritos, pendientes, sin registrar y adeudos', /Inscritos: 1 de 40/.test(r2.res) && /Pendientes \(1\)/.test(r2.res) && /Sin registrar \(38\)/.test(r2.res) && /Matemáticas II \(2° sem\.\), Cuota de inscripción \$350/.test(r2.res), r2.res.split('\n').slice(0, 5).join(' / '));
ok('pestaña «Adeudos e inscripción» con conteos', /1 inscrito\b/.test(vista) && /1 pendiente\b/.test(vista) && /38 sin registrar/.test(vista) && /1 alumno con adeudos/.test(vista));
await p.evaluate(() => { location.hash = '#/tutoria/alumnos'; }); await p.waitForTimeout(400);
ok('en la lista de seguimiento sale «Debe: …»', await p.evaluate(() => /Debe: 1 materia · 1 pago/.test(document.body.innerText)));
await p.evaluate(() => { location.hash = '#/tutoria'; }); await p.waitForTimeout(400);
ok('Inicio de Tutoría resume adeudos e inscripción', await p.evaluate(() => /1 alumno con adeudos · 39 inscripciones pendientes o sin registrar/.test(document.body.innerText)));
ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const PORT = process.env.PORT || 8765;
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t154'; 
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
// ---------- datos: actividades y un examen con 40 alumnos ----------
await p.evaluate(() => {
  const E = window.E, g = E.data.grupoActual(), pp = E.calc.parcialActual(), al = E.data.alumnos(g), cl = E.calc.clases(g, pp);
  for (let k = 0; k < 4; k++) { const notas = {}; al.forEach((a, i) => { notas[a.id] = 55 + ((i * 7 + k * 11) % 45); }); E.store.put('act:' + g.id + ':a' + k, { id: 'a' + k, parcial: pp.id, categoria: 'trabajos', nombre: 'Práctica ' + (k + 1), peso: 1, max: 100, fecha: cl[k].fecha, notas: notas, cuenta: true }, { silent: true }); }
  E.store.put('act:' + g.id + ':afut', { id: 'afut', parcial: pp.id, categoria: 'trabajos', nombre: 'Reporte de la práctica de levas', peso: 1, max: 100, fecha: '2026-11-04', notas: {}, cuenta: true }, { silent: true });
});

/* ===== 15. errores ===== */
const r15 = await p.evaluate(async () => {
  const E = window.E; E.errores.borrar();
  const bt = document.createElement('button'); bt.onclick = () => { throw new Error('prueba-error-escuadra global'); }; document.body.appendChild(bt); bt.click(); bt.remove();
  await new Promise(r => setTimeout(r, 50));
  console.error('falló algo', new Error('prueba-error-escuadra atrapado'));
  E.views.xprueba = () => { throw new Error('prueba-error-escuadra pantalla'); };
  location.hash = '#/xprueba'; await new Promise(r => setTimeout(r, 300));
  const pant = document.getElementById('view').innerText, btnOk = !!document.querySelector('#view [data-act=err-copiar]');
  document.querySelector('#view [data-act=err-copiar]').click(); await new Promise(r => setTimeout(r, 100));
  location.hash = '#/ajustes'; await new Promise(r => setTimeout(r, 400));
  return { L: E.errores.lista().map(x => x.o + ':' + x.m), pant: /Algo falló/.test(pant), btnOk, rep: window.__clip.slice(-1)[0] || '', aj: /Reporte de errores/.test(document.body.innerText) && /3 errores anotados/.test(document.body.innerText) };
});
ok('15 · errores: se anotan los de la página, los atrapados y los de pantalla', ['error:', 'atrapado:', 'pantalla:'].every(k => r15.L.some(x => x.indexOf(k) === 0)), r15.L.join(' | '));
ok('15 · la pantalla de error trae «Copiar reporte para Claude» y copia versión y errores', r15.pant && r15.btnOk && /Reporte de errores de Escuadra/.test(r15.rep) && /Versión: 1\.\d+\.\d+/.test(r15.rep) && /prueba-error-escuadra pantalla/.test(r15.rep), r15.rep.split('\n').slice(0, 2).join(' / '));
ok('15 · Ajustes muestra el reporte de errores', r15.aj);

/* ===== 7. tamaño de letra ===== */
const r7 = await p.evaluate(async () => {
  const E = window.E, sel = document.querySelector('select[data-path=letra]'); if (!sel) return { sel: false };
  const antes = getComputedStyle(document.documentElement).fontSize;
  sel.value = '1.25'; sel.dispatchEvent(new Event('change', { bubbles: true })); await new Promise(r => setTimeout(r, 200));
  const html = getComputedStyle(document.documentElement).fontSize, body = getComputedStyle(document.body).fontSize;
  E.store.update('config', c => { c.letra = '1'; }, {}); E.applyTheme();
  return { sel: true, antes, html, body, despues: getComputedStyle(document.documentElement).fontSize };
});
ok('7 · «Tamaño de letra» en Ajustes escala la app (Muy grande = 125 %)', r7.sel && r7.antes === '16px' && r7.html === '20px' && r7.body === '18.75px' && r7.despues === '16px', JSON.stringify(r7));

/* ===== 5. arranque: ajustes en memoria y ayuda bajo demanda ===== */
const r5 = await p.evaluate(async () => {
  const E = window.E, D = E.data, a = D.cfg(), b = D.cfg(); E.store.update('config', c => { c.docenteCorto = 'Prof. Nacho'; }, {}); const c = D.cfg();
  const sinAyuda = !window.ESCUADRA_AYUDA && ![...document.scripts].some(s => /ayuda-data/.test(s.src));
  location.hash = '#/ayuda'; await new Promise(r => setTimeout(r, 900));
  return { mismo: a === b, nuevo: c !== a && c.docenteCorto === 'Prof. Nacho', sinAyuda, ayuda: (document.querySelectorAll('.ay-sec').length) };
});
ok('5 · los Ajustes se arman una sola vez entre cambios (y se rehacen al cambiar)', r5.mismo && r5.nuevo);
ok('5 · el texto del manual no se carga al abrir; la ayuda lo trae al entrar', r5.sinAyuda && r5.ayuda > 20, 'secciones ' + r5.ayuda);

/* ===== 6. lupa ===== */
const r6 = await p.evaluate(async () => {
  const E = window.E, C = E.calc, g = E.data.grupoActual(), a = E.data.alumnos(g)[0], f = E.u.today();
  // el 30 de octubre es consejo técnico (asueto): para probar, se quita
  E.store.put('parciales', E.data.parciales().map(p => Object.assign({}, p, { asuetos: (p.asuetos || []).filter(x => x !== f) })));
  const busca = async q => { E.actions.buscar(); const i = document.getElementById('bs-q'); i.value = q; i.dispatchEvent(new Event('input', { bubbles: true })); await new Promise(r => setTimeout(r, 120)); return document.getElementById('bs-out'); };
  let o = await busca('falta ' + a.nombre.split(' ')[0] + ' ' + a.nombre.split(' ')[1]); const bF = o.querySelector('[data-act=bs-asis][data-aid="' + a.id + '"][data-st=F]'); const antes = C.marca(E.store.get('asis:' + g.id + ':' + f) || {}, a.id, null);
  if (bF) bF.click(); await new Promise(r => setTimeout(r, 150)); const despues = C.marca(E.store.get('asis:' + g.id + ':' + f) || {}, a.id, null);
  o = await busca('imprimir rubrica'); const pr = [...o.querySelectorAll('button.bs-cmd')].map(b => b.dataset.act + ':' + b.innerText.split('\n')[0]);
  o = await busca('adeudos'); const sec = [...o.querySelectorAll('[data-to]')].map(x => x.dataset.to);
  o = await busca('historial'); const sec2 = [...o.querySelectorAll('[data-to]')].map(x => x.dataset.to);
  o = await busca('imprimir qr grupo'); const pr2 = [...o.querySelectorAll('button.bs-cmd')].map(b => b.dataset.act);
  E.modal.close();
  return { bF: !!bF, antes, despues, pr, sec, sec2, pr2, esClase: C.esClase(g, f) };
});
ok('6 · «falta Nombre» marca la falta de hoy desde la lupa', r6.bF && r6.esClase && r6.antes === 'A' && r6.despues === 'F', JSON.stringify([r6.antes, r6.despues]));
ok('6 · «imprimir rúbrica» ofrece los botones de Imprimir', r6.pr.some(x => /^pr-rubrica/.test(x)), r6.pr.map(x => x.split(':')[0]).join(', '));
ok('6 · secciones por nombre o descripción («adeudos» → Tutoría no aplica; «historial» → Historial)', r6.sec2.indexOf('historial') >= 0, 'adeudos: ' + r6.sec.join(',') + ' · historial: ' + r6.sec2.join(','));
ok('6 · «imprimir qr grupo» encuentra el QR del salón', r6.pr2.indexOf('sl-print') >= 0, r6.pr2.join(','));

/* ===== 8. vista previa con miniatura ===== */
const r8 = await p.evaluate(async () => {
  const E = window.E, g = E.data.grupoActual(); E.store.update('config', c => { c.vistaImpresion = true; }, {});
  E.print.asistencia(g, E.calc.parcialActual(), { marcas: true }); await new Promise(r => setTimeout(r, 200));
  const m = document.querySelector('.modal .pv-mini'), img = m && m.querySelector('img'), r = m && m.getBoundingClientRect(), ri = img && img.getBoundingClientRect();
  return { hay: !!m, w: r && Math.round(r.width), h: r && Math.round(r.height), logo: ri && [Math.round(r.right - ri.right), Math.round(ri.top - r.top), Math.round(ri.width)], tabla: !!(m && m.querySelector('table.att')), txt: (document.querySelector('.modal') || {}).innerText || '' };
});
await p.screenshot({ path: OUT + '/vista-previa.png' });
await p.evaluate(() => window.E.modal.close());
ok('8 · la vista previa dibuja la hoja 1 (horizontal) con logo arriba a la derecha y la tabla', r8.hay && r8.tabla && r8.w > r8.h && Math.abs(r8.logo[0] - 9 * 96 / 25.4 * 330 / 1056) < 1.5 && Math.abs(r8.logo[1] - 9 * 96 / 25.4 * 330 / 1056) < 1.5 && Math.abs(r8.logo[2] - 17 * 96 / 25.4 * 330 / 1056) < 1.5 && /Así sale la hoja 1/.test(r8.txt), JSON.stringify({ w: r8.w, h: r8.h, logo: r8.logo }));

/* ===== 9. historial de cambios ===== */
const r9 = await p.evaluate(async () => {
  const E = window.E, S = E.store, g = E.data.grupoActual(), k = 'act:' + g.id + ':a0', a = E.data.alumnos(g)[3];
  const n0 = S.get(k).notas[a.id];
  E.undo.run('nota', () => S.update(k, x => { x.notas[a.id] = 11; }));
  E.undo.run('nota', () => S.update(k, x => { x.notas[E.data.alumnos(g)[5].id] = 12; }));
  location.hash = '#/historial'; await new Promise(r => setTimeout(r, 300));
  const txt = document.getElementById('view').innerText, L = E.historial.entradas();
  const x = L.find(y => y.prev[k] && y.prev[k].data.notas[a.id] === n0);
  document.querySelector('[data-act=hist-rev][data-id="' + x.id + '"]').click(); await new Promise(r => setTimeout(r, 300));
  const n2 = S.get(k).notas[a.id], otra = S.get(k).notas[E.data.alumnos(g)[5].id];
  const guardado = await E.idb.get('hist');
  return { txt: /Historial de cambios/.test(txt) && /Cambio de calificación/.test(txt) && /Actividad «Práctica 1»/.test(txt), n0, n2, otra, idb: !!(guardado && guardado[E.u.today()] && guardado[E.u.today()].length >= 2), rev: document.getElementById('view').innerText.indexOf('Revertido') >= 0 };
});
ok('9 · el historial lista los cambios con palabras («Cambio de calificación · Actividad «Práctica 1»»)', r9.txt);
ok('9 · revertir un cambio regresa ese documento a como estaba antes (avisa si cambió después)', r9.n2 === r9.n0 && r9.rev, 'nota ' + r9.n0 + ' → 11 → ' + r9.n2 + ' (la que cambió después: ' + r9.otra + ')');
ok('9 · el historial se guarda en el aparato (IndexedDB)', r9.idb);

/* ===== 1. cerrar parcial ===== */
const r1 = await p.evaluate(async () => {
  const E = window.E, C = E.calc, S = E.store, g = E.data.grupoActual(), pp = C.parcialActual(), al = E.data.alumnos(g);
  location.hash = '#/precierre/' + pp.id; await new Promise(r => setTimeout(r, 300));
  const b = document.querySelector('#view [data-act=cz-cerrar]'); if (b) b.click(); await new Promise(r => setTimeout(r, 300));
  const foto = {}; al.forEach(a => { foto[a.id] = C.cal(g, pp.id, a.id).final; });
  const acta0 = C.actaFila(g, al[0].id).join('|');
  // cambia la forma de contar la asistencia y baja una actividad: con los datos de hoy cambian, la foto no
  E.undo.run('cfg', () => S.update('config', c => { c.asisPorClase = true; }, {}));
  E.undo.run('nota', () => S.update('act:' + g.id + ':a1', x => { al.slice(0, 6).forEach(a => { x.notas[a.id] = 0; }); }));
  await new Promise(r => setTimeout(r, 1200));
  const toast = document.getElementById('toasts').innerText;
  const igual = al.every(a => C.cal(g, pp.id, a.id).final === foto[a.id]), vivo = al.filter(a => C.calVivo(g, pp.id, a.id).final !== foto[a.id]).length, difs = E.cerrar.difs(g, pp.id).length;
  const acta1 = C.actaFila(g, al[0].id).join('|');
  location.hash = '#/precierre/' + pp.id; await new Promise(r => setTimeout(r, 300)); const pc = document.getElementById('view').innerText;
  location.hash = '#/calificaciones/' + pp.id; await new Promise(r => setTimeout(r, 300)); const cal = document.getElementById('view').innerText;
  // consulta para casa: usa la foto
  const cons = E.casa.consultaDatos(g, al[0], pp.id).c;
  E.cerrar.reabrir(g, pp.id); const reab = al.filter(a => C.cal(g, pp.id, a.id).final !== foto[a.id]).length;
  E.cerrar.cerrar(g, pp.id); S.update('config', c => { c.asisPorClase = false; }, {});
  return { cerro: !!b, igual, vivo, difs, toast: /otra calificación en el/.test(toast), acta: acta0 === acta1, pc: /cerrado/.test(pc) && /tendrían otra calificación/.test(pc), cal: /cerrado el/.test(cal), cons: cons === foto[al[0].id], reab, n: al.length };
});
ok('1 · «Cerrar parcial» en Pre-cierre congela las calificaciones aunque cambien ajustes y notas', r1.cerro && r1.igual && r1.vivo > 0 && r1.difs === r1.vivo, r1.vivo + ' de ' + r1.n + ' cambiarían con los datos de hoy; la foto no cambió');
ok('1 · el acta y la consulta para casa usan la foto', r1.acta && r1.cons);
ok('1 · aviso al hacer un cambio que movería calificaciones cerradas, y Pre-cierre/Calificaciones lo dicen', r1.toast && r1.pc && r1.cal);
ok('1 · reabrir vuelve al cálculo con los datos de hoy', r1.reab === r1.vivo, r1.reab);

/* ===== 2. adeudos y notas de tutoría cifrados con el PIN ===== */
const r2 = await p.evaluate(async () => {
  const E = window.E, S = E.store, SC = E.secreto, T = E.tutoria, g = E.data.grupoActual(), a = E.data.alumnos(g)[0];
  S.update('tutadeu:' + g.id, d => { d[a.id] = { ins: { e: 'pen', f: '2026-10-30' }, mat: [{ id: 'm1', t: 'Matemáticas II', sem: '2°', ok: false }], pag: [{ id: 'p1', t: 'Cuota de inscripción', monto: 350, ok: false }] }; }, {});
  S.update('tutseg:' + g.id, d => { d[a.id] = { estado: 'seg', notas: [{ id: 'n1', f: '2026-10-30', t: 'Se compromete a entregar la práctica 3' }] }; }, {});
  const n = await SC.activar('4821', false); await new Promise(r => setTimeout(r, 300));
  const crudo = JSON.stringify([S.docs['tutadeu:' + g.id], S.docs['tutseg:' + g.id]]);
  const ve = T.debe(g, a.id).mat.length === 1 && (T.seg(g)[a.id] || {}).estado === 'seg';
  // agregar estando desbloqueada: se guarda cifrado
  E.undo.run('ta-add', () => S.update('tutadeu:' + g.id, d => { d[a.id].doc = [{ id: 'd1', t: 'Acta de nacimiento', ok: false }]; }, {}));
  await new Promise(r => setTimeout(r, 400));
  const crudo2 = JSON.stringify(S.docs['tutadeu:' + g.id]), doc1 = T.debe(g, a.id).doc.length;
  const hist = JSON.stringify(await E.idb.get('hist'));
  await SC.bloquear(true); await new Promise(r => setTimeout(r, 100));
  const bloq = T.debe(g, a.id).mat.length;
  S.update('tutadeu:' + g.id, d => { d.x = 1; }, {});
  const sigue = JSON.stringify(S.docs['tutadeu:' + g.id]) === crudo2;
  location.hash = '#/tutoria/adeudos'; await new Promise(r => setTimeout(r, 300)); const cand = /protegidos con tu PIN/.test(document.getElementById('view').innerText);
  const ab = await SC.abrir('4821', false); await new Promise(r => setTimeout(r, 300));
  return { n, claro: /Matem|Cuota|compromete/.test(crudo), enc: /__enc/.test(crudo), ve, claro2: /Acta de nac/.test(crudo2), doc1, histClaro: /Matem|Acta de nac|compromete/.test(hist), bloq, sigue, cand, ab, vuelve: T.debe(g, a.id).doc.length === 1 && T.debe(g, a.id).mat[0].t === 'Matemáticas II' };
});
ok('2 · al activar el PIN, adeudos y notas de tutoría quedan cifrados (sin texto en claro en los datos)', r2.enc && !r2.claro && r2.ve, 'cifrados: ' + r2.n);
ok('2 · lo nuevo también se guarda cifrado y el historial no guarda texto en claro', !r2.claro2 && r2.doc1 === 1 && !r2.histClaro);
ok('2 · bloqueada: no se ven ni se pueden cambiar, y Tutoría muestra el candado', r2.bloq === 0 && r2.sigue && r2.cand);
ok('2 · con el PIN vuelven a verse', r2.ab && r2.vuelve);

/* ===== 12. adeudos en la vista de la co-tutora ===== */
const ctUrl = await p.evaluate(async () => { const E = window.E, g = E.data.grupoActual(); return location.href.split('#')[0].replace(/[^/]*$/, '') + 'tutora.html#' + await E.cotutora.cifra(E.cotutora.datos(g), '2468'); });
const p3 = await ctx.newPage(); await p3.goto(ctUrl); await p3.waitForTimeout(500); await p3.fill('#pin', '2468'); await p3.click('#ok'); await p3.waitForTimeout(1500);
const t12 = await p3.evaluate(() => document.body.innerText); await p3.screenshot({ path: OUT + '/cotutora.png', fullPage: true }); await p3.close();
ok('12 · la vista de la co-tutora trae «Inscripción y adeudos» con lo que debe cada quien', /Inscripción y adeudos/.test(t12) && /Materia: Matemáticas II/.test(t12) && /Pago: Cuota de inscripción \(\$350\)/.test(t12) && /1\s*pendientes/.test(t12), (t12.match(/Inscripción y adeudos[\s\S]{0,160}/) || [''])[0].replace(/\n/g, ' '));

/* ===== 3. comprobante del repaso para casa ===== */
const rep = await p.evaluate(async () => { const E = window.E, g = E.data.grupoActual(), a = E.data.alumnos(g)[4]; await E.cam.qrListo(); return { aid: a.id, num: a.num, ua: await E.casa.repasoURL(g, a), ug: await E.casa.repasoURL(g, null), num2: E.data.alumnos(g)[7].num, aid2: E.data.alumnos(g)[7].id }; });
const contesta = async (url, num) => {
  const q = await ctx.newPage(); await q.goto(url); await q.waitForTimeout(500); let bien = 0;
  for (let i = 0; i < 12; i++) {
    if (!(await q.$('.op'))) break;
    await q.click('.op:nth-of-type(' + (1 + (i % 2)) + ')'); await q.waitForTimeout(60);
    if (/Correcto/.test(await q.innerText('#fb'))) bien++;
    await q.click('#sig'); await q.waitForTimeout(80);
  }
  if (num) { await q.fill('#num', String(num)); await q.click('#vcod'); await q.waitForTimeout(100); }
  const cod = (await q.innerText('#cod .score')).trim(), txt = await q.innerText('body');
  // volver a empezar y contestar todo bien: el código no cambia (cuenta el primer intento)
  await q.click('#otra'); await q.waitForTimeout(100);
  for (let i = 0; i < 12; i++) { if (!(await q.$('.op'))) break; const okb = await q.$$eval('.op', bs => 0); await q.click('.op'); await q.waitForTimeout(40); await q.click('#sig'); await q.waitForTimeout(60); }
  if (num) { await q.fill('#num', String(num)); await q.click('#vcod'); await q.waitForTimeout(100); }
  const cod2 = (await q.innerText('#cod .score')).trim();
  await q.close(); return { bien, cod, cod2, txt };
};
const ca = await contesta(rep.ua), cg = await contesta(rep.ug, rep.num2);
const r3 = await p.evaluate(async x => {
  const E = window.E, CA = E.casa, g = E.data.grupoActual();
  CA.verifica.toString();
  const reg = (aid, cod) => E.changes['rc-cod']({ value: cod, dataset: { aid: aid }, closest: () => null });
  reg(x.aid, x.ca.cod); reg(x.aid2, x.cg.cod); reg(x.aid2, '0000');
  const ra = CA.resultados(g, x.aid), rg = CA.resultados(g, x.aid2);
  const pt = CA.parcialTemas(g, E.data.alumno(g, x.aid));
  E.actions['rc-abrir'](); await new Promise(r => setTimeout(r, 100)); const modal = document.querySelector('.modal').innerText; E.modal.close();
  return { ra, rg, propio: pt.propio, modal: /Códigos del repaso/.test(modal) && /✓ \d de 5/.test(modal) };
}, { aid: rep.aid, aid2: rep.aid2, ca, cg });
ok('3 · al terminar, el repaso da un código de 4 dígitos (y el del grupo pide el número de lista)', /^\d{4}$/.test(ca.cod) && /^\d{4}$/.test(cg.cod) && /Tu código para tu profe/.test(ca.txt), ca.cod + ' · ' + cg.cod);
ok('3 · el código cuenta el primer intento aunque lo vuelva a hacer', ca.cod === ca.cod2 && cg.cod === cg.cod2);
ok('3 · al capturarlo, la app reconoce el repaso y cuántas tuvo bien', r3.ra.length === 1 && r3.ra[0].ok === ca.bien && r3.ra[0].n === 5 && r3.rg.length === 1 && r3.rg[0].ok === cg.bien && r3.rg[0].n === 10 && r3.rg[0].k === 'g', JSON.stringify([r3.ra[0], r3.rg[0]]));
ok('3 · un código equivocado no se registra, y los resultados cuentan para sus temas difíciles', r3.rg.length === 1 && r3.propio && r3.modal);

/* ===== 10. preguntas confusas del examen ===== */
const r10 = await p.evaluate(async () => {
  const E = window.E, X = E.examen, g = E.data.grupoActual(), pp = E.calc.parcialActual(), al = E.data.alumnos(g);
  const r = X.generar(g, { pid: pp.id, fecha: pp.fin, n: 10, total: 100, dur: 50, mezcla: 'eq', abiertas: 0, repaso: false, seed: 'exa_t154' });
  const its = r.items, mala = its[2].id, res = {};
  al.forEach((a, i) => { const m = {}, buen = i >= 20; its.forEach((it, j) => { m[it.id] = it.id === mala ? (buen ? 0 : 1) : (buen ? (j % 5 ? 1 : 0) : (j % 2 ? 1 : 0)); }); res[a.id] = { m: m }; });
  E.store.put('exa:' + g.id + ':exa_t154', { id: 'exa_t154', parcial: pp.id, titulo: 'Examen de prueba', fecha: pp.fin, dur: 50, total: 100, mezcla: 'eq', abiertas: 0, seed: 'exa_t154', items: its, horas: r.horas, rep: r.rep, creado: new Date().toISOString(), res: res });
  const an = X.analisis(g, E.store.get('exa:' + g.id + ':exa_t154')), revisa = Object.keys(an.items).filter(id => an.items[id].revisa);
  location.hash = '#/examen/exa_t154/analisis'; await new Promise(r => setTimeout(r, 400));
  return { revisa, mala, d: an.items[mala].d, txt: document.getElementById('view').innerText };
});
ok('10 · la pregunta que fallan los que van mejor sale en «Preguntas para revisar»', r10.revisa.indexOf(r10.mala) >= 0 && r10.revisa.length <= 3 && r10.d < 0 && /Preguntas para revisar/.test(r10.txt) && /al revés/.test(r10.txt), 'marcadas ' + r10.revisa.length + ' · discriminación ' + r10.d.toFixed(2));

/* ===== 11. QR del grupo para el salón ===== */
const r11 = await p.evaluate(async () => {
  const E = window.E, g = E.data.grupoActual(), pp = E.calc.parcialActual();
  E.store.update('config', c => { c.vistaImpresion = false; }, {});
  const orig = window.print; window.print = () => { }; await E.actions['sl-print']({ dataset: { pid: pp.id } }); await new Promise(r => setTimeout(r, 300)); window.print = orig;
  const root = document.getElementById('print-root'); return { qr: !!root.querySelector('svg.sl-qr'), txt: root.innerText, url: await E.salon.url(g, pp.id) };
});
const p4 = await ctx.newPage(); await p4.goto(r11.url); await p4.waitForTimeout(600); const t11 = await p4.innerText('body'); await p4.screenshot({ path: OUT + '/grupo.png', fullPage: true }); await p4.close();
ok('11 · la hoja del salón lleva QR, entregas y examen', r11.qr && /Próximas entregas/.test(r11.txt) && /Reporte de la práctica de levas/.test(r11.txt) && /Examen/.test(r11.txt), r11.txt.replace(/\s+/g, ' ').slice(0, 140));
ok('11 · el QR abre grupo.html con las entregas y la fecha del examen', /Próximas entregas/.test(t11) && /Reporte de la práctica de levas/.test(t11) && /Examen:/.test(t11) && !/Karla|Cruz/.test(t11), t11.replace(/\s+/g, ' ').slice(0, 160));

/* ===== 13. planeación en .docx con logo en cada hoja ===== */
const r13 = await p.evaluate(async () => {
  const E = window.E, g = E.data.grupoActual(), pp = E.calc.parcialActual(); let pl = E.data.planes(g.id)[0];
  if (!pl) { try { pl = E.planes.nueva(g, pp.id); E.store.put('plan:' + pl.id, pl, { silent: true }); } catch (e) { return { err: e.message }; } }
  const blob = E.docx.plan(pl), b = new Uint8Array(await blob.arrayBuffer());
  return { bytes: Array.from(b), tipo: blob.type };
});
let r13ok = false, r13det = r13.err || '';
if (!r13.err) {
  const dx = OUT + '/plan.docx'; writeFileSync(dx, Buffer.from(r13.bytes));
  const py = `
import docx, json, zipfile
d = docx.Document('${dx}')
s = d.sections[0]
hdr = s.header
imgs = [r for r in hdr.part.rels.values() if 'image' in r.reltype]
print(json.dumps({'tablas': len(d.tables), 'img_header': len(imgs), 'parrafos': len(d.paragraphs), 'texto': ' '.join(c.text for t in d.tables[:3] for row in t.rows for c in row.cells)[:200], 'zip_ok': zipfile.ZipFile('${dx}').testzip() is None}))`;
  const info = JSON.parse(execFileSync('python3', ['-c', py]).toString().trim());
  let hayLO = true; try { execFileSync('soffice', ['--version'], { stdio: 'ignore' }); } catch (e) { hayLO = false; }
  let pags = 2;
  if (hayLO) { execFileSync('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', OUT, dx], { stdio: 'ignore', timeout: 120000 });
  const pdf = OUT + '/plan.pdf'; pags = Number((execFileSync('pdfinfo', [pdf]).toString().match(/Pages:\s+(\d+)/) || [])[1] || 0);
  execFileSync('pdftoppm', ['-r', '50', '-png', pdf, OUT + '/plan']); }
  const py2 = `
import glob, json
from PIL import Image
r = []
for f in sorted(glob.glob('${OUT}/plan-*.png')):
    im = Image.open(f).convert('RGB'); w, h = im.size; px = w / 215.9
    reg = im.crop((int(w - 50 * px), 0, w, int(35 * px)))
    r.append(sum(1 for q in reg.get_flattened_data() if q[2] > 120 and q[0] < 110))
print(json.dumps(r))`;
  const azul = hayLO ? JSON.parse(execFileSync('python3', ['-c', py2]).toString().trim()) : [999];
  r13ok = r13.tipo.indexOf('wordprocessingml') > 0 && info.zip_ok && info.tablas >= 5 && info.img_header === 1 && pags >= 2 && azul.every(x => x > 100);
  r13det = info.tablas + ' tablas · logo en el encabezado · ' + (hayLO ? pags + ' hojas en LibreOffice, logo en ' + azul.filter(x => x > 100).length : 'sin LibreOffice: revisado por dentro') + ' · «' + info.texto.slice(0, 60) + '»';
}
ok('13 · «Word» descarga un .docx real: tablas de la planeación y el logo en el encabezado de cada hoja', r13ok, r13det);

/* ===== 14. respaldos diarios (aparato y nube) ===== */
const r14 = await p.evaluate(async () => {
  const E = window.E, S = E.store, RS = E.respaldo, g = E.data.grupoActual(), k = 'act:' + g.id + ':a2', a = E.data.alumnos(g)[1];
  // nube falsa (Supabase en memoria) con los mismos métodos que usa la app
  const rows = [];
  const qb = () => { const st = { f: [], ord: null, lim: null, del: false }; const api = {
    select() { return api; }, gt(k, v) { st.f.push(r => r[k] > v); return api; }, lt(k, v) { st.f.push(r => r[k] < v); return api; }, eq(k, v) { st.f.push(r => r[k] === v); return api; },
    like(k, p) { const re = new RegExp('^' + p.replace(/%/g, '.*') + '$'); st.f.push(r => re.test(r[k])); return api; },
    not(k, op, p) { const re = new RegExp('^' + p.replace(/%/g, '.*') + '$'); st.f.push(r => !re.test(r[k])); return api; },
    order(k, o) { st.ord = [k, o && o.ascending === false ? -1 : 1]; return api; }, limit(n) { st.lim = n; return api; }, delete() { st.del = true; return api; },
    upsert(rs) { rs.forEach(x => { const i = rows.findIndex(r => r.key === x.key), row = Object.assign({}, JSON.parse(JSON.stringify(x)), { updated_at: new Date(Date.now() + rows.length).toISOString() }); if (i >= 0) rows[i] = row; else rows.push(row); }); return Promise.resolve({ error: null }); },
    then(res, rej) { let L = rows.filter(r => st.f.every(f => f(r))); if (st.del) { L.forEach(r => rows.splice(rows.indexOf(r), 1)); return Promise.resolve({ error: null }).then(res, rej); } if (st.ord) L.sort((x, y) => (x[st.ord[0]] > y[st.ord[0]] ? 1 : -1) * st.ord[1]); if (st.lim) L = L.slice(0, st.lim); return Promise.resolve({ data: L.map(r => Object.assign({}, r)), error: null }).then(res, rej); } }; return api; };
  E.sync.client = { from: () => qb(), auth: { signOut: async () => { } } }; E.sync.user = { id: 'u1' };
  rows.push({ user_id: 'u1', key: 'respaldo:2026-09-15', data: { v: 1, f: '2026-09-15', j: '{}' }, client_ts: '2026-09-15T10:00:00Z', updated_at: '2026-09-15T10:00:00Z', deleted: false });
  rows.push({ user_id: 'u1', key: 'respaldo:2026-10-01', data: { v: 1, f: '2026-10-01', j: '{}' }, client_ts: '2026-10-01T10:00:00Z', updated_at: '2026-10-01T10:00:00Z', deleted: false });
  rows.push({ user_id: 'u1', key: 'xprueba:1', data: { hola: 1 }, client_ts: '2026-10-30T10:00:00Z', updated_at: '2026-10-30T10:00:00Z', deleted: false });
  E.sync.setMeta({ lastPull: '1970-01-01T00:00:00Z', respNube: '' });
  await E.sync.pull();
  const bajo = !!S.docs['xprueba:1'], noBajo = !S.docs['respaldo:2026-10-01'];
  const n0 = S.get(k).notas[a.id];
  await RS.local('prueba'); const okNube = await RS.nubeHoy();
  const L = await RS.locales(), N = await RS.nube();
  const viejo = rows.some(r => r.key === 'respaldo:2026-09-15'), reciente = rows.some(r => r.key === 'respaldo:2026-10-01');
  // cambia y borra algo, luego restaura el de hoy desde la nube
  S.update(k, x => { x.notas[a.id] = 1; }, {}); S.put('act:' + g.id + ':nueva', { id: 'nueva', parcial: 'p2', nombre: 'Borrar al restaurar', notas: {} });
  const x = await RS.bajaNube(E.u.today()); const n = await RS.restaura(x, 'hoy');
  const vuelve = S.get(k).notas[a.id] === n0, sinNueva = !S.get('act:' + g.id + ':nueva');
  const antes = (await RS.locales()).some(y => /^antes-/.test(y.f));
  location.hash = '#/ajustes'; await new Promise(r => setTimeout(r, 900)); const aj = document.body.innerText;
  const fila = rows.find(r => r.key === 'respaldo:' + E.u.today());
  E.sync.client = null; E.sync.user = null;
  return { reciente, bajo, noBajo, okNube, L: L.map(y => y.f), N: N.map(y => y.f), viejo, vuelve, sinNueva, n, antes, aj: /Respaldos diarios/.test(aj) && /En tu nube/.test(aj) && /Restaurar/.test(aj), comprimido: !!(fila && fila.data.z), kb: fila ? Math.round(fila.data.bytes / 1024) : 0, crudo: fila ? Math.round(fila.data.crudo / 1024) : 0 };
});
ok('14 · la sincronización no baja los respaldos de la nube a los aparatos', r14.bajo && r14.noBajo);
ok('14 · respaldo diario en el aparato y en la nube (comprimido); borra los de más de 30 días', r14.okNube && r14.L.indexOf('2026-10-30') >= 0 && r14.N.indexOf('2026-10-30') >= 0 && !r14.viejo && r14.reciente && r14.comprimido, r14.crudo + ' KB → ' + r14.kb + ' KB · ' + JSON.stringify({ L: r14.L, N: r14.N, viejo: r14.viejo }));
ok('14 · restaurar regresa todo a como estaba (y guarda «antes de restaurar»)', r14.vuelve && r14.sinNueva && r14.antes && r14.n > 10, r14.n + ' documentos · ' + JSON.stringify({ vuelve: r14.vuelve, sinNueva: r14.sinNueva, antes: r14.antes }));
ok('14 · Ajustes muestra los respaldos del aparato y de la nube', r14.aj);

/* ===== casos de la revisión independiente ===== */
const rv = await p.evaluate(async () => {
  const E = window.E, S = E.store, SC = E.secreto, T = E.tutoria, g = E.data.grupoActual(), a = E.data.alumnos(g)[0], RS = E.respaldo, out = {};
  // a) cada parcial cerrado en su propio documento
  out.cerrados = S.keys('cerrado:' + g.id + ':').length;
  // b) bloqueada: un documento NUEVO de tutoría no se guarda (quedaría en claro)
  await SC.bloquear(true); S.put('tutadeu:OTRO', { x: { mat: [{ t: 'Física' }] } }); out.nuevoBloq = S.docs['tutadeu:OTRO'] === undefined;
  await SC.abrir('4821', false); await new Promise(r => setTimeout(r, 200));
  // c) el PIN cambia en otro aparato: esta llave deja de servir → se bloquea y no escribe encima
  const crudo = JSON.stringify(S.docs['tutadeu:' + g.id].data);
  const sc = S.get('secCfg'); S.docs.secCfg = { data: Object.assign({}, sc, { salt: btoa('otra-sal-de-16b!'), check: { iv: sc.check.iv, ct: sc.check.ct.split('').reverse().join('') } }), ts: E.u.now(), dirty: false, deleted: false }; S.invalidar(); S.emit('__pull');
  await new Promise(r => setTimeout(r, 400));
  out.seBloqueo = !SC.abierta() && /PIN cambió/.test(document.getElementById('toasts').innerText);
  S.update('tutadeu:' + g.id, d => { d.y = 1; }, {}); out.noEscribio = JSON.stringify(S.docs['tutadeu:' + g.id].data) === crudo;
  S.docs.secCfg = { data: sc, ts: E.u.now(), dirty: false, deleted: false }; S.invalidar();
  out.reabre = await SC.abrir('4821', false); await new Promise(r => setTimeout(r, 200));
  // d) quitar la protección con un documento que no abre con este PIN: no se quita nada
  S.docs['tutseg:ROTO'] = { data: { __enc: 1, sec: { iv: sc.check.iv, ct: 'AAAA' } }, ts: E.u.now(), dirty: false, deleted: false }; S.invalidar();
  out.quitar = await SC.quitar(); out.sigueActiva = SC.activa() && SC.abierta();
  delete S.docs['tutseg:ROTO']; S.invalidar();
  // e) revertir desde el historial se puede deshacer
  const k = 'act:' + g.id + ':a3', al = E.data.alumnos(g)[2], n0 = S.get(k).notas[al.id];
  E.undo.run('nota', () => S.update(k, x => { x.notas[al.id] = 7; }));
  const x = E.historial.entradas()[0]; E.undo.run('hist-rev', () => E.historial.revertir(x)); const tras = S.get(k).notas[al.id];
  E.undo.undo(); out.revUndo = [n0, tras, S.get(k).notas[al.id]];
  // f) restaurar un respaldo con mucho menos que lo actual pide confirmación (y si dices que no, no cambia nada)
  const chico = { v: 1, j: JSON.stringify({ app: 'escuadra', docs: { config: S.get('config') } }) };
  return out;
});
ok('revisión · cada parcial cerrado va en su propio documento', rv.cerrados >= 1, rv.cerrados);
ok('revisión · bloqueada no se guarda ningún dato de tutoría (ni documentos nuevos)', rv.nuevoBloq);
ok('revisión · si el PIN cambia en otro aparato, se bloquea y no escribe encima con la llave vieja', rv.seBloqueo && rv.noEscribio && rv.reabre);
ok('revisión · quitar la protección es todo o nada', rv.quitar === false && rv.sigueActiva);
ok('revisión · «Revertir» del historial se puede deshacer', rv.revUndo[1] === rv.revUndo[0] && rv.revUndo[2] === 7, JSON.stringify(rv.revUndo));
rechaza = true;
const rvF = await p.evaluate(async () => {
  const E = window.E, S = E.store, n0 = E.respaldo.cuantos();
  const r = await E.respaldo.restaura({ v: 1, j: JSON.stringify({ app: 'escuadra', docs: { config: S.get('config') } }) }, 'prueba');
  return { r, igual: E.respaldo.cuantos() === n0, n0 };
});
rechaza = false;
ok('revisión · restaurar un respaldo con mucho menos que lo actual pide confirmación (si dices que no, nada cambia)', rvF.r === null && rvF.igual, rvF.n0 + ' documentos se quedaron');
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

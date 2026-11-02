import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const PORT = process.env.PORT || 8765;
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t155'; 
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
await p.evaluate(() => { window.__abiertos = []; window.open = u => { window.__abiertos.push(u); return null; }; window.print = () => { }; });
// imprimir el examen (versión A) y los informes para padres de todo el grupo, como lo haría el docente
const imp = await p.evaluate(async () => {
  const E = window.E, g = E.data.grupoActual(), pp = E.calc.parcialActual();
  E.store.update('config', c => { c.vistaImpresion = true; }, {});
  const r = E.examen.generar(g, { pid: pp.id, fecha: pp.fin, n: 15, total: 100, dur: 50, mezcla: 'eq', abiertas: 2, repaso: false, seed: 'exa_t155' });
  E.store.put('exa:' + g.id + ':exa_t155', { id: 'exa_t155', parcial: pp.id, titulo: 'Examen del ' + pp.nombre, fecha: pp.fin, dur: 50, total: 100, mezcla: 'eq', abiertas: 2, seed: 'exa_t155', items: r.items, horas: r.horas, rep: r.rep, creado: new Date().toISOString(), res: {} });
  const espera = ms => new Promise(x => setTimeout(x, ms));
  E.actions['ex-print']({ dataset: { id: 'exa_t155', v: 'A' } }); await espera(200);
  const hojasEx = (document.querySelector('.modal').innerText.match(/Saldrá en (\d+) hoja/) || [])[1];
  document.querySelector('.modal [data-act=pr-go]').click(); await espera(400);
  E.actions['ap-padres-todos']({ dataset: { pid: pp.id } }); await espera(400);
  document.querySelector('.modal [data-act=pr-go]').click(); await espera(400);
  // vista previa cancelada: no se registra
  E.print.asistencia(g, pp, { marcas: true }); await espera(200); document.querySelector('.modal [data-act=pr-cancel]').click(); await espera(100);
  return { hojasEx: Number(hojasEx), log: E.cobros.log(g) };
});
const ex = imp.log[0], inf = imp.log[1];
ok('lo que se imprime queda registrado (y lo cancelado no)', imp.log.length === 2 && /Examen/.test(ex.t) && /padres/i.test(inf.t), imp.log.map(x => x.t + ' · ' + x.n + ' hojas · ' + x.pa + ' por alumno (' + x.tipo + ')').join(' | '));
ok('examen: a cada alumno le toca la copia completa; informes: una hoja cada quien', ex.n === imp.hojasEx && ex.pa === ex.n && ex.tipo === 'copia' && inf.tipo === 'cada' && inf.pa === 1);

// nuevo cobro desde la impresión del examen, $1 por hoja, solo a quienes asistieron un día con pase de lista
const r1 = await p.evaluate(async ex => {
  const E = window.E, C = E.calc, g = E.data.grupoActual(), pp = C.parcialActual(), espera = ms => new Promise(x => setTimeout(x, ms));
  const dia = C.fechasRegistradas(g, pp)[0], doc = E.store.get('asis:' + g.id + ':' + dia), k = C.clasesCuenta(g, dia)[0];
  const faltaron = E.data.alumnos(g).filter(a => ['F', 'J'].indexOf(C.marca(doc, a.id, k)) >= 0).length;
  location.hash = '#/cobros'; await espera(300);
  document.querySelector('[data-act=cb-nuevo]').click(); await espera(200);
  const sel = document.getElementById('cb-imp'); sel.value = ex.id; sel.dispatchEvent(new Event('change', { bubbles: true })); await espera(100);
  const f = document.getElementById('cb-f'); f.value = dia; f.dispatchEvent(new Event('change', { bubbles: true }));
  const pr = document.getElementById('cb-precio'); pr.value = '1'; pr.dispatchEvent(new Event('input', { bubbles: true }));
  const sa = document.getElementById('cb-asis'); if (!sa.checked) { sa.checked = true; sa.dispatchEvent(new Event('change', { bubbles: true })); } await espera(100);
  const calc = document.getElementById('cb-calc').innerText, con = document.getElementById('cb-con').value;
  document.querySelector('.modal [data-act=cb-crear]').click(); await espera(400);
  const c = E.cobros.lista(g)[0], kk = E.cobros.calc(g, c);
  return { calc, con, faltaron, n: kk.filas.length, monto: kk.monto, total: E.data.alumnos(g).length, ruta: location.hash, id: c.id, esperado: kk.esperado };
}, ex);
ok('«Nuevo cobro» toma la impresión del examen: concepto, hojas y precio por hoja', /Examen/.test(r1.con) && r1.monto === ex.n, r1.calc.replace(/\n/g, ' '));
ok('solo a quienes asistieron ese día: quien faltó queda fuera', r1.faltaron > 0 && r1.n === r1.total - r1.faltaron && r1.esperado === r1.n * ex.n, r1.n + ' de ' + r1.total + ' (faltaron ' + r1.faltaron + ') · esperado $' + r1.esperado);

// pagos: completo, una parte, «No paga», «No le tocó», y el costo de las copias
const r2 = await p.evaluate(async id => {
  const E = window.E, g = E.data.grupoActual(), espera = ms => new Promise(x => setTimeout(x, ms)), k0 = E.cobros.calc(g, E.cobros.get(g, id)), A = k0.filas.map(r => r.a.id);
  const clic = async (act, aid, extra) => { const b = document.querySelector('#view [data-act=' + act + '][data-aid="' + aid + '"]') || document.querySelector('.modal [data-act=' + act + '][data-aid="' + aid + '"]'); if (!b) return false; b.click(); await espera(150); if (extra) await extra(); return true; };
  await clic('cb-pago', A[0]);
  await clic('cb-parcial', A[1], async () => { document.getElementById('cb-m').value = '1'; document.querySelector('.modal [data-act=cb-parcial-ok]').click(); await espera(150); });
  await clic('cb-mas', A[2], async () => { document.querySelector('.modal [data-act=cb-ex]').click(); await espera(150); });
  await clic('cb-mas', A[3], async () => { document.querySelector('.modal [data-act=cb-fuera]').click(); await espera(150); });
  const det = document.querySelector('details.sub'); if (det) det.open = true;
  const co = document.querySelector('[data-ch=cb-campo][data-f=costo]'); co.value = '10'; co.dispatchEvent(new Event('change', { bubbles: true })); await espera(200);
  const k = E.cobros.calc(g, E.cobros.get(g, id)), st = aid => (k.filas.find(r => r.a.id === aid) || {}).st || 'fuera';
  return { st: [st(A[0]), st(A[1]), st(A[2]), st(A[3])], rec: k.rec, costo: k.costo, saldo: k.saldo, pend: k.pend, txt: document.getElementById('view').innerText, n: k.filas.length, n0: k0.filas.length, monto: k.monto };
}, r1.id);
ok('✓ Pagó, «Parte», «No paga» y «No le tocó» funcionan', JSON.stringify(r2.st) === '["ok","par","ex","fuera"]' && r2.n === r2.n0 - 1, JSON.stringify(r2.st));
ok('cobrado, por cobrar, costo y saldo cuadran', r2.rec === r2.monto + 1 && r2.costo === 10 && r2.saldo === r2.rec - 10 && r2.pend === r2.monto * (r2.n - 3) + (r2.monto - 1) && /saldo/i.test(r2.txt), 'cobrado $' + r2.rec + ' · costo $10 · saldo $' + r2.saldo + ' · por cobrar $' + r2.pend);

// segundo cobro (informes, 1 hoja a $2) y «Quién me debe»
const r3 = await p.evaluate(async inf => {
  const E = window.E, g = E.data.grupoActual(), espera = ms => new Promise(x => setTimeout(x, ms));
  location.hash = '#/cobros'; await espera(250); document.querySelector('[data-act=cb-nuevo]').click(); await espera(200);
  const sel = document.getElementById('cb-imp'); sel.value = inf.id; sel.dispatchEvent(new Event('change', { bubbles: true }));
  const pr = document.getElementById('cb-precio'); pr.value = '2'; pr.dispatchEvent(new Event('input', { bubbles: true })); await espera(100);
  document.querySelector('.modal [data-act=cb-crear]').click(); await espera(300);
  location.hash = '#/cobros/deben'; await espera(300);
  const D = E.cobros.deudas(g), al = E.data.alumnos(g), x5 = D.find(x => x.a.id === al[5].id);
  const antes = x5.pend; document.querySelector('[data-act=cb-pagatodo][data-aid="' + al[5].id + '"]').click(); await espera(300);
  const despues = E.cobros.deudas(g).find(x => x.a.id === al[5].id).pend;
  document.querySelector('[data-act=cb-copiar]').click(); await espera(150); const lista = window.__clip.slice(-1)[0] || '';
  const deudor = E.cobros.deudas(g).find(x => x.pend > 0); document.querySelector('[data-act=cb-wa][data-aid="' + deudor.a.id + '"]').click(); await espera(200);
  const wa = decodeURIComponent((window.__abiertos.slice(-1)[0] || '').split('text=')[1] || '');
  const txt = document.getElementById('view').innerText;
  location.hash = '#/alumno/' + deudor.a.id; await espera(300); const ficha = document.getElementById('view').innerText;
  location.hash = '#/imprimir'; await espera(300); const impr = document.getElementById('view').innerText;
  location.hash = '#/mas'; await espera(300); const mas = document.getElementById('view').innerText;
  return { antes, despues, lista, wa, txt, ficha: /🧾 Copias/.test(ficha) && /Debe \$/.test(ficha), impr: /Cobros de impresiones/.test(impr), mas: /Cobros de impresiones/.test(mas), n: E.cobros.lista(g).length, tot: E.cobros.totales(g) };
}, inf);
ok('«Quién me debe» suma los dos cobros y «✓ Pagó todo» los salda', r3.n === 2 && r3.antes > 0 && r3.despues === 0 && /Quién me debe/.test(r3.txt), 'debía $' + r3.antes + ' → $' + r3.despues + ' · por cobrar en total $' + r3.tot.pend);
ok('lista de pendientes para el grupo: números de lista, sin nombres ni montos por persona', /Copias pendientes de pago/.test(r3.lista) && /No\. \d+/.test(r3.lista) && /c\/u/.test(r3.lista) && !/Karla|Cruz|Ruiz|Pérez/.test(r3.lista) && /voluntaria/.test(r3.lista), r3.lista.split('\n').slice(0, 2).join(' / '));
ok('aviso a casa por WhatsApp con lo que debe, total y que es voluntario', /pendiente de las copias/.test(r3.wa) && /Total: \$/.test(r3.wa) && /no condiciona sus exámenes/.test(r3.wa), r3.wa.split('\n').slice(1, 4).join(' / '));
ok('la ficha del alumno, Imprimir y Más muestran Cobros', r3.ficha && r3.impr && r3.mas);
await p.evaluate(() => { location.hash = '#/cobros/deben'; }); await p.waitForTimeout(300); await p.screenshot({ path: OUT + '/deben.png', fullPage: false });
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

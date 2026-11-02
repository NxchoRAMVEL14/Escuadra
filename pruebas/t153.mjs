import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const PORT = process.env.PORT || 8765;
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t153'; 
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
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept()); p.on('console', m => { if (m.text().startsWith('>')) process.stdout.write(m.text() + ' '); });
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
// datos extra: un examen del parcial, una actividad con rúbrica y un logro
await p.evaluate(() => {
  const E = window.E, g = E.data.grupoActual(), pp = E.calc.parcialActual(), al = E.data.alumnos(g);
  const r = E.examen.generar(g, { pid: pp.id, fecha: pp.fin, n: 10, total: 100, dur: 50, mezcla: 'eq', abiertas: 1, repaso: false, seed: 'exa_t153' });
  const res = {}; al.forEach((a, i) => { const m = {}; r.items.forEach((it, j) => { m[it.id] = (i + j) % 3 ? 1 : 0; }); res[a.id] = { m: m }; });
  E.store.put('exa:' + g.id + ':exa_t153', { id: 'exa_t153', parcial: pp.id, titulo: 'Examen del ' + pp.nombre, fecha: pp.fin, dur: 50, total: 100, mezcla: 'eq', abiertas: 1, seed: 'exa_t153', items: r.items, horas: r.horas, rep: r.rep, creado: new Date().toISOString(), res: res }, { silent: true });
  const notas = {}; al.forEach((a, i) => { notas[a.id] = 50 + (i * 7) % 50; });
  E.store.put('act:' + g.id + ':act_t153', { id: 'act_t153', parcial: pp.id, categoria: 'trabajos', nombre: 'Práctica de prueba', peso: 1, max: 100, fecha: pp.inicio, notas: notas, cuenta: true, rub: 'practica' }, { silent: true });
});
// 1) disparar cada formato y guardar lo que manda a imprimir
const lista = await p.evaluate(async () => {
  const E = window.E, g = E.data.grupoActual(), pp = E.calc.parcialActual(), al = E.data.alumnos(g), P = E.print, orig = P.run, calls = [];
  P.run = (h, o) => { calls.push({ h: h, o: o || {} }); };
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const acts = ['ap-plan', 'ap-plan-todos', 'ap-padres', 'ap-padres-todos', 'kit-print', 'n3-print', 'em-print', 'qr-print', 'tj2-print', 'rub-print', 'ca-tiras', 'cl-hoja', 'cte-print', 'cte-print-all', 'esp-print', 'mp-print', 'dn-bingo', 'ek-papel', 'en-tiras', 'ex-print', 'ex-clave', 'in-perm', 'iv-print', 'lb-print', 'nr-print', 'omr-print', 'pf-print', 'pf-print-all', 'cn-print', 'cn-nuevas', 'po-print', 'po-todos', 'fc-print', 'fc-print-all', 'ju-cit', 'ju-guion', 'ju-firmas', 'ind-print', 'pjb-print', 'sg-inc-print', 'sg-print', 'sg-print-ind', 'pv-print', 'ex-expediente', 'tc-print', 'vi-carta', 'vi-evp'];
  const ds = { aid: al[0].id, pid: pp.id, id: 'exa_t153', ex: 'exa_t153', act: 'act_t153', t: 'rep', v: 'A', f: pp.inicio, fecha: pp.inicio, g: g.id, i: '0', n: '1', l: '' };
  const out = [];
  const corre = async (nombre, fn) => { const n0 = calls.length; let err = ''; try { await Promise.race([Promise.resolve().then(fn), espera(3000).then(() => { throw new Error('se quedó esperando'); })]); await espera(250); } catch (e) { err = e.message; } try { E.modal.close(); } catch (e) { } out.push({ k: nombre, n: calls.length - n0, err: err.slice(0, 80), toast: (document.querySelector('#toasts') || {}).innerText || '' }); };
  for (const a of acts) { console.log('>' + a); if (!E.actions[a]) { out.push({ k: a, n: 0, err: 'no existe' }); continue; } await corre(a, () => E.actions[a]({ dataset: Object.assign({}, ds), value: '', closest: () => null, getAttribute: () => null })); }
  await corre('P.asistencia', () => P.asistencia(g, pp, { marcas: true }));
  await corre('P.participacion', () => P.participacion(g, pp, { marcas: true }));
  await corre('P.cotejo', () => P.cotejo(g, pp, 0, {}));
  await corre('P.rubrica', () => P.rubrica(g, pp, 0));
  await corre('P.acta', () => P.acta(g));
  window.__calls = calls; P.run = orig;
  return out.map(x => Object.assign(x, { o: x.n ? calls.filter(() => true).length : 0 }));
});
const hechos = lista.filter(x => x.n > 0), faltan = lista.filter(x => !x.n);
console.log('formatos que imprimieron: ' + hechos.length + ' de ' + lista.length);
console.log('sin imprimir con datos de prueba: ' + faltan.map(x => x.k + (x.err ? ' (' + x.err + ')' : '')).join(', '));
// 2) cada formato real: PDF sin gráficos de fondo (como Chrome de Android) y el logo en cada hoja
const mide = (pdf, pre, land, lm) => { const y1 = lm + 18.5;
  execFileSync('pdftoppm', ['-r', '60', '-png', pdf, pre]);
  const py = `
import glob, json
from PIL import Image
r = []
for f in sorted(glob.glob('${pre}-*.png'), key=lambda f: int(f.split('-')[-1].split('.')[0])):
    im = Image.open(f).convert('RGB'); w, h = im.size; px = w / (279.4 if w > h else 215.9); W = w / px
    x0, y1 = W - 60, ${y1}
    reg = im.crop((int(x0 * px), 0, w, int(y1 * px)))
    pts = [(i % reg.size[0], i // reg.size[0]) for i, q in enumerate(reg.get_flattened_data()) if q[2] > 120 and q[0] < 110 and q[1] > 60]
    if len(pts) < 30: r.append(None); continue
    xs = [x for x, y in pts]; ys = [y for x, y in pts]
    r.append([round(W - (x0 + max(xs) / px), 1), round(min(ys) / px, 1), round((max(xs) - min(xs)) / px, 1)])
print(json.dumps(r))`;
  return JSON.parse(execFileSync('python3', ['-c', py]).toString().trim());
};
const tot = await p.evaluate(() => window.__calls.length);
let malas = [], hojas = 0, revisados = 0; const resumen = [];
for (let i = 0; i < tot; i++) {
  const info = await p.evaluate(i => { const c = window.__calls[i]; window.E.print.run(c.h, c.o); window.E.modal.close(); return { t: c.o.title || '?', land: !!c.o.landscape, m: c.o.margin == null ? 9 : parseFloat(c.o.margin) || 0 }; }, i);
  await p.emulateMedia({ media: 'print' });
  const pdf = OUT + '/f' + i + '.pdf'; await p.pdf({ path: pdf, preferCSSPageSize: true, printBackground: false });
  await p.emulateMedia({ media: 'screen' });
  const lm = Math.max(info.m, 8), r = mide(pdf, OUT + '/f' + i, info.land, lm);
  hojas += r.length; revisados++; resumen.push(info.t.slice(0, 38) + ' · ' + r.length + (r.length === 1 ? ' hoja' : ' hojas') + ' · margen ' + info.m);
  const bad = r.map((x, j) => x && x[0] >= lm - 0.3 && x[0] <= lm + 1.6 && x[1] >= lm - 0.3 && x[1] <= lm + 1.6 && x[2] > 14.5 && x[2] < 17.5 ? null : (j + 1) + ':' + JSON.stringify(x)).filter(Boolean);
  if (bad.length) malas.push(info.t + ' (margen ' + info.m + ') → hojas ' + bad.join(' '));
}
ok('cada hoja de los ' + revisados + ' formatos reales lleva el logo arriba a la derecha, sin gráficos de fondo', malas.length === 0, malas.length ? malas.slice(0, 6).join(' | ') : hojas + ' hojas revisadas');
console.log(resumen.join('\n'));
// 3) los márgenes que no salieron con datos de prueba: constancias (margen 0, horizontal) y carta (20 mm)
const sint = [
  { k: 'constancias', h: [1, 2, 3].map(i => '<div class="pr cn-pr"><div class="cn-in"><h1>Constancia de logro</h1><p>Se otorga a</p><h2>Alumno ' + i + '</h2><p class="cn-det">Detalle</p><div class="cn-firma"><span>Docente</span></div><p class="cn-folio">Folio ' + i + '</p></div></div>').join(''), o: { title: 'Constancias', landscape: true, margin: '0' }, hojas: 3 },
  { k: 'carta20', h: '<div class="pr">' + Array.from({ length: 90 }, (_, i) => '<p>Párrafo ' + (i + 1) + ' de la carta de presentación para la empresa, con texto suficiente para ocupar el renglón completo.</p>').join('') + '</div>', o: { title: 'Carta', margin: '20mm' }, hojas: 0 }
];
for (const x of sint) {
  await p.evaluate(x => { window.E.print.run(x.h, x.o); window.E.modal.close(); }, x);
  await p.emulateMedia({ media: 'print' });
  const pdf = OUT + '/' + x.k + '.pdf'; await p.pdf({ path: pdf, preferCSSPageSize: true, printBackground: false });
  await p.emulateMedia({ media: 'screen' });
  const m = parseFloat(x.o.margin) || 0, lm = Math.max(m, 8), r = mide(pdf, OUT + '/' + x.k, !!x.o.landscape, lm);
  const okH = r.every(y => y && y[0] >= lm - 0.3 && y[0] <= lm + 1.6 && y[1] >= lm - 0.3 && y[1] <= lm + 1.6 && y[2] > 14.5 && y[2] < 17.5);
  ok(x.k + ': logo en cada hoja, a ' + lm + ' mm de la orilla' + (x.hojas ? ' y una constancia por hoja' : ''), okH && r.length > 1 && (!x.hojas || r.length === x.hojas), r.length + ' hojas · ' + JSON.stringify(r[0]));
}

ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

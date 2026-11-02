import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const PORT = process.env.PORT || 8765;
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t150';
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

// 1) la lista por clase: una columna por clase (no por día), totales que cuentan clases
await p.evaluate(() => window.E.store.update('config', c => { c.asisPorClase = true; }, {}));  // v1.27.25: el modo por clase ya es opcional
const res = await p.evaluate(() => {
  const E = window.E, g = E.data.grupoActual(), pp = E.calc.parcialActual();
  E.print.asistencia(g, pp, { marcas: true });
  const root = document.getElementById('print-root');
  const tabs = [...root.querySelectorAll('table.att')];
  const fechas = E.calc.fechasLista(g, pp);
  const esperadas = [].concat(...fechas.map(f => { const cl = E.calc.clasesDia(g, f); return cl.length ? cl.map(c => ({ f, k: c.k })) : [{ f, k: null }]; }));
  const colsDom = [].concat(...tabs.map(t => [...t.querySelectorAll('thead tr')[1].querySelectorAll('th')].map(th => th.textContent.trim())));
  const al = E.data.alumnos(g);
  const sym = { A: '•', F: 'F', R: 'R', J: 'J' };
  const fallos = []; let celdasOk = 0;
  al.forEach(a => {
    // cadena esperada: símbolo por clase, según C.marca del pase de ese día
    const exp = esperadas.map(c => { const doc = E.store.get('asis:' + g.id + ':' + c.f); return doc ? sym[E.calc.marca(doc, a.id, c.k)] : ''; }).join('');
    let got = '', tA = null, tF = null;
    tabs.forEach((t, ti) => {
      const tr = [...t.querySelectorAll('tbody tr')].find(r => r.querySelector('td.nm') && r.querySelector('td.nm').textContent === a.nombre);
      if (!tr) return; const tds = [...tr.querySelectorAll('td')]; const ult = ti === tabs.length - 1;
      const celdas = ult ? tds.slice(2, -2) : tds.slice(2);
      got += celdas.map(td => td.textContent.trim()).join('');
      if (ult) { tA = tds[tds.length - 2].textContent.trim(); tF = tds[tds.length - 1].textContent.trim(); }
    });
    const cs = E.calc.asis(g, pp, a.id);
    if (got === exp) celdasOk++; else fallos.push(a.nombre + ' cadena ' + got + ' vs ' + exp);
    if (String(cs.a) !== tA || String(cs.f) !== tF) fallos.push(a.nombre + ' totales ' + tA + '/' + tF + ' vs C.asis ' + cs.a + '/' + cs.f);
  });
  return { tablas: tabs.length, logos: document.getElementById('page-style').textContent.match(/@top-right\{content:image-set\(url/g)?.length || 0, nClasesDom: colsDom.length, nClasesEsp: esperadas.length,
    dias: fechas.length, celdasOk, alumnos: al.length, fallos: fallos.slice(0, 6), nFallos: fallos.length,
    tituloCols: [...tabs[0].querySelectorAll('thead tr')[0].querySelectorAll('th')].slice(2, 5).map(t => t.textContent.trim()),
    horas: colsDom.slice(0, 6), totalesHeader: [...tabs[tabs.length - 1].querySelectorAll('thead tr')[0].querySelectorAll('th')].slice(-2).map(t => t.textContent.trim()) };
});
ok('una columna por CLASE de 50 min (no por día)', res.nClasesDom === res.nClasesEsp && res.nClasesEsp > res.dias, 'columnas ' + res.nClasesDom + ' · clases ' + res.nClasesEsp + ' · días ' + res.dias);
ok('cada celda = la marca de su clase (incluye excepciones por clase)', res.nFallos === 0 && res.celdasOk === res.alumnos, res.celdasOk + '/' + res.alumnos + ' alumnos');
ok('totales A/F = C.asis (cuentan clases)', res.nFallos === 0, res.fallos.join(' | ') || 'coinciden');
ok('hay varios bloques horizontales y el logo va en el margen superior de la hoja (@top-right)', res.tablas >= 2 && res.logos === 1, 'tablas ' + res.tablas + ' · @top-right ' + res.logos);
console.log('     encabezados:', JSON.stringify(res.horas), '· totales:', JSON.stringify(res.totalesHeader));

// 1b) impresión combinada «Día» (lista + participación): la participación empieza en hoja nueva
const dia = await p.evaluate(() => {
  const E = window.E; E.ui.print = E.ui.print || { marcas: true, pid: E.calc.parcialActual().id, ac: 0 };
  E.ui.print.marcas = true; E.modal.close && E.modal.close();
  E.actions['pr-dia']({});
  const root = document.getElementById('print-root');
  const sal = root.querySelectorAll('div[style*="page-break-before:always"]').length;
  return { hojas: root.querySelectorAll('.pr').length, saltos: sal, partic: /REGISTRO DE PARTICIPACIÓN/.test(root.textContent), lista: /LISTA DE ASISTENCIA/.test(root.textContent), arm: document.getElementById('page-style').textContent.match(/@top-right/g).length };
});
ok('Día = lista + participación, cada una en su hoja, con logo en el margen', dia.hojas === 2 && dia.saltos === 1 && dia.partic && dia.lista && dia.arm === 1, JSON.stringify(dia));

// 2) PDF real de Chromium: cada hoja debe llevar el logo arriba a la derecha
await p.emulateMedia({ media: 'print' });
const pdf = OUT + '/asis.pdf';
await p.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
await p.emulateMedia({ media: 'screen' });
const info = execFileSync('pdfinfo', [pdf]).toString();
const paginas = Number((info.match(/Pages:\s+(\d+)/) || [])[1] || 0);
ok('el PDF tiene varias hojas', paginas >= 2, 'hojas ' + paginas);
execFileSync('pdftoppm', ['-r', '200', '-png', pdf, OUT + '/hi']);
const py = `
import glob, json
from PIL import Image
files = sorted(glob.glob('${OUT}/hi-*.png'), key=lambda f: int(f.split('-')[-1].split('.')[0]))
out = []
for f in files:
    im = Image.open(f).convert('L'); w, h = im.size; pxmm = w / 279.4
    x0, x1, y0, y1 = int(240 * pxmm), int(277 * pxmm), int(4 * pxmm), int(27.5 * pxmm)
    reg = im.crop((x0, y0, x1, y1)).point(lambda v: 255 if v < 215 else 0)
    bb = reg.getbbox()
    out.append({'pag': f.split('-')[-1], 'tinta': reg.histogram()[0], 'x': None if not bb else [round((x0 + bb[0]) / pxmm, 1), round((x0 + bb[2]) / pxmm, 1)], 'y': None if not bb else [round((y0 + bb[1]) / pxmm, 1), round((y0 + bb[3]) / pxmm, 1)]})
print(json.dumps(out))
`;
const medidas = JSON.parse(execFileSync('python3', ['-c', py]).toString().trim());
const conLogo = medidas.filter(m => m.tinta > 0 && m.x && Math.abs(m.y[0] - 9) < 1.5 && Math.abs(m.x[1] - 270.4) < 1.5 && Math.abs(m.x[0] - 253.4) < 1.5);
ok('cada hoja del PDF lleva el logo arriba a la derecha (9 mm del borde)', conLogo.length === medidas.length && medidas.length === paginas, conLogo.length + ' de ' + medidas.length + ' hojas · ' + JSON.stringify(medidas.slice(0, 2)));

ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

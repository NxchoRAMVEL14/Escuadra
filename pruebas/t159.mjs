import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const PORT = process.env.PORT || 8765;
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t159'; 
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
// nombres largos como los de una lista real
await ev(() => {
  const E = window.E, g = E.data.grupoActual(), N = ['DIMAS FLORES LUIS ANGEL', 'GUERRERO ALDANA NATALIA GUADALUPE', 'BARRIENTOS CORONADO MICHEL ARMANDO', 'HERNANDEZ VILLALOBOS MARIA FERNANDA', 'RODRIGUEZ DE LA CRUZ JOSE EMMANUEL', 'MARTINEZ ZERMEÑO JUAN PABLO'];
  E.store.update('grupo:' + g.id, gg => { gg.alumnos.forEach((a, i) => { a.nombre = N[i % N.length] + ' ' + (i + 1); }); });
});
await ev(() => { location.hash = '#/proyecto'; }); await esp(400);
await ev(() => { document.getElementById('pj-k').value = '5'; document.querySelector('[data-act=pj-armar][data-m=azar]').click(); }); await esp(300);
await ev(() => document.querySelector('[data-act=pj-edit-ok]').click()); await esp(300);
const pid = await ev(() => { const E = window.E, S = E.store, g = E.data.grupoActual(), PJ = E.proyecto, pid = PJ.canon(g, E.calc.parcialActual().id);
  // equipos grandes (8 alumnos) y uno de 1, con proyecto largo
  S.update('proy:' + g.id + ':' + pid, d => { const a = d.equipos[4].al.pop(); d.equipos.push({ id: 'eqsolo', nombre: 'Equipo 6', al: [a], proy: 'Garra robótica de tres dedos con engranes rectos', nota: '' }); d.equipos.forEach((e, i) => { if (!e.proy) e.proy = ['Garra de tres dedos con mordazas de MDF', 'Brazo articulado de dos ejes con jeringas', 'Grúa hidráulica con pistón de jeringa', 'Garra paralela con tornillo sin fin', 'Brazo de tres eslabones'][i % 5]; }); }, {});
  return pid; });
const cuenta = async (q, extra) => {
  await ev(([q, extra]) => { const b = document.querySelector('[data-act=pfi-print][data-q="' + q + '"]' + (extra || '')); b.click(); }, [q, extra]); await esp(400);
  const info = await ev(() => ({ hojas: document.querySelectorAll('#print-root .pfi-hoja').length, zoom: [...document.querySelectorAll('#print-root .pfi-hoja')].filter(h => h.dataset.zoom).map(h => h.dataset.zoom) }));
  await p.emulateMedia({ media: 'print' }); const f = OUT + '/' + q + '.pdf'; await p.pdf({ path: f, preferCSSPageSize: true, printBackground: false }); await p.emulateMedia({ media: 'screen' });
  const pags = Number((execFileSync('pdfinfo', [f]).toString().match(/Pages:\s+(\d+)/) || [])[1]);
  return Object.assign(info, { pags });
};
const al = await cuenta('bitAl'), eqs = await cuenta('bitEq'), rub = await cuenta('rub'), b0 = await cuenta('bit0');
ok('bitácora por alumno: 1 hoja por alumno', al.hojas === 40 && al.pags === 40, al.pags + ' páginas para ' + al.hojas + ' alumnos · reducidas: ' + al.zoom.length + ' ' + [...new Set(al.zoom)].join(','));
ok('bitácora por equipo: 1 hoja por equipo (equipos de hasta 8, nombres largos)', eqs.hojas === 6 && eqs.pags === 6, eqs.pags + ' páginas · reducidas: ' + eqs.zoom.join(','));
ok('rúbricas: 1 hoja por equipo', rub.hojas === 6 && rub.pags === 6, rub.pags + ' páginas');
ok('bitácora en blanco: 1 hoja', b0.pags === 1);
// rúbrica con criterios mucho más largos y 3 aspectos más: se reduce para seguir en 1 hoja
await ev(() => { const S = window.E.store, largo = 'Criterio de desempeño muy detallado que describe con precisión lo que se espera del mecanismo, cómo se mide, con qué tolerancia, cuántos intentos tiene el equipo y qué evidencia debe entregar al docente durante la prueba. '.repeat(2);
  S.update('rubFisica', d => { d.garra = { t: 'Garras Robóticas', asp: Array.from({ length: 8 }, (_, i) => ({ id: 'a' + i, t: 'Aspecto número ' + (i + 1), c: largo, pts: 12 })) }; }, {}); });
const rubL = await cuenta('rub0', '[data-k="garra"]');
ok('una rúbrica editada muy larga también queda en 1 hoja (se reduce lo justo)', rubL.pags === 1 && rubL.zoom.length === 1, 'reducida a ' + rubL.zoom.join(','));
execFileSync('pdftoppm', ['-r', '50', '-png', '-f', '1', '-l', '1', OUT + '/bitAl.pdf', OUT + '/al']);
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

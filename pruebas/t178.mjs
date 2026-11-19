// v1.38.0: apoyo de logística en la Expo (sin equipo, gana como si presentara), «no entra a la expo» y chocolates por persona
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t178';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-18T08:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(500);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera', 'Eli Ruiz Mora', 'Fer Gil Paz', 'Gabi Ríos Sol']); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); }); await p.waitForTimeout(500);
await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), al = E.data.alumnos(g); E.store.put('expo:' + g.id, { equipos: [{ id: 'e1', nombre: 'Los Pistones', idea: 'banda', al: [al[0].id, al[1].id] }, { id: 'e2', nombre: 'Equipo 2', idea: 'pulso', al: [al[2].id, al[3].id] }] }); });
await p.evaluate(() => { location.hash = '#/expo'; }); await p.waitForTimeout(700);
const X = 'window.E.expo';
ok('chocolates: 20 personas → 8 c/u y 21 personas → 7 c/u (unas 150 piezas)', await p.evaluate(() => { const c = window.E.expo.premioCalc; return c(20).piezas === 8 && c(21).piezas === 7 && c(21).total === 147; }));
let v = await p.evaluate(() => document.getElementById('view').innerText);
ok('sin equipo: cada quien con opción de apoyo de logística o no entra', await p.evaluate(() => document.querySelectorAll('[data-ch=ex-sin]').length) === 3 && /Apoyo de logística/.test(await p.evaluate(() => document.querySelector('[data-ch=ex-sin]').innerText)));
ok('al inicio cuenta a todos más el profe (8 personas)', /8 personas ×/.test(v), (v.match(/\d+ personas ×[^\n]*/) || [])[0]);
const pon = async (i, val) => { await p.evaluate(([i, val]) => { const s = document.querySelectorAll('[data-ch=ex-sin]')[i]; s.value = val; s.dispatchEvent(new Event('change', { bubbles: true })); }, [i, val]); await p.waitForTimeout(400); };
await pon(0, 'apoyo'); await pon(1, 'fuera'); await pon(2, 'fuera');
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('los que no entran no cuentan para los chocolates (6 personas)', /6 personas ×/.test(v) && /2 no entran a la expo/.test(v), (v.match(/\d+ personas ×[^\n]*/) || [])[0]);
ok('apartado del apoyo: tareas de pasaportes, etiquetas, letreros, recoger y chocolates', /Apoyo de logística \(1\)/.test(v) && /Repartir los pasaportes/.test(v) && /etiquetas/.test(v) && /letrero de cada stand/.test(v) && /recoger/.test(v) && /chocolates para el premio/.test(v) && await p.evaluate(() => document.querySelectorAll('[data-ch=ex-apt]').length) === 5);
await p.evaluate(() => { const c = document.querySelector('[data-ch=ex-apt]'); c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(300);
ok('las tareas se palomean y se guardan', await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), al = E.data.alumnos(g); return !!((E.expo.doc(g).apoyoT || {})[al[4].id] || {})[0]; }));
// piezas fijas a mano
await p.evaluate(() => { const i = document.querySelector('[data-ch=ex-f][data-k=piezas]'); i.value = '7'; i.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(400);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('piezas por persona a mano: 6 × 7 = 42', /42 piezas/.test(v) && /Cada quien trae 7 piezas/.test(v));
// hoja del apoyo
await p.click('[data-act=ex-apoyo-imp]'); await p.waitForTimeout(900);
await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT + '/apoyo.pdf', preferCSSPageSize: true, printBackground: true }); await p.emulateMedia({ media: 'screen' });
const pg = Number((execFileSync('pdfinfo', [OUT + '/apoyo.pdf']).toString().match(/Pages:\s+(\d+)/) || [])[1]), tx = execFileSync('pdftotext', [OUT + '/apoyo.pdf', '-']).toString().replace(/\s+/g, ' ');
ok('hoja del apoyo en 1 hoja: su nombre, tareas, stands y pasaportes', pg === 1 && /Eli Ruiz Mora/.test(tx) && /Los Pistones/.test(tx) && /Banda transportadora/.test(tx) && /Recogí al final/.test(tx) && /Traer tus 7 chocolates/.test(tx), pg + ' · ' + tx.slice(0, 200));
execFileSync('pdftoppm', ['-r', '45', '-png', '-f', '1', '-l', '1', OUT + '/apoyo.pdf', OUT + '/apoyo']);
// calificación
const cal = await p.evaluate(() => {
  const E = window.E, S = E.store, C = E.calc, g = E.data.grupoActual(), al = E.data.alumnos(g);
  S.update('config', c => { c.vaciasCero = false; }, {});
  const notas = {}; al.forEach(a => { notas[a.id] = 70; });
  S.put('act:' + g.id + ':xe', { id: 'xe', parcial: 'P3', categoria: 'examen', nombre: 'Examen', peso: 1, max: 100, fecha: '2026-11-12', cuenta: true, notas: notas }, { silent: true });
  const fin = () => al.map(a => C.cal(g, 'P3', a.id).bruta);
  S.update('expo:' + g.id, d => { d.destino = 'extra'; d.puntos = 1; });
  const antes = fin();
  S.update('expo:' + g.id, d => { d.apoyoOk = {}; d.apoyoOk[al[4].id] = true; d.apoyoOk[al[5].id] = true; d.equipos[0].presento = true; });
  const despues = fin();
  return { antes, despues };
});
ok('el apoyo que cumplió gana su punto extra igual que el equipo que presentó', Math.abs(cal.despues[4] - cal.antes[4] - 10) < 1e-9 && Math.abs(cal.despues[0] - cal.antes[0] - 10) < 1e-9, JSON.stringify(cal));
ok('quien no entra a la expo no gana nada aunque se marque', cal.despues[5] === cal.antes[5] && cal.despues[2] === cal.antes[2]);
// meterlo a un equipo le quita el apoyo
await p.evaluate(() => { location.hash = '#/expo'; }); await p.waitForTimeout(500);
await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), al = E.data.alumnos(g), s = document.querySelector('[data-ch=ex-mete]'); s.value = al[4].id; s.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(400);
ok('si entra a un equipo deja de ser apoyo', await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), al = E.data.alumnos(g); return !E.expo.esApoyo(g, al[4].id) && !document.querySelector('[data-ch=ex-apt]'); }));
ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

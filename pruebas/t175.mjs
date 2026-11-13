// v1.36.0 · Memorama de simbología ISO 1219: en el celular (con código para el profe) y en el proyector por equipos
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t175';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 400, height: 860 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-13T08:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/alumnos'); await p.waitForTimeout(1500);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['ACOSTA BELTRAN MARIO', 'BRAVO CEJA RAUL', 'CAMPOS LUNA PABLO']); await p.waitForTimeout(500);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); window.open = () => null; }); await p.waitForTimeout(500);
await p.evaluate(() => { location.hash = '#/memorama'; }); await p.waitForTimeout(700);
const I = await p.evaluate(() => ({ n: window.ISO1219.SIM.length, c: window.ISO1219.COMPLETAS.length, cats: Object.keys(window.ISO1219.CAT) }));
ok('trae los 4 temas que elegiste y 12 válvulas completas', I.cats.join() === 'val,acc,cil,aux' && I.n >= 30 && I.c === 12, JSON.stringify(I));
ok('cada símbolo es un dibujo SVG con nombre y función', await p.evaluate(() => window.ISO1219.SIM.concat(window.ISO1219.COMPLETAS).every(s => /^<svg[\s\S]*<\/svg>$/.test(s.svg) && s.n && s.f.length > 15)));
await p.check('[data-ch=mm-cfg][data-k=p][value="6"]'); await p.waitForTimeout(300);
await p.click('[data-act=mm-qr]'); await p.waitForTimeout(800);
const url = await p.evaluate(() => window.E.ui.mmUrl);
ok('el QR lleva el enlace a memorama.html', /memorama\.html#j/.test(url) && await p.evaluate(() => !!document.querySelector('.ca-qr svg')), url.slice(0, 60));
await p.evaluate(() => window.E.modal.close());
// el alumno juega en su celular
const q = await ctx.newPage(); q.on('pageerror', e => errs.push('memorama: ' + e.message));
await q.goto(url); await q.waitForTimeout(800);
ok('el juego abre con el nivel y los pares del profe', await q.evaluate(() => document.querySelector('[name=niv]:checked').value === '1' && document.querySelector('[name=par]:checked').value === '6'));
await q.click('#go'); await q.waitForTimeout(500);
ok('6 pares = 12 cartas numeradas', await q.evaluate(() => document.querySelectorAll('.c').length) === 12);
await q.screenshot({ path: OUT + '/tablero.png' });
// resolverlo sin errores: empareja cada dibujo con su nombre
const pares = await q.evaluate(() => { const S = window.ISO1219.SIM, cs = Array.from(document.querySelectorAll('.c')).map(c => { const f = c.querySelector('.fr'); return f.classList.contains('tx') ? { i: +c.dataset.i, n: f.textContent } : { i: +c.dataset.i, n: (S.find(s => { const z = document.createElement('span'); z.innerHTML = s.svg; return z.innerHTML === f.innerHTML; }) || {}).n }; });
  const out = []; cs.filter(c => !document.querySelector('.c[data-i="' + c.i + '"] .fr').classList.contains('tx')).forEach(c => { const t = cs.find(x => x.i !== c.i && x.n === c.n); out.push([c.i, t.i]); }); return out; });
// primero un error a propósito para ver que se voltean de regreso
await q.click('.c[data-i="' + pares[0][0] + '"]'); await q.click('.c[data-i="' + pares[1][0] + '"]'); await q.waitForTimeout(1400);
ok('si no son pareja se voltean de nuevo', await q.evaluate(() => document.querySelectorAll('.c.up').length === 0 && document.querySelectorAll('.c.ok').length === 0));
for (let k = 0; k < pares.length; k++) { await q.click('.c[data-i="' + pares[k][0] + '"]'); await q.click('.c[data-i="' + pares[k][1] + '"]'); await q.waitForTimeout(250);
  if (k === 0) { ok('al hacer pareja muestra el símbolo, su nombre y para qué sirve', await q.evaluate(() => { const p = document.querySelector('.pan'); return !!p && !!p.querySelector('svg') && p.textContent.length > 30; })); await q.screenshot({ path: OUT + '/pareja.png' }); }
  const pn = await q.$('#pn'); if (pn) await pn.click(); }
await q.waitForTimeout(3000);
const tf = await q.evaluate(() => document.body.innerText);
ok('al terminar: pares, intentos y tiempo', /6 pares en 7 intentos/.test(tf), tf.slice(0, 200).replace(/\n+/g, ' | '));
await q.fill('#num', '2'); await q.click('#vcod'); await q.waitForTimeout(200);
const cod = await q.evaluate(() => document.querySelector('#cods .score').textContent);
ok('da un código de 4 dígitos por número de lista (y otro si jugaron en pareja)', /^\d{4}$/.test(cod) && await (async () => { await q.fill('#num', '3'); await q.click('#vcod'); return q.evaluate(() => document.querySelectorAll('#cods .score').length === 2); })(), cod);
const cod3 = await q.evaluate(() => document.querySelectorAll('#cods .score')[1].textContent);
await q.screenshot({ path: OUT + '/final.png', fullPage: true });
await q.click('#fi'); await q.waitForTimeout(300);
ok('fichas para repasar los 6 símbolos del juego', await q.evaluate(() => document.querySelectorAll('.fich').length) === 6);
// el profe registra los códigos
await p.bringToFront(); await p.click('[data-act=mm-reg]'); await p.waitForTimeout(500);
const aids = await p.evaluate(() => window.E.data.alumnos(window.E.data.grupoActual()).map(a => a.id));
await p.fill('[data-ch=mm-cod][data-aid="' + aids[1] + '"]', cod); await p.press('[data-ch=mm-cod][data-aid="' + aids[1] + '"]', 'Tab'); await p.waitForTimeout(300);
await p.fill('[data-ch=mm-cod][data-aid="' + aids[2] + '"]', cod3); await p.press('[data-ch=mm-cod][data-aid="' + aids[2] + '"]', 'Tab'); await p.waitForTimeout(300);
await p.fill('[data-ch=mm-cod][data-aid="' + aids[0] + '"]', cod); await p.press('[data-ch=mm-cod][data-aid="' + aids[0] + '"]', 'Tab'); await p.waitForTimeout(300);
const r = await p.evaluate(a => a.map(id => JSON.stringify(window.E.memo.res(window.E.data.grupoActual(), id))), aids);
ok('reconoce el código: nivel 1, 6 pares, excelente', /"niv":1,"p":6,"b":3/.test(r[1]) && /"b":3/.test(r[2]), r[1]);
ok('el código de otro número de lista no sirve', r[0] === '[]', r[0]);
await p.evaluate(() => window.E.modal.close()); await p.evaluate(() => { location.hash = '#/inicio'; }); await p.waitForTimeout(200); await p.evaluate(() => { location.hash = '#/memorama'; }); await p.waitForTimeout(600);
await p.click('[data-act=mm-part]'); await p.waitForTimeout(300); await p.click('[data-act=mm-part]'); await p.waitForTimeout(300);
const pt = await p.evaluate(a => { const g = window.E.data.grupoActual(); return window.E.store.get('part:' + g.id + ':2026-11-13') || {}; }, aids);
ok('⭐ +1 participación hoy a quien trajo código, solo una vez', pt[aids[1]] === 1 && pt[aids[2]] === 1 && !pt[aids[0]], JSON.stringify(pt));
await p.click('[data-act=mm-act]'); await p.waitForTimeout(300);
const act = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), pp = E.calc.parcialActual(); return E.store.get('act:' + g.id + ':memo' + pp.id); });
ok('📝 actividad en tareas y ejercicios: 100 a quien lo terminó', act && act.categoria === 'trabajos' && Object.values(act.notas).filter(v => v === 100).length === 2 && !act.notas[aids[0]], JSON.stringify(act && act.notas));
// proyector por equipos
await p.check('[data-ch=mm-cfg][data-k=niv][value="3"]'); await p.waitForTimeout(300);
const urlP = await p.evaluate(() => window.E.memo.url(window.E.data.grupoActual(), 'p'));
const w = await ctx.newPage(); await w.setViewportSize({ width: 1280, height: 720 }); await w.goto(urlP); await w.waitForTimeout(600);
ok('en el proyector: nivel 3 (válvulas completas) y equipos', await w.evaluate(() => document.body.classList.contains('proy') && document.querySelector('[name=niv]:checked').value === '3' && !!document.querySelector('[name=eq]')));
await w.click('#go'); await w.waitForTimeout(500);
const pr = await w.evaluate(() => { const S = window.ISO1219.COMPLETAS, cs = Array.from(document.querySelectorAll('.c')).map(c => { const f = c.querySelector('.fr'); return { i: +c.dataset.i, tx: f.classList.contains('tx'), n: f.classList.contains('tx') ? f.textContent : (S.find(s => { const z = document.createElement('span'); z.innerHTML = s.svg; return z.innerHTML === f.innerHTML; }) || {}).n }; });
  const s = cs.filter(c => !c.tx); return [[s[0].i, cs.find(x => x.tx && x.n === s[0].n).i], [s[1].i, s[2].i]]; });
await w.click('.c[data-i="' + pr[0][0] + '"]'); await w.click('.c[data-i="' + pr[0][1] + '"]'); await w.waitForTimeout(300);
ok('pareja del equipo: pide que lo expliquen antes de ver la respuesta', await w.evaluate(() => /Explíquenlo/.test(document.querySelector('.pan').textContent) && /Equipo 1/.test(document.querySelector('.pan').textContent)));
await w.screenshot({ path: OUT + '/proyector-pareja.png' });
await w.click('#ver'); await w.click('#seg'); await w.waitForTimeout(200);
await w.click('.c[data-i="' + pr[1][0] + '"]'); await w.click('.c[data-i="' + pr[1][1] + '"]'); await w.waitForTimeout(2000);
ok('el equipo 1 lleva 1 punto y al fallar pasa el turno al equipo 2', await w.evaluate(() => /Equipo 1: 1/.test(document.querySelector('.eq:nth-child(1)').textContent) && document.querySelector('.eq.t').textContent.startsWith('Equipo 2')));
await w.screenshot({ path: OUT + '/proyector.png' });
// impresos
const imp = async (a, nombre) => { await p.bringToFront(); await p.evaluate(() => { location.hash = '#/memorama'; }); await p.waitForTimeout(400); await p.click('[data-act=' + a + ']'); await p.waitForTimeout(900);
  await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT + '/' + nombre + '.pdf', preferCSSPageSize: true, printBackground: true }); await p.emulateMedia({ media: 'screen' });
  return Number((execFileSync('pdfinfo', [OUT + '/' + nombre + '.pdf']).toString().match(/Pages:\s+(\d+)/) || [])[1]); };
await p.check('[data-ch=mm-cfg][data-k=niv][value="1"]'); await p.waitForTimeout(200);
for (const k of ['cil', 'aux']) await p.check('[data-ch=mm-cfg][data-k=cats][value="' + k + '"]');
await p.waitForTimeout(300);
let n = await imp('mm-fichas', 'fichas'); const tfi = execFileSync('pdftotext', [OUT + '/fichas.pdf', '-']).toString();
ok('fichas de estudio con los 4 temas', n >= 2 && n <= 5 && /Válvula 5\/2/.test(tfi) && /Estranguladora con antirretorno/.test(tfi) && /Compresor/.test(tfi), n);
n = await imp('mm-cartas', 'cartas');
ok('cartas: 12 por hoja (2 por símbolo)', n === Math.ceil(I.n * 2 / 12), n + ' hojas');
execFileSync('pdftoppm', ['-r', '40', '-png', '-f', '1', '-l', '1', OUT + '/fichas.pdf', OUT + '/fichas']);
execFileSync('pdftoppm', ['-r', '40', '-png', '-f', '1', '-l', '1', OUT + '/cartas.pdf', OUT + '/cartas']);
ok('en la clase del memorama sale el botón al juego', await p.evaluate(() => window.E.memo.enClase({ t: 'Válvulas: vías, posiciones y accionamientos', pasos: [[40, 'Memorama de simbología ISO 1219.']] }) && !window.E.memo.enClase({ t: 'Ley de Ohm', pasos: [[40, 'Ejercicios.']] })));
ok('sin errores de JavaScript', errs.length === 0, errs.join(' | '));
await b.close();

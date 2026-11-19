// v1.41.0: elevador de 2 pisos — proyección renglón por renglón, simulador y clase del día
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t181';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-19T09:40:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(400);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['Ana Pérez Lara', 'Beto Soto Mena']); await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(400);
await p.evaluate(() => { location.hash = '#/inicio'; }); await p.waitForTimeout(600);
let v = await p.evaluate(() => document.getElementById('view').innerText);
ok('en Inicio, el día de la clase: el elevador con sus botones', /Hoy: el elevador en diagrama escalera/.test(v) && await p.evaluate(() => !!document.querySelector('[data-act=elev-proj]') && !!document.querySelector('a[href="elevador.html"]')));
const sl = await p.evaluate(() => window.E.elev.slides().map(s => s.k + '|' + s.h));
ok('proyección: repaso de ayer, maqueta, 12 renglones, 4 preguntas, secuencia y tarea', sl.length === 26 && sl.filter(s => /^html\|Renglón/.test(s)).length === 12 && sl.filter(s => /^q\|/.test(s)).length === 7 && /Repaso de ayer/.test(sl[1]) && /La maqueta/.test(sl[4]), sl.length + ' · ' + sl.slice(0, 6).join(' / '));
ok('cada renglón trae su recorte y el diagrama completo con el actual resaltado', await p.evaluate(() => { const E = window.E, a = E.elev.lad(5), m = E.elev.lad(5, 'mini'); return /viewBox="0 [\d.]+ 985 /.test(a) && /fill="#ffd84d"/.test(a) && (m.match(/opacity="\.1"/g) || []).length === 7 && /KM1B/.test(a); }));
ok('sale en las clases de diagrama de escalera y en el banco de ideas', await p.evaluate(() => { const E = window.E; return E.elev.enClase({ id: 'escalera', t: 'Diagrama de escalera en papel' }) && E.elev.enClase({ id: 'electro', t: 'Electroneumática: mando eléctrico' }) && !E.elev.enClase({ id: 'caudal', t: 'Caudal y velocidad del cilindro' }) && E.IDEAS.some(x => x.id === 'elevador-escalera'); }));
await p.click('[data-act=elev-proj]'); await p.waitForTimeout(500);
for (let i = 0; i < 4; i++) { await p.evaluate(() => document.querySelector('[data-act=proj-next]').click()); await p.waitForTimeout(150); }
await p.screenshot({ path: OUT + '/maqueta.png' });
for (let i = 0; i < 7; i++) { await p.evaluate(() => document.querySelector('[data-act=proj-next]').click()); await p.waitForTimeout(120); }
const t = await p.evaluate(() => document.getElementById('proj').innerText);
await p.screenshot({ path: OUT + '/renglon.png' });
ok('en el proyector se ve el renglón con su explicación', /Renglón \d+ de 12/.test(t), (t.match(/Renglón[^\n]*/) || [])[0]);
await p.evaluate(() => document.querySelector('[data-act=proj-close]').click()); await p.waitForTimeout(200);
// simulador independiente
const s = await ctx.newPage(); const e2 = []; s.on('pageerror', e => e2.push(e.message));
await s.goto('http://localhost:' + PORT + '/elevador.html'); await s.waitForTimeout(800);
ok('el simulador abre aparte con «Imprimir» y «‹ Escuadra»', await s.evaluate(() => !document.getElementById('b-imp').hidden && !document.getElementById('b-volver').hidden && document.querySelectorAll('.rg').length >= 12));
await s.click('[data-esc="2"]'); await s.waitForTimeout(6000);
ok('el simulador funciona: sube con B3 y abre las puertas en el piso 2', await s.evaluate(() => { const st = window.__sim.st(); return st.S2 && (st.KM2A || st.CRP); }), JSON.stringify(await s.evaluate(() => window.__sim.pos())));
ok('sin errores de página', errs.length === 0 && e2.length === 0, errs.concat(e2).join(' | '));
await b.close();

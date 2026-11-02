import { chromium } from 'playwright';
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-10-27T11:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
// 0) ninguna acción (A['…']) se registra en dos archivos: la última carga pisa a la anterior
import { readdirSync, readFileSync } from 'node:fs';
const SRC = (process.env.SRC || process.cwd()), cuenta = {};
readdirSync(SRC).filter(f => f.endsWith('.js') && f !== 'escuadra.min.js').forEach(f => {
  const s = readFileSync(SRC + '/' + f, 'utf8');
  for (const m of s.matchAll(/A\['([a-zA-Z0-9_-]+)'\]\s*=/g)) (cuenta[m[1]] = cuenta[m[1]] || []).push(f);
  for (const m of s.matchAll(/\bA\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=[^=]/g)) (cuenta[m[1]] = cuenta[m[1]] || []).push(f);
});
const dup = Object.keys(cuenta).filter(k => cuenta[k].length > 1);
ok('ninguna acción se registra en dos archivos', dup.length === 0, dup.map(k => k + ' en ' + cuenta[k].join(',')).join(' | ') || 'sin duplicados');

await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);

// grupo de prueba (igual que t148)
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
const nombres = ['Karla Cruz Ruiz', 'Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera', 'Eli Rojas Paz', 'Fer Ruiz Gil', 'Gabo Mora Sanz'];
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, nombres); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const gid = await p.evaluate(() => window.E.data.grupoActual().id);

// 1) crear un examen con el generador de la app
await p.evaluate(() => { location.hash = '#/examen'; }); await p.waitForTimeout(800);
const hayGen = await p.evaluate(() => !!document.querySelector('[data-act=ex-gen]'));
ok('la pantalla de examen tiene el generador', hayGen);
if (hayGen) { await p.click('[data-act=ex-gen]'); await p.waitForTimeout(600); }
const exId = await p.evaluate(gid => { const ks = window.E.store.keys('exa:' + gid + ':'); return ks.length ? ks[ks.length - 1].split(':').pop() : null; }, gid);
ok('se generó un examen', !!exId, String(exId));
if (!exId) { console.log('ABORTO: sin examen no hay nada que imprimir'); await b.close(); process.exit(1); }

// 2) capturar lo que mandaría a imprimir (sin abrir la ventana de impresión)
await p.evaluate(() => { window.__pr = []; window.E.print.run = (h, o) => { window.__pr.push({ title: (o || {}).title || '', html: String(h) }); }; });
await p.evaluate(id => { location.hash = '#/examen/' + id; }, exId); await p.waitForTimeout(800);
const tieneA = await p.evaluate(() => !!document.querySelector('[data-act=ex-print][data-v=A]'));
ok('el examen muestra el botón Versión A', tieneA);
await p.click('[data-act=ex-print][data-v=A]'); await p.waitForTimeout(300);
const pr1 = await p.evaluate(() => (window.__pr || []).slice(-1)[0] || null);
ok('Versión A manda a imprimir el EXAMEN (título del examen)', !!pr1 && /Examen del/.test(pr1.title) && /Instrucciones/.test(pr1.html) && !/Expediente docente/.test(pr1.title), pr1 ? pr1.title : 'nada');
ok('Versión A no manda el expediente docente', !!pr1 && !/EXPEDIENTE DOCENTE/.test(pr1.html), pr1 ? pr1.html.slice(0, 80) : '');

// 3) el botón del expediente sigue imprimiendo el expediente
await p.evaluate(() => { window.__pr = []; }); await p.evaluate(() => { location.hash = '#/expediente'; }); await p.waitForTimeout(900);
const btnExp = await p.evaluate(() => { const x = [...document.querySelectorAll('button')].find(b => /Imprimir expediente de todos mis grupos/.test(b.textContent)); return !!x; });
ok('el botón «Imprimir expediente de todos mis grupos» existe', btnExp);
await p.evaluate(() => { const x = [...document.querySelectorAll('button')].find(b => /Imprimir expediente de todos mis grupos/.test(b.textContent)); x.click(); }); await p.waitForTimeout(400);
const pr2 = await p.evaluate(() => (window.__pr || []).slice(-1)[0] || null);
ok('el botón del expediente imprime el expediente docente', !!pr2 && /Expediente docente/.test(pr2.title), pr2 ? pr2.title : 'nada');

ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

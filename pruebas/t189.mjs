// v1.49.0: paquete 6 · asistente con Claude, lista con QR, inventario con QR, tu enseñanza, sin internet y expediente
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t189';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City', acceptDownloads: true });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const posts = [];
const ctx2 = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX' });
await ctx2.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"http://localhost:' + PORT + '/fake",supabaseAnonKey:"k"};', contentType: 'application/javascript' }); if (u.includes('/fake/rest/v1/')) { posts.push(JSON.parse(r.request().postData() || '{}')); return r.fulfill({ status: 201, body: '' }); } if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/alumnos'); await p.waitForTimeout(1500);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz']); await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); window.print = () => { }; window.__ab = []; window.open = x => { window.__ab.push(String(x)); return null; }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); }); await p.waitForTimeout(400);
const al = await p.evaluate(() => window.E.data.alumnos(window.E.data.grupoActual()).map(a => a.id));
// 34 · asistente
await p.evaluate(() => { location.hash = '#/asistente'; }); await p.waitForTimeout(500);
await p.evaluate(() => document.querySelector('[data-act=ai-ver]').click()); await p.waitForTimeout(300);
let v = await p.evaluate(() => (document.querySelector('.ai-pre') || {}).textContent || '');
ok('asistente: petición con datos del grupo y sin nombres', /Alumno 1:/.test(v) && /Lo que necesito/.test(v) && !/Ana Pérez/.test(v), v.slice(0, 200));
await p.evaluate(() => document.querySelector('[data-act=ai-t][data-t=junta]').click()); await p.waitForTimeout(200);
await p.evaluate(() => document.querySelector('[data-act=ai-go]').click()); await p.waitForTimeout(300);
ok('copiar y abrir Claude', (await p.evaluate(() => window.__ab.slice(-1)[0])) === 'https://claude.ai/new');
// 35 · lista con QR: tokens, página del alumno y guardado
const val = await p.evaluate(() => { const QL = window.E.qrlista, d = { f: '2026-11-25', seed: 's1', ini: '07:00', tol: 10 }, w = Math.floor(Date.parse('2026-11-25T13:05:00Z') / 15000);
  const rows = [{ resp: { num: 1, f: d.f, w: w, tk: QL.tk('s1', w), dev: 'x' }, creado: '2026-11-25T13:05:05Z' }, { resp: { num: 2, f: d.f, w: w, tk: '000000', dev: 'y' }, creado: '2026-11-25T13:05:05Z' }, { resp: { num: 3, f: d.f, w: w - 40, tk: QL.tk('s1', w - 40), dev: 'z' }, creado: '2026-11-25T13:05:05Z' }, { resp: { num: 2, f: d.f, w: w, tk: QL.tk('s1', w), dev: 'x' }, creado: '2026-11-25T13:20:00Z' }];
  const r = QL.valida(d, rows); return { nums: Object.keys(r).join(), dup: (r[1] || {}).dup, lim: QL.limite(d) }; });
ok('lista QR: token correcto y vigente; rechaza token falso o viejo; marca el mismo celular', val.nums === '1' && val.lim === '07:10', JSON.stringify(val));
const lurl = await p.evaluate(async () => { const E = window.E, g = E.data.grupoActual(), c0 = E.sync.client, u0 = E.sync.user; E.sync.client = c0 || {}; E.sync.user = { id: 'yo' }; const r = await E.qrlista.url(g, { f: E.u.today(), seed: 's9' }); E.sync.client = c0; E.sync.user = u0; return r; });
const lp = await ctx2.newPage(); lp.on('pageerror', e => errs.push('lista: ' + e.message)); lp.on('dialog', d => d.accept()); await lp.goto(lurl); await lp.waitForTimeout(500);
await lp.click('[data-n="2"]'); await lp.waitForTimeout(500);
ok('el alumno elige su número y se registra', posts.length === 1 && posts[0].encuesta.indexOf('lis-') === 0 && posts[0].resp.num === 2 && /Quedaste registrado/.test(await lp.evaluate(() => document.body.innerText)), JSON.stringify(posts[0] || {}));
await lp.reload(); await lp.waitForTimeout(400);
ok('un celular, un número por día', /Ya quedaste/.test(await lp.evaluate(() => document.body.innerText))); await lp.close();
await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), f = E.u.today(); E.store.put('qrlista:' + g.id + ':' + f, { f: f, seed: 's9', ini: '00:00', tol: 1440 }); E.ui.qlReg = { [g.id]: { 1: { t: new Date().toISOString(), dev: 'a' }, 2: { t: new Date().toISOString(), dev: 'b' } } }; location.hash = '#/qrlista'; }); await p.waitForTimeout(500);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('lista QR sin Supabase avisa; con registros muestra quién falta', /Necesita Supabase/.test(v) && /Se registraron 2 de 3/.test(v) && /No se registraron \(falta\): 3\./.test(v), v.slice(0, 300));
await p.evaluate(() => document.querySelector('[data-act=ql-guarda]').click()); await p.waitForTimeout(300);
const as = await p.evaluate(ids => { const E = window.E, g = E.data.grupoActual(), d = E.store.get('asis:' + g.id + ':' + E.u.today()) || {}; return ids.map(i => E.calc.marca(d, i)).join(); }, al);
ok('guardar en la lista: presentes y falta a quien no se registró', as === 'A,A,F', as);
// 36 · inventario con QR
await p.evaluate(() => { window.E.store.put('inv', { items: [{ id: 'it1', n: 'Multímetro', cant: 3, ubic: 'Gabinete 1' }], prestamos: [], compras: [] }); location.hash = '#/inventario'; }); await p.waitForTimeout(500);
ok('inventario: etiquetas y escanear', await p.evaluate(() => !!document.querySelector('[data-act=iq-imp]') && !!document.querySelector('[data-act=iq-scan]')));
await p.evaluate(() => document.querySelector('[data-act=iq-imp]').click()); await p.waitForTimeout(500);
ok('etiquetas con QR impresas', await p.evaluate(() => document.querySelectorAll('#print-root .iq-et svg').length === 1));
await p.evaluate(() => window.E.inventario.modalItem('it1')); await p.waitForTimeout(300);
await p.evaluate(id => { document.getElementById('iv-quien').value = id; document.querySelector('[data-act=iq-prestar]').click(); }, al[0]); await p.waitForTimeout(300);
await p.evaluate(() => window.E.inventario.modalItem('it1')); await p.waitForTimeout(300);
ok('al escanear: prestar y luego recibir', /Recibir/.test(await p.evaluate(() => document.querySelector('.modal, dialog, #modal').innerText)));
await p.evaluate(() => document.querySelector('[data-act=iq-dev]').click()); await p.waitForTimeout(300);
ok('devuelto', await p.evaluate(() => window.E.inventario.doc().prestamos[0].dev === window.E.u.today()));
// 38 · tu enseñanza
await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(); E.store.put('obs:' + g.id + ':2026-11-10', { [E.data.alumnos(g)[0].id]: ['explico', 'pregunta'] }); location.hash = '#/ensenanza'; }); await p.waitForTimeout(800);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('tu enseñanza: clases, lugares, momentos, asistencia por día y reconocimiento', /clases dadas/.test(v) && /Momentos de la clase/.test(v) && /Desarrollo/.test(v) && /Asistencia por día/.test(v) && /2 observaciones positivas/.test(v), v.slice(0, 500));
// 39 · sin internet
await p.evaluate(() => { location.hash = '#/sininternet'; }); await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('[data-act=off-prep]').click()); await p.waitForTimeout(2500);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('sin internet: revisión de la app, librerías y almacenamiento', /Resultado/.test(v) && /La app guardada en el celular/.test(v) && /Lector de QR/.test(v) && /Espacio usado|Almacenamiento/.test(v), v.slice(0, 600));
await ctx.setOffline(true); await p.evaluate(() => window.dispatchEvent(new Event('offline'))); await p.waitForTimeout(300);
ok('aviso de sin internet', /Sin internet/.test(await p.evaluate(() => (document.getElementById('off-band') || {}).textContent || '')));
await ctx.setOffline(false); await p.evaluate(() => window.dispatchEvent(new Event('online'))); await p.waitForTimeout(200);
ok('al volver el internet se quita', await p.evaluate(() => !document.getElementById('off-band')));
// 40 · expediente
const F = await p.evaluate(() => { const E = window.E, F = E.expediente(E.data.grupoActual()); return { k: Object.keys(F).join(), cal: F['calificaciones.csv'].split('\r\n').length, asis: F['asistencia.csv'].split('\r\n')[3], h: /Expediente del semestre/.test(F['expediente.html']) && /Resultados por parcial/.test(F['expediente.html']) }; });
ok('expediente: HTML y CSV de alumnos, calificaciones, asistencia y actividades', F.k === 'alumnos.csv,calificaciones.csv,asistencia.csv,actividades.csv,expediente.html' && F.cal === 4 && F.h && /,F/.test(F.asis), JSON.stringify(F));
await p.evaluate(() => { window.JSZip = function () { const f = {}; this.file = (n, c) => { f[n] = c; }; this.generateAsync = async () => { window.__zip = Object.keys(f); return new Blob(['zip']); }; }; location.hash = '#/inicio'; }); await p.waitForTimeout(400);
const [dl] = await Promise.all([p.waitForEvent('download'), p.evaluate(() => window.E.actions['xp-zip']())]);
const zf = await p.evaluate(() => window.__zip || []);
await p.evaluate(() => { location.hash = '#/expediente'; }); await p.waitForTimeout(500);
ok('el expediente docente trae el ZIP', await p.evaluate(() => !!document.querySelector('#view [data-act=xp-zip]')) && /Imprimir expediente de todos mis grupos/.test(await p.evaluate(() => document.getElementById('view').innerText)));
ok('ZIP con todo y el respaldo', /expediente-/.test(dl.suggestedFilename()) && zf.some(x => /respaldo-completo\.json$/.test(x)) && zf.some(x => /expediente\.html$/.test(x)), zf.join(' | '));
ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

// v1.46.0: paquete 3 · insignias, portal del alumno, repaso antes del examen, portafolio del proyecto, buzón y coevaluación
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t186';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
const posts = [];
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const ctx2 = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX' });
await ctx2.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"http://localhost:' + PORT + '/fake",supabaseAnonKey:"k"};', contentType: 'application/javascript' }); if (u.includes('/fake/rest/v1/')) { posts.push(JSON.parse(r.request().postData() || '{}')); return r.fulfill({ status: 201, body: '' }); } if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-12-01T09:00:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/alumnos'); await p.waitForTimeout(1500);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera']); await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); }); await p.waitForTimeout(400);
const info = await p.evaluate(() => { const E = window.E, S = E.store, C = E.calc, g = E.data.grupoActual(), al = E.data.alumnos(g);
  // asistencia del 2º parcial completa (todos vienen) → asistencia perfecta
  C.fechasLista(g, C.parcial('P2')).forEach(f => { const d = {}; al.forEach(a => { d[a.id] = 'A'; }); S.put('asis:' + g.id + ':' + f, d, { silent: true }); });
  S.put('obs:' + g.id + ':2026-11-20', { [al[0].id]: ['explico'] }, { silent: true }); S.put('obs:' + g.id + ':2026-11-25', { [al[0].id]: ['explico', 'pregunta'] }, { silent: true });
  S.put('act:' + g.id + ':e2', { id: 'e2', parcial: 'P2', categoria: 'examen', nombre: 'Examen 2', peso: 1, max: 100, fecha: '2026-10-20', notas: { [al[0].id]: 100, [al[1].id]: 70 } }, { silent: true });
  // examen próximo (en 3 días) con preguntas del banco
  const bq = E.BANCO.filter(x => x.tipo !== 'ab').slice(0, 6); S.put('exa:' + g.id + ':x1', { id: 'x1', titulo: 'Examen del 3er parcial', parcial: 'P3', fecha: '2026-12-04', creado: '2026-11-30', items: bq.map(x => ({ id: x.id, pts: 1 })), total: bq.length }, { silent: true });
  S.put('act:' + g.id + ':ent1', { id: 'ent1', parcial: 'P3', categoria: 'trabajos', nombre: 'Plano del mecanismo', peso: 1, max: 10, fecha: '2026-12-08', notas: {} }, { silent: true });
  // equipos del proyecto
  const pid = E.proyecto.canon(g, 'P3'); S.put('proy:' + g.id + ':' + pid, { equipos: [{ id: 'eqA', nombre: 'Equipo 1', al: [al[0].id, al[1].id], nota: 'Traen tornillos', proy: 'Garra roja' }, { id: 'eqB', nombre: 'Equipo 2', al: [al[2].id, al[3].id] }] }, { silent: true });
  return { al: al.map(a => a.id), pid: pid, gid: g.id };
});
// 16 · insignias
await p.evaluate(() => { location.hash = '#/insignias'; }); await p.waitForTimeout(700);
let v = await p.evaluate(() => document.getElementById('view').innerText);
ok('insignias: asistencia perfecta, explica, 10 en examen; nuevas de la semana', /Nuevas esta semana \(\d+\)/.test(v) && /Asistencia perfecta/.test(v) && /Explica a sus compañeros/.test(v) && /10 en un examen/.test(v), v.slice(0, 400));
ok('sin ranking: la lista va por número de lista', await p.evaluate(() => [...document.querySelectorAll('.ig-l li a')].slice(-4).map(a => a.textContent.split('.')[0]).join() === '1,2,3,4'));
await p.evaluate(id => { location.hash = '#/alumno/' + id; }, info.al[0]); await p.waitForTimeout(600);
ok('ficha: tarjeta de insignias', /Insignias \(\d\)/.test(await p.evaluate(() => document.getElementById('view').innerText)));
// 15 · portal del alumno
const url = await p.evaluate(async id => { const E = window.E, g = E.data.grupoActual(); return E.casa.consultaURL(g, E.data.alumno(g, id), 'P3'); }, info.al[0]);
const q = await ctx.newPage(); q.on('pageerror', e => errs.push('consulta: ' + e.message)); await q.goto(url); await q.waitForTimeout(800);
v = await q.evaluate(() => document.body.innerText);
ok('portal: su semestre, lo que viene y sus insignias', /Tu semestre/.test(v) && /Lo que viene/.test(v) && /Plano del mecanismo/.test(v) && /Tus insignias/.test(v) && /Asistencia perfecta/.test(v), v.slice(0, 300));
await q.screenshot({ path: OUT + '/portal.png', fullPage: true }); await q.close();
// 17 · repaso antes del examen
await p.evaluate(() => { location.hash = '#/inicio'; }); await p.waitForTimeout(600); await p.screenshot({ path: OUT + '/inicio.png', fullPage: true });
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('Inicio avisa del repaso antes del examen', /Repaso antes del examen/.test(v) && /Examen del 3er parcial[^\n]*en 3 días/.test(v), (v.match(/Repaso antes[\s\S]{0,160}/) || [])[0] || String(v.length) + ' ' + JSON.stringify(v.match(/[^\n]*xamen[^\n]*/g)));
await p.evaluate(() => { location.hash = '#/repasoexamen'; }); await p.waitForTimeout(500);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('3 rondas por examen', (await p.evaluate(() => document.querySelectorAll('.rx-c').length)) === 3 && /simulacro/.test(v));
await p.evaluate(() => document.querySelector('[data-act=rx-qr][data-n="2"]').click()); await p.waitForTimeout(800);
const rurl = await p.evaluate(() => window.E.ui.rxUrl);
ok('QR del repaso', !!rurl && /repaso\.html#/.test(rurl) && await p.evaluate(() => !!document.querySelector('.modal svg, dialog svg, #modal svg')));
await p.evaluate(() => window.E.modal.close());
const r2 = await ctx.newPage(); r2.on('pageerror', e => errs.push('repaso: ' + e.message)); await r2.goto(rurl); await r2.waitForTimeout(800);
ok('repaso.html abre con las preguntas', /Pregunta 1 de 8/.test(await r2.evaluate(() => document.body.innerText)), (await r2.evaluate(() => document.body.innerText)).slice(0, 200)); await r2.close();
// 18 · portafolio del proyecto
await p.evaluate(pid => { location.hash = '#/proyecto/' + pid; }, info.pid); await p.waitForTimeout(700);
ok('proyecto: botón de portafolio por equipo', (await p.evaluate(() => document.querySelectorAll('[data-act=pp-imp]').length)) === 2);
await p.evaluate(() => document.querySelector('[data-act=pp-imp][data-eq=eqA]').click()); await p.waitForTimeout(800);
v = await p.evaluate(() => document.getElementById('print-root').innerText);
ok('portafolio: portada, etapas, notas y reflexión', /Portafolio del proyecto/.test(v) && /Garra roja/.test(v) && /Ana Pérez Lara/.test(v) && /Etapas del proyecto/.test(v) && /Traen tornillos/.test(v) && /Reflexión del equipo/.test(v), v.slice(0, 300));
// 19 · buzón (sin Supabase avisa; la página del alumno manda el mensaje)
await p.evaluate(() => { location.hash = '#/buzon'; }); await p.waitForTimeout(500);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('buzón sin Supabase explica qué falta y el protocolo', /Buzón anónimo/.test(v) && /Necesita Supabase/.test(v) && /orientación/.test(v));
const burl = await p.evaluate(async () => { const E = window.E; return location.href.split('#')[0].replace(/[^/]*$/, '') + 'encuesta.html#' + await E.casa.empaca({ v: 1, k: 'buz', o: 'yo', e: 'buz-x', g: '3°A' }); });
const bz = await ctx2.newPage(); bz.on('pageerror', e => errs.push('buzón: ' + e.message)); bz.on('dialog', d => d.accept()); await bz.goto(burl); await bz.waitForTimeout(600);
await bz.click('[data-t=duda]'); await bz.fill('#bt', 'No entendí el mecanismo de cuatro barras'); await bz.click('#env'); await bz.waitForTimeout(600);
ok('buzón: el alumno manda sin nombre', posts.length === 1 && posts[0].encuesta === 'buz-x' && posts[0].resp.tipo === 'duda' && !('de' in posts[0].resp) && /Gracias/.test(await bz.evaluate(() => document.body.innerText)), JSON.stringify(posts));
await bz.close();
ok('buzón: detecta mensajes de riesgo', await p.evaluate(() => window.E.buzon.ALERTA.test('me hacen bullying en el salón') && !window.E.buzon.ALERTA.test('pongan más prácticas')));
// 20 · coevaluación en papel
await p.evaluate(() => { location.hash = '#/coeval'; }); await p.waitForTimeout(500);
await p.evaluate(() => document.querySelector('[data-act=ce-nueva][data-m=mano]').click()); await p.waitForTimeout(600);
await p.evaluate(() => { const set = (i, k, val) => { const el = document.querySelectorAll('[data-ch=ce-man][data-k=' + k + ']')[i]; el.value = val; el.dispatchEvent(new Event('change', { bubbles: true })); }; set(0, 'auto', 4); set(0, 'pares', 3.8); set(1, 'auto', 4); set(1, 'pares', 2); set(2, 'auto', 2); set(2, 'pares', 3.5); }); await p.waitForTimeout(500);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('coevaluación: banderas (aportó poco, se subestima)', /Aportó poco según su equipo/.test(v) && /Se subestima/.test(v), (v.match(/Resultados[\s\S]{0,300}/) || [])[0]);
await p.evaluate(() => document.querySelector('[data-act=ce-act]').click()); await p.waitForTimeout(400);
const act = await p.evaluate(ids => { const S = window.E.store, g = window.E.data.grupoActual(); const a = S.list('act:' + g.id + ':').find(x => x.instrumento === 'Coevaluación'); return a ? [a.notas[ids[0]], a.notas[ids[1]], a.parcial] : null; }, info.al);
ok('pasa a calificaciones (promedio de compañeros, 4 = 100)', act && act[0] === 95 && act[1] === 50 && act[2] === 'P3', JSON.stringify(act));
await p.evaluate(() => document.querySelector('[data-act=ce-formato]').click()); await p.waitForTimeout(400);
ok('formatos impresos: uno por alumno', (await p.evaluate(() => document.querySelectorAll('#print-root .ce-pr').length)) === 4);
// coevaluación por QR: la página del alumno y el cálculo
const curl = await p.evaluate(async () => { const E = window.E, g = E.data.grupoActual(), x = E.coev.lista(g)[0], c0 = E.sync.client, u0 = E.sync.user; E.sync.client = c0 || {}; E.sync.user = { id: 'yo' }; const r = await E.coev.url(g, x); E.sync.client = c0; E.sync.user = u0; return r; });
const ce = await ctx2.newPage(); ce.on('pageerror', e => errs.push('coe: ' + e.message)); ce.on('dialog', d => d.accept()); await ce.goto(curl); await ce.waitForTimeout(600);
await ce.click('[data-n="1"]'); await ce.waitForTimeout(300);
for (const n of ['1', '2']) for (let k = 0; k < 4; k++) await ce.click('[data-a="' + n + '"][data-c="' + k + '"][data-v="' + (n === '1' ? 4 : 2) + '"]');
await ce.click('#env'); await ce.waitForTimeout(600); await ce.screenshot({ path: OUT + '/coe.png', fullPage: true });
const pc = posts[posts.length - 1];
ok('coevaluación por QR: elige su número y evalúa a su equipo', pc && pc.resp.de === 1 && pc.resp.ev['2'].join() === '2,2,2,2' && pc.resp.ev['1'].length === 4, JSON.stringify(pc));
await ce.close();
const calc = await p.evaluate(rows => { const E = window.E, g = E.data.grupoActual(), x = E.coev.lista(g)[0], al = E.data.alumnos(g); const r = E.coev.calcula(g, Object.assign({}, x, { modo: 'nube' }), rows); return [r[al[0].id].auto, r[al[1].id].pares, r[al[0].id].pares]; }, [{ resp: pc.resp }, { resp: { de: 2, ev: { 1: [3, 3, 3, 3], 2: [4, 4, 4, 4] } } }]);
ok('cálculo: auto y promedio de compañeros', calc[0] === 4 && calc[1] === 2 && calc[2] === 3, JSON.stringify(calc));
ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

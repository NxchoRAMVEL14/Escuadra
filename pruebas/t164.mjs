import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t164';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-17T08:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));



await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
const nombres = ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera', 'Eli Rojas Paz', 'Fer Ruiz Gil'];
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, nombres); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
await p.evaluate(() => { window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); });

// 1) informes para padres: firmas hasta abajo, una hoja por alumno
await p.evaluate(() => { location.hash = '#/imprimir'; }); await p.waitForTimeout(700);
await p.evaluate(() => document.querySelector('[data-act=ap-padres-todos]').click()); await p.waitForTimeout(1200);
await p.emulateMedia({ media: 'print' });
const pd = await p.evaluate(() => [...document.querySelectorAll('#print-root .pr.padres')].map(h => { const r = h.getBoundingClientRect(), f = h.querySelector('.ap-firmas').getBoundingClientRect(); return { fit: h.classList.contains('pd-fit'), pos: Math.round((f.bottom - r.top) / r.height * 100), z: h.dataset.zoom || '' }; }));
ok('cada informe ocupa una hoja y las firmas quedan hasta abajo', pd.length === 6 && pd.every(x => x.fit && x.pos >= 97), JSON.stringify(pd));
await p.pdf({ path: OUT + '/padres.pdf', format: 'Letter', preferCSSPageSize: true, printBackground: true }); await p.emulateMedia({ media: 'screen' });
const np = (execFileSync('pdfinfo', [OUT + '/padres.pdf']).toString().match(/Pages:\s+(\d+)/) || [])[1];
ok('el PDF sale en 6 hojas (una por alumno, sin brincar a 2)', np === '6', np);
execFileSync('pdftoppm', ['-r', '45', '-f', '1', '-l', '1', '-png', OUT + '/padres.pdf', OUT + '/padres']);

// 2) evento en asueto: desfile del 16 de noviembre
await p.evaluate(() => { location.hash = '#/lista/2026-11-16'; }); await p.waitForTimeout(700);
ok('en el asueto aparece «Registrar evento y pasar lista»', await p.evaluate(() => !!document.querySelector('[data-act=ev-nuevo]')));
await p.evaluate(() => { document.getElementById('ev-n').value = 'Desfile del 20 de noviembre'; document.querySelector('[data-act=ev-nuevo]').click(); }); await p.waitForTimeout(500);
const r2 = await p.evaluate(() => { const E = window.E, S = E.store, C = E.calc, g = E.data.grupoActual(), al = E.data.alumnos(g), P3 = C.parcial('P3');
  const antes = C.asis(g, P3, al[0].id).ses;
  S.update('asis:' + g.id + ':2026-11-16', d => { d[al[5].id] = 'F'; }, {});
  return { ev: C.evento(g, '2026-11-16'), ses: C.asis(g, P3, al[0].id).ses, fer: C.asis(g, P3, al[5].id).f, antes: antes, txt: document.getElementById('view').innerText.slice(0, 400) }; });
ok('el evento queda registrado y su lista cuenta como un día de asistencia', r2.ev && r2.ev.n === 'Desfile del 20 de noviembre' && r2.fer === 1, JSON.stringify(r2).slice(0, 300));
await p.evaluate(() => { location.hash = '#/lista/2026-11-17'; }); await p.waitForTimeout(300); await p.evaluate(() => { location.hash = '#/lista/2026-11-16'; }); await p.waitForTimeout(600);
await p.evaluate(() => { document.getElementById('ev-pts').value = '2'; document.querySelector('[data-act=ev-dar]').click(); }); await p.waitForTimeout(400);
const r3 = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), al = E.data.alumnos(g), d = E.store.get('part:' + g.id + ':2026-11-16') || {}; return al.map(a => d[a.id] || 0); });
ok('«Darlos a los que fueron»: 2 puntos de participación a los 5 que fueron, 0 a quien no', JSON.stringify(r3) === '[2,2,2,2,2,0]', JSON.stringify(r3));
await p.evaluate(() => document.querySelector('[data-act=ev-dar]').click()); await p.waitForTimeout(300);
const r3b = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), al = E.data.alumnos(g); return E.calc.part(g, E.calc.parcial('P3'), al[0].id); });
ok('si vuelves a darlos no se suman dos veces', r3b === 2, r3b);
await p.evaluate(() => { const s = document.querySelector('[data-ch=ev-asis]'); s.checked = false; s.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(300);
const r4 = await p.evaluate(() => { const E = window.E, C = E.calc, g = E.data.grupoActual(), al = E.data.alumnos(g); return C.asis(g, C.parcial('P3'), al[5].id).f; });
ok('con «Cuenta para asistencia» apagado, quien no fue ya no lleva falta', r4 === 0, r4);
await p.evaluate(() => { location.hash = '#/lista/2026-11-17'; }); await p.waitForTimeout(500);
const prev = await p.evaluate(() => (document.querySelector('.datebar [aria-label="Clase anterior"]') || {}).dataset.to);
ok('desde la clase del 17 nov, «anterior» lleva al desfile (16 nov)', prev === 'lista/2026-11-16', prev);

// 3) videos con sonido
const emb = await p.evaluate(() => window.E.medios.embed('abc123'));
ok('los videos se cargan con sonido (mute=0) y con origin para los botones ▶/⏸', /mute=0/.test(emb) && /origin=/.test(emb), emb);

// 4) diagnóstico del 3er parcial
await p.evaluate(() => { location.hash = '#/clase/2026-11-17'; }); await p.waitForTimeout(800);
let hay = await p.evaluate(() => !!document.querySelector('[data-act=dg-print]'));
if (!hay) { for (const f of ['2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13']) { await p.evaluate(f => { location.hash = '#/clase/' + f; }, f); await p.waitForTimeout(600); if (await p.evaluate(() => !!document.querySelector('[data-act=dg-print]'))) { hay = f; break; } } }
ok('la clase del encuadre del 3er parcial trae el cuestionario diagnóstico', !!hay, String(hay));
const d1 = await p.evaluate(async () => { document.querySelector('[data-act=dg-print][data-q=grupo]').click(); await new Promise(r => setTimeout(r, 900)); const hs = [...document.querySelectorAll('#print-root .dg')]; return { n: hs.length, q: hs[0] ? hs[0].querySelectorAll('ol.qs > li').length : 0, nom: hs[0] ? hs[0].querySelector('.nom').textContent : '', t: hs[0] ? hs[0].querySelector('h1').textContent : '' }; });
ok('imprime una hoja por alumno con su nombre y 15 preguntas de fluidos, Pascal y circuitos', d1.n === 6 && d1.q === 15 && d1.nom === 'Ana Pérez Lara' && /fluidos, Pascal y circuitos/.test(d1.t), JSON.stringify(d1));
await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT + '/diag.pdf', format: 'Letter', preferCSSPageSize: true, printBackground: true }); await p.emulateMedia({ media: 'screen' });
const npd = (execFileSync('pdfinfo', [OUT + '/diag.pdf']).toString().match(/Pages:\s+(\d+)/) || [])[1];
ok('cada diagnóstico cabe en una hoja (6 alumnos = 6 hojas)', npd === '6', npd);
execFileSync('pdftoppm', ['-r', '60', '-f', '1', '-l', '1', '-png', OUT + '/diag.pdf', OUT + '/diag']);
const d2 = await p.evaluate(async () => { document.querySelector('[data-act=dg-print][data-q=clave]').click(); await new Promise(r => setTimeout(r, 700)); return document.querySelectorAll('#print-root .dg.clave li').length; });
ok('la clave trae las 15 respuestas', d2 === 15, d2);
const d3 = await p.evaluate(async () => { document.querySelector('[data-act=dg-proj]').click(); await new Promise(r => setTimeout(r, 400)); const P = window.E.proj; const r = { n: P.s.length, q: P.s.filter(x => x.k === 'q' && x.opts).length }; P.close(); return r; });
ok('se proyecta: portada y una pregunta por diapositiva, con sus opciones', d3.n === 16 && d3.q === 15, JSON.stringify(d3));
const d4 = await p.evaluate(async () => { document.querySelector('[data-act=dg-act]').click(); await new Promise(r => setTimeout(r, 400)); const E = window.E, g = E.data.grupoActual(), a = E.store.list('act:' + g.id + ':').find(x => x.diag); return a && [a.categoria, a.max, a.cuenta]; });
ok('«Actividad para anotar aciertos» crea un diagnóstico de 15 que no cuenta', JSON.stringify(d4) === '["diagnostico",15,false]', JSON.stringify(d4));
// el del 2º parcial se arma solo con el banco (dibujo y FreeCAD)
const d5 = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), it = E.clases.seq(g, 'P2').find(x => x.id === 'encuadre'); const dg = it && E.diag.de(g, 'P2', it); return dg ? [dg.titulo, dg.qs.length, dg.qs.every(q => q.tipo !== 'om' || (q.ok >= 0 && q.ops[q.ok] === q.op[0]))] : null; });
ok('el diagnóstico del 2º parcial se arma solo con el banco (10+ preguntas, la clave coincide)', d5 && d5[1] >= 10 && d5[2], JSON.stringify(d5));
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

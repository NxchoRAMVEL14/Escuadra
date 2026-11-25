// v1.42.0: Conócete — 6 estudios en el celular, QR con puntajes, escaneo/códigos, mapa del grupo, alertas, ficha e impresos
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t182';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-19T08:00:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(400);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz']); await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); }); await p.waitForTimeout(400);
await p.evaluate(() => { location.hash = '#/conocete'; }); await p.waitForTimeout(700);
let v = await p.evaluate(() => document.getElementById('view').innerText);
ok('pantalla Conócete con los 6 estudios y su guía (qué mide, qué no, cómo ayudar)', (v.match(/Qué significa y cómo ayudarlos/g) || []).length === 6 && /Mapa del grupo/.test(v) && /Escanear resultados/.test(v));
await p.click('[data-act=cx-qr]'); await p.waitForTimeout(500);
const url = await p.evaluate(() => window.E.ui.cnUrl);
ok('QR con enlace a conocete.html', /conocete\.html#j/.test(url));
await p.evaluate(() => window.E.modal.close());
// el alumno contesta en su celular
const s = await ctx.newPage(); const e2 = []; s.on('pageerror', e => e2.push(e.message));
await s.goto(url.replace(/^https?:\/\/[^/]+/, 'http://localhost:' + PORT)); await s.waitForTimeout(600);
let sv = await s.evaluate(() => document.body.innerText);
ok('el alumno ve el menú con los 6 estudios', (sv.match(/Empezar ›/g) || []).length === 6 && /no cuentan para tu calificación/i.test(sv));
const contesta = async (id, fn) => { await s.evaluate(id => { [...document.querySelectorAll('.tst')].find(b => b.dataset.ir.endsWith(':' + id)).click(); }, id); await s.waitForTimeout(250);
  await s.evaluate(fn); await s.waitForTimeout(150); await s.click('#fin'); await s.waitForTimeout(300); };
// estudio: relee mucho y no se pone a prueba (dim0 = 1, dim3 = 5, demás 3)
await contesta('estudio', () => { const K = window.CONO, t = K.test('estudio'); t.items.forEach((x, i) => { const v = x.d === 0 ? 1 : x.d === 3 ? 5 : 3; const r = document.querySelector('input[name="p' + i + '"][value="' + v + '"]'); r.checked = true; r.dispatchEvent(new Event('change')); }); });
sv = await s.evaluate(() => document.body.innerText);
ok('resultados de estudio: niveles, consejo y «tu siguiente paso»', /Tus resultados/.test(sv) && /Ponerte a prueba/.test(sv) && /Tu siguiente paso/.test(sv) && /releer/i.test(sv));
await s.evaluate(() => document.querySelector('[data-ir=menu]').click()); await s.waitForTimeout(200);
// razonamiento: falta una → avisa; luego todas bien
await s.evaluate(() => { [...document.querySelectorAll('.tst')].find(b => b.dataset.ir.endsWith(':razon')).click(); }); await s.waitForTimeout(300);
ok('retos de razonamiento con figuras (matrices y piezas)', await s.evaluate(() => document.querySelectorAll('.rz .vis svg').length === 8 && document.querySelectorAll('.rz .ops svg').length === 32));
await s.screenshot({ path: OUT + '/razon.png', fullPage: false });
await s.evaluate(() => { const r = document.querySelector('.rz .vis'); r.scrollIntoView(); }); await s.screenshot({ path: OUT + '/razon-mat.png' });
await s.evaluate(() => { const K = window.CONO, t = K.test('razon'); t.items.forEach((x, i) => { if (i === 5) return; const r = document.querySelector('input[name="p' + i + '"][value="' + x.ok + '"]'); r.checked = true; r.dispatchEvent(new Event('change')); }); });
await s.click('#fin'); await s.waitForTimeout(200);
ok('si falta una pregunta, avisa cuál', /Te falta la 6/.test(await s.evaluate(() => document.getElementById('falta').textContent)));
await s.evaluate(() => { const K = window.CONO, x = K.test('razon').items[5], r = document.querySelector('input[name="p5"][value="' + x.ok + '"]'); r.checked = true; r.dispatchEvent(new Event('change')); }); await s.click('#fin'); await s.waitForTimeout(300);
sv = await s.evaluate(() => document.body.innerText);
ok('razonamiento: 16 de 16, su fuerte y que no es un test de CI', /Resolviste 16 de 16/.test(sv) && /no es un test de CI/.test(sv));
// número de lista → QR y códigos
await s.fill('#num', '2'); await s.click('#vcod'); await s.waitForTimeout(300);
const cods = await s.evaluate(() => [...document.querySelectorAll('.cod')].map(x => x.textContent));
ok('para el profe: QR y un código por estudio', cods.length === 2 && await s.evaluate(() => !!document.querySelector('.qr svg path')), cods.join(' '));
const qr = await s.evaluate(() => { const st = JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => /conocete/.test(k)))); const K = window.CONO, c = (location.hash && JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(location.hash.slice(2).replace(/-/g, '+').replace(/_/g, '/')), ch => ch.charCodeAt(0))))).c; return K.qrTxt(c, 2, ['estudio', 'razon'].map(id => K.codigo(c, 2, id, K.puntua(id, st.r[id])))); });
// el profe "escanea"
const ap = await p.evaluate(t => { const E = window.E, g = E.data.grupoActual(), r = E.conoce.aplica(g, t); return r.err || (r.a.num + ':' + r.n); }, qr);
ok('al escanear el QR se registran los 2 estudios de Beto', ap === '2:2', ap);
ok('un QR de otro alumno/grupo se rechaza', /otro grupo/.test(await p.evaluate(() => window.E.conoce.aplica(window.E.data.grupoActual(), 'ESCC1|zzzz|2|E1234').err)));
// código escrito a mano: mente de Ana (muy fija)
const codM = await p.evaluate(() => { const E = window.E, K = window.CONO, g = E.data.grupoActual(), c = E.conoce.sales(g)[0][1], r = {}; K.test('mente').items.forEach((x, i) => { r[i] = x.inv ? 5 : 1; }); return K.codigo(c, 1, 'mente', K.puntua('mente', r)); });
await p.evaluate(() => { location.hash = '#/conocete'; }); await p.waitForTimeout(400);
await p.click('[data-act=cx-reg]'); await p.waitForTimeout(300);
await p.evaluate(c => { const i = document.querySelector('[data-ch=cx-cod]'); i.value = c; i.dispatchEvent(new Event('change', { bubbles: true })); }, codM); await p.waitForTimeout(300);
await p.evaluate(() => window.E.modal.close()); await p.evaluate(() => { location.hash = '#/inicio'; }); await p.waitForTimeout(200); await p.evaluate(() => { location.hash = '#/conocete'; }); await p.waitForTimeout(600);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('mapa del grupo: Beto con estudio y razonamiento, Ana con mentalidad fija', /trabajar: ponerte a prueba/.test(v) && /16\/16/.test(v) && /fija/.test(v), (v.match(/Mapa del grupo[\s\S]{0,260}/) || [])[0].replace(/\n/g, ' '));
const vt = await p.evaluate(() => document.getElementById('view').textContent);
ok('a quién acercarte: Ana (cree que no puede mejorar) y Beto (estudia releyendo)', /Cree que no puede mejorar/.test(vt) && /Estudia releyendo/.test(vt));
// ficha
const beto = await p.evaluate(() => window.E.data.alumnos(window.E.data.grupoActual())[1].id);
await p.evaluate(id => { location.hash = '#/alumno/' + id; }, beto); await p.waitForTimeout(600);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('en la ficha del alumno: sus estudios con detalle', /Conócete/.test(v) && /¿Cómo estudias\?/.test(v) && /Retos de razonamiento/.test(v));
// impresos
const imp = async (act, n) => { await p.evaluate(() => { location.hash = '#/conocete'; }); await p.waitForTimeout(500); await p.evaluate(a => document.querySelector('[data-act=' + a + ']').click(), act); await p.waitForTimeout(800); await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT + '/' + n + '.pdf', preferCSSPageSize: true, printBackground: true }); await p.emulateMedia({ media: 'screen' }); return [Number((execFileSync('pdfinfo', [OUT + '/' + n + '.pdf']).toString().match(/Pages:\s+(\d+)/) || [])[1]), execFileSync('pdftotext', [OUT + '/' + n + '.pdf', '-']).toString().replace(/\s+/g, ' ')]; };
let [n, t] = await imp('cx-aviso', 'aviso');
ok('aviso para padres en 1 hoja: voluntario, confidencial, no diagnóstico y talón', n === 1 && /voluntaria/.test(t) && /no son exámenes ni diagnósticos/.test(t) && /Sí autorizo/.test(t), n);
[n, t] = await imp('cx-imp', 'grupo');
ok('resultados del grupo impresos (confidencial) con a quién acercarte', n >= 1 && /CONFIDENCIAL/.test(t) && /A quién acercarte/.test(t), n);
// las 6 pruebas se pueden contestar y codificar/decodificar
const rt = await p.evaluate(() => { const K = window.CONO; return K.T.every(t => { const r = {}; t.items.forEach((x, i) => { r[i] = t.raz ? (i % 4) : ((i * 3) % (t.esc.length)) + 1; }); const s = K.puntua(t.id, r), c = K.codigo('ab12', 7, t.id, s), o = K.lee('ab12', 7, c); return o && o.id === t.id && JSON.stringify(o.s) === JSON.stringify(s) && !K.lee('ab12', 8, c); }); });
ok('los 6 códigos se arman y se leen bien (y no sirven con otro número)', rt);
await s.emulateMedia({ colorScheme: 'dark' }); await s.evaluate(() => document.querySelector('[data-ir=menu]').click()); await s.waitForTimeout(300); await s.screenshot({ path: OUT + '/menu-oscuro.png' });
ok('sin errores de página', errs.length === 0 && e2.length === 0, errs.concat(e2).join(' | '));
await b.close();

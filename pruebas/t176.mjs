// v1.37.0 · Dinámica rápida en la clase, nuevos tipos (activadores, repaso, retos, cierres), impresos y trivia del tema
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t176';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 400, height: 860 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-17T08:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); });
const cat = await p.evaluate(() => { const L = window.E.DINAMICAS, c = o => L.filter(d => d.obj.indexOf(o) >= 0).length; return { n: L.length, act: c('activar'), rep: c('repasar'), reto: c('reto'), cer: c('cerrar'), bien: L.every(d => d.pasos.length && d.instr.length && d.para && d.min > 0 && d.f.every(k => window.E.FUENTES_DIN[k])) }; });
ok('nuevos tipos: activadores, repaso, retos y cierres (con pasos, instrucciones y fuentes válidas)', cat.act >= 10 && cat.rep >= 8 && cat.reto >= 9 && cat.cer >= 8 && cat.bien, JSON.stringify(cat));
// la clase de hoy trae el botón
const f = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(); let f = '2026-11-17'; for (let i = 0; i < 10 && !(E.clases.dia(g, f) || { bloques: [] }).bloques.length; i++) f = E.u.addDays(f, 1); return f; });
await p.evaluate(f => { location.hash = '#/clase/' + f; }, f); await p.waitForTimeout(800);
ok('la clase trae el botón «🎲 Dinámica rápida» arriba', await p.evaluate(() => !!document.querySelector('.dnr-top [data-act=dn-rapida]')), f);
await p.click('.dnr-top [data-act=dn-rapida]'); await p.waitForTimeout(400);
const r1 = await p.evaluate(() => Array.from(document.querySelectorAll('.dnr-list .dn-it b')).map(x => x.textContent));
ok('dispersos, 5 min: 3 opciones que caben en 5 minutos', r1.length === 3, r1.join(' | '));
const mins = await p.evaluate(() => Array.from(document.querySelectorAll('.dnr-list .chip')).filter(c => /⏱/.test(c.textContent)).map(c => parseInt(c.textContent.replace(/\D/g, ''), 10)));
ok('ninguna pasa del tiempo elegido', mins.every(x => x <= 5), mins.join(','));
await p.screenshot({ path: OUT + '/rapida.png' });
await p.click('[data-act=dnr-otra]'); await p.waitForTimeout(300);
const r2 = await p.evaluate(() => Array.from(document.querySelectorAll('.dnr-list .dn-it b')).map(x => x.textContent));
ok('«Otras opciones» da otras', r2.join() !== r1.join(), r2.join(' | '));
for (const [sit, obj] of [['cerrar', 'cerrar'], ['reto', 'reto'], ['tenso', 'calma']]) {
  await p.click('[data-act=dnr-o][data-k=sit][data-v=' + sit + ']'); await p.waitForTimeout(200); await p.click('[data-act=dnr-o][data-k=min][data-v="30"]'); await p.waitForTimeout(200);
  const ids = await p.evaluate(() => Array.from(document.querySelectorAll('.dnr-list [data-act=dn-proy]')).map(b => b.dataset.id));
  const okk = await p.evaluate(([ids, obj, sit]) => ids.length > 0 && ids.every(id => { const d = window.E.DINAMICAS.find(x => x.id === id); return d.obj.some(o => window.E.dinamicas.SIT.find(s => s[0] === sit)[2].indexOf(o) >= 0); }), [ids, obj, sit]);
  ok('situación «' + sit + '»: sugiere de ese tipo', okk, ids.join(','));
}
// repasar: trivia con preguntas del banco del tema de hoy (si hay)
await p.click('[data-act=dnr-o][data-k=sit][data-v=repasar]'); await p.waitForTimeout(300);
const hayTrivia = await p.evaluate(() => !!document.querySelector('.modal [data-act=dn-trivia]'));
const temas = await p.evaluate(f => { const E = window.E, g = E.data.grupoActual(); return { t: E.dinamicas.temasDia(g, f), q: E.dinamicas.preguntas(E.dinamicas.temasDia(g, f), 8).length }; }, f);
ok('repasar: ofrece la trivia del tema si el banco tiene preguntas', hayTrivia === (temas.q > 0), JSON.stringify(temas));
if (hayTrivia) {
  await p.click('.modal [data-act=dn-trivia]'); await p.waitForTimeout(500);
  const pj = await p.evaluate(() => ({ n: window.E.proj.s.length, q: window.E.proj.s.filter(s => s.k === 'q').every(s => s.opts && s.opts.length >= 2 && s.ok >= 0 && s.ok < s.opts.length) }));
  ok('la trivia proyecta las preguntas con su respuesta marcada', pj.n >= 3 && pj.q, JSON.stringify(pj));
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(200); await p.screenshot({ path: OUT + '/trivia.png' });
  await p.evaluate(() => { const el = document.getElementById('proj'); if (el) el.hidden = true; if (document.fullscreenElement) document.exitFullscreen().catch(() => { }); });
} else { const qx = await p.evaluate(() => { const E = window.E; return E.dinamicas.preguntas(['sm1-planos'], 8).length; }); ok('la trivia toma preguntas del banco (tema de prueba)', qx > 0, qx); }
// impresos
const imp = async (ruta, sel, nombre) => { await p.evaluate(r => { if (window.E.modal) window.E.modal.close(); location.hash = '#/' + r; }, ruta); await p.waitForTimeout(600); await p.click(sel); await p.waitForTimeout(800);
  await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT + '/' + nombre + '.pdf', preferCSSPageSize: true, printBackground: true }); await p.emulateMedia({ media: 'screen' });
  return [Number((execFileSync('pdfinfo', [OUT + '/' + nombre + '.pdf']).toString().match(/Pages:\s+(\d+)/) || [])[1]), execFileSync('pdftotext', [OUT + '/' + nombre + '.pdf', '-']).toString().replace(/\s+/g, ' ')]; };
let [n, t] = await imp('dinamica/catapulta', '[data-act=dn-ficha]', 'ficha-catapulta');
ok('cualquier dinámica imprime su ficha en 1 hoja', n === 1 && /Catapulta de abatelenguas/.test(t) && /Paso a paso/.test(t) && /abatelenguas/.test(t), n);
[n, t] = await imp('dinamica/quiensoy', '[data-act=dn-imp]', 'quiensoy');
ok('«¿Qué componente soy?» imprime sus tarjetas', n >= 2 && /Relevador/.test(t) && /Cilindro de doble efecto/.test(t), n);
[n, t] = await imp('dinamica/boleto', '[data-act=dn-imp]', 'boletos');
ok('boletos de salida: 6 por hoja', n === 1 && (t.match(/Boleto de salida/g) || []).length === 6, n);
[n, t] = await imp('dinamica/engranes', '[data-act=dn-imp]', 'engranes');
ok('plantilla de engranes de 12, 24 y 36 dientes', /12 dientes/.test(t) && /36 dientes/.test(t), n);
[n, t] = await imp('dinamica/semcomp', '[data-act=dn-imp]', 'semaforo');
ok('tarjetas del semáforo de comprensión', /Lo entendí/.test(t) && /No lo entendí/.test(t), n);
execFileSync('pdftoppm', ['-r', '40', '-png', '-f', '1', '-l', '1', OUT + '/engranes.pdf', OUT + '/engranes']);
execFileSync('pdftoppm', ['-r', '40', '-png', '-f', '1', '-l', '1', OUT + '/ficha-catapulta.pdf', OUT + '/ficha']);
// la vista de Dinámicas muestra los nuevos objetivos
await p.evaluate(() => { location.hash = '#/dinamicas'; }); await p.waitForTimeout(600);
ok('Dinámicas: los nuevos objetivos están en «¿Qué quieres lograr hoy?»', await p.evaluate(() => ['activar', 'repasar', 'reto', 'cerrar'].every(v => !!document.querySelector('[data-act=dn-o][data-k=obj][data-v="' + v + '"]'))));
ok('sin errores de JavaScript', errs.length === 0, errs.join(' | '));
await b.close();

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t165';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-09T07:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));




await p.addInitScript(() => { window.__fraseTest = true; });
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
const f1 = await p.evaluate(() => { const el = document.getElementById('frase-dia'); return el ? { q: el.querySelector('.fd-q').textContent, a: el.querySelector('.fd-a').textContent, bar: !!el.querySelector('.fd-fill'), eng: !!el.querySelector('.fd-eng'), logo: el.querySelector('.fd-logo img').getAttribute('src') } : null; });
ok('al abrir el día sale la frase con autor, barra, engrane y logo', f1 && f1.q.length > 10 && /— /.test(f1.a) && f1.bar && f1.eng && f1.logo === 'icon-512.png', JSON.stringify(f1));
await p.screenshot({ path: OUT + '/frase.png' });
await p.waitForTimeout(1200);
const w = await p.evaluate(() => parseFloat(document.querySelector('#frase-dia .fd-fill').style.width) || 0);
ok('la barra avanza', w > 20 && w < 100, w);
await p.click('#frase-dia'); await p.waitForTimeout(500);
ok('al tocarla se quita', await p.evaluate(() => !document.getElementById('frase-dia')));
await p.reload(); await p.waitForTimeout(1500);
ok('el mismo día ya no vuelve a salir', await p.evaluate(() => !document.getElementById('frase-dia')));
const L = await p.evaluate(() => { const F = window.E.frase, vistos = new Set(); for (let i = 0; i < F.LISTA.length; i++) { const d = new Date(Date.UTC(2026, 10, 9 + i)).toISOString().slice(0, 10); vistos.add(F.deHoy(d)[0]); } return [vistos.size, F.LISTA.length]; });
ok('una frase distinta cada día, sin repetir hasta terminar la lista', L[0] === L[1] && L[1] >= 30, JSON.stringify(L));
await p.evaluate(() => { location.hash = '#/ajustes'; }); await p.waitForTimeout(700);
ok('en Ajustes se puede apagar y verla otra vez', await p.evaluate(() => !!document.querySelector('[data-ch=frase-on]') && !!document.querySelector('[data-act=frase-ver]')));
await p.evaluate(() => { const s = document.querySelector('[data-ch=frase-on]'); s.checked = false; s.dispatchEvent(new Event('change', { bubbles: true })); try { localStorage.setItem('escuadra.frase', '2026-11-01'); } catch (e) { } });
await p.reload(); await p.waitForTimeout(1500);
ok('apagada, ya no sale', await p.evaluate(() => !document.getElementById('frase-dia')));
// logo nuevo
const lg = await p.evaluate(async () => { const im = new Image(); im.src = 'icon-192.png'; await im.decode(); const mk = new Image(); mk.src = 'logo-marca.png'; await mk.decode(); const man = await (await fetch('manifest.json')).json(); return { w: im.naturalWidth, mk: mk.naturalWidth, head: (document.querySelector('.brand-m image') || {}).getAttribute ? document.querySelector('.brand-m image').getAttribute('href') : '', bg: man.background_color }; });
ok('logo nuevo: ícono 192, versión sin texto en el encabezado y fondo azul de arranque', lg.w === 192 && lg.mk === 256 && lg.head === 'logo-marca.png' && lg.bg === '#060c18', JSON.stringify(lg));
// firmas con espacio
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(500);
await p.evaluate(() => { document.getElementById('imp-paste').value = 'Ana Pérez Lara\nBeto Soto Mena'; document.querySelector('[data-act=import-paste]').click(); }); await p.waitForTimeout(300);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); window.print = () => { }; window.E.store.update('config', c => { c.vistaImpresion = false; }, {}); }); await p.waitForTimeout(400);
await p.evaluate(() => { location.hash = '#/imprimir'; }); await p.waitForTimeout(600);
await p.evaluate(() => document.querySelector('[data-act=pr-acta]').click()); await p.waitForTimeout(800);
await p.emulateMedia({ media: 'print' });
const sg = await p.evaluate(() => { const s = document.querySelector('#print-root .sig'); return s ? Math.round(parseFloat(getComputedStyle(s).marginTop) / (96 / 25.4)) : null; });
ok('las firmas de los formatos dejan 2 cm para firmar', sg >= 19, sg + ' mm');
await p.emulateMedia({ media: 'screen' });
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

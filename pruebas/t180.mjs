// v1.40.0: suspensión de un alumno (faltas solas en el pase de lista) y cuadritos del estatus legibles en modo oscuro
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t180';
mkdirSync(OUT, { recursive: true });
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City', colorScheme: 'dark' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-18T21:40:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(500);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, ['Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera']); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const info = await p.evaluate(() => { const E = window.E, C = E.calc, g = E.data.grupoActual(), al = E.data.alumnos(g), u = E.u; const dias = []; let f = '2026-11-01'; while (dias.length < 8 && f < '2026-12-20') { if (C.esClase(g, f)) dias.push(f); f = u.addDays(f, 1); } return { gid: g.id, beto: al[1].id, ana: al[0].id, dias }; });
ok('hay días de clase para probar', info.dias.length >= 6, info.dias.join(','));
const [d0, d1, d2, d3, d4] = info.dias;
// lista ya pasada ANTES de anotar la suspensión (d1): Beto con asistencia
await p.evaluate(([gid, d1]) => { const E = window.E, g = E.data.grupoActual(), d = {}; E.data.alumnos(g).forEach(a => { d[a.id] = 'A'; }); E.store.put('asis:' + gid + ':' + d1, d); }, [info.gid, d1]);
// ficha de Beto → anotar suspensión del d1 al d3 (regresa d4)
await p.evaluate(id => { location.hash = '#/alumno/' + id; }, info.beto); await p.waitForTimeout(700);
ok('la ficha del alumno trae el apartado de suspensión', await p.evaluate(() => !!document.querySelector('[data-act=su-guarda]')));
await p.evaluate(([a, r]) => { document.getElementById('su-desde').value = a; document.getElementById('su-reg').value = r; document.getElementById('su-mot').value = 'Acuerdo de dirección'; document.querySelector('[data-act=su-guarda]').click(); }, [d1, d4]); await p.waitForTimeout(600);
let v = await p.evaluate(() => document.getElementById('view').innerText);
ok('queda anotada con sus días de clase', /regresa el/.test(v) && /3 días de clase/.test(v) && /Acuerdo de dirección/.test(v), (v.match(/Del [^\n]*/) || [])[0]);
ok('la lista que ya estaba pasada se corrige a falta', await p.evaluate(([gid, d1, beto, ana]) => { const d = window.E.store.get('asis:' + gid + ':' + d1); return d[beto] === 'F' && d[ana] === 'A'; }, [info.gid, d1, info.beto, info.ana]));
// d2: lista nueva con «todos presentes»
await p.evaluate(d => { location.hash = '#/lista/' + d; }, d2); await p.waitForTimeout(700);
v = await p.evaluate(() => document.getElementById('view').innerText);
ok('en el pase de lista avisa quién está suspendido', /Suspendido:.*Beto/.test(v.replace(/\n/g, ' ')) && /regresa el/.test(v));
await p.evaluate(d => { const b = document.querySelector('[data-act=asis-todos]'); if (b) b.click(); else window.E.calc.setMarca(window.E.data.grupoActual(), d, window.E.data.alumnos(window.E.data.grupoActual())[0].id, 'A'); }, d2); await p.waitForTimeout(500);
ok('al pasar lista, el suspendido queda con falta solo', await p.evaluate(([gid, d2, beto, ana]) => { const d = window.E.store.get('asis:' + gid + ':' + d2); return d && d[beto] === 'F' && d[ana] === 'A'; }, [info.gid, d2, info.beto, info.ana]));
// tocar a Beto para ponerle asistencia ese día no se puede; justificante sí
const r = await p.evaluate(([gid, d2, d3, beto]) => { const E = window.E, g = E.data.grupoActual(); E.calc.setMarca(g, d2, beto, 'A'); const a = E.store.get('asis:' + gid + ':' + d2)[beto]; E.calc.setMarca(g, d3, beto, 'J'); const j = E.store.get('asis:' + gid + ':' + d3)[beto]; return [a, j]; }, [info.gid, d2, d3, info.beto]);
ok('ese día no se le puede poner asistencia, pero sí justificante', r[0] === 'F' && r[1] === 'J', r.join(','));
// d4 regresa: normal
const r4 = await p.evaluate(([gid, d4, beto]) => { const E = window.E, g = E.data.grupoActual(); E.calc.setMarca(g, d4, beto, 'A'); return E.store.get('asis:' + gid + ':' + d4)[beto]; }, [info.gid, d4, info.beto]);
ok('el día que regresa ya cuenta normal', r4 === 'A');
// faltas en el conteo del parcial
const fs = await p.evaluate(([beto, d1]) => { const E = window.E, g = E.data.grupoActual(), p = E.data.parciales().find(x => d1 >= x.inicio && d1 <= x.fin); const r = E.calc.asis(g, p, beto); return r.f + ' · ' + p.id + ' ' + r.fechasF.join(','); }, [info.beto, d1]);
ok('las faltas cuentan en su asistencia del parcial', parseInt(fs) >= 2, fs);
// Inicio muestra suspendidos hoy (si hoy cae dentro)
// quitar suspensión
await p.evaluate(id => { location.hash = '#/alumno/' + id; }, info.beto); await p.waitForTimeout(600);
await p.evaluate(() => document.querySelector('[data-act=su-quita]').click()); await p.waitForTimeout(500);
ok('al quitarla, las faltas automáticas vuelven a asistencia (el justificante se queda)', await p.evaluate(([gid, d1, d2, d3, beto]) => { const S = window.E.store; return S.get('asis:' + gid + ':' + d1)[beto] === 'A' && S.get('asis:' + gid + ':' + d2)[beto] === 'A' && S.get('asis:' + gid + ':' + d3)[beto] === 'J'; }, [info.gid, d1, d2, d3, info.beto]));
// cuadritos del estatus en modo oscuro
await p.evaluate(() => { location.hash = '#/entregacal'; }); await p.waitForTimeout(800);
const cs = await p.evaluate(() => { const d = document.querySelector('.jp-kpi div'), b = d.querySelector('b'), s = d.querySelector('span'); const lum = c => { const m = c.match(/\d+(\.\d+)?/g).map(Number); const f = x => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }; return .2126 * f(m[0]) + .7152 * f(m[1]) + .0722 * f(m[2]); }; const cr = (a, c) => { const x = lum(a), y = lum(c); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }; const bg = getComputedStyle(d).backgroundColor; return [cr(getComputedStyle(b).color, bg), cr(getComputedStyle(s).color, bg), bg]; });
ok('cuadritos del estatus legibles en modo oscuro (contraste ≥ 4.5)', cs[0] >= 4.5 && cs[1] >= 4.5, cs.map(x => typeof x === 'number' ? x.toFixed(1) : x).join(' · '));
await p.locator('.jp-kpi').screenshot({ path: OUT + '/kpi-oscuro.png' });
ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

import { chromium } from 'playwright';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const PORT = process.env.PORT || 8765;
const OUT = (process.env.OUT_DIR || '/tmp/escuadra-pruebas') + '/t157'; 
mkdirSync(OUT, { recursive: true });
const SRC = (process.env.SRC || process.cwd());
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));

// 0) estático: sin sinLogo ni BANDA; el logo va fijo; cada impresión pasa por P.run
const pj = readFileSync(SRC + '/print.js', 'utf8');
const todos = readdirSync(SRC).filter(f => f.endsWith('.js') && f !== 'escuadra.min.js').map(f => [f, readFileSync(SRC + '/' + f, 'utf8')]);
const conSin = todos.filter(([, s]) => /sinLogo/.test(s)).map(([f]) => f);



const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => { if (!/prueba-error-escuadra/.test(e.message)) errs.push(e.message); }); let rechaza = false; p.on('dialog', d => rechaza ? d.dismiss() : d.accept());
await p.clock.install({ time: new Date('2026-10-30T11:10:00-06:00') });
await p.addInitScript(() => { window.__clip = []; Object.defineProperty(navigator, 'clipboard', { value: { writeText: t => { window.__clip.push(t); return Promise.resolve(); } }, configurable: true }); });

await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);

// grupo de prueba con 40 alumnos (la lista ocupa varias hojas)
const nom = ['Karla', 'Ana', 'Beto', 'Carla', 'Dani', 'Eli', 'Fer', 'Gabo', 'Hugo', 'Ivan'];
const ape = ['Cruz Ruiz', 'Pérez Lara', 'Soto Mena', 'Díaz Ortiz', 'Luna Vera', 'Rojas Paz'];
const nombres = []; for (let i = 0; i < 40; i++) nombres.push(nom[i % nom.length] + ' ' + ape[(i * 7) % ape.length] + ' ' + (i + 1));
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, nombres); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const gid = await p.evaluate(() => window.E.data.grupoActual().id);
ok('grupo de prueba con 40 alumnos', !!gid, gid);

// horario parecido al real del 3°A (varias clases por día, una con receso de por medio)
await p.evaluate(gid => {
  window.E.store.update('grupo:' + gid, g => {
    g.inicioDocente = '2026-10-01';
    g.horario = [
      { dia: 2, inicio: '07:30', fin: '10:00', horas: 3 }, { dia: 2, inicio: '12:10', fin: '13:00', horas: 1 },
      { dia: 3, inicio: '07:30', fin: '10:00', horas: 3 }, { dia: 3, inicio: '10:30', fin: '12:10', horas: 2 },
      { dia: 4, inicio: '09:10', fin: '10:00', horas: 1 }, { dia: 4, inicio: '10:30', fin: '12:10', horas: 2 },
      { dia: 5, inicio: '07:30', fin: '10:00', horas: 3 }
    ];
  });
}, gid);

// pases de lista con marcas y excepciones por clase (aid|clase), en las primeras 9 clases del parcial
await p.evaluate(gid => {
  const E = window.E, g = E.data.grupoActual(), pp = E.calc.parcialActual(), al = E.data.alumnos(g);
  let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  E.calc.clases(g, pp).slice(0, 9).forEach(c => {
    const cl = E.calc.clasesDia(g, c.fecha), doc = {};
    al.forEach(a => { doc[a.id] = rnd() < 0.08 ? 'F' : rnd() < 0.05 ? 'R' : 'A'; cl.forEach(k => { if (rnd() < 0.12) doc[a.id + '|' + k.k] = rnd() < 0.5 ? 'F' : 'J'; }); });
    E.store.put('asis:' + g.id + ':' + c.fecha, doc, { silent: true });
  });
}, gid);
const esp = ms => p.waitForTimeout(ms);
const ev = (fn, x) => p.evaluate(fn, x);
// 13 equipos de 3 (y uno de 4), al azar; el «Equipo 2» ya terminó dos etapas
await ev(() => { location.hash = '#/proyecto'; }); await esp(400);
await ev(() => { document.getElementById('pj-k').value = '10'; document.querySelector('[data-act=pj-armar][data-m=azar]').click(); }); await esp(300);
const r0 = await ev(() => {
  const E = window.E, S = E.store, g = E.data.grupoActual(), PJ = E.proyecto, pid = PJ.canon(g, E.calc.parcialActual().id);
  S.update('proy:' + g.id + ':' + pid, d => { const e = d.equipos[1], todos = e.al.slice(); e.al = todos.slice(0, 3); d.equipos[2].al = d.equipos[2].al.concat(todos.slice(3)); const ms = PJ.metas(g, pid); d.etapas[e.id] = { [ms[0].id]: { st: 'ok', f: '2026-10-10' }, [ms[1].id]: { st: 'ok', f: '2026-10-14' } }; }, {});
  const d = PJ.doc(g, pid); return { pid, eqs: d.equipos.map(e => ({ id: e.id, n: e.al.length, al: e.al.slice() })), e2: d.equipos[1].id, sale: d.equipos[1].al[2] };
});
const antes = r0.eqs.filter(e => e.id !== r0.e2);
// el que se peleó se va a un equipo nuevo (solo)
await ev(r0 => { const s = document.querySelector('[data-ch=pj-mover][data-aid="' + r0.sale + '"]'); s.value = 'nuevo'; s.dispatchEvent(new Event('change', { bubbles: true })); }, r0); await esp(400);
await p.screenshot({ path: OUT + '/editor.png', fullPage: true });
const r1 = await ev(r0 => {
  const E = window.E, g = E.data.grupoActual(), PJ = E.proyecto, d = PJ.doc(g, r0.pid), e2 = d.equipos.find(e => e.id === r0.e2), nq = d.equipos.find(e => e.al.indexOf(r0.sale) >= 0);
  return { n2: e2.al.length, sigue: e2.al.indexOf(r0.sale) < 0, nq: nq && { id: nq.id, nombre: nq.nombre, n: nq.al.length, nota: nq.nota }, prog: nq && JSON.stringify(Object.keys(d.etapas[nq.id] || {}).length) === JSON.stringify(Object.keys(d.etapas[r0.e2] || {}).length) && Object.keys(d.etapas[nq.id] || {}).length === 2, total: d.equipos.length, toast: document.getElementById('toasts').innerText, otros: d.equipos.filter(e => e.id !== r0.e2 && e.id !== (nq || {}).id).map(e => ({ id: e.id, n: e.al.length, al: e.al.slice() })) };
}, r0);
ok('se separa: el equipo queda de 2 y él en un equipo nuevo de 1', r1.n2 === 2 && r1.sigue && r1.nq && r1.nq.n === 1 && r1.total === r0.eqs.length + 1, r1.nq && r1.nq.nombre + ' · ' + r1.total + ' equipos');
ok('el equipo nuevo se lleva el avance que tenía (2 etapas) y una nota de cuándo se separó', r1.prog && /Se separó del Equipo 2 el/.test(r1.nq.nota), r1.nq.nota);
ok('los demás equipos no cambian', JSON.stringify(r1.otros) === JSON.stringify(antes), r1.otros.length + ' equipos iguales');
ok('aviso de lo que pasó', /Equipo \d+: .*con el avance que llevaba en el Equipo 2/.test(r1.toast), r1.toast.split('\n').pop());
// «Sin equipo» y volver a asignar; un equipo vacío se quita al tocar Listo
const otro = r1.otros[0].al[0], destino = r1.otros[1].id;
await ev(([a]) => { const s = document.querySelector('[data-ch=pj-mover][data-aid="' + a + '"]'); s.value = 'sin'; s.dispatchEvent(new Event('change', { bubbles: true })); }, [otro]); await esp(300);
const r2 = await ev(([a]) => ({ sin: /Sin equipo \(1\)/.test(document.getElementById('view').innerText), sel: !!document.querySelector('.pj-sin [data-ch=pj-mover][data-aid="' + a + '"]'), dbg: (document.getElementById('view').innerText.match(/Sin equipo[^\n]{0,40}/g) || []).filter(x => !/^Sin equipo$/.test(x)).join(' | ') }), [otro]);
ok('«— Sin equipo» lo deja aparte, con su propio «Elegir equipo…»', r2.sin && r2.sel);
await ev(([a, r0, dest]) => { const E = window.E, g = E.data.grupoActual(), i = E.proyecto.doc(g, r0.pid).equipos.findIndex(e => e.id === dest); const s = document.querySelector('.pj-sin [data-ch=pj-mover][data-aid="' + a + '"]'); s.value = String(i); s.dispatchEvent(new Event('change', { bubbles: true })); }, [otro, r0, destino]); await esp(300);
await ev(() => document.querySelector('[data-act=pj-eq-nuevo]').click()); await esp(300);
const nEq = await ev(r0 => window.E.proyecto.doc(window.E.data.grupoActual(), r0.pid).equipos.length, r0);
await ev(() => document.querySelector('[data-act=pj-edit-ok]').click()); await esp(400);
const r3 = await ev(([a, r0, dest]) => { const E = window.E, g = E.data.grupoActual(), d = E.proyecto.doc(g, r0.pid); return { enDest: d.equipos.find(e => e.id === dest).al.indexOf(a) >= 0, n: d.equipos.length, vacios: d.equipos.filter(e => !e.al.length).length, txt: document.getElementById('view').innerText }; }, [otro, r0, destino]);
ok('se asigna a otro equipo; el equipo vacío se quita al tocar «✓ Listo»', r3.enDest && nEq === r1.total + 1 && r3.n === r1.total && r3.vacios === 0, r3.n + ' equipos');
ok('la vista muestra al equipo nuevo con sus 2 etapas listas', new RegExp(r1.nq.nombre + '[\\s\\S]{0,200}2 de 12 etapas').test(r3.txt));
// ↶ Deshacer funciona en el editor
const r4 = await ev(async r0 => { const E = window.E, g = E.data.grupoActual(); E.actions['pj-edit']({ dataset: { pid: r0.pid } }); await new Promise(r => setTimeout(r, 200)); const s = document.querySelector('[data-ch=pj-mover][data-aid="' + r0.sale + '"]'); s.value = 'sin'; s.dispatchEvent(new Event('change', { bubbles: true })); await new Promise(r => setTimeout(r, 200)); const a1 = E.proyecto.doc(g, r0.pid).equipos.some(e => e.al.indexOf(r0.sale) >= 0); E.undo.undo(); await new Promise(r => setTimeout(r, 200)); return { a1, a2: E.proyecto.doc(g, r0.pid).equipos.some(e => e.al.indexOf(r0.sale) >= 0) }; }, r0);
ok('↶ Deshacer regresa un cambio de equipo', !r4.a1 && r4.a2);
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

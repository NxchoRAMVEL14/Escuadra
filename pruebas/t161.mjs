import { chromium } from 'playwright';
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-11-06T11:10:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));

await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
const nombres = ['Karla Cruz Ruiz', 'Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera', 'Eli Rojas Paz'];
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, nombres); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const gid = await p.evaluate(() => window.E.data.grupoActual().id);
const gen = async () => { await p.evaluate(() => { location.hash = '#/examen'; }); await p.waitForTimeout(700); await p.click('[data-act=ex-gen]'); await p.waitForTimeout(700); return p.evaluate(gid => { const ks = window.E.store.keys('exa:' + gid + ':'); return ks[ks.length - 1].split(':').pop(); }, gid); };
const cap = (exId, k) => p.evaluate(([gid, exId, k]) => { const E = window.E, g = E.data.grupoActual(), X = E.examen, S = E.store, al = E.data.alumnos(g), ex = X.get(g, exId);
  const aid = al[k].id; S.update('exa:' + gid + ':' + exId, d => { d.res = d.res || {}; const m = {}; d.items.forEach(it => { m[it.id] = 1; }); d.res[aid] = { v: 'A', m: m }; }, {}); X.sync(g, X.get(g, exId)); return [aid, X.puntaje(X.get(g, exId), aid)]; }, [gid, exId, k]);

// ---- 1) el examen nuevo se enlaza solo con Calificaciones
const e1 = await gen();
const r1 = await p.evaluate(([gid, e]) => { const S = window.E.store, ex = S.get('exa:' + gid + ':' + e), a = ex.actId && S.get('act:' + gid + ':' + ex.actId); return { act: !!a, cat: a && a.categoria, lig: a && a.examen === e, max: a && a.max, tot: ex.total }; }, [gid, e1]);
ok('al crear el examen se crea solo su actividad en Calificaciones', r1.act && r1.cat === 'examen' && r1.lig && r1.max === r1.tot, JSON.stringify(r1));
const [aid1, pts1] = await cap(e1, 0);
const n1 = await p.evaluate(([gid, e, aid]) => { const S = window.E.store, ex = S.get('exa:' + gid + ':' + e); return S.get('act:' + gid + ':' + ex.actId).notas[aid]; }, [gid, e1, aid1]);
ok('al capturar el resultado del alumno, su calificación cae sola en Calificaciones', n1 === Math.round(pts1 * 10) / 10 && n1 > 0, n1 + ' / ' + pts1);
await p.evaluate(id => { location.hash = '#/examen/' + id; }); await p.waitForTimeout(0);
await p.evaluate(id => { location.hash = '#/examen/' + id; }, e1); await p.waitForTimeout(700);
ok('la tarjeta del examen deja elegir a qué actividad van los resultados', await p.evaluate(() => !!document.querySelector('[data-ch=ex-dest]')));

// ---- 2) si ya tienes tu actividad de examen, se usa esa (y en su escala), sin duplicar
await p.evaluate(([gid, e]) => { const S = window.E.store, ex = S.get('exa:' + gid + ':' + e); S.del('act:' + gid + ':' + ex.actId); S.del('exa:' + gid + ':' + e); }, [gid, e1]);
const pid = await p.evaluate(gid => window.E.calc.parcialActual().id, gid);
const mia = await p.evaluate(([gid, pid]) => { const E = window.E, S = E.store, id = 'act_mia'; const g = E.data.grupoActual(); S.put('act:' + gid + ':' + id, { id, parcial: pid, categoria: 'examen', nombre: 'Examen de 2 pruebas', peso: 40, max: 20, fecha: E.calc.parcial(pid).fin, instrumento: 'Exa', cuenta: true, notas: {} }); return id; }, [gid, pid]);
const e2 = await gen();
const antes = await p.evaluate(([gid, pid]) => window.E.calc.acts(window.E.data.grupoActual(), pid).filter(a => a.categoria === 'examen').length, [gid, pid]);
ok('con tu actividad de examen ya creada, no se crea otra (sin duplicar el peso)', antes === 1, antes);
const [aid2, pts2] = await cap(e2, 1);
const r2 = await p.evaluate(([gid, e, aid]) => { const S = window.E.store, ex = S.get('exa:' + gid + ':' + e), a = S.get('act:' + gid + ':' + ex.actId); return { id: ex.actId, n: a.notas[aid], max: a.max, tot: ex.total }; }, [gid, e2, aid2]);
ok('se liga a la tuya y la calificación se guarda en su escala (20 puntos)', r2.id === mia && r2.max === 20 && Math.abs(r2.n - Math.round(pts2 / r2.tot * 20 * 10) / 10) < 0.05, JSON.stringify(r2) + ' pts ' + pts2);

// ---- 3) reglamento firmado = tarea del reglamento
const reg = await p.evaluate(([gid, pid]) => { const S = window.E.store, id = 'act_reg'; S.put('act:' + gid + ':' + id, { id, parcial: pid, categoria: 'trabajos', nombre: 'Reglamento del taller firmado', peso: 1, max: 10, fecha: '2026-11-04', instrumento: 'Otro', cuenta: true, notas: {} }); return id; }, [gid, pid]);
await p.evaluate(() => { location.hash = '#/seguridad'; }); await p.waitForTimeout(800);
const sel = await p.evaluate(() => { const s = document.querySelector('[data-ch=sg-act]'); return s ? s.value : null; });
ok('Seguridad detecta sola la tarea que dice «reglamento»', sel === reg, sel);
const al = await p.evaluate(gid => window.E.data.alumnos(window.E.data.grupoActual()).map(a => a.id), gid);
await p.click('[data-act=sg-firma][data-aid="' + al[0] + '"]'); await p.waitForTimeout(300);
const f1 = await p.evaluate(([gid, reg, a]) => window.E.store.get('act:' + gid + ':' + reg).notas[a], [gid, reg, al[0]]);
ok('marcar «Alumno» deja su calificación completa en la tarea del reglamento', f1 === 10, f1);
await p.evaluate(([gid, reg, a]) => { window.E.store.update('act:' + gid + ':' + reg, x => { x.notas[a] = 8; }); }, [gid, reg, al[2]]); await p.waitForTimeout(200);
const f2 = await p.evaluate(([gid, a]) => !!((window.E.store.get('seg:' + gid) || {}).firmas || {})[a], [gid, al[2]]);
ok('capturar la tarea en Calificaciones marca la firma en Seguridad', f2);
await p.evaluate(([gid, reg, a]) => { window.E.store.update('act:' + gid + ':' + reg, x => { x.notas[a] = 6; }); }, [gid, reg, al[0]]);
await p.evaluate(() => { location.hash = '#/seguridad'; }); await p.waitForTimeout(500);
await p.click('[data-act=sg-firma][data-aid="' + al[0] + '"]'); await p.waitForTimeout(300);
const f3 = await p.evaluate(([gid, reg, a]) => window.E.store.get('act:' + gid + ':' + reg).notas[a], [gid, reg, al[0]]);
ok('quitar la firma no borra una calificación que capturaste distinta (6)', f3 === 6, f3);
await p.click('[data-act=sg-todos]'); await p.waitForTimeout(400);
const f4 = await p.evaluate(([gid, reg]) => Object.values(window.E.store.get('act:' + gid + ':' + reg).notas).length, [gid, reg]);
ok('«marcar a todos» llena la tarea de todos', f4 === 6, f4);
await p.evaluate(() => { const s = document.querySelector('[data-ch=sg-act]'); s.value = 'none'; s.dispatchEvent(new Event('change', { bubbles: true })); }); await p.waitForTimeout(300);
await p.evaluate(([gid, reg, a]) => { window.E.store.update('act:' + gid + ':' + reg, x => { delete x.notas[a]; }); }, [gid, reg, al[3]]);
const f5 = await p.evaluate(([gid, a]) => !!((window.E.store.get('seg:' + gid) || {}).firmas || {})[a], [gid, al[3]]);
ok('con «Ninguna (no ligar)» las dos cosas vuelven a ser independientes', (await p.evaluate(gid => window.E.store.get('seg:' + gid).actId, gid)) === false);
ok('sin errores de página', errs.length === 0, errs.slice(0, 3).join(' | '));
await b.close();

import { chromium } from 'playwright';
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-10-23T17:12:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);

// grupo de prueba (igual que t147)
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
const nombres = ['Karla Cruz Ruiz', 'Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera', 'Eli Rojas Paz', 'Fer Ruiz Gil', 'Gabo Mora Sanz'];
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, nombres); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const info = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(); return { gid: g.id, al: E.data.alumnos(g).map(a => ({ id: a.id, n: a.nombre })), pid: E.data.parciales()[0].id }; });
const gid = info.gid, pid = info.pid;
const idDe = re => info.al.find(a => re.test(a.n)).id;
const karla = idDe(/Karla/), ana = idDe(/Ana/), beto = idDe(/Beto/);
{ const v = await p.evaluate(() => window.E.VERSION), n = v.split('.').map(Number); ok('versión 1.27.21 o posterior', n[0] > 1 || n[1] > 27 || (n[1] === 27 && n[2] >= 21), v); }
ok('grupo y 8 alumnos cargados', info.al.length === 8, gid);

// 0) caché de claves del store (idea 6)
const cache = await p.evaluate(() => {
  const S = window.E.store, naive = pre => Object.keys(S.docs).filter(k => k.indexOf(pre) === 0 && !S.docs[k].deleted);
  const igual = pre => JSON.stringify(S.keys(pre)) === JSON.stringify(naive(pre));
  const r = [S.keys('zz:').length === 0];
  S.put('zz:b', 1); S.put('zz:a', 2); r.push(igual('zz:'));
  S.put('zz:c', 3); S.del('zz:a'); r.push(igual('zz:'));
  S.put('zz:a', 4); r.push(igual('zz:'));
  S.seed('zz:d', 5); r.push(igual('zz:'));
  S.keys('zz:').push('zz:fantasma'); r.push(igual('zz:'));
  S.docs['zz:directo'] = { data: 6, ts: new Date().toISOString(), dirty: true, deleted: false }; S.invalidar(); r.push(igual('zz:'));
  ['zz:a', 'zz:b', 'zz:c', 'zz:d', 'zz:directo'].forEach(k => S.del(k)); r.push(S.keys('zz:').length === 0);
  return r;
});
ok('la caché de claves coincide con el cálculo directo tras cada cambio', cache.every(Boolean), JSON.stringify(cache));

// fechas de clase del parcial
const cls = await p.evaluate(() => { const E = window.E, G = E.data.grupoActual(), P = E.calc.parcialActual('2026-10-23'); return [...new Set(E.calc.clases(G, P).map(c => c.fecha))]; });
const [, d1, d2] = cls; const extras = cls.filter(x => x !== d1 && x !== d2);
ok('hay al menos 5 fechas de clase en el parcial', cls.length >= 5, cls.length);
const pidP = await p.evaluate(d2 => window.E.calc.parcialActual(d2).id, d2);
const prevOk = await p.evaluate(([d1, d2]) => window.E.calc.claseAnterior(window.E.data.grupoActual(), d2) === d1, [d1, d2]);
ok('la clase anterior de d2 es d1', prevOk, d1 + ' / ' + d2);

// 1) Igual que la clase anterior (idea 1)
await p.evaluate(([g, d1, d2, ana, karla, beto]) => {
  const E = window.E, G = E.data.grupoActual(), doc = {};
  E.data.alumnos(G).forEach(a => { doc[a.id] = 'A'; });
  doc[ana] = 'F'; doc[karla] = 'J'; doc[beto] = 'R';
  E.store.put('asis:' + g + ':' + d1, doc);
  E.store.del('asis:' + g + ':' + d2);
}, [gid, d1, d2, ana, karla, beto]);
await p.evaluate(d2 => { location.hash = '#/lista/' + d2; }, d2); await p.waitForTimeout(800);
const bc = await p.evaluate(() => { const x = document.querySelector('[data-act=lista-copiar]'); return x ? x.textContent.trim() : null; });
ok('aparece «Igual que la clase del …» con la fecha de origen', !!bc && /Igual que la clase del/.test(bc), bc);
await p.click('[data-act=lista-copiar]'); await p.waitForTimeout(400);
const cp = await p.evaluate(([g, d2, ana, karla, beto]) => { const d = window.E.store.get('asis:' + g + ':' + d2) || {}; return [d[ana], d[karla], d[beto]]; }, [gid, d2, ana, karla, beto]);
ok('copia A, F y J: Ana queda F', cp[0] === 'F', cp[0]);
ok('copia A, F y J: Karla queda J', cp[1] === 'J', cp[1]);
ok('el retardo no se copia: Beto queda A', cp[2] === 'A', cp[2]);
const txt1 = await p.evaluate(() => document.body.innerText);
ok('el aviso dice cuántas marcas se copiaron y que los retardos no', /Copiadas 7 marcas/.test(txt1) && /los retardos no se copian/.test(txt1));
await p.evaluate(() => window.E.undo.undo()); await p.waitForTimeout(300);
const tras = await p.evaluate(([g, d2, ana]) => ((window.E.store.get('asis:' + g + ':' + d2) || {})[ana]), [gid, d2, ana]);
ok('Deshacer revierte la copia', tras !== 'F', String(tras));

// 1b) con dos clases en un mismo día: copia de la clase previa del día (si el horario lo tiene)
const multi = await p.evaluate(([dates, d1, d2]) => {
  const E = window.E, G = E.data.grupoActual(), f = dates.find(d => d !== d1 && d !== d2 && E.calc.clasesDia(G, d).length >= 2);
  if (!f) return null; const cl = E.calc.clasesDia(G, f); return { f: f, k1: cl[0].k, k2: cl[1].k };
}, [cls, d1, d2]);
if (multi) {
  await p.evaluate(([m, ana, beto]) => {
    const E = window.E, G = E.data.grupoActual();
    E.calc.setMarca(G, m.f, ana, 'J', m.k1); E.calc.setMarca(G, m.f, beto, 'F', m.k1);
    E.ui.listaCls = {}; E.ui.listaCls[m.f] = m.k2;
  }, [multi, ana, beto]);
  await p.evaluate(f => { location.hash = '#/lista/' + f; }, multi.f); await p.waitForTimeout(800);
  const bm = await p.evaluate(() => { const x = document.querySelector('[data-act=lista-copiar]'); return x ? x.textContent.trim() : null; });
  ok('con clase elegida, la fuente es la clase anterior del mismo día', !!bm && /Igual que la clase anterior/.test(bm), bm);
  await p.click('[data-act=lista-copiar]'); await p.waitForTimeout(400);
  const cm = await p.evaluate(([g, m, ana, beto]) => { const d = window.E.store.get('asis:' + g + ':' + m.f) || {}; return [d[ana + '|' + m.k2], d[beto + '|' + m.k2], d[beto + '|' + m.k1]]; }, [gid, multi, ana, beto]);
  ok('la segunda clase recibe J (Ana) y F (Beto); la primera no cambia', cm[0] === 'J' && cm[1] === 'F' && cm[2] === 'F', JSON.stringify(cm));
  await p.evaluate(() => { window.E.ui.listaCls = {}; window.E.render(); });
} else console.log('OMITIDO copia por clase: ningún día con dos clases en este horario de prueba');

// 2) Avisar por retardos acumulados (idea 2)
await p.evaluate(() => { window.__wa = []; window.open = u => { window.__wa.push(String(u)); return null; }; });
await p.evaluate(([g]) => window.E.store.update('config', c => { c.avisoRetardos = 2; }, {}), [gid]);
await p.evaluate(([g, d2, beto]) => { const G = window.E.data.grupoActual(); window.E.calc.setMarca(G, d2, beto, 'R'); }, [gid, d2, beto]);
const nRet = await p.evaluate(([d2, beto]) => { const E = window.E; return E.calc.asis(E.data.grupoActual(), E.calc.parcialActual(d2), beto).ret; }, [d2, beto]);
await p.evaluate(d2 => { location.hash = '#/lista/' + d2; }, d2); await p.waitForTimeout(800);
const rb = await p.evaluate(() => { const x = document.querySelector('[data-act=lista-retardos]'); return x ? x.textContent.trim() : null; });
ok('aparece «Avisar por retardos (1)» al llegar a N = 2', rb === '⏰ Avisar por retardos (1)', rb);
ok('Beto tiene ' + nRet + ' retardos contando cada clase de 50 min', nRet >= 2, String(nRet));
await p.click('[data-act=lista-retardos]'); await p.waitForTimeout(300);
const mt = await p.evaluate(() => (document.querySelector('.modal') || {}).textContent || '');
ok('el modal muestra a Beto con sus ' + nRet + ' retardos', /Beto/i.test(mt) && mt.indexOf(nRet + ' retardos') >= 0, mt.replace(/\s+/g, ' ').slice(0, 220));
await p.click('[data-act=lista-retardos-wa]'); await p.waitForTimeout(300);
const w = await p.evaluate(() => window.__wa[0] || '');
ok('el WhatsApp lleva el texto con los retardos', w.indexOf('wa.me/') >= 0 && decodeURIComponent(w).indexOf('lleva ' + nRet + ' retardos') >= 0, decodeURIComponent(w).slice(0, 80));
const avs = await p.evaluate(([g, pid, beto]) => ((window.E.store.get('avisosR:' + g + ':' + pid) || {})[beto]), [gid, pidP, beto]);
ok('al abrir WhatsApp queda marcado el aviso con ' + nRet + ' retardos', avs === nRet, String(avs));
const pend0 = await p.evaluate(([g, d2]) => window.E.casa.retardosPend(window.E.data.grupoActual(), d2).length, [gid, d2]);
ok('ya no está pendiente con 2 retardos', pend0 === 0, String(pend0));
// suma retardos en otros días (cada día cuenta sus clases) hasta pasar el siguiente múltiplo de N
const fin = await p.evaluate(([dates, beto, meta]) => {
  const E = window.E, G = E.data.grupoActual(), P = E.calc.parcialActual(meta.d2); let r = E.calc.asis(G, P, beto).ret;
  for (const d of dates) { if (r >= meta.nRet + 2) break; E.calc.setMarca(G, d, beto, 'R'); r = E.calc.asis(G, P, beto).ret; }
  return r;
}, [extras, beto, { d2: d2, nRet: nRet }]);
const pend1 = await p.evaluate(([d2]) => window.E.casa.retardosPend(window.E.data.grupoActual(), d2).map(x => x.n), [d2]);
ok('vuelve a avisar al pasar el siguiente múltiplo de N (' + fin + ' ≥ ' + (nRet + 2) + ')', fin >= nRet + 2 && pend1.length === 1 && pend1[0] === fin, JSON.stringify(pend1));
await p.evaluate(([g]) => window.E.store.update('config', c => { c.avisoRetardos = 0; }, {}), [gid]);
const pend2 = await p.evaluate(([g, d2]) => window.E.casa.retardosPend(window.E.data.grupoActual(), d2).length, [gid, d2]);
ok('con N = 0 no se avisa', pend2 === 0, String(pend2));
await p.evaluate(() => { location.hash = '#/ajustes'; }); await p.waitForTimeout(700);
const campo = await p.evaluate(() => { const x = document.querySelector('[data-path=avisoRetardos]'); return x ? { v: x.value, t: (x.closest('label') || x.parentElement || {}).textContent || '' } : null; });
ok('Ajustes tiene el campo «Aviso a casa cada N retardos»', !!campo && /Aviso a casa cada N retardos/.test(campo.t), campo ? campo.v : 'no está');
ok('el valor por defecto es 3', await p.evaluate(() => window.E.DEFAULTS.config.avisoRetardos) === 3);

// 3) Basada en la última (idea 5)
await p.evaluate(() => window.E.modal.close());
await p.evaluate(([g, pid]) => { window.E.store.update('manual:' + g, d => { d[pid] = Object.assign({}, d[pid] || {}, { activo: false }); }, {}); window.E.store.put('act:' + g + ':ex148', { id: 'ex148', parcial: pid, categoria: 'examen', nombre: 'Examen del parcial 1', instrumento: 'Exa', max: 80, peso: 2, tema: 'tema-prueba', cuenta: true, fecha: '2026-10-10', notas: { x: 9 } }); }, [gid, pid]);
await p.evaluate(pid => { location.hash = '#/calificaciones/' + pid; }, pid); await p.waitForTimeout(800);
ok('aparece «Basada en la última» en Examen', await p.evaluate(() => !!document.querySelector('[data-act=act-basada][data-cat=examen]')));
ok('no aparece en Trabajos si no hay ninguno', await p.evaluate(() => !document.querySelector('[data-act=act-basada][data-cat=trabajos]')));
await p.click('[data-act=act-basada][data-cat=examen]'); await p.waitForTimeout(500);
const hNew = await p.evaluate(() => location.hash);
const nu = await p.evaluate(([g, h]) => { const id = h.split('/').pop(); const a = window.E.store.get('act:' + g + ':' + id) || {}; return { id: id, fecha: a.fecha, max: a.max, peso: a.peso, instr: a.instrumento, tema: a.tema, cuenta: a.cuenta, notas: a.notas, nombre: a.nombre, cat: a.categoria, parcial: a.parcial }; }, [gid, hNew]);
ok('la nueva copia puntos, peso, instrumento y tema', nu.max === 80 && nu.peso === 2 && nu.instr === 'Exa' && nu.tema === 'tema-prueba', JSON.stringify(nu));
ok('la fecha es 7 días después (2026-10-17)', nu.fecha === '2026-10-17', nu.fecha);
ok('es una actividad nueva, de Examen y sin notas copiadas', nu.id !== 'ex148' && nu.cat === 'examen' && Object.keys(nu.notas || {}).length === 0, JSON.stringify(nu.notas));

ok('sin errores de página', errs.length === 0, errs.join(' | '));
await b.close();

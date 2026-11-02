import { chromium } from 'playwright';
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-10-23T17:12:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
const nombres = ['Karla Cruz Ruiz', 'Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera', 'Eli Rojas Paz', 'Fer Ruiz Gil', 'Gabo Mora Sanz'];
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, nombres); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const info = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(); return { gid: g.id, al: E.data.alumnos(g).map(a => ({ id: a.id, n: a.nombre })) }; });
const HOY = '2026-10-23', gid = info.gid, karla = info.al.find(a => /Karla/.test(a.n)).id;
ok('grupo y 8 alumnos cargados', info.al.length === 8, gid);

// 1) Insignias de la barra de abajo
await p.evaluate(() => { location.hash = '#/inicio'; }); await p.waitForTimeout(500);
await p.evaluate(() => { window.E.store.update('config', c => { c.nav = ['lista', 'cierre', 'pendientes', 'inicio']; }, {}); });
await p.evaluate(() => { location.hash = '#/aula'; }); await p.waitForTimeout(300);
await p.evaluate(() => { location.hash = '#/inicio'; }); await p.waitForTimeout(700);
await p.evaluate(() => { window.E.pend.badge(); }); await p.waitForTimeout(500);
const bn = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(), L = E.pend.lista(g), porT = {}; L.forEach(x => { porT[x.tipo] = (porT[x.tipo] || 0) + 1; }); const out = {}; document.querySelectorAll('.bn-b').forEach(el => { out[el.dataset.k] = { hidden: el.hidden, t: el.textContent }; }); return { porT, total: L.length, out }; });
const esperado = k => k === 'pendientes' ? bn.total : (bn.porT[k] || 0);
const todosOk = ['lista', 'cierre', 'pendientes'].every(k => bn.out[k] && bn.out[k].t === String(esperado(k)) && bn.out[k].hidden === (esperado(k) === 0));
ok('la barra de abajo muestra Lista, Cierre y Pendientes con su conteo', todosOk, JSON.stringify(bn.out) + ' esperado ' + JSON.stringify({ lista: esperado('lista'), cierre: esperado('cierre'), pendientes: esperado('pendientes') }));
await p.evaluate(() => { window.E.store.update('config', c => { c.nav = ['inicio', 'clases', 'lista', 'calificaciones']; }, {}); });

// 2) Avisar a casa desde el pase de lista
await p.evaluate(([g, hoy, k]) => { window.E.store.put('asis:' + g + ':' + hoy, { [k]: 'F' }); }, [gid, HOY, karla]);
await p.evaluate(() => { location.hash = '#/lista/2026-10-23'; }); await p.waitForTimeout(800);
const bAv = await p.evaluate(() => { const x = document.querySelector('[data-act=lista-avisar]'); return x ? x.textContent.trim() : null; });
ok('Pase de lista ofrece «Avisar a casa» con la falta', !!bAv && /Avisar a casa/.test(bAv), bAv);
await p.evaluate(() => { window.__wa = []; window.open = u => { window.__wa.push(String(u)); return null; }; });
await p.click('[data-act=lista-avisar]'); await p.waitForTimeout(400);
const modTxt = await p.evaluate(() => document.querySelector('.modal') ? document.querySelector('.modal').textContent : '');
ok('el modal lista a quien faltó', /Karla/.test(modTxt));
await p.click('[data-act=lista-wa]'); await p.waitForTimeout(300);
const wa = await p.evaluate(() => window.__wa);
const txt = wa.length ? decodeURIComponent(String(wa[0]).split('?text=')[1] || '') : '';
ok('el WhatsApp abre con el texto de la falta', wa.length === 1 && /wa\.me/.test(wa[0]) && /no asistió a clase/.test(txt) && /Karla/.test(txt), wa.length ? txt.slice(0, 90) : 'sin enlace');
await p.evaluate(() => window.E.modal.close()); await p.waitForTimeout(200);

// 3) Imprimir el día en un paso
await p.evaluate(() => { location.hash = '#/imprimir'; }); await p.waitForTimeout(800);
const bDia = await p.evaluate(() => { const x = document.querySelector('[data-act=pr-dia]'); return x ? x.textContent.trim() : null; });
ok('Imprimir ofrece «El día en un paso»', !!bDia, bDia);
await p.click('[data-act=pr-dia]'); await p.waitForTimeout(1000);
const pr = await p.evaluate(() => ({ root: (document.getElementById('print-root') || {}).innerHTML || '', modal: document.querySelector('.modal') ? document.querySelector('.modal').textContent : '' }));
ok('un solo archivo con lista de asistencia y participación', pr.root.includes('LISTA DE ASISTENCIA') && pr.root.includes('REGISTRO DE PARTICIPACIÓN'), (pr.root.match(/LISTA DE ASISTENCIA|REGISTRO DE PARTICIPACIÓN/g) || []).join(' + '));
ok('la vista previa dice cuántas hojas salen', /hoja/.test(pr.modal), (pr.modal.match(/Saldrá en[^·]*/) || [''])[0]);
await p.evaluate(() => window.E.modal.close()); await p.waitForTimeout(200);

// 4) Copiar actividad al siguiente parcial
const parc = await p.evaluate(() => window.E.data.parciales().map(x => ({ id: x.id, n: x.nombre, inicio: x.inicio })));
ok('hay al menos dos parciales', parc.length >= 2, parc.map(x => x.n).join(', '));
await p.evaluate(([g, pid]) => { window.E.store.put('act:' + g + ':act_t146', { id: 'act_t146', parcial: pid, categoria: 'tarea', nombre: 'Maqueta de prueba 146', peso: 1, fecha: '2026-10-20', cuenta: true, notas: {}, puntos: 10 }); }, [gid, parc[0].id]);
await p.evaluate(() => { location.hash = '#/actividad/act_t146'; }); await p.waitForTimeout(800);
const bCop = await p.evaluate(() => { const x = document.querySelector('[data-act=act-parcial]'); return x ? x.textContent.trim() : null; });
ok('la actividad ofrece «Copiar al» el parcial siguiente', !!bCop && /Copiar al/.test(bCop), bCop);
await p.click('[data-act=act-parcial]'); await p.waitForTimeout(600);
const cp = await p.evaluate(([g]) => { const xs = window.E.store.list('act:' + g + ':'); return xs.map(a => ({ id: a.id, parcial: a.parcial, fecha: a.fecha, notas: Object.keys(a.notas || {}).length, n: a.nombre })); }, [gid]);
const nueva = cp.find(a => a.id !== 'act_t146' && /146/.test(a.n));
const dias = Math.round((Date.UTC(...parc[1].inicio.split('-').map((v, i) => i === 1 ? Number(v) - 1 : Number(v))) - Date.UTC(...parc[0].inicio.split('-').map((v, i) => i === 1 ? Number(v) - 1 : Number(v)))) / 86400000);
const fEsp = new Date(Date.UTC(2026, 9, 20) + dias * 86400000).toISOString().slice(0, 10);
ok('la copia está en el parcial siguiente, sin calificaciones', !!nueva && nueva.parcial === parc[1].id && nueva.notas === 0, JSON.stringify(nueva));
ok('la fecha se recorre lo que avanza el parcial', !!nueva && nueva.fecha === fEsp, (nueva && nueva.fecha) + ' esperado ' + fEsp);
ok('la original no cambia', cp.some(a => a.id === 'act_t146' && a.parcial === parc[0].id));

// 5) Frases rápidas en la nota de observación
await p.evaluate(([k, hoy]) => { window.E.actions['obs-open']({ dataset: { aid: k, fecha: hoy } }); }, [karla, HOY]); await p.waitForTimeout(500);
ok('la observación tiene nota y frases', await p.evaluate(() => !!document.getElementById('obs-txt') && document.querySelectorAll('[data-act=obs-frase]').length === 6));
await p.click('[data-act=obs-frase][data-f="Llegó tarde."]'); await p.waitForTimeout(250);
await p.click('[data-act=obs-frase][data-f="No trajo material."]'); await p.waitForTimeout(250);
const v = await p.evaluate(() => document.getElementById('obs-txt').value);
ok('las frases se agregan al texto', v === 'Llegó tarde. No trajo material.', v);
const st = await p.evaluate(([g, hoy, k]) => (window.E.store.get('obsnota:' + g + ':' + hoy) || {})[k], [gid, HOY, karla]);
ok('la nota se guarda', st === v, String(st));
await p.fill('#obs-txt', 'Prueba escrita a mano'); await p.locator('#obs-txt').press('Tab'); await p.waitForTimeout(300);
const st2 = await p.evaluate(([g, hoy, k]) => (window.E.store.get('obsnota:' + g + ':' + hoy) || {})[k], [gid, HOY, karla]);
ok('lo escrito a mano también se guarda al salir del campo', st2 === 'Prueba escrita a mano', String(st2));
const chips = await p.evaluate(([g, hoy]) => window.E.store.get('obs:' + g + ':' + hoy), [gid, HOY]);
ok('la nota no se mezcla con los chips de observación', !chips || !Object.keys(chips).some(x => /^txt/.test(x)));
await p.evaluate(() => window.E.modal.close());

ok('sin errores de página', errs.length === 0, errs.join(' | ') || 'ninguno');
await b.close();

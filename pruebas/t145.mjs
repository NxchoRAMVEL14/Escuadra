import { chromium } from 'playwright';
const PORT = process.env.PORT || 8765;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => { const u = r.request().url(); if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' }); if (u.includes('localhost:' + PORT) || u.startsWith('data:') || u.startsWith('blob:')) return r.continue(); return r.abort(); });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-10-23T17:12:00-06:00') });
const ok = (nombre, cond, extra) => console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : ''));
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);
// alumnos de prueba (Karla incluida)
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
const nombres = ['Karla Cruz Ruiz', 'Ana Pérez Lara', 'Beto Soto Mena', 'Carla Díaz Ortiz', 'Dani Luna Vera', 'Eli Rojas Paz', 'Fer Ruiz Gil', 'Gabo Mora Sanz'];
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, nombres); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const ids = await p.evaluate(() => { const E = window.E, g = E.data.grupoActual(); return { gid: g.id, al: E.data.alumnos(g).map(a => ({ id: a.id, n: a.nombre })) }; });
const HOY = '2026-10-23', gid = ids.gid, karla = ids.al.find(a => /Karla/.test(a.n)).id, ana = ids.al.find(a => /Ana/.test(a.n)).id;
ok('grupo y 8 alumnos cargados', ids.al.length === 8, gid + ' · ' + ids.al.length);

// ---------- 1) Inicio: a quien faltó hoy no se le «atiende» ----------
await p.evaluate(([karla, ana]) => {
  const E = window.E, orig = E.semaforo.datos;
  E.semaforo.datos = (g, pid) => { const r = orig(g, pid); r.filas.forEach(f => { if (f.a && (f.a.id === karla || f.a.id === ana)) { f.n = 'mal'; f.cambio = -1; } }); return r; };
}, [karla, ana]);
await p.evaluate(([g, hoy, karla]) => { const E = window.E; E.store.put('asis:' + g + ':' + hoy, { [karla]: 'F' }); }, [gid, HOY, karla]);
await p.evaluate(() => { location.hash = '#/inicio'; }); await p.waitForTimeout(700);
let hoyTxt = await p.evaluate(() => { const c = document.querySelector('.h3-card'); return c ? c.innerText : ''; });
ok('Karla (faltó) no sale como «atiende»', /Hoy atiende a Lara Ana/.test(hoyTxt) && !/Karla/.test(hoyTxt) && /faltó hoy/.test(hoyTxt), hoyTxt.replace(/\s+/g, ' ').slice(hoyTxt.indexOf('Hoy atiende') > 0 ? hoyTxt.indexOf('Hoy atiende') : 0, (hoyTxt.indexOf('Hoy atiende') > 0 ? hoyTxt.indexOf('Hoy atiende') : 0) + 170));
await p.evaluate(([g, hoy, ana, karla]) => { const E = window.E; E.store.put('asis:' + g + ':' + hoy, { [karla]: 'F', [ana]: 'J' }); }, [gid, HOY, ana, karla]);
await p.evaluate(() => { location.hash = '#/inicio'; location.hash = '#/inicio'; }); await p.waitForTimeout(700);
hoyTxt = await p.evaluate(() => { const c = document.querySelector('.h3-card'); return c ? c.innerText : ''; });
ok('si todos los que van mal faltaron, lo dice', /no hay a quién atender/i.test(hoyTxt), hoyTxt.replace(/\s+/g, ' ').slice(0, 160));
// limpiamos la asistencia de prueba
await p.evaluate(([g, hoy]) => { window.E.store.del('asis:' + g + ':' + hoy); }, [gid, HOY]);

// ---------- 2) Pase de lista: mantener el nombre → elegir a varios → faltaron estos ----------
await p.evaluate(() => { location.hash = '#/lista/2026-10-23'; }); await p.waitForTimeout(700);
const nm = i => p.evaluate(i => document.querySelectorAll('.slist .srow .sname')[i].getBoundingClientRect().toJSON(), i);
let bx = await nm(1);
await p.mouse.move(bx.x + 40, bx.y + bx.height / 2); await p.mouse.down(); await p.waitForTimeout(650); await p.mouse.up(); await p.waitForTimeout(300);
const menuTxt = await p.evaluate(() => { const m = document.getElementById('modal'); return m && !m.hidden ? m.innerText : ''; });
ok('mantener el nombre abre el menú (varios, foto, observación)', /Elegir a varios/.test(menuTxt) && /Foto de su trabajo/.test(menuTxt), menuTxt.split('\n').slice(0, 4).join(' | '));
await p.evaluate(() => document.querySelector('[data-act=lsel-start]').click()); await p.waitForTimeout(400);
ok('aparece la barra de elegidos', await p.evaluate(() => !!document.querySelector('.lsel-bar')));
await p.evaluate(() => document.querySelectorAll('.slist .srow .sname')[3].click()); await p.waitForTimeout(250);
await p.evaluate(() => document.querySelectorAll('.slist .srow .sname')[5].click()); await p.waitForTimeout(250);
const nElegidos = await p.evaluate(() => document.querySelector('.lsel-n').innerText);
ok('tocar a varios los elige', /3 elegidos/.test(nElegidos), nElegidos);
await p.evaluate(() => document.querySelector('[data-act=lsel-marca][data-st=F]').click()); await p.waitForTimeout(400);
const asisHoy = await p.evaluate(([g, hoy]) => window.E.store.get('asis:' + g + ':' + hoy) || {}, [gid, HOY]);
const faltas = Object.keys(asisHoy).filter(k => asisHoy[k] === 'F');
ok('«faltaron estos tres» queda en la lista', faltas.length === 3, faltas.length + ' faltas');
ok('al terminar sale del modo elegir', await p.evaluate(() => !document.querySelector('.lsel-bar')));

// ---------- 3) Deslizar para cambiar de clase ----------
await p.evaluate(() => { location.hash = '#/lista/2026-10-23'; }); await p.waitForTimeout(600);
const dataSw = await p.evaluate(() => { const d = document.querySelector('.datebar'); return d && d.dataset.next ? d.dataset.next : null; });
const leg = await p.evaluate(() => { const r = document.querySelector('.legend').getBoundingClientRect(); return { x: r.x + r.width * 0.8, y: r.y + r.height / 2 }; });
await p.mouse.move(leg.x, leg.y); await p.mouse.down();
for (let i = 1; i <= 8; i++) { await p.mouse.move(leg.x - i * 25, leg.y + 2); await p.waitForTimeout(16); }
await p.mouse.up(); await p.waitForTimeout(500);
const tras = await p.evaluate(() => location.hash);
ok('deslizar a la izquierda va a la clase siguiente', dataSw ? tras.indexOf(dataSw.replace('lista/', '')) >= 0 : /No hay/.test(''), tras + ' (siguiente: ' + dataSw + ')');

// ---------- 4) Más: cinco bloques, arrastrar y esconder ----------
await p.evaluate(() => { location.hash = '#/mas'; }); await p.waitForTimeout(600);
const bloques = await p.evaluate(() => [...document.querySelectorAll('.mn-h')].map(x => x.innerText));
ok('Más tiene los 5 bloques (opción A)', bloques.length >= 5 && /Para la clase/.test(bloques.join('|')) && /Sistema/.test(bloques.join('|')) && /padres y la cotutora/.test(bloques.join('|')) && /administración/.test(bloques.join('|')), bloques.join(' | '));
await p.evaluate(() => document.querySelector('[data-act=mn-edit]').click()); await p.waitForTimeout(400);
const tiles = await p.evaluate(() => document.querySelectorAll('.mn-t').length);
ok('modo acomodar muestra todas las secciones', tiles === 57, tiles + ' (52 + Historial de cambios + Cobros + Bitácora semanal + Expo + Muestra)');
const dragOk = await p.evaluate(() => {
  const g = document.querySelector('.mn-grid[data-grp=clase]'); return g ? [...g.querySelectorAll('.mn-t')].map(t => t.dataset.r).slice(0, 3) : [];
});
const h1 = await p.evaluate(() => document.querySelector('.mn-t[data-r="aula"] .mn-drag').getBoundingClientRect().toJSON());
const h2 = await p.evaluate(() => document.querySelector('.mn-t[data-r="cierre"]').getBoundingClientRect().toJSON());
await p.mouse.move(h1.x + h1.width / 2, h1.y + h1.height / 2); await p.mouse.down();
for (let i = 1; i <= 10; i++) { await p.mouse.move(h1.x + h1.width / 2 + 2, h1.y + h1.height / 2 + i * 22); await p.waitForTimeout(16); }
await p.mouse.up(); await p.waitForTimeout(500);
const orden = await p.evaluate(() => (window.E.store.get('config').menuOrden || {}).clase || []);
ok('arrastrar cambia el orden dentro del bloque', orden[0] === 'cierre' || orden.indexOf('cierre') < orden.indexOf('aula'), orden.slice(0, 3).join(','));
await p.evaluate(() => document.querySelector('.mn-t[data-r="ideas"] .mn-eye').click()); await p.waitForTimeout(400);
const oc = await p.evaluate(() => (window.E.store.get('config').menuOcultos || []));
ok('esconder una sección la guarda', oc.indexOf('ideas') >= 0, oc.join(','));
await p.evaluate(() => document.querySelector('.mn-t[data-r="ideas"] .mn-eye').click()); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('[data-act=mn-edit]').click()); await p.waitForTimeout(300);

// ---------- 5) Buscador que hace cosas ----------
await p.evaluate(() => { location.hash = '#/inicio'; }); await p.waitForTimeout(500);
await p.keyboard.press('/'); await p.waitForTimeout(300);
await p.keyboard.type('cierre'); await p.waitForTimeout(250);
const cmdTxt = await p.evaluate(() => (document.getElementById('bs-out') || {}).innerText || '');
ok('«cierre» ofrece el cierre del día', /Cierre del día/.test(cmdTxt), cmdTxt.split('\n').slice(0, 3).join(' | '));
await p.keyboard.press('Enter'); await p.waitForTimeout(400);
ok('Enter lo hace directo', (await p.evaluate(() => location.hash)).indexOf('cierre/') >= 0, await p.evaluate(() => location.hash));
await p.keyboard.press('/'); await p.waitForTimeout(250);
await p.keyboard.type('imprimir 3A lista'); await p.waitForTimeout(250);
const imprTxt = await p.evaluate(() => (document.getElementById('bs-out') || {}).innerText || '');
ok('«imprimir 3A lista» ofrece imprimir la lista', /Imprimir la lista de asistencia/.test(imprTxt), imprTxt.split('\n').slice(0, 2).join(' | '));
await p.keyboard.press('Enter'); await p.waitForTimeout(500);
const vista = await p.evaluate(() => { const m = document.getElementById('modal'); return m && !m.hidden ? m.innerText : ''; });
ok('imprimir abre la vista previa con las hojas', /Vista previa de impresión/.test(vista) && /Saldrá en/.test(vista), vista.split('\n').slice(0, 2).join(' | '));
await p.evaluate(() => document.querySelector('[data-act=pr-cancel]').click()); await p.waitForTimeout(200);

// ---------- 6) Vista previa: avisa si la firma se parte ----------
await p.evaluate(() => {
  const E = window.E, filas = Array.from({ length: 140 }, (_, i) => '<p>Renglón ' + (i + 1) + ' de prueba.</p>').join('');
  E.print.run('<div class="pr"><div class="p-title">PRUEBA FIRMA</div>' + filas + '<div class="sig"><div>Docente<br>Nombre y firma</div></div></div>', { title: 'prueba', margin: '9mm' });
});
await p.waitForTimeout(500);
const avTxt = await p.evaluate(() => { const m = document.getElementById('modal'); return m && !m.hidden ? m.innerText : ''; });
ok('vista previa avisa si la firma se parte', /firma/i.test(avTxt) && /hoja/i.test(avTxt), avTxt.split('\n').filter(x => /firma|Saldrá/.test(x)).slice(0, 2).join(' | '));
await p.evaluate(() => document.querySelector('[data-act=pr-cancel]').click()); await p.waitForTimeout(200);
await p.evaluate(() => {
  window.E.print.run('<div class="pr"><div class="p-title">CORTO</div><p>Un renglón.</p><div class="sig"><div>Docente</div></div></div>', { title: 'corto', margin: '9mm' });
});
await p.waitForTimeout(400);
const okTxt = await p.evaluate(() => { const m = document.getElementById('modal'); return m && !m.hidden ? m.innerText : ''; });
ok('formato corto dice que cabe bien', /Todo cabe bien en una hoja/.test(okTxt), okTxt.split('\n').slice(0, 3).join(' | '));
await p.evaluate(() => document.querySelector('[data-act=pr-cancel]').click()); await p.waitForTimeout(200);

// ---------- 7) El punto de sincronización dice qué falta subir ----------
await p.evaluate(() => { location.hash = '#/inicio'; }); await p.waitForTimeout(400);
await p.evaluate(() => document.getElementById('sync-top').click()); await p.waitForTimeout(400);
const syTxt = await p.evaluate(() => { const m = document.getElementById('modal'); return m && !m.hidden ? m.innerText : ''; });
ok('tocar el punto abre el estado de sincronización', /Sincronización/.test(syTxt) && /Solo en este aparato|Por subir|Sincronizado/.test(syTxt), syTxt.split('\n').slice(0, 4).join(' | '));
await p.evaluate(() => document.querySelector('[data-act=modal-close]').click()); await p.waitForTimeout(200);

// ---------- 8) Retomar donde quedaste ----------
await p.evaluate(() => { location.hash = '#/calificaciones'; }); await p.waitForTimeout(500);
await p.evaluate(() => { location.hash = '#/calificaciones'; }); await p.waitForTimeout(600); await p.goto('http://localhost:' + PORT + '/'); await p.waitForTimeout(1800);
const ret = await p.evaluate(() => location.hash);
ok('al abrir de nuevo vuelve a la última pantalla del día', ret.indexOf('calificaciones') >= 0, ret);

// ---------- 9) Copiar una actividad a otro grupo ----------
await p.evaluate(karla => {
  const E = window.E, g = E.data.grupoActual(), g2 = Object.assign({}, JSON.parse(JSON.stringify(g)), { id: 'grupo2test', grupo: '3B' });
  E.store.put('grupo:grupo2test', g2);
  E.store.put('act:' + g.id + ':actprueba', { id: 'actprueba', parcial: 'P1', categoria: 'trabajos', nombre: 'Maqueta de prueba', peso: 1, max: 100, fecha: '2026-10-20', instrumento: 'LC', cuenta: true, notas: { [karla]: 90 } });
}, karla);
await p.evaluate(() => { location.hash = '#/actividad/actprueba'; }); await p.waitForTimeout(600);
const tieneCopia = await p.evaluate(() => !!document.querySelector('[data-act=act-copiar]'));
ok('la actividad tiene «Copiar a otro grupo»', tieneCopia);
await p.evaluate(() => document.querySelector('[data-act=act-copiar]').click()); await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('[data-act=act-copiar-a][data-g=grupo2test]').click()); await p.waitForTimeout(400);
const copia = await p.evaluate(() => window.E.store.list('act:grupo2test:').map(a => ({ n: a.nombre, notas: Object.keys(a.notas || {}).length, p: a.parcial })));
ok('la copia llega al otro grupo sin calificaciones', copia.length === 1 && copia[0].n === 'Maqueta de prueba' && copia[0].notas === 0, JSON.stringify(copia));

console.log('errores de página:', errs.length ? errs : 'ninguno');
await b.close();

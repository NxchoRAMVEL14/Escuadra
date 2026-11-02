import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
const PORT = process.env.PORT || 8765;
const SRC = (process.env.SRC || process.cwd());
let fallas = 0;
const ok = (nombre, cond, extra) => { if (!cond) fallas++; console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' → ' + extra : '')); };

// 0) estático: sin cifras fijas de 5 en textos del grupo; el grupo usa N_GRUPO = 10
const src = readFileSync(SRC + '/casa.js', 'utf8');
ok('casa.js sin «contesta las 5 preguntas» ni «5 preguntas de tus temas» fijos', !/contesta las 5 preguntas|\b5 preguntas de tus temas/.test(src));
ok('el repaso del grupo está en 10 preguntas (N_GRUPO = 10)', /N_GRUPO = 10/.test(src));

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, locale: 'es-MX', timezoneId: 'America/Mexico_City' });
await ctx.route('**/*', r => {
  const u = r.request().url();
  if (u.includes('config.js')) return r.fulfill({ body: 'window.ESCUADRA_CONFIG={supabaseUrl:"",supabaseAnonKey:""};', contentType: 'application/javascript' });
  if (u.startsWith('http://localhost')) return r.continue();
  return r.abort();
});
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
await p.clock.install({ time: new Date('2026-10-30T11:10:00-06:00') });
await p.goto('http://localhost:' + PORT + '/#/inicio'); await p.waitForTimeout(1500);

// grupo de prueba: 28 alumnos
const nom = ['Karla', 'Ana', 'Beto', 'Carla', 'Dani', 'Eli', 'Fer', 'Gabo', 'Hugo', 'Ivan'];
const ape = ['Cruz Ruiz', 'Pérez Lara', 'Soto Mena', 'Díaz Ortiz', 'Luna Vera', 'Rojas Paz'];
const nombres = []; for (let i = 0; i < 28; i++) nombres.push(nom[i % nom.length] + ' ' + ape[(i * 7) % ape.length] + ' ' + (i + 1));
await p.evaluate(() => { location.hash = '#/alumnos'; }); await p.waitForTimeout(600);
await p.evaluate(n => { document.getElementById('imp-paste').value = n.join('\n'); document.querySelector('[data-act=import-paste]').click(); }, nombres); await p.waitForTimeout(400);
await p.evaluate(() => { const b = document.querySelector('[data-act=import-confirm]'); if (b) b.click(); }); await p.waitForTimeout(500);
const n28 = await p.evaluate(() => window.E.data.alumnos(window.E.data.grupoActual()).length);
ok('grupo de prueba con 28 alumnos', n28 === 28, n28);

// horario parecido al real del 3°A
await p.evaluate(() => {
  const E = window.E, g = E.data.grupoActual();
  E.store.update('grupo:' + g.id, x => {
    x.inicioDocente = '2026-10-01';
    x.horario = [
      { dia: 2, inicio: '07:30', fin: '10:00', horas: 3 }, { dia: 2, inicio: '12:10', fin: '13:00', horas: 1 },
      { dia: 3, inicio: '07:30', fin: '10:00', horas: 3 }, { dia: 3, inicio: '10:30', fin: '12:10', horas: 2 },
      { dia: 4, inicio: '09:10', fin: '10:00', horas: 1 }, { dia: 4, inicio: '10:30', fin: '12:10', horas: 2 },
      { dia: 5, inicio: '07:30', fin: '10:00', horas: 3 }
    ];
  });
});

// datos del escenario
const S0 = await p.evaluate(() => {
  const E = window.E, g = E.data.grupoActual(), pp = E.calc.parcialActual(), al = E.data.alumnos(g);
  const banco = (E.BANCO || []).filter(b => b.tipo !== 'ab');
  const conT = f => E.repaso.temasDia(g, E.clases.dia(g, f)).filter(t => banco.some(b => b.tema === t));
  const dias = E.calc.clases(g, pp).map(c => c.fecha).map(f => ({ f: f, ts: conT(f) })).filter(x => x.ts.length);
  if (dias.length < 3) return { error: 'pocas clases con temas: ' + dias.length };
  const dF = dias[1], dA = dias[2];
  const s0 = al[0], s1 = al[1], s2 = al[2];
  // 1) falta: s1 no vino el día dF (perdió los temas de ese día)
  const docF = {}; al.forEach(a => { docF[a.id] = a.id === s1.id ? 'F' : 'A'; });
  E.store.put('asis:' + g.id + ':' + dF.f, docF, { silent: true });
  // 2) mini-examen del parcial en curso: los alumnos de índice par fallan el primer tema; los demás lo aciertan todo
  const o = { pid: pp.id, fecha: pp.fin, n: 10, total: 100, dur: 50, mezcla: 'eq', abiertas: 0, repaso: false, seed: 'exa_t151' };
  const r = E.examen.generar(g, o), items = r.items, tema = it => ((E.BANCO || []).find(b => b.id === it.id) || {}).tema;
  const T1 = tema(items[0]), temasExamen = Array.from(new Set(items.map(tema)));
  const res = {};
  al.forEach((a, i) => { const mm = {}; items.forEach(it => { mm[it.id] = (i % 2 === 0 && tema(it) === T1) ? 0 : 1; }); res[a.id] = { m: mm }; });
  E.store.put('exa:' + g.id + ':exa_t151', { id: 'exa_t151', parcial: pp.id, titulo: 'Examen de prueba', fecha: pp.fin, dur: 50, total: 100, mezcla: 'eq', abiertas: 0, seed: 'exa_t151', items: items, horas: r.horas, rep: r.rep, creado: new Date().toISOString(), res: res }, { silent: true });
  // 3) actividad del día dA: s2 saca 20, los demás 90
  const notas = {}; al.forEach(a => { notas[a.id] = a.id === s2.id ? 20 : 90; });
  E.store.put('act:' + g.id + ':act_t151', { id: 'act_t151', parcial: pp.id, categoria: 'trabajos', nombre: 'Actividad de prueba', peso: 1, max: 100, fecha: dA.f, notas: notas, cuenta: true }, { silent: true });
  return { gid: g.id, s0: s0.id, s1: s1.id, s2: s2.id, T1: T1, tF: dF.ts, dF: dF.f, tA: dA.ts, dA: dA.f, temasExamen: temasExamen, n: al.length };
});
ok('escenario armado (clases con temas en el parcial)', !S0.error, S0.error || ('dF ' + S0.dF + ' · dA ' + S0.dA + ' · T1 ' + S0.T1));
if (S0.error) { console.log('abortando'); await b.close(); process.exit(1); }

// 4) resultados y comprobaciones
const R = await p.evaluate(async S0 => {
  const E = window.E, CA = E.casa, g = E.data.grupoActual(), al = E.data.alumnos(g);
  const byId = id => al.find(a => a.id === id);
  const tit = id => ((E.TEMAS || []).find(t => t.id === id) || {}).titulo || id;
  const s0 = byId(S0.s0), s1 = byId(S0.s1), s2 = byId(S0.s2);
  const td0 = CA.temasDebiles(g, s0), td1 = CA.temasDebiles(g, s1);
  const pt2 = CA.parcialTemas(g, s2);
  const tg = CA.temasGrupo(g);
  const dG = CA.repasoDatos(g, null), dA0 = CA.repasoDatos(g, s0), dA0b = CA.repasoDatos(g, s0);
  await E.cam.qrListo();
  const url = await CA.repasoURL(g, null);
  let svgOk = false, svgErr = ''; try { const s = E.cam.qrSVG(url, 'x', 'L'); svgOk = s.length > 100; } catch (e) { svgErr = e.message; }
  const esperaModal = () => new Promise(r => setTimeout(r, 300));
  E.modal.close();
  await E.actions['ca-repaso']({ dataset: {} }); await esperaModal();
  const txtG = document.body.innerText;
  E.modal.close(); await esperaModal();
  await E.actions['ca-repaso']({ dataset: { aid: s0.id } }); await esperaModal();
  const txtA = document.body.innerText;
  E.modal.close(); await esperaModal();
  let impH = ''; try { const o = E.views.imprimir(); impH = (o && o.h) || ''; } catch (e) { impH = 'ERR ' + e.message; }
  const difT = {}; S0.tA.forEach(t => { difT[t] = pt2.dif[t]; });
  return {
    td0: td0.ts, td0f: td0.fuente, td1: td1.ts, td1f: td1.fuente, td1p: td1.propio,
    difA: difT, tA: S0.tA, examen: S0.temasExamen,
    tg: tg.ts, tgf: tg.fuente, tgTit: tg.ts.map(tit),
    dG: dG ? dG.q.length : null, dA0: dA0 ? dA0.q.length : null, dA0igual: JSON.stringify(dA0) === JSON.stringify(dA0b),
    dGprimero: dG ? dG.q[0][4] : null, T1tit: tit(S0.T1), tF: S0.tF.map(tit),
    url: url, urlLen: url.length, svgOk: svgOk, svgErr: svgErr,
    txtG: txtG.includes('10 preguntas de'), txtGgrupo: txtG.includes('todo el grupo'),
    txtA: txtA.includes('5 preguntas de'), txtAtemaT1: txtA.includes(tit(S0.T1)),
    impGrupo: impH.includes('10 preguntas, un solo QR'), impAlumno: impH.includes('un repaso de 5 preguntas')
  };
}, S0);

// 5) el enlace del grupo se decodifica igual que repaso.html (deflate-raw + base64url con prefijo z)
const hash = R.url.split('#')[1] || '';
let dec = null, decErr = '';
try { const b64 = hash.slice(1).replace(/-/g, '+').replace(/_/g, '/'); dec = JSON.parse(inflateRawSync(Buffer.from(b64, 'base64')).toString('utf8')); } catch (e) { decErr = e.message; }

ok('el grupo recibe 10 preguntas', R.dG === 10, R.dG);
ok('cada alumno recibe 5 preguntas', R.dA0 === 5, R.dA0);
ok('el repaso de un alumno es el mismo si se arma dos veces el mismo día', R.dA0igual);
ok('el tema que el alumno no domina en el mini-examen sale primero', R.td0[0] === S0.T1, R.td0.map(t => t).join(' | ') + ' (esperado ' + S0.T1 + ')');
ok('fuente del alumno: sus datos de este parcial', R.td0f === 'sus exámenes, actividades, faltas y repasos de este parcial', R.td0f);
ok('el alumno que faltó: sus temas salen de los que se vieron ese día', R.td1.length >= 1 && R.td1.every(t => S0.tF.indexOf(t) >= 0), R.td1.length + ' temas · todos del día faltado: ' + R.td1.every(t => S0.tF.indexOf(t) >= 0));
ok('la falta cuenta como dificultad (fuente con datos del alumno)', R.td1f === 'sus exámenes, actividades, faltas y repasos de este parcial', R.td1f);
ok('actividad ligada a los temas del día: dif 0.2 si el tema sale en el examen (nota 20 en actividad, 100 en examen) y 0.8 si no', S0.tA.every(t => Math.abs(R.difA[t] - (S0.temasExamen.indexOf(t) >= 0 ? 0.2 : 0.8)) < 0.01), JSON.stringify(R.difA));
ok('el grupo: el tema que menos domina sale primero', R.tg[0] === S0.T1, R.tgTit.join(' | '));
ok('el grupo: hasta 5 temas', R.tg.length >= 1 && R.tg.length <= 5, R.tg.length);
ok('fuente del grupo describe el parcial en curso', /^cómo va el grupo en este parcial/.test(R.tgf), R.tgf);
ok('las preguntas del grupo empiezan con el tema más bajo', R.dGprimero === R.T1tit, R.dGprimero);
ok('el enlace del grupo se decodifica', !decErr && !!dec, decErr || 'ok');
ok('el enlace del grupo trae 10 preguntas', !!dec && dec.q.length === 10, dec ? dec.q.length : '');
ok('cada pregunta trae pregunta, 4 o más opciones, índice correcto, explicación y tema', !!dec && dec.q.every(q => q.length === 5 && q[1].length >= 2 && q[2] < q[1].length && typeof q[0] === 'string' && typeof q[4] === 'string'));
ok('el QR del grupo se genera (nivel L)', R.svgOk, R.svgErr || ('largo del enlace ' + R.urlLen + ' bytes'));
ok('el enlace del grupo cabe en un QR (≤ 2953 bytes, límite de versión 40 en nivel L)', R.urlLen <= 2953, R.urlLen + ' bytes');
ok('ventana del grupo dice 10 preguntas', R.txtG && R.txtGgrupo);
ok('ventana del alumno dice 5 preguntas y el tema que más le cuesta', R.txtA && R.txtAtemaT1);
ok('Imprimir: tarjeta con «Repaso del grupo (10 preguntas, un solo QR)»', R.impGrupo);
ok('Imprimir: tarjeta con «un repaso de 5 preguntas»', R.impAlumno);
ok('sin errores en la página', errs.length === 0, errs.join(' | ') || 'limpio');

console.log('--- detalle: temas alumno(0) ' + R.td0.map(t => t).join(', ') + ' · grupo ' + R.tgTit.join(', ') + ' · bytes del enlace del grupo ' + R.urlLen);
await b.close();
console.log(fallas ? 'FALLAS: ' + fallas : 'TODO OK');
process.exit(fallas ? 1 : 0);

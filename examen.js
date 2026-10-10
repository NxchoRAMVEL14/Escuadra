/* Escuadra · Examen recomendado: arma el examen del parcial con los temas que ya diste (más preguntas a lo que viste
   más horas y a lo que le costó al grupo), versiones A y B, clave, captura por alumno o rápida, análisis por pregunta,
   tema y alumno con recomendaciones, y el siguiente examen toma en cuenta los resultados. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const X = E.examen = {};
  const KX = (g, id) => 'exa:' + g.id + ':' + (id || '');
  const val = id => ((document.getElementById(id) || {}).value || '').trim();
  const LET = 'abcd';
  const UNID = { om: 1, vf: 1, calc: 2, ab: 2 };
  const SEC = [['vf', 'Verdadero o falso', 'Escribe V si es verdadero o F si es falso.'], ['om', 'Opción múltiple', 'Encierra la letra de la respuesta correcta.'], ['calc', 'Problemas', 'Resuelve, deja tu procedimiento y encierra la respuesta.'], ['ab', 'Preguntas abiertas', 'Contesta con tus palabras.']];
  const MEZ = { eq: ['Equilibrada', [0.3, 0.5, 0.2]], bas: ['Más básica', [0.45, 0.4, 0.15]], ret: ['Más retadora', [0.2, 0.45, 0.35]] };
  const item = id => (E.BANCO || []).find(b => b.id === id);
  const tema = id => E.TEMAS.find(t => t.id === id);
  const tTit = id => { const t = tema(id); return t ? t.titulo : id; };
  const nombreCorto = n => { const p = String(n).split(' '); return p.length >= 3 ? p[p.length - 2] + ' ' + p[0] : n; };

  /* ---------- azar con semilla (las versiones salen siempre iguales) ---------- */
  const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const shuffle = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  X.list = g => S.list(KX(g)).filter(x => x && x.id).sort((a, b) => String(b.creado || '').localeCompare(String(a.creado || '')));
  X.get = (g, id) => S.get(KX(g, id));

  /* ---------- qué se vio: horas por tema según Clases ---------- */
  X.fechaExamen = (g, pid) => {
    try { const pl = E.clases.plan(g, pid); for (const b of pl.bloques) { if (b.perdida) continue; const pt = b.parts.find(x => /^examen/.test(x.it.id)); if (pt) return { f: b.fecha, dur: pt.it.pasos ? (pt.it.pasos.find(s => /examen/i.test(s[1])) || [50])[0] : 50 }; } } catch (e) { }
    return { f: C.parcial(pid).fin, dur: 50 };
  };
  X.temasVistos = (g, pid, hasta) => {
    const h = {}; let pl = null; try { pl = E.clases.plan(g, pid); } catch (e) { }
    const conBanco = t => (E.BANCO || []).some(b => b.tema === t);
    if (pl) pl.bloques.forEach(b => { if (b.perdida || b.fecha >= hasta) return; b.parts.forEach(pt => { const t = pt.it.tema; if (t && conBanco(t)) h[t] = (h[t] || 0) + pt.h; }); });
    if (!Object.keys(h).length && pl) pl.seq.forEach(it => { if (it.tema && conBanco(it.tema)) h[it.tema] = (h[it.tema] || 0) + it.h; });
    return h;
  };
  // aciertos por tema de los exámenes anteriores del grupo (0 a 1)
  X.debilidad = (g, salvo) => {
    const agg = {}; X.list(g).forEach(ex => { if (ex.id === salvo) return; const r = X.analisis(g, ex); if (!r) return; Object.keys(r.temas).forEach(t => { const a = agg[t] = agg[t] || { s: 0, w: 0 }; a.s += r.temas[t].p * r.temas[t].w; a.w += r.temas[t].w; }); });
    // boletos de salida y calentamientos (mano alzada): cada pregunta pesa 2 puntos, menos que una de examen
    if (E.repaso) { const r = E.repaso.desempeno(g); Object.keys(r).forEach(t => { const a = agg[t] = agg[t] || { s: 0, w: 0 }; a.s += r[t].p * 2 * r[t].n; a.w += 2 * r[t].n; }); }
    const out = {}; Object.keys(agg).forEach(t => { if (agg[t].w) out[t] = agg[t].s / agg[t].w; }); return out;
  };

  /* ---------- puntos: preguntas y problemas valen distinto, y suman el total ---------- */
  X.puntos = (items, total) => {
    const un = items.map(it => UNID[(item(it.id) || {}).tipo] || 1), su = un.reduce((a, b) => a + b, 0) || 1;
    items.forEach((it, i) => { it.pts = Math.max(0.5, Math.round(un[i] / su * total * 2) / 2); });
    // lo que sobra o falta por redondeo se reparte de 0.5 en 0.5 (primero en abiertas y problemas), así ninguna pregunta se aleja más de medio punto
    let dif = Math.round((total - items.reduce((a, b) => a + b.pts, 0)) * 2) / 2;
    const ORD = { ab: 0, calc: 1, om: 2, vf: 3 }, ord = items.map((it, i) => i).sort((a, b) => (ORD[(item(items[a].id) || {}).tipo] || 0) - (ORD[(item(items[b].id) || {}).tipo] || 0));
    let k = 0, guard = 0; while (Math.abs(dif) >= 0.5 && guard++ < 400) { const it = items[ord[k % ord.length]], d = dif > 0 ? 0.5 : -0.5; if (it.pts + d >= 0.5) { it.pts += d; dif -= d; } k++; }
    return items;
  };

  /* ---------- generar ---------- */
  X.generar = (g, o) => {
    const rnd = rng(hash(o.seed)), horas = X.temasVistos(g, o.pid, o.fecha), deb = X.debilidad(g);
    let temas = Object.keys(horas);
    const peso = {}; temas.forEach(t => { peso[t] = horas[t] * (deb[t] != null && deb[t] < 0.6 ? 1.5 : 1); });
    const rep = o.repaso ? Object.keys(deb).filter(t => temas.indexOf(t) < 0 && deb[t] < 0.6 && (E.BANCO || []).some(b => b.tema === t)).sort((a, b) => deb[a] - deb[b]).slice(0, 2) : [];
    const nMain = Math.max(1, o.n - rep.length);
    // cupo por tema: proporcional al peso (resto mayor), al menos 1 si alcanza
    const tot = temas.reduce((s, t) => s + peso[t], 0) || 1, cupo = {};
    temas.sort((a, b) => peso[b] - peso[a]);
    if (nMain >= temas.length) temas.forEach(t => { cupo[t] = 1; }); else temas.slice(0, nMain).forEach(t => { cupo[t] = 1; });
    let resto = nMain - Object.keys(cupo).length;
    const ideal = {}; temas.forEach(t => { ideal[t] = peso[t] / tot * nMain; });
    while (resto > 0) { let best = null, bd = -1e9; temas.forEach(t => { const d = ideal[t] - (cupo[t] || 0); if (d > bd) { bd = d; best = t; } }); cupo[best] = (cupo[best] || 0) + 1; resto--; }
    // elegir preguntas por nivel (mezcla) sin repetir las de exámenes anteriores si se puede
    const usados = new Set(); X.list(g).forEach(ex => (ex.items || []).forEach(i => usados.add(i.id)));
    const mz = (MEZ[o.mezcla] || MEZ.eq)[1], meta = { 1: mz[0] * o.n, 2: mz[1] * o.n, 3: mz[2] * o.n }, cuenta = { 1: 0, 2: 0, 3: 0 };
    let abiertas = 0; const out = [], elegidos = new Set();
    const tomar = (t, esRep) => {
      let cands = (E.BANCO || []).filter(b => b.tema === t && !elegidos.has(b.id) && (b.tipo !== 'ab' || abiertas < o.abiertas));
      if (!cands.length) return false;
      cands = shuffle(cands, rnd).sort((a, b) => ((meta[b.niv] - cuenta[b.niv]) - (meta[a.niv] - cuenta[a.niv])) || ((usados.has(a.id) ? 1 : 0) - (usados.has(b.id) ? 1 : 0)));
      const b = cands[0]; elegidos.add(b.id); cuenta[b.niv]++; if (b.tipo === 'ab') abiertas++;
      out.push({ id: b.id, rep: !!esRep }); return true;
    };
    temas.forEach(t => { for (let k = 0; k < (cupo[t] || 0); k++) if (!tomar(t)) break; });
    // si un tema se quedó sin preguntas, completa con los demás por peso
    let guard = 0; while (out.length < nMain && guard++ < 200) { if (!temas.some(t => tomar(t))) break; }
    rep.forEach(t => tomar(t, true));
    return { items: X.puntos(out, o.total), horas: horas, deb: deb, rep: rep };
  };

  /* ---------- una versión (A o B) ---------- */
  X.version = (ex, v) => {
    const its = (ex.items || []).map(it => {
      const b = item(it.id); if (!b) return null; let q = b.q, op = b.op, r = b.r || b.exp || '';
      if (b.tipo === 'calc') { const gx = E.GEN[b.gen](rng(hash(ex.seed + '|' + v + '|' + it.id))); q = gx.q; op = gx.op; r = gx.r; }
      let opts = null, ok = null;
      if (op) { const ord = shuffle([0, 1, 2, 3], rng(hash(ex.seed + '|' + v + '|' + it.id + '|o'))); opts = ord.map(i => op[i]); ok = ord.indexOf(0); }
      return { id: it.id, b: b, pts: it.pts, rep: it.rep, q: q, opts: opts, ok: ok, vf: b.v, r: r };
    }).filter(Boolean);
    const rnd = rng(hash(ex.seed + '|' + v)), out = [];
    SEC.forEach(s => { shuffle(its.filter(x => x.b.tipo === s[0]), rnd).forEach(x => out.push(x)); });
    out.forEach((x, i) => { x.n = i + 1; });
    return out;
  };
  const resp = x => x.b.tipo === 'vf' ? (x.vf ? 'V' : 'F') : x.opts ? LET[x.ok] + ') ' + x.opts[x.ok] : 'Respuesta modelo: ' + x.r;

  /* ---------- resultados y análisis ---------- */
  X.puntaje = (ex, aid) => { const r = (ex.res || {})[aid]; if (!r || r.np || !r.m) return null; const ks = Object.keys(r.m); if (!ks.length) return null; return (ex.items || []).reduce((s, it) => s + (Number(r.m[it.id]) || 0) * it.pts, 0); };
  X.analisis = (g, ex) => {
    const res = ex.res || {}, al = Object.keys(res).filter(aid => res[aid] && !res[aid].np && res[aid].m && Object.keys(res[aid].m).length);
    const rap = ex.rapido && Number(ex.rapido.pres) > 0 ? ex.rapido : null; if (!al.length && !rap) return null;
    const items = {}, temas = {}, alumnos = {};
    (ex.items || []).forEach(it => {
      let p = null, n = 0;
      if (al.length) { let s = 0; al.forEach(aid => { const v = res[aid].m[it.id]; if (v != null) { s += Number(v); n++; } }); if (n) p = s / n; }
      else { n = Number(rap.pres); const mal = Math.min(n, Number((rap.mal || {})[it.id]) || 0); p = 1 - mal / n; }
      items[it.id] = { p: p, n: n };
      const b = item(it.id); if (!b || p == null) return; const t = temas[b.tema] = temas[b.tema] || { s: 0, w: 0, items: [] }; t.s += p * it.pts; t.w += it.pts; t.items.push(it.id);
    });
    Object.keys(temas).forEach(t => { temas[t].p = temas[t].w ? temas[t].s / temas[t].w : 0; });
    al.forEach(aid => {
      const m = res[aid].m, tt = {}; let pts = 0;
      (ex.items || []).forEach(it => { const b = item(it.id); const v = Number(m[it.id]) || 0; pts += v * it.pts; if (!b) return; const x = tt[b.tema] = tt[b.tema] || { s: 0, w: 0 }; x.s += v * it.pts; x.w += it.pts; });
      Object.keys(tt).forEach(t => { tt[t] = tt[t].w ? tt[t].s / tt[t].w : 0; }); alumnos[aid] = { pts: pts, temas: tt };
    });
    const prom = al.length ? al.reduce((s, aid) => s + alumnos[aid].pts, 0) / al.length : (ex.items || []).reduce((s, it) => s + (items[it.id].p || 0) * it.pts, 0);
    return { items: items, temas: temas, alumnos: alumnos, n: al.length || Number(rap.pres), modo: al.length ? 'alumno' : 'rapido', prom: prom };
  };
  // mantiene al día la actividad ligada en Calificaciones
  X.sync = (g, ex) => {
    if (!ex.actId) return; const k = 'act:' + g.id + ':' + ex.actId, a = S.get(k); if (!a) return; const notas = Object.assign({}, a.notas || {});
    D.alumnos(g).forEach(x => { const r = (ex.res || {})[x.id]; if (!r) return; const p = X.puntaje(ex, x.id); notas[x.id] = r.np ? '' : p == null ? notas[x.id] : Math.round(p * 10) / 10; });
    if (JSON.stringify(notas) !== JSON.stringify(a.notas || {}) || Number(a.max) !== Number(ex.total)) S.update(k, x => { x.notas = notas; x.max = ex.total; });
  };
  const nivel = p => p < 0.5 ? ['Reenseñar', 'bad'] : p < 0.7 ? ['Reforzar', 'warn'] : p < 0.85 ? ['Bien', 'info'] : ['Dominado', 'ok'];

  /* ---------- vistas ---------- */
  V.examen = (id, sub) => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    if (!id) return { t: 'Examen', h: listaV(g) };
    const ex = X.get(g, id); if (!ex) return { t: 'Examen', h: card('<p>No encontré ese examen.</p>' + link('Ver exámenes', 'examen', 'primary')) };
    const tabs = '<p><a href="#/examen">‹ Exámenes</a></p><div class="filters">' + [['', '📝 Examen'], ['captura', '✍️ Capturar resultados'], ['analisis', '📊 Análisis']].map(x => '<a class="tab ' + ((sub || '') === x[0] ? 'on' : '') + '" href="#/examen/' + id + (x[0] ? '/' + x[0] : '') + '">' + x[1] + '</a>').join('') + '</div>';
    if (sub === 'captura') return { t: 'Resultados', h: tabs + capturaV(g, ex) };
    if (sub === 'analisis') return { t: 'Análisis', h: tabs + analisisV(g, ex) };
    return { t: ex.titulo || 'Examen', h: tabs + detalleV(g, ex) };
  };

  function listaV(g) {
    const ps = D.parciales().filter(p => E.CLASES && E.clases && E.CLASES[E.clases.smKey(g, p.id)]), act = C.parcialActual();
    const pid = (E.ui.exPid && ps.some(p => p.id === E.ui.exPid)) ? E.ui.exPid : (ps.find(p => p.id === act.id) || ps[0] || act).id;
    const fx = X.fechaExamen(g, pid), fecha = E.ui.exFecha && E.ui.exPid === pid ? E.ui.exFecha : fx.f, horas = X.temasVistos(g, pid, fecha), deb = X.debilidad(g);
    const tot = Object.keys(horas).reduce((s, t) => s + horas[t], 0);
    let malPct = null; if (E.semaforo) { try { const per = E.semaforo.periodos(g).find(x => x.id === pid); if (per) { const d = E.semaforo.datos(g, pid), con = d.filas.filter(r => r.n); if (con.length) malPct = con.filter(r => r.n === 'mal').length / con.length; } } catch (e) { } }
    const dn = fx.dur >= 80 ? 20 : 15;
    let h = card('<h3>📝 Examen recomendado</h3><p class="muted small">Toma los temas que diste en Clases hasta la fecha del examen: más preguntas a lo que viste más horas y a lo que le costó al grupo en exámenes anteriores. Sale con versión A y B, clave de respuestas y tabla de especificaciones.</p>' +
      '<div class="fgrid"><label class="fld"><span>Parcial</span><select id="ex-pid" data-ch="ex-pid">' + ps.map(p => '<option value="' + p.id + '" ' + (p.id === pid ? 'selected' : '') + '>' + esc(p.nombre) + '</option>').join('') + '</select></label>' +
      '<label class="fld"><span>Fecha del examen</span><input id="ex-fecha" type="date" value="' + fecha + '" data-ch="ex-fecha"></label>' +
      '<label class="fld"><span>Preguntas</span><input id="ex-n" type="number" min="5" max="40" value="' + dn + '"></label>' +
      '<label class="fld"><span>Puntos totales</span><input id="ex-total" type="number" min="10" max="200" value="100"></label>' +
      '<label class="fld"><span>Duración (min)</span><input id="ex-dur" type="number" min="20" max="200" value="' + fx.dur + '"></label>' +
      '<label class="fld"><span>Dificultad</span><select id="ex-mez">' + Object.keys(MEZ).map(k => '<option value="' + k + '">' + MEZ[k][0] + ' (' + MEZ[k][1].map(x => Math.round(x * 100)).join('/') + ')</option>').join('') + '</select></label>' +
      '<label class="fld"><span>Preguntas abiertas (máximo)</span><input id="ex-ab" type="number" min="0" max="5" value="2"></label></div>' +
      '<label class="switch"><input type="checkbox" id="ex-rep" checked><span>Agregar repaso de temas que salieron bajos en exámenes anteriores</span></label>' +
      '<p class="muted small">Dificultad = % de preguntas de recordar / comprender / aplicar.' + (malPct != null && malPct >= 0.4 ? ' <b>' + Math.round(malPct * 100) + '% del grupo va en rojo:</b> puedes usar "Más básica" para medir lo esencial y luego dar segunda oportunidad.' : '') + '</p>' +
      '<details class="sub" id="ex-vistos" open><summary>Temas que entran (' + Object.keys(horas).length + ')</summary>' + (Object.keys(horas).length ? '<ul class="risk">' + Object.keys(horas).sort((a, b) => horas[b] - horas[a]).map(t => '<li><span>' + esc(tTit(t)) + (deb[t] != null && deb[t] < 0.6 ? ' <span class="chip warn">salió bajo: ' + Math.round(deb[t] * 100) + '%</span>' : '') + '</span><span class="muted small">' + horas[t] + ' h · ' + Math.round(horas[t] / tot * 100) + '%</span></li>').join('') + '</ul>' : '<p class="muted small">Sin temas con preguntas en el banco para este parcial.</p>') + '</details>' +
      btn('Generar examen recomendado', 'ex-gen', 'data-pid="' + pid + '"', 'primary'));
    const xs = X.list(g);
    if (xs.length) h += card('<h3>Tus exámenes</h3><ul class="risk">' + xs.map(ex => { const r = X.analisis(g, ex); return '<li><a href="#/examen/' + ex.id + '"><b>' + esc(ex.titulo) + '</b></a><span class="small muted">' + u.fCorta(ex.fecha) + ' · ' + ex.items.length + ' preguntas' + (r ? ' · promedio ' + Math.round(r.prom / ex.total * 100) : '') + '</span></li>'; }).join('') + '</ul>');
    return h;
  }
  CH['ex-pid'] = el => { E.ui.exPid = el.value; E.ui.exFecha = null; E.render(); };
  CH['ex-fecha'] = el => { E.ui.exPid = val('ex-pid'); E.ui.exFecha = el.value; E.render(); };
  A['ex-gen'] = () => {
    const g = D.grupoActual(), pid = val('ex-pid'), p = C.parcial(pid), id = u.uid('exa');
    const o = { pid: pid, fecha: val('ex-fecha') || p.fin, n: Math.max(5, Math.min(40, Number(val('ex-n')) || 15)), total: Math.max(10, Number(val('ex-total')) || 100), dur: Number(val('ex-dur')) || 50, mezcla: val('ex-mez') || 'eq', abiertas: Math.max(0, Number(val('ex-ab')) || 0), repaso: !!(document.getElementById('ex-rep') || {}).checked, seed: id };
    const r = X.generar(g, o); if (!r.items.length) { u.toast('No hay temas con preguntas para ese parcial', 'err'); return; }
    S.put(KX(g, id), { id: id, parcial: pid, titulo: 'Examen del ' + p.nombre, fecha: o.fecha, dur: o.dur, total: o.total, mezcla: o.mezcla, abiertas: o.abiertas, seed: id, items: r.items, horas: r.horas, rep: r.rep, creado: new Date().toISOString(), res: {} });
    location.hash = '#/examen/' + id; u.toast('Examen listo: revísalo y cambia lo que quieras', 'ok');
  };

  function detalleV(g, ex) {
    const vA = X.version(ex, 'A'), deb = X.debilidad(g, ex.id), horas = ex.horas || {}, a = ex.actId && S.get('act:' + g.id + ':' + ex.actId);
    const porT = {}; ex.items.forEach(it => { const b = item(it.id); if (!b) return; const x = porT[b.tema] = porT[b.tema] || { n: 0, pts: 0, rep: false }; x.n++; x.pts += it.pts; if (it.rep) x.rep = true; });
    const niv = { 1: 0, 2: 0, 3: 0 }; ex.items.forEach(it => { const b = item(it.id); if (b) niv[b.niv]++; });
    let h = card('<label class="fld"><span>Título</span><input id="ex-tit" value="' + esc(ex.titulo) + '" data-ch="ex-campo" data-id="' + ex.id + '" data-f="titulo"></label>' +
      '<div class="fgrid"><label class="fld"><span>Fecha</span><input type="date" value="' + esc(ex.fecha) + '" data-ch="ex-campo" data-id="' + ex.id + '" data-f="fecha"></label><label class="fld"><span>Duración (min)</span><input type="number" value="' + ex.dur + '" data-ch="ex-campo" data-id="' + ex.id + '" data-f="dur"></label><label class="fld"><span>Puntos totales</span><input type="number" value="' + ex.total + '" data-ch="ex-campo" data-id="' + ex.id + '" data-f="total"></label></div>' +
      '<p class="small">' + ex.items.length + ' preguntas · ' + ex.total + ' puntos · recordar ' + niv[1] + ' · comprender ' + niv[2] + ' · aplicar ' + niv[3] + '</p>' +
      '<div class="row gap wrap">' + btn(icon('print') + ' Versión A', 'ex-print', 'data-id="' + ex.id + '" data-v="A"', 'primary') + btn(icon('print') + ' Versión B', 'ex-print', 'data-id="' + ex.id + '" data-v="B"') + btn(icon('print') + ' Clave de respuestas', 'ex-clave', 'data-id="' + ex.id + '"') +
      (a ? link('Ver en Calificaciones', 'actividad/' + a.id, 'small') : btn(icon('plus') + ' Crear actividad en Calificaciones', 'ex-act', 'data-id="' + ex.id + '"', 'small')) + '</div>' +
      '<p class="muted small">Versión B: mismas preguntas en otro orden, opciones revueltas y otros datos en los problemas.</p>');
    h += card('<h3>📐 Tabla de especificaciones</h3><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Tema</th><th>Horas vistas</th><th>Preguntas</th><th>Puntos</th><th>%</th></tr></thead><tbody>' +
      Object.keys(porT).sort((x, y) => porT[y].pts - porT[x].pts).map(t => '<tr><td class="l">' + esc(tTit(t)) + (porT[t].rep ? ' <span class="chip">repaso</span>' : '') + (deb[t] != null && deb[t] < 0.6 ? ' <span class="chip warn">antes ' + Math.round(deb[t] * 100) + '%</span>' : '') + '</td><td>' + (horas[t] || '—') + '</td><td>' + porT[t].n + '</td><td>' + u.round(porT[t].pts, 1) + '</td><td>' + Math.round(porT[t].pts / ex.total * 100) + '</td></tr>').join('') + '</tbody></table></div>' +
      '<p class="muted small">Las preguntas se reparten según las horas que le diste a cada tema en Clases; los temas que salieron bajos antes llevan más peso y "repaso" son temas de parciales anteriores que conviene volver a evaluar.</p>');
    const temasEx = Array.from(new Set(ex.items.map(it => (item(it.id) || {}).tema))).filter(Boolean);
    const otros = Array.from(new Set((E.BANCO || []).map(b => b.tema)));
    h += card('<h3>Preguntas (versión A)</h3><ol class="ex-list">' + vA.map(x => '<li><div class="ex-hd"><span class="chip">' + E.BANCO_TIPO[x.b.tipo] + '</span><span class="chip">' + E.BANCO_NIV[x.b.niv] + '</span><span class="chip brand">' + esc(tTit(x.b.tema)) + '</span>' + (x.rep ? '<span class="chip warn">repaso</span>' : '') + '<b class="ex-pts">' + u.round(x.pts, 1) + ' pts</b></div>' +
      '<p>' + esc(x.q) + '</p>' + (x.opts ? '<ol class="ex-ops" type="a">' + x.opts.map((o, i) => '<li class="' + (i === x.ok ? 'ok' : '') + '">' + esc(o) + '</li>').join('') + '</ol>' : '') +
      (x.b.tipo === 'vf' ? '<p class="small okc"><b>' + (x.vf ? 'Verdadero' : 'Falso') + '</b>' + (x.r ? ': ' + esc(x.r) : '') + '</p>' : x.r ? '<p class="small muted">' + (x.b.tipo === 'ab' ? '<b>Respuesta modelo:</b> ' : '<b>Solución:</b> ') + esc(x.r) + '</p>' : '') +
      '<div class="row gap">' + btn('🔄 Cambiar', 'ex-cambiar', 'data-id="' + ex.id + '" data-it="' + x.id + '"', 'small ghost') + btn(icon('trash'), 'ex-quitar', 'data-id="' + ex.id + '" data-it="' + x.id + '" aria-label="Quitar pregunta"', 'small ghost') + '</div></li>').join('') + '</ol>' +
      '<div class="row gap wrap"><select id="ex-add-t">' + otros.map(t => '<option value="' + t + '" ' + (temasEx.indexOf(t) >= 0 ? '' : '') + '>' + esc(tTit(t)) + '</option>').join('') + '</select>' + btn(icon('plus') + ' Agregar pregunta de este tema', 'ex-agregar', 'data-id="' + ex.id + '"', 'small') + '</div>' +
      '<p class="muted small">Al agregar o quitar, los puntos se reparten de nuevo para sumar ' + ex.total + '.</p>');
    h += '<div class="row end gap">' + btn('↺ Generar otro', 'ex-regen', 'data-id="' + ex.id + '"', 'small ghost') + btn(icon('trash') + ' Borrar examen', 'ex-borrar', 'data-id="' + ex.id + '"', 'small ghost danger') + '</div>';
    return h;
  }
  const updEx = (id, fn) => { const g = D.grupoActual(); S.update(KX(g, id), fn, {}); const ex = X.get(g, id); if (ex) X.sync(g, ex); };
  CH['ex-campo'] = el => updEx(el.dataset.id, ex => { const f = el.dataset.f; let v = el.value; if (f === 'dur' || f === 'total') v = Math.max(1, Number(v) || 0); ex[f] = v; if (f === 'total') X.puntos(ex.items, ex.total); });
  A['ex-cambiar'] = el => updEx(el.dataset.id, ex => {
    const i = ex.items.findIndex(x => x.id === el.dataset.it), b = item(el.dataset.it); if (i < 0 || !b) return;
    const usados = new Set(ex.items.map(x => x.id)), c = (E.BANCO || []).filter(x => x.tema === b.tema && !usados.has(x.id));
    if (!c.length) { u.toast('No hay otra pregunta de ese tema en el banco', 'err'); return; }
    const pref = c.filter(x => x.niv === b.niv), nuevo = (pref.length ? pref : c)[Math.floor(Math.random() * (pref.length || c.length))];
    ex.items[i] = { id: nuevo.id, rep: ex.items[i].rep, pts: 0 }; X.puntos(ex.items, ex.total);
  });
  A['ex-quitar'] = el => updEx(el.dataset.id, ex => { if (ex.items.length <= 1) return; ex.items = ex.items.filter(x => x.id !== el.dataset.it); X.puntos(ex.items, ex.total); });
  A['ex-agregar'] = el => updEx(el.dataset.id, ex => {
    const t = val('ex-add-t'), usados = new Set(ex.items.map(x => x.id)), c = (E.BANCO || []).filter(x => x.tema === t && !usados.has(x.id));
    if (!c.length) { u.toast('Ya usaste todas las preguntas de ese tema', 'err'); return; }
    ex.items.push({ id: c[Math.floor(Math.random() * c.length)].id, rep: false, pts: 0 }); X.puntos(ex.items, ex.total);
  });
  A['ex-regen'] = el => {
    if (!confirm('¿Generar otro examen con los mismos datos? Se reemplazan las preguntas y se borran los resultados capturados.')) return;
    const g = D.grupoActual(), ex = X.get(g, el.dataset.id); const seed = u.uid('s');
    const r = X.generar(g, { pid: ex.parcial, fecha: ex.fecha, n: ex.items.length, total: ex.total, mezcla: ex.mezcla || 'eq', abiertas: ex.abiertas == null ? 2 : ex.abiertas, repaso: true, seed: seed });
    updEx(ex.id, d => { d.seed = seed; d.items = r.items; d.horas = r.horas; d.rep = r.rep; d.res = {}; d.rapido = null; });
  };
  A['ex-borrar'] = el => { const g = D.grupoActual(); if (!confirm('¿Borrar este examen y sus resultados? La actividad en Calificaciones se queda.')) return; S.del(KX(g, el.dataset.id)); location.hash = '#/examen'; };
  A['ex-act'] = el => {
    const g = D.grupoActual(), ex = X.get(g, el.dataset.id), id = u.uid('act'); if (!ex) return;
    S.put('act:' + g.id + ':' + id, { id: id, parcial: ex.parcial, categoria: 'examen', nombre: ex.titulo, peso: 1, max: ex.total, fecha: ex.fecha, instrumento: 'Exa', cuenta: true, notas: {}, examen: ex.id }, { silent: true });
    updEx(ex.id, d => { d.actId = id; }); u.toast('Actividad creada: las calificaciones se llenan solas al capturar resultados', 'ok', 5000);
  };

  /* ---------- impresión ---------- */
  const cabecera = (g, ex, v) => { const cf = D.cfg(), p = C.parcial(ex.parcial);
    return '<table class="ex-head"><tr><td colspan="2"><b>' + esc(cf.plantelNombre || cf.plantel || '') + '</b> · ' + esc(g.carrera || '') + '</td><td class="r"><b>Versión ' + v + '</b></td></tr>' +
      '<tr><td colspan="2"><b>' + esc(ex.titulo) + '</b>' + (p && ex.titulo.indexOf(p.nombre) < 0 ? ' · ' + esc(p.nombre) : '') + ' · Grupo ' + esc(g.nombre) + '</td><td class="r">' + u.fFecha(ex.fecha) + '</td></tr>' +
      '<tr><td>Nombre: ______________________________________</td><td>No. de lista: _____</td><td class="r">Calificación: _____ / ' + ex.total + '</td></tr></table>'; };
  A['ex-print'] = el => {
    const g = D.grupoActual(), ex = X.get(g, el.dataset.id); if (!ex) return; const v = el.dataset.v || 'A', its = X.version(ex, v), cf = D.cfg();
    let h = '<div class="pr exam">' + cabecera(g, ex, v) + '<p class="tiny">Instrucciones: lee con atención. Tienes ' + ex.dur + ' minutos. Contesta con pluma; en los problemas deja tu procedimiento. Docente: ' + esc(cf.docente) + '.</p>';
    SEC.forEach((s, si) => { const l = its.filter(x => x.b.tipo === s[0]); if (!l.length) return;
      h += '<div class="ex-sec"><b>' + ['I', 'II', 'III', 'IV'][si] + '. ' + s[1] + '</b> <span class="tiny">' + s[2] + '</span></div>';
      l.forEach(x => {
        h += '<div class="ex-it"><p><b>' + x.n + '.</b> ' + (x.b.tipo === 'vf' ? '( &nbsp;&nbsp; ) ' : '') + esc(x.q) + ' <span class="ex-p">(' + u.round(x.pts, 1) + ' pts)</span></p>';
        if (x.opts) h += '<ol class="ex-ops' + (x.opts.every(o => o.length < 38) ? ' dos' : '') + '" type="a">' + x.opts.map(o => '<li>' + esc(o) + '</li>').join('') + '</ol>';
        if (x.b.tipo === 'calc') h += '<div class="ex-box">Procedimiento:</div>';
        if (x.b.tipo === 'ab') h += '<div class="ex-lin"></div><div class="ex-lin"></div><div class="ex-lin"></div>';
        h += '</div>';
      });
    });
    E.print.run(h + '</div>', { title: ex.titulo + ' ' + v, margin: '10mm' });
  };
  A['ex-clave'] = el => {
    const g = D.grupoActual(), ex = X.get(g, el.dataset.id); if (!ex) return;
    const tabla = v => { const its = X.version(ex, v); return '<div class="ex-sec"><b>Versión ' + v + '</b></div><table class="grid"><thead><tr><th>No.</th><th class="l">Respuesta</th><th>Pts</th><th class="l">Tema</th></tr></thead><tbody>' +
      its.map(x => '<tr><td class="c">' + x.n + '</td><td>' + esc(resp(x)) + (x.b.tipo === 'calc' ? '<br><span class="tiny">' + esc(x.r) + '</span>' : '') + '</td><td class="c">' + u.round(x.pts, 1) + '</td><td class="tiny">' + esc(tTit(x.b.tema)) + '</td></tr>').join('') + '</tbody></table>'; };
    E.print.run('<div class="pr exam"><div class="p-title">CLAVE DE RESPUESTAS · ' + esc(ex.titulo.toUpperCase()) + '</div><p class="tiny c">Grupo ' + esc(g.nombre) + ' · ' + u.fFecha(ex.fecha) + ' · ' + ex.total + ' puntos · solo para el docente</p>' + tabla('A') + tabla('B') + '</div>', { title: 'Clave ' + ex.titulo, margin: '10mm' });
  };

  /* ---------- captura ---------- */
  function capturaV(g, ex) {
    const al = D.alumnos(g), modo = E.ui.exModo || 'alumno', a = ex.actId && S.get('act:' + g.id + ':' + ex.actId);
    let h = (a ? '' : card('<p class="small">Para que las calificaciones lleguen solas a Calificaciones, crea la actividad del examen.</p>' + btn(icon('plus') + ' Crear actividad en Calificaciones', 'ex-act', 'data-id="' + ex.id + '"', 'primary')));
    h += '<div class="filters">' + [['alumno', 'Por alumno'], ['rapido', 'Rápido: cuántos fallaron']].map(x => '<button type="button" class="tab ' + (modo === x[0] ? 'on' : '') + '" data-act="ex-modo" data-m="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
    if (modo === 'rapido') {
      const rp = ex.rapido || {}, its = X.version(ex, 'A');
      return h + card('<h3>Captura rápida</h3><p class="muted small">Sin calificar alumno por alumno: anota cuántos presentaron y cuántos fallaron cada pregunta (numeración de la versión A). Sirve para el análisis del grupo; las calificaciones las capturas en la actividad.</p>' +
        '<label class="fld"><span>Presentaron</span><input type="number" min="0" value="' + (rp.pres || '') + '" data-ch="ex-rap" data-id="' + ex.id + '" data-k="pres" style="max-width:120px"></label>' +
        '<ul class="ex-rap">' + its.map(x => '<li><span><b>' + x.n + '.</b> ' + esc(x.q.length > 80 ? x.q.slice(0, 78) + '…' : x.q) + '</span><label><small>Fallaron</small><input type="number" min="0" value="' + (((rp.mal || {})[x.id]) == null ? '' : rp.mal[x.id]) + '" data-ch="ex-rap" data-id="' + ex.id + '" data-k="' + x.id + '"></label></li>').join('') + '</ul>');
    }
    const res = ex.res || {}, ui = E.ui.exSel = E.ui.exSel || {};
    const sel = al.find(x => x.id === ui[ex.id]) || al.find(x => !res[x.id]) || al[0]; ui[ex.id] = sel.id;
    const r = res[sel.id] || {}, v = r.v || 'A', its = X.version(ex, v), m = r.m || {}, pts = X.puntaje(ex, sel.id);
    const i = al.indexOf(sel), prev = al[i - 1], next = al[i + 1], hechos = al.filter(x => res[x.id] && (res[x.id].np || X.puntaje(ex, x.id) != null)).length;
    h += card('<div class="row between gap wrap"><h3>✍️ Por alumno</h3><span class="small muted">Capturados ' + hechos + ' de ' + al.length + '</span></div>' +
      '<div class="lb-nav">' + btn('‹', 'ex-al', 'data-id="' + ex.id + '" data-aid="' + (prev || sel).id + '" aria-label="Anterior"' + (prev ? '' : ' disabled')) +
      '<select data-ch="ex-al" data-id="' + ex.id + '" aria-label="Alumno">' + al.map(x => '<option value="' + x.id + '" ' + (x.id === sel.id ? 'selected' : '') + '>' + x.num + '. ' + esc(x.nombre) + (res[x.id] ? ' ✓' : '') + '</option>').join('') + '</select>' +
      btn('›', 'ex-al', 'data-id="' + ex.id + '" data-aid="' + (next || sel).id + '" aria-label="Siguiente"' + (next ? '' : ' disabled')) + '</div>' +
      '<div class="row gap wrap"><span class="small">Versión:</span><div class="cl-seg">' + ['A', 'B'].map(x => btn(x, 'ex-ver', 'data-id="' + ex.id + '" data-aid="' + sel.id + '" data-v="' + x + '"', 'small' + (v === x ? ' on' : ''))).join('') + '</div>' + btn(r.np ? '↺ Sí presentó' : 'No presentó', 'ex-np', 'data-id="' + ex.id + '" data-aid="' + sel.id + '"', 'small ghost') + '</div>' +
      '<div class="lb-res"><span><b>' + esc(sel.nombre) + '</b></span><span class="g ' + (pts == null ? 'na' : H.gclass(pts / ex.total * 100)) + '">' + (r.np ? 'NP' : pts == null ? '—' : u.round(pts, 1) + ' / ' + ex.total) + '</span></div>' +
      (r.np ? '<p class="muted small">Marcado como no presentó.</p>' : '<ul class="lb-rev">' + its.map(x => { const val = m[x.id]; return '<li><div class="lb-t"><b>' + x.n + '.</b> ' + esc(x.q.length > 90 ? x.q.slice(0, 88) + '…' : x.q) + ' <small class="muted">· ' + esc(x.b.tipo === 'vf' ? (x.vf ? 'V' : 'F') : x.opts ? LET[x.ok] + ')' : 'abierta') + ' · ' + u.round(x.pts, 1) + ' pts</small></div><div class="cl-seg">' +
        btn('✓ Bien', 'ex-m', 'data-id="' + ex.id + '" data-aid="' + sel.id + '" data-it="' + x.id + '" data-v="1"', 'small' + (val === 1 ? ' on ok' : '')) + (x.b.tipo === 'calc' || x.b.tipo === 'ab' ? btn('½ Parcial', 'ex-m', 'data-id="' + ex.id + '" data-aid="' + sel.id + '" data-it="' + x.id + '" data-v="0.5"', 'small' + (val === 0.5 ? ' on warn' : '')) : '') +
        btn('✗ Mal', 'ex-m', 'data-id="' + ex.id + '" data-aid="' + sel.id + '" data-it="' + x.id + '" data-v="0"', 'small' + (val === 0 ? ' on bad' : '')) + '</div></li>'; }).join('') + '</ul>' +
        '<div class="row gap wrap">' + btn('✓ Todo bien (luego marca las malas)', 'ex-todo', 'data-id="' + ex.id + '" data-aid="' + sel.id + '"', 'small') + (next ? btn('Siguiente alumno ›', 'ex-al', 'data-id="' + ex.id + '" data-aid="' + next.id + '"', 'small primary') : '') + '</div>') +
      '<p class="muted small">Lo que no marques cuenta como mal. ' + (a ? 'La calificación se escribe sola en «' + esc(a.nombre) + '».' : '') + '</p>');
    return h;
  }
  A['ex-modo'] = el => { E.ui.exModo = el.dataset.m; E.render(); };
  A['ex-al'] = el => { (E.ui.exSel = E.ui.exSel || {})[el.dataset.id] = el.dataset.aid; E.render(); };
  CH['ex-al'] = el => { (E.ui.exSel = E.ui.exSel || {})[el.dataset.id] = el.value; E.render(); };
  const updRes = (id, aid, fn) => updEx(id, ex => { ex.res = ex.res || {}; const r = ex.res[aid] = ex.res[aid] || { v: 'A', m: {} }; r.m = r.m || {}; fn(r, ex); });
  A['ex-ver'] = el => updRes(el.dataset.id, el.dataset.aid, r => { r.v = el.dataset.v; });
  A['ex-np'] = el => updRes(el.dataset.id, el.dataset.aid, r => { r.np = !r.np; if (r.np) r.m = {}; });
  A['ex-m'] = el => updRes(el.dataset.id, el.dataset.aid, r => { const v = Number(el.dataset.v); if (r.m[el.dataset.it] === v) delete r.m[el.dataset.it]; else r.m[el.dataset.it] = v; r.np = false; });
  A['ex-todo'] = el => updRes(el.dataset.id, el.dataset.aid, (r, ex) => { ex.items.forEach(it => { r.m[it.id] = 1; }); r.np = false; });
  CH['ex-rap'] = el => updEx(el.dataset.id, ex => { ex.rapido = ex.rapido || { pres: 0, mal: {} }; ex.rapido.mal = ex.rapido.mal || {}; const v = el.value === '' ? null : Math.max(0, Number(el.value) || 0); if (el.dataset.k === 'pres') ex.rapido.pres = v || 0; else if (v == null) delete ex.rapido.mal[el.dataset.k]; else ex.rapido.mal[el.dataset.k] = v; });

  /* ---------- análisis y retroalimentación ---------- */
  function analisisV(g, ex) {
    const r = X.analisis(g, ex); if (!r) return card('<p>Todavía no hay resultados. Captúralos por alumno o de forma rápida.</p>' + link('Capturar resultados', 'examen/' + ex.id + '/captura', 'primary'));
    const its = X.version(ex, 'A'), al = D.alumnos(g), ts = Object.keys(r.temas).sort((a, b) => r.temas[a].p - r.temas[b].p);
    const pct = x => Math.round(x * 100);
    let h = card('<h3>📊 Cómo le fue al grupo</h3><p>Promedio: <b>' + u.round(r.prom, 1) + ' de ' + ex.total + '</b> (' + pct(r.prom / ex.total) + '/100) · ' + r.n + ' alumnos' + (r.modo === 'rapido' ? ' (captura rápida)' : '') + '.</p>' +
      '<ul class="ex-bars">' + ts.map(t => { const p = r.temas[t].p, nv = nivel(p); return '<li><span class="ex-bl">' + esc(tTit(t)) + '</span><span class="ex-bar"><i class="' + nv[1] + '" style="width:' + Math.max(2, pct(p)) + '%"></i></span><b>' + pct(p) + '%</b><span class="chip ' + nv[1] + '">' + nv[0] + '</span></li>'; }).join('') + '</ul>' +
      '<p class="muted small">Aciertos por tema, ponderados por puntos. Reenseñar: menos de 50% · Reforzar: 50 a 69% · Bien: 70 a 84% · Dominado: 85% o más. El siguiente examen dará más peso a lo que salió bajo y repasará estos temas.</p>');
    // qué hacer
    const bajos = ts.filter(t => r.temas[t].p < 0.7);
    if (bajos.length) h += card('<h3>🧭 Qué hacer la próxima clase</h3>' + bajos.map(t => { const p = r.temas[t].p, peor = r.temas[t].items.slice().sort((a, b) => r.items[a].p - r.items[b].p).slice(0, 2).map(id => its.find(x => x.id === id)).filter(Boolean);
      return '<div class="ex-rec"><p><b>' + esc(tTit(t)) + '</b> · ' + pct(p) + '% de aciertos</p><ul class="small">' +
        (p < 0.5 ? '<li>Vuelve a explicarlo con el <a href="#/tema/' + t + '">ejemplo resuelto del tema</a> y práctica guiada (<a href="#/estrategias/mal/ejemplo">cómo</a>).</li>' : '<li>Mini examen de 3 preguntas al inicio de las próximas clases (<a href="#/estrategias/reg/quiz">cómo</a>).</li>') +
        '<li>Galería de errores con las preguntas que más fallaron: ' + peor.map(x => '<i>' + x.n + '. ' + esc(x.q.length > 70 ? x.q.slice(0, 68) + '…' : x.q) + '</i> (' + pct(r.items[x.id].p) + '%)').join('; ') + ' (<a href="#/estrategias/reg/errores">cómo</a>).</li>' +
        '<li>' + btn(icon('screen') + ' Proyectar el tema', 'proj-open', 'data-id="' + t + '"', 'small') + '</li></ul></div>'; }).join('') +
      btn(icon('copy') + ' Copiar preguntas falladas para un mini examen', 'ex-fallas', 'data-id="' + ex.id + '"', 'small'));
    // preguntas
    h += card('<details class="sub" id="ex-items"><summary>Pregunta por pregunta (versión A)</summary><ul class="ex-bars">' + its.map(x => { const p = r.items[x.id] ? r.items[x.id].p : null; return '<li><span class="ex-bl"><b>' + x.n + '.</b> ' + esc(x.q.length > 60 ? x.q.slice(0, 58) + '…' : x.q) + '</span><span class="ex-bar"><i class="' + (p == null ? '' : nivel(p)[1]) + '" style="width:' + (p == null ? 0 : Math.max(2, pct(p))) + '%"></i></span><b>' + (p == null ? '—' : pct(p) + '%') + '</b>' + (p != null && p < 0.3 ? '<span class="chip bad" title="Revisa si la pregunta es clara">muy difícil</span>' : p != null && p > 0.95 ? '<span class="chip">muy fácil</span>' : '') + '</li>'; }).join('') + '</ul><p class="muted small">Si casi nadie acertó una pregunta, revisa también si estaba clara o si se enseñó así.</p></details>');
    // alumnos
    if (r.modo === 'alumno') {
      const fil = al.filter(a => r.alumnos[a.id]).map(a => ({ a: a, x: r.alumnos[a.id] })).sort((p, q) => p.x.pts - q.x.pts);
      const bajosA = fil.filter(f => f.x.pts / ex.total < (Number(D.cfg().minAprob) || 60) / 100);
      h += card('<h3>👥 Por alumno</h3>' + (bajosA.length ? '<p class="small"><b>' + bajosA.length + ' por debajo de ' + (D.cfg().minAprob || 60) + ':</b> conviene segunda oportunidad con lo que más les costó.</p>' + btn('Registrar segunda oportunidad para ellos', 'est-reg', 'data-est="segunda" data-aids="' + bajosA.map(f => f.a.id).join(',') + '"', 'small primary') : '') +
        '<ul class="risk">' + fil.map(f => { const peores = Object.keys(f.x.temas).filter(t => f.x.temas[t] < 0.5).sort((a, b) => f.x.temas[a] - f.x.temas[b]).slice(0, 2); return '<li><span><a href="#/alumno/' + f.a.id + '">' + esc(f.a.nombre) + '</a>' + (peores.length ? '<br><small class="muted">Le costó: ' + peores.map(t => esc(tTit(t)) + ' (' + pct(f.x.temas[t]) + '%)').join(', ') + '</small>' : '') + '</span><span class="g ' + H.gclass(f.x.pts / ex.total * 100) + '">' + u.round(f.x.pts / ex.total * 100, 0) + '</span></li>'; }).join('') + '</ul>');
    }
    return h;
  }
  A['ex-fallas'] = async el => {
    const g = D.grupoActual(), ex = X.get(g, el.dataset.id), r = X.analisis(g, ex); if (!r) return;
    const its = X.version(ex, 'A').filter(x => r.items[x.id] && r.items[x.id].p < 0.6).sort((a, b) => r.items[a.id].p - r.items[b.id].p).slice(0, 6);
    const txt = 'Mini examen de repaso · ' + g.nombre + '\n' + its.map((x, i) => (i + 1) + '. ' + x.q + (x.opts ? '\n' + x.opts.map((o, k) => '   ' + LET[k] + ') ' + o).join('\n') : '') + '\n   R: ' + resp(x)).join('\n');
    const ok = await u.copy(txt); u.toast(ok ? 'Copiadas ' + its.length + ' preguntas con respuesta' : 'No se pudo copiar', ok ? 'ok' : 'err');
  };

  /* ---------- para la ficha del alumno ---------- */
  X.alumnoHTML = (g, a) => {
    const xs = X.list(g).filter(ex => (ex.res || {})[a.id] && X.puntaje(ex, a.id) != null); if (!xs.length) return '';
    const ex = xs[0], r = X.analisis(g, ex), me = r && r.alumnos[a.id]; if (!me) return '';
    const ts = Object.keys(me.temas).sort((x, y) => me.temas[x] - me.temas[y]);
    return card('<div class="row between gap wrap"><h3>📝 ' + esc(ex.titulo) + '</h3>' + link('Análisis', 'examen/' + ex.id + '/analisis', 'small') + '</div><p>' + u.round(me.pts, 1) + ' de ' + ex.total + ' · <span class="g ' + H.gclass(me.pts / ex.total * 100) + '">' + Math.round(me.pts / ex.total * 100) + '</span></p>' +
      '<ul class="ex-bars">' + ts.map(t => '<li><span class="ex-bl">' + esc(tTit(t)) + '</span><span class="ex-bar"><i class="' + nivel(me.temas[t])[1] + '" style="width:' + Math.max(2, Math.round(me.temas[t] * 100)) + '%"></i></span><b>' + Math.round(me.temas[t] * 100) + '%</b></li>').join('') + '</ul>');
  };
})();

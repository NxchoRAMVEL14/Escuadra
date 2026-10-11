/* Escuadra · perfil aproximado de cada alumno (por semestre), observaciones de un toque y equipos equilibrados.
   El perfil describe lo que el alumno sabe y hace, con su evidencia; no es una etiqueta. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, gclass = H.gclass, icon = E.icon;

  /* ---------- observaciones de un toque ---------- */
  E.OBS = [
    { id: 'explico', ico: '🤝', txt: 'Explicó a un compañero', pos: 1, f: 'Explica a sus compañeros' },
    { id: 'lidero', ico: '🧭', txt: 'Lideró al equipo', pos: 1, f: 'Toma el liderazgo en su equipo' },
    { id: 'pregunta', ico: '❓', txt: 'Hizo una buena pregunta', pos: 1, f: 'Hace buenas preguntas' },
    { id: 'solo', ico: '💡', txt: 'Resolvió por su cuenta', pos: 1, f: 'Resuelve problemas por su cuenta' },
    { id: 'preciso', ico: '📐', txt: 'Trabajo limpio y preciso', pos: 1, f: 'Trabaja con limpieza y precisión' },
    { id: 'seguro', ico: '🦺', txt: 'Cuidó la seguridad', pos: 1, f: 'Cuida la seguridad en el taller' },
    { id: 'ayuda', ico: '🙋', txt: 'Pidió ayuda', pos: 1, f: 'Sabe pedir ayuda cuando la necesita' },
    { id: 'distrajo', ico: '💤', txt: 'Se distrajo', pos: -1, a: 'Todavía le cuesta mantener la atención' },
    { id: 'material', ico: '🎒', txt: 'No trajo material', pos: -1, a: 'Todavía olvida su material' },
    // del cierre del día
    { id: 'excelente', ico: '⭐', txt: 'Excelente hoy', pos: 1, f: 'Ha tenido días excelentes en clase' },
    { id: 'muymal', ico: '👎', txt: 'Muy mal hoy', pos: -1, a: 'Ha tenido días muy malos en clase' }
  ];
  const OBS_BY = {}; E.OBS.forEach(o => { OBS_BY[o.id] = o; });
  E.obsDia = (g, f, aid) => ((S.get('obs:' + g.id + ':' + f) || {})[aid]) || [];
  E.obsIcons = (g, f, aid) => E.obsDia(g, f, aid).map(id => OBS_BY[id] ? OBS_BY[id].ico : '').join('');

  function obsHTML() {
    const o = E.ui.obs, g = D.grupoActual(), a = g && D.alumno(g, o.aid); if (!a) return '<p>No encontré al alumno.</p>';
    const sel = E.obsDia(g, o.fecha, a.id);
    return '<p><b>' + esc(a.nombre) + '</b><br><span class="muted small">' + u.cap(u.fLarga(o.fecha)) + ' · toca para marcar o quitar</span></p>' +
      '<div class="obs-grid">' + E.OBS.map(x => '<button type="button" class="obs-chip ' + (x.pos < 0 ? 'neg ' : '') + (sel.indexOf(x.id) >= 0 ? 'on' : '') + '" data-act="obs-tog" data-id="' + x.id + '" aria-pressed="' + (sel.indexOf(x.id) >= 0) + '"><span>' + x.ico + '</span>' + esc(x.txt) + '</button>').join('') + '</div>' +
      '<div class="row gap wrap mt">' + btn('Listo', 'modal-close', '', 'primary') + '<a class="btn" href="#/alumno/' + a.id + '" data-act="modal-close-go" data-to="alumno/' + a.id + '">Ver su perfil</a></div>';
  }
  A['obs-open'] = el => { E.ui.obs = { aid: el.dataset.aid, fecha: el.dataset.fecha || u.today() }; E.modal.open('Observación', obsHTML()); };
  A['obs-tog'] = el => {
    const g = D.grupoActual(), o = E.ui.obs, id = el.dataset.id;
    S.update('obs:' + g.id + ':' + o.fecha, d => { const l = d[o.aid] = d[o.aid] || []; const i = l.indexOf(id); if (i >= 0) l.splice(i, 1); else l.push(id); if (!l.length) delete d[o.aid]; }, {});
    if (navigator.vibrate) navigator.vibrate(10); E.modal.body(obsHTML());
  };
  A['modal-close-go'] = el => { E.modal.close(); location.hash = '#/' + el.dataset.to; };

  /* ---------- cálculo del perfil ---------- */
  const P = E.perfil = {};
  P.DIMS = [['conoc', 'Conocimiento'], ['trab', 'Trabajos y práctica'], ['const', 'Constancia'], ['part', 'Participación'], ['colab', 'Actitud y colaboración']];
  P.rango = () => { const ps = D.parciales(); return { ini: ps.map(p => p.inicio).sort()[0], fin: ps.map(p => p.fin).sort().slice(-1)[0] }; };
  P.acts = g => { const ids = D.parciales().map(p => p.id); return S.list('act:' + g.id + ':').filter(a => ids.indexOf(a.parcial) >= 0); };
  P.obsAlumno = (g, aid) => {
    const rg = P.rango(), pre = 'obs:' + g.id + ':', cnt = {}; let n = 0;
    S.keys(pre).forEach(k => { const f = k.slice(pre.length); if (f < rg.ini || f > rg.fin) return; ((S.get(k) || {})[aid] || []).forEach(id => { cnt[id] = (cnt[id] || 0) + 1; n++; }); });
    return { cnt: cnt, n: n };
  };
  const wavg = l => { let s = 0, w = 0; l.forEach(o => { const k = Number(o.x.peso || 1); s += o.v * k; w += k; }); return w ? s / w : null; };
  const pts = (x, aid) => { const v = x.notas[aid], m = C.maxPts(x), t = C.tardeF(x, aid) < 1 ? ' · ⏰ tarde (' + Math.round(C.tardeF(x, aid) * 100) + ' %)' : ''; return (m !== 100 ? v + ' de ' + m + ' pts' : Math.round(C.nota(x, aid)) + '/100') + t; };
  const veces = n => n + (n === 1 ? ' vez' : ' veces');

  P.calc = (g, a) => {
    const c = D.cfg(), hoy = u.today(), acts = P.acts(g), aid = a.id;
    const r = { dims: {}, ev: {}, base: null, baseTxt: '', baseTema: '', fort: [], areas: [], paso: null, tend: null, temas: {}, datos: 0 };
    const dg = acts.filter(x => x.categoria === 'diagnostico').map(x => ({ x: x, v: C.nota(x, aid) })).filter(o => o.v != null);
    if (dg.length) { r.base = dg.reduce((s, o) => s + o.v, 0) / dg.length; r.baseTxt = dg.map(o => o.x.nombre + ': ' + pts(o.x, aid)).join(' · '); r.baseTema = dg.map(o => o.x.tema || o.x.nombre).join(' ') ; }
    const ex = acts.filter(x => x.categoria === 'examen').map(x => ({ x: x, v: C.nota(x, aid) })).filter(o => o.v != null);
    r.dims.conoc = wavg(ex);
    r.ev.conoc = ex.length ? ex.length + (ex.length === 1 ? ' examen' : ' exámenes') : 'aún sin exámenes';
    const tr = []; let ne = 0;
    acts.filter(x => x.categoria === 'trabajos').forEach(x => {
      let v = C.nota(x, aid);
      if (v == null && x.fecha && x.fecha < hoy) { ne++; if (c.vaciasCero) v = 0; }
      if (v != null) tr.push({ x: x, v: v });
    });
    r.dims.trab = wavg(tr); r.ev.trab = tr.length ? tr.length + (tr.length === 1 ? ' trabajo' : ' trabajos') + (ne ? ' · ' + ne + ' sin entregar' : '') : 'sin trabajos calificados';
    let ses = 0, asi = 0, fal = 0, ret = 0, racha = 0;
    D.parciales().forEach(p => { if (C.cal(g, p.id, aid).manual) return; const as = C.asis(g, p, aid); ses += as.ses; asi += as.a; fal += as.f; ret += as.ret; racha = Math.max(racha, as.racha); });
    if (ses) { let v = asi / ses * 100; const tot = tr.length + ne; if (tot) v = v * 0.75 + (1 - ne / tot) * 100 * 0.25; r.dims.const = v; } else r.dims.const = null;
    r.ev.const = ses ? asi + ' de ' + ses + (ses === 1 ? ' clase' : ' clases') + (ret ? ' · ' + ret + ' retardos' : '') + (ne ? ' · ' + ne + ' sin entregar' : '') : 'sin listas registradas';
    const pv = D.parciales().map(p => C.cal(g, p.id, aid)).filter(k => !k.manual && k.comp && k.comp.participacion != null).map(k => k.comp.participacion);
    let npt = 0; D.parciales().forEach(p => { npt += C.part(g, p, aid); });
    r.dims.part = pv.length ? pv.reduce((s, v) => s + v, 0) / pv.length : null;
    r.ev.part = pv.length ? npt + (npt === 1 ? ' participación' : ' participaciones') : 'sin participaciones registradas';
    const ob = P.obsAlumno(g, aid); let pos = 0, neg = 0;
    E.OBS.forEach(o => { const n = ob.cnt[o.id] || 0; if (o.pos > 0) pos += n; else neg += n; });
    r.dims.colab = pos + neg >= 2 ? (pos + 1) / (pos + neg + 2) * 100 : null;
    r.ev.colab = pos + neg ? pos + ' positivas · ' + neg + ' por mejorar' : 'sin observaciones';
    r.obs = ob;
    acts.forEach(x => { if (!x.tema) return; const v = C.nota(x, aid); if (v == null) return; const t = r.temas[x.tema] = r.temas[x.tema] || { s: 0, n: 0 }; t.s += v; t.n++; });
    const serie = dg.concat(ex).map(o => ({ f: o.x.fecha || '', v: o.v, n: o.x.nombre })).sort((p, q) => p.f.localeCompare(q.f));
    if (serie.length >= 2) { const l = serie[serie.length - 1], pr = serie[serie.length - 2], d = l.v - pr.v; r.tend = { d: d, k: d >= 8 ? 'sube' : d <= -8 ? 'baja' : 'estable', de: pr.n, a: l.n }; }
    let nn = 0; acts.forEach(x => { if (C.nota(x, aid) != null) nn++; });
    r.nCal = nn; r.nSes = ses; r.nObs = ob.n; r.datos = nn + ses + ob.n;
    r.conf = r.datos < 5 ? 'Pocos datos' : r.datos < 15 ? 'Aproximado' : 'Sólido';
    r.nivel = r.dims.conoc != null ? r.dims.conoc : r.base;
    r.fal = fal; r.ne = ne; r.racha = racha;
    textos(r, ses, ob);
    return r;
  };

  function textos(r, ses, ob) {
    const d = r.dims, R = Math.round, F = [], Ar = [];
    if (r.base != null && r.base >= 75) F.push('Buen punto de partida (diagnóstico ' + R(r.base) + '/100)');
    if (d.conoc != null && d.conoc >= 80) F.push('Domina lo evaluado en exámenes (' + R(d.conoc) + '/100)');
    if (d.trab != null && d.trab >= 80) F.push('Entrega trabajos de calidad (' + R(d.trab) + '/100)');
    if (d.const != null && d.const >= 95 && ses >= 3) F.push('Constante: asiste y cumple');
    if (d.part != null && d.part >= 80) F.push('Participa activamente');
    if (r.tend && r.tend.k === 'sube') F.push('Va mejorando: +' + R(r.tend.d) + ' puntos de "' + r.tend.de + '" a "' + r.tend.a + '"');
    E.OBS.filter(o => o.pos > 0).forEach(o => { const n = ob.cnt[o.id] || 0; if (n >= 2) F.push(o.f + ' (' + veces(n) + ')'); });
    if (r.base != null && r.base < 50) Ar.push('Todavía necesita reforzar lo que evaluó el diagnóstico (' + R(r.base) + '/100)');
    if (d.conoc != null && d.conoc < 60) Ar.push('Aún no domina lo evaluado en exámenes (' + R(d.conoc) + '/100)');
    if (d.trab != null && d.trab < 60) Ar.push('Todavía le falta calidad o constancia en trabajos (' + R(d.trab) + '/100)');
    if (r.ne >= 2) Ar.push('Tiene ' + r.ne + ' trabajos sin entregar');
    if (r.fal >= 2) Ar.push('Ha faltado ' + veces(r.fal) + ' este semestre');
    if (d.part != null && d.part < 40 && ses >= 5) Ar.push('Todavía participa poco');
    E.OBS.filter(o => o.pos < 0).forEach(o => { const n = ob.cnt[o.id] || 0; if (n >= 2) Ar.push(o.a + ' (' + veces(n) + ')'); });
    if (r.tend && r.tend.k === 'baja') Ar.push('Bajó ' + R(-r.tend.d) + ' puntos en "' + r.tend.a + '"');
    r.fort = F.slice(0, 3); r.areas = Ar.slice(0, 3);
    const sm1 = /subm[oó]dulo 1|sm1|dibujo|plano/i.test(r.baseTema);
    let p = null;
    if (r.racha >= 2 || r.fal >= 3) p = { t: 'Habla con él o ella sobre sus faltas; si siguen, avisa a orientación.' };
    else if (r.ne >= 2) p = { t: 'Acuerden una fecha para ponerse al corriente con sus trabajos.' };
    else if (r.base != null && r.base < 40 && d.conoc == null) p = sm1 ? { t: 'Siéntalo junto a un monitor en FreeCAD y repasen lectura de planos.', to: 'tema/sm1-planos', l: 'Abrir tema' } : { t: 'Ponlo en pareja con un monitor y repasen lo que evaluó el diagnóstico.' };
    else if (d.conoc != null && d.conoc < 60) p = { t: 'Dale un repaso guiado del tema más bajo y una segunda oportunidad corta.' };
    else if ((ob.cnt.distrajo || 0) >= 2) p = { t: 'Cámbialo de lugar o dale un rol activo (cronometrista, secretario del equipo).' };
    else if (d.part != null && d.part < 40 && ses >= 5) p = { t: 'Dale una pregunta segura para que participe: "explícalo en 60 segundos".', to: 'ideas/pr-explica-60', l: 'Ver idea' };
    else if (r.nivel != null && r.nivel >= 80) p = { t: 'Invítalo a ser monitor de su equipo: enseñar consolida lo que sabe.' };
    else if (r.datos < 5) p = { t: 'Todavía hay pocos datos: anota 2 o 3 observaciones en las próximas clases.' };
    else p = { t: 'Va bien: reconócele en público algo concreto que hizo bien.' };
    r.paso = p;
  }

  P.motivo = r => {
    if (r.racha >= 2) return r.racha + ' faltas seguidas';
    if (r.dims.const != null && r.dims.const < 80) return 'Constancia ' + Math.round(r.dims.const);
    if (r.dims.conoc != null && r.dims.conoc < 50) return 'Exámenes ' + Math.round(r.dims.conoc);
    if (r.base != null && r.base < 50) return 'Partida ' + Math.round(r.base);
    return r.areas[0] || '';
  };
  /* ---------- piezas visuales ---------- */
  const fmt = v => v == null ? '—' : Math.round(v);
  const barRow = (lbl, v, ev) => '<div class="pf-row"><div class="pf-l">' + esc(lbl) + '<small>' + esc(ev || '') + '</small></div><div class="pf-bar"><span class="' + gclass(v) + '" style="width:' + (v == null ? 0 : Math.max(3, Math.min(100, v))) + '%"></span></div><b class="pf-v g ' + gclass(v) + '">' + fmt(v) + '</b></div>';
  const TEND = { sube: ['↑ Mejorando', 'ok'], baja: ['↓ Bajando', 'bad'], estable: ['→ Estable', 'brand'] };
  const CONF = { 'Pocos datos': 'warn', 'Aproximado': 'info', 'Sólido': 'ok' };

  P.cardHTML = (g, a) => {
    const r = P.calc(g, a), c = D.cfg();
    let h = '<div class="row between gap wrap"><h3>' + icon('profile') + ' Perfil del semestre</h3><span class="chip ' + CONF[r.conf] + '" title="Datos que lo sostienen">' + r.conf + ' (' + r.datos + ')</span></div>' +
      '<p class="muted small">' + esc(c.semestreTexto || '') + ' · aproximado: ' + r.nCal + ' calificaciones, ' + r.nSes + ' clases y ' + r.nObs + ' observaciones.</p>';
    if (r.base != null) h += '<div class="pf-base"><span class="kicker">Punto de partida</span><b class="g ' + gclass(r.base) + '">' + Math.round(r.base) + '</b><span class="small">' + esc(r.baseTxt) + '</span>' + (r.tend ? '<span class="chip ' + TEND[r.tend.k][1] + '">' + TEND[r.tend.k][0] + '</span>' : '') + '</div>';
    h += '<div class="pf-bars">' + P.DIMS.map(d => barRow(d[1], r.dims[d[0]], r.ev[d[0]])).join('') + '</div>';
    const tk = Object.keys(r.temas);
    if (tk.length) h += '<p class="small"><b>Por tema:</b> ' + tk.map(t => esc(t) + ' <span class="g ' + gclass(r.temas[t].s / r.temas[t].n) + '">' + Math.round(r.temas[t].s / r.temas[t].n) + '</span>').join(' · ') + '</p>';
    h += '<div class="pf-cols"><div><h4 class="okc">Fortalezas</h4>' + (r.fort.length ? '<ul class="pf-list ok">' + r.fort.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<p class="muted small">Aún sin evidencia suficiente.</p>') + '</div>' +
      '<div><h4 class="warnc">Áreas de oportunidad</h4>' + (r.areas.length ? '<ul class="pf-list warn">' + r.areas.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<p class="muted small">Nada que señalar por ahora.</p>') + '</div></div>';
    if (r.paso) h += '<p class="note info"><b>Siguiente paso:</b> ' + esc(r.paso.t) + (r.paso.to ? ' <a href="#/' + r.paso.to + '">' + esc(r.paso.l || 'Abrir') + ' ›</a>' : '') + '</p>';
    const ic = Object.keys(r.obs.cnt);
    if (ic.length) h += '<p class="small muted">Observaciones: ' + ic.map(id => (OBS_BY[id] ? OBS_BY[id].ico + ' ' + OBS_BY[id].txt : id) + ' ×' + r.obs.cnt[id]).join(' · ') + '</p>';
    h += '<div class="row gap wrap">' + btn(icon('check') + ' Observar hoy', 'obs-open', 'data-aid="' + a.id + '" data-fecha="' + u.today() + '"') + btn(icon('print') + ' Imprimir ficha', 'pf-print', 'data-aid="' + a.id + '"') + '</div>';
    h += '<p class="muted small mt">Es una guía para ti, con su evidencia; no una etiqueta. Habla en "todavía": lo que aún no domina, lo puede aprender.</p>';
    const snaps = S.keys('perfilsem:' + g.id + ':').map(k => S.get(k)).filter(s => s && s.alumnos && s.alumnos[a.id] && s.semestre !== c.semestreTexto);
    if (snaps.length) h += '<details class="sub"><summary>Semestres anteriores</summary>' + snaps.map(s => { const x = s.alumnos[a.id]; return '<p class="small"><b>' + esc(s.semestre) + '</b> · ' + P.DIMS.map(d => d[1] + ' ' + fmt(x.dims[d[0]])).join(' · ') + '<br>Fortalezas: ' + esc((x.fort || []).join('; ') || '—') + '<br>Áreas: ' + esc((x.areas || []).join('; ') || '—') + '</p>'; }).join('') + '</details>';
    return h;
  };

  /* ---------- vista del grupo ---------- */
  V.perfiles = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Perfiles');
    const c = D.cfg(), rs = al.map(a => ({ a: a, r: P.calc(g, a) }));
    const bases = rs.filter(x => x.r.base != null), niv = rs.filter(x => x.r.nivel != null);
    const mon = niv.filter(x => x.r.nivel >= 75).sort((p, q) => q.r.nivel - p.r.nivel);
    const apoyo = rs.filter(x => (x.r.nivel != null && x.r.nivel < 50) || (x.r.dims.const != null && x.r.dims.const < 80) || x.r.racha >= 2).sort((p, q) => (p.r.nivel == null ? 50 : p.r.nivel) - (q.r.nivel == null ? 50 : q.r.nivel));
    const prom = l => l.length ? l.reduce((s, x) => s + x, 0) / l.length : null;
    let h = card('<h3>' + icon('profile') + ' Perfiles de ' + esc(g.nombre) + '</h3><p class="muted small">' + esc(c.semestreTexto || '') + ' · Se arman solos con diagnósticos, exámenes, trabajos, asistencia, participación y tus observaciones de un toque (toca un nombre en el Pase de lista).</p>' +
      '<div class="stats"><div><b>' + fmt(prom(bases.map(x => x.r.base))) + '</b><span>diagnóstico promedio</span></div><div><b>' + fmt(prom(niv.map(x => x.r.nivel))) + '</b><span>nivel actual promedio</span></div><div><b>' + mon.length + '</b><span>posibles monitores</span></div><div><b>' + apoyo.length + '</b><span>necesitan apoyo</span></div></div>' +
      '<div class="row gap wrap mt">' + btn(icon('team') + ' Equipos equilibrados', 'pf-equipos', '', 'primary') + btn(icon('copy') + ' Copiar para Claude (sin nombres)', 'pf-claude') + btn(icon('print') + ' Imprimir fichas', 'pf-print-all') + btn(icon('download') + ' Pegar datos de Claude', 'go', 'data-to="alumnos/paquete"') + link('🚦 Semáforo', 'semaforo', '') + '</div>');
    if (mon.length || apoyo.length) h += '<div class="grid2">' +
      card('<h3>Posibles monitores</h3>' + (mon.length ? '<ul class="risk">' + mon.slice(0, 8).map(x => '<li><a href="#/alumno/' + x.a.id + '">' + esc(x.a.nombre) + '</a> <span class="g ok">' + Math.round(x.r.nivel) + '</span></li>').join('') + '</ul><p class="muted small">Ponlos de apoyo en equipos distintos: enseñar también los hace crecer.</p>' : '<p class="muted small">Todavía nadie con nivel de 75 o más.</p>')) +
      card('<h3>Apoyo primero</h3>' + (apoyo.length ? '<ul class="risk">' + apoyo.slice(0, 8).map(x => '<li><a href="#/alumno/' + x.a.id + '">' + esc(x.a.nombre) + '</a> <span class="chip bad">' + esc(P.motivo(x.r)) + '</span></li>').join('') + '</ul>' + '<p class="muted small">' + (apoyo.length > 8 ? 'Y ' + (apoyo.length - 8) + ' más en la tabla. ' : '') + 'En la ficha de cada uno está el siguiente paso sugerido.</p>' : '<p class="muted small">Nadie en alerta por ahora.</p>')) + '</div>';
    const T = {}; rs.forEach(x => Object.keys(x.r.temas).forEach(t => { const o = T[t] = T[t] || { s: 0, n: 0, bajo: 0 }; const v = x.r.temas[t].s / x.r.temas[t].n; o.s += v; o.n++; if (v < 60) o.bajo++; }));
    if (Object.keys(T).length) h += card('<h3>Por tema</h3><ul class="risk">' + Object.keys(T).map(t => '<li><span>' + esc(t) + '</span><span><span class="g ' + gclass(T[t].s / T[t].n) + '">' + Math.round(T[t].s / T[t].n) + '</span> <span class="small muted">' + T[t].bajo + ' de ' + T[t].n + ' debajo de 60</span></span></li>').join('') + '</ul>');
    h += '<div class="tbl-wrap"><table class="tbl pf-tbl"><thead><tr><th>#</th><th class="l">Alumno</th><th>Partida</th><th>Conoc.</th><th>Trab.</th><th>Const.</th><th>Part.</th><th>Actitud</th><th>Datos</th></tr></thead><tbody>' + rs.map(x => {
      const d = x.r.dims, cell = v => '<td><span class="g ' + gclass(v) + '">' + fmt(v) + '</span></td>';
      return '<tr><td>' + x.a.num + '</td><td class="l"><a href="#/alumno/' + x.a.id + '">' + esc(x.a.nombre) + '</a>' + (x.r.tend ? ' <span class="small ' + (x.r.tend.k === 'sube' ? 'okc' : x.r.tend.k === 'baja' ? 'badc' : 'muted') + '">' + TEND[x.r.tend.k][0].split(' ')[0] + '</span>' : '') + '</td>' + cell(x.r.base) + cell(d.conoc) + cell(d.trab) + cell(d.const) + cell(d.part) + cell(d.colab) + '<td><span class="chip ' + CONF[x.r.conf] + '">' + x.r.datos + '</span></td></tr>';
    }).join('') + '</tbody></table></div>';
    h += card('<h3>Cierre de semestre</h3><p class="muted small">Guarda una fotografía de todos los perfiles de ' + esc(c.semestreTexto || 'este semestre') + '. Si el próximo semestre vuelves a tener al grupo, verás su historia en la ficha de cada alumno.</p>' + btn(icon('star') + ' Guardar fotografía del semestre', 'pf-snap'));
    return { t: 'Perfiles', h: h };
  };

  /* ---------- equipos equilibrados ---------- */
  P.equiposBal = (g, list, k) => {
    const lv = list.map(a => { const r = P.calc(g, a); return { a: a, v: r.nivel == null ? 50 : r.nivel, s: Math.random() }; });
    lv.sort((p, q) => q.v - p.v || p.s - q.s);
    const T = u.shuffle(Array.from({ length: k }, () => ({ m: [], s: 0 })));
    for (let i = 0; i < lv.length; i += k) {
      const ronda = lv.slice(i, i + k);
      // ronda completa: el más fuerte va al equipo con menos puntos; ronda incompleta: a los equipos con mejor promedio
      const orden = T.slice().sort(ronda.length === k ? (p, q) => p.s - q.s : (p, q) => q.s / q.m.length - p.s / p.m.length);
      ronda.forEach((x, j) => { orden[j].m.push(x.a); orden[j].s += x.v; });
    }
    return T.map(t => t.m);
  };
  A['pf-equipos'] = () => { E.ui.equipos.bal = true; A.equipos({ dataset: { fecha: u.today() } }); };

  /* ---------- copiar para Claude, sin nombres ---------- */
  A['pf-claude'] = async () => {
    const g = D.grupoActual(), c = D.cfg(), al = D.alumnos(g); const L = [];
    L.push('Perfil anónimo del grupo ' + g.nombre + ' (' + (g.carrera || 'Mecatrónica') + ', ' + (c.semestreTexto || '') + '). Escala 0-100; "—" = sin datos.');
    L.push('Columnas: Alumno | Diagnóstico (punto de partida) | Conocimiento (exámenes) | Trabajos | Constancia (asistencia y entregas) | Participación | Actitud (observaciones) | Nº de datos');
    al.forEach(a => {
      const r = P.calc(g, a), d = r.dims;
      L.push('Alumno ' + u.pad(a.num) + ' | ' + [r.base, d.conoc, d.trab, d.const, d.part, d.colab].map(fmt).join(' | ') + ' | ' + r.datos);
      const ob = Object.keys(r.obs.cnt); if (ob.length) L.push('   observaciones: ' + ob.map(id => (OBS_BY[id] ? OBS_BY[id].txt : id) + ' ×' + r.obs.cnt[id]).join(', '));
    });
    L.push(''); L.push('Soy su docente del Módulo II. ¿Qué patrones ves, a quién apoyo primero y cómo armo equipos de ' + (E.ui.equipos.n || 4) + '? Responde con el número de alumno.');
    const ok = await u.copy(L.join('\n')); u.toast(ok ? 'Copiado sin nombres: pégalo en tu chat con Claude' : 'No se pudo copiar', ok ? 'ok' : 'err', 5000);
  };

  /* ---------- fotografía del semestre ---------- */
  A['pf-snap'] = () => {
    const g = D.grupoActual(), c = D.cfg(), key = 'perfilsem:' + g.id + ':' + u.norm(c.semestreTexto || c.ciclo).replace(/[^A-Z0-9]+/g, '-');
    const out = { semestre: c.semestreTexto, ciclo: c.ciclo, fecha: u.today(), alumnos: {} };
    D.alumnos(g).forEach(a => { const r = P.calc(g, a); out.alumnos[a.id] = { nombre: a.nombre, base: r.base, dims: r.dims, fort: r.fort, areas: r.areas, datos: r.datos }; });
    S.put(key, out); u.toast('Fotografía del semestre guardada', 'ok');
  };

  /* ---------- ficha imprimible ---------- */
  function fichaHTML(g, a) {
    const r = P.calc(g, a), c = D.cfg(), bar = v => '<td class="bx"><div class="bf" style="width:' + (v == null ? 0 : Math.max(2, Math.min(100, v))) + '%"></div></td>';
    let curso = false;
    const cal = D.parciales().map(p => { const k = C.cal(g, p.id, a.id); if (k.final != null && k.enCurso) curso = true; return '<td>' + esc(p.nombre) + '<br><b>' + (k.final == null ? '—' : k.final + (k.enCurso ? '*' : '')) + '</b></td>'; }).join('');
    return '<div class="pr ficha"><div class="fh">' + esc(c.plantelNombre || c.plantel || '') + ' · ' + esc(g.carrera || '') + ' · Grupo ' + esc(g.nombre || g.grupo || '') + ' · ' + esc(c.semestreTexto || '') + '</div>' +
      '<h2>' + esc(a.nombre) + '</h2><p class="tiny">No. de lista ' + a.num + ' · Ficha de seguimiento elaborada el ' + u.fFecha(u.today()) + '</p>' +
      (r.base != null ? '<p><b>Punto de partida:</b> ' + Math.round(r.base) + '/100 (' + esc(r.baseTxt) + ')' + (r.tend ? ' · Tendencia: ' + TEND[r.tend.k][0] : '') + '</p>' : '') +
      '<table class="fb"><tbody>' + P.DIMS.map(d => '<tr><td class="fl">' + esc(d[1]) + '</td>' + bar(r.dims[d[0]]) + '<td class="fv">' + fmt(r.dims[d[0]]) + '</td><td class="fe">' + esc(r.ev[d[0]] || '') + '</td></tr>').join('') + '</tbody></table>' +
      '<table class="fc"><tr>' + cal + '</tr></table>' + (curso ? '<p class="tiny">* Calificación en curso: solo incluye los rubros que ya tienen datos.</p>' : '') +
      '<div class="fcols"><div><h3>Fortalezas</h3><ul>' + (r.fort.length ? r.fort.map(x => '<li>' + esc(x) + '</li>').join('') : '<li>Aún sin evidencia suficiente.</li>') + '</ul></div>' +
      '<div><h3>Lo que sigue trabajando</h3><ul>' + (r.areas.length ? r.areas.map(x => '<li>' + esc(x) + '</li>').join('') : '<li>Nada que señalar por ahora.</li>') + '</ul></div></div>' +
      '<h3>Plan de apoyo sugerido</h3><p>' + esc(r.paso ? r.paso.t : '') + '</p>' +
      '<h3>Acuerdos</h3><div class="lines"><div></div><div></div><div></div></div>' +
      '<div class="fsig"><div>' + esc(c.docente) + '<br>Docente</div><div>Alumno(a)</div><div>Padre, madre o tutor</div></div>' +
      '<p class="tiny">Perfil aproximado con ' + r.datos + ' datos (' + r.conf.toLowerCase() + '). Describe lo que el alumno sabe y hace en este momento; todo se puede mejorar.</p></div>';
  }
  A['pf-print'] = el => { const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid); if (a) E.print.run(fichaHTML(g, a), { title: 'Ficha ' + a.nombre, margin: '12mm' }); };
  A['pf-print-all'] = () => { const g = D.grupoActual(); E.print.run(D.alumnos(g).map(a => fichaHTML(g, a)).join(''), { title: 'Fichas ' + g.nombre, margin: '12mm' }); };
})();

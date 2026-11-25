/* Escuadra · v1.45.0 · Paquete 2: ver mejor a cada alumno.
   10) Línea de tiempo del alumno: en una sola lista, del más reciente al más antiguo, sus calificaciones de actividades y
       exámenes, lo que no entregó, sus faltas, observaciones, suspensiones, acuerdos con la familia y el cierre de cada
       parcial. Con filtros y para imprimir (reporte del alumno para tutoría u orientación).
   11) Comparar parciales: promedio, aprobados y asistencia del grupo en cada parcial; quién subió y quién bajó.
   13) Predicción del final: con lo que lleva, si sigue igual cómo terminaría el semestre y qué necesita en lo que falta
       (asegurado, va en camino, en riesgo o ya no le alcanza).
   12) Mapa de temas: alumno por tema en el parcial en curso (exámenes, actividades, faltas y repasos), con quién reforzar
       en cada tema.
   14) Reporte para tutoría: una hoja del grupo para el tutor, la co-tutora u orientación. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const SV = E.seguir = {};
  const corto = n => (u.corto ? u.corto(n) : n);
  const tit = id => { const t = (E.TEMAS || []).find(x => x.id === id); return t ? t.titulo : id; };

  /* ---------- 13 · predicción del semestre ---------- */
  SV.pred = (g, aid, hoy) => {
    hoy = hoy || u.today(); const ps = D.parciales(), m10 = C.min10(), meta = m10 * ps.length;
    const v = ps.map(p => { const k = C.cal(g, p.id, aid); return { p: p, of: k.final == null ? null : C.oficial(k.final), cerrado: hoy > p.fin, curso: hoy >= p.inicio && hoy <= p.fin }; });
    const cer = v.filter(x => x.cerrado), suma = cer.reduce((s, x) => s + (x.of == null ? 0 : x.of), 0), r = ps.length - cer.length;
    const conCal = v.filter(x => x.of != null && (x.cerrado || x.curso)), ritmo = conCal.length ? Math.round(conCal.reduce((s, x) => s + x.of, 0) / conCal.length) : null;
    if (cer.some(x => x.of == null)) return { v: v, est: 'sin', t: 'Falta la calificación de un parcial cerrado' };
    if (!r) { const ok = suma >= meta; return { v: v, est: ok ? 'aprobado' : 'extra', suma: suma, meta: meta, final: Math.round(suma / ps.length), t: ok ? 'Aprobó el semestre' : 'Va a extraordinario' }; }
    const falta = meta - suma, nec = Math.ceil(falta / r), proy = ritmo == null ? null : Math.max(5, Math.min(10, Math.round((suma + ritmo * r) / ps.length)));
    let est, t;
    if (nec <= 5) { est = 'asegurado'; t = 'Ya tiene asegurado el semestre'; }
    else if (nec > 10) { est = 'nolcanza'; t = 'Ya no le alcanza: necesitaría ' + nec + ' en ' + (r > 1 ? 'cada parcial que falta' : 'el parcial que falta'); }
    else if (ritmo != null && ritmo >= nec) { est = 'camino'; t = 'Va en camino: necesita ' + nec + (r > 1 ? ' de promedio' : '') + ' y lleva ' + ritmo; }
    else { est = 'riesgo'; t = 'En riesgo: necesita ' + nec + (r > 1 ? ' de promedio' : '') + (ritmo != null ? ' y lleva ' + ritmo : ''); }
    return { v: v, est: est, t: t, nec: nec, r: r, ritmo: ritmo, proy: proy, suma: suma, meta: meta };
  };
  SV.EST = { asegurado: ['ok', '✅ Asegurado'], camino: ['ok', '🟢 En camino'], riesgo: ['warn', '🟡 En riesgo'], nolcanza: ['bad', '🔴 No alcanza'], aprobado: ['ok', '✅ Aprobó'], extra: ['bad', '🔴 Extraordinario'], sin: ['', '— Sin datos'] };
  const chip = est => '<span class="chip sv-' + (SV.EST[est] || SV.EST.sin)[0] + '">' + (SV.EST[est] || SV.EST.sin)[1] + '</span>';

  /* ---------- 11 · comparar parciales ---------- */
  SV.resumen = g => {
    const al = D.alumnos(g), hoy = u.today();
    return D.parciales().map(p => {
      const cs = al.map(a => { const k = C.cal(g, p.id, a.id); return k.final == null ? null : C.oficial(k.final); }).filter(x => x != null);
      const as = al.map(a => C.asis(g, p, a.id)).filter(x => x.ses), m10 = C.min10();
      return { p: p, n: cs.length, prom: cs.length ? cs.reduce((s, x) => s + x, 0) / cs.length : null, apr: cs.filter(x => x >= m10).length, asis: as.length ? as.reduce((s, x) => s + x.pct, 0) / as.length : null, empezo: hoy >= p.inicio };
    });
  };
  SV.cambios = g => {
    const ps = D.parciales(), hoy = u.today(), conDatos = ps.filter(p => hoy >= p.inicio);
    if (conDatos.length < 2) return { a: null, b: null, L: [] };
    const pa = conDatos[conDatos.length - 2], pb = conDatos[conDatos.length - 1];
    const L = D.alumnos(g).map(a => { const x = C.cal(g, pa.id, a.id).final, y = C.cal(g, pb.id, a.id).final; return x == null || y == null ? null : { a: a, x: C.oficial(x), y: C.oficial(y), d: C.oficial(y) - C.oficial(x) }; }).filter(Boolean);
    return { a: pa, b: pb, L: L };
  };
  V.comparar = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Comparar parciales');
    const R = SV.resumen(g), m10 = C.min10(), mx = 10;
    let h = card('<div class="row between gap wrap"><h3>📊 Comparar parciales · ' + esc(g.nombre) + '</h3>' + btn('🖨 Reporte para tutoría', 'sv-rep', '', 'small primary') + '</div><p class="small muted">Cómo va el grupo en cada parcial, quién subió y quién bajó, y cómo terminaría cada alumno el semestre si sigue igual.</p>' +
      '<div class="sv-barras">' + R.map(r => '<div class="sv-col"><div class="sv-bar"><i style="height:' + (r.prom == null ? 0 : Math.round(r.prom / mx * 100)) + '%"' + (r.prom != null && r.prom < m10 ? ' class="bad"' : '') + '></i></div><b>' + (r.prom == null ? '—' : r.prom.toFixed(1)) + '</b><span>' + esc(r.p.nombre) + '</span><small>' + (r.n ? r.apr + ' de ' + r.n + ' aprueban' : (r.empezo ? 'sin calificaciones' : 'no empieza')) + (r.asis != null ? '<br>asistencia ' + Math.round(r.asis) + ' %' : '') + '</small></div>').join('') + '</div>');
    const cb = SV.cambios(g);
    if (cb.a) {
      const sub = cb.L.filter(x => x.d > 0).sort((x, y) => y.d - x.d), baj = cb.L.filter(x => x.d < 0).sort((x, y) => x.d - y.d);
      const li = x => '<li><a href="#/linea/' + x.a.id + '">' + x.a.num + '. ' + esc(corto(x.a.nombre)) + '</a> <span class="muted">' + x.x + ' → ' + x.y + '</span> <b class="' + (x.d > 0 ? 'sv-up' : 'sv-down') + '">' + (x.d > 0 ? '▲ +' : '▼ ') + x.d + '</b></li>';
      h += card('<h3>↕️ Del ' + esc(cb.a.nombre) + ' al ' + esc(cb.b.nombre) + '</h3><div class="sv-dos"><div><h4>Subieron (' + sub.length + ')</h4><ul class="plain sv-l">' + (sub.map(li).join('') || '<li class="muted">Nadie todavía</li>') + '</ul></div><div><h4>Bajaron (' + baj.length + ')</h4><ul class="plain sv-l">' + (baj.map(li).join('') || '<li class="muted">Nadie</li>') + '</ul></div></div>' + (cb.b.fin >= u.today() ? '<p class="small muted">El ' + esc(cb.b.nombre) + ' sigue en curso: su calificación puede cambiar.</p>' : ''));
    }
    const ps = D.parciales(), P = D.alumnos(g).map(a => ({ a: a, x: SV.pred(g, a.id) })), cnt = {};
    P.forEach(o => { cnt[o.x.est] = (cnt[o.x.est] || 0) + 1; });
    h += card('<h3>🔮 Cómo terminaría el semestre</h3><p class="small">Para aprobar se juntan al menos ' + (m10 * ps.length) + ' puntos en los ' + ps.length + ' parciales (mínimo ' + m10 + ' cada uno en promedio). Con lo que lleva cada alumno: qué necesita en lo que falta y si va a ese ritmo.</p>' +
      '<div class="fs-kpi">' + ['asegurado', 'camino', 'riesgo', 'nolcanza', 'aprobado', 'extra'].filter(k => cnt[k]).map(k => '<div class="' + SV.EST[k][0] + '"><b>' + cnt[k] + '</b><span>' + SV.EST[k][1].replace(/^\S+ /, '') + '</span></div>').join('') + '</div>' +
      '<div class="tbl-wrap"><table class="fs-t sv-t"><tr><th>#</th><th>Alumno</th>' + ps.map(p => '<th>' + esc(p.nombre.replace('parcial', 'P').replace(/\s+/g, '')) + '</th>').join('') + '<th>Necesita</th><th>Estado</th></tr>' +
      P.map(o => '<tr><td>' + o.a.num + '</td><td><a href="#/linea/' + o.a.id + '">' + esc(corto(o.a.nombre)) + '</a></td>' + o.x.v.map(c => '<td class="' + (c.of != null && c.of < m10 ? 'fs-baja' : '') + '">' + (c.of == null ? '·' : c.of + (c.curso ? '*' : '')) + '</td>').join('') + '<td>' + (o.x.nec ? (o.x.nec > 10 ? '—' : o.x.nec) : '') + '</td><td>' + chip(o.x.est) + '</td></tr>').join('') + '</table></div><p class="small muted">* parcial en curso (todavía puede cambiar). «Nec.» = calificación que le hace falta en cada parcial que queda. Es una guía para actuar a tiempo, no una sentencia.</p>');
    return { t: 'Comparar parciales', h: h };
  };

  /* ---------- 10 · línea de tiempo ---------- */
  SV.eventos = (g, aid) => {
    const out = [], hoy = u.today(), ps = D.parciales(), OB = {}; (E.OBS || []).forEach(o => { OB[o.id] = o; });
    ps.forEach(p => {
      if (hoy < p.inicio) return;
      C.acts(g, p.id).forEach(a => {
        if (!a.fecha || a.fecha > hoy || C.sinCal && C.sinCal(a)) return; const v = C.nota(a, aid), otros = Object.keys(a.notas || {}).some(k => k !== aid && a.notas[k] !== '' && a.notas[k] != null);
        const ex = a.categoria === 'examen' || a.examen;
        if (v != null) out.push({ f: a.fecha, k: 'cal', i: ex ? '📝' : '📒', t: (ex && !/^examen/i.test(a.nombre) ? 'Examen: ' : '') + a.nombre, d: C.c10(v), mal: C.oficial(v) < C.min10() });
        else if (otros) out.push({ f: a.fecha, k: 'cal', i: '⛔', t: 'No entregó: ' + a.nombre, mal: true });
      });
      C.asis(g, p, aid).fechasF.forEach(f => out.push({ f: f, k: 'asis', i: '🚫', t: 'Faltó', mal: true }));
      if (hoy > p.fin) { const k = C.cal(g, p.id, aid); if (k.final != null) out.push({ f: p.fin, k: 'cal', i: '🏁', t: 'Cerró el ' + p.nombre, d: C.c10(k.final), mal: C.oficial(k.final) < C.min10(), fuerte: true }); }
    });
    S.keys('obs:' + g.id + ':').forEach(key => { const f = key.split(':').pop(), l = (S.get(key) || {})[aid] || []; l.forEach(id => { const o = OB[id]; if (o) out.push({ f: f, k: 'obs', i: o.ico, t: o.txt, mal: o.pos < 0 }); }); });
    S.keys('obsnota:' + g.id + ':').forEach(key => { const t = (S.get(key) || {})[aid]; if (t) out.push({ f: key.split(':').pop(), k: 'obs', i: '🗒️', t: String(t) }); });
    if (E.susp) E.susp.lista(g).filter(x => x.aid === aid).forEach(x => out.push({ f: x.desde, k: 'fam', i: '⏸️', t: 'Suspendido hasta el ' + u.fCorta(x.regresa) + (x.motivo ? ' · ' + x.motivo : ''), mal: true }));
    if (E.resultados && E.resultados.juntas) E.resultados.juntas(g).forEach(j => (j.acuerdos || []).filter(x => x.aid === aid).forEach(x => out.push({ f: j.fecha, k: 'fam', i: '👪', t: 'Acuerdo con la familia: ' + x.t })));
    return out.filter(x => x.f).sort((x, y) => (x.f < y.f ? 1 : x.f > y.f ? -1 : 0));
  };
  const FIL = [['todo', 'Todo'], ['cal', 'Calificaciones'], ['asis', 'Faltas'], ['obs', 'Observaciones'], ['fam', 'Familia']];
  const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const lista = (ev, max) => { let mes = '', h = ''; ev.slice(0, max || 1e4).forEach(x => { const m = x.f.slice(0, 7); if (m !== mes) { mes = m; h += '<li class="sv-mes">' + MES[Number(m.slice(5)) - 1] + ' ' + m.slice(0, 4) + '</li>'; } h += '<li class="sv-ev sv-' + x.k + (x.mal ? ' sv-mal' : '') + (x.fuerte ? ' sv-fuerte' : '') + '"><span class="sv-f">' + u.fCorta(x.f) + '</span><span class="sv-i">' + x.i + '</span><span class="sv-tx">' + esc(x.t) + '</span>' + (x.d ? '<b class="sv-d">' + esc(x.d) + '</b>' : '') + '</li>'; }); return h; };
  V.linea = (aid, fil) => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const a = D.alumno(g, aid); if (!a) return { t: 'Línea de tiempo', h: card('<p>No encontré a ese alumno.</p>' + link('Ver alumnos', 'alumnos')) };
    fil = fil || 'todo'; const all = SV.eventos(g, a.id), ev = fil === 'todo' ? all : all.filter(x => x.k === fil), pr = SV.pred(g, a.id);
    const nf = all.filter(x => x.k === 'asis').length, ne = all.filter(x => x.i === '⛔').length;
    let h = card('<div class="row between gap wrap"><div><h3>🕒 ' + esc(a.nombre) + '</h3><p class="small muted">Núm. ' + a.num + ' · ' + esc(g.nombre) + '</p></div><div class="row gap">' + link('Ficha', 'alumno/' + a.id, 'small') + btn('🖨 Reporte', 'sv-rep-al', 'data-aid="' + a.id + '"', 'small') + '</div></div>' +
      '<p class="small">' + chip(pr.est) + ' ' + esc(pr.t) + '.</p><p class="small muted">' + nf + ' falta' + (nf === 1 ? '' : 's') + ' · ' + ne + ' sin entregar · ' + all.length + ' registros</p>' +
      '<div class="row gap wrap sv-fil">' + FIL.map(f => '<a class="chip' + (f[0] === fil ? ' on' : '') + '" href="#/linea/' + a.id + '/' + f[0] + '">' + f[1] + '</a>').join('') + '</div>');
    h += card(ev.length ? '<ul class="plain sv-tl">' + lista(ev) + '</ul>' : '<p class="muted">Todavía no hay registros' + (fil !== 'todo' ? ' de este tipo' : '') + '.</p>');
    return { t: 'Línea de tiempo', h: h };
  };

  /* ---------- 12 · mapa de temas ---------- */
  SV.mapa = g => {
    if (!E.casa || !E.casa.parcialTemas) return null;
    const conB = t => (E.BANCO || []).some(b => b.tema === t), gr = E.casa.parcialTemas(g, null);
    const temas = Object.keys(gr.dif).filter(conB).sort((x, y) => gr.dif[y] - gr.dif[x]).slice(0, 8);
    const filas = D.alumnos(g).map(a => { const pt = E.casa.parcialTemas(g, a); return { a: a, propio: pt.propio, dif: pt.dif }; });
    return { p: gr.p, temas: temas, gdif: gr.dif, filas: filas };
  };
  const nivel = d => d == null ? 'na' : d <= 0.2 ? 'ok' : d <= 0.4 ? 'warn' : 'bad';
  V.mapatemas = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Mapa de temas');
    const m = SV.mapa(g);
    if (!m || !m.temas.length) return { t: 'Mapa de temas', h: card('<h3>🗺️ Mapa de temas</h3><p>Todavía no hay datos por tema en este parcial. Se llena con los exámenes (por pregunta), las actividades con fecha de clase, las faltas y los repasos.</p>' + link('Ir a Examen', 'examen', 'small')) };
    let h = card('<h3>🗺️ Mapa de temas · ' + esc(m.p.nombre) + '</h3><p class="small">Qué tema le cuesta a cada alumno, con sus exámenes, actividades, faltas en esas clases y repasos. <span class="sv-cel ok">domina</span> <span class="sv-cel warn">a medias</span> <span class="sv-cel bad">le cuesta</span> <span class="sv-cel na">sin datos</span></p>' +
      '<div class="tbl-wrap"><table class="sv-mapa"><tr><th>Alumno</th>' + m.temas.map((t, i) => '<th title="' + esc(tit(t)) + '"><span>' + (i + 1) + '</span></th>').join('') + '</tr>' +
      '<tr class="sv-gr"><td><b>Grupo</b></td>' + m.temas.map(t => '<td class="sv-cel ' + nivel(m.gdif[t]) + '"></td>').join('') + '</tr>' +
      m.filas.map(f => '<tr><td><a href="#/linea/' + f.a.id + '">' + f.a.num + '. ' + esc(corto(f.a.nombre)) + '</a></td>' + m.temas.map(t => '<td class="sv-cel ' + (f.propio ? nivel(f.dif[t]) : 'na') + '"></td>').join('') + '</tr>').join('') + '</table></div>' +
      '<ol class="small sv-temas">' + m.temas.map(t => '<li>' + esc(tit(t)) + '</li>').join('') + '</ol>');
    h += card('<h3>🎯 A quién reforzar en cada tema</h3><ul class="plain sv-l">' + m.temas.map(t => { const L = m.filas.filter(f => f.propio && nivel(f.dif[t]) === 'bad'); return '<li><b>' + esc(tit(t)) + '</b>: ' + (L.length ? L.map(f => esc(corto(f.a.nombre))).join(', ') : '<span class="muted">nadie en rojo</span>') + '</li>'; }).join('') + '</ul><p class="small muted">Júntalos en un equipo de repaso o pídele a un monitor que los apoye en ese tema.</p>');
    return { t: 'Mapa de temas', h: h };
  };

  /* ---------- 14 · reportes para imprimir ---------- */
  const enc = (g, t) => { const cf = D.cfg(); return '<h2>' + esc(t) + '</h2><p class="fs-sub">' + esc((cf.plantel || 'CETAC 19') + ' · Grupo ' + g.nombre + (g.modulo ? ' · ' + g.modulo : '') + ' · ' + (cf.docente || '') + ' · ' + u.fLarga(u.today())) + '</p>'; };
  SV.repGrupo = g => {
    const R = SV.resumen(g), cb = SV.cambios(g), p = C.parcialActual(), m10 = C.min10();
    const at = E.alerta && E.alerta.grupo ? E.alerta.grupo(g, p.id).filter(x => x.nivel !== 'verde') : [];
    const P = D.alumnos(g).map(a => ({ a: a, x: SV.pred(g, a.id) })), mal = P.filter(o => o.x.est === 'riesgo' || o.x.est === 'nolcanza' || o.x.est === 'extra');
    const tg = E.casa && E.casa.temasGrupo ? E.casa.temasGrupo(g) : { ts: [] };
    let h = '<div class="pr fs-pr sv-pr">' + enc(g, 'Reporte del grupo para tutoría') +
      '<h3>Calificaciones por parcial</h3><table class="fs-t"><tr><th>Parcial</th><th>Promedio</th><th>Aprueban</th><th>Asistencia</th></tr>' + R.filter(r => r.empezo).map(r => '<tr><td>' + esc(r.p.nombre) + '</td><td>' + (r.prom == null ? '—' : r.prom.toFixed(1)) + '</td><td>' + (r.n ? r.apr + ' de ' + r.n : '—') + '</td><td>' + (r.asis == null ? '—' : Math.round(r.asis) + ' %') + '</td></tr>').join('') + '</table>';
    if (at.length) h += '<h3>Alerta temprana · ' + esc(p.nombre) + '</h3><table class="fs-t"><tr><th>#</th><th>Alumno</th><th>Nivel</th><th>Razones</th></tr>' + at.map(x => '<tr><td>' + x.a.num + '</td><td>' + esc(x.a.nombre) + '</td><td>' + (x.nivel === 'rojo' ? 'Rojo' : 'Amarillo') + '</td><td style="text-align:left">' + esc(x.R.filter(r => r.tipo !== 'cono').map(r => r.t).join('; ')) + '</td></tr>').join('') + '</table>';
    if (mal.length) h += '<h3>En riesgo de reprobar el semestre</h3><table class="fs-t"><tr><th>#</th><th>Alumno</th><th>Situación</th></tr>' + mal.map(o => '<tr><td>' + o.a.num + '</td><td>' + esc(o.a.nombre) + '</td><td style="text-align:left">' + esc(o.x.t) + '</td></tr>').join('') + '</table>';
    if (cb.a) { const s = cb.L.filter(x => x.d >= 2), b = cb.L.filter(x => x.d <= -2); if (s.length || b.length) h += '<h3>Cambios del ' + esc(cb.a.nombre) + ' al ' + esc(cb.b.nombre) + ' (2 puntos o más)</h3><p>' + (s.length ? '<b>Subieron:</b> ' + s.map(x => esc(corto(x.a.nombre)) + ' (' + x.x + '→' + x.y + ')').join(', ') + '. ' : '') + (b.length ? '<b>Bajaron:</b> ' + b.map(x => esc(corto(x.a.nombre)) + ' (' + x.x + '→' + x.y + ')').join(', ') + '.' : '') + '</p>'; }
    if (tg.ts.length) h += '<h3>Temas que más le cuestan al grupo</h3><p>' + tg.ts.map(t => esc(tit(t))).join(' · ') + '</p>';
    if (!at.length && !mal.length) h += '<p>Ningún alumno en alerta ni en riesgo por ahora.</p>';
    return h + '<p class="fs-sub">Mínimo aprobatorio: ' + m10 + '. Datos de Escuadra; la alerta y la predicción son una guía para actuar a tiempo, no una etiqueta.</p></div>';
  };
  SV.repAlumno = (g, a) => {
    const pr = SV.pred(g, a.id), ev = SV.eventos(g, a.id), ps = D.parciales();
    const nf = ev.filter(x => x.k === 'asis').length, ne = ev.filter(x => x.i === '⛔');
    return '<div class="pr fs-pr sv-pr">' + enc(g, 'Reporte del alumno · ' + a.nombre) +
      '<table class="fs-t"><tr>' + ps.map(p => '<th>' + esc(p.nombre) + '</th>').join('') + '<th>Faltas</th><th>Sin entregar</th></tr><tr>' + pr.v.map(c => '<td>' + (c.of == null ? '—' : c.of + (c.curso ? ' (en curso)' : '')) + '</td>').join('') + '<td>' + nf + '</td><td>' + ne.length + '</td></tr></table>' +
      '<p><b>Semestre:</b> ' + esc(pr.t) + '.</p>' + (ne.length ? '<p><b>Sin entregar:</b> ' + ne.map(x => esc(x.t.replace('No entregó: ', ''))).join(', ') + '.</p>' : '') +
      '<h3>Lo más reciente</h3><ul class="plain sv-tl sv-tl-pr">' + lista(ev, 28) + '</ul></div>';
  };
  A['sv-rep'] = () => { const g = D.grupoActual(); if (g) E.print.run(SV.repGrupo(g), { title: 'Reporte de tutoría ' + g.nombre }); };
  A['sv-rep-al'] = el => { const g = D.grupoActual(), a = g && D.alumno(g, el.dataset.aid); if (a) E.print.run(SV.repAlumno(g, a), { title: 'Reporte de ' + corto(a.nombre) }); };

  /* ---------- enganches: ficha, tutoría ---------- */
  if (V.alumno && E.fichaInsert) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) { const pr = SV.pred(g, a.id); o.h = E.fichaInsert(o.h, card('<div class="row between gap wrap"><h3>🔮 Semestre</h3>' + link('🕒 Línea de tiempo', 'linea/' + a.id, 'small') + '</div><p class="small">' + chip(pr.est) + ' ' + esc(pr.t) + '.</p>')); } return o; }; }
  if (V.tutoria) { const vt = V.tutoria; V.tutoria = function () { const o = vt.apply(null, arguments), g = D.grupoActual(); if (o && g && !/Algo falló|Primero importa|No hay grupo/.test(o.h)) { const c = card('<div class="row between gap wrap"><div><h3>📄 Reporte para tutoría</h3><p class="muted small">Una hoja del grupo: parciales, alerta temprana, riesgo de reprobar, cambios y temas que cuestan.</p></div>' + btn('🖨 Imprimir', 'sv-rep', '', 'small primary') + '</div>'); const i = o.h.indexOf('</section>'); o.h = i > 0 ? o.h.slice(0, i + 10) + c + o.h.slice(i + 10) : o.h + c; } return o; }; }
})();

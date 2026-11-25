/* Escuadra · v1.43.0
   1) Cierre de semestre en un botón: los pasos del cierre en orden (con enlace a cada herramienta y palomita), la tabla
      final del semestre (parciales oficiales, suma contra la meta, final, asistencia y estatus), quién va a extraordinario
      y por qué, y la tabla para imprimir o descargar (CSV que abre Excel).
   2) Copiar a otro grupo: las actividades de cada parcial (sin calificaciones, con las fechas recorridas al calendario del
      grupo destino), los exámenes recomendados y el horario, para no volver a capturar el semestre siguiente.
   3) Alerta temprana: junta calificación, puntos del semestre, faltas (y si faltó seguido), pendientes, si bajó contra el
      parcial anterior, suspensión y lo que salió en Conócete, en un semáforo por alumno con sus razones y qué hacer. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const activos = g => D.alumnos(g).filter(a => a.activo !== false);
  const descarga = (nombre, txt, tipo) => { const b = new Blob(['﻿' + txt], { type: tipo || 'text/csv;charset=utf-8' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = nombre; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); };
  const csv = rows => rows.map(r => r.map(x => { const s = x == null ? '' : String(x); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',')).join('\r\n');

  /* ================= 1) CIERRE DE SEMESTRE ================= */
  const FS = E.finsem = {}, KF = g => 'finsem:' + g.id;
  FS.PASOS = [
    ['pend', '📝 Revisa pendientes del último parcial', 'Quién debe qué y cuánto le sube si lo entrega.', 'aprobar'],
    ['pre', '✅ Pre-cierre del último parcial', 'La lista exacta de lo que falta para que el acta salga completa.', 'precierre'],
    ['cerrar', '🔒 Cierra el último parcial', 'Guarda la foto de las calificaciones tal como las entregas (en Pre-cierre).', 'precierre'],
    ['acta', '📄 Acta y listas en los formatos de la escuela', 'El Excel del acta y las listas de asistencia, llenos y sin cambiar formato.', 'imprimir'],
    ['plat', '🌐 Sube las calificaciones a la plataforma', 'En el día que indique control escolar. Mínima 5, sin decimales, sin espacios en blanco y nunca 0.', null],
    ['faltas', '📨 Manda el Excel de faltas a control escolar', 'Las faltas van solo en el Excel.', null],
    ['ext', '📚 Avisa a los de extraordinario', 'Más abajo está la lista con lo que le faltó a cada quien.', null],
    ['ct', '📊 Reporte para el consejo técnico', 'Avance del grupo con datos.', 'consejo'],
    ['const', '🏅 Constancias y reconocimientos', 'Para los que destacaron.', 'constancias'],
    ['resp', '💾 Respaldo de tus datos', 'Descarga un respaldo antes de cambiar de semestre.', 'ajustes'],
    ['sem', '➡️ Pasa al siguiente semestre', 'Archiva el grupo con su historial y crea el nuevo con los mismos alumnos.', 'semestre']
  ];
  FS.doc = g => S.get(KF(g)) || { hechos: {} };
  FS.fila = (g, a) => { const r = C.finalSem(g, a.id), ps = D.parciales(); let ses = 0, as = 0; ps.forEach(p => { const x = C.asis(g, p, a.id); ses += x.ses; as += x.a; });
    const of = r.parciales.map(v => v == null ? null : C.oficial(v));
    const est = !r.completo ? 'inc' : r.aprobado ? 'ok' : 'ext';
    return { a: a, of: of, suma: r.suma, meta: r.meta, faltan: r.faltan, final: r.final == null ? null : C.oficial(r.final), asis: ses ? Math.round(as / ses * 100) : null, est: est }; };
  FS.tabla = g => activos(g).map(a => FS.fila(g, a));
  const EST = { ok: ['Aprobado', 'ok'], ext: ['Extraordinario', 'bad'], inc: ['Incompleto', 'warn'] };
  V.finsem = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = activos(g); if (!al.length) return H.needAlumnos('Cierre de semestre');
    const ps = D.parciales(), T = FS.tabla(g), d = FS.doc(g), n = k => T.filter(x => x.est === k).length, hechos = FS.PASOS.filter(p => d.hechos[p[0]]).length;
    let h = card('<h3>🎓 Cierre de semestre · ' + esc(g.nombre) + '</h3><p class="small">' + ps.length + ' parciales · para aprobar se juntan <b>' + (C.min10() * ps.length) + ' puntos</b> (mínimo ' + C.min10() + ' de promedio). La final es el promedio de las calificaciones oficiales.</p>' +
      '<div class="fs-kpi"><div class="ok"><b>' + n('ok') + '</b><span>Aprobados</span></div><div class="bad"><b>' + n('ext') + '</b><span>Extraordinario</span></div><div class="warn"><b>' + n('inc') + '</b><span>Incompletos</span></div><div><b>' + hechos + '/' + FS.PASOS.length + '</b><span>Pasos</span></div></div>' +
      '<div class="row gap wrap mt">' + btn('🖨 Tabla final', 'fs-imp', '', 'primary') + btn('⬇️ Descargar para Excel', 'fs-csv', '', '') + '</div><p class="muted small">«Incompleto» = le falta calificación en algún parcial (todavía no se puede saber).</p>');
    h += card('<h3>Pasos del cierre</h3><ul class="plain fs-pasos">' + FS.PASOS.map((p, i) => '<li><label class="ck"><input type="checkbox" data-ch="fs-paso" data-k="' + p[0] + '"' + (d.hechos[p[0]] ? ' checked' : '') + '><span><b>' + (i + 1) + '. ' + esc(p[1]) + '</b><br><small class="muted">' + esc(p[2]) + '</small></span></label>' + (p[3] ? link('Abrir', p[3], 'small') : '') + '</li>').join('') + '</ul>');
    const ext = T.filter(x => x.est === 'ext').sort((x, y) => y.faltan - x.faltan);
    if (ext.length) h += card('<h3>📚 Van a extraordinario (' + ext.length + ')</h3><ul class="ap-list">' + ext.map(x => '<li><div><a href="#/alumno/' + x.a.id + '"><b>' + x.a.num + '. ' + esc(x.a.nombre) + '</b></a><br><small class="muted">Juntó ' + x.suma + ' de ' + x.meta + ' (le faltaron ' + x.faltan + ') · parciales ' + x.of.map(v => v == null ? '—' : v).join(', ') + (x.asis != null ? ' · asistencia ' + x.asis + ' %' : '') + '</small></div></li>').join('') + '</ul>');
    h += card('<h3>Tabla final</h3><div class="tbl-wrap"><table class="fs-t"><thead><tr><th>No.</th><th>Alumno</th>' + ps.map(p => '<th>' + esc(p.nombre.replace(' parcial', '')) + '</th>').join('') + '<th>Suma</th><th>Final</th><th>Asist.</th><th>Estatus</th></tr></thead><tbody>' +
      T.map(x => '<tr><td>' + x.a.num + '</td><td><a href="#/alumno/' + x.a.id + '">' + esc(u.corto(x.a.nombre)) + '</a></td>' + x.of.map(v => '<td class="' + (v != null && v < C.min10() ? 'fs-baja' : '') + '">' + (v == null ? '—' : v) + '</td>').join('') + '<td>' + x.suma + '/' + x.meta + '</td><td><b>' + (x.final == null ? '—' : x.final) + '</b></td><td>' + (x.asis == null ? '—' : x.asis + '%') + '</td><td><span class="chip ' + EST[x.est][1] + '">' + EST[x.est][0] + '</span></td></tr>').join('') + '</tbody></table></div>');
    return { t: 'Cierre de semestre', h: h };
  };
  CH['fs-paso'] = el => { const g = D.grupoActual(); S.update(KF(g), d => { d.hechos = d.hechos || {}; if (el.checked) d.hechos[el.dataset.k] = u.today(); else delete d.hechos[el.dataset.k]; }, { hechos: {} }); };
  A['fs-csv'] = () => { const g = D.grupoActual(), ps = D.parciales(), T = FS.tabla(g);
    descarga('Cierre-semestre-' + String(g.nombre).replace(/[^\w]+/g, '') + '.csv', csv([['No.', 'Alumno'].concat(ps.map(p => p.nombre), ['Suma', 'Meta', 'Final', 'Asistencia %', 'Estatus'])].concat(T.map(x => [x.a.num, x.a.nombre].concat(x.of, [x.suma, x.meta, x.final, x.asis, EST[x.est][0]])))));
    u.toast('Descargado: ábrelo con Excel', 'ok'); };
  A['fs-imp'] = () => { const g = D.grupoActual(), ps = D.parciales(), T = FS.tabla(g), cf = D.cfg();
    E.print.run('<div class="pr fs-pr"><h2>Calificaciones finales del semestre</h2><p class="fs-sub">' + esc((cf.plantel || 'CETAC 19') + ' · Grupo ' + g.nombre + (g.modulo ? ' · ' + g.modulo : '') + ' · ' + u.fLarga(u.today())) + '</p><table class="fs-t"><thead><tr><th>No.</th><th>Alumno</th>' + ps.map(p => '<th>' + esc(p.nombre) + '</th>').join('') + '<th>Suma</th><th>Final</th><th>Asistencia</th><th>Estatus</th></tr></thead><tbody>' +
      T.map(x => '<tr><td>' + x.a.num + '</td><td style="text-align:left">' + esc(x.a.nombre) + '</td>' + x.of.map(v => '<td>' + (v == null ? '—' : v) + '</td>').join('') + '<td>' + x.suma + '/' + x.meta + '</td><td><b>' + (x.final == null ? '—' : x.final) + '</b></td><td>' + (x.asis == null ? '—' : x.asis + ' %') + '</td><td>' + EST[x.est][0] + '</td></tr>').join('') + '</tbody></table><p class="fs-sub">Aprueba quien junta ' + (C.min10() * ps.length) + ' puntos entre los ' + ps.length + ' parciales. Aprobados: ' + T.filter(x => x.est === 'ok').length + ' · Extraordinario: ' + T.filter(x => x.est === 'ext').length + ' · Incompletos: ' + T.filter(x => x.est === 'inc').length + '</p><p class="fs-firma">' + esc(cf.docente || '') + '<br>Docente</p></div>', { title: 'Cierre de semestre · ' + g.nombre }); };

  /* ================= 2) COPIAR A OTRO GRUPO ================= */
  const CP = E.copiarSem = {};
  CP.parcs = g => (g && g.archivado && Array.isArray(g.parciales) && g.parciales.length ? g.parciales : null) || S.get('parciales') || E.DEFAULTS.parciales;
  const QUITA = ['notas', 'extra', 'entregas', 'obs', 'examen', 'bita', 'mod', 'tarde', 'revisado', 'excusas'];
  CP.plan = (gs, gd, op) => {
    const ps = CP.parcs(gs), pd = CP.parcs(gd), out = { acts: [], exas: [], horario: false, omitidas: 0 };
    const yaD = {}; S.list('act:' + gd.id + ':').forEach(a => { if (a) yaD[a.parcial + '|' + String(a.nombre || '').trim().toLowerCase()] = 1; });
    if (op.acts) S.list('act:' + gs.id + ':').filter(a => a && a.id).forEach(a => { const i = ps.findIndex(p => p.id === a.parcial); if (i < 0 || !pd[i]) return; if (a.bita) return;
      const key = pd[i].id + '|' + String(a.nombre || '').trim().toLowerCase(); if (yaD[key]) { out.omitidas++; return; } yaD[key] = 1;
      const n = Object.assign({}, a); QUITA.forEach(k => { delete n[k]; }); n.id = u.uid('act'); n.parcial = pd[i].id; n.notas = {};
      if (a.fecha) { const f = u.addDays(pd[i].inicio, Math.max(0, u.diffDays(ps[i].inicio, a.fecha))); n.fecha = f > pd[i].fin ? pd[i].fin : f; }
      out.acts.push(n); });
    if (op.exas) S.list('exa:' + gs.id + ':').filter(x => x && x.id).forEach(x => { const i = ps.findIndex(p => p.id === x.parcial); if (i < 0 || !pd[i]) return; const n = JSON.parse(JSON.stringify(x)); n.id = u.uid('exa'); n.parcial = pd[i].id; n.res = {}; delete n.actId; n.creado = new Date().toISOString(); n.fecha = n.fecha ? u.addDays(pd[i].inicio, Math.max(0, u.diffDays(ps[i].inicio, x.fecha))) : n.fecha; out.exas.push(n); });
    if (op.horario && (gs.horario || []).length) out.horario = true;
    return out; };
  const est = () => (E.ui.cps = E.ui.cps || { src: '', dst: '', acts: true, exas: true, horario: false });
  V.copiar = () => {
    const gs = D.grupos(); if (gs.length < 2) return { t: 'Copiar a otro grupo', h: card('<h3>📋 Copiar a otro grupo</h3><p class="small">Necesitas al menos 2 grupos (por ejemplo, el de este semestre y el nuevo). Crea el nuevo en ' + link('Mis grupos', 'grupos', 'small') + ' o con ' + link('Cambio de semestre', 'semestre', 'small') + '.</p>') };
    const s = est(), g0 = D.grupoActual(); if (!s.src) s.src = (gs.find(x => x.archivado) || g0 || gs[0]).id; if (!s.dst || s.dst === s.src) s.dst = (gs.find(x => !x.archivado && x.id !== s.src) || gs.find(x => x.id !== s.src)).id;
    const src = D.grupo(s.src), dst = D.grupo(s.dst), pl = src && dst ? CP.plan(src, dst, s) : null;
    const opt = (id, sel) => gs.map(x => '<option value="' + x.id + '"' + (x.id === sel ? ' selected' : '') + '>' + esc((x.nombre || x.id) + (x.archivado ? ' (archivado)' : '')) + '</option>').join('');
    let h = card('<h3>📋 Copiar el semestre a otro grupo</h3><p class="small">Pasa lo que ya armaste a otro grupo o al semestre nuevo, sin calificaciones y con las fechas acomodadas a sus parciales.</p>' +
      '<div class="fgrid"><label class="fld"><span>Copiar desde</span><select class="inp" data-ch="cps" data-k="src">' + opt('src', s.src) + '</select></label><label class="fld"><span>Hacia</span><select class="inp" data-ch="cps" data-k="dst">' + opt('dst', s.dst) + '</select></label></div>' +
      '<label class="ck"><input type="checkbox" data-ch="cps" data-k="acts"' + (s.acts ? ' checked' : '') + '><span>Actividades de cada parcial (nombre, categoría, peso, puntos e instrumento)</span></label>' +
      '<label class="ck"><input type="checkbox" data-ch="cps" data-k="exas"' + (s.exas ? ' checked' : '') + '><span>Exámenes recomendados (sus preguntas)</span></label>' +
      '<label class="ck"><input type="checkbox" data-ch="cps" data-k="horario"' + (s.horario ? ' checked' : '') + '><span>Horario (reemplaza el del grupo destino)</span></label>');
    if (s.src === s.dst) h += card('<p class="small">Elige dos grupos distintos.</p>');
    else if (pl) { const porP = {}; pl.acts.forEach(a => { porP[a.parcial] = (porP[a.parcial] || 0) + 1; }); const pd = CP.parcs(dst);
      h += card('<h3>Se va a copiar</h3><ul class="small">' + (s.acts ? '<li><b>' + pl.acts.length + ' actividades</b>: ' + pd.map(p => esc(p.nombre) + ' ' + (porP[p.id] || 0)).join(' · ') + (pl.omitidas ? ' <span class="muted">(' + pl.omitidas + ' ya existían y se saltan)</span>' : '') + '</li>' : '') + (s.exas ? '<li><b>' + pl.exas.length + ' exámenes</b> recomendados</li>' : '') + (pl.horario ? '<li>El horario de ' + esc(src.nombre) + '</li>' : '') + '</ul><p class="muted small">No se copian calificaciones, entregas ni asistencia. Las bitácoras semanales se crean solas en el grupo nuevo. Las fechas se recorren a los parciales del grupo destino (revísalas en Calificaciones).</p>' +
        btn('📋 Copiar a ' + esc(dst.nombre), 'cps-ok', '', 'primary')); }
    return { t: 'Copiar a otro grupo', h: h };
  };
  CH['cps'] = el => { const s = est(), k = el.dataset.k; s[k] = el.type === 'checkbox' ? el.checked : el.value; if (E.render) E.render(); };
  A['cps-ok'] = () => { const s = est(), src = D.grupo(s.src), dst = D.grupo(s.dst); if (!src || !dst || src.id === dst.id) return; const pl = CP.plan(src, dst, s);
    if (!pl.acts.length && !pl.exas.length && !pl.horario) { u.toast('No hay nada nuevo que copiar', 'err'); return; }
    if (!confirm('¿Copiar ' + pl.acts.length + ' actividades y ' + pl.exas.length + ' exámenes a ' + dst.nombre + '?')) return;
    pl.acts.forEach(a => S.put('act:' + dst.id + ':' + a.id, a, { silent: true })); pl.exas.forEach(x => S.put('exa:' + dst.id + ':' + x.id, x, { silent: true }));
    if (pl.horario) S.update('grupo:' + dst.id, gr => { gr.horario = JSON.parse(JSON.stringify(src.horario)); });
    u.toast('Listo: copiado a ' + dst.nombre, 'ok'); if (E.render) E.render(); };
  if (V.grupos) { const vg = V.grupos; V.grupos = function () { const o = vg.apply(null, arguments); if (o && o.h && D.grupos().length > 1) o.h += card('<p class="small">📋 ¿Ya tienes el grupo nuevo? ' + link('Copia las actividades y exámenes de otro grupo', 'copiar', 'small') + '</p>'); return o; }; }

  /* ================= 3) ALERTA TEMPRANA ================= */
  const AT = E.alerta = {};
  AT.eval = (g, a, pid) => {
    const ps = D.parciales(), i = ps.findIndex(p => p.id === pid), p = ps[i], m10 = C.min10(), R = []; let pts = 0;
    const add = (n, t, tipo) => { pts += n; R.push({ t: t, tipo: tipo, n: n }); };
    const k = C.cal(g, pid, a.id), of = k.final == null ? null : C.oficial(k.final);
    if (of != null && of < m10) add(3, 'Va con ' + of + ' en el parcial', 'cal'); else if (of != null && of === m10) add(1, 'Va justo con ' + of, 'cal');
    if (i > 0) { const prev = C.cal(g, ps[i - 1].id, a.id).final; if (prev != null && of != null && C.oficial(prev) - of >= 2) add(1, 'Bajó de ' + C.oficial(prev) + ' a ' + of, 'cal'); }
    if (i === ps.length - 1 && ps.length > 1) { let sum = 0, n = 0; ps.slice(0, -1).forEach(q => { const v = C.cal(g, q.id, a.id).final; if (v != null) { sum += C.oficial(v); n++; } }); if (n === ps.length - 1) { const nec = m10 * ps.length - sum; if (nec > 10) add(3, 'Ya no le alcanza para el semestre (necesitaría ' + nec + ')', 'sem'); else if (nec >= 9) add(2, 'Necesita ' + nec + ' en este parcial para el semestre', 'sem'); } }
    const as = C.asis(g, p, a.id); if (as.ses) { if (as.pct < 80) add(2, 'Asistencia de ' + Math.round(as.pct) + ' %', 'asis'); else if (as.pct < 90) add(1, 'Asistencia de ' + Math.round(as.pct) + ' %', 'asis'); if (as.racha >= 2) add(2, 'Faltó sus últimas ' + as.racha + ' clases', 'asis'); }
    const an = E.aprobar ? E.aprobar.analiza(g, pid, a.id) : null, np = an ? an.pend.length : 0; if (np >= 3) add(2, np + ' pendientes', 'pend'); else if (np) add(1, np + ' pendiente' + (np > 1 ? 's' : ''), 'pend');
    if (E.susp && E.susp.en(g.id, a.id, u.today())) add(1, 'Está suspendido', 'susp');
    if (E.conoce) { const r = E.conoce.res(g, a.id); let c = 0; Object.keys(r).forEach(t => { if (c < 2) E.conoce.alertas(t, r[t].s).forEach(x => { if (c < 2) { add(1, x, 'cono'); c++; } }); }); }
    const nivel = pts >= 5 ? 'rojo' : pts >= 2 ? 'amarillo' : 'verde';
    return { a: a, pts: pts, nivel: nivel, R: R, of: of, np: np, as: as };
  };
  AT.QUE = { cal: '📝 Repasa con él lo que más pesa y dale una tarea de recuperación', sem: '🧮 Platica con él y sus papás sobre el extraordinario a tiempo', asis: '📞 Avisa a sus papás de las faltas', pend: '📋 Dale su lista de pendientes (Para aprobar)', susp: '🚫 Al regresar, ponte al día con él', cono: '🔒 Platica en privado (lo que salió en Conócete)' };
  AT.grupo = (g, pid) => activos(g).map(a => AT.eval(g, a, pid)).sort((x, y) => y.pts - x.pts);
  const filaA = x => { const que = []; x.R.forEach(r => { const q = AT.QUE[r.tipo]; if (q && que.indexOf(q) < 0) que.push(q); });
    return '<li class="at-' + x.nivel + '"><div><a href="#/alumno/' + x.a.id + '"><b>' + x.a.num + '. ' + esc(x.a.nombre) + '</b></a><div class="at-r">' + x.R.map(r => '<span class="chip">' + esc(r.t) + '</span>').join('') + '</div>' + (que.length ? '<small class="muted">' + que.map(esc).join(' · ') + '</small>' : '') + '</div>' + (x.R.some(r => r.tipo === 'asis' || r.tipo === 'sem' || r.tipo === 'cal') ? btn('💬 Papás', 'at-wa', 'data-aid="' + x.a.id + '"', 'small ghost') : '') + '</li>'; };
  V.alerta = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!activos(g).length) return H.needAlumnos('Alerta temprana');
    const p = C.parcialActual(), L = AT.grupo(g, p.id), rj = L.filter(x => x.nivel === 'rojo'), am = L.filter(x => x.nivel === 'amarillo'), vd = L.filter(x => x.nivel === 'verde');
    let h = card('<h3>🚨 Alerta temprana · ' + esc(p.nombre) + '</h3><p class="small">Junta en un solo semáforo la calificación, los puntos del semestre, las faltas, los pendientes, si bajó, la suspensión y Conócete. Sirve para actuar <b>antes</b> de que repruebe.</p><div class="fs-kpi"><div class="bad"><b>' + rj.length + '</b><span>Rojo</span></div><div class="warn"><b>' + am.length + '</b><span>Amarillo</span></div><div class="ok"><b>' + vd.length + '</b><span>Verde</span></div></div>');
    if (rj.length) h += card('<h3>🔴 Atiéndelos esta semana (' + rj.length + ')</h3><ul class="ap-list at-list">' + rj.map(filaA).join('') + '</ul>');
    if (am.length) h += card('<h3>🟡 Vigílalos (' + am.length + ')</h3><ul class="ap-list at-list">' + am.map(filaA).join('') + '</ul>');
    h += card('<h3>🟢 Van bien (' + vd.length + ')</h3><p class="small">' + (vd.length ? vd.map(x => x.a.num + '. ' + esc(u.corto(x.a.nombre))).join(' · ') : '—') + '</p>');
    h += card('<p class="muted small">Cómo se calcula: va abajo del mínimo (+3), ya no le alcanza el semestre (+3), asistencia menor a 80 % (+2) o a 90 % (+1), faltó 2 clases seguidas o más (+2), 3 o más pendientes (+2), bajó 2 puntos o más (+1), suspendido (+1) y alertas de Conócete (+1 c/u, máximo 2). Rojo con 5 o más; amarillo con 2 a 4. Es una guía para priorizar, no una etiqueta.</p>');
    return { t: 'Alerta temprana', h: h };
  };
  A['at-wa'] = async el => { const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid), p = C.parcialActual(); if (!a || !E.casa) return; const x = AT.eval(g, a, p.id), url = await E.casa.consultaURL(g, a, p.id);
    const motivos = x.R.filter(r => r.tipo !== 'cono' && r.tipo !== 'susp').map(r => r.t.toLowerCase()).join(', ');
    const txt = 'Buen día. Le escribe ' + (D.cfg().docente || 'el docente') + ', de Técnico en Mecatrónica, grupo ' + g.nombre + '. Le aviso con tiempo para apoyar a ' + u.corto(a.nombre) + ' en el ' + p.nombre + ': ' + motivos + '. Aquí puede ver su avance y lo que le falta: ' + url + ' Todavía está a tiempo; con su apoyo en casa lo sacamos adelante. Quedo a sus órdenes.';
    window.open(E.casa.wa(a, txt), '_blank'); };
  if (V.inicio) { const vi = V.inicio; V.inicio = function () { const o = vi.apply(null, arguments), g = D.grupoActual(); if (!o || !o.h || !g || !activos(g).length) return o;
    try { const L = AT.grupo(g, C.parcialActual().id).filter(x => x.nivel === 'rojo'); if (L.length) o.h += card('<p class="small">🚨 <b>Alerta temprana:</b> ' + L.length + ' alumno' + (L.length > 1 ? 's' : '') + ' en rojo (' + L.slice(0, 3).map(x => esc(u.corto(x.a.nombre))).join(', ') + (L.length > 3 ? '…' : '') + '). ' + link('Ver', 'alerta', 'small') + '</p>'); } catch (e) { }
    return o; }; }
})();

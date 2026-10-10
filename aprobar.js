/* Escuadra · ¿Qué le falta para aprobar? y hoja para padres.
   Para cada alumno: lo pendiente (actividades vencidas, tareas de libreta, prácticas de FreeCAD) y cuánto subiría su
   calificación del parcial si lo entrega, con tus ponderaciones; si el examen aún no se aplica, cuánto necesita sacar.
   Lo entregado tarde vale lo que elijas (100 %, 80 % o 60 %). Solo datos escolares. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const AP = E.aprobar = {};
  const minA = () => Number(D.cfg().minAprob) || 60;
  const fac = () => { const v = Number(D.cfg().tardeValor); return v > 0 && v <= 1 ? v : 1; };
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  const R1 = v => Math.round(v * 10) / 10;
  const KEYS = ['examen', 'trabajos', 'asistencia', 'participacion'];
  const LBL = { examen: 'Examen', trabajos: 'Libreta, proyecto y bitácora', asistencia: 'Asistencia', participacion: 'Participación' };

  /* ---------- cálculo con valores supuestos (misma fórmula que Calificaciones) ---------- */
  const promCat = (g, pid, cat, aid, ov) => {
    const c = D.cfg(), as = C.acts(g, pid).filter(a => a.categoria === cat && a.cuenta !== false); if (!as.length) return null;
    let sw = 0, s = 0; const hoy = u.today();
    as.forEach(a => { const w = Number(a.peso || 1); let v = ov && ov[a.id] != null ? ov[a.id] : C.nota(a, aid); if (v == null) { if (!c.vaciasCero || !a.fecha || a.fecha >= hoy) return; v = 0; } s += v * w; sw += w; });
    return sw ? s / sw : null;
  };
  AP.comps = (g, pid, aid, ov) => { const k = C.cal(g, pid, aid); return { examen: promCat(g, pid, 'examen', aid, ov), trabajos: promCat(g, pid, 'trabajos', aid, ov), asistencia: k.comp.asistencia, participacion: k.comp.participacion }; };
  AP.final = cp => { const w = D.cfg().pond; let s = 0, sw = 0; KEYS.forEach(k => { const x = Number(w[k] || 0); if (!x || cp[k] == null) return; s += cp[k] * x; sw += x; }); return sw ? s / sw : null; };
  // calificación mínima de examen para llegar al aprobatorio con lo demás como va
  AP.necesita = cp => { const w = D.cfg().pond, we = Number(w.examen || 0); if (!we || cp.examen != null) return null; let s = 0, sw = 0; KEYS.forEach(k => { if (k === 'examen') return; const x = Number(w[k] || 0); if (!x || cp[k] == null) return; s += cp[k] * x; sw += x; }); return Math.max(0, Math.ceil((minA() * (we + sw) - s) / we)); };

  AP.analiza = (g, pid, aid) => {
    const k = C.cal(g, pid, aid); if (k.manual) return null;
    const hoy = u.today(), f = fac(), out = [], todo = {}, cp0 = AP.comps(g, pid, aid, {});
    // si el examen aún no se aplica, lo que sube cada pendiente se calcula ya con el examen contando (su valor no cambia la diferencia)
    const exPend = cp0.examen == null && Number(D.cfg().pond.examen || 0) > 0, fill = cp => exPend ? Object.assign({}, cp, { examen: 70 }) : cp;
    const base = AP.final(fill(cp0)), gan = ov => { const v = AP.final(fill(AP.comps(g, pid, aid, ov))); return v == null || base == null ? null : v - base; };
    const lib = E.libreta ? E.libreta.doc(g, pid) : {}, fcd = E.fc && E.fc.rev ? E.fc.rev(g, pid) : {};
    // actividades vencidas sin calificación o con cero
    C.acts(g, pid).filter(a => (a.categoria === 'examen' || a.categoria === 'trabajos') && a.cuenta !== false && a.id !== lib.actId && a.id !== fcd.actId).forEach(a => {
      const v = C.nota(a, aid), venc = a.fecha && a.fecha < hoy; if (!((v == null && venc) || v === 0)) return;
      const nv = 100 * f; todo[a.id] = nv;
      out.push({ tipo: a.categoria === 'examen' ? 'Examen' : 'Trabajo', t: a.nombre + (a.fecha ? ' (' + u.fCorta(a.fecha) + ')' : ''), det: v === 0 ? 'Calificado con 0: entrégalo o preséntalo de nuevo.' : 'No está entregado.', gain: gan({ [a.id]: nv }) });
    });
    // tareas de libreta incompletas o no entregadas
    if (lib.actId && S.get('act:' + g.id + ':' + lib.actId)) {
      const ts = E.libreta.tareas(g, pid).cuentan, m = ((lib.marcas || {})[aid]) || {}, fal = [];
      ts.forEach((t, i) => { if (Number(m[t.key]) !== 2) fal.push({ n: 'T' + (i + 1), t: t.t, inc: Number(m[t.key]) === 1 }); });
      if (fal.length && ts.length) {
        const sNew = ts.reduce((s, t) => s + (Number(m[t.key]) === 2 ? 2 : Math.max(Number(m[t.key]) || 0, 2 * f)), 0), nv = Math.round(sNew / (2 * ts.length) * 100);
        todo[lib.actId] = nv;
        out.push({ tipo: 'Libreta', t: fal.length + (fal.length === 1 ? ' tarea por completar' : ' tareas por completar'), det: fal.map(x => x.n + ' ' + corto(x.t, 70) + (x.inc ? ' (incompleta)' : '')).join(' · '), gain: gan({ [lib.actId]: nv }) });
      }
    }
    // prácticas de FreeCAD pendientes, a medias o no hechas
    if (fcd.actId && S.get('act:' + g.id + ':' + fcd.actId)) {
      const ids = fcd.orden || [], m = ((fcd.marcas || {})[aid]) || {}, fal = ids.filter(id => Number(m[id]) !== 2);
      if (fal.length && ids.length) {
        const nv = Math.round(ids.reduce((s, id) => s + (Number(m[id]) === 2 ? 2 : Math.max(Number(m[id]) || 0, 2 * f)), 0) / (2 * ids.length) * 100);
        todo[fcd.actId] = nv;
        out.push({ tipo: 'FreeCAD', t: fal.length + (fal.length === 1 ? ' práctica por terminar' : ' prácticas por terminar'), det: fal.map(id => ((E.fc.get(id) || {}).t || id) + (m[id] == null ? ' (pendiente)' : Number(m[id]) === 1 ? ' (a medias)' : ' (no la hizo)')).join(' · '), gain: gan({ [fcd.actId]: nv }) });
      }
    }
    out.sort((a, b) => (b.gain || 0) - (a.gain || 0));
    const cpTodo = AP.comps(g, pid, aid, todo), cpHoy = AP.comps(g, pid, aid, {});
    return { k: k, base: base, final: k.final, pend: out, exPend: exPend, todo: Object.keys(todo).length && !exPend ? AP.final(cpTodo) : null, nec: AP.necesita(cpHoy), necTodo: Object.keys(todo).length ? AP.necesita(cpTodo) : null, aprueba: k.final != null && k.final >= minA(), cp: cpHoy };
  };
  const chipCal = v => v == null ? '<span class="g na">—</span>' : '<span class="g ' + H.gclass(v) + '">' + Math.round(v) + '</span>';
  const necTu = n => n > 100 ? 'Aunque saques 100 en el examen no te alcanza con lo que llevas: entrega lo pendiente.' : n <= 0 ? 'Con lo que llevas ya apruebas, pero presenta el examen.' : 'En el examen necesitas al menos <b>' + n + '</b>.';
  const necTxt = n => n == null ? '' : n > 100 ? 'Aunque saque 100 en el examen no le alcanza con lo que lleva: necesita entregar lo pendiente.' : n <= 0 ? 'Con lo que lleva ya aprueba aunque el examen salga bajo (pero que lo presente).' : 'Necesita al menos <b>' + n + '</b> en el examen.';

  /* ---------- ficha del alumno ---------- */
  AP.alumnoHTML = (g, a) => {
    const p = C.parcialActual(), r = p && AP.analiza(g, p.id, a.id); if (!r) return '';
    const btns = '<div class="row gap wrap mt">' + btn('🖨 Mi plan para aprobar', 'ap-plan', 'data-aid="' + a.id + '" data-pid="' + p.id + '"', 'small') + btn('🖨 Hoja para padres', 'ap-padres', 'data-aid="' + a.id + '" data-pid="' + p.id + '"', 'small') + (E.retro ? btn('💬 Retroalimentación', 'rt-open', 'data-aid="' + a.id + '" data-ctx="actitud"', 'small') : '') + '</div>';
    if (!r.pend.length && r.nec == null) return card('<h3>🎯 ' + esc(p.nombre) + ': ' + (r.final == null ? 'sin calificación todavía' : r.aprueba ? 'va aprobando' : 'va abajo de ' + minA()) + '</h3><p class="small">' + (r.final != null ? 'Calificación actual: ' + chipCal(r.final) + '. ' : '') + 'No tiene pendientes registrados.</p>' + btns);
    return card('<h3>🎯 ¿Qué le falta para aprobar? · ' + esc(p.nombre) + '</h3><p class="small">Va en ' + chipCal(r.final) + (r.k.enCurso ? ' (en curso)' : '') + ' · aprobatorio ' + minA() + (r.todo != null ? ' · si entrega todo: ' + chipCal(r.todo) : '') + '</p>' +
      (r.pend.length ? '<ul class="ap-pend">' + r.pend.map(x => '<li><span><b>' + esc(x.tipo) + ':</b> ' + esc(x.t) + '<br><small class="muted">' + esc(x.det) + '</small></span>' + (x.gain != null ? '<span class="chip ok">+' + R1(x.gain) + '</span>' : '') + '</li>').join('') + '</ul>' : '') +
      (r.nec != null ? '<p class="note small">' + necTxt(r.nec) + (r.necTodo != null && r.necTodo !== r.nec && r.pend.length ? ' Si entrega lo pendiente: ' + (r.necTodo > 100 ? 'aún no alcanza.' : r.necTodo <= 0 ? 'ya no depende del examen.' : 'basta con ' + r.necTodo + '.') : '') + '</p>' : '') +
      '<p class="muted small">«+» = cuánto sube su calificación del parcial. Lo entregado tarde vale ' + Math.round(fac() * 100) + ' % (cámbialo en Más → Para aprobar).</p>' + btns);
  };

  /* ---------- vista del grupo ---------- */
  V.aprobar = pid => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Para aprobar');
    const ps = D.parciales(); pid = ps.some(p => p.id === pid) ? pid : C.parcialActual().id; const p = C.parcial(pid), mn = minA();
    const rs = al.map(a => ({ a: a, r: AP.analiza(g, pid, a.id) })).filter(x => x.r && x.r.final != null);
    // sin examen todavía: se ordena por cuánto necesitan sacar en el examen (más de 80 = abajo, de 61 a 80 = en la orilla)
    const nivel = r => r.exPend && r.nec != null ? (r.nec > 80 ? 'abajo' : r.nec > mn ? 'orilla' : 'ok') : (r.final < mn ? 'abajo' : r.final < mn + 5 ? 'orilla' : 'ok');
    const orden = (a, b) => (b.r.exPend ? b.r.nec : -b.r.final) - (a.r.exPend ? a.r.nec : -a.r.final);
    const abajo = rs.filter(x => nivel(x.r) === 'abajo').sort(orden), cerca = rs.filter(x => nivel(x.r) === 'orilla').sort(orden), exP = rs.some(x => x.r.exPend);
    let h = '<div class="filters">' + ps.map(x => '<a class="tab ' + (x.id === pid ? 'on' : '') + '" href="#/aprobar/' + x.id + '">' + esc(x.nombre) + '</a>').join('') + '</div>';
    h += card('<h3>🎯 Para aprobar · ' + esc(p.nombre) + '</h3><p class="muted small">Quién va abajo de ' + mn + ', qué le falta y cuánto sube si lo entrega, con tus ponderaciones. Dale a cada uno su plan impreso en privado: saber exactamente qué hacer motiva más que «échale ganas».</p>' +
      '<div class="row gap wrap"><label class="fld"><span>Lo entregado tarde vale</span><select data-ch="ap-fac">' + [[1, '100 %'], [0.8, '80 %'], [0.6, '60 %']].map(o => '<option value="' + o[0] + '"' + (fac() === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label></div>' +
      '<p class="small"><b>' + abajo.length + '</b> abajo · <b>' + cerca.length + '</b> en la orilla · ' + (rs.length - abajo.length - cerca.length) + ' bien</p>' + (exP ? '<p class="note small">El examen aún no se aplica: «abajo» = necesita más de 80 en el examen (o no le alcanza); «en la orilla» = necesita de ' + (mn + 1) + ' a 80.</p>' : '') +
      '<div class="row gap wrap">' + (abajo.length ? btn('🖨 Planes de los que van abajo', 'ap-plan-todos', 'data-pid="' + pid + '"', 'primary') : '') + btn('🖨 Hojas para padres (todo el grupo)', 'ap-padres-todos', 'data-pid="' + pid + '"') + '</div>');
    const fila = x => { const r = x.r; return '<li><div><a href="#/alumno/' + x.a.id + '"><b>' + x.a.num + '. ' + esc(x.a.nombre) + '</b></a><br><small class="muted">' + (r.pend.length ? r.pend.slice(0, 3).map(y => esc(y.tipo + ': ' + y.t) + (y.gain != null ? ' (+' + R1(y.gain) + ')' : '')).join(' · ') : 'Sin pendientes registrados') + (r.nec != null ? ' · examen: ' + (r.nec > 100 ? 'no le alcanza solo con examen' : 'necesita ' + Math.max(0, r.nec)) : '') + '</small></div><div class="ap-r">' + chipCal(r.final) + (r.todo != null ? '<small>→ ' + Math.round(r.todo) + '</small>' : '') + btn('🖨', 'ap-plan', 'data-aid="' + x.a.id + '" data-pid="' + pid + '" aria-label="Imprimir plan"', 'small ghost') + '</div></li>'; };
    h += card('<h3>🔴 ' + (exP ? 'Abajo' : 'Abajo de ' + mn) + '</h3>' + (abajo.length ? '<ul class="ap-list">' + abajo.map(fila).join('') + '</ul>' : '<p class="small">Nadie va abajo por ahora. 👏</p>'));
    if (cerca.length) h += card('<h3>🟡 En la orilla</h3><ul class="ap-list">' + cerca.map(fila).join('') + '</ul>');
    h += '<p class="muted small">«→» = calificación si entrega todo lo pendiente. Cuenta como Calificaciones: vacío = 0 cuando ya pasó la fecha de entrega (si así lo tienes en Ajustes).</p>';
    return { t: 'Para aprobar', h: h };
  };
  CH['ap-fac'] = el => S.update('config', c => { c.tardeValor = Number(el.value); }, {});

  /* ---------- impresión: mi plan para aprobar ---------- */
  const plan = (g, a, pid) => {
    const r = AP.analiza(g, pid, a.id), p = C.parcial(pid), cf = D.cfg(); if (!r) return '';
    return '<div class="pr ap-plan"><div class="p-title">MI PLAN PARA APROBAR · ' + esc(p.nombre.toUpperCase()) + '</div><p class="tiny c">' + esc(cf.plantel || '') + ' · Grupo ' + esc(g.nombre) + ' · Fecha: ' + u.fFecha(u.today()) + '</p>' +
      '<p><b>' + esc(a.nombre) + '</b> · Hoy vas en <b>' + (r.final == null ? '—' : r.final) + '</b>' + (r.exPend ? ' (sin examen todavía)' : '') + '. Para aprobar necesitas <b>' + minA() + '</b>.' + (r.todo != null ? ' Si entregas todo lo de abajo puedes llegar a <b>' + Math.round(r.todo) + '</b>.' : r.exPend && r.necTodo != null && r.pend.length ? ' Si entregas todo lo de abajo, ' + (r.necTodo > 100 ? 'todavía necesitarás más que el examen.' : r.necTodo <= 0 ? 'ya no dependes del examen.' : 'en el examen te basta con <b>' + r.necTodo + '</b>.') : '') + '</p>' +
      (r.pend.length ? '<p><b>Lo que te falta</b> (y cuánto sube tu calificación):</p><ul class="apl-chk">' + r.pend.map(x => '<li>☐ <b>' + esc(x.tipo) + ':</b> ' + esc(x.t) + (x.gain != null ? ' <b>(+' + R1(x.gain) + ')</b>' : '') + '<br><span class="tiny">' + esc(x.det) + '</span></li>').join('') + '</ul>' : '<p>No tienes pendientes registrados.</p>') +
      (r.nec != null ? '<p>' + necTu(r.nec) + '</p>' : '') +
      '<p>Fecha límite para entregar: ____________________ · Lo entregado tarde vale ' + Math.round(fac() * 100) + ' %.</p><p class="tiny">Ve uno por uno, empezando por el que más sube. Si tienes dudas, pregúntame antes de la fecha: estoy para ayudarte.</p>' +
      '<div class="ap-firmas"><span>Firma del alumno</span><span>' + esc(cf.docente || 'Docente') + '</span></div></div>';
  };
  A['ap-plan'] = el => { const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid); if (a) E.print.run(plan(g, a, el.dataset.pid), { title: 'Plan para aprobar · ' + a.nombre, margin: '10mm' }); };
  A['ap-plan-todos'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, mn = minA(), al = D.alumnos(g).filter(a => { const r = AP.analiza(g, pid, a.id); return r && r.final != null && (r.exPend && r.nec != null ? r.nec > 80 : r.final < mn); });
    if (!al.length) { u.toast('Nadie va abajo', 'ok'); return; } E.print.run(al.map(a => plan(g, a, pid)).join('<div class="ap-corte"></div>'), { title: 'Planes para aprobar', margin: '10mm' });
  };

  /* ---------- hoja para padres ---------- */
  AP.padres = (g, a, pid) => {
    const p = C.parcial(pid), cf = D.cfg(), r = AP.analiza(g, pid, a.id), k = C.cal(g, pid, a.id), as = C.asis(g, p, a.id), w = cf.pond;
    const pf = E.perfil ? E.perfil.calc(g, a) : null, nv = E.fc && E.fc.nivelAlumno ? E.fc.nivelAlumno(g, a.id) : null;
    const fort = pf && pf.fort.length ? pf.fort : ['Está construyendo su base en el módulo; pregúntenle qué aprendió esta semana.'];
    const casa = [];
    if (as.f >= 2) casa.push('Que asista todos los días y llegue a tiempo. Si hay alguna situación, avísenme por los medios de la escuela.');
    if (r && r.pend.some(x => x.tipo === 'Libreta' || x.tipo === 'Trabajo')) casa.push('Pregúntenle qué tareas tiene y revisen su libreta una vez por semana.');
    if (k.comp && (k.comp.examen == null || k.comp.examen < 70)) casa.push('Antes del examen, que repase 15 minutos al día tapando sus apuntes y escribiendo lo que recuerda: estudiar recordando funciona mejor que releer.');
    if (nv && nv.hay) casa.push('FreeCAD es gratuito: si tiene computadora en casa, puede practicar las prácticas del nivel que sigue.');
    casa.push('Reconozcan su esfuerzo, no solo la calificación: pregúntenle qué aprendió y qué le costó.');
    const coms = E.retro ? E.retro.paraPadres(g, a.id, 2) : [];
    return '<div class="pr padres"><div class="p-title">INFORME PARA MADRE, PADRE O TUTOR(A)</div><p class="tiny c">' + esc(cf.plantel || '') + ' · ' + esc(g.carrera || '') + ' · Grupo ' + esc(g.nombre) + ' · ' + esc(p.nombre) + ' · Docente: ' + esc(cf.docente || '') + ' · ' + u.fFecha(u.today()) + '</p>' +
      '<h2>' + esc(a.nombre) + '</h2>' +
      '<table class="grid pd-cal"><thead><tr><th class="l">Rubro</th><th>Vale</th><th>Lleva</th></tr></thead><tbody>' + KEYS.map(x => '<tr><td class="l">' + LBL[x] + '</td><td class="c">' + Number(w[x] || 0) + ' %</td><td class="c">' + (k.comp && k.comp[x] != null ? Math.round(k.comp[x]) : '—') + '</td></tr>').join('') +
      '<tr><td class="l"><b>Calificación del parcial' + (k.enCurso ? ' (en curso)' : '') + '</b></td><td></td><td class="c"><b>' + (k.final == null ? '—' : k.final) + '</b></td></tr></tbody></table>' +
      '<p><b>Asistencia:</b> ' + (as.ses ? as.a + ' de ' + as.ses + (as.ses === 1 ? ' clase' : ' clases') + (as.fechasF.length ? ' · faltó: ' + as.fechasF.map(f => u.fCorta(f)).join(', ') : ' · sin faltas') : 'sin registros todavía') + '.' + (nv && nv.hay ? ' <b>FreeCAD:</b> ' + (nv.n ? 'nivel ' + nv.n + ' de 3' : 'empezando') + ' (' + [1, 2, 3].reduce((s, n) => s + nv.cnt[n].ok, 0) + ' prácticas completas).' : '') + '</p>' +
      '<div class="pd-cols"><div><h3>Fortalezas</h3><ul>' + fort.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div><h3>Lo que le falta</h3>' + (r && r.pend.length ? '<ul>' + r.pend.slice(0, 5).map(x => '<li>' + esc(x.tipo + ': ' + x.t) + '</li>').join('') + '</ul>' : '<p>No tiene pendientes registrados.</p>') + (r && r.nec != null && r.nec > 0 && r.nec <= 100 ? '<p>Para aprobar necesita al menos ' + r.nec + ' en el examen.</p>' : '') + '</div></div>' +
      '<h3>Cómo pueden apoyar en casa</h3><ul>' + casa.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
      '<h3>Comentarios del docente</h3>' + (coms.length ? '<ul>' + coms.map(c => '<li>' + esc(c.txt) + ' <span class="tiny">(' + u.fCorta(c.f) + ')</span></li>').join('') + '</ul>' : '') + '<div class="pd-lineas"></div>' +
      '<div class="ap-firmas"><span>Firma de enterado: madre, padre o tutor(a)</span><span>' + esc(cf.docente || 'Docente') + '</span></div></div>';
  };
  A['ap-padres'] = el => { const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid); if (a) E.print.run(AP.padres(g, a, el.dataset.pid), { title: 'Informe para padres · ' + a.nombre, margin: '10mm' }); };
  A['ap-padres-todos'] = el => { const g = D.grupoActual(), pid = el.dataset.pid; E.print.run(D.alumnos(g).map(a => AP.padres(g, a, pid)).join(''), { title: 'Informes para padres · ' + g.nombre, margin: '10mm' }); };

  // en Imprimir: informes para padres y planes para aprobar
  if (V.imprimir) { const im = V.imprimir; V.imprimir = function () { const o = im.apply(null, arguments), g = D.grupoActual(); if (o && g && D.alumnos(g).length && !/Algo falló/.test(o.h)) { const pid = (E.ui.print && E.ui.print.pid) || C.parcialActual().id; o.h += card('<h3>👪 Junta con padres</h3><p class="muted small">Un informe por alumno: calificación con desglose, asistencia, FreeCAD, fortalezas, lo que le falta, cómo apoyar en casa y tus comentarios.</p><div class="row gap wrap">' + btn('🖨 Informes para padres (todo el grupo)', 'ap-padres-todos', 'data-pid="' + pid + '"', 'primary') + link('🎯 Para aprobar', 'aprobar/' + pid, '') + '</div>'); } return o; }; }
})();

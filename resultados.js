/* Escuadra · Entrega de resultados (v1.26).
   13) Temas que siempre cuestan: aciertos por tema de exámenes, calentamientos y boletos en todos tus grupos (también los
       archivados de otras generaciones), para saber qué reforzar desde el principio.
   14) Junta de padres: a quién citar (con el motivo), citatorios y mensajes, guion de la plática, hoja de firmas y acuerdos.
   15) Indicadores para la dirección: aprobación, promedio, asistencia, riesgo de abandono y avance del programa por grupo.
   16) Autoevaluación contra tu calificación: «¿cuánto crees que llevas?» (capturado o desde tu formulario de
       autoevaluación) frente a lo que llevan; las diferencias grandes son buen tema de conversación.
   17) Bitácora del proyecto por equipo: qué hicieron, qué problema tuvieron y qué sigue, sesión por sesión; imprimible. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const RS = E.resultados = {};
  const val = id => ((document.getElementById(id) || {}).value || '').trim();
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  const con = (g, fn) => { const cur = D.grupoActual(); if (!cur || cur.id === g.id) return fn(); D.setGrupo(g.id); try { return fn(); } finally { D.setGrupo(cur.id); } };
  const minA = () => Number(D.cfg().minAprob) || 60;
  const tTit = id => { const t = (E.TEMAS || []).find(x => x.id === id); return t ? t.titulo : id.replace(/^m\d-/, '').replace(/-/g, ' '); };

  /* ================= 13) TEMAS QUE SIEMPRE CUESTAN ================= */
  RS.temas = () => {
    const agg = {}, gs = D.grupos().filter(g => D.alumnos(g, true).length);
    gs.forEach(g => { let r = {}; try { r = con(g, () => E.examen && E.examen.debilidad ? E.examen.debilidad(g) : (E.repaso ? E.repaso.debil(g) : {})); } catch (e) { r = {}; } Object.keys(r).forEach(t => { (agg[t] = agg[t] || []).push({ g: g, p: r[t] }); }); });
    return Object.keys(agg).map(t => { const L = agg[t], prom = L.reduce((s, x) => s + x.p, 0) / L.length; return { t: t, L: L, prom: prom, bajos: L.filter(x => x.p < 0.6).length }; }).sort((a, b) => a.prom - b.prom);
  };
  V.temascuestan = () => {
    const T = RS.temas(), gs = D.grupos().filter(g => D.alumnos(g, true).length);
    let h = card('<h3>📉 Temas que siempre cuestan</h3><p class="small">Aciertos por tema en exámenes (pesan más), calentamientos y boletos de salida de <b>' + gs.length + (gs.length === 1 ? ' grupo' : ' grupos') + '</b>, incluidos los archivados de otras generaciones. Lo que sale bajo en varios grupos conviene reforzarlo desde la primera clase del tema.</p>' +
      (!T.length ? '<p class="note info">Todavía no hay datos: aparecen al calificar exámenes con el análisis por tema, o al registrar calentamientos y boletos de salida.</p>' : ''));
    if (T.length) h += card('<ul class="risk">' + T.slice(0, 25).map(x => '<li><span><b>' + esc(tTit(x.t)) + '</b><br><small class="muted">' + x.L.map(y => esc(y.g.nombre) + ' ' + Math.round(y.p * 100) + '%').join(' · ') + '</small></span><span class="row gap"><span class="g ' + (x.prom < 0.6 ? 'bad' : x.prom < 0.8 ? 'warn' : 'ok') + '">' + Math.round(x.prom * 100) + '%</span>' + (x.bajos > 1 ? '<span class="chip bad">bajo en ' + x.bajos + ' grupos</span>' : '') + ((E.TEMAS || []).some(t => t.id === x.t) ? link('Tema', 'tema/' + x.t, 'small ghost') : '') + '</span></li>').join('') + '</ul>');
    h += '<p class="muted small">Sugerencia: para los temas en rojo usa ejemplo resuelto y práctica guiada antes de los ejercicios (Estrategias), y ponlos en el calentamiento de la clase siguiente.</p>';
    return { t: 'Temas que cuestan', h: h };
  };

  /* ================= 14) JUNTA DE PADRES ================= */
  const KJ = g => 'junta:' + g.id;
  RS.juntas = g => (S.get(KJ(g)) || []).filter(x => x && x.id);
  const updJ = (g, id, fn) => S.update(KJ(g), l => { const j = l.find(x => x.id === id); if (j) fn(j); }, []);
  RS.motivos = (g) => {
    const p = C.parcialActual(), out = {};
    C.riesgos(g, p).forEach(r => { (out[r.id] = out[r.id] || []).push(r.txt); });
    if (E.aprobar && E.aprobar.analiza) D.alumnos(g).forEach(a => { let r = null; try { r = E.aprobar.analiza(g, p.id, a.id); } catch (e) { r = null; } if (r && r.pend && r.pend.length >= 3) (out[a.id] = out[a.id] || []).push(r.pend.length + ' entregas pendientes'); });
    return out;
  };
  V.junta = id => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Junta de padres');
    const L = RS.juntas(g), j = id ? L.find(x => x.id === id) : null;
    if (j) return juntaV(g, al, j);
    const mot = RS.motivos(g), cf = D.cfg();
    let h = card('<h3>👪 Junta de padres · ' + esc(g.nombre) + '</h3><p class="small">Arma la junta en un minuto: la app propone a quién citar y por qué (faltas seguidas, asistencia baja, va reprobando o debe varias entregas). Después imprimes citatorios, el guion de la plática y la hoja de firmas.</p>' +
      '<div class="fgrid c3"><label class="fld"><span>Fecha</span><input type="date" id="ju-f" value="' + u.addDays(u.today(), 7) + '"></label><label class="fld"><span>Hora</span><input type="time" id="ju-h" value="13:00"></label><label class="fld"><span>Lugar</span><input id="ju-l" value="Aula de ' + esc(g.grupo || g.nombre) + '"></label></div>' +
      '<label class="switch"><input type="checkbox" id="ju-todos"><span>Junta general (todo el grupo); si no, solo los citados</span></label>' +
      '<h4>Propuestos (' + Object.keys(mot).length + ')</h4>' + (Object.keys(mot).length ? '<ul class="sg-l">' + al.filter(a => mot[a.id]).map(a => '<li><label><input type="checkbox" class="ju-c" value="' + a.id + '" checked> <b>' + a.num + '.</b> ' + esc(a.nombre) + ' <small class="muted">' + esc(mot[a.id].join(' · ')) + '</small></label></li>').join('') + '</ul>' : '<p class="small muted">Nadie en riesgo por ahora.</p>') +
      '<details class="sub"><summary>Agregar a otros alumnos</summary><ul class="sg-l">' + al.filter(a => !mot[a.id]).map(a => '<li><label><input type="checkbox" class="ju-c" value="' + a.id + '"> ' + a.num + '. ' + esc(a.nombre) + '</label></li>').join('') + '</ul></details>' +
      btn('Crear junta', 'ju-crear', '', 'primary'));
    if (L.length) h += card('<h3>Juntas</h3><ul class="pc-l">' + L.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).map(x => '<li class="' + (x.fecha < u.today() ? '' : 'info') + '"><span class="pc-i">👪</span><div><b>' + u.cap(u.fLarga(x.fecha)) + (x.hora ? ' · ' + esc(x.hora) : '') + '</b><small class="muted">' + (x.general ? 'General' : Object.keys(x.citados || {}).length + ' citados') + ' · ' + Object.keys(x.asistio || {}).length + ' asistieron · ' + (x.acuerdos || []).length + ' acuerdos</small></div>' + link('Abrir', 'junta/' + x.id, 'small') + '</li>').join('') + '</ul>');
    return { t: 'Junta de padres', h: h };
  };
  function juntaV(g, al, j) {
    const cit = al.filter(a => j.general || (j.citados || {})[a.id]), asi = j.asistio || {}, tel = a => { const d = String(a.tel || '').replace(/\D/g, ''); return d.length === 10 ? '52' + d : d.length >= 11 ? d : ''; };
    let h = card('<div class="row between gap wrap"><h3>👪 Junta del ' + u.fLarga(j.fecha) + (j.hora ? ' · ' + esc(j.hora) : '') + '</h3>' + link('‹ Juntas', 'junta', 'small ghost') + '</div><p class="small">' + esc(j.lugar || '') + ' · ' + (j.general ? 'todo el grupo' : cit.length + ' citados') + '</p>' +
      '<div class="row gap wrap">' + btn('🖨 Citatorios', 'ju-cit', 'data-id="' + j.id + '"', 'small primary') + btn('🖨 Guion de la plática', 'ju-guion', 'data-id="' + j.id + '"', 'small') + btn('🖨 Hoja de firmas', 'ju-firmas', 'data-id="' + j.id + '"', 'small') + btn('🗑 Borrar', 'ju-del', 'data-id="' + j.id + '"', 'small ghost danger') + '</div>');
    h += card('<h3>Citados · asistencia</h3><ul class="sg-l">' + cit.map(a => { const t = tel(a), msg = 'Buen día. Le escribe ' + (D.cfg().docente || 'el docente') + ', de ' + g.nombre + '. Le cito a una junta el ' + u.fLarga(j.fecha) + (j.hora ? ' a las ' + j.hora : '') + (j.lugar ? ' en ' + j.lugar : '') + ' para platicar sobre ' + (u.partesNombre(a.nombre).nom.split(' ')[0]) + ((j.citados || {})[a.id] ? ' (' + j.citados[a.id] + ')' : '') + '. Gracias.';
      return '<li><span><b>' + a.num + '.</b> ' + esc(a.nombre) + ((j.citados || {})[a.id] ? '<br><small class="muted">' + esc(j.citados[a.id]) + '</small>' : '') + '</span><span class="row gap">' + (t ? '<a class="btn small ghost" href="https://wa.me/' + t + '?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener">💬</a>' : '') + btn(asi[a.id] ? '✓ Asistió' : 'Asistió', 'ju-asi', 'data-id="' + j.id + '" data-aid="' + a.id + '"', 'small' + (asi[a.id] ? ' on ok' : '')) + '</span></li>'; }).join('') + '</ul>');
    h += card('<h3>📝 Acuerdos</h3>' + ((j.acuerdos || []).length ? '<ul class="sg-l">' + j.acuerdos.map((x, i) => { const a = x.aid && D.alumno(g, x.aid); return '<li><span>' + (a ? '<b>' + esc(u.corto(a.nombre)) + ':</b> ' : '') + esc(x.t) + '</span>' + btn('✕', 'ju-ac-del', 'data-id="' + j.id + '" data-i="' + i + '"', 'small ghost') + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="fgrid"><label class="fld"><span>Alumno (opcional)</span><select id="ju-ac-a"><option value="">— General —</option>' + cit.map(a => '<option value="' + a.id + '">' + a.num + '. ' + esc(u.corto(a.nombre)) + '</option>').join('') + '</select></label><label class="fld"><span>Acuerdo</span><input id="ju-ac-t" placeholder="Ej. revisa la libreta cada viernes"></label></div>' + btn('＋ Agregar acuerdo', 'ju-ac', 'data-id="' + j.id + '"', 'small') +
      '<p class="muted small">Los acuerdos con un alumno también aparecen en su ficha, en Tutoría → seguimiento.</p>');
    return { t: 'Junta de padres', h: h };
  }
  A['ju-crear'] = () => { const g = D.grupoActual(), f = val('ju-f'); if (!f) { u.toast('Elige la fecha', 'err'); return; } const mot = RS.motivos(g), cit = {}; document.querySelectorAll('.ju-c:checked').forEach(c => { cit[c.value] = (mot[c.value] || ['Seguimiento']).join(', '); }); const gen = (document.getElementById('ju-todos') || {}).checked; if (!gen && !Object.keys(cit).length) { u.toast('Elige a quién citar o marca junta general', 'err'); return; } const id = u.uid('ju'); S.update(KJ(g), l => { l.push({ id: id, fecha: f, hora: val('ju-h'), lugar: val('ju-l'), general: !!gen, citados: cit, asistio: {}, acuerdos: [] }); }, []); location.hash = '#/junta/' + id; };
  A['ju-asi'] = el => { const g = D.grupoActual(); updJ(g, el.dataset.id, j => { j.asistio = j.asistio || {}; if (j.asistio[el.dataset.aid]) delete j.asistio[el.dataset.aid]; else j.asistio[el.dataset.aid] = u.today(); }); };
  A['ju-ac'] = el => { const g = D.grupoActual(), t = val('ju-ac-t'); if (!t) return; const aid = val('ju-ac-a'); updJ(g, el.dataset.id, j => { j.acuerdos = j.acuerdos || []; j.acuerdos.push({ aid: aid, t: t, f: u.today() }); }); };
  A['ju-ac-del'] = el => { const g = D.grupoActual(); updJ(g, el.dataset.id, j => { j.acuerdos.splice(Number(el.dataset.i), 1); }); };
  A['ju-del'] = el => { if (!confirm('¿Borrar esta junta?')) return; const g = D.grupoActual(); S.update(KJ(g), l => l.filter(x => x.id !== el.dataset.id), []); location.hash = '#/junta'; };
  const juntaDe = id => { const g = D.grupoActual(); return { g: g, j: RS.juntas(g).find(x => x.id === id), al: D.alumnos(g) }; };
  A['ju-cit'] = el => { const x = juntaDe(el.dataset.id), cf = D.cfg(), cit = x.al.filter(a => x.j.general || (x.j.citados || {})[a.id]);
    E.print.run('<div class="pr">' + cit.map(a => '<div class="tira cit"><b>CITATORIO</b> · ' + esc(cf.plantel || '') + '<p>Madre, padre o tutor(a) de <b>' + esc(a.nombre) + '</b> (' + esc(x.g.nombre) + ', No. ' + a.num + '):</p><p>Le cito a una reunión el <b>' + esc(u.fLarga(x.j.fecha)) + '</b>' + (x.j.hora ? ' a las <b>' + esc(x.j.hora) + '</b>' : '') + (x.j.lugar ? ' en ' + esc(x.j.lugar) : '') + (x.j.general ? ' para revisar el avance del grupo.' : ' para platicar sobre el avance de su hijo(a)' + ((x.j.citados || {})[a.id] ? ': ' + esc(x.j.citados[a.id]) : '') + '.') + '</p><p class="tiny">' + esc(cf.docente || 'Docente') + ' · Recibí: ____________________ Fecha: ________</p></div>').join('') + '</div>', { title: 'Citatorios', margin: '10mm' }); };
  A['ju-guion'] = el => { const x = juntaDe(el.dataset.id), g = x.g, cf = D.cfg(), p = C.parcialActual(), w = cf.pond, al = x.al;
    const cal = al.map(a => C.cal(g, p.id, a.id).final).filter(v => v != null), prom = cal.length ? Math.round(cal.reduce((s, v) => s + v, 0) / cal.length) : null, apr = cal.filter(v => v >= minA()).length, as = al.map(a => C.asis(g, p, a.id).pct).filter(v => v != null), pa = as.length ? Math.round(as.reduce((s, v) => s + v, 0) / as.length) : null;
    const pasos = [['Bienvenida (2 min)', 'Agradecer la asistencia. Objetivo: que su hijo(a) apruebe y aprenda; trabajamos en equipo.'], ['Cómo se califica (5 min)', 'Examen ' + w.examen + ' %, libreta/proyecto/bitácora ' + w.trabajos + ' %, asistencia ' + w.asistencia + ' %, participación ' + w.participacion + ' %. Mínimo aprobatorio: ' + minA() + '.'], ['Cómo va el grupo (5 min)', (prom != null ? 'Promedio ' + prom + ' · ' : '') + apr + ' de ' + cal.length + ' van aprobando' + (pa != null ? ' · asistencia promedio ' + pa + ' %' : '') + '. Sin nombres.'], ['Qué se ve este parcial (3 min)', 'Proyecto, prácticas del taller y reglamento de seguridad (EPP).'], ['Cómo pueden ayudar en casa (5 min)', 'Preguntar qué vieron, revisar la libreta cada semana, cuidar la asistencia, usar el QR de consulta.'], ['Casos individuales (lo que haga falta)', 'Con cada familia citada, aparte: qué le falta, cuánto sube si entrega, y un acuerdo concreto con fecha.'], ['Acuerdos y cierre (3 min)', 'Leer los acuerdos, firmar la hoja de asistencia y dar el medio de contacto.']];
    E.print.run('<div class="pr"><div class="p-title">GUION · JUNTA DE PADRES · ' + esc(g.nombre) + '</div><p class="tiny c">' + esc(u.fLargaA(x.j.fecha)) + (x.j.hora ? ' · ' + esc(x.j.hora) : '') + ' · ' + esc(x.j.lugar || '') + '</p><ol>' + pasos.map(s => '<li><b>' + esc(s[0]) + '</b><br>' + esc(s[1]) + '</li>').join('') + '</ol>' + (x.j.general ? '' : '<h4>Citados</h4><ul class="small">' + x.al.filter(a => (x.j.citados || {})[a.id]).map(a => '<li>' + esc(a.nombre) + ': ' + esc(x.j.citados[a.id]) + ' · lleva ' + (C.cal(g, p.id, a.id).final == null ? '—' : C.cal(g, p.id, a.id).final) + '</li>').join('') + '</ul>') + '</div>', { title: 'Guion de la junta', margin: '12mm' }); };
  A['ju-firmas'] = el => { const x = juntaDe(el.dataset.id), cit = x.al.filter(a => x.j.general || (x.j.citados || {})[a.id]);
    E.print.run('<div class="pr"><div class="p-title">ASISTENCIA A LA JUNTA DE PADRES · ' + esc(x.g.nombre) + '</div><p class="tiny c">' + esc(u.fLargaA(x.j.fecha)) + '</p><table class="grid"><thead><tr><th>No.</th><th class="l">ALUMNO</th><th class="l">NOMBRE DE QUIEN ASISTE</th><th>PARENTESCO</th><th>FIRMA</th></tr></thead><tbody>' + cit.map(a => '<tr style="height:30px"><td class="c">' + a.num + '</td><td class="nm">' + esc(a.nombre) + '</td><td></td><td></td><td></td></tr>').join('') + '</tbody></table></div>', { title: 'Firmas de la junta', margin: '10mm' }); };
  // acuerdos de la junta en la ficha del alumno
  if (V.alumno) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) { const L = []; RS.juntas(g).forEach(j => (j.acuerdos || []).forEach(x => { if (x.aid === a.id) L.push({ j: j, x: x }); })); if (L.length) o.h = E.fichaInsert(o.h, card('<h3>👪 Acuerdos con la familia</h3><ul class="small">' + L.map(y => '<li><b>' + u.fCorta(y.j.fecha) + ':</b> ' + esc(y.x.t) + '</li>').join('') + '</ul>')); } return o; }; }

  /* ================= 15) INDICADORES PARA LA DIRECCIÓN ================= */
  RS.ind = (g, p) => con(g, () => {
    const al = D.alumnos(g), bajas = D.alumnos(g, true).filter(a => a.activo === false).length, k = al.map(a => ({ a: a, c: C.cal(g, p.id, a.id), as: C.asis(g, p, a.id) }));
    const cc = k.filter(x => x.c.final != null), apr = cc.filter(x => x.c.final >= minA()).length, prom = cc.length ? cc.reduce((s, x) => s + x.c.final, 0) / cc.length : null;
    const asis = k.filter(x => x.as.pct != null), pa = asis.length ? asis.reduce((s, x) => s + x.as.pct, 0) / asis.length : null;
    const aband = k.filter(x => x.as.racha >= 3 || (x.as.ses >= 5 && x.as.pct != null && x.as.pct < 70)).map(x => x.a);
    const riesgo = new Set(C.riesgos(g, p).map(r => r.id));
    let av = null; try { const pl = E.clases && E.clases.tiene(g, p.id) ? E.clases.plan(g, p.id) : null; if (pl) { const hoy = u.today(), dadas = pl.bloques.filter(b => b.fecha < hoy && !b.perdida).reduce((s, b) => s + b.horas, 0), hasta = pl.bloques.filter(b => b.fecha < hoy).reduce((s, b) => s + b.horas, 0); av = { dadas: dadas, cal: pl.cal, perd: hasta - dadas }; } } catch (e) { av = null; }
    return { n: al.length, bajas: bajas, conCal: cc.length, apr: apr, pctApr: cc.length ? apr / cc.length * 100 : null, prom: prom, pa: pa, aband: aband, riesgo: riesgo.size, av: av };
  });
  V.indicadores = pid => {
    const gs = D.gruposActivos(), p = D.parciales().find(x => x.id === pid) || C.parcialActual();
    let h = '<div class="filters">' + D.parciales().map(x => '<a class="tab ' + (x.id === p.id ? 'on' : '') + '" href="#/indicadores/' + x.id + '">' + esc(x.nombre) + '</a>').join('') + '</div>';
    h += card('<h3>📊 Indicadores para la dirección · ' + esc(p.nombre) + '</h3><p class="small">Una hoja con lo que suele pedir la dirección o el CTE. «Riesgo de abandono» = 3 o más faltas seguidas, o asistencia menor a 70 % con 5 clases o más.</p>' + btn('🖨 Imprimir', 'ind-print', 'data-pid="' + p.id + '"', 'primary small'));
    gs.forEach(g => { const r = RS.ind(g, p), f = v => v == null ? '—' : Math.round(v);
      h += card('<h3>' + esc(g.nombre) + '</h3><div class="en-kpis"><div><b>' + r.n + '</b><span>alumnos' + (r.bajas ? ' · ' + r.bajas + ' bajas' : '') + '</span></div><div class="' + (r.pctApr == null ? '' : r.pctApr >= 80 ? 'ok' : r.pctApr >= 60 ? 'warn' : 'bad') + '"><b>' + f(r.pctApr) + '%</b><span>aprobando (' + r.apr + '/' + r.conCal + ')</span></div><div><b>' + f(r.prom) + '</b><span>promedio</span></div><div class="' + (r.pa != null && r.pa < 85 ? 'warn' : '') + '"><b>' + f(r.pa) + '%</b><span>asistencia</span></div><div class="' + (r.aband.length ? 'bad' : 'ok') + '"><b>' + r.aband.length + '</b><span>riesgo de abandono</span></div>' + (r.av ? '<div><b>' + r.av.dadas + '/' + r.av.cal + ' h</b><span>programa' + (r.av.perd ? ' · ' + r.av.perd + ' h perdidas' : '') + '</span></div>' : '') + '</div>' +
        (r.aband.length ? '<p class="small"><b>Riesgo de abandono:</b> ' + r.aband.map(a => '<a href="#/alumno/' + a.id + '">' + esc(u.corto(a.nombre)) + '</a>').join(', ') + '</p>' : '')); });
    return { t: 'Indicadores', h: h };
  };
  A['ind-print'] = el => { const p = C.parcial(el.dataset.pid) || C.parcialActual(), cf = D.cfg(), f = v => v == null ? '—' : Math.round(v);
    E.print.run('<div class="pr"><div class="p-title">INDICADORES · ' + esc(p.nombre).toUpperCase() + '</div><p class="tiny c">' + esc(cf.docente || '') + ' · ' + esc(cf.plantel || '') + ' · Corte al ' + u.fFecha(u.today()) + '</p><table class="grid"><thead><tr><th class="l">GRUPO</th><th>ALUMNOS</th><th>BAJAS</th><th>APROBANDO</th><th>PROMEDIO</th><th>ASISTENCIA</th><th>EN RIESGO</th><th>RIESGO DE ABANDONO</th><th>AVANCE DEL PROGRAMA</th></tr></thead><tbody>' +
      D.gruposActivos().map(g => { const r = RS.ind(g, p); return '<tr><td class="nm">' + esc(g.nombre) + '</td><td class="c">' + r.n + '</td><td class="c">' + r.bajas + '</td><td class="c">' + f(r.pctApr) + '% (' + r.apr + '/' + r.conCal + ')</td><td class="c">' + f(r.prom) + '</td><td class="c">' + f(r.pa) + '%</td><td class="c">' + r.riesgo + '</td><td class="c">' + r.aband.length + '</td><td class="c">' + (r.av ? r.av.dadas + ' de ' + r.av.cal + ' h' : '—') + '</td></tr>'; }).join('') + '</tbody></table><p class="tiny">Aprobando: calificación del parcial en curso ≥ ' + minA() + ' entre quienes ya tienen calificación. Riesgo de abandono: 3 o más faltas seguidas, o asistencia menor a 70 % con 5 clases o más.</p></div>', { landscape: true, title: 'Indicadores', margin: '10mm' }); };

  /* ================= 16) AUTOEVALUACIÓN CONTRA TU CALIFICACIÓN ================= */
  const KA = (g, pid) => 'autoCal:' + g.id + ':' + pid;
  RS.autoDe = (g, pid) => { const man = S.get(KA(g, pid)) || {}, out = Object.assign({}, man.v || {}); if (man.act) { const a = S.get('act:' + g.id + ':' + man.act); if (a) D.alumnos(g).forEach(x => { if (out[x.id] == null) { const n = C.nota(a, x.id); if (n != null) out[x.id] = Math.round(n); } }); } return { v: out, act: man.act || '' }; };
  V.autoeval = pid => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Autoevaluación');
    const p = D.parciales().find(x => x.id === pid) || C.parcialActual(), r = RS.autoDe(g, p.id), forms = ((S.get('forms:' + g.id) || {}).items || []).filter(x => x.tipo === 'auto' && x.act);
    const filas = al.map(a => { const yo = C.cal(g, p.id, a.id).final, el = r.v[a.id]; return { a: a, yo: yo, el: el, dif: yo != null && el != null ? el - yo : null }; });
    const sobre = filas.filter(x => x.dif != null && x.dif >= 15), sub = filas.filter(x => x.dif != null && x.dif <= -15);
    let h = '<div class="filters">' + D.parciales().map(x => '<a class="tab ' + (x.id === p.id ? 'on' : '') + '" href="#/autoeval/' + x.id + '">' + esc(x.nombre) + '</a>').join('') + '</div>';
    h += card('<h3>🪞 ¿Cuánto creen que llevan?</h3><p class="small">Pregúntales en clase (en un papelito o con tu formulario de autoevaluación) y compáralo con lo que llevan. Quien se sobreestima mucho suele no saber qué le falta; quien se subestima, a veces necesita confianza.</p>' +
      (forms.length ? '<label class="fld"><span>Tomar de tu formulario de autoevaluación</span><select data-ch="au-act"><option value="">— No —</option>' + forms.map(f => '<option value="' + f.act + '"' + (r.act === f.act ? ' selected' : '') + '>' + esc(f.titulo) + '</option>').join('') + '</select></label>' : '') +
      '<div class="en-kpis"><div class="' + (sobre.length ? 'warn' : '') + '"><b>' + sobre.length + '</b><span>se sobreestiman (15+)</span></div><div class="' + (sub.length ? 'info' : '') + '"><b>' + sub.length + '</b><span>se subestiman (15+)</span></div><div><b>' + filas.filter(x => x.el != null).length + '/' + al.length + '</b><span>contestaron</span></div></div>');
    h += card('<table class="tbl"><thead><tr><th class="l">Alumno</th><th>Cree</th><th>Lleva</th><th>Diferencia</th></tr></thead><tbody>' + filas.map(x => '<tr><td class="l">' + x.a.num + '. ' + esc(u.corto(x.a.nombre)) + '</td><td><input class="inp au-in" type="number" min="0" max="100" inputmode="numeric" value="' + (x.el == null ? '' : x.el) + '" data-ch="au-v" data-aid="' + x.a.id + '" data-pid="' + p.id + '" aria-label="Lo que cree"></td><td><span class="g ' + H.gclass(x.yo) + '">' + H.gfmt(x.yo) + '</span></td><td>' + (x.dif == null ? '' : '<b class="' + (Math.abs(x.dif) >= 15 ? (x.dif > 0 ? 'badc' : 'okc') : '') + '">' + (x.dif > 0 ? '+' : '') + Math.round(x.dif) + '</b>') + '</td></tr>').join('') + '</tbody></table>');
    if (sobre.length || sub.length) h += card('<h3>💬 Para platicar</h3>' + (sobre.length ? '<p class="small"><b>Se sobreestiman:</b> ' + sobre.map(x => esc(u.corto(x.a.nombre))).join(', ') + '. Muéstrales su consulta (QR): qué les falta y cuánto sube cada entrega.</p>' : '') + (sub.length ? '<p class="small"><b>Se subestiman:</b> ' + sub.map(x => esc(u.corto(x.a.nombre))).join(', ') + '. Díselo en corto: van mejor de lo que creen.</p>' : ''));
    return { t: 'Autoevaluación', h: h };
  };
  CH['au-v'] = el => { const g = D.grupoActual(), v = el.value === '' ? null : Math.max(0, Math.min(100, Number(el.value))); S.update(KA(g, el.dataset.pid), d => { d.v = d.v || {}; if (v == null) delete d.v[el.dataset.aid]; else d.v[el.dataset.aid] = v; }, {}); };
  CH['au-act'] = el => { const g = D.grupoActual(), p = C.parcialActual(); S.update(KA(g, p.id), d => { d.act = el.value; }, {}); };

  /* ================= 17) BITÁCORA DEL PROYECTO POR EQUIPO ================= */
  const KB = (g, pid) => 'pjBit:' + g.id + ':' + pid;
  RS.bit = (g, pid) => S.get(KB(g, pid)) || {};
  RS.bitHTML = (g, pid) => {
    const doc = E.proyecto ? E.proyecto.doc(g, pid) : {}, eqs = doc.equipos || []; if (!eqs.length) return '';
    const b = RS.bit(g, pid), ui = E.ui.pjb = E.ui.pjb || {}, eq = eqs.find(x => x.id === ui.eq) || eqs[0], L = (b[eq.id] || []).slice().sort((x, y) => y.f.localeCompare(x.f));
    return card('<div class="row between gap wrap"><h3>📓 Bitácora de los equipos</h3>' + btn('🖨 Imprimir', 'pjb-print', 'data-pid="' + pid + '"', 'small ghost') + '</div><p class="muted small">Dos minutos al final de cada sesión de proyecto: qué hicieron, qué problema tuvieron y qué sigue. Sirve para evaluar el proceso y para defender la calificación.</p>' +
      '<div class="filters">' + eqs.map(x => '<button type="button" class="tab ' + (x.id === eq.id ? 'on' : '') + '" data-act="pjb-eq" data-eq="' + x.id + '">' + esc(x.nombre) + ' (' + (b[x.id] || []).length + ')</button>').join('') + '</div>' +
      '<div class="fgrid"><label class="fld"><span>Qué hicieron hoy</span><input id="pjb-h" placeholder="Ej. cortamos las piezas del eslabón"></label><label class="fld"><span>Problema o ajuste</span><input id="pjb-p" placeholder="Ej. el barreno quedó chueco"></label></div><label class="fld"><span>Qué sigue</span><input id="pjb-s" placeholder="Ej. traer tornillos M3"></label>' + btn('＋ Agregar a ' + esc(eq.nombre), 'pjb-add', 'data-pid="' + pid + '" data-eq="' + eq.id + '"', 'small primary') +
      (L.length ? '<ul class="pjb-l">' + L.map(x => '<li><b>' + u.fCorta(x.f) + '</b> · ' + esc(x.h) + (x.p ? '<br><small>⚠️ ' + esc(x.p) + '</small>' : '') + (x.s ? '<br><small>➡️ ' + esc(x.s) + '</small>' : '') + ' ' + btn('✕', 'pjb-del', 'data-pid="' + pid + '" data-eq="' + eq.id + '" data-id="' + x.id + '"', 'small ghost') + '</li>').join('') + '</ul>' : '<p class="small muted mt">Sin registros de este equipo.</p>'));
  };
  A['pjb-eq'] = el => { E.ui.pjb = { eq: el.dataset.eq }; E.render(); };
  A['pjb-add'] = el => { const g = D.grupoActual(), hz = val('pjb-h'); if (!hz) { u.toast('Escribe qué hicieron', 'err'); return; } S.update(KB(g, el.dataset.pid), d => { (d[el.dataset.eq] = d[el.dataset.eq] || []).push({ id: u.uid('pb'), f: u.today(), h: hz, p: val('pjb-p'), s: val('pjb-s') }); }, {}); E.ui.pjb = { eq: el.dataset.eq }; };
  A['pjb-del'] = el => { const g = D.grupoActual(); S.update(KB(g, el.dataset.pid), d => { d[el.dataset.eq] = (d[el.dataset.eq] || []).filter(x => x.id !== el.dataset.id); }, {}); };
  A['pjb-print'] = el => { const g = D.grupoActual(), pid = el.dataset.pid, eqs = (E.proyecto.doc(g, pid).equipos || []), b = RS.bit(g, pid);
    E.print.run('<div class="pr">' + eqs.map(eq => '<div class="p-title">BITÁCORA DEL PROYECTO · ' + esc(eq.nombre).toUpperCase() + '</div><p class="tiny c">' + esc(g.nombre) + ' · ' + eq.al.map(id => D.alumno(g, id)).filter(Boolean).map(a => esc(u.corto(a.nombre))).join(', ') + '</p><table class="grid"><thead><tr><th>FECHA</th><th class="l">QUÉ HICIMOS</th><th class="l">PROBLEMA O AJUSTE</th><th class="l">QUÉ SIGUE</th></tr></thead><tbody>' + (b[eq.id] || []).slice().sort((x, y) => x.f.localeCompare(y.f)).map(x => '<tr><td class="c">' + u.fDM(x.f) + '</td><td>' + esc(x.h) + '</td><td>' + esc(x.p || '') + '</td><td>' + esc(x.s || '') + '</td></tr>').join('') + '</tbody></table><div class="pbreak"></div>').join('') + '</div>', { title: 'Bitácoras de proyecto', margin: '10mm' }); };
  if (V.proyecto) { const vp = V.proyecto; V.proyecto = function (pid) { const o = vp.apply(null, arguments), g = D.grupoActual(); if (!o || !g || /Algo falló|Primero importa|Configura/.test(o.h) || !E.proyecto) return o; const ps = E.proyecto.parciales(g); const act = C.parcialActual(); const p = ps.some(x => x.id === pid) ? pid : (ps.find(x => x.id === E.proyecto.canon(g, act.id)) || ps[0] || {}).id; if (p && !E.ui.pjEdit) { const x = RS.bitHTML(g, p); const i = o.h.lastIndexOf('<p class="muted small">Sugerencia'); o.h = i > 0 ? o.h.slice(0, i) + x + o.h.slice(i) : o.h + x; } return o; }; }

  /* ================= pantalla que reúne lo anterior ================= */
  V.resultadosmas = () => ({ t: 'Resultados', h: card('<h3>📬 Entrega de resultados</h3><div class="mas-grid">' + [['indicadores', '📊', 'Indicadores', 'Una hoja para la dirección'], ['junta', '👪', 'Junta de padres', 'Citados, guion, firmas y acuerdos'], ['temascuestan', '📉', 'Temas que cuestan', 'En todas tus generaciones'], ['autoeval', '🪞', '¿Cuánto creen que llevan?', 'Autoevaluación contra tu calificación'], ['proyecto', '📓', 'Bitácora del proyecto', 'Por equipo, sesión por sesión'], ['expediente', '🗂', 'Expediente docente', 'Cierre del semestre']].map(x => '<a href="#/' + x[0] + '"><span class="mg-e">' + x[1] + '</span><span>' + x[2] + '</span><small>' + x[3] + '</small></a>').join('') + '</div>') });
})();

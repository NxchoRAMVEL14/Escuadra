/* Escuadra · Entrega de calificaciones a padres (v1.39.0; aparte de «Junta de padres» con citatorios, que vive en resultados.js): cada entrega de calificaciones con la agenda que manda el director, el estatus del
   grupo hecho con tus datos, qué se vio y los acuerdos, quién vino, hojas por alumno con QR para entregar en mano, lista de
   firmas, formatos de firma (reglamento del celular y revisión de mochila), el aviso para mandar a casa y las fechas que
   vienen. Todo se guarda en tus datos; las hojas no llevan notas de tutoría. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn;
  const J = E.entcal = {}, K = g => 'entcal:' + g.id;
  const minA = () => Number(D.cfg().minAprob) || 70;

  // agenda del director para la 2ª entrega (18 de noviembre de 2026), tal cual la mandó
  J.CEL = ['Retirar los celulares de las aulas.', 'Cuando sea necesario se puede utilizar el celular.', 'Tener un organizador para los celulares que tenga su nombre y pasar lista conforme dejen el celular en el organizador.', 'Regresar el celular al terminar la clase.', 'Si tienen una emergencia avisar a dirección para utilizar el celular.', 'Mejorar la conectividad en el plantel para actividades escolares.', 'Solicitar con tiempo datos móviles para actividades escolares.', 'En actividades matemáticas hacer uso exclusivo de las calculadoras.', 'Hacer un reglamento para el uso de celulares y que lo firmen docentes, padres de familia y alumnos.', 'Establecer en las planeaciones en qué actividades será necesario el uso del celular ya que se comparten actividades por ese medio.', 'Retirar el dispositivo al alumno que no esté realizando el uso adecuado y solo entregarlo hasta que lo recoja el padre de familia.', 'Contar con lockers en zona administrativa para que el alumno guarde el celular; el docente y el administrativo son los únicos que tendrán acceso.', 'Realizar los concentrados necesarios de libros y utilizar el cañón.', 'Utilizar bloqueador de línea.'];
  J.FECHAS = [['2026-11-20', 'Desfile, 4:30 p.m., afuera de la primaria Manuel Doblado'], ['2026-11-25', 'Muestra profesiográfica del plantel (1er día)'], ['2026-11-26', 'Muestra profesiográfica del plantel (2º día)'], ['2026-11-27', 'Consejo técnico (no hay clases)'], ['2026-12-10', 'Último día de clases'], ['2026-12-11', 'Convivio y posada navideña escolar'], ['2026-12-14', 'Exámenes finales (del 14 al 17 de diciembre)'], ['2026-12-18', 'Aseo general'], ['2027-01-07', 'Publicación de resultados, por horarios']];
  const AG1118 = () => [
    { t: 'Estatus del grupo', auto: 'estatus' },
    { t: 'Propuesta de regular el uso de los teléfonos en media superior (CETAC 19 Purísima)', det: J.CEL.join('\n'), auto: 'cel' },
    { t: 'Solicitar a los padres de familia el apoyo para pagar la inscripción de los alumnos que deben semestre(s)' },
    { t: 'Firma de autorización de revisión de mochila en el plantel', auto: 'mochila' },
    { t: 'Calendario de actividades', det: J.FECHAS.map(x => u.fCorta(x[0]) + ': ' + x[1]).join('\n'), auto: 'fechas' },
    { t: 'Entrega de calificaciones', auto: 'boletas' },
    { t: 'Publicación de resultados: 7 de enero de 2027, por horarios' }].map((p, i) => Object.assign({ id: 'p' + (i + 1) }, p));

  const pDe = f => { const ps = D.parciales(); const c = ps.filter(p => p.fin && p.fin <= f); return (c[c.length - 1] || ps.find(p => f >= p.inicio && f <= p.fin) || ps[0] || {}).id; };
  J.doc = g => { const d = S.get(K(g)); if (d && d.ent && Object.keys(d.ent).length) return d;
    return { cur: 'e1118', ent: { e1118: { id: 'e1118', nombre: '2ª entrega de calificaciones', fecha: '2026-11-18', hora: '19:00', pid: pDe('2026-11-18'), puntos: AG1118(), asis: {}, acuerdos: '' } }, fechas: J.FECHAS.map(x => ({ f: x[0], t: x[1] })) }; };
  const put = (g, f) => { const d = J.doc(g); f(d); S.put(K(g), d); };
  J.ent = (g, d) => { d = d || J.doc(g); return d.ent[d.cur] || d.ent[Object.keys(d.ent)[0]]; };

  /* ---------- estatus del grupo (con tus datos) ---------- */
  J.estatus = (g, pid) => {
    const al = D.alumnos(g), p = C.parcial(pid) || {}, m = minA();
    const fil = al.map(a => { const k = C.cal(g, pid, a.id), as = C.asis(g, p, a.id), r = E.aprobar ? E.aprobar.analiza(g, pid, a.id) : null; return { a: a, fin: k.final, of: C.oficial(k.final), f: as.f, pct: as.pct, pend: r ? r.pend.length : 0 }; });
    const con = fil.filter(x => x.fin != null), apr = con.filter(x => x.fin >= m), rep = con.filter(x => x.fin < m).sort((x, y) => x.fin - y.fin);
    const prom = con.length ? Math.round(con.reduce((s, x) => s + x.of, 0) / con.length * 10) / 10 : null;
    const asi = fil.filter(x => x.pct != null), pa = asi.length ? Math.round(asi.reduce((s, x) => s + x.pct, 0) / asi.length) : null;
    const top = con.slice().sort((x, y) => y.fin - x.fin).filter(x => x.of >= 9).slice(0, 5), faltas = fil.filter(x => x.f >= 3).sort((x, y) => y.f - x.f);
    return { p: p, fil: fil, n: al.length, con: con.length, apr: apr, rep: rep, prom: prom, pa: pa, top: top, faltas: faltas };
  };
  const kpiHTML = R => '<div class="jp-kpi"><div><b>' + (R.prom == null ? '—' : R.prom) + '</b><span>Promedio</span></div><div class="ok"><b>' + R.apr.length + '/' + R.con + '</b><span>Aprueban</span></div><div class="bad"><b>' + R.rep.length + '</b><span>En riesgo</span></div><div><b>' + (R.pa == null ? '—' : R.pa + '%') + '</b><span>Asistencia</span></div></div>';
  const nomL = arr => arr.map(x => esc(x.a.num + '. ' + u.corto(x.a.nombre)) + (x.of != null && x.extra !== false ? ' (' + x.of + ')' : '')).join(' · ');

  /* ---------- pantalla ---------- */
  V.entregacal = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Entrega de calificaciones');
    const d = J.doc(g), e = J.ent(g, d), R = J.estatus(g, e.pid), ps = D.parciales(), vino = al.filter(a => (e.asis || {})[a.id]).length;
    let h = card('<h3>👪 Entrega de calificaciones a padres</h3><label class="fld"><span>Entrega</span><select class="inp" data-ch="jp-cur">' + Object.values(d.ent).sort((x, y) => x.fecha < y.fecha ? -1 : 1).map(x => '<option value="' + x.id + '"' + (x.id === e.id ? ' selected' : '') + '>' + esc(x.nombre + ' · ' + u.fCorta(x.fecha)) + '</option>').join('') + '</select></label>' +
      '<div class="fgrid"><label class="fld"><span>Nombre</span><input class="inp" data-ch="jp-f" data-k="nombre" value="' + esc(e.nombre) + '"></label><label class="fld"><span>Fecha</span><input class="inp" type="date" data-ch="jp-f" data-k="fecha" value="' + esc(e.fecha) + '"></label><label class="fld"><span>Hora</span><input class="inp" type="time" data-ch="jp-f" data-k="hora" value="' + esc(e.hora || '') + '"></label><label class="fld"><span>Calificaciones de</span><select class="inp" data-ch="jp-f" data-k="pid">' + ps.map(p => '<option value="' + p.id + '"' + (p.id === e.pid ? ' selected' : '') + '>' + esc(p.nombre) + '</option>').join('') + '</select></label></div>' +
      '<div class="row gap wrap mt">' + btn('📽 Proyectar la junta', 'jp-proj', '', 'primary') + btn('🖨 Agenda y estatus', 'jp-imp', '', '') + btn('🖨 Hojas por alumno (QR)', 'jp-hojas', '', '') + btn('🖨 Lista de firmas', 'jp-firmas', '', '') + btn('🖨 Celular y mochila (firmas)', 'jp-formatos', '', '') + btn('💬 Aviso para casa', 'jp-aviso', '', '') + btn('+ Nueva entrega', 'jp-nueva', '', 'small ghost') + '</div>');
    h += card('<h3>📊 Estatus del grupo · ' + esc(R.p.nombre || '') + '</h3>' + kpiHTML(R) +
      (R.top.length ? '<p class="small"><b>⭐ Destacados:</b> ' + nomL(R.top) + '</p>' : '') +
      '<p class="small"><b>⚠️ Van abajo de ' + (minA() / 10) + ':</b> ' + (R.rep.length ? nomL(R.rep) : 'nadie 🎉') + '</p>' +
      (R.faltas.length ? '<p class="small"><b>📅 Con 3 o más faltas:</b> ' + R.faltas.map(x => esc(x.a.num + '. ' + u.corto(x.a.nombre)) + ' (' + x.f + ' faltas)').join(' · ') + '</p>' : '') +
      '<p class="muted small">Sale de tus calificaciones y pase de lista de ' + esc(R.p.nombre || 'el parcial') + '. En la proyección se puede ocultar los nombres.</p>');
    h += card('<h3>📝 Puntos a tratar (' + e.puntos.filter(p => p.visto).length + '/' + e.puntos.length + ' vistos)</h3>' + e.puntos.map((p, i) => '<div class="momento"><label class="ck"><input type="checkbox" data-ch="jp-p" data-id="' + p.id + '" data-k="visto"' + (p.visto ? ' checked' : '') + '><span><b>' + (i + 1) + '.</b> ' + esc(p.t) + '</span></label>' +
      (p.det ? '<details class="sub"><summary class="small">Detalle</summary><ol class="small">' + p.det.split('\n').filter(Boolean).map(x => '<li>' + esc(x) + '</li>').join('') + '</ol></details>' : '') +
      '<textarea class="inp small" rows="1" data-ch="jp-p" data-id="' + p.id + '" data-k="nota" placeholder="Nota o acuerdo de este punto">' + esc(p.nota || '') + '</textarea><div class="row end"><button type="button" class="linkbtn small" data-act="jp-borra" data-id="' + p.id + '">Quitar</button></div></div>').join('') +
      '<div class="row gap wrap mt"><input class="inp" id="jp-nuevo" placeholder="Agregar un punto"><button type="button" class="btn small" data-act="jp-agrega">+ Agregar</button></div>' +
      '<details class="sub"><summary class="small">Pegar la agenda del director (un punto por renglón)</summary><textarea class="inp" id="jp-pega" rows="5" placeholder="1.- Estatus del grupo.&#10;2.- …"></textarea><div class="row gap mt">' + btn('Reemplazar los puntos', 'jp-pegar', '', 'small') + '</div><p class="muted small">Si te la manda en foto, cópiale el texto con la cámara del celular (Google Lens o Live Text) y pégalo aquí. El «Estatus del grupo» se llena solo.</p></details>' +
      '<label class="fld mt"><span>Acuerdos generales</span><textarea class="inp" rows="3" data-ch="jp-f" data-k="acuerdos" placeholder="Lo que se acordó con los padres">' + esc(e.acuerdos || '') + '</textarea></label>');
    h += card('<h3>🙋 ¿Quién vino? (' + vino + '/' + al.length + ')</h3><ul class="plain">' + al.map(a => { const v = (e.asis || {})[a.id]; return '<li class="row between gap"><label class="ck small"><input type="checkbox" data-ch="jp-asis" data-aid="' + a.id + '"' + (v ? ' checked' : '') + '><span>' + esc(a.num + '. ' + u.corto(a.nombre)) + '</span></label>' + (v ? '<span class="chip ok">vino</span>' : '<button type="button" class="linkbtn small" data-act="jp-wa" data-aid="' + a.id + '">💬 Mandar su resumen</button>') + '</li>'; }).join('') + '</ul>' +
      '<p class="muted small">A quien no vino le mandas por WhatsApp su calificación y el enlace a su consulta (sin su nombre en el enlace). Si guardaste el teléfono en Alumnos, se abre directo su chat.</p>');
    const hoy = u.today(), fs = (d.fechas || []).filter(x => x.f >= hoy).sort((x, y) => x.f < y.f ? -1 : 1);
    h += card('<h3>📅 Fechas que vienen</h3>' + (fs.length ? '<ul class="plain small">' + fs.map(x => '<li><b>' + esc(u.fCorta(x.f)) + '</b> · ' + esc(x.t) + '</li>').join('') + '</ul>' : '<p class="small muted">No hay fechas próximas.</p>') +
      '<div class="row gap wrap mt"><input class="inp" type="date" id="jp-ff" style="max-width:11em"><input class="inp" id="jp-ft" placeholder="Qué pasa ese día"><button type="button" class="btn small" data-act="jp-fecha">+ Fecha</button></div><p class="muted small">Las de los próximos 3 días también te salen en Inicio.</p>');
    return { t: 'Entrega de calificaciones', h: h };
  };
  CH['jp-cur'] = el => { const g = D.grupoActual(); put(g, d => { d.cur = el.value; }); };
  CH['jp-f'] = el => { const g = D.grupoActual(); put(g, d => { J.ent(g, d)[el.dataset.k] = el.value; }); };
  CH['jp-p'] = el => { const g = D.grupoActual(); put(g, d => { const p = J.ent(g, d).puntos.find(x => x.id === el.dataset.id); if (p) p[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value; }); };
  CH['jp-asis'] = el => { const g = D.grupoActual(); put(g, d => { const e = J.ent(g, d); e.asis = e.asis || {}; if (el.checked) e.asis[el.dataset.aid] = true; else delete e.asis[el.dataset.aid]; }); };
  A['jp-borra'] = el => { if (!confirm('¿Quitar este punto?')) return; const g = D.grupoActual(); put(g, d => { const e = J.ent(g, d); e.puntos = e.puntos.filter(x => x.id !== el.dataset.id); }); };
  A['jp-agrega'] = () => { const i = document.getElementById('jp-nuevo'), t = i && i.value.trim(); if (!t) return; const g = D.grupoActual(); put(g, d => { J.ent(g, d).puntos.push({ id: u.uid('p'), t: t }); }); };
  // pega el texto de la agenda: los subpuntos se reconocen por la sangría o, si no hay, porque su número vuelve a empezar
  J.parsea = txt => { const L = String(txt || '').split(/\r?\n/).filter(x => x.trim()), out = []; let top = 0, sub = 0;
    const auto = t => /estatus/i.test(t) ? 'estatus' : /mochila/i.test(t) ? 'mochila' : /calendario/i.test(t) ? 'fechas' : /entrega de calificaciones/i.test(t) ? 'boletas' : '';
    const ind = l => /^(\s{2,}|\t)/.test(l), num = l => { const m = /^\s*(\d+)\s*[.)]+\s*-?\s*(.*)$/.exec(l); return m ? [Number(m[1]), m[2]] : null; }, conInd = L.some(ind);
    L.forEach((l, i) => { const m = num(l), t = (m ? m[1] : l).replace(/\s+/g, ' ').trim(), n = m ? m[0] : null; if (!t) return; let esSub;
      if (!out.length) esSub = false; else if (!m) esSub = true; else if (conInd) esSub = ind(l);
      else if (sub) { if (n === sub + 1 && n === top + 1) { const sig = L.slice(i + 1).map(num).find(Boolean); esSub = !!sig && sig[0] === n + 1; } else esSub = n !== top + 1; }
      else esSub = n === 1 || n <= top;
      if (esSub) { const p = out[out.length - 1]; p.det = (p.det ? p.det + '\n' : '') + t; sub = n || sub; }
      else { out.push({ id: u.uid('p'), t: t.replace(/\.$/, ''), auto: auto(t) }); top = n || top + 1; sub = 0; } });
    return out; };
  A['jp-pegar'] = () => { const i = document.getElementById('jp-pega'), P = J.parsea(i && i.value); if (!P.length) { u.toast('Pega primero los puntos', 'err'); return; } if (!confirm('¿Reemplazar los ' + P.length + ' puntos de esta entrega?')) return; const g = D.grupoActual(); put(g, d => { J.ent(g, d).puntos = P; }); u.toast(P.length + ' puntos', 'ok'); };
  A['jp-nueva'] = () => { const g = D.grupoActual(), n = prompt('Nombre de la entrega', 'Entrega de calificaciones'); if (!n) return; const id = u.uid('e'), f = u.today();
    put(g, d => { d.ent[id] = { id: id, nombre: n.trim(), fecha: f, hora: '19:00', pid: pDe(f), puntos: [{ id: 'p1', t: 'Estatus del grupo', auto: 'estatus' }, { id: 'p2', t: 'Entrega de calificaciones', auto: 'boletas' }], asis: {}, acuerdos: '' }; d.cur = id; }); };
  A['jp-fecha'] = () => { const f = (document.getElementById('jp-ff') || {}).value, t = ((document.getElementById('jp-ft') || {}).value || '').trim(); if (!f || !t) { u.toast('Pon la fecha y qué pasa', 'err'); return; } const g = D.grupoActual(); put(g, d => { d.fechas = (d.fechas || []).concat([{ f: f, t: t }]); }); };

  /* ---------- WhatsApp a quien no vino ---------- */
  J.msg = (g, a, e, url) => { const k = C.cal(g, e.pid, a.id), o = C.oficial(k.final), p = C.parcial(e.pid) || {};
    return 'Buen día. Le escribe ' + (D.cfg().docente || 'el docente') + ', de Técnico en Mecatrónica, grupo ' + g.nombre + '. Hoy fue la ' + e.nombre.toLowerCase() + ' y no pudimos verle. ' + u.corto(a.nombre) + ' lleva ' + (o == null ? 'su calificación en proceso' : o + ' de calificación') + ' en el ' + (p.nombre || 'parcial') + '. Aquí puede ver el detalle y lo que le falta: ' + url + ' Quedo a sus órdenes para cualquier duda.'; };
  A['jp-wa'] = async el => { const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid) || D.alumnos(g).find(x => x.id === el.dataset.aid), e = J.ent(g); if (!a || !E.casa) return;
    const url = await E.casa.consultaURL(g, a, e.pid); window.open(E.casa.wa(a, J.msg(g, a, e, url)), '_blank'); };

  /* ---------- impresos ---------- */
  const fl = f => u.fLarga(f);
  const cab = (g, e, t) => '<h2 class="jp-h">' + esc(t) + '</h2><p class="jp-sub">' + esc((D.cfg().plantel || 'CETAC 19') + ' · Técnico en Mecatrónica · ' + g.nombre + ' · ' + fl(e.fecha) + (e.hora ? ', ' + e.hora + ' h' : '')) + '</p>';
  J.agendaHTML = g => { const e = J.ent(g), R = J.estatus(g, e.pid), fil = (D.cfg().docente || '');
    return '<div class="pr jp-pr">' + cab(g, e, 'Junta de padres · ' + e.nombre) +
      '<h3>Estatus del grupo · ' + esc(R.p.nombre || '') + '</h3><table class="jp-t"><tr><th>Promedio</th><th>Aprueban</th><th>En riesgo</th><th>Asistencia</th><th>Padres presentes</th></tr><tr><td>' + (R.prom == null ? '—' : R.prom) + '</td><td>' + R.apr.length + ' de ' + R.con + '</td><td>' + R.rep.length + '</td><td>' + (R.pa == null ? '—' : R.pa + ' %') + '</td><td>' + Object.keys(e.asis || {}).length + ' de ' + R.n + '</td></tr></table>' +
      (R.top.length ? '<p><b>Destacados:</b> ' + nomL(R.top) + '</p>' : '') + '<p><b>Van abajo de ' + (minA() / 10) + ':</b> ' + (R.rep.length ? nomL(R.rep) : 'nadie') + '</p>' +
      '<h3>Puntos a tratar</h3><ol class="jp-ol">' + e.puntos.map(p => '<li><span class="jp-bx">' + (p.visto ? '✓' : '') + '</span><b>' + esc(p.t) + '</b>' + (p.det ? '<ol type="a">' + p.det.split('\n').filter(Boolean).map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>' : '') + (p.nota ? '<p class="jp-nota">' + esc(p.nota) + '</p>' : '') + '</li>').join('') + '</ol>' +
      '<h3>Acuerdos</h3>' + (e.acuerdos ? '<p>' + esc(e.acuerdos).replace(/\n/g, '<br>') + '</p>' : '<div class="jp-lin"></div><div class="jp-lin"></div><div class="jp-lin"></div>') +
      '<p class="jp-firma">' + esc(fil) + '<br>Docente</p></div>'; };
  A['jp-imp'] = () => { const g = D.grupoActual(); E.print.run(J.agendaHTML(g), { title: 'Junta de padres · ' + g.nombre }); };
  J.firmasHTML = g => { const e = J.ent(g), al = D.alumnos(g);
    return '<div class="pr jp-pr">' + cab(g, e, 'Lista de asistencia de padres de familia') + '<table class="jp-t jp-fi"><thead><tr><th>No.</th><th>Alumno</th><th>Nombre de quien asiste</th><th>Parentesco</th><th>Firma</th></tr></thead><tbody>' + al.map(a => '<tr><td>' + a.num + '</td><td>' + esc(a.nombre) + '</td><td></td><td></td><td></td></tr>').join('') + '</tbody></table></div>'; };
  A['jp-firmas'] = () => { const g = D.grupoActual(); E.print.run(J.firmasHTML(g), { title: 'Lista de firmas · ' + g.nombre }); };
  J.formatosHTML = g => { const e = J.ent(g), al = D.alumnos(g), tab = cols => '<table class="jp-t jp-fi"><thead><tr><th>No.</th><th>Alumno</th>' + cols.map(c => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>' + al.map(a => '<tr><td>' + a.num + '</td><td>' + esc(a.nombre) + '</td>' + cols.map(() => '<td></td>').join('') + '</tr>').join('') + '</tbody></table>';
    return '<div class="bt-pg"><div class="pr jp-pr">' + cab(g, e, 'Propuesta para regular el uso del celular') + '<ol class="jp-ol jp-cel">' + J.CEL.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol><p class="small">Enterados de la propuesta (para el reglamento que firmarán docentes, padres de familia y alumnos):</p>' + tab(['Firma del padre, madre o tutor', 'Firma del alumno']) + '</div></div>' +
      '<div class="bt-pg"><div class="pr jp-pr">' + cab(g, e, 'Autorización de revisión de mochila') + '<p>Los que firmamos, padre, madre o tutor de los alumnos del grupo ' + esc(g.nombre) + ', autorizamos que personal del plantel revise la mochila de nuestro hijo o hija dentro de las instalaciones, en su presencia, como medida de seguridad para toda la comunidad escolar.</p>' + tab(['Nombre del padre, madre o tutor', 'Firma']) + '</div></div>'; };
  A['jp-formatos'] = () => { const g = D.grupoActual(); E.print.run(J.formatosHTML(g), { title: 'Formatos de firma · ' + g.nombre }); };
  J.hojaAlumno = (g, a, e, url) => { const ps = D.parciales(), m = minA(), r = E.aprobar ? E.aprobar.analiza(g, e.pid, a.id) : null;
    const fila = ps.map(p => { const k = C.cal(g, p.id, a.id), o = C.oficial(k.final), as = (p.inicio || '') <= u.today() ? C.asis(g, p, a.id) : null; return '<td>' + (o == null ? '—' : '<b' + (k.final < m ? ' class="jp-mal"' : '') + '>' + o + '</b>') + '<br><small>' + (as && as.ses ? as.f + ' falta' + (as.f === 1 ? '' : 's') : '') + '</small></td>'; }).join('');
    const pend = r ? r.pend.slice(0, 3) : [];
    return '<div class="jp-ha"><div class="jp-ha-top"><div><h3>' + esc(a.nombre) + '</h3><p class="jp-sub">No. ' + a.num + ' · ' + esc(g.nombre) + ' · Técnico en Mecatrónica · ' + esc(e.nombre) + ' · ' + esc(u.fCorta(e.fecha)) + '</p>' +
      '<table class="jp-t"><tr>' + ps.map(p => '<th>' + esc(p.nombre) + '</th>').join('') + '</tr><tr>' + fila + '</tr></table>' +
      (pend.length ? '<p class="jp-pend"><b>Lo que le falta:</b> ' + pend.map(x => esc(x.t) + (x.gain != null ? ' (sube ' + (Math.round(x.gain * 10) / 10) + ')' : '')).join(' · ') + '</p>' : '<p class="jp-pend"><b>Lo que le falta:</b> nada pendiente 👍</p>') +
      '<p class="jp-obs"><b>Observaciones del docente:</b></p><div class="jp-lin"></div><div class="jp-lin"></div><p class="jp-obs"><b>Compromisos en casa:</b></p><div class="jp-lin"></div><div class="jp-lin"></div></div><div class="jp-qr">' + (E.cam ? E.cam.qrSVG(url, 'jp-qrsvg', 'L') : '') + '<small>Escanéelo para ver el detalle</small></div></div>' +
      '<div class="jp-rec">Recibí: ______________________________ &nbsp; Firma: _______________</div></div>'; };
  A['jp-hojas'] = async () => { const g = D.grupoActual(), e = J.ent(g), al = D.alumnos(g); if (E.cam && E.cam.qrListo) await E.cam.qrListo(); u.toast('Preparando…', 'ok', 1500);
    const hs = []; for (const a of al) hs.push(J.hojaAlumno(g, a, e, E.casa ? await E.casa.consultaURL(g, a, e.pid) : location.href));
    let out = ''; for (let i = 0; i < hs.length; i += 2) out += '<div class="bt-pg"><div class="pr jp-pr jp-hojas">' + hs[i] + '<div class="jp-corte">✂</div>' + (hs[i + 1] || '') + '</div></div>';
    E.print.run(out, { title: 'Hojas para padres · ' + g.nombre, margin: '8mm' }); };

  /* ---------- aviso para casa ---------- */
  J.aviso = (g, e) => '📢 *AVISO IMPORTANTE*\nSe informa a madre, padre y/o tutor(a) de los alumnos de Técnico en Mecatrónica, grupo ' + g.nombre + ', que el próximo *' + fl(e.fecha) + '* a las *' + (e.hora || '19:00') + ' h* se llevará a cabo la *' + e.nombre.toLowerCase() + '*.\n\nSu asistencia es importante y necesaria: se dará a conocer el desempeño académico de su hijo(a) y se brindará información relevante para su seguimiento escolar.\n\nAgradecemos de antemano su puntualidad y participación. ¡Los esperamos!\n' + (D.cfg().docente || '');
  A['jp-aviso'] = () => { const g = D.grupoActual(), e = J.ent(g), t = J.aviso(g, e); E.ui.juAviso = t;
    E.modal.open('💬 Aviso para casa', '<textarea class="inp" rows="11" id="jp-av">' + esc(t) + '</textarea><div class="row gap wrap mt">' + btn('📋 Copiar', 'jp-av-copia', '', 'primary') + '<a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(t) + '">Abrir WhatsApp</a></div><p class="muted small">Usa la fecha y hora de la entrega elegida. Puedes editar el texto antes de copiarlo.</p>'); };
  A['jp-av-copia'] = async () => { const i = document.getElementById('jp-av'); const ok = await u.copy(i ? i.value : E.ui.juAviso); u.toast(ok ? 'Aviso copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };

  /* ---------- proyectar ---------- */
  J.slides = (g, anon) => { const e = J.ent(g), R = J.estatus(g, e.pid), nm = arr => anon ? arr.length + (arr.length === 1 ? ' alumno' : ' alumnos') : arr.map(x => u.corto(x.a.nombre)).join(', ');
    const sl = [{ k: 'cover', sub: 'Técnico en Mecatrónica · ' + g.nombre, h: e.nombre, p: fl(e.fecha) + (e.hora ? ' · ' + e.hora + ' h' : '') + ' · ¡Gracias por venir!' }];
    e.puntos.forEach((p, i) => { const t = (i + 1) + '. ' + p.t;
      if (p.auto === 'estatus') sl.push({ k: 'html', h: t, html: kpiHTML(R) + '<ul class="jp-pl"><li>⭐ Destacados: ' + esc(R.top.length ? nm(R.top) : '—') + '</li><li>⚠️ Van abajo de ' + (minA() / 10) + ': ' + esc(R.rep.length ? nm(R.rep) : 'nadie 🎉') + '</li><li>📅 Con 3 o más faltas: ' + esc(R.faltas.length ? nm(R.faltas) : 'nadie') + '</li></ul>' });
      else if (p.det) sl.push({ k: 'list', h: t, items: p.det.split('\n').filter(Boolean) });
      else sl.push({ k: 'list', h: t, items: [p.nota || 'Lo platicamos'] }); });
    sl.push({ k: 'cover', sub: g.nombre, h: '¡Gracias!', p: 'Cualquier duda, con gusto la platicamos.' });
    return sl; };
  A['jp-proj'] = () => { const g = D.grupoActual(), anon = !confirm('¿Mostrar los nombres de los alumnos en la proyección?\n\nAceptar = con nombres · Cancelar = solo cuántos'); E.proj.abrir({ id: 'entregacal', titulo: 'Entrega de calificaciones' }, J.slides(g, anon)); };

  /* ---------- en «Junta de padres» (citatorios): enlace a la entrega de calificaciones ---------- */
  if (V.junta) { const vj = V.junta; V.junta = function (id) { const o = vj.apply(null, arguments); if (!o || !o.h || id) return o; o.h = card('<p class="small">¿Es la entrega de calificaciones con la agenda del director? ' + H.link('👪 Abrir Entrega de calificaciones', 'entregacal', 'small') + '</p>') + o.h; return o; }; }

  /* ---------- en Inicio: fechas de los próximos 3 días ---------- */
  if (V.inicio) { const vi = V.inicio; V.inicio = function () { const o = vi.apply(null, arguments), g = D.grupoActual(); if (!o || !o.h || !g) return o;
    const hoy = u.today(), fs = (J.doc(g).fechas || []).filter(x => x.f >= hoy && u.diffDays(hoy, x.f) <= 3).sort((x, y) => x.f < y.f ? -1 : 1); if (!fs.length) return o;
    o.h = card('<p class="small">📅 ' + fs.map(x => '<b>' + esc(x.f === hoy ? 'Hoy' : u.fCorta(x.f)) + '</b>: ' + esc(x.t)).join(' · ') + '</p>') + o.h; return o; }; }
})();

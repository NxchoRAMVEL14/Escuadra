/* Escuadra · vistas y acciones de la interfaz. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views = {};
  const A = E.actions = E.actions || {}, CH = E.changes = E.changes || {}, IN = E.inputs = E.inputs || {};
  E.ui = Object.assign({
    ideasQ: '', ideasF: 'todas', print: { pid: null, marcas: true, ac: 0, modo: 'alumnos', equipos: 6 },
    timer: { total: 600, left: 600, run: false, end: 0, h: null }, azar: { bag: [], fecha: null, last: null },
    equipos: { n: 4, teams: null }, importData: null
  }, E.ui || {});

  /* ---------- íconos ---------- */
  const IC = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    check: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    grade: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/>',
    print: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a5 5 0 0 1 5.5 5.8"/>',
    cal: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V4.5"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chevL: '<path d="M15 18l-6-6 6-6"/>', chevR: '<path d="M9 18l6-6-6-6"/>',
    dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.2"/><circle cx="15.5" cy="15.5" r="1.2"/><circle cx="12" cy="12" r="1.2"/>',
    team: '<circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2.3"/><circle cx="19" cy="10" r="2.3"/><path d="M7 20a5 5 0 0 1 10 0M1.5 19a3.6 3.6 0 0 1 5-3.3M22.5 19a3.6 3.6 0 0 0-5-3.3"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5v.5"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',
    download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
    cloud: '<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 10 4 4 0 0 1 18 18z"/>',
    screen: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    pause: '<path d="M9 5v14M15 5v14" stroke-width="3"/>',
    play: '<path d="M8 5l11 7-11 7z" fill="currentColor"/>',
    stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="1.5" fill="currentColor"/>',
    board: '<rect x="3" y="3.5" width="18" height="12.5" rx="1.5"/><path d="M8 20.5l2-4.5M16 20.5l-2-4.5M7 8h10M7 11.5h6"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/><path d="M16.5 3.5l1.5 1.5 3-3"/>'
  };
  E.icon = (n, c) => '<svg class="ic ' + (c || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[n] || '') + '</svg>';
  E.logo = () => '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="15" fill="#0e5e5a"/><path d="M15 51V13l38 38z" fill="#fff"/><path d="M22 44V30l14 14z" fill="#0e5e5a"/><circle cx="46" cy="18" r="5.5" fill="#f0a500"/></svg>';
  const icon = E.icon;

  const CAT_LBL = { examen: 'Examen', trabajos: 'Libreta/Proyecto/Bitácora', diagnostico: 'Diagnóstico' };
  const TEMAS_EVAL = ['Dibujo técnico y FreeCAD (Submódulo 1)', 'Mecanismos y pares cinemáticos', 'Grados de libertad y cuatro barras', 'Transmisiones: engranes, poleas y tornillo', 'Modelado y ensamble en FreeCAD', 'Construcción del mecanismo', 'Neumática e hidráulica: principios', 'Simbología y circuitos ISO 1219', 'Electroneumática y motores DC'];
  E.CAT_LBL = CAT_LBL; E.TEMAS_EVAL = TEMAS_EVAL;
  /* ---------- piezas ---------- */
  const card = (h, cls, attrs) => '<section class="card ' + (cls || '') + '" ' + (attrs || '') + '>' + h + '</section>';
  const btn = (label, act, attrs, cls) => '<button type="button" class="btn ' + (cls || '') + '" data-act="' + act + '" ' + (attrs || '') + '>' + label + '</button>';
  const link = (label, to, cls) => '<a class="btn ' + (cls || '') + '" href="#/' + to + '">' + label + '</a>';
  const gclass = v => { if (v == null) return 'na'; const c = D.cfg(); return v >= (Number(c.umbralBien) || 80) ? 'ok' : v >= c.minAprob ? 'warn' : 'bad'; };
  const gfmt = v => v == null ? '—' : Math.round(v);
  const noGroup = () => ({ t: 'Escuadra', h: card('<div class="empty"><h3>No hay grupo configurado</h3><p>Ve a Ajustes → Grupo para crearlo.</p>' + link('Ir a Ajustes', 'ajustes', 'primary') + '</div>') });
  const needAlumnos = t => ({ t: t, h: card('<div class="empty"><h3>Primero importa tu lista</h3><p>Sube el Excel de listas de la escuela o pega los nombres.</p>' + link(icon('upload') + ' Importar lista', 'alumnos', 'primary') + '</div>') });
  const fieldIn = (label, attrs, val, type) => '<label class="fld"><span>' + label + '</span><input type="' + (type || 'text') + '" value="' + esc(val == null ? '' : val) + '" ' + attrs + '></label>';
  E.h = { card: card, btn: btn, link: link, gclass: gclass, gfmt: gfmt, fieldIn: fieldIn, noGroup: noGroup, needAlumnos: needAlumnos };
  E.modal = {
    open(title, body) { const m = document.getElementById('modal'); m.innerHTML = '<div class="sheet" role="dialog" aria-modal="true"><div class="sheet-h"><h3>' + esc(title) + '</h3><button type="button" class="iconbtn" data-act="modal-close" aria-label="Cerrar">' + icon('x') + '</button></div><div id="modal-body">' + body + '</div></div>'; m.hidden = false; },
    body(html) { const b = document.getElementById('modal-body'); if (b) b.innerHTML = html; },
    close() { const m = document.getElementById('modal'); m.hidden = true; m.innerHTML = ''; }
  };
  A['modal-close'] = () => E.modal.close();
  A.go = el => { location.hash = '#/' + el.dataset.to; };

  /* =================== INICIO =================== */
  V.inicio = () => {
    const c = D.cfg(), g = D.grupoActual(), hoy = u.today(), p = C.parcialActual(hoy), ps = D.parciales();
    let h = '<div class="hello"><div><h1>Hola, ' + esc(c.docenteCorto || 'profe') + '</h1><p class="muted">' + u.cap(u.fLargaA(hoy)) + '</p></div>' + (g ? '<span class="chip brand">' + esc(g.nombre) + '</span>' : '') + '</div>';
    if (g && !D.alumnos(g).length) h += card('<h3>' + icon('upload') + ' Primer paso: importa tu lista</h3><p>Sube el Excel de listas de la escuela (eliges la hoja "LISTA DE ASISTENCIA 3A MEC") o pega los nombres. Tus alumnos se guardan solo en tu cuenta, nunca en el código.</p>' + link('Importar lista', 'alumnos', 'primary'), 'accent');
    const cap = ps.filter(x => x.captura >= hoy).sort((a, b) => a.captura.localeCompare(b.captura))[0];
    if (cap) {
      const d = u.diffDays(hoy, cap.captura), urg = d <= 3 ? 'bad' : d <= 10 ? 'warn' : 'ok';
      h += card('<div class="deadline ' + urg + '"><div class="big">' + (d === 0 ? '¡Hoy!' : d) + '</div><div><div class="kicker">' + (d === 0 ? 'Hoy toca' : (d === 1 ? 'día para' : 'días para')) + ' capturar calificaciones</div><h3>' + esc(cap.nombre) + ' · ' + u.cap(u.fLarga(cap.captura)) + '</h3><p class="muted small">El parcial cierra el ' + u.fLarga(cap.fin) + '. Ya está en tu Google Calendar con recordatorios.</p></div></div>');
    }
    const av = C.avisos(hoy);
    if (av.length) h += card('<h3>' + icon('alert') + ' Avisos</h3><ul class="vlist">' + av.map(a => '<li class="' + a.nivel + '">' + esc(a.txt) + '</li>').join('') + '</ul>');
    if (g) {
      const bl = C.bloquesDia(g, hoy), asu = C.esAsueto(hoy); let t = '';
      if (asu) t = '<p>🏖️ Hoy es asueto.</p>';
      else if (bl.length && C.esClase(g, hoy)) { const rs = E.clases && E.clases.resumenDia(g, hoy); t = '<ul class="blocks">' + (rs ? rs.map(r => '<li><b>' + esc(r.b.inicio) + '–' + esc(r.b.fin) + '</b> · ' + esc(r.txt) + '</li>') : bl.map(b => '<li><b>' + esc(b.inicio) + '–' + esc(b.fin) + '</b> · ' + b.horas + ' h</li>')).join('') + '</ul><div class="row gap wrap">' + link(icon('check') + ' Pasar lista', 'lista/' + hoy, 'primary') + (rs ? link(icon('board') + ' Guion de hoy', 'clase/' + hoy) : '') + '</div>';
        const nx = C.siguienteClase(g, hoy), rn = nx && E.clases && E.clases.resumenDia(g, nx);
        if (rn) t += '<p class="small mt"><b>Próxima clase (' + u.fLarga(nx) + '):</b> ' + esc(rn.map(r => r.txt).join(' · ')) + ' · <a href="#/clase/' + nx + '">Preparar ›</a></p>'; }
      else { const nx = C.siguienteClase(g, hoy), rs = nx && E.clases && E.clases.resumenDia(g, nx); t = '<p class="muted">Hoy no tienes clase con ' + esc(g.nombre) + '.' + (nx ? ' Próxima: <b>' + u.fLarga(nx) + '</b>.' : '') + '</p>' + (rs ? '<ul class="blocks">' + rs.map(r => '<li><b>' + esc(r.b.inicio) + '</b> · ' + esc(r.txt) + '</li>').join('') + '</ul>' + link(icon('board') + ' Preparar la clase', 'clase/' + nx, 'primary') : ''); }
      h += card('<h3>' + icon('cal') + ' Hoy</h3>' + t);
    }
    if (g && p) {
      const hr = C.horas(g, p), sm = D.submodulo(g, p.id), pct = hr.disp ? hr.imp / hr.disp * 100 : 0;
      h += card('<h3>' + icon('grade') + ' ' + esc(p.nombre) + (sm ? ' · Submódulo ' + sm.num : '') + '</h3>' + (sm ? '<p class="muted small">' + esc(sm.nombre) + '</p>' : '') +
        '<div class="bar"><span style="width:' + Math.min(100, pct) + '%"></span></div><div class="stats"><div><b>' + hr.imp + '</b><span>h impartidas</span></div><div><b>' + hr.disp + '</b><span>h en tu calendario</span></div>' + (hr.programa ? '<div><b>' + hr.programa + '</b><span>h del programa</span></div>' : '') + '</div>' +
        (hr.programa && hr.disp < hr.programa ? '<p class="note warn">Tienes ' + (hr.programa - hr.disp) + ' h menos de las que marca el programa: prioriza las actividades clave.</p>' : ''));
      if (E.semaforo) h += E.semaforo.resumenHTML(g);
      const R = C.riesgos(g, p);
      if (R.length) h += card('<h3>' + icon('alert') + ' Alumnos que necesitan atención</h3><ul class="risk">' + R.slice(0, 6).map(r => '<li><a href="#/alumno/' + r.id + '">' + esc(r.nombre) + '</a> <span class="chip ' + r.kind + '">' + esc(r.txt) + '</span></li>').join('') + '</ul>' +
        (R.length > 6 ? '<p class="small mt"><a href="#/calificaciones/' + p.id + '">Ver los ' + R.length + ' casos en Calificaciones ›</a></p>' : ''));
    }
    const smk = g && p && (g.submodulos || {})[p.id] ? 'II-' + g.submodulos[p.id] : null;
    const temasSm = smk ? E.TEMAS.filter(t => t.sm === smk) : [];
    if (temasSm.length) h += card('<h3>' + icon('screen') + ' Temas para proyectar</h3><p class="muted small">' + temasSm.length + ' temas del ' + esc(SM_LBL[smk] || '') + ' listos para tu clase.</p><ul class="risk">' + temasSm.slice(0, 4).map(t => '<li><a href="#/tema/' + t.id + '">' + esc(t.titulo) + '</a>' + btn('📽', 'proj-open', 'data-id="' + t.id + '" aria-label="Proyectar"', 'small ghost') + '</li>').join('') + '</ul>' + link('Ver todos', 'temas/' + smk, 'small'));
    const idea = ideaDelDia(g, p);
    if (idea) h += card('<h3>' + icon('bulb') + ' Idea del día</h3><p><b>' + esc(idea.titulo) + '</b></p><p class="muted small">' + esc(idea.obj) + '</p>' + link('Ver idea', 'ideas/' + idea.id, 'small'));
    h += '<div class="quick">' +
      '<a href="#/imprimir">' + icon('print') + 'Imprimir listas</a>' +
      '<a href="#/herramientas">' + icon('dice') + 'Al azar y equipos</a>' +
      '<a href="#/bitacora">' + icon('book') + 'Bitácora del día</a>' +
      '<a href="#/planeacion">' + icon('doc') + 'Planeaciones</a>' +
      '<a href="#/temas">' + icon('screen') + 'Temas para proyectar</a>' +
      '<a href="#/ideas">' + icon('bulb') + 'Ideas de clase</a>' +
      '<a href="#/perfiles">' + icon('profile') + 'Perfiles del grupo</a>' +
      '<a href="#/alumnos/paquete">' + icon('download') + 'Pegar datos de Claude</a></div>';
    return { t: 'Inicio', h: h };
  };
  function ideaDelDia(g, p) {
    const sm = g && p ? 'II-' + ((g.submodulos || {})[p.id] || '') : '';
    const list = E.IDEAS.filter(i => i.sm.indexOf(sm) >= 0 || i.sm.indexOf('gen') >= 0);
    if (!list.length) return null;
    const n = u.diffDays('2026-01-01', u.today());
    return list[((n % list.length) + list.length) % list.length];
  }

  /* =================== PASE DE LISTA =================== */
  V.lista = fecha => {
    const g = D.grupoActual(); if (!g) return noGroup();
    const al = D.alumnos(g); if (!al.length) return needAlumnos('Pase de lista');
    fecha = fecha || C.fechaListaDefault(g, u.today());
    const doc = S.get('asis:' + g.id + ':' + fecha), pd = S.get('part:' + g.id + ':' + fecha) || {};
    const prev = C.claseAnterior(g, fecha), next = C.siguienteClase(g, fecha), horas = C.horasDia(g, fecha), asu = C.esAsueto(fecha);
    const cnt = { A: 0, F: 0, R: 0, J: 0 }; al.forEach(a => { cnt[(doc && doc[a.id]) || 'A']++; });
    let h = '<div class="datebar"><button type="button" class="iconbtn" data-act="go" data-to="lista/' + (prev || fecha) + '" ' + (prev ? '' : 'disabled') + ' aria-label="Clase anterior">' + icon('chevL') + '</button>' +
      '<div class="datebox"><b>' + u.cap(u.fLarga(fecha)) + '</b><input type="date" class="dateinp" value="' + fecha + '" data-ch="lista-fecha" aria-label="Elegir fecha"></div>' +
      '<button type="button" class="iconbtn" data-act="go" data-to="lista/' + (next || fecha) + '" ' + (next ? '' : 'disabled') + ' aria-label="Clase siguiente">' + icon('chevR') + '</button></div>';
    if (asu) h += '<p class="note warn">Este día está marcado como asueto.</p>';
    else if (!horas) h += '<p class="note">No tienes clase este día en tu horario. Si diste clase extra, puedes pasar lista igual.</p>';
    else h += '<p class="muted small">' + C.bloquesDia(g, fecha).map(b => b.inicio + '–' + b.fin).join(' · ') + ' · ' + horas + ' h</p>';
    const pl = (n, s, p) => n + ' ' + (n === 1 ? s : p);
    h += doc ? '<p class="note ok">Lista registrada · ' + pl(cnt.A, 'asistencia', 'asistencias') + ' · ' + pl(cnt.F, 'falta', 'faltas') + (cnt.R ? ' · ' + pl(cnt.R, 'retardo', 'retardos') : '') + (cnt.J ? ' · ' + pl(cnt.J, 'justificada', 'justificadas') : '') + '</p>'
      : '<p class="note">Aún no registras esta lista. Toca la letra de quien falte: los demás quedan como presentes.</p>';
    h += '<div class="row wrap gap">' + (doc ? '' : btn('✓ Todos presentes', 'asis-todos', 'data-fecha="' + fecha + '"', 'primary')) +
      btn(icon('dice') + ' Al azar', 'azar', 'data-fecha="' + fecha + '"') + btn(icon('team') + ' Equipos', 'equipos', 'data-fecha="' + fecha + '"') +
      link(icon('timer') + ' Temporizador', 'herramientas') + (doc ? btn(icon('trash') + ' Borrar registro', 'asis-borrar', 'data-fecha="' + fecha + '"', 'ghost danger') : '') + '</div>';
    h += '<p class="legend"><span class="st st-A">A</span>Asistió <span class="st st-F">F</span>Falta <span class="st st-R">R</span>Retardo <span class="st st-J">J</span>Justificada · toca la letra para cambiarla; <b>+</b> suma participación; toca el <b>nombre</b> para anotar una observación (🤝 ❓ 💡…).</p>';
    h += '<ul class="slist">' + al.map(a => {
      const st = (doc && doc[a.id]) || 'A', n = Number(pd[a.id] || 0);
      return '<li class="srow ' + (doc ? '' : 'pending') + '"><button type="button" class="st st-' + st + '" data-act="asis" data-aid="' + a.id + '" data-fecha="' + fecha + '" aria-label="Estado de ' + esc(a.nombre) + ': ' + st + '">' + st + '</button>' +
        '<button type="button" class="sname obsbtn" data-act="obs-open" data-aid="' + a.id + '" data-fecha="' + fecha + '" aria-label="Anotar observación de ' + esc(a.nombre) + '"><span class="num">' + a.num + '</span>' + esc(a.nombre) + (E.obsIcons ? '<span class="obsi">' + E.obsIcons(g, fecha, a.id) + '</span>' : '') + '</button>' +
        '<div class="partc"><button type="button" class="mini" data-act="part" data-aid="' + a.id + '" data-fecha="' + fecha + '" data-d="-1" aria-label="Quitar participación">−</button><b>' + n + '</b><button type="button" class="mini plus" data-act="part" data-aid="' + a.id + '" data-fecha="' + fecha + '" data-d="1" aria-label="Sumar participación">+</button></div></li>';
    }).join('') + '</ul>';
    return { t: 'Pase de lista', h: h };
  };
  const ORDEN = ['A', 'F', 'R', 'J'];
  A.asis = el => {
    const g = D.grupoActual(), f = el.dataset.fecha, aid = el.dataset.aid;
    S.update('asis:' + g.id + ':' + f, doc => {
      if (!Object.keys(doc).length) D.alumnos(g).forEach(a => { doc[a.id] = 'A'; });
      doc[aid] = ORDEN[(ORDEN.indexOf(doc[aid] || 'A') + 1) % ORDEN.length];
    }, {});
    if (navigator.vibrate) navigator.vibrate(12);
  };
  A['asis-todos'] = el => { const g = D.grupoActual(), d = {}; D.alumnos(g).forEach(a => { d[a.id] = 'A'; }); S.put('asis:' + g.id + ':' + el.dataset.fecha, d); u.toast('Lista registrada: todos presentes', 'ok'); };
  A['asis-borrar'] = el => { if (!confirm('¿Borrar el registro de asistencia de este día?')) return; S.del('asis:' + D.grupoActual().id + ':' + el.dataset.fecha); };
  A.part = el => {
    const g = D.grupoActual(), d = Number(el.dataset.d), aid = el.dataset.aid;
    S.update('part:' + g.id + ':' + el.dataset.fecha, doc => { doc[aid] = Math.max(0, Number(doc[aid] || 0) + d); }, {});
  };
  CH['lista-fecha'] = el => { if (el.value) location.hash = '#/lista/' + el.value; };

  /* ---------- alumno al azar y equipos ---------- */
  function presentes(g, f) { const doc = S.get('asis:' + g.id + ':' + f); return D.alumnos(g).filter(a => !doc || ['A', 'R'].indexOf(doc[a.id] || 'A') >= 0); }
  function azarHTML(g, f) {
    const z = E.ui.azar, a = z.last && D.alumno(g, z.last);
    return '<p class="muted small">' + presentes(g, f).length + ' presentes · no se repite nadie hasta que pasen todos.</p><div class="picked">' + (a ? esc(a.nombre) : 'Toca "Elegir"') + '</div><div class="row gap wrap">' +
      btn(icon('dice') + ' Elegir', 'azar-pick', 'data-fecha="' + f + '"', 'primary') + (a ? btn('+1 participación', 'azar-part', 'data-fecha="' + f + '" data-aid="' + a.id + '"', 'accent') + btn('Observar', 'obs-open', 'data-fecha="' + f + '" data-aid="' + a.id + '"') : '') + '</div>';
  }
  A.azar = el => {
    const g = D.grupoActual(); if (!g || !D.alumnos(g).length) { u.toast('Primero importa tu lista', 'err'); return; }
    const f = el.dataset.fecha || u.today(); if (E.ui.azar.fecha !== f) E.ui.azar = { bag: [], fecha: f, last: null };
    E.modal.open('Alumno al azar', azarHTML(g, f));
  };
  A['azar-pick'] = el => {
    const g = D.grupoActual(), f = el.dataset.fecha, z = E.ui.azar, ids = presentes(g, f).map(a => a.id);
    z.bag = z.bag.filter(id => ids.indexOf(id) >= 0); if (!z.bag.length) z.bag = u.shuffle(ids.filter(id => id !== z.last));
    z.last = z.bag.pop() || null; E.modal.body(azarHTML(g, f));
  };
  A['azar-part'] = el => {
    const g = D.grupoActual(), f = el.dataset.fecha, aid = el.dataset.aid;
    S.update('part:' + g.id + ':' + f, d => { d[aid] = Number(d[aid] || 0) + 1; }, {});
    u.toast('+1 participación', 'ok'); E.modal.body(azarHTML(g, f));
  };
  function equiposHTML(f) {
    const e = E.ui.equipos;
    return '<div class="row gap wrap" style="align-items:flex-end"><label class="fld" style="margin:0;flex:1"><span>Integrantes por equipo</span><input type="number" min="2" max="10" value="' + e.n + '" data-ch="eq-n" id="eq-n" inputmode="numeric"></label>' + btn(icon('team') + ' Formar', 'eq-form', 'data-fecha="' + f + '"', 'primary') + '</div>' +
      '<label class="switch mt"><input type="checkbox" data-ch="eq-bal" ' + (e.bal ? 'checked' : '') + '><span>Equilibrar por nivel (perfil): cada equipo con alumnos fuertes y en proceso</span></label>' +
      (e.teams ? '<div class="teams mt">' + e.teams.map((t, i) => '<div class="team"><b>Equipo ' + (i + 1) + '</b><ol>' + t.map(a => '<li>' + esc(a.nombre) + '</li>').join('') + '</ol></div>').join('') + '</div><div class="row gap wrap mt">' + btn(icon('copy') + ' Copiar', 'eq-copy') + btn(icon('book') + ' Guardar en bitácora', 'eq-bit', 'data-fecha="' + f + '"') + '</div>' : '');
  }
  A.equipos = el => {
    const g = D.grupoActual(); if (!g || !D.alumnos(g).length) { u.toast('Primero importa tu lista', 'err'); return; }
    E.modal.open('Formar equipos', equiposHTML(el.dataset.fecha || u.today()));
  };
  CH['eq-bal'] = el => { E.ui.equipos.bal = el.checked; };
  CH['eq-n'] = el => { E.ui.equipos.n = Math.max(2, Math.min(10, Number(el.value) || 4)); };
  A['eq-form'] = el => {
    const g = D.grupoActual(), f = el.dataset.fecha, n = E.ui.equipos.n, list = u.shuffle(presentes(g, f));
    const k = Math.max(1, Math.round(list.length / n)); let teams = Array.from({ length: k }, () => []);
    if (E.ui.equipos.bal && E.perfil) teams = E.perfil.equiposBal(g, list, k); else list.forEach((a, i) => teams[i % k].push(a));
    E.ui.equipos.teams = teams; E.modal.body(equiposHTML(f));
  };
  const equiposTxt = () => (E.ui.equipos.teams || []).map((t, i) => 'Equipo ' + (i + 1) + ': ' + t.map(a => a.nombre).join(', ')).join('\n');
  A['eq-copy'] = async () => { const ok = await u.copy(equiposTxt()); u.toast(ok ? 'Equipos copiados' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['eq-bit'] = el => { const g = D.grupoActual(), id = u.uid('bit'); S.put('bit:' + id, { id: id, fecha: el.dataset.fecha || u.today(), grupoId: g.id, texto: 'Equipos formados:\n' + equiposTxt() }); u.toast('Guardado en la bitácora', 'ok'); };

  /* =================== HERRAMIENTAS =================== */
  const fmtT = s => { s = Math.max(0, Math.ceil(s)); return u.pad(Math.floor(s / 60)) + ':' + u.pad(s % 60); };
  V.herramientas = () => {
    const t = E.ui.timer, left = t.run ? (t.end - Date.now()) / 1000 : t.left, hoy = u.today();
    let h = '<section class="card" id="timer-card"><h3>' + icon('timer') + ' Temporizador</h3><div class="timer ' + (left <= 0 ? 'done' : '') + '" id="timer-disp">' + fmtT(left) + '</div>' +
      '<div class="row gap wrap center">' + [3, 5, 10, 15, 20, 25, 30].map(m => btn(m + ' min', 'tm-set', 'data-m="' + m + '"', 'small' + (t.total === m * 60 ? ' primary' : ''))).join('') + '</div>' +
      '<div class="row gap wrap center mt">' + (t.run ? btn('Pausar', 'tm-pause', '', 'primary') : btn('Iniciar', 'tm-start', '', 'primary')) + btn('Reiniciar', 'tm-reset') + btn('Pantalla completa', 'tm-fs') + '</div></section>';
    h += '<div class="grid2">' + card('<h3>' + icon('dice') + ' Alumno al azar</h3><p class="muted small">Elige entre los presentes de hoy (o todo el grupo si no has pasado lista) sin repetir.</p>' + btn('Abrir', 'azar', 'data-fecha="' + hoy + '"', 'primary')) +
      card('<h3>' + icon('team') + ' Formar equipos</h3><p class="muted small">Equipos balanceados al azar con los presentes; puedes guardarlos en la bitácora.</p>' + btn('Abrir', 'equipos', 'data-fecha="' + hoy + '"', 'primary')) + '</div>';
    return { t: 'Herramientas de clase', h: h };
  };
  function tmTick() {
    const t = E.ui.timer; if (!t.run) return; const left = (t.end - Date.now()) / 1000;
    const el = document.getElementById('timer-disp'); if (el) el.textContent = fmtT(left);
    if (left <= 0) { t.run = false; t.left = 0; clearInterval(t.h); beep(); if (navigator.vibrate) navigator.vibrate([300, 150, 300, 150, 600]); u.toast('⏰ ¡Tiempo!', 'ok', 6000); E.render(); }
  }
  E.beep = () => beep();
  function beep() {
    try {
      const ctx = E.ui.audio || new (window.AudioContext || window.webkitAudioContext)(); E.ui.audio = ctx;
      [0, 0.45, 0.9].forEach(t0 => {
        const o = ctx.createOscillator(), gn = ctx.createGain(); o.frequency.value = 880; o.connect(gn); gn.connect(ctx.destination);
        const t = ctx.currentTime + t0; gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(0.5, t + 0.02); gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.35); o.start(t); o.stop(t + 0.4);
      });
    } catch (e) { }
  }
  A['tm-set'] = el => { const t = E.ui.timer; t.total = Number(el.dataset.m) * 60; t.left = t.total; t.run = false; clearInterval(t.h); E.render(); };
  A['tm-start'] = () => {
    const t = E.ui.timer; try { if (!E.ui.audio) E.ui.audio = new (window.AudioContext || window.webkitAudioContext)(); E.ui.audio.resume(); } catch (e) { }
    if (t.left <= 0) t.left = t.total; t.end = Date.now() + t.left * 1000; t.run = true; clearInterval(t.h); t.h = setInterval(tmTick, 250); E.render();
  };
  A['tm-pause'] = () => { const t = E.ui.timer; t.left = Math.max(0, (t.end - Date.now()) / 1000); t.run = false; clearInterval(t.h); E.render(); };
  A['tm-reset'] = () => { const t = E.ui.timer; t.run = false; clearInterval(t.h); t.left = t.total; E.render(); };
  A['tm-fs'] = () => { const c = document.getElementById('timer-card'); if (c && c.requestFullscreen) c.requestFullscreen().catch(() => { }); };

  /* =================== CALIFICACIONES =================== */
  V.calificaciones = pid => {
    const g = D.grupoActual(); if (!g) return noGroup();
    const al = D.alumnos(g); if (!al.length) return needAlumnos('Calificaciones');
    const c = D.cfg(), ps = D.parciales(); const fin = pid === 'final';
    const p = fin ? null : (ps.find(x => x.id === pid) || C.parcialActual());
    let h = '<div class="tabs">' + ps.map(x => '<a class="tab ' + (p && x.id === p.id ? 'on' : '') + '" href="#/calificaciones/' + x.id + '">' + esc(x.nombre) + '</a>').join('') + '<a class="tab ' + (fin ? 'on' : '') + '" href="#/calificaciones/final">Final y acta</a></div>';
    if (fin) {
      h += card('<h3>Calificación final</h3><p class="muted small">Promedio de los 3 parciales' + (Number(c.escalaActa) === 10 ? ' (escala 10)' : ' (base 100)') + '. En el acta, ASIS y FAL se cuentan por ' + (c.conteoActa === 'horas' ? 'horas' : 'días de clase') + ' (cámbialo en Ajustes).</p>' +
        '<div class="row gap wrap">' + btn(icon('copy') + ' Copiar para el acta', 'acta-copy', '', 'primary') + btn(icon('download') + ' Descargar acta (.xlsx)', 'acta-xlsx') + btn(icon('print') + ' Imprimir acta', 'pr-acta') + '</div>');
      h += '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th class="l">Alumno</th>' + ps.map(x => '<th>' + esc(x.nombre.replace(' parcial', '')) + '</th>').join('') + '<th>Final</th></tr></thead><tbody>' +
        al.map(a => { const fs = C.finalSem(g, a.id); return '<tr><td>' + a.num + '</td><td class="l"><a href="#/alumno/' + a.id + '">' + esc(a.nombre) + '</a></td>' + fs.parciales.map(v => '<td><span class="g ' + gclass(v) + '">' + gfmt(v) + '</span></td>').join('') + '<td><span class="g ' + gclass(fs.final) + '">' + gfmt(fs.final) + (fs.completo ? '' : '*') + '</span></td></tr>'; }).join('') +
        '</tbody></table></div><p class="muted small">* Promedio con los parciales que ya tienen calificación.</p>';
      return { t: 'Calificaciones', h: h };
    }
    const man = D.manual(g, p.id), sm = D.submodulo(g, p.id);
    h += '<label class="switch"><input type="checkbox" data-ch="manual-toggle" data-pid="' + p.id + '" ' + (man.activo ? 'checked' : '') + '><span>Captura manual (este parcial lo calificó otro docente)</span></label>';
    if (man.activo) {
      h += card('<h3>' + esc(p.nombre) + ' · captura manual</h3><p class="muted small">Escribe la calificación (base 100), asistencias y faltas que te pasen. Se usan para la calificación final y el acta.</p>');
      h += '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th class="l">Alumno</th><th>Calif.</th><th>Asis</th><th>Fal</th></tr></thead><tbody>' + al.map((a, i) => {
        const r = (man.alumnos || {})[a.id] || {}; const nx = al[i + 1];
        const inp = (f, v) => '<input type="number" inputmode="decimal" id="mn-' + f + '-' + a.id + '" value="' + esc(v == null ? '' : v) + '" data-ch="manual-val" data-pid="' + p.id + '" data-aid="' + a.id + '" data-f="' + f + '"' + (nx ? ' data-next="mn-' + f + '-' + nx.id + '"' : '') + '>';
        return '<tr><td>' + a.num + '</td><td class="l">' + esc(a.nombre) + '</td><td>' + inp('cal', r.cal) + '</td><td>' + inp('asis', r.asis) + '</td><td>' + inp('fal', r.fal) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
      return { t: 'Calificaciones', h: h };
    }
    const acts = C.acts(g, p.id);
    const catBlock = (cat, label) => {
      const list = acts.filter(a => a.categoria === cat);
      if (cat === 'diagnostico' && !list.length) return '';
      return '<div class="cat"><div class="cat-h"><h4>' + label + (c.pond[cat] != null ? ' <span class="chip brand">' + c.pond[cat] + '%</span>' : ' <span class="chip">no cuenta</span>') + '</h4>' + btn(icon('plus') + ' Agregar', 'act-nueva', 'data-cat="' + cat + '" data-pid="' + p.id + '"', 'small') + '</div>' +
        (list.length ? '<ul class="acts">' + list.map(a => { const st = C.actStats(a, al); return '<li><a href="#/actividad/' + a.id + '"><b>' + esc(a.nombre) + '</b><span class="muted small">' + (a.fecha ? u.fCorta(a.fecha) + ' · ' : '') + esc(E.INSTR[a.instrumento] || a.instrumento || '') + (C.maxPts(a) !== 100 ? ' · de ' + C.maxPts(a) + ' pts' : '') + (Number(a.peso || 1) !== 1 ? ' · peso ' + a.peso : '') + (a.cuenta === false && cat !== 'diagnostico' ? ' · no cuenta' : '') + (st.prom != null ? ' · prom. ' + Math.round(st.prom) : '') + '</span></a><span class="chip ' + (st.faltan ? 'warn' : 'ok') + '">' + st.capturadas + '/' + al.length + '</span></li>'; }).join('') + '</ul>' : '<p class="muted small">Sin actividades todavía.</p>') + '</div>';
    };
    h += card('<h3>' + esc(p.nombre) + (sm ? ' · Submódulo ' + sm.num : '') + '</h3>' + catBlock('examen', 'Examen') + catBlock('trabajos', 'Libreta / Proyecto / Bitácora') + catBlock('diagnostico', 'Diagnóstico') +
      '<div class="cat"><h4>Asistencia <span class="chip brand">' + c.pond.asistencia + '%</span></h4><p class="muted small">Se calcula sola con tu pase de lista.</p></div>' +
      '<div class="cat"><h4>Participación <span class="chip brand">' + c.pond.participacion + '%</span></h4><p class="muted small">' + c.metaPart + ' participaciones en el parcial = 100.</p></div>' +
      '<div class="row gap wrap mt">' + (!acts.some(a => a.categoria !== 'diagnostico') && sm && sm.ac.some(a => a.producto) ? btn(icon('sparkle') + ' Agregar actividades sugeridas del submódulo', 'act-sugeridas', 'data-pid="' + p.id + '"') : '') +
      (!acts.some(a => a.categoria === 'diagnostico') ? btn(icon('plus') + ' Examen diagnóstico (no cuenta)', 'act-nueva', 'data-cat="diagnostico" data-pid="' + p.id + '"', 'small ghost') : '') + '</div>');
    h += '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th class="l">Alumno</th><th>Calif.</th><th>Exa</th><th>Trab</th><th>Asis</th><th>Part</th></tr></thead><tbody>' + al.map(a => {
      const k = C.cal(g, p.id, a.id), cp = k.comp;
      return '<tr><td>' + a.num + '</td><td class="l"><a href="#/alumno/' + a.id + '">' + esc(a.nombre) + '</a></td><td><span class="g ' + gclass(k.final) + '">' + gfmt(k.final) + (k.enCurso && k.final != null ? '*' : '') + '</span></td><td>' + gfmt(cp.examen) + '</td><td>' + gfmt(cp.trabajos) + '</td><td>' + gfmt(cp.asistencia) + '</td><td>' + gfmt(cp.participacion) + '</td></tr>';
    }).join('') + '</tbody></table></div><p class="muted small">* En curso: se calcula con los rubros que ya tienen datos. ' + (c.vaciasCero ? 'Una actividad sin calificación cuenta como 0 cuando ya pasó su fecha de entrega.' : 'Las actividades sin calificación no cuentan.') + '</p>';
    return { t: 'Calificaciones', h: h };
  };
  CH['manual-toggle'] = el => { const g = D.grupoActual(), pid = el.dataset.pid; S.update('manual:' + g.id, d => { d[pid] = Object.assign({ alumnos: {} }, d[pid] || {}, { activo: el.checked }); }, {}); };
  CH['manual-val'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, aid = el.dataset.aid, f = el.dataset.f; let v = el.value.trim();
    if (v !== '') { v = Number(v); if (isNaN(v)) v = ''; }
    S.update('manual:' + g.id, d => { d[pid] = d[pid] || { activo: true, alumnos: {} }; d[pid].alumnos = d[pid].alumnos || {}; d[pid].alumnos[aid] = Object.assign({}, d[pid].alumnos[aid] || {}); d[pid].alumnos[aid][f] = v; }, {});
  };
  A['act-nueva'] = el => {
    const g = D.grupoActual(), id = u.uid('act'), cat = el.dataset.cat;
    S.put('act:' + g.id + ':' + id, { id: id, parcial: el.dataset.pid, categoria: cat, nombre: cat === 'examen' ? 'Examen' : cat === 'diagnostico' ? 'Examen diagnóstico' : 'Nueva actividad', peso: 1, max: 100, fecha: u.today(), instrumento: cat === 'trabajos' ? 'LC' : 'Exa', cuenta: cat !== 'diagnostico', notas: {} }, { silent: true });
    location.hash = '#/actividad/' + id;
  };
  A['act-sugeridas'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, sm = D.submodulo(g, pid), p = C.parcial(pid);
    const list = [{ categoria: 'examen', nombre: 'Examen del ' + p.nombre, instrumento: 'Exa' }];
    (sm ? sm.ac : []).forEach(ac => { if (ac.producto) list.push({ categoria: 'trabajos', nombre: ac.producto, instrumento: ac.instr || 'LC' }); });
    list.push({ categoria: 'trabajos', nombre: 'Libreta y bitácora técnica', instrumento: 'B' });
    list.forEach(x => { const id = u.uid('act'); S.put('act:' + g.id + ':' + id, Object.assign({ id: id, parcial: pid, peso: 1, fecha: '', cuenta: true, notas: {} }, x), { silent: true }); });
    S.emit('acts'); u.toast(list.length + ' actividades agregadas', 'ok');
  };

  V.actividad = id => {
    const g = D.grupoActual(); if (!g) return noGroup();
    const a = S.get('act:' + g.id + ':' + id); if (!a) return { t: 'Actividad', h: card('<p>No encontré esta actividad.</p>' + link('Volver', 'calificaciones', 'primary')) };
    const al = D.alumnos(g), st = C.actStats(a, al), k = 'act:' + g.id + ':' + id, mx = C.maxPts(a), conv = mx !== 100;
    let h = '<p><a href="#/calificaciones/' + a.parcial + '">‹ Volver a calificaciones</a></p>';
    h += card('<div class="fgrid">' + fieldIn('Nombre', 'data-ch="act-field" data-path="nombre" id="af-nombre"', a.nombre) +
      '<label class="fld"><span>Rubro</span><select data-ch="act-field" data-path="categoria" id="af-cat"><option value="examen" ' + (a.categoria === 'examen' ? 'selected' : '') + '>Examen</option><option value="trabajos" ' + (a.categoria === 'trabajos' ? 'selected' : '') + '>Libreta / Proyecto / Bitácora</option><option value="diagnostico" ' + (a.categoria === 'diagnostico' ? 'selected' : '') + '>Diagnóstico (no cuenta, alimenta el perfil)</option></select></label>' +
      fieldIn('Puntos máximos', 'data-ch="act-field" data-path="max" id="af-max" inputmode="decimal" min="1" step="1"', mx, 'number') +
      '<label class="fld"><span>Tema que evalúa (para el perfil)</span><input list="temas-dl" data-ch="act-field" data-path="tema" id="af-tema" value="' + esc(a.tema || '') + '" placeholder="Ej. Dibujo técnico y FreeCAD"><datalist id="temas-dl">' + TEMAS_EVAL.map(x => '<option value="' + esc(x) + '">').join('') + '</datalist></label>' +
      fieldIn('Fecha', 'data-ch="act-field" data-path="fecha" id="af-fecha"', a.fecha, 'date') +
      '<label class="fld"><span>Instrumento</span><select data-ch="act-field" data-path="instrumento" id="af-ins">' + Object.keys(E.INSTR).map(x => '<option value="' + x + '" ' + (a.instrumento === x ? 'selected' : '') + '>' + E.INSTR[x] + '</option>').join('') + '</select></label>' +
      fieldIn('Peso dentro del rubro', 'data-ch="act-field" data-path="peso" id="af-peso" inputmode="decimal" min="0" step="0.5"', a.peso, 'number') +
      (a.categoria === 'diagnostico' ? '<p class="muted small" style="align-self:end">El diagnóstico no cuenta para la calificación: marca el punto de partida en el perfil.</p>' : '<label class="switch" style="align-self:end"><input type="checkbox" data-ch="act-field" data-path="cuenta" ' + (a.cuenta !== false ? 'checked' : '') + '><span>Cuenta para la calificación</span></label>') + '</div>' +
      '<p class="muted small">Capturadas ' + st.capturadas + ' de ' + al.length + (st.prom != null ? ' · promedio del grupo ' + Math.round(st.prom) + '/100' : '') + '.' + (conv ? ' Escribe los <b>puntos</b> (de ' + mx + '); la app los convierte a base 100.' : '') + (a.categoria === 'diagnostico' ? '' : ' Vacío = NE (no entregó): cuenta como 0 a partir del día siguiente a la fecha de entrega' + (a.fecha ? ' (' + u.fCorta(a.fecha) + ')' : '; ponle fecha para que aplique') + '.') + '</p>' +
      '<div class="fillbar"><span class="muted small">Llenar vacíos con (base 100):</span>' + [100, 90, 80, 70, 60, 0].map(v => btn(String(v), 'act-fill', 'data-id="' + id + '" data-v="' + v + '"', 'small')).join('') + '</div>');
    h += '<ul class="slist">' + al.map((x, i) => {
      const v = a.notas && a.notas[x.id], nx = al[i + 1];
      const n100 = C.nota(a, x.id);
      return '<li class="srow"><div class="sname"><span class="num">' + x.num + '</span>' + esc(x.nombre) + '</div>' + (conv ? '<span class="conv g ' + gclass(n100) + '">' + (n100 == null ? '' : u.round(n100, 1)) + '</span>' : '') + '<input class="score" id="sc-' + x.id + '" type="number" inputmode="decimal" min="0" max="' + mx + '" step="any" placeholder="NE" value="' + esc(v == null ? '' : v) + '" data-ch="nota" data-id="' + id + '" data-aid="' + x.id + '"' + (nx ? ' data-next="sc-' + nx.id + '"' : '') + ' aria-label="' + (conv ? 'Puntos' : 'Calificación') + ' de ' + esc(x.nombre) + '"></li>';
    }).join('') + '</ul>';
    h += '<div class="row gap wrap">' + link('Listo', 'calificaciones/' + a.parcial, 'primary') + btn(icon('trash') + ' Eliminar actividad', 'act-del', 'data-id="' + id + '"', 'ghost danger') + '</div>';
    return { t: a.nombre || 'Actividad', h: h, key: k };
  };
  CH['act-field'] = el => {
    const g = D.grupoActual(), id = location.hash.split('/')[2]; const path = el.dataset.path;
    let v = el.type === 'checkbox' ? el.checked : el.value; if (path === 'peso') v = Math.max(0, Number(v) || 0); if (path === 'max') v = Number(v) > 0 ? Number(v) : 100;
    if (path === 'categoria' && v === 'diagnostico') S.update('act:' + g.id + ':' + id, a => { a.cuenta = false; });
    if (path === 'categoria' && v !== 'diagnostico') { const cur = S.get('act:' + g.id + ':' + id); if (cur && cur.categoria === 'diagnostico') S.update('act:' + g.id + ':' + id, a => { a.cuenta = true; }); }
    S.update('act:' + g.id + ':' + id, a => { u.set(a, path, v); });
  };
  CH.nota = el => {
    const g = D.grupoActual(), id = el.dataset.id, aid = el.dataset.aid; let v = el.value.trim();
    const mx = C.maxPts(S.get('act:' + g.id + ':' + id));
    if (v !== '') { v = Number(v); v = isNaN(v) ? '' : Math.max(0, Math.min(mx, v)); }
    S.update('act:' + g.id + ':' + id, a => { a.notas = a.notas || {}; a.notas[aid] = v; });
  };
  A['act-fill'] = el => {
    const g = D.grupoActual(), id = el.dataset.id, v = Number(el.dataset.v);
    S.update('act:' + g.id + ':' + id, a => { const pv = u.round(v * C.maxPts(a) / 100, 1); a.notas = a.notas || {}; D.alumnos(g).forEach(x => { const cur = a.notas[x.id]; if (cur === '' || cur == null) a.notas[x.id] = pv; }); });
  };
  A['act-del'] = el => {
    const g = D.grupoActual(), k = 'act:' + g.id + ':' + el.dataset.id, a = S.get(k); if (!confirm('¿Eliminar "' + (a && a.nombre) + '" y sus calificaciones?')) return;
    S.del(k); location.hash = '#/calificaciones/' + (a ? a.parcial : '');
  };

  /* =================== PLANEACIONES =================== */
  V.planeacion = () => {
    const g = D.grupoActual(); if (!g) return noGroup();
    const ps = D.parciales(), planes = D.planes(g.id);
    let h = card('<h3>' + icon('doc') + ' Planeaciones de ' + esc(g.nombre) + '</h3><p class="muted small">Formato SEMS/DGETAyCM de "Planeación didáctica para el Currículum Laboral", prellenado con el programa 2024. Se revisa sola y la imprimes o descargas en Word.</p>' +
      '<div class="row gap wrap" style="align-items:flex-end"><label class="fld" style="margin:0"><span>Nueva planeación para</span><select id="np-p">' + ps.map(p => { const sm = D.submodulo(g, p.id); return '<option value="' + p.id + '">' + esc(p.nombre) + (sm ? ' · Submódulo ' + sm.num : '') + '</option>'; }).join('') + '</select></label>' + btn(icon('plus') + ' Crear', 'plan-new', '', 'primary') + '</div>');
    if (!planes.length) h += card('<p class="muted">Aún no hay planeaciones.</p>');
    planes.forEach(pl => {
      const p = C.parcial(pl.parcial), v = E.planes.validar(pl), bad = v.filter(x => x.n === 'bad').length, warn = v.filter(x => x.n === 'warn').length;
      const m = E.PROGRAMA.modulos[pl.modulo], sm = m && m.sub[pl.sm];
      h += card('<div class="row between gap"><div><h3>' + esc(p ? p.nombre : pl.parcial) + ' · Submódulo ' + esc(pl.sm) + '</h3><p class="muted small">' + esc(sm ? sm.nombre : '') + '</p></div><span class="chip ' + (bad ? 'bad' : warn ? 'warn' : 'ok') + '">' + (bad ? bad + ' por corregir' : warn ? warn + ' avisos' : 'Lista') + '</span></div>' +
        (pl.origen ? '<p class="small">' + esc(pl.origen) + '</p>' : '') +
        '<div class="row gap wrap">' + link('Abrir', 'plan/' + pl.id, 'primary') + btn(icon('print') + ' Imprimir / PDF', 'plan-print', 'data-id="' + pl.id + '"') + btn(icon('download') + ' Word', 'plan-word', 'data-id="' + pl.id + '"') + '</div>');
    });
    return { t: 'Planeaciones', h: h };
  };
  A['plan-new'] = () => {
    const g = D.grupoActual(), pid = (document.getElementById('np-p') || {}).value;
    try { const pl = E.planes.nueva(g, pid); S.put('plan:' + pl.id, pl, { silent: true }); location.hash = '#/plan/' + pl.id; } catch (e) { u.toast(e.message, 'err', 5000); }
  };
  const planGet = id => S.get('plan:' + id);
  A['plan-print'] = el => { const pl = planGet(el.dataset.id); if (pl) E.print.planeacion(pl); };
  A['plan-word'] = el => { const pl = planGet(el.dataset.id); if (pl) E.print.planWord(pl); };

  V.plan = id => {
    const pl = planGet(id); if (!pl) return { t: 'Planeación', h: card('<p>No encontré esta planeación.</p>' + link('Volver', 'planeacion', 'primary')) };
    const g = D.grupo(pl.grupoId) || D.grupoActual(), p = C.parcial(pl.parcial), m = E.PROGRAMA.modulos[pl.modulo], sm = m && m.sub[pl.sm];
    const hr = g && p ? C.horas(g, p) : null, val = E.planes.validar(pl), it = pl.ident || {}, tv = pl.transv || {}, sq = pl.secuencia || {}, rc = pl.recursos || {}, es = pl.estrategia || {};
    const f = (path, label, val, type, extra) => '<label class="fld"><span>' + label + '</span><input type="' + (type || 'text') + '" id="pf-' + path + '" value="' + esc(val == null ? '' : val) + '" data-ch="plan" data-path="' + path + '"' + (type === 'number' ? ' data-kind="num" inputmode="decimal"' : '') + ' ' + (extra || '') + '></label>';
    const ta = (path, label, val, rows, hint) => '<label class="fld"><span>' + label + (hint ? ' <i>' + hint + '</i>' : '') + '</span><textarea rows="' + (rows || 3) + '" id="pf-' + path + '" data-ch="plan" data-path="' + path + '">' + esc(val == null ? '' : val) + '</textarea></label>';
    const lines = (path, label, arr, rows) => '<label class="fld"><span>' + label + ' <i>(una por renglón)</i></span><textarea rows="' + (rows || Math.max(3, (arr || []).length + 1)) + '" id="pf-' + path + '" data-ch="plan" data-kind="lines" data-path="' + path + '">' + esc((arr || []).join('\n')) + '</textarea></label>';
    const checks = (path, legend, opts, sel) => '<fieldset class="checks"><legend>' + legend + '</legend>' + opts.map(o => '<label class="ck"><input type="checkbox" data-ch="plan-ck" data-path="' + path + '" value="' + esc(o) + '" ' + ((sel || []).indexOf(o) >= 0 ? 'checked' : '') + '><span>' + esc(o) + '</span></label>').join('') + '</fieldset>';
    const sec = (k, title, inner, open) => '<details class="sec" ' + (open ? 'open' : '') + ' data-sec="' + k + '"><summary>' + title + '</summary><div class="in">' + inner + '</div></details>';
    const mom = (k, label, tipo) => {
      const s = sq[k] || {}, ev = s.eval || {}, ins = s.instr || {};
      return '<div class="momento"><h4>' + label + ' <span class="chip">' + tipo + '</span></h4><div class="fgrid c4">' +
        f('secuencia.' + k + '.periodo', 'Periodo', s.periodo) + f('secuencia.' + k + '.horas', 'Horas MD', s.horas, 'number') + f('secuencia.' + k + '.ei', 'Horas EI', s.ei, 'number') + f('secuencia.' + k + '.pond', 'Ponderación %', s.pond, 'number') + '</div>' +
        ta('secuencia.' + k + '.desc', 'Qué se hace', s.desc, 3) + lines('secuencia.' + k + '.tecnicas', 'Técnicas, dinámicas y/o prácticas', s.tecnicas) + lines('secuencia.' + k + '.evidencias', 'Evidencias (Producto/Desempeño)', s.evidencias) +
        '<div class="row wrap gap">' + ['A', 'C', 'H'].map(x => '<label class="ck"><input type="checkbox" data-ch="plan-flag" data-path="secuencia.' + k + '.eval.' + x + '" ' + (ev[x] ? 'checked' : '') + '><span>' + ({ A: 'Autoevaluación', C: 'Coevaluación', H: 'Heteroevaluación' })[x] + '</span></label>').join('') + '</div>' +
        '<div class="row wrap gap">' + ['R', 'LC', 'GO', 'B', 'Exa'].map(x => '<label class="ck"><input type="checkbox" data-ch="plan-flag" data-path="secuencia.' + k + '.instr.' + x + '" ' + (ins[x] ? 'checked' : '') + '><span>' + E.INSTR[x] + '</span></label>').join('') + '</div>' +
        f('secuencia.' + k + '.otro', 'Otro instrumento', s.otro) + '</div>';
    };
    const bad = val.filter(x => x.n === 'bad').length;
    let h = '<p><a href="#/planeacion">‹ Planeaciones</a></p>';
    h += card('<div class="row between gap wrap"><div><h3>' + esc(p ? p.nombre : '') + ' · Submódulo ' + esc(pl.sm) + '</h3><p class="muted small">' + esc(sm ? sm.nombre : '') + '</p></div><div class="row gap wrap">' +
      btn(icon('print') + ' Imprimir / PDF', 'plan-print', 'data-id="' + id + '"', 'primary') + btn(icon('download') + ' Word', 'plan-word', 'data-id="' + id + '"') + '</div></div>' +
      (hr ? '<p class="small">Horas reales en tu calendario: <b>' + hr.disp + ' h</b>' + (sm ? ' · programa: ' + sm.horas + ' h' : '') + '.</p>' : '') +
      '<h4 class="mt">Revisión automática ' + (bad ? '<span class="chip bad">' + bad + ' por corregir</span>' : '<span class="chip ok">sin errores</span>') + '</h4><ul class="vlist">' + val.map(v => '<li class="' + v.n + '">' + esc(v.t) + '</li>').join('') + '</ul>' +
      '<div class="row gap wrap mt">' + btn('Ajustar horas a mi calendario', 'plan-fit', 'data-id="' + id + '"') + btn('Duplicar', 'plan-dup', 'data-id="' + id + '"') + btn(icon('trash') + ' Eliminar', 'plan-del', 'data-id="' + id + '"', 'ghost danger') + '</div>');
    h += sec('a', 'A) Identificación', '<p class="small">Módulo ' + esc(pl.modulo) + ': <b>' + esc(m ? m.nombre : '') + '</b> · Submódulo ' + esc(pl.sm) + ': <b>' + esc(sm ? sm.nombre : '') + '</b> <span class="muted">(del programa, no se edita)</span></p><div class="fgrid">' +
      f('ident.parcialTxt', 'Parcial', it.parcialTxt) + f('ident.grupoTxt', 'Grupo', it.grupoTxt) +
      '<label class="fld"><span>Elaborada</span><select data-ch="plan" data-path="ident.elaboracion" id="pf-ident.elaboracion"><option ' + (it.elaboracion !== 'Colegiada' ? 'selected' : '') + '>Individual</option><option ' + (it.elaboracion === 'Colegiada' ? 'selected' : '') + '>Colegiada</option></select></label>' +
      f('ident.docente', 'Docente(s)', it.docente) + '</div>' + f('ident.fechas', 'Fecha de inicio y de cierre', it.fechas) +
      '<div class="fgrid c3">' + f('ident.horasMD', 'Horas de mediación docente', it.horasMD, 'number') + f('ident.horasEI', 'Horas de estudio independiente', it.horasEI, 'number') + f('ident.horasTot', 'Horas totales', it.horasTot, 'number') + '</div>', false);
    const progItems = sm ? [].concat.apply([], sm.ac.map(a => (a.desarrollo || []).map(d => ({ ac: a.titulo, d: d })))) : [];
    h += sec('b', 'B) Intenciones formativas', lines('resModulo', 'Resultado de aprendizaje del Módulo', pl.resModulo) + f('resSM', 'Resultado de aprendizaje del Submódulo', pl.resSM) +
      lines('proceso', 'Proceso para la formación en competencias (actividades clave)', pl.proceso) + lines('desarrollo', 'Desarrollo de la competencia', pl.desarrollo, 8) +
      (progItems.length ? '<details class="sub"><summary>Agregar desde el programa (' + progItems.length + ')</summary><ul class="prog-items">' + progItems.map((x, i) => { const ya = (pl.desarrollo || []).indexOf(x.d) >= 0; return '<li><button type="button" class="mini ' + (ya ? '' : 'plus') + '" data-act="plan-add-des" data-id="' + id + '" data-i="' + i + '" ' + (ya ? 'disabled' : '') + ' aria-label="Agregar">' + (ya ? '✓' : '+') + '</button><span><b>' + esc(x.ac) + ':</b> ' + esc(x.d) + '</span></li>'; }).join('') + '</ul></details>' : ''), false);
    h += sec('c', 'C) Transversalidad curricular', checks('transv.fund', 'Currículum fundamental', E.FUND.soc.concat(E.FUND.areas), tv.fund) + checks('transv.amp', 'Currículum ampliado (recursos socioemocionales)', E.AMP, tv.amp) +
      E.HVYT.map(d => checks('transv.hvyt', 'HVyT · ' + d.dim, d.items, tv.hvyt)).join('') + checks('transv.cocends', 'Conceptos centrales de la Educación para el Desarrollo Sostenible', E.COCEDS, tv.cocends) +
      f('paec', 'Evidencia articuladora final o PAEC', pl.paec) + f('paecEvid', 'Evidencia articuladora (Producto/Desempeño)', pl.paecEvid) +
      [0, 1, 2].map(i => '<div class="fgrid c3">' + f('uac.' + i + '.uac', 'UAC ' + (i + 1), ((pl.uac || [])[i] || {}).uac) + f('uac.' + i + '.prog', 'Progresión', ((pl.uac || [])[i] || {}).prog) + f('uac.' + i + '.sem', 'Semana', ((pl.uac || [])[i] || {}).sem) + '</div>').join(''), false);
    h += sec('d', 'D) Estrategia de enseñanza y aprendizaje', '<p class="muted small">Los porcentajes se toman de la secuencia didáctica (F) para que nunca se contradigan.</p>' +
      ta('estrategia.diag', 'Diagnóstica (' + ((sq.apertura || {}).pond || 0) + '%)', es.diag, 2) + ta('estrategia.form', 'Formativa (' + ((sq.desarrollo || {}).pond || 0) + '%)', es.form, 2) + ta('estrategia.sum', 'Sumativa (' + ((sq.cierre || {}).pond || 0) + '%)', es.sum, 2), false);
    h += sec('e', 'E) Prácticas (demostrativa, guiada, supervisada y autónoma)', lines('practicas', 'Prácticas', pl.practicas), false);
    h += sec('f', 'F) Secuencia didáctica', mom('apertura', 'Apertura', 'Diagnóstica') + mom('desarrollo', 'Desarrollo', 'Formativa') + mom('cierre', 'Cierre', 'Sumativa'), true);
    h += sec('g', 'G) Recursos didácticos', lines('recursos.material', 'Software / Material', rc.material) + lines('recursos.equipo', 'Equipo / Herramienta', rc.equipo) + lines('recursos.fuentes', 'Fuentes de información', rc.fuentes) +
      (m && m.fuentes ? btn('Agregar fuentes sugeridas del programa', 'plan-add-fuentes', 'data-id="' + id + '"', 'small') : ''), false);
    h += sec('h', 'H) Validación', '<div class="fgrid c3">' + f('valida.elaboro', 'Elaboró', (pl.valida || {}).elaboro) + f('valida.reviso', 'Revisó (nombre y cargo)', (pl.valida || {}).reviso) + f('valida.avalo', 'Avaló (nombre y cargo)', (pl.valida || {}).avalo) + '</div>', false);
    h += sec('n', 'Notas internas (no se imprimen)', ta('notas', 'Notas', pl.notas, 4), !!pl.notas);
    return { t: 'Planeación', h: h };
  };
  const planId = () => location.hash.split('/')[2];
  CH.plan = el => {
    const id = planId(), path = el.dataset.path, kind = el.dataset.kind; let v = el.value;
    if (kind === 'num') v = v === '' ? '' : Number(v);
    if (kind === 'lines') v = v.split('\n').map(s => s.trim()).filter(Boolean);
    S.update('plan:' + id, pl => { u.set(pl, path, v); });
  };
  CH['plan-ck'] = el => {
    const id = planId(), path = el.dataset.path;
    S.update('plan:' + id, pl => { const arr = (u.get(pl, path) || []).slice(); const i = arr.indexOf(el.value); if (el.checked && i < 0) arr.push(el.value); if (!el.checked && i >= 0) arr.splice(i, 1); u.set(pl, path, arr); });
  };
  CH['plan-flag'] = el => { const id = planId(); S.update('plan:' + id, pl => { u.set(pl, el.dataset.path, el.checked); }); };
  A['plan-add-des'] = el => {
    const pl = planGet(el.dataset.id); const sm = E.PROGRAMA.modulos[pl.modulo].sub[pl.sm];
    const items = [].concat.apply([], sm.ac.map(a => a.desarrollo || [])); const d = items[Number(el.dataset.i)];
    S.update('plan:' + pl.id, x => { x.desarrollo = (x.desarrollo || []).concat([d]); });
  };
  A['plan-add-fuentes'] = el => {
    const pl = planGet(el.dataset.id), m = E.PROGRAMA.modulos[pl.modulo];
    S.update('plan:' + pl.id, x => { x.recursos = x.recursos || {}; const cur = x.recursos.fuentes || []; x.recursos.fuentes = cur.concat((m.fuentes || []).filter(s => cur.indexOf(s) < 0)); });
  };
  A['plan-fit'] = el => { S.update('plan:' + el.dataset.id, pl => E.planes.ajustarHoras(pl)); u.toast('Horas ajustadas a tu calendario', 'ok'); };
  A['plan-dup'] = el => { const pl = u.clone(planGet(el.dataset.id)); pl.id = u.uid('plan'); pl.estado = 'Borrador'; pl.origen = 'Copia de otra planeación'; S.put('plan:' + pl.id, pl, { silent: true }); location.hash = '#/plan/' + pl.id; };
  A['plan-del'] = el => { if (!confirm('¿Eliminar esta planeación?')) return; S.del('plan:' + el.dataset.id); location.hash = '#/planeacion'; };

  /* =================== IMPRIMIR =================== */
  V.imprimir = () => {
    const g = D.grupoActual(); if (!g) return noGroup();
    const pr = E.ui.print, ps = D.parciales(); if (!pr.pid) pr.pid = C.parcialActual().id;
    const p = C.parcial(pr.pid), sm = D.submodulo(g, pr.pid), hasAl = D.alumnos(g).length > 0;
    let h = card('<div class="fgrid"><label class="fld"><span>Parcial</span><select data-ch="pr" data-f="pid">' + ps.map(x => '<option value="' + x.id + '" ' + (x.id === pr.pid ? 'selected' : '') + '>' + esc(x.nombre) + '</option>').join('') + '</select></label>' +
      '<label class="switch" style="align-self:end"><input type="checkbox" data-ch="pr" data-f="marcas" ' + (pr.marcas ? 'checked' : '') + '><span>Incluir lo ya registrado</span></label></div><p class="muted small">Hojas tamaño carta. Las fechas salen de tu horario, sin asuetos' + (g.inicioDocente ? ', a partir del ' + u.fLarga(g.inicioDocente) : '') + '.</p>');
    if (!hasAl) h += card('<p class="note warn">Importa tu lista de alumnos para imprimir listas con nombres.</p>' + link('Importar lista', 'alumnos', 'primary'));
    const nF = C.fechasLista(g, p).length;
    h += '<div class="grid2">' +
      card('<h3>' + icon('check') + ' Lista de asistencia</h3><p class="muted small">' + nF + ' fechas de clase · horizontal.</p>' + btn(icon('print') + ' Imprimir', 'pr-asis', hasAl ? '' : 'disabled', 'primary')) +
      card('<h3>' + icon('plus') + ' Hoja de participación</h3><p class="muted small">Mismas fechas, con total por alumno.</p>' + btn(icon('print') + ' Imprimir', 'pr-part', hasAl ? '' : 'disabled', 'primary')) + '</div>';
    if (sm && sm.ac.some(a => a.criterios)) {
      h += card('<h3>' + icon('doc') + ' Lista de cotejo y rúbrica</h3><p class="muted small">Criterios tomados de las actividades clave del Submódulo ' + sm.num + ' (programa 2024).</p>' +
        '<label class="fld"><span>Producto a evaluar</span><select data-ch="pr" data-f="ac">' + sm.ac.map((a, i) => '<option value="' + i + '" ' + (Number(pr.ac) === i ? 'selected' : '') + '>' + esc(a.producto || a.titulo) + ' (' + esc(E.INSTR[a.instr] || '') + ')</option>').join('') + '</select></label>' +
        '<div class="fgrid"><label class="fld"><span>Evaluar por</span><select data-ch="pr" data-f="modo"><option value="alumnos" ' + (pr.modo === 'alumnos' ? 'selected' : '') + '>Alumno</option><option value="equipos" ' + (pr.modo === 'equipos' ? 'selected' : '') + '>Equipo</option></select></label>' +
        (pr.modo === 'equipos' ? fieldIn('Número de equipos', 'data-ch="pr" data-f="equipos" inputmode="numeric" min="1" max="15"', pr.equipos, 'number') : '') + '</div>' +
        '<div class="row gap wrap">' + btn(icon('print') + ' Lista de cotejo', 'pr-cotejo', '', 'primary') + btn(icon('print') + ' Rúbrica', 'pr-rubrica') + '</div>');
    }
    h += card('<h3>' + icon('grade') + ' Acta de calificaciones</h3><p class="muted small">Mismas columnas que el acta de la escuela (1 PAR, ASIS, FAL… CALIFICACIÓN FINAL).</p><div class="row gap wrap">' + btn(icon('print') + ' Imprimir', 'pr-acta', hasAl ? '' : 'disabled', 'primary') + btn(icon('download') + ' Excel', 'acta-xlsx', hasAl ? '' : 'disabled') + btn(icon('copy') + ' Copiar', 'acta-copy', hasAl ? '' : 'disabled') + '</div>');
    h += card('<h3>' + icon('doc') + ' Planeación</h3><p class="muted small">Se imprime desde cada planeación.</p>' + link('Ir a planeaciones', 'planeacion'));
    return { t: 'Imprimir', h: h };
  };
  CH.pr = el => { const pr = E.ui.print, f = el.dataset.f; pr[f] = el.type === 'checkbox' ? el.checked : (f === 'ac' || f === 'equipos' ? Number(el.value) : el.value); if (f === 'pid') pr.ac = 0; E.render(); };
  const prCtx = () => { const g = D.grupoActual(), pr = E.ui.print; return { g: g, p: C.parcial(pr.pid || C.parcialActual().id), pr: pr }; };
  A['pr-asis'] = () => { const x = prCtx(); E.print.asistencia(x.g, x.p, { marcas: x.pr.marcas }); };
  A['pr-part'] = () => { const x = prCtx(); E.print.participacion(x.g, x.p, { marcas: x.pr.marcas }); };
  A['pr-cotejo'] = () => { const x = prCtx(); E.print.cotejo(x.g, x.p, Number(x.pr.ac), x.pr); };
  A['pr-rubrica'] = () => { const x = prCtx(); E.print.rubrica(x.g, x.p, Number(x.pr.ac), x.pr); };
  A['pr-acta'] = () => E.print.acta(D.grupoActual());
  A['acta-xlsx'] = () => E.print.actaXlsx(D.grupoActual());
  A['acta-copy'] = () => E.print.actaCopy(D.grupoActual());

  /* =================== IDEAS =================== */
  const FILTROS = [['todas', 'Todas'], ['fav', '★ Favoritas'], ['Proyector', '📽 Con proyector'], ['II-2', 'Mecanismos (SM2)'], ['II-3', 'Neumática e hidráulica (SM3)'], ['FreeCAD', 'FreeCAD'], ['Docencia', 'Manejo de grupo'], ['Evaluación', 'Evaluación']];
  V.ideas = openId => {
    const q = u.norm(E.ui.ideasQ), fl = E.ui.ideasF, favs = D.favs();
    const list = E.IDEAS.filter(i => {
      if (fl === 'fav' && favs.indexOf(i.id) < 0) return false;
      if (fl.indexOf('II-') === 0 && i.sm.indexOf(fl) < 0) return false;
      if (['FreeCAD', 'Docencia', 'Evaluación', 'Proyector'].indexOf(fl) >= 0 && i.tipo !== fl) return false;
      if (q && u.norm(i.titulo + ' ' + i.obj + ' ' + i.pasos.join(' ')).indexOf(q) < 0) return false;
      return true;
    });
    let h = '<label class="fld"><span>Buscar</span><input type="search" id="ideas-q" value="' + esc(E.ui.ideasQ) + '" data-in="ideas-q" placeholder="engranes, Pascal, equipos…"></label>';
    h += '<div class="filters">' + FILTROS.map(f => '<button type="button" class="tab ' + (fl === f[0] ? 'on' : '') + '" data-act="ideas-f" data-f="' + f[0] + '">' + f[1] + '</button>').join('') + '</div>';
    h += '<p class="muted small">' + list.length + ' ideas · para tu aula con proyector, computadoras con FreeCAD y materiales de bajo costo. La teoría lista para proyectar está en ' + '<a href="#/temas">Temas</a>.</p>';
    h += list.map(i => {
      const fav = favs.indexOf(i.id) >= 0;
      return '<details class="sec idea" ' + (openId === i.id ? 'open' : '') + ' id="idea-' + i.id + '"><summary><span>' + esc(i.titulo) + '</span></summary><div class="in">' +
        '<div class="meta"><span class="chip brand">' + esc(i.tipo) + '</span><span class="chip">' + esc(i.dur) + '</span><span class="chip">' + esc(i.costo) + '</span>' + i.sm.map(s => '<span class="chip info">' + (s === 'gen' ? 'Cualquier submódulo' : 'Submódulo ' + s.split('-')[1]) + '</span>').join('') + '</div>' +
        '<p><b>Para qué:</b> ' + esc(i.obj) + '</p><p><b>Materiales:</b> ' + esc(i.mat.join(' · ')) + '</p><ol>' + i.pasos.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>' +
        '<p><b>Evidencia:</b> ' + esc(i.evid) + '</p>' + (i.link ? '<p><a class="btn small" href="' + esc(i.link) + '" target="_blank" rel="noopener">↗ Abrir ' + esc(i.link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]) + '</a></p>' : '') + '<p class="note info">💡 ' + esc(i.tip) + '</p>' +
        '<div class="row gap wrap">' + btn(icon('star') + (fav ? ' Quitar de favoritas' : ' Favorita'), 'idea-fav', 'data-id="' + i.id + '"', fav ? 'accent' : '') + btn(icon('copy') + ' Copiar', 'idea-copy', 'data-id="' + i.id + '"') + '</div></div></details>';
    }).join('');
    return { t: 'Ideas para tus clases', h: h, after: () => { if (openId) { const el = document.getElementById('idea-' + openId); if (el) el.scrollIntoView({ block: 'start' }); } } };
  };
  IN['ideas-q'] = el => { E.ui.ideasQ = el.value; E.render(); };
  A['ideas-f'] = el => { E.ui.ideasF = el.dataset.f; E.render(); };
  A['idea-fav'] = el => { const id = el.dataset.id; S.update('favs', f => { const i = f.indexOf(id); if (i >= 0) f.splice(i, 1); else f.push(id); }, []); };
  A['idea-copy'] = async el => {
    const i = E.IDEAS.find(x => x.id === el.dataset.id); if (!i) return;
    const t = i.titulo + '\nPara qué: ' + i.obj + '\nMateriales: ' + i.mat.join(', ') + '\n' + i.pasos.map((s, k) => (k + 1) + '. ' + s).join('\n') + '\nEvidencia: ' + i.evid;
    const ok = await u.copy(t); u.toast(ok ? 'Idea copiada' : 'No se pudo copiar', ok ? 'ok' : 'err');
  };

  /* =================== TEMAS =================== */
  const SM_LBL = { 'II-1': 'Nivelación · Submódulo 1', 'II-2': 'Submódulo 2 · Mecanismos', 'II-3': 'Submódulo 3 · Neumática e hidráulica', gen: 'Formación integral' };
  const TFILT = [['todos', 'Todos'], ['II-1', 'Nivelación (SM1)'], ['II-2', 'Mecanismos (SM2)'], ['II-3', 'Neumática e hidráulica (SM3)'], ['gen', 'Formación integral']];
  function smActual() { const g = D.grupoActual(), p = C.parcialActual(); const n = g && p && (g.submodulos || {})[p.id]; return n ? 'II-' + n : 'todos'; }
  V.temas = f => {
    f = f || E.ui.temasF || smActual(); E.ui.temasF = f;
    const list = E.TEMAS.filter(t => f === 'todos' || t.sm === f);
    let h = card('<h3>' + icon('doc') + ' Temas para explicar y proyectar</h3><p class="muted small">Cada tema trae la explicación para ti, lo esencial para proyectar, un ejemplo resuelto, preguntas con respuesta y su conexión con la vida. Toca <b>Proyectar</b> y conecta la laptop al proyector.</p>');
    h += '<div class="filters">' + TFILT.map(x => '<a class="tab ' + (f === x[0] ? 'on' : '') + '" href="#/temas/' + x[0] + '">' + x[1] + '</a>').join('') + '</div>';
    h += list.map(t => card('<div class="row between gap"><div><h3 style="margin-bottom:2px">' + esc(t.titulo) + '</h3><p class="muted small" style="margin:0">' + esc(SM_LBL[t.sm] || '') + ' · ' + esc(t.dur) + '</p></div>' +
      btn('📽 Proyectar', 'proj-open', 'data-id="' + t.id + '"', 'small primary') + '</div><p class="small">' + esc(t.objetivo) + '</p>' + (t.ac ? '<p class="muted small">Actividad clave: ' + esc(t.ac) + '</p>' : '') + link('Ver tema', 'tema/' + t.id, 'small'))).join('');
    return { t: 'Temas', h: h };
  };
  V.tema = id => {
    const t = E.TEMAS.find(x => x.id === id); if (!t) return { t: 'Tema', h: card('<p>No encontré este tema.</p>' + link('Volver', 'temas', 'primary')) };
    const L = arr => '<ul>' + (arr || []).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    let h = '<p><a href="#/temas">‹ Temas</a></p>';
    h += card('<span class="chip brand">' + esc(SM_LBL[t.sm] || '') + '</span><h3 class="mt">' + esc(t.titulo) + '</h3><p class="small"><b>Objetivo:</b> ' + esc(t.objetivo) + '</p>' + (t.ac ? '<p class="muted small">Actividad clave del programa: ' + esc(t.ac) + '</p>' : '') + '<p class="muted small">Duración sugerida: ' + esc(t.dur) + '</p>' +
      '<div class="row gap wrap">' + btn('📽 Proyectar', 'proj-open', 'data-id="' + t.id + '"', 'primary') + link(icon('screen') + ' Presentador: proyector y celular separados', 'presentador/' + t.id) + btn(icon('copy') + ' Copiar preguntas', 'tema-copy', 'data-id="' + t.id + '"') + btn(icon('book') + ' Registrar en bitácora', 'tema-bit', 'data-id="' + t.id + '"') + '</div>');
    if (E.medios) h += card(E.medios.cardHTML(t), 'medios');
    h += card('<h3>Explicación para ti</h3>' + t.explica.map(p => '<p>' + esc(p) + '</p>').join(''));
    h += card('<h3>Lo que se proyecta</h3>' + L(t.pantalla));
    h += card('<h3>Conceptos clave</h3><dl class="kv">' + (t.clave || []).map(k => '<dt>' + esc(k[0]) + '</dt><dd>' + esc(k[1]) + '</dd>').join('') + '</dl>');
    if (t.ejemplo) h += card('<h3>Ejemplo: ' + esc(t.ejemplo.titulo) + '</h3><ol>' + t.ejemplo.pasos.map(p => '<li>' + esc(p) + '</li>').join('') + '</ol><p class="note ok">' + esc(t.ejemplo.resultado) + '</p>');
    h += card('<h3>Preguntas para verificar</h3>' + (t.preguntas || []).map((q, i) => '<details class="sub"><summary>' + (i + 1) + '. ' + esc(q[0]) + '</summary><p class="small">' + esc(q[1]) + '</p></details>').join(''));
    h += card('<h3>Errores comunes</h3>' + L(t.errores));
    h += card('<h3>¿Para qué me sirve?</h3><p>' + esc(t.vida) + '</p>', 'accent');
    const ids = (t.ideas || []).map(x => E.IDEAS.find(i => i.id === x)).filter(Boolean);
    if (ids.length) h += card('<h3>' + icon('bulb') + ' Ideas para practicarlo</h3><ul class="risk">' + ids.map(i => '<li><a href="#/ideas/' + i.id + '">' + esc(i.titulo) + '</a><span class="chip">' + esc(i.tipo) + '</span></li>').join('') + '</ul>');
    h += '<p class="muted small">Fuente: ' + esc(t.fuente) + '</p>';
    return { t: 'Tema', h: h };
  };
  A['tema-copy'] = async el => {
    const t = E.TEMAS.find(x => x.id === el.dataset.id); if (!t) return;
    const txt = t.titulo + '\n' + t.preguntas.map((q, i) => (i + 1) + '. ' + q[0] + '\n   R: ' + q[1]).join('\n');
    const ok = await u.copy(txt); u.toast(ok ? 'Preguntas copiadas (úsalas en tu examen o en Plickers)' : 'No se pudo copiar', ok ? 'ok' : 'err');
  };
  A['tema-bit'] = el => {
    const t = E.TEMAS.find(x => x.id === el.dataset.id), g = D.grupoActual(), id = u.uid('bit');
    S.put('bit:' + id, { id: id, fecha: u.today(), grupoId: g ? g.id : '', texto: 'Tema visto: ' + t.titulo + ' (' + (SM_LBL[t.sm] || '') + ').' }); u.toast('Registrado en la bitácora de hoy', 'ok');
  };

  /* ---------- modo proyector ---------- */
  const chunk = (a, n) => { const out = []; for (let i = 0; i < (a || []).length; i += n) out.push(a.slice(i, i + n)); return out; };
  function slides(t) {
    const s = [{ k: 'cover', h: t.titulo, sub: SM_LBL[t.sm] || '', p: t.objetivo }];
    chunk(t.pantalla, 4).forEach(c => s.push({ k: 'list', h: 'Lo esencial', items: c }));
    const md = E.medios ? E.medios.slides(t) : { figs: [], fin: [] };
    md.figs.forEach(x => s.push(x));
    chunk(t.clave, 3).forEach(c => s.push({ k: 'terms', h: 'Conceptos clave', items: c }));
    if (t.ejemplo) { const ch = chunk(t.ejemplo.pasos, 4); ch.forEach((c, i) => s.push({ k: 'list', h: 'Ejemplo: ' + t.ejemplo.titulo, items: c, foot: i === ch.length - 1 ? t.ejemplo.resultado : '' })); }
    (t.preguntas || []).forEach((q, i) => s.push({ k: 'q', h: 'Pregunta ' + (i + 1) + ' de ' + t.preguntas.length, q: q[0], a: q[1] }));
    md.fin.forEach(x => s.push(x));
    s.push({ k: 'vida', h: '¿Para qué me sirve?', p: t.vida });
    return s;
  }
  function slideBody(sl, rev, mini) {
    if ((sl.k === 'fig' || sl.k === 'video' || sl.k === 'img') && E.medios) return E.medios.slideBody(sl, mini);
    if (sl.k === 'cover') return '<div class="pj-cover"><span class="pj-kicker">' + esc(sl.sub) + '</span><h1>' + esc(sl.h) + '</h1><p>' + esc(sl.p) + '</p></div>';
    if (sl.k === 'list') return '<h2>' + esc(sl.h) + '</h2><ul class="pj-list">' + sl.items.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' + (sl.foot ? '<p class="pj-foot">' + esc(sl.foot) + '</p>' : '');
    if (sl.k === 'terms') return '<h2>' + esc(sl.h) + '</h2><dl class="pj-terms">' + sl.items.map(x => '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>').join('') + '</dl>';
    if (sl.k === 'q') return '<h2>' + esc(sl.h) + '</h2><p class="pj-q">' + esc(sl.q) + '</p>' + (rev ? '<p class="pj-a">' + esc(sl.a) + '</p>' : '<button type="button" class="pj-btn pj-reveal" data-act="proj-reveal">Mostrar respuesta</button>');
    return '<h2>' + esc(sl.h) + '</h2><p class="pj-vida">' + esc(sl.p) + '</p>';
  }
  const P = E.proj = {
    t: null, s: [], i: 0, rev: false, dark: false, slides: slides, body: slideBody,
    open(id) {
      const t = E.TEMAS.find(x => x.id === id); if (!t) return;
      P.t = t; P.s = slides(t); P.i = 0; P.rev = false;
      let el = document.getElementById('proj'); if (!el) { el = document.createElement('div'); el.id = 'proj'; document.body.appendChild(el); }
      el.hidden = false; P.draw();
      if (el.requestFullscreen && !E.modoPantalla) el.requestFullscreen().catch(() => { });
    },
    draw() {
      const el = document.getElementById('proj'); if (!el || !P.t) return; const sl = P.s[P.i];
      const body = slideBody(sl, P.rev);
      el.className = P.dark ? 'pj-dark' : '';
      el.innerHTML = '<div class="pj-slide" data-act="proj-tap">' + body + '</div>' +
        '<div class="pj-bar"><div class="pj-prog"><span style="width:' + ((P.i + 1) / P.s.length * 100) + '%"></span></div>' +
        '<div class="pj-ctrl"><button type="button" class="pj-btn" data-act="proj-prev" aria-label="Anterior">‹</button><span class="pj-count">' + (P.i + 1) + ' / ' + P.s.length + '</span><button type="button" class="pj-btn" data-act="proj-next" aria-label="Siguiente">›</button>' + (E.run && E.run.activo() ? '<span class="pj-run" id="pj-run"></span>' : '') +
        '<button type="button" class="pj-btn" data-act="proj-azar" title="Alumno al azar">🎲</button><button type="button" class="pj-btn" data-act="proj-theme" title="Claro u oscuro" aria-label="Claro u oscuro">🌓</button><button type="button" class="pj-btn" data-act="proj-close" aria-label="Cerrar">✕</button></div></div>' +
        '<div class="pj-azar" id="pj-azar" hidden></div>' + (E.modoPantalla ? '<div class="pj-negro" id="pj-negro"' + (E.pres && E.pres.negro ? '' : ' hidden') + '></div>' : '');
      if (E.pres && E.pres.alDibujar) E.pres.alDibujar();
    },
    go(d) { const n = P.i + d; if (n < 0 || n >= P.s.length) return; P.i = n; P.rev = false; P.draw(); },
    close() { const el = document.getElementById('proj'); if (el) { el.hidden = true; el.innerHTML = ''; } if (document.fullscreenElement) document.exitFullscreen().catch(() => { }); P.t = null; }
  };
  A['proj-open'] = el => P.open(el.dataset.id);
  A['proj-next'] = () => P.go(1);
  A['proj-prev'] = () => P.go(-1);
  A['proj-close'] = () => P.close();
  A['proj-theme'] = () => { P.dark = !P.dark; P.draw(); };
  A['proj-reveal'] = () => { P.rev = true; P.draw(); };
  A['proj-tap'] = (el, e) => {
    const sl = P.s[P.i]; const x = e.clientX / window.innerWidth;
    if (x < 0.3) { P.go(-1); return; }
    if (sl && sl.k === 'q' && !P.rev) { P.rev = true; P.draw(); return; }
    P.go(1);
  };
  A['proj-azar'] = () => {
    const g = D.grupoActual(); const box = document.getElementById('pj-azar'); if (!g || !box) return;
    const list = presentes(g, u.today()); if (!list.length) { u.toast('Importa tu lista para usar el azar', 'err'); return; }
    const a = list[Math.floor(Math.random() * list.length)];
    box.hidden = false; box.innerHTML = '<div class="pj-azar-in"><span>Contesta</span><b>' + esc(a.nombre) + '</b><button type="button" class="pj-btn" data-act="proj-azar-ok" data-aid="' + a.id + '">+1 participación</button><button type="button" class="pj-btn" data-act="proj-azar-x">Cerrar</button></div>';
  };
  A['proj-azar-ok'] = el => { const g = D.grupoActual(); S.update('part:' + g.id + ':' + u.today(), d => { d[el.dataset.aid] = Number(d[el.dataset.aid] || 0) + 1; }, {}); const b = document.getElementById('pj-azar'); if (b) b.hidden = true; u.toast('+1 participación', 'ok'); };
  A['proj-azar-x'] = () => { const b = document.getElementById('pj-azar'); if (b) b.hidden = true; };
  document.addEventListener('keydown', e => {
    if (!P.t) return;
    if (['ArrowRight', 'PageDown', ' '].indexOf(e.key) >= 0) { e.preventDefault(); const sl = P.s[P.i]; if (sl.k === 'q' && !P.rev) { P.rev = true; P.draw(); } else P.go(1); }
    else if (['ArrowLeft', 'PageUp'].indexOf(e.key) >= 0) { e.preventDefault(); P.go(-1); }
    else if (e.key === 'Escape') P.close();
    else if (e.key === 'r' || e.key === 'R') { P.rev = true; P.draw(); }
  });
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && P.t) { /* sigue abierto en ventana */ } });

  /* =================== ALUMNOS =================== */
  V.alumnos = sub => {
    const g = D.grupoActual(); if (!g) return noGroup();
    const al = D.alumnos(g, true), p = C.parcialActual();
    let h = card('<h3>' + icon('upload') + ' Importar o actualizar lista</h3><p class="muted small">Sube el Excel de listas de la escuela y elige la hoja de tu grupo, o pega los nombres (uno por renglón). Si un alumno ya existe, se conserva todo su historial.</p>' +
      '<label class="btn primary filebtn">' + icon('upload') + ' Subir Excel<input type="file" accept=".xlsx,.xls,.csv" data-ch="import-file" hidden></label>' +
      '<details class="sub"><summary>Pegar nombres</summary><textarea class="inp" id="imp-paste" rows="6" placeholder="BARRIENTOS CORONADO MICHEL ARMANDO&#10;CORTES TAMAYO MIGUEL ALEXANDER&#10;…"></textarea><div class="mt">' + btn('Revisar', 'import-paste', '', 'primary') + '</div></details>' +
      (E.paquete ? E.paquete.html(sub === 'paquete') : ''));
    if (sub === 'paquete') h += '<span data-scroll="pk-det"></span>';
    if (!al.length) return { t: 'Alumnos', h: h };
    h += '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th class="l">Alumno</th><th>Asis ' + esc(p.nombre.replace(' parcial', '')) + '</th><th>Calif.</th></tr></thead><tbody>' + al.map(a => {
      const as = C.asis(g, p, a.id), k = C.cal(g, p.id, a.id);
      return '<tr class="' + (a.activo === false ? 'baja' : '') + '"><td>' + a.num + '</td><td class="l"><a href="#/alumno/' + a.id + '">' + esc(a.nombre) + '</a>' + (a.activo === false ? ' <span class="chip">baja</span>' : '') + '</td><td>' + (as.pct == null ? '—' : Math.round(as.pct) + '%') + '</td><td><span class="g ' + gclass(k.final) + '">' + gfmt(k.final) + '</span></td></tr>';
    }).join('') + '</tbody></table></div><p class="muted small">' + al.filter(a => a.activo !== false).length + ' alumnos activos.</p>';
    return { t: 'Alumnos', h: h };
  };
  CH['import-file'] = async el => {
    const file = el.files && el.files[0]; if (!file) return;
    try {
      u.toast('Leyendo archivo…');
      if (!window.XLSX) await u.loadScript(E.XLSX_CDN);
      const wb = window.XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const hojas = wb.SheetNames.filter(n => /LISTA/i.test(n)); const use = hojas.length ? hojas : wb.SheetNames;
      const g = D.grupoActual(); const guess = use.find(n => u.norm(n).indexOf(u.norm(g.grupo)) >= 0 && /MEC/i.test(n)) || use.find(n => /MEC/i.test(n)) || use[0];
      E.ui.importWB = wb;
      E.modal.open('Elige la hoja de tu grupo', '<label class="fld"><span>Hoja</span><select id="imp-sheet">' + use.map(n => '<option ' + (n === guess ? 'selected' : '') + '>' + esc(n) + '</option>').join('') + '</select></label>' + btn('Revisar', 'import-sheet', '', 'primary'));
    } catch (e) { u.toast('No pude leer el archivo: ' + e.message, 'err', 6000); }
    el.value = '';
  };
  function parseHoja(ws) {
    const rows = window.XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false }); const meta = {}; let nameCol = -1, start = -1;
    rows.forEach((r, i) => r.forEach((cell, j) => {
      const s = String(cell).trim(); const up = u.norm(s);
      const m = (re) => { const x = s.match(re); return x ? x[1].trim() : null; };
      if (/^CARRERA:/i.test(s)) meta.carrera = m(/CARRERA:\s*(.*)$/i);
      if (/^SEMESTRE:/i.test(s)) meta.semestre = m(/SEMESTRE:\s*(.*)$/i);
      if (/^GRUPO:/i.test(s)) meta.grupo = m(/GRUPO:\s*(.*)$/i);
      if (up === 'NOMBRE' && nameCol < 0) { nameCol = j; start = i + 1; }
    }));
    const nombres = [];
    if (nameCol >= 0) for (let i = start; i < rows.length; i++) { const n = String(rows[i][nameCol] || '').replace(/\s+/g, ' ').trim(); if (n && !/^NOMBRE$/i.test(n)) nombres.push(n); }
    return { meta: meta, nombres: nombres };
  }
  A['import-sheet'] = () => {
    const name = document.getElementById('imp-sheet').value, ws = E.ui.importWB.Sheets[name]; const r = parseHoja(ws);
    if (!r.nombres.length) { u.toast('No encontré nombres en esa hoja (busco la columna "NOMBRE")', 'err', 5000); return; }
    previewImport(r.nombres, r.meta, name);
  };
  A['import-paste'] = () => {
    const t = (document.getElementById('imp-paste') || {}).value || '';
    // si pegaron el bloque de datos de Claude aquí, se manda al lugar correcto
    if (E.paquete && E.paquete.esPaquete(t)) { u.toast('Eso es un bloque de datos de Claude: lo abro en "Pegar datos de Claude".', 'ok', 5000); E.actions['pk-revisar'](null, null, t); return; }
    const nombres = t.split('\n').map(s => s.replace(/^\s*\d+(\.0)?[\s\t.)\-]*/, '').replace(/\s+/g, ' ').trim()).filter(s => s && !/^NOMBRE$/i.test(s) && !E.esNombreRaro(s));
    if (!nombres.length) { u.toast('Pega al menos un nombre', 'err'); return; }
    previewImport(nombres, {}, 'texto pegado');
  };
  function previewImport(nombres, meta, origen) {
    const g = D.grupoActual(), cur = D.alumnos(g, true), curN = cur.map(a => u.norm(a.nombre));
    const nuevos = nombres.filter(n => curN.indexOf(u.norm(n)) < 0), bajas = cur.filter(a => nombres.map(u.norm).indexOf(u.norm(a.nombre)) < 0 && a.activo !== false);
    E.ui.importData = { nombres: nombres, meta: meta };
    E.modal.open('Revisar importación', '<p class="small">Origen: <b>' + esc(origen) + '</b>' + (meta.carrera ? ' · ' + esc(meta.carrera) + ' · ' + esc(meta.semestre || '') + ' ' + esc(meta.grupo || '') : '') + '</p>' +
      '<p><b>' + nombres.length + '</b> alumnos en la lista · <b>' + nuevos.length + '</b> nuevos' + (cur.length ? ' · <b>' + bajas.length + '</b> ya no aparecen (quedarían como baja, sin borrar su historial)' : '') + '.</p>' +
      '<ol class="small preview">' + nombres.map(n => '<li>' + esc(n) + '</li>').join('') + '</ol>' +
      '<p class="muted small">Se importarán a <b>' + esc(g.nombre) + '</b>.</p>' + btn('Importar', 'import-confirm', '', 'primary'));
  }
  A['import-confirm'] = () => {
    const d = E.ui.importData, g = D.grupoActual(); if (!d) return;
    S.update('grupo:' + g.id, gr => {
      const cur = gr.alumnos || []; const byN = {}; cur.forEach(a => { byN[u.norm(a.nombre)] = a; }); const vistos = {};
      const nuevos = d.nombres.map((n, i) => { const k = u.norm(n); vistos[k] = 1; const ex = byN[k]; return ex ? Object.assign({}, ex, { num: i + 1, nombre: n, activo: true }) : { id: u.uid('al'), num: i + 1, nombre: n, activo: true, notas: '' }; });
      cur.forEach(a => { if (!vistos[u.norm(a.nombre)]) nuevos.push(Object.assign({}, a, { activo: false, num: 900 + a.num })); });
      gr.alumnos = nuevos;
      if (d.meta.carrera) gr.carrera = d.meta.carrera; if (d.meta.semestre) gr.semestre = d.meta.semestre; if (d.meta.grupo) gr.grupo = d.meta.grupo;
    });
    E.modal.close(); u.toast('Lista importada: ' + d.nombres.length + ' alumnos', 'ok'); E.ui.importData = null;
  };

  V.alumno = id => {
    const g = D.grupoActual(); if (!g) return noGroup(); const a = D.alumno(g, id);
    if (!a) return { t: 'Alumno', h: card('<p>No encontré a este alumno.</p>' + link('Volver', 'alumnos', 'primary')) };
    let h = '<p><a href="#/alumnos">‹ Alumnos</a></p>';
    h += card('<h3>' + esc(a.nombre) + '</h3><p class="muted small">Número de lista ' + a.num + (a.activo === false ? ' · <b>baja</b>' : '') + '</p>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Parcial</th><th>Asistencias</th><th>Faltas</th><th>Part.</th><th>Calif.</th></tr></thead><tbody>' + D.parciales().map(p => {
        const as = C.asis(g, p, a.id), k = C.cal(g, p.id, a.id);
        return '<tr><td class="l">' + esc(p.nombre) + '</td><td>' + (k.manual ? (k.asis == null ? '—' : k.asis) : as.a) + '</td><td>' + (k.manual ? (k.fal == null ? '—' : k.fal) : as.f) + '</td><td>' + (k.manual ? '—' : C.part(g, p, a.id)) + '</td><td><span class="g ' + gclass(k.final) + '">' + gfmt(k.final) + '</span></td></tr>';
      }).join('') + '</tbody></table></div>');
    if (E.perfil) h += card((E.semaforo ? E.semaforo.alumnoHTML(g, a) : '') + E.perfil.cardHTML(g, a), 'pf');
    if (E.apoyos && E.semaforo) h += E.apoyos.alumnoHTML(g, a);
    const p = C.parcialActual(), as = C.asis(g, p, a.id);
    if (as.fechasF.length) h += card('<h3>Faltas en el ' + esc(p.nombre) + '</h3><p>' + as.fechasF.map(f => '<a class="chip bad" href="#/lista/' + f + '">' + u.fCorta(f) + '</a>').join(' ') + '</p>');
    const acts = C.acts(g, p.id);
    if (acts.length) h += card('<h3>Actividades del ' + esc(p.nombre) + '</h3><ul class="acts">' + acts.map(x => { const v = x.notas && x.notas[a.id], n = C.nota(x, a.id), mx = C.maxPts(x); return '<li><a href="#/actividad/' + x.id + '"><b>' + esc(x.nombre) + '</b><span class="muted small">' + (CAT_LBL[x.categoria] || '') + (n != null && mx !== 100 ? ' · ' + v + ' de ' + mx + ' pts' : '') + '</span></a><span class="g ' + gclass(n) + '">' + (n == null ? 'NE' : Math.round(n)) + '</span></li>'; }).join('') + '</ul>');
    h += card('<label class="fld"><span>Nombre</span><input id="al-nombre" value="' + esc(a.nombre) + '" data-ch="alumno-f" data-aid="' + a.id + '" data-f="nombre"></label>' +
      '<label class="fld"><span>Observaciones (solo tú las ves)</span><textarea id="al-notas" rows="4" data-ch="alumno-f" data-aid="' + a.id + '" data-f="notas">' + esc(a.notas || '') + '</textarea></label>' +
      '<div class="row gap wrap">' + btn(a.activo === false ? 'Reactivar' : 'Dar de baja', 'alumno-baja', 'data-aid="' + a.id + '"', 'ghost danger') + (a.activo === false ? btn(icon('trash') + ' Quitar de la lista', 'alumno-quitar', 'data-aid="' + a.id + '"', 'ghost danger') : '') + '</div>');
    return { t: 'Alumno', h: h };
  };
  CH['alumno-f'] = el => { const g = D.grupoActual(); S.update('grupo:' + g.id, gr => { const a = (gr.alumnos || []).find(x => x.id === el.dataset.aid); if (a) a[el.dataset.f] = el.dataset.f === 'nombre' ? el.value.trim() : el.value; }); };
  A['alumno-quitar'] = el => {
    const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid); if (!a || !confirm('¿Quitar a "' + a.nombre + '" de la lista? Sus calificaciones guardadas dejarán de mostrarse.')) return;
    S.update('grupo:' + g.id, gr => { gr.alumnos = (gr.alumnos || []).filter(x => x.id !== a.id); }); location.hash = '#/alumnos';
  };
  A['alumno-baja'] = el => { const g = D.grupoActual(); S.update('grupo:' + g.id, gr => { const a = (gr.alumnos || []).find(x => x.id === el.dataset.aid); if (a) a.activo = a.activo === false; }); };

  /* =================== CALENDARIO =================== */
  V.calendario = () => {
    const g = D.grupoActual(), hoy = u.today(), ps = D.parciales();
    let h = '';
    ps.forEach(p => {
      const hr = g ? C.horas(g, p) : null, sm = g ? D.submodulo(g, p.id) : null, dc = u.diffDays(hoy, p.captura);
      const cl = g ? C.clases(g, p) : [];
      h += card('<div class="row between gap wrap"><h3>' + esc(p.nombre) + (sm ? ' · Submódulo ' + sm.num : '') + '</h3>' + (dc >= 0 ? '<span class="chip ' + (dc <= 7 ? 'warn' : 'brand') + '">Captura en ' + dc + ' días</span>' : '<span class="chip">Capturado</span>') + '</div>' +
        '<dl class="kv"><dt>Periodo</dt><dd>' + u.fCorta(p.inicio) + ' – ' + u.fCorta(p.fin) + '</dd><dt>Captura</dt><dd>' + u.cap(u.fLarga(p.captura)) + '</dd><dt>Asuetos</dt><dd>' + ((p.asuetos || []).map(u.fCorta).join(', ') || '—') + '</dd>' +
        (hr ? '<dt>Tus horas</dt><dd>' + hr.disp + ' h en ' + hr.dias + ' días de clase' + (hr.programa ? ' (programa: ' + hr.programa + ' h)' : '') + '</dd>' : '') + '</dl>' +
        (cl.length ? '<details class="sub"><summary>Días de clase</summary><ul class="daylist">' + cl.map(c => { const reg = !!S.get('asis:' + g.id + ':' + c.fecha); return '<li class="' + (reg ? 'done' : (c.fecha < hoy ? 'miss' : '')) + (c.fecha === hoy ? ' today' : '') + '"><a href="#/lista/' + c.fecha + '">' + u.DIAS3[u.dow(c.fecha)] + ' ' + u.fDM(c.fecha) + '</a><br><span>' + c.horas + ' h</span></li>'; }).join('') + '</ul><p class="muted small">Verde: lista registrada · Amarillo: día pasado sin lista.</p></details>' : ''));
    });
    h += '<p class="muted small">Edita fechas y asuetos en Ajustes → Ciclo y parciales. Las capturas, cierres y asuetos ya están en tu Google Calendar.</p>';
    return { t: 'Calendario', h: h };
  };

  /* =================== BITÁCORA =================== */
  V.bitacora = () => {
    const g = D.grupoActual(), list = S.list('bit:').sort((a, b) => (b.fecha + (b.id || '')).localeCompare(a.fecha + (a.id || '')));
    let h = card('<h3>' + icon('book') + ' Nueva nota</h3><div class="fgrid">' + fieldIn('Fecha', 'id="bit-f"', u.today(), 'date') + '<div></div></div><label class="fld"><span>¿Qué pasó hoy? Avances, pendientes, incidentes</span><textarea id="bit-txt" rows="4" placeholder="Ej. Terminaron plantillas 4 de 6 equipos. Equipo 3 sin material. Mañana: ensamble."></textarea></label>' + btn('Guardar', 'bit-add', '', 'primary'));
    if (!list.length) h += card('<p class="muted">Aún no hay notas. Úsala al final de cada clase: te sirve para la planeación y para defender calificaciones.</p>');
    h += list.map(b => card('<div class="row between"><b>' + u.cap(u.fLarga(b.fecha)) + '</b>' + btn(icon('trash'), 'bit-del', 'data-id="' + b.id + '" aria-label="Eliminar nota"', 'ghost small') + '</div><p class="bitp">' + esc(b.texto) + '</p>')).join('');
    return { t: 'Bitácora docente', h: h };
  };
  A['bit-add'] = () => {
    const t = (document.getElementById('bit-txt').value || '').trim(); if (!t) { u.toast('Escribe la nota', 'err'); return; }
    const id = u.uid('bit'), g = D.grupoActual(); S.put('bit:' + id, { id: id, fecha: document.getElementById('bit-f').value || u.today(), grupoId: g ? g.id : '', texto: t }); u.toast('Nota guardada', 'ok');
  };
  A['bit-del'] = el => { if (confirm('¿Eliminar esta nota?')) S.del('bit:' + el.dataset.id); };

  /* =================== MEJORAS =================== */
  V.mejoras = () => {
    const list = D.mejoras();
    let h = card('<h3>' + icon('sparkle') + ' Ideas para mejorar Escuadra</h3><p class="muted small">Anota lo que se te ocurra mientras la usas. Cuando quieras, cópialas y pégalas a Claude para la siguiente versión.</p><label class="fld"><span>Nueva mejora</span><textarea id="mej-txt" rows="3" placeholder="Ej. Que la lista de cotejo traiga casillas por equipo"></textarea></label><div class="row gap wrap">' + btn('Agregar', 'mej-add', '', 'primary') + btn(icon('copy') + ' Copiar pendientes para Claude', 'mej-copy') + '</div>');
    h += card(list.length ? list.map(m => '<div class="chk-item ' + (m.hecho ? 'done' : '') + '"><input type="checkbox" data-ch="mej-toggle" data-id="' + m.id + '" ' + (m.hecho ? 'checked' : '') + ' aria-label="Hecho"><span>' + esc(m.texto) + ' <i class="muted small">' + u.fCorta(m.fecha) + '</i></span>' + btn(icon('trash'), 'mej-del', 'data-id="' + m.id + '" aria-label="Eliminar"', 'ghost small') + '</div>').join('') : '<p class="muted">Sin mejoras anotadas.</p>');
    return { t: 'Mejoras', h: h };
  };
  A['mej-add'] = () => { const t = (document.getElementById('mej-txt').value || '').trim(); if (!t) return; S.update('mejoras', l => { l.push({ id: u.uid('mej'), texto: t, hecho: false, fecha: u.today() }); }, []); };
  CH['mej-toggle'] = el => { S.update('mejoras', l => { const m = l.find(x => x.id === el.dataset.id); if (m) m.hecho = el.checked; }, []); };
  A['mej-del'] = el => { S.update('mejoras', l => l.filter(x => x.id !== el.dataset.id), []); };
  A['mej-copy'] = async () => {
    const p = D.mejoras().filter(m => !m.hecho); if (!p.length) { u.toast('No hay pendientes', 'err'); return; }
    const t = 'Mejoras para Escuadra v' + E.VERSION + ' (mi app de control docente, PWA en GitHub Pages + Supabase):\n' + p.map((m, i) => (i + 1) + '. ' + m.texto).join('\n');
    const ok = await u.copy(t); u.toast(ok ? 'Copiado: pégalo en tu chat con Claude' : 'No se pudo copiar', ok ? 'ok' : 'err');
  };

  /* =================== MÁS =================== */
  V.mas = () => {
    const it = [['planeacion', 'doc', 'Planeaciones', 'Formato SEMS, revisión y Word'], ['temas', 'screen', 'Temas', 'Teoría lista para proyectar'], ['ideas', 'bulb', 'Ideas', 'Prácticas, proyector y grupo'], ['imprimir', 'print', 'Imprimir', 'Listas, cotejo, rúbrica y acta'], ['herramientas', 'tool', 'Herramientas', 'Al azar, equipos, temporizador'], ['semaforo', 'grade', 'Semáforo', 'Va mal, regular o bien y su avance'], ['estrategias', 'star', 'Estrategias', 'Cómo ayudar a subir a cada nivel'], ['perfiles', 'profile', 'Perfiles', 'Fortalezas y apoyo por alumno'], ['alumnos', 'users', 'Alumnos', 'Lista, fichas e importación'], ['calendario', 'cal', 'Calendario', 'Parciales, asuetos y horas'], ['bitacora', 'book', 'Bitácora', 'Notas de cada clase'], ['mejoras', 'sparkle', 'Mejoras', 'Ideas para la app'], ['ajustes', 'gear', 'Ajustes', 'Escuela, grupo, sincronización']];
    return { t: 'Más', h: '<div class="mas-grid">' + it.map(x => '<a href="#/' + x[0] + '">' + icon(x[1]) + '<span>' + x[2] + '</span><small>' + x[3] + '</small></a>').join('') + '</div>' };
  };

  /* =================== AJUSTES =================== */
  V.ajustes = sub => {
    const c = D.cfg(), g = D.grupoActual(), ps = D.parciales(), sy = E.sync, cr = sy.creds(), m = sy.meta();
    const cf = (path, label, val, type, extra) => fieldIn(label, 'data-ch="cfg" data-path="' + path + '" id="cf-' + path + '"' + (type === 'number' ? ' inputmode="decimal"' : '') + ' ' + (extra || ''), val, type);
    const sel = (path, label, opts, val) => '<label class="fld"><span>' + label + '</span><select data-ch="cfg" data-path="' + path + '" id="cf-' + path + '">' + opts.map(o => '<option value="' + o[0] + '" ' + (String(val) === String(o[0]) ? 'selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label>';
    const tog = (path, label, val) => '<label class="switch"><input type="checkbox" data-ch="cfg" data-path="' + path + '" ' + (val ? 'checked' : '') + '><span>' + label + '</span></label>';
    const sec = (k, t, inner) => '<details class="sec" ' + (sub === k ? 'open' : '') + ' id="aj-' + k + '"><summary>' + t + '</summary><div class="in">' + inner + '</div></details>';
    const sumP = ['examen', 'trabajos', 'asistencia', 'participacion'].reduce((a, k) => a + Number(c.pond[k] || 0), 0);
    let h = '';
    const guia = !(sy.client && sy.user);
    h += '<p class="muted small">Escuadra v' + E.VERSION + ' · ' + btn('Buscar actualización', 'app-update', '', 'small ghost') + '</p>';
    h += sec('sync', '☁️ Sincronización (Supabase)', '<p class="note ' + ({ ok: 'ok', error: 'bad', offline: 'warn', auth: 'warn', syncing: 'info', local: '' })[sy.state] + '">' + esc(sy.msg) + (S.dirtyCount() ? ' · ' + S.dirtyCount() + ' cambios por subir' : '') + '</p>' +
      (guia ? '<details class="sub" ' + (sy.state === 'local' || sy.state === 'error' ? 'open' : '') + '><summary>Cómo conectarla, paso a paso (una sola vez, unos 10 minutos)</summary><ol class="steps">' +
        '<li>En <a href="https://supabase.com/dashboard" target="_blank" rel="noopener">supabase.com</a> → <b>New project</b>, nombre <code>escuadra</code>. Guarda la contraseña de la base (no la vas a usar aquí).</li>' +
        '<li><b>SQL Editor → New query</b> → pega el SQL → <b>Run</b>. ' + btn(icon('copy') + ' Copiar SQL', 'sync-sql', '', 'small') + '</li>' +
        '<li><b>Authentication → Users → Add user → Create new user</b>: tu correo y una contraseña, con <b>Auto Confirm User</b> marcado.</li>' +
        '<li><b>Authentication → Sign In / Providers → Email</b>: apaga <b>Allow new users to sign up</b> para que nadie más se registre.</li>' +
        '<li><b>Project Settings → API</b> (o <i>API Keys</i>): copia la <b>Project URL</b> y la llave <b>anon public</b> (o <i>publishable</i>) y pégalas abajo → <b>Guardar y conectar</b>.</li>' +
        '<li>Inicia sesión con el correo del paso 3. Repite solo el paso 5 y 6 en tu celular (o mándale a Claude la URL y la llave para dejarlas fijas en config.js y que solo inicies sesión).</li></ol>' +
        '<p class="muted small">Primero conéctala en el aparato que tiene tus datos buenos (tu compu): esos se suben y el celular los baja al iniciar sesión.</p></details>' : '') +
      (window.ESCUADRA_CONFIG && window.ESCUADRA_CONFIG.supabaseUrl ? '<p class="muted small">Conexión tomada de config.js.</p>' :
        fieldIn('Project URL', 'id="sy-url" placeholder="https://xxxx.supabase.co"', cr.url) + fieldIn('anon public key (o publishable key)', 'id="sy-key" placeholder="eyJ… o sb_publishable_…"', cr.key) + btn('Guardar y conectar', 'sync-connect', '', 'primary')) +
      (sy.client ? (sy.user ? '<p class="small mt">Sesión: <b>' + esc(sy.user.email) + '</b></p><div class="row gap wrap">' + btn('Sincronizar ahora', 'sync-now', '', 'primary') + btn('Cerrar sesión', 'sync-logout', '', 'ghost') + '</div>'
        : '<div class="mt">' + fieldIn('Correo', 'id="sy-email" autocomplete="username"', '', 'email') + fieldIn('Contraseña', 'id="sy-pw" autocomplete="current-password"', '', 'password') + btn('Iniciar sesión', 'sync-login', '', 'primary') + '</div>') : '') +
      (m.lastSyncAt ? '<p class="muted small mt">Última sincronización: ' + new Date(m.lastSyncAt).toLocaleString('es-MX') + '</p>' : ''));
    h += sec('docente', '👤 Docente y escuela', '<div class="fgrid">' + cf('docente', 'Nombre completo', c.docente) + cf('docenteCorto', 'Cómo te saludo', c.docenteCorto) + cf('plantel', 'Plantel', c.plantel) + cf('cct', 'C.C.T.', c.cct) + cf('entidad', 'Entidad', c.entidad) + cf('turno', 'Turno', c.turno) + cf('ciclo', 'Ciclo escolar', c.ciclo) + cf('periodo', 'Periodo', c.periodo) + '</div>' + cf('semestreTexto', 'Semestre (encabezado de planeaciones)', c.semestreTexto));
    h += sec('cal', '📊 Calificación', '<p class="small">Ponderación del parcial (debe sumar 100): <b class="' + (sumP === 100 ? 'okc' : 'badc') + '">' + sumP + '</b></p><div class="fgrid c4">' + cf('pond.examen', 'Examen %', c.pond.examen, 'number') + cf('pond.trabajos', 'Libreta/Proyecto/Bitácora %', c.pond.trabajos, 'number') + cf('pond.asistencia', 'Asistencia %', c.pond.asistencia, 'number') + cf('pond.participacion', 'Participación %', c.pond.participacion, 'number') + '</div>' +
      '<div class="fgrid">' + cf('metaPart', 'Participaciones para 100', c.metaPart, 'number') + cf('minAsis', 'Asistencia mínima %', c.minAsis, 'number') + cf('minAprob', 'Calificación mínima aprobatoria (debajo = 🔴 va mal)', c.minAprob, 'number') + cf('umbralBien', '🟢 Va bien desde', c.umbralBien, 'number') +
      sel('escalaActa', 'Escala del acta', [[100, 'Base 100'], [10, 'Base 10']], c.escalaActa) + sel('conteoActa', 'Asistencias y faltas del acta', [['dias', 'Por día de clase'], ['horas', 'Por hora']], c.conteoActa) + '</div>' +
      tog('vaciasCero', 'Actividad sin calificación cuenta como 0 (no entregó) después de su fecha de entrega', c.vaciasCero) + tog('retardoCuenta', 'Retardo cuenta como asistencia', c.retardoCuenta) + tog('justCuenta', 'Falta justificada cuenta como asistencia', c.justCuenta));
    if (g) {
      const gf = (path, label, val, type) => fieldIn(label, 'data-ch="grupo" data-path="' + path + '" id="gf-' + path + '"', val, type);
      h += sec('grupo', '👥 Grupo y horario', '<div class="fgrid">' + gf('nombre', 'Nombre corto', g.nombre) + gf('grupo', 'Grupo', g.grupo) + gf('semestre', 'Semestre', g.semestre) + gf('inicioDocente', 'Inicio con el grupo', g.inicioDocente, 'date') + '</div>' + gf('carrera', 'Carrera (como en la lista oficial)', g.carrera) +
        '<div class="fgrid c4"><label class="fld"><span>Módulo</span><select data-ch="grupo" data-path="modulo">' + Object.keys(E.PROGRAMA.modulos).map(k => '<option ' + (g.modulo === k ? 'selected' : '') + '>' + k + '</option>').join('') + '</select></label>' +
        ps.map(p => '<label class="fld"><span>Submódulo ' + esc(p.nombre) + '</span><select data-ch="grupo" data-path="submodulos.' + p.id + '"><option value="">—</option>' + Object.keys((E.PROGRAMA.modulos[g.modulo] || { sub: {} }).sub).map(k => '<option ' + ((g.submodulos || {})[p.id] === k ? 'selected' : '') + '>' + k + '</option>').join('') + '</select></label>').join('') + '</div>' +
        '<h4>Horario (' + (g.horario || []).reduce((a, b) => a + Number(b.horas || 0), 0) + ' h/semana)</h4>' + (g.horario || []).map((b, i) => '<div class="hrow"><select data-ch="hor" data-i="' + i + '" data-f="dia" aria-label="Día">' + [1, 2, 3, 4, 5, 6].map(d => '<option value="' + d + '" ' + (Number(b.dia) === d ? 'selected' : '') + '>' + u.DIAS3[d] + '</option>').join('') + '</select><input type="time" value="' + esc(b.inicio) + '" data-ch="hor" data-i="' + i + '" data-f="inicio" aria-label="Inicio"><input type="time" value="' + esc(b.fin) + '" data-ch="hor" data-i="' + i + '" data-f="fin" aria-label="Fin"><input type="number" value="' + esc(b.horas) + '" data-ch="hor" data-i="' + i + '" data-f="horas" inputmode="numeric" aria-label="Horas"><button type="button" class="iconbtn" data-act="hor-del" data-i="' + i + '" aria-label="Quitar">' + icon('x') + '</button><select class="hlugar" data-ch="hor" data-i="' + i + '" data-f="lugar" aria-label="Lugar">' + [['aula', '🏫 Aula'], ['computo', '💻 Centro de cómputo'], ['taller', '🛠️ Taller']].map(o => '<option value="' + o[0] + '" ' + ((b.lugar || 'aula') === o[0] ? 'selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>').join('') + '<p class="muted small">El lugar de cada bloque se usa en Clases para acomodar lo de computadora y las prácticas. Actualízalo cada semestre; si un día cambia, ajústalo solo en ese día desde Clases.</p>' +
        btn(icon('plus') + ' Agregar bloque', 'hor-add', '', 'small'));
    }
    h += sec('parciales', '📅 Ciclo y parciales', ps.map(p => '<div class="momento"><h4>' + esc(p.nombre) + '</h4><div class="fgrid c3">' +
      ['inicio', 'fin', 'captura'].map(f => fieldIn(({ inicio: 'Inicio', fin: 'Cierre', captura: 'Captura de calificaciones' })[f], 'data-ch="parcial" data-pid="' + p.id + '" data-f="' + f + '"', p[f], 'date')).join('') + '</div>' +
      '<p class="small">Asuetos: ' + ((p.asuetos || []).map(a => '<span class="chip">' + u.fCorta(a) + ' <button type="button" class="xbtn" data-act="asueto-del" data-pid="' + p.id + '" data-d="' + a + '" aria-label="Quitar">×</button></span>').join(' ') || '—') + '</p>' +
      '<div class="row gap"><input type="date" class="inp" id="asu-' + p.id + '" style="max-width:180px">' + btn('Agregar asueto', 'asueto-add', 'data-pid="' + p.id + '"', 'small') + '</div></div>').join(''));
    h += sec('app', '🎨 Apariencia y avisos', sel('tema', 'Tema', [['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Oscuro']], c.tema) +
      ('Notification' in window ? (Notification.permission === 'granted' ? '<p class="note ok">Notificaciones activas: te aviso al abrir la app cuando falten 7 días o menos para capturar.</p>' : btn('Activar notificaciones', 'notif-on', '', 'primary')) : '') +
      '<p class="muted small mt">Los avisos fuertes (captura, cierres y asuetos) ya están en tu Google Calendar con recordatorio por notificación y correo.</p>');
    h += sec('datos', '💾 Respaldo', '<p class="small">Descarga todo (alumnos, listas, calificaciones y planeaciones) en un archivo. Guárdalo en Drive de vez en cuando.</p><div class="row gap wrap">' + btn(icon('download') + ' Descargar respaldo', 'backup-dl', '', 'primary') + '<label class="btn filebtn">' + icon('upload') + ' Restaurar respaldo<input type="file" accept=".json" data-ch="backup-restore" hidden></label></div>' +
      '<p class="muted small mt">Privacidad: el código de la app no contiene nombres de alumnos. Se guardan en este dispositivo y, si conectas Supabase, solo en tu cuenta protegida con tu contraseña.</p>' + btn('Borrar datos de este dispositivo', 'wipe', '', 'ghost danger'));
    h += sec('acerca', 'ℹ️ Acerca de', '<p><b>Escuadra v' + E.VERSION + '</b> · Control docente para ' + esc(c.plantel) + '</p>' + E.CHANGELOG.map(x => '<p class="small"><b>v' + x.v + '</b> (' + x.f + '): ' + esc(x.t) + '</p>').join('') + '<p class="muted small">Programa cargado: ' + esc(E.FUENTE_PROGRAMA) + '.</p>');
    return { t: 'Ajustes', h: h, after: () => { if (sub) { const el = document.getElementById('aj-' + sub); if (el) el.scrollIntoView({ block: 'start' }); } } };
  };
  CH.cfg = el => {
    const path = el.dataset.path; let v = el.type === 'checkbox' ? el.checked : el.value;
    if (el.type === 'number' || ['escalaActa'].indexOf(path) >= 0) v = Number(v);
    S.update('config', cfg => { u.set(cfg, path, v); }, {});
    if (path === 'tema') E.applyTheme();
  };
  CH.grupo = el => {
    const g = D.grupoActual(), path = el.dataset.path;
    S.update('grupo:' + g.id, gr => { u.set(gr, path, el.value); if (path === 'modulo') gr.submodulos = {}; });
  };
  CH.hor = el => {
    const g = D.grupoActual(), i = Number(el.dataset.i), f = el.dataset.f;
    S.update('grupo:' + g.id, gr => { const b = gr.horario[i]; b[f] = (f === 'dia' || f === 'horas') ? Number(el.value) : el.value; });
  };
  A['hor-add'] = () => { const g = D.grupoActual(); S.update('grupo:' + g.id, gr => { gr.horario = gr.horario || []; gr.horario.push({ dia: 1, inicio: '07:30', fin: '08:20', horas: 1, lugar: 'aula' }); }); };
  A['hor-del'] = el => { const g = D.grupoActual(); S.update('grupo:' + g.id, gr => { gr.horario.splice(Number(el.dataset.i), 1); }); };
  CH.parcial = el => { S.update('parciales', ps => { const p = ps.find(x => x.id === el.dataset.pid); if (p && el.value) p[el.dataset.f] = el.value; }, D.parciales()); };
  A['asueto-add'] = el => {
    const pid = el.dataset.pid, v = (document.getElementById('asu-' + pid) || {}).value; if (!v) { u.toast('Elige una fecha', 'err'); return; }
    S.update('parciales', ps => { const p = ps.find(x => x.id === pid); p.asuetos = p.asuetos || []; if (p.asuetos.indexOf(v) < 0) p.asuetos.push(v); p.asuetos.sort(); }, D.parciales());
  };
  A['asueto-del'] = el => { S.update('parciales', ps => { const p = ps.find(x => x.id === el.dataset.pid); p.asuetos = (p.asuetos || []).filter(a => a !== el.dataset.d); }, D.parciales()); };
  A['sync-connect'] = async () => {
    const url = document.getElementById('sy-url').value.trim(), key = document.getElementById('sy-key').value.trim();
    if (!/^https:\/\/.+/.test(url) || !key) { u.toast('Revisa la URL y la llave', 'err'); return; }
    E.sync.setMeta({ url: url, key: key, lastPull: null }); E.sync.client = null; await E.sync.init(); E.render();
  };
  A['sync-login'] = async () => {
    try { await E.sync.login(document.getElementById('sy-email').value.trim(), document.getElementById('sy-pw').value); u.toast('Sesión iniciada', 'ok'); }
    catch (e) { u.toast('No se pudo iniciar sesión: ' + E.sync.explica(e), 'err', 7000); }
    E.render();
  };
  A['sync-now'] = async () => { await E.sync.now(); E.render(); };
  A['sync-sql'] = async () => { const ok = await u.copy(E.SCHEMA_SQL); u.toast(ok ? 'SQL copiado: pégalo en Supabase → SQL Editor → Run' : 'No se pudo copiar', ok ? 'ok' : 'err', 5000); };
  A['app-update'] = async () => {
    u.toast('Buscando la versión más nueva…');
    try { const r = navigator.serviceWorker && await navigator.serviceWorker.getRegistration(); if (r) await r.update(); } catch (e) { }
    setTimeout(() => location.reload(), 600);
  };
  A['sync-logout'] = async () => { await E.sync.logout(); E.render(); };
  A['notif-on'] = () => E.notify.pedir();
  A['backup-dl'] = () => { u.download('escuadra-respaldo-' + u.today() + '.json', JSON.stringify({ app: 'escuadra', version: E.VERSION, fecha: u.now(), docs: S.docs }, null, 1), 'application/json'); };
  CH['backup-restore'] = async el => {
    const file = el.files && el.files[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text()); if (!data || data.app !== 'escuadra' || !data.docs) throw new Error('No es un respaldo de Escuadra');
      if (!confirm('Se combinará el respaldo con tus datos actuales (gana lo más reciente). ¿Continuar?')) return;
      Object.keys(data.docs).forEach(k => { const r = data.docs[k], l = S.docs[k]; if (!l || Date.parse(r.ts) > Date.parse(l.ts)) S.docs[k] = Object.assign({}, r, { dirty: true }); });
      S.persist(); E.sync.schedule(); S.emit('__restore'); u.toast('Respaldo restaurado', 'ok');
    } catch (e) { u.toast('No se pudo restaurar: ' + e.message, 'err', 6000); }
    el.value = '';
  };
  A.wipe = () => {
    if (!confirm('Esto borra los datos guardados en ESTE dispositivo. Si tienes Supabase conectado, se vuelven a bajar al iniciar sesión. ¿Continuar?')) return;
    localStorage.removeItem('escuadra.docs.v1'); localStorage.removeItem('escuadra.meta.v1'); location.reload();
  };
})();

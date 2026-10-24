/* Escuadra · Más a tu medida (v1.27.18).
   Cinco bloques, en el orden en que los usas en el día: Para la clase · Para los alumnos (tareas y trabajos) ·
   Para padres y la cotutora · Planeaciones, consejo y administración · Sistema.
   «✏️ Acomodar menú»: arrastra ⠿ para cambiar de lugar dentro de su bloque y toca 👁 para esconder.
   Cuenta qué secciones abres (en este aparato), pone arriba lo que más usas y propone esconder lo que no abres en un mes.
   Lo escondido no se borra: queda en «Secciones escondidas» y se sigue pudiendo abrir. El orden y lo escondido se guardan
   en tu cuenta (igual en el celular y en la compu) y lo escondido también sale del menú lateral. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, icon = E.icon;
  const MN = E.menu = {};
  const KU = 'escuadra.uso', KD = 'escuadra.usoDesde';
  const FIJAS = ['mas', 'ajustes', 'ayuda', 'inicio'];

  // [ruta, ícono, título, descripción]
  const GRUPOS = [
    { k: 'clase', t: '🧭 Para la clase', d: 'Lo que das y pasas en el salón', it: [
      ['aula', 'grid', 'Modo clase', 'Nombres grandes: participación y asistencia'],
      ['cierre', 'check', 'Cierre del día', 'Tarea, participación y destacados de hoy'],
      ['cerrarsemana', 'note', 'Cerrar semana', 'Varios días sin cerrar, de un jalón'],
      ['temas', 'screen', 'Temas', 'Teoría lista para proyectar'],
      ['ideas', 'bulb', 'Ideas', 'Prácticas, proyector y grupo'],
      ['herramientas', 'tool', 'Herramientas', 'Al azar, equipos, temporizador'],
      ['dinamicas', 'sparkle', 'Dinámicas', 'Integrar, capacidades y convivencia'],
      ['freecad', 'cube', 'FreeCAD', ''],
      ['proyecto', 'team', 'Proyecto por equipo', 'Etapas y semáforo de cada equipo'],
      ['industria', 'factory', 'Industria', 'Ejemplos del Bajío, visitas y charlas'],
      ['mapa', 'grid', 'Mapa del salón', 'Dónde se sienta cada quien'],
      ['ruleta', 'dice', 'Ruleta equitativa', 'Participación pareja'],
      ['niveles', 'star', '3 niveles', 'Apoyo, estándar y reto'],
      ['examen', 'doc', 'Examen recomendado', 'Según lo visto y cómo va el grupo'],
      ['banco', 'doc', 'Banco de preguntas', 'Agrega las tuyas o pídeselas a Claude'],
      ['normas', 'book', 'Normas oficiales', 'Estudia y repasa las NOM del taller'],
      ['seguridad', 'alert', 'Seguridad', 'Reglamento firmado, revisión e incidentes'],
      ['inventario', 'tool', 'Inventario', 'Taller: préstamos y compras'],
      ['aprende', 'board', 'El guion aprende', 'Ajustes para el próximo grupo'],
      ['bitacora', 'book', 'Bitácora', 'Notas de cada clase']
    ] },
    { k: 'alumnos', t: '👥 Para los alumnos · tareas y trabajos', d: 'Tareas, trabajos, evidencias y seguimiento de cada alumno', it: [
      ['libreta', 'book', 'Tareas y libreta', 'Revisión y calificación de libreta'],
      ['entregas', 'clip', 'Entregas', 'Qué pedir y quién debe qué'],
      ['pendientes', 'inbox', 'Pendientes', 'Todo lo que falta capturar'],
      ['camara', 'cam', 'Cámara', 'QR de libretas, tarjetas, hojas de respuestas y fotos'],
      ['evidencias', 'cam', 'Evidencias', 'Fotos de trabajos (nunca caras)'],
      ['formularios', 'clip', 'Formularios', 'QR de tu Google Forms e importar respuestas'],
      ['semaforo', 'grade', 'Semáforo', 'Va mal, regular o bien y su avance'],
      ['estrategias', 'star', 'Estrategias', 'Cómo ayudar a subir a cada nivel'],
      ['perfiles', 'profile', 'Perfiles', 'Fortalezas y apoyo por alumno'],
      ['alumnos', 'users', 'Alumnos', 'Lista, fichas e importación'],
      ['constancias', 'star', 'Constancias', 'Logros para reconocer'],
      ['espaciado', 'book', 'Repaso espaciado', 'QR semanal: 1 semana, 1 mes, inicio'],
      ['encuesta', 'sparkle', 'Encuesta del mes', 'Anónima: ustedes dijeron, yo hice']
    ] },
    { k: 'padres', t: '🏠 Para padres y la cotutora', d: 'Lo que llevas a casa y lo que compartes con tu cotutora', it: [
      ['aprobar', 'grade', 'Para aprobar', 'Qué le falta a cada alumno y cuánto sube'],
      ['tutoria', 'team', 'Tutoría', 'Grupo, cooperaciones e ideas'],
      ['emergencia', 'alert', 'Emergencias', 'Teléfonos y seguro facultativo']
    ] },
    { k: 'admin', t: '🗂 Planeaciones, consejo y administración', d: 'Planeación, reportes y todo lo administrativo', it: [
      ['planeacion', 'doc', 'Planeaciones', 'Formato SEMS, revisión y Word'],
      ['imprimir', 'print', 'Imprimir', 'Listas, cotejo, rúbrica y acta'],
      ['precierre', 'check', 'Pre-cierre', 'Lo que falta para el acta'],
      ['consejo', 'chart', 'Consejo técnico', 'Reporte de cada grupo: imprimir o proyectar'],
      ['resultadosmas', 'chart', 'Resultados', 'Indicadores, juntas y autoevaluación'],
      ['calendario', 'cal', 'Calendario', 'Parciales, asuetos y horas'],
      ['grupos', 'team', 'Mis grupos', 'Agregar grupos y horarios, cambiar o archivar'],
      ['semestre', 'cal', 'Cambio de semestre', 'Archivar y crear el grupo nuevo'],
      ['mitiempo', 'timer', 'Tu tiempo', 'Días sin clase, calendario, expediente'],
      ['mipractica', 'profile', 'Mi práctica docente', 'Evidencias y reflexión'],
      ['vinculacion', 'factory', 'Vinculación (opcional)', 'Empresas, prácticas y egresados']
    ] },
    { k: 'sistema', t: '⚙️ Sistema', d: '', it: [
      ['inicio', 'home', 'Inicio', 'La pantalla de hoy'],
      ['claude', 'sparkle', 'Pídeselo a Claude', 'Mensajes listos, sin nombres'],
      ['mejoras', 'sparkle', 'Mejoras', 'Ideas para la app'],
      ['ajustes', 'gear', 'Ajustes', 'Escuela, grupo, sincronización'],
      ['ayuda', 'help', 'Ayuda y manual', 'Cómo usar cada pantalla · PDF']
    ] }
  ];
  const mk = x => ({ r: x[0], i: x[1], t: x[2], d: x[0] === 'freecad' ? (E.PRACTICAS ? E.PRACTICAS.length : 17) + ' prácticas con plano para proyectar' : x[3] });
  const todas = () => [].concat(...GRUPOS.map(g => g.it.map(mk)));

  const KUSO = () => { try { return JSON.parse(localStorage.getItem(KU) || '{}') || {}; } catch (e) { return {}; } };
  MN.uso = KUSO;
  MN.desde = () => { try { let d = localStorage.getItem(KD); if (!d) { d = u.today(); localStorage.setItem(KD, d); } return d; } catch (e) { return u.today(); } };
  MN.ocultas = () => (D.cfg().menuOcultos || []);
  MN.oculta = r => FIJAS.indexOf(r) < 0 && MN.ocultas().indexOf(r) >= 0;
  // orden guardado por bloque; lo nuevo que aparezca en una versión se va al final de su bloque
  MN.ordena = (gk, items) => {
    const o = ((D.cfg().menuOrden || {})[gk]) || [];
    return items.map((x, i) => ({ x: x, p: o.indexOf(x.r) >= 0 ? o.indexOf(x.r) : 100 + i })).sort((a, b) => a.p - b.p).map(y => y.x);
  };
  const cuenta = () => { const r = (location.hash.replace(/^#\/?/, '').split('/')[0]) || 'inicio'; const x = KUSO(); const o = x[r] = x[r] || { n: 0 }; o.n++; o.ult = u.today(); try { localStorage.setItem(KU, JSON.stringify(x)); } catch (e) { } };
  window.addEventListener('hashchange', cuenta); MN.desde();
  // puntaje: usos de los últimos 30 días pesan más
  MN.puntaje = r => { const o = MN.uso()[r]; if (!o) return 0; const d = o.ult ? u.diffDays(o.ult, u.today()) : 99; return o.n * (d <= 7 ? 3 : d <= 30 ? 1.5 : 0.3); };
  MN.sinUso = rutas => { const x = MN.uso(), hoy = u.today(); return rutas.filter(r => FIJAS.indexOf(r) < 0 && !MN.oculta(r) && (!x[r] || !x[r].ult || u.diffDays(x[r].ult, hoy) > 30)); };
  const setCfg = fn => { S.update('config', c => { fn(c); }, {}); if (E.pintaSide) setTimeout(E.pintaSide, 0); };
  const setOcultas = L => setCfg(c => { c.menuOcultos = Array.from(new Set(L)).filter(r => FIJAS.indexOf(r) < 0); });

  function tile(x, ed) {
    if (!ed) return '<a href="#/' + x.r + '">' + icon(x.i) + '<span>' + esc(x.t) + '</span><small>' + esc(x.d) + '</small></a>';
    const off = MN.oculta(x.r), fija = FIJAS.indexOf(x.r) >= 0;
    return '<div class="mn-t' + (off ? ' off' : '') + '" data-r="' + x.r + '">' +
      '<span class="mn-drag" title="Arrastra para cambiar de lugar" aria-label="Arrastrar ' + esc(x.t) + '">⠿</span>' +
      '<div class="mn-tt">' + icon(x.i) + '<span>' + esc(x.t) + '</span><small>' + esc(x.d) + '</small></div>' +
      (fija ? '<b class="mn-eye fija">Siempre aquí</b>' : '<button type="button" class="mn-eye" data-act="mn-tog" data-r="' + x.r + '">' + (off ? '👁 Mostrar' : '🙈 Esconder') + '</button>') + '</div>';
  }

  V.mas = () => {
    const ed = !!E.ui.menuEdit, vis = todas().filter(x => !MN.oculta(x.r)), ocu = todas().filter(x => MN.oculta(x.r));
    const top = vis.filter(x => MN.puntaje(x.r) > 0).sort((a, b) => MN.puntaje(b.r) - MN.puntaje(a.r)).slice(0, 6);
    const dias = u.diffDays(MN.desde(), u.today()), sug = dias >= 14 ? MN.sinUso(vis.map(x => x.r)) : [];
    let h = '';
    if (!ed && sug.length >= 4) h += card('<div class="row between gap wrap"><p class="small">🧹 <b>' + sug.length + ' secciones</b> no las has abierto en un mes en este aparato. ¿Las escondo para que el menú quede más limpio? Siguen disponibles abajo.</p><div class="row gap">' + btn('Esconderlas', 'mn-sug', '', 'small primary') + btn('Elegir yo', 'mn-edit', '', 'small ghost') + '</div></div>');
    if (!ed && top.length >= 3) h += '<h4 class="mn-h">⭐ Lo que más usas</h4><div class="mas-grid mn-top">' + top.map(x => tile(x, false)).join('') + '</div>';
    h += '<div class="row between gap wrap mn-bar"><span class="muted small">' + (ed ? 'Arrastra ⠿ para cambiar de lugar; 🙈 esconde y 👁 muestra.' : vis.length + ' secciones' + (ocu.length ? ' · ' + ocu.length + ' escondidas' : '')) + '</span>' + btn(ed ? '✓ Listo' : '✏️ Acomodar menú', 'mn-edit', '', 'small' + (ed ? ' primary' : ' ghost')) + '</div>';
    GRUPOS.forEach(g => {
      const items = MN.ordena(g.k, g.it.map(mk)), shown = ed ? items : items.filter(x => !MN.oculta(x.r));
      if (!shown.length) return;
      h += '<section class="mn-g"><h4 class="mn-h">' + esc(g.t) + '</h4>' + (g.d ? '<p class="muted small mn-gd">' + esc(g.d) + '</p>' : '') +
        '<div class="mas-grid mn-grid' + (ed ? ' mn-ed' : '') + '" data-grp="' + g.k + '">' + shown.map(x => tile(x, ed)).join('') + '</div></section>';
    });
    if (!ed && ocu.length) h += '<details class="sub mt" data-sec="mn-ocu"><summary>Secciones escondidas (' + ocu.length + ')</summary><div class="mas-grid">' + ocu.map(x => tile(x, false)).join('') + '</div>' + btn('Mostrar todas', 'mn-todas', '', 'small ghost') + '</details>';
    return { t: 'Más', h: h };
  };

  A['mn-edit'] = () => { E.ui.menuEdit = !E.ui.menuEdit; E.render(); };
  A['mn-tog'] = (el, e) => { if (e) e.preventDefault(); const r = el.dataset.r, L = MN.ocultas().slice(), i = L.indexOf(r); if (i >= 0) L.splice(i, 1); else L.push(r); setOcultas(L); };
  A['mn-sug'] = () => { const L = MN.ocultas().concat(MN.sinUso(todas().map(x => x.r))); setOcultas(L); u.toast('Listo: menú más limpio. Lo escondido queda al final.', 'ok', 4500); };
  A['mn-todas'] = () => setOcultas([]);

  /* arrastrar para reordenar dentro de cada bloque (⠿ con el dedo o el mouse) */
  let arr = null;
  document.addEventListener('pointerdown', e => {
    const h = e.target.closest && e.target.closest('.mn-drag'); if (!h || e.button > 0) return;
    const t = h.closest('.mn-t'); if (!t || !t.parentNode) return;
    arr = { el: t, g: t.parentNode, id: e.pointerId, moved: false }; t.classList.add('drag');
    try { h.setPointerCapture(e.pointerId); } catch (_) { }
    e.preventDefault();
  }, { passive: false });
  document.addEventListener('pointermove', e => {
    if (!arr || e.pointerId !== arr.id) return;
    const under = document.elementFromPoint(e.clientX, e.clientY), tg = under && under.closest && under.closest('.mn-t');
    if (!tg || tg === arr.el || tg.parentNode !== arr.g) return;
    const kids = [...arr.g.children];
    if (kids.indexOf(arr.el) < kids.indexOf(tg)) arr.g.insertBefore(arr.el, tg.nextSibling); else arr.g.insertBefore(arr.el, tg);
    arr.moved = true;
  });
  const sueltaMn = e => {
    if (!arr || (e && e.pointerId !== arr.id)) return;
    const d = arr; arr = null; d.el.classList.remove('drag'); if (!d.moved) return;
    const gk = d.g.dataset.grp, L = [...d.g.querySelectorAll('.mn-t')].map(x => x.dataset.r);
    if (gk) setCfg(c => { c.menuOrden = c.menuOrden || {}; c.menuOrden[gk] = L; });
  };
  document.addEventListener('pointerup', sueltaMn);
  document.addEventListener('pointercancel', sueltaMn);

  S.on(k => { if (k === 'config' || k === '__pull' || k === '__restore') { if (E.pintaSide) E.pintaSide(); } });
})();

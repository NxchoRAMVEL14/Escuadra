/* Escuadra · arranque, navegación y eventos. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data;
  E.VERSION = '1.3.0';
  E.CHANGELOG = [
    { v: '1.3.0', f: '2026-10-06', t: 'Nueva pantalla Clases: qué dar en cada bloque de tu horario (71 h del 2º parcial y 92 h del 3ero), alineada con tu planeación y con las actividades clave del programa SEP, con guion por minutos, material, evidencia, tarea, palabras para adelantar el tema y botón para proyectar; si una clase no se da, todo se recorre. Reparación automática de la lista si se pegó texto que no eran nombres. Guía paso a paso para conectar la sincronización y la app busca versión nueva cada vez que la abres.' },
    { v: '1.2.0', f: '2026-10-06', t: 'Perfil aproximado de cada alumno por semestre (punto de partida, conocimiento, trabajos, constancia, participación y actitud, con fortalezas, áreas de oportunidad y siguiente paso) y vista Perfiles del grupo con monitores, apoyo primero, equipos equilibrados, ficha imprimible y copia anónima para Claude. Observaciones de un toque al tocar el nombre en el Pase de lista. Actividades con puntos máximos (ej. examen de 94 puntos) y rubro Diagnóstico. "Pegar datos de Claude" para cargar listas y exámenes desde fotos.' },
    { v: '1.1.0', f: '2026-10-05', t: 'Nueva sección Temas: 26 temas del Módulo II (nivelación del Submódulo 1, mecanismos y neumática/hidráulica) más formación integral, con explicación para el docente, ejemplo resuelto, preguntas y modo Proyector a pantalla completa (con alumno al azar). 24 ideas nuevas para aula con proyector (simuladores PhET y PMKS+, Plickers, cámara lenta, escape room ISO 1219, proyecto de vida y más).' },
    { v: '1.0.0', f: '2026-10-05', t: 'Primera versión: inicio con avisos, pase de lista y participación, calificaciones 50/40/5/5 con acta, impresión de listas, cotejo y rúbrica, planeaciones con revisión automática y exportación a Word, banco de ideas, herramientas de clase, bitácora, mejoras y sincronización con Supabase.' }
  ];

  const NAV = [['inicio', 'Inicio', 'home'], ['clases', 'Clases', 'board'], ['lista', 'Lista', 'check'], ['calificaciones', 'Califs', 'grade'], ['mas', 'Más', 'more']];
  const SIDE = [['inicio', 'Inicio', 'home'], ['lista', 'Pase de lista', 'check'], ['clases', 'Clases', 'board'], ['calificaciones', 'Calificaciones', 'grade'], ['planeacion', 'Planeaciones', 'doc'], ['temas', 'Temas', 'screen'], ['perfiles', 'Perfiles', 'profile'], ['ideas', 'Ideas', 'bulb'], ['imprimir', 'Imprimir', 'print'], ['herramientas', 'Herramientas', 'tool'], ['alumnos', 'Alumnos', 'users'], ['calendario', 'Calendario', 'cal'], ['bitacora', 'Bitácora', 'book'], ['mejoras', 'Mejoras', 'sparkle'], ['ajustes', 'Ajustes', 'gear']];
  const MAS = ['planeacion', 'plan', 'temas', 'perfiles', 'imprimir', 'ideas', 'herramientas', 'alumnos', 'calendario', 'bitacora', 'mejoras', 'ajustes', 'mas'];
  const ACTIVO = { actividad: 'calificaciones', plan: 'planeacion', alumno: 'alumnos', tema: 'temas', clase: 'clases' };

  function shell() {
    document.getElementById('app').innerHTML =
      '<div class="layout"><aside class="side"><div class="brand">' + E.logo() + '<div><b>Escuadra</b><small>Control docente · v' + E.VERSION + '</small></div></div>' +
      '<nav>' + SIDE.map(x => '<a href="#/' + x[0] + '" data-r="' + x[0] + '">' + E.icon(x[2]) + '<span>' + x[1] + '</span></a>').join('') + '</nav><a class="sync" id="sync-side" href="#/ajustes/sync"></a></aside>' +
      '<div class="main"><header class="top"><div class="top-l"><span class="brand-m">' + E.logo() + '</span><h2 id="vt">Inicio</h2></div><a class="syncdot" id="sync-top" href="#/ajustes/sync" aria-label="Sincronización"></a></header><main id="view" class="view" tabindex="-1"></main></div>' +
      '<nav class="bnav">' + NAV.map(x => '<a href="#/' + x[0] + '" data-r="' + x[0] + '">' + E.icon(x[2]) + '<span>' + x[1] + '</span></a>').join('') + '</nav></div>';
  }
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, ''); const parts = h.split('/');
    return { name: parts[0] || 'inicio', args: parts.slice(1).map(decodeURIComponent) };
  }
  let raf = 0, lastRoute = '';
  E.render = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(doRender); };
  function doRender() {
    const r = parseHash(); const fn = E.views[r.name] || E.views.inicio; const routeKey = location.hash;
    const view = document.getElementById('view'); if (!view) return;
    const ae = document.activeElement; const fid = ae && ae.id && view.contains(ae) ? ae.id : null; let sel = null;
    try { if (fid && ae.selectionStart != null) sel = [ae.selectionStart, ae.selectionEnd]; } catch (e) { }
    const open = {}; view.querySelectorAll('details[data-sec],details[id]').forEach(d => { open[d.dataset.sec || d.id] = d.open; });
    let out; try { out = fn.apply(null, r.args); } catch (e) { console.error(e); out = { t: 'Error', h: '<section class="card"><h3>Algo falló al mostrar esta sección</h3><p class="muted small">Copia esto en "Mejoras" para pasárselo a Claude:</p><pre class="err">' + u.esc(e.stack || e.message) + '</pre></section>' }; }
    view.innerHTML = out.h; document.getElementById('vt').textContent = out.t; document.title = out.t + ' · Escuadra';
    if (routeKey === lastRoute) view.querySelectorAll('details[data-sec],details[id]').forEach(d => { const k = d.dataset.sec || d.id; if (k in open) d.open = open[k]; });
    const act = ACTIVO[r.name] || r.name;
    document.querySelectorAll('[data-r]').forEach(a => { const k = a.dataset.r; a.classList.toggle('on', k === act || (k === 'mas' && !!a.closest('.bnav') && MAS.indexOf(act) >= 0)); });
    if (fid) { const el = document.getElementById(fid); if (el) { try { el.focus({ preventScroll: true }); if (sel) el.setSelectionRange(sel[0], sel[1]); } catch (e) { } } }
    const nueva = routeKey !== lastRoute;
    if (nueva) { window.scrollTo(0, 0); lastRoute = routeKey; }
    if (out.after) out.after();
    const sc = nueva && view.querySelector('[data-scroll]'); if (sc) { const t = document.getElementById(sc.dataset.scroll); if (t) setTimeout(() => t.scrollIntoView({ block: 'start', behavior: 'smooth' }), 60); }
    renderSync();
  }
  function renderSync() {
    const sy = E.sync; const t = document.getElementById('sync-top'), s = document.getElementById('sync-side');
    if (t) { t.dataset.s = sy.state; t.title = sy.msg; }
    if (s) s.innerHTML = '<span class="dot" data-s="' + sy.state + '"></span>' + u.esc(sy.msg);
  }
  E.applyTheme = () => { const t = D.cfg().tema; if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; };

  /* ---------- eventos delegados ---------- */
  document.addEventListener('click', e => {
    if (e.target.id === 'modal') { E.modal.close(); return; }
    const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
    const fn = E.actions[el.dataset.act]; if (fn) { e.preventDefault(); fn(el, e); }
  });
  document.addEventListener('change', e => { const el = e.target.closest('[data-ch]'); if (!el) return; const fn = E.changes[el.dataset.ch]; if (fn) fn(el, e); });
  document.addEventListener('input', e => { const el = e.target.closest('[data-in]'); if (!el) return; const fn = E.inputs[el.dataset.in]; if (fn) fn(el, e); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !(E.proj && E.proj.t)) E.modal.close();
    if (e.key === 'Enter' && e.target.matches && e.target.matches('input[data-next]')) {
      e.preventDefault(); const nx = document.getElementById(e.target.dataset.next); e.target.blur();
      if (nx) { nx.focus(); try { nx.select(); } catch (_) { } }
    }
  });

  /* ---------- service worker ---------- */
  function registerSW() {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) u.toast('Hay una versión nueva de Escuadra. Cierra y vuelve a abrir la app para usarla.', 'ok', 9000); });
      });
    }).catch(err => console.warn('SW', err));
  }

  /* ---------- arranque ---------- */
  function boot() {
    S.load(); E.seed(); E.reparar(); E.applyTheme(); shell();
    S.on(key => { if (key === '__sync') { renderSync(); return; } if (key === '__pull') E.reparar(); E.render(); });
    window.addEventListener('hashchange', E.render);
    if (!location.hash) history.replaceState(null, '', '#/inicio');
    E.render(); E.sync.init(); registerSW();
    setTimeout(() => E.notify.check(), 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

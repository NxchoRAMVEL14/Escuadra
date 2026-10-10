/* Escuadra · arranque, navegación y eventos. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data;
  E.VERSION = '1.11.0';
  E.CHANGELOG = [
    { v: '1.11.0', f: '2026-10-09', t: 'Todo se proyecta, también en el centro de cómputo: cada actividad del guion tiene «Proyectar la clase» (meta, lo que harán con minutos, palabras clave, material, entrega y, si es de FreeCAD, la práctica con su plano y pasos) y «Ejercicios» con las preguntas del banco del tema (opciones A–D, se marca la correcta al revelar; los problemas salen con números nuevos: lo resolvemos juntos y ahora tú). Nueva sección FreeCAD (Más → FreeCAD): 15 prácticas en 3 niveles con plano acotado, pasos con el nombre de la herramienta en inglés y español, qué revisar, errores comunes, reto y entrega; se proyectan, se imprimen (hoja o cuadernillo) y se marcan como hechas. En los bloques de cómputo el guion sugiere «si terminan antes» las que el grupo todavía no hace.' },
    { v: '1.10.0', f: '2026-10-08', t: 'Nueva sección Dinámicas (Más → Dinámicas, también desde Herramientas y Tutoría): dices qué quieres lograr (integrar al grupo, desarrollar una capacidad, mejorar la relación contigo, que se sientan mejor consigo mismos o calmar al grupo), cuánto tiempo tienes, dónde y cómo está el grupo, y te recomienda dinámicas sin repetir las recientes. 27 dinámicas con guion paso a paso, lo que ven los alumnos, preguntas de cierre y qué cuidar; rutas de 4 sesiones para 8 capacidades (alineadas a Construye T); rutinas para la relación docente-alumno con respaldo de investigación; proyectar instrucciones, temporizador por paso, equipos y alumno al azar; registro de cómo salió (también en la bitácora); termómetro del grupo con tendencia y bingo humano imprimible (cada hoja distinta).' },
    { v: '1.9.0', f: '2026-10-08', t: 'Examen recomendado (Más → Examen recomendado, y desde Calificaciones): toma los temas que diste en Clases hasta la fecha del examen, reparte las preguntas según las horas de cada tema y le da más peso a lo que salió bajo antes; banco de 126 preguntas revisadas (opción múltiple, verdadero o falso, abiertas y 18 tipos de problemas con datos que cambian), versiones A y B, clave, tabla de especificaciones, captura por alumno (la calificación pasa sola a Calificaciones) o rápida, y análisis por tema, pregunta y alumno con qué hacer la próxima clase. Tareas y libreta: junta las tareas y los trabajos en libreta de las clases que diste, los revisas alumno por alumno (completa, incompleta, no) y la calificación entra sola como actividad de Libreta; lista de cotejo imprimible. Puntos extra ⭐ en cada actividad que suman a la participación, y la participación ahora es relativa: el que más participa en el parcial es el 100% y los demás en proporción (la meta fija queda como opción en Ajustes).' },
    { v: '1.8.0', f: '2026-10-08', t: 'Adelantar clases: en "¿Cómo salió esta clase?" ahora marcas "Me adelanté +1 h" cuando diste la clase en menos tiempo y seguiste con lo que venía; lo siguiente se jala a ese bloque y todo el parcial se recorre hacia antes (también desde el temporizador si terminas antes). Nueva sección Tutoría (Más → Tutoría): alerta temprana ABC (faltas, semáforo y llamadas de atención de tu módulo), cooperaciones con cuentas claras (quién pagó, pagos parciales, quién no paga, gastos con comprobante, dinero en caja, corte de caja para el grupo, pendientes para tesorería e impresión del control), tu plan de tutoría con responsable (tú, tu co-tutora, los dos o el grupo), seguimiento por alumno con notas, 20 ideas para tutores con sus fuentes y resumen para copiar a tu co-tutora.' },
    { v: '1.7.1', f: '2026-10-07', t: 'Clases: "¿Cómo salió esta clase?" al final de cada bloque. Si un tema te llevó más tiempo, marcas cuántas horas faltaron (Faltó 1 h, Faltaron 2 h…): el bloque se queda solo con lo que sí diste y lo demás pasa a la siguiente clase, sin usar el temporizador. "Completa" lo regresa y "No se dio" recorre todo el bloque como antes.' },
    { v: '1.7.0', f: '2026-10-07', t: 'Imágenes y videos en cada tema: 21 animaciones propias (mecanismos, engranes, levas, neumática, escalera eléctrica y más) que funcionan sin internet, con pausa y cámara lenta, y 44 videos de YouTube revisados que se ven dentro de la app. Aparecen en el tema, en el guion de la clase y como diapositivas del proyector; en el Presentador hay botones para reproducir y pausar el video del proyector. Puedes agregar tus propios videos, imágenes o páginas a cada tema. Plan para subir de nivel en el Semáforo: estrategias con respaldo de investigación para los que van mal, los regulares y los que van bien (elegidas según por qué va así cada alumno), parejas de tutoría automáticas con guía para monitores, registro de apoyos por alumno y "¿Funcionan los apoyos?" para ver si los que recibieron apoyo subieron. Nueva pantalla Estrategias.' },
    { v: '1.6.0', f: '2026-10-07', t: 'Semáforo del grupo: cada alumno queda como va mal, regular o va bien según su promedio de examen y trabajos (con tus ponderaciones; el diagnóstico es el punto de partida). Muestra cuántos hay de cada uno y su porcentaje, la lista de atención especial con el siguiente paso, ordena de mal a bien, filtra (va mal, regular, bien, mejoraron, bajaron, asistencia) y guarda un corte cada viernes para ver si los que van mal suben. También aparece en Inicio y en la ficha de cada alumno.' },
    { v: '1.5.0', f: '2026-10-07', t: 'Modo Presentador: el proyector muestra solo la diapositiva y tu laptop o celular muestra el control, la respuesta antes de revelarla, tus notas, lo que sigue, alumno al azar y pantalla en negro. Se abre en una segunda ventana (laptop en "Extender" o Galaxy con DeX) y, con la sincronización conectada, también entre dos aparatos.' },
    { v: '1.4.0', f: '2026-10-06', t: 'Clase con temporizador: en el guion de cada clase tocas "Dar esta clase con temporizador" y una barra te lleva paso a paso, avisa (sonido y vibración) cuando se acaba el tiempo de un paso, si vas atrasado y si ya no alcanzas antes de que termine el bloque; al final guarda los tiempos en la bitácora y puede recorrer lo que faltó a la siguiente clase. Lugar de cada clase: en Ajustes → Grupo y horario marcas qué bloques son aula, centro de cómputo o taller (este semestre, los viernes en cómputo). Clases acomoda sola lo de computadora en esos bloques, nunca pone corte ni agua en el centro de cómputo, y si un día cambias un bloque a taller se trae la siguiente práctica. Secuencias del 2º y 3er parcial reorganizadas para los viernes de cómputo.' },
    { v: '1.3.0', f: '2026-10-06', t: 'Nueva pantalla Clases: qué dar en cada bloque de tu horario (71 h del 2º parcial y 92 h del 3ero), alineada con tu planeación y con las actividades clave del programa SEP, con guion por minutos, material, evidencia, tarea, palabras para adelantar el tema y botón para proyectar; si una clase no se da, todo se recorre. Reparación automática de la lista si se pegó texto que no eran nombres. Guía paso a paso para conectar la sincronización y la app busca versión nueva cada vez que la abres.' },
    { v: '1.2.0', f: '2026-10-06', t: 'Perfil aproximado de cada alumno por semestre (punto de partida, conocimiento, trabajos, constancia, participación y actitud, con fortalezas, áreas de oportunidad y siguiente paso) y vista Perfiles del grupo con monitores, apoyo primero, equipos equilibrados, ficha imprimible y copia anónima para Claude. Observaciones de un toque al tocar el nombre en el Pase de lista. Actividades con puntos máximos (ej. examen de 94 puntos) y rubro Diagnóstico. "Pegar datos de Claude" para cargar listas y exámenes desde fotos.' },
    { v: '1.1.0', f: '2026-10-05', t: 'Nueva sección Temas: 26 temas del Módulo II (nivelación del Submódulo 1, mecanismos y neumática/hidráulica) más formación integral, con explicación para el docente, ejemplo resuelto, preguntas y modo Proyector a pantalla completa (con alumno al azar). 24 ideas nuevas para aula con proyector (simuladores PhET y PMKS+, Plickers, cámara lenta, escape room ISO 1219, proyecto de vida y más).' },
    { v: '1.0.0', f: '2026-10-05', t: 'Primera versión: inicio con avisos, pase de lista y participación, calificaciones 50/40/5/5 con acta, impresión de listas, cotejo y rúbrica, planeaciones con revisión automática y exportación a Word, banco de ideas, herramientas de clase, bitácora, mejoras y sincronización con Supabase.' }
  ];

  const NAV = [['inicio', 'Inicio', 'home'], ['clases', 'Clases', 'board'], ['lista', 'Lista', 'check'], ['calificaciones', 'Califs', 'grade'], ['mas', 'Más', 'more']];
  const SIDE = [['inicio', 'Inicio', 'home'], ['lista', 'Pase de lista', 'check'], ['clases', 'Clases', 'board'], ['calificaciones', 'Calificaciones', 'grade'], ['examen', 'Examen', 'doc'], ['libreta', 'Libreta', 'book'], ['planeacion', 'Planeaciones', 'doc'], ['temas', 'Temas', 'screen'], ['semaforo', 'Semáforo', 'grade'], ['estrategias', 'Estrategias', 'star'], ['tutoria', 'Tutoría', 'team'], ['dinamicas', 'Dinámicas', 'sparkle'], ['freecad', 'FreeCAD', 'cube'], ['perfiles', 'Perfiles', 'profile'], ['ideas', 'Ideas', 'bulb'], ['imprimir', 'Imprimir', 'print'], ['herramientas', 'Herramientas', 'tool'], ['alumnos', 'Alumnos', 'users'], ['calendario', 'Calendario', 'cal'], ['bitacora', 'Bitácora', 'book'], ['mejoras', 'Mejoras', 'sparkle'], ['ajustes', 'Ajustes', 'gear']];
  const MAS = ['planeacion', 'plan', 'temas', 'examen', 'libreta', 'semaforo', 'estrategias', 'tutoria', 'dinamicas', 'freecad', 'perfiles', 'imprimir', 'ideas', 'herramientas', 'alumnos', 'calendario', 'bitacora', 'mejoras', 'ajustes', 'mas'];
  const ACTIVO = { actividad: 'calificaciones', plan: 'planeacion', alumno: 'alumnos', tema: 'temas', clase: 'clases', presentador: 'temas', dinamica: 'dinamicas' };

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
    if (E.modoPantalla) { S.load(); E.seed(); E.pres.pantalla(); registerSW(); return; }
    S.load(); E.seed(); E.reparar(); E.applyTheme(); shell();
    S.on(key => { if (key === '__sync') { renderSync(); return; } if (key === '__pull') E.reparar(); E.render(); });
    window.addEventListener('hashchange', E.render);
    if (!location.hash) history.replaceState(null, '', '#/inicio');
    E.render(); E.sync.init(); registerSW();
    setTimeout(() => E.notify.check(), 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

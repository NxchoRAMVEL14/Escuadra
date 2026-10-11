/* Escuadra · Captura rápida (v1.15): deshacer, buscar alumno, filtrar listas, mantener presionado, atajos de teclado y
   salto automático al capturar calificaciones. Todo funciona sin internet y solo con lo que ya está en tu dispositivo. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const A = E.actions, CH = E.changes, IN = E.inputs, H = E.h;
  const btn = H.btn, link = H.link, icon = E.icon;
  const R = E.rap = { ver: 0, KB: {} };
  S.on(k => { if (k !== '__sync') R.ver++; });
  E.ui.flt = E.ui.flt || {}; E.ui.kb = E.ui.kb || {};
  const editable = t => !!t && (t.isContentEditable || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || (t.tagName === 'INPUT' && !/^(checkbox|radio|button|submit|range|color|file)$/i.test(t.type)));
  const modalAbierto = () => { const m = document.getElementById('modal'); return !!m && !m.hidden; };

  /* =================== deshacer =================== */
  // Cada toque o cambio que guarda datos queda como un paso; «↶ Deshacer» (o Ctrl+Z) regresa los documentos a como estaban.
  const UD = E.undo = { stack: [], cur: null, depth: 0, busy: false };
  const NOMBRE = { asis: 'asistencia', 'asis-set': 'asistencia', 'asis-todos': 'lista', 'asis-borrar': 'lista', part: 'participación', 'cr-part': 'participación', 'au-tap': 'Modo clase', 'bs-part': 'participación', nota: 'calificación', 'act-fill': 'calificaciones', 'act-extra': 'punto extra', 'lb-marca': 'libreta', 'lb-todas': 'libreta', 'cr-mk': 'tarea', 'cr-mk-todos': 'tarea', 'fc-marca': 'práctica', 'fc-pend': 'prácticas', 'fc-todos': 'prácticas', 'obs-tog': 'observación', 'cr-obs': 'destacado', 'cap-niv': 'rúbrica', 'cap-crit-ok': 'rúbrica', 'cap-pg-ok': 'calificaciones pegadas', 'cap-eq-ok': 'calificación por equipo', tarjeta: 'tarjeta', dictado: 'dictado', 'jus-ok': 'justificación', 'mp-seat': 'mapa', 'mp-al': 'mapa', 'mp-llenar': 'mapa', 'mp-vaciar': 'mapa', 'pd-omit': 'pendientes', 'pd-ev': 'actividad', 'pj-st': 'proyecto', qr: 'escaneo', 'esc-cambia': 'tarea', 'esc-fin-asis': 'lista', 'tj2-guardar': 'tarjetas', omr: 'hoja de respuestas', 'omr-ok': 'hoja de respuestas', formulario: 'formulario', 'fm-aplicar': 'formulario', 'act-tarde': 'entrega tarde', 'lb-tarde': 'entrega tarde', 'fc-tarde': 'entrega tarde', 'ap-rec-ok': 'entrega tarde', 'ap-rec-m': 'entrega tarde' };
  const put0 = S.put.bind(S), del0 = S.del.bind(S);
  const foto = k => { const d = S.docs[k]; return d ? { data: u.clone(d.data), deleted: !!d.deleted } : null; };
  const anota = k => { const c = UD.cur; if (c && !UD.busy && !Object.prototype.hasOwnProperty.call(c.prev, k)) c.prev[k] = foto(k); };
  S.put = function (key, data, opt) { anota(key); return put0(key, data, opt); };
  S.del = function (key) { anota(key); return del0(key); };
  UD.begin = lbl => { if (UD.depth++ === 0) UD.cur = { lbl: lbl || '', prev: {} }; };
  UD.end = () => {
    if (UD.depth > 0) UD.depth--; if (UD.depth) return;
    const c = UD.cur; UD.cur = null;
    if (c && Object.keys(c.prev).length) { UD.stack.push(c); if (UD.stack.length > 40) UD.stack.shift(); chip(); }
  };
  UD.run = (lbl, fn) => { UD.begin(lbl); try { return fn(); } finally { UD.end(); } };
  UD.undo = () => {
    const c = UD.stack.pop(); if (!c) { u.toast('No hay cambios para deshacer'); ocultaChip(); return false; }
    UD.busy = true;
    try {
      Object.keys(c.prev).reverse().forEach(k => {
        const p = c.prev[k], hay = S.docs[k] && !S.docs[k].deleted;
        if (!p || p.deleted) { if (hay) del0(k); } else put0(k, p.data);
      });
    } finally { UD.busy = false; }
    u.toast('↶ Deshice ' + (NOMBRE[c.lbl] ? 'el cambio de ' + NOMBRE[c.lbl] : 'el último cambio'), 'ok', 2200);
    if (navigator.vibrate) navigator.vibrate(15);
    if (UD.stack.length) chip(); else ocultaChip();
    return true;
  };
  // el botón «↶ Deshacer» aparece arriba (junto a la lupa) para no tapar nombres ni botones de la pantalla
  let chipT = 0;
  function chip() {
    const el = document.getElementById('undo-top'), c = UD.stack[UD.stack.length - 1]; if (!el || !c) return;
    el.innerHTML = icon('undo') + '<span>Deshacer</span>' + (NOMBRE[c.lbl] ? '<small>' + esc(NOMBRE[c.lbl]) + '</small>' : '');
    el.setAttribute('aria-label', 'Deshacer ' + (NOMBRE[c.lbl] ? 'el cambio de ' + NOMBRE[c.lbl] : 'el último cambio'));
    el.hidden = false; el.classList.remove('nuevo'); void el.offsetWidth; el.classList.add('nuevo'); clearTimeout(chipT); chipT = setTimeout(ocultaChip, 8000);
  }
  function ocultaChip() { const el = document.getElementById('undo-top'); if (el) el.hidden = true; }
  A.undo = () => UD.undo();

  /* =================== mantener presionado =================== */
  // data-lp="accion" en un botón: mantenerlo ~½ s (o clic derecho en la compu) llama E.lp[accion](botón).
  const LP = E.lp = {};
  let lpT = 0, lpEl = null, lpX = 0, lpY = 0, lpDown = false, lpArmed = false, lpBlock = 0;
  // arm: el dedo sigue abajo, así que el clic que llega al soltar no debe contar como toque
  const lpRun = (el, arm) => { const fn = LP[el.dataset.lp]; if (!fn) return; if (arm) lpArmed = true; if (navigator.vibrate) navigator.vibrate(30); UD.run(el.dataset.lp, () => fn(el)); };
  const lpCancel = () => { clearTimeout(lpT); lpEl = null; };
  document.addEventListener('pointerdown', e => {
    if (e.button > 0) return; lpDown = true; const el = e.target.closest && e.target.closest('[data-lp]'); if (!el) return;
    lpEl = el; lpX = e.clientX; lpY = e.clientY; clearTimeout(lpT);
    lpT = setTimeout(() => { const x = lpEl; lpEl = null; if (x) lpRun(x, true); }, 480);
  }, { passive: true });
  document.addEventListener('pointerup', () => { lpDown = false; if (lpArmed) { lpArmed = false; lpBlock = Date.now() + 500; } lpCancel(); }, true);
  document.addEventListener('pointercancel', () => { lpDown = false; lpArmed = false; lpCancel(); }, true);
  document.addEventListener('pointermove', e => { if (lpEl && (Math.abs(e.clientX - lpX) > 10 || Math.abs(e.clientY - lpY) > 10)) lpCancel(); }, { passive: true });
  document.addEventListener('click', e => { if (lpBlock && Date.now() < lpBlock) { e.stopPropagation(); e.preventDefault(); lpBlock = 0; } }, true);
  // clic derecho en la compu (o el menú del celular) = mantener presionado
  document.addEventListener('contextmenu', e => {
    const el = e.target.closest && e.target.closest('[data-lp]'); if (!el) return; e.preventDefault();
    if (lpArmed || (lpBlock && Date.now() < lpBlock)) return; lpCancel(); lpRun(el, lpDown);
  });

  /* =================== buscar alumno (lupa arriba y tecla /) =================== */
  const coincide = (q, f) => {
    if (!f) return true; const p = q.split(' '), num = p[0];
    if (/^\d+$/.test(f)) return num === f;
    return f.split(' ').every(t => p.slice(1).some(x => x.indexOf(t) === 0));
  };
  R.qAttr = a => ' data-q="' + esc(a.num + ' ' + u.norm(a.nombre)) + '"';
  R.filtra = (al, q) => { const f = u.norm(q); if (!f) return []; return al.filter(a => coincide(a.num + ' ' + u.norm(a.nombre), f)); };
  function buscaHTML(q) {
    const g = D.grupoActual(); if (!g) return '<p class="muted">No hay grupo.</p>';
    if (!String(q || '').trim()) return '<p class="muted small">Escribe el número de lista o parte del nombre o apellido. Enter abre la ficha del primero.</p>';
    const r = R.filtra(D.alumnos(g), q), hoy = u.today();
    if (!r.length) return '<p class="muted small">Nadie coincide con «' + esc(q) + '».</p>';
    return '<ul class="bs-res">' + r.slice(0, 12).map(a => '<li><a href="#/alumno/' + a.id + '" data-act="bs-go" data-to="alumno/' + a.id + '"><span class="num">' + a.num + '</span>' + esc(a.nombre) + '</a><span class="row gap">' +
      btn('+1 ⭐', 'bs-part', 'data-aid="' + a.id + '" aria-label="Sumar participación hoy"', 'small') + btn('👁', 'obs-open', 'data-aid="' + a.id + '" data-fecha="' + hoy + '" aria-label="Anotar observación"', 'small ghost') + '</span></li>').join('') + '</ul>';
  }
  A.buscar = () => {
    E.modal.open('Buscar alumno', '<input type="search" class="inp" id="bs-q" data-in="bs-q" placeholder="Número de lista o nombre" autocomplete="off" enterkeyhint="go" aria-label="Buscar alumno"><div id="bs-out" class="mt">' + buscaHTML('') + '</div>');
    setTimeout(() => { const i = document.getElementById('bs-q'); if (i) i.focus(); }, 30);
  };
  IN['bs-q'] = el => { const o = document.getElementById('bs-out'); if (o) o.innerHTML = buscaHTML(el.value); };
  A['bs-go'] = el => { E.modal.close(); location.hash = '#/' + el.dataset.to; };
  A['bs-part'] = el => {
    const g = D.grupoActual(), f = u.today(), aid = el.dataset.aid;
    S.update('part:' + g.id + ':' + f, d => { d[aid] = Number(d[aid] || 0) + 1; }, {});
    const n = (S.get('part:' + g.id + ':' + f) || {})[aid]; u.toast('+1 participación hoy (lleva ' + n + ')', 'ok', 1800);
  };

  /* =================== filtro en listas largas =================== */
  R.filtroHTML = (k, ph) => '<div class="filtro">' + icon('search') + '<input type="search" class="inp" id="flt-' + k + '" data-in="filtro" data-k="' + k + '" value="' + esc(E.ui.flt[k] || '') + '" placeholder="' + esc(ph || 'Buscar: número o nombre') + '" autocomplete="off" enterkeyhint="go" aria-label="Buscar alumno en la lista"><span class="filtro-n"></span></div>';
  R.aplicaFiltro = inp => {
    const f = u.norm(inp.value), view = document.getElementById('view'); if (!view) return; let n = 0;
    view.querySelectorAll('[data-q]').forEach(r => { const ok = coincide(r.dataset.q, f); r.hidden = !ok; if (ok) n++; });
    const w = inp.parentNode; w.classList.toggle('on', !!f); const c = w.querySelector('.filtro-n'); if (c) c.textContent = f ? (n === 1 ? '1 alumno' : n + ' alumnos') : '';
  };
  R.filtroActivo = () => { const view = document.getElementById('view'), fl = view && view.querySelector('input[data-in="filtro"]'); return fl && fl.value.trim() ? fl : null; };
  IN.filtro = el => { E.ui.flt[el.dataset.k] = el.value; R.aplicaFiltro(el); };
  // Enter en el filtro: al primero que quedó visible (su calificación, si la hay)
  function enterFiltro(inp) {
    const view = document.getElementById('view'), row = [...view.querySelectorAll('[data-q]')].find(r => !r.hidden); if (!row) return;
    const t = row.querySelector('input.score,[data-fprim]');
    if (t) { t.focus(); try { t.select(); } catch (e) { } R.selId = t.id || null; } else { row.scrollIntoView({ block: 'center' }); row.classList.remove('flash'); void row.offsetWidth; row.classList.add('flash'); }
  }

  /* =================== salto al siguiente alumno =================== */
  R.selId = null;
  // auto: el salto lo hizo el teclado solo; si enseguida llega un Enter «por costumbre», no debe saltar a otro alumno
  R.auto = null;
  R.siguiente = (t, auto) => {
    const fl = R.filtroActivo(); let dest = null;
    if (fl && fl !== t) { t.blur(); fl.focus(); try { fl.select(); } catch (e) { } dest = fl; }
    else {
      const nx = t.dataset.next && document.getElementById(t.dataset.next);
      t.blur();
      if (nx) { nx.focus(); try { nx.select(); } catch (e) { } R.selId = nx.id; const li = nx.closest('li,tr'); if (li) li.scrollIntoView({ block: 'nearest' }); dest = nx; }
      else if (t.matches('input.score')) u.toast('Último de la lista ✓', 'ok', 1600);
    }
    R.auto = auto && dest ? { id: dest.id, val: dest.value, t: Date.now() } : null;
    return true;
  };
  // 85 → salta solo; 10 espera (puede ser 100). Con escalas menores a 20 no salta (pueden llevar decimales).
  document.addEventListener('input', e => {
    const t = e.target; if (R.selId && t.id === R.selId) R.selId = null;
    if (!t.matches || !t.matches('input[data-auto]') || D.cfg().autoSalto === false) return;
    const s = String(t.value || ''); if (!/^\d+$/.test(s)) return;
    const mx = Number(t.max) || 100; if (mx < 20) return;
    if (Number(s) * 10 > mx) R.siguiente(t, true);
  });
  document.addEventListener('focusin', e => { if (R.selId && e.target.id !== R.selId) R.selId = null; });

  /* =================== teclado =================== */
  const filas = L => [...L.querySelectorAll('[data-kbr]')].filter(r => !r.hidden && r.offsetParent !== null);
  const marcaFila = (L, row) => { L.querySelectorAll('.kbsel').forEach(x => x.classList.remove('kbsel')); if (!row) return; row.classList.add('kbsel'); E.ui.kb[L.dataset.kb] = row.dataset.kbr; row.scrollIntoView({ block: 'nearest' }); };
  const avanza = (L, rows, i) => { const nx = rows[i + 1]; if (nx) marcaFila(L, nx); };
  function scoreMove(t, d) {
    const box = t.closest('#modal-body') || document.getElementById('view'), all = [...box.querySelectorAll('input.score')].filter(x => x.offsetParent !== null), i = all.indexOf(t), nx = i < 0 ? null : all[i + d];
    if (!nx) return; nx.focus(); try { nx.select(); } catch (e) { } R.selId = nx.id || null; const li = nx.closest('li,tr'); if (li) li.scrollIntoView({ block: 'nearest' });
  }
  function ayuda() {
    const k = (t, d) => '<li><kbd>' + t + '</kbd><span>' + d + '</span></li>';
    E.modal.open('⌨️ Atajos de teclado', '<ul class="kb-help">' + k('/', 'Buscar alumno y abrir su ficha') + k('Ctrl + Z', 'Deshacer el último cambio') + k('↑ ↓', 'Cambiar de alumno (calificaciones, pase de lista, revisión de prácticas y cierre)') +
      k('Enter', 'Guardar y pasar al siguiente alumno; con el buscador de la lista, regresa a él') + k('1 · 2 · 3', '✓ completa · ½ incompleta · ✗ no la hizo (libreta, prácticas, cierre y tarjetas)') + k('T', '⏰ La entregó tarde (libreta y prácticas): vale el % de Ajustes → Calificación') +
      k('A · F · R · J', 'En el pase de lista: asistió, falta, retardo o justificada') + k('+ · −', 'En el pase de lista: sumar o quitar participación') + k('O', 'En el pase de lista: anotar observación') +
      k('→ ↑ ←', 'En las tarjetas: completa, incompleta, no la hizo') + k('?', 'Ver esta ayuda') + '</ul><p class="muted small">En el celular: mantén presionado para más opciones (retardo, justificada, observaciones) y usa «↶ Deshacer» si te equivocas.</p>');
  }
  A['kb-ayuda'] = ayuda;
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented) return;
    const t = e.target, ed = editable(t), k = e.key;
    if (k === 'Enter' && R.auto && t && t.id === R.auto.id) { const a = R.auto; R.auto = null; if (t.value === a.val && Date.now() - a.t < 2500) { e.preventDefault(); e.stopImmediatePropagation(); return; } }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (k === 'z' || k === 'Z') && !ed) { e.preventDefault(); UD.undo(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (t && t.id === 'bs-q' && k === 'Enter') { e.preventDefault(); const a = document.querySelector('#bs-out [data-act="bs-go"]'); if (a) a.click(); return; }
    if (t && t.matches && t.matches('input[data-in="filtro"]') && k === 'Enter') { e.preventDefault(); enterFiltro(t); return; }
    if (t && t.matches && t.matches('input.score') && (k === 'ArrowDown' || k === 'ArrowUp')) { e.preventDefault(); scoreMove(t, k === 'ArrowDown' ? 1 : -1); return; }
    if (modalAbierto()) { if (E.cap && E.cap.tecla && E.cap.tecla(e)) return; return; }
    if (ed) return;
    if (k === '/') { e.preventDefault(); A.buscar(); return; }
    if (k === '?') { e.preventDefault(); ayuda(); return; }
    const L = document.querySelector('#view [data-kb]'); if (!L) return;
    const rows = filas(L); if (!rows.length) return;
    let i = rows.findIndex(r => r.dataset.kbr === E.ui.kb[L.dataset.kb]);
    if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); i = i < 0 ? 0 : Math.max(0, Math.min(rows.length - 1, i + (k === 'ArrowDown' ? 1 : -1))); marcaFila(L, rows[i]); return; }
    // sin alumno elegido: 1/2/3 empiezan en el primero; las letras esperan a que elijas con ↑ ↓
    if (i < 0) { if (/^[123]$/.test(k)) { i = 0; marcaFila(L, rows[0]); } else { const fn0 = R.KB[L.dataset.kb]; if (fn0 && fn0(k, null, L)) e.preventDefault(); return; } }
    const row = rows[i];
    if (/^[123]$/.test(k)) { const b = row.querySelector('[data-k="' + k + '"]'); if (b) { e.preventDefault(); b.click(); avanza(L, rows, i); } return; }
    if (k === 't' || k === 'T') { const b = row.querySelector('[data-k="t"]'); if (b) { e.preventDefault(); b.click(); return; } }   // ⏰ entregada tarde (no avanza)
    const fn = R.KB[L.dataset.kb]; if (!fn) return;
    const r = fn(k, row, L); if (r) { e.preventDefault(); if (r === 'next') avanza(L, rows, i); }
  });
  // libreta: ← → cambia de alumno
  R.KB.lb = (k, row, L) => { if (k === 'ArrowRight' && L.dataset.sig) { location.hash = '#/' + L.dataset.sig; return true; } if (k === 'ArrowLeft' && L.dataset.ant) { location.hash = '#/' + L.dataset.ant; return true; } return false; };

  /* =================== antes y después de cada pantalla =================== */
  R.antes = nueva => { if (nueva) { E.ui.flt = {}; E.ui.kb = {}; } };
  R.despues = () => {
    const view = document.getElementById('view'); if (!view) return;
    view.querySelectorAll('input[data-in="filtro"]').forEach(R.aplicaFiltro);
    const L = view.querySelector('[data-kb]');
    if (L) { const id = E.ui.kb[L.dataset.kb]; if (id) { const r = [...L.querySelectorAll('[data-kbr]')].find(x => x.dataset.kbr === id); if (r) r.classList.add('kbsel'); } }
    if (R.selId) { const el = document.getElementById(R.selId); if (el && document.activeElement === el) { try { el.select(); } catch (e) { } } }
  };

  /* =================== barra de abajo y ajustes de captura rápida =================== */
  R.NAV = { inicio: ['Inicio', 'home', 'Inicio'], aula: ['Clase', 'grid', 'Modo clase'], lista: ['Lista', 'check', 'Pase de lista'], cierre: ['Cierre', 'note', 'Cierre del día'], pendientes: ['Pendientes', 'inbox', 'Pendientes de captura'], clases: ['Clases', 'board', 'Clases (guion)'], calificaciones: ['Califs', 'grade', 'Calificaciones'], libreta: ['Libreta', 'book', 'Tareas y libreta'], freecad: ['FreeCAD', 'cube', 'FreeCAD'], examen: ['Examen', 'doc', 'Examen recomendado'], semaforo: ['Semáforo', 'grade', 'Semáforo'], alumnos: ['Alumnos', 'users', 'Alumnos'], herramientas: ['Herram.', 'tool', 'Herramientas'], proyecto: ['Proyecto', 'team', 'Proyecto por equipo'], tutoria: ['Tutoría', 'team', 'Tutoría'], temas: ['Temas', 'screen', 'Temas'], bitacora: ['Bitácora', 'book', 'Bitácora'] };
  R.NAV_DEF = ['inicio', 'clases', 'lista', 'calificaciones'];
  R.navKeys = () => { const n = D.cfg().nav; return Array.isArray(n) && n.length === 4 && n.every(k => R.NAV[k]) ? n : R.NAV_DEF; };
  CH['nav-slot'] = el => {
    const i = Number(el.dataset.i), v = el.value; if (!R.NAV[v]) return;
    S.update('config', c => { const n = R.navKeys().slice(), j = n.indexOf(v); if (j >= 0 && j !== i) n[j] = n[i]; n[i] = v; c.nav = n; }, {});
  };
  R.ajustesHTML = c => {
    const tog = (path, label, val) => '<label class="switch"><input type="checkbox" data-ch="cfg" data-path="' + path + '" ' + (val ? 'checked' : '') + '><span>' + label + '</span></label>';
    const nk = R.navKeys();
    return '<div class="aj-rap">' + tog('abrirDonde', 'Al abrir Escuadra desde su ícono, ir a lo que toca: pase de lista durante tu clase (o el guion si ya pasaste lista) y el cierre del día cuando terminas', c.abrirDonde !== false) +
      tog('autoSalto', 'Al capturar calificaciones, pasar solo al siguiente alumno (85 salta; 10 espera por si es 100)', c.autoSalto !== false) +
      '<h4>Barra de abajo (celular)</h4><div class="fgrid c4">' + nk.map((k, i) => '<label class="fld"><span>Botón ' + (i + 1) + '</span><select data-ch="nav-slot" data-i="' + i + '">' + Object.keys(R.NAV).map(x => '<option value="' + x + '"' + (x === k ? ' selected' : '') + '>' + esc(R.NAV[x][2]) + '</option>').join('') + '</select></label>').join('') + '</div><p class="muted small">«Más» siempre queda al final.</p>' +
      '<h4>Rúbricas de un toque</h4><p class="small">Plantillas para cartel, plano, exposición, prototipo, bitácora y reporte (Excelente 100 · Bien 85 · Suficiente 70 · Insuficiente 50).</p>' + btn('🧾 Editar plantillas', 'rub-edit', '', 'small') +
      '<h4>Mapa del salón</h4><p class="small">Dónde se sienta cada quien: Modo clase acomoda los nombres como en el salón.</p><div class="row gap wrap">' + link('🏫 Aula', 'mapa/aula', 'small') + link('💻 Centro de cómputo', 'mapa/computo', 'small') + link('🛠️ Taller', 'mapa/taller', 'small') + '</div>' +
      '<h4>Íconos de acceso directo</h4><p class="small">Mantén presionado el ícono de Escuadra en tu celular: <b>Pasar lista</b>, <b>Modo clase</b> y <b>Cierre del día</b>. Chrome los actualiza solo, pero puede tardar uno o dos días; si no salen, descarga un respaldo, desinstala la app y vuelve a instalarla desde Chrome.</p>' +
      '<h4>Teclado (compu)</h4>' + btn('⌨️ Ver atajos', 'kb-ayuda', '', 'small') + '</div>';
  };
})();

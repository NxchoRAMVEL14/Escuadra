/* Escuadra · En el salón (v1.15): Modo clase con nombres grandes (toca = participación, mantén = observación; con
   «Asistencia» cada toque cambia falta → retardo → justificada → asistió), mapa del aula y del centro de cómputo,
   pase de lista con mantener presionado, justificar faltas por fechas y abrir la app en lo que toca según tu horario. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, LP = E.lp;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const AU = E.aula = {};
  const ORDEN = ['A', 'F', 'R', 'J'];
  const ST = { A: ['✓', 'Asistió'], F: ['✗', 'Falta'], R: ['⏰', 'Retardo'], J: ['📄', 'Justificada'] };
  const LUG = { aula: ['Aula', '🏫'], computo: ['Centro de cómputo', '💻'], taller: ['Taller', '🛠️'] };
  const KM = g => 'mapa:' + g.id;
  const ahora = () => { const d = new Date(); return u.pad(d.getHours()) + ':' + u.pad(d.getMinutes()); };
  const menos = (hm, min) => { const p = String(hm).split(':').map(Number); const t = Math.max(0, p[0] * 60 + p[1] - min); return u.pad(Math.floor(t / 60)) + ':' + u.pad(t % 60); };
  const presente = st => ['A', 'R'].indexOf(st || 'A') >= 0;
  E.ui.aula = Object.assign({ modo: 'part', vista: 'mapa', lugar: null, girar: false }, E.ui.aula || {});
  try { E.ui.aula.girar = localStorage.getItem('escuadra.girar') === '1'; } catch (e) { }

  /* =================== asistencia =================== */
  AU.setAsis = (g, f, aid, st) => S.update('asis:' + g.id + ':' + f, doc => { if (!Object.keys(doc).length) D.alumnos(g).forEach(a => { doc[a.id] = 'A'; }); doc[aid] = st; }, {});
  AU.ciclo = (g, f, aid) => { const d = S.get('asis:' + g.id + ':' + f) || {}; AU.setAsis(g, f, aid, ORDEN[(ORDEN.indexOf(d[aid] || 'A') + 1) % ORDEN.length]); };
  // pase de lista: mantener presionado la letra → elegir asistió, falta, retardo o justificada
  LP['asis-menu'] = el => {
    const g = D.grupoActual(), a = g && D.alumno(g, el.dataset.aid); if (!a) return;
    const f = el.dataset.fecha, cur = ((S.get('asis:' + g.id + ':' + f) || {})[a.id]) || 'A';
    E.modal.open(u.corto(a.nombre) + ' · ' + u.fCorta(f), '<div class="as-menu">' + ORDEN.map(s => '<button type="button" class="as-op st-' + s + (s === cur ? ' on' : '') + '" data-act="asis-set" data-aid="' + a.id + '" data-fecha="' + f + '" data-st="' + s + '"><b>' + s + '</b><span>' + ST[s][1] + '</span></button>').join('') + '</div>' +
      '<p class="muted small mt">¿Trajo justificante de varios días? ' + btn('📄 Justificar por fechas', 'jus-open', 'data-aid="' + a.id + '"', 'small ghost') + '</p>');
  };
  A['asis-set'] = el => { const g = D.grupoActual(); AU.setAsis(g, el.dataset.fecha, el.dataset.aid, el.dataset.st); E.modal.close(); if (navigator.vibrate) navigator.vibrate(12); };
  // teclado en el pase de lista: A F R J, + −, O
  E.rap.KB.lista = (k, row, L) => {
    if (!row) return false; const g = D.grupoActual(), f = L.dataset.f, aid = row.dataset.kbr, x = String(k).toLowerCase();
    if (['a', 'f', 'r', 'j'].indexOf(x) >= 0) { E.undo.run('asis-set', () => AU.setAsis(g, f, aid, x.toUpperCase())); return 'next'; }
    if (k === '+' || k === '=' || k === '-') { const d = k === '-' ? -1 : 1; E.undo.run('part', () => S.update('part:' + g.id + ':' + f, p => { p[aid] = Math.max(0, Number(p[aid] || 0) + d); }, {})); return true; }
    if (x === 'o') { A['obs-open']({ dataset: { aid: aid, fecha: f } }); return true; }
    return false;
  };

  /* =================== justificar faltas por fechas (desde la ficha) =================== */
  const faltasEn = (g, aid, de, a) => { const pre = 'asis:' + g.id + ':'; return S.keys(pre).map(k => k.slice(pre.length)).filter(f => f >= de && f <= a && (S.get(pre + f) || {})[aid] === 'F').sort(); };
  function jusHTML() {
    const st = E.ui.jus, g = D.grupoActual(), a = D.alumno(g, st.aid); if (!a) return '';
    const fs = faltasEn(g, st.aid, st.de, st.a), n = fs.filter(f => !st.no[f]).length;
    return '<p><b>' + esc(a.nombre) + '</b></p><div class="fgrid"><label class="fld"><span>Desde</span><input type="date" value="' + st.de + '" data-ch="jus-f" data-k="de"></label><label class="fld"><span>Hasta</span><input type="date" value="' + st.a + '" data-ch="jus-f" data-k="a"></label></div>' +
      (fs.length ? '<p class="small">Faltas registradas en esas fechas (desmarca las que no cubre el justificante):</p><div class="jus-l">' + fs.map(f => '<label class="ck"><input type="checkbox" data-ch="jus-x" data-f="' + f + '"' + (st.no[f] ? '' : ' checked') + '><span>' + u.cap(u.fLarga(f)) + '</span></label>').join('') + '</div>' +
        '<div class="row gap wrap mt">' + btn('📄 Justificar ' + n + (n === 1 ? ' falta' : ' faltas'), 'jus-ok', n ? '' : 'disabled', 'primary') + '</div>' : '<p class="note">No tiene faltas registradas entre esas fechas.</p>') +
      '<p class="muted small mt">Quedan como «J». ' + (D.cfg().justCuenta ? 'Según tus Ajustes, la justificada cuenta como asistencia.' : 'Según tus Ajustes, la justificada no cuenta como asistencia.') + ' Solo se guarda la fecha, nunca el motivo.</p>';
  }
  A['jus-open'] = el => {
    const g = D.grupoActual(), a = g && D.alumno(g, el.dataset.aid); if (!a) return;
    const p = C.parcialActual(), hoy = u.today(), ini = C.inicioEfectivo(g, p);
    E.ui.jus = { aid: a.id, de: ini < hoy ? ini : u.addDays(hoy, -7), a: hoy, no: {} };
    E.modal.open('📄 Justificar faltas', jusHTML());
  };
  CH['jus-f'] = el => { if (!el.value) return; E.ui.jus[el.dataset.k] = el.value; E.modal.body(jusHTML()); };
  CH['jus-x'] = el => { const st = E.ui.jus; if (el.checked) delete st.no[el.dataset.f]; else st.no[el.dataset.f] = 1; E.modal.body(jusHTML()); };
  A['jus-ok'] = () => {
    const st = E.ui.jus, g = D.grupoActual(), fs = faltasEn(g, st.aid, st.de, st.a).filter(f => !st.no[f]); if (!fs.length) return;
    fs.forEach(f => S.update('asis:' + g.id + ':' + f, d => { if (d[st.aid] === 'F') d[st.aid] = 'J'; }, {}));
    E.modal.close(); u.toast(fs.length + (fs.length === 1 ? ' falta justificada' : ' faltas justificadas'), 'ok');
  };

  /* =================== ¿dónde abro la app? =================== */
  // Solo al abrirla desde el ícono (app instalada) y en Inicio; nunca al recargar ni al navegar.
  AU.lanzamiento = () => {
    try {
      if (new URLSearchParams(location.search).get('desde') === 'icono') return true;
      const mm = q => window.matchMedia && window.matchMedia(q).matches;
      if (!(mm('(display-mode: standalone)') || mm('(display-mode: fullscreen)') || mm('(display-mode: minimal-ui)'))) return false;
      const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0]; if (nav && nav.type && nav.type !== 'navigate') return false;
      return !location.hash || location.hash === '#/inicio' || location.hash === '#/' || location.hash === '#';
    } catch (e) { return false; }
  };
  AU.donde = (g, hoy, hm) => {
    if (!g || !D.alumnos(g).length) return null; hoy = hoy || u.today(); hm = hm || ahora();
    if (!C.esClase(g, hoy)) return null;
    let bs = []; try { const d = E.clases.dia(g, hoy); bs = d ? d.bloques.filter(b => !b.perdida) : []; } catch (e) { bs = C.bloquesDia(g, hoy); }
    if (!bs.length) return null;
    const ini = bs.map(b => b.inicio).sort()[0], fin = bs.map(b => b.fin).sort().slice(-1)[0];
    if (hm >= menos(ini, 15) && hm < fin) return S.get('asis:' + g.id + ':' + hoy) ? 'clase/' + hoy : 'lista/' + hoy;
    if (hm >= fin && E.cierre && E.cierre.pendientes(g, hoy).indexOf(hoy) >= 0) return 'cierre/' + hoy;
    return null;
  };
  AU.alArrancar = () => {
    try {
      if (D.cfg().abrirDonde === false || !AU.lanzamiento()) return null;
      const r = AU.donde(D.grupoActual()); if (!r) return null;
      history.replaceState(null, '', location.pathname + '#/' + r);
      const m = /^lista/.test(r) ? 'Estás en clase: te abrí el pase de lista' : /^clase/.test(r) ? 'Estás en clase: te abrí el guion de hoy' : 'Ya terminaron tus clases: te abrí el cierre del día';
      setTimeout(() => u.toast(m + ' (puedes apagarlo en Ajustes)', 'ok', 4200), 700);
      return r;
    } catch (e) { return null; }
  };

  /* =================== Modo clase =================== */
  const lugarDe = (g, f) => {
    let bs = []; try { const d = E.clases.dia(g, f); bs = d ? d.bloques.filter(b => !b.perdida) : []; } catch (e) { }
    if (!bs.length) bs = C.bloquesDia(g, f); if (!bs.length) return 'aula';
    if (f === u.today()) { const hm = ahora(), b = bs.find(x => hm >= menos(x.inicio, 10) && hm < x.fin) || bs.find(x => hm < x.inicio) || bs[bs.length - 1]; return b.lugar || 'aula'; }
    return bs[0].lugar || 'aula';
  };
  AU.lugarDe = lugarDe;
  const orden = m => { const o = []; for (let r = 0; r < m.f; r++) for (let c = 0; c < m.c; c++) o.push(r + '-' + c); return o; };
  const frente = l => '<div class="au-front">' + (l === 'computo' ? '🖥 Frente del centro de cómputo' : l === 'taller' ? '🧑‍🏫 Frente del taller' : '🧑‍🏫 Frente · pizarrón') + '</div>';
  V.aula = fecha => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Modo clase');
    const hoy = u.today(), f = fecha || (C.esClase(g, hoy) ? hoy : C.fechaListaDefault(g, hoy)), ui = E.ui.aula;
    if (ui.f !== f) { ui.f = f; ui.lugar = null; }
    const asis = S.get('asis:' + g.id + ':' + f), part = S.get('part:' + g.id + ':' + f) || {}, mp = S.get(KM(g)) || {}, ids = {}; al.forEach(a => { ids[a.id] = a; });
    const lug = ui.lugar || lugarDe(g, f), m = mp[lug], sentados = m && m.s ? Object.keys(m.s).filter(k => ids[m.s[k]]) : [], usaMapa = sentados.length > 0 && ui.vista !== 'lista';
    const cnt = { A: 0, F: 0, R: 0, J: 0 }; al.forEach(a => { cnt[(asis && asis[a.id]) || 'A']++; });
    const nPart = al.reduce((s, a) => s + Number(part[a.id] || 0), 0), prev = C.claseAnterior(g, f), next = C.siguienteClase(g, f);
    const tile = a => {
      const st = (asis && asis[a.id]) || 'A', n = Number(part[a.id] || 0), x = u.partesNombre(a.nombre), ob = E.obsIcons ? E.obsIcons(g, f, a.id) : '', pop = ui.last === a.id && Date.now() - (ui.lastT || 0) < 900;
      return '<button type="button" class="au-t s-' + st + (pop ? ' pop' : '') + '" data-act="au-tap" data-lp="au-obs" data-aid="' + a.id + '" data-fecha="' + f + '" aria-label="' + esc(a.nombre) + (n ? ', ' + n + ' participaciones' : '') + (st !== 'A' ? ', ' + ST[st][1] : '') + '">' +
        '<span class="au-num">' + a.num + '</span>' + (n ? '<span class="au-p">' + n + '</span>' : '') + '<b>' + esc(x.nom.split(' ')[0]) + '</b><small>' + esc(x.ap1) + '</small>' +
        (st !== 'A' ? '<span class="au-st">' + ST[st][0] + ' ' + ST[st][1] + '</span>' : '') + (ob ? '<span class="au-o">' + ob + '</span>' : '') + '</button>';
    };
    const seg = (act, v, cur, lbl) => '<button type="button" class="' + (v === cur ? 'on' : '') + '" data-act="' + act + '" data-v="' + v + '" aria-pressed="' + (v === cur) + '">' + lbl + '</button>';
    let h = '<div class="datebar"><button type="button" class="iconbtn" data-act="go" data-to="aula/' + (prev || f) + '" ' + (prev ? '' : 'disabled') + ' aria-label="Clase anterior">' + icon('chevL') + '</button>' +
      '<div class="datebox"><b>' + u.cap(u.fLarga(f)) + '</b><span class="small muted">' + LUG[lug][1] + ' ' + LUG[lug][0] + '</span></div>' +
      '<button type="button" class="iconbtn" data-act="go" data-to="aula/' + (next || f) + '" ' + (next ? '' : 'disabled') + ' aria-label="Clase siguiente">' + icon('chevR') + '</button></div>';
    h += '<div class="au-ctl"><div class="seg" role="group" aria-label="Qué hace un toque">' + seg('au-modo', 'part', ui.modo, '⭐ Participación') + seg('au-modo', 'asis', ui.modo, '✓ Asistencia') + '</div>' +
      '<div class="seg" role="group" aria-label="Acomodo">' + seg('au-vista', 'mapa', usaMapa ? 'mapa' : 'lista', '🗺 Mapa') + seg('au-vista', 'lista', usaMapa ? 'mapa' : 'lista', '≡ Lista') + '</div>' +
      '<select data-ch="au-lugar" aria-label="Mapa de">' + Object.keys(LUG).map(k => '<option value="' + k + '"' + (k === lug ? ' selected' : '') + '>' + LUG[k][1] + ' ' + LUG[k][0] + '</option>').join('') + '</select></div>';
    h += '<p class="small au-res">' + (asis ? '<b>' + (cnt.A + cnt.R) + '</b> presentes · <b>' + (cnt.F + cnt.J) + '</b> ' + (cnt.F + cnt.J === 1 ? 'falta' : 'faltas') : '<b>Lista sin pasar</b> (todos cuentan como presentes)') + ' · <b>' + nPart + '</b> ' + (nPart === 1 ? 'participación' : 'participaciones') + '<br>' +
      (ui.modo === 'asis' ? '<span class="chip warn">Asistencia: cada toque cambia falta → retardo → justificada → asistió</span>' : '<span class="muted">Toca = +1 participación · mantén presionado = observación (⭐ 👎 y más) · ↶ Deshacer si te equivocas</span>') + '</p>';
    if (usaMapa) {
      const vis = ui.girar ? orden(m).reverse() : orden(m);
      h += '<div class="au-wrap">' + (ui.girar ? '' : frente(lug)) + '<div class="au-grid mapa" style="--cols:' + m.c + '">' + vis.map(k => m.s[k] && ids[m.s[k]] ? tile(ids[m.s[k]]) : '<span class="au-vacio" aria-hidden="true"></span>').join('') + '</div>' + (ui.girar ? frente(lug) : '') + '</div>';
      const sin = al.filter(a => sentados.every(k => m.s[k] !== a.id));
      if (sin.length) h += '<h4 class="mt">Sin lugar en el mapa</h4><div class="au-grid">' + sin.map(tile).join('') + '</div>';
    } else h += '<div class="au-grid">' + al.map(tile).join('') + '</div>';
    h += '<div class="row gap wrap mt">' + (asis ? '' : btn('✓ Todos presentes', 'asis-todos', 'data-fecha="' + f + '"', 'primary')) + btn(icon('dice') + ' Al azar', 'azar', 'data-fecha="' + f + '"') +
      (usaMapa ? btn('🔄 ' + (ui.girar ? 'Ver como plano' : 'Ver desde el frente'), 'au-girar', '', 'ghost') : '') + link('✏️ ' + (m && sentados.length ? 'Editar mapa' : 'Hacer el mapa del salón'), 'mapa/' + lug, 'ghost') +
      link(icon('check') + ' Pase de lista', 'lista/' + f, '') + (E.cierre ? link('📝 Cierre del día', 'cierre/' + f, '') : '') + '</div>';
    return { t: 'Modo clase', h: h };
  };
  A['au-tap'] = el => {
    const g = D.grupoActual(), f = el.dataset.fecha, aid = el.dataset.aid, ui = E.ui.aula;
    if (ui.modo === 'asis') AU.ciclo(g, f, aid);
    else {
      const asis = S.get('asis:' + g.id + ':' + f); if (asis && !presente(asis[aid])) { u.toast('Tiene falta: si ya llegó, cámbialo con «✓ Asistencia»', 'err', 2600); return; }
      S.update('part:' + g.id + ':' + f, d => { d[aid] = Number(d[aid] || 0) + 1; }, {});
    }
    ui.last = aid; ui.lastT = Date.now(); if (navigator.vibrate) navigator.vibrate(10);
  };
  LP['au-obs'] = el => A['obs-open'](el);
  A['au-modo'] = el => { E.ui.aula.modo = el.dataset.v === 'asis' ? 'asis' : 'part'; E.render(); };
  A['au-vista'] = el => {
    const ui = E.ui.aula, g = D.grupoActual(); ui.vista = el.dataset.v === 'lista' ? 'lista' : 'mapa';
    if (ui.vista === 'mapa' && g) { const mp = S.get(KM(g)) || {}, lug = ui.lugar || lugarDe(g, ui.f || u.today()); if (!(mp[lug] && Object.keys(mp[lug].s || {}).length)) { u.toast('Primero acomoda a tus alumnos en el mapa', 'ok', 3000); location.hash = '#/mapa/' + lug; return; } }
    E.render();
  };
  CH['au-lugar'] = el => { E.ui.aula.lugar = LUG[el.value] ? el.value : null; E.render(); };
  A['au-girar'] = () => { const ui = E.ui.aula; ui.girar = !ui.girar; try { localStorage.setItem('escuadra.girar', ui.girar ? '1' : '0'); } catch (e) { } E.render(); };

  /* =================== mapa del salón =================== */
  const DEF = l => ({ f: l === 'computo' ? 4 : 5, c: 6, s: {} });
  const vacios = m => orden(m).filter(k => !m.s[k]);
  const pos = k => { const p = k.split('-').map(Number); return p[0] * 100 + p[1]; };
  V.mapa = lugar => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Mapa del salón');
    lugar = LUG[lugar] ? lugar : 'aula';
    const doc = S.get(KM(g)) || {}, m = Object.assign(DEF(lugar), doc[lugar] || {}), s = m.s || {}, ids = {}; al.forEach(a => { ids[a.id] = a; });
    const ui = E.ui.mapa = E.ui.mapa || {}; if (ui.l !== lugar) { ui.l = lugar; ui.sel = null; }
    const sentado = {}; Object.keys(s).forEach(k => { if (ids[s[k]]) sentado[s[k]] = k; });
    const sin = al.filter(a => !sentado[a.id]), girar = E.ui.aula.girar, vis = girar ? orden(m).reverse() : orden(m), selA = ui.sel && ids[s[ui.sel]];
    const seat = k => { const a = ids[s[k]], p = a && u.partesNombre(a.nombre), rc = k.split('-').map(Number);
      return '<button type="button" class="mp-s' + (a ? ' on' : '') + (ui.sel === k ? ' sel' : '') + '" data-act="mp-seat" data-l="' + lugar + '" data-k="' + k + '" aria-label="Fila ' + (rc[0] + 1) + ', lugar ' + (rc[1] + 1) + (a ? ': ' + esc(a.nombre) : ', vacío') + '">' +
        (a ? '<span class="num">' + a.num + '</span><b>' + esc(p.nom.split(' ')[0]) + '</b><small>' + esc(p.ap1) + '</small>' : '<small>' + (rc[0] + 1) + '·' + (rc[1] + 1) + '</small>') + '</button>'; };
    let h = '<div class="filters">' + Object.keys(LUG).map(k => '<a class="tab ' + (k === lugar ? 'on' : '') + '" href="#/mapa/' + k + '">' + LUG[k][1] + ' ' + LUG[k][0] + '</a>').join('') + '</div>';
    h += card('<h3>🗺 Mapa: ' + LUG[lugar][0].toLowerCase() + '</h3><p class="muted small">Toca un lugar y luego al alumno de abajo (pasa solo al siguiente lugar vacío). Para cambiar a dos de lugar, toca uno y luego el otro. Modo clase acomoda los nombres así.</p>' +
      '<div class="row gap wrap"><label class="fld"><span>Filas</span><input type="number" min="1" max="12" inputmode="numeric" value="' + m.f + '" data-ch="mp-dim" data-l="' + lugar + '" data-d="f" style="max-width:90px"></label><label class="fld"><span>Lugares por fila</span><input type="number" min="1" max="12" inputmode="numeric" value="' + m.c + '" data-ch="mp-dim" data-l="' + lugar + '" data-d="c" style="max-width:90px"></label></div>' +
      '<div class="au-wrap">' + (girar ? '' : frente(lugar)) + '<div class="mp-grid" style="--cols:' + m.c + '">' + vis.map(seat).join('') + '</div>' + (girar ? frente(lugar) : '') + '</div>' +
      (selA ? '<p class="small mt">Elegiste a <b>' + esc(u.corto(selA.nombre)) + '</b>: toca otro lugar para cambiarlo, o ' + btn('quítalo de aquí', 'mp-quitar', 'data-l="' + lugar + '"', 'small ghost danger') + '</p>' : ui.sel ? '<p class="small mt note info">Lugar vacío elegido: ahora toca a un alumno de abajo.</p>' : '') +
      '<h4 class="mt">Sin lugar (' + sin.length + ')</h4>' + (sin.length ? '<div class="mp-sin">' + sin.map(a => '<button type="button" class="mp-al" data-act="mp-al" data-l="' + lugar + '" data-aid="' + a.id + '"><span class="num">' + a.num + '</span>' + esc(u.corto(a.nombre)) + '</button>').join('') + '</div>' : '<p class="small muted">Todos tienen lugar. 👍</p>') +
      '<div class="row gap wrap mt">' + (sin.length ? btn('Llenar en orden de lista', 'mp-llenar', 'data-l="' + lugar + '"', 'small') : '') +
      Object.keys(LUG).filter(k => k !== lugar && doc[k] && Object.keys(doc[k].s || {}).length).map(k => btn('Copiar el de ' + LUG[k][0].toLowerCase(), 'mp-copiar', 'data-l="' + lugar + '" data-de="' + k + '"', 'small ghost')).join('') +
      (Object.keys(s).length ? btn('Vaciar', 'mp-vaciar', 'data-l="' + lugar + '"', 'small ghost danger') : '') + btn('🔄 ' + (girar ? 'Ver como plano' : 'Ver desde el frente'), 'au-girar', '', 'small ghost') + link('🎓 Modo clase', 'aula', 'small primary') + '</div>');
    return { t: 'Mapa del salón', h: h };
  };
  const upM = (l, fn) => { const g = D.grupoActual(); S.update(KM(g), d => { const m = d[l] = Object.assign(DEF(l), d[l] || {}); m.s = m.s || {}; fn(m, d); }, {}); };
  CH['mp-dim'] = el => {
    const v = Math.max(1, Math.min(12, Math.round(Number(el.value) || 1))), l = el.dataset.l; let fuera = 0;
    upM(l, m => { m[el.dataset.d === 'c' ? 'c' : 'f'] = v; Object.keys(m.s).forEach(k => { const p = k.split('-').map(Number); if (p[0] >= m.f || p[1] >= m.c) { delete m.s[k]; fuera++; } }); });
    if (fuera) u.toast(fuera + (fuera === 1 ? ' alumno quedó' : ' alumnos quedaron') + ' sin lugar', 'ok', 2500);
  };
  A['mp-seat'] = el => {
    const ui = E.ui.mapa, k = el.dataset.k, l = el.dataset.l, g = D.grupoActual(), m = ((S.get(KM(g)) || {})[l]) || DEF(l), s = m.s || {};
    if (!ui.sel || ui.sel === k) { ui.sel = ui.sel === k ? null : k; E.render(); return; }
    const a = ui.sel; if (!s[a] && !s[k]) { ui.sel = k; E.render(); return; }
    ui.sel = null; upM(l, mm => { const x = mm.s[a], y = mm.s[k]; if (y) mm.s[a] = y; else delete mm.s[a]; if (x) mm.s[k] = x; else delete mm.s[k]; });
  };
  A['mp-al'] = el => {
    const g = D.grupoActual(), l = el.dataset.l, aid = el.dataset.aid, ui = E.ui.mapa, m0 = Object.assign(DEF(l), ((S.get(KM(g)) || {})[l]) || {});
    m0.s = m0.s || {}; const k = ui.sel || vacios(m0)[0]; if (!k) { u.toast('Ya no hay lugares vacíos: agrega filas o lugares por fila', 'err'); return; }
    upM(l, m => { Object.keys(m.s).forEach(x => { if (m.s[x] === aid) delete m.s[x]; }); m.s[k] = aid; const v = vacios(m); ui.sel = v.find(x => pos(x) > pos(k)) || v[0] || null; });
  };
  A['mp-quitar'] = el => { const ui = E.ui.mapa, k = ui.sel; if (!k) return; ui.sel = null; upM(el.dataset.l, m => { delete m.s[k]; }); };
  A['mp-llenar'] = el => {
    const g = D.grupoActual(), al = D.alumnos(g); let falta = 0; E.ui.mapa.sel = null;
    upM(el.dataset.l, m => { const ya = {}; Object.keys(m.s).forEach(k => { ya[m.s[k]] = 1; }); const v = vacios(m); al.filter(a => !ya[a.id]).forEach((a, i) => { if (v[i]) m.s[v[i]] = a.id; else falta++; }); });
    if (falta) u.toast('Faltan ' + falta + ' lugares: agrega filas o lugares por fila', 'err', 3500);
  };
  A['mp-vaciar'] = el => { if (!confirm('¿Quitar a todos de su lugar en este mapa?')) return; E.ui.mapa.sel = null; upM(el.dataset.l, m => { m.s = {}; }); };
  A['mp-copiar'] = el => { const g = D.grupoActual(), src = (S.get(KM(g)) || {})[el.dataset.de]; if (!src) return; E.ui.mapa.sel = null; upM(el.dataset.l, m => { m.f = src.f; m.c = src.c; m.s = u.clone(src.s || {}); }); };
})();

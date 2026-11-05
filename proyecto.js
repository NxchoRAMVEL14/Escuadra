/* Escuadra · Avance del proyecto por equipo (un proyecto por submódulo: en el Módulo II, garra en el 2º parcial y grúa en el 3er parcial).
   Las etapas salen del guion de Clases y su fecha meta es el día que te toca esa clase; cada equipo lleva su semáforo:
   verde al día, amarillo con una etapa atrasada, rojo con dos o más (o una atrasada más de una semana).
   Es seguimiento: no entra a calificación.
   v1.28.2: «✏️ Editar proyecto» cambia el nombre del proyecto, los nombres de las etapas, su orden y su fecha meta, y
   agrega o quita etapas (se guarda en el documento del proyecto, campo def). La fecha que escribas manda; si la dejas
   vacía, se usa la del guion. Cada equipo puede llevar además el nombre de su propio proyecto (campo proy). */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const PJ = E.proyecto = {};
  const KP = (g, pid) => 'proy:' + g.id + ':' + pid;
  // [id, nombre, actividades de Clases que la cierran]
  PJ.ETAPAS = {
    'II-2': { nombre: 'Garra o brazo articulado', et: [['idea', 'Idea y esquema cinemático', ['proyecto']], ['proto', 'Prototipo de cartón', ['prototipo']], ['croquis', 'Croquis acotado', ['croquis']], ['piezas', 'Piezas en FreeCAD', ['fc-piezas']], ['ensfc', 'Ensamble en FreeCAD', ['fc-ensamble']], ['plano', 'Plano y plantillas 1:1', ['fc-plano']], ['corte', 'Piezas cortadas', ['corte']], ['armado', 'Perforado y armado', ['ensamble']], ['pruebas', 'Primeras pruebas', ['pruebas']], ['ajustes', 'Ajustes sin trabas', ['ajustes']], ['final', 'Acabado y ensayo', ['acabado']], ['expo', 'Exposición', ['expo', 'expo2']]] },
    'II-3': { nombre: 'Grúa hidráulica', et: [['diseno', 'Diseño y cálculos', ['diseno-grua']], ['diagrama', 'Diagrama hidráulico', ['diagrama-grua']], ['montaje', 'Montaje hidráulico', ['montaje']], ['motor', 'Hidráulica y motor', ['montaje2']], ['integra', 'Integración con el mecanismo', ['integracion']], ['opera', 'Opera el circuito', ['opera']], ['pruebas', 'Pruebas y corrección', ['pruebas3']], ['plano', 'Plano «como quedó»', ['doc-grua']], ['carga', 'Prueba con carga', ['carga1', 'carga2']], ['feria', 'Feria', ['feria1', 'feria2']]] }
  };
  const ST = { '': ['○', 'Pendiente', ''], proc: ['◐', 'En proceso', 'warn'], ok: ['✓', 'Lista', 'ok'] };
  const SIG = { '': 'proc', proc: 'ok', ok: '' };
  const corto = n => u.corto(n);
  PJ.doc = (g, pid) => S.get(KP(g, pid)) || {};
  // etapas del proyecto: las tuyas (si las editaste) o las del programa
  const base = (g, pid) => { const d = PJ.ETAPAS[E.clases.smKey(g, pid)]; return d ? { nombre: d.nombre, et: d.et.map(e => ({ id: e[0], t: e[1], base: e[2].slice(), f: '' })) } : null; };
  PJ.def = (g, pid) => { const c = PJ.doc(g, pid).def; if (c && Array.isArray(c.et)) return Object.assign({ propio: true }, c); const b = base(g, pid); return b ? Object.assign({ propio: false }, b) : null; };
  if (E.undo && E.undo.NOMBRE) ['pj-eq-nuevo', 'pj-eq-del', 'pj-edit-ok', 'pj-def-nom', 'pj-et-t', 'pj-et-f', 'pj-et-sube', 'pj-et-baja', 'pj-et-del', 'pj-et-add', 'pj-et-guion', 'pj-et-orig', 'pj-proy', 'pj-st', 'pj-nom', 'pj-nota', 'pj-mover', 'pj-armar'].forEach(k => { E.undo.NOMBRE[k] = 'proyecto'; });
  // un proyecto por submódulo: si el submódulo dura dos parciales (de corrido), se lleva en el primero
  PJ.parciales = g => { const vistos = {}; return D.parciales().filter(p => { const k = E.clases.smKey(g, p.id); if (!PJ.ETAPAS[k] || vistos[k]) return false; vistos[k] = true; return true; }); };
  PJ.canon = (g, pid) => { const k = E.clases.smKey(g, pid), p = PJ.parciales(g).find(x => E.clases.smKey(g, x.id) === k); return p ? p.id : pid; };
  // fecha meta de cada etapa: el último día en que termina alguna de sus clases
  PJ.metas = (g, pid) => {
    const def = PJ.def(g, pid); if (!def) return null; const fin = {};
    const ps = E.clases.flujo && E.clases.flujo(g) ? D.parciales().filter(p => E.clases.tiene(g, p.id)) : [C.parcial(pid)];
    try { ps.forEach(pp => E.clases.plan(g, pp.id).bloques.forEach(b => { if (b.perdida) return; b.parts.forEach(pt => { if (!pt.sigue) fin[pt.it.id] = b.fecha; }); })); } catch (e) { }
    return def.et.map(e => { const fg = (e.base || []).map(i => fin[i]).filter(Boolean).sort().slice(-1)[0] || null; return { id: e.id, t: e.t, f: e.f || fg, fg: fg, man: !!e.f }; });
  };
  PJ.estado = (g, pid, eq, hoy) => {
    hoy = hoy || u.today(); const ms = PJ.metas(g, pid) || [], st = ((PJ.doc(g, pid).etapas || {})[eq.id]) || {};
    const atr = ms.filter(m => m.f && m.f < hoy && (st[m.id] || {}).st !== 'ok').map(m => ({ m: m, dias: u.diffDays(m.f, hoy) }));
    const listas = ms.filter(m => (st[m.id] || {}).st === 'ok').length, maxd = atr.reduce((a, x) => Math.max(a, x.dias), 0);
    const nv = atr.length >= 2 || maxd > 7 ? 'bad' : atr.length === 1 ? 'warn' : 'ok';
    const sig = ms.find(m => (st[m.id] || {}).st !== 'ok' && !(m.f && m.f < hoy));
    return { nv: nv, atr: atr, listas: listas, total: ms.length, sig: sig, st: st };
  };
  const NV = { ok: ['🟢', 'Al día'], warn: ['🟡', 'Una etapa atrasada'], bad: ['🔴', 'Atrasado'] };

  /* ---------- vista ---------- */
  V.proyecto = pid => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Proyecto');
    const ps = PJ.parciales(g); if (!ps.length) return { t: 'Proyecto', h: card('<p>Configura los submódulos del grupo en Ajustes → Grupo.</p>') };
    const act = C.parcialActual(); pid = ps.some(p => p.id === pid) ? pid : (ps.find(p => p.id === PJ.canon(g, act.id)) || ps[0]).id;
    const p = C.parcial(pid), def = PJ.def(g, pid), doc = PJ.doc(g, pid), eqs = doc.equipos || [], ms = PJ.metas(g, pid), hoy = u.today();
    let h = '<div class="filters">' + ps.map(x => '<a class="tab ' + (x.id === pid ? 'on' : '') + '" href="#/proyecto/' + x.id + '">' + esc(x.nombre) + ' · ' + esc((PJ.def(g, x.id) || {}).nombre || '') + '</a>').join('') + '</div>';
    if (!eqs.length || E.ui.pjEdit === pid) return { t: 'Proyecto', h: h + editor(g, pid, al, eqs) };
    if (E.ui.pjEt === pid) return { t: 'Proyecto', h: h + editorEt(g, pid, def, eqs, ms) };
    const est = eqs.filter(eq => eq.al.length).map(eq => ({ eq: eq, r: PJ.estado(g, pid, eq, hoy) })), cnt = { ok: 0, warn: 0, bad: 0 }; est.forEach(x => cnt[x.r.nv]++);
    h += card('<div class="row between gap wrap"><h3>🧩 ' + esc(def.nombre) + ' · ' + esc(p.nombre) + '</h3>' + '<span class="row gap">' + btn('✏️ Editar proyecto', 'pj-et-edit', 'data-pid="' + pid + '"', 'small') + btn('Editar equipos', 'pj-edit', 'data-pid="' + pid + '"', 'small ghost') + '</span></div>' +
      '<p class="muted small">Toca una etapa para cambiarla: ○ pendiente → ◐ en proceso → ✓ lista. La fecha meta es la que pongas en «✏️ Editar proyecto»; si no pones una, es el día que toca esa clase en tu guion (se mueve sola si recorres clases).</p>' +
      '<div class="pj-res"><span class="chip ok">🟢 ' + cnt.ok + ' al día</span><span class="chip warn">🟡 ' + cnt.warn + '</span><span class="chip bad">🔴 ' + cnt.bad + '</span></div>' +
      '<details class="sub" data-sec="pj-metas"><summary>Fechas meta de las etapas</summary><ol class="small">' + ms.map(m => '<li>' + esc(m.t) + ': <b>' + (m.f ? u.fCorta(m.f) : 'sin fecha') + '</b>' + (m.man ? ' <span class="chip small">a mano</span>' : '') + (m.f && m.f < hoy ? ' <span class="muted">(ya pasó)</span>' : '') + '</li>').join('') + '</ol></details>');
    est.sort((a, b) => ({ bad: 0, warn: 1, ok: 2 })[a.r.nv] - ({ bad: 0, warn: 1, ok: 2 })[b.r.nv]).forEach(x => {
      const eq = x.eq, r = x.r, mi = eq.al.map(id => D.alumno(g, id)).filter(Boolean);
      h += card('<div class="row between gap wrap"><h3>' + NV[r.nv][0] + ' ' + esc(eq.nombre) + (eq.proy ? ' · <span class="pj-proy">' + esc(eq.proy) + '</span>' : '') + '</h3><span class="chip ' + r.nv + '">' + r.listas + ' de ' + r.total + ' etapas</span></div>' +
        '<p class="small muted">' + mi.map(a => '<a href="#/alumno/' + a.id + '">' + esc(corto(a.nombre)) + '</a>').join(', ') + '</p>' +
        (r.atr.length ? '<p class="note ' + r.nv + ' small">Atrasado en: ' + r.atr.map(z => esc(z.m.t) + ' (meta ' + u.fCorta(z.m.f) + ', hace ' + z.dias + (z.dias === 1 ? ' día' : ' días') + ')').join('; ') + '.</p>' : r.sig ? '<p class="small">Sigue: <b>' + esc(r.sig.t) + '</b>' + (r.sig.f ? ' · meta ' + u.fCorta(r.sig.f) : '') + '</p>' : '<p class="note ok small">¡Todas las etapas listas! 🎉</p>') +
        '<div class="pj-et">' + ms.map(m => { const s = (r.st[m.id] || {}).st || '', late = m.f && m.f < hoy && s !== 'ok'; return '<button type="button" class="pj-e ' + (ST[s][2] || '') + (late ? ' late' : '') + '" data-act="pj-st" data-pid="' + pid + '" data-eq="' + eq.id + '" data-et="' + m.id + '" title="' + esc(ST[s][1]) + '"><b>' + ST[s][0] + '</b><span>' + esc(m.t) + '</span><small>' + (m.f ? u.fCorta(m.f) : '—') + '</small></button>'; }).join('') + '</div>' +
        '<label class="fld mt"><span>Nota del equipo (qué les falta, acuerdos)</span><input data-ch="pj-nota" data-pid="' + pid + '" data-eq="' + eq.id + '" value="' + esc(eq.nota || '') + '" placeholder="Ej. traen tornillos M3 el lunes"></label>', 'pj-card ' + r.nv);
    });
    h += '<p class="muted small">Sugerencia: revísenlo juntos 5 minutos cada semana; cada equipo dice qué etapa cierra y qué necesita. Ver el avance seguido ayuda a no dejar todo para el final.</p>';
    return { t: 'Proyecto', h: h };
  };
  function editor(g, pid, al, eqs) {
    const k = eqs.length || Math.max(2, Math.round(al.length / 4.5)), de = {}; eqs.forEach((eq, i) => eq.al.forEach(id => { de[id] = i; }));
    const d = 'data-pid="' + pid + '"', sin = al.filter(a => de[a.id] == null);
    // a dónde mover a un alumno: otro equipo, un equipo nuevo (solo él) o sin equipo
    const destinos = (aid, cur) => '<select data-ch="pj-mover" ' + d + ' data-aid="' + aid + '" aria-label="Mover a">' + (cur == null ? '<option value="" selected>Elegir equipo…</option>' : '') + eqs.map((e2, j) => '<option value="' + j + '"' + (j === cur ? ' selected' : '') + '>' + esc(e2.nombre) + '</option>').join('') + '<option value="nuevo">➕ Equipo nuevo (solo)</option>' + (cur != null ? '<option value="sin">— Sin equipo</option>' : '') + '</select>';
    const armar = '<div class="row gap wrap"><label class="fld"><span>Número de equipos</span><input id="pj-k" type="number" min="2" max="10" value="' + k + '" style="max-width:90px"></label>' + btn('⚖️ Equilibrados', 'pj-armar', d + ' data-m="bal"', eqs.length ? '' : 'primary') + btn('🎲 Al azar', 'pj-armar', d + ' data-m="azar"') +
      (PJ.parciales(g).some(p => p.id !== pid && (PJ.doc(g, p.id).equipos || []).length) ? btn('Copiar del otro parcial', 'pj-copiar', d, 'ghost') : '') + '</div>';
    if (!eqs.length) return card('<h3>👥 Equipos del ' + esc(C.parcial(pid).nombre) + '</h3><p class="muted small">Ármalos equilibrados (según Perfiles: un alumno fuerte en cada equipo) o al azar, y luego mueve a quien quieras. Si el proyecto continúa del parcial anterior, puedes conservar los mismos equipos.</p>' + armar);
    return card('<h3>👥 Equipos del ' + esc(C.parcial(pid).nombre) + '</h3><p class="muted small">Para cambiar a alguien de equipo usa «Mover a». Si alguien se separa, elige «➕ Equipo nuevo»: queda en su propio equipo con el avance que ya llevaba con el anterior. Los demás equipos no cambian.</p>' +
      '<div class="pj-ed">' + eqs.map((eq, i) => '<div class="pj-edq"><div class="row between gap"><input data-ch="pj-nom" ' + d + ' data-i="' + i + '" value="' + esc(eq.nombre) + '" aria-label="Nombre del equipo"><span class="chip">' + eq.al.length + '</span>' + btn('🗑', 'pj-eq-del', d + ' data-eq="' + eq.id + '" aria-label="Quitar este equipo"', 'small ghost') + '</div>' +
        '<input class="pj-proyin" data-ch="pj-proy" ' + d + ' data-eq="' + eq.id + '" value="' + esc(eq.proy || '') + '" placeholder="Su proyecto (ej. garra de 3 dedos)" aria-label="Proyecto del equipo">' +
        (eq.al.length ? '<ul>' + eq.al.map(id => { const a = D.alumno(g, id); return a ? '<li>' + esc(corto(a.nombre)) + destinos(id, i) + '</li>' : ''; }).join('') + '</ul>' : '<p class="muted small">Sin integrantes. Al tocar «✓ Listo» se quita.</p>') + '</div>').join('') + '</div>' +
      (sin.length ? '<div class="note warn small mt"><b>Sin equipo (' + sin.length + '):</b><ul class="pj-sin">' + sin.map(a => '<li>' + esc(corto(a.nombre)) + destinos(a.id, null) + '</li>').join('') + '</ul></div>' : '') +
      '<div class="row gap wrap mt">' + btn('➕ Equipo nuevo', 'pj-eq-nuevo', d, 'small') + btn('✓ Listo', 'pj-edit-ok', d, 'primary') + '</div>' +
      '<details class="sub mt"><summary>Volver a armar todos los equipos</summary><p class="muted small">Rehace todos los equipos desde cero. El avance se conserva por número de equipo.</p>' + armar + '</details>');
  }

  /* ---------- editar el proyecto: nombre, etapas, orden y fechas ---------- */
  function editorEt(g, pid, def, eqs, ms) {
    const p = C.parcial(pid), mm = {}; (ms || []).forEach(m => { mm[m.id] = m; });
    const conAvance = id => eqs.filter(eq => (((PJ.doc(g, pid).etapas || {})[eq.id] || {})[id] || {}).st).length;
    const n = def.et.length, d = 'data-pid="' + pid + '"';
    return card('<h3>✏️ Editar el proyecto del ' + esc(p.nombre) + '</h3>' +
      '<label class="fld"><span>Nombre del proyecto (del grupo)</span><input data-ch="pj-def-nom" ' + d + ' value="' + esc(def.nombre) + '" placeholder="Ej. Garra o brazo articulado"></label>' +
      '<h4>Proyecto de cada equipo</h4><p class="muted small">Si cada equipo eligió un proyecto distinto, escríbelo aquí; sale junto al nombre del equipo.</p>' +
      '<div class="pj-proys">' + eqs.map(eq => '<label class="fld"><span>' + esc(eq.nombre) + '</span><input data-ch="pj-proy" ' + d + ' data-eq="' + eq.id + '" value="' + esc(eq.proy || '') + '" placeholder="Ej. garra de 3 dedos"></label>').join('') + '</div>' +
      '<h4>Etapas y fechas meta</h4><p class="muted small">La fecha que pongas manda. Si la dejas vacía, se usa la del guion (el día que toca esa clase). Las etapas son las mismas para todos los equipos.</p>' +
      '<ol class="pj-etl">' + def.et.map((e, i) => { const m = mm[e.id] || {}, av = conAvance(e.id), di = d + ' data-i="' + i + '"';
        return '<li><input class="pj-ett" data-ch="pj-et-t" ' + di + ' value="' + esc(e.t) + '" aria-label="Nombre de la etapa ' + (i + 1) + '">' +
          '<div class="pj-etf"><input type="date" data-ch="pj-et-f" ' + di + ' value="' + esc(e.f || '') + '" aria-label="Fecha meta de la etapa ' + (i + 1) + '"><small class="muted">' + (e.f ? (m.fg ? 'Guion: ' + u.fCorta(m.fg) : 'Sin fecha en el guion') : (m.fg ? 'Del guion: ' + u.fCorta(m.fg) : 'Sin fecha')) + (av ? ' · ' + av + (av === 1 ? ' equipo con avance' : ' equipos con avance') : '') + '</small></div>' +
          '<span class="row gap pj-etb">' + btn('↑', 'pj-et-sube', di + ' aria-label="Subir"' + (i === 0 ? ' disabled' : ''), 'small ghost') + btn('↓', 'pj-et-baja', di + ' aria-label="Bajar"' + (i === n - 1 ? ' disabled' : ''), 'small ghost') + btn('🗑', 'pj-et-del', di + ' aria-label="Quitar etapa"' + (n <= 1 ? ' disabled' : ''), 'small ghost') + '</span></li>'; }).join('') + '</ol>' +
      '<div class="row gap wrap">' + btn('➕ Agregar etapa', 'pj-et-add', d, 'small') + (def.et.some(e => e.f) ? btn('↺ Usar las fechas del guion', 'pj-et-guion', d, 'small ghost') : '') + (def.propio ? btn('↺ Volver a las etapas originales', 'pj-et-orig', d, 'small ghost') : '') + '</div>' +
      '<div class="row gap wrap mt">' + btn('✓ Listo', 'pj-et-ok', d, 'primary') + '</div>');
  }

  /* ---------- Inicio: equipos atrasados ---------- */
  PJ.inicioHTML = (g, hoy) => {
    const p0 = C.parcialActual(hoy); if (!p0 || !PJ.def(g, PJ.canon(g, p0.id))) return ''; const p = C.parcial(PJ.canon(g, p0.id));
    const dp = PJ.doc(g, p.id), eqs = dp.equipos || []; if (!eqs.length || !Object.keys(dp.etapas || {}).some(k => Object.keys(dp.etapas[k] || {}).length)) return ''; // solo si ya llevas el avance
    const mal = eqs.map(eq => ({ eq: eq, r: PJ.estado(g, p.id, eq, hoy) })).filter(x => x.r.nv !== 'ok');
    if (!mal.length) return '';
    return card('<h3>🧩 Proyecto: equipos atrasados</h3><ul class="risk">' + mal.map(x => '<li><span>' + NV[x.r.nv][0] + ' <b>' + esc(x.eq.nombre) + '</b><br><small class="muted">' + x.r.atr.map(z => esc(z.m.t)).join(', ') + '</small></span><span class="chip ' + x.r.nv + '">' + x.r.atr.length + (x.r.atr.length === 1 ? ' etapa' : ' etapas') + '</span></li>').join('') + '</ul>' + link('Ver avance', 'proyecto/' + p.id, 'small primary'));
  };

  /* ---------- acciones ---------- */
  const upd = (pid, fn) => { const g = D.grupoActual(); S.update(KP(g, pid), d => { d.equipos = d.equipos || []; d.etapas = d.etapas || {}; fn(d, g); }, {}); };
  A['pj-armar'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, al = u.shuffle(D.alumnos(g)), k = Math.max(2, Math.min(10, Number((document.getElementById('pj-k') || {}).value) || 4));
    const doc = PJ.doc(g, pid); if ((doc.equipos || []).length && Object.keys(doc.etapas || {}).length && !confirm('Ya hay avance registrado. ¿Rehacer los equipos? (el avance de cada equipo se conserva por número de equipo)')) return;
    let ts; if (el.dataset.m === 'bal' && E.perfil && E.perfil.equiposBal) ts = E.perfil.equiposBal(g, al, k); else { ts = Array.from({ length: k }, () => []); al.forEach((a, i) => ts[i % k].push(a)); }
    upd(pid, d => { d.equipos = ts.map((t, i) => ({ id: (d.equipos[i] || {}).id || u.uid('eq'), nombre: (d.equipos[i] || {}).nombre || 'Equipo ' + (i + 1), al: t.map(a => a.id), nota: (d.equipos[i] || {}).nota || '' })); });
    E.ui.pjEdit = pid; E.render();
  };
  A['pj-copiar'] = el => { const g = D.grupoActual(), pid = el.dataset.pid, otro = PJ.parciales(g).find(p => p.id !== pid && (PJ.doc(g, p.id).equipos || []).length); if (!otro) return; const src = PJ.doc(g, otro.id).equipos; upd(pid, d => { d.equipos = src.map(e => ({ id: u.uid('eq'), nombre: e.nombre, al: e.al.slice(), nota: '' })); }); E.ui.pjEdit = pid; E.render(); };
  A['pj-edit'] = el => { E.ui.pjEdit = el.dataset.pid; E.render(); };
  A['pj-edit-ok'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, doc = PJ.doc(g, pid), vac = (doc.equipos || []).filter(e => !e.al.length);
    if (vac.length) upd(pid, d => { d.equipos = d.equipos.filter(e => e.al.length); vac.forEach(e => { delete d.etapas[e.id]; }); });
    const sin = D.alumnos(g).filter(a => !(PJ.doc(g, pid).equipos || []).some(e => e.al.indexOf(a.id) >= 0));
    if (sin.length) u.toast(sin.length + (sin.length === 1 ? ' alumno quedó' : ' alumnos quedaron') + ' sin equipo: ' + sin.map(a => u.corto(a.nombre)).join(', '), 'err', 4500);
    E.ui.pjEdit = null; E.render();
  };
  CH['pj-nom'] = el => upd(el.dataset.pid, d => { const eq = d.equipos[Number(el.dataset.i)]; if (eq) eq.nombre = el.value.trim() || eq.nombre; });
  // nombre libre para un equipo nuevo: «Equipo N» con el siguiente número
  const sigNombre = eqs => { const n = eqs.reduce((m, e) => { const x = String(e.nombre || '').match(/^equipo\s+(\d+)$/i); return x ? Math.max(m, Number(x[1])) : m; }, 0); return 'Equipo ' + Math.max(n + 1, eqs.length + 1); };
  CH['pj-mover'] = el => {
    const aid = el.dataset.aid, v = el.value; if (v === '') return; let msg = '';
    upd(el.dataset.pid, (d, g) => {
      const de = d.equipos.find(eq => eq.al.indexOf(aid) >= 0), a = D.alumno(g, aid);
      d.equipos.forEach(eq => { eq.al = eq.al.filter(x => x !== aid); });
      if (v === 'sin') { msg = u.corto(a ? a.nombre : '') + ' quedó sin equipo'; return; }
      if (v === 'nuevo') {
        // se separa: equipo propio con el avance que ya llevaba (lo que hizo con su equipo anterior)
        const nq = { id: u.uid('eq'), nombre: sigNombre(d.equipos), al: [aid], nota: de ? 'Se separó del ' + de.nombre + ' el ' + u.fCorta(u.today()) + '.' : '', proy: '' };
        if (de && d.etapas[de.id]) d.etapas[nq.id] = u.clone(d.etapas[de.id]);
        d.equipos.push(nq); msg = nq.nombre + ': ' + u.corto(a ? a.nombre : '') + (de && d.etapas[de.id] ? ', con el avance que llevaba en el ' + de.nombre : ''); return;
      }
      const j = Number(v); if (d.equipos[j]) { d.equipos[j].al.push(aid); msg = u.corto(a ? a.nombre : '') + ' → ' + d.equipos[j].nombre; }
    });
    if (msg) u.toast(msg, 'ok', 3000);
  };
  A['pj-eq-nuevo'] = el => upd(el.dataset.pid, d => { d.equipos.push({ id: u.uid('eq'), nombre: sigNombre(d.equipos), al: [], nota: '', proy: '' }); });
  A['pj-eq-del'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, eq = (PJ.doc(g, pid).equipos || []).find(e => e.id === el.dataset.eq); if (!eq) return;
    if (eq.al.length && !confirm('¿Quitar el ' + eq.nombre + '? Sus ' + eq.al.length + ' integrantes quedan sin equipo y se pierde el avance de este equipo.')) return;
    upd(pid, d => { d.equipos = d.equipos.filter(e => e.id !== eq.id); delete d.etapas[eq.id]; });
  };
  CH['pj-nota'] = el => upd(el.dataset.pid, d => { const eq = d.equipos.find(e => e.id === el.dataset.eq); if (eq) eq.nota = el.value.trim(); });
  // la primera vez que editas, las etapas del programa se copian al proyecto (conservan su id, así el avance se queda)
  const updDef = (pid, fn) => upd(pid, (d, g) => { if (!d.def || !Array.isArray(d.def.et)) { const b = base(g, pid); if (!b) return; d.def = b; } fn(d.def, d, g); });
  const idx = el => Number(el.dataset.i);
  A['pj-et-edit'] = el => { E.ui.pjEt = el.dataset.pid; E.ui.pjEdit = null; E.render(); };
  A['pj-et-ok'] = () => { E.ui.pjEt = null; E.render(); };
  CH['pj-def-nom'] = el => { const v = el.value.trim(); if (!v) { u.toast('Escribe el nombre del proyecto', 'err'); E.render(); return; } updDef(el.dataset.pid, df => { df.nombre = v; }); };
  CH['pj-et-t'] = el => { const v = el.value.trim(); if (!v) { u.toast('Escribe el nombre de la etapa', 'err'); E.render(); return; } updDef(el.dataset.pid, df => { const e = df.et[idx(el)]; if (e) e.t = v; }); };
  CH['pj-et-f'] = el => updDef(el.dataset.pid, df => { const e = df.et[idx(el)]; if (e) e.f = el.value || ''; });
  const mueve = (el, k) => updDef(el.dataset.pid, df => { const i = idx(el), j = i + k; if (j < 0 || j >= df.et.length) return; const t = df.et[i]; df.et[i] = df.et[j]; df.et[j] = t; });
  A['pj-et-sube'] = el => mueve(el, -1);
  A['pj-et-baja'] = el => mueve(el, 1);
  A['pj-et-del'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, df = PJ.def(g, pid), e = df && df.et[idx(el)]; if (!e || df.et.length <= 1) return;
    const doc = PJ.doc(g, pid), av = (doc.equipos || []).filter(eq => (((doc.etapas || {})[eq.id] || {})[e.id] || {}).st).length;
    if (!confirm('¿Quitar la etapa «' + e.t + '»?' + (av ? ' ' + av + (av === 1 ? ' equipo ya tiene' : ' equipos ya tienen') + ' avance en ella; se guarda por si la vuelves a poner con «Volver a las etapas originales».' : ''))) return;
    updDef(pid, d2 => { d2.et.splice(idx(el), 1); });
  };
  A['pj-et-add'] = el => { updDef(el.dataset.pid, df => { df.et.push({ id: u.uid('et'), t: 'Etapa ' + (df.et.length + 1), base: [], f: '' }); }); setTimeout(() => { const L = document.querySelectorAll('.pj-ett'), x = L[L.length - 1]; if (x) { x.focus(); x.select(); } }, 80); };
  A['pj-et-guion'] = el => { if (!confirm('¿Quitar las fechas que pusiste a mano y usar las del guion?')) return; updDef(el.dataset.pid, df => { df.et.forEach(e => { e.f = ''; }); }); };
  A['pj-et-orig'] = el => { if (!confirm('¿Volver a las etapas, nombres y fechas originales del programa? Se pierden las etapas que agregaste y tus fechas; el avance de las etapas originales se conserva.')) return; upd(el.dataset.pid, d => { delete d.def; }); };
  CH['pj-proy'] = el => upd(el.dataset.pid, d => { const eq = d.equipos.find(e => e.id === el.dataset.eq); if (eq) eq.proy = el.value.trim(); });
  A['pj-st'] = el => upd(el.dataset.pid, d => { const s = d.etapas[el.dataset.eq] = d.etapas[el.dataset.eq] || {}, cur = (s[el.dataset.et] || {}).st || '', nx = SIG[cur]; if (nx) s[el.dataset.et] = { st: nx, f: u.today() }; else delete s[el.dataset.et]; });
})();

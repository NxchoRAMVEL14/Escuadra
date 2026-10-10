/* Escuadra · Avance del proyecto por equipo (garra en el 2º parcial, grúa en el 3er parcial).
   Las etapas salen del guion de Clases y su fecha meta es el día que te toca esa clase; cada equipo lleva su semáforo:
   verde al día, amarillo con una etapa atrasada, rojo con dos o más (o una atrasada más de una semana).
   Es seguimiento: no entra a calificación. */
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
  PJ.parciales = g => D.parciales().filter(p => PJ.ETAPAS[E.clases.smKey(g, p.id)]);
  // fecha meta de cada etapa: el último día en que termina alguna de sus clases
  PJ.metas = (g, pid) => {
    const def = PJ.ETAPAS[E.clases.smKey(g, pid)]; if (!def) return null; const fin = {};
    try { E.clases.plan(g, pid).bloques.forEach(b => { if (b.perdida) return; b.parts.forEach(pt => { if (!pt.sigue) fin[pt.it.id] = b.fecha; }); }); } catch (e) { }
    return def.et.map(e => ({ id: e[0], t: e[1], f: e[2].map(i => fin[i]).filter(Boolean).sort().slice(-1)[0] || null }));
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
    const act = C.parcialActual(); pid = ps.some(p => p.id === pid) ? pid : (ps.find(p => p.id === act.id) || ps[0]).id;
    const p = C.parcial(pid), def = PJ.ETAPAS[E.clases.smKey(g, pid)], doc = PJ.doc(g, pid), eqs = doc.equipos || [], ms = PJ.metas(g, pid), hoy = u.today();
    let h = '<div class="filters">' + ps.map(x => '<a class="tab ' + (x.id === pid ? 'on' : '') + '" href="#/proyecto/' + x.id + '">' + esc(x.nombre) + '</a>').join('') + '</div>';
    if (!eqs.length || E.ui.pjEdit === pid) return { t: 'Proyecto', h: h + editor(g, pid, al, eqs) };
    const est = eqs.map(eq => ({ eq: eq, r: PJ.estado(g, pid, eq, hoy) })), cnt = { ok: 0, warn: 0, bad: 0 }; est.forEach(x => cnt[x.r.nv]++);
    h += card('<div class="row between gap wrap"><h3>🧩 ' + esc(def.nombre) + ' · ' + esc(p.nombre) + '</h3>' + btn('Editar equipos', 'pj-edit', 'data-pid="' + pid + '"', 'small ghost') + '</div>' +
      '<p class="muted small">Toca una etapa para cambiarla: ○ pendiente → ◐ en proceso → ✓ lista. La fecha meta es el día que toca esa clase en tu guion, así que se mueve sola si recorres clases.</p>' +
      '<div class="pj-res"><span class="chip ok">🟢 ' + cnt.ok + ' al día</span><span class="chip warn">🟡 ' + cnt.warn + '</span><span class="chip bad">🔴 ' + cnt.bad + '</span></div>' +
      '<details class="sub" data-sec="pj-metas"><summary>Fechas meta de las etapas</summary><ol class="small">' + ms.map(m => '<li>' + esc(m.t) + ': <b>' + (m.f ? u.fCorta(m.f) : 'sin fecha en el guion') + '</b>' + (m.f && m.f < hoy ? ' <span class="muted">(ya pasó)</span>' : '') + '</li>').join('') + '</ol></details>');
    est.sort((a, b) => ({ bad: 0, warn: 1, ok: 2 })[a.r.nv] - ({ bad: 0, warn: 1, ok: 2 })[b.r.nv]).forEach(x => {
      const eq = x.eq, r = x.r, mi = eq.al.map(id => D.alumno(g, id)).filter(Boolean);
      h += card('<div class="row between gap wrap"><h3>' + NV[r.nv][0] + ' ' + esc(eq.nombre) + '</h3><span class="chip ' + r.nv + '">' + r.listas + ' de ' + r.total + ' etapas</span></div>' +
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
    return card('<h3>👥 Equipos del ' + esc(C.parcial(pid).nombre) + '</h3><p class="muted small">Ármalos equilibrados (según Perfiles: un alumno fuerte en cada equipo) o al azar, y luego mueve a quien quieras. Para la grúa puedes conservar los del parcial anterior.</p>' +
      '<div class="row gap wrap"><label class="fld"><span>Número de equipos</span><input id="pj-k" type="number" min="2" max="10" value="' + k + '" style="max-width:90px"></label>' + btn('⚖️ Equilibrados', 'pj-armar', 'data-pid="' + pid + '" data-m="bal"', 'primary') + btn('🎲 Al azar', 'pj-armar', 'data-pid="' + pid + '" data-m="azar"') +
      (PJ.parciales(g).some(p => p.id !== pid && (PJ.doc(g, p.id).equipos || []).length) ? btn('Copiar del otro parcial', 'pj-copiar', 'data-pid="' + pid + '"', 'ghost') : '') + '</div>' +
      (eqs.length ? '<div class="pj-ed">' + eqs.map((eq, i) => '<div class="pj-edq"><input data-ch="pj-nom" data-pid="' + pid + '" data-i="' + i + '" value="' + esc(eq.nombre) + '" aria-label="Nombre del equipo"><ul>' + eq.al.map(id => { const a = D.alumno(g, id); return a ? '<li>' + esc(corto(a.nombre)) + '<select data-ch="pj-mover" data-pid="' + pid + '" data-aid="' + id + '" aria-label="Mover a">' + eqs.map((e2, j) => '<option value="' + j + '"' + (j === i ? ' selected' : '') + '>' + esc(e2.nombre) + '</option>').join('') + '</select></li>' : ''; }).join('') + '</ul></div>').join('') + '</div>' +
        (al.some(a => de[a.id] == null) ? '<p class="note warn small">Sin equipo: ' + al.filter(a => de[a.id] == null).map(a => esc(corto(a.nombre))).join(', ') + '. Vuelve a armar o agrégalos.</p>' : '') +
        '<div class="row gap wrap mt">' + btn('✓ Listo', 'pj-edit-ok', 'data-pid="' + pid + '"', 'primary') + '</div>' : ''));
  }

  /* ---------- Inicio: equipos atrasados ---------- */
  PJ.inicioHTML = (g, hoy) => {
    const p = C.parcialActual(hoy); if (!p || !PJ.ETAPAS[E.clases.smKey(g, p.id)]) return '';
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
  A['pj-edit-ok'] = () => { E.ui.pjEdit = null; E.render(); };
  CH['pj-nom'] = el => upd(el.dataset.pid, d => { const eq = d.equipos[Number(el.dataset.i)]; if (eq) eq.nombre = el.value.trim() || eq.nombre; });
  CH['pj-mover'] = el => upd(el.dataset.pid, d => { const aid = el.dataset.aid, j = Number(el.value); d.equipos.forEach(eq => { eq.al = eq.al.filter(x => x !== aid); }); if (d.equipos[j]) d.equipos[j].al.push(aid); });
  CH['pj-nota'] = el => upd(el.dataset.pid, d => { const eq = d.equipos.find(e => e.id === el.dataset.eq); if (eq) eq.nota = el.value.trim(); });
  A['pj-st'] = el => upd(el.dataset.pid, d => { const s = d.etapas[el.dataset.eq] = d.etapas[el.dataset.eq] || {}, cur = (s[el.dataset.et] || {}).st || '', nx = SIG[cur]; if (nx) s[el.dataset.et] = { st: nx, f: u.today() }; else delete s[el.dataset.et]; });
})();

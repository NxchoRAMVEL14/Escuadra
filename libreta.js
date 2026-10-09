/* Escuadra · Tareas del parcial y revisión de libreta: junta las tareas y los trabajos en libreta de las clases que
   ya diste (más los que agregues), los revisas alumno por alumno y la calificación pasa sola a una actividad de Libreta. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const LB = E.libreta = {};
  const KL = (g, pid) => 'libreta:' + g.id + ':' + pid;
  const val = id => ((document.getElementById(id) || {}).value || '').trim();
  LB.doc = (g, pid) => S.get(KL(g, pid)) || {};
  const MARCA = { 2: ['✓', 'Completa', 'ok'], 1: ['½', 'Incompleta', 'warn'], 0: ['✗', 'No la hizo', 'bad'] };
  const esMaterial = t => /^(conseguir|traer|para el |guardar|comprar)/i.test(String(t).trim());
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

  /* ---------- lista de tareas del parcial ---------- */
  // De cada actividad que ya se dio: la tarea que se dejó y lo que se trabajó en la libreta; más las que agregues tú.
  LB.tareas = (g, pid) => {
    const doc = LB.doc(g, pid), quitar = doc.quitar || {}, poner = doc.poner || {}, hoy = u.today(), out = [], prox = [];
    let pl = null; try { pl = E.clases && E.clases.plan ? E.clases.plan(g, pid) : null; } catch (e) { pl = null; }
    if (pl) pl.bloques.forEach(b => {
      if (b.perdida) return;
      b.parts.forEach(pt => {
        if (pt.sigue) return; // la actividad termina en otro bloque
        const it = pt.it, dado = b.fecha <= hoy, dst = dado ? out : prox;
        const enLib = x => /libreta|bitácora/i.test(x) && !/libreta\s*\//i.test(x); // "Libreta/Proyecto/Bitácora" es el encuadre, no un trabajo
        const lib = (it.pasos || []).map(x => x[1]).find(enLib) || (enLib(it.ev || '') ? it.ev : '');
        // la bitácora del proyecto se ve aquí, pero no cuenta a menos que la marques
        if (lib) { const bit = !/libreta/i.test(lib), txt = lib.replace(/\.$/, ''); dst.push({ key: 'lib:' + it.id, f: b.fecha, tipo: bit ? 'bitacora' : 'libreta', t: txt.length < 28 ? txt + ' · ' + it.t : txt, act: it.t, material: bit }); }
        if (it.tarea) dst.push({ key: 'tar:' + it.id, f: b.fecha, tipo: 'tarea', t: it.tarea, act: it.t, material: esMaterial(it.tarea) });
      });
    });
    (doc.extra || []).forEach(x => out.push({ key: 'ex:' + x.id, f: x.f, tipo: 'propia', t: x.t, act: '', propia: true }));
    out.sort((a, b) => String(a.f).localeCompare(String(b.f)));
    out.forEach(x => { x.cuenta = poner[x.key] ? true : quitar[x.key] ? false : !x.material; });
    return { todas: out, cuentan: out.filter(x => x.cuenta), prox: prox };
  };
  // calificación de libreta de un alumno: completa = 2, incompleta = 1, no = 0; sin marcar cuenta como no entregada
  LB.calif = (g, pid, aid, ts) => {
    ts = ts || LB.tareas(g, pid).cuentan; const m = ((LB.doc(g, pid).marcas || {})[aid]) || {};
    const marcadas = ts.filter(t => m[t.key] != null).length; if (!ts.length || !marcadas) return { v: null, marcadas: 0, n: ts.length };
    const s = ts.reduce((acc, t) => acc + (Number(m[t.key]) || 0), 0);
    return { v: Math.round(s / (2 * ts.length) * 100), marcadas: marcadas, n: ts.length, comp: ts.filter(t => Number(m[t.key]) === 2).length };
  };
  // mantiene al día la actividad ligada en Calificaciones
  LB.sync = (g, pid) => {
    const doc = LB.doc(g, pid); if (!doc.actId) return; const k = 'act:' + g.id + ':' + doc.actId, a = S.get(k); if (!a) return;
    const ts = LB.tareas(g, pid).cuentan, notas = {};
    D.alumnos(g).forEach(x => { const r = LB.calif(g, pid, x.id, ts); notas[x.id] = r.v == null ? '' : r.v; });
    const nombre = 'Revisión de libreta (' + ts.length + (ts.length === 1 ? ' tarea' : ' tareas') + ')';
    if (JSON.stringify(a.notas || {}) !== JSON.stringify(notas) || a.nombre !== nombre) S.update(k, x => { x.notas = notas; x.nombre = nombre; });
  };

  /* ---------- vista ---------- */
  V.libreta = (pid, aidSel) => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Libreta');
    const ps = D.parciales(); pid = pid && ps.some(p => p.id === pid) ? pid : C.parcialActual().id; const p = C.parcial(pid);
    const T = LB.tareas(g, pid), doc = LB.doc(g, pid), ts = T.cuentan;
    const ui = E.ui.lbSel = E.ui.lbSel || {};
    const sel = al.find(a => a.id === aidSel) || al.find(a => a.id === ui[pid]) || al.find(a => !((doc.marcas || {})[a.id])) || al[0];
    ui[pid] = sel.id;
    const num = {}; ts.forEach((t, i) => { num[t.key] = 'T' + (i + 1); });
    let h = '<div class="filters">' + ps.map(x => '<a class="tab ' + (x.id === pid ? 'on' : '') + '" href="#/libreta/' + x.id + '">' + esc(x.nombre) + '</a>').join('') + '</div>';
    // 1) tareas
    h += card('<h3>📒 Tareas y trabajos de libreta · ' + esc(p.nombre) + '</h3><p class="muted small">Salen de las clases que ya diste (tareas y lo que trabajaron en la libreta) y de las que agregues. Desmarca lo que no vas a revisar; los encargos de material y la bitácora del proyecto no cuentan a menos que los marques.</p>' +
      (T.todas.length ? '<ul class="lb-list">' + T.todas.map(t => '<li class="' + (t.cuenta ? '' : 'off') + '"><label class="lb-chk"><input type="checkbox" data-ch="lb-cuenta" data-pid="' + pid + '" data-key="' + t.key + '" ' + (t.cuenta ? 'checked' : '') + ' aria-label="Cuenta para la libreta"></label><div class="lb-t"><b>' + (t.cuenta ? num[t.key] + ' · ' : '') + esc(t.t) + '</b><small class="muted">' + (t.f ? u.fCorta(t.f) + ' · ' : '') + (t.tipo === 'tarea' ? 'Tarea' : t.tipo === 'libreta' ? 'En la libreta' : t.tipo === 'bitacora' ? 'Bitácora del proyecto' : 'Agregada por ti') + (t.act ? ' · ' + esc(corto(t.act, 50)) : '') + (t.material && t.tipo === 'tarea' ? ' · encargo de material' : '') + '</small></div>' + (t.propia ? btn(icon('trash'), 'lb-del', 'data-pid="' + pid + '" data-key="' + t.key + '" aria-label="Borrar"', 'small ghost') : '') + '</li>').join('') + '</ul>' : '<p class="muted small">Todavía no hay tareas de clases ya dadas en este parcial.</p>') +
      '<div class="row gap wrap"><label class="fld grow"><span>Agregar tarea</span><input id="lb-t" placeholder="Ej. Resumen de pares cinemáticos con dibujos"></label><label class="fld"><span>Fecha</span><input id="lb-f" type="date" value="' + u.today() + '"></label></div>' + btn('Agregar', 'lb-add', 'data-pid="' + pid + '"', 'primary') +
      (T.prox.length ? '<details class="sub" id="lb-prox"><summary>Próximas (aún no se dan): ' + T.prox.length + '</summary><ul class="small">' + T.prox.map(t => '<li>' + u.fCorta(t.f) + ' · ' + esc(corto(t.t, 110)) + '</li>').join('') + '</ul></details>' : ''));
    if (!ts.length) return { t: 'Libreta', h: h };
    // 2) revisión alumno por alumno
    const m = ((doc.marcas || {})[sel.id]) || {}, r = LB.calif(g, pid, sel.id, ts), i = al.indexOf(sel), prev = al[i - 1], next = al[i + 1];
    const rev = al.filter(a => LB.calif(g, pid, a.id, ts).v != null), prom = rev.length ? Math.round(rev.reduce((s, a) => s + LB.calif(g, pid, a.id, ts).v, 0) / rev.length) : null;
    h += card('<div class="row between gap wrap"><h3>✅ Revisar libretas</h3><span class="small muted">Revisadas ' + rev.length + ' de ' + al.length + (prom != null ? ' · promedio ' + prom : '') + '</span></div>' +
      '<div class="lb-nav">' + btn('‹', 'go', 'data-to="libreta/' + pid + '/' + (prev || sel).id + '" aria-label="Anterior"' + (prev ? '' : ' disabled'), '') +
      '<select data-ch="lb-al" data-pid="' + pid + '" aria-label="Alumno">' + al.map(a => '<option value="' + a.id + '" ' + (a.id === sel.id ? 'selected' : '') + '>' + a.num + '. ' + esc(a.nombre) + (LB.calif(g, pid, a.id, ts).v != null ? ' ✓' : '') + '</option>').join('') + '</select>' +
      btn('›', 'go', 'data-to="libreta/' + pid + '/' + (next || sel).id + '" aria-label="Siguiente"' + (next ? '' : ' disabled'), '') + '</div>' +
      '<div class="lb-res"><span>Libreta de <b>' + esc(sel.nombre) + '</b></span><span class="g ' + (r.v == null ? 'na' : H.gclass(r.v)) + '">' + (r.v == null ? '—' : r.v) + '</span></div>' +
      '<ul class="lb-rev">' + ts.map(t => '<li><div class="lb-t"><b>' + num[t.key] + '</b> ' + esc(corto(t.t, 90)) + '</div><div class="cl-seg">' + [2, 1, 0].map(v => btn(MARCA[v][0] + ' ' + MARCA[v][1], 'lb-marca', 'data-pid="' + pid + '" data-aid="' + sel.id + '" data-key="' + t.key + '" data-v="' + v + '"', 'small' + (m[t.key] != null && Number(m[t.key]) === v ? ' on ' + MARCA[v][2] : ''))).join('') + '</div></li>').join('') + '</ul>' +
      '<div class="row gap wrap">' + btn('✓ Todas completas', 'lb-todas', 'data-pid="' + pid + '" data-aid="' + sel.id + '"', 'small') + (next ? btn('Siguiente alumno ›', 'go', 'data-to="libreta/' + pid + '/' + next.id + '"', 'small primary') : '') + '</div>' +
      '<p class="muted small">Completa = 2 · incompleta = 1 · no la hizo = 0. Lo que no marques cuenta como no entregado; un alumno sin ninguna marca queda sin calificación.</p>');
    // 3) calificaciones
    const a = doc.actId && S.get('act:' + g.id + ':' + doc.actId);
    h += card('<h3>📊 A Calificaciones</h3>' + (a ? '<p class="small">Ligada a <a href="#/actividad/' + a.id + '">' + esc(a.nombre) + '</a> (Libreta / Proyecto / Bitácora). Se actualiza sola cada vez que marcas.</p>' : '<p class="small">Crea la actividad de libreta para que la calificación entre al rubro Libreta / Proyecto / Bitácora (' + D.cfg().pond.trabajos + '%).</p>' + btn('Crear actividad de libreta', 'lb-act', 'data-pid="' + pid + '"', 'primary')) +
      '<details class="sub" id="lb-tabla"><summary>Tabla del grupo</summary><div class="tbl-wrap"><table class="tbl lb-tbl"><thead><tr><th>#</th><th class="l">Alumno</th>' + ts.map(t => '<th title="' + esc(t.t) + '">' + num[t.key] + '</th>').join('') + '<th>Calif.</th></tr></thead><tbody>' +
      al.map(x => { const mm = ((doc.marcas || {})[x.id]) || {}, rr = LB.calif(g, pid, x.id, ts); return '<tr><td>' + x.num + '</td><td class="l"><a href="#/libreta/' + pid + '/' + x.id + '">' + esc(x.nombre) + '</a></td>' + ts.map(t => { const v = mm[t.key]; return '<td class="' + (v == null ? 'muted' : MARCA[v][2] + 'c') + '">' + (v == null ? '·' : MARCA[v][0]) + '</td>'; }).join('') + '<td><b>' + (rr.v == null ? '—' : rr.v) + '</b></td></tr>'; }).join('') + '</tbody></table></div></details>' +
      '<div class="row gap wrap mt">' + btn(icon('print') + ' Imprimir lista de cotejo', 'lb-print', 'data-pid="' + pid + '"', 'small') + '</div>');
    return { t: 'Libreta', h: h };
  };

  /* ---------- acciones ---------- */
  const upd = (pid, fn) => { const g = D.grupoActual(); S.update(KL(g, pid), d => { d.marcas = d.marcas || {}; d.quitar = d.quitar || {}; d.poner = d.poner || {}; d.extra = d.extra || []; fn(d); }, {}); LB.sync(g, pid); };
  CH['lb-cuenta'] = el => upd(el.dataset.pid, d => { const k = el.dataset.key; delete d.quitar[k]; delete d.poner[k]; if (el.checked) d.poner[k] = true; else d.quitar[k] = true; });
  CH['lb-al'] = el => { location.hash = '#/libreta/' + el.dataset.pid + '/' + el.value; };
  A['lb-add'] = el => { const t = val('lb-t'); if (!t) { u.toast('Escribe la tarea', 'err'); return; } upd(el.dataset.pid, d => { d.extra.push({ id: u.uid('lt'), f: val('lb-f') || u.today(), t: t }); }); u.toast('Tarea agregada', 'ok'); };
  A['lb-del'] = el => { if (!confirm('¿Borrar esta tarea y sus marcas?')) return; const k = el.dataset.key; upd(el.dataset.pid, d => { d.extra = d.extra.filter(x => 'ex:' + x.id !== k); Object.keys(d.marcas).forEach(aid => { delete d.marcas[aid][k]; }); }); };
  A['lb-marca'] = el => upd(el.dataset.pid, d => { const m = d.marcas[el.dataset.aid] = d.marcas[el.dataset.aid] || {}, v = Number(el.dataset.v); if (m[el.dataset.key] != null && Number(m[el.dataset.key]) === v) delete m[el.dataset.key]; else m[el.dataset.key] = v; });
  A['lb-todas'] = el => { const g = D.grupoActual(), ts = LB.tareas(g, el.dataset.pid).cuentan; upd(el.dataset.pid, d => { const m = d.marcas[el.dataset.aid] = d.marcas[el.dataset.aid] || {}; ts.forEach(t => { m[t.key] = 2; }); }); };
  A['lb-act'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, p = C.parcial(pid), id = u.uid('act');
    S.put('act:' + g.id + ':' + id, { id: id, parcial: pid, categoria: 'trabajos', nombre: 'Revisión de libreta', peso: 1, max: 100, fecha: p.fin, instrumento: 'LC', cuenta: true, notas: {}, libreta: true }, { silent: true });
    S.update(KL(g, pid), d => { d.actId = id; }, {}); LB.sync(g, pid); u.toast('Actividad creada en Libreta / Proyecto / Bitácora', 'ok');
  };
  A['lb-print'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, p = C.parcial(pid), ts = LB.tareas(g, pid).cuentan, al = D.alumnos(g), cf = D.cfg(), doc = LB.doc(g, pid);
    E.print.run('<div class="pr"><div class="p-title">LISTA DE COTEJO · REVISIÓN DE LIBRETA · ' + esc(p.nombre.toUpperCase()) + '</div><p class="tiny c">' + esc(cf.plantelNombre || cf.plantel || '') + ' · ' + esc(g.carrera || '') + ' · Grupo ' + esc(g.nombre) + ' · Docente: ' + esc(cf.docente) + '</p>' +
      '<table class="grid"><thead><tr><th>No.</th><th class="l">NOMBRE</th>' + ts.map((t, i) => '<th>T' + (i + 1) + '</th>').join('') + '<th>CALIF.</th></tr></thead><tbody>' +
      al.map(a => { const m = ((doc.marcas || {})[a.id]) || {}, r = LB.calif(g, pid, a.id, ts); return '<tr><td class="c">' + a.num + '</td><td class="nm">' + esc(a.nombre) + '</td>' + ts.map(t => '<td class="c">' + (m[t.key] == null ? '' : MARCA[m[t.key]][0]) + '</td>').join('') + '<td class="c">' + (r.v == null ? '' : r.v) + '</td></tr>'; }).join('') + '</tbody></table>' +
      '<ol class="tiny">' + ts.map(t => '<li><b>' + (t.f ? u.fCorta(t.f) + ':' : '') + '</b> ' + esc(t.t) + '</li>').join('') + '</ol><p class="tiny">✓ completa (2) · ½ incompleta (1) · ✗ no la hizo (0). Calificación = puntos obtenidos / puntos posibles × 100.</p></div>', { landscape: true, title: 'Libreta ' + g.grupo + ' ' + p.nombre, margin: '8mm' });
  };
})();

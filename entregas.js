/* Escuadra · Tablero de entregas (v1.24): qué pedirles en las próximas clases y qué le falta a cada quien.
   Junta en un solo lugar las tareas y trabajos de la libreta, las actividades de Libreta/Proyecto/Bitácora y las prácticas
   de FreeCAD del parcial. Muestra: 1) qué pedir o recoger en las próximas 2 clases (con mensaje listo para el grupo),
   2) cada entregable como tarjeta con su avance (próximas · por revisar · faltan · completas) y 3) la matriz de alumnos ×
   entregas con colores, quién debe más y tiras imprimibles de «lo que me debes».
   Además crea solas las actividades de las evidencias que marca el guion del parcial (Ajustes → Calificación). */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const EN = E.entregas = {};
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  const ST = { 2: ['✓', 'ok', 'Completa'], 1: ['½', 'warn', 'Incompleta o baja'], 0: ['✗', 'bad', 'No la entregó'] };
  const TIPO = { tarea: ['T', 'Tarea'], libreta: ['L', 'En la libreta'], propia: ['T', 'Tarea agregada'], bitacora: ['B', 'Bitácora'], act: ['A', 'Trabajo'], fc: ['F', 'FreeCAD'] };

  /* =================== 1) entregables del parcial =================== */
  EN.items = (g, pid, hoy) => {
    hoy = hoy || u.today(); const out = [], p = C.parcial(pid); if (!g || !p) return out;
    // libreta: tareas y trabajos que cuentan (la tarea se entrega la clase siguiente a cuando se dejó)
    if (E.libreta) {
      let T = null; try { T = E.libreta.tareas(g, pid); } catch (e) { T = null; }
      const doc = E.libreta.doc(g, pid), mk = doc.marcas || {};
      if (T) T.cuentan.forEach(t => {
        const due = t.tipo === 'tarea' ? (C.siguienteClase(g, t.f) || t.f) : t.f;
        out.push({ k: 'lib:' + t.key, tipo: t.tipo === 'propia' ? 'propia' : t.tipo, t: t.t, f: t.f, due: due, to: 'libreta/' + pid, act: t.act,
          est: aid => { const v = (mk[aid] || {})[t.key]; return { v: v == null ? null : Number(v), tarde: E.libreta.factor(doc, aid, t.key) < 1 }; } });
      });
    }
    // trabajos calificados en Calificaciones (sin la libreta ni FreeCAD, que ya salen arriba y abajo)
    const lib = E.libreta ? E.libreta.doc(g, pid) : {}, fcd = E.fc && E.fc.rev ? E.fc.rev(g, pid) : {};
    C.acts(g, pid).filter(a => a.categoria === 'trabajos' && a.cuenta !== false && !a.libreta && !a.freecad && a.id !== lib.actId && a.id !== fcd.actId).forEach(a => {
      out.push({ k: 'act:' + a.id, tipo: 'act', t: a.nombre, f: a.fecha || p.fin, due: a.fecha || p.fin, to: 'actividad/' + a.id, auto: !!a.auto,
        est: aid => { const n = C.nota(a, aid); return { v: n == null ? null : n === 0 ? 0 : n < (Number(D.cfg().minAprob) || 60) ? 1 : 2, n: n == null ? null : Math.round(n), tarde: !!(a.tarde && a.tarde[aid]) }; } });
    });
    // prácticas de FreeCAD que ya se revisan en este parcial
    if (E.fc && E.fc.rev) {
      const est = E.fc.estado ? E.fc.estado(g) : {}, mk = fcd.marcas || {};
      (fcd.orden || []).forEach(id => {
        const pr = E.fc.get(id); if (!pr) return; const f = (est[id] && est[id].f) || p.inicio;
        out.push({ k: 'fc:' + id, tipo: 'fc', t: pr.t, f: f, due: f, to: 'freecad/' + id + '/revisar/' + pid,
          est: aid => { const v = (mk[aid] || {})[id]; return { v: v == null ? null : Number(v), tarde: E.fc.factor ? E.fc.factor(fcd, aid, id) < 1 : false }; } });
      });
    }
    out.sort((a, b) => String(a.due).localeCompare(String(b.due)) || String(a.t).localeCompare(String(b.t)));
    const n = { T: 0, L: 0, B: 0, A: 0, F: 0 }; out.forEach(x => { const c = TIPO[x.tipo][0]; n[c]++; x.cod = c + n[c]; });
    return out;
  };
  // cómo va un entregable en el grupo
  EN.resumen = (x, al, hoy) => {
    const r = { ok: 0, med: 0, no: 0, sin: 0, tarde: 0, total: al.length, vencida: x.due < hoy, hoyToca: x.due === hoy };
    al.forEach(a => { const s = x.est(a.id); if (s.v == null) r.sin++; else if (s.v === 2) r.ok++; else if (s.v === 1) r.med++; else r.no++; if (s.tarde) r.tarde++; });
    r.marcadas = r.ok + r.med + r.no;
    r.col = !r.vencida && !r.hoyToca ? 'prox' : !r.marcadas ? 'rev' : r.ok === r.total ? 'ok' : 'falta';
    return r;
  };
  // lo que debe cada alumno (solo lo que ya se tenía que entregar)
  // lo que nadie tiene revisado aún es pendiente tuyo (por revisar), no deuda del alumno
  const revisada = (x, al) => { if (x._rev == null) x._rev = al.some(a => x.est(a.id).v != null); return x._rev; };
  EN.debe = (g, items, aid, hoy) => { const al = D.alumnos(g); return items.filter(x => x.due < hoy && revisada(x, al)).map(x => ({ x: x, s: x.est(aid) })).filter(y => y.s.v == null || y.s.v < 2); };

  /* =================== 2) qué pedir en las próximas clases =================== */
  EN.proximas = (g, hoy, n) => {
    hoy = hoy || u.today(); const out = []; let f = C.esClase(g, hoy) ? hoy : C.siguienteClase(g, hoy);
    for (let i = 0; i < (n || 2) && f; i++) { out.push(f); f = C.siguienteClase(g, f); }
    return out;
  };
  EN.pedir = (g, f) => {
    const p = D.parciales().find(x => f >= x.inicio && f <= x.fin); if (!p) return null;
    const r = { f: f, recoger: [], material: [], entregan: [], dejar: [] }, ant = C.claseAnterior(g, f);
    let T = null; try { T = E.libreta ? E.libreta.tareas(g, p.id) : null; } catch (e) { T = null; }
    if (T && ant) T.todas.concat(T.prox).forEach(t => {
      if (t.tipo !== 'tarea' || t.f !== ant) return;
      (t.material ? r.material : r.recoger).push(t.t);
    });
    let d = null; try { d = E.clases.dia(g, f); } catch (e) { d = null; }
    if (d) d.bloques.forEach(b => { if (b.perdida) return; b.parts.forEach(pt => { const it = pt.it; if (pt.sigue) return; if (it.ev && !/^examen/.test(it.id) && !/libreta/i.test(it.ev)) r.entregan.push(E.pend ? E.pend.limpiaEv(it.ev) : it.ev); if (it.tarea) r.dejar.push(it.tarea); }); });
    ['recoger', 'material', 'entregan', 'dejar'].forEach(k => { r[k] = Array.from(new Set(r[k])); });
    r.vacio = !r.recoger.length && !r.material.length && !r.entregan.length && !r.dejar.length;
    return r;
  };
  const diaTxt = f => f === u.today() ? 'Hoy' : f === u.addDays(u.today(), 1) ? 'Mañana' : u.cap(u.fLarga(f));
  EN.mensaje = (g, r) => {
    const l = ['📌 ' + esc(g.nombre) + ' · ' + diaTxt(r.f).replace(/^(Hoy|Mañana)$/, m => m + ' (' + u.fCorta(r.f) + ')') + ':'];
    r.recoger.forEach(t => l.push('• Traer la tarea: ' + t));
    r.material.forEach(t => l.push('• Traer: ' + t.replace(/^para el [a-záéíóúñ]+:?\s*/i, '')));
    r.entregan.forEach(t => l.push('• En clase entregamos: ' + t));
    return l.join('\n');
  };
  const pedirHTML = (g, r) => {
    if (!r) return '';
    const li = (ico, lbl, xs) => xs.map(t => '<li><span class="en-ico">' + ico + '</span><span><b>' + lbl + ':</b> ' + esc(corto(t, 160)) + '</span></li>').join('');
    return '<div class="en-dia"><div class="row between gap wrap"><h4>' + esc(diaTxt(r.f)) + (r.f === u.today() || r.f === u.addDays(u.today(), 1) ? ' <span class="muted small">' + u.fCorta(r.f) + '</span>' : '') + '</h4>' +
      (r.recoger.length || r.material.length || r.entregan.length ? btn(icon('copy') + ' Mensaje para el grupo', 'en-msg', 'data-f="' + r.f + '"', 'small') : '') + '</div>' +
      (r.vacio ? '<p class="small muted">Nada que pedir ni que dejar según tu guion.</p>' : '<ul class="en-pedir">' + li('📥', 'Recoger la tarea', r.recoger) + li('🧰', 'Que traigan', r.material) + li('📌', 'Entregan en clase', r.entregan) + li('📝', 'Dejar de tarea', r.dejar) + '</ul>') + '</div>';
  };
  A['en-msg'] = async el => { const g = D.grupoActual(), r = EN.pedir(g, el.dataset.f); if (!r) return; const ok = await u.copy(EN.mensaje(g, r).replace(/&amp;/g, '&')); u.toast(ok ? 'Mensaje copiado: pégalo en el grupo de WhatsApp' : 'No se pudo copiar', ok ? 'ok' : 'err', 3500); };

  /* =================== 3) la pantalla =================== */
  const celda = (x, s, aid) => {
    if (s.v == null) { const fut = x.due >= u.today(), rev = x._rev; return '<td class="en-c ' + (fut ? 'en-fut' : rev ? 'en-sin' : 'en-rev') + '" title="' + esc(x.cod + ' · ' + (fut ? 'Aún no se entrega' : rev ? 'No la ha entregado' : 'Por revisar: nadie tiene marca todavía')) + '"><a href="#/' + x.to + (x.tipo !== 'act' && x.tipo !== 'fc' && aid ? '/' + aid : '') + '">' + (!fut && rev ? '·' : '') + '</a></td>'; }
    const m = ST[s.v]; return '<td class="en-c en-' + m[1] + '" title="' + esc(x.cod + ' · ' + m[2] + (s.n != null ? ' (' + s.n + ')' : '') + (s.tarde ? ' · tarde' : '')) + '"><a href="#/' + x.to + (x.tipo !== 'act' && x.tipo !== 'fc' && aid ? '/' + aid : '') + '">' + (s.n != null ? s.n : m[0]) + (s.tarde ? '<i>⏰</i>' : '') + '</a></td>';
  };
  const COLS = [['prox', '🗓 Próximas', 'Aún no se entregan'], ['rev', '🔍 Por revisar', 'Ya se entregaron y no tienen ninguna marca'], ['falta', '⏳ Les falta', 'Revisadas, pero alguien no la entrega completa'], ['ok', '✅ Completas', 'Todo el grupo la tiene completa']];
  V.entregas = (pid, modo) => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Entregas');
    const ps = D.parciales(); pid = ps.some(p => p.id === pid) ? pid : C.parcialActual().id; const p = C.parcial(pid), hoy = u.today();
    const ui = E.ui.en = E.ui.en || { orden: 'num', solo: false };
    const its = EN.items(g, pid, hoy), rs = its.map(x => ({ x: x, r: EN.resumen(x, al, hoy) }));
    let h = '<div class="filters">' + ps.map(x => '<a class="tab ' + (x.id === pid ? 'on' : '') + '" href="#/entregas/' + x.id + '">' + esc(x.nombre) + '</a>').join('') + '</div>';
    // qué pedir
    const dias = p.inicio <= hoy && p.fin >= hoy ? EN.proximas(g, hoy, 2) : [];
    h += card('<h3>📣 Qué pedirles</h3><p class="muted small">Sale de tu guion: la tarea que dejaste la clase anterior, el material que encargaste, lo que se entrega en clase y la tarea que toca dejar. «Mensaje para el grupo» lo copia listo para WhatsApp.</p>' +
      (dias.length ? dias.map(f => pedirHTML(g, EN.pedir(g, f))).join('') : '<p class="small muted">Este parcial no está en curso.</p>'));
    // resumen
    const deben = al.map(a => ({ a: a, d: EN.debe(g, its, a.id, hoy) })), conDeuda = deben.filter(x => x.d.length);
    const cnt = k => rs.filter(y => y.r.col === k).length;
    h += card('<h3>📋 Entregas de ' + esc(p.nombre) + '</h3><div class="en-kpis"><div><b>' + its.length + '</b><span>entregables</span></div><div><b>' + cnt('rev') + '</b><span>por revisar</span></div><div><b>' + cnt('falta') + '</b><span>con faltantes</span></div><div class="' + (conDeuda.length ? 'warn' : 'ok') + '"><b>' + conDeuda.length + '</b><span>alumnos deben algo</span></div></div>' +
      '<div class="row gap wrap">' + btn('🖨 Tiras «lo que me debes»', 'en-tiras', 'data-pid="' + pid + '"', 'small' + (conDeuda.length ? ' primary' : '')) + btn(icon('copy') + ' Quién debe qué (sin nombres)', 'en-copiar', 'data-pid="' + pid + '"', 'small') + link('📒 Libreta', 'libreta/' + pid, 'small ghost') + link('📊 Calificaciones', 'calificaciones/' + pid, 'small ghost') + '</div>');
    if (!its.length) return { t: 'Entregas', h: h + card('<p class="small">Todavía no hay entregables en este parcial. Aparecen solos cuando das clases con tarea o trabajo en la libreta, creas actividades de Libreta/Proyecto/Bitácora o revisas prácticas de FreeCAD.</p>') };
    // tablero por columnas
    const ancho = window.matchMedia && window.matchMedia('(min-width: 760px)').matches;
    h += '<div class="en-board">' + COLS.map(c => {
      const todos = rs.filter(y => y.r.col === c[0]), xs = c[0] === 'ok' ? todos.slice(-6) : todos, abre = ancho || c[0] === 'rev' || c[0] === 'falta';
      return '<details class="en-col en-col-' + c[0] + '" data-sec="en-' + c[0] + '"' + (abre ? ' open' : '') + '><summary><h4>' + c[1] + ' <span class="chip">' + todos.length + '</span></h4><p class="tiny muted">' + c[2] + '</p></summary>' +
        (xs.length ? xs.map(y => {
          const r = y.r, x = y.x, pct = n => (n / Math.max(1, r.total) * 100).toFixed(1) + '%';
          return '<a class="en-card" href="#/' + x.to + '"><div class="row between gap"><span class="chip">' + x.cod + '</span><small class="muted">' + (c[0] === 'prox' ? 'para el ' : '') + u.fCorta(x.due) + '</small></div><b>' + esc(corto(x.t, 90)) + '</b><small class="muted">' + TIPO[x.tipo][1] + (x.auto ? ' · del guion' : '') + '</small>' +
            (c[0] === 'prox' || !r.marcadas ? '' : '<div class="en-bar"><i class="ok" style="width:' + pct(r.ok) + '"></i><i class="warn" style="width:' + pct(r.med) + '"></i><i class="bad" style="width:' + pct(r.no) + '"></i></div><small>' + '✓ ' + r.ok + (r.med ? ' · ½ ' + r.med : '') + (r.no ? ' · ✗ ' + r.no : '') + (r.sin ? ' · sin marca ' + r.sin : '') + (r.tarde ? ' · ⏰ ' + r.tarde : '') + '</small>') + '</a>';
        }).join('') : '<p class="tiny muted">—</p>') + (c[0] === 'ok' && todos.length > 6 ? '<p class="tiny muted">Y ' + (todos.length - 6) + ' más.</p>' : '') + '</details>';
    }).join('') + '</div>';
    // matriz alumnos × entregas
    const vis = its.filter(x => x.due <= u.addDays(hoy, 7));
    let filas = deben.slice(); if (ui.orden === 'debe') filas.sort((a, b) => b.d.length - a.d.length || a.a.num - b.a.num); if (ui.solo) filas = filas.filter(x => x.d.length);
    h += card('<div class="row between gap wrap"><h3>🧮 Quién entregó qué</h3><div class="row gap wrap">' + btn('Por número', 'en-orden', 'data-o="num"', 'small' + (ui.orden === 'num' ? ' on' : ' ghost')) + btn('Los que más deben', 'en-orden', 'data-o="debe"', 'small' + (ui.orden === 'debe' ? ' on' : ' ghost')) + '<label class="switch sm"><input type="checkbox" data-ch="en-solo"' + (ui.solo ? ' checked' : '') + '><span>Solo quienes deben</span></label></div></div>' +
      '<p class="muted small">✓ completa · ½ incompleta o reprobada · ✗ no la entregó · <span class="en-dot sin"></span> ya se tenía que entregar y no la tiene · <span class="en-dot rev"></span> por revisar (nadie tiene marca) · <span class="en-dot fut"></span> aún no se entrega · ⏰ tarde. Toca una celda para revisarla.</p>' +
      '<div class="tbl-wrap en-wrap"><table class="tbl en-tbl"><thead><tr><th>#</th><th class="l">Alumno</th><th>Debe</th>' + vis.map(x => '<th title="' + esc(x.t + ' · ' + u.fCorta(x.due)) + '">' + x.cod + '<small>' + u.fCorta(x.due) + '</small></th>').join('') + '</tr></thead><tbody>' +
      filas.map(y => '<tr><td>' + y.a.num + '</td><td class="l"><a href="#/alumno/' + y.a.id + '">' + esc(u.corto(y.a.nombre)) + '</a></td><td>' + (y.d.length ? '<span class="chip ' + (y.d.length >= 3 ? 'bad' : 'warn') + '">' + y.d.length + '</span>' : '<span class="chip ok">0</span>') + '</td>' + vis.map(x => celda(x, x.est(y.a.id), y.a.id)).join('') + '</tr>').join('') +
      '</tbody></table></div><details class="sub" id="en-ley"><summary>Qué es cada columna</summary><ol class="small en-ley">' + vis.map(x => '<li><b>' + x.cod + '</b> · ' + u.fCorta(x.due) + ' · ' + esc(x.t) + '</li>').join('') + '</ol></details>');
    return { t: 'Entregas', h: h };
  };
  A['en-orden'] = el => { E.ui.en.orden = el.dataset.o; E.render(); };
  CH['en-solo'] = el => { E.ui.en.solo = el.checked; E.render(); };
  A['en-copiar'] = async el => {
    const g = D.grupoActual(), pid = el.dataset.pid, hoy = u.today(), al = D.alumnos(g), its = EN.items(g, pid, hoy).filter(x => x.due < hoy);
    const l = ['Pendientes de entrega · ' + g.nombre + ' · al ' + u.fCorta(hoy) + ' (por número de lista)'];
    its.forEach(x => { const nums = al.filter(a => { const s = x.est(a.id); return s.v == null || s.v < 2; }).map(a => a.num); if (nums.length && nums.length < al.length) l.push('• ' + x.cod + ' ' + corto(x.t, 70) + ': ' + nums.join(', ')); });
    if (l.length === 1) { u.toast('Nadie debe nada 🎉', 'ok'); return; }
    const ok = await u.copy(l.join('\n')); u.toast(ok ? 'Copiado (solo números de lista)' : 'No se pudo copiar', ok ? 'ok' : 'err');
  };
  A['en-tiras'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, hoy = u.today(), p = C.parcial(pid), its = EN.items(g, pid, hoy), cf = D.cfg();
    const L = D.alumnos(g).map(a => ({ a: a, d: EN.debe(g, its, a.id, hoy) })).filter(x => x.d.length);
    if (!L.length) { u.toast('Nadie debe nada 🎉', 'ok'); return; }
    E.print.run('<div class="pr en-tiras">' + L.map(x => '<div class="en-tira"><div class="row between"><b>' + esc(x.a.nombre) + '</b><span class="tiny">No. ' + x.a.num + ' · ' + esc(g.nombre) + ' · ' + esc(p.nombre) + ' · ' + u.fCorta(hoy) + '</span></div><p class="tiny">Lo que me debes (entrégalo lo antes posible; lo entregado tarde vale ' + Math.round(C.tardeVale() * 100) + ' %):</p><ul>' +
      x.d.map(y => '<li>☐ <b>' + y.x.cod + '</b> ' + esc(corto(y.x.t, 110)) + ' <span class="tiny">(' + (y.s.v == null ? 'sin entregar' : y.s.v === 1 ? 'incompleta' : 'no entregada') + ' · era para el ' + u.fCorta(y.x.due) + ')</span></li>').join('') + '</ul><p class="tiny r">' + esc(cf.docente || '') + '</p></div>').join('') + '</div>', { title: 'Lo que me debes · ' + g.nombre, margin: '8mm', sinLogo: true });
  };

  /* =================== Inicio =================== */
  EN.inicioHTML = (g, hoy) => {
    if (!g || !D.alumnos(g).length) return ''; const p = C.parcialActual(hoy); if (!p || p.inicio > hoy || p.fin < hoy) return '';
    const sig = EN.proximas(g, hoy, 1)[0], r = sig && EN.pedir(g, sig);
    const its = EN.items(g, p.id, hoy), al = D.alumnos(g), deben = al.filter(a => EN.debe(g, its, a.id, hoy).length).length;
    if ((!r || r.vacio) && !deben) return '';
    const xs = r ? [].concat(r.recoger.map(t => '📥 ' + t), r.material.map(t => '🧰 ' + t), r.entregan.map(t => '📌 ' + t)).slice(0, 3) : [];
    return card('<div class="row between gap wrap"><h3>📣 Entregas</h3>' + link('Tablero ›', 'entregas/' + p.id, 'small') + '</div>' +
      (xs.length ? '<p class="small"><b>Pide ' + esc(sig === hoy ? 'hoy' : sig === u.addDays(hoy, 1) ? 'mañana' : 'el ' + u.fLarga(sig)) + ':</b></p><ul class="pd-mini">' + xs.map(t => '<li>' + esc(corto(t, 110)) + '</li>').join('') + '</ul>' : '') +
      (deben ? '<p class="small">' + deben + (deben === 1 ? ' alumno debe' : ' alumnos deben') + ' al menos una entrega.</p>' : ''));
  };

  /* =================== evidencias del guion → actividades solas =================== */
  const KA = g => 'guionAuto:' + g.id;
  EN.autoActivo = () => D.cfg().evAuto !== false;
  EN.auto = (g, silencio) => {
    if (!g || !EN.autoActivo() || !E.pend || !E.clases || !D.alumnos(g).length) return 0;
    const hoy = u.today(), hechas = S.get(KA(g)) || {}, omit = S.get('guionAct:' + g.id) || {}; let n = 0, mov = 0; const nuevas = {};
    D.parciales().filter(p => p.inicio <= u.addDays(hoy, 7) && p.captura >= hoy).forEach(p => {
      let L = []; try { L = E.pend.evidencias(g, C.inicioEfectivo(g, p), p.fin); } catch (e) { L = []; }
      L.filter(x => x.pid === p.id).forEach(x => {
        if (x.act) { // si el guion se movió, la actividad creada sola sigue su fecha mientras no tenga calificaciones
          const a = x.act; if (a.auto && a.fecha !== x.f && !Object.keys(a.notas || {}).some(k => a.notas[k] !== '' && a.notas[k] != null)) { S.update('act:' + g.id + ':' + a.id, z => { z.fecha = x.f; }); mov++; }
          return;
        }
        if (omit[x.key] || hechas[x.key]) return;
        const id = u.uid('act'), T = x.rub && E.cap ? E.cap.rubs()[x.rub] : null;
        const a = { id: id, parcial: p.id, categoria: x.diag ? 'diagnostico' : 'trabajos', nombre: x.nom, peso: 1, max: 100, fecha: x.f, instrumento: x.diag ? 'Exa' : T ? 'R' : 'LC', cuenta: !x.diag, notas: {}, guion: x.it.id, auto: true };
        if (T) a.rub = { tpl: x.rub, n: T.n, crit: T.crit.slice(), niv: E.cap.niv() };
        S.put('act:' + g.id + ':' + id, a, { silent: true }); nuevas[x.key] = hoy; n++;
      });
    });
    if (n) { S.update(KA(g), d => { Object.assign(d, nuevas); }, {}); if (!silencio) u.toast('Creé ' + n + (n === 1 ? ' actividad' : ' actividades') + ' de las evidencias de tu guion (con su rúbrica sugerida)', 'ok', 5000); }
    return n + mov;
  };
  let autoHecho = '';
  EN.autoTodos = () => { const k = u.today() + '|' + D.gruposActivos().map(g => g.id).join(','); if (autoHecho === k) return; autoHecho = k; D.gruposActivos().forEach(g => { try { EN.auto(g); } catch (e) { console.error(e); } }); };
  A['en-auto'] = () => { const g = D.grupoActual(); autoHecho = ''; const n = EN.auto(g); if (!n) u.toast('Ya estaban todas las actividades del guion', 'ok'); };
})();

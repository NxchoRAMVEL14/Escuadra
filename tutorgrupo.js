/* Escuadra · v1.50.0 · Idea 33: panel del tutor del grupo (todas las materias).
   Subes la boleta grupal en PDF que da control escolar (una página por alumno) y la app la lee: calificaciones de los 3
   parciales y asistencias de cada materia. Junta a cada alumno con tu lista por su nombre (la boleta no viene en orden de
   lista) y arma: el semáforo de todas las materias, a quién atender primero y por qué, cómo va cada materia, la tarjeta en
   la ficha y el mensaje para la familia. Cada parcial vuelves a subir la boleta y se actualiza.
   La asistencia de la boleta son días con asistencia (1 por día); el porcentaje se calcula contra quien más días asistió en
   esa materia (aproximado). Mínimo aprobatorio: 6 en asignaturas y el de tu configuración en el módulo. Solo para tu apoyo como tutor. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const TG = E.tutorg = {}, K = g => 'boleta:' + g.id;
  const corto = n => (u.corto ? u.corto(n) : n);
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z ]/g, ' ').split(/\s+/).filter(t => t.length > 1 && ['DE', 'DEL', 'LA', 'LOS', 'LAS'].indexOf(t) < 0);
  TG.doc = g => S.get(K(g)) || null;
  TG.esModulo = m => /M\dS\d$/i.test(m.clave);
  TG.minDe = m => TG.esModulo(m) ? C.min10() : 6;
  // ---------- leer el PDF ----------
  TG.leePDF = async buf => {
    if (!window.pdfjsLib) await u.loadScript('lib-pdf.js');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib-pdf-worker.js';
    const doc = await window.pdfjsLib.getDocument({ data: buf, verbosity: 0 }).promise, pags = [];
    for (let i = 1; i <= doc.numPages; i++) { const tc = await (await doc.getPage(i)).getTextContent(); pags.push(tc.items.map(t => ({ s: t.str, x: t.transform[4], y: t.transform[5], w: t.width }))); }
    return window.BoletaParse.lee(pags);
  };
  // ---------- juntar con la lista por nombre ----------
  TG.empata = (g, filas, previo) => {
    const al = D.alumnos(g), usados = {}, out = [];
    const sc = (a, b) => { const A0 = norm(a), B0 = norm(b), n = A0.filter(t => B0.indexOf(t) >= 0).length; return n / Math.max(A0.length, B0.length, 1); };
    filas.forEach(f => { const pv = previo && previo[f.control]; if (pv && al.some(a => a.id === pv)) { usados[pv] = 1; out.push(Object.assign({}, f, { aid: pv })); return; }
      const L = al.filter(a => !usados[a.id]).map(a => ({ a: a, s: sc(f.nombre, a.nombre) })).sort((x, y) => y.s - x.s);
      const ok = L[0] && L[0].s >= 0.5 && (!L[1] || L[0].s > L[1].s) ? L[0].a.id : null; if (ok) usados[ok] = 1; out.push(Object.assign({}, f, { aid: ok })); });
    return out;
  };
  TG.guarda = (g, filas) => {
    const prev = TG.doc(g), mapa = {}; ((prev && prev.al) || []).forEach(x => { if (x.aid) mapa[x.control] = x.aid; });
    const L = TG.empata(g, filas, mapa), m0 = (filas[0] || { materias: [] }).materias.filter(m => !m.vacia);
    const mats = m0.map(m => ({ clave: m.clave, nombre: m.nombre, corto: window.BoletaParse.corto(m) })), mx = {};
    mats.forEach(m => { mx[m.clave] = [0, 1, 2].map(i => Math.max.apply(null, [0].concat(filas.map(f => { const z = f.materias.find(y => y.clave === m.clave); return z && typeof z.a[i] === 'number' ? z.a[i] : 0; })))); });
    const d = { f: u.today(), grupo: (filas[0] || {}).grupo || '', sem: (filas[0] || {}).semestre || '', mats: mats, mx: mx, al: L.map(f => { const m = {}; f.materias.filter(z => !z.vacia).forEach(z => { m[z.clave] = { p: z.p, a: z.a }; }); return { control: f.control, nombre: f.nombre, aid: f.aid, m: m }; }) };
    S.put(K(g), d); return d;
  };
  // ---------- análisis ----------
  TG.ultimo = d => { let k = -1; d.al.forEach(x => Object.values(x.m).forEach(z => z.p.forEach((v, i) => { if (v != null && v !== '' && i > k) k = i; }))); return k; };
  const num = v => typeof v === 'number' ? v : null;
  TG.pct = (d, clave, i, v) => { const mx = (d.mx[clave] || [])[i]; return mx && typeof v === 'number' ? Math.round(v / mx * 100) : null; };
  TG.alumno = (d, x) => { const k = TG.ultimo(d), rep = [], baja = [], fal = []; let s = 0, n = 0;
    d.mats.forEach(m => { const z = x.m[m.clave]; if (!z) return; const v = num(z.p[k]), v0 = k > 0 ? num(z.p[k - 1]) : null, mn = TG.minDe(m);
      if (z.p[k] === 'NAC' || (v != null && v < mn)) rep.push(m.corto); if (v != null) { s += v; n++; } if (v != null && v0 != null && v0 - v >= 2) baja.push(m.corto + ' ' + v0 + '→' + v);
      const pc = TG.pct(d, m.clave, k, z.a[k]); if (pc != null && pc < 80) fal.push(m.corto + ' ' + z.a[k] + ' de ' + d.mx[m.clave][k] + ' días'); });
    return { k: k, rep: rep, baja: baja, fal: fal, prom: n ? s / n : null, nivel: rep.length >= 2 || (rep.length && fal.length >= 2) ? 'rojo' : rep.length || baja.length || fal.length ? 'amarillo' : 'verde' }; };
  TG.de = (g, aid) => { const d = TG.doc(g); if (!d) return null; const x = d.al.find(y => y.aid === aid); return x ? { d: d, x: x, r: TG.alumno(d, x) } : null; };
  const PN = ['1er', '2º', '3er'];
  const celda = (m, v) => { if (v == null || v === '') return '<td class="tg-na">·</td>'; if (typeof v !== 'number') return '<td class="' + (v === 'NAC' ? 'tg-bad' : 'tg-ok') + '">' + esc(v) + '</td>'; const mn = TG.minDe(m); return '<td class="' + (v < mn ? 'tg-bad' : v < mn + 1 ? 'tg-warn' : 'tg-ok') + '">' + v + '</td>'; };
  TG.msgCasa = (g, x, d) => { const k = TG.ultimo(d), r = TG.alumno(d, x), cf = D.cfg(), a = D.alumno(g, x.aid), nom = a ? (u.partesNombre ? u.partesNombre(a.nombre).nom.split(' ')[0] : a.nombre) : x.nombre;
    return 'Buen día. Le escribe ' + (cf.docente || 'el tutor') + ', tutor del grupo ' + g.nombre + '. Le comparto cómo va ' + nom + ' en el ' + PN[k] + ' parcial en todas sus materias:\n' + d.mats.map(m => { const z = x.m[m.clave] || { p: [] }; return '• ' + m.corto + ': ' + (z.p[k] == null ? '—' : z.p[k]); }).join('\n') + (r.rep.length ? '\nVa abajo en: ' + r.rep.join(', ') + '. Con gusto platicamos cómo apoyarle.' : '\n¡Va aprobando todo! Gracias por su apoyo.') + '\nQuedo a sus órdenes.'; };
  // ---------- vista ----------
  V.tutorgrupo = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Panel del tutor');
    const d = TG.doc(g);
    let h = card('<h3>🎓 Panel del tutor · ' + esc(g.nombre) + '</h3><p class="small">Sube la <b>boleta grupal en PDF</b> que da control escolar: la app lee las calificaciones y asistencias de todas las materias y junta a cada alumno con tu lista por su nombre. Cada parcial la vuelves a subir.</p><div class="row gap wrap"><label class="btn primary filebtn">📄 ' + (d ? 'Subir boleta nueva' : 'Subir boleta grupal (PDF)') + '<input type="file" accept="application/pdf,.pdf" hidden data-ch="tg-pdf"></label>' + (d ? btn('🖨 Reporte del tutor', 'tg-imp', '', 'small') : '') + '</div>' + (d ? '<p class="small muted">Boleta del ' + esc(d.grupo) + ' · cargada el ' + u.fCorta(d.f) + ' · ' + d.al.length + ' alumnos · ' + (TG.ultimo(d) >= 0 ? PN[TG.ultimo(d)] + ' parcial' : 'sin calificaciones') + '</p>' : '') + '<p class="small muted">Solo para tu apoyo como tutor y para explicar a alumnos y familias; no se comparte con nadie.</p>');
    if (!d) return { t: 'Panel del tutor', h: h };
    const al = D.alumnos(g), sin = d.al.filter(x => !x.aid), k = TG.ultimo(d);
    if (sin.length) h += card('<h3>⚠️ No encontré en tu lista (' + sin.length + ')</h3><p class="small">Elige a quién corresponde cada nombre de la boleta:</p><ul class="plain fa-l">' + sin.map(x => '<li><span class="small">' + esc(x.nombre) + '</span><select class="inp" data-ch="tg-map" data-c="' + esc(x.control) + '"><option value="">—</option>' + al.filter(a => !d.al.some(y => y.aid === a.id)).map(a => '<option value="' + a.id + '">' + a.num + '. ' + esc(a.nombre) + '</option>').join('') + '</select></li>').join('') + '</ul>');
    const L = d.al.filter(x => x.aid).map(x => ({ x: x, a: D.alumno(g, x.aid), r: TG.alumno(d, x) })).filter(o => o.a).sort((p, q) => p.a.num - q.a.num);
    const rojos = L.filter(o => o.r.nivel === 'rojo'), amar = L.filter(o => o.r.nivel === 'amarillo');
    h += card('<div class="fs-kpi"><div class="ok"><b>' + L.filter(o => !o.r.rep.length).length + '</b><span>aprueban todo</span></div><div class="warn"><b>' + L.filter(o => o.r.rep.length === 1).length + '</b><span>con 1 materia abajo</span></div><div class="bad"><b>' + L.filter(o => o.r.rep.length >= 2).length + '</b><span>con 2 o más</span></div></div>');
    if (rojos.length || amar.length) h += card('<h3>🎯 Atender primero</h3><ul class="plain fa-l">' + rojos.concat(amar).map(o => '<li class="tg-' + o.r.nivel + '"><div><a href="#/alumno/' + o.a.id + '"><b>' + (o.r.nivel === 'rojo' ? '🔴 ' : '🟡 ') + o.a.num + '. ' + esc(corto(o.a.nombre)) + '</b></a><small>' + [o.r.rep.length ? 'abajo en ' + o.r.rep.join(', ') : '', o.r.baja.length ? 'bajó ' + o.r.baja.join(', ') : '', o.r.fal.length ? 'asistencia ' + o.r.fal.join(', ') : ''].filter(Boolean).join(' · ') + '</small></div>' + btn('💬', 'tg-wa', 'data-aid="' + o.a.id + '"', 'small') + '</li>').join('') + '</ul>');
    // por materia
    h += card('<h3>📚 Cómo va cada materia</h3><div class="tbl-wrap"><table class="fs-t"><tr><th>Materia</th>' + [0, 1, 2].filter(i => i <= k).map(i => '<th>' + PN[i] + ' P</th>').join('') + '<th>Abajo</th><th>Asist.</th></tr>' + d.mats.map(m => { const pr = [0, 1, 2].filter(i => i <= k).map(i => { const vs = L.map(o => num((o.x.m[m.clave] || { p: [] }).p[i])).filter(v => v != null); return vs.length ? (vs.reduce((s, v) => s + v, 0) / vs.length).toFixed(1) : '—'; });
      const ab = L.filter(o => { const v = (o.x.m[m.clave] || { p: [] }).p[k]; return v === 'NAC' || (typeof v === 'number' && v < TG.minDe(m)); }).length, ps = L.map(o => TG.pct(d, m.clave, k, (o.x.m[m.clave] || { a: [] }).a[k])).filter(v => v != null);
      return '<tr><td style="text-align:left" title="' + esc(m.nombre) + '">' + esc(m.corto) + '</td>' + pr.map(v => '<td>' + v + '</td>').join('') + '<td class="' + (ab ? 'fs-baja' : '') + '">' + ab + '</td><td>' + (ps.length ? Math.round(ps.reduce((s, v) => s + v, 0) / ps.length) + ' %' : '—') + '</td></tr>'; }).join('') + '</table></div>');
    // semáforo
    h += card('<h3>🚦 Todas las materias · ' + (k >= 0 ? PN[k] + ' parcial' : '') + '</h3><div class="tbl-wrap"><table class="fs-t tg-t"><tr><th>#</th><th>Alumno</th>' + d.mats.map(m => '<th title="' + esc(m.nombre) + '">' + esc(m.corto) + '</th>').join('') + '<th>Prom.</th></tr>' +
      L.map(o => '<tr><td>' + o.a.num + '</td><td style="text-align:left"><a href="#/alumno/' + o.a.id + '">' + esc(corto(o.a.nombre)) + '</a></td>' + d.mats.map(m => celda(m, (o.x.m[m.clave] || { p: [] }).p[k])).join('') + '<td><b>' + (o.r.prom == null ? '—' : o.r.prom.toFixed(1)) + '</b></td></tr>').join('') + '</table></div><p class="small muted">Rojo: abajo del mínimo (6 en asignaturas, ' + C.min10() + ' en el módulo). Amarillo: en el límite. La asistencia de la boleta son días con asistencia; el % es contra quien más días asistió en esa materia.</p>');
    return { t: 'Panel del tutor', h: h };
  };
  CH['tg-pdf'] = async el => { const f = el.files && el.files[0]; if (!f) return; const g = D.grupoActual(); u.toast('Leyendo la boleta…', '', 2500);
    try { const filas = await TG.leePDF(new Uint8Array(await f.arrayBuffer())); if (!filas.length) { u.toast('No encontré alumnos en ese PDF. ¿Es la boleta de control escolar?', 'err', 4500); return; }
      const d = TG.guarda(g, filas); u.toast('Listo: ' + d.al.length + ' alumnos, ' + d.al.filter(x => x.aid).length + ' juntados con tu lista', 'ok', 4000); } catch (e) { console.error(e); u.toast('No pude leer el PDF: ' + (e.message || e), 'err', 5000); } };
  CH['tg-map'] = el => { const g = D.grupoActual(); S.update(K(g), d => { const x = (d.al || []).find(y => y.control === el.dataset.c); if (x) x.aid = el.value || null; }, {}); };
  A['tg-wa'] = el => { const g = D.grupoActual(), o = TG.de(g, el.dataset.aid), a = D.alumno(g, el.dataset.aid); if (!o || !a) return; window.open(E.casa.wa(a, TG.msgCasa(g, o.x, o.d)), '_blank'); if (E.familia) E.familia.contacto(g, a.id, 'aviso', 'Boleta de todas las materias (' + PN[o.r.k] + ' parcial)'); };
  A['tg-imp'] = () => { const g = D.grupoActual(), d = TG.doc(g); if (!d) return; const k = TG.ultimo(d), cf = D.cfg(), L = d.al.filter(x => x.aid).map(x => ({ x: x, a: D.alumno(g, x.aid), r: TG.alumno(d, x) })).filter(o => o.a).sort((p, q) => p.a.num - q.a.num);
    E.print.run('<div class="pr fs-pr tg-pr"><h2>Reporte del tutor · ' + esc(g.nombre) + ' · ' + PN[k] + ' parcial</h2><p class="fs-sub">' + esc((cf.plantel || 'CETAC 19') + ' · Tutor: ' + (cf.docente || '') + ' · Boleta cargada el ' + u.fCorta(d.f)) + '</p><table class="fs-t"><tr><th>#</th><th>Alumno</th>' + d.mats.map(m => '<th>' + esc(m.corto) + '</th>').join('') + '<th>Prom.</th><th>Abajo</th></tr>' + L.map(o => '<tr><td>' + o.a.num + '</td><td style="text-align:left">' + esc(o.a.nombre) + '</td>' + d.mats.map(m => celda(m, (o.x.m[m.clave] || { p: [] }).p[k])).join('') + '<td>' + (o.r.prom == null ? '—' : o.r.prom.toFixed(1)) + '</td><td>' + o.r.rep.length + '</td></tr>').join('') + '</table>' +
      '<h3>Atender primero</h3><ul>' + L.filter(o => o.r.nivel !== 'verde').map(o => '<li><b>' + o.a.num + '. ' + esc(o.a.nombre) + ':</b> ' + esc([o.r.rep.length ? 'abajo en ' + o.r.rep.join(', ') : '', o.r.baja.length ? 'bajó ' + o.r.baja.join(', ') : '', o.r.fal.length ? 'asistencia ' + o.r.fal.join(', ') : ''].filter(Boolean).join('; ')) + '</li>').join('') + '</ul></div>', { title: 'Reporte del tutor', landscape: true }); };
  // ficha y tutoría
  if (V.alumno && E.fichaInsert) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), t = g && TG.de(g, id); if (o && t && !/Algo falló/.test(o.h)) { const k = t.r.k;
    o.h = E.fichaInsert(o.h, card('<div class="row between gap wrap"><h3>🎓 Todas sus materias</h3>' + btn('💬 A casa', 'tg-wa', 'data-aid="' + id + '"', 'small') + '</div><div class="tbl-wrap"><table class="fs-t"><tr><th>Materia</th>' + [0, 1, 2].filter(i => i <= Math.max(k, 0)).map(i => '<th>' + PN[i] + '</th>').join('') + '<th>Días con asistencia</th></tr>' + t.d.mats.map(m => { const z = t.x.m[m.clave] || { p: [], a: [] }, pc = TG.pct(t.d, m.clave, k, z.a[k]); return '<tr><td style="text-align:left">' + esc(m.corto) + '</td>' + [0, 1, 2].filter(i => i <= Math.max(k, 0)).map(i => celda(m, z.p[i])).join('') + '<td' + (pc != null && pc < 80 ? ' class="fs-baja"' : '') + '>' + (typeof z.a[k] === 'number' ? z.a[k] + ' d' + (pc != null ? ' · ' + pc + ' %' : '') : '—') + '</td></tr>'; }).join('') + '</table></div>' + (t.r.rep.length ? '<p class="small"><b>Va abajo en:</b> ' + esc(t.r.rep.join(', ')) + '</p>' : '<p class="small">✅ Va aprobando todas sus materias.</p>'))); } return o; }; }
  if (V.tutoria) { const vt = V.tutoria; V.tutoria = function () { const o = vt.apply(null, arguments); if (o && o.h && !/Primero importa|No hay grupo/.test(o.h)) o.h = card('<div class="row between gap wrap"><div><h3>🎓 Panel del tutor</h3><p class="small muted">Todas las materias del grupo desde la boleta de control escolar.</p></div>' + link('Abrir', 'tutorgrupo', 'small primary') + '</div>') + o.h; return o; }; }
})();

/* Escuadra · Portafolio del alumno y constancias de logro (v1.25).
   - Constancias: la app detecta logros (nivel de FreeCAD, proyecto terminado, asistencia perfecta, todas las entregas de un
     parcial, monitor de sus compañeros, submódulo aprobado) y los imprime como reconocimiento del docente, con folio.
   - Portafolio: un documento por alumno para pedir prácticas profesionales o su primer empleo: lo que sabe hacer
     (competencias de los submódulos aprobados), su nivel de FreeCAD, sus proyectos, sus logros y fotos de sus trabajos
     (nunca caras). Junta lo de todos sus semestres contigo (grupos anteriores del cambio de semestre).
   Las calificaciones no salen en el portafolio a menos que lo pidas. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const PO = E.portafolio = {};
  const NIV = { 1: 'Básico', 2: 'Intermedio', 3: 'Avanzado' };
  const KL = g => 'logros:' + g.id;
  const minA = () => Number(D.cfg().minAprob) || 60;
  // calcula con las fechas de parciales de ese grupo (los archivados guardan las suyas)
  const con = (g, fn) => { const cur = D.grupoActual(); if (!cur || cur.id === g.id) return fn(); D.setGrupo(g.id); try { return fn(); } finally { D.setGrupo(cur.id); } };
  PO.grupos = g => [g].concat(E.semestre ? E.semestre.cadena(g) : []);
  // FreeCAD: junta las prácticas de todos sus semestres contigo
  PO.fc = (g0, aid) => {
    if (!E.fc || !E.fc.nivelAlumno) return null; let best = null; const hechas = [];
    PO.grupos(g0).forEach(g => { const r = E.fc.nivelAlumno(g, aid); if (!r.hay) return; hechas.push.apply(hechas, r.hechas); if (!best) best = { n: 0, cnt: { 1: { ok: 0, med: 0 }, 2: { ok: 0, med: 0 }, 3: { ok: 0, med: 0 } } }; [1, 2, 3].forEach(n => { best.cnt[n].ok += r.cnt[n].ok; best.cnt[n].med += r.cnt[n].med; }); best.n = Math.max(best.n, r.n); });
    if (best) { best.hechas = hechas; best.hay = true; } return best;
  };
  const ICO = { fc: '💻', proy: '🧩', asis: '📅', entregas: '📒', monitor: '🤝', sm: '🎓' };

  /* ---------- logros ---------- */
  PO.logros = (g0, a) => {
    const out = [], hoy = u.today();
    PO.grupos(g0).forEach(g => con(g, () => {
      if (!D.alumno(g, a.id)) return;
      D.parciales().forEach(p => {
        const fin = p.fin < hoy, sm = D.submodulo(g, p.id);
        if (fin) {
          const as = C.asis(g, p, a.id); if (as.ses >= 5 && as.f === 0) out.push({ id: 'asis-' + g.id + '-' + p.id, ico: ICO.asis, t: 'Asistencia perfecta · ' + p.nombre + (sm ? ' (' + sm.nombre + ')' : ''), det: as.ses + ' clases sin faltar', g: g });
          if (E.entregas) { const its = E.entregas.items(g, p.id, u.addDays(p.fin, 1)); if (its.length >= 3 && its.every(x => { const s = x.est(a.id); return s.v === 2; })) out.push({ id: 'ent-' + g.id + '-' + p.id, ico: ICO.entregas, t: 'Todas sus entregas completas · ' + p.nombre, det: its.length + ' tareas, trabajos y prácticas', g: g }); }
          const k = C.cal(g, p.id, a.id); if (sm && k.final != null && k.final >= minA() && !k.enCurso) out.push({ id: 'sm-' + g.modulo + '-' + sm.num, ico: ICO.sm, t: 'Aprobó el Submódulo ' + sm.num + ' del Módulo ' + g.modulo + ': ' + u.cap(String(sm.nombre).toLowerCase()), det: (E.PROGRAMA.modulos[g.modulo] || {}).nombre || '', g: g, sm: sm, mod: g.modulo, cal: k.final });
        }
      });
      if (E.proyecto) E.proyecto.parciales(g).forEach(p => { const def = E.proyecto.ETAPAS[E.clases.smKey(g, p.id)], doc = E.proyecto.doc(g, p.id); (doc.equipos || []).filter(eq => (eq.al || []).indexOf(a.id) >= 0).forEach(eq => { const st = E.proyecto.estado(g, p.id, eq, hoy); if (st.total && st.listas === st.total) out.push({ id: 'proy-' + g.id + '-' + p.id, ico: ICO.proy, t: 'Proyecto terminado: ' + (def ? def.nombre : 'proyecto del submódulo'), det: (/^equipo/i.test(eq.nombre) ? '' : 'Equipo ') + eq.nombre + ' · ' + st.total + ' etapas', g: g, proy: def, eq: eq }); }); });
    }));
    const fc = PO.fc(g0, a.id); if (fc) for (let n = 1; n <= fc.n; n++) out.unshift({ id: 'fc' + n, ico: ICO.fc, t: 'Modelado 3D en FreeCAD · Nivel ' + n + ' (' + NIV[n] + ')', det: fc.cnt[n].ok + (fc.cnt[n].ok === 1 ? ' práctica completa' : ' prácticas completas') + ' de nivel ' + n, g: g0 });
    if (E.monitores) { const v = PO.grupos(g0).reduce((s, x) => s + (E.monitores.historial(x).veces[a.id] || 0), 0); if (v >= 3) out.push({ id: 'monitor', ico: ICO.monitor, t: 'Monitor de sus compañeros', det: 'Apoyó a sus compañeros en el centro de cómputo ' + v + ' veces', g: g0 }); }
    const vistos = {}; return out.filter(x => !vistos[x.id] && (vistos[x.id] = 1));
  };
  PO.entregadas = g => S.get(KL(g)) || {};

  /* ---------- constancia (impresión) ---------- */
  const folio = (g, a, l) => (g.id + '-' + a.num + '-' + l.id).toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 30);
  const constancia = (g, a, l) => { const cf = D.cfg(); return '<div class="pr cn-pr"><div class="cn-in">' + E.logo() + '<p class="cn-k">' + esc(cf.plantel || '') + ' · ' + esc(g.carrera || '') + '</p><h1>Constancia de logro</h1><p>Se otorga a</p><h2>' + esc(a.nombre) + '</h2><p>del grupo ' + esc(g.nombre) + ', por</p><h3>' + esc(l.t) + '</h3><p class="cn-det">' + esc(l.det || '') + '</p><p class="cn-f">' + esc(u.cap(u.fLargaA(u.today()))) + '</p><div class="cn-firma"><span>' + esc(cf.docente || 'Docente') + '<br><small>Docente del módulo</small></span></div><p class="cn-folio">Folio ' + esc(folio(g, a, l)) + ' · Reconocimiento del docente, no sustituye documentos oficiales.</p></div></div>'; };
  const marcar = (g, pares) => S.update(KL(g), d => { pares.forEach(x => { (d[x.a.id] = d[x.a.id] || {})[x.l.id] = u.today(); }); }, {});
  A['cn-print'] = el => { const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid), l = a && PO.logros(g, a).find(x => x.id === el.dataset.l); if (!l) return; marcar(g, [{ a: a, l: l }]); E.print.run(constancia(g, a, l), { title: 'Constancia · ' + a.nombre, landscape: true, margin: '0' }); };
  A['cn-nuevas'] = () => {
    const g = D.grupoActual(), en = PO.entregadas(g), pares = []; D.alumnos(g).forEach(a => PO.logros(g, a).forEach(l => { if (!(en[a.id] || {})[l.id]) pares.push({ a: a, l: l }); }));
    if (!pares.length) { u.toast('No hay constancias nuevas', 'ok'); return; } marcar(g, pares);
    E.print.run(pares.map(x => constancia(g, x.a, x.l)).join(''), { title: 'Constancias · ' + g.nombre, landscape: true, margin: '0' });
  };
  V.constancias = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Constancias');
    const en = PO.entregadas(g), L = al.map(a => ({ a: a, l: PO.logros(g, a) })), nuevas = L.reduce((s, x) => s + x.l.filter(l => !(en[x.a.id] || {})[l.id]).length, 0), por = {};
    L.forEach(x => x.l.forEach(l => { const k = l.id.replace(/-.*$/, '').replace(/\d$/, '') + '|' + l.t; (por[k] = por[k] || { t: l.t, ico: l.ico, xs: [] }).xs.push({ a: x.a, l: l }); }));
    let h = card('<h3>🏅 Constancias de logro</h3><p class="muted small">La app detecta los logros con lo que ya registras. Entregarlas en público (o en privado al que le cuesta) reconoce el esfuerzo con algo concreto. Son un reconocimiento tuyo, con folio; no sustituyen documentos oficiales.</p>' +
      '<div class="en-kpis"><div><b>' + L.reduce((s, x) => s + x.l.length, 0) + '</b><span>logros</span></div><div class="' + (nuevas ? 'warn' : 'ok') + '"><b>' + nuevas + '</b><span>por entregar</span></div><div><b>' + L.filter(x => x.l.length).length + '</b><span>alumnos con logros</span></div><div><b>' + L.filter(x => !x.l.length).length + '</b><span>sin logros aún</span></div></div>' +
      (nuevas ? btn('🖨 Imprimir las ' + nuevas + ' nuevas', 'cn-nuevas', '', 'primary') : ''));
    const ks = Object.keys(por); if (!ks.length) h += card('<p class="small">Todavía no hay logros: aparecen al revisar prácticas de FreeCAD, terminar etapas del proyecto, cerrar un parcial con asistencia perfecta o todas las entregas, y al usar monitores.</p>');
    ks.forEach(k => { const x = por[k]; h += card('<h3>' + x.ico + ' ' + esc(x.t) + ' <span class="chip">' + x.xs.length + '</span></h3><ul class="sg-l">' + x.xs.map(y => { const f = (en[y.a.id] || {})[y.l.id]; return '<li><span><b>' + y.a.num + '.</b> ' + esc(y.a.nombre) + '<br><small class="muted">' + esc(y.l.det || '') + '</small></span>' + btn(f ? '✓ ' + u.fCorta(f) + ' · otra vez' : '🖨 Imprimir', 'cn-print', 'data-aid="' + y.a.id + '" data-l="' + esc(y.l.id) + '"', 'small' + (f ? ' ghost' : '')) + '</li>'; }).join('') + '</ul>'); });
    return { t: 'Constancias', h: h };
  };

  /* ---------- portafolio ---------- */
  const fotosDe = (g, aid) => PO.grupos(g).reduce((acc, x) => acc.concat((((S.get('evid:' + x.id) || {}).items) || []).filter(it => it && !it.borrada && (it.aids || []).indexOf(aid) >= 0).map(it => Object.assign({ gid: x.id }, it))), []).sort((a, b) => String(b.t || '').localeCompare(String(a.t || '')));
  PO.html = async (g, a, opt) => {
    opt = opt || {}; const cf = D.cfg(), ls = PO.logros(g, a), sms = ls.filter(l => l.sm), proys = ls.filter(l => l.proy), otros = ls.filter(l => !l.sm && !l.proy);
    const fc = PO.fc(g, a.id), pf = E.perfil ? E.perfil.calc(g, a) : null;
    const fotos = []; for (const it of fotosDe(g, a.id).slice(0, 6)) { try { const x = E.evid ? await E.evid.url(it, false) : null; if (x) { await new Promise(res => { const im = new Image(); im.onload = im.onerror = res; im.src = x; setTimeout(res, 4000); }); const ac = it.act ? S.get('act:' + it.gid + ':' + it.act) : null; fotos.push({ u: x, t: it.nota || (ac ? ac.nombre : ''), f: it.f }); } } catch (e) { } }
    const sem = PO.grupos(g).map(x => x.semestre + 'º (' + x.nombre + ')').reverse().join(', ');
    return '<div class="pr po-pr"><div class="po-head">' + E.logo() + '<div><h1>' + esc(a.nombre) + '</h1><p>' + esc(g.carrera ? u.cap(String(g.carrera).toLowerCase().replace(/\s+\d{4}$/, '').replace('mecatronica', 'mecatrónica')) : 'Técnico en Mecatrónica') + ' · ' + esc(cf.plantel || '') + '</p><p class="tiny">Semestres cursados en el módulo: ' + esc(sem) + ' · Portafolio al ' + u.fFecha(u.today()) + '</p></div></div>' +
      '<h2>Lo que sé hacer</h2>' + (sms.length ? sms.map(l => '<h3>' + esc('Módulo ' + l.mod + ' · ' + u.cap(String(l.sm.nombre).toLowerCase())) + (opt.cal && l.cal != null ? ' <span class="tiny">(' + l.cal + ')</span>' : '') + '</h3><ul>' + (l.sm.ac || []).map(x => '<li>' + esc(x.titulo) + '</li>').join('') + '</ul>').join('') : '<p>Está cursando su primer submódulo conmigo.</p>') +
      (fc && fc.hay ? '<h2>Diseño en computadora (FreeCAD)</h2><p><b>Nivel ' + (fc.n || 0) + (fc.n ? ' · ' + NIV[fc.n] : ' · en formación') + '.</b> Prácticas completas: ' + fc.hechas.filter(x => x.v === 2).map(x => esc(x.p.t)).join(', ') + '.</p>' : '') +
      (proys.length ? '<h2>Proyectos</h2><ul>' + proys.map(l => '<li><b>' + esc(l.proy.nombre) + '</b> · ' + esc(l.det) + ' (' + l.proy.et.map(e => e[1].toLowerCase()).join(', ') + ')</li>').join('') + '</ul>' : '') +
      (pf && pf.fort.length ? '<h2>Fortalezas</h2><ul>' + pf.fort.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') +
      (otros.length ? '<h2>Logros</h2><ul>' + otros.map(l => '<li>' + l.ico + ' ' + esc(l.t) + (l.det ? ' · <span class="tiny">' + esc(l.det) + '</span>' : '') + '</li>').join('') + '</ul>' : '') +
      (fotos.length ? '<h2>Muestras de mi trabajo</h2><div class="po-fotos">' + fotos.map(x => '<figure><img src="' + x.u + '" alt=""><figcaption>' + esc(x.t || '') + (x.f ? ' · ' + u.fCorta(x.f) : '') + '</figcaption></figure>').join('') + '</div>' : '') +
      '<div class="po-pie"><div class="cn-firma"><span>' + esc(cf.docente || 'Docente') + '<br><small>Docente del módulo · ' + esc(cf.plantel || '') + '</small></span></div><p class="tiny">Elaborado con los registros del docente. Las fotos muestran trabajos, no personas.</p></div></div>';
  };
  A['po-print'] = async el => { const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid); if (!a) return; u.toast('Preparando el portafolio…', 'ok', 1500); const cal = !!(document.getElementById('po-cal') || {}).checked; E.print.run(await PO.html(g, a, { cal: cal }), { title: 'Portafolio · ' + a.nombre, margin: '12mm' }); };
  A['po-todos'] = async () => { const g = D.grupoActual(); u.toast('Preparando ' + D.alumnos(g).length + ' portafolios…', 'ok', 2500); const hs = []; for (const a of D.alumnos(g)) hs.push(await PO.html(g, a, {})); E.print.run(hs.join('<div style="page-break-after:always"></div>'), { title: 'Portafolios · ' + g.nombre, margin: '12mm' }); };

  /* ---------- en la ficha y en Imprimir ---------- */
  PO.alumnoHTML = (g, a) => {
    const ls = PO.logros(g, a), en = (PO.entregadas(g)[a.id]) || {};
    return card('<h3>🎒 Portafolio y logros</h3><p class="muted small">Para pedir prácticas profesionales o su primer empleo: lo que sabe hacer, FreeCAD, proyectos, logros y fotos de sus trabajos.</p>' +
      (ls.length ? '<ul class="po-l">' + ls.map(l => '<li><span>' + l.ico + ' ' + esc(l.t) + '</span>' + btn(en[l.id] ? '✓ ' + u.fCorta(en[l.id]) : '🏅 Constancia', 'cn-print', 'data-aid="' + a.id + '" data-l="' + esc(l.id) + '"', 'small' + (en[l.id] ? ' ghost' : '')) + '</li>').join('') + '</ul>' : '<p class="small muted">Aún sin logros registrados.</p>') +
      '<label class="switch sm"><input type="checkbox" id="po-cal"><span>Incluir calificaciones de los submódulos</span></label><div class="row gap wrap mt">' + btn('🎒 Imprimir portafolio', 'po-print', 'data-aid="' + a.id + '"', 'small primary') + '</div>');
  };
  if (V.alumno) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) { const x = PO.alumnoHTML(g, a); o.h = E.fichaInsert ? E.fichaInsert(o.h, x) : o.h + x; } return o; }; }
  if (V.imprimir) { const vi = V.imprimir; V.imprimir = function () { const o = vi.apply(null, arguments), g = D.grupoActual(); if (o && g && D.alumnos(g).length && !/Algo falló/.test(o.h)) o.h += card('<h3>🎒 Portafolios y constancias</h3><p class="muted small">Un portafolio por alumno (sin calificaciones) y las constancias de logro pendientes de entregar.</p><div class="row gap wrap">' + btn('🖨 Portafolios del grupo', 'po-todos', '', 'primary') + link('🏅 Constancias', 'constancias', '') + '</div>'); return o; }; }
})();

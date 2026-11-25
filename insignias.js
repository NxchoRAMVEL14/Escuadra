/* Escuadra · v1.46.0 · Paquete 3 (alumnos)
   16) Insignias: logros pequeños que la app detecta sola (asistencia perfecta, racha sin faltar, todo entregado, subió 2
       puntos, 10 en un examen, explicó a compañeros, buenas preguntas, cuidó la seguridad, días excelentes, repasos para
       casa, monitor, FreeCAD y proyecto terminado). Se celebran las nuevas de la semana (para proyectar), sin ranking:
       cada quien ve las suyas. Reconocer el esfuerzo concreto motiva más que comparar (Dweck, 2006).
   15) Portal del alumno: la consulta (enlace o QR por alumno) ahora también trae su semestre (cómo terminaría), lo que viene
       (entregas y exámenes de las próximas 3 semanas) y sus insignias. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const IG = E.insig = {}, K = g => 'insig:' + g.id;
  const corto = n => (u.corto ? u.corto(n) : n);
  IG.CAT = [
    ['asis', '🎯', 'Asistencia perfecta', 'Un parcial completo sin faltar'],
    ['racha', '🔥', 'Racha de 10', '10 clases seguidas sin faltar'],
    ['ent', '📦', 'Todo entregado', 'Todas sus entregas de un parcial'],
    ['sube', '📈', 'Subió 2 puntos', 'De un parcial al siguiente'],
    ['diez', '🏆', '10 en un examen', 'Sacó 10 en un examen'],
    ['explica', '🤝', 'Explica a sus compañeros', 'Lo viste explicar 2 veces o más'],
    ['pregunta', '❓', 'Buenas preguntas', 'Hizo 2 buenas preguntas o más'],
    ['seguro', '🦺', 'Seguridad primero', 'Cuidó la seguridad 2 veces o más'],
    ['excelente', '⭐', 'Días excelentes', '3 días excelentes en clase'],
    ['repaso', '🧠', 'Repasa en casa', 'Hizo 3 repasos para casa'],
    ['monitor', '🧑‍🏫', 'Monitor', 'Apoyó a sus compañeros 3 veces'],
    ['fc', '🧊', 'FreeCAD', 'Prácticas de FreeCAD completas por nivel'],
    ['proy', '🛠️', 'Proyecto terminado', 'Su equipo cerró todas las etapas']
  ];
  const CAT = {}; IG.CAT.forEach(c => { CAT[c[0]] = c; });
  const obsCuenta = (g, aid) => { const n = {}; S.keys('obs:' + g.id + ':').forEach(k => ((S.get(k) || {})[aid] || []).forEach(id => { n[id] = (n[id] || 0) + 1; })); return n; };
  // racha actual: clases registradas desde su última falta
  const racha = (g, aid) => {
    const hoy = u.today(), ps = D.parciales().filter(p => p.inicio <= hoy); let fs = [], ff = [];
    ps.forEach(p => { fs = fs.concat(C.fechasRegistradas(g, p)); ff = ff.concat(C.asis(g, p, aid).fechasF); });
    const ult = ff.sort().slice(-1)[0] || ''; return fs.filter(f => f > ult && f <= hoy).length;
  };
  // lista de insignias ganadas: [{ id, cat, t (detalle) }]
  IG.de = (g, a) => {
    const out = [], hoy = u.today(), add = (id, cat, t) => { if (!out.some(x => x.id === id)) out.push({ id: id, cat: cat, t: t }); };
    const ps = D.parciales();
    ps.forEach((p, i) => {
      if (hoy > p.fin) { const as = C.asis(g, p, a.id); if (as.ses >= 5 && as.f === 0) add('asis-' + p.id, 'asis', p.nombre); }
      if (i > 0 && hoy >= p.inicio) { const x = C.cal(g, ps[i - 1].id, a.id).final, y = C.cal(g, p.id, a.id).final; if (x != null && y != null && C.oficial(y) - C.oficial(x) >= 2) add('sube-' + p.id, 'sube', C.oficial(x) + ' → ' + C.oficial(y) + ' en el ' + p.nombre); }
      if (hoy >= p.inicio) C.acts(g, p.id).filter(x => x.categoria === 'examen' || x.examen).forEach(x => { const v = C.nota(x, a.id); if (v != null && C.oficial(v) === 10) add('diez-' + x.id, 'diez', x.nombre); });
    });
    if (racha(g, a.id) >= 10) add('racha', 'racha', 'Lleva ' + racha(g, a.id) + ' clases seguidas');
    const ob = obsCuenta(g, a.id);
    if ((ob.explico || 0) >= 2) add('explica', 'explica', ob.explico + ' veces'); if ((ob.pregunta || 0) >= 2) add('pregunta', 'pregunta', ob.pregunta + ' veces');
    if ((ob.seguro || 0) >= 2) add('seguro', 'seguro', ob.seguro + ' veces'); if ((ob.excelente || 0) >= 3) add('excelente', 'excelente', ob.excelente + ' días');
    if (E.casa && E.casa.resultados) { const n = E.casa.resultados(g, a.id).length; if (n >= 3) add('repaso', 'repaso', n + ' repasos'); }
    // de las constancias: entregas, monitor, FreeCAD y proyecto (solo de este grupo)
    if (E.portafolio && E.portafolio.logros) { try { E.portafolio.logros(g, a).forEach(l => {
      if (/^ent-/.test(l.id) && l.g === g) add('ent-' + l.id.split('-').pop(), 'ent', l.t.split('· ')[1] || '');
      else if (l.id === 'monitor') add('monitor', 'monitor', l.det || '');
      else if (/^fc\d$/.test(l.id)) add(l.id, 'fc', 'Nivel ' + l.id.slice(2));
      else if (/^proy|^pj/.test(l.id)) add(l.id, 'proy', l.t);
    }); } catch (e) { } }
    return out;
  };
  // fecha en que la vio la app por primera vez (para «nuevas esta semana»)
  IG.marca = g => {
    const hoy = u.today(), doc = S.get(K(g)) || {}, L = D.alumnos(g).map(a => ({ a: a, ins: IG.de(g, a) })); let cambia = false;
    L.forEach(x => { const m = doc[x.a.id] || {}; x.ins.forEach(i => { if (!m[i.id]) { cambia = true; } i.f = m[i.id] || hoy; }); });
    if (cambia) { const d = u.clone(doc); L.forEach(x => { const m = d[x.a.id] = d[x.a.id] || {}; x.ins.forEach(i => { if (!m[i.id]) m[i.id] = hoy; }); }); S.put(K(g), d, { silent: true }); }
    return L;
  };
  const pill = i => '<span class="ig-p" title="' + esc(CAT[i.cat][3] + (i.t ? ' · ' + i.t : '')) + '">' + CAT[i.cat][1] + ' ' + esc(CAT[i.cat][2]) + (i.t && i.cat !== 'explica' && i.cat !== 'pregunta' && i.cat !== 'seguro' ? ' <small>' + esc(i.t) + '</small>' : '') + '</span>';
  V.insignias = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Insignias');
    const L = IG.marca(g), desde = u.addDays(u.today(), -7), nuevas = [];
    L.forEach(x => x.ins.filter(i => i.f >= desde).forEach(i => nuevas.push({ a: x.a, i: i })));
    let h = card('<h3>🏅 Insignias</h3><p class="small">La app las detecta sola con lo que ya capturas (asistencia, entregas, calificaciones, observaciones, repasos, monitores, FreeCAD y proyecto). No hay ranking: cada alumno ve las suyas en su ficha y en su portal. Reconocer el esfuerzo concreto motiva más que comparar.</p>');
    h += card('<div class="row between gap wrap"><h3>🎉 Nuevas esta semana (' + nuevas.length + ')</h3>' + (nuevas.length ? btn('📽 Proyectar', 'ig-proj', '', 'small primary') : '') + '</div>' + (nuevas.length ? '<ul class="plain ig-l">' + nuevas.map(x => '<li><a href="#/alumno/' + x.a.id + '">' + esc(corto(x.a.nombre)) + '</a> ' + pill(x.i) + '</li>').join('') + '</ul>' : '<p class="muted small">Ninguna nueva en los últimos 7 días.</p>'));
    h += card('<h3>👥 Por alumno</h3><ul class="plain ig-l">' + L.map(x => '<li><a href="#/alumno/' + x.a.id + '">' + x.a.num + '. ' + esc(corto(x.a.nombre)) + '</a> ' + (x.ins.length ? x.ins.map(i => '<span title="' + esc(CAT[i.cat][2] + (i.t ? ' · ' + i.t : '')) + '">' + CAT[i.cat][1] + '</span>').join(' ') : '<span class="muted small">todavía ninguna</span>') + '</li>').join('') + '</ul>');
    h += card('<h3>📖 Cómo se ganan</h3><ul class="plain ig-cat">' + IG.CAT.map(c => '<li><span>' + c[1] + '</span><div><b>' + esc(c[2]) + '</b><small>' + esc(c[3]) + '</small></div></li>').join('') + '</ul>');
    return { t: 'Insignias', h: h };
  };
  A['ig-proj'] = () => {
    const g = D.grupoActual(); if (!g || !E.proj) return; const desde = u.addDays(u.today(), -7), por = {};
    IG.marca(g).forEach(x => x.ins.filter(i => i.f >= desde).forEach(i => { (por[i.cat] = por[i.cat] || []).push(corto(x.a.nombre).split(' ')[0]); }));
    const sl = [{ k: 'cover', h: '🎉 Insignias de la semana', s: 'Lo lograron con su esfuerzo' }].concat(Object.keys(por).map(c => ({ k: 'html', h: CAT[c][1] + ' ' + CAT[c][2], html: '<p style="font-size:1.3em">' + esc(CAT[c][3]) + '</p><p style="font-size:2em;font-weight:800">' + por[c].map(esc).join(' · ') + '</p>' })));
    E.proj.abrir({ id: 'insignias', titulo: 'Insignias de la semana' }, sl);
  };
  // ficha
  if (V.alumno && E.fichaInsert) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) { const ins = IG.de(g, a); o.h = E.fichaInsert(o.h, card('<div class="row between gap wrap"><h3>🏅 Insignias (' + ins.length + ')</h3>' + link('Ver todas', 'insignias', 'small') + '</div>' + (ins.length ? '<div class="ig-ps">' + ins.map(pill).join('') + '</div>' : '<p class="muted small">Todavía ninguna. ' + esc(IG.CAT.slice(0, 3).map(c => c[1] + ' ' + c[2]).join(' · ')) + '…</p>'))); } return o; }; }

  /* ---------- 15 · portal del alumno (la consulta trae más) ---------- */
  IG.proximas = (g, hoy) => {
    hoy = hoy || u.today(); const hasta = u.addDays(hoy, 21), out = [];
    D.parciales().forEach(p => C.acts(g, p.id).forEach(x => { if (x.fecha && x.fecha > hoy && x.fecha <= hasta) out.push([x.fecha, (x.categoria === 'examen' || x.examen ? 'Examen: ' : 'Entrega: ') + x.nombre]); }));
    if (E.examen && E.examen.list) E.examen.list(g).forEach(ex => { if (ex.fecha && ex.fecha > hoy && ex.fecha <= hasta && !out.some(o => o[0] === ex.fecha && o[1].indexOf(ex.titulo) >= 0)) out.push([ex.fecha, 'Examen: ' + ex.titulo]); });
    return out.sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(0, 6);
  };
  if (E.casa && E.casa.consultaDatos) { const cd = E.casa.consultaDatos; E.casa.consultaDatos = function (g, a) { const d = cd.apply(null, arguments); try {
    if (E.seguir) { const pr = E.seguir.pred(g, a.id); d.se = pr.v.map(c => [c.p.nombre, c.of, c.curso ? 1 : 0]); d.st = pr.t; d.sk = pr.est; }
    d.in = IG.de(g, a).map(i => [CAT[i.cat][1], CAT[i.cat][2], i.t || '']).slice(0, 12);
    d.px = IG.proximas(g).map(x => [u.fCorta(x[0]), x[1].slice(0, 90)]);
  } catch (e) { } return d; }; }
})();

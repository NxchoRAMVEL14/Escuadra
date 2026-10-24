/* Escuadra · v1.24: Inicio compacto («Hoy en 3»), cerrar la semana de un jalón y pre-cierre de captura.
   - Hoy en 3: arriba de Inicio solo tu clase, lo más urgente y a quién atender hoy (rota entre los que van mal);
     lo demás queda plegado. Se cambia en Ajustes → Novedades.
   - Cerrar semana: los días sin cerrar con valores por omisión (como se planeó; todos presentes si no pasaste lista)
     y solo corriges las excepciones.
   - Pre-cierre: desde 7 días antes de la captura, la lista exacta de lo que falta para que el acta salga completa. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const ahora = () => { const d = new Date(); return u.pad(d.getHours()) + ':' + u.pad(d.getMinutes()); };
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

  /* =================== pre-cierre de captura =================== */
  const PC = E.precierre = {};
  PC.estado = (g, p) => {
    const hoy = u.today(), al = D.alumnos(g), N = al.length, out = [], hasta = hoy < p.fin ? hoy : p.fin, c = D.cfg();
    const add = (ok, t, det, to, nivel) => out.push({ ok: ok, t: t, det: det || '', to: to || '', nivel: ok ? 'ok' : (nivel || 'warn') });
    const man = D.manual(g, p.id);
    if (man.activo) { const sin = al.filter(a => { const r = (man.alumnos || {})[a.id]; return !r || r.cal === '' || r.cal == null; }).length; add(!sin, sin ? sin + ' alumnos sin calificación en la captura manual' : 'Captura manual completa', 'Este parcial lo calificó otro docente.', 'calificaciones/' + p.id, sin ? 'bad' : 'ok'); return { items: out, faltan: out.filter(x => !x.ok).length }; }
    // 1) listas
    const sinLista = [];
    C.clases(g, p).forEach(x => { if (x.fecha > hasta || (x.fecha === hoy && hoy <= p.fin && C.bloquesDia(g, hoy).map(b => b.fin).sort().slice(-1)[0] > ahora()) || S.get('asis:' + g.id + ':' + x.fecha)) return; let d = null; try { d = E.clases.dia(g, x.fecha); } catch (e) { } if (d && d.bloques.length && d.bloques.every(b => b.perdida)) return; sinLista.push(x.fecha); });
    add(!sinLista.length, sinLista.length ? sinLista.length + (sinLista.length === 1 ? ' día sin lista' : ' días sin lista') : 'Todas las listas pasadas', sinLista.length ? sinLista.slice(0, 6).map(f => u.fCorta(f)).join(' · ') + (sinLista.length > 6 ? '…' : '') + ' · si no hubo clase, márcalo en el guion como «No se dio»' : '', sinLista.length ? 'lista/' + sinLista[0] : '', sinLista.length ? 'bad' : 'ok');
    // 2) actividades que cuentan con calificaciones vacías
    const acts = C.acts(g, p.id).filter(a => (a.categoria === 'examen' || a.categoria === 'trabajos') && a.cuenta !== false && (!a.fecha || a.fecha <= hasta || hoy > p.fin));
    const vac = acts.map(a => ({ a: a, f: N - C.actStats(a, al).capturadas })).filter(x => x.f > 0);
    add(!vac.length, vac.length ? vac.length + (vac.length === 1 ? ' actividad con calificaciones vacías' : ' actividades con calificaciones vacías') : 'Todas las actividades calificadas', vac.slice(0, 5).map(x => x.a.nombre + ' (' + x.f + ')').join(' · ') + (vac.length > 5 ? '…' : '') + (vac.some(x => C.sinCal(x.a)) ? ' · las del guion sin ninguna calificación aún no cuentan: califícalas o bórralas si no las vas a pedir' : '') + (c.vaciasCero && vac.some(x => !C.sinCal(x.a)) ? ' · en las demás, lo vacío cuenta como 0' : ''), vac.length ? 'actividad/' + vac[0].a.id : '');
    // 3) examen del parcial
    const hayEx = C.acts(g, p.id).some(a => a.categoria === 'examen' && a.cuenta !== false && C.actStats(a, al).capturadas > 0);
    const fx = E.examen && E.examen.fechaExamen ? E.examen.fechaExamen(g, p.id).f : p.fin;
    add(hayEx, hayEx ? 'Examen capturado' : fx > hoy ? 'El examen es el ' + u.fLarga(fx) : 'Falta capturar el examen del parcial', hayEx ? '' : 'Vale ' + c.pond.examen + ' % de la calificación.', hayEx ? '' : 'examen', hayEx ? 'ok' : fx > hoy ? 'info' : 'bad');
    // 4) libreta y FreeCAD (lo que ya se tenía que revisar)
    if (E.libreta) {
      let T = null; try { T = E.libreta.tareas(g, p.id); } catch (e) { }
      if (T && T.cuentan.length) {
        const doc = E.libreta.doc(g, p.id), mk = doc.marcas || {}, sinRev = T.cuentan.filter(t => t.f <= hasta && !al.some(a => (mk[a.id] || {})[t.key] != null));
        if (!doc.actId) add(false, 'La libreta aún no entra a Calificaciones', 'Crea la actividad de libreta para que cuente en Libreta/Proyecto/Bitácora.', 'libreta/' + p.id, 'bad');
        add(!sinRev.length, sinRev.length ? sinRev.length + (sinRev.length === 1 ? ' tarea sin revisar' : ' tareas sin revisar') : 'Tareas de libreta revisadas', sinRev.slice(0, 4).map(t => corto(t.t, 50)).join(' · '), 'libreta/' + p.id);
      }
    }
    if (E.pend) { const fc = E.pend.lista(g, hoy).filter(x => x.tipo === 'fc' && x.k.indexOf('@' + p.id + '@') > 0); if (fc.length) add(false, fc.length + (fc.length === 1 ? ' práctica de FreeCAD sin revisar' : ' prácticas de FreeCAD sin revisar'), fc.slice(0, 3).map(x => x.t).join(' · '), fc[0].to); }
    // 5) participación
    const pr = C.partRegistrada(g, p); add(pr, pr ? 'Participación registrada' : 'Sin participación registrada', pr ? '' : 'Sin registros, ese ' + c.pond.participacion + ' % no cuenta y la calificación se calcula sin él.', pr ? '' : 'lista', pr ? 'ok' : 'warn');
    // 6) alumnos sin calificación o en curso
    const sinCal = al.filter(a => C.cal(g, p.id, a.id).final == null), curso = al.filter(a => { const k = C.cal(g, p.id, a.id); return k.final != null && k.enCurso; });
    add(!sinCal.length && !curso.length, sinCal.length ? sinCal.length + ' alumnos sin calificación' : curso.length ? curso.length + ' alumnos con calificación en curso' : 'Todos tienen calificación completa', sinCal.length ? sinCal.slice(0, 5).map(a => a.num + '. ' + u.corto(a.nombre)).join(' · ') : curso.length ? 'Les falta algún rubro (examen, trabajos, asistencia o participación).' : '', 'calificaciones/' + p.id, sinCal.length ? 'bad' : 'warn');
    return { items: out, faltan: out.filter(x => !x.ok && x.nivel !== 'info').length };
  };
  V.precierre = pid => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Pre-cierre');
    const ps = D.parciales(), hoy = u.today(); pid = ps.some(p => p.id === pid) ? pid : (ps.filter(p => p.inicio <= hoy && p.captura >= hoy)[0] || C.parcialActual()).id;
    const p = C.parcial(pid), st = PC.estado(g, p), dc = u.diffDays(hoy, p.captura);
    let h = '<div class="filters">' + ps.map(x => '<a class="tab ' + (x.id === pid ? 'on' : '') + '" href="#/precierre/' + x.id + '">' + esc(x.nombre) + '</a>').join('') + '</div>';
    h += card('<div class="deadline ' + (dc <= 3 ? 'bad' : dc <= 7 ? 'warn' : 'ok') + '"><div class="big">' + (dc < 0 ? '✓' : dc === 0 ? '¡Hoy!' : dc) + '</div><div><div class="kicker">' + (dc < 0 ? 'Ya pasó la captura' : dc === 0 ? 'Hoy capturas' : (dc === 1 ? 'día para' : 'días para') + ' capturar') + '</div><h3>Pre-cierre · ' + esc(p.nombre) + '</h3><p class="muted small">Captura el ' + u.fLarga(p.captura) + '. ' + (st.faltan ? 'Te ' + (st.faltan === 1 ? 'falta 1 cosa' : 'faltan ' + st.faltan + ' cosas') + ' para que el acta salga completa.' : 'Todo listo para el acta. 🎉') + '</p></div></div>');
    h += card('<h3>✅ Lista para el acta</h3><ul class="pc-l">' + st.items.map(x => '<li class="' + x.nivel + '"><span class="pc-i">' + (x.ok ? '✓' : x.nivel === 'info' ? 'ℹ' : '!') + '</span><div><b>' + (x.to && !x.ok ? '<a href="#/' + x.to + '">' + esc(x.t) + '</a>' : esc(x.t)) + '</b>' + (x.det ? '<small class="muted">' + esc(x.det) + '</small>' : '') + '</div></li>').join('') + '</ul>' +
      '<div class="row gap wrap mt">' + btn(icon('copy') + ' Copiar para el acta', 'acta-copy', '', st.faltan ? '' : 'primary') + btn(icon('download') + ' Descargar acta (.xlsx)', 'acta-xlsx', '', 'small') + link('📣 Entregas', 'entregas/' + pid, 'small ghost') + link('📥 Pendientes', 'pendientes', 'small ghost') + '</div>' +
      '<p class="muted small">El acta lleva la calificación de los 3 parciales; lo que falte aquí sale como vacío o en curso.</p>');
    return { t: 'Pre-cierre', h: h };
  };
  PC.inicioHTML = (g, hoy) => {
    if (!D.alumnos(g).length) return '';
    const p = D.parciales().filter(x => x.inicio <= hoy && x.captura >= hoy && u.diffDays(hoy, x.captura) <= 7)[0]; if (!p) return '';
    const st = PC.estado(g, p), dc = u.diffDays(hoy, p.captura);
    return card('<div class="row between gap wrap"><h3>✅ Pre-cierre del ' + esc(p.nombre) + '</h3>' + link('Ver lista ›', 'precierre/' + p.id, 'small' + (st.faltan ? ' primary' : '')) + '</div><p class="small">' + (dc === 0 ? 'Hoy capturas.' : 'Capturas en ' + dc + (dc === 1 ? ' día' : ' días') + ' (' + u.fCorta(p.captura) + ').') + ' ' + (st.faltan ? 'Faltan <b>' + st.faltan + '</b> cosas para el acta: ' + esc(st.items.filter(x => !x.ok && x.nivel !== 'info').slice(0, 2).map(x => x.t.toLowerCase()).join(', ')) + '.' : 'Todo listo para el acta. 🎉') + '</p>', st.faltan && dc <= 3 ? 'accent' : '');
  };

  /* =================== cerrar la semana de un jalón =================== */
  V.cerrarsemana = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Cerrar semana');
    const hoy = u.today(), P = E.cierre ? E.cierre.pendientes(g, hoy) : [];
    let h = card('<h3>📝 Cerrar varios días</h3><p class="muted small">Cierra de un jalón los días que se quedaron abiertos. Por omisión: la clase se dio como se planeó y, si no pasaste lista, todos presentes. <b>Desmarca «Todos presentes» si alguien faltó</b> y pasa esa lista aparte. Para tarea, participación o destacados de un día, abre su cierre completo.</p>');
    if (!P.length) return { t: 'Cerrar semana', h: h + card('<p class="note ok">🎉 No tienes días sin cerrar.</p>' + link('Ir a Inicio', 'inicio', 'primary')) };
    h += card('<ul class="cs-l">' + P.map(f => {
      const asis = S.get('asis:' + g.id + ':' + f), pres = asis ? al.filter(a => ['A', 'R'].indexOf(asis[a.id] || 'A') >= 0).length : null; let d = null; try { d = E.clases.dia(g, f); } catch (e) { }
      const txt = d ? d.bloques.map(b => b.inicio + ' ' + (b.perdida ? 'sin clase' : b.parts.map(x => x.it.t).join(' + ') || 'libre')).join(' · ') : '';
      return '<li><div><b>' + u.cap(u.fLarga(f)) + '</b><small class="muted">' + esc(corto(txt, 160)) + '</small></div><div class="cs-o">' +
        (asis ? '<span class="chip ok">✓ Lista: ' + pres + ' presentes</span>' : '<label class="switch sm"><input type="checkbox" id="cs-tp-' + f + '" checked><span>Todos presentes</span></label>' + link('Pasar lista', 'lista/' + f, 'small ghost')) +
        link('Cierre completo', 'cierre/' + f, 'small ghost') + '</div></li>';
    }).join('') + '</ul><label class="fld"><span>Nota de estos días (opcional, va a tu bitácora)</span><textarea class="inp" id="cs-nota" rows="2" placeholder="Ej. Semana normal; el equipo 3 va atrasado con el prototipo."></textarea></label>' +
      '<div class="row gap wrap mt">' + btn('✓ Cerrar ' + P.length + (P.length === 1 ? ' día' : ' días'), 'cs-cerrar', '', 'primary') + link('Cancelar', 'inicio', 'ghost') + '</div>');
    return { t: 'Cerrar semana', h: h };
  };
  A['cs-cerrar'] = () => {
    const g = D.grupoActual(), al = D.alumnos(g), hoy = u.today(), P = E.cierre ? E.cierre.pendientes(g, hoy) : [], nota = ((document.getElementById('cs-nota') || {}).value || '').trim(); let nl = 0;
    P.forEach(f => {
      const ck = document.getElementById('cs-tp-' + f);
      if (ck && ck.checked && !S.get('asis:' + g.id + ':' + f)) { const d = {}; al.forEach(a => { d[a.id] = 'A'; }); S.put('asis:' + g.id + ':' + f, d, { silent: true }); nl++; }
      S.update('cierre:' + g.id + ':' + f, d => { d.act = true; d.ok = d.ok || new Date().toISOString(); d.lote = true; }, {});
    });
    if (nota && P.length) { const f = P[P.length - 1], id = 'cierre_lote_' + g.id + '_' + f; S.put('bit:' + id, { id: id, fecha: f, grupoId: g.id, texto: 'Cierre de ' + P.length + ' días (' + P.map(x => u.fCorta(x)).join(', ') + '): ' + nota }); }
    u.toast('Cerraste ' + P.length + (P.length === 1 ? ' día' : ' días') + (nl ? ' · ' + nl + (nl === 1 ? ' lista' : ' listas') + ' con todos presentes' : ''), 'ok', 4000);
    location.hash = '#/inicio';
  };
  // botón en el recordatorio de Inicio y en el cierre del día
  if (E.cierre) {
    const ih = E.cierre.inicioHTML;
    E.cierre.inicioHTML = (g, hoy) => { const o = ih(g, hoy); if (!o || E.cierre.pendientes(g, hoy).length < 2) return o; const i = o.lastIndexOf('</section>'); return o.slice(0, i) + ' ' + link('Cerrar los ' + E.cierre.pendientes(g, hoy).length + ' de un jalón', 'cerrarsemana', 'small') + o.slice(i); };
    const vc = V.cierre;
    V.cierre = function () { const o = vc.apply(null, arguments), g = D.grupoActual(); if (g && o && !/Algo falló/.test(o.h)) { const n = E.cierre.pendientes(g, u.today()).length; if (n >= 2) { const i = o.h.indexOf('<section'); o.h = o.h.slice(0, i) + '<p class="note info small">Tienes ' + n + ' días sin cerrar. ' + link('Cerrar los ' + n + ' de un jalón', 'cerrarsemana', 'small') + '</p>' + o.h.slice(i); } } return o; };
  }

  /* =================== Hoy en 3 =================== */
  const H3 = E.hoy3 = {};
  const diaN = f => u.diffDays('2026-01-01', f);
  H3.clase = (g, hoy) => {
    const bl = C.bloquesDia(g, hoy), hm = ahora();
    if (C.esClase(g, hoy) && bl.length) {
      const ini = bl.map(b => b.inicio).sort()[0], fin = bl.map(b => b.fin).sort().slice(-1)[0], rs = E.clases && E.clases.resumenDia(g, hoy);
      const txt = rs ? rs.map(r => r.b.inicio + ' ' + r.txt).join(' · ') : bl.map(b => b.inicio + '–' + b.fin).join(' · ');
      const asis = S.get('asis:' + g.id + ':' + hoy), cerr = E.cierre && E.cierre.doc(g, hoy).ok;
      if (hm >= fin) return { ico: '📝', k: 'Ya terminaron tus clases de hoy', t: txt, b: cerr ? '<span class="chip ok">✓ Día cerrado</span>' : link('📝 Cierre del día', 'cierre/' + hoy, 'small primary') };
      return { ico: hm >= ini ? '🟢' : '📅', k: hm >= ini ? 'En clase ahora' : 'Hoy a las ' + ini, t: txt, b: (asis ? link(icon('grid') + ' Modo clase', 'aula/' + hoy, 'small') : link(icon('check') + ' Pasar lista', 'lista/' + hoy, 'small primary')) + (rs ? link(icon('board') + ' Guion', 'clase/' + hoy, 'small') : '') };
    }
    const nx = C.siguienteClase(g, hoy), rn = nx && E.clases && E.clases.resumenDia(g, nx);
    return { ico: '📅', k: nx ? 'Próxima clase: ' + u.fLarga(nx) : 'Sin clases próximas', t: rn ? rn.map(r => r.b.inicio + ' ' + r.txt).join(' · ') : '', b: nx ? link(icon('board') + ' Preparar', 'clase/' + nx, 'small') : '' };
  };
  H3.urgente = (g, hoy) => {
    if (E.seguridad && C.esClase(g, hoy)) { const r = E.seguridad.riesgoDia(g, hoy); if (r.length) { const sin = E.seguridad.sinFirma(g, hoy), ok = (S.get('segEpp:' + g.id + ':' + hoy) || {}).ok; if (sin.length || !ok) return { ico: '🦺', k: 'Hoy hay práctica con herramienta o corriente', t: (sin.length ? sin.length + (sin.length === 1 ? ' alumno sin' : ' alumnos sin') + ' reglamento firmado · ' : '') + (ok ? 'revisión hecha' : 'falta la revisión de seguridad'), b: link('Revisar', 'clase/' + hoy, 'small primary') }; } }
    const p = D.parciales().filter(x => x.inicio <= hoy && x.captura >= hoy && u.diffDays(hoy, x.captura) <= 3)[0];
    if (p) { const st = PC.estado(g, p); if (st.faltan) return { ico: '⏰', k: 'Captura del ' + p.nombre + ' en ' + u.diffDays(hoy, p.captura) + ' días', t: 'Faltan ' + st.faltan + ' cosas para el acta', b: link('Pre-cierre', 'precierre/' + p.id, 'small primary') }; }
    const cp = E.cierre ? E.cierre.pendientes(g, hoy).filter(f => f !== hoy) : [];
    if (cp.length >= 2) return { ico: '📝', k: cp.length + ' días sin cerrar', t: cp.map(f => u.fCorta(f)).join(' · '), b: link('Cerrar de un jalón', 'cerrarsemana', 'small primary') };
    if (cp.length === 1) return { ico: '📝', k: 'Te falta cerrar el ' + u.fLarga(cp[0]), t: 'Lista, tarea, participación y destacados', b: link('Cerrar', 'cierre/' + cp[0], 'small primary') };
    const L = E.pend ? E.pend.lista(g, hoy).filter(x => x.tipo !== 'cierre') : [];
    if (L.length) { const x = L[0]; return { ico: (E.pend.TIPOS[x.tipo] || ['📥'])[0], k: x.t, t: (x.sub || '') + (L.length > 1 ? ' · y ' + (L.length - 1) + ' pendientes más' : ''), b: link('Ir', x.to || 'pendientes', 'small primary') + (L.length > 1 ? link('Ver todos', 'pendientes', 'small') : '') }; }
    if (E.entregas) { const sig = E.entregas.proximas(g, hoy, 1)[0], r = sig && E.entregas.pedir(g, sig); if (r && !r.vacio) { const xs = [].concat(r.recoger, r.material, r.entregan); if (xs.length) return { ico: '📣', k: 'Pide ' + (sig === hoy ? 'hoy' : sig === u.addDays(hoy, 1) ? 'mañana' : 'el ' + u.fLarga(sig)), t: corto(xs.join(' · '), 140), b: link('Entregas', 'entregas', 'small') }; } }
    return { ico: '🎉', k: 'Todo al día', t: 'No tienes pendientes de captura.', b: '' };
  };
  H3.alumno = (g, hoy) => {
    const p = C.parcialActual(hoy); if (!p) return null; let L = [];
    if (E.semaforo && E.semaforo.datos) { try { L = E.semaforo.datos(g, p.id).filas.filter(r => r.n === 'mal').sort((a, b) => (a.cambio - b.cambio) || (a.v - b.v)).map(r => ({ a: r.a, why: (E.semaforo.razon ? E.semaforo.razon(r.ult) : '') + (r.cambio < 0 ? ' · bajó' : ''), v: r.v })); } catch (e) { L = []; } }
    if (!L.length) L = C.riesgos(g, p).filter(r => r.kind === 'bad').map(r => ({ a: D.alumno(g, r.id), why: r.txt }));
    const at = E.cierre ? E.cierre.atencion(g, hoy) : []; at.forEach(x => { if (!L.some(y => y.a && y.a.id === x.a.id)) L.push({ a: x.a, why: '👎 ' + x.n + ' días muy mal' }); });
    L = L.filter(x => x.a); if (!L.length) return null;
    // v1.27.18: a quien faltó (o tiene justificada) hoy no se le atiende aquí: la tarjeta elige solo entre los que sí están
    const asisHoy = S.get('asis:' + g.id + ':' + hoy) || null, amb = C.ambito(hoy);
    const ausente = a => !!asisHoy && ['F', 'J'].indexOf(C.marca(asisHoy, a.id, amb)) >= 0;
    const faltan = L.filter(x => ausente(x.a)), L2 = L.filter(x => !ausente(x.a));
    if (!L2.length) return { ico: '👤', k: 'Hoy no hay a quién atender aquí', t: 'Faltó hoy: ' + faltan.map(x => u.corto(x.a.nombre)).join(', ') + '. Atiéndelos en su próxima clase.', b: link('Ficha', 'alumno/' + faltan[0].a.id, 'small') };
    L = L2;
    const x = L[((diaN(hoy) % L.length) + L.length) % L.length];
    return { ico: '👤', k: 'Hoy atiende a ' + u.corto(x.a.nombre), t: (x.why || 'Va mal en el semáforo') + (L.length > 1 ? ' · rota cada día entre ' + L.length + ' alumnos' : '') + (faltan.length ? ' · ' + faltan.length + (faltan.length === 1 ? ' faltó' : ' faltaron') + ' hoy (no cuenta)' : ''), b: link('Ficha', 'alumno/' + x.a.id, 'small primary') + (E.aprobar ? link('Para aprobar', 'aprobar/' + p.id, 'small') : '') };
  };
  H3.html = (g, hoy) => {
    const rows = [H3.clase(g, hoy), H3.urgente(g, hoy), H3.alumno(g, hoy)].filter(Boolean);
    return card('<h3>☀️ Hoy</h3><ul class="h3-l">' + rows.map(r => '<li><span class="h3-ico">' + r.ico + '</span><div class="h3-t"><b>' + esc(r.k) + '</b>' + (r.t ? '<small class="muted">' + esc(r.t) + '</small>' : '') + '</div><div class="h3-b">' + r.b + '</div></li>').join('') + '</ul>', 'h3-card');
  };
  H3.resumen = (g, hoy) => {
    const n = E.pend ? E.pend.lista(g, hoy).length : 0;
    return 'Ver todo lo demás' + (n ? ' · ' + n + ' pendientes' : '') + ' · avisos, semáforo, tutoría y más';
  };

  /* =================== en Calificaciones y Ajustes =================== */
  if (V.calificaciones) {
    const vc = V.calificaciones;
    V.calificaciones = function (pid) {
      const o = vc.apply(null, arguments), g = D.grupoActual(); if (!o || !g || /Algo falló|Primero importa|No hay grupo/.test(o.h) || pid === 'final') return o;
      const p = D.parciales().find(x => x.id === pid) || C.parcialActual(); if (D.manual(g, p.id).activo) return o;
      const i = o.h.indexOf('</div>') + 6;
      o.h = o.h.slice(0, i) + '<div class="row gap wrap cal-x">' + link('✅ Pre-cierre para el acta', 'precierre/' + p.id, 'small') + link('📣 Tablero de entregas', 'entregas/' + p.id, 'small') + (E.entregas ? btn('📌 Crear actividades del guion', 'en-auto', '', 'small ghost') : '') + '</div>' + o.h.slice(i);
      return o;
    };
  }
  if (V.ajustes) {
    const va = V.ajustes;
    V.ajustes = function () {
      const o = va.apply(null, arguments); if (!o || /Algo falló/.test(o.h)) return o; const c = D.cfg();
      const tog = (path, label, val, inv) => '<label class="switch"><input type="checkbox" data-ch="' + (inv ? 'cfg-inv' : 'cfg') + '" data-path="' + path + '" ' + (val ? 'checked' : '') + '><span>' + label + '</span></label>';
      o.h += card('<h3>✨ Novedades de la v1.24</h3>' + tog('inicioCompleto', 'Inicio compacto: arriba solo «Hoy» (tu clase, lo urgente y a quién atender) y lo demás plegado', c.inicioCompleto !== true, true) +
        tog('evAuto', 'Crear solas las actividades de las evidencias que marca el guion (con su rúbrica sugerida)', c.evAuto !== false) +
        '<p class="muted small" id="aj-esp">Calculando espacio…</p>');
      const prev = o.after; o.after = () => { if (prev) prev(); S.espacio().then(e => { const el = document.getElementById('aj-esp'); if (!el) return; const mb = x => (x / 1048576).toFixed(1) + ' MB'; el.textContent = 'Tus datos se guardan en ' + (e.modo === 'idb' ? 'la base interna del navegador (IndexedDB)' : 'el almacenamiento simple del navegador (localStorage, máx. ~5 MB)') + ': ' + e.docs + ' documentos' + (e.usado != null ? ' · ' + mb(e.usado) + ' usados de ' + mb(e.cuota) + ' disponibles' : '') + '.'; }); };
      return o;
    };
  }
  CH['cfg-inv'] = el => { S.update('config', cfg => { u.set(cfg, el.dataset.path, !el.checked); }, {}); };
})();

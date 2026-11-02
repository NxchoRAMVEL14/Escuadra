/* Escuadra · Cerrar un parcial (v1.28). En Pre-cierre, «🔒 Cerrar parcial» guarda una foto de las calificaciones tal
   como las entregaste (final, desglose y asistencia). Desde ese momento el acta, la consulta para casa, los informes y
   Calificaciones usan la foto, aunque después cambies ajustes (por ejemplo, contar la asistencia por día o por clase),
   actividades o listas. Si un cambio movería alguna calificación cerrada, la app te avisa y te deja ver quién y cuánto.
   Puedes actualizar la foto con los datos de hoy o reabrir el parcial. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const CZ = E.cerrar = {};
  // un documento por parcial (si dos aparatos cierran parciales distintos sin haber sincronizado, no se pisan)
  const KZ = (g, pid) => 'cerrado:' + g.id + ':' + pid;
  CZ.de = (g, pid) => (g && S.get(KZ(g, pid))) || null;
  CZ.doc = g => { const o = {}; if (g) S.keys('cerrado:' + g.id + ':').forEach(k => { o[k.split(':').pop()] = S.get(k); }); return o; };
  // el cálculo de siempre (con los datos de hoy)
  const vivo = C.cal.bind(C);
  C.calVivo = vivo;
  C.cal = function (g, pid, aid) {
    const z = g && CZ.de(g, pid), x = z && z.alumnos && z.alumnos[aid];
    // si después activaste la captura a mano de ese parcial, manda la captura a mano
    if (!x || D.manual(g, pid).activo) return vivo(g, pid, aid);
    return { manual: false, cerrado: z.f, final: x.final, comp: Object.assign({}, x.comp), enCurso: !!x.enCurso, falta: x.falta || [], np: x.np, as: Object.assign({ fechasF: [] }, x.as) };
  };
  // en el acta, asistencias y faltas también salen de la foto
  const fila0 = C.actaFila.bind(C);
  C.actaFila = function (g, aid) {
    const row = fila0(g, aid);
    D.parciales().forEach((p, i) => { const k = C.cal(g, p.id, aid); if (k.cerrado && k.as) { row[i * 3 + 1] = k.as.ses ? k.as.a : ''; row[i * 3 + 2] = k.as.ses ? k.as.f : ''; } });
    return row;
  };
  const foto = (g, pid) => {
    const p = C.parcial(pid), al = {};
    D.alumnos(g).forEach(a => {
      const k = vivo(g, pid, a.id); if (k.manual) return;
      const as = k.as || C.asis(g, p, a.id);
      al[a.id] = { final: k.final, comp: k.comp, enCurso: !!k.enCurso, falta: k.falta || [], np: k.np, as: { a: as.a, f: as.f, ses: as.ses, ret: as.ret, j: as.j, pct: as.pct } };
    });
    return { f: u.today(), ts: new Date().toISOString(), alumnos: al, modo: C.porClase && C.porClase() ? 'clase' : 'dia' };
  };
  CZ.cerrar = (g, pid) => S.put(KZ(g, pid), foto(g, pid));
  CZ.reabrir = (g, pid) => S.del(KZ(g, pid));
  if (E.undo && E.undo.NOMBRE) Object.assign(E.undo.NOMBRE, { 'cz-cerrar': 'cierre de parcial', 'cz-foto': 'foto del parcial cerrado', 'cz-reabrir': 'cierre de parcial' });
  // quién tendría otra calificación con los datos de hoy
  CZ.difs = (g, pid) => {
    const z = CZ.de(g, pid); if (!z) return [];
    return D.alumnos(g).map(a => { const x = (z.alumnos || {})[a.id]; if (!x) return null; const k = vivo(g, pid, a.id); return k.final !== x.final ? { a: a, antes: x.final, hoy: k.final } : null; }).filter(Boolean);
  };
  const fmt = v => v == null ? '—' : v;

  A['cz-cerrar'] = el => {
    const g = D.grupoActual(), p = C.parcial(el.dataset.pid); if (!g || !p) return;
    if (!confirm('¿Cerrar el ' + p.nombre + '? Se guarda la foto de las calificaciones de hoy y ya no cambiarán aunque cambies ajustes, actividades o listas. Puedes reabrirlo después.')) return;
    CZ.cerrar(g, p.id); vistos[g.id + '|' + p.id] = 0; u.toast('🔒 ' + p.nombre + ' cerrado: sus calificaciones quedan fijas', 'ok', 4000);
  };
  A['cz-foto'] = el => {
    const g = D.grupoActual(), p = C.parcial(el.dataset.pid), n = CZ.difs(g, p.id).length; if (!g || !p) return;
    if (!confirm('¿Actualizar la foto del ' + p.nombre + ' con los datos de hoy? ' + (n ? n + (n === 1 ? ' alumno cambia' : ' alumnos cambian') + ' de calificación. ' : '') + 'Hazlo solo si también corregirás lo que ya entregaste.')) return;
    CZ.cerrar(g, p.id); vistos[g.id + '|' + p.id] = 0; u.toast('Foto actualizada', 'ok');
  };
  A['cz-reabrir'] = el => {
    const g = D.grupoActual(), p = C.parcial(el.dataset.pid); if (!g || !p) return;
    if (!confirm('¿Reabrir el ' + p.nombre + '? Sus calificaciones volverán a calcularse con los datos de hoy.')) return;
    CZ.reabrir(g, p.id); u.toast(p.nombre + ' reabierto', 'ok');
  };
  A['cz-ver'] = el => {
    const g = D.grupoActual(), p = C.parcial(el.dataset.pid), L = CZ.difs(g, p.id), z = CZ.de(g, p.id); if (!z) return;
    E.modal.open('🔒 ' + p.nombre + ' · cambios desde el cierre', '<p class="small">La foto es del ' + u.fCorta(z.f) + '. Con los datos de hoy estas calificaciones serían distintas; el acta y la consulta siguen usando la foto.</p>' +
      (L.length ? '<ul class="risk">' + L.map(x => '<li><span>' + x.a.num + '. ' + esc(x.a.nombre) + '</span><span class="chip">' + fmt(x.antes) + ' → ' + fmt(x.hoy) + '</span></li>').join('') + '</ul>' : '<p class="note ok small">Nadie cambia.</p>') +
      '<div class="row gap wrap mt">' + btn('Actualizar la foto', 'cz-foto', 'data-pid="' + p.id + '"', 'small') + btn('Dejarla como está', 'modal-close', '', 'small primary') + '</div>');
  };

  CZ.tarjeta = (g, pid) => {
    const p = C.parcial(pid), z = CZ.de(g, pid); if (!p) return '';
    if (D.manual(g, pid).activo) return z ? card('<p class="small">🔒 Este parcial tiene una foto del ' + u.fCorta(z.f) + ', pero ahora usa la captura a mano, que manda. ' + btn('Quitar la foto', 'cz-reabrir', 'data-pid="' + pid + '"', 'small ghost') + '</p>') : '';
    if (!z) return card('<h3>🔒 Cerrar el ' + esc(p.nombre) + '</h3><p class="muted small">Cuando entregues las calificaciones, ciérralo: se guarda una foto y ya no cambian aunque después ajustes la asistencia, las actividades o las listas. El acta, la consulta para casa y los informes usarán la foto.</p>' + btn('🔒 Cerrar el ' + esc(p.nombre), 'cz-cerrar', 'data-pid="' + pid + '"', 'primary'));
    const L = CZ.difs(g, pid);
    return card('<h3>🔒 ' + esc(p.nombre) + ' cerrado</h3><p class="small">Foto del ' + u.fCorta(z.f) + ' (asistencia contada por ' + (z.modo === 'clase' ? 'clase' : 'día') + '). Sus calificaciones ya no cambian.</p>' +
      (L.length ? '<p class="note warn small">Con los datos de hoy, ' + L.length + (L.length === 1 ? ' alumno tendría' : ' alumnos tendrían') + ' otra calificación. La foto no cambia sola. ' + btn('Ver quién', 'cz-ver', 'data-pid="' + pid + '"', 'small') + '</p>' : '<p class="note ok small">Con los datos de hoy nadie cambia.</p>') +
      '<div class="row gap wrap">' + btn('Actualizar la foto', 'cz-foto', 'data-pid="' + pid + '"', 'small') + btn('Reabrir', 'cz-reabrir', 'data-pid="' + pid + '"', 'small ghost') + '</div>');
  };
  const pidDe = (h, pid) => { const ps = D.parciales(); return ps.some(p => p.id === pid) ? pid : null; };
  if (V.precierre) {
    const vp = V.precierre;
    V.precierre = function (pid) {
      const o = vp.apply(null, arguments), g = D.grupoActual(); if (!o || !g || /Algo falló|No hay grupo/.test(o.h) || !D.alumnos(g).length) return o;
      const m = o.h.match(/class="tab on" href="#\/precierre\/([^"]+)"/), id = (m && m[1]) || pidDe(o.h, pid) || C.parcialActual().id;
      o.h += CZ.tarjeta(g, id); return o;
    };
  }
  if (V.calificaciones) {
    const vc = V.calificaciones;
    V.calificaciones = function (pid) {
      const o = vc.apply(null, arguments), g = D.grupoActual(); if (!o || !g || /Algo falló|Primero importa|No hay grupo/.test(o.h) || pid === 'final') return o;
      const p = D.parciales().find(x => x.id === pid) || C.parcialActual(), z = CZ.de(g, p.id); if (!z) return o;
      const n = CZ.difs(g, p.id).length, i = o.h.indexOf('</div>') + 6;
      o.h = o.h.slice(0, i) + '<p class="note info small">🔒 ' + esc(p.nombre) + ' cerrado el ' + u.fCorta(z.f) + ': la calificación final sale de la foto. ' + (n ? n + (n === 1 ? ' alumno tendría' : ' alumnos tendrían') + ' otra con los datos de hoy · ' + btn('Ver', 'cz-ver', 'data-pid="' + p.id + '"', 'small') : 'Con los datos de hoy nadie cambia.') + ' ' + link('Pre-cierre', 'precierre/' + p.id, 'small ghost') + '</p>' + o.h.slice(i);
      return o;
    };
  }
  // aviso cuando un cambio movería calificaciones cerradas (una vez por cada aumento)
  const vistos = {}; let tv = 0;
  S.on(k => {
    if (k === '__sync') return; clearTimeout(tv);
    tv = setTimeout(() => {
      const g = D.grupoActual(); if (!g) return; const z = CZ.doc(g);
      Object.keys(z).forEach(pid => {
        const p = C.parcial(pid); if (!p) return; const n = CZ.difs(g, pid).length, kk = g.id + '|' + pid;
        if (vistos[kk] == null) { vistos[kk] = n; return; }
        if (n > vistos[kk]) u.toast('🔒 Con este cambio, ' + n + (n === 1 ? ' alumno tendría' : ' alumnos tendrían') + ' otra calificación en el ' + p.nombre + ' (cerrado). La foto no cambia; revísalo en Pre-cierre.', 'ok', 6000);
        vistos[kk] = n;
      });
    }, 700);
  });
})();

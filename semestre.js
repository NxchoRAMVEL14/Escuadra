/* Escuadra · Pasar al siguiente semestre (v1.25). Un asistente para el cambio de semestre:
   1) qué pasa con cada grupo activo (pasa al siguiente semestre, solo se archiva o sigue igual),
   2) fechas de los parciales del semestre nuevo (propuestas; ajústalas al calendario oficial),
   3) revisión y «Pasar». Al pasar: cada grupo se archiva con sus fechas (su historial no cambia) y se crea el grupo
   nuevo con los mismos alumnos activos (mismo número de lista), el módulo que sigue, sus submódulos y el horario anterior
   como punto de partida. El grupo nuevo recuerda de dónde viene (para el portafolio y las constancias). */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const SE = E.semestre = {};
  const modDeSem = sem => { const ms = E.PROGRAMA.modulos; return Object.keys(ms).find(k => Number(ms[k].semestre) === Number(sem)) || null; };
  const siguienteGrupo = gr => { const m = String(gr || '').match(/^(\d+)(.*)$/); return m ? (Number(m[1]) + 1) + m[2] : gr; };
  // fechas propuestas: si hoy es ago–ene, el semestre nuevo es feb–jul; si es feb–jul, ago–ene
  SE.propuesta = hoy => {
    hoy = hoy || u.today(); const y = Number(hoy.slice(0, 4)), m = Number(hoy.slice(5, 7));
    const prim = m >= 8 || m <= 1, Y = m >= 8 ? y + 1 : y, lun = f => { let d = f; while (u.dow(d) !== 1) d = u.addDays(d, 1); return d; };
    const ini = prim ? lun(Y + '-02-01') : lun(Y + '-08-24'), mk = (id, nom, a, sem) => { const fin = u.addDays(a, sem * 7 - 3); return { id: id, nombre: nom, inicio: a, fin: fin, captura: u.addDays(fin, 6), asuetos: [] }; };
    const p1 = mk('P1', '1er parcial', ini, 5), p2 = mk('P2', '2º parcial', u.addDays(p1.fin, 3), prim ? 7 : 6), p3 = mk('P3', '3er parcial', u.addDays(p2.fin, 3), 6);
    return [p1, p2, p3];
  };
  const estado = () => {
    if (E.ui.sem) return E.ui.sem;
    const gs = D.gruposActivos().map(g => { const sem = Number(g.semestre) + 1, mod = modDeSem(sem); return { gid: g.id, accion: mod ? 'pasa' : 'archiva', grupo: siguienteGrupo(g.grupo), semestre: String(sem || ''), modulo: mod || g.modulo, nombre: '' }; });
    return (E.ui.sem = { paso: 1, gs: gs, ps: SE.propuesta(), copiaHorario: true });
  };
  const sugNombre = (g, x) => { const w = String(g.nombre || '').split(' ').slice(1).join(' '); const m = String(x.grupo).match(/^(\d+)(.*)$/); return (m ? m[1] + '°' + m[2].toUpperCase() : x.grupo) + (w ? ' ' + w : ''); };
  V.semestre = () => {
    const s = estado(), mods = E.PROGRAMA.modulos;
    let h = card('<h3>🎓 Pasar al siguiente semestre</h3><p class="muted small">Archiva tus grupos con sus fechas (su historial no cambia) y crea los del semestre nuevo con los mismos alumnos, el módulo que sigue y su horario como punto de partida. Antes, descarga un respaldo.</p>' +
      '<div class="cr-pasos">' + ['1 · Grupos', '2 · Fechas', '3 · Revisar'].map((t, i) => '<span class="chip ' + (s.paso === i + 1 ? 'brand' : s.paso > i + 1 ? 'ok' : '') + '">' + t + '</span>').join('') + '</div>');
    if (!s.gs.length) return { t: 'Cambio de semestre', h: h + card('<p class="small">No tienes grupos activos.</p>' + link('Mis grupos', 'grupos', 'primary')) };
    if (s.paso === 1) {
      h += s.gs.map((x, i) => { const g = D.grupo(x.gid);
        return card('<h3>' + esc(g.nombre) + ' <span class="chip">' + D.alumnos(g).length + ' alumnos · Módulo ' + esc(g.modulo || '—') + '</span></h3>' +
          '<div class="cl-seg">' + [['pasa', 'Pasa al siguiente semestre'], ['archiva', 'Solo archivar'], ['sigue', 'Dejar igual']].map(o => btn(o[1], 'sem-acc', 'data-i="' + i + '" data-v="' + o[0] + '"', 'small' + (x.accion === o[0] ? ' on' : ''))).join('') + '</div>' +
          (x.accion === 'pasa' ? '<div class="fgrid mt"><label class="fld"><span>Grupo nuevo</span><input class="inp" data-ch="sem-g" data-i="' + i + '" data-f="grupo" value="' + esc(x.grupo) + '"></label><label class="fld"><span>Semestre</span><input class="inp" type="number" data-ch="sem-g" data-i="' + i + '" data-f="semestre" value="' + esc(x.semestre) + '"></label></div>' +
            '<label class="fld"><span>Módulo</span><select data-ch="sem-g" data-i="' + i + '" data-f="modulo">' + Object.keys(mods).map(k => '<option value="' + k + '"' + (x.modulo === k ? ' selected' : '') + '>' + k + ' · ' + esc(mods[k].nombre) + ' (' + mods[k].semestre + 'º)</option>').join('') + '</select></label>' +
            '<label class="fld"><span>Nombre corto</span><input class="inp" data-ch="sem-g" data-i="' + i + '" data-f="nombre" value="' + esc(x.nombre) + '" placeholder="' + esc(sugNombre(g, x)) + '"></label>' : x.accion === 'archiva' ? '<p class="small muted">Se archiva con sus fechas; no se crea grupo nuevo.</p>' : '<p class="small note warn">Sigue activo con las fechas nuevas: su historial de este semestre se calcularía con el calendario nuevo. Úsalo solo si el grupo continúa contigo con las mismas fechas.</p>'));
      }).join('');
      h += card('<label class="switch"><input type="checkbox" data-ch="sem-hor"' + (s.copiaHorario ? ' checked' : '') + '><span>Copiar el horario de cada grupo (lo ajustas después en Ajustes → Grupo y horario)</span></label><div class="row gap wrap">' + btn('Siguiente: fechas ›', 'sem-paso', 'data-p="2"', 'primary') + link('Cancelar', 'grupos', 'ghost') + '</div>');
    } else if (s.paso === 2) {
      h += card('<h3>📅 Parciales del semestre nuevo</h3><p class="muted small">Son una propuesta (5, 6 y 6 semanas): pon las del calendario oficial. Los asuetos los agregas después en Ajustes → Ciclo y parciales.</p>' +
        s.ps.map((p, i) => '<h4>' + esc(p.nombre) + '</h4><div class="fgrid c3">' + [['inicio', 'Inicio'], ['fin', 'Fin'], ['captura', 'Captura']].map(f => '<label class="fld"><span>' + f[1] + '</span><input type="date" data-ch="sem-p" data-i="' + i + '" data-f="' + f[0] + '" value="' + esc(p[f[0]]) + '"></label>').join('') + '</div>').join('') +
        '<div class="row gap wrap mt">' + btn('‹ Atrás', 'sem-paso', 'data-p="1"', 'ghost') + btn('Siguiente: revisar ›', 'sem-paso', 'data-p="3"', 'primary') + '</div>');
    } else {
      const mal = s.ps.some((p, i) => !p.inicio || !p.fin || !p.captura || p.fin < p.inicio || p.captura < p.fin || (i && p.inicio <= s.ps[i - 1].fin));
      h += card('<h3>✅ Revisa antes de pasar</h3><ul class="pc-l">' + s.gs.map(x => { const g = D.grupo(x.gid), m = mods[x.modulo];
        return '<li class="' + (x.accion === 'sigue' ? 'warn' : 'ok') + '"><span class="pc-i">' + (x.accion === 'pasa' ? '→' : x.accion === 'archiva' ? '🗄' : '•') + '</span><div><b>' + esc(g.nombre) + '</b><small class="muted">' + (x.accion === 'pasa' ? 'Se archiva y se crea <b>' + esc(x.nombre || sugNombre(g, x)) + '</b> (' + esc(x.semestre) + 'º, Módulo ' + esc(x.modulo) + (m ? ' · ' + esc(m.nombre) : '') + ') con ' + D.alumnos(g).length + ' alumnos' : x.accion === 'archiva' ? 'Se archiva' : 'Sigue activo') + '</small></div></li>'; }).join('') +
        '<li class="ok"><span class="pc-i">📅</span><div><b>Parciales nuevos</b><small class="muted">' + s.ps.map(p => esc(p.nombre) + ': ' + u.fCorta(p.inicio) + '–' + u.fCorta(p.fin) + ' (captura ' + u.fCorta(p.captura) + ')').join(' · ') + '</small></div></li></ul>' +
        (mal ? '<p class="note bad">Revisa las fechas: cada parcial termina después de empezar, la captura va después del fin y no se enciman.</p>' : '') +
        '<div class="row gap wrap mt">' + btn('‹ Atrás', 'sem-paso', 'data-p="2"', 'ghost') + btn('💾 Descargar respaldo', 'backup-dl', '', '') + btn('🎓 Pasar al semestre nuevo', 'sem-pasar', mal ? 'disabled' : '', 'primary') + '</div>');
    }
    return { t: 'Cambio de semestre', h: h };
  };
  const rep = () => E.render();
  A['sem-acc'] = el => { estado().gs[Number(el.dataset.i)].accion = el.dataset.v; rep(); };
  CH['sem-g'] = el => { const x = estado().gs[Number(el.dataset.i)], f = el.dataset.f; x[f] = el.value; if (f === 'semestre') { const m = modDeSem(el.value); if (m) x.modulo = m; rep(); } };
  CH['sem-p'] = el => { estado().ps[Number(el.dataset.i)][el.dataset.f] = el.value; };
  CH['sem-hor'] = el => { estado().copiaHorario = el.checked; };
  A['sem-paso'] = el => { estado().paso = Number(el.dataset.p); rep(); window.scrollTo(0, 0); };
  A['sem-pasar'] = () => {
    const s = estado(); if (!confirm('¿Pasar al semestre nuevo? Se archivan los grupos marcados y se cambian las fechas de los parciales. Tus datos no se borran.')) return;
    const viejas = u.clone(S.get('parciales') || E.DEFAULTS.parciales), creados = [];
    // 1) archivar con sus fechas
    s.gs.filter(x => x.accion !== 'sigue').forEach(x => S.update('grupo:' + x.gid, g => { g.archivado = u.today(); g.parciales = u.clone(viejas); }));
    // 2) fechas nuevas
    S.put('parciales', s.ps.map(p => Object.assign({}, p, { asuetos: p.asuetos || [] })));
    // 3) grupos nuevos
    s.gs.filter(x => x.accion === 'pasa').forEach(x => {
      const g = D.grupo(x.gid), gr = String(x.grupo || '').trim().toUpperCase() || g.grupo + '+';
      const suf = String(g.id).indexOf(String(g.grupo)) === 0 ? String(g.id).slice(String(g.grupo).length) : String(g.id).replace(/^[0-9]+[A-Z]?/, ''); let id = (gr + suf).replace(/[^A-Z0-9]/g, '') || 'G'; const base = id; let k = 2; while (S.docs['grupo:' + id]) id = base + (k++);
      const sub = E.mods ? E.mods.subSugeridos(x.modulo, s.ps) : {};
      const al = D.alumnos(g).map(a => ({ id: a.id, num: a.num, nombre: a.nombre, activo: true, notas: a.notas || '', tel: a.tel || '', emNom: a.emNom || '', emTel: a.emTel || '', nss: a.nss || '', emNota: a.emNota || '' }));
      S.put('grupo:' + id, Object.assign({ id: id, nombre: String(x.nombre || '').trim() || sugNombre(g, x), carrera: g.carrera || '', semestre: String(x.semestre || ''), grupo: gr, modulo: x.modulo, submodulos: sub, inicioDocente: s.ps[0].inicio,
        horario: s.copiaHorario ? u.clone(g.horario || []) : [], alumnos: al, prev: g.id }, E.mods && E.mods.flujoDef && E.mods.flujoDef(x.modulo) ? { flujo: true } : {}));
      if (E.mods && E.mods.cargar) E.mods.cargar(x.modulo);
      creados.push(id);
    });
    if (creados.length) D.setGrupo(creados[0]); else { const a = D.gruposActivos()[0]; D.setGrupo(a ? a.id : null); }
    E.ui.sem = null;
    u.toast(creados.length ? 'Listo: ' + creados.length + (creados.length === 1 ? ' grupo nuevo' : ' grupos nuevos') + '. Revisa su horario y los asuetos.' : 'Listo: grupos archivados y fechas nuevas', 'ok', 6000);
    location.hash = creados.length ? '#/grupos' : '#/ajustes';
  };
  // historial: grupos anteriores de un grupo (para portafolio y constancias)
  SE.cadena = g => { const out = []; let x = g, n = 0; while (x && x.prev && n++ < 8) { x = D.grupo(x.prev); if (x) out.push(x); } return out; };
  // en Mis grupos: el botón para el cambio de semestre
  if (V.grupos) { const vg = V.grupos; V.grupos = function () { const o = vg.apply(null, arguments); if (o && !/Algo falló/.test(o.h)) o.h = card('<div class="row between gap wrap"><div><h3>🎓 ¿Terminó el semestre?</h3><p class="muted small">Archiva tus grupos y crea los del semestre nuevo con los mismos alumnos.</p></div>' + link('Pasar al siguiente semestre', 'semestre', 'small primary') + '</div>') + o.h; return o; }; }
})();

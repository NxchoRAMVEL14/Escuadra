/* Escuadra · Mis grupos: varios grupos, cada uno con su horario, su lista, sus calificaciones y su acta por separado.
   El grupo con el que trabajas se guarda en este aparato (tu celular puede estar en uno y tu compu en otro).
   Al abrir desde el ícono entra solo al grupo que tiene clase en ese momento. Al terminar el semestre lo archivas:
   se guardan sus fechas de parciales para que su historial no cambie con el calendario del semestre nuevo. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const G = E.grupos = {};
  const DIAS = { 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb' };
  const LUGAR = { aula: 'Aula', computo: 'Centro de cómputo', taller: 'Taller' };
  const aMin = hm => { const p = String(hm || '0:0').split(':'); return Number(p[0]) * 60 + Number(p[1] || 0); };
  const deMin = m => u.pad(Math.floor(m / 60)) + ':' + u.pad(m % 60);
  const menos = (hm, n) => deMin(Math.max(0, aMin(hm) - n));
  const ahoraHM = () => { const d = new Date(); return u.pad(d.getHours()) + ':' + u.pad(d.getMinutes()); };
  const horasDe = h => (h || []).reduce((a, b) => a + Number(b.horas || 0), 0);
  G.corto = g => g ? (g.nombre || g.grupo || g.id) : '';

  /* ---------- cambiar de grupo ---------- */
  G.usar = (gid, silencio) => {
    const g = D.grupo(gid); if (!g) return; D.setGrupo(gid);
    if (!silencio) u.toast('Ahora trabajas con ' + G.corto(g) + (g.archivado ? ' (archivado)' : ''), 'ok', 2200);
    E.render();
  };
  A['g-usar'] = el => { G.usar(el.dataset.gid); E.modal.close(); };
  A['g-ir'] = el => { const to = el.dataset.to || 'inicio'; D.setGrupo(el.dataset.gid); E.modal.close(); if (location.hash === '#/' + to) E.render(); else location.hash = '#/' + to; };
  // botón del grupo arriba (solo si tienes 2 o más grupos, o si estás viendo uno archivado)
  G.pintaChip = () => {
    const el = document.getElementById('g-top'); if (!el) return;
    const g = D.grupoActual(), n = D.gruposActivos().length, ver = !!g && (n > 1 || !!g.archivado);
    // arriba va corto («3°A») si con eso se distinguen tus grupos
    el.hidden = !ver; if (ver) { const w = String(g.nombre || '').split(' ')[0], unico = w && D.grupos().filter(x => String(x.nombre || '').split(' ')[0] === w).length === 1;
      const t = (g.archivado ? '🗄 ' : '') + (unico ? w : G.corto(g)) + ' ▾'; if (el.textContent !== t) el.textContent = t; el.title = 'Grupo: ' + G.corto(g) + ' (toca para cambiar)'; }
  };
  A['g-menu'] = () => {
    const g = D.grupoActual(), hoy = u.today(), act = D.gruposActivos();
    E.modal.open('👥 ¿Con qué grupo trabajas?', '<ul class="g-menu">' + act.map(x => { const bs = C.bloquesDia(x, hoy);
      return '<li><button type="button" class="g-op' + (g && x.id === g.id ? ' on' : '') + '" data-act="g-usar" data-gid="' + x.id + '"><b>' + esc(G.corto(x)) + '</b><small>' + D.alumnos(x).length + ' alumnos · ' + (bs.length ? 'hoy ' + bs.map(b => b.inicio + '–' + b.fin).join(', ') : 'hoy sin clase') + '</small></button></li>'; }).join('') + '</ul>' +
      (g && g.archivado ? '<p class="note small">Estás viendo un grupo archivado: ' + esc(G.corto(g)) + '.</p>' : '') + link(icon('users') + ' Mis grupos: agregar, horario, archivar', 'grupos', 'small'));
  };

  /* ---------- quién tiene clase ahora ---------- */
  const bloquesHoy = (g, hoy) => {
    let bs = []; try { const d = E.clases && E.clases.dia ? E.clases.dia(g, hoy) : null; bs = d ? d.bloques.filter(b => !b.perdida).map(b => ({ inicio: b.inicio, fin: b.fin, lugar: b.lugar })) : []; } catch (e) { bs = []; }
    if (!bs.length) bs = C.bloquesDia(g, hoy).map(b => ({ inicio: b.inicio, fin: b.fin, lugar: b.lugar }));
    return bs;
  };
  G.bloquesHoy = bloquesHoy;
  // grupo y pantalla que tocan ahora: { g, ruta } (pase de lista, guion o cierre del día) o null
  G.ahora = (hoy, hm) => {
    hoy = hoy || u.today(); hm = hm || ahoraHM();
    const gs = D.gruposActivos().filter(g => D.alumnos(g).length && C.esClase(g, hoy)), bl = [];
    gs.forEach(g => bloquesHoy(g, hoy).forEach(b => bl.push({ g: g, ini: b.inicio, fin: b.fin })));
    const ruta = g => (S.get('asis:' + g.id + ':' + hoy) ? 'clase/' : 'lista/') + hoy;
    // un bloque que ya empezó (o empieza en 15 min)
    const cur = bl.filter(b => hm >= menos(b.ini, 15) && hm < b.fin).sort((a, b) => a.ini.localeCompare(b.ini));
    if (cur.length) return { g: cur[0].g, ruta: ruta(cur[0].g) };
    // receso entre bloques del mismo grupo (y ningún otro grupo a esa hora)
    const enDia = gs.filter(g => { const xs = bl.filter(b => b.g === g); if (!xs.length) return false; const ini = xs.map(b => b.ini).sort()[0], fin = xs.map(b => b.fin).sort().slice(-1)[0]; return hm >= menos(ini, 15) && hm < fin; });
    if (enDia.length === 1) return { g: enDia[0], ruta: ruta(enDia[0]) };
    // ya terminaste con un grupo y te falta su cierre del día: el que terminó más reciente
    const fins = gs.map(g => ({ g: g, fin: bl.filter(b => b.g === g).map(b => b.fin).sort().slice(-1)[0] }))
      .filter(x => x.fin && hm >= x.fin && E.cierre && E.cierre.pendientes(x.g, hoy).indexOf(hoy) >= 0).sort((a, b) => b.fin.localeCompare(a.fin));
    if (fins.length) return { g: fins[0].g, ruta: 'cierre/' + hoy };
    return null;
  };

  /* ---------- Inicio: tus grupos hoy ---------- */
  G.hoyHTML = hoy => {
    const act = D.gruposActivos(); if (act.length < 2) return '';
    hoy = hoy || u.today(); const hm = ahoraHM(), g0 = D.grupoActual(), filas = [];
    act.forEach(g => { if (!C.esClase(g, hoy)) return; bloquesHoy(g, hoy).forEach(b => filas.push({ g: g, b: b })); });
    filas.sort((a, b) => a.b.inicio.localeCompare(b.b.inicio));
    const pend = g => { try { return E.pend && D.alumnos(g).length ? E.pend.lista(g, hoy).length : 0; } catch (e) { return 0; } };
    let h = '<div class="row between gap wrap"><h3>👥 Tus grupos hoy</h3>' + link('Mis grupos', 'grupos', 'small') + '</div>';
    if (filas.length) h += '<ul class="g-hoy">' + filas.map(x => {
      const lista = !!S.get('asis:' + x.g.id + ':' + hoy), ya = hm >= x.b.inicio, ahora = hm >= menos(x.b.inicio, 15) && hm < x.b.fin, sel = g0 && g0.id === x.g.id;
      return '<li class="' + (ahora ? 'ahora' : '') + '"><span class="g-h">' + x.b.inicio + '–' + x.b.fin + '</span><span class="g-n"><b>' + esc(G.corto(x.g)) + '</b><small>' + esc(LUGAR[x.b.lugar] || 'Aula') + (lista ? ' · lista ✓' : ya ? ' · falta la lista' : '') + (ahora ? ' · ahora' : '') + '</small></span>' +
        btn(sel ? 'Aquí estás' : 'Ir', 'g-ir', 'data-gid="' + x.g.id + '" data-to="' + (lista ? 'clase/' : 'lista/') + hoy + '"', 'small' + (ahora && !sel ? ' primary' : '')) + '</li>'; }).join('') + '</ul>';
    else h += '<p class="small muted">Hoy no tienes clase con ningún grupo.</p>';
    const pp = act.map(g => ({ g: g, n: pend(g) })).filter(x => x.n);
    if (pp.length) h += '<p class="small">Pendientes: ' + pp.map(x => '<button type="button" class="linkbtn" data-act="g-ir" data-gid="' + x.g.id + '" data-to="pendientes">' + esc(G.corto(x.g)) + ' (' + x.n + ')</button>').join(' · ') + '</p>';
    return card(h);
  };

  /* ---------- choques de horario entre grupos ---------- */
  G.choques = () => {
    const act = D.gruposActivos(), out = [];
    for (let i = 0; i < act.length; i++) for (let j = i + 1; j < act.length; j++) (act[i].horario || []).forEach(a => (act[j].horario || []).forEach(b => {
      if (Number(a.dia) === Number(b.dia) && aMin(a.inicio) < aMin(b.fin) && aMin(b.inicio) < aMin(a.fin)) out.push(DIAS[a.dia] + ' ' + (a.inicio > b.inicio ? a.inicio : b.inicio) + ': ' + G.corto(act[i]) + ' y ' + G.corto(act[j]));
    }));
    return out;
  };

  /* =================== pantalla Mis grupos =================== */
  const resumen = g => { const hs = g.horario || [], sm = Object.keys(g.submodulos || {}).map(k => (g.submodulos || {})[k]).filter(Boolean);
    return D.alumnos(g).length + ' alumnos · ' + horasDe(hs) + ' h/semana' + (g.modulo ? ' · Módulo ' + g.modulo + (sm.length ? ' (SM ' + Array.from(new Set(sm)).join(', ') + ')' : '') : ''); };
  const horarioTxt = g => { const hs = (g.horario || []).slice().sort((a, b) => a.dia - b.dia || String(a.inicio).localeCompare(String(b.inicio))); return hs.length ? hs.map(b => DIAS[b.dia] + ' ' + b.inicio + '–' + b.fin + (b.lugar && b.lugar !== 'aula' ? ' (' + (b.lugar === 'computo' ? 'cómputo' : 'taller') + ')' : '')).join(' · ') : 'Sin horario todavía'; };
  V.grupos = () => {
    const act = D.gruposActivos(), arch = D.grupos().filter(g => g.archivado), g0 = D.grupoActual(), ch = G.choques();
    let h = card('<h3>👥 Mis grupos</h3><p class="muted small">Cada grupo tiene su horario, su lista, sus calificaciones y su acta por separado. Las fechas de los parciales, las ponderaciones y lo que vale lo entregado tarde son las mismas para todos (Ajustes).' + (act.length > 1 ? ' Cambias de grupo con el botón de arriba; al abrir desde el ícono, entras al grupo que tiene clase.' : '') + '</p>' +
      (ch.length ? '<p class="note warn">⚠️ Choque de horario: ' + ch.map(esc).join(' · ') + '.</p>' : '') +
      '<ul class="g-list">' + act.map(g => '<li><div><b>' + esc(G.corto(g)) + '</b>' + (g0 && g.id === g0.id ? ' <span class="chip brand">aquí estás</span>' : '') + '<small class="muted">' + esc(resumen(g)) + '</small><small class="muted">' + esc(horarioTxt(g)) + '</small></div>' +
        '<div class="row gap wrap">' + (g0 && g.id === g0.id ? '' : btn('Usar este', 'g-usar', 'data-gid="' + g.id + '"', 'small primary')) + btn('✏️ Datos y horario', 'g-ir', 'data-gid="' + g.id + '" data-to="ajustes/grupo"', 'small') + (D.alumnos(g).length ? '' : btn(icon('upload') + ' Importar lista', 'g-ir', 'data-gid="' + g.id + '" data-to="alumnos"', 'small')) + btn('🗄 Archivar', 'g-arch', 'data-gid="' + g.id + '"', 'small ghost') + '</div></li>').join('') + '</ul>' +
      (!act.length ? '<p class="small">No tienes grupos activos: agrega uno abajo.</p>' : ''));
    h += card(nuevoHTML(), 'g-nuevo');
    if (arch.length) h += card('<details class="sub" id="g-arch"' + (g0 && g0.archivado ? ' open' : '') + '><summary>🗄 Grupos archivados (' + arch.length + ')</summary><ul class="g-list">' + arch.map(g => '<li><div><b>' + esc(G.corto(g)) + '</b>' + (g0 && g.id === g0.id ? ' <span class="chip">viéndolo</span>' : '') + '<small class="muted">' + esc(resumen(g)) + ' · archivado el ' + u.fCorta(g.archivado) + '</small></div><div class="row gap wrap">' +
      (g0 && g.id === g0.id ? '' : btn('Ver', 'g-usar', 'data-gid="' + g.id + '"', 'small')) + btn('↺ Reactivar', 'g-react', 'data-gid="' + g.id + '"', 'small') + btn(icon('trash') + ' Borrar con todo', 'g-borrar', 'data-gid="' + g.id + '"', 'small ghost danger') + '</div></li>').join('') + '</ul><p class="muted small">Un grupo archivado conserva su lista, calificaciones, acta y fechas de parciales. Para borrarlo con todos sus datos, escribe su grupo para confirmar.</p></details>');
    return { t: 'Mis grupos', h: h };
  };

  /* ---------- agregar un grupo ---------- */
  const estado = () => {
    if (E.ui.gn) return E.ui.gn;
    const g = D.grupoActual() || {}, ps = D.parciales(), mod = g.modulo || 'II', sub = E.mods ? E.mods.subSugeridos(mod, ps) : {}; ps.forEach(p => { if (sub[p.id] == null) sub[p.id] = ''; });
    return (E.ui.gn = { grupo: '', semestre: '', carrera: g.carrera || 'TÉCNICO EN MECATRÓNICA', nombre: '', modulo: mod, sub: sub, inicio: u.today(), horario: [] });
  };
  const abrevia = c => { const t = u.norm(c).replace(/TECNICO EN |TECNICO /, '').split(' ').filter(w => w.length > 2 && !/^\d+$/.test(w))[0] || 'GRUPO'; return t.slice(0, 3); };
  // palabra principal de la carrera tal como está escrita (con acentos): «TÉCNICO EN MECATRÓNICA 2025» → «Mecatrónica»
  const palabra = c => String(c || '').trim().split(/\s+/).find(w => w.length > 2 && !/^\d+$/.test(w) && ['TECNICO', 'TECNICA'].indexOf(u.norm(w)) < 0) || '';
  const sugerido = s => { const gr = String(s.grupo || '').trim(); if (!gr) return ''; const m = gr.match(/^(\d+)\s*°?\s*([A-Za-z]*)$/), w = palabra(s.carrera); return (m ? m[1] + '°' + m[2].toUpperCase() : gr) + (w ? ' ' + u.cap(w.toLowerCase()) : ''); };
  function nuevoHTML() {
    const s = estado(), ps = D.parciales(), mods = E.PROGRAMA.modulos, m = mods[s.modulo] || { sub: {} };
    const f = (k, lbl, ph, type) => '<label class="fld"><span>' + lbl + '</span><input class="inp" ' + (type ? 'type="' + type + '" ' : '') + 'data-ch="gn" data-f="' + k + '" value="' + esc(s[k] || '') + '" placeholder="' + esc(ph || '') + '"></label>';
    return '<h3>＋ Agregar grupo</h3><div class="fgrid">' + f('grupo', 'Grupo', 'Ej. 5B') + f('semestre', 'Semestre', 'Ej. 5', 'number') + '</div>' +
      f('carrera', 'Carrera (como en la lista oficial)', 'Ej. TÉCNICO EN MECATRÓNICA') +
      '<label class="fld"><span>Nombre corto (como lo verás en la app)</span><input class="inp" data-ch="gn" data-f="nombre" value="' + esc(s.nombre || '') + '" placeholder="' + esc(sugerido(s) || 'Ej. 5°B Mecatrónica') + '"></label>' +
      '<div class="fgrid"><label class="fld"><span>Módulo</span><select data-ch="gn" data-f="modulo">' + Object.keys(mods).map(k => '<option value="' + k + '"' + (s.modulo === k ? ' selected' : '') + '>' + k + ' · ' + esc(mods[k].nombre) + '</option>').join('') + '</select></label>' + f('inicio', 'Inicio con el grupo', '', 'date') + '</div>' +
      '<div class="fgrid c4">' + ps.map(p => '<label class="fld"><span>Submódulo · ' + esc(p.nombre) + '</span><select data-ch="gn-sub" data-pid="' + p.id + '"><option value="">—</option>' + Object.keys(m.sub).map(k => '<option value="' + k + '"' + (s.sub[p.id] === k ? ' selected' : '') + '>' + k + ' · ' + esc(u.cap(String(m.sub[k].nombre || '').toLowerCase()).slice(0, 40)) + '</option>').join('') + '</select></label>').join('') + '</div>' +
      '<h4>Horario (' + horasDe(s.horario) + ' h/semana)</h4>' + (s.horario.length ? s.horario.map((b, i) => '<div class="hrow"><select data-ch="gn-hor" data-i="' + i + '" data-f="dia" aria-label="Día">' + [1, 2, 3, 4, 5, 6].map(d => '<option value="' + d + '"' + (Number(b.dia) === d ? ' selected' : '') + '>' + DIAS[d] + '</option>').join('') + '</select>' +
        '<input type="time" value="' + esc(b.inicio) + '" data-ch="gn-hor" data-i="' + i + '" data-f="inicio" aria-label="Inicio"><input type="time" value="' + esc(b.fin) + '" data-ch="gn-hor" data-i="' + i + '" data-f="fin" aria-label="Fin"><input type="number" min="1" value="' + esc(b.horas) + '" data-ch="gn-hor" data-i="' + i + '" data-f="horas" inputmode="numeric" aria-label="Horas">' +
        '<button type="button" class="iconbtn" data-act="gn-hor-del" data-i="' + i + '" aria-label="Quitar bloque">' + icon('x') + '</button><select class="hlugar" data-ch="gn-hor" data-i="' + i + '" data-f="lugar" aria-label="Lugar">' + Object.keys(LUGAR).map(k => '<option value="' + k + '"' + ((b.lugar || 'aula') === k ? ' selected' : '') + '>' + LUGAR[k] + '</option>').join('') + '</select></div>').join('') : '<p class="muted small">Agrega cada bloque de clase con este grupo (día, hora de inicio y fin). Las horas se calculan solas con módulos de 50 min; cámbialas si no.</p>') +
      btn(icon('plus') + ' Agregar bloque', 'gn-hor-add', '', 'small') +
      '<div class="row gap wrap mt">' + btn('✓ Crear grupo', 'gn-crear', '', 'primary') + '</div><p class="muted small">Después importas su lista de alumnos (Excel de la escuela o pegando los nombres). Puedes cambiar el horario cuando quieras en Ajustes → Grupo y horario.</p>';
  }
  const repinta = () => { const el = document.querySelector('#view .g-nuevo'); if (el) el.innerHTML = nuevoHTML(); else E.render(); };
  CH.gn = el => { const s = estado(), k = el.dataset.f; s[k] = el.value; if (k === 'modulo') { const sug = E.mods ? E.mods.subSugeridos(s.modulo, D.parciales()) : {}; Object.keys(s.sub).forEach(p => { s.sub[p] = sug[p] || ''; }); const sem = (E.PROGRAMA.modulos[s.modulo] || {}).semestre; if (sem && !s.semestre) s.semestre = String(sem); repinta(); } else if (k === 'grupo' || k === 'carrera') { const n = document.querySelector('#view .g-nuevo [data-f="nombre"]'); if (n) n.placeholder = sugerido(s) || 'Ej. 5°B Mecatrónica'; } };
  CH['gn-sub'] = el => { estado().sub[el.dataset.pid] = el.value; };
  CH['gn-hor'] = el => {
    const s = estado(), b = s.horario[Number(el.dataset.i)]; if (!b) return; const f = el.dataset.f;
    b[f] = f === 'dia' || f === 'horas' ? Number(el.value) : el.value;
    if ((f === 'inicio' || f === 'fin') && b.inicio && b.fin) { const mins = C.minutosSinReceso(b.inicio, b.fin); if (mins > 0) b.horas = Math.max(1, Math.round(mins / 50)); repinta(); }
  };
  A['gn-hor-add'] = () => { const s = estado(), ult = s.horario[s.horario.length - 1]; s.horario.push(ult ? { dia: Math.min(6, Number(ult.dia) + 1), inicio: ult.inicio, fin: ult.fin, horas: ult.horas, lugar: ult.lugar || 'aula' } : { dia: 1, inicio: '07:30', fin: '08:20', horas: 1, lugar: 'aula' }); repinta(); };
  A['gn-hor-del'] = el => { estado().horario.splice(Number(el.dataset.i), 1); repinta(); };
  A['gn-crear'] = () => {
    const s = estado(), gr = String(s.grupo || '').trim().toUpperCase();
    if (!gr) { u.toast('Escribe el grupo (por ejemplo 5B)', 'err'); return; }
    const malos = s.horario.filter(b => !b.inicio || !b.fin || aMin(b.fin) <= aMin(b.inicio)); if (malos.length) { u.toast('Revisa el horario: cada bloque necesita hora de inicio y una de fin posterior', 'err', 4000); return; }
    let id = (gr + abrevia(s.carrera)).replace(/[^A-Z0-9]/g, '') || 'G'; const base = id; let k = 2; while (S.docs['grupo:' + id]) id = base + (k++);
    const nombre = String(s.nombre || '').trim() || sugerido(s) || gr, sub = {}; Object.keys(s.sub).forEach(p => { if (s.sub[p]) sub[p] = s.sub[p]; });
    S.put('grupo:' + id, Object.assign({ id: id, nombre: nombre, carrera: String(s.carrera || '').trim(), semestre: String(s.semestre || '').trim(), grupo: gr, modulo: s.modulo, submodulos: sub, inicioDocente: s.inicio || u.today(), horario: s.horario.map(b => ({ dia: Number(b.dia), inicio: b.inicio, fin: b.fin, horas: Number(b.horas) || 1, lugar: b.lugar || 'aula' })), alumnos: [] }, E.mods && E.mods.flujoDef(s.modulo) ? { flujo: true } : {}));
    if (E.mods) E.mods.cargar(s.modulo);
    E.ui.gn = null; D.setGrupo(id);
    const ch = G.choques(); u.toast('Grupo ' + nombre + ' creado: ahora importa su lista' + (ch.length ? '. Ojo: choca su horario con otro grupo' : ''), ch.length ? 'err' : 'ok', 4500);
    location.hash = '#/alumnos';
  };

  /* ---------- archivar, reactivar, borrar ---------- */
  A['g-arch'] = el => {
    const g = D.grupo(el.dataset.gid); if (!g) return;
    if (!confirm('¿Archivar ' + G.corto(g) + '? Ya no saldrá para cambiar de grupo, en Pendientes ni al abrir la app. Su lista, calificaciones, acta y fechas de parciales se guardan y puedes verlo o reactivarlo cuando quieras.')) return;
    const fechas = u.clone(S.get('parciales') || E.DEFAULTS.parciales);
    S.update('grupo:' + g.id, x => { x.archivado = u.today(); x.parciales = fechas; });
    if (D.grupoActual() && D.grupoActual().id === g.id) D.setGrupo((D.gruposActivos()[0] || {}).id || null);
    u.toast(G.corto(g) + ' archivado', 'ok');
  };
  A['g-react'] = el => { const g = D.grupo(el.dataset.gid); if (!g) return; S.update('grupo:' + g.id, x => { delete x.archivado; delete x.parciales; }); u.toast(G.corto(g) + ' activo otra vez (usa las fechas de parciales de Ajustes)', 'ok', 3500); };
  A['g-borrar'] = async el => {
    const g = D.grupo(el.dataset.gid); if (!g) return;
    if (D.grupos().length <= 1) { u.toast('Es tu único grupo: no se puede borrar', 'err'); return; }
    const t = prompt('Se borrará ' + G.corto(g) + ' con TODOS sus datos: lista, asistencias, calificaciones, exámenes, libreta, evidencias… No se puede deshacer.\n\nPara confirmar, escribe su grupo: ' + g.grupo);
    if (t == null || u.norm(t) !== u.norm(g.grupo)) { if (t != null) u.toast('No coincide: no se borró nada', 'err'); return; }
    await Promise.resolve();   // fuera de «Deshacer»
    const re = new RegExp('^[A-Za-z]+:' + g.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(:|$)'); let n = 0;
    const ev = S.get('evid:' + g.id); const fotos = ((ev && ev.items) || []).filter(x => x.subido && x.path).reduce((a, x) => a.concat([x.path + '.jpg', x.path + '_m.jpg']), []);
    if (E.evid && E.evid.local) ((ev && ev.items) || []).forEach(x => { E.evid.local.del(x.id); });
    Object.keys(S.docs).forEach(k => { const d = S.docs[k]; if (!d || d.deleted) return; const dd = d.data || {}; if (re.test(k) || ((/^bit:|^plan:/.test(k)) && dd.grupoId === g.id)) { S.del(k); n++; } });
    if (fotos.length) S.update('evid:_borrar', d => { d.items = []; d.borrar = (d.borrar || []).concat(fotos); }, {});
    if (D.grupoActual() && D.grupoActual().id === g.id) D.setGrupo((D.gruposActivos()[0] || {}).id || null);
    u.toast('Borré ' + G.corto(g) + ' (' + n + ' registros)', 'ok', 3500); E.render(); if (E.evid && fotos.length) E.evid.subir();
  };
})();

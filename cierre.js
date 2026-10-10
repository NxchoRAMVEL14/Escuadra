/* Escuadra · Cierre del día: 5 minutos al terminar tus clases para dejar registrado lo que pasó.
   Lista, actividades que se dieron, la tarea que tocaba entregar, participación y puntos extra, quién estuvo excelente o
   muy mal (con motivo, solo lo escolar) y una nota para la bitácora. Te lo recuerda en Inicio desde que termina tu última
   clase hasta que lo cierres. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const CR = E.cierre = {};
  const KC = (g, f) => 'cierre:' + g.id + ':' + f;
  const MOT = {
    excelente: ['Trabajo excelente', 'Ayudó a sus compañeros', 'Gran participación', 'Terminó el reto', 'Muy buena actitud'],
    muymal: ['No trabajó', 'Se distrajo toda la clase', 'Usó el celular', 'Faltó al respeto', 'No trajo material', 'Llegó tarde']
  };
  // ⭐ y 👎 son observaciones (definidas en perfil.js): se ven en el pase de lista, el perfil y la ficha
  const corto = n => u.corto(n);
  const ahora = () => { const d = new Date(); return u.pad(d.getHours()) + ':' + u.pad(d.getMinutes()); };
  CR.doc = (g, f) => S.get(KC(g, f)) || {};
  const finDia = (g, f) => C.bloquesDia(g, f).map(b => b.fin).filter(Boolean).sort().slice(-1)[0] || '23:59';
  const huboClase = (g, f) => { let d = null; try { d = E.clases.dia(g, f); } catch (e) { } return d ? d.bloques.some(b => !b.perdida) : C.esClase(g, f); };
  // días de clase de la última semana que no se han cerrado (hoy cuenta desde que termina tu última clase)
  CR.pendientes = (g, hoy) => {
    hoy = hoy || u.today(); const out = [];
    for (let i = 7; i >= 0; i--) {
      const f = u.addDays(hoy, -i); if (!C.esClase(g, f) || CR.doc(g, f).ok || !huboClase(g, f)) continue;
      if (f === hoy && ahora() < finDia(g, f)) continue; out.push(f);
    }
    return out;
  };
  // tarea que tocaba entregar ese día: la que se dejó la clase anterior
  const tareas = (g, f) => {
    const p = D.parciales().find(x => f >= x.inicio && f <= x.fin); if (!p || !E.libreta) return { pid: null, list: [], def: '' };
    let T; try { T = E.libreta.tareas(g, p.id); } catch (e) { return { pid: p.id, list: [], def: '' }; }
    const list = T.todas.filter(t => !t.f || t.f <= f).filter(t => !(t.material && t.tipo === 'tarea')).sort((a, b) => String(b.f || '').localeCompare(String(a.f || '')));
    const ant = C.claseAnterior(g, f), hoyLib = list.find(t => t.f === f && t.tipo === 'libreta'), deb = list.find(t => t.tipo === 'tarea' && t.f === ant);
    return { pid: p.id, list: list, def: (deb || hoyLib || {}).key || '' };
  };

  /* ---------- vista ---------- */
  V.cierre = f => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Cierre del día');
    const hoy = u.today(); if (!f) { const p = CR.pendientes(g, hoy); f = p[0] || (C.esClase(g, hoy) ? hoy : C.claseAnterior(g, hoy) || hoy); }
    const doc = CR.doc(g, f), ant = C.claseAnterior(g, f), sig = C.siguienteClase(g, f);
    let d = null; try { d = E.clases.dia(g, f); } catch (e) { }
    const asis = S.get('asis:' + g.id + ':' + f), part = S.get('part:' + g.id + ':' + f) || {}, obs = S.get('obs:' + g.id + ':' + f) || {};
    const pres = al.filter(a => !asis || ['A', 'R'].indexOf(asis[a.id] || 'A') >= 0);
    const T = tareas(g, f), tsel = doc.tarea != null ? doc.tarea : T.def, tt = T.list.find(t => t.key === tsel);
    const lb = T.pid && E.libreta ? E.libreta.doc(g, T.pid) : {}, mk = aid => (((lb.marcas || {})[aid]) || {})[tsel];
    const nMk = tt ? al.filter(a => mk(a.id) != null).length : 0, nPart = al.reduce((s, a) => s + Number(part[a.id] || 0), 0);
    const nExc = Object.keys(obs).filter(k => (obs[k] || []).indexOf('excelente') >= 0).length, nMal = Object.keys(obs).filter(k => (obs[k] || []).indexOf('muymal') >= 0).length;
    const actOk = !!doc.act || !!(d && d.bloques.some(b => b.perdida || b.recorte || b.adelanto));
    const pasos = [['Lista', !!asis], ['Actividades', actOk], ['Tarea', tsel === 'none' || (tt && nMk >= Math.ceil(pres.length / 2))], ['Participación', nPart > 0], ['Destacados', nExc + nMal > 0], ['Nota', !!doc.nota]];
    let h = '<div class="datebar"><button type="button" class="iconbtn" data-act="go" data-to="cierre/' + (ant || f) + '" ' + (ant ? '' : 'disabled') + ' aria-label="Día anterior">' + icon('chevL') + '</button><div class="datebox"><b>' + u.cap(u.fLarga(f)) + '</b><span class="small muted">' + (doc.ok ? '✓ Día cerrado' : 'Cierre del día') + '</span></div><button type="button" class="iconbtn" data-act="go" data-to="cierre/' + (sig || f) + '" ' + (sig ? '' : 'disabled') + ' aria-label="Día siguiente">' + icon('chevR') + '</button></div>';
    h += card('<h3>📝 Cierre del día</h3><p class="muted small">5 minutos al terminar: lo que no se anota hoy, mañana ya no se recuerda igual. Todo entra solo a Calificaciones, Libreta, Perfil y Bitácora.</p><div class="cr-pasos">' + pasos.map(p => '<span class="chip ' + (p[1] ? 'ok' : '') + '">' + (p[1] ? '✓ ' : '○ ') + p[0] + '</span>').join('') + '</div>');
    // 1) lista
    h += card('<h3>1 · Lista</h3>' + (asis ? '<p class="small">✓ Lista pasada: <b>' + pres.length + '</b> presentes, <b>' + (al.length - pres.length) + '</b> faltas.</p>' + link('Ver o corregir', 'lista/' + f, 'small') : '<p class="small">Todavía no pasas lista de este día.</p><div class="row gap wrap">' + link(icon('check') + ' Pasar lista', 'lista/' + f, 'primary') + btn('Todos presentes', 'asis-todos', 'data-fecha="' + f + '"') + '</div>'));
    // 2) actividades
    const est = b => b.perdida ? ['No se dio', 'bad'] : b.recorte ? ['Faltó ' + b.recorte + ' h', 'warn'] : b.adelanto ? ['Me adelanté ' + b.adelanto + ' h', 'ok'] : ['Como se planeó', ''];
    h += card('<h3>2 · Lo que se hizo</h3>' + (d && d.bloques.length ? '<ul class="cr-act">' + d.bloques.map(b => '<li><span><b>' + b.inicio + '–' + b.fin + '</b> ' + esc(b.perdida ? 'Sin clase' : b.parts.map(x => x.it.t).join(' + ') || 'Libre') + '</span><span class="chip ' + est(b)[1] + '">' + est(b)[0] + '</span></li>').join('') + '</ul>' +
      '<div class="row gap wrap">' + (actOk ? '<span class="chip ok">✓ Confirmado</span>' : btn('✓ Se dio así', 'cr-act', 'data-f="' + f + '"', 'primary')) + link('Ajustar (faltó tiempo, me adelanté, no se dio)', 'clase/' + f, 'small') + '</div>' : '<p class="small muted">No hay guion para este día.</p>'));
    if (E.pend) h += E.pend.evidHTML(g, f);
    // 3) alumnos: tarea, participación, excelente / muy mal
    const opt = '<option value="">— Elige la tarea —</option>' + T.list.map(t => '<option value="' + esc(t.key) + '"' + (t.key === tsel ? ' selected' : '') + '>' + (t.f ? u.fCorta(t.f) + ' · ' : '') + (t.tipo === 'tarea' ? 'Tarea: ' : t.tipo === 'libreta' ? 'En libreta: ' : t.tipo === 'bitacora' ? 'Bitácora: ' : '') + esc(String(t.t).slice(0, 70)) + '</option>').join('') + '<option value="none"' + (tsel === 'none' ? ' selected' : '') + '>No revisé tarea hoy</option>';
    h += card('<h3>3 · Alumnos</h3><label class="fld"><span>Tarea que revisaste</span><select data-ch="cr-tarea" data-f="' + f + '">' + opt + '</select></label>' +
      (tt ? '<p class="small muted">' + (tt.key === T.def ? 'Es la que dejaste la clase anterior. ' : '') + '✓ completa · ½ incompleta · ✗ no la hizo: entra a la revisión de libreta.</p>' + (E.cap ? '<div class="row gap wrap">' + btn('🃏 Revisar por tarjetas', 'tj-cr', 'data-f="' + f + '"', 'small') + '</div>' : '') : '') +
      '<p class="small muted">Participación y puntos extra: + / −. ⭐ excelente o 👎 muy mal hoy, con motivo si quieres.</p>' +
      (E.rap ? E.rap.filtroHTML('cierre') : '') + '<ul class="cr-al" data-kb="cierre">' + al.map(a => {
        const falto = asis && ['A', 'R'].indexOf(asis[a.id] || 'A') < 0, v = tt ? mk(a.id) : null, o = obs[a.id] || [], ex = o.indexOf('excelente') >= 0, ml = o.indexOf('muymal') >= 0, n = Number(part[a.id] || 0), mt = (doc.mot || {})[a.id] || [];
        return '<li class="' + (falto ? 'falto' : '') + '"' + (E.rap ? E.rap.qAttr(a) : '') + ' data-kbr="' + a.id + '"><div class="cr-n"><b>' + a.num + '.</b> ' + esc(corto(a.nombre)) + (falto ? ' <span class="chip">faltó</span>' : '') + '</div><div class="cr-c">' +
          (tt ? '<div class="cl-seg">' + [[2, '✓', 'ok', 1], [1, '½', 'warn', 2], [0, '✗', 'bad', 3]].map(x => btn(x[1], 'cr-mk', 'data-f="' + f + '" data-aid="' + a.id + '" data-v="' + x[0] + '" data-k="' + x[3] + '"', 'small' + (v != null && Number(v) === x[0] ? ' on ' + x[2] : ''))).join('') + '</div>' : '') +
          '<div class="cr-part">' + btn('−', 'cr-part', 'data-f="' + f + '" data-aid="' + a.id + '" data-d="-1" aria-label="Quitar participación"', 'small ghost') + '<b>' + n + '</b>' + btn('+', 'cr-part', 'data-f="' + f + '" data-aid="' + a.id + '" data-d="1" aria-label="Sumar participación"', 'small') + '</div>' +
          btn('⭐', 'cr-obs', 'data-f="' + f + '" data-aid="' + a.id + '" data-o="excelente" aria-label="Excelente hoy"', 'small cr-o' + (ex ? ' on ok' : '')) + btn('👎', 'cr-obs', 'data-f="' + f + '" data-aid="' + a.id + '" data-o="muymal" aria-label="Muy mal hoy"', 'small cr-o' + (ml ? ' on bad' : '')) + '</div>' +
          (ex || ml ? '<div class="cr-mot">' + MOT[ex ? 'excelente' : 'muymal'].map(x => '<button type="button" class="rt-chip' + (mt.indexOf(x) >= 0 ? ' on' : '') + '" data-act="cr-mot" data-f="' + f + '" data-aid="' + a.id + '" data-m="' + esc(x) + '">' + esc(x) + '</button>').join('') + '</div>' : '') + '</li>';
      }).join('') + '</ul>' + (tt ? '<div class="row gap wrap">' + btn('✓ a todos los presentes sin marca', 'cr-mk-todos', 'data-f="' + f + '"', 'small ghost') + '</div>' : ''));
    // 4) nota del día
    h += card('<h3>4 · Nota del día</h3><label class="fld"><span>¿Qué pasó hoy? (va a tu bitácora)</span><textarea class="inp" id="cr-nota" rows="3" placeholder="Ej. El grupo entendió Grashof; 3 equipos no terminaron el prototipo; mañana empiezo con el calentamiento de engranes.">' + esc(doc.nota || '') + '</textarea></label>' +
      '<div class="row gap wrap mt">' + btn(doc.ok ? '✓ Guardar cambios' : '✓ Cerrar el día', 'cr-cerrar', 'data-f="' + f + '"', 'primary') + (doc.ok ? '<span class="chip ok">Cerrado ' + esc(String(doc.ok).slice(11, 16)) + '</span>' : '') + '</div>');
    const pend = CR.pendientes(g, hoy).filter(x => x !== f);
    if (pend.length) h += '<p class="small">Otros días sin cerrar: ' + pend.map(x => '<a href="#/cierre/' + x + '">' + u.fCorta(x) + '</a>').join(' · ') + '</p>';
    return { t: 'Cierre del día', h: h };
  };

  /* ---------- acciones ---------- */
  const upC = (f, fn) => { const g = D.grupoActual(); S.update(KC(g, f), d => { fn(d); }, {}); };
  A['cr-act'] = el => upC(el.dataset.f, d => { d.act = true; });
  CH['cr-tarea'] = el => upC(el.dataset.f, d => { d.tarea = el.value; });
  // fijar: pone el valor (tarjetas); sin fijar, tocar el mismo valor lo quita
  const marca = (g, f, aid, v, soloVacio, fijar) => {
    const T = tareas(g, f), key = CR.doc(g, f).tarea != null ? CR.doc(g, f).tarea : T.def, t = T.list.find(x => x.key === key); if (!t || !T.pid) return;
    S.update('libreta:' + g.id + ':' + T.pid, d => {
      d.marcas = d.marcas || {}; d.quitar = d.quitar || {}; d.poner = d.poner || {}; d.extra = d.extra || [];
      if (!t.cuenta) { delete d.quitar[key]; d.poner[key] = true; }
      (Array.isArray(aid) ? aid : [aid]).forEach(id => { const m = d.marcas[id] = d.marcas[id] || {}; if (soloVacio) { if (m[key] == null) m[key] = v; } else if (!fijar && m[key] != null && Number(m[key]) === v) delete m[key]; else m[key] = v; });
    }, {});
    if (E.libreta.sync) E.libreta.sync(g, T.pid);
  };
  CR.marca = marca;
  CR.tareaSel = (g, f) => { const T = tareas(g, f), key = CR.doc(g, f).tarea != null ? CR.doc(g, f).tarea : T.def; return { T: T, key: key, t: T.list.find(x => x.key === key) || null }; };
  A['cr-mk'] = el => { const g = D.grupoActual(); marca(g, el.dataset.f, el.dataset.aid, Number(el.dataset.v)); };
  A['cr-mk-todos'] = el => { const g = D.grupoActual(), f = el.dataset.f, asis = S.get('asis:' + g.id + ':' + f); marca(g, f, D.alumnos(g).filter(a => !asis || ['A', 'R'].indexOf(asis[a.id] || 'A') >= 0).map(a => a.id), 2, true); };
  A['cr-part'] = el => { const g = D.grupoActual(), aid = el.dataset.aid, dd = Number(el.dataset.d); S.update('part:' + g.id + ':' + el.dataset.f, d => { d[aid] = Math.max(0, Number(d[aid] || 0) + dd); if (!d[aid]) delete d[aid]; }, {}); if (navigator.vibrate) navigator.vibrate(8); };
  A['cr-obs'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, aid = el.dataset.aid, o = el.dataset.o, otro = o === 'excelente' ? 'muymal' : 'excelente';
    S.update('obs:' + g.id + ':' + f, d => { const l = (d[aid] || []).filter(x => x !== otro), i = l.indexOf(o); if (i >= 0) l.splice(i, 1); else l.push(o); if (l.length) d[aid] = l; else delete d[aid]; }, {});
    upC(f, d => { if (d.mot) delete d.mot[aid]; });
  };
  A['cr-mot'] = el => upC(el.dataset.f, d => { d.mot = d.mot || {}; const l = d.mot[el.dataset.aid] = d.mot[el.dataset.aid] || [], i = l.indexOf(el.dataset.m); if (i >= 0) l.splice(i, 1); else l.push(el.dataset.m); });
  A['cr-cerrar'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, nota = ((document.getElementById('cr-nota') || {}).value || '').trim(), ya = !!CR.doc(g, f).ok;
    upC(f, d => { d.nota = nota; d.ok = d.ok || new Date().toISOString(); d.act = true; });
    if (nota) { const id = 'cierre_' + g.id + '_' + f; S.put('bit:' + id, { id: id, fecha: f, grupoId: g.id, texto: 'Cierre del día: ' + nota }); }
    u.toast(ya ? 'Cambios guardados' : 'Día cerrado. ¡Buen trabajo!', 'ok');
    const p = CR.pendientes(g, u.today()); if (!ya) location.hash = p.length ? '#/cierre/' + p[0] : '#/inicio';
  };

  /* ---------- Inicio: recordatorio y alumnos que van muy mal ---------- */
  CR.inicioHTML = (g, hoy) => {
    const p = CR.pendientes(g, hoy); if (!p.length) return '';
    const esHoy = p[p.length - 1] === hoy, viejos = p.filter(x => x !== hoy);
    return card('<h3>📝 ' + (esHoy ? 'Cierra el día de hoy' : 'Tienes días sin cerrar') + '</h3><p class="small">' + (esHoy ? 'Ya terminaron tus clases: anota lista, tarea, participación, quién estuvo excelente o muy mal y una nota. Son 5 minutos.' : 'Anota lo que pasó mientras todavía te acuerdas.') + '</p>' +
      (viejos.length ? '<p class="small muted">Sin cerrar: ' + viejos.map(x => '<a href="#/cierre/' + x + '">' + u.fCorta(x) + '</a>').join(' · ') + '</p>' : '') + link('📝 Cerrar ' + (esHoy ? 'el día' : u.fCorta(p[0])), 'cierre/' + (esHoy ? hoy : p[0]), 'primary'), 'accent');
  };
  // quién junta 2 o más 👎 en las últimas 2 semanas
  CR.atencion = (g, hoy) => {
    hoy = hoy || u.today(); const desde = u.addDays(hoy, -14), cnt = {}, mot = {};
    S.keys('obs:' + g.id + ':').forEach(k => { const f = k.split(':').pop(); if (f < desde || f > hoy) return; const d = S.get(k) || {}; Object.keys(d).forEach(aid => { if ((d[aid] || []).indexOf('muymal') >= 0) { cnt[aid] = (cnt[aid] || 0) + 1; ((CR.doc(g, f).mot || {})[aid] || []).forEach(m => { (mot[aid] = mot[aid] || {})[m] = (mot[aid][m] || 0) + 1; }); } }); });
    return Object.keys(cnt).filter(aid => cnt[aid] >= 2).map(aid => ({ a: D.alumno(g, aid), n: cnt[aid], mot: Object.keys(mot[aid] || {}).sort((x, y) => mot[aid][y] - mot[aid][x]) })).filter(x => x.a).sort((x, y) => y.n - x.n);
  };
  CR.atencionHTML = (g, hoy) => {
    const L = CR.atencion(g, hoy); if (!L.length) return '';
    return card('<h3>👀 Ojo con ellos</h3><p class="muted small">Tuvieron 2 o más días «muy mal» en las últimas 2 semanas. Habla con cada uno en privado y pregunta qué está pasando antes de sancionar; si sigue, coméntalo en tutoría u orientación.</p><ul class="risk">' +
      L.map(x => '<li><span><a href="#/alumno/' + x.a.id + '">' + esc(x.a.nombre) + '</a>' + (x.mot.length ? '<br><small class="muted">' + esc(x.mot.slice(0, 3).join(', ')) + '</small>' : '') + '</span><span class="chip bad">👎 ' + x.n + '</span></li>').join('') + '</ul>');
  };

  /* ---------- notificación al abrir la app después de clase (si las activaste) ---------- */
  CR.notificar = () => {
    try {
      if (!('Notification' in window) || Notification.permission !== 'granted') return; const g = D.grupoActual(); if (!g) return;
      const hoy = u.today(), p = CR.pendientes(g, hoy); if (p.indexOf(hoy) < 0) return;
      let sent = {}; try { sent = JSON.parse(localStorage.getItem('escuadra.notif') || '{}'); } catch (e) { }
      const k = 'cierre@' + hoy; if (sent[k]) return; sent[k] = 1; localStorage.setItem('escuadra.notif', JSON.stringify(sent));
      const txt = 'Ya terminaron tus clases: haz el cierre del día (lista, tarea, participación y destacados).';
      const show = () => { try { new Notification('Escuadra', { body: txt, icon: 'icon-192.png', tag: 'cierre' }); } catch (e) { } };
      if (navigator.serviceWorker && navigator.serviceWorker.controller) navigator.serviceWorker.ready.then(reg => reg.showNotification('Escuadra', { body: txt, icon: 'icon-192.png', tag: 'cierre' })).catch(show); else show();
    } catch (e) { }
  };
  setTimeout(CR.notificar, 4000); setInterval(CR.notificar, 5 * 60 * 1000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') CR.notificar(); });
})();

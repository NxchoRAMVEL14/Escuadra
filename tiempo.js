/* Escuadra · Tu tiempo (v1.26).
   1) Días sin clase: suspensión, CTE, puente o evento para varios grupos y días de un jalón; el guion se recorre solo y,
      si ya no alcanza el parcial, la app propone qué recortar: nunca las evidencias ni las actividades clave del programa SEP.
   2) Calendario para Google Calendar (.ics): parciales, capturas, asuetos, días sin clase, entregas, exámenes,
      simulacros y juntas de padres. Se importa una vez; si lo vuelves a importar, Google actualiza los mismos eventos.
   3) Expediente docente de fin de semestre: concentrado de calificaciones y asistencia, planeaciones, seguridad,
      constancias y reportes, en un documento para la dirección.
   4) Chequeo de salud de los datos: duplicados, calificaciones fuera de rango, actividades sin calificar, fechas raras.
   5) Compartir con la academia: exporta tu banco de preguntas, ajustes del guion, reglamento, lista de revisión e
      inventario (nunca datos de alumnos) para otro docente de Mecatrónica, y los importa.
   6) Modo demostración: un grupo ficticio en memoria para enseñar la app sin mostrar datos reales; no guarda nada. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const TI = E.tiempo = {};
  const val = id => ((document.getElementById(id) || {}).value || '').trim();
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

  /* ================= 1) DÍAS SIN CLASE ================= */
  const KSC = 'sinClase';
  TI.sinClase = () => (S.get(KSC) || []).filter(x => x && x.id);
  const MOT = { suspension: '⛔ Suspensión', cte: '👥 Consejo técnico', puente: '🌉 Puente', evento: '🎉 Evento escolar', otro: '• Otro' };
  // claves de bloque (fecha@inicio) de un grupo entre dos fechas
  TI.claves = (g, desde, hasta) => { const out = []; for (let f = desde; f <= hasta; f = u.addDays(f, 1)) { if (!C.enParcial(f) || C.esAsueto(f)) continue; C.bloquesDia(g, f).forEach(b => out.push(f + '@' + b.inicio)); } return out; };
  // recortes del guion del grupo en curso (para que quepa el parcial): {itemId: {h, modo, f}}
  const KR = g => 'recorteGuion:' + g.id;
  TI.recortes = g => S.get(KR(g)) || {};
  if (E.clases && E.clases.seq) {
    const seq0 = E.clases.seq;
    E.clases.seq = (g, pid) => {
      const out = seq0(g, pid), rc = g ? TI.recortes(g) : {}; if (!Object.keys(rc).length) return out;
      return out.filter(x => !(rc[x.id] && rc[x.id].modo === 'tarea' && x.h0 == null)).map(x => { const r = rc[x.id]; if (!r || r.modo !== 'menos' || x.h0 != null) return x; return Object.assign({}, x, { h: Math.max(1, x.h - (Number(r.dh) || 1)), recortado: r }); });
    };
  }
  // qué se puede recortar sin tocar lo que pide el programa: primero desarrollo sin evidencia, luego teoría larga
  TI.sugerir = (g, pid) => {
    let pl = null; try { pl = E.clases.plan(g, pid); } catch (e) { return null; } if (!pl) return null;
    const ips = D.parciales().findIndex(x => x.id === pid), sigP = D.parciales()[ips + 1], deCorrido = E.clases.flujo(g) && sigP && (g.submodulos || {})[sigP.id];
    const hoy = u.today(), empezados = {}; pl.bloques.forEach(b => { if (b.fecha < hoy && !b.perdida) b.parts.forEach(pt => { empezados[pt.it.id] = 1; }); });
    const rc = TI.recortes(g), cand = [];
    pl.seq.forEach(x => {
      if (empezados[x.id] || x.h0 != null || x.examen) return;
      const proteg = !!x.ev || x.m === 'c' || /Evaluaci[oó]n|Encuadre/.test(x.tipo || '');
      const p = proteg ? 99 : (x.m === 'd' && /Teor[ií]a/.test(x.tipo || '') ? 0 : x.m === 'd' ? 1 : 2) - (x.h >= 3 ? 0.5 : 0);
      cand.push({ it: x, proteg: proteg, p: p, puedeMenos: x.h >= 2, puedeTarea: !proteg && x.ac == null && x.h <= 2 && /Teor[ií]a/.test(x.tipo || ''), rc: rc[x.id] || null });
    });
    cand.sort((a, b) => a.p - b.p || b.it.h - a.it.h);
    let falta = pl.faltan, out = [];
    if (falta > 0 && !deCorrido) cand.filter(c => !c.proteg && !c.rc && (c.puedeMenos || c.puedeTarea)).forEach(c => { if (falta <= 0) return; out.push(c); falta -= c.puedeTarea ? c.it.h : c.puedeMenos ? 1 : 0; });
    return { pl: pl, faltan: pl.faltan, deCorrido: !!deCorrido, sug: out, proteg: cand.filter(c => c.proteg), hechos: pl.seq.filter(x => rc[x.id]).map(x => ({ it: x, rc: rc[x.id] })).concat(Object.keys(rc).filter(id => rc[id].modo === 'tarea').map(id => ({ it: { id: id, t: rc[id].t || id }, rc: rc[id] }))) };
  };
  V.sinclase = sub => {
    const gs = D.gruposActivos(), hoy = u.today(), ui = E.ui.sc = E.ui.sc || { desde: hoy, hasta: hoy, mot: 'suspension', gs: null };
    if (sub === 'recorte') return recorteV();
    let h = card('<h3>📅 Días sin clase</h3><p class="small">Suspensión, consejo técnico, puente o evento: márcalos de un jalón para todos tus grupos. Lo que tocaba esos días se recorre solo a la siguiente clase. Para un solo bloque usa «No se dio» en el guion.</p>' +
      '<div class="fgrid"><label class="fld"><span>Desde</span><input type="date" id="sc-d" value="' + ui.desde + '"></label><label class="fld"><span>Hasta</span><input type="date" id="sc-h" value="' + ui.hasta + '"></label></div>' +
      '<label class="fld"><span>Motivo</span><select id="sc-m">' + Object.keys(MOT).map(k => '<option value="' + k + '"' + (ui.mot === k ? ' selected' : '') + '>' + MOT[k] + '</option>').join('') + '</select></label>' +
      '<label class="fld"><span>Nota (opcional)</span><input id="sc-n" placeholder="Ej. Sesión del CTE, octubre"></label>' +
      '<p class="small"><b>Grupos:</b> ' + gs.map(g => '<label class="chk-in"><input type="checkbox" class="sc-g" value="' + g.id + '" checked> ' + esc(g.nombre) + '</label>').join(' ') + '</p>' +
      btn('Marcar sin clase', 'sc-add', '', 'primary') + ' ' + link('✂️ ¿Qué recortar si no alcanza?', 'sinclase/recorte', 'small'));
    const L = TI.sinClase().slice().sort((a, b) => b.desde.localeCompare(a.desde));
    if (L.length) h += card('<h3>Registrados</h3><ul class="pc-l">' + L.map(x => '<li class="info"><span class="pc-i">' + (MOT[x.mot] || '•').split(' ')[0] + '</span><div><b>' + u.cap(u.fLarga(x.desde)) + (x.hasta !== x.desde ? ' al ' + u.fLarga(x.hasta) : '') + '</b><small class="muted">' + esc((MOT[x.mot] || '').replace(/^\S+\s/, '')) + (x.nota ? ' · ' + esc(x.nota) : '') + ' · ' + Object.keys(x.keys || {}).map(id => { const g = D.grupo(id); return g ? esc(g.nombre) + ' (' + x.keys[id].length + ' bloques)' : ''; }).filter(Boolean).join(', ') + '</small></div>' + btn('↺ Sí hubo clase', 'sc-del', 'data-id="' + x.id + '"', 'small ghost') + '</li>').join('') + '</ul>');
    // impacto en el parcial actual de cada grupo
    const p = C.parcialActual();
    h += card('<h3>¿Alcanza el ' + esc(p.nombre) + '?</h3><ul class="risk">' + gs.map(g => { let s = null; try { s = TI.sugerir(g, p.id); } catch (e) { s = null; } if (!s) return ''; return '<li><span><b>' + esc(g.nombre) + '</b>: ' + (s.faltan > 0 ? (s.deCorrido ? s.faltan + ' h pasan al parcial siguiente (de corrido)' : '<b class="badc">faltan ' + s.faltan + ' h</b>') : '<span class="okc">sí alcanza</span>') + '</span>' + (s.faltan > 0 && !s.deCorrido ? link('Qué recortar', 'sinclase/recorte', 'small') : '') + '</li>'; }).join('') + '</ul>');
    return { t: 'Días sin clase', h: h };
  };
  function recorteV() {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const p = C.parcialActual(); let s = null; try { s = TI.sugerir(g, p.id); } catch (e) { s = null; }
    if (!s) return { t: 'Qué recortar', h: card('<p>Este grupo no tiene guion para el ' + esc(p.nombre) + '.</p>' + link('‹ Días sin clase', 'sinclase', 'small')) };
    let h = card('<div class="row between gap wrap"><h3>✂️ Qué recortar · ' + esc(g.nombre) + '</h3>' + link('‹ Días sin clase', 'sinclase', 'small ghost') + '</div>' +
      (s.faltan > 0 ? (s.deCorrido ? '<p class="note info">Este módulo va de corrido: las ' + s.faltan + ' h que no caben pasan al parcial siguiente. Recorta solo si tampoco alcanza el semestre.</p>' : '<p class="note bad">Te faltan <b>' + s.faltan + ' h</b> para terminar el ' + esc(p.nombre) + '.</p>') : '<p class="note ok">El parcial alcanza. No hace falta recortar.</p>') +
      '<p class="muted small">Nos guiamos por el programa SEP: no se recortan las evidencias, el cierre, el encuadre ni la evaluación. Se propone primero comprimir desarrollo y teoría larga, o dejar teoría corta como tarea con su lectura.</p>');
    if (s.sug.length) h += card('<h3>Propuesta</h3><ul class="risk">' + s.sug.map(c => '<li><span><b>' + esc(c.it.t) + '</b><br><small class="muted">' + c.it.h + ' h · ' + esc(c.it.tipo || '') + (c.it.ac != null ? ' · actividad clave ' + (Number(c.it.ac) + 1) + ' del programa: se conserva, solo se comprime' : '') + '</small></span><span class="row gap">' + (c.puedeMenos ? btn('−1 h', 'sc-rec', 'data-id="' + c.it.id + '" data-m="menos"', 'small nw') : '') + (c.puedeTarea ? btn('Pasar a tarea', 'sc-rec', 'data-id="' + c.it.id + '" data-m="tarea" data-t="' + esc(c.it.t) + '"', 'small ghost') : '') + '</span></li>').join('') + '</ul>');
    if (s.hechos.length) h += card('<h3>Ya recortado</h3><ul class="sg-l">' + s.hechos.map(x => '<li><span>' + esc(x.it.t) + ' · <b>' + (x.rc.modo === 'tarea' ? 'se dejó de tarea' : '−' + (x.rc.dh || 1) + ' h') + '</b> <small class="muted">(' + u.fCorta(x.rc.f) + ')</small></span>' + btn('↺ Quitar', 'sc-rec-x', 'data-id="' + x.it.id + '"', 'small ghost') + '</li>').join('') + '</ul>');
    if (s.proteg.length) h += card('<details data-sec="sc-prot"><summary><b>🔒 Lo que no se recorta (' + s.proteg.length + ')</b></summary><ul class="small">' + s.proteg.map(c => '<li>' + esc(c.it.t) + (c.it.ev ? ' · <i>evidencia: ' + esc(corto(c.it.ev, 70)) + '</i>' : '') + '</li>').join('') + '</ul></details>');
    return { t: 'Qué recortar', h: h };
  }
  A['sc-add'] = () => {
    const desde = val('sc-d'), hasta = val('sc-h') || desde, mot = val('sc-m'), gids = Array.from(document.querySelectorAll('.sc-g:checked')).map(x => x.value);
    if (!desde || hasta < desde) { u.toast('Revisa las fechas', 'err'); return; } if (!gids.length) { u.toast('Elige al menos un grupo', 'err'); return; }
    const keys = {}; gids.forEach(id => { const g = D.grupo(id); if (!g) return; const k = TI.claves(g, desde, hasta); if (!k.length) return; keys[id] = k; S.update('clases:' + id, st => { st.perdidas = st.perdidas || {}; k.forEach(x => { st.perdidas[x] = true; }); }, {}); });
    if (!Object.keys(keys).length) { u.toast('Esos días no hay clase en tu horario', 'err'); return; }
    S.update(KSC, l => { l.push({ id: u.uid('sc'), desde: desde, hasta: hasta, mot: mot, nota: val('sc-n'), keys: keys, creado: u.today() }); }, []);
    E.ui.sc = { desde: desde, hasta: hasta, mot: mot }; u.toast('Listo: se recorrió el guion', 'ok');
  };
  A['sc-del'] = el => {
    const x = TI.sinClase().find(y => y.id === el.dataset.id); if (!x) return;
    Object.keys(x.keys || {}).forEach(id => S.update('clases:' + id, st => { st.perdidas = st.perdidas || {}; x.keys[id].forEach(k => { delete st.perdidas[k]; }); }, {}));
    S.update(KSC, l => l.filter(y => y.id !== x.id), []);
  };
  A['sc-rec'] = el => { const g = D.grupoActual(); S.update(KR(g), d => { const r = d[el.dataset.id] || {}; if (el.dataset.m === 'menos') { r.modo = 'menos'; r.dh = (Number(r.dh) || 0) + 1; } else { r.modo = 'tarea'; r.t = el.dataset.t; } r.f = u.today(); d[el.dataset.id] = r; }, {}); };
  A['sc-rec-x'] = el => { const g = D.grupoActual(); S.update(KR(g), d => { delete d[el.dataset.id]; }, {}); };
  // en Clases: enlace a «qué recortar» cuando no alcanza
  if (V.clases) { const vc = V.clases; V.clases = function () { const o = vc.apply(null, arguments); if (o && o.h) o.h = o.h.replace('Junta o recorta actividades.</p>', 'Junta o recorta actividades. <a href="#/sinclase/recorte">✂️ Ver qué recortar</a></p>'); if (o && o.h && o.h.indexOf('sinclase') < 0 && !/Algo falló/.test(o.h)) { const i = o.h.indexOf('</section>'); if (i > 0) o.h = o.h.slice(0, i) + '<p class="small"><a href="#/sinclase">📅 Marcar días sin clase (suspensión, CTE, puente)</a></p>' + o.h.slice(i); } return o; }; }

  /* ================= 2) CALENDARIO .ics ================= */
  const icsEsc = s => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  const icsD = f => f.replace(/-/g, '');
  const fold = l => { const out = []; let s = l; while (s.length > 72) { out.push(s.slice(0, 72)); s = ' ' + s.slice(72); } out.push(s); return out.join('\r\n'); };
  TI.eventos = () => {
    const ev = [], gs = D.gruposActivos(), add = (uid, f, t, d, f2) => ev.push({ uid: uid, f: f, f2: f2 || f, t: t, d: d || '' });
    D.parciales().forEach(p => { add('parcial-' + p.id + '-ini', p.inicio, 'Inicia el ' + p.nombre); add('parcial-' + p.id + '-fin', p.fin, 'Termina el ' + p.nombre, 'Aplica examen y cierra proyecto y bitácora.'); if (p.captura) add('captura-' + p.id, p.captura, 'Captura de calificaciones · ' + p.nombre, 'Revisa el pre-cierre en Escuadra.'); (p.asuetos || []).forEach(a => add('asueto-' + a, a, 'Asueto (sin clases)')); });
    TI.sinClase().forEach(x => add('sinclase-' + x.id, x.desde, 'Sin clase: ' + (MOT[x.mot] || '').replace(/^\S+\s/, '') + (x.nota ? ' · ' + x.nota : ''), '', x.hasta));
    gs.forEach(g => {
      D.parciales().forEach(p => C.acts(g, p.id).forEach(a => { if (a.fecha && !C.sinCal(a)) add('act-' + g.id + '-' + a.id, a.fecha, g.nombre + ' · entrega: ' + a.nombre); }));
      if (E.examen && E.examen.fechaExamen) D.parciales().forEach(p => { let f = null; try { const r = E.examen.fechaExamen(g, p.id); f = r && typeof r === 'object' ? r.f : r; } catch (e) { f = null; } if (f && typeof f === 'string') add('examen-' + g.id + '-' + p.id, f, g.nombre + ' · examen del ' + p.nombre); });
      (S.get('junta:' + g.id) || []).forEach(j => { if (j && j.fecha) add('junta-' + j.id, j.fecha, 'Junta de padres · ' + g.nombre + (j.hora ? ' · ' + j.hora : ''), j.lugar || ''); });
    });
    ((S.get('segSim') || {}).prog || []).forEach(x => add('simulacro-' + x.id, x.f, 'Simulacro: ' + (x.tipo || 'evacuación')));
    return ev.filter(x => typeof x.f === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x.f)).sort((a, b) => a.f.localeCompare(b.f));
  };
  TI.ics = () => {
    const ev = TI.eventos(), st = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Escuadra//Control docente//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Escuadra'];
    ev.forEach(x => { L.push('BEGIN:VEVENT', 'UID:' + x.uid + '@escuadra', 'DTSTAMP:' + st, 'DTSTART;VALUE=DATE:' + icsD(x.f), 'DTEND;VALUE=DATE:' + icsD(u.addDays(x.f2, 1)), fold('SUMMARY:' + icsEsc(x.t))); if (x.d) L.push(fold('DESCRIPTION:' + icsEsc(x.d))); L.push('TRANSP:TRANSPARENT', 'END:VEVENT'); });
    L.push('END:VCALENDAR'); return L.join('\r\n') + '\r\n';
  };
  A['ics-dl'] = () => { u.download('escuadra-calendario.ics', TI.ics(), 'text/calendar'); u.toast('Calendario descargado: impórtalo en Google Calendar', 'ok', 5000); };
  TI.icsHTML = () => { const ev = TI.eventos(), hoy = u.today(), prox = ev.filter(x => x.f >= hoy).slice(0, 5);
    return card('<h3>📆 Llévalo a Google Calendar</h3><p class="small">' + ev.length + ' fechas: parciales, capturas, asuetos, días sin clase, entregas, exámenes, juntas y simulacros. En Google Calendar (en la compu): ⚙️ Configuración → Importar y exportar → Importar → elige el archivo. Si lo importas otra vez, se actualizan los mismos eventos.</p>' +
      (prox.length ? '<ul class="small">' + prox.map(x => '<li><b>' + u.fCorta(x.f) + '</b> · ' + esc(x.t) + '</li>').join('') + '</ul>' : '') + btn('📆 Descargar calendario (.ics)', 'ics-dl', '', 'primary small')); };
  if (V.calendario) { const vk = V.calendario; V.calendario = function () { const o = vk.apply(null, arguments); if (o && o.h && !/Algo falló/.test(o.h)) o.h += TI.icsHTML() + card('<p class="small">' + link('📅 Días sin clase (suspensión, CTE, puente)', 'sinclase', 'small') + '</p>'); return o; }; }

  /* ================= 3) EXPEDIENTE DOCENTE ================= */
  const con = (g, fn) => { const cur = D.grupoActual(); if (!cur || cur.id === g.id) return fn(); D.setGrupo(g.id); try { return fn(); } finally { D.setGrupo(cur.id); } };
  TI.checkGrupo = g => con(g, () => {
    const al = D.alumnos(g), ps = D.parciales(), hoy = u.today(), out = [];
    const planes = D.planes(g.id).filter(x => ps.some(p => p.id === x.parcial)), conPl = ps.filter(p => planes.some(x => x.parcial === p.id));
    out.push({ ok: conPl.length === ps.length, t: 'Planeaciones', d: conPl.length + ' de ' + ps.length + ' parciales', to: 'planeacion' });
    const lis = ps.map(p => ({ p: p, n: C.fechasRegistradas(g, p).length, c: C.clases(g, p).filter(c => c.fecha <= hoy).length }));
    out.push({ ok: lis.every(x => x.n >= x.c), t: 'Listas de asistencia', d: lis.map(x => x.p.nombre.replace(/ parcial/i, '') + ': ' + x.n + '/' + x.c).join(' · '), to: 'lista' });
    const cerr = ps.filter(p => p.captura <= hoy), comp = cerr.filter(p => al.every(a => C.cal(g, p.id, a.id).final != null));
    out.push({ ok: comp.length === cerr.length, t: 'Calificaciones de parciales cerrados', d: cerr.length ? comp.length + ' de ' + cerr.length + ' completos' : 'aún no cierra ningún parcial', to: 'calificaciones' });
    const sg = (S.get('seg:' + g.id) || {}).firmas || {}; out.push({ ok: al.every(a => sg[a.id]), t: 'Reglamento del taller firmado', d: al.filter(a => sg[a.id]).length + ' de ' + al.length, to: 'seguridad' });
    const pv = S.get('priv:' + g.id) || {}; out.push({ ok: al.every(a => pv[a.id]), t: 'Aviso de privacidad firmado', d: al.filter(a => pv[a.id]).length + ' de ' + al.length, to: 'privacidad' });
    const inc = S.get('segInc:' + g.id) || []; out.push({ ok: true, t: 'Incidentes registrados', d: String(inc.length), to: 'seguridad' });
    const lg = S.get('logros:' + g.id) || {}; out.push({ ok: true, t: 'Logros y constancias', d: String(Object.keys(lg).reduce((s2, k) => s2 + Object.keys(lg[k] || {}).length, 0)), to: 'constancias' });
    const ju = S.get('junta:' + g.id) || []; out.push({ ok: true, t: 'Juntas de padres', d: String(ju.length), to: 'junta' });
    return out;
  });
  V.expediente = () => {
    const gs = D.grupos().filter(g => !g.archivado || g.parciales), cf = D.cfg();
    let h = card('<h3>🗂 Expediente docente</h3><p class="small">Lo que la dirección suele pedir al cierre del semestre, revisado grupo por grupo. Imprime el expediente completo (concentrado de calificaciones y asistencia, planeaciones, seguridad y reconocimientos) o solo un grupo.</p>' + btn('🖨 Imprimir expediente de todos mis grupos', 'ex-print', '', 'primary') + ' ' + link('📋 Acta en Excel', 'imprimir', 'small'));
    D.gruposActivos().forEach(g => { const ch = TI.checkGrupo(g); h += card('<div class="row between gap wrap"><h3>' + esc(g.nombre) + '</h3>' + btn('🖨 Solo este grupo', 'ex-print', 'data-g="' + g.id + '"', 'small') + '</div><ul class="ex-l">' + ch.map(x => '<li class="' + (x.ok ? 'ok' : 'warn') + '"><span>' + (x.ok ? '✓' : '!') + '</span><div><b>' + esc(x.t) + '</b><small>' + esc(x.d) + '</small></div><a class="small" href="#/' + x.to + '">Ir</a></li>').join('') + '</ul>'); });
    h += '<p class="muted small">Docente: ' + esc(cf.docente || '—') + ' · ' + esc(cf.plantel || '') + '. Ajusta tus datos en Ajustes.</p>';
    return { t: 'Expediente docente', h: h };
  };
  TI.expedienteHTML = gids => {
    const cf = D.cfg(), gs = (gids || D.gruposActivos().map(g => g.id)).map(D.grupo).filter(Boolean);
    let h = '<div class="pr"><div class="p-title">EXPEDIENTE DOCENTE · ' + esc(cf.docente || '') + '</div><p class="tiny c">' + esc(cf.plantel || '') + ' · ' + u.fFecha(u.today()) + '</p><h4>Contenido</h4><ol class="small">' + gs.map(g => '<li>' + esc(g.nombre) + ' · ' + esc(g.modulo ? 'Módulo ' + g.modulo : '') + '</li>').join('') + '</ol>';
    gs.forEach(g => con(g, () => {
      const al = D.alumnos(g), ps = D.parciales(), ch = TI.checkGrupo(g);
      h += '<div class="pbreak"></div><div class="p-title">' + esc(g.nombre) + '</div><p class="tiny c">' + esc(g.carrera || 'Técnico en Mecatrónica') + ' · ' + al.length + ' alumnos · ' + ps.map(p => p.nombre + ' ' + u.fDM(p.inicio) + '–' + u.fDM(p.fin)).join(' · ') + '</p>';
      h += '<table class="grid"><thead><tr><th>No.</th><th class="l">ALUMNO</th>' + ps.map(p => '<th>' + esc(p.nombre.replace(/ parcial/i, '').toUpperCase()) + '</th><th>ASIS.</th>').join('') + '<th>FINAL</th></tr></thead><tbody>' +
        al.map(a => '<tr><td class="c">' + a.num + '</td><td class="nm">' + esc(a.nombre) + '</td>' + ps.map(p => { const k = C.cal(g, p.id, a.id), as = C.asis(g, p, a.id); return '<td class="c">' + (k.final == null ? '' : C.escala(k.final)) + '</td><td class="c">' + (as.pct == null ? '' : Math.round(as.pct) + '%') + '</td>'; }).join('') + '<td class="c"><b>' + (C.finalSem(g, a.id).final == null ? '' : C.escala(C.finalSem(g, a.id).final)) + '</b></td></tr>').join('') + '</tbody></table>';
      h += '<h4>Revisión</h4><ul class="small">' + ch.map(x => '<li>' + (x.ok ? '✓ ' : '• ') + esc(x.t) + ': ' + esc(x.d) + '</li>').join('') + '</ul>';
      const pls = D.planes(g.id); if (pls.length) h += '<h4>Planeaciones</h4><ul class="small">' + pls.map(p => '<li>' + esc((C.parcial(p.parcial) || {}).nombre || p.parcial) + ': ' + esc(p.titulo || p.nombre || (p.submodulo && p.submodulo.nombre) || 'planeación') + (p.revisada ? ' · revisada' : '') + '</li>').join('') + '</ul>';
      const inc = S.get('segInc:' + g.id) || []; if (inc.length) h += '<h4>Incidentes y casi-accidentes</h4><ul class="small">' + inc.map(x => '<li>' + u.fCorta(x.f || x.fecha || u.today()) + ': ' + esc(corto(x.desc || x.que || '', 140)) + '</li>').join('') + '</ul>';
    }));
    h += '<div class="firmas"><div>' + esc(cf.docente || 'Docente') + '<br><small>Docente</small></div><div>&nbsp;<br><small>Recibió (dirección / academia)</small></div></div></div>';
    return h;
  };
  A['ex-print'] = el => E.print.run(TI.expedienteHTML(el.dataset.g ? [el.dataset.g] : null), { landscape: true, title: 'Expediente docente', margin: '10mm' });

  /* ================= 4) CHEQUEO DE SALUD DE LOS DATOS ================= */
  TI.salud = () => {
    const out = [], hoy = u.today(), gids = {};
    D.grupos().forEach(g => {
      gids[g.id] = 1; const al = D.alumnos(g, true), nn = {}, nums = {};
      al.forEach(a => { const k = u.norm(a.nombre); if (nn[k]) out.push({ nv: 'bad', g: g, t: 'Alumno repetido: ' + a.nombre, to: 'alumnos' }); nn[k] = 1; if (a.activo !== false) { if (nums[a.num]) out.push({ nv: 'warn', g: g, t: 'Número de lista repetido: ' + a.num, to: 'alumnos' }); nums[a.num] = 1; } if (E.esNombreRaro(a.nombre)) out.push({ nv: 'bad', g: g, t: 'Nombre con caracteres raros: ' + corto(a.nombre, 40), to: 'alumnos' }); });
      if (!g.archivado && !(g.horario || []).length) out.push({ nv: 'bad', g: g, t: 'Grupo sin horario: no se calculan clases ni asistencia', to: 'grupos' });
      if (g.archivado) return;
      const ps = D.parciales(), ids = {}; al.forEach(a => { ids[a.id] = 1; });
      S.list('act:' + g.id + ':').forEach(a => {
        if (!a || !a.id) return; if (!ps.some(p => p.id === a.parcial)) out.push({ nv: 'warn', g: g, t: 'Actividad sin parcial válido: ' + a.nombre, to: 'actividad/' + a.id });
        const mx = C.maxPts(a); Object.keys(a.notas || {}).forEach(aid => { const v = a.notas[aid]; if (v === '' || v == null) return; const n = Number(v); if (isNaN(n) || n < 0 || n > mx) out.push({ nv: 'bad', g: g, t: '«' + a.nombre + '»: calificación fuera de rango (' + v + ' de ' + mx + ')' + (D.alumno(g, aid) ? ' · ' + u.corto(D.alumno(g, aid).nombre) : ''), to: 'actividad/' + a.id }); if (!ids[aid]) out.push({ nv: 'info', g: g, t: '«' + a.nombre + '»: tiene calificación de un alumno que ya no está en la lista', to: 'actividad/' + a.id }); });
        const p = ps.find(x => x.id === a.parcial); if (p && a.fecha && (a.fecha < p.inicio || a.fecha > p.fin)) out.push({ nv: 'info', g: g, t: '«' + a.nombre + '»: su fecha (' + u.fCorta(a.fecha) + ') cae fuera del ' + p.nombre, to: 'actividad/' + a.id });
        if (!a.auto && a.fecha && u.diffDays(a.fecha, hoy) > 7 && a.cuenta !== false && !Object.keys(a.notas || {}).some(k => a.notas[k] !== '' && a.notas[k] != null)) out.push({ nv: 'warn', g: g, t: '«' + a.nombre + '» pasó hace ' + u.diffDays(a.fecha, hoy) + ' días y no tiene ninguna calificación', to: 'actividad/' + a.id });
      });
      S.keys('asis:' + g.id + ':').forEach(k => { const f = k.split(':')[2]; if (f && C.horasDia(g, f) === 0) out.push({ nv: 'info', g: g, t: 'Hay pase de lista el ' + u.fCorta(f) + ', un día sin clase en tu horario', to: 'lista/' + f }); else if (f && f > hoy) out.push({ nv: 'warn', g: g, t: 'Pase de lista con fecha futura: ' + u.fCorta(f), to: 'lista/' + f }); });
    });
    const ps = S.get('parciales') || []; ps.forEach((p, i) => { if (p.fin < p.inicio) out.push({ nv: 'bad', t: p.nombre + ': termina antes de empezar', to: 'ajustes/parciales' }); if (p.captura && p.captura < p.inicio) out.push({ nv: 'warn', t: p.nombre + ': la captura es antes del inicio', to: 'ajustes/parciales' }); const q = ps[i + 1]; if (q && q.inicio <= p.fin) out.push({ nv: 'warn', t: p.nombre + ' y ' + q.nombre + ' se enciman', to: 'ajustes/parciales' }); });
    const huerf = {}; Object.keys(S.docs).forEach(k => { if (S.docs[k].deleted) return; const m = /^(act|asis|part|clases|seg|segInc|entregas|libreta|forms|manual):([^:]+)/.exec(k); if (m && !gids[m[2]]) huerf[m[2]] = (huerf[m[2]] || 0) + 1; });
    Object.keys(huerf).forEach(id => out.push({ nv: 'info', t: huerf[id] + ' documentos de un grupo que ya no existe («' + id + '»). No estorban; se pueden quedar.', to: 'grupos' }));
    return out;
  };
  V.salud = () => {
    const L = TI.salud(), n = { bad: 0, warn: 0, info: 0 }; L.forEach(x => n[x.nv]++);
    let h = card('<h3>🩺 Chequeo de salud de tus datos</h3><p class="small">Revisa todos tus grupos en busca de errores de captura que luego dan problemas en el acta.</p><div class="en-kpis"><div class="' + (n.bad ? 'bad' : 'ok') + '"><b>' + n.bad + '</b><span>errores</span></div><div class="' + (n.warn ? 'warn' : 'ok') + '"><b>' + n.warn + '</b><span>para revisar</span></div><div><b>' + n.info + '</b><span>avisos</span></div></div>' + (!L.length ? '<p class="note ok">✓ Todo en orden.</p>' : ''));
    ['bad', 'warn', 'info'].forEach(nv => { const X = L.filter(x => x.nv === nv); if (!X.length) return; h += card('<h3>' + ({ bad: '❌ Errores', warn: '⚠️ Para revisar', info: 'ℹ️ Avisos' })[nv] + '</h3><ul class="pc-l">' + X.slice(0, 60).map(x => '<li class="' + nv + '"><div><b>' + esc(x.t) + '</b>' + (x.g ? '<small class="muted">' + esc(x.g.nombre) + '</small>' : '') + '</div>' + (x.g && x.g.id !== (D.grupoActual() || {}).id ? btn('Ir', 'sal-ir', 'data-g="' + x.g.id + '" data-to="' + esc(x.to) + '"', 'small') : link('Ir', x.to, 'small')) + '</li>').join('') + '</ul>' + (X.length > 60 ? '<p class="muted small">… y ' + (X.length - 60) + ' más.</p>' : '')); });
    return { t: 'Salud de los datos', h: h };
  };
  A['sal-ir'] = el => { D.setGrupo(el.dataset.g); location.hash = '#/' + el.dataset.to; E.render(); };

  /* ================= 5) COMPARTIR CON LA ACADEMIA ================= */
  TI.paquete = () => {
    const cf = D.cfg(), seg = S.get('segCfg') || {}, inv = S.get('inv') || {};
    return { app: 'escuadra-academia', v: E.VERSION, de: cf.docente || '', plantel: cf.plantel || '', fecha: u.today(),
      banco: ((S.get('banco:propias') || {}).items || []).map(x => Object.assign({}, x)),
      aprende: S.get('guionAprende') || {}, reglamento: seg.reglas || null, epp: seg.epp || null,
      inventario: (inv.items || []).map(x => ({ n: x.n, cat: x.cat, cant: x.cant, min: x.min })),
      rubricas: (S.get('rubricas') || {}).tpl || null, normasNotas: (S.get('normasEst') || {}).notas || null };
  };
  A['ac-dl'] = () => { const p = TI.paquete(); u.download('escuadra-academia-' + u.today() + '.json', JSON.stringify(p, null, 1), 'application/json'); u.toast('Paquete listo: compártelo por correo o Drive', 'ok'); };
  CH['ac-lee'] = async el => { const f = el.files && el.files[0]; if (!f) return; try { const d = JSON.parse(await f.text()); if (d.app !== 'escuadra-academia') throw new Error('No es un paquete de academia de Escuadra'); E.ui.acImp = d; E.render(); } catch (e) { u.toast(e.message, 'err', 6000); } };
  A['ac-imp'] = () => {
    const d = E.ui.acImp; if (!d) return; const sel = k => { const c = document.getElementById('ac-' + k); return c && c.checked; }; const res = [];
    if (sel('banco') && (d.banco || []).length) { let n = 0; S.update('banco:propias', b => { b.items = b.items || []; const ya = new Set(b.items.map(x => u.norm(x.q))); d.banco.forEach(x => { if (!x || !x.q || ya.has(u.norm(x.q))) return; b.items.push(Object.assign({}, x, { id: 'pp_' + u.uid('ac').slice(3), de: d.de || 'academia' })); n++; }); }, {}); res.push(n + ' preguntas'); }
    if (sel('aprende') && d.aprende) { let n = 0; S.update('guionAprende', a => { Object.keys(d.aprende).forEach(k => { a[k] = a[k] || {}; Object.keys(d.aprende[k] || {}).forEach(id => { if (!a[k][id]) { a[k][id] = Object.assign({}, d.aprende[k][id], { origen: 'academia', f: d.aprende[k][id].f || d.fecha }); n++; } }); }); }, {}); res.push(n + ' ajustes del guion'); }
    if (sel('regl') && (d.reglamento || d.epp)) { S.update('segCfg', c => { if (d.reglamento) c.reglas = d.reglamento; if (d.epp) c.epp = d.epp; }, {}); res.push('reglamento'); }
    if (sel('inv') && (d.inventario || []).length) { let n = 0; S.update('inv', v => { v.items = v.items || []; d.inventario.forEach(x => { if (!v.items.some(y => u.norm(y.n) === u.norm(x.n))) { v.items.push({ id: u.uid('iv'), n: x.n, cat: x.cat || 'otro', cant: 0, min: x.min || 0, ubic: '', estado: 'ok' }); n++; } }); }, {}); res.push(n + ' artículos (con cantidad 0)'); }
    if (sel('rub') && d.rubricas) { S.update('rubricas', r => { r.tpl = Object.assign({}, d.rubricas, r.tpl || {}); }, {}); res.push('rúbricas'); }
    E.ui.acImp = null; u.toast('Importado: ' + (res.join(', ') || 'nada'), 'ok', 6000);
  };
  V.academia = () => {
    const p = TI.paquete(), d = E.ui.acImp;
    let h = card('<h3>🤝 Compartir con la academia</h3><p class="small">Pásale a otro docente de Mecatrónica lo que has construido. <b>Nunca incluye datos de alumnos</b>: ni nombres, ni calificaciones, ni asistencia.</p><ul class="small"><li>' + p.banco.length + ' preguntas de tu banco</li><li>' + Object.keys(p.aprende).reduce((s, k) => s + Object.keys(p.aprende[k] || {}).length, 0) + ' ajustes del guion aprendidos</li><li>' + (p.reglamento ? 'Tu reglamento del taller' : 'Reglamento base') + ' y lista de revisión</li><li>' + p.inventario.length + ' artículos del inventario (sin préstamos)</li><li>' + (p.rubricas ? Object.keys(p.rubricas).length + ' rúbricas editadas' : 'Rúbricas base') + '</li></ul>' + btn('📦 Descargar paquete', 'ac-dl', '', 'primary'));
    h += card('<h3>📥 Importar el paquete de un colega</h3>' + (d ? '<p class="small">De <b>' + esc(d.de || 'un colega') + '</b>' + (d.plantel ? ' (' + esc(d.plantel) + ')' : '') + ', ' + esc(d.fecha || '') + '. Elige qué traer; no se borra nada tuyo.</p>' +
      [['banco', (d.banco || []).length + ' preguntas (las repetidas se saltan)'], ['aprende', 'Ajustes del guion (solo los que no tengas)'], ['regl', 'Reglamento y lista de revisión (reemplaza los tuyos)'], ['inv', (d.inventario || []).length + ' artículos del inventario'], ['rub', 'Rúbricas']].map(x => '<label class="switch"><input type="checkbox" id="ac-' + x[0] + '"' + (x[0] === 'regl' ? '' : ' checked') + '><span>' + esc(x[1]) + '</span></label>').join('') + '<div class="row gap wrap mt">' + btn('Importar', 'ac-imp', '', 'primary') + btn('Cancelar', 'ac-cancel', '', 'ghost') + '</div>'
      : '<label class="btn filebtn">📂 Elegir paquete (.json)<input type="file" accept=".json" data-ch="ac-lee" hidden></label>'));
    return { t: 'Academia', h: h };
  };
  A['ac-cancel'] = () => { E.ui.acImp = null; E.render(); };

  /* ================= 6) MODO DEMOSTRACIÓN ================= */
  const DEMO = 'escuadra.demo';
  let enDemo = false; try { enDemo = sessionStorage.getItem(DEMO) === '1'; } catch (e) { enDemo = false; }
  TI.demo = () => enDemo;
  if (enDemo) {
    S.load = async function () { this.docs = {}; this.modo = 'demo'; };
    S.persist = function () { };
    if (E.sync) { E.sync.init = async function () { this.setState('local', 'Modo demostración: nada se guarda'); }; E.sync.now = async function () { }; E.sync.schedule = function () { }; }
    const seed0 = E.seed;
    E.seed = function () {
      seed0();
      const N = ['ARIAS BELTRÁN ANA', 'BRAVO CASTRO LUIS', 'CRUZ DOMÍNGUEZ MAYA', 'DÍAZ ESCOBAR PABLO', 'ESTRADA FUENTES SARA', 'FUENTES GARZA TOMÁS', 'GARZA HUERTA LUCÍA', 'HUERTA IBARRA DAVID', 'IBARRA JUÁREZ ELENA', 'JUÁREZ KURI MARCO', 'KURI LEAL NORA', 'LEAL MEZA RAÚL', 'MEZA NIETO JULIA', 'NIETO OLVERA ADRIÁN', 'OLVERA PEÑA CLARA', 'PEÑA QUIROZ IKER', 'QUIROZ RAMOS ALMA', 'RAMOS SOTO BRUNO', 'SOTO TAPIA DIANA', 'TAPIA URIBE GAEL'];
      const gk = 'grupo:3AMEC', g = S.get(gk); if (!g) return;
      g.alumnos = N.map((n, i) => ({ id: 'demo' + i, num: i + 1, nombre: n, activo: true, notas: '', tel: '' })); g.nombre = 'Grupo de demostración';
      S.docs[gk] = { data: g, ts: u.now(), dirty: false, deleted: false };
      let s = 11; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
      const hoy = u.today(); D.parciales().forEach(p => { for (let f = C.inicioEfectivo(g, p); f < hoy && f <= p.fin; f = u.addDays(f, 1)) { if (!C.esClase(g, f)) continue; const a = {}; g.alumnos.forEach((x, i) => { const r = rnd(); a[x.id] = r < (i % 7 === 3 ? 0.6 : 0.93) ? 'A' : r < 0.96 ? 'R' : 'F'; }); S.docs['asis:3AMEC:' + f] = { data: a, ts: u.now(), dirty: false, deleted: false }; } });
      const p = C.parcialActual(); ['Libreta semana 1', 'Práctica guiada', 'Reporte de práctica'].forEach((nm, j) => { const id = 'demoact' + j, no = {}; g.alumnos.forEach((x, i) => { no[x.id] = Math.round(55 + rnd() * 45 - (i % 7 === 3 ? 20 : 0)); }); S.docs['act:3AMEC:' + id] = { data: { id: id, parcial: p.id, categoria: 'trabajos', nombre: nm, peso: 1, max: 100, fecha: u.addDays(p.inicio, 7 * (j + 1)), cuenta: true, notas: no }, ts: u.now(), dirty: false, deleted: false }; });
      S.docs['manual:3AMEC'] = { data: {}, ts: u.now(), dirty: false, deleted: false };
    };
    document.addEventListener('DOMContentLoaded', () => { const b = document.createElement('button'); b.type = 'button'; b.className = 'demo-band'; b.dataset.act = 'demo-salir'; b.textContent = '🎭 Modo demostración · datos ficticios, nada se guarda · toca para salir'; document.body.appendChild(b); });
  }
  A['demo-entrar'] = () => { if (!confirm('Se abrirá un grupo ficticio para enseñar la app. Tus datos reales no se tocan ni se muestran. ¿Entrar?')) return; try { sessionStorage.setItem(DEMO, '1'); } catch (e) { } location.hash = '#/inicio'; location.reload(); };
  A['demo-salir'] = () => { try { sessionStorage.removeItem(DEMO); } catch (e) { } location.hash = '#/inicio'; location.reload(); };

  /* ================= pantalla que reúne lo anterior ================= */
  V.mitiempo = () => {
    let h = card('<h3>⏱ Herramientas para tu tiempo</h3><div class="mas-grid">' + [
      ['sinclase', '📅', 'Días sin clase', 'Suspensión, CTE o puente de un jalón'], ['sinclase/recorte', '✂️', 'Qué recortar', 'Si ya no alcanza el parcial'], ['calendario', '📆', 'A Google Calendar', 'Todas tus fechas en un archivo'],
      ['expediente', '🗂', 'Expediente docente', 'Para la dirección, fin de semestre'], ['salud', '🩺', 'Salud de los datos', 'Errores de captura'], ['academia', '🤝', 'Compartir con la academia', 'Banco, guion y reglamento'], ['respaldo', '💾', 'Respaldo y prueba', 'Que sí se pueda restaurar']
    ].map(x => '<a href="#/' + x[0] + '"><span class="mg-e">' + x[1] + '</span><span>' + x[2] + '</span><small>' + x[3] + '</small></a>').join('') + '</div>') +
      card('<h3>🎭 Modo demostración</h3><p class="small">Para enseñarle la app a un colega o en el CTE: abre un grupo ficticio con asistencia y calificaciones de ejemplo. Tus datos no se muestran ni se tocan, y nada de lo que hagas ahí se guarda.</p>' + (enDemo ? btn('Salir del modo demostración', 'demo-salir', '', 'primary') : btn('🎭 Entrar al modo demostración', 'demo-entrar', '', '')));
    return { t: 'Tu tiempo', h: h };
  };
})();

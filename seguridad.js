/* Escuadra · Seguridad en el taller (v1.25).
   - Reglamento del taller: el texto es tuyo (viene uno de base que editas), lo imprimes con hoja de firmas y marcas quién
     lo firmó (alumno y madre, padre o tutor). Quien no lo ha firmado no trabaja en prácticas con herramienta o corriente.
   - Antes de cada práctica con riesgo (taller, corte, herramienta, corriente, cortadora láser): lista de verificación de
     equipo de protección y orden, de un toque, que queda registrada con fecha.
   - Bitácora de incidentes y casi-accidentes con lo que se hizo y la medida para que no se repita; imprimible.
   Base: NOM-017-STPS-2024 (equipo de protección personal), NOM-004-STPS-1999 (maquinaria y herramienta), NOM-029-STPS-2011
   (mantenimiento eléctrico) y las reglas de seguridad que ya traen las clases de la app (12 V; el lado de 127 V lo conecta el
   docente; la cortadora láser la opera solo el docente). */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const SG = E.seguridad = {};
  const KG = g => 'seg:' + g.id, KE = (g, f) => 'segEpp:' + g.id + ':' + f, KI = g => 'segInc:' + g.id, KC = 'segCfg';
  const REGLAS = [
    'Entro al taller solo con autorización del docente y nunca trabajo solo.',
    'Uso lentes de seguridad en toda práctica de corte, perforado, soldadura o con resortes y elásticos.',
    'Traigo el cabello recogido, sin pulseras, anillos ni ropa suelta cerca de piezas que giran.',
    'Uso zapato cerrado. No como ni bebo en las mesas de trabajo.',
    'Uso cada herramienta solo para lo que sirve; si está dañada, la reporto y no la uso.',
    'Corto con el cúter sobre tapete o tabla, con regla metálica y alejando la mano del filo.',
    'Trabajo con 12 V de corriente directa. El lado de 127 V de las fuentes lo conecta y prueba solo el docente.',
    'La cortadora láser la opera solo el docente; nunca se cortan PVC ni vinil.',
    'Al terminar, apago, desconecto, guardo la herramienta y dejo mi lugar limpio.',
    'Si hay un accidente o un casi-accidente, aviso al docente de inmediato, aunque no haya lesión.'
  ];
  const EPP = ['Lentes de seguridad puestos (corte, perforado, resortes)', 'Cabello recogido, sin pulseras ni anillos', 'Zapato cerrado', 'Mesa despejada y herramienta revisada', 'Saben dónde están el botiquín y el extintor', 'Corriente: trabajan a 12 V; el 127 V lo conecta el docente', 'Cúter con regla metálica y tapete'];
  SG.cfg = () => { const c = S.get(KC) || {}; return { reglas: (c.reglas && c.reglas.length) ? c.reglas : REGLAS, epp: (c.epp && c.epp.length) ? c.epp : EPP, version: c.version || 1 }; };
  SG.doc = g => S.get(KG(g)) || {};
  SG.firmo = (g, aid) => !!((SG.doc(g).firmas || {})[aid]);
  const RIESGO = /desarm|tijera|taller|cort[ae]|c[uú]ter|segueta|taladr|perfor|caut[ií]n|sold|127|l[aá]ser|herramient|silic[oó]n|prototipo|ensambl|montaje|piezas|instalaci[oó]n|circuito|motor|hidr[aá]ulic|neum[aá]tic/i;
  // ¿hay práctica con riesgo ese día? (taller, o actividad práctica con herramienta o corriente)
  SG.riesgoDia = (g, f) => {
    let d = null; try { d = E.clases.dia(g, f); } catch (e) { d = null; } if (!d) return [];
    const out = []; d.bloques.forEach(b => { if (b.perdida || b.lugar === 'computo') return; b.parts.forEach(pt => { const it = pt.it, txt = [it.t, it.tipo, it.mat, it.obj].join(' '); if (b.lugar === 'taller' || (/Práctica|Taller|Proyecto/.test(it.tipo || '') && RIESGO.test(txt))) out.push({ b: b, it: it }); }); });
    return out;
  };
  const presentes = (g, f) => { const doc = S.get('asis:' + g.id + ':' + f); return D.alumnos(g).filter(a => !doc || ['A', 'R'].indexOf(doc[a.id] || 'A') >= 0); };
  SG.sinFirma = (g, f) => presentes(g, f).filter(a => !SG.firmo(g, a.id));

  /* ---------- antes de la práctica (en el guion y en el pase de lista) ---------- */
  SG.antesHTML = (g, f) => {
    const r = SG.riesgoDia(g, f); if (!r.length) return '';
    const cf = SG.cfg(), ep = S.get(KE(g, f)) || {}, marc = ep.items || {}, n = cf.epp.filter((x, i) => marc[i]).length, sin = SG.sinFirma(g, f);
    return card('<div class="row between gap wrap"><h3>🦺 Antes de empezar la práctica</h3>' + (ep.ok ? '<span class="chip ok">✓ Revisado ' + esc(String(ep.ok).slice(11, 16)) + '</span>' : '<span class="chip warn">' + n + ' de ' + cf.epp.length + '</span>') + '</div>' +
      '<p class="muted small">Hoy: ' + esc(Array.from(new Set(r.map(x => x.it.t))).join(' · ')) + '. Revísalo con el grupo antes de sacar la herramienta.</p>' +
      '<ul class="sg-chk">' + cf.epp.map((x, i) => '<li><label><input type="checkbox" data-ch="sg-epp" data-f="' + f + '" data-i="' + i + '"' + (marc[i] ? ' checked' : '') + '><span>' + esc(x) + '</span></label></li>').join('') + '</ul>' +
      (sin.length ? '<div class="note bad small"><b>Sin reglamento firmado (' + sin.length + '):</b> no trabajan con herramienta ni corriente hasta firmarlo. ' + sin.map(a => '<span class="sg-sin">' + esc(u.corto(a.nombre)) + ' ' + btn('Firmó', 'sg-firma', 'data-aid="' + a.id + '" data-on="1"', 'small ghost') + '</span>').join(' ') + '</div>' : '<p class="small okc">✓ Todos los presentes tienen el reglamento firmado.</p>') +
      '<div class="row gap wrap">' + (ep.ok ? '' : btn('✓ Todo revisado', 'sg-epp-ok', 'data-f="' + f + '"', 'primary small')) + btn('📽 Proyectar reglas', 'sg-proj', '', 'small') + link('⚠️ Registrar incidente', 'seguridad/incidente', 'small ghost') + '</div>', 'sg-card');
  };
  CH['sg-epp'] = el => { const g = D.grupoActual(); S.update(KE(g, el.dataset.f), d => { d.items = d.items || {}; if (el.checked) d.items[el.dataset.i] = true; else delete d.items[el.dataset.i]; }, {}); };
  A['sg-epp-ok'] = el => { const g = D.grupoActual(), cf = SG.cfg(); S.update(KE(g, el.dataset.f), d => { d.items = d.items || {}; cf.epp.forEach((x, i) => { d.items[i] = true; }); d.ok = new Date().toISOString(); }, {}); u.toast('Revisión de seguridad registrada', 'ok'); };
  A['sg-firma'] = el => { const g = D.grupoActual(), aid = el.dataset.aid, on = el.dataset.on === '1'; S.update(KG(g), d => { d.firmas = d.firmas || {}; if (on) d.firmas[aid] = u.today(); else delete d.firmas[aid]; }, {}); };
  A['sg-firma-p'] = el => { const g = D.grupoActual(), aid = el.dataset.aid; S.update(KG(g), d => { d.padres = d.padres || {}; if (d.padres[aid]) delete d.padres[aid]; else d.padres[aid] = u.today(); }, {}); };
  A['sg-proj'] = () => { const cf = SG.cfg(); if (E.proj) E.proj.abrir({ id: 'seg-reglas', titulo: 'Reglas del taller' }, [{ k: 'cover', h: '🦺 Seguridad en el taller', sub: 'Antes de sacar la herramienta', p: 'Nadie se lastima en esta clase.' }, { k: 'list', h: 'Revisamos', items: cf.epp }, { k: 'list', h: 'Reglamento', items: cf.reglas.slice(0, 6) }, { k: 'list', h: 'Reglamento (cont.)', items: cf.reglas.slice(6) }]); };
  if (V.clase) { const vc = V.clase; V.clase = function (f) { const o = vc.apply(null, arguments), g = D.grupoActual(); if (o && g && !/Algo falló/.test(o.h)) { const x = SG.antesHTML(g, f || u.today()); if (x) { const i = o.h.indexOf('<section'); o.h = i >= 0 ? o.h.slice(0, i) + x + o.h.slice(i) : o.h + x; } } return o; }; }
  if (V.lista) { const vl = V.lista; V.lista = function (f) { const o = vl.apply(null, arguments), g = D.grupoActual(); if (o && g && !/Algo falló|Primero importa/.test(o.h)) { const fe = f || C.fechaListaDefault(g, u.today()); if (SG.riesgoDia(g, fe).length) { const sin = SG.sinFirma(g, fe); if (sin.length) o.h += '<p class="note warn small">🦺 Hoy hay práctica con herramienta o corriente y ' + sin.length + (sin.length === 1 ? ' alumno presente no ha' : ' alumnos presentes no han') + ' firmado el reglamento. ' + link('Ver', 'clase/' + fe, 'small') + '</p>'; } } return o; }; }

  /* ---------- pantalla ---------- */
  V.seguridad = (sub, id) => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const al = D.alumnos(g); if (!al.length) return H.needAlumnos('Seguridad');
    if (sub === 'incidente') return incidenteV(g, id);
    const cf = SG.cfg(), d = SG.doc(g), fir = d.firmas || {}, pad = d.padres || {}, nF = al.filter(a => fir[a.id]).length, inc = S.get(KI(g)) || [];
    const hoy = u.today(), prox = []; for (let i = 0; i <= 14 && prox.length < 3; i++) { const f = u.addDays(hoy, i); if (C.esClase(g, f) && SG.riesgoDia(g, f).length) prox.push(f); }
    let h = card('<h3>🦺 Seguridad en el taller</h3><div class="en-kpis"><div class="' + (nF === al.length ? 'ok' : 'warn') + '"><b>' + nF + '/' + al.length + '</b><span>reglamento firmado</span></div><div><b>' + al.filter(a => pad[a.id]).length + '</b><span>firma de casa</span></div><div><b>' + inc.filter(x => x.tipo !== 'equipo').length + '</b><span>incidentes y casi-accidentes</span></div><div><b>' + prox.length + '</b><span>prácticas con riesgo en 2 semanas</span></div></div>' +
      (prox.length ? '<p class="small">Próximas: ' + prox.map(f => '<a href="#/clase/' + f + '">' + u.fCorta(f) + '</a>').join(' · ') + '</p>' : '') +
      '<div class="row gap wrap">' + btn('🖨 Reglamento con hoja de firmas', 'sg-print', '', 'primary small') + btn('🖨 Uno por alumno (para casa)', 'sg-print-ind', '', 'small') + btn('📽 Proyectar reglas', 'sg-proj', '', 'small') + link('⚠️ Registrar incidente', 'seguridad/incidente', 'small') + '</div>');
    h += card('<h3>✍️ ¿Quién firmó el reglamento?</h3><p class="muted small">Toca para marcar. «Casa» = firma de su madre, padre o tutor(a) (recomendada para prácticas con herramienta).</p>' + (E.rap ? E.rap.filtroHTML('seguridad') : '') +
      '<ul class="sg-l">' + al.map(a => '<li' + (E.rap ? E.rap.qAttr(a) : '') + '><span><b>' + a.num + '.</b> ' + esc(a.nombre) + '</span><span class="row gap">' + btn(fir[a.id] ? '✓ Alumno ' + u.fCorta(fir[a.id]) : 'Alumno', 'sg-firma', 'data-aid="' + a.id + '" data-on="' + (fir[a.id] ? '0' : '1') + '"', 'small' + (fir[a.id] ? ' on ok' : '')) + btn(pad[a.id] ? '✓ Casa' : 'Casa', 'sg-firma-p', 'data-aid="' + a.id + '"', 'small' + (pad[a.id] ? ' on ok' : ' ghost')) + '</span></li>').join('') + '</ul>' +
      (nF < al.length ? btn('✓ Marcar a todos como firmados hoy', 'sg-todos', '', 'small ghost') : ''));
    h += card('<h3>⚠️ Incidentes y casi-accidentes</h3><p class="muted small">Registra también lo que estuvo a punto de pasar: es lo que más enseña a prevenir. Solo lo necesario.</p>' + (inc.length ? '<ul class="pc-l">' + inc.slice().reverse().map(x => '<li class="' + (x.tipo === 'lesion' ? 'bad' : 'warn') + '"><span class="pc-i">' + (x.tipo === 'lesion' ? '!' : x.tipo === 'equipo' ? '🔧' : '≈') + '</span><div><b><a href="#/seguridad/incidente/' + x.id + '">' + esc(TIPO[x.tipo] || x.tipo) + ' · ' + u.fCorta(x.f) + '</a></b><small class="muted">' + esc((x.desc || '').slice(0, 120)) + (x.medida ? ' · Medida: ' + esc(x.medida.slice(0, 80)) : '') + '</small></div></li>').join('') + '</ul>' : '<p class="small">Sin registros. 👏</p>') + link('＋ Registrar', 'seguridad/incidente', 'small'));
    h += card('<details data-sec="sg-cfg"><summary><b>✏️ Tu reglamento y tu lista de revisión</b></summary><p class="muted small">Un renglón por regla. Si tu escuela tiene su propio reglamento de taller, pégalo aquí.</p><label class="fld"><span>Reglamento</span><textarea class="inp" id="sg-reglas" rows="10">' + esc(cf.reglas.join('\n')) + '</textarea></label><label class="fld"><span>Revisión antes de la práctica</span><textarea class="inp" id="sg-epp-t" rows="6">' + esc(cf.epp.join('\n')) + '</textarea></label>' + btn('Guardar', 'sg-cfg', '', 'primary small') + btn('Volver al de base', 'sg-cfg-base', '', 'small ghost') + '</details>');
    h += '<p class="muted small">Base: NOM-017-STPS-2024 (equipo de protección personal), NOM-004-STPS-1999 (maquinaria y herramienta) y NOM-029-STPS-2011 (trabajos eléctricos), más las reglas de las prácticas de la app (12 V; 127 V y cortadora láser solo el docente).</p>';
    return { t: 'Seguridad', h: h };
  };
  const TIPO = { lesion: 'Incidente con lesión', casi: 'Casi-accidente', equipo: 'Daño a equipo o material' };
  function incidenteV(g, id) {
    const inc = S.get(KI(g)) || [], x = inc.find(y => y.id === id) || E.ui.sgInc || (E.ui.sgInc = { id: '', f: u.today(), hora: '', tipo: 'casi', lugar: 'taller', desc: '', aids: [], accion: '', medida: '', casa: false });
    if (id && x.id !== (E.ui.sgInc || {}).id) E.ui.sgInc = u.clone(x);
    const s = E.ui.sgInc, al = D.alumnos(g);
    const h = '<p><a href="#/seguridad">‹ Seguridad</a></p>' + card('<h3>⚠️ ' + (s.id ? 'Incidente del ' + u.fCorta(s.f) : 'Registrar incidente') + '</h3><div class="fgrid"><label class="fld"><span>Fecha</span><input type="date" data-ch="sg-inc" data-f="f" value="' + esc(s.f) + '"></label><label class="fld"><span>Hora</span><input type="time" data-ch="sg-inc" data-f="hora" value="' + esc(s.hora) + '"></label></div>' +
      '<div class="cl-seg">' + Object.keys(TIPO).map(k => btn(TIPO[k], 'sg-inc-t', 'data-v="' + k + '"', 'small' + (s.tipo === k ? ' on' : ''))).join('') + '</div>' +
      '<label class="fld"><span>Lugar</span><select data-ch="sg-inc" data-f="lugar">' + [['taller', 'Taller'], ['aula', 'Aula'], ['computo', 'Centro de cómputo'], ['otro', 'Otro']].map(o => '<option value="' + o[0] + '"' + (s.lugar === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label>' +
      '<p class="small"><b>Alumnos involucrados</b></p><div class="sg-al">' + al.map(a => '<button type="button" class="rt-chip' + (s.aids.indexOf(a.id) >= 0 ? ' on' : '') + '" data-act="sg-inc-al" data-aid="' + a.id + '">' + a.num + ' ' + esc(u.corto(a.nombre)) + '</button>').join('') + '</div>' +
      '<label class="fld"><span>¿Qué pasó? (hechos, sin juicios)</span><textarea class="inp" data-ch="sg-inc" data-f="desc" rows="3" placeholder="Ej. Al cortar cartón sin regla metálica, el cúter se desvió y rozó el dedo de un alumno.">' + esc(s.desc) + '</textarea></label>' +
      '<label class="fld"><span>¿Qué se hizo? (primeros auxilios, aviso a dirección)</span><textarea class="inp" data-ch="sg-inc" data-f="accion" rows="2">' + esc(s.accion) + '</textarea></label>' +
      '<label class="fld"><span>Medida para que no se repita</span><textarea class="inp" data-ch="sg-inc" data-f="medida" rows="2" placeholder="Ej. Regla metálica obligatoria; demostración de corte al inicio.">' + esc(s.medida) + '</textarea></label>' +
      '<label class="switch"><input type="checkbox" data-ch="sg-inc-casa"' + (s.casa ? ' checked' : '') + '><span>Se avisó a su casa</span></label>' +
      '<div class="row gap wrap">' + btn('✓ Guardar', 'sg-inc-ok', '', 'primary') + (s.id ? btn('🖨 Imprimir reporte', 'sg-inc-print', 'data-id="' + s.id + '"', 'small') + btn('Borrar', 'sg-inc-del', 'data-id="' + s.id + '"', 'small ghost danger') : '') + '</div>');
    return { t: 'Incidente', h: h };
  }
  CH['sg-inc'] = el => { E.ui.sgInc[el.dataset.f] = el.value; };
  CH['sg-inc-casa'] = el => { E.ui.sgInc.casa = el.checked; };
  A['sg-inc-t'] = el => { E.ui.sgInc.tipo = el.dataset.v; E.render(); };
  A['sg-inc-al'] = el => { const s = E.ui.sgInc, i = s.aids.indexOf(el.dataset.aid); if (i >= 0) s.aids.splice(i, 1); else s.aids.push(el.dataset.aid); E.render(); };
  A['sg-inc-ok'] = () => {
    const g = D.grupoActual(), s = E.ui.sgInc; if (!String(s.desc || '').trim()) { u.toast('Escribe qué pasó', 'err'); return; }
    const x = Object.assign({}, s, { id: s.id || u.uid('inc') });
    S.update(KI(g), l => { const i = l.findIndex(y => y.id === x.id); if (i >= 0) l[i] = x; else l.push(x); return l; }, []);
    E.ui.sgInc = null; u.toast('Registrado', 'ok'); location.hash = '#/seguridad';
  };
  A['sg-inc-del'] = el => { if (!confirm('¿Borrar este registro?')) return; const g = D.grupoActual(); S.update(KI(g), l => l.filter(y => y.id !== el.dataset.id), []); E.ui.sgInc = null; location.hash = '#/seguridad'; };
  A['sg-inc-print'] = el => {
    const g = D.grupoActual(), x = (S.get(KI(g)) || []).find(y => y.id === el.dataset.id), cf = D.cfg(); if (!x) return;
    E.print.run('<div class="pr"><div class="p-title">REPORTE DE INCIDENTE EN EL TALLER</div><p class="tiny c">' + esc(cf.plantel || '') + ' · ' + esc(g.carrera || '') + ' · Grupo ' + esc(g.nombre) + '</p><table class="grid"><tbody>' +
      [['Tipo', TIPO[x.tipo] || x.tipo], ['Fecha y hora', u.fFecha(x.f) + (x.hora ? ', ' + x.hora : '')], ['Lugar', x.lugar], ['Alumnos', (x.aids || []).map(id => { const a = D.alumno(g, id); return a ? a.num + '. ' + a.nombre : ''; }).join('; ') || '—'], ['¿Qué pasó?', x.desc], ['¿Qué se hizo?', x.accion || '—'], ['Medida preventiva', x.medida || '—'], ['Aviso a casa', x.casa ? 'Sí' : 'No']].map(r => '<tr><td class="f" style="width:28%">' + esc(r[0]) + '</td><td class="l">' + esc(r[1]) + '</td></tr>').join('') +
      '</tbody></table><div class="sig"><div>' + esc(cf.docente || 'Docente') + '</div></div><div class="sig"><div>Dirección / Coordinación</div></div></div>', { title: 'Incidente ' + x.f, margin: '12mm' });
  };
  A['sg-todos'] = () => { if (!confirm('¿Marcar a todos los alumnos como que firmaron hoy el reglamento?')) return; const g = D.grupoActual(); S.update(KG(g), d => { d.firmas = d.firmas || {}; D.alumnos(g).forEach(a => { if (!d.firmas[a.id]) d.firmas[a.id] = u.today(); }); }, {}); };
  A['sg-cfg'] = () => { const r = (document.getElementById('sg-reglas') || {}).value || '', e = (document.getElementById('sg-epp-t') || {}).value || ''; const L = t => t.split('\n').map(x => x.replace(/^\s*[\d.)\-•]+\s*/, '').trim()).filter(Boolean); S.update(KC, c => { c.reglas = L(r); c.epp = L(e); c.version = (c.version || 1) + 1; }, {}); u.toast('Guardado', 'ok'); };
  A['sg-cfg-base'] = () => { if (!confirm('¿Volver al reglamento y la lista de base?')) return; S.put(KC, {}); };
  const reglamento = (g, a) => { const cf = D.cfg(), sc = SG.cfg(); return '<div class="pr sg-pr"><div class="p-title">REGLAMENTO DE SEGURIDAD DEL TALLER</div><p class="tiny c">' + esc(cf.plantel || '') + ' · ' + esc(g.carrera || '') + ' · Grupo ' + esc(g.nombre) + ' · Docente: ' + esc(cf.docente || '') + '</p><ol class="sg-reglas">' + sc.reglas.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>' +
    (a ? '<p>Yo, <b>' + esc(a.nombre) + '</b>, leí este reglamento y me comprometo a cumplirlo. Entiendo que si no lo cumplo no podré trabajar en las prácticas con herramienta o corriente.</p><div class="ap-firmas"><span>Firma del alumno</span><span>Firma de madre, padre o tutor(a)</span></div>' : '') + '</div>'; };
  A['sg-print'] = () => { const g = D.grupoActual(), al = D.alumnos(g); E.print.run(reglamento(g) + '<div class="pr" style="page-break-before:always"><div class="p-title">HOJA DE FIRMAS · REGLAMENTO DEL TALLER</div><p class="tiny c">Grupo ' + esc(g.nombre) + ' · Fecha: ____________</p><table class="grid"><thead><tr><th>No.</th><th class="l">NOMBRE</th><th>FIRMA DEL ALUMNO</th><th>FIRMA DE CASA</th></tr></thead><tbody>' + al.map(a => '<tr class="tall"><td class="c">' + a.num + '</td><td class="nm">' + esc(a.nombre) + '</td><td></td><td></td></tr>').join('') + '</tbody></table></div>', { title: 'Reglamento del taller · ' + g.nombre, margin: '10mm' }); };
  A['sg-print-ind'] = () => { const g = D.grupoActual(); E.print.run(D.alumnos(g).map(a => reglamento(g, a)).join('<div style="page-break-after:always"></div>'), { title: 'Reglamento por alumno · ' + g.nombre, margin: '12mm' }); };
})();

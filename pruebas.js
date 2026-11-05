/* Escuadra · Pruebas físicas del proyecto (v1.28.4). En Proyecto, la tarjeta «🧪 Pruebas físicas y bitácora de fallas»:
   1) Rúbricas de evaluación física (garras; brazos y grúas), una hoja por equipo con su nombre, proyecto e integrantes ya
      escritos, o en blanco. Los criterios y puntos se pueden editar (para el 3er parcial).
   2) Capturar los puntos de cada aspecto por equipo: el total pasa a Calificaciones como actividad de Libreta, Proyecto y
      Bitácora (el 40 %) a cada integrante.
   3) Bitácora de pruebas y análisis de fallas, por equipo o por alumno (eliges al imprimir). Capturas lo que respondan;
      las 3 mejoras de la Fase 3 aparecen en el equipo en el proyecto del parcial siguiente, para palomearlas.
   Las rúbricas y la bitácora son las que diseñó el docente (Especialidad en Mecatrónica, 3er semestre). */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn;
  const PF = E.pruebas = {};
  const KD = (g, pid) => 'prueba:' + g.id + ':' + pid, KR = 'rubFisica';
  const PJ = () => E.proyecto;
  if (E.undo && E.undo.NOMBRE) ['pfi-pt', 'pfi-tipo', 'pfi-campo', 'pfi-bit', 'pfi-ok', 'pfi-mej', 'pfi-rub', 'pfi-rub-add', 'pfi-rub-del', 'pfi-rub-orig'].forEach(k => { E.undo.NOMBRE[k] = 'prueba del proyecto'; });

  /* ---------- rúbricas (las del docente; se pueden editar) ---------- */
  const RUB0 = {
    brazo: { t: 'Brazos Robóticos y Grúas', asp: [
      ['fid', 'Fidelidad al Diseño (FreeCAD)', 'Las dimensiones físicas del modelo coinciden con los planos de FreeCAD. Se respeta una tolerancia de ±1 cm en eslabones y estructura base.', 20],
      ['mov', 'Movilidad y Transmisión', 'El mecanismo tiene buena movilidad; las articulaciones giran o se extienden de manera fluida, sin atascarse, utilizando su sistema de actuadores correctamente.', 15],
      ['ens', 'Ensamblaje Limpio', 'Diseño mecánico funcional: las piezas no chocan entre sí al realizar el recorrido máximo de sus grados de libertad.', 15],
      ['lev', 'Prueba de Levantamiento', 'Logra levantar la carga progresiva y sostenerla a 5 cm de la mesa durante al menos 10 segundos sin que la estructura colapse o se doble.', 25],
      ['tra', 'Prueba de Traslado', 'Completa el circuito (mover 3 objetos distintos del Punto A al Punto B) demostrando control y precisión, sin tirar ni dañar la carga.', 25]] },
    garra: { t: 'Garras Robóticas', asp: [
      ['fid', 'Fidelidad al Diseño (FreeCAD)', 'Las dimensiones de las mordazas, engranes o ejes coinciden con los planos de FreeCAD. Se respeta una tolerancia estricta de ±1 cm.', 20],
      ['mov', 'Movilidad y Apertura', 'La apertura y cierre de la garra es suave, uniforme y responde correctamente al mecanismo de accionamiento sin necesidad de forzarlo.', 15],
      ['ens', 'Ensamblaje Limpio', 'Las mordazas y eslabones de la garra cierran de forma alineada y no chocan o se estorban internamente al operar su recorrido.', 15],
      ['trac', 'Prueba de Tracción', 'Mantiene un agarre firme sobre el objeto cilíndrico, generando fricción y resistiendo la fuerza de tracción hacia abajo sin que el objeto resbale.', 25],
      ['toq', 'Prueba del Toque Delicado', 'Logra sujetar, levantar y soltar el objeto frágil (vaso plástico o cascarón) sin deformarlo, aplastarlo o dejarlo caer.', 25]] }
  };
  const norm = r => ({ t: r.t, asp: r.asp.map(a => Array.isArray(a) ? { id: a[0], t: a[1], c: a[2], pts: a[3] } : a) });
  PF.rub = k => { const c = (S.get(KR) || {})[k]; return c && Array.isArray(c.asp) ? Object.assign({ propio: true }, c) : Object.assign({ propio: false }, norm(RUB0[k])); };
  const TIPOS = { garra: 'Garra', brazo: 'Brazo', grua: 'Grúa' };
  const rubDe = tipo => tipo === 'garra' ? 'garra' : 'brazo';   // la grúa usa la rúbrica de brazos y grúas
  PF.max = k => PF.rub(k).asp.reduce((s, a) => s + Number(a.pts || 0), 0);

  /* ---------- datos por equipo ---------- */
  PF.doc = (g, pid) => S.get(KD(g, pid)) || {};
  PF.eq = (g, pid, eqId) => ((PF.doc(g, pid).eq || {})[eqId]) || {};
  const def = (g, pid) => (PJ() && PJ().def(g, pid)) || { nombre: 'Proyecto' };
  const equipos = (g, pid) => ((PJ() && PJ().doc(g, pid).equipos) || []).filter(e => (e.al || []).length);
  // tipo de mecanismo: el que elegiste, o el que se lee en el nombre de su proyecto
  // solo se adivina si el nombre dice un solo tipo («Garra o brazo articulado» no basta: se elige)
  const lee = s => { const n = u.norm(s || ''), h = [/GARRA|PINZA|MORDAZA/.test(n) && 'garra', /BRAZO/.test(n) && 'brazo', /GRUA/.test(n) && 'grua'].filter(Boolean); return h.length === 1 ? h[0] : null; };
  PF.tipo = (g, pid, eq) => { const t = PF.eq(g, pid, eq.id).tipo; if (TIPOS[t]) return t; return lee(eq.proy) || lee(def(g, pid).nombre); };
  PF.total = (g, pid, eq) => { const x = PF.eq(g, pid, eq.id), t = PF.tipo(g, pid, eq); if (!t || !x.pts) return null; const as = PF.rub(rubDe(t)).asp; if (!as.some(a => x.pts[a.id] != null && x.pts[a.id] !== '')) return null; return as.reduce((s, a) => s + Math.min(Number(a.pts || 0), Number(x.pts[a.id] || 0)), 0); };
  const integrantes = (g, eq) => (eq.al || []).map(id => D.alumno(g, id)).filter(Boolean);
  const upd = (pid, fn) => { const g = D.grupoActual(); S.update(KD(g, pid), d => { d.eq = d.eq || {}; fn(d, g); }, {}); };
  const updEq = (pid, eqId, fn) => upd(pid, d => { const x = d.eq[eqId] = d.eq[eqId] || {}; fn(x, d); });

  // la calificación va a una actividad de Libreta, Proyecto y Bitácora (trabajos), en base 100
  PF.sync = (g, pid, eqId) => {
    const eq = equipos(g, pid).find(e => e.id === eqId); if (!eq) return; const tot = PF.total(g, pid, eq), t = PF.tipo(g, pid, eq); if (tot == null || !t) return;
    const mx = PF.max(rubDe(t)), cal = mx ? Math.round(tot / mx * 1000) / 10 : 0, x = PF.eq(g, pid, eqId), fecha = x.f || u.today();
    let id = PF.doc(g, pid).actId, a = id && S.get('act:' + g.id + ':' + id);
    if (!a) {
      id = u.uid('act'); const pa = C.parcialActual(fecha);
      S.put('act:' + g.id + ':' + id, { id: id, parcial: pa.id, categoria: 'trabajos', nombre: 'Prueba física del proyecto · ' + def(g, pid).nombre, peso: 1, max: 100, fecha: fecha, instrumento: 'R', cuenta: true, notas: {}, prueba: pid }, { silent: true });
      upd(pid, d => { d.actId = id; });
    }
    S.update('act:' + g.id + ':' + id, act => { act.notas = act.notas || {}; integrantes(g, eq).forEach(al => { act.notas[al.id] = cal; }); });
  };

  /* ---------- hojas para imprimir ---------- */
  const CSS = '<style>.pfi{font:9.5pt/1.3 Arial,Helvetica,sans-serif;color:#000}.pfi h1{font-size:14pt;margin:0;text-align:center;letter-spacing:.02em}.pfi .sub{text-align:center;margin:1mm 0 4mm;font-size:10pt;color:#333}' +
    '.pfi .lin{display:flex;gap:6mm;margin:0 0 3mm}.pfi .lin span{flex:1;border-bottom:1px solid #000;padding:0 1mm 1px;min-height:5mm}.pfi .lin b{white-space:nowrap}' +
    '.pfi table{border-collapse:collapse;width:100%}.pfi th,.pfi td{border:1px solid #000;padding:2mm;vertical-align:middle}.pfi th{background:#dde6e5;font-size:8.5pt}.pfi td.a{width:28mm;font-weight:bold;font-size:9pt}.pfi td.n{width:19mm;text-align:center;font-size:12pt;font-weight:bold}.pfi td.o{width:21mm;text-align:center;font-size:12pt}' +
    '.pfi .tot{display:flex;justify-content:flex-end;gap:3mm;margin:3mm 0;font-weight:bold;font-size:11pt}.pfi .tot span{min-width:30mm;border-bottom:1.5px solid #000;text-align:center}.pfi .obs{border:1px solid #000;min-height:28mm;padding:2mm;font-size:9pt}' +
    '.pfi .fase{background:#dde6e5;font-weight:bold;padding:1.5mm 2mm;margin:4mm 0 2mm;border-left:4px solid #0e5e5a}.pfi .q{margin:2mm 0 1mm}.pfi .r{border-bottom:1px dotted #555;min-height:6mm;margin:0 0 1mm;padding:0 1mm;font-family:inherit}.pfi .ck{display:inline-block;width:3.2mm;height:3.2mm;border:1px solid #000;margin:0 1mm 0 3mm;vertical-align:-.4mm;text-align:center;line-height:3mm;font-size:8pt}' +
    '.pfi .pie{font-size:7.5pt;color:#444;margin-top:5mm}.pfi-hoja{page-break-after:always}.pfi-hoja:last-child{page-break-after:auto}</style>';
  const pie = g => '<p class="pie">' + esc((g.carrera ? 'Especialidad en ' + u.cap(String(g.carrera).toLowerCase().replace(/^t[eé]cnico en /, '').replace(/\s+\d{4}$/, '')) : 'Especialidad') + ' - ' + (g.semestre || '') + 'er Semestre · ' + g.nombre) + '</p>';
  const nomEq = eq => eq ? eq.nombre + (eq.proy ? ' · ' + eq.proy : '') : '';
  PF.hojaRubrica = (g, pid, eq, k, conPts) => {
    const r = PF.rub(k), x = eq ? PF.eq(g, pid, eq.id) : {}, pts = conPts && x.pts ? x.pts : {}, tot = conPts && eq ? PF.total(g, pid, eq) : null;
    return '<div class="pfi pfi-hoja"><h1>RÚBRICA DE EVALUACIÓN FÍSICA</h1><p class="sub">' + esc(r.t) + '</p>' +
      '<div class="lin"><b>Equipo:</b><span>' + esc(nomEq(eq)) + '</span><b>Fecha:</b><span style="flex:.45">' + (conPts && x.f ? esc(u.fCorta(x.f)) : '') + '</span></div>' +
      (eq ? '<div class="lin"><b>Integrantes:</b><span style="font-size:8.5pt">' + integrantes(g, eq).map(a => esc(a.nombre)).join(', ') + '</span></div>' : '<div class="lin"><b>Integrantes:</b><span></span></div>') +
      '<table><thead><tr><th>Aspecto a Evaluar</th><th>Criterio de Desempeño</th><th>Puntos<br>Posibles</th><th>Puntos<br>Obtenidos</th></tr></thead><tbody>' +
      r.asp.map((a, i) => '<tr><td class="a">' + (i + 1) + '. ' + esc(a.t) + '</td><td>' + esc(a.c) + '</td><td class="n">' + a.pts + '</td><td class="o">' + (pts[a.id] != null && pts[a.id] !== '' ? esc(pts[a.id]) : '') + '</td></tr>').join('') + '</tbody></table>' +
      '<div class="tot">Calificación Total:<span>' + (tot != null ? tot + ' / ' + PF.max(k) : '') + '</span></div>' +
      '<div class="obs"><b>Observaciones / Comentarios del Docente:</b><br>' + (conPts && x.obs ? esc(x.obs) : '') + '</div>' + pie(g) + '</div>';
  };
  const ck = on => '<span class="ck">' + (on ? '✓' : '') + '</span>';
  const lineas = (txt, n) => txt ? '<div class="r">' + esc(txt) + '</div>' : Array.from({ length: n }, () => '<div class="r"></div>').join('');
  PF.hojaBitacora = (g, pid, eq, alumno, conResp) => {
    const t = eq ? PF.tipo(g, pid, eq) : null, b = conResp && eq ? (PF.eq(g, pid, eq.id).bit || {}) : {}, sn = v => ck(v === 'si') + ' SÍ ' + ck(v === 'no') + ' NO';
    return '<div class="pfi pfi-hoja"><h1>BITÁCORA DE PRUEBAS Y ANÁLISIS DE FALLAS</h1><p class="sub">Reporte Técnico ' + (alumno ? 'del Alumno' : 'del Equipo') + '</p>' +
      (alumno ? '<div class="lin"><b>Nombre:</b><span>' + esc(alumno.nombre) + '</span><b>No.</b><span style="flex:.12">' + alumno.num + '</span></div>' : '') +
      '<div class="lin"><b>Nombre del Equipo:</b><span>' + esc(nomEq(eq)) + '</span></div>' +
      '<div class="lin"><b>Integrantes:</b><span style="font-size:8.5pt">' + (eq ? integrantes(g, eq).map(a => esc(a.nombre)).join(', ') : '') + '</span></div>' +
      '<div class="lin"><b>Tipo de Mecanismo:</b>' + ck(t === 'garra') + 'Garra ' + ck(t === 'brazo') + 'Brazo ' + ck(t === 'grua') + 'Grúa <b style="margin-left:4mm">Material Principal:</b><span>' + esc(b.mat || '') + '</span></div>' +
      '<div class="fase">Fase 1: Reporte de Pruebas Físicas</div>' +
      '<p class="q"><b>Prueba 1 (Fuerza / Carga):</b> ¿Se logró el objetivo? ' + sn(b.p1ok) + '</p><p class="q"><i>¿Qué parte del mecanismo sufrió más estrés mecánico o se dobló durante el esfuerzo?</i></p>' + lineas(b.p1, 2) +
      '<p class="q"><b>Prueba 2 (Precisión / Control):</b> ¿Se logró el objetivo? ' + sn(b.p2ok) + '</p><p class="q"><i>¿Qué dificultad específica tuvieron al intentar controlar el movimiento con precisión?</i></p>' + lineas(b.p2, 2) +
      '<div class="fase">Fase 2: Análisis Estructural y de Diseño</div>' +
      '<p class="q"><b>1. Colisiones:</b> <i>¿Hubo alguna pieza que chocara con otra y limitara el movimiento? ¿En qué articulación?</i></p>' + lineas(b.col, 2) +
      '<p class="q"><b>2. Tolerancias:</b> <i>Al medir su proyecto físico y compararlo con FreeCAD, ¿hubo variaciones mayores a 1 cm? ¿Por qué creen que ocurrió al momento de cortar o ensamblar?</i></p>' + lineas(b.tol, 2) +
      '<p class="q"><b>3. Fricción:</b> <i>¿Las articulaciones se movían fluidas o estaban muy apretadas/flojas?</i></p>' + lineas(b.fri, 2) +
      '<div class="fase">Fase 3: Plan de Mejora Continua (Hacia el 3er Parcial)</div>' +
      '<p class="q">Menciona 3 modificaciones técnicas que le harán a su mecanismo para mejorar su resistencia y precisión (ej. reforzar la base, cambiar el eje, modificar los planos en FreeCAD).</p>' +
      [0, 1, 2].map(i => '<p class="q"><b>' + (i + 1) + '.</b></p>' + lineas((b.mej || [])[i], 1)).join('') + pie(g) + '</div>';
  };
  const imprime = (g, hojas, titulo) => E.print.run(CSS + hojas.join(''), { title: titulo + ' · ' + g.nombre, margin: '10mm' });
  A['pfi-print'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, que = el.dataset.q, eqs = equipos(g, pid), hojas = [];
    if (que === 'rub') {
      const sin = eqs.filter(eq => !PF.tipo(g, pid, eq)); if (sin.length) { u.toast('Elige si es garra, brazo o grúa: ' + sin.map(e => e.nombre).join(', '), 'err', 5000); return; }
      eqs.forEach(eq => hojas.push(PF.hojaRubrica(g, pid, eq, rubDe(PF.tipo(g, pid, eq)), el.dataset.c === '1'))); imprime(g, hojas, 'Rúbricas de prueba física');
    } else if (que === 'rub0') { hojas.push(PF.hojaRubrica(g, pid, null, el.dataset.k)); imprime(g, hojas, 'Rúbrica ' + PF.rub(el.dataset.k).t); }
    else if (que === 'rub1') { const eq = eqs.find(e => e.id === el.dataset.eq); if (!eq || !PF.tipo(g, pid, eq)) return; imprime(g, [PF.hojaRubrica(g, pid, eq, rubDe(PF.tipo(g, pid, eq)), true)], 'Rúbrica · ' + eq.nombre); }
    else if (que === 'bitEq') { eqs.forEach(eq => hojas.push(PF.hojaBitacora(g, pid, eq, null))); imprime(g, hojas, 'Bitácora de pruebas por equipo'); }
    else if (que === 'bitAl') { eqs.forEach(eq => integrantes(g, eq).forEach(a => hojas.push(PF.hojaBitacora(g, pid, eq, a)))); imprime(g, hojas, 'Bitácora de pruebas por alumno'); }
    else if (que === 'bit0') { hojas.push(PF.hojaBitacora(g, pid, null, null)); imprime(g, hojas, 'Bitácora de pruebas'); }
  };

  /* ---------- capturar: puntos de la rúbrica y respuestas de la bitácora ---------- */
  const capturaHTML = (g, pid, eq) => {
    const x = PF.eq(g, pid, eq.id), t = PF.tipo(g, pid, eq), b = x.bit || {}, d = 'data-pid="' + pid + '" data-eq="' + eq.id + '"';
    const sel = '<label class="fld"><span>Tipo de mecanismo</span><select data-ch="pfi-tipo" ' + d + '>' + (t ? '' : '<option value="">Elegir…</option>') + Object.keys(TIPOS).map(k => '<option value="' + k + '"' + (k === t ? ' selected' : '') + '>' + TIPOS[k] + '</option>').join('') + '</select></label>';
    if (!t) return '<p class="small">' + esc(integrantes(g, eq).map(a => u.corto(a.nombre)).join(', ')) + '</p>' + sel + '<p class="muted small">Elige el tipo para saber qué rúbrica usar.</p>';
    const r = PF.rub(rubDe(t)), tot = PF.total(g, pid, eq), tx = (k, lbl, n) => '<label class="fld"><span>' + lbl + '</span><textarea rows="' + (n || 2) + '" data-ch="pfi-bit" ' + d + ' data-k="' + k + '">' + esc(b[k] || '') + '</textarea></label>';
    const sn = (k, lbl) => '<div class="fld"><span>' + lbl + '</span><div class="row gap">' + ['si', 'no'].map(v => '<label class="switch sm"><input type="radio" name="pfi-' + k + '" value="' + v + '" data-ch="pfi-bit" ' + d + ' data-k="' + k + '"' + (b[k] === v ? ' checked' : '') + '><span>' + (v === 'si' ? 'Sí' : 'No') + '</span></label>').join('') + '</div></div>';
    return '<p class="small">' + esc(integrantes(g, eq).map(a => u.corto(a.nombre)).join(', ')) + '</p><div class="fgrid">' + sel + '<label class="fld"><span>Fecha de la prueba</span><input type="date" data-ch="pfi-campo" ' + d + ' data-k="f" value="' + esc(x.f || u.today()) + '"></label></div>' +
      '<h4>📋 ' + esc(r.t) + '</h4><ul class="pfi-cap">' + r.asp.map((a, i) => '<li><span><b>' + (i + 1) + '. ' + esc(a.t) + '</b><small class="muted">' + esc(a.c) + '</small></span><span class="row gap"><input class="inp" inputmode="decimal" style="width:64px;text-align:center" data-ch="pfi-pt" ' + d + ' data-a="' + a.id + '" data-max="' + a.pts + '" value="' + esc(x.pts && x.pts[a.id] != null ? x.pts[a.id] : '') + '" aria-label="Puntos de ' + esc(a.t) + '"><small>/ ' + a.pts + '</small></span></li>').join('') + '</ul>' +
      '<p class="pfi-tot">Calificación total: <b id="pfi-tot">' + (tot == null ? '—' : tot + ' / ' + PF.max(rubDe(t))) + '</b></p>' +
      '<label class="fld"><span>Observaciones del docente</span><textarea rows="2" data-ch="pfi-campo" ' + d + ' data-k="obs">' + esc(x.obs || '') + '</textarea></label>' +
      '<p class="muted small">El total pasa a Calificaciones («Prueba física del proyecto», en Libreta, Proyecto y Bitácora) a cada integrante.</p>' +
      '<details class="sub"><summary>📝 Bitácora de pruebas y fallas (lo que respondieron)</summary>' +
      '<label class="fld"><span>Material principal</span><input data-ch="pfi-bit" ' + d + ' data-k="mat" value="' + esc(b.mat || '') + '" placeholder="Ej. MDF de 3 mm"></label>' +
      sn('p1ok', 'Prueba 1 (Fuerza / Carga): ¿se logró?') + tx('p1', '¿Qué parte sufrió más estrés o se dobló?') + sn('p2ok', 'Prueba 2 (Precisión / Control): ¿se logró?') + tx('p2', '¿Qué dificultad tuvieron para controlar el movimiento?') +
      tx('col', '1. Colisiones') + tx('tol', '2. Tolerancias (vs. FreeCAD)') + tx('fri', '3. Fricción') +
      '<h4>Fase 3: Plan de mejora (hacia el siguiente parcial)</h4>' + [0, 1, 2].map(i => '<label class="fld"><span>Mejora ' + (i + 1) + '</span><input data-ch="pfi-mej" ' + d + ' data-i="' + i + '" value="' + esc((b.mej || [])[i] || '') + '" placeholder="' + ['Ej. reforzar la base', 'Ej. cambiar el eje por uno de 6 mm', 'Ej. corregir los planos en FreeCAD'][i] + '"></label>').join('') +
      '<p class="muted small">Las mejoras salen en este equipo en el proyecto del parcial siguiente, para palomearlas.</p></details>' +
      '<div class="row gap wrap mt">' + btn('🖨 Imprimir su rúbrica con puntos', 'pfi-print', d + ' data-q="rub1"', 'small') + btn('✓ Listo', 'pfi-cerrar', '', 'primary') + '</div>';
  };
  A['pfi-cap'] = el => { const g = D.grupoActual(), eq = equipos(g, el.dataset.pid).find(e => e.id === el.dataset.eq); if (!eq) return; E.ui.pfCap = { pid: el.dataset.pid, eq: eq.id }; E.modal.open('🧪 ' + eq.nombre + (eq.proy ? ' · ' + eq.proy : ''), capturaHTML(g, el.dataset.pid, eq)); };
  A['pfi-cerrar'] = () => { E.ui.pfCap = null; E.modal.close(); };
  const repinta = (pid, eqId) => { const g = D.grupoActual(), eq = equipos(g, pid).find(e => e.id === eqId); if (eq) E.modal.body(capturaHTML(g, pid, eq)); };
  CH['pfi-tipo'] = el => { updEq(el.dataset.pid, el.dataset.eq, x => { x.tipo = el.value; }); const g = D.grupoActual(); PF.sync(g, el.dataset.pid, el.dataset.eq); if (E.ui.pfCap) repinta(el.dataset.pid, el.dataset.eq); };
  CH['pfi-pt'] = el => {
    const v = el.value.trim().replace(',', '.'), mx = Number(el.dataset.max), n = v === '' ? '' : Number(v);
    if (v !== '' && (!isFinite(n) || n < 0 || n > mx)) { u.toast('Escribe de 0 a ' + mx + ' puntos', 'err'); el.select && el.select(); return; }
    updEq(el.dataset.pid, el.dataset.eq, x => { x.pts = x.pts || {}; x.pts[el.dataset.a] = n; if (!x.f) x.f = u.today(); });
    const g = D.grupoActual(); PF.sync(g, el.dataset.pid, el.dataset.eq);
    const eq = equipos(g, el.dataset.pid).find(e => e.id === el.dataset.eq), tot = eq && PF.total(g, el.dataset.pid, eq), o = document.getElementById('pfi-tot'); if (o) o.textContent = tot == null ? '—' : tot + ' / ' + PF.max(rubDe(PF.tipo(g, el.dataset.pid, eq)));
    const L = [...document.querySelectorAll('[data-ch=pfi-pt]')], i = L.indexOf(el); if (L[i + 1]) { L[i + 1].focus(); L[i + 1].select && L[i + 1].select(); }
  };
  CH['pfi-campo'] = el => { updEq(el.dataset.pid, el.dataset.eq, x => { x[el.dataset.k] = el.value.trim(); }); if (el.dataset.k === 'f') { const g = D.grupoActual(), id = PF.doc(g, el.dataset.pid).actId; if (id && S.get('act:' + g.id + ':' + id)) S.update('act:' + g.id + ':' + id, a => { a.fecha = el.value || a.fecha; }); } };
  CH['pfi-bit'] = el => updEq(el.dataset.pid, el.dataset.eq, x => { x.bit = x.bit || {}; x.bit[el.dataset.k] = el.value.trim(); });
  CH['pfi-mej'] = el => updEq(el.dataset.pid, el.dataset.eq, x => { x.bit = x.bit || {}; const m = (x.bit.mej || ['', '', '']).slice(); m[Number(el.dataset.i)] = el.value.trim(); x.bit.mej = m; });

  /* ---------- editar las rúbricas (para el 3er parcial o lo que necesites) ---------- */
  const rubEdHTML = () => ['garra', 'brazo'].map(k => { const r = PF.rub(k); return '<details class="sub"' + (E.ui.pfRubK === k ? ' open' : '') + '><summary>' + esc(r.t) + ' · ' + PF.max(k) + ' puntos</summary>' +
    '<label class="fld"><span>Título</span><input data-ch="pfi-rub" data-k="' + k + '" data-f="t" value="' + esc(r.t) + '"></label>' +
    r.asp.map((a, i) => '<div class="pfi-ra"><div class="row gap"><input class="inp" data-ch="pfi-rub" data-k="' + k + '" data-i="' + i + '" data-f="t" value="' + esc(a.t) + '" aria-label="Aspecto ' + (i + 1) + '"><input class="inp" inputmode="decimal" style="width:64px;text-align:center" data-ch="pfi-rub" data-k="' + k + '" data-i="' + i + '" data-f="pts" value="' + a.pts + '" aria-label="Puntos">' + btn('🗑', 'pfi-rub-del', 'data-k="' + k + '" data-i="' + i + '" aria-label="Quitar aspecto"', 'small ghost') + '</div><textarea rows="2" data-ch="pfi-rub" data-k="' + k + '" data-i="' + i + '" data-f="c" aria-label="Criterio">' + esc(a.c) + '</textarea></div>').join('') +
    '<div class="row gap wrap">' + btn('➕ Agregar aspecto', 'pfi-rub-add', 'data-k="' + k + '"', 'small') + (r.propio ? btn('↺ Volver a la original', 'pfi-rub-orig', 'data-k="' + k + '"', 'small ghost') : '') + '</div></details>'; }).join('') + '<p class="muted small">Si ya capturaste puntos, cambiar los puntos posibles recalcula la calificación la próxima vez que captures a ese equipo.</p>';
  A['pfi-rub-ed'] = () => E.modal.open('✏️ Rúbricas de prueba física', rubEdHTML());
  const updRub = (k, fn) => { S.update(KR, d => { if (!d[k] || !Array.isArray(d[k].asp)) d[k] = norm(RUB0[k]); fn(d[k]); }, {}); E.ui.pfRubK = k; E.modal.body(rubEdHTML()); };
  CH['pfi-rub'] = el => { const k = el.dataset.k, f = el.dataset.f, v = el.value.trim(); if (!v) { u.toast('No lo dejes vacío', 'err'); E.modal.body(rubEdHTML()); return; } if (f === 'pts' && !(Number(v) > 0)) { u.toast('Escribe los puntos', 'err'); E.modal.body(rubEdHTML()); return; }
    updRub(k, r => { if (el.dataset.i == null) r[f] = v; else { const a = r.asp[Number(el.dataset.i)]; if (a) a[f] = f === 'pts' ? Number(v) : v; } }); };
  A['pfi-rub-add'] = el => updRub(el.dataset.k, r => { r.asp.push({ id: u.uid('asp'), t: 'Nuevo aspecto', c: 'Describe el criterio de desempeño.', pts: 10 }); });
  A['pfi-rub-del'] = el => { const r = PF.rub(el.dataset.k); if (r.asp.length <= 1 || !confirm('¿Quitar «' + r.asp[Number(el.dataset.i)].t + '»?')) return; updRub(el.dataset.k, x => { x.asp.splice(Number(el.dataset.i), 1); }); };
  A['pfi-rub-orig'] = el => { if (!confirm('¿Volver a la rúbrica original?')) return; S.update(KR, d => { delete d[el.dataset.k]; }, {}); E.modal.body(rubEdHTML()); };

  /* ---------- plan de mejora: las mejoras de un parcial salen en el siguiente ---------- */
  // mejoras capturadas en otros parciales de los equipos que tienen a alguno de estos integrantes
  PF.mejoras = (g, pid, eq) => {
    const mios = new Set(eq.al || []), out = [];
    ((PJ() && PJ().parciales(g)) || []).filter(p => p.id !== pid && p.inicio < (C.parcial(pid) || {}).inicio).forEach(p => {
      const dp = PF.doc(g, p.id); (equipos(g, p.id)).forEach(e2 => { const m = (((dp.eq || {})[e2.id] || {}).bit || {}).mej || []; if (!m.some(Boolean) || !(e2.al || []).some(a => mios.has(a))) return; m.forEach((t, i) => { if (t) out.push({ k: p.id + '|' + e2.id + '|' + i, t: t, de: e2.nombre, p: p.nombre }); }); });
    });
    return out;
  };
  A['pfi-mej-ok'] = el => upd(el.dataset.pid, d => { d.hechas = d.hechas || {}; const h = d.hechas[el.dataset.eq] = d.hechas[el.dataset.eq] || {}; if (h[el.dataset.k]) delete h[el.dataset.k]; else h[el.dataset.k] = u.today(); });
  if (E.undo && E.undo.NOMBRE) E.undo.NOMBRE['pfi-mej-ok'] = 'plan de mejora';

  /* ---------- en Proyecto ---------- */
  PF.tarjeta = (g, pid) => {
    const eqs = equipos(g, pid); if (!eqs.length) return ''; const d = 'data-pid="' + pid + '"';
    return card('<h3>🧪 Pruebas físicas y bitácora de fallas</h3><p class="muted small">Rúbrica de evaluación física por equipo (garras; brazos y grúas) y bitácora de pruebas. Toca un equipo para capturar sus puntos (pasan a Calificaciones) y lo que respondieron en la bitácora.</p>' +
      '<ul class="pfi-eqs">' + eqs.map(eq => { const t = PF.tipo(g, pid, eq), tot = PF.total(g, pid, eq), b = PF.eq(g, pid, eq.id).bit || {}, mej = (b.mej || []).filter(Boolean).length;
        return '<li><button type="button" class="pfi-eqb" data-act="pfi-cap" ' + d + ' data-eq="' + eq.id + '"><b>' + esc(eq.nombre) + '</b>' + (eq.proy ? ' <small>' + esc(eq.proy) + '</small>' : '') + '<small class="muted">' + (t ? TIPOS[t] : '⚠️ elige el tipo') + (mej ? ' · ' + mej + ' mejoras' : '') + '</small></button><span class="chip ' + (tot == null ? '' : 'ok') + '">' + (tot == null ? 'sin capturar' : tot + ' / ' + PF.max(rubDe(t))) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="row gap wrap">' + btn('🖨 Rúbricas (una por equipo)', 'pfi-print', d + ' data-q="rub"', 'primary small') + btn('🖨 Bitácora por equipo', 'pfi-print', d + ' data-q="bitEq"', 'small') + btn('🖨 Bitácora por alumno', 'pfi-print', d + ' data-q="bitAl"', 'small') + '</div>' +
      '<details class="sub"><summary>Más: en blanco, con puntos y editar rúbricas</summary><div class="row gap wrap">' + btn('🖨 Rúbricas con los puntos capturados', 'pfi-print', d + ' data-q="rub" data-c="1"', 'small') + btn('🖨 Rúbrica de garras en blanco', 'pfi-print', d + ' data-q="rub0" data-k="garra"', 'small ghost') + btn('🖨 Rúbrica de brazos y grúas en blanco', 'pfi-print', d + ' data-q="rub0" data-k="brazo"', 'small ghost') + btn('🖨 Bitácora en blanco', 'pfi-print', d + ' data-q="bit0"', 'small ghost') + btn('✏️ Editar rúbricas', 'pfi-rub-ed', '', 'small ghost') + '</div></details>');
  };
  const mejHTML = (g, pid, eq) => {
    const L = PF.mejoras(g, pid, eq); if (!L.length) return ''; const h = ((PF.doc(g, pid).hechas || {})[eq.id]) || {};
    return '<div class="pfi-mej"><b>🔧 Plan de mejora (del ' + esc(L[0].p) + ')</b><ul>' + L.map(m => '<li><button type="button" class="pfi-mejb' + (h[m.k] ? ' ok' : '') + '" data-act="pfi-mej-ok" data-pid="' + pid + '" data-eq="' + eq.id + '" data-k="' + esc(m.k) + '">' + (h[m.k] ? '✓' : '○') + '</button>' + esc(m.t) + (m.de !== eq.nombre ? ' <small class="muted">(' + esc(m.de) + ')</small>' : '') + '</li>').join('') + '</ul></div>';
  };
  if (V.proyecto) {
    const vp = V.proyecto;
    V.proyecto = function (pid) {
      const o = vp.apply(null, arguments), g = D.grupoActual(); if (!o || !g || !PJ() || /Algo falló|Primero importa|Configura|No hay grupo/.test(o.h)) return o;
      const ps = PJ().parciales(g), act = C.parcialActual(), p = ps.some(x => x.id === pid) ? pid : (ps.find(x => x.id === PJ().canon(g, act.id)) || ps[0] || {}).id;
      if (!p || E.ui.pjEdit === p || E.ui.pjEt === p) return o;
      equipos(g, p).forEach(eq => {
        const ancla = '<label class="fld mt"><span>Nota del equipo (qué les falta, acuerdos)</span><input data-ch="pj-nota" data-pid="' + p + '" data-eq="' + eq.id + '"', i = o.h.indexOf(ancla); if (i < 0) return;
        const tot = PF.total(g, p, eq), extra = (tot != null ? '<p class="small">🧪 Prueba física: <b>' + tot + ' / ' + PF.max(rubDe(PF.tipo(g, p, eq))) + '</b></p>' : '') + mejHTML(g, p, eq);
        if (extra) o.h = o.h.slice(0, i) + extra + o.h.slice(i);
      });
      const j = o.h.indexOf('<section class="card pj-card'); const t = PF.tarjeta(g, p);
      o.h = j >= 0 ? o.h.slice(0, j) + t + o.h.slice(j) : o.h + t;
      return o;
    };
  }
  if (V.imprimir) { const vi = V.imprimir; V.imprimir = function () { const o = vi.apply(null, arguments), g = D.grupoActual(); if (!o || !g || /Algo falló/.test(o.h) || !PJ()) return o; const p0 = C.parcialActual(), pid = PJ().canon(g, p0.id); if (!equipos(g, pid).length) return o;
    o.h += card('<h3>🧪 Pruebas físicas del proyecto</h3><p class="muted small">Rúbricas de evaluación física y bitácora de pruebas, ya con equipo, proyecto e integrantes. Para capturar puntos, ve a Proyecto.</p><div class="row gap wrap">' + btn('🖨 Rúbricas (una por equipo)', 'pfi-print', 'data-pid="' + pid + '" data-q="rub"', 'primary small') + btn('🖨 Bitácora de pruebas por equipo', 'pfi-print', 'data-pid="' + pid + '" data-q="bitEq"', 'small') + btn('🖨 Bitácora de pruebas por alumno', 'pfi-print', 'data-pid="' + pid + '" data-q="bitAl"', 'small') + '</div>'); return o; }; }
})();

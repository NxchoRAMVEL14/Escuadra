/* Escuadra · Bitácora técnica semanal del proyecto (v1.30.0). Una hoja por alumno por semana: se entrega el martes y se
   revisa el jueves o viernes. Parte del equipo (avance por etapa, datos de la prueba, falla y corrección, croquis) y parte
   personal (lo que hizo cada quien en cada sesión). Etapas, datos y rúbrica se editan; la hoja se acomoda sola a una carta.
   Calificación: cada semana es una actividad de Proyecto (peso 5; 6 semanas = 30), más «Proyecto terminado» (peso 5) y
   «Proyecto vs 2 pruebas» (peso 25): el rubro Proyecto del 3er parcial (60 %). Formato elegido por el docente: opción B. */
(function () {
  const E = window.E, S = E.store, D = E.data, C = E.calc, u = E.u, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const BT = E.bita = {};
  const K = (g, pid) => 'bita:' + g.id + ':' + pid;
  BT.DEF = {
    etapas: ['Diseño y medidas del mecanismo', 'Plano en FreeCAD del proyecto', 'Estructura armada', 'Circuito hidráulico (jeringas, mangueras, cilindros)', 'Motor instalado y conectado', 'Pruebas con carga'],
    datos: [['Carga que levantó', 'g'], ['Recorrido del cilindro', 'mm'], ['Voltaje del motor', 'V'], ['¿Funcionó?', 'sí/no'], ['Fugas o fallas', '']],
    rub: [['Avance del equipo marcado con honestidad', 2], ['Datos de prueba medidos (no inventados)', 3], ['Croquis con medidas', 2], ['Mi aporte personal concreto en cada sesión', 3]],
    rol: true, peso: 5
  };
  BT.cfg = (g, pid) => Object.assign({}, BT.DEF, S.get(K(g, pid)) || {});
  BT.max = c => c.rub.reduce((s, r) => s + Number(r[1] || 0), 0) || 10;

  /* ---------- semanas del parcial (lunes a viernes), con sus sesiones sin asuetos ---------- */
  const DS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  BT.semanas = (g, pid) => {
    const p = C.parcial(pid); if (!p) return [];
    const cl = C.clases(g, p).map(x => x.fecha), out = [];
    let lun = p.inicio; const d0 = u.parse(lun).getDay(); lun = u.addDays(lun, -((d0 + 6) % 7));
    for (; lun <= p.fin; lun = u.addDays(lun, 7)) {
      const vie = u.addDays(lun, 4), dias = cl.filter(f => f >= lun && f <= vie);
      if (!dias.length) continue;
      out.push({ n: out.length + 1, ini: dias[0], fin: dias[dias.length - 1], dias: dias, lun: lun });
    }
    return out;
  };
  BT.rango = s => { const a = u.fLarga(s.ini), b = u.fLarga(s.fin); if (s.ini === s.fin) return a; return u.parse(s.ini).getMonth() === u.parse(s.fin).getMonth() ? a.replace(/ de [a-zñ]+$/, '') + ' al ' + b : a + ' al ' + b; };
  const lugar = (g, f) => { const b = C.bloquesDia(g, f); return b.length && b.every(x => x.lugar === 'computo') ? 'Cómputo' : 'Taller'; };
  const diaTxt = f => DS[u.parse(f).getDay()] + ' ' + u.parse(f).getDate();

  /* ---------- equipo y proyecto del alumno (del parcial; si aún no hay equipos, los del parcial anterior) ---------- */
  BT.equipoDe = (g, pid, aid) => {
    const PJ = E.proyecto; if (!PJ) return null;
    const ps = [pid].concat(D.parciales().filter(p => p.id !== pid && p.inicio < (C.parcial(pid) || {}).inicio).map(p => p.id).reverse());
    for (const q of ps) { const eq = (PJ.doc(g, q).equipos || []).find(e => (e.al || []).indexOf(aid) >= 0); if (eq) return { eq: eq, proy: q === pid ? PJ.proyDe(g, pid, eq) : (eq.proy ? eq.proy + ' (versión hidráulica)' : '') }; }
    return null;
  };

  /* ---------- la hoja ---------- */
  const lineas = n => Array.from({ length: n }, () => '<div class="bt-ln"></div>').join('');
  const caja = (t, inner, cls, sub) => '<div class="bt-box ' + (cls || '') + '"><div class="bt-bt">' + t + (sub ? ' <small>' + sub + '</small>' : '') + '</div><div class="bt-in">' + inner + '</div></div>';
  const ck = '<span class="bt-ck"></span>';
  const reja = '<svg class="bt-grid" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none"><defs><pattern id="btp" width="18.9" height="18.9" patternUnits="userSpaceOnUse"><path d="M18.9 0H0V18.9" fill="none" stroke="#b9c7c5" stroke-width=".8"/></pattern></defs><rect width="100%" height="100%" fill="url(#btp)"/></svg>';
  BT.hoja = (g, pid, s, a, c) => {
    const e = a ? BT.equipoDe(g, pid, a.id) : null, sub = (g.nombre || '') + ' · ' + (C.parcial(pid) || {}).nombre + ' · Se entrega el martes y se revisa el jueves o viernes.';
    const hd = '<div class="bt-hd"><div><b>Alumno:</b> ' + (a ? esc(a.nombre) : '') + '</div><div><b>No. de lista:</b> ' + (a ? a.num : '') + '</div>' +
      '<div><b>Equipo:</b> ' + (e ? esc(e.eq.nombre || '') : '') + '</div><div><b>Proyecto:</b> ' + (e && e.proy ? esc(e.proy) : '') + '</div>' +
      '<div><b>Semana ' + s.n + ':</b> ' + esc(BT.rango(s)) + '</div><div>' + (c.rol ? '<b>Mi rol esta semana:</b>' : '') + '</div></div>';
    const et = '<table class="bt-t"><tr><th class="l">Etapa</th><th class="w">Ya quedó</th><th class="w">En proceso</th><th class="w">Falta</th></tr>' + c.etapas.map(x => '<tr><td>' + esc(x) + '</td><td class="c">' + ck + '</td><td class="c">' + ck + '</td><td class="c">' + ck + '</td></tr>').join('') + '</table>';
    const dt = '<table class="bt-t">' + c.datos.map(d => { const un = String(d[1] || ''); return '<tr><td>' + esc(d[0]) + '</td><td class="bt-v">' + (/^s[ií]\s*\/\s*no$/i.test(un) ? ck + 'Sí ' + ck + 'No' : '<span class="bt-un">' + esc(un) + '</span>') + '</td></tr>'; }).join('') + '</table><b class="bt-lb">Falla y corrección:</b>' + lineas(2);
    const ses = '<table class="bt-t bt-ses"><tr><th class="d">Sesión</th><th class="l">Lo que hice yo (concreto: medí, corté, conecté, dibujé…)</th></tr>' + s.dias.map(f => '<tr><td><b>' + diaTxt(f) + '</b><br><small>' + lugar(g, f) + '</small></td><td></td></tr>').join('') + '</table><b class="bt-lb">Lo que me costó y cómo lo saqué:</b>' + lineas(1);
    const rb = '<table class="bt-t bt-rub"><tr><th class="l">Revisión del docente (jueves o viernes)</th><th class="w">Pts</th><th class="w">Obtuvo</th></tr>' + c.rub.map(r => '<tr><td>' + esc(r[0]) + '</td><td class="c">' + r[1] + '</td><td></td></tr>').join('') + '<tr><td class="r"><b>Total</b></td><td class="c"><b>' + BT.max(c) + '</b></td><td></td></tr></table>';
    return '<div class="pr bth"><div class="bt-ti">BITÁCORA TÉCNICA DE LA SEMANA</div><div class="bt-sub">' + esc(sub) + '</div>' + hd +
      caja('1. Avance del equipo', et, '', '(marca lo que ya quedó)') +
      '<div class="bt-mid">' + caja('2. Datos de la prueba', dt, 'bt-dat') + caja('3. Croquis con medidas', reja, 'bt-cro') + '</div>' +
      caja('4. Mi aporte personal, sesión por sesión', ses) + rb +
      '<div class="bt-firmas"><div>Firma del alumno</div><div>Jefe de equipo</div><div>Vo.Bo. docente</div></div></div>';
  };
  // todas las hojas a una carta: si lo que agregaste no cabe, la hoja se reduce lo justo (igual en todas)
  const ALTO = 236;   // mm útiles de una carta vertical con el logo arriba
  BT.paquete = (g, pid, s, als, c) => {
    const prueba = BT.hoja(g, pid, s, als[0] || null, c).replace('class="pr bth"', 'class="pr bth medir"');
    let z = 1; try { const r = E.print.unaHoja(prueba, {}), m = /zoom:([\d.]+)/.exec(r); if (m) z = Math.max(0.6, Number(m[1]) * 0.99); } catch (e) { z = 1; }
    return als.map(a => '<div class="bt-pg"' + (z < 1 ? ' style="zoom:' + z + '"' : '') + '>' + BT.hoja(g, pid, s, a, c).replace('class="pr bth"', 'class="pr bth" style="height:' + (ALTO / z).toFixed(1) + 'mm"') + '</div>').join('');
  };
  BT.imprime = (g, pid, sn, q, aid) => {
    const c = BT.cfg(g, pid), s = BT.semanas(g, pid).find(x => x.n === Number(sn)); if (!s) { u.toast('No encontré esa semana', 'err'); return; }
    const al = D.alumnos(g); let lista;
    if (q === 'todos') { if (!al.length) { u.toast('Primero importa tu lista de alumnos', 'err'); return; } lista = al.concat([null]); }
    else if (q === 'uno') { const a = al.find(x => x.id === aid); if (!a) return; lista = [a]; }
    else lista = [null];
    E.print.run(BT.paquete(g, pid, s, lista, c), { title: 'Bitácora semana ' + s.n + (q === 'todos' ? ' · ' + al.length + ' alumnos + 1 en blanco' : q === 'uno' ? ' · ' + al.find(x => x.id === aid).nombre : ' (en blanco)') });
  };

  /* ---------- calificación: 6 semanas × 5 + terminado 5 + vs pruebas 25 = 60 ---------- */
  const actsP = (g, pid) => C.acts(g, pid);
  BT.actSem = (g, pid, n) => actsP(g, pid).find(a => a.bita === n);
  BT.armar = (g, pid) => {
    const c = BT.cfg(g, pid), cat = C.separa(pid) ? 'proyecto' : 'trabajos', ss = BT.semanas(g, pid), hechos = [];
    ss.forEach(s => {
      const ya = BT.actSem(g, pid, s.n), fecha = u.addDays(s.lun, 4) > s.fin ? s.fin : u.addDays(s.lun, 4);
      if (ya) { S.update('act:' + g.id + ':' + ya.id, a => { a.categoria = cat; a.peso = c.peso; a.max = BT.max(c); }); return; }
      const id = u.uid('act'); S.put('act:' + g.id + ':' + id, { id: id, parcial: pid, categoria: cat, nombre: 'Bitácora semana ' + s.n, peso: c.peso, max: BT.max(c), fecha: fecha, instrumento: 'B', cuenta: true, notas: {}, bita: s.n }, { silent: true }); hechos.push('Bitácora semana ' + s.n);
    });
    const L = actsP(g, pid).filter(a => C.esTrab(a) && !a.bita), nm = a => u.norm(a.nombre || '');
    const vs = L.find(a => /PRUEBA/.test(nm(a)) && !/REGLAMENTO|LIBRETA/.test(nm(a)));
    if (vs) S.update('act:' + g.id + ':' + vs.id, a => { a.categoria = cat; a.peso = 25; });
    else { const id = u.uid('act'); S.put('act:' + g.id + ':' + id, { id: id, parcial: pid, categoria: cat, nombre: 'Proyecto vs 2 pruebas', peso: 25, max: 100, fecha: (C.parcial(pid) || {}).fin, instrumento: 'R', cuenta: true, notas: {} }, { silent: true }); hechos.push('Proyecto vs 2 pruebas'); }
    const ter = L.find(a => /TERMINADO/.test(nm(a)));
    if (ter) S.update('act:' + g.id + ':' + ter.id, a => { a.categoria = cat; a.peso = 5; });
    else { const id = u.uid('act'); S.put('act:' + g.id + ':' + id, { id: id, parcial: pid, categoria: cat, nombre: 'Proyecto terminado', peso: 5, max: 100, fecha: (C.parcial(pid) || {}).fin, instrumento: 'LC', cuenta: true, notas: {} }, { silent: true }); hechos.push('Proyecto terminado'); }
    S.emit('acts'); return hechos;
  };
  BT.resumen = (g, pid) => {
    const L = actsP(g, pid).filter(a => a.categoria === 'proyecto' || (!C.separa(pid) && a.bita));
    const bit = L.filter(a => a.bita), otras = L.filter(a => !a.bita), sp = L.reduce((s, a) => s + Number(a.peso || 1), 0);
    return { bit: bit, otras: otras, suma: sp };
  };

  /* ---------- pantalla ---------- */
  const pidDe = pid => { const ps = D.parciales(); return pid && ps.some(p => p.id === pid) ? pid : (ps.find(p => C.separa(p.id)) || C.parcialActual()).id; };
  V.bitsem = (pid, sn) => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); pid = pidDe(pid); const p = C.parcial(pid), c = BT.cfg(g, pid), ss = BT.semanas(g, pid), al = D.alumnos(g), hoy = u.today();
    const s = ss.find(x => x.n === Number(sn)) || ss.find(x => x.fin >= hoy) || ss[ss.length - 1];
    let h = '<div class="filters">' + D.parciales().map(x => '<a class="tab ' + (x.id === pid ? 'on' : '') + '" href="#/bitsem/' + x.id + '">' + esc(x.nombre) + '</a>').join('') + '</div>';
    if (!s) return { t: 'Bitácora semanal', h: h + card('<p class="muted">Este parcial no tiene clases en el calendario.</p>') };
    h += card('<h3>📘 Bitácora técnica semanal</h3><p class="muted small">Una hoja por alumno: la parte del equipo (avance, datos de la prueba, falla y croquis) y lo que hizo cada quien en cada sesión. Se entrega el martes y se revisa el jueves o viernes. Ya trae su nombre, equipo, proyecto y las fechas de la semana sin asuetos.</p>' +
      '<div class="filters">' + ss.map(x => '<a class="tab ' + (x.n === s.n ? 'on' : '') + '" href="#/bitsem/' + pid + '/' + x.n + '">S' + x.n + '</a>').join('') + '</div>' +
      '<p class="small"><b>Semana ' + s.n + ':</b> ' + esc(BT.rango(s)) + ' · ' + s.dias.length + (s.dias.length === 1 ? ' sesión' : ' sesiones') + ' (' + s.dias.map(diaTxt).join(', ') + ')</p>' +
      '<div class="row gap wrap">' + btn('🖨 Las ' + (al.length + 1) + ' hojas (grupo + 1 en blanco)', 'bt-print', 'data-pid="' + pid + '" data-s="' + s.n + '" data-q="todos"', 'primary') + btn('🖨 Solo en blanco', 'bt-print', 'data-pid="' + pid + '" data-s="' + s.n + '" data-q="blanco"', '') + '</div>' +
      (al.length ? '<div class="row gap wrap mt"><select id="bt-al" class="inp">' + al.map(a => '<option value="' + a.id + '">' + a.num + '. ' + esc(a.nombre) + '</option>').join('') + '</select>' + btn('🖨 Solo este alumno', 'bt-print', 'data-pid="' + pid + '" data-s="' + s.n + '" data-q="uno"', 'small') + '</div>' : '') +
      '<p class="muted small">En la vista previa elige «Guardar como PDF» para mandarla o «Imprimir» para sacarla en papel.</p>');
    // capturar la semana
    const a = BT.actSem(g, pid, s.n), mx = BT.max(c);
    h += card('<h3>✅ Revisar semana ' + s.n + '</h3>' + (a ? '<p class="muted small">Puntos de 0 a ' + mx + '. Se guardan en «' + esc(a.nombre) + '» (' + esc(C.catLbl(a.categoria, pid)) + ', peso ' + a.peso + ').</p><div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th class="l">Alumno</th><th>Pts</th></tr></thead><tbody>' +
      al.map(x => { const v = (a.notas || {})[x.id]; return '<tr><td>' + x.num + '</td><td class="l">' + esc(u.corto ? u.corto(x.nombre) : x.nombre) + '</td><td><input class="inp bt-pts" type="number" min="0" max="' + mx + '" step="0.5" inputmode="decimal" value="' + (v == null ? '' : v) + '" data-ch="bt-pts" data-act="' + a.id + '" data-aid="' + x.id + '" aria-label="Puntos"></td></tr>'; }).join('') + '</tbody></table></div>'
      : '<p class="small">Todavía no hay actividades de bitácora en Calificaciones. Ármalas abajo con un toque.</p>'));
    // proyecto 60
    const r = BT.resumen(g, pid);
    h += card('<h3>📊 A Calificaciones (Proyecto)</h3><p class="small">Cada semana vale <b>' + c.peso + '</b> (' + ss.length + ' semanas = ' + c.peso * ss.length + '), <b>Proyecto terminado 5</b> y <b>Proyecto vs 2 pruebas 25</b>: así se reparte el ' + (C.separa(pid) ? C.pond(pid).proyecto + ' % de Proyecto' : 'rubro') + '.</p>' +
      (r.bit.length || r.otras.length ? '<ul class="plain small">' + r.bit.concat(r.otras).map(x => '<li>' + esc(x.nombre) + ' · peso <b>' + (x.peso || 1) + '</b></li>').join('') + '</ul><p class="small">Suma de pesos: <b class="' + (r.suma === 60 ? 'okc' : '') + '">' + r.suma + '</b></p>' : '') +
      btn(r.bit.length ? 'Revisar y acomodar pesos' : 'Armar el Proyecto (bitácoras, terminado y vs pruebas)', 'bt-armar', 'data-pid="' + pid + '"', r.bit.length ? 'small' : 'primary'));
    // formato editable
    const ta = (k, label, val, rows) => '<label class="fld"><span>' + label + '</span><textarea rows="' + rows + '" data-ch="bt-cfg" data-pid="' + pid + '" data-k="' + k + '">' + esc(val) + '</textarea></label>';
    h += card('<h3>✏️ Formato de la hoja</h3><p class="muted small">Agrega o quita renglones: la hoja se acomoda sola para que siempre quepa en una carta.</p>' +
      ta('etapas', '1. Etapas del avance (una por renglón)', c.etapas.join('\n'), Math.max(4, c.etapas.length + 1)) +
      ta('datos', '2. Datos de la prueba (dato | unidad; «sí/no» pone casillas)', c.datos.map(d => d[0] + (d[1] ? ' | ' + d[1] : '')).join('\n'), Math.max(4, c.datos.length + 1)) +
      ta('rub', 'Rúbrica de revisión (criterio | puntos)', c.rub.map(x => x[0] + ' | ' + x[1]).join('\n'), Math.max(4, c.rub.length + 1)) +
      '<p class="small">Total de la rúbrica: <b>' + mx + '</b> pts</p><label class="switch"><input type="checkbox" data-ch="bt-cfg" data-pid="' + pid + '" data-k="rol" ' + (c.rol ? 'checked' : '') + '><span>Renglón «Mi rol esta semana»</span></label>' +
      '<div class="row gap wrap mt">' + btn('Volver al formato original', 'bt-reset', 'data-pid="' + pid + '"', 'small ghost') + '</div>');
    return { t: 'Bitácora semanal', h: h };
  };
  const partes = (v, num) => v.split('\n').map(x => x.trim()).filter(Boolean).map(x => { const m = x.split('|'); const a = m[0].trim(), b = (m[1] || '').trim(); return num ? [a, Number(b.replace(',', '.')) || (b ? 0 : 1)] : [a, b]; });
  CH['bt-cfg'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, k = el.dataset.k;
    S.update(K(g, pid), d => { if (k === 'rol') d.rol = el.checked; else if (k === 'etapas') d.etapas = el.value.split('\n').map(x => x.trim()).filter(Boolean); else if (k === 'datos') d.datos = partes(el.value, false); else if (k === 'rub') d.rub = partes(el.value, true); }, {});
    if (k === 'rub') { const mx = BT.max(BT.cfg(g, pid)); actsP(g, pid).filter(a => a.bita).forEach(a => S.update('act:' + g.id + ':' + a.id, x => { x.max = mx; })); }
  };
  CH['bt-pts'] = el => {
    const g = D.grupoActual(), v = el.value.trim(), a = S.get('act:' + g.id + ':' + el.dataset.act); if (!a) return; const mx = C.maxPts(a);
    let n = v === '' ? '' : Number(v.replace(',', '.')); if (n !== '' && (isNaN(n) || n < 0 || n > mx)) { u.toast('Va de 0 a ' + mx, 'err'); el.value = ''; return; }
    S.update('act:' + g.id + ':' + a.id, x => { x.notas = x.notas || {}; x.notas[el.dataset.aid] = n; });
  };
  A['bt-print'] = el => { const g = D.grupoActual(); if (!g) return; const sel = document.getElementById('bt-al'); BT.imprime(g, el.dataset.pid, el.dataset.s, el.dataset.q, sel && sel.value); };
  A['bt-armar'] = el => { const g = D.grupoActual(), h = BT.armar(g, el.dataset.pid); u.toast(h.length ? 'Listo: ' + h.join(', ') : 'Pesos acomodados (5 por semana, terminado 5, vs pruebas 25)', 'ok', 4500); };
  A['bt-reset'] = el => { const g = D.grupoActual(); S.del(K(g, el.dataset.pid)); u.toast('Formato original', 'ok'); };

  /* ---------- accesos: Proyecto e Imprimir ---------- */
  const acceso = g => { const pid = pidDe(null), s = BT.semanas(g, pid), hoy = u.today(), x = s.find(y => y.fin >= hoy) || s[s.length - 1];
    return card('<h3>📘 Bitácora técnica semanal</h3><p class="muted small">Hoja por alumno con su equipo y proyecto' + (x ? ' · semana ' + x.n + ': ' + esc(BT.rango(x)) : '') + '. Se entrega el martes y se revisa el jueves o viernes.</p><div class="row gap wrap">' + (x ? btn('🖨 Imprimir semana ' + x.n, 'bt-print', 'data-pid="' + pid + '" data-s="' + x.n + '" data-q="todos"', 'primary small') : '') + link('Abrir bitácora', 'bitsem/' + pid + (x ? '/' + x.n : ''), 'small') + '</div>'); };
  if (V.proyecto) { const vp = V.proyecto; V.proyecto = function () { const o = vp.apply(null, arguments), g = D.grupoActual(); if (!o || !g || /Algo falló|Primero importa|No hay grupo/.test(o.h)) return o; o.h += acceso(g); return o; }; }
  if (V.imprimir) { const vi = V.imprimir; V.imprimir = function () { const o = vi.apply(null, arguments), g = D.grupoActual(); if (!o || !g || /Algo falló/.test(o.h)) return o; o.h += acceso(g); return o; }; }
})();

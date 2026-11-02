/* Escuadra · Cobros de impresiones (v1.28.1). Más → Cobros de impresiones.
   La app registra lo que imprimes (título, fecha y hojas). Al crear un cobro eliges esa impresión y el precio por hoja:
   la app cuenta cuántas hojas le tocan a cada alumno (el examen que fotocopias: todas sus hojas; los formatos con una
   hoja por alumno: la suya) y puede dejar fuera a quien faltó ese día. Luego marcas quién pagó (completo o una parte) y
   ves quién te debe, en cada cobro y sumando todos. También: lo que te costaron las copias y el saldo, una lista de
   pendientes para pegar en el grupo (con números de lista, sin montos por persona) y un aviso a casa por WhatsApp.
   En escuela pública es una cooperación voluntaria: no puede condicionar exámenes, calificaciones ni documentos
   (Ley General de Educación, art. 7, fr. IV). */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, IN = E.inputs, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const CB = E.cobros = {};
  const KL = g => 'impLog:' + g.id, KC = (g, id) => 'cobro:' + g.id + ':' + (id || ''), KA = g => 'cobAvisos:' + g.id, KCF = 'cobrosCfg';
  const r2 = n => Math.round((Number(n) || 0) * 100) / 100;
  const $ = n => '$' + r2(n).toLocaleString('es-MX', { maximumFractionDigits: 2 });
  const val = id => ((document.getElementById(id) || {}).value || '').trim();
  const num = (v, d) => { const x = Number(String(v == null ? '' : v).replace(/[$,\s]/g, '')); return isFinite(x) && x >= 0 ? x : d; };
  const LEY = '<p class="note small">En escuela pública lo que cobres por copias es una cooperación <b>voluntaria</b>: no puede condicionar exámenes, calificaciones, documentos ni el trato a nadie (Ley General de Educación, art. 7, fr. IV). Usa «No paga» con quien no pueda, sin exponerlo.</p>';
  if (E.undo && E.undo.NOMBRE) Object.assign(E.undo.NOMBRE, { 'cb-pago': 'pago', 'cb-parcial-ok': 'pago', 'cb-pagatodo': 'pago', 'cb-sinpago': 'pago', 'cb-ex': 'cobro', 'cb-fuera': 'cobro', 'cb-crear': 'cobro', 'cb-borrar': 'cobro', 'cb-campo': 'cobro' });

  /* ---------- registro de impresiones (lo llama print.js al imprimir) ---------- */
  CB.log = g => ((g && S.get(KL(g))) || {}).L || [];
  // hojas que le tocan a cada alumno: un formato con una hoja (o más) por alumno → las suyas; si no, la copia completa
  CB.porAlumno = (n, blq, nal) => { const cada = blq > 1 && nal > 0 && blq >= nal * 0.8; return { pa: cada ? Math.max(1, Math.round(n / blq)) : n, tipo: cada ? 'cada' : 'copia' }; };
  E.print.registra = info => {
    const g = D.grupoActual(); if (!g || !info || !(info.n > 0)) return;
    const pa = CB.porAlumno(info.n, info.blq || 0, D.alumnos(g).length);
    const x = { id: u.uid('imp'), t: String(info.t || 'Impresión'), f: u.today(), ts: new Date().toISOString(), n: info.n, blq: info.blq || 0, pa: pa.pa, tipo: pa.tipo };
    S.update(KL(g), d => { d.L = (d.L || []).concat([x]).slice(-40); }, { L: [] });
  };

  /* ---------- cálculos ---------- */
  CB.lista = g => S.list(KC(g)).filter(c => c && c.id).sort((a, b) => String(b.f || '').localeCompare(String(a.f || '')) || String(b.creado || '').localeCompare(String(a.creado || '')));
  CB.get = (g, id) => S.get(KC(g, id));
  CB.calc = (g, c) => {
    const filas = D.alumnos(g).filter(a => c.al && c.al[a.id] && c.al[a.id].st !== 'fuera').map(a => {
      const x = c.al[a.id], h = x.h != null ? Number(x.h) : Number(c.hojas || 0), debe = x.st === 'ex' ? 0 : r2(h * Number(c.precio || 0));
      const ps = (c.pagos || {})[a.id] || [], pg = r2(ps.reduce((s, p) => s + Number(p.m || 0), 0)), ult = ps.length ? ps[ps.length - 1].f : null;
      const st = x.st === 'ex' ? 'ex' : debe <= 0 ? 'ok' : pg >= debe - 0.001 ? 'ok' : pg > 0 ? 'par' : 'pend';
      return { a: a, h: h, debe: debe, pg: pg, pend: st === 'ex' ? 0 : r2(Math.max(0, debe - pg)), st: st, ult: ult };
    });
    const fuera = D.alumnos(g).filter(a => c.al && c.al[a.id] && c.al[a.id].st === 'fuera');
    const sum = k => r2(filas.reduce((s, r) => s + r[k], 0)), rec = sum('pg'), costo = r2(c.costo || 0);
    return { filas: filas, fuera: fuera, monto: r2(Number(c.hojas || 0) * Number(c.precio || 0)), esperado: sum('debe'), rec: rec, pend: sum('pend'), costo: costo, saldo: r2(rec - costo),
      nOk: filas.filter(r => r.st === 'ok').length, nPend: filas.filter(r => r.st === 'pend' || r.st === 'par').length, nEx: filas.filter(r => r.st === 'ex').length };
  };
  // lo de cada alumno sumando todos los cobros
  CB.deudas = g => {
    const m = {}; D.alumnos(g).forEach(a => { m[a.id] = { a: a, debe: 0, pg: 0, pend: 0, items: [] }; });
    CB.lista(g).forEach(c => { CB.calc(g, c).filas.forEach(r => { const x = m[r.a.id]; if (!x) return; x.debe = r2(x.debe + r.debe); x.pg = r2(x.pg + r.pg); x.pend = r2(x.pend + r.pend); if (r.pend > 0) x.items.push({ c: c, r: r }); }); });
    return Object.keys(m).map(k => m[k]);
  };
  CB.totales = g => { const L = CB.lista(g).map(c => CB.calc(g, c)), s = k => r2(L.reduce((a, x) => a + x[k], 0)); return { n: L.length, rec: s('rec'), pend: s('pend'), costo: s('costo'), saldo: s('saldo') }; };

  /* ---------- textos para compartir ---------- */
  CB.pendientesTxt = (g, solo) => {
    const L = (solo ? [solo] : CB.lista(g)).map(c => ({ c: c, k: CB.calc(g, c) })).filter(x => x.k.nPend);
    const lin = ['Copias pendientes de pago · ' + g.nombre + ' · al ' + u.fCorta(u.today())];
    if (!L.length) lin.push('Nadie tiene copias pendientes. ¡Gracias!');
    L.forEach(x => lin.push('• ' + x.c.concepto + ' (' + $(x.k.monto) + ' c/u): No. ' + x.k.filas.filter(r => r.st === 'pend' || r.st === 'par').map(r => r.a.num).join(', ')));
    lin.push('', 'Es una cooperación voluntaria por las copias: no condiciona exámenes ni calificaciones.');
    return lin.join('\n');
  };
  CB.mensaje = (g, a) => {
    const d = CB.deudas(g).find(x => x.a.id === a.id); if (!d || !d.pend) return '';
    const l = ['Buen día. Le escribe ' + (D.cfg().docente || 'el docente') + ', docente del grupo ' + g.nombre + '.', 'Le comparto lo que está pendiente de las copias que se imprimieron para ' + u.corto(a.nombre) + ':'];
    d.items.forEach(x => l.push('• ' + x.c.concepto + ' (' + x.r.h + (x.r.h === 1 ? ' hoja' : ' hojas') + '): ' + $(x.r.pend)));
    l.push('Total: ' + $(d.pend) + '.', 'Es una cooperación voluntaria por las copias; no condiciona sus exámenes ni sus calificaciones. Gracias por su apoyo.');
    return l.join('\n');
  };

  /* ---------- pantallas ---------- */
  const ST = { ok: ['Pagó', 'ok'], par: ['Parcial', 'warn'], pend: ['Pendiente', ''], ex: ['No paga', 'info'] };
  const tabs = act => '<div class="filters">' + [['', '🧾 Cobros'], ['deben', '👥 Quién me debe']].map(x => '<a class="tab ' + (x[0] === act ? 'on' : '') + '" href="#/cobros' + (x[0] ? '/' + x[0] : '') + '">' + x[1] + '</a>').join('') + '</div>';
  V.cobros = (id, f) => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Cobros');
    if (id === 'deben') return { t: 'Cobros', h: tabs('deben') + debenV(g) };
    if (id) return { t: 'Cobros', h: '<p><a href="#/cobros">‹ Cobros</a></p>' + detalleV(g, id, f) };
    return { t: 'Cobros', h: tabs('') + listaV(g) };
  };
  const resumen = tt => '<div class="row gap wrap"><span class="chip ok">Cobrado ' + $(tt.rec) + '</span><span class="chip warn">Por cobrar ' + $(tt.pend) + '</span>' + (tt.costo ? '<span class="chip">Te costaron ' + $(tt.costo) + '</span><span class="chip ' + (tt.saldo >= 0 ? 'ok' : 'bad') + '">Saldo ' + $(tt.saldo) + '</span>' : '') + '</div>';
  function listaV(g) {
    const L = CB.lista(g), tt = CB.totales(g);
    let h = card('<h3>🧾 Cobros de impresiones</h3><p class="muted small">Cobra las copias por hoja: elige algo que imprimiste y la app cuenta las hojas de cada alumno. Marca quién pagó y ve quién te debe.</p>' +
      (L.length ? resumen(tt) : '') + '<div class="row gap wrap mt">' + btn('➕ Nuevo cobro', 'cb-nuevo', '', 'primary') + (tt.pend ? btn('📋 Copiar pendientes', 'cb-copiar', '', '') : '') + '</div>');
    h += L.length ? '<ul class="cb-l">' + L.map(c => { const k = CB.calc(g, c); return '<li class="card"><a href="#/cobros/' + c.id + '"><b>' + esc(c.concepto) + '</b></a><br><small class="muted">' + u.fCorta(c.f) + ' · ' + $(c.precio) + ' por hoja × ' + c.hojas + (Number(c.hojas) === 1 ? ' hoja' : ' hojas') + ' = ' + $(k.monto) + ' c/u · ' + k.filas.length + ' alumnos</small><div class="row gap wrap mt"><span class="chip ok">Pagaron ' + k.nOk + ' de ' + k.filas.length + '</span>' + (k.pend ? '<span class="chip warn">Faltan ' + $(k.pend) + '</span>' : '') + (k.costo ? '<span class="chip ' + (k.saldo >= 0 ? 'ok' : 'bad') + '">Saldo ' + $(k.saldo) + '</span>' : '') + '</div></li>'; }).join('') + '</ul>'
      : card('<p class="muted">Todavía no hay cobros. Imprime desde la app (por ejemplo, un examen) y luego toca «Nuevo cobro».</p>');
    return h + LEY;
  }
  function detalleV(g, id, f) {
    const c = CB.get(g, id); if (!c) return card('<p>No encontré ese cobro.</p>');
    const k = CB.calc(g, c); f = f || 'todos';
    let h = card('<h3>🧾 ' + esc(c.concepto) + '</h3><p class="small">' + u.cap(u.fLarga(c.f)) + (c.imp ? ' · de «' + esc(c.imp.t) + '» (' + c.imp.n + (c.imp.n === 1 ? ' hoja' : ' hojas') + ')' : '') + '</p>' +
      '<p><b>' + $(c.precio) + '</b> por hoja × <b>' + c.hojas + '</b> ' + (Number(c.hojas) === 1 ? 'hoja' : 'hojas') + ' = <b>' + $(k.monto) + '</b> por alumno</p>' +
      '<div class="row gap wrap"><span class="chip ok">Pagaron ' + k.nOk + ' de ' + k.filas.length + '</span><span class="chip">Cobrado ' + $(k.rec) + ' de ' + $(k.esperado) + '</span>' + (k.pend ? '<span class="chip warn">Faltan ' + $(k.pend) + '</span>' : '') + (k.nEx ? '<span class="chip info">' + k.nEx + ' no paga' + (k.nEx === 1 ? '' : 'n') + '</span>' : '') + '</div>' +
      '<details class="sub mt" id="cb-datos"><summary>✏️ Cambiar datos y gastos</summary><div class="fgrid">' +
      '<label class="fld"><span>Concepto</span><input value="' + esc(c.concepto) + '" data-ch="cb-campo" data-id="' + c.id + '" data-f="concepto"></label>' +
      '<label class="fld"><span>Precio por hoja</span><input inputmode="decimal" value="' + c.precio + '" data-ch="cb-campo" data-id="' + c.id + '" data-f="precio"></label>' +
      '<label class="fld"><span>Hojas por alumno</span><input inputmode="decimal" value="' + c.hojas + '" data-ch="cb-campo" data-id="' + c.id + '" data-f="hojas"></label>' +
      '<label class="fld"><span>Lo que te costaron las copias</span><input inputmode="decimal" value="' + (c.costo || '') + '" placeholder="Ej. 80" data-ch="cb-campo" data-id="' + c.id + '" data-f="costo"></label></div>' +
      '<p class="small">' + (k.costo ? 'Cobrado ' + $(k.rec) + ' − costo ' + $(k.costo) + ' = <b>saldo ' + $(k.saldo) + '</b>' + (k.pend ? ' (y faltan ' + $(k.pend) + ' por cobrar)' : '') : 'Anota lo que te costaron para ver si sale a mano.') + '</p>' +
      btn('🗑 Borrar este cobro', 'cb-borrar', 'data-id="' + c.id + '"', 'small ghost danger') + '</details>' +
      '<div class="row gap wrap mt">' + (k.nPend ? btn('📋 Copiar pendientes', 'cb-copiar', 'data-id="' + c.id + '"', 'small') : '') + '</div>');
    let filas = k.filas; if (f === 'pend') filas = filas.filter(r => r.st === 'pend' || r.st === 'par'); if (f === 'ok') filas = filas.filter(r => r.st === 'ok');
    h += '<div class="filters">' + [['todos', 'Todos'], ['pend', 'Pendientes · ' + k.nPend], ['ok', 'Pagaron · ' + k.nOk]].map(x => '<a class="tab ' + (x[0] === f ? 'on' : '') + '" href="#/cobros/' + c.id + '/' + x[0] + '">' + x[1] + '</a>').join('') + '</div>';
    h += '<ul class="tut-pagos cb-pagos">' + (filas.length ? filas.map(r => '<li class="' + r.st + '"><span class="num">' + r.a.num + '</span><div class="cb-nm"><b>' + esc(r.a.nombre) + '</b><small class="muted">' + (r.st === 'ex' ? 'No paga' : (r.pg ? 'Pagó ' + $(r.pg) + (r.ult ? ' el ' + u.fCorta(r.ult) : '') + ' · ' : '') + (r.pend ? 'debe ' + $(r.pend) : 'completo')) + '</small></div><span class="row gap">' +
      (r.st !== 'pend' ? '<span class="chip ' + ST[r.st][1] + '">' + ST[r.st][0] + '</span>' : '') +
      (r.st === 'pend' || r.st === 'par' ? btn('✓ Pagó', 'cb-pago', 'data-id="' + c.id + '" data-aid="' + r.a.id + '"', 'small primary') + btn('Parte', 'cb-parcial', 'data-id="' + c.id + '" data-aid="' + r.a.id + '" aria-label="Pagó una parte"', 'small') : '') +
      btn('⋯', 'cb-mas', 'data-id="' + c.id + '" data-aid="' + r.a.id + '" aria-label="Más opciones"', 'small ghost') + '</span></li>').join('') : '<li class="muted small">Nadie en esta lista.</li>') + '</ul>';
    if (k.fuera.length) h += '<p class="muted small">No les tocó (faltaron ese día o los quitaste): ' + k.fuera.map(a => a.num + '. ' + esc(u.corto(a.nombre)) + ' ' + btn('↺', 'cb-fuera', 'data-id="' + c.id + '" data-aid="' + a.id + '" aria-label="Volver a incluir"', 'small ghost')).join(' · ') + '</p>';
    return h + LEY;
  }
  function debenV(g) {
    const L = CB.deudas(g).filter(x => x.debe > 0 || x.pg > 0).sort((x, y) => y.pend - x.pend || x.a.num - y.a.num), tt = CB.totales(g), av = S.get(KA(g)) || {};
    const deben = L.filter(x => x.pend > 0);
    let h = card('<h3>👥 Quién me debe</h3><p class="muted small">Sumando todos los cobros. «✓ Pagó todo» marca como pagado lo que le falta en cada cobro.</p>' + resumen(tt) +
      '<p class="small mt">' + (deben.length ? deben.length + (deben.length === 1 ? ' alumno debe' : ' alumnos deben') : 'Nadie debe nada. 👏') + '</p>' + (deben.length ? btn('📋 Copiar pendientes', 'cb-copiar', '', 'small') : ''));
    if (!L.length) return h + card('<p class="muted">Todavía no hay cobros.</p>') + LEY;
    h += '<ul class="tut-pagos cb-pagos">' + L.map(x => '<li class="' + (x.pend > 0 ? (x.pg > 0 ? 'par' : 'pend') : 'ok') + '"><span class="num">' + x.a.num + '</span><div class="cb-nm"><b>' + esc(x.a.nombre) + '</b><small class="muted">' +
      (x.pend > 0 ? x.items.map(it => esc(it.c.concepto) + ' ' + $(it.r.pend)).join(' · ') : 'Al corriente · pagó ' + $(x.pg)) + ((av[x.a.id] || []).length ? ' · aviso a casa ' + u.fCorta(av[x.a.id].slice(-1)[0]) : '') + '</small></div><span class="row gap">' +
      (x.pend > 0 ? '<span class="chip warn">' + $(x.pend) + '</span>' + btn('✓ Pagó todo', 'cb-pagatodo', 'data-aid="' + x.a.id + '"', 'small primary') + btn('💬', 'cb-wa', 'data-aid="' + x.a.id + '" aria-label="Aviso a casa por WhatsApp"', 'small') : '<span class="chip ok">✓</span>') + '</span></li>').join('') + '</ul>';
    return h + LEY;
  }

  /* ---------- nuevo cobro ---------- */
  const tieneAsis = (g, f) => !!S.get('asis:' + g.id + ':' + f);
  A['cb-nuevo'] = () => {
    const g = D.grupoActual(), L = CB.log(g).slice().reverse().slice(0, 15), cf = S.get(KCF) || {}, x = L[0];
    E.ui.cbImp = x ? x.id : 'manual';
    E.modal.open('🧾 Nuevo cobro', '<label class="fld"><span>¿Qué imprimiste?</span><select id="cb-imp" data-ch="cb-imp">' + L.map(y => '<option value="' + y.id + '">' + esc(u.fCorta(y.f) + ' · ' + y.t + ' (' + y.n + (y.n === 1 ? ' hoja' : ' hojas') + ')') + '</option>').join('') + '<option value="manual">Otra cosa (escribo las hojas)</option></select></label>' +
      (L.length ? '' : '<p class="muted small">Todavía no hay impresiones registradas (se registran desde esta versión, al tocar «Imprimir»). Escribe las hojas a mano.</p>') +
      '<label class="fld"><span>Concepto</span><input id="cb-con" value="' + esc(x ? x.t : '') + '" placeholder="Ej. Examen del 2º parcial"></label>' +
      '<div class="fgrid"><label class="fld"><span>Fecha</span><input id="cb-f" type="date" value="' + (x ? x.f : u.today()) + '" data-ch="cb-prev"></label>' +
      '<label class="fld"><span>Precio por hoja</span><input id="cb-precio" inputmode="decimal" value="' + (cf.precio != null ? cf.precio : 1) + '" data-in="cb-prev"></label>' +
      '<label class="fld"><span>Hojas por alumno</span><input id="cb-hojas" inputmode="decimal" value="' + (x ? x.pa : 1) + '" data-in="cb-prev"></label>' +
      '<label class="fld"><span>Lo que te costaron (opcional)</span><input id="cb-costo" inputmode="decimal" placeholder="Ej. 80"></label></div>' +
      '<p class="muted small" id="cb-pista">' + pista(x) + '</p>' +
      '<label class="switch"><input type="checkbox" id="cb-asis" data-ch="cb-prev" ' + (x && tieneAsis(g, x.f) ? 'checked' : '') + '><span>Solo a quienes asistieron ese día (según el pase de lista)</span></label>' +
      '<p class="small" id="cb-calc"></p>' + btn('Crear cobro', 'cb-crear', '', 'primary') + LEY);
    prev();
  };
  const pista = x => !x ? 'Escribe cuántas hojas le tocaron a cada alumno.' : x.tipo === 'cada' ? 'Ese formato trae una hoja por alumno: a cada quien le toca la suya (' + x.pa + ').' : 'A cada alumno le tocó una copia completa (' + x.pa + (x.pa === 1 ? ' hoja' : ' hojas') + '). Cámbialo si no fue así.';
  const quienes = (g, f, soloAsis) => {
    const doc = S.get('asis:' + g.id + ':' + f), k = C.clasesCuenta(g, f)[0];
    return D.alumnos(g).map(a => ({ a: a, fuera: !!(soloAsis && doc && ['F', 'J'].indexOf(C.marca(doc, a.id, k)) >= 0) }));
  };
  function prev() {
    const g = D.grupoActual(), el = document.getElementById('cb-calc'); if (!el || !g) return;
    const p = num(val('cb-precio'), 0), h = num(val('cb-hojas'), 0), f = val('cb-f') || u.today(), sa = (document.getElementById('cb-asis') || {}).checked, Q = quienes(g, f, sa), n = Q.filter(x => !x.fuera).length;
    el.innerHTML = '<b>' + $(p * h) + '</b> por alumno · ' + n + ' alumnos' + (Q.length - n ? ' (' + (Q.length - n) + ' faltaron ese día)' : '') + ' · en total <b>' + $(p * h * n) + '</b>' + (sa && !tieneAsis(g, f) ? '<br><span class="muted">Ese día no tiene pase de lista: se incluye a todos.</span>' : '');
  }
  CH['cb-prev'] = () => prev();
  IN['cb-prev'] = () => prev();
  CH['cb-imp'] = el => {
    const g = D.grupoActual(), x = CB.log(g).find(y => y.id === el.value); E.ui.cbImp = el.value;
    const set = (id, v) => { const i = document.getElementById(id); if (i) i.value = v; };
    if (x) { set('cb-con', x.t); set('cb-f', x.f); set('cb-hojas', x.pa); const a = document.getElementById('cb-asis'); if (a) a.checked = tieneAsis(g, x.f); }
    const p = document.getElementById('cb-pista'); if (p) p.textContent = pista(x); prev();
  };
  A['cb-crear'] = () => {
    const g = D.grupoActual(), con = val('cb-con'), p = num(val('cb-precio'), NaN), h = num(val('cb-hojas'), NaN), f = val('cb-f') || u.today();
    if (!con) { u.toast('Escribe el concepto', 'err'); return; } if (!(p >= 0) || !(h > 0)) { u.toast('Revisa el precio por hoja y las hojas por alumno', 'err'); return; }
    const imp = CB.log(g).find(y => y.id === (val('cb-imp') || E.ui.cbImp)), sa = (document.getElementById('cb-asis') || {}).checked, al = {};
    quienes(g, f, sa).forEach(x => { al[x.a.id] = x.fuera ? { st: 'fuera' } : {}; });
    const id = u.uid('cob');
    S.put(KC(g, id), { id: id, concepto: con, f: f, precio: p, hojas: h, costo: num(val('cb-costo'), 0), imp: imp ? { id: imp.id, t: imp.t, f: imp.f, n: imp.n, tipo: imp.tipo } : null, al: al, pagos: {}, creado: new Date().toISOString() });
    S.update(KCF, d => { d.precio = p; }, {});
    E.modal.close(); location.hash = '#/cobros/' + id; u.toast('Cobro creado', 'ok');
  };

  /* ---------- pagos y cambios ---------- */
  const upd = (id, fn) => { const g = D.grupoActual(); S.update(KC(g, id), fn); };
  const fila = (g, id, aid) => { const c = CB.get(g, id); return c ? CB.calc(g, c).filas.find(r => r.a.id === aid) : null; };
  A['cb-pago'] = el => { const g = D.grupoActual(), r = fila(g, el.dataset.id, el.dataset.aid); if (!r || !(r.pend > 0)) return; upd(el.dataset.id, c => { c.pagos = c.pagos || {}; (c.pagos[r.a.id] = c.pagos[r.a.id] || []).push({ m: r.pend, f: u.today() }); }); u.toast(u.corto(r.a.nombre) + ': pagó ' + $(r.pend), 'ok', 1800); };
  A['cb-parcial'] = el => {
    const g = D.grupoActual(), r = fila(g, el.dataset.id, el.dataset.aid); if (!r) return;
    E.modal.open('Pagó una parte · ' + u.corto(r.a.nombre), '<p class="small">Debe ' + $(r.pend) + ' de ' + $(r.debe) + '.</p><label class="fld"><span>¿Cuánto pagó?</span><input id="cb-m" inputmode="decimal" placeholder="Ej. 2"></label>' + btn('Guardar', 'cb-parcial-ok', 'data-id="' + el.dataset.id + '" data-aid="' + r.a.id + '"', 'primary'));
    setTimeout(() => { const i = document.getElementById('cb-m'); if (i) i.focus(); }, 30);
  };
  A['cb-parcial-ok'] = el => {
    const m = num(val('cb-m'), NaN); if (!(m > 0)) { u.toast('Escribe cuánto pagó', 'err'); return; }
    upd(el.dataset.id, c => { c.pagos = c.pagos || {}; (c.pagos[el.dataset.aid] = c.pagos[el.dataset.aid] || []).push({ m: r2(m), f: u.today() }); }); E.modal.close(); u.toast('Pago de ' + $(m) + ' guardado', 'ok');
  };
  A['cb-mas'] = el => {
    const g = D.grupoActual(), r = fila(g, el.dataset.id, el.dataset.aid); if (!r) return; const d = 'data-id="' + el.dataset.id + '" data-aid="' + r.a.id + '"';
    E.modal.open(u.corto(r.a.nombre), '<div class="row gap wrap">' + btn(r.st === 'ex' ? '↺ Sí paga' : 'No paga (exento)', 'cb-ex', d, '') + btn('No le tocó (quitar del cobro)', 'cb-fuera', d, '') + (r.pg ? btn('↺ Borrar sus pagos', 'cb-sinpago', d, 'ghost') : '') + '</div>');
  };
  A['cb-ex'] = el => { upd(el.dataset.id, c => { const x = c.al[el.dataset.aid] = c.al[el.dataset.aid] || {}; if (x.st === 'ex') delete x.st; else x.st = 'ex'; }); E.modal.close(); };
  A['cb-fuera'] = el => { upd(el.dataset.id, c => { const x = c.al[el.dataset.aid] = c.al[el.dataset.aid] || {}; if (x.st === 'fuera') delete x.st; else x.st = 'fuera'; }); E.modal.close(); };
  A['cb-sinpago'] = el => { if (!confirm('¿Borrar los pagos anotados de este alumno en este cobro?')) return; upd(el.dataset.id, c => { if (c.pagos) delete c.pagos[el.dataset.aid]; }); E.modal.close(); };
  A['cb-pagatodo'] = el => {
    const g = D.grupoActual(), aid = el.dataset.aid, hoy = u.today(); let tot = 0;
    CB.lista(g).forEach(c => { const r = CB.calc(g, c).filas.find(x => x.a.id === aid); if (!r || !(r.pend > 0)) return; tot += r.pend; S.update(KC(g, c.id), d => { d.pagos = d.pagos || {}; (d.pagos[aid] = d.pagos[aid] || []).push({ m: r.pend, f: hoy }); }); });
    if (tot) u.toast('Pagó todo: ' + $(tot), 'ok', 2000);
  };
  CH['cb-campo'] = el => {
    const f = el.dataset.f, v = el.value.trim();
    if (f === 'concepto') { if (!v) return; upd(el.dataset.id, c => { c.concepto = v; }); return; }
    const n = num(v, NaN); if (!(n >= 0) || (f === 'hojas' && !(n > 0))) { u.toast('Escribe un número válido', 'err'); E.render(); return; }
    upd(el.dataset.id, c => { c[f] = n; });
  };
  A['cb-borrar'] = el => { const g = D.grupoActual(), c = CB.get(g, el.dataset.id); if (!c || !confirm('¿Borrar el cobro «' + c.concepto + '» con sus pagos?')) return; S.del(KC(g, c.id)); location.hash = '#/cobros'; };
  A['cb-copiar'] = async el => { const g = D.grupoActual(), c = el.dataset.id ? CB.get(g, el.dataset.id) : null, ok = await u.copy(CB.pendientesTxt(g, c)); u.toast(ok ? 'Lista copiada (con números de lista, sin montos por persona)' : 'No se pudo copiar', ok ? 'ok' : 'err', 3000); };
  A['cb-wa'] = el => {
    const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid), txt = a && CB.mensaje(g, a); if (!txt || !E.casa) return;
    window.open(E.casa.wa(a, txt), '_blank', 'noopener');
    S.update(KA(g), d => { (d[a.id] = d[a.id] || []).push(u.today()); }, {});
  };

  /* ---------- en otras pantallas ---------- */
  if (V.imprimir) { const vi = V.imprimir; V.imprimir = function () { const o = vi.apply(null, arguments), g = D.grupoActual(); if (o && g && !/Algo falló/.test(o.h)) { const tt = CB.totales(g); o.h += card('<div class="row between gap wrap"><h3>🧾 Cobros de impresiones</h3>' + link('Abrir', 'cobros', 'small') + '</div><p class="muted small">Lo que imprimes aquí queda registrado: cobra las copias por hoja y ve quién te debe.' + (tt.pend ? ' Por cobrar: ' + $(tt.pend) + '.' : '') + '</p>'); } return o; }; }
  if (V.alumno) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) { const d = CB.deudas(g).find(x => x.a.id === a.id); if (d && d.pend > 0 && E.fichaInsert) o.h = E.fichaInsert(o.h, card('<div class="row between gap wrap"><h3>🧾 Copias</h3>' + link('Quién me debe', 'cobros/deben', 'small') + '</div><p class="small">Debe ' + $(d.pend) + ': ' + d.items.map(x => esc(x.c.concepto)).join(', ') + '.</p>')); } return o; }; }
})();

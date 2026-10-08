/* Escuadra · Semáforo del grupo: clasifica a cada alumno por su promedio (va mal, regular, va bien),
   ordena de mal a bien, filtra y muestra cómo cambia cada semana para ver si los que van mal suben. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link, icon = E.icon;
  const SF = E.semaforo = {};
  SF.NIV = { mal: { t: 'Va mal', ico: '🔴', cls: 'bad', o: 0 }, reg: { t: 'Regular', ico: '🟡', cls: 'warn', o: 1 }, bien: { t: 'Va bien', ico: '🟢', cls: 'ok', o: 2 } };
  const ORDEN = ['mal', 'reg', 'bien'];
  SF.umbral = () => { const c = D.cfg(); return { reg: Number(c.minAprob) || 60, bien: Number(c.umbralBien) || 80 }; };
  // se clasifica con el promedio redondeado, el mismo número que ves en pantalla
  SF.nivel = v => { if (v == null) return null; const t = SF.umbral(), r = Math.round(v); return r >= t.bien ? 'bien' : r >= t.reg ? 'reg' : 'mal'; };
  const chip = (n, corto) => n ? '<span class="chip ' + SF.NIV[n].cls + '">' + SF.NIV[n].ico + ' ' + (corto ? '' : SF.NIV[n].t) + '</span>' : '<span class="chip">Sin datos</span>';

  /* ---------- promedio de un alumno a una fecha ---------- */
  // Examen y Libreta/Proyecto/Bitácora con tus ponderaciones (sin asistencia ni participación).
  // Mientras no haya calificaciones, el diagnóstico cuenta como punto de partida.
  SF.prom = (g, aid, pid, f, esHoy) => {
    const c = D.cfg(), acts = S.list('act:' + g.id + ':').filter(a => a.parcial === pid && (esHoy || (a.fecha || '0000') <= f));
    let ne = 0;
    const cat = k => {
      let s = 0, w = 0;
      acts.filter(a => a.categoria === k && a.cuenta !== false).forEach(a => {
        let v = C.nota(a, aid);
        if (v == null) { if (!c.vaciasCero || !a.fecha || a.fecha >= f) return; v = 0; ne++; }
        const p = Number(a.peso || 1); s += v * p; w += p;
      });
      return w ? s / w : null;
    };
    const ex = cat('examen'), tr = cat('trabajos');
    if (ex == null && tr == null) {
      const dg = acts.filter(a => a.categoria === 'diagnostico').map(a => C.nota(a, aid)).filter(v => v != null);
      return dg.length ? { v: dg.reduce((a, b) => a + b, 0) / dg.length, partida: true } : null;
    }
    const pe = ex != null ? Number(c.pond.examen) || 0 : 0, pt = tr != null ? Number(c.pond.trabajos) || 0 : 0;
    if (!pe && !pt) return null;
    return { v: ((ex || 0) * pe + (tr || 0) * pt) / (pe + pt), partida: false, ex: ex, tr: tr, ne: ne };
  };
  // por qué va mal, en pocas palabras
  SF.razon = x => {
    if (!x) return ''; const t = SF.umbral();
    if (x.partida) return 'Diagnóstico ' + Math.round(x.v);
    const r = [];
    if (x.ne) r.push(x.ne + (x.ne === 1 ? ' trabajo sin entregar' : ' trabajos sin entregar'));
    if (x.ex != null && Math.round(x.ex) < t.reg) r.push('examen ' + Math.round(x.ex));
    if (x.tr != null && Math.round(x.tr) < t.reg && !x.ne) r.push('trabajos ' + Math.round(x.tr));
    return r.join(' · ') || 'Promedio ' + Math.round(x.v);
  };
  SF.promSem = (g, aid, f, esHoy) => {
    const vals = []; let partida = null;
    D.parciales().forEach(p => {
      if (p.inicio > f) return;
      const man = D.manual(g, p.id);
      if (man.activo) { const r = (man.alumnos || {})[aid]; if (r && r.cal !== '' && r.cal != null && f >= p.fin) vals.push(Number(r.cal)); return; }
      const x = SF.prom(g, aid, p.id, f, esHoy); if (!x) return;
      if (x.partida) { if (!partida) partida = x; } else vals.push(x.v);
    });
    return vals.length ? { v: vals.reduce((a, b) => a + b, 0) / vals.length, partida: false } : partida;
  };

  /* ---------- cortes semanales (cada viernes) y hoy ---------- */
  SF.periodos = g => {
    const hoy = u.today(), out = D.parciales().filter(p => p.inicio <= hoy && !D.manual(g, p.id).activo).map(p => ({ id: p.id, nombre: p.nombre, ini: C.inicioEfectivo(g, p), fin: p.fin }));
    const ps = D.parciales(); out.push({ id: 'sem', nombre: 'Semestre', ini: ps.map(p => p.inicio).sort()[0], fin: ps.map(p => p.fin).sort().slice(-1)[0] });
    return out;
  };
  SF.cortes = per => {
    const hoy = u.today(), fin = hoy < per.fin ? hoy : per.fin, out = [];
    let f = per.ini; while (u.dow(f) !== 5) f = u.addDays(f, 1);
    for (; f < fin; f = u.addDays(f, 7)) out.push(f);
    out.push(fin); return out;
  };
  SF.datos = (g, pid) => {
    const per = SF.periodos(g).find(x => x.id === pid) || SF.periodos(g)[0], hoy = u.today();
    let cortes = SF.cortes(per); const al = D.alumnos(g);
    let filas = al.map(a => ({ a: a, serie: cortes.map(f => pid === 'sem' || per.id === 'sem' ? SF.promSem(g, a.id, f, f === hoy) : SF.prom(g, a.id, per.id, f, f === hoy)) }));
    // quita cortes sin ningún dato
    const usar = cortes.map((f, i) => filas.some(r => r.serie[i]));
    cortes = cortes.filter((f, i) => usar[i]); filas.forEach(r => { r.serie = r.serie.filter((x, i) => usar[i]); });
    const c = D.cfg(), p = C.parcialActual(hoy);
    filas.forEach(r => {
      const vals = r.serie.map(x => x ? x.v : null), niv = vals.map(SF.nivel);
      const iU = vals.map((v, i) => v != null ? i : -1).filter(i => i >= 0);
      r.ult = iU.length ? r.serie[iU[iU.length - 1]] : null;
      r.v = iU.length ? vals[iU[iU.length - 1]] : null; r.n = SF.nivel(r.v); r.partida = iU.length ? !!r.serie[iU[iU.length - 1]].partida : false;
      r.niveles = niv;
      const prev = iU.length > 1 ? iU[iU.length - 2] : -1, ini = iU.length ? iU[0] : -1;
      r.antes = prev >= 0 ? niv[prev] : null; r.inicio = ini >= 0 && ini !== iU[iU.length - 1] ? niv[ini] : null;
      r.dv = prev >= 0 ? r.v - vals[prev] : null; r.dvIni = ini >= 0 && iU.length > 1 ? r.v - vals[ini] : null;
      r.cambio = r.antes && r.n ? SF.NIV[r.n].o - SF.NIV[r.antes].o : 0;
      r.cambioIni = r.inicio && r.n ? SF.NIV[r.n].o - SF.NIV[r.inicio].o : 0;
      const as = p ? C.asis(g, p, r.a.id) : null; r.asis = as && as.ses ? as.pct : null; r.asisMal = r.asis != null && as.ses >= 3 && r.asis < (Number(c.minAsis) || 80);
    });
    const cuenta = cortes.map((f, i) => { const k = { mal: 0, reg: 0, bien: 0, sin: 0 }; filas.forEach(r => { const n = r.niveles[i]; k[n || 'sin']++; }); return k; });
    return { per: per, cortes: cortes, filas: filas, cuenta: cuenta };
  };

  /* ---------- gráfica: columnas apiladas por semana ---------- */
  function grafica(d) {
    const n = d.cortes.length; if (!n) return '';
    const tot = d.filas.length || 1, H0 = 150, colW = Math.max(18, Math.min(48, Math.floor(560 / n) - 10)), gap = Math.max(8, Math.min(22, Math.floor(colW * 0.5))), W = n * (colW + gap) + gap;
    let s = '<svg class="sf-svg" viewBox="0 0 ' + W + ' ' + (H0 + 34) + '" width="' + W + '" height="' + (H0 + 34) + '" role="img" aria-label="Cuántos alumnos van mal, regular y bien en cada semana">';
    d.cortes.forEach((f, i) => {
      const k = d.cuenta[i], x = gap + i * (colW + gap); let y = H0;
      ORDEN.forEach(nv => {
        const h = k[nv] / tot * H0; if (h <= 0) return;
        const hh = Math.max(0, h - 2); y -= h;
        s += '<g class="sf-seg" data-act="sf-col" data-i="' + i + '"><title>' + esc(u.fCorta(f) + ': ' + k[nv] + ' ' + SF.NIV[nv].t.toLowerCase() + ' (' + Math.round(k[nv] / tot * 100) + '%)') + '</title><rect class="sf-' + nv + '" x="' + x + '" y="' + (y + 2) + '" width="' + colW + '" height="' + hh + '" rx="4"/>' +
          (hh >= 16 && colW >= 18 ? '<text x="' + (x + colW / 2) + '" y="' + (y + 2 + hh / 2 + 4) + '" text-anchor="middle" class="sf-in">' + k[nv] + '</text>' : '') + '</g>';
      });
      if (n <= 10 || i % 2 === 0 || i === n - 1) s += '<text x="' + (x + colW / 2) + '" y="' + (H0 + 18) + '" text-anchor="middle" class="sf-x">' + esc(i === n - 1 && f === u.today() ? 'hoy' : u.fCorta(f)) + '</text>';
    });
    s += '</svg>';
    const sel = E.ui.sf && E.ui.sf.col != null && d.cuenta[E.ui.sf.col] ? E.ui.sf.col : n - 1, k = d.cuenta[sel];
    return '<div class="sf-chart">' + s + '</div><p class="small sf-cap"><b>' + (d.cortes[sel] === u.today() ? 'Hoy' : 'Semana al ' + u.fCorta(d.cortes[sel])) + ':</b> ' + ORDEN.map(nv => SF.NIV[nv].ico + ' ' + k[nv] + ' ' + SF.NIV[nv].t.toLowerCase()).join(' · ') + (k.sin ? ' · ' + k.sin + ' sin datos' : '') + '</p>';
  }

  /* ---------- vista ---------- */
  const FILTROS = [['todos', 'Todos'], ['mal', '🔴 Va mal'], ['reg', '🟡 Regular'], ['bien', '🟢 Va bien'], ['sube', '↑ Mejoraron'], ['baja', '↓ Bajaron'], ['asis', '⚠ Asistencia'], ['apoyo', '🛟 Con apoyo']];
  V.semaforo = pid => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Semáforo');
    const ui = E.ui.sf = E.ui.sf || { f: 'todos', orden: 'mal', col: null, ref: 'antes' };
    const pers = SF.periodos(g), act = C.parcialActual(); pid = pid || ((pers.find(p => p.id === act.id) || pers[0]).id);
    if (ui.pid !== pid) { ui.pid = pid; ui.col = null; }
    const d = SF.datos(g, pid), t = SF.umbral(), tot = d.filas.length;
    const cnt = { mal: 0, reg: 0, bien: 0, sin: 0 }; d.filas.forEach(r => cnt[r.n || 'sin']++);
    const pct = x => Math.round(x / tot * 100) + '%';
    let h = '<div class="filters">' + pers.map(p => '<a class="tab ' + (p.id === pid ? 'on' : '') + '" href="#/semaforo/' + p.id + '">' + esc(p.nombre) + '</a>').join('') + '</div>';
    h += card('<h3>🚦 Semáforo de ' + esc(g.nombre) + '</h3><p class="muted small">Promedio de examen y libreta/proyecto/bitácora con tus ponderaciones. Va mal: menos de ' + t.reg + ' · Regular: ' + t.reg + ' a ' + (t.bien - 1) + ' · Va bien: ' + t.bien + ' o más. Mientras no haya calificaciones, cuenta el diagnóstico como punto de partida.</p>' +
      '<div class="sf-tiles">' + ORDEN.map(nv => '<button type="button" class="sf-tile ' + SF.NIV[nv].cls + (ui.f === nv ? ' on' : '') + '" data-act="sf-f" data-f="' + nv + '"><span class="sf-k">' + SF.NIV[nv].ico + ' ' + SF.NIV[nv].t + '</span><b>' + cnt[nv] + '</b><span class="muted small">' + pct(cnt[nv]) + ' del grupo</span></button>').join('') + '</div>' +
      (cnt.sin ? '<p class="muted small">' + cnt.sin + ' sin datos todavía.</p>' : '') +
      (d.filas.some(r => r.partida) ? '<p class="note">Por ahora es el <b>punto de partida</b> (diagnóstico): cambiará en cuanto captures exámenes o trabajos.</p>' : ''));
    if (d.cortes.length) h += card('<div class="row between gap wrap"><h3>Cómo va cambiando</h3><span class="sf-ley">' + ORDEN.slice().reverse().map(nv => '<span><i class="sf-dot sf-' + nv + '"></i>' + SF.NIV[nv].t + '</span>').join('') + '</span></div>' +
      (d.cortes.length < 2 ? '<p class="muted small">Cada viernes se agrega una columna con cómo iba el grupo esa semana. Hoy solo hay un corte.</p>' : '<p class="muted small">Una columna por semana (corte cada viernes). Lo que buscas: que la parte roja se haga chica y la verde crezca.</p>') +
      grafica(d) +
      '<details class="sub"><summary>Ver como tabla</summary><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Corte</th><th>🔴 Va mal</th><th>🟡 Regular</th><th>🟢 Va bien</th><th>Sin datos</th></tr></thead><tbody>' + d.cortes.map((f, i) => '<tr><td class="l">' + u.fCorta(f) + '</td><td>' + d.cuenta[i].mal + '</td><td>' + d.cuenta[i].reg + '</td><td>' + d.cuenta[i].bien + '</td><td>' + d.cuenta[i].sin + '</td></tr>').join('') + '</tbody></table></div></details>');
    const malos = d.filas.filter(r => r.n === 'mal').sort((a, b) => a.v - b.v);
    if (malos.length) h += card('<h3>' + icon('alert') + ' Atención especial (' + malos.length + ')</h3><ul class="risk">' + malos.slice(0, 8).map(r => { return '<li><a href="#/alumno/' + r.a.id + '">' + esc(r.a.nombre) + '</a><span class="sf-why"><span class="g bad">' + Math.round(r.v) + '</span><small>' + esc(SF.razon(r.ult)) + (r.asisMal ? ' · asistencia ' + Math.round(r.asis) + '%' : '') + '</small></span></li>'; }).join('') + '</ul><p class="muted small">Qué hacer con cada uno: abajo, en <b>Plan para subir de nivel</b>.</p>' + (malos.length > 8 ? '<p class="small muted">Y ' + (malos.length - 8) + ' más en la lista.</p>' : ''), 'sf-aten');
    if (E.apoyos) h += E.apoyos.planHTML(g, d);
    const sube = d.filas.filter(r => r.cambio > 0), baja = d.filas.filter(r => r.cambio < 0);
    if (sube.length || baja.length) h += card('<h3>Movimientos desde el corte anterior</h3>' + (sube.length ? '<p class="small"><b class="okc">↑ Subieron (' + sube.length + '):</b> ' + sube.map(r => esc(nombreCorto(r.a.nombre)) + ' ' + SF.NIV[r.antes].ico + '→' + SF.NIV[r.n].ico).join(', ') + '</p>' : '') + (baja.length ? '<p class="small"><b class="badc">↓ Bajaron (' + baja.length + '):</b> ' + baja.map(r => esc(nombreCorto(r.a.nombre)) + ' ' + SF.NIV[r.antes].ico + '→' + SF.NIV[r.n].ico).join(', ') + '</p>' : '') + '<p class="muted small">Reconoce en público a los que subieron: es de lo que más motiva.</p>');
    // lista con filtro y orden
    let lista = d.filas.slice();
    if (ui.f === 'mal' || ui.f === 'reg' || ui.f === 'bien') lista = lista.filter(r => r.n === ui.f);
    if (ui.f === 'sube') lista = lista.filter(r => r.cambio > 0 || r.cambioIni > 0 || (r.dv || 0) >= 5);
    if (ui.f === 'baja') lista = lista.filter(r => r.cambio < 0 || r.cambioIni < 0 || (r.dv || 0) <= -5);
    if (ui.f === 'asis') lista = lista.filter(r => r.asisMal);
    const apo = E.apoyos ? E.apoyos.conApoyo(g, d.per.id === 'sem' ? null : d.per) : new Set();
    if (ui.f === 'apoyo') lista = lista.filter(r => apo.has(r.a.id));
    const nul = v => v == null ? 999 : v;
    if (ui.orden === 'mal') lista.sort((a, b) => nul(a.v) - nul(b.v));
    if (ui.orden === 'bien') lista.sort((a, b) => (b.v == null ? -999 : b.v) - (a.v == null ? -999 : a.v));
    if (ui.orden === 'num') lista.sort((a, b) => a.a.num - b.a.num);
    if (ui.orden === 'cambio') lista.sort((a, b) => (b.dvIni == null ? -999 : b.dvIni) - (a.dvIni == null ? -999 : a.dvIni));
    h += '<div class="filters">' + FILTROS.map(f => '<button type="button" class="tab ' + (ui.f === f[0] ? 'on' : '') + '" data-act="sf-f" data-f="' + f[0] + '">' + f[1] + '</button>').join('') + '</div>' +
      '<div class="row gap wrap sf-orden"><label class="small">Ordenar: <select data-ch="sf-orden">' + [['mal', 'De mal a bien'], ['bien', 'De bien a mal'], ['cambio', 'Los que más subieron'], ['num', 'Número de lista']].map(o => '<option value="' + o[0] + '" ' + (ui.orden === o[0] ? 'selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label><span class="muted small">' + lista.length + ' de ' + tot + ' alumnos</span></div>';
    h += '<ul class="sf-list">' + (lista.length ? lista.map(r => '<li class="sf-row ' + (r.n || 'sin') + '"><span class="num">' + r.a.num + '</span><div class="sf-main"><a href="#/alumno/' + r.a.id + '">' + esc(r.a.nombre) + '</a><span class="sf-tray" title="Trayectoria semana a semana">' + r.niveles.map((n, i) => '<i class="sf-dot sf-' + (n || 'sin') + '" title="' + esc(u.fCorta(d.cortes[i]) + ': ' + (n ? SF.NIV[n].t : 'sin datos')) + '"></i>').join('') + (r.cambio > 0 ? ' <b class="okc small">↑ subió</b>' : r.cambio < 0 ? ' <b class="badc small">↓ bajó</b>' : '') + (r.asisMal ? ' <span class="chip warn">asistencia ' + Math.round(r.asis) + '%</span>' : '') + (r.partida ? ' <span class="muted small">partida</span>' : '') + (apo.has(r.a.id) ? ' <span class="chip info" title="Recibió apoyo en este periodo">🛟 apoyo</span>' : '') + '</span></div>' + chip(r.n, true) + '<span class="g ' + (r.n ? SF.NIV[r.n].cls : 'na') + '">' + (r.v == null ? '—' : Math.round(r.v)) + '</span></li>').join('') : '<li class="muted small">Nadie en este filtro.</li>') + '</ul>';
    h += '<p class="muted small mt">Los niveles cambian solos conforme capturas calificaciones. Ajusta los límites en Ajustes → Calificación.</p>';
    return { t: 'Semáforo', h: h };
  };
  const nombreCorto = n => { const p = String(n).split(' '); return p.length >= 3 ? p[p.length - 2] + ' ' + p[0] : n; };
  A['sf-f'] = el => { const ui = E.ui.sf; ui.f = ui.f === el.dataset.f && el.classList.contains('sf-tile') ? 'todos' : el.dataset.f; E.render(); };
  A['sf-col'] = el => { E.ui.sf.col = Number(el.dataset.i); E.render(); };
  CH['sf-orden'] = el => { E.ui.sf.orden = el.value; E.render(); };

  /* ---------- piezas para otras pantallas ---------- */
  SF.resumenHTML = g => {
    const p = C.parcialActual(); const per = SF.periodos(g).find(x => x.id === p.id); if (!per) return '';
    const d = SF.datos(g, p.id); if (!d.cortes.length) return '';
    const cnt = { mal: 0, reg: 0, bien: 0, sin: 0 }; d.filas.forEach(r => cnt[r.n || 'sin']++); const tot = d.filas.length;
    const malos = d.filas.filter(r => r.n === 'mal').sort((a, b) => a.v - b.v).slice(0, 4);
    return card('<div class="row between gap wrap"><h3>🚦 Semáforo del grupo</h3>' + link('Ver todo', 'semaforo/' + p.id, 'small') + '</div>' +
      '<div class="sf-barra" role="img" aria-label="' + ORDEN.map(nv => cnt[nv] + ' ' + SF.NIV[nv].t).join(', ') + '">' + ORDEN.map(nv => cnt[nv] ? '<span class="sf-' + nv + '" style="flex:' + cnt[nv] + '" title="' + cnt[nv] + ' ' + SF.NIV[nv].t.toLowerCase() + '"></span>' : '').join('') + '</div>' +
      '<p class="small">' + ORDEN.map(nv => SF.NIV[nv].ico + ' <b>' + cnt[nv] + '</b> ' + SF.NIV[nv].t.toLowerCase()).join(' · ') + (cnt.sin ? ' · ' + cnt.sin + ' sin datos' : '') + '</p>' +
      (malos.length ? '<p class="small"><b>Atiende primero:</b> ' + malos.map(r => '<a href="#/alumno/' + r.a.id + '">' + esc(nombreCorto(r.a.nombre)) + '</a>').join(', ') + (cnt.mal > 4 ? ' y ' + (cnt.mal - 4) + ' más' : '') + '</p>' : ''));
  };
  SF.alumnoHTML = (g, a) => {
    const p = C.parcialActual(); if (!SF.periodos(g).find(x => x.id === p.id)) return '';
    const d = SF.datos(g, p.id), r = d.filas.find(x => x.a.id === a.id); if (!r || !d.cortes.length) return '';
    return '<p class="small sf-al">🚦 <b>Semáforo del ' + esc(p.nombre) + ':</b> ' + chip(r.n) + ' ' + (r.v == null ? '' : '<b>' + Math.round(r.v) + '</b>') + (r.partida ? ' <span class="muted">(punto de partida)</span>' : '') + ' <span class="sf-tray">' + r.niveles.map((n, i) => '<i class="sf-dot sf-' + (n || 'sin') + '" title="' + esc(u.fCorta(d.cortes[i])) + '"></i>').join('') + '</span>' + (r.cambio > 0 ? ' <b class="okc">↑ subió</b>' : r.cambio < 0 ? ' <b class="badc">↓ bajó</b>' : '') + '</p>';
  };
})();

/* Escuadra · El guion aprende (v1.25). Compara lo planeado con lo que pasó en tus clases:
   - «Faltó tiempo» en un bloque = esa actividad llevó más horas; «Me adelanté» = llevó menos; «No se dio» = horas perdidas.
   - El temporizador guarda los minutos reales de cada paso: aquí ves los pasos que siempre se alargan.
   Con eso propone ajustar las horas de cada actividad. Lo que aceptas se aplica a los grupos que empiecen después
   (por ejemplo, el del semestre que viene), nunca al grupo en curso, para no mover tu parcial a medias. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const AP = E.aprende = {};
  const KA = 'guionAprende';
  AP.doc = () => S.get(KA) || {};
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

  /* ---------- aplicar lo aprendido a los grupos que empiezan después ---------- */
  if (E.clases && E.clases.seq) {
    const seq0 = E.clases.seq;
    E.clases.seq = (g, pid) => {
      const out = seq0(g, pid), k = E.clases.smKey(g, pid), aj = (AP.doc()[k]) || {};
      if (!Object.keys(aj).length) return out;
      return out.map(x => { const a = aj[x.id]; if (!a || x.h0 != null || a.origen === g.id || !(String(g.inicioDocente || '') > String(a.f || ''))) return x; return Object.assign({}, x, { h: Math.max(1, x.h + a.dh), aprendido: a }); });
    };
  }

  /* ---------- qué pasó en cada actividad ---------- */
  AP.analiza = (g, pid) => {
    const hoy = u.today(), out = {}, perdidas = []; let pl = null; try { pl = E.clases.plan(g, pid); } catch (e) { pl = null; } if (!pl) return null;
    const it = id => out[id] = out[id] || { id: id, t: '', h: 0, dh: 0, fechas: [], motivos: [] };
    pl.seq.forEach(x => { const o = it(x.id); o.t = x.t; o.h = x.h0 != null ? x.h0 : x.h; o.tipo = x.tipo; o.aprendido = x.aprendido || null; });
    pl.bloques.forEach(b => {
      if (b.fecha > hoy) return;
      if (b.perdida) { perdidas.push(b); return; }
      if (b.recorte && b.parts.length) { const x = b.parts[b.parts.length - 1].it; const o = it(x.id); o.dh += b.recorte; o.fechas.push(b.fecha); o.motivos.push('faltó ' + b.recorte + ' h el ' + u.fCorta(b.fecha)); }
      if (b.adelanto && b.parts.length) { const x = b.parts[0].it; const o = it(x.id); o.dh -= b.adelanto; o.fechas.push(b.fecha); o.motivos.push('te adelantaste ' + b.adelanto + ' h el ' + u.fCorta(b.fecha)); }
    });
    // pasos del temporizador que se alargan (10 min o más y 30 % o más sobre lo planeado)
    const pasos = {};
    (S.get('tiempos:' + g.id) || []).forEach(r => { const p = D.parciales().find(x => r.fecha >= x.inicio && r.fecha <= x.fin); if (!p || p.id !== pid) return; (r.pasos || []).forEach(ps => { const t = ps[0], plan = Number(ps[1]) || 0, real = ps[2]; if (real == null || !plan) return; const z = pasos[t] = pasos[t] || { t: t, n: 0, plan: 0, real: 0 }; z.n++; z.plan += plan; z.real += real; }); });
    const largos = Object.keys(pasos).map(k => pasos[k]).filter(z => z.real - z.plan >= 10 && z.real >= z.plan * 1.3).sort((a, b) => (b.real - b.plan) - (a.real - a.plan));
    const xs = Object.keys(out).map(k => out[k]).filter(o => o.dh !== 0).sort((a, b) => Math.abs(b.dh) - Math.abs(a.dh));
    return { items: xs, perdidas: perdidas, largos: largos, k: E.clases.smKey(g, pid) };
  };
  V.aprende = pid => {
    const g = D.grupoActual(); if (!g) return H.noGroup();
    const ps = D.parciales().filter(p => E.clases.tiene(g, p.id)); if (!ps.length) return { t: 'El guion aprende', h: card('<p class="small">Este grupo no tiene secuencia de clases.</p>') };
    pid = ps.some(p => p.id === pid) ? pid : C.parcialActual().id; if (!ps.some(p => p.id === pid)) pid = ps[0].id;
    const r = AP.analiza(g, pid), aj = (AP.doc()[r.k]) || {};
    let h = '<div class="filters">' + ps.map(x => '<a class="tab ' + (x.id === pid ? 'on' : '') + '" href="#/aprende/' + x.id + '">' + esc(x.nombre) + '</a>').join('') + '</div>';
    h += card('<h3>🧠 El guion aprende</h3><p class="muted small">Sale de lo que marcas en «¿Cómo salió esta clase?» (faltó tiempo, me adelanté, no se dio) y de los tiempos del temporizador. Lo que aceptes ajusta las horas de esa actividad para los grupos que empiecen después, como el del próximo semestre; tu grupo actual no se mueve.</p>' +
      '<div class="en-kpis"><div><b>' + r.items.filter(x => x.dh > 0).length + '</b><span>llevaron más tiempo</span></div><div><b>' + r.items.filter(x => x.dh < 0).length + '</b><span>llevaron menos</span></div><div><b>' + r.perdidas.reduce((s, b) => s + b.horas, 0) + ' h</b><span>clases que no se dieron</span></div><div><b>' + Object.keys(aj).length + '</b><span>ajustes guardados</span></div></div>');
    h += card('<h3>⏱ Actividades con horas distintas a lo planeado</h3>' + (r.items.length ? '<ul class="pc-l">' + r.items.map(x => { const ya = aj[x.id], prop = Math.max(1, x.h + x.dh);
      return '<li class="' + (x.dh > 0 ? 'warn' : 'info') + '"><span class="pc-i">' + (x.dh > 0 ? '+' : '−') + '</span><div><b>' + esc(x.t) + '</b><small class="muted">Planeada ' + x.h + ' h · real ' + (x.h + x.dh) + ' h (' + esc(x.motivos.join('; ')) + ')</small>' +
        '<div class="row gap wrap mt">' + (ya ? '<span class="chip ok">✓ ' + (ya.dh === 0 ? 'Sin cambio para los próximos grupos' : 'Guardado: ' + (ya.dh > 0 ? '+' : '') + ya.dh + ' h para los próximos grupos') + '</span>' + btn('Quitar', 'gu-quitar', 'data-k="' + r.k + '" data-id="' + esc(x.id) + '"', 'small ghost') : btn('Usar ' + prop + ' h la próxima vez', 'gu-aceptar', 'data-k="' + r.k + '" data-id="' + esc(x.id) + '" data-dh="' + x.dh + '" data-t="' + esc(x.t) + '"', 'small primary') + btn('Fue algo de este grupo', 'gu-ignorar', 'data-k="' + r.k + '" data-id="' + esc(x.id) + '"', 'small ghost')) + '</div></div></li>';
    }).join('') + '</ul>' : '<p class="small">Todo ha ido como se planeó (o todavía no marcas cómo salieron las clases). Al final de cada bloque usa «¿Cómo salió esta clase?».</p>'));
    if (r.largos.length) h += card('<h3>🐢 Pasos que se alargan (temporizador)</h3><ul class="risk">' + r.largos.slice(0, 8).map(z => '<li><span>' + esc(corto(z.t, 90)) + '<br><small class="muted">' + z.n + (z.n === 1 ? ' vez' : ' veces') + ' · planeado ' + Math.round(z.plan / z.n) + ' min, real ' + Math.round(z.real / z.n) + ' min</small></span><span class="chip warn">+' + Math.round((z.real - z.plan) / z.n) + ' min</span></li>').join('') + '</ul><p class="muted small">Si se repite, divide ese paso o pásalo a tarea.</p>');
    if (r.perdidas.length) h += card('<h3>📅 Clases que no se dieron</h3><p class="small">' + r.perdidas.map(b => u.fCorta(b.fecha) + ' ' + b.inicio + ' (' + b.horas + ' h)').join(' · ') + '</p><p class="muted small">No cuentan como «la actividad llevó más tiempo»: el calendario se recorre solo.</p>');
    const otros = Object.keys(AP.doc()).filter(k => k !== r.k && Object.keys(AP.doc()[k]).length);
    if (Object.keys(aj).length || otros.length) h += card('<h3>📚 Ajustes guardados</h3><ul class="small">' + [r.k].concat(otros).map(k => Object.keys(AP.doc()[k] || {}).filter(id => AP.doc()[k][id].dh).map(id => { const a = AP.doc()[k][id]; return '<li><b>' + esc(k) + '</b> · ' + esc(a.t || id) + ': ' + (a.dh > 0 ? '+' : '') + a.dh + ' h · aprendido el ' + u.fCorta(a.f) + '</li>'; }).join('')).join('') + '</ul>');
    return { t: 'El guion aprende', h: h };
  };
  A['gu-aceptar'] = el => { const g = D.grupoActual(); S.update(KA, d => { const m = d[el.dataset.k] = d[el.dataset.k] || {}; m[el.dataset.id] = { dh: Number(el.dataset.dh), f: u.today(), origen: g.id, t: el.dataset.t }; }, {}); u.toast('Guardado: el próximo grupo tendrá esa actividad ajustada', 'ok', 3500); };
  A['gu-quitar'] = el => S.update(KA, d => { if (d[el.dataset.k]) delete d[el.dataset.k][el.dataset.id]; }, {});
  A['gu-ignorar'] = el => { const g = D.grupoActual(); S.update(KA, d => { const m = d[el.dataset.k] = d[el.dataset.k] || {}; m[el.dataset.id] = { dh: 0, f: u.today(), origen: g.id, t: 'sin cambio' }; }, {}); };
  // en Clases: acceso cuando ya hay algo que aprender
  if (V.clases) { const vc = V.clases; V.clases = function (pid) { const o = vc.apply(null, arguments), g = D.grupoActual(); if (!o || !g || /Algo falló/.test(o.h)) return o; try { const p = D.parciales().find(x => x.id === pid) || C.parcialActual(), r = E.clases.tiene(g, p.id) ? AP.analiza(g, p.id) : null; const n = r ? r.items.length : 0; if (n) { const i = o.h.indexOf('</div>') + 6; o.h = o.h.slice(0, i) + '<p class="note info small">🧠 ' + n + (n === 1 ? ' actividad llevó' : ' actividades llevaron') + ' distinto tiempo del planeado. ' + link('Ver y ajustar para el próximo grupo', 'aprende/' + p.id, 'small') + '</p>' + o.h.slice(i); } } catch (e) { } return o; }; }
})();

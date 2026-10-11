/* Escuadra · Calentamiento y boleto de salida.
   Calentamiento (5 min al inicio): 3 preguntas de temas que vieron hace 1 a 3 semanas, primero lo que salió más bajo
   (práctica de recuperación espaciada: Dunlosky y col., 2013; Roediger y Karpicke, 2006).
   Boleto de salida (al final): 2 o 3 preguntas de lo de hoy. En los dos anotas cuántos acertaron (mano alzada):
   eso alimenta el examen recomendado y la lista de temas a reforzar. No es calificación individual. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const R = E.repaso = {};
  const KR = (g, f) => 'rep:' + g.id + ':' + f;
  const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const mezcla = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  const item = id => (E.BANCO || []).find(b => b.id === id);
  const tema = id => (E.TEMAS || []).find(t => t.id === id);
  const tTit = id => { const t = tema(id); return t ? t.titulo : id; };
  const usable = b => b.tipo !== 'ab';
  const conBanco = t => (E.BANCO || []).some(b => b.tema === t && usable(b));
  const presentes = (g, f) => { const doc = S.get('asis:' + g.id + ':' + f); return D.alumnos(g).filter(a => !doc || ['A', 'R'].indexOf(doc[a.id] || 'A') >= 0).length; };
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

  /* ---------- qué se vio y cómo va el grupo ---------- */
  // primera y última fecha en que se vio cada tema (según Clases), antes de 'hasta'
  R.vistos = (g, hasta) => {
    const out = {};
    D.parciales().forEach(p => {
      if (!E.CLASES[E.clases.smKey(g, p.id)]) return; let pl; try { pl = E.clases.plan(g, p.id); } catch (e) { return; }
      pl.bloques.forEach(b => { if (b.perdida || b.fecha >= hasta) return; b.parts.forEach(pt => { const t = pt.it.tema; if (!t || !conBanco(t)) return; const o = out[t] = out[t] || { ini: b.fecha, fin: b.fecha }; if (b.fecha < o.ini) o.ini = b.fecha; if (b.fecha > o.fin) o.fin = b.fecha; }); });
    });
    return out;
  };
  R.temasDia = (g, d) => { const ts = []; (d ? d.bloques : []).forEach(b => { if (b.perdida) return; b.parts.forEach(pt => { const t = pt.it.tema; if (t && conBanco(t) && ts.indexOf(t) < 0) ts.push(t); }); }); return ts; };
  // aciertos del grupo por tema en calentamientos y boletos (0 a 1), opcionalmente desde una fecha
  R.desempeno = (g, desde) => {
    const agg = {};
    S.keys('rep:' + g.id + ':').forEach(k => {
      const f = k.slice(('rep:' + g.id + ':').length); if (desde && f < desde) return; const d = S.get(k) || {};
      ['cal', 'bol'].forEach(t => { const x = d[t]; if (!x || !(x.n > 0)) return; (x.items || []).forEach(it => { if (it.ok == null || it.ok === '') return; const a = agg[it.tema] = agg[it.tema] || { s: 0, n: 0 }; a.s += Math.min(1, Number(it.ok) / (Number(it.n) || x.n)); a.n++; }); });
    });
    const out = {}; Object.keys(agg).forEach(t => { out[t] = { p: agg[t].s / agg[t].n, n: agg[t].n }; }); return out;
  };
  // debilidad combinada: exámenes (pesan más) + calentamientos y boletos
  R.debil = g => { if (E.examen && E.examen.debilidad) return E.examen.debilidad(g); const r = R.desempeno(g), o = {}; Object.keys(r).forEach(t => { o[t] = r[t].p; }); return o; };
  const recientes = (g, f, dias) => { const ids = new Set(); for (let i = 1; i <= dias; i++) { const d = S.get(KR(g, u.addDays(f, -i))); if (!d) continue; ['cal', 'bol'].forEach(t => ((d[t] || {}).items || []).forEach(it => ids.add(it.id))); } return ids; };
  // elige preguntas de un tema (sin abiertas, sin repetir las recientes si se puede)
  const elige = (t, n, rnd, evitar, prefNiv) => {
    let c = (E.BANCO || []).filter(b => b.tema === t && usable(b) && !evitar.has(b.id));
    if (!c.length) c = (E.BANCO || []).filter(b => b.tema === t && usable(b));
    c = mezcla(c, rnd); if (prefNiv) c.sort((a, b) => (prefNiv.indexOf(a.niv) < 0) - (prefNiv.indexOf(b.niv) < 0));
    return c.slice(0, n);
  };

  /* ---------- calentamiento: 3 preguntas espaciadas ---------- */
  R.calentamiento = (g, f) => {
    const doc = S.get(KR(g, f)); if (doc && doc.cal && (doc.cal.items || []).length) return doc.cal;
    const vis = R.vistos(g, f), ts = Object.keys(vis); if (!ts.length) return null;
    const deb = R.debil(g), rnd = rng(hash(g.id + '|cal|' + f)), dd = t => u.diffDays(vis[t].fin, f);
    const sc = t => { const d = dd(t), p = deb[t] == null ? 0.7 : deb[t]; return (1 - p) * 2 + (d >= 7 && d <= 21 ? 1.5 : d > 21 ? 0.8 : d >= 2 ? 0.3 : -2) + rnd() * 0.2; };
    const orden = ts.slice().sort((a, b) => sc(b) - sc(a)).filter(t => dd(t) >= 1);
    if (!orden.length) return null;
    const evitar = recientes(g, f, 10), out = [];
    let i = 0; while (out.length < 3 && i < 9) { const t = orden[i % orden.length]; const b = elige(t, 1, rnd, new Set([...evitar, ...out.map(x => x.id)]))[0]; if (b && !out.some(x => x.id === b.id)) out.push({ id: b.id, tema: t, dias: dd(t) }); i++; }
    return out.length ? { items: out } : null;
  };
  /* ---------- boleto de salida: lo de hoy ---------- */
  R.boleto = (g, f, d) => {
    const doc = S.get(KR(g, f)); if (doc && doc.bol && (doc.bol.items || []).length) return doc.bol;
    const ts = R.temasDia(g, d); if (!ts.length) return null;
    const rnd = rng(hash(g.id + '|bol|' + f)), cal = R.calentamiento(g, f), evitar = new Set(cal ? cal.items.map(x => x.id) : []), out = [];
    const por = ts.length >= 3 ? 1 : ts.length === 2 ? [2, 1] : [3];
    ts.slice(0, 3).forEach((t, i) => { const n = Array.isArray(por) ? por[i] || 1 : por; elige(t, n, rnd, evitar, [2, 3]).forEach(b => out.push({ id: b.id, tema: t })); });
    return out.length ? { items: out.slice(0, 3) } : null;
  };
  // preguntas listas para proyectar (salen iguales todo el día)
  const preguntas = (g, f, tipo, set) => set.items.map(it => { const b = item(it.id); if (!b) return null; const q = E.ejer.pregunta(b, rng(hash(g.id + '|' + tipo + '|' + f + '|' + it.id))); return Object.assign({ it: it, b: b }, q); }).filter(Boolean);
  const deck = (g, f, tipo, set) => {
    const qs = preguntas(g, f, tipo, set), n = qs.length, cal = tipo === 'cal';
    const s = [{ k: 'cover', h: cal ? 'Calentamiento' : 'Boleto de salida', sub: cal ? '5 minutos · repaso de lo que ya vimos' : '3 minutos antes de salir', p: cal ? 'Contesta en tu libreta sin ver tus apuntes. Recordar cuesta trabajo, y justo eso hace que se te quede.' : 'Contesta solo en tu libreta. Me dice qué repasar la próxima clase.' }];
    qs.forEach((x, i) => s.push({ k: 'q', h: (cal ? 'Calentamiento ' : 'Boleto ') + (i + 1) + ' de ' + n + ' · ' + tTit(x.it.tema), q: x.q, opts: x.opts, ok: x.ok, a: x.a }));
    s.push({ k: 'vida', h: cal ? '¿Cuántas acertaste?' : 'Gracias', p: cal ? 'Levanta la mano por cada pregunta que tuviste bien. Lo que te costó, hoy lo repasamos.' : 'Lo que salga bajo lo repasamos al inicio de la próxima clase.' });
    return s;
  };
  const deck321 = () => [{ k: 'cover', h: 'Boleto de salida 3-2-1', sub: '3 minutos antes de salir', p: 'Contesta en tu libreta.' }, { k: 'list', h: 'En tu libreta', items: ['3 cosas que aprendí hoy', '2 cosas que me parecieron interesantes', '1 duda que todavía tengo'] }];

  /* ---------- tarjetas del guion del día ---------- */
  const registro = (g, f, tipo, set, pre) => {
    const doc = S.get(KR(g, f)) || {}, x = doc[tipo] || {}, n = x.n || presentes(g, f), reg = x.n > 0 && (x.items || []).some(it => it.ok != null && it.ok !== '');
    const ok = id => { const it = (x.items || []).find(y => y.id === id); return it && it.ok != null ? it.ok : ''; };
    let h = '<details class="sub rp-reg"' + (reg ? '' : '') + '><summary>' + (reg ? '✓ Registrado: ' : '') + '¿Cuántos acertaron?</summary><div class="rp-in">' +
      set.items.map((it, i) => '<label class="fld"><span>Pregunta ' + (i + 1) + '</span><input type="number" min="0" max="' + n + '" inputmode="numeric" id="' + pre + i + '" value="' + ok(it.id) + '" placeholder="#"></label>').join('') +
      '<label class="fld"><span>Presentes</span><input type="number" min="1" inputmode="numeric" id="' + pre + 'n" value="' + n + '"></label></div>' + btn('Guardar aciertos', 'rp-reg', 'data-f="' + f + '" data-t="' + tipo + '"', 'small primary') + '</details>';
    if (reg) h += '<div class="rp-res">' + x.items.map((it, i) => { const p = it.ok === '' || it.ok == null ? null : Math.round(Math.min(1, it.ok / (Number(it.n) || x.n)) * 100); return p == null ? '' : '<span class="chip ' + (p >= 80 ? 'ok' : p >= 60 ? 'warn' : 'bad') + '"' + (it.tj ? ' title="Con tarjetas: ' + it.n + ' respuestas · ' + 'ABCD'.split('').map(L => L + ' ' + (it.tj[L] || 0)).join(', ') + '"' : '') + '>P' + (i + 1) + ' ' + p + '%' + (it.tj ? ' 🃏' : '') + '</span>'; }).join('') + '</div>';
    return h;
  };
  // con 🃏 se contesta con las tarjetas de respuesta y la cámara cuenta los aciertos
  const lista = (g, f, tipo, set) => '<ol class="rp-q">' + preguntas(g, f, tipo, set).map(x => '<li><span>' + esc(corto(x.q, 140)) + '</span><small class="muted">' + esc(tTit(x.it.tema)) + (x.it.dias != null ? ' · visto hace ' + x.it.dias + (x.it.dias === 1 ? ' día' : ' días') : '') + (x.opts ? ' · R: ' + 'ABCDE'[x.ok] + ') ' + esc(corto(x.opts[x.ok], 60)) : '') + '</small>' +
    (E.cam && x.opts && x.opts.length <= 4 ? btn('🃏 Con tarjetas', 'tj2-rep', 'data-f="' + f + '" data-t="' + tipo + '" data-i="' + set.items.indexOf(x.it) + '" title="Todos contestan con su tarjeta y la cámara cuenta los aciertos"', 'small ghost rp-tj') : '') + '</li>').join('') + '</ol>';
  R.calHTML = (g, f, d) => {
    if (!d || !d.bloques.some(b => !b.perdida)) return '';
    const set = R.calentamiento(g, f); if (!set) return '';
    return card('<div class="row between gap wrap"><h3>🔥 Calentamiento · 5 min</h3>' + btn('📽 Proyectar', 'rp-proj', 'data-f="' + f + '" data-t="cal"', 'small primary') + '</div><p class="muted small">Al empezar: preguntas de temas que vieron hace días, primero lo que salió más bajo. Recordar con esfuerzo es de lo que más ayuda a que se quede (y no cuenta para calificación).</p>' + lista(g, f, 'cal', set) + registro(g, f, 'cal', set, 'rp-cal-'), 'rp-card');
  };
  R.bolHTML = (g, f, d) => {
    if (!d || !d.bloques.some(b => !b.perdida && b.parts.length)) return '';
    const set = R.boleto(g, f, d);
    if (!set) return card('<div class="row between gap wrap"><h3>🎟 Boleto de salida · 3 min</h3>' + btn('📽 Proyectar 3-2-1', 'rp-proj', 'data-f="' + f + '" data-t="321"', 'small') + '</div><p class="muted small">Hoy no hubo tema con preguntas en el banco: usa el 3-2-1 en la libreta (3 cosas que aprendí, 2 interesantes, 1 duda). Lee las dudas y empieza con ellas la próxima clase.</p>', 'rp-card');
    return card('<div class="row between gap wrap"><h3>🎟 Boleto de salida · 3 min</h3>' + btn('📽 Proyectar', 'rp-proj', 'data-f="' + f + '" data-t="bol"', 'small primary') + '</div><p class="muted small">Al final: preguntas de lo de hoy. Anota cuántos acertaron y el examen recomendado y los temas a reforzar se ajustan solos.</p>' + lista(g, f, 'bol', set) + registro(g, f, 'bol', set, 'rp-bol-'), 'rp-card');
  };
  // temas que el grupo no domina según calentamientos y boletos del último mes
  R.reforzarHTML = (g, hoy) => {
    hoy = hoy || u.today(); const r = R.desempeno(g, u.addDays(hoy, -35)), ts = Object.keys(r).filter(t => r[t].p < 0.6).sort((a, b) => r[a].p - r[b].p);
    if (!Object.keys(r).length) return '';
    return card('<h3>🎯 Temas a reforzar (calentamientos y boletos)</h3>' + (ts.length ? '<ul class="risk">' + ts.map(t => '<li><span><a href="#/tema/' + t + '">' + esc(tTit(t)) + '</a><br><small class="muted">' + r[t].n + (r[t].n === 1 ? ' pregunta' : ' preguntas') + ' en el último mes</small></span><span class="row gap"><span class="chip ' + (r[t].p < 0.4 ? 'bad' : 'warn') + '">' + Math.round(r[t].p * 100) + '%</span>' + btn('📝', 'ej-proj', 'data-id="' + t + '" aria-label="Ejercicios"', 'small ghost') + '</span></li>').join('') + '</ul><p class="muted small">Ya cuentan en el examen recomendado y salen primero en los próximos calentamientos.</p>' : '<p class="small">Todo lo registrado del último mes va arriba de 60 %. 👏</p>'));
  };

  /* ---------- tarjetas de respuesta (cámara) ---------- */
  const setDe = (g, f, t) => { if (t === 'cal') return R.calentamiento(g, f); let d = null; try { d = E.clases.dia(g, f); } catch (e) { d = null; } return R.boleto(g, f, d); };
  // la misma pregunta que se proyecta (mismo orden de opciones)
  R.pregunta = (g, f, t, i) => { const set = setDe(g, f, t), it = set && set.items[i]; if (!it) return null; const x = preguntas(g, f, t, { items: [it] })[0]; return x ? { q: x.q, opts: x.opts, ok: x.ok } : null; };
  // guarda lo que leyó la cámara: aciertos de esa pregunta sobre quienes contestaron (solo el conteo, no quién)
  R.guardaTarjetas = (g, f, t, i, res, okL) => {
    const set = setDe(g, f, t); if (!set || !set.items[i]) return;
    const ids = Object.keys(res), n = ids.length, tj = {}; ids.forEach(id => { tj[res[id]] = (tj[res[id]] || 0) + 1; });
    S.update(KR(g, f), doc => {
      if (!doc[t] || !(doc[t].items || []).length) doc[t] = { items: set.items.map(it => ({ id: it.id, tema: it.tema, dias: it.dias })) };
      const x = doc[t], it = x.items[i]; if (!it) return;
      it.ok = okL ? (tj[okL] || 0) : null; it.n = n; it.tj = tj; x.n = Math.max(Number(x.n) || presentes(g, f), n);
    }, {});
  };

  /* ---------- acciones ---------- */
  A['rp-proj'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, t = el.dataset.t; if (!g) return;
    if (t === '321') { E.proj.abrir({ id: 'bol321-' + f, titulo: 'Boleto 3-2-1' }, deck321()); return; }
    const d = E.clases.dia(g, f), set = t === 'cal' ? R.calentamiento(g, f) : R.boleto(g, f, d); if (!set) return;
    // se guarda la selección para que no cambie aunque muevas clases después
    S.update(KR(g, f), doc => { if (!doc[t] || !(doc[t].items || []).length) doc[t] = { items: set.items.map(it => ({ id: it.id, tema: it.tema, dias: it.dias })) }; }, {});
    E.proj.abrir({ id: t + '-' + f, titulo: t === 'cal' ? 'Calentamiento' : 'Boleto de salida' }, deck(g, f, t, set));
  };
  A['rp-reg'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, t = el.dataset.t, pre = 'rp-' + t + '-', d = E.clases.dia(g, f);
    const set = t === 'cal' ? R.calentamiento(g, f) : R.boleto(g, f, d); if (!set) return;
    const n = Math.max(1, Number((document.getElementById(pre + 'n') || {}).value) || presentes(g, f));
    const prev = ((S.get(KR(g, f)) || {})[t] || {}).items || [];
    const items = set.items.map((it, i) => { const v = (document.getElementById(pre + i) || {}).value, o = { id: it.id, tema: it.tema, dias: it.dias, ok: v === '' || v == null ? null : Math.max(0, Math.min(n, Math.round(Number(v)))) }, p = prev[i];
      if (p && p.id === it.id && p.tj && Number(p.ok) === o.ok) { o.n = p.n; o.tj = p.tj; } return o; });
    if (items.every(it => it.ok == null)) { u.toast('Escribe cuántos acertaron al menos una pregunta', 'err'); return; }
    S.update(KR(g, f), doc => { doc[t] = { items: items, n: n }; }, {});
    u.toast('Guardado: ya cuenta para el examen recomendado', 'ok', 3500);
  };

  /* ---------- en Semáforo y en Examen recomendado ---------- */
  const conRef = fn => function () { const o = fn.apply(null, arguments), g = D.grupoActual(); if (o && g && !/Algo falló/.test(o.h)) o.h += R.reforzarHTML(g); return o; };
  if (V.semaforo) V.semaforo = conRef(V.semaforo);
  if (V.examen) { const ex = V.examen; V.examen = function (id) { return id ? ex.apply(null, arguments) : conRef(ex).apply(null, arguments); }; }
})();

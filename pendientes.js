/* Escuadra · Pendientes de captura (v1.15): una bandeja con todo lo que falta anotar de tus clases (días sin cerrar,
   listas sin pasar, evidencias del guion, actividades vencidas sin calificar, exámenes sin capturar, tareas y prácticas
   sin revisar, calentamientos y boletos sin anotar y etapas del proyecto). Las evidencias del guion se convierten en
   actividad con la rúbrica sugerida en un toque. Solo lee tus datos: no cambia nada hasta que tú lo decides. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const P = E.pend = {};
  const KO = g => 'pendOmit:' + g.id, KG = g => 'guionAct:' + g.id;
  const TIPOS = { cierre: ['📝', 'Días sin cerrar'], lista: ['✅', 'Listas sin pasar'], guion: ['📌', 'Evidencias del guion para calificar'], act: ['📊', 'Actividades vencidas sin calificar'], exa: ['🧾', 'Exámenes sin capturar'], tarea: ['📒', 'Tareas sin revisar'], fc: ['💻', 'Prácticas de FreeCAD sin revisar'], rep: ['🔥', 'Calentamientos y boletos sin anotar'], proy: ['🧩', 'Avance del proyecto'] };
  P.TIPOS = TIPOS;
  const ahora = () => { const d = new Date(); return u.pad(d.getHours()) + ':' + u.pad(d.getMinutes()); };
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

  /* =================== evidencias del guion =================== */
  P.limpiaEv = ev => String(ev || '').replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
  P.rubSug = it => {
    const s = u.norm((it.ev || '') + ' ' + (it.t || '')).toLowerCase();
    if (/cartel|mapa mental|infograf/.test(s)) return 'cartel';
    if (/expo|defensa|explica|presenta/.test(s)) return 'expo';
    if (/bitacora/.test(s)) return 'bitacora';
    if (/reporte|calculo/.test(s)) return 'reporte';
    if (it.lugar === 'computo' || /plano|croquis|dibujo|vista|modelad|freecad|diagrama|esquema|simulador|disen/.test(s)) return 'plano';
    if (/prototipo|mecanismo|garra|grua|funciona|operando|ensamble|piezas|circuito|instalacion|sistema|barras|cortad/.test(s)) return 'prototipo';
    return null;
  };
  // lo que el guion marca como evidencia en las clases ya dadas entre dos fechas (sin exámenes ni trabajos de libreta)
  P.evidencias = (g, desde, hasta, planFn) => {
    const out = [];
    D.parciales().forEach(p => {
      if (p.fin < desde || p.inicio > hasta) return;
      let pl = null; try { pl = planFn ? planFn(p.id) : (E.CLASES[E.clases.smKey(g, p.id)] ? E.clases.plan(g, p.id) : null); } catch (e) { pl = null; } if (!pl) return;
      const acts = C.acts(g, p.id), hayDiag = acts.some(a => a.categoria === 'diagnostico'), vistos = {};
      pl.bloques.forEach(b => {
        if (b.perdida || b.fecha < desde || b.fecha > hasta) return;
        b.parts.forEach(pt => {
          const it = pt.it; if (pt.sigue || !it.ev || /^examen/.test(it.id) || /^examen del parcial/i.test(it.ev) || /libreta/i.test(it.ev)) return;
          const diag = /diagn[oó]stic/i.test(it.ev); if (diag && hayDiag) return;
          const nom = P.limpiaEv(it.ev), nk = u.norm(nom); if (vistos[nk]) return; vistos[nk] = 1;
          out.push({ it: it, f: b.fecha, fin: b.fin, pid: p.id, nom: nom, diag: diag, act: acts.find(a => a.guion === it.id || u.norm(a.nombre) === nk) || null, key: p.id + ':' + it.id, rub: diag ? null : P.rubSug(it) });
        });
      });
    });
    return out;
  };
  const rubNom = k => { const T = E.cap ? E.cap.rubs()[k] : null; return T ? T.n : k; };
  const evLi = (x, go) => '<li><div><b>' + esc(x.nom) + '</b><small class="muted">' + u.cap(u.fCorta(x.f)) + ' · ' + esc(corto(x.it.t, 60)) + (x.rub ? ' · rúbrica sugerida: ' + esc(rubNom(x.rub)) : x.diag ? ' · diagnóstico (no cuenta para calificación)' : '') + '</small></div><div class="row gap wrap">' +
    (x.act ? link('Calificar ›', 'actividad/' + x.act.id, 'small primary') : btn(go ? '+ Crear y calificar' : '+ Crear actividad', 'pd-ev', 'data-pid="' + x.pid + '" data-it="' + esc(x.it.id) + '" data-f="' + x.f + '"' + (go ? ' data-go="1"' : ''), 'small primary') + btn('No la califico', 'pd-ev-no', 'data-k="' + esc(x.key) + '"', 'small ghost')) + '</div></li>';
  // en el cierre del día
  P.evidHTML = (g, f) => {
    const om = S.get(KG(g)) || {}, L = P.evidencias(g, f, f).filter(x => x.act || !om[x.key]); if (!L.length) return '';
    return card('<h3>📌 Evidencias de hoy</h3><p class="muted small">Lo que tu guion marca como evidencia. Créala como actividad con la rúbrica sugerida y califica con un toque por alumno (E · B · S · I) o por equipo.</p><ul class="pd-l">' + L.map(x => evLi(x, false)).join('') + '</ul>');
  };
  A['pd-ev'] = el => {
    const g = D.grupoActual(), pid = el.dataset.pid, x = P.evidencias(g, el.dataset.f, el.dataset.f).find(e => e.it.id === el.dataset.it && e.pid === pid); if (!x) return;
    if (x.act) { location.hash = '#/actividad/' + x.act.id; return; }
    const id = u.uid('act'), T = x.rub && E.cap ? E.cap.rubs()[x.rub] : null;
    const a = { id: id, parcial: pid, categoria: x.diag ? 'diagnostico' : 'trabajos', nombre: x.nom, peso: 1, max: 100, fecha: x.f, instrumento: x.diag ? 'Exa' : T ? 'R' : 'LC', cuenta: !x.diag, notas: {}, guion: x.it.id };
    if (T) a.rub = { tpl: x.rub, n: T.n, crit: T.crit.slice(), niv: E.cap.niv() };
    S.put('act:' + g.id + ':' + id, a);
    u.toast('Actividad creada' + (T ? ' con rúbrica «' + T.n + '»' : '') + ' en ' + (x.diag ? 'Diagnóstico' : 'Libreta / Proyecto / Bitácora'), 'ok', 3500);
    if (el.dataset.go) location.hash = '#/actividad/' + id;
  };
  A['pd-ev-no'] = el => { const g = D.grupoActual(); S.update(KG(g), d => { d[el.dataset.k] = u.today(); }, {}); u.toast('Listo: ya no te la propongo', 'ok', 1800); };

  /* =================== la bandeja =================== */
  let memo = { k: null, v: null };
  P.lista = (g, hoy) => {
    hoy = hoy || u.today(); const hm = ahora(), key = (E.rap ? E.rap.ver : 0) + '|' + g.id + '|' + hoy + '|' + hm;
    if (memo.k === key) return memo.v;
    const out = [], om = S.get(KO(g)) || {}, omG = S.get(KG(g)) || {}, al = D.alumnos(g), N = al.length, planes = {};
    memo = { k: key, v: out }; if (!N) return out;
    const plan = pid => { if (!(pid in planes)) { try { planes[pid] = E.CLASES[E.clases.smKey(g, pid)] ? E.clases.plan(g, pid) : null; } catch (e) { planes[pid] = null; } } return planes[pid]; };
    const add = (tipo, k, t, sub, to, extra) => { if (om[k]) return; out.push(Object.assign({ tipo: tipo, k: k, t: t, sub: sub || '', to: to || '' }, extra || {})); };
    const abiertos = D.parciales().filter(p => p.inicio <= hoy && p.captura >= hoy);
    const desdeP = p => { const a = C.inicioEfectivo(g, p), b = u.addDays(hoy, -35); return a > b ? a : b; };
    const bloques = (p, f) => { const pl = plan(p.id); return pl ? pl.bloques.filter(b => b.fecha === f && !b.perdida) : C.bloquesDia(g, f); };
    try {
      // 1) días sin cerrar
      if (E.cierre) E.cierre.pendientes(g, hoy).forEach(f => add('cierre', 'cierre@' + f, 'Cerrar el ' + u.fLarga(f), f === hoy ? 'Ya terminaron tus clases de hoy' : 'Lista, tarea, participación y destacados', 'cierre/' + f));
      // 2) listas sin pasar y 8) calentamientos y boletos sin anotar
      abiertos.forEach(p => {
        for (let f = desdeP(p); f <= hoy && f <= p.fin; f = u.addDays(f, 1)) {
          if (!C.esClase(g, f)) continue; const bs = bloques(p, f); if (!bs.length) continue;
          const ini = bs.map(b => b.inicio).sort()[0], fin = bs.map(b => b.fin).sort().slice(-1)[0];
          if (!S.get('asis:' + g.id + ':' + f) && (f < hoy || hm >= ini)) add('lista', 'lista@' + f, 'Pasar lista del ' + u.fLarga(f), 'Si no hubo clase, márcalo en el guion como «No se dio»', 'lista/' + f);
          const rp = S.get('rep:' + g.id + ':' + f) || {};
          ['cal', 'bol'].forEach(t => { const x = rp[t]; if (x && (x.items || []).length && !(x.n > 0) && (f < hoy || hm >= fin)) add('rep', 'rep@' + f + '@' + t, (t === 'cal' ? 'Calentamiento' : 'Boleto de salida') + ' del ' + u.fCorta(f), 'Lo proyectaste: anota cuántos acertaron', 'clase/' + f); });
        }
      });
      // 3) evidencias del guion sin actividad
      abiertos.forEach(p => P.evidencias(g, desdeP(p), hoy, plan).filter(x => x.pid === p.id && !x.act && !omG[x.key] && (x.f < hoy || hm >= x.fin)).forEach(x => {
        out.push({ tipo: 'guion', k: 'guion@' + x.key, t: x.nom, sub: u.fCorta(x.f) + (x.rub ? ' · rúbrica: ' + rubNom(x.rub) : ''), to: 'pendientes', ev: x });
      }));
      // 4) actividades vencidas sin calificar
      abiertos.forEach(p => C.acts(g, p.id).forEach(a => {
        if (!a.fecha || a.fecha >= hoy || a.libreta || a.freecad || a.examen) return; const st = C.actStats(a, al);
        if (!st.capturadas) add('act', 'act@' + a.id, a.nombre, 'Sin calificar · era para el ' + u.fCorta(a.fecha), 'actividad/' + a.id);
        else if (st.capturadas < N / 2) add('act', 'act@' + a.id, a.nombre, 'Llevas ' + st.capturadas + ' de ' + N, 'actividad/' + a.id);
      }));
      // 5) exámenes aplicados sin capturar
      S.list('exa:' + g.id + ':').forEach(ex => {
        if (!ex.fecha || ex.fecha >= hoy || !abiertos.some(p => p.id === ex.parcial)) return;
        const res = ex.res || {}, n = Object.keys(res).filter(aid => res[aid] && (res[aid].np || Object.keys(res[aid].m || {}).length)).length;
        const ac = ex.actId && S.get('act:' + g.id + ':' + ex.actId), na = ac ? C.actStats(ac, al).capturadas : 0, cap = Math.max(n, na);
        if (cap < N / 2) add('exa', 'exa@' + ex.id, ex.titulo, cap ? 'Llevas ' + cap + ' de ' + N : 'Se aplicó el ' + u.fCorta(ex.fecha) + ' y no tiene resultados', ac && !n ? 'actividad/' + ac.id : 'examen/' + ex.id);
      });
      // 6) tareas que ya se entregaron y no tienen ninguna marca
      if (E.libreta) abiertos.forEach(p => {
        let T; try { T = E.libreta.tareas(g, p.id); } catch (e) { return; } const mk = E.libreta.doc(g, p.id).marcas || {};
        T.cuentan.forEach(t => {
          if (!t.f || (t.tipo !== 'tarea' && t.tipo !== 'propia')) return;
          const due = t.tipo === 'tarea' ? C.siguienteClase(g, t.f) : t.f; if (!due || due >= hoy) return;
          if (!al.some(a => (mk[a.id] || {})[t.key] != null)) add('tarea', 'tarea@' + p.id + '@' + t.key, corto(t.t, 90), 'Se entregaba el ' + u.fCorta(due), 'libreta/' + p.id);
        });
      });
      // 7) prácticas de FreeCAD que ya hicieron y nadie tiene revisión
      if (E.fc) abiertos.forEach(p => {
        const pl = plan(p.id), mk = (S.get('fcal:' + g.id + ':' + p.id) || {}).marcas || {}, vistos = {};
        if (pl) pl.bloques.forEach(b => { if (b.perdida || b.lugar !== 'computo' || b.fecha < desdeP(p) || b.fecha > hoy || (b.fecha === hoy && hm < b.fin)) return; b.parts.forEach(pt => E.fc.de(pt.it.id).forEach(pr => { if (!vistos[pr.id]) vistos[pr.id] = b.fecha; })); });
        const man = S.get('fcp:' + g.id) || {}; Object.keys(man).forEach(id => { const f = man[id]; if (typeof f === 'string' && f >= p.inicio && f <= p.fin && f <= hoy && !vistos[id]) vistos[id] = f; });
        Object.keys(vistos).forEach(id => { const pr = E.fc.get(id); if (pr && !al.some(a => (mk[a.id] || {})[id] != null)) add('fc', 'fc@' + p.id + '@' + id, pr.t, 'Se hizo el ' + u.fCorta(vistos[id]) + ': revisa quién la terminó', 'freecad/' + id + '/revisar/' + p.id); });
      });
      // 9) etapas del proyecto vencidas sin marcar (solo si ya llevas el avance)
      if (E.proyecto) {
        const p = C.parcialActual(hoy);
        if (p && E.proyecto.ETAPAS[E.clases.smKey(g, p.id)]) {
          const dp = E.proyecto.doc(g, p.id), eqs = dp.equipos || [];
          if (eqs.length && Object.keys(dp.etapas || {}).some(k => Object.keys(dp.etapas[k] || {}).length)) {
            const mal = eqs.map(eq => E.proyecto.estado(g, p.id, eq, hoy)).filter(r => r.atr.length);
            if (mal.length) { const ult = mal.map(r => r.atr.map(z => z.m.f).sort().slice(-1)[0]).sort().slice(-1)[0]; add('proy', 'proy@' + p.id + '@' + ult, mal.length + (mal.length === 1 ? ' equipo con etapas vencidas sin marcar' : ' equipos con etapas vencidas sin marcar'), '¿Ya las terminaron? Márcalas; si no, van atrasados', 'proyecto/' + p.id); }
          }
        }
      }
    } catch (e) { console.error(e); }
    return out;
  };

  /* =================== pantalla, Inicio y contador =================== */
  const itemLi = x => x.tipo === 'guion' ? evLi(x.ev, true) : '<li><div>' + (x.to ? '<a href="#/' + x.to + '"><b>' + esc(x.t) + '</b></a>' : '<b>' + esc(x.t) + '</b>') + (x.sub ? '<small class="muted">' + esc(x.sub) + '</small>' : '') + '</div>' + btn('Ignorar', 'pd-omit', 'data-k="' + esc(x.k) + '"', 'small ghost') + '</li>';
  V.pendientes = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Pendientes');
    const L = P.lista(g), om = Object.keys(S.get(KO(g)) || {}).length + Object.keys(S.get(KG(g)) || {}).length;
    let h = card('<h3>📥 Pendientes de captura</h3><p class="muted small">Lo que falta anotar de tus clases del parcial. Toca uno para ir directo; «Ignorar» lo quita de aquí si no aplica.</p>' + (E.cap ? E.cap.seguirHTML(g) : '') +
      (L.length ? '<div class="pd-res">' + Object.keys(TIPOS).filter(t => L.some(x => x.tipo === t)).map(t => '<span class="chip">' + TIPOS[t][0] + ' ' + L.filter(x => x.tipo === t).length + '</span>').join('') + '</div>' : '<p class="note ok">🎉 No tienes pendientes de captura: todo al día.</p>'));
    Object.keys(TIPOS).forEach(t => { const xs = L.filter(x => x.tipo === t); if (xs.length) h += card('<div class="row between gap wrap"><h3>' + TIPOS[t][0] + ' ' + TIPOS[t][1] + ' <span class="chip">' + xs.length + '</span></h3>' + (xs.length >= 3 && t !== 'guion' ? btn('Ignorar todos', 'pd-omit-t', 'data-t="' + t + '"', 'small ghost') : '') + '</div><ul class="pd-l">' + xs.map(itemLi).join('') + '</ul>'); });
    if (om) h += '<p class="muted small">Ignoraste ' + om + (om === 1 ? ' pendiente' : ' pendientes') + '. ' + btn('Volver a mostrarlos', 'pd-reset', '', 'small ghost') + '</p>';
    return { t: 'Pendientes', h: h };
  };
  A['pd-omit'] = el => { const g = D.grupoActual(); S.update(KO(g), d => { d[el.dataset.k] = u.today(); }, {}); u.toast('Quitado de pendientes', 'ok', 1600); };
  A['pd-omit-t'] = el => { const g = D.grupoActual(), xs = P.lista(g).filter(x => x.tipo === el.dataset.t); if (!xs.length || !confirm('¿Quitar de pendientes los ' + xs.length + ' de «' + TIPOS[el.dataset.t][1] + '»? Puedes volver a mostrarlos al final de esta pantalla.')) return; S.update(KO(g), d => { xs.forEach(x => { d[x.k] = u.today(); }); }, {}); };
  A['pd-reset'] = () => { const g = D.grupoActual(); S.put(KO(g), {}); S.put(KG(g), {}); };
  P.inicioHTML = (g, hoy) => {
    const L = P.lista(g, hoy).filter(x => x.tipo !== 'cierre'), seg = E.cap ? E.cap.seguirHTML(g) : '';
    if (!L.length && !seg) return '';
    return card('<div class="row between gap wrap"><h3>📥 Pendientes de captura' + (L.length ? ' <span class="chip warn">' + L.length + '</span>' : '') + '</h3>' + (L.length ? link('Ver todos ›', 'pendientes', 'small') : '') + '</div>' + seg +
      (L.length ? '<ul class="pd-mini">' + L.slice(0, 4).map(x => '<li><span>' + TIPOS[x.tipo][0] + '</span> <a href="#/' + (x.to || 'pendientes') + '">' + esc(x.t) + '</a>' + (x.sub ? ' <small class="muted">' + esc(x.sub) + '</small>' : '') + '</li>').join('') + '</ul>' + (L.length > 4 ? '<p class="small muted">Y ' + (L.length - 4) + ' más.</p>' : '') : ''));
  };
  let bt = 0;
  P.badge = () => {
    clearTimeout(bt);
    bt = setTimeout(() => {
      let n = 0; try { const g = D.grupoActual(); n = g ? P.lista(g).length : 0; } catch (e) { n = 0; }
      ['pend-top', 'pend-side'].forEach(id => { const el = document.getElementById(id); if (!el) return; el.hidden = !n; const b = el.querySelector('b') || el; b.textContent = n > 99 ? '99+' : String(n); });
    }, 250);
  };
})();

/* Escuadra · Reconocer el avance, no solo la calificación.
   Compara las últimas 2 semanas contra las 2 anteriores (asistencia, tareas de libreta, participación y prácticas de
   FreeCAD) y su examen contra su diagnóstico. Sugiere hasta 3 alumnos por semana, primero los que van mal o regular, y
   nadie se repite en 3 semanas. Elogiar el esfuerzo y la estrategia, no la inteligencia (Mueller y Dweck, 1998).
   Solo usa datos escolares. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const A = E.actions, H = E.h;
  const card = H.card, btn = H.btn;
  const RC = E.reconoce = {};
  const KC = g => 'recon:' + g.id;
  const corto = n => { const p = String(n).split(' '); return p.length >= 3 ? u.cap(p[p.length - 2].toLowerCase()) + ' ' + u.cap(p[0].toLowerCase()) : n; };
  const enRango = (f, a, b) => f >= a && f < b;

  // asistencia: sesiones registradas y presentes en [a, b)
  const asis = (g, aid, a, b) => { const pre = 'asis:' + g.id + ':'; let s = 0, p = 0; S.keys(pre).forEach(k => { const f = k.slice(pre.length); if (!enRango(f, a, b)) return; s++; if (C.cuenta((S.get(k) || {})[aid] || 'A')) p++; }); return { s: s, p: p, pct: s ? p / s : null }; };
  const part = (g, aid, a, b) => { const pre = 'part:' + g.id + ':'; let n = 0; S.keys(pre).forEach(k => { const f = k.slice(pre.length); if (enRango(f, a, b)) n += Number((S.get(k) || {})[aid] || 0); }); return n; };
  // tareas de libreta con fecha en [a, b): completas cuentan 1, incompletas 0.5
  const tareas = (g, aid, a, b) => {
    let n = 0, s = 0; if (!E.libreta) return { n: 0, r: null };
    D.parciales().forEach(p => { let ts; try { ts = E.libreta.tareas(g, p.id).cuentan; } catch (e) { return; } const m = ((E.libreta.doc(g, p.id).marcas || {})[aid]) || {}; const hay = Object.keys(E.libreta.doc(g, p.id).marcas || {}).length;
      if (!hay) return; ts.forEach(t => { if (!t.f || !enRango(t.f, a, b)) return; n++; s += (Number(m[t.key]) || 0) / 2; }); });
    return { n: n, s: s, r: n ? s / n : null };
  };
  const practicas = (g, aid, a, b) => { let s = 0; S.keys('fcal:' + g.id + ':').forEach(k => { const d = S.get(k) || {}, m = (d.marcas || {})[aid] || {}, fe = (d.fechas || {})[aid] || {}; Object.keys(m).forEach(id => { if (fe[id] && enRango(fe[id], a, b)) s += Number(m[id]) / 2; }); }); return s; };
  // examen reciente (últimas 3 semanas) contra su diagnóstico
  const examen = (g, aid, hoy) => {
    const acts = S.list('act:' + g.id + ':'), dg = acts.filter(x => x.categoria === 'diagnostico').map(x => C.nota(x, aid)).filter(v => v != null);
    const ex = acts.filter(x => x.categoria === 'examen' && x.fecha && x.fecha <= hoy && u.diffDays(x.fecha, hoy) <= 21).sort((x, y) => String(y.fecha).localeCompare(String(x.fecha))).map(x => ({ a: x, v: C.nota(x, aid) })).filter(x => x.v != null)[0];
    if (!dg.length || !ex) return null; return { d: dg[0], v: ex.v, dv: ex.v - dg[0] };
  };
  RC.sugerir = (g, hoy) => {
    hoy = hoy || u.today(); const A1 = u.addDays(hoy, -14), B0 = u.addDays(hoy, -28), log = S.get(KC(g)) || {}, p = C.parcialActual(hoy);
    const out = [];
    D.alumnos(g).forEach(al => {
      const L = log[al.id] || {}, ult = (L.ok || []).slice(-1)[0], omit = L.omit;
      if (ult && u.diffDays(ult, hoy) < 21) return; if (omit && u.diffDays(omit, hoy) < 7) return;
      const rz = []; let sc = 0;
      const a1 = asis(g, al.id, A1, hoy), a0 = asis(g, al.id, B0, A1);
      if (a1.s >= 2 && a0.s >= 2 && a1.pct - a0.pct >= 0.2 && a1.pct >= 0.8) { sc += (a1.pct - a0.pct) * 3; rz.push(a1.p === a1.s ? 'No faltó en las últimas 2 semanas (antes faltaba más)' : 'Mejoró su asistencia: ' + Math.round(a0.pct * 100) + '% → ' + Math.round(a1.pct * 100) + '%'); }
      const t1 = tareas(g, al.id, A1, hoy), t0 = tareas(g, al.id, B0, A1);
      if (t1.n >= 2 && t0.n >= 1 && t1.r - t0.r >= 0.3) { sc += (t1.r - t0.r) * 3; rz.push('Cumplió ' + (t1.s % 1 ? t1.s.toFixed(1) : t1.s) + ' de ' + t1.n + ' tareas (antes ' + (t0.s % 1 ? t0.s.toFixed(1) : t0.s) + ' de ' + t0.n + ')'); }
      const p1 = part(g, al.id, A1, hoy), p0 = part(g, al.id, B0, A1);
      if (p1 - p0 >= 3) { sc += Math.min(2, (p1 - p0) / 3); rz.push('Participó ' + p1 + ' veces en 2 semanas (antes ' + p0 + ')'); }
      const f1 = practicas(g, al.id, A1, hoy), f0 = practicas(g, al.id, B0, A1);
      if (f1 >= 2 && f1 > f0) { sc += Math.min(2, f1 - f0); rz.push('Completó ' + (f1 % 1 ? f1.toFixed(1) : f1) + ' prácticas de FreeCAD en 2 semanas'); }
      const ex = examen(g, al.id, hoy);
      if (ex && ex.dv >= 15) { sc += Math.min(3, ex.dv / 15); rz.push('Su examen subió ' + Math.round(ex.dv) + ' puntos respecto a su diagnóstico (' + Math.round(ex.d) + ' → ' + Math.round(ex.v) + ')'); }
      if (!rz.length) return;
      let nv = null; try { if (E.semaforo && p) { const r = E.semaforo.prom(g, al.id, p.id, hoy, true); nv = E.semaforo.nivel(r ? r.v : null); } } catch (e) { }
      if (nv === 'mal' || nv === 'reg') sc *= 1.3;
      out.push({ a: al, sc: sc, rz: rz, nv: nv });
    });
    return out.sort((x, y) => y.sc - x.sc).slice(0, 3);
  };
  RC.inicioHTML = (g, hoy) => {
    const s = RC.sugerir(g, hoy); if (!s.length) return '';
    const NV = { mal: '🔴', reg: '🟡', bien: '🟢' };
    return card('<h3>⭐ Para reconocer esta semana</h3><p class="muted small">Alumnos que mejoraron en las últimas 2 semanas. Díselo en concreto y por su esfuerzo («entregaste todas las tareas esta semana»), no «qué listo eres». Si es tímido, mejor en privado o con una nota en su libreta.</p>' +
      '<ul class="rc-list">' + s.map(x => '<li><div><a href="#/alumno/' + x.a.id + '"><b>' + esc(corto(x.a.nombre)) + '</b></a>' + (x.nv ? ' <span title="Semáforo">' + NV[x.nv] + '</span>' : '') + '<ul class="small">' + x.rz.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul></div><div class="row gap wrap">' + btn('✓ Ya lo reconocí', 'rc-ok', 'data-aid="' + x.a.id + '"', 'small primary') + btn('Omitir', 'rc-omit', 'data-aid="' + x.a.id + '"', 'small ghost') + '</div></li>').join('') + '</ul>');
  };
  RC.historial = (g, aid) => ((S.get(KC(g)) || {})[aid] || {}).ok || [];
  A['rc-ok'] = el => { const g = D.grupoActual(); S.update(KC(g), d => { const L = d[el.dataset.aid] = d[el.dataset.aid] || {}; L.ok = (L.ok || []).concat([u.today()]); }, {}); u.toast('Anotado: no se vuelve a sugerir en 3 semanas', 'ok'); };
  A['rc-omit'] = el => { const g = D.grupoActual(); S.update(KC(g), d => { const L = d[el.dataset.aid] = d[el.dataset.aid] || {}; L.omit = u.today(); }, {}); };
})();

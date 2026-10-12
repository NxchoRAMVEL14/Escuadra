/* Escuadra · Monitores rotativos (v1.24). En el guion de los bloques de centro de cómputo propone parejas: cada monitor
   (alumno con prácticas de FreeCAD completas o que va bien) apoya a 1 o 2 compañeros que van mal en el semáforo o aún no
   completan una práctica. Rota: primero quienes menos veces han sido monitores y evita repetir la pareja de la vez pasada.
   «Usar estas parejas» guarda el registro: en la ficha de cada alumno se ve cuántas veces fue monitor y quién lo apoyó.
   Monitores con las manos atrás: explican, no toman el mouse (Rosenshine, 2012; EEF: tutoría entre pares). */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h;
  const card = H.card, btn = H.btn;
  const MO = E.monitores = {};
  const KM = g => 'monit:' + g.id;
  const corto = n => u.corto(n);
  const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  MO.log = g => (S.get(KM(g)) || {}).log || {};
  const presentes = (g, f) => { const doc = S.get('asis:' + g.id + ':' + f); return D.alumnos(g).filter(a => !doc || ['A', 'R'].indexOf(doc[a.id] || 'A') >= 0); };
  MO.historial = g => {
    const lg = MO.log(g), veces = {}, ult = {}, apoyoDe = {}, ultPar = {};
    Object.keys(lg).sort().forEach(f => (lg[f].pares || []).forEach(pr => { const m = pr[0]; veces[m] = (veces[m] || 0) + 1; ult[m] = f; (pr[1] || []).forEach(aid => { (apoyoDe[aid] = apoyoDe[aid] || {})[m] = (apoyoDe[aid][m] || 0) + 1; ultPar[aid] = m; }); }));
    return { veces: veces, ult: ult, apoyoDe: apoyoDe, ultPar: ultPar };
  };
  MO.propuesta = (g, f, salto) => {
    const al = presentes(g, f); if (al.length < 4) return null;
    const p = D.parciales().find(x => f >= x.inicio && f <= x.fin) || C.parcialActual(f); let sem = {};
    if (E.semaforo && E.semaforo.datos && p) { try { E.semaforo.datos(g, p.id).filas.forEach(r => { sem[r.a.id] = r.n; }); } catch (e) { sem = {}; } }
    const fc = {}; al.forEach(a => { fc[a.id] = E.fc && E.fc.nivelAlumno ? E.fc.nivelAlumno(g, a.id) : { hay: false, n: 0, pts: 0 }; });
    const apoyo = al.filter(a => sem[a.id] === 'mal' || (fc[a.id].hay && fc[a.id].n === 0));
    if (!apoyo.length) return null;
    const hi = MO.historial(g), rnd = x => hash(g.id + f + (salto || 0) + x) % 1000;
    const cand = al.filter(a => apoyo.indexOf(a) < 0 && (fc[a.id].pts > 0 || sem[a.id] === 'bien'))
      .sort((a, b) => (hi.veces[a.id] || 0) - (hi.veces[b.id] || 0) || (fc[b.id].pts - fc[a.id].pts) || (rnd(a.id) - rnd(b.id)));
    if (!cand.length) return { pares: [], apoyo: apoyo, sinMon: true };
    const k = Math.min(cand.length, Math.max(1, Math.ceil(apoyo.length / 2))), off = (salto || 0) % Math.max(1, cand.length - k + 1);
    const mons = cand.slice(off, off + k), carga = {}; mons.forEach(m => { carga[m.id] = []; });
    apoyo.slice().sort((a, b) => a.num - b.num).forEach(a => {
      const libres = mons.filter(m => carga[m.id].length < 2), op = libres.length ? libres : mons;
      const m = op.find(x => hi.ultPar[a.id] !== x.id) || op[0]; carga[m.id].push(a.id);
    });
    return { pares: mons.map(m => [m.id, carga[m.id]]).filter(x => x[1].length), apoyo: apoyo, sem: sem, fc: fc, hi: hi };
  };
  MO.html = (g, f) => {
    const lg = MO.log(g)[f], salto = (E.ui.mon || {})[f] || 0;
    const pr = lg && !salto ? { pares: lg.pares, guardado: true } : MO.propuesta(g, f, salto); if (!pr) return '';
    const nom = id => { const a = D.alumno(g, id); return a ? esc(corto(a.nombre)) : '—'; };
    if (pr.sinMon) return '<div class="fc-blq"><b>🤝 Monitores</b><p class="small">' + pr.apoyo.length + ' alumnos necesitan apoyo, pero todavía no hay quién tenga prácticas completas o vaya bien para ser monitor. Revisa prácticas de FreeCAD para que aparezcan.</p></div>';
    const hi = MO.historial(g);
    return '<div class="fc-blq mo-blq"><div class="row between gap wrap"><b>🤝 Monitores de hoy' + (pr.guardado ? ' <span class="chip ok">✓ guardado</span>' : ' <span class="chip">rotan</span>') + '</b></div>' +
      '<p class="small muted">Cada monitor se sienta junto a sus compañeros y les explica con las manos atrás (no toma el mouse). Rotan: primero quienes menos veces han sido monitores y sin repetir la pareja de la vez pasada.</p>' +
      '<ul class="mo-l">' + pr.pares.map(x => '<li><span class="chip brand">' + nom(x[0]) + (hi.veces[x[0]] ? ' · ' + hi.veces[x[0]] + '×' : ' · 1ª vez') + '</span> <span class="muted">apoya a</span> ' + x[1].map(nom).join(', ') + '</li>').join('') + '</ul>' +
      '<div class="row gap wrap">' + (pr.guardado ? btn('↻ Cambiar parejas', 'mo-otra', 'data-f="' + f + '"', 'small ghost') : btn('✓ Usar estas parejas', 'mo-usar', 'data-f="' + f + '"', 'small primary') + btn('↻ Otra rotación', 'mo-otra', 'data-f="' + f + '"', 'small ghost')) + btn('📽 Proyectar parejas', 'mo-proj', 'data-f="' + f + '"', 'small ghost') + '</div></div>';
  };
  A['mo-usar'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, pr = MO.propuesta(g, f, (E.ui.mon || {})[f] || 0); if (!pr || !pr.pares) return;
    S.update(KM(g), d => { d.log = d.log || {}; d.log[f] = { pares: pr.pares, ts: u.now() }; }, {});
    E.ui.mon = E.ui.mon || {}; delete E.ui.mon[f]; u.toast('Parejas guardadas: quedan en la ficha de cada alumno', 'ok', 3000);
  };
  A['mo-otra'] = el => { const f = el.dataset.f; E.ui.mon = E.ui.mon || {}; E.ui.mon[f] = (E.ui.mon[f] || 0) + 1; E.render(); };
  A['mo-proj'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, lg = MO.log(g)[f], salto = (E.ui.mon || {})[f] || 0, pr = lg && !salto ? lg : MO.propuesta(g, f, salto); if (!pr || !pr.pares || !E.proj) return;
    const nom = id => { const a = D.alumno(g, id); return a ? corto(a.nombre) : '—'; };
    E.proj.abrir({ id: 'mon-' + f, titulo: 'Monitores' }, [{ k: 'list', h: '🤝 Monitores de hoy', items: pr.pares.map(x => nom(x[0]) + ' → ' + x[1].map(nom).join(', ')), foot: 'Monitor: explica con las manos atrás; no toma el mouse. Si nadie de los dos sabe, levanten la mano.' }]);
  };
  // en el guion: reemplaza el acomodo sugerido cuando hay a quién apoyar y quién puede ser monitor
  if (E.fc && E.fc.acomodoHTML) { const orig = E.fc.acomodoHTML; E.fc.acomodoHTML = (g, f) => { let h = ''; try { h = MO.html(g, f); } catch (e) { console.error(e); } return h || orig(g, f); }; }
  // en la ficha del alumno
  MO.alumnoHTML = (g, a) => {
    const hi = MO.historial(g), v = hi.veces[a.id] || 0, de = hi.apoyoDe[a.id] || {}, ks = Object.keys(de).sort((x, y) => de[y] - de[x]);
    if (!v && !ks.length) return '';
    const nom = id => { const x = D.alumno(g, id); return x ? esc(corto(x.nombre)) : '—'; };
    return card('<h3>🤝 Monitores</h3><p class="small">' + (v ? 'Ha sido monitor <b>' + v + (v === 1 ? ' vez' : ' veces') + '</b> (última: ' + u.fCorta(hi.ult[a.id]) + ').' : '') + (ks.length ? ' Lo han apoyado: ' + ks.map(id => nom(id) + (de[id] > 1 ? ' (' + de[id] + ')' : '')).join(', ') + '.' : '') + '</p>');
  };
  if (V.alumno) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) { const x = MO.alumnoHTML(g, a); if (x) o.h = E.fichaInsert ? E.fichaInsert(o.h, x) : o.h + x; } return o; }; }
})();

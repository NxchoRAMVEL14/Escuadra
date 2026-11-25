/* Escuadra · Mis pendientes (v1.44.0): una lista de pendientes en Inicio, justo debajo de «Hoy en 3». Junta lo que la app
   detecta (alumnos en rojo de la alerta temprana y el cierre de semestre cuando se acerca) con tus
   propias tareas («imprimir exámenes», «llamar a la mamá de…»), con fecha opcional. Lo palomeado de días anteriores se
   esconde solo. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const MD = E.midia = {}, K = 'midia';
  MD.items = () => ((S.get(K) || {}).items || []).filter(x => x && x.id);
  MD.auto = g => { const out = [], hoy = u.today();
    if (g && E.alerta) { try { const r = E.alerta.grupo(g, C.parcialActual().id).filter(x => x.nivel === 'rojo'); if (r.length) out.push({ t: 'Atender a ' + r.length + ' alumno' + (r.length > 1 ? 's' : '') + ' en rojo', b: link('Ver', 'alerta', 'small') }); } catch (e) { } }
    const ps = D.parciales(), ul = ps[ps.length - 1];
    if (g && ul && hoy >= u.addDays(ul.fin, -21) && hoy <= u.addDays(ul.fin, 30) && E.finsem) { const d = E.finsem.doc(g), n = E.finsem.PASOS.filter(p => (d.hechos || {})[p[0]]).length; if (n < E.finsem.PASOS.length) out.push({ t: 'Cierre de semestre: ' + n + ' de ' + E.finsem.PASOS.length + ' pasos', b: link('Abrir', 'finsem', 'small') }); }
    return out; };
  MD.html = g => { const hoy = u.today(), its = MD.items().filter(x => !x.hecho || x.hecho === hoy).sort((a, b) => (a.para || '9') < (b.para || '9') ? -1 : 1), au = MD.auto(g);
    return card('<h3>✅ Mis pendientes</h3>' + (au.length || its.length ? '<ul class="plain md-l">' + au.map(x => '<li class="md-auto"><span>🔔 ' + esc(x.t) + '</span>' + x.b + '</li>').join('') +
      its.map(x => { const v = x.para && x.para < hoy && !x.hecho; return '<li><label class="ck"><input type="checkbox" data-ch="md-ok" data-id="' + x.id + '"' + (x.hecho ? ' checked' : '') + '><span' + (x.hecho ? ' class="md-hecho"' : '') + '>' + esc(x.t) + (x.para ? ' <small class="' + (v ? 'md-venc' : 'muted') + '">' + (x.para === hoy ? 'hoy' : u.fCorta(x.para)) + '</small>' : '') + '</span></label><button type="button" class="linkbtn small" data-act="md-del" data-id="' + x.id + '" aria-label="Quitar">✕</button></li>'; }).join('') + '</ul>' : '<p class="small muted">Nada pendiente. 🎉</p>') +
      '<div class="row gap wrap mt"><input class="inp" id="md-t" placeholder="Agregar: imprimir exámenes, llamar a…" style="flex:1 1 100%"><input class="inp" type="date" id="md-f" style="flex:1" aria-label="Para cuándo (opcional)"><button type="button" class="btn small" data-act="md-add">+ Agregar</button></div>'); };
  A['md-add'] = () => { const t = ((document.getElementById('md-t') || {}).value || '').trim(), f = (document.getElementById('md-f') || {}).value || ''; if (!t) return; S.update(K, d => { d.items = d.items || []; d.items.push({ id: u.uid('md'), t: t, para: f || null, f: u.today() }); }, {}); };
  CH['md-ok'] = el => S.update(K, d => { const x = (d.items || []).find(y => y.id === el.dataset.id); if (x) x.hecho = el.checked ? u.today() : null; }, {});
  A['md-del'] = el => S.update(K, d => { d.items = (d.items || []).filter(y => y.id !== el.dataset.id); }, {});
  if (V.inicio) { const vi = V.inicio; V.inicio = function () { const o = vi.apply(null, arguments); if (!o || !o.h) return o; const g = D.grupoActual(), c = MD.html(g), i = o.h.indexOf('</section>');
    o.h = i > 0 ? o.h.slice(0, i + 10) + c + o.h.slice(i + 10) : c + o.h; return o; }; }
})();

/* Escuadra · Suspensiones (v1.40.0): en la ficha del alumno anotas desde cuándo está suspendido y qué día regresa.
   Los días de clase de en medio se marcan solos como falta en el pase de lista (también si la lista ya se había pasado).
   Si alguno de esos días le pones justificante (J), se respeta. Al quitar la suspensión, esos días vuelven a asistencia. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h, card = H.card, btn = H.btn;
  const SU = E.susp = {}, K = gid => 'susp:' + gid;

  SU.lista = g => (g && S.get(K(g.id || g))) || [];
  // suspendido del día «desde» al día anterior a «regresa»
  SU.en = (gid, aid, f) => (S.get(K(gid)) || []).find(x => x.aid === aid && f >= x.desde && f < x.regresa) || null;
  SU.hoy = (g, f) => SU.lista(g).filter(x => f >= x.desde && f < x.regresa);
  SU.diasClase = (g, s) => { const out = []; for (let f = s.desde; f < s.regresa && out.length < 120; f = u.addDays(f, 1)) if (C.esClase ? C.esClase(g, f) : true) out.push(f); return out; };

  // cada vez que se guarda una lista, quien está suspendido ese día queda con falta (salvo justificante)
  const aplica = (key, data) => {
    const m = /^asis:(.+):(\d{4}-\d{2}-\d{2})$/.exec(key); if (!m || !data || typeof data !== 'object') return data;
    const L = (S.get(K(m[1])) || []).filter(x => m[2] >= x.desde && m[2] < x.regresa); if (!L.length) return data;
    L.forEach(x => { if (data[x.aid] === 'J') return; Object.keys(data).forEach(k => { if (k.indexOf(x.aid + '|') === 0) delete data[k]; }); data[x.aid] = 'F'; });
    return data;
  };
  const put0 = S.put;
  S.put = function (key, data, opt) { if (typeof key === 'string' && key.indexOf('asis:') === 0) data = aplica(key, data); return put0.call(this, key, data, opt); };

  // pone (o quita) la falta en las listas ya pasadas dentro del periodo
  const repasa = (g, s, quitar) => { const pre = 'asis:' + g.id + ':'; let n = 0;
    S.keys(pre).forEach(k => { const f = k.slice(pre.length); if (f < s.desde || f >= s.regresa) return; const d = S.get(k); if (!d) return;
      if (quitar) { if (d[s.aid] === 'F') { d[s.aid] = 'A'; S.put(k, d); n++; } } else { if (d[s.aid] !== 'F' && d[s.aid] !== 'J') n++; S.put(k, d); } });
    return n; };

  SU.alumnoHTML = (g, a) => { const L = SU.lista(g).filter(x => x.aid === a.id).sort((x, y) => y.desde < x.desde ? -1 : 1), hoy = u.today(), act = L.find(x => hoy >= x.desde && hoy < x.regresa);
    return card('<h3>🚫 Suspensión' + (act ? ' <span class="chip bad">suspendido</span>' : '') + '</h3>' +
      (act ? '<p class="small"><b>Regresa el ' + esc(u.fLarga(act.regresa)) + '.</b> Mientras, en el pase de lista lleva falta sola.</p>' : '') +
      (L.length ? '<ul class="plain small">' + L.map(x => { const n = SU.diasClase(g, x).length; return '<li class="row between gap"><span>Del ' + esc(u.fCorta(x.desde)) + ', regresa el ' + esc(u.fCorta(x.regresa)) + ' · ' + n + ' día' + (n === 1 ? '' : 's') + ' de clase' + (x.motivo ? ' · ' + esc(x.motivo) : '') + '</span><button type="button" class="linkbtn small" data-act="su-quita" data-id="' + x.id + '">Quitar</button></li>'; }).join('') + '</ul>' : '') +
      '<details class="sub"' + (L.length ? '' : ' open') + '><summary class="small">' + (L.length ? 'Anotar otra suspensión' : 'Anotar una suspensión') + '</summary><div class="fgrid"><label class="fld"><span>Desde</span><input class="inp" type="date" id="su-desde" value="' + hoy + '"></label><label class="fld"><span>Regresa el</span><input class="inp" type="date" id="su-reg" value="' + u.addDays(hoy, 3) + '"></label></div>' +
      '<label class="fld"><span>Motivo (opcional, solo lo ves tú)</span><input class="inp" id="su-mot" placeholder="Ej. indisciplina, acuerdo de dirección"></label><div class="row gap mt">' + btn('Guardar suspensión', 'su-guarda', 'data-aid="' + a.id + '"', 'primary small') + '</div>' +
      '<p class="muted small">Los días de clase desde la fecha de inicio hasta un día antes de que regrese se marcan solos como falta en el pase de lista, también si ya la habías pasado. Si le pones justificante (J) a algún día, se respeta.</p></details>'); };
  A['su-guarda'] = el => { const g = D.grupoActual(), aid = el.dataset.aid, de = (document.getElementById('su-desde') || {}).value, re = (document.getElementById('su-reg') || {}).value, mo = ((document.getElementById('su-mot') || {}).value || '').trim();
    if (!de || !re) { u.toast('Pon desde cuándo y qué día regresa', 'err'); return; } if (re <= de) { u.toast('El regreso debe ser después del inicio', 'err'); return; }
    const s = { id: u.uid('su'), aid: aid, desde: de, regresa: re, motivo: mo };
    S.update(K(g.id), l => { l.push(s); return l; }, []); const n = repasa(g, s), d = SU.diasClase(g, s).length;
    u.toast('Suspensión guardada: ' + d + ' día' + (d === 1 ? '' : 's') + ' de clase con falta' + (n ? ' (' + n + ' lista' + (n === 1 ? '' : 's') + ' corregida' + (n === 1 ? '' : 's') + ')' : ''), 'ok', 3200); };
  A['su-quita'] = el => { if (!confirm('¿Quitar la suspensión? Las faltas de esos días vuelven a asistencia (corrige en la lista si de verdad faltó).')) return; const g = D.grupoActual(), s = SU.lista(g).find(x => x.id === el.dataset.id); if (!s) return;
    S.update(K(g.id), l => l.filter(x => x.id !== s.id), []); repasa(g, s, true); u.toast('Suspensión quitada', 'ok'); };

  // ficha del alumno
  if (V.alumno) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) o.h = E.fichaInsert(o.h, SU.alumnoHTML(g, a)); return o; }; }
  // pase de lista: aviso de quién está suspendido ese día
  if (V.lista) { const vl = V.lista; V.lista = function (fecha) { const o = vl.apply(null, arguments), g = D.grupoActual(); if (!o || !o.h || !g) return o; const f = fecha || C.fechaListaDefault(g, u.today()), L = SU.hoy(g, f); if (!L.length) return o;
    const al = D.alumnos(g), nm = x => { const a = al.find(y => y.id === x.aid); return a ? a.num + '. ' + u.corto(a.nombre) : '—'; };
    const av = card('<p class="small">🚫 <b>Suspendido' + (L.length > 1 ? 's' : '') + ':</b> ' + L.map(x => esc(nm(x)) + ' (regresa el ' + esc(u.fCorta(x.regresa)) + ')').join(' · ') + '. Su falta se pone sola al guardar la lista.</p>');
    const b = o.h.indexOf('class="datebar"'), i = b >= 0 ? o.h.indexOf('</button></div>', b) : -1; o.h = i > 0 ? o.h.slice(0, i + 15) + av + o.h.slice(i + 15) : av + o.h; return o; }; }
  // Inicio: quién está suspendido hoy
  if (V.inicio) { const vi = V.inicio; V.inicio = function () { const o = vi.apply(null, arguments), g = D.grupoActual(); if (!o || !o.h || !g) return o; const L = SU.hoy(g, u.today()); if (!L.length) return o;
    const al = D.alumnos(g); o.h = card('<p class="small">🚫 Hoy suspendido' + (L.length > 1 ? 's' : '') + ': ' + L.map(x => { const a = al.find(y => y.id === x.aid); return a ? '<a href="#/alumno/' + a.id + '">' + esc(a.num + '. ' + u.corto(a.nombre)) + '</a> (regresa el ' + esc(u.fCorta(x.regresa)) + ')' : ''; }).join(' · ') + '</p>') + o.h; return o; }; }
})();

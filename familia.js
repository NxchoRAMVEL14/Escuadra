/* Escuadra · v1.47.0 · Paquete 4 (papás)
   21) Avisos a casa: la app arma sola los mensajes que vale la pena mandar (faltó 2 clases seguidas o más, va abajo o
       debe 2 pendientes o más, y también las buenas noticias: insignias nuevas o subió 2 puntos), cada uno una vez. Tú los
       revisas y los mandas por WhatsApp con un toque; quedan en el historial de la familia. Más un mensaje para el grupo
       de papás con lo que viene en la semana.
   22) Informe mensual: una hoja por alumno con su asistencia del mes, lo que entregó y sacó, lo que no entregó, sus
       insignias y lo que observaste, su calificación del parcial, cómo va el semestre y el QR a su portal; con firma de
       enterado. También por WhatsApp.
   23) Citas individuales para la junta: horarios de 10, 15 o 20 minutos para cada familia citada, mensaje con su hora y
       agenda impresa.
   24) Historial con la familia: juntas (si asistió), citas, avisos mandados, llamadas y visitas, y los acuerdos con
       seguimiento (pendiente, cumplido, no cumplido, fecha para revisar). En la ficha y en «Familias» (acuerdos por
       revisar y alumnos en alerta sin contacto con su familia). */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const FA = E.familia = {}, K = g => 'familia:' + g.id;
  const corto = n => (u.corto ? u.corto(n) : n);
  const nom1 = a => { try { return u.partesNombre(a.nombre).nom.split(' ')[0]; } catch (e) { return corto(a.nombre); } };
  const doc = g => S.get(K(g)) || {};
  const upd = (g, fn) => S.update(K(g), fn, {});
  const firma = () => (D.cfg().docente || 'el docente');
  const intro = g => 'Buen día. Le escribe ' + firma() + ', docente de ' + g.nombre + (D.cfg().plantel ? ' en el ' + D.cfg().plantel : '') + '.';
  const semana = f => { const d = new Date(f + 'T12:00:00'); const j = new Date(d.getFullYear(), 0, 1); return d.getFullYear() + '-s' + Math.ceil(((d - j) / 864e5 + j.getDay() + 1) / 7); };

  /* ---------- 21 · avisos a casa ---------- */
  FA.TIPOS = { falta: ['🚫', 'Faltas seguidas'], avance: ['📉', 'Va abajo o debe trabajos'], bien: ['🌟', 'Buenas noticias'] };
  FA.avisos = (g, hoy) => {
    hoy = hoy || u.today(); const p = C.parcialActual(hoy), d = doc(g), env = d.env || {}, des = d.des || {}, off = d.off || {}, m10 = C.min10(), out = [], sem = semana(hoy);
    const ins = (S.get('insig:' + g.id) || {}), hace7 = u.addDays(hoy, -7);
    D.alumnos(g).forEach(a => {
      const as = C.asis(g, p, a.id);
      if (!off.falta && as.racha >= 2) { const ult = as.fechasF.slice(-as.racha); out.push({ key: 'falta:' + a.id + ':' + ult[ult.length - 1], a: a, tipo: 'falta', t: 'Faltó sus últimas ' + as.racha + ' clases (' + ult.map(u.fCorta).join(', ') + ')',
        msg: () => intro(g) + '\nLe aviso que ' + nom1(a) + ' faltó a sus últimas ' + as.racha + ' clases (' + ult.map(u.fCorta).join(', ') + '). ¿Está todo bien? Si hubo algún motivo, con gusto lo platicamos para que no se atrase.\nQuedo a sus órdenes.' }); }
      if (!off.avance && hoy >= p.inicio) { const k = C.cal(g, p.id, a.id), of = k.final == null ? null : C.oficial(k.final), r = E.aprobar ? E.aprobar.analiza(g, p.id, a.id) : null, np = r ? r.pend.length : 0;
        if ((of != null && of < m10) || np >= 2) out.push({ key: 'avance:' + a.id + ':' + sem, a: a, tipo: 'avance', t: (of != null && of < m10 ? 'Va con ' + of : 'Va con ' + (of == null ? '—' : of)) + (np ? ' · debe ' + np : ''), url: true,
          msg: url => E.casa && E.casa.mensaje ? E.casa.mensaje(g, a, p.id, url) : intro(g) }); }
      if (!off.bien) { const mi = ins[a.id] || {}, nuevas = Object.keys(mi).filter(id => mi[id] >= hace7), L = E.insig ? E.insig.de(g, a).filter(i => nuevas.indexOf(i.id) >= 0) : [];
        if (L.length) { const txt = L.map(i => (E.insig.CAT.find(c => c[0] === i.cat) || [])[2] + (i.t ? ' (' + i.t + ')' : '')).join(', ');
          out.push({ key: 'bien:' + a.id + ':' + L.map(i => i.id).sort().join(','), a: a, tipo: 'bien', t: txt, msg: () => intro(g) + '\n¡Buenas noticias! ' + nom1(a) + ' logró esta semana: ' + txt + '. Se lo ganó con su esfuerzo; si puede, felicítelo en casa. 👏\nGracias por su apoyo.' }); } }
    });
    return out.filter(x => !env[x.key] && !des[x.key]);
  };
  FA.grupoMsg = g => { const L = E.insig ? E.insig.proximas(g).filter(x => u.diffDays(u.today(), x[0]) <= 7) : []; if (!L.length) return '';
    return 'Buen día, familias de ' + g.nombre + '. Les comparto lo que viene esta semana en el módulo:\n' + L.map(x => '• ' + u.cap(u.fLarga(x[0])) + ': ' + x[1]).join('\n') + '\nGracias por su apoyo. ' + firma(); };
  V.avisos = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Avisos a casa');
    const L = FA.avisos(g), d = doc(g), off = d.off || {}, gm = FA.grupoMsg(g), hoy = u.today();
    let h = card('<h3>📨 Avisos a casa</h3><p class="small">La app arma los mensajes que vale la pena mandar y cada uno sale una sola vez. Tú los revisas y los mandas por WhatsApp con un toque. Incluye buenas noticias: avisar también lo bueno hace que la familia conteste cuando hay algo difícil.</p><div class="row gap wrap fa-tipos">' + Object.keys(FA.TIPOS).map(k => '<label class="chk"><input type="checkbox" data-ch="fa-off" data-k="' + k + '"' + (off[k] ? '' : ' checked') + '> ' + FA.TIPOS[k][0] + ' ' + FA.TIPOS[k][1] + '</label>').join('') + '</div>');
    h += card('<h3>Por mandar (' + L.length + ')</h3>' + (L.length ? '<ul class="plain fa-l">' + L.map(x => '<li class="fa-' + x.tipo + '"><div><b>' + FA.TIPOS[x.tipo][0] + ' ' + x.a.num + '. ' + esc(corto(x.a.nombre)) + '</b><small>' + esc(x.t) + (x.a.tel ? '' : ' · sin teléfono: WhatsApp te deja elegir el contacto') + '</small></div><div class="row gap">' + btn('💬 Mandar', 'fa-wa', 'data-k="' + esc(x.key) + '"', 'small primary') + btn('Descartar', 'fa-des', 'data-k="' + esc(x.key) + '"', 'small ghost') + '</div></li>').join('') + '</ul>' : '<p class="muted small">Nada por mandar. 🎉</p>'));
    if (gm) h += card('<div class="row between gap wrap"><h3>👪 Para el grupo de papás</h3>' + btn('📋 Copiar', 'fa-gcopy', '', 'small') + '</div><pre class="fa-pre">' + esc(gm) + '</pre>');
    const env = d.env || {}, ya = Object.keys(env).filter(k => env[k] >= u.addDays(hoy, -30)).sort((a, b) => (env[a] < env[b] ? 1 : -1));
    if (ya.length) h += card('<h3>✓ Mandados en los últimos 30 días (' + ya.length + ')</h3><ul class="plain fa-l small">' + ya.slice(0, 40).map(k => { const [tp, aid] = k.split(':'), a = D.alumno(g, aid); return '<li>' + (FA.TIPOS[tp] || ['✉️'])[0] + ' ' + (a ? esc(corto(a.nombre)) : '') + ' <span class="muted">' + u.fCorta(env[k]) + '</span></li>'; }).join('') + '</ul>');
    return { t: 'Avisos a casa', h: h };
  };
  FA.contacto = (g, aid, tipo, t, f) => upd(g, d => { d.con = d.con || []; d.con.push({ id: u.uid('fc'), aid: aid, tipo: tipo, t: t, f: f || u.today() }); });
  A['fa-wa'] = async el => { const g = D.grupoActual(), x = FA.avisos(g).find(y => y.key === el.dataset.k); if (!x) return;
    let url = null; if (x.url && E.casa && E.casa.consultaURL) { try { url = await E.casa.consultaURL(g, x.a, C.parcialActual().id); } catch (e) { } }
    const txt = x.msg(url); window.open(E.casa.wa(x.a, txt), '_blank');
    upd(g, d => { d.env = d.env || {}; d.env[x.key] = u.today(); d.con = d.con || []; d.con.push({ id: u.uid('fc'), aid: x.a.id, tipo: 'aviso', t: FA.TIPOS[x.tipo][1] + ': ' + x.t, f: u.today() }); }); };
  A['fa-des'] = el => { const g = D.grupoActual(); upd(g, d => { d.des = d.des || {}; d.des[el.dataset.k] = u.today(); }); };
  A['fa-gcopy'] = async () => { const ok = await u.copy(FA.grupoMsg(D.grupoActual())); u.toast(ok ? 'Mensaje copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  CH['fa-off'] = el => { const g = D.grupoActual(); upd(g, d => { d.off = d.off || {}; if (el.checked) delete d.off[el.dataset.k]; else d.off[el.dataset.k] = 1; }); };
  if (E.midia && E.midia.auto) { const ma = E.midia.auto; E.midia.auto = function (g) { const out = ma.apply(null, arguments); try { if (g) { const n = FA.avisos(g).length; if (n) out.push({ t: n + (n === 1 ? ' aviso' : ' avisos') + ' a casa por mandar', b: link('Ver', 'avisos', 'small') }); const cs = (doc(g).con || []).filter(c => c.tipo === 'cita' && c.f >= u.today() && c.f <= u.addDays(u.today(), 2)); cs.forEach(c => { const a = D.alumno(g, c.aid); out.push({ t: 'Cita con la familia de ' + (a ? corto(a.nombre) : '') + ' · ' + (c.f === u.today() ? 'hoy' : u.fCorta(c.f)) + (c.h ? ' ' + c.h : ''), b: a ? link('Ficha', 'alumno/' + a.id, 'small') : '' }); }); } } catch (e) { } return out; }; }

  /* ---------- 22 · informe mensual ---------- */
  const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  FA.mesTxt = m => MES[Number(m.slice(5, 7)) - 1] + ' de ' + m.slice(0, 4);
  FA.informe = (g, a, mes) => {
    const ini = mes + '-01', fin = u.addDays(u.addDays(ini, 32).slice(0, 8) + '01', -1), hoy = u.today(), hasta = fin < hoy ? fin : hoy, OB = {}; (E.OBS || []).forEach(o => { OB[o.id] = o; });
    let ses = 0; const fal = [], acts = [];
    D.parciales().forEach(p => { if (p.fin < ini || p.inicio > hasta) return;
      C.fechasRegistradas(g, p).forEach(f => { if (f >= ini && f <= hasta) ses++; }); C.asis(g, p, a.id).fechasF.forEach(f => { if (f >= ini && f <= hasta) fal.push(f); });
      C.acts(g, p.id).forEach(x => { if (!x.fecha || x.fecha < ini || x.fecha > hasta || (C.sinCal && C.sinCal(x))) return; const v = C.nota(x, a.id), otros = Object.keys(x.notas || {}).some(k => k !== a.id && x.notas[k] !== '' && x.notas[k] != null);
        if (v != null) acts.push({ f: x.fecha, t: x.nombre, c: C.c10(v), mal: C.oficial(v) < C.min10() }); else if (otros && x.fecha < hoy) acts.push({ f: x.fecha, t: x.nombre, c: 'No entregó', mal: true }); }); });
    const ob = { pos: {}, neg: {} }; S.keys('obs:' + g.id + ':').forEach(k => { const f = k.split(':').pop(); if (f < ini || f > hasta) return; ((S.get(k) || {})[a.id] || []).forEach(id => { const o = OB[id]; if (o) { const b = o.pos > 0 ? ob.pos : ob.neg; b[o.txt] = (b[o.txt] || 0) + 1; } }); });
    const mi = (S.get('insig:' + g.id) || {})[a.id] || {}, ins = E.insig ? E.insig.de(g, a).filter(i => mi[i.id] && mi[i.id] >= ini && mi[i.id] <= fin) : [];
    const p = C.parcialActual(hasta), k = C.cal(g, p.id, a.id), pr = E.seguir ? E.seguir.pred(g, a.id, hasta) : null;
    return { ini: ini, fin: hasta, ses: ses, fal: fal.sort(), acts: acts.sort((x, y) => (x.f < y.f ? -1 : 1)), ob: ob, ins: ins, p: p, cal: k.final == null ? null : C.oficial(k.final), curso: !!k.enCurso, pr: pr };
  };
  const hoja = (g, a, mes, qr) => { const x = FA.informe(g, a, mes), cf = D.cfg(), CAT = {}; (E.insig ? E.insig.CAT : []).forEach(c => { CAT[c[0]] = c; });
    const pos = Object.keys(x.ob.pos), neg = Object.keys(x.ob.neg);
    return '<div class="pr fa-pr"><div class="fa-hd"><div><p class="fa-k">Informe mensual para la familia</p><h2>' + esc(a.nombre) + '</h2><p class="fs-sub">' + esc(u.cap(FA.mesTxt(mes)) + ' · ' + g.nombre + ' · No. de lista ' + a.num + ' · ' + (cf.plantel || 'CETAC 19') + ' · ' + firma()) + '</p></div>' + (qr ? '<div class="fa-qr">' + qr + '<small>Escanee para ver su avance al día</small></div>' : '') + '</div>' +
      '<div class="fa-kpi"><div><b>' + (x.ses ? (x.ses - x.fal.length) + '/' + x.ses : '—') + '</b><span>clases a las que vino</span></div><div><b>' + (x.cal == null ? '—' : x.cal) + '</b><span>' + esc(x.p.nombre) + (x.curso ? ' (en curso)' : '') + '</span></div><div><b>' + x.ins.length + '</b><span>insignias del mes</span></div></div>' +
      (x.fal.length ? '<p><b>Faltó:</b> ' + x.fal.map(u.fCorta).join(', ') + '.</p>' : (x.ses ? '<p><b>¡No faltó ninguna clase este mes!</b></p>' : '')) +
      '<h3>Trabajos y exámenes del mes</h3>' + (x.acts.length ? '<table class="fs-t"><tr><th>Fecha</th><th>Actividad</th><th>Calificación</th></tr>' + x.acts.map(r => '<tr><td>' + u.fCorta(r.f) + '</td><td style="text-align:left">' + esc(r.t) + '</td><td' + (r.mal ? ' class="fs-baja"' : '') + '>' + esc(r.c) + '</td></tr>').join('') + '</table>' : '<p class="fs-sub">Sin actividades calificadas este mes.</p>') +
      (x.ins.length ? '<h3>Insignias que ganó</h3><p>' + x.ins.map(i => (CAT[i.cat] || [])[1] + ' ' + esc((CAT[i.cat] || [])[2] || '')).join(' · ') + '</p>' : '') +
      (pos.length || neg.length ? '<h3>Lo que observé en clase</h3>' + (pos.length ? '<p>👍 ' + pos.map(t => esc(t) + (x.ob.pos[t] > 1 ? ' (' + x.ob.pos[t] + ')' : '')).join(' · ') + '</p>' : '') + (neg.length ? '<p>⚠️ A mejorar: ' + neg.map(t => esc(t) + (x.ob.neg[t] > 1 ? ' (' + x.ob.neg[t] + ')' : '')).join(' · ') + '</p>' : '') : '') +
      (x.pr && x.pr.est !== 'sin' ? '<p><b>Semestre:</b> ' + esc(x.pr.t) + '.</p>' : '') +
      '<div class="fa-firma"><div>Nombre y firma de enterado (madre, padre o tutor)</div><div>Comentarios para el docente</div></div></div>'; };
  V.informe = mes => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Informe mensual');
    mes = mes || u.today().slice(0, 7);
    const L = D.alumnos(g).map(a => ({ a: a, x: FA.informe(g, a, mes) }));
    let h = card('<h3>📰 Informe mensual para la familia</h3><p class="small">Una hoja por alumno con su asistencia del mes, sus trabajos y exámenes, lo que no entregó, sus insignias, lo que observaste, su calificación y un QR a su portal. Con firma de enterado. Mándalo impreso o por WhatsApp.</p><div class="row gap wrap"><label class="fld"><span>Mes</span><input type="month" data-ch="fa-mes" value="' + mes + '"></label></div><div class="row gap wrap">' + btn('🖨 Imprimir todos', 'fa-imp', 'data-mes="' + mes + '"', 'primary') + '</div>');
    h += card('<h3>Resumen de ' + esc(FA.mesTxt(mes)) + '</h3><ul class="plain fa-l">' + L.map(o => '<li><div><b>' + o.a.num + '. ' + esc(corto(o.a.nombre)) + '</b><small>' + (o.x.ses ? (o.x.ses - o.x.fal.length) + '/' + o.x.ses + ' clases' : 'sin lista') + ' · ' + o.x.acts.length + ' actividades' + (o.x.acts.filter(r => r.c === 'No entregó').length ? ' · ' + o.x.acts.filter(r => r.c === 'No entregó').length + ' sin entregar' : '') + (o.x.ins.length ? ' · ' + o.x.ins.length + ' 🏅' : '') + '</small></div><div class="row gap">' + btn('🖨', 'fa-imp', 'data-mes="' + mes + '" data-aid="' + o.a.id + '"', 'small ghost') + btn('💬', 'fa-inf-wa', 'data-mes="' + mes + '" data-aid="' + o.a.id + '"', 'small') + '</div></li>').join('') + '</ul>');
    return { t: 'Informe mensual', h: h };
  };
  CH['fa-mes'] = el => { if (el.value) location.hash = '#/informe/' + el.value; };
  A['fa-imp'] = async el => { const g = D.grupoActual(), mes = el.dataset.mes, al = el.dataset.aid ? [D.alumno(g, el.dataset.aid)] : D.alumnos(g); if (E.cam && E.cam.qrListo) await E.cam.qrListo(); let h = '';
    for (const a of al) { let qr = ''; try { const url = await E.casa.consultaURL(g, a, C.parcialActual().id); qr = E.cam.qrSVG(url, 'fa-qrsvg', 'L'); } catch (e) { } h += hoja(g, a, mes, qr); }
    E.print.run(h, { title: 'Informe de ' + FA.mesTxt(mes) }); };
  A['fa-inf-wa'] = async el => { const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid), mes = el.dataset.mes, x = FA.informe(g, a, mes); let url = ''; try { url = await E.casa.consultaURL(g, a, C.parcialActual().id); } catch (e) { }
    const nr = x.acts.filter(r => r.c === 'No entregó');
    const txt = intro(g) + '\nLe comparto el resumen de ' + FA.mesTxt(mes) + ' de ' + nom1(a) + ':\n• Asistencia: ' + (x.ses ? (x.ses - x.fal.length) + ' de ' + x.ses + ' clases' : 'sin registros') + (x.fal.length ? ' (faltó ' + x.fal.map(u.fCorta).join(', ') + ')' : '') + '\n• Calificación del ' + x.p.nombre + ': ' + (x.cal == null ? 'pendiente' : x.cal + (x.curso ? ' (en curso)' : '')) + (nr.length ? '\n• No entregó: ' + nr.map(r => r.t).join(', ') : '') + (x.ins.length ? '\n• Ganó ' + x.ins.length + (x.ins.length === 1 ? ' insignia' : ' insignias') + ' 🏅' : '') + (url ? '\nAquí puede ver el detalle al día (sin nombre, con su número de lista ' + a.num + '): ' + url : '') + '\nQuedo a sus órdenes.';
    window.open(E.casa.wa(a, txt), '_blank'); FA.contacto(g, a.id, 'aviso', 'Informe de ' + FA.mesTxt(mes)); };

  /* ---------- 23 · citas individuales en la junta ---------- */
  const hhmm = (ini, min) => { const p = String(ini || '14:00').split(':').map(Number), t = p[0] * 60 + (p[1] || 0) + min; return String(Math.floor(t / 60) % 24).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); };
  FA.citas = (g, j) => { const c = (doc(g).citas || {})[j.id] || {}, al = D.alumnos(g).filter(a => j.general || (j.citados || {})[a.id]), ord = (c.orden || []).filter(id => al.some(a => a.id === id)).concat(al.map(a => a.id).filter(id => (c.orden || []).indexOf(id) < 0));
    const dur = Number(c.dur) || 15, ini = c.ini || j.hora || '14:00'; return { on: !!c.on, dur: dur, ini: ini, L: ord.map((id, i) => ({ a: D.alumno(g, id), h: hhmm(ini, i * dur), mot: (j.citados || {})[id] || '' })).filter(x => x.a) }; };
  const citaMsg = (g, j, x, dur) => intro(g) + '\nLe espero el ' + u.fLarga(j.fecha) + ' a las ' + x.h + ' (' + dur + ' minutos)' + (j.lugar ? ' en ' + j.lugar : '') + ' para platicar sobre ' + nom1(x.a) + (x.mot ? ' (' + x.mot + ')' : '') + '. Si no puede a esa hora, avíseme por este medio y la cambiamos.\nGracias.';
  if (V.junta) { const vj = V.junta; V.junta = function (id) { const o = vj.apply(null, arguments), g = D.grupoActual(); if (!o || !o.h || !id || !g) return o; const RS = E.resultados, j = RS && RS.juntas(g).find(x => x.id === id); if (!j) return o;
    const ct = FA.citas(g, j);
    const c = card('<div class="row between gap wrap"><h3>🕐 Citas individuales</h3>' + (ct.on ? btn('🖨 Agenda', 'fa-cit-imp', 'data-id="' + j.id + '"', 'small') : '') + '</div>' + (ct.on ? '<div class="row gap wrap"><label class="fld"><span>Empieza</span><input type="time" value="' + ct.ini + '" data-ch="fa-cit" data-id="' + j.id + '" data-k="ini"></label><label class="fld"><span>Minutos por familia</span><select data-ch="fa-cit" data-id="' + j.id + '" data-k="dur">' + [10, 15, 20].map(n => '<option' + (n === ct.dur ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></label></div><ul class="plain fa-l">' + ct.L.map((x, i) => '<li><div><b>' + x.h + ' · ' + esc(corto(x.a.nombre)) + '</b>' + (x.mot ? '<small>' + esc(x.mot) + '</small>' : '') + '</div><div class="row gap">' + (i ? btn('▲', 'fa-cit-sube', 'data-id="' + j.id + '" data-aid="' + x.a.id + '"', 'small ghost') : '') + btn('💬', 'fa-cit-wa', 'data-id="' + j.id + '" data-aid="' + x.a.id + '"', 'small') + '</div></li>').join('') + '</ul><p class="small muted">Cada familia recibe su hora; así nadie espera y la plática es en privado. Termina a las ' + hhmm(ct.ini, ct.L.length * ct.dur) + '.</p>' : '<p class="small">En lugar de citar a todos a la misma hora, dale a cada familia su horario (10 a 20 minutos) con su mensaje de WhatsApp.</p>' + btn('Armar horarios', 'fa-cit-on', 'data-id="' + j.id + '"', 'small primary')));
    const i = o.h.indexOf('<h3>📝 Acuerdos'), s = i > 0 ? o.h.lastIndexOf('<section', i) : -1; o.h = s > 0 ? o.h.slice(0, s) + c + o.h.slice(s) : o.h + c; return o; }; }
  const updC = (g, id, fn) => upd(g, d => { d.citas = d.citas || {}; const c = d.citas[id] = d.citas[id] || {}; fn(c); });
  A['fa-cit-on'] = el => { const g = D.grupoActual(); updC(g, el.dataset.id, c => { c.on = true; }); };
  CH['fa-cit'] = el => { const g = D.grupoActual(); updC(g, el.dataset.id, c => { c[el.dataset.k] = el.value; }); };
  A['fa-cit-sube'] = el => { const g = D.grupoActual(), j = E.resultados.juntas(g).find(x => x.id === el.dataset.id); if (!j) return; const ord = FA.citas(g, j).L.map(x => x.a.id), i = ord.indexOf(el.dataset.aid); if (i > 0) { ord.splice(i, 1); ord.splice(i - 1, 0, el.dataset.aid); } updC(g, j.id, c => { c.orden = ord; }); };
  A['fa-cit-wa'] = el => { const g = D.grupoActual(), j = E.resultados.juntas(g).find(x => x.id === el.dataset.id); if (!j) return; const ct = FA.citas(g, j), x = ct.L.find(y => y.a.id === el.dataset.aid); if (!x) return; window.open(E.casa.wa(x.a, citaMsg(g, j, x, ct.dur)), '_blank'); FA.contacto(g, x.a.id, 'cita', 'Cita en la junta a las ' + x.h, j.fecha); };
  A['fa-cit-imp'] = el => { const g = D.grupoActual(), j = E.resultados.juntas(g).find(x => x.id === el.dataset.id); if (!j) return; const ct = FA.citas(g, j);
    E.print.run('<div class="pr fa-pr"><h2>Agenda de citas · junta del ' + esc(u.fLarga(j.fecha)) + '</h2><p class="fs-sub">' + esc(g.nombre + (j.lugar ? ' · ' + j.lugar : '') + ' · ' + ct.dur + ' minutos por familia') + '</p><table class="fs-t"><tr><th>Hora</th><th>#</th><th>Alumno</th><th>Motivo</th><th>Asistió</th><th>Acuerdo</th></tr>' + ct.L.map(x => '<tr><td>' + x.h + '</td><td>' + x.a.num + '</td><td style="text-align:left">' + esc(x.a.nombre) + '</td><td style="text-align:left">' + esc(x.mot) + '</td><td></td><td style="width:35%"></td></tr>').join('') + '</table></div>', { title: 'Agenda de citas' }); };

  /* ---------- 24 · historial con la familia y acuerdos con seguimiento ---------- */
  const akey = (j, x) => j.id + '|' + (x.aid || '') + '|' + String(x.t).slice(0, 40);
  FA.acuerdos = (g, aid) => { const st = doc(g).acu || {}, out = []; if (E.resultados && E.resultados.juntas) E.resultados.juntas(g).forEach(j => (j.acuerdos || []).forEach(x => { if (aid && x.aid !== aid) return; const k = akey(j, x), s = st[k] || {}; out.push({ k: k, j: j, x: x, a: x.aid ? D.alumno(g, x.aid) : null, est: s.est || 'pend', rev: s.rev || u.addDays(j.fecha, 14) }); })); return out; };
  FA.EST = { pend: ['⏳', 'Pendiente'], ok: ['✅', 'Cumplido'], no: ['❌', 'No cumplido'] };
  FA.historial = (g, aid) => { const out = [], d = doc(g);
    if (E.resultados && E.resultados.juntas) E.resultados.juntas(g).forEach(j => { if (j.general || (j.citados || {})[aid]) out.push({ f: j.fecha, i: '👪', t: 'Junta' + ((j.citados || {})[aid] ? ' (' + j.citados[aid] + ')' : '') + ' · ' + (j.fecha > u.today() ? 'próxima' : (j.asistio || {})[aid] ? 'asistió' : 'no asistió') }); });
    (d.con || []).filter(c => c.aid === aid).forEach(c => out.push({ f: c.f, i: ({ aviso: '💬', llamada: '📞', visita: '🏫', cita: '🕐', mensaje: '✉️' })[c.tipo] || '•', t: c.t, id: c.id }));
    return out.sort((x, y) => (x.f < y.f ? 1 : -1)); };
  const acuLi = (g, z, conNombre) => '<li class="fa-ac-' + z.est + '"><div><b>' + (conNombre && z.a ? esc(corto(z.a.nombre)) + ': ' : '') + esc(z.x.t) + '</b><small>Junta del ' + u.fCorta(z.j.fecha) + ' · revisar el ' + u.fCorta(z.rev) + (z.est === 'pend' && z.rev <= u.today() ? ' · <b class="fa-venc">ya toca revisarlo</b>' : '') + '</small></div><div class="row gap">' + Object.keys(FA.EST).map(s => '<button type="button" class="chip' + (s === z.est ? ' on' : '') + '" data-act="fa-ac" data-k="' + esc(z.k) + '" data-s="' + s + '" title="' + FA.EST[s][1] + '">' + FA.EST[s][0] + '</button>').join('') + '</div></li>';
  FA.fichaHTML = (g, a) => { const H0 = FA.historial(g, a.id), AC = FA.acuerdos(g, a.id);
    return card('<div class="row between gap wrap"><h3>👪 Familia</h3>' + link('Todas', 'familias', 'small') + '</div>' + (AC.length ? '<h4>Acuerdos</h4><ul class="plain fa-l">' + AC.map(z => acuLi(g, z)).join('') + '</ul>' : '') +
      (H0.length ? '<h4>Contacto</h4><ul class="plain fa-h">' + H0.slice(0, 12).map(x => '<li><span class="muted">' + u.fCorta(x.f) + '</span> ' + x.i + ' ' + esc(x.t) + (x.id ? ' <button type="button" class="linkbtn small" data-act="fa-con-del" data-id="' + x.id + '" aria-label="Quitar">✕</button>' : '') + '</li>').join('') + '</ul>' : '<p class="small muted">Sin contacto registrado con su familia.</p>') +
      '<details class="sub"><summary>＋ Registrar llamada, visita o cita</summary><div class="row gap wrap"><select class="inp" id="fa-c-tipo"><option value="llamada">📞 Llamada</option><option value="visita">🏫 Vino a la escuela</option><option value="cita">🕐 Cita</option><option value="mensaje">✉️ Mensaje o recado</option></select><input class="inp" type="date" id="fa-c-f" value="' + u.today() + '"><input class="inp" id="fa-c-t" placeholder="Qué se platicó o para qué" style="flex:1;min-width:160px">' + btn('Guardar', 'fa-con', 'data-aid="' + a.id + '"', 'small primary') + '</div></details>'); };
  A['fa-ac'] = el => { const g = D.grupoActual(); upd(g, d => { d.acu = d.acu || {}; const s = d.acu[el.dataset.k] = d.acu[el.dataset.k] || {}; s.est = el.dataset.s; if (el.dataset.s === 'pend') s.rev = u.addDays(u.today(), 14); }); };
  A['fa-con'] = el => { const g = D.grupoActual(), t = (document.getElementById('fa-c-t') || {}).value || '', tp = (document.getElementById('fa-c-tipo') || {}).value || 'llamada', f = (document.getElementById('fa-c-f') || {}).value || u.today(); FA.contacto(g, el.dataset.aid, tp, t.trim() || ({ llamada: 'Llamada', visita: 'Vino a la escuela', cita: 'Cita', mensaje: 'Mensaje' })[tp], f); };
  A['fa-con-del'] = el => { const g = D.grupoActual(); upd(g, d => { d.con = (d.con || []).filter(c => c.id !== el.dataset.id); }); };
  if (V.alumno && E.fichaInsert) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) { o.h = o.h.replace(/<section class="card[^"]*"[^>]*><h3>👪 Acuerdos con la familia<\/h3>[\s\S]*?<\/section>/, ''); o.h = E.fichaInsert(o.h, FA.fichaHTML(g, a)); } return o; }; }
  V.familias = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Familias');
    const hoy = u.today(), AC = FA.acuerdos(g), rev = AC.filter(z => z.est === 'pend' && z.rev <= hoy), pend = AC.filter(z => z.est === 'pend' && z.rev > hoy), d = doc(g), ini = (D.parciales()[0] || {}).inicio || '';
    const conCont = new Set((d.con || []).filter(c => c.f >= ini).map(c => c.aid)); if (E.resultados && E.resultados.juntas) E.resultados.juntas(g).forEach(j => Object.keys(j.asistio || {}).forEach(aid => conCont.add(aid)));
    const rojos = E.alerta ? E.alerta.grupo(g, C.parcialActual().id).filter(x => x.nivel === 'rojo' && !conCont.has(x.a.id)) : [];
    let h = card('<h3>👪 Familias</h3><p class="small">Todo el contacto con las familias en un lugar: juntas, citas, avisos mandados, llamadas y visitas, y los acuerdos con su seguimiento. Un acuerdo sin revisar es un acuerdo que no existe.</p><div class="row gap wrap">' + link('📨 Avisos a casa', 'avisos', 'small') + link('📰 Informe mensual', 'informe', 'small') + link('👪 Juntas', 'junta', 'small') + '</div>');
    if (rojos.length) h += card('<h3>🔴 En alerta y sin contacto con su familia (' + rojos.length + ')</h3><ul class="plain fa-l">' + rojos.map(x => '<li><div><a href="#/alumno/' + x.a.id + '"><b>' + x.a.num + '. ' + esc(corto(x.a.nombre)) + '</b></a><small>' + esc(x.R.filter(r => r.tipo !== 'cono').map(r => r.t).slice(0, 2).join('; ')) + '</small></div>' + btn('💬', 'at-wa', 'data-aid="' + x.a.id + '"', 'small') + '</li>').join('') + '</ul>');
    h += card('<h3>📌 Acuerdos por revisar (' + rev.length + ')</h3>' + (rev.length ? '<ul class="plain fa-l">' + rev.map(z => acuLi(g, z, true)).join('') + '</ul>' : '<p class="muted small">Ninguno por revisar hoy.</p>') + (pend.length ? '<details class="sub"><summary>Otros pendientes (' + pend.length + ')</summary><ul class="plain fa-l">' + pend.map(z => acuLi(g, z, true)).join('') + '</ul></details>' : ''));
    const ult = (d.con || []).slice().sort((a, b) => (a.f < b.f ? 1 : -1)).slice(0, 15);
    if (ult.length) h += card('<h3>🕒 Último contacto</h3><ul class="plain fa-h">' + ult.map(c => { const a = D.alumno(g, c.aid); return '<li><span class="muted">' + u.fCorta(c.f) + '</span> ' + (a ? '<a href="#/alumno/' + a.id + '">' + esc(corto(a.nombre)) + '</a> · ' : '') + esc(c.t) + '</li>'; }).join('') + '</ul>');
    return { t: 'Familias', h: h };
  };
})();

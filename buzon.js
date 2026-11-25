/* Escuadra · v1.46.0 · Paquete 3 (alumnos)
   19) Buzón anónimo abierto todo el semestre: un QR (para el salón o el grupo de WhatsApp) donde escriben sugerencias,
       dudas de la clase, algo que les preocupa o un agradecimiento, sin nombre. Llega a tu Supabase (la misma tabla de la
       encuesta: cualquiera escribe, solo tú lees). Marcas leído o atendido. Si un mensaje habla de acoso, violencia o
       riesgo, la app te recuerda seguir el protocolo del plantel y avisar a orientación el mismo día.
   20) Autoevaluación y coevaluación del proyecto con rúbrica: por QR cada alumno elige su número y evalúa con 4 criterios
       (1 a 4) a cada integrante de su equipo y a sí mismo. Sale el promedio de sus compañeros, su autoevaluación, quién se
       sobrevalora o se subestima y quién aportó poco según su equipo; con un botón pasa a calificaciones. Sin Supabase:
       formatos impresos por equipo y capturas los promedios. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const BZ = E.buzon = {}, CO = E.coev = {};
  const nube = () => E.sync && E.sync.client && E.sync.user ? E.sync : null;
  const corto = n => (u.corto ? u.corto(n) : n);
  const empaca = async data => E.casa ? await E.casa.empaca(data) : 'j' + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  const pag = () => location.href.split('#')[0].split('?')[0].replace(/[^/]*$/, '') + 'encuesta.html#';
  const sinNube = '<p class="note small">Necesita Supabase: conéctalo en Ajustes → Sincronización y corre una vez el SQL de la Encuesta (Más → Encuesta → SQL). Es la misma tabla.</p>';

  /* ---------- 19 · buzón anónimo ---------- */
  const KB = g => 'buzon:' + g.id;
  BZ.doc = g => S.get(KB(g)) || {};
  BZ.id = g => { let d = BZ.doc(g); if (!d.id) { d = Object.assign({}, d, { id: 'buz-' + u.uid('b').slice(-10) }); S.put(KB(g), d, { silent: true }); } return d.id; };
  BZ.TIPOS = [['sug', '💡', 'Sugerencia'], ['duda', '❓', 'Duda de la clase'], ['preo', '😟', 'Algo me preocupa'], ['grac', '👏', 'Agradecimiento']];
  BZ.ALERTA = /acos|bull|golpe|pega|amenaz|miedo|suicid|matar|morir|lastim|cort[oa]rme|abus|toca|drog|arma|navaja|violen|insult|burla/i;
  BZ.url = async g => { const Y = nube(); return pag() + await empaca({ v: 1, k: 'buz', o: Y ? Y.user.id : '', e: BZ.id(g), g: g.nombre }); };
  BZ.lee = async g => { const Y = nube(); if (!Y) throw new Error('Inicia sesión en Supabase (Ajustes → Sincronización).'); const r = await Y.client.from('escuadra_encuesta').select('id,resp,creado').eq('encuesta', BZ.id(g)).order('creado', { ascending: false }).limit(300); if (r.error) throw r.error; return r.data || []; };
  V.buzon = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const Y = nube(), d = BZ.doc(g), M = (E.ui.bzMsg || {})[g.id], est = d.est || {};
    let h = card('<h3>📮 Buzón anónimo</h3><p class="small">Un QR abierto todo el semestre: escriben sugerencias, dudas de la clase, algo que les preocupa o un agradecimiento, <b>sin nombre</b>. Pégalo en el salón o mándalo al grupo. Leer y responder en clase («ustedes dijeron, yo hice») construye confianza.</p>' + (Y ? '<div class="row gap wrap">' + btn('📲 QR del buzón', 'bz-qr', '', 'primary') + btn('🖨 Cartel', 'bz-cartel', '', 'small') + btn('🔄 Revisar mensajes', 'bz-lee', '', 'small') + '</div>' : sinNube));
    h += card('<p class="small"><b>⚠️ Importante:</b> si un mensaje habla de acoso, violencia, autolesión o cualquier riesgo, sigue el protocolo del plantel y avisa a orientación el mismo día. El buzón no es para emergencias y así se lo dice a los alumnos.</p>');
    if (M) { const L = M.filter(m => (est[m.id] || '') !== 'borrado');
      h += card('<h3>📬 Mensajes (' + L.length + ')</h3>' + (L.length ? '<ul class="plain bz-l">' + L.map(m => { const r = m.resp || {}, t = BZ.TIPOS.find(x => x[0] === r.tipo) || ['', '✉️', 'Mensaje'], e = est[m.id] || 'nuevo', al = BZ.ALERTA.test(r.t || ''); return '<li class="bz-' + e + (al ? ' bz-al' : '') + '"><div class="row between gap"><b>' + t[1] + ' ' + esc(t[2]) + '</b><small class="muted">' + u.fCorta(String(m.creado).slice(0, 10)) + '</small></div><p>' + esc(String(r.t || '').slice(0, 600)) + '</p>' + (al ? '<p class="note bad small">Podría ser un riesgo: revisa el protocolo y avisa a orientación.</p>' : '') + '<div class="row gap">' + ['nuevo', 'leido', 'atendido'].map(s => '<button type="button" class="chip' + (s === e ? ' on' : '') + '" data-act="bz-est" data-id="' + m.id + '" data-s="' + s + '">' + ({ nuevo: 'Nuevo', leido: 'Leído', atendido: 'Atendido' })[s] + '</button>').join('') + '<button type="button" class="linkbtn small" data-act="bz-est" data-id="' + m.id + '" data-s="borrado">Ocultar</button></div></li>'; }).join('') + '</ul>' : '<p class="muted small">Todavía no hay mensajes.</p>')); }
    return { t: 'Buzón anónimo', h: h };
  };
  A['bz-lee'] = async () => { const g = D.grupoActual(); try { const L = await BZ.lee(g); E.ui.bzMsg = E.ui.bzMsg || {}; E.ui.bzMsg[g.id] = L; S.update(KB(g), d => { d.visto = u.today(); d.n = L.length; }, {}); } catch (e) { u.toast(e.message || 'No se pudieron leer', 'err', 4000); } E.render(); };
  A['bz-est'] = el => { const g = D.grupoActual(); S.update(KB(g), d => { d.est = d.est || {}; d.est[el.dataset.id] = el.dataset.s; }, {}); };
  A['bz-qr'] = async () => { const g = D.grupoActual(), url = await BZ.url(g); E.ui.bzUrl = url; if (E.cam && E.cam.qrListo) await E.cam.qrListo();
    E.modal.open('📮 Buzón anónimo', '<div class="c">' + E.cam.qrSVG(url, 'pj-qr', 'M') + '</div><div class="row gap wrap mt">' + btn('📋 Copiar enlace', 'bz-copiar', '', 'primary') + btn('📽 Proyectar', 'bz-proj') + '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Probar</a></div>'); };
  A['bz-copiar'] = async () => { const ok = await u.copy('📮 Buzón anónimo de la clase (sin nombre): ' + E.ui.bzUrl); u.toast(ok ? 'Enlace copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['bz-proj'] = () => { if (!E.proj) return; E.modal.close(); E.proj.abrir({ id: 'buzon', titulo: 'Buzón anónimo' }, [{ k: 'html', h: '📮 Buzón anónimo', html: '<div class="pj-qrbox">' + E.cam.qrSVG(E.ui.bzUrl, 'pj-qr', 'M') + '<div><p>Sugerencias, dudas, algo que te preocupa o un agradecimiento. <b>Sin nombre</b>.</p><p>Si estás en peligro, habla hoy con orientación o con un adulto de confianza.</p></div></div>' }]); };
  A['bz-cartel'] = async () => { const g = D.grupoActual(), url = await BZ.url(g); if (E.cam && E.cam.qrListo) await E.cam.qrListo();
    E.print.run('<div class="pr bz-pr"><h1>📮 Buzón anónimo</h1><p class="bz-s">' + esc(g.nombre) + ' · Técnico en Mecatrónica</p>' + E.cam.qrSVG(url, 'bz-qrp', 'M') + '<p class="bz-t">Escanea y escribe <b>sin tu nombre</b>:<br>💡 sugerencias · ❓ dudas de la clase · 😟 algo que te preocupa · 👏 agradecimientos</p><p class="bz-n">Si estás en peligro o alguien te lastima, habla hoy con orientación o con un adulto de confianza.</p></div>', { title: 'Cartel del buzón' }); };

  /* ---------- 20 · auto y coevaluación del proyecto ---------- */
  const KC = g => 'coev:' + g.id;
  CO.CRIT = ['Aportó ideas y trabajo', 'Cumplió a tiempo lo que le tocó', 'Escuchó y respetó al equipo', 'Trabajó con seguridad y cuidó el material'];
  CO.ESC = ['Nunca', 'A veces', 'Casi siempre', 'Siempre'];
  CO.lista = g => (S.get(KC(g)) || []).filter(x => x && x.id);
  CO.equipos = g => { const PJ = E.proyecto; if (!PJ) return { pid: null, eqs: [] }; const p = C.parcialActual(), pid = PJ.canon ? PJ.canon(g, p.id) : p.id; return { pid: pid, eqs: (PJ.doc(g, pid).equipos || []).filter(e => (e.al || []).length) }; };
  CO.url = async (g, x) => { const Y = nube(), ini = n => (E.casa && E.casa.iniciales ? E.casa.iniciales(n) : String(n).slice(0, 3));
    const eq = x.eqs.map(e => [e.nombre, e.al.map(id => D.alumno(g, id)).filter(Boolean).map(a => [a.num, ini(a.nombre)])]);
    return pag() + await empaca({ v: 1, k: 'coe', o: Y ? Y.user.id : '', e: x.id, g: g.nombre, t: x.titulo, cr: x.crit, eq: eq }); };
  // resultados: { aid: { auto, pares, n, crit:[...] } } en escala 1 a 4
  CO.calcula = (g, x, rows) => {
    if (x.modo === 'mano') { const out = {}; Object.keys(x.manual || {}).forEach(aid => { const m = x.manual[aid]; out[aid] = { auto: m.auto === '' || m.auto == null ? null : Number(m.auto), pares: m.pares === '' || m.pares == null ? null : Number(m.pares), n: null }; }); return out; }
    const porNum = {}; D.alumnos(g).forEach(a => { porNum[a.num] = a; }); const acc = {};
    const ult = {}; (rows || []).forEach(r => { const v = r.resp || {}; if (v.de != null) ult[v.de] = v; }); // si alguien contestó dos veces cuenta la última
    Object.keys(ult).forEach(de => { const v = ult[de]; Object.keys(v.ev || {}).forEach(num => { const a = porNum[num]; if (!a) return; const s = (v.ev[num] || []).map(Number).filter(n => n >= 1 && n <= 4); if (!s.length) return; const p = s.reduce((x, y) => x + y, 0) / s.length, o = acc[a.id] = acc[a.id] || { auto: null, ps: [] }; if (String(num) === String(de)) o.auto = p; else o.ps.push(p); }); });
    const out = {}; Object.keys(acc).forEach(aid => { const o = acc[aid]; out[aid] = { auto: o.auto, pares: o.ps.length ? o.ps.reduce((x, y) => x + y, 0) / o.ps.length : null, n: o.ps.length }; }); return out;
  };
  const f1 = v => v == null ? '—' : (Math.round(v * 10) / 10).toFixed(1);
  CO.bandera = r => { if (!r) return ''; if (r.pares != null && r.pares < 2.5) return '<span class="chip sv-bad">Aportó poco según su equipo</span>'; if (r.auto != null && r.pares != null && r.auto - r.pares >= 1) return '<span class="chip sv-warn">Se sobrevalora</span>'; if (r.auto != null && r.pares != null && r.pares - r.auto >= 1) return '<span class="chip sv-ok">Se subestima</span>'; return ''; };
  V.coeval = id => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!D.alumnos(g).length) return H.needAlumnos('Coevaluación');
    const L = CO.lista(g), x = id && L.find(y => y.id === id), Y = nube();
    if (!x) {
      const q = CO.equipos(g);
      let h = card('<h3>🤝 Auto y coevaluación del proyecto</h3><p class="small">Cada alumno evalúa a los integrantes de su equipo y a sí mismo con 4 criterios (1 = nunca, 4 = siempre). Ves el promedio de sus compañeros, su autoevaluación y quién se sobrevalora, se subestima o aportó poco. Hecha al final de cada etapa grande ayuda a que todos trabajen (y a que tú veas lo que no se ve).</p>' +
        (q.eqs.length ? '<p class="small muted">Equipos del proyecto: ' + q.eqs.map(e => esc(e.nombre)).join(', ') + '.</p><div class="row gap wrap">' + (Y ? btn('＋ Nueva por QR', 'ce-nueva', 'data-m="nube"', 'primary') : '') + btn('＋ En papel', 'ce-nueva', 'data-m="mano"', Y ? 'small ghost' : 'primary') + '</div>' + (Y ? '' : sinNube) : '<p class="note">Primero arma los equipos en Proyecto.</p>' + link('Ir a Proyecto', 'proyecto', 'small')));
      if (L.length) h += card('<h3>📋 Tus coevaluaciones</h3><ul class="plain sv-l">' + L.map(y => '<li><a href="#/coeval/' + y.id + '"><b>' + esc(y.titulo) + '</b></a> <small class="muted">' + u.fCorta(y.f) + ' · ' + (y.modo === 'mano' ? 'papel' : 'QR') + (y.act ? ' · ya en calificaciones' : '') + '</small></li>').join('') + '</ul>');
      return { t: 'Coevaluación', h: h };
    }
    const res = x.modo === 'mano' ? CO.calcula(g, x) : (E.ui.ceRes || {})[x.id], al = x.eqs.map(e => ({ e: e, al: e.al.map(i => D.alumno(g, i)).filter(Boolean) }));
    let h = card('<div class="row between gap wrap"><h3>🤝 ' + esc(x.titulo) + '</h3>' + link('‹ Todas', 'coeval', 'small') + '</div><p class="small muted">' + u.fCorta(x.f) + ' · criterios: ' + esc(x.crit.join(' · ')) + '</p><div class="row gap wrap">' + (x.modo === 'mano' ? btn('🖨 Formatos por equipo', 'ce-formato', 'data-id="' + x.id + '"', 'small') : btn('📲 QR', 'ce-qr', 'data-id="' + x.id + '"', 'small primary') + btn('🔄 Ver respuestas', 'ce-lee', 'data-id="' + x.id + '"', 'small')) + (res ? btn(x.act ? '✓ Actualizar en calificaciones' : '➜ Pasar a calificaciones', 'ce-act', 'data-id="' + x.id + '"', 'small') : '') + '</div>');
    if (x.modo === 'mano') h += card('<h3>✍️ Captura (de 1 a 4)</h3><p class="small muted">Saca el promedio de cada formato: lo que le pusieron sus compañeros y lo que se puso él.</p>' + al.map(q => '<h4>' + esc(q.e.nombre) + '</h4><table class="fs-t ce-t"><tr><th>#</th><th>Alumno</th><th>Él mismo</th><th>Sus compañeros</th></tr>' + q.al.map(a => { const m = (x.manual || {})[a.id] || {}; return '<tr><td>' + a.num + '</td><td>' + esc(corto(a.nombre)) + '</td>' + ['auto', 'pares'].map(k => '<td><input class="inp" type="number" min="1" max="4" step="0.1" inputmode="decimal" data-ch="ce-man" data-id="' + x.id + '" data-aid="' + a.id + '" data-k="' + k + '" value="' + esc(m[k] == null ? '' : m[k]) + '" style="width:4.5em"></td>').join('') + '</tr>'; }).join('') + '</table>').join(''));
    if (res) h += card('<h3>📊 Resultados</h3>' + al.map(q => '<h4>' + esc(q.e.nombre) + '</h4><table class="fs-t ce-t"><tr><th>#</th><th>Alumno</th><th>Él mismo</th><th>Compañeros</th><th></th></tr>' + q.al.map(a => { const r = res[a.id]; return '<tr><td>' + a.num + '</td><td>' + esc(corto(a.nombre)) + '</td><td>' + f1(r && r.auto) + '</td><td><b>' + f1(r && r.pares) + '</b>' + (r && r.n != null ? ' <small class="muted">(' + r.n + ')</small>' : '') + '</td><td>' + CO.bandera(r) + '</td></tr>'; }).join('') + '</table>').join('') + '<p class="small muted">Escala de 1 a 4. Al pasarla a calificaciones cuenta el promedio de sus compañeros (4 = 100). «Se sobrevalora»: se puso 1 punto o más arriba de lo que le dio su equipo. Platica en privado con quien aportó poco antes de decidir.</p>');
    else if (x.modo !== 'mano') h += card('<p class="muted small">Cuando contesten, toca «Ver respuestas».</p>');
    return { t: 'Coevaluación', h: h };
  };
  A['ce-nueva'] = el => { const g = D.grupoActual(), q = CO.equipos(g); if (!q.eqs.length) return; const n = CO.lista(g).length + 1, x = { id: 'coe-' + u.uid('c').slice(-10), f: u.today(), pid: C.parcialActual().id, titulo: 'Coevaluación del proyecto ' + n, crit: CO.CRIT.slice(), modo: el.dataset.m, eqs: q.eqs.map(e => ({ nombre: e.nombre, al: e.al.slice() })), manual: {} };
    S.update(KC(g), L => { L.push(x); }, []); location.hash = '#/coeval/' + x.id; };
  const busca = (g, id) => CO.lista(g).find(y => y.id === id);
  A['ce-qr'] = async el => { const g = D.grupoActual(), x = busca(g, el.dataset.id); if (!x) return; const url = await CO.url(g, x); E.ui.ceUrl = url; if (E.cam && E.cam.qrListo) await E.cam.qrListo();
    E.modal.open('🤝 ' + esc(x.titulo), '<div class="c">' + E.cam.qrSVG(url, 'pj-qr', 'L') + '</div><p class="small">Cada alumno elige su número de lista y evalúa a su equipo (y a sí mismo). Tú ves quién evaluó a quién; sus compañeros no.</p><div class="row gap wrap">' + btn('📋 Copiar enlace', 'ce-copiar', '', 'primary') + btn('📽 Proyectar', 'ce-proj') + '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Probar</a></div>'); };
  A['ce-copiar'] = async () => { const ok = await u.copy('🤝 Coevaluación del proyecto: ' + E.ui.ceUrl); u.toast(ok ? 'Enlace copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['ce-proj'] = () => { if (!E.proj) return; E.modal.close(); E.proj.abrir({ id: 'coeval', titulo: 'Coevaluación' }, [{ k: 'html', h: '🤝 Evalúa a tu equipo', html: '<div class="pj-qrbox">' + E.cam.qrSVG(E.ui.ceUrl, 'pj-qr', 'L') + '<div><p>Elige tu número y evalúa con honestidad a cada integrante y a ti mismo.</p><p>Tus compañeros no ven lo que contestas.</p></div></div>' }]); };
  A['ce-lee'] = async el => { const g = D.grupoActual(), x = busca(g, el.dataset.id), Y = nube(); if (!x || !Y) return; const r = await Y.client.from('escuadra_encuesta').select('resp,creado').eq('encuesta', x.id).order('creado', { ascending: true }).limit(500); if (r.error) { u.toast(r.error.message, 'err', 4000); return; } E.ui.ceRes = E.ui.ceRes || {}; E.ui.ceRes[x.id] = CO.calcula(g, x, r.data); u.toast((r.data || []).length + ' respuestas', 'ok'); E.render(); };
  CH['ce-man'] = el => { const g = D.grupoActual(); S.update(KC(g), L => { const x = L.find(y => y.id === el.dataset.id); if (!x) return; const m = (x.manual = x.manual || {})[el.dataset.aid] = x.manual[el.dataset.aid] || {}; const v = el.value === '' ? '' : Math.max(1, Math.min(4, Number(el.value))); m[el.dataset.k] = v; }, []); };
  A['ce-act'] = el => { const g = D.grupoActual(), x = busca(g, el.dataset.id); if (!x) return; const res = x.modo === 'mano' ? CO.calcula(g, x) : (E.ui.ceRes || {})[x.id]; if (!res) return;
    const notas = {}; Object.keys(res).forEach(aid => { if (res[aid].pares != null) notas[aid] = Math.round(res[aid].pares / 4 * 100); });
    const id = x.act || u.uid('act'), pid = x.pid, cat = C.separa && C.separa(pid) ? 'proyecto' : 'trabajos', k = 'act:' + g.id + ':' + id, prev = S.get(k) || {};
    S.put(k, Object.assign({}, prev, { id: id, parcial: pid, categoria: prev.categoria || cat, nombre: x.titulo, peso: prev.peso || 1, max: 100, fecha: prev.fecha || x.f, notas: Object.assign({}, prev.notas || {}, notas), instrumento: 'Coevaluación' }));
    S.update(KC(g), L => { const y = L.find(z => z.id === x.id); if (y) y.act = id; }, []); u.toast('Quedó como actividad «' + x.titulo + '» del ' + (C.parcial(pid) || {}).nombre, 'ok', 3500); };
  A['ce-formato'] = el => { const g = D.grupoActual(), x = busca(g, el.dataset.id); if (!x) return;
    E.print.run(x.eqs.map(e => { const al = e.al.map(i => D.alumno(g, i)).filter(Boolean); return al.map(ev => '<div class="pr ce-pr"><h2>🤝 ' + esc(x.titulo) + ' · ' + esc(e.nombre) + '</h2><p class="fs-sub">Quien evalúa: <b>' + esc(ev.nombre) + '</b> (núm. ' + ev.num + ') · 1 = nunca · 2 = a veces · 3 = casi siempre · 4 = siempre</p><table class="fs-t"><tr><th>Criterio</th>' + al.map(a => '<th>' + (a.id === ev.id ? 'Yo' : esc(corto(a.nombre).split(' ')[0])) + '</th>').join('') + '</tr>' + x.crit.map(c => '<tr><td style="text-align:left">' + esc(c) + '</td>' + al.map(() => '<td style="height:26px"></td>').join('') + '</tr>').join('') + '</table></div>').join(''); }).join(''), { title: 'Formatos de coevaluación' }); };
})();

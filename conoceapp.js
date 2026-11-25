/* Escuadra · «Conócete» en la app (v1.42.0): 6 estudios cortos (estudio, mentalidad, emociones, razonamiento, confianza
   en mecatrónica y nervios en los exámenes). Los alumnos los contestan en su celular (conocete.html, con QR) y al final
   enseñan un QR (o códigos) con sus puntajes; aquí se escanean o se escriben. Para cada estudio: qué mide, qué no mide,
   cómo leerlo y cómo ayudarlos; resumen del grupo, mapa por alumno, a quién acercarte (solo lo ves tú) y su ficha. */
(function () {
  'use strict';
  const E = window.E, S = E.store, D = E.data, u = E.u, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn;
  const CN = E.conoce = {}, K = g => 'cono:' + g.id, X = () => window.CONO;
  const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const base = pag => location.href.split('#')[0].split('?')[0].replace(/[^/]*$/, '') + pag;
  const b64 = o => { const by = new TextEncoder().encode(JSON.stringify(o)); let s = ''; by.forEach(x => { s += String.fromCharCode(x); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  CN.doc = g => Object.assign({ gen: {}, res: {} }, S.get(K(g)) || {});
  CN.sal = (g, f) => hash(g.id + '|cono|' + f).toString(16);
  CN.url = (g, t) => { const f = u.today(); S.update(K(g), d => { d.gen = d.gen || {}; d.gen[f] = 1; }, {}); return base('conocete.html') + '#j' + b64({ v: 1, k: 'cono', g: g.nombre, c: CN.sal(g, f), t: t || '' }); };
  CN.sales = g => Object.keys(CN.doc(g).gen || {}).sort().reverse().map(f => [f, CN.sal(g, f)]);
  CN.verifica = (g, a, cod, c) => { for (const z of CN.sales(g)) { if (c && z[1] !== c) continue; const o = X().lee(z[1], a.num, cod); if (o) return Object.assign({ f: z[0] }, o); } return null; };
  CN.res = (g, aid) => (CN.doc(g).res || {})[aid] || {};
  const guarda = (g, a, o, src) => S.update(K(g), d => { d.res = d.res || {}; const r = d.res[a.id] = d.res[a.id] || {}; r[o.id] = { s: o.s, f: o.f || u.today(), src: src, reg: u.today() }; }, {});
  const activos = g => D.alumnos(g).filter(a => a.activo !== false);

  /* ---------- lectura de resultados ---------- */
  const T = id => X().test(id);
  const nv = (id, d, s) => X().nivel(id, d, s);
  CN.resumen = (id, s) => { const t = T(id);
    if (id === 'razon') { const tot = s.reduce((a, b) => a + b, 0), fu = s.indexOf(Math.max.apply(null, s)); return { txt: tot + '/16 · fuerte: ' + t.dims[fu].n.toLowerCase(), cls: '' }; }
    if (id === 'estudio') { const w = [0, 1, 2].map(i => [X().prop(id, i, s[i]), i]).sort((a, b) => a[0] - b[0])[0][1]; return { txt: 'trabajar: ' + t.dims[w].n.toLowerCase(), cls: nv(id, 3, s[3]) === 2 && nv(id, 0, s[0]) === 0 ? 'warn' : '' }; }
    if (id === 'mente') { const l = nv(id, 0, s[0]); return { txt: ['fija', 'mixta', 'de crecimiento'][l], cls: l === 0 ? 'warn' : l === 2 ? 'ok' : '' }; }
    if (id === 'emoc') { const ls = s.map((v, i) => nv(id, i, v)); return { txt: t.dims.map((dm, i) => dm.n[0] + ['↓', '·', '↑'][ls[i]]).join(' '), cls: ls[2] === 0 ? 'warn' : '' }; }
    if (id === 'confianza') { const w = s.indexOf(Math.min.apply(null, s)); return { txt: 'menos: ' + t.dims[w].ico + ' ' + t.dims[w].n.split(' ')[0].toLowerCase(), cls: s.reduce((a, b) => a + b, 0) / (8 * 6) < 0.35 ? 'warn' : '' }; }
    if (id === 'nervios') { const l = Math.max(nv(id, 0, s[0]), nv(id, 1, s[1])); return { txt: ['bajos', 'medios', 'altos'][l], cls: l === 2 && nv(id, 0, s[0]) === 2 && nv(id, 1, s[1]) === 2 ? 'warn' : '' }; }
    return { txt: '—', cls: '' }; };
  // a quién acercarte (solo para el profe)
  CN.alertas = (id, s) => { const L = (d) => nv(id, d, s[d]), out = [];
    if (id === 'estudio' && L(0) === 0 && L(3) === 2) out.push('Estudia releyendo y casi no se pone a prueba');
    if (id === 'mente' && L(0) === 0) out.push('Cree que no puede mejorar («no soy bueno para eso»)');
    if (id === 'emoc') { if (L(2) === 0) out.push('Le cuesta calmarse y recuperarse'); if (L(0) === 2 && L(1) === 0) out.push('Le da vueltas a lo que siente sin entenderlo'); }
    if (id === 'confianza' && s.reduce((a, b) => a + b, 0) / 48 < 0.35) out.push('Poca confianza en casi todas las áreas');
    if (id === 'nervios' && L(0) === 2 && L(1) === 2) out.push('Nervios muy altos en los exámenes');
    return out; };

  /* ---------- QR, escaneo y códigos ---------- */
  A['cx-qr'] = async el => {
    const g = D.grupoActual(), t = (el && el.dataset.t) || ''; if (E.cam && E.cam.qrListo) await E.cam.qrListo(); const url = CN.url(g, t); E.ui.cnUrl = url; E.ui.cnT = t;
    const tt = t ? T(t) : null;
    E.modal.open('🪞 Conócete' + (tt ? ' · ' + tt.t : ''), '<div class="ca-qr">' + (E.cam ? E.cam.qrSVG(url, 'ca-qrsvg', 'L') : '') + '<p class="small muted">' + (tt ? 'Abre directo «' + esc(tt.t) + '» (' + tt.items.length + ' preguntas, ' + tt.dur + ').' : 'Abre el menú con los ' + X().T.length + ' estudios.') + ' Sin cuenta. Al terminar les sale un QR con sus puntajes para que lo escanees.</p></div>' +
      '<div class="row gap wrap">' + btn('📋 Copiar enlace', 'cx-copiar', '', 'primary') + '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Probar</a>' + btn('📽 Proyectar QR', 'cx-proj', '', '') + '</div>'); };
  A['cx-copiar'] = async () => { const ok = await u.copy(E.ui.cnUrl || ''); u.toast(ok ? 'Enlace copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['cx-proj'] = () => { if (!E.proj || !E.ui.cnUrl) return; E.modal.close(); const tt = E.ui.cnT ? T(E.ui.cnT) : null;
    E.proj.abrir({ id: 'cono-qr', titulo: 'Conócete' }, [{ k: 'html', h: '🪞 Conócete' + (tt ? ' · ' + tt.t : ''), html: '<div class="pj-qrbox">' + E.cam.qrSVG(E.ui.cnUrl, 'pj-qr', 'L') + '<div><p>Escanea con tu celular y contesta con calma y honestidad. No es examen y no cuenta para tu calificación: es para conocerte y aprender mejor.</p><p>Al terminar, escribe tu número de lista y enséñame tu QR.</p></div></div>' }]); };
  // registra lo que trae un QR de alumno: ESCC1|c|num|códigos
  CN.aplica = (g, txt) => { const q = X().leeQR(txt); if (!q) return { err: 'Ese QR no es de Conócete' };
    if (!CN.sales(g).some(z => z[1] === q.c)) return { err: 'Ese QR es de otro grupo o de un enlace que no generaste aquí' };
    const a = activos(g).find(x => Number(x.num) === q.num); if (!a) return { err: 'No hay alumno con el número ' + q.num };
    let n = 0; q.cods.forEach(cod => { const o = CN.verifica(g, a, cod, q.c); if (o) { guarda(g, a, o, 'qr'); n++; } });
    return n ? { a: a, n: n } : { err: 'Los códigos no coinciden con el número ' + q.num }; };
  A['cx-scan'] = async () => {
    const g = D.grupoActual(); if (!activos(g).length) { u.toast('Primero importa tu lista', 'err'); return; } if (!CN.sales(g).length) { u.toast('Primero genera el QR del estudio', 'err'); return; }
    E.modal.close(); const leer = await E.cam.lectorQR(), vis = {}, log = [];
    const panel = () => '<p class="small">' + (log.length ? log.slice(0, 4).map(x => esc(x)).join('<br>') : 'Acerca el QR del celular de cada alumno.') + '</p>';
    E.cam.abrir({ titulo: '🪞 Conócete · resultados', guia: 'qr', cada: 150, proc: 900, panel: panel, alCerrar: () => { if (E.render) E.render(); },
      frame: async (c, ctx, W, Hh) => { const r = await leer(c, ctx, W, Hh), out = [];
        r.forEach(x => { if (vis[x.txt] && Date.now() - vis[x.txt] < 4000) { out.push({ pts: x.pts, label: '✓', color: '#1c7c45' }); return; } vis[x.txt] = Date.now();
          const res = CN.aplica(g, x.txt); if (res.err) { out.push({ pts: x.pts, label: '?', color: '#bf342b' }); u.toast(res.err, 'err', 2500); E.cam.bip(false); }
          else { out.push({ pts: x.pts, label: '✓', color: '#1c7c45' }); log.unshift('✓ ' + res.a.num + '. ' + u.corto(res.a.nombre) + ' · ' + res.n + ' estudio' + (res.n > 1 ? 's' : '')); E.cam.bip(true); E.cam.panel(); } });
        return out; } }); };
  const fila = (g, a) => { const r = CN.res(g, a.id), hechos = X().T.filter(t => r[t.id]);
    return '<li><div><b>' + a.num + '. ' + esc(u.corto(a.nombre)) + '</b><br><small class="muted" id="cx-r-' + a.id + '">' + (hechos.length ? hechos.map(t => t.ico).join(' ') : 'Sin resultados') + '</small></div><input class="inp" style="max-width:120px;text-align:center;text-transform:uppercase" maxlength="10" placeholder="Código" data-ch="cx-cod" data-aid="' + a.id + '" aria-label="Código de ' + esc(a.nombre) + '"></li>'; };
  A['cx-reg'] = () => { const g = D.grupoActual();
    E.modal.open('✍️ Escribir códigos de Conócete', '<p class="small">Escribe junto a cada alumno un código (empieza con la letra del estudio). Si trae varios, escríbelos uno por uno en la misma casilla.</p>' + (CN.sales(g).length ? '' : '<p class="note warn small">Primero genera el QR: los códigos se reconocen por el enlace.</p>') + '<ul class="ap-list">' + activos(g).map(a => fila(g, a)).join('') + '</ul>'); };
  CH['cx-cod'] = el => { const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid), cod = el.value.trim(); if (!a || !cod) return;
    const o = CN.verifica(g, a, cod); if (!o) { u.toast('El código ' + cod + ' no es de ' + u.corto(a.nombre) + '. Revisa el número de lista o el código.', 'err', 4500); if (el.select) el.select(); return; }
    guarda(g, a, o, 'cod'); el.value = ''; const sm = document.getElementById('cx-r-' + a.id), r = CN.res(g, a.id); if (sm) sm.textContent = X().T.filter(t => r[t.id]).map(t => t.ico).join(' ');
    u.toast('✓ ' + a.num + '. ' + u.corto(a.nombre) + ' · ' + T(o.id).t, 'ok', 2500); };

  /* ---------- impresos ---------- */
  A['cx-aviso'] = () => { const g = D.grupoActual(), cf = D.cfg(), t = X().T;
    E.print.run('<div class="pr cx-pr"><h2>Aviso a madres, padres y tutores</h2><p class="cx-sub">' + esc((cf.plantel || 'CETAC 19') + ' · Técnico en Mecatrónica · Grupo ' + g.nombre) + '</p>' +
      '<p>Estimadas familias: en clase, sus hijos contestarán de forma <b>voluntaria</b> algunos estudios cortos para conocerse mejor y aprender mejor:</p><ul>' + t.map(x => '<li><b>' + esc(x.t) + '</b>: ' + esc(x.guia.mide) + '</li>').join('') + '</ul>' +
      '<p><b>Importante:</b> son autoevaluaciones para orientar y apoyar, <b>no son exámenes ni diagnósticos psicológicos</b> y no cuentan para la calificación. Los resultados son confidenciales: solo los ve el docente para ayudar a su hijo o hija a estudiar mejor, y no se comparten con el grupo. Si algún resultado lo amerita, se platicará con ustedes y con orientación.</p>' +
      '<p>Si no desean que su hijo o hija participe, por favor indíquenlo en el talón.</p><p class="cx-firma">' + esc(cf.docente || '') + '<br>Docente</p>' +
      '<div class="cx-talon"><p>✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</p><p>Alumno(a): _________________________________________ Grupo: ' + esc(g.nombre) + '</p><p>☐ Sí autorizo que participe &nbsp;&nbsp; ☐ No autorizo</p><p>Nombre y firma de la madre, padre o tutor: _________________________________</p></div></div>', { title: 'Aviso de Conócete · ' + g.nombre, unaHoja: true }); };
  A['cx-imp'] = () => { const g = D.grupoActual(), al = activos(g);
    const filas = al.map(a => { const r = CN.res(g, a.id); return '<tr><td>' + a.num + '</td><td>' + esc(u.corto(a.nombre)) + '</td>' + X().T.map(t => { const z = r[t.id]; if (!z) return '<td></td>'; const s = CN.resumen(t.id, z.s); return '<td' + (s.cls === 'warn' ? ' class="cx-w"' : '') + '>' + esc(s.txt) + '</td>'; }).join('') + '</tr>'; }).join('');
    const ale = al.map(a => { const r = CN.res(g, a.id), L = []; X().T.forEach(t => { if (r[t.id]) CN.alertas(t.id, r[t.id].s).forEach(x => L.push(x)); }); return L.length ? '<li><b>' + a.num + '. ' + esc(u.corto(a.nombre)) + ':</b> ' + esc(L.join(' · ')) + '</li>' : ''; }).join('');
    E.print.run('<div class="pr cx-pr"><h2>Conócete · resultados del grupo ' + esc(g.nombre) + '</h2><p class="cx-sub">CONFIDENCIAL · solo para el docente · ' + esc(u.fLarga(u.today())) + '</p><table class="cx-t"><thead><tr><th>No.</th><th>Alumno</th>' + X().T.map(t => '<th>' + t.ico + ' ' + esc(t.t.split(':')[0]) + '</th>').join('') + '</tr></thead><tbody>' + filas + '</tbody></table>' +
      (ale ? '<h3>A quién acercarte</h3><ul>' + ale + '</ul>' : '') + '<p class="cx-sub">Son autoevaluaciones orientativas, no diagnósticos. ' + esc(X().FUENTE) + '</p></div>', { title: 'Conócete · ' + g.nombre, landscape: true }); };

  /* ---------- ficha del alumno ---------- */
  const barra = (lbl, p, mala) => '<div class="cx-bar"><span>' + esc(lbl) + '</span><span class="t"><i class="' + (mala ? 'm' : '') + '" style="width:' + Math.round(p * 100) + '%"></i></span><b>' + Math.round(p * 100) + '%</b></div>';
  CN.detalle = (id, s) => { const t = T(id);
    if (t.raz) return t.dims.map((dm, i) => '<div class="cx-bar"><span>' + esc(dm.n) + '</span><span class="t"><i style="width:' + (s[i] / 4 * 100) + '%"></i></span><b>' + s[i] + '/4</b></div>').join('');
    return t.dims.map((dm, i) => barra((dm.ico ? dm.ico + ' ' : '') + dm.n, X().prop(id, i, s[i]), dm.bueno === false)).join(''); };
  CN.fichaHTML = (g, a) => { const r = CN.res(g, a.id), hs = X().T.filter(t => r[t.id]); if (!hs.length) return '';
    return card('<h3>🪞 Conócete</h3>' + hs.map(t => { const z = r[t.id], al = CN.alertas(t.id, z.s); return '<details class="sub"><summary>' + t.ico + ' <b>' + esc(t.t) + '</b> · ' + esc(CN.resumen(t.id, z.s).txt) + (al.length ? ' ⚠️' : '') + '</summary>' + CN.detalle(t.id, z.s) + (al.length ? '<p class="small"><b>Acércate:</b> ' + esc(al.join(' · ')) + '</p>' : '') + '<p class="muted small">' + esc(u.fCorta(z.f)) + '</p></details>'; }).join('') + '<p class="muted small">Confidencial. Es cómo se ve el alumno a sí mismo, no un diagnóstico.</p>'); };
  if (V.alumno && E.fichaInsert) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) { const c = CN.fichaHTML(g, a); if (c) o.h = E.fichaInsert(o.h, c); } return o; }; }

  /* ---------- pantalla ---------- */
  const grupoTest = (g, t) => { const al = activos(g), con = al.filter(a => CN.res(g, a.id)[t.id]); if (!con.length) return '<p class="small muted">Nadie lo ha contestado todavía.</p>';
    const ss = con.map(a => CN.res(g, a.id)[t.id].s);
    let h = '<p class="small"><b>' + con.length + ' de ' + al.length + '</b> lo contestaron.</p>';
    h += t.dims.map((dm, i) => { const ps = ss.map(s => t.raz ? s[i] / 4 : X().prop(t.id, i, s[i])), avg = ps.reduce((a, b) => a + b, 0) / ps.length, cnt = [0, 0, 0]; ss.forEach(s => { cnt[nv(t.id, i, s[i])]++; });
      return '<div class="cx-bar"><span>' + esc((dm.ico ? dm.ico + ' ' : '') + dm.n) + '</span><span class="t"><i class="' + (dm.bueno === false ? 'm' : '') + '" style="width:' + Math.round(avg * 100) + '%"></i></span><b>' + Math.round(avg * 100) + '%</b></div><p class="cx-cnt">bajo ' + cnt[0] + ' · medio ' + cnt[1] + ' · alto ' + cnt[2] + '</p>'; }).join('');
    const ale = con.map(a => ({ a: a, L: CN.alertas(t.id, CN.res(g, a.id)[t.id].s) })).filter(x => x.L.length);
    if (ale.length) h += '<details class="sub"><summary class="small">🔒 A quién acercarte (' + ale.length + ')</summary><ul class="small">' + ale.map(x => '<li><a href="#/alumno/' + x.a.id + '">' + x.a.num + '. ' + esc(u.corto(x.a.nombre)) + '</a>: ' + esc(x.L.join(' · ')) + '</li>').join('') + '</ul></details>';
    if (t.id === 'razon') { const fu = t.dims.map((dm, i) => ({ n: dm.n, al: con.filter(a => CN.res(g, a.id).razon.s[i] === 4) })); h += '<p class="small"><b>Fuertes (4/4):</b> ' + fu.filter(x => x.al.length).map(x => esc(x.n) + ': ' + x.al.map(a => a.num).join(', ')).join(' · ') + '</p>'; }
    return h; };
  V.conocete = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!X()) return { t: 'Conócete', h: card('<p>No se cargaron los estudios.</p>') };
    const al = activos(g), tt = X().T;
    let h = card('<h3>🪞 Conócete: estudios para aprender mejor</h3><p class="small">' + tt.length + ' estudios cortos que contestan en su celular. Al terminar ven sus resultados con consejos y te enseñan un QR con sus puntajes.</p>' +
      '<div class="row gap wrap">' + btn('📱 QR de todos los estudios', 'cx-qr', '', 'primary') + btn('📷 Escanear resultados', 'cx-scan', '', '') + btn('✍️ Escribir códigos', 'cx-reg', '', 'ghost') + btn('🖨 Aviso para padres', 'cx-aviso', '', 'ghost') + '</div>' +
      '<p class="muted small">Recomendado: uno o dos por clase, al inicio (5 a 15 min). Antes, manda el aviso a los padres. Diles que no hay respuestas buenas ni malas y que no cuenta para su calificación. Los resultados son confidenciales: nunca los comentes frente al grupo.</p>');
    // mapa del grupo
    const conAlgo = al.filter(a => Object.keys(CN.res(g, a.id)).length);
    h += card('<h3>🗺️ Mapa del grupo</h3>' + (conAlgo.length ? '<div class="tbl-wrap"><table class="cx-t"><thead><tr><th>Alumno</th>' + tt.map(t => '<th title="' + esc(t.t) + '">' + t.ico + '</th>').join('') + '</tr></thead><tbody>' +
      al.map(a => { const r = CN.res(g, a.id); return '<tr><td><a href="#/alumno/' + a.id + '">' + a.num + '. ' + esc(u.corto(a.nombre)) + '</a></td>' + tt.map(t => { const z = r[t.id]; if (!z) return '<td class="muted">·</td>'; const s = CN.resumen(t.id, z.s); return '<td class="' + (s.cls === 'warn' ? 'cx-w' : s.cls === 'ok' ? 'cx-ok' : '') + '">' + esc(s.txt) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' +
      '<div class="row gap wrap mt">' + btn('🖨 Resultados del grupo (confidencial)', 'cx-imp', '', 'small ghost') + '</div><p class="muted small">En amarillo, lo que conviene revisar con ese alumno. Toca su nombre para ver el detalle en su ficha.</p>' : '<p class="small muted">Aquí verás a cada alumno con su resumen de cada estudio, cuando registres resultados.</p>'));
    // cada estudio: guía para el profe + resumen del grupo
    tt.forEach(t => { const gu = t.guia;
      h += card('<div class="row between gap wrap"><h3>' + t.ico + ' ' + esc(t.t) + '</h3>' + btn('📱 QR solo de este', 'cx-qr', 'data-t="' + t.id + '"', 'small') + '</div><p class="small muted">' + t.items.length + ' preguntas · ' + t.dur + '</p>' +
        '<details class="sub"><summary>📖 Qué significa y cómo ayudarlos</summary><p class="small"><b>Qué mide:</b> ' + esc(gu.mide) + '</p><p class="small"><b>Qué NO mide:</b> ' + esc(gu.noMide) + '</p><p class="small"><b>Cómo leerlo:</b> ' + esc(gu.leer) + '</p><p class="small"><b>Cómo ayudarlos a aprender mejor:</b></p><ul class="small">' + gu.ayudar.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p class="muted small">Fuente: ' + esc(gu.fuente) + '</p></details>' +
        grupoTest(g, t)); });
    h += card('<h3>Fuentes</h3><p class="small">' + esc(X().FUENTE) + '</p><p class="muted small">Si quieres una evaluación formal (por ejemplo de inteligencia o de ansiedad), esa la hace un psicólogo con pruebas estandarizadas: canaliza con orientación.</p>');
    return { t: 'Conócete', h: h };
  };
})();

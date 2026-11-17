/* Escuadra · Test de vida y carrera en la app (v1.37.0). Los alumnos lo contestan en su celular (vida.html, con QR) o
   impreso. Al terminar, el celular les da un código de 8 caracteres con sus puntajes de intereses (RIASEC), sus 2 fortalezas
   y sus 2 áreas de la mecatrónica; aquí se captura (o se escribe a mano lo del impreso) y sale en su ficha y en el resumen
   del grupo, con una propuesta de equipos que mezcla perfiles. El proyecto de vida se queda con el alumno. */
(function () {
  const E = window.E, S = E.store, D = E.data, u = E.u, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h, card = H.card, btn = H.btn;
  const VD = E.vida = {}, K = g => 'vida:' + g.id, X = () => window.VIDA;
  const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const base = pag => location.href.split('#')[0].split('?')[0].replace(/[^/]*$/, '') + pag;
  const b64 = o => { const by = new TextEncoder().encode(JSON.stringify(o)); let s = ''; by.forEach(x => { s += String.fromCharCode(x); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  VD.doc = g => Object.assign({ gen: {}, res: {} }, S.get(K(g)) || {});
  VD.sal = (g, f) => hash(g.id + '|vida|' + f).toString(16);
  VD.url = g => { const f = u.today(); S.update(K(g), d => { d.gen = d.gen || {}; d.gen[f] = 1; }, {}); return base('vida.html') + '#j' + b64({ v: 1, k: 'vida', g: g.nombre, c: VD.sal(g, f) }); };
  VD.verifica = (g, a, cod) => { for (const f of Object.keys(VD.doc(g).gen || {}).sort().reverse()) { const o = X().lee(VD.sal(g, f), a.num, cod); if (o) return Object.assign({ f: f }, o); } return null; };
  VD.res = (g, aid) => (VD.doc(g).res || {})[aid] || null;
  VD.con = g => D.alumnos(g).filter(a => VD.res(g, a.id));
  const guardaRes = (g, a, o, src) => S.update(K(g), d => { d.res = d.res || {}; d.res[a.id] = { f: o.f || u.today(), r: o.r, h: o.h, a: o.a, src: src, reg: u.today() }; }, {});
  const hol = r => X().codigoHolland(r);
  const perfilTxt = r => hol(r.r) + ' · ' + r.h.map(i => X().HAB[i].n).join(', ') + ' · ' + r.a.map(i => X().AREAS[i].n).join(', ');

  /* ---------- QR y códigos ---------- */
  A['vida-qr'] = async () => {
    const g = D.grupoActual(); if (E.cam && E.cam.qrListo) await E.cam.qrListo(); const url = VD.url(g); E.ui.vidaUrl = url;
    E.modal.open('🧭 Test de vida y carrera', '<div class="ca-qr">' + (E.cam ? E.cam.qrSVG(url, 'ca-qrsvg', 'L') : '') + '<p class="small muted">Lo contestan en su celular en unos 20 minutos, sin cuenta. Al final les da un código de 8 caracteres que capturas en «Registrar códigos». Su proyecto de vida se queda solo en su celular.</p></div>' +
      '<div class="row gap wrap">' + btn('📋 Copiar enlace', 'vida-copiar', '', 'primary') + '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Probar</a>' + btn('📽 Proyectar QR', 'vida-proj', '', '') + '</div>');
  };
  A['vida-copiar'] = async () => { const ok = await u.copy(E.ui.vidaUrl || ''); u.toast(ok ? 'Enlace copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['vida-proj'] = () => { if (!E.proj || !E.ui.vidaUrl) return; E.modal.close(); E.proj.abrir({ id: 'vida-qr', titulo: 'Test de vida y carrera' }, [{ k: 'html', h: '🧭 Test de vida y carrera', html: '<div class="pj-qrbox">' + E.cam.qrSVG(E.ui.vidaUrl, 'pj-qr', 'L') + '<div><p>Escanea con tu celular y contesta con calma y honestidad. No es examen: es para conocerte. Al final, guarda tu código para el profe.</p></div></div>' }]); };
  const fila = (g, a) => { const r = VD.res(g, a.id);
    return '<li><div><b>' + a.num + '. ' + esc(u.corto(a.nombre)) + '</b><br><small class="muted" id="vd-r-' + a.id + '">' + (r ? '✓ ' + esc(perfilTxt(r)) : 'Sin código') + '</small></div><input class="inp" style="max-width:120px;text-align:center;text-transform:uppercase" maxlength="9" placeholder="XXXX-XXXX" data-ch="vida-cod" data-aid="' + a.id + '" aria-label="Código de ' + esc(a.nombre) + '"></li>'; };
  A['vida-reg'] = () => { const g = D.grupoActual();
    E.modal.open('✅ Códigos del test de vida y carrera', '<p class="small">Escribe junto a cada alumno el código de 8 caracteres que le dio su celular.</p>' + (Object.keys(VD.doc(g).gen || {}).length ? '' : '<p class="note warn small">Primero genera el QR: los códigos se reconocen por el enlace.</p>') +
      '<ul class="ap-list">' + D.alumnos(g).map(a => fila(g, a)).join('') + '</ul>'); };
  CH['vida-cod'] = el => {
    const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid), cod = el.value.trim(); if (!a || !cod) return;
    const o = VD.verifica(g, a, cod); if (!o) { u.toast('El código ' + cod + ' no es de ' + u.corto(a.nombre) + '. Revisa el número de lista o el código.', 'err', 4500); if (el.select) el.select(); return; }
    guardaRes(g, a, o, 'qr'); el.value = ''; const sm = document.getElementById('vd-r-' + a.id); if (sm) sm.textContent = '✓ ' + perfilTxt(o);
    u.toast('✓ ' + a.num + '. ' + u.corto(a.nombre) + ' · ' + hol(o.r), 'ok', 2500);
    const li = el.closest('li'), sig = li && li.nextElementSibling && li.nextElementSibling.querySelector('input'); if (sig) sig.focus();
  };
  // capturar a mano lo del test impreso
  A['vida-mano'] = () => { const g = D.grupoActual(), al = D.alumnos(g), x = X();
    const sel = (id, L) => '<select class="inp" id="' + id + '">' + L.map((t, i) => '<option value="' + i + '">' + esc(t) + '</option>').join('') + '</select>';
    E.modal.open('✍️ Capturar el test impreso', '<label class="fld"><span>Alumno</span><select class="inp" id="vm-a">' + al.map(a => '<option value="' + a.id + '">' + a.num + '. ' + esc(u.corto(a.nombre)) + '</option>').join('') + '</select></label>' +
      '<p class="small"><b>Intereses</b> (cuántas marcó de cada letra, 0 a 10)</p><div class="vd-rin">' + x.RIASEC.map((r, i) => '<label><span>' + r.k + ' · ' + esc(r.n) + '</span><input class="inp" type="number" min="0" max="10" id="vm-r' + i + '" inputmode="numeric"></label>').join('') + '</div>' +
      '<div class="fgrid"><label class="fld"><span>Fortaleza 1</span>' + sel('vm-h0', x.HAB.map(h => h.n)) + '</label><label class="fld"><span>Fortaleza 2</span>' + sel('vm-h1', x.HAB.map(h => h.n)) + '</label>' +
      '<label class="fld"><span>Área de mecatrónica 1</span>' + sel('vm-a0', x.AREAS.map(a => a.n)) + '</label><label class="fld"><span>Área de mecatrónica 2</span>' + sel('vm-a1', x.AREAS.map(a => a.n)) + '</label></div>' + btn('Guardar', 'vida-mano-ok', '', 'primary')); };
  A['vida-mano-ok'] = () => { const g = D.grupoActual(), v = id => (document.getElementById(id) || {}).value, a = D.alumno(g, v('vm-a')); if (!a) return;
    const r = [0, 1, 2, 3, 4, 5].map(i => Math.max(0, Math.min(10, parseInt(v('vm-r' + i), 10) || 0))); if (!r.some(Boolean)) { u.toast('Escribe los puntajes de intereses', 'err'); return; }
    guardaRes(g, a, { r: r, h: [+v('vm-h0'), +v('vm-h1')], a: [+v('vm-a0'), +v('vm-a1')] }, 'mano'); u.toast('✓ ' + a.num + '. ' + u.corto(a.nombre) + ' · ' + hol(r), 'ok'); };

  /* ---------- equipos con perfiles mezclados ---------- */
  VD.equipos = (g, n) => { const al = VD.con(g).map(a => ({ a: a, r: VD.res(g, a.id) })).sort((p, q) => hol(p.r.r) < hol(q.r.r) ? -1 : 1), k = Math.max(1, Math.ceil(al.length / (n || 4))), eq = Array.from({ length: k }, () => []);
    al.forEach((x, i) => { const ronda = Math.floor(i / k), j = ronda % 2 ? k - 1 - (i % k) : i % k; eq[j].push(x); }); return eq; };
  A['vida-eq'] = el => { const g = D.grupoActual(), n = Number(el.dataset.n || 4), eq = VD.equipos(g, n), x = X();
    if (!eq.length || !eq[0].length) { u.toast('Primero registra códigos', 'err'); return; }
    E.modal.open('👥 Equipos con perfiles mezclados', '<p class="small muted">Cada equipo junta intereses y fortalezas distintas, y a cada quien le toca el rol de su fortaleza principal.</p><div class="row gap wrap">' + [3, 4, 5].map(k => btn(k + ' por equipo', 'vida-eq', 'data-n="' + k + '"', 'small' + (k === n ? ' on' : ''))).join('') + '</div>' +
      eq.map((e, i) => '<h4 class="mt">Equipo ' + (i + 1) + '</h4><ul class="small">' + e.map(y => '<li><b>' + y.a.num + '. ' + esc(u.corto(y.a.nombre)) + '</b> · ' + hol(y.r.r) + ' · ' + esc(x.HAB[y.r.h[0]].rol) + '</li>').join('') + '</ul>').join('') +
      '<p class="small muted">Quien no ha hecho el test no aparece: agrégalo a mano al equipo más chico.</p>'); };

  /* ---------- impresos ---------- */
  A['vida-imp'] = () => { const x = X(), cf = D.cfg();
    const p1 = '<div class="bt-pg"><div class="pr vd-p"><h1>Test de vida y carrera</h1><p class="tiny">Nombre: ______________________________ Grupo: ______ No. ____ Fecha: ____________</p>' +
      '<h2>1. ¿Qué te gustaría hacer?</h2><p class="tiny">Marca ✓ las actividades que te GUSTARÍA hacer como trabajo. No pienses en si sabes hacerlas, cuánto pagan o qué hay que estudiar. Al final cuenta tus ✓ de cada sección.</p><div class="vd-cols">' +
      'RIASEC'.split('').map((k, i) => '<div class="vd-sec"><div class="vd-sh"><b>' + k + '</b><span>Total: ____</span></div>' + x.ACT[k].map(t => '<div class="vd-it">☐ ' + esc(t) + '</div>').join('') + '</div>').join('') + '</div></div></div>';
    const p2 = '<div class="bt-pg"><div class="pr vd-p"><h2>2. ¿En qué eres bueno?</h2><p class="tiny">Encierra el número: 1 = nada como yo · 5 = totalmente como yo. Al final saca el promedio de cada bloque y marca tus 2 más altos.</p><div class="vd-cols">' +
      x.HAB.map(h => '<div class="vd-sec"><div class="vd-sh"><b>' + esc(h.n) + '</b><span>Promedio: ____</span></div>' + h.it.map(t => '<div class="vd-hi"><span>' + esc(t) + '</span><span class="vd-esc">1 2 3 4 5</span></div>').join('') + '</div>').join('') + '</div>' +
      '<h2>3. ¿Qué parte de la mecatrónica te llama?</h2><p class="tiny">Marca ✓ lo que te gustaría hacer y cuenta por área.</p><div class="vd-cols3">' + x.AREAS.map(a => '<div class="vd-sec"><div class="vd-sh"><b>' + a.ico + ' ' + esc(a.n) + '</b><span>____</span></div>' + a.it.map(t => '<div class="vd-it">☐ ' + esc(t) + '</div>').join('') + '</div>').join('') + '</div>' +
      '<div class="vd-res"><b>Mis resultados:</b> R ___ I ___ A ___ S ___ E ___ C ___ · Mi código (3 letras más altas): ________ · Fortalezas: ____________ y ____________ · Áreas: ____________ y ____________</div></div></div>';
    const lin = n => Array.from({ length: n }, () => '<div class="vd-l"></div>').join('');
    const p3 = '<div class="bt-pg"><div class="pr vd-p"><h2>4. Mi proyecto de vida</h2><h3>🎡 Rueda de la vida</h3><p class="tiny">Del 1 (nada) al 10 (mucho): ¿qué tan satisfecho estás hoy con cada área?</p><table class="vd-t">' + x.RUEDA.map(r => '<tr><td>' + esc(r) + '</td><td class="vd-esc">1 2 3 4 5 6 7 8 9 10</td></tr>').join('') + '</table>' +
      '<h3>💪 Mi FODA personal</h3><div class="vd-foda">' + [['Fortalezas', '¿qué hago bien?'], ['Oportunidades', '¿qué me puede ayudar?'], ['Debilidades', '¿qué me cuesta?'], ['Amenazas', '¿qué me puede frenar?']].map(q => '<div><b>' + q[0] + '</b> <span class="tiny">' + q[1] + '</span>' + lin(3) + '</div>').join('') + '</div>' +
      '<h3>🎯 Mis metas</h3>' + [['En 1 año', 2], ['En 3 años', 2], ['En 5 años', 2], ['Lo que haré ESTA semana', 2]].map(q => '<p class="tiny"><b>' + q[0] + '</b></p>' + lin(q[1])).join('') +
      '<p class="tiny vd-src">' + esc(x.FUENTE) + '</p></div></div>';
    E.print.run(p1 + p2 + p3, { title: 'Test de vida y carrera (impreso)', margin: '9mm' }); };
  A['vida-grupo'] = () => { const g = D.grupoActual(), x = X(), al = VD.con(g); if (!al.length) { u.toast('Todavía no registras resultados', 'err'); return; }
    E.print.run('<div class="pr vd-p"><h1>Perfiles del grupo ' + esc(g.nombre) + '</h1><p class="tiny">' + al.length + ' de ' + D.alumnos(g).length + ' alumnos · ' + esc(u.fLarga(u.today())) + '</p>' + resumenHTML(g, true) +
      '<table class="vd-t"><tr><th>No.</th><th>Alumno</th><th>Intereses</th><th>Fortalezas</th><th>Áreas de mecatrónica</th><th>Rol sugerido</th></tr>' + al.map(a => { const r = VD.res(g, a.id); return '<tr><td>' + a.num + '</td><td>' + esc(a.nombre) + '</td><td><b>' + hol(r.r) + '</b></td><td>' + r.h.map(i => esc(x.HAB[i].n)).join(', ') + '</td><td>' + r.a.map(i => esc(x.AREAS[i].n)).join(', ') + '</td><td>' + esc(x.HAB[r.h[0]].rol) + '</td></tr>'; }).join('') + '</table>' +
      '<p class="tiny vd-src">' + esc(x.FUENTE) + '</p></div>', { title: 'Perfiles del grupo ' + g.nombre }); };

  /* ---------- resumen del grupo ---------- */
  const barras = (L, max) => '<div class="vd-bars">' + L.map(b => '<div class="vd-b"><span>' + esc(b[0]) + '</span><span class="vd-bt"><i style="width:' + (max ? b[1] / max * 100 : 0) + '%"></i></span><b>' + b[1] + '</b></div>').join('') + '</div>';
  function resumenHTML(g, pr) {
    const x = X(), al = VD.con(g), res = al.map(a => VD.res(g, a.id)); if (!res.length) return '';
    const prim = x.RIASEC.map((r, i) => [r.k + ' · ' + r.n, res.filter(z => x.top(z.r, 1)[0] === i).length]);
    const ar = x.AREAS.map((a, i) => [a.ico + ' ' + a.n, res.filter(z => z.a.indexOf(i) >= 0).length]);
    const hb = x.HAB.map((h, i) => [h.n, res.filter(z => z.h.indexOf(i) >= 0).length]);
    const mx = L => Math.max.apply(null, L.map(b => b[1]));
    if (pr) { const tb = (t, L) => '<table class="vd-t vd-mini"><tr><th>' + t + '</th><th>Alumnos</th></tr>' + L.map(b => '<tr><td>' + esc(b[0]) + '</td><td>' + b[1] + '</td></tr>').join('') + '</table>'; return '<div class="vd-tres">' + tb('Interés principal', prim) + tb('Áreas de la mecatrónica', ar) + tb('Fortalezas', hb) + '</div>'; }
    return '<div class="vd-grid"><div><h4>Interés principal</h4>' + barras(prim, mx(prim)) + '</div><div><h4>Áreas de la mecatrónica que más les llaman</h4>' + barras(ar, mx(ar)) + '</div><div><h4>Fortalezas que más se repiten</h4>' + barras(hb, mx(hb)) + '</div></div>' +
      (pr ? '' : '<p class="small muted">Úsalo para elegir proyectos y ejemplos: si dominan Realista y Mecánica, más taller; si sale Artístico y CAD, retos de diseño; si sale Social, que expliquen a otros.</p>');
  }
  VD.fichaHTML = (g, a) => { const r = VD.res(g, a.id), x = X(); if (!r) return '';
    return card('<h3>🧭 Perfil de vida y carrera</h3><p class="vd-hol">' + hol(r.r) + '</p><p class="small">' + x.top(r.r, 3).map(i => '<b>' + x.RIASEC[i].n + '</b> (' + x.RIASEC[i].v.toLowerCase() + ')').join(' · ') + '</p>' +
      barras(x.RIASEC.map((z, i) => [z.k + ' · ' + z.n, r.r[i]]), 10) + '<p class="small"><b>Fortalezas:</b> ' + r.h.map(i => esc(x.HAB[i].n)).join(', ') + ' · <b>rol en equipo:</b> ' + esc(x.HAB[r.h[0]].rol) + '</p><p class="small"><b>Le llama de la mecatrónica:</b> ' + r.a.map(i => x.AREAS[i].ico + ' ' + esc(x.AREAS[i].n)).join(', ') + '</p>' +
      '<p class="small"><b>En mecatrónica le puede gustar:</b> ' + esc(x.RIASEC[x.top(r.r, 1)[0]].mec) + '</p><p class="muted small">' + (r.src === 'mano' ? 'Capturado del test impreso' : 'Del test en su celular') + ' · ' + esc(u.fCorta(r.f)) + '. Es una guía para conocerlo, no una etiqueta.</p>'); };
  if (V.alumno && E.fichaInsert) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h) && VD.res(g, a.id)) o.h = E.fichaInsert(o.h, VD.fichaHTML(g, a)); return o; }; }

  /* ---------- pantalla ---------- */
  V.vida = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); if (!X()) return { t: 'Test de vida y carrera', h: card('<p>No se cargó el test.</p>') };
    const al = D.alumnos(g), con = VD.con(g);
    let h = card('<h3>🧭 Test de vida y carrera</h3><p class="small">Para que se conozcan y descubran en qué son buenos. Son 4 partes (unos 20 a 25 minutos):</p><ol class="small"><li><b>Intereses</b>: 60 actividades de trabajo (modelo de Holland, RIASEC).</li><li><b>Habilidades y fortalezas</b>: 24 frases de autoevaluación.</li><li><b>Áreas de la mecatrónica</b>: qué parte de la carrera les llama más.</li><li><b>Proyecto de vida</b>: rueda de la vida, FODA personal y metas a 1, 3 y 5 años (se queda con el alumno).</li></ol>' +
      '<div class="row gap wrap">' + btn('📱 QR para los celulares', 'vida-qr', '', 'primary') + btn('🖨 Test impreso', 'vida-imp', '', '') + '</div>' +
      '<p class="muted small">Tip: hazlo en clase con calma y diles que no hay respuestas buenas ni malas. Después platiquen sus resultados en parejas: «¿te reconoces en tu código?».</p>');
    h += card('<h3>✅ Resultados del grupo</h3><p class="small">' + (al.length ? con.length + ' de ' + al.length + ' alumnos con resultados.' : 'Agrega a tus alumnos para registrar resultados.') + '</p>' +
      '<div class="row gap wrap">' + btn('✅ Registrar códigos', 'vida-reg', '', con.length ? '' : 'primary') + btn('✍️ Capturar impreso', 'vida-mano', '', 'ghost') + (con.length ? btn('👥 Equipos con perfiles mezclados', 'vida-eq', 'data-n="4"', '') + btn('🖨 Perfiles del grupo', 'vida-grupo', '', 'ghost') : '') + '</div>' +
      resumenHTML(g) + (con.length ? '<p class="small muted">El perfil de cada alumno aparece en su ficha.</p>' : ''));
    h += card('<h3>Fuentes</h3><ul class="small est-fuentes"><li><a href="https://www.onetcenter.org/IP.html" target="_blank" rel="noopener">O*NET Interest Profiler (USDOL/ETA)</a>: base de la parte de intereses; traducción y adaptación propias, no es la versión oficial.</li><li><a href="https://www.miproximopaso.org/explore/ip" target="_blank" rel="noopener">Mi Próximo Paso</a>: versión oficial gratuita en español, por si quieren hacerla completa en línea.</li><li>Habilidades, áreas de la mecatrónica y proyecto de vida: autoevaluaciones orientativas escritas para Escuadra (no son pruebas estandarizadas).</li></ul>');
    return { t: 'Test de vida y carrera', h: h };
  };
})();

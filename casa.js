/* Escuadra · Comunicar a casa (v1.24).
   1) Consulta para alumnos y padres: un enlace o QR por alumno que abre consulta.html con su calificación del parcial,
      el desglose, asistencia, lo que le falta y cuánto sube si lo entrega. Es una «foto» con fecha: los datos viajan dentro
      del enlace (después del #, que el navegador nunca manda a ningún servidor) y no llevan su nombre, solo su número de
      lista e iniciales. Nada se guarda en internet.
   2) Mensajes para WhatsApp a madres, padres o tutores de quienes van abajo: lo que debe, fecha límite y el enlace.
      El teléfono es opcional (se guarda solo en tus datos); sin él, WhatsApp te deja elegir el contacto.
   3) Repaso para casa: 5 preguntas de sus temas débiles (de su último examen o del grupo) en repaso.html, con QR. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, CH = E.changes, H = E.h;
  const card = H.card, btn = H.btn, link = H.link;
  const CA = E.casa = {};
  const corto = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  const minA = () => Number(D.cfg().minAprob) || 60;

  /* ---------- empaquetar datos en el enlace (deflate + base64url) ---------- */
  const b64 = bytes => { let s = ''; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  CA.empaca = async obj => {
    const txt = new TextEncoder().encode(JSON.stringify(obj));
    if (window.CompressionStream) {
      try { const cs = new Blob([txt]).stream().pipeThrough(new CompressionStream('deflate-raw')); const buf = new Uint8Array(await new Response(cs).arrayBuffer()); return 'z' + b64(buf); } catch (e) { }
    }
    return 'j' + b64(txt);
  };
  const base = pag => { const l = location.href.split('#')[0].split('?')[0]; return l.replace(/[^/]*$/, '') + pag; };
  CA.iniciales = n => { const x = u.partesNombre ? u.partesNombre(n) : null; const ps = x ? [x.nom.split(' ')[0], x.ap1, x.ap2].filter(Boolean) : String(n || '').split(/\s+/); return ps.map(p => p.charAt(0).toUpperCase() + '.').join(' '); };

  /* ---------- 1) consulta ---------- */
  CA.consultaDatos = (g, a, pid) => {
    const p = C.parcial(pid), cf = D.cfg(), k = C.cal(g, pid, a.id), as = C.asis(g, p, a.id), r = E.aprobar ? E.aprobar.analiza(g, pid, a.id) : null, w = cf.pond;
    return {
      v: 1, g: g.nombre, pl: cf.plantel || '', p: p.nombre, f: u.today(), n: a.num, i: CA.iniciales(a.nombre), c: k.final, ec: !!k.enCurso, ap: minA(),
      r: [['Examen', w.examen, k.comp.examen], ['Libreta, proyecto y bitácora', w.trabajos, k.comp.trabajos], ['Asistencia', w.asistencia, k.comp.asistencia], ['Participación', w.participacion, k.comp.participacion]].map(x => [x[0], Number(x[1] || 0), x[2] == null ? null : Math.round(x[2])]),
      as: [as.a, as.ses, as.fechasF.map(f => u.fCorta(f))],
      pe: r ? r.pend.slice(0, 6).map(x => [x.tipo, corto(x.t, 90), corto(x.det, 160), x.gain == null ? null : Math.round(x.gain * 10) / 10]) : [],
      to: r && r.todo != null ? Math.round(r.todo) : null, ne: r && r.nec != null ? r.nec : null, td: Math.round(C.tardeVale() * 100), cap: p.captura, d: cf.docente || ''
    };
  };
  CA.consultaURL = async (g, a, pid) => base('consulta.html') + '#' + await CA.empaca(CA.consultaDatos(g, a, pid));
  const tel = a => { const d = String(a.tel || '').replace(/\D/g, ''); return d.length === 10 ? '52' + d : d.length >= 11 ? d : ''; };
  CA.wa = (a, txt) => 'https://wa.me/' + tel(a) + '?text=' + encodeURIComponent(txt);
  CA.mensaje = (g, a, pid, url, limite) => {
    const p = C.parcial(pid), cf = D.cfg(), r = E.aprobar ? E.aprobar.analiza(g, pid, a.id) : null, k = C.cal(g, pid, a.id), nom = u.corto(a.nombre);
    const l = ['Buen día. Le escribe ' + (cf.docente || 'el docente') + ', docente del módulo de ' + (g.carrera ? u.cap(String(g.carrera).toLowerCase().replace(/^t[eé]cnico en /, '').replace(/\s+\d{4}$/, '')) : 'la carrera') + ' del grupo ' + g.nombre + (cf.plantel ? ' en el ' + cf.plantel : '') + '.',
      'Le comparto cómo va ' + nom + ' en el ' + p.nombre + ' al ' + u.fLarga(u.today()) + ': lleva ' + (k.final == null ? 'calificación pendiente' : k.final + (k.enCurso ? ' (en curso)' : '')) + '; se aprueba con ' + minA() + '.'];
    if (r && r.pend.length) { l.push('Le falta:'); r.pend.slice(0, 5).forEach(x => l.push('• ' + x.tipo + ': ' + corto(x.t, 90) + (x.gain != null ? ' (sube ' + (Math.round(x.gain * 10) / 10) + ')' : ''))); }
    if (r && r.todo != null && r.pend.length) l.push('Si entrega todo, puede llegar a ' + Math.round(r.todo) + '.');
    if (r && r.nec != null && r.nec > 0 && r.nec <= 100) l.push('En el examen necesita al menos ' + r.nec + '.');
    if (limite) l.push('Fecha límite para entregar: ' + u.fLarga(limite) + '. Lo entregado tarde vale ' + Math.round(C.tardeVale() * 100) + ' %.');
    if (url) l.push('Aquí puede ver el detalle (sin nombre, solo con su número de lista ' + a.num + '): ' + url);
    l.push('Quedo a sus órdenes por este medio o en la escuela. Gracias por su apoyo.');
    return l.join('\n');
  };

  /* ---------- 3) repaso para casa ---------- */
  const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const tTit = id => { const t = (E.TEMAS || []).find(x => x.id === id); return t ? t.titulo : id; };
  CA.temasDebiles = (g, a) => {
    const hoy = u.today(); let vis = {}; try { vis = E.repaso ? E.repaso.vistos(g, u.addDays(hoy, 1)) : {}; } catch (e) { vis = {}; }
    const conB = t => (E.BANCO || []).some(b => b.tema === t && b.tipo !== 'ab');
    let fuente = 'tu último examen', sc = {};
    if (E.examen && a) { const xs = E.examen.list(g).filter(ex => (ex.res || {})[a.id] && E.examen.puntaje(ex, a.id) != null); if (xs.length) { const r = E.examen.analisis(g, xs[0]), me = r && r.alumnos[a.id]; if (me) Object.keys(me.temas).forEach(t => { sc[t] = me.temas[t]; }); } }
    if (!Object.keys(sc).filter(conB).length) { fuente = 'cómo va el grupo'; sc = E.repaso ? E.repaso.debil(g) : {}; }
    let ts = Object.keys(sc).filter(conB).sort((x, y) => sc[x] - sc[y]).filter(t => sc[t] < 0.8);
    if (!ts.length) { fuente = 'lo que vieron en las últimas semanas'; ts = Object.keys(vis).filter(conB).sort((x, y) => String(vis[y].fin).localeCompare(String(vis[x].fin))); }
    return { ts: ts.slice(0, 3), fuente: fuente };
  };
  CA.repasoDatos = (g, a) => {
    const td = CA.temasDebiles(g, a); if (!td.ts.length || !E.ejer) return null;
    const rnd = rng(hash(g.id + '|casa|' + (a ? a.id : 'g') + '|' + u.today())), qs = [], por = td.ts.length === 1 ? [5] : td.ts.length === 2 ? [3, 2] : [2, 2, 1];
    td.ts.forEach((t, i) => {
      const c = (E.BANCO || []).filter(b => b.tema === t && b.tipo !== 'ab').map(b => ({ b: b, r: rnd() })).sort((x, y) => (x.b.niv || 2) - (y.b.niv || 2) + (x.r - y.r)).slice(0, por[i] || 1);
      c.forEach(x => { const q = E.ejer.pregunta(x.b, rnd); if (q && q.opts) qs.push([corto(q.q, 320), q.opts.map(o => corto(o, 120)), q.ok, corto(q.a || '', 220), tTit(t)]); });
    });
    if (!qs.length) return null;
    return { v: 1, k: 'rep', g: g.nombre, n: a ? a.num : null, f: u.today(), fu: td.fuente, q: qs.slice(0, 5) };
  };
  CA.repasoURL = async (g, a) => { const d = CA.repasoDatos(g, a); return d ? base('repaso.html') + '#' + await CA.empaca(d) : null; };

  /* ---------- modales ---------- */
  const qrBox = (url, txt) => '<div class="ca-qr">' + (E.cam ? E.cam.qrSVG(url, 'ca-qrsvg', 'L') : '') + '<p class="small muted">' + txt + '</p></div>';
  const listo = async () => { if (E.cam && E.cam.qrListo) await E.cam.qrListo(); };
  A['ca-consulta'] = async el => {
    const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid), pid = el.dataset.pid || C.parcialActual().id; if (!a) return;
    await listo(); const url = await CA.consultaURL(g, a, pid); E.ui.caUrl = url;
    E.modal.open('🔗 Consulta de ' + u.corto(a.nombre), qrBox(url, 'Foto de hoy (' + u.fCorta(u.today()) + ') de su ' + C.parcial(pid).nombre + ': no lleva su nombre, solo No. ' + a.num + ' e iniciales. Si cambian sus calificaciones, genera otra.') +
      '<div class="row gap wrap">' + btn('📋 Copiar enlace', 'ca-copiar', '', 'primary') + '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Abrir</a>' + btn('💬 WhatsApp a casa', 'ca-wa', 'data-aid="' + a.id + '" data-pid="' + pid + '"') + '</div>');
  };
  A['ca-copiar'] = async () => { const ok = await u.copy(E.ui.caUrl || ''); u.toast(ok ? 'Enlace copiado' : 'No se pudo copiar', ok ? 'ok' : 'err'); };
  A['ca-wa'] = async el => {
    const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid), pid = el.dataset.pid || C.parcialActual().id; if (!a) return;
    const lim = (document.getElementById('ca-lim') || {}).value || E.ui.caLim || '';
    const url = await CA.consultaURL(g, a, pid), txt = CA.mensaje(g, a, pid, url, lim);
    window.open(CA.wa(a, txt), '_blank', 'noopener');
    S.update('casaLog:' + g.id, d => { (d[a.id] = d[a.id] || []).push(u.today()); }, {});
  };
  A['ca-repaso'] = async el => {
    const g = D.grupoActual(), a = el.dataset.aid ? D.alumno(g, el.dataset.aid) : null;
    await listo(); const url = await CA.repasoURL(g, a); if (!url) { u.toast('Todavía no hay temas con preguntas en el banco para armar el repaso', 'err', 4000); return; }
    E.ui.caUrl = url; const td = CA.temasDebiles(g, a);
    E.modal.open('🏠 Repaso para casa' + (a ? ' · ' + u.corto(a.nombre) : ' · todo el grupo'), qrBox(url, '5 preguntas de ' + esc(td.ts.map(tTit).join(', ')) + ' (según ' + td.fuente + '). Se contestan en el celular; no se manda nada a ningún lado.') +
      '<div class="row gap wrap">' + btn('📋 Copiar enlace', 'ca-copiar', '', 'primary') + '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Probar</a>' + (a ? '' : btn('📽 Proyectar QR', 'ca-proj', '', '')) + '</div>');
  };
  A['ca-proj'] = () => { if (!E.proj || !E.ui.caUrl) return; E.modal.close(); E.proj.abrir({ id: 'casa-qr', titulo: 'Repaso para casa' }, [{ k: 'html', h: '🏠 Repaso para casa', html: '<div class="pj-qrbox">' + E.cam.qrSVG(E.ui.caUrl, 'pj-qr', 'L') + '<div><p>Escanea el código con tu celular y contesta las 5 preguntas en casa.</p><p>Al final te dice cuántas tuviste bien y por qué.</p></div></div>' }]); };

  /* ---------- en la ficha del alumno ---------- */
  CA.alumnoHTML = (g, a) => {
    const pid = C.parcialActual().id, lg = (S.get('casaLog:' + g.id) || {})[a.id] || [];
    return card('<h3>👪 Comunicar a casa</h3><p class="muted small">Consulta con QR o enlace (sin nombre), mensaje de WhatsApp a su madre, padre o tutor(a) y repaso de sus temas débiles.</p>' +
      '<label class="fld"><span>WhatsApp de su madre, padre o tutor(a) (opcional, 10 dígitos)</span><input id="al-tel" inputmode="tel" value="' + esc(a.tel || '') + '" data-ch="alumno-f" data-aid="' + a.id + '" data-f="tel" placeholder="Ej. 4761234567"></label>' +
      '<div class="row gap wrap">' + btn('🔗 Consulta (QR)', 'ca-consulta', 'data-aid="' + a.id + '" data-pid="' + pid + '"', 'small primary') + btn('💬 WhatsApp a casa', 'ca-wa', 'data-aid="' + a.id + '" data-pid="' + pid + '"', 'small') + btn('🏠 Repaso para casa', 'ca-repaso', 'data-aid="' + a.id + '"', 'small') + '</div>' +
      (lg.length ? '<p class="muted small">Mensajes a casa: ' + lg.slice(-5).map(f => u.fCorta(f)).join(', ') + '.</p>' : ''));
  };
  E.fichaInsert = (h, extra) => { const i = h.indexOf('<label class="fld"><span>Nombre</span>'), j = i >= 0 ? h.lastIndexOf('<section', i) : -1; return j >= 0 ? h.slice(0, j) + extra + h.slice(j) : h + extra; };
  if (V.alumno) { const va = V.alumno; V.alumno = function (id) { const o = va.apply(null, arguments), g = D.grupoActual(), a = g && D.alumno(g, id); if (o && a && !/Algo falló/.test(o.h)) o.h = E.fichaInsert(o.h, CA.alumnoHTML(g, a)); return o; }; }

  /* ---------- en Para aprobar: mensajes para los que van abajo ---------- */
  CA.abajo = (g, pid) => D.alumnos(g).map(a => ({ a: a, r: E.aprobar.analiza(g, pid, a.id) })).filter(x => x.r && x.r.final != null && (x.r.exPend && x.r.nec != null ? x.r.nec > 80 : x.r.final < minA() + 5)).sort((x, y) => x.r.final - y.r.final);
  if (V.aprobar && E.aprobar) {
    const vp = V.aprobar;
    V.aprobar = function (pid) {
      const o = vp.apply(null, arguments), g = D.grupoActual(); if (!o || !g || /Algo falló|Primero importa/.test(o.h)) return o;
      pid = D.parciales().some(p => p.id === pid) ? pid : C.parcialActual().id; const L = CA.abajo(g, pid); if (!L.length) return o;
      const p = C.parcial(pid), def = E.ui.caLim || (u.addDays(p.fin, -3) > u.today() ? u.addDays(p.fin, -3) : u.addDays(u.today(), 3)), lg = S.get('casaLog:' + g.id) || {};
      const i = o.h.indexOf('<section', o.h.indexOf('<section') + 1);
      const c = card('<h3>💬 Avisar a casa</h3><p class="muted small">Un mensaje de WhatsApp por alumno con lo que debe, cuánto sube y el enlace a su consulta (sin nombre). Se abre WhatsApp con el texto listo; tú lo revisas y lo mandas.</p>' +
        '<label class="fld"><span>Fecha límite para entregar</span><input type="date" id="ca-lim" value="' + def + '" data-ch="ca-lim"></label><ul class="ap-list">' +
        L.map(x => '<li><div><b>' + x.a.num + '. ' + esc(x.a.nombre) + '</b><br><small class="muted">' + (x.r.pend.length ? x.r.pend.length + (x.r.pend.length === 1 ? ' pendiente' : ' pendientes') : 'sin pendientes registrados') + (x.a.tel ? '' : ' · sin teléfono (eliges el contacto)') + ((lg[x.a.id] || []).length ? ' · último aviso ' + u.fCorta(lg[x.a.id].slice(-1)[0]) : '') + '</small></div><div class="ap-r"><span class="g ' + H.gclass(x.r.final) + '">' + Math.round(x.r.final) + '</span>' + btn('💬', 'ca-wa', 'data-aid="' + x.a.id + '" data-pid="' + pid + '" aria-label="WhatsApp"', 'small') + btn('🔗', 'ca-consulta', 'data-aid="' + x.a.id + '" data-pid="' + pid + '" aria-label="Consulta con QR"', 'small ghost') + '</div></li>').join('') + '</ul>');
      o.h = i > 0 ? o.h.slice(0, i) + c + o.h.slice(i) : o.h + c;
      return o;
    };
  }
  CH['ca-lim'] = el => { E.ui.caLim = el.value; };

  /* ---------- v1.27.19: avisar a casa desde el pase de lista (faltas del día) ---------- */
  CA.faltasDia = (g, f) => {
    const doc = S.get('asis:' + g.id + ':' + f); if (!doc) return [];
    const amb = C.ambito(f);
    return D.alumnos(g).filter(a => C.marca(doc, a.id, amb) === 'F');
  };
  const msgFalta = (g, a, f) => 'Buen día. Le escribe ' + (D.cfg().docente || 'su docente') + ', del grupo ' + g.nombre + '. Le informo que ' + u.corto(a.nombre) + ' no asistió a clase el ' + u.fLarga(f) + '. Si hay un motivo, le agradezco avisarme para registrarlo como justificada. Gracias.';
  A['lista-avisar'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, fa = CA.faltasDia(g, f);
    if (!fa.length) { u.toast('No hay faltas registradas en este día', 'ok', 2200); return; }
    E.modal.open('💬 Avisar a casa · ' + u.cap(u.fLarga(f)), '<p class="muted small">Un mensaje de WhatsApp por alumno que faltó. Se abre WhatsApp con el texto listo; tú lo revisas y lo mandas.</p><ul class="ap-list">' +
      fa.map(a => '<li><div><b>' + a.num + '. ' + esc(a.nombre) + '</b><br><small class="muted">' + ((S.get('avisos:' + g.id + ':' + f) || {})[a.id] ? '✅ Ya abriste WhatsApp · ' : '') + (a.tel ? 'WhatsApp registrado' : 'sin teléfono (eliges el contacto)') + '</small></div>' + btn('💬 WhatsApp', 'lista-wa', 'data-aid="' + a.id + '" data-f="' + f + '"', 'small primary') + '</li>').join('') + '</ul>');
  };
  A['lista-wa'] = el => {
    const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid); if (!a) return;
    window.open(CA.wa(a, msgFalta(g, a, el.dataset.f)), '_blank', 'noopener');
    S.update('avisos:' + g.id + ':' + el.dataset.f, d => { d[a.id] = true; }, {});
  };

  /* ---------- v1.27.21: aviso a casa por retardos acumulados ---------- */
  // retardos de cada alumno en el parcial (cada clase de 50 min cuenta, igual que en la asistencia)
  CA.retardosParcial = (g, p) => {
    const tot = {}; if (!g || !p) return tot; const al = D.alumnos(g);
    C.fechasRegistradas(g, p).forEach(fd => { const doc = S.get('asis:' + g.id + ':' + fd) || {}; C.clasesCuenta(g, fd).forEach(k => { al.forEach(a => { if (C.marca(doc, a.id, k) === 'R') tot[a.id] = (tot[a.id] || 0) + 1; }); }); });
    return tot;
  };
  // pendientes: con N = Ajustes → avisoRetardos (0 = no avisar), toca aviso al llegar a N retardos y de nuevo en cada múltiplo de N
  CA.retardosPend = (g, f) => {
    const N = Number(D.cfg().avisoRetardos) || 0, p = C.parcialActual(f || u.today());
    if (!g || !p || N <= 0) return [];
    const tot = CA.retardosParcial(g, p), av = S.get('avisosR:' + g.id + ':' + p.id) || {};
    return D.alumnos(g).filter(a => (tot[a.id] || 0) >= N && Math.floor(tot[a.id] / N) > Math.floor((av[a.id] || 0) / N)).map(a => ({ a: a, n: tot[a.id] }));
  };
  const msgRet = (g, a, n, p) => 'Buen día. Le escribe ' + (D.cfg().docente || 'su docente') + ', del grupo ' + g.nombre + '. Le informo que ' + u.corto(a.nombre) + ' lleva ' + n + (n === 1 ? ' retardo' : ' retardos') + ' en el ' + p.nombre + '. Le pido su apoyo para que llegue puntual a clase. Quedo a sus órdenes. Gracias.';
  A['lista-retardos'] = el => {
    const g = D.grupoActual(), f = el.dataset.f, p = C.parcialActual(f), lst = CA.retardosPend(g, f);
    if (!lst.length) { u.toast('No hay retardos pendientes de avisar', 'ok', 2200); return; }
    E.modal.open('⏰ Avisar por retardos · ' + p.nombre, '<p class="muted small">Cada ' + Number(D.cfg().avisoRetardos) + ' retardos del parcial toca un aviso. Se abre WhatsApp con el texto listo; tú lo revisas y lo mandas.</p><ul class="ap-list">' +
      lst.map(x => '<li><div><b>' + x.a.num + '. ' + esc(x.a.nombre) + '</b><br><small class="muted">' + x.n + (x.n === 1 ? ' retardo' : ' retardos') + ' en el parcial · ' + (x.a.tel ? 'WhatsApp registrado' : 'sin teléfono (eliges el contacto)') + '</small></div>' + btn('💬 WhatsApp', 'lista-retardos-wa', 'data-aid="' + x.a.id + '" data-pid="' + p.id + '"', 'small') + '</li>').join('') + '</ul>');
  };
  A['lista-retardos-wa'] = el => {
    const g = D.grupoActual(), a = D.alumno(g, el.dataset.aid), p = C.parcial(el.dataset.pid); if (!a || !p) return;
    const n = CA.retardosParcial(g, p)[a.id] || 0;
    window.open(CA.wa(a, msgRet(g, a, n, p)), '_blank', 'noopener');
    S.update('avisosR:' + g.id + ':' + p.id, d => { d[a.id] = n; }, {});
  };

  /* ---------- v1.27.20: faltas sin avisar a casa (Pendientes y aviso en el cierre) ---------- */
  CA.faltasSinAvisar = (g, f) => { const av = S.get('avisos:' + g.id + ':' + f) || {}; return CA.faltasDia(g, f).filter(a => !av[a.id]); };
  if (V.cierre) { const vc = V.cierre; V.cierre = function (f) {
    const o = vc.apply(null, arguments), g = D.grupoActual(), hoy = u.today();
    const ff = f || (g && (E.cierre.pendientes(g, hoy)[0] || (C.esClase(g, hoy) ? hoy : C.claseAnterior(g, hoy) || hoy)));
    const n = g && o && !/Algo falló/.test(o.h) ? CA.faltasSinAvisar(g, ff).length : 0;
    if (n) o.h = card('<p class="note warn">📨 Faltas sin avisar a casa: ' + n + (n === 1 ? ' alumno' : ' alumnos') + ' · ' + link('Avisar ahora', 'lista/' + ff, 'small') + '</p>') + o.h;
    return o; }; }

  /* ---------- en Imprimir: tiras con QR para todo el grupo ---------- */
  A['ca-tiras'] = async el => {
    const g = D.grupoActual(), pid = el.dataset.pid || C.parcialActual().id, p = C.parcial(pid), tipo = el.dataset.t; await listo(); u.toast('Preparando…', 'ok', 1500);
    const al = D.alumnos(g), out = [];
    for (const a of al) {
      const url = tipo === 'rep' ? await CA.repasoURL(g, a) : await CA.consultaURL(g, a, pid); if (!url) continue;
      out.push('<div class="ca-tira">' + E.cam.qrSVG(url, 'ca-tqr', 'L') + '<div><b>No. ' + a.num + '</b> · ' + esc(u.corto(a.nombre)) + '<br><span class="tiny">' + esc(g.nombre) + ' · ' + (tipo === 'rep' ? 'Repaso para casa: escanea y contesta 5 preguntas de tus temas débiles.' : esc(p.nombre) + ': escanea para ver tu calificación y lo que te falta (al ' + u.fCorta(u.today()) + ').') + '</span></div></div>');
    }
    if (!out.length) { u.toast('No hay preguntas en el banco para armar el repaso', 'err'); return; }
    E.print.run('<div class="pr ca-tiras">' + out.join('') + '</div>', { title: (tipo === 'rep' ? 'Repaso para casa · ' : 'Consulta · ') + g.nombre, margin: '8mm', sinLogo: true });
  };
  if (V.imprimir) {
    const vi = V.imprimir;
    V.imprimir = function () {
      const o = vi.apply(null, arguments), g = D.grupoActual(); if (!o || !g || !D.alumnos(g).length || /Algo falló/.test(o.h)) return o;
      const pid = (E.ui.print && E.ui.print.pid) || C.parcialActual().id;
      o.h += card('<h3>👪 Para llevar a casa</h3><p class="muted small">Tiras con QR, una por alumno, para recortar: su consulta del parcial (sin nombre en el enlace) o un repaso de 5 preguntas de sus temas débiles.</p><div class="row gap wrap">' + btn('🖨 Tiras de consulta (QR)', 'ca-tiras', 'data-pid="' + pid + '" data-t="con"', 'primary') + btn('🖨 Tiras de repaso para casa (QR)', 'ca-tiras', 'data-t="rep"') + btn('🏠 Repaso del grupo (un solo QR)', 'ca-repaso', '', 'ghost') + '</div>');
      return o;
    };
  }
})();

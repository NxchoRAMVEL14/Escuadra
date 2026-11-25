/* Escuadra · v1.46.0 · Paquete 3 (alumnos)
   17) Repaso antes del examen: para cada examen de las próximas 3 semanas, 3 rondas por QR (7 días antes, 3 días antes y
       el día anterior) con preguntas de los temas que entran, primero lo que más le cuesta al grupo; la última ronda es un
       simulacro. Repasar varias veces y separado en el tiempo funciona mejor que estudiar todo la noche anterior
       (efecto de espaciado: Cepeda y col., 2006; práctica de recuperación: Roediger y Karpicke, 2006). Usa repaso.html.
   18) Portafolio del proyecto: una carpeta imprimible por equipo con su proyecto, integrantes, etapas (meta, cuándo la
       cerraron), las fotos de evidencias de sus integrantes durante el proyecto y una hoja de reflexión para llenar. */
(function () {
  'use strict';
  const E = window.E, u = E.u, S = E.store, D = E.data, C = E.calc, esc = u.esc;
  const V = E.views, A = E.actions, H = E.h, card = H.card, btn = H.btn, link = H.link;
  const RX = E.repex = {};
  const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const corto = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  const tit = id => { const t = (E.TEMAS || []).find(x => x.id === id); return t ? t.titulo : id; };
  const base = pag => location.href.split('#')[0].split('?')[0].replace(/[^/]*$/, '') + pag;
  const conB = t => (E.BANCO || []).some(b => b.tema === t && b.tipo !== 'ab');

  /* ---------- 17 · repaso antes del examen ---------- */
  RX.RONDAS = [{ n: 1, d: 7, t: 'Repaso 1 · lo básico', q: 6, niv: 2 }, { n: 2, d: 3, t: 'Repaso 2 · a practicar', q: 8, niv: 3 }, { n: 3, d: 1, t: 'Repaso 3 · simulacro', q: 10, niv: 9 }];
  RX.examenes = (g, hoy) => {
    hoy = hoy || u.today(); const hasta = u.addDays(hoy, 21), out = [], X = E.examen;
    if (X && X.list) X.list(g).forEach(ex => { if (!ex.fecha || ex.fecha < hoy || ex.fecha > hasta) return;
      let ts = (ex.items || []).map(it => { const b = (E.BANCO || []).find(x => x.id === it.id); return b && b.tema; }).filter(Boolean);
      if (!ts.length && X.temasVistos) ts = Object.keys(X.temasVistos(g, ex.parcial, ex.fecha));
      out.push({ id: ex.id, t: ex.titulo || 'Examen', f: ex.fecha, ts: Array.from(new Set(ts)).filter(conB) }); });
    D.parciales().forEach(p => C.acts(g, p.id).forEach(a => { if ((a.categoria !== 'examen' && !a.examen) || !a.fecha || a.fecha < hoy || a.fecha > hasta || out.some(o => o.f === a.fecha)) return;
      const ts = X && X.temasVistos ? Object.keys(X.temasVistos(g, p.id, a.fecha)).filter(conB) : []; out.push({ id: a.id, t: a.nombre, f: a.fecha, ts: ts }); }));
    return out.filter(x => x.ts.length).sort((a, b) => (a.f < b.f ? -1 : 1));
  };
  RX.rondas = (ex, hoy) => { hoy = hoy || u.today(); return RX.RONDAS.map(r => { const f = u.addDays(ex.f, -r.d); return Object.assign({}, r, { f: f, est: f < hoy ? 'paso' : f === hoy ? 'hoy' : 'viene' }); }); };
  RX.toca = (ex, hoy) => { const rs = RX.rondas(ex, hoy); return rs.find(r => r.est === 'hoy') || (ex.f >= (hoy || u.today()) ? rs.filter(r => r.est === 'paso').slice(-1)[0] : null) || null; };
  RX.datos = (g, ex, r) => {
    if (!E.ejer) return null; const deb = E.examen && E.examen.debilidad ? E.examen.debilidad(g) : {};
    const ts = ex.ts.slice().sort((a, b) => (deb[a] == null ? 0.7 : deb[a]) - (deb[b] == null ? 0.7 : deb[b])), rnd = rng(hash(g.id + '|rx|' + ex.id + '|' + r.n));
    const pools = ts.map(t => (E.BANCO || []).filter(b => b.tema === t && b.tipo !== 'ab' && (b.niv || 2) <= r.niv).map(b => ({ b: b, k: rnd() })).sort((x, y) => x.k - y.k).map(x => x.b));
    const qs = []; let i = 0, vueltas = 0;
    while (qs.length < r.q && vueltas < 40) { const pl = pools[i % pools.length]; const b = pl && pl.shift(); if (b) { const q = E.ejer.pregunta(b, rnd); if (q && q.opts) qs.push([corto(q.q, 200), q.opts.map(o => corto(o, 90)), q.ok, corto(q.a || '', 150), tit(b.tema)]); } i++; if (i % pools.length === 0) vueltas++; }
    if (!qs.length) return null;
    return { v: 1, k: 'rep', g: g.nombre, n: null, f: u.today(), fu: r.t + ' para «' + ex.t + '» (' + u.fCorta(ex.f) + ')', q: qs, c: E.casa && E.casa.sal ? E.casa.sal(g, 'g', u.today()) : '', ts: ts };
  };
  A['rx-qr'] = async el => {
    const g = D.grupoActual(), ex = RX.examenes(g).find(x => x.id === el.dataset.ex), r = ex && RX.rondas(ex).find(x => x.n === Number(el.dataset.n)); if (!r) return;
    const d = RX.datos(g, ex, r); if (!d) { u.toast('No hay preguntas en el banco para esos temas', 'err', 3500); return; }
    if (E.casa && E.casa.anotaGen) E.casa.anotaGen(g, d.f, 'g', d.ts, d.q.length); const pq = Object.assign({}, d); delete pq.ts;
    const url = base('repaso.html') + '#' + await E.casa.empaca(pq); E.ui.rxUrl = url; E.ui.rxT = r.t + ' · ' + ex.t; E.ui.rxN = d.q.length;
    if (E.cam && E.cam.qrListo) await E.cam.qrListo();
    E.modal.open('📚 ' + esc(r.t), '<p class="small">' + d.q.length + ' preguntas para <b>' + esc(ex.t) + '</b> (' + u.fLarga(ex.f) + ') de: ' + esc(Array.from(new Set(d.q.map(x => x[4]))).join(', ')) + '.</p><div class="c">' + E.cam.qrSVG(url, 'pj-qr', 'L') + '</div><div class="row gap wrap mt">' + btn('📋 Copiar enlace', 'rx-copiar', '', 'primary') + btn('📽 Proyectar', 'rx-proj') + '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Probar</a></div><p class="small muted">Mándalo por WhatsApp al grupo o proyéctalo. Se contesta en el celular y al final da un código de 4 dígitos.</p>');
  };
  A['rx-copiar'] = () => { if (E.ui.rxUrl) { (navigator.clipboard ? navigator.clipboard.writeText('📚 ' + E.ui.rxT + ': ' + E.ui.rxUrl) : Promise.reject()).then(() => u.toast('Enlace copiado', 'ok')).catch(() => u.toast('No se pudo copiar', 'err')); } };
  A['rx-proj'] = () => { if (!E.proj || !E.ui.rxUrl) return; E.modal.close(); E.proj.abrir({ id: 'rx-qr', titulo: E.ui.rxT }, [{ k: 'html', h: '📚 ' + esc(E.ui.rxT), html: '<div class="pj-qrbox">' + E.cam.qrSVG(E.ui.rxUrl, 'pj-qr', 'L') + '<div><p>Escanea y contesta las ' + E.ui.rxN + ' preguntas.</p><p>Repasar unos minutos varios días antes funciona mejor que estudiar todo la noche anterior.</p></div></div>' }]); };
  const rondasHTML = ex => '<div class="rx-r">' + RX.rondas(ex).map(r => '<div class="rx-c ' + r.est + '"><b>' + esc(r.t) + '</b><small>' + (r.est === 'hoy' ? 'hoy' : u.fCorta(r.f)) + ' · ' + r.q + ' preguntas</small>' + btn(r.est === 'hoy' ? '📲 QR de hoy' : 'QR', 'rx-qr', 'data-ex="' + ex.id + '" data-n="' + r.n + '"', 'small' + (r.est === 'hoy' ? ' primary' : '')) + '</div>').join('') + '</div>';
  V.repasoexamen = () => {
    const g = D.grupoActual(); if (!g) return H.noGroup(); const L = RX.examenes(g);
    let h = card('<h3>📚 Repaso antes del examen</h3><p class="small">Para cada examen de las próximas 3 semanas: 3 rondas cortas por QR (7 días antes, 3 días antes y el día anterior) con los temas que entran, primero los que más le cuestan al grupo; la última es un simulacro. Repasar varias veces separado en el tiempo funciona mejor que estudiar todo un día antes.</p>');
    h += L.length ? L.map(ex => card('<h3>📝 ' + esc(ex.t) + '</h3><p class="small muted">' + u.fLarga(ex.f) + ' · temas: ' + esc(ex.ts.map(tit).join(', ')) + '</p>' + rondasHTML(ex))).join('') : card('<p class="muted">No hay exámenes con fecha en las próximas 3 semanas. Ponle fecha al examen en Examen (o a la actividad de examen) y aquí aparecen sus repasos.</p>' + link('Ir a Examen', 'examen', 'small'));
    return { t: 'Repaso antes del examen', h: h };
  };
  RX.inicioHTML = g => { const hoy = u.today(), L = RX.examenes(g, hoy).filter(ex => u.diffDays(hoy, ex.f) <= 8); if (!L.length) return '';
    return card('<div class="row between gap wrap"><h3>📚 Repaso antes del examen</h3>' + link('Ver', 'repasoexamen', 'small') + '</div>' + L.map(ex => { const r = RX.toca(ex, hoy), dd = u.diffDays(hoy, ex.f); return '<p class="small"><b>' + esc(ex.t) + '</b> ' + (dd === 0 ? 'es hoy' : 'en ' + dd + (dd === 1 ? ' día' : ' días')) + (r ? ' · ' + (r.est === 'hoy' ? 'hoy toca ' : 'puedes mandar ') + esc(r.t) + ' ' + btn('📲 QR', 'rx-qr', 'data-ex="' + ex.id + '" data-n="' + r.n + '"', 'small' + (r.est === 'hoy' ? ' primary' : '')) : '') + '</p>'; }).join('')); };
  if (V.inicio) { const vi = V.inicio; V.inicio = function () { const o = vi.apply(null, arguments); const g = D.grupoActual(); if (!o || !o.h || !g) return o; let c = ''; try { c = RX.inicioHTML(g); } catch (e) { } if (c) { const m = o.h.indexOf('md-t'), i = m > 0 ? o.h.indexOf('</section>', m) + 10 : o.h.indexOf('</section>') + 10; o.h = i > 9 ? o.h.slice(0, i) + c + o.h.slice(i) : c + o.h; } return o; }; }
  if (V.espaciado) { const ve = V.espaciado; V.espaciado = function () { const o = ve.apply(null, arguments), g = D.grupoActual(); if (o && o.h && g) o.h = card('<div class="row between gap wrap"><div><h3>📚 Repaso antes del examen</h3><p class="small muted">3 rondas por QR antes de cada examen.</p></div>' + link('Abrir', 'repasoexamen', 'small primary') + '</div>') + o.h; return o; }; }

  /* ---------- 18 · portafolio del proyecto (por equipo) ---------- */
  RX.portafolio = async (g, pid, eqId) => {
    const PJ = E.proyecto, doc = PJ.doc(g, pid), eq = (doc.equipos || []).find(e => e.id === eqId); if (!eq) return null;
    const def = PJ.def(g, pid) || { nombre: 'Proyecto' }, ms = PJ.metas(g, pid) || [], st = ((doc.etapas || {})[eq.id]) || {}, mi = (eq.al || []).map(id => D.alumno(g, id)).filter(Boolean);
    const ps = D.parciales(), i0 = ps.findIndex(p => p.id === pid), desde = (ps[i0] || {}).inicio || '', sig = ps.slice(i0 + 1).find(p => E.clases.smKey(g, p.id) === E.clases.smKey(g, pid)), hasta = (sig || ps[i0] || {}).fin || u.today();
    const its = (((S.get('evid:' + g.id) || {}).items) || []).filter(x => x && x.id && !x.borrada).filter(it => it.f >= desde && it.f <= hasta && (it.aids || []).some(a => (eq.al || []).indexOf(a) >= 0)).sort((a, b) => (a.f < b.f ? -1 : 1)).slice(0, 12);
    const fotos = []; for (const it of its) { let x = null; try { x = await E.evid.url(it, false); } catch (e) { } if (x) fotos.push({ u: x, f: it.f, n: it.nota }); }
    const cf = D.cfg(), proy = PJ.proyDe(g, pid, eq) || def.nombre;
    let h = '<div class="pr pp-pr"><div class="pp-port"><p class="pp-k">Portafolio del proyecto</p><h1>' + esc(proy) + '</h1><h2>' + esc(eq.nombre) + '</h2><p>' + mi.map(a => esc(a.nombre)).join('<br>') + '</p><p class="pp-s">' + esc((cf.plantel || 'CETAC 19') + ' · ' + g.nombre + (g.modulo ? ' · Módulo ' + g.modulo : '') + ' · ' + (cf.docente || '')) + '<br>' + u.fLarga(u.today()) + '</p></div></div>';
    h += '<div class="pr pp-pr"><h3>Etapas del proyecto</h3><table class="fs-t"><tr><th>#</th><th>Etapa</th><th>Meta</th><th>Estado</th><th>Cerrada</th></tr>' + ms.map((m, i) => { const s = st[m.id] || {}; return '<tr><td>' + (i + 1) + '</td><td>' + esc(m.t) + '</td><td>' + (m.f ? u.fCorta(m.f) : '—') + '</td><td>' + (s.st === 'ok' ? '✓ Lista' : s.st === 'proc' ? 'En proceso' : 'Pendiente') + '</td><td>' + (s.st === 'ok' && s.f ? u.fCorta(s.f) : '') + '</td></tr>'; }).join('') + '</table>' +
      (eq.nota ? '<p><b>Notas del equipo:</b> ' + esc(eq.nota) + '</p>' : '') +
      (fotos.length ? '<h3>Evidencias</h3><div class="pp-fotos">' + fotos.map(f => '<figure><img src="' + f.u + '" alt=""><figcaption>' + u.fCorta(f.f) + (f.n ? ' · ' + esc(f.n) : '') + '</figcaption></figure>').join('') + '</div>' : '<p class="fs-sub">Sin fotos de evidencias de este equipo en el periodo del proyecto.</p>') + '</div>';
    h += '<div class="pr pp-pr"><h3>Reflexión del equipo</h3>' + ['¿Qué construimos y cómo funciona?', '¿Qué problema tuvimos y cómo lo resolvimos?', '¿Qué aprendí yo? (cada integrante)', '¿Qué haríamos diferente la próxima vez?'].map(q => '<p class="pp-q">' + q + '</p><div class="pp-lin"></div>').join('') + '</div>';
    return h;
  };
  A['pp-imp'] = async el => { const g = D.grupoActual(); const h = await RX.portafolio(g, el.dataset.pid, el.dataset.eq); if (h) E.print.run(h, { title: 'Portafolio del proyecto' }); };
  if (V.proyecto) { const vp = V.proyecto; V.proyecto = function () { const o = vp.apply(null, arguments); if (o && o.h) o.h = o.h.replace(/(<input data-ch="pj-nota" data-pid="([^"]+)" data-eq="([^"]+)"[^>]*><\/label>)/g, (m, all, pid, eq) => all + '<div class="row gap mt">' + btn('📁 Portafolio del equipo', 'pp-imp', 'data-pid="' + pid + '" data-eq="' + eq + '"', 'small') + '</div>'); return o; }; }
})();
